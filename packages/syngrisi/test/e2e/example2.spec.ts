import { test, expect } from '@playwright/test';

test.describe('Describe group', () => {
  test('has title', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });
})




test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('article')).toContainText('How to install Playwright');

  await expect(page.getByRole('link', { name: 'How to install Playwright' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Trace viewer' })).t
  await page.locator('p').filter({ hasText: 'You will learn' }).click();
  await page.getByRole('link', { name: 'Canary releases' }).click();
  await page.getByRole('button', { name: 'Playwright Test' }).click();oBeVisible();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();



  // await expect(page.getByRole('ww')).toBeVisible({ timeout: 123 })


})
