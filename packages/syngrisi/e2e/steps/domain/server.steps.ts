import { When, Given, Then } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import { env } from '@config';
import { stopServerProcess, waitForServerStop, ensureServerReady } from '@utils/app-server';
import { clearDatabase, clearPluginSettings } from '@utils/db-cleanup';
import { resolveRepoRoot } from '@utils/fs';
import { setSkipAutoStart } from '@fixtures';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import type { TestStore } from '@fixtures';
import * as path from 'path';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';
import { hasTag } from '@utils/common';
import type { BddContext } from 'playwright-bdd/dist/runtime/bddContext';

const logger = createLogger('ServerSteps');

// Store driver instance for tests
let vDriver: SyngrisiDriver | null = null;

const restartAfterEnvSet = new Map<number, boolean>();
const getCid = (): number => (process.env.DOCKER === '1' ? 100 : parseInt(process.env.TEST_WORKER_INDEX || '0', 10));

function resetTestCreationState(testData?: TestStore): void {
  if (!testData) return;
  testData.clear('createdTestsByName');
  testData.clear('autoCreatedChecks');
  testData.clear('currentCheck');
  testData.clear('lastTestId');
  testData.set('createdTestsByName', {});
  testData.set('autoCreatedChecks', []);
}

When(
  'I set env variables:',
  async ({ appServer, $bddContext }: { appServer: AppServerFixture; $bddContext?: BddContext }, yml: string) => {
    const params = yaml.parse(yml);
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined) {
        delete process.env[key];
        logger.info(`Unset env variable ${key}`);
      } else {
        process.env[key] = String(params[key]);
        logger.info(`Set env variable ${key}=${params[key]}`);
      }
    });
    const testInfo = ($bddContext as BddContext | undefined)?.testInfo;
    const isFastMode = hasTag(testInfo, '@fast-server');
    const cid = getCid();
    if (restartAfterEnvSet.get(cid)) {
      logger.info('Env updated after server stop, restarting server to apply new values');
      await appServer.start();
      restartAfterEnvSet.set(cid, false);
    } else if (isFastMode && appServer.baseURL) {
      logger.info('Fast mode: restarting server to apply env overrides');
      await appServer.restart();
      restartAfterEnvSet.set(cid, false);
    }
  }
);

Given(
  'I start Server and start Driver',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Always start server (even if it was stopped by "I clear Database and stop Server")
    logger.info('Starting server...');
    lastStartError = null;
    await appServer.start();
    restartAfterEnvSet.set(getCid(), false);

    // Wait for server to be fully ready to reduce flake
    if (appServer.serverPort) {
      await ensureServerReady(appServer.serverPort, 60_000);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Set syngrisiUrl for template rendering (as in old tests)
    const syngrisiUrl = `${appServer.baseURL}/`;
    testData.set('syngrisiUrl', syngrisiUrl);
    resetTestCreationState(testData);

    // Initialize SyngrisiDriver (as in original WebdriverIO tests)
    // Ensure URL ends with / (as SyngrisiApi expects)
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const normalizedURL = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
    vDriver = new SyngrisiDriver({
      url: normalizedURL,
      apiKey: apiKey,
    });

    // Store driver in testData for use in other steps
    testData.set('vDriver', vDriver);

    logger.info(`Server started at ${appServer.baseURL}`);
    logger.info('SyngrisiDriver initialized');
  }
);

Given(
  'I start Server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Start server if not already running, or FORCE restart to apply new env variables
    // Force restart is necessary because env vars may have changed (e.g., SSO config)
    lastStartError = null;
    if (appServer.baseURL) {
      logger.info('Server is running, force restarting to apply new env variables');
      await appServer.restart(true); // Force restart to apply new env
    } else {
      logger.info('Starting server...');
      await appServer.start();
    }
    restartAfterEnvSet.set(getCid(), false);
    if (appServer.serverPort) {
      await ensureServerReady(appServer.serverPort, 60_000);
    }
    // Set syngrisiUrl for template rendering (as in old tests)
    const syngrisiUrl = `${appServer.baseURL}/`;
    testData.set('syngrisiUrl', syngrisiUrl);
    resetTestCreationState(testData);
    logger.info(`Server is running at ${appServer.baseURL}`);
  }
);

When(
  'I stop the Syngrisi server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Stop server process (as in original stopServer())
    logger.info('Stopping Syngrisi server...');
    stopServerProcess();
    await waitForServerStop();
    restartAfterEnvSet.set(getCid(), true);

    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }

    // Reset critical env vars to prevent leakage to other tests in the same worker
    delete process.env.SYNGRISI_AUTH;
    delete process.env.SYNGRISI_AUTH_OVERRIDE;
    delete process.env.SYNGRISI_API_KEY;

    logger.info('Server stopped and env vars reset');
    resetTestCreationState(testData);
  }
);

When(
  'I stop Server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Stop server process (as in original stopServer())
    logger.info('Stopping server...');
    stopServerProcess();
    await waitForServerStop();
    restartAfterEnvSet.set(getCid(), true);

    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }

    // Reset critical env vars to prevent leakage to other tests in the same worker
    delete process.env.SYNGRISI_AUTH;
    delete process.env.SYNGRISI_AUTH_OVERRIDE;
    delete process.env.SYNGRISI_API_KEY;

    logger.info('Server stopped and env vars reset');
    resetTestCreationState(testData);
  }
);

