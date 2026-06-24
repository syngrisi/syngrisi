import { TriageInput, TriageVerdictResult, VerdictDef } from './types';
import { fallbackVerdict } from './verdicts';

// Replace {{placeholder}} tokens with real values; unknown/missing tokens become ''.
export function substitutePlaceholders(template: string, ctx: Record<string, string>): string {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => (ctx[key] != null ? String(ctx[key]) : ''));
}

// System prompt built from the project's configurable verdict set.
export function buildSystemPrompt(verdicts: VerdictDef[]): string {
    const fb = fallbackVerdict(verdicts);
    const lines = verdicts.map((v) => `- ${v.key}: ${v.description || v.label}`).join('\n');
    const keys = verdicts.map((v) => v.key).join(' | ');
    return `You are a visual-regression triage assistant. You are given a baseline screenshot, the actual screenshot, and a highlighted diff image of a UI. Classify what changed.

Context for this check: name "{{checkName}}", test "{{testName}}", suite "{{suiteName}}", project "{{appName}}", viewport {{viewport}}, browser {{browserName}}, OS {{os}}, pixel difference vs baseline {{diffPercent}}%.

Return STRICT JSON only, no prose, with this exact shape:
{"verdict": "<one of: ${keys}>", "confidence": <integer 0..10>, "reason": "<one short phrase>"}

Verdict meaning (choose the single best match):
${lines}

How to decide:
- Judge ONLY by what is visible. You cannot know the developer's intent — infer it from visual evidence; do NOT assume a change is intentional just because it looks deliberate.
- Inspect: what appeared or disappeared, layout and alignment, overlap or clipping, spacing, colors and contrast, text content, and whether the new state looks coherent and complete or broken and incomplete.
- Signs of a real defect (a regression / bug): overlapping or clipped elements, collapsed or broken layout, misalignment, content missing and leaving an empty or broken gap, a broken or failed-to-load image (empty image frame, broken-image placeholder, or alt text shown instead of the picture), unreadable contrast, cut-off text, duplicated or stray elements.
- Signs of an intended change: the new state looks coherent, aligned and complete — content cleanly added, removed, reworded, restyled or moved, with no layout breakage.
- Signs of noise: sub-pixel or anti-aliasing differences, dynamic content (dates, times, counters, spinners, random data) or rendering jitter — pixels differ but the UI is effectively the same.
- When evidence is weak, conflicting, or you genuinely cannot tell, prefer "${fb.key}" instead of guessing.

How to score confidence (integer 0..10):
- 9-10: a large, unambiguous change that clearly fits one verdict.
- 6-8: a clear change; the verdict is likely but with some room for doubt.
- 3-5: a weak or partial signal; the verdict is mostly a guess.
- 0-2: almost no evidence or fully ambiguous — use "${fb.key}".

Rules:
- reason is ONE short human-readable phrase describing the visible change (e.g. "header overlaps content", "new banner added", "timestamp updated").
- Never invent a verdict outside the allowed set; output JSON only.`;
}

// Split a data URL into media type + raw base64 (for providers that need them separately).
// Falls back to treating the input as raw base64 PNG.
export function parseImageData(s: string): { mediaType: string; data: string } {
    const m = /^data:([^;]+);base64,(.*)$/.exec(s || '');
    if (m) return { mediaType: m[1], data: m[2] };
    return { mediaType: 'image/png', data: s || '' };
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
