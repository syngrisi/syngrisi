import type { Page } from '@playwright/test';

// Adds a click-ripple: every click (including Playwright-driven ones) spawns a brief
// expanding circle at the pointer position. Registered via addInitScript so it survives
// full page navigations; the window guard prevents double-binding within one document.
export const installClickRipple = async (page: Page): Promise<void> => {
    const script = () => {
        if ((window as any).__clickRipple) return;
        (window as any).__clickRipple = true;
        document.addEventListener('pointerdown', (e: PointerEvent) => {
            // Ignore synthetic/programmatic events that carry no real pointer position.
            if (e.clientX <= 0 && e.clientY <= 0) return;
            // Only one ripple on screen at a time, so rapid successive clicks never show two dots.
            document.querySelectorAll('.__e2e_ripple').forEach((n) => n.remove());
            const size = 46;
            const d = document.createElement('div');
            d.className = '__e2e_ripple';
            Object.assign(d.style, {
                position: 'fixed', left: `${e.clientX - size / 2}px`, top: `${e.clientY - size / 2}px`,
                width: `${size}px`, height: `${size}px`, borderRadius: '50%',
                border: '3px solid #4dabf7', background: 'rgba(77,171,247,0.25)',
                pointerEvents: 'none', zIndex: '2147483647',
                transform: 'scale(0.3)', opacity: '0.9',
                transition: 'transform 0.45s ease-out, opacity 0.45s ease-out',
            });
            document.body.appendChild(d);
            requestAnimationFrame(() => { d.style.transform = 'scale(1.6)'; d.style.opacity = '0'; });
            setTimeout(() => d.remove(), 500);
        }, true);
    };
    await page.addInitScript(script);
    // also bind for the already-loaded document (addInitScript only affects future loads)
    await page.evaluate(script);
};
