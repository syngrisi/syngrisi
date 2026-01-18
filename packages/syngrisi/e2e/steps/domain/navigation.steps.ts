import { When, Then } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { AppServerFixture, TestStore } from '@fixtures';
import { expect } from '@playwright/test';
import { renderTemplate } from '@helpers/template';
import { env } from '@config';
import { ensureServerReady } from '@utils/app-server';

const logger = createLogger('NavigationSteps');

When('I go to {string} page', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }, pageName: string) => {
  // Use appServer.baseURL if available, otherwise construct from host and port
  const baseURL = appServer.baseURL || `http://${env.E2E_BACKEND_HOST || 'localhost'}:${appServer.serverPort || 3002}`;

  const pages: Record<string, string> = {
    main: `${baseURL}/`,
    baselines: `${baseURL}/baselines`,
    first_run: `${baseURL}/auth/change?first_run=true`,
    runs: `${baseURL}/`,
    change_password: `${baseURL}/auth/change`,
    logout: `${baseURL}/auth/logout`,
    admin2: `${baseURL}/admin`,
    logs: `${baseURL}/admin/logs`,
    settings: `${baseURL}/admin/settings`,
    plugins: `${baseURL}/admin/plugins`,
    "admin/settings": `${baseURL}/admin/settings`,
    "admin/plugins": `${baseURL}/admin/plugins`,
  };

  const adminPages: Record<string, Record<string, string>> = {
    admin: {
      users: `${baseURL}/admin?task=users`,
      tasks: `${baseURL}/admin/tasks/handle_old_checks`,
      orphan_baselines: `${baseURL}/admin/tasks/handle_orphan_baselines`,
    },
  };

  let url: string;
  if (pageName.includes('>')) {
    const [page, subPage] = pageName.split('>');
    url = adminPages[page]?.[subPage] || pages[pageName];
  } else {
    url = pages[pageName];
  }

  if (!url) {
    throw new Error(`Unknown page: ${pageName}`);
  }

  // Ensure server is ready before navigation to avoid ERR_CONNECTION_REFUSED
  if (appServer.serverPort) {
    await ensureServerReady(appServer.serverPort);
  }

  logger.info(`Navigating to ${url}`);
  const initialUrl = page.url();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Wait for potential redirects (e.g., auth redirects) - client-side redirects may take time
  try {
    // Wait for navigation to complete (including client-side redirects)
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });
    // Only wait for redirect stabilization if URL actually changed (redirect happened)
    const currentUrl = page.url();
    if (currentUrl !== initialUrl && currentUrl !== url) {
      // A redirect occurred - wait briefly for any further redirects to settle
      await page.waitForTimeout(500);
    }
    // For main page, wait for React app to render the table container
    if (pageName === 'main') {
      await page.waitForSelector('[data-test="table-scroll-area"]', { timeout: 10000 }).catch(() => {
        logger.warn('Table scroll area not found after navigation to main page');
      });

      // Always click Refresh twice after navigating to main page to ensure we see the latest data
      // This is necessary because:
      // 1. The UI uses timestamp-based filtering which may not include tests created just before navigation
      // 2. The first refresh resets the timestamp, but new items may still be arriving
      // 3. A second refresh after a brief delay ensures all data is captured
      const refreshButton = page.locator('[data-test="table-refresh-icon"]');

      // First refresh: reset timestamp filter to current time
      if (await refreshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        logger.info('First Refresh click to reset timestamp filter after navigation to main page');
        await refreshButton.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });
        await page.waitForTimeout(1000); // Wait for UI to update and any late data to arrive
      }

      // Second refresh: capture any items that arrived during first refresh
      // Check for new items badge first
      const newItemsBadge = page.locator('[data-test="table-refresh-icon-badge"]');
      const hasBadge = await newItemsBadge.isVisible({ timeout: 1000 }).catch(() => false);

      if (hasBadge || await refreshButton.isVisible({ timeout: 500 }).catch(() => false)) {
        logger.info(`Second Refresh click (badge visible: ${hasBadge}) to ensure all data is loaded`);
        await refreshButton.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });
        await page.waitForTimeout(500);
      }
    }
  } catch (e) {
    // Continue anyway
  }
});

