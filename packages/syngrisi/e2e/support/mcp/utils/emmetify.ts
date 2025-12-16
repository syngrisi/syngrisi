import * as cheerio from 'cheerio';
import type { Element, Text, AnyNode } from 'domhandler';

interface EmmetifyConfig {
  skipTags?: boolean;
  prioritizeAttributes?: boolean;
  simplifyClasses?: boolean;
  simplifyImages?: boolean;
  simplifyAbsoluteLinks?: boolean;
  simplifyRelativeLinks?: boolean;
  skipEmptyAttributes?: boolean;
  tagsToSkip?: Set<string>;
  primaryAttrs?: Set<string>;
  secondaryAttrs?: Set<string>;
  ignoreAttrs?: Set<string>;
}

interface HtmlNode {
  id: string;
  tag: string;
  attrs: Record<string, string | string[]>;
  parentId?: string;
  childrenIds: string[];
  textContent?: string;
  isTextNode: boolean;
  nonTextChildrenCount: number;
}

class SingleTokenNames {
  private names: Set<string>;
  
  constructor() {
    this.names = new Set([
      'alice', 'bob', 'charlie', 'david', 'emma', 'frank', 'grace', 'henry',
      'ivy', 'jack', 'kate', 'leo', 'mary', 'noah', 'olivia', 'peter',
      'quinn', 'rose', 'sam', 'tom', 'uma', 'victor', 'wendy', 'xavier',
      'yvonne', 'zoe'
    ]);
  }

  getName(): string {
    const name = Array.from(this.names)[0];
    this.names.delete(name);
    return name;
  }
}

class HtmlNodePool {
  private nextId = 0;
  private nodes: Map<string, HtmlNode> = new Map();
  private rootIds: Set<string> = new Set();
  private sequenceCounter = 0;

  getNextId(): string {
    this.nextId++;
    return `n${this.nextId}`;
  }

  createTextNode(text: string): string {
    const newId = this.getNextId();
    this.sequenceCounter++;

    const node: HtmlNode = {
      id: newId,
      tag: '#text',
      attrs: {},
      childrenIds: [],
      textContent: text.trim(),
      isTextNode: true,
      nonTextChildrenCount: 0,
    };

    this.nodes.set(newId, node);
    return newId;
  }

  createNode(element: Element, isRoot = false): string {
    this.sequenceCounter++;
    const newId = this.getNextId();

    const attrs: Record<string, string | string[]> = {};
    if (element.attribs) {
      for (const [key, value] of Object.entries(element.attribs)) {
        const strValue = String(value);
        if (key === 'class') {
          attrs[key] = strValue.split(/\s+/).filter(Boolean);
        } else {
          attrs[key] = strValue;
        }
      }
    }

    const node: HtmlNode = {
      id: newId,
      tag: element.name,
      attrs,
      childrenIds: [],
      isTextNode: false,
      nonTextChildrenCount: 0,
    };

    this.nodes.set(newId, node);
    if (isRoot) {
      this.rootIds.add(newId);
    }

    return newId;
  }

  getNode(nodeId: string): HtmlNode | undefined {
    return this.nodes.get(nodeId);
  }

  getRootIds(): string[] {
    return Array.from(this.rootIds);
  }

  updateParentChild(childId: string, parentId: string): void {
    const child = this.nodes.get(childId);
    const parent = this.nodes.get(parentId);

    if (!child || !parent) return;

    child.parentId = parentId;
    if (!parent.childrenIds.includes(childId)) {
      parent.childrenIds.push(childId);
    }

    if (!child.isTextNode) {
      parent.nonTextChildrenCount++;
    }
  }

  getSiblingsCount(nodeId: string): number {
    const node = this.nodes.get(nodeId);
    if (!node || !node.parentId) return 0;

    const parent = this.nodes.get(node.parentId);
    return parent ? parent.nonTextChildrenCount - 1 : 0;
  }
}

class HtmlParser {
  private skipTags: Set<string>;

  constructor(private config: EmmetifyConfig) {
    this.skipTags = config.skipTags
      ? config.tagsToSkip || new Set()
      : new Set();
  }

  private processNodeContents(
    element: Element,
    nodePool: HtmlNodePool
  ): string[] {
    const contentIds: string[] = [];

    if (!element.children) return contentIds;

    for (const child of element.children) {
      if (child.type === 'comment') continue;

      if (child.type === 'text') {
        const text = (child as Text).data.trim();
        if (text) {
          const textId = nodePool.createTextNode(text);
          contentIds.push(textId);
        }
      } else if (child.type === 'tag') {
        const tagElement = child as Element;
        if (!this.skipTags.has(tagElement.name)) {
          const tagId = nodePool.createNode(tagElement);
          contentIds.push(tagId);

          const childIds = this.processNodeContents(tagElement, nodePool);
          for (const childId of childIds) {
            nodePool.updateParentChild(childId, tagId);
          }
        }
      }
    }

    return contentIds;
  }

