import { test as base, expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

// Simple test fixture for staging
export const test = base.extend<{}>({});

// Export BDD helpers
export const { Given, When, Then } = createBdd(test);
export { expect };
