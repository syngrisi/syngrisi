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

// Create ONE run where the SAME change (A baseline -> B actual) is produced at several viewports:
// per viewport, push+auto-accept A as the baseline, then push B to get a failed check with a diff.
Given(
    'I create a run {string} with the same change at viewports {string}',
    async ({ appServer }: { appServer: AppServerFixture }, runName: string, vpsCsv: string) => {
        const apiKey = process.env.SYNGRISI_API_KEY || '123';
        const baseURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
        const runident = crypto.randomUUID();
        const viewports = vpsCsv.split(',').map((s) => s.trim()).filter(Boolean);
        for (const vp of viewports) {
            const params = {
                test: runName, run: runName, runident, app: `${runName}-app`, branch: 'main',
                suite: runName, os: 'macOS', browserName: 'chrome',
                browserVersion: '11', browserFullVersion: '11.0.0.0', viewport: vp,
            };
            // accepted baseline (A)
            const d1 = new SyngrisiDriver({ url: baseURL, apiKey });
            await d1.startTestSession({ params });
            await d1.check({ checkName: 'ChangeCheck', imageBuffer: A, params: { viewport: vp, browserName: 'chrome', os: 'macOS', autoAccept: true } });
            await d1.stopTestSession();
            // actual (B) -> failed diff, same run
            const d2 = new SyngrisiDriver({ url: baseURL, apiKey });
            await d2.startTestSession({ params });
            await d2.check({ checkName: 'ChangeCheck', imageBuffer: B, params: { viewport: vp, browserName: 'chrome', os: 'macOS' } });
            await d2.stopTestSession();
        }
        await new Promise((r) => setTimeout(r, 400)); // brief indexing delay
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
        // every returned sibling is a DIFFERENT viewport than the query (same change, other resolution)
        const viewports = results.map((r) => r.viewport);
        expect(viewports).not.toContain(query.viewport);
        expect(new Set(viewports).size, 'one per viewport').toBe(results.length);
    },
);
