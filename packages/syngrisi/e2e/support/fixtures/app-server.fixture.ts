import { test as base } from 'playwright-bdd';
import { launchAppServer } from '@utils/app-server';
import { getWorkerTempDir, createDirectoryIfNotExist } from '@utils/fs';
import { hasTag } from '@utils/common';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import type { RunningAppServer } from '@utils/app-server';

const logger = createLogger('AppServer');

export type AppServerFixture = {
  baseURL: string;
  backendHost: string;
  serverPort: number;
  getBackendLogs: () => string;
  getFrontendLogs: () => string;
  restart: () => Promise<void>;
};

// Store server instance outside fixture to allow restart
let serverInstance: RunningAppServer | null = null;
let serverFixtureValue: AppServerFixture | null = null;

/**
 * Playwright fixture that provides app server management
 * Launches the Syngrisi app server with test-specific environment variables
 */
export const appServerFixture = base.extend<{ appServer: AppServerFixture }>({
  appServer: [
    async ({ page, $step, $uri }, use, testInfo) => {
      const tempDir = getWorkerTempDir();
      logger.debug(`Using temp directory: ${tempDir}`);

      const skipAppStart = hasTag(testInfo, '@no-app-start');

      if (skipAppStart) {
        logger.info(`Tag @no-app-start detected, skipping app server launch`);
        await use({
          baseURL: '',
          backendHost: env.E2E_BACKEND_HOST,
          serverPort: 0,
          getBackendLogs: () => 'App server not started (@no-app-start)',
          getFrontendLogs: () => '',
          restart: async () => {
            throw new Error('Cannot restart server when @no-app-start tag is present');
          },
        });
        return;
      }

      const startServer = async () => {
        if (serverInstance) {
          logger.info(`Stopping existing server before restart`);
          await serverInstance.stop();
          serverInstance = null;
        }

        logger.info(`Launching Syngrisi app server`);
        serverInstance = await launchAppServer({
          env: {},
        });
        logger.success(`Server launched successfully`);
        logger.info(`Base URL: ${serverInstance.baseURL}`);
        logger.info(`Server: ${serverInstance.backendHost}:${serverInstance.serverPort}`);

        serverFixtureValue = {
          baseURL: serverInstance.baseURL,
          backendHost: serverInstance.backendHost,
          serverPort: serverInstance.serverPort,
          getBackendLogs: serverInstance.getBackendLogs,
          getFrontendLogs: serverInstance.getFrontendLogs,
          restart: async () => {
            logger.info(`Restarting server...`);
            await startServer();
          },
        };
      };

      await startServer();

      try {
        await use(serverFixtureValue!);
      } finally {
        // If E2E_DEBUG is enabled and test failed, pause before stopping the server
        if (env.E2E_DEBUG && (testInfo.status === 'failed' || testInfo.status === 'timedOut')) {
          const location = `${$uri || 'unknown'}`;
          const stepTitle = $step?.title || 'unknown';

          logger.warn(`E2E_DEBUG is enabled - server will remain running until you resume...`);
          logger.warn(`Press 'Resume' in the browser inspector to stop the server and continue.`);
          logger.error(`Test ${testInfo.status}!`);
          logger.error(`Scenario: ${testInfo.title}`);
          logger.error(`Step: ${stepTitle}`);
          logger.error(`Location: ${location}`);
          logger.error(`Feature file: ${testInfo.file}`);

          // Log the step where failure occurred
          if (testInfo.titlePath && testInfo.titlePath.length > 0) {
            logger.error(`Title path: ${testInfo.titlePath.join(' > ')}`);
          }

          // Log failure details
          if (testInfo.errors && testInfo.errors.length > 0) {
            logger.error('Failure reason:');
            testInfo.errors.forEach((error, index) => {
              logger.error(`Error ${index + 1}:`);
              if (error.message) {
                logger.error(error.message);
              }
              if (error.stack) {
                logger.error('Stack trace:');
                logger.error(error.stack);
              }
            });
          }
          await page.pause();
        }

        logger.info(`Stopping server...`);
        if (serverInstance) {
          await serverInstance.stop();
          serverInstance = null;
        }
        serverFixtureValue = null;
        logger.info(`Server stopped`);
      }
    },
    { scope: 'test' },
  ],
});

