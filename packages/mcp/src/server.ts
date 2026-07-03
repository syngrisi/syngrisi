import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
    SyngrisiClient,
    CheckDoc,
    SnapshotDoc,
    snapshotIdOf,
} from './api';

// MCP `image` content block, mirrored locally to avoid importing SDK internals.
interface ImageBlock {
    type: 'image';
    data: string;
    mimeType: string;
}

interface TextBlock {
    type: 'text';
    text: string;
}

type ContentBlock = TextBlock | ImageBlock;

interface ToolResult {
    [key: string]: unknown;
    content: ContentBlock[];
    isError?: boolean;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB guard, see plan step 2.5

function text(value: string): TextBlock {
    return { type: 'text', text: value };
}

function json(value: unknown): TextBlock {
    return text(JSON.stringify(value, null, 2));
}

function ok(summary: string, data: unknown, extra: ContentBlock[] = []): ToolResult {
    return { content: [text(summary), ...extra, json(data)] };
}

function errorResult(message: string): ToolResult {
    return { content: [text(`Error: ${message}`)], isError: true };
}

function messageOf(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

/** Best-effort parse of a Check's `result` JSON string field (see Check.schema.ts). */
function parseCheckResult(result: string | undefined): { misMatchPercentage?: string | number; rawMisMatchPercentage?: number } {
    if (!result) return {};
    try {
        return JSON.parse(result);
    } catch {
        return {};
    }
}

function snapshotFilename(field: string | SnapshotDoc | null | undefined): string | undefined {
    if (!field || typeof field === 'string') return undefined;
    return field.filename;
}

/** Resolve the latest run id when the caller didn't pin one down. */
async function resolveRunId(client: SyngrisiClient, runId: string | undefined): Promise<string | undefined> {
    if (runId) return runId;
    const latest = await client.listRuns({}, { limit: 1 });
    return latest.results[0]?.id;
}

async function resolveAppFilter(client: SyngrisiClient, app: string | undefined): Promise<Record<string, unknown>> {
    if (!app) return {};
    // `app` on a Run is an App ObjectId reference (no denormalized name), so try to
    // resolve a human-friendly app name to its id first; fall back to using the
    // provided value verbatim (it may already be an id).
    try {
        const found = await client.listApps({ name: app }, { limit: 1 });
        if (found.results[0]?.id) return { app: found.results[0].id };
    } catch {
        // ignore resolution failure, fall back below
    }
    return { app };
}

function summarizeCheck(check: CheckDoc) {
    const { misMatchPercentage } = parseCheckResult(check.result);
    return {
        id: check.id,
        name: check.name,
        browserName: check.browserName,
        viewport: check.viewport,
        os: check.os,
        branch: check.branch,
        misMatchPercentage: misMatchPercentage ?? null,
        failReasons: check.failReasons ?? [],
    };
}

export function createServer(client: SyngrisiClient): McpServer {
    const server = new McpServer({
        name: 'syngrisi-mcp',
        version: '0.1.0',
    });

    server.registerTool(
        'list_runs',
        {
            title: 'List Syngrisi runs',
            description: 'List recent Syngrisi test runs, newest first. Optionally filter by app name/id.',
            inputSchema: {
                app: z.string().optional().describe('App name or id to filter runs by'),
                limit: z.number().int().positive().max(100).optional().describe('Max number of runs to return (default 10)'),
            },
        },
        async ({ app, limit }) => {
            try {
                const filter = await resolveAppFilter(client, app);
                const result = await client.listRuns(filter, { limit: limit ?? 10 });
                const runs = result.results.map((r) => ({
                    id: r.id,
                    name: r.name,
                    app: r.app,
                    createdDate: r.createdDate,
                }));
                const summary = runs.length
                    ? `Found ${runs.length} run(s):\n${runs.map((r) => `- ${r.name} (${r.id}) created ${r.createdDate}`).join('\n')}`
                    : 'No runs found.';
                return ok(summary, { runs });
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    server.registerTool(
        'get_run_status',
        {
            title: 'Get run status',
            description: 'Aggregate status of a run (total/passed/failed/new tests + failed check names). Defaults to the latest run.',
            inputSchema: {
                runId: z.string().optional().describe('Run id; defaults to the most recent run'),
            },
        },
        async ({ runId }) => {
            try {
                const resolvedRunId = await resolveRunId(client, runId);
                if (!resolvedRunId) return errorResult('No runs found on this Syngrisi instance.');

                const testsResult = await client.listTests({ run: resolvedRunId }, { limit: 1000 });
                const counts = { total: testsResult.results.length, passed: 0, failed: 0, new: 0, other: 0 };
                for (const t of testsResult.results) {
                    if (t.status === 'Passed') counts.passed += 1;
                    else if (t.status === 'Failed') counts.failed += 1;
                    else if (t.status === 'New') counts.new += 1;
                    else counts.other += 1;
                }

                const failedChecks = await client.listChecks({ run: resolvedRunId, status: ['failed'] }, { limit: 100 });
                const failedCheckNames = failedChecks.results.map((c) => c.name);

                const summary = `Run ${resolvedRunId}: ${counts.total} test(s) — `
                    + `${counts.passed} passed, ${counts.failed} failed, ${counts.new} new`
                    + (counts.other ? `, ${counts.other} other` : '')
                    + (failedCheckNames.length ? `.\nFailed checks: ${failedCheckNames.join(', ')}` : '.');

                return ok(summary, { runId: resolvedRunId, ...counts, failedCheckNames });
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    server.registerTool(
        'get_failed_checks',
        {
            title: 'Get failed checks',
            description: 'List failed checks for a run (name, browser, viewport, os, branch, mismatch %, fail reasons). Defaults to the latest run.',
            inputSchema: {
                runId: z.string().optional().describe('Run id; defaults to the most recent run'),
                limit: z.number().int().positive().max(200).optional().describe('Max number of checks to return (default 20)'),
            },
        },
        async ({ runId, limit }) => {
            try {
                const resolvedRunId = await resolveRunId(client, runId);
                if (!resolvedRunId) return errorResult('No runs found on this Syngrisi instance.');

                const result = await client.listChecks({ run: resolvedRunId, status: ['failed'] }, { limit: limit ?? 20 });
                const checks = result.results.map(summarizeCheck);
                const summary = checks.length
                    ? `${checks.length} failed check(s) in run ${resolvedRunId}:\n${checks
                        .map((c) => `- ${c.name} [${c.browserName}/${c.viewport}/${c.os}] ${c.misMatchPercentage ?? '?'}% (${c.id})`)
                        .join('\n')}`
                    : `No failed checks in run ${resolvedRunId}.`;
                return ok(summary, { runId: resolvedRunId, checks });
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    server.registerTool(
        'get_check',
        {
            title: 'Get check details',
            description: 'Full details of a single check, including snapshot filenames and image URLs.',
            inputSchema: {
                checkId: z.string().describe('Check id'),
            },
        },
        async ({ checkId }) => {
            try {
                const check = await client.getCheck(checkId);
                if (!check) return errorResult(`Check '${checkId}' not found.`);

                const images = {
                    baseline: snapshotFilename(check.baselineId),
                    actual: snapshotFilename(check.actualSnapshotId),
                    diff: snapshotFilename(check.diffId),
                };
                const { misMatchPercentage } = parseCheckResult(check.result);

                const summary = `Check '${check.name}' (${check.id}) — status: ${check.status.join(',')}, `
                    + `mismatch: ${misMatchPercentage ?? '?'}%, browser: ${check.browserName}/${check.viewport}/${check.os}`;

                return ok(summary, {
                    id: check.id,
                    name: check.name,
                    status: check.status,
                    branch: check.branch,
                    browserName: check.browserName,
                    browserVersion: check.browserVersion,
                    viewport: check.viewport,
                    os: check.os,
                    run: check.run,
                    test: check.test,
                    misMatchPercentage: misMatchPercentage ?? null,
                    failReasons: check.failReasons ?? [],
                    markedAs: check.markedAs,
                    images,
                });
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    server.registerTool(
        'get_check_images',
        {
            title: 'Get check images',
            description: 'Fetch baseline/actual/diff images for a check as inline images.',
            inputSchema: {
                checkId: z.string().describe('Check id'),
                which: z.enum(['baseline', 'actual', 'diff', 'all']).optional().describe('Which image(s) to return (default "all")'),
            },
        },
        async ({ checkId, which }) => {
            try {
                const check = await client.getCheck(checkId);
                if (!check) return errorResult(`Check '${checkId}' not found.`);

                const wanted = which ?? 'all';
                const candidates: Array<{ label: string; filename: string | undefined }> = [
                    { label: 'baseline', filename: snapshotFilename(check.baselineId) },
                    { label: 'actual', filename: snapshotFilename(check.actualSnapshotId) },
                    { label: 'diff', filename: snapshotFilename(check.diffId) },
                ].filter((c) => wanted === 'all' || wanted === c.label);

                const images: ContentBlock[] = [];
                const notes: string[] = [];
                for (const candidate of candidates) {
                    if (!candidate.filename) {
                        notes.push(`${candidate.label}: no image available for this check.`);
                        continue;
                    }
                    const buffer = await client.fetchImage(candidate.filename);
                    if (buffer.length > MAX_IMAGE_BYTES) {
                        notes.push(`${candidate.label}: image too large to return (${buffer.length} bytes > ${MAX_IMAGE_BYTES} bytes limit).`);
                        continue;
                    }
                    images.push({ type: 'image', data: buffer.toString('base64'), mimeType: 'image/png' });
                    notes.push(`${candidate.label}: ${candidate.filename} (${buffer.length} bytes)`);
                }

                const summary = `Check '${check.name}' (${check.id}) images:\n${notes.join('\n')}`;
                return ok(summary, { checkId: check.id, requested: wanted }, images);
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    server.registerTool(
        'accept_check',
        {
            title: 'Accept a check',
            description: 'Accept a check, promoting its actual snapshot (or a given baselineId) to the new baseline.',
            inputSchema: {
                checkId: z.string().describe('Check id to accept'),
                baselineId: z.string().optional().describe('Snapshot id to set as the new baseline; defaults to the check\'s own actual snapshot'),
            },
        },
        async ({ checkId, baselineId }) => {
            try {
                const check = await client.getCheck(checkId);
                if (!check) return errorResult(`Check '${checkId}' not found.`);

                const resolvedBaselineId = baselineId ?? snapshotIdOf(check.actualSnapshotId);
                if (!resolvedBaselineId) {
                    return errorResult(`Cannot accept check '${checkId}': no baselineId provided and the check has no actual snapshot.`);
                }

                const accepted = await client.acceptCheck(checkId, resolvedBaselineId);
                const summary = `Check '${accepted.name ?? checkId}' (${checkId}) accepted — new baselineId: ${resolvedBaselineId}, status: ${(accepted.status ?? []).join(',')}`;
                return ok(summary, { checkId, baselineId: resolvedBaselineId, status: accepted.status, markedAs: accepted.markedAs });
            } catch (err) {
                return errorResult(messageOf(err));
            }
        }
    );

    return server;
}
