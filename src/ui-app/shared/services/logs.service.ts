import ky from 'ky';

import queryString from 'query-string';
import config from '../../config';
import ILog from '../interfaces/ILog';

export interface IApiResult {
    results: ILog[],
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

export const LogsService = {
    async getLogs(filter: any = {}, options: IRequestOptions = {}): Promise<IApiResult> {
        const queryOptions = { ...options, limit: options.limit || 10 };
        const queryOptionsString = queryString.stringify(queryOptions);
        const uri = `${config.baseUri}/v1/logs?${queryOptionsString}&filter=${JSON.stringify(filter)}`;
        const resp = await ky(uri);
        const result: IApiResult = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
    },

    async distinct(field: string): Promise<string[]> {
        const uri = `${config.baseUri}/v1/logs/distinct?field=${field}`;
        const resp = await ky(uri);
        const result: string[] = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
    },
};
