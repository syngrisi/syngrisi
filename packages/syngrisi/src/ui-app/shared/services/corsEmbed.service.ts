import config from '@config';
import { http } from '@shared/lib/http';

export type CorsEmbedSameSite = 'lax' | 'none';
export type CorsEmbedRole = 'admin' | 'reviewer' | 'user';
export type CorsEmbedAcceptStatus = 'new' | 'not_accepted' | 'different_images' | 'wrong_dimensions';

export interface CorsEmbedSettings {
    enabled: boolean;
    allowedOrigins: string[];
    allowCredentials: boolean;
    sameSite: CorsEmbedSameSite;
    csrfRequired: boolean;
    allowedAcceptRoles: CorsEmbedRole[];
    allowedAcceptStatuses: CorsEmbedAcceptStatus[];
    frameAncestors: string[];
}

export interface CorsEmbedSettingsResponse {
    name: string;
    value: CorsEmbedSettings;
}

export const CorsEmbedService = {
    async get(): Promise<CorsEmbedSettings> {
        const resp = await http.get<CorsEmbedSettingsResponse>(
            `${config.baseUri}/v1/cors-embed`,
            {},
            'CorsEmbedService.get',
        );
        const body = await resp.json();
        return body.value;
    },

    async update(value: CorsEmbedSettings): Promise<CorsEmbedSettings> {
        const resp = await http.put<CorsEmbedSettingsResponse>(
            `${config.baseUri}/v1/cors-embed`,
            { value },
            {},
            'CorsEmbedService.update',
        );
        const body = await resp.json();
        return body.value;
    },

    async prepareCookie(): Promise<{ ok: boolean; sameSite: CorsEmbedSameSite; csrfToken: string; message: string }> {
        const resp = await http.post<{
            ok: boolean;
            sameSite: CorsEmbedSameSite;
            csrfToken: string;
            message: string;
        }>(
            `${config.baseUri}/v1/cors-embed/prepare-cookie`,
            {},
            {},
            'CorsEmbedService.prepareCookie',
        );
        return resp.json();
    },
};
