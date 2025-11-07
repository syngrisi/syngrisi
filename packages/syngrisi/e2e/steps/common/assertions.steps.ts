import type { Page } from '@playwright/test';
import { Then, When } from '@fixtures';
import { expect } from '@playwright/test';
import type { ElementTarget, ExpectationCondition, StepCondition } from '@params';
import { getLabelLocator, getLocatorQuery, getRoleLocator } from '@helpers/locators';
import { assertCondition } from '@helpers/assertions';
import { AriaRole } from '@helpers/types';
import { renderTemplate } from '@helpers/template';

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
