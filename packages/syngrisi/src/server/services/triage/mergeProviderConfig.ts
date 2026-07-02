import { TriageProviderConfig } from './types';

// Env values relevant to provider config. OPENAI_* are OpenAI-specific and must
// only apply when the provider type is 'openai' (or unset -> defaults to openai).
export interface TriageEnv {
    OPENAI_API_KEY?: string;
    OPENAI_API_BASE_URL?: string;
    SYNGRISI_AI_KEY?: string;   // generic env key override, any provider
}

// Merge DB-stored provider config with env overrides. Returns null if no usable type.
export function mergeProviderConfig(
    cfg: Partial<TriageProviderConfig>,
    env: TriageEnv,
): TriageProviderConfig | null {
    const type = cfg.type || 'openai';
    const isOpenAI = type === 'openai';

    const merged: TriageProviderConfig = {
        type,
        baseUrl: cfg.baseUrl || (isOpenAI ? env.OPENAI_API_BASE_URL : undefined) || undefined,
        apiKey: (isOpenAI ? env.OPENAI_API_KEY : undefined) || env.SYNGRISI_AI_KEY || cfg.apiKey || undefined,
        model: cfg.model || undefined,
        maxTokens: cfg.maxTokens,
        temperature: cfg.temperature,
        timeoutMs: cfg.timeoutMs,
        fakeVerdict: cfg.fakeVerdict,
        fakeConfidence: cfg.fakeConfidence,
        fakeReason: cfg.fakeReason,
    };
    if (!merged.type) return null;
    return merged;
}
