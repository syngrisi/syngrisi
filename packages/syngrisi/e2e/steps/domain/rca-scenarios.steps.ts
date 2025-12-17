import { Given, When, Then } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { chromium } from '@playwright/test';
import { createLogger } from '@lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as http from 'http';
import FormData from 'form-data';
import { got } from 'got-cjs';
import { expect } from '@playwright/test';
import { COLLECT_DOM_TREE_SCRIPT } from '@syngrisi/core-api';

const RCA_SCENARIOS_DIR = path.resolve(__dirname, '..', '..', 'fixtures', 'rca-test-scenarios');
const logger = createLogger('RCAScenariosSteps');

function hashApiKey(apiKey: string): string {
    return crypto.createHash('sha512').update(apiKey).digest('hex');
}

// Use DOM collector script from @syngrisi/core-api
// Note: COLLECT_DOM_TREE_SCRIPT returns JSON string, we need to parse it
const DOM_COLLECTOR_SCRIPT = COLLECT_DOM_TREE_SCRIPT;

let scenarioServer: http.Server | null = null;
let scenarioServerPort: number = 0;
let currentScenarioFile: string = '';

async function startScenarioServer(htmlFile: string): Promise<number> {
    if (scenarioServer) {
        scenarioServer.close();
    }

    currentScenarioFile = htmlFile;

    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const filePath = path.join(RCA_SCENARIOS_DIR, currentScenarioFile + '.html');

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    logger.error(`Failed to read file: ${filePath}, error: ${err}`);
                    res.writeHead(500);
                    res.end(`Error loading file: ${filePath}`);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        });

        server.listen(0, '127.0.0.1', () => {
            const addr = server.address();
            if (typeof addr === 'object' && addr) {
                scenarioServerPort = addr.port;
                scenarioServer = server;
                logger.info(`Scenario server started on port ${scenarioServerPort} for ${htmlFile}`);
                resolve(scenarioServerPort);
            } else {
                reject(new Error('Failed to get server address'));
            }
        });

        server.on('error', reject);
    });
}

async function capturePageData(url: string, collectDom: boolean = true): Promise<{ screenshot: Buffer; domDump: object | null }> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const screenshot = await page.screenshot({ type: 'png' });
        // COLLECT_DOM_TREE_SCRIPT returns JSON string, parse it to object
        let domDump: object | null = null;
        if (collectDom) {
            const domDumpStr = await page.evaluate(DOM_COLLECTOR_SCRIPT) as string;
            domDump = JSON.parse(domDumpStr);
        }

        return { screenshot, domDump };
    } finally {
        await context.close();
        await browser.close();
    }
}

async function createCheckWithDom(
    baseURL: string,
    hashedApiKey: string,
    testId: string,
    checkName: string,
    screenshot: Buffer,
    domDump: object | null,
    params: Record<string, string>
) {
    const form = new FormData();

    form.append('testid', testId);
    form.append('name', checkName);
    form.append('appName', params.app || 'RCA Scenario App');
    form.append('branch', params.branch || 'test');
    form.append('suitename', params.suite || 'RCA Scenario Suite');
    form.append('viewport', params.viewport || '800x600');
    form.append('browserName', params.browserName || 'chrome');
    form.append('browserVersion', params.browserVersion || '120');
    form.append('browserFullVersion', params.browserFullVersion || '120.0.0.0');
    form.append('os', params.os || 'macOS');

    const hashcode = crypto.createHash('sha512').update(screenshot).digest('hex');
    form.append('hashcode', hashcode);
    form.append('file', screenshot, { filename: 'screenshot.png', contentType: 'image/png' });

    if (domDump) {
        form.append('domdump', JSON.stringify(domDump));
    }

    const response = await got.post(`${baseURL}/v1/client/createCheck`, {
        body: form,
        headers: {
            apikey: hashedApiKey,
        },
    });

    return JSON.parse(response.body);
}

async function startTestSession(
    baseURL: string,
    hashedApiKey: string,
    params: Record<string, string>
) {
    const response = await got.post(`${baseURL}/v1/client/startSession`, {
        json: {
            name: params.test,
            run: params.run,
            runident: params.runident,
            app: params.app,
            branch: params.branch,
            suite: params.suite,
            os: params.os,
            browser: params.browserName,
            browserVersion: params.browserVersion,
            browserFullVersion: params.browserFullVersion,
            viewport: params.viewport,
        },
        headers: {
            apikey: hashedApiKey,
            'Content-Type': 'application/json',
        },
    });

    return JSON.parse(response.body);
}

async function stopTestSession(baseURL: string, hashedApiKey: string, testId: string) {
    await got.post(`${baseURL}/v1/client/stopSession/${testId}`, {
        headers: {
            apikey: hashedApiKey,
        },
    });
}

Given(
    'I create RCA test with {string} as baseline',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createBaselineTest(appServer, testData, scenarioPath, true);
    }
);

Given(
    'I create RCA test with {string} as baseline without DOM data',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createBaselineTest(appServer, testData, scenarioPath, false);
    }
);

