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
import * as yaml from 'yaml';
import { renderTemplate } from '@helpers/template';

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
    logger.info(`Fetched check for acceptance: ${JSON.stringify(check)}`);
    const checkId = check._id;
    const checkAcceptUri = `${appServer.baseURL}/v1/checks/${checkId}/accept`;

    logger.info(`Accepting check ${checkId}`);
    const result = await requestWithSession(checkAcceptUri, testData, appServer, {
      method: 'PUT',
      json: {
        baselineId: check.actualSnapshotId,
      },
    });

    logger.info(`Check ${checkId} accepted successfully: ${JSON.stringify(result.json)}`);
    const testId = check.test || check.testId;
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const checkFilter = encodeURIComponent(JSON.stringify({ _id: checkId }));
        const checkDetailsResponse = await requestWithSession(
          `${appServer.baseURL}/v1/checks?limit=0&filter=${checkFilter}`,
          testData,
          appServer
        );
        const checkDetails = (checkDetailsResponse.json.results || [])[0];
        const testDetails =
          testId
            ? (
              await requestWithSession(
                `${appServer.baseURL}/v1/tests?limit=0&filter=${encodeURIComponent(JSON.stringify({ _id: testId }))}`,
                testData,
                appServer
              )
            ).json.results?.[0]
            : null;
        const checkAccepted =
          checkDetails?.markedAs === 'accepted' ||
          (Array.isArray(checkDetails?.status)
            ? checkDetails.status.includes('accepted')
            : checkDetails?.isCurrentlyAccepted === true);
        logger.info(
          `Acceptance polling attempt ${attempt + 1}: checkAccepted=${checkAccepted}, markedAs=${testDetails?.markedAs}`
        );

        if (checkAccepted) {
          break;
        }
      } catch (pollError) {
        logger.warn(`Acceptance polling attempt ${attempt + 1} failed: ${(pollError as Error).message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (attempt === maxAttempts - 1) {
        logger.warn(`Acceptance polling timed out for check ${checkId}`);
      }
    }
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
    const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);

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
    form.append('browserVersion', '11');
    form.append('browserFullVersion', '11.0.0.0');
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
      form.append('browserVersion', '11');
      form.append('browserFullVersion', '11.0.0.0');
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

When(
  'I update via http check with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    yml: string
  ) => {
    const currentCheck = testData.get('currentCheck') as any;
    if (!currentCheck || !currentCheck._id) {
      throw new Error('No current check found. Please create a check first.');
    }
    const checkId = currentCheck._id;
    // Render template to replace placeholders like <currentDate-10>
    const renderedYml = renderTemplate(yml, testData);
    const params = yaml.parse(renderedYml);
    const uri = `${appServer.baseURL}/v1/checks/${checkId}`;
    logger.info(`Updating check ${checkId} with params:`, params);
    const result = await requestWithSession(uri, testData, appServer, {
      method: 'PUT',
      json: params,
    });
    logger.info(`Check ${checkId} updated successfully`);
    return result.json;
  }
);

When(
  'I update via http last {string} checks with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    num: string,
    yml: string
  ) => {
    // Render template to replace placeholders like <currentDate-10>
    const renderedYml = renderTemplate(yml, testData);
    const params = yaml.parse(renderedYml);
    const name = params.name;
    if (!name) {
      throw new Error('Name parameter is required in update params');
    }
    const uri = `${appServer.baseURL}/v1/checks?limit=${num}&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Fetching last ${num} checks with name "${name}"`);
    const checksResponse = await requestWithSession(uri, testData, appServer);
    const checks = checksResponse.json.results;
    logger.info(`Found ${checks.length} checks`);
    for (const check of checks) {
      const updateUri = `${appServer.baseURL}/v1/checks/${check._id}`;
      logger.info(`Updating check ${check._id} with params:`, params);
      const result = await requestWithSession(updateUri, testData, appServer, {
        method: 'PUT',
        json: params,
      });
      logger.info(`Check ${check._id} updated successfully`);
    }
    logger.info(`Updated ${checks.length} checks`);
  }
);

When(
  'I accept via SDK the {ordinal} check with name {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    name: string
  ) => {
    const vDriver = testData.get('vDriver') as any;
    if (!vDriver) {
      throw new Error('SDK Driver not found. Please start driver first with "When I start Driver"');
    }

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
    logger.info(`Fetched check for SDK acceptance: ${JSON.stringify(check)}`);
    const checkId = check._id;
    const baselineId = check.actualSnapshotId;



    logger.info(`Accepting check ${checkId} via SDK with baselineId ${baselineId}`);
    let result;
    try {
      result = await vDriver.acceptCheck({
        checkId,
        baselineId,
      });
      logger.info(`Check ${checkId} accepted via SDK successfully: ${JSON.stringify(result)}`);
    } catch (error: any) {
      logger.error(`Error accepting check via SDK: ${error.message}`);
      logger.error(error.stack);
      throw error;
    }

    // Poll for acceptance to complete
    const testId = check.test || check.testId;
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const checkFilter = encodeURIComponent(JSON.stringify({ _id: checkId }));
        const checkDetailsResponse = await requestWithSession(
          `${appServer.baseURL}/v1/checks?limit=0&filter=${checkFilter}`,
          testData,
          appServer
        );
        const checkDetails = (checkDetailsResponse.json.results || [])[0];
        const checkAccepted =
          checkDetails?.markedAs === 'accepted' ||
          (Array.isArray(checkDetails?.status)
            ? checkDetails.status.includes('accepted')
            : checkDetails?.isCurrentlyAccepted === true);
        logger.info(
          `SDK Acceptance polling attempt ${attempt + 1}: checkAccepted=${checkAccepted}, markedAs=${checkDetails?.markedAs}`
        );

        if (checkAccepted) {
          break;
        }
      } catch (pollError) {
        logger.warn(`SDK Acceptance polling attempt ${attempt + 1} failed: ${(pollError as Error).message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (attempt === maxAttempts - 1) {
        logger.warn(`SDK Acceptance polling timed out for check ${checkId}`);
      }
    }
    return result;
  }
);
