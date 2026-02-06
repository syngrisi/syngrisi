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

async function stabilizeForSelector(page: Page, selector: string): Promise<void> {
  const normalized = selector.toLowerCase();

  if (
    normalized.includes('navbar-group-by')
    || normalized.includes("data-test='navbar-group-by'")
    || normalized.includes('data-test="navbar-group-by"')
  ) {
    await page.waitForSelector('[data-test-navbar-ready="true"]', { timeout: 5000 }).catch(() => undefined);
  }

  if (
    normalized.includes('data-check-header-name')
    || normalized.includes("data-check='toolbar'")
    || normalized.includes('data-check="toolbar"')
  ) {
    await page.locator("[data-check='toolbar']").first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    await page.locator('[data-check-header-name]').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
  }

  if (
    normalized.includes('data-table-test-name')
    || normalized.includes('data-table-check-name')
    || normalized.includes('data-row-name')
    || normalized.includes('table-row')
  ) {
    const refreshButton = page.locator('[data-test="table-refresh-icon"]').first();
    if (await refreshButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await refreshButton.click().catch(() => undefined);
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => undefined);
      await page.waitForTimeout(300);
    }
  }

  if (
    normalized.includes('filter-main-group')
    || normalized.includes('table-filter')
    || normalized.includes('table-filter-column-name')
    || normalized.includes('table-filter-operator')
    || normalized.includes('table-filter-value')
  ) {
    await page.waitForSelector('[data-test="filter-main-group"]', { timeout: 5000 }).catch(() => undefined);
  }

  if (normalized.includes('rca-') || normalized.includes('rca_') || normalized.includes("data-test='rca") || normalized.includes('data-test="rca')) {
    await page.locator("[data-check='toolbar']").first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
    await page.locator('[data-check-header-name]').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
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
    try {
      await assertCondition(locator, condition);
    } catch (error) {
      if (target === 'locator') {
        await stabilizeForSelector(page, rawValue);
      }
      await assertCondition(locator, condition);
    }
  }
);

/**
 * Step definition: `Then the element with {target} {string} should not be {condition}`
 *
 * @param target - {@link ElementTarget} (`'label' | 'locator'`).
 * @param rawValue - Label text or locator query that identifies the element.
 * @param condition - {@link StepCondition} to evaluate against the resolved locator.
 *
 * @example
 * ```gherkin
 * Then the element with locator "[data-test='modal']" should not be visible
 * ```
 */
Then(
  'the element with {target} {string} should not be {condition}',
  async ({ page }, target: ElementTarget, rawValue: string, condition: StepCondition) => {
    const locator = locatorFromTarget(page, target, rawValue);
    // Map "not be {condition}" to corresponding negative conditions
    const negativeConditionMap: Record<string, StepCondition> = {
      visible: 'hidden',
      enabled: 'disabled',
      checked: 'unchecked',
      attached: 'detached',
      present: 'absent',
      focused: 'blurred',
      editable: 'readonly',
      empty: 'empty', // empty doesn't have a direct negative, but we can check for non-empty
    };

    const negativeCondition = negativeConditionMap[condition];
    if (negativeCondition) {
      await assertCondition(locator, negativeCondition);
    } else {
      // Fallback: use direct negation for conditions not in the map
      if (condition === 'visible') {
        await expect(locator.first()).not.toBeVisible();
      } else if (condition === 'enabled') {
        await expect(locator.first()).toBeDisabled();
      } else if (condition === 'checked') {
        await expect(locator.first()).not.toBeChecked();
      } else {
        throw new Error(`Unsupported "not be" condition: ${condition}`);
      }
    }
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
    try {
      await assertCondition(locator, condition, undefined, { timeout: seconds * 1000 });
    } catch (error) {
      if (target === 'locator') {
        await stabilizeForSelector(page, rawValue);
      }
      await assertCondition(locator, condition, undefined, { timeout: seconds * 1000 });
    }
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
    try {
      await assertCondition(locator, condition);
    } catch (error) {
      if (target === 'locator') {
        await stabilizeForSelector(page, rawValue);
      }
      await assertCondition(locator, condition);
    }
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

    if (target === 'locator') {
      // Extract index before passing to getLocatorQuery (it may strip the index)
      const nthMatch = renderedTarget.match(/(\d+)$/);
      const selectorWithoutIndex = renderedTarget.replace(/(\d+)$/, '');
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
    } else {
      const locator = locatorFromTarget(page, target, renderedTarget);
      await assertCondition(locator, 'has value', renderedExpected);
    }
  }
);

