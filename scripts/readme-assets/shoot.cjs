/**
 * Captures Syngrisi UI screenshots for the root README.
 * Prereq: Syngrisi running with seeded data (see seed.cjs).
 * Run: node scripts/readme-assets/shoot.cjs
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const SY = (process.env.SYNGRISI_URL || 'http://localhost:3000').replace(/\/$/, '');
const OUT = path.join(__dirname, '../../assets/screenshots');
fs.mkdirSync(OUT, { recursive: true });
const W = 1440, H = 900;
const save = (page, name, opts = {}) => page.screenshot({ path: path.join(OUT, name), ...opts });

async function failedCheckId(name) {
  const res = await fetch(`${SY}/v1/checks?take=80`).then(r => r.json());
  const c = (res.results || []).find(x => x.name === name && String(x.status).includes('failed'));
  if (!c) throw new Error(`failed check not found: ${name}`);
  return c._id;
}

async function openCheck(page, id) {
  await page.goto(`${SY}/?checkId=${id}&modalIsOpen=true`, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 20000 });
  await page.waitForTimeout(2500); // fabric draws images
}

(async () => {
  const fullPageId = await failedCheckId('Executive Dashboard — Full Page');
  const weeklyId = await failedCheckId('Revenue Over Time');

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // 1) Dashboard (hero)
  await page.goto(SY + '/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-test="table_row_0"]', { timeout: 20000 });
  await page.waitForTimeout(1200);
  await save(page, 'dashboard.png');
  console.log('✓ dashboard.png');

  // 2) Expanded test → grid of visual checks (thumbnails of the dashboard)
  await page.locator('[data-test="table_row_0"]').click();
  await page.waitForTimeout(2000);
  await save(page, 'checks-grid.png');
  console.log('✓ checks-grid.png');

  // 3) Diff viewer — full page (the money shot)
  await openCheck(page, fullPageId);
  await save(page, 'diff-fullpage.png');
  console.log('✓ diff-fullpage.png');

  // 3b) Root Cause Analysis panel (toggle with 'D' — requires DOM snapshots)
  await page.keyboard.press('d');
  await page.waitForTimeout(2500);
  await save(page, 'rca.png');
  console.log('✓ rca.png');

  // 4) Diff viewer — chart (clean single-element diff)
  await openCheck(page, weeklyId);
  await save(page, 'diff-chart.png');
  console.log('✓ diff-chart.png');

  // 5) Subtle diff + difference highlighting (a ~0.1% change on a few globe points)
  const globeId = await failedCheckId('Global Reach (Globe)');
  await openCheck(page, globeId);
  // Fit view: the 3 shifted points are tiny magenta specks, easy to miss.
  await save(page, 'diff-subtle.png');
  console.log('✓ diff-subtle.png');
  // Zoom into the globe, then trigger "difference highlighting" (enabled in diff
  // mode when mismatch < 5%) — pulsing markers reveal exactly which points changed.
  await page.evaluate(() => {
    const cv = window.mainView && window.mainView.canvas;
    if (!cv) return;
    cv.setZoom(2.4);
    cv.absolutePan({ x: (cv.getZoom() * cv.getWidth() / 2) - cv.getWidth() / 2, y: (cv.getZoom() * cv.getHeight() / 2) - cv.getHeight() / 2 });
    cv.renderAll();
  });
  await page.waitForTimeout(500);
  const hl = page.locator('[data-check="highlight-icon"]');
  if (await hl.getAttribute('data-disabled') === 'true') {
    console.log('! highlight disabled — skipping');
  } else {
    await hl.click();
    await page.waitForTimeout(420); // catch the highlight pulse near its peak
    await save(page, 'diff-highlight.png');
    console.log('✓ diff-highlight.png');
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
