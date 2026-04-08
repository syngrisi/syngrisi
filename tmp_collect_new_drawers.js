const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/a1/Project/syngrisi/node_modules/playwright');

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = '/tmp/grid-drawers-compare';
fs.mkdirSync(outDir, { recursive: true });

async function collect(page, names) {
    const result = {};
    for (const [name, selector] of Object.entries(names)) {
        const loc = page.locator(selector).first();
        if (!(await loc.count())) continue;
        if (!(await loc.isVisible())) continue;
        const box = await loc.boundingBox();
        const styles = await loc.evaluate((el) => {
            const cs = getComputedStyle(el);
            return {
                text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
                color: cs.color,
                backgroundColor: cs.backgroundColor,
                fontSize: cs.fontSize,
                lineHeight: cs.lineHeight,
                fontWeight: cs.fontWeight,
                padding: cs.padding,
                margin: cs.margin,
                borderRadius: cs.borderRadius,
            };
        });
        result[name] = { ...box, ...styles };
    }
    return result;
}

async function openDrawer(page, type) {
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const selector = type === 'filter'
        ? '[data-test="table-filtering"]'
        : '[data-test="table-sorting"]';
    await page.locator(selector).click();
    await page.waitForTimeout(700);
}

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 2048, height: 1083 }, deviceScaleFactor: 1 });

    await openDrawer(page, 'filter');
    await page.screenshot({ path: path.join(outDir, 'new-filter-full.png') });
    const filterData = await collect(page, {
        filterToolbar: '[data-test="table-filtering"]',
        settingsToolbar: '[data-test="table-sorting"]',
        reset: '[data-test="table-filter-reset"]',
        cancel: '[data-test="table-filter-cancel"]',
        apply: '[data-test="table-filter-apply"]',
        mainGroup: '[data-test="filter-main-group"]',
        relativeClose: '[data-test="relative-wrapper-icon"]',
    });
    fs.writeFileSync(path.join(outDir, 'new-filter.json'), JSON.stringify(filterData, null, 2));

    await openDrawer(page, 'settings');
    await page.screenshot({ path: path.join(outDir, 'new-settings-full.png') });
    const settingsData = await collect(page, {
        filterToolbar: '[data-test="table-filtering"]',
        settingsToolbar: '[data-test="table-sorting"]',
        sortBy: '[data-test="table-sort-by-select"]',
        sortOrder: '[data-test="table-sort-order"]',
        visibleId: '[data-test="settings-visible-columns-Id"]',
        visibleName: '[data-test="settings-visible-columns-Name"]',
        previewMode: '[data-test="preview-mode-segment-control"]',
        previewSize: '[data-test="preview-size-segment-control"]',
        relativeClose: '[data-test="relative-wrapper-icon"]',
    });
    fs.writeFileSync(path.join(outDir, 'new-settings.json'), JSON.stringify(settingsData, null, 2));

    await browser.close();
    console.log(outDir);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
