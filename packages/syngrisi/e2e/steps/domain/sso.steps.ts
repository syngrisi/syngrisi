import { Given, When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { AppServerFixture } from '../../support/fixtures/app-server.fixture';
import type { SSOServerFixture } from '../../support/fixtures/sso-server.fixture';
import { got } from 'got-cjs';
import { MongoClient } from 'mongodb';
import type { TestStore } from '@fixtures';

// Store last response for assertions
let lastResponse: { status: number; body: any } | null = null;

When(
    'I request {string} {string}',
    async ({ appServer }: { appServer: AppServerFixture }, method: string, path: string) => {
        const url = `${appServer.baseURL}${path}`;
        // Use 'text' responseType to handle both JSON and XML responses
        const response = await got(url, {
            method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
            throwHttpErrors: false,
            responseType: 'text',
        });

        // Try to parse as JSON if it looks like JSON, otherwise keep as text
        let body: string | Record<string, unknown> = response.body;
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                body = JSON.parse(response.body);
            } catch {
                // Keep as text if JSON parsing fails
            }
        }

        lastResponse = {
            status: response.statusCode,
            body,
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

        // Wait for Logto login page - identifier input (increased timeout for cold start)
        await page.waitForSelector('input[name="identifier"]', { timeout: 60000 });

        // Fill email/username
        await page.fill('input[name="identifier"]', email);
        await page.click('button[type="submit"]');

        // Wait for password field (Logto has 2-step login)
        await page.waitForSelector('input[type="password"]', { timeout: 30000 });
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');

        // Wait for redirect back to app (give more time for cold start + consent)
        await page.waitForURL(/http:\/\/127\.0\.0\.1:3002|http:\/\/localhost:3002/, { timeout: 120000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    }
);

/**
 * Directly perform Logto OAuth login using provisioned app and user
 */
When(
    'I perform direct Logto SSO login with provisioned user',
    async ({ page, ssoServer, appServer }: { page: Page; ssoServer: SSOServerFixture; appServer: any }) => {
        const creds = ssoServer.getProvisionedCredentials();
        const user = ssoServer.getProvisionedUser();
        if (!creds?.clientId || !creds?.clientSecret) {
            throw new Error('Provisioned Logto app credentials not found.');
        }
        if (!user?.email || !user?.password) {
            throw new Error('Provisioned Logto user not found.');
        }

        const logtoEndpoint = ssoServer.logtoConfig?.endpoint || 'http://localhost:3001';
        const authUrl = `${logtoEndpoint}/oidc/auth`;
        const redirectUri = `${appServer?.baseURL || 'http://127.0.0.1:3002'}/v1/auth/sso/oauth/callback`;
        const url = `${authUrl}?client_id=${encodeURIComponent(creds.clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&state=e2e`;

        await page.goto(url, { waitUntil: 'networkidle' });
        // Logto may redirect to Sign-In Experience at /sign-in?app_id=...
        // Accept either direct /oidc/auth or /sign-in path.
        const currentUrl = page.url();
        if (!(currentUrl.includes('/oidc/auth') || currentUrl.includes('/sign-in'))) {
            throw new Error(`Failed to open Logto auth page, current URL: ${currentUrl}`);
        }

        // 2-step login: identifier then password
        const identifierInput = page.locator('input[name="identifier"]');
        await identifierInput.waitFor({ state: 'visible', timeout: 60000 });
        const identifier = user.username || user.email;
        await identifierInput.fill(identifier);
        await page.click('button[type="submit"]');

        const passwordInput = page.locator('input[type="password"]');
        await passwordInput.waitFor({ state: 'visible', timeout: 60000 });
        await passwordInput.fill(user.password);
        await page.click('button[type="submit"]');

        await page.waitForURL(new RegExp(`${appServer?.baseURL || 'http://127.0.0.1:3002'}`), { timeout: 120000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    }
);

/**
 * Login to Logto using provisioned test user on the current Logto page
 * (relies on SSO button redirect to preserve state)
 */
When(
    'I login to Logto with provisioned user',
    async ({ page, ssoServer, appServer }: { page: Page; ssoServer: SSOServerFixture; appServer: any }) => {
        const user = ssoServer.getProvisionedUser();
        if (!user?.password) {
            throw new Error('Provisioned Logto user credentials not found.');
        }

        const identifier = user.username || user.email;
        if (!identifier) {
            throw new Error('Provisioned Logto user missing username/email.');
        }

        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');

        // If the Sign in link is present (from sign-up page), navigate to it
        const signInLink = page.locator('a:has-text("Sign in")');
        if (await signInLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await signInLink.click();
            await page.waitForLoadState('networkidle');
        }

        const identifierInput = page.locator('input[name="identifier"]');
        await identifierInput.waitFor({ state: 'visible', timeout: 90000 });
        await identifierInput.fill(identifier);

        const passwordField = page.locator('input[type="password"]');

        if (await passwordField.isVisible({ timeout: 2000 }).catch(() => false)) {
            await passwordField.fill(user.password);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => { }),
                page.click('button[type="submit"]'),
            ]);
        } else {
            await page.click('button[type="submit"]');
            await passwordField.waitFor({ state: 'visible', timeout: 30000 });
            await passwordField.fill(user.password);
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => { }),
                page.click('button[type="submit"]'),
            ]);
        }

        await page.waitForURL(`${appServer?.baseURL || 'http://127.0.0.1:3002'}/**`, { timeout: 120000 });
        await page.waitForLoadState('networkidle');
    }
);

