import { expect } from '@playwright/test';

import { test } from '../fixtures/test'

test('test @inner',
  {
    tag: ["@obbob", "@asd"],
    annotation: [{
      type: "issues"
    },
    { type: 'category', description: 'report' },
    { type: 'category-111', description: 'reportasd' },

    ]

  },
  async ({ page, locator }) => {
    
    console.log(locator)
    console.log(locator)
    console.log(typeof locator)
    await page.goto('https://www.w3schools.com/howto/howto_js_progressbar.asp', { waitUntil: "domcontentloaded" });
    await page.getByRole('button', { name: 'Run' }).click();

    await expect.poll(
      () => locator('#prlabel').textContent(),
      { timeout: 15_000 }
    ).toBe('100%');
  });