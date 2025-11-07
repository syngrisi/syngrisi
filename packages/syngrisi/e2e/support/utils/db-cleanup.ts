import { execSync } from 'child_process';
import path from 'path';
import { resolveRepoRoot } from '@utils/fs';
import { createLogger } from '@lib/logger';

const logger = createLogger('DbCleanup');

function getCid(): number {
  if (process.env.DOCKER === '1') return 100;
  return parseInt(process.env.TEST_PARALLEL_INDEX || '0', 10);
}

export function clearDatabase(cid?: number, removeBaselines = true): void {
  const actualCid = cid ?? getCid();
  const cmdPath = path.resolve(resolveRepoRoot());
  const taskNamePrefix = process.env.DOCKER === '1' ? 'docker_' : '';

  try {
    let result: string;
    if (removeBaselines) {
      // Use npm script clear_test (as in original: npm run clear_test)
      result = execSync(`CID=${actualCid} npm run ${taskNamePrefix}clear_test`, {
        cwd: cmdPath,
        stdio: 'pipe',
      }).toString('utf8');
    } else {
      // Use npm script clear_test_db_only (as in original: npm run clear_test_db_only)
      result = execSync(`CID=${actualCid} npm run ${taskNamePrefix}clear_test_db_only`, {
        cwd: cmdPath,
        stdio: 'pipe',
      }).toString('utf8');
    }
    logger.info({ result });
  } catch (error: any) {
    const errorMsg = error.message || error.toString() || '';
    if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
      logger.warn('Browser disconnected or ChromeDriver unavailable, skipping clear database');
    } else {
      logger.error(`Failed to clear database: ${errorMsg}`);
      throw error;
    }
  }
}

