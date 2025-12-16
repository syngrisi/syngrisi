/**
 * @fileoverview Diagnostic step definitions for interacting with the Syngrisi app through MCP.
 *
 * These steps are intended for manual use through the MCP server. They provide
 * additional observability tools such as capturing accessibility trees, reading
 * DOM structure, or saving screenshots. Do not use them inside automated tests.
 */

import { When, Then } from '@fixtures';
import * as yaml from 'yaml';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { formatError } from '../utils/common';
import logger, { formatArgs } from '../utils/logger';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const resolveComponent = (testData: unknown, component: string): string => {
  const data = testData as { renderTemplate?: (input: string) => string };
  if (data?.renderTemplate) {
    return data.renderTemplate(component);
  }
  return component;
};

const selectorWithEngineRegex = /^(?:css|xpath|text|id|role)=/i;

const isXpathSelector = (selector: string): boolean =>
  selector.startsWith('//') || selector.startsWith('.//') || selector.startsWith('..//') || selector.startsWith('(');

type ResolveLocatorOptions = { allowedEngines?: Array<'css' | 'xpath'> };

const resolveLocator = (page: Page, testData: unknown, component: string, options?: ResolveLocatorOptions) => {
  const rendered = resolveComponent(testData, component).trim();
  if (!rendered) {
    throw new Error('Empty locator provided');
  }

  const prefixMatch = rendered.match(/^([a-z]+)=/i);
  let normalized: string;
  let engine: string;

  if (prefixMatch) {
    engine = prefixMatch[1].toLowerCase();
    normalized = rendered;
  } else if (isXpathSelector(rendered)) {
    engine = 'xpath';
    normalized = `xpath=${rendered}`;
  } else {
    engine = 'css';
    normalized = rendered;
  }

  if (options?.allowedEngines && !options.allowedEngines.includes(engine as 'css' | 'xpath')) {
    throw new Error(
      `Unsupported locator engine "${engine}" for "${component}". Allowed: ${options.allowedEngines.join(', ')}`,
    );
  }

  return {
    locator: page.locator(normalized),
    selector: normalized,
  };
};

logger.info(formatArgs('🔍 Loading diagnostics.sd.ts'));

/**
 * Returns the current page URL for diagnostics logging.
 * @example
 * ```gherkin
 * When I get current URL
 * ```
 */
When(/^I get current URL$/, async ({ page }) => {
  const url = page.url();
  logger.info(formatArgs(`🌐 Current URL: ${url}`));
  return url;
});

/**
 * Verifies that the page is fully loaded and ready for interaction.
 * @example
 * ```gherkin
 * When I verify page is loaded
 * ```
 */
When(/^I verify page is loaded$/, async ({ page }) => {
  const pagesCount = page.context().pages();
  expect(pagesCount.length).toBeGreaterThan(0);

  await page.waitForLoadState('domcontentloaded');
  const url = page.url();
  const title = await page.title();
  
  const message = `Page loaded: ${title} (${url})`;
  logger.info(formatArgs(`✅ ${message}`));
  return message;
});

/**
 * Counts elements matching the provided selector or component alias.
 * @example
 * ```gherkin
 * When I get count of "css=.task-card"
 * ```` */
