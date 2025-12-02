import type { Locator, Page } from '@playwright/test';
import { When, Then } from '@fixtures';
import type { ElementTarget } from '@params';
import { getLabelLocator, getLocatorQuery, getRoleLocator } from '@helpers/locators';
import { AriaRole } from '@helpers/types';
import { renderTemplate } from '@helpers/template';
import type { TestStore, AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import { ensureServerReady } from '@utils/app-server';

const logger = createLogger('ActionsSteps');
const SAVE_IGNORE_REGION_SELECTOR = /data-check\s*=\s*['"]save-ignore-region['"]/i;
const ADD_IGNORE_REGION_SELECTOR = /data-check\s*=\s*['"]add-ignore-region['"]/i;
const REMOVE_IGNORE_REGION_SELECTOR = /data-check\s*=\s*['"]remove-ignore-region['"]/i;
const SEGMENT_VALUE_SELECTOR = /data-segment-value\s*=\s*['"]([^'"]+)['"]/i;

function shouldWaitForIgnoreRegionSave(value: string): boolean {
  return SAVE_IGNORE_REGION_SELECTOR.test(value);
}

type IgnoreRegionAction = 'add' | 'remove' | null;

function getIgnoreRegionAction(value: string): IgnoreRegionAction {
  if (ADD_IGNORE_REGION_SELECTOR.test(value)) {
    return 'add';
  }
  if (REMOVE_IGNORE_REGION_SELECTOR.test(value)) {
    return 'remove';
  }
  return null;
}

function extractSegmentValue(value: string): string | null {
  const match = SEGMENT_VALUE_SELECTOR.exec(value);
  return match ? match[1].trim() : null;
}

// Wait for the backend PUT that persists ignore regions before continuing.
async function waitForIgnoreRegionsSave(page: Page, locator: Locator): Promise<void> {
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => {
        if (resp.request().method() !== 'PUT') {
          return false;
        }
        if (!resp.url().includes('/v1/baselines/')) {
          return false;
        }
        const body = resp.request().postData() || '';
        return body.includes('ignoreRegions');
      },
      { timeout: 15000 }
    ),
    locator.click(),
  ]);

  await response.finished();
  if (!response.ok()) {
    throw new Error(`Saving ignore regions failed with status ${response.status()}`);
  }
}

// Ensures the canvas finished switching to the requested simple view.
async function waitForViewChange(page: Page, view: string): Promise<void> {
  const normalizedView = view.trim().toLowerCase();
  await page.waitForFunction(
    (expected) => {
      const target = document.querySelector(`[data-segment-value="${expected}"]`);
      const isActive = target?.getAttribute('data-segment-active') === 'true';
      const mainView: any = (window as any).mainView;
      if (!mainView || !isActive) {
        return false;
      }
      const targetImage = mainView?.[`${expected}Image`];
      if (!targetImage) {
        return false;
      }
      const objects = typeof mainView.canvas?.getObjects === 'function'
        ? mainView.canvas.getObjects()
        : [];
      const canvasHasImage = Array.isArray(objects) ? objects.includes(targetImage) : false;
      return canvasHasImage && mainView.currentView === expected;
    },
    normalizedView,
    { timeout: 15000 }
  );
}

async function waitForCanvasBootstrap(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const mainView: any = (window as any).mainView;
      const canvas = mainView?.canvas;
      if (!mainView || !canvas) {
        return false;
      }
      const objects = typeof canvas.getObjects === 'function' ? canvas.getObjects() : [];
      return Array.isArray(objects);
    },
    undefined,
    { timeout: 15000 }
  );
}

async function getIgnoreRegionCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const mainView: any = (window as any).mainView;
    if (!mainView?.canvas) {
      return -1;
    }
    if (Array.isArray(mainView.allRects)) {
      return mainView.allRects.length;
    }
    if (typeof mainView?.canvas?.getObjects === 'function') {
      return mainView.canvas.getObjects().filter((x: any) => x.name === 'ignore_rect').length;
    }
    return -1;
  });
}

