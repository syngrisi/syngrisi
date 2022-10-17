/* eslint-disable no-underscore-dangle */
import ky from 'ky';
import config from '../../config';

export const TestsService = {
    // eslint-disable-next-line consistent-return
    async removeTest({ id }: { id: string }) {
        try {
            const resp = await ky(`${config.baseUri}/v1/tests/${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`Cannot remove test: '${id}', error: '${e}'`);
        }
    },

    // eslint-disable-next-line consistent-return
    async acceptTest({ id }: { id: string }) {
        // console.log({ id })
        try {
            const resp = await ky(`${config.baseUri}/v1/tests/accept/${id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'PUT',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            throw new Error(`Cannot accept test: '${id}', error: '${e}'`);
        }
    },
};
