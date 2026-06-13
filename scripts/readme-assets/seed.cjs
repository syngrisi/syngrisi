/**
 * Seeds the local Syngrisi instance with realistic visual checks (passed + failed)
 * by rendering a self-contained demo dashboard and pushing screenshots through the
 * official @syngrisi/playwright-sdk. Used only to generate README marketing screenshots.
 *
 * Prereq: Syngrisi running at SYNGRISI_URL (default http://localhost:3000), auth off.
 * Run:    node scripts/readme-assets/seed.cjs
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');
const { PlaywrightDriver } = require('../../packages/playwright-sdk/dist/PlaywrightDriver.js');

const SYNGRISI_URL = (process.env.SYNGRISI_URL || 'http://localhost:3000').replace(/\/$/, '') + '/';
const API_KEY = process.env.SYNGRISI_API_KEY || '123';
const HTML = fs.readFileSync(path.join(__dirname, 'demo-site/index.html'), 'utf8');
const SITE_PORT = 5599;

const meta = {
  app: 'Acme Analytics',
  branch: 'main',
  os: 'macOS',
  browserName: 'chromium',
  browserVersion: '131',
  viewport: '1440x900',
};

const checks = [
  { name: 'Dashboard — Full Page', sel: null },
  { name: 'KPI Cards', sel: 'section.kpis' },
  { name: 'Weekly Active Users', sel: '#bars' },
  { name: 'Traffic Sources', sel: '#donut' },
  { name: 'Top Campaigns', sel: 'section.card:last-of-type' },
];

async function shot(page, sel) {
  if (!sel) return await page.screenshot({ fullPage: true });
  return await page.locator(sel).screenshot();
}

async function runSession(page, { run, runident, suite, tags, version, autoAccept }) {
  const driver = new PlaywrightDriver({ page, url: SYNGRISI_URL, apiKey: API_KEY });
  await driver.startTestSession({ params: { ...meta, test: 'Marketing Dashboard', run, runident, suite, tags } });
  await page.goto(`http://localhost:${SITE_PORT}/${version === 2 ? '?v=2' : ''}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const domDump = await driver.collectDomDump(); // explicit DOM capture for RCA
  console.log('   dom dump bytes:', domDump ? JSON.stringify(domDump).length : 'null');
  for (const c of checks) {
    const imageBuffer = await shot(page, c.sel);
    // skipDomData:false + explicit domDump forces DOM upload for RCA (opt-in in the SDK).
    const params = { skipDomData: false, ...(autoAccept ? { autoAccept: true } : {}) };
    await driver.check({ checkName: c.name, imageBuffer, params, domDump });
  }
  await driver.stopTestSession();
}

(async () => {
  const server = http.createServer((_req, res) => { res.setHeader('Content-Type', 'text/html'); res.end(HTML); });
  await new Promise((r) => server.listen(SITE_PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  try {
    console.log('🌱 Baseline run (v1, auto-accepted)…');
    await runSession(page, { run: 'Baseline Run', runident: `baseline-${Date.now()}`, suite: 'Web Dashboard', tags: ['baseline', 'smoke'], version: 1, autoAccept: true });

    console.log('✅ Nightly run (v1, should pass)…');
    await runSession(page, { run: 'Nightly Build #482', runident: `nightly-${Date.now()}`, suite: 'Web Dashboard', tags: ['nightly', 'smoke'], version: 1, autoAccept: false });

    console.log('❌ Regression run (v2, should fail with diffs)…');
    await runSession(page, { run: 'PR #1043 — chart refactor', runident: `pr-${Date.now()}`, suite: 'Web Dashboard', tags: ['pr', 'regression'], version: 2, autoAccept: false });

    console.log('Done seeding.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
