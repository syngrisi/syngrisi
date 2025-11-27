import { Given, When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppServerFixture } from '../../support/fixtures/app-server.fixture';
import type { SSOServerFixture } from '../../support/fixtures/sso-server.fixture';
import { got } from 'got-cjs';
import { MongoClient } from 'mongodb';

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
    async ({ }: {}, expectedStatus: number) => {
        expect(lastResponse).not.toBeNull();
        expect(lastResponse!.status).toBe(expectedStatus);
    }
);

Then(
    'the response body should contain {string}',
    async ({ }: {}, expectedContent: string) => {
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

        // Verify input value
        await expect(identifierInput).toHaveValue(username);

        // Check if password field is already visible (single-page form)
        const passwordField = page.locator('input[type="password"]');
        if (await passwordField.isVisible({ timeout: 2000 }).catch(() => false)) {
            // Single-page form: fill password and submit
            await passwordField.clear();
            await passwordField.fill(password);
            await expect(passwordField).toHaveValue(password);

            // Click submit and wait for navigation
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => { }),
                page.click('button[type="submit"]'),
            ]);
        } else {
            // 2-step form: submit identifier first, then password
            await page.click('button[type="submit"]');
            await page.waitForSelector('input[type="password"]', { timeout: 15000 });
            await passwordField.clear();
            await passwordField.fill(password);
            await expect(passwordField).toHaveValue(password);

            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => { }),
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

// ==========================================
// SAML SSO Step Definitions
// ==========================================

/**
 * Configure SAML SSO with auto-provisioned settings
 *
 * Loads SAML configuration from provisioned-config.json
 * SSO_CERT must be provided via environment variable
 */
When(
    'I configure SAML SSO with auto-provisioned settings',
    async ({ ssoServer }: { ssoServer: SSOServerFixture }) => {
        const samlConfig = ssoServer.getProvisionedSAMLConfig();

        if (!samlConfig) {
            throw new Error(
                'SAML configuration not found in provisioned-config.json. ' +
                'Run provision-logto-api.sh first or ensure SAML section is configured.'
            );
        }

        const envVars = ssoServer.getSAMLSSOEnvVars(samlConfig);

        // Check that SSO_CERT is available (from provisioned config or env)
        if (!envVars.SSO_CERT && !process.env.SSO_CERT) {
            throw new Error(
                'SSO_CERT not found in provisioned config or environment. ' +
                'Run provision-logto-api.sh to generate SAML certificate.'
            );
        }

        // Set env vars for subsequent server start
        Object.entries(envVars).forEach(([key, value]) => {
            process.env[key] = value;
        });

        // Log SAML config for debugging
        console.log('[SAML Config]', {
            entryPoint: envVars.SSO_ENTRY_POINT,
            issuer: envVars.SSO_ISSUER,
            certLength: envVars.SSO_CERT?.length || 0,
        });
    }
);

/**
 * Configure SAML SSO with explicit parameters
 */
When(
    'I configure SAML SSO with entry point {string} and issuer {string}',
    async ({ ssoServer }: { ssoServer: SSOServerFixture }, entryPoint: string, issuer: string) => {
        const envVars = ssoServer.getSAMLSSOEnvVars({
            endpoints: { entryPoint, issuer },
            spEntityId: issuer,
        });

        // Check that SSO_CERT is provided via environment
        if (!process.env.SSO_CERT) {
            throw new Error(
                'SSO_CERT environment variable is required for SAML but not set.'
            );
        }

        // Set env vars for subsequent server start
        Object.entries(envVars).forEach(([key, value]) => {
            process.env[key] = value;
        });
    }
);

/**
 * Fill SAML IdP login form (generic - works with most SAML IdPs)
 *
 * This step handles login on a generic SAML Identity Provider
 */
When(
    'I login to SAML IdP with username {string} and password {string}',
    async ({ page }: { page: Page }, username: string, password: string) => {
        // Wait for IdP login page to load
        await page.waitForLoadState('networkidle');

        // Try common username field selectors
        const usernameSelectors = [
            'input[name="username"]',
            'input[name="user"]',
            'input[name="email"]',
            'input[id="username"]',
            'input[type="text"]',
        ];

        let usernameField = null;
        for (const selector of usernameSelectors) {
            const field = page.locator(selector).first();
            if (await field.isVisible({ timeout: 1000 }).catch(() => false)) {
                usernameField = field;
                break;
            }
        }

        if (!usernameField) {
            throw new Error('Could not find username field on SAML IdP login page');
        }

        await usernameField.fill(username);

        // Find and fill password field
        const passwordField = page.locator('input[type="password"]').first();
        await passwordField.fill(password);

        // Find and click submit button
        const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
        await submitButton.click();

        // Wait for form submission
        await page.waitForLoadState('networkidle');
    }
);

// ==========================================
// SSO Common Step Definitions
// ==========================================

/**
 * Verify SSO is disabled (no SSO button visible)
 */
Then('SSO login should be disabled', async ({ page }: { page: Page }) => {
    const ssoButton = page.locator("a[href*='/v1/auth/sso']");
    await expect(ssoButton).not.toBeVisible();
});

/**
 * Verify redirected to login page with error
 */
Then('I should be redirected to login page with error {string}', async ({ page }: { page: Page }, errorParam: string) => {
    await page.waitForURL(`**/auth**`, { timeout: 10000 });
    const url = page.url();
    expect(url).toContain(`error=${errorParam}`);
});

/**
 * Try to access SSO directly when disabled
 */
When('I try to access SSO directly', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }) => {
    await page.goto(`${appServer.baseURL}/v1/auth/sso`);
    await page.waitForLoadState('networkidle');
});

/**
 * Verify user session is destroyed after logout
 */
Then('my session should be destroyed', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }) => {
    // Try to access a protected page
    await page.goto(`${appServer.baseURL}/`);
    await page.waitForLoadState('networkidle');

    // Should be redirected to login
    expect(page.url()).toContain('/auth');
});

/**
 * Check user provider type in database (via API)
 */
Then(
    'the user {string} should have provider type {string}',
    async ({ appServer }: { appServer: AppServerFixture }, email: string, expectedProvider: string) => {
        const client = new MongoClient(appServer.config.connectionString);
        try {
            await client.connect();
            const db = client.db();
            const user = await db.collection('vrsusers').findOne({ username: email });
            expect(user, `User with email ${email} not found`).not.toBeNull();
            expect(user!.provider).toBe(expectedProvider);
        } finally {
            await client.close();
        }
    }
);

/**
 * Verify user was created in database
 */
Then(
    'a new user {string} should be created with role {string}',
    async ({ appServer }: { appServer: AppServerFixture }, email: string, expectedRole: string) => {
        const client = new MongoClient(appServer.config.connectionString);
        try {
            await client.connect();
            const db = client.db();
            const user = await db.collection('vrsusers').findOne({ username: email });
            expect(user, `User with email ${email} not found`).not.toBeNull();
            expect(user!.role).toBe(expectedRole);
        } finally {
            await client.close();
        }
    }
);

/**
 * Reset user's provider to 'local' for testing account linking
 * This ensures test isolation when running multiple SSO provider tests
 */
When(
    'I reset user {string} provider to local',
    async ({ appServer }: { appServer: AppServerFixture }, email: string) => {
        const client = new MongoClient(appServer.config.connectionString);
        try {
            await client.connect();
            const db = client.db();
            await db.collection('vrsusers').updateOne(
                { username: email },
                { $set: { provider: 'local', providerId: null } }
            );
        } finally {
            await client.close();
        }
    }
);
