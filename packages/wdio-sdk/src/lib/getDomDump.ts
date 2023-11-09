type DomDumpElement = {
    tag: string;
    id: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
    domPath: string[];
};

function isVisible(el: Element | null): boolean {
    while (el) {
        // @ts-ignore
        if (el === document) {
            return true
        }

        const style = window.getComputedStyle(el, null)

        if (!el || !style) {
            return false
        }

        if (style.display === 'none' || style.visibility === 'hidden' || +style.opacity === 0) {
            return false
        }

        if ((style.display === 'block' || style.display === 'inline-block') &&
            style.height === '0px' && style.overflow === 'hidden') {
            return false
        }

        return style.position === 'fixed' || isVisible(el.parentNode as Element)
    }

    return false
}

function getDomPath(el: Element): string[] {
    const stack: string[] = []
    while (el.parentNode !== null) {
        let sibCount = 0
        let sibIndex = 0
        for (let i = 0; i < el.parentNode.childNodes.length; i++) {
            const sib = el.parentNode.childNodes[i] as Element
            if (sib.nodeName === el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount
                }
                sibCount++
            }
        }
        if (el.hasAttribute('id') && el.id !== '') {
            stack.unshift(`${el.nodeName.toLowerCase()}#${el.id}`)
        } else if (sibCount > 1) {
            stack.unshift(`${el.nodeName.toLowerCase()}:eq(${sibIndex})`)
        } else {
            stack.unshift(el.nodeName.toLowerCase())
        }
        el = el.parentNode as Element
    }
    return stack.slice(1)
}

function dumpElement(el: Element): DomDumpElement {
    const rect = el.getBoundingClientRect()
    return {
        tag: el.tagName,
        id: el.id,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        domPath: getDomPath(el),
    }
}

export function getDomDump(done: (result: string) => void): string {
    const elements = Array.from(document.body.getElementsByTagName('*')).filter((x) => isVisible(x))

    const dumpElements: DomDumpElement[] = []

    for (const el of elements) {
        dumpElements.push(dumpElement(el))
    }

    const result = JSON.stringify(dumpElements, null, '\t')
    done(result)
    return result
}
