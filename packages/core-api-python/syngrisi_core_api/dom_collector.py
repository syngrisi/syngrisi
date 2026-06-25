"""DOM collector script ported from JS `src/domCollector.ts`.

The runtime ``collectDomTree`` function is browser-only; for Python parity we
expose the injectable script string constant and an accessor. The script body
mirrors the JS source.
"""

# Browser-injectable DOM collection script. Mirrors the JS COLLECT_DOM_TREE_SCRIPT,
# which wraps `collectDomTree.toString()` in a self-invoking function.
COLLECT_DOM_TREE_SCRIPT = r"""
(function() {
    function collectDomTree() {
        function isVisible(el) {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' ||
                style.visibility === 'hidden' ||
                parseFloat(style.opacity) === 0) {
                return false;
            }
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }
        function getAttributes(el) {
            const attrs = {};
            for (const attr of Array.from(el.attributes)) {
                if (!attr.name.startsWith('data-') || attr.name === 'data-testid') {
                    attrs[attr.name] = attr.value;
                }
            }
            return attrs;
        }
        function getComputedStyles(el) {
            const computed = window.getComputedStyle(el);
            const styles = {};
            const stylesToCapture = [
                'display', 'visibility', 'opacity',
                'position', 'top', 'right', 'bottom', 'left',
                'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
                'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
                'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
                'border', 'border-width', 'border-style', 'border-color',
                'border-radius',
                'background-color', 'color',
                'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
                'text-decoration', 'text-transform', 'letter-spacing',
                'overflow', 'overflow-x', 'overflow-y',
                'z-index',
                'transform',
                'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'gap',
                'grid-template-columns', 'grid-template-rows', 'grid-gap',
                'box-shadow'
            ];
            for (const prop of stylesToCapture) {
                const value = computed.getPropertyValue(prop);
                if (value && value !== 'initial' && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px' && value !== 'rgba(0, 0, 0, 0)') {
                    const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                    styles[camelProp] = value;
                }
            }
            return styles;
        }
        function getDirectText(el) {
            let text = '';
            for (const child of Array.from(el.childNodes)) {
                if (child.nodeType === Node.TEXT_NODE) {
                    text += child.textContent?.trim() || '';
                }
            }
            const trimmed = text.trim();
            if (!trimmed) return undefined;
            return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed;
        }
        function collectNode(el, depth = 0) {
            if (depth > 15) return null;
            if (!isVisible(el)) return null;
            const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'HEAD', 'SVG', 'PATH'];
            if (skipTags.includes(el.tagName)) return null;
            const rect = el.getBoundingClientRect();
            const children = [];
            for (const child of Array.from(el.children)) {
                const childNode = collectNode(child, depth + 1);
                if (childNode) {
                    children.push(childNode);
                }
            }
            return {
                tagName: el.tagName.toLowerCase(),
                attributes: getAttributes(el),
                rect: {
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyles: getComputedStyles(el),
                children,
                text: getDirectText(el)
            };
        }
        const root = collectNode(document.body);
        return JSON.stringify(root);
    }
    return collectDomTree();
})()
"""


def get_collect_dom_tree_script():
    """Return the injectable DOM collection script string."""
    return COLLECT_DOM_TREE_SCRIPT


def collect_dom_tree(*args, **kwargs):
    """Browser-only runtime function. Not available outside a browser context."""
    raise NotImplementedError(
        "collect_dom_tree runs only in a browser context; inject COLLECT_DOM_TREE_SCRIPT instead."
    )


# JS-style aliases.
getCollectDomTreeScript = get_collect_dom_tree_script
collectDomTree = collect_dom_tree
