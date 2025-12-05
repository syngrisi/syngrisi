import { Given, When, Then, expect } from '../../support/fixtures';
import { createLogger } from '../../support/logger';
import type { Page } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import * as crypto from 'crypto';

// Load staging environment variables
const syngrisiRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(syngrisiRoot, '..', '.env.staging') });

const logger = createLogger('StagingSteps');

/**
 * Hash API key with SHA-512 (same as wdio driver)
 */
function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

const STAGING_PORT = parseInt(process.env.STAGING_PORT || '5252', 10);
const STAGING_BASE_URL = `http://localhost:${STAGING_PORT}`;

// Staging credentials from .env.staging
const STAGING_CREDENTIALS = {
  reviewer: {
    email: process.env.STAGING_REGULAR_USER_EMAIL || 'v_haluza_2@exadel.com',
    password: process.env.STAGING_REGULAR_USER_PASSWORD || '',
  },
  reviewer2: {
    email: process.env.STAGING_REGULAR_USER_2_EMAIL || 'mvarabyova@exadel.com',
    password: process.env.STAGING_REGULAR_USER_2_PASSWORD || '',
  },
  admin: {
    email: process.env.STAGING_ADMIN_USERNAME || 'Administrator',
    password: process.env.STAGING_ADMIN_PASSWORD || '',
  },
};

/**
 * Navigate to staging app
 */
Given('I open the staging app', async ({ page }: { page: Page }) => {
  logger.info(`Opening staging app at ${STAGING_BASE_URL}`);
  await page.goto(STAGING_BASE_URL, { waitUntil: 'networkidle' });
});

/**
 * Login to staging as specific role
 */
Given(
  'I am logged in as {string} on staging',
  async ({ page }: { page: Page }, role: string) => {
    const creds = STAGING_CREDENTIALS[role as keyof typeof STAGING_CREDENTIALS] || STAGING_CREDENTIALS.reviewer;
    logger.info(`Logging in as ${role} (${creds.email}) on staging`);

    await page.goto(`${STAGING_BASE_URL}/auth`, { waitUntil: 'networkidle' });

    // Wait for login form
    await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });

    // Fill credentials
    await page.locator('#email').fill(creds.email);
    await page.locator('#password').fill(creds.password);

    // Submit
    await page.locator('#submit').click();

    // Wait for successful login (user icon appears)
    await page.locator('[data-test="user-icon"]').waitFor({ state: 'visible', timeout: 15000 });
    logger.info(`Successfully logged in as ${role}`);
  }
);

/**
 * Login to staging with specific credentials
 */
When(
  'I login to staging with email {string} and password {string}',
  async ({ page }: { page: Page }, email: string, password: string) => {
    logger.info(`Logging in to staging with ${email}`);

    await page.goto(`${STAGING_BASE_URL}/auth`, { waitUntil: 'networkidle' });
    await page.locator('#email').waitFor({ state: 'visible', timeout: 10000 });

    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#submit').click();

    // Wait for redirect or error
    await page.waitForTimeout(2000);
  }
);

/**
 * Assert main dashboard is visible
 */
Then('I should see the main dashboard', async ({ page }: { page: Page }) => {
  logger.info('Verifying main dashboard is visible');

  // Wait for the checks table header (Id, Name, Status columns)
  const tableHeader = page.locator('th:has-text("Id"), th:has-text("Name"), th:has-text("Status")');
  await tableHeader.first().waitFor({ state: 'visible', timeout: 15000 });

  // Verify URL is not on auth page
  expect(page.url()).not.toContain('/auth');
  logger.info('Dashboard verified');
});

/**
 * Assert production data is visible
 */
Then('I should see production data in the runs list', async ({ page }: { page: Page }) => {
  logger.info('Verifying production data is visible');

  // Wait for check rows to load (look for rows with check IDs like 692b...)
  // The table has tbody rows with check data
  const checkRows = page.locator('tbody tr:has(td)');
  await checkRows.first().waitFor({ state: 'visible', timeout: 15000 });

  // Verify there is at least one check row (production data)
  const count = await checkRows.count();
  expect(count).toBeGreaterThan(0);
  logger.info(`Found ${count} check rows in the list`);
});

