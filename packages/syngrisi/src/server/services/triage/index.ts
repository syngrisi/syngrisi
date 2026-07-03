/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { Check, App, Test, Suite } from '@models';
import { accept } from '@services/check.service';
import log from '@lib/logger';
import { env } from '@/server/envConfig';
import { buildTriageInput } from './analysis.service';
import { buildSystemPrompt, substitutePlaceholders } from './prompt';
import { createProvider } from './factory';
import { getProviderConfig, isTriageEnabled } from './config';
import { shouldAutoAccept } from './policy';
import { shouldRetryTriage, canBackgroundDrain } from './retryPolicy';
import { getVerdictConfig, findVerdict, fallbackVerdict, UNKNOWN_VERDICT, CANCELLED_VERDICT } from './verdicts';
import { TriageVerdictResult, VerdictDef } from './types';

const scope = 'triage';

// Triage a single check: classify, persist verdict, apply the check's App auto-accept policy.
// Returns the persisted triage object. Never throws on provider failure → records 'uncertain'/failed.
export async function triageCheck(checkId: string): Promise<Record<string, unknown>> {
    const cfg = await getProviderConfig();
    if (!cfg) throw new Error('triage provider is not configured');

    const check: any = await Check.findById(checkId).exec();
    if (!check) throw new Error(`check not found: ${checkId}`);
    const app: any = await App.findById(check.app).exec();
    const verdicts = getVerdictConfig(app);

    // Resolve the prompt: per-project override or the default (built from verdicts), then substitute
    // {{placeholders}} with this check's real context. Empty override → default.
    const [test, suite]: [any, any] = await Promise.all([
        check.test ? Test.findById(check.test).select('name').exec() : null,
        check.suite ? Suite.findById(check.suite).select('name').exec() : null,
    ]);
    let diffPercent = '';
    try {
        const r = check.result ? JSON.parse(check.result) : null;
        if (r && r.misMatchPercentage != null) diffPercent = String(r.misMatchPercentage);
    } catch { /* result is not JSON */ }
    const promptCtx: Record<string, string> = {
        checkName: check.name || '',
        testName: test?.name || '',
        suiteName: suite?.name || '',
        appName: app?.name || '',
        viewport: check.viewport || '',
        browserName: check.browserName || '',
        browserVersion: check.browserVersion || '',
        os: check.os || '',
        branch: check.branch || '',
        diffPercent,
        failReasons: Array.isArray(check.failReasons) ? check.failReasons.join(', ') : '',
        status: Array.isArray(check.status) ? check.status[0] : String(check.status || ''),
        imageFormat: 'png',
        verdicts: verdicts.map((v) => v.key).join(', '),
        createdDate: check.createdDate ? new Date(check.createdDate).toISOString() : '',
    };
    const rawPrompt = (typeof app?.triagePrompt === 'string' && app.triagePrompt.trim()) ? app.triagePrompt.trim() : buildSystemPrompt(verdicts);
    const systemPrompt = substitutePlaceholders(rawPrompt, promptCtx);
    const examples = Array.isArray(app?.triageExamples) ? app.triageExamples : undefined;

    let result: TriageVerdictResult;
    let failed = false;
    const priorAttempts = check.triage?.attempts ?? 0;
    try {
        const input = await buildTriageInput(checkId, verdicts, { systemPrompt, examples });
        if (!input) throw new Error(`check not found: ${checkId}`);
        result = await createProvider(cfg).classify(input);
    } catch (e) {
        log.warn(`triage failed for ${checkId}: ${e}`, { scope });
        // Only take the requeue path when the background scheduler will actually drain the
        // check again (global triage on AND this app's triage on) — otherwise a requeued check
        // would sit as `{ pending: true }` forever, invisible to the scheduler's query. Fall
        // through to the terminal failed-verdict path below instead.
        const canRetry = shouldRetryTriage(priorAttempts, env.SYNGRISI_AI_TRIAGE_MAX_ATTEMPTS)
            && canBackgroundDrain(await isTriageEnabled(), app?.triageEnabled === true);
        if (canRetry) {
            // Transient provider failure (429 / timeout / cold local VLM) and attempts remain:
            // re-queue for the scheduler instead of permanently burning the check on a failed verdict.
            // ponytail: retries are spaced by the scheduler poll interval; no per-check backoff.
            // Add exponential backoff keyed on triage.at if a persistently-down provider proves too chatty.
            log.warn(`triage retry queued for ${checkId} (attempt ${priorAttempts + 1}/${env.SYNGRISI_AI_TRIAGE_MAX_ATTEMPTS})`, { scope });
            return requeueCheck(checkId, {
                attempts: priorAttempts + 1,
                failed: false,
                reason: 'triage failed, will retry',
                at: new Date(),
            });
        }
        failed = true;
        const fb = fallbackVerdict(verdicts);
        result = { verdict: fb.key, confidence: 0, reason: 'triage failed', model: cfg.model ?? cfg.type };
    }

    // Below the project's confidence threshold → show the reserved "unknown" verdict
    // (keep the model's actual verdict as rawVerdict). Applies in both suggest and auto modes.
    const threshold = typeof app?.triagePolicy?.autoAcceptThreshold === 'number' ? app.triagePolicy.autoAcceptThreshold : 0;
    const belowThreshold = !failed && threshold > 0 && result.confidence < threshold;
    const def = belowThreshold ? UNKNOWN_VERDICT : findVerdict(verdicts, result.verdict);
    const effectiveVerdict = belowThreshold ? UNKNOWN_VERDICT.key : result.verdict;
    const triage: any = {
        verdict: effectiveVerdict,
        rawVerdict: result.verdict, // the model's actual verdict before threshold masking
        confidence: result.confidence,
        reason: result.reason,
        model: result.model,
        at: new Date(),
        failed,
        // denormalized display attrs so the UI renders without a per-project lookup
        label: def?.label ?? effectiveVerdict,
        color: def?.color ?? 'gray',
        icon: def?.icon,
    };
    if (failed) triage.attempts = priorAttempts + 1; // observability: total attempts made before giving up

    // Apply per-project auto-accept policy (verdict flags + policy allowlist + threshold).
    // Uses the model's real verdict; below-threshold can't auto-accept anyway (confidence gate).
    if (!failed && shouldAutoAccept(app?.triagePolicy, result.verdict, result.confidence, verdicts)) {
        try {
            const user: any = { _id: check.creatorId ?? new Types.ObjectId(), username: 'AI Triage' };
            await accept(checkId, '', user);
            triage.autoAccepted = true;
            log.info(`triage auto-accepted ${checkId} (${result.verdict} @ ${result.confidence})`, { scope });
        } catch (e) {
            log.warn(`triage auto-accept failed for ${checkId}: ${e}`, { scope });
        }
    }

    await Check.findByIdAndUpdate(checkId, { $set: { triage } }).exec();
    await updateTestWorstVerdict(check.test, verdicts);
    return triage;
}

