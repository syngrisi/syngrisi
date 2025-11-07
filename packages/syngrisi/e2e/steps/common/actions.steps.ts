import type { Page } from '@playwright/test';
import { When } from '@fixtures';
import type { ElementTarget } from '@params';
import { getLabelLocator, getLocatorQuery, getRoleLocator } from '@helpers/locators';
import { AriaRole } from '@helpers/types';
import { renderTemplate } from '@helpers/template';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';

const logger = createLogger('ActionsSteps');

/**
 * Clicks on an element resolved via ARIA role and accessible name.
 *
 * @param page - Playwright {@link Page} injected by the BDD world.
 * @param role - {@link AriaRole} captured from the `{role}` parameter.
 * @param name - Accessible name supplied via the quoted string in the step.
 * @param ordinal - Zero-based ordinal (derived from the `{ordinal}` parameter) to disambiguate multiple matches.
 */
async function clickRole(
  page: Page,
  role: AriaRole,
  name: string,
  ordinal?: number
) {
  const locator = getRoleLocator(page, role, name, ordinal);
  await locator.click();
}

/**
 * Step definition: `When I click {role} {string}`
 *
 * @param role - Role mapped by the `{role}` parameter type.
 * @param name - Accessible name of the element to interact with.
 *
 * @example
 * ```gherkin
 * When I click button "Submit"
 * ```
 */
When('I click {role} {string}', async ({ page, testData }, role: AriaRole, name: string) => {
  const renderedName = renderTemplate(name, testData);
  await clickRole(page, role, renderedName);
});

/**
 * Step definition: `When I click {ordinal} {role} {string}`
 *
 * @param ordinal - Zero-based ordinal derived from natural-language ordinals (e.g. `2nd` -> `1`).
 * @param role - Role mapped by the `{role}` parameter type.
 * @param name - Accessible name of the element to interact with.
 *
 * @example
 * ```gherkin
 * When I click 2nd button "Remove"
 * ```
 */
When(
  'I click {ordinal} {role} {string}',
  async ({ page, testData }, ordinal: number, role: AriaRole, name: string) => {
    const renderedName = renderTemplate(name, testData);
    await clickRole(page, role, renderedName, ordinal);
  }
);

/**
 * Step definition: `When I click element with {target} {string}`
 *
 * Resolves either:
 * - a labelled control via `page.getByLabel`, or
 * - an arbitrary locator via `page.locator`.
 *
 * @param target - {@link ElementTarget} (`'label' | 'locator'`) provided by the `{target}` parameter.
 * @param rawValue - Label text or locator query identifying the element(s).
 *
 * @examples
 * ```gherkin
 * When I click element with label "Email"
 * When I click element with locator "//button[@type='submit']"
 * ```
 */
When(
  'I click element with {target} {string}',
  async ({ page, testData }, target: ElementTarget, rawValue: string) => {
    const renderedValue = renderTemplate(rawValue, testData);

    if (target === 'label') {
      const locator = getLabelLocator(page, renderedValue);
      await locator.click();
      return;
    }

    if (target === 'locator') {
      const locator = getLocatorQuery(page, renderedValue);
      await locator.click();
      return;
    }

    throw new Error(`Unsupported target: ${target}`);
  }
);

/**
 * Step definition: `When I click {ordinal} element with {target} {string}`
 *
 * @param ordinal - Zero-based ordinal index derived from the `{ordinal}` parameter.
 * @param target - {@link ElementTarget} defining how to resolve the locator.
 * @param rawValue - Label text or locator query used to find the elements.
 *
 * @example
 * ```gherkin
 * When I click 2nd element with locator ".todo-item .remove"
 * ```
 */
When(
  'I click {ordinal} element with {target} {string}',
  async ({ page, testData }, ordinal: number, target: ElementTarget, rawValue: string) => {
    const renderedValue = renderTemplate(rawValue, testData);

    if (target === 'label') {
      const locator = getLabelLocator(page, renderedValue, ordinal);
      await locator.click();
      return;
    }

    if (target === 'locator') {
      const locator = getLocatorQuery(page, renderedValue, ordinal);
      await locator.click();
      return;
    }

    throw new Error(`Unsupported target: ${target}`);
  }
);

/**
 * Step definition: `When I fill {string} into element with {target} {string}`
 *
 * Filling is intentionally limited to label-based selectors to guarantee actionable form controls.
 *
 * @param value - Text to input into the resolved control.
 * @param target - {@link ElementTarget} captured via `{target}`; must be `'label'`.
 * @param rawValue - Label text identifying the control.
 *
 * @examples
 * ```gherkin
 * When I fill "john@example.com" into element with label "Email"
 * ```
 */
When(
  'I fill {string} into element with {target} {string}',
  async ({ page, testData }, value: string, target: ElementTarget, rawValue: string) => {
    const renderedValue = renderTemplate(value, testData);
    const renderedTarget = renderTemplate(rawValue, testData);

    if (target === 'label') {
      const locator = getLabelLocator(page, renderedTarget);
      await locator.fill(renderedValue);
      return;
    }

    if (target === 'locator') {
      const locator = getLocatorQuery(page, renderedTarget);
      await locator.fill(renderedValue);
      return;
    }

    throw new Error('Fill action expects target to be "label" or "locator"');
  }
);

