import { Given, When } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import type { Page, Browser, BrowserContext } from '@playwright/test';
import { chromium } from '@playwright/test';
import { createLogger } from '@lib/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as http from 'http';
import FormData from 'form-data';
import { got } from 'got-cjs';
import { COLLECT_DOM_TREE_SCRIPT } from '@syngrisi/core-api';

// Directory for RCA debug screenshots
const RCA_SCREENSHOTS_DIR = path.resolve(__dirname, '..', '..', 'reports', 'rca-debug-screenshots');
const RCA_TEST_APP_DIR = path.resolve(__dirname, '..', '..', 'fixtures', 'rca-test-app');

// Ensure directory exists
if (!fs.existsSync(RCA_SCREENSHOTS_DIR)) {
    fs.mkdirSync(RCA_SCREENSHOTS_DIR, { recursive: true });
}

const logger = createLogger('RCASteps');

function hashApiKey(apiKey: string): string {
    return crypto.createHash('sha512').update(apiKey).digest('hex');
}

// Use DOM collector script from @syngrisi/core-api
// Note: COLLECT_DOM_TREE_SCRIPT returns JSON string, we need to parse it
const DOM_COLLECTOR_SCRIPT = COLLECT_DOM_TREE_SCRIPT;

/**
 * Simple HTTP server to serve test app
 */
let testAppServer: http.Server | null = null;
let testAppPort: number = 0;

async function startTestAppServer(): Promise<number> {
    if (testAppServer) {
        return testAppPort;
    }

    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const filePath = path.join(RCA_TEST_APP_DIR, 'index.html');

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading test app');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        });

        server.listen(0, '127.0.0.1', () => {
            const addr = server.address();
            if (typeof addr === 'object' && addr) {
                testAppPort = addr.port;
                testAppServer = server;
                logger.info(`RCA test app server started on port ${testAppPort}`);
                resolve(testAppPort);
            } else {
                reject(new Error('Failed to get server address'));
            }
        });

        server.on('error', reject);
    });
}

function stopTestAppServer() {
    if (testAppServer) {
        testAppServer.close();
        testAppServer = null;
        testAppPort = 0;
        logger.info('RCA test app server stopped');
    }
}

/**
 * Captures screenshot and DOM from test app using Playwright
 */
async function capturePageData(url: string): Promise<{ screenshot: Buffer; domDump: object }> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 800, height: 600 },
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500); // Let styles settle

        const screenshot = await page.screenshot({ type: 'png' });
        // COLLECT_DOM_TREE_SCRIPT returns JSON string, parse it to object
        const domDumpStr = await page.evaluate(DOM_COLLECTOR_SCRIPT) as string;
        const domDump = JSON.parse(domDumpStr);

        return { screenshot, domDump };
    } finally {
        await context.close();
        await browser.close();
    }
}

/**
 * Helper to create a check with DOM snapshot via HTTP API
 */
async function createCheckWithDom(
    baseURL: string,
    hashedApiKey: string,
    testId: string,
    checkName: string,
    screenshot: Buffer,
    domDump: object,
    params: Record<string, string>
) {
    const form = new FormData();

    form.append('testid', testId);
    form.append('name', checkName);
    form.append('appName', params.app || 'RCA Demo App');
    form.append('branch', params.branch || 'demo');
    form.append('suitename', params.suite || 'RCA Demo Suite');
    form.append('viewport', params.viewport || '800x600');
    form.append('browserName', params.browserName || 'chrome');
    form.append('browserVersion', params.browserVersion || '120');
    form.append('browserFullVersion', params.browserFullVersion || '120.0.0.0');
    form.append('os', params.os || 'macOS');

    const hashcode = crypto.createHash('sha512').update(screenshot).digest('hex');
    form.append('hashcode', hashcode);
    form.append('file', screenshot, { filename: 'screenshot.png', contentType: 'image/png' });

    // Add DOM dump
    form.append('domdump', JSON.stringify(domDump));

    const response = await got.post(`${baseURL}/v1/client/createCheck`, {
        body: form,
        headers: {
            apikey: hashedApiKey,
        },
    });

    return JSON.parse(response.body);
}

/**
 * Helper to start a test session via HTTP API
 */
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

/**
 * Helper to stop a test session via HTTP API
 */
async function stopTestSession(baseURL: string, hashedApiKey: string, testId: string) {
    await got.post(`${baseURL}/v1/client/stopSession/${testId}`, {
        headers: {
            apikey: hashedApiKey,
        },
    });
}

/**
 * Creates a test with real screenshot and DOM from test app (normal state)
 */
