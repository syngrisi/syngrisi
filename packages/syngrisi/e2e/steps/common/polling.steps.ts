import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import type { TestStore } from '@fixtures';
import { getLocatorQuery } from '@helpers/locators';
import { renderTemplate } from '@helpers/template';
import { createLogger } from '@lib/logger';

const logger = createLogger('PollingSteps');

function normalizeColor(raw: string): string {
  const trimmed = (raw || '').trim();
  const rgbaMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return `rgba(${r},${g},${b},${a || '1'})`;
  }
  return trimmed.replace(/\s+/g, '');
}

When(
  'I wait until element {string} contains text {string}',
  async ({ page }: { page: Page }, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const expectedText = expected.trim();
    const deadline = Date.now() + 60000;
    let currentTexts: string[] = [];
    const normalizedSelector = selector.toLowerCase();
    const isBadgeSelector = normalizedSelector.includes('table-refresh-icon-badge');
    const refreshIcon = page.locator('[data-test="table-refresh-icon"]').first();

    while (Date.now() < deadline) {
      if (isBadgeSelector) {
        await refreshIcon.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
      }

      const attached = await locator.first().waitFor({ state: 'attached', timeout: 2000 }).catch(() => false);
      if (!attached) {
        await page.waitForTimeout(300);
        continue;
      }

      currentTexts = await locator.evaluateAll((elements) =>
        elements.map((el) => {
          const htmlElement = el as HTMLElement;
          const text = htmlElement.innerText ?? el.textContent ?? '';
          return text.replace(/\u00a0/g, ' ');
        })
      );
      if (currentTexts.some((text) => text.includes(expectedText))) {
        return;
      }
      if (isBadgeSelector) {
        await page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => undefined);
      }
      await page.waitForTimeout(250);
    }
    throw new Error(
      `Element "${selector}" texts ${JSON.stringify(currentTexts)} did not contain "${expectedText}" after 60s`
    );
  }
);

When(
  'I wait up to {int} seconds for element {string} to contain text {string}',
  async ({ page }: { page: Page }, timeoutSeconds: number, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const expectedText = expected.trim();
    const deadline = Date.now() + timeoutSeconds * 1000;
    let currentTexts: string[] = [];

    while (Date.now() < deadline) {
      const attached = await locator.first().waitFor({ state: 'attached', timeout: 2000 }).catch(() => false);
      if (!attached) {
        await page.waitForTimeout(300);
        continue;
      }

      currentTexts = await locator.evaluateAll((elements) =>
        elements.map((el) => {
          const htmlElement = el as HTMLElement;
          const text = htmlElement.innerText ?? el.textContent ?? '';
          return text.replace(/\u00a0/g, ' ');
        })
      );
      if (currentTexts.some((text) => text.includes(expectedText))) {
        return;
      }
      await page.waitForTimeout(250);
    }

    logger.warn(
      `Soft wait: element "${selector}" texts ${JSON.stringify(currentTexts)} did not contain "${expectedText}" after ${timeoutSeconds}s`
    );
  }
);

When(
  'I repeat javascript code until stored {string} string equals {string}:',
  async (
    { page, testData }: { page: Page; testData: TestStore },
    itemName: string,
    expected: string,
    js: string
  ) => {
    const renderedJs = renderTemplate(js, testData);
    const expectedValue = renderTemplate(expected, testData).trim();
    const expression = renderedJs.includes('return')
      ? `(() => { ${renderedJs} })()`
      : renderedJs;
    const evaluateFn = (code: string) => {
      // eslint-disable-next-line no-eval
      return eval(code);
    };

    const deadline = Date.now() + 30000;
    let lastResult = '';
    while (Date.now() < deadline) {
      const result = await page.evaluate(evaluateFn, expression);
      lastResult = result === undefined || result === null ? '' : String(result).trim();
      testData.set(itemName, lastResult);
      if (lastResult === expectedValue) {
        return;
      }
      await page.waitForTimeout(400);
    }
    throw new Error(
      `Stored "${itemName}" value "${lastResult}" did not become "${expectedValue}" after 30s`
    );
  }
);

When(
  'I repeat javascript code until stored {string} string matches {string}:',
  async (
    { page, testData }: { page: Page; testData: TestStore },
    itemName: string,
    pattern: string,
    js: string
  ) => {
    const renderedJs = renderTemplate(js, testData);
    const regex = new RegExp(pattern);
    const expression = renderedJs.includes('return')
      ? `(() => { ${renderedJs} })()`
      : renderedJs;
    const evaluateFn = (code: string) => {
      // eslint-disable-next-line no-eval
      return eval(code);
    };

    const deadline = Date.now() + 30000;
    let lastResult = '';
    while (Date.now() < deadline) {
      const result = await page.evaluate(evaluateFn, expression);
      lastResult = result === undefined || result === null ? '' : String(result).trim();
      testData.set(itemName, lastResult);
      if (regex.test(lastResult)) {
        return;
      }
      await page.waitForTimeout(400);
    }
    throw new Error(
      `Stored "${itemName}" value "${lastResult}" did not match pattern "${pattern}" after 30s`
    );
  }
);

When(
  'I wait until the css attribute {string} from element {string} is {string}',
  async ({ page }: { page: Page }, cssProperty: string, selector: string, expected: string) => {
    const locator = getLocatorQuery(page, selector);
    const expectedNormalized = normalizeColor(expected);
    const deadline = Date.now() + 30000;

    const computeValue = async (): Promise<string> => {
      const raw = await locator.first().evaluate((el, prop) => {
        const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        const style = window.getComputedStyle(el);
        let value = (style[camelProp as keyof CSSStyleDeclaration] as string) || '';
        if (
          prop === 'color' &&
          (!value || value === 'rgba(0, 0, 0, 0)' || value === 'transparent')
        ) {
          const fill = style.fill;
          const stroke = style.stroke;
          if (fill && fill !== 'none' && fill !== 'rgba(0, 0, 0, 0)') {
            value = fill;
          } else if (stroke && stroke !== 'none' && stroke !== 'rgba(0, 0, 0, 0)') {
            value = stroke;
          }
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
      return normalizeColor(raw);
    };

    let actual = await computeValue();
    while (actual !== expectedNormalized && Date.now() < deadline) {
      await page.waitForTimeout(250);
      actual = await computeValue();
    }

    if (actual !== expectedNormalized) {
      logger.warn(`CSS "${cssProperty}" value "${actual}" did not reach "${expectedNormalized}" for "${selector}"`);
      throw new Error(
        `CSS attribute "${cssProperty}" for "${selector}" was "${actual}" after 30s (expected ${expectedNormalized})`
      );
    }
  }
);

When(
  'I wait until element {string} has attribute {string} with value {string}',
  async ({ page }: { page: Page }, selector: string, attribute: string, value: string) => {
    const locator = getLocatorQuery(page, selector);
    const expectedValue = value.trim();
    const deadline = Date.now() + 30000;

    const actual = await locator.first().getAttribute(attribute);
    if (actual === expectedValue) return;

    while (Date.now() < deadline) {
      await page.waitForTimeout(250);
      const val = await locator.first().getAttribute(attribute);
      if (val === expectedValue) {
        return;
      }
    }
    const finalValue = await locator.first().getAttribute(attribute);
    throw new Error(
      `Element "${selector}" attribute "${attribute}" was "${finalValue}" instead of "${expectedValue}" after 30s`
    );
  }
);
