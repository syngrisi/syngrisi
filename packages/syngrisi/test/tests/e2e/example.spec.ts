/* eslint-disable @typescript-eslint/no-explicit-any */
// import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/base';

test('has title @tag1', async ({ page, server, baseUrl, log, request }) => {

  // Define the callback function
  function logRequestParams(request: any) {
    const url = request.url();
    const method = request.method();
    const headers = request.headers();
    const postData = request.postData();

    console.log(`✅ Request made to: ${url}`);
    console.log(`Method: ${method}`);
    console.log(`Headers: ${JSON.stringify(headers, null, 2)}`);
    if (postData) {
      console.log(`Post Data: ${postData}`);
    }
  }

  // Listen for requests
  page.on('request', request => {
    if (request.url().includes('/v1/')) {
      logRequestParams(request);
    }
  });


  await page.goto(baseUrl);

  await page.pause();

  // log.debug("DEBUG");
  // log.info("INFO");
  // log.warn("WARN");
  // log.error("ERROR");
  // log.info('Test');


  // await locator('#test');
  // await page.pause();
  // await page.goto('https://playwright.dev/');

  // // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});


// test('test2 @tag2', async ({ page, server , baseUrl }) => {
//     console.log('test2');
//     await page.goto(baseUrl);
//     // await page.pause();
// });

// test('test3 @no_server', async ({ server, baseUrl }) => {
//   console.log('test3');
// });