/**
 * Live smoke test for @syngrisi/mcp against a REAL, running Syngrisi instance.
 *
 * This is intentionally excluded from `yarn test` (see package.json "smoke:live" script) —
 * it needs its own server + Mongo database, seeds real data via the REST API (mirroring
 * @syngrisi/core-api's SyngrisiApi request format), and drives the built MCP CLI as a
 * separate child process.
 *
 * Prerequisites (see the plan / worktree notes for exact setup):
 *  - A Syngrisi server built and running with SYNGRISI_AUTH=false on SYNGRISI_URL
 *    (default http://localhost:3310), pointed at its own Mongo database.
 *  - `yarn build` already run for this package (dist/cli.js must exist).
 *
 * Run with: yarn smoke:live
 */
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { SyngrisiApi, ErrorObject, CheckResponse, SessionResponse } from '@syngrisi/core-api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const SYNGRISI_URL = process.env.SYNGRISI_URL || 'http://localhost:3310/';

// Two tiny (4x4) but distinct PNGs, so the second check fails against the first's baseline.
const RED_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGP4z8AARwzEcQCukw/x0F8jngAAAABJRU5ErkJggg==', 'base64');
const BLUE_PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGNgYPiPhIjiAACOsw/xs6MvMwAAAABJRU5ErkJggg==', 'base64');

const sha512 = (buf: Buffer) => createHash('sha512').update(buf).digest('hex');

const ident = {
    name: 'mcp-smoke-check',
    viewport: '400x300',
    browserName: 'chrome',
    os: 'macOS',
    app: 'mcp-smoke-app',
    branch: 'main',
};

function isError(result: unknown): result is ErrorObject {
    return !!result && typeof result === 'object' && 'error' in result && (result as ErrorObject).error === true;
}

function fail(message: string): never {
    // eslint-disable-next-line no-console
    console.error(`FAIL: ${message}`);
    process.exit(1);
}

async function seed(): Promise<{ checkId: string; runId: string }> {
    const api = new SyngrisiApi({ url: SYNGRISI_URL });

    // --- Session 1: create the initial ("new") check and accept it as the baseline ---
    const session1 = await api.startSession({
        run: 'mcp-smoke-run-1',
        suite: 'mcp-smoke-suite',
        runident: randomUUID(),
        name: ident.name,
        viewport: ident.viewport,
        browser: ident.browserName,
        browserVersion: '125',
        browserFullVersion: '125.0.0.0',
        os: ident.os,
        app: ident.app,
        branch: ident.branch,
    });
    if (isError(session1)) fail(`startSession (1) failed: ${JSON.stringify(session1)}`);
    const testId1 = (session1 as SessionResponse).id;

    const check1 = await api.coreCheck(RED_PNG, {
        name: ident.name,
        viewport: ident.viewport,
        browserName: ident.browserName,
        os: ident.os,
        app: ident.app,
        branch: ident.branch,
        testId: testId1,
        suite: 'mcp-smoke-suite',
        browserVersion: '125',
        browserFullVersion: '125.0.0.0',
        hashCode: sha512(RED_PNG),
        skipDomData: true,
    });
    if (isError(check1)) fail(`coreCheck (1, baseline) failed: ${JSON.stringify(check1)}`);
    const check1Response = check1 as CheckResponse;
    console.log(`seed: created baseline check ${check1Response._id} with status '${check1Response.status}'`);

    // A brand-new check's `baselineId` already points at its own actual snapshot
    // (see baseline.service.ts inspectBaseline: params.baselineId = currentSnapshot.id
    // when there's no accepted baseline yet) — accept it to create the real baseline.
    const accepted1 = await api.acceptCheck(check1Response._id, check1Response.baselineId);
    if (isError(accepted1)) fail(`acceptCheck (1) failed: ${JSON.stringify(accepted1)}`);

    await api.stopSession(testId1);

    // --- Session 2: same ident, different image -> should fail against the new baseline ---
    const session2 = await api.startSession({
        run: 'mcp-smoke-run-2',
        suite: 'mcp-smoke-suite',
        runident: randomUUID(),
        name: ident.name,
        viewport: ident.viewport,
        browser: ident.browserName,
        browserVersion: '125',
        browserFullVersion: '125.0.0.0',
        os: ident.os,
        app: ident.app,
        branch: ident.branch,
    });
    if (isError(session2)) fail(`startSession (2) failed: ${JSON.stringify(session2)}`);
    const testId2 = (session2 as SessionResponse).id;
    const runId2 = (session2 as SessionResponse).run;

    const check2 = await api.coreCheck(BLUE_PNG, {
        name: ident.name,
        viewport: ident.viewport,
        browserName: ident.browserName,
        os: ident.os,
        app: ident.app,
        branch: ident.branch,
        testId: testId2,
        suite: 'mcp-smoke-suite',
        browserVersion: '125',
        browserFullVersion: '125.0.0.0',
        hashCode: sha512(BLUE_PNG),
        skipDomData: true,
    });
    if (isError(check2)) fail(`coreCheck (2, failing) failed: ${JSON.stringify(check2)}`);
    const check2Response = check2 as CheckResponse;
    console.log(`seed: created failing check ${check2Response._id} with status '${check2Response.status}'`);
    if (!String(check2Response.status).includes('failed')) {
        fail(`expected the second check to fail, got status '${check2Response.status}'`);
    }

    await api.stopSession(testId2);

    return { checkId: check2Response._id, runId: runId2 };
}

