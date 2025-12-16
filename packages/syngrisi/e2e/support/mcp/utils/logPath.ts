import path from 'node:path';
import { existsSync } from 'node:fs';

/**
 * Get the absolute path to the MCP logs directory.
 * This function ensures logs are always created in test/e2e/support/mcp/logs
 * regardless of where the code is executed from.
 */
export function getMcpLogsDir(): string {
  // Strategy 1: If we have SYNGRISI_ROOT env var
  if (process.env.SYNGRISI_ROOT) {
    const logsDir = path.join(process.env.SYNGRISI_ROOT, 'packages/syngrisi/e2e/support/mcp/logs');
    return logsDir;
  }

  // Strategy 2: Look for the project root by finding package.json
  let currentDir = __dirname;
  const root = path.parse(currentDir).root;

  // First, try to go up from current __dirname
  while (currentDir !== root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    const mcpPath = path.join(currentDir, 'support/mcp/bridge.ts');

    if (existsSync(packageJsonPath) && existsSync(mcpPath)) {
      return path.join(currentDir, 'support/mcp/logs');
    }
    currentDir = path.dirname(currentDir);
  }

  // Strategy 3: Try from process.cwd()
  currentDir = process.cwd();
  while (currentDir !== root) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    const mcpPath = path.join(currentDir, 'support/mcp/bridge.ts');

    if (existsSync(packageJsonPath) && existsSync(mcpPath)) {
      return path.join(currentDir, 'support/mcp/logs');
    }
    currentDir = path.dirname(currentDir);
  }

  // Strategy 4: Fallback - resolve relative to this file's location
  const fallbackPath = path.resolve(__dirname, '..', 'logs');

  return fallbackPath;
}