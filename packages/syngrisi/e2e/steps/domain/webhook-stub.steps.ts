import { Given, Then } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';
import * as http from 'http';
import type { AddressInfo } from 'net';

const logger = createLogger('WebhookStubSteps');

type StubRequest = {
    method: string | undefined;
    url: string | undefined;
    headers: http.IncomingHttpHeaders;
    body: string;
};

// Minimal webhook-delivery receiver stub, mirroring github-status.steps.ts's stub server.
// Unlike the GitHub-status stub, webhook delivery targets a URL stored per-webhook in the DB
// (not an env var read at server startup), so no server restart is needed here - the stub just
// needs to be listening before the webhook is registered via "I create via http \"webhook\"".
Given(
    'I start a webhook stub server',
    async ({ testData }: { testData: TestStore }) => {
        const requests: StubRequest[] = [];
        const server = http.createServer((req, res) => {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
                requests.push({ method: req.method, url: req.url, headers: req.headers, body });
                logger.info(`Webhook stub received ${req.method} ${req.url}`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            });
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        const port = (server.address() as AddressInfo).port;
        const url = `http://127.0.0.1:${port}`;

        testData.set('webhookStubServer', server);
        testData.set('webhookStubRequests', requests);
        testData.set('webhookStubUrl', url);
        logger.info(`Webhook stub listening on ${url}`);
    }
);

Then(
    'the webhook stub should have received a POST for event {string}',
    async ({ testData }: { testData: TestStore }, event: string) => {
        const requests = (testData.get('webhookStubRequests') as StubRequest[]) || [];
        await expect.poll(
            () => requests.some((r) => {
                try { return JSON.parse(r.body)?.event === event; } catch { return false; }
            }),
            { timeout: 10_000, message: `waiting for a webhook POST for event "${event}"` }
        ).toBe(true);

        const match = requests.find((r) => {
            try { return JSON.parse(r.body)?.event === event; } catch { return false; }
        });
        expect(match, `no webhook request found for event "${event}"; received: ${JSON.stringify(requests)}`).toBeTruthy();
        expect(match!.method).toBe('POST');
        expect(match!.headers['x-syngrisi-event']).toBe(event);
        logger.info(`Webhook stub received expected POST for event "${event}": ${match!.body}`);
    }
);
