import { TriageInput, TriageVerdictResult, TriageVerdict, TRIAGE_VERDICTS } from './types';

export const SYSTEM_PROMPT = `You are a visual-regression triage assistant. You compare a baseline screenshot, the actual screenshot, and a highlighted diff image of a UI, and classify the change.

Return STRICT JSON only, no prose, with this exact shape:
{"verdict": "<one of: intended_change | likely_bug | noise>", "confidence": <integer 0..10>, "reason": "<one short phrase>"}

Verdict meaning:
- intended_change: a real, intentional UI change (expect a new baseline)
- likely_bug: an unexpected regression that needs a human
- noise: anti-aliasing / dynamic content / render jitter — not a real change

Rules:
- confidence is an integer from 0 (no idea) to 10 (certain).
- reason is ONE short human-readable phrase.
- If you are not confident enough to classify, lower the confidence; never invent a verdict outside the allowed set.`;

export function buildUserText(input: TriageInput): string {
    const meta = input.meta ? JSON.stringify(input.meta).slice(0, 2000) : '';
    const dom = input.domDiff ? JSON.stringify(input.domDiff).slice(0, 4000) : '';
    return [
        `Check name: ${input.name}`,
        meta ? `Metadata: ${meta}` : '',
        dom ? `DOM diff (context): ${dom}` : '',
        'Images are provided as baseline, actual, diff. Classify the change and return strict JSON.',
    ].filter(Boolean).join('\n');
}

// Coerce any provider output into a safe TriageVerdictResult. Unparseable / out-of-range → uncertain.
export function normalizeResult(raw: unknown, model: string): TriageVerdictResult {
    let obj: any = raw;
    if (typeof raw === 'string') {
        try {
            // tolerate code fences / surrounding text: grab the first {...} block
            const match = raw.match(/\{[\s\S]*\}/);
            obj = JSON.parse(match ? match[0] : raw);
        } catch {
            return { verdict: 'uncertain', confidence: 0, reason: 'unparseable model output', model };
        }
    }
    if (!obj || typeof obj !== 'object') {
        return { verdict: 'uncertain', confidence: 0, reason: 'empty model output', model };
    }
    const verdict: TriageVerdict = TRIAGE_VERDICTS.includes(obj.verdict) ? obj.verdict : 'uncertain';
    let confidence = Number(obj.confidence);
    if (!Number.isFinite(confidence)) confidence = 0;
    confidence = Math.max(0, Math.min(10, Math.round(confidence)));
    const reason = typeof obj.reason === 'string' && obj.reason.trim() ? obj.reason.trim().slice(0, 280) : 'no reason provided';
    return { verdict, confidence, reason, model };
}
