import { test as base } from 'playwright-bdd';
import type { BrowserContext, Page } from '@playwright/test';
import { startMcpServer, type McpServerHandle } from './server';
import { env } from './config';
import { findEphemeralPort } from './utils/port-utils';
import logger, { formatArgs } from './utils/logger';

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
  $test?: unknown;
};

export const testEngineFixture = base.extend<{ testEngine: TestEngineFixture }>({
  testEngine: [
    async (
      { page, context, $test }: RequiredFixtures,
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
            logger.warn(formatArgs(`MCP server already running on port ${handle.port}`));
            return;
          }

          const requestedPort =
            typeof options?.requestedPort === 'number'
              ? options.requestedPort
              : await findEphemeralPort();
          const tags = options?.tags ?? defaultTags;
          const featureUri = options?.featureUri ?? FEATURE_URI;

          logger.info(formatArgs(`Starting MCP server with requested port ${requestedPort}`));

          handle = await startMcpServer({
            fixtures: { page, context } as any,
            runtime: {
              test: $test ?? base,
              testInfo,
              featureUri,
              tags,
            },
            requestedPort,
          });

          logger.info(formatArgs(`MCP server started on port ${handle.port}`));
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
          logger.info(formatArgs(`Stopping MCP server on port ${handle.port}`));
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
          logger.info(formatArgs('MCP_KEEP_ALIVE=1, leaving MCP server running after test.'));
          return;
        }

        await fixture.stop();
      }
    },
    { scope: 'test' },
  ],
});

export const test = testEngineFixture;
