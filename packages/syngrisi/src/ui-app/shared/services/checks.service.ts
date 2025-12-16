/* eslint-disable no-underscore-dangle */
import ky from 'ky';
import config from '@config';

export const ChecksService = {
    // eslint-disable-next-line consistent-return
    async acceptCheck({ check, newBaselineId, apikey }: { check: any, newBaselineId: string, apikey?: string }) {
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (apikey) {
                headers.apikey = apikey;
            }
            const resp = await ky(`${config.baseUri}/v1/checks/${check._id}/accept`, {
                headers,
                body: JSON.stringify({
                    baselineId: newBaselineId,
                }),
                method: 'PUT',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`cannot accept check: '${JSON.stringify(check, null, '/t')}',`
                + `\nbaseline: '${newBaselineId}', error: '${e}'}`);
        }
    },

    // eslint-disable-next-line consistent-return
    async removeCheck({ id, apikey }: { id: string, apikey?: string }) {
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (apikey) {
                headers.apikey = apikey;
            }
            const resp = await ky(`${config.baseUri}/v1/checks/${id}`, {
                headers,
                method: 'DELETE',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`Cannot remove check: '${id}', error: '${e}'`);
        }
    },
};
