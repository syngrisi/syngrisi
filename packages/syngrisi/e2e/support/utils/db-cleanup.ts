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
  const databaseName = `SyngrisiDbTest${actualCid}`;

  try {
    execSync(`mongosh ${databaseName} --eval "db.dropDatabase();"`, {
      stdio: 'inherit',
    });

    if (removeBaselines) {
      const repoRoot = resolveRepoRoot();
      // In original tests, baselines are stored in tests/baselinesTest/${cid}/
      // In new e2e framework, they should be in e2e/baselinesTest/${cid}/
      const baselinesPath = path.join(repoRoot, 'e2e', 'baselinesTest', String(actualCid));
      logger.info(`Removing baselines from: ${baselinesPath}`);
      try {
        execSync(`rm -rf ${baselinesPath}`, { stdio: 'inherit' });
        logger.info(`Baselines removed successfully`);
      } catch (error) {
        // Ignore errors if directory doesn't exist
        logger.warn(`Failed to remove baselines: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to clear database ${databaseName}: ${error}`);
  }
}

