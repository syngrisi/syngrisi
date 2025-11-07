import { When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { got } from 'got-cjs';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import FormData from 'form-data';

const logger = createLogger('ChecksHttpSteps');

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

When(
  'I accept via http the {ordinal} check with name {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    name: string
  ) => {
    const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;

    logger.info(`Fetching checks with name "${name}"`);
    const checksResponse = await requestWithSession(uri, testData, appServer);
    const checks = checksResponse.json.results;

    logger.info(`Found ${checks.length} checks`);

    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const check = checks[ordinal];
    if (!check) {
      throw new Error(`Check #${ordinal + 1} (${ordinal}-based index) with name "${name}" not found. Found ${checks.length} checks.`);
    }
    const checkId = check._id;
    const checkAcceptUri = `${appServer.baseURL}/v1/checks/${checkId}/accept`;

    logger.info(`Accepting check ${checkId}`);
    const result = await requestWithSession(checkAcceptUri, testData, appServer, {
      method: 'PUT',
      json: {
        baselineId: check.actualSnapshotId,
      },
    });

    logger.info(`Check ${checkId} accepted successfully`);
    return result.json;
  }
);

When(
  'I check image with path: {string} as {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    filePath: string,
    checkName: string
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const fullPath = path.join(repoRoot, 'tests', filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Test file not found: ${fullPath}`);
    }

    const imageBuffer = fs.readFileSync(fullPath);

    // Get last session ID from test data
    const testId = testData.get('lastTestId') as string | undefined;
    if (!testId) {
      throw new Error('No test session found. Please start a test session first.');
    }

    const form = new FormData();
    form.append('testid', testId);
    form.append('name', checkName);
    form.append('appName', 'Test App');
    form.append('branch', 'integration');
    form.append('suitename', 'Integration suite');
    form.append('viewport', '1366x768');
    form.append('browserName', 'chrome');
    form.append('browserVersion', '120');
    form.append('browserFullVersion', '120.0.0.0');
    form.append('os', 'macOS');

    const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
    form.append('hashcode', hashcode);
    form.append('file', imageBuffer, 'file');

    const headers: Record<string, string> = {
      apikey: hashApiKey(process.env.SYNGRISI_API_KEY || ''),
    };

    logger.info(`Creating check "${checkName}" with file "${filePath}"`);
    const response = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
      body: form,
      headers,
    });

    const checkResult = JSON.parse(response.body);
    testData.set('currentCheck', checkResult);
    return checkResult;
  }
);

When(
  'I check image with path: {string} as {string} and suppress exceptions',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    filePath: string,
    checkName: string
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
      const fullPath = path.join(repoRoot, 'tests', filePath);

      if (!fs.existsSync(fullPath)) {
        throw new Error(`Test file not found: ${fullPath}`);
      }

      const imageBuffer = fs.readFileSync(fullPath);

      const testId = testData.get('lastTestId') as string | undefined;
      if (!testId) {
        throw new Error('The test id is empty');
      }

      const form = new FormData();
      form.append('testid', testId);
      form.append('name', checkName);
      form.append('appName', 'Test App');
      form.append('branch', 'integration');
      form.append('suitename', 'Integration suite');
      form.append('viewport', '1366x768');
      form.append('browserName', 'chrome');
      form.append('browserVersion', '120');
      form.append('browserFullVersion', '120.0.0.0');
      form.append('os', 'macOS');

      const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
      form.append('hashcode', hashcode);
      form.append('file', imageBuffer, 'file');

      const headers: Record<string, string> = {
        apikey: hashApiKey(process.env.SYNGRISI_API_KEY || ''),
      };

      logger.info(`Creating check "${checkName}" with file "${filePath}"`);
      const response = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
        body: form,
        headers,
      });

      const checkResult = JSON.parse(response.body);
      testData.set('currentCheck', checkResult);
      return checkResult;
    } catch (e: any) {
      const error = e instanceof Error ? e : new Error(String(e));
      testData.set('currentCheck', { error });
      testData.set('error', error.message);
      logger.warn(`Suppressed exception: ${error.message}`);
    }
  }
);

