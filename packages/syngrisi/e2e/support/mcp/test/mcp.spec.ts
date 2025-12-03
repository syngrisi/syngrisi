import { test } from '@fixtures';
import logger, { formatArgs } from '../utils/logger';
import { env, DEFAULT_TIMEOUT_MS } from '../config';
import { findEphemeralPort } from '../utils/port-utils';

const tags = ['@start-test-engine-mcp'];

test.use({
  $test: ({ }, use) => use(test),
  $uri: ({ }, use) => use('mcp://syngrisi.mcp'),
  $bddFileData: ({ }, use) => {
    use([
      {
        pwTestLine: 1,
        pickleLine: 1,
        tags,
        steps: new Proxy([], {
          get() {
            return {
              pwStepLine: 1,
              gherkinStepLine: 1,
              keywordType: 'Given',
              textWithKeyword: 'Given placeholder step',
              stepMatchArguments: [],
            };
          },
        }),
      },
    ]);
  },
});

test.describe.configure({ mode: 'serial' });

test.describe('MCP Server Runner', () => {
  test(
    'starts MCP server',
    { tag: tags },
    async ({ testEngine, appServer }) => {

      test.setTimeout(0);

      const requestedPort = env.MCP_DEFAULT_PORT > 0
        ? env.MCP_DEFAULT_PORT
        : await findEphemeralPort();

      await testEngine.start({ requestedPort, tags });

      if (!testEngine.isRunning()) {
        throw new Error('MCP server failed to start.');
      }

      logger.info(formatArgs('⏳ Waiting for shutdown notification from bridge...'));
      try {
        await testEngine.waitForShutdown({ timeoutMs: DEFAULT_TIMEOUT_MS });
        logger.info(formatArgs('✅ Shutdown notification received. Stopping MCP server.'));
      } catch (err) {
        logger.warn(formatArgs(`⚠️ Timed out waiting for shutdown: ${(err as Error).message}. Forcing stop.`));
      } finally {
        await testEngine.stop();
      }
    },
  );
});
