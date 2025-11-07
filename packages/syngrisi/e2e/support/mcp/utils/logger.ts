import winston from 'winston';
import path from 'path';
import { getMcpLogsDir } from './logPath';

// Get the absolute path to the MCP logs directory
const logsDir = getMcpLogsDir();

// File transport configuration constants
const FILE_TRANSPORT_CONFIG = {
  mainLog: {
    maxsize: 10 * 1024 * 1024, // 10MB per file
    maxFiles: 20,
  },
  errorLog: {
    maxsize: 5 * 1024 * 1024, // 5MB per file
    maxFiles: 20,
  },
} as const;

// Custom format to preserve emojis and colors for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.printf(({ level, message, timestamp }) => {
    // Remove winston's level coloring since we want to preserve original message formatting
    return `[${timestamp}] ${message}`;
  })
);

// File format without colors but with level information
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ level, message, timestamp }) => {
    // Remove emojis and ANSI color codes for file output
    // eslint-disable-next-line no-control-regex
    const cleanMessage = String(message)
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
      .replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI color codes
      .trim();
    return `[${timestamp}] [${level.toUpperCase()}] ${cleanMessage}`;
  })
);

/**
 * Creates a file transport for main log file
 */
function createMainFileTransport(filename = 'e2e.log'): winston.transports.FileTransportInstance {
  return new winston.transports.File({
    filename: path.join(logsDir, filename),
    format: fileFormat,
    maxsize: FILE_TRANSPORT_CONFIG.mainLog.maxsize,
    maxFiles: FILE_TRANSPORT_CONFIG.mainLog.maxFiles,
    tailable: true,
  });
}

/**
 * Creates a file transport for error-only log file
 */
function createErrorFileTransport(filename = 'e2e-error.log'): winston.transports.FileTransportInstance {
  return new winston.transports.File({
    filename: path.join(logsDir, filename),
    level: 'error',
    format: fileFormat,
    maxsize: FILE_TRANSPORT_CONFIG.errorLog.maxsize,
    maxFiles: FILE_TRANSPORT_CONFIG.errorLog.maxFiles,
    tailable: true,
  });
}

/**
 * Creates a console transport with emoji-preserving format
 */
function createConsoleTransport(): winston.transports.ConsoleTransportInstance {
  return new winston.transports.Console({
    format: consoleFormat,
    stderrLevels: ['error'],
  });
}

/**
 * Custom logger class that wraps Winston logger with configurable transports.
 * Provides a consistent interface while allowing different configurations
 * for different use cases (console + file vs file-only).
 */
export class McpLogger {
  private logger: winston.Logger;

  constructor(config: winston.LoggerOptions) {
    this.logger = winston.createLogger(config);
  }

  // Delegate all winston logger methods to maintain full compatibility
  info(message: any, ...meta: any[]): winston.Logger {
    return this.logger.info(message, ...meta);
  }

  error(message: any, ...meta: any[]): winston.Logger {
    return this.logger.error(message, ...meta);
  }

  warn(message: any, ...meta: any[]): winston.Logger {
    return this.logger.warn(message, ...meta);
  }

  debug(message: any, ...meta: any[]): winston.Logger {
    return this.logger.debug(message, ...meta);
  }

  // Expose the underlying logger for advanced use cases if needed
  getWinstonLogger(): winston.Logger {
    return this.logger;
  }

  /**
   * Creates a logger with console and file outputs
   * @param level Log level (default: 'info')
   * @returns McpLogger instance
   */
  static createWithConsole(level: string = 'info'): McpLogger {
    return new McpLogger({
      level,
      transports: [
        createConsoleTransport(),
        createMainFileTransport(),
        createErrorFileTransport(),
      ],
    });
  }

  /**
   * Creates a file-only logger (no console output)
   * Useful for scenarios where stdout must be reserved (e.g., JSON-RPC)
   * @param level Log level (default: 'info')
   * @returns McpLogger instance
   */
  static createFileOnly(level: string = 'info'): McpLogger {
    return new McpLogger({
      level,
      transports: [
        createMainFileTransport(),
        createErrorFileTransport(),
      ],
    });
  }
}

// Create the main logger instance with console and file transports
const logger = McpLogger.createWithConsole('info');

// Helper function to format arguments into a message
export const formatArgs = (...args: any[]): string => {
  return args.map(arg =>
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
};

// Create a file-only logger for bridge to avoid stdout interference with JSON-RPC
export const bridgeLogger = McpLogger.createFileOnly('info');

export default logger;
