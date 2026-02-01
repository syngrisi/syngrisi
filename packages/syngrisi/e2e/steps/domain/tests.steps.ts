import { Given, When, Then } from '@fixtures';
import type { Locator, Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { env } from '@config';
import type { AppServerFixture } from '@fixtures';
import { ensureServerReady, isServerRunning } from '@utils/app-server';
import FormData from 'form-data';
import { got } from 'got-cjs';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import type { TestStore } from '@fixtures';

const logger = createLogger('TestsSteps');
const timingLogger = createLogger('timing');

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

  const maxAttempts = 5;
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const checkParams: any = {
        checkName,
        imageBuffer,
        params: params || {}, // Optional params to override defaults from test session
      };

      const result = await vDriver.check(checkParams);
      return result;
    } catch (error: any) {
      lastError = error;
      const message = error?.message || '';
      const statusCode = error?.response?.statusCode || error?.statusCode;
      const isRetryable =
        statusCode === 404 ||
        message.includes('404') ||
        message.toLowerCase().includes("can't find test") ||
        message.toLowerCase().includes('find test with id') ||
        message.toLowerCase().includes('not found') ||
        message.toLowerCase().includes('baseline is absent');

      if (isRetryable && attempt < maxAttempts) {
        const delayMs = 500 * attempt;
        logger.warn(
          `Failed to create check on attempt ${attempt}/${maxAttempts} (status: ${statusCode || 'n/a'}): ${message}. ` +
          `Retrying in ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      logger.error(`Failed to create check: ${message}`);
      throw error;
    }
  }

  throw lastError;
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
  const fastSeed = process.env.E2E_FAST_SEED === 'true';
  // Use sequential creation to guarantee test order (important for sorting tests)
  const concurrency = 1;
  const useSharedDriver = concurrency === 1;
  const quickCheckMaxWaitMs = fastSeed ? 1000 : 2000;
  const waitAfterStopMs = fastSeed ? 10 : 100;

  // For @fast-server tests, auth is disabled so we should always use the default API key.
  // Priority: 1) explicitly set by this test, 2) env variable, 3) default
  const storedApiKey = testData.get('explicitApiKey') as string | undefined;
  const envApiKey = process.env.SYNGRISI_API_KEY;
  const defaultApiKey = '123';
  const apiKey = storedApiKey || envApiKey || defaultApiKey;
  const hashedApiKey = hashApiKey(apiKey);
  testData.set('hashedApiKey', hashedApiKey);
  testData.set('apiBaseUrl', appServer.baseURL);
  const initialChecks = (testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }>) || [];
  testData.set('autoCreatedChecks', initialChecks);
  const createTest = async (params: any, index: number) => {
    try {
      const cid = process.env.DOCKER === '1' ? 100 : parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
      const serverPort = appServer.serverPort || parseInt(process.env.SYNGRISI_APP_PORT || '', 10) || 3002 + cid;
      let serverWasStarted = false;
      if (!(await isServerRunning(serverPort))) {
        logger.info(`App server is not running on port ${serverPort}, starting before creating tests`);
        await appServer.start();
        serverWasStarted = true;
        // Wait for server to be fully ready after startup using API readiness
        logger.info('Waiting for server to be fully ready...');
        await ensureServerReady(serverPort, 60_000);
      }

      let vDriver = testData.get('vDriver') as SyngrisiDriver | undefined;
      // Recreate vDriver if server was just started or if vDriver is missing.
      // When concurrency > 1 we avoid sharing the driver to prevent state races.
      if (!useSharedDriver || !vDriver || serverWasStarted) {
        const baseURL = appServer.baseURL || `http://${env.E2E_BACKEND_HOST}:${appServer.serverPort || 3002}`;
        const normalizedURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
        vDriver = new SyngrisiDriver({
          url: normalizedURL,
          apiKey,
        });
        if (useSharedDriver) {
          testData.set('vDriver', vDriver);
        }
        logger.info(
          serverWasStarted
            ? 'SyngrisiDriver recreated after server restart'
            : useSharedDriver
              ? 'SyngrisiDriver auto-initialized because it was missing'
              : 'SyngrisiDriver instantiated for fast seed'
        );
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

      const sessionParams = {
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
      };

      const startSessionWithRecovery = async () => {
        try {
          return await vDriver.startTestSession({ params: sessionParams });
        } catch (err: any) {
          const message = err?.message || String(err);
          const isConnRefused = message.includes('ECONNREFUSED') || message.includes('ERR_CONNECTION_REFUSED');
          const isUnauthorized = message.includes('401') || message.includes('Unauthorized');

          if (!isConnRefused && !isUnauthorized) {
            throw err;
          }

          logger.warn(`startTestSession failed with ${isUnauthorized ? 'auth' : 'connection'} error, restarting server and retrying once. Error: ${message}`);
          await appServer.restart(true);
          if (appServer.serverPort) {
            await ensureServerReady(appServer.serverPort);
          }

          // Recreate driver after restart to avoid stale baseURL
          const baseURLAfterRestart = appServer.baseURL || `http://${env.E2E_BACKEND_HOST}:${appServer.serverPort || 3002}`;
          const normalizedUrlAfterRestart = baseURLAfterRestart.endsWith('/') ? baseURLAfterRestart : `${baseURLAfterRestart}/`;
          vDriver = new SyngrisiDriver({
            url: normalizedUrlAfterRestart,
            apiKey,
          });
          if (useSharedDriver) {
            testData.set('vDriver', vDriver);
          }

          return await vDriver.startTestSession({ params: sessionParams });
        }
      };

      const sessionData = await startSessionWithRecovery();

      const testId = (sessionData as any).id || (sessionData as any)._id;
      logger.info(`Test session started with ID: ${testId}`);
      testData.set('lastTestId', testId);

      // Quick check that test is queryable (fast path - usually succeeds immediately)
      // MongoDB indexing typically completes within milliseconds for single documents
      const checkIntervalMs = 50;
      const startTime = Date.now();
      let testFound = false;

      while (Date.now() - startTime < quickCheckMaxWaitMs) {
        try {
          const baseFilter = encodeURIComponent(JSON.stringify({}));
          const filter = encodeURIComponent(JSON.stringify({ _id: testId }));
          const response = await got.get(
            `${appServer.baseURL}/v1/tests?base_filter=${baseFilter}&filter=${filter}&limit=1`,
            {
            headers: { apikey: hashedApiKey },
            throwHttpErrors: false,
            timeout: { request: 2000 },
            }
          );
          if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            if (Array.isArray(body?.results) && body.results.length > 0) {
              testFound = true;
              break;
            }
          }
        } catch {
          // Ignore errors, keep trying
        }
        await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
      }

      if (!testFound) {
        logger.warn(`Test ${testId} not queryable after ${quickCheckMaxWaitMs}ms, proceeding anyway`);
      }

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

      // Brief wait to allow session stop to propagate (much faster than polling)
      if (waitAfterStopMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitAfterStopMs));
      }

      return { testId, checkResults };
    } catch (error) {
      logger.error(`Failed to create test: ${(error as Error).message}`);
      throw error;
    }
  };

  const count = parseInt(num, 10);
  const createdTestIds: string[] = [];
  const tasks = Array.from({ length: count }, (_v, i) => i).map((i) => ({
    index: i,
    params: yaml.parse(yml.replace(/\$/g, String(i))),
  }));

  const testCreationStart = performance.now();
  timingLogger.info(`[timing] Starting test creation: ${count} tests with concurrency=${concurrency}`);

  let next = 0;
  const runNext = async () => {
    const current = next;
    next += 1;
    if (current >= tasks.length) return;
    const { index, params } = tasks[current];
    const singleTestStart = performance.now();
    logger.info(`Creating test #${index + 1} with params:`, params);
    const result = await createTest(params, index);
    if (result?.testId) {
      createdTestIds.push(result.testId);
    }
    timingLogger.debug(`[timing] Test #${index + 1} created: ${Math.round(performance.now() - singleTestStart)}ms`);
    await runNext();
  };

  const runners = Array.from({ length: Math.min(concurrency, tasks.length) }, () => runNext());
  await Promise.all(runners);
  timingLogger.info(`[timing] Test creation (${count} tests, concurrency=${concurrency}): ${Math.round(performance.now() - testCreationStart)}ms`);

  // Brief final wait to ensure all data is indexed (typically <100ms for batch operations)
  if (createdTestIds.length > 0) {
    const verificationStart = performance.now();
    logger.info(`Created ${createdTestIds.length} test(s), waiting for indexing...`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    logger.info(`All ${createdTestIds.length} test(s) ready`);

    const apiBaseUrl = appServer.baseURL;
    logger.info(
      `Verification context: baseURL=${apiBaseUrl}, ` +
      `TEST_WORKER_INDEX=${process.env.TEST_WORKER_INDEX || 'unset'}, ` +
      `SYNGRISI_DB_URI=${process.env.SYNGRISI_DB_URI || 'unset'}, ` +
      `createdTestIds=${createdTestIds.length}`
    );

    // Validate count via /v1/checks endpoint which supports API key auth
    // (unlike /v1/tests which only supports session auth)
    const maxRetries = 5;
    const retryDelays = [500, 1000, 2000, 3000, 5000];
    let lastError: Error | null = null;
    let verificationPassed = false;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const listResp = await got.get(`${apiBaseUrl}/v1/checks?limit=${createdTestIds.length + 5}`, {
          headers: { apikey: hashedApiKey },
          throwHttpErrors: false,
          timeout: { request: 5000 },
        });

        // Check content-type to detect HTML error pages
        const contentType = listResp.headers['content-type'] || '';
        const isJson = contentType.includes('application/json');
        const isHtml = contentType.includes('text/html') || listResp.body?.startsWith('<!');

        if (isHtml) {
          const bodyPreview = listResp.body?.substring(0, 200) || '';
          logger.warn(
            `Attempt ${attempt + 1}/${maxRetries}: API returned HTML (status=${listResp.statusCode}). ` +
            `Content-Type: ${contentType}. Body preview: ${bodyPreview}...`
          );
          throw new Error(`API returned HTML instead of JSON (status ${listResp.statusCode})`);
        }

        if (listResp.statusCode !== 200) {
          throw new Error(`List verification failed: status ${listResp.statusCode}, body: ${listResp.body?.substring(0, 200)}`);
        }

        if (!isJson && listResp.body) {
          logger.warn(`Response Content-Type is "${contentType}", attempting JSON parse anyway`);
        }

        const body = JSON.parse(listResp.body || '{}') as { totalResults?: number };
        const total = body?.totalResults ?? 0;

        if (total < createdTestIds.length) {
          throw new Error(`List verification count mismatch: expected >=${createdTestIds.length} checks, got ${total}`);
        }

        logger.info(`List verification passed on attempt ${attempt + 1}: totalResults=${total}`);
        verificationPassed = true;
        break;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          const delay = retryDelays[attempt];
          logger.warn(`Verification attempt ${attempt + 1} failed: ${lastError.message}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    timingLogger.info(`[timing] Verification: ${Math.round(performance.now() - verificationStart)}ms`);

    if (!verificationPassed) {
      throw new Error(`Failed to verify created checks via list endpoint after ${maxRetries} attempts: ${lastError?.message}`);
    }
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

  // Helper to wait for element and verify it's connected (handles DOM detachment from React Query refetches)
  const waitForConnectedElement = async (retries = 3): Promise<{ candidate: Locator; tagName: string }> => {
    for (let i = 0; i < retries; i++) {
      const candidate = page.locator(selector).first();
      try {
        // Use 'visible' instead of 'attached' to ensure element is stable and rendered
        await candidate.waitFor({ state: 'visible', timeout: 30000 });
      } catch (error) {
        // Log available tests for debugging
        const availableTests = await page.locator('[data-row-name]').evaluateAll((els) =>
          els.map((el) => el.getAttribute('data-row-name')).filter(Boolean)
        );
        logger.error(`Unable to locate test row for "${testName}". Available tests: ${availableTests.join(', ')}`);
        throw new Error(`Unable to locate test row for "${testName}". Available: [${availableTests.join(', ')}]`);
      }

      // Check element is still connected before evaluating
      const isConnected = await candidate.evaluate((el) => el.isConnected);
      if (!isConnected) {
        if (i < retries - 1) {
          logger.warn(`Test row for "${testName}" was detached from DOM, retrying (attempt ${i + 2}/${retries})`);
          await page.waitForTimeout(300); // Small delay to let React settle
          continue;
        }
        throw new Error(`Test row for "${testName}" was detached from DOM after ${retries} attempts`);
      }

      const tagName = await candidate.evaluate((el) => el.tagName.toLowerCase());
      return { candidate, tagName };
    }
    throw new Error(`Failed to get connected element for "${testName}"`);
  };

  const { candidate, tagName } = await waitForConnectedElement();
  logger.info(`Matched test element with tag "${tagName}"`);

  let testElement: Locator;
  if (tagName === 'tr') {
    testElement = candidate;
  } else {
    testElement = candidate.locator('xpath=./ancestor::tr[1]').first();
  }

  const rebuildTestElement = async (): Promise<Locator> => {
    const refreshedCandidate = page.locator(selector).first();
    await refreshedCandidate.waitFor({ state: 'visible', timeout: 10000 });
    const refreshedTag = await refreshedCandidate.evaluate((el) => el.tagName.toLowerCase());
    if (refreshedTag === 'tr') {
      return refreshedCandidate;
    }
    return refreshedCandidate.locator('xpath=./ancestor::tr[1]').first();
  };

  const scrollIntoViewSafely = async (): Promise<void> => {
    try {
      await testElement.scrollIntoViewIfNeeded();
    } catch (error: any) {
      const message = error?.message || '';
      if (message.includes('not attached to the DOM') || message.includes('detached from the DOM')) {
        logger.warn(`Test row was detached before scrolling, reacquiring row for "${testName}"`);
        testElement = await rebuildTestElement();
        await testElement.waitFor({ state: 'visible', timeout: 10000 });
        await testElement.scrollIntoViewIfNeeded();
      } else {
        throw error;
      }
    }
  };

  await scrollIntoViewSafely();
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

      // Wait for checks to be loaded (data-test-checks-ready attribute)
      await page.waitForFunction(
        (rowName) => {
          const row = document.querySelector(`tr[data-row-name="${rowName}"]`);
          if (!row) return false;
          const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
          if (!collapse) return false;
          // Check for checks ready OR no-checks message
          return collapse.querySelector('[data-test-checks-ready="true"]') !== null ||
            collapse.textContent?.includes('does not have any checks');
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

/**
 * Waits for a specific test row to appear in the table.
 * This step should be used after navigation when test data was created via API
 * and you need to ensure the UI has loaded and rendered the data.
 *
 * @example
 * ```gherkin
 * When I wait for test "TestName-1" to appear in table
 * ```
 */
When(
  'I wait for test {string} to appear in table',
  async ({ page }: { page: Page }, testName: string) => {
    const selector = `tr[data-row-name="${testName}"]`;
    logger.info(`Waiting for test "${testName}" to appear in table using selector: ${selector}`);

    const maxRetries = 15;
    const retryDelay = 500;
    const refreshButton = page.locator('[data-test="table-refresh-icon"]');
    const newItemsBadge = page.locator('[data-test="table-refresh-icon-badge"]');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // First check if test is already visible
      const locator = page.locator(selector).first();
      const isVisible = await locator.isVisible().catch(() => false);

      if (isVisible) {
        logger.info(`Test "${testName}" is now visible in table (attempt ${attempt})`);
        return;
      }

      // Check if there's a badge indicating new items - click Refresh and wait for badge to disappear
      const hasBadge = await newItemsBadge.isVisible({ timeout: 300 }).catch(() => false);

      if (hasBadge && await refreshButton.isVisible({ timeout: 500 }).catch(() => false)) {
        logger.info(`New items badge found (attempt ${attempt}/${maxRetries}), clicking Refresh`);
        await refreshButton.click();

        // Wait for badge to disappear (indicates refresh completed)
        try {
          await newItemsBadge.waitFor({ state: 'hidden', timeout: 5000 });
          logger.info('Badge disappeared after refresh');
        } catch {
          logger.warn('Badge still visible after refresh click, continuing anyway');
        }

        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => { });

        // Check again after refresh
        const isVisibleNow = await locator.isVisible().catch(() => false);
        if (isVisibleNow) {
          logger.info(`Test "${testName}" is now visible in table after badge refresh (attempt ${attempt})`);
          return;
        }

        // Continue to next iteration without additional refresh
        await page.waitForTimeout(retryDelay);
        continue;
      }

      // No badge - click Refresh anyway (server may have data)
      if (await refreshButton.isVisible({ timeout: 500 }).catch(() => false)) {
        logger.info(`Test not found, clicking Refresh (attempt ${attempt}/${maxRetries})`);
        await refreshButton.click();
        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => { });
      }

      // Brief wait for UI to update
      await page.waitForTimeout(retryDelay);

      // Check one more time after refresh
      const isVisibleAfterRefresh = await locator.isVisible().catch(() => false);
      if (isVisibleAfterRefresh) {
        logger.info(`Test "${testName}" is now visible in table after refresh (attempt ${attempt})`);
        return;
      }

      if (attempt === maxRetries) {
        // Final attempt - log current page state for debugging
        const tableRows = await page.locator('tr[data-row-name]').count();
        const rowNames = await page.locator('tr[data-row-name]').evaluateAll(
          (rows) => rows.map((r) => r.getAttribute('data-row-name')).slice(0, 10)
        );
        const badgeVisible = await newItemsBadge.isVisible().catch(() => false);
        throw new Error(
          `Test "${testName}" not found in table after ${maxRetries} attempts. ` +
          `Table has ${tableRows} rows. First 10 row names: ${JSON.stringify(rowNames)}. ` +
          `Badge visible: ${badgeVisible}`
        );
      }

      logger.warn(`Test "${testName}" not found (attempt ${attempt}/${maxRetries}), will retry...`);
    }
  }
);

/**
 * Waits for a specific check to appear in the collapsed row of a test.
 * This step handles race conditions by:
 * 1. Clicking the test row to unfold if collapsed
 * 2. Clicking Refresh if check doesn't appear
 *
 * @example
 * ```gherkin
 * When I wait for check "CheckName-1" to appear in collapsed row of test "TestName-1"
 * ```
 */
When(
  'I wait for check {string} to appear in collapsed row of test {string}',
  async ({ page }: { page: Page }, checkName: string, testName: string) => {
    const testRowSelector = `tr[data-row-name="${testName}"]`;
    const checkSelector = `[data-table-check-name="${checkName}"]`;

    logger.info(`Waiting for check "${checkName}" to appear in collapsed row of test "${testName}"`);

    // First ensure test row exists
    const testRow = page.locator(testRowSelector).first();
    await testRow.waitFor({ state: 'visible', timeout: 10000 });

    const checkElement = page.locator(checkSelector).first();

    const maxRetries = 8; // Increased from 6 to give more time for DOM updates after modal close
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // First ensure checks container is ready (React Query finished loading)
        const checksReady = page.locator('[data-test-checks-ready="true"]').first();
        const isChecksReady = await checksReady.isVisible({ timeout: 1000 }).catch(() => false);
        if (!isChecksReady) {
          logger.info(`Attempt ${attempt}/${maxRetries}: checks container not ready yet, waiting...`);
          throw new Error('Checks container not ready');
        }

        await checkElement.waitFor({ state: 'visible', timeout: 5000 });
        logger.info(`Check "${checkName}" is now visible in collapsed row (attempt ${attempt})`);
        return;
      } catch {
        // Log current DOM state for debugging
        const checksCount = await page.locator('[data-table-check-name]').count();
        logger.info(`Attempt ${attempt}/${maxRetries}: check not visible yet, total checks in DOM: ${checksCount}`);

        if (attempt < maxRetries) {
          // Check if collapsed row is empty or test row needs to be clicked to expand
          const collapsedRow = testRow.locator('xpath=following-sibling::tr[1]');
          const collapsedContent = collapsedRow.locator('[data-test="table-test-collapsed-row"]');
          const isCollapsedVisible = await collapsedContent.isVisible({ timeout: 1000 }).catch(() => false);

          if (!isCollapsedVisible) {
            // Test row might be collapsed - click to expand
            logger.info(`Collapsed row not visible, clicking test row to expand (attempt ${attempt}/${maxRetries})`);
            const nameCell = testRow.locator('[data-test="table-row-Name"]').first();
            if (await nameCell.isVisible()) {
              await nameCell.click();
            } else {
              await testRow.click();
            }
            // Wait for checks-ready indicator after expanding
            await page.waitForSelector('[data-test-checks-ready="true"]', { timeout: 5000 }).catch(() => null);
            await page.waitForTimeout(300);
          } else {
            // Collapsed row visible but check not found - try refresh and wait for network
            logger.info(`Check "${checkName}" not visible in collapsed row, clicking Refresh button (attempt ${attempt}/${maxRetries})`);
            const refreshButton = page.locator('button[aria-label="Refresh"]').first();
            if (await refreshButton.isVisible()) {
              // Wait for network activity to complete after refresh
              await Promise.all([
                page.waitForResponse(
                  (resp) => resp.url().includes('/v1/checks') && resp.status() === 200,
                  { timeout: 5000 }
                ).catch(() => null), // Don't fail if no request made
                refreshButton.click(),
              ]);
              // Wait for checks container to be ready after refresh
              await page.waitForSelector('[data-test-checks-ready="true"]', { timeout: 5000 }).catch(() => null);
              await page.waitForTimeout(500);
            }
          }
        } else {
          throw new Error(`Check "${checkName}" not found in collapsed row of test "${testName}" after ${maxRetries} attempts`);
        }
      }
    }
  }
);