Then('the current url contains {string}', async ({ page, testData }: { page: Page; testData: TestStore }, expectedUrl: string) => {
  const renderedUrl = renderTemplate(expectedUrl, testData);
  // Wait for URL to contain the expected string (redirects may happen via JavaScript)
  try {
    await page.waitForURL(`**/*${renderedUrl}*`, { timeout: 10000 });
  } catch (e) {
    // If waitForURL fails, try waitForFunction as fallback
    try {
      await page.waitForFunction(
        (url) => window.location.href.includes(url),
        renderedUrl,
        { timeout: 5000 }
      );
    } catch (e2) {
      // If both fail, check current URL anyway
    }
  }
  // Wait for URL to contain the expected string (with longer timeout for redirects)
  const maxWaitTime = 10000;
  const startTime = Date.now();
  let urlMatches = false;
  let currentUrl = '';

  while (Date.now() - startTime < maxWaitTime && !urlMatches) {
    await page.waitForTimeout(200);
    currentUrl = page.url();
    // Check both full URL and pathname (as old framework checks full URL with toContain)
    try {
      const urlObj = new URL(currentUrl);
      const urlPath = urlObj.pathname + urlObj.search;
      urlMatches = currentUrl.includes(renderedUrl) || urlPath.includes(renderedUrl);
    } catch (e) {
      // If URL parsing fails, just check the string
      urlMatches = currentUrl.includes(renderedUrl);
    }
    if (urlMatches) break;
  }

  // Final check
  currentUrl = page.url();
  try {
    const urlObj = new URL(currentUrl);
    const urlPath = urlObj.pathname + urlObj.search;
    const urlPathDecoded = decodeURIComponent(urlPath);
    const renderedUrlDecoded = decodeURIComponent(renderedUrl);
    // Check both encoded and decoded versions
    const matches = currentUrl.includes(renderedUrl)
      || urlPath.includes(renderedUrl)
      || urlPathDecoded.includes(renderedUrlDecoded)
      || currentUrl.includes(renderedUrlDecoded)
      || urlPath.includes(renderedUrlDecoded); // Also check if decoded expected is in encoded path
    if (!matches) {
      throw new Error(`Expected URL to contain "${renderedUrl}", but got "${currentUrl}" (path: "${urlPath}", decoded path: "${urlPathDecoded}")`);
    }
  } catch (e: any) {
    // If URL parsing fails or assertion fails, check the string (both encoded and decoded)
    if (e.message && e.message.includes('Expected URL')) {
      throw e; // Re-throw our custom error
    }
    const decodedCurrent = decodeURIComponent(currentUrl);
    const decodedExpected = decodeURIComponent(renderedUrl);
    const matches = currentUrl.includes(renderedUrl) || decodedCurrent.includes(decodedExpected);
    if (!matches) {
      throw new Error(`Expected URL to contain "${renderedUrl}", but got "${currentUrl}"`);
    }
  }
});

// Navbar synchronization steps
When('I wait for navbar filter to sync', async ({ page }) => {
  await page.waitForSelector('[data-test-filter-synced="true"]', { timeout: 15000 });
});

When('I wait for navbar to be ready', async ({ page }) => {
  await page.waitForSelector('[data-test-navbar-ready="true"]', { timeout: 15000 });
});

When('I wait for table to stabilize', async ({ page }) => {
  // Wait for network to be idle to ensure all API calls are complete
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
  // Additional stabilization - allow React to finish rendering
  await page.waitForTimeout(300);
});

/**
 * Gets share URL from Share Check modal and stores it in testData
 */
When('I save the share URL', async ({ page, testData }: { page: Page; testData: TestStore }) => {
  logger.info('Saving share URL from input field');

  // Wait for the Share Check modal to be visible
  const shareModal = page.getByRole('dialog', { name: 'Share Check' });
  await shareModal.waitFor({ state: 'visible', timeout: 15000 });

  let shareUrl = '';

  // Find the textbox inside the Share Check modal - it contains the share URL
  try {
    const textbox = shareModal.getByRole('textbox');
    if (await textbox.count() > 0) {
      shareUrl = await textbox.inputValue();
      logger.info(`Got URL from textbox.inputValue: ${shareUrl}`);
    }
  } catch (e) {
    logger.info(`textbox.inputValue failed: ${(e as Error).message}`);
  }

  // Fallback: Get all text content from modal and extract URL
  if (!shareUrl) {
    const modalText = await shareModal.textContent() || '';
    const urlMatch = modalText.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      shareUrl = urlMatch[0].trim();
      logger.info(`Got URL from textContent: ${shareUrl}`);
    }
  }

  if (!shareUrl) {
    throw new Error('Share URL not found in Share Check modal');
  }

  testData.set('shareUrl', shareUrl);
  logger.info(`Saved share URL: ${shareUrl}`);
});

/**
 * Opens the previously saved share URL
 */
When('I open the saved share URL', async ({ page, testData }: { page: Page; testData: TestStore }) => {
  const shareUrl = testData.get('shareUrl') as string;

  if (!shareUrl) {
    throw new Error('Share URL not saved. Use "I save the share URL" step first.');
  }

  logger.info(`Opening saved share URL: ${shareUrl}`);
  await page.goto(shareUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => { });
});

/**
 * Opens the shared check URL from the share input field (immediate - modal must be open)
 * Gets the URL from [data-test="share-url-input"] input and navigates to it
 */
When('I open the shared check URL', async ({ page }: { page: Page }) => {
  logger.info('Getting share URL from input field');

  // Wait for the Share Check modal to be visible
  const shareModal = page.getByRole('dialog', { name: 'Share Check' });
  await shareModal.waitFor({ state: 'visible', timeout: 15000 });

  let shareUrl = '';

  // Find the textbox inside the Share Check modal - it contains the share URL
  try {
    const textbox = shareModal.getByRole('textbox');
    if (await textbox.count() > 0) {
      // For input elements, inputValue gets the value
      shareUrl = await textbox.inputValue();
      logger.info(`Got URL from textbox.inputValue: ${shareUrl}`);
    }
  } catch (e) {
    logger.info(`textbox.inputValue failed: ${(e as Error).message}`);
  }

  // Fallback: Get all text content from modal and extract URL
  if (!shareUrl) {
    const modalText = await shareModal.textContent() || '';
    const urlMatch = modalText.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      shareUrl = urlMatch[0].trim();
      logger.info(`Got URL from textContent: ${shareUrl}`);
    }
  }

  if (!shareUrl) {
    throw new Error('Share URL not found in Share Check modal');
  }

  logger.info(`Opening share URL: ${shareUrl}`);
  await page.goto(shareUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => { });
});
