import { escapeHtml } from '@utils';

// Moved from ai.controller.ts's `getChecks` (the pagination helper). Unchanged.
export const generatePageNumbers = (current: number, total: number): (number | string)[] => {
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

export type ChecksListFilters = {
    run?: unknown;
    status?: unknown;
    name?: unknown;
    branch?: unknown;
    browser?: unknown;
    os?: unknown;
    viewport?: unknown;
    markedAs?: unknown;
    hasDiff?: unknown;
    fromDate?: unknown;
    toDate?: unknown;
    lastSeconds?: unknown;
};

export type ChecksListParams = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any[];
    page: number;
    totalPages: number;
    totalResults: number;
    itemsPerPage: number;
    // Raw query object, used to build pagination/export links (same as req.query).
    query: Record<string, unknown>;
    filters: ChecksListFilters;
};

// Moved verbatim from ai.controller.ts's `getChecks` HTML build (filter form +
// results list + pagination). The only intentional change vs. the original is
// escaping `check._id` (previously interpolated raw) — see Step 4 of
// plans/021-ai-controller-views.md.
export const renderChecksList = ({ results, page, totalPages, totalResults, itemsPerPage, query, filters }: ChecksListParams) => {
    const { run, status, name, branch, browser, os, viewport, markedAs, hasDiff, fromDate, toDate, lastSeconds } = filters;

    const pageNumbers = generatePageNumbers(page, totalPages);
    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalResults);

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
                <input type="text" name="run" placeholder="Run ID" value="${escapeHtml(run)}" aria-label="Run ID">
                <input type="text" name="status" placeholder="Status" value="${escapeHtml(status)}" aria-label="Status">
                <input type="text" name="name" placeholder="Name (regex)" value="${escapeHtml(name)}" aria-label="Check name">
                <input type="text" name="branch" placeholder="Branch" value="${escapeHtml(branch)}" aria-label="Branch">
                <input type="text" name="browser" placeholder="Browser" value="${escapeHtml(browser)}" aria-label="Browser">
                <input type="text" name="os" placeholder="OS" value="${escapeHtml(os)}" aria-label="Operating system">
                <input type="text" name="viewport" placeholder="Viewport" value="${escapeHtml(viewport)}" aria-label="Viewport">
                <select name="markedAs" aria-label="Marked as">
                    <option value="">Marked As...</option>
                    <option value="accepted" ${markedAs === 'accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="bug" ${markedAs === 'bug' ? 'selected' : ''}>Bug</option>
                </select>
                <label>
                    <input type="checkbox" name="hasDiff" value="true" ${hasDiff === 'true' ? 'checked' : ''}> Has Diff
                </label>
                <input type="date" name="fromDate" value="${escapeHtml(fromDate)}" aria-label="From date">
                <input type="date" name="toDate" value="${escapeHtml(toDate)}" aria-label="To date">
                <input type="number" name="lastSeconds" placeholder="Last X seconds" value="${escapeHtml(lastSeconds)}" aria-label="Last seconds" min="1">
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
                <p style="margin: 0;">Showing ${startItem}-${endItem} of ${totalResults} results</p>
                <div style="display: flex; gap: 0.5rem;">
                    <a href="/ai/checks?format=json&${new URLSearchParams(query as any).toString()}" style="padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">Export JSON</a>
                    <a href="/ai/checks?format=csv&${new URLSearchParams(query as any).toString()}" style="padding: 0.25rem 0.5rem; border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">Export CSV</a>
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results.forEach((check: any) => {
        html += `
                    <li>
                        <article style="border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
                            <label style="display: flex; gap: 1rem; align-items: start;">
                                <input type="checkbox" name="ids" value="${escapeHtml(check._id)}" aria-label="Select ${escapeHtml(check.name)}">
                                <div style="flex: 1;">
                                    <h3 style="margin: 0 0 0.5rem 0;"><a href="/ai/checks/${escapeHtml(check._id)}">${escapeHtml(check.name)}</a></h3>
                                    <p style="margin: 0 0 0.5rem 0;">Status: <span class="status-${escapeHtml(check.status[0])}">${escapeHtml(check.status[0])}</span></p>
                                    <dl class="meta" style="margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.5rem;">
                                        <dt>ID:</dt><dd style="margin: 0;">${escapeHtml(check._id)}</dd>
                                        <dt>Run:</dt><dd style="margin: 0;">${escapeHtml(check.run)}</dd>
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
        const urlParams = new URLSearchParams(query as any);
        urlParams.set('page', p.toString());
        return `?${urlParams.toString()}`;
    };

    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPages ? page + 1 : totalPages;

    html += `
        <nav aria-label="Pagination" style="margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
            <a href="${getPageUrl(prevPage)}" ${page === 1 ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>Previous</a>
            ${pageNumbers.map(p =>
        typeof p === 'string'
            ? `<span style="padding: 0.25rem 0.5rem;">...</span>`
            : `<a href="${getPageUrl(p)}" style="padding: 0.25rem 0.5rem; ${p === page ? 'font-weight: bold; background: #eee;' : ''} border: 1px solid #ccc; text-decoration: none; border-radius: 3px;">${p}</a>`
    ).join('')}
            <a href="${getPageUrl(nextPage)}" ${page === totalPages ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>Next</a>
        </nav>
    `;

    return html;
};
