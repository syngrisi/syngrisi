import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../support/fixtures';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { resolveRepoRoot } from '@utils/fs';
import { clearPluginSettings } from '@utils/db-cleanup';
import { ensureServerReady } from '@utils/app-server';

const { Given, When, Then, After } = createBdd(test);

// Store driver instance and check result between steps
let driver: PlaywrightDriver;
let checkResult: any;
let lastError: any;
let cachedImageBuffer: Buffer | null = null;
let jwtEnvApplied = false;

const getSampleImageBuffer = (): Buffer => {
    if (cachedImageBuffer) return cachedImageBuffer;
    const repoRoot = resolveRepoRoot();
    const imagePath = path.join(repoRoot, 'e2e', 'files', 'A.png');
    cachedImageBuffer = fs.readFileSync(imagePath);
    return cachedImageBuffer;
};

const getAuthHeaderName = (): string => {
    return process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME || 'Authorization';
};

const getAuthHeaderPrefix = (): string => {
    return process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX || 'Bearer ';
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const isTransientSessionError = (error: unknown): boolean => {
    const message = (error as Error | undefined)?.message || String(error || '');
    return message.includes('socket hang up') || message.includes('ECONNRESET') || message.includes('ECONNREFUSED') || message.includes('EPIPE');
};

const startSessionWithRetry = async (
    driverInstance: PlaywrightDriver,
    payload: { params: Record<string, string> },
    retries = 3
): Promise<void> => {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            await driverInstance.startTestSession(payload);
            return;
        } catch (error) {
            lastErr = error;
            if (!isTransientSessionError(error) || attempt === retries) {
                throw error;
            }
            await sleep(1000 * attempt);
        }
    }
    throw lastErr;
};

const resolveDbUri = (appServer: { config?: { connectionString?: string } }): string => {
    return appServer.config?.connectionString || `mongodb://127.0.0.1/SyngrisiDbTest${process.env.TEST_WORKER_INDEX || '0'}`;
};

const ensureGuestUserPresent = async (
    appServer: { config?: { connectionString?: string }; restart: (force?: boolean) => Promise<void>; serverPort?: number }
): Promise<void> => {
    const dbUri = resolveDbUri(appServer);
    const client = new MongoClient(dbUri);
    try {
        await client.connect();
        const db = client.db();
        const guest = await db.collection('vrsusers').findOne({ username: 'Guest' });
        if (!guest) {
            console.log('Guest user missing, restarting server to recreate default users...');
            await appServer.restart(true);
            if (appServer.serverPort) {
                await ensureServerReady(appServer.serverPort, 60_000);
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    } finally {
        await client.close();
    }
};

const toBoolean = (value: unknown): boolean | undefined => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') return true;
        if (normalized === 'false') return false;
    }
    return undefined;
};

const upsertJwtPluginSettings = async (
    appServer: { config?: { connectionString?: string } },
    settings: Record<string, unknown>
): Promise<void> => {
    const dbUri = resolveDbUri(appServer);
    const client = new MongoClient(dbUri);
    try {
        await client.connect();
        const db = client.db();
        await db.collection('vrspluginsettings').updateOne(
            { pluginName: 'jwt-auth' },
            {
                $set: {
                    enabled: true,
                    settings,
                },
                $setOnInsert: {
                    pluginName: 'jwt-auth',
                    displayName: 'JWT Authentication',
                    description: 'M2M authentication via JWT (OAuth2 Client Credentials)',
                    settingsSchema: [],
                },
            },
            { upsert: true }
        );
    } finally {
        await client.close();
    }
};

// Clean up environment variables after scenarios
After(async ({ appServer }) => {
    const shouldRestart = jwtEnvApplied;
    jwtEnvApplied = false;

    delete process.env.SYNGRISI_PLUGINS_ENABLED;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_ENABLED;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUDIENCE;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_REQUIRED_SCOPES;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER_MATCH;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_CACHE_TTL;
    delete process.env.SYNGRISI_AUTH_TOKEN;
    delete process.env.SYNGRISI_AUTH;
    delete process.env.SYNGRISI_AUTH_OVERRIDE;
    delete process.env.SYNGRISI_API_KEY;

    if (shouldRestart) {
        console.log('Restarting server to clear JWT Auth ENV configuration...');
        await appServer.restart(true);
        console.log('Server restarted and ready with default configuration');
    }
});

