
import { When, Then } from '@fixtures';
import { requestWithSession } from '@utils/http-client';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';
import type { AppServerFixture, TestStore } from '@fixtures';

const logger = createLogger('PluginApiSteps');
let lastResponse: any = null;
let lastError: any = null;

When(
    'I update plugin {string} settings via API:',
    async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, pluginName: string, json: string) => {
        const payload = JSON.parse(json);
        const uri = `${appServer.baseURL}/v1/plugins/${pluginName}`;

        logger.info(`Updating plugin ${pluginName} settings via PUT ${uri}`);
        logger.info(`Payload: ${json}`);

        lastResponse = null;
        lastError = null;

        try {
            lastResponse = await requestWithSession(uri, testData, appServer, {
                method: 'PUT',
                json: payload,
            });
            logger.info(`Update success: ${lastResponse.raw.statusCode}`);
        } catch (e: any) {
            lastError = e;
            logger.info(`Update failed as expected: ${e.message}`);
            if (e.response) {
                lastResponse = { raw: e.response, json: JSON.parse(e.response.body || '{}') };
            }
        }
    }
);

Then('the API response status should be {int}', async ({ }, status: number) => {
    const response = lastResponse?.raw || lastError?.response;
    if (!response) {
        throw new Error('No response captured');
    }
    expect(response.statusCode).toBe(status);
});

Then('the API response should contain {string}', async ({ }, text: string) => {
    // Check both json body and raw body
    const jsonBody = lastResponse?.json || (lastError?.response?.body ? JSON.parse(lastError.response.body) : {});
    const stringBody = JSON.stringify(jsonBody);

    if (!stringBody.includes(text)) {
        throw new Error(`Response body "${stringBody}" does not contain "${text}"`);
    }
});
