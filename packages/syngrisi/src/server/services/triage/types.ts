export type TriageVerdict = 'intended_change' | 'likely_bug' | 'noise' | 'uncertain';

export const TRIAGE_VERDICTS: TriageVerdict[] = ['intended_change', 'likely_bug', 'noise', 'uncertain'];

export interface TriageInput {
    name: string;
    baselineB64: string | null;
    actualB64: string | null;
    diffB64: string | null;
    meta?: Record<string, unknown>;
    domDiff?: unknown;
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
    // fake provider only (tests): deterministic output
    fakeVerdict?: TriageVerdict;
    fakeConfidence?: number;
    fakeReason?: string;
}

export interface TriageProvider {
    classify(input: TriageInput): Promise<TriageVerdictResult>;
}
