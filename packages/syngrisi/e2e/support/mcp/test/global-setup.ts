/**
 * Global setup for Playwright tests
 * Cleans up orphan MCP server and browser processes before test run
 */

import { execSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';

const CACHE_DIR = path.join(os.homedir(), '.cache', 'syngrisi', 'test-engine-cli');
const MCP_LOGS_DIR = path.resolve(__dirname, '..', 'logs');

const runBestEffort = (command: string) => {
  try {
    execSync(command, { stdio: 'ignore' });
  } catch {
    // Best-effort cleanup only.
  }
};

async function globalSetup() {
  console.log('[GLOBAL SETUP] Cleaning up orphan processes...');

  if (process.platform !== 'win32') {
    const processPatterns = [
      'support/mcp/test-engine-cli.ts --daemon-server',
      'support/mcp/test-engine-cli.ts --daemonized',
      'support/mcp/bridge-cli.ts',
      'support/mcp/test/mcp.spec.ts',
      'support/mcp/playwright.server.config.ts',
      'syngrisi_test_server_',
    ];

    for (const pattern of processPatterns) {
      runBestEffort(`pkill -9 -f '${pattern}'`);
    }
  }

  await fs.rm(CACHE_DIR, { recursive: true, force: true }).catch(() => undefined);
  await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => undefined);
  await fs.rm(MCP_LOGS_DIR, { recursive: true, force: true }).catch(() => undefined);
  await fs.mkdir(MCP_LOGS_DIR, { recursive: true }).catch(() => undefined);

  console.log('[GLOBAL SETUP] Cleanup complete');
}

export default globalSetup;
