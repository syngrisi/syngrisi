import fsPromises from 'fs/promises';
import path from 'path';
import { createLogger } from '@lib/logger';

const logger = createLogger('fs');

/**
 * Resolves the absolute path to the repository root.
 * Navigates up from the current module location to find the project root.
 */
export function resolveRepoRoot(): string {
  return path.resolve(__dirname, '..', '..', '..');
}

/**
 * Recursively copies a directory and all its contents to a destination.
 * Preserves symbolic links.
 *
 * @param src - Source directory path
 * @param dest - Destination directory path
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
  await fsPromises.mkdir(dest, { recursive: true });
  const entries = await fsPromises.readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else if (entry.isSymbolicLink()) {
        const link = await fsPromises.readlink(srcPath);
        await fsPromises.symlink(link, destPath);
      } else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    })
  );
}

/**
 * Creates a directory with all necessary subdirectories.
 * Emits a warning and skips creation if the directory already exists.
 *
 * @param dirPath - Path to the directory to create
 * @returns Promise that resolves when the directory is created or confirmed to exist
 */
export async function createDirectoryIfNotExist(dirPath: string): Promise<void> {
  try {
    await fsPromises.access(dirPath);
    logger.warn(`Directory already exists: ${dirPath}`);
    return;
  } catch {
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Recursively removes a directory and all its contents.
 * If the directory doesn't exist, it does nothing.
 *
 * @param dirPath - Path to the directory to remove
 * @returns Promise that resolves when the directory is removed
 */
export async function removeDirectory(dirPath: string): Promise<void> {
  try {
    await fsPromises.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    // Ignore errors if directory doesn't exist
    if ((error as any).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Returns the absolute path to the worker's temporary directory.
 * Uses TEST_PARALLEL_INDEX and SHARD environment variables to isolate test runs.
 *
 * When running with shards (e.g., SHARD=1/2), each shard process gets its own directory
 * to prevent conflicts when multiple shard processes run in parallel.
 *
 * @returns Absolute path to the worker's temporary directory in format:
 *   - With shards: test/e2e/.tmp/workdirs/{shardId}/{workerId}
 *   - Without shards: test/e2e/.tmp/workdirs/single/{workerId}
 */
export const getWorkerTempDir = (): string => {
  const repoRoot = resolveRepoRoot();
  const rawWorkerId =
    process.env.TEST_PARALLEL_INDEX ||
    `${process.pid}`;
  const workerId = rawWorkerId.replace(/[^a-zA-Z0-9._-]/g, '_');
  const shardId = process.env.SHARD?.replace('/', '-') || 'single';

  return path.resolve(repoRoot, 'e2e', '.tmp', 'workdirs', shardId, workerId);
};

/**
 * Ensures a path exists and validates its type (file or directory).
 * Throws an error with a descriptive message if the path doesn't exist or has the wrong type.
 *
 * @param targetPath - Path to validate
 * @param type - Expected type: "file" or "directory"
 * @throws Error if path doesn't exist or has wrong type
 */
export async function ensurePathExists(
  targetPath: string,
  type: "file" | "directory",
): Promise<void> {
  try {
    const stats = await fsPromises.stat(targetPath);
    const isValid = type === "file" ? stats.isFile() : stats.isDirectory();
    if (!isValid) {
      throw new Error(
        `Expected ${type} at ${targetPath}, but found non-${type} entry`,
      );
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        `${type} not found at ${targetPath}`,
      );
    }
    throw error;
  }
}
