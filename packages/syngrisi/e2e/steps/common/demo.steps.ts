import * as fs from 'fs';
import { When } from '@fixtures';
import { env } from '@config';
import { createLogger } from '@lib/logger';
import { showDemoBanner, hideDemoBanner } from '../../support/demo/banner.utils';
import { showSubtitle, hideSubtitle } from '../../support/demo/subtitle.utils';
import { annotateVerdicts, clearAnnotations } from '../../support/demo/annotate.utils';
import { installClickRipple } from '../../support/demo/ripple.utils';
import { highlightElement, clearHighlight } from '../../support/demo/highlight.utils';
import { speak } from '../../support/demo/speech.utils';
import { showProgress } from '../../support/demo/progress.utils';

const logger = createLogger('DemoSteps');

// Marketing captions: { text: durationMs } from the TTS manifest (MARKETING_CAPTIONS file).
// Each subtitle stays on screen for exactly its voice-over clip length (audio-first sync).
const SUBTITLE_DEFAULT_MS = 2800;
let captionDurations: Record<string, number> | null = null;
function getCaptionMs(text: string): number {
    if (captionDurations === null) {
        captionDurations = {};
        const file = process.env.MARKETING_CAPTIONS;
        try {
            if (file && fs.existsSync(file)) {
                const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
                for (const c of (data.captions || data)) captionDurations[c.text] = c.durationMs;
            }
        } catch (e) { logger.warn(`failed to read MARKETING_CAPTIONS: ${e}`); }
    }
    return captionDurations[text] ?? SUBTITLE_DEFAULT_MS;
}

// Reel timeline: when each caption appears (ms from reel start ≈ video start), so the
// generated voice-over clips can be placed at the right moment during post-production.
let reelT0: number | null = null;
const reelTimeline: Array<{ text: string; offsetMs: number; durationMs: number }> = [];
function recordCaption(text: string, durationMs: number): void {
    if (reelT0 === null) return;
    reelTimeline.push({ text, offsetMs: Date.now() - reelT0, durationMs });
    const file = process.env.MARKETING_TIMELINE;
    if (file) {
        try { fs.writeFileSync(file, JSON.stringify({ captions: reelTimeline }, null, 2)); } catch { /* ignore */ }
    }
}

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
 * Step definition: `When I subtitle {string}`
 *
 * Marketing caption: compact, no background, outlined text. No speech (TTS is added in
 * post-production). Stays on screen for the matching voice-over clip duration so the
 * recorded video lines up with the generated audio.
 */
When('I subtitle {string}', async ({ page }, text: string) => {
  if (shouldSkipAll()) return;
  const ms = getCaptionMs(text);
  recordCaption(text, ms);
  await showSubtitle(page, text);
  await page.waitForTimeout(ms);
  await hideSubtitle(page);
});

/**
 * Step definition: `When I save a screenshot to {string}`
 *
 * Saves the current viewport as a PNG (path is relative to the e2e dir). Used to capture
 * marketing screenshots for the README.
 */
When('I save a screenshot to {string}', async ({ page }, relPath: string) => {
  const out = require('path').resolve(process.cwd(), relPath);
  require('fs').mkdirSync(require('path').dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  logger.info(`saved screenshot ${out}`);
});

/**
 * Step definition: `When I start the reel timeline`
 *
 * Marks t=0 for the marketing reel (≈ video start) and resets the caption timeline.
 */
When('I start the reel timeline', async ({ page }) => {
  reelT0 = Date.now();
  reelTimeline.length = 0;
  const file = process.env.MARKETING_TIMELINE;
  if (file) { try { fs.writeFileSync(file, JSON.stringify({ captions: [] }, null, 2)); } catch { /* ignore */ } }
  if (!shouldSkipAll()) await installClickRipple(page);
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
 * Step definition: `When I reveal verdicts with caption {string}`
 *
 * Shows the verdict caption and reveals the red verdict arrows one group at a time, timed
 * to the moments the voice-over names each verdict. The reveal order matches the sentence:
 * "…intended change, noise, or a likely bug." Fractions are of the caption's voice-over
 * length; tune them against the built audio if the wording/timing changes.
 */
When('I reveal verdicts with caption {string}', async ({ page }, text: string) => {
  if (shouldSkipAll()) return;
  const ms = getCaptionMs(text);
  recordCaption(text, ms);
  await showSubtitle(page, text);
  // [fraction of clip, verdicts to reveal] — synced to when each verdict word is spoken.
  const reveals: Array<[number, string[]]> = [
    [0.53, ['intended_change']],
    [0.67, ['noise']],
    [0.80, ['likely_bug']],
  ];
  let elapsed = 0;
  for (const [frac, verdicts] of reveals) {
    const at = Math.round(ms * frac);
    if (at > elapsed) { await page.waitForTimeout(at - elapsed); elapsed = at; }
    await annotateVerdicts(page, verdicts);
  }
  if (ms > elapsed) await page.waitForTimeout(ms - elapsed);
  await hideSubtitle(page);
  await clearAnnotations(page);
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