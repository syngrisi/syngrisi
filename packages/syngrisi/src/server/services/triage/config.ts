/* eslint-disable @typescript-eslint/no-explicit-any */
import { appSettings } from '@settings';
import { env } from '@/server/envConfig';
import { TriageProviderConfig } from './types';

// Global on/off: env override wins over DB (same precedence as other settings).
export async function isTriageEnabled(): Promise<boolean> {
    if (process.env.SYNGRISI_AI_TRIAGE_ENABLED === 'true') return true;
    if (process.env.SYNGRISI_AI_TRIAGE_ENABLED === 'false') return false;
    const setting = await appSettings.get('ai_triage_enabled');
    return setting?.enabled === true && String(setting?.value) === 'true';
}

// Provider config from DB setting `ai_triage_provider` (JSON), with env overlay for secrets.
export async function getProviderConfig(): Promise<TriageProviderConfig | null> {
    const setting = await appSettings.get('ai_triage_provider');
    const raw: any = setting?.value;
    let cfg: Partial<TriageProviderConfig> = {};
    if (raw && typeof raw === 'object') cfg = raw;
    else if (typeof raw === 'string' && raw.trim().startsWith('{')) {
        try { cfg = JSON.parse(raw); } catch { /* ignore */ }
    }

    const merged: TriageProviderConfig = {
        type: (cfg.type as any) || 'openai',
        baseUrl: cfg.baseUrl || env.OPENAI_API_BASE_URL || undefined,
        apiKey: env.OPENAI_API_KEY || env.SYNGRISI_AI_KEY || cfg.apiKey || undefined,
        model: cfg.model || undefined,
        maxTokens: cfg.maxTokens,
        temperature: cfg.temperature,
        fakeVerdict: cfg.fakeVerdict,
        fakeConfidence: cfg.fakeConfidence,
        fakeReason: cfg.fakeReason,
    };
    if (!merged.type) return null;
    return merged;
}
