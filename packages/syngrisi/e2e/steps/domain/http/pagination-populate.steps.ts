import { Then } from '@fixtures';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';
import type { AppServerFixture, TestStore } from '@fixtures';

// Self-contained (request + assert, no shared module state) so it is safe under
// parallel workers. Captures the status even when the request rejects on a
// non-2xx response (got-style error carries `response.statusCode`).
Then(
    'a GET to {string} responds with status {int}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        path: string,
        expectedStatus: number
    ) => {
        const uri = `${appServer.baseURL}${path}`;
        let actualStatus: number | null = null;
        try {
            const res = await requestWithSession(uri, testData, appServer, { method: 'GET' });
            actualStatus = res.raw.statusCode;
        } catch (e: unknown) {
            actualStatus = (e as { response?: { statusCode?: number } })?.response?.statusCode ?? null;
        }
        expect(actualStatus, `GET ${path}`).toBe(expectedStatus);
    }
);
