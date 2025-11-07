import { When } from '@fixtures';
import { DOMSimplifier } from '@helpers/dom-simplifier';
import { createLogger } from '@lib/logger';

const logger = createLogger('LLMSteps');

/**
 * Step definition: `When I get simplified DOM for LLM`
 *
 * Generates a simplified HTML representation of the current page optimized for LLM processing.
 * The simplification process removes:
 * - Invisible elements (display:none, visibility:hidden, etc.)
 * - Non-interactive elements without content (empty divs, spans, etc.)
 * - Unnecessary nested div/span wrappers
 * - Non-semantic tags (script, style, svg, etc.)
 * - Tailwind CSS utility classes and other noisy CSS classes
 *
 * By default, data-ai-id attributes are NOT included in the output to keep HTML clean.
 * To include data-ai-id for element interactions, set includeDataAiId: true in options.
 *
 * The step logs statistics about the simplification process, including:
 * - Number of elements at each stage
 * - Percentage of elements removed at each stage
 * - Overall reduction percentage
 *
 * @returns {Promise<DOMSimplificationResult>} Result containing simplified HTML, element mappings, tree structure, and statistics
 *
 * @example
 * ```gherkin
 * Given I have opened the app
 * When I get simplified DOM for LLM
 * ```
 */
When('I get simplified DOM for LLM', async ({ page }) => {
  // Wait for a meaningful, visible body child rather than the Radix focus guard span.
  const rootSelector = 'body > :not([data-radix-focus-guard])';
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) {
        return false;
      }
      const style = window.getComputedStyle(element);
      if (style.visibility === 'hidden' || style.display === 'none') {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },
    rootSelector,
    { timeout: 10000 }
  );

  const simplifier = new DOMSimplifier(page, { includeDataAiId: false });
  const result = await simplifier.simplify();

  logger.info('=== DOM Simplification Stats ===');
  logger.info(`Original elements: ${result.stats.originalElementCount}`);
  logger.info(`After visibility filter: ${result.stats.afterVisibilityFilter}`);
  logger.info(`After ignore filter: ${result.stats.afterIgnoreFilter}`);
  logger.info(`After tree simplification: ${result.stats.afterTreeSimplification}`);
  logger.info('');
  logger.info('=== Percentage Removed ===');
  logger.info(`By visibility: ${result.stats.percentageRemoved.byVisibility.toFixed(2)}%`);
  logger.info(`By ignore filter: ${result.stats.percentageRemoved.byIgnore.toFixed(2)}%`);
  logger.info(`By tree simplification: ${result.stats.percentageRemoved.byTreeSimplification.toFixed(2)}%`);
  logger.info(`Overall: ${result.stats.percentageRemoved.overall.toFixed(2)}%`);
  logger.info('===============================');
  logger.info('');
  logger.info(`Simplified HTML:\n${result.html}`);
  logger.info('');
  logger.info('=== HTML Analysis for Agent Work ===');
  const interactiveElements = result.html.match(/<(button|a|input|select|textarea)[^>]*>/g) || [];
  logger.info(`Interactive elements (button, a, input, etc.): ${interactiveElements.length}`);
  logger.info(`Total elements in tree: ${result.stats.afterTreeSimplification}`);
  logger.info(`Preserved attributes: class, id, type, role, aria-*`);
  logger.info('===================================');
  logger.info('');
  logger.info('=== Quality Metrics ===');
  logger.info(`Semantic density: ${result.quality.semanticDensity.toFixed(2)}%`);
  logger.info(`Interactive elements ratio: ${result.quality.interactiveElementsRatio.toFixed(2)}%`);
  logger.info(`Text content ratio: ${result.quality.textContentRatio.toFixed(2)}%`);
  logger.info(`Average nesting depth: ${result.quality.averageNestingDepth.toFixed(2)}`);
  logger.info('=======================');

  logger.info('');
  logger.info('=== DOM Simplification Statistics ===');
  logger.info(JSON.stringify({
    originalElementCount: result.stats.originalElementCount,
    afterVisibilityFilter: result.stats.afterVisibilityFilter,
    afterIgnoreFilter: result.stats.afterIgnoreFilter,
    afterTreeSimplification: result.stats.afterTreeSimplification,
    percentageRemoved: {
      byVisibility: result.stats.percentageRemoved.byVisibility,
      byIgnore: result.stats.percentageRemoved.byIgnore,
      byTreeSimplification: result.stats.percentageRemoved.byTreeSimplification,
      overall: result.stats.percentageRemoved.overall
    }
  }, null, 2));


  return result.html;
});
