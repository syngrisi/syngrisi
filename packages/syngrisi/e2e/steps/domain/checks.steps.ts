import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';

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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
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

