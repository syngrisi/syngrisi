import { test as base } from "@playwright/test";
import { ServerManager } from "../utils";

function generateDatabaseName(testInfo: any): string {
  const testName = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const workerIndex = testInfo.workerIndex;
  return `testdb_${testName}_${workerIndex}_${timestamp}`;
}

export const test = base.extend<{ locator: Function, server: ServerManager | null, baseUrl: string, port: string, databaseName: string }>({
  port: async ({}, use, testInfo) => {
    const port = String(4000 + testInfo.workerIndex);
    await use(port);
  },

  databaseName: async ({}, use, testInfo) => {
    const databaseName = generateDatabaseName(testInfo);
    await use(databaseName);
  },

  server: async ({ port, databaseName }, use, testInfo) => {
    console.log('START SERVER FIXTURE');

    console.log(testInfo.tags);
    console.log(testInfo.workerIndex);

    if (!testInfo.tags.includes('@no_server')) {

      const server = new ServerManager(port, databaseName);

      console.log(`🚀 Starting Syngrisi server \n\ttest: '${testInfo.title}' \n\tparameters: ${JSON.stringify({ port, databaseName })}`);

      const env = { ...process.env, SYNGRISI_APP_PORT: port, SYNGRISI_DB_URI: `mongodb://localhost/${databaseName}` }; // Use current environment variables

      server.startServer(env);
      await server.waitUntilServerIsReady();

      await use(server);

      await server.stopServer();

      console.log(`🚀 Server was started with parameters: ${JSON.stringify({ port, databaseName })}`);
    } else {
      await use(null);
    }
  },

  baseUrl: async ({ port }, use, testInfo) => {
    const baseUrl = `http://localhost:${port}`;
    await use(baseUrl);
  },

  locator: async ({ page }, use) => {
    let locator = page.locator.bind(page);
    await use(locator);
    locator = null;
  }
});
