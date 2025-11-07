import type { Page, ElementHandle } from '@playwright/test';

/**
 * Represents a simplified DOM element with essential information for LLM processing
 */
interface SimplifiedElement {
  tag: string;
  id: string;
  text?: string;
  attributes: Record<string, string>;
  children: SimplifiedElement[];
  originalSelector: string;
  fromShadowRoot?: boolean;
}

/**
 * Statistics about the DOM simplification process
 * Tracks how many elements were removed at each stage
 */
interface SimplificationStats {
  originalElementCount: number;
  afterVisibilityFilter: number;
  afterIgnoreFilter: number;
  afterTreeSimplification: number;
  percentageRemoved: {
    byVisibility: number;
    byIgnore: number;
    byTreeSimplification: number;
    overall: number;
  };
}

/**
 * Quality metrics for DOM simplification
 */
export interface QualityMetrics {
  semanticDensity: number;
  interactiveElementsRatio: number;
  textContentRatio: number;
  averageNestingDepth: number;
}

/**
 * Options for DOM simplification
 */
export interface DOMSimplificationOptions {
  includeDataAiId?: boolean;
  cssClassesToRemove?: string[];
  includeShadowDOM?: boolean;
}

/**
 * Result of DOM simplification process
 * Contains simplified HTML, element mappings, tree structure, statistics, and quality metrics
 */
export interface DOMSimplificationResult {
  html: string;
  elements: Map<string, ElementHandle>;
  tree: SimplifiedElement;
  stats: SimplificationStats;
  quality: QualityMetrics;
}

/**
 * DOMSimplifier class for creating LLM-friendly HTML representations
 * 
 * This class processes the page DOM through multiple stages:
 * 1. Visibility filtering - removes invisible elements
 * 2. Ignore filtering - removes non-interactive elements without content
 * 3. Tree simplification - merges unnecessary nested div/span elements
 * 4. CSS class filtering - removes noisy utility classes (Tailwind, etc.)
 * 5. Shadow DOM processing - optionally includes shadow root content
 * 
 * CSS class filtering supports wildcard patterns using `*`:
 * - `flex-*` matches `flex-1`, `flex-col`, `flex-row`, etc.
 * - `*-foreground` matches `text-foreground`, `bg-foreground`, etc.
 * - `group/*` matches `group/sidebar`, `group/header`, etc.
 * - `[&_*` matches `[&_svg]:pointer-events-none`, etc.
 * - `dark:*`, `sm:*`, etc. match responsive/theme variants
 * 
 * By default, data-ai-id attributes are NOT included to keep HTML clean.
 * 
 * Quality metrics provide insights into the simplification:
 * - semanticDensity: Ratio of semantic HTML tags vs generic div/span
 * - interactiveElementsRatio: Percentage of interactive elements
 * - textContentRatio: Percentage of elements with text content
 * - averageNestingDepth: Average depth of the DOM tree
 * 
 * @example
 * ```typescript
 * // Basic usage without data-ai-id (default)
 * const simplifier = new DOMSimplifier(page);
 * const result = await simplifier.simplify();
 * console.log(result.quality.semanticDensity);
 * 
 * // With data-ai-id for element interactions
 * const simplifier = new DOMSimplifier(page, { includeDataAiId: true });
 * const result = await simplifier.simplify();
 * const element = simplifier.getElementHandle('ai-5');
 * 
 * // With Shadow DOM support
 * const simplifier = new DOMSimplifier(page, { includeShadowDOM: true });
 * const result = await simplifier.simplify();
 * 
 * // Custom CSS classes to remove (supports wildcards)
 * const simplifier = new DOMSimplifier(page, {
 *   includeDataAiId: false,
 *   cssClassesToRemove: ['my-util-*', 'helper-*', 'exact-class']
 * });
 * ```
 */
export class DOMSimplifier {
  private idCounter = 0;
  private elementMap = new Map<string, ElementHandle>();
  private page: Page;
  private helpersInjected = false;
  private options: DOMSimplificationOptions;
  private cssPatterns: Array<string | RegExp> = [];
  private stats: SimplificationStats = {
    originalElementCount: 0,
    afterVisibilityFilter: 0,
    afterIgnoreFilter: 0,
    afterTreeSimplification: 0,
    percentageRemoved: {
      byVisibility: 0,
      byIgnore: 0,
      byTreeSimplification: 0,
      overall: 0,
    },
  };

