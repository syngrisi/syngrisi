import { Given, Then } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const filesDir = path.resolve(__dirname, '..', '..', 'files');
const A = fs.readFileSync(path.join(filesDir, 'A.png'));
const B = fs.readFileSync(path.join(filesDir, 'B.png'));
// a clearly different image (unrelated change) lives in the package tests fixtures
const C = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'tests', 'files', 'C.png'));

// Push one failed check (accept `baseline`, then push `actual`) for a given run/test/viewport.
async function pushChange(
    baseURL: string, apiKey: string,
    o: { run: string; runident: string; app: string; test: string; viewport: string; checkName: string; baseline: Buffer; actual: Buffer },
) {
    const params = {
        test: o.test, run: o.run, runident: o.runident, app: o.app, branch: 'main',
        suite: o.run, os: 'macOS', browserName: 'chrome',
        browserVersion: '11', browserFullVersion: '11.0.0.0', viewport: o.viewport,
    };
    const d1 = new SyngrisiDriver({ url: baseURL, apiKey });
    await d1.startTestSession({ params });
    await d1.check({ checkName: o.checkName, imageBuffer: o.baseline, params: { viewport: o.viewport, browserName: 'chrome', os: 'macOS', autoAccept: true } });
    await d1.stopTestSession();
    const d2 = new SyngrisiDriver({ url: baseURL, apiKey });
    await d2.startTestSession({ params });
    await d2.check({ checkName: o.checkName, imageBuffer: o.actual, params: { viewport: o.viewport, browserName: 'chrome', os: 'macOS' } });
    await d2.stopTestSession();
}

const apiKey = () => process.env.SYNGRISI_API_KEY || '123';
const base = (appServer: AppServerFixture) => (appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`);

// Create ONE run where the SAME change (A -> B) is produced at several viewports — one test per
// viewport so the table rows are addressable; all share a run so they are sibling candidates.
Given(
    'I create a run {string} with the same change at viewports {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, runName: string, vpsCsv: string) => {
        const runident = crypto.randomUUID();
        const app = `${runName}-app`;
        testData.set(`simrun:${runName}`, { runident, app });
        for (const vp of vpsCsv.split(',').map((s) => s.trim()).filter(Boolean)) {
            await pushChange(base(appServer), apiKey(), {
                run: runName, runident, app, test: `${runName}__${vp}`, viewport: vp, checkName: 'ChangeCheck', baseline: A, actual: B,
            });
        }
        await new Promise((r) => setTimeout(r, 400));
    },
);

// Add an UNRELATED change (A -> C) to the same run; it must NOT be returned as a sibling and must
// be filtered out by "show in table".
Given(
    'I add an unrelated failed change {string} to run {string} at viewport {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, checkName: string, runName: string, vp: string) => {
        const info = testData.get(`simrun:${runName}`) as { runident: string; app: string };
        await pushChange(base(appServer), apiKey(), {
            run: runName, runident: info.runident, app: info.app, test: `${runName}__other`, viewport: vp, checkName, baseline: A, actual: C,
        });
        await new Promise((r) => setTimeout(r, 300));
    },
);

// Query siblings for the failed ChangeCheck at the first viewport; assert it returns the same
// change at exactly the OTHER viewports.
Then(
    'the change {string} has {int} siblings at other viewports',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, checkName: string, expected: number) => {
        const listUri = `${appServer.baseURL}/v1/checks?limit=0&sortBy=createdDate:asc&filter={"$and":[{"name":"${checkName}"},{"status":"failed"}]}`;
        const list = await requestWithSession(listUri, testData, appServer);
        const failed = (list.json.results || []) as Array<{ _id: string; viewport: string }>;
        expect(failed.length, 'failed checks created').toBeGreaterThanOrEqual(expected + 1);
        const query = failed[0];

        const resp = await requestWithSession(`${appServer.baseURL}/v1/checks/${query._id}/siblings`, testData, appServer);
        const results = (resp.json.results || []) as Array<{ viewport: string; distance: number }>;
        expect(results.length, `siblings of ${checkName}`).toBe(expected);
        const viewports = results.map((r) => r.viewport);
        expect(viewports).not.toContain(query.viewport);
        expect(new Set(viewports).size, 'one per viewport').toBe(results.length);
    },
);
