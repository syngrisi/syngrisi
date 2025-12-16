/* eslint-disable no-underscore-dangle */
import config from '@config';
import { http } from '@shared/lib/http';

export const SuitesService = {
    async remove({ id }: { id: string }) {
        const resp = await http.delete(
            `${config.baseUri}/v1/suites/${id}`,
            {},
            'SuitesService.remove'
        );
        return resp.json();
    },
};
