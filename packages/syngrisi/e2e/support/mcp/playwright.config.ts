import { defineConfig } from '@playwright/test';
import path from 'node:path';

import { env, e2eRoot } from './config';

// Explicitly set testDir
const testDir = __dirname; // Points to support/mcp/

export default defineConfig({
  testDir,
  testMatch: 'test/**/*.spec.ts', // This will match support/mcp/test/*.spec.ts
  fullyParallel: true,
  globalSetup: require.resolve('./test/global-setup'),
  use: {
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    actionTimeout: 15000,
  },
  projects: [
    {
      // Main parallel tests (no app server needed)
      name: 'chromium',
      testIgnore: /mcp-real-scenarios\.spec\.ts/,
      use: {
        channel: 'chromium',
        headless: env.E2E_HEADLESS === '1',
      },
    },
    {
      // Real scenarios tests require exclusive access to app server
      // Run after parallel tests complete to avoid port conflicts
      name: 'chromium-real-scenarios',
      testMatch: /mcp-real-scenarios\.spec\.ts/,
      dependencies: ['chromium'],
      use: {
        channel: 'chromium',
        headless: env.E2E_HEADLESS === '1',
      },
    },
  ],
});
