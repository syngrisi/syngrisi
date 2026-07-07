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

    async acceptTest({ id, checkIds }: { id: string; checkIds?: string[] }) {
        const resp = await http.put(
            `${config.baseUri}/v1/tests/accept/${id}`,
            checkIds && checkIds.length > 0 ? { checkIds } : undefined,
            {},
            'TestsService.acceptTest'
        );
        return {
            response: resp.json(),
            id,
        };
    },
};
