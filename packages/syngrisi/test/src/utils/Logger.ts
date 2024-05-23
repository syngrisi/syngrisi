const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
} as const;

type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

class Logger {
  private level: LogLevelType;

  constructor(level: LogLevelType = LogLevel.INFO) {
    this.level = level;
  }

  private shouldLog(level: LogLevelType): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private getColor(level: LogLevelType): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[34m'; // Blue
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      default:
        return '\x1b[0m';  // Reset
    }
  }

  private logMessage(level: LogLevelType, message: string) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const color = this.getColor(level);
      const reset = '\x1b[0m';
      console.log(`${color}[${timestamp}] [${level.toUpperCase()}] ${message}${reset}`);
    }
  }

  debug(message: string) {
    this.logMessage(LogLevel.DEBUG, message);
  }

  info(message: string) {
    this.logMessage(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.logMessage(LogLevel.WARN, message);
  }

  error(message: string) {
    this.logMessage(LogLevel.ERROR, message);
  }
}

export { Logger, LogLevel, LogLevelType };
