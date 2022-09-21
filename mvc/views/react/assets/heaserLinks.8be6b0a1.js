import { r as react, b as jsx, d as useMantineTheme, a4 as Global$1, a5 as css, a6 as useDidUpdate, a7 as mergeRefs, a8 as reactDom, E as useComponentDefaultProps, a9 as useReducedMotion, K as extractSystemStyles, B as Box, A as ActionIcon, c as createStyles, L as getDefaultZIndex, j as jsxs, aa as packSx, F as createPolymorphicComponent, ab as _extends, ac as React, H as useUncontrolled, ad as useFloating, ae as size, af as useFloatingAutoUpdate, ag as offset, ah as shift, ai as flip, aj as isElement, ak as useMergedRef, al as clsx, am as OptionalPortal, O as Transition$2, an as FloatingArrow, J as useId, ao as getFloatingPosition, T as Text, ap as UnstyledButton, aq as useTransition, ar as Fragment, as as getTransitionStyles, P as Paper, S as Overlay, R as Loader, at as ReactDOM, au as Portal, l as log, G as Group, h as Button, i as Progress, t as useHotkeys, C as Center, o as TextInput, V as useDisclosure, s as useLocalStorage, D as Dme, p as l6, e as Container, k as ky, a as config$1, av as queryString, u as useQuery, aw as EO, ax as Xue, ay as age, az as A0, aA as q0, aB as GY, N as Nb, aC as EH, aD as ka, aE as ZX, a0 as Lce, aF as Bpe, aG as q2 } from "./Logger.dbf872b1.js";
function findElementAncestor(element, selector) {
  let _element = element;
  while ((_element = _element.parentElement) && !_element.matches(selector))
    ;
  return _element;
}
function getPreviousIndex(current, elements, loop) {
  for (let i = current - 1; i >= 0; i -= 1) {
    if (!elements[i].disabled) {
      return i;
    }
  }
  if (loop) {
    for (let i = elements.length - 1; i > -1; i -= 1) {
      if (!elements[i].disabled) {
        return i;
      }
    }
  }
  return current;
}
function getNextIndex(current, elements, loop) {
  for (let i = current + 1; i < elements.length; i += 1) {
    if (!elements[i].disabled) {
      return i;
    }
  }
  if (loop) {
    for (let i = 0; i < elements.length; i += 1) {
      if (!elements[i].disabled) {
        return i;
      }
    }
  }
  return current;
}
function onSameLevel(target, sibling, parentSelector) {
  return findElementAncestor(target, parentSelector) === findElementAncestor(sibling, parentSelector);
}
function createScopedKeydownHandler({
  parentSelector,
  siblingSelector,
  onKeyDown,
  loop = true,
  activateOnFocus = false,
  dir = "rtl",
  orientation
}) {
  return (event) => {
    var _a;
    onKeyDown == null ? void 0 : onKeyDown(event);
    const elements = Array.from(((_a = findElementAncestor(event.currentTarget, parentSelector)) == null ? void 0 : _a.querySelectorAll(siblingSelector)) || []).filter((node) => onSameLevel(event.currentTarget, node, parentSelector));
    const current = elements.findIndex((el) => event.currentTarget === el);
    const _nextIndex = getNextIndex(current, elements, loop);
    const _previousIndex = getPreviousIndex(current, elements, loop);
    const nextIndex = dir === "rtl" ? _previousIndex : _nextIndex;
    const previousIndex = dir === "rtl" ? _nextIndex : _previousIndex;
    switch (event.key) {
      case "ArrowRight": {
        if (orientation === "horizontal") {
          event.stopPropagation();
          event.preventDefault();
          elements[nextIndex].focus();
          activateOnFocus && elements[nextIndex].click();
        }
        break;
      }
      case "ArrowLeft": {
        if (orientation === "horizontal") {
          event.stopPropagation();
          event.preventDefault();
          elements[previousIndex].focus();
          activateOnFocus && elements[previousIndex].click();
        }
        break;
      }
      case "ArrowUp": {
        if (orientation === "vertical") {
          event.stopPropagation();
          event.preventDefault();
          elements[_previousIndex].focus();
          activateOnFocus && elements[_previousIndex].click();
        }
        break;
      }
      case "ArrowDown": {
        if (orientation === "vertical") {
          event.stopPropagation();
          event.preventDefault();
          elements[_nextIndex].focus();
          activateOnFocus && elements[_nextIndex].click();
        }
        break;
      }
      case "Home": {
        event.stopPropagation();
        event.preventDefault();
        !elements[0].disabled && elements[0].focus();
        break;
      }
      case "End": {
        event.stopPropagation();
        event.preventDefault();
        const last = elements.length - 1;
        !elements[last].disabled && elements[last].focus();
        break;
      }
    }
  };
}
function getContextItemIndex(elementSelector, parentSelector, node) {
  var _a;
  if (!node) {
    return null;
  }
  return Array.from(((_a = findElementAncestor(node, parentSelector)) == null ? void 0 : _a.querySelectorAll(elementSelector)) || []).findIndex((element) => element === node);
}
function createSafeContext(errorMessage) {
  const Context = react.exports.createContext(null);
  const useSafeContext = () => {
    const ctx = react.exports.useContext(Context);
    if (ctx === null) {
      throw new Error(errorMessage);
    }
    return ctx;
  };
  const Provider = ({
    children,
    value
  }) => /* @__PURE__ */ jsx(Context.Provider, {
    value,
    children
  });
  return [Provider, useSafeContext];
}
const noop$1 = () => {
};
function closeOnEscape(callback, options = { active: true }) {
  if (typeof callback !== "function" || !options.active) {
    return noop$1;
  }
  return (event) => {
    var _a;
    if (event.key === "Escape") {
      callback();
      (_a = options.onTrigger) == null ? void 0 : _a.call(options);
    }
  };
}
function createEventHandler(parentEventHandler, eventHandler) {
  return (event) => {
    parentEventHandler == null ? void 0 : parentEventHandler(event);
    eventHandler == null ? void 0 : eventHandler(event);
  };
}
function useHovered() {
  const [hovered, setHovered] = react.exports.useState(-1);
  const resetHovered = () => setHovered(-1);
  return [hovered, { setHovered, resetHovered }];
}
function dispatchEvent$2(type, detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}
const useIsomorphicEffect$2 = typeof window !== "undefined" ? react.exports.useLayoutEffect : react.exports.useEffect;
function createUseExternalEvents$2(prefix) {
  function _useExternalEvents(events) {
    const handlers = Object.keys(events).reduce((acc, eventKey) => {
      acc[`${prefix}:${eventKey}`] = (event) => events[eventKey](event.detail);
      return acc;
    }, {});
    useIsomorphicEffect$2(() => {
      Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
        window.addEventListener(eventKey, handlers[eventKey]);
      });
      return () => Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
      });
    }, []);
  }
  function createEvent2(event) {
    return (...payload) => dispatchEvent$2(`${prefix}:${String(event)}`, payload[0]);
  }
  return [_useExternalEvents, createEvent2];
}
const StylesApiContext = react.exports.createContext({
  classNames: {},
  styles: {},
  unstyled: false
});
function StylesApiProvider({
  children,
  classNames,
  unstyled,
  styles,
  staticSelector
}) {
  return /* @__PURE__ */ jsx(StylesApiContext.Provider, {
    value: {
      classNames,
      styles,
      unstyled,
      staticSelector
    },
    children
  });
}
function useContextStylesApi() {
  return react.exports.useContext(StylesApiContext);
}
function Global({
  styles
}) {
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Global$1, {
    styles: css(typeof styles === "function" ? styles(theme) : styles)
  });
}
const DEFAULT_EVENTS = ["mousedown", "touchstart"];
function useClickOutside(handler, events, nodes) {
  const ref = react.exports.useRef();
  react.exports.useEffect(() => {
    const listener = (event) => {
      const { target } = event != null ? event : {};
      if (Array.isArray(nodes)) {
        const shouldIgnore = (target == null ? void 0 : target.hasAttribute("data-ignore-outside-clicks")) || !document.body.contains(target);
        const shouldTrigger = nodes.every((node) => !!node && !node.contains(target));
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };
    (events || DEFAULT_EVENTS).forEach((fn) => document.addEventListener(fn, listener));
    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) => document.removeEventListener(fn, listener));
    };
  }, [ref, handler, nodes]);
  return ref;
}
function useFocusReturn({ opened, shouldReturnFocus = true }) {
  const lastActiveElement = react.exports.useRef();
  const returnFocus = () => {
    var _a;
    if (lastActiveElement.current && "focus" in lastActiveElement.current && typeof lastActiveElement.current.focus === "function") {
      (_a = lastActiveElement.current) == null ? void 0 : _a.focus();
    }
  };
  useDidUpdate(() => {
    let timeout = -1;
    const clearFocusTimeout = (event) => {
      if (event.key === "Tab") {
        window.clearTimeout(timeout);
      }
    };
    document.addEventListener("keydown", clearFocusTimeout);
    if (opened) {
      lastActiveElement.current = document.activeElement;
    } else if (shouldReturnFocus) {
      timeout = window.setTimeout(returnFocus, 10);
    }
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", clearFocusTimeout);
    };
  }, [opened, shouldReturnFocus]);
  return returnFocus;
}
const TABBABLE_NODES = /input|select|textarea|button|object/;
const FOCUS_SELECTOR = "a, input, select, textarea, button, object, [tabindex]";
function hidden(element) {
  return element.style.display === "none";
}
function visible(element) {
  const isHidden = element.getAttribute("aria-hidden") || element.getAttribute("hidden") || element.getAttribute("type") === "hidden";
  if (isHidden) {
    return false;
  }
  let parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) {
      break;
    }
    if (hidden(parentElement)) {
      return false;
    }
    parentElement = parentElement.parentNode;
  }
  return true;
}
function getElementTabIndex(element) {
  let tabIndex = element.getAttribute("tabindex");
  if (tabIndex === null) {
    tabIndex = void 0;
  }
  return parseInt(tabIndex, 10);
}
function focusable(element) {
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !Number.isNaN(getElementTabIndex(element));
  const res = TABBABLE_NODES.test(nodeName) && !element.disabled || (element instanceof HTMLAnchorElement ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
  return res && visible(element);
}
function tabbable(element) {
  const tabIndex = getElementTabIndex(element);
  const isTabIndexNaN = Number.isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && focusable(element);
}
function findTabbableDescendants(element) {
  return Array.from(element.querySelectorAll(FOCUS_SELECTOR)).filter(tabbable);
}
function scopeTab(node, event) {
  const tabbable2 = findTabbableDescendants(node);
  if (!tabbable2.length) {
    event.preventDefault();
    return;
  }
  const finalTabbable = tabbable2[event.shiftKey ? 0 : tabbable2.length - 1];
  const leavingFinalTabbable = finalTabbable === document.activeElement || node === document.activeElement;
  if (!leavingFinalTabbable) {
    return;
  }
  event.preventDefault();
  const target = tabbable2[event.shiftKey ? tabbable2.length - 1 : 0];
  if (target) {
    target.focus();
  }
}
function createAriaHider(containerNode, selector = "body > :not(script)") {
  const rootNodes = Array.from(document.querySelectorAll(selector)).map((node) => {
    if (node.contains(containerNode)) {
      return void 0;
    }
    const ariaHidden = node.getAttribute("aria-hidden");
    if (ariaHidden === null || ariaHidden === "false") {
      node.setAttribute("aria-hidden", "true");
    }
    return { node, ariaHidden };
  });
  return () => {
    rootNodes.forEach((item) => {
      if (!item) {
        return;
      }
      if (item.ariaHidden === null) {
        item.node.removeAttribute("aria-hidden");
      } else {
        item.node.setAttribute("aria-hidden", item.ariaHidden);
      }
    });
  };
}
function useFocusTrap(active = true) {
  const ref = react.exports.useRef();
  const restoreAria = react.exports.useRef(null);
  const setRef = react.exports.useCallback((node) => {
    if (!active) {
      return;
    }
    if (restoreAria.current) {
      restoreAria.current();
    }
    if (node) {
      const processNode = (_node) => {
        restoreAria.current = createAriaHider(_node);
        let focusElement = node.querySelector("[data-autofocus]");
        if (!focusElement) {
          const children = Array.from(node.querySelectorAll(FOCUS_SELECTOR));
          focusElement = children.find(tabbable) || children.find(focusable) || null;
          if (!focusElement && focusable(node))
            focusElement = node;
        }
        if (focusElement) {
          focusElement.focus();
        }
      };
      setTimeout(() => {
        if (node.ownerDocument) {
          processNode(node);
        }
      });
      ref.current = node;
    } else {
      ref.current = null;
    }
  }, [active]);
  react.exports.useEffect(() => {
    if (!active) {
      return void 0;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Tab" && ref.current) {
        scopeTab(ref.current, event);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);
  return setRef;
}
const reducer = (value) => (value + 1) % 1e6;
function useForceUpdate() {
  const [, update] = react.exports.useReducer(reducer, 0);
  return update;
}
function useInterval(fn, interval) {
  const [active, setActive] = react.exports.useState(false);
  const intervalRef = react.exports.useRef();
  const fnRef = react.exports.useRef();
  react.exports.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  const start = () => {
    setActive((old) => {
      if (!old && !intervalRef.current) {
        intervalRef.current = window.setInterval(fnRef.current, interval);
      }
      return true;
    });
  };
  const stop = () => {
    setActive(false);
    window.clearInterval(intervalRef.current);
    intervalRef.current = void 0;
  };
  const toggle = () => {
    if (active) {
      stop();
    } else {
      start();
    }
  };
  return { start, stop, toggle, active };
}
function useQueue({ initialValues = [], limit }) {
  const [{ state, queue }, setState] = react.exports.useState({
    state: initialValues.slice(0, limit),
    queue: initialValues.slice(limit)
  });
  const add = (...items) => setState((current) => {
    const results = [...current.state, ...current.queue, ...items];
    return {
      state: results.slice(0, limit),
      queue: results.slice(limit)
    };
  });
  const update = (fn) => setState((current) => {
    const results = fn([...current.state, ...current.queue]);
    return {
      state: results.slice(0, limit),
      queue: results.slice(limit)
    };
  });
  const cleanQueue = () => setState((current) => ({ state: current.state, queue: [] }));
  return {
    state,
    queue,
    add,
    update,
    cleanQueue
  };
}
function getScrollWidth() {
  if (typeof window === "undefined" || typeof document === "undefined")
    return 0;
  const paddingRight = parseInt(window.getComputedStyle(document.body).paddingRight, 10);
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  return paddingRight + scrollbarWidth;
}
const getLockStyles = ({ disableBodyPadding }) => {
  const scrollWidth = disableBodyPadding ? null : getScrollWidth();
  const styles = `body {
        --removed-scroll-width: ${scrollWidth}px;
        touch-action: none;
        overflow: hidden !important;
        position: relative !important;
        ${scrollWidth ? "padding-right: var(--removed-scroll-width) !important;" : ""}
        `;
  return styles;
};
function injectStyles(tag, css2) {
  if (tag.styleSheet) {
    tag.styleSheet.cssText = css2;
  } else {
    tag.appendChild(document.createTextNode(css2));
  }
}
function insertStyleTag(tag) {
  const head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(tag);
}
function makeStyleTag() {
  const tag = document.createElement("style");
  tag.type = "text/css";
  tag.setAttribute("mantine-scroll-lock", "");
  return tag;
}
function useScrollLock(lock, options = {
  disableBodyPadding: false
}) {
  const [scrollLocked, setScrollLocked] = react.exports.useState(lock || false);
  const scrollTop = react.exports.useRef(0);
  const { disableBodyPadding } = options;
  const stylesheet = react.exports.useRef(null);
  const lockScroll = () => {
    scrollTop.current = window.scrollY;
    const styles = getLockStyles({ disableBodyPadding });
    const sheet = makeStyleTag();
    injectStyles(sheet, styles);
    insertStyleTag(sheet);
    stylesheet.current = sheet;
  };
  const unlockScroll = () => {
    if (!(stylesheet == null ? void 0 : stylesheet.current))
      return;
    stylesheet.current.parentNode.removeChild(stylesheet.current);
    stylesheet.current = null;
  };
  react.exports.useEffect(() => {
    if (scrollLocked) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return unlockScroll;
  }, [scrollLocked]);
  react.exports.useEffect(() => {
    if (lock !== void 0) {
      setScrollLocked(lock);
    }
  }, [lock]);
  react.exports.useEffect(() => {
    if (lock === void 0 && typeof window !== "undefined") {
      window.document.body.style.overflow === "hidden" && setScrollLocked(true);
    }
  }, [setScrollLocked]);
  return [scrollLocked, setScrollLocked];
}
function randomId() {
  return `mantine-${Math.random().toString(36).slice(2, 11)}`;
}
var __defProp$P = Object.defineProperty;
var __defProps$n = Object.defineProperties;
var __getOwnPropDescs$n = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$Q = Object.getOwnPropertySymbols;
var __hasOwnProp$Q = Object.prototype.hasOwnProperty;
var __propIsEnum$Q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$P = (obj, key, value) => key in obj ? __defProp$P(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$P = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$Q.call(b, prop))
      __defNormalProp$P(a, prop, b[prop]);
  if (__getOwnPropSymbols$Q)
    for (var prop of __getOwnPropSymbols$Q(b)) {
      if (__propIsEnum$Q.call(b, prop))
        __defNormalProp$P(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$n = (a, b) => __defProps$n(a, __getOwnPropDescs$n(b));
var __objRest$x = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$Q.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$Q)
    for (var prop of __getOwnPropSymbols$Q(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$Q.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function getAutoHeightDuration(height) {
  if (!height || typeof height === "string") {
    return 0;
  }
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
function getElementHeight(el) {
  return (el == null ? void 0 : el.current) ? el.current.scrollHeight : "auto";
}
const raf = typeof window !== "undefined" && window.requestAnimationFrame;
function useCollapse({
  transitionDuration,
  transitionTimingFunction = "ease",
  onTransitionEnd = () => {
  },
  opened
}) {
  const el = react.exports.useRef(null);
  const collapsedHeight = "0px";
  const collapsedStyles = {
    display: "none",
    height: "0px",
    overflow: "hidden"
  };
  const [styles, setStylesRaw] = react.exports.useState(opened ? {} : collapsedStyles);
  const setStyles = (newStyles) => {
    reactDom.exports.flushSync(() => setStylesRaw(newStyles));
  };
  const mergeStyles = (newStyles) => {
    setStyles((oldStyles) => __spreadValues$P(__spreadValues$P({}, oldStyles), newStyles));
  };
  function getTransitionStyles2(height) {
    const _duration = transitionDuration || getAutoHeightDuration(height);
    return {
      transition: `height ${_duration}ms ${transitionTimingFunction}`
    };
  }
  useDidUpdate(() => {
    if (opened) {
      raf(() => {
        mergeStyles({ willChange: "height", display: "block", overflow: "hidden" });
        raf(() => {
          const height = getElementHeight(el);
          mergeStyles(__spreadProps$n(__spreadValues$P({}, getTransitionStyles2(height)), { height }));
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        mergeStyles(__spreadProps$n(__spreadValues$P({}, getTransitionStyles2(height)), { willChange: "height", height }));
        raf(() => mergeStyles({ height: collapsedHeight, overflow: "hidden" }));
      });
    }
  }, [opened]);
  const handleTransitionEnd = (e) => {
    if (e.target !== el.current || e.propertyName !== "height") {
      return;
    }
    if (opened) {
      const height = getElementHeight(el);
      if (height === styles.height) {
        setStyles({});
      } else {
        mergeStyles({ height });
      }
      onTransitionEnd();
    } else if (styles.height === collapsedHeight) {
      setStyles(collapsedStyles);
      onTransitionEnd();
    }
  };
  function getCollapseProps(_a = {}) {
    var _b = _a, { style = {}, refKey = "ref" } = _b, rest = __objRest$x(_b, ["style", "refKey"]);
    const theirRef = rest[refKey];
    return __spreadProps$n(__spreadValues$P({
      "aria-hidden": !opened
    }, rest), {
      [refKey]: mergeRefs(el, theirRef),
      onTransitionEnd: handleTransitionEnd,
      style: __spreadValues$P(__spreadValues$P({ boxSizing: "border-box" }, style), styles)
    });
  }
  return getCollapseProps;
}
var __defProp$O = Object.defineProperty;
var __getOwnPropSymbols$P = Object.getOwnPropertySymbols;
var __hasOwnProp$P = Object.prototype.hasOwnProperty;
var __propIsEnum$P = Object.prototype.propertyIsEnumerable;
var __defNormalProp$O = (obj, key, value) => key in obj ? __defProp$O(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$O = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$P.call(b, prop))
      __defNormalProp$O(a, prop, b[prop]);
  if (__getOwnPropSymbols$P)
    for (var prop of __getOwnPropSymbols$P(b)) {
      if (__propIsEnum$P.call(b, prop))
        __defNormalProp$O(a, prop, b[prop]);
    }
  return a;
};
var __objRest$w = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$P.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$P)
    for (var prop of __getOwnPropSymbols$P(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$P.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$h = {
  transitionDuration: 200,
  transitionTimingFunction: "ease",
  animateOpacity: true
};
const Collapse = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Collapse", defaultProps$h, props), {
    children,
    in: opened,
    transitionDuration,
    transitionTimingFunction,
    style,
    onTransitionEnd,
    animateOpacity
  } = _a, others = __objRest$w(_a, ["children", "in", "transitionDuration", "transitionTimingFunction", "style", "onTransitionEnd", "animateOpacity"]);
  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const duration = reduceMotion ? 0 : transitionDuration;
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const getCollapseProps = useCollapse({
    opened,
    transitionDuration: duration,
    transitionTimingFunction,
    onTransitionEnd
  });
  if (duration === 0) {
    return opened ? /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$O({}, rest),
      children
    }) : null;
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$O({}, getCollapseProps(__spreadValues$O(__spreadValues$O({
      style,
      ref
    }, rest), systemStyles))),
    children: /* @__PURE__ */ jsx("div", {
      style: {
        opacity: opened || !animateOpacity ? 1 : 0,
        transition: animateOpacity ? `opacity ${duration}ms ${transitionTimingFunction}` : "none"
      },
      children
    })
  });
});
Collapse.displayName = "@mantine/core/Collapse";
var __defProp$N = Object.defineProperty;
var __getOwnPropSymbols$O = Object.getOwnPropertySymbols;
var __hasOwnProp$O = Object.prototype.hasOwnProperty;
var __propIsEnum$O = Object.prototype.propertyIsEnumerable;
var __defNormalProp$N = (obj, key, value) => key in obj ? __defProp$N(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$N = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$O.call(b, prop))
      __defNormalProp$N(a, prop, b[prop]);
  if (__getOwnPropSymbols$O)
    for (var prop of __getOwnPropSymbols$O(b)) {
      if (__propIsEnum$O.call(b, prop))
        __defNormalProp$N(a, prop, b[prop]);
    }
  return a;
};
function ChevronIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$N({
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      width: 16,
      height: 16
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
var __defProp$M = Object.defineProperty;
var __getOwnPropSymbols$N = Object.getOwnPropertySymbols;
var __hasOwnProp$N = Object.prototype.hasOwnProperty;
var __propIsEnum$N = Object.prototype.propertyIsEnumerable;
var __defNormalProp$M = (obj, key, value) => key in obj ? __defProp$M(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$M = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$N.call(b, prop))
      __defNormalProp$M(a, prop, b[prop]);
  if (__getOwnPropSymbols$N)
    for (var prop of __getOwnPropSymbols$N(b)) {
      if (__propIsEnum$N.call(b, prop))
        __defNormalProp$M(a, prop, b[prop]);
    }
  return a;
};
function CloseIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$M({
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
CloseIcon.displayName = "@mantine/core/CloseIcon";
var __defProp$L = Object.defineProperty;
var __getOwnPropSymbols$M = Object.getOwnPropertySymbols;
var __hasOwnProp$M = Object.prototype.hasOwnProperty;
var __propIsEnum$M = Object.prototype.propertyIsEnumerable;
var __defNormalProp$L = (obj, key, value) => key in obj ? __defProp$L(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$L = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$M.call(b, prop))
      __defNormalProp$L(a, prop, b[prop]);
  if (__getOwnPropSymbols$M)
    for (var prop of __getOwnPropSymbols$M(b)) {
      if (__propIsEnum$M.call(b, prop))
        __defNormalProp$L(a, prop, b[prop]);
    }
  return a;
};
var __objRest$v = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$M.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$M)
    for (var prop of __getOwnPropSymbols$M(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$M.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24
};
const defaultProps$g = {
  size: "md"
};
const CloseButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("CloseButton", defaultProps$g, props), {
    iconSize,
    size: size2 = "md"
  } = _a, others = __objRest$v(_a, ["iconSize", "size"]);
  const theme = useMantineTheme();
  const _iconSize = iconSize || theme.fn.size({
    size: size2,
    sizes: iconSizes
  });
  return /* @__PURE__ */ jsx(ActionIcon, {
    ...__spreadValues$L({
      size: size2,
      ref
    }, others),
    children: /* @__PURE__ */ jsx(CloseIcon, {
      width: _iconSize,
      height: _iconSize
    })
  });
});
CloseButton.displayName = "@mantine/core/CloseButton";
const AppShellContext = react.exports.createContext({});
const AppShellProvider = AppShellContext.Provider;
function useAppShellContext() {
  return react.exports.useContext(AppShellContext);
}
function getSortedBreakpoints(breakpoints, theme) {
  if (!breakpoints) {
    return [];
  }
  const values2 = Object.keys(breakpoints).filter((breakpoint) => breakpoint !== "base").map((breakpoint) => [
    theme.fn.size({ size: breakpoint, sizes: theme.breakpoints }),
    breakpoints[breakpoint]
  ]);
  values2.sort((a, b) => a[0] - b[0]);
  return values2;
}
var __defProp$K = Object.defineProperty;
var __defProps$m = Object.defineProperties;
var __getOwnPropDescs$m = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$L = Object.getOwnPropertySymbols;
var __hasOwnProp$L = Object.prototype.hasOwnProperty;
var __propIsEnum$L = Object.prototype.propertyIsEnumerable;
var __defNormalProp$K = (obj, key, value) => key in obj ? __defProp$K(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$K = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$L.call(b, prop))
      __defNormalProp$K(a, prop, b[prop]);
  if (__getOwnPropSymbols$L)
    for (var prop of __getOwnPropSymbols$L(b)) {
      if (__propIsEnum$L.call(b, prop))
        __defNormalProp$K(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$m = (a, b) => __defProps$m(a, __getOwnPropDescs$m(b));
var useStyles$I = createStyles((theme, {
  height,
  width,
  fixed,
  position,
  hiddenBreakpoint,
  zIndex,
  section,
  withBorder
}) => {
  const breakpoints = typeof width === "object" && width !== null ? getSortedBreakpoints(width, theme).reduce((acc, [breakpoint, breakpointSize]) => {
    acc[`@media (min-width: ${breakpoint + 1}px)`] = {
      width: breakpointSize,
      minWidth: breakpointSize
    };
    return acc;
  }, {}) : null;
  const borderStyles = withBorder ? {
    [section === "navbar" ? "borderRight" : "borderLeft"]: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`
  } : {};
  return {
    root: __spreadProps$m(__spreadValues$K(__spreadValues$K(__spreadProps$m(__spreadValues$K(__spreadValues$K({}, theme.fn.fontStyles()), position), {
      top: (position == null ? void 0 : position.top) || "var(--mantine-header-height)",
      bottom: 0,
      zIndex,
      height: height || "calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))",
      width: (width == null ? void 0 : width.base) || "100%",
      position: fixed ? "fixed" : "static",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }), borderStyles), breakpoints), {
      "&[data-hidden]": {
        [`@media (max-width: ${theme.fn.size({
          size: hiddenBreakpoint,
          sizes: theme.breakpoints
        })}px)`]: {
          display: "none"
        }
      }
    })
  };
});
const useStyles$J = useStyles$I;
var __defProp$J = Object.defineProperty;
var __getOwnPropSymbols$K = Object.getOwnPropertySymbols;
var __hasOwnProp$K = Object.prototype.hasOwnProperty;
var __propIsEnum$K = Object.prototype.propertyIsEnumerable;
var __defNormalProp$J = (obj, key, value) => key in obj ? __defProp$J(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$J = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$K.call(b, prop))
      __defNormalProp$J(a, prop, b[prop]);
  if (__getOwnPropSymbols$K)
    for (var prop of __getOwnPropSymbols$K(b)) {
      if (__propIsEnum$K.call(b, prop))
        __defNormalProp$J(a, prop, b[prop]);
    }
  return a;
};
var __objRest$u = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$K.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$K)
    for (var prop of __getOwnPropSymbols$K(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$K.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const HorizontalSection = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    width,
    height,
    fixed = false,
    position,
    zIndex = getDefaultZIndex("app"),
    hiddenBreakpoint = "md",
    hidden: hidden2 = false,
    withBorder = true,
    className,
    classNames,
    styles,
    children,
    section,
    __staticSelector,
    unstyled
  } = _b, others = __objRest$u(_b, ["width", "height", "fixed", "position", "zIndex", "hiddenBreakpoint", "hidden", "withBorder", "className", "classNames", "styles", "children", "section", "__staticSelector", "unstyled"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx,
    theme
  } = useStyles$J({
    width,
    height,
    fixed: ctx.fixed || fixed,
    position,
    hiddenBreakpoint,
    zIndex: ctx.zIndex || zIndex,
    section,
    withBorder
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  const breakpoints = getSortedBreakpoints(width, theme).reduce((acc, [breakpoint, breakpointSize]) => {
    acc[`@media (min-width: ${breakpoint + 1}px)`] = {
      [`--mantine-${section}-width`]: `${breakpointSize}px`
    };
    return acc;
  }, {});
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$J({
      component: section === "navbar" ? "nav" : "aside",
      ref,
      "data-hidden": hidden2 || void 0,
      className: cx(classes.root, className)
    }, others),
    children: [children, /* @__PURE__ */ jsx(Global, {
      styles: () => ({
        ":root": __spreadValues$J({
          [`--mantine-${section}-width`]: (width == null ? void 0 : width.base) ? `${width.base}px` : "0px"
        }, breakpoints)
      })
    })]
  });
});
HorizontalSection.displayName = "@mantine/core/HorizontalSection";
var __defProp$I = Object.defineProperty;
var __getOwnPropSymbols$J = Object.getOwnPropertySymbols;
var __hasOwnProp$J = Object.prototype.hasOwnProperty;
var __propIsEnum$J = Object.prototype.propertyIsEnumerable;
var __defNormalProp$I = (obj, key, value) => key in obj ? __defProp$I(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$I = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$J.call(b, prop))
      __defNormalProp$I(a, prop, b[prop]);
  if (__getOwnPropSymbols$J)
    for (var prop of __getOwnPropSymbols$J(b)) {
      if (__propIsEnum$J.call(b, prop))
        __defNormalProp$I(a, prop, b[prop]);
    }
  return a;
};
var __objRest$t = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$J.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$J)
    for (var prop of __getOwnPropSymbols$J(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$J.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const _Section = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    grow = false,
    sx
  } = _b, others = __objRest$t(_b, ["children", "grow", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$I({
      ref,
      sx: [{
        flex: grow ? 1 : 0,
        boxSizing: "border-box"
      }, ...packSx(sx)]
    }, others),
    children
  });
});
_Section.displayName = "@mantine/core/Section";
const Section = createPolymorphicComponent(_Section);
var __defProp$H = Object.defineProperty;
var __getOwnPropSymbols$I = Object.getOwnPropertySymbols;
var __hasOwnProp$I = Object.prototype.hasOwnProperty;
var __propIsEnum$I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$H = (obj, key, value) => key in obj ? __defProp$H(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$H = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$I.call(b, prop))
      __defNormalProp$H(a, prop, b[prop]);
  if (__getOwnPropSymbols$I)
    for (var prop of __getOwnPropSymbols$I(b)) {
      if (__propIsEnum$I.call(b, prop))
        __defNormalProp$H(a, prop, b[prop]);
    }
  return a;
};
const defaultProps$f = {
  fixed: false,
  position: {
    top: 0,
    left: 0
  },
  zIndex: getDefaultZIndex("app"),
  hiddenBreakpoint: "md",
  hidden: false
};
const Navbar = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Navbar", defaultProps$f, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$H({
      section: "navbar",
      __staticSelector: "Navbar",
      ref
    }, _props)
  });
});
Navbar.Section = Section;
Navbar.displayName = "@mantine/core/Navbar";
var __defProp$G = Object.defineProperty;
var __defProps$l = Object.defineProperties;
var __getOwnPropDescs$l = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$H = Object.getOwnPropertySymbols;
var __hasOwnProp$H = Object.prototype.hasOwnProperty;
var __propIsEnum$H = Object.prototype.propertyIsEnumerable;
var __defNormalProp$G = (obj, key, value) => key in obj ? __defProp$G(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$G = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$H.call(b, prop))
      __defNormalProp$G(a, prop, b[prop]);
  if (__getOwnPropSymbols$H)
    for (var prop of __getOwnPropSymbols$H(b)) {
      if (__propIsEnum$H.call(b, prop))
        __defNormalProp$G(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$l = (a, b) => __defProps$l(a, __getOwnPropDescs$l(b));
var useStyles$G = createStyles((theme, { height, fixed, position, zIndex, borderPosition }) => ({
  root: __spreadProps$l(__spreadValues$G(__spreadValues$G({}, theme.fn.fontStyles()), position), {
    zIndex,
    height,
    maxHeight: height,
    position: fixed ? "fixed" : "static",
    boxSizing: "border-box",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderBottom: borderPosition === "bottom" ? `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}` : void 0,
    borderTop: borderPosition === "top" ? `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}` : void 0
  })
}));
const useStyles$H = useStyles$G;
var __defProp$F = Object.defineProperty;
var __getOwnPropSymbols$G = Object.getOwnPropertySymbols;
var __hasOwnProp$G = Object.prototype.hasOwnProperty;
var __propIsEnum$G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$F = (obj, key, value) => key in obj ? __defProp$F(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$F = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$G.call(b, prop))
      __defNormalProp$F(a, prop, b[prop]);
  if (__getOwnPropSymbols$G)
    for (var prop of __getOwnPropSymbols$G(b)) {
      if (__propIsEnum$G.call(b, prop))
        __defNormalProp$F(a, prop, b[prop]);
    }
  return a;
};
var __objRest$s = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$G.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$G)
    for (var prop of __getOwnPropSymbols$G(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$G.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const VerticalSection = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    classNames,
    styles,
    height,
    fixed = false,
    withBorder = true,
    position,
    zIndex = getDefaultZIndex("app"),
    section,
    unstyled,
    __staticSelector
  } = _b, others = __objRest$s(_b, ["children", "className", "classNames", "styles", "height", "fixed", "withBorder", "position", "zIndex", "section", "unstyled", "__staticSelector"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx
  } = useStyles$H({
    height,
    fixed: ctx.fixed || fixed,
    position,
    zIndex: ctx.zIndex || zIndex,
    borderPosition: withBorder ? section === "header" ? "bottom" : "top" : "none"
  }, {
    name: __staticSelector,
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$F({
      component: section === "header" ? "header" : "footer",
      className: cx(classes.root, className),
      ref
    }, others),
    children: [children, /* @__PURE__ */ jsx(Global, {
      styles: () => ({
        ":root": {
          [`--mantine-${section}-height`]: `${height}px`
        }
      })
    })]
  });
});
VerticalSection.displayName = "@mantine/core/VerticalSection";
var __defProp$E = Object.defineProperty;
var __defProps$k = Object.defineProperties;
var __getOwnPropDescs$k = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$F = Object.getOwnPropertySymbols;
var __hasOwnProp$F = Object.prototype.hasOwnProperty;
var __propIsEnum$F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$E = (obj, key, value) => key in obj ? __defProp$E(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$E = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$F.call(b, prop))
      __defNormalProp$E(a, prop, b[prop]);
  if (__getOwnPropSymbols$F)
    for (var prop of __getOwnPropSymbols$F(b)) {
      if (__propIsEnum$F.call(b, prop))
        __defNormalProp$E(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$k = (a, b) => __defProps$k(a, __getOwnPropDescs$k(b));
const defaultProps$e = {
  fixed: false,
  position: {
    top: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Header = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Header", defaultProps$e, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$k(__spreadValues$E({
      section: "header",
      __staticSelector: "Header"
    }, _props), {
      ref
    })
  });
});
Header.displayName = "@mantine/core/Header";
var __defProp$D = Object.defineProperty;
var __getOwnPropSymbols$E = Object.getOwnPropertySymbols;
var __hasOwnProp$E = Object.prototype.hasOwnProperty;
var __propIsEnum$E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$D = (obj, key, value) => key in obj ? __defProp$D(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$D = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$E.call(b, prop))
      __defNormalProp$D(a, prop, b[prop]);
  if (__getOwnPropSymbols$E)
    for (var prop of __getOwnPropSymbols$E(b)) {
      if (__propIsEnum$E.call(b, prop))
        __defNormalProp$D(a, prop, b[prop]);
    }
  return a;
};
function getPositionStyles$1(props, theme) {
  const padding = theme.fn.size({ size: props.padding, sizes: theme.spacing });
  const navbarOffset = props.navbarOffsetBreakpoint ? theme.fn.size({ size: props.navbarOffsetBreakpoint, sizes: theme.breakpoints }) : null;
  const asideOffset = props.asideOffsetBreakpoint ? theme.fn.size({ size: props.asideOffsetBreakpoint, sizes: theme.breakpoints }) : null;
  if (!props.fixed) {
    return { padding };
  }
  return {
    minHeight: "100vh",
    paddingTop: `calc(var(--mantine-header-height, 0px) + ${padding}px)`,
    paddingBottom: `calc(var(--mantine-footer-height, 0px) + ${padding}px)`,
    paddingLeft: `calc(var(--mantine-navbar-width, 0px) + ${padding}px)`,
    paddingRight: `calc(var(--mantine-aside-width, 0px) + ${padding}px)`,
    [`@media (max-width: ${navbarOffset}px)`]: {
      paddingLeft: padding
    },
    [`@media (max-width: ${asideOffset}px)`]: {
      paddingRight: padding
    }
  };
}
var useStyles$E = createStyles((theme, props) => ({
  root: {
    boxSizing: "border-box"
  },
  body: {
    display: "flex",
    boxSizing: "border-box"
  },
  main: __spreadValues$D({
    flex: 1,
    width: "100vw",
    boxSizing: "border-box"
  }, getPositionStyles$1(props, theme))
}));
const useStyles$F = useStyles$E;
var __defProp$C = Object.defineProperty;
var __getOwnPropSymbols$D = Object.getOwnPropertySymbols;
var __hasOwnProp$D = Object.prototype.hasOwnProperty;
var __propIsEnum$D = Object.prototype.propertyIsEnumerable;
var __defNormalProp$C = (obj, key, value) => key in obj ? __defProp$C(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$C = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$D.call(b, prop))
      __defNormalProp$C(a, prop, b[prop]);
  if (__getOwnPropSymbols$D)
    for (var prop of __getOwnPropSymbols$D(b)) {
      if (__propIsEnum$D.call(b, prop))
        __defNormalProp$C(a, prop, b[prop]);
    }
  return a;
};
var __objRest$r = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$D.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$D)
    for (var prop of __getOwnPropSymbols$D(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$D.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$d = {
  fixed: true,
  zIndex: getDefaultZIndex("app"),
  padding: "md"
};
const AppShell = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AppShell", defaultProps$d, props), {
    children,
    navbar,
    header,
    footer,
    aside,
    fixed,
    zIndex,
    padding,
    navbarOffsetBreakpoint,
    asideOffsetBreakpoint,
    className,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$r(_a, ["children", "navbar", "header", "footer", "aside", "fixed", "zIndex", "padding", "navbarOffsetBreakpoint", "asideOffsetBreakpoint", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$F({
    padding,
    fixed,
    navbarOffsetBreakpoint,
    asideOffsetBreakpoint
  }, {
    styles,
    classNames,
    unstyled,
    name: "AppShell"
  });
  return /* @__PURE__ */ jsx(AppShellProvider, {
    value: {
      fixed,
      zIndex
    },
    children: /* @__PURE__ */ jsxs(Box, {
      ...__spreadValues$C({
        className: cx(classes.root, className),
        ref
      }, others),
      children: [header, /* @__PURE__ */ jsxs("div", {
        className: classes.body,
        children: [navbar, /* @__PURE__ */ jsx("main", {
          className: classes.main,
          children
        }), aside]
      }), footer]
    })
  });
});
AppShell.displayName = "@mantine/core/AppShell";
function $6ed0406888f73fc4$var$setRef(ref, value) {
  if (typeof ref === "function")
    ref(value);
  else if (ref !== null && ref !== void 0)
    ref.current = value;
}
function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef(ref, node)
  );
}
function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
  return react.exports.useCallback($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
}
const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = react.exports.Children.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (react.exports.Children.count(newElement) > 1)
          return react.exports.Children.only(null);
        return /* @__PURE__ */ react.exports.isValidElement(newElement) ? newElement.props.children : null;
      } else
        return child;
    });
    return /* @__PURE__ */ react.exports.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), /* @__PURE__ */ react.exports.isValidElement(newElement) ? /* @__PURE__ */ react.exports.cloneElement(newElement, void 0, newChildren) : null);
  }
  return /* @__PURE__ */ react.exports.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
const $5e63c961fc1ce211$var$SlotClone = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (/* @__PURE__ */ react.exports.isValidElement(children))
    return /* @__PURE__ */ react.exports.cloneElement(children, {
      ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
      ref: $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref)
    });
  return react.exports.Children.count(children) > 1 ? react.exports.Children.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
  return /* @__PURE__ */ react.exports.createElement(react.exports.Fragment, null, children);
};
function $5e63c961fc1ce211$var$isSlottable(child) {
  return /* @__PURE__ */ react.exports.isValidElement(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
}
function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler)
      overrideProps[propName] = (...args) => {
        childPropValue === null || childPropValue === void 0 || childPropValue(...args);
        slotPropValue === null || slotPropValue === void 0 || slotPropValue(...args);
      };
    else if (propName === "style")
      overrideProps[propName] = {
        ...slotPropValue,
        ...childPropValue
      };
    else if (propName === "className")
      overrideProps[propName] = [
        slotPropValue,
        childPropValue
      ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}
const $8927f6f2acc4f386$var$NODES = [
  "a",
  "button",
  "div",
  "h2",
  "h3",
  "img",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
const $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$NODES.reduce((primitive, node) => {
  const Node = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node;
    react.exports.useEffect(() => {
      window[Symbol.for("radix-ui")] = true;
    }, []);
    return /* @__PURE__ */ react.exports.createElement(Comp, _extends({}, primitiveProps, {
      ref: forwardedRef
    }));
  });
  Node.displayName = `Primitive.${node}`;
  return {
    ...primitive,
    [node]: Node
  };
}, {});
const $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? react.exports.useLayoutEffect : () => {
};
function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
  return react.exports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState !== null && nextState !== void 0 ? nextState : state;
  }, initialState);
}
const $921a889cee6df7e8$export$99c2b779aa4e8b8b = (props) => {
  const { present, children } = props;
  const presence = $921a889cee6df7e8$var$usePresence(present);
  const child = typeof children === "function" ? children({
    present: presence.isPresent
  }) : react.exports.Children.only(children);
  const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? /* @__PURE__ */ react.exports.cloneElement(child, {
    ref
  }) : null;
};
$921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = "Presence";
function $921a889cee6df7e8$var$usePresence(present) {
  const [node1, setNode] = react.exports.useState();
  const stylesRef = react.exports.useRef({});
  const prevPresentRef = react.exports.useRef(present);
  const prevAnimationNameRef = react.exports.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  react.exports.useEffect(() => {
    const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [
    state
  ]);
  $9f79659886946c16$export$e5c5a5f917a5871c(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(styles);
      if (present)
        send("MOUNT");
      else if (currentAnimationName === "none" || (styles === null || styles === void 0 ? void 0 : styles.display) === "none")
        send("UNMOUNT");
      else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating)
          send("ANIMATION_OUT");
        else
          send("UNMOUNT");
      }
      prevPresentRef.current = present;
    }
  }, [
    present,
    send
  ]);
  $9f79659886946c16$export$e5c5a5f917a5871c(() => {
    if (node1) {
      const handleAnimationEnd = (event) => {
        const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(event.animationName);
        if (event.target === node1 && isCurrentAnimation)
          reactDom.exports.flushSync(
            () => send("ANIMATION_END")
          );
      };
      const handleAnimationStart = (event) => {
        if (event.target === node1)
          prevAnimationNameRef.current = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
      };
      node1.addEventListener("animationstart", handleAnimationStart);
      node1.addEventListener("animationcancel", handleAnimationEnd);
      node1.addEventListener("animationend", handleAnimationEnd);
      return () => {
        node1.removeEventListener("animationstart", handleAnimationStart);
        node1.removeEventListener("animationcancel", handleAnimationEnd);
        node1.removeEventListener("animationend", handleAnimationEnd);
      };
    } else
      send("ANIMATION_END");
  }, [
    node1,
    send
  ]);
  return {
    isPresent: [
      "mounted",
      "unmountSuspended"
    ].includes(state),
    ref: react.exports.useCallback((node) => {
      if (node)
        stylesRef.current = getComputedStyle(node);
      setNode(node);
    }, [])
  };
}
function $921a889cee6df7e8$var$getAnimationName(styles) {
  return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
}
function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
    const BaseContext = /* @__PURE__ */ react.exports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [
      ...defaultContexts,
      defaultContext
    ];
    function Provider(props) {
      const { scope, children, ...context } = props;
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
      const value = react.exports.useMemo(
        () => context,
        Object.values(context)
      );
      return /* @__PURE__ */ react.exports.createElement(Context.Provider, {
        value
      }, children);
    }
    function useContext(consumerName, scope) {
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
      const context = react.exports.useContext(Context);
      if (context)
        return context;
      if (defaultContext !== void 0)
        return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    Provider.displayName = rootComponentName + "Provider";
    return [
      Provider,
      useContext
    ];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return /* @__PURE__ */ react.exports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
      return react.exports.useMemo(
        () => ({
          [`__scope${scopeName}`]: {
            ...scope,
            [scopeName]: contexts
          }
        }),
        [
          scope,
          contexts
        ]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [
    $c512c27ab02ef895$export$fd42f52fd3ae1109,
    $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)
  ];
}
function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1)
    return baseScope;
  const createScope1 = () => {
    const scopeHooks = scopes.map(
      (createScope) => ({
        useScope: createScope(),
        scopeName: createScope.scopeName
      })
    );
    return function useComposedScopes(overrideScopes) {
      const nextScopes1 = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return {
          ...nextScopes,
          ...currentScope
        };
      }, {});
      return react.exports.useMemo(
        () => ({
          [`__scope${baseScope.scopeName}`]: nextScopes1
        }),
        [
          nextScopes1
        ]
      );
    };
  };
  createScope1.scopeName = baseScope.scopeName;
  return createScope1;
}
function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
  const callbackRef = react.exports.useRef(callback);
  react.exports.useEffect(() => {
    callbackRef.current = callback;
  });
  return react.exports.useMemo(
    () => (...args) => {
      var _callbackRef$current;
      return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
    },
    []
  );
}
const $f631663db3294ace$var$DirectionContext = /* @__PURE__ */ react.exports.createContext(void 0);
function $f631663db3294ace$export$b39126d51d94e6f3(localDir) {
  const globalDir = react.exports.useContext($f631663db3294ace$var$DirectionContext);
  return localDir || globalDir || "ltr";
}
function $ae6933e535247d3d$export$7d15b64cf5a3a4c4(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented)
      return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
  };
}
function $6c2e24571c90391f$export$3e6543de14f8614f(initialState, machine) {
  return react.exports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState !== null && nextState !== void 0 ? nextState : state;
  }, initialState);
}
const $57acba87d6e25586$var$SCROLL_AREA_NAME = "ScrollArea";
const [$57acba87d6e25586$var$createScrollAreaContext, $57acba87d6e25586$export$488468afe3a6f2b1] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($57acba87d6e25586$var$SCROLL_AREA_NAME);
const [$57acba87d6e25586$var$ScrollAreaProvider, $57acba87d6e25586$var$useScrollAreaContext] = $57acba87d6e25586$var$createScrollAreaContext($57acba87d6e25586$var$SCROLL_AREA_NAME);
const $57acba87d6e25586$export$ccf8d8d7bbf3c2cc = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, type = "hover", dir, scrollHideDelay = 600, ...scrollAreaProps } = props;
  const [scrollArea, setScrollArea] = react.exports.useState(null);
  const [viewport, setViewport] = react.exports.useState(null);
  const [content, setContent] = react.exports.useState(null);
  const [scrollbarX, setScrollbarX] = react.exports.useState(null);
  const [scrollbarY, setScrollbarY] = react.exports.useState(null);
  const [cornerWidth, setCornerWidth] = react.exports.useState(0);
  const [cornerHeight, setCornerHeight] = react.exports.useState(0);
  const [scrollbarXEnabled, setScrollbarXEnabled] = react.exports.useState(false);
  const [scrollbarYEnabled, setScrollbarYEnabled] = react.exports.useState(false);
  const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
    forwardedRef,
    (node) => setScrollArea(node)
  );
  const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
  return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaProvider, {
    scope: __scopeScrollArea,
    type,
    dir: direction,
    scrollHideDelay,
    scrollArea,
    viewport,
    onViewportChange: setViewport,
    content,
    onContentChange: setContent,
    scrollbarX,
    onScrollbarXChange: setScrollbarX,
    scrollbarXEnabled,
    onScrollbarXEnabledChange: setScrollbarXEnabled,
    scrollbarY,
    onScrollbarYChange: setScrollbarY,
    scrollbarYEnabled,
    onScrollbarYEnabledChange: setScrollbarYEnabled,
    onCornerWidthChange: setCornerWidth,
    onCornerHeightChange: setCornerHeight
  }, /* @__PURE__ */ react.exports.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
    dir: direction
  }, scrollAreaProps, {
    ref: composedRefs,
    style: {
      position: "relative",
      ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
      ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
      ...props.style
    }
  })));
});
const $57acba87d6e25586$var$VIEWPORT_NAME = "ScrollAreaViewport";
const $57acba87d6e25586$export$a21cbf9f11fca853 = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, children, ...viewportProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$VIEWPORT_NAME, __scopeScrollArea);
  const ref = react.exports.useRef(null);
  const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onViewportChange);
  return /* @__PURE__ */ react.exports.createElement(react.exports.Fragment, null, /* @__PURE__ */ react.exports.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
    }
  }), /* @__PURE__ */ react.exports.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
    "data-radix-scroll-area-viewport": ""
  }, viewportProps, {
    ref: composedRefs,
    style: {
      overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
      overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
      ...props.style
    }
  }), /* @__PURE__ */ react.exports.createElement("div", {
    ref: context.onContentChange,
    style: {
      minWidth: "100%",
      display: "table"
    }
  }, children)));
});
const $57acba87d6e25586$var$SCROLLBAR_NAME = "ScrollAreaScrollbar";
const $57acba87d6e25586$export$2fabd85d0eba3c57 = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
  const isHorizontal = props.orientation === "horizontal";
  react.exports.useEffect(() => {
    isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
    return () => {
      isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
    };
  }, [
    isHorizontal,
    onScrollbarXEnabledChange,
    onScrollbarYEnabledChange
  ]);
  return context.type === "hover" ? /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarHover, _extends({}, scrollbarProps, {
    ref: forwardedRef,
    forceMount
  })) : context.type === "scroll" ? /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarScroll, _extends({}, scrollbarProps, {
    ref: forwardedRef,
    forceMount
  })) : context.type === "auto" ? /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarAuto, _extends({}, scrollbarProps, {
    ref: forwardedRef,
    forceMount
  })) : context.type === "always" ? /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({}, scrollbarProps, {
    ref: forwardedRef
  })) : null;
});
const $57acba87d6e25586$var$ScrollAreaScrollbarHover = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible2, setVisible] = react.exports.useState(false);
  react.exports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(
          () => setVisible(false),
          context.scrollHideDelay
        );
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [
    context.scrollArea,
    context.scrollHideDelay
  ]);
  return /* @__PURE__ */ react.exports.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
    present: forceMount || visible2
  }, /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarAuto, _extends({
    "data-state": visible2 ? "visible" : "hidden"
  }, scrollbarProps, {
    ref: forwardedRef
  })));
});
const $57acba87d6e25586$var$ScrollAreaScrollbarScroll = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(
    () => send("SCROLL_END"),
    100
  );
  const [state, send] = $6c2e24571c90391f$export$3e6543de14f8614f("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  react.exports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(
        () => send("HIDE"),
        context.scrollHideDelay
      );
      return () => window.clearTimeout(hideTimer);
    }
  }, [
    state,
    context.scrollHideDelay,
    send
  ]);
  react.exports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [
    context.viewport,
    isHorizontal,
    send,
    debounceScrollEnd
  ]);
  return /* @__PURE__ */ react.exports.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
    present: forceMount || state !== "hidden"
  }, /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({
    "data-state": state === "hidden" ? "hidden" : "visible"
  }, scrollbarProps, {
    ref: forwardedRef,
    onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
      props.onPointerEnter,
      () => send("POINTER_ENTER")
    ),
    onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
      props.onPointerLeave,
      () => send("POINTER_LEAVE")
    )
  })));
});
const $57acba87d6e25586$var$ScrollAreaScrollbarAuto = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible2, setVisible] = react.exports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = $57acba87d6e25586$var$useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  $57acba87d6e25586$var$useResizeObserver(context.viewport, handleResize);
  $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ react.exports.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
    present: forceMount || visible2
  }, /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({
    "data-state": visible2 ? "visible" : "hidden"
  }, scrollbarProps, {
    ref: forwardedRef
  })));
});
const $57acba87d6e25586$var$ScrollAreaScrollbarVisible = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = react.exports.useRef(null);
  const pointerOffsetRef = react.exports.useRef(0);
  const [sizes2, setSizes] = react.exports.useState({
    content: 0,
    viewport: 0,
    scrollbar: {
      size: 0,
      paddingStart: 0,
      paddingEnd: 0
    }
  });
  const thumbRatio = $57acba87d6e25586$var$getThumbRatio(sizes2.viewport, sizes2.content);
  const commonProps = {
    ...scrollbarProps,
    sizes: sizes2,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return $57acba87d6e25586$var$getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes2, dir);
  }
  if (orientation === "horizontal")
    return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarX, _extends({}, commonProps, {
      ref: forwardedRef,
      onThumbPositionChange: () => {
        if (context.viewport && thumbRef.current) {
          const scrollPos = context.viewport.scrollLeft;
          const offset2 = $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes2, context.dir);
          thumbRef.current.style.transform = `translate3d(${offset2}px, 0, 0)`;
        }
      },
      onWheelScroll: (scrollPos) => {
        if (context.viewport)
          context.viewport.scrollLeft = scrollPos;
      },
      onDragScroll: (pointerPos) => {
        if (context.viewport)
          context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
      }
    }));
  if (orientation === "vertical")
    return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarY, _extends({}, commonProps, {
      ref: forwardedRef,
      onThumbPositionChange: () => {
        if (context.viewport && thumbRef.current) {
          const scrollPos = context.viewport.scrollTop;
          const offset2 = $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes2);
          thumbRef.current.style.transform = `translate3d(0, ${offset2}px, 0)`;
        }
      },
      onWheelScroll: (scrollPos) => {
        if (context.viewport)
          context.viewport.scrollTop = scrollPos;
      },
      onDragScroll: (pointerPos) => {
        if (context.viewport)
          context.viewport.scrollTop = getScrollPosition(pointerPos);
      }
    }));
  return null;
});
const $57acba87d6e25586$var$ScrollAreaScrollbarX = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { sizes: sizes2, onSizesChange, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = react.exports.useState();
  const ref = react.exports.useRef(null);
  const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onScrollbarXChange);
  react.exports.useEffect(() => {
    if (ref.current)
      setComputedStyle(getComputedStyle(ref.current));
  }, [
    ref
  ]);
  return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarImpl, _extends({
    "data-orientation": "horizontal"
  }, scrollbarProps, {
    ref: composeRefs,
    sizes: sizes2,
    style: {
      bottom: 0,
      left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
      right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
      ["--radix-scroll-area-thumb-width"]: $57acba87d6e25586$var$getThumbSize(sizes2) + "px",
      ...props.style
    },
    onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
    onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
    onWheelScroll: (event, maxScrollPos) => {
      if (context.viewport) {
        const scrollPos = context.viewport.scrollLeft + event.deltaX;
        props.onWheelScroll(scrollPos);
        if ($57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos))
          event.preventDefault();
      }
    },
    onResize: () => {
      if (ref.current && context.viewport && computedStyle)
        onSizesChange({
          content: context.viewport.scrollWidth,
          viewport: context.viewport.offsetWidth,
          scrollbar: {
            size: ref.current.clientWidth,
            paddingStart: $57acba87d6e25586$var$toInt(computedStyle.paddingLeft),
            paddingEnd: $57acba87d6e25586$var$toInt(computedStyle.paddingRight)
          }
        });
    }
  }));
});
const $57acba87d6e25586$var$ScrollAreaScrollbarY = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { sizes: sizes2, onSizesChange, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = react.exports.useState();
  const ref = react.exports.useRef(null);
  const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onScrollbarYChange);
  react.exports.useEffect(() => {
    if (ref.current)
      setComputedStyle(getComputedStyle(ref.current));
  }, [
    ref
  ]);
  return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaScrollbarImpl, _extends({
    "data-orientation": "vertical"
  }, scrollbarProps, {
    ref: composeRefs,
    sizes: sizes2,
    style: {
      top: 0,
      right: context.dir === "ltr" ? 0 : void 0,
      left: context.dir === "rtl" ? 0 : void 0,
      bottom: "var(--radix-scroll-area-corner-height)",
      ["--radix-scroll-area-thumb-height"]: $57acba87d6e25586$var$getThumbSize(sizes2) + "px",
      ...props.style
    },
    onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
    onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
    onWheelScroll: (event, maxScrollPos) => {
      if (context.viewport) {
        const scrollPos = context.viewport.scrollTop + event.deltaY;
        props.onWheelScroll(scrollPos);
        if ($57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos))
          event.preventDefault();
      }
    },
    onResize: () => {
      if (ref.current && context.viewport && computedStyle)
        onSizesChange({
          content: context.viewport.scrollHeight,
          viewport: context.viewport.offsetHeight,
          scrollbar: {
            size: ref.current.clientHeight,
            paddingStart: $57acba87d6e25586$var$toInt(computedStyle.paddingTop),
            paddingEnd: $57acba87d6e25586$var$toInt(computedStyle.paddingBottom)
          }
        });
    }
  }));
});
const [$57acba87d6e25586$var$ScrollbarProvider, $57acba87d6e25586$var$useScrollbarContext] = $57acba87d6e25586$var$createScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME);
const $57acba87d6e25586$var$ScrollAreaScrollbarImpl = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, sizes: sizes2, hasThumb, onThumbChange, onThumbPointerUp, onThumbPointerDown, onThumbPositionChange, onDragScroll, onWheelScroll, onResize, ...scrollbarProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = react.exports.useState(null);
  const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
    forwardedRef,
    (node) => setScrollbar(node)
  );
  const rectRef = react.exports.useRef(null);
  const prevWebkitUserSelectRef = react.exports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes2.content - sizes2.viewport;
  const handleWheelScroll = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onWheelScroll);
  const handleThumbPositionChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPositionChange);
  const handleResize = $57acba87d6e25586$var$useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({
        x,
        y
      });
    }
  }
  react.exports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar === null || scrollbar === void 0 ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel)
        handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, {
      passive: false
    });
    return () => document.removeEventListener("wheel", handleWheel, {
      passive: false
    });
  }, [
    viewport,
    scrollbar,
    maxScrollPos,
    handleWheelScroll
  ]);
  react.exports.useEffect(handleThumbPositionChange, [
    sizes2,
    handleThumbPositionChange
  ]);
  $57acba87d6e25586$var$useResizeObserver(scrollbar, handleResize);
  $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollbarProvider, {
    scope: __scopeScrollArea,
    scrollbar,
    hasThumb,
    onThumbChange: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbChange),
    onThumbPointerUp: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPointerUp),
    onThumbPositionChange: handleThumbPositionChange,
    onThumbPointerDown: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPointerDown)
  }, /* @__PURE__ */ react.exports.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, scrollbarProps, {
    ref: composeRefs,
    style: {
      position: "absolute",
      ...scrollbarProps.style
    },
    onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDown, (event) => {
      const mainPointer = 0;
      if (event.button === mainPointer) {
        const element = event.target;
        element.setPointerCapture(event.pointerId);
        rectRef.current = scrollbar.getBoundingClientRect();
        prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
        document.body.style.webkitUserSelect = "none";
        handleDragScroll(event);
      }
    }),
    onPointerMove: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerMove, handleDragScroll),
    onPointerUp: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerUp, (event) => {
      const element = event.target;
      element.releasePointerCapture(event.pointerId);
      document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
      rectRef.current = null;
    })
  })));
});
const $57acba87d6e25586$var$THUMB_NAME = "ScrollAreaThumb";
const $57acba87d6e25586$export$9fba1154677d7cd2 = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...thumbProps } = props;
  const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext($57acba87d6e25586$var$THUMB_NAME, props.__scopeScrollArea);
  return /* @__PURE__ */ react.exports.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
    present: forceMount || scrollbarContext.hasThumb
  }, /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaThumbImpl, _extends({
    ref: forwardedRef
  }, thumbProps)));
});
const $57acba87d6e25586$var$ScrollAreaThumbImpl = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, style, ...thumbProps } = props;
  const scrollAreaContext = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$THUMB_NAME, __scopeScrollArea);
  const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext($57acba87d6e25586$var$THUMB_NAME, __scopeScrollArea);
  const { onThumbPositionChange } = scrollbarContext;
  const composedRef = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(
    forwardedRef,
    (node) => scrollbarContext.onThumbChange(node)
  );
  const removeUnlinkedScrollListenerRef = react.exports.useRef();
  const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(() => {
    if (removeUnlinkedScrollListenerRef.current) {
      removeUnlinkedScrollListenerRef.current();
      removeUnlinkedScrollListenerRef.current = void 0;
    }
  }, 100);
  react.exports.useEffect(() => {
    const viewport = scrollAreaContext.viewport;
    if (viewport) {
      const handleScroll = () => {
        debounceScrollEnd();
        if (!removeUnlinkedScrollListenerRef.current) {
          const listener = $57acba87d6e25586$var$addUnlinkedScrollListener(viewport, onThumbPositionChange);
          removeUnlinkedScrollListenerRef.current = listener;
          onThumbPositionChange();
        }
      };
      onThumbPositionChange();
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [
    scrollAreaContext.viewport,
    debounceScrollEnd,
    onThumbPositionChange
  ]);
  return /* @__PURE__ */ react.exports.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
    "data-state": scrollbarContext.hasThumb ? "visible" : "hidden"
  }, thumbProps, {
    ref: composedRef,
    style: {
      width: "var(--radix-scroll-area-thumb-width)",
      height: "var(--radix-scroll-area-thumb-height)",
      ...style
    },
    onPointerDownCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDownCapture, (event) => {
      const thumb = event.target;
      const thumbRect = thumb.getBoundingClientRect();
      const x = event.clientX - thumbRect.left;
      const y = event.clientY - thumbRect.top;
      scrollbarContext.onThumbPointerDown({
        x,
        y
      });
    }),
    onPointerUp: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerUp, scrollbarContext.onThumbPointerUp)
  }));
});
const $57acba87d6e25586$var$CORNER_NAME = "ScrollAreaCorner";
const $57acba87d6e25586$export$56969d565df7cc4b = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$CORNER_NAME, props.__scopeScrollArea);
  const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
  const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
  return hasCorner ? /* @__PURE__ */ react.exports.createElement($57acba87d6e25586$var$ScrollAreaCornerImpl, _extends({}, props, {
    ref: forwardedRef
  })) : null;
});
const $57acba87d6e25586$var$ScrollAreaCornerImpl = /* @__PURE__ */ react.exports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$CORNER_NAME, __scopeScrollArea);
  const [width1, setWidth] = react.exports.useState(0);
  const [height1, setHeight] = react.exports.useState(0);
  const hasSize = Boolean(width1 && height1);
  $57acba87d6e25586$var$useResizeObserver(context.scrollbarX, () => {
    var _context$scrollbarX;
    const height = ((_context$scrollbarX = context.scrollbarX) === null || _context$scrollbarX === void 0 ? void 0 : _context$scrollbarX.offsetHeight) || 0;
    context.onCornerHeightChange(height);
    setHeight(height);
  });
  $57acba87d6e25586$var$useResizeObserver(context.scrollbarY, () => {
    var _context$scrollbarY;
    const width = ((_context$scrollbarY = context.scrollbarY) === null || _context$scrollbarY === void 0 ? void 0 : _context$scrollbarY.offsetWidth) || 0;
    context.onCornerWidthChange(width);
    setWidth(width);
  });
  return hasSize ? /* @__PURE__ */ react.exports.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, cornerProps, {
    ref: forwardedRef,
    style: {
      width: width1,
      height: height1,
      position: "absolute",
      right: context.dir === "ltr" ? 0 : void 0,
      left: context.dir === "rtl" ? 0 : void 0,
      bottom: 0,
      ...props.style
    }
  })) : null;
});
function $57acba87d6e25586$var$toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function $57acba87d6e25586$var$getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function $57acba87d6e25586$var$getThumbSize(sizes2) {
  const ratio = $57acba87d6e25586$var$getThumbRatio(sizes2.viewport, sizes2.content);
  const scrollbarPadding = sizes2.scrollbar.paddingStart + sizes2.scrollbar.paddingEnd;
  const thumbSize = (sizes2.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function $57acba87d6e25586$var$getScrollPositionFromPointer(pointerPos, pointerOffset, sizes2, dir = "ltr") {
  const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes2);
  const thumbCenter = thumbSizePx / 2;
  const offset2 = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset2;
  const minPointerPos = sizes2.scrollbar.paddingStart + offset2;
  const maxPointerPos = sizes2.scrollbar.size - sizes2.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes2.content - sizes2.viewport;
  const scrollRange = dir === "ltr" ? [
    0,
    maxScrollPos
  ] : [
    maxScrollPos * -1,
    0
  ];
  const interpolate = $57acba87d6e25586$var$linearScale([
    minPointerPos,
    maxPointerPos
  ], scrollRange);
  return interpolate(pointerPos);
}
function $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes2, dir = "ltr") {
  const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes2);
  const scrollbarPadding = sizes2.scrollbar.paddingStart + sizes2.scrollbar.paddingEnd;
  const scrollbar = sizes2.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes2.content - sizes2.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [
    0,
    maxScrollPos
  ] : [
    maxScrollPos * -1,
    0
  ];
  const scrollWithoutMomentum = $ae6933e535247d3d$export$7d15b64cf5a3a4c4(scrollPos, scrollClampRange);
  const interpolate = $57acba87d6e25586$var$linearScale([
    0,
    maxScrollPos
  ], [
    0,
    maxThumbPos
  ]);
  return interpolate(scrollWithoutMomentum);
}
function $57acba87d6e25586$var$linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1])
      return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function $57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
const $57acba87d6e25586$var$addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = {
    left: node.scrollLeft,
    top: node.scrollTop
  };
  let rAF = 0;
  (function loop() {
    const position = {
      left: node.scrollLeft,
      top: node.scrollTop
    };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll)
      handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function $57acba87d6e25586$var$useDebounceCallback(callback, delay) {
  const handleCallback = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback);
  const debounceTimerRef = react.exports.useRef(0);
  react.exports.useEffect(
    () => () => window.clearTimeout(debounceTimerRef.current),
    []
  );
  return react.exports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [
    handleCallback,
    delay
  ]);
}
function $57acba87d6e25586$var$useResizeObserver(element, onResize) {
  const handleResize = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onResize);
  $9f79659886946c16$export$e5c5a5f917a5871c(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [
    element,
    handleResize
  ]);
}
const $57acba87d6e25586$export$be92b6f5f03c0fe9 = $57acba87d6e25586$export$ccf8d8d7bbf3c2cc;
const $57acba87d6e25586$export$d5c6c08dc2d3ca7 = $57acba87d6e25586$export$a21cbf9f11fca853;
const $57acba87d6e25586$export$9a4e88b92edfce6b = $57acba87d6e25586$export$2fabd85d0eba3c57;
const $57acba87d6e25586$export$6521433ed15a34db = $57acba87d6e25586$export$9fba1154677d7cd2;
const $57acba87d6e25586$export$ac61190d9fc311a9 = $57acba87d6e25586$export$56969d565df7cc4b;
var useStyles$C = createStyles((theme, { scrollbarSize, offsetScrollbars, scrollbarHovered, hidden: hidden2 }, getRef) => ({
  root: {
    overflow: "hidden"
  },
  viewport: {
    width: "100%",
    height: "100%",
    paddingRight: offsetScrollbars ? scrollbarSize : void 0
  },
  scrollbar: {
    display: hidden2 ? "none" : "flex",
    userSelect: "none",
    touchAction: "none",
    boxSizing: "border-box",
    padding: scrollbarSize / 5,
    transition: "background-color 150ms ease, opacity 150ms ease",
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
      [`& .${getRef("thumb")}`]: {
        backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.white, 0.5) : theme.fn.rgba(theme.black, 0.5)
      }
    },
    '&[data-orientation="vertical"]': {
      width: scrollbarSize
    },
    '&[data-orientation="horizontal"]': {
      flexDirection: "column",
      height: scrollbarSize
    },
    '&[data-state="hidden"]': {
      display: "none",
      opacity: 0
    }
  },
  thumb: {
    ref: getRef("thumb"),
    flex: 1,
    backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.white, 0.4) : theme.fn.rgba(theme.black, 0.4),
    borderRadius: scrollbarSize,
    position: "relative",
    transition: "background-color 150ms ease",
    display: hidden2 ? "none" : void 0,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "100%",
      minWidth: 44,
      minHeight: 44
    }
  },
  corner: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    transition: "opacity 150ms ease",
    opacity: scrollbarHovered ? 1 : 0,
    display: hidden2 ? "none" : void 0
  }
}));
const useStyles$D = useStyles$C;
var __defProp$B = Object.defineProperty;
var __defProps$j = Object.defineProperties;
var __getOwnPropDescs$j = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$C = Object.getOwnPropertySymbols;
var __hasOwnProp$C = Object.prototype.hasOwnProperty;
var __propIsEnum$C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$B = (obj, key, value) => key in obj ? __defProp$B(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$B = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$C.call(b, prop))
      __defNormalProp$B(a, prop, b[prop]);
  if (__getOwnPropSymbols$C)
    for (var prop of __getOwnPropSymbols$C(b)) {
      if (__propIsEnum$C.call(b, prop))
        __defNormalProp$B(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$j = (a, b) => __defProps$j(a, __getOwnPropDescs$j(b));
var __objRest$q = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$C.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$C)
    for (var prop of __getOwnPropSymbols$C(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$C.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$c = {
  scrollbarSize: 12,
  scrollHideDelay: 1e3,
  type: "hover",
  offsetScrollbars: false
};
const _ScrollArea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ScrollArea", defaultProps$c, props), {
    children,
    className,
    classNames,
    styles,
    scrollbarSize,
    scrollHideDelay,
    type,
    dir,
    offsetScrollbars,
    viewportRef,
    onScrollPositionChange,
    unstyled
  } = _a, others = __objRest$q(_a, ["children", "className", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled"]);
  const [scrollbarHovered, setScrollbarHovered] = react.exports.useState(false);
  const theme = useMantineTheme();
  const {
    classes,
    cx
  } = useStyles$D({
    scrollbarSize,
    offsetScrollbars,
    scrollbarHovered,
    hidden: type === "never"
  }, {
    name: "ScrollArea",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx($57acba87d6e25586$export$be92b6f5f03c0fe9, {
    type: type === "never" ? "always" : type,
    scrollHideDelay,
    dir: dir || theme.dir,
    ref,
    asChild: true,
    children: /* @__PURE__ */ jsxs(Box, {
      ...__spreadValues$B({
        className: cx(classes.root, className)
      }, others),
      children: [/* @__PURE__ */ jsx($57acba87d6e25586$export$d5c6c08dc2d3ca7, {
        className: classes.viewport,
        ref: viewportRef,
        onScroll: typeof onScrollPositionChange === "function" ? ({
          currentTarget
        }) => onScrollPositionChange({
          x: currentTarget.scrollLeft,
          y: currentTarget.scrollTop
        }) : void 0,
        children
      }), /* @__PURE__ */ jsx($57acba87d6e25586$export$9a4e88b92edfce6b, {
        orientation: "horizontal",
        className: classes.scrollbar,
        forceMount: true,
        onMouseEnter: () => setScrollbarHovered(true),
        onMouseLeave: () => setScrollbarHovered(false),
        children: /* @__PURE__ */ jsx($57acba87d6e25586$export$6521433ed15a34db, {
          className: classes.thumb
        })
      }), /* @__PURE__ */ jsx($57acba87d6e25586$export$9a4e88b92edfce6b, {
        orientation: "vertical",
        className: classes.scrollbar,
        forceMount: true,
        onMouseEnter: () => setScrollbarHovered(true),
        onMouseLeave: () => setScrollbarHovered(false),
        children: /* @__PURE__ */ jsx($57acba87d6e25586$export$6521433ed15a34db, {
          className: classes.thumb
        })
      }), /* @__PURE__ */ jsx($57acba87d6e25586$export$ac61190d9fc311a9, {
        className: classes.corner
      })]
    })
  });
});
const ScrollAreaAutosize = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ScrollAreaAutosize", defaultProps$c, props), {
    maxHeight,
    children,
    classNames,
    styles,
    scrollbarSize,
    scrollHideDelay,
    type,
    dir,
    offsetScrollbars,
    viewportRef,
    onScrollPositionChange,
    unstyled,
    sx
  } = _a, others = __objRest$q(_a, ["maxHeight", "children", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled", "sx"]);
  return /* @__PURE__ */ React.createElement(Box, __spreadProps$j(__spreadValues$B({}, others), {
    ref,
    sx: [{
      display: "flex",
      maxHeight
    }, ...packSx(sx)]
  }), /* @__PURE__ */ React.createElement(Box, {
    sx: {
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /* @__PURE__ */ React.createElement(_ScrollArea, {
    classNames,
    styles,
    scrollHideDelay,
    scrollbarSize,
    type,
    dir,
    offsetScrollbars,
    viewportRef,
    onScrollPositionChange,
    unstyled
  }, children)));
});
ScrollAreaAutosize.displayName = "@mantine/core/ScrollAreaAutosize";
_ScrollArea.displayName = "@mantine/core/ScrollArea";
_ScrollArea.Autosize = ScrollAreaAutosize;
const ScrollArea = _ScrollArea;
function getPopoverMiddlewares(options) {
  const middlewares = [offset(options.offset)];
  if (options.middlewares.shift) {
    middlewares.push(shift());
  }
  if (options.middlewares.flip) {
    middlewares.push(flip());
  }
  return middlewares;
}
function usePopover(options) {
  const [_opened, setOpened] = useUncontrolled({
    value: options.opened,
    defaultValue: options.defaultOpened,
    finalValue: false,
    onChange: options.onChange
  });
  const onClose = () => {
    var _a;
    (_a = options.onClose) == null ? void 0 : _a.call(options);
    setOpened(false);
  };
  const onToggle = () => {
    var _a, _b;
    if (_opened) {
      (_a = options.onClose) == null ? void 0 : _a.call(options);
      setOpened(false);
    } else {
      (_b = options.onOpen) == null ? void 0 : _b.call(options);
      setOpened(true);
    }
  };
  const floating = useFloating({
    placement: options.position,
    middleware: [
      ...getPopoverMiddlewares(options),
      ...options.width === "target" ? [
        size({
          apply({ rects }) {
            var _a, _b;
            Object.assign((_b = (_a = floating.refs.floating.current) == null ? void 0 : _a.style) != null ? _b : {}, {
              width: `${rects.reference.width}px`
            });
          }
        })
      ] : []
    ]
  });
  useFloatingAutoUpdate({
    opened: options.opened,
    positionDependencies: options.positionDependencies,
    floating
  });
  useDidUpdate(() => {
    var _a;
    (_a = options.onPositionChange) == null ? void 0 : _a.call(options, floating.placement);
  }, [floating.placement]);
  return {
    floating,
    controlled: typeof options.opened === "boolean",
    opened: _opened,
    onClose,
    onToggle
  };
}
const POPOVER_ERRORS = {
  context: "Popover component was not found in the tree",
  children: "Popover.Target component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
};
const [PopoverContextProvider, usePopoverContext] = createSafeContext(POPOVER_ERRORS.context);
var __defProp$A = Object.defineProperty;
var __defProps$i = Object.defineProperties;
var __getOwnPropDescs$i = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$B = Object.getOwnPropertySymbols;
var __hasOwnProp$B = Object.prototype.hasOwnProperty;
var __propIsEnum$B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$A = (obj, key, value) => key in obj ? __defProp$A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$A = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$B.call(b, prop))
      __defNormalProp$A(a, prop, b[prop]);
  if (__getOwnPropSymbols$B)
    for (var prop of __getOwnPropSymbols$B(b)) {
      if (__propIsEnum$B.call(b, prop))
        __defNormalProp$A(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$i = (a, b) => __defProps$i(a, __getOwnPropDescs$i(b));
var __objRest$p = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$B.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$B)
    for (var prop of __getOwnPropSymbols$B(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$B.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const PopoverTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, { children, refProp = "ref", popupType = "dialog" } = _b, others = __objRest$p(_b, ["children", "refProp", "popupType"]);
  if (!isElement(children)) {
    throw new Error(POPOVER_ERRORS.children);
  }
  const forwardedProps = others;
  const ctx = usePopoverContext();
  const targetRef = useMergedRef(ctx.reference, children.ref, ref);
  const accessibleProps = ctx.withRoles ? {
    "aria-haspopup": popupType,
    "aria-expanded": ctx.opened,
    "aria-controls": ctx.getDropdownId(),
    id: ctx.getTargetId()
  } : {};
  return react.exports.cloneElement(children, __spreadValues$A(__spreadProps$i(__spreadValues$A(__spreadValues$A(__spreadValues$A({}, forwardedProps), accessibleProps), ctx.targetProps), {
    className: clsx(ctx.targetProps.className, forwardedProps.className, children.props.className),
    [refProp]: targetRef
  }), !ctx.controlled ? { onClick: ctx.onToggle } : null));
});
PopoverTarget.displayName = "@mantine/core/PopoverTarget";
var useStyles$A = createStyles((theme, { radius, shadow }) => ({
  dropdown: {
    position: "absolute",
    backgroundColor: theme.white,
    background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    boxShadow: theme.shadows[shadow] || shadow || "none",
    borderRadius: theme.fn.radius(radius),
    "&:focus": {
      outline: 0
    }
  },
  arrow: {
    backgroundColor: "inherit",
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    zIndex: 1
  }
}));
const useStyles$B = useStyles$A;
function FocusTrap({
  children,
  active = true,
  refProp = "ref"
}) {
  const focusTrapRef = useFocusTrap(active);
  const ref = useMergedRef(focusTrapRef, children == null ? void 0 : children.ref);
  if (!isElement(children)) {
    return children;
  }
  return react.exports.cloneElement(children, { [refProp]: ref });
}
FocusTrap.displayName = "@mantine/core/FocusTrap";
var __defProp$z = Object.defineProperty;
var __defProps$h = Object.defineProperties;
var __getOwnPropDescs$h = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$A = Object.getOwnPropertySymbols;
var __hasOwnProp$A = Object.prototype.hasOwnProperty;
var __propIsEnum$A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$z = (obj, key, value) => key in obj ? __defProp$z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$A.call(b, prop))
      __defNormalProp$z(a, prop, b[prop]);
  if (__getOwnPropSymbols$A)
    for (var prop of __getOwnPropSymbols$A(b)) {
      if (__propIsEnum$A.call(b, prop))
        __defNormalProp$z(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$h = (a, b) => __defProps$h(a, __getOwnPropDescs$h(b));
var __objRest$o = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$A.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$A)
    for (var prop of __getOwnPropSymbols$A(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$A.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function PopoverDropdown(_a) {
  var _b = _a, {
    style,
    className,
    children
  } = _b, others = __objRest$o(_b, ["style", "className", "children"]);
  const {
    classNames,
    styles,
    unstyled,
    staticSelector
  } = useContextStylesApi();
  const ctx = usePopoverContext();
  const {
    classes,
    cx
  } = useStyles$B({
    radius: ctx.radius,
    shadow: ctx.shadow
  }, {
    name: staticSelector,
    classNames,
    styles,
    unstyled
  });
  const returnFocus = useFocusReturn({
    opened: ctx.opened,
    shouldReturnFocus: false
  });
  const accessibleProps = ctx.withRoles ? {
    "aria-labelledby": ctx.getTargetId(),
    id: ctx.getDropdownId(),
    role: "dialog"
  } : {};
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal: ctx.withinPortal,
    children: /* @__PURE__ */ jsx(Transition$2, {
      mounted: ctx.opened,
      transition: ctx.transition,
      duration: ctx.transitionDuration,
      exitDuration: typeof ctx.exitTransitionDuration === "number" ? ctx.exitTransitionDuration : ctx.transitionDuration,
      children: (transitionStyles) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsx(FocusTrap, {
          active: ctx.trapFocus,
          children: /* @__PURE__ */ jsxs(Box, {
            ...__spreadValues$z(__spreadProps$h(__spreadValues$z({}, accessibleProps), {
              tabIndex: -1,
              ref: ctx.floating,
              style: __spreadProps$h(__spreadValues$z(__spreadValues$z({}, style), transitionStyles), {
                zIndex: ctx.zIndex,
                top: (_a2 = ctx.y) != null ? _a2 : "",
                left: (_b2 = ctx.x) != null ? _b2 : "",
                width: ctx.width === "target" ? void 0 : ctx.width
              }),
              className: cx(classes.dropdown, className),
              onKeyDownCapture: closeOnEscape(ctx.onClose, {
                active: ctx.closeOnEscape,
                onTrigger: returnFocus
              }),
              "data-position": ctx.placement
            }), others),
            children: [children, /* @__PURE__ */ jsx(FloatingArrow, {
              visible: ctx.withArrow,
              withBorder: true,
              position: ctx.placement,
              arrowSize: ctx.arrowSize,
              arrowOffset: ctx.arrowOffset,
              className: classes.arrow
            })]
          })
        });
      }
    })
  });
}
PopoverDropdown.displayName = "@mantine/core/PopoverDropdown";
var __getOwnPropSymbols$z = Object.getOwnPropertySymbols;
var __hasOwnProp$z = Object.prototype.hasOwnProperty;
var __propIsEnum$z = Object.prototype.propertyIsEnumerable;
var __objRest$n = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$z)
    for (var prop of __getOwnPropSymbols$z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$b = {
  position: "bottom",
  offset: 8,
  positionDependencies: [],
  transition: "fade",
  transitionDuration: 150,
  middlewares: {
    flip: true,
    shift: true
  },
  arrowSize: 7,
  arrowOffset: 5,
  closeOnClickOutside: true,
  withinPortal: false,
  closeOnEscape: true,
  trapFocus: false,
  withRoles: true,
  clickOutsideEvents: ["mousedown", "touchstart"],
  zIndex: getDefaultZIndex("popover"),
  __staticSelector: "Popover"
};
function Popover(props) {
  const _a = useComponentDefaultProps("Popover", defaultProps$b, props), {
    children,
    position,
    offset: offset2,
    onPositionChange,
    positionDependencies,
    opened,
    transition,
    transitionDuration,
    width,
    middlewares,
    withArrow,
    arrowSize,
    arrowOffset,
    unstyled,
    classNames,
    styles,
    closeOnClickOutside,
    withinPortal,
    closeOnEscape: closeOnEscape2,
    clickOutsideEvents,
    trapFocus,
    onClose,
    onOpen,
    onChange,
    zIndex,
    radius,
    shadow,
    id,
    defaultOpened,
    exitTransitionDuration,
    __staticSelector,
    withRoles
  } = _a, others = __objRest$n(_a, ["children", "position", "offset", "onPositionChange", "positionDependencies", "opened", "transition", "transitionDuration", "width", "middlewares", "withArrow", "arrowSize", "arrowOffset", "unstyled", "classNames", "styles", "closeOnClickOutside", "withinPortal", "closeOnEscape", "clickOutsideEvents", "trapFocus", "onClose", "onOpen", "onChange", "zIndex", "radius", "shadow", "id", "defaultOpened", "exitTransitionDuration", "__staticSelector", "withRoles"]);
  const uid = useId(id);
  const theme = useMantineTheme();
  const popover = usePopover({
    middlewares,
    width,
    position: getFloatingPosition(theme.dir, position),
    offset: offset2 + (withArrow ? arrowSize / 2 : 0),
    onPositionChange,
    positionDependencies,
    opened,
    defaultOpened,
    onChange,
    onOpen,
    onClose
  });
  useClickOutside(() => closeOnClickOutside && popover.onClose(), clickOutsideEvents, [popover.floating.refs.floating.current, popover.floating.refs.reference.current]);
  return /* @__PURE__ */ jsx(StylesApiProvider, {
    classNames,
    styles,
    unstyled,
    staticSelector: __staticSelector,
    children: /* @__PURE__ */ jsx(PopoverContextProvider, {
      value: {
        controlled: popover.controlled,
        reference: popover.floating.reference,
        floating: popover.floating.floating,
        x: popover.floating.x,
        y: popover.floating.y,
        opened: popover.opened,
        transition,
        transitionDuration,
        exitTransitionDuration,
        width,
        withArrow,
        arrowSize,
        arrowOffset,
        placement: popover.floating.placement,
        trapFocus,
        withinPortal,
        zIndex,
        radius,
        shadow,
        closeOnEscape: closeOnEscape2,
        onClose: popover.onClose,
        onToggle: popover.onToggle,
        getTargetId: () => `${uid}-target`,
        getDropdownId: () => `${uid}-dropdown`,
        withRoles,
        targetProps: others
      },
      children
    })
  });
}
Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;
Popover.displayName = "@mantine/core/Popover";
var __defProp$y = Object.defineProperty;
var __defProps$g = Object.defineProperties;
var __getOwnPropDescs$g = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$y = Object.getOwnPropertySymbols;
var __hasOwnProp$y = Object.prototype.hasOwnProperty;
var __propIsEnum$y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$y = (obj, key, value) => key in obj ? __defProp$y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$y.call(b, prop))
      __defNormalProp$y(a, prop, b[prop]);
  if (__getOwnPropSymbols$y)
    for (var prop of __getOwnPropSymbols$y(b)) {
      if (__propIsEnum$y.call(b, prop))
        __defNormalProp$y(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$g = (a, b) => __defProps$g(a, __getOwnPropDescs$g(b));
function AvatarPlaceholderIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadProps$g(__spreadValues$y({}, props), {
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }),
    children: /* @__PURE__ */ jsx("path", {
      d: "M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
var __defProp$x = Object.defineProperty;
var __defProps$f = Object.defineProperties;
var __getOwnPropDescs$f = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$x = Object.getOwnPropertySymbols;
var __hasOwnProp$x = Object.prototype.hasOwnProperty;
var __propIsEnum$x = Object.prototype.propertyIsEnumerable;
var __defNormalProp$x = (obj, key, value) => key in obj ? __defProp$x(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$x = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$x.call(b, prop))
      __defNormalProp$x(a, prop, b[prop]);
  if (__getOwnPropSymbols$x)
    for (var prop of __getOwnPropSymbols$x(b)) {
      if (__propIsEnum$x.call(b, prop))
        __defNormalProp$x(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$f = (a, b) => __defProps$f(a, __getOwnPropDescs$f(b));
const AvatarGroupContext = react.exports.createContext(null);
function AvatarGroupProvider({
  spacing,
  children
}) {
  return /* @__PURE__ */ jsx(AvatarGroupContext.Provider, {
    value: {
      spacing
    },
    children
  });
}
function useAvatarGroupContext() {
  const ctx = react.exports.useContext(AvatarGroupContext);
  if (ctx) {
    return __spreadProps$f(__spreadValues$x({}, ctx), {
      withinGroup: true
    });
  }
  return {
    spacing: null,
    withinGroup: false
  };
}
var useStyles$y = createStyles((theme, { spacing }) => ({
  root: {
    display: "flex",
    paddingLeft: theme.fn.size({ size: spacing, sizes: theme.spacing })
  }
}));
const useStyles$z = useStyles$y;
var __defProp$w = Object.defineProperty;
var __getOwnPropSymbols$w = Object.getOwnPropertySymbols;
var __hasOwnProp$w = Object.prototype.hasOwnProperty;
var __propIsEnum$w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$w = (obj, key, value) => key in obj ? __defProp$w(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$w = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$w.call(b, prop))
      __defNormalProp$w(a, prop, b[prop]);
  if (__getOwnPropSymbols$w)
    for (var prop of __getOwnPropSymbols$w(b)) {
      if (__propIsEnum$w.call(b, prop))
        __defNormalProp$w(a, prop, b[prop]);
    }
  return a;
};
var __objRest$m = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$w.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$w)
    for (var prop of __getOwnPropSymbols$w(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$w.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$a = {};
const AvatarGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AvatarGroup", defaultProps$a, props), {
    children,
    spacing = "sm",
    unstyled,
    className
  } = _a, others = __objRest$m(_a, ["children", "spacing", "unstyled", "className"]);
  const {
    classes,
    cx
  } = useStyles$z({
    spacing
  }, {
    name: "AvatarGroup",
    unstyled
  });
  return /* @__PURE__ */ jsx(AvatarGroupProvider, {
    spacing,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$w({
        ref,
        className: cx(classes.root, className)
      }, others),
      children
    })
  });
});
AvatarGroup.displayName = "@mantine/core/AvatarGroup";
var __defProp$v = Object.defineProperty;
var __defProps$e = Object.defineProperties;
var __getOwnPropDescs$e = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$v = Object.getOwnPropertySymbols;
var __hasOwnProp$v = Object.prototype.hasOwnProperty;
var __propIsEnum$v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$v = (obj, key, value) => key in obj ? __defProp$v(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$v = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$v.call(b, prop))
      __defNormalProp$v(a, prop, b[prop]);
  if (__getOwnPropSymbols$v)
    for (var prop of __getOwnPropSymbols$v(b)) {
      if (__propIsEnum$v.call(b, prop))
        __defNormalProp$v(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$e = (a, b) => __defProps$e(a, __getOwnPropDescs$e(b));
const sizes$3 = {
  xs: 16,
  sm: 26,
  md: 38,
  lg: 56,
  xl: 84
};
function getGroupStyles({ withinGroup, spacing, theme }) {
  if (!withinGroup) {
    return null;
  }
  return {
    marginLeft: -theme.fn.size({ size: spacing, sizes: theme.spacing }),
    backgroundColor: `${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}`,
    border: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}`
  };
}
var useStyles$w = createStyles((theme, { size: size2, radius, color, withinGroup, spacing, variant, gradient }) => {
  const colors = theme.fn.variant({ variant, color, gradient });
  return {
    root: __spreadValues$v(__spreadProps$e(__spreadValues$v({}, theme.fn.focusStyles()), {
      WebkitTapHighlightColor: "transparent",
      boxSizing: "border-box",
      position: "relative",
      display: "block",
      userSelect: "none",
      overflow: "hidden",
      width: theme.fn.size({ size: size2, sizes: sizes$3 }),
      minWidth: theme.fn.size({ size: size2, sizes: sizes$3 }),
      height: theme.fn.size({ size: size2, sizes: sizes$3 }),
      borderRadius: theme.fn.radius(radius),
      textDecoration: "none",
      border: 0,
      backgroundColor: "transparent",
      padding: 0
    }), getGroupStyles({ withinGroup, spacing, theme })),
    image: {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      display: "block"
    },
    placeholder: __spreadProps$e(__spreadValues$v({}, theme.fn.fontStyles()), {
      fontSize: theme.fn.size({ size: size2, sizes: sizes$3 }) / 2.5,
      color: colors.color,
      fontWeight: 700,
      backgroundColor: colors.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      userSelect: "none",
      backgroundImage: variant === "gradient" ? colors.background : void 0,
      border: `${variant === "gradient" ? 0 : 1}px solid ${colors.border}`,
      borderRadius: theme.fn.radius(radius)
    }),
    placeholderIcon: {
      width: "70%",
      height: "70%",
      color: colors.color
    }
  };
});
const useStyles$x = useStyles$w;
var __defProp$u = Object.defineProperty;
var __defProps$d = Object.defineProperties;
var __getOwnPropDescs$d = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$u = Object.getOwnPropertySymbols;
var __hasOwnProp$u = Object.prototype.hasOwnProperty;
var __propIsEnum$u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$u = (obj, key, value) => key in obj ? __defProp$u(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$u = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$u.call(b, prop))
      __defNormalProp$u(a, prop, b[prop]);
  if (__getOwnPropSymbols$u)
    for (var prop of __getOwnPropSymbols$u(b)) {
      if (__propIsEnum$u.call(b, prop))
        __defNormalProp$u(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$d = (a, b) => __defProps$d(a, __getOwnPropDescs$d(b));
var __objRest$l = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$u.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$u)
    for (var prop of __getOwnPropSymbols$u(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$u.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$9 = {
  size: "md",
  color: "gray",
  variant: "light",
  gradient: {
    from: "blue",
    to: "cyan",
    deg: 45
  }
};
const _Avatar = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Avatar", defaultProps$9, props), {
    className,
    size: size2,
    src,
    alt,
    radius,
    children,
    color,
    variant,
    gradient,
    classNames,
    styles,
    imageProps,
    unstyled
  } = _a, others = __objRest$l(_a, ["className", "size", "src", "alt", "radius", "children", "color", "variant", "gradient", "classNames", "styles", "imageProps", "unstyled"]);
  const ctx = useAvatarGroupContext();
  const [error, setError] = react.exports.useState(!src);
  const {
    classes,
    cx
  } = useStyles$x({
    color,
    radius,
    size: size2,
    withinGroup: ctx.withinGroup,
    spacing: ctx.spacing,
    variant,
    gradient
  }, {
    classNames,
    styles,
    unstyled,
    name: "Avatar"
  });
  react.exports.useEffect(() => {
    !src ? setError(true) : setError(false);
  }, [src]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$u({
      component: "div",
      className: cx(classes.root, className),
      ref
    }, others),
    children: error ? /* @__PURE__ */ jsx("div", {
      className: classes.placeholder,
      title: alt,
      children: children || /* @__PURE__ */ jsx(AvatarPlaceholderIcon, {
        className: classes.placeholderIcon
      })
    }) : /* @__PURE__ */ jsx("img", {
      ...__spreadProps$d(__spreadValues$u({}, imageProps), {
        className: classes.image,
        src,
        alt,
        onError: () => setError(true)
      })
    })
  });
});
_Avatar.displayName = "@mantine/core/Avatar";
_Avatar.Group = AvatarGroup;
const Avatar = createPolymorphicComponent(_Avatar);
var useStyles$u = createStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  breadcrumb: {
    lineHeight: 1,
    whiteSpace: "nowrap",
    WebkitTapHighlightColor: "transparent"
  },
  separator: {
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7],
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));
const useStyles$v = useStyles$u;
var __defProp$t = Object.defineProperty;
var __getOwnPropSymbols$t = Object.getOwnPropertySymbols;
var __hasOwnProp$t = Object.prototype.hasOwnProperty;
var __propIsEnum$t = Object.prototype.propertyIsEnumerable;
var __defNormalProp$t = (obj, key, value) => key in obj ? __defProp$t(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$t = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$t.call(b, prop))
      __defNormalProp$t(a, prop, b[prop]);
  if (__getOwnPropSymbols$t)
    for (var prop of __getOwnPropSymbols$t(b)) {
      if (__propIsEnum$t.call(b, prop))
        __defNormalProp$t(a, prop, b[prop]);
    }
  return a;
};
var __objRest$k = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$t.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$t)
    for (var prop of __getOwnPropSymbols$t(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$t.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$8 = {
  separator: "/"
};
const Breadcrumbs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Breadcrumbs", defaultProps$8, props), {
    className,
    children,
    separator,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$k(_a, ["className", "children", "separator", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$v(null, {
    classNames,
    styles,
    unstyled,
    name: "Breadcrumbs"
  });
  const items = React.Children.toArray(children).reduce((acc, child, index, array) => {
    var _a2;
    const item = isElement(child) ? React.cloneElement(child, {
      className: cx(classes.breadcrumb, (_a2 = child.props) == null ? void 0 : _a2.className),
      key: index
    }) : /* @__PURE__ */ jsx("div", {
      className: classes.breadcrumb,
      children: child
    }, index);
    acc.push(item);
    if (index !== array.length - 1) {
      acc.push(
        /* @__PURE__ */ jsx(Text, {
          size: "sm",
          className: classes.separator,
          children: separator
        }, `separator-${index}`)
      );
    }
    return acc;
  }, []);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$t({
      className: cx(classes.root, className),
      ref
    }, others),
    children: items
  });
});
Breadcrumbs.displayName = "@mantine/core/Breadcrumbs";
const sizes$2 = {
  xs: 12,
  sm: 18,
  md: 24,
  lg: 34,
  xl: 42
};
var useStyles$s = createStyles((theme, { size: size2, color, transitionDuration }) => {
  const sizeValue = theme.fn.size({ size: size2, sizes: sizes$2 });
  const _color = color || (theme.colorScheme === "dark" ? theme.white : theme.black);
  return {
    root: {
      borderRadius: theme.radius.sm,
      width: sizeValue + theme.spacing.xs,
      height: sizeValue + theme.spacing.xs,
      padding: theme.spacing.xs / 2,
      cursor: "pointer"
    },
    burger: {
      position: "relative",
      userSelect: "none",
      boxSizing: "border-box",
      "&, &::before, &::after": {
        display: "block",
        width: sizeValue,
        height: Math.ceil(sizeValue / 12),
        backgroundColor: _color,
        outline: "1px solid transparent",
        transitionProperty: "background-color, transform",
        transitionDuration: `${transitionDuration}ms`,
        "@media (prefers-reduced-motion)": {
          transitionDuration: theme.respectReducedMotion ? "0ms" : void 0
        }
      },
      "&::before, &::after": {
        position: "absolute",
        content: '""',
        left: 0
      },
      "&::before": {
        top: sizeValue / 3 * -1
      },
      "&::after": {
        top: sizeValue / 3
      },
      "&[data-opened]": {
        backgroundColor: "transparent",
        "&::before": {
          transform: `translateY(${sizeValue / 3}px) rotate(45deg)`
        },
        "&::after": {
          transform: `translateY(-${sizeValue / 3}px) rotate(-45deg)`
        }
      }
    }
  };
});
const useStyles$t = useStyles$s;
var __defProp$s = Object.defineProperty;
var __getOwnPropSymbols$s = Object.getOwnPropertySymbols;
var __hasOwnProp$s = Object.prototype.hasOwnProperty;
var __propIsEnum$s = Object.prototype.propertyIsEnumerable;
var __defNormalProp$s = (obj, key, value) => key in obj ? __defProp$s(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$s = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$s.call(b, prop))
      __defNormalProp$s(a, prop, b[prop]);
  if (__getOwnPropSymbols$s)
    for (var prop of __getOwnPropSymbols$s(b)) {
      if (__propIsEnum$s.call(b, prop))
        __defNormalProp$s(a, prop, b[prop]);
    }
  return a;
};
var __objRest$j = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$s.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$s)
    for (var prop of __getOwnPropSymbols$s(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$s.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$7 = {
  size: "md",
  transitionDuration: 300
};
const Burger = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Burger", defaultProps$7, props), {
    className,
    opened,
    color,
    size: size2,
    classNames,
    styles,
    transitionDuration
  } = _a, others = __objRest$j(_a, ["className", "opened", "color", "size", "classNames", "styles", "transitionDuration"]);
  const {
    classes,
    cx
  } = useStyles$t({
    color,
    size: size2,
    transitionDuration
  }, {
    classNames,
    styles,
    name: "Burger"
  });
  return /* @__PURE__ */ jsx(UnstyledButton, {
    ...__spreadValues$s({
      className: cx(classes.root, className),
      ref
    }, others),
    children: /* @__PURE__ */ jsx("div", {
      "data-opened": opened || void 0,
      className: classes.burger
    })
  });
});
Burger.displayName = "@mantine/core/Burger";
function GroupedTransition({
  transitions,
  duration = 250,
  exitDuration = duration,
  mounted,
  children,
  timingFunction,
  onExit,
  onEntered,
  onEnter,
  onExited
}) {
  const {
    transitionDuration,
    transitionStatus,
    transitionTimingFunction
  } = useTransition({
    mounted,
    duration,
    exitDuration,
    timingFunction,
    onExit,
    onEntered,
    onEnter,
    onExited
  });
  if (transitionDuration === 0) {
    return mounted ? /* @__PURE__ */ jsx(Fragment, {
      children: children({})
    }) : null;
  }
  if (transitionStatus === "exited") {
    return null;
  }
  const transitionsStyles = Object.keys(transitions).reduce((acc, transition) => {
    acc[transition] = getTransitionStyles({
      duration: transitions[transition].duration,
      transition: transitions[transition].transition,
      timingFunction: transitions[transition].timingFunction || transitionTimingFunction,
      state: transitionStatus
    });
    return acc;
  }, {});
  return /* @__PURE__ */ jsx(Fragment, {
    children: children(transitionsStyles)
  });
}
GroupedTransition.displayName = "@mantine/core/GroupedTransition";
var useStyles$q = createStyles((theme, { color }) => ({
  root: {
    backgroundColor: theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : 2),
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : "inherit"
  }
}));
const useStyles$r = useStyles$q;
var __defProp$r = Object.defineProperty;
var __getOwnPropSymbols$r = Object.getOwnPropertySymbols;
var __hasOwnProp$r = Object.prototype.hasOwnProperty;
var __propIsEnum$r = Object.prototype.propertyIsEnumerable;
var __defNormalProp$r = (obj, key, value) => key in obj ? __defProp$r(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$r = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$r.call(b, prop))
      __defNormalProp$r(a, prop, b[prop]);
  if (__getOwnPropSymbols$r)
    for (var prop of __getOwnPropSymbols$r(b)) {
      if (__propIsEnum$r.call(b, prop))
        __defNormalProp$r(a, prop, b[prop]);
    }
  return a;
};
var __objRest$i = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$r.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$r)
    for (var prop of __getOwnPropSymbols$r(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$r.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$6 = {
  color: "yellow"
};
const Mark = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Mark", defaultProps$6, props), {
    color,
    className,
    unstyled
  } = _a, others = __objRest$i(_a, ["color", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$r({
    color
  }, {
    unstyled,
    name: "Mark"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$r({
      component: "mark",
      ref,
      className: cx(classes.root, className)
    }, others)
  });
});
Mark.displayName = "@mantine/core/Mark";
function escapeRegex(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
}
function highlighter(value, _highlight) {
  if (_highlight == null) {
    return [{ chunk: value, highlighted: false }];
  }
  const highlight = Array.isArray(_highlight) ? _highlight.map(escapeRegex) : escapeRegex(_highlight);
  const shouldHighlight = Array.isArray(highlight) ? highlight.filter((part) => part.trim().length > 0).length > 0 : highlight.trim() !== "";
  if (!shouldHighlight) {
    return [{ chunk: value, highlighted: false }];
  }
  const matcher = typeof highlight === "string" ? highlight.trim() : highlight.filter((part) => part.trim().length !== 0).map((part) => part.trim()).join("|");
  const re = new RegExp(`(${matcher})`, "gi");
  const chunks = value.split(re).map((part) => ({ chunk: part, highlighted: re.test(part) })).filter(({ chunk }) => chunk);
  return chunks;
}
var __defProp$q = Object.defineProperty;
var __getOwnPropSymbols$q = Object.getOwnPropertySymbols;
var __hasOwnProp$q = Object.prototype.hasOwnProperty;
var __propIsEnum$q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$q = (obj, key, value) => key in obj ? __defProp$q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$q.call(b, prop))
      __defNormalProp$q(a, prop, b[prop]);
  if (__getOwnPropSymbols$q)
    for (var prop of __getOwnPropSymbols$q(b)) {
      if (__propIsEnum$q.call(b, prop))
        __defNormalProp$q(a, prop, b[prop]);
    }
  return a;
};
var __objRest$h = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$q.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$q)
    for (var prop of __getOwnPropSymbols$q(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$q.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$5 = {
  highlightColor: "yellow"
};
const _Highlight = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Highlight", defaultProps$5, props), {
    children,
    highlight,
    highlightColor,
    highlightStyles,
    unstyled
  } = _a, others = __objRest$h(_a, ["children", "highlight", "highlightColor", "highlightStyles", "unstyled"]);
  const highlightChunks = highlighter(children, highlight);
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$q({
      unstyled,
      ref
    }, others),
    children: highlightChunks.map(({
      chunk,
      highlighted
    }, i) => highlighted ? /* @__PURE__ */ jsx(Mark, {
      unstyled,
      color: highlightColor,
      sx: highlightStyles,
      children: chunk
    }, i) : /* @__PURE__ */ jsx("span", {
      children: chunk
    }, i))
  });
});
_Highlight.displayName = "@mantine/core/Highlight";
const Highlight = createPolymorphicComponent(_Highlight);
function useDelayedHover({ open, close, openDelay, closeDelay }) {
  const openTimeout = react.exports.useRef(-1);
  const closeTimeout = react.exports.useRef(-1);
  const clearTimeouts = () => {
    window.clearTimeout(openTimeout.current);
    window.clearTimeout(closeTimeout.current);
  };
  const openDropdown = () => {
    clearTimeouts();
    if (openDelay === 0) {
      open();
    } else {
      openTimeout.current = window.setTimeout(open, openDelay);
    }
  };
  const closeDropdown = () => {
    clearTimeouts();
    if (closeDelay === 0) {
      close();
    } else {
      closeTimeout.current = window.setTimeout(close, closeDelay);
    }
  };
  react.exports.useEffect(() => clearTimeouts, []);
  return { openDropdown, closeDropdown };
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var useStyles$o = createStyles((theme) => ({
  root: {
    lineHeight: theme.lineHeight,
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    padding: `3px ${theme.spacing.xs / 2}px`,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    borderBottom: `3px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
  }
}));
const useStyles$p = useStyles$o;
var __defProp$p = Object.defineProperty;
var __getOwnPropSymbols$p = Object.getOwnPropertySymbols;
var __hasOwnProp$p = Object.prototype.hasOwnProperty;
var __propIsEnum$p = Object.prototype.propertyIsEnumerable;
var __defNormalProp$p = (obj, key, value) => key in obj ? __defProp$p(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$p = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$p.call(b, prop))
      __defNormalProp$p(a, prop, b[prop]);
  if (__getOwnPropSymbols$p)
    for (var prop of __getOwnPropSymbols$p(b)) {
      if (__propIsEnum$p.call(b, prop))
        __defNormalProp$p(a, prop, b[prop]);
    }
  return a;
};
var __objRest$g = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$p.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$p)
    for (var prop of __getOwnPropSymbols$p(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$p.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Kbd = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Kbd", {}, props), {
    className,
    children,
    unstyled
  } = _a, others = __objRest$g(_a, ["className", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$p(null, {
    name: "Kbd",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$p({
      component: "kbd",
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
Kbd.displayName = "@mantine/core/Kbd";
var useStyles$m = createStyles((theme) => ({
  divider: {
    margin: `${theme.spacing.xs / 2}px -5px`,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
  }
}));
const useStyles$n = useStyles$m;
var __defProp$o = Object.defineProperty;
var __getOwnPropSymbols$o = Object.getOwnPropertySymbols;
var __hasOwnProp$o = Object.prototype.hasOwnProperty;
var __propIsEnum$o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$o = (obj, key, value) => key in obj ? __defProp$o(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$o = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$o.call(b, prop))
      __defNormalProp$o(a, prop, b[prop]);
  if (__getOwnPropSymbols$o)
    for (var prop of __getOwnPropSymbols$o(b)) {
      if (__propIsEnum$o.call(b, prop))
        __defNormalProp$o(a, prop, b[prop]);
    }
  return a;
};
var __objRest$f = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$o.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$o)
    for (var prop of __getOwnPropSymbols$o(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$o.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuDivider(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$f(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$n(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$o({
      className: cx(classes.divider, className)
    }, others)
  });
}
MenuDivider.displayName = "@mantine/core/MenuDivider";
const MENU_ERRORS = {
  context: "Menu component was not found in the tree",
  children: "Menu.Target component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
};
const [MenuContextProvider, useMenuContext] = createSafeContext(MENU_ERRORS.context);
var __defProp$n = Object.defineProperty;
var __getOwnPropSymbols$n = Object.getOwnPropertySymbols;
var __hasOwnProp$n = Object.prototype.hasOwnProperty;
var __propIsEnum$n = Object.prototype.propertyIsEnumerable;
var __defNormalProp$n = (obj, key, value) => key in obj ? __defProp$n(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$n = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$n.call(b, prop))
      __defNormalProp$n(a, prop, b[prop]);
  if (__getOwnPropSymbols$n)
    for (var prop of __getOwnPropSymbols$n(b)) {
      if (__propIsEnum$n.call(b, prop))
        __defNormalProp$n(a, prop, b[prop]);
    }
  return a;
};
var __objRest$e = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$n.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$n)
    for (var prop of __getOwnPropSymbols$n(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$n.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$e(_b, ["children", "onMouseEnter", "onMouseLeave"]);
  const wrapperRef = react.exports.useRef();
  const ctx = useMenuContext();
  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      wrapperRef.current.querySelectorAll("[data-menu-item]")[0].focus();
    }
  };
  const handleMouseEnter = createEventHandler(onMouseEnter, () => ctx.trigger === "hover" && ctx.openDropdown());
  const handleMouseLeave = createEventHandler(onMouseLeave, () => ctx.trigger === "hover" && ctx.closeDropdown());
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$n({
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      role: "menu",
      "aria-orientation": "vertical"
    }, others),
    children: /* @__PURE__ */ jsx("div", {
      tabIndex: -1,
      "data-menu-dropdown": true,
      "data-autofocus": true,
      onKeyDown: handleKeyDown,
      ref: wrapperRef,
      style: {
        outline: 0
      },
      children
    })
  });
}
MenuDropdown.displayName = "@mantine/core/MenuDropdown";
var __defProp$m = Object.defineProperty;
var __defProps$c = Object.defineProperties;
var __getOwnPropDescs$c = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$m = Object.getOwnPropertySymbols;
var __hasOwnProp$m = Object.prototype.hasOwnProperty;
var __propIsEnum$m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$m = (obj, key, value) => key in obj ? __defProp$m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$m = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$m.call(b, prop))
      __defNormalProp$m(a, prop, b[prop]);
  if (__getOwnPropSymbols$m)
    for (var prop of __getOwnPropSymbols$m(b)) {
      if (__propIsEnum$m.call(b, prop))
        __defNormalProp$m(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$c = (a, b) => __defProps$c(a, __getOwnPropDescs$c(b));
var useStyles$k = createStyles((theme, { color, radius }) => ({
  item: __spreadProps$c(__spreadValues$m({}, theme.fn.fontStyles()), {
    WebkitTapHighlightColor: "transparent",
    fontSize: theme.fontSizes.sm,
    border: 0,
    backgroundColor: "transparent",
    outline: 0,
    width: "100%",
    textAlign: "left",
    textDecoration: "none",
    boxSizing: "border-box",
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    cursor: "pointer",
    borderRadius: theme.fn.radius(radius),
    color: color ? theme.fn.variant({ variant: "filled", primaryFallback: false, color }).background : theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    display: "flex",
    alignItems: "center",
    "&:disabled": {
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
      pointerEvents: "none",
      userSelect: "none"
    },
    "&[data-hovered]": {
      backgroundColor: color ? theme.fn.variant({ variant: "light", color }).background : theme.colorScheme === "dark" ? theme.fn.rgba(theme.colors.dark[3], 0.35) : theme.colors.gray[0]
    }
  }),
  itemLabel: {
    flex: 1
  },
  itemIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.xs
  },
  itemRightSection: {}
}));
const useStyles$l = useStyles$k;
var __defProp$l = Object.defineProperty;
var __defProps$b = Object.defineProperties;
var __getOwnPropDescs$b = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$l = Object.getOwnPropertySymbols;
var __hasOwnProp$l = Object.prototype.hasOwnProperty;
var __propIsEnum$l = Object.prototype.propertyIsEnumerable;
var __defNormalProp$l = (obj, key, value) => key in obj ? __defProp$l(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$l = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$l.call(b, prop))
      __defNormalProp$l(a, prop, b[prop]);
  if (__getOwnPropSymbols$l)
    for (var prop of __getOwnPropSymbols$l(b)) {
      if (__propIsEnum$l.call(b, prop))
        __defNormalProp$l(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$b = (a, b) => __defProps$b(a, __getOwnPropDescs$b(b));
var __objRest$d = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$l.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$l)
    for (var prop of __getOwnPropSymbols$l(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$l.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const _MenuItem = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    color,
    closeMenuOnClick,
    icon,
    rightSection
  } = _b, others = __objRest$d(_b, ["children", "className", "color", "closeMenuOnClick", "icon", "rightSection"]);
  const ctx = useMenuContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx,
    theme
  } = useStyles$l({
    radius: ctx.radius,
    color
  }, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  const itemRef = react.exports.useRef();
  const itemIndex = ctx.getItemIndex(itemRef.current);
  const _others = others;
  const handleMouseLeave = createEventHandler(_others.onMouseLeave, () => ctx.setHovered(-1));
  const handleMouseEnter = createEventHandler(_others.onMouseEnter, () => ctx.setHovered(ctx.getItemIndex(itemRef.current)));
  const handleClick = createEventHandler(_others.onClick, () => {
    if (typeof closeMenuOnClick === "boolean") {
      closeMenuOnClick && ctx.closeDropdownImmediately();
    } else {
      ctx.closeOnItemClick && ctx.closeDropdownImmediately();
    }
  });
  const handleFocus = createEventHandler(_others.onFocus, () => ctx.setHovered(ctx.getItemIndex(itemRef.current)));
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadProps$b(__spreadValues$l({
      component: "button"
    }, others), {
      type: "button",
      tabIndex: -1,
      onFocus: handleFocus,
      className: cx(classes.item, className),
      ref: useMergedRef(itemRef, ref),
      role: "menuitem",
      "data-menu-item": true,
      "data-hovered": ctx.hovered === itemIndex ? true : void 0,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      onKeyDown: createScopedKeydownHandler({
        siblingSelector: "[data-menu-item]",
        parentSelector: "[data-menu-dropdown]",
        activateOnFocus: false,
        loop: ctx.loop,
        dir: theme.dir,
        orientation: "vertical",
        onKeyDown: _others.onKeydown
      })
    }),
    children: [icon && /* @__PURE__ */ jsx("div", {
      className: classes.itemIcon,
      children: icon
    }), children && /* @__PURE__ */ jsx("div", {
      className: classes.itemLabel,
      children
    }), rightSection && /* @__PURE__ */ jsx("div", {
      className: classes.itemRightSection,
      children: rightSection
    })]
  });
});
_MenuItem.displayName = "@mantine/core/MenuItem";
const MenuItem = createPolymorphicComponent(_MenuItem);
var useStyles$i = createStyles((theme) => ({
  label: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    padding: `${theme.spacing.xs / 2}px ${theme.spacing.sm}px`,
    cursor: "default"
  }
}));
const useStyles$j = useStyles$i;
var __defProp$k = Object.defineProperty;
var __getOwnPropSymbols$k = Object.getOwnPropertySymbols;
var __hasOwnProp$k = Object.prototype.hasOwnProperty;
var __propIsEnum$k = Object.prototype.propertyIsEnumerable;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$k = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$k.call(b, prop))
      __defNormalProp$k(a, prop, b[prop]);
  if (__getOwnPropSymbols$k)
    for (var prop of __getOwnPropSymbols$k(b)) {
      if (__propIsEnum$k.call(b, prop))
        __defNormalProp$k(a, prop, b[prop]);
    }
  return a;
};
var __objRest$c = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$k.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$k)
    for (var prop of __getOwnPropSymbols$k(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$k.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuLabel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$c(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$j(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$k({
      className: cx(classes.label, className)
    }, others),
    children
  });
}
MenuLabel.displayName = "@mantine/core/MenuLabel";
var __defProp$j = Object.defineProperty;
var __getOwnPropSymbols$j = Object.getOwnPropertySymbols;
var __hasOwnProp$j = Object.prototype.hasOwnProperty;
var __propIsEnum$j = Object.prototype.propertyIsEnumerable;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$j = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$j.call(b, prop))
      __defNormalProp$j(a, prop, b[prop]);
  if (__getOwnPropSymbols$j)
    for (var prop of __getOwnPropSymbols$j(b)) {
      if (__propIsEnum$j.call(b, prop))
        __defNormalProp$j(a, prop, b[prop]);
    }
  return a;
};
var __objRest$b = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$j.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$j)
    for (var prop of __getOwnPropSymbols$j(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$j.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const MenuTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp = "ref"
  } = _b, others = __objRest$b(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(MENU_ERRORS.children);
  }
  const ctx = useMenuContext();
  const onClick = createEventHandler(children.props.onClick, () => ctx.trigger === "click" && ctx.toggleDropdown());
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, () => ctx.trigger === "hover" && ctx.openDropdown());
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, () => ctx.trigger === "hover" && ctx.closeDropdown());
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$j({
      refProp,
      popupType: "menu",
      ref
    }, others),
    children: react.exports.cloneElement(children, {
      onClick,
      onMouseEnter,
      onMouseLeave,
      "data-expanded": ctx.opened ? true : void 0
    })
  });
});
MenuTarget.displayName = "@mantine/core/MenuTarget";
var useStyles$g = createStyles({
  dropdown: { padding: 4 }
});
const useStyles$h = useStyles$g;
var __defProp$i = Object.defineProperty;
var __defProps$a = Object.defineProperties;
var __getOwnPropDescs$a = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$i = Object.getOwnPropertySymbols;
var __hasOwnProp$i = Object.prototype.hasOwnProperty;
var __propIsEnum$i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$i = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$i.call(b, prop))
      __defNormalProp$i(a, prop, b[prop]);
  if (__getOwnPropSymbols$i)
    for (var prop of __getOwnPropSymbols$i(b)) {
      if (__propIsEnum$i.call(b, prop))
        __defNormalProp$i(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$a = (a, b) => __defProps$a(a, __getOwnPropDescs$a(b));
var __objRest$a = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$i.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$i)
    for (var prop of __getOwnPropSymbols$i(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$i.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$4 = {
  closeOnItemClick: true,
  loop: true,
  trigger: "click",
  openDelay: 0,
  closeDelay: 100
};
function Menu(props) {
  const _a = useComponentDefaultProps("Menu", defaultProps$4, props), {
    children,
    onOpen,
    onClose,
    opened,
    defaultOpened,
    onChange,
    closeOnItemClick,
    loop,
    closeOnEscape: closeOnEscape2,
    trigger,
    openDelay,
    closeDelay,
    classNames,
    styles,
    unstyled,
    radius
  } = _a, others = __objRest$a(_a, ["children", "onOpen", "onClose", "opened", "defaultOpened", "onChange", "closeOnItemClick", "loop", "closeOnEscape", "trigger", "openDelay", "closeDelay", "classNames", "styles", "unstyled", "radius"]);
  const {
    classes,
    cx
  } = useStyles$h();
  const [hovered, {
    setHovered,
    resetHovered
  }] = useHovered();
  const [_opened, setOpened] = useUncontrolled({
    value: opened,
    defaultValue: defaultOpened,
    finalValue: false,
    onChange
  });
  const close = () => {
    setOpened(false);
    _opened && (onClose == null ? void 0 : onClose());
  };
  const open = () => {
    setOpened(true);
    !_opened && (onOpen == null ? void 0 : onOpen());
  };
  const toggleDropdown = () => _opened ? close() : open();
  const {
    openDropdown,
    closeDropdown
  } = useDelayedHover({
    open,
    close,
    closeDelay,
    openDelay
  });
  const getItemIndex = (node) => getContextItemIndex("[data-menu-item]", "[data-menu-dropdown]", node);
  useDidUpdate(() => {
    resetHovered();
  }, [_opened]);
  return /* @__PURE__ */ jsx(MenuContextProvider, {
    value: {
      opened: _opened,
      toggleDropdown,
      getItemIndex,
      hovered,
      setHovered,
      closeOnItemClick,
      closeDropdown: trigger === "click" ? close : closeDropdown,
      openDropdown: trigger === "click" ? open : openDropdown,
      closeDropdownImmediately: close,
      loop,
      trigger,
      radius
    },
    children: /* @__PURE__ */ jsx(Popover, {
      ...__spreadProps$a(__spreadValues$i({}, others), {
        radius,
        opened: _opened,
        onChange: setOpened,
        defaultOpened,
        trapFocus: trigger === "click",
        closeOnEscape: closeOnEscape2 && trigger === "click",
        __staticSelector: "Menu",
        classNames: __spreadProps$a(__spreadValues$i({}, classNames), {
          dropdown: cx(classes.dropdown, classNames == null ? void 0 : classNames.dropdown)
        }),
        styles,
        unstyled,
        onClose: close,
        onOpen: open
      }),
      children
    })
  });
}
Menu.displayName = "@mantine/core/Menu";
Menu.Item = MenuItem;
Menu.Label = MenuLabel;
Menu.Dropdown = MenuDropdown;
Menu.Target = MenuTarget;
Menu.Divider = MenuDivider;
var __defProp$h = Object.defineProperty;
var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
var __hasOwnProp$h = Object.prototype.hasOwnProperty;
var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$h = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$h.call(b, prop))
      __defNormalProp$h(a, prop, b[prop]);
  if (__getOwnPropSymbols$h)
    for (var prop of __getOwnPropSymbols$h(b)) {
      if (__propIsEnum$h.call(b, prop))
        __defNormalProp$h(a, prop, b[prop]);
    }
  return a;
};
const sizes$1 = {
  xs: 320,
  sm: 380,
  md: 440,
  lg: 620,
  xl: 780
};
function getFullScreenStyles(fullScreen) {
  if (!fullScreen) {
    return {};
  }
  return {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "100vh",
    overflowY: "auto"
  };
}
var useStyles$e = createStyles((theme, { overflow, size: size2, centered, zIndex, fullScreen }) => ({
  close: {},
  overlay: {
    display: fullScreen ? "none" : void 0
  },
  root: {
    position: "fixed",
    zIndex,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  inner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "auto",
    padding: fullScreen ? 0 : `${theme.spacing.xl * 2}px ${theme.spacing.md}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: centered ? "center" : "flex-start"
  },
  title: {
    marginRight: theme.spacing.md,
    textOverflow: "ellipsis",
    display: "block",
    wordBreak: "break-word"
  },
  modal: __spreadValues$h({
    position: "relative",
    width: fullScreen ? void 0 : theme.fn.size({ sizes: sizes$1, size: size2 }),
    borderRadius: fullScreen ? 0 : void 0,
    outline: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    marginTop: centered ? "auto" : void 0,
    marginBottom: centered ? "auto" : void 0,
    zIndex: 1,
    marginLeft: fullScreen ? void 0 : "calc(var(--removed-scroll-width, 0px) * -1)"
  }, getFullScreenStyles(fullScreen)),
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    marginRight: -9
  },
  body: {
    maxHeight: overflow === "inside" ? "calc(100vh - 185px)" : null,
    overflowY: overflow === "inside" ? "auto" : null,
    wordBreak: "break-word"
  }
}));
const useStyles$f = useStyles$e;
var __defProp$g = Object.defineProperty;
var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
var __hasOwnProp$g = Object.prototype.hasOwnProperty;
var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$g = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$g.call(b, prop))
      __defNormalProp$g(a, prop, b[prop]);
  if (__getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(b)) {
      if (__propIsEnum$g.call(b, prop))
        __defNormalProp$g(a, prop, b[prop]);
    }
  return a;
};
var __objRest$9 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$g)
    for (var prop of __getOwnPropSymbols$g(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$3 = {
  size: "md",
  transitionDuration: 250,
  overflow: "outside",
  padding: "lg",
  shadow: "lg",
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  withCloseButton: true,
  withinPortal: true,
  lockScroll: true,
  withFocusReturn: true,
  overlayBlur: 0,
  zIndex: getDefaultZIndex("modal")
};
function Modal(props) {
  const _a = useComponentDefaultProps("Modal", defaultProps$3, props), {
    className,
    opened,
    title,
    onClose,
    children,
    withCloseButton,
    overlayOpacity,
    size: size2,
    transitionDuration,
    closeButtonLabel,
    overlayColor,
    overflow,
    transition,
    padding,
    shadow,
    radius,
    id,
    classNames,
    styles,
    closeOnClickOutside,
    trapFocus,
    closeOnEscape: closeOnEscape2,
    centered,
    target,
    withinPortal,
    zIndex,
    overlayBlur,
    transitionTimingFunction,
    fullScreen,
    unstyled,
    lockScroll: shouldLockScroll,
    withFocusReturn
  } = _a, others = __objRest$9(_a, ["className", "opened", "title", "onClose", "children", "withCloseButton", "overlayOpacity", "size", "transitionDuration", "closeButtonLabel", "overlayColor", "overflow", "transition", "padding", "shadow", "radius", "id", "classNames", "styles", "closeOnClickOutside", "trapFocus", "closeOnEscape", "centered", "target", "withinPortal", "zIndex", "overlayBlur", "transitionTimingFunction", "fullScreen", "unstyled", "lockScroll", "withFocusReturn"]);
  const baseId = useId(id);
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const {
    classes,
    cx,
    theme
  } = useStyles$f({
    size: size2,
    overflow,
    centered,
    zIndex,
    fullScreen
  }, {
    unstyled,
    classNames,
    styles,
    name: "Modal"
  });
  const focusTrapRef = useFocusTrap(trapFocus && opened);
  const _overlayOpacity = typeof overlayOpacity === "number" ? overlayOpacity : theme.colorScheme === "dark" ? 0.85 : 0.75;
  const [, lockScroll] = useScrollLock();
  const closeOnEscapePress = (event) => {
    if (!trapFocus && event.key === "Escape" && closeOnEscape2) {
      onClose();
    }
  };
  react.exports.useEffect(() => {
    if (!trapFocus) {
      window.addEventListener("keydown", closeOnEscapePress);
      return () => window.removeEventListener("keydown", closeOnEscapePress);
    }
    return void 0;
  }, [trapFocus]);
  useFocusReturn({
    opened,
    shouldReturnFocus: trapFocus && withFocusReturn
  });
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    target,
    children: /* @__PURE__ */ jsx(GroupedTransition, {
      onExited: () => shouldLockScroll && lockScroll(false),
      onEntered: () => shouldLockScroll && lockScroll(true),
      mounted: opened,
      duration: transitionDuration,
      exitDuration: transitionDuration,
      timingFunction: transitionTimingFunction,
      transitions: {
        modal: {
          duration: transitionDuration,
          transition: transition || (fullScreen ? "fade" : "pop")
        },
        overlay: {
          duration: transitionDuration / 2,
          transition: "fade",
          timingFunction: "ease"
        }
      },
      children: (transitionStyles) => /* @__PURE__ */ jsx(Box, {
        ...__spreadValues$g({
          id: baseId,
          className: cx(classes.root, className)
        }, others),
        children: /* @__PURE__ */ jsxs("div", {
          className: classes.inner,
          onKeyDownCapture: (event) => {
            var _a2;
            const shouldTrigger = ((_a2 = event.target) == null ? void 0 : _a2.getAttribute("data-mantine-stop-propagation")) !== "true";
            shouldTrigger && event.key === "Escape" && closeOnEscape2 && onClose();
          },
          ref: focusTrapRef,
          children: [/* @__PURE__ */ jsxs(Paper, {
            className: classes.modal,
            shadow,
            p: padding,
            radius,
            role: "dialog",
            "aria-labelledby": titleId,
            "aria-describedby": bodyId,
            "aria-modal": true,
            tabIndex: -1,
            style: transitionStyles.modal,
            unstyled,
            children: [(title || withCloseButton) && /* @__PURE__ */ jsxs("div", {
              className: classes.header,
              children: [/* @__PURE__ */ jsx(Text, {
                id: titleId,
                className: classes.title,
                children: title
              }), withCloseButton && /* @__PURE__ */ jsx(CloseButton, {
                iconSize: 16,
                onClick: onClose,
                "aria-label": closeButtonLabel,
                className: classes.close
              })]
            }), /* @__PURE__ */ jsx("div", {
              id: bodyId,
              className: classes.body,
              children
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: transitionStyles.overlay,
            children: /* @__PURE__ */ jsx(Overlay, {
              className: classes.overlay,
              sx: {
                position: "fixed"
              },
              zIndex: 0,
              onMouseDown: () => closeOnClickOutside && onClose(),
              blur: overlayBlur,
              color: overlayColor || (theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.black),
              opacity: _overlayOpacity,
              unstyled
            })
          })]
        })
      })
    })
  });
}
Modal.displayName = "@mantine/core/Modal";
var __defProp$f = Object.defineProperty;
var __defProps$9 = Object.defineProperties;
var __getOwnPropDescs$9 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
var __hasOwnProp$f = Object.prototype.hasOwnProperty;
var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$f = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$f.call(b, prop))
      __defNormalProp$f(a, prop, b[prop]);
  if (__getOwnPropSymbols$f)
    for (var prop of __getOwnPropSymbols$f(b)) {
      if (__propIsEnum$f.call(b, prop))
        __defNormalProp$f(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$9 = (a, b) => __defProps$9(a, __getOwnPropDescs$9(b));
var useStyles$c = createStyles((theme, { color, variant, noWrap, childrenOffset, alignIcon }) => {
  const colors = theme.fn.variant({ variant, color });
  return {
    root: __spreadProps$9(__spreadValues$f({
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: `8px ${theme.spacing.sm}px`,
      userSelect: "none"
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$f({
        backgroundColor: colors.background,
        color: colors.color
      }, theme.fn.hover({ backgroundColor: colors.hover })),
      "&[data-disabled]": {
        opacity: 0.4,
        pointerEvents: "none"
      }
    }),
    icon: {
      marginRight: theme.spacing.sm,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: alignIcon === "center" ? "center" : "flex-start",
      paddingTop: alignIcon === "center" ? void 0 : 4
    },
    rightSection: {
      marginLeft: theme.spacing.sm,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: `transform 150ms ${theme.transitionTimingFunction}`,
      "&[data-rotate]": {
        transform: "rotate(90deg)"
      }
    },
    body: {
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: noWrap ? "nowrap" : void 0
    },
    label: {},
    description: {
      display: "block",
      "&[data-active]": {
        color: "inherit"
      }
    },
    children: {
      paddingLeft: theme.fn.size({ size: childrenOffset, sizes: theme.spacing })
    }
  };
});
const useStyles$d = useStyles$c;
var __defProp$e = Object.defineProperty;
var __getOwnPropSymbols$e = Object.getOwnPropertySymbols;
var __hasOwnProp$e = Object.prototype.hasOwnProperty;
var __propIsEnum$e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$e = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$e.call(b, prop))
      __defNormalProp$e(a, prop, b[prop]);
  if (__getOwnPropSymbols$e)
    for (var prop of __getOwnPropSymbols$e(b)) {
      if (__propIsEnum$e.call(b, prop))
        __defNormalProp$e(a, prop, b[prop]);
    }
  return a;
};
var __objRest$8 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$e.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$e)
    for (var prop of __getOwnPropSymbols$e(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$e.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$2 = {
  variant: "light",
  childrenOffset: "lg"
};
const _NavLink = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NavLink", defaultProps$2, props), {
    label,
    description,
    icon,
    rightSection,
    className,
    classNames,
    styles,
    unstyled,
    active,
    color,
    variant,
    noWrap,
    children,
    opened,
    defaultOpened,
    onChange,
    disableRightSectionRotation,
    childrenOffset,
    disabled,
    onClick
  } = _a, others = __objRest$8(_a, ["label", "description", "icon", "rightSection", "className", "classNames", "styles", "unstyled", "active", "color", "variant", "noWrap", "children", "opened", "defaultOpened", "onChange", "disableRightSectionRotation", "childrenOffset", "disabled", "onClick"]);
  const {
    classes,
    cx
  } = useStyles$d({
    color,
    variant,
    noWrap,
    childrenOffset,
    alignIcon: description ? "top" : "center"
  }, {
    name: "NavLink",
    classNames,
    styles,
    unstyled
  });
  const [_opened, setOpened] = useUncontrolled({
    value: opened,
    defaultValue: defaultOpened,
    finalValue: false,
    onChange
  });
  const withChildren = !!children;
  const handleClick = (event) => {
    if (withChildren) {
      event.preventDefault();
      onClick == null ? void 0 : onClick(event);
      setOpened(!_opened);
    } else {
      onClick == null ? void 0 : onClick(event);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs(UnstyledButton, {
      ...__spreadValues$e({
        ref,
        className: cx(classes.root, className),
        "data-active": active || void 0,
        onClick: handleClick,
        unstyled,
        "data-expanded": _opened || void 0,
        "data-disabled": disabled || void 0,
        disabled
      }, others),
      children: [icon && /* @__PURE__ */ jsx("span", {
        className: classes.icon,
        children: icon
      }), /* @__PURE__ */ jsxs("span", {
        className: classes.body,
        children: [/* @__PURE__ */ jsx(Text, {
          component: "span",
          size: "sm",
          className: classes.label,
          children: label
        }), /* @__PURE__ */ jsx(Text, {
          component: "span",
          color: "dimmed",
          size: "xs",
          "data-active": active || void 0,
          className: classes.description,
          children: description
        })]
      }), (withChildren || rightSection) && /* @__PURE__ */ jsx("span", {
        className: classes.rightSection,
        "data-rotate": _opened && !disableRightSectionRotation || void 0,
        children: withChildren ? rightSection || /* @__PURE__ */ jsx(ChevronIcon, {
          width: 14,
          height: 14,
          style: {
            transform: "rotate(-90deg)"
          }
        }) : rightSection
      })]
    }), /* @__PURE__ */ jsx(Collapse, {
      in: _opened,
      children: /* @__PURE__ */ jsx("div", {
        className: classes.children,
        children
      })
    })]
  });
});
_NavLink.displayName = "@mantine/core/NavLink";
const NavLink = createPolymorphicComponent(_NavLink);
var useStyles$a = createStyles((theme, { color, radius, withTitle }, getRef) => {
  const _radius = theme.fn.radius(radius);
  const topBottom = Math.min(Math.max(_radius / 1.2, 4), 30);
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    closeButton: theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    }),
    icon: {
      ref: getRef("icon"),
      boxSizing: "border-box",
      marginRight: theme.spacing.md,
      width: 28,
      height: 28,
      borderRadius: 28,
      display: "flex",
      flex: "none",
      alignItems: "center",
      justifyContent: "center",
      color: theme.white
    },
    withIcon: {
      paddingLeft: theme.spacing.xs,
      "&::before": {
        display: "none"
      }
    },
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      alignItems: "center",
      paddingLeft: 22,
      paddingRight: 5,
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
      borderRadius: _radius,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      boxShadow: theme.shadows.lg,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]}`,
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        width: 6,
        top: topBottom,
        bottom: topBottom,
        left: 4,
        borderRadius: _radius,
        backgroundColor: colors.background
      },
      [`& .${getRef("icon")}`]: {
        backgroundColor: colors.background,
        color: theme.white
      }
    },
    body: {
      flex: 1,
      overflow: "hidden",
      marginRight: 10
    },
    loader: {
      marginRight: theme.spacing.md
    },
    title: {
      lineHeight: 1.4,
      marginBottom: 2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: theme.colorScheme === "dark" ? theme.white : theme.colors.gray[9]
    },
    description: {
      color: withTitle ? theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6] : theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      lineHeight: 1.4,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  };
});
const useStyles$b = useStyles$a;
var __defProp$d = Object.defineProperty;
var __defProps$8 = Object.defineProperties;
var __getOwnPropDescs$8 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$d = Object.getOwnPropertySymbols;
var __hasOwnProp$d = Object.prototype.hasOwnProperty;
var __propIsEnum$d = Object.prototype.propertyIsEnumerable;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$d = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$d.call(b, prop))
      __defNormalProp$d(a, prop, b[prop]);
  if (__getOwnPropSymbols$d)
    for (var prop of __getOwnPropSymbols$d(b)) {
      if (__propIsEnum$d.call(b, prop))
        __defNormalProp$d(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$8 = (a, b) => __defProps$8(a, __getOwnPropDescs$8(b));
var __objRest$7 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$d.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$d)
    for (var prop of __getOwnPropSymbols$d(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$d.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Notification = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Notification", {}, props), {
    className,
    color,
    radius,
    loading,
    disallowClose,
    title,
    icon,
    children,
    onClose,
    closeButtonProps,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$7(_a, ["className", "color", "radius", "loading", "disallowClose", "title", "icon", "children", "onClose", "closeButtonProps", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$b({
    color,
    radius,
    withTitle: !!title
  }, {
    classNames,
    styles,
    unstyled,
    name: "Notification"
  });
  const withIcon = icon || loading;
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$d({
      className: cx(classes.root, {
        [classes.withIcon]: withIcon
      }, className),
      role: "alert",
      ref
    }, others),
    children: [icon && !loading && /* @__PURE__ */ jsx("div", {
      className: classes.icon,
      children: icon
    }), loading && /* @__PURE__ */ jsx(Loader, {
      size: 28,
      color,
      className: classes.loader
    }), /* @__PURE__ */ jsxs("div", {
      className: classes.body,
      children: [title && /* @__PURE__ */ jsx(Text, {
        className: classes.title,
        size: "sm",
        weight: 500,
        children: title
      }), /* @__PURE__ */ jsx(Text, {
        color: "dimmed",
        className: classes.description,
        size: "sm",
        children
      })]
    }), !disallowClose && /* @__PURE__ */ jsx(CloseButton, {
      ...__spreadProps$8(__spreadValues$d({}, closeButtonProps), {
        iconSize: 16,
        color: "gray",
        onClick: onClose,
        className: classes.closeButton
      })
    })]
  });
});
Notification.displayName = "@mantine/core/Notification";
var __defProp$c = Object.defineProperty;
var __defProps$7 = Object.defineProperties;
var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$c = Object.getOwnPropertySymbols;
var __hasOwnProp$c = Object.prototype.hasOwnProperty;
var __propIsEnum$c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$c = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$c.call(b, prop))
      __defNormalProp$c(a, prop, b[prop]);
  if (__getOwnPropSymbols$c)
    for (var prop of __getOwnPropSymbols$c(b)) {
      if (__propIsEnum$c.call(b, prop))
        __defNormalProp$c(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
const sizes = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40
};
var useStyles$8 = createStyles((theme, { color, size: size2, radius, gradient, variant }) => {
  const colors = theme.fn.variant({
    variant,
    color: color || theme.primaryColor,
    gradient,
    primaryFallback: false
  });
  const iconSize = theme.fn.size({ size: size2, sizes });
  return {
    root: __spreadProps$7(__spreadValues$c({}, theme.fn.fontStyles()), {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      width: iconSize,
      height: iconSize,
      minWidth: iconSize,
      minHeight: iconSize,
      borderRadius: theme.fn.radius(radius),
      backgroundColor: colors.background,
      color: colors.color,
      backgroundImage: variant === "gradient" ? colors.background : void 0,
      border: `${variant === "gradient" ? 0 : 1}px solid ${colors.border}`
    })
  };
});
const useStyles$9 = useStyles$8;
var __defProp$b = Object.defineProperty;
var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
var __hasOwnProp$b = Object.prototype.hasOwnProperty;
var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$b = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$b.call(b, prop))
      __defNormalProp$b(a, prop, b[prop]);
  if (__getOwnPropSymbols$b)
    for (var prop of __getOwnPropSymbols$b(b)) {
      if (__propIsEnum$b.call(b, prop))
        __defNormalProp$b(a, prop, b[prop]);
    }
  return a;
};
var __objRest$6 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$b.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$b)
    for (var prop of __getOwnPropSymbols$b(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$b.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$1 = {
  size: "md",
  variant: "filled",
  gradient: {
    from: "blue",
    to: "cyan",
    deg: 45
  }
};
const ThemeIcon = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ThemeIcon", defaultProps$1, props), {
    className,
    size: size2,
    radius,
    variant,
    color,
    children,
    gradient,
    unstyled
  } = _a, others = __objRest$6(_a, ["className", "size", "radius", "variant", "color", "children", "gradient", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$9({
    variant,
    radius,
    color,
    size: size2,
    gradient
  }, {
    name: "ThemeIcon",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$b({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
ThemeIcon.displayName = "@mantine/core/ThemeIcon";
const NotificationsContext = react.exports.createContext(null);
NotificationsContext.displayName = "@mantine/notifications/NotificationsContext";
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
const config = {
  disabled: false
};
const TransitionGroupContext = React.createContext(null);
var UNMOUNTED = "unmounted";
var EXITED = "exited";
var ENTERING = "entering";
var ENTERED = "entered";
var EXITING = "exiting";
var Transition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(Transition2, _React$Component);
  function Transition2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context;
    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;
    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }
    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }
  Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;
    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }
    return null;
  };
  var _proto = Transition2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;
    if (prevProps !== this.props) {
      var status = this.state.status;
      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }
    this.updateStatus(false, nextStatus);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };
  _proto.getTimeouts = function getTimeouts() {
    var timeout = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout;
    if (timeout != null && typeof timeout !== "number") {
      exit = timeout.exit;
      enter = timeout.enter;
      appear = timeout.appear !== void 0 ? timeout.appear : enter;
    }
    return {
      exit,
      enter,
      appear
    };
  };
  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }
    if (nextStatus !== null) {
      this.cancelNextCallback();
      if (nextStatus === ENTERING) {
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };
  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;
    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;
    var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    if (!mounting && !enter || config.disabled) {
      this.safeSetState({
        status: ENTERED
      }, function() {
        _this2.props.onEntered(maybeNode);
      });
      return;
    }
    this.props.onEnter(maybeNode, maybeAppearing);
    this.safeSetState({
      status: ENTERING
    }, function() {
      _this2.props.onEntering(maybeNode, maybeAppearing);
      _this2.onTransitionEnd(enterTimeout, function() {
        _this2.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  };
  _proto.performExit = function performExit() {
    var _this3 = this;
    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    var maybeNode = this.props.nodeRef ? void 0 : ReactDOM.findDOMNode(this);
    if (!exit || config.disabled) {
      this.safeSetState({
        status: EXITED
      }, function() {
        _this3.props.onExited(maybeNode);
      });
      return;
    }
    this.props.onExit(maybeNode);
    this.safeSetState({
      status: EXITING
    }, function() {
      _this3.props.onExiting(maybeNode);
      _this3.onTransitionEnd(timeouts.exit, function() {
        _this3.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
      });
    });
  };
  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };
  _proto.safeSetState = function safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };
  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;
    var active = true;
    this.nextCallback = function(event) {
      if (active) {
        active = false;
        _this4.nextCallback = null;
        callback(event);
      }
    };
    this.nextCallback.cancel = function() {
      active = false;
    };
    return this.nextCallback;
  };
  _proto.onTransitionEnd = function onTransitionEnd(timeout, handler) {
    this.setNextCallback(handler);
    var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
    var doesNotHaveTimeoutOrListener = timeout == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
      this.props.addEndListener(maybeNode, maybeNextCallback);
    }
    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  };
  _proto.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }
    var _this$props = this.props, children = _this$props.children;
    _this$props.in;
    _this$props.mountOnEnter;
    _this$props.unmountOnExit;
    _this$props.appear;
    _this$props.enter;
    _this$props.exit;
    _this$props.timeout;
    _this$props.addEndListener;
    _this$props.onEnter;
    _this$props.onEntering;
    _this$props.onEntered;
    _this$props.onExit;
    _this$props.onExiting;
    _this$props.onExited;
    _this$props.nodeRef;
    var childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
      value: null,
      children: typeof children === "function" ? children(status, childProps) : React.cloneElement(React.Children.only(children), childProps)
    });
  };
  return Transition2;
}(React.Component);
Transition.contextType = TransitionGroupContext;
Transition.propTypes = {};
function noop() {
}
Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;
const Transition$1 = Transition;
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function getChildMapping(children, mapFn) {
  var mapper = function mapper2(child) {
    return mapFn && react.exports.isValidElement(child) ? mapFn(child) : child;
  };
  var result = /* @__PURE__ */ Object.create(null);
  if (children)
    react.exports.Children.map(children, function(c) {
      return c;
    }).forEach(function(child) {
      result[child.key] = mapper(child);
    });
  return result;
}
function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};
  function getValueForKey(key) {
    return key in next ? next[key] : prev[key];
  }
  var nextKeysPending = /* @__PURE__ */ Object.create(null);
  var pendingKeys = [];
  for (var prevKey in prev) {
    if (prevKey in next) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }
  var i;
  var childMapping = {};
  for (var nextKey in next) {
    if (nextKeysPending[nextKey]) {
      for (i = 0; i < nextKeysPending[nextKey].length; i++) {
        var pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }
    childMapping[nextKey] = getValueForKey(nextKey);
  }
  for (i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }
  return childMapping;
}
function getProp(child, prop, props) {
  return props[prop] != null ? props[prop] : child.props[prop];
}
function getInitialChildMapping(props, onExited) {
  return getChildMapping(props.children, function(child) {
    return react.exports.cloneElement(child, {
      onExited: onExited.bind(null, child),
      in: true,
      appear: getProp(child, "appear", props),
      enter: getProp(child, "enter", props),
      exit: getProp(child, "exit", props)
    });
  });
}
function getNextChildMapping(nextProps, prevChildMapping, onExited) {
  var nextChildMapping = getChildMapping(nextProps.children);
  var children = mergeChildMappings(prevChildMapping, nextChildMapping);
  Object.keys(children).forEach(function(key) {
    var child = children[key];
    if (!react.exports.isValidElement(child))
      return;
    var hasPrev = key in prevChildMapping;
    var hasNext = key in nextChildMapping;
    var prevChild = prevChildMapping[key];
    var isLeaving = react.exports.isValidElement(prevChild) && !prevChild.props.in;
    if (hasNext && (!hasPrev || isLeaving)) {
      children[key] = react.exports.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        exit: getProp(child, "exit", nextProps),
        enter: getProp(child, "enter", nextProps)
      });
    } else if (!hasNext && hasPrev && !isLeaving) {
      children[key] = react.exports.cloneElement(child, {
        in: false
      });
    } else if (hasNext && hasPrev && react.exports.isValidElement(prevChild)) {
      children[key] = react.exports.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: prevChild.props.in,
        exit: getProp(child, "exit", nextProps),
        enter: getProp(child, "enter", nextProps)
      });
    }
  });
  return children;
}
var values = Object.values || function(obj) {
  return Object.keys(obj).map(function(k) {
    return obj[k];
  });
};
var defaultProps = {
  component: "div",
  childFactory: function childFactory(child) {
    return child;
  }
};
var TransitionGroup = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(TransitionGroup2, _React$Component);
  function TransitionGroup2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var handleExited = _this.handleExited.bind(_assertThisInitialized(_this));
    _this.state = {
      contextValue: {
        isMounting: true
      },
      handleExited,
      firstRender: true
    };
    return _this;
  }
  var _proto = TransitionGroup2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.mounted = true;
    this.setState({
      contextValue: {
        isMounting: false
      }
    });
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.mounted = false;
  };
  TransitionGroup2.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
    var prevChildMapping = _ref.children, handleExited = _ref.handleExited, firstRender = _ref.firstRender;
    return {
      children: firstRender ? getInitialChildMapping(nextProps, handleExited) : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false
    };
  };
  _proto.handleExited = function handleExited(child, node) {
    var currentChildMapping = getChildMapping(this.props.children);
    if (child.key in currentChildMapping)
      return;
    if (child.props.onExited) {
      child.props.onExited(node);
    }
    if (this.mounted) {
      this.setState(function(state) {
        var children = _extends({}, state.children);
        delete children[child.key];
        return {
          children
        };
      });
    }
  };
  _proto.render = function render() {
    var _this$props = this.props, Component = _this$props.component, childFactory2 = _this$props.childFactory, props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);
    var contextValue = this.state.contextValue;
    var children = values(this.state.children).map(childFactory2);
    delete props.appear;
    delete props.enter;
    delete props.exit;
    if (Component === null) {
      return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
        value: contextValue,
        children
      });
    }
    return /* @__PURE__ */ jsx(TransitionGroupContext.Provider, {
      value: contextValue,
      children: /* @__PURE__ */ jsx(Component, {
        ...props,
        children
      })
    });
  };
  return TransitionGroup2;
}(React.Component);
TransitionGroup.propTypes = {};
TransitionGroup.defaultProps = defaultProps;
const TransitionGroup$1 = TransitionGroup;
function dispatchEvent$1(type, detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}
const useIsomorphicEffect$1 = typeof window !== "undefined" ? react.exports.useLayoutEffect : react.exports.useEffect;
function createUseExternalEvents$1(prefix) {
  function _useExternalEvents(events) {
    const handlers = Object.keys(events).reduce((acc, eventKey) => {
      acc[`${prefix}:${eventKey}`] = (event) => events[eventKey](event.detail);
      return acc;
    }, {});
    useIsomorphicEffect$1(() => {
      Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
        window.addEventListener(eventKey, handlers[eventKey]);
      });
      return () => Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
      });
    }, []);
  }
  function createEvent2(event) {
    return (...payload) => dispatchEvent$1(`${prefix}:${String(event)}`, payload[0]);
  }
  return [_useExternalEvents, createEvent2];
}
const [useNotificationsEvents, createEvent$3] = createUseExternalEvents$1("mantine-notifications");
const showNotification = createEvent$3("show");
createEvent$3("hide");
createEvent$3("clean");
createEvent$3("cleanQueue");
createEvent$3("update");
function getPositionStyles([vertical, horizontal], containerWidth, spacing) {
  const styles = {};
  vertical === "top" && (styles.top = spacing);
  vertical === "bottom" && (styles.bottom = spacing);
  horizontal === "left" && (styles.left = spacing);
  horizontal === "right" && (styles.right = spacing);
  horizontal === "center" && (styles.left = "50%", styles.transform = "translateX(-50%)");
  return styles;
}
var __defProp$a = Object.defineProperty;
var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
var __hasOwnProp$a = Object.prototype.hasOwnProperty;
var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$a = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$a.call(b, prop))
      __defNormalProp$a(a, prop, b[prop]);
  if (__getOwnPropSymbols$a)
    for (var prop of __getOwnPropSymbols$a(b)) {
      if (__propIsEnum$a.call(b, prop))
        __defNormalProp$a(a, prop, b[prop]);
    }
  return a;
};
const transforms = {
  left: "translateX(-100%)",
  right: "translateX(100%)",
  "top-center": "translateY(-100%)",
  "bottom-center": "translateY(100%)"
};
const noTransform = {
  left: "translateX(0)",
  right: "translateX(0)",
  "top-center": "translateY(0)",
  "bottom-center": "translateY(0)"
};
function getNotificationStateStyles({
  state,
  maxHeight,
  positioning,
  transitionDuration
}) {
  const [vertical, horizontal] = positioning;
  const property = horizontal === "center" ? `${vertical}-center` : horizontal;
  const commonStyles = {
    opacity: 0,
    maxHeight,
    transform: transforms[property],
    transitionDuration: `${transitionDuration}ms, ${transitionDuration}ms, ${transitionDuration}ms`,
    transitionTimingFunction: "cubic-bezier(.51,.3,0,1.21), cubic-bezier(.51,.3,0,1.21), linear",
    transitionProperty: "opacity, transform, max-height"
  };
  const inState = {
    opacity: 1,
    transform: noTransform[property]
  };
  const outState = {
    opacity: 0,
    maxHeight: 0,
    transform: transforms[property]
  };
  const transitionStyles = {
    entering: inState,
    entered: inState,
    exiting: outState,
    exited: outState
  };
  return __spreadValues$a(__spreadValues$a({}, commonStyles), transitionStyles[state]);
}
function getAutoClose(autoClose, notificationAutoClose) {
  if (typeof notificationAutoClose === "number") {
    return notificationAutoClose;
  }
  if (notificationAutoClose === false || autoClose === false) {
    return false;
  }
  return autoClose;
}
var __defProp$9 = Object.defineProperty;
var __defProps$6 = Object.defineProperties;
var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$9 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$9.call(b, prop))
      __defNormalProp$9(a, prop, b[prop]);
  if (__getOwnPropSymbols$9)
    for (var prop of __getOwnPropSymbols$9(b)) {
      if (__propIsEnum$9.call(b, prop))
        __defNormalProp$9(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$9.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$9)
    for (var prop of __getOwnPropSymbols$9(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$9.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function NotificationContainer(_a) {
  var _b = _a, {
    notification,
    autoClose,
    onHide,
    innerRef
  } = _b, others = __objRest$5(_b, ["notification", "autoClose", "onHide", "innerRef"]);
  const _a2 = notification, {
    autoClose: notificationAutoClose,
    message
  } = _a2, notificationProps = __objRest$5(_a2, ["autoClose", "message"]);
  const autoCloseTimeout = getAutoClose(autoClose, notificationAutoClose);
  const hideTimeout = react.exports.useRef();
  const handleHide = () => {
    onHide(notification.id);
    window.clearTimeout(hideTimeout.current);
  };
  const cancelDelayedHide = () => {
    clearTimeout(hideTimeout.current);
  };
  const handleDelayedHide = () => {
    if (typeof autoCloseTimeout === "number") {
      hideTimeout.current = window.setTimeout(handleHide, autoCloseTimeout);
    }
  };
  react.exports.useEffect(() => {
    if (typeof notification.onOpen === "function") {
      notification.onOpen(notification);
    }
  }, []);
  react.exports.useEffect(() => {
    handleDelayedHide();
    return cancelDelayedHide;
  }, [autoClose, notification.autoClose]);
  return /* @__PURE__ */ jsx(Notification, {
    ...__spreadProps$6(__spreadValues$9(__spreadValues$9({}, notificationProps), others), {
      onClose: handleHide,
      onMouseEnter: cancelDelayedHide,
      onMouseLeave: handleDelayedHide,
      ref: innerRef
    }),
    children: message
  });
}
NotificationContainer.displayName = "@mantine/notifications/NotificationContainer";
var useStyles$6 = createStyles((theme, { zIndex }) => ({
  notifications: {
    width: `calc(100% - ${theme.spacing.md * 2}px)`,
    boxSizing: "border-box",
    position: "fixed",
    zIndex
  },
  notification: {
    "&:not(:first-of-type)": {
      marginTop: theme.spacing.sm
    }
  }
}));
const useStyles$7 = useStyles$6;
var __defProp$8 = Object.defineProperty;
var __defProps$5 = Object.defineProperties;
var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$8 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$8.call(b, prop))
      __defNormalProp$8(a, prop, b[prop]);
  if (__getOwnPropSymbols$8)
    for (var prop of __getOwnPropSymbols$8(b)) {
      if (__propIsEnum$8.call(b, prop))
        __defNormalProp$8(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
function useNotificationsState({ limit }) {
  const { state, queue, update, cleanQueue } = useQueue({
    initialValues: [],
    limit
  });
  const showNotification2 = (notification) => {
    const id = notification.id || randomId();
    update((notifications) => {
      if (notification.id && notifications.some((n) => n.id === notification.id)) {
        return notifications;
      }
      return [...notifications, __spreadProps$5(__spreadValues$8({}, notification), { id })];
    });
    return id;
  };
  const updateNotification = (notification) => update((notifications) => {
    const index = notifications.findIndex((n) => n.id === notification.id);
    if (index === -1) {
      return notifications;
    }
    const newNotifications = [...notifications];
    newNotifications[index] = notification;
    return newNotifications;
  });
  const hideNotification = (id) => update((notifications) => notifications.filter((notification) => {
    if (notification.id === id) {
      typeof notification.onClose === "function" && notification.onClose(notification);
      return false;
    }
    return true;
  }));
  const clean = () => update(() => []);
  return {
    notifications: state,
    queue,
    showNotification: showNotification2,
    updateNotification,
    hideNotification,
    cleanQueue,
    clean
  };
}
var __defProp$7 = Object.defineProperty;
var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$7 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$7.call(b, prop))
      __defNormalProp$7(a, prop, b[prop]);
  if (__getOwnPropSymbols$7)
    for (var prop of __getOwnPropSymbols$7(b)) {
      if (__propIsEnum$7.call(b, prop))
        __defNormalProp$7(a, prop, b[prop]);
    }
  return a;
};
var __objRest$4 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$7)
    for (var prop of __getOwnPropSymbols$7(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const POSITIONS = ["top-left", "top-right", "top-center", "bottom-left", "bottom-right", "bottom-center"];
function NotificationsProvider(_a) {
  var _b = _a, {
    className,
    position = "bottom-right",
    autoClose = 4e3,
    transitionDuration = 250,
    containerWidth = 440,
    notificationMaxHeight = 200,
    limit = 5,
    zIndex = getDefaultZIndex("overlay"),
    style,
    children,
    target
  } = _b, others = __objRest$4(_b, ["className", "position", "autoClose", "transitionDuration", "containerWidth", "notificationMaxHeight", "limit", "zIndex", "style", "children", "target"]);
  const forceUpdate = useForceUpdate();
  const refs = react.exports.useRef({});
  const previousLength = react.exports.useRef(0);
  const {
    notifications,
    queue,
    showNotification: showNotification2,
    updateNotification,
    hideNotification,
    clean,
    cleanQueue
  } = useNotificationsState({
    limit
  });
  const {
    classes,
    cx,
    theme
  } = useStyles$7({
    zIndex
  });
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const duration = reduceMotion ? 1 : transitionDuration;
  const positioning = (POSITIONS.includes(position) ? position : "bottom-right").split("-");
  useDidUpdate(() => {
    if (notifications.length > previousLength.current) {
      setTimeout(() => forceUpdate(), 0);
    }
    previousLength.current = notifications.length;
  }, [notifications]);
  useNotificationsEvents({
    show: showNotification2,
    hide: hideNotification,
    update: updateNotification,
    clean,
    cleanQueue
  });
  const items = notifications.map((notification) => /* @__PURE__ */ jsx(Transition$1, {
    timeout: duration,
    onEnter: () => refs.current[notification.id].offsetHeight,
    nodeRef: {
      current: refs.current[notification.id]
    },
    children: (state) => /* @__PURE__ */ jsx(NotificationContainer, {
      innerRef: (node) => {
        refs.current[notification.id] = node;
      },
      notification,
      onHide: hideNotification,
      className: classes.notification,
      autoClose,
      sx: [__spreadValues$7({}, getNotificationStateStyles({
        state,
        positioning,
        transitionDuration: duration,
        maxHeight: notificationMaxHeight
      })), ...Array.isArray(notification.sx) ? notification.sx : [notification.sx]]
    })
  }, notification.id));
  return /* @__PURE__ */ jsxs(NotificationsContext.Provider, {
    value: {
      notifications,
      queue
    },
    children: [/* @__PURE__ */ jsx(Portal, {
      target,
      children: /* @__PURE__ */ jsx(Box, {
        ...__spreadValues$7({
          className: cx(classes.notifications, className),
          style,
          sx: __spreadValues$7({
            maxWidth: containerWidth
          }, getPositionStyles(positioning, containerWidth, theme.spacing.md))
        }, others),
        children: /* @__PURE__ */ jsx(TransitionGroup$1, {
          children: items
        })
      })
    }), children]
  });
}
NotificationsProvider.displayName = "@mantine/notifications/NotificationsProvider";
const isDark = () => useMantineTheme().colorScheme === "dark";
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
function errorMsg(params) {
  log.error(params.error);
  showNotification({
    ...params,
    message: String(params.error),
    autoClose: 7e3,
    title: "Error",
    color: "red"
  });
}
function successMsg(params) {
  log.debug(params.message);
  showNotification({
    ...params,
    autoClose: 4e3,
    title: "Success",
    color: "green"
  });
}
const ModalsContext = react.exports.createContext(null);
ModalsContext.displayName = "@mantine/modals/ModalsContext";
function useModals() {
  const ctx = react.exports.useContext(ModalsContext);
  if (!ctx) {
    throw new Error("[@mantine/modals] useModals hook was called outside of context, wrap your app with ModalsProvider component");
  }
  return ctx;
}
var __defProp$6 = Object.defineProperty;
var __defProps$4 = Object.defineProperties;
var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$6 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$6.call(b, prop))
      __defNormalProp$6(a, prop, b[prop]);
  if (__getOwnPropSymbols$6)
    for (var prop of __getOwnPropSymbols$6(b)) {
      if (__propIsEnum$6.call(b, prop))
        __defNormalProp$6(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
function ConfirmModal({
  id,
  cancelProps,
  confirmProps,
  labels = {
    cancel: "",
    confirm: ""
  },
  closeOnConfirm = true,
  closeOnCancel = true,
  groupProps,
  onCancel,
  onConfirm,
  children
}) {
  const {
    cancel: cancelLabel,
    confirm: confirmLabel
  } = labels;
  const ctx = useModals();
  const handleCancel = (event) => {
    typeof (cancelProps == null ? void 0 : cancelProps.onClick) === "function" && (cancelProps == null ? void 0 : cancelProps.onClick(event));
    typeof onCancel === "function" && onCancel();
    closeOnCancel && ctx.closeModal(id);
  };
  const handleConfirm = (event) => {
    typeof (confirmProps == null ? void 0 : confirmProps.onClick) === "function" && (confirmProps == null ? void 0 : confirmProps.onClick(event));
    typeof onConfirm === "function" && onConfirm();
    closeOnConfirm && ctx.closeModal(id);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [children && /* @__PURE__ */ jsx(Box, {
      mb: "md",
      children
    }), /* @__PURE__ */ jsxs(Group, {
      ...__spreadValues$6({
        position: "right"
      }, groupProps),
      children: [/* @__PURE__ */ jsx(Button, {
        ...__spreadProps$4(__spreadValues$6({
          variant: "default"
        }, cancelProps), {
          onClick: handleCancel
        }),
        children: (cancelProps == null ? void 0 : cancelProps.children) || cancelLabel
      }), /* @__PURE__ */ jsx(Button, {
        ...__spreadProps$4(__spreadValues$6({}, confirmProps), {
          onClick: handleConfirm
        }),
        children: (confirmProps == null ? void 0 : confirmProps.children) || confirmLabel
      })]
    })]
  });
}
function modalsReducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      return {
        current: action.payload,
        modals: [...state.modals, action.payload]
      };
    }
    case "CLOSE": {
      return {
        current: state.modals[state.modals.length - 2] || null,
        modals: state.modals.filter((m) => m.id !== action.payload)
      };
    }
    case "CLOSE_ALL": {
      return {
        current: state.current,
        modals: []
      };
    }
    default: {
      return state;
    }
  }
}
const [useModalsEvents, createEvent$2] = createUseExternalEvents$2("mantine-modals");
createEvent$2("openModal");
createEvent$2("closeModal");
createEvent$2("closeAllModals");
createEvent$2("openConfirmModal");
createEvent$2("openContextModal");
var __defProp$5 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$5 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$5.call(b, prop))
      __defNormalProp$5(a, prop, b[prop]);
  if (__getOwnPropSymbols$5)
    for (var prop of __getOwnPropSymbols$5(b)) {
      if (__propIsEnum$5.call(b, prop))
        __defNormalProp$5(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
var __objRest$3 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$5.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$5)
    for (var prop of __getOwnPropSymbols$5(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$5.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function separateConfirmModalProps(props) {
  if (!props) {
    return {
      confirmProps: {},
      modalProps: {}
    };
  }
  const _a = props, {
    id,
    children,
    onCancel,
    onConfirm,
    closeOnConfirm,
    closeOnCancel,
    cancelProps,
    confirmProps,
    groupProps,
    labels
  } = _a, others = __objRest$3(_a, ["id", "children", "onCancel", "onConfirm", "closeOnConfirm", "closeOnCancel", "cancelProps", "confirmProps", "groupProps", "labels"]);
  return {
    confirmProps: {
      id,
      children,
      onCancel,
      onConfirm,
      closeOnConfirm,
      closeOnCancel,
      cancelProps,
      confirmProps,
      groupProps,
      labels
    },
    modalProps: __spreadValues$5({
      id
    }, others)
  };
}
function ModalsProvider({
  children,
  modalProps,
  labels,
  modals
}) {
  const [state, dispatch] = react.exports.useReducer(modalsReducer, {
    modals: [],
    current: null
  });
  const closeAll = (canceled) => {
    state.modals.forEach((modal) => {
      var _a, _b, _c, _d;
      if (modal.type === "confirm" && canceled) {
        (_b = (_a = modal.props) == null ? void 0 : _a.onCancel) == null ? void 0 : _b.call(_a);
      }
      (_d = (_c = modal.props) == null ? void 0 : _c.onClose) == null ? void 0 : _d.call(_c);
    });
    dispatch({
      type: "CLOSE_ALL"
    });
  };
  const openModal = (_a) => {
    var _b = _a, {
      modalId
    } = _b, props = __objRest$3(_b, ["modalId"]);
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "content",
        props
      }
    });
    return id;
  };
  const openConfirmModal = (_c) => {
    var _d = _c, {
      modalId
    } = _d, props = __objRest$3(_d, ["modalId"]);
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "confirm",
        props
      }
    });
    return id;
  };
  const openContextModal = (modal, _e) => {
    var _f = _e, {
      modalId
    } = _f, props = __objRest$3(_f, ["modalId"]);
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "context",
        props,
        ctx: modal
      }
    });
    return id;
  };
  const closeModal = (id, canceled) => {
    var _a, _b, _c, _d;
    if (state.modals.length <= 1) {
      closeAll(canceled);
      return;
    }
    const modal = state.modals.find((item) => item.id === id);
    if ((modal == null ? void 0 : modal.type) === "confirm" && canceled) {
      (_b = (_a = modal.props) == null ? void 0 : _a.onCancel) == null ? void 0 : _b.call(_a);
    }
    (_d = (_c = modal == null ? void 0 : modal.props) == null ? void 0 : _c.onClose) == null ? void 0 : _d.call(_c);
    dispatch({
      type: "CLOSE",
      payload: modal.id
    });
  };
  useModalsEvents({
    openModal,
    openConfirmModal,
    openContextModal: (_g) => {
      var _h = _g, {
        modal
      } = _h, payload = __objRest$3(_h, ["modal"]);
      return openContextModal(modal, payload);
    },
    closeModal,
    closeAllModals: closeAll
  });
  const ctx = {
    modals: state.modals,
    openModal,
    openConfirmModal,
    openContextModal,
    closeModal,
    closeAll
  };
  const getCurrentModal = () => {
    var _a;
    switch ((_a = state.current) == null ? void 0 : _a.type) {
      case "context": {
        const _b = state.current.props, {
          innerProps
        } = _b, rest = __objRest$3(_b, ["innerProps"]);
        const ContextModal = modals[state.current.ctx];
        return {
          modalProps: rest,
          content: /* @__PURE__ */ jsx(ContextModal, {
            innerProps,
            context: ctx,
            id: state.current.id
          })
        };
      }
      case "confirm": {
        const {
          modalProps: separatedModalProps,
          confirmProps: separatedConfirmProps
        } = separateConfirmModalProps(state.current.props);
        return {
          modalProps: separatedModalProps,
          content: /* @__PURE__ */ jsx(ConfirmModal, {
            ...__spreadProps$3(__spreadValues$5({}, separatedConfirmProps), {
              id: state.current.id,
              labels: state.current.props.labels || labels
            })
          })
        };
      }
      case "content": {
        const _c = state.current.props, {
          children: currentModalChildren
        } = _c, rest = __objRest$3(_c, ["children"]);
        return {
          modalProps: rest,
          content: /* @__PURE__ */ jsx(Fragment, {
            children: currentModalChildren
          })
        };
      }
      default: {
        return {
          modalProps: {},
          content: null
        };
      }
    }
  };
  const {
    modalProps: currentModalProps,
    content
  } = getCurrentModal();
  return /* @__PURE__ */ jsxs(ModalsContext.Provider, {
    value: ctx,
    children: [/* @__PURE__ */ jsx(Modal, {
      ...__spreadProps$3(__spreadValues$5(__spreadValues$5({}, modalProps), currentModalProps), {
        opened: state.modals.length > 0,
        onClose: () => closeModal(state.current.id)
      }),
      children: content
    }), children]
  });
}
const [useNavigationProgressEvents, createEvent$1] = createUseExternalEvents$2("mantine-nprogress");
const startNavigationProgress = createEvent$1("start");
const stopNavigationProgress = createEvent$1("stop");
const resetNavigationProgress = createEvent$1("reset");
const setNavigationProgress = createEvent$1("set");
createEvent$1("increment");
createEvent$1("decrement");
function NavigationProgress({
  initialProgress = 0,
  color,
  size: size2 = 3,
  stepInterval = 500,
  transitionDuration = 300,
  exitTimeout = 500,
  exitTransitionDuration = 400,
  onFinish,
  autoReset = false,
  withinPortal = true,
  zIndex = getDefaultZIndex("max")
}) {
  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reducedMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const [_progress, setProgress] = react.exports.useState(initialProgress);
  const [mounted, setMounted] = react.exports.useState(true);
  const [unmountProgress, setUnmountProgress] = react.exports.useState(false);
  const resetRef = react.exports.useRef();
  const unmountRef = react.exports.useRef();
  const interval = useInterval(() => {
    setProgress((amount) => {
      let next = 0;
      if (amount >= 0 && amount <= 20) {
        next = 10;
      } else if (amount >= 20 && amount <= 50) {
        next = 4;
      } else if (amount >= 50 && amount <= 80) {
        next = 2;
      } else if (amount >= 80 && amount <= 99) {
        next = 0.5;
      }
      return amount + next;
    });
  }, stepInterval);
  const set = (value) => setProgress(value);
  const increment = (value) => setProgress((c) => Math.min(c + value, 100));
  const decrement = (value) => setProgress((c) => Math.max(c - value, 0));
  const start = () => {
    interval.stop();
    interval.start();
  };
  const stop = () => interval.stop();
  const reset = () => {
    setUnmountProgress(true);
    stop();
    setProgress(0);
    window.setTimeout(() => setUnmountProgress(false), 0);
  };
  const cancelUnmount = () => {
    if (unmountRef.current) {
      window.clearTimeout(unmountRef.current);
      unmountRef.current = null;
    }
    if (resetRef.current) {
      window.clearTimeout(resetRef.current);
      resetRef.current = null;
    }
    setMounted(true);
  };
  useDidUpdate(() => {
    if (_progress >= 100) {
      stop();
      onFinish == null ? void 0 : onFinish();
      unmountRef.current = window.setTimeout(() => {
        unmountRef.current = null;
        setMounted(false);
        if (autoReset) {
          resetRef.current = window.setTimeout(() => {
            resetRef.current = null;
            reset();
          }, reducedMotion ? 0 : exitTransitionDuration);
        }
      }, exitTimeout);
    } else if (!mounted) {
      cancelUnmount();
    }
  }, [_progress]);
  useNavigationProgressEvents({
    start,
    stop,
    set,
    increment,
    decrement,
    reset
  });
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    children: !unmountProgress && /* @__PURE__ */ jsx(Progress, {
      radius: 0,
      value: _progress,
      size: size2,
      color,
      styles: {
        root: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex,
          backgroundColor: "transparent",
          transitionProperty: "opacity",
          transitionTimingFunction: theme.transitionTimingFunction,
          transitionDuration: `${reducedMotion || _progress !== 100 ? 0 : exitTransitionDuration}ms`,
          opacity: mounted ? 1 : 0
        },
        bar: {
          position: "relative",
          transitionProperty: "width",
          transitionTimingFunction: theme.transitionTimingFunction,
          transitionDuration: `${reducedMotion || !mounted ? 0 : transitionDuration}ms`
        }
      }
    })
  });
}
const SpotlightContext = react.exports.createContext(null);
var __defProp$4 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$4(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
function prepareAction(action) {
  return __spreadProps$2(__spreadValues$4({}, action), { id: action.id || randomId() });
}
function filterDuplicateActions(actions) {
  const ids = [];
  return actions.reduceRight((acc, action) => {
    if (!ids.includes(action.id)) {
      ids.push(action.id);
      acc.push(action);
    }
    return acc;
  }, []).reverse();
}
function prepareActions(initialActions) {
  return filterDuplicateActions(initialActions.map((action) => prepareAction(action)));
}
function useActionsState(initialActions, query) {
  const [actions, setActions] = react.exports.useState(prepareActions(typeof initialActions === "function" ? initialActions(query) : initialActions));
  react.exports.useEffect(() => {
    if (typeof initialActions === "function") {
      setActions(prepareActions(initialActions(query)));
    }
  }, [query]);
  const updateActions = (payload) => setActions(prepareActions(typeof payload === "function" ? payload(query) : payload));
  const registerActions = (payload) => setActions((current) => prepareActions([...current, ...payload]));
  const removeActions = (ids) => setActions((current) => current.filter((action) => !ids.includes(action.id)));
  const triggerAction = (id) => {
    var _a;
    const action = actions.find((item) => item.id === id);
    (_a = action == null ? void 0 : action.onTrigger) == null ? void 0 : _a.call(action, action);
  };
  return [
    actions,
    {
      registerActions,
      updateActions,
      removeActions,
      triggerAction
    }
  ];
}
function getHotkeysPayload(shortcuts, onToggle) {
  if (shortcuts === null) {
    return [];
  }
  if (Array.isArray(shortcuts)) {
    return shortcuts.map((shortcut) => [shortcut, onToggle]);
  }
  return [[shortcuts, onToggle]];
}
function useSpotlightShortcuts(shortcuts, onToggle) {
  useHotkeys(getHotkeysPayload(shortcuts, onToggle));
}
function groupOptions({ data }) {
  const sortedData = [];
  const unGroupedData = [];
  const groupedData = data.reduce((acc, item, index) => {
    if (item.group) {
      if (acc[item.group])
        acc[item.group].push(index);
      else
        acc[item.group] = [index];
    } else {
      unGroupedData.push(index);
    }
    return acc;
  }, {});
  Object.keys(groupedData).forEach((groupName) => {
    sortedData.push(...groupedData[groupName].map((index) => data[index]));
  });
  sortedData.push(...unGroupedData.map((itemIndex) => data[itemIndex]));
  return sortedData;
}
function getGroupedOptions(data) {
  const sorted = groupOptions({ data });
  const unGrouped = [];
  const grouped = [];
  let groupName = null;
  sorted.forEach((item, index) => {
    if (!item.group) {
      unGrouped.push({ type: "item", item, index });
    } else {
      if (groupName !== item.group) {
        groupName = item.group;
        grouped.push({ type: "label", label: groupName });
      }
      grouped.push({ type: "item", item, index });
    }
  });
  return {
    grouped,
    unGrouped,
    items: [...grouped, ...unGrouped],
    hasItems: grouped.length > 0 || unGrouped.length > 0
  };
}
function dispatchEvent(type, detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}
const useIsomorphicEffect = typeof window !== "undefined" ? react.exports.useLayoutEffect : react.exports.useEffect;
function createUseExternalEvents(prefix) {
  function _useExternalEvents(events) {
    const handlers = Object.keys(events).reduce((acc, eventKey) => {
      acc[`${prefix}:${eventKey}`] = (event) => events[eventKey](event.detail);
      return acc;
    }, {});
    useIsomorphicEffect(() => {
      Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
        window.addEventListener(eventKey, handlers[eventKey]);
      });
      return () => Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
      });
    }, []);
  }
  function createEvent2(event) {
    return (...payload) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
  }
  return [_useExternalEvents, createEvent2];
}
var useStyles$4 = createStyles((theme, { radius }) => ({
  action: {
    position: "relative",
    display: "block",
    width: "100%",
    padding: "10px 12px",
    borderRadius: theme.fn.radius(radius)
  },
  actionHovered: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
  },
  actionIcon: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6]
  },
  actionBody: {
    flex: 1
  }
}));
const useStyles$5 = useStyles$4;
var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$3.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$3.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function DefaultAction(_a) {
  var _b = _a, {
    action,
    styles,
    classNames,
    hovered,
    onTrigger,
    highlightQuery,
    highlightColor,
    query,
    radius
  } = _b, others = __objRest$2(_b, ["action", "styles", "classNames", "hovered", "onTrigger", "highlightQuery", "highlightColor", "query", "radius"]);
  const {
    classes,
    cx
  } = useStyles$5({
    radius
  }, {
    styles,
    classNames,
    name: "Spotlight"
  });
  return /* @__PURE__ */ jsx(UnstyledButton, {
    ...__spreadValues$3({
      className: cx(classes.action, {
        [classes.actionHovered]: hovered
      }),
      tabIndex: -1,
      onMouseDown: (event) => event.preventDefault(),
      onClick: onTrigger
    }, others),
    children: /* @__PURE__ */ jsxs(Group, {
      noWrap: true,
      children: [action.icon && /* @__PURE__ */ jsx(Center, {
        className: classes.actionIcon,
        children: action.icon
      }), /* @__PURE__ */ jsxs("div", {
        className: classes.actionBody,
        children: [/* @__PURE__ */ jsx(Highlight, {
          highlightColor,
          highlight: highlightQuery ? query : null,
          children: action.title
        }), action.description && /* @__PURE__ */ jsx(Text, {
          color: "dimmed",
          size: "xs",
          children: action.description
        })]
      })]
    })
  });
}
DefaultAction.displayName = "@mantine/spotlight/DefaultAction";
var useStyles$2 = createStyles((theme) => ({
  nothingFound: {},
  actions: {
    padding: `calc(${theme.spacing.xs}px / 2)`,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
  },
  actionsGroup: {
    textTransform: "uppercase",
    fontSize: theme.spacing.xs,
    fontWeight: 700,
    padding: "10px 12px",
    paddingBottom: 0,
    paddingTop: 15
  }
}));
const useStyles$3 = useStyles$2;
function ActionsList({
  actions,
  styles,
  classNames,
  actionComponent: Action,
  hovered,
  onActionHover,
  onActionTrigger,
  query,
  nothingFoundMessage,
  highlightQuery,
  highlightColor,
  radius
}) {
  const {
    classes
  } = useStyles$3(null, {
    classNames,
    styles,
    name: "Spotlight"
  });
  const items = actions.map((item) => {
    if (item.type === "item") {
      return /* @__PURE__ */ jsx(Action, {
        query,
        action: item.item,
        hovered: item.index === hovered,
        onMouseEnter: () => onActionHover(item.index),
        classNames,
        styles,
        radius,
        onTrigger: () => onActionTrigger(item.item),
        highlightQuery,
        highlightColor
      }, item.item.id);
    }
    return /* @__PURE__ */ jsx(Text, {
      className: classes.actionsGroup,
      color: "dimmed",
      children: item.label
    }, item.label);
  });
  const shouldRenderActions = items.length > 0 || !!nothingFoundMessage && query.trim().length > 0;
  return /* @__PURE__ */ jsx(Fragment, {
    children: shouldRenderActions && /* @__PURE__ */ jsx("div", {
      className: classes.actions,
      children: items.length > 0 ? items : /* @__PURE__ */ jsx(Text, {
        color: "dimmed",
        className: classes.nothingFound,
        align: "center",
        size: "lg",
        py: "md",
        children: nothingFoundMessage
      })
    })
  });
}
ActionsList.displayName = "@mantine/spotlight/ActionsList";
function getKeywords(keywords) {
  if (Array.isArray(keywords)) {
    return keywords.map((keyword) => keyword.trim()).join(",").toLowerCase().trim();
  }
  if (typeof keywords === "string") {
    return keywords.toLowerCase().trim();
  }
  return "";
}
function filterActions(_query, actions) {
  const query = _query.trim().toLowerCase();
  const priorityMatrix = [[], []];
  actions.forEach((action) => {
    var _a, _b;
    if ((_a = action.title) == null ? void 0 : _a.toLowerCase().includes(query)) {
      priorityMatrix[0].push(action);
    } else if (((_b = action.description) == null ? void 0 : _b.toLowerCase().includes(query)) || getKeywords(action.keywords).includes(query)) {
      priorityMatrix[1].push(action);
    }
  });
  return priorityMatrix.flat();
}
var __defProp$2 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
var useStyles = createStyles((theme, { centered, maxWidth, topOffset, radius, zIndex }) => ({
  root: __spreadProps$1(__spreadValues$2({}, theme.fn.cover()), {
    position: "fixed",
    zIndex
  }),
  spotlight: {
    position: "relative",
    zIndex: 2,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.fn.radius(radius),
    width: "100%",
    maxWidth,
    overflow: "hidden",
    marginLeft: "calc(var(--removed-scroll-width, 0px) * -1)"
  },
  overlay: __spreadProps$1(__spreadValues$2({}, theme.fn.cover()), {
    position: "fixed"
  }),
  inner: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingTop: centered ? theme.spacing.md : topOffset,
    justifyContent: centered ? "center" : "flex-start",
    alignItems: "center"
  },
  searchInput: {
    border: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
  }
}));
const useStyles$1 = useStyles;
var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function Spotlight(_a) {
  var _b = _a, {
    query,
    onQueryChange,
    actions,
    onClose,
    opened,
    withinPortal,
    transition = "pop",
    transitionDuration,
    classNames,
    styles,
    overlayColor = "#000",
    overlayOpacity = 0.25,
    overlayBlur = 3,
    shadow = "md",
    radius = "sm",
    centered = false,
    closeOnActionTrigger = true,
    highlightQuery = false,
    highlightColor,
    maxWidth = 600,
    topOffset = 120,
    className,
    searchPlaceholder,
    searchIcon,
    filter = filterActions,
    nothingFoundMessage,
    limit = 10,
    actionComponent = DefaultAction,
    actionsWrapperComponent: ActionsWrapper = "div",
    zIndex = getDefaultZIndex("max"),
    searchInputProps
  } = _b, others = __objRest$1(_b, ["query", "onQueryChange", "actions", "onClose", "opened", "withinPortal", "transition", "transitionDuration", "classNames", "styles", "overlayColor", "overlayOpacity", "overlayBlur", "shadow", "radius", "centered", "closeOnActionTrigger", "highlightQuery", "highlightColor", "maxWidth", "topOffset", "className", "searchPlaceholder", "searchIcon", "filter", "nothingFoundMessage", "limit", "actionComponent", "actionsWrapperComponent", "zIndex", "searchInputProps"]);
  const [hovered, setHovered] = react.exports.useState(-1);
  const [IMEOpen, setIMEOpen] = react.exports.useState(false);
  const {
    classes,
    cx
  } = useStyles$1({
    centered,
    maxWidth,
    topOffset,
    radius,
    zIndex
  }, {
    classNames,
    styles,
    name: "Spotlight"
  });
  const [, lockScroll] = useScrollLock();
  const focusTrapRef = useFocusTrap(opened);
  const resetHovered = () => setHovered(-1);
  const handleClose = () => {
    resetHovered();
    onClose();
  };
  useFocusReturn({
    opened
  });
  const filteredActions = filter(query, actions).slice(0, limit);
  const groupedWithLabels = getGroupedOptions(filteredActions).items;
  const groupedActions = groupedWithLabels.map((item) => item.type === "item" ? item.item : void 0).filter((item) => item);
  useDidUpdate(() => {
    if (groupedActions.length - 1 < hovered) {
      setHovered(groupedActions.length - 1);
    }
  }, [groupedActions.length]);
  const handleInputKeyDown = (event) => {
    var _a2, _b2;
    if (IMEOpen) {
      return;
    }
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setHovered((current) => current < groupedActions.length - 1 ? current + 1 : 0);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setHovered((current) => current > 0 ? current - 1 : groupedActions.length - 1);
        break;
      }
      case "Enter": {
        event.preventDefault();
        const action = groupedActions[hovered];
        (_a2 = action == null ? void 0 : action.onTrigger) == null ? void 0 : _a2.call(action, action);
        if (((_b2 = action == null ? void 0 : action.closeOnTrigger) != null ? _b2 : closeOnActionTrigger) && (action == null ? void 0 : action.onTrigger)) {
          handleClose();
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        handleClose();
      }
    }
  };
  const handleInputChange = (event) => {
    onQueryChange(event.currentTarget.value);
    if (hovered === -1) {
      setHovered(0);
    }
  };
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    children: /* @__PURE__ */ jsx(GroupedTransition, {
      onExited: () => lockScroll(false),
      onEntered: () => lockScroll(true),
      mounted: opened,
      transitions: {
        spotlight: {
          duration: transitionDuration,
          transition,
          timingFunction: "ease"
        },
        overlay: {
          duration: transitionDuration / 2,
          transition: "fade",
          timingFunction: "ease"
        }
      },
      children: (transitionStyles) => /* @__PURE__ */ jsx("div", {
        ...__spreadValues$1({
          className: cx(classes.root, className)
        }, others),
        children: /* @__PURE__ */ jsxs("div", {
          className: classes.inner,
          ref: focusTrapRef,
          children: [/* @__PURE__ */ jsxs(Paper, {
            style: transitionStyles.spotlight,
            className: classes.spotlight,
            shadow,
            radius,
            onMouseLeave: resetHovered,
            children: [/* @__PURE__ */ jsx(TextInput, {
              ...__spreadProps(__spreadValues$1({}, searchInputProps), {
                value: query,
                onChange: handleInputChange,
                onKeyDown: handleInputKeyDown,
                onCompositionStart: () => setIMEOpen(true),
                onCompositionEnd: () => setIMEOpen(false),
                classNames: {
                  input: classes.searchInput
                },
                size: "lg",
                placeholder: searchPlaceholder,
                icon: searchIcon,
                onMouseEnter: resetHovered,
                autoComplete: "chrome-please-just-do-not-show-it-thanks"
              })
            }), /* @__PURE__ */ jsx(ActionsWrapper, {
              children: /* @__PURE__ */ jsx(ActionsList, {
                highlightQuery,
                highlightColor,
                actions: groupedWithLabels,
                actionComponent,
                hovered,
                query,
                nothingFoundMessage,
                onActionHover: setHovered,
                onActionTrigger: (action) => {
                  var _a2;
                  action.onTrigger(action);
                  ((_a2 = action.closeOnTrigger) != null ? _a2 : closeOnActionTrigger) && handleClose();
                },
                styles,
                classNames,
                radius
              })
            })]
          }), /* @__PURE__ */ jsx("div", {
            style: transitionStyles.overlay,
            children: /* @__PURE__ */ jsx(Overlay, {
              className: classes.overlay,
              zIndex: 1,
              onMouseDown: handleClose,
              color: overlayColor,
              opacity: overlayOpacity,
              blur: overlayBlur
            })
          })]
        })
      })
    })
  });
}
Spotlight.displayName = "@mantine/spotlight/Spotlight";
const [useSpotlightEvents, createEvent] = createUseExternalEvents("mantine-spotlight");
const openSpotlight = createEvent("open");
createEvent("close");
createEvent("toggle");
createEvent("triggerAction");
createEvent("registerActions");
createEvent("removeActions");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function SpotlightProvider(_a) {
  var _b = _a, {
    actions: initialActions,
    children,
    shortcut = "mod + K",
    onSpotlightClose,
    onSpotlightOpen,
    onQueryChange,
    cleanQueryOnClose = true,
    transitionDuration = 150,
    disabled = false
  } = _b, others = __objRest(_b, ["actions", "children", "shortcut", "onSpotlightClose", "onSpotlightOpen", "onQueryChange", "cleanQueryOnClose", "transitionDuration", "disabled"]);
  const timeoutRef = react.exports.useRef(-1);
  const [query, setQuery] = react.exports.useState("");
  const [actions, {
    registerActions,
    updateActions,
    removeActions,
    triggerAction
  }] = useActionsState(initialActions, query);
  useDidUpdate(() => {
    updateActions(initialActions);
  }, [initialActions]);
  const handleQueryChange = (value) => {
    setQuery(value);
    onQueryChange == null ? void 0 : onQueryChange(value);
  };
  const [opened, {
    open,
    close,
    toggle
  }] = useDisclosure(false, {
    onClose: () => {
      onSpotlightClose == null ? void 0 : onSpotlightClose();
      if (cleanQueryOnClose) {
        timeoutRef.current = window.setTimeout(() => {
          handleQueryChange("");
        }, transitionDuration);
      }
    },
    onOpen: () => {
      onSpotlightOpen == null ? void 0 : onSpotlightOpen();
      window.clearTimeout(timeoutRef.current);
    }
  });
  const ctx = {
    openSpotlight: open,
    closeSpotlight: close,
    toggleSpotlight: toggle,
    registerActions,
    removeActions,
    triggerAction,
    opened,
    actions,
    query
  };
  useSpotlightShortcuts(shortcut, open);
  useSpotlightEvents({
    open,
    close,
    toggle,
    registerActions,
    removeActions,
    triggerAction
  });
  return /* @__PURE__ */ jsxs(SpotlightContext.Provider, {
    value: ctx,
    children: [!disabled && /* @__PURE__ */ jsx(Spotlight, {
      ...__spreadValues({
        actions,
        onClose: close,
        opened,
        query,
        onQueryChange: handleQueryChange,
        transitionDuration
      }, others)
    }), children]
  });
}
SpotlightProvider.displayName = "@mantine/spotlight/SpotlightProvider";
/**
 * react-query-devtools-noop
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function ReactQueryDevtools() {
  return null;
}
function useColorScheme() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true
  });
  const toggleColorScheme = (value) => {
    const isDark2 = () => colorScheme === "dark";
    setColorScheme(value || (isDark2() ? "light" : "dark"));
    if (isDark2()) {
      document.body.style.backgroundColor = "#ffffff";
      return;
    }
    document.body.style.backgroundColor = "#000000";
  };
  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return [colorScheme, toggleColorScheme];
}
function ToggleThemeButton({
  colorScheme,
  toggleColorScheme
}) {
  const dark = colorScheme === "dark";
  return /* @__PURE__ */ jsx(ActionIcon, {
    variant: "outline",
    color: dark ? "yellow" : "blue",
    onClick: () => toggleColorScheme(),
    title: "Toggle color scheme",
    children: dark ? /* @__PURE__ */ jsx(Dme, {
      size: 18
    }) : /* @__PURE__ */ jsx(l6, {
      size: 18
    })
  });
}
function HeaderLogo({
  size: size2
}) {
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Container, {
    pl: 0,
    pr: 0,
    style: {
      display: "flex",
      justifyItems: "center",
      alignItems: "center"
    },
    children: /* @__PURE__ */ jsxs("a", {
      href: "/",
      style: {
        display: "flex",
        textDecoration: "none",
        alignItems: "center"
      },
      children: [/* @__PURE__ */ jsx(Paper, {
        sx: {
          justifyContent: "center",
          height: 44,
          width: 44,
          display: "flex",
          alignItems: "center",
          borderRadius: "2px 20px 2px 20px",
          "&:hover": {
            backgroundColor: isDark() ? "#000000" : theme.colors.gray[0]
          }
        },
        children: /* @__PURE__ */ jsxs("svg", {
          height: size2 || 32,
          viewBox: "0 0 64 67",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [/* @__PURE__ */ jsx("path", {
            d: "M62.245 64.6094L7.36118 36.1968C6.98858 36.0039 6.98859 35.471 7.36118 35.2781L62.245 6.86548C62.5893 6.68725 63 6.93713 63 7.32482V64.1501C63 64.5378 62.5893 64.7876 62.245 64.6094Z",
            fill: "#2B8A3E",
            fillOpacity: "0.38",
            stroke: "#2B8A3E",
            strokeOpacity: "0.6",
            strokeWidth: "1.63692"
          }), /* @__PURE__ */ jsx("path", {
            d: "M1.74625 59.1348L56.63 30.7222C57.0026 30.5293 57.0026 29.9964 56.63 29.8035L1.74625 1.39087C1.40196 1.21264 0.991211 1.46252 0.991211 1.85021V58.6755C0.991211 59.0631 1.40196 59.313 1.74625 59.1348Z",
            fill: "#1C7ED6",
            fillOpacity: "0.4",
            stroke: "#1C7ED6",
            strokeOpacity: "0.6",
            strokeWidth: "1.63692"
          })]
        })
      }), /* @__PURE__ */ jsx(Box, {
        style: {
          fontSize: "2.3rem",
          paddingLeft: "8px",
          letterSpacing: "-2px",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 500
        },
        children: /* @__PURE__ */ jsx(Paper, {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0)"
          },
          children: /* @__PURE__ */ jsx(Text, {
            color: isDark() ? "white" : "#262626",
            sx: {
              "&:hover": {
                color: isDark() ? theme.colors.gray[4] : theme.colors.dark[3]
              }
            },
            children: "Syngrisi"
          })
        })
      })]
    })
  });
}
const UsersService = {
  async getApiKey() {
    const resp = await ky(`${config$1.baseUri}/apikey`);
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
  },
  async getCurrentUser() {
    const resp = await ky(`${config$1.baseUri}/v1/users/current`);
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
  },
  async getUsers(filter = {}, options = {}) {
    const queryOptions = { ...options, limit: options.limit || 0 };
    const queryOptionsString = queryString.stringify(queryOptions);
    const queryFilterString = queryString.stringify(filter);
    const uri = `${config$1.baseUri}/v1/users?${queryOptionsString}&${queryFilterString}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource, resp: '${JSON.stringify(resp)}'`);
  },
  async create(data) {
    const resp = await ky.post(
      `${config$1.baseUri}/v1/users`,
      { json: data }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot create user, resp: '${JSON.stringify(resp)}'`);
  },
  async update(data) {
    const resp = await ky.patch(
      `${config$1.baseUri}/v1/users/${data.id}`,
      { json: data }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot update user, resp: '${JSON.stringify(resp)}'`);
  },
  async delete(id) {
    const resp = await ky.delete(
      `${config$1.baseUri}/v1/users/${id}`
    );
    if (resp.ok) {
      return;
    }
    throw new Error(`cannot delete user, resp: '${JSON.stringify(resp)}'`);
  }
};
const UserHooks = {
  useApiKey() {
    const { isLoading, error, data, isError, refetch, isFetching, isRefetching, isSuccess, status } = useQuery(
      ["apiKey"],
      () => UsersService.getApiKey(),
      {
        enabled: false,
        onError: (err) => {
          errorMsg({ error: err });
        }
      }
    );
    return { isLoading, isFetching, isRefetching, isSuccess, error, data, isError, refetch, status };
  },
  useCurrentUser() {
    const { isLoading, error, data, refetch, isSuccess } = useQuery(
      ["currentUser"],
      () => UsersService.getCurrentUser(),
      {
        onError: (err) => {
          errorMsg({ error: err });
        }
      }
    );
    return { isLoading, error, data, refetch, isSuccess };
  },
  useAllUsers() {
    const { isLoading, error, data, refetch, isSuccess, isFetching } = useQuery(
      ["allUsers"],
      () => UsersService.getUsers({}, { sortBy: "id: desc" }),
      {
        onError: (err) => {
          errorMsg({ error: err });
        }
      }
    );
    return { isLoading, error, data, refetch, isSuccess, isFetching };
  }
};
const AppContext = react.exports.createContext({});
function navigationData() {
  return [
    {
      title: "Dashboard",
      description: "Visit the Test Results Dashboard",
      group: "main",
      icon: /* @__PURE__ */ jsx(EO, {
        size: 18
      }),
      crumbs: [{
        title: "Dashboard",
        href: "/"
      }]
    },
    {
      title: "Admin Panel",
      description: "Visit Admin Panel",
      group: "main",
      icon: /* @__PURE__ */ jsx(Xue, {
        size: 18
      }),
      crumbs: [{
        title: "Admin panel",
        href: "/admin"
      }]
    },
    {
      title: "Users",
      description: "Manage Users",
      group: "admin",
      icon: /* @__PURE__ */ jsx(age, {
        size: 18
      }),
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Users",
        href: "/admin/users"
      }]
    },
    {
      title: "Logs",
      description: "View Logs",
      group: "admin",
      icon: /* @__PURE__ */ jsx(A0, {
        size: 18
      }),
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Logs",
        href: "/admin/logs"
      }]
    },
    {
      title: "Task: Handle old Checks",
      description: "Old checks statistics and cleaning",
      group: "tasks",
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Tasks",
        href: "/admin/tasks"
      }, {
        title: "Handle old Checks",
        href: "/admin/tasks/handle_old_checks"
      }]
    },
    {
      title: "Task: Handle Database Consistency",
      description: "Database Consistency statistics and cleaning",
      group: "tasks",
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Tasks",
        href: "/admin/tasks"
      }, {
        title: "Handle Database Consistency",
        href: "/admin/tasks/handle_database_consistency"
      }]
    },
    {
      title: "Task: Remove old logs",
      description: "Remove logs older certain date",
      group: "tasks",
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Tasks",
        href: "/admin/tasks"
      }, {
        title: "Remove old logs",
        href: "/admin/tasks/remove_old_logs"
      }]
    },
    {
      title: "Task: Test",
      description: "test",
      group: "tasks",
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Tasks",
        href: "/admin/tasks"
      }, {
        title: "Test",
        href: "/admin/tasks/test"
      }]
    },
    {
      title: "Settings",
      description: "Manage Admin Settings",
      group: "tasks",
      icon: /* @__PURE__ */ jsx(q0, {
        size: 18
      }),
      crumbs: [{
        title: "Admin",
        href: "/admin"
      }, {
        title: "Settings",
        href: "/admin/settings"
      }]
    }
  ];
}
const getNavigationItem = (title) => navigationData().find((x) => x.title === title);
function ApiKeyModalAsk({
  opened,
  setOpened,
  apiKey,
  setResultOpened
}) {
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => setOpened(false),
    title: "Generate a new API key?",
    children: [/* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: "Are you sure you want to generate a new API key? After generation, you must add corresponding changes in your test solution."
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      children: [/* @__PURE__ */ jsx(Button, {
        onClick: () => {
          apiKey.refetch();
          setResultOpened(true);
          setOpened(false);
        },
        children: "Generate"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: () => setOpened(false),
        children: "Cancel"
      })]
    })]
  });
}
function ApiKeyModalResult({
  opened,
  setOpened,
  apiKey
}) {
  const [successCopy, setSuccessCopy] = react.exports.useState(false);
  if (apiKey.isError) {
    log.error(apiKey.error);
  }
  const copyHandler = () => {
    const input = document.getElementById("api-key");
    input.focus();
    input.select();
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    log.debug(`copy result: ${msg}`);
    if (msg === "successful") {
      setSuccessCopy(true);
    }
    window.getSelection().removeAllRanges();
  };
  const CopyIcon = successCopy ? Nb : EH;
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => {
      setSuccessCopy(false);
      setOpened(false);
    },
    title: "New API key",
    children: [!apiKey.isLoading && apiKey.data ? /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(Group, {
        ml: 20,
        mb: 20,
        children: /* @__PURE__ */ jsx(Text, {
          size: "sm",
          children: "Copy the New API key to Clipboard"
        })
      }), /* @__PURE__ */ jsxs(Group, {
        position: "center",
        children: [/* @__PURE__ */ jsx(TextInput, {
          "data-test": "api-key",
          id: "api-key",
          value: apiKey.data.apikey,
          sx: {
            width: "340px",
            display: "inline"
          },
          icon: /* @__PURE__ */ jsx(GY, {}),
          style: {
            display: "inline"
          }
        }), /* @__PURE__ */ jsx(ActionIcon, {
          ml: -10,
          children: /* @__PURE__ */ jsx(CopyIcon, {
            size: 18,
            onClick: copyHandler,
            color: successCopy ? "green" : "gray"
          })
        })]
      })]
    }) : /* @__PURE__ */ jsx(Fragment, {
      children: apiKey.isError && /* @__PURE__ */ jsx(Text, {
        color: "red",
        size: "sm",
        children: " Error loading API key"
      })
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      children: (apiKey.isFetching || apiKey.isRefetching) && /* @__PURE__ */ jsx(Loader, {})
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      pt: 30,
      children: /* @__PURE__ */ jsx(Button, {
        onClick: () => {
          setOpened(false);
          setTimeout(() => {
            setSuccessCopy(false);
          }, 300);
        },
        children: "Close"
      })
    })]
  });
}
function UserInfoModal({
  opened,
  setOpened
}) {
  const user = UserHooks.useCurrentUser();
  const useStyles2 = createStyles((theme) => ({
    icon: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    },
    name: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`
    }
  }));
  const {
    classes
  } = useStyles2();
  return /* @__PURE__ */ jsxs(Modal, {
    size: 350,
    opened,
    onClose: () => {
      setOpened(false);
    },
    title: "User Details",
    children: [user.isSuccess && user.data ? /* @__PURE__ */ jsxs(Group, {
      noWrap: true,
      children: [/* @__PURE__ */ jsx(Avatar, {
        src: null,
        color: "white",
        size: 120,
        radius: 70,
        children: /* @__PURE__ */ jsx(age, {
          stroke: 1,
          size: 120,
          radius: "md"
        })
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Text, {
          size: "xs",
          sx: {
            textTransform: "uppercase"
          },
          weight: 700,
          color: "dimmed",
          "data-test": "userinfo-role",
          children: user.data.role
        }), /* @__PURE__ */ jsxs(Text, {
          size: "lg",
          weight: 500,
          className: classes.name,
          "data-test": "userinfo-name",
          children: [user.data.firstName, " ", user.data.lastName]
        }), /* @__PURE__ */ jsxs(Group, {
          noWrap: true,
          spacing: 5,
          mt: 3,
          children: [/* @__PURE__ */ jsx(ka, {
            stroke: 1.5,
            size: 16,
            className: classes.icon
          }), /* @__PURE__ */ jsx(Text, {
            size: "xs",
            color: "dimmed",
            "data-test": "userinfo-username",
            children: user.data.username
          })]
        })]
      })]
    }) : /* @__PURE__ */ jsx(Fragment, {
      children: /* @__PURE__ */ jsx(Loader, {})
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      pt: 30,
      children: /* @__PURE__ */ jsx(Button, {
        onClick: () => {
          setOpened(false);
        },
        children: "Close"
      })
    })]
  });
}
function UserMenu() {
  var _a, _b, _c, _d;
  const theme = useMantineTheme();
  const apiKey = UserHooks.useApiKey();
  const [apiKeyModalAskOpened, setApiKeyModalAskOpened] = react.exports.useState(false);
  const [apiKeyModalResultOpened, setApiKeyModalResultOpened] = react.exports.useState(false);
  const [userInfoModalOpened, setUserInfoModalOpened] = react.exports.useState(false);
  const currentUser = UserHooks.useCurrentUser();
  const userInitials = currentUser.isSuccess && currentUser.data.firstName ? `${(_a = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _a.firstName[0]}${(_b = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _b.lastName[0]}` : "";
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs(Menu, {
      shadow: "md",
      width: "20%",
      children: [/* @__PURE__ */ jsx(Menu.Target, {
        children: /* @__PURE__ */ jsx(Button, {
          "data-test": "user-icon",
          p: 0,
          radius: "xl",
          size: "md",
          color: isDark() ? "dark" : "#ffffff",
          sx: {
            color: isDark() ? "#ffffff" : "#1a1b1e",
            backgroundColor: isDark() ? "#1a1b1e" : theme.colors.gray[0],
            fontWeight: 600,
            fontSize: "1rem",
            display: "flex",
            width: "2.6rem",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: isDark() ? "#000000" : "#ffffff"
            }
          },
          children: userInitials
        })
      }), /* @__PURE__ */ jsxs(Menu.Dropdown, {
        children: [/* @__PURE__ */ jsxs(Menu.Label, {
          "data-test": "user-short-details",
          sx: {
            fontSize: "14px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            color: theme.colors.blue[5]
          },
          children: [/* @__PURE__ */ jsx(age, {
            size: "14px",
            stroke: 3,
            style: {
              marginRight: "10px"
            }
          }), (_c = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _c.firstName, " ", (_d = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _d.lastName]
        }), /* @__PURE__ */ jsx(Menu.Divider, {}), /* @__PURE__ */ jsx(Menu.Item, {
          "data-test": "userinfo",
          icon: /* @__PURE__ */ jsx(ZX, {
            size: 14
          }),
          onClick: () => {
            setUserInfoModalOpened(true);
          },
          children: "User Details"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(Lce, {
            size: 14
          }),
          component: "a",
          href: "/admin/",
          children: "Admin Panel"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(GY, {
            size: 14
          }),
          component: "a",
          href: "/auth/change",
          children: "Change Password"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          id: "generate-api",
          icon: /* @__PURE__ */ jsx(Bpe, {
            size: 14
          }),
          onClick: () => {
            setApiKeyModalAskOpened(true);
          },
          children: "Generate API key"
        }), /* @__PURE__ */ jsx(Menu.Divider, {}), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(q2, {
            size: 14
          }),
          component: "a",
          href: "/auth/logout",
          children: "Sign out"
        })]
      })]
    }), /* @__PURE__ */ jsx(ApiKeyModalAsk, {
      opened: apiKeyModalAskOpened,
      setOpened: setApiKeyModalAskOpened,
      apiKey,
      setResultOpened: setApiKeyModalResultOpened
    }), /* @__PURE__ */ jsx(ApiKeyModalResult, {
      opened: apiKeyModalResultOpened,
      setOpened: setApiKeyModalResultOpened,
      apiKey
    }), /* @__PURE__ */ jsx(UserInfoModal, {
      opened: userInfoModalOpened,
      setOpened: setUserInfoModalOpened
    })]
  });
}
const links = [{
  label: "Dashboard",
  link: "/"
}, {
  label: "Admin Panel",
  link: "/admin/"
}];
export {
  startNavigationProgress as $,
  AppShell as A,
  Burger as B,
  Collapse as C,
  Avatar as D,
  Highlight as E,
  FocusTrap as F,
  GroupedTransition as G,
  Header as H,
  Mark as I,
  Menu as J,
  Kbd as K,
  Modal as L,
  ModalsProvider as M,
  NavLink as N,
  Notification as O,
  Popover as P,
  Global as Q,
  ReactQueryDevtools as R,
  ScrollArea as S,
  ToggleThemeButton as T,
  UserMenu as U,
  VerticalSection as V,
  AppContext as W,
  getNavigationItem as X,
  stopNavigationProgress as Y,
  resetNavigationProgress as Z,
  _objectWithoutPropertiesLoose as _,
  HeaderLogo as a,
  setNavigationProgress as a0,
  successMsg as a1,
  errorMsg as a2,
  UsersService as a3,
  UserHooks as a4,
  uuid as a5,
  Breadcrumbs as b,
  ThemeIcon as c,
  Navbar as d,
  SpotlightProvider as e,
  NotificationsProvider as f,
  NavigationProgress as g,
  createSafeContext as h,
  isDark as i,
  useContextStylesApi as j,
  createScopedKeydownHandler as k,
  links as l,
  StylesApiProvider as m,
  navigationData as n,
  openSpotlight as o,
  ChevronIcon as p,
  CloseButton as q,
  HorizontalSection as r,
  Section as s,
  randomId as t,
  useColorScheme as u,
  useFocusTrap as v,
  useScrollLock as w,
  useFocusReturn as x,
  createEventHandler as y,
  useDelayedHover as z
};
