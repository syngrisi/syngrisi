import { Given, When, Then } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';
import * as http from 'http';
import type { AddressInfo } from 'net';
import * as crypto from 'crypto';

const logger = createLogger('GithubStatusSteps');

type AnyDriver = any;

type StubRequest = {
    method: string | undefined;
    url: string | undefined;
    headers: http.IncomingHttpHeaders;
    body: string;
};

const CHECK_PARAMS = { os: 'macOS', browserName: 'chrome', browserVersion: '120', viewport: '1366x768' };

function idOf(value: any): string {
    return value?._id || value?.id || value;
}

Given(
    'I start a GitHub status stub server',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const requests: StubRequest[] = [];
        const server = http.createServer((req, res) => {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', () => {
                requests.push({ method: req.method, url: req.url, headers: req.headers, body });
                logger.info(`GitHub status stub received ${req.method} ${req.url}`);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ state: 'success' }));
            });
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        const port = (server.address() as AddressInfo).port;

        testData.set('githubStubServer', server);
        testData.set('githubStubRequests', requests);

        process.env.SYNGRISI_GITHUB_API_URL = `http://127.0.0.1:${port}`;
        logger.info(`GitHub status stub listening on port ${port}, restarting server to apply SYNGRISI_GITHUB_API_URL`);
        if (appServer.baseURL) {
            await appServer.restart();
        }
    }
);

When(
    'I start an SDK test session for app {string} with commit {string}',
    async (
        { testData }: { testData: TestStore },
        app: string,
        commit: string,
    ) => {
        const driver = testData.get('sdkDriver') as AnyDriver;
        const branch = 'integration';
        const params = {
            app,
            test: `Github Status Test ${crypto.randomUUID().slice(0, 8)}`,
            run: 'github_status_run',
            runident: crypto.randomUUID(),
            branch,
            suite: 'Github status suite',
            tags: [],
            commit,
            ...CHECK_PARAMS,
            browserFullVersion: '120.0.0.0',
        };
        const session = await driver.startTestSession({ params });
        testData.set('sdkApp', app);
        testData.set('sdkBranch', branch);
        testData.set('sdkSession', session);
        logger.info(`Started SDK session for app "${app}" with commit "${commit}" (testId=${idOf(session)})`);
    }
);

Then(
    'the GitHub status stub should have received a status POST for commit {string} with state {string}',
    async ({ testData }: { testData: TestStore }, commit: string, state: string) => {
        const requests = (testData.get('githubStubRequests') as StubRequest[]) || [];
        await expect.poll(
            () => requests.some((r) => (r.url || '').endsWith(`/statuses/${commit}`)),
            { timeout: 10_000, message: `waiting for a status POST for commit "${commit}"` }
        ).toBe(true);

        const match = requests.find((r) => (r.url || '').endsWith(`/statuses/${commit}`));
        expect(match, `no request found for commit "${commit}"; received: ${JSON.stringify(requests)}`).toBeTruthy();
        expect(match!.method).toBe('POST');
        expect(match!.headers['authorization']).toMatch(/^Bearer /);

        const body = JSON.parse(match!.body);
        expect(body.state).toBe(state);
        expect(body.context).toBe('syngrisi/visual');
        logger.info(`GitHub status stub received expected status POST: ${JSON.stringify(body)}`);
    }
);

Then(
    'the GitHub status stub should have received no requests',
    async ({ testData }: { testData: TestStore }) => {
        // Negative assertion: give the fire-and-forget notifier a moment to (not) fire.
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const requests = (testData.get('githubStubRequests') as StubRequest[]) || [];
        expect(requests, `expected no requests, received: ${JSON.stringify(requests)}`).toHaveLength(0);
    }
);
