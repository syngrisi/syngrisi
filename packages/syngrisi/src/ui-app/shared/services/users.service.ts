import config from '@config';
import IUser from '@shared/interfaces/IUser';
import { http } from '@shared/lib/http';

export interface IApiResult {
    results: IUser[],
    page: number,
    limit: number,
    totalPages: number,
    totalResults: number,
}

export const UsersService = {
    async getApiKey(): Promise<{ apikey: string }> {
        const resp = await http.get(`${config.baseUri}/v1/auth/apikey`, {}, 'UsersService.getApiKey');
        return resp.json();
    },
    async getCurrentUser(): Promise<IUser> {
        const resp = await http.get(`${config.baseUri}/v1/users/current`, {}, 'UsersService.getCurrentUser');
        return resp.json();
    },
};
