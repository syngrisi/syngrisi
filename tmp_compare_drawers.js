const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/a1/Project/syngrisi/node_modules/playwright');

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = '/tmp/grid-drawers-compare';

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const targets = {
    old: 'http://127.0.0.1:5555/',
    new: 'http://127.0.0.1:3000/',
};

async function collect(page, names, label) {
    const result = {};
    for (const [name, selector] of Object.entries(names)) {
        const loc = page.locator(selector).first();
        if (!(await loc.count())) continue;
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
        await loc.screenshot({ path: path.join(outDir, `${label}-${name}.png`) });
    }
    return result;
}

async function openDrawer(page, url, type) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const selector = type === 'filter'
        ? '[data-test="table-filtering"]'
        : '[data-test="table-sorting"]';
    await page.locator(selector).click();
    await page.waitForTimeout(600);
}

(async () => {
    for (const [kind, url] of Object.entries(targets)) {
        const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
        const page = await browser.newPage({ viewport: { width: 2048, height: 1083 }, deviceScaleFactor: 1 });

        await openDrawer(page, url, 'filter');
        await page.screenshot({ path: path.join(outDir, `${kind}-filter-full.png`) });
        const filterData = await collect(page, {
            filterToolbar: '[data-test="table-filtering"]',
            settingsToolbar: '[data-test="table-sorting"]',
            drawerTitle: 'text=Filter',
            drawer: '[role="dialog"]',
            reset: '[data-test="table-filter-reset"]',
            cancel: '[data-test="table-filter-cancel"]',
            apply: '[data-test="table-filter-apply"]',
            mainGroup: '[data-test="filter-main-group"]',
        }, `${kind}-filter`);
        fs.writeFileSync(path.join(outDir, `${kind}-filter.json`), JSON.stringify(filterData, null, 2));

        await openDrawer(page, url, 'settings');
        await page.screenshot({ path: path.join(outDir, `${kind}-settings-full.png`) });
        const settingsData = await collect(page, {
            filterToolbar: '[data-test="table-filtering"]',
            settingsToolbar: '[data-test="table-sorting"]',
            drawerTitle: 'text=Settings',
            drawer: '[role="dialog"]',
            sortBy: '[data-test="table-sort-by-select"]',
            sortOrder: '[data-test="table-sort-order"]',
            visibleId: '[data-test="settings-visible-columns-Id"]',
            visibleName: '[data-test="settings-visible-columns-Name"]',
            previewMode: '[data-test="preview-mode-segment-control"]',
            previewSize: '[data-test="preview-size-segment-control"]',
        }, `${kind}-settings`);
        fs.writeFileSync(path.join(outDir, `${kind}-settings.json`), JSON.stringify(settingsData, null, 2));

        await browser.close();
    }
    console.log(outDir);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