Then(
  'the element with {target} {string} should contain value {string}',
  async ({ page, testData }, target: ElementTarget, rawValue: string, expected: string) => {
    const renderedTarget = testData ? renderTemplate(rawValue, testData) : rawValue;
    const renderedExpected = testData ? renderTemplate(expected, testData) : expected;
    const locator = locatorFromTarget(page, target, renderedTarget);
    // Wait for element to be visible
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    const value = await locator.inputValue();
    expect(value).toContain(renderedExpected);
  }
);

/**
 * Step definition: `Then the element with {target} {string} should have contains text {string}`
 *
 * Uses checkElementContainsText for locator targets to support polling and date placeholders.
 * For label targets, uses assertCondition for simpler behavior.
 *
 * @param target - {@link ElementTarget} representing either a label lookup or raw locator.
 * @param rawValue - Label text or locator query.
 * @param expected - Partial text expected within the resolved element.
 *
 * @example
 * ```gherkin
 * Then the element with label "Status" should have contains text "Pending"
 * Then the element with locator "[data-test='status']" should have contains text "Pending"
 * ```
 */
Then(
  'the element with {target} {string} should have contains text {string}',
  async ({ page, testData }, target: ElementTarget, rawValue: string, expected: string) => {
    if (target === 'locator') {
      // Use checkElementContainsText for locator targets to support polling and date placeholders
      await expect(async () => {
        await checkElementContainsText(page, rawValue, expected, testData);
      }).toPass({ timeout: 10000 });
    } else {
      // Use assertCondition for label targets
      const locator = locatorFromTarget(page, target, rawValue);
      await assertCondition(locator, 'contains text', expected);
    }
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

Then(
  'the element with {target} {string} should not have attribute {string}',
  async ({ page }, target: ElementTarget, rawValue: string, attributeName: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await expect(locator.first()).not.toHaveAttribute(attributeName);
  }
);

Then(
  'the element with {target} {string} should not have attribute {string} {string}',
  async ({ page }, target: ElementTarget, rawValue: string, attributeName: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await expect(locator.first()).not.toHaveAttribute(attributeName, expected, { timeout: 15000 });
  }
);

Then(
  'the element with {target} {string} should have attribute {string} {string}',
  async ({ page }, target: ElementTarget, rawValue: string, attributeName: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await expect(locator.first()).toHaveAttribute(attributeName, expected, { timeout: 15000 });
  }
);

Then(
  'the element with {target} {string} should have has attribute {string}',
  async ({ page }, target: ElementTarget, rawValue: string, attributeValue: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, 'has attribute', attributeValue);
  }
);

Then(
  'the element with {target} {string} should have contains HTML {string}',
  async ({ page }, target: ElementTarget, rawValue: string, expected: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, 'contains HTML', expected);
  }
);

