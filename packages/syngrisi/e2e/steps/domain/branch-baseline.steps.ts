import { Given, Then } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';

async function getAppByName(appServer: AppServerFixture, testData: TestStore, project: string): Promise<any> {
    const listUri = `${appServer.baseURL}/v1/app?limit=0&filter={"name":"${project}"}`;
    const listResp = await requestWithSession(listUri, testData, appServer);
    const app = (listResp.json.results || [])[0];
    expect(app, `project "${project}" not found`).toBeTruthy();
    return app;
}

// Set the project's read-time baseline fallback branch via the app API
// (PATCH /v1/app/:id/triage-policy, which also accepts the mainBranch field — see
// AppTriagePolicy.schema.ts / app.controller.ts). The fallback itself is opt-in
// (branchFallbackEnabled, default false), so this step also flips that switch on.
Given(
    'the project {string} has main branch {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, project: string, mainBranch: string) => {
        const app = await getAppByName(appServer, testData, project);
        const id = app._id || app.id;
        const patchUri = `${appServer.baseURL}/v1/app/${id}/triage-policy`;
        const resp = await requestWithSession(patchUri, testData, appServer, {
            method: 'PATCH',
            json: { mainBranch, branchFallbackEnabled: true },
        });
        expect(resp.raw?.statusCode).toBe(200);
    },
);

Then(
    'the project {string} main branch is {string}',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, project: string, mainBranch: string) => {
        const app = await getAppByName(appServer, testData, project);
        expect(app.mainBranch).toBe(mainBranch);
    },
);
