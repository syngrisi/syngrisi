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
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Wait for potential redirects (e.g., auth redirects) - client-side redirects may take time
  try {
    // Wait for navigation to complete (including client-side redirects)
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });
    await page.waitForTimeout(2000); // Additional wait for client-side redirects
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
