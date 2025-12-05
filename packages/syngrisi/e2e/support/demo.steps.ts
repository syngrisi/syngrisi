import { When } from './fixtures';
import type { Page } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load local .env file
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Check if demo should be skipped (default to false if not set)
const SKIP_DEMO = process.env.SKIP_DEMO_TESTS === 'true';
const DEMO_BANNER_ID = 'e2e-demo-banner';
const DEMO_HIGHLIGHT_CLASS = 'e2e-demo-highlight';

const showDemoBanner = async (page: Page, text: string) => {
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
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 32px',
        backgroundColor: 'rgba(0, 0, 0, 0.525)',
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '12px',
        zIndex: '999999',
        pointerEvents: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        animation: 'e2e-banner-fade-in 0.3s ease-out',
      });

      const style = document.createElement('style');
      style.textContent = `
        @keyframes e2e-banner-fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(banner);
    },
    { text, bannerId: DEMO_BANNER_ID },
  );
};

const hideDemoBanner = async (page: Page) => {
  await page.evaluate((bannerId) => {
    const banner = document.getElementById(bannerId);
    if (banner) {
      banner.remove();
    }
  }, DEMO_BANNER_ID);
};

const injectHighlightStyles = async (page: Page) => {
  await page.evaluate((highlightClass) => {
    const styleId = 'e2e-highlight-styles';
    if (document.getElementById(styleId)) {
      return;
    }
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes e2e-highlight-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
        }
      }
      @keyframes e2e-highlight-border-dance {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 100% 50%;
        }
      }
      .${highlightClass} {
        position: relative;
        z-index: 99999;
        animation: e2e-highlight-pulse 2s infinite;
        outline: 1px solid #ff0000 !important;
        outline-offset: 2px !important;
      }
      .${highlightClass}::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(90deg, #ffd700, #ff4500, #ffd700, #ff8c00, #ffd700);
        background-size: 400% 400%;
        z-index: -1;
        border-radius: inherit;
        animation: e2e-highlight-border-dance 2s linear infinite;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
  }, DEMO_HIGHLIGHT_CLASS);
};

const highlightElement = async (page: Page, selector: string) => {
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

const clearHighlight = async (page: Page) => {
  try {
    await page.evaluate((highlightClass) => {
      document.querySelectorAll(`.${highlightClass}`).forEach((el) => {
        el.classList.remove(highlightClass);
      });
    }, DEMO_HIGHLIGHT_CLASS);
  } catch (error) {
    // Ignore execution context destruction errors (happens if page navigates)
    if (error instanceof Error && error.message.includes('Execution context was destroyed')) {
      return;
    }
    throw error;
  }
};

/**
 * Announce message with voice and subtitles
 */
When('I announce: {string}', async ({ page }: { page: Page }, message: string) => {
  if (SKIP_DEMO) return;

  const { promisify } = await import('node:util');
  const { exec } = await import('node:child_process');
  const execAsync = promisify(exec);

  await showDemoBanner(page, message);
  await execAsync(`say -v Milena -r 200 "${message}"`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await hideDemoBanner(page);
});

/**
 * Announce message with voice, subtitles and pause
 */
When('I announce: {string} and PAUSE', async ({ page }: { page: Page }, message: string) => {
  if (SKIP_DEMO) return;

  const { exec } = await import('node:child_process');
  exec(`say -v Milena -r 200 "${message}"`);

  await showDemoBanner(page, message);
  await page.pause();
  await hideDemoBanner(page);
});

/**
 * Highlight element with animation
 */
When('I highlight element {string}', async ({ page }: { page: Page }, selector: string) => {
  if (SKIP_DEMO) return;
  await highlightElement(page, selector);
});

/**
 * Clear highlight
 */
When('I clear highlight', async ({ page }: { page: Page }) => {
  if (SKIP_DEMO) return;
  await clearHighlight(page);
});

/**
 * End demo with confetti
 */
When('I end the demo', async ({ page }: { page: Page }) => {
  if (SKIP_DEMO) return;

  await page.evaluate(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    // Load canvas-confetti from CDN if not present
    if (!(window as any).confetti) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => startConfetti();
      document.head.appendChild(script);
    } else {
      startConfetti();
    }

    function startConfetti() {
      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 250 * (timeLeft / duration);
        // @ts-ignore
        window.confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          }),
        );
        // @ts-ignore
        window.confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          }),
        );
      }, 250);
    }
  });

  // Wait for animation to finish
  await page.waitForTimeout(4000);
});

/**
 * Wait for seconds
 */
When('I wait {int} second(s)', async ({ page }: { page: Page }, seconds: number) => {
  await page.waitForTimeout(seconds * 1000);
});
