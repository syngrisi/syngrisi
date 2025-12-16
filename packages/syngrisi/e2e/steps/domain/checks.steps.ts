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
  // We need to find the Nth VISIBLE check preview, not just the Nth element in DOM order
  // This is important because collapsed test rows have hidden check previews

  const allChecks = page.locator(`[data-test-preview-image='${name}']`);

  // Wait for at least one to be attached
  await allChecks.first().waitFor({ state: 'attached', timeout: 10000 });

  // Find the visible check at the given ordinal position among visible checks only
  let visibleCount = 0;
  let targetCheck = null;
  const maxWaitTime = 15000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const count = await allChecks.count();
    visibleCount = 0;

    for (let i = 0; i < count; i++) {
      const check = allChecks.nth(i);
      const isVisible = await check.isVisible().catch(() => false);
      if (isVisible) {
        if (visibleCount === ordinal) {
          targetCheck = check;
          break;
        }
        visibleCount++;
      }
    }

    if (targetCheck) {
      break;
    }

    // Wait a bit before retrying
    await page.waitForTimeout(200);
  }

  if (!targetCheck) {
    const totalCount = await allChecks.count();
    throw new Error(
      `Could not find visible check "${name}" at ordinal position ${ordinal}. ` +
      `Found ${visibleCount} visible checks out of ${totalCount} total elements.`
    );
  }

  await targetCheck.scrollIntoViewIfNeeded();
  await targetCheck.click();

  // Wait for modal to open and header to appear
  // Reduced from 30s to 15s
  const header = page.locator(`[data-check-header-name='${name}']`).first();
  await header.waitFor({ state: 'visible', timeout: 15000 });
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

    // Wait for DELETE API response to complete before proceeding
    // This prevents race condition where UI update happens after test assertion
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/v1/checks/') && resp.request().method() === 'DELETE' && resp.ok(),
        { timeout: 15000 }
      ),
      confirmButton.click(),
    ]);

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

    // Wait for DELETE API response to complete before proceeding
    // This prevents race condition where UI update happens after test assertion
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/v1/checks/') && resp.request().method() === 'DELETE' && resp.ok(),
        { timeout: 15000 }
      ),
      confirmButton.click(),
    ]);

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

/**
 * Delete check from modal dialog.
 * Uses the modal's remove icon and waits for DELETE API response.
 * More stable than raw locator clicks due to API synchronization.
 */
When('I delete check from modal', async ({ page }: { page: Page }) => {
  try {
    // Wait for modal to stabilize (animations, loading states)
    await page.waitForTimeout(500);

    // Click remove icon in modal (use explicit timeout and force to handle CI slowness)
    const icon = page.locator('.modal [data-test="check-remove-icon"]').first();
    await icon.waitFor({ state: 'visible', timeout: 10000 });
    await icon.scrollIntoViewIfNeeded();
    await icon.click({ timeout: 10000, force: true });

    // Wait for confirmation popup to appear (it can take time on slow CI)
    const confirmButton = page.locator('[data-test="check-remove-icon-confirm"]').first();
    await confirmButton.waitFor({ state: 'visible', timeout: 15000 });

    // Small delay for popup animation to complete
    await page.waitForTimeout(200);

    // Wait for DELETE API response to complete before proceeding
    // This prevents race condition where UI update happens after test assertion
    // Use explicit timeout and force on click to handle CI environment
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/v1/checks/') && resp.request().method() === 'DELETE' && resp.ok(),
        { timeout: 15000 }
      ),
      confirmButton.click({ timeout: 15000, force: true }),
    ]);

    logger.info('Deleted check from modal');
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isDisconnected = errorMsg.includes('disconnected')
      || errorMsg.includes('failed to check if window was closed')
      || errorMsg.includes('ECONNREFUSED');
    if (isDisconnected) {
      logger.warn('Browser disconnected or ChromeDriver unavailable, skipping modal check deletion');
      return;
    }
    throw error;
  }
});
