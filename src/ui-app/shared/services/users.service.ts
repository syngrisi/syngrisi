import ky from 'ky';

import config from '../../config';
import IUser from '../interfaces/IUser';

export interface IApiResult {
    results: IUser[],
    page: number,
    limit: number,
    totalPages: number,
    totalResults: number,
}

export const UsersService = {
    async getApiKey(): Promise<{ apikey: string }> {
        const resp = await ky(`${config.baseUri}/apikey`);
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
    },
    async getCurrentUser(): Promise<IUser> {
        const resp = await ky(`${config.baseUri}/v1/users/current`);
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
    },
};
