import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import type { FullConfig } from '@playwright/test';
import { resolveRepoRoot } from '@utils/fs';
import { createLogger } from '@lib/logger';
import { clearDatabase } from '@utils/db-cleanup';

const logger = createLogger('GlobalSetup');
const repoRoot = resolveRepoRoot();
const syngrisiPackageDir = repoRoot.endsWith(path.join('packages', 'syngrisi'))
  ? repoRoot
  : path.join(repoRoot, 'packages', 'syngrisi');

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

const findExecutable = (name: string, searchPaths: string[]): string | null => {
  for (const dir of searchPaths) {
    if (!dir) continue;
    const candidate = path.join(dir, name);
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
};

const ensureFreshBuild = (): void => {
  const customPaths = [
    path.dirname(process.execPath),
    process.env.FNM_MULTISHELL_PATH
      ? path.join(process.env.FNM_MULTISHELL_PATH, 'bin')
      : '',
  ];
  const mergedSearchPaths = [
    ...customPaths,
    ...(process.env.PATH ? process.env.PATH.split(path.delimiter) : []),
  ].filter(Boolean);

  const npmExecutable =
    findExecutable('npm', mergedSearchPaths)
    || findExecutable('npm.cmd', mergedSearchPaths);

  if (!npmExecutable) {
    logger.warn('npm executable not found in PATH; skipping automatic rebuild');
    return;
  }

  const envWithPath = {
    ...process.env,
    PATH: [...mergedSearchPaths, process.env.PATH || '']
      .filter(Boolean)
      .join(path.delimiter),
  };

  try {
    logger.info('Building @syngrisi/syngrisi before tests');
    const result = spawnSync(npmExecutable, ['run', 'build'], {
      cwd: syngrisiPackageDir,
      stdio: 'inherit',
      env: envWithPath,
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`npm run build exited with code ${result.status ?? 'unknown'}`);
    }
  } catch (error) {
    logger.error('Failed to build @syngrisi/syngrisi package');
    throw error;
  }
};

export default async function globalSetup(_config: FullConfig) {
  logger.info('Building @syngrisi/syngrisi package...');
  ensureFreshBuild();

  await cleanLogsDir();
  await ensureBaselinesTestDir();

  // Clear database for main worker (CID 0)
  try {
    logger.info('Clearing database for worker 0');
    await clearDatabase(0, false);
  } catch (error) {
    logger.warn(`Failed to clear database: ${(error as Error).message}`);
  }

  logger.info('Global setup completed');
}
