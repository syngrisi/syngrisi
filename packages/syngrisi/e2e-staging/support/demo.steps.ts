import { When } from './fixtures';
import type { Page } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load local .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SKIP_DEMO = process.env.SKIP_DEMO_TESTS === 'true';

/**
 * Announce message (with optional pause)
 */
When('I announce: {string}', async ({ page }: { page: Page }, message: string) => {
  if (SKIP_DEMO) return;
  console.log(`📢 ${message}`);
  await page.waitForTimeout(1500);
});

When('I announce: {string} and PAUSE', async ({ page }: { page: Page }, message: string) => {
  if (SKIP_DEMO) return;
  console.log(`📢 ${message}`);
  console.log('⏸️  PAUSED - Press any key in the browser to continue...');
  await page.pause();
});

/**
 * Highlight element
 */
When('I highlight element {string}', async ({ page }: { page: Page }, selector: string) => {
  if (SKIP_DEMO) return;
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      (el as HTMLElement).style.outline = '3px solid #ff0000';
      (el as HTMLElement).style.outlineOffset = '2px';
    }
  }, selector);
});

/**
 * Clear highlight
 */
When('I clear highlight', async ({ page }: { page: Page }) => {
  if (SKIP_DEMO) return;
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
    });
  });
});

/**
 * End demo with confetti
 */
When('I end the demo', async ({ page }: { page: Page }) => {
  if (SKIP_DEMO) return;
  console.log('🎉 Demo completed!');
  await page.waitForTimeout(1000);
});

/**
 * Wait for seconds
 */
When('I wait {int} second(s)', async ({ page }: { page: Page }, seconds: number) => {
  await page.waitForTimeout(seconds * 1000);
});
