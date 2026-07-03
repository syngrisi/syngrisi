/**
 * Feature-grouped demo seeder for Syngrisi.
 *
 * Each test seeds ONE product feature and names its run after that feature, so the
 * runs list in the UI reads as a feature tour. All examples use REAL fixtures from
 * the test app: images from packages/syngrisi/tests/files and RCA DOM pages from
 * packages/syngrisi/e2e/fixtures/rca-test-scenarios.
 *
 * Requires a server started with (see run-demo.sh):
 *   SYNGRISI_AUTH=false SYNGRISI_RCA=true SYNGRISI_AI_TRIAGE_ENABLED=true
 * and this seeder run with SYNGRISI_DISABLE_DOM_DATA=false (so DOM is transmitted).
 */
import { test } from '@playwright/test';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';
import * as fs from 'fs';
import * as path from 'path';

const SYNGRISI_URL = (process.env.SYNGRISI_URL || 'http://localhost:3000').replace(/\/$/, '') + '/';
const SYNGRISI_API_KEY = process.env.SYNGRISI_API_KEY || '123';

const FILES = path.join(__dirname, '../../packages/syngrisi/tests/files');
const RCA = path.join(__dirname, '../../packages/syngrisi/e2e/fixtures/rca-test-scenarios/html-changes');
const img = (name: string) => fs.readFileSync(path.join(FILES, name));

// Real image fixtures reused as demo examples.
const A = img('A.png');            // canonical baseline
const B = img('B.png');            // clearly-different actual (~5.7% diff)
const LOW0 = img('low_diff_0.png'); // small-diff pair (tolerant demo)
const LOW1 = img('low_diff_1.png');
const ANTI_OFF = img('anti_off.png'); // anti-aliasing pair
const ANTI_ON = img('anti_on.png');
const PEOPLE1 = img('People1.png');
const PEOPLE2 = img('People2.png');