When(
  /^I get count of "([^"]+)"$/,
  async ({ page, testData }, component: string) => {
    try {
      const { locator, selector } = resolveLocator(page as Page, testData, component);
      const count = await locator.count();
      logger.info(formatArgs(`🧮 Count for "${selector}": ${count}`));
      return count;
    } catch (err) {
      const message = `Failed to get count for "${component}": ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

const captureElement = async (
  page: Page,
  testData: unknown,
  component: string,
  captureType: 'accessibility' | 'screenshot',
  scopeOrNumber?: 'first' | string,
  indexStr?: string,
) => {
  const { locator, selector } = resolveLocator(page, testData, component);
  const scope = scopeOrNumber ?? 'first';
  const count = await locator.count();

  if (count === 0) {
    throw new Error(`No elements found for locator: ${selector}`);
  }

  const captureAccessibility = async (target: ReturnType<typeof locator.first>) => {
    const snapshot = await target.ariaSnapshot();
    const yamlString = yaml.stringify(snapshot);
    logger.info(formatArgs(`♿ Accessibility snapshot for "${selector}":\n${yamlString}`));
    return yamlString;
  };

  const captureScreenshot = async (target: ReturnType<typeof locator.first>) => {
    const buffer = await target.screenshot({ type: 'png' });
    const base64 = buffer.toString('base64');
    logger.info(formatArgs(`📸 Screenshot captured for "${selector}" (${buffer.length} bytes)`));
    return base64;
  };

  const captureForTarget = async (target: ReturnType<typeof locator.first>) =>
    captureType === 'accessibility' ? captureAccessibility(target) : captureScreenshot(target);

  if (scope !== 'first' && indexStr) {
    const index = Number.parseInt(indexStr, 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= count) {
      throw new Error(
        `Index out of range for locator: ${selector}. Provided: ${index + 1}, available: 1..${count}`,
      );
    }
    return captureForTarget(locator.nth(index));
  }

  return captureForTarget(locator.first());
};

/**
 * Captures an accessibility snapshot of a matching element.
 * @example
 * ```gherkin
 * When I get accessibility snapshot of "css=.task-card"
 * When I get accessibility snapshot of 2nd "role=button"
 * ```
 */
When(
  /^I get accessibility snapshot of (?:(first)|(\d+)(?:st|nd|rd|th)?)?\s*"([^"]+)"$/,
  async ({ page, testData }, scopeOrNumber: 'first' | undefined, indexStr: string | undefined, component: string) => {
    try {
      return await captureElement(page as Page, testData, component, 'accessibility', scopeOrNumber, indexStr);
    } catch (err) {
      const message = `Failed to get accessibility snapshot for "${component}": ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

/**
 * Captures a screenshot of a matching element as base64.
 * @example
 * ```gherkin
 * When I get screenshot of "css=.task-card"
 * When I get screenshot of 3rd "role=button"
 * ```
 */
When(
  /^I get screenshot of (?:(first)|(\d+)(?:st|nd|rd|th)?)?\s*"([^"]+)"$/,
  async ({ page, testData }, scopeOrNumber: 'first' | undefined, indexStr: string | undefined, component: string) => {
    try {
      return await captureElement(page as Page, testData, component, 'screenshot', scopeOrNumber, indexStr);
    } catch (err) {
      const message = `Failed to get screenshot for "${component}": ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

/**
 * Saves a full-page screenshot to the diagnostics screenshots directory.
 * @example
 * ```gherkin
 * When I save page screenshot as "dashboard"
 * ```
 */
When(
  /^I save page screenshot as "([^"]+)"$/,
  async ({ page, testData }, rawName: string) => {
    try {
      const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
      await fs.mkdir(screenshotsDir, { recursive: true });

      const rendered =
        (testData?.renderTemplate
          ? testData.renderTemplate(rawName)
          : rawName) ?? rawName;

      const safeBase = rendered.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = safeBase.endsWith('.png') ? safeBase : `${safeBase}.png`;
      const outPath = path.join(screenshotsDir, fileName);

      await page.screenshot({ path: outPath, type: 'png', fullPage: true });
      logger.info(formatArgs(`📸 Saved screenshot: ${outPath}`));
      return outPath;
    } catch (err) {
      const message = `Failed to save page screenshot: ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

/**
 * Captures a screenshot of the first matching element and saves it to disk.
 * @example
 * ```gherkin
 * When I save screenshot of "css=.task-card" as "task-card"
 * ```
 */
When(
  /^I save screenshot of "([^"]+)" as "([^"]+)"$/,
  async ({ page, testData }, component: string, rawName: string) => {
    try {
      const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
      await fs.mkdir(screenshotsDir, { recursive: true });

      const { locator, selector } = resolveLocator(page as Page, testData, component, {
        allowedEngines: ['css', 'xpath'],
      });
      const target = locator.first();

      const isVisible = await target.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        throw new Error(`Element is not visible or not found for locator: ${selector}`);
      }

      const rendered =
        (testData?.renderTemplate
          ? testData.renderTemplate(rawName)
          : rawName) ?? rawName;

      const safeBase = rendered.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = safeBase.endsWith('.png') ? safeBase : `${safeBase}.png`;
      const outPath = path.join(screenshotsDir, fileName);

      await target.screenshot({ path: outPath, type: 'png' });
      logger.info(formatArgs(`📸 Saved element screenshot: ${outPath} (${selector})`));
      return outPath;
    } catch (err) {
      const message = `Failed to save element screenshot: ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

/**
 * Compares two saved screenshots with optional threshold.
 * @example
 * ```gherkin
 * Then the screenshots "baseline" and "current" should match
 * Then the screenshots "baseline" and "current" should match with threshold 0.1
 * ```
 */
Then(
  /^the screenshots "([^"]+)" and "([^"]+)" should match(?:\s+with\s+threshold\s+([0-9.]+))?$/,
  async (_ctx, a: string, b: string, thresholdStr?: string) => {
    try {
      const threshold = thresholdStr ? Number(thresholdStr) : 0;
      const { PNG } = await import('pngjs');
      const pixelmatch = (await import('pixelmatch')).default as (
        img1: Uint8Array,
        img2: Uint8Array,
        output: Uint8Array,
        width: number,
        height: number,
        options?: { threshold?: number },
      ) => number;

      const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
      const ensurePng = (name: string) => (name.endsWith('.png') ? name : `${name}.png`);
      const aPath = path.join(screenshotsDir, ensurePng(a));
      const bPath = path.join(screenshotsDir, ensurePng(b));

      const [abuf, bbuf] = await Promise.all([
        fs.readFile(aPath),
        fs.readFile(bPath),
      ]);

      const aPng = PNG.sync.read(abuf);
      const bPng = PNG.sync.read(bbuf);

      if (aPng.width !== bPng.width || aPng.height !== bPng.height) {
        throw new Error(
          `Image sizes differ: ${aPng.width}x${aPng.height} vs ${bPng.width}x${bPng.height}`,
        );
      }

      const diff = new Uint8Array(aPng.width * aPng.height * 4);
      const mismatched = pixelmatch(
        aPng.data,
        bPng.data,
        diff,
        aPng.width,
        aPng.height,
        { threshold },
      );

      if (mismatched > 0) {
        const msg = threshold > 0
          ? `Screenshots differ by ${mismatched} pixels (threshold=${threshold})`
          : `Screenshots differ by ${mismatched} pixels`;
        throw new Error(msg);
      }

      logger.info(formatArgs(`✅ Screenshots match (threshold=${threshold})`));
      return JSON.stringify({ mismatched: 0, threshold });
    } catch (error) {
      if (
        (error as Error).message.includes("Cannot find module 'pixelmatch'") ||
        (error as Error).message.includes("Cannot find module 'pngjs'")
      ) {
        throw new Error(
          'Missing dependencies: install pixelmatch and pngjs (e.g. yarn add -D pixelmatch pngjs).',
        );
      }
      throw error;
    }
  },
);

/**
 * Reads inner or outer HTML from a matching element.
 * @example
 * ```gherkin
 * When I get inner HTML of "css=.task-card"
 * When I get outer HTML of 2nd "role=button"
 * ```
 */
When(
  /^I get (inner|outer) HTML of (?:(first)|(\d+)(?:st|nd|rd|th)?)?\s*"([^"]+)"$/,
  async (
    { page, testData },
    htmlType: 'inner' | 'outer',
    scopeOrNumber: 'first' | undefined,
    indexStr: string | undefined,
    component: string,
  ) => {
    try {
      const { locator, selector } = resolveLocator(page as Page, testData, component);
      const scope = scopeOrNumber ?? 'first';

      const count = await locator.count();
      if (count === 0) {
        throw new Error(`No elements found for locator: ${selector}`);
      }

      const getContent = async (target: ReturnType<typeof locator.first>) =>
        htmlType === 'inner'
          ? target.innerHTML()
          : target.evaluate((element) => (element as HTMLElement).outerHTML);

      let target: ReturnType<typeof locator.first>;
      let displayIndex = '';

      if (scope !== 'first' && indexStr) {
        const index = Number.parseInt(indexStr, 10) - 1;
        if (Number.isNaN(index) || index < 0 || index >= count) {
          throw new Error(
            `Index out of range for locator: ${selector}. Provided: ${index + 1}, available: 1..${count}`,
          );
        }
        target = locator.nth(index);
        displayIndex = ` [#${index + 1}]`;
      } else {
        target = locator.first();
      }

      const htmlContent = await getContent(target);
      const displayType = htmlType === 'inner' ? 'Inner HTML' : 'Outer HTML';
      logger.info(formatArgs(`📄 ${displayType} for "${component}"${displayIndex}:\n${htmlContent}`));
      return htmlContent;
    } catch (err) {
      const message = `Failed to get ${htmlType} HTML for "${component}": ${formatError(err)}`;
      logger.error(formatArgs(`❌ ${message}`));
      throw new Error(message);
    }
  },
);

/**
 * Confirms the browser has an open page for readiness checks.
 * @example
 * ```gherkin
 * When I check browser is ready
 * ```
 */
When('I check browser is ready', async ({ browser, page }) => {
  if (page && !page.isClosed()) {
    return true;
  }

  const contexts = browser?.contexts() ?? [];
  const hasWindow = contexts.some((context) =>
    context
      .pages()
      .some((entry) => !entry.isClosed())
  );

  return hasWindow;
});

/**
 * Analyzes the current page and returns structured information for AI agents.
 * Returns: URL, title, main landmarks, interactive elements, forms, and page structure.
 * @example
 * ```gherkin
 * When I analyze current page
 * ```
 */
When(/^I analyze current page$/, async ({ page }) => {
  try {
    const url = page.url();
    const title = await page.title();
    
    const buttons = await page.locator('role=button').evaluateAll((elements) =>
      elements.map((el) => ({
        text: el.textContent?.trim() || '',
        ariaLabel: el.getAttribute('aria-label'),
        disabled: el.getAttribute('aria-disabled') === 'true' || (el as HTMLButtonElement).disabled,
      })).filter((btn) => btn.text || btn.ariaLabel),
    );

    const links = await page.locator('role=link').evaluateAll((elements) =>
      elements.map((el) => ({
        text: el.textContent?.trim() || '',
        href: (el as HTMLAnchorElement).href,
      })).filter((link) => link.text),
    );

    const inputLocator = page.locator('[role="textbox"], [role="combobox"], [role="searchbox"]');
    const inputs = await inputLocator.evaluateAll((elements) =>
      elements.map((el) => ({
        label: el.getAttribute('aria-label') || el.getAttribute('placeholder'),
        type: el.getAttribute('type') || 'text',
        value: (el as HTMLInputElement).value,
      })),
    );

    const headings = await page.locator('role=heading').evaluateAll((elements) =>
      elements.map((el) => ({
        level: el.getAttribute('aria-level') || (el as HTMLHeadingElement).tagName,
        text: el.textContent?.trim() || '',
      })),
    );

    const landmarksLocator = page.locator(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]',
    );
    const landmarks = await landmarksLocator.evaluateAll((elements) =>
      elements.map((el) => ({
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label'),
      })),
    );

    const dialogs = await page.locator('[role="dialog"], [role="alertdialog"]').count();

    const analysis = {
      url,
      title,
      counts: {
        buttons: buttons.length,
        links: links.length,
        inputs: inputs.length,
        headings: headings.length,
        landmarks: landmarks.length,
        dialogs,
      },
      landmarks: landmarks.slice(0, 10),
      headings: headings.slice(0, 10),
      buttons: buttons.slice(0, 20),
      links: links.slice(0, 20),
      inputs: inputs.slice(0, 10),
    };

    const formatted = yaml.stringify(analysis);
    logger.info(formatArgs(`📊 Page analysis:\n${formatted}`));
    return formatted;
  } catch (err) {
    const message = `Failed to analyze page: ${formatError(err)}`;
    logger.error(formatArgs(`❌ ${message}`));
    throw new Error(message);
  }
});