  parse(html: string): HtmlNodePool {
    const $ = cheerio.load(html);
    const nodePool = new HtmlNodePool();

    const rootElements: Element[] = [];
    
    const bodyContent = $('body').children();
    if (bodyContent.length > 0) {
      bodyContent.each((_, elem) => {
        if (elem.type === 'tag' && !this.skipTags.has((elem as Element).name)) {
          rootElements.push(elem as Element);
        }
      });
    } else {
      $.root().children().each((_, elem) => {
        if (elem.type === 'tag' && !this.skipTags.has((elem as Element).name)) {
          const tagName = (elem as Element).name;
          if (tagName !== 'html' && tagName !== 'head' && tagName !== 'body') {
            rootElements.push(elem as Element);
          }
        }
      });
    }

    for (const rootElement of rootElements) {
      const rootId = nodePool.createNode(rootElement, true);
      const contentIds = this.processNodeContents(rootElement, nodePool);

      for (const contentId of contentIds) {
        nodePool.updateParentChild(contentId, rootId);
      }
    }

    return nodePool;
  }
}

class HtmlConverter {
  private classesMap: Map<string, string> = new Map();
  private linksMap: Map<string, string> = new Map();
  private imagesMap: Map<string, string> = new Map();
  private singleTokenNames: SingleTokenNames;

  constructor(private config: EmmetifyConfig) {
    this.singleTokenNames = new SingleTokenNames();
  }

  private escapeText(text: string): string {
    let escaped = text
      .replace(/\\/g, '\\\\')
      .replace(/\*/g, '\\*')
      .replace(/\$/g, '\\$');

    return escaped.split(/\s+/).filter(Boolean).join(' ');
  }

  private filterAttributes(attrs: Record<string, string | string[]>): Record<string, string | string[]> {
    if (!this.config.prioritizeAttributes) return attrs;

    const primaryAttrs = this.config.primaryAttrs || new Set();
    const secondaryAttrs = this.config.secondaryAttrs || new Set();
    const ignoreAttrs = this.config.ignoreAttrs || new Set();

    const filtered: Record<string, string | string[]> = {};
    
    for (const [key, value] of Object.entries(attrs)) {
      if (ignoreAttrs.has(key)) continue;
      if (key.startsWith('data-')) continue;
      if (key.startsWith('on')) continue;
      filtered[key] = value;
    }

    const primaryFound: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(filtered)) {
      if (primaryAttrs.has(key)) {
        primaryFound[key] = value;
      }
    }

    if (Object.keys(primaryFound).length > 0) {
      return primaryFound;
    }

