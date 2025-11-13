/* eslint-disable no-underscore-dangle */
import ky from 'ky';
import config from '@config';

export const RunsService = {
    // eslint-disable-next-line consistent-return
    async remove({ id }: { id: string }) {
        try {
            const resp = await ky(`${config.baseUri}/v1/runs/${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`Cannot remove run: '${id}', error: '${e}'`);
        }
    },
};
