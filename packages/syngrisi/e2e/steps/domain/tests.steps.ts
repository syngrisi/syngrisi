import { Given, When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { env } from '@config';
import type { AppServerFixture } from '@fixtures';
import { isServerRunning } from '@utils/app-server';
import FormData from 'form-data';
import { got } from 'got-cjs';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import type { TestStore } from '@fixtures';

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

const fileBufferCache = new Map<string, Buffer>();

function getCachedFileBuffer(fullPath: string): Buffer {
  const cached = fileBufferCache.get(fullPath);
  if (cached) return cached;
  const buffer = fs.readFileSync(fullPath);
  fileBufferCache.set(fullPath, buffer);
  return buffer;
}

async function createCheckViaAPI(
  vDriver: SyngrisiDriver,
  testId: string,
  checkName: string,
  imageBuffer: Buffer,
  params?: Record<string, unknown>
): Promise<unknown> {
  // Use SyngrisiDriver.check() method directly (as in old framework: browser.vDriver.check())
  // Parameters are taken from vDriver.params.test (set by startTestSession), so we only pass optional overrides
  logger.info(`Creating check "${checkName}" for test "${testId}" via SyngrisiDriver`);

  try {
    const checkParams: any = {
      checkName,
      imageBuffer,
      params: params || {}, // Optional params to override defaults from test session
    };

    const result = await vDriver.check(checkParams);
    return result;
  } catch (error: any) {
    logger.error(`Failed to create check: ${error.message}`);
    throw error;
  }
}

async function createCheckForExistingTest(
  { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
  testId: string,
  params: any,
  check: any
) {
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const filePath = check.filePath || params.filePath || 'files/A.png';
  const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test file not found: ${fullPath}`);
  }
  const imageBuffer = getCachedFileBuffer(fullPath);
  const form = new FormData();
  form.append('testid', testId);
  const resolvedCheckName = check.checkName || check.name || params.checkName || 'CheckName';
  form.append('name', resolvedCheckName);
  form.append('appName', params.project || 'Test App');
  form.append('branch', params.branch || 'integration');
  form.append('suitename', params.suite || params.suiteName || 'Integration suite');
  form.append('viewport', check.viewport || params.viewport || '1366x768');
  form.append('browserName', check.browserName || params.browserName || 'chrome');
  form.append('browserVersion', check.browserVersion || params.browserVersion || '11');
  form.append('browserFullVersion', check.browserFullVersion || params.browserFullVersion || '11.0.0.0');
  form.append('os', check.os || params.os || 'macOS');
  const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
  form.append('hashcode', hashcode);
  form.append('file', imageBuffer, path.basename(fullPath));

  const hashedApiKey =
    (testData.get('hashedApiKey') as string | undefined) ||
    hashApiKey(process.env.SYNGRISI_API_KEY || '123');
  const headers: Record<string, string> = {
    apikey: hashedApiKey,
  };

  logger.info(`Adding check "${resolvedCheckName}" to existing test "${testId}" via client API`);
  const response = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
    body: form,
    headers,
  });
  const checkResult = JSON.parse(response.body);

  const storedChecks =
    (testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }>) || [];
  const createdCheckId = checkResult?._id || checkResult?.id;
  const createdSnapshotId =
    checkResult?.actualSnapshotId?._id ||
    checkResult?.actualSnapshotId?.id ||
    checkResult?.actualSnapshotId;
  if (createdCheckId && createdSnapshotId) {
    storedChecks.push({ checkId: createdCheckId, snapshotId: createdSnapshotId });
    testData.set('autoCreatedChecks', storedChecks);
  }
  testData.set('currentCheck', checkResult);
  return checkResult;
}

interface CreateTestsOptions {
  keepOriginalTestNames?: boolean;
}

async function createTestsWithParams(
  { appServer, testData }: { appServer: AppServerFixture; testData: any },
  num: string,
  yml: string,
  options: CreateTestsOptions = {}
) {
  const apiKey = process.env.SYNGRISI_API_KEY || '123';
  const hashedApiKey = hashApiKey(apiKey);
  testData.set('hashedApiKey', hashedApiKey);
  testData.set('apiBaseUrl', appServer.baseURL);
  const initialChecks = (testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }>) || [];
  testData.set('autoCreatedChecks', initialChecks);
  const createTest = async (params: any, index: number) => {
    try {
      const cid = process.env.DOCKER === '1' ? 100 : parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
      const serverPort = appServer.serverPort || parseInt(process.env.SYNGRISI_APP_PORT || '', 10) || 3002 + cid;
      if (!(await isServerRunning(serverPort))) {
        logger.info(`App server is not running on port ${serverPort}, starting before creating tests`);
        await appServer.start();
      }

      let vDriver = testData.get('vDriver') as SyngrisiDriver | undefined;
      if (!vDriver) {
        const baseURL = appServer.baseURL || `http://${env.E2E_BACKEND_HOST}:${appServer.serverPort || 3002}`;
        const normalizedURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
        vDriver = new SyngrisiDriver({
          url: normalizedURL,
          apiKey,
        });
        testData.set('vDriver', vDriver);
        logger.info('SyngrisiDriver auto-initialized because it was missing');
      }

      const testIndex = index + 1;
      const shouldKeepOriginal = options.keepOriginalTestNames === true;
      const fallbackName = `Test - ${testIndex}`;
      const baseName = params.testName ?? fallbackName;
      const testName = shouldKeepOriginal ? baseName : `${baseName} - ${testIndex}`;
      const resolvedRunIdent =
        params.runident ||
        params.runIdent ||
        process.env.RUN_IDENT ||
        uuidv4();

      logger.info(`Starting test session for "${testName}"`);
      const sessionData = await vDriver.startTestSession({
        params: {
          app: params.project || 'Test App',
          test: testName,
          run: params.run || params.runName || process.env.RUN_NAME || 'integration_run_name',
          runident: resolvedRunIdent,
          branch: params.branch || 'integration',
          suite: params.suite || params.suiteName || 'Integration suite',
          tags: params.tags || [],
          os: params.os || 'macOS',
          browserName: params.browserName || 'chrome',
          browserVersion: params.browserVersion || '11',
          browserFullVersion: params.browserFullVersion || '11.0.0.0',
          viewport: params.viewport || '1366x768',
        },
      });

      const testId = (sessionData as any).id || (sessionData as any)._id;
      logger.info(`Test session started with ID: ${testId}`);
      testData.set('lastTestId', testId);
      // Allow backend to finish persisting test/check data before further actions (legacy behavior)
      // Increased wait time to ensure data is fully indexed and available to UI
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const checkResults = [];
      for (const check of params.checks || []) {
        const checkName = check.checkName || check.name || 'CheckName';
        if (!check.filePath) {
          throw new Error(
            `filePath is required for check "${checkName}". ` +
            `Please specify filePath in the feature file. Example:\n` +
            `  checks:\n` +
            `    - checkName: ${checkName}\n` +
            `      filePath: files/A.png`
          );
        }
        const filePath = check.filePath;
        const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
        const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);
        if (!fs.existsSync(fullPath)) {
          throw new Error(`Test file not found: ${fullPath}`);
        }
        const imageBuffer = getCachedFileBuffer(fullPath);
        const checkResult = await createCheckViaAPI(
          vDriver,
          testId,
          checkName,
          imageBuffer,
          {
            ...check,
            browserName: check.browserName || params.browserName || 'chrome',
            os: check.os || params.os || 'macOS',
            viewport: check.viewport || params.viewport || '1366x768',
          }
        ) as any;
        logger.info(
          `Check "${checkName}" created with status "${checkResult?.status}" ` +
          `(id: ${checkResult?._id || checkResult?.id}) ` +
          `(browser=${checkResult?.browserName}, os=${checkResult?.os})`
        );
        checkResults.push(checkResult);

        const storedChecks =
          (testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }>) || [];
        const createdCheckId = checkResult?._id || checkResult?.id;
        const createdSnapshotId = checkResult?.actualSnapshotId?._id
          || checkResult?.actualSnapshotId?.id
          || checkResult?.actualSnapshotId;
        if (createdCheckId && createdSnapshotId) {
          storedChecks.push({ checkId: createdCheckId, snapshotId: createdSnapshotId });
          testData.set('autoCreatedChecks', storedChecks);
        }
      }

      if (!params.checks || params.checks.length === 0) {
        const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
        const defaultPath = path.join(repoRoot, 'syngrisi', 'tests', params.filePath || 'files/A.png');
        if (fs.existsSync(defaultPath)) {
          const imageBuffer = getCachedFileBuffer(defaultPath);
          const checkResult = await createCheckViaAPI(
            vDriver,
            testId,
            params.checkName || 'CheckName',
            imageBuffer,
            {
              browserName: params.browserName || 'chrome',
              os: params.os || 'macOS',
              viewport: params.viewport || '1366x768',
            }
          ) as any;
          checkResults.push(checkResult);

          const storedChecks =
            (testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }>) || [];
          const createdCheckId = checkResult?._id || checkResult?.id;
          const createdSnapshotId = checkResult?.actualSnapshotId?._id
            || checkResult?.actualSnapshotId?.id
            || checkResult?.actualSnapshotId;
          if (createdCheckId && createdSnapshotId) {
            storedChecks.push({ checkId: createdCheckId, snapshotId: createdSnapshotId });
            testData.set('autoCreatedChecks', storedChecks);
          }
        }
      }

      logger.info(`Created test "${testName}" with ${checkResults.length} checks`);
      if (checkResults.length > 0) {
        testData.set('currentCheck', checkResults[checkResults.length - 1]);
        logger.info(`Saved current check: ${checkResults[checkResults.length - 1]._id || checkResults[checkResults.length - 1].id}`);
      }

      try {
        await vDriver.stopTestSession();
        logger.info(`Stopped test session for "${testName}"`);
      } catch (stopError: any) {
        logger.warn(`Failed to stop test session for "${testName}": ${stopError.message}`);
      }

      // Additional wait after test completion to ensure all data is persisted and indexed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { testId, checkResults };
    } catch (error) {
      logger.error(`Failed to create test: ${(error as Error).message}`);
      throw error;
    }
  };

  const count = parseInt(num, 10);
  for (let i = 0; i < count; i++) {
    const processedYml = yml.replace(/\$/g, String(i));
    const params = yaml.parse(processedYml);
    logger.info(`Creating test #${i + 1} with params:`, params);
    await createTest(params, i);
  }

  // Additional wait after all tests are created to ensure data is fully available
  if (count > 0) {
    logger.info(`Waiting for ${count} test(s) to be fully indexed...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

Given('I create {string} tests with:', async (
  { appServer, testData }: { appServer: AppServerFixture; testData: any },
  num: string,
  yml: string
) => {
  await createTestsWithParams({ appServer, testData }, num, yml, { keepOriginalTestNames: true });
});

When('I create {string} tests with params:', async (
  { appServer, testData }: { appServer: AppServerFixture; testData: any },
  num: string,
  yml: string
) => {
  await createTestsWithParams({ appServer, testData }, num, yml);
});

async function unfoldTestRow(page: Page, testName: string): Promise<void> {
  const selector = `[data-table-test-name="${testName}"], tr[data-row-name="${testName}"]`;
  logger.info(`Waiting for test "${testName}" to appear on the page using selector: ${selector}`);

  const candidate = page.locator(selector).first();
  try {
    await candidate.waitFor({ state: 'attached', timeout: 30000 });
  } catch (error) {
    throw new Error(`Unable to locate test row for "${testName}"`);
  }

  const tagName = await candidate.evaluate((el) => el.tagName.toLowerCase());
  logger.info(`Matched test element with tag "${tagName}"`);

  let testElement;
  if (tagName === 'tr') {
    testElement = candidate;
  } else {
    testElement = candidate.locator('xpath=./ancestor::tr[1]').first();
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
}

When('I unfold the test {string}', async (
  { page, testData }: { page: Page; testData: TestStore },
  testName: string
) => {
  await unfoldTestRow(page, testName);
  if (testData) {
    testData.set('lastUnfoldedTest', testName);
  }
});
