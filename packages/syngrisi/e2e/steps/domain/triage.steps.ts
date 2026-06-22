import { Given, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';

const logger = createLogger('TriageSteps');

async function findCheckByName(
    appServer: AppServerFixture,
    testData: TestStore,
    name: string,
    ordinal: number,
): Promise<any> {
    const current = testData.get('currentCheck') as Record<string, any> | undefined;
    if (current && current.name === name && (current._id || current.id)) return current;
    const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    const resp = await requestWithSession(uri, testData, appServer);
    const item = (resp.json.results || [])[ordinal];
    if (!item) throw new Error(`check "${name}" #${ordinal} not found`);
    return item;
}

// Set per-project auto-accept policy via the app API (PATCH /v1/app/:id/triage-policy).
Given(
    'the project {string} has triage policy {string} threshold {int} verdicts {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, project: string, policy: string, threshold: number, verdicts: string) => {
        const listUri = `${appServer.baseURL}/v1/app?limit=0&filter={"name":"${project}"}`;
        const listResp = await requestWithSession(listUri, testData, appServer);
        const app = (listResp.json.results || [])[0];
        expect(app, `project "${project}" not found`).toBeTruthy();
        const id = app._id || app.id;
        const patchUri = `${appServer.baseURL}/v1/app/${id}/triage-policy`;
        const resp = await requestWithSession(patchUri, testData, appServer, {
            method: 'PATCH',
            json: {
                triagePolicy: {
                    policy,
                    autoAcceptThreshold: threshold,
                    autoAcceptVerdicts: verdicts.split(',').map((v) => v.trim()).filter(Boolean),
                },
            },
        });
        expect(resp.raw?.statusCode).toBe(200);
        logger.info(`set triagePolicy for project "${project}": ${policy} >= ${threshold} [${verdicts}]`);
    },
);

// Trigger AI triage synchronously via the run endpoint (deterministic, no scheduler wait).
When(
    'I run AI triage for the {ordinal} check named {string}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        ordinal: number,
        name: string,
    ) => {
        const check = await findCheckByName(appServer, testData, name, ordinal);
        const id = check._id || check.id;
        const uri = `${appServer.baseURL}/ai/triage/${id}/run`;
        const resp = await requestWithSession(uri, testData, appServer, { method: 'POST', json: {} });
        expect(resp.raw?.statusCode).toBe(200);
        testData.set('lastTriage', resp.json?.triage);
        logger.info(`triage run for "${name}": ${JSON.stringify(resp.json?.triage)}`);
    },
);
