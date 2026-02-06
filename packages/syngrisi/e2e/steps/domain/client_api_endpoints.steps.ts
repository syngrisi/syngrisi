import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { got } from 'got-cjs';
import FormData from 'form-data';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { test } from '../../support/fixtures';
import { resolveRepoRoot } from '@utils/fs';

const { Given, When, Then } = createBdd(test);

const state: {
    apiKeyHash?: string;
    runIdent?: string;
    testId?: string;
    snapshotId?: string;
    checkName?: string;
    appName?: string;
    branch?: string;
    baselineResults?: unknown[];
    snapshotResults?: unknown[];
    identResults?: unknown[];
    errors: string[];
} = {
    errors: [],
};

function hashApiKey(apiKey: string): string {
    return crypto.createHash('sha512').update(apiKey).digest('hex');
}

function getSampleImageBuffer(): Buffer {
    const repoRoot = resolveRepoRoot();
    const imagePath = path.join(repoRoot, 'e2e', 'files', 'A.png');
    return fs.readFileSync(imagePath);
}

Given('I prepare client API auth for local server', async () => {
    state.errors = [];
    state.runIdent = `client-api-${Date.now()}`;
    state.checkName = `Client API Check ${Date.now()}`;
    state.appName = 'Client API App';
    state.branch = 'client-api-branch';

    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    state.apiKeyHash = hashApiKey(apiKey);
});

When('I start a client session via API', async ({ appServer }) => {
    try {
        const response = await got.post(`${appServer.baseURL}/v1/client/startSession`, {
            json: {
                name: 'Client API test',
                run: 'Client API run',
                runident: state.runIdent,
                app: state.appName,
                branch: state.branch,
                suite: 'Client API suite',
                os: 'Linux',
                browser: 'chrome',
                browserVersion: '100',
                browserFullVersion: '100.0.0.0',
                viewport: '1200x800',
            },
            headers: {
                apikey: state.apiKeyHash!,
                'Content-Type': 'application/json',
            },
        });
        const body = JSON.parse(response.body);
        state.testId = body.id || body._id || body.testId;
        if (!state.testId) {
            state.errors.push('startSession did not return testId');
        }
    } catch (error: any) {
        state.errors.push(`startSession failed: ${error.message || String(error)}`);
    }
});

When('I create a client check via API', async ({ appServer }) => {
    if (!state.testId) {
        state.errors.push('createCheck skipped: testId is missing');
        return;
    }
    try {
        const imageBuffer = getSampleImageBuffer();
        const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');

        const form = new FormData();
        form.append('testid', state.testId);
        form.append('name', state.checkName!);
        form.append('appName', state.appName!);
        form.append('branch', state.branch!);
        form.append('suitename', 'Client API suite');
        form.append('viewport', '1200x800');
        form.append('browserName', 'chrome');
        form.append('browserVersion', '100');
        form.append('browserFullVersion', '100.0.0.0');
        form.append('os', 'Linux');
        form.append('hashcode', hashcode);
        form.append('file', imageBuffer, 'A.png');

        const response = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
            body: form,
            headers: {
                apikey: state.apiKeyHash!,
            },
        });
        const body = JSON.parse(response.body);
        state.snapshotId =
            body?.actualSnapshotId?._id ||
            body?.actualSnapshotId?.id ||
            body?.actualSnapshotId;
        if (!state.snapshotId) {
            state.errors.push('createCheck did not return snapshotId');
        }
    } catch (error: any) {
        state.errors.push(`createCheck failed: ${error.message || String(error)}`);
    }
});

When('I fetch client baselines via API', async ({ appServer }) => {
    try {
        const filter = encodeURIComponent(JSON.stringify({
            name: state.checkName,
            viewport: '1200x800',
            browserName: 'chrome',
            os: 'Linux',
            app: state.appName,
            branch: state.branch,
        }));

        const response = await got.get(`${appServer.baseURL}/v1/client/baselines?filter=${filter}`, {
            headers: { apikey: state.apiKeyHash! },
        });
        const body = JSON.parse(response.body);
        state.baselineResults = body?.results || [];
    } catch (error: any) {
        state.errors.push(`getBaselines failed: ${error.message || String(error)}`);
    }
});

When('I fetch client snapshots via API', async ({ appServer }) => {
    if (!state.snapshotId) {
        state.errors.push('getSnapshots skipped: snapshotId is missing');
        return;
    }
    try {
        const filter = encodeURIComponent(JSON.stringify({ _id: state.snapshotId }));
        const response = await got.get(`${appServer.baseURL}/v1/client/snapshots?filter=${filter}`, {
            headers: { apikey: state.apiKeyHash! },
        });
        const body = JSON.parse(response.body);
        state.snapshotResults = body?.results || [];
    } catch (error: any) {
        state.errors.push(`getSnapshots failed: ${error.message || String(error)}`);
    }
});

When('I fetch client ident via API', async ({ appServer }) => {
    try {
        const response = await got.get(`${appServer.baseURL}/v1/client/getIdent`, {
            headers: { apikey: state.apiKeyHash! },
        });
        const body = JSON.parse(response.body);
        state.identResults = body || [];
    } catch (error: any) {
        state.errors.push(`getIdent failed: ${error.message || String(error)}`);
    }
});

When('I stop the client session via API', async ({ appServer }) => {
    if (!state.testId) {
        state.errors.push('stopSession skipped: testId is missing');
        return;
    }
    try {
        await got.post(`${appServer.baseURL}/v1/client/stopSession/${state.testId}`, {
            headers: { apikey: state.apiKeyHash! },
        });
    } catch (error: any) {
        state.errors.push(`stopSession failed: ${error.message || String(error)}`);
    }
});

Then('all client API endpoint calls should succeed', async () => {
    expect(state.errors, state.errors.join('\n')).toEqual([]);
    expect(Array.isArray(state.baselineResults)).toBe(true);
    expect(Array.isArray(state.snapshotResults)).toBe(true);
    expect(Array.isArray(state.identResults)).toBe(true);
    expect(state.snapshotResults!.length).toBeGreaterThan(0);
});
