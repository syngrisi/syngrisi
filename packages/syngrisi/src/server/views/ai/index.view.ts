// The static AI documentation page. Moved verbatim from ai.controller.ts's
// `getIndex` HTML body — the only interpolated values are server-computed
// dates, no user/DB data, so no escaping is needed here.
export const renderIndex = ({ today, weekAgo }: { today: string; weekAgo: string }) => `
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
