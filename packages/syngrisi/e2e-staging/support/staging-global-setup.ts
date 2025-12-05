import type { FullConfig } from '@playwright/test';
import { createLogger } from './logger';
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('StagingGlobalSetup');
const STAGING_BASE_URL = process.env.STAGING_BASE_URL || 'http://localhost:5252';

const ensureDir = async (dirPath: string) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const checkStagingHealth = async (): Promise<boolean> => {
  try {
    // Just check if server responds (any status is OK, including redirects)
    const response = await fetch(STAGING_BASE_URL, { redirect: 'manual' });
    return response.status > 0;
  } catch {
    return false;
  }
};

export default async function stagingGlobalSetup(_config: FullConfig) {
  logger.info('=== Staging Global Setup ===');

  // Ensure reports directories exist
  const reportsDir = path.join(__dirname, '..', 'reports');
  await ensureDir(path.join(reportsDir, 'artifacts'));
  await ensureDir(path.join(reportsDir, 'html'));

  // Verify staging server is running
  logger.info(`Checking staging server at ${STAGING_BASE_URL}...`);

  const maxRetries = 3;
  let isHealthy = false;

  for (let i = 0; i < maxRetries; i++) {
    isHealthy = await checkStagingHealth();
    if (isHealthy) break;

    logger.warn(`Staging health check failed (attempt ${i + 1}/${maxRetries}), retrying in 2s...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (!isHealthy) {
    logger.error(`
╔════════════════════════════════════════════════════════════════╗
║  STAGING SERVER NOT RUNNING!                                   ║
║                                                                ║
║  Please start staging before running tests:                    ║
║                                                                ║
║    npm run staging:start                                       ║
║                                                                ║
║  Or manually:                                                  ║
║    bash scripts/staging/start-staging.sh                       ║
╚════════════════════════════════════════════════════════════════╝
    `);
    throw new Error('Staging server is not running on port 5252');
  }

  logger.info('✓ Staging server is healthy');
  logger.info('=== Staging Global Setup Complete ===');
}
