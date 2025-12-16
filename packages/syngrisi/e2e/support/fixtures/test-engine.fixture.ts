import { test as base } from 'playwright-bdd';
import type { APIRequestContext, BrowserContext, Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import { startMcpServer, type McpServerHandle } from '../mcp/server';
import { env } from '../mcp/config';
import { findEphemeralPort } from '../mcp/utils/port-utils';
import type { AppServerFixture } from './app-server.fixture';
import type { TestStore } from './test-data.fixture';
import type { TestManagerFixture } from './test-manager.fixture';

const logger = createLogger('TestEngine');
const FEATURE_URI = 'mcp://syngrisi.mcp';

export type TestEngineFixture = {
  isRunning: () => boolean;
  getPort: () => number | null;
  getBaseUrl: () => string | null;
  start: (options?: { requestedPort?: number; featureUri?: string; tags?: string[] }) => Promise<void>;
  waitForShutdown: (options?: { timeoutMs?: number }) => Promise<void>;
  stop: () => Promise<void>;
};

type RequiredFixtures = {
  page: Page;
  context: BrowserContext;
  request: APIRequestContext;
  appServer: AppServerFixture;
  testData: TestStore;
  testManager: TestManagerFixture;
  $test?: unknown;
};

export const testEngineFixture = base.extend<{ testEngine: TestEngineFixture }>({
  testEngine: [
    async (
      { page, context, request, appServer, testData, testManager, $test }: RequiredFixtures,
      use,
      testInfo,
    ) => {
      let handle: McpServerHandle | null = null;
      const defaultTags = testInfo.tags ?? [];

      const fixture: TestEngineFixture = {
        isRunning: () => handle !== null,
        getPort: () => (handle ? handle.port : null),
        getBaseUrl: () => (handle ? handle.baseUrl : null),
        start: async (options) => {
          if (handle) {
            logger.warn(`MCP server already running on port ${handle.port}`);
            return;
          }

          const requestedPort =
            typeof options?.requestedPort === 'number'
              ? options.requestedPort
              : await findEphemeralPort();
          const tags = options?.tags ?? defaultTags;
          const featureUri = options?.featureUri ?? FEATURE_URI;

          logger.info(`Starting MCP server with requested port ${requestedPort}`);

          handle = await startMcpServer({
            fixtures: { page, context, request, appServer, testData, testManager },
            runtime: {
              test: $test ?? base,
              testInfo,
              featureUri,
              tags,
            },
            requestedPort,
          });

          logger.info(`MCP server started on port ${handle.port}`);
        },
        waitForShutdown: async (options) => {
          if (!handle) {
            throw new Error('MCP server is not running, cannot wait for shutdown.');
          }
          await handle.waitForShutdown(options);
        },
        stop: async () => {
          if (!handle) {
            return;
          }
          logger.info(`Stopping MCP server on port ${handle.port}`);
          await handle.stop();
          handle = null;
        },
      };

      try {
        await use(fixture);
      } finally {
        if (!handle) {
          return;
        }

        if (env.MCP_KEEP_ALIVE === '1') {
          logger.info('MCP_KEEP_ALIVE=1, leaving MCP server running after test.');
          return;
        }

        await fixture.stop();
      }
    },
    { scope: 'test' },
  ],
});

