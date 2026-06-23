/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { Check, App, Test } from '@models';
import { accept } from '@services/check.service';
import log from '@lib/logger';
import { buildTriageInput } from './analysis.service';
import { createProvider } from './factory';
import { getProviderConfig } from './config';
import { shouldAutoAccept } from './policy';
import { getVerdictConfig, findVerdict, fallbackVerdict } from './verdicts';
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

    let result: TriageVerdictResult;
    let failed = false;
    try {
        const input = await buildTriageInput(checkId, verdicts);
        if (!input) throw new Error(`check not found: ${checkId}`);
        result = await createProvider(cfg).classify(input);
    } catch (e) {
        failed = true;
        log.warn(`triage failed for ${checkId}: ${e}`, { scope });
        const fb = fallbackVerdict(verdicts);
        result = { verdict: fb.key, confidence: 0, reason: 'triage failed', model: cfg.model ?? cfg.type };
    }

    const def = findVerdict(verdicts, result.verdict);
    const triage: any = {
        verdict: result.verdict,
        confidence: result.confidence,
        reason: result.reason,
        model: result.model,
        at: new Date(),
        failed,
        // denormalized display attrs so the UI renders without a per-project lookup
        label: def?.label ?? result.verdict,
        color: def?.color ?? 'gray',
    };

    // Apply per-project auto-accept policy (verdict flags + policy allowlist + threshold)
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
    await updateTestWorstVerdict(checkId, verdicts);
    return triage;
}

// Recompute the parent test's worst AI verdict (by configured severity) for group/filter.
async function updateTestWorstVerdict(checkId: string, verdicts: VerdictDef[]): Promise<void> {
    try {
        const check: any = await Check.findById(checkId).select('test').exec();
        if (!check?.test) return;
        const severity: Record<string, number> = {};
        for (const v of verdicts) severity[v.key] = v.severity;
        const checks: any[] = await Check.find({ test: check.test, 'triage.verdict': { $exists: true } })
            .select('triage.verdict')
            .exec();
        let worst: string | undefined;
        let worstRank = -Infinity;
        for (const c of checks) {
            const v = c?.triage?.verdict;
            const rank = severity[v] ?? 0;
            if (v && rank > worstRank) { worstRank = rank; worst = v; }
        }
        await Test.findByIdAndUpdate(check.test, { $set: { worstTriageVerdict: worst } }).exec();
    } catch (e) {
        log.warn(`failed to update test worst verdict for ${checkId}: ${e}`, { scope });
    }
}

// Find failed-with-diff, untriaged checks in projects where AI Triage is enabled (off by default).
// Used by the background scheduler only; manual re-run is always allowed.
export async function findUntriagedCheckIds(limit: number): Promise<string[]> {
    const enabledAppIds = await App.find({ triageEnabled: true }).distinct('_id');
    if (!enabledAppIds.length) return [];
    const checks = await Check.find({
        status: 'failed',
        diffId: { $exists: true, $ne: null },
        triage: { $exists: false },
        app: { $in: enabledAppIds },
    })
        .select('_id')
        .limit(limit)
        .exec();
    return checks.map((c: any) => String(c._id));
}