  private static readonly DEFAULT_CSS_CLASSES_TO_REMOVE = [
    'flex',
    'flex-*',
    'inline-flex',
    'grid',
    'inline-grid',
    'min-*',
    'max-*',
    'w-*',
    'h-*',
    'gap-*',
    'space-*',
    'p-*',
    'px-*',
    'py-*',
    'pt-*',
    'pb-*',
    'pl-*',
    'pr-*',
    'm-*',
    'mx-*',
    'my-*',
    'mt-*',
    'mb-*',
    'ml-*',
    'mr-*',
    'bg-*',
    'text-*',
    'items-*',
    'justify-*',
    'overflow-*',
    'rounded-*',
    'rounded',
    'border-*',
    'border',
    'shadow-*',
    'shadow',
    'relative',
    'absolute',
    'fixed',
    'sticky',
    'inset-*',
    'top-*',
    'right-*',
    'bottom-*',
    'left-*',
    'z-*',
    'block',
    'inline-block',
    'inline',
    'hidden',
    'group',
    'group/*',
    'group-*',
    'has-*',
    'peer-*',
    'font-*',
    'leading-*',
    'tracking-*',
    'select-*',
    'pointer-events-*',
    'cursor-*',
    'ring-*',
    'opacity-*',
    'transition-*',
    'shrink-*',
    'grow-*',
    'truncate',
    'whitespace-*',
    'line-clamp-*',
    'outline-*',
    'focus-*',
    'hover-*',
    'active-*',
    'disabled-*',
    'dark:*',
    'sm:*',
    'md:*',
    'lg:*',
    'xl:*',
    '2xl:*',
    '*:opacity-*',
    '*:pointer-events-*',
    '*:size-*',
    '*:shrink-*',
    '[&_*',
    '[&>*',
  ];

