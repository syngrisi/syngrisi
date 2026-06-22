/**
 * AI Triage API Service
 *
 * Re-run triage for a single check and test a provider connection.
 */
import config from '@config';
import { http } from '@shared/lib/http';

export interface TriageResult {
    verdict: 'intended_change' | 'likely_bug' | 'noise' | 'uncertain';
    confidence: number;
    reason: string;
    model: string;
    at: string;
    autoAccepted?: boolean;
    failed?: boolean;
}

function authHeaders(apikey?: string): Record<string, string> {
    return apikey ? { apikey } : {};
}

export const TriageService = {
    async runTriage(checkId: string, apikey?: string): Promise<TriageResult | null> {
        const resp = await http.post(
            `${config.baseUri}/ai/triage/${checkId}/run`,
            {},
            { headers: authHeaders(apikey) },
            'TriageService.runTriage',
        );
        if (!resp.ok) throw new Error(`Failed to run triage: ${resp.status}`);
        const data: any = await resp.json();
        return data?.triage ?? null;
    },

    async testProvider(cfg: Record<string, unknown>, apikey?: string): Promise<{ ok: boolean; latencyMs: number; result?: TriageResult; error?: string }> {
        const resp = await http.post(
            `${config.baseUri}/ai/triage/test`,
            cfg,
            { headers: authHeaders(apikey) },
            'TriageService.testProvider',
        );
        return resp.json();
    },
};
