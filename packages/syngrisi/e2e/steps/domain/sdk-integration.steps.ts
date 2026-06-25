import { Given, When, Then } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';
import { SyngrisiApi } from '@syngrisi/core-api';

const logger = createLogger('SdkIntegrationSteps');

// Fixture images live in packages/syngrisi/tests/files; steps/domain → up 3 = packages/syngrisi.
const FIXTURES_ROOT = path.resolve(__dirname, '..', '..', '..', 'tests');
const fileBufferCache = new Map<string, Buffer>();
function loadImage(relPath: string): Buffer {
    const full = path.join(FIXTURES_ROOT, relPath);
    const cached = fileBufferCache.get(full);
    if (cached) return cached;
    if (!fs.existsSync(full)) throw new Error(`Fixture image not found: ${full}`);
    const buf = fs.readFileSync(full);
    fileBufferCache.set(full, buf);
    return buf;
}

function normalizedUrl(appServer: AppServerFixture): string {
    const base = appServer.baseURL;
    return base.endsWith('/') ? base : `${base}/`;
}

// The two SDK drivers expose an identical surface — keep them behind a loose alias.
type AnyDriver = any;

const CHECK_PARAMS = { os: 'macOS', browserName: 'chrome', browserVersion: '120', viewport: '1366x768' };

function normalizeStatus(result: any): string {
    const s = result?.status;
    const value = Array.isArray(s) ? s[0] : s;
    return String(value ?? '').toLowerCase();
}

function idOf(value: any): string {
    return value?._id || value?.id || value;
}

Given('I create a {string} Syngrisi driver', async (
    { appServer, testData, page }: { appServer: AppServerFixture; testData: TestStore; page: Page },
    sdk: string,
) => {
    const url = normalizedUrl(appServer);
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    let driver: AnyDriver;
    let Region: any;
    if (sdk === 'playwright') {
        driver = new PlaywrightDriver({ page, url, apiKey });
        Region = PlaywrightDriver.Region;
    } else {
        driver = new SyngrisiDriver({ url, apiKey });
        Region = SyngrisiDriver.Region;
    }
    testData.set('sdkDriver', driver);
    testData.set('sdkRegion', Region);
    logger.info(`Created ${sdk} Syngrisi driver against ${url}`);
});

Given('I create a {string} Syngrisi driver with auto-accept', async (
    { appServer, testData, page }: { appServer: AppServerFixture; testData: TestStore; page: Page },
    sdk: string,
) => {
    const url = normalizedUrl(appServer);
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    let driver: AnyDriver;
    let Region: any;
    if (sdk === 'playwright') {
        driver = new PlaywrightDriver({ page, url, apiKey, autoAccept: true });
        Region = PlaywrightDriver.Region;
    } else {
        driver = new SyngrisiDriver({ url, apiKey, autoAccept: true });
        Region = SyngrisiDriver.Region;
    }
    testData.set('sdkDriver', driver);
    testData.set('sdkRegion', Region);
    logger.info(`Created ${sdk} Syngrisi driver (auto-accept) against ${url}`);
});

When('I start an SDK test session for app {string}', async (
    { testData }: { testData: TestStore },
    app: string,
) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const branch = 'integration';
    const params = {
        app,
        test: `Parity Test ${crypto.randomUUID().slice(0, 8)}`,
        run: 'parity_run',
        runident: crypto.randomUUID(),
        branch,
        suite: 'Parity suite',
        tags: [],
        ...CHECK_PARAMS,
        browserFullVersion: '120.0.0.0',
    };
    const session = await driver.startTestSession({ params });
    testData.set('sdkApp', app);
    testData.set('sdkBranch', branch);
    testData.set('sdkSession', session);
    logger.info(`Started SDK session for app "${app}" (testId=${idOf(session)})`);
});

Then('the SDK check {string} with image {string} has status {string}', async (
    { testData }: { testData: TestStore },
    checkName: string,
    image: string,
    expectedStatus: string,
) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const imageBuffer = loadImage(image);
    const result = await driver.check({
        checkName,
        imageBuffer,
        params: { ...CHECK_PARAMS, skipDomData: true },
    });
    testData.set('sdkLastCheck', result);
    const status = normalizeStatus(result);
    logger.info(`Check "${checkName}" (${image}) → status "${status}" (expected "${expectedStatus}")`);
    expect(status).toBe(expectedStatus.toLowerCase());
});

When('I accept the last SDK check', async ({ testData }: { testData: TestStore }) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const lastCheck = testData.get('sdkLastCheck') as any;
    const checkId = idOf(lastCheck);
    const baselineId = idOf(lastCheck?.actualSnapshotId);
    const result = await driver.acceptCheck({ checkId, baselineId });
    expect((result as any)?.error).toBeFalsy();
    logger.info(`Accepted SDK check ${checkId} (baseline snapshot ${baselineId})`);
});