  constructor(page: Page, options: DOMSimplificationOptions = {}) {
    this.page = page;
    this.options = {
      includeDataAiId: options.includeDataAiId ?? false,
      cssClassesToRemove: options.cssClassesToRemove ?? DOMSimplifier.DEFAULT_CSS_CLASSES_TO_REMOVE,
      includeShadowDOM: options.includeShadowDOM ?? false,
    };
    
    this.cssPatterns = (this.options.cssClassesToRemove ?? []).map(pattern => {
      if (pattern.includes('*')) {
        const regexPattern = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${regexPattern}$`);
      }
      return pattern;
    });
  }

  /**
   * Simplifies the current page DOM into LLM-friendly HTML
   * 
   * @returns Promise with simplified HTML, element mappings, tree structure, statistics, and quality metrics
   */
  async simplify(): Promise<DOMSimplificationResult> {
    await this.ensureBrowserHelpers();
    this.stats.originalElementCount = await this.countElements();

    // Build the entire tree in the browser to avoid N+1 queries
    const { tree, elementSelectors } = await this.buildTreeInBrowser();

    // Rebuild element map from selectors
    await this.rebuildElementMap(elementSelectors);

    this.stats.afterTreeSimplification = this.countTreeNodes(tree);
    this.calculatePercentages();

    const html = this.treeToHTML(tree);
    const quality = this.calculateQualityMetrics(tree);

    return { html, elements: this.elementMap, tree, stats: this.stats, quality };
  }

  private async ensureBrowserHelpers(): Promise<void> {
    if (this.helpersInjected) {
      return;
    }

    const helperScript = `
      if (typeof window.__name !== "function") {
        window.__name = function(target) { return target; };
      }
      if (typeof __name !== "function") {
        window.__name = function(target) { return target; };
        var __name = window.__name;
      }
    `;

    await this.page.addInitScript({ content: helperScript });
    await this.page.evaluate(helperScript);
    this.helpersInjected = true;
  }

  private async countElements(): Promise<number> {
    return await this.page.evaluate(() => {
      return document.querySelectorAll('*').length;
    });
  }

  private async countMarkedElements(selector: string): Promise<number> {
    return await this.page.evaluate((sel) => {
      return document.querySelectorAll(sel).length;
    }, selector);
  }

  private countTreeNodes(node: SimplifiedElement): number {
    let count = 1;
    for (const child of node.children) {
      count += this.countTreeNodes(child);
    }
    return count;
  }

  private calculatePercentages(): void {
    const original = this.stats.originalElementCount;
    if (original === 0) return;

    this.stats.percentageRemoved.byVisibility =
      ((original - this.stats.afterVisibilityFilter) / original) * 100;
    this.stats.percentageRemoved.byIgnore =
      ((this.stats.afterVisibilityFilter - this.stats.afterIgnoreFilter) /
        original) *
      100;
    this.stats.percentageRemoved.byTreeSimplification =
      ((this.stats.afterIgnoreFilter - this.stats.afterTreeSimplification) /
        original) *
      100;
    this.stats.percentageRemoved.overall =
      ((original - this.stats.afterTreeSimplification) / original) * 100;
  }

  private filterCssClasses(classValue: string): string {
    if (!classValue || !this.cssPatterns.length) {
      return classValue;
    }

    const classes = classValue.split(/\s+/);
    const filtered = classes.filter(cls => {
      return !this.cssPatterns.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(cls);
        }
        return pattern === cls;
      });
    });
    
    return filtered.join(' ');
  }

  /**
   * Build the entire DOM tree in the browser in a single call to avoid N+1 queries
   */
  private async buildTreeInBrowser(): Promise<{ 
    tree: SimplifiedElement; 
    elementSelectors: Map<string, string> 
  }> {
    const result = await this.page.evaluate((options: {
      includeDataAiId: boolean;
      cssPatterns: string[];
      includeShadowDOM: boolean;
    }) => {
      // Helper to check if element is visible
      function isElementVisible(element: Element): { 
        visible: boolean; 
        inViewport: boolean; 
        renderable: boolean 
      } {
        const tag = element.tagName.toLowerCase();
        if (tag === 'body' || tag === 'html') {
          return { visible: true, inViewport: true, renderable: true };
        }

        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        // Check if element is renderable (not hidden)
        if (rect.width === 0 || rect.height === 0) {
          return { visible: false, inViewport: false, renderable: false };
        }
        if (style.display === 'none') {
          return { visible: false, inViewport: false, renderable: false };
        }
        if (style.visibility === 'hidden') {
          return { visible: false, inViewport: false, renderable: false };
        }
        if (parseFloat(style.opacity) === 0) {
          return { visible: false, inViewport: false, renderable: false };
        }

        // Element is renderable, now check viewport
        const isInViewport = rect.top < window.innerHeight && 
                           rect.bottom > 0 && 
                           rect.left < window.innerWidth && 
                           rect.right > 0;

        // Check if element is obscured by others (only for elements in viewport)
        let isObscured = false;
        if (isInViewport) {
          const points = [
            [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
            [rect.left + 5, rect.top + 5],
            [rect.right - 5, rect.top + 5],
            [rect.left + 5, rect.bottom - 5],
            [rect.right - 5, rect.bottom - 5],
          ];

          let visiblePoints = 0;
          for (const [x, y] of points) {
            if (x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight) {
              const topElement = document.elementFromPoint(x, y);
              if (topElement && (element === topElement || element.contains(topElement))) {
                visiblePoints++;
              }
            }
          }
          isObscured = visiblePoints === 0;
        }

        return {
          visible: !isObscured,
          inViewport: isInViewport,
          renderable: true
        };
      }

      // Helper to check if SVG should be ignored
      function shouldIgnoreSVG(element: Element): boolean {
        // Don't ignore SVG if it has accessibility attributes
        if (element.getAttribute('role') || 
            element.getAttribute('aria-label') ||
            element.querySelector('title')) {
          return false;
        }

        // Don't ignore if parent is interactive
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
          if (['button', 'a'].includes(parent.tagName.toLowerCase()) ||
              parent.getAttribute('role') === 'button' ||
              parent.hasAttribute('onclick')) {
            return false;
          }
          parent = parent.parentElement;
        }

        return true;
      }

      // Helper to check if element should be ignored
      function shouldIgnoreElement(element: Element): boolean {
        const tag = element.tagName.toLowerCase();

        const ignoreTags = [
          'script', 'style', 'noscript', 'meta', 'link', 'br', 'hr',
          'path', 'g', 'iframe',
        ];

        // Special handling for SVG
        if (tag === 'svg') {
          return shouldIgnoreSVG(element);
        }

        if (ignoreTags.includes(tag)) return true;

        const isInteractive = [
          'button', 'a', 'input', 'select', 'textarea', 'label'
        ].includes(tag) || 
        element.getAttribute('role') === 'button' || 
        element.hasAttribute('onclick');

        if (!isInteractive) {
          const text = element.textContent?.trim() || '';
          const hasText = text.length > 0;
          const hasChildren = element.children.length > 0;
          const hasShadowChildren = element.shadowRoot && element.shadowRoot.children.length > 0;

          if (!hasText && !hasChildren && !hasShadowChildren) return true;
        }

        if (element.getAttribute('aria-hidden') === 'true') return true;

        return false;
      }

      // Filter CSS classes
      function filterCssClasses(classValue: string, patterns: string[]): string {
        if (!classValue || !patterns.length) return classValue;
        
        const regexPatterns = patterns.map(pattern => {
          if (pattern.includes('*')) {
            const regexPattern = pattern
              .replace(/[.+^${}()|[\]\\]/g, '\\$&')
              .replace(/\*/g, '.*');
            return new RegExp(`^${regexPattern}$`);
          }
          return pattern;
        });

        const classes = classValue.split(/\s+/);
        const filtered = classes.filter(cls => {
          return !regexPatterns.some(pattern => {
            if (pattern instanceof RegExp) {
              return pattern.test(cls);
            }
            return pattern === cls;
          });
        });
        
        return filtered.join(' ');
      }

      // Get unique selector for element
      function getUniqueSelector(element: Element): string {
        const paths: string[] = [];
        let current: Element | null = element;

        while (current && current !== document.body) {
          let selector = current.tagName.toLowerCase();

          if (current.id) {
            selector += `#${current.id}`;
            paths.unshift(selector);
            break;
          }

          const parent = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(current);
            if (siblings.filter(s => s.tagName === current!.tagName).length > 1) {
              selector += `:nth-child(${index + 1})`;
            }
          }

          paths.unshift(selector);
          current = parent;
        }

        return paths.length > 0 ? 'body > ' + paths.join(' > ') : 'body';
      }

