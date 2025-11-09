import { When, Given } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import { env } from '@config';
import { stopServerProcess } from '@utils/app-server';
import { clearDatabase } from '@utils/db-cleanup';
import { resolveRepoRoot } from '@utils/fs';
import { setSkipAutoStart } from '@fixtures';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import type { TestStore } from '@fixtures';
import * as path from 'path';
import { execSync } from 'child_process';
import * as fs from 'fs';

const logger = createLogger('ServerSteps');

// Store driver instance for tests
let vDriver: SyngrisiDriver | null = null;

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
  async ({}, yml: string) => {
    const params = yaml.parse(yml);
    Object.keys(params).forEach((key) => {
      process.env[key] = String(params[key]);
      logger.info(`Set env variable ${key}=${params[key]}`);
    });
  }
);

Given(
  'I start Server and start Driver',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Always start server (even if it was stopped by "I clear Database and stop Server")
    logger.info('Starting server...');
    await appServer.start();
    
    // Wait a bit for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    // Start server if not already running, or restart to apply new env variables
    if (appServer.baseURL) {
      logger.info('Server is running, restarting to apply new env variables');
      await appServer.restart();
    } else {
      logger.info('Starting server...');
      await appServer.start();
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
    
    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }
    logger.info('Server stopped');
    resetTestCreationState(testData);
  }
);

When(
  'I stop Server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    // Stop server process (as in original stopServer())
    logger.info('Stopping server...');
    stopServerProcess();
    
    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }
    logger.info('Server stopped');
    resetTestCreationState(testData);
  }
);

Given(
  'I clear Database and stop Server',
  async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
    try {
      // Stop server first (as in original: stopServer() then clearDatabase())
      logger.info('Stopping server...');
      stopServerProcess();
      
      // Also stop via fixture if running
      if (appServer.baseURL) {
        await appServer.stop();
      }
      
      // Clear database (removeBaselines = true by default, as in original)
      logger.info('Clearing database...');
      clearDatabase(undefined, true); // Explicitly pass removeBaselines = true to clear screenshots folder
      
      // Reset legacy default environment expectations between scenarios
      process.env.SYNGRISI_DISABLE_FIRST_RUN = 'true';
      process.env.SYNGRISI_TEST_MODE = 'true';
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
    clearDatabase(false);
    logger.info('Database cleared');
    resetTestCreationState(testData);
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
        : parseInt(process.env.TEST_PARALLEL_INDEX || '0', 10);
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