async function main(): Promise<void> {
    const { checkId, runId } = await seed();

    const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');
    const transport = new StdioClientTransport({
        command: process.execPath,
        args: [cliPath],
        env: { SYNGRISI_URL },
    });
    const client = new Client({ name: 'smoke-live-client', version: '0.0.1' });
    await client.connect(transport);

    let passCount = 0;
    const assert = (condition: boolean, message: string) => {
        if (condition) {
            console.log(`PASS: ${message}`);
            passCount += 1;
        } else {
            fail(message);
        }
    };

    // 1. get_run_status: 1 failed check on the freshly seeded run
    const statusResult = await client.callTool({ name: 'get_run_status', arguments: { runId } });
    assert(statusResult.isError !== true, 'get_run_status did not error');
    const statusJson = JSON.parse((statusResult.content as Array<{ text?: string }>).at(-1)?.text || '{}');
    assert(statusJson.failed === 1, `get_run_status reports 1 failed test (got ${statusJson.failed})`);

    // 2. get_check_images: diff image is returned as an inline image block
    const imagesResult = await client.callTool({ name: 'get_check_images', arguments: { checkId, which: 'diff' } });
    assert(imagesResult.isError !== true, 'get_check_images did not error');
    const hasImage = (imagesResult.content as Array<{ type: string }>).some((c) => c.type === 'image');
    assert(hasImage, 'get_check_images returned an inline diff image');

    // 3. accept_check: the check becomes accepted, verified via a direct GET
    const acceptResult = await client.callTool({ name: 'accept_check', arguments: { checkId } });
    assert(acceptResult.isError !== true, 'accept_check did not error');

    const verifyRes = await fetch(`${SYNGRISI_URL}v1/checks?filter=${encodeURIComponent(JSON.stringify({ _id: checkId }))}&limit=1`);
    const verifyJson = await verifyRes.json() as { results: Array<{ markedAs?: string }> };
    assert(verifyJson.results[0]?.markedAs === 'accepted', `check ${checkId} is marked accepted after accept_check`);

    await client.close();

    console.log(`\n${passCount}/3 assertions passed. PASS`);
}

main().catch((err) => {
    console.error(`FAIL: unexpected error: ${err instanceof Error ? err.stack : String(err)}`);
    process.exit(1);
});
