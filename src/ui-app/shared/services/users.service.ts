import ky from 'ky';

import queryString from 'query-string';
import config from '../../config';
import IUser from '../interfaces/IUser';

export interface IApiResult {
    results: IUser[],
    page: number,
    limit: number,
    totalPages: number,
    totalResults: number,
}

interface IRequestOptions {
    sortBy?: string,
    limit?: string,
    page?: string,

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

    async getUsers(filter: Partial<IUser> = {}, options: IRequestOptions = {}): Promise<IApiResult> {
        const queryOptions = { ...options, limit: options.limit || 0 };
        const queryOptionsString = queryString.stringify(queryOptions);
        const queryFilterString = queryString.stringify(filter);
        const uri = `${config.baseUri}/v1/users?${queryOptionsString}&${queryFilterString}`;
        const resp = await ky(uri);
        const result: IApiResult = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
    },

    async create(data: IUser): Promise<IUser[]> {
        const resp = await ky.post(
            `${config.baseUri}/v1/users`,
            { json: data },
        );
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot create user, resp: '${JSON.stringify(resp)}'`);
    },

    async update(data: IUser): Promise<IUser[]> {
        const resp = await ky.patch(
            `${config.baseUri}/v1/users/${data.id}`,
            { json: data },
        );
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot update user, resp: '${JSON.stringify(resp)}'`);
    },

    async delete(id: string) {
        const resp = await ky.delete(
            `${config.baseUri}/v1/users/${id}`,
        );
        if (resp.ok) {
            return;
        }
        throw new Error(`cannot delete user, resp: '${JSON.stringify(resp)}'`);
    },
};
