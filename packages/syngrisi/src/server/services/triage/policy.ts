import { VerdictDef } from './types';
import { findVerdict } from './verdicts';

export interface AppTriagePolicy {
    policy?: 'suggest' | 'auto';
    autoAcceptThreshold?: number;
    autoAcceptVerdicts?: string[];
}

// Pure decision: should this verdict be auto-accepted under the app's policy?
// Gated by BOTH the verdict definition (autoAcceptable, not neverAutoAccept — hard safety)
// AND the project policy (mode 'auto', allowlist, confidence threshold).
export function shouldAutoAccept(
    policy: AppTriagePolicy | undefined | null,
    verdictKey: string,
    confidence: number,
    verdicts: VerdictDef[],
): boolean {
    if (!policy || policy.policy !== 'auto') return false;
    const def = findVerdict(verdicts, verdictKey);
    if (!def || !def.autoAcceptable || def.neverAutoAccept) return false;
    const threshold = typeof policy.autoAcceptThreshold === 'number' ? policy.autoAcceptThreshold : 9;
    const allowed = policy.autoAcceptVerdicts ?? verdicts.filter((v) => v.autoAcceptable && !v.neverAutoAccept).map((v) => v.key);
    return allowed.includes(verdictKey) && confidence >= threshold;
}