Given('I enable the "jwt-auth" plugin with the following config:', async ({ appServer, mockJwks }, table) => {
    const config = table.rowsHash();

    // Replace placeholder with actual Mock JWKS URL
    if (config.jwksUrl === '{mockJwksUrl}') {
        config.jwksUrl = mockJwks.jwksUrl;
    }

    // Ensure DB settings do not disable the plugin
    await clearPluginSettings('jwt-auth', appServer.config?.connectionString);

    // Configure via Environment Variables (Robust against API crashes)
    process.env.SYNGRISI_PLUGINS_ENABLED = 'jwt-auth';
    process.env.SYNGRISI_PLUGIN_JWT_AUTH_ENABLED = 'true';
    process.env.SYNGRISI_AUTH = 'true';
    process.env.SYNGRISI_AUTH_OVERRIDE = 'true';
    process.env.SYNGRISI_API_KEY = 'dummy-api-key';

    if (config.jwksUrl) process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL = config.jwksUrl;
    if (config.issuer) process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER = config.issuer;
    if (config.autoProvision) process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION = String(config.autoProvision);
    if (config.serviceUserRole) process.env.SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE = config.serviceUserRole;

    if (config.headerName) process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME = config.headerName;
    if (config.headerPrefix) process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX = config.headerPrefix;
    if (config.audience) process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUDIENCE = config.audience;
    if (config.requiredScopes) process.env.SYNGRISI_PLUGIN_JWT_AUTH_REQUIRED_SCOPES = config.requiredScopes;
    if (config.issuerMatch) process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER_MATCH = config.issuerMatch;

    jwtEnvApplied = true;

    const settings: Record<string, unknown> = {};
    if (config.jwksUrl) settings.jwksUrl = config.jwksUrl;
    if (config.issuer) settings.issuer = config.issuer;
    if (config.headerName) settings.headerName = config.headerName;
    if (config.headerPrefix) settings.headerPrefix = config.headerPrefix;
    if (config.audience) settings.audience = config.audience;
    if (config.requiredScopes) settings.requiredScopes = config.requiredScopes;
    if (config.issuerMatch) settings.issuerMatch = config.issuerMatch;
    const autoProvision = toBoolean(config.autoProvision);
    if (autoProvision !== undefined) settings.autoProvisionUsers = autoProvision;
    if (config.serviceUserRole) settings.serviceUserRole = config.serviceUserRole;

    // Ensure DB has required settings so server can auto-enable jwt-auth even if env isn't picked up
    await upsertJwtPluginSettings(appServer, settings);

    console.log('Restarting server with new JWT Auth ENV configuration...');
    await appServer.restart(true);

    // Wait for server to fully stabilize with JWT plugin to avoid socket hang ups
    if (appServer.serverPort) {
        await ensureServerReady(appServer.serverPort, 60_000);
    } else {
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    await ensureGuestUserPresent(appServer);
    console.log('Server restarted and ready with JWT Auth plugin');
});

When('I perform a visual check with a valid JWT token', async ({ page, appServer, mockJwks }) => {
    // Reset state from previous tests
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-client-id',
        cid: 'test-client-id',
        client_id: 'test-client-id',
        scp: ['syngrisi:api:read', 'syngrisi:api:write']
    };
    const token = await mockJwks.signToken(payload);

    console.log(`[DEBUG] appServer.baseURL: '${appServer.baseURL}'`);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    let sessionStarted = false;
    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
        sessionStarted = true;

        const imageBuffer = getSampleImageBuffer();

        checkResult = await driver.check({
            checkName: 'JWT Auth Check',
            imageBuffer,
            params: {
                viewport: '1200x800',
                os: 'Linux',
                browserName: 'chrome',
                browserVersion: '100',
            }
        });
    } catch (e) {
        lastError = e;
    } finally {
        if (sessionStarted) {
            try {
                await driver.stopTestSession();
            } catch (e) {
                console.log('Failed to stop JWT test session:', e);
            }
        }
    }
});

When('I perform a visual check with a valid JWT token with issuer {string}', async ({ page, appServer, mockJwks }, issuer: string) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-client-id',
        cid: 'test-client-id',
        client_id: 'test-client-id',
        scp: ['syngrisi:api:read', 'syngrisi:api:write']
    };
    const token = await mockJwks.signToken(payload, { issuer });

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    let sessionStarted = false;
    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
        sessionStarted = true;

        const imageBuffer = getSampleImageBuffer();

        checkResult = await driver.check({
            checkName: 'JWT Auth Check',
            imageBuffer,
            params: {
                viewport: '1200x800',
                os: 'Linux',
                browserName: 'chrome',
                browserVersion: '100',
            }
        });
    } catch (e) {
        lastError = e;
    } finally {
        if (sessionStarted) {
            try {
                await driver.stopTestSession();
            } catch (e) {
                console.log('Failed to stop JWT test session:', e);
            }
        }
    }
});

When('I perform a visual check with a valid JWT token for client id {string}', async ({ page, appServer, mockJwks }, clientId: string) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: clientId,
        cid: clientId,
        client_id: clientId,
        scp: ['syngrisi:api:read', 'syngrisi:api:write']
    };
    const token = await mockJwks.signToken(payload);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    let sessionStarted = false;
    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
        sessionStarted = true;

        const imageBuffer = getSampleImageBuffer();

        checkResult = await driver.check({
            checkName: 'JWT Auth Check',
            imageBuffer,
            params: {
                viewport: '1200x800',
                os: 'Linux',
                browserName: 'chrome',
                browserVersion: '100',
            }
        });
    } catch (e) {
        lastError = e;
    } finally {
        if (sessionStarted) {
            try {
                await driver.stopTestSession();
            } catch (e) {
                console.log('Failed to stop JWT test session:', e);
            }
        }
    }
});

