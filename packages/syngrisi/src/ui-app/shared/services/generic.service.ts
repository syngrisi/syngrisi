import { stringify } from '@shared/utils/queryParams';
import config from '@config';
import ILog from '@shared/interfaces/ILog';
import { http } from '@shared/lib/http';

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
    sortOrder?: string | number
    apikey?: string | null
    [key: string]: any
}

export const GenericService = {
    async get(resource: string, filter: any = {}, options: IRequestOptions = {}, queryID = ''): Promise<IApiResult> {
        const queryOptions = { ...options, limit: options.limit || 10 };
        const queryOptionsString = stringify(queryOptions);
        const uri = `${config.baseUri}/v1/${resource}?${queryOptionsString}&filter=${JSON.stringify(filter)}&queryID=${queryID}`;
        const resp = await http.get(uri, {}, 'GenericService.get');
        return resp.json();
    },

    async create<ResType>(resource: string, data: ResType): Promise<ResType[]> {
        const url = `${config.baseUri}/v1/${resource}`;
        const resp = await http.post(url, data, {}, 'GenericService.create');
        return resp.json();
    },

    async update(resource: string, data: { [key: string]: any }) {
        const url = `${config.baseUri}/v1/${resource}/${data.name || data.id}`;
        const resp = await http.patch(url, data, {}, 'GenericService.update');
        return resp.json();
    },

    async delete(resource: string, id: string) {
        const url = `${config.baseUri}/v1/${resource}/${id}`;
        await http.delete(url, {}, 'GenericService.delete');
    },

    async distinct(resource: string, field: string): Promise<string[]> {
        const uri = `${config.baseUri}/v1/${resource}/distinct?field=${field}`;
        const resp = await http.get(uri, {}, 'GenericService.distinct');
        return resp.json();
    },
};