/**
 * Optionally open Logto Admin console and show the Syngrisi application settings.
 * Skips entirely when SKIP_DEMO_TESTS=true to keep silent runs fast.
 */
When('I show Logto admin application settings', async ({ page }: { page: Page }) => {
    if (process.env.SKIP_DEMO_TESTS === 'true') {
        console.log('[Demo] SKIP_DEMO_TESTS is true, skipping Logto admin console preview.');
        return;
    }

    const adminUrl = 'http://localhost:3050';
    await page.goto(adminUrl, { waitUntil: 'networkidle' });

    // Log in to Logto Admin with provisioned admin user
    const identifierInput = page.locator('input[name="identifier"]');
    await identifierInput.waitFor({ state: 'visible', timeout: 60000 });
    await identifierInput.fill('admin');
    await page.click('button[type="submit"]');

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 30000 });
    await passwordInput.fill('Admin123!');
    await page.click('button[type="submit"]');

    // Navigate to Applications and open Syngrisi app
    const applicationsLink = page.locator('a:has-text("Applications")').first();
    await applicationsLink.waitFor({ state: 'visible', timeout: 60000 });
    await applicationsLink.click();

    const syngrisiApp = page.locator('text=syngrisi-e2e-app').first();
    await syngrisiApp.waitFor({ state: 'visible', timeout: 60000 });
    await syngrisiApp.click();

    // Wait for Redirect URIs section to load (best-effort)
    await page.waitForSelector('text=Redirect URIs', { timeout: 30000 }).catch(() => { });
});

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

        // Wait for Logto login page - identifier input to be visible and enabled (increased timeout for cold start)
        const identifierInput = page.locator('input[name="identifier"]');
        await identifierInput.waitFor({ state: 'visible', timeout: 90000 });

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
            await page.waitForSelector('input[type="password"]', { timeout: 30000 });
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

        // Fill email (increased timeout for cold start)
        await page.waitForSelector('input[name="identifier"]', { timeout: 60000 });
        await page.fill('input[name="identifier"]', email);
        await page.click('button[type="submit"]');

        // Wait for password field and fill it
        await page.waitForSelector('input[type="password"]', { timeout: 30000 });
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

// ==========================================
// Logto Admin Console Step Definitions
// ==========================================

/**
 * Complete first-time Logto admin onboarding or log in if admin already exists
 */
