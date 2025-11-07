import { test as base } from 'playwright-bdd';
import type { TestInfo } from '@playwright/test';
import path from 'path';
import { getWorkerTempDir } from '@utils/fs';

// Constants for test data - can be expanded as needed
export const constants: { [key: string]: string } = {
  defaultProject: "Default Project",
  testUser: "test-user",
  testRepo: "test-repo",
};

type GetValueFunc = (item: string) => unknown;

export type DataGenerator = ReturnType<typeof createDataGenerator>;

/**
 * Creates a data generator with various utility functions for generating test data
 */
function createDataGenerator({ testInfo }: { testInfo: TestInfo }) {
  return {
    /**
     * Generates a random email address
     * @param prefix - Email prefix (default: "user")
     * @param domain - Email domain (default: "example.com")
     * @returns Generated email string
     */
    generateEmail(prefix = "user", domain = "example.com"): string {
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${prefix}${randomString}@${domain}`;
    },

    /**
     * Generates a formatted date string
     * @param format - Date format pattern (default: "YYYY-MM-DD")
     * @returns Formatted date string
     */
    generateDate(format = "YYYY-MM-DD"): string {
      const date = new Date();
      return format
        .replace("YYYY", date.getFullYear().toString())
        .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
        .replace("DD", date.getDate().toString().padStart(2, "0"));
    },

    /**
     * Generates a random number within a range
     * @param min - Minimum value
     * @param max - Maximum value
     * @returns Random number
     */
    generateNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Repeats a text string a specified number of times
     * @param text - Text to repeat
     * @param count - Number of repetitions
     * @returns Repeated text
     */
    repeat(text: string, count: number): string {
      return text.repeat(count);
    },

    /**
     * Returns the base URL from test configuration
     * @returns Base URL string
     */
    baseUrl(): string {
      return String(testInfo.project.use.baseURL);
    },

    /**
     * Retrieves a constant value by key
     * @param value - Constant key
     * @returns Constant value
     */
    constant(value: string): string {
      return constants[value];
    },

    /**
     * Generates a UUID v4
     * @returns UUID string
     */
    generateUUID(): string {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    /**
     * Generates a timestamp
     * @param format - "unix" for Unix timestamp, "iso" for ISO string (default: "unix")
     * @returns Timestamp
     */
    timestamp(format: "unix" | "iso" = "unix"): string | number {
      if (format === "iso") {
        return new Date().toISOString();
      }
      return Date.now();
    },
    projectsFolder(): string {
      return path.join(getWorkerTempDir(), 'projects');
    },
  };
}

/**
 * Parses generator parameters from a string
 * @param paramsString - Comma-separated parameters string
 * @returns Array of parsed parameters
 */
function parseGeneratorParams(paramsString: string): (string | number | boolean | null)[] {
  if (!paramsString.trim()) return [];
  return paramsString.split(",").map((param) => {
    const trimmed = param.trim();
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed === "null") return null;
    if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
    return trimmed.replace(/^["'](.*)["']$/, "$1"); // Remove quotes if present
  });
}

/**
 * Replaces placeholders in a given string with values provided by one or more functions.
 *
 * @param input - The input string containing placeholders in the format <item>, <item.property>, or <item[params]>
 * @param getValueFuncs - A single function or array of functions that return values for placeholders
 * @returns The resulting string with all placeholders replaced
 *
 * @example
 * // Simple replacement
 * const input = "Hello, <name>! Today is <day>.";
 * const result = replacePlaceholders(input, (item) => {
 *   const values = { name: "Alice", day: "Monday" };
 *   return values[item];
 * });
 * // Result: "Hello, Alice! Today is Monday."
 *
 * @example
 * // With generator functions and parameters
 * const input = "<greeting>, the date is <generateDate[YYYY-MM-DD]>";
 * const result = replacePlaceholders(input, (item) => {
 *   if (item === "greeting") return "Hello";
 *   if (item === "generateDate") return (format) => new Date().toLocaleDateString();
 * });
 *
 * @example
 * // Nested properties
 * const input = "User name: <user.name>, User email: <user.email>";
 * const testData = { user: { name: "Alice", email: "alice@example.com" } };
 * const result = replacePlaceholders(input, (item) => {
 *   const parts = item.split('.');
 *   let value = testData;
 *   for (const part of parts) {
 *     value = value[part];
 *     if (value === undefined) break;
 *   }
 *   return value;
 * });
 */
function replacePlaceholders(
  input: string,
  getValueFuncs: GetValueFunc | GetValueFunc[],
): string {
  const funcs = Array.isArray(getValueFuncs) ? getValueFuncs : [getValueFuncs];

  return input.replace(/<([\w\s.]+)(?:\[(.*?)\])?>/g, (match, item, params) => {
    const itemParts = item.trim().split(".");
    let itemValue: unknown;

    for (const func of funcs) {
      let currentValue = func(itemParts[0]);

      if (currentValue !== undefined) {
        // Handle nested properties
        for (let i = 1; i < itemParts.length; i++) {
          currentValue = currentValue[itemParts[i]];
          if (currentValue === undefined) break;
        }
        itemValue = currentValue;
      }
      if (itemValue !== undefined) break;
    }

    if (itemValue === undefined) {
      return match; // Return original placeholder if item not found
    }

    // If the value is a function, call it with parsed parameters
    if (typeof itemValue === "function") {
      const args = params ? parseGeneratorParams(params) : [];
      return String(itemValue(...args));
    }

    return String(itemValue);
  });
}

/**
 * TestStore manages test data storage and template rendering
 */
export class TestStore {
  private testData: Record<string, unknown> = {};
  private dataGenerator: DataGenerator;
  private valuesList: unknown[] = [];

  constructor({ testInfo }: { testInfo: TestInfo }) {
    this.dataGenerator = createDataGenerator({ testInfo });
  }

  /**
   * Gets a value by property name
   * @param prop - Property name
   * @returns Stored value
   */
  get(prop: string): unknown {
    return this.testData[prop];
  }

  /**
   * Gets a value by index from the values list
   * @param index - Index (negative values count from end)
   * @returns Value at index
   */
  getValueByIndex(index: number): unknown {
    if (index < 0) {
      return this.valuesList[this.valuesList.length + index];
    }
    return this.valuesList[index];
  }

  /**
   * Stores a JSON string or regular string value
   * @param prop - Property name
   * @param value - JSON string or regular string
   */
  setJsonOrString(prop: string, value: string): void {
    try {
      const parsedValue = JSON.parse(value);
      this.testData[prop] = parsedValue;
      this.valuesList.push(parsedValue);
    } catch (e) {
      // If not valid JSON, store as string
      this.testData[prop] = value;
      this.valuesList.push(value);
    }
  }

  /**
   * Sets a value
   * @param prop - Property name
   * @param value - Value to store
   */
  set(prop: string, value: unknown): void {
    this.testData[prop] = value;
    this.valuesList.push(value);
  }

  /**
   * Clears a specific property
   * @param prop - Property name to clear
   */
  clear(prop: string): void {
    delete this.testData[prop];
  }

  /**
   * Clears all stored data
   */
  clearAll(): void {
    this.testData = {};
    this.valuesList = [];
  }

  /**
   * Gets all values as a list
   * @returns Array of all stored values
   */
  getAllList(): unknown[] {
    return this.valuesList;
  }

  /**
   * Gets all stored data as an object
   * @returns Copy of all stored data
   */
  getAll(): Record<string, unknown> {
    return { ...this.testData };
  }

  /**
   * Renders a template string by replacing placeholders with stored data, generators, or constants
   * @param input - Template string with placeholders
   * @returns Rendered string with placeholders replaced
   *
   * @example
   * testData.set("username", "john_doe");
   * const result = testData.renderTemplate("User <username> created on <generateDate>");
   * // Result: "User john_doe created on 2024-01-15"
   */
  renderTemplate(input: string): string {
    return replacePlaceholders(input, [
      (item) => this.get(item), // stored data
      (item) => (this.dataGenerator)[item as keyof DataGenerator], // generators
      (item) => constants[item], // constants
    ]);
  }

}

export type FixturesTestDataType = { testData: TestStore };

/**
 * Playwright fixture that provides test data storage and template rendering capabilities
 */
export const testDataFixture = base.extend<FixturesTestDataType>({
  // biome-ignore lint/correctness/noEmptyPattern: <standard playwright-bdd pattern>
  testData: async ({ }, use, testInfo) => {
    const testData = new TestStore({ testInfo });
    await use(testData);
  },
});
