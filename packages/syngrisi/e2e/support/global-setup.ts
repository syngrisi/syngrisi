import fs from 'fs/promises';
import path from 'path';
import type { FullConfig } from '@playwright/test';
import { resolveRepoRoot } from '@utils/fs';
import { createLogger } from '@lib/logger';
import { clearDatabase } from '@utils/db-cleanup';

const logger = createLogger('GlobalSetup');
const repoRoot = resolveRepoRoot();

const logsDir = path.join(repoRoot, 'e2e', 'logs');
const baselinesTestDir = path.join(repoRoot, 'e2e', 'baselinesTest');

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const cleanLogsDir = async () => {
  try {
    await fs.rm(logsDir, { recursive: true, force: true });
  } catch (error) {
    logger.warn(`Failed to clear logs directory: ${(error as Error).message}`);
  } finally {
    await ensureDir(logsDir);
  }
};

const ensureBaselinesTestDir = async () => {
  await ensureDir(baselinesTestDir);
};

export default async function globalSetup(_config: FullConfig) {
  await cleanLogsDir();
  await ensureBaselinesTestDir();
  
  // Clear database for main worker (CID 0)
  try {
    logger.info('Clearing database for worker 0');
    clearDatabase(0, false);
  } catch (error) {
    logger.warn(`Failed to clear database: ${(error as Error).message}`);
  }
  
  logger.info('Global setup completed');
}

