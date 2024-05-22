import { test, expect, TestInfo } from '@playwright/test';


test.describe.skip('ssssss', () => {
  const xxx = Math.random() > 0.5

  console.log('👹', xxx)
  test.skip(() => xxx)

  test('random', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/shifting_content/image?mode=random');
    await expect(page.locator('#content').getByRole('img')).toBeVisible();
    await page.locator('#content').getByRole('img').click();
    await page.waitForTimeout(500)
    // await page.reload()
    page.evaluate(() => {
      Math.random() < 0.5 && document.querySelector('img.shift')?.remove();
    })

    await page.waitForTimeout(500)



    // test.info().attach("PIPKA", { body: "asdasdasd", contentType: 'text/plain' })

    // await expect(page.locator('img.shift')).toBeVisible({ timeout: 300 });
  });
})


test("Serfing @pipka @dripka", async ({ page }) => {
  test.step('123 @stepppp', async ()=>{
    await page.goto('https://playwright.dev/');
    await page.getByRole('link', { name: 'star_' }).click({timeout: 10000000});
  })

  await expect(page.getByRole('link', { name: 'Installing Playwright', exact: true })).toBeVisible({timeout: 10_000});
  await page.getByRole('link', { name: 'Installing Playwright', exact: true }).click();
  await page.getByLabel('Search').click();
  await page.getByPlaceholder('Search docs').fill('step');
  await page.getByPlaceholder('Search docs').press('Enter');
})


