/* eslint-disable no-empty-pattern */
import { Page, TestInfo, test as base  } from '@playwright/test';
import { ServerManager, Logger, getLogLevelFromEnv } from "../utils";

function generateDatabaseName(testInfo: TestInfo): string {
  const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const workerIndex = testInfo.workerIndex;
  return `testdb_${testName}_${workerIndex}_${timestamp}`;
}

export const test = base.extend<{ locator: Page['locator'], server: ServerManager | null, baseUrl: string, port: string, databaseName: string, log: Logger }>({
  log: async ({ }, use) => {
    const logger = new Logger();
    await use(logger);
  },

  port: async ({ }, use, testInfo) => {
    const port = String(4000 + testInfo.workerIndex);
    await use(port);
  },

  databaseName: async ({ }, use, testInfo) => {
    const databaseName = generateDatabaseName(testInfo);
    await use(databaseName);
  },

  server: async ({ port, databaseName, log }, use, testInfo) => {
    log.info('START SERVER FIXTURE');

    log.info(`Test tags: ${testInfo.tags}`);
    log.info(`Worker index: ${testInfo.workerIndex}`);

    if (!testInfo.tags.includes('@no_server')) {
      const server = new ServerManager(port, databaseName);

      log.info(`🚀 Starting Syngrisi server \n\ttest: '${testInfo.title}' \n\tparameters: ${JSON.stringify({ port, databaseName })}`);

      const env = { ...process.env, SYNGRISI_APP_PORT: port, SYNGRISI_DB_URI: `mongodb://localhost/${databaseName}` }; // Use current environment variables

      server.startServer(env);
      await server.waitUntilServerIsReady();

      await use(server);

      await server.stopServer();

      log.info(`🚀 Server was started with parameters: ${JSON.stringify({ port, databaseName })}`);
    } else {
      await use(null);
    }
  },

  baseUrl: async ({ port }, use) => {
    const baseUrl = `http://localhost:${port}`;
    await use(baseUrl);
  },

  locator: async ({ page }, use) => {
    const locator = page.locator.bind(page);
    await use(locator);
  }
});
