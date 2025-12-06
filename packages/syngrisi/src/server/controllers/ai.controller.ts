/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { Check, Webhook } from '@models';
import { catchAsync, ApiError } from '@utils';
import { config } from '@config';
import fs from 'fs';
import path from 'path';
import { accept, remove } from '@services/check.service';
import { ExtRequest } from '@types';
import log from '@lib/logger';
import { HttpStatus } from '@utils';

const htmlShell = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; }
        header, footer { margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
        article { border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .pagination { margin-top: 1rem; display: flex; gap: 1rem; }
        .actions { margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9; }
        figure { margin: 0; }
        img { max-width: 100%; height: auto; border: 1px solid #ddd; }
        .status-new { color: blue; }
        .status-passed { color: green; }
        .status-failed { color: red; }
        .meta { font-size: 0.9em; color: #666; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }
    </style>
</head>
<body>
    <header>
        <h1>${title}</h1>
        <nav><a href="/ai/checks">Checks</a></nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <p>Syngrisi AI View</p>
    </footer>
</body>
</html>
`;

const getIndex = (req: ExtRequest, res: Response) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const html = `
        <h2>AI Endpoints Documentation</h2>
        <p>This interface provides simplified views and API endpoints for AI agents to interact with Syngrisi.</p>
        
        <section>
            <h3>Available Endpoints</h3>
            <ul role="list" aria-label="API endpoints">
                <li><a href="/ai/checks">/ai/checks</a> - List and filter checks</li>
                <li>/ai/checks/:id - Check details view</li>
                <li>/ai/analysis/:id - JSON analysis data</li>
            </ul>
        </section>

        <section>
            <h3>Common Use Cases</h3>
            <nav aria-label="Filter examples">
                <a href="/ai/checks?status=failed">Failed checks</a> |
                <a href="/ai/checks?status=new">New checks</a> |
                <a href="/ai/checks?hasDiff=true">Checks with visual differences</a> |
                <a href="/ai/checks?fromDate=${weekAgo}&toDate=${today}">Last 7 days</a> |
                <a href="/ai/checks?markedAs=bug">Marked as bugs</a> |
                <a href="/ai/checks?status=failed&hasDiff=true">Failed with diffs</a> |
                <a href="/ai/checks?browser=chrome&os=macOS">Chrome on macOS</a>
            </nav>
        </section>

        <section aria-labelledby="filters-heading">
            <h3 id="filters-heading">Supported Filters</h3>
            <div role="table" aria-label="Filter parameters" style="display: grid; gap: 0.5rem;">
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; background: #f5f5f5; font-weight: bold;">
                    <div role="columnheader">Parameter</div>
                    <div role="columnheader">Description</div>
                    <div role="columnheader">Example</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">run</div>
                    <div role="cell">Filter by Run ID</div>
                    <div role="cell">?run=...</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">status</div>
                    <div role="cell">Filter by status (new, passed, failed, etc.)</div>
                    <div role="cell">?status=failed</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">name</div>
                    <div role="cell">Filter by check name (regex)</div>
                    <div role="cell">?name=Login</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">branch</div>
                    <div role="cell">Filter by git branch</div>
                    <div role="cell">?branch=main</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">browser</div>
                    <div role="cell">Filter by browser name</div>
                    <div role="cell">?browser=chrome</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">os</div>
                    <div role="cell">Filter by OS</div>
                    <div role="cell">?os=macOS</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">viewport</div>
                    <div role="cell">Filter by viewport</div>
                    <div role="cell">?viewport=1920x1080</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">markedAs</div>
                    <div role="cell">Filter by review status (accepted, bug)</div>
                    <div role="cell">?markedAs=bug</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">hasDiff</div>
                    <div role="cell">Show only checks with diffs</div>
                    <div role="cell">?hasDiff=true</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">fromDate</div>
                    <div role="cell">Start date (YYYY-MM-DD)</div>
                    <div role="cell">?fromDate=2024-01-01</div>
                </div>
                <div role="row" style="display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;">
                    <div role="cell">toDate</div>
                    <div role="cell">End date (YYYY-MM-DD)</div>
                    <div role="cell">?toDate=2024-01-31</div>
                </div>
            </div>
        </section>
    `;
    res.send(htmlShell('Syngrisi AI Interface', html));
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

    // Generate page numbers for pagination
    const generatePageNumbers = (current: number, total: number): (number | string)[] => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        const pages: (number | string)[] = [];
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(total);
        } else if (current >= total - 3) {
            pages.push(1);
            pages.push('...');
            for (let i = total - 4; i <= total; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = current - 1; i <= current + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(total);
        }
        return pages;
    };

    const pageNumbers = generatePageNumbers(result.page, result.totalPages);
    const startItem = (result.page - 1) * itemsPerPage + 1;
    const endItem = Math.min(result.page * itemsPerPage, result.totalResults);

    let html = `
        <section aria-labelledby="quick-filters">
            <h2 id="quick-filters">Quick Filters</h2>
            <nav aria-label="Quick filter examples" style="margin-bottom: 1rem;">
                <a href="/ai/checks?status=failed">Failed</a> |
                <a href="/ai/checks?status=new">New</a> |
                <a href="/ai/checks?hasDiff=true">With Diffs</a> |
                <a href="/ai/checks?markedAs=bug">Bugs</a> |
                <a href="/ai/checks?lastSeconds=3600">Last Hour</a> |
                <a href="/ai/checks?lastSeconds=86400">Last 24h</a>
            </nav>
        </section>
        
        <section aria-labelledby="filter-form">
            <h2 id="filter-form" class="sr-only">Filter Checks</h2>
            <form method="GET" aria-label="Check filter form" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9;">
                <input type="text" name="run" placeholder="Run ID" value="${run || ''}" aria-label="Run ID">
                <input type="text" name="status" placeholder="Status" value="${status || ''}" aria-label="Status">
                <input type="text" name="name" placeholder="Name (regex)" value="${name || ''}" aria-label="Check name">
                <input type="text" name="branch" placeholder="Branch" value="${branch || ''}" aria-label="Branch">
                <input type="text" name="browser" placeholder="Browser" value="${browser || ''}" aria-label="Browser">
                <input type="text" name="os" placeholder="OS" value="${os || ''}" aria-label="Operating system">
                <input type="text" name="viewport" placeholder="Viewport" value="${viewport || ''}" aria-label="Viewport">
                <select name="markedAs" aria-label="Marked as">
                    <option value="">Marked As...</option>
                    <option value="accepted" ${markedAs === 'accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="bug" ${markedAs === 'bug' ? 'selected' : ''}>Bug</option>
                </select>
                <label>
                    <input type="checkbox" name="hasDiff" value="true" ${hasDiff === 'true' ? 'checked' : ''}> Has Diff
                </label>
                <input type="date" name="fromDate" value="${fromDate || ''}" aria-label="From date">
                <input type="date" name="toDate" value="${toDate || ''}" aria-label="To date">
                <input type="number" name="lastSeconds" placeholder="Last X seconds" value="${lastSeconds || ''}" aria-label="Last seconds" min="1">
                <select name="limit" aria-label="Items per page">
                    <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>20 per page</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 per page</option>
                    <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>100 per page</option>
                    <option value="500" ${itemsPerPage === 500 ? 'selected' : ''}>500 per page</option>
                </select>
                <button type="submit">Filter</button>
                <a href="/ai/checks">Clear</a>
            </form>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <p style="margin: 0;">Showing ${startItem}-${endItem} of ${result.totalResults} results</p>
                <div style="display: flex; gap: 0.5rem;">
                    <a href="/ai/checks?format=json&${new URLSearchParams(req.query as any).toString()}" style="padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">Export JSON</a>
                    <a href="/ai/checks?format=csv&${new URLSearchParams(req.query as any).toString()}" style="padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">Export CSV</a>
                </div>
            </div>
        </section>
        <section aria-labelledby="checks-heading">
            <h2 id="checks-heading" class="sr-only">Checks Results</h2>
            <form method="POST" action="/ai/batch" aria-label="Batch operations form">
                <div style="margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9;">
                    <button type="submit" name="action" value="accept">Accept Selected</button>
                    <button type="submit" name="action" value="remove">Remove Selected</button>
                </div>
                <ul role="list" style="list-style: none; padding: 0;">
    `;

    result.results.forEach((check: any) => {
        html += `
                    <li>
                        <article style="border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
                            <label style="display: flex; gap: 1rem; align-items: start;">
                                <input type="checkbox" name="ids" value="${check._id}" aria-label="Select ${check.name}">
                                <div style="flex: 1;">
                                    <h3 style="margin: 0 0 0.5rem 0;"><a href="/ai/checks/${check._id}">${check.name}</a></h3>
                                    <p style="margin: 0 0 0.5rem 0;">Status: <span class="status-${check.status[0]}">${check.status[0]}</span></p>
                                    <dl class="meta" style="margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.5rem;">
                                        <dt>ID:</dt><dd style="margin: 0;">${check._id}</dd>
                                        <dt>Run:</dt><dd style="margin: 0;">${check.run}</dd>
                                        <dt>Date:</dt><dd style="margin: 0;">${new Date(check.createdDate).toISOString()}</dd>
                                    </dl>
                                </div>
                            </label>
                        </article>
                    </li>
        `;
    });

    html += `
                </ul>
            </form>
        </section>
    `;

    const getPageUrl = (p: number | string) => {
        if (typeof p === 'string') return '#';
        const urlParams = new URLSearchParams(req.query as any);
        urlParams.set('page', p.toString());
        return `?${urlParams.toString()}`;
    };

    const prevPage = result.page > 1 ? result.page - 1 : 1;
    const nextPage = result.page < result.totalPages ? result.page + 1 : result.totalPages;

    html += `
        <nav aria-label="Pagination" style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
            <a href="${getPageUrl(prevPage)}" ${result.page === 1 ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>Previous</a>
            ${pageNumbers.map(p =>
        typeof p === 'string'
            ? `<span style="padding: 0.25rem 0.5rem;">...</span>`
            : `<a href="${getPageUrl(p)}" style="padding: 0.25rem 0.5rem; ${p === result.page ? 'font-weight: bold; background: #eee;' : ''} border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">${p}</a>`
    ).join('')}
            <a href="${getPageUrl(nextPage)}" ${result.page === result.totalPages ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>Next</a>
        </nav>
    `;

    res.send(htmlShell('Checks List', html));
});

const getCheckDetails = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check: any = await Check.findById(id).populate('actualSnapshotId baselineId diffId');
    if (!check) {
        res.status(404).send('Check not found');
        return;
    }

    const actual = check.actualSnapshotId ? `/ snapshoots / ${check.actualSnapshotId.filename} ` : '';
    const baseline = check.baselineId ? `/ snapshoots / ${check.baselineId.filename} ` : '';
    const diff = check.diffId ? `/ snapshoots / ${check.diffId.filename} ` : '';

    let html = `
        <article>
            <h2>${check.name}</h2>
            <p>Status: ${check.status[0]}</p>
            <p>ID: ${check._id}</p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    `;

    if (baseline) {
        html += `
                <figure>
                    <figcaption>Baseline</figcaption>
                    <img src="${baseline}" alt="Baseline Image">
                </figure>
        `;
    }
    if (actual) {
        html += `
                <figure>
                    <figcaption>Actual</figcaption>
                    <img src="${actual}" alt="Actual Image">
                </figure>
        `;
    }
    if (diff) {
        html += `
                <figure>
                    <figcaption>Diff</figcaption>
                    <img src="${diff}" alt="Diff Image">
                </figure>
        `;
    }

    html += `
            </div>
            <h3>Metadata</h3>
            <pre>${JSON.stringify(check.meta || {}, null, 2)}</pre>
            <h3>Actions</h3>
            <form method="POST" action="/ai/batch">
                <input type="hidden" name="ids" value="${check._id}">
                <button type="submit" name="action" value="accept">Accept</button>
                <button type="submit" name="action" value="remove">Remove</button>
            </form>
        </article>
    `;

    res.send(htmlShell(`Check: ${check.name} `, html));
});

const getAnalysis = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const check: any = await Check.findById(id).populate('actualSnapshotId baselineId diffId');
    if (!check) {
        res.status(404).json({ error: 'Check not found' });
        return;
    }

    const getBase64 = (filename: string) => {
        try {
            const filePath = path.join(config.defaultImagesPath, filename);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, { encoding: 'base64' });
            }
        } catch {
            return null;
        }
        return null;
    };

    const actual = check.actualSnapshotId ? getBase64(check.actualSnapshotId.filename) : null;
    const baseline = check.baselineId ? getBase64(check.baselineId.filename) : null;
    const diff = check.diffId ? getBase64(check.diffId.filename) : null;

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
    const webhook = await Webhook.create({ url, events, secret });
    res.status(201).json(webhook);
});

export const aiController = {
    getIndex,
    getChecks,
    getCheckDetails,
    getAnalysis,
    batchUpdate,
    registerWebhook
};
