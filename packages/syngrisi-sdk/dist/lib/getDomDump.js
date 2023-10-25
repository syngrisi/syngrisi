"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomDump = void 0;
function isVisible(el) {
    while (el) {
        // @ts-ignore
        if (el === document) {
            return true;
        }
        var style = window.getComputedStyle(el, null);
        if (!el || !style) {
            return false;
        }
        if (style.display === 'none' || style.visibility === 'hidden' || +style.opacity === 0) {
            return false;
        }
        if ((style.display === 'block' || style.display === 'inline-block') &&
            style.height === '0px' && style.overflow === 'hidden') {
            return false;
        }
        return style.position === 'fixed' || isVisible(el.parentNode);
    }
    return false;
}
function getDomPath(el) {
    var stack = [];
    while (el.parentNode !== null) {
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
            var sib = el.parentNode.childNodes[i];
            if (sib.nodeName === el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (el.hasAttribute('id') && el.id !== '') {
            stack.unshift("".concat(el.nodeName.toLowerCase(), "#").concat(el.id));
        }
        else if (sibCount > 1) {
            stack.unshift("".concat(el.nodeName.toLowerCase(), ":eq(").concat(sibIndex, ")"));
        }
        else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    return stack.slice(1);
}
function dumpElement(el) {
    var rect = el.getBoundingClientRect();
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
    };
}
function getDomDump(done) {
    var elements = Array.from(document.body.getElementsByTagName('*')).filter(function (x) { return isVisible(x); });
    var dumpElements = [];
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        dumpElements.push(dumpElement(el));
    }
    var result = JSON.stringify(dumpElements, null, '\t');
    done(result);
    return result;
}
exports.getDomDump = getDomDump;
