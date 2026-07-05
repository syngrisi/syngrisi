// Golden-output test for the AI HTML views (packages/syngrisi/src/server/views/ai/).
//
// The AI HTML pages (`/ai/*`) are a live surface consumed by AI agents, so the
// rendered output must stay byte-equivalent (or intentionally equivalent, i.e.
// only the deliberate escaping fixes below differ) after the ai.controller.ts
// refactor. The GOLDEN_* strings below were captured from the CURRENT
// (pre-refactor) template-literal code with fixed inputs, via a throwaway
// scratch script that copied the exact template blocks verbatim, executed
// with tsx, and printed the resulting strings. See
// plans/021-ai-controller-views.md, Step 1.
//
// Fixtures use hex ObjectId-shaped `_id` values (e.g. '507f1f77bcf86cd799439011')
// so the golden strings hold both before and after Step 4's `escapeHtml(check._id)`
// hardening: escapeHtml is a no-op on plain hex strings. Separate "XSS
// hardening" tests below use a deliberately malicious `_id`-like string to
// prove the new escaping actually takes effect.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderShell } from '../../views/ai/shell';
import { renderIndex } from '../../views/ai/index.view';
import { renderCheckDetails } from '../../views/ai/checkDetails.view';
import { renderChecksList } from '../../views/ai/checks.view';