Then(
  'the element with {target} {string} should have has class {string}',
  async ({ page }, target: ElementTarget, rawValue: string, className: string) => {
    const locator = locatorFromTarget(page, target, rawValue);
    await assertCondition(locator, 'has class', className);
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
  testData?: TestStore
) {
  const renderedExpected = testData ? renderTemplate(expected, testData) : expected;
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
  // Optimized: exponential backoff starting at 100ms, max 30s total (was 90s with 1s intervals)
  if (selector.includes('table-row-Status') && expected !== 'Running') {
    const maxWaitMs = 30000; // 30 seconds max (reduced from 90s)
    const startTime = Date.now();
    let interval = 100; // Start with 100ms
    let attempt = 0;
    while (Date.now() - startTime < maxWaitMs) {
      const text = await locator.first().textContent();
      const trimmedText = text?.trim() || '';
      if (trimmedText === expected || trimmedText.toLowerCase() === expected.toLowerCase()) {
        logger.info(`Test status changed to "${expected}" after ${attempt + 1} attempts (${Date.now() - startTime}ms)`);
        break;
      }
      await page.waitForTimeout(interval);
      interval = Math.min(interval * 1.5, 1000); // Exponential backoff, max 1s
      attempt++;
    }
  }
  // Handle placeholders like <YYYY-MM-DD> or <HH:mm:ss> - replace with regex pattern for date/time matching
  let expectedPattern = renderedExpected;
  if (renderedExpected.includes('<YYYY-MM-DD>')) {
    expectedPattern = renderedExpected.replace('<YYYY-MM-DD>', '\\d{4}-\\d{2}-\\d{2}(?: \\d{2}:\\d{2}:\\d{2})?');
    const actualText = await locator.first().textContent();
    const regex = new RegExp(expectedPattern);
    if (!regex.test(actualText || '')) {
      throw new Error(`Expected text to match pattern "${expectedPattern}", but got "${actualText}"`);
    }
    return;
  }
  if (renderedExpected.includes('<HH:mm:ss>')) {
    expectedPattern = renderedExpected.replace('<HH:mm:ss>', '\\d{2}:\\d{2}:\\d{2}');
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
      // Optimized: Single evaluate call instead of 3 separate calls, limited DOM scan
      const debugInfo = await page.evaluate((args) => {
        const { sel, needle } = args;
        // Get [data-check] elements (limited scope)
        const dataCheckElements = Array.from(document.querySelectorAll('[data-check]')).slice(0, 20).map((el) => ({
          value: el.getAttribute('data-check'),
          text: (el.textContent || '').slice(0, 100),
        }));
        // Get target element
        const targetNode = document.querySelector(sel);
        const targetOuterHtml = targetNode ? targetNode.outerHTML.slice(0, 500) : null;
        // Optimized text search: only check elements with data-test or data-check attributes
        const textMatches = Array.from(document.querySelectorAll('[data-test], [data-check], td, span'))
          .filter((el) => (el.textContent || '').includes(needle))
          .slice(0, 5)
          .map((el) => ({
            tag: el.tagName,
            text: (el.textContent || '').slice(0, 100),
            classes: (el as HTMLElement).className?.slice?.(0, 50) || '',
            dataCheck: el.getAttribute('data-check'),
          }));
        return { dataCheckElements, targetOuterHtml, textMatches };
      }, { sel: selector, needle: renderedExpected });

      logger.info(`Available [data-check] elements: ${JSON.stringify(debugInfo.dataCheckElements)}; locator count=${matchCount}`);
      logger.info(`OuterHTML for selector "${selector}": ${debugInfo.targetOuterHtml}`);
      logger.info(`Elements containing text "${renderedExpected}": ${JSON.stringify(debugInfo.textMatches)}`);
    }
    throw new Error(`Expected at least one element for selector "${selector}", but none found`);
  }
  if (!normalizedTexts.some((text) => text.includes(renderedExpected))) {
    throw new Error(`Expected any element matching "${selector}" to contain "${renderedExpected}", but texts were ${JSON.stringify(normalizedTexts)}`);
  }
}



