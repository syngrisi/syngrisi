import type { Page } from '@playwright/test';

const ANNOT_ID = 'e2e-verdict-annot';

// Draws a red arrow + verdict label pointing at each AI-verdict badge on the grid.
// Additive: reuses the existing layer and skips badges already annotated, so it can be
// called repeatedly to reveal arrows one verdict at a time. `only` limits which verdicts
// are drawn this call (undefined = all visible ones).
export const annotateVerdicts = async (page: Page, only?: string[]): Promise<void> => {
    await page.evaluate(({ id, only }) => {
        const LABELS: Record<string, string> = {
            intended_change: 'Intended change',
            likely_bug: 'Likely bug',
            noise: 'Noise',
            uncertain: 'Uncertain',
            unknown: 'Unknown',
            cancelled: 'Cancelled',
        };
        const NS = 'http://www.w3.org/2000/svg';
        let layer = document.getElementById(id);
        if (!layer) {
            layer = document.createElement('div');
            layer.id = id;
            Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: '2147483646', pointerEvents: 'none' });
            const svg = document.createElementNS(NS, 'svg');
            Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' });
            svg.innerHTML = '<defs><marker id="e2e-ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">'
                + '<path d="M0,0 L8,3 L0,6 Z" fill="#e03131"/></marker></defs>';
            layer.appendChild(svg);
            document.body.appendChild(layer);
        }
        const svg = layer.querySelector('svg') as SVGSVGElement;
        const badges = Array.from(document.querySelectorAll('[data-triage-verdict]'))
            .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.top > 0 && r.top < window.innerHeight; });
        badges.forEach((el) => {
            const verdict = el.getAttribute('data-triage-verdict') || '';
            if (only && !only.includes(verdict)) return;
            if (el.getAttribute('data-annot') === '1') return;
            el.setAttribute('data-annot', '1');
            const r = el.getBoundingClientRect();
            const tx = r.left + r.width / 2;
            const labelTop = Math.max(6, r.top - 64);
            const lab = document.createElement('div');
            lab.textContent = LABELS[verdict] || verdict;
            Object.assign(lab.style, {
                position: 'absolute', left: `${tx - 70}px`, top: `${labelTop}px`, width: '140px',
                textAlign: 'center', color: '#e03131', fontWeight: '800', fontSize: '15px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textShadow: '0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff',
            });
            layer!.appendChild(lab);
            const line = document.createElementNS(NS, 'line');
            line.setAttribute('x1', String(tx));
            line.setAttribute('y1', String(labelTop + 22));
            line.setAttribute('x2', String(tx));
            line.setAttribute('y2', String(r.top - 3));
            line.setAttribute('stroke', '#e03131');
            line.setAttribute('stroke-width', '2.5');
            line.setAttribute('marker-end', 'url(#e2e-ah)');
            svg.appendChild(line);
        });
    }, { id: ANNOT_ID, only: only ?? null });
};

export const clearAnnotations = async (page: Page): Promise<void> => {
    await page.evaluate((id) => {
        document.getElementById(id)?.remove();
        document.querySelectorAll('[data-annot]').forEach((el) => el.removeAttribute('data-annot'));
    }, ANNOT_ID);
};

const ARROW_ID = 'e2e-arrow-annot';

// Draws a single red arrow (+ optional label) pointing at an arbitrary element. Generic version of
// annotateVerdicts (which is wired to verdict badges) — used by the AI Match reel to point at the
// AI Match icon and the similarity scores. Only one arrow lives at a time; clear with clearArrows().
export const annotateArrow = async (page: Page, selector: string, label?: string): Promise<void> => {
    await page.evaluate(({ id, selector, label }) => {
        const NS = 'http://www.w3.org/2000/svg';
        document.getElementById(id)?.remove();
        const target = document.querySelector(selector);
        if (!target) return;
        const r = target.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const layer = document.createElement('div');
        layer.id = id;
        Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: '2147483646', pointerEvents: 'none' });
        const svg = document.createElementNS(NS, 'svg');
        Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' });
        svg.innerHTML = '<defs><marker id="e2e-arrow-ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">'
            + '<path d="M0,0 L8,3 L0,6 Z" fill="#e03131"/></marker></defs>';
        layer.appendChild(svg);
        document.body.appendChild(layer);
        const tipX = r.left + r.width / 2;
        const tailX = Math.max(20, tipX - 90);
        // Point from above when there's room; otherwise flip below so the label never clips off-screen.
        const fromAbove = r.top > 96;
        const tipY = fromAbove ? r.top - 4 : r.bottom + 4;
        const tailY = fromAbove ? Math.max(8, r.top - 70) : r.bottom + 70;
        const labelTop = fromAbove ? tailY - 26 : tailY + 6;
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', String(tailX));
        line.setAttribute('y1', String(tailY));
        line.setAttribute('x2', String(tipX));
        line.setAttribute('y2', String(tipY));
        line.setAttribute('stroke', '#e03131');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('marker-end', 'url(#e2e-arrow-ah)');
        svg.appendChild(line);
        if (label) {
            const lab = document.createElement('div');
            lab.textContent = label;
            Object.assign(lab.style, {
                position: 'absolute', left: `${tailX - 230}px`, top: `${labelTop}px`, width: '240px',
                textAlign: 'right', color: '#e03131', fontWeight: '800', fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textShadow: '0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff',
            });
            layer.appendChild(lab);
        }
    }, { id: ARROW_ID, selector, label: label ?? null });
};

export const clearArrows = async (page: Page): Promise<void> => {
    await page.evaluate((id) => { document.getElementById(id)?.remove(); }, ARROW_ID);
};
