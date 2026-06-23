import { TriageInput, TriageVerdictResult, VerdictDef } from './types';
import { fallbackVerdict } from './verdicts';

// System prompt built from the project's configurable verdict set.
export function buildSystemPrompt(verdicts: VerdictDef[]): string {
    const fb = fallbackVerdict(verdicts);
    const lines = verdicts.map((v) => `- ${v.key}: ${v.description || v.label}`).join('\n');
    const keys = verdicts.map((v) => v.key).join(' | ');
    return `You are a visual-regression triage assistant. You compare a baseline screenshot, the actual screenshot, and a highlighted diff image of a UI, and classify the change.

Return STRICT JSON only, no prose, with this exact shape:
{"verdict": "<one of: ${keys}>", "confidence": <integer 0..10>, "reason": "<one short phrase>"}

Verdict meaning:
${lines}

Rules:
- confidence is an integer from 0 (no idea) to 10 (certain).
- reason is ONE short human-readable phrase.
- If you are not confident enough to classify, use "${fb.key}"; never invent a verdict outside the allowed set.`;
}

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

// Coerce any provider output into a safe result. Unknown/unparseable verdict → the fallback verdict.
export function normalizeResult(raw: unknown, model: string, verdicts: VerdictDef[]): TriageVerdictResult {
    const fb = fallbackVerdict(verdicts);
    const keys = new Set(verdicts.map((v) => v.key));
    let obj: any = raw;
    if (typeof raw === 'string') {
        try {
            const match = raw.match(/\{[\s\S]*\}/);
            obj = JSON.parse(match ? match[0] : raw);
        } catch {
            return { verdict: fb.key, confidence: 0, reason: 'unparseable model output', model };
        }
    }
    if (!obj || typeof obj !== 'object') {
        return { verdict: fb.key, confidence: 0, reason: 'empty model output', model };
    }
    const verdict: string = keys.has(obj.verdict) ? obj.verdict : fb.key;
    let confidence = Number(obj.confidence);
    if (!Number.isFinite(confidence)) confidence = 0;
    confidence = Math.max(0, Math.min(10, Math.round(confidence)));
    const reason = typeof obj.reason === 'string' && obj.reason.trim() ? obj.reason.trim().slice(0, 280) : 'no reason provided';
    return { verdict, confidence, reason, model };
}
