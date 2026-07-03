/**
 * Integration test for the built @syngrisi/mcp CLI: spins up a stub HTTP server that
 * fakes the Syngrisi REST endpoints the tools rely on, spawns the compiled `dist/cli.js`
 * as a child process, and drives it via a real MCP client over stdio.
 *
 * Run with: tsx --test tests/server.test.ts (see package.json "test" script).
 * Requires `yarn build` to have produced dist/cli.js first.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http, { type Server } from 'node:http';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// A tiny (4x4 red) valid PNG, used as the stand-in for every snapshot image.
const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEElEQVR4nGP4z8AARwzEcQCukw/x0F8jngAAAABJRU5ErkJggg==';
const TINY_PNG_BUFFER = Buffer.from(TINY_PNG_BASE64, 'base64');

const API_KEY = 'test-api-key';

interface Fixtures {
    run: { id: string; _id: string; name: string; app: string; ident: string; createdDate: string };
    test: { id: string; _id: string; name: string; status: string; run: string };
    check: Record<string, unknown>;
}

const fixtures: Fixtures = {
    run: { id: 'run1', _id: 'run1', name: 'nightly', app: 'app1', ident: 'ident-1', createdDate: '2026-01-01T00:00:00.000Z' },
    test: { id: 'test1', _id: 'test1', name: 'homepage test', status: 'Failed', run: 'run1' },
    check: {
        id: 'check1',
        _id: 'check1',
        name: 'homepage',
        test: 'test1',
        suite: 'suite1',
        app: 'app1',
        run: 'run1',
        branch: 'main',
        status: ['failed'],
        browserName: 'chrome',
        browserVersion: '125',
        viewport: '1024x768',
        os: 'macOS',
        failReasons: ['different_images'],
        result: JSON.stringify({ misMatchPercentage: '12.34', rawMisMatchPercentage: 12.34 }),
        baselineId: 'snap-baseline',
        actualSnapshotId: 'snap-actual',
        diffId: 'snap-diff',
    },
};

const snapshots: Record<string, { id: string; _id: string; name: string; filename: string }> = {
    'snap-baseline': { id: 'snap-baseline', _id: 'snap-baseline', name: 'baseline', filename: 'baseline.png' },
    'snap-actual': { id: 'snap-actual', _id: 'snap-actual', name: 'actual', filename: 'actual.png' },
    'snap-diff': { id: 'snap-diff', _id: 'snap-diff', name: 'diff', filename: 'diff.png' },
};

function populatedCheck(populate: string | null) {
    if (!populate) return fixtures.check;
    const fields = populate.split(',');
    const out: Record<string, unknown> = { ...fixtures.check };
    for (const field of fields) {
        const value = out[field];
        if (typeof value === 'string' && snapshots[value]) {
            out[field] = snapshots[value];
        }
    }
    return out;
}

function paginated<T>(results: T[]) {
    return {
        results,
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: results.length,
        timestamp: Date.now(),
    };
}

let receivedAcceptHeaders: http.IncomingHttpHeaders | undefined;
let receivedAcceptBody: unknown;

function startStubServer(): Promise<Server> {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url || '/', 'http://127.0.0.1');
            const filterRaw = url.searchParams.get('filter');
            const filter = filterRaw ? JSON.parse(filterRaw) : {};
            const populate = url.searchParams.get('populate');

            // Negative-path fixture: force a 500 for a magic run id.
            if (filter.run === 'boom-run' || filter._id === 'boom-run') {
                res.writeHead(500, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ error: 'stub induced failure' }));
                return;
            }

            if (req.method === 'GET' && url.pathname === '/v1/runs') {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify(paginated([fixtures.run])));
                return;
            }

            if (req.method === 'GET' && url.pathname === '/v1/tests') {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify(paginated([fixtures.test])));
                return;
            }

            if (req.method === 'GET' && url.pathname === '/v1/checks') {
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify(paginated([populatedCheck(populate)])));
                return;
            }

            if (req.method === 'PUT' && url.pathname === '/v1/checks/check1/accept') {
                let body = '';
                req.on('data', (chunk) => { body += chunk; });
                req.on('end', () => {
                    receivedAcceptHeaders = req.headers;
                    receivedAcceptBody = JSON.parse(body);
                    res.writeHead(200, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ ...fixtures.check, status: ['passed'], markedAs: 'accepted' }));
                });
                return;
            }

            if (req.method === 'GET' && url.pathname.startsWith('/snapshoots/')) {
                res.writeHead(200, { 'content-type': 'image/png' });
                res.end(TINY_PNG_BUFFER);
                return;
            }

            res.writeHead(404, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: `not found: ${url.pathname}` }));
        });
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

let stubServer: Server;
let stubUrl: string;
let client: Client;
let transport: StdioClientTransport;

before(async () => {
    stubServer = await startStubServer();
    const address = stubServer.address();
    if (!address || typeof address === 'string') throw new Error('failed to determine stub server address');
    stubUrl = `http://127.0.0.1:${address.port}`;

    const cliPath = path.join(__dirname, '..', 'dist', 'cli.js');
    transport = new StdioClientTransport({
        command: process.execPath,
        args: [cliPath],
        env: { SYNGRISI_URL: stubUrl, SYNGRISI_API_KEY: API_KEY },
    });
    client = new Client({ name: 'test-client', version: '0.0.1' });
    await client.connect(transport);
});

after(async () => {
    await client.close();
    await new Promise<void>((resolve) => stubServer.close(() => resolve()));
});

test('tools/list exposes exactly the six documented tools', async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    assert.deepEqual(names, [
        'accept_check',
        'get_check',
        'get_check_images',
        'get_failed_checks',
        'get_run_status',
        'list_runs',
    ]);
});

test('get_run_status aggregates the latest run', async () => {
    const result = await client.callTool({ name: 'get_run_status', arguments: {} });
    assert.equal(result.isError, undefined);
    const content = result.content as Array<{ type: string; text?: string }>;
    const jsonBlock = content[content.length - 1];
    assert.equal(jsonBlock.type, 'text');
    const data = JSON.parse(jsonBlock.text as string);
    assert.equal(data.runId, 'run1');
    assert.equal(data.total, 1);
    assert.equal(data.failed, 1);
    assert.deepEqual(data.failedCheckNames, ['homepage']);
});

test('get_failed_checks returns the mismatch percentage parsed from result JSON', async () => {
    const result = await client.callTool({ name: 'get_failed_checks', arguments: { runId: 'run1' } });
    assert.equal(result.isError, undefined);
    const content = result.content as Array<{ type: string; text?: string }>;
    const jsonBlock = content[content.length - 1];
    const data = JSON.parse(jsonBlock.text as string);
    assert.equal(data.checks.length, 1);
    assert.equal(data.checks[0].id, 'check1');
    assert.equal(data.checks[0].misMatchPercentage, '12.34');
    assert.deepEqual(data.checks[0].failReasons, ['different_images']);
});

test('get_check_images returns an inline image content block', async () => {
    const result = await client.callTool({ name: 'get_check_images', arguments: { checkId: 'check1', which: 'diff' } });
    assert.equal(result.isError, undefined);
    const content = result.content as Array<{ type: string; data?: string; mimeType?: string }>;
    const imageBlock = content.find((c) => c.type === 'image');
    assert.ok(imageBlock, 'expected an image content block');
    assert.equal(imageBlock?.mimeType, 'image/png');
    assert.equal(imageBlock?.data, TINY_PNG_BASE64);
});

test('accept_check PUTs the accept request with the apikey header and a baselineId', async () => {
    const result = await client.callTool({ name: 'accept_check', arguments: { checkId: 'check1' } });
    assert.equal(result.isError, undefined);
    assert.ok(receivedAcceptHeaders, 'stub server should have received the accept request');
    assert.equal(receivedAcceptHeaders?.apikey, API_KEY);
    assert.equal((receivedAcceptBody as { baselineId?: string })?.baselineId, 'snap-actual');
});

test('a server error surfaces as isError: true, never a thrown exception', async () => {
    const result = await client.callTool({ name: 'get_run_status', arguments: { runId: 'boom-run' } });
    assert.equal(result.isError, true);
    const content = result.content as Array<{ type: string; text?: string }>;
    assert.ok(content[0]?.text?.startsWith('Error:'));
});

test('the API key never appears in any tool output', async () => {
    const calls = [
        { name: 'get_run_status', arguments: {} },
        { name: 'get_failed_checks', arguments: { runId: 'run1' } },
        { name: 'get_check', arguments: { checkId: 'check1' } },
        { name: 'get_check_images', arguments: { checkId: 'check1', which: 'diff' } },
    ];
    for (const call of calls) {
        const result = await client.callTool(call);
        const content = result.content as Array<{ type: string; text?: string }>;
        for (const block of content) {
            if (block.type === 'text' && block.text) {
                assert.equal(block.text.includes(API_KEY), false, `leaked API key in ${call.name} output`);
            }
        }
    }
});
