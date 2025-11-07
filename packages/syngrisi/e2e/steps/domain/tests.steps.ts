import { Given, When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { AppServerFixture } from '@fixtures';
import FormData from 'form-data';
import { got } from 'got-cjs';

const logger = createLogger('TestsSteps');

function hashApiKey(apiKey: string): string {
  // hasha uses SHA-512 by default (as in wdio.conf.js:42)
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function createCheckViaAPI(
  baseURL: string,
  testId: string,
  checkName: string,
  imageBuffer: Buffer,
  params?: Record<string, unknown>
): Promise<unknown> {
  const form = new FormData();
  form.append('testid', testId);
  form.append('name', checkName);
  form.append('appName', params?.appName as string || 'Test App');
  form.append('branch', params?.branch as string || 'integration');
  form.append('suitename', params?.suiteName as string || 'Integration suite');
  form.append('viewport', params?.viewport as string || '1366x768');
  form.append('browserName', params?.browserName as string || 'chrome');
  form.append('browserVersion', params?.browserVersion as string || '120');
  form.append('browserFullVersion', params?.browserFullVersion as string || '120.0.0.0');
  form.append('os', params?.os as string || 'macOS');
  
  // Calculate hashcode for the image (SHA-512 gives 128 hex characters)
  const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
  form.append('hashcode', hashcode);
  
  // Append image file
  form.append('file', imageBuffer, 'file');

  const headers: Record<string, string> = {
    apikey: hashApiKey(process.env.SYNGRISI_API_KEY || ''),
  };

  const response = await got.post(`${baseURL}/v1/client/createCheck`, {
    body: form,
    headers,
  });

  return JSON.parse(response.body);
}

Given('I create {string} tests with:', async (
  { appServer, testData }: { appServer: AppServerFixture; testData: any },
  num: string,
  yml: string
) => {
  const createTest = async (params: any) => {
    try {
      // Start test session via HTTP API
      const form = new FormData();
      form.append('run', params.runName || process.env.RUN_NAME || 'integration_run_name');
      form.append('runident', params.runIdent || process.env.RUN_IDENT || uuidv4());
      form.append('name', params.testName);
      form.append('suite', params.suiteName || 'Integration suite');
      form.append('viewport', params.viewport || '1366x768');
      form.append('browser', params.browserName || 'chrome');
      form.append('browserVersion', params.browserVersion || '120');
      form.append('os', params.os || 'macOS');
      form.append('app', params.project || 'Test App');
      form.append('branch', params.branch || 'integration');
      if (params.tags) {
        form.append('tags', JSON.stringify(params.tags));
      }

      const headers: Record<string, string> = {
        apikey: hashApiKey(process.env.SYNGRISI_API_KEY || ''),
      };

      logger.info(`Starting test session for "${params.testName}"`);
      const sessionResponse = await got.post(`${appServer.baseURL}/v1/client/startSession`, {
        body: form,
        headers,
      });

      const sessionData = JSON.parse(sessionResponse.body);
      const testId = sessionData.id || sessionData._id;

      logger.info(`Test session started with ID: ${testId}`);

      // Wait a bit for session to initialize
      await new Promise((resolve) => setTimeout(resolve, 300));

      const checkResults = [];
      for (const check of params.checks || []) {
        const filepath = check.filePath || 'files/A.png';
        // Resolve file path relative to tests directory
        const repoRoot = path.resolve(__dirname, '..', '..', '..');
        const fullPath = path.join(repoRoot, 'tests', filepath);

        if (!fs.existsSync(fullPath)) {
          throw new Error(`Test file not found: ${fullPath}`);
        }

        const imageBuffer = fs.readFileSync(fullPath);
        logger.info(`Creating check "${check.checkName}" with file "${filepath}"`);
        const checkResult = await createCheckViaAPI(
          appServer.baseURL,
          testId,
          check.checkName,
          imageBuffer,
          {
            appName: params.project || 'Test App',
            branch: params.branch || 'integration',
            suiteName: params.suiteName || 'Integration suite',
            viewport: params.viewport || '1366x768',
            browserName: params.browserName || 'chrome',
            os: params.os || 'macOS',
            ...check,
          }
        );
        checkResults.push(checkResult);
      }

      if (checkResults.length > 0) {
        testData.set('currentCheck', checkResults[0]);
      }

      // Stop test session
      logger.info(`Stopping test session ${testId}`);
      const stopForm = new FormData();
      await got.post(`${appServer.baseURL}/v1/client/endSession/${testId}`, {
        body: stopForm,
        headers,
      }).catch((error) => {
        logger.warn(`Failed to stop session: ${error.message}`);
      });
    } catch (error: any) {
      if (error.response) {
        const errorBody = error.response.body?.toString() || 'No error body';
        logger.error(`Failed to create test: ${error.response.statusCode} - ${errorBody}`);
        throw new Error(`Failed to create test: ${error.response.statusCode} - ${errorBody}`);
      }
      logger.error(`Failed to create test: ${(error as Error).message}`);
      throw error;
    }
    };

  const count = parseInt(num, 10);
  for (let i = 0; i < count; i++) {
    const processedYml = yml.replace(/\$/g, String(i));
    const params = yaml.parse(processedYml);
    logger.info(`Creating test #${i + 1} with params:`, params);
    await createTest(params);
  }
});

When('I unfold the test {string}', async ({ page }: { page: Page }, testName: string) => {
  const candidateSelectors = [
    `[data-table-test-name="${testName}"]`,
    `tr[data-row-name="${testName}"]`,
  ];

  // Wait for the test to appear on the page
  logger.info(`Waiting for test "${testName}" to appear on the page`);
  await page.waitForFunction(
    (name) => {
      const selectors = [
        `[data-table-test-name="${name}"]`,
        `tr[data-row-name="${name}"]`,
      ];
      return selectors.some((sel) => document.querySelector(sel) !== null);
    },
    testName,
    { timeout: 30000 }
  );

  let testElement = null;
  let selectedSelector = '';

  for (const selector of candidateSelectors) {
    try {
      const candidate = page.locator(selector).first();
      if (await candidate.count() > 0) {
        const tagName = await candidate.evaluate((el) => el.tagName.toLowerCase());
        logger.info(`Matched selector "${selector}" with tag "${tagName}"`);

        if (tagName === 'tr') {
          testElement = candidate;
        } else {
          testElement = candidate.locator('xpath=./ancestor::tr[1]').first();
        }

        if ((await testElement.count()) > 0) {
          selectedSelector = selector;
          break;
        }
      }
    } catch (error) {
      logger.warn(`Failed to find element with selector "${selector}": ${(error as Error).message}`);
    }
  }

  if (!testElement || (await testElement.count()) === 0) {
    throw new Error(`Unable to locate test row for "${testName}"`);
  }

  await testElement.scrollIntoViewIfNeeded();
  await testElement.waitFor({ state: 'visible', timeout: 10000 });

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        logger.info(`Retry attempt ${attempt}/${maxRetries} for test "${testName}"`);
        await page.waitForTimeout(500);
      }

      const nameCell = testElement.locator('[data-test="table-row-Name"]').first();
      if ((await nameCell.count()) > 0) {
        await nameCell.scrollIntoViewIfNeeded();
        await nameCell.waitFor({ state: 'visible', timeout: 5000 });
        await nameCell.click();
      } else {
        await testElement.click();
      }

      await page.waitForTimeout(100);

      // Wait for collapse element to become visible
      await page.waitForFunction(
        (rowName) => {
          const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
          const row = selector ? document.querySelector(selector) : null;
          if (!row) return false;
          const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
          if (!collapse) return false;
          const style = window.getComputedStyle(collapse);
          const rect = collapse.getBoundingClientRect();
          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.height > 0 &&
            rect.width > 0
          );
        },
        testName,
        { timeout: 30000 }
      );

      // Wait for content to be rendered
      await page.waitForFunction(
        (rowName) => {
          const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
          const row = selector ? document.querySelector(selector) : null;
          if (!row) return false;
          const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
          if (!collapse) return false;
          const style = window.getComputedStyle(collapse);
          const rect = collapse.getBoundingClientRect();
          const isVisible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.height > 0 &&
            rect.width > 0;
          if (!isVisible) return false;
          return collapse.children.length > 0 || collapse.textContent?.trim().length > 0;
        },
        testName,
        { timeout: 15000 }
      );

      break;
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) {
        throw new Error(`Failed to unfold test "${testName}" after ${maxRetries} attempts. Last error: ${lastError.message}`);
      }
    }
  }
});