Then(
  'the element {string} has attribute {string} {string}',
  async ({ page }, selector: string, attributeName: string, expected: string) => {
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
  'I wait on element {string} to not be displayed',
  async ({ page }, selector: string) => {
    await page.waitForFunction(
      (sel) => {
        const getNodes = () => {
          try {
            return Array.from(document.querySelectorAll(sel));
          } catch {
            const iterator = document.evaluate(
              sel,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            const xpathNodes: Array<Node> = [];
            for (let i = 0; i < iterator.snapshotLength; i += 1) {
              const node = iterator.snapshotItem(i);
              if (node) xpathNodes.push(node);
            }
            return xpathNodes;
          }
        };
        const nodes = getNodes();
        return nodes.every((node) => {
          if (!(node instanceof HTMLElement)) return true;
          const style = window.getComputedStyle(node);
          return (
            style.display === 'none'
            || style.visibility === 'hidden'
            || node.offsetParent === null
            || node.clientWidth === 0
            || node.clientHeight === 0
          );
        });
      },
      selector,
      { timeout: 60000 }
    );
  }
);

When(
  'I wait on element {string} to not exist',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    // Reduced from 30s to 15s - elements typically detach quickly
    await locator.first().waitFor({ state: 'detached', timeout: 15000 });
  }
);

Then(
  'the element {string} does not exist',
  async ({ page }, selector: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toHaveCount(0);
  }
);


Then('the title is {string}', async ({ page }, expectedTitle: string) => {
  await expect(page).toHaveTitle(expectedTitle, { timeout: 30000 });
});

Then('the title contains {string}', async ({ page }, expectedTitle: string) => {
  // Escape regex characters for expectedTitle
  const escapedTitle = expectedTitle.replace(/[.*+?^${}()|[\\]/g, '\\$&');
  await expect(page).toHaveTitle(new RegExp(escapedTitle), { timeout: 30000 });
});

Then('the css attribute {string} from element {string} is {string}', async ({ page, testData }, cssProperty: string, selector: string, expected: string) => {
  const renderedSelector = renderTemplate(selector, testData);
  const renderedExpected = renderTemplate(expected, testData);
  const locator = getLocatorQuery(page, renderedSelector);

  await expect(async () => {
    // Element can be briefly detached during rerenders; retry until visible.
    if (await locator.count() === 0) {
      throw new Error(`Element not found for selector "${renderedSelector}"`);
    }

    await locator.first().waitFor({ state: 'visible', timeout: 5000 });

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
        // Replace with the actual content of the file, then append the new step
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

    // Handle px values with tolerance
    const expectedTrimmed = renderedExpected.trim();
    const pxMatch = expectedTrimmed.match(/^([\d.]+)px$/);
    const actualPxMatch = actualValue.match(/^([\d.]+)px$/);

    if (pxMatch && actualPxMatch) {
      const expectedPx = parseFloat(pxMatch[1]);
      const actualPx = parseFloat(actualPxMatch[1]);
      const tolerance = 10;
      const diff = Math.abs(expectedPx - actualPx);
      expect(diff).toBeLessThanOrEqual(tolerance);
    } else {
      // Use exact comparison as WebdriverIO does with toEqual
      expect(actualValue).toBe(expectedTrimmed);
    }
  }).toPass({ timeout: 30000 });
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
  'the element {string} does appear exactly {string} times',
  async ({ page }, selector: string, expectedCount: string) => {
    const locator = getLocatorQuery(page, selector);
    const count = parseInt(expectedCount, 10);
    await expect(locator).toHaveCount(count, { timeout: 30000 });
  }
);


Then(
  'the element {string} contains HTML {string}',
  async ({ page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const html = await locator.first().innerHTML();
    await expect(html).toContain(expected);
  }
);

Then(
  'the element {string} has the class {string}',
  async ({ page }, selector: string, className: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).toHaveClass(new RegExp(className));
  }
);

Then(
  'the element {string} does not have the class {string}',
  async ({ page }, selector: string, className: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).not.toHaveClass(new RegExp(className));
  }
);

Then(
  'the element {string} does not have attribute {string} {string}',
  async ({ page }, selector: string, attributeName: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    await expect(locator.first()).not.toHaveAttribute(attributeName, expected);
  }
);


Then(
  'the current url does not contain {string}',
  async ({ page, testData }, expectedUrl: string) => {
    const renderedUrl = renderTemplate(expectedUrl, testData);
    const currentUrl = page.url();
    expect(currentUrl).not.toContain(renderedUrl);
  }
);


Then(
  'the HTML contains:',
  async ({ page }, docString: string) => {
    const source = await page.content();
    expect(source).toContain(docString.trim());
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
  'the element {string} has attribute {string}',
  async ({ page, testData }, selector: string, attributeName: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const locator = getLocatorQuery(page, renderedSelector);
    // Wait for element to be visible first
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(locator.first()).toHaveAttribute(attributeName);
  }
);

Then(
  'the element {string} does not have attribute {string}',
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
    try {
      await assertCondition(locator, condition);
    } catch (error) {
      await stabilizeForSelector(page, renderedSelector);
      await assertCondition(locator, condition);
    }
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
    try {
      await assertCondition(locator, condition, undefined, { timeout: timeoutInSeconds * 1000 });
    } catch (error) {
      if (attribute === 'locator') {
        await stabilizeForSelector(page, testData.renderTemplate(value));
      }
      await assertCondition(locator, condition, undefined, { timeout: timeoutInSeconds * 1000 });
    }
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

When(
  'I wait {int} seconds for the {role} with {attribute} {string} to not exist',
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
    await locator.first().waitFor({ state: 'detached', timeout: timeoutInSeconds * 1000 });
  },
);

When(
  'I wait {int} seconds for the {role} with {attribute} {string} to exist',
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
    await locator.first().waitFor({ state: 'attached', timeout: timeoutInSeconds * 1000 });
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

/**
 * Step definition: `Then the {role} {string} should not be {condition}`
 *
 * Verifies that an element with specified role and name does NOT satisfy the condition.
 *
 * @param role - {@link AriaRole} derived from the `{role}` parameter type.
 * @param name - Accessible name for the element.
 * @param condition - {@link StepCondition} value (e.g. `'visible'`, `'enabled'`).
 *
 * @example
 * ```gherkin
 * Then the button "Baselines" should not be visible
 * ```
 */
Then(
  'the {role} {string} should not be {condition}',
  async ({ page, testData }, role: AriaRole, name: string, condition: StepCondition) => {
    const renderedName = renderTemplate(name, testData);
    const locator = getRoleLocator(page, role, renderedName);
    // Invert the condition check
    if (condition === 'visible') {
      await expect(locator).not.toBeVisible();
    } else if (condition === 'enabled') {
      await expect(locator).not.toBeEnabled();
    } else if (condition === 'checked') {
      await expect(locator).not.toBeChecked();
    } else if (condition === 'disabled') {
      await expect(locator).not.toBeDisabled();
    } else {
      throw new Error(`Unsupported negated condition: ${condition}`);
    }
  }
);

/**
 * Step definition: `Then the text {string} should be {condition}`
 *
 * Verifies that text is visible on the page.
 *
 * @param text - The text to search for on the page.
 * @param condition - {@link StepCondition} value (e.g. `'visible'`).
 *
 * @example
 * ```gherkin
 * Then the text "Welcome" should be visible
 * ```
 */
Then(
  'the text {string} should be {condition}',
  async ({ page, testData }, text: string, condition: StepCondition) => {
    const renderedText = renderTemplate(text, testData);
    const locator = page.getByText(renderedText, { exact: false });
    await assertCondition(locator, condition);
  }
);

/**
 * Step definition: `Then the text {string} should not be {condition}`
 *
 * Verifies that text is NOT visible on the page.
 *
 * @param text - The text to search for on the page.
 * @param condition - {@link StepCondition} value (e.g. `'visible'`).
 *
 * @example
 * ```gherkin
 * Then the text "Error" should not be visible
 * ```
 */
Then(
  'the text {string} should not be {condition}',
  async ({ page, testData }, text: string, condition: StepCondition) => {
    const renderedText = renderTemplate(text, testData);
    const locator = page.getByText(renderedText, { exact: false });
    // Invert the condition check
    if (condition === 'visible') {
      await expect(locator).not.toBeVisible();
    } else if (condition === 'enabled') {
      await expect(locator).not.toBeEnabled();
    } else {
      throw new Error(`Unsupported negated condition for text: ${condition}`);
    }
  }
);

/**
 * Step definition: `Then the cookie {string} should be present`
 *
 * Verifies that a cookie with the given name is present in the browser context.
 *
 * @param name - The name of the cookie to check.
 *
 * @example
 * ```gherkin
 * Then the cookie "my_session_id" should be present
 * ```
 */
Then(
  'the cookie {string} should be present',
  async ({ page }, name: string) => {
    const cookies = await page.context().cookies();
    const cookie = cookies.find((c) => c.name === name);
    expect(cookie).toBeDefined();
  }
);

/**
 * Step definition: `Then the cookie {string} should not be present`
 *
 * Verifies that a cookie with the given name is NOT present in the browser context.
 *
 * @param name - The name of the cookie to check.
 *
 * @example
 * ```gherkin
 * Then the cookie "my_session_id" should not be present
 * ```
 */
Then(
  'the cookie {string} should not be present',
  async ({ page }, name: string) => {
    const cookies = await page.context().cookies();
    const cookie = cookies.find((c) => c.name === name);
    expect(cookie).toBeUndefined();
  }
);

/**
 * Step definition: `Then the cookie {string} should have value {string}`
 *
 * Verifies that a cookie with the given name is present and its value matches the expected value.
 *
 * @param name - The name of the cookie to check.
 * @param expectedValue - The expected value of the cookie.
 *
 * @example
 * ```gherkin
 * Then the cookie "my_session_id" should have value "abc-123"
 * ```
 */
Then(
  'the cookie {string} should have value {string}',
  async ({ page }, name: string, expectedValue: string) => {
    const cookies = await page.context().cookies();
    const cookie = cookies.find((c) => c.name === name);
    expect(cookie).toBeDefined();
    expect(cookie?.value).toEqual(expectedValue);
  }
);

/**
 * Step definition: `Then the element {string} should have at least {int} items within {int} seconds`
 *
 * Polls for minimum item count with timeout. Use for pagination/infinite scroll scenarios.
 *
 * @param selector - CSS selector for items
 * @param minCount - Minimum expected count
 * @param seconds - Timeout in seconds
 *
 * @example
 * ```gherkin
 * Then the element "[data-test*='navbar_item_']" should have at least 21 items within 10 seconds
 * ```
 */
Then(
  'the element {string} should have at least {int} items within {int} seconds',
  async ({ page }, selector: string, minCount: number, seconds: number) => {
    const locator = getLocatorQuery(page, selector);

    await expect.poll(
      async () => await locator.count(),
      {
        message: `Waiting for at least ${minCount} items matching "${selector}"`,
        timeout: seconds * 1000
      }
    ).toBeGreaterThanOrEqual(minCount);
  }
);

/**
 * Step definition: `Then the element {string} should have exactly {int} items within {int} seconds`
 *
 * Polls for exact item count with timeout.
 *
 * @param selector - CSS selector for items
 * @param exactCount - Exact expected count
 * @param seconds - Timeout in seconds
 *
 * @example
 * ```gherkin
 * Then the element "[data-test*='navbar_item_']" should have exactly 22 items within 10 seconds
 * ```
 */
Then(
  'the element {string} should have exactly {int} items within {int} seconds',
  async ({ page }, selector: string, exactCount: number, seconds: number) => {
    const locator = getLocatorQuery(page, selector);

    await expect.poll(
      async () => await locator.count(),
      {
        message: `Waiting for exactly ${exactCount} items matching "${selector}"`,
        timeout: seconds * 1000
      }
    ).toBe(exactCount);
  }
);

/**
 * Step definition: `Then the element {string} should have exactly {int} items within {int} seconds with refresh`
 *
 * Polls for exact item count with timeout, clicking refresh button between attempts.
 * Useful when data is created via API and table needs to be refreshed to show new items.
 *
 * @param selector - CSS selector for items
 * @param exactCount - Exact expected count
 * @param seconds - Timeout in seconds
 *
 * @example
 * ```gherkin
 * Then the element "//div[contains(text(), 'User test')]" should have exactly 5 items within 30 seconds with refresh
 * ```
 */
Then(
  'the element {string} should have exactly {int} items within {int} seconds with refresh',
  async ({ page }, selector: string, exactCount: number, seconds: number) => {
    const locator = getLocatorQuery(page, selector);
    // Use the table refresh icon which has the badge for new items
    const refreshButton = page.locator('[data-test="table-refresh-icon"]');
    const newItemsBadge = page.locator('[data-test="table-refresh-icon-badge"]');
    const startTime = Date.now();
    const timeoutMs = seconds * 1000;
    const pollInterval = 1000;
    let lastCount = 0;

    while (Date.now() - startTime < timeoutMs) {
      lastCount = await locator.count();

      if (lastCount === exactCount) {
        return;
      }

      // Click refresh to get new data - always click if visible, regardless of badge
      const refreshVisible = await refreshButton.isVisible({ timeout: 500 }).catch(() => false);

      if (refreshVisible) {
        // Check for badge before clicking
        const hasBadge = await newItemsBadge.isVisible({ timeout: 200 }).catch(() => false);

        await refreshButton.click();

        // Wait for the refresh to complete - badge should disappear or stay gone
        await page.waitForTimeout(500);

        // If there was a badge, give extra time for data to load
        if (hasBadge) {
          await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });
          // Check again immediately after refresh
          lastCount = await locator.count();
          if (lastCount === exactCount) {
            return;
          }
        }
      }

      await page.waitForTimeout(pollInterval);
    }

    // Final attempt: one more refresh and check
    const refreshVisible = await refreshButton.isVisible({ timeout: 500 }).catch(() => false);
    if (refreshVisible) {
      await refreshButton.click();
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => { });
      await page.waitForTimeout(500);
    }

    lastCount = await locator.count();
    expect(lastCount, `Waiting for exactly ${exactCount} items matching "${selector}"`).toBe(exactCount);
  }
);
