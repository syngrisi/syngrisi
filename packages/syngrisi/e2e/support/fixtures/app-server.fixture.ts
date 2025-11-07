import { test as base } from 'playwright-bdd';
import { launchAppServer } from '@utils/app-server';
import { getWorkerTempDir, createDirectoryIfNotExist } from '@utils/fs';
import { hasTag } from '@utils/common';
import { env } from '@config';
import { createLogger } from '@lib/logger';

const logger = createLogger('AppServer');

export type AppServerFixture = {
  baseURL: string;
  backendHost: string;
  serverPort: number;
  getBackendLogs: () => string;
  getFrontendLogs: () => string;
};

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
        });
        return;
      }

      logger.info(`Launching Syngrisi app server`);
      const server = await launchAppServer({
        env: {},
      });
      logger.success(`Server launched successfully`);
      logger.info(`Base URL: ${server.baseURL}`);
      logger.info(`Server: ${server.backendHost}:${server.serverPort}`);

      try {
        await use({
          baseURL: server.baseURL,
          backendHost: server.backendHost,
          serverPort: server.serverPort,
          getBackendLogs: server.getBackendLogs,
          getFrontendLogs: server.getFrontendLogs,
        });
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
        await server.stop();
        logger.info(`Server stopped`);
      }
    },
    { scope: 'test' },
  ],
});

