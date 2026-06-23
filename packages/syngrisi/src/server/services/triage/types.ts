export type TriageVerdict = string; // verdict keys are configurable per project

// A configurable verdict definition (per-project, full CRUD).
export interface VerdictDef {
    key: string;
    label: string;
    color: string;          // Mantine color name
    icon?: string;          // icon name from the triage icon registry
    severity: number;       // higher = worse; used to pick a test's "worst" verdict
    autoAcceptable: boolean; // may be auto-accepted by policy
    neverAutoAccept?: boolean; // hard safety: never auto-accept (e.g. real bugs / uncertain)
    isFallback?: boolean;   // used when the model output is unparseable/unknown
    description?: string;   // shown to the model in the prompt
}

export interface TriageInput {
    name: string;
    baselineB64: string | null;
    actualB64: string | null;
    diffB64: string | null;
    meta?: Record<string, unknown>;
    domDiff?: unknown;
    verdicts: VerdictDef[]; // the verdict set this classification must choose from
}

export interface TriageVerdictResult {
    verdict: TriageVerdict;
    confidence: number; // 0..10 integer
    reason: string;
    model: string;
}

export interface TriageProviderConfig {
    type: 'openai' | 'anthropic' | 'gemini' | 'fake';
    baseUrl?: string;
    apiKey?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number; // abort the model request after this many ms (0/undefined = no limit)
    // fake provider only (tests): deterministic output
    fakeVerdict?: TriageVerdict;
    fakeConfidence?: number;
    fakeReason?: string;
}

export interface TriageProvider {
    classify(input: TriageInput): Promise<TriageVerdictResult>;
    // Lightweight reachability check for "Test connection": verifies the provider/model responds
    // without running a full (slow) classification. Throws on failure. Short fixed timeout.
    ping(): Promise<{ model: string }>;
}
