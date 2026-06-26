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
    o: { run: string; runident: string; app: string; test: string; viewport: string; checkName: string; baseline: Buffer; actual: Buffer; browserName?: string },
) {
    const browserName = o.browserName || 'chrome';
    const params = {
        test: o.test, run: o.run, runident: o.runident, app: o.app, branch: 'main',
        suite: o.run, os: 'macOS', browserName,
        browserVersion: '11', browserFullVersion: '11.0.0.0', viewport: o.viewport,
    };
    const d1 = new SyngrisiDriver({ url: baseURL, apiKey });
    await d1.startTestSession({ params });
    await d1.check({ checkName: o.checkName, imageBuffer: o.baseline, params: { viewport: o.viewport, browserName, os: 'macOS', autoAccept: true } });
    await d1.stopTestSession();
    const d2 = new SyngrisiDriver({ url: baseURL, apiKey });
    await d2.startTestSession({ params });
    await d2.check({ checkName: o.checkName, imageBuffer: o.actual, params: { viewport: o.viewport, browserName, os: 'macOS' } });
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

// Add the SAME change (A -> B) at the SAME viewport but a different browser; it must be returned as
// a similar check too (similarity is NOT limited to other resolutions).
Given(
    'I add the same change {string} to run {string} at viewport {string} with browser {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, checkName: string, runName: string, vp: string, browser: string) => {
        const info = testData.get(`simrun:${runName}`) as { runident: string; app: string };
        await pushChange(base(appServer), apiKey(), {
            run: runName, runident: info.runident, app: info.app, test: `${runName}__${vp}__${browser}`, viewport: vp, checkName, baseline: A, actual: B, browserName: browser,
        });
        await new Promise((r) => setTimeout(r, 300));
    },
);

// Query the similar checks for the failed ChangeCheck at the first viewport; assert it returns the
// FULL ranked list (best first) with 0..1 scores, INCLUDING the same-viewport candidate, excluding
// the query check itself and the unrelated change.
Then(
    'the change {string} has {int} similar checks ranked by score including the same viewport',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, checkName: string, expected: number) => {
        const listUri = `${appServer.baseURL}/v1/checks?limit=0&sortBy=createdDate:asc&filter={"$and":[{"name":"${checkName}"},{"status":"failed"}]}`;
        const list = await requestWithSession(listUri, testData, appServer);
        const failed = (list.json.results || []) as Array<{ _id: string; viewport: string }>;
        expect(failed.length, 'failed checks created').toBeGreaterThanOrEqual(expected + 1);
        const query = failed[0];

        const resp = await requestWithSession(`${appServer.baseURL}/v1/checks/${query._id}/similar`, testData, appServer);
        const results = (resp.json.results || []) as Array<{ checkId: string; viewport: string; distance: number; score: number; name?: string }>;
        // full ranked list (every other same-change check), not deduped to one-per-viewport
        expect(results.length, `similar checks of ${checkName}`).toBe(expected);
        // the query check itself is excluded
        expect(results.map((r) => r.checkId)).not.toContain(query._id);
        // same-viewport candidate IS included (similarity is not cross-resolution only)
        expect(results.map((r) => r.viewport), 'same viewport included').toContain(query.viewport);
        // only the same change is returned; the unrelated change is gated out
        expect(results.every((r) => r.name === checkName), 'only the same change returned').toBe(true);
        // each result carries a 0..1 score and is ranked ascending by distance (score descending)
        for (const r of results) {
            expect(r.score, 'score in (0,1]').toBeGreaterThan(0);
            expect(r.score, 'score in (0,1]').toBeLessThanOrEqual(1);
        }
        const distances = results.map((r) => r.distance);
        expect(distances, 'ranked ascending by distance').toEqual([...distances].sort((a, b) => a - b));
    },
);
