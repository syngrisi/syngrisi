/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import { Check, App } from '@models';
import { accept } from '@services/check.service';
import log from '@lib/logger';
import { buildTriageInput } from './analysis.service';
import { createProvider } from './factory';
import { getProviderConfig } from './config';
import { shouldAutoAccept } from './policy';
import { TriageVerdictResult } from './types';

const scope = 'triage';

// Triage a single check: classify, persist verdict, apply the check's App auto-accept policy.
// Returns the persisted triage object. Never throws on provider failure → records 'uncertain'/failed.
export async function triageCheck(checkId: string): Promise<Record<string, unknown>> {
    const cfg = await getProviderConfig();
    if (!cfg) throw new Error('triage provider is not configured');

    let result: TriageVerdictResult;
    let failed = false;
    try {
        const input = await buildTriageInput(checkId);
        if (!input) throw new Error(`check not found: ${checkId}`);
        result = await createProvider(cfg).classify(input);
    } catch (e) {
        failed = true;
        log.warn(`triage failed for ${checkId}: ${e}`, { scope });
        result = { verdict: 'uncertain', confidence: 0, reason: 'triage failed', model: cfg.model ?? cfg.type };
    }

    const triage: any = {
        verdict: result.verdict,
        confidence: result.confidence,
        reason: result.reason,
        model: result.model,
        at: new Date(),
        failed,
    };

    // Apply per-project auto-accept policy
    if (!failed) {
        const check: any = await Check.findById(checkId).exec();
        if (check) {
            const app: any = await App.findById(check.app).exec();
            if (shouldAutoAccept(app?.triagePolicy, result.verdict, result.confidence)) {
                try {
                    const user: any = { _id: check.creatorId ?? new Types.ObjectId(), username: 'AI Triage' };
                    await accept(checkId, '', user);
                    triage.autoAccepted = true;
                    log.info(`triage auto-accepted ${checkId} (${result.verdict} @ ${result.confidence})`, { scope });
                } catch (e) {
                    log.warn(`triage auto-accept failed for ${checkId}: ${e}`, { scope });
                }
            }
        }
    }

    await Check.findByIdAndUpdate(checkId, { $set: { triage } }).exec();
    return triage;
}

// Find failed checks that have a diff and no triage yet (cheap default: only hasDiff checks).
export async function findUntriagedCheckIds(limit: number): Promise<string[]> {
    const checks = await Check.find({
        status: 'failed',
        diffId: { $exists: true, $ne: null },
        triage: { $exists: false },
    })
        .select('_id')
        .limit(limit)
        .exec();
    return checks.map((c: any) => String(c._id));
}
