/* eslint-disable no-underscore-dangle */
import config from '@config';
import { http } from '@shared/lib/http';

export const TestsService = {
    async removeTest({ id }: { id: string }) {
        const resp = await http.delete(
            `${config.baseUri}/v1/tests/${id}`,
            {},
            'TestsService.removeTest'
        );
        return resp.json();
    },

    async acceptTest({ id }: { id: string }) {
        const resp = await http.put(
            `${config.baseUri}/v1/tests/accept/${id}`,
            undefined,
            {},
            'TestsService.acceptTest'
        );
        return {
            response: resp.json(),
            id,
        };
    },
};