// --- raw HTTP helpers (auth is OFF on the demo server, so no auth header needed) ---
async function api(pathname: string, method = 'GET', body?: unknown) {
    const res = await fetch(SYNGRISI_URL + pathname.replace(/^\//, ''), {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => null);
    return { status: res.status, json };
}
async function apiChecked(label: string, pathname: string, method: string, body?: unknown) {
    const res = await api(pathname, method, body);
    if (res.status < 200 || res.status >= 300) {
        console.warn(`  ! ${label} → HTTP ${res.status}: ${JSON.stringify(res.json)?.slice(0, 160)}`);
    }
    return res;
}
const setFakeProvider = (fakeVerdict: string, fakeConfidence: number, fakeReason: string) =>
    apiChecked('setProvider', 'v1/settings/ai_triage_provider', 'PATCH', {
        value: { type: 'fake', model: 'fake', fakeVerdict, fakeConfidence, fakeReason },
        enabled: true,
    });
const setAppTriagePolicy = (appId: string, body: unknown) => apiChecked('appPolicy', `v1/app/${appId}/triage-policy`, 'PATCH', body);
const runTriage = (checkId: string) => apiChecked('triageRun', `ai/triage/${checkId}/run`, 'POST');
const putBaseline = (baselineId: string, body: unknown) => apiChecked('putBaseline', `v1/baselines/${baselineId}`, 'PUT', body);

/** Resolve the VRSBaseline document id from an accepted snapshot id (needed for PUT /v1/baselines/:id). */
async function getBaselineId(snapshotId: string): Promise<string | undefined> {
    const filter = encodeURIComponent(JSON.stringify({ snapshootId: snapshotId }));
    const { json } = await api(`v1/baselines?filter=${filter}&limit=1`);
    return json?.results?.[0]?._id;
}

type Ident = {
    app: string; test: string; run: string; suite?: string; branch?: string;
    tags?: string[]; os?: string; browserName?: string; viewport?: string;
};

function makeDriver(page: any, autoAccept = false) {
    return new PlaywrightDriver({ page, url: SYNGRISI_URL, apiKey: SYNGRISI_API_KEY, autoAccept });
}

async function session(driver: PlaywrightDriver, id: Ident, suffix: string) {
    await driver.startTestSession({
        params: {
            app: id.app, test: id.test, run: id.run,
            runident: `${id.run}-${suffix}-${Date.now()}`,
            branch: id.branch || 'main', suite: id.suite || 'Demo',
            tags: id.tags || [], os: id.os || 'macOS',
            browserName: id.browserName || 'chromium', browserVersion: '131',
            viewport: id.viewport || '1920x1080',
        },
    });
}

/** Create a baseline check and accept it; returns the VRSBaseline id (for PUT ops) + app id. */
async function makeBaseline(driver: PlaywrightDriver, id: Ident, checkName: string, image: Buffer) {
    await session(driver, id, 'base');
    const res: any = await driver.check({ checkName, imageBuffer: image, params: {} });
    await driver.stopTestSession();
    const snapshotId = res.actualSnapshotId;
    await driver.acceptCheck({ checkId: res._id, baselineId: snapshotId });
    const baselineId = await getBaselineId(snapshotId); // VRSBaseline._id, differs from snapshotId
    return { baselineId, snapshotId, checkId: res._id, appId: res.app as string };
}

/** Submit an actual check against an existing baseline; returns the failed/passed check. */
async function makeActual(driver: PlaywrightDriver, id: Ident, checkName: string, image: Buffer) {
    await session(driver, id, 'actual');
    const res: any = await driver.check({ checkName, imageBuffer: image, params: {} });
    await driver.stopTestSession();
    return res;
}

test.describe('Syngrisi Demo Seed', () => {
    const APP = 'Demo Web App';

    test('Passing', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Login Page', run: 'Passing', suite: 'Auth', tags: ['smoke'] };
        await makeBaseline(d, id, 'Login Page', A);
        await makeActual(d, id, 'Login Page', A); // identical → passed
    });

    test('Regression (failed diff)', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Dashboard', run: 'Regression', suite: 'Main', tags: ['smoke', 'critical'] };
        await makeBaseline(d, id, 'Dashboard', A);
        await makeActual(d, id, 'Dashboard', B); // ~5.7% diff → failed
    });

    test('New baselines', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Reports', run: 'New Baselines', suite: 'Analytics', tags: ['new'] };
        // fresh, never accepted → status "new"
        await session(d, id, 'new');
        await d.check({ checkName: 'Reports · Overview', imageBuffer: PEOPLE1, params: {} });
        await d.check({ checkName: 'Reports · Details', imageBuffer: PEOPLE2, params: {} });
        await d.stopTestSession();
    });

    test('Match: Tolerant', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Pricing Table', run: 'Match · Tolerant', suite: 'Match Types' };
        const { baselineId } = await makeBaseline(d, id, 'Pricing Table', LOW0);
        if (baselineId) await putBaseline(baselineId, { matchType: 'tolerant', toleranceThreshold: 5 });
        await makeActual(d, id, 'Pricing Table', LOW1); // small diff, tolerated
    });

    test('Match: Anti-aliasing', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Typography', run: 'Match · Anti-aliasing', suite: 'Match Types' };
        const { baselineId } = await makeBaseline(d, id, 'Typography', ANTI_OFF);
        if (baselineId) await putBaseline(baselineId, { matchType: 'antialiasing' });
        await makeActual(d, id, 'Typography', ANTI_ON);
    });

    test('Ignore Regions', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Home Banner', run: 'Ignore Regions', suite: 'Match Types' };
        const { baselineId } = await makeBaseline(d, id, 'Home Banner', A);
        // Mask a region so the changed area is excluded from comparison.
        if (baselineId) await putBaseline(baselineId, { ignoreRegions: JSON.stringify([{ left: 0, top: 0, right: 400, bottom: 200 }]) });
        await makeActual(d, id, 'Home Banner', B);
    });

    test('AI Triage (verdicts)', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Checkout', run: 'AI Triage', suite: 'AI', tags: ['ai'] };
        await makeBaseline(d, id, 'Checkout · Cart', A);
        // Global triage is on via env (SYNGRISI_AI_TRIAGE_ENABLED=true). We drive verdicts
        // synchronously via POST /ai/triage/:id/run and deliberately do NOT enable the app
        // for the background scheduler, so each check gets exactly the verdict we set below.

        // One failed check per verdict flavour, triaged deterministically via the fake provider.
        const cases: Array<[string, string, number, string]> = [
            ['Checkout · Cart', 'likely_bug', 9, 'Submit button overlaps the total'],
            ['Checkout · Shipping', 'noise', 8, 'Timestamp text differs, cosmetic only'],
            ['Checkout · Payment', 'intended_change', 8, 'New promo banner is an intended change'],
            ['Checkout · Review', 'noise', 3, 'Low confidence — will be masked to unknown'],
        ];
        for (const [name, verdict, confidence, reason] of cases) {
            // ensure a baseline exists for this check name, then fail it
            if (name !== 'Checkout · Cart') await makeBaseline(d, { ...id, test: 'Checkout' }, name, A);
            const actual = await makeActual(d, { ...id, test: 'Checkout' }, name, B);
            await setFakeProvider(verdict, confidence, reason);
            await runTriage(actual._id);
        }
    });

    test('AI Auto-Accept (policy)', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Marketing', run: 'AI Auto-Accept', suite: 'AI', tags: ['ai'] };
        const first = await makeBaseline(d, id, 'Marketing · Hero', A);
        const appId = first.appId;
        // Auto-accept policy is applied inside triageCheck (POST /ai/triage/:id/run), so it
        // works without enabling the app for the scheduler.
        if (appId) {
            await setAppTriagePolicy(appId, {
                triagePolicy: { policy: 'auto', autoAcceptThreshold: 9, autoAcceptVerdicts: ['noise', 'intended_change'] },
            });
        }
        // noise@10 → auto-accepted
        const a1 = await makeActual(d, id, 'Marketing · Hero', B);
        await setFakeProvider('noise', 10, 'Font smoothing only — safe to accept');
        await runTriage(a1._id);
        // likely_bug@10 → never auto-accepted (stays failed for human review)
        await makeBaseline(d, id, 'Marketing · Footer', A);
        const a2 = await makeActual(d, id, 'Marketing · Footer', B);
        await setFakeProvider('likely_bug', 10, 'Footer links broken');
        await runTriage(a2._id);
    });

    test('RCA (DOM root cause)', async ({ page }) => {
        const d = makeDriver(page);
        const id: Ident = { app: APP, test: 'Content Page', run: 'RCA', suite: 'RCA', tags: ['rca'] };
        const pairs: Array<[string, string, string]> = [
            ['Content · Added elements', 'base.html', 'added-elements.html'],
            ['Content · Text change', 'base.html', 'text-change.html'],
            ['Content · Broken layout', 'base.html', 'broken-layout.html'],
        ];
        for (const [checkName, baseHtml, changedHtml] of pairs) {
            // Baseline: real DOM + screenshot of the base page.
            // collectDom captures the live DOM; skipDomData:false forces transmission.
            await page.goto('file://' + path.join(RCA, baseHtml));
            await session(d, id, 'rca-base');
            const base: any = await d.check({ checkName, imageBuffer: await page.screenshot(), params: { skipDomData: false }, collectDom: true });
            await d.stopTestSession();
            await d.acceptCheck({ checkId: base._id, baselineId: base.actualSnapshotId });
            // Actual: changed page → failed check with DOM, so the RCA panel has data to diff
            await page.goto('file://' + path.join(RCA, changedHtml));
            await session(d, id, 'rca-actual');
            await d.check({ checkName, imageBuffer: await page.screenshot(), params: { skipDomData: false }, collectDom: true });
            await d.stopTestSession();
        }
    });

    test('Cross-browser & viewports', async ({ page }) => {
        const d = makeDriver(page);
        const matrix: Array<[string, string, string]> = [
            ['chromium', '1920x1080', 'macOS'],
            ['firefox', '1366x768', 'Windows'],
            ['webkit', '390x844', 'iOS'],
        ];
        for (const [browserName, viewport, os] of matrix) {
            const id: Ident = { app: APP, test: 'Landing', run: 'Cross-browser', suite: 'Compatibility', browserName, viewport, os };
            await makeBaseline(d, id, `Landing · ${browserName}`, A);
            await makeActual(d, id, `Landing · ${browserName}`, browserName === 'firefox' ? B : A);
        }
    });

    test('Branches', async ({ page }) => {
        const d = makeDriver(page);
        for (const branch of ['main', 'develop', 'feature/new-nav', 'release/v2.0']) {
            const id: Ident = { app: APP, test: 'Nav Bar', run: 'Branches', suite: 'Branching', branch };
            await makeBaseline(d, id, `Nav Bar · ${branch}`, A);
            await makeActual(d, id, `Nav Bar · ${branch}`, branch.startsWith('feature') ? B : A);
        }
    });
});