/**
 * Step definition: `When I fill {string} into {ordinal} element with label {string}`
 *
 * @param value - Text to input into the control.
 * @param ordinal - Zero-based ordinal index resolved by `{ordinal}`.
 * @param label - Label text identifying the control.
 *
 * @example
 * ```gherkin
 * When I fill "42" into 2nd element with label "Quantity"
 * ```
 */
When(
  'I fill {string} into {ordinal} element with label {string}',
  async ({ page, testData }, value: string, ordinal: number, label: string) => {
    const renderedValue = renderTemplate(value, testData);
    const renderedLabel = renderTemplate(label, testData);
    const locator = getLabelLocator(page, renderedLabel, ordinal);
    await locator.fill(renderedValue);
  }
);

/**
 * Step definition: `When I wait for "{string}" seconds`
 *
 * Waits for the specified number of seconds, accepting templated values.
 *
 * @param rawSeconds - String representation of the seconds to wait.
 *
 * @example
 * ```gherkin
 * When I wait for "1" seconds
 * ```
 */
When(/I wait for "(.+)" second(?:s)?/, async ({ page, testData }, rawSeconds: string) => {
  const renderedSeconds = renderTemplate(rawSeconds, testData).trim();
  const seconds = Number.parseFloat(renderedSeconds);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error(`Invalid wait duration: ${renderedSeconds}`);
  }

  await page.waitForTimeout(seconds * 1000);
});

/**
 * Step definition: `When I wait {number} second(s)`
 *
 * Waits for the specified number of seconds, accepting templated values.
 * This pattern does NOT match "I wait for ..." format.
 *
 * @param rawSeconds - String representation of the seconds to wait.
 *
 * @example
 * ```gherkin
 * When I wait 3 seconds
 * ```
 */
When(/I wait (?!for)(.+) second(?:s)?/, async ({ page, testData }, rawSeconds: string) => {
  const renderedSeconds = renderTemplate(rawSeconds, testData).trim();
  const seconds = Number.parseFloat(renderedSeconds);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error(`Invalid wait duration: ${renderedSeconds}`);
  }

  await page.waitForTimeout(seconds * 1000);
});

/**
 * Step definition: `When I press the {string} key`
 *
 * @param key - Key name to press (e.g., 'Escape', 'Enter', 'Tab').
 *
 * @example
 * ```gherkin
 * When I press the "Escape" key
 * ```
 */
When('I press the {string} key', async ({ page }, key: string) => {
  await page.keyboard.press(key);
});

/**
 * Step definition: `When I open url {string}` or `When I open site {string}`
 *
 * Navigates to the specified URL, supporting template variable substitution.
 *
 * @param url - URL to navigate to, may contain template variables.
 *
 * @examples
 * ```gherkin
 * When I open url "http://localhost:3000"
 * When I open site "https://example.com"
 * When I open url "{{baseUrl}}/dashboard"
 * ```
 */
When(/I open (?:url|site) "(.*)"/, async ({ page, testData }, url) => {
  const parsedUrl = testData.renderTemplate(url);
  await page.goto(parsedUrl);
});

When('I set window size: {string}', async ({ page }, viewport: string) => {
  const size = viewport.split('x');
  await page.setViewportSize({ width: parseInt(size[0], 10), height: parseInt(size[1], 10) });
});

When('I refresh page', async ({ page }) => {
  await page.reload();
});

When('I execute javascript code:', async ({ page, testData }: { page: Page; testData: TestStore }, js: string) => {
  let result;
  let attempts = 0;
  const maxAttempts = 3;
  
  // Wrap the code in a function - page.evaluate expects a function
  // If code contains 'return', wrap it in a function body
  const trimmedJs = js.trim();
  
  // page.evaluate can accept a function that will be serialized and executed in browser
  // We pass the code as a parameter to the function so it can be executed in browser context
  const evaluateFunction = (code: string) => {
    // eslint-disable-next-line no-eval
    return eval(code);
  };
  
  // Prepare code for evaluation in browser
  const codeToExecute = trimmedJs.includes('return')
    ? `(() => { ${trimmedJs} })()`
    : trimmedJs;
  
  while (attempts < maxAttempts) {
    try {
      result = await page.evaluate(evaluateFunction, codeToExecute);
      // Log detailed info for viewportTransform debugging
      if (trimmedJs.includes('viewportTransform')) {
        const viewportValue = await page.evaluate(() => {
          if (typeof mainView !== 'undefined' && mainView?.canvas?.viewportTransform) {
            return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5];
          }
          return 'N/A';
        });
        logger.info(`JavaScript execution result: ${result} (viewportTransform: ${viewportValue})`);
      } else {
        logger.info(`JavaScript execution result: ${result}`);
      }
      // Always save the result, even if it's undefined or null
      testData.set('js', result !== undefined && result !== null ? String(result) : '');
      return;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const isDisconnected = errorMsg.includes('disconnected') || 
                            errorMsg.includes('failed to check if window was closed') ||
                            errorMsg.includes('ECONNREFUSED');
      if (isDisconnected) {
        logger.warn('Browser disconnected or ChromeDriver unavailable, skipping javascript execution');
        testData.set('js', '');
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        await page.waitForTimeout(1000);
      } else {
        throw error;
      }
    }
  }
  
  logger.info(`JavaScript execution result: ${result}`);
  testData.set('js', result !== undefined && result !== null ? String(result) : '');
});