When(
    'I complete Logto admin onboarding with username {string} email {string} and password {string}',
    async (
        { page, ssoServer, testData }: { page: Page; ssoServer: SSOServerFixture; testData: TestStore },
        username: string,
        email: string,
        password: string
    ) => {
        const adminUrl = ssoServer.getProvisionedAdmin()?.consoleUrl || 'http://localhost:3050';
        await page.goto(adminUrl);
        await page.waitForLoadState('networkidle');

        // If we landed on a 404 shell, try known sign-in paths
        const ensureLoginPage = async () => {
            const identifierInput = page.locator('input[name="identifier"], input[name="username"]');
            const notFoundText = page.getByText(/404 Not Found|Session not found/i);

            const candidates = [
                adminUrl,
                `${adminUrl.replace(/\/$/, '')}/sign-in`,
                `${adminUrl.replace(/\/$/, '')}/admin`,
                `${adminUrl.replace(/\/$/, '')}/admin/sign-in`,
                `${adminUrl.replace(/\/$/, '')}/console`,
                `${adminUrl.replace(/\/$/, '')}/console/sign-in`,
            ];

            for (const url of candidates) {
                await page.goto(url);
                await page.waitForLoadState('networkidle');
                if (await identifierInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                    return;
                }
            }

            // If still on 404, surface a clearer error
            if (await notFoundText.isVisible({ timeout: 3000 }).catch(() => false)) {
                throw new Error('Logto Admin sign-in page not available (404).');
            }
        };

        await ensureLoginPage();

        // If admin already exists, log in and return
        const identifierInput = page.locator('input[name="identifier"]');
        if (await identifierInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await identifierInput.fill(username);
            await page.click('button[type="submit"]');
            await page.waitForSelector('input[type="password"]', { timeout: 30000 });
            await page.fill('input[type="password"]', password);
            await Promise.all([
                page.waitForLoadState('networkidle'),
                page.click('button[type="submit"]'),
            ]);
            testData.set('logtoAdmin', { username, email, password, consoleUrl: adminUrl });
            return;
        }

        // Onboarding flow: create first admin account
        const usernameField = page.locator('input[name="username"], input[name="identifier"]');
        await usernameField.waitFor({ state: 'visible', timeout: 60000 });
        await usernameField.fill(username);

        const emailField = page.locator('input[type="email"], input[name="email"]').first();
        if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
            await emailField.fill(email);
        }

        const passwordField = page.locator('input[type="password"]').first();
        await passwordField.fill(password);

        const createButton = page.getByRole('button', { name: /create|continue|next|sign up|submit/i }).first();
        await createButton.click();
        await page.waitForLoadState('networkidle');

        testData.set('logtoAdmin', { username, email, password, consoleUrl: adminUrl });
    }
);

/**
 * Create first Logto admin account (welcome screen)
 */
When(
    'I create first Logto admin with username {string} email {string} and password {string}',
    async (
        { page, ssoServer, testData }: { page: Page; ssoServer: SSOServerFixture; testData: TestStore },
        username: string,
        email: string,
        password: string
    ) => {
        // Navigate to admin console root explicitly (fresh instance has welcome screen here)
        const baseUrl = ssoServer.logtoConfig?.adminEndpoint || 'http://localhost:3050';
        await page.goto(baseUrl, { waitUntil: 'networkidle' });

        // Click "Create account" on welcome screen
        const createBtn = page.getByRole('button', { name: /create account/i });
        if (!(await createBtn.isVisible({ timeout: 3000 }).catch(() => false))) {
            // If we landed on an error/session screen, try to go back to welcome or hash route
            const back = page.getByRole('link', { name: /back/i }).first();
            if (await back.isVisible({ timeout: 2000 }).catch(() => false)) {
                await back.click().catch(() => {});
                await page.waitForLoadState('networkidle').catch(() => {});
            }
            await page.goto(`${baseUrl}/#/welcome`, { waitUntil: 'networkidle' }).catch(() => {});
            await page.waitForTimeout(500);
        }

        await createBtn.click();
        await page.waitForLoadState('networkidle');

        // Fill profile fields
        const usernameInput = page.getByLabel(/username/i).first();
        const emailInput = page.getByLabel(/email/i).first();
        const passwordInput = page.getByLabel(/password/i).first();

        await usernameInput.fill(username);
        await emailInput.fill(email);
        await passwordInput.fill(password);

        // Submit
        const nextBtn = page.getByRole('button', { name: /next|continue|create/i }).first();
        await nextBtn.click();
        await page.waitForLoadState('networkidle');

        testData.set('logtoAdmin', { username, email, password, consoleUrl: 'http://localhost:3050' });
    }
);

/**
 * Create OIDC application via Logto Admin UI and store client credentials
 */