      // Build node recursively
      let idCounter = 0;
      const elementSelectors = new Map<string, string>();
      const stats = {
        originalCount: 0,
        afterVisibility: 0,
        afterIgnore: 0
      };

      function buildNode(element: Element): SimplifiedElement | null {
        stats.originalCount++;

        // Check if element should be ignored
        if (shouldIgnoreElement(element)) {
          return null;
        }
        stats.afterIgnore++;

        // Check visibility
        const visibility = isElementVisible(element);
        if (!visibility.renderable) {
          return null;
        }
        stats.afterVisibility++;

        const id = `ai-${idCounter++}`;
        const selector = getUniqueSelector(element);
        elementSelectors.set(id, selector);

        // Set data-ai-id for later reference
        element.setAttribute('data-ai-id', id);

        // Extract attributes
        const tag = element.tagName.toLowerCase();
        const text = Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .filter(t => !!t)
          .join(' ');

        const attributes: Record<string, string> = {};

        // Add offscreen attribute if element is not in viewport but is visible
        if (visibility.visible && !visibility.inViewport) {
          attributes['data-ai-offscreen'] = 'true';
        }

        // Collect important attributes
        ['id', 'name', 'type', 'placeholder', 'href', 'src', 'alt', 'title', 'role']
          .forEach(attr => {
            const value = element.getAttribute(attr);
            if (value) attributes[attr] = value;
          });

        // Collect aria attributes
        Array.from(element.attributes).forEach(attr => {
          if (attr.name.startsWith('aria-')) {
            attributes[attr.name] = attr.value;
          }
        });

        // Handle class attribute with filtering
        const classValue = element.getAttribute('class');
        if (classValue) {
          const filtered = filterCssClasses(classValue, options.cssPatterns);
          if (filtered) attributes.class = filtered;
        }

        // Process children
        const children: SimplifiedElement[] = [];
        
        // Process regular children
        Array.from(element.children).forEach(child => {
          const childNode = buildNode(child as Element);
          if (childNode) {
            children.push(childNode);
          }
        });

        // Process shadow DOM children if enabled
        if (options.includeShadowDOM && element.shadowRoot) {
          Array.from(element.shadowRoot.children).forEach(child => {
            const childNode = buildNode(child as Element);
            if (childNode) {
              childNode.fromShadowRoot = true;
              children.push(childNode);
            }
          });
        }

        return {
          tag,
          id,
          text: text || undefined,
          attributes,
          children,
          originalSelector: selector,
          fromShadowRoot: false
        };
      }

