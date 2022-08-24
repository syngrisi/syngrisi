import ky from 'ky';

import config from '../../config';

export const UserService = {
    async getApiKey() {
        const resp = await ky(`${config.baseUri}/apikey`);
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
    },
    async getCurrentUser() {
        const resp = await ky(`${config.baseUri}/v1/users/current`);
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
    },
};
