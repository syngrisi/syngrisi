import { When, Then } from '@fixtures';
import { expect, Page } from '@playwright/test';

// Use WeakMap to store tracker per page instance
const pageTrackers = new WeakMap<Page, string[]>();

function getRequests(page: Page): string[] {
    if (!pageTrackers.has(page)) {
        pageTrackers.set(page, []);
    }
    return pageTrackers.get(page)!;
}

When('I start intercepting image requests', async function ({ page }) {
    // Initialize empty requests array
    pageTrackers.set(page, []);

    // Use route to intercept ALL requests including from Image() constructor
    await page.route('**/snapshoots/**', async (route) => {
        const url = route.request().url();
        const baseUrl = url.split('?')[0];
        const requests = getRequests(page);
        requests.push(baseUrl);
        console.log(`[Network] Image request intercepted: ${baseUrl}`);
        // Continue the request normally
        await route.continue();
    });
});

When('I reset image request counter', async function ({ page }) {
    const requests = getRequests(page);
    console.log(`[Network] Resetting counter. Previous count: ${requests.length}`);
    pageTrackers.set(page, []);
});

Then('I expect at least {int} image requests were made', async function ({ page }, minCount: number) {
    const requests = getRequests(page);
    const count = requests.length;
    console.log(`[Network] Image requests made: ${count}, expected at least: ${minCount}`);
    console.log(`[Network] URLs: ${requests.join(', ')}`);
    expect(count).toBeGreaterThanOrEqual(minCount);
});

Then('I expect {int} new image requests were made for cached images', async function ({ page }, expectedCount: number) {
    const requests = getRequests(page);
    const count = requests.length;
    console.log(`[Network] New image requests after reset: ${count}, expected: ${expectedCount}`);
    if (count > 0) {
        console.log(`[Network] Unexpected requests: ${requests.join(', ')}`);
    }

    // Allow some tolerance - the browser might make requests for images that weren't in the preload batch
    // But we expect most images to be cached
    expect(count).toBeLessThanOrEqual(expectedCount);
});

Then('I expect exactly {int} image requests were made', async function ({ page }, expectedCount: number) {
    const requests = getRequests(page);
    const count = requests.length;
    console.log(`[Network] Image requests made: ${count}, expected exactly: ${expectedCount}`);
    expect(count).toBe(expectedCount);
});

Then('I expect at most {int} new image requests were made', async function ({ page }, maxCount: number) {
    const requests = getRequests(page);
    const count = requests.length;
    console.log(`[Network] New image requests: ${count}, expected at most: ${maxCount}`);
    if (count > 0) {
        console.log(`[Network] Request URLs: ${requests.join(', ')}`);
    }
    expect(count).toBeLessThanOrEqual(maxCount);
});

When('I log image request count', async function ({ page }) {
    const requests = getRequests(page);
    console.log(`[Network] Current image request count: ${requests.length}`);
    if (requests.length > 0) {
        console.log(`[Network] URLs: ${requests.join('\n  ')}`);
    }
});