Given(
  'I clear Database and stop Server',
  async (
    { appServer, testData, $bddContext }: { appServer: AppServerFixture; testData: TestStore; $bddContext?: unknown },
    _testInfo,
  ) => {
    const testInfo = ($bddContext as BddContext | undefined)?.testInfo;
    if (hasTag(testInfo, '@fast-server')) {
      logger.info('STEP SKIPPED: Clear DB & Stop Server handled by fixture in @fast-server mode');
      return;
    }
    try {
      // Stop server first (as in original: stopServer() then clearDatabase())
      logger.info('Stopping server...');
      stopServerProcess();
      await waitForServerStop();

      // Also stop via fixture if running
      if (appServer.baseURL) {
        await appServer.stop();
      }

      // Clear database (removeBaselines = true by default, as in original)
      logger.info('Clearing database...');
      await clearDatabase(undefined, true); // Explicitly pass removeBaselines = true to clear screenshots folder

      // Reset legacy default environment expectations between scenarios
      process.env.SYNGRISI_DISABLE_FIRST_RUN = 'true';
      process.env.SYNGRISI_TEST_MODE = '1'; // Backend expects '1', not 'true'
      process.env.SYNGRISI_AUTH = 'false';

      // Set flag to skip automatic server startup in fixture
      setSkipAutoStart(true);

      logger.info('Database cleared and server stopped');
      resetTestCreationState(testData);
    } catch (error: any) {
      const errorMsg = error.message || error.toString() || '';
      if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
        logger.warn('Browser disconnected or ChromeDriver unavailable, skipping clear database and stop server');
      } else {
        throw error;
      }
    }
  }
);

When(
  'I start Driver',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Initialize SyngrisiDriver (as in original startDriver())
    // Ensure URL ends with / (as SyngrisiApi expects)
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    const baseURL = appServer.baseURL || `http://${env.E2E_BACKEND_HOST}:${appServer.serverPort || 3002}`;
    const normalizedURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
    vDriver = new SyngrisiDriver({
      url: normalizedURL,
      apiKey: apiKey,
    });

    // Store driver in testData for use in other steps
    testData.set('vDriver', vDriver);

    logger.info('SyngrisiDriver initialized');
  }
);

When(
  'I clear database',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    logger.info('Clearing database...');
    await clearDatabase(false, false, true);
    logger.info('Database cleared');
    resetTestCreationState(testData);
  }
);

When(
  'I clear plugin {string} settings from database',
  async ({ }, pluginName: string) => {
    await clearPluginSettings(pluginName);
  }
);

When(
  'I clear screenshots folder',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    logger.info('Clearing screenshots folder...');
    const repoRoot = resolveRepoRoot();
    const cid =
      process.env.DOCKER === '1'
        ? 100
        : parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
    try {
      logger.info(`Running clear_test_screenshots_only for CID=${cid}`);
      const result = execSync(`CID=${cid} npm run clear_test_screenshots_only`, {
        cwd: repoRoot,
        stdio: 'pipe',
      }).toString('utf8');
      logger.info(result.trim());
      const screenshotsPath = path.join(repoRoot, 'baselinesTest', String(cid));
      const remaining = fs.existsSync(screenshotsPath)
        ? fs.readdirSync(screenshotsPath).length
        : 0;
      logger.info(`Screenshots remaining after clear: ${remaining}`);
    } catch (error) {
      logger.warn(`Failed to clear screenshots via script: ${(error as Error).message}`);
    }
    logger.info('Screenshots folder cleared');
    resetTestCreationState(testData);
  }
);

let lastStartError: Error | null = null;

When(
  'I try to start Server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    try {
      if (appServer.baseURL) {
        logger.info('Server is running, force restarting (no retry) to apply new env variables');
        await appServer.restart(true, true); // noRetry: true for validation tests
      } else {
        logger.info('Starting server (no retry mode for validation tests)...');
        // Use startNoRetry if available (fails immediately on startup error)
        if (appServer.startNoRetry) {
          await appServer.startNoRetry();
        } else {
          await appServer.start();
        }
      }
      lastStartError = null;

      // If successful, still update state as usual
      restartAfterEnvSet.set(getCid(), false);
      const syngrisiUrl = `${appServer.baseURL}/`;
      testData.set('syngrisiUrl', syngrisiUrl);
      resetTestCreationState(testData);
    } catch (e) {
      lastStartError = e as Error;
      logger.info(`Expected server start failure: ${e}`);
    }
  }
);

Then('the server should fail to start', async () => {
  if (!lastStartError) {
    throw new Error('Server started successfully but was expected to fail');
  }
});

Then('the error message should contain {string}', async ({ }, errorMessage: string) => {
  if (!lastStartError) {
    throw new Error('No error captured from server start');
  }
  if (!lastStartError.message.includes(errorMessage)) {
    throw new Error(`Error message "${lastStartError.message}" does not contain "${errorMessage}"`);
  }
});

Then('the server should start successfully', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
  if (lastStartError) {
    throw new Error(`Server failed to start: ${lastStartError}`);
  }
  // Verify it's actually running
  expect(appServer.baseURL).toBeTruthy();

  // Check if we can reach it
  const response = await requestWithSession(`${appServer.baseURL}/v1/app/info`, testData, appServer);
  expect(response.raw.statusCode).toBe(200);
});

Then('plugin {string} should be loaded', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }, pluginName: string) => {
  const response = await requestWithSession(`${appServer.baseURL}/v1/plugin-settings/${pluginName}`, testData, appServer);
  expect(response.raw.statusCode).toBe(200);
  expect(response.json.enabled).toBe(true);
});
