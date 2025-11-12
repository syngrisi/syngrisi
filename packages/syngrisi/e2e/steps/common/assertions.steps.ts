import type { Page } from '@playwright/test';
import { Then, When } from '@fixtures';
import { expect } from '@playwright/test';
import type { ElementAttribute, ElementTarget, ExpectationCondition, StepCondition } from '@params';
import { getLabelLocator, getLocatorQuery, getRoleLocator } from '@helpers/locators';
import { assertCondition } from '@helpers/assertions';
import { AriaRole } from '@helpers/types';
import type { Locator } from '@playwright/test';
import { renderTemplate } from '@helpers/template';
import { createLogger } from '@lib/logger';
import type { TestStore } from '@fixtures';

const logger = createLogger('AssertionsSteps');

async function ensureTestDetailsVisible(page: Page, testName: string): Promise<void> {
  if (!testName) return;

  try {
    await page.waitForFunction(
      (name) =>
        !!document.querySelector(`[data-table-test-name="${name}"]`) ||
        !!document.querySelector(`tr[data-row-name="${name}"]`),
      testName,
      { timeout: 5000 }
    );
  } catch {
    logger.warn(`Failed to locate row for test "${testName}" while ensuring details are visible`);
    return;
  }

  const isExpanded = await page.evaluate((name) => {
    const row = document.querySelector(`tr[data-row-name="${name}"]`);
    if (!row) return false;
    const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]') as HTMLElement | null;
    if (!collapse) return false;
    const style = window.getComputedStyle(collapse);
    const rect = collapse.getBoundingClientRect();
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      rect.height > 0 &&
      rect.width > 0
    );
  }, testName);

  if (isExpanded) {
    return;
  }

  const rowLocator = page.locator(`tr[data-row-name="${testName}"]`).first();
  if ((await rowLocator.count()) > 0) {
    const nameCell = rowLocator.locator('[data-test="table-row-Name"]').first();
    if ((await nameCell.count()) > 0) {
      await nameCell.scrollIntoViewIfNeeded().catch(() => {});
      await nameCell.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await nameCell.click().catch(() => {});
      await page.waitForTimeout(100);
      return;
    }
    await rowLocator.scrollIntoViewIfNeeded().catch(() => {});
    await rowLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await rowLocator.click().catch(() => {});
    await page.waitForTimeout(100);
    return;
  }

  const headerLocator = page.locator(`[data-table-test-name="${testName}"]`).first();
  if ((await headerLocator.count()) > 0) {
    await headerLocator.scrollIntoViewIfNeeded().catch(() => {});
    await headerLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await headerLocator.click().catch(() => {});
    await page.waitForTimeout(100);
  }
}

/**
 * Resolves a locator based on a {@link ElementTarget} descriptor extracted from `{target}`.
 *
 * @param page - Playwright {@link Page} instance from the step world.
 * @param target - `'label' | 'locator'` parsed by the `{target}` parameter type.
 * @param rawValue - Label text or locator query.
 * @param ordinal - Optional zero-based ordinal index provided by `{ordinal}` when present.
 */
function locatorFromTarget(
  page: Page,
  target: ElementTarget,
  rawValue: string,
  ordinal?: number
) {
  if (target === 'label') {
    return getLabelLocator(page, rawValue, ordinal);
  }

  if (target === 'locator') {
    return getLocatorQuery(page, rawValue, ordinal);
  }

  throw new Error(`Unsupported target: ${target}`);
}

/**
 * Resolves a locator based on role, attribute, and value.
 *
 * @param page - Playwright {@link Page} instance from the step world.
 * @param role - {@link AriaRole} or 'element' for generic locators.
 * @param attribute - {@link ElementAttribute} (`'name' | 'locator' | 'label'`).
 * @param value - The value of the attribute.
 */
function getLocator({
  page,
  role,
  attribute,
  value,
}: {
  page: Page;
  role: AriaRole | 'element';
  attribute: ElementAttribute;
  value: string;
}): Locator {
  if ((role as string) === 'element') {
    if (attribute === 'locator') {
      return getLocatorQuery(page, value);
    }
    if (attribute === 'label') {
      return getLabelLocator(page, value);
    }
    throw new Error(`For role "element", attribute must be "locator" or "label", got "${attribute}"`);
  }

  if (attribute === 'name') {
    return getRoleLocator(page, role as AriaRole, value);
  }

  throw new Error(`For role "${role}", attribute must be "name", got "${attribute}"`);
}

/**
 * Step definition: `Then the {role} {string} should be {condition}`
 *
 * @param role - {@link AriaRole} derived from the `{role}` parameter type.
 * @param name - Accessible name for the element.
 * @param condition - {@link StepCondition} value (e.g. `'visible'`, `'enabled'`).
 *
 * @example
 * ```gherkin
 * Then the button "Save" should be visible
 * ```
 */