When(
    'I create Logto OIDC application named {string} with redirect uri {string}',
    async ({ page, ssoServer, testData }: { page: Page; ssoServer: SSOServerFixture; testData: TestStore }, appName: string, redirectUri: string) => {
        const adminConfig = testData.get('logtoAdmin') || ssoServer.getProvisionedAdmin();
        const baseUrl = (adminConfig && adminConfig.consoleUrl) ? adminConfig.consoleUrl : 'http://localhost:3050';

        // Try direct creation route to skip any onboarding list views
        await page.goto(`${baseUrl}/applications/create`);
        await page.waitForLoadState('networkidle');

        // Handle onboarding/experience screens if present
        const handleExperience = async () => {
            const ctas = [
                /start building/i,
                /get started/i,
                /continue/i,
                /next/i,
                /done/i,
                /skip/i,
                /finish/i,
            ];
            for (const cta of ctas) {
                const btn = page.getByRole('button', { name: cta }).first();
                if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
                    await btn.click().catch(() => {});
                    await page.waitForLoadState('networkidle').catch(() => {});
                }
            }
        };
        await handleExperience();

        // Fall back to applications list if direct route did not render form
        const createButton = page.getByRole('button', { name: /create application|create app|new application|add application/i }).first();
        if (!(await createButton.isVisible({ timeout: 3000 }).catch(() => false))) {
            await page.goto(`${baseUrl}/applications`);
            await page.waitForLoadState('networkidle');
        }

        // Start app creation from the list view (or confirm we are on create page)
        if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await createButton.click();
        }

        // Select Traditional web app type (Logto UI shows cards)
        const traditionalCard = page.getByText(/traditional web app|traditional web|web app/i).first();
        await traditionalCard.waitFor({ state: 'visible', timeout: 20000 });
        await traditionalCard.click();

        const continueButton = page.getByRole('button', { name: /next|continue|create/i }).first();
        if (await continueButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await continueButton.click();
        }

        // Fill app name and redirect URIs
        const nameInput = page.getByLabel(/name/i).first();
        if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await nameInput.fill(appName);
        }

        const redirectInput = page.locator('input[type="url"], input[name*="redirect"], input[placeholder*="redirect"]').first();
        await redirectInput.waitFor({ state: 'visible', timeout: 20000 });
        await redirectInput.fill(redirectUri);
        await redirectInput.press('Enter').catch(() => {});

        const postLogoutInput = page.locator('input[name*="postLogout"], input[placeholder*="logout"]').first();
        if (await postLogoutInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            const baseRedirect = redirectUri.replace('/v1/auth/sso/oauth/callback', '');
            await postLogoutInput.fill(baseRedirect);
        }

        const saveButton = page.getByRole('button', { name: /create|save/i }).first();
        await saveButton.click();
        await page.waitForLoadState('networkidle');

        // Capture client credentials from the settings screen
        const creds = await page.evaluate(() => {
            const findValue = (labelPattern: RegExp) => {
                const candidates = Array.from(document.querySelectorAll('label, div, dt, span'));
                const labelEl = candidates.find((el) => labelPattern.test(el.textContent || ''));
                if (!labelEl) return null;
                const parent = labelEl.closest('div, dl, section') || labelEl.parentElement;
                const code = parent?.querySelector('code, kbd, pre, span');
                return code?.textContent?.trim() || null;
            };
            return {
                clientId: findValue(/client id|app id/i),
                clientSecret: findValue(/client secret|app secret/i),
            };
        });

        if (!creds.clientId || !creds.clientSecret) {
            throw new Error('Failed to read client credentials from Logto Admin UI');
        }

        testData.set('logtoApp', {
            name: appName,
            clientId: creds.clientId,
            clientSecret: creds.clientSecret,
            redirectUri,
        });
    }
);

/**
 * Create a test user via Logto Admin UI
 */
