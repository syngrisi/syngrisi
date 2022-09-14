import ky from 'ky';
import config from '../../config';

export const SettingsService = {
    async getSettings() {
        const uri = `${config.baseUri}/v1/settings`;
        const resp = await ky(uri);
        const result = await resp.json();
        if (resp.ok) {
            return result;
        }
        throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
    },
    async update(data: { name: string, value: string, enabled: boolean }) {
        const url = `${config.baseUri}/v1/settings/${data.name}`;
        const resp = await ky.patch(
            url,
            { json: data },
        );
        if (resp.ok) {
            return resp.json();
        }
        throw new Error(`cannot update resource: '${url}', resp: '${JSON.stringify(resp)}'`);
    },
};
