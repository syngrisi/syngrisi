/* eslint-disable no-underscore-dangle */
import ky from 'ky';
import config from '../../config';

export const ChecksService = {
    // eslint-disable-next-line consistent-return
    async acceptCheck({ check, newBaselineId }: { check: any, newBaselineId: string }) {
        try {
            const resp = await ky(`${config.baseUri}/v1/checks/${check._id}/accept`, {
                headers: { 'Content-Type': 'application/json' },
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
    async removeCheck({ id }: { id: string }) {
        try {
            const resp = await ky(`${config.baseUri}/v1/checks/${id}`, {
                headers: { 'Content-Type': 'application/json' },
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
