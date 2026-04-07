const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/a1/Project/syngrisi/node_modules/playwright');

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = '/tmp/settings-panel-compare';

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
        await loc.screenshot({ path: path.join(outDir, `${label}-${name}.png`) });
    }
    return result;
}

async function openSettings(page, url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.locator('[data-test="table-sorting"]').click();
    await page.waitForTimeout(700);
}

(async () => {
    for (const [kind, url] of Object.entries(targets)) {
        const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
        const page = await browser.newPage({ viewport: { width: 2048, height: 1083 }, deviceScaleFactor: 1 });

        await openSettings(page, url);
        await page.screenshot({ path: path.join(outDir, `${kind}-full.png`) });

        const data = await collect(page, {
            settingsToolbar: '[data-test="table-sorting"]',
            filterToolbar: '[data-test="table-filtering"]',
            title: 'text=Settings',
            drawer: '[role="dialog"]',
            close: '[data-test="relative-wrapper-icon"]',
            sortBy: '[data-test="table-sort-by-select"]',
            sortOrder: '[data-test="table-sort-order"]',
            visibleId: '[data-test="settings-visible-columns-Id"]',
            visibleName: '[data-test="settings-visible-columns-Name"]',
            visibleStatus: '[data-test="settings-visible-columns-Status"]',
            previewMode: '[data-test="preview-mode-segment-control"]',
            previewSize: '[data-test="preview-size-segment-control"]',
        }, kind);

        fs.writeFileSync(path.join(outDir, `${kind}.json`), JSON.stringify(data, null, 2));
        await browser.close();
    }
    console.log(outDir);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
