import { Webhook } from '@models';
import log from '@logger';

const triggerWebhooks = async (event: string, payload: any) => {
    const webhooks = await Webhook.find({ events: event });

    for (const webhook of webhooks) {
        try {
            log.info(`Triggering webhook ${webhook.url} for event ${event}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Syngrisi-Event': event,
                    'X-Syngrisi-Secret': webhook.secret || ''
                },
                body: JSON.stringify({
                    event,
                    payload,
                    timestamp: new Date().toISOString()
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            log.error(`Failed to trigger webhook ${webhook.url}: ${error}`);
        }
    }
};

export const webhookService = {
    triggerWebhooks
};
