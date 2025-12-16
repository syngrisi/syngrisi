/* eslint-disable no-underscore-dangle */
import config from '@config';
import { http } from '@shared/lib/http';

export const RunsService = {
    async remove({ id }: { id: string }) {
        const resp = await http.delete(
            `${config.baseUri}/v1/runs/${id}`,
            {},
            'RunsService.remove'
        );
        return resp.json();
    },
};
