import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../../support/fixtures';

const { Given, When, Then } = createBdd(test);

When('I request {string} with API key', async ({ request, testData, appServer }, url) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const response = await request.get(`${appServer.baseURL}${url}`, {
        headers: { 'apikey': apiKey }
    });
    testData.set('aiResponse', response);
    testData.set('aiResponseBody', await response.text());
});

Then('I should receive an HTML response', async ({ testData }) => {
    const response = testData.get('aiResponse') as any;
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.status()).toBe(200);
});

Then('the response should contain {string}', async ({ testData }, text) => {
    const body = testData.get('aiResponseBody') as string;
    expect(body).toContain(text);
});

Then('the response should not contain {string}', async ({ testData }, text) => {
    const body = testData.get('aiResponseBody') as string;
    expect(body).not.toContain(text);
});

When('I request details for {string} via AI endpoint', async ({ request, testData, appServer }, checkName) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentCheck = testData.get('currentCheck') as any;
    const checkId = currentCheck._id || currentCheck.id;

    const response = await request.get(`${appServer.baseURL}/ai/checks/${checkId}`, {
        headers: { 'apikey': apiKey }
    });
    testData.set('aiResponse', response);
    testData.set('aiResponseBody', await response.text());
});

When('I request analysis for {string} via AI endpoint', async ({ request, testData, appServer }, checkName) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentCheck = testData.get('currentCheck') as any;
    const checkId = currentCheck._id || currentCheck.id;

    const response = await request.get(`${appServer.baseURL}/ai/analysis/${checkId}`, {
        headers: { 'apikey': apiKey }
    });
    testData.set('aiResponse', response);
    testData.set('aiResponseBody', await response.text());
});


When('I batch accept {string} via AI endpoint', async ({ request, testData, appServer }, checkName) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentCheck = testData.get('currentCheck') as any;
    const checkId = currentCheck._id || currentCheck.id;

    const response = await request.post(`${appServer.baseURL}/ai/batch`, {
        headers: { 'apikey': apiKey, 'accept': 'application/json' },
        data: {
            ids: [checkId],
            action: 'accept'
        }
    });
    expect(response.status()).toBe(200);
});

Then('the check {string} should be {string}', async ({ request, testData, appServer }, checkName, status) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentCheck = testData.get('currentCheck') as any;
    const checkId = currentCheck._id || currentCheck.id;

    const response = await request.get(`${appServer.baseURL}/v1/checks`, {
        headers: { 'apikey': apiKey },
        params: { filter: JSON.stringify({ _id: checkId }) }
    });
    const result = await response.json();
    const check = result.results[0];
    expect(check.status[0]).toBe(status);
});

Then('the check {string} should be marked as {string}', async ({ request, testData, appServer }, checkName, markedAs) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentCheck = testData.get('currentCheck') as any;
    const checkId = currentCheck._id || currentCheck.id;

    const response = await request.get(`${appServer.baseURL}/v1/checks`, {
        headers: { 'apikey': apiKey },
        params: { filter: JSON.stringify({ _id: checkId }) }
    });
    const result = await response.json();
    const check = result.results[0];
    expect(check.markedAs).toBe(markedAs);
});

When('I filter checks by name {string}', async ({ request, testData, appServer }, name) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const currentTest = testData.get('currentTest') as any;
    const runId = currentTest?.run;

    const params: any = { name };
    if (runId) params.run = runId;

    const response = await request.get(`${appServer.baseURL}/ai/checks`, {
        headers: { 'apikey': apiKey },
        params
    });
    testData.set('aiResponse', response);
    testData.set('aiResponseBody', await response.text());
});

When('I filter checks by date range', async ({ request, testData, appServer }) => {
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const today = new Date().toISOString().split('T')[0];
    const currentTest = testData.get('currentTest') as any;
    const runId = currentTest?.run;

    const params: any = { fromDate: today, toDate: today };
    if (runId) params.run = runId;

    const response = await request.get(`${appServer.baseURL}/ai/checks`, {
        headers: { 'apikey': apiKey },
        params
    });
    testData.set('aiResponse', response);
    testData.set('aiResponseBody', await response.text());
});

Then('I should receive a JSON response', async ({ testData }) => {
    const response = testData.get('aiResponse') as any;
    expect(response.headers()['content-type']).toContain('application/json');
    const json = JSON.parse(testData.get('aiResponseBody') as string);
    testData.set('aiResponseJSON', json);
});

Then('the JSON response should have property {string}', async ({ testData }, property) => {
    const json = testData.get('aiResponseJSON') as any;
    expect(json).toHaveProperty(property);
});

Then('I should receive a CSV response', async ({ testData }) => {
    const response = testData.get('aiResponse') as any;
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/csv');
});

Then('the JSON results should only contain specified fields', async ({ testData }) => {
    const json = testData.get('aiResponseJSON') as any;
    expect(json.results).toBeDefined();
    if (json.results.length > 0) {
        const firstResult = json.results[0];
        const keys = Object.keys(firstResult);
        // Should only have the specified fields: _id, name, status
        expect(keys.length).toBeLessThanOrEqual(3);
        expect(keys.every((k: string) => ['_id', 'name', 'status'].includes(k))).toBe(true);
    }
});