      // Simplify node by merging unnecessary divs/spans
      function simplifyNode(node: SimplifiedElement): SimplifiedElement {
        if (node.children.length === 1 && !node.text) {
          const child = node.children[0];

          const semanticTags = [
            'form', 'table', 'ul', 'ol', 'nav', 'header', 'footer',
            'article', 'section', 'main', 'aside', 'button', 'a',
            'input', 'select', 'textarea', 'label', 'h1', 'h2', 'h3',
            'h4', 'h5', 'h6'
          ];

          const isSemanticParent = semanticTags.includes(node.tag);
          const isSemanticChild = semanticTags.includes(child.tag);

          if (!isSemanticParent && !isSemanticChild &&
              ['div', 'span'].includes(node.tag) &&
              ['div', 'span'].includes(child.tag)) {
            const mergedAttributes = { ...child.attributes, ...node.attributes };
            
            return simplifyNode({
              ...child,
              attributes: mergedAttributes,
              id: node.id,
              originalSelector: node.originalSelector,
            });
          }
        }

        return {
          ...node,
          children: node.children.map(child => simplifyNode(child)),
        };
      }

      // Build the tree starting from body
      const bodyNode = buildNode(document.body);
      if (!bodyNode) {
        throw new Error('Failed to build DOM tree');
      }

      const simplifiedTree = simplifyNode(bodyNode);

