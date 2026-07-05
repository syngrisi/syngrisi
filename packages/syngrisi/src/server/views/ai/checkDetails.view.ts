import { escapeHtml } from '@utils';

// Moved verbatim from ai.controller.ts's `getCheckDetails` HTML build. The
// only intentional change vs. the original is escaping `check._id` (previously
// interpolated raw in two places) — see Step 4 of
// plans/021-ai-controller-views.md.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderCheckDetails = (check: any) => {
    const actual = check.actualSnapshotId ? `/ snapshoots / ${escapeHtml(check.actualSnapshotId.filename)} ` : '';
    const baseline = check.baselineId ? `/ snapshoots / ${escapeHtml(check.baselineId.filename)} ` : '';
    const diff = check.diffId ? `/ snapshoots / ${escapeHtml(check.diffId.filename)} ` : '';

    let html = `
        <article>
            <h2>${escapeHtml(check.name)}</h2>
            <p>Status: ${escapeHtml(check.status[0])}</p>
            <p>ID: ${escapeHtml(check._id)}</p>
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
            <pre>${escapeHtml(JSON.stringify(check.meta || {}, null, 2))}</pre>
            <h3>Actions</h3>
            <form method="POST" action="/ai/batch">
                <input type="hidden" name="ids" value="${escapeHtml(check._id)}">
                <button type="submit" name="action" value="accept">Accept</button>
                <button type="submit" name="action" value="remove">Remove</button>
            </form>
        </article>
    `;

    return html;
};
