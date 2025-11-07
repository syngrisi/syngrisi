import { mergeTests } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { appServerFixture } from './app-server.fixture';
import { testDataFixture } from './test-data.fixture';
import { testManagerFixture } from './test-manager.fixture';
import { logAttachmentFixture } from './log-attachment.fixture';
import { testEngineFixture } from './test-engine.fixture';

// Import params
import '@params';

// Merge all fixture implementations
export const test = mergeTests(
  appServerFixture,
  testDataFixture,
  testManagerFixture,
  logAttachmentFixture,
  testEngineFixture,
);

// Create BDD helpers with merged fixtures
export const { Given, When, Then } = createBdd(test);

// Re-export types for convenience
export type { AppServerFixture } from './app-server.fixture';
export type { TestStore } from './test-data.fixture';
export type { TestManagerFixture } from './test-manager.fixture';
export type { TestEngineFixture } from './test-engine.fixture';

