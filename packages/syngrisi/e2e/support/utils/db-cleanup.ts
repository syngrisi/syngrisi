import { execSync } from 'child_process';
import path from 'path';
import { resolveRepoRoot } from '@utils/fs';

function getCid(): number {
  if (process.env.DOCKER === '1') return 100;
  return parseInt(process.env.TEST_PARALLEL_INDEX || '0', 10);
}

export function clearDatabase(cid?: number, removeBaselines = false): void {
  const actualCid = cid ?? getCid();
  const databaseName = `SyngrisiDbTest${actualCid}`;
  
  try {
    execSync(`mongosh ${databaseName} --eval "db.dropDatabase();"`, {
      stdio: 'inherit',
    });
    
    if (removeBaselines) {
      const repoRoot = resolveRepoRoot();
      const baselinesPath = path.join(repoRoot, 'e2e', 'baselinesTest', String(actualCid));
      try {
        execSync(`rm -rf ${baselinesPath}`, { stdio: 'inherit' });
      } catch (error) {
        // Ignore errors if directory doesn't exist
      }
    }
  } catch (error) {
    throw new Error(`Failed to clear database ${databaseName}: ${error}`);
  }
}