async function waitForIgnoreRegionCountChange(page: Page, expected: number): Promise<void> {
  await page.waitForFunction(
    (target) => {
      const mainView: any = (window as any).mainView;
      if (!mainView?.canvas) {
        return false;
      }
      const current = Array.isArray(mainView.allRects)
        ? mainView.allRects.length
        : mainView.canvas.getObjects().filter((x: any) => x.name === 'ignore_rect').length;
      return current === target;
    },
    expected,
    { timeout: 15000 }
  );
}

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
      const targetLocator = locator.first();
      await targetLocator.waitFor({ state: 'visible', timeout: 5000 });

      const ignoreRegionAction = getIgnoreRegionAction(renderedValue);
      if (ignoreRegionAction) {
        await waitForCanvasBootstrap(page);
        const currentCount = await getIgnoreRegionCount(page);
        const delta = ignoreRegionAction === 'add' ? 1 : -1;
        const targetCount = Math.max(0, currentCount + delta);
        await targetLocator.click();
        await waitForIgnoreRegionCountChange(page, targetCount);
        return;
      }

      if (shouldWaitForIgnoreRegionSave(renderedValue)) {
        await waitForIgnoreRegionsSave(page, targetLocator);
        return;
      }

      const segmentValue = extractSegmentValue(renderedValue);
      if (segmentValue) {
        await targetLocator.click();
        await waitForViewChange(page, segmentValue);
        return;
      }

      await targetLocator.click();
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
 * Step definition: `When I fill {string} into {role} {string}`
 *
 * @param value - Text to input into the control.
 * @param role - {@link AriaRole} derived from `{role}`.
 * @param name - Accessible name identifying the control.
 *
 * @example
 * ```gherkin
 * When I fill "user" into textbox "Username"
 * ```
 */
When(
  'I fill {string} into {role} {string}',
  async ({ page, testData }, value: string, role: AriaRole, name: string) => {
    const renderedValue = renderTemplate(value, testData);
    const renderedName = renderTemplate(name, testData);
    const locator = getRoleLocator(page, role, renderedName);
    await locator.fill(renderedValue);
  }
);

When(
  'I fill {string} into element with placeholder {string}',
  async ({ page, testData }, value: string, placeholder: string) => {
    const renderedValue = renderTemplate(value, testData);
    const renderedPlaceholder = renderTemplate(placeholder, testData);
    await page.getByPlaceholder(renderedPlaceholder).fill(renderedValue);
  }
);

