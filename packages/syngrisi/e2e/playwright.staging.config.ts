import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import path from 'path';

// Staging port from .env.staging
const STAGING_BASE_URL = 'http://localhost:5252';

const testDir = defineBddConfig({
  features: 'features/STAGING/**/*.feature',
  steps: [
    'support/params.ts',
    'steps/**/*.ts',
    'steps/staging/*.ts',
    'support/fixtures/index.ts'
  ],
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  // Staging-specific global setup (verifies staging is running, no build/cleanup)
  globalSetup: './support/staging-global-setup.ts',
  fullyParallel: false,  // Sequential execution for staging
  workers: 1,            // Single worker for isolation
  retries: 0,            // No retries - tests should be stable
  outputDir: './reports/staging-artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './reports/staging-html' }],
    ['json', { outputFile: './reports/staging-json/results.json' }],
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
      name: 'staging-smoke',
      testMatch: /STAGING\/smoke/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'staging-extended',
      testMatch: /STAGING\/extended/,
      dependencies: ['staging-smoke'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'staging-maintenance',
      testMatch: /STAGING\/maintenance/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'staging-demo',
      testMatch: /STAGING\/demo/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        headless: false,  // Демо всегда в headed режиме
      },
    },
  ],
});
