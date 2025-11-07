import { When, Given } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import * as yaml from 'yaml';
import { env } from '@config';
import { stopServerProcess } from '@utils/app-server';
import { clearDatabase } from '@utils/db-cleanup';
import { setSkipAutoStart } from '@fixtures';
import { SyngrisiDriver } from '@syngrisi/wdio-sdk';
import type { TestStore } from '@fixtures';

const logger = createLogger('ServerSteps');

// Store driver instance for tests
let vDriver: SyngrisiDriver | null = null;

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
    
    // Initialize SyngrisiDriver (as in original WebdriverIO tests)
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    vDriver = new SyngrisiDriver({
      url: appServer.baseURL,
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
  async ({ appServer }: { appServer: AppServerFixture }) => {
    // Start server if not already running, or restart to apply new env variables
    if (appServer.baseURL) {
      logger.info('Server is running, restarting to apply new env variables');
      await appServer.restart();
    } else {
      logger.info('Starting server...');
      await appServer.start();
    }
    logger.info(`Server is running at ${appServer.baseURL}`);
  }
);

When(
  'I stop the Syngrisi server',
  async ({ appServer }: { appServer: AppServerFixture }) => {
    // Stop server process (as in original stopServer())
    logger.info('Stopping Syngrisi server...');
    stopServerProcess();
    
    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }
    logger.info('Server stopped');
  }
);

When(
  'I stop Server',
  async ({ appServer }: { appServer: AppServerFixture }) => {
    // Stop server process (as in original stopServer())
    logger.info('Stopping server...');
    stopServerProcess();
    
    // Also stop via fixture if running
    if (appServer.baseURL) {
      await appServer.stop();
    }
    logger.info('Server stopped');
  }
);

Given(
  'I clear Database and stop Server',
  async ({ appServer }: { appServer: AppServerFixture }) => {
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
      clearDatabase();
      
      // Set flag to skip automatic server startup in fixture
      setSkipAutoStart(true);
      
      logger.info('Database cleared and server stopped');
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
    const apiKey = process.env.SYNGRISI_API_KEY || '123';
    vDriver = new SyngrisiDriver({
      url: appServer.baseURL || `http://${env.E2E_BACKEND_HOST}:${appServer.serverPort || 3002}/`,
      apiKey: apiKey,
    });
    
    // Store driver in testData for use in other steps
    testData.set('vDriver', vDriver);
    
    logger.info('SyngrisiDriver initialized');
  }
);

