import { VerdictDef } from './types';

// Reserved service verdict shown when the model's confidence is below the project threshold
// (the model answered, but not confidently enough to trust). Distinct from the parse fallback.
export const UNKNOWN_VERDICT: VerdictDef = {
    key: 'unknown', label: 'Unknown', color: 'gray', icon: 'help', severity: 0,
    autoAcceptable: false, neverAutoAccept: true, description: 'confidence below the project threshold',
};

// Built-in defaults — used when a project has no custom verdict set. Preserve original semantics:
// noise/intended_change are auto-acceptable; likely_bug/uncertain never; uncertain is the fallback.
export const DEFAULT_VERDICTS: VerdictDef[] = [
    { key: 'noise', label: 'Noise', color: 'gray', icon: 'wave', severity: 1, autoAcceptable: true, description: 'pixels differ but the UI is effectively unchanged — sub-pixel/anti-aliasing shifts or dynamic content (dates, counters, spinners, random data)' },
    { key: 'intended_change', label: 'Intended change', color: 'green', icon: 'check', severity: 2, autoAcceptable: true, description: 'a coherent, complete change — content cleanly added, removed, reworded, restyled or moved with no layout breakage (expect a new baseline)' },
    { key: 'uncertain', label: 'Uncertain', color: 'yellow', icon: 'question', severity: 3, autoAcceptable: false, neverAutoAccept: true, isFallback: true, description: 'evidence is weak, conflicting or ambiguous — not confident enough to classify' },
    { key: 'likely_bug', label: 'Likely bug', color: 'red', icon: 'bug', severity: 4, autoAcceptable: false, neverAutoAccept: true, description: 'a visual defect — broken/collapsed layout, overlap, clipping, misalignment, missing content leaving a gap, unreadable contrast or cut-off text' },
];

// Resolve the verdict set for a project (App): its custom set if defined, else the defaults.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVerdictConfig(app: any): VerdictDef[] {
    const v = app?.triageVerdicts;
    return Array.isArray(v) && v.length ? v : DEFAULT_VERDICTS;
}

export function findVerdict(verdicts: VerdictDef[], key: string): VerdictDef | undefined {
    return verdicts.find((v) => v.key === key);
}

// The fallback verdict (explicit isFallback, else last/most-severe, else a synthesized 'uncertain').
export function fallbackVerdict(verdicts: VerdictDef[]): VerdictDef {
    return verdicts.find((v) => v.isFallback)
        || verdicts[verdicts.length - 1]
        || { key: 'uncertain', label: 'Uncertain', color: 'yellow', severity: 0, autoAcceptable: false, neverAutoAccept: true, isFallback: true };
}
