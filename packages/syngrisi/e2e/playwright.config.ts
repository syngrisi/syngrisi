import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { confObject } from '@pw-native-config';

export default defineConfig({
  ...confObject,
  testDir: defineBddConfig({
    features: 'features/**/*.feature',
    steps: ['support/params.ts', 'steps/**/*.ts', 'support/fixtures/index.ts'],
  })
});
