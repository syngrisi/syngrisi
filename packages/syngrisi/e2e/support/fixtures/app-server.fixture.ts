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
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

// Store server instance outside fixture to allow restart
let serverInstance: RunningAppServer | null = null;
let serverFixtureValue: AppServerFixture | null = null;

// Global flag to control automatic server startup
// Set to true when "I clear Database and stop Server" is called
let skipAutoStart = false;

export function setSkipAutoStart(value: boolean): void {
  skipAutoStart = value;
}

export function getSkipAutoStart(): boolean {
  return skipAutoStart;
}

/**
 * Playwright fixture that provides app server management
 * Launches the Syngrisi app server with test-specific environment variables
 */
export const appServerFixture = base.extend<{ appServer: AppServerFixture }>({
  appServer: [
    async ({ page, $step, $uri }, use, testInfo) => {
      const tempDir = getWorkerTempDir();
      logger.debug(`Using temp directory: ${tempDir}`);

      const skipAppStart = hasTag(testInfo, '@no-app-start') || skipAutoStart;

      const startServer = async () => {
        // Reset skipAutoStart when explicitly starting server
        // This ensures server starts even after "I clear Database and stop Server" step
        skipAutoStart = false;

        // Stop any existing server instance first
        if (serverInstance) {
          logger.info(`Stopping existing server before restart`);
          await serverInstance.stop();
          serverInstance = null;
        }

        // Also stop any process that might be running on the port (via pkill)
        const { stopServerProcess } = require('@utils/app-server');
        stopServerProcess();

        logger.info(`Launching Syngrisi app server`);
        // Use current process.env for server restart (includes env variables set by "I set env variables:")
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
          start: async () => {
            logger.info(`Starting server...`);
            await startServer();
          },
          stop: async () => {
            logger.info(`Stopping server...`);
            if (serverInstance) {
              await serverInstance.stop();
              serverInstance = null;
            }
            // Also stop via pkill to ensure process is killed
            const { stopServerProcess } = require('@utils/app-server');
            stopServerProcess();
            serverFixtureValue = {
              baseURL: '',
              backendHost: env.E2E_BACKEND_HOST,
              serverPort: 0,
              getBackendLogs: () => 'App server stopped',
              getFrontendLogs: () => '',
              restart: async () => {
                await startServer();
              },
              start: async () => {
                await startServer();
              },
              stop: async () => {
                // Already stopped
              },
            };
          },
        };
      };

      if (skipAppStart) {
        logger.info(`Skipping automatic app server launch (tag @no-app-start or skipAutoStart flag)`);
        serverFixtureValue = {
          baseURL: '',
          backendHost: env.E2E_BACKEND_HOST,
          serverPort: 0,
          getBackendLogs: () => 'App server not started',
          getFrontendLogs: () => '',
          restart: async () => {
            await startServer();
          },
          start: async () => {
            await startServer();
          },
          stop: async () => {
            // Server not started
          },
        };
      } else {
        await startServer();
      }

      try {
        await use(serverFixtureValue!);
      } finally {
        // Reset skipAutoStart flag after each test
        skipAutoStart = false;
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

        // Only stop server if it was started by fixture (not manually stopped)
        if (serverInstance && !skipAutoStart) {
          logger.info(`Stopping server...`);
          await serverInstance.stop();
          serverInstance = null;
          serverFixtureValue = null;
          logger.info(`Server stopped`);
        }
      }
    },
    { scope: 'test' },  // Note: Cannot use 'worker' scope due to dependencies on test fixtures (page, $step, $uri)
  ],
});

