import type { Page } from '@playwright/test';

const DEMO_BANNER_ID = 'e2e-demo-banner';

export const showDemoBanner = async (page: Page, text: string): Promise<void> => {
    await page.evaluate(
        ({ text, bannerId }) => {
            const existing = document.getElementById(bannerId);
            if (existing) {
                existing.remove();
            }

            const banner = document.createElement('div');
            banner.id = bannerId;
            banner.textContent = text;
            Object.assign(banner.style, {
                position: 'fixed',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '18px 36px',
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.98) 100%)',
                backdropFilter: 'blur(25px) saturate(180%)',
                WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                color: '#fff',
                fontSize: '22px',
                fontWeight: '600',
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: '999999',
                pointerEvents: 'none',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                animation: 'e2e-banner-glass-in 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '-0.02em',
            });

            const style = document.createElement('style');
            style.textContent = `
        @keyframes e2e-banner-glass-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.95);
          }
          60% {
            transform: translateX(-50%) translateY(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
      `;
            document.head.appendChild(style);
            document.body.appendChild(banner);
        },
        { text, bannerId: DEMO_BANNER_ID },
    );
};

export const hideDemoBanner = async (page: Page): Promise<void> => {
    await page.evaluate((bannerId) => {
        const banner = document.getElementById(bannerId);
        if (banner) {
            banner.remove();
        }
    }, DEMO_BANNER_ID);
};