Then(
  'the {role} {string} should be {condition}',
  async ({ page, testData }, role: AriaRole, name: string, condition: StepCondition) => {
    const renderedName = renderTemplate(name, testData);
    const locator = getRoleLocator(page, role, renderedName);
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the {role} {string} should be {condition} for {int} sec`
 *
 * @param role - {@link AriaRole} derived from the `{role}` parameter type.
 * @param name - Accessible name for the element.
 * @param condition - {@link StepCondition} value (e.g. `'visible'`, `'enabled'`).
 * @param seconds - Number of seconds to wait for the condition.
 *
 * @example
 * ```gherkin
 * Then the button "Save" should be visible for 5 sec
 * ```
 */
Then(
  'the {role} {string} should be {condition} for {int} sec',
  async ({ page, testData }, role: AriaRole, name: string, condition: StepCondition, seconds: number) => {
    const renderedName = renderTemplate(name, testData);
    const locator = getRoleLocator(page, role, renderedName);
    await assertCondition(locator, condition, undefined, { timeout: seconds * 1000 });
  }
);

/**
 * Step definition: `Then the {ordinal} {role} {string} should be {condition}`
 *
 * @param ordinal - Zero-based ordinal index supplied by `{ordinal}` (e.g. `3rd` -> `2`).
 * @param role - {@link AriaRole} derived from the `{role}` parameter type.
 * @param name - Accessible name for the target element.
 * @param condition - {@link StepCondition} to evaluate (e.g. `'visible'`, `'checked'`).
 *
 * @example
 * ```gherkin
 * Then the 3rd checkbox "Select item" should be checked
 * ```
 */
Then(
  'the {ordinal} {role} {string} should be {condition}',
  async ({ page }, ordinal: number, role: AriaRole, name: string, condition: StepCondition) => {
    const locator = getRoleLocator(page, role, name, ordinal);
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should be {condition}`
 *
 * @param target - {@link ElementTarget} (`'label' | 'locator'`).
 * @param rawValue - Label text or locator query that identifies the element.
 * @param condition - {@link StepCondition} to evaluate against the resolved locator.
 *
 * @example
 * ```gherkin
 * Then the element with label "Email" should be enabled
 * ```
 */
Then(
  'the element with {target} {string} should be {condition}',
  async ({ page }, target: ElementTarget, rawValue: string, condition: StepCondition) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should be {condition} for {int} sec`
 *
 * @param target - {@link ElementTarget} (`'label' | 'locator'`).
 * @param rawValue - Label text or locator query that identifies the element.
 * @param condition - {@link StepCondition} to evaluate against the resolved locator.
 * @param seconds - Number of seconds to wait for the condition.
 *
 * @example
 * ```gherkin
 * Then the element with label "Loading" should be visible for 10 sec
 * ```
 */
Then(
  'the element with {target} {string} should be {condition} for {int} sec',
  async (
    { page },
    target: ElementTarget,
    rawValue: string,
    condition: StepCondition,
    seconds: number
  ) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, condition, undefined, { timeout: seconds * 1000 });
  }
);

/**
 * Step definition: `Then the {ordinal} element with {target} {string} should be {condition}`
 *
 * @param ordinal - Zero-based ordinal index supplied by `{ordinal}`.
 * @param target - {@link ElementTarget} specifying resolution strategy.
 * @param rawValue - Label text or locator query used to find the element set.
 * @param condition - {@link StepCondition} to evaluate.
 *
 * @example
 * ```gherkin
 * Then the 2nd element with locator ".todo-item" should be visible
 * ```
 */
Then(
  'the {ordinal} element with {target} {string} should be {condition}',
  async (
    { page },
    ordinal: number,
    target: ElementTarget,
    rawValue: string,
    condition: StepCondition
  ) => {
    const locator = locatorFromTarget(page, target, rawValue, ordinal);
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the {role} {string} should have text {string}`
 *
 * Retained for readability alongside the generic `{valueCondition}` variant.
 *
 * @param role - {@link AriaRole} derived from `{role}`.
 * @param name - Accessible name bound to the element.
 * @param expected - Exact text expected for the locator.
 *
 * @example
 * ```gherkin
 * Then the heading "Welcome" should have text "Welcome"
 * ```
 */
Then(
  'the {role} {string} should have text {string}',
  async ({ page }, role: AriaRole, name: string, expected: string) => {
    const locator = getRoleLocator(page, role, name);
    await assertCondition(locator, 'has text', expected);
  }
);


/**
 * Step definition: `Then the {ordinal} {role} {string} should have text {string}`
 *
 * @param ordinal - Zero-based ordinal index from the `{ordinal}` parameter.
 * @param role - {@link AriaRole} derived from `{role}`.
 * @param name - Accessible name for the element.
 * @param expected - Exact text expected for the locator.
 *
 * @example
 * ```gherkin
 * Then the 2nd button "Remove" should have text "Remove"
 * ```
 */
Then(
  'the {ordinal} {role} {string} should have text {string}',
  async ({ page }, ordinal: number, role: AriaRole, name: string, expected: string) => {
    const locator = getRoleLocator(page, role, name, ordinal);
    await assertCondition(locator, 'has text', expected);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should have text {string}`
 *
 * @param target - {@link ElementTarget} representing either a label lookup or raw locator.
 * @param rawValue - Label text or locator query.
 * @param expected - Exact text expected for the locator.
 *
 * @example
 * ```gherkin
 * Then the element with locator "//h1" should have text "Welcome"
 * ```
 */
Then(
  'the element with {target} {string} should have text {string}',
  async ({ page }, target: ElementTarget, rawValue: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, 'has text', expected);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should have value {string}`
 *
 * Asserts the form control's current value using a label or raw locator.
 *
 * @param target - {@link ElementTarget} representing either a label lookup or raw locator.
 * @param rawValue - Label text or locator query identifying the element.
 * @param expected - Exact value expected for the element.
 *
 * @example
 * ```gherkin
 * Then the element with label "Email" should have value "user@example.com"
 * ```
 */
Then(
  'the element with {target} {string} should have value {string}',
  async ({ page, testData }, target: ElementTarget, rawValue: string, expected: string) => {
    const renderedTarget = testData ? renderTemplate(rawValue, testData) : rawValue;
    const renderedExpected = testData ? renderTemplate(expected, testData) : expected;
    const locator = locatorFromTarget(page, target, renderedTarget);
    await assertCondition(locator, 'has value', renderedExpected);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should have contains text {string}`
 *
 * Delegates to the `'contains text'` expectation handled by {@link assertCondition}.
 *
 * @param target - {@link ElementTarget} representing either a label lookup or raw locator.
 * @param rawValue - Label text or locator query.
 * @param expected - Partial text expected within the resolved element.
 *
 * @example
 * ```gherkin
 * Then the element with label "Status" should have contains text "Pending"
 * ```
 */
Then(
  'the element with {target} {string} should have contains text {string}',
  async ({ page }, target: ElementTarget, rawValue: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, 'contains text', expected);
  }
);

Then(
  'the {role} {string} should have contains text {string}',
  async ({ page }, role: AriaRole, name: string, expected: string) => {
    const locator = getRoleLocator(page, role, name);
    await assertCondition(locator, 'contains text', expected);
  }
);

/**
 * Step definition: `Then the {ordinal} element with {target} {string} should have text {string}`
 *
 * @param ordinal - Zero-based ordinal index from `{ordinal}`.
 * @param target - {@link ElementTarget} used to resolve the locator.
 * @param rawValue - Label text or locator query.
 * @param expected - Exact text expected for the locator.
 *
 * @example
 * ```gherkin
 * Then the 3rd element with label "Todo" should have text "Finish docs"
 * ```
 */
Then(
  'the {ordinal} element with {target} {string} should have text {string}',
  async ({ page }, ordinal: number, target: ElementTarget, rawValue: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue, ordinal);
    await assertCondition(locator, 'has text', expected);
  }
);

/**
 * Step definition: `Then the {role} {string} should have {valueCondition} {string}`
 *
 * Supports all string/number/key-value expectations defined in {@link ExpectationCondition}.
 *
 * @param role - {@link AriaRole} derived from `{role}`.
 * @param name - Accessible name for the target element.
 * @param condition - {@link ExpectationCondition} such as `'contains text'`, `'has attribute'`, `'has css'`.
 * @param expected - Expected string value, numeric string, or `key=value` pair depending on the condition.
 *
 * @examples
 * ```gherkin
 * Then the button "Submit" should have accessible name "Submit"
 * Then the listitem "Todo" should have count "3"
 * Then the checkbox "Accept" should have attribute "aria-checked=true"
 * ```
 */
Then(
  'the {role} {string} should have {valueCondition} {string}',
  async ({ page }, role: AriaRole, name: string, condition: ExpectationCondition, expected: string) => {
    const locator = getRoleLocator(page, role, name);
    await assertCondition(locator, condition, expected);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should have {valueCondition} {string}`
 *
 * @param target - {@link ElementTarget} resolving the strategy (`'label' | 'locator'`).
 * @param rawValue - Label text or raw locator query.
 * @param condition - {@link ExpectationCondition} applied to the resolved locator.
 * @param expected - Expected value string provided in the step.
 *
 * @examples
 * ```gherkin
 * Then the element with label "Email" should have value "user@example.com"
 * Then the element with locator ".pill" should have css "background-color=red"
 * ```
 */
Then(
  'the element with {target} {string} should have {valueCondition} {string}',
  async ({ page }, target: ElementTarget, rawValue: string, condition: ExpectationCondition, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, condition, expected);
  }
);

/**
 * Step definition: `Then the {ordinal} element with {target} {string} should have {valueCondition} {string}`
 *
 * @param ordinal - Zero-based ordinal index derived from `{ordinal}`.
 * @param target - {@link ElementTarget} resolution strategy.
 * @param rawValue - Label text or locator query.
 * @param condition - {@link ExpectationCondition} describing the assertion.
 * @param expected - Expected value string.
 *
 * @example
 * ```gherkin
 * Then the 2nd element with label "Email" should have value "admin@example.com"
 * ```
 */
Then(
  'the {ordinal} element with {target} {string} should have {valueCondition} {string}',
  async (
    { page },
    ordinal: number,
    target: ElementTarget,
    rawValue: string,
    condition: ExpectationCondition,
    expected: string
  ) => {
    const locator = locatorFromTarget(page, target, rawValue, ordinal);
    await assertCondition(locator, condition, expected);
  }
);

/**
 * Step definition: `Then the table containing {string} should be {condition}`
 *
 * Checks if a table containing specific text has a specified condition.
 *
 * @example
 * ```gherkin
 * Then the table containing "This is line 1" should be visible
 * Then the table containing "Some text" should be absent
 * ```
 */
Then(
  'the table containing {string} should be {condition}',
  async ({ page }, text: string, condition: ExpectationCondition) => {
    const locator = page.getByRole('table').filter({ hasText: text });
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the {role} {string} with aria-pressed {string} should be {condition}`
 *
 * Checks if an element with specific aria-pressed value has a specified condition.
 *
 * @example
 * ```gherkin
 * Then the button "Inline" with aria-pressed "true" should be visible
 * Then the button "Split" with aria-pressed "false" should be visible
 * ```
 */
Then(
  'the page should be visible',
  async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  }
);

Then(
  'the element {string} matches the text {string}',
  async ({ page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    // WebdriverIO's getText() returns the visible text (like innerText), not textContent
    // We need to get the visible text to match WebdriverIO behavior
    const visibleText = await locator.first().innerText();
    await expect(visibleText).toBe(expected);
  }
);

// Shared function for checking text content with status polling
async function checkElementContainsText(
  page: Page,
  selector: string,
  expected: string,
  testData?: any
) {
  const renderedExpected = renderTemplate(expected, testData);
  const locator = getLocatorQuery(page, selector);
  try {
    await locator.first().waitFor({ state: 'attached', timeout: 10000 });
  } catch (error) {
    if (selector.includes("[data-check='")) {
      const snapshot = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-check]')).map((el) => ({
          value: el.getAttribute('data-check'),
          text: el.textContent,
        }))
      );
      logger.info(`Wait for selector "${selector}" failed; available [data-check] elements: ${JSON.stringify(snapshot)}`);
    }
    throw error;
  }
  // If checking test status, wait for status to change from "Running" using polling
  if (selector.includes('table-row-Status') && expected !== 'Running') {
    // Use polling to wait for status change (as tests may take time to complete)
    const maxAttempts = 90; // 90 seconds with 1 second intervals (tests may take time to process)
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const text = await locator.first().textContent();
      const trimmedText = text?.trim() || '';
      if (trimmedText === expected || trimmedText.toLowerCase() === expected.toLowerCase()) {
        logger.info(`Test status changed to "${expected}" after ${attempt + 1} attempts`);
        break;
      }
      if (attempt < maxAttempts - 1) {
        await page.waitForTimeout(1000);
      }
    }
  }
  // Handle placeholders like <YYYY-MM-DD> - replace with regex pattern for date matching
  let expectedPattern = renderedExpected;
  if (renderedExpected.includes('<YYYY-MM-DD>')) {
    // Replace <YYYY-MM-DD> with regex pattern that matches date format YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
    expectedPattern = renderedExpected.replace('<YYYY-MM-DD>', '\\d{4}-\\d{2}-\\d{2}(?: \\d{2}:\\d{2}:\\d{2})?');
    const actualText = await locator.first().textContent();
    const regex = new RegExp(expectedPattern);
    if (!regex.test(actualText || '')) {
      throw new Error(`Expected text to match pattern "${expectedPattern}", but got "${actualText}"`);
    }
    return;
  }
  if (selector.includes('browser-label')) {
    const texts = await locator.allTextContents();
    logger.info(`Texts resolved for selector "${selector}": ${JSON.stringify(texts)}`);
  }
  let texts = await locator.allTextContents();
  if (texts.length === 0) {
    texts = await locator.evaluateAll((elements) =>
      elements.map((el) => {
        const htmlElement = el as HTMLElement;
        return htmlElement.innerText ?? el.textContent ?? '';
      })
    );
  }
  const normalizedTexts = texts.map((text) => (text || '').replace(/\u00a0/g, ' '));
  if (selector.includes('data-related-check')) {
    logger.info(`Texts for selector "${selector}": raw=${JSON.stringify(texts)} normalized=${JSON.stringify(normalizedTexts)}`);
  }
  if (texts.length === 0) {
    if (selector.includes("[data-check='")) {
      const matchCount = await locator.count();
      const dataCheckSnapshot = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-check]')).map((el) => ({
          value: el.getAttribute('data-check'),
          text: el.textContent,
        }))
      );
      logger.info(
        `Available [data-check] elements: ${JSON.stringify(dataCheckSnapshot)}; locator count=${matchCount}`
      );
      const targetOuterHtml = await page.evaluate((sel) => {
        const node = document.querySelector(sel);
        return node ? node.outerHTML : null;
      }, selector);
      logger.info(`OuterHTML for selector "${selector}": ${targetOuterHtml}`);
      const textMatches = await page.evaluate((needle) =>
        Array.from(document.querySelectorAll('*'))
          .filter((el) => (el.textContent || '').includes(needle))
          .slice(0, 5)
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent,
            classes: el.className,
            dataCheck: el.getAttribute('data-check'),
          }))
      , renderedExpected);
      logger.info(`Elements containing text "${renderedExpected}": ${JSON.stringify(textMatches)}`);
    }
    throw new Error(`Expected at least one element for selector "${selector}", but none found`);
  }
  if (!normalizedTexts.some((text) => text.includes(renderedExpected))) {
    throw new Error(`Expected any element matching "${selector}" to contain "${renderedExpected}", but texts were ${JSON.stringify(normalizedTexts)}`);
  }
}

// Register step for Then keyword (works for both When and Then in feature files)
// Note: In Cucumber, a step definition registered with one keyword can be used with any keyword in feature files
Then('I expect that element {string} to contain text {string}', async ({ page, testData }, selector: string, expected: string) => {
  await checkElementContainsText(page, selector, expected, testData);
});

Then(
  'I expect that the css attribute {string} from element {string} is {string}',
  async ({ page }, cssProperty: string, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    // WebdriverIO's getCSSProperty for color properties returns attributeValue.value
    // We need to replicate this behavior exactly - get the computed style value
    let actualValue = await locator.first().evaluate((el, prop) => {
      // Convert CSS property name (background-color) to camelCase (backgroundColor)
      const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const computedStyle = window.getComputedStyle(el);
      let value = (computedStyle[camelProp as keyof CSSStyleDeclaration] as string) || '';

      // For SVG elements with color property, WebdriverIO may return the computed color
      // even if it's empty in computedStyle. Check if element is SVG and color is empty
      if (prop === 'color' && (!value || value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) {
        // For SVG, try to get the actual fill color from computed style
        // WebdriverIO's getCSSProperty('color') for SVG returns the computed color value
        // which may come from fill or stroke
        const fill = computedStyle.fill;
        const stroke = computedStyle.stroke;

        // If fill or stroke is set and is a color value, use it
        if (fill && fill !== 'none' && fill !== 'rgba(0, 0, 0, 0)') {
          value = fill;
        } else if (stroke && stroke !== 'none' && stroke !== 'rgba(0, 0, 0, 0)') {
          value = stroke;
        }

        // If still empty, check parent element's color (SVG inherits color from parent)
        if (!value || value === 'rgba(0, 0, 0, 0)' || value === 'transparent') {
          const parent = el.parentElement;
          if (parent) {
            const parentColor = window.getComputedStyle(parent).color;
            if (parentColor && parentColor !== 'rgba(0, 0, 0, 0)') {
              value = parentColor;
            }
          }
        }
      }

      return value;
    }, cssProperty);

    // Normalize color values to match WebdriverIO behavior
    // WebdriverIO returns rgba(r,g,b,1) format without spaces for colors
    if (cssProperty.match(/(color|background-color)/)) {
      // Normalize rgba values: remove spaces and ensure alpha is present
      const rgbaMatch = actualValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        const r = rgbaMatch[1];
        const g = rgbaMatch[2];
        const b = rgbaMatch[3];
        const a = rgbaMatch[4] || '1';
        actualValue = `rgba(${r},${g},${b},${a})`;
      } else {
        // Convert rgb(r, g, b) to rgba(r,g,b,1) format (no spaces, as WebdriverIO returns)
        const rgbMatch = actualValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          actualValue = `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},1)`;
        }
      }
      // If still empty, log warning
      if (!actualValue) {
        logger.warn(`CSS property "${cssProperty}" returned empty value for selector "${selector}"`);
      }
    }

    // Use exact comparison as WebdriverIO does with toEqual
    await expect(actualValue).toBe(expected);
  }
);

Then(
  'I expect that the attribute {string} from element {string} is {string}',
  async ({ page }, attributeName: string, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const element = locator.first();
    const allValues = await locator.evaluateAll((nodes, attr) => nodes.map((node) => (node as HTMLElement).getAttribute(attr)), attributeName);
    logger.info(`Collected ${allValues.length} "${attributeName}" values for selector "${selector}": ${JSON.stringify(allValues)}`);
    const htmlSnippets = await locator.evaluateAll((nodes) => nodes.map((node) => {
      const el = node as Element;
      const parent = el.parentElement;
      const parentInfo = parent
        ? ` parent[data-test=${parent.getAttribute('data-test') || 'n/a'}, class=${parent.className}]`
        : '';
      return `${el.outerHTML}${parentInfo}`;
    }));
    logger.info(`HTML snapshots for selector "${selector}": ${htmlSnippets.join(' | ')}`);
    const actual = await element.getAttribute(attributeName);
    logger.info(`Attribute assertion for selector "${selector}" -> ${attributeName}="${actual}" (expected "${expected}")`);
    await expect(element).toHaveAttribute(attributeName, expected);
  }
);

When(
  'I wait on element {string} to be displayed',
  async ({ page, testData }: { page: Page; testData: TestStore }, selector: string) => {
    const lastUnfoldedTest = testData?.get('lastUnfoldedTest') as string | undefined;
    logger.info(
      `Waiting for selector "${selector}" with last unfolded test "${lastUnfoldedTest ?? 'n/a'}"`
    );
    // For user initials (TU, TR, JD, TA, RR, SD, SG), use special handling
    if (selector.match(/span\*=[A-Z]{2}/)) {
      const match = selector.match(/span\*=([A-Z]{2})/);
      const expectedInitials = match ? match[1] : '';

      // Wait for user icon to appear first
      await page.locator('[data-test="user-icon"]').waitFor({ state: 'visible', timeout: 15000 });

      // Force page reload to refresh React Query cache and get updated user data
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Poll for initials to appear (React Query may take time to load user data)
      const maxAttempts = 60; // 30 seconds with 500ms intervals
      let found = false;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const iconText = await page.locator('[data-test="user-icon"]').first().textContent();
        if (iconText && iconText.trim() === expectedInitials) {
          found = true;
          break;
        }
        if (attempt < maxAttempts - 1) {
          await page.waitForTimeout(500);
        }
      }

      if (!found) {
        const iconText = await page.locator('[data-test="user-icon"]').first().textContent();
        throw new Error(`User initials "${expectedInitials}" not found in user icon. Actual text: "${iconText}"`);
      }
      return; // Success, exit early
    }

    if (selector.includes('Test does not have any checks') && lastUnfoldedTest) {
      await ensureTestDetailsVisible(page, lastUnfoldedTest);
      await page.waitForFunction(
        (testName) => {
          const row = document.querySelector(`tr[data-row-name="${testName}"]`);
          if (!row) return false;
          const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]') as HTMLElement | null;
          if (!collapse) return false;
          const style = window.getComputedStyle(collapse);
          const rect = collapse.getBoundingClientRect();
          const isVisible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            rect.height > 0 &&
            rect.width > 0;
          if (!isVisible) return false;
          return collapse.textContent?.includes('Test does not have any checks');
        },
        lastUnfoldedTest,
        { timeout: 30000 }
      );
      logger.info(`Confirmed selector "${selector}" via collapse content check`);
      return;
    }

    // For other selectors, use standard approach
    const locator = getLocatorQuery(page, selector);
    const timeoutMs = 30000;
    const intervalMs = 250;
    const deadline = Date.now() + timeoutMs;
    let attempts = 0;
    let reUnfoldAttempts = 0;

    while (Date.now() < deadline) {
      attempts += 1;
      const count = await locator.count();
      if (count > 0) {
        let foundVisible = false;
        for (let i = 0; i < count; i += 1) {
          const candidate = locator.nth(i);
          try {
            await candidate.scrollIntoViewIfNeeded().catch(() => {});
            if (await candidate.isVisible()) {
              foundVisible = true;
              logger.info(`Selector "${selector}" became visible after ${attempts} checks`);
              return;
            }
          } catch (error) {
            logger.debug?.(`isVisible check failed for selector "${selector}" index ${i}: ${(error as Error).message}`);
          }
        }
        if (!foundVisible) {
          try {
            const debugStyles = await locator.evaluateAll((nodes) =>
              nodes.map((node) => {
                const el = node as HTMLElement;
                const style = window.getComputedStyle(el);
                return {
                  tag: el.tagName,
                  display: style.display,
                  visibility: style.visibility,
                  opacity: style.opacity,
                  offsetParent: el.offsetParent ? (el.offsetParent as HTMLElement).tagName : null,
                  text: el.textContent?.trim() || '',
                  dataTableTestName: el.getAttribute('data-table-test-name'),
                };
              })
            );
            logger.info(`Selector "${selector}" not visible yet; styles: ${JSON.stringify(debugStyles)}`);

            // Debug: log all data-table-test-name attributes in the page
            if (selector.includes('data-table-test-name')) {
              const allTestNames = await page.evaluate(() => {
                const elements = Array.from(document.querySelectorAll('[data-table-test-name]'));
                return elements.map((el) => ({
                  name: el.getAttribute('data-table-test-name'),
                  text: el.textContent?.trim() || '',
                  visible: (el as HTMLElement).offsetParent !== null,
                }));
              });
              logger.info(`All [data-table-test-name] elements on page: ${JSON.stringify(allTestNames)}`);
            }
          } catch (error) {
            logger.debug?.(`Failed to collect debug styles for "${selector}": ${(error as Error).message}`);
          }

          if (
            lastUnfoldedTest &&
            selector.includes('Test does not have any checks') &&
            attempts % 8 === 0
          ) {
            reUnfoldAttempts += 1;
            logger.info(
              `Attempt ${reUnfoldAttempts}: re-unfolding test "${lastUnfoldedTest}" while waiting for selector "${selector}"`
            );
            await ensureTestDetailsVisible(page, lastUnfoldedTest);
          }
        }
      }
      if (count === 0) {
        // Debug: log all data-table-test-name attributes in the page when count is 0
        if (selector.includes('data-table-test-name') && attempts % 20 === 0) {
          try {
            const allTestNames = await page.evaluate(() => {
              const elements = Array.from(document.querySelectorAll('[data-table-test-name]'));
              return elements.map((el) => ({
                name: el.getAttribute('data-table-test-name'),
                text: el.textContent?.trim() || '',
                visible: (el as HTMLElement).offsetParent !== null,
              }));
            });
            logger.info(`No matches found for "${selector}" (attempt ${attempts}); All [data-table-test-name] elements on page: ${JSON.stringify(allTestNames)}`);
          } catch (error) {
            logger.debug?.(`Failed to collect debug info for "${selector}": ${(error as Error).message}`);
          }
        }

        if (
          lastUnfoldedTest &&
          selector.includes('Test does not have any checks') &&
          attempts % 8 === 0
        ) {
          reUnfoldAttempts += 1;
          logger.info(
            `Attempt ${reUnfoldAttempts}: no matches found for "${selector}", re-unfolding test "${lastUnfoldedTest}"`
          );
          await ensureTestDetailsVisible(page, lastUnfoldedTest);
        }
      }
      await page.waitForTimeout(intervalMs);
    }

    throw new Error(`Element "${selector}" was not visible after ${timeoutMs}ms`);
  }
);

When(
  'I wait on element {string} for {int}ms to be displayed',
  async ({ page }, selector: string, timeoutMs: number) => {
    const locator = getLocatorQuery(page, selector);
    await locator.first().waitFor({ state: 'visible', timeout: timeoutMs });
  }
);

Then(
  'I expect that element {string} is not displayed',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).not.toBeVisible();
  }
);

When(
  'I wait on element {string} to not be displayed',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await locator.first().waitFor({ state: 'hidden', timeout: 30000 });
  }
);

When(
  'I wait on element {string} to not exist',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await locator.first().waitFor({ state: 'detached', timeout: 30000 });
  }
);

Then(
  'I expect that element {string} does not exist',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toHaveCount(0);
  }
);

Then(
  'I expect that element {string} is displayed',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toBeVisible();
  }
);

Then('the element {string} is displayed', async ({ page }, selector: string) => {
  const locator = getLocatorQuery(page, selector);
  await expect(locator.first()).toBeVisible();
});

Then('the title is {string}', async ({ page }, expectedTitle: string) => {
  const title = await page.title();
  expect(title).toBe(expectedTitle);
});

Then('I expect that the title contains {string}', async ({ page }, expectedTitle: string) => {
  const title = await page.title();
  expect(title).toContain(expectedTitle);
});

Then('the css attribute {string} from element {string} is {string}', async ({ page, testData }, attrName: string, selector: string, expected: string) => {
  const renderedSelector = renderTemplate(selector, testData);
  const renderedExpected = renderTemplate(expected, testData);
  const locator = getLocatorQuery(page, renderedSelector);
  const value = await locator.first().evaluate((el: HTMLElement, attr: string) => {
    return window.getComputedStyle(el).getPropertyValue(attr);
  }, attrName);
  let normalizedValue = value.trim();
  if (/color$/i.test(attrName)) {
    normalizedValue = normalizedValue.replace(/\s+/g, '');
    const rgbMatch = normalizedValue.match(/^rgb\((\d+,\d+,\d+)\)$/i);
    if (rgbMatch) {
      normalizedValue = `rgba(${rgbMatch[1]},1)`;
    }
    normalizedValue = normalizedValue.replace(/rgba\(([^)]+)\)/gi, (_, content) => `rgba(${content.replace(/\s+/g, '')})`);
  }

  const expectedTrimmed = renderedExpected.trim();
  const pxMatch = expectedTrimmed.match(/^([\d.]+)px$/);
  const actualPxMatch = normalizedValue.match(/^([\d.]+)px$/);

  if (pxMatch && actualPxMatch) {
    const expectedPx = parseFloat(pxMatch[1]);
    const actualPx = parseFloat(actualPxMatch[1]);
    const tolerance = 10;
    const diff = Math.abs(expectedPx - actualPx);
    expect(diff).toBeLessThanOrEqual(tolerance);
  } else {
    expect(normalizedValue).toBe(expectedTrimmed);
  }
});

When('I wait on element {string} to exist', async ({ page }, selector: string) => {
  const locator = getLocatorQuery(page, selector);
  await locator.first().waitFor({ state: 'attached', timeout: 30000 });
});

Then(
  'the element {string} contains the text {string}',
  async ({ page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toContainText(expected);
  }
);

Then(
  'I expect that element {string} does appear exactly {string} times',
  async ({ page }, selector: string, expectedCount: string) => {
    const locator = getLocatorQuery(page, selector);
    const count = parseInt(expectedCount, 10);
    await expect(locator).toHaveCount(count);
  }
);

Then(
  'I expect that element {string} to have text {string}',
  async ({ page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    // WebdriverIO's getText() returns the visible text (like innerText), not textContent
    // We need to get the visible text to match WebdriverIO behavior
    const visibleText = await locator.first().innerText();
    await expect(visibleText).toBe(expected);
  }
);

Then(
  'I expect that element {string} to contain HTML {string}',
  async ({ page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const html = await locator.first().innerHTML();
    await expect(html).toContain(expected);
  }
);

Then(
  'I expect that element {string} has the class {string}',
  async ({ page }, selector: string, className: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toHaveClass(new RegExp(className));
  }
);

Then(
  'I expect that element {string} does not have the class {string}',
  async ({ page }, selector: string, className: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).not.toHaveClass(new RegExp(className));
  }
);

Then(
  'I expect that the attribute {string} from element {string} is not {string}',
  async ({ page }, attributeName: string, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).not.toHaveAttribute(attributeName, expected);
  }
);

Then(
  'I expect the url to contain {string}',
  async ({ page, testData }, expectedUrl: string) => {
    const renderedUrl = renderTemplate(expectedUrl, testData);
    // Wait for URL to contain the expected string (redirects may happen via JavaScript)
    try {
      await page.waitForURL(`**/*${renderedUrl}*`, { timeout: 10000 });
    } catch (e) {
      // If waitForURL fails, try waitForFunction as fallback
      try {
        await page.waitForFunction(
          (url) => window.location.href.includes(url),
          renderedUrl,
          { timeout: 5000 }
        );
      } catch (e2) {
        // If both fail, check current URL anyway
      }
    }
    // Wait for URL to contain the expected string (with longer timeout for redirects)
    const maxWaitTime = 10000;
    const startTime = Date.now();
    let urlMatches = false;
    let currentUrl = '';

    while (Date.now() - startTime < maxWaitTime && !urlMatches) {
      await page.waitForTimeout(200);
      currentUrl = page.url();
      // Check both full URL and pathname (as old framework checks full URL with toContain)
      try {
        const urlObj = new URL(currentUrl);
        const urlPath = urlObj.pathname + urlObj.search;
        urlMatches = currentUrl.includes(renderedUrl) || urlPath.includes(renderedUrl);
      } catch (e) {
        // If URL parsing fails, just check the string
        urlMatches = currentUrl.includes(renderedUrl);
      }
      if (urlMatches) break;
    }

    // Final check
    currentUrl = page.url();
    try {
      const urlObj = new URL(currentUrl);
      const urlPath = urlObj.pathname + urlObj.search;
      const urlPathDecoded = decodeURIComponent(urlPath);
      const renderedUrlDecoded = decodeURIComponent(renderedUrl);
      // Check both encoded and decoded versions
      const matches = currentUrl.includes(renderedUrl)
        || urlPath.includes(renderedUrl)
        || urlPathDecoded.includes(renderedUrlDecoded)
        || currentUrl.includes(renderedUrlDecoded)
        || urlPath.includes(renderedUrlDecoded); // Also check if decoded expected is in encoded path
      if (!matches) {
        throw new Error(`Expected URL to contain "${renderedUrl}", but got "${currentUrl}" (path: "${urlPath}", decoded path: "${urlPathDecoded}")`);
      }
    } catch (e: any) {
      // If URL parsing fails or assertion fails, check the string (both encoded and decoded)
      if (e.message && e.message.includes('Expected URL')) {
        throw e; // Re-throw our custom error
      }
      const decodedCurrent = decodeURIComponent(currentUrl);
      const decodedExpected = decodeURIComponent(renderedUrl);
      const matches = currentUrl.includes(renderedUrl) || decodedCurrent.includes(decodedExpected);
      if (!matches) {
        throw new Error(`Expected URL to contain "${renderedUrl}", but got "${currentUrl}"`);
      }
    }
  }
);

Then(
  'I expect the url to not contain {string}',
  async ({ page, testData }, expectedUrl: string) => {
    const renderedUrl = renderTemplate(expectedUrl, testData);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain(renderedUrl);
  }
);

Then(
  'I expect that the title is {string}',
  async ({ page }, expectedTitle: string) => {
    const title = await page.title();
    expect(title).toBe(expectedTitle);
  }
);

Then(
  'I expect HTML contains:',
  async ({ page }, docString: string) => {
    const source = await page.content();
    expect(source).toContain(docString.trim());
  }
);

Then(
  'I expect that element {string} contain value {string}',
  async ({ page, testData }, selector: string, expected: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const renderedExpected = renderTemplate(expected, testData);
    // Extract index before passing to getLocatorQuery (it may strip the index)
    const nthMatch = renderedSelector.match(/\[(\d+)\]$/);
    const selectorWithoutIndex = renderedSelector.replace(/\[(\d+)\]$/, '');
    const locator = getLocatorQuery(page, selectorWithoutIndex);
    if (nthMatch) {
      const index = parseInt(nthMatch[1], 10) - 1; // Convert 1-based to 0-based
      const targetLocator = locator.nth(index);
      // Wait for element to be visible and attached before checking value
      await targetLocator.waitFor({ state: 'visible', timeout: 10000 });
      await targetLocator.waitFor({ state: 'attached', timeout: 5000 });
      await expect(targetLocator).toHaveValue(renderedExpected);
    } else {
      await expect(locator.first()).toHaveValue(renderedExpected);
    }
  }
);

Then(
  'I wait on element {string}',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await locator.first().waitFor({ state: 'visible', timeout: 30000 });
  }
);

Then(
  'I expect that element {string} contain text {string}',
  async ({ page, testData }, selector: string, expected: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const renderedExpected = renderTemplate(expected, testData);
    const locator = getLocatorQuery(page, renderedSelector);
    // Wait for element to be visible first (especially for error messages that appear after actions)
    // Use longer timeout for error messages and title elements that may take time to appear
    let timeout = 10000;
    if (selector.includes('error-message')) {
      timeout = 15000;
    } else if (selector.includes('#title') || selector.includes('title')) {
      timeout = 20000; // Title elements may take longer to render
    }
    await locator.first().waitFor({ state: 'visible', timeout });
    await expect(locator.first()).toContainText(renderedExpected);
  }
);

Then(
  'I expect that the element {string} to have attribute {string}',
  async ({ page, testData }, selector: string, attributeName: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const locator = getLocatorQuery(page, renderedSelector);
    // Wait for element to be visible first
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(locator.first()).toHaveAttribute(attributeName);
  }
);

Then(
  'I expect that the element {string} to not have attribute {string}',
  async ({ page, testData }, selector: string, attributeName: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const locator = getLocatorQuery(page, renderedSelector);
    await expect(locator.first()).not.toHaveAttribute(attributeName);
  }
);

When(
  'I wait on element {string} to be {condition}',
  async ({ page, testData }, selector: string, condition: StepCondition) => {
    const renderedSelector = renderTemplate(selector, testData);
    const locator = getLocatorQuery(page, renderedSelector);
    await assertCondition(locator, condition);
  }
);

/**
 * Waits for an element to reach a specific state.
 *
 * @param {object} context - The test context object.
 * @param {number} timeoutInSeconds - The maximum time to wait.
 * @param {AriaRole | 'element'} role - The ARIA role of the element or 'element' for generic locators.
 * @param {ElementAttribute} attribute - The attribute to locate the element by ('name' | 'locator' | 'label').
 * @param {string} value - The value of the attribute.
 * @param {StepCondition} assert - The state to wait for (e.g., 'visible', 'enabled', 'checked').
 *
 * @example
 * ```gherkin
 * When I wait 5 seconds for the button with name "Submit" to be visible
 * ```
 *
 * @example
 * ```gherkin
 * When I wait 10 seconds for the element with locator "##flora-GridLayout" to be visible
 * ```
 */
When(
  'I wait {int} seconds for the {role} with {attribute} {string} to be {condition}',
  async (
    { page, testData }: { page: Page; testData: TestStore },
    timeoutInSeconds: number,
    role: AriaRole,
    attribute: ElementAttribute,
    value: string,
    condition: StepCondition,
  ) => {
    const locator = getLocator({
      page,
      role: role as AriaRole | 'element',
      attribute,
      value: testData.renderTemplate(value),
    });
    await assertCondition(locator, condition, undefined, { timeout: timeoutInSeconds * 1000 });
  },
);

/**
 * Waits for an element to not be displayed (hidden) with a specified timeout.
 *
 * @param {object} context - The test context object.
 * @param {number} timeoutInSeconds - The maximum time to wait.
 * @param {AriaRole | 'element'} role - The ARIA role of the element or 'element' for generic locators.
 * @param {ElementAttribute} attribute - The attribute to locate the element by ('name' | 'locator' | 'label').
 * @param {string} value - The value of the attribute.
 *
 * @example
 * ```gherkin
 * When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to not be displayed
 * ```
 */
When(
  'I wait {int} seconds for the {role} with {attribute} {string} to not be displayed',
  async (
    { page, testData }: { page: Page; testData: TestStore },
    timeoutInSeconds: number,
    role: AriaRole,
    attribute: ElementAttribute,
    value: string,
  ) => {
    const locator = getLocator({
      page,
      role: role as AriaRole | 'element',
      attribute,
      value: testData.renderTemplate(value),
    });
    await locator.first().waitFor({ state: 'hidden', timeout: timeoutInSeconds * 1000 });
  },
);

/**
 * Waits for an element to reach a specific state with an additional timeout in milliseconds.
 * Note: The timeout in milliseconds overrides the timeout in seconds if provided.
 *
 * @param {object} context - The test context object.
 * @param {number} timeoutInSeconds - The maximum time to wait in seconds.
 * @param {AriaRole | 'element'} role - The ARIA role of the element or 'element' for generic locators.
 * @param {ElementAttribute} attribute - The attribute to locate the element by ('name' | 'locator' | 'label').
 * @param {string} value - The value of the attribute.
 * @param {number} timeoutMs - Additional timeout in milliseconds (overrides seconds timeout).
 * @param {StepCondition} assert - The state to wait for (e.g., 'visible', 'enabled', 'checked').
 *
 * @example
 * ```gherkin
 * When I wait 30 seconds for the element with locator "[data-test='table-row-Message']" for 10000ms to be visible
 * ```
 */
When(
  'I wait {int} seconds for the {role} with {attribute} {string} for {ordinal} to be {condition}',
  async (
    { page, testData }: { page: Page; testData: TestStore },
    timeoutInSeconds: number,
    role: AriaRole,
    attribute: ElementAttribute,
    value: string,
    ordinalValue: number, // This is actually milliseconds (e.g., "10000ms"), but Playwright-BDD recognizes it as ordinal
    condition: StepCondition,
  ) => {
    const locator = getLocator({
      page,
      role: role as AriaRole | 'element',
      attribute,
      value: testData.renderTemplate(value),
    });
    // Extract milliseconds from ordinal value
    // Playwright-BDD's ordinal transformer extracts number and subtracts 1, so we need to add 1 back
    // But for "10000ms", the transformer extracts 10000 and subtracts 1 = 9999
    // So we need to add 1 to get the correct milliseconds value
    const timeoutMs = ordinalValue + 1;
    await assertCondition(locator, condition, undefined, { timeout: timeoutMs });
  },
);
