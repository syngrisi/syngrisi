import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  test.info().attach('OOOOOOOOOO', {body: '<button>OOOOOOO</button>', contentType: "text/html"})
  await page.goto('https://playwright.dev');
  page.evaluate(()=>{
    return document.querySelector('[alt="Browsers (Chromium, Firefox, WebKit)"]').width=111;
  })

  // await expect(page).toHaveScreenshot("Oboba.png");

});