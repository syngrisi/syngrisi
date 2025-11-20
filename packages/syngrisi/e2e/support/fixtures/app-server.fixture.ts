import { test as base } from 'playwright-bdd';
import { launchAppServer } from '@utils/app-server';
import { getWorkerTempDir, createDirectoryIfNotExist, resolveRepoRoot } from '@utils/fs';
import { hasTag } from '@utils/common';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import type { RunningAppServer } from '@utils/app-server';
import path from 'path';

const reuseServerBetweenTests = env.E2E_REUSE_SERVER;
const logger = createLogger('AppServer');

export type AppServerFixture = {
  baseURL: string;
  backendHost: string;
  serverPort: number;
  config: {
    connectionString: string;
    defaultImagesPath: string;
  };
  getBackendLogs: () => string;
  getFrontendLogs: () => string;
  restart: () => Promise<void>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

// Helpers to get per-worker CID
const getCurrentCid = (): number => (process.env.DOCKER === '1' ? 100 : parseInt(process.env.TEST_PARALLEL_INDEX || '0', 10));

// Store server instances per CID to avoid cross-worker interference
const serverInstances = new Map<number, RunningAppServer>();
const serverFixtures = new Map<number, AppServerFixture>();
const skipAutoStartMap = new Map<number, boolean>();

function getFallbackConfig(): { connectionString: string; defaultImagesPath: string } {
  const repoRoot = resolveRepoRoot();
  const cid = getCurrentCid();
  return {
    connectionString:
      process.env.SYNGRISI_DB_URI ||
      env.SYNGRISI_DB_URI ||
      `mongodb://localhost/SyngrisiDbTest${cid}`,
    defaultImagesPath:
      process.env.SYNGRISI_IMAGES_PATH ||
      env.SYNGRISI_IMAGES_PATH ||
      path.resolve(repoRoot, 'baselinesTest', String(cid)),
  };
}

let lastKnownConfig = getFallbackConfig();

export function setSkipAutoStart(value: boolean): void {
  skipAutoStartMap.set(getCurrentCid(), value);
}

export function getSkipAutoStart(): boolean {
  return skipAutoStartMap.get(getCurrentCid()) ?? true;
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

      const cid = getCurrentCid();
      const skipAppStart = hasTag(testInfo, '@no-app-start') || getSkipAutoStart();
      const existingInstance = serverInstances.get(cid);
      let fixtureValue: AppServerFixture = {
        baseURL: '',
        backendHost: env.E2E_BACKEND_HOST,
        serverPort: 0,
        config: lastKnownConfig,
        getBackendLogs: () => 'App server not started',
        getFrontendLogs: () => '',
        restart: async () => {
          logger.info(`Restarting server...`);
        },
        start: async () => {
          logger.info(`Starting server...`);
        },
        stop: async () => {
          logger.info(`Stopping server...`);
        },
      };

      const stopServer = async () => {
        logger.info(`Stopping server...`);
        const currentInstance = serverInstances.get(cid);
        if (currentInstance) {
          await currentInstance.stop();
          serverInstances.delete(cid);
        }
        // Also stop via pkill to ensure process is killed
        const { stopServerProcess } = require('@utils/app-server');
        stopServerProcess();
        fixtureValue.baseURL = '';
        fixtureValue.serverPort = 0;
        fixtureValue.getBackendLogs = () => 'App server stopped';
        fixtureValue.getFrontendLogs = () => '';
        serverFixtures.set(cid, fixtureValue);
      };

      const startServer = async () => {
        // Reset skipAutoStart when explicitly starting server
        // This ensures server starts even after "I clear Database and stop Server" step
        skipAutoStartMap.set(cid, false);

        // Stop any existing server instance first
        const existingInstance = serverInstances.get(cid);
        if (existingInstance) {
          if (reuseServerBetweenTests) {
            logger.info(`Reusing existing server (port ${existingInstance.serverPort})`);
            fixtureValue.baseURL = existingInstance.baseURL;
            fixtureValue.backendHost = existingInstance.backendHost;
            fixtureValue.serverPort = existingInstance.serverPort;
            fixtureValue.config = existingInstance.config;
            fixtureValue.getBackendLogs = existingInstance.getBackendLogs;
            fixtureValue.getFrontendLogs = existingInstance.getFrontendLogs;
            fixtureValue.stop = stopServer;
            fixtureValue.start = async () => {
              logger.info(`Starting server...`);
              await startServer();
            };
            fixtureValue.restart = async () => {
              logger.info(`Restarting server...`);
              await startServer();
            };
            serverFixtures.set(cid, fixtureValue);
            return;
          }
          logger.info(`Stopping existing server before restart`);
          await existingInstance.stop();
          serverInstances.delete(cid);
        }

        // Also stop any process that might be running on the port (via pkill)
        const { stopServerProcess } = require('@utils/app-server');
        stopServerProcess();

        logger.info(`Launching Syngrisi app server`);
        // Use current process.env for server restart (includes env variables set by "I set env variables:")
        const instance = await launchAppServer({
          env: {},
        });
        serverInstances.set(cid, instance);
        lastKnownConfig = instance.config;
        logger.success(`Server launched successfully`);
        logger.info(`Base URL: ${instance.baseURL}`);
        logger.info(`Server: ${instance.backendHost}:${instance.serverPort}`);

        // Update existing fixture object so callers see latest values
        fixtureValue.baseURL = instance.baseURL;
        fixtureValue.backendHost = instance.backendHost;
        fixtureValue.serverPort = instance.serverPort;
        fixtureValue.config = lastKnownConfig;
        fixtureValue.getBackendLogs = instance.getBackendLogs;
        fixtureValue.getFrontendLogs = instance.getFrontendLogs;
        fixtureValue.stop = stopServer;
        fixtureValue.start = async () => {
          logger.info(`Starting server...`);
          await startServer();
        };
        fixtureValue.restart = async () => {
          logger.info(`Restarting server...`);
          await startServer();
        };

        serverFixtures.set(cid, fixtureValue);
      };

      if (skipAppStart) {
        logger.info(`Skipping automatic app server launch (tag @no-app-start or skipAutoStart flag)`);
        fixtureValue = {
          baseURL: existingInstance?.baseURL || '',
          backendHost: existingInstance?.backendHost || env.E2E_BACKEND_HOST,
          serverPort: existingInstance?.serverPort || 0,
          config: existingInstance?.config || lastKnownConfig,
          getBackendLogs: existingInstance?.getBackendLogs || (() => 'App server not started'),
          getFrontendLogs: existingInstance?.getFrontendLogs || (() => ''),
          restart: async () => {
            await startServer();
          },
          start: async () => {
            await startServer();
          },
          stop: async () => {
            await stopServer();
          },
        };
        serverFixtures.set(cid, fixtureValue);
      } else if (existingInstance && reuseServerBetweenTests) {
        logger.info(`Reusing already running server on port ${existingInstance.serverPort}`);
        fixtureValue = {
          baseURL: existingInstance.baseURL,
          backendHost: existingInstance.backendHost,
          serverPort: existingInstance.serverPort,
          config: existingInstance.config,
          getBackendLogs: existingInstance.getBackendLogs,
          getFrontendLogs: existingInstance.getFrontendLogs,
          restart: async () => {
            logger.info(`Restarting server...`);
            await startServer();
          },
          start: async () => {
            logger.info(`Starting server...`);
            await startServer();
          },
          stop: async () => {
            await stopServer();
          },
        };
        serverFixtures.set(cid, fixtureValue);
      } else {
        fixtureValue = {
          baseURL: '',
          backendHost: env.E2E_BACKEND_HOST,
          serverPort: 0,
          config: lastKnownConfig,
          getBackendLogs: () => '',
          getFrontendLogs: () => '',
          restart: async () => {
            logger.info(`Restarting server...`);
            await startServer();
          },
          start: async () => {
            logger.info(`Starting server...`);
            await startServer();
          },
          stop: async () => {
            await stopServer();
          },
        };
        serverFixtures.set(cid, fixtureValue);
        await startServer();
      }

      try {
        const fixtureValue = serverFixtures.get(cid)!;
        await use(fixtureValue);
      } finally {
        // Reset skipAutoStart flag after each test
        skipAutoStartMap.set(cid, false);
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
        const runningInstance = serverInstances.get(cid);
        if (runningInstance && !getSkipAutoStart() && !reuseServerBetweenTests) {
          logger.info(`Stopping server...`);
          await runningInstance.stop();
          serverInstances.delete(cid);
          serverFixtures.delete(cid);
          logger.info(`Server stopped`);
        }
      }
    },
    { scope: 'test' },  // Note: Cannot use 'worker' scope due to dependencies on test fixtures (page, $step, $uri)
  ],
});
