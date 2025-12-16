import { expect } from '@playwright/test';
import { test } from '@fixtures';
import { DOMSimplifier } from '@helpers/dom-simplifier';

test.describe('DOMSimplifier', { tag: '@no-app-start' }, () => {
  test.describe('CSS class filtering', () => {
    test('should remove Tailwind utility classes', async ({ page }) => {
      await page.setContent(`
        <div class="flex flex-col bg-background text-foreground p-4">
          <div class="container">Content</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('class="container"');
      expect(result.html).not.toContain('flex');
      expect(result.html).not.toContain('bg-background');
    });

    test('should support wildcard patterns', async ({ page }) => {
      await page.setContent(`
        <button class="flex-1 flex-col flex-wrap p-4 px-2 py-3 m-2 mt-4 custom-component">
          Test
        </button>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('custom-component');
      expect(result.html).not.toContain('flex-1');
      expect(result.html).not.toContain('p-4');
      expect(result.html).not.toContain('px-2');
      expect(result.html).not.toContain('m-2');
    });

    test('should preserve semantic classes', async ({ page }) => {
      await page.setContent(`
        <div class="task-card priority-high status-pending bg-white shadow-lg p-4 task-title">
          <span>My Task</span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('task-card');
      expect(result.html).toContain('priority-high');
      expect(result.html).toContain('status-pending');
      expect(result.html).toContain('task-title');
      expect(result.html).not.toContain('bg-white');
      expect(result.html).not.toContain('shadow-lg');
    });

    test('should support custom class patterns', async ({ page }) => {
      await page.setContent(`
        <div class="my-util-1 my-util-2 helper-class keep-this">
          <span>Content</span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page, {
        cssClassesToRemove: ['my-util-*', 'helper-*'],
      });
      const result = await simplifier.simplify();

      expect(result.html).toContain('keep-this');
      expect(result.html).not.toContain('my-util-1');
      expect(result.html).not.toContain('my-util-2');
      expect(result.html).not.toContain('helper-class');
    });

    test('should handle group/* patterns', async ({ page }) => {
      await page.setContent(`
        <div class="group/sidebar group/header normal-group">
          <span>Content</span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('normal-group');
      expect(result.html).not.toContain('group/sidebar');
      expect(result.html).not.toContain('group/header');
    });

    test('should handle has-* patterns', async ({ page }) => {
      await page.setContent(`
        <div class="has-data-[variant=inset]:bg-sidebar panel">
          <span>Content</span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('panel');
      expect(result.html).not.toContain('has-data-');
    });

    test('should remove empty class attributes', async ({ page }) => {
      await page.setContent(`
        <div class="flex bg-white p-4">
          <span>Content</span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).not.toContain('class=""');
    });
  });

  test.describe('data-ai-id option', () => {
    test('should not include data-ai-id by default', async ({ page }) => {
      await page.setContent(`
        <div class="container">
          <button>Click me</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).not.toContain('data-ai-id');
    });

    test('should include data-ai-id when enabled', async ({ page }) => {
      await page.setContent(`
        <div class="container">
          <button>Click me</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page, { includeDataAiId: true });
      const result = await simplifier.simplify();

      expect(result.html).toContain('data-ai-id="ai-0"');
      expect(result.html).toContain('data-ai-id="ai-1"');
    });

    test('should create element mappings when data-ai-id enabled', async ({ page }) => {
      await page.setContent(`
        <div>
          <button id="test-btn">Click me</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page, { includeDataAiId: true });
      const result = await simplifier.simplify();

      expect(result.elements.size).toBeGreaterThan(0);

      const buttonId = result.html.match(/data-ai-id="(ai-\d+)"[^>]*>Click me/)?.[1];
      expect(buttonId).toBeDefined();

      if (buttonId) {
        const handle = result.elements.get(buttonId);
        expect(handle).toBeDefined();
      }
    });
  });

  test.describe('visibility filtering', () => {
    test('should remove invisible elements', async ({ page }) => {
      await page.setContent(`
        <div>
          <div style="display: none;" class="hidden-div">Hidden</div>
          <div style="visibility: hidden;" class="invisible-div">Invisible</div>
          <div class="visible-div">Visible</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('visible-div');
      expect(result.html).not.toContain('hidden-div');
      expect(result.html).not.toContain('invisible-div');
    });

    test('should remove elements with aria-hidden', async ({ page }) => {
      await page.setContent(`
        <div>
          <div aria-hidden="true" class="aria-hidden">Hidden</div>
          <div class="visible">Visible</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('visible');
      expect(result.html).not.toContain('aria-hidden');
    });
  });

  test.describe('element filtering', () => {
    test('should remove script and style tags', async ({ page }) => {
      await page.setContent(`
        <div>
          <script>console.log('test');</script>
          <style>.test { color: red; }</style>
          <div>Content</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('Content');
      expect(result.html).not.toContain('<script');
      expect(result.html).not.toContain('<style');
    });

    test('should remove SVG elements without accessibility attributes', async ({ page }) => {
      await page.setContent(`
        <div>
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" />
          </svg>
          <div>Content</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('Content');
      expect(result.html).not.toContain('<svg');
      expect(result.html).not.toContain('<circle');
    });

    test('should preserve SVG elements with aria-label', async ({ page }) => {
      await page.setContent(`
        <div>
          <svg width="100" height="100" aria-label="Icon">
            <circle cx="50" cy="50" r="40" />
          </svg>
          <div>Content</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('Content');
      expect(result.html).toContain('<svg');
      expect(result.html).toContain('aria-label="Icon"');
    });

    test('should preserve SVG elements inside buttons', async ({ page }) => {
      await page.setContent(`
        <div>
          <button>
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="8" />
            </svg>
            Click me
          </button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('<button');
      expect(result.html).toContain('<svg');
      expect(result.html).toContain('Click me');
    });

    test('should preserve interactive elements', async ({ page }) => {
      await page.setContent(`
        <div>
          <button>Click</button>
          <a href="#">Link</a>
          <input type="text" placeholder="Type here" />
          <select><option>Option</option></select>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('<button');
      expect(result.html).toContain('<a');
      expect(result.html).toContain('<input');
      expect(result.html).toContain('<select');
    });
  });

  test.describe('tree simplification', () => {
    test('should merge unnecessary nested div/span elements', async ({ page }) => {
      await page.setContent(`
        <div>
          <div>
            <div>
              <div class="content">Nested content</div>
            </div>
          </div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('content');
      expect(result.html).toContain('Nested content');

      const divCount = (result.html.match(/<div/g) || []).length;
      expect(divCount).toBeLessThan(4);
    });

    test('should preserve semantic elements', async ({ page }) => {
      await page.setContent(`
        <div>
          <header>
            <nav>
              <ul>
                <li><a href="#">Link</a></li>
              </ul>
            </nav>
          </header>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('<header');
      expect(result.html).toContain('<nav');
      expect(result.html).toContain('<ul');
      expect(result.html).toContain('<li');
    });
  });

  test.describe('attributes preservation', () => {
    test('should preserve important attributes', async ({ page }) => {
      await page.setContent(`
        <div>
          <button 
            id="test-btn" 
            type="button" 
            role="button"
            aria-label="Test button"
            data-test="custom"
          >
            Click
          </button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('id="test-btn"');
      expect(result.html).toContain('type="button"');
      expect(result.html).toContain('role="button"');
      expect(result.html).toContain('aria-label="Test button"');
    });

    test('should preserve href and src attributes', async ({ page }) => {
      await page.setContent(`
        <div>
          <a href="https://example.com">Link</a>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('href="https://example.com"');
    });
  });

  test.describe('statistics', () => {
    test('should provide simplification statistics', async ({ page }) => {
      await page.setContent(`
        <div class="flex">
          <div style="display: none;">Hidden</div>
          <div class="visible">Content</div>
          <script>console.log('test');</script>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.stats.originalElementCount).toBeGreaterThan(0);
      expect(result.stats.afterVisibilityFilter).toBeLessThan(result.stats.originalElementCount);
      expect(result.stats.percentageRemoved.overall).toBeGreaterThan(0);
    });

    test('should calculate removal percentages correctly', async ({ page }) => {
      await page.setContent(`
        <div>
          <div>Visible 1</div>
          <div>Visible 2</div>
          <div style="display: none;">Hidden 1</div>
          <div style="display: none;">Hidden 2</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.stats.percentageRemoved.byVisibility).toBeGreaterThan(0);
      expect(result.stats.percentageRemoved.overall).toBeGreaterThan(0);
      expect(result.stats.percentageRemoved.overall).toBeLessThanOrEqual(100);
    });
  });

  test.describe('complex real-world scenarios', () => {
    test('should simplify a realistic component', async ({ page }) => {
      await page.setContent(`
        <div class="flex flex-col min-h-0 bg-background">
          <div class="flex items-center justify-center pl-24 bg-[var(--frame)]">
            <h1 class="text-2xl font-bold">Header</h1>
          </div>
          <div class="flex flex-1 bg-[var(--frame)] min-h-0">
            <aside class="group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar">
              <nav class="sidebar-nav">
                <a href="/projects" class="nav-link active">Projects</a>
                <a href="/tasks" class="nav-link">Tasks</a>
              </nav>
            </aside>
            <main class="main-content p-4">
              <div class="task-card priority-high status-pending bg-white shadow-lg p-4 rounded-lg">
                <h2 class="task-title text-lg font-semibold">Task Title</h2>
                <p class="task-description text-muted-foreground">Description</p>
                <button class="btn btn-primary px-4 py-2 rounded">Start Task</button>
              </div>
            </main>
          </div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('sidebar-nav');
      expect(result.html).toContain('task-card');
      expect(result.html).toContain('priority-high');
      expect(result.html).toContain('status-pending');
      expect(result.html).toContain('task-title');
      expect(result.html).toContain('btn');
      expect(result.html).toContain('btn-primary');

      expect(result.html).not.toContain('flex');
      expect(result.html).not.toContain('bg-background');
      expect(result.html).not.toContain('text-2xl');
      expect(result.html).not.toContain('shadow-lg');
      expect(result.html).not.toContain('group/sidebar-wrapper');

      const reductionPercentage = result.stats.percentageRemoved.overall;
      expect(reductionPercentage).toBeGreaterThan(10);
    });

    test('should handle empty elements correctly', async ({ page }) => {
      await page.setContent(`
        <div class="container">
          <div class="empty-div flex"></div>
          <button class="with-content">Content</button>
          <span class="empty-span p-4"></span>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('with-content');
      expect(result.html).toContain('Content');
    });
  });

  test.describe('getElementHandle helper', () => {
    test('should retrieve element by data-ai-id', async ({ page }) => {
      await page.setContent(`
        <div>
          <button id="test-button">Click me</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page, { includeDataAiId: true });
      const result = await simplifier.simplify();

      const buttonMatch = result.html.match(/data-ai-id="(ai-\d+)"[^>]*>Click me/);
      expect(buttonMatch).toBeDefined();

      if (buttonMatch) {
        const aiId = buttonMatch[1];
        const handle = simplifier.getElementHandle(aiId);

        expect(handle).toBeDefined();

        if (handle) {
          const text = await handle.textContent();
          expect(text).toBe('Click me');
        }
      }
    });

    test('should return undefined for non-existent data-ai-id', async ({ page }) => {
      await page.setContent(`<div>Content</div>`);

      const simplifier = new DOMSimplifier(page, { includeDataAiId: true });
      await simplifier.simplify();

      const handle = simplifier.getElementHandle('ai-999');
      expect(handle).toBeUndefined();
    });
  });

  test.describe('Quality metrics', () => {
    test('should calculate semantic density correctly', async ({ page }) => {
      await page.setContent(`
        <div>
          <header>Header</header>
          <nav>Navigation</nav>
          <main>Main content</main>
          <div>Generic div 1</div>
          <div>Generic div 2</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.quality.semanticDensity).toBeGreaterThan(0);
      expect(result.quality.semanticDensity).toBeLessThanOrEqual(100);
    });

    test('should calculate interactive elements ratio', async ({ page }) => {
      await page.setContent(`
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <a href="#">Link</a>
          <div>Non-interactive 1</div>
          <div>Non-interactive 2</div>
          <div>Non-interactive 3</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.quality.interactiveElementsRatio).toBeGreaterThan(0);
      expect(result.quality.interactiveElementsRatio).toBeLessThanOrEqual(100);
    });

    test('should calculate text content ratio', async ({ page }) => {
      await page.setContent(`
        <div>
          <div>Text 1</div>
          <div>Text 2</div>
          <div>Text 3</div>
          <div></div>
          <div></div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.quality.textContentRatio).toBeGreaterThan(0);
      expect(result.quality.textContentRatio).toBeLessThanOrEqual(100);
    });

    test('should calculate average nesting depth', async ({ page }) => {
      await page.setContent(`
        <div>
          <div>
            <div>
              <div>Deeply nested</div>
            </div>
          </div>
          <div>Shallow</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.quality.averageNestingDepth).toBeGreaterThan(0);
    });

    test('should provide quality metrics for realistic component', async ({ page }) => {
      await page.setContent(`
        <div class="container">
          <header>
            <h1>Page Title</h1>
            <nav>
              <a href="/home">Home</a>
              <a href="/about">About</a>
            </nav>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Article content</p>
              <button>Read More</button>
            </article>
          </main>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.quality.semanticDensity).toBeGreaterThan(50);
      expect(result.quality.interactiveElementsRatio).toBeGreaterThan(0);
      expect(result.quality.textContentRatio).toBeGreaterThan(0);
      expect(result.quality.averageNestingDepth).toBeGreaterThan(0);
    });
  });

  test.describe('Offscreen elements support', () => {
    test('should mark elements outside viewport with data-ai-offscreen', async ({ page }) => {
      // Set a small viewport
      await page.setViewportSize({ width: 800, height: 600 });

      await page.setContent(`
        <div>
          <div style="height: 100px;">Visible content in viewport</div>
          <div style="height: 2000px;">Content that pushes next element offscreen</div>
          <button style="display: block;">Offscreen button</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('Visible content in viewport');
      expect(result.html).toContain('Offscreen button');
      expect(result.html).toContain('data-ai-offscreen="true"');

      // Check that the offscreen button has the attribute
      expect(result.html).toMatch(/<button[^>]*data-ai-offscreen="true"[^>]*>Offscreen button/);
    });

    test('should not mark viewport elements with data-ai-offscreen', async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });

      await page.setContent(`
        <div>
          <button style="display: block;">Visible button</button>
          <div>Visible content</div>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).toContain('Visible button');
      expect(result.html).toContain('Visible content');
      expect(result.html).not.toContain('data-ai-offscreen');
    });

    test('should handle elements partially in viewport', async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });

      await page.setContent(`
        <div>
          <div style="height: 550px;">Content</div>
          <button style="display: block; height: 100px;">Partially visible button</button>
        </div>
      `);

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      // Elements partially in viewport should be considered in viewport
      expect(result.html).toContain('Partially visible button');
      expect(result.html).not.toMatch(/<button[^>]*data-ai-offscreen="true"/);
    });
  });

  test.describe('Shadow DOM support', () => {
    test('should not include shadow DOM by default', async ({ page }) => {
      await page.setContent('<div id="host"></div>');
      await page.evaluate(() => {
        const host = document.getElementById('host')!;
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = '<p>Shadow content</p>';
      });

      const simplifier = new DOMSimplifier(page);
      const result = await simplifier.simplify();

      expect(result.html).not.toContain('Shadow content');
      expect(result.html).not.toContain('data-shadow-root');
    });

    test('should include shadow DOM when enabled', async ({ page }) => {
      await page.setContent('<div id="host" style="width: 200px; height: 200px;"></div>');
      await page.evaluate(() => {
        const host = document.getElementById('host')!;
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = '<p style="display: block;">Shadow content</p>';
      });

      const simplifier = new DOMSimplifier(page, { includeShadowDOM: true });
      const result = await simplifier.simplify();

      expect(result.html).toContain('Shadow content');
      expect(result.html).toContain('data-shadow-root="true"');
    });

    test('should mark shadow DOM elements with data-shadow-root attribute', async ({ page }) => {
      await page.setContent(`
        <div style="width: 400px; height: 200px;">
          <div id="host" style="width: 200px; height: 200px; display: inline-block;"></div>
          <button style="display: inline-block;">Light DOM button</button>
        </div>
      `);
      await page.evaluate(() => {
        const host = document.getElementById('host')!;
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = '<button style="display: block;">Shadow button</button>';
      });

      const simplifier = new DOMSimplifier(page, { includeShadowDOM: true });
      const result = await simplifier.simplify();

      expect(result.html).toContain('Shadow button');
      expect(result.html).toMatch(/<button[^>]*data-shadow-root="true"[^>]*>Shadow button<\/button>/);
      expect(result.html).toContain('Light DOM button');
      expect(result.html).not.toMatch(/<button[^>]*data-shadow-root="true"[^>]*>Light DOM button/);
    });

    test('should handle nested shadow DOM', async ({ page }) => {
      await page.setContent('<div id="outer" style="width: 300px; height: 300px;"></div>');
      await page.evaluate(() => {
        const outer = document.getElementById('outer')!;
        const outerShadow = outer.attachShadow({ mode: 'open' });
        outerShadow.innerHTML = `
          <p style="display: block;">Outer shadow text</p>
          <article style="display: block; width: 200px; height: 200px;"></article>
        `;

        const article = outerShadow.querySelector('article')!;
        const innerShadow = article.attachShadow({ mode: 'open' });
        innerShadow.innerHTML = '<p style="display: block;">Inner shadow text</p>';
      });

      const simplifier = new DOMSimplifier(page, { includeShadowDOM: true });
      const result = await simplifier.simplify();

      expect(result.html).toContain('Outer shadow text');
      expect(result.html).toContain('Inner shadow text');
      expect(result.html).toContain('data-shadow-root="true"');
    });

    test('should filter invisible shadow DOM elements', async ({ page }) => {
      await page.setContent('<div id="host" style="width: 200px; height: 200px;"></div>');
      await page.evaluate(() => {
        const host = document.getElementById('host')!;
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
          <p style="display: block;">Visible shadow content</p>
          <p style="display: none;">Hidden shadow content</p>
        `;
      });

      const simplifier = new DOMSimplifier(page, { includeShadowDOM: true });
      const result = await simplifier.simplify();

      expect(result.html).toContain('Visible shadow content');
      expect(result.html).not.toContain('Hidden shadow content');
    });
  });
});
