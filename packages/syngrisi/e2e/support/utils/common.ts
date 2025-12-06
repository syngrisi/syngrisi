import type { TestInfo } from '@playwright/test';

/**
 * Delays execution for a specified number of milliseconds.
 *
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if a test has a specific tag
 *
 * @param testInfo - Playwright test info object
 * @param tag - Tag to check for
 * @returns True if the tag is present, false otherwise
 */
export function hasTag(testInfo: Pick<TestInfo, 'tags'> | undefined, tag: string): boolean {
  return Array.isArray(testInfo?.tags) && testInfo.tags.includes(tag);
}

export interface WaitForOptions {
  /**
   * Maximum time to wait in milliseconds
   */
  timeoutMs: number;
  /**
   * Interval between checks in milliseconds
   * @default 500
   */
  intervalMs?: number;
  /**
   * Description of what we're waiting for (used in error messages)
   * @default "condition to be met"
   */
  description?: string;
}

export class WaitForTimeoutError extends Error {
  constructor(
    public readonly description: string,
    public readonly timeoutMs: number,
    public readonly iterations: number,
    public readonly lastError?: Error,
  ) {
    const lastErrorMsg = lastError
      ? `\nLast error: ${lastError.message}\n${lastError.stack}`
      : "";
    super(
      `Timed out waiting for ${description} after ${timeoutMs}ms (${iterations} iterations)${lastErrorMsg}`,
    );
    this.name = "WaitForTimeoutError";
  }
}

/**
 * Waits for a condition to be met by repeatedly calling a callback function.
 * Throws a detailed error if the timeout is reached.
 *
 * @param callback - Function that returns true when condition is met, false otherwise
 * @param options - Configuration options
 * @returns Promise that resolves when condition is met
 * @throws {WaitForTimeoutError} If timeout is reached with details about iterations and last error
 *
 * @example
 * ```typescript
 * // Wait for HTTP service
 * await waitFor(
 *   async () => await isServiceAvailable(url),
 *   { timeoutMs: 30000, description: `HTTP service at ${url}` }
 * );
 *
 * // Wait for file to exist
 * await waitFor(
 *   () => fs.existsSync(filePath),
 *   { timeoutMs: 5000, intervalMs: 100, description: `file ${filePath}` }
 * );
 * ```
 */
export async function waitFor(
  callback: () => boolean | Promise<boolean>,
  options: WaitForOptions,
): Promise<void> {
  const {
    timeoutMs,
    intervalMs = 500,
    description = "condition to be met",
  } = options;

  const deadline = Date.now() + timeoutMs;
  let iterations = 0;
  let lastError: Error | undefined;

  while (true) {
    iterations++;

    try {
      const result = await callback();
      if (result) return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (Date.now() > deadline) {
      throw new WaitForTimeoutError(description, timeoutMs, iterations, lastError);
    }

    await sleep(intervalMs);
  }
}
