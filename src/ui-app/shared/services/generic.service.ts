import ky from 'ky';

import queryString from 'query-string';
import config from '../../config';
import ILog from '../interfaces/ILog';
import { log } from '../utils';

export interface IApiResult {
    results: ILog[]
    page: number
    limit: number
    totalPages: number
    totalResults: number
    timestamp: string
}

interface IRequestOptions {
    sortBy?: string
    limit?: string
    page?: string
    populate?: string
    sortOrder: string | number
}

export const GenericService = {
    async get(resource: string, filter: any = {}, options: IRequestOptions = {}, queryID = ''): Promise<IApiResult> {
        const queryOptions = { ...options, limit: options.limit || 10 };
        const queryOptionsString = queryString.stringify(queryOptions);
        // if (resource === 'checks') {
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // }
        // eslint-disable-next-line max-len
        const uri = `${config.baseUri}/v1/${resource}?${queryOptionsString}&filter=${JSON.stringify(filter)}&queryID=${queryID}`;
        const resp = await ky(uri);
        const result: IApiResult = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
    },

    // eslint-disable-next-line consistent-return
    async get_via_post(resource: string, filter: any = {}, options: IRequestOptions = {}, queryID = '') {
        try {
            const resp = await ky(`${config.baseUri}/v1/${resource}/get_via_post`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filter,
                    options,
                    queryID,
                }),
                method: 'POST',
            });
            if (resp.ok) {
                return resp.json();
            }
        } catch (e) {
            log.error(`cannot get (get_via_post) ${resource},`
                + `\noptions: '${JSON.stringify(options)}', error: '${e.stack || e}'}`);

            throw new Error(`cannot get (get_via_post) ${resource},`
                + `\noptions: '${JSON.stringify(options)}', error: '${e}'}`);
        }
    },

    async create<ResType>(resource: string, data: ResType): Promise<ResType[]> {
        const url = `${config.baseUri}/v1/${resource}`;
        const resp = await ky.post(
            url,
            { json: data },
        );
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot create resource:
         '${url}', data: '${JSON.parse(data as any)}' resp: '${JSON.stringify(resp)}'`);
    },

    async update(resource: string, data: { [key: string]: any }) {
        const url = `${config.baseUri}/v1/${resource}/${data.name}`;
        const resp = await ky.patch(
            url,
            { json: data },
        );
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot update resource:
         '${url}', data: '${JSON.stringify(data)}' resp: '${JSON.stringify(resp)}'`);
    },

    async delete(resource: string, id: string) {
        const url = `${config.baseUri}/v1/${resource}/${id}`;
        const resp = await ky.delete(
            url,
        );
        if (resp.ok) {
            return;
        }
        throw new Error(`cannot delete resource:
        '${url}', id: '${id}' resp: '${JSON.stringify(resp)}'`);
    },

    async distinct(resource: string, field: string): Promise<string[]> {
        const uri = `${config.baseUri}/v1/${resource}/distinct?field=${field}`;
        const resp = await ky(uri);
        const result: string[] = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get distinct values: resource:
        '${uri}', field: '${field}', resp: '${JSON.stringify(resp)}'`);
    },
};
