import { test as base } from 'playwright-bdd';
import { launchAppServer, isServerRunning, stopServerProcess, findAvailablePort } from '@utils/app-server';
import { getWorkerTempDir, resolveRepoRoot } from '@utils/fs';
import { hasTag } from '@utils/common';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import type { RunningAppServer } from '@utils/app-server';
import path from 'path';
import { clearDatabase } from '@utils/db-cleanup';

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
  restart: (force?: boolean) => Promise<void>;
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
      const isFastMode = hasTag(testInfo, '@fast-server');
      const skipAppStart = hasTag(testInfo, '@no-app-start') || getSkipAutoStart();
      const envKeysToReset = [
        'SYNGRISI_AUTH',
        'SYNGRISI_TEST_MODE',
        'SYNGRISI_DISABLE_FIRST_RUN',
        'SYNGRISI_APP_PORT',
        'SYNGRISI_DB_URI',
        'SYNGRISI_IMAGES_PATH',
        'SSO_ENABLED',
        'SSO_CLIENT_ID',
        'SSO_CLIENT_SECRET',
        'SSO_PROTOCOL',
      ];
      const originalEnv: Record<string, string | undefined> = {};
      envKeysToReset.forEach((key) => {
        originalEnv[key] = process.env[key];
      });
      const envOverrides = Object.fromEntries(
        (testInfo.tags || [])
          .filter((tag) => tag.startsWith('@env:'))
          .map((tag) => {
            const [, key, ...rest] = tag.split(':');
            const value = rest.join(':');
            return [key, value];
          }),
      );
      Object.entries(envOverrides).forEach(([k, v]) => {
        process.env[k] = v;
        logger.info(`Applied env override from tag: ${k}=${v}`);
      });
      const existingInstance = serverInstances.get(cid);
      let fixtureValue: AppServerFixture = {
        baseURL: '',
        backendHost: env.E2E_BACKEND_HOST,
        serverPort: 0,
        config: lastKnownConfig,
        getBackendLogs: () => 'App server not started',
        getFrontendLogs: () => '',
        restart: async (force = false) => {
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

      const startServer = async (forceRestart = false) => {
        // Reset skipAutoStart when explicitly starting server
        // This ensures server starts even after "I clear Database and stop Server" step
        skipAutoStartMap.set(cid, false);

        // Stop any existing server instance first
        const existingInstance = serverInstances.get(cid);
        if (existingInstance) {
          // Only reuse if explicitly allowing reuse AND not forcing a restart
          if (reuseServerBetweenTests && !forceRestart) {
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
            fixtureValue.restart = async (force = false) => {
              logger.info(`Restarting server...`);
              await startServer(force);
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
        fixtureValue.restart = async (force = false) => {
          logger.info(`Restarting server...`);
          await startServer(force);
        };

        serverFixtures.set(cid, fixtureValue);
      };

      if (isFastMode) {
        const preferredPort = 3002 + cid;
        const workerPort = await findAvailablePort(preferredPort, 20);
        const workerDbName = `SyngrisiDbTest${cid}`;
        const workerDbUri = `mongodb://localhost/${workerDbName}`;

        logger.info(`Running in Fast Server Mode (CID: ${cid})`);

        process.env.SYNGRISI_APP_PORT = String(workerPort);
        process.env.SYNGRISI_DB_URI = workerDbUri;

        const fullReset = (process.env.FAST_SERVER_FULL_RESET || '').toLowerCase() === 'true';
        if (fullReset) {
          logger.info(`Fast mode: full reset enabled, dropping DB and baselines`);
          await clearDatabase(cid, true, false);
        } else {
          logger.info(`Fast mode: soft clean enabled, keeping baselines`);
          await clearDatabase(cid, false, true);
        }

        const running = await isServerRunning(workerPort);
        if (running && fullReset) {
          logger.info(`Fast mode: restarting server on port ${workerPort} after full reset`);
          stopServerProcess();
          serverInstances.delete(cid);
        }

        const launchFreshInstance = async () => {
          const instance = await launchAppServer({ cid });
          serverInstances.set(cid, instance);
          lastKnownConfig = instance.config;
          fixtureValue.baseURL = instance.baseURL;
          fixtureValue.backendHost = instance.backendHost;
          fixtureValue.serverPort = instance.serverPort;
          fixtureValue.config = instance.config;
          fixtureValue.getBackendLogs = instance.getBackendLogs;
          fixtureValue.getFrontendLogs = instance.getFrontendLogs;
        };

        if (!running || fullReset) {
          await launchFreshInstance();
        } else {
          logger.info(`Fast mode: reusing already running server on port ${workerPort}`);
          const instance = serverInstances.get(cid);
          fixtureValue.baseURL = instance?.baseURL || `http://localhost:${workerPort}`;
          fixtureValue.backendHost = instance?.backendHost || env.E2E_BACKEND_HOST;
          fixtureValue.serverPort = workerPort;
          fixtureValue.config = instance?.config || {
            connectionString: workerDbUri,
            defaultImagesPath: getFallbackConfig().defaultImagesPath,
          };
          fixtureValue.getBackendLogs = instance?.getBackendLogs || (() => 'Reused server; logs unavailable');
          fixtureValue.getFrontendLogs = instance?.getFrontendLogs || (() => '');
        }

        fixtureValue = {
          baseURL: fixtureValue.baseURL,
          backendHost: fixtureValue.backendHost,
          serverPort: fixtureValue.serverPort,
          config: fixtureValue.config,
          getBackendLogs: fixtureValue.getBackendLogs,
          getFrontendLogs: fixtureValue.getFrontendLogs,
          restart: async () => {
            logger.info(`Fast mode restart: relaunching server on port ${workerPort}`);
            stopServerProcess();
            await launchFreshInstance();
          },
          start: async () => {
            logger.info(`Fast mode: restarting server to apply latest env on port ${workerPort}`);
            stopServerProcess();
            await launchFreshInstance();
          },
          stop: async () => {
            logger.info(`Fast mode: stopping server on port ${workerPort}`);
            stopServerProcess();
            serverInstances.delete(cid);
          },
        };

        serverFixtures.set(cid, fixtureValue);
      } else if (skipAppStart) {
        logger.info(`Skipping automatic app server launch (tag @no-app-start or skipAutoStart flag)`);
        fixtureValue = {
          baseURL: existingInstance?.baseURL || '',
          backendHost: existingInstance?.backendHost || env.E2E_BACKEND_HOST,
          serverPort: existingInstance?.serverPort || 0,
          config: existingInstance?.config || lastKnownConfig,
          getBackendLogs: existingInstance?.getBackendLogs || (() => 'App server not started'),
          getFrontendLogs: existingInstance?.getFrontendLogs || (() => ''),
          restart: async (force = false) => {
            await startServer(force);
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
          restart: async (force = false) => {
            logger.info(`Restarting server...`);
            await startServer(force);
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
          restart: async (force = false) => {
            logger.info(`Restarting server...`);
            await startServer(force);
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

        const runningInstance = serverInstances.get(cid);
        if (isFastMode) {
          logger.info(`Fast Mode: stopping server and cleaning database after test`);
          if (runningInstance) {
            await runningInstance.stop();
            serverInstances.delete(cid);
            serverFixtures.delete(cid);
          }
          await clearDatabase(cid, true, false);
        } else if (runningInstance && !getSkipAutoStart() && !reuseServerBetweenTests) {
          logger.info(`Stopping server...`);
          await runningInstance.stop();
          serverInstances.delete(cid);
          serverFixtures.delete(cid);
          logger.info(`Server stopped`);
        }
        envKeysToReset.forEach((key) => {
          const initial = originalEnv[key];
          if (initial === undefined) {
            delete process.env[key];
          } else {
            process.env[key] = initial;
          }
        });
      }
    },
    { scope: 'test' },  // Note: Cannot use 'worker' scope due to dependencies on test fixtures (page, $step, $uri)
  ],
});
