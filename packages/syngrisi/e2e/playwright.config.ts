import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { confObject } from '@pw-native-config';

// Main test directory (excludes DEMO folder)
const mainTestDir = defineBddConfig({
  outputDir: '.features-gen',
  features: ['features/**/*.feature', '!features/DEMO/**/*.feature'],
  steps: ['support/params.ts', 'steps/**/*.ts', 'support/fixtures/index.ts'],
});

// Demo test directory (only DEMO folder)
const demoTestDir = defineBddConfig({
  outputDir: '.features-gen-demo',
  features: 'features/DEMO/**/*.feature',
  steps: ['support/params.ts', 'steps/**/*.ts', 'support/fixtures/index.ts'],
});

export default defineConfig({
  ...confObject,
  testDir: mainTestDir,
  // Default project is 'chromium' - run with: npx playwright test
  // Demo project must be explicitly selected: npx playwright test --project=demo
  projects: [
    {
      name: 'chromium',
      testDir: mainTestDir,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 }
      },
    },
    {
      name: 'demo',
      testDir: demoTestDir,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        headless: false,  // Demo tests run in headed mode
        // RECORD_DEMO_VIDEO=true → save Playwright video under reports/test-artifacts/
        ...(process.env.RECORD_DEMO_VIDEO === 'true'
          ? { video: { mode: 'on' as const, size: { width: 1366, height: 768 } } }
          : {}),
      },
    },
    {
      // Marketing reel: records a clean 1440x810 video (headless = no browser chrome in frame).
      // Run: npx playwright test --project=marketing --grep "Marketing reel" --workers=1
      name: 'marketing',
      testDir: demoTestDir,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 810 },
        headless: true,
        video: { mode: 'on', size: { width: 1440, height: 810 } },
      },
    }
  ]
});