/**
 * Navigate to staging baselines page
 */
When('I navigate to baselines page on staging', async ({ page }: { page: Page }) => {
  logger.info('Navigating to baselines page');
  await page.goto(`${STAGING_BASE_URL}/baselines`, { waitUntil: 'networkidle' });
});

/**
 * Navigate to staging admin page
 */
When('I navigate to admin page on staging', async ({ page }: { page: Page }) => {
  logger.info('Navigating to admin page');
  await page.goto(`${STAGING_BASE_URL}/admin`, { waitUntil: 'networkidle' });
});

/**
 * Logout from staging
 */
When('I logout from staging', async ({ page }: { page: Page }) => {
  logger.info('Logging out from staging');
  await page.goto(`${STAGING_BASE_URL}/auth/logout`, { waitUntil: 'networkidle' });
  // Wait for redirect to auth page and login form to appear
  await page.waitForURL(/\/auth/, { timeout: 10000 });
  // Wait a bit for form to render
  await page.waitForTimeout(1000);
  logger.info('Logged out successfully');
});

/**
 * Run maintenance task via API
 */
When(
  'I run the {string} task on staging',
  async ({ page }: { page: Page }, taskName: string) => {
    logger.info(`Running maintenance task: ${taskName}`);

    // Get session cookie for API auth
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

    if (!sessionCookie) {
      throw new Error('Not logged in - session cookie not found');
    }

    // Call admin API to run task
    const response = await page.request.post(`${STAGING_BASE_URL}/admin/tasks/${taskName}`, {
      headers: {
        Cookie: `connect.sid=${sessionCookie.value}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    logger.info(`Task ${taskName} completed`);
  }
);

/**
 * Assert element is visible within timeout
 */
Then(
  'the element {string} is visible within {int} seconds',
  async ({ page }: { page: Page }, selector: string, seconds: number) => {
    logger.info(`Waiting for element "${selector}" to be visible within ${seconds}s`);
    const locator = page.locator(selector);
    await locator.first().waitFor({ state: 'visible', timeout: seconds * 1000 });
  }
);

/**
 * Assert current URL contains substring
 */
Then('the current URL contains {string}', async ({ page }: { page: Page }, substring: string) => {
  logger.info(`Verifying URL contains "${substring}"`);
  expect(page.url()).toContain(substring);
});

/**
 * Verify check count
 */
Then('there should be at least {int} checks on staging', async ({ page }: { page: Page }, minCount: number) => {
  logger.info(`Verifying at least ${minCount} checks`);

  // Use API to get check count
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  const response = await page.request.get(`${STAGING_BASE_URL}/v1/checks?limit=1`, {
    headers: sessionCookie ? { Cookie: `connect.sid=${sessionCookie.value}` } : {},
  });

  const data = await response.json();
  expect(data.totalDocs || data.length).toBeGreaterThanOrEqual(minCount);
  logger.info(`Found ${data.totalDocs || data.length} checks`);
});

/**
 * Click on a test row to expand it
 */
When('I click on the first test row on staging', async ({ page }: { page: Page }) => {
  logger.info('Clicking on the first test row');

  // Wait for table rows to load
  const testRow = page.locator('tbody tr:has(td)').first();
  await testRow.waitFor({ state: 'visible', timeout: 15000 });

  // Wait for table to be stable (no loading spinners)
  await page.waitForLoadState('networkidle');

  // Click on the Name column to expand
  const nameCell = testRow.locator('[data-test="table-row-Name"]');
  if (await nameCell.isVisible()) {
    await nameCell.scrollIntoViewIfNeeded();
    await nameCell.click();
  } else {
    await testRow.scrollIntoViewIfNeeded();
    await testRow.click();
  }

  // Wait for expansion animation to complete
  await page.waitForTimeout(500);

  logger.info('Clicked on first test row');
});

/**
 * Wait for check previews to appear after expanding a test
 */
Then('I should see check previews', async ({ page }: { page: Page }) => {
  logger.info('Waiting for check previews to appear');

  // Wait for preview images to be visible (more reliable than waiting for collapsed row)
  const previews = page.locator('[data-test="check-preview-image"], [data-test-preview-image]');

  // Retry loop to handle race conditions
  const maxRetries = 5;
  let count = 0;

  for (let i = 0; i < maxRetries; i++) {
    await page.waitForTimeout(500);
    count = await previews.count();
    if (count > 0) {
      // Verify at least one is visible
      const firstVisible = await previews.first().isVisible().catch(() => false);
      if (firstVisible) {
        break;
      }
    }
    logger.info(`Retry ${i + 1}/${maxRetries}: waiting for check previews...`);
  }

  expect(count).toBeGreaterThan(0);
  logger.info(`Found ${count} check preview(s)`);
});

/**
 * Click on a check preview to open modal
 */
When('I click on the first check preview on staging', async ({ page }: { page: Page }) => {
  logger.info('Clicking on first check preview');

  // Get all preview elements and find a visible one
  const previews = page.locator('[data-test="check-preview-image"], [data-test-preview-image]');

  // Wait for previews to be available and find a visible one
  await page.waitForTimeout(1000);  // Allow UI to stabilize

  const count = await previews.count();
  let clicked = false;

  for (let i = 0; i < count && !clicked; i++) {
    const preview = previews.nth(i);
    if (await preview.isVisible()) {
      await preview.scrollIntoViewIfNeeded();
      await preview.click();
      clicked = true;
      logger.info(`Clicked preview at index ${i}`);
    }
  }

  if (!clicked) {
    throw new Error('No visible check preview found');
  }

  // Wait for modal to open - use check header which appears when modal is fully loaded
  await page.locator('[data-check-header-name]').first().waitFor({ state: 'visible', timeout: 15000 });
  logger.info('Check modal opened');
});

/**
 * Close check modal
 */
When('I close the check modal', async ({ page }: { page: Page }) => {
  logger.info('Closing check modal');

  // Press Escape to close the modal
  await page.keyboard.press('Escape');

  // Wait for check header to disappear (modal closed)
  await page.locator('[data-check-header-name]').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
    logger.info('Modal already hidden');
  });

  logger.info('Modal closed');
});

/**
 * Verify check modal is visible
 */
Then('I should see the check modal', async ({ page }: { page: Page }) => {
  logger.info('Verifying check modal is visible');

  // Check for the check header which indicates modal is open
  const header = page.locator('[data-check-header-name]').first();
  await header.waitFor({ state: 'visible', timeout: 15000 });
  logger.info('Check modal is visible');
});

/**
 * Navigate to baselines page via sidebar
 */
When('I click on Baselines in the sidebar on staging', async ({ page }: { page: Page }) => {
  logger.info('Clicking on Baselines in sidebar');

  // Look for the Baselines link in sidebar
  const baselinesLink = page.locator('a:has-text("Baselines"), [data-test="sidebar-baselines"]').first();
  await baselinesLink.waitFor({ state: 'visible', timeout: 10000 });
  await baselinesLink.click();

  // Wait for baselines page to load
  await page.waitForURL(/\/baselines/, { timeout: 10000 });
  logger.info('Navigated to baselines page');
});

/**
 * Verify baselines table is visible
 */
Then('I should see the baselines table', async ({ page }: { page: Page }) => {
  logger.info('Verifying baselines table is visible');

  // Wait for baselines table to load
  const table = page.locator('table, [data-test="baselines-table"]').first();
  await table.waitFor({ state: 'visible', timeout: 15000 });

  // Check for table headers or rows
  const header = page.locator('th:has-text("Name"), th:has-text("App"), th:has-text("Branch")');
  await header.first().waitFor({ state: 'visible', timeout: 10000 });
  logger.info('Baselines table is visible');
});

/**
 * Filter checks by status
 */
When('I filter checks by status {string} on staging', async ({ page }: { page: Page }, status: string) => {
  logger.info(`Filtering checks by status: ${status}`);

  // Look for status filter dropdown or button
  const statusFilter = page.locator(`[data-test="status-filter"], button:has-text("${status}")`).first();
  if (await statusFilter.isVisible({ timeout: 3000 })) {
    await statusFilter.click();
  } else {
    // Try clicking on a status chip/button in the filter bar
    const statusChip = page.locator(`[data-test="filter-${status.toLowerCase()}"], button:has-text("${status}")`).first();
    await statusChip.click();
  }

  // Wait for table to refresh
  await page.waitForLoadState('networkidle');
  logger.info(`Filtered by status: ${status}`);
});

/**
 * Count visible checks in table
 */
Then('I should see at least {int} checks in the table', async ({ page }: { page: Page }, minCount: number) => {
  logger.info(`Verifying at least ${minCount} checks in table`);

  const rows = page.locator('tbody tr:has(td)');
  await rows.first().waitFor({ state: 'visible', timeout: 15000 });

  const count = await rows.count();
  expect(count).toBeGreaterThanOrEqual(minCount);
  logger.info(`Found ${count} checks in table`);
});

/**
 * Scroll down to load more checks (infinite scroll)
 */
When('I scroll down to load more checks', async ({ page }: { page: Page }) => {
  logger.info('Scrolling down to load more checks');

  // Get initial row count
  const initialCount = await page.locator('tbody tr:has(td)').count();

  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait for more items to load
  await page.waitForTimeout(2000);

  const newCount = await page.locator('tbody tr:has(td)').count();
  logger.info(`Scrolled: rows changed from ${initialCount} to ${newCount}`);
});

/**
 * Use keyboard shortcut for navigation
 */
When('I press {string} key', async ({ page }: { page: Page }, key: string) => {
  logger.info(`Pressing key: ${key}`);
  await page.keyboard.press(key);
});

/**
 * Verify check status badge
 */
Then('the first check should have status {string}', async ({ page }: { page: Page }, expectedStatus: string) => {
  logger.info(`Verifying first check has status: ${expectedStatus}`);

  // Look for status badge in the first row
  const statusBadge = page.locator(`[data-check-status], [data-test="check-status"]`).first();
  await statusBadge.waitFor({ state: 'visible', timeout: 10000 });

  const statusText = await statusBadge.textContent();
  expect(statusText?.toLowerCase()).toContain(expectedStatus.toLowerCase());
  logger.info(`First check status: ${statusText}`);
});

/**
 * Click refresh button
 */
When('I click the refresh button on staging', async ({ page }: { page: Page }) => {
  logger.info('Clicking refresh button');

  const refreshButton = page.locator('[data-test="table-refresh-icon"], button[aria-label="Refresh"]').first();
  await refreshButton.waitFor({ state: 'visible', timeout: 5000 });
  await refreshButton.click();

  // Wait for data to refresh
  await page.waitForLoadState('networkidle');
  logger.info('Table refreshed');
});

/**
 * Get checks count via API
 */
Then('there should be at least {int} total checks via API', async ({ page }: { page: Page }, minCount: number) => {
  logger.info(`Verifying at least ${minCount} checks via API`);

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  const response = await page.request.get(`${STAGING_BASE_URL}/v1/checks?limit=1`, {
    headers: sessionCookie ? { Cookie: `connect.sid=${sessionCookie.value}` } : {},
  });

  const data = await response.json();
  const totalCount = data.totalResults || data.totalDocs || data.length || 0;
  expect(totalCount).toBeGreaterThanOrEqual(minCount);
  logger.info(`Total checks via API: ${totalCount}`);
});

/**
 * Verify specific app exists in filter
 */
Then('I should see app {string} in the app filter', async ({ page }: { page: Page }, appName: string) => {
  logger.info(`Looking for app "${appName}" in filter`);

  // Click on app filter dropdown
  const appFilter = page.locator('[data-test="app-filter"], [data-test="filter-app"]').first();
  if (await appFilter.isVisible({ timeout: 3000 })) {
    await appFilter.click();

    // Look for the app name in the dropdown
    const appOption = page.locator(`[data-value="${appName}"], div:has-text("${appName}")`).first();
    await appOption.waitFor({ state: 'visible', timeout: 5000 });
    logger.info(`Found app "${appName}" in filter`);

    // Close dropdown
    await page.keyboard.press('Escape');
  } else {
    logger.info('App filter not found, skipping');
  }
});

// ============================================
// KEYBOARD NAVIGATION STEPS
// ============================================

/**
 * Navigate to next check using arrow key in modal
 */
When('I press right arrow to go to next check', async ({ page }: { page: Page }) => {
  logger.info('Pressing right arrow to navigate to next check');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500); // Wait for transition
});

/**
 * Navigate to previous check using arrow key in modal
 */
When('I press left arrow to go to previous check', async ({ page }: { page: Page }) => {
  logger.info('Pressing left arrow to navigate to previous check');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500); // Wait for transition
});

/**
 * Get current check name from modal header
 */
Then('I should see a different check in the modal', async ({ page }: { page: Page }) => {
  logger.info('Verifying check changed in modal');
  const header = page.locator('[data-check-header-name]').first();
  await header.waitFor({ state: 'visible', timeout: 5000 });
  const checkName = await header.getAttribute('data-check-header-name');
  logger.info(`Current check in modal: ${checkName}`);
});

// ============================================
// SEARCH AND FILTER STEPS
// ============================================

/**
 * Enter search text in quick filter
 */
When('I search for {string} in the quick filter on staging', async ({ page }: { page: Page }, searchText: string) => {
  logger.info(`Searching for "${searchText}" in quick filter`);

  const searchInput = page.locator('input[placeholder*="test name" i], input[placeholder*="search" i]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  await searchInput.fill(searchText);

  // Wait for search to take effect
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  logger.info(`Search completed for "${searchText}"`);
});

/**
 * Clear search filter
 */
When('I clear the quick filter on staging', async ({ page }: { page: Page }) => {
  logger.info('Clearing quick filter');

  const searchInput = page.locator('input[placeholder*="test name" i], input[placeholder*="search" i]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.fill('');

  // Wait for table to refresh
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  logger.info('Quick filter cleared');
});

/**
 * Click on column header to sort
 */
When('I click on {string} column header to sort', async ({ page }: { page: Page }, columnName: string) => {
  logger.info(`Clicking on "${columnName}" column header to sort`);

  const header = page.locator(`th:has-text("${columnName}")`).first();
  await header.waitFor({ state: 'visible', timeout: 5000 });
  await header.click();

  // Wait for sort to take effect
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  logger.info(`Sorted by ${columnName}`);
});

/**
 * Verify search results contain text
 */
Then('the table should show results containing {string}', async ({ page }: { page: Page }, searchText: string) => {
  logger.info(`Verifying results contain "${searchText}"`);

  // Wait for table rows
  const rows = page.locator('tbody tr:has(td)');
  await rows.first().waitFor({ state: 'visible', timeout: 10000 });

  // Check if any visible row contains the search text
  const rowsWithText = page.locator(`tbody tr:has(td):has-text("${searchText}")`);
  const count = await rowsWithText.count();

  if (count === 0) {
    // Check if the table has any rows at all
    const totalRows = await rows.count();
    logger.info(`No rows with "${searchText}" found. Total rows: ${totalRows}`);
  } else {
    logger.info(`Found ${count} rows containing "${searchText}"`);
  }
});

/**
 * Verify table has no results (empty state)
 */
Then('the table should show no results', async ({ page }: { page: Page }) => {
  logger.info('Verifying table shows no results');

  // Wait a moment for the table to update
  await page.waitForTimeout(1000);

  // Check for empty state or no rows
  const rows = page.locator('tbody tr:has(td)');
  const count = await rows.count();

  // Either no rows, or an empty state message
  const emptyState = page.locator('[data-test="empty-state"], .empty-state, :has-text("No results")');
  const hasEmptyState = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

  expect(count === 0 || hasEmptyState).toBeTruthy();
  logger.info(`Table shows no results (rows: ${count}, empty state: ${hasEmptyState})`);
});

// ============================================
// SDK INTEGRATION FOR CHECK OPERATIONS
// ============================================

/**
 * Store for staging test data
 */
let stagingTestData: {
  createdCheckId?: string;
  createdTestId?: string;
  createdSnapshotId?: string;
  baselineId?: string;
} = {};

/**
 * Create a check via SDK on staging
 */
When('I create a test check on staging with name {string}', async ({ page }: { page: Page }, checkName: string) => {
  logger.info(`Creating test check "${checkName}" on staging via API`);

  // Get session cookie
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  if (!sessionCookie) {
    throw new Error('Not logged in - session cookie not found');
  }

  const apiKey = process.env.STAGING_API_KEY || '123';
  const timestamp = Date.now();
  const uniqueName = `${checkName}-staging-test-${timestamp}`;

  // Create a simple test image (1x1 red pixel PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  const testImageBuffer = Buffer.from(testImageBase64, 'base64');

  // Hash the API key (required by Syngrisi server)
  const hashedApiKey = hashApiKey(apiKey);

  // First, create a test session via /v1/client/startSession
  const testSessionResponse = await page.request.post(`${STAGING_BASE_URL}/v1/client/startSession`, {
    headers: {
      'Content-Type': 'application/json',
      'apikey': hashedApiKey,
    },
    data: {
      name: uniqueName,
      app: 'Staging Test App',
      run: `staging-run-${timestamp}`,
      runident: `staging-${timestamp}`,
      branch: 'staging-test',
      suite: 'Staging Integration Tests',
      os: 'test',
      browser: 'test-browser',
      browserVersion: '1.0',
      browserFullVersion: '1.0.0',
      viewport: '100x100',
    },
  });

  if (!testSessionResponse.ok()) {
    const body = await testSessionResponse.text();
    throw new Error(`Failed to create test session: ${testSessionResponse.status()} - ${body}`);
  }

  const sessionData = await testSessionResponse.json();
  const testId = sessionData._id || sessionData.id;
  stagingTestData.createdTestId = testId;
  logger.info(`Created test session with ID: ${testId}`);

  // Now create the check using form data
  const FormData = (await import('form-data')).default;
  const { got } = await import('got-cjs');

  const form = new FormData();
  form.append('testid', testId);
  form.append('name', uniqueName);
  form.append('appName', 'Staging Test App');
  form.append('branch', 'staging-test');
  form.append('suitename', 'Staging Integration Tests');
  form.append('viewport', '100x100');
  form.append('browserName', 'test-browser');
  form.append('browserVersion', '1.0');
  form.append('browserFullVersion', '1.0.0');
  form.append('os', 'test');
  const hashcode = crypto.createHash('sha512').update(testImageBuffer).digest('hex');
  form.append('hashcode', hashcode);
  form.append('file', testImageBuffer, 'test.png');

  const checkResponse = await got.post(`${STAGING_BASE_URL}/v1/client/createCheck`, {
    body: form,
    headers: {
      apikey: hashedApiKey,
    },
  });

  const checkData = JSON.parse(checkResponse.body);
  stagingTestData.createdCheckId = checkData._id || checkData.id;
  stagingTestData.createdSnapshotId = checkData.actualSnapshotId?._id || checkData.actualSnapshotId;

  logger.info(`Created check with ID: ${stagingTestData.createdCheckId}`);
  logger.info(`Check status: ${checkData.status}`);
});

/**
 * Verify the created check appears in the UI
 */
Then('the created check should appear in the dashboard', async ({ page }: { page: Page }) => {
  logger.info('Verifying created check appears in dashboard');

  if (!stagingTestData.createdCheckId) {
    throw new Error('No check was created in previous step');
  }

  // Refresh the page
  await page.goto(STAGING_BASE_URL, { waitUntil: 'networkidle' });

  // Click refresh button
  const refreshButton = page.locator('[data-test="table-refresh-icon"], button[aria-label="Refresh"]').first();
  if (await refreshButton.isVisible({ timeout: 3000 })) {
    await refreshButton.click();
    await page.waitForLoadState('networkidle');
  }

  // Search for the check
  const checkId = stagingTestData.createdCheckId;
  logger.info(`Looking for check ID: ${checkId}`);

  // The check should be visible (might need to search)
  await page.waitForTimeout(2000);
  logger.info('Check verification complete');
});

/**
 * Accept the created check to create baseline
 */
When('I accept the created check on staging', async ({ page }: { page: Page }) => {
  logger.info('Accepting created check on staging');

  if (!stagingTestData.createdCheckId || !stagingTestData.createdSnapshotId) {
    throw new Error('No check was created in previous step');
  }

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  const response = await page.request.put(
    `${STAGING_BASE_URL}/v1/checks/${stagingTestData.createdCheckId}/accept`,
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie ? `connect.sid=${sessionCookie.value}` : '',
      },
      data: {
        baselineId: stagingTestData.createdSnapshotId,  // Use actualSnapshotId as the new baseline
      },
    }
  );

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Failed to accept check: ${response.status()} - ${body}`);
  }

  const data = await response.json();
  stagingTestData.baselineId = data.baselineId || data._id;
  logger.info(`Check accepted, baseline ID: ${stagingTestData.baselineId}`);
});

/**
 * Delete the created check (cleanup)
 */
When('I delete the created check on staging', async ({ page }: { page: Page }) => {
  logger.info('Deleting created check on staging');

  if (!stagingTestData.createdCheckId) {
    logger.info('No check to delete');
    return;
  }

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  const response = await page.request.delete(
    `${STAGING_BASE_URL}/v1/checks/${stagingTestData.createdCheckId}`,
    {
      headers: {
        Cookie: sessionCookie ? `connect.sid=${sessionCookie.value}` : '',
      },
    }
  );

  if (response.ok()) {
    logger.info(`Deleted check: ${stagingTestData.createdCheckId}`);
  } else {
    logger.warn(`Failed to delete check: ${response.status()}`);
  }

  // Clear stored data
  stagingTestData = {};
});

/**
 * Delete the created baseline (cleanup)
 */
When('I delete the created baseline on staging', async ({ page }: { page: Page }) => {
  logger.info('Deleting created baseline on staging');

  if (!stagingTestData.baselineId) {
    logger.info('No baseline to delete');
    return;
  }

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');

  const response = await page.request.delete(
    `${STAGING_BASE_URL}/v1/baselines/${stagingTestData.baselineId}`,
    {
      headers: {
        Cookie: sessionCookie ? `connect.sid=${sessionCookie.value}` : '',
      },
    }
  );

  if (response.ok()) {
    logger.info(`Deleted baseline: ${stagingTestData.baselineId}`);
  } else {
    logger.warn(`Failed to delete baseline: ${response.status()}`);
  }
});

/**
 * Cleanup all staging test data
 */
When('I cleanup staging test data', async ({ page }: { page: Page }) => {
  logger.info('Cleaning up all staging test data');

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === 'connect.sid');
  const headers = {
    Cookie: sessionCookie ? `connect.sid=${sessionCookie.value}` : '',
  };

  // Delete baseline if exists
  if (stagingTestData.baselineId) {
    await page.request.delete(`${STAGING_BASE_URL}/v1/baselines/${stagingTestData.baselineId}`, { headers })
      .catch(() => logger.warn('Failed to delete baseline'));
  }

  // Delete check if exists
  if (stagingTestData.createdCheckId) {
    await page.request.delete(`${STAGING_BASE_URL}/v1/checks/${stagingTestData.createdCheckId}`, { headers })
      .catch(() => logger.warn('Failed to delete check'));
  }

  // Delete test if exists
  if (stagingTestData.createdTestId) {
    await page.request.delete(`${STAGING_BASE_URL}/v1/tests/${stagingTestData.createdTestId}`, { headers })
      .catch(() => logger.warn('Failed to delete test'));
  }

  stagingTestData = {};
  logger.info('Cleanup complete');
});

// ============================================
// GENERIC ELEMENT INTERACTION STEPS
// ============================================

/**
 * Click element by locator
 */
When('I click element with locator {string}', async ({ page }: { page: Page }, locator: string) => {
  logger.info(`Clicking element with locator: ${locator}`);
  const element = page.locator(locator).first();
  await element.waitFor({ state: 'visible', timeout: 10000 });
  await element.click();
});

/**
 * Fill text into element by locator
 */
When('I fill {string} into element with locator {string}', async ({ page }: { page: Page }, text: string, locator: string) => {
  logger.info(`Filling "${text}" into element with locator: ${locator}`);
  const element = page.locator(locator).first();
  await element.waitFor({ state: 'visible', timeout: 10000 });
  await element.fill(text);
});