When(
    'I create Logto user with username {string} email {string} and password {string}',
    async ({ page, ssoServer, testData }: { page: Page; ssoServer: SSOServerFixture; testData: TestStore }, username: string, email: string, password: string) => {
        const adminConfig = testData.get('logtoAdmin') || ssoServer.getProvisionedAdmin();
        const baseUrl = (adminConfig && adminConfig.consoleUrl) ? adminConfig.consoleUrl : 'http://localhost:3050';

        await page.goto(`${baseUrl}/users`);
        await page.waitForLoadState('networkidle');

        const createButton = page.getByRole('button', { name: /create user|add user|new user/i }).first();
        if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await createButton.click();
        }

        const usernameInput = page.getByLabel(/username/i).first();
        await usernameInput.waitFor({ state: 'visible', timeout: 20000 });
        await usernameInput.fill(username);

        const emailInput = page.getByLabel(/email/i).first();
        if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await emailInput.fill(email);
        }

        const passwordInput = page.locator('input[type="password"]').first();
        await passwordInput.fill(password);

        const saveButton = page.getByRole('button', { name: /create|save/i }).first();
        await saveButton.click();
        await page.waitForLoadState('networkidle');

        testData.set('logtoUser', { username, email, password });
    }
);

/**
 * Configure Syngrisi SSO env vars from stored Logto app credentials
 */
When(
    'I configure Syngrisi SSO env from created Logto app',
    async ({ ssoServer, testData }: { ssoServer: SSOServerFixture; testData: TestStore }) => {
        const app = testData.get('logtoApp');
        if (!app?.clientId || !app?.clientSecret) {
            throw new Error('Logto app credentials are not stored. Create the app first.');
        }

        const logtoEndpoint = ssoServer.getConfig()?.endpoint || 'http://localhost:3001';

        const envVars: Record<string, string> = {
            SSO_ENABLED: 'true',
            SSO_PROTOCOL: 'oauth2',
            SSO_CLIENT_ID: app.clientId,
            SSO_CLIENT_SECRET: app.clientSecret,
            SSO_AUTHORIZATION_URL: `${logtoEndpoint}/oidc/auth`,
            SSO_TOKEN_URL: `${logtoEndpoint}/oidc/token`,
            SSO_USERINFO_URL: `${logtoEndpoint}/oidc/me`,
            SSO_CALLBACK_URL: '/v1/auth/sso/oauth/callback',
        };

        Object.entries(envVars).forEach(([key, value]) => {
            process.env[key] = value;
        });

        testData.set('ssoEnv', envVars);
    }
);

/**
 * Configure Syngrisi SSO env vars from provisioned Logto app (provision-logto-api.sh)
 */
When(
    'I configure Syngrisi SSO env from provisioned Logto app',
    async ({ ssoServer, testData }: { ssoServer: SSOServerFixture; testData: TestStore }) => {
        const creds = ssoServer.getProvisionedCredentials();
        const endpoints = ssoServer.getProvisionedOAuth2Config()?.endpoints || ssoServer.provisionedConfig?.endpoints;
        if (!creds?.clientId || !creds?.clientSecret) {
            throw new Error('Provisioned Logto app credentials not found. Ensure provisioning script ran.');
        }

        const logtoEndpoint = ssoServer.logtoConfig?.endpoint || 'http://localhost:3001';

        const envVars: Record<string, string> = {
            SSO_ENABLED: 'true',
            SSO_PROTOCOL: 'oauth2',
            SSO_CLIENT_ID: creds.clientId,
            SSO_CLIENT_SECRET: creds.clientSecret,
            SSO_AUTHORIZATION_URL: endpoints?.authorization || `${logtoEndpoint}/oidc/auth`,
            SSO_TOKEN_URL: endpoints?.token || `${logtoEndpoint}/oidc/token`,
            SSO_USERINFO_URL: endpoints?.userinfo || `${logtoEndpoint}/oidc/me`,
            SSO_CALLBACK_URL: '/v1/auth/sso/oauth/callback',
        };

        Object.entries(envVars).forEach(([k, v]) => {
            process.env[k] = v;
        });

        testData.set('ssoEnv', envVars);
    }
);

/**
 * Open Logto Admin Console
 * Uses provisioned admin credentials from provisioned-config.json
 */
When(
    'I open Logto Admin Console',
    async ({ page, ssoServer }: { page: Page; ssoServer: SSOServerFixture }) => {
        const admin = ssoServer.getProvisionedAdmin();
        if (!admin) {
            throw new Error(
                'Admin credentials not found in provisioned-config.json. ' +
                'Run provision-logto-api.sh to create admin account.'
            );
        }

        await page.goto(admin.consoleUrl);
        await page.waitForLoadState('networkidle');
    }
);

