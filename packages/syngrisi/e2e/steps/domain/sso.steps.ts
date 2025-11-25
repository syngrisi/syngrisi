import { When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppServerFixture } from '../../support/fixtures/app-server.fixture';
import { got } from 'got-cjs';

When(
    'I mock SSO provider redirect to callback with user {string}',
    async ({ page, appServer }: { page: Page, appServer: AppServerFixture }, email: string) => {
        // 1. Intercept SSO initiation request (/v1/auth/sso)
        // Instead of real redirect to Google, redirect browser to our Callback
        // but with "fake" auth code.
        await page.route('**/v1/auth/sso', async (route) => {
            const callbackUrl = `${appServer.baseURL}/v1/auth/sso/oauth/callback?code=mock_auth_code`;
            await route.fulfill({
                status: 302,
                headers: { Location: callbackUrl }
            });
        });
    }
);

// Store last response for assertions
let lastResponse: { status: number; body: any } | null = null;

When(
    'I request {string} {string}',
    async ({ appServer }: { appServer: AppServerFixture }, method: string, path: string) => {
        const url = `${appServer.baseURL}${path}`;
        const response = await got(url, {
            method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
            throwHttpErrors: false,
            responseType: 'json',
        });
        lastResponse = {
            status: response.statusCode,
            body: response.body,
        };
    }
);

Then(
    'the response status should be {int}',
    async ({}: {}, expectedStatus: number) => {
        expect(lastResponse).not.toBeNull();
        expect(lastResponse!.status).toBe(expectedStatus);
    }
);

Then(
    'the response body should contain {string}',
    async ({}: {}, expectedContent: string) => {
        expect(lastResponse).not.toBeNull();
        const bodyStr = typeof lastResponse!.body === 'string'
            ? lastResponse!.body
            : JSON.stringify(lastResponse!.body);
        expect(bodyStr).toContain(expectedContent);
    }
);
