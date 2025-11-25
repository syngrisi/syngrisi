import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { AppServerFixture } from '../../support/fixtures/app-server.fixture';

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
