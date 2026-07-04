import { Given, Then, When } from '@fixtures';
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

// Promotes all ACCEPTED baselines of a project on a source branch to a target branch
// (POST /v1/baselines/promote), so a feature branch's approved baselines become the
// target branch's baselines. See baseline.service.ts promoteBaselines.
When(
    'I promote via http baselines for project {string} from branch {string} to branch {string}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        project: string,
        fromBranch: string,
        toBranch: string,
    ) => {
        const app = await getAppByName(appServer, testData, project);
        const id = app._id || app.id;
        const promoteUri = `${appServer.baseURL}/v1/baselines/promote`;
        const resp = await requestWithSession(promoteUri, testData, appServer, {
            method: 'POST',
            json: { app: id, fromBranch, toBranch },
        });
        expect(resp.raw?.statusCode).toBe(200);
    },
);

// Set the project's per-project retention (auto-delete old checks) via the same
// PATCH /v1/app/:id/triage-policy endpoint (retentionEnabled / retentionDays fields — see
// AppTriagePolicy.schema.ts / app.controller.ts).
Given(
    'the project {string} has retention enabled {string} days {string}',
    async (
        { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
        project: string,
        enabled: string,
        days: string,
    ) => {
        const app = await getAppByName(appServer, testData, project);
        const id = app._id || app.id;
        const patchUri = `${appServer.baseURL}/v1/app/${id}/triage-policy`;
        const resp = await requestWithSession(patchUri, testData, appServer, {
            method: 'PATCH',
            json: { retentionEnabled: enabled === 'true', retentionDays: parseInt(days, 10) },
        });
        expect(resp.raw?.statusCode).toBe(200);
    },
);
