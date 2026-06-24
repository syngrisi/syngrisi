import type { Page } from '@playwright/test';

const SUBTITLE_ID = 'e2e-marketing-subtitle';

// Compact marketing caption: bottom-center, NO background, white text with a heavy outline
// (stroke + shadow) so it stays readable on any background. Fades in/out.
export const showSubtitle = async (page: Page, text: string): Promise<void> => {
    await page.evaluate(
        ({ text, id }) => {
            document.getElementById(id)?.remove();
            const el = document.createElement('div');
            el.id = id;
            Object.assign(el.style, {
                position: 'fixed',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '72vw',
                textAlign: 'center',
                color: '#fff',
                fontSize: '28px',
                fontWeight: '700',
                lineHeight: '1.25',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: '-0.01em',
                zIndex: '2147483647',
                pointerEvents: 'none',
                background: 'none',
                // outline so it reads on any background, no box behind the text
                WebkitTextStroke: '1px rgba(0,0,0,0.95)',
                paintOrder: 'stroke fill',
                textShadow: '0 0 4px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85)',
                opacity: '0',
                transition: 'opacity 0.22s ease',
            } as Partial<CSSStyleDeclaration>);
            el.textContent = text;
            document.body.appendChild(el);
            // trigger fade-in
            requestAnimationFrame(() => { el.style.opacity = '1'; });
        },
        { text, id: SUBTITLE_ID },
    );
};

export const hideSubtitle = async (page: Page): Promise<void> => {
    await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);
    }, SUBTITLE_ID);
};
