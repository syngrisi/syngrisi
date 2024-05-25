// import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/base';

test('has title @tag1', async ({ page, server, baseUrl, log }) => {
  
  await page.goto(baseUrl);

    log.debug("DEBUG");
    log.info("INFO");
    log.warn("WARN");
    log.error("ERROR");
    log.info('Test');
    

  // await locator('#test');
  // await page.pause();
  // await page.goto('https://playwright.dev/');

  // // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});


test('test2 @tag2', async ({ page, server , baseUrl }) => {
    console.log('test2');
    await page.goto(baseUrl);
    // await page.pause();
});

test('test3 @no_server', async ({ server, baseUrl }) => {
  console.log('test3');
});