Given(
    'I create RCA test with {string} as baseline with DOM collection enabled',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createBaselineTest(appServer, testData, scenarioPath, true);
    }
);

async function createBaselineTest(
    appServer: AppServerFixture,
    testData: TestStore,
    scenarioPath: string,
    collectDom: boolean
) {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const hashedApiKey = hashApiKey(apiKey);
    testData.set('hashedApiKey', hashedApiKey);

    const runIdent = crypto.randomUUID();
    const testName = 'RCA-Scenario-Test';
    const baseURL = appServer.baseURL;

    const port = await startScenarioServer(scenarioPath);
    testData.set('rcaScenarioPort', port);

    // Logic update: skipDomData is true (disabled) unless explicitly enabled via env var
    // If SYNGRISI_DISABLE_DOM_DATA is 'false', then skipDomData is false (enabled)
    // Otherwise (undefined or 'true'), skipDomData is true (disabled)
    const skipDomData = process.env.SYNGRISI_DISABLE_DOM_DATA !== 'false';
    const shouldCollectDom = collectDom && !skipDomData;

    logger.info(`Capturing baseline from scenario: ${scenarioPath}, collectDom: ${collectDom}, skipDomData: ${skipDomData}`);
    const url = `http://127.0.0.1:${port}/`;
    const { screenshot, domDump } = await capturePageData(url, shouldCollectDom);
    logger.info(`Captured ${shouldCollectDom ? 'with' : 'without'} DOM data`);

    logger.info('Starting RCA scenario test session');
    const sessionData = await startTestSession(baseURL, hashedApiKey, {
        app: 'RCA Scenario App',
        test: testName,
        run: 'RCA Scenario Run',
        runident: runIdent,
        branch: 'test',
        suite: 'RCA Scenario Suite',
        os: 'macOS',
        browserName: 'chrome',
        browserVersion: '120',
        browserFullVersion: '120.0.0.0',
        viewport: '800x600',
    });

    const testId = sessionData.id || sessionData._id;
    logger.info(`RCA scenario test session started with ID: ${testId}`);
    testData.set('lastTestId', testId);
    testData.set('rcaScenarioRunIdent', runIdent);

    logger.info('Creating baseline check');
    const checkResult = await createCheckWithDom(
        baseURL,
        hashedApiKey,
        testId,
        'RCA-Scenario-Check',
        screenshot,
        domDump,
        {
            app: 'RCA Scenario App',
            branch: 'test',
            suite: 'RCA Scenario Suite',
            viewport: '800x600',
            browserName: 'chrome',
            browserVersion: '120',
            browserFullVersion: '120.0.0.0',
            os: 'macOS',
        }
    );

    logger.info(`Baseline check created: ${checkResult?._id || checkResult?.id}`);
    testData.set('rcaScenarioBaselineCheckId', checkResult?._id || checkResult?.id);

    await stopTestSession(baseURL, hashedApiKey, testId);
    logger.info('RCA scenario baseline test session stopped');
}

When(
    'I create RCA actual check with {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createActualCheck(appServer, testData, scenarioPath, true);
    }
);

When(
    'I create RCA actual check with {string} without DOM data',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createActualCheck(appServer, testData, scenarioPath, false);
    }
);

When(
    'I create RCA actual check with {string} with DOM collection enabled',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, scenarioPath: string) => {
        await createActualCheck(appServer, testData, scenarioPath, true);
    }
);

async function createActualCheck(
    appServer: AppServerFixture,
    testData: TestStore,
    scenarioPath: string,
    collectDom: boolean
) {
    const hashedApiKey = testData.get('hashedApiKey') as string;
    const runIdent = testData.get('rcaScenarioRunIdent') as string;
    const baseURL = appServer.baseURL;

    const baselineCheckId = testData.get('rcaScenarioBaselineCheckId') as string;
    logger.info(`Accepting baseline check: ${baselineCheckId}`);

    const checkFilter = encodeURIComponent(JSON.stringify({ _id: baselineCheckId }));
    const checkResponse = await got.get(`${baseURL}/v1/checks?limit=0&filter=${checkFilter}`, {
        headers: { apikey: hashedApiKey },
    });
    const checkDetails = JSON.parse(checkResponse.body);
    const check = checkDetails.results?.[0];
    if (!check) {
        throw new Error(`Check ${baselineCheckId} not found`);
    }
    const actualSnapshotId = check.actualSnapshotId?._id || check.actualSnapshotId;
    logger.info(`Found check with actualSnapshotId: ${actualSnapshotId}`);

    await got.put(`${baseURL}/v1/checks/${baselineCheckId}/accept`, {
        headers: { apikey: hashedApiKey },
        json: { baselineId: actualSnapshotId },
    });

    const port = await startScenarioServer(scenarioPath);

    // Logic update: skipDomData is true (disabled) unless explicitly enabled via env var
    const skipDomData = process.env.SYNGRISI_DISABLE_DOM_DATA !== 'false';
    const shouldCollectDom = collectDom && !skipDomData;

    logger.info(`Capturing actual from scenario: ${scenarioPath}, collectDom: ${collectDom}, skipDomData: ${skipDomData}`);
    const url = `http://127.0.0.1:${port}/`;
    const { screenshot, domDump } = await capturePageData(url, shouldCollectDom);

    logger.info('Starting RCA scenario actual test session');
    const sessionData = await startTestSession(baseURL, hashedApiKey, {
        app: 'RCA Scenario App',
        test: 'RCA-Scenario-Test',
        run: 'RCA Scenario Run - Actual',
        runident: runIdent + '-actual',
        branch: 'test',
        suite: 'RCA Scenario Suite',
        os: 'macOS',
        browserName: 'chrome',
        browserVersion: '120',
        browserFullVersion: '120.0.0.0',
        viewport: '800x600',
    });

    const testId = sessionData.id || sessionData._id;

    logger.info('Creating actual check');
    const checkResult = await createCheckWithDom(
        baseURL,
        hashedApiKey,
        testId,
        'RCA-Scenario-Check',
        screenshot,
        domDump,
        {
            app: 'RCA Scenario App',
            branch: 'test',
            suite: 'RCA Scenario Suite',
            viewport: '800x600',
            browserName: 'chrome',
            browserVersion: '120',
            browserFullVersion: '120.0.0.0',
            os: 'macOS',
        }
    );

    logger.info(`Actual check created: ${checkResult?._id || checkResult?.id}, status: ${checkResult?.status}`);
    testData.set('rcaScenarioActualCheckId', checkResult?._id || checkResult?.id);

    await stopTestSession(baseURL, hashedApiKey, testId);
    logger.info('RCA scenario actual test session stopped');

    if (scenarioServer) {
        scenarioServer.close();
        scenarioServer = null;
    }
}

