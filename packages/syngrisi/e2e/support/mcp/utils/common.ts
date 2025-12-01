import path from 'node:path';
import { existsSync, promises as fsPromises } from 'node:fs';
import process from 'node:process';

export const formatError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.stack ?? err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err === 'object' && err !== null) {
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
};

const PROJECT_MARKER_FILES = [
  'package.json',
  'node_modules',
  'support/mcp/bridge.ts',
] as const;

const PROJECT_NAME = 'syngrisi';

export function getProjectRoot(): string {
  if (process.env.SYNGRISI_ROOT && existsSync(path.join(process.env.SYNGRISI_ROOT, 'node_modules'))) {
    return process.env.SYNGRISI_ROOT;
  }

  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const hasAllMarkers = PROJECT_MARKER_FILES.every((marker) =>
      existsSync(path.join(currentDir, marker))
    );

    if (hasAllMarkers) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  const mainModule = process.argv[1];
  if (mainModule && mainModule.includes(PROJECT_NAME)) {
    const match = mainModule.match(new RegExp(`^(.+/${PROJECT_NAME})`));
    if (match && existsSync(path.join(match[1], 'node_modules'))) {
      return match[1];
    }
  }

  throw new Error(`Could not find project root directory. Please run from the ${PROJECT_NAME} project directory.`);
}

export const SHUTDOWN_NOTIFICATION_METHOD = 'notifications/shutdown' as const;

export function isShutdownNotification(notification: unknown): notification is { method: typeof SHUTDOWN_NOTIFICATION_METHOD } {
  if (!notification || typeof notification !== 'object') {
    return false;
  }
  const candidate = notification as { method?: unknown };
  return candidate.method === SHUTDOWN_NOTIFICATION_METHOD;
}

/**
 * Ensures a path exists and validates its type (file or directory).
 * Throws an error with a descriptive message if the path doesn't exist or has the wrong type.
 *
 * Local copy to avoid @utils/fs dependency chain which requires @lib/logger.
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
