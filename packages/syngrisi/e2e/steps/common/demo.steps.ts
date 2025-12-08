import { When } from '@fixtures';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import type { Page } from '@playwright/test';
import type { TestEngineFixture } from '@fixtures';

const logger = createLogger('DemoSteps');

const DEMO_BANNER_ID = 'e2e-demo-banner';
const DEMO_HIGHLIGHT_CLASS = 'e2e-demo-highlight';

// Flag to skip demo steps for debugging (default: false)
// Check at runtime, not at module load time
const shouldSkipDemoSteps = () => process.env.SKIP_DEMO_STEPS === 'true';

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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
      @keyframes e2e-gradient-spin {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      
      @keyframes e2e-shadow-pulse {
        0% { box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; border-color: #FFD700; }
        25% { box-shadow: 0 0 15px #FF8C00, 0 0 25px #FF8C00; border-color: #FF8C00; }
        50% { box-shadow: 0 0 20px #FF0000, 0 0 30px #FF0000; border-color: #FF0000; }
        75% { box-shadow: 0 0 15px #FFFF00, 0 0 25px #FFFF00; border-color: #FFFF00; }
        100% { box-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; border-color: #FFD700; }
      }

      .${highlightClass} {
        position: relative !important; /* Needed for pseudo-element anchor */
        transition: all 0.3s ease;
        border-radius: 6px; /* Smooth corners for the effect */
      }

      /* Advanced running gradient effect for containers */
      .${highlightClass}:not(input):not(img):not(textarea)::after {
        content: "";
        position: absolute;
        top: -6px; left: -6px; right: -6px; bottom: -6px;
        z-index: 2147483640;
        background: linear-gradient(
          115deg, 
          #FFD700, /* Gold */
          #FF8C00, /* Dark Orange */
          #FF0000, /* Red */
          #FFD700, /* Gold */
          #FFFFFF, /* White (Glare) */
          #FFD700, 
          #FFFF00, /* Yellow */
          #FF4500  /* Orange Red */
        );
        background-size: 200% 200%;
        animation: e2e-gradient-spin 1.5s linear infinite;
        border-radius: 8px;
        pointer-events: none;
        
        /* Mask the center to create a border */
        -webkit-mask: 
           linear-gradient(#fff 0 0) content-box, 
           linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
                mask-composite: exclude;
        padding: 4px; /* Width of the border */
        
        /* Glare/Glow effect */
        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
      }
      
      /* Fallback for void elements (inputs, images) or if pseudo fails */
      .${highlightClass}:is(input, img, textarea) {
         outline: none !important;
         border: 2px solid #FFD700 !important;
         animation: e2e-shadow-pulse 1s linear infinite !important;
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

const logMcpStatus = (testEngine: TestEngineFixture) => {
  logger.info('=== MCP Server Status ===');
  logger.info('Running:', testEngine.isRunning());
  logger.info('Port:', testEngine.getPort());
  logger.info('Base URL:', testEngine.getBaseUrl());
  logger.info('========================');
};

/**
 * Step definition: `When I announce: {string}`
 *
 * Announces a phrase using text-to-speech with a visible banner overlay.
 * The banner is click-through (pointer-events: none) and disappears after speech completes.
 * Useful for highlighting key moments during feature demonstrations without blocking indefinitely.
 * This step is a no-op in CI environments or when SKIP_DEMO_STEPS=true.
 *
 * @param phrase - The text to be spoken aloud and displayed
 *
 * @example
 * ```gherkin
 * When I announce: "Now observe the drag and drop behavior"
 * ```
 */
When('I announce: {string}', async ({ page }, phrase: string) => {
  if (env.CI || shouldSkipDemoSteps()) {
    return;
  }
  const { promisify } = await import('node:util');
  const { exec } = await import('node:child_process');
  const execAsync = promisify(exec);

  await showDemoBanner(page, phrase);
  await execAsync(`say -v Milena "${phrase}"`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  await hideDemoBanner(page);
});

/**
 * Step definition: `When I announce: {string} and PAUSE`
 *
 * Announces a phrase using text-to-speech with a visible banner overlay, then pauses the Playwright runner.
 * The banner is click-through (pointer-events: none) and disappears after pause is released.
 * Useful for highlighting key moments during feature demonstrations with manual inspection.
 * This step is a no-op in CI environments or when SKIP_DEMO_STEPS=true.
 *
 * @param phrase - The text to be spoken aloud and displayed before pausing
 *
 * @example
 * ```gherkin
 * When I announce: "Task creation completed" and PAUSE
 * ```
 */
When('I announce: {string} and PAUSE', async ({ page, testEngine }, phrase: string) => {
  if (env.CI || shouldSkipDemoSteps()) {
    return;
  }
  const { exec } = await import('node:child_process');
  exec(`say -v Milena "${phrase}"`);

  await showDemoBanner(page, phrase);
  logMcpStatus(testEngine);
  await page.pause();
  await hideDemoBanner(page);
});

/**
 * Step definition: `When I highlight element {string}`
 *
 * Highlights a DOM element with a bright pulsing animation.
 * The highlight persists until another element is highlighted or the highlight is cleared.
 * Useful for drawing attention to specific UI elements during demos.
 * This step is a no-op in CI environments or when SKIP_DEMO_STEPS=true.
 *
 * @param selector - CSS selector for the element to highlight
 *
 * @example
 * ```gherkin
 * When I highlight element "[data-testid='submit-button']"
 * When I highlight element ".task-card"
 * ```
 */
When('I highlight element {string}', async ({ page }, selector: string) => {
  if (env.CI || shouldSkipDemoSteps()) {
    return;
  }
  await highlightElement(page, selector);
});

/**
 * Step definition: `When I clear highlight`
 *
 * Removes any active element highlight from the page.
 * This step is a no-op in CI environments or when SKIP_DEMO_STEPS=true.
 *
 * @example
 * ```gherkin
 * When I clear highlight
 * ```
 */
When('I clear highlight', async ({ page }) => {
  if (env.CI || shouldSkipDemoSteps()) {
    return;
  }
  await clearHighlight(page);
});

/**
 * Step definition: `When I end the demo`
 *
 * Triggers a confetti animation on the page to celebrate the end of a demo.
 * This step is a no-op in CI environments or when SKIP_DEMO_STEPS=true.
 *
 * @support/mcp/benchmark/.env.example
 * ```gherkin
 * When I end the demo
 * ```
 */
When('I end the demo', async ({ page }) => {
  if (env.CI || shouldSkipDemoSteps()) {
    return;
  }

  await page.evaluate(async () => {
    const duration = 3000;
    const particleCount = 150;
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

    // 1. Create confetti container
    const container = document.createElement('div');
    container.id = 'confetti-container';
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '999999',
      overflow: 'hidden'
    });
    document.body.appendChild(container);

    // 2. Add animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes confetti-fall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      .confetti-particle {
        position: absolute;
        width: 10px;
        height: 10px;
        top: -20px;
      }
    `;
    document.head.appendChild(style);

    // 3. Generate particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');

      // Random properties
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100 + 'vw';
      const animDuration = Math.random() * 2 + 1.5 + 's'; // from 1.5 to 3.5s
      const animDelay = Math.random() * 1 + 's'; // start delay up to 1s

      Object.assign(particle.style, {
        backgroundColor: color,
        left: left,
        animation: `confetti-fall ${animDuration} linear forwards`,
        animationDelay: animDelay
      });

      container.appendChild(particle);
    }

    // 4. Cleanup after completion
    await new Promise(resolve => setTimeout(resolve, duration));
    container.remove();
    style.remove();
  });

  // Wait for animation to visually finish for the user
  await page.waitForTimeout(4000);
});