// Manually cancel a check's analysis: clears pending and stamps the reserved 'cancelled' verdict
// (so the scheduler no longer picks it up). Re-running triage overwrites it.
export async function cancelCheck(checkId: string): Promise<Record<string, unknown>> {
    const check: any = await Check.findById(checkId).exec();
    if (!check) throw new Error(`check not found: ${checkId}`);
    const app: any = await App.findById(check.app).exec();
    const verdicts = getVerdictConfig(app);
    const def = CANCELLED_VERDICT;
    const triage = {
        verdict: def.key,
        pending: false,
        confidence: 0,
        reason: 'cancelled manually',
        model: '-',
        at: new Date(),
        failed: false,
        label: def.label,
        color: def.color,
        icon: def.icon,
    };
    await Check.findByIdAndUpdate(checkId, { $set: { triage } }).exec();
    await updateTestWorstVerdict(check.test, verdicts);
    return triage;
}

// Put a check back into the scheduler's pending queue: the shared primitive behind the bulk
// "restart" action (queue restart runs async via the background scheduler instead of blocking
// the request) and the bounded-retry path in `triageCheck` (a transient provider failure with
// attempts remaining). Overwrites the whole `triage` subdocument with `{ pending: true, ...extra }`
// so `triage.verdict` no longer exists and `findUntriagedCheckIds` re-selects this check on the
// next poll. `extra` lets the retry path stamp `attempts`/`reason`/`at` alongside `pending`.
export async function requeueCheck(checkId: string, extra: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
    const check: any = await Check.findById(checkId).exec();
    if (!check) throw new Error(`check not found: ${checkId}`);
    const triage = { pending: true, ...extra };
    await Check.findByIdAndUpdate(checkId, { $set: { triage } }).exec();
    // The check's `triage.verdict` is gone now, so the parent test's cached worst verdict may be
    // stale (same reason `cancelCheck` refreshes it) — recompute it the same way.
    const app: any = await App.findById(check.app).exec();
    const verdicts = getVerdictConfig(app);
    await updateTestWorstVerdict(check.test, verdicts);
    // Kick the scheduler so analysis starts right away instead of waiting for the next poll.
    // Lazy import avoids a module-load cycle (triageScheduler statically imports this module).
    import('@lib/schedulers/triageScheduler')
        .then((m) => m.triageScheduler.kick())
        .catch((e) => log.warn(`triage kick failed for check ${checkId}: ${e}`, { scope }));
    return triage;
}

