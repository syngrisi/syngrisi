import dotenv from 'dotenv';
import path from 'node:path';
import { cleanEnv, num, str } from 'envalid';

dotenv.config({
  // Suppress stdout logging to avoid breaking STDIO transports
  // in processes that import this config (e.g., bridge-cli via Stdio).
  // See test failures with SyntaxError on non-JSON stdout.
  // Dotenv v17 supports the `quiet` option.
  quiet: true as unknown as boolean,
});

export const env = cleanEnv(process.env, {
  E2E_HEADLESS: str({
    choices: ['0', '1'],
    default: '0',
    desc: 'Run MCP Playwright browser in headless mode (0 = headed, 1 = headless)',
  }),
  MCP_DEFAULT_PORT: num({
    default: 0,
    desc: 'Default MCP server port (0 = auto-select free port)'
  }),
  MCP_DEFAULT_HOST: str({
    default: '127.0.0.1',
  }),
  MCP_IDLE_TIMEOUT_MS: str({
    default: '600000',
    desc: 'Auto-shutdown timeout after inactivity in milliseconds (default: 10 minutes)'
  }),
  MCP_IDLE_CHECK_INTERVAL_MS: str({
    default: '60000',
    desc: 'Interval for checking idle timeout in milliseconds (default: 1 minute)'
  })
});

// Constants
export const DEFAULT_PORT = 0;
export const MCP_TEST_ENGINE_DEBUG_PORT = 5252; // Fixed port for test engine MCP server
export const DEFAULT_TIMEOUT_MS = 3_600_000; // 1 hour
export const SERVER_READY_TIMEOUT_MS = 15_000;
export const SHUTDOWN_TIMEOUT_MS = 3_600_000; // 1 hour
export const PORT_SEARCH_ATTEMPTS = 20;
export const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 5_000;

// Auto-shutdown timeout after inactivity (configurable via MCP_IDLE_TIMEOUT_MS env var)
// Read from process.env directly to support runtime changes (e.g., in spawned processes)
export const getIdleTimeoutMs = () => parseInt(process.env.MCP_IDLE_TIMEOUT_MS || '600000', 10);
export const getIdleCheckIntervalMs = () => parseInt(process.env.MCP_IDLE_CHECK_INTERVAL_MS || '60000', 10);

// Deprecated: Use getIdleTimeoutMs() instead
export const IDLE_TIMEOUT_MS = parseInt(env.MCP_IDLE_TIMEOUT_MS, 10);
export const IDLE_CHECK_INTERVAL_MS = parseInt(env.MCP_IDLE_CHECK_INTERVAL_MS, 10);

// Network configuration
// export const DEFAULT_HOST = '127.0.0.1';
export const PORT_CHECK_POLL_INTERVAL_MS = 100;
export const HTTP_AVAILABILITY_POLL_INTERVAL_MS = 200;
export const SOCKET_CONNECTION_TIMEOUT_MS = 1_000;
export const PORT_RECLAIM_TIMEOUT_MS = 2_000;

// Absolute path to the e2e workspace (packages/syngrisi/e2e)
export const e2eRoot = path.resolve(__dirname, '../..');

// Absolute path to the repository root (packages/syngrisi)
export const projectRoot = path.resolve(e2eRoot, '..');

// Absolute path to the MCP support folder
export const mcpRoot = path.resolve(__dirname);

// Convenience paths used across the MCP utilities
export const stepsRoot = path.join(e2eRoot, 'steps');
export const supportRoot = path.join(e2eRoot, 'support');
export const featuresRoot = path.join(e2eRoot, 'features');
