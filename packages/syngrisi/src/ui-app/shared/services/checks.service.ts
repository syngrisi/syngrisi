/* eslint-disable no-underscore-dangle */
import config from '@config';
import { http } from '@shared/lib/http';

export const ChecksService = {
    async acceptCheck({ check, newBaselineId, apikey }: { check: any, newBaselineId: string, apikey?: string }) {
        const headers: Record<string, string> = {};
        if (apikey) {
            headers.apikey = apikey;
        }
        const resp = await http.put(
            `${config.baseUri}/v1/checks/${check._id}/accept`,
            { baselineId: newBaselineId },
            { headers },
            'ChecksService.acceptCheck'
        );
        return resp.json();
    },

    async removeCheck({ id, apikey }: { id: string, apikey?: string }) {
        const headers: Record<string, string> = {};
        if (apikey) {
            headers.apikey = apikey;
        }
        const resp = await http.delete(
            `${config.baseUri}/v1/checks/${id}`,
            { headers },
            'ChecksService.removeCheck'
        );
        return resp.json();
    },

    async recompareCheck({ id, apikey }: { id: string, apikey?: string }) {
        const headers: Record<string, string> = {};
        if (apikey) {
            headers.apikey = apikey;
        }
        const resp = await http.post(
            `${config.baseUri}/v1/checks/${id}/recompare`,
            {},
            { headers },
            'ChecksService.recompareCheck'
        );
        return resp.json();
    },
};