Then(
  'the element with placeholder {string} should be visible for {int} sec',
  async ({ page, testData }, placeholder: string, seconds: number) => {
    const renderedPlaceholder = renderTemplate(placeholder, testData);
    await page.getByPlaceholder(renderedPlaceholder).waitFor({ state: 'visible', timeout: seconds * 1000 });
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

When(
  'I wait up to {int} seconds for javascript condition:',
  async ({ page }: { page: Page }, timeoutSeconds: number, js: string) => {
    const trimmedJs = js.trim();
    const expression = trimmedJs.includes('return') ? trimmedJs : `return (${trimmedJs});`;
    const wrappedFunction = `(() => { ${expression} })()`;

    // Custom polling implementation to bypass global actionTimeout
    const pollingInterval = 100; // Check every 100ms
    const timeoutMs = timeoutSeconds * 1000;
    const startTime = Date.now();

    while (true) {
      try {
        const result = await page.evaluate(wrappedFunction);
        if (result) {
          return; // Condition met
        }
      } catch (error) {
        // Ignore evaluation errors and continue polling
      }

      if (Date.now() - startTime >= timeoutMs) {
        throw new Error(
          `Timeout ${timeoutSeconds}s exceeded waiting for javascript condition:\n${trimmedJs}`
        );
      }

      await page.waitForTimeout(pollingInterval);
    }
  }
);

/**
 * Step definition: `When I wait {number} second(s)`
 *
 * Waits for the specified number of seconds, accepting templated values.
 * This pattern does NOT match "I wait for ..." format or "I wait X seconds for the ..." format.
 *
 * @param rawSeconds - String representation of the seconds to wait.
 *
 * @example
 * ```gherkin
 * When I wait 3 seconds
 * ```
 */
When(/^I wait (?!for)(\d+(?:\.\d+)?)\s+second(?:s)?(?!\s+for\s+the)$/, async ({ page, testData }, rawSeconds: string) => {
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

When('I open the url {string}', async ({ page, testData, appServer }: { page: Page; testData: TestStore; appServer: AppServerFixture }, url: string) => {
  const parsedUrl = testData.renderTemplate(url);
  logger.info(`Navigating to URL: ${parsedUrl}`);

  // Ensure server is ready before navigation if it looks like an app URL
  // Check both full URL and relative paths (starting with /)
  const isAppUrl = (appServer.baseURL && parsedUrl.startsWith(appServer.baseURL)) || parsedUrl.startsWith('/');
  if (isAppUrl && appServer.serverPort) {
    await ensureServerReady(appServer.serverPort);
  }

  await page.goto(parsedUrl);
});

When('I set window size: {string}', async ({ page }, viewport: string) => {
  const size = viewport.split('x');
  await page.setViewportSize({ width: parseInt(size[0], 10), height: parseInt(size[1], 10) });
});

When('I refresh page', async ({ page }) => {
  await page.reload();
});

When('I wait for canvas to be ready', async ({ page }) => {
  await page.waitForFunction(() => {
    const globalMain = (window as any).mainView;
    if (typeof globalMain === 'undefined' || !globalMain?.canvas) {
      return false;
    }
    // Check that canvas is initialized and has objects
    return globalMain.canvas.getObjects().length > 0;
  }, { timeout: 10000 });

  // Wait for resizeImageIfNeeded to complete (it uses setTimeout(10))
  await page.waitForTimeout(200);
});

When('I wait for viewportTransform to stabilize', async ({ page }) => {
  const maxAttempts = 20; // 20 seconds maximum
  const stabilityThreshold = 3; // 3 identical values in a row

  let lastValue: string | null = null;
  let stableCount = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const currentValue = await page.evaluate(() => {
      const globalMain = (window as any).mainView;
      if (typeof globalMain !== 'undefined' && globalMain?.canvas?.viewportTransform) {
        return globalMain.canvas.viewportTransform[4] + '_' + globalMain.canvas.viewportTransform[5];
      }
      return null;
    });

    if (currentValue === lastValue && currentValue !== null) {
      stableCount++;
      if (stableCount >= stabilityThreshold) {
        logger.info(`ViewportTransform stabilized at: ${currentValue} after ${attempt + 1} attempts`);
        return;
      }
    } else {
      stableCount = 0;
      lastValue = currentValue;
    }

    await page.waitForTimeout(1000);
  }

  throw new Error(`ViewportTransform did not stabilize after ${maxAttempts} attempts. Last value: ${lastValue}`);
});

When('I execute javascript OLD code:', async ({ page, testData }: { page: Page; testData: TestStore }, js: string) => {
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

  if (trimmedJs.includes('mainView.sliderView.divider.left')) {
    try {
      await page.waitForFunction(
        () =>
          typeof (window as any)?.mainView?.sliderView?.divider?.left === 'number',
        undefined,
        { timeout: 5000 }
      );
    } catch (error) {
      logger.warn(
        `Timeout waiting for mainView.sliderView.divider.left to be defined: ${(error as Error).message}`
      );
    }
  }

  while (attempts < maxAttempts) {
    try {
      result = await page.evaluate(evaluateFunction, codeToExecute);
      // Log detailed info for viewportTransform debugging
      if (trimmedJs.includes('viewportTransform')) {
        const viewportDetails = await page.evaluate(() => {
          const globalMain = (window as any).mainView;
          if (typeof globalMain !== 'undefined' && globalMain?.canvas?.viewportTransform) {
            const [scaleX, , , scaleY, translateX, translateY] = globalMain.canvas.viewportTransform;
            const zoom = typeof globalMain.canvas.getZoom === 'function' ? globalMain.canvas.getZoom() : null;
            return {
              summary: `${translateX}_${translateY}`,
              scaleX,
              scaleY,
              translateX,
              translateY,
              zoom,
              zoomFixed2: typeof zoom === 'number' ? zoom.toFixed(2) : null,
            };
          }
          return null;
        });
        const viewportValue = viewportDetails?.summary ?? 'N/A';
        logger.info(`JavaScript execution result: ${result} (viewportTransform: ${viewportValue})`);
        if (viewportDetails) {
          logger.info(`Viewport transform details: ${JSON.stringify(viewportDetails)}`);
        }
        // If result is false and we're checking viewportTransform, log the actual value for debugging
        if (result === false && trimmedJs.includes('===')) {
          logger.warn(`ViewportTransform check failed. Actual value: ${viewportValue}, Expected: 362.5_0, 340_0, or 340.5_0`);
        }
      } else {
        try {
          logger.info(`JavaScript execution result: ${JSON.stringify(result)}`);
        } catch {
          logger.info(`JavaScript execution result: ${result}`);
        }
        if (trimmedJs.includes('getZoom()')) {
          try {
            const zoomDetails = await page.evaluate(() => {
              const canvas: any = (window as any)?.mainView?.canvas;
              if (!canvas || typeof canvas.getZoom !== 'function') {
                return { hasCanvas: Boolean(canvas), zoom: null };
              }
              const zoom = canvas.getZoom();
              return {
                hasCanvas: true,
                zoom,
                fixed2: typeof zoom === 'number' ? zoom.toFixed(2) : null,
              };
            });
            logger.info(`Zoom debug info: ${JSON.stringify(zoomDetails)}`);
          } catch (zoomError) {
            logger.warn(`Failed to collect zoom debug info: ${(zoomError as Error).message}`);
          }
        }
      }
      if (result === undefined || result === null) {
        try {
          const debugInfo = await page.evaluate(() => {
            const globalMain: any = (window as any).mainView;
            return {
              hasMainView: typeof globalMain !== 'undefined',
              hasSliderView: typeof globalMain?.sliderView !== 'undefined',
              hasDivider: typeof globalMain?.sliderView?.divider !== 'undefined',
              dividerLeft: globalMain?.sliderView?.divider?.left ?? null,
              currentView: globalMain?.currentView ?? null,
              availableViews: globalMain ? Object.keys(globalMain).filter((key) => key.endsWith('View')) : [],
            };
          });
          logger.info(`JavaScript execution debug info: ${JSON.stringify(debugInfo)}`);
        } catch (debugError) {
          logger.warn(`Failed to collect JS debug info: ${(debugError as Error).message}`);
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          logger.warn(`JavaScript execution returned ${result}; retrying (${attempts}/${maxAttempts})`);
          await page.waitForTimeout(500);
          continue;
        }
        throw new Error('JavaScript execution returned undefined/null after retries');
      }
      testData.set('js', result);
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

  try {
    logger.info(`JavaScript execution result: ${JSON.stringify(result)}`);
  } catch {
    logger.info(`JavaScript execution result: ${result}`);
  }
  testData.set('js', result);
});

/**
 * Step definition: `When I execute javascript code:`
 *
 * Atomic implementation - executes JavaScript code in browser context and stores result.
 * No retries, no special handling for specific code patterns.
 *
 * @param js - JavaScript code to execute (may contain 'return' statement).
 *
 * @example
 * ```gherkin
 * When I execute javascript code:
 *   """
 *   return document.querySelector('h1').textContent
 *   """
 * ```
 */
When('I execute javascript code:', async ({ page, testData }: { page: Page; testData: TestStore }, js: string) => {
  const trimmedJs = js.trim();

  if (trimmedJs.includes('mainView')) {
    await waitForCanvasBootstrap(page);
  }

  const evaluateFunction = (code: string) => {
    // eslint-disable-next-line no-eval
    return eval(code);
  };
  const codeToExecute = trimmedJs.includes('return')
    ? `(() => { ${trimmedJs} })()`
    : trimmedJs;
  const result = await page.evaluate(evaluateFunction, codeToExecute);
  testData.set('js', result);
});

When('I scroll to element {string}', async ({ page }, selector: string) => {
  const locator = getLocatorQuery(page, selector);
  const element = locator.first();
  await element.evaluate((el) => {
    el.scrollIntoView();
  });
  await page.waitForTimeout(100);
});

When(
  'I select the option with the text {string} for element {string}',
  async ({ page, testData }, optionText: string, selector: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const renderedOptionText = renderTemplate(optionText, testData);
    // Extract index before passing to getLocatorQuery (it may strip the index)
    const nthMatch = renderedSelector.match(/\[(\d+)\]$/);
    const selectorWithoutIndex = renderedSelector.replace(/\[(\d+)\]$/, '');
    const locator = getLocatorQuery(page, selectorWithoutIndex);
    const targetLocator = nthMatch
      ? locator.nth(parseInt(nthMatch[1], 10) - 1) // Convert 1-based to 0-based
      : locator.first();

    // Wait for element to be visible and attached
    await targetLocator.waitFor({ state: 'visible', timeout: 10000 });
    await targetLocator.waitFor({ state: 'attached', timeout: 5000 });

    // Try selectOption first, if it fails, try clicking the select and then the option
    try {
      await targetLocator.selectOption({ label: renderedOptionText });
    } catch (error) {
      // If selectOption fails, try clicking the select and then clicking the option div
      await targetLocator.click();
      await page.waitForTimeout(500); // Wait for dropdown to open
      const optionLocator = page.locator(`div:has-text('${renderedOptionText}')`).first();
      await optionLocator.waitFor({ state: 'visible', timeout: 5000 });
      await optionLocator.click();
    }
  }
);

/**
 * Step definition: `When I select dropdown option {string} by clicking div for element {string}`
 *
 * This step is specifically designed for custom dropdown components that don't work with standard selectOption.
 * It clicks on the select element to open the dropdown, then clicks on the div option, and also sets the value
 * via selectOption as a fallback to ensure the value is properly set.
 *
 * @param optionText - Text of the option to select
 * @param selector - Selector for the select element
 *
 * @example
 * ```gherkin
 * When I select dropdown option "Failed" by clicking div for element "[data-test='table-filter-value']"
 * ```
 */
When(
  'I select dropdown option {string} by clicking div for element {string}',
  async ({ page, testData }, optionText: string, selector: string) => {
    const renderedSelector = renderTemplate(selector, testData);
    const renderedOptionText = renderTemplate(optionText, testData);

    // Get the select element
    const selectLocator = getLocatorQuery(page, renderedSelector);
    await selectLocator.first().waitFor({ state: 'visible', timeout: 10000 });
    await selectLocator.first().waitFor({ state: 'attached', timeout: 5000 });

    // Click on select to open dropdown
    await selectLocator.first().click();
    await page.waitForTimeout(500); // Wait for dropdown to open

    // Click on the div option
    const optionLocator = page.locator(`div:has-text('${renderedOptionText}')`).first();
    await optionLocator.waitFor({ state: 'visible', timeout: 5000 });
    await optionLocator.click();

    // Also set value via selectOption as fallback to ensure value is properly set
    try {
      await page.waitForTimeout(300); // Small delay to ensure dropdown closed
      await selectLocator.first().selectOption({ label: renderedOptionText });
    } catch (error) {
      // If selectOption fails, that's okay - we already clicked the div
      logger.debug(`selectOption fallback failed for "${renderedOptionText}", but div click succeeded`);
    }
  }
);

When('I set {string} to the inputfield {string}', async ({ page, testData }, value: string, selector: string) => {
  const renderedValue = renderTemplate(value, testData);
  const renderedSelector = renderTemplate(selector, testData);
  const locator = getLocatorQuery(page, renderedSelector);
  await locator.first().fill(renderedValue);
});

When('I reload session', async ({ page, testData }: { page: Page; testData: TestStore }) => {
  await page.context().clearCookies();
  // Clear all browser storage to ensure clean session state
  try {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  } catch {
    // Page might not have a valid context yet - ignore
  }
  testData.clearAll();
});

When('I delete the cookie {string}', async ({ page }, cookieName: string) => {
  await page.context().clearCookies();
});

When('I press {string}', async ({ page }, key: string) => {
  await page.keyboard.press(key);
});

When('I hold key {string}', async ({ page }, key: string) => {
  await page.keyboard.down(key);
});

When('I release key {string}', async ({ page }, key: string) => {
  await page.keyboard.up(key);
});

When('I click on the element {string} via js', async ({ page }, selector: string) => {
  const locator = getLocatorQuery(page, selector);
  await locator.first().evaluate((el: HTMLElement) => el.click());
});

When('I force click element with locator {string}', async ({ page, testData }, rawValue: string) => {
  const renderedValue = renderTemplate(rawValue, testData);
  const locator = getLocatorQuery(page, renderedValue);
  await locator.first().click({ force: true });
});

When('I move to element {string}', async ({ page }, selector: string) => {
  const locator = getLocatorQuery(page, selector);
  await locator.first().hover();
});

When('I move to element {string} with an offset of {int},{int}', async ({ page }, selector: string, x: number, y: number) => {
  const locator = getLocatorQuery(page, selector);
  const box = await locator.first().boundingBox();
  if (box) {
    await page.mouse.move(box.x + x, box.y + y);
  }
});

/**
 * Step definition: `When I click the {ordinal} {role} {string}`
 * Clicks on the Nth element of a given role and name.
 *
 * @param ordinal - Zero-based ordinal index supplied by `{ordinal}` (e.g. `1st` -> `0`).
 * @param role - {@link AriaRole} derived from the `{role}` parameter type.
 * @param name - Accessible name for the element.
 *
 * @example
 * ```gherkin
 * When I click the 1st button "Open Check"
 * ```
 */
When(
  'I click the {ordinal} {role} {string}',
  async ({ page, testData }, ordinal: number, role: AriaRole, name: string) => {
    const renderedName = renderTemplate(name, testData);
    const locator = getRoleLocator(page, role, renderedName, ordinal);
    await locator.click();
  }
);