/**
 * Login to Logto Admin Console
 * Uses username/password authentication
 */
When(
    'I login to Logto Admin Console',
    async ({ page, ssoServer }: { page: Page; ssoServer: SSOServerFixture }) => {
        const admin = ssoServer.getProvisionedAdmin();
        if (!admin) {
            throw new Error('Admin credentials not found in provisioned-config.json.');
        }

        // Wait for login page to load (increased timeout for cold start)
        await page.waitForLoadState('networkidle');

        // Check if we need to log in
        const usernameInput = page.locator('input[name="identifier"]');
        if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            // Fill username
            await usernameInput.fill(admin.username);
            await page.click('button[type="submit"]');

            // Wait for password field (Logto has 2-step login)
            await page.waitForSelector('input[type="password"]', { timeout: 30000 });
            await page.fill('input[type="password"]', admin.password);
            await page.click('button[type="submit"]');

            // Wait for console to load
            await page.waitForLoadState('networkidle');
        }
    }
);

/**
 * Navigate to Applications section in Logto Admin Console
 */
When(
    'I navigate to Applications in Logto Admin',
    async ({ page }: { page: Page }) => {
        // Click on Applications menu item
        const applicationsMenu = page.locator('nav a[href*="applications"], nav button:has-text("Applications")');
        await applicationsMenu.click();
        await page.waitForLoadState('networkidle');
    }
);

/**
 * Open SAML application configuration in Logto Admin
 * Uses the SAML app ID from provisioned config
 */
When(
    'I open the SAML application in Logto Admin',
    async ({ page, ssoServer }: { page: Page; ssoServer: SSOServerFixture }) => {
        const samlConfig = ssoServer.getProvisionedSAMLConfig();
        if (!samlConfig?.appId) {
            throw new Error('SAML app ID not found in provisioned-config.json.');
        }

        // Navigate directly to the SAML application page
        const admin = ssoServer.getProvisionedAdmin();
        const baseUrl = admin?.consoleUrl || 'http://localhost:3050';
        await page.goto(`${baseUrl}/applications/${samlConfig.appId}`);
        await page.waitForLoadState('networkidle');
    }
);

/**
 * Highlight an input field by name in Logto Admin for demo purposes
 */
When(
    'I highlight the {string} field in Logto Admin',
    async ({ page }: { page: Page }, fieldName: string) => {
        // Map field names to selectors
        const fieldSelectors: Record<string, string> = {
            'ACS URL': 'input[name*="acs"], input[placeholder*="ACS"]',
            'Entity ID': 'input[name*="entity"], input[placeholder*="Entity"]',
            'Name ID Format': 'select[name*="nameId"], input[name*="nameId"]',
            'Metadata URL': 'input[readonly][value*="metadata"]',
        };

        const selector = fieldSelectors[fieldName] || `input[name*="${fieldName}"], label:has-text("${fieldName}") + input`;
        const field = page.locator(selector).first();

        if (await field.isVisible({ timeout: 5000 }).catch(() => false)) {
            // Add highlight style
            await field.evaluate((el) => {
                el.style.outline = '3px solid #ff6600';
                el.style.outlineOffset = '2px';
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }
);

/**
 * Verify we are on Logto Admin Console
 */
Then(
    'I should be on Logto Admin Console',
    async ({ page }: { page: Page }) => {
        // Check for Logto Admin Console indicators
        const adminIndicator = page.locator('nav, [class*="admin"], [class*="console"]');
        await expect(adminIndicator.first()).toBeVisible({ timeout: 10000 });
    }
);

/**
 * Scroll to show a specific section in Logto Admin for demo
 */
When(
    'I scroll to {string} section in Logto Admin',
    async ({ page }: { page: Page }, sectionName: string) => {
        const section = page.locator(`h2:has-text("${sectionName}"), h3:has-text("${sectionName}"), legend:has-text("${sectionName}")`).first();
        if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
            await section.scrollIntoViewIfNeeded();
        }
    }
);