const GOLDEN_SHELL = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Syngrisi AI Interface</title>\n    <style>\n        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; }\n        header, footer { margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }\n        article { border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }\n        .pagination { margin-top: 1rem; display: flex; gap: 1rem; }\n        .actions { margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9; }\n        figure { margin: 0; }\n        img { max-width: 100%; height: auto; border: 1px solid #ddd; }\n        .status-new { color: blue; }\n        .status-passed { color: green; }\n        .status-failed { color: red; }\n        .meta { font-size: 0.9em; color: #666; }\n        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0; }\n    </style>\n</head>\n<body>\n    <header>\n        <h1>Syngrisi AI Interface</h1>\n        <nav><a href=\"/ai/checks\">Checks</a></nav>\n    </header>\n    <main>\n        <p>x</p>\n    </main>\n    <footer>\n        <p>Syngrisi AI View</p>\n    </footer>\n</body>\n</html>\n";

const GOLDEN_INDEX_BODY = "\n        <h2>AI Endpoints Documentation</h2>\n        <p>This interface provides simplified views and API endpoints for AI agents to interact with Syngrisi.</p>\n\n        <section>\n            <h3>Available Endpoints</h3>\n            <ul role=\"list\" aria-label=\"API endpoints\">\n                <li><a href=\"/ai/checks\">/ai/checks</a> - List and filter checks</li>\n                <li>/ai/checks/:id - Check details view</li>\n                <li>/ai/analysis/:id - JSON analysis data</li>\n            </ul>\n        </section>\n\n        <section>\n            <h3>Common Use Cases</h3>\n            <nav aria-label=\"Filter examples\">\n                <a href=\"/ai/checks?status=failed\">Failed checks</a> |\n                <a href=\"/ai/checks?status=new\">New checks</a> |\n                <a href=\"/ai/checks?hasDiff=true\">Checks with visual differences</a> |\n                <a href=\"/ai/checks?fromDate=2026-06-28&toDate=2026-07-05\">Last 7 days</a> |\n                <a href=\"/ai/checks?markedAs=bug\">Marked as bugs</a> |\n                <a href=\"/ai/checks?status=failed&hasDiff=true\">Failed with diffs</a> |\n                <a href=\"/ai/checks?browser=chrome&os=macOS\">Chrome on macOS</a>\n            </nav>\n        </section>\n\n        <section aria-labelledby=\"filters-heading\">\n            <h3 id=\"filters-heading\">Supported Filters</h3>\n            <div role=\"table\" aria-label=\"Filter parameters\" style=\"display: grid; gap: 0.5rem;\">\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; background: #f5f5f5; font-weight: bold;\">\n                    <div role=\"columnheader\">Parameter</div>\n                    <div role=\"columnheader\">Description</div>\n                    <div role=\"columnheader\">Example</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">run</div>\n                    <div role=\"cell\">Filter by Run ID</div>\n                    <div role=\"cell\">?run=...</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">status</div>\n                    <div role=\"cell\">Filter by status (new, passed, failed, etc.)</div>\n                    <div role=\"cell\">?status=failed</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">name</div>\n                    <div role=\"cell\">Filter by check name (regex)</div>\n                    <div role=\"cell\">?name=Login</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">branch</div>\n                    <div role=\"cell\">Filter by git branch</div>\n                    <div role=\"cell\">?branch=main</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">browser</div>\n                    <div role=\"cell\">Filter by browser name</div>\n                    <div role=\"cell\">?browser=chrome</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">os</div>\n                    <div role=\"cell\">Filter by OS</div>\n                    <div role=\"cell\">?os=macOS</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">viewport</div>\n                    <div role=\"cell\">Filter by viewport</div>\n                    <div role=\"cell\">?viewport=1920x1080</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">markedAs</div>\n                    <div role=\"cell\">Filter by review status (accepted, bug)</div>\n                    <div role=\"cell\">?markedAs=bug</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">hasDiff</div>\n                    <div role=\"cell\">Show only checks with diffs</div>\n                    <div role=\"cell\">?hasDiff=true</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">fromDate</div>\n                    <div role=\"cell\">Start date (YYYY-MM-DD)</div>\n                    <div role=\"cell\">?fromDate=2024-01-01</div>\n                </div>\n                <div role=\"row\" style=\"display: grid; grid-template-columns: 120px 1fr 200px; gap: 1rem; padding: 0.5rem; border-bottom: 1px solid #eee;\">\n                    <div role=\"cell\">toDate</div>\n                    <div role=\"cell\">End date (YYYY-MM-DD)</div>\n                    <div role=\"cell\">?toDate=2024-01-31</div>\n                </div>\n            </div>\n        </section>\n    ";

const GOLDEN_CHECK_DETAILS_BODY = "\n        <article>\n            <h2>&lt;img src=x onerror=alert(1)&gt;</h2>\n            <p>Status: failed</p>\n            <p>ID: 507f1f77bcf86cd799439011</p>\n            <div style=\"display: flex; gap: 1rem; flex-wrap: wrap;\">\n    \n            </div>\n            <h3>Metadata</h3>\n            <pre>{\n  &quot;foo&quot;: &quot;bar&quot;\n}</pre>\n            <h3>Actions</h3>\n            <form method=\"POST\" action=\"/ai/batch\">\n                <input type=\"hidden\" name=\"ids\" value=\"507f1f77bcf86cd799439011\">\n                <button type=\"submit\" name=\"action\" value=\"accept\">Accept</button>\n                <button type=\"submit\" name=\"action\" value=\"remove\">Remove</button>\n            </form>\n        </article>\n    ";

const GOLDEN_CHECKS_LIST_BODY = "\n        <section aria-labelledby=\"quick-filters\">\n            <h2 id=\"quick-filters\">Quick Filters</h2>\n            <nav aria-label=\"Quick filter examples\" style=\"margin-bottom: 1rem;\">\n                <a href=\"/ai/checks?status=failed\">Failed</a> |\n                <a href=\"/ai/checks?status=new\">New</a> |\n                <a href=\"/ai/checks?hasDiff=true\">With Diffs</a> |\n                <a href=\"/ai/checks?markedAs=bug\">Bugs</a> |\n                <a href=\"/ai/checks?lastSeconds=3600\">Last Hour</a> |\n                <a href=\"/ai/checks?lastSeconds=86400\">Last 24h</a>\n            </nav>\n        </section>\n\n        <section aria-labelledby=\"filter-form\">\n            <h2 id=\"filter-form\" class=\"sr-only\">Filter Checks</h2>\n            <form method=\"GET\" aria-label=\"Check filter form\" style=\"display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9;\">\n                <input type=\"text\" name=\"run\" placeholder=\"Run ID\" value=\"\" aria-label=\"Run ID\">\n                <input type=\"text\" name=\"status\" placeholder=\"Status\" value=\"failed\" aria-label=\"Status\">\n                <input type=\"text\" name=\"name\" placeholder=\"Name (regex)\" value=\"\" aria-label=\"Check name\">\n                <input type=\"text\" name=\"branch\" placeholder=\"Branch\" value=\"\" aria-label=\"Branch\">\n                <input type=\"text\" name=\"browser\" placeholder=\"Browser\" value=\"\" aria-label=\"Browser\">\n                <input type=\"text\" name=\"os\" placeholder=\"OS\" value=\"\" aria-label=\"Operating system\">\n                <input type=\"text\" name=\"viewport\" placeholder=\"Viewport\" value=\"\" aria-label=\"Viewport\">\n                <select name=\"markedAs\" aria-label=\"Marked as\">\n                    <option value=\"\">Marked As...</option>\n                    <option value=\"accepted\" >Accepted</option>\n                    <option value=\"bug\" >Bug</option>\n                </select>\n                <label>\n                    <input type=\"checkbox\" name=\"hasDiff\" value=\"true\" > Has Diff\n                </label>\n                <input type=\"date\" name=\"fromDate\" value=\"\" aria-label=\"From date\">\n                <input type=\"date\" name=\"toDate\" value=\"\" aria-label=\"To date\">\n                <input type=\"number\" name=\"lastSeconds\" placeholder=\"Last X seconds\" value=\"\" aria-label=\"Last seconds\" min=\"1\">\n                <select name=\"limit\" aria-label=\"Items per page\">\n                    <option value=\"20\" selected>20 per page</option>\n                    <option value=\"50\" >50 per page</option>\n                    <option value=\"100\" >100 per page</option>\n                    <option value=\"500\" >500 per page</option>\n                </select>\n                <button type=\"submit\">Filter</button>\n                <a href=\"/ai/checks\">Clear</a>\n            </form>\n\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;\">\n                <p style=\"margin: 0;\">Showing 21-40 of 87 results</p>\n                <div style=\"display: flex; gap: 0.5rem;\">\n                    <a href=\"/ai/checks?format=json&status=failed&page=2\" style=\"padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">Export JSON</a>\n                    <a href=\"/ai/checks?format=csv&status=failed&page=2\" style=\"padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">Export CSV</a>\n                </div>\n            </div>\n        </section>\n        <section aria-labelledby=\"checks-heading\">\n            <h2 id=\"checks-heading\" class=\"sr-only\">Checks Results</h2>\n            <form method=\"POST\" action=\"/ai/batch\" aria-label=\"Batch operations form\">\n                <div style=\"margin-bottom: 1rem; padding: 0.5rem; background: #f9f9f9;\">\n                    <button type=\"submit\" name=\"action\" value=\"accept\">Accept Selected</button>\n                    <button type=\"submit\" name=\"action\" value=\"remove\">Remove Selected</button>\n                </div>\n                <ul role=\"list\" style=\"list-style: none; padding: 0;\">\n    \n                    <li>\n                        <article style=\"border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;\">\n                            <label style=\"display: flex; gap: 1rem; align-items: start;\">\n                                <input type=\"checkbox\" name=\"ids\" value=\"507f1f77bcf86cd799439011\" aria-label=\"Select &lt;img src=x onerror=alert(1)&gt;\">\n                                <div style=\"flex: 1;\">\n                                    <h3 style=\"margin: 0 0 0.5rem 0;\"><a href=\"/ai/checks/507f1f77bcf86cd799439011\">&lt;img src=x onerror=alert(1)&gt;</a></h3>\n                                    <p style=\"margin: 0 0 0.5rem 0;\">Status: <span class=\"status-failed\">failed</span></p>\n                                    <dl class=\"meta\" style=\"margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.5rem;\">\n                                        <dt>ID:</dt><dd style=\"margin: 0;\">507f1f77bcf86cd799439011</dd>\n                                        <dt>Run:</dt><dd style=\"margin: 0;\">run-abc</dd>\n                                        <dt>Date:</dt><dd style=\"margin: 0;\">2026-07-01T00:00:00.000Z</dd>\n                                    </dl>\n                                </div>\n                            </label>\n                        </article>\n                    </li>\n        \n                    <li>\n                        <article style=\"border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;\">\n                            <label style=\"display: flex; gap: 1rem; align-items: start;\">\n                                <input type=\"checkbox\" name=\"ids\" value=\"507f1f77bcf86cd799439012\" aria-label=\"Select Login page\">\n                                <div style=\"flex: 1;\">\n                                    <h3 style=\"margin: 0 0 0.5rem 0;\"><a href=\"/ai/checks/507f1f77bcf86cd799439012\">Login page</a></h3>\n                                    <p style=\"margin: 0 0 0.5rem 0;\">Status: <span class=\"status-passed\">passed</span></p>\n                                    <dl class=\"meta\" style=\"margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.5rem;\">\n                                        <dt>ID:</dt><dd style=\"margin: 0;\">507f1f77bcf86cd799439012</dd>\n                                        <dt>Run:</dt><dd style=\"margin: 0;\">run-abc</dd>\n                                        <dt>Date:</dt><dd style=\"margin: 0;\">2026-07-02T00:00:00.000Z</dd>\n                                    </dl>\n                                </div>\n                            </label>\n                        </article>\n                    </li>\n        \n                </ul>\n            </form>\n        </section>\n    \n        <nav aria-label=\"Pagination\" style=\"margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center;\">\n            <a href=\"?status=failed&page=1\" >Previous</a>\n            <a href=\"?status=failed&page=1\" style=\"padding: 0.25rem 0.5rem;  border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">1</a><a href=\"?status=failed&page=2\" style=\"padding: 0.25rem 0.5rem; font-weight: bold; background: #eee; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">2</a><a href=\"?status=failed&page=3\" style=\"padding: 0.25rem 0.5rem;  border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">3</a><a href=\"?status=failed&page=4\" style=\"padding: 0.25rem 0.5rem;  border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">4</a><a href=\"?status=failed&page=5\" style=\"padding: 0.25rem 0.5rem;  border: 1px solid #ccc; text-decoration: none; border-radius: 3px;\">5</a>\n            <a href=\"?status=failed&page=3\" >Next</a>\n        </nav>\n    ";

// ---- renderShell ----

test('renderShell wraps content and escapes the title', () => {
    const out = renderShell('Syngrisi AI Interface', '<p>x</p>');
    assert.equal(out, GOLDEN_SHELL);
    assert.match(out, /<!DOCTYPE html>/);
    assert.match(out, /<title>Syngrisi AI Interface<\/title>/);
    assert.match(out, /<p>x<\/p>/);
});

test('renderShell escapes a malicious title', () => {
    const out = renderShell('<script>alert(1)</script>', 'body');
    assert.doesNotMatch(out, /<script>alert\(1\)<\/script>/);
    assert.match(out, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

// ---- renderIndex ----

test('renderIndex matches the golden (pre-refactor) output byte-for-byte', () => {
    const out = renderIndex({ today: '2026-07-05', weekAgo: '2026-06-28' });
    assert.equal(out, GOLDEN_INDEX_BODY);
});

test('renderIndex contains the documentation headings', () => {
    const out = renderIndex({ today: '2026-07-05', weekAgo: '2026-06-28' });
    assert.match(out, /AI Endpoints Documentation/);
    assert.match(out, /Common Use Cases/);
});

test('renderIndex does not contain the raw "< " substring (output-shape guard, mirrors e2e/features/ai_features.feature)', () => {
    const out = renderIndex({ today: '2026-07-05', weekAgo: '2026-06-28' });
    assert.equal(out.includes('< '), false);
});

// ---- renderCheckDetails ----

const maliciousCheck = {
    _id: '507f1f77bcf86cd799439011',
    name: '<img src=x onerror=alert(1)>',
    status: ['failed'],
    run: 'run-123',
    meta: { foo: 'bar' },
    actualSnapshotId: null,
    baselineId: null,
    diffId: null,
};

test('renderCheckDetails matches the golden (pre-refactor) output byte-for-byte for a hex _id fixture', () => {
    const out = renderCheckDetails(maliciousCheck);
    assert.equal(out, GOLDEN_CHECK_DETAILS_BODY);
});

test('renderCheckDetails escapes a malicious check name (XSS regression guard)', () => {
    const out = renderCheckDetails(maliciousCheck);
    assert.match(out, /&lt;img src=x onerror=alert\(1\)&gt;/);
    assert.doesNotMatch(out, /<img src=x onerror=alert\(1\)>/);
});

test('renderCheckDetails escapes check._id (XSS hardening — Step 4)', () => {
    const withMaliciousId = { ...maliciousCheck, _id: '<script>alert(1)</script>' };
    const out = renderCheckDetails(withMaliciousId);
    assert.doesNotMatch(out, /<script>alert\(1\)<\/script>/);
    assert.match(out, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});

// ---- renderChecksList ----

const fixtureResult = {
    page: 2,
    totalPages: 5,
    totalResults: 87,
    results: [
        {
            _id: '507f1f77bcf86cd799439011',
            name: '<img src=x onerror=alert(1)>',
            status: ['failed'],
            run: 'run-abc',
            createdDate: '2026-07-01T00:00:00.000Z',
        },
        {
            _id: '507f1f77bcf86cd799439012',
            name: 'Login page',
            status: ['passed'],
            run: 'run-abc',
            createdDate: '2026-07-02T00:00:00.000Z',
        },
    ],
};

const query = { status: 'failed', page: '2' };
const filters = {
    run: undefined, status: 'failed', name: undefined, branch: undefined, browser: undefined,
    os: undefined, viewport: undefined, markedAs: undefined, hasDiff: undefined,
    fromDate: undefined, toDate: undefined, lastSeconds: undefined,
};

test('renderChecksList matches the golden (pre-refactor) output byte-for-byte for hex _id fixtures', () => {
    const out = renderChecksList({
        results: fixtureResult.results,
        page: fixtureResult.page,
        totalPages: fixtureResult.totalPages,
        totalResults: fixtureResult.totalResults,
        itemsPerPage: 20,
        query,
        filters,
    });
    assert.equal(out, GOLDEN_CHECKS_LIST_BODY);
});

test('renderChecksList escapes a malicious check name (XSS regression guard)', () => {
    const out = renderChecksList({
        results: fixtureResult.results,
        page: fixtureResult.page,
        totalPages: fixtureResult.totalPages,
        totalResults: fixtureResult.totalResults,
        itemsPerPage: 20,
        query,
        filters,
    });
    assert.match(out, /&lt;img src=x onerror=alert\(1\)&gt;/);
    assert.doesNotMatch(out, /<img src=x onerror=alert\(1\)>/);
});

test('renderChecksList escapes check._id in the checkbox value and the ID <dd> (XSS hardening — Step 4)', () => {
    const withMaliciousId = {
        ...fixtureResult,
        results: [{ ...fixtureResult.results[0], _id: '"><script>alert(1)</script>' }],
    };
    const out = renderChecksList({
        results: withMaliciousId.results,
        page: withMaliciousId.page,
        totalPages: withMaliciousId.totalPages,
        totalResults: withMaliciousId.totalResults,
        itemsPerPage: 20,
        query,
        filters,
    });
    assert.doesNotMatch(out, /"><script>alert\(1\)<\/script>/);
    assert.match(out, /&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
