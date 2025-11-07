import type { TestStore } from '@fixtures/test-data.fixture';

/**
 * Renders a template string using TestStore
 * @param value - The string that may contain template placeholders
 * @param testData - The TestStore instance
 * @returns The rendered string with placeholders replaced
 */
export function renderTemplate(value: string, testData: TestStore): string {
  return testData.renderTemplate(value);
}

/**
 * Renders all string values in an object using TestStore
 * @param obj - Object with string values to render
 * @param testData - The TestStore instance
 * @returns Object with rendered string values
 */
export function renderTemplateObject<T extends Record<string, any>>(
  obj: T,
  testData: TestStore
): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = renderTemplate(value, testData);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Renders all string values in an array using TestStore
 * @param arr - Array with string values to render
 * @param testData - The TestStore instance
 * @returns Array with rendered string values
 */
export function renderTemplateArray(
  arr: readonly string[],
  testData: TestStore
): string[] {
  return arr.map(value => renderTemplate(value, testData));
}
