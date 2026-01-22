import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../support/fixtures';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';
import { MongoClient } from 'mongodb';

const { Given, When, Then, After } = createBdd(test);

// Store driver instance and check result between steps
let driver: PlaywrightDriver;
let checkResult: any;
let lastError: any;

// Clean up environment variables after scenarios
After(async () => {
    delete process.env.SYNGRISI_PLUGINS_ENABLED;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME;
    delete process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX;
    delete process.env.SYNGRISI_AUTH_TOKEN;
});

Given('I enable the "jwt-auth" plugin with the following config:', async ({ appServer, mockJwks }, table) => {
    const config = table.rowsHash();

    // Replace placeholder with actual Mock JWKS URL
    if (config.jwksUrl === '{mockJwksUrl}') {
        config.jwksUrl = mockJwks.jwksUrl;
    }

    // Configure via Environment Variables (Robust against API crashes)
    process.env.SYNGRISI_PLUGINS_ENABLED = 'jwt-auth';
    process.env.SYNGRISI_AUTH = 'true';
    process.env.SYNGRISI_AUTH_OVERRIDE = 'true';
    process.env.SYNGRISI_API_KEY = 'dummy-api-key';

    if (config.jwksUrl) process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL = config.jwksUrl;
    if (config.issuer) process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER = config.issuer;
    if (config.autoProvision) process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION = String(config.autoProvision);
    if (config.serviceUserRole) process.env.SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE = config.serviceUserRole;

    if (config.headerName) process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME = config.headerName;
    if (config.headerPrefix) process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX = config.headerPrefix;

    console.log('Restarting server with new JWT Auth ENV configuration...');
    await appServer.restart(true);

    // Wait for server to fully stabilize with JWT plugin
    // This prevents "socket hang up" errors from happening when server isn't ready
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Server restarted and ready with JWT Auth plugin');
});

When('I perform a visual check with a valid JWT token', async ({ page, appServer, mockJwks }) => {
    // Reset state from previous tests
    lastError = undefined;
    checkResult = undefined;

    const payload = {
        sub: 'test-subject',
        cid: 'test-client-id',
        client_id: 'test-client-id',
        scp: ['syngrisi:api:read', 'syngrisi:api:write']
    };
    const token = await mockJwks.signToken(payload);

    console.log(`[DEBUG] appServer.baseURL: '${appServer.baseURL}'`);

    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;

    // Hybrid Auth Verification: Set ENV token
    // process.env.SYNGRISI_AUTH_TOKEN = token;

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: 'dummy-api-key',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    try {
        await driver.startTestSession({
            params: {
                test: 'JWT Auth Test',
                app: 'M2M App',
                run: 'Run 1',
                runident: 'run-1',
                suite: 'M2M Suite',
                branch: 'main',
            }
        });

        const imageBuffer = Buffer.from('fake-image-data');

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

        await driver.stopTestSession();
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

    driver = new PlaywrightDriver({
        page,
        url: normalizedURL,
        apiKey: 'dummy-api-key',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    try {
        await driver.startTestSession({
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

Then('a user {string} should exist in the database', async ({ }, username) => {
    // Determine CID and DB URI (consistent with db-cleanup.ts and app-server.ts)
    const cid = process.env.DOCKER === '1' ? 100 : parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
    const dbUri = `mongodb://127.0.0.1/SyngrisiDbTest${cid}`;

    const client = new MongoClient(dbUri);
    try {
        await client.connect();
        const db = client.db();

        // Find user by username
        // Note: The username argument comes from feature file (e.g. "jwt-service:test-client-id")
        const allUsers = await db.collection('vrsusers').find({}, { projection: { username: 1 } }).toArray();
        console.log(`DEBUG: Users in DB (${db.databaseName}):`, allUsers.map(u => u.username).join(', '));

        const user = await db.collection('vrsusers').findOne({ username: username });

        expect(user, `User '${username}' should exist in database ${db.databaseName}`).not.toBeNull();
        expect(user?.username).toBe(username);
        console.log(`Verified user ${username} exists in DB`);
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
    // Handle SDK error format
    const errorMsg = lastError?.message || lastError?.toString() || '';
    expect(errorMsg).toContain(statusCode.toString());
});
