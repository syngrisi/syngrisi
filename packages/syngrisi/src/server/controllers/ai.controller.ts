/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { Check, App, Run, Test } from '@models';
import { catchAsync, ApiError } from '@utils';
import { config } from '@config';
import fs from 'fs';
import path from 'path';
import { accept, remove } from '@services/check.service';
import { webhookService } from '@services/webhook.service';
import { ExtRequest } from '@types';
import log from '@lib/logger';
import { HttpStatus } from '@utils';
import { triageCheck, cancelCheck, requeueCheck } from '@services/triage';
import { createProvider } from '@services/triage/factory';
import { getProviderConfig } from '@services/triage/config';
import { renderShell, renderIndex, renderChecksList, renderCheckDetails } from '../views/ai';

const getIndex = (req: ExtRequest, res: Response) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const html = renderIndex({ today, weekAgo });
    res.send(renderShell('Syngrisi AI Interface', html));
};

const getChecks = catchAsync(async (req: ExtRequest, res: Response) => {
    const {
        run, status, fromDate, toDate, lastSeconds, limit = 20, page = 1,
        name, branch, browser, os, viewport, markedAs, hasDiff, app, suite, fields, format
    } = req.query;

    // Validate and cap limit
    const itemsPerPage = Math.min(Number(limit) || 20, 5000);

    const filter: any = {};
    if (run) filter.run = run;
    if (status) filter.status = status;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (branch) filter.branch = branch;
    if (browser) filter.browserName = browser;
    if (os) filter.os = os;
    if (viewport) filter.viewport = viewport;
    if (markedAs) filter.markedAs = markedAs;
    if (app) filter.app = app;
    if (suite) filter.suite = suite;

    if (hasDiff === 'true') {
        filter.diffId = { $exists: true, $ne: null };
    }

    // Last X seconds filter
    if (lastSeconds) {
        const seconds = Number(lastSeconds);
        if (!isNaN(seconds) && seconds > 0) {
            filter.createdDate = { $gte: new Date(Date.now() - seconds * 1000) };
        }
    } else if (fromDate || toDate) {
        filter.createdDate = {};
        if (fromDate) filter.createdDate.$gte = new Date(fromDate as string);
        if (toDate) {
            const date = new Date(toDate as string);
            date.setUTCHours(23, 59, 59, 999);
            filter.createdDate.$lte = date;
        }
    }

    const options = {
        page: Number(page),
        limit: itemsPerPage,
        sort: { createdDate: -1 },
    };

    const result = await Check.paginate(filter, options);

    // Field filtering for API responses
    if (fields && format) {
        const allowedFields = (fields as string).split(',').filter(f => f.trim());
        const filteredResults = (result?.results || []).map((check: any) => {
            const filtered: any = {};
            allowedFields.forEach(field => {
                if (check[field] !== undefined) {
                    filtered[field] = check[field];
                }
            });
            return filtered;
        });

        if (format === 'json') {
            res.json({
                results: filteredResults,
                page: result.page,
                totalPages: result.totalPages,
                totalResults: result.totalResults,
            });
            return;
        } else if (format === 'csv') {
            const csvHeader = allowedFields.join(',');
            const csvRows = filteredResults.map((item: any) =>
                allowedFields.map(field => JSON.stringify(item[field] || '')).join(',')
            );
            const csv = [csvHeader, ...csvRows].join('\n');
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=checks.csv');
            res.send(csv);
            return;
        }
    }

    // Handle export formats
    if (format === 'json') {
        res.json(result);
        return;
    } else if (format === 'csv') {
        const csvHeader = 'ID,Name,Status,Run,Date';
        const csvRows = (result?.results || []).map((check: any) =>
            `"${check._id}","${check.name}","${check.status[0]}","${check.run}","${new Date(check.createdDate).toISOString()}"`
        );
        const csv = [csvHeader, ...csvRows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=checks.csv');
        res.send(csv);
        return;
    }

    const html = renderChecksList({
        results: result.results,
        page: result.page,
        totalPages: result.totalPages,
        totalResults: result.totalResults,
        itemsPerPage,
        query: req.query as Record<string, unknown>,
        filters: { run, status, name, branch, browser, os, viewport, markedAs, hasDiff, fromDate, toDate, lastSeconds },
    });

    res.send(renderShell('Checks List', html));
});

const getCheckDetails = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check: any = await Check.findById(id).populate('actualSnapshotId baselineId diffId');
    if (!check) {
        res.status(404).send('Check not found');
        return;
    }

    const html = renderCheckDetails(check);

    res.send(renderShell(`Check: ${check.name} `, html)); // renderShell escapes the title internally
});

