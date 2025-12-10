/**
 * DomNode type for RCA (Root Cause Analysis)
 * This type matches the DomNode interface in @syngrisi/core-api
 */
interface DomNode {
    tagName: string;
    attributes: Record<string, string>;
    rect: { x: number; y: number; width: number; height: number };
    computedStyles: Record<string, string>;
    children: DomNode[];
    text?: string;
}

/**
 * Maximum depth for DOM tree traversal to prevent stack overflow
 */
const MAX_DEPTH = 15

/**
 * Maximum text length to capture for each element
 */
const MAX_TEXT_LENGTH = 200

/**
 * Tags to skip during DOM collection (non-visual elements)
 */
const SKIP_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'HEAD', 'SVG', 'PATH']

/**
 * CSS properties to capture for RCA analysis
 */
const STYLES_TO_CAPTURE = [
    // Display & Visibility
    'display', 'visibility', 'opacity',
    // Position
    'position', 'top', 'right', 'bottom', 'left',
    // Dimensions
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    // Box Model
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-width', 'border-style', 'border-color',
    'border-radius',
    // Colors
    'background-color', 'color',
    // Typography
    'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
    'text-decoration', 'text-transform', 'letter-spacing',
    // Layout
    'overflow', 'overflow-x', 'overflow-y',
    'z-index',
    'transform',
    // Flexbox
    'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'gap',
    // Grid
    'grid-template-columns', 'grid-template-rows', 'grid-gap',
    // Box Shadow
    'box-shadow',
]

/**
 * Check if element is visible (has dimensions and not hidden)
 */
function isVisible(el: Element): boolean {
    const style = window.getComputedStyle(el)
    if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        parseFloat(style.opacity) === 0
    ) {
        return false
    }
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
}

/**
 * Extract relevant attributes from element
 * Skips most data-* attributes to reduce payload size
 */
function getAttributes(el: Element): Record<string, string> {
    const attrs: Record<string, string> = {}
    for (const attr of Array.from(el.attributes)) {
        // Include data-testid but skip other data-* attributes
        if (!attr.name.startsWith('data-') || attr.name === 'data-testid') {
            attrs[attr.name] = attr.value
        }
    }
    return attrs
}

/**
 * Extract computed styles that affect visual appearance
 */
function getComputedStyles(el: Element): Record<string, string> {
    const computed = window.getComputedStyle(el)
    const styles: Record<string, string> = {}

    for (const prop of STYLES_TO_CAPTURE) {
        const value = computed.getPropertyValue(prop)
        // Skip default/empty values to reduce payload
        if (value && value !== 'initial' && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px' && value !== 'rgba(0, 0, 0, 0)') {
            // Convert kebab-case to camelCase for consistency
            const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
            styles[camelProp] = value
        }
    }
    return styles
}

/**
 * Get direct text content (not from children)
 */
function getDirectText(el: Element): string | undefined {
    let text = ''
    for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent?.trim() || ''
        }
    }
    // Truncate long text
    const trimmed = text.trim()
    if (!trimmed) return undefined
    return trimmed.length > MAX_TEXT_LENGTH ? trimmed.substring(0, MAX_TEXT_LENGTH) + '...' : trimmed
}

/**
 * Recursively collect DOM node and its children
 */
function collectNode(el: Element, depth: number = 0): DomNode | null {
    // Limit depth to prevent stack overflow
    if (depth > MAX_DEPTH) return null

    // Skip invisible elements
    if (!isVisible(el)) return null

    // Skip non-visual elements
    if (SKIP_TAGS.includes(el.tagName)) return null

    const rect = el.getBoundingClientRect()

    // Collect children
    const children: DomNode[] = []
    for (const child of Array.from(el.children)) {
        const childNode = collectNode(child, depth + 1)
        if (childNode) {
            children.push(childNode)
        }
    }

    return {
        tagName: el.tagName.toLowerCase(),
        attributes: getAttributes(el),
        rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
        },
        computedStyles: getComputedStyles(el),
        children,
        text: getDirectText(el),
    }
}

/**
 * Collects DOM tree with computed styles for RCA (Root Cause Analysis)
 * This function runs in browser context via WebdriverIO
 *
 * @param done - Callback function for WebdriverIO async compatibility
 * @returns Serialized DomNode tree as JSON string
 * @hidden - hidden for typedoc
 */
export function getDomDump(done: (result: string) => void): string {
    const root = collectNode(document.body)
    const result = JSON.stringify(root)
    done(result)
    return result
}
