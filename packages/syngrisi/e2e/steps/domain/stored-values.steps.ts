import { Then } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { expect } from '@playwright/test';

const logger = createLogger('StoredValuesSteps');

Then(
  'I expect the stored {string} string is contain:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName) as string | undefined;
    if (!storedValue) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    logger.info(`Checking stored "${itemName}": "${storedValue}" contains "${expected}"`);
    expect(storedValue).toContain(expected.trim());
  }
);

Then(
  'I expect the stored {string} string is not contain:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName) as string | undefined;
    if (!storedValue) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    logger.info(`Checking stored "${itemName}": "${storedValue}" does not contain "${expected}"`);
    expect(storedValue).not.toContain(expected.trim());
  }
);

Then(
  'I expect the stored {string} string is equal:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName) as string | undefined;
    if (!storedValue) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    logger.info(`Checking stored "${itemName}": "${storedValue}" equals "${expected}"`);
    expect(storedValue).toBe(expected.trim());
  }
);