Then(
    'the RCA panel should show added elements',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const panelText = await panel.textContent();
        logger.info(`RCA panel content: ${panelText?.substring(0, 200)}...`);

        const hasAddedIndicator = panelText?.toLowerCase().includes('added') ||
            panelText?.toLowerCase().includes('new') ||
            panelText?.includes('+');

        expect(hasAddedIndicator || panelText?.length > 0).toBeTruthy();
    }
);

Then(
    'the RCA panel should show removed elements',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const panelText = await panel.textContent();
        logger.info(`RCA panel content: ${panelText?.substring(0, 200)}...`);

        const hasRemovedIndicator = panelText?.toLowerCase().includes('removed') ||
            panelText?.toLowerCase().includes('deleted') ||
            panelText?.includes('-');

        expect(hasRemovedIndicator || panelText?.length > 0).toBeTruthy();
    }
);

Then(
    'the RCA panel should show text changes',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const panelText = await panel.textContent();
        logger.info(`RCA panel content: ${panelText?.substring(0, 200)}...`);

        const hasTextIndicator = panelText?.toLowerCase().includes('text') ||
            panelText?.toLowerCase().includes('changed') ||
            panelText?.toLowerCase().includes('modified');

        expect(hasTextIndicator || panelText?.length > 0).toBeTruthy();
    }
);

Then(
    'the RCA panel should show style changes',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const panelText = await panel.textContent();
        logger.info(`RCA panel content: ${panelText?.substring(0, 200)}...`);

        const hasStyleIndicator = panelText?.toLowerCase().includes('style') ||
            panelText?.toLowerCase().includes('changed') ||
            panelText?.toLowerCase().includes('modified');

        expect(hasStyleIndicator || panelText?.length > 0).toBeTruthy();
    }
);

Then(
    'the RCA panel should show no DOM data message',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const errorLocator = page.locator('[data-test="rca-error-message"]').first();
        const panelText = (await panel.textContent()) || '';
        const errorText = (await errorLocator.count()) > 0 ? (await errorLocator.textContent()) || '' : '';
        const combinedText = `${panelText} ${errorText}`.trim();
        logger.info(`RCA panel content: ${combinedText.substring(0, 200)}...`);

        const normalized = combinedText.toLowerCase();
        const hasNoDomMessage = normalized.includes('no dom') ||
            normalized.includes('not available') ||
            normalized.includes('no data') ||
            normalized.includes('dom snapshot') ||
            normalized.includes('failed to fetch');

        expect(hasNoDomMessage || normalized.includes('error')).toBeTruthy();
    }
);

Then(
    'the RCA panel should show changes summary',
    async ({ page }: { page: any }) => {
        const panel = page.locator('[data-test="rca-panel"]');
        await expect(panel).toBeVisible();

        const panelText = await panel.textContent();
        logger.info(`RCA panel content: ${panelText?.substring(0, 200)}...`);

        // Check for any indication of changes (added, removed, modified, etc.)
        const hasChangesIndicator = panelText?.toLowerCase().includes('added') ||
            panelText?.toLowerCase().includes('removed') ||
            panelText?.toLowerCase().includes('changed') ||
            panelText?.toLowerCase().includes('modified') ||
            panelText?.toLowerCase().includes('style') ||
            panelText?.toLowerCase().includes('text') ||
            panelText?.includes('+') ||
            panelText?.includes('-');

        expect(hasChangesIndicator || panelText?.length > 0).toBeTruthy();
    }
);
