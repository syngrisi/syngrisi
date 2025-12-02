import fs from 'node:fs';
import path from 'node:path';

// Minimal wrapper used by mcp.spec.ts to avoid import errors when running in isolation
const logsDir = path.resolve(__dirname, '..', '..', 'logs');
const logFile = path.join(logsDir, 'mcp-test.log');

fs.mkdirSync(logsDir, { recursive: true });

const write = (level: string, message: string) => {
  const line = `[${level}] ${message}`;
  fs.appendFileSync(logFile, `${line}\n`, 'utf8');
  console.log(line);
};

export const formatArgs = (...args: unknown[]): string => args.map(String).join(' ');

const logger = {
  info: (...args: unknown[]) => write('INFO', formatArgs(...args)),
  warn: (...args: unknown[]) => write('WARN', formatArgs(...args)),
  error: (...args: unknown[]) => write('ERROR', formatArgs(...args)),
};

export default logger;