const getAnalysis = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check: any = await Check.findById(id).populate('actualSnapshotId baselineId diffId');
    if (!check) {
        res.status(404).json({ error: 'Check not found' });
        return;
    }

    const getBase64 = async (filename: string) => {
        try {
            const filePath = path.join(config.defaultImagesPath, filename);
            return await fs.promises.readFile(filePath, { encoding: 'base64' });
        } catch {
            return null;
        }
    };

    const actual = check.actualSnapshotId ? await getBase64(check.actualSnapshotId.filename) : null;
    const baseline = check.baselineId ? await getBase64(check.baselineId.filename) : null;
    const diff = check.diffId ? await getBase64(check.diffId.filename) : null;

    res.json({
        id: check._id,
        name: check.name,
        status: check.status,
        images: {
            actual,
            baseline,
            diff
        },
        meta: check.meta,
        context: {
            // Placeholder for calculated context
            failure_rate: 0, // To be implemented
            last_passed: null
        }
    });
});

// Aggregated report for a single run: run metadata, status breakdown, diff summary,
// and the tests with their checks. JSON for programmatic/AI consumption.
const getRunReport = catchAsync(async (req: ExtRequest, res: Response) => {
    const { runId } = req.params;

    const run: any = await Run.findById(runId).exec();
    if (!run) {
        res.status(404).json({ error: 'Run not found' });
        return;
    }

    const [tests, checks] = await Promise.all([
        Test.find({ run: runId }).select('_id name status').lean().exec() as Promise<any[]>,
        Check.find({ run: runId }).select('_id name status test diffId markedAs createdDate').lean().exec() as Promise<any[]>,
    ]);

    const statuses: Record<string, number> = {};
    let accepted = 0;
    let withDiff = 0;
    for (const c of checks) {
        const s = (Array.isArray(c.status) ? c.status[0] : c.status) || 'unknown';
        statuses[s] = (statuses[s] || 0) + 1;
        if (c.diffId) withDiff += 1;
        if (c.markedAs === 'accepted') accepted += 1;
    }

    const checksByTest = new Map<string, any[]>();
    for (const c of checks) {
        const key = String(c.test);
        if (!checksByTest.has(key)) checksByTest.set(key, []);
        checksByTest.get(key)!.push({
            id: c._id,
            name: c.name,
            status: Array.isArray(c.status) ? c.status[0] : c.status,
            hasDiff: !!c.diffId,
            markedAs: c.markedAs || null,
            createdDate: c.createdDate,
        });
    }

    res.json({
        run: {
            id: run._id,
            name: run.name,
            app: run.app,
            ident: run.ident,
            description: run.description || null,
            createdDate: run.createdDate,
            updatedDate: run.updatedDate,
            parameters: run.parameters || [],
        },
        summary: {
            totalTests: tests.length,
            totalChecks: checks.length,
            statuses,
            accepted,
            withDiff,
            diffPercentage: checks.length > 0 ? Math.round((withDiff / checks.length) * 1000) / 10 : 0,
        },
        tests: tests.map((t) => ({
            id: t._id,
            name: t.name,
            status: t.status,
            checks: checksByTest.get(String(t._id)) || [],
        })),
    });
});

const batchUpdate = catchAsync(async (req: ExtRequest, res: Response) => {
    const { ids, action } = req.body;
    const idList = Array.isArray(ids) ? ids : [ids];
    log.info(`Batch update: ${action} for ${idList.length} checks`, { scope: 'ai.controller' });
    log.info(`User: ${req.user?.username} `, { scope: 'ai.controller' });

    if (!ids || !Array.isArray(ids)) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'ids array is required');
    }
    if (action === 'accept') {
        for (const id of idList) {
            // @ts-expect-error
            await accept(id, null, req.user);
        }
    } else if (action === 'remove') {
        for (const id of idList) {
            // @ts-expect-error
            await remove(id, req.user);
        }
    }

    if (req.headers.accept?.includes('json')) {
        res.json({ success: true, count: idList.length });
    } else {
        res.redirect('back');
    }
});

const registerWebhook = catchAsync(async (req: ExtRequest, res: Response) => {
    const { url, events, secret } = req.body;
    const webhook = await webhookService.createWebhook({ url, events, secret });
    res.status(201).json(webhook);
});

// Re-run AI triage for a single check (toolbar "re-run" action). Returns the persisted triage.
const triageRun = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check = await Check.findById(id).exec();
    if (!check) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Check not found');
    }
    const triage = await triageCheck(id);
    res.json({ id, triage });
});

// Cancel analysis for a check from the queue → stamp the reserved 'cancelled' verdict.
const triageCancel = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check = await Check.findById(id).exec();
    if (!check) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Check not found');
    }
    const triage = await cancelCheck(id);
    res.json({ id, triage });
});

