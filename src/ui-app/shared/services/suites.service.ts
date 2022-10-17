/* eslint-disable no-underscore-dangle */
import ky from 'ky';
import config from '../../config';

export const SuitesService = {
    // eslint-disable-next-line consistent-return
    async remove({ id }: { id: string }) {
        try {
            const resp = await ky(`${config.baseUri}/v1/suites/${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`Cannot remove suite: '${id}', error: '${e}'`);
        }
    },
};