Given(
    'I create RCA demo test with baseline DOM',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const apiKey = process.env.SYNGRISI_API_KEY || '123';
        const hashedApiKey = hashApiKey(apiKey);
        testData.set('hashedApiKey', hashedApiKey);

        const runIdent = crypto.randomUUID();
        const testName = 'RCA-Demo-Test';
        const baseURL = appServer.baseURL;

        // Start test app server
        const appPort = await startTestAppServer();
        testData.set('rcaTestAppPort', appPort);

        // Capture normal state
        logger.info('Capturing baseline from RCA test app (normal state)');
        const normalUrl = `http://127.0.0.1:${appPort}/`;
        const { screenshot, domDump } = await capturePageData(normalUrl);
        logger.info(`Captured DOM with ${JSON.stringify(domDump).length} bytes`);

        // Start test session
        logger.info('Starting RCA demo test session');
        const sessionData = await startTestSession(baseURL, hashedApiKey, {
            app: 'RCA Demo App',
            test: testName,
            run: 'RCA Demo Run',
            runident: runIdent,
            branch: 'demo',
            suite: 'RCA Demo Suite',
            os: 'macOS',
            browserName: 'chrome',
            browserVersion: '120',
            browserFullVersion: '120.0.0.0',
            viewport: '800x600',
        });

        const testId = sessionData.id || sessionData._id;
        logger.info(`RCA demo test session started with ID: ${testId}`);
        testData.set('lastTestId', testId);
        testData.set('rcaDemoRunIdent', runIdent);

        // Create baseline check
        logger.info('Creating baseline check with real DOM snapshot');
        const checkResult = await createCheckWithDom(
            baseURL,
            hashedApiKey,
            testId,
            'RCA-Demo-Check',
            screenshot,
            domDump,
            {
                app: 'RCA Demo App',
                branch: 'demo',
                suite: 'RCA Demo Suite',
                viewport: '800x600',
                browserName: 'chrome',
                browserVersion: '120',
                browserFullVersion: '120.0.0.0',
                os: 'macOS',
            }
        );

        logger.info(`Baseline check created: ${checkResult?._id || checkResult?.id}`);
        testData.set('rcaBaselineCheckId', checkResult?._id || checkResult?.id);

        await stopTestSession(baseURL, hashedApiKey, testId);
        logger.info('RCA demo baseline test session stopped');
    }
);

/**
 * Accepts the baseline and creates actual check with broken state
 */
When(
    'I create RCA demo actual check with DOM changes',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
        const hashedApiKey = testData.get('hashedApiKey') as string;
        const runIdent = testData.get('rcaDemoRunIdent') as string;
        const appPort = testData.get('rcaTestAppPort') as number;
        const baseURL = appServer.baseURL;

        // Accept the baseline first
        const baselineCheckId = testData.get('rcaBaselineCheckId') as string;
        logger.info(`Accepting baseline check: ${baselineCheckId}`);

        // Get check details to retrieve actualSnapshotId
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

        // Accept using PUT with baselineId
        await got.put(`${baseURL}/v1/checks/${baselineCheckId}/accept`, {
            headers: { apikey: hashedApiKey },
            json: { baselineId: actualSnapshotId },
        });

        // Capture broken state
        logger.info('Capturing actual from RCA test app (broken state)');
        const brokenUrl = `http://127.0.0.1:${appPort}/?broken=true`;
        const { screenshot, domDump } = await capturePageData(brokenUrl);
        logger.info(`Captured DOM with ${JSON.stringify(domDump).length} bytes`);

        // Start new test session for actual check
        logger.info('Starting RCA demo actual test session');
        const sessionData = await startTestSession(baseURL, hashedApiKey, {
            app: 'RCA Demo App',
            test: 'RCA-Demo-Test',
            run: 'RCA Demo Run - Actual',
            runident: runIdent + '-actual',
            branch: 'demo',
            suite: 'RCA Demo Suite',
            os: 'macOS',
            browserName: 'chrome',
            browserVersion: '120',
            browserFullVersion: '120.0.0.0',
            viewport: '800x600',
        });

        const testId = sessionData.id || sessionData._id;

        // Create actual check with broken state
        logger.info('Creating actual check with DOM changes (broken state)');
        const checkResult = await createCheckWithDom(
            baseURL,
            hashedApiKey,
            testId,
            'RCA-Demo-Check',
            screenshot,
            domDump,
            {
                app: 'RCA Demo App',
                branch: 'demo',
                suite: 'RCA Demo Suite',
                viewport: '800x600',
                browserName: 'chrome',
                browserVersion: '120',
                browserFullVersion: '120.0.0.0',
                os: 'macOS',
            }
        );

        const actualCheckId = checkResult?._id || checkResult?.id;
        logger.info(`Actual check created with DOM changes: ${actualCheckId}`);
        testData.set('rcaActualCheckId', actualCheckId);

        await stopTestSession(baseURL, hashedApiKey, testId);
        logger.info('RCA demo actual test session stopped');

        // Stop test app server
        stopTestAppServer();
    }
);

/**
 * Step to take RCA debug screenshot
 */
When(
    'I take RCA debug screenshot {string}',
    async ({ page }: { page: Page }, name: string) => {
        const timestamp = Date.now();
        const filename = `${timestamp}-${name.replace(/\s+/g, '-')}.png`;
        const filepath = path.join(RCA_SCREENSHOTS_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: false });
        logger.info(`RCA debug screenshot saved: ${filepath}`);
    }
);
