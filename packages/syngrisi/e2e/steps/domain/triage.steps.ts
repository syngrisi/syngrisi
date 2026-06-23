import { Given, When, Then } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { expect, test } from '@playwright/test';
import * as yaml from 'yaml';

const logger = createLogger('TriageSteps');

const VALID_VERDICTS = ['intended_change', 'likely_bug', 'noise', 'uncertain'];
const OLLAMA_BASE = process.env.E2E_VLM_BASE_URL || 'http://localhost:11434';

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

// --- Live VLM (@live-vlm, opt-in) ----------------------------------------------------------
// Verifies the real classification path against a local Ollama vision model. Non-deterministic
// (asserts a well-formed verdict, not a specific one) and slow, so excluded from default runs.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Given('a local vision model is available', async ({ testData }: { testData: TestStore }) => {
    test.setTimeout(15 * 60 * 1000); // real VLMs (esp. "thinking" ones) can take minutes
    let models: any[] = [];
    try {
        const resp = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(4000) });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        models = (await resp.json())?.models || [];
    } catch (e) {
        throw new Error(`@live-vlm requires a local vision model. Ollama not reachable at ${OLLAMA_BASE} (${e}). `
            + `Start it: 'ollama serve' and pull a vision model, e.g. 'ollama pull qwen3-vl:8b'.`);
    }
    const visionModels = models.filter((m) => m?.capabilities?.includes('vision')).map((m) => m.name);
    const model = process.env.E2E_VLM_MODEL || visionModels[0];
    if (!model) throw new Error(`No vision-capable model found in Ollama at ${OLLAMA_BASE}. Available: ${models.map((m) => m.name).join(', ')}`);
    testData.set('vlmModel', model);
    logger.info(`live VLM available: using model "${model}"`);
});

When('I configure the triage provider for the local vision model', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    const model = testData.get('vlmModel') as string;
    const uri = `${appServer.baseURL}/v1/settings/ai_triage_provider`;
    const resp = await requestWithSession(uri, testData, appServer, {
        method: 'PATCH',
        json: { value: { type: 'openai', baseUrl: `${OLLAMA_BASE}/v1`, apiKey: 'ollama', model, maxTokens: 3000 }, enabled: true },
    });
    expect(resp.raw?.statusCode).toBe(200);
    logger.info(`configured live triage provider → ${OLLAMA_BASE}/v1 (${model})`);
});

Then('the {ordinal} check named {string} has a valid AI verdict', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, ordinal: number, name: string) => {
    const check = await findCheckByName(appServer, testData, name, ordinal);
    const fresh = await requestWithSession(`${appServer.baseURL}/v1/checks?limit=0&filter={"_id":"${check._id || check.id}"}`, testData, appServer);
    const t = (fresh.json.results || [])[0]?.triage;
    logger.info(`live verdict for "${name}": ${JSON.stringify(t)}`);
    expect(t, 'check has a triage verdict').toBeTruthy();
    expect(VALID_VERDICTS).toContain(t.verdict);
    expect(Number.isInteger(t.confidence) && t.confidence >= 0 && t.confidence <= 10, `confidence is 0..10 integer (got ${t.confidence})`).toBe(true);
    expect(typeof t.reason === 'string' && t.reason.length > 0, 'reason is non-empty').toBe(true);
    expect(t.failed, 'triage did not fail').not.toBe(true);
});

// Enable per-project AI Triage (off by default) via the app API.
Given('I enable AI triage for the project {string}', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, project: string) => {
    const listResp = await requestWithSession(`${appServer.baseURL}/v1/app?limit=0&filter={"name":"${project}"}`, testData, appServer);
    const app = (listResp.json.results || [])[0];
    expect(app, `project "${project}" not found`).toBeTruthy();
    const resp = await requestWithSession(`${appServer.baseURL}/v1/app/${app._id || app.id}/triage-policy`, testData, appServer, {
        method: 'PATCH',
        json: { triageEnabled: true },
    });
    expect(resp.raw?.statusCode).toBe(200);
});

// Set a custom (per-project) verdict set via the app API.
Given('I set custom triage verdicts for project {string}:', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, project: string, yml: string) => {
    const triageVerdicts = yaml.parse(yml);
    const listResp = await requestWithSession(`${appServer.baseURL}/v1/app?limit=0&filter={"name":"${project}"}`, testData, appServer);
    const app = (listResp.json.results || [])[0];
    expect(app, `project "${project}" not found`).toBeTruthy();
    const resp = await requestWithSession(`${appServer.baseURL}/v1/app/${app._id || app.id}/triage-policy`, testData, appServer, {
        method: 'PATCH',
        json: { triageVerdicts },
    });
    expect(resp.raw?.statusCode).toBe(200);
});

Then('the {ordinal} check named {string} has no AI verdict', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, ordinal: number, name: string) => {
    const check = await findCheckByName(appServer, testData, name, ordinal);
    const fresh = await requestWithSession(`${appServer.baseURL}/v1/checks?limit=0&filter={"_id":"${check._id || check.id}"}`, testData, appServer);
    const t = (fresh.json.results || [])[0]?.triage;
    expect(t, `check "${name}" should have no triage verdict, got ${JSON.stringify(t)}`).toBeFalsy();
});

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
