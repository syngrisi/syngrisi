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
  testMatch: '**/*.spec.ts',
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
