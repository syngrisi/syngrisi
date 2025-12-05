import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Staging server URL - defaults to localhost:5252, can be overridden via env
const STAGING_BASE_URL = process.env.STAGING_BASE_URL || 'http://localhost:5252';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: [
    'steps/**/*.ts',
    'support/**/*.ts',
  ],
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  globalSetup: './support/staging-global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: './reports/artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './reports/html' }],
    ['json', { outputFile: './reports/results.json' }],
  ],
  use: {
    baseURL: STAGING_BASE_URL,
    headless: process.env.PLAYWRIGHT_HEADED !== 'true',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'smoke',
      testMatch: /smoke/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'extended',
      testMatch: /extended/,
      dependencies: ['smoke'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'maintenance',
      testMatch: /maintenance/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'demo',
      testMatch: /demo/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        headless: false,
      },
    },
  ],
});
