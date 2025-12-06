import { Given, When, Then } from '@fixtures';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import FormData from 'form-data';
import { got } from 'got-cjs';

function hashApiKey(apiKey: string): string {
    return crypto.createHash('sha512').update(apiKey).digest('hex');
}

// File buffer cache to avoid repeated disk reads
const fileBufferCache = new Map<string, Buffer>();
function getCachedFileBuffer(filePath: string): Buffer {
    const cached = fileBufferCache.get(filePath);
    if (cached) return cached;
    const buffer = fs.readFileSync(filePath);
    fileBufferCache.set(filePath, buffer);
    return buffer;
}

import { SyngrisiDriver } from '@syngrisi/wdio-sdk';

Given('I create a test run {string} with {int} checks', async ({ appServer }, runName, checkCount) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const baseURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const vDriver = new SyngrisiDriver({
        url: baseURL,
        apiKey,
    });

    const session = await vDriver.startTestSession({
        params: {
            test: runName,
            run: runName,
            runident: crypto.randomUUID(),
            app: 'Test App',
            branch: 'integration',
            suite: 'Integration suite',
            os: 'macOS',
            browserName: 'chrome',
            browserVersion: '11',
            browserFullVersion: '11.0.0.0',
            viewport: '1366x768',
        }
    });
    const testId = session.id || session._id;

    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const filePath = 'files/A.png';
    const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);
    const imageBuffer = getCachedFileBuffer(fullPath);

    // Create checks in parallel with concurrency control (was sequential with 100ms delays)
    const concurrency = 5;
    const checkPromises: Promise<void>[] = [];
    for (let i = 1; i <= checkCount; i++) {
        const checkPromise = vDriver.check({
            checkName: `Check ${i}`,
            imageBuffer,
            params: {
                viewport: '1366x768',
                browserName: 'chrome',
                os: 'macOS',
            }
        });
        checkPromises.push(checkPromise);
        // Execute in batches of `concurrency`
        if (checkPromises.length >= concurrency || i === checkCount) {
            await Promise.all(checkPromises);
            checkPromises.length = 0;
        }
    }
    await vDriver.stopTestSession();
    // Brief wait for indexing
    await new Promise(resolve => setTimeout(resolve, 300));
});

Given('I create a test run {string} with checks:', async ({ appServer }, runName, dataTable) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const baseURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    const vDriver = new SyngrisiDriver({
        url: baseURL,
        apiKey,
    });

    const session = await vDriver.startTestSession({
        params: {
            test: runName,
            run: runName,
            runident: crypto.randomUUID(),
            app: 'Test App',
            branch: 'integration',
            suite: 'Integration suite',
            os: 'macOS',
            browserName: 'chrome',
            browserVersion: '11',
            browserFullVersion: '11.0.0.0',
            viewport: '1366x768',
        }
    });
    const testId = session.id || session._id;

    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const filePath = 'files/A.png';
    const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);
    const imageBuffer = getCachedFileBuffer(fullPath);

    const checks = dataTable.hashes();
    // Create checks in parallel with concurrency control (was sequential with 100ms delays)
    const concurrency = 5;
    const checkPromises: Promise<void>[] = [];
    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];
        const checkPromise = vDriver.check({
            checkName: check.Name,
            imageBuffer,
            params: {
                viewport: '1366x768',
                browserName: 'chrome',
                os: 'macOS',
            }
        });
        checkPromises.push(checkPromise);
        // Execute in batches of `concurrency`
        if (checkPromises.length >= concurrency || i === checks.length - 1) {
            await Promise.all(checkPromises);
            checkPromises.length = 0;
        }
    }
    await vDriver.stopTestSession();
});

When('I click the {string} button', async ({ page }, buttonName) => {
    const map: Record<string, string> = {
        'Next Check': 'Next Check',
        'Previous Check': 'Previous Check',
        'Next Test': 'Next Test',
        'Previous Test': 'Previous Test',
    };
    const title = map[buttonName];
    if (!title) throw new Error(`Unknown button: ${buttonName}`);

    const btn = page.locator(`button[title="${title}"]`);
    await btn.click();
});

Then('the {string} button should be {string}', async ({ page }, buttonName, state) => {
    const map: Record<string, string> = {
        'Next Check': 'Next Check',
        'Previous Check': 'Previous Check',
        'Next Test': 'Next Test',
        'Previous Test': 'Previous Test',
    };
    const title = map[buttonName];
    if (!title) throw new Error(`Unknown button: ${buttonName}`);

    // Wait for header to be fully loaded (navigation state depends on check data)
    await page.waitForSelector('[data-check-header-ready="true"]', { timeout: 15000 });

    // Wait for navigation state to be fully calculated (sibling checks loaded)
    await page.waitForSelector('[data-navigation-ready="true"]', { timeout: 15000 });

    // Use modal context to avoid matching buttons outside the check details modal
    const btn = page.locator(`.modal button[title="${title}"], [data-check-header-name] ~ * button[title="${title}"]`).first();

    // Wait for button to be stable (navigation state may be initializing)
    await btn.waitFor({ state: 'visible', timeout: 10000 });

    // Use polling to wait for the correct state (async initialization)
    if (state === 'disabled') {
        await expect(btn).toBeDisabled({ timeout: 10000 });
    } else {
        await expect(btn).toBeEnabled({ timeout: 10000 });
    }
});

Then('I should see the check details for {string}', async ({ page }, checkName) => {
    // Wait for header to be fully loaded before checking name
    await page.waitForSelector('[data-check-header-ready="true"]', { timeout: 15000 });
    await expect(page.locator(`[data-check-header-name='${checkName}']`)).toBeVisible();
});