// Recompute the parent test's worst AI verdict (by configured severity) for group/filter.
// Takes the test id directly (callers already have the loaded check) to avoid an extra lookup.
async function updateTestWorstVerdict(testId: unknown, verdicts: VerdictDef[]): Promise<void> {
    if (!testId) return;
    try {
        const severity: Record<string, number> = {};
        for (const v of verdicts) severity[v.key] = v.severity;
        const checks: any[] = await Check.find({ test: testId, 'triage.verdict': { $exists: true } })
            .select('triage.verdict')
            .exec();
        let worst: string | undefined;
        let worstRank = -Infinity;
        for (const c of checks) {
            const v = c?.triage?.verdict;
            const rank = severity[v] ?? 0;
            if (v && rank > worstRank) { worstRank = rank; worst = v; }
        }
        await Test.findByIdAndUpdate(testId, { $set: { worstTriageVerdict: worst } }).exec();
    } catch (e) {
        log.warn(`failed to update test worst verdict for test ${testId}: ${e}`, { scope });
    }
}

// Lease duration for a scheduler claim: long enough for the slowest single classification
// (provider timeout × retries); after it expires another instance may re-claim the check.
const CLAIM_TTL_MS = 10 * 60_000;

// Find failed-with-diff, untriaged checks in projects where AI Triage is enabled (off by default).
// Used by the background scheduler only; manual re-run is always allowed.
// Each check is claimed atomically (findOneAndUpdate stamps triage.claimedAt), so several server
// instances polling in parallel never triage the same check twice. Finishing a triage overwrites
// the whole `triage` subdoc, which clears the claim; a crashed instance's claim expires via the TTL.
export async function findUntriagedCheckIds(limit: number): Promise<string[]> {
    const enabledAppIds = await App.find({ triageEnabled: true }).distinct('_id');
    if (!enabledAppIds.length) return [];
    const staleBefore = new Date(Date.now() - CLAIM_TTL_MS);
    const ids: string[] = [];
    for (let i = 0; i < limit; i++) {
        const claimed: any = await Check.findOneAndUpdate(
            {
                status: 'failed',
                diffId: { $exists: true, $ne: null },
                'triage.verdict': { $exists: false }, // not yet classified (covers fresh + pending)
                app: { $in: enabledAppIds },
                $or: [
                    { 'triage.claimedAt': { $exists: false } },
                    { 'triage.claimedAt': { $lt: staleBefore } },
                ],
            },
            { $set: { 'triage.claimedAt': new Date() } },
            { new: true, projection: { _id: 1 } },
        ).exec();
        if (!claimed) break;
        ids.push(String(claimed._id));
    }
    return ids;
}
