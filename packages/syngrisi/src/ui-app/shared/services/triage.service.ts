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

    // Triage queue: failed-with-diff checks in triage-enabled projects, grouped by run.
    async getQueue(pendingOnly = false, apikey?: string): Promise<{ runs: any[]; counts: Record<string, number> }> {
        const resp = await http.get(
            `${config.baseUri}/ai/triage/queue${pendingOnly ? '?pendingOnly=true' : ''}`,
            { headers: authHeaders(apikey) },
            'TriageService.getQueue',
        );
        if (!resp.ok) throw new Error(`Failed to load queue: ${resp.status}`);
        return resp.json();
    },

    async cancelMany(checkIds: string[], apikey?: string): Promise<void> {
        await http.post(`${config.baseUri}/ai/triage/queue/cancel`, { checkIds }, { headers: authHeaders(apikey) }, 'TriageService.cancelMany');
    },

    async restartMany(checkIds: string[], apikey?: string): Promise<void> {
        await http.post(`${config.baseUri}/ai/triage/queue/restart`, { checkIds }, { headers: authHeaders(apikey) }, 'TriageService.restartMany');
    },
};
