import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../../../.env') }); // Fallback to repo root

export default defineConfig({
  testDir: './tests',
  timeout: 10 * 60 * 1000, // 10 minutes per scenario
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false, // Default to sequential for stability of MCP agent
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.BENCH_WORKERS ? parseInt(process.env.BENCH_WORKERS, 10) : 1,
  reporter: [
    ['list'],
    ['./reporters/benchmark-reporter.ts']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mcp-benchmark',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
