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

    const normalizedValue = String(storedValue).trim();
    const expectedValue = expected.trim();
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" contains "${expectedValue}"`);
    expect(normalizedValue).toContain(expectedValue);
  }
);

Then(
  'I expect the stored {string} string is not contain:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue).trim();
    const expectedValue = expected.trim();
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" does not contain "${expectedValue}"`);
    expect(normalizedValue).not.toContain(expectedValue);
  }
);

Then(
  'I expect the stored {string} string is equal:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue).trim();
    const expectedValue = expected.trim();
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" equals "${expectedValue}"`);
    expect(normalizedValue).toBe(expectedValue);
  }
);

Then(
  'I expect the stored {string} string is one of:',
  async ({ testData }: { testData: TestStore }, itemName: string, expectedList: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue).trim();
    const candidates = expectedList
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    logger.info(`Checking stored "${itemName}": "${normalizedValue}" is one of [${candidates.join(', ')}]`);
    expect(candidates).toContain(normalizedValue);
  }
);

Then(
  'I expect the stored {string} string is not equal:',
  async ({ testData }: { testData: TestStore }, itemName: string, expected: string) => {
    const storedValue = testData.get(itemName);
    if (storedValue === undefined || storedValue === null) {
      throw new Error(`No stored value found for "${itemName}"`);
    }

    const normalizedValue = String(storedValue).trim();
    const expectedValue = expected.trim();
    logger.info(`Checking stored "${itemName}": "${normalizedValue}" does not equal "${expectedValue}"`);
    expect(normalizedValue).not.toBe(expectedValue);
  }
);

// Compares two stored values directly (rather than a literal docstring), for cases where the
// expected value is itself dynamic - e.g. asserting an HTTP response body does/doesn't contain
// a previously-captured document id.
Then(
  'I expect the stored {string} string to contain the stored {string}',
  async ({ testData }: { testData: TestStore }, haystackName: string, needleName: string) => {
    const haystack = testData.get(haystackName);
    const needle = testData.get(needleName);
    if (haystack === undefined || haystack === null) {
      throw new Error(`No stored value found for "${haystackName}"`);
    }
    if (needle === undefined || needle === null) {
      throw new Error(`No stored value found for "${needleName}"`);
    }
    logger.info(`Checking stored "${haystackName}" contains stored "${needleName}" ("${needle}")`);
    expect(String(haystack)).toContain(String(needle));
  }
);

Then(
  'I expect the stored {string} string to not contain the stored {string}',
  async ({ testData }: { testData: TestStore }, haystackName: string, needleName: string) => {
    const haystack = testData.get(haystackName);
    const needle = testData.get(needleName);
    if (haystack === undefined || haystack === null) {
      throw new Error(`No stored value found for "${haystackName}"`);
    }
    if (needle === undefined || needle === null) {
      throw new Error(`No stored value found for "${needleName}"`);
    }
    logger.info(`Checking stored "${haystackName}" does not contain stored "${needleName}" ("${needle}")`);
    expect(String(haystack)).not.toContain(String(needle));
  }
);
