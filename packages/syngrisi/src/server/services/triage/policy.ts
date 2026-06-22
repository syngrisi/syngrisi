import { TriageVerdict } from './types';

export interface AppTriagePolicy {
    policy?: 'suggest' | 'auto';
    autoAcceptThreshold?: number;
    autoAcceptVerdicts?: string[];
}

// Pure decision: should this verdict be auto-accepted under the app's policy?
// likely_bug / uncertain can never be auto-accepted (only if explicitly listed, which the UI forbids).
export function shouldAutoAccept(
    policy: AppTriagePolicy | undefined | null,
    verdict: TriageVerdict,
    confidence: number,
): boolean {
    if (!policy || policy.policy !== 'auto') return false;
    const threshold = typeof policy.autoAcceptThreshold === 'number' ? policy.autoAcceptThreshold : 9;
    const allowed = policy.autoAcceptVerdicts ?? ['intended_change', 'noise'];
    if (verdict === 'likely_bug' || verdict === 'uncertain') return false;
    return allowed.includes(verdict) && confidence >= threshold;
}
