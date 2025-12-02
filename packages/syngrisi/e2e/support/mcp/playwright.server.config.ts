import { defineConfig } from '@playwright/test';
import { env } from './config';

const testDir = __dirname;

export default defineConfig({
  testDir,
  testMatch: '**/mcp.spec.ts',
  fullyParallel: true,
  use: {
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    actionTimeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chromium',
        headless: env.E2E_HEADLESS === '1',
      },
    },
  ],
});
