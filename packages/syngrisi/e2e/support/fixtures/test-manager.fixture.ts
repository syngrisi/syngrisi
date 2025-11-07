import fs from 'fs/promises';
import { test as base, test } from 'playwright-bdd';
import { getWorkerTempDir, createDirectoryIfNotExist, removeDirectory } from '@utils/fs';
import { hasTag } from '@utils/common';
import { createLogger } from '@lib/logger';
import { env } from '@config';

const logger = createLogger('TestManager');

export type TestManagerFixture = {
  /**
   * Temporary directory path for the current test
   */
  tempDir: string;
};

/**
 * Playwright fixture that provides temporary directory management for tests
 * Automatically creates a fresh temp directory for each test and cleans it up after
 */
export const testManagerFixture = base.extend<{ testManager: TestManagerFixture }>({
  testManager: [
    async ({ page, $step, $uri }, use, testInfo) => {
      const testTitle = testInfo.title;
      logger.info(`Starting test: "${testTitle}"`);

      const tempDir = getWorkerTempDir();
      logger.debug(`Temp directory: ${tempDir}`);

      const preserveTempDir = hasTag(testInfo, '@no-cleanup');
      if (preserveTempDir) {
        logger.debug(`Tag @no-cleanup detected, preserving temp directory`);
      }

      if (preserveTempDir) {
        try {
          await fs.access(tempDir);
          logger.debug(`Temp directory exists, reusing it`);
        } catch {
          await createDirectoryIfNotExist(tempDir);
          logger.debug(`Created new temp directory`);
        }
      } else {
        await removeDirectory(tempDir);
        await createDirectoryIfNotExist(tempDir);
        logger.debug(`Cleaned and created fresh temp directory`);
      }

      const testManager: TestManagerFixture = {
        tempDir
      };

      const startTime = Date.now();

      try {
        await use(testManager);
      } finally {
        const duration = Date.now() - startTime;
        const durationStr = duration > 1000 ? `${(duration / 1000).toFixed(2)}s` : `${duration}ms`;

        logger.info(`${testInfo.status} ${testTitle}${testInfo.status === 'skipped' ? '' : ` (${durationStr})`}`);


        // // Teardown: Clean up temp directory unless we need to preserve it
        // const keepOnFailure = testInfo.status === 'failed' || testInfo.status === 'timedOut';
        // if (!preserveTempDir && !keepOnFailure) {
        //   await removeDirectory(tempDir);
        // }
      }
    },
    {
      // Set scope to 'test' so it runs for each test
      scope: 'test',
      // Auto-fixture that runs even if not explicitly used
      auto: true
    }
  ],
});
