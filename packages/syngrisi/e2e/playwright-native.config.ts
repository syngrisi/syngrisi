import { devices, type PlaywrightTestConfig } from '@playwright/test';
import { config, env } from '@config';

export const confObject = {
  timeout: config.timeout,
  expect: {
    timeout: config.expectTimeout
  },
  globalSetup: './support/global-setup.ts',
  fullyParallel: true,
  retries: env.CI ? config.retriesCI : config.retriesLocal,
  outputDir: './reports/test-artifacts',
  reporter: env.CI
    ? [
      ['list'],
      ['blob', { outputDir: config.blobReportPath }],
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
    actionTimeout: 5000,
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1536, height: 864 }
      }
    }
  ]
} satisfies PlaywrightTestConfig;
