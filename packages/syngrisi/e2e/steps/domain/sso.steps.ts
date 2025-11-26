import { Given, When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppServerFixture } from '../../support/fixtures/app-server.fixture';
import type { SSOServerFixture } from '../../support/fixtures/sso-server.fixture';
import { got } from 'got-cjs';

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

// ==========================================
// Logto SSO Step Definitions
// ==========================================

/**
 * Start Logto SSO infrastructure
 */
Given('I start Logto SSO infrastructure', async ({ ssoServer }: { ssoServer: SSOServerFixture }) => {
    await ssoServer.startLogto();
});

/**
 * Stop Logto SSO infrastructure
 */
Given('I stop Logto SSO infrastructure', async ({ ssoServer }: { ssoServer: SSOServerFixture }) => {
    await ssoServer.stopLogto();
});

/**
 * Verify Logto is running
 */
Then('Logto SSO should be available', async ({ ssoServer }: { ssoServer: SSOServerFixture }) => {
    const isRunning = await ssoServer.isLogtoRunning();
    expect(isRunning).toBe(true);
});

/**
 * Configure SSO with client credentials
 *
 * If clientSecret is "auto-provisioned", credentials will be loaded from
 * provisioned-config.json (created by setup-logto.sh)
 */
When(
    'I configure SSO with client ID {string} and secret {string}',
    async ({ ssoServer }: { ssoServer: SSOServerFixture }, clientId: string, clientSecret: string) => {
        let actualClientId = clientId;
        let actualClientSecret = clientSecret;

        // Handle auto-provisioned credentials
        if (clientSecret === 'auto-provisioned') {
            const provisionedCreds = ssoServer.getProvisionedCredentials();
            if (provisionedCreds) {
                actualClientId = provisionedCreds.clientId;
                actualClientSecret = provisionedCreds.clientSecret;
            } else {
                throw new Error(
                    'auto-provisioned secret requested but provisioned-config.json not found. ' +
                    'Run setup-logto.sh first or provide explicit credentials.'
                );
            }
        }

        const envVars = ssoServer.getSSOEnvVars({
            clientId: actualClientId,
            clientSecret: actualClientSecret,
        });

        // Set env vars for subsequent server start
        Object.entries(envVars).forEach(([key, value]) => {
            process.env[key] = value;
        });
    }
);

/**
 * Click SSO login button
 */
When('I click SSO login button', async ({ page }: { page: Page }) => {
    const ssoButton = page.locator("a[href*='/v1/auth/sso']");
    await ssoButton.click();
});

/**
 * Verify SSO button is visible
 */
Then('the SSO login button should be visible', async ({ page }: { page: Page }) => {
    const ssoButton = page.locator("a[href*='/v1/auth/sso']");
    await expect(ssoButton).toBeVisible();
});

/**
 * Verify SSO button is not visible
 */
Then('the SSO login button should not be visible', async ({ page }: { page: Page }) => {
    const ssoButton = page.locator("a[href*='/v1/auth/sso']");
    await expect(ssoButton).not.toBeVisible();
});

/**
 * Fill Logto login form
 *
 * Note: Logto uses 2-step authentication flow:
 * 1. Enter email/username -> Submit
 * 2. Enter password -> Submit
 */
When(
    'I login to Logto with email {string} and password {string}',
    async ({ page }: { page: Page }, email: string, password: string) => {
        // Wait for Logto page to load
        await page.waitForLoadState('networkidle');

        // If on sign-up page, click "Sign in" link to go to login
        const signInLink = page.locator('a:has-text("Sign in")');
        if (await signInLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await signInLink.click();
            await page.waitForLoadState('networkidle');
        }

        // Wait for Logto login page - identifier input
        await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

        // Fill email/username
        await page.fill('input[name="identifier"]', email);
        await page.click('button[type="submit"]');

        // Wait for password field (Logto has 2-step login)
        await page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
    }
);

/**
 * Fill Logto login form with username (single-page form)
 *
 * Note: When Logto is configured for username sign-in, it shows
 * both username and password fields on the same page.
 */
When(
    'I login to Logto with username {string} and password {string}',
    async ({ page }: { page: Page }, username: string, password: string) => {
        // Wait for Logto page to fully load
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');

        // If on sign-up page, click "Sign in" link to go to login
        const signInLink = page.locator('a:has-text("Sign in")');
        if (await signInLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await signInLink.click();
            await page.waitForLoadState('networkidle');
        }

        // Wait for Logto login page - identifier input to be visible and enabled
        const identifierInput = page.locator('input[name="identifier"]');
        await identifierInput.waitFor({ state: 'visible', timeout: 15000 });

        // Clear and fill username
        await identifierInput.clear();
        await identifierInput.fill(username);

        // Small delay to ensure input is registered
        await page.waitForTimeout(100);

        // Check if password field is already visible (single-page form)
        const passwordField = page.locator('input[type="password"]');
        if (await passwordField.isVisible({ timeout: 2000 }).catch(() => false)) {
            // Single-page form: fill password and submit
            await passwordField.clear();
            await passwordField.fill(password);
            await page.waitForTimeout(100);

            // Click submit and wait for navigation
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
                page.click('button[type="submit"]'),
            ]);
        } else {
            // 2-step form: submit identifier first, then password
            await page.click('button[type="submit"]');
            await page.waitForSelector('input[type="password"]', { timeout: 15000 });
            await passwordField.clear();
            await passwordField.fill(password);
            await page.waitForTimeout(100);

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
                page.click('button[type="submit"]'),
            ]);
        }
    }
);

/**
 * Register a new user in Logto
 */
When(
    'I register in Logto with email {string} and password {string}',
    async ({ page }: { page: Page }, email: string, password: string) => {
        // Wait for Logto page to load
        await page.waitForLoadState('networkidle');

        // Click "Create account" link if visible
        const createAccountLink = page.locator('a:has-text("Create account")');
        if (await createAccountLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await createAccountLink.click();
            await page.waitForLoadState('networkidle');
        }

        // Fill email
        await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
        await page.fill('input[name="identifier"]', email);
        await page.click('button[type="submit"]');

        // Wait for password field and fill it
        await page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await page.fill('input[type="password"]', password);

        // Fill confirm password if present
        const confirmPassword = page.locator('input[name="confirmPassword"]');
        if (await confirmPassword.isVisible({ timeout: 1000 }).catch(() => false)) {
            await confirmPassword.fill(password);
        }

        await page.click('button[type="submit"]');
    }
);

/**
 * Wait for redirect back to app after SSO login
 */
Then('I should be redirected back to the app', async ({ page, appServer }: { page: Page, appServer: AppServerFixture }) => {
    // Wait for redirect to app URL with longer timeout for OAuth flow
    // OAuth callback can take time due to token exchange
    await page.waitForURL(`${appServer.baseURL}/**`, { timeout: 30000 });

    // Wait for page to stabilize after redirect
    await page.waitForLoadState('networkidle');
});

/**
 * Verify successful SSO authentication
 */
Then('I should be authenticated via SSO', async ({ page }: { page: Page }) => {
    // Check that we're on the main page (authenticated)
    await expect(page).toHaveTitle(/By Runs/);
});