// Triage queue: failed-with-diff checks in triage-enabled projects, grouped by run.
// ?pendingOnly=true → only checks still awaiting analysis.
const triageQueue = catchAsync(async (req: ExtRequest, res: Response) => {
    const pendingOnly = String(req.query.pendingOnly) === 'true';
    const enabledAppIds = await App.find({ triageEnabled: true }).distinct('_id');
    const filter: Record<string, unknown> = { status: 'failed', diffId: { $exists: true, $ne: null }, app: { $in: enabledAppIds } };
    if (pendingOnly) filter['triage.pending'] = true;
    const checks = await Check.find(filter)
        .select('name run test status triage createdDate')
        .populate('run', 'name createdDate')
        .sort({ createdDate: -1 })
        .limit(1000)
        .exec();

    const runsMap = new Map<string, any>();
    for (const c of checks as any[]) {
        const run = c.run;
        const rid = run?._id ? String(run._id) : 'no-run';
        if (!runsMap.has(rid)) {
            runsMap.set(rid, {
                run: run?._id ? { id: rid, name: run.name, createdDate: run.createdDate } : { id: 'no-run', name: '(no run)' },
                checks: [],
            });
        }
        runsMap.get(rid).checks.push({
            id: String(c._id),
            name: c.name,
            test: c.test ? String(c.test) : null,
            status: Array.isArray(c.status) ? c.status[0] : c.status,
            triage: c.triage ?? null,
        });
    }
    const runs = [...runsMap.values()];
    const counts = { pending: 0, done: 0, cancelled: 0, failed: 0 };
    for (const r of runs) {
        for (const c of r.checks) {
            const t = c.triage;
            if (t?.pending) counts.pending += 1;
            else if (t?.verdict === 'cancelled') counts.cancelled += 1;
            else if (t?.failed) counts.failed += 1;
            else if (t?.verdict) counts.done += 1;
        }
    }
    res.json({ runs, counts });
});

// Run a per-check operation over a list of checkIds, collecting per-id ok/error.
// Sequential to avoid hammering the provider on restart.
const bulkTriageOp = async (body: any, op: (id: string) => Promise<unknown>) => {
    const ids: string[] = Array.isArray(body?.checkIds) ? body.checkIds : [];
    const results = [];
    for (const id of ids) {
        try { const triage = await op(id); results.push({ id, ok: true, triage }); } catch (e) { results.push({ id, ok: false, error: String(e) }); }
    }
    return results;
};

// Bulk cancel / restart from the queue (e.g. "cancel all" / "restart all" in a run).
const triageQueueCancel = catchAsync(async (req: ExtRequest, res: Response) => {
    res.json({ results: await bulkTriageOp(req.body, cancelCheck) });
});
// Restart re-queues each check (mark pending + kick the scheduler) instead of running the full
// classification inline — "restart all" on a large run must not block the HTTP request for
// minutes. The background scheduler picks the checks back up. The per-check toolbar "re-run"
// stays synchronous (triageRun -> triageCheck below), since the user is waiting on one result.
const triageQueueRestart = catchAsync(async (req: ExtRequest, res: Response) => {
    res.json({ results: await bulkTriageOp(req.body, requeueCheck) });
});

// Admin "Test connection": run one classification against the current/provided provider config.
const triageTest = catchAsync(async (req: ExtRequest, res: Response) => {
    let cfg = (req.body && Object.keys(req.body).length) ? req.body : await getProviderConfig();
    if (!cfg) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'No triage provider configured');
    }
    // The admin form omits the apiKey (or sends the masked placeholder) when the stored key
    // wasn't retyped. Backfill it from the stored provider config, mirroring the save path's
    // preservation logic, so "Test connection" authenticates with the real stored secret.
    if (!cfg.apiKey || cfg.apiKey === '***') {
        const stored = await getProviderConfig();
        cfg = { ...cfg, apiKey: stored?.apiKey || '' };
    }
    const started = Date.now();
    try {
        // Lightweight reachability check — never a full (slow) classification, so the UI doesn't
        // hang for minutes on a local VLM warming up.
        const result = await createProvider(cfg).ping();
        res.json({ ok: true, latencyMs: Date.now() - started, result });
    } catch (e) {
        // Belt-and-suspenders cap: providers no longer inline upstream response bodies,
        // but keep the message short regardless of what threw.
        const message = (e instanceof Error ? e.message : String(e)).slice(0, 200);
        res.json({ ok: false, latencyMs: Date.now() - started, error: message });
    }
});

export const aiController = {
    getIndex,
    getChecks,
    getCheckDetails,
    getAnalysis,
    getRunReport,
    batchUpdate,
    registerWebhook,
    triageRun,
    triageCancel,
    triageQueue,
    triageQueueCancel,
    triageQueueRestart,
    triageTest,
};