    const secondaryFound: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(filtered)) {
      if (secondaryAttrs.has(key)) {
        secondaryFound[key] = value;
      }
    }

    return secondaryFound;
  }

  private nodeToEmmet(node: HtmlNode): string {
    if (node.isTextNode) {
      return `{${this.escapeText(node.textContent || '')}}`;
    }

    const parts: string[] = [node.tag];

    const attributes = this.filterAttributes(node.attrs);

    if (attributes.id) {
      parts.push(`#${attributes.id}`);
    }

    if (attributes.class) {
      const classes = Array.isArray(attributes.class) 
        ? attributes.class 
        : attributes.class.split(/\s+/);
      
      const classStr = classes.join(' ');
      
      if (this.config.simplifyClasses) {
        let mapped = this.classesMap.get(classStr);
        if (!mapped) {
          mapped = this.singleTokenNames.getName();
          this.classesMap.set(classStr, mapped);
        }
        parts.push(`.${mapped}`);
      } else {
        parts.push(`.${classes.join('.')}`);
      }
    }

    if (node.tag === 'a' && attributes.href) {
      let href = String(attributes.href);
      
      if (this.config.simplifyAbsoluteLinks && href.startsWith('http')) {
        let mapped = this.linksMap.get(href);
        if (!mapped) {
          mapped = this.singleTokenNames.getName();
          this.linksMap.set(href, mapped);
        }
        attributes.href = mapped;
      } else if (this.config.simplifyRelativeLinks && !href.startsWith('http')) {
        let mapped = this.linksMap.get(href);
        if (!mapped) {
          mapped = this.singleTokenNames.getName();
          this.linksMap.set(href, mapped);
        }
        attributes.href = mapped;
      }
    }

    if (this.config.simplifyImages && node.tag === 'img' && attributes.src) {
      const src = String(attributes.src);
      let mapped = this.imagesMap.get(src);
      if (!mapped) {
        mapped = this.singleTokenNames.getName();
        this.imagesMap.set(src, mapped);
      }
      attributes.src = mapped;
    }

    const remaining: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(attributes)) {
      if (key !== 'id' && key !== 'class') {
        if (this.config.skipEmptyAttributes && !value) continue;
        remaining[key] = value;
      }
    }

    if (Object.keys(remaining).length > 0) {
      const attrStrs: string[] = [];
      for (const [key, value] of Object.entries(remaining)) {
        const valueStr = Array.isArray(value) ? value.join(' ') : value;
        if (valueStr.includes(' ')) {
          attrStrs.push(`${key}="${valueStr}"`);
        } else if (valueStr === '') {
          attrStrs.push(key);
        } else {
          attrStrs.push(`${key}=${valueStr}`);
        }
      }
      parts.push(`[${attrStrs.join(' ')}]`);
    }

    return parts.join('');
  }

  private buildEmmet(nodePool: HtmlNodePool, nodeId: string): string {
    const node = nodePool.getNode(nodeId);
    if (!node) return '';

    const nodeEmmet = this.nodeToEmmet(node);

    const childrenNodes: HtmlNode[] = [];
    let directTextChild: HtmlNode | undefined;

    for (let i = 0; i < node.childrenIds.length; i++) {
      const childId = node.childrenIds[i];
      const child = nodePool.getNode(childId);
      if (!child) continue;

      if (child.isTextNode && i === 0 && !directTextChild) {
        directTextChild = child;
      } else {
        childrenNodes.push(child);
      }
    }

    const childrenEmmet = childrenNodes
      .map(child => this.buildEmmet(nodePool, child.id))
      .filter(Boolean);

    const textNodeEmmet = directTextChild 
      ? this.nodeToEmmet(directTextChild) 
      : '';

    const childrenStr = childrenEmmet.join('+');
    const childrenGroup = childrenStr ? `>${childrenStr}` : '';

    const siblingsCount = nodePool.getSiblingsCount(node.id);
    const hasSiblingsAndChildren = siblingsCount > 0 && childrenNodes.length > 0;

    if (hasSiblingsAndChildren) {
      return `(${nodeEmmet}${textNodeEmmet}${childrenGroup})`;
    } else {
      return `${nodeEmmet}${textNodeEmmet}${childrenGroup}`;
    }
  }

  convert(nodePool: HtmlNodePool): string {
    const rootIds = nodePool.getRootIds();
    const results: string[] = [];
    
    for (const rootId of rootIds) {
      const result = this.buildEmmet(nodePool, rootId);
      if (result) {
        results.push(result);
      }
    }

    return results.join('+');
  }
}

export class Emmetifier {
  private parser: HtmlParser;
  private converter: HtmlConverter;

  constructor(config: EmmetifyConfig = {}) {
    const defaultConfig: EmmetifyConfig = {
      skipTags: true,
      prioritizeAttributes: true,
      simplifyClasses: true,
      simplifyImages: true,
      simplifyAbsoluteLinks: true,
      simplifyRelativeLinks: false,
      skipEmptyAttributes: true,
      tagsToSkip: new Set([
        'script',
        'style',
        'noscript',
        'head',
        'meta',
        'link',
        'title',
        'base',
        'svg',
      ]),
      primaryAttrs: new Set([
        'id',
        'class',
        'href',
        'role',
        'aria-label',
        'title',
      ]),
      secondaryAttrs: new Set([
        'name',
        'type',
        'value',
        'placeholder',
        'alt',
        'for',
      ]),
      ignoreAttrs: new Set([
        'style',
        'target',
        'rel',
        'loading',
        'srcset',
        'sizes',
        'width',
        'height',
      ]),
    };

    const finalConfig = { ...defaultConfig, ...config };
    this.parser = new HtmlParser(finalConfig);
    this.converter = new HtmlConverter(finalConfig);
  }

  emmetify(html: string): string {
    const nodePool = this.parser.parse(html);
    return this.converter.convert(nodePool);
  }
}

export function emmetifyCompactHtml(html: string): string {
  const emmetifier = new Emmetifier({
    skipTags: true,
    prioritizeAttributes: true,
    simplifyClasses: true,
    simplifyImages: true,
    simplifyAbsoluteLinks: true,
    simplifyRelativeLinks: false,
  });

  return emmetifier.emmetify(html);
}