Then('getBaselines for check {string} returns at least {int} result', async (
    { testData }: { testData: TestStore },
    checkName: string,
    min: number,
) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    // Pass the full identity (incl. viewport) so the wdio SDK never falls back to the WDIO
    // `browser` global for viewport detection — and so the filter matches the created baseline.
    const result = await driver.getBaselines({
        params: {
            name: checkName,
            app: testData.get('sdkApp') as string,
            branch: testData.get('sdkBranch') as string,
            os: CHECK_PARAMS.os,
            browserName: CHECK_PARAMS.browserName,
            viewport: CHECK_PARAMS.viewport,
        },
    });
    const results = (result as any)?.results || [];
    logger.info(`getBaselines("${checkName}") → ${results.length} result(s)`);
    expect(results.length).toBeGreaterThanOrEqual(min);
    testData.set('sdkLastBaselineId', idOf(results[0]));
});

Then('getSnapshots for check {string} returns at least {int} result', async (
    { testData }: { testData: TestStore },
    checkName: string,
    min: number,
) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const result = await driver.getSnapshots({ params: { name: checkName } });
    const results = (result as any)?.results || [];
    logger.info(`getSnapshots("${checkName}") → ${results.length} result(s)`);
    expect(results.length).toBeGreaterThanOrEqual(min);
});

When('I set ignore regions on the last baseline', async ({ testData }: { testData: TestStore }) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const Region = testData.get('sdkRegion') as any;
    const baselineId = testData.get('sdkLastBaselineId') as string;
    expect(baselineId, 'baseline id resolved from getBaselines').toBeTruthy();
    const result = await driver.setIgnoreRegions({
        baselineId,
        regions: [new Region(0, 0, 20, 20)],
    });
    expect((result as any)?.error).toBeFalsy();
    logger.info(`Set ignore regions on baseline ${baselineId}`);
});

Then('the last baseline has ignore regions', async ({ testData }: { testData: TestStore }) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    const baselineId = testData.get('sdkLastBaselineId') as string;
    const result = await driver.getBaselines({
        params: {
            name: 'Home',
            app: testData.get('sdkApp') as string,
            branch: testData.get('sdkBranch') as string,
            os: CHECK_PARAMS.os,
            browserName: CHECK_PARAMS.browserName,
            viewport: CHECK_PARAMS.viewport,
        },
    });
    const baseline = ((result as any)?.results || []).find((b: any) => idOf(b) === baselineId)
        || (result as any)?.results?.[0];
    let regions = baseline?.ignoreRegions;
    if (typeof regions === 'string') {
        try { regions = JSON.parse(regions); } catch { /* keep as-is */ }
    }
    logger.info(`Baseline ${baselineId} ignoreRegions: ${JSON.stringify(regions)}`);
    expect(Array.isArray(regions) ? regions.length : 0).toBeGreaterThan(0);
});

When('I stop the SDK test session', async ({ testData }: { testData: TestStore }) => {
    const driver = testData.get('sdkDriver') as AnyDriver;
    await driver.stopTestSession();
    logger.info('Stopped SDK test session');
});

// --- core-api direct contract (error-object semantics, not exceptions) ---

Given('I create a core-api client', async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
) => {
    const api = new SyngrisiApi({ url: normalizedUrl(appServer), apiKey: process.env.SYNGRISI_API_KEY || '123' });
    testData.set('coreApi', api);
    logger.info('Created core-api SyngrisiApi client');
});

Then('accepting a non-existent check returns an error object', async ({ testData }: { testData: TestStore }) => {
    const api = testData.get('coreApi') as SyngrisiApi;
    const bogusId = '0'.repeat(24);
    // Contract: the client RETURNS an ErrorObject rather than throwing.
    const result = await api.acceptCheck(bogusId, bogusId);
    logger.info(`acceptCheck(bogus) → ${JSON.stringify(result)}`);
    expect((result as any)?.error).toBe(true);
});

Then('getBaselines with a no-match filter yields no baselines', async ({ testData }: { testData: TestStore }) => {
    const api = testData.get('coreApi') as SyngrisiApi;
    const result = await api.getBaselines({
        name: 'NoSuchCheck', app: 'NoSuchApp', branch: 'none',
        os: 'none', browserName: 'none', viewport: '1x1',
    } as any);
    // Contract: no throw, no error object — a no-match query yields no baselines (server returns {}).
    expect((result as any)?.error).toBeFalsy();
    expect((result as any)?.results?.length || 0).toBe(0);
});
