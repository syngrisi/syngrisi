/* AI Triage filter helpers. The filter lives in the `checkFilter` URL param and is applied
 * client-side (so the checks query cache stays intact). Verdict supports multiple values. */

export interface ParsedTriageFilter {
    verdicts: string[];
    minConfidence?: number;
    reasonContains?: string;
    ids?: string[]; // explicit check-id set (e.g. "same change at other resolutions")
    active: boolean;
}

// Parse the raw `checkFilter` URL param. `triage.verdict` may be a string (legacy) or string[].
// `_idIn` is an explicit set of check ids (used by the "same change" panel → show-in-table).
export function parseTriageFilter(checkFilter: any): ParsedTriageFilter {
    const cf = (checkFilter && typeof checkFilter === 'object') ? checkFilter : {};
    const rawV = cf['triage.verdict'];
    const verdicts: string[] = Array.isArray(rawV) ? rawV.filter(Boolean) : (rawV ? [rawV] : []);
    const minConfidence = typeof cf.minConfidence === 'number' ? cf.minConfidence : undefined;
    const reasonContains = (typeof cf.reasonContains === 'string' && cf.reasonContains)
        ? cf.reasonContains.toLowerCase() : undefined;
    const ids = Array.isArray(cf._idIn) ? cf._idIn.map(String).filter(Boolean) : undefined;
    const active = (!!ids && ids.length > 0) || verdicts.length > 0 || typeof minConfidence === 'number' || !!reasonContains;
    return { verdicts, minConfidence, reasonContains, ids, active };
}

// Does a single check satisfy the filter?
export function checkMatchesTriage(check: any, f: ParsedTriageFilter): boolean {
    // Explicit check-id set takes precedence (filter to exactly this set, e.g. similar changes).
    if (f.ids && f.ids.length) {
        return f.ids.includes(String(check?._id ?? check?.id ?? ''));
    }
    const t = check?.triage;
    if (!t) return false;
    if (f.verdicts.length && !f.verdicts.includes(t.verdict)) return false;
    if (typeof f.minConfidence === 'number' && !(typeof t.confidence === 'number' && t.confidence >= f.minConfidence)) return false;
    if (f.reasonContains && !String(t.reason || '').toLowerCase().includes(f.reasonContains)) return false;
    return true;
}

// Does a test have at least one check that matches? (tests list is populated with `checks`)
export function testHasTriageMatch(test: any, f: ParsedTriageFilter): boolean {
    const checks = Array.isArray(test?.checks) ? test.checks : [];
    return checks.some((c: any) => checkMatchesTriage(c, f));
}
