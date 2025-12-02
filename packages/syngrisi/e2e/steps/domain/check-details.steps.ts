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
    const imageBuffer = fs.readFileSync(fullPath);

    for (let i = checkCount; i >= 1; i--) {
        await vDriver.check({
            checkName: `Check ${i}`,
            imageBuffer,
            params: {
                viewport: '1366x768',
                browserName: 'chrome',
                os: 'macOS',
            }
        });
        await new Promise(r => setTimeout(r, 100));
    }
    await vDriver.stopTestSession();
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
    const imageBuffer = fs.readFileSync(fullPath);

    const checks = dataTable.hashes();
    const reversedChecks = [...checks].reverse();

    for (const check of reversedChecks) {
        await vDriver.check({
            checkName: check.Name,
            imageBuffer,
            params: {
                viewport: '1366x768',
                browserName: 'chrome',
                os: 'macOS',
            }
        });
        await new Promise(r => setTimeout(r, 100));
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

    const btn = page.locator(`button[title="${title}"]`);
    if (state === 'disabled') {
        await expect(btn).toBeDisabled();
    } else {
        await expect(btn).toBeEnabled();
    }
});

Then('I should see the check details for {string}', async ({ page }, checkName) => {
    await expect(page.locator(`[data-check-header-name='${checkName}']`)).toBeVisible();
});
