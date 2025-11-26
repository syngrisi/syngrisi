/**
 * Simple logger for SSO utilities
 *
 * This is a standalone logger to avoid ESM import issues with the main project.
 */

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

export function createLogger(prefix: string) {
  const formatMessage = (level: string, color: string, message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    return `${COLORS.gray}${timestamp}${COLORS.reset} ${color}[${level}]${COLORS.reset} ${COLORS.blue}[${prefix}]${COLORS.reset} ${message}`;
  };

  return {
    info: (message: string, data?: any) => {
      console.log(formatMessage('INFO', COLORS.green, message));
      if (data) console.log(data);
    },
    warn: (message: string, data?: any) => {
      console.warn(formatMessage('WARN', COLORS.yellow, message));
      if (data) console.warn(data);
    },
    error: (message: string, data?: any) => {
      console.error(formatMessage('ERROR', COLORS.red, message));
      if (data) console.error(data);
    },
    debug: (message: string, data?: any) => {
      if (process.env.DEBUG) {
        console.log(formatMessage('DEBUG', COLORS.gray, message));
        if (data) console.log(data);
      }
    },
    success: (message: string, data?: any) => {
      console.log(formatMessage('OK', COLORS.green, message));
      if (data) console.log(data);
    },
  };
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => Promise<boolean> | boolean,
  options: {
    timeoutMs?: number;
    intervalMs?: number;
    description?: string;
  } = {}
): Promise<void> {
  const { timeoutMs = 30000, intervalMs = 1000, description = 'condition' } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return;
    }
    await sleep(intervalMs);
  }

  throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
