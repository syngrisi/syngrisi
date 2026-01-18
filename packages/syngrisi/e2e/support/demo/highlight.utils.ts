import type { Page } from '@playwright/test';

const DEMO_HIGHLIGHT_CLASS = 'e2e-demo-highlight';

export const injectHighlightStyles = async (page: Page): Promise<void> => {
    await page.evaluate((highlightClass) => {
        const styleId = 'e2e-highlight-styles';
        if (document.getElementById(styleId)) {
            return;
        }
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      /* Liquid Glass Highlight Effect */
      @keyframes e2e-highlight-glass-pulse {
        0%, 100% {
          box-shadow:
            0 0 0 0 rgba(99, 102, 241, 0.4),
            0 8px 32px rgba(99, 102, 241, 0.2),
            inset 0 0 0 2px rgba(99, 102, 241, 0.5);
        }
        50% {
          box-shadow:
            0 0 0 8px rgba(99, 102, 241, 0),
            0 12px 40px rgba(99, 102, 241, 0.35),
            inset 0 0 0 2px rgba(99, 102, 241, 0.7);
        }
      }
      @keyframes e2e-highlight-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      @keyframes e2e-highlight-glow {
        0%, 100% {
          opacity: 0.6;
          filter: blur(8px);
        }
        50% {
          opacity: 0.9;
          filter: blur(12px);
        }
      }
      .${highlightClass} {
        position: relative;
        z-index: 99999;
        animation: e2e-highlight-glass-pulse 2s ease-in-out infinite;
        border-radius: inherit;
      }
      /* Glass border overlay */
      .${highlightClass}::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.3) 0%,
          rgba(139, 92, 246, 0.2) 25%,
          rgba(236, 72, 153, 0.2) 50%,
          rgba(139, 92, 246, 0.2) 75%,
          rgba(99, 102, 241, 0.3) 100%
        );
        background-size: 200% 200%;
        border-radius: inherit;
        z-index: -1;
        animation: e2e-highlight-shimmer 3s linear infinite;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      /* Soft glow effect */
      .${highlightClass}::after {
        content: '';
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.4) 0%,
          rgba(139, 92, 246, 0.3) 50%,
          rgba(236, 72, 153, 0.4) 100%
        );
        border-radius: inherit;
        z-index: -2;
        animation: e2e-highlight-glow 2s ease-in-out infinite;
        pointer-events: none;
      }
    `;
        document.head.appendChild(style);
    }, DEMO_HIGHLIGHT_CLASS);
};

export const highlightElement = async (page: Page, selector: string): Promise<void> => {
    await injectHighlightStyles(page);

    await page.evaluate((highlightClass) => {
        document.querySelectorAll(`.${highlightClass}`).forEach((el) => {
            el.classList.remove(highlightClass);
        });
    }, DEMO_HIGHLIGHT_CLASS);

    const locator = page.locator(selector).first();
    await locator.evaluate((el, highlightClass) => {
        el.classList.add(highlightClass);
    }, DEMO_HIGHLIGHT_CLASS);
};

export const clearHighlight = async (page: Page): Promise<void> => {
    try {
        await page.evaluate((highlightClass) => {
            document.querySelectorAll(`.${highlightClass}`).forEach((el) => {
                el.classList.remove(highlightClass);
            });
        }, DEMO_HIGHLIGHT_CLASS);
    } catch (error) {
        if (error instanceof Error && error.message.includes('Execution context was destroyed')) {
            return;
        }
        throw error;
    }
};
