import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { defineBddConfig } from 'playwright-bdd';
import { env, e2eRoot } from './config';

const testDir = __dirname;

export const bddConfig = {
  outputDir: testDir,
  featuresRoot: e2eRoot,
  features: [path.join(e2eRoot, 'features/**/*.feature')],
  steps: [
    path.join(e2eRoot, 'support/params.ts'),
    path.join(e2eRoot, 'steps/**/*.ts'),
    path.join(__dirname, 'sd/**/*.ts'),
  ],
  importTestFrom: path.join(e2eRoot, 'support/fixtures/index.ts'),
};

defineBddConfig(bddConfig);

export default defineConfig({
  testDir,
  testMatch: 'test/**/*.spec.ts',
  fullyParallel: true,
  globalSetup: require.resolve('./test/global-setup'),
  use: {
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    actionTimeout: 5000,
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
