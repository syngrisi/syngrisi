import { When } from '@fixtures';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import { showDemoBanner, hideDemoBanner } from '../../support/demo/banner.utils';
import { highlightElement, clearHighlight } from '../../support/demo/highlight.utils';
import { speak } from '../../support/demo/speech.utils';
import { showProgress } from '../../support/demo/progress.utils';

const logger = createLogger('DemoSteps');

// Configuration helpers
const isCI = () => env.CI;
const shouldSkipAll = () => isCI() || process.env.SKIP_DEMO_STEPS === 'true';
const isDemoMode = () => process.env.ENABLE_DEMO_MODE === 'true';

// Silent mode: Show visuals, but skip voice and blocking pauses
// Demo mode: Show visuals + Voice + Blocking pauses

/**
 * Step definition: `When I announce: {string}`
 *
 * Displays a banner with the text.
 * In Demo Mode: Speaks the text and waits for it to finish.
 * In Silent Mode: Skips speech, shows banner briefly.
 */
When('I announce: {string}', async ({ page }, phrase: string) => {
  if (shouldSkipAll()) return;

  await showDemoBanner(page, phrase);

  if (isDemoMode()) {
    await speak(page, phrase, true);
  } else {
    // Silent mode: small delay to let banner be seen briefly
    await page.waitForTimeout(300);
  }

  await hideDemoBanner(page);
});

/**
 * Step definition: `When I announce: {string} and PAUSE`
 *
 * In Demo Mode: Speaks, shows banner, and PAUSES execution for manual inspection.
 * In Silent Mode: Acts like normal announce (skips pause).
 */
When('I announce: {string} and PAUSE', async ({ page, testEngine }, phrase: string) => {
  if (shouldSkipAll()) return;

  // Start speech in background if demo mode
  if (isDemoMode()) {
    void speak(page, phrase, false);
  }

  await showDemoBanner(page, phrase);

  if (isDemoMode()) {
    logger.info('=== DEMO PAUSED for Inspection ===');
    await page.pause();
  } else {
    await page.waitForTimeout(300);
  }

  await hideDemoBanner(page);
});

/**
 * Step definition: `When I highlight element {string}`
 *
 * Applies a "liquid glass" highlight effect to the element.
 */
When('I highlight element {string}', async ({ page }, selector: string) => {
  if (shouldSkipAll()) return;
  await highlightElement(page, selector);
});

/**
 * Step definition: `When I clear highlight`
 */
When('I clear highlight', async ({ page }) => {
  if (shouldSkipAll()) return;
  await clearHighlight(page);
});

/**
 * Step definition: `When I set demo step {int} of {int}: {string}`
 *
 * Updates the progress overlay in the corner.
 */
When('I set demo step {int} of {int}: {string}', async ({ page }, current: number, total: number, name: string) => {
  if (shouldSkipAll()) return;
  await showProgress(page, current, total, name);
});

/**
 * Step definition: `When I end the demo`
 *
 * Shows confetti animation.
 */
When('I end the demo', async ({ page }) => {
  if (shouldSkipAll()) return;

  await page.evaluate(async () => {
    const duration = 3000;
    const particleCount = 150;
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

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

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100 + 'vw';
      const animDuration = Math.random() * 2 + 1.5 + 's';
      const animDelay = Math.random() * 1 + 's';

      Object.assign(particle.style, {
        backgroundColor: color,
        left: left,
        animation: `confetti-fall \${animDuration} linear forwards`,
        animationDelay: animDelay
      });
      container.appendChild(particle);
    }

    await new Promise(resolve => setTimeout(resolve, duration));
    container.remove();
    style.remove();
  });

  // Wait a bit even in silent mode for the effect to be visible
  await page.waitForTimeout(shouldSkipAll() ? 0 : 3000);
});