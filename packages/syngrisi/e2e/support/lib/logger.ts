import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export interface LoggerOptions {
  level?: LogLevel;
  fileLevel?: LogLevel;
  consoleLevel?: LogLevel;
}

const sanitizeServiceName = (serviceName: string): string => {
  const normalized = serviceName
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/gi, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'service';
};

const resolveRepoRoot = (): string => {
  return path.resolve(__dirname, '..', '..', '..');
};

const resolveLogFilePath = (serviceName: string): string => {
  const repoRoot = resolveRepoRoot();
  const baseDir = path.join(repoRoot, 'e2e', 'logs');
  const safeName = sanitizeServiceName(serviceName);
  return path.join(baseDir, `${safeName}.log`);
};

export class Logger {
  private lastLogTime: number;
  private fileLevel: LogLevel;
  private consoleLevel: LogLevel;
  private fileStream?: fs.WriteStream;

  private get workerIndex(): string {
    return process.env.TEST_WORKER_INDEX ?? '0';
  }

  constructor(private serviceName: string, options: LoggerOptions = {}) {
    const { level, fileLevel, consoleLevel } = options;
    const defaultLevel = (process.env.E2E_LOG_LEVEL as LogLevel) ?? 'info';

    // If 'level' is provided, it sets both file and console levels (backward compatibility)
    // Otherwise, use specific levels or fall back to default
    this.fileLevel = fileLevel ?? level ?? defaultLevel;
    this.consoleLevel = consoleLevel ?? level ?? defaultLevel;
    this.lastLogTime = Date.now();

    const resolvedLogFilePath = resolveLogFilePath(serviceName);
    const dir = path.dirname(resolvedLogFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.fileStream = fs.createWriteStream(resolvedLogFilePath, { flags: 'a' });
  }

  private getDeltaMs(): number {
    const now = Date.now();
    const delta = now - this.lastLogTime;
    this.lastLogTime = now;
    return delta;
  }

  private formatMessage(args: unknown[]): string {
    const deltaMs = this.getDeltaMs();
    const deltaMsStr =
      deltaMs > 500 ? chalk.bold.whiteBright(`+${deltaMs}ms`) : chalk.dim(`+${deltaMs}ms`);
    return `${deltaMsStr} ${args
      .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
      .join(' ')}`;
  }

  private shouldLogToFile(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.fileLevel];
  }

  private shouldLogToConsole(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.consoleLevel];
  }

  private log(level: LogLevel, prefix: string, args: unknown[]) {
    const shouldFile = this.shouldLogToFile(level);
    const shouldConsole = this.shouldLogToConsole(level);

    if (!shouldFile && !shouldConsole) {
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const message = `${timestamp} [${this.workerIndex}] [${this.serviceName}] ${prefix}${this.formatMessage(
      args,
    )}`;

    // Write to file if enabled and level matches
    if (shouldFile && this.fileStream) {
      const plainMessage = message.replace(/\x1b\[[0-9;]*m/g, '');
      this.fileStream.write(plainMessage + '\n');
    }

    // Write to console if level matches
    if (shouldConsole) {
      switch (level) {
        case 'error':
          console.error(message);
          break;
        case 'warn':
          console.warn(message);
          break;
        case 'info':
          console.info(message);
          break;
        case 'debug':
          console.log(message);
          break;
      }
    }
  }

  debug(...args: unknown[]) {
    this.log('debug', chalk.dim('[DEBUG] '), args);
  }

  info(...args: unknown[]) {
    this.log('info', chalk.blue('[INFO] '), args);
  }

  warn(...args: unknown[]) {
    this.log('warn', chalk.yellow('[WARN] '), args);
  }

  error(...args: unknown[]) {
    this.log('error', chalk.red('[ERROR] '), args);
  }

  success(...args: unknown[]) {
    this.log('info', chalk.green('[SUCCESS] '), args);
  }

  close() {
    if (this.fileStream) {
      this.fileStream.end();
    }
  }
}

export const createLogger = (serviceName: string, options?: LoggerOptions) =>
  new Logger(serviceName, options);