When('I perform a visual check with a valid JWT token without sub', async ({ page, appServer, mockJwks }) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        client_id: 'client-id-no-sub',
        scp: ['syngrisi:api:read', 'syngrisi:api:write']
    };
    const token = await mockJwks.signToken(payload);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    let sessionStarted = false;
    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
        sessionStarted = true;

        const imageBuffer = getSampleImageBuffer();

        checkResult = await driver.check({
            checkName: 'JWT Auth Check',
            imageBuffer,
            params: {
                viewport: '1200x800',
                os: 'Linux',
                browserName: 'chrome',
                browserVersion: '100',
            }
        });
    } catch (e) {
        lastError = e;
    } finally {
        if (sessionStarted) {
            try {
                await driver.stopTestSession();
            } catch (e) {
                console.log('Failed to stop JWT test session:', e);
            }
        }
    }
});

When('I perform a visual check with a JWT token with invalid issuer', async ({ page, appServer, mockJwks }) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-client-id',
        scp: ['syngrisi:api:read']
    };
    const token = await mockJwks.signToken(payload, { issuer: 'wrong-issuer' });

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
    } catch (e) {
        lastError = e;
    }
});

When('I perform a visual check with a JWT token missing required scopes', async ({ page, appServer, mockJwks }) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-client-id',
        scp: ['syngrisi:api:read']
    };
    const token = await mockJwks.signToken(payload);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
    } catch (e) {
        lastError = e;
    }
});

When('I perform a visual check with a JWT token with invalid audience', async ({ page, appServer, mockJwks }) => {
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-client-id',
        scp: ['syngrisi:api:read']
    };
    const token = await mockJwks.signToken(payload, { audience: 'other-aud' });

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
    } catch (e) {
        lastError = e;
    }
});

When('I perform a visual check with an invalid JWT token', async ({ page, appServer, mockJwks }) => {
    // Reset state from previous tests
    lastError = undefined;
    checkResult = undefined;

    const payload = { sub: 'test-subject', client_id: 'test-client-id' };
    const token = await mockJwks.signInvalidToken(payload);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const headerName = getAuthHeaderName();
    let headerPrefix = getAuthHeaderPrefix();
    if (headerPrefix && !headerPrefix.endsWith(' ')) {
        headerPrefix = `${headerPrefix} `;
    }

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: '',
        headers: {
            [headerName]: `${headerPrefix}${token}`,
        }
    });

    try {
        await startSessionWithRetry(driver, {
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });
    } catch (e) {
        lastError = e;
    }
});

Then('the check should be accepted', async () => {
    if (lastError) {
        console.log('--------------------------');
        console.log('LAST ERROR:', lastError);
        console.log('LAST ERROR MESSAGE:', lastError.message);
        console.log('LAST ERROR STACK:', lastError.stack);
        console.log('--------------------------');
    }
    expect(lastError).toBeUndefined();
    expect(checkResult).toBeDefined();
    expect(checkResult._id).toBeDefined();
});

Then('a user {string} should exist in the database', async ({ appServer }, username) => {
    // Prefer the actual server DB connection string to avoid worker index mismatches
    const dbUri = appServer.config?.connectionString || `mongodb://127.0.0.1/SyngrisiDbTest${process.env.TEST_WORKER_INDEX || '0'}`;

    const client = new MongoClient(dbUri);
    try {
        await client.connect();
        const db = client.db();

        // Find user by username (allow brief delay for auto-provision)
        const startTs = Date.now();
        let user = await db.collection('vrsusers').findOne({ username: username });
        while (!user && Date.now() - startTs < 20_000) {
            await new Promise(resolve => setTimeout(resolve, 500));
            user = await db.collection('vrsusers').findOne({ username: username });
        }

        if (!user) {
            const allUsers = await db.collection('vrsusers').find({}, { projection: { username: 1 } }).toArray();
            console.log(`DEBUG: Users in DB (${db.databaseName}):`, allUsers.map(u => u.username).join(', '));
        }

        expect(user, `User '${username}' should exist in database ${db.databaseName}`).not.toBeNull();
        expect(user?.username).toBe(username);

        if (username.startsWith('jwt-service:')) {
            expect(user?.authSource).toBe('jwt');
        }

        console.log(`Verified user ${username} exists in DB with authSource: ${user?.authSource}`);
    } finally {
        await client.close();
    }
});

Then('the check should be rejected with status {int}', async ({ }, statusCode) => {
    console.log('Expected failure status:', statusCode);
    if (lastError) {
        console.log('Actual error:', lastError);
    }
    expect(lastError).toBeDefined();
    const responseStatus = lastError?.response?.statusCode || lastError?.statusCode;
    if (responseStatus) {
        expect(responseStatus).toBe(statusCode);
        return;
    }
    const responseBody = lastError?.response?.body;
    if (responseBody) {
        try {
            const parsed = JSON.parse(responseBody);
            if (parsed?.statusCode) {
                expect(parsed.statusCode).toBe(statusCode);
                return;
            }
        } catch {
            // Fall through to message check
        }
    }
    const errorMsg = lastError?.message || lastError?.toString() || '';
    expect(errorMsg).toContain(statusCode.toString());
});
