import { Then } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';

const logger = createLogger('StoredValuesSteps');

Then(
  'I expect the stored {string} string is contain:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue);
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" contains "${expected}"`);
    expect(normalizedValue).toContain(expected.trim());
  }
);

Then(
  'I expect the stored {string} string is not contain:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue);
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" does not contain "${expected}"`);
    expect(normalizedValue).not.toContain(expected.trim());
  }
);

Then(
  'I expect the stored {string} string is equal:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue);
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" equals "${expected}"`);
    expect(normalizedValue).toBe(expected.trim());
  }
);

Then(
  'I expect the stored {string} string is not equal:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue);
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" does not equal "${expected}"`);
    expect(normalizedValue).not.toBe(expected.trim());
  }
);
