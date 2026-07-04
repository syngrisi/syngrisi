import config from '@config';
import { http } from '@shared/lib/http';

export type WebhookEvent = 'check.created' | 'check.updated' | 'test.finished';

export interface IWebhook {
    id: string;
    url: string;
    events: WebhookEvent[];
    enabled: boolean;
    createdDate?: string;
}

export interface IWebhookListResult {
    results: IWebhook[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

export interface IWebhookInput {
    url: string;
    events: WebhookEvent[];
    // Write-only: accepted here, never returned by the API.
    secret?: string;
    enabled?: boolean;
}

export const WebhooksService = {
    async list(): Promise<IWebhookListResult> {
        const resp = await http.get<IWebhookListResult>(
            `${config.baseUri}/v1/webhooks?limit=0`,
            {},
            'WebhooksService.list'
        );
        return resp.json();
    },

    async create(data: IWebhookInput): Promise<IWebhook> {
        const resp = await http.post<IWebhook>(
            `${config.baseUri}/v1/webhooks`,
            data,
            {},
            'WebhooksService.create'
        );
        return resp.json();
    },

    async update(id: string, data: Partial<IWebhookInput>): Promise<IWebhook> {
        const resp = await http.patch<IWebhook>(
            `${config.baseUri}/v1/webhooks/${id}`,
            data,
            {},
            'WebhooksService.update'
        );
        return resp.json();
    },

    async remove(id: string): Promise<void> {
        await http.delete(`${config.baseUri}/v1/webhooks/${id}`, {}, 'WebhooksService.remove');
    },
};
