import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/tmp/bounding-overlay-test';

async function main() {
    // Ensure screenshot directory exists
    if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
    const page = await context.newPage();

    try {
        console.log('1. Navigating to Syngrisi...');
        await page.goto(BASE_URL);
        await page.waitForTimeout(1000);

        // Login if needed
        const loginButton = page.getByRole('button', { name: /login/i });
        if (await loginButton.isVisible()) {
            console.log('2. Logging in...');
            await page.getByLabel(/username/i).fill('Guest');
            await page.getByLabel(/password/i).fill('123456');
            await loginButton.click();
            await page.waitForTimeout(2000);
        }

        // Take screenshot of main page
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-main-page.png') });
        console.log('Screenshot: 01-main-page.png');

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Click on a check row in the right table (Name column contains check names)
        console.log('3. Looking for checks in the table...');

        // Click on the first check name link in the table
        const checkNameCell = page.locator('table tbody tr td:nth-child(3)').first();
        if (await checkNameCell.isVisible()) {
            console.log('4. Clicking on check row to open preview...');
            await checkNameCell.click();
            await page.waitForTimeout(2000);

            await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-preview.png') });
            console.log('Screenshot: 02-preview.png');

            // Now click on the preview image to open full CheckDetails
            console.log('5. Clicking on preview image to open CheckDetails...');
            const previewImage = page.locator('[class*="preview"] img, [class*="card"] img, .snapshot-preview img').first();
            if (await previewImage.isVisible()) {
                await previewImage.click();
            } else {
                // Try clicking on any visible image in the preview area
                const anyImage = page.locator('img[src*="snapshot"], img[src*="image"]').first();
                if (await anyImage.isVisible()) {
                    await anyImage.click();
                } else {
                    // Click on the preview card area
                    const previewCard = page.locator('[class*="Card"], [class*="preview"]').first();
                    if (await previewCard.isVisible()) {
                        await previewCard.click();
                    }
                }
            }
            await page.waitForTimeout(3000);

            await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-check-details.png') });
            console.log('Screenshot: 03-check-details.png');

            // Check if we have a canvas (CheckDetails is open)
            const canvas = page.locator('canvas').first();
            if (await canvas.isVisible()) {
                console.log('6. Canvas found - CheckDetails is open');

                // Press 'B' to add bounding region
                console.log('7. Pressing B to add Bounding Region...');
                await page.keyboard.press('b');
                await page.waitForTimeout(1500);
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-with-bounding-region.png') });
                console.log('Screenshot: 04-with-bounding-region.png');

                // Check if overlay is visible
                console.log('8. Bounding region and overlay should be visible');

                // Try to resize the bounding region
                console.log('9. Testing resize of bounding region...');
                const canvasBox = await canvas.boundingBox();
                if (canvasBox) {
                    // Move to corner of bounding region (approximately) and drag
                    const cornerX = canvasBox.x + canvasBox.width - 50;
                    const cornerY = canvasBox.y + canvasBox.height - 50;

                    await page.mouse.move(cornerX, cornerY);
                    await page.mouse.down();
                    await page.mouse.move(cornerX - 100, cornerY - 100, { steps: 10 });
                    await page.waitForTimeout(500);
                    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-after-resize.png') });
                    console.log('Screenshot: 05-after-resize.png');
                    await page.mouse.up();
                }

                // Zoom test with Meta key (Command on Mac)
                console.log('10. Testing zoom...');
                await page.mouse.move(canvasBox!.x + canvasBox!.width / 2, canvasBox!.y + canvasBox!.height / 2);
                await page.keyboard.down('Meta');
                await page.mouse.wheel(0, -200);
                await page.keyboard.up('Meta');
                await page.waitForTimeout(500);
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-after-zoom.png') });
                console.log('Screenshot: 06-after-zoom.png');

                // Pan test
                console.log('11. Testing pan...');
                await page.mouse.wheel(100, 100);
                await page.waitForTimeout(500);
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-after-pan.png') });
                console.log('Screenshot: 07-after-pan.png');

            } else {
                console.log('Canvas not found - CheckDetails may not have opened');
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-no-canvas.png') });
            }
        } else {
            console.log('No check rows found in table.');
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-no-checks.png') });
        }

        console.log('\n=== Test complete ===');
        console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
        console.log('Keeping browser open for 60s for manual inspection...');

        // Keep browser open for manual inspection
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('Error:', error);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error.png') });
    } finally {
        await browser.close();
    }
}

main();