      // Return tree and selectors
      return {
        tree: simplifiedTree,
        elementSelectors: Array.from(elementSelectors.entries()),
        stats
      };
    }, {
      includeDataAiId: this.options.includeDataAiId ?? false,
      cssPatterns: this.options.cssClassesToRemove ?? [],
      includeShadowDOM: this.options.includeShadowDOM ?? false
    });

    // Update stats
    this.stats.afterVisibilityFilter = result.stats.afterVisibility;
    this.stats.afterIgnoreFilter = result.stats.afterIgnore;

    // Convert array back to Map
    const elementSelectors = new Map<string, string>(result.elementSelectors);

    return { tree: result.tree, elementSelectors };
  }

  /**
   * Rebuild element map from selectors
   */
  private async rebuildElementMap(elementSelectors: Map<string, string>): Promise<void> {
    this.elementMap.clear();
    
    for (const [id, _selector] of elementSelectors) {
      // Use data-ai-id to find elements as it was set during tree building
      const handle = await this.page.$(`[data-ai-id="${id}"]`);
      if (handle) {
        this.elementMap.set(id, handle);
      }
    }
  }

  // Note: These methods are no longer used after optimization
  // They are kept for reference but will be removed in a future cleanup

  private simplifyNode(node: SimplifiedElement): SimplifiedElement {
    if (node.children.length === 1 && !node.text) {
      const child = node.children[0];

      const isSemanticParent = [
        'form',
        'table',
        'ul',
        'ol',
        'nav',
        'header',
        'footer',
        'article',
        'section',
        'main',
        'aside',
      ].includes(node.tag);

      const isSemanticChild = [
        'button',
        'a',
        'input',
        'select',
        'textarea',
        'label',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ].includes(child.tag);

      if (
        !isSemanticParent &&
        !isSemanticChild &&
        ['div', 'span'].includes(node.tag) &&
        ['div', 'span'].includes(child.tag)
      ) {
        const mergedAttributes = { ...child.attributes, ...node.attributes };

        return this.simplifyNode({
          ...child,
          attributes: mergedAttributes,
          id: node.id,
          originalSelector: node.originalSelector,
        });
      }
    }

    return {
      ...node,
      children: node.children.map((child) => this.simplifyNode(child)),
    };
  }

  private treeToHTML(node: SimplifiedElement, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    const attrs = Object.entries(node.attributes)
      .filter(([key]) => key !== 'data-ai-offscreen') // Handle separately
      .map(([key, value]) => `${key}="${this.escapeHTML(value)}"`)
      .join(' ');

    const attrString = attrs ? ' ' + attrs : '';
    const dataId = this.options.includeDataAiId ? ` data-ai-id="${node.id}"` : '';
    const shadowRoot = node.fromShadowRoot ? ' data-shadow-root="true"' : '';
    const offscreen = node.attributes['data-ai-offscreen'] ? ' data-ai-offscreen="true"' : '';

    if (node.children.length === 0 && !node.text) {
      return `${spaces}<${node.tag}${dataId}${shadowRoot}${offscreen}${attrString} />`;
    }

    let html = `${spaces}<${node.tag}${dataId}${shadowRoot}${offscreen}${attrString}>`;

    if (node.text && node.children.length === 0) {
      html += this.escapeHTML(node.text);
    } else {
      html += '\n';
      if (node.text) {
        html += `${spaces}  ${this.escapeHTML(node.text)}\n`;
      }
      for (const child of node.children) {
        html += this.treeToHTML(child, indent + 1) + '\n';
      }
      html += spaces;
    }

    html += `</${node.tag}>`;
    return html;
  }

  private escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private calculateQualityMetrics(tree: SimplifiedElement): QualityMetrics {
    const semanticTags = [
      'header', 'nav', 'main', 'footer', 'article', 'section', 'aside',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'form', 'label',
      'button', 'a', 'input', 'select', 'textarea'
    ];

    const interactiveTags = [
      'button', 'a', 'input', 'select', 'textarea', 'details', 'summary'
    ];

    let totalElements = 0;
    let semanticElements = 0;
    let interactiveElements = 0;
    let elementsWithText = 0;
    let totalDepth = 0;
    let leafNodes = 0;

    const traverse = (node: SimplifiedElement, depth: number = 0): void => {
      totalElements++;
      totalDepth += depth;

      if (semanticTags.includes(node.tag)) {
        semanticElements++;
      }

      if (interactiveTags.includes(node.tag) || 
          node.attributes.role === 'button' || 
          node.attributes['aria-haspopup']) {
        interactiveElements++;
      }

      if (node.text && node.text.trim().length > 0) {
        elementsWithText++;
      }

      if (node.children.length === 0) {
        leafNodes++;
      } else {
        for (const child of node.children) {
          traverse(child, depth + 1);
        }
      }
    };

    traverse(tree);

    return {
      semanticDensity: totalElements > 0 ? (semanticElements / totalElements) * 100 : 0,
      interactiveElementsRatio: totalElements > 0 ? (interactiveElements / totalElements) * 100 : 0,
      textContentRatio: totalElements > 0 ? (elementsWithText / totalElements) * 100 : 0,
      averageNestingDepth: totalElements > 0 ? totalDepth / totalElements : 0,
    };
  }

  /**
   * Gets the original ElementHandle for a simplified element by its data-ai-id
   * 
   * @param aiId - The data-ai-id value from simplified HTML
   * @returns ElementHandle if found, undefined otherwise
   */
  getElementHandle(aiId: string): ElementHandle | undefined {
    return this.elementMap.get(aiId);
  }

  /**
   * Gets the CSS selector for a simplified element
   * 
   * @param aiId - The data-ai-id value from simplified HTML
   * @returns CSS selector string or null if not found
   */
  async getSelector(aiId: string): Promise<string | null> {
    const handle = this.elementMap.get(aiId);
    if (!handle) return null;

    return await handle
      .evaluate((el: Element) => {
        return el.getAttribute('data-ai-id');
      })
      .then((id: string | null) => (id ? `[data-ai-id="${id}"]` : null));
  }
}
