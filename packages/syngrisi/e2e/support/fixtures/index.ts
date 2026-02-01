import { mergeTests } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { appServerFixture } from './app-server.fixture';
import { testDataFixture } from './test-data.fixture';
import { testManagerFixture } from './test-manager.fixture';
import { logAttachmentFixture } from './log-attachment.fixture';
import { testEngineFixture } from './test-engine.fixture';
import { ssoServerFixture } from './sso-server.fixture';

import { mockJwksFixture } from './mock-jwks.fixture';

// Import params
import '@params';

// Merge all fixture implementations
export const test = mergeTests(
  appServerFixture,
  testDataFixture,
  testManagerFixture,
  logAttachmentFixture,
  testEngineFixture,
  ssoServerFixture,
  mockJwksFixture
);

// Create BDD helpers with merged fixtures
export const { Given, When, Then } = createBdd(test);

// Re-export types for convenience
export type { AppServerFixture } from './app-server.fixture';
export type { TestStore } from './test-data.fixture';
export type { TestManagerFixture } from './test-manager.fixture';
export type { TestEngineFixture } from './test-engine.fixture';
export type { SSOServerFixture, LogtoConfig, LogtoAppConfig } from './sso-server.fixture';

// Re-export server control functions
export { setSkipAutoStart, getSkipAutoStart } from './app-server.fixture';

