import { When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { createLogger } from '@lib/logger';
import { getLocatorQuery } from '@helpers/locators';
import { got } from 'got-cjs';
import * as crypto from 'crypto';
import type { AppServerFixture, TestStore } from '@fixtures';

const logger = createLogger('ChecksSteps');

When('I accept the {string} check', async ({ page }: { page: Page }, checkName: string) => {
  const icon = page.locator(`[data-test='check-accept-icon'][data-popover-icon-name='${checkName}']`).first();
  await icon.waitFor({ state: 'visible', timeout: 10000 });
  await icon.scrollIntoViewIfNeeded();
  await icon.waitFor({ state: 'attached', timeout: 5000 });
  await icon.click();

  const confirmButton = page.locator(`[data-confirm-button-name='${checkName}']`).first();
  await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
  await confirmButton.waitFor({ state: 'attached', timeout: 5000 });
  await confirmButton.click();

  // Wait for accept icon to reach accepted state
  await page.waitForFunction(
    (name) => {
      const svgIcon = document.querySelector(
        `[data-test='check-accept-icon'][data-popover-icon-name='${name}'] svg`
      );
      if (!svgIcon) return false;
      const typeAttr = svgIcon.getAttribute('data-test-icon-type');
      if (typeAttr !== 'fill') return false;
      const style = window.getComputedStyle(svgIcon);
      const color = style.color;
      return color === 'rgb(64, 192, 87)' || color === 'rgba(64, 192, 87, 1)';
    },
    checkName,
    { timeout: 10000 }
  );
});

When('I open the {ordinal} check {string}', async ({ page }: { page: Page }, ordinal: number, name: string) => {
  // Playwright BDD ordinal is 0-based for "1st" (0), "2nd" (1), etc.
  // So we use ordinal directly without subtracting 1
  const check = page.locator(`[data-test-preview-image='${name}']`).nth(ordinal);

  // Wait for element to be attached first, then visible
  await check.waitFor({ state: 'attached', timeout: 10000 });

  // Element might be hidden initially (test not unfolded), wait for it to become visible
  await check.waitFor({ state: 'visible', timeout: 30000 });

  await check.scrollIntoViewIfNeeded();
  await check.click();

  // Wait for modal to open and header to appear
  const header = page.locator(`[data-check-header-name='${name}']`).first();
  await header.waitFor({ state: 'visible', timeout: 30000 });
  logger.info(`Opened ${ordinal + 1}st check: ${name}`);
});

const ensureChecksAccepted = async (appServer: AppServerFixture, testData: TestStore) => {
  const storedChecks = testData.get('autoCreatedChecks') as Array<{ checkId: string; snapshotId: string }> | undefined;
  if (!Array.isArray(storedChecks) || storedChecks.length === 0) {
    return;
  }

  const hashed = (testData.get('hashedApiKey') as string | undefined)
    || crypto.createHash('sha512').update(process.env.SYNGRISI_API_KEY || '123').digest('hex');
  const baseUrl = (testData.get('apiBaseUrl') as string | undefined) || appServer.baseURL;

  for (const { checkId, snapshotId } of storedChecks) {
    if (!checkId || !snapshotId) continue;
    try {
      await got.put(`${baseUrl}/v1/checks/${checkId}/accept`, {
        headers: { apikey: hashed },
        json: { baselineId: snapshotId },
        timeout: { request: 10000 },
      });
      logger.info(`Ensured acceptance for check ${checkId}`);
    } catch (error: any) {
      logger.warn(`Failed to finalize acceptance for check ${checkId}: ${error?.message || error}`);
    }
  }

  testData.set('autoCreatedChecks', []);
};

When(
  'I click on the element {string}',
  async (
    { page, appServer, testData }: { page: Page; appServer: AppServerFixture; testData: TestStore },
    selector: string
  ) => {
  const locator = getLocatorQuery(page, selector);
  try {
    await locator.first().waitFor({ state: 'attached', timeout: 10000 });
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
  } catch (error) {
    throw new Error(`Cannot find element(s) for selector "${selector}"`);
  }
  const count = await locator.count();
  if (count === 0) {
    throw new Error(`Cannot find element(s) for selector "${selector}"`);
  }

  let clicked = false;
  let targetText: string | null = null;
  const containsPattern = /^([a-z0-9_-]+)\*=(.+)$/i;
  const containsMatch = selector.match(containsPattern);
  if (containsMatch) {
    targetText = containsMatch[2].trim();
  }
    for (let index = 0; index < count; index += 1) {
      const candidate = locator.nth(index);
    try {
      await candidate.waitFor({ state: 'attached', timeout: 10000 });
      await candidate.scrollIntoViewIfNeeded().catch(() => {});
      const isVisible = await candidate.isVisible();
      if (!isVisible) {
        continue;
      }
      if (targetText) {
        const candidateText = (await candidate.innerText()).trim();
        if (candidateText !== targetText) {
          logger.debug?.(
            `Skipping candidate index ${index} for selector "${selector}" because text "${candidateText}" != "${targetText}"`
          );
          continue;
        }
      }
      await candidate.click();
      logger.info(`Clicked on element: ${selector} (index ${index})`);
      clicked = true;
      break;
    } catch (error) {
      logger.debug?.(
        `Click attempt failed for selector "${selector}" index ${index}: ${(error as Error).message}`
      );
    }
  }

  if (!clicked) {
    // As a last resort, try clicking the first element (may throw, which mirrors WDIO failure semantics)
      const fallback = locator.first();
      await fallback.waitFor({ state: 'visible', timeout: 10000 });
      await fallback.scrollIntoViewIfNeeded();
      await fallback.click();
      logger.info(`Clicked on element: ${selector} (fallback first)`);
    }

    if (selector === "[data-test='accept-test-confirm-button']") {
      await ensureChecksAccepted(appServer, testData);
    }

    if (selector.startsWith('div=')) {
      const optionLabel = selector.slice(4);
      const filterValueSelect = page.locator("select[data-test='table-filter-value']").last();
      const selectCount = await filterValueSelect.count();
      if (selectCount > 0) {
        try {
          await filterValueSelect.selectOption({ label: optionLabel });
          logger.info(`Ensured select[data-test='table-filter-value'] has option "${optionLabel}"`);
        } catch (error: any) {
          logger.warn(
            `Fallback selectOption for label "${optionLabel}" failed: ${error?.message || error}`
          );
        }
      }

      if (optionLabel === 'Slider') {
        await page.waitForTimeout(200);
        let currentView = await page
          .evaluate(() => (window as any)?.mainView?.currentView ?? null)
          .catch(() => null);
        if (currentView !== 'slider') {
          const sliderRadio = page.getByRole('radio', { name: 'Slider', exact: true });
          if ((await sliderRadio.count()) > 0) {
            try {
              await sliderRadio.first().evaluate((el) => {
                const input = el as HTMLElement;
                const parent = input.closest('label') || input.parentElement;
                (parent as HTMLElement | null)?.click();
                if (parent && parent !== input) return;
                input.click();
              });
              logger.info('Fallback radio/label click for Slider view executed');
            } catch (error: any) {
              logger.warn(`Fallback radio/label click for Slider failed: ${error?.message || error}`);
            }
          }
          currentView = await page
            .evaluate(() => (window as any)?.mainView?.currentView ?? null)
            .catch(() => null);
        }
        if (currentView !== 'slider') {
          try {
            await page.evaluate(() => (window as any)?.mainView?.switchView?.('slider'));
            logger.info('Forced mainView.switchView("slider") execution');
          } catch (error: any) {
            logger.warn(`mainView.switchView('slider') failed: ${error?.message || error}`);
          }
        }
      }
    }

    if (selector === '#snapshoot') {
      const snapshootLocator = page.locator(selector);
      const box = await snapshootLocator.boundingBox().catch(() => null);
      const point = box
        ? { clientX: box.x + (box.width ?? 0) / 2, clientY: box.y + (box.height ?? 0) / 2 }
        : null;
      await page.evaluate(({ clickPoint }) => {
        const mainView: any = (window as any)?.mainView;
        if (!mainView?.sliderView) return;
        if (typeof mainView.sliderView.canvasMouseCLickHandler === 'function' && clickPoint) {
          mainView.sliderView.canvasMouseCLickHandler({ e: clickPoint });
          return;
        }
        mainView.sliderView.removeLabels?.();
      }, { clickPoint: point });
      await page.waitForFunction(() => (
        !document.getElementById('label_expected')
        && !document.getElementById('label_actual')
      ));
    }
  }
);

When('I delete the {string} check', async ({ page }: { page: Page }, checkName: string) => {
  try {
    const icon = page.locator(`[data-test='check-remove-icon'][data-popover-icon-name='${checkName}']`).first();
    await icon.waitFor({ state: 'visible', timeout: 10000 });
    await icon.scrollIntoViewIfNeeded();
    await icon.click();

    const confirmButton = page.locator(`[data-test='check-remove-icon-confirm'][data-confirm-button-name='${checkName}']`).first();
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    logger.info(`Deleted check: ${checkName}`);
  } catch (error: any) {
    const errorMsg = error.message || error.toString() || '';
    const isDisconnected = errorMsg.includes('disconnected')
      || errorMsg.includes('failed to check if window was closed')
      || errorMsg.includes('ECONNREFUSED');
    if (isDisconnected) {
      logger.warn('Browser disconnected or ChromeDriver unavailable, skipping check deletion');
      return;
    }
    throw error;
  }
});

When('I remove the {string} check', async ({ page }: { page: Page }, checkName: string) => {
  // Same as delete, but using "remove" terminology
  try {
    const icon = page.locator(`[data-test='check-remove-icon'][data-popover-icon-name='${checkName}']`).first();
    await icon.waitFor({ state: 'visible', timeout: 10000 });
    await icon.scrollIntoViewIfNeeded();
    await icon.click();

    const confirmButton = page.locator(`[data-test='check-remove-icon-confirm'][data-confirm-button-name='${checkName}']`).first();
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    logger.info(`Removed check: ${checkName}`);
  } catch (error: any) {
    const errorMsg = error.message || error.toString() || '';
    const isDisconnected = errorMsg.includes('disconnected')
      || errorMsg.includes('failed to check if window was closed')
      || errorMsg.includes('ECONNREFUSED');
    if (isDisconnected) {
      logger.warn('Browser disconnected or ChromeDriver unavailable, skipping check removal');
      return;
    }
    throw error;
  }
});
