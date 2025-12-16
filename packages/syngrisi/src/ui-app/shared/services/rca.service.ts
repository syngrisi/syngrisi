/**
 * RCA (Root Cause Analysis) API Service
 *
 * Handles fetching DOM snapshots from the server for RCA analysis.
 */
import config from '@config';
import { http } from '@shared/lib/http';
import { DOMNode } from '@shared/interfaces/IRCA';

export interface GetDomSnapshotParams {
    checkId?: string;
    baselineId?: string;
    apikey?: string;
    shareToken?: string;
}

export const RCAService = {
    /**
     * Get actual DOM snapshot for a check
     */
    async getActualDom({ checkId, apikey, shareToken }: GetDomSnapshotParams): Promise<DOMNode | null> {
        if (!checkId) return null;

        const headers: Record<string, string> = {};
        if (apikey) {
            headers.apikey = apikey;
        }
        if (shareToken) {
            headers['x-share-token'] = shareToken;
        }

        try {
            const resp = await http.get(
                `${config.baseUri}/v1/checks/${checkId}/dom`,
                { headers },
                'RCAService.getActualDom'
            );

            if (!resp.ok) {
                if (resp.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch DOM snapshot: ${resp.status}`);
            }

            return resp.json();
        } catch (error) {
            console.warn('Failed to fetch actual DOM:', error);
            return null;
        }
    },

    /**
     * Get baseline DOM snapshot
     */
    async getBaselineDom({ baselineId, apikey, shareToken }: GetDomSnapshotParams): Promise<DOMNode | null> {
        if (!baselineId) return null;

        const headers: Record<string, string> = {};
        if (apikey) {
            headers.apikey = apikey;
        }
        if (shareToken) {
            headers['x-share-token'] = shareToken;
        }

        try {
            const resp = await http.get(
                `${config.baseUri}/v1/baselines/${baselineId}/dom`,
                { headers },
                'RCAService.getBaselineDom'
            );

            if (!resp.ok) {
                if (resp.status === 404) {
                    return null;
                }
                throw new Error(`Failed to fetch baseline DOM: ${resp.status}`);
            }

            return resp.json();
        } catch (error) {
            console.warn('Failed to fetch baseline DOM:', error);
            return null;
        }
    },

    /**
     * Fetch both DOM snapshots in parallel
     */
    async getDomSnapshots(params: {
        checkId: string;
        baselineId?: string;
        apikey?: string;
        shareToken?: string;
    }): Promise<{ actual: DOMNode | null; baseline: DOMNode | null }> {
        const [actual, baseline] = await Promise.all([
            this.getActualDom({ checkId: params.checkId, apikey: params.apikey, shareToken: params.shareToken }),
            params.baselineId
                ? this.getBaselineDom({ baselineId: params.baselineId, apikey: params.apikey, shareToken: params.shareToken })
                : Promise.resolve(null),
        ]);

        return { actual, baseline };
    },
};
