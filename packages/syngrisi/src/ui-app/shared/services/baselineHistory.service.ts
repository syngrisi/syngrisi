/**
 * Baseline "time machine" API service.
 *
 * Fetches the ordered accepted-baseline timeline for one check ident, and an optional
 * AI-generated summary of what changed between two consecutive baselines.
 */
import { http } from '@shared/lib/http';

export interface BaselineHistoryIdent {
    name: string;
    app: string;
    branch: string;
    browserName: string;
    viewport: string;
    os: string;
}

export interface BaselineHistoryItem {
    id: string;
    createdDate: string;
    markedByUsername?: string;
    filename?: string;
    imageUrl?: string;
}

export interface HistorySummaryResult {
    summary: string | null;
    reason?: string;
    cached?: boolean;
}

export const BaselineHistoryService = {
    async getHistory(ident: BaselineHistoryIdent): Promise<BaselineHistoryItem[]> {
        const filter = encodeURIComponent(JSON.stringify(ident));
        const resp = await http.get(
            `/v1/baselines/history?filter=${filter}`,
            {},
            'BaselineHistoryService.getHistory'
        );
        return resp.json();
    },

    async getSummary(fromBaselineId: string, toBaselineId: string): Promise<HistorySummaryResult> {
        const resp = await http.post(
            '/v1/baselines/history-summary',
            { fromBaselineId, toBaselineId },
            {},
            'BaselineHistoryService.getSummary'
        );
        return resp.json();
    },
};
