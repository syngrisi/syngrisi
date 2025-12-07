import { devices, type PlaywrightTestConfig } from '@playwright/test';
import { config, env } from '@config';

export const confObject = {
  timeout: config.timeout,
  expect: {
    timeout: config.expectTimeout
  },
  globalSetup: './support/global-setup.ts',
  globalTeardown: './support/global-teardown.ts',
  fullyParallel: true,
  retries: env.CI ? config.retriesCI : config.retriesLocal,
  outputDir: './reports/test-artifacts',
  reporter: env.CI
    ? [
      ['list'],
      ['blob', { outputDir: config.blobReportPath }],
      ['json', { outputFile: 'reports/json/results.json' }],
      ['html', { open: 'never', outputFolder: config.mergedReportPath }],
    ]
    : [
      ['list'],
      ['html', { open: 'never', outputFolder: config.mergedReportPath }],
      ['json', { outputFile: 'reports/json/results.json' }],
    ],
  ...(env.PLAYWRIGHT_WORKERS ? { workers: env.PLAYWRIGHT_WORKERS } : {}),
  use: {
    baseURL: env.E2E_BASE_URL,
    headless: !env.PLAYWRIGHT_HEADED,
    trace: env.E2E_FORCE_TRACE ? 'on' : (env.CI ? 'on-first-retry' : 'on'),
    actionTimeout: 7000,
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 }
      },
    }
  ]
} satisfies PlaywrightTestConfig;
