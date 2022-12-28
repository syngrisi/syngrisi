import { r as react, b as jsx, d as useMantineTheme, au as Global$1, av as css, aw as useDidUpdate, ax as useReducedMotion, ay as useWindowEvent, az as mergeRefs, aA as reactDom, O as useComponentDefaultProps, S as extractSystemStyles, B as Box, aB as getDefaultZIndex, aC as OptionalPortal, aD as packSx, t as ActionIcon, c as createStyles, j as jsxs, aE as createPolymorphicComponent, $ as Fragment, T as Text, aF as _extends, a3 as React, U as useUncontrolled, aG as useFloating, aH as size, aI as useFloatingAutoUpdate, aJ as offset, aK as arrow, aL as shift, aM as flip, aN as inline, aO as isElement, aP as useMergedRef, aQ as clsx, a4 as Transition$2, aR as FloatingArrow, R as useId, aS as getFloatingPosition, aT as UnstyledButton, P as Paper, G as Group, aU as CheckIcon, aV as useTransition, aW as getTransitionStyles, aX as Overlay, a2 as Loader, a0 as Tooltip, aY as useIsomorphicEffect$1, aZ as useInputProps, V as Input, a_ as keyframes, a$ as InputsGroup, b0 as QueryObserver, b1 as infiniteQueryBehavior, b2 as hasNextPage, b3 as hasPreviousPage, b4 as Subscribable, b5 as shallowEqualObjects, b6 as getDefaultState, b7 as notifyManager, b8 as parseMutationArgs, b9 as useQueryClient, ba as useSyncExternalStore, bb as shouldThrowError, bc as parseQueryArgs, bd as useBaseQuery, be as ReactDOM, bf as Portal, l as log, bg as NavigationContext, ar as useNavigate, bh as useLocation, h as Button, i as Progress, E as useHotkeys, C as Center, q as TextInput, e as Container, k as ky, a as config$1, W as queryString, u as useQuery, bi as B9, bj as wue, bk as gW, bl as wz, bm as mF, bn as Uye, z as zB, bo as Lqe, bp as Iqe, bq as I9, br as N9, bs as P5, m as dj, bt as NP, bu as Qa, v as GCe, x as Nie, D as useLocalStorage, bv as L3, bw as CMe, bx as _He, by as Iee, n as lAe, bz as commonjsGlobal, K as sizes$c, p as useForm, bA as rle, bB as Nme } from "./use-form.13115231.js";
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
const noop$3 = () => {
};
function closeOnEscape(callback, options = { active: true }) {
  if (typeof callback !== "function" || !options.active) {
    return options.onKeyDown || noop$3;
  }
  return (event) => {
    var _a;
    if (event.key === "Escape") {
      callback(event);
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
    }, [handlers]);
  }
  function createEvent2(event) {
    return (...payload) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
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
function useClipboard({ timeout = 2e3 } = {}) {
  const [error, setError] = react.exports.useState(null);
  const [copied, setCopied] = react.exports.useState(false);
  const [copyTimeout, setCopyTimeout] = react.exports.useState(null);
  const handleCopyResult = (value) => {
    clearTimeout(copyTimeout);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };
  const copy = (valueToCopy) => {
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(valueToCopy).then(() => handleCopyResult(true)).catch((err) => setError(err));
    } else {
      setError(new Error("useClipboard: navigator.clipboard is not supported"));
    }
  };
  const reset = () => {
    setCopied(false);
    setError(null);
    clearTimeout(copyTimeout);
  };
  return { copy, reset, error, copied };
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function useFocusReturn({ opened, shouldReturnFocus = true }) {
  const lastActiveElement = react.exports.useRef();
  const returnFocus = () => {
    var _a;
    if (lastActiveElement.current && "focus" in lastActiveElement.current && typeof lastActiveElement.current.focus === "function") {
      (_a = lastActiveElement.current) == null ? void 0 : _a.focus({ preventScroll: true });
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
    if (node === ref.current || node === null) {
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
          focusElement.focus({ preventScroll: true });
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
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const getRelativePosition = ({
  axis,
  target,
  parent,
  alignment,
  offset: offset2,
  isList
}) => {
  if (!target || !parent && typeof document === "undefined") {
    return 0;
  }
  const isCustomParent = !!parent;
  const parentElement = parent || document.body;
  const parentPosition = parentElement.getBoundingClientRect();
  const targetPosition = target.getBoundingClientRect();
  const getDiff = (property) => targetPosition[property] - parentPosition[property];
  if (axis === "y") {
    const diff = getDiff("top");
    if (diff === 0)
      return 0;
    if (alignment === "start") {
      const distance = diff - offset2;
      const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList;
      return shouldScroll ? distance : 0;
    }
    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;
    if (alignment === "end") {
      const distance = diff + offset2 - parentHeight + targetPosition.height;
      const shouldScroll = distance >= -targetPosition.height * (isList ? 0 : 1) || !isList;
      return shouldScroll ? distance : 0;
    }
    if (alignment === "center") {
      return diff - parentHeight / 2 + targetPosition.height / 2;
    }
    return 0;
  }
  if (axis === "x") {
    const diff = getDiff("left");
    if (diff === 0)
      return 0;
    if (alignment === "start") {
      const distance = diff - offset2;
      const shouldScroll = distance <= targetPosition.width || !isList;
      return shouldScroll ? distance : 0;
    }
    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;
    if (alignment === "end") {
      const distance = diff + offset2 - parentWidth + targetPosition.width;
      const shouldScroll = distance >= -targetPosition.width || !isList;
      return shouldScroll ? distance : 0;
    }
    if (alignment === "center") {
      return diff - parentWidth / 2 + targetPosition.width / 2;
    }
    return 0;
  }
  return 0;
};
const getScrollStart = ({ axis, parent }) => {
  if (!parent && typeof document === "undefined") {
    return 0;
  }
  const method = axis === "y" ? "scrollTop" : "scrollLeft";
  if (parent) {
    return parent[method];
  }
  const { body, documentElement } = document;
  return body[method] + documentElement[method];
};
const setScrollParam = ({ axis, parent, distance }) => {
  if (!parent && typeof document === "undefined") {
    return;
  }
  const method = axis === "y" ? "scrollTop" : "scrollLeft";
  if (parent) {
    parent[method] = distance;
  } else {
    const { body, documentElement } = document;
    body[method] = distance;
    documentElement[method] = distance;
  }
};
function useScrollIntoView({
  duration = 1250,
  axis = "y",
  onScrollFinish,
  easing = easeInOutQuad,
  offset: offset2 = 0,
  cancelable = true,
  isList = false
} = {}) {
  const frameID = react.exports.useRef(0);
  const startTime = react.exports.useRef(0);
  const shouldStop = react.exports.useRef(false);
  const scrollableRef = react.exports.useRef(null);
  const targetRef = react.exports.useRef(null);
  const reducedMotion = useReducedMotion();
  const cancel = () => {
    if (frameID.current) {
      cancelAnimationFrame(frameID.current);
    }
  };
  const scrollIntoView = react.exports.useCallback(({ alignment = "start" } = {}) => {
    var _a;
    shouldStop.current = false;
    if (frameID.current) {
      cancel();
    }
    const start = (_a = getScrollStart({ parent: scrollableRef.current, axis })) != null ? _a : 0;
    const change = getRelativePosition({
      parent: scrollableRef.current,
      target: targetRef.current,
      axis,
      alignment,
      offset: offset2,
      isList
    }) - (scrollableRef.current ? 0 : start);
    function animateScroll() {
      if (startTime.current === 0) {
        startTime.current = performance.now();
      }
      const now = performance.now();
      const elapsed = now - startTime.current;
      const t = reducedMotion || duration === 0 ? 1 : elapsed / duration;
      const distance = start + change * easing(t);
      setScrollParam({
        parent: scrollableRef.current,
        axis,
        distance
      });
      if (!shouldStop.current && t < 1) {
        frameID.current = requestAnimationFrame(animateScroll);
      } else {
        typeof onScrollFinish === "function" && onScrollFinish();
        startTime.current = 0;
        frameID.current = 0;
        cancel();
      }
    }
    animateScroll();
  }, [scrollableRef.current]);
  const handleStop = () => {
    if (cancelable) {
      shouldStop.current = true;
    }
  };
  useWindowEvent("wheel", handleStop, {
    passive: true
  });
  useWindowEvent("touchmove", handleStop, {
    passive: true
  });
  react.exports.useEffect(() => cancel, []);
  return {
    scrollableRef,
    targetRef,
    scrollIntoView,
    cancel
  };
}
const defaultState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};
function useResizeObserver() {
  const frameID = react.exports.useRef(0);
  const ref = react.exports.useRef(null);
  const [rect, setRect] = react.exports.useState(defaultState);
  const observer = react.exports.useMemo(() => typeof window !== "undefined" ? new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry) {
      cancelAnimationFrame(frameID.current);
      frameID.current = requestAnimationFrame(() => {
        if (ref.current) {
          setRect(entry.contentRect);
        }
      });
    }
  }) : null, []);
  react.exports.useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
  }, [ref.current]);
  return [ref, rect];
}
function useElementSize() {
  const [ref, { width, height }] = useResizeObserver();
  return { ref, width, height };
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
function useToggle(options = [false, true]) {
  const [state, setState] = react.exports.useState(options[0]);
  const toggle = (value) => {
    if (typeof value !== "undefined") {
      setState(value);
    } else {
      setState((current) => {
        if (current === options[0]) {
          return options[1];
        }
        return options[0];
      });
    }
  };
  return [state, toggle];
}
function getOS() {
  const { userAgent } = window.navigator;
  const macosPlatforms = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i;
  const windowsPlatforms = /(Win32)|(Win64)|(Windows)|(WinCE)/i;
  const iosPlatforms = /(iPhone)|(iPad)|(iPod)/i;
  if (macosPlatforms.test(userAgent)) {
    return "macos";
  }
  if (iosPlatforms.test(userAgent)) {
    return "ios";
  }
  if (windowsPlatforms.test(userAgent)) {
    return "windows";
  }
  if (/Android/i.test(userAgent)) {
    return "android";
  }
  if (/Linux/i.test(userAgent)) {
    return "linux";
  }
  return "undetermined";
}
function useOs() {
  if (typeof window !== "undefined") {
    return getOS();
  }
  return "undetermined";
}
function getInputOnChange(setValue) {
  return (val) => {
    if (!val) {
      setValue(val);
    } else if (typeof val === "function") {
      setValue(val);
    } else if (typeof val === "object" && "nativeEvent" in val) {
      const { currentTarget } = val;
      if (currentTarget.type === "checkbox") {
        setValue(currentTarget.checked);
      } else {
        setValue(currentTarget.value);
      }
    } else {
      setValue(val);
    }
  };
}
function useInputState(initialState) {
  const [value, setValue] = react.exports.useState(initialState);
  return [value, getInputOnChange(setValue)];
}
function useDisclosure(initialState, callbacks) {
  const [opened, setOpened] = react.exports.useState(initialState);
  const open = () => {
    var _a;
    if (!opened) {
      setOpened(true);
      (_a = callbacks == null ? void 0 : callbacks.onOpen) == null ? void 0 : _a.call(callbacks);
    }
  };
  const close = () => {
    var _a;
    if (opened) {
      setOpened(false);
      (_a = callbacks == null ? void 0 : callbacks.onClose) == null ? void 0 : _a.call(callbacks);
    }
  };
  const toggle = () => {
    opened ? close() : open();
  };
  return [opened, { open, close, toggle }];
}
function randomId() {
  return `mantine-${Math.random().toString(36).slice(2, 11)}`;
}
function upperFirst(value) {
  return typeof value !== "string" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
}
var __defProp$1H = Object.defineProperty;
var __defProps$M = Object.defineProperties;
var __getOwnPropDescs$M = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1I = Object.getOwnPropertySymbols;
var __hasOwnProp$1I = Object.prototype.hasOwnProperty;
var __propIsEnum$1I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1H = (obj, key, value) => key in obj ? __defProp$1H(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1H = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1I.call(b, prop))
      __defNormalProp$1H(a, prop, b[prop]);
  if (__getOwnPropSymbols$1I)
    for (var prop of __getOwnPropSymbols$1I(b)) {
      if (__propIsEnum$1I.call(b, prop))
        __defNormalProp$1H(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$M = (a, b) => __defProps$M(a, __getOwnPropDescs$M(b));
var __objRest$18 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1I.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1I)
    for (var prop of __getOwnPropSymbols$1I(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1I.call(source, prop))
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
    setStyles((oldStyles) => __spreadValues$1H(__spreadValues$1H({}, oldStyles), newStyles));
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
          mergeStyles(__spreadProps$M(__spreadValues$1H({}, getTransitionStyles2(height)), { height }));
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        mergeStyles(__spreadProps$M(__spreadValues$1H({}, getTransitionStyles2(height)), { willChange: "height", height }));
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
    var _b = _a, { style = {}, refKey = "ref" } = _b, rest = __objRest$18(_b, ["style", "refKey"]);
    const theirRef = rest[refKey];
    return __spreadProps$M(__spreadValues$1H({
      "aria-hidden": !opened
    }, rest), {
      [refKey]: mergeRefs(el, theirRef),
      onTransitionEnd: handleTransitionEnd,
      style: __spreadValues$1H(__spreadValues$1H({ boxSizing: "border-box" }, style), styles)
    });
  }
  return getCollapseProps;
}
var __defProp$1G = Object.defineProperty;
var __getOwnPropSymbols$1H = Object.getOwnPropertySymbols;
var __hasOwnProp$1H = Object.prototype.hasOwnProperty;
var __propIsEnum$1H = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1G = (obj, key, value) => key in obj ? __defProp$1G(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1G = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1H.call(b, prop))
      __defNormalProp$1G(a, prop, b[prop]);
  if (__getOwnPropSymbols$1H)
    for (var prop of __getOwnPropSymbols$1H(b)) {
      if (__propIsEnum$1H.call(b, prop))
        __defNormalProp$1G(a, prop, b[prop]);
    }
  return a;
};
var __objRest$17 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1H.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1H)
    for (var prop of __getOwnPropSymbols$1H(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1H.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$D = {
  transitionDuration: 200,
  transitionTimingFunction: "ease",
  animateOpacity: true
};
const Collapse = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Collapse", defaultProps$D, props), {
    children,
    in: opened,
    transitionDuration,
    transitionTimingFunction,
    style,
    onTransitionEnd,
    animateOpacity
  } = _a, others = __objRest$17(_a, ["children", "in", "transitionDuration", "transitionTimingFunction", "style", "onTransitionEnd", "animateOpacity"]);
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
      ...__spreadValues$1G({}, rest),
      children
    }) : null;
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1G({}, getCollapseProps(__spreadValues$1G(__spreadValues$1G({
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
var __defProp$1F = Object.defineProperty;
var __getOwnPropSymbols$1G = Object.getOwnPropertySymbols;
var __hasOwnProp$1G = Object.prototype.hasOwnProperty;
var __propIsEnum$1G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1F = (obj, key, value) => key in obj ? __defProp$1F(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1F = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1G.call(b, prop))
      __defNormalProp$1F(a, prop, b[prop]);
  if (__getOwnPropSymbols$1G)
    for (var prop of __getOwnPropSymbols$1G(b)) {
      if (__propIsEnum$1G.call(b, prop))
        __defNormalProp$1F(a, prop, b[prop]);
    }
  return a;
};
var __objRest$16 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1G.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1G)
    for (var prop of __getOwnPropSymbols$1G(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1G.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$C = {
  position: {
    bottom: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("modal"),
  withinPortal: true
};
const Affix = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Affix", defaultProps$C, props), {
    target,
    position,
    zIndex,
    sx,
    withinPortal
  } = _a, others = __objRest$16(_a, ["target", "position", "zIndex", "sx", "withinPortal"]);
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    target,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$1F({
        sx: [__spreadValues$1F({
          position: "fixed",
          zIndex
        }, position), ...packSx(sx)],
        ref
      }, others)
    })
  });
});
Affix.displayName = "@mantine/core/Affix";
var __defProp$1E = Object.defineProperty;
var __getOwnPropSymbols$1F = Object.getOwnPropertySymbols;
var __hasOwnProp$1F = Object.prototype.hasOwnProperty;
var __propIsEnum$1F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1E = (obj, key, value) => key in obj ? __defProp$1E(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1E = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1F.call(b, prop))
      __defNormalProp$1E(a, prop, b[prop]);
  if (__getOwnPropSymbols$1F)
    for (var prop of __getOwnPropSymbols$1F(b)) {
      if (__propIsEnum$1F.call(b, prop))
        __defNormalProp$1E(a, prop, b[prop]);
    }
  return a;
};
function CloseIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1E({
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
var __defProp$1D = Object.defineProperty;
var __getOwnPropSymbols$1E = Object.getOwnPropertySymbols;
var __hasOwnProp$1E = Object.prototype.hasOwnProperty;
var __propIsEnum$1E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1D = (obj, key, value) => key in obj ? __defProp$1D(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1D = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1E.call(b, prop))
      __defNormalProp$1D(a, prop, b[prop]);
  if (__getOwnPropSymbols$1E)
    for (var prop of __getOwnPropSymbols$1E(b)) {
      if (__propIsEnum$1E.call(b, prop))
        __defNormalProp$1D(a, prop, b[prop]);
    }
  return a;
};
var __objRest$15 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1E.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1E)
    for (var prop of __getOwnPropSymbols$1E(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1E.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const iconSizes$3 = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24
};
const defaultProps$B = {
  size: "md"
};
const CloseButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("CloseButton", defaultProps$B, props), {
    iconSize,
    size: size2 = "md"
  } = _a, others = __objRest$15(_a, ["iconSize", "size"]);
  const theme = useMantineTheme();
  const _iconSize = iconSize || theme.fn.size({
    size: size2,
    sizes: iconSizes$3
  });
  return /* @__PURE__ */ jsx(ActionIcon, {
    ...__spreadValues$1D({
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
var __defProp$1C = Object.defineProperty;
var __defProps$L = Object.defineProperties;
var __getOwnPropDescs$L = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1D = Object.getOwnPropertySymbols;
var __hasOwnProp$1D = Object.prototype.hasOwnProperty;
var __propIsEnum$1D = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1C = (obj, key, value) => key in obj ? __defProp$1C(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1C = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1D.call(b, prop))
      __defNormalProp$1C(a, prop, b[prop]);
  if (__getOwnPropSymbols$1D)
    for (var prop of __getOwnPropSymbols$1D(b)) {
      if (__propIsEnum$1D.call(b, prop))
        __defNormalProp$1C(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$L = (a, b) => __defProps$L(a, __getOwnPropDescs$L(b));
var useStyles$1k = createStyles((theme, {
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
    acc[`@media (min-width: ${breakpoint}px)`] = {
      width: breakpointSize,
      minWidth: breakpointSize
    };
    return acc;
  }, {}) : null;
  const borderStyles = withBorder ? {
    [section === "navbar" ? "borderRight" : "borderLeft"]: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`
  } : {};
  return {
    root: __spreadProps$L(__spreadValues$1C(__spreadValues$1C(__spreadProps$L(__spreadValues$1C(__spreadValues$1C({}, theme.fn.fontStyles()), position), {
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
        }) - 1}px)`]: {
          display: "none"
        }
      }
    })
  };
});
const useStyles$1l = useStyles$1k;
var __defProp$1B = Object.defineProperty;
var __getOwnPropSymbols$1C = Object.getOwnPropertySymbols;
var __hasOwnProp$1C = Object.prototype.hasOwnProperty;
var __propIsEnum$1C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1B = (obj, key, value) => key in obj ? __defProp$1B(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1B = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1C.call(b, prop))
      __defNormalProp$1B(a, prop, b[prop]);
  if (__getOwnPropSymbols$1C)
    for (var prop of __getOwnPropSymbols$1C(b)) {
      if (__propIsEnum$1C.call(b, prop))
        __defNormalProp$1B(a, prop, b[prop]);
    }
  return a;
};
var __objRest$14 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1C.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1C)
    for (var prop of __getOwnPropSymbols$1C(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1C.call(source, prop))
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
  } = _b, others = __objRest$14(_b, ["width", "height", "fixed", "position", "zIndex", "hiddenBreakpoint", "hidden", "withBorder", "className", "classNames", "styles", "children", "section", "__staticSelector", "unstyled"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx,
    theme
  } = useStyles$1l({
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
    acc[`@media (min-width: ${breakpoint}px)`] = {
      [`--mantine-${section}-width`]: `${breakpointSize}px`
    };
    return acc;
  }, {});
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$1B({
      component: section === "navbar" ? "nav" : "aside",
      ref,
      "data-hidden": hidden2 || void 0,
      className: cx(classes.root, className)
    }, others),
    children: [children, /* @__PURE__ */ jsx(Global, {
      styles: () => ({
        ":root": __spreadValues$1B({
          [`--mantine-${section}-width`]: (width == null ? void 0 : width.base) ? `${width.base}px` : "0px"
        }, breakpoints)
      })
    })]
  });
});
HorizontalSection.displayName = "@mantine/core/HorizontalSection";
var __defProp$1A = Object.defineProperty;
var __getOwnPropSymbols$1B = Object.getOwnPropertySymbols;
var __hasOwnProp$1B = Object.prototype.hasOwnProperty;
var __propIsEnum$1B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1A = (obj, key, value) => key in obj ? __defProp$1A(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1A = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1B.call(b, prop))
      __defNormalProp$1A(a, prop, b[prop]);
  if (__getOwnPropSymbols$1B)
    for (var prop of __getOwnPropSymbols$1B(b)) {
      if (__propIsEnum$1B.call(b, prop))
        __defNormalProp$1A(a, prop, b[prop]);
    }
  return a;
};
var __objRest$13 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1B.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1B)
    for (var prop of __getOwnPropSymbols$1B(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1B.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const _Section = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    grow = false,
    sx
  } = _b, others = __objRest$13(_b, ["children", "grow", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1A({
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
var __defProp$1z = Object.defineProperty;
var __getOwnPropSymbols$1A = Object.getOwnPropertySymbols;
var __hasOwnProp$1A = Object.prototype.hasOwnProperty;
var __propIsEnum$1A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1z = (obj, key, value) => key in obj ? __defProp$1z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1A.call(b, prop))
      __defNormalProp$1z(a, prop, b[prop]);
  if (__getOwnPropSymbols$1A)
    for (var prop of __getOwnPropSymbols$1A(b)) {
      if (__propIsEnum$1A.call(b, prop))
        __defNormalProp$1z(a, prop, b[prop]);
    }
  return a;
};
const defaultProps$A = {
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
  const _props = useComponentDefaultProps("Navbar", defaultProps$A, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$1z({
      section: "navbar",
      __staticSelector: "Navbar",
      ref
    }, _props)
  });
});
Navbar.Section = Section;
Navbar.displayName = "@mantine/core/Navbar";
var __defProp$1y = Object.defineProperty;
var __defProps$K = Object.defineProperties;
var __getOwnPropDescs$K = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1z = Object.getOwnPropertySymbols;
var __hasOwnProp$1z = Object.prototype.hasOwnProperty;
var __propIsEnum$1z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1y = (obj, key, value) => key in obj ? __defProp$1y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1z.call(b, prop))
      __defNormalProp$1y(a, prop, b[prop]);
  if (__getOwnPropSymbols$1z)
    for (var prop of __getOwnPropSymbols$1z(b)) {
      if (__propIsEnum$1z.call(b, prop))
        __defNormalProp$1y(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$K = (a, b) => __defProps$K(a, __getOwnPropDescs$K(b));
var useStyles$1i = createStyles((theme, { height, fixed, position, zIndex, borderPosition }) => ({
  root: __spreadProps$K(__spreadValues$1y(__spreadValues$1y({}, theme.fn.fontStyles()), position), {
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
const useStyles$1j = useStyles$1i;
var __defProp$1x = Object.defineProperty;
var __getOwnPropSymbols$1y = Object.getOwnPropertySymbols;
var __hasOwnProp$1y = Object.prototype.hasOwnProperty;
var __propIsEnum$1y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1x = (obj, key, value) => key in obj ? __defProp$1x(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1x = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1y.call(b, prop))
      __defNormalProp$1x(a, prop, b[prop]);
  if (__getOwnPropSymbols$1y)
    for (var prop of __getOwnPropSymbols$1y(b)) {
      if (__propIsEnum$1y.call(b, prop))
        __defNormalProp$1x(a, prop, b[prop]);
    }
  return a;
};
var __objRest$12 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1y.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1y)
    for (var prop of __getOwnPropSymbols$1y(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1y.call(source, prop))
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
  } = _b, others = __objRest$12(_b, ["children", "className", "classNames", "styles", "height", "fixed", "withBorder", "position", "zIndex", "section", "unstyled", "__staticSelector"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx
  } = useStyles$1j({
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
    ...__spreadValues$1x({
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
var __defProp$1w = Object.defineProperty;
var __defProps$J = Object.defineProperties;
var __getOwnPropDescs$J = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1x = Object.getOwnPropertySymbols;
var __hasOwnProp$1x = Object.prototype.hasOwnProperty;
var __propIsEnum$1x = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1w = (obj, key, value) => key in obj ? __defProp$1w(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1w = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1x.call(b, prop))
      __defNormalProp$1w(a, prop, b[prop]);
  if (__getOwnPropSymbols$1x)
    for (var prop of __getOwnPropSymbols$1x(b)) {
      if (__propIsEnum$1x.call(b, prop))
        __defNormalProp$1w(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$J = (a, b) => __defProps$J(a, __getOwnPropDescs$J(b));
const defaultProps$z = {
  fixed: false,
  position: {
    top: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Header = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Header", defaultProps$z, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$J(__spreadValues$1w({
      section: "header",
      __staticSelector: "Header"
    }, _props), {
      ref
    })
  });
});
Header.displayName = "@mantine/core/Header";
var __defProp$1v = Object.defineProperty;
var __getOwnPropSymbols$1w = Object.getOwnPropertySymbols;
var __hasOwnProp$1w = Object.prototype.hasOwnProperty;
var __propIsEnum$1w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1v = (obj, key, value) => key in obj ? __defProp$1v(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1v = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1w.call(b, prop))
      __defNormalProp$1v(a, prop, b[prop]);
  if (__getOwnPropSymbols$1w)
    for (var prop of __getOwnPropSymbols$1w(b)) {
      if (__propIsEnum$1w.call(b, prop))
        __defNormalProp$1v(a, prop, b[prop]);
    }
  return a;
};
function getPositionStyles$1(props, theme) {
  const padding2 = theme.fn.size({ size: props.padding, sizes: theme.spacing });
  const navbarOffset = props.navbarOffsetBreakpoint ? theme.fn.size({ size: props.navbarOffsetBreakpoint, sizes: theme.breakpoints }) : null;
  const asideOffset = props.asideOffsetBreakpoint ? theme.fn.size({ size: props.asideOffsetBreakpoint, sizes: theme.breakpoints }) : null;
  if (!props.fixed) {
    return { padding: padding2 };
  }
  return {
    minHeight: "100vh",
    paddingTop: `calc(var(--mantine-header-height, 0px) + ${padding2}px)`,
    paddingBottom: `calc(var(--mantine-footer-height, 0px) + ${padding2}px)`,
    paddingLeft: `calc(var(--mantine-navbar-width, 0px) + ${padding2}px)`,
    paddingRight: `calc(var(--mantine-aside-width, 0px) + ${padding2}px)`,
    [`@media (max-width: ${navbarOffset - 1}px)`]: {
      paddingLeft: padding2
    },
    [`@media (max-width: ${asideOffset - 1}px)`]: {
      paddingRight: padding2
    }
  };
}
var useStyles$1g = createStyles((theme, props) => ({
  root: {
    boxSizing: "border-box"
  },
  body: {
    display: "flex",
    boxSizing: "border-box"
  },
  main: __spreadValues$1v({
    flex: 1,
    width: "100vw",
    boxSizing: "border-box"
  }, getPositionStyles$1(props, theme))
}));
const useStyles$1h = useStyles$1g;
var __defProp$1u = Object.defineProperty;
var __getOwnPropSymbols$1v = Object.getOwnPropertySymbols;
var __hasOwnProp$1v = Object.prototype.hasOwnProperty;
var __propIsEnum$1v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1u = (obj, key, value) => key in obj ? __defProp$1u(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1u = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1v.call(b, prop))
      __defNormalProp$1u(a, prop, b[prop]);
  if (__getOwnPropSymbols$1v)
    for (var prop of __getOwnPropSymbols$1v(b)) {
      if (__propIsEnum$1v.call(b, prop))
        __defNormalProp$1u(a, prop, b[prop]);
    }
  return a;
};
var __objRest$11 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1v.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1v)
    for (var prop of __getOwnPropSymbols$1v(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1v.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$y = {
  fixed: true,
  zIndex: getDefaultZIndex("app"),
  padding: "md"
};
const AppShell = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AppShell", defaultProps$y, props), {
    children,
    navbar,
    header,
    footer,
    aside,
    fixed,
    zIndex,
    padding: padding2,
    navbarOffsetBreakpoint,
    asideOffsetBreakpoint,
    className,
    styles,
    classNames,
    unstyled,
    hidden: hidden2
  } = _a, others = __objRest$11(_a, ["children", "navbar", "header", "footer", "aside", "fixed", "zIndex", "padding", "navbarOffsetBreakpoint", "asideOffsetBreakpoint", "className", "styles", "classNames", "unstyled", "hidden"]);
  const {
    classes,
    cx
  } = useStyles$1h({
    padding: padding2,
    fixed,
    navbarOffsetBreakpoint,
    asideOffsetBreakpoint
  }, {
    styles,
    classNames,
    unstyled,
    name: "AppShell"
  });
  if (hidden2) {
    return /* @__PURE__ */ jsx(Fragment, {
      children
    });
  }
  return /* @__PURE__ */ jsx(AppShellProvider, {
    value: {
      fixed,
      zIndex
    },
    children: /* @__PURE__ */ jsxs(Box, {
      ...__spreadValues$1u({
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
const sizes$b = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
};
function getColor(theme, color) {
  const themeColor = theme.fn.variant({ variant: "outline", color }).border;
  return typeof color === "string" && (color in theme.colors || color.split(".")[0] in theme.colors) ? themeColor : color === void 0 ? theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4] : color;
}
var useStyles$1e = createStyles((theme, { size: size2, variant, color }) => ({
  root: {},
  withLabel: {
    borderTop: "0 !important"
  },
  left: {
    "&::before": {
      display: "none"
    }
  },
  right: {
    "&::after": {
      display: "none"
    }
  },
  label: {
    display: "flex",
    alignItems: "center",
    "&::before": {
      content: '""',
      flex: 1,
      height: 1,
      borderTop: `${theme.fn.size({ size: size2, sizes: sizes$b })}px ${variant} ${getColor(theme, color)}`,
      marginRight: theme.spacing.xs
    },
    "&::after": {
      content: '""',
      flex: 1,
      borderTop: `${theme.fn.size({ size: size2, sizes: sizes$b })}px ${variant} ${getColor(theme, color)}`,
      marginLeft: theme.spacing.xs
    }
  },
  labelDefaultStyles: {
    color: color === "dark" ? theme.colors.dark[1] : theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : theme.fn.primaryShade(), false)
  },
  horizontal: {
    border: 0,
    borderTopWidth: theme.fn.size({ size: size2, sizes: sizes$b }),
    borderTopColor: getColor(theme, color),
    borderTopStyle: variant,
    margin: 0
  },
  vertical: {
    border: 0,
    alignSelf: "stretch",
    height: "auto",
    borderLeftWidth: theme.fn.size({ size: size2, sizes: sizes$b }),
    borderLeftColor: getColor(theme, color),
    borderLeftStyle: variant
  }
}));
const useStyles$1f = useStyles$1e;
var __defProp$1t = Object.defineProperty;
var __defProps$I = Object.defineProperties;
var __getOwnPropDescs$I = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1u = Object.getOwnPropertySymbols;
var __hasOwnProp$1u = Object.prototype.hasOwnProperty;
var __propIsEnum$1u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1t = (obj, key, value) => key in obj ? __defProp$1t(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1t = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1u.call(b, prop))
      __defNormalProp$1t(a, prop, b[prop]);
  if (__getOwnPropSymbols$1u)
    for (var prop of __getOwnPropSymbols$1u(b)) {
      if (__propIsEnum$1u.call(b, prop))
        __defNormalProp$1t(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$I = (a, b) => __defProps$I(a, __getOwnPropDescs$I(b));
var __objRest$10 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1u.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1u)
    for (var prop of __getOwnPropSymbols$1u(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1u.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$x = {
  orientation: "horizontal",
  size: "xs",
  labelPosition: "left",
  variant: "solid"
};
const Divider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Divider", defaultProps$x, props), {
    className,
    color,
    orientation,
    size: size2,
    label,
    labelPosition,
    labelProps,
    variant,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$10(_a, ["className", "color", "orientation", "size", "label", "labelPosition", "labelProps", "variant", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1f({
    color,
    size: size2,
    variant
  }, {
    classNames,
    styles,
    unstyled,
    name: "Divider"
  });
  const vertical = orientation === "vertical";
  const horizontal = orientation === "horizontal";
  const withLabel = !!label && horizontal;
  const useLabelDefaultStyles = !(labelProps == null ? void 0 : labelProps.color);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1t({
      ref,
      className: cx(classes.root, {
        [classes.vertical]: vertical,
        [classes.horizontal]: horizontal,
        [classes.withLabel]: withLabel
      }, className),
      role: "separator"
    }, others),
    children: withLabel && /* @__PURE__ */ jsx(Text, {
      ...__spreadProps$I(__spreadValues$1t({}, labelProps), {
        size: (labelProps == null ? void 0 : labelProps.size) || "xs",
        sx: {
          marginTop: 2
        },
        className: cx(classes.label, classes[labelPosition], {
          [classes.labelDefaultStyles]: useLabelDefaultStyles
        })
      }),
      children: label
    })
  });
});
Divider.displayName = "@mantine/core/Divider";
var __defProp$1s = Object.defineProperty;
var __defProps$H = Object.defineProperties;
var __getOwnPropDescs$H = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1t = Object.getOwnPropertySymbols;
var __hasOwnProp$1t = Object.prototype.hasOwnProperty;
var __propIsEnum$1t = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1s = (obj, key, value) => key in obj ? __defProp$1s(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1s = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1t.call(b, prop))
      __defNormalProp$1s(a, prop, b[prop]);
  if (__getOwnPropSymbols$1t)
    for (var prop of __getOwnPropSymbols$1t(b)) {
      if (__propIsEnum$1t.call(b, prop))
        __defNormalProp$1s(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$H = (a, b) => __defProps$H(a, __getOwnPropDescs$H(b));
var useStyles$1c = createStyles((theme, { size: size2 }) => ({
  item: __spreadProps$H(__spreadValues$1s({}, theme.fn.fontStyles()), {
    boxSizing: "border-box",
    textAlign: "left",
    width: "100%",
    padding: `${theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5}px ${theme.fn.size({
      size: size2,
      sizes: theme.spacing
    })}px`,
    cursor: "pointer",
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    "&[data-hovered]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    },
    "&[data-selected]": __spreadValues$1s({
      backgroundColor: theme.fn.variant({ variant: "filled" }).background,
      color: theme.fn.variant({ variant: "filled" }).color
    }, theme.fn.hover({ backgroundColor: theme.fn.variant({ variant: "filled" }).hover })),
    "&[data-disabled]": {
      cursor: "default",
      color: theme.colors.dark[2]
    }
  }),
  nothingFound: {
    boxSizing: "border-box",
    color: theme.colors.gray[6],
    paddingTop: theme.fn.size({ size: size2, sizes: theme.spacing }) / 2,
    paddingBottom: theme.fn.size({ size: size2, sizes: theme.spacing }) / 2,
    textAlign: "center"
  },
  separator: {
    boxSizing: "border-box",
    textAlign: "left",
    width: "100%",
    padding: `${theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5}px ${theme.fn.size({
      size: size2,
      sizes: theme.spacing
    })}px`
  },
  separatorLabel: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  }
}));
const useStyles$1d = useStyles$1c;
var __defProp$1r = Object.defineProperty;
var __getOwnPropSymbols$1s = Object.getOwnPropertySymbols;
var __hasOwnProp$1s = Object.prototype.hasOwnProperty;
var __propIsEnum$1s = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1r = (obj, key, value) => key in obj ? __defProp$1r(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1r = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1s.call(b, prop))
      __defNormalProp$1r(a, prop, b[prop]);
  if (__getOwnPropSymbols$1s)
    for (var prop of __getOwnPropSymbols$1s(b)) {
      if (__propIsEnum$1s.call(b, prop))
        __defNormalProp$1r(a, prop, b[prop]);
    }
  return a;
};
function SelectItems({
  data,
  hovered,
  classNames,
  styles,
  isItemSelected,
  uuid: uuid2,
  __staticSelector,
  onItemHover,
  onItemSelect,
  itemsRefs,
  itemComponent: Item,
  size: size2,
  nothingFound,
  creatable,
  createLabel,
  unstyled
}) {
  const {
    classes
  } = useStyles$1d({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const unGroupedItems = [];
  const groupedItems = [];
  let creatableDataIndex = null;
  const constructItemComponent = (item, index) => {
    const selected = typeof isItemSelected === "function" ? isItemSelected(item.value) : false;
    return /* @__PURE__ */ jsx(Item, {
      ...__spreadValues$1r({
        key: item.value,
        className: classes.item,
        "data-disabled": item.disabled || void 0,
        "data-hovered": !item.disabled && hovered === index || void 0,
        "data-selected": !item.disabled && selected || void 0,
        onMouseEnter: () => onItemHover(index),
        id: `${uuid2}-${index}`,
        role: "option",
        tabIndex: -1,
        "aria-selected": hovered === index,
        ref: (node) => {
          if (itemsRefs && itemsRefs.current) {
            itemsRefs.current[item.value] = node;
          }
        },
        onMouseDown: !item.disabled ? (event) => {
          event.preventDefault();
          onItemSelect(item);
        } : null,
        disabled: item.disabled
      }, item)
    });
  };
  let groupName = null;
  data.forEach((item, index) => {
    if (item.creatable) {
      creatableDataIndex = index;
    } else if (!item.group) {
      unGroupedItems.push(constructItemComponent(item, index));
    } else {
      if (groupName !== item.group) {
        groupName = item.group;
        groupedItems.push(
          /* @__PURE__ */ jsx("div", {
            className: classes.separator,
            children: /* @__PURE__ */ jsx(Divider, {
              classNames: {
                label: classes.separatorLabel
              },
              label: item.group
            })
          }, `__mantine-divider-${index}`)
        );
      }
      groupedItems.push(constructItemComponent(item, index));
    }
  });
  if (creatable) {
    const creatableDataItem = data[creatableDataIndex];
    unGroupedItems.push(
      /* @__PURE__ */ jsx("div", {
        className: classes.item,
        "data-hovered": hovered === creatableDataIndex || void 0,
        onMouseEnter: () => onItemHover(creatableDataIndex),
        onMouseDown: (event) => {
          event.preventDefault();
          onItemSelect(creatableDataItem);
        },
        tabIndex: -1,
        ref: (node) => {
          if (itemsRefs && itemsRefs.current) {
            itemsRefs.current[creatableDataItem.value] = node;
          }
        },
        children: createLabel
      }, randomId())
    );
  }
  if (groupedItems.length > 0 && unGroupedItems.length > 0) {
    unGroupedItems.unshift(
      /* @__PURE__ */ jsx("div", {
        className: classes.separator,
        children: /* @__PURE__ */ jsx(Divider, {})
      }, "empty-group-separator")
    );
  }
  return groupedItems.length > 0 || unGroupedItems.length > 0 ? /* @__PURE__ */ jsxs(Fragment, {
    children: [groupedItems, unGroupedItems]
  }) : /* @__PURE__ */ jsx(Text, {
    size: size2,
    unstyled,
    className: classes.nothingFound,
    children: nothingFound
  });
}
SelectItems.displayName = "@mantine/core/SelectItems";
var __defProp$1q = Object.defineProperty;
var __getOwnPropSymbols$1r = Object.getOwnPropertySymbols;
var __hasOwnProp$1r = Object.prototype.hasOwnProperty;
var __propIsEnum$1r = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1q = (obj, key, value) => key in obj ? __defProp$1q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1r.call(b, prop))
      __defNormalProp$1q(a, prop, b[prop]);
  if (__getOwnPropSymbols$1r)
    for (var prop of __getOwnPropSymbols$1r(b)) {
      if (__propIsEnum$1r.call(b, prop))
        __defNormalProp$1q(a, prop, b[prop]);
    }
  return a;
};
var __objRest$$ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1r.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1r)
    for (var prop of __getOwnPropSymbols$1r(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1r.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const DefaultItem = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    label,
    value
  } = _b, others = __objRest$$(_b, ["label", "value"]);
  return /* @__PURE__ */ jsx("div", {
    ...__spreadValues$1q({
      ref
    }, others),
    children: label || value
  });
});
DefaultItem.displayName = "@mantine/core/DefaultItem";
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
var useStyles$1a = createStyles((theme, { scrollbarSize, offsetScrollbars, scrollbarHovered, hidden: hidden2 }, getRef) => ({
  root: {
    overflow: "hidden"
  },
  viewport: {
    width: "100%",
    height: "100%",
    paddingRight: offsetScrollbars ? scrollbarSize : void 0,
    paddingBottom: offsetScrollbars ? scrollbarSize : void 0
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
      height: "100%"
    }
  },
  corner: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    transition: "opacity 150ms ease",
    opacity: scrollbarHovered ? 1 : 0,
    display: hidden2 ? "none" : void 0
  }
}));
const useStyles$1b = useStyles$1a;
var __defProp$1p = Object.defineProperty;
var __defProps$G = Object.defineProperties;
var __getOwnPropDescs$G = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1q = Object.getOwnPropertySymbols;
var __hasOwnProp$1q = Object.prototype.hasOwnProperty;
var __propIsEnum$1q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1p = (obj, key, value) => key in obj ? __defProp$1p(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1p = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1q.call(b, prop))
      __defNormalProp$1p(a, prop, b[prop]);
  if (__getOwnPropSymbols$1q)
    for (var prop of __getOwnPropSymbols$1q(b)) {
      if (__propIsEnum$1q.call(b, prop))
        __defNormalProp$1p(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$G = (a, b) => __defProps$G(a, __getOwnPropDescs$G(b));
var __objRest$_ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1q.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1q)
    for (var prop of __getOwnPropSymbols$1q(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1q.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$w = {
  scrollbarSize: 12,
  scrollHideDelay: 1e3,
  type: "hover",
  offsetScrollbars: false
};
const _ScrollArea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ScrollArea", defaultProps$w, props), {
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
  } = _a, others = __objRest$_(_a, ["children", "className", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled"]);
  const [scrollbarHovered, setScrollbarHovered] = react.exports.useState(false);
  const theme = useMantineTheme();
  const {
    classes,
    cx
  } = useStyles$1b({
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
      ...__spreadValues$1p({
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
  const _a = useComponentDefaultProps("ScrollAreaAutosize", defaultProps$w, props), {
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
  } = _a, others = __objRest$_(_a, ["maxHeight", "children", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled", "sx"]);
  return /* @__PURE__ */ React.createElement(Box, __spreadProps$G(__spreadValues$1p({}, others), {
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
var __defProp$1o = Object.defineProperty;
var __defProps$F = Object.defineProperties;
var __getOwnPropDescs$F = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1p = Object.getOwnPropertySymbols;
var __hasOwnProp$1p = Object.prototype.hasOwnProperty;
var __propIsEnum$1p = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1o = (obj, key, value) => key in obj ? __defProp$1o(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1o = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1p.call(b, prop))
      __defNormalProp$1o(a, prop, b[prop]);
  if (__getOwnPropSymbols$1p)
    for (var prop of __getOwnPropSymbols$1p(b)) {
      if (__propIsEnum$1p.call(b, prop))
        __defNormalProp$1o(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$F = (a, b) => __defProps$F(a, __getOwnPropDescs$F(b));
var __objRest$Z = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1p.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1p)
    for (var prop of __getOwnPropSymbols$1p(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1p.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SelectScrollArea = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    style
  } = _b, others = __objRest$Z(_b, ["style"]);
  return /* @__PURE__ */ jsx(ScrollArea, {
    ...__spreadProps$F(__spreadValues$1o({}, others), {
      style: __spreadValues$1o({
        width: "100%"
      }, style),
      viewportRef: ref
    }),
    children: others.children
  });
});
SelectScrollArea.displayName = "@mantine/core/SelectScrollArea";
var useStyles$18 = createStyles(() => ({
  dropdown: {},
  itemsWrapper: {
    padding: 4,
    display: "flex",
    width: "100%",
    boxSizing: "border-box"
  }
}));
const useStyles$19 = useStyles$18;
function getPopoverMiddlewares(options) {
  const middlewares = [offset(options.offset)];
  if (options.middlewares.shift) {
    middlewares.push(shift());
  }
  if (options.middlewares.flip) {
    middlewares.push(flip());
  }
  if (options.middlewares.inline) {
    middlewares.push(inline());
  }
  middlewares.push(arrow({ element: options.arrowRef }));
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
var __defProp$1n = Object.defineProperty;
var __defProps$E = Object.defineProperties;
var __getOwnPropDescs$E = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1o = Object.getOwnPropertySymbols;
var __hasOwnProp$1o = Object.prototype.hasOwnProperty;
var __propIsEnum$1o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1n = (obj, key, value) => key in obj ? __defProp$1n(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1n = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1o.call(b, prop))
      __defNormalProp$1n(a, prop, b[prop]);
  if (__getOwnPropSymbols$1o)
    for (var prop of __getOwnPropSymbols$1o(b)) {
      if (__propIsEnum$1o.call(b, prop))
        __defNormalProp$1n(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$E = (a, b) => __defProps$E(a, __getOwnPropDescs$E(b));
var __objRest$Y = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1o.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1o)
    for (var prop of __getOwnPropSymbols$1o(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1o.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const PopoverTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, { children, refProp = "ref", popupType = "dialog" } = _b, others = __objRest$Y(_b, ["children", "refProp", "popupType"]);
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
  return react.exports.cloneElement(children, __spreadValues$1n(__spreadProps$E(__spreadValues$1n(__spreadValues$1n(__spreadValues$1n({}, forwardedProps), accessibleProps), ctx.targetProps), {
    className: clsx(ctx.targetProps.className, forwardedProps.className, children.props.className),
    [refProp]: targetRef
  }), !ctx.controlled ? { onClick: ctx.onToggle } : null));
});
PopoverTarget.displayName = "@mantine/core/PopoverTarget";
var useStyles$16 = createStyles((theme, { radius, shadow }) => ({
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
const useStyles$17 = useStyles$16;
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
var __defProp$1m = Object.defineProperty;
var __defProps$D = Object.defineProperties;
var __getOwnPropDescs$D = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1n = Object.getOwnPropertySymbols;
var __hasOwnProp$1n = Object.prototype.hasOwnProperty;
var __propIsEnum$1n = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1m = (obj, key, value) => key in obj ? __defProp$1m(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1m = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1n.call(b, prop))
      __defNormalProp$1m(a, prop, b[prop]);
  if (__getOwnPropSymbols$1n)
    for (var prop of __getOwnPropSymbols$1n(b)) {
      if (__propIsEnum$1n.call(b, prop))
        __defNormalProp$1m(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$D = (a, b) => __defProps$D(a, __getOwnPropDescs$D(b));
var __objRest$X = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1n.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1n)
    for (var prop of __getOwnPropSymbols$1n(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1n.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function PopoverDropdown(_a) {
  var _b = _a, {
    style,
    className,
    children,
    onKeyDownCapture
  } = _b, others = __objRest$X(_b, ["style", "className", "children", "onKeyDownCapture"]);
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
  } = useStyles$17({
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
    shouldReturnFocus: ctx.returnFocus
  });
  const accessibleProps = ctx.withRoles ? {
    "aria-labelledby": ctx.getTargetId(),
    id: ctx.getDropdownId(),
    role: "dialog"
  } : {};
  if (ctx.disabled) {
    return null;
  }
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
            ...__spreadValues$1m(__spreadProps$D(__spreadValues$1m({}, accessibleProps), {
              tabIndex: -1,
              ref: ctx.floating,
              style: __spreadProps$D(__spreadValues$1m(__spreadValues$1m({}, style), transitionStyles), {
                zIndex: ctx.zIndex,
                top: (_a2 = ctx.y) != null ? _a2 : "",
                left: (_b2 = ctx.x) != null ? _b2 : "",
                width: ctx.width === "target" ? void 0 : ctx.width
              }),
              className: cx(classes.dropdown, className),
              onKeyDownCapture: closeOnEscape(ctx.onClose, {
                active: ctx.closeOnEscape,
                onTrigger: returnFocus,
                onKeyDown: onKeyDownCapture
              }),
              "data-position": ctx.placement
            }), others),
            children: [children, /* @__PURE__ */ jsx(FloatingArrow, {
              ref: ctx.arrowRef,
              arrowX: ctx.arrowX,
              arrowY: ctx.arrowY,
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
var __getOwnPropSymbols$1m = Object.getOwnPropertySymbols;
var __hasOwnProp$1m = Object.prototype.hasOwnProperty;
var __propIsEnum$1m = Object.prototype.propertyIsEnumerable;
var __objRest$W = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1m.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1m)
    for (var prop of __getOwnPropSymbols$1m(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1m.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$v = {
  position: "bottom",
  offset: 8,
  positionDependencies: [],
  transition: "fade",
  transitionDuration: 150,
  middlewares: {
    flip: true,
    shift: true,
    inline: false
  },
  arrowSize: 7,
  arrowOffset: 5,
  closeOnClickOutside: true,
  withinPortal: false,
  closeOnEscape: true,
  trapFocus: false,
  withRoles: true,
  returnFocus: false,
  clickOutsideEvents: ["mousedown", "touchstart"],
  zIndex: getDefaultZIndex("popover"),
  __staticSelector: "Popover"
};
function Popover(props) {
  var _b, _c, _d, _e, _f, _g;
  const arrowRef = react.exports.useRef(null);
  const _a = useComponentDefaultProps("Popover", defaultProps$v, props), {
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
    withRoles,
    disabled,
    returnFocus
  } = _a, others = __objRest$W(_a, ["children", "position", "offset", "onPositionChange", "positionDependencies", "opened", "transition", "transitionDuration", "width", "middlewares", "withArrow", "arrowSize", "arrowOffset", "unstyled", "classNames", "styles", "closeOnClickOutside", "withinPortal", "closeOnEscape", "clickOutsideEvents", "trapFocus", "onClose", "onOpen", "onChange", "zIndex", "radius", "shadow", "id", "defaultOpened", "exitTransitionDuration", "__staticSelector", "withRoles", "disabled", "returnFocus"]);
  const [targetNode, setTargetNode] = react.exports.useState(null);
  const [dropdownNode, setDropdownNode] = react.exports.useState(null);
  const uid = useId(id);
  const theme = useMantineTheme();
  const popover = usePopover({
    middlewares,
    width,
    position: getFloatingPosition(theme.dir, position),
    offset: offset2 + (withArrow ? arrowSize / 2 : 0),
    arrowRef,
    onPositionChange,
    positionDependencies,
    opened,
    defaultOpened,
    onChange,
    onOpen,
    onClose
  });
  useClickOutside(() => closeOnClickOutside && popover.onClose(), clickOutsideEvents, [targetNode, dropdownNode]);
  return /* @__PURE__ */ jsx(StylesApiProvider, {
    classNames,
    styles,
    unstyled,
    staticSelector: __staticSelector,
    children: /* @__PURE__ */ jsx(PopoverContextProvider, {
      value: {
        returnFocus,
        disabled,
        controlled: popover.controlled,
        reference: (node) => {
          setTargetNode(node);
          popover.floating.reference(node);
        },
        floating: (node) => {
          setDropdownNode(node);
          popover.floating.floating(node);
        },
        x: popover.floating.x,
        y: popover.floating.y,
        arrowX: (_d = (_c = (_b = popover.floating) == null ? void 0 : _b.middlewareData) == null ? void 0 : _c.arrow) == null ? void 0 : _d.x,
        arrowY: (_g = (_f = (_e = popover.floating) == null ? void 0 : _e.middlewareData) == null ? void 0 : _f.arrow) == null ? void 0 : _g.y,
        opened: popover.opened,
        arrowRef,
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
var __defProp$1l = Object.defineProperty;
var __getOwnPropSymbols$1l = Object.getOwnPropertySymbols;
var __hasOwnProp$1l = Object.prototype.hasOwnProperty;
var __propIsEnum$1l = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1l = (obj, key, value) => key in obj ? __defProp$1l(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1l = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1l.call(b, prop))
      __defNormalProp$1l(a, prop, b[prop]);
  if (__getOwnPropSymbols$1l)
    for (var prop of __getOwnPropSymbols$1l(b)) {
      if (__propIsEnum$1l.call(b, prop))
        __defNormalProp$1l(a, prop, b[prop]);
    }
  return a;
};
var __objRest$V = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1l.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1l)
    for (var prop of __getOwnPropSymbols$1l(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1l.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function SelectPopoverDropdown(_a) {
  var _b = _a, {
    children,
    component = "div",
    maxHeight = 220,
    direction = "column",
    id,
    innerRef,
    __staticSelector,
    styles,
    classNames,
    unstyled
  } = _b, others = __objRest$V(_b, ["children", "component", "maxHeight", "direction", "id", "innerRef", "__staticSelector", "styles", "classNames", "unstyled"]);
  const {
    classes
  } = useStyles$19(null, {
    name: __staticSelector,
    styles,
    classNames,
    unstyled
  });
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$1l({
      p: 0,
      onMouseDown: (event) => event.preventDefault()
    }, others),
    children: /* @__PURE__ */ jsx("div", {
      style: {
        maxHeight,
        display: "flex"
      },
      children: /* @__PURE__ */ jsx(Box, {
        component: component || "div",
        id: `${id}-items`,
        "aria-labelledby": `${id}-label`,
        role: "listbox",
        onMouseDown: (event) => event.preventDefault(),
        style: {
          flex: 1,
          overflowY: component !== SelectScrollArea ? "auto" : void 0
        },
        "data-combobox-popover": true,
        ref: innerRef,
        children: /* @__PURE__ */ jsx("div", {
          className: classes.itemsWrapper,
          style: {
            flexDirection: direction
          },
          children
        })
      })
    })
  });
}
function SelectPopover({
  opened,
  transition = "fade",
  transitionDuration = 0,
  shadow,
  withinPortal,
  children,
  __staticSelector,
  onDirectionChange,
  switchDirectionOnFlip,
  zIndex,
  dropdownPosition,
  positionDependencies = [],
  classNames,
  styles,
  unstyled
}) {
  return /* @__PURE__ */ jsx(Popover, {
    unstyled,
    classNames,
    styles,
    width: "target",
    withRoles: false,
    opened,
    middlewares: {
      flip: dropdownPosition === "flip",
      shift: false
    },
    position: dropdownPosition === "flip" ? "bottom" : dropdownPosition,
    positionDependencies,
    zIndex,
    __staticSelector,
    withinPortal,
    transition,
    transitionDuration,
    shadow,
    onPositionChange: (nextPosition) => switchDirectionOnFlip && (onDirectionChange == null ? void 0 : onDirectionChange(nextPosition === "top" ? "column-reverse" : "column")),
    children
  });
}
SelectPopover.Target = Popover.Target;
SelectPopover.Dropdown = SelectPopoverDropdown;
var __defProp$1k = Object.defineProperty;
var __defProps$C = Object.defineProperties;
var __getOwnPropDescs$C = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1k = Object.getOwnPropertySymbols;
var __hasOwnProp$1k = Object.prototype.hasOwnProperty;
var __propIsEnum$1k = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1k = (obj, key, value) => key in obj ? __defProp$1k(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1k = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1k.call(b, prop))
      __defNormalProp$1k(a, prop, b[prop]);
  if (__getOwnPropSymbols$1k)
    for (var prop of __getOwnPropSymbols$1k(b)) {
      if (__propIsEnum$1k.call(b, prop))
        __defNormalProp$1k(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$C = (a, b) => __defProps$C(a, __getOwnPropDescs$C(b));
function AvatarPlaceholderIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadProps$C(__spreadValues$1k({}, props), {
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
var __defProp$1j = Object.defineProperty;
var __defProps$B = Object.defineProperties;
var __getOwnPropDescs$B = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1j = Object.getOwnPropertySymbols;
var __hasOwnProp$1j = Object.prototype.hasOwnProperty;
var __propIsEnum$1j = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1j = (obj, key, value) => key in obj ? __defProp$1j(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1j = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1j.call(b, prop))
      __defNormalProp$1j(a, prop, b[prop]);
  if (__getOwnPropSymbols$1j)
    for (var prop of __getOwnPropSymbols$1j(b)) {
      if (__propIsEnum$1j.call(b, prop))
        __defNormalProp$1j(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$B = (a, b) => __defProps$B(a, __getOwnPropDescs$B(b));
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
    return __spreadProps$B(__spreadValues$1j({}, ctx), {
      withinGroup: true
    });
  }
  return {
    spacing: null,
    withinGroup: false
  };
}
var useStyles$14 = createStyles((theme, { spacing }) => ({
  root: {
    display: "flex",
    paddingLeft: theme.fn.size({ size: spacing, sizes: theme.spacing })
  }
}));
const useStyles$15 = useStyles$14;
var __defProp$1i = Object.defineProperty;
var __getOwnPropSymbols$1i = Object.getOwnPropertySymbols;
var __hasOwnProp$1i = Object.prototype.hasOwnProperty;
var __propIsEnum$1i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1i = (obj, key, value) => key in obj ? __defProp$1i(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1i = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1i.call(b, prop))
      __defNormalProp$1i(a, prop, b[prop]);
  if (__getOwnPropSymbols$1i)
    for (var prop of __getOwnPropSymbols$1i(b)) {
      if (__propIsEnum$1i.call(b, prop))
        __defNormalProp$1i(a, prop, b[prop]);
    }
  return a;
};
var __objRest$U = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1i.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1i)
    for (var prop of __getOwnPropSymbols$1i(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1i.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$u = {};
const AvatarGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AvatarGroup", defaultProps$u, props), {
    children,
    spacing = "sm",
    unstyled,
    className
  } = _a, others = __objRest$U(_a, ["children", "spacing", "unstyled", "className"]);
  const {
    classes,
    cx
  } = useStyles$15({
    spacing
  }, {
    name: "AvatarGroup",
    unstyled
  });
  return /* @__PURE__ */ jsx(AvatarGroupProvider, {
    spacing,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$1i({
        ref,
        className: cx(classes.root, className)
      }, others),
      children
    })
  });
});
AvatarGroup.displayName = "@mantine/core/AvatarGroup";
var __defProp$1h = Object.defineProperty;
var __defProps$A = Object.defineProperties;
var __getOwnPropDescs$A = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1h = Object.getOwnPropertySymbols;
var __hasOwnProp$1h = Object.prototype.hasOwnProperty;
var __propIsEnum$1h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1h = (obj, key, value) => key in obj ? __defProp$1h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1h = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1h.call(b, prop))
      __defNormalProp$1h(a, prop, b[prop]);
  if (__getOwnPropSymbols$1h)
    for (var prop of __getOwnPropSymbols$1h(b)) {
      if (__propIsEnum$1h.call(b, prop))
        __defNormalProp$1h(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$A = (a, b) => __defProps$A(a, __getOwnPropDescs$A(b));
const sizes$a = {
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
var useStyles$12 = createStyles((theme, { size: size2, radius, color, withinGroup, spacing, variant, gradient }) => {
  const colors = theme.fn.variant({ variant, color, gradient });
  return {
    root: __spreadValues$1h(__spreadProps$A(__spreadValues$1h({}, theme.fn.focusStyles()), {
      WebkitTapHighlightColor: "transparent",
      boxSizing: "border-box",
      position: "relative",
      display: "block",
      userSelect: "none",
      overflow: "hidden",
      width: theme.fn.size({ size: size2, sizes: sizes$a }),
      minWidth: theme.fn.size({ size: size2, sizes: sizes$a }),
      height: theme.fn.size({ size: size2, sizes: sizes$a }),
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
    placeholder: __spreadProps$A(__spreadValues$1h({}, theme.fn.fontStyles()), {
      fontSize: theme.fn.size({ size: size2, sizes: sizes$a }) / 2.5,
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
const useStyles$13 = useStyles$12;
var __defProp$1g = Object.defineProperty;
var __defProps$z = Object.defineProperties;
var __getOwnPropDescs$z = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1g = Object.getOwnPropertySymbols;
var __hasOwnProp$1g = Object.prototype.hasOwnProperty;
var __propIsEnum$1g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1g = (obj, key, value) => key in obj ? __defProp$1g(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1g = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1g.call(b, prop))
      __defNormalProp$1g(a, prop, b[prop]);
  if (__getOwnPropSymbols$1g)
    for (var prop of __getOwnPropSymbols$1g(b)) {
      if (__propIsEnum$1g.call(b, prop))
        __defNormalProp$1g(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$z = (a, b) => __defProps$z(a, __getOwnPropDescs$z(b));
var __objRest$T = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1g.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1g)
    for (var prop of __getOwnPropSymbols$1g(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1g.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$t = {
  size: "md",
  color: "gray",
  variant: "light"
};
const _Avatar = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Avatar", defaultProps$t, props), {
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
  } = _a, others = __objRest$T(_a, ["className", "size", "src", "alt", "radius", "children", "color", "variant", "gradient", "classNames", "styles", "imageProps", "unstyled"]);
  const ctx = useAvatarGroupContext();
  const [error, setError] = react.exports.useState(!src);
  const {
    classes,
    cx
  } = useStyles$13({
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
    ...__spreadValues$1g({
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
      ...__spreadProps$z(__spreadValues$1g({}, imageProps), {
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
var __defProp$1f = Object.defineProperty;
var __defProps$y = Object.defineProperties;
var __getOwnPropDescs$y = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1f = Object.getOwnPropertySymbols;
var __hasOwnProp$1f = Object.prototype.hasOwnProperty;
var __propIsEnum$1f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1f = (obj, key, value) => key in obj ? __defProp$1f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1f = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1f.call(b, prop))
      __defNormalProp$1f(a, prop, b[prop]);
  if (__getOwnPropSymbols$1f)
    for (var prop of __getOwnPropSymbols$1f(b)) {
      if (__propIsEnum$1f.call(b, prop))
        __defNormalProp$1f(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$y = (a, b) => __defProps$y(a, __getOwnPropDescs$y(b));
const sizes$9 = {
  xs: { fontSize: 9, height: 16 },
  sm: { fontSize: 10, height: 18 },
  md: { fontSize: 11, height: 20 },
  lg: { fontSize: 13, height: 26 },
  xl: { fontSize: 16, height: 32 }
};
const dotSizes = {
  xs: 4,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10
};
function getVariantStyles({ theme, variant, color, size: size2, gradient }) {
  if (variant === "dot") {
    const dotSize = theme.fn.size({ size: size2, sizes: dotSizes });
    return {
      backgroundColor: "transparent",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
      paddingLeft: theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5 - dotSize / 2,
      "&::before": {
        content: '""',
        display: "block",
        width: dotSize,
        height: dotSize,
        borderRadius: dotSize,
        backgroundColor: theme.fn.themeColor(color, theme.colorScheme === "dark" ? 4 : theme.fn.primaryShade("light"), true),
        marginRight: dotSize
      }
    };
  }
  const colors = theme.fn.variant({ color, variant, gradient });
  return {
    background: colors.background,
    color: colors.color,
    border: `${variant === "gradient" ? 0 : 1}px solid ${colors.border}`
  };
}
var useStyles$10 = createStyles((theme, { color, size: size2, radius, gradient, fullWidth, variant }) => {
  const { fontSize, height } = size2 in sizes$9 ? sizes$9[size2] : sizes$9.md;
  return {
    leftSection: {
      marginRight: `calc(${theme.spacing.xs}px / 2)`
    },
    rightSection: {
      marginLeft: `calc(${theme.spacing.xs}px / 2)`
    },
    inner: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    root: __spreadValues$1f(__spreadProps$y(__spreadValues$1f(__spreadValues$1f({}, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      fontSize,
      height,
      WebkitTapHighlightColor: "transparent",
      lineHeight: `${height - 2}px`,
      textDecoration: "none",
      padding: `0 ${theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5}px`,
      boxSizing: "border-box",
      display: fullWidth ? "flex" : "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: fullWidth ? "100%" : "auto",
      textTransform: "uppercase",
      borderRadius: theme.fn.radius(radius),
      fontWeight: 700,
      letterSpacing: 0.25,
      cursor: "default",
      textOverflow: "ellipsis",
      overflow: "hidden"
    }), getVariantStyles({ theme, variant, color, size: size2, gradient }))
  };
});
const useStyles$11 = useStyles$10;
var __defProp$1e = Object.defineProperty;
var __getOwnPropSymbols$1e = Object.getOwnPropertySymbols;
var __hasOwnProp$1e = Object.prototype.hasOwnProperty;
var __propIsEnum$1e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1e = (obj, key, value) => key in obj ? __defProp$1e(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1e = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1e.call(b, prop))
      __defNormalProp$1e(a, prop, b[prop]);
  if (__getOwnPropSymbols$1e)
    for (var prop of __getOwnPropSymbols$1e(b)) {
      if (__propIsEnum$1e.call(b, prop))
        __defNormalProp$1e(a, prop, b[prop]);
    }
  return a;
};
var __objRest$S = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1e.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1e)
    for (var prop of __getOwnPropSymbols$1e(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1e.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$s = {
  variant: "light",
  size: "md",
  radius: "xl"
};
const _Badge = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Badge", defaultProps$s, props), {
    className,
    color,
    variant,
    fullWidth,
    children,
    size: size2,
    leftSection,
    rightSection,
    radius,
    gradient,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$S(_a, ["className", "color", "variant", "fullWidth", "children", "size", "leftSection", "rightSection", "radius", "gradient", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$11({
    size: size2,
    fullWidth,
    color,
    radius,
    variant,
    gradient
  }, {
    classNames,
    styles,
    name: "Badge",
    unstyled
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$1e({
      className: cx(classes.root, className),
      ref
    }, others),
    children: [leftSection && /* @__PURE__ */ jsx("span", {
      className: classes.leftSection,
      children: leftSection
    }), /* @__PURE__ */ jsx("span", {
      className: classes.inner,
      children
    }), rightSection && /* @__PURE__ */ jsx("span", {
      className: classes.rightSection,
      children: rightSection
    })]
  });
});
_Badge.displayName = "@mantine/core/Badge";
const Badge = createPolymorphicComponent(_Badge);
var useStyles$_ = createStyles((theme) => ({
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
const useStyles$$ = useStyles$_;
var __defProp$1d = Object.defineProperty;
var __getOwnPropSymbols$1d = Object.getOwnPropertySymbols;
var __hasOwnProp$1d = Object.prototype.hasOwnProperty;
var __propIsEnum$1d = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1d = (obj, key, value) => key in obj ? __defProp$1d(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1d = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1d.call(b, prop))
      __defNormalProp$1d(a, prop, b[prop]);
  if (__getOwnPropSymbols$1d)
    for (var prop of __getOwnPropSymbols$1d(b)) {
      if (__propIsEnum$1d.call(b, prop))
        __defNormalProp$1d(a, prop, b[prop]);
    }
  return a;
};
var __objRest$R = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1d.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1d)
    for (var prop of __getOwnPropSymbols$1d(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1d.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$r = {
  separator: "/"
};
const Breadcrumbs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Breadcrumbs", defaultProps$r, props), {
    className,
    children,
    separator,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$R(_a, ["className", "children", "separator", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$$(null, {
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
    ...__spreadValues$1d({
      className: cx(classes.root, className),
      ref
    }, others),
    children: items
  });
});
Breadcrumbs.displayName = "@mantine/core/Breadcrumbs";
const sizes$8 = {
  xs: 12,
  sm: 18,
  md: 24,
  lg: 34,
  xl: 42
};
var useStyles$Y = createStyles((theme, { size: size2, color, transitionDuration }) => {
  const sizeValue = theme.fn.size({ size: size2, sizes: sizes$8 });
  const _color = color || (theme.colorScheme === "dark" ? theme.white : theme.black);
  return {
    root: {
      borderRadius: theme.radius.sm,
      width: `calc(${sizeValue}px + ${theme.spacing.xs}px)`,
      height: `calc(${sizeValue}px + ${theme.spacing.xs}px)`,
      padding: `calc(${theme.spacing.xs}px / 2)`,
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
const useStyles$Z = useStyles$Y;
var __defProp$1c = Object.defineProperty;
var __getOwnPropSymbols$1c = Object.getOwnPropertySymbols;
var __hasOwnProp$1c = Object.prototype.hasOwnProperty;
var __propIsEnum$1c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1c = (obj, key, value) => key in obj ? __defProp$1c(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1c = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1c.call(b, prop))
      __defNormalProp$1c(a, prop, b[prop]);
  if (__getOwnPropSymbols$1c)
    for (var prop of __getOwnPropSymbols$1c(b)) {
      if (__propIsEnum$1c.call(b, prop))
        __defNormalProp$1c(a, prop, b[prop]);
    }
  return a;
};
var __objRest$Q = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1c.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1c)
    for (var prop of __getOwnPropSymbols$1c(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1c.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$q = {
  size: "md",
  transitionDuration: 300
};
const Burger = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Burger", defaultProps$q, props), {
    className,
    opened,
    color,
    size: size2,
    classNames,
    styles,
    transitionDuration
  } = _a, others = __objRest$Q(_a, ["className", "opened", "color", "size", "classNames", "styles", "transitionDuration"]);
  const {
    classes,
    cx
  } = useStyles$Z({
    color,
    size: size2,
    transitionDuration
  }, {
    classNames,
    styles,
    name: "Burger"
  });
  return /* @__PURE__ */ jsx(UnstyledButton, {
    ...__spreadValues$1c({
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
const CardContext = react.exports.createContext({ padding: 0 });
const CardProvider = CardContext.Provider;
const useCardPadding = () => react.exports.useContext(CardContext).padding;
var useStyles$W = createStyles((theme, { padding: padding2, withBorder, inheritPadding }) => {
  const spacing = theme.fn.size({ size: padding2, sizes: theme.spacing });
  const offset2 = -1 * spacing;
  const borderColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    cardSection: {
      display: "block",
      marginLeft: offset2,
      marginRight: offset2,
      paddingLeft: inheritPadding ? spacing : void 0,
      paddingRight: inheritPadding ? spacing : void 0,
      borderTop: withBorder && `1px solid ${borderColor}`,
      borderBottom: withBorder && `1px solid ${borderColor}`,
      "& + &": {
        borderTop: 0
      },
      "&[data-first]": {
        marginTop: offset2,
        borderTop: 0,
        borderBottom: withBorder && `1px solid ${borderColor}`
      },
      "&[data-last]": {
        marginBottom: offset2,
        borderBottom: 0
      }
    }
  };
});
const useStyles$X = useStyles$W;
var __defProp$1b = Object.defineProperty;
var __getOwnPropSymbols$1b = Object.getOwnPropertySymbols;
var __hasOwnProp$1b = Object.prototype.hasOwnProperty;
var __propIsEnum$1b = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1b = (obj, key, value) => key in obj ? __defProp$1b(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1b = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1b.call(b, prop))
      __defNormalProp$1b(a, prop, b[prop]);
  if (__getOwnPropSymbols$1b)
    for (var prop of __getOwnPropSymbols$1b(b)) {
      if (__propIsEnum$1b.call(b, prop))
        __defNormalProp$1b(a, prop, b[prop]);
    }
  return a;
};
var __objRest$P = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1b.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1b)
    for (var prop of __getOwnPropSymbols$1b(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1b.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const _CardSection = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    withBorder = false,
    inheritPadding = false,
    unstyled
  } = _b, others = __objRest$P(_b, ["className", "withBorder", "inheritPadding", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$X({
    padding: useCardPadding(),
    withBorder,
    inheritPadding
  }, {
    name: "Card",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1b({
      className: cx(classes.cardSection, className),
      ref
    }, others)
  });
});
_CardSection.displayName = "@mantine/core/CardSection";
const CardSection = createPolymorphicComponent(_CardSection);
var useStyles$U = createStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
  }
}));
const useStyles$V = useStyles$U;
var __defProp$1a = Object.defineProperty;
var __getOwnPropSymbols$1a = Object.getOwnPropertySymbols;
var __hasOwnProp$1a = Object.prototype.hasOwnProperty;
var __propIsEnum$1a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1a = (obj, key, value) => key in obj ? __defProp$1a(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1a = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1a.call(b, prop))
      __defNormalProp$1a(a, prop, b[prop]);
  if (__getOwnPropSymbols$1a)
    for (var prop of __getOwnPropSymbols$1a(b)) {
      if (__propIsEnum$1a.call(b, prop))
        __defNormalProp$1a(a, prop, b[prop]);
    }
  return a;
};
var __objRest$O = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1a.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1a)
    for (var prop of __getOwnPropSymbols$1a(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1a.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$p = {
  p: "md"
};
const _Card = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Card", defaultProps$p, props), {
    className,
    p,
    radius,
    children,
    unstyled
  } = _a, others = __objRest$O(_a, ["className", "p", "radius", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$V(null, {
    name: "Card",
    unstyled
  });
  const _children = react.exports.Children.toArray(children);
  const content = _children.map((child, index) => {
    if (typeof child === "object" && child && "type" in child && child.type === CardSection) {
      return react.exports.cloneElement(child, {
        padding: p,
        "data-first": index === 0 || void 0,
        "data-last": index === _children.length - 1 || void 0
      });
    }
    return child;
  });
  return /* @__PURE__ */ jsx(CardProvider, {
    value: {
      padding: p
    },
    children: /* @__PURE__ */ jsx(Paper, {
      ...__spreadValues$1a({
        className: cx(classes.root, className),
        radius,
        p,
        ref
      }, others),
      children: content
    })
  });
});
_Card.Section = CardSection;
_Card.displayName = "@mantine/core/Card";
const Card = createPolymorphicComponent(_Card);
const ChipGroupContext = react.exports.createContext(null);
const ChipGroupProvider = ChipGroupContext.Provider;
const useChipGroup = () => react.exports.useContext(ChipGroupContext);
var __defProp$19 = Object.defineProperty;
var __getOwnPropSymbols$19 = Object.getOwnPropertySymbols;
var __hasOwnProp$19 = Object.prototype.hasOwnProperty;
var __propIsEnum$19 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$19 = (obj, key, value) => key in obj ? __defProp$19(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$19 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$19.call(b, prop))
      __defNormalProp$19(a, prop, b[prop]);
  if (__getOwnPropSymbols$19)
    for (var prop of __getOwnPropSymbols$19(b)) {
      if (__propIsEnum$19.call(b, prop))
        __defNormalProp$19(a, prop, b[prop]);
    }
  return a;
};
var __objRest$N = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$19.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$19)
    for (var prop of __getOwnPropSymbols$19(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$19.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$o = {
  spacing: "xs"
};
function ChipGroup(props) {
  const _a = useComponentDefaultProps("ChipGroup", defaultProps$o, props), {
    value,
    defaultValue,
    onChange,
    spacing,
    multiple,
    children,
    unstyled
  } = _a, others = __objRest$N(_a, ["value", "defaultValue", "onChange", "spacing", "multiple", "children", "unstyled"]);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: multiple ? [] : null,
    onChange
  });
  const isChipSelected = (val) => Array.isArray(_value) ? _value.includes(val) : val === _value;
  const handleChange = (event) => {
    const val = event.currentTarget.value;
    if (Array.isArray(_value)) {
      setValue(_value.includes(val) ? _value.filter((v) => v !== val) : [..._value, val]);
    } else {
      setValue(val);
    }
  };
  return /* @__PURE__ */ jsx(ChipGroupProvider, {
    value: {
      isChipSelected,
      onChange: handleChange,
      multiple
    },
    children: /* @__PURE__ */ jsx(Group, {
      ...__spreadValues$19({
        spacing,
        unstyled
      }, others),
      children
    })
  });
}
ChipGroup.displayName = "@mantine/core/ChipGroup";
var __defProp$18 = Object.defineProperty;
var __defProps$x = Object.defineProperties;
var __getOwnPropDescs$x = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$18 = Object.getOwnPropertySymbols;
var __hasOwnProp$18 = Object.prototype.hasOwnProperty;
var __propIsEnum$18 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$18 = (obj, key, value) => key in obj ? __defProp$18(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$18 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$18.call(b, prop))
      __defNormalProp$18(a, prop, b[prop]);
  if (__getOwnPropSymbols$18)
    for (var prop of __getOwnPropSymbols$18(b)) {
      if (__propIsEnum$18.call(b, prop))
        __defNormalProp$18(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$x = (a, b) => __defProps$x(a, __getOwnPropDescs$x(b));
const sizes$7 = {
  xs: 24,
  sm: 28,
  md: 32,
  lg: 36,
  xl: 40
};
const iconSizes$2 = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18
};
const padding = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32
};
const checkedPadding = {
  xs: 7.5,
  sm: 10,
  md: 11.5,
  lg: 13,
  xl: 15
};
var useStyles$S = createStyles((theme, { radius, size: size2, color }, getRef) => ({
  root: {},
  label: __spreadProps$x(__spreadValues$18({
    ref: getRef("label")
  }, theme.fn.fontStyles()), {
    boxSizing: "border-box",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    display: "inline-block",
    alignItems: "center",
    userSelect: "none",
    border: "1px solid transparent",
    borderRadius: theme.fn.radius(radius),
    height: theme.fn.size({ size: size2, sizes: sizes$7 }),
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    lineHeight: `${theme.fn.size({ size: size2, sizes: sizes$7 }) - 2}px`,
    paddingLeft: theme.fn.size({ size: size2, sizes: padding }),
    paddingRight: theme.fn.size({ size: size2, sizes: padding }),
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background-color 100ms ease",
    WebkitTapHighlightColor: "transparent",
    '&[data-variant="filled"]': __spreadValues$18({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    '&[data-variant="outline"]': __spreadValues$18({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    "&[data-disabled]": __spreadProps$x(__spreadValues$18({
      backgroundColor: `${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]} !important`,
      borderColor: `${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]} !important`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
      cursor: "not-allowed"
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    })), {
      [`& .${getRef("iconWrapper")}`]: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      }
    }),
    "&[data-checked]": {
      paddingLeft: theme.fn.size({ size: size2, sizes: checkedPadding }),
      paddingRight: theme.fn.size({ size: size2, sizes: checkedPadding }),
      '&[data-variant="outline"]': {
        border: `1px solid ${theme.fn.variant({ variant: "filled", color }).background}`
      },
      '&[data-variant="filled"]': {
        "&, &:hover": {
          backgroundColor: theme.fn.variant({ variant: "light", color }).background
        }
      }
    }
  }),
  iconWrapper: {
    ref: getRef("iconWrapper"),
    color: theme.fn.variant({ variant: "filled", color }).background,
    width: theme.fn.size({ size: size2, sizes: iconSizes$2 }) + theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5,
    maxWidth: theme.fn.size({ size: size2, sizes: iconSizes$2 }) + theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5,
    height: theme.fn.size({ size: size2, sizes: iconSizes$2 }),
    display: "inline-block",
    verticalAlign: "middle",
    overflow: "hidden"
  },
  checkIcon: {
    width: theme.fn.size({ size: size2, sizes: iconSizes$2 }),
    height: theme.fn.size({ size: size2, sizes: iconSizes$2 }) / 1.1,
    display: "block"
  },
  input: {
    width: 0,
    height: 0,
    padding: 0,
    opacity: 0,
    margin: 0,
    "&:focus": {
      outline: "none",
      [`& + .${getRef("label")}`]: {
        outline: "none",
        boxShadow: theme.focusRing === "always" || theme.focusRing === "auto" ? `0 0 0 2px ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white}, 0 0 0 4px ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}` : void 0
      },
      "&:focus:not(:focus-visible)": {
        [`& + .${getRef("label")}`]: {
          boxShadow: theme.focusRing === "auto" || theme.focusRing === "never" ? "none" : void 0
        }
      }
    }
  }
}));
const useStyles$T = useStyles$S;
var __defProp$17 = Object.defineProperty;
var __getOwnPropSymbols$17 = Object.getOwnPropertySymbols;
var __hasOwnProp$17 = Object.prototype.hasOwnProperty;
var __propIsEnum$17 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$17 = (obj, key, value) => key in obj ? __defProp$17(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$17 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$17.call(b, prop))
      __defNormalProp$17(a, prop, b[prop]);
  if (__getOwnPropSymbols$17)
    for (var prop of __getOwnPropSymbols$17(b)) {
      if (__propIsEnum$17.call(b, prop))
        __defNormalProp$17(a, prop, b[prop]);
    }
  return a;
};
var __objRest$M = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$17.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$17)
    for (var prop of __getOwnPropSymbols$17(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$17.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$n = {
  type: "checkbox",
  size: "sm",
  radius: "xl",
  variant: "outline"
};
const Chip = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Chip", defaultProps$n, props), {
    radius,
    type,
    size: size2,
    variant,
    disabled,
    id,
    color,
    children,
    className,
    classNames,
    style,
    styles,
    checked,
    defaultChecked,
    onChange,
    sx,
    wrapperProps,
    value,
    unstyled
  } = _a, others = __objRest$M(_a, ["radius", "type", "size", "variant", "disabled", "id", "color", "children", "className", "classNames", "style", "styles", "checked", "defaultChecked", "onChange", "sx", "wrapperProps", "value", "unstyled"]);
  const ctx = useChipGroup();
  const uuid2 = useId(id);
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const {
    classes,
    cx
  } = useStyles$T({
    radius,
    size: size2,
    color
  }, {
    classNames,
    styles,
    unstyled,
    name: "Chip"
  });
  const [_value, setValue] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange
  });
  const contextProps = ctx ? {
    checked: ctx.isChipSelected(value),
    onChange: ctx.onChange,
    type: ctx.multiple ? "checkbox" : "radio"
  } : {};
  const _checked = contextProps.checked || _value;
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$17(__spreadValues$17({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadValues$17(__spreadValues$17({
        type,
        className: classes.input,
        checked: _checked,
        onChange: (event) => setValue(event.currentTarget.checked),
        id: uuid2,
        disabled,
        ref,
        value
      }, contextProps), rest)
    }), /* @__PURE__ */ jsxs("label", {
      htmlFor: uuid2,
      "data-checked": _checked || void 0,
      "data-disabled": disabled || void 0,
      "data-variant": variant,
      className: classes.label,
      children: [_checked && /* @__PURE__ */ jsx("span", {
        className: classes.iconWrapper,
        children: /* @__PURE__ */ jsx(CheckIcon, {
          className: classes.checkIcon
        })
      }), children]
    })]
  });
});
Chip.displayName = "@mantine/core/Chip";
Chip.Group = ChipGroup;
var __defProp$16 = Object.defineProperty;
var __getOwnPropSymbols$16 = Object.getOwnPropertySymbols;
var __hasOwnProp$16 = Object.prototype.hasOwnProperty;
var __propIsEnum$16 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$16 = (obj, key, value) => key in obj ? __defProp$16(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$16 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$16.call(b, prop))
      __defNormalProp$16(a, prop, b[prop]);
  if (__getOwnPropSymbols$16)
    for (var prop of __getOwnPropSymbols$16(b)) {
      if (__propIsEnum$16.call(b, prop))
        __defNormalProp$16(a, prop, b[prop]);
    }
  return a;
};
var __objRest$L = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$16.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$16)
    for (var prop of __getOwnPropSymbols$16(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$16.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$m = {
  timeout: 1e3
};
function CopyButton(props) {
  const _a = useComponentDefaultProps("CopyButton", defaultProps$m, props), {
    children,
    timeout,
    value
  } = _a, others = __objRest$L(_a, ["children", "timeout", "value"]);
  const clipboard = useClipboard({
    timeout
  });
  const copy = () => clipboard.copy(value);
  return /* @__PURE__ */ jsx(Fragment, {
    children: children(__spreadValues$16({
      copy,
      copied: clipboard.copied
    }, others))
  });
}
CopyButton.displayName = "@mantine/core/CopyButton";
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
var useStyles$Q = createStyles((theme, { color }) => ({
  root: {
    backgroundColor: theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : 2),
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : "inherit"
  }
}));
const useStyles$R = useStyles$Q;
var __defProp$15 = Object.defineProperty;
var __getOwnPropSymbols$15 = Object.getOwnPropertySymbols;
var __hasOwnProp$15 = Object.prototype.hasOwnProperty;
var __propIsEnum$15 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$15 = (obj, key, value) => key in obj ? __defProp$15(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$15 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$15.call(b, prop))
      __defNormalProp$15(a, prop, b[prop]);
  if (__getOwnPropSymbols$15)
    for (var prop of __getOwnPropSymbols$15(b)) {
      if (__propIsEnum$15.call(b, prop))
        __defNormalProp$15(a, prop, b[prop]);
    }
  return a;
};
var __objRest$K = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$15.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$15)
    for (var prop of __getOwnPropSymbols$15(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$15.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$l = {
  color: "yellow"
};
const Mark = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Mark", defaultProps$l, props), {
    color,
    className,
    unstyled
  } = _a, others = __objRest$K(_a, ["color", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$R({
    color
  }, {
    unstyled,
    name: "Mark"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$15({
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
var __defProp$14 = Object.defineProperty;
var __getOwnPropSymbols$14 = Object.getOwnPropertySymbols;
var __hasOwnProp$14 = Object.prototype.hasOwnProperty;
var __propIsEnum$14 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$14 = (obj, key, value) => key in obj ? __defProp$14(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$14 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$14.call(b, prop))
      __defNormalProp$14(a, prop, b[prop]);
  if (__getOwnPropSymbols$14)
    for (var prop of __getOwnPropSymbols$14(b)) {
      if (__propIsEnum$14.call(b, prop))
        __defNormalProp$14(a, prop, b[prop]);
    }
  return a;
};
var __objRest$J = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$14.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$14)
    for (var prop of __getOwnPropSymbols$14(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$14.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$k = {
  highlightColor: "yellow"
};
const _Highlight = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Highlight", defaultProps$k, props), {
    children,
    highlight,
    highlightColor,
    highlightStyles,
    unstyled
  } = _a, others = __objRest$J(_a, ["children", "highlight", "highlightColor", "highlightStyles", "unstyled"]);
  const highlightChunks = highlighter(children, highlight);
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$14({
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
var __defProp$13 = Object.defineProperty;
var __getOwnPropSymbols$13 = Object.getOwnPropertySymbols;
var __hasOwnProp$13 = Object.prototype.hasOwnProperty;
var __propIsEnum$13 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$13 = (obj, key, value) => key in obj ? __defProp$13(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$13 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$13.call(b, prop))
      __defNormalProp$13(a, prop, b[prop]);
  if (__getOwnPropSymbols$13)
    for (var prop of __getOwnPropSymbols$13(b)) {
      if (__propIsEnum$13.call(b, prop))
        __defNormalProp$13(a, prop, b[prop]);
    }
  return a;
};
function ImageIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$13({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
var __defProp$12 = Object.defineProperty;
var __defProps$w = Object.defineProperties;
var __getOwnPropDescs$w = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$12 = Object.getOwnPropertySymbols;
var __hasOwnProp$12 = Object.prototype.hasOwnProperty;
var __propIsEnum$12 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$12 = (obj, key, value) => key in obj ? __defProp$12(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$12 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$12.call(b, prop))
      __defNormalProp$12(a, prop, b[prop]);
  if (__getOwnPropSymbols$12)
    for (var prop of __getOwnPropSymbols$12(b)) {
      if (__propIsEnum$12.call(b, prop))
        __defNormalProp$12(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$w = (a, b) => __defProps$w(a, __getOwnPropDescs$w(b));
var useStyles$O = createStyles((theme, { radius }) => ({
  root: {},
  imageWrapper: {
    position: "relative"
  },
  figure: {
    margin: 0
  },
  image: __spreadProps$w(__spreadValues$12({}, theme.fn.fontStyles()), {
    display: "block",
    width: "100%",
    height: "100%",
    border: 0,
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  }),
  caption: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7],
    marginTop: theme.spacing.xs
  },
  placeholder: __spreadProps$w(__spreadValues$12({}, theme.fn.cover()), {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  })
}));
const useStyles$P = useStyles$O;
var __defProp$11 = Object.defineProperty;
var __getOwnPropSymbols$11 = Object.getOwnPropertySymbols;
var __hasOwnProp$11 = Object.prototype.hasOwnProperty;
var __propIsEnum$11 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$11 = (obj, key, value) => key in obj ? __defProp$11(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$11 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$11.call(b, prop))
      __defNormalProp$11(a, prop, b[prop]);
  if (__getOwnPropSymbols$11)
    for (var prop of __getOwnPropSymbols$11(b)) {
      if (__propIsEnum$11.call(b, prop))
        __defNormalProp$11(a, prop, b[prop]);
    }
  return a;
};
var __objRest$I = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$11.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$11)
    for (var prop of __getOwnPropSymbols$11(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$11.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$j = {
  fit: "cover",
  width: "100%",
  height: "auto",
  radius: 0
};
const Image = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Image", defaultProps$j, props), {
    className,
    alt,
    src,
    fit,
    width,
    height,
    radius,
    imageProps,
    withPlaceholder,
    placeholder,
    imageRef,
    classNames,
    styles,
    caption,
    unstyled,
    style
  } = _a, others = __objRest$I(_a, ["className", "alt", "src", "fit", "width", "height", "radius", "imageProps", "withPlaceholder", "placeholder", "imageRef", "classNames", "styles", "caption", "unstyled", "style"]);
  const {
    classes,
    cx
  } = useStyles$P({
    radius
  }, {
    classNames,
    styles,
    unstyled,
    name: "Image"
  });
  const [loaded, setLoaded] = react.exports.useState(!!src);
  const [error, setError] = react.exports.useState(!src);
  const isPlaceholder = withPlaceholder && (!loaded || error);
  useDidUpdate(() => {
    setLoaded(false);
    setError(false);
  }, [src]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$11({
      className: cx(classes.root, className),
      ref,
      style: __spreadValues$11({
        width,
        height
      }, style)
    }, others),
    children: /* @__PURE__ */ jsxs("figure", {
      className: classes.figure,
      children: [/* @__PURE__ */ jsxs("div", {
        className: classes.imageWrapper,
        children: [/* @__PURE__ */ jsx("img", {
          ...__spreadValues$11({
            className: classes.image,
            src,
            alt,
            style: {
              objectFit: fit,
              width,
              height
            },
            ref: imageRef,
            onLoad: (event) => {
              setLoaded(true);
              typeof (imageProps == null ? void 0 : imageProps.onLoad) === "function" && imageProps.onLoad(event);
            },
            onError: (event) => {
              setError(true);
              typeof (imageProps == null ? void 0 : imageProps.onError) === "function" && imageProps.onError(event);
            }
          }, imageProps)
        }), isPlaceholder && /* @__PURE__ */ jsx("div", {
          className: classes.placeholder,
          title: alt,
          children: placeholder || /* @__PURE__ */ jsx(ImageIcon, {
            style: {
              width: 40,
              height: 40
            }
          })
        })]
      }), !!caption && /* @__PURE__ */ jsx(Text, {
        component: "figcaption",
        size: "sm",
        align: "center",
        className: classes.caption,
        children: caption
      })]
    })
  });
});
Image.displayName = "@mantine/core/Image";
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
var useStyles$M = createStyles((theme) => ({
  root: {
    lineHeight: theme.lineHeight,
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    padding: `3px calc(${theme.spacing.xs}px / 2)`,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    borderBottom: `3px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
  }
}));
const useStyles$N = useStyles$M;
var __defProp$10 = Object.defineProperty;
var __getOwnPropSymbols$10 = Object.getOwnPropertySymbols;
var __hasOwnProp$10 = Object.prototype.hasOwnProperty;
var __propIsEnum$10 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$10 = (obj, key, value) => key in obj ? __defProp$10(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$10 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$10.call(b, prop))
      __defNormalProp$10(a, prop, b[prop]);
  if (__getOwnPropSymbols$10)
    for (var prop of __getOwnPropSymbols$10(b)) {
      if (__propIsEnum$10.call(b, prop))
        __defNormalProp$10(a, prop, b[prop]);
    }
  return a;
};
var __objRest$H = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$10.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$10)
    for (var prop of __getOwnPropSymbols$10(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$10.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Kbd = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Kbd", {}, props), {
    className,
    children,
    unstyled
  } = _a, others = __objRest$H(_a, ["className", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$N(null, {
    name: "Kbd",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$10({
      component: "kbd",
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
Kbd.displayName = "@mantine/core/Kbd";
const ListContext = react.exports.createContext(null);
function useListContext() {
  return react.exports.useContext(ListContext) || {};
}
var useStyles$K = createStyles((theme, { spacing, center }, getRef) => ({
  itemWrapper: {
    ref: getRef("itemWrapper"),
    display: "inline-flex",
    flexDirection: "column",
    whiteSpace: "normal"
  },
  item: {
    whiteSpace: "nowrap",
    lineHeight: center ? 1 : theme.lineHeight,
    "&:not(:first-of-type)": {
      marginTop: theme.fn.size({ size: spacing, sizes: theme.spacing })
    }
  },
  withIcon: {
    listStyle: "none",
    [`& .${getRef("itemWrapper")}`]: {
      display: "inline-flex",
      alignItems: center ? "center" : "flex-start",
      flexDirection: "row"
    }
  },
  itemIcon: {
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: theme.spacing.sm
  }
}));
const useStyles$L = useStyles$K;
var __defProp$$ = Object.defineProperty;
var __getOwnPropSymbols$$ = Object.getOwnPropertySymbols;
var __hasOwnProp$$ = Object.prototype.hasOwnProperty;
var __propIsEnum$$ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$$ = (obj, key, value) => key in obj ? __defProp$$(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$$ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$$.call(b, prop))
      __defNormalProp$$(a, prop, b[prop]);
  if (__getOwnPropSymbols$$)
    for (var prop of __getOwnPropSymbols$$(b)) {
      if (__propIsEnum$$.call(b, prop))
        __defNormalProp$$(a, prop, b[prop]);
    }
  return a;
};
var __objRest$G = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$$.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$$)
    for (var prop of __getOwnPropSymbols$$(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$$.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function ListItem(_a) {
  var _b = _a, {
    className,
    children,
    icon
  } = _b, others = __objRest$G(_b, ["className", "children", "icon"]);
  const {
    icon: ctxIcon,
    spacing,
    center,
    listStyleType,
    size: size2,
    withPadding
  } = useListContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const _icon = icon || ctxIcon;
  const {
    classes,
    cx
  } = useStyles$L({
    withPadding,
    size: size2,
    listStyleType,
    center,
    spacing
  }, {
    classNames,
    styles,
    unstyled,
    name: "List"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$$({
      component: "li",
      className: cx(classes.item, {
        [classes.withIcon]: _icon
      }, className)
    }, others),
    children: /* @__PURE__ */ jsxs("div", {
      className: classes.itemWrapper,
      children: [_icon && /* @__PURE__ */ jsx("span", {
        className: classes.itemIcon,
        children: _icon
      }), children]
    })
  });
}
ListItem.displayName = "@mantine/core/ListItem";
var __defProp$_ = Object.defineProperty;
var __defProps$v = Object.defineProperties;
var __getOwnPropDescs$v = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$_ = Object.getOwnPropertySymbols;
var __hasOwnProp$_ = Object.prototype.hasOwnProperty;
var __propIsEnum$_ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$_ = (obj, key, value) => key in obj ? __defProp$_(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$_ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$_.call(b, prop))
      __defNormalProp$_(a, prop, b[prop]);
  if (__getOwnPropSymbols$_)
    for (var prop of __getOwnPropSymbols$_(b)) {
      if (__propIsEnum$_.call(b, prop))
        __defNormalProp$_(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$v = (a, b) => __defProps$v(a, __getOwnPropDescs$v(b));
var useStyles$I = createStyles((theme, { withPadding, size: size2, listStyleType }) => ({
  root: __spreadProps$v(__spreadValues$_({}, theme.fn.fontStyles()), {
    listStyleType,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    lineHeight: theme.lineHeight,
    margin: 0,
    paddingLeft: withPadding ? theme.spacing.xl : 0,
    listStylePosition: "inside"
  })
}));
const useStyles$J = useStyles$I;
var __defProp$Z = Object.defineProperty;
var __getOwnPropSymbols$Z = Object.getOwnPropertySymbols;
var __hasOwnProp$Z = Object.prototype.hasOwnProperty;
var __propIsEnum$Z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$Z = (obj, key, value) => key in obj ? __defProp$Z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$Z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$Z.call(b, prop))
      __defNormalProp$Z(a, prop, b[prop]);
  if (__getOwnPropSymbols$Z)
    for (var prop of __getOwnPropSymbols$Z(b)) {
      if (__propIsEnum$Z.call(b, prop))
        __defNormalProp$Z(a, prop, b[prop]);
    }
  return a;
};
var __objRest$F = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$Z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$Z)
    for (var prop of __getOwnPropSymbols$Z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$Z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$i = {
  type: "unordered",
  size: "md",
  spacing: 0
};
const List = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("List", defaultProps$i, props), {
    children,
    type,
    size: size2,
    listStyleType,
    withPadding,
    center,
    spacing,
    icon,
    className,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$F(_a, ["children", "type", "size", "listStyleType", "withPadding", "center", "spacing", "icon", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$J({
    withPadding,
    size: size2,
    listStyleType,
    center,
    spacing
  }, {
    classNames,
    styles,
    name: "List",
    unstyled
  });
  return /* @__PURE__ */ jsx(StylesApiProvider, {
    classNames,
    styles,
    unstyled,
    children: /* @__PURE__ */ jsx(ListContext.Provider, {
      value: {
        spacing,
        center,
        icon,
        listStyleType,
        size: size2,
        withPadding
      },
      children: /* @__PURE__ */ jsx(Box, {
        ...__spreadValues$Z({
          component: type === "unordered" ? "ul" : "ol",
          className: cx(classes.root, className),
          ref
        }, others),
        children
      })
    })
  });
});
List.Item = ListItem;
List.displayName = "@mantine/core/List";
var useStyles$G = createStyles((theme) => ({
  divider: {
    margin: `calc(${theme.spacing.xs}px / 2) -5px`,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
  }
}));
const useStyles$H = useStyles$G;
var __defProp$Y = Object.defineProperty;
var __getOwnPropSymbols$Y = Object.getOwnPropertySymbols;
var __hasOwnProp$Y = Object.prototype.hasOwnProperty;
var __propIsEnum$Y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$Y = (obj, key, value) => key in obj ? __defProp$Y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$Y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$Y.call(b, prop))
      __defNormalProp$Y(a, prop, b[prop]);
  if (__getOwnPropSymbols$Y)
    for (var prop of __getOwnPropSymbols$Y(b)) {
      if (__propIsEnum$Y.call(b, prop))
        __defNormalProp$Y(a, prop, b[prop]);
    }
  return a;
};
var __objRest$E = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$Y.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$Y)
    for (var prop of __getOwnPropSymbols$Y(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$Y.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuDivider(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$E(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$H(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$Y({
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
var __defProp$X = Object.defineProperty;
var __getOwnPropSymbols$X = Object.getOwnPropertySymbols;
var __hasOwnProp$X = Object.prototype.hasOwnProperty;
var __propIsEnum$X = Object.prototype.propertyIsEnumerable;
var __defNormalProp$X = (obj, key, value) => key in obj ? __defProp$X(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$X = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$X.call(b, prop))
      __defNormalProp$X(a, prop, b[prop]);
  if (__getOwnPropSymbols$X)
    for (var prop of __getOwnPropSymbols$X(b)) {
      if (__propIsEnum$X.call(b, prop))
        __defNormalProp$X(a, prop, b[prop]);
    }
  return a;
};
var __objRest$D = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$X.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$X)
    for (var prop of __getOwnPropSymbols$X(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$X.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$D(_b, ["children", "onMouseEnter", "onMouseLeave"]);
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
    ...__spreadValues$X({
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
var __defProp$W = Object.defineProperty;
var __defProps$u = Object.defineProperties;
var __getOwnPropDescs$u = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$W = Object.getOwnPropertySymbols;
var __hasOwnProp$W = Object.prototype.hasOwnProperty;
var __propIsEnum$W = Object.prototype.propertyIsEnumerable;
var __defNormalProp$W = (obj, key, value) => key in obj ? __defProp$W(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$W = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$W.call(b, prop))
      __defNormalProp$W(a, prop, b[prop]);
  if (__getOwnPropSymbols$W)
    for (var prop of __getOwnPropSymbols$W(b)) {
      if (__propIsEnum$W.call(b, prop))
        __defNormalProp$W(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$u = (a, b) => __defProps$u(a, __getOwnPropDescs$u(b));
var useStyles$E = createStyles((theme, { color, radius }) => ({
  item: __spreadProps$u(__spreadValues$W({}, theme.fn.fontStyles()), {
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
const useStyles$F = useStyles$E;
var __defProp$V = Object.defineProperty;
var __defProps$t = Object.defineProperties;
var __getOwnPropDescs$t = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$V = Object.getOwnPropertySymbols;
var __hasOwnProp$V = Object.prototype.hasOwnProperty;
var __propIsEnum$V = Object.prototype.propertyIsEnumerable;
var __defNormalProp$V = (obj, key, value) => key in obj ? __defProp$V(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$V = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$V.call(b, prop))
      __defNormalProp$V(a, prop, b[prop]);
  if (__getOwnPropSymbols$V)
    for (var prop of __getOwnPropSymbols$V(b)) {
      if (__propIsEnum$V.call(b, prop))
        __defNormalProp$V(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$t = (a, b) => __defProps$t(a, __getOwnPropDescs$t(b));
var __objRest$C = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$V.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$V)
    for (var prop of __getOwnPropSymbols$V(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$V.call(source, prop))
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
  } = _b, others = __objRest$C(_b, ["children", "className", "color", "closeMenuOnClick", "icon", "rightSection"]);
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
  } = useStyles$F({
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
    ...__spreadProps$t(__spreadValues$V({
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
var useStyles$C = createStyles((theme) => ({
  label: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    padding: `calc(${theme.spacing.xs}px / 2) ${theme.spacing.sm}px`,
    cursor: "default"
  }
}));
const useStyles$D = useStyles$C;
var __defProp$U = Object.defineProperty;
var __getOwnPropSymbols$U = Object.getOwnPropertySymbols;
var __hasOwnProp$U = Object.prototype.hasOwnProperty;
var __propIsEnum$U = Object.prototype.propertyIsEnumerable;
var __defNormalProp$U = (obj, key, value) => key in obj ? __defProp$U(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$U = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$U.call(b, prop))
      __defNormalProp$U(a, prop, b[prop]);
  if (__getOwnPropSymbols$U)
    for (var prop of __getOwnPropSymbols$U(b)) {
      if (__propIsEnum$U.call(b, prop))
        __defNormalProp$U(a, prop, b[prop]);
    }
  return a;
};
var __objRest$B = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$U.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$U)
    for (var prop of __getOwnPropSymbols$U(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$U.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuLabel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$B(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$D(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$U({
      className: cx(classes.label, className)
    }, others),
    children
  });
}
MenuLabel.displayName = "@mantine/core/MenuLabel";
var __defProp$T = Object.defineProperty;
var __getOwnPropSymbols$T = Object.getOwnPropertySymbols;
var __hasOwnProp$T = Object.prototype.hasOwnProperty;
var __propIsEnum$T = Object.prototype.propertyIsEnumerable;
var __defNormalProp$T = (obj, key, value) => key in obj ? __defProp$T(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$T = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$T.call(b, prop))
      __defNormalProp$T(a, prop, b[prop]);
  if (__getOwnPropSymbols$T)
    for (var prop of __getOwnPropSymbols$T(b)) {
      if (__propIsEnum$T.call(b, prop))
        __defNormalProp$T(a, prop, b[prop]);
    }
  return a;
};
var __objRest$A = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$T.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$T)
    for (var prop of __getOwnPropSymbols$T(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$T.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const MenuTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp = "ref"
  } = _b, others = __objRest$A(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(MENU_ERRORS.children);
  }
  const ctx = useMenuContext();
  const onClick = createEventHandler(children.props.onClick, () => ctx.trigger === "click" && ctx.toggleDropdown());
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, () => ctx.trigger === "hover" && ctx.openDropdown());
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, () => ctx.trigger === "hover" && ctx.closeDropdown());
  react.exports.useEffect(() => ctx.closeDropdown, [children]);
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$T({
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
var useStyles$A = createStyles({
  dropdown: { padding: 4 }
});
const useStyles$B = useStyles$A;
var __defProp$S = Object.defineProperty;
var __defProps$s = Object.defineProperties;
var __getOwnPropDescs$s = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$S = Object.getOwnPropertySymbols;
var __hasOwnProp$S = Object.prototype.hasOwnProperty;
var __propIsEnum$S = Object.prototype.propertyIsEnumerable;
var __defNormalProp$S = (obj, key, value) => key in obj ? __defProp$S(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$S = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$S.call(b, prop))
      __defNormalProp$S(a, prop, b[prop]);
  if (__getOwnPropSymbols$S)
    for (var prop of __getOwnPropSymbols$S(b)) {
      if (__propIsEnum$S.call(b, prop))
        __defNormalProp$S(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$s = (a, b) => __defProps$s(a, __getOwnPropDescs$s(b));
var __objRest$z = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$S.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$S)
    for (var prop of __getOwnPropSymbols$S(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$S.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$h = {
  closeOnItemClick: true,
  loop: true,
  trigger: "click",
  openDelay: 0,
  closeDelay: 100
};
function Menu(props) {
  const _a = useComponentDefaultProps("Menu", defaultProps$h, props), {
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
  } = _a, others = __objRest$z(_a, ["children", "onOpen", "onClose", "opened", "defaultOpened", "onChange", "closeOnItemClick", "loop", "closeOnEscape", "trigger", "openDelay", "closeDelay", "classNames", "styles", "unstyled", "radius"]);
  const {
    classes,
    cx
  } = useStyles$B();
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
      ...__spreadProps$s(__spreadValues$S({}, others), {
        radius,
        opened: _opened,
        onChange: setOpened,
        defaultOpened,
        trapFocus: trigger === "click",
        closeOnEscape: closeOnEscape2 && trigger === "click",
        __staticSelector: "Menu",
        classNames: __spreadProps$s(__spreadValues$S({}, classNames), {
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
var __defProp$R = Object.defineProperty;
var __getOwnPropSymbols$R = Object.getOwnPropertySymbols;
var __hasOwnProp$R = Object.prototype.hasOwnProperty;
var __propIsEnum$R = Object.prototype.propertyIsEnumerable;
var __defNormalProp$R = (obj, key, value) => key in obj ? __defProp$R(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$R = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$R.call(b, prop))
      __defNormalProp$R(a, prop, b[prop]);
  if (__getOwnPropSymbols$R)
    for (var prop of __getOwnPropSymbols$R(b)) {
      if (__propIsEnum$R.call(b, prop))
        __defNormalProp$R(a, prop, b[prop]);
    }
  return a;
};
const sizes$6 = {
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
var useStyles$y = createStyles((theme, { overflow, size: size2, centered, zIndex, fullScreen }) => ({
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
  modal: __spreadValues$R({
    position: "relative",
    width: fullScreen ? "100vw" : theme.fn.size({ sizes: sizes$6, size: size2 }),
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
const useStyles$z = useStyles$y;
var __defProp$Q = Object.defineProperty;
var __getOwnPropSymbols$Q = Object.getOwnPropertySymbols;
var __hasOwnProp$Q = Object.prototype.hasOwnProperty;
var __propIsEnum$Q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$Q = (obj, key, value) => key in obj ? __defProp$Q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$Q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$Q.call(b, prop))
      __defNormalProp$Q(a, prop, b[prop]);
  if (__getOwnPropSymbols$Q)
    for (var prop of __getOwnPropSymbols$Q(b)) {
      if (__propIsEnum$Q.call(b, prop))
        __defNormalProp$Q(a, prop, b[prop]);
    }
  return a;
};
var __objRest$y = (source, exclude) => {
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
const defaultProps$g = {
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
  const _a = useComponentDefaultProps("Modal", defaultProps$g, props), {
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
    padding: padding2,
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
  } = _a, others = __objRest$y(_a, ["className", "opened", "title", "onClose", "children", "withCloseButton", "overlayOpacity", "size", "transitionDuration", "closeButtonLabel", "overlayColor", "overflow", "transition", "padding", "shadow", "radius", "id", "classNames", "styles", "closeOnClickOutside", "trapFocus", "closeOnEscape", "centered", "target", "withinPortal", "zIndex", "overlayBlur", "transitionTimingFunction", "fullScreen", "unstyled", "lockScroll", "withFocusReturn"]);
  const baseId = useId(id);
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const {
    classes,
    cx,
    theme
  } = useStyles$z({
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
      children: (transitionStyles) => /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsxs(Box, {
          ...__spreadValues$Q({
            id: baseId,
            className: cx(classes.root, className)
          }, others),
          children: [/* @__PURE__ */ jsx("div", {
            style: transitionStyles.overlay,
            children: /* @__PURE__ */ jsx(Overlay, {
              className: classes.overlay,
              sx: {
                position: "fixed"
              },
              zIndex: 0,
              blur: overlayBlur,
              color: overlayColor || (theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.black),
              opacity: _overlayOpacity,
              unstyled
            })
          }), /* @__PURE__ */ jsx("div", {
            role: "presentation",
            className: classes.inner,
            onClick: () => closeOnClickOutside && onClose(),
            onKeyDown: (event) => {
              var _a2;
              const shouldTrigger = ((_a2 = event.target) == null ? void 0 : _a2.getAttribute("data-mantine-stop-propagation")) !== "true";
              shouldTrigger && event.key === "Escape" && closeOnEscape2 && onClose();
            },
            ref: focusTrapRef,
            children: /* @__PURE__ */ jsxs(Paper, {
              className: classes.modal,
              shadow,
              p: padding2,
              radius,
              role: "dialog",
              "aria-labelledby": titleId,
              "aria-describedby": bodyId,
              "aria-modal": true,
              tabIndex: -1,
              style: transitionStyles.modal,
              unstyled,
              onClick: (event) => event.stopPropagation(),
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
            })
          })]
        })
      })
    })
  });
}
Modal.displayName = "@mantine/core/Modal";
var __defProp$P = Object.defineProperty;
var __getOwnPropSymbols$P = Object.getOwnPropertySymbols;
var __hasOwnProp$P = Object.prototype.hasOwnProperty;
var __propIsEnum$P = Object.prototype.propertyIsEnumerable;
var __defNormalProp$P = (obj, key, value) => key in obj ? __defProp$P(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$P = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$P.call(b, prop))
      __defNormalProp$P(a, prop, b[prop]);
  if (__getOwnPropSymbols$P)
    for (var prop of __getOwnPropSymbols$P(b)) {
      if (__propIsEnum$P.call(b, prop))
        __defNormalProp$P(a, prop, b[prop]);
    }
  return a;
};
var __objRest$x = (source, exclude) => {
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
const iconSizes$1 = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28
};
function ChevronIcon(_a) {
  var _b = _a, {
    size: size2,
    error,
    style
  } = _b, others = __objRest$x(_b, ["size", "error", "style"]);
  const theme = useMantineTheme();
  const _size = theme.fn.size({
    size: size2,
    sizes: iconSizes$1
  });
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$P({
      width: _size,
      height: _size,
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: __spreadValues$P({
        color: error ? theme.colors.red[6] : theme.colors.gray[6]
      }, style),
      "data-chevron": true
    }, others),
    children: /* @__PURE__ */ jsx("path", {
      d: "M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
function SelectRightSection({
  shouldClear,
  clearButtonLabel,
  onClear,
  size: size2,
  error,
  clearButtonTabIndex
}) {
  return shouldClear ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: onClear,
    size: size2,
    tabIndex: clearButtonTabIndex
  }) : /* @__PURE__ */ jsx(ChevronIcon, {
    error,
    size: size2
  });
}
SelectRightSection.displayName = "@mantine/core/SelectRightSection";
var __defProp$O = Object.defineProperty;
var __defProps$r = Object.defineProperties;
var __getOwnPropDescs$r = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$O = Object.getOwnPropertySymbols;
var __hasOwnProp$O = Object.prototype.hasOwnProperty;
var __propIsEnum$O = Object.prototype.propertyIsEnumerable;
var __defNormalProp$O = (obj, key, value) => key in obj ? __defProp$O(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$O = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$O.call(b, prop))
      __defNormalProp$O(a, prop, b[prop]);
  if (__getOwnPropSymbols$O)
    for (var prop of __getOwnPropSymbols$O(b)) {
      if (__propIsEnum$O.call(b, prop))
        __defNormalProp$O(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$r = (a, b) => __defProps$r(a, __getOwnPropDescs$r(b));
var __objRest$w = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$O.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$O)
    for (var prop of __getOwnPropSymbols$O(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$O.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const RIGHT_SECTION_WIDTH$3 = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 44,
  xl: 54
};
function getSelectRightSectionProps(_a) {
  var _b = _a, {
    styles,
    rightSection,
    rightSectionWidth,
    theme
  } = _b, props = __objRest$w(_b, ["styles", "rightSection", "rightSectionWidth", "theme"]);
  if (rightSection) {
    return {
      rightSection,
      rightSectionWidth,
      styles
    };
  }
  const _styles = typeof styles === "function" ? styles(theme) : styles;
  return {
    rightSectionWidth: theme.fn.size({
      size: props.size,
      sizes: RIGHT_SECTION_WIDTH$3
    }),
    rightSection: !props.readOnly && !(props.disabled && props.shouldClear) && /* @__PURE__ */ jsx(SelectRightSection, {
      ...__spreadValues$O({}, props)
    }),
    styles: __spreadProps$r(__spreadValues$O({}, _styles), {
      rightSection: __spreadProps$r(__spreadValues$O({}, _styles == null ? void 0 : _styles.rightSection), {
        pointerEvents: props.shouldClear ? void 0 : "none"
      })
    })
  };
}
var useStyles$w = createStyles((theme, { color, radius, withTitle }, getRef) => {
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
const useStyles$x = useStyles$w;
var __defProp$N = Object.defineProperty;
var __defProps$q = Object.defineProperties;
var __getOwnPropDescs$q = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$N = Object.getOwnPropertySymbols;
var __hasOwnProp$N = Object.prototype.hasOwnProperty;
var __propIsEnum$N = Object.prototype.propertyIsEnumerable;
var __defNormalProp$N = (obj, key, value) => key in obj ? __defProp$N(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$N = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$N.call(b, prop))
      __defNormalProp$N(a, prop, b[prop]);
  if (__getOwnPropSymbols$N)
    for (var prop of __getOwnPropSymbols$N(b)) {
      if (__propIsEnum$N.call(b, prop))
        __defNormalProp$N(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$q = (a, b) => __defProps$q(a, __getOwnPropDescs$q(b));
var __objRest$v = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$N.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$N)
    for (var prop of __getOwnPropSymbols$N(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$N.call(source, prop))
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
  } = _a, others = __objRest$v(_a, ["className", "color", "radius", "loading", "disallowClose", "title", "icon", "children", "onClose", "closeButtonProps", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$x({
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
    ...__spreadValues$N({
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
      ...__spreadProps$q(__spreadValues$N({
        iconSize: 16,
        color: "gray"
      }, closeButtonProps), {
        onClick: onClose,
        className: classes.closeButton
      })
    })]
  });
});
Notification.displayName = "@mantine/core/Notification";
function getCurveProps({ size: size2, thickness, sum, value, root, offset: offset2 }) {
  const radius = (size2 * 0.9 - thickness * 2) / 2;
  const deg = Math.PI * radius * 2 / 100;
  const strokeDasharray = root ? `${(100 - sum) * deg}, ${sum * deg}` : `${value * deg}, ${(100 - value) * deg}`;
  return {
    strokeWidth: thickness,
    cx: size2 / 2,
    cy: size2 / 2,
    r: radius,
    transform: root ? `scale(1, -1) translate(0, -${size2})` : null,
    strokeDasharray,
    strokeDashoffset: root ? 0 : offset2
  };
}
var __defProp$M = Object.defineProperty;
var __getOwnPropSymbols$M = Object.getOwnPropertySymbols;
var __hasOwnProp$M = Object.prototype.hasOwnProperty;
var __propIsEnum$M = Object.prototype.propertyIsEnumerable;
var __defNormalProp$M = (obj, key, value) => key in obj ? __defProp$M(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$M = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$M.call(b, prop))
      __defNormalProp$M(a, prop, b[prop]);
  if (__getOwnPropSymbols$M)
    for (var prop of __getOwnPropSymbols$M(b)) {
      if (__propIsEnum$M.call(b, prop))
        __defNormalProp$M(a, prop, b[prop]);
    }
  return a;
};
function Curve({
  size: size2,
  value,
  offset: offset2,
  sum,
  thickness,
  root,
  color,
  lineRoundCaps,
  tooltip
}) {
  const theme = useMantineTheme();
  const stroke = theme.fn.themeColor(color || (theme.colorScheme === "dark" ? "dark" : "gray"), color ? theme.fn.primaryShade() : theme.colorScheme === "dark" ? 4 : 1, false);
  return /* @__PURE__ */ jsx(Tooltip.Floating, {
    disabled: !tooltip,
    label: tooltip,
    children: /* @__PURE__ */ jsx("circle", {
      ...__spreadValues$M({
        fill: "none",
        strokeLinecap: lineRoundCaps ? "round" : "butt",
        stroke
      }, getCurveProps({
        sum,
        size: size2,
        thickness,
        value,
        offset: offset2,
        root
      }))
    })
  });
}
Curve.displayName = "@mantine/core/Curve";
var __defProp$L = Object.defineProperty;
var __defProps$p = Object.defineProperties;
var __getOwnPropDescs$p = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$L = Object.getOwnPropertySymbols;
var __hasOwnProp$L = Object.prototype.hasOwnProperty;
var __propIsEnum$L = Object.prototype.propertyIsEnumerable;
var __defNormalProp$L = (obj, key, value) => key in obj ? __defProp$L(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$L = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$L.call(b, prop))
      __defNormalProp$L(a, prop, b[prop]);
  if (__getOwnPropSymbols$L)
    for (var prop of __getOwnPropSymbols$L(b)) {
      if (__propIsEnum$L.call(b, prop))
        __defNormalProp$L(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$p = (a, b) => __defProps$p(a, __getOwnPropDescs$p(b));
function getCurves({ size: size2, thickness, sections, renderRoundedLineCaps }) {
  const sum = sections.reduce((acc, current) => acc + current.value, 0);
  const accumulated = Math.PI * ((size2 * 0.9 - thickness * 2) / 2) * 2;
  let offset2 = accumulated;
  const curves = [];
  const curvesInOrder = [];
  for (let i = 0; i < sections.length; i += 1) {
    curves.push({ sum, offset: offset2, data: sections[i], root: false });
    offset2 -= sections[i].value / 100 * accumulated;
  }
  curves.push({ sum, offset: offset2, data: null, root: true });
  curvesInOrder.push(__spreadProps$p(__spreadValues$L({}, curves[curves.length - 1]), { lineRoundCaps: false }));
  if (curves.length > 2) {
    curvesInOrder.push(__spreadProps$p(__spreadValues$L({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
    curvesInOrder.push(__spreadProps$p(__spreadValues$L({}, curves[curves.length - 2]), { lineRoundCaps: renderRoundedLineCaps }));
    for (let i = 1; i <= curves.length - 3; i += 1) {
      curvesInOrder.push(__spreadProps$p(__spreadValues$L({}, curves[i]), { lineRoundCaps: false }));
    }
  } else {
    curvesInOrder.push(__spreadProps$p(__spreadValues$L({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
  }
  return curvesInOrder;
}
var useStyles$u = createStyles({
  root: {
    position: "relative"
  },
  label: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)"
  }
});
const useStyles$v = useStyles$u;
var __defProp$K = Object.defineProperty;
var __getOwnPropSymbols$K = Object.getOwnPropertySymbols;
var __hasOwnProp$K = Object.prototype.hasOwnProperty;
var __propIsEnum$K = Object.prototype.propertyIsEnumerable;
var __defNormalProp$K = (obj, key, value) => key in obj ? __defProp$K(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$K = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$K.call(b, prop))
      __defNormalProp$K(a, prop, b[prop]);
  if (__getOwnPropSymbols$K)
    for (var prop of __getOwnPropSymbols$K(b)) {
      if (__propIsEnum$K.call(b, prop))
        __defNormalProp$K(a, prop, b[prop]);
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
const defaultProps$f = {
  size: 120,
  thickness: 12
};
const RingProgress = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RingProgress", defaultProps$f, props), {
    className,
    style,
    label,
    sections,
    size: size2,
    thickness,
    classNames,
    styles,
    roundCaps,
    unstyled
  } = _a, others = __objRest$u(_a, ["className", "style", "label", "sections", "size", "thickness", "classNames", "styles", "roundCaps", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$v(null, {
    classNames,
    styles,
    unstyled,
    name: "RingProgress"
  });
  const curves = getCurves({
    size: size2,
    thickness,
    sections,
    renderRoundedLineCaps: roundCaps
  }).map((curve, index) => {
    var _a2, _b, _c;
    return /* @__PURE__ */ jsx(Curve, {
      value: (_a2 = curve.data) == null ? void 0 : _a2.value,
      size: size2,
      thickness,
      sum: curve.sum,
      offset: curve.offset,
      color: (_b = curve.data) == null ? void 0 : _b.color,
      root: curve.root,
      lineRoundCaps: curve.lineRoundCaps,
      tooltip: (_c = curve.data) == null ? void 0 : _c.tooltip
    }, index);
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$K({
      style: __spreadValues$K({
        width: size2,
        height: size2
      }, style),
      className: cx(classes.root, className),
      ref
    }, others),
    children: [/* @__PURE__ */ jsx("svg", {
      width: size2,
      height: size2,
      style: {
        transform: "rotate(-90deg)"
      },
      children: curves
    }), label && /* @__PURE__ */ jsx("div", {
      className: classes.label,
      style: {
        right: thickness * 2,
        left: thickness * 2
      },
      children: label
    })]
  });
});
RingProgress.displayName = "@mantine/core/RingProgress";
var __defProp$J = Object.defineProperty;
var __defProps$o = Object.defineProperties;
var __getOwnPropDescs$o = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$J = Object.getOwnPropertySymbols;
var __hasOwnProp$J = Object.prototype.hasOwnProperty;
var __propIsEnum$J = Object.prototype.propertyIsEnumerable;
var __defNormalProp$J = (obj, key, value) => key in obj ? __defProp$J(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$J = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$J.call(b, prop))
      __defNormalProp$J(a, prop, b[prop]);
  if (__getOwnPropSymbols$J)
    for (var prop of __getOwnPropSymbols$J(b)) {
      if (__propIsEnum$J.call(b, prop))
        __defNormalProp$J(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$o = (a, b) => __defProps$o(a, __getOwnPropDescs$o(b));
const WRAPPER_PADDING = 4;
const sizes$5 = {
  xs: "3px 6px",
  sm: "5px 10px",
  md: "7px 14px",
  lg: "9px 16px",
  xl: "12px 20px"
};
var useStyles$s = createStyles((theme, {
  fullWidth,
  color,
  radius,
  shouldAnimate,
  transitionDuration,
  transitionTimingFunction,
  size: size2,
  orientation
}, getRef) => {
  const vertical = orientation === "vertical";
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    label: __spreadProps$o(__spreadValues$J(__spreadValues$J({
      ref: getRef("label")
    }, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      borderRadius: theme.fn.radius(radius),
      fontWeight: 500,
      fontSize: size2 in theme.fontSizes ? theme.fontSizes[size2] : theme.fontSizes.sm,
      cursor: "pointer",
      display: "block",
      textAlign: "center",
      padding: sizes$5[size2 in sizes$5 ? size2 : "sm"],
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      userSelect: "none",
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      transition: `color ${shouldAnimate ? 0 : transitionDuration}ms ${transitionTimingFunction || theme.transitionTimingFunction}`,
      "&:hover": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
      }
    }),
    control: {
      ref: getRef("control"),
      position: "relative",
      boxSizing: "border-box",
      flex: 1,
      zIndex: 2,
      transition: `border-left-color ${shouldAnimate ? 0 : transitionDuration}ms ${transitionTimingFunction || theme.transitionTimingFunction}`,
      "&:not(:first-of-type)": {
        borderStyle: "solid",
        borderWidth: vertical ? "1px 0 0 0" : "0 0 0 1px",
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
      }
    },
    input: {
      height: 0,
      width: 0,
      position: "absolute",
      overflow: "hidden",
      whiteSpace: "nowrap",
      opacity: 0,
      "&:focus": {
        outline: "none",
        [`& + .${getRef("label")}`]: {
          outline: "none",
          boxShadow: theme.focusRing === "always" || theme.focusRing === "auto" ? `0 0 0 2px ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white}, 0 0 0 4px ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}` : void 0
        },
        "&:focus:not(:focus-visible)": {
          [`& + .${getRef("label")}`]: {
            boxShadow: theme.focusRing === "auto" || theme.focusRing === "never" ? "none" : void 0
          }
        }
      }
    },
    root: {
      position: "relative",
      display: fullWidth || vertical ? "flex" : "inline-flex",
      width: vertical && !fullWidth ? "max-content" : "auto",
      flexDirection: vertical ? "column" : "row",
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
      borderRadius: theme.fn.radius(radius),
      overflow: "hidden",
      padding: WRAPPER_PADDING
    },
    controlActive: {
      borderLeftColor: "transparent !important",
      borderTopColor: "transparent !important",
      [`& + .${getRef("control")}`]: {
        borderLeftColor: "transparent !important",
        borderTopColor: "transparent !important"
      },
      borderRadius: theme.fn.radius(radius),
      boxShadow: shouldAnimate ? color || theme.colorScheme === "dark" ? "none" : theme.shadows.xs : void 0,
      backgroundColor: shouldAnimate ? color ? colors.background : theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white : void 0
    },
    labelActive: {
      "&, &:hover": {
        color: color || theme.colorScheme === "dark" ? theme.white : theme.black
      }
    },
    disabled: {
      "&, &:hover": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5],
        cursor: "not-allowed"
      }
    },
    active: {
      boxSizing: "border-box",
      borderRadius: theme.fn.radius(radius),
      position: "absolute",
      zIndex: 1,
      boxShadow: color || theme.colorScheme === "dark" ? "none" : theme.shadows.xs,
      transition: `transform ${shouldAnimate ? 0 : transitionDuration}ms ${theme.transitionTimingFunction}, width ${shouldAnimate ? 0 : transitionDuration / 2}ms ${transitionTimingFunction || theme.transitionTimingFunction}`,
      backgroundColor: color ? colors.background : theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white
    }
  };
});
const useStyles$t = useStyles$s;
var __defProp$I = Object.defineProperty;
var __getOwnPropSymbols$I = Object.getOwnPropertySymbols;
var __hasOwnProp$I = Object.prototype.hasOwnProperty;
var __propIsEnum$I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$I = (obj, key, value) => key in obj ? __defProp$I(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$I = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$I.call(b, prop))
      __defNormalProp$I(a, prop, b[prop]);
  if (__getOwnPropSymbols$I)
    for (var prop of __getOwnPropSymbols$I(b)) {
      if (__propIsEnum$I.call(b, prop))
        __defNormalProp$I(a, prop, b[prop]);
    }
  return a;
};
var __objRest$t = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$I.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$I)
    for (var prop of __getOwnPropSymbols$I(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$I.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$e = {
  disabled: false,
  size: "sm",
  transitionDuration: 200
};
const SegmentedControl = react.exports.forwardRef((props, ref) => {
  var _b, _c, _d, _e;
  const _a = useComponentDefaultProps("SegmentedControl", defaultProps$e, props), {
    className,
    disabled,
    data: _data,
    name,
    value,
    onChange,
    color,
    fullWidth,
    radius,
    size: size2,
    transitionDuration,
    transitionTimingFunction,
    classNames,
    styles,
    defaultValue,
    orientation,
    unstyled
  } = _a, others = __objRest$t(_a, ["className", "disabled", "data", "name", "value", "onChange", "color", "fullWidth", "radius", "size", "transitionDuration", "transitionTimingFunction", "classNames", "styles", "defaultValue", "orientation", "unstyled"]);
  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const data = _data.map((item) => typeof item === "string" ? {
    label: item,
    value: item
  } : item);
  const mounted = react.exports.useRef();
  const [shouldAnimate, setShouldAnimate] = react.exports.useState(false);
  const [_value, handleValueChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: Array.isArray(data) ? (_e = (_d = (_b = data.find((item) => !item.disabled)) == null ? void 0 : _b.value) != null ? _d : (_c = data[0]) == null ? void 0 : _c.value) != null ? _e : null : null,
    onChange
  });
  const {
    classes,
    cx
  } = useStyles$t({
    size: size2,
    fullWidth,
    color,
    radius,
    shouldAnimate: reduceMotion || !shouldAnimate,
    transitionDuration,
    transitionTimingFunction,
    orientation
  }, {
    classNames,
    styles,
    unstyled,
    name: "SegmentedControl"
  });
  const [activePosition, setActivePosition] = react.exports.useState({
    width: 0,
    height: 0,
    translate: [0, 0]
  });
  const uuid2 = useId(name);
  const refs = react.exports.useRef({});
  const [observerRef, containerRect] = useResizeObserver();
  useIsomorphicEffect$1(() => {
    if (!mounted.current) {
      mounted.current = true;
      setShouldAnimate(false);
    } else {
      setShouldAnimate(true);
    }
  });
  react.exports.useEffect(() => {
    if (_value in refs.current && observerRef.current) {
      const element = refs.current[_value];
      const elementRect = element.getBoundingClientRect();
      const scaledValue = element.offsetWidth / elementRect.width;
      const width = elementRect.width * scaledValue || 0;
      const height = elementRect.height * scaledValue || 0;
      const offsetRight = containerRect.width - element.parentElement.offsetLeft + WRAPPER_PADDING - width;
      const offsetLeft = element.parentElement.offsetLeft - WRAPPER_PADDING;
      setActivePosition({
        width,
        height,
        translate: [theme.dir === "rtl" ? offsetRight : offsetLeft, element.parentElement.offsetTop - WRAPPER_PADDING]
      });
    }
  }, [_value, containerRect]);
  const controls = data.map((item) => /* @__PURE__ */ jsxs("div", {
    className: cx(classes.control, {
      [classes.controlActive]: _value === item.value
    }),
    children: [/* @__PURE__ */ jsx("input", {
      className: classes.input,
      disabled: disabled || item.disabled,
      type: "radio",
      name: uuid2,
      value: item.value,
      id: `${uuid2}-${item.value}`,
      checked: _value === item.value,
      onChange: () => handleValueChange(item.value)
    }), /* @__PURE__ */ jsx("label", {
      className: cx(classes.label, {
        [classes.labelActive]: _value === item.value,
        [classes.disabled]: disabled || item.disabled
      }),
      htmlFor: `${uuid2}-${item.value}`,
      ref: (node) => {
        refs.current[item.value] = node;
      },
      children: item.label
    })]
  }, item.value));
  const mergedRef = useMergedRef(observerRef, ref);
  if (data.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$I({
      className: cx(classes.root, className),
      ref: mergedRef
    }, others),
    children: [typeof _value === "string" && shouldAnimate && /* @__PURE__ */ jsx(Box, {
      component: "span",
      className: classes.active,
      sx: {
        width: activePosition.width,
        height: activePosition.height,
        transform: `translate(${activePosition.translate[0]}px, ${activePosition.translate[1]}px )`
      }
    }), controls]
  });
});
SegmentedControl.displayName = "@mantine/core/SegmentedControl";
function filterData({
  data,
  searchable,
  limit,
  searchValue,
  filter,
  value,
  filterDataOnExactSearchMatch
}) {
  if (!searchable) {
    return data;
  }
  const selected = value != null ? data.find((item) => item.value === value) || null : null;
  if (selected && !filterDataOnExactSearchMatch && (selected == null ? void 0 : selected.label) === searchValue) {
    return data;
  }
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    if (filter(searchValue, data[i])) {
      result.push(data[i]);
    }
    if (result.length >= limit) {
      break;
    }
  }
  return result;
}
var useStyles$q = createStyles(() => ({
  input: {
    "&:not(:disabled)": {
      cursor: "pointer",
      "&::selection": {
        backgroundColor: "transparent"
      }
    }
  }
}));
const useStyles$r = useStyles$q;
var __defProp$H = Object.defineProperty;
var __defProps$n = Object.defineProperties;
var __getOwnPropDescs$n = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$H = Object.getOwnPropertySymbols;
var __hasOwnProp$H = Object.prototype.hasOwnProperty;
var __propIsEnum$H = Object.prototype.propertyIsEnumerable;
var __defNormalProp$H = (obj, key, value) => key in obj ? __defProp$H(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$H = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$H.call(b, prop))
      __defNormalProp$H(a, prop, b[prop]);
  if (__getOwnPropSymbols$H)
    for (var prop of __getOwnPropSymbols$H(b)) {
      if (__propIsEnum$H.call(b, prop))
        __defNormalProp$H(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$n = (a, b) => __defProps$n(a, __getOwnPropDescs$n(b));
var __objRest$s = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$H.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$H)
    for (var prop of __getOwnPropSymbols$H(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$H.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function defaultFilter(value, item) {
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}
function defaultShouldCreate(query, data) {
  return !!query && !data.some((item) => item.label.toLowerCase() === query.toLowerCase());
}
const defaultProps$d = {
  required: false,
  size: "sm",
  shadow: "sm",
  itemComponent: DefaultItem,
  transition: "fade",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter,
  maxDropdownHeight: 220,
  searchable: false,
  clearable: false,
  limit: Infinity,
  disabled: false,
  creatable: false,
  shouldCreate: defaultShouldCreate,
  selectOnBlur: false,
  switchDirectionOnFlip: false,
  filterDataOnExactSearchMatch: false,
  zIndex: getDefaultZIndex("popover"),
  clearButtonTabIndex: 0,
  positionDependencies: [],
  dropdownPosition: "flip"
};
const Select = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("Select", defaultProps$d, props), {
    inputProps,
    wrapperProps,
    shadow,
    data,
    value,
    defaultValue,
    onChange,
    itemComponent,
    onKeyDown,
    onBlur,
    onFocus,
    transition,
    transitionDuration,
    initiallyOpened,
    transitionTimingFunction,
    unstyled,
    classNames,
    styles,
    filter,
    maxDropdownHeight,
    searchable,
    clearable,
    nothingFound,
    clearButtonLabel,
    limit,
    disabled,
    onSearchChange,
    searchValue,
    rightSection,
    rightSectionWidth,
    creatable,
    getCreateLabel,
    shouldCreate,
    selectOnBlur,
    onCreate,
    dropdownComponent,
    onDropdownClose,
    onDropdownOpen,
    withinPortal,
    switchDirectionOnFlip,
    zIndex,
    name,
    dropdownPosition,
    allowDeselect,
    placeholder,
    filterDataOnExactSearchMatch,
    clearButtonTabIndex,
    form,
    positionDependencies,
    readOnly
  } = _a, others = __objRest$s(_a, ["inputProps", "wrapperProps", "shadow", "data", "value", "defaultValue", "onChange", "itemComponent", "onKeyDown", "onBlur", "onFocus", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "unstyled", "classNames", "styles", "filter", "maxDropdownHeight", "searchable", "clearable", "nothingFound", "clearButtonLabel", "limit", "disabled", "onSearchChange", "searchValue", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "selectOnBlur", "onCreate", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "name", "dropdownPosition", "allowDeselect", "placeholder", "filterDataOnExactSearchMatch", "clearButtonTabIndex", "form", "positionDependencies", "readOnly"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$r();
  const [dropdownOpened, _setDropdownOpened] = react.exports.useState(initiallyOpened);
  const [hovered, setHovered] = react.exports.useState(-1);
  const inputRef = react.exports.useRef();
  const itemsRefs = react.exports.useRef({});
  const [direction, setDirection] = react.exports.useState("column");
  const isColumn = direction === "column";
  const {
    scrollIntoView,
    targetRef,
    scrollableRef
  } = useScrollIntoView({
    duration: 0,
    offset: 5,
    cancelable: false,
    isList: true
  });
  const isDeselectable = allowDeselect === void 0 ? clearable : allowDeselect;
  const setDropdownOpened = (opened) => {
    if (dropdownOpened !== opened) {
      _setDropdownOpened(opened);
      const handler = opened ? onDropdownOpen : onDropdownClose;
      typeof handler === "function" && handler();
    }
  };
  const isCreatable = creatable && typeof getCreateLabel === "function";
  let createLabel = null;
  const formattedData = data.map((item) => typeof item === "string" ? {
    label: item,
    value: item
  } : item);
  const sortedData = groupOptions({
    data: formattedData
  });
  const [_value, handleChange, controlled] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const selectedValue = sortedData.find((item) => item.value === _value);
  const [inputValue, setInputValue] = useUncontrolled({
    value: searchValue,
    defaultValue: (selectedValue == null ? void 0 : selectedValue.label) || "",
    finalValue: void 0,
    onChange: onSearchChange
  });
  const handleSearchChange = (val) => {
    setInputValue(val);
    if (searchable && typeof onSearchChange === "function") {
      onSearchChange(val);
    }
  };
  const handleClear = () => {
    var _a2;
    if (!readOnly) {
      handleChange(null);
      if (!controlled) {
        handleSearchChange("");
      }
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }
  };
  react.exports.useEffect(() => {
    const newSelectedValue = sortedData.find((item) => item.value === _value);
    if (newSelectedValue) {
      handleSearchChange(newSelectedValue.label);
    } else if (!isCreatable || !_value) {
      handleSearchChange("");
    }
  }, [_value]);
  react.exports.useEffect(() => {
    if (selectedValue && (!searchable || !dropdownOpened)) {
      handleSearchChange(selectedValue.label);
    }
  }, [selectedValue == null ? void 0 : selectedValue.label]);
  const handleItemSelect = (item) => {
    if (!readOnly) {
      if (isDeselectable && (selectedValue == null ? void 0 : selectedValue.value) === item.value) {
        handleChange(null);
        setDropdownOpened(false);
      } else {
        if (item.creatable && typeof onCreate === "function") {
          const createdItem = onCreate(item.value);
          if (typeof createdItem !== "undefined" && createdItem !== null) {
            if (typeof createdItem === "string") {
              handleChange(createdItem);
            } else {
              handleChange(createdItem.value);
            }
          }
        } else {
          handleChange(item.value);
        }
        if (!controlled) {
          handleSearchChange(item.label);
        }
        setHovered(-1);
        setDropdownOpened(false);
        inputRef.current.focus();
      }
    }
  };
  const filteredData = filterData({
    data: sortedData,
    searchable,
    limit,
    searchValue: inputValue,
    filter,
    filterDataOnExactSearchMatch,
    value: _value
  });
  if (isCreatable && shouldCreate(inputValue, filteredData)) {
    createLabel = getCreateLabel(inputValue);
    filteredData.push({
      label: inputValue,
      value: inputValue,
      creatable: true
    });
  }
  const getNextIndex2 = (index, nextItem, compareFn) => {
    let i = index;
    while (compareFn(i)) {
      i = nextItem(i);
      if (!filteredData[i].disabled)
        return i;
    }
    return index;
  };
  useDidUpdate(() => {
    setHovered(-1);
  }, [inputValue]);
  const selectedItemIndex = _value ? filteredData.findIndex((el) => el.value === _value) : 0;
  const shouldShowDropdown = !readOnly && (filteredData.length > 0 ? dropdownOpened : dropdownOpened && !!nothingFound);
  const handlePrevious = () => {
    setHovered((current) => {
      var _a2;
      const nextIndex = getNextIndex2(current, (index) => index - 1, (index) => index > 0);
      targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
      shouldShowDropdown && scrollIntoView({
        alignment: isColumn ? "start" : "end"
      });
      return nextIndex;
    });
  };
  const handleNext = () => {
    setHovered((current) => {
      var _a2;
      const nextIndex = getNextIndex2(current, (index) => index + 1, (index) => index < filteredData.length - 1);
      targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
      shouldShowDropdown && scrollIntoView({
        alignment: isColumn ? "end" : "start"
      });
      return nextIndex;
    });
  };
  const scrollSelectedItemIntoView = () => window.setTimeout(() => {
    var _a2;
    targetRef.current = itemsRefs.current[(_a2 = filteredData[selectedItemIndex]) == null ? void 0 : _a2.value];
    scrollIntoView({
      alignment: isColumn ? "end" : "start"
    });
  }, 0);
  useDidUpdate(() => {
    if (shouldShowDropdown)
      scrollSelectedItemIntoView();
  }, [shouldShowDropdown]);
  const handleInputKeydown = (event) => {
    typeof onKeyDown === "function" && onKeyDown(event);
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        if (!dropdownOpened) {
          setHovered(selectedItemIndex);
          setDropdownOpened(true);
          scrollSelectedItemIntoView();
        } else {
          isColumn ? handlePrevious() : handleNext();
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (!dropdownOpened) {
          setHovered(selectedItemIndex);
          setDropdownOpened(true);
          scrollSelectedItemIntoView();
        } else {
          isColumn ? handleNext() : handlePrevious();
        }
        break;
      }
      case "Home": {
        if (!searchable) {
          event.preventDefault();
          if (!dropdownOpened) {
            setDropdownOpened(true);
          }
          const firstItemIndex = filteredData.findIndex((item) => !item.disabled);
          setHovered(firstItemIndex);
          shouldShowDropdown && scrollIntoView({
            alignment: isColumn ? "end" : "start"
          });
        }
        break;
      }
      case "End": {
        if (!searchable) {
          event.preventDefault();
          if (!dropdownOpened) {
            setDropdownOpened(true);
          }
          const lastItemIndex = filteredData.map((item) => !!item.disabled).lastIndexOf(false);
          setHovered(lastItemIndex);
          shouldShowDropdown && scrollIntoView({
            alignment: isColumn ? "end" : "start"
          });
        }
        break;
      }
      case "Escape": {
        event.preventDefault();
        setDropdownOpened(false);
        setHovered(-1);
        break;
      }
      case " ": {
        if (!searchable) {
          event.preventDefault();
          if (filteredData[hovered] && dropdownOpened) {
            handleItemSelect(filteredData[hovered]);
          } else {
            setDropdownOpened(true);
            setHovered(selectedItemIndex);
            scrollSelectedItemIntoView();
          }
        }
        break;
      }
      case "Enter": {
        if (!searchable) {
          event.preventDefault();
        }
        if (filteredData[hovered] && dropdownOpened) {
          event.preventDefault();
          handleItemSelect(filteredData[hovered]);
        }
      }
    }
  };
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    const selected = sortedData.find((item) => item.value === _value);
    if (selectOnBlur && filteredData[hovered] && dropdownOpened) {
      handleItemSelect(filteredData[hovered]);
    }
    handleSearchChange((selected == null ? void 0 : selected.label) || "");
    setDropdownOpened(false);
  };
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    if (searchable) {
      setDropdownOpened(true);
    }
  };
  const handleInputChange = (event) => {
    if (!readOnly) {
      handleSearchChange(event.currentTarget.value);
      if (clearable && event.currentTarget.value === "") {
        handleChange(null);
      }
      setHovered(-1);
      setDropdownOpened(true);
    }
  };
  const handleInputClick = () => {
    if (!readOnly) {
      setDropdownOpened(!dropdownOpened);
      if (_value && !dropdownOpened) {
        setHovered(selectedItemIndex);
      }
    }
  };
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$n(__spreadValues$H({}, wrapperProps), {
      __staticSelector: "Select"
    }),
    children: /* @__PURE__ */ jsxs(SelectPopover, {
      opened: shouldShowDropdown,
      transition,
      transitionDuration,
      shadow: "sm",
      withinPortal,
      __staticSelector: "Select",
      onDirectionChange: setDirection,
      switchDirectionOnFlip,
      zIndex,
      dropdownPosition,
      positionDependencies,
      classNames,
      styles,
      unstyled,
      children: [/* @__PURE__ */ jsx(SelectPopover.Target, {
        children: /* @__PURE__ */ jsxs("div", {
          role: "combobox",
          "aria-haspopup": "listbox",
          "aria-owns": shouldShowDropdown ? `${inputProps.id}-items` : null,
          "aria-controls": inputProps.id,
          "aria-expanded": shouldShowDropdown,
          onMouseLeave: () => setHovered(-1),
          tabIndex: -1,
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name,
            value: _value || "",
            form,
            disabled
          }), /* @__PURE__ */ jsx(Input, {
            ...__spreadValues$H(__spreadProps$n(__spreadValues$H(__spreadValues$H({
              autoComplete: "off",
              type: "search"
            }, inputProps), others), {
              ref: useMergedRef(ref, inputRef),
              onKeyDown: handleInputKeydown,
              __staticSelector: "Select",
              value: inputValue,
              placeholder,
              onChange: handleInputChange,
              "aria-autocomplete": "list",
              "aria-controls": shouldShowDropdown ? `${inputProps.id}-items` : null,
              "aria-activedescendant": hovered >= 0 ? `${inputProps.id}-${hovered}` : null,
              onMouseDown: handleInputClick,
              onBlur: handleInputBlur,
              onFocus: handleInputFocus,
              readOnly: !searchable || readOnly,
              disabled,
              "data-mantine-stop-propagation": shouldShowDropdown,
              name: null,
              classNames: __spreadProps$n(__spreadValues$H({}, classNames), {
                input: cx({
                  [classes.input]: !searchable
                }, classNames == null ? void 0 : classNames.input)
              })
            }), getSelectRightSectionProps({
              theme,
              rightSection,
              rightSectionWidth,
              styles,
              size: inputProps.size,
              shouldClear: clearable && !!selectedValue,
              clearButtonLabel,
              onClear: handleClear,
              error: wrapperProps.error,
              clearButtonTabIndex,
              disabled,
              readOnly
            }))
          })]
        })
      }), /* @__PURE__ */ jsx(SelectPopover.Dropdown, {
        component: dropdownComponent || SelectScrollArea,
        maxHeight: maxDropdownHeight,
        direction,
        id: inputProps.id,
        innerRef: scrollableRef,
        __staticSelector: "Select",
        classNames,
        styles,
        children: /* @__PURE__ */ jsx(SelectItems, {
          data: filteredData,
          hovered,
          classNames,
          styles,
          isItemSelected: (val) => val === _value,
          uuid: inputProps.id,
          __staticSelector: "Select",
          onItemHover: setHovered,
          onItemSelect: handleItemSelect,
          itemsRefs,
          itemComponent,
          size: inputProps.size,
          nothingFound,
          creatable: isCreatable && !!createLabel,
          createLabel,
          "aria-label": wrapperProps.label,
          unstyled
        })
      })]
    })
  });
});
Select.displayName = "@mantine/core/Select";
const fade = keyframes({
  "from, to": { opacity: 0.4 },
  "50%": { opacity: 1 }
});
var useStyles$o = createStyles((theme, { height, width, radius, circle, animate }) => ({
  root: {
    height,
    width: circle ? height : width,
    borderRadius: circle ? height : theme.fn.radius(radius),
    position: "relative",
    overflow: "hidden",
    WebkitTransform: "translateZ(0)"
  },
  visible: {
    "&::before": {
      content: '""',
      position: "absolute",
      background: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10
    },
    "&::after": {
      content: '""',
      position: "absolute",
      background: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      animation: animate ? `${fade} 1500ms linear infinite` : "none",
      zIndex: 11
    }
  }
}));
const useStyles$p = useStyles$o;
var __defProp$G = Object.defineProperty;
var __getOwnPropSymbols$G = Object.getOwnPropertySymbols;
var __hasOwnProp$G = Object.prototype.hasOwnProperty;
var __propIsEnum$G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$G = (obj, key, value) => key in obj ? __defProp$G(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$G = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$G.call(b, prop))
      __defNormalProp$G(a, prop, b[prop]);
  if (__getOwnPropSymbols$G)
    for (var prop of __getOwnPropSymbols$G(b)) {
      if (__propIsEnum$G.call(b, prop))
        __defNormalProp$G(a, prop, b[prop]);
    }
  return a;
};
var __objRest$r = (source, exclude) => {
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
const defaultProps$c = {
  height: "auto",
  width: "100%",
  visible: true,
  animate: true
};
const Skeleton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Skeleton", defaultProps$c, props), {
    height,
    width,
    visible: visible2,
    animate,
    className,
    circle,
    radius,
    unstyled
  } = _a, others = __objRest$r(_a, ["height", "width", "visible", "animate", "className", "circle", "radius", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$p({
    height,
    width,
    circle,
    radius,
    animate
  }, {
    unstyled,
    name: "Skeleton"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$G({
      className: cx(classes.root, {
        [classes.visible]: visible2
      }, className),
      ref
    }, others)
  });
});
Skeleton.displayName = "@mantine/core/Skeleton";
var __defProp$F = Object.defineProperty;
var __defProps$m = Object.defineProperties;
var __getOwnPropDescs$m = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$F = Object.getOwnPropertySymbols;
var __hasOwnProp$F = Object.prototype.hasOwnProperty;
var __propIsEnum$F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$F = (obj, key, value) => key in obj ? __defProp$F(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$F = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$F.call(b, prop))
      __defNormalProp$F(a, prop, b[prop]);
  if (__getOwnPropSymbols$F)
    for (var prop of __getOwnPropSymbols$F(b)) {
      if (__propIsEnum$F.call(b, prop))
        __defNormalProp$F(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$m = (a, b) => __defProps$m(a, __getOwnPropDescs$m(b));
const switchHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 30,
  xl: 36
};
const switchWidth = {
  xs: 32,
  sm: 38,
  md: 46,
  lg: 56,
  xl: 72
};
const handleSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28
};
const labelFontSizes = {
  xs: 5,
  sm: 6,
  md: 7,
  lg: 9,
  xl: 11
};
const trackLabelPaddings = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 8,
  xl: 10
};
var useStyles$m = createStyles((theme, { size: size2, radius, color, labelPosition, error }) => {
  const handleSize = theme.fn.size({ size: size2, sizes: handleSizes });
  const borderRadius = theme.fn.size({ size: radius, sizes: theme.radius });
  const colors = theme.fn.variant({ variant: "filled", color });
  const trackWidth = theme.fn.size({ size: size2, sizes: switchWidth });
  const trackPadding = size2 === "xs" ? 1 : 2;
  const errorColor = theme.fn.variant({ variant: "filled", color: "red" }).background;
  return {
    root: {},
    description: {
      marginTop: `calc(${theme.spacing.xs}px / 2)`,
      [labelPosition === "left" ? "paddingRight" : "paddingLeft"]: theme.spacing.sm
    },
    error: {
      marginTop: `calc(${theme.spacing.xs}px / 2)`,
      [labelPosition === "left" ? "paddingRight" : "paddingLeft"]: theme.spacing.sm
    },
    label: {
      cursor: theme.cursorType,
      [labelPosition === "left" ? "paddingRight" : "paddingLeft"]: theme.spacing.sm
    },
    body: {
      display: "flex"
    },
    input: {
      clip: "rect(1px, 1px, 1px, 1px)",
      height: "1px",
      overflow: "hidden",
      width: "1px",
      whiteSpace: "nowrap",
      padding: "0",
      WebkitClipPath: "inset(50%)",
      clipPath: "inset(50%)"
    },
    track: __spreadProps$m(__spreadValues$F({}, theme.fn.focusStyles("input:focus + &")), {
      cursor: theme.cursorType,
      overflow: "hidden",
      WebkitTapHighlightColor: "transparent",
      position: "relative",
      borderRadius,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
      border: `1px solid ${error ? errorColor : theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      height: theme.fn.size({ size: size2, sizes: switchHeight }),
      minWidth: trackWidth,
      margin: 0,
      transitionProperty: "background-color, border-color",
      transitionTimingFunction: theme.transitionTimingFunction,
      transitionDuration: "150ms",
      boxSizing: "border-box",
      appearance: "none",
      display: "flex",
      alignItems: "center",
      fontSize: theme.fn.size({ size: size2, sizes: labelFontSizes }),
      fontWeight: 600,
      order: labelPosition === "left" ? 2 : 1,
      userSelect: "none",
      MozUserSelect: "none",
      WebkitUserSelect: "none",
      MsUserSelect: "none",
      zIndex: 0,
      lineHeight: 0,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
      transition: `color 150ms ${theme.transitionTimingFunction}`,
      "input:checked + &": {
        backgroundColor: colors.background,
        borderColor: colors.background,
        color: theme.white,
        transition: `color 150ms ${theme.transitionTimingFunction}`
      },
      "input:disabled + &": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        cursor: "not-allowed"
      }
    }),
    thumb: {
      position: "absolute",
      zIndex: 1,
      borderRadius,
      boxSizing: "border-box",
      display: "flex",
      backgroundColor: theme.white,
      height: handleSize,
      width: handleSize,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.white : theme.colors.gray[3]}`,
      left: `${trackPadding}px`,
      transition: `left 150ms ${theme.transitionTimingFunction}`,
      "& > *": {
        margin: "auto"
      },
      "@media (prefers-reduced-motion)": {
        transitionDuration: theme.respectReducedMotion ? "0ms" : ""
      },
      "input:checked + * > &": {
        left: `calc(100% - ${handleSize}px - ${trackPadding}px)`,
        borderColor: theme.white
      },
      "input:disabled + * > &": {
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[0]
      }
    },
    labelWrapper: __spreadProps$m(__spreadValues$F({}, theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      fontFamily: theme.fontFamily,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      cursor: theme.cursorType,
      order: labelPosition === "left" ? 1 : 2,
      "& label[data-disabled]": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      }
    }),
    trackLabel: {
      height: "100%",
      display: "grid",
      placeContent: "center",
      minWidth: trackWidth - handleSize,
      paddingInline: theme.fn.size({ size: size2, sizes: trackLabelPaddings }),
      margin: `0 0 0 ${handleSize + trackPadding}px`,
      transition: `margin 150ms ${theme.transitionTimingFunction}`,
      "input:checked + * > &": {
        margin: `0 ${handleSize + trackPadding}px 0 0`
      }
    }
  };
});
const useStyles$n = useStyles$m;
const SwitchGroupContext = react.exports.createContext(null);
const SwitchGroupProvider = SwitchGroupContext.Provider;
const useSwitchGroupContext = () => react.exports.useContext(SwitchGroupContext);
var __defProp$E = Object.defineProperty;
var __getOwnPropSymbols$E = Object.getOwnPropertySymbols;
var __hasOwnProp$E = Object.prototype.hasOwnProperty;
var __propIsEnum$E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$E = (obj, key, value) => key in obj ? __defProp$E(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$E = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$E.call(b, prop))
      __defNormalProp$E(a, prop, b[prop]);
  if (__getOwnPropSymbols$E)
    for (var prop of __getOwnPropSymbols$E(b)) {
      if (__propIsEnum$E.call(b, prop))
        __defNormalProp$E(a, prop, b[prop]);
    }
  return a;
};
var __objRest$q = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$E.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$E)
    for (var prop of __getOwnPropSymbols$E(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$E.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$b = {
  orientation: "horizontal",
  spacing: "lg",
  size: "sm",
  offset: "xs"
};
const SwitchGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("SwitchGroup", defaultProps$b, props), {
    children,
    value,
    defaultValue,
    onChange,
    orientation,
    spacing,
    size: size2,
    wrapperProps,
    offset: offset2
  } = _a, others = __objRest$q(_a, ["children", "value", "defaultValue", "onChange", "orientation", "spacing", "size", "wrapperProps", "offset"]);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange
  });
  const handleChange = (event) => {
    const itemValue = event.currentTarget.value;
    setValue(_value.includes(itemValue) ? _value.filter((item) => item !== itemValue) : [..._value, itemValue]);
  };
  return /* @__PURE__ */ jsx(SwitchGroupProvider, {
    value: {
      value: _value,
      onChange: handleChange,
      size: size2
    },
    children: /* @__PURE__ */ jsx(Input.Wrapper, {
      ...__spreadValues$E(__spreadValues$E({
        labelElement: "div",
        size: size2,
        __staticSelector: "SwitchGroup",
        ref
      }, wrapperProps), others),
      children: /* @__PURE__ */ jsx(InputsGroup, {
        spacing,
        orientation,
        offset: offset2,
        children
      })
    })
  });
});
SwitchGroup.displayName = "@mantine/core/SwitchGroup";
var __defProp$D = Object.defineProperty;
var __defProps$l = Object.defineProperties;
var __getOwnPropDescs$l = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$D = Object.getOwnPropertySymbols;
var __hasOwnProp$D = Object.prototype.hasOwnProperty;
var __propIsEnum$D = Object.prototype.propertyIsEnumerable;
var __defNormalProp$D = (obj, key, value) => key in obj ? __defProp$D(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$D = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$D.call(b, prop))
      __defNormalProp$D(a, prop, b[prop]);
  if (__getOwnPropSymbols$D)
    for (var prop of __getOwnPropSymbols$D(b)) {
      if (__propIsEnum$D.call(b, prop))
        __defNormalProp$D(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$l = (a, b) => __defProps$l(a, __getOwnPropDescs$l(b));
var __objRest$p = (source, exclude) => {
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
const defaultProps$a = {
  offLabel: "",
  onLabel: "",
  size: "sm",
  radius: "xl",
  error: false
};
const Switch = react.exports.forwardRef((props, ref) => {
  var _b;
  const _a = useComponentDefaultProps("Switch", defaultProps$a, props), {
    className,
    color,
    label,
    offLabel,
    onLabel,
    id,
    style,
    size: size2,
    radius,
    wrapperProps,
    children,
    unstyled,
    styles,
    classNames,
    thumbIcon,
    sx,
    checked,
    defaultChecked,
    onChange,
    labelPosition,
    description,
    error
  } = _a, others = __objRest$p(_a, ["className", "color", "label", "offLabel", "onLabel", "id", "style", "size", "radius", "wrapperProps", "children", "unstyled", "styles", "classNames", "thumbIcon", "sx", "checked", "defaultChecked", "onChange", "labelPosition", "description", "error"]);
  const ctx = useSwitchGroupContext();
  const {
    classes,
    cx
  } = useStyles$n({
    size: (ctx == null ? void 0 : ctx.size) || size2,
    color,
    radius,
    labelPosition,
    error: !!error
  }, {
    unstyled,
    styles,
    classNames,
    name: "Switch"
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const uuid2 = useId(id);
  const contextProps = ctx ? {
    checked: ctx.value.includes(rest.value),
    onChange: ctx.onChange
  } : {};
  const [_checked, handleChange] = useUncontrolled({
    value: (_b = contextProps.checked) != null ? _b : checked,
    defaultValue: defaultChecked,
    finalValue: false
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$D(__spreadValues$D({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsxs("div", {
      className: classes.body,
      children: [/* @__PURE__ */ jsx("input", {
        ...__spreadProps$l(__spreadValues$D({}, rest), {
          checked: _checked,
          onChange: (event) => {
            ctx ? contextProps.onChange(event) : onChange == null ? void 0 : onChange(event);
            handleChange(event.currentTarget.checked);
          },
          id: uuid2,
          ref,
          type: "checkbox",
          className: classes.input
        })
      }), /* @__PURE__ */ jsxs("label", {
        htmlFor: uuid2,
        className: classes.track,
        children: [/* @__PURE__ */ jsx("div", {
          className: classes.thumb,
          children: thumbIcon
        }), /* @__PURE__ */ jsx("div", {
          className: classes.trackLabel,
          children: _checked ? onLabel : offLabel
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: classes.labelWrapper,
        children: [label && /* @__PURE__ */ jsx("label", {
          className: classes.label,
          "data-disabled": rest.disabled || void 0,
          htmlFor: uuid2,
          "data-testid": "label",
          children: label
        }), description && /* @__PURE__ */ jsx(Input.Description, {
          className: classes.description,
          children: description
        }), error && error !== "boolean" && /* @__PURE__ */ jsx(Input.Error, {
          className: classes.error,
          children: error
        })]
      })]
    })
  });
});
Switch.displayName = "@mantine/core/Switch";
Switch.Group = SwitchGroup;
var __defProp$C = Object.defineProperty;
var __defProps$k = Object.defineProperties;
var __getOwnPropDescs$k = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$C = Object.getOwnPropertySymbols;
var __hasOwnProp$C = Object.prototype.hasOwnProperty;
var __propIsEnum$C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$C = (obj, key, value) => key in obj ? __defProp$C(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$C = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$C.call(b, prop))
      __defNormalProp$C(a, prop, b[prop]);
  if (__getOwnPropSymbols$C)
    for (var prop of __getOwnPropSymbols$C(b)) {
      if (__propIsEnum$C.call(b, prop))
        __defNormalProp$C(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$k = (a, b) => __defProps$k(a, __getOwnPropDescs$k(b));
var useStyles$k = createStyles((theme, {
  captionSide,
  horizontalSpacing,
  verticalSpacing,
  fontSize,
  withBorder,
  withColumnBorders
}) => {
  const border = `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`;
  return {
    root: __spreadProps$k(__spreadValues$C({}, theme.fn.fontStyles()), {
      width: "100%",
      borderCollapse: "collapse",
      captionSide,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      lineHeight: theme.lineHeight,
      border: withBorder ? border : "",
      "& caption": {
        marginTop: captionSide === "top" ? 0 : theme.spacing.xs,
        marginBottom: captionSide === "bottom" ? 0 : theme.spacing.xs,
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6]
      },
      "& thead tr th, & tfoot tr th": {
        textAlign: "left",
        fontWeight: "bold",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fn.size({ size: fontSize, sizes: theme.fontSizes }),
        padding: `${theme.fn.size({
          size: verticalSpacing,
          sizes: theme.spacing
        })}px ${theme.fn.size({ size: horizontalSpacing, sizes: theme.spacing })}px`
      },
      "& thead tr th": {
        borderBottom: border
      },
      "& tfoot tr th": {
        borderTop: border
      },
      "& tbody tr td": {
        padding: `${theme.fn.size({
          size: verticalSpacing,
          sizes: theme.spacing
        })}px ${theme.fn.size({ size: horizontalSpacing, sizes: theme.spacing })}px`,
        borderBottom: border,
        fontSize: theme.fn.size({ size: fontSize, sizes: theme.fontSizes })
      },
      "& tbody tr:last-of-type td": {
        borderBottom: "none"
      },
      "& th + th, & td + td": {
        borderLeft: withColumnBorders ? border : ""
      },
      "&[data-striped] tbody tr:nth-of-type(odd)": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
      },
      "&[data-hover] tbody tr": theme.fn.hover({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
      })
    })
  };
});
const useStyles$l = useStyles$k;
var __defProp$B = Object.defineProperty;
var __defProps$j = Object.defineProperties;
var __getOwnPropDescs$j = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$B = Object.getOwnPropertySymbols;
var __hasOwnProp$B = Object.prototype.hasOwnProperty;
var __propIsEnum$B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$B = (obj, key, value) => key in obj ? __defProp$B(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$B = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$B.call(b, prop))
      __defNormalProp$B(a, prop, b[prop]);
  if (__getOwnPropSymbols$B)
    for (var prop of __getOwnPropSymbols$B(b)) {
      if (__propIsEnum$B.call(b, prop))
        __defNormalProp$B(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$j = (a, b) => __defProps$j(a, __getOwnPropDescs$j(b));
var __objRest$o = (source, exclude) => {
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
const defaultProps$9 = {
  striped: false,
  highlightOnHover: false,
  captionSide: "top",
  horizontalSpacing: "xs",
  fontSize: "sm",
  verticalSpacing: 7,
  withBorder: false,
  withColumnBorders: false
};
const Table = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Table", defaultProps$9, props), {
    className,
    children,
    striped,
    highlightOnHover,
    captionSide,
    horizontalSpacing,
    verticalSpacing,
    fontSize,
    unstyled,
    withBorder,
    withColumnBorders
  } = _a, others = __objRest$o(_a, ["className", "children", "striped", "highlightOnHover", "captionSide", "horizontalSpacing", "verticalSpacing", "fontSize", "unstyled", "withBorder", "withColumnBorders"]);
  const {
    classes,
    cx
  } = useStyles$l({
    captionSide,
    verticalSpacing,
    horizontalSpacing,
    fontSize,
    withBorder,
    withColumnBorders
  }, {
    unstyled,
    name: "Table"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$j(__spreadValues$B({}, others), {
      component: "table",
      ref,
      className: cx(classes.root, className),
      "data-striped": striped || void 0,
      "data-hover": highlightOnHover || void 0
    }),
    children
  });
});
Table.displayName = "@mantine/core/Table";
var __defProp$A = Object.defineProperty;
var __defProps$i = Object.defineProperties;
var __getOwnPropDescs$i = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$A = Object.getOwnPropertySymbols;
var __hasOwnProp$A = Object.prototype.hasOwnProperty;
var __propIsEnum$A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$A = (obj, key, value) => key in obj ? __defProp$A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$A = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$A.call(b, prop))
      __defNormalProp$A(a, prop, b[prop]);
  if (__getOwnPropSymbols$A)
    for (var prop of __getOwnPropSymbols$A(b)) {
      if (__propIsEnum$A.call(b, prop))
        __defNormalProp$A(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$i = (a, b) => __defProps$i(a, __getOwnPropDescs$i(b));
const sizes$4 = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40
};
var useStyles$i = createStyles((theme, { color, size: size2, radius, gradient, variant }) => {
  const colors = theme.fn.variant({
    variant,
    color: color || theme.primaryColor,
    gradient,
    primaryFallback: false
  });
  const iconSize = theme.fn.size({ size: size2, sizes: sizes$4 });
  return {
    root: __spreadProps$i(__spreadValues$A({}, theme.fn.fontStyles()), {
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
const useStyles$j = useStyles$i;
var __defProp$z = Object.defineProperty;
var __getOwnPropSymbols$z = Object.getOwnPropertySymbols;
var __hasOwnProp$z = Object.prototype.hasOwnProperty;
var __propIsEnum$z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$z = (obj, key, value) => key in obj ? __defProp$z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$z.call(b, prop))
      __defNormalProp$z(a, prop, b[prop]);
  if (__getOwnPropSymbols$z)
    for (var prop of __getOwnPropSymbols$z(b)) {
      if (__propIsEnum$z.call(b, prop))
        __defNormalProp$z(a, prop, b[prop]);
    }
  return a;
};
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
const defaultProps$8 = {
  size: "md",
  variant: "filled"
};
const ThemeIcon = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ThemeIcon", defaultProps$8, props), {
    className,
    size: size2,
    radius,
    variant,
    color,
    children,
    gradient,
    unstyled
  } = _a, others = __objRest$n(_a, ["className", "size", "radius", "variant", "color", "children", "gradient", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$j({
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
    ...__spreadValues$z({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
ThemeIcon.displayName = "@mantine/core/ThemeIcon";
class InfiniteQueryObserver extends QueryObserver {
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options, notifyOptions) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    }, notifyOptions);
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: {
          direction: "forward",
          pageParam
        }
      }
    });
  }
  fetchPreviousPage({
    pageParam,
    ...options
  } = {}) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: {
          direction: "backward",
          pageParam
        }
      }
    });
  }
  createResult(query, options) {
    var _state$data, _state$data2, _state$fetchMeta, _state$fetchMeta$fetc, _state$fetchMeta2, _state$fetchMeta2$fet;
    const {
      state
    } = query;
    const result = super.createResult(query, options);
    return {
      ...result,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, (_state$data = state.data) == null ? void 0 : _state$data.pages),
      hasPreviousPage: hasPreviousPage(options, (_state$data2 = state.data) == null ? void 0 : _state$data2.pages),
      isFetchingNextPage: state.fetchStatus === "fetching" && ((_state$fetchMeta = state.fetchMeta) == null ? void 0 : (_state$fetchMeta$fetc = _state$fetchMeta.fetchMore) == null ? void 0 : _state$fetchMeta$fetc.direction) === "forward",
      isFetchingPreviousPage: state.fetchStatus === "fetching" && ((_state$fetchMeta2 = state.fetchMeta) == null ? void 0 : (_state$fetchMeta2$fet = _state$fetchMeta2.fetchMore) == null ? void 0 : _state$fetchMeta2$fet.direction) === "backward"
    };
  }
}
class MutationObserver extends Subscribable {
  constructor(client, options) {
    super();
    this.client = client;
    this.setOptions(options);
    this.bindMethods();
    this.updateResult();
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    this.options = this.client.defaultMutationOptions(options);
    if (!shallowEqualObjects(prevOptions, this.options)) {
      this.client.getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: this.currentMutation,
        observer: this
      });
    }
  }
  onUnsubscribe() {
    if (!this.listeners.length) {
      var _this$currentMutation;
      (_this$currentMutation = this.currentMutation) == null ? void 0 : _this$currentMutation.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    this.updateResult();
    const notifyOptions = {
      listeners: true
    };
    if (action.type === "success") {
      notifyOptions.onSuccess = true;
    } else if (action.type === "error") {
      notifyOptions.onError = true;
    }
    this.notify(notifyOptions);
  }
  getCurrentResult() {
    return this.currentResult;
  }
  reset() {
    this.currentMutation = void 0;
    this.updateResult();
    this.notify({
      listeners: true
    });
  }
  mutate(variables, options) {
    this.mutateOptions = options;
    if (this.currentMutation) {
      this.currentMutation.removeObserver(this);
    }
    this.currentMutation = this.client.getMutationCache().build(this.client, {
      ...this.options,
      variables: typeof variables !== "undefined" ? variables : this.options.variables
    });
    this.currentMutation.addObserver(this);
    return this.currentMutation.execute();
  }
  updateResult() {
    const state = this.currentMutation ? this.currentMutation.state : getDefaultState();
    const result = {
      ...state,
      isLoading: state.status === "loading",
      isSuccess: state.status === "success",
      isError: state.status === "error",
      isIdle: state.status === "idle",
      mutate: this.mutate,
      reset: this.reset
    };
    this.currentResult = result;
  }
  notify(options) {
    notifyManager.batch(() => {
      if (this.mutateOptions) {
        if (options.onSuccess) {
          var _this$mutateOptions$o, _this$mutateOptions, _this$mutateOptions$o2, _this$mutateOptions2;
          (_this$mutateOptions$o = (_this$mutateOptions = this.mutateOptions).onSuccess) == null ? void 0 : _this$mutateOptions$o.call(_this$mutateOptions, this.currentResult.data, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o2 = (_this$mutateOptions2 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o2.call(_this$mutateOptions2, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
        } else if (options.onError) {
          var _this$mutateOptions$o3, _this$mutateOptions3, _this$mutateOptions$o4, _this$mutateOptions4;
          (_this$mutateOptions$o3 = (_this$mutateOptions3 = this.mutateOptions).onError) == null ? void 0 : _this$mutateOptions$o3.call(_this$mutateOptions3, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
          (_this$mutateOptions$o4 = (_this$mutateOptions4 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o4.call(_this$mutateOptions4, void 0, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
        }
      }
      if (options.listeners) {
        this.listeners.forEach((listener) => {
          listener(this.currentResult);
        });
      }
    });
  }
}
function useMutation(arg1, arg2, arg3) {
  const options = parseMutationArgs(arg1, arg2, arg3);
  const queryClient = useQueryClient({
    context: options.context
  });
  const [observer] = react.exports.useState(() => new MutationObserver(queryClient, options));
  react.exports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = useSyncExternalStore(react.exports.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  const mutate = react.exports.useCallback((variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop$2);
  }, [observer]);
  if (result.error && shouldThrowError(observer.options.useErrorBoundary, [result.error])) {
    throw result.error;
  }
  return {
    ...result,
    mutate,
    mutateAsync: result.mutate
  };
}
function noop$2() {
}
function useInfiniteQuery(arg1, arg2, arg3) {
  const options = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(options, InfiniteQueryObserver);
}
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
function noop$1() {
}
Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop$1,
  onEntering: noop$1,
  onEntered: noop$1,
  onExit: noop$1,
  onExiting: noop$1,
  onExited: noop$1
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
var defaultProps$7 = {
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
TransitionGroup.defaultProps = defaultProps$7;
const TransitionGroup$1 = TransitionGroup;
const [useNotificationsEvents, createEvent$3] = createUseExternalEvents("mantine-notifications");
const showNotification = createEvent$3("show");
createEvent$3("hide");
createEvent$3("clean");
createEvent$3("cleanQueue");
createEvent$3("update");
function getPositionStyles([vertical, horizontal], spacing) {
  const styles = {};
  vertical === "top" && (styles.top = spacing);
  vertical === "bottom" && (styles.bottom = spacing);
  horizontal === "left" && (styles.left = spacing);
  horizontal === "right" && (styles.right = spacing);
  horizontal === "center" && (styles.left = "50%", styles.transform = "translateX(-50%)");
  return styles;
}
var __defProp$y = Object.defineProperty;
var __getOwnPropSymbols$y = Object.getOwnPropertySymbols;
var __hasOwnProp$y = Object.prototype.hasOwnProperty;
var __propIsEnum$y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$y = (obj, key, value) => key in obj ? __defProp$y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
  return __spreadValues$y(__spreadValues$y({}, commonStyles), transitionStyles[state]);
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
var __defProp$x = Object.defineProperty;
var __defProps$h = Object.defineProperties;
var __getOwnPropDescs$h = Object.getOwnPropertyDescriptors;
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
var __spreadProps$h = (a, b) => __defProps$h(a, __getOwnPropDescs$h(b));
var __objRest$m = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$x.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$x)
    for (var prop of __getOwnPropSymbols$x(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$x.call(source, prop))
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
  } = _b, others = __objRest$m(_b, ["notification", "autoClose", "onHide", "innerRef"]);
  const _a2 = notification, {
    autoClose: notificationAutoClose,
    message
  } = _a2, notificationProps = __objRest$m(_a2, ["autoClose", "message"]);
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
    ...__spreadProps$h(__spreadValues$x(__spreadValues$x({}, notificationProps), others), {
      onClose: handleHide,
      onMouseEnter: cancelDelayedHide,
      onMouseLeave: handleDelayedHide,
      ref: innerRef
    }),
    children: message
  });
}
NotificationContainer.displayName = "@mantine/notifications/NotificationContainer";
var useStyles$g = createStyles((theme, { zIndex }) => ({
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
const useStyles$h = useStyles$g;
var __defProp$w = Object.defineProperty;
var __defProps$g = Object.defineProperties;
var __getOwnPropDescs$g = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$w = Object.getOwnPropertySymbols;
var __hasOwnProp$w = Object.prototype.hasOwnProperty;
var __propIsEnum$w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$w = (obj, key, value) => key in obj ? __defProp$w(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$g = (a, b) => __defProps$g(a, __getOwnPropDescs$g(b));
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
      return [...notifications, __spreadProps$g(__spreadValues$w({}, notification), { id })];
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
var __defProp$v = Object.defineProperty;
var __getOwnPropSymbols$v = Object.getOwnPropertySymbols;
var __hasOwnProp$v = Object.prototype.hasOwnProperty;
var __propIsEnum$v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$v = (obj, key, value) => key in obj ? __defProp$v(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$l = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$v.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$v)
    for (var prop of __getOwnPropSymbols$v(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$v.call(source, prop))
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
  } = _b, others = __objRest$l(_b, ["className", "position", "autoClose", "transitionDuration", "containerWidth", "notificationMaxHeight", "limit", "zIndex", "style", "children", "target"]);
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
  } = useStyles$h({
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
      sx: [__spreadValues$v({}, getNotificationStateStyles({
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
        ...__spreadValues$v({
          className: cx(classes.notifications, className),
          style,
          sx: __spreadValues$v({
            maxWidth: containerWidth
          }, getPositionStyles(positioning, theme.spacing.md))
        }, others),
        children: /* @__PURE__ */ jsx(TransitionGroup$1, {
          children: items
        })
      })
    }), children]
  });
}
NotificationsProvider.displayName = "@mantine/notifications/NotificationsProvider";
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
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function getStatusMessage(check) {
  var _a, _b;
  let statusMsg = "";
  if (check.status[0] === "failed") {
    if (check.failReasons.includes("different_images")) {
      statusMsg = " - images are different";
      const checkResult = check.result ? JSON.parse(check.result) : null;
      let diffPercent = checkResult.misMatchPercentage ? checkResult.misMatchPercentage : "";
      diffPercent = (diffPercent === "0.00" || diffPercent === "") && ((_b = (_a = checkResult.rawMisMatchPercentage) == null ? void 0 : _a.toString()) == null ? void 0 : _b.length) > 0 ? checkResult.rawMisMatchPercentage : checkResult.misMatchPercentage;
      statusMsg += ` (${diffPercent}%)`;
    }
    if (check.failReasons.includes("wrong_dimensions")) {
      statusMsg = " - images have wrong  dimensions";
    }
    if (check.failReasons.includes("not_accepted")) {
      statusMsg = " - previous check with same parameter is not accepted";
    }
  }
  if (check.status[0] === "new") {
    statusMsg = " - first time check";
  }
  if (check.status[0] === "passed") {
    statusMsg = " - successful check";
  }
  return statusMsg;
}
function generateItemFilter(label, operator, value) {
  const transform = {
    eq: () => ({
      $eq: value
    }),
    ne: () => ({
      $ne: value
    }),
    lt: () => ({
      $lt: value
    }),
    gt: () => ({
      $gt: value
    }),
    contains: () => ({
      $regex: escapeRegExp(value),
      $options: "im"
    }),
    not_contains: () => ({
      $regex: `^((?!${escapeRegExp(value)}).)*$`,
      $options: "im"
    })
  };
  return {
    [label]: transform[operator]()
  };
}
function getEncodedValue(input, allowEmptyString) {
  if (input == null) {
    return input;
  }
  if (input.length === 0 && (!allowEmptyString || allowEmptyString && input !== "")) {
    return null;
  }
  const str = input instanceof Array ? input[0] : input;
  if (str == null) {
    return str;
  }
  if (!allowEmptyString && str === "") {
    return null;
  }
  return str;
}
function encodeString(str) {
  if (str == null) {
    return str;
  }
  return String(str);
}
function decodeString(input) {
  const str = getEncodedValue(input, true);
  if (str == null)
    return str;
  return String(str);
}
function encodeJson(any) {
  if (any == null) {
    return any;
  }
  return JSON.stringify(any);
}
function decodeJson(input) {
  const jsonStr = getEncodedValue(input);
  if (jsonStr == null)
    return jsonStr;
  let result = null;
  try {
    result = JSON.parse(jsonStr);
  } catch (e) {
  }
  return result;
}
const StringParam = {
  encode: encodeString,
  decode: decodeString
};
const JsonParam = {
  encode: encodeJson,
  decode: decodeJson
};
function objectToSearchString(encodedParams) {
  const params = new URLSearchParams();
  const entries = Object.entries(encodedParams);
  for (const [key, value] of entries) {
    if (value === void 0)
      continue;
    if (value === null)
      continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item != null ? item : "");
      }
    } else {
      params.append(key, value);
    }
  }
  return params.toString();
}
`{}[],":`.split("").map((d) => [d, encodeURIComponent(d)]);
function encodeQueryParams(paramConfigMap, query) {
  const encodedQuery = {};
  const paramNames = Object.keys(query);
  for (const paramName of paramNames) {
    const decodedValue = query[paramName];
    if (!paramConfigMap[paramName]) {
      encodedQuery[paramName] = decodedValue == null ? decodedValue : String(decodedValue);
    } else {
      encodedQuery[paramName] = paramConfigMap[paramName].encode(query[paramName]);
    }
  }
  return encodedQuery;
}
function searchStringToObject(searchString) {
  const params = new URLSearchParams(searchString);
  const parsed = {};
  for (let [key, value] of params) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      if (Array.isArray(parsed[key])) {
        parsed[key].push(value);
      } else {
        parsed[key] = [parsed[key], value];
      }
    } else {
      parsed[key] = value;
    }
  }
  return parsed;
}
class DecodedParamCache {
  constructor() {
    this.paramsMap = /* @__PURE__ */ new Map();
    this.registeredParams = /* @__PURE__ */ new Map();
  }
  set(param, stringifiedValue, decodedValue, decode) {
    this.paramsMap.set(param, {
      stringified: stringifiedValue,
      decoded: decodedValue,
      decode
    });
  }
  has(param, stringifiedValue, decode) {
    if (!this.paramsMap.has(param))
      return false;
    const cachedParam = this.paramsMap.get(param);
    if (!cachedParam)
      return false;
    return cachedParam.stringified === stringifiedValue && (decode == null || cachedParam.decode === decode);
  }
  get(param) {
    var _a;
    if (this.paramsMap.has(param))
      return (_a = this.paramsMap.get(param)) == null ? void 0 : _a.decoded;
    return void 0;
  }
  registerParams(paramNames) {
    for (const param of paramNames) {
      const currValue = this.registeredParams.get(param) || 0;
      this.registeredParams.set(param, currValue + 1);
    }
  }
  unregisterParams(paramNames) {
    for (const param of paramNames) {
      const value = (this.registeredParams.get(param) || 0) - 1;
      if (value <= 0) {
        this.registeredParams.delete(param);
        if (this.paramsMap.has(param)) {
          this.paramsMap.delete(param);
        }
      } else {
        this.registeredParams.set(param, value);
      }
    }
  }
  clear() {
    this.paramsMap.clear();
    this.registeredParams.clear();
  }
}
const decodedParamCache = new DecodedParamCache();
function convertInheritedParamStringsToParams(paramConfigMapWithInherit, options) {
  var _a, _b, _c;
  const paramConfigMap = {};
  let hasInherit = false;
  const hookKeys = Object.keys(paramConfigMapWithInherit);
  let paramKeys = hookKeys;
  const includeKnownParams = options.includeKnownParams || options.includeKnownParams !== false && hookKeys.length === 0;
  if (includeKnownParams) {
    const knownKeys = Object.keys((_a = options.params) != null ? _a : {});
    paramKeys.push(...knownKeys);
  }
  for (const key of paramKeys) {
    const param = paramConfigMapWithInherit[key];
    if (param != null && typeof param === "object") {
      paramConfigMap[key] = param;
      continue;
    }
    hasInherit = true;
    paramConfigMap[key] = (_c = (_b = options.params) == null ? void 0 : _b[key]) != null ? _c : StringParam;
  }
  if (!hasInherit)
    return paramConfigMapWithInherit;
  return paramConfigMap;
}
function extendParamConfigForKeys(baseParamConfigMap, paramKeys, inheritedParams, defaultParam) {
  var _a;
  if (!inheritedParams || !paramKeys.length)
    return baseParamConfigMap;
  let paramConfigMap = { ...baseParamConfigMap };
  let hasInherit = false;
  for (const paramKey of paramKeys) {
    if (!Object.prototype.hasOwnProperty.call(paramConfigMap, paramKey)) {
      paramConfigMap[paramKey] = (_a = inheritedParams[paramKey]) != null ? _a : defaultParam;
      hasInherit = true;
    }
  }
  if (!hasInherit)
    return baseParamConfigMap;
  return paramConfigMap;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function shallowEqual(objA, objB, equalMap) {
  var _a, _b;
  if (is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    const isEqual = (_b = (_a = equalMap == null ? void 0 : equalMap[keysA[i]]) == null ? void 0 : _a.equals) != null ? _b : is;
    if (!hasOwnProperty.call(objB, keysA[i]) || !isEqual(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
function getLatestDecodedValues(parsedParams, paramConfigMap, decodedParamCache2) {
  const decodedValues = {};
  const paramNames = Object.keys(paramConfigMap);
  for (const paramName of paramNames) {
    const paramConfig = paramConfigMap[paramName];
    const encodedValue = parsedParams[paramName];
    let decodedValue;
    if (decodedParamCache2.has(paramName, encodedValue, paramConfig.decode)) {
      decodedValue = decodedParamCache2.get(paramName);
    } else {
      decodedValue = paramConfig.decode(encodedValue);
      if (paramConfig.equals && decodedParamCache2.has(paramName, encodedValue)) {
        const oldDecodedValue = decodedParamCache2.get(paramName);
        if (paramConfig.equals(decodedValue, oldDecodedValue)) {
          decodedValue = oldDecodedValue;
        }
      }
      if (decodedValue !== void 0) {
        decodedParamCache2.set(
          paramName,
          encodedValue,
          decodedValue,
          paramConfig.decode
        );
      }
    }
    if (decodedValue === void 0 && paramConfig.default !== void 0) {
      decodedValue = paramConfig.default;
    }
    decodedValues[paramName] = decodedValue;
  }
  return decodedValues;
}
function makeStableGetLatestDecodedValues() {
  let prevDecodedValues;
  function stableGetLatest(parsedParams, paramConfigMap, decodedParamCache2) {
    const decodedValues = getLatestDecodedValues(
      parsedParams,
      paramConfigMap,
      decodedParamCache2
    );
    if (prevDecodedValues != null && shallowEqual(prevDecodedValues, decodedValues)) {
      return prevDecodedValues;
    }
    prevDecodedValues = decodedValues;
    return decodedValues;
  }
  return stableGetLatest;
}
function serializeUrlNameMap(paramConfigMap) {
  let urlNameMapParts;
  for (const paramName in paramConfigMap) {
    if (paramConfigMap[paramName].urlName) {
      const urlName = paramConfigMap[paramName].urlName;
      const part = `${urlName}\0${paramName}`;
      if (!urlNameMapParts)
        urlNameMapParts = [part];
      else
        urlNameMapParts.push(part);
    }
  }
  return urlNameMapParts ? urlNameMapParts.join("\n") : void 0;
}
function deserializeUrlNameMap(urlNameMapStr) {
  if (!urlNameMapStr)
    return void 0;
  return Object.fromEntries(
    urlNameMapStr.split("\n").map((part) => part.split("\0"))
  );
}
function applyUrlNames(encodedValues, paramConfigMap) {
  var _a;
  let newEncodedValues = {};
  for (const paramName in encodedValues) {
    if (((_a = paramConfigMap[paramName]) == null ? void 0 : _a.urlName) != null) {
      newEncodedValues[paramConfigMap[paramName].urlName] = encodedValues[paramName];
    } else {
      newEncodedValues[paramName] = encodedValues[paramName];
    }
  }
  return newEncodedValues;
}
let cachedSearchString;
let cachedUrlNameMapString;
let cachedSearchStringToObjectFn;
let cachedParsedQuery = {};
const memoSearchStringToObject = (searchStringToObject2, searchString, urlNameMapStr) => {
  if (cachedSearchString === searchString && cachedSearchStringToObjectFn === searchStringToObject2 && cachedUrlNameMapString === urlNameMapStr) {
    return cachedParsedQuery;
  }
  cachedSearchString = searchString;
  cachedSearchStringToObjectFn = searchStringToObject2;
  const newParsedQuery = searchStringToObject2(searchString != null ? searchString : "");
  cachedUrlNameMapString = urlNameMapStr;
  const urlNameMap = deserializeUrlNameMap(urlNameMapStr);
  for (let [key, value] of Object.entries(newParsedQuery)) {
    if (urlNameMap == null ? void 0 : urlNameMap[key]) {
      delete newParsedQuery[key];
      key = urlNameMap[key];
      newParsedQuery[key] = value;
    }
    const oldValue = cachedParsedQuery[key];
    if (shallowEqual(value, oldValue)) {
      newParsedQuery[key] = oldValue;
    }
  }
  cachedParsedQuery = newParsedQuery;
  return newParsedQuery;
};
const defaultOptions = {
  searchStringToObject,
  objectToSearchString,
  updateType: "pushIn",
  includeKnownParams: void 0,
  includeAllParams: false,
  removeDefaultsFromUrl: false,
  enableBatching: false,
  skipUpdateWhenNoChange: true
};
function mergeOptions(parentOptions, currOptions) {
  if (currOptions == null) {
    currOptions = {};
  }
  const merged = { ...parentOptions, ...currOptions };
  if (currOptions.params && parentOptions.params) {
    merged.params = { ...parentOptions.params, ...currOptions.params };
  }
  return merged;
}
const providerlessContextValue = {
  adapter: {},
  options: defaultOptions
};
const QueryParamContext = react.exports.createContext(providerlessContextValue);
function useQueryParamContext() {
  const value = react.exports.useContext(QueryParamContext);
  if (value === void 0 || value === providerlessContextValue) {
    throw new Error("useQueryParams must be used within a QueryParamProvider");
  }
  return value;
}
function QueryParamProviderInner({
  children,
  adapter,
  options
}) {
  const {
    adapter: parentAdapter,
    options: parentOptions
  } = react.exports.useContext(QueryParamContext);
  const value = react.exports.useMemo(() => {
    return {
      adapter: adapter != null ? adapter : parentAdapter,
      options: mergeOptions(parentOptions, options)
    };
  }, [adapter, options, parentAdapter, parentOptions]);
  return /* @__PURE__ */ jsx(QueryParamContext.Provider, {
    value,
    children
  });
}
function QueryParamProvider({
  children,
  adapter,
  options
}) {
  const Adapter = adapter;
  return Adapter ? /* @__PURE__ */ jsx(Adapter, {
    children: (adapter2) => /* @__PURE__ */ jsx(QueryParamProviderInner, {
      adapter: adapter2,
      options,
      children
    })
  }) : /* @__PURE__ */ jsx(QueryParamProviderInner, {
    options,
    children
  });
}
function removeDefaults(encodedValues, paramConfigMap) {
  var _a;
  for (const paramName in encodedValues) {
    if (((_a = paramConfigMap[paramName]) == null ? void 0 : _a.default) !== void 0 && encodedValues[paramName] !== void 0) {
      const encodedDefault = paramConfigMap[paramName].encode(
        paramConfigMap[paramName].default
      );
      if (encodedDefault === encodedValues[paramName]) {
        encodedValues[paramName] = void 0;
      }
    }
  }
}
function getUpdatedSearchString({
  changes,
  updateType,
  currentSearchString,
  paramConfigMap: baseParamConfigMap,
  options
}) {
  const { searchStringToObject: searchStringToObject2, objectToSearchString: objectToSearchString2 } = options;
  if (updateType == null)
    updateType = options.updateType;
  let encodedChanges;
  const parsedParams = memoSearchStringToObject(
    searchStringToObject2,
    currentSearchString
  );
  const paramConfigMap = extendParamConfigForKeys(
    baseParamConfigMap,
    Object.keys(changes),
    options.params
  );
  let changesToUse;
  if (typeof changes === "function") {
    const latestValues = getLatestDecodedValues(
      parsedParams,
      paramConfigMap,
      decodedParamCache
    );
    changesToUse = changes(latestValues);
  } else {
    changesToUse = changes;
  }
  encodedChanges = encodeQueryParams(paramConfigMap, changesToUse);
  if (options.removeDefaultsFromUrl) {
    removeDefaults(encodedChanges, paramConfigMap);
  }
  encodedChanges = applyUrlNames(encodedChanges, paramConfigMap);
  let newSearchString;
  if (updateType === "push" || updateType === "replace") {
    newSearchString = objectToSearchString2(encodedChanges);
  } else {
    newSearchString = objectToSearchString2({
      ...parsedParams,
      ...encodedChanges
    });
  }
  if ((newSearchString == null ? void 0 : newSearchString.length) && newSearchString[0] !== "?") {
    newSearchString = `?${newSearchString}`;
  }
  return newSearchString != null ? newSearchString : "";
}
function updateSearchString({
  searchString,
  adapter,
  navigate,
  updateType
}) {
  const currentLocation = adapter.location;
  const newLocation = {
    ...currentLocation,
    search: searchString
  };
  if (navigate) {
    if (typeof updateType === "string" && updateType.startsWith("replace")) {
      adapter.replace(newLocation);
    } else {
      adapter.push(newLocation);
    }
  }
}
const immediateTask = (task) => task();
const timeoutTask = (task) => setTimeout(() => task(), 0);
const updateQueue = [];
function enqueueUpdate(args, { immediate } = {}) {
  updateQueue.push(args);
  let scheduleTask = immediate ? immediateTask : timeoutTask;
  if (updateQueue.length === 1) {
    scheduleTask(() => {
      const updates = updateQueue.slice();
      updateQueue.length = 0;
      const initialSearchString = updates[0].currentSearchString;
      let searchString;
      for (let i = 0; i < updates.length; ++i) {
        const modifiedUpdate = i === 0 ? updates[i] : { ...updates[i], currentSearchString: searchString };
        searchString = getUpdatedSearchString(modifiedUpdate);
      }
      if (args.options.skipUpdateWhenNoChange && searchString === initialSearchString) {
        return;
      }
      updateSearchString({
        searchString: searchString != null ? searchString : "",
        adapter: updates[updates.length - 1].adapter,
        navigate: true,
        updateType: updates[updates.length - 1].updateType
      });
    });
  }
}
function useQueryParams(arg1, arg2) {
  const { adapter, options: contextOptions } = useQueryParamContext();
  const [stableGetLatest] = react.exports.useState(makeStableGetLatestDecodedValues);
  const { paramConfigMap: paramConfigMapWithInherit, options } = parseArguments(
    arg1,
    arg2
  );
  const mergedOptions = react.exports.useMemo(() => {
    return mergeOptions(contextOptions, options);
  }, [contextOptions, options]);
  let paramConfigMap = convertInheritedParamStringsToParams(
    paramConfigMapWithInherit,
    mergedOptions
  );
  const parsedParams = memoSearchStringToObject(
    mergedOptions.searchStringToObject,
    adapter.location.search,
    serializeUrlNameMap(paramConfigMap)
  );
  if (mergedOptions.includeAllParams) {
    paramConfigMap = extendParamConfigForKeys(
      paramConfigMap,
      Object.keys(parsedParams),
      mergedOptions.params,
      StringParam
    );
  }
  const decodedValues = stableGetLatest(
    parsedParams,
    paramConfigMap,
    decodedParamCache
  );
  const paramKeyString = Object.keys(paramConfigMap).join("\0");
  react.exports.useEffect(() => {
    const paramNames = paramKeyString.split("\0");
    decodedParamCache.registerParams(paramNames);
    return () => {
      decodedParamCache.unregisterParams(paramNames);
    };
  }, [paramKeyString]);
  const callbackDependencies = {
    adapter,
    paramConfigMap,
    options: mergedOptions
  };
  const callbackDependenciesRef = react.exports.useRef(callbackDependencies);
  if (callbackDependenciesRef.current == null) {
    callbackDependenciesRef.current = callbackDependencies;
  }
  react.exports.useEffect(() => {
    callbackDependenciesRef.current.adapter = adapter;
    callbackDependenciesRef.current.paramConfigMap = paramConfigMap;
    callbackDependenciesRef.current.options = mergedOptions;
  }, [adapter, paramConfigMap, mergedOptions]);
  const [setQuery] = react.exports.useState(() => {
    const setQuery2 = (changes, updateType) => {
      const { adapter: adapter2, paramConfigMap: paramConfigMap2, options: options2 } = callbackDependenciesRef.current;
      if (updateType == null)
        updateType = options2.updateType;
      enqueueUpdate(
        {
          changes,
          updateType,
          currentSearchString: adapter2.location.search,
          paramConfigMap: paramConfigMap2,
          options: options2,
          adapter: adapter2
        },
        { immediate: !options2.enableBatching }
      );
    };
    return setQuery2;
  });
  return [decodedValues, setQuery];
}
function parseArguments(arg1, arg2) {
  let paramConfigMap;
  let options;
  if (arg1 === void 0) {
    paramConfigMap = {};
    options = arg2;
  } else if (Array.isArray(arg1)) {
    paramConfigMap = Object.fromEntries(
      arg1.map((key) => [key, "inherit"])
    );
    options = arg2;
  } else {
    paramConfigMap = arg1;
    options = arg2;
  }
  return { paramConfigMap, options };
}
const ReactRouter6Adapter = ({
  children
}) => {
  const { navigator: navigator2 } = react.exports.useContext(NavigationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const adapter = {
    replace(location2) {
      navigate(location2.search || "?", {
        replace: true,
        state: location2.state
      });
    },
    push(location2) {
      navigate(location2.search || "?", {
        replace: false,
        state: location2.state
      });
    },
    get location() {
      var _a;
      return (_a = navigator2 == null ? void 0 : navigator2.location) != null ? _a : location;
    }
  };
  return children(adapter);
};
const ModalsContext = react.exports.createContext(null);
ModalsContext.displayName = "@mantine/modals/ModalsContext";
function useModals() {
  const ctx = react.exports.useContext(ModalsContext);
  if (!ctx) {
    throw new Error("[@mantine/modals] useModals hook was called outside of context, wrap your app with ModalsProvider component");
  }
  return ctx;
}
var __defProp$u = Object.defineProperty;
var __defProps$f = Object.defineProperties;
var __getOwnPropDescs$f = Object.getOwnPropertyDescriptors;
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
var __spreadProps$f = (a, b) => __defProps$f(a, __getOwnPropDescs$f(b));
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
      ...__spreadValues$u({
        position: "right"
      }, groupProps),
      children: [/* @__PURE__ */ jsx(Button, {
        ...__spreadProps$f(__spreadValues$u({
          variant: "default"
        }, cancelProps), {
          onClick: handleCancel
        }),
        children: (cancelProps == null ? void 0 : cancelProps.children) || cancelLabel
      }), /* @__PURE__ */ jsx(Button, {
        ...__spreadProps$f(__spreadValues$u({}, confirmProps), {
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
const [useModalsEvents, createEvent$2] = createUseExternalEvents("mantine-modals");
createEvent$2("openModal");
createEvent$2("closeModal");
createEvent$2("closeAllModals");
createEvent$2("openConfirmModal");
createEvent$2("openContextModal");
var __defProp$t = Object.defineProperty;
var __defProps$e = Object.defineProperties;
var __getOwnPropDescs$e = Object.getOwnPropertyDescriptors;
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
var __spreadProps$e = (a, b) => __defProps$e(a, __getOwnPropDescs$e(b));
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
  } = _a, others = __objRest$k(_a, ["id", "children", "onCancel", "onConfirm", "closeOnConfirm", "closeOnCancel", "cancelProps", "confirmProps", "groupProps", "labels"]);
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
    modalProps: __spreadValues$t({
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
    } = _b, props = __objRest$k(_b, ["modalId"]);
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
    } = _d, props = __objRest$k(_d, ["modalId"]);
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
    } = _f, props = __objRest$k(_f, ["modalId"]);
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
      } = _h, payload = __objRest$k(_h, ["modal"]);
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
        } = _b, rest = __objRest$k(_b, ["innerProps"]);
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
            ...__spreadProps$e(__spreadValues$t({}, separatedConfirmProps), {
              id: state.current.id,
              labels: state.current.props.labels || labels
            })
          })
        };
      }
      case "content": {
        const _c = state.current.props, {
          children: currentModalChildren
        } = _c, rest = __objRest$k(_c, ["children"]);
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
      ...__spreadProps$e(__spreadValues$t(__spreadValues$t({}, modalProps), currentModalProps), {
        opened: state.modals.length > 0,
        onClose: () => closeModal(state.current.id)
      }),
      children: content
    }), children]
  });
}
const [useNavigationProgressEvents, createEvent$1] = createUseExternalEvents("mantine-nprogress");
const startNavigationProgress = createEvent$1("start");
const stopNavigationProgress = createEvent$1("stop");
const resetNavigationProgress = createEvent$1("reset");
const setNavigationProgress = createEvent$1("set");
createEvent$1("increment");
createEvent$1("decrement");
createEvent$1("complete");
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
  zIndex = getDefaultZIndex("max"),
  progressLabel
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
  const complete = () => setProgress(100);
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
    reset,
    complete
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
      },
      "aria-label": progressLabel
    })
  });
}
const SpotlightContext = react.exports.createContext(null);
var __defProp$s = Object.defineProperty;
var __defProps$d = Object.defineProperties;
var __getOwnPropDescs$d = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$s = Object.getOwnPropertySymbols;
var __hasOwnProp$s = Object.prototype.hasOwnProperty;
var __propIsEnum$s = Object.prototype.propertyIsEnumerable;
var __defNormalProp$s = (obj, key, value) => key in obj ? __defProp$s(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$d = (a, b) => __defProps$d(a, __getOwnPropDescs$d(b));
function prepareAction(action) {
  return __spreadProps$d(__spreadValues$s({}, action), { id: action.id || randomId() });
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
var useStyles$e = createStyles((theme, { radius }) => ({
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
  actionBody: {}
}));
const useStyles$f = useStyles$e;
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
var __objRest$j = (source, exclude) => {
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
  } = _b, others = __objRest$j(_b, ["action", "styles", "classNames", "hovered", "onTrigger", "highlightQuery", "highlightColor", "query", "radius"]);
  const {
    classes,
    cx
  } = useStyles$f({
    radius
  }, {
    styles,
    classNames,
    name: "Spotlight"
  });
  return /* @__PURE__ */ jsx(UnstyledButton, {
    ...__spreadValues$r({
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
var useStyles$c = createStyles((theme) => ({
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
const useStyles$d = useStyles$c;
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
  } = useStyles$d(null, {
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
var __defProp$q = Object.defineProperty;
var __defProps$c = Object.defineProperties;
var __getOwnPropDescs$c = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$q = Object.getOwnPropertySymbols;
var __hasOwnProp$q = Object.prototype.hasOwnProperty;
var __propIsEnum$q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$q = (obj, key, value) => key in obj ? __defProp$q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$c = (a, b) => __defProps$c(a, __getOwnPropDescs$c(b));
var useStyles$a = createStyles((theme, { centered, maxWidth, topOffset, radius, zIndex }) => ({
  root: __spreadProps$c(__spreadValues$q({}, theme.fn.cover()), {
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
    overflow: "auto",
    marginLeft: "calc(var(--removed-scroll-width, 0px) * -1)"
  },
  overlay: __spreadProps$c(__spreadValues$q({}, theme.fn.cover()), {
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
const useStyles$b = useStyles$a;
var __defProp$p = Object.defineProperty;
var __defProps$b = Object.defineProperties;
var __getOwnPropDescs$b = Object.getOwnPropertyDescriptors;
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
var __spreadProps$b = (a, b) => __defProps$b(a, __getOwnPropDescs$b(b));
var __objRest$i = (source, exclude) => {
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
  } = _b, others = __objRest$i(_b, ["query", "onQueryChange", "actions", "onClose", "opened", "withinPortal", "transition", "transitionDuration", "classNames", "styles", "overlayColor", "overlayOpacity", "overlayBlur", "shadow", "radius", "centered", "closeOnActionTrigger", "highlightQuery", "highlightColor", "maxWidth", "topOffset", "className", "searchPlaceholder", "searchIcon", "filter", "nothingFoundMessage", "limit", "actionComponent", "actionsWrapperComponent", "zIndex", "searchInputProps"]);
  const [hovered, setHovered] = react.exports.useState(-1);
  const [IMEOpen, setIMEOpen] = react.exports.useState(false);
  const {
    classes,
    cx
  } = useStyles$b({
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
        ...__spreadValues$p({
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
              ...__spreadProps$b(__spreadValues$p({}, searchInputProps), {
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
var __objRest$h = (source, exclude) => {
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
  } = _b, others = __objRest$h(_b, ["actions", "children", "shortcut", "onSpotlightClose", "onSpotlightOpen", "onQueryChange", "cleanQueryOnClose", "transitionDuration", "disabled"]);
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
      ...__spreadValues$o({
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
const ReactQueryDevtools = function() {
  return null;
};
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
        "data-test": "logo-container",
        sx: {
          justifyContent: "center",
          height: 44,
          width: 44,
          display: "flex",
          alignItems: "center",
          borderRadius: "2px 20px 2px 20px",
          "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? "#000000" : theme.colors.gray[0]
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
            "data-test": "logo-text",
            color: theme.colorScheme === "dark" ? "white" : "#262626",
            sx: {
              "&:hover": {
                color: theme.colorScheme === "dark" ? theme.colors.gray[4] : theme.colors.dark[3]
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
  }
};
const GenericService = {
  async get(resource, filter = {}, options = {}, queryID = "") {
    const queryOptions = { ...options, limit: options.limit || 10 };
    const queryOptionsString = queryString.stringify(queryOptions);
    const uri = `${config$1.baseUri}/v1/${resource}?${queryOptionsString}&filter=${JSON.stringify(filter)}&queryID=${queryID}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  },
  async get_via_post(resource, filter = {}, options = {}, queryID = "") {
    try {
      const resp = await ky(`${config$1.baseUri}/v1/${resource}/get_via_post`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter,
          options,
          queryID
        }),
        method: "POST"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e) {
      log.error(`cannot get (get_via_post) ${resource},
options: '${JSON.stringify(options)}', error: '${e.stack || e}'}`);
      throw new Error(`cannot get (get_via_post) ${resource},
options: '${JSON.stringify(options)}', error: '${e}'}`);
    }
  },
  async create(resource, data) {
    const url = `${config$1.baseUri}/v1/${resource}`;
    const resp = await ky.post(
      url,
      { json: data }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot create resource:
         '${url}', data: '${JSON.parse(data)}' resp: '${JSON.stringify(resp)}'`);
  },
  async update(resource, data) {
    const url = `${config$1.baseUri}/v1/${resource}/${data.name}`;
    const resp = await ky.patch(
      url,
      { json: data }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot update resource:
         '${url}', data: '${JSON.stringify(data)}' resp: '${JSON.stringify(resp)}'`);
  },
  async delete(resource, id) {
    const url = `${config$1.baseUri}/v1/${resource}/${id}`;
    const resp = await ky.delete(
      url
    );
    if (resp.ok) {
      return;
    }
    throw new Error(`cannot delete resource:
        '${url}', id: '${id}' resp: '${JSON.stringify(resp)}'`);
  },
  async distinct(resource, field) {
    const uri = `${config$1.baseUri}/v1/${resource}/distinct?field=${field}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get distinct values: resource:
        '${uri}', field: '${field}', resp: '${JSON.stringify(resp)}'`);
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
        },
        refetchOnWindowFocus: false
      }
    );
    return { isLoading, error, data, refetch, isSuccess };
  },
  useUsersByUsername(username) {
    return useQuery(
      ["useUsersByUsername", username],
      () => GenericService.get("users", { username }),
      {
        onError: (err) => {
          errorMsg({ error: err });
        }
      }
    );
  },
  useAllUsers() {
    const { isLoading, error, data, refetch, isSuccess, isFetching } = useQuery(
      ["allUsers"],
      () => GenericService.get("users", {}, { sortBy: "id: desc" }),
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
      title: "Test Results",
      description: "Test Results Main Page",
      group: "main",
      icon: /* @__PURE__ */ jsx(B9, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }]
    },
    {
      title: "By Runs",
      description: "Test Results by Runs",
      group: "main",
      icon: /* @__PURE__ */ jsx(wue, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Runs",
        href: "/index2/?groupBy=runs"
      }]
    },
    {
      title: "By Suites",
      description: "Test Results by Suites",
      group: "main",
      icon: /* @__PURE__ */ jsx(gW, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Suites",
        href: "/index2/?groupBy=suites"
      }]
    },
    {
      title: "By Browser",
      description: "Test Results by Browser",
      group: "main",
      icon: /* @__PURE__ */ jsx(wz, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Browser",
        href: "/index2/?groupBy=test-distinct/browserName"
      }]
    },
    {
      title: "By Platform",
      description: "Test Results by Platform",
      group: "main",
      icon: /* @__PURE__ */ jsx(mF, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Platform",
        href: "/index2/?groupBy=test-distinct/os"
      }]
    },
    {
      title: "By Test Status",
      description: "Test Results by Test Status",
      group: "main",
      icon: /* @__PURE__ */ jsx(Uye, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Test Status",
        href: "/index2/?groupBy=test-distinct/status"
      }]
    },
    {
      title: "By Accept Status",
      description: "Test Results by Accept Status",
      group: "main",
      icon: /* @__PURE__ */ jsx(zB, {
        size: 18
      }),
      crumbs: [{
        title: "Test Results",
        href: "/index2"
      }, {
        title: "By Accept Status",
        href: "/index2/?groupBy=test-distinct/markedAs"
      }]
    },
    {
      title: "Admin Panel",
      description: "Visit Admin Panel",
      group: "main",
      icon: /* @__PURE__ */ jsx(Lqe, {
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
      icon: /* @__PURE__ */ jsx(Iqe, {
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
      icon: /* @__PURE__ */ jsx(I9, {
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
      icon: /* @__PURE__ */ jsx(N9, {
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
function useNavProgressFetchEffect(isFetching) {
  react.exports.useEffect(() => {
    if (isFetching) {
      resetNavigationProgress();
      startNavigationProgress();
    } else {
      setNavigationProgress(100);
    }
  }, [isFetching]);
}
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
  const CopyIcon = successCopy ? dj : NP;
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
          icon: /* @__PURE__ */ jsx(P5, {}),
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
        children: /* @__PURE__ */ jsx(Iqe, {
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
          children: [/* @__PURE__ */ jsx(Qa, {
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
function ToggleThemeButton({
  colorScheme,
  toggleColorScheme
}) {
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Group, {
    position: "center",
    children: /* @__PURE__ */ jsx(Switch, {
      "data-test": "theme-button",
      size: "md",
      color: dark ? "yellow" : "blue",
      checked: colorScheme === "light",
      onChange: (event) => {
        toggleColorScheme();
        event.preventDefault();
        event.stopPropagation();
      },
      onLabel: /* @__PURE__ */ jsx(GCe, {
        size: 16,
        stroke: 2.5,
        color: theme.colors.yellow[4]
      }),
      offLabel: /* @__PURE__ */ jsx(Nie, {
        size: 16,
        stroke: 2.5,
        color: theme.colors.blue[6]
      })
    })
  });
}
function useColorScheme() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true
  });
  const toggleColorScheme = (value) => {
    const isDark = () => colorScheme === "dark";
    setColorScheme(value || (isDark() ? "light" : "dark"));
    if (isDark()) {
      document.body.style.backgroundColor = "#ffffff";
      return;
    }
    document.body.style.backgroundColor = "#000000";
  };
  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return [colorScheme, toggleColorScheme];
}
function UserMenu() {
  var _a, _b, _c, _d;
  const theme = useMantineTheme();
  const [colorScheme, toggleColorScheme] = useColorScheme();
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
          color: theme.colorScheme === "dark" ? "dark" : "#ffffff",
          sx: {
            color: theme.colorScheme === "dark" ? "#ffffff" : "#1a1b1e",
            backgroundColor: theme.colorScheme === "dark" ? "#1a1b1e" : theme.colors.gray[0],
            fontWeight: 600,
            fontSize: "1rem",
            display: "flex",
            width: "2.6rem",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: theme.colorScheme === "dark" ? "#000000" : "#ffffff"
            }
          },
          children: userInitials
        })
      }), /* @__PURE__ */ jsxs(Menu.Dropdown, {
        children: [/* @__PURE__ */ jsx(Menu.Label, {
          "data-test": "user-short-details",
          sx: {
            fontSize: "14px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            color: theme.colors.blue[5]
          },
          children: /* @__PURE__ */ jsxs(Group, {
            position: "apart",
            sx: {
              width: "100%"
            },
            children: [/* @__PURE__ */ jsxs(Group, {
              spacing: 0,
              children: [/* @__PURE__ */ jsx(Iqe, {
                size: "14px",
                stroke: 3,
                style: {
                  marginRight: "10px"
                }
              }), (_c = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _c.firstName, " ", (_d = currentUser == null ? void 0 : currentUser.data) == null ? void 0 : _d.lastName]
            }), /* @__PURE__ */ jsx(ToggleThemeButton, {
              colorScheme,
              toggleColorScheme
            })]
          })
        }), /* @__PURE__ */ jsx(Menu.Divider, {}), /* @__PURE__ */ jsx(Menu.Item, {
          "data-test": "userinfo",
          icon: /* @__PURE__ */ jsx(L3, {
            size: 14
          }),
          onClick: () => {
            setUserInfoModalOpened(true);
          },
          children: "User Details"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(CMe, {
            size: 14
          }),
          component: "a",
          href: "/admin/",
          children: "Admin Panel"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(P5, {
            size: 14
          }),
          component: "a",
          href: "/auth/change",
          children: "Change Password"
        }), /* @__PURE__ */ jsx(Menu.Item, {
          id: "generate-api",
          icon: /* @__PURE__ */ jsx(_He, {
            size: 14
          }),
          onClick: () => {
            setApiKeyModalAskOpened(true);
          },
          children: "Generate API key"
        }), /* @__PURE__ */ jsx(Menu.Divider, {}), /* @__PURE__ */ jsx(Menu.Item, {
          icon: /* @__PURE__ */ jsx(Iee, {
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
function SafeSelect({
  optionsData,
  required = false,
  loaded = false,
  value,
  name,
  onChange,
  "data-test": dataTest,
  sx,
  searchable,
  clearable
}) {
  const changeHandler = (event) => {
    onChange(event.target.value);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Select, {
      data: optionsData,
      required,
      dropdownPosition: "bottom",
      icon: loaded && /* @__PURE__ */ jsx(Loader, {
        size: 24
      }),
      value,
      onChange,
      sx,
      searchable,
      clearable
    }), /* @__PURE__ */ jsx("select", {
      name,
      style: {
        width: 0,
        opacity: 0,
        position: "fixed"
      },
      value,
      "data-test": dataTest,
      onChange: changeHandler,
      children: optionsData.map((option) => /* @__PURE__ */ jsx("option", {
        value: option.value,
        children: option.label
      }, option.value))
    })]
  });
}
function useInfinityScroll({
  resourceName,
  firstPageQueryUniqueKey,
  baseFilterObj = {},
  filterObj = {},
  newestItemsFilterKey,
  sortBy,
  infinityScrollLimit = 20
}) {
  var _a, _b, _c;
  const firstPageQueryOptions = ["logs_infinity_first_page", resourceName];
  if (firstPageQueryUniqueKey) {
    firstPageQueryOptions.push(firstPageQueryUniqueKey);
  }
  const firstPageQuery = useQuery(firstPageQueryOptions, () => GenericService.get(resourceName, baseFilterObj, {
    page: "1",
    limit: "1"
  }, "firstPageQuery"), {
    enabled: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  const firstPageData = react.exports.useMemo(() => {
    var _a2, _b2, _c2, _d, _e, _f;
    return {
      newestItemsFilterValue: newestItemsFilterKey && ((_b2 = (_a2 = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _a2.results) == null ? void 0 : _b2.length) ? (_c2 = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _c2.results[0][newestItemsFilterKey] : void 0,
      totalPages: (_d = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _d.totalPages,
      totalResults: (_e = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _e.totalResults,
      timestamp: (_f = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _f.timestamp
    };
  }, [(_a = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _a.timestamp]);
  const newestItemsFilter = newestItemsFilterKey && firstPageData.newestItemsFilterValue ? {
    [newestItemsFilterKey]: {
      $lte: firstPageData.newestItemsFilterValue
    }
  } : {};
  const newRequestFilter = react.exports.useMemo(() => {
    return {
      $and: [
        baseFilterObj,
        newestItemsFilter,
        filterObj || {}
      ]
    };
  }, [firstPageData.timestamp]);
  const infinityQuery = useInfiniteQuery(["logs_infinity_pages", resourceName, firstPageData.timestamp], ({
    pageParam = 1
  }) => GenericService.get(resourceName, newRequestFilter, {
    limit: String(infinityScrollLimit),
    page: pageParam,
    sortBy,
    populate: resourceName === "tests" ? "checks" : "suite,app,test,baselineId,actualSnapshotId,diffId"
  }, "infinityQuery"), {
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages)
        return void 0;
      return lastPage.page + 1;
    },
    refetchOnWindowFocus: false,
    enabled: true,
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  const newestItemsQuery = useQuery(["logs_infinity_newest_pages", resourceName, firstPageData.newestItemsFilterValue], () => {
    const beforeNewestItemsFilter = newestItemsFilterKey && firstPageData.newestItemsFilterValue ? {
      [newestItemsFilterKey]: {
        $gt: firstPageData.newestItemsFilterValue
      }
    } : {};
    return GenericService.get(resourceName, {
      $and: [beforeNewestItemsFilter, baseFilterObj]
    }, {
      limit: String(0)
    }, "newestItemsQuery");
  }, {
    enabled: ((_c = (_b = infinityQuery.data) == null ? void 0 : _b.pages) == null ? void 0 : _c.length) > 0,
    refetchOnWindowFocus: true,
    refetchInterval: 7e3,
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  return {
    firstPageQuery,
    infinityQuery,
    newestItemsQuery
  };
}
var observerMap = /* @__PURE__ */ new Map();
var RootIds = /* @__PURE__ */ new WeakMap();
var rootId = 0;
var unsupportedValue = void 0;
function getRootId(root) {
  if (!root)
    return "0";
  if (RootIds.has(root))
    return RootIds.get(root);
  rootId += 1;
  RootIds.set(root, rootId.toString());
  return RootIds.get(root);
}
function optionsToId(options) {
  return Object.keys(options).sort().filter(function(key) {
    return options[key] !== void 0;
  }).map(function(key) {
    return key + "_" + (key === "root" ? getRootId(options.root) : options[key]);
  }).toString();
}
function createObserver(options) {
  var id = optionsToId(options);
  var instance = observerMap.get(id);
  if (!instance) {
    var elements = /* @__PURE__ */ new Map();
    var thresholds;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var _elements$get;
        var inView = entry.isIntersecting && thresholds.some(function(threshold) {
          return entry.intersectionRatio >= threshold;
        });
        if (options.trackVisibility && typeof entry.isVisible === "undefined") {
          entry.isVisible = inView;
        }
        (_elements$get = elements.get(entry.target)) == null ? void 0 : _elements$get.forEach(function(callback) {
          callback(inView, entry);
        });
      });
    }, options);
    thresholds = observer.thresholds || (Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0]);
    instance = {
      id,
      observer,
      elements
    };
    observerMap.set(id, instance);
  }
  return instance;
}
function observe(element, callback, options, fallbackInView) {
  if (options === void 0) {
    options = {};
  }
  if (fallbackInView === void 0) {
    fallbackInView = unsupportedValue;
  }
  if (typeof window.IntersectionObserver === "undefined" && fallbackInView !== void 0) {
    var bounds = element.getBoundingClientRect();
    callback(fallbackInView, {
      isIntersecting: fallbackInView,
      target: element,
      intersectionRatio: typeof options.threshold === "number" ? options.threshold : 0,
      time: 0,
      boundingClientRect: bounds,
      intersectionRect: bounds,
      rootBounds: bounds
    });
    return function() {
    };
  }
  var _createObserver = createObserver(options), id = _createObserver.id, observer = _createObserver.observer, elements = _createObserver.elements;
  var callbacks = elements.get(element) || [];
  if (!elements.has(element)) {
    elements.set(element, callbacks);
  }
  callbacks.push(callback);
  observer.observe(element);
  return function unobserve() {
    callbacks.splice(callbacks.indexOf(callback), 1);
    if (callbacks.length === 0) {
      elements["delete"](element);
      observer.unobserve(element);
    }
    if (elements.size === 0) {
      observer.disconnect();
      observerMap["delete"](id);
    }
  };
}
function useInView(_temp) {
  var _state$entry;
  var _ref = _temp === void 0 ? {} : _temp, threshold = _ref.threshold, delay = _ref.delay, trackVisibility = _ref.trackVisibility, rootMargin = _ref.rootMargin, root = _ref.root, triggerOnce = _ref.triggerOnce, skip = _ref.skip, initialInView = _ref.initialInView, fallbackInView = _ref.fallbackInView, onChange = _ref.onChange;
  var _React$useState = react.exports.useState(null), ref = _React$useState[0], setRef = _React$useState[1];
  var callback = react.exports.useRef();
  var _React$useState2 = react.exports.useState({
    inView: !!initialInView,
    entry: void 0
  }), state = _React$useState2[0], setState = _React$useState2[1];
  callback.current = onChange;
  react.exports.useEffect(
    function() {
      if (skip || !ref)
        return;
      var unobserve = observe(ref, function(inView, entry) {
        setState({
          inView,
          entry
        });
        if (callback.current)
          callback.current(inView, entry);
        if (entry.isIntersecting && triggerOnce && unobserve) {
          unobserve();
          unobserve = void 0;
        }
      }, {
        root,
        rootMargin,
        threshold,
        trackVisibility,
        delay
      }, fallbackInView);
      return function() {
        if (unobserve) {
          unobserve();
        }
      };
    },
    [
      Array.isArray(threshold) ? threshold.toString() : threshold,
      ref,
      root,
      rootMargin,
      triggerOnce,
      skip,
      trackVisibility,
      fallbackInView,
      delay
    ]
  );
  var entryTarget = (_state$entry = state.entry) == null ? void 0 : _state$entry.target;
  react.exports.useEffect(function() {
    if (!ref && entryTarget && !triggerOnce && !skip) {
      setState({
        inView: !!initialInView,
        entry: void 0
      });
    }
  }, [ref, entryTarget, triggerOnce, skip, initialInView]);
  var result = [setRef, state.inView, state.entry];
  result.ref = result[0];
  result.inView = result[1];
  result.entry = result[2];
  return result;
}
function ActionPopoverIcon({
  icon,
  color,
  iconColor,
  action,
  confirmLabel,
  title,
  testAttr,
  testAttrName = "",
  loading,
  buttonColor,
  paused,
  disabled = false,
  withinPortal = true,
  size: size2 = 24,
  ...rest
}) {
  const [openPopover, handlers] = useDisclosure(false);
  const ref = useClickOutside(() => handlers.close());
  return /* @__PURE__ */ jsxs(Popover, {
    opened: openPopover,
    position: "bottom",
    withArrow: true,
    shadow: "md",
    closeOnClickOutside: true,
    closeOnEscape: true,
    withinPortal,
    children: [/* @__PURE__ */ jsx(Popover.Target, {
      children: /* @__PURE__ */ jsx(Tooltip, {
        withinPortal,
        label: /* @__PURE__ */ jsx(Group, {
          noWrap: true,
          children: /* @__PURE__ */ jsx(Text, {
            children: title
          })
        }),
        children: /* @__PURE__ */ jsx(ActionIcon, {
          disabled,
          "data-test": testAttr,
          "data-accept-icon-name": testAttrName,
          variant: "light",
          color: iconColor,
          onClick: () => {
            if (paused)
              return;
            handlers.toggle();
          },
          title,
          loading,
          size: size2,
          ...rest,
          children: icon
        })
      })
    }), /* @__PURE__ */ jsx(Popover.Dropdown, {
      p: 4,
      children: /* @__PURE__ */ jsx(Button, {
        ref,
        "data-test": `${testAttr}-confirm`,
        color: buttonColor || color,
        "data-confirm-button-name": testAttrName,
        onClick: () => {
          action();
          handlers.close();
        },
        children: confirmLabel
      })
    })]
  });
}
function RelativeDrawer({
  children,
  title = "",
  open = false,
  setOpen,
  width = 300
}) {
  return /* @__PURE__ */ jsx(Transition$2, {
    mounted: open,
    transition: "slide-left",
    duration: 200,
    timingFunction: "ease",
    children: (styles) => /* @__PURE__ */ jsx(Box, {
      sx: {
        ...styles,
        minWidth: width,
        maxWidth: Number(width) + 60
      },
      children: /* @__PURE__ */ jsxs(Paper, {
        p: "md",
        m: 8,
        shadow: "sm",
        radius: "xs",
        withBorder: true,
        children: [/* @__PURE__ */ jsxs(Group, {
          position: "apart",
          align: "start",
          noWrap: true,
          children: [/* @__PURE__ */ jsx(Text, {
            size: "sm",
            pb: 24,
            children: title
          }), /* @__PURE__ */ jsx(ActionIcon, {
            size: "sm",
            onClick: () => setOpen(false),
            children: /* @__PURE__ */ jsx(lAe, {
              stroke: 1,
              size: 16
            })
          })]
        }), /* @__PURE__ */ jsx(Text, {
          size: "sm",
          children
        })]
      })
    })
  });
}
function getEndOfWeek(date, firstDayOfWeek = "monday") {
  const value = new Date(date);
  const day = value.getDay();
  const isSunday = firstDayOfWeek === "sunday";
  const clampToLastDay = 7 - (isSunday ? day + 1 : day);
  if (isSunday && day !== 6 || day !== 0) {
    value.setDate(value.getDate() + clampToLastDay);
  }
  return value;
}
function getStartOfWeek(date, firstDayOfWeek = "monday") {
  const value = new Date(date);
  const day = value.getDay() || 7;
  const isSunday = firstDayOfWeek === "sunday";
  const clampToFirstDay = isSunday ? day : day - 1;
  if (isSunday && day !== 0 || day !== 1) {
    value.setHours(-24 * clampToFirstDay);
  }
  return value;
}
function getMonthDays(month, firstDayOfWeek = "monday") {
  const currentMonth = month.getMonth();
  const startOfMonth = new Date(month.getFullYear(), currentMonth, 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const endDate = getEndOfWeek(endOfMonth, firstDayOfWeek);
  const date = getStartOfWeek(startOfMonth, firstDayOfWeek);
  const weeks = [];
  while (date <= endDate) {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
}
var dayjs_min = { exports: {} };
(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", $ = "Invalid Date", l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, m = function(t2, e2, n2) {
      var r2 = String(t2);
      return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
    }, g = { s: m, z: function(t2) {
      var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
      return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
    }, m: function t2(e2, n2) {
      if (e2.date() < n2.date())
        return -t2(n2, e2);
      var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, f), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
      return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
    }, a: function(t2) {
      return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
    }, p: function(t2) {
      return { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t2) {
      return void 0 === t2;
    } }, v = "en", D = {};
    D[v] = M;
    var p = function(t2) {
      return t2 instanceof _;
    }, S = function t2(e2, n2, r2) {
      var i2;
      if (!e2)
        return v;
      if ("string" == typeof e2) {
        var s2 = e2.toLowerCase();
        D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
        var u2 = e2.split("-");
        if (!i2 && u2.length > 1)
          return t2(u2[0]);
      } else {
        var a2 = e2.name;
        D[a2] = e2, i2 = a2;
      }
      return !r2 && i2 && (v = i2), i2 || !r2 && v;
    }, w = function(t2, e2) {
      if (p(t2))
        return t2.clone();
      var n2 = "object" == typeof e2 ? e2 : {};
      return n2.date = t2, n2.args = arguments, new _(n2);
    }, O = g;
    O.l = S, O.i = p, O.w = function(t2, e2) {
      return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
    };
    var _ = function() {
      function M2(t2) {
        this.$L = S(t2.locale, null, true), this.parse(t2);
      }
      var m2 = M2.prototype;
      return m2.parse = function(t2) {
        this.$d = function(t3) {
          var e2 = t3.date, n2 = t3.utc;
          if (null === e2)
            return new Date(NaN);
          if (O.u(e2))
            return new Date();
          if (e2 instanceof Date)
            return new Date(e2);
          if ("string" == typeof e2 && !/Z$/i.test(e2)) {
            var r2 = e2.match(l);
            if (r2) {
              var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
              return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
            }
          }
          return new Date(e2);
        }(t2), this.$x = t2.x || {}, this.init();
      }, m2.init = function() {
        var t2 = this.$d;
        this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
      }, m2.$utils = function() {
        return O;
      }, m2.isValid = function() {
        return !(this.$d.toString() === $);
      }, m2.isSame = function(t2, e2) {
        var n2 = w(t2);
        return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
      }, m2.isAfter = function(t2, e2) {
        return w(t2) < this.startOf(e2);
      }, m2.isBefore = function(t2, e2) {
        return this.endOf(e2) < w(t2);
      }, m2.$g = function(t2, e2, n2) {
        return O.u(t2) ? this[e2] : this.set(n2, t2);
      }, m2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m2.valueOf = function() {
        return this.$d.getTime();
      }, m2.startOf = function(t2, e2) {
        var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t2), $2 = function(t3, e3) {
          var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
          return r2 ? i2 : i2.endOf(a);
        }, l2 = function(t3, e3) {
          return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
        }, y2 = this.$W, M3 = this.$M, m3 = this.$D, g2 = "set" + (this.$u ? "UTC" : "");
        switch (h2) {
          case c:
            return r2 ? $2(1, 0) : $2(31, 11);
          case f:
            return r2 ? $2(1, M3) : $2(0, M3 + 1);
          case o:
            var v2 = this.$locale().weekStart || 0, D2 = (y2 < v2 ? y2 + 7 : y2) - v2;
            return $2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
          case a:
          case d:
            return l2(g2 + "Hours", 0);
          case u:
            return l2(g2 + "Minutes", 1);
          case s:
            return l2(g2 + "Seconds", 2);
          case i:
            return l2(g2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m2.endOf = function(t2) {
        return this.startOf(t2, false);
      }, m2.$set = function(t2, e2) {
        var n2, o2 = O.p(t2), h2 = "set" + (this.$u ? "UTC" : ""), $2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s] = h2 + "Minutes", n2[i] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], l2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
        if (o2 === f || o2 === c) {
          var y2 = this.clone().set(d, 1);
          y2.$d[$2](l2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
        } else
          $2 && this.$d[$2](l2);
        return this.init(), this;
      }, m2.set = function(t2, e2) {
        return this.clone().$set(t2, e2);
      }, m2.get = function(t2) {
        return this[O.p(t2)]();
      }, m2.add = function(r2, h2) {
        var d2, $2 = this;
        r2 = Number(r2);
        var l2 = O.p(h2), y2 = function(t2) {
          var e2 = w($2);
          return O.w(e2.date(e2.date() + Math.round(t2 * r2)), $2);
        };
        if (l2 === f)
          return this.set(f, this.$M + r2);
        if (l2 === c)
          return this.set(c, this.$y + r2);
        if (l2 === a)
          return y2(1);
        if (l2 === o)
          return y2(7);
        var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[l2] || 1, m3 = this.$d.getTime() + r2 * M3;
        return O.w(m3, this);
      }, m2.subtract = function(t2, e2) {
        return this.add(-1 * t2, e2);
      }, m2.format = function(t2) {
        var e2 = this, n2 = this.$locale();
        if (!this.isValid())
          return n2.invalidDate || $;
        var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = O.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, f2 = n2.months, h2 = function(t3, n3, i3, s3) {
          return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
        }, c2 = function(t3) {
          return O.s(s2 % 12 || 12, t3, "0");
        }, d2 = n2.meridiem || function(t3, e3, n3) {
          var r3 = t3 < 12 ? "AM" : "PM";
          return n3 ? r3.toLowerCase() : r3;
        }, l2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(n2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(n2.weekdaysMin, this.$W, o2, 2), ddd: h2(n2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: O.s(s2, 2, "0"), h: c2(1), hh: c2(2), a: d2(s2, u2, true), A: d2(s2, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: i2 };
        return r2.replace(y, function(t3, e3) {
          return e3 || l2[t3] || i2.replace(":", "");
        });
      }, m2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m2.diff = function(r2, d2, $2) {
        var l2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, g2 = this - M3, v2 = O.m(this, M3);
        return v2 = (l2 = {}, l2[c] = v2 / 12, l2[f] = v2, l2[h] = v2 / 3, l2[o] = (g2 - m3) / 6048e5, l2[a] = (g2 - m3) / 864e5, l2[u] = g2 / n, l2[s] = g2 / e, l2[i] = g2 / t, l2)[y2] || g2, $2 ? v2 : O.a(v2);
      }, m2.daysInMonth = function() {
        return this.endOf(f).$D;
      }, m2.$locale = function() {
        return D[this.$L];
      }, m2.locale = function(t2, e2) {
        if (!t2)
          return this.$L;
        var n2 = this.clone(), r2 = S(t2, e2, true);
        return r2 && (n2.$L = r2), n2;
      }, m2.clone = function() {
        return O.w(this.$d, this);
      }, m2.toDate = function() {
        return new Date(this.valueOf());
      }, m2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m2.toISOString = function() {
        return this.$d.toISOString();
      }, m2.toString = function() {
        return this.$d.toUTCString();
      }, M2;
    }(), T = _.prototype;
    return w.prototype = T, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t2) {
      T[t2[1]] = function(e2) {
        return this.$g(e2, t2[0], t2[1]);
      };
    }), w.extend = function(t2, e2) {
      return t2.$i || (t2(e2, _, w), t2.$i = true), w;
    }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
      return w(1e3 * t2);
    }, w.en = D[v], w.Ls = D, w.p = {}, w;
  });
})(dayjs_min);
const dayjs = dayjs_min.exports;
function getMonthsNames(locale, format = "MMM") {
  const names = [];
  const date = new Date(2021, 0, 1);
  for (let i = 0; i < 12; i += 1) {
    names.push(dayjs(date).locale(locale).format(format));
    date.setMonth(date.getMonth() + 1);
  }
  return names;
}
function getWeekdaysNames(locale, firstDayOfWeek = "monday", format = "dd") {
  const names = [];
  const date = getStartOfWeek(new Date(), firstDayOfWeek);
  for (let i = 0; i < 7; i += 1) {
    names.push(dayjs(date).locale(locale).format(format));
    date.setDate(date.getDate() + 1);
  }
  return names;
}
function isSameMonth(date, comparison) {
  return date.getFullYear() === comparison.getFullYear() && date.getMonth() === comparison.getMonth();
}
function isSameDate(date, comparison) {
  return isSameMonth(date, comparison) && date.getDate() === comparison.getDate();
}
function getDecadeRange(year) {
  const rounded = year - year % 10 - 1;
  const range = [];
  for (let i = 0; i < 12; i += 1) {
    const rangeYear = rounded + i;
    range.push(rangeYear);
  }
  return range;
}
var __defProp$n = Object.defineProperty;
var __defProps$a = Object.defineProperties;
var __getOwnPropDescs$a = Object.getOwnPropertyDescriptors;
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
var __spreadProps$a = (a, b) => __defProps$a(a, __getOwnPropDescs$a(b));
var __objRest$g = (source, exclude) => {
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
function ArrowIcon(_a) {
  var _b = _a, {
    direction,
    style
  } = _b, others = __objRest$g(_b, ["direction", "style"]);
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$n({
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: __spreadProps$a(__spreadValues$n({}, style), {
        transform: direction === "right" && theme.dir === "ltr" || direction === "left" && theme.dir === "rtl" ? "rotate(180deg)" : "none"
      })
    }, others),
    children: /* @__PURE__ */ jsx("path", {
      d: "M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
ArrowIcon.displayName = "@mantine/dates/ArrowIcon";
var __defProp$m = Object.defineProperty;
var __defProps$9 = Object.defineProperties;
var __getOwnPropDescs$9 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$9 = (a, b) => __defProps$9(a, __getOwnPropDescs$9(b));
const sizes$3 = {
  xs: 32,
  sm: 40,
  md: 44,
  lg: 50,
  xl: 54
};
var useStyles$9 = createStyles((theme, { size: size2 }) => ({
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    align: "center",
    marginBottom: theme.fn.size({ size: size2, sizes: theme.spacing })
  },
  calendarHeaderControl: {
    width: theme.fn.size({ size: size2, sizes: sizes$3 }),
    height: theme.fn.size({ size: size2, sizes: sizes$3 }),
    "&:disabled": {
      opacity: 0,
      cursor: "default"
    }
  },
  calendarHeaderLevel: __spreadProps$9(__spreadValues$m({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: theme.fn.size({ size: size2, sizes: sizes$3 }),
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    padding: `0 ${theme.fn.size({ size: size2, sizes: theme.spacing })}px`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    flex: 1,
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
  }, theme.fn.hover({
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
  })), {
    "&:disabled": theme.fn.hover({
      backgroundColor: "transparent",
      cursor: "default"
    })
  }),
  calendarHeaderLevelIcon: {
    marginLeft: 4
  }
}));
var __defProp$l = Object.defineProperty;
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
var __objRest$f = (source, exclude) => {
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
const iconSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28
};
function CalendarHeader(_a) {
  var _b = _a, {
    hasNext,
    hasPrevious,
    onNext,
    onPrevious,
    onNextLevel,
    className,
    label,
    nextLevelDisabled,
    size: size2,
    classNames,
    styles,
    __staticSelector = "CalendarHeader",
    nextLabel,
    previousLabel,
    preventLevelFocus = false,
    preventFocus,
    unstyled,
    __stopPropagation
  } = _b, others = __objRest$f(_b, ["hasNext", "hasPrevious", "onNext", "onPrevious", "onNextLevel", "className", "label", "nextLevelDisabled", "size", "classNames", "styles", "__staticSelector", "nextLabel", "previousLabel", "preventLevelFocus", "preventFocus", "unstyled", "__stopPropagation"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$9({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const iconSize = theme.fn.size({
    size: size2,
    sizes: iconSizes
  });
  return /* @__PURE__ */ jsxs("div", {
    ...__spreadValues$l({
      className: cx(classes.calendarHeader, className)
    }, others),
    children: [/* @__PURE__ */ jsx(ActionIcon, {
      className: classes.calendarHeaderControl,
      disabled: !hasPrevious,
      onClick: onPrevious,
      "aria-label": previousLabel,
      onMouseDown: (event) => preventFocus && event.preventDefault(),
      unstyled,
      "data-mantine-stop-propagation": __stopPropagation || void 0,
      children: /* @__PURE__ */ jsx(ArrowIcon, {
        direction: "left",
        width: iconSize,
        height: iconSize
      })
    }), /* @__PURE__ */ jsxs(UnstyledButton, {
      unstyled,
      className: classes.calendarHeaderLevel,
      disabled: nextLevelDisabled,
      onClick: onNextLevel,
      tabIndex: preventLevelFocus ? -1 : 0,
      onMouseDown: (event) => preventFocus && event.preventDefault(),
      "data-mantine-stop-propagation": __stopPropagation || void 0,
      children: [label, !nextLevelDisabled && /* @__PURE__ */ jsx(ChevronIcon, {
        error: false,
        size: size2,
        className: classes.calendarHeaderLevelIcon
      })]
    }), /* @__PURE__ */ jsx(ActionIcon, {
      className: classes.calendarHeaderControl,
      disabled: !hasNext,
      onClick: onNext,
      "aria-label": nextLabel,
      unstyled,
      onMouseDown: (event) => preventFocus && event.preventDefault(),
      "data-mantine-stop-propagation": __stopPropagation || void 0,
      children: /* @__PURE__ */ jsx(ArrowIcon, {
        direction: "right",
        width: iconSize,
        height: iconSize
      })
    })]
  });
}
CalendarHeader.displayName = "@mantine/dates/CalendarHeader";
function formatYear(year, format) {
  return dayjs(new Date(year, 1, 1)).format(format);
}
var __defProp$k = Object.defineProperty;
var __defProps$8 = Object.defineProperties;
var __getOwnPropDescs$8 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$k = Object.getOwnPropertySymbols;
var __hasOwnProp$k = Object.prototype.hasOwnProperty;
var __propIsEnum$k = Object.prototype.propertyIsEnumerable;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$8 = (a, b) => __defProps$8(a, __getOwnPropDescs$8(b));
const sizes$2 = {
  xs: 32,
  sm: 40,
  md: 46,
  lg: 52,
  xl: 56
};
var useStyles$8 = createStyles((theme, { size: size2 }) => {
  const colors = theme.fn.variant({ color: theme.primaryColor, variant: "filled" });
  return {
    yearPicker: {
      width: "100%"
    },
    yearPickerControls: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    yearPickerControl: __spreadProps$8(__spreadValues$k({
      flex: "0 0 25%",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size: size2, sizes: sizes$2 }),
      textAlign: "center",
      borderRadius: theme.radius.sm,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes })
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    })), {
      "&:disabled": __spreadValues$k({
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
        cursor: "not-allowed"
      }, theme.fn.hover({
        backgroundColor: "transparent"
      }))
    }),
    yearPickerControlActive: __spreadValues$k({
      backgroundColor: colors.background,
      color: colors.color
    }, theme.fn.hover({
      backgroundColor: colors.hover
    }))
  };
});
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
var __objRest$e = (source, exclude) => {
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
function YearPicker(_a) {
  var _b = _a, {
    className,
    styles,
    classNames,
    value,
    onChange,
    size: size2,
    minYear,
    maxYear,
    __staticSelector = "YearPicker",
    nextDecadeLabel,
    previousDecadeLabel,
    preventFocus,
    unstyled,
    yearLabelFormat = "YYYY",
    __stopPropagation
  } = _b, others = __objRest$e(_b, ["className", "styles", "classNames", "value", "onChange", "size", "minYear", "maxYear", "__staticSelector", "nextDecadeLabel", "previousDecadeLabel", "preventFocus", "unstyled", "yearLabelFormat", "__stopPropagation"]);
  const {
    classes,
    cx
  } = useStyles$8({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const [decade, setDecade] = react.exports.useState(value);
  const range = getDecadeRange(decade);
  const years = range.map((year) => /* @__PURE__ */ jsx(UnstyledButton, {
    unstyled,
    onClick: () => onChange(year),
    disabled: year < minYear || year > maxYear,
    onMouseDown: (event) => preventFocus && event.preventDefault(),
    "data-mantine-stop-propagation": __stopPropagation || void 0,
    className: cx(classes.yearPickerControl, {
      [classes.yearPickerControlActive]: year === value
    }),
    children: formatYear(year, yearLabelFormat)
  }, year));
  return /* @__PURE__ */ jsxs("div", {
    ...__spreadValues$j({
      className: cx(classes.yearPicker, className)
    }, others),
    children: [/* @__PURE__ */ jsx(CalendarHeader, {
      unstyled,
      label: `${formatYear(range[0], yearLabelFormat)} \u2013 ${formatYear(range[range.length - 1], yearLabelFormat)}`,
      hasPrevious: typeof minYear === "number" ? minYear < range[0] : true,
      hasNext: typeof maxYear === "number" ? maxYear > range[range.length - 1] : true,
      onNext: () => setDecade((current) => current + 10),
      onPrevious: () => setDecade((current) => current - 10),
      nextLevelDisabled: true,
      size: size2,
      nextLabel: nextDecadeLabel,
      previousLabel: previousDecadeLabel,
      styles,
      classNames,
      __staticSelector,
      preventFocus,
      __stopPropagation
    }), /* @__PURE__ */ jsx("div", {
      className: classes.yearPickerControls,
      children: years
    })]
  });
}
YearPicker.displayName = "@mantine/dates/YearPicker";
function isMonthInRange({ date, minDate, maxDate }) {
  const hasMinDate = minDate instanceof Date;
  const hasMaxDate = maxDate instanceof Date;
  if (!hasMaxDate && !hasMinDate) {
    return true;
  }
  const endOfMonth = dayjs(date).endOf("month");
  const startOfMonth = dayjs(date).startOf("month");
  const maxInRange = hasMaxDate ? startOfMonth.isBefore(maxDate) : true;
  const minInRange = hasMinDate ? endOfMonth.isAfter(minDate) : true;
  return maxInRange && minInRange;
}
var __defProp$i = Object.defineProperty;
var __defProps$7 = Object.defineProperties;
var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$i = Object.getOwnPropertySymbols;
var __hasOwnProp$i = Object.prototype.hasOwnProperty;
var __propIsEnum$i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
const sizes$1 = {
  xs: 32,
  sm: 40,
  md: 46,
  lg: 52,
  xl: 56
};
var useStyles$7 = createStyles((theme, { size: size2 }) => {
  const colors = theme.fn.variant({ color: theme.primaryColor, variant: "filled" });
  return {
    monthPicker: {
      width: "100%"
    },
    monthPickerControls: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    monthPickerControl: __spreadProps$7(__spreadValues$i({
      flex: "0 0 33.3333%",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size: size2, sizes: sizes$1 }),
      textAlign: "center",
      borderRadius: theme.radius.sm,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes })
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
    })), {
      "&:disabled": __spreadValues$i({
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
        cursor: "not-allowed"
      }, theme.fn.hover({
        backgroundColor: "transparent"
      }))
    }),
    monthPickerControlActive: __spreadValues$i({
      backgroundColor: colors.background,
      color: colors.color
    }, theme.fn.hover({
      backgroundColor: colors.hover
    }))
  };
});
var __defProp$h = Object.defineProperty;
var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
var __hasOwnProp$h = Object.prototype.hasOwnProperty;
var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$d = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$h.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$h)
    for (var prop of __getOwnPropSymbols$h(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$h.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MonthPicker(_a) {
  var _b = _a, {
    className,
    styles,
    classNames,
    value,
    onChange,
    locale,
    year,
    onYearChange,
    onNextLevel,
    size: size2,
    minDate,
    maxDate,
    __staticSelector = "MonthPicker",
    nextYearLabel,
    previousYearLabel,
    preventFocus,
    unstyled,
    yearLabelFormat = "YYYY",
    __stopPropagation
  } = _b, others = __objRest$d(_b, ["className", "styles", "classNames", "value", "onChange", "locale", "year", "onYearChange", "onNextLevel", "size", "minDate", "maxDate", "__staticSelector", "nextYearLabel", "previousYearLabel", "preventFocus", "unstyled", "yearLabelFormat", "__stopPropagation"]);
  const {
    classes,
    cx
  } = useStyles$7({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const range = getMonthsNames(locale);
  const minYear = minDate instanceof Date ? minDate.getFullYear() : void 0;
  const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : void 0;
  const months = range.map((month, index) => /* @__PURE__ */ jsx(UnstyledButton, {
    unstyled,
    onClick: () => onChange(index),
    className: cx(classes.monthPickerControl, {
      [classes.monthPickerControlActive]: index === value.month && year === value.year
    }),
    disabled: !isMonthInRange({
      date: new Date(year, index),
      minDate,
      maxDate
    }),
    onMouseDown: (event) => preventFocus && event.preventDefault(),
    "data-mantine-stop-propagation": __stopPropagation || void 0,
    children: month
  }, month));
  return /* @__PURE__ */ jsxs("div", {
    ...__spreadValues$h({
      className: cx(classes.monthPicker, className)
    }, others),
    children: [/* @__PURE__ */ jsx(CalendarHeader, {
      label: formatYear(year, yearLabelFormat),
      hasNext: typeof maxYear === "number" ? year < maxYear : true,
      hasPrevious: typeof minYear === "number" ? year > minYear : true,
      onNext: () => onYearChange(year + 1),
      onPrevious: () => onYearChange(year - 1),
      onNextLevel,
      size: size2,
      classNames,
      styles,
      __staticSelector,
      nextLabel: nextYearLabel,
      previousLabel: previousYearLabel,
      preventFocus,
      unstyled,
      __stopPropagation
    }), /* @__PURE__ */ jsx("div", {
      className: classes.monthPickerControls,
      children: months
    })]
  });
}
MonthPicker.displayName = "@mantine/dates/MonthPicker";
function formatMonthLabel({ month, locale, format }) {
  return upperFirst(dayjs(month).locale(locale).format(format));
}
function getDayTabIndex({ focusable: focusable2, hasValue, selected, firstInMonth }) {
  if (!focusable2) {
    return -1;
  }
  if (hasValue) {
    return selected ? 0 : -1;
  }
  return firstInMonth ? 0 : -1;
}
function getDayAutofocus({ hasValue, selected, firstInMonth }) {
  if (hasValue) {
    return selected ? true : void 0;
  }
  return firstInMonth ? true : void 0;
}
var __defProp$g = Object.defineProperty;
var __defProps$6 = Object.defineProperties;
var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
var __hasOwnProp$g = Object.prototype.hasOwnProperty;
var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
const sizes = {
  xs: 34,
  sm: 38,
  md: 46,
  lg: 58,
  xl: 66
};
var useStyles$6 = createStyles((theme, { size: size2, fullWidth, hideOutsideDates }) => ({
  day: __spreadProps$6(__spreadValues$g(__spreadProps$6(__spreadValues$g(__spreadValues$g({}, theme.fn.fontStyles()), theme.fn.focusStyles()), {
    position: "relative",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent",
    width: fullWidth ? "100%" : theme.fn.size({ size: size2, sizes }),
    height: theme.fn.size({ size: size2, sizes }),
    lineHeight: `${theme.fn.size({ size: size2, sizes })}px`,
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    padding: 0,
    borderRadius: theme.radius.sm,
    border: "none",
    cursor: "pointer",
    userSelect: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    "&:disabled": {
      pointerEvents: "none",
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]
    }
  }), theme.fn.hover({
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
  })), {
    "&[data-weekend]": {
      color: theme.colorScheme === "dark" ? theme.colors.red[5] : theme.colors.red[7]
    },
    "&[data-outside]": {
      display: hideOutsideDates ? "none" : void 0,
      color: `${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]}`
    },
    "&[data-in-range]": {
      backgroundColor: theme.fn.variant({ variant: "light" }).background,
      borderRadius: 0
    },
    "&[data-selected]": {
      backgroundColor: theme.fn.variant({ variant: "filled" }).background,
      color: theme.white
    },
    "&[data-first-in-range]": {
      borderTopLeftRadius: theme.radius.sm,
      borderBottomLeftRadius: theme.radius.sm
    },
    "&[data-last-in-range]": {
      borderTopRightRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm
    }
  })
}));
var __defProp$f = Object.defineProperty;
var __defProps$5 = Object.defineProperties;
var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
var __hasOwnProp$f = Object.prototype.hasOwnProperty;
var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
var __objRest$c = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$f.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$f)
    for (var prop of __getOwnPropSymbols$f(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$f.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Day = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    value,
    selected,
    weekend,
    outside,
    onMouseEnter,
    classNames,
    styles,
    hasValue,
    firstInRange,
    lastInRange,
    __staticSelector = "Month",
    inRange,
    size: size2,
    fullWidth,
    firstInMonth,
    focusable: focusable2,
    hideOutsideDates,
    renderDay,
    unstyled,
    disabled,
    stopPropagation
  } = _b, others = __objRest$c(_b, ["className", "value", "selected", "weekend", "outside", "onMouseEnter", "classNames", "styles", "hasValue", "firstInRange", "lastInRange", "__staticSelector", "inRange", "size", "fullWidth", "firstInMonth", "focusable", "hideOutsideDates", "renderDay", "unstyled", "disabled", "stopPropagation"]);
  const {
    classes,
    cx
  } = useStyles$6({
    size: size2,
    fullWidth,
    hideOutsideDates
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  return /* @__PURE__ */ jsx("button", {
    ...__spreadProps$5(__spreadValues$f({}, others), {
      type: "button",
      ref,
      disabled,
      onMouseEnter: (event) => onMouseEnter(value, event),
      tabIndex: getDayTabIndex({
        focusable: focusable2,
        hasValue,
        selected,
        firstInMonth
      }),
      "data-autofocus": getDayAutofocus({
        hasValue,
        selected,
        firstInMonth
      }),
      "data-mantine-stop-propagation": stopPropagation || void 0,
      "data-outside": outside && !disabled || void 0,
      "data-weekend": weekend && !disabled || void 0,
      "data-selected": selected && !disabled || void 0,
      "data-in-range": inRange && !disabled || void 0,
      "data-first-in-range": firstInRange && !disabled || void 0,
      "data-last-in-range": lastInRange && !disabled || void 0,
      className: cx(classes.day, className)
    }),
    children: typeof renderDay === "function" ? renderDay(value) : value.getDate()
  });
});
Day.displayName = "@mantine/core/Day";
function isWeekend(date, weekendDays = [0, 6]) {
  return weekendDays.includes(date.getDay());
}
function isOutside(date, month) {
  return !isSameMonth(date, month);
}
function isDisabled({
  minDate,
  maxDate,
  excludeDate,
  disableOutsideEvents,
  date,
  outside
}) {
  const isAfterMax = maxDate instanceof Date && dayjs(maxDate).isBefore(date, "day");
  const isBeforeMin = minDate instanceof Date && dayjs(minDate).isAfter(date, "day");
  const shouldExclude = typeof excludeDate === "function" && excludeDate(date);
  const disabledOutside = !!disableOutsideEvents && !!outside;
  return isAfterMax || isBeforeMin || shouldExclude || disabledOutside;
}
function getRangeProps(date, range) {
  const hasRange = Array.isArray(range) && range.every((val) => val instanceof Date);
  const inclusiveRange = hasRange && [
    dayjs(range[0]).subtract(1, "day"),
    dayjs(range[1]).add(1, "day")
  ];
  const firstInRange = hasRange && isSameDate(date, range[0]);
  const lastInRange = hasRange && isSameDate(date, range[1]);
  const inRange = hasRange && dayjs(date).isAfter(inclusiveRange[0], "day") && dayjs(date).isBefore(inclusiveRange[1], "day");
  return { firstInRange, lastInRange, inRange, selectedInRange: firstInRange || lastInRange };
}
function getDayProps({
  date,
  month,
  hasValue,
  minDate,
  maxDate,
  value,
  excludeDate,
  disableOutsideEvents,
  range,
  weekendDays
}) {
  const outside = isOutside(date, month);
  const selected = hasValue && (Array.isArray(value) ? value.some((val) => isSameDate(val, date)) : isSameDate(date, value));
  const { inRange, lastInRange, firstInRange, selectedInRange } = getRangeProps(date, range);
  return {
    disabled: isDisabled({ minDate, maxDate, excludeDate, disableOutsideEvents, date, outside }),
    weekend: isWeekend(date, weekendDays),
    selectedInRange,
    selected,
    inRange,
    firstInRange,
    lastInRange,
    outside
  };
}
var __defProp$e = Object.defineProperty;
var __defProps$4 = Object.defineProperties;
var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$e = Object.getOwnPropertySymbols;
var __hasOwnProp$e = Object.prototype.hasOwnProperty;
var __propIsEnum$e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
var useStyles$5 = createStyles((theme, { fullWidth }) => ({
  weekday: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[5]
  },
  month: __spreadProps$4(__spreadValues$e({}, theme.fn.fontStyles()), {
    borderCollapse: "collapse",
    width: fullWidth ? "100%" : "auto",
    tableLayout: "fixed"
  }),
  cell: {
    boxSizing: "border-box",
    padding: 0,
    borderTop: "1px solid transparent"
  },
  weekdayCell: {
    boxSizing: "border-box",
    padding: 0,
    fontWeight: "normal",
    paddingBottom: `calc(${theme.spacing.xs}px / 2)`,
    textAlign: "center",
    cursor: "default",
    userSelect: "none"
  }
}));
var __defProp$d = Object.defineProperty;
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
var __objRest$b = (source, exclude) => {
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
const noop = () => false;
const defaultProps$6 = {
  disableOutsideEvents: false,
  hideWeekdays: false,
  __staticSelector: "Month",
  size: "sm",
  fullWidth: false,
  preventFocus: false,
  focusable: true,
  firstDayOfWeek: "monday",
  hideOutsideDates: false,
  weekendDays: [0, 6],
  __stopPropagation: true
};
const Month = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Month", defaultProps$6, props), {
    className,
    month,
    value,
    onChange,
    disableOutsideEvents,
    locale,
    dayClassName,
    dayStyle,
    classNames,
    styles,
    minDate,
    maxDate,
    excludeDate,
    onDayMouseEnter,
    range,
    hideWeekdays,
    __staticSelector,
    size: size2,
    fullWidth,
    preventFocus,
    focusable: focusable2,
    firstDayOfWeek,
    onDayKeyDown,
    daysRefs,
    hideOutsideDates,
    isDateInRange = noop,
    isDateFirstInRange = noop,
    isDateLastInRange = noop,
    renderDay,
    weekdayLabelFormat,
    unstyled,
    weekendDays,
    __stopPropagation
  } = _a, others = __objRest$b(_a, ["className", "month", "value", "onChange", "disableOutsideEvents", "locale", "dayClassName", "dayStyle", "classNames", "styles", "minDate", "maxDate", "excludeDate", "onDayMouseEnter", "range", "hideWeekdays", "__staticSelector", "size", "fullWidth", "preventFocus", "focusable", "firstDayOfWeek", "onDayKeyDown", "daysRefs", "hideOutsideDates", "isDateInRange", "isDateFirstInRange", "isDateLastInRange", "renderDay", "weekdayLabelFormat", "unstyled", "weekendDays", "__stopPropagation"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$5({
    fullWidth
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const finalLocale = locale || theme.datesLocale;
  const days = getMonthDays(month, firstDayOfWeek);
  const weekdays = getWeekdaysNames(finalLocale, firstDayOfWeek, weekdayLabelFormat).map((weekday) => /* @__PURE__ */ jsx("th", {
    className: classes.weekdayCell,
    children: /* @__PURE__ */ jsx(Text, {
      size: size2,
      className: classes.weekday,
      children: weekday.length >= 2 ? upperFirst(weekday) : weekday
    })
  }, weekday));
  const hasValue = Array.isArray(value) ? value.every((item) => item instanceof Date) : value instanceof Date;
  const hasValueInMonthRange = value instanceof Date && dayjs(value).isAfter(dayjs(month).startOf("month")) && dayjs(value).isBefore(dayjs(month).endOf("month"));
  const firstIncludedDay = react.exports.useMemo(() => days.flatMap((_) => _).find((date) => {
    const dayProps = getDayProps({
      date,
      month,
      hasValue,
      minDate,
      maxDate,
      value,
      excludeDate,
      disableOutsideEvents,
      range,
      weekendDays
    });
    return !dayProps.disabled && !dayProps.outside;
  }) || dayjs(month).startOf("month").toDate(), []);
  const rows = days.map((row, rowIndex) => {
    const cells = row.map((date, cellIndex) => {
      const dayProps = getDayProps({
        date,
        month,
        hasValue,
        minDate,
        maxDate,
        value,
        excludeDate,
        disableOutsideEvents,
        range,
        weekendDays
      });
      const onKeyDownPayload = {
        rowIndex,
        cellIndex,
        date
      };
      return /* @__PURE__ */ jsx("td", {
        className: classes.cell,
        children: /* @__PURE__ */ jsx(Day, {
          unstyled,
          ref: (button) => {
            if (daysRefs) {
              if (!Array.isArray(daysRefs[rowIndex])) {
                daysRefs[rowIndex] = [];
              }
              daysRefs[rowIndex][cellIndex] = button;
            }
          },
          onClick: () => typeof onChange === "function" && onChange(date),
          onMouseDown: (event) => preventFocus && event.preventDefault(),
          value: date,
          outside: dayProps.outside,
          weekend: dayProps.weekend,
          inRange: dayProps.inRange || isDateInRange(date, dayProps),
          firstInRange: dayProps.firstInRange || isDateFirstInRange(date, dayProps),
          lastInRange: dayProps.lastInRange || isDateLastInRange(date, dayProps),
          firstInMonth: isSameDate(date, firstIncludedDay),
          selected: dayProps.selected || dayProps.selectedInRange,
          hasValue: hasValueInMonthRange,
          onKeyDown: (event) => typeof onDayKeyDown === "function" && onDayKeyDown(onKeyDownPayload, event),
          className: typeof dayClassName === "function" ? dayClassName(date, dayProps) : null,
          style: typeof dayStyle === "function" ? dayStyle(date, dayProps) : null,
          disabled: dayProps.disabled,
          onMouseEnter: typeof onDayMouseEnter === "function" ? onDayMouseEnter : noop,
          size: size2,
          fullWidth,
          focusable: focusable2,
          hideOutsideDates,
          __staticSelector,
          styles,
          classNames,
          renderDay,
          stopPropagation: __stopPropagation
        })
      }, cellIndex);
    });
    return /* @__PURE__ */ jsx("tr", {
      children: cells
    }, rowIndex);
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$d({
      component: "table",
      className: cx(classes.month, className),
      ref
    }, others),
    children: [!hideWeekdays && /* @__PURE__ */ jsx("thead", {
      children: /* @__PURE__ */ jsx("tr", {
        children: weekdays
      })
    }), /* @__PURE__ */ jsx("tbody", {
      children: rows
    })]
  });
});
Month.displayName = "@mantine/dates/Month";
var __defProp$c = Object.defineProperty;
var __getOwnPropSymbols$c = Object.getOwnPropertySymbols;
var __hasOwnProp$c = Object.prototype.hasOwnProperty;
var __propIsEnum$c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$a = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$c.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$c)
    for (var prop of __getOwnPropSymbols$c(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$c.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MonthsList(_a) {
  var _b = _a, {
    amountOfMonths,
    paginateBy,
    month,
    locale,
    minDate,
    maxDate,
    allowLevelChange,
    size: size2,
    daysRefs,
    onMonthChange,
    onNextLevel,
    onDayKeyDown,
    classNames,
    styles,
    __staticSelector = "MonthsList",
    nextMonthLabel,
    previousMonthLabel,
    labelFormat,
    weekdayLabelFormat,
    preventFocus,
    renderDay,
    unstyled,
    __stopPropagation
  } = _b, others = __objRest$a(_b, ["amountOfMonths", "paginateBy", "month", "locale", "minDate", "maxDate", "allowLevelChange", "size", "daysRefs", "onMonthChange", "onNextLevel", "onDayKeyDown", "classNames", "styles", "__staticSelector", "nextMonthLabel", "previousMonthLabel", "labelFormat", "weekdayLabelFormat", "preventFocus", "renderDay", "unstyled", "__stopPropagation"]);
  const nextMonth = dayjs(month).add(amountOfMonths, "months").toDate();
  const previousMonth = dayjs(month).subtract(1, "months").toDate();
  const months = Array(amountOfMonths).fill(0).map((_, index) => {
    const monthDate = dayjs(month).add(index, "months").toDate();
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx(CalendarHeader, {
        hasNext: index + 1 === amountOfMonths && isMonthInRange({
          date: nextMonth,
          minDate,
          maxDate
        }),
        hasPrevious: index === 0 && isMonthInRange({
          date: previousMonth,
          minDate,
          maxDate
        }),
        label: formatMonthLabel({
          month: monthDate,
          locale,
          format: labelFormat
        }),
        onNext: () => onMonthChange(dayjs(month).add(paginateBy, "months").toDate()),
        onPrevious: () => onMonthChange(dayjs(month).subtract(paginateBy, "months").toDate()),
        onNextLevel,
        nextLevelDisabled: !allowLevelChange,
        size: size2,
        classNames,
        styles,
        __staticSelector,
        nextLabel: nextMonthLabel,
        previousLabel: previousMonthLabel,
        preventLevelFocus: index > 0,
        preventFocus,
        unstyled,
        __stopPropagation
      }), /* @__PURE__ */ jsx(Month, {
        ...__spreadValues$c({
          month: monthDate,
          daysRefs: daysRefs.current[index],
          onDayKeyDown: (...args) => onDayKeyDown(index, ...args),
          size: size2,
          minDate,
          maxDate,
          classNames,
          styles,
          __staticSelector,
          locale,
          focusable: index === 0,
          preventFocus,
          renderDay,
          weekdayLabelFormat,
          unstyled,
          __stopPropagation
        }, others)
      })]
    }, index);
  });
  return /* @__PURE__ */ jsx(Fragment, {
    children: months
  });
}
MonthsList.displayName = "@mantine/dates/MonthsList";
var useStyles$4 = createStyles((theme, { size: size2, amountOfMonths, fullWidth }) => {
  const _maxWidth = theme.fn.size({ size: size2, sizes }) * 7;
  const maxWidth = amountOfMonths > 1 ? _maxWidth * amountOfMonths + (amountOfMonths - 1) * theme.spacing.md : _maxWidth;
  return {
    calendarBase: {
      boxSizing: "border-box",
      display: "flex",
      gap: theme.spacing.md,
      maxWidth: fullWidth ? "100%" : maxWidth
    }
  };
});
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
var __objRest$9 = (source, exclude) => {
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
const CalendarBase = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    classNames,
    styles,
    month,
    initialMonth,
    onMonthChange,
    locale,
    amountOfMonths = 1,
    paginateBy = amountOfMonths,
    size: size2 = "sm",
    allowLevelChange = true,
    initialLevel = "date",
    minDate,
    maxDate,
    __staticSelector = "CalendarBase",
    dayClassName,
    dayStyle,
    disableOutsideEvents,
    excludeDate,
    hideWeekdays,
    fullWidth,
    preventFocus,
    firstDayOfWeek = "monday",
    value,
    onChange,
    onDayMouseEnter,
    range,
    nextDecadeLabel,
    nextMonthLabel,
    nextYearLabel,
    previousDecadeLabel,
    previousMonthLabel,
    previousYearLabel,
    labelFormat = "MMMM YYYY",
    weekdayLabelFormat,
    hideOutsideDates,
    isDateInRange,
    isDateFirstInRange,
    isDateLastInRange,
    renderDay,
    unstyled,
    weekendDays,
    __stopPropagation,
    yearLabelFormat = "YYYY"
  } = _b, others = __objRest$9(_b, ["className", "classNames", "styles", "month", "initialMonth", "onMonthChange", "locale", "amountOfMonths", "paginateBy", "size", "allowLevelChange", "initialLevel", "minDate", "maxDate", "__staticSelector", "dayClassName", "dayStyle", "disableOutsideEvents", "excludeDate", "hideWeekdays", "fullWidth", "preventFocus", "firstDayOfWeek", "value", "onChange", "onDayMouseEnter", "range", "nextDecadeLabel", "nextMonthLabel", "nextYearLabel", "previousDecadeLabel", "previousMonthLabel", "previousYearLabel", "labelFormat", "weekdayLabelFormat", "hideOutsideDates", "isDateInRange", "isDateFirstInRange", "isDateLastInRange", "renderDay", "unstyled", "weekendDays", "__stopPropagation", "yearLabelFormat"]);
  const [selectionState, setSelectionState] = react.exports.useState(initialLevel);
  const {
    classes,
    cx,
    theme
  } = useStyles$4({
    size: size2,
    fullWidth,
    amountOfMonths: selectionState === "date" ? amountOfMonths : 1
  }, {
    name: __staticSelector,
    styles,
    classNames,
    unstyled
  });
  const finalLocale = locale || theme.datesLocale;
  const daysRefs = react.exports.useRef(Array(amountOfMonths).fill(0).map(() => []));
  const [_month, setMonth] = useUncontrolled({
    value: month,
    defaultValue: initialMonth,
    finalValue: new Date(),
    onChange: onMonthChange
  });
  const [yearSelection, setYearSelection] = react.exports.useState(_month.getFullYear());
  const minYear = minDate instanceof Date ? minDate.getFullYear() : 100;
  const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : 1e4;
  const daysPerRow = 6;
  const focusOnNextFocusableDay = (direction, monthIndex, payload, n = 1) => {
    var _a2;
    const changeRow = ["down", "up"].includes(direction);
    const rowIndex = changeRow ? payload.rowIndex + (direction === "down" ? n : -n) : payload.rowIndex;
    const cellIndex = changeRow ? payload.cellIndex : payload.cellIndex + (direction === "right" ? n : -n);
    const dayToFocus = (_a2 = daysRefs.current[monthIndex][rowIndex]) == null ? void 0 : _a2[cellIndex];
    if (!dayToFocus) {
      return;
    }
    if (dayToFocus.disabled) {
      focusOnNextFocusableDay(direction, monthIndex, payload, n + 1);
    } else {
      dayToFocus.focus();
    }
  };
  const handleDayKeyDown = (monthIndex, payload, event) => {
    var _a2;
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const hasRowBelow = payload.rowIndex + 1 < daysRefs.current[monthIndex].length;
        if (hasRowBelow) {
          focusOnNextFocusableDay("down", monthIndex, payload);
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const hasRowAbove = payload.rowIndex > 0;
        if (hasRowAbove) {
          focusOnNextFocusableDay("up", monthIndex, payload);
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const isNotLastCell = payload.cellIndex !== daysPerRow;
        if (isNotLastCell) {
          focusOnNextFocusableDay("right", monthIndex, payload);
        } else if (monthIndex + 1 < amountOfMonths) {
          if (daysRefs.current[monthIndex + 1][payload.rowIndex]) {
            (_a2 = daysRefs.current[monthIndex + 1][payload.rowIndex][0]) == null ? void 0 : _a2.focus();
          }
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (payload.cellIndex !== 0) {
          focusOnNextFocusableDay("left", monthIndex, payload);
        } else if (monthIndex > 0) {
          if (daysRefs.current[monthIndex - 1][payload.rowIndex]) {
            daysRefs.current[monthIndex - 1][payload.rowIndex][daysPerRow].focus();
          }
        }
      }
    }
  };
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$b({
      className: cx(classes.calendarBase, className),
      ref
    }, others),
    children: [selectionState === "year" && /* @__PURE__ */ jsx(YearPicker, {
      size: size2,
      value: yearSelection,
      minYear,
      maxYear,
      onChange: (year) => {
        setYearSelection(year);
        setSelectionState("month");
      },
      classNames,
      styles,
      __staticSelector,
      __stopPropagation,
      nextDecadeLabel,
      previousDecadeLabel,
      preventFocus,
      unstyled,
      yearLabelFormat
    }), selectionState === "month" && /* @__PURE__ */ jsx(MonthPicker, {
      size: size2,
      value: {
        month: _month.getMonth(),
        year: _month.getFullYear()
      },
      year: yearSelection,
      onYearChange: setYearSelection,
      onNextLevel: () => setSelectionState("year"),
      locale: finalLocale,
      minDate,
      maxDate,
      onChange: (monthValue) => {
        setMonth(new Date(yearSelection, monthValue, 1));
        setSelectionState("date");
      },
      classNames,
      styles,
      __staticSelector,
      __stopPropagation,
      nextYearLabel,
      previousYearLabel,
      preventFocus,
      unstyled,
      yearLabelFormat
    }), selectionState === "date" && /* @__PURE__ */ jsx(MonthsList, {
      amountOfMonths,
      paginateBy,
      month: _month,
      locale: finalLocale,
      minDate,
      maxDate,
      allowLevelChange,
      size: size2,
      daysRefs,
      onMonthChange: setMonth,
      onNextLevel: () => setSelectionState("month"),
      onDayKeyDown: handleDayKeyDown,
      classNames,
      styles,
      __staticSelector,
      dayClassName,
      dayStyle,
      disableOutsideEvents,
      excludeDate,
      hideWeekdays,
      fullWidth,
      preventFocus,
      firstDayOfWeek,
      value,
      range,
      onChange,
      nextMonthLabel,
      previousMonthLabel,
      labelFormat,
      weekdayLabelFormat,
      onDayMouseEnter,
      renderDay,
      hideOutsideDates,
      isDateInRange,
      isDateFirstInRange,
      isDateLastInRange,
      unstyled,
      weekendDays,
      __stopPropagation
    })]
  });
});
CalendarBase.displayName = "@mantine/dates/CalendarBase";
var __defProp$a = Object.defineProperty;
var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
var __hasOwnProp$a = Object.prototype.hasOwnProperty;
var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$8 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$a.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$a)
    for (var prop of __getOwnPropSymbols$a(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$a.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$5 = {
  __staticSelector: "Calendar"
};
function Calendar(props) {
  const _a = useComponentDefaultProps("Calendar", defaultProps$5, props), {
    __staticSelector = "Calendar",
    multiple,
    value,
    onChange
  } = _a, others = __objRest$8(_a, ["__staticSelector", "multiple", "value", "onChange"]);
  const handleChange = (date) => {
    if (!multiple) {
      return onChange(date);
    }
    const isSelected = value.some((val) => isSameDate(val, date));
    return onChange(isSelected ? value.filter((val) => !isSameDate(val, date)) : [...value, date]);
  };
  return /* @__PURE__ */ jsx(CalendarBase, {
    ...__spreadValues$a({
      __staticSelector,
      onChange: handleChange,
      value
    }, others)
  });
}
Calendar.displayName = "@mantine/dates/Calendar";
var __defProp$9 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
var useStyles$3 = createStyles((theme) => ({
  wrapper: __spreadProps$3(__spreadValues$9({}, theme.fn.fontStyles()), {
    position: "relative",
    cursor: "pointer"
  }),
  input: {
    cursor: "pointer",
    whiteSpace: "nowrap",
    "&:not([data-free-input])::selection": {
      backgroundColor: "transparent"
    },
    "&[data-free-input]": {
      cursor: "text"
    }
  }
}));
var __defProp$8 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
var __objRest$7 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$8)
    for (var prop of __getOwnPropSymbols$8(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const RIGHT_SECTION_WIDTH$2 = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44
};
const defaultTransition = {
  in: {
    opacity: 1,
    transform: "translateY(0) scale(1)"
  },
  out: {
    opacity: 0,
    transform: "translateY(-25px) scale(0.93)"
  },
  common: {
    transformOrigin: "top left"
  },
  transitionProperty: "opacity, transform"
};
const DatePickerBase = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    classNames,
    className,
    style,
    styles,
    wrapperProps,
    required,
    allowFreeInput = false,
    label,
    error,
    id,
    description,
    placeholder,
    shadow,
    transition = defaultTransition,
    transitionDuration = 100,
    transitionTimingFunction,
    size: size2 = "sm",
    children,
    inputLabel,
    __staticSelector = "DatePickerBase",
    dropdownOpened,
    setDropdownOpened,
    dropdownType = "popover",
    dropdownPosition = "flip",
    clearable = true,
    clearButtonLabel,
    onClear,
    positionDependencies = [],
    zIndex,
    withinPortal = false,
    onBlur,
    onFocus,
    onChange,
    onKeyDown,
    name = "date",
    sx,
    amountOfMonths = 1,
    onDropdownClose,
    onDropdownOpen,
    clickOutsideEvents = ["mousedown", "touchstart"],
    modalZIndex,
    errorProps,
    labelProps,
    descriptionProps,
    clearButtonTabIndex = 0,
    unstyled,
    inputContainer,
    inputWrapperOrder,
    modalProps,
    withAsterisk
  } = _b, others = __objRest$7(_b, ["classNames", "className", "style", "styles", "wrapperProps", "required", "allowFreeInput", "label", "error", "id", "description", "placeholder", "shadow", "transition", "transitionDuration", "transitionTimingFunction", "size", "children", "inputLabel", "__staticSelector", "dropdownOpened", "setDropdownOpened", "dropdownType", "dropdownPosition", "clearable", "clearButtonLabel", "onClear", "positionDependencies", "zIndex", "withinPortal", "onBlur", "onFocus", "onChange", "onKeyDown", "name", "sx", "amountOfMonths", "onDropdownClose", "onDropdownOpen", "clickOutsideEvents", "modalZIndex", "errorProps", "labelProps", "descriptionProps", "clearButtonTabIndex", "unstyled", "inputContainer", "inputWrapperOrder", "modalProps", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$3(null, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const uuid2 = useId(id);
  const inputRef = react.exports.useRef();
  const closeDropdown = () => {
    setDropdownOpened(false);
    onDropdownClose == null ? void 0 : onDropdownClose();
  };
  const openDropdown = () => {
    setDropdownOpened(true);
    onDropdownOpen == null ? void 0 : onDropdownOpen();
  };
  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened);
    !dropdownOpened ? onDropdownOpen == null ? void 0 : onDropdownOpen() : onDropdownClose == null ? void 0 : onDropdownClose();
  };
  const closeOnEscape2 = (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      window.setTimeout(() => {
        var _a2;
        return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
      }, 0);
    }
  };
  const rightSection = clearable ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: onClear,
    size: size2,
    tabIndex: clearButtonTabIndex,
    unstyled
  }) : null;
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    if (allowFreeInput) {
      closeDropdown();
    }
  };
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    if (allowFreeInput) {
      openDropdown();
    }
  };
  const handleKeyDown = (event) => {
    typeof onKeyDown === "function" && onKeyDown(event);
    if ((event.key === "Space" || event.key === "Enter") && !allowFreeInput) {
      event.preventDefault();
      openDropdown();
    }
  };
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$8(__spreadValues$8({
      required,
      id: uuid2,
      label,
      error,
      description,
      className,
      style,
      classNames,
      styles,
      size: size2,
      __staticSelector,
      sx,
      errorProps,
      descriptionProps,
      labelProps,
      inputContainer,
      inputWrapperOrder,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsxs(Popover, {
      __staticSelector,
      withinPortal,
      offset: 10,
      opened: dropdownOpened,
      transitionDuration,
      transition,
      positionDependencies,
      middlewares: {
        flip: dropdownPosition === "flip",
        shift: false
      },
      position: dropdownPosition === "flip" ? "bottom-start" : dropdownPosition,
      shadow,
      onClose: closeDropdown,
      trapFocus: !allowFreeInput,
      withRoles: false,
      clickOutsideEvents,
      zIndex,
      classNames,
      styles,
      unstyled,
      children: [/* @__PURE__ */ jsx(Popover.Target, {
        children: /* @__PURE__ */ jsx("div", {
          className: classes.wrapper,
          children: /* @__PURE__ */ jsx(Input, {
            ...__spreadValues$8({
              classNames: __spreadProps$2(__spreadValues$8({}, classNames), {
                input: cx(classes.input, classNames == null ? void 0 : classNames.input)
              }),
              "data-free-input": allowFreeInput || void 0,
              styles,
              onClick: () => !allowFreeInput ? toggleDropdown() : openDropdown(),
              onKeyDown: handleKeyDown,
              id: uuid2,
              ref: useMergedRef(ref, inputRef),
              __staticSelector,
              size: size2,
              name,
              placeholder,
              value: inputLabel,
              required,
              invalid: !!error,
              readOnly: !allowFreeInput,
              rightSection,
              rightSectionWidth: theme.fn.size({
                size: size2,
                sizes: RIGHT_SECTION_WIDTH$2
              }),
              onBlur: handleInputBlur,
              onFocus: handleInputFocus,
              onChange,
              autoComplete: "off",
              unstyled
            }, rest)
          })
        })
      }), dropdownType === "popover" ? /* @__PURE__ */ jsx(Popover.Dropdown, {
        children: /* @__PURE__ */ jsx("div", {
          "data-mantine-stop-propagation": dropdownOpened,
          onKeyDownCapture: closeOnEscape2,
          "aria-hidden": allowFreeInput || void 0,
          children
        })
      }) : /* @__PURE__ */ jsx(Modal, {
        ...__spreadProps$2(__spreadValues$8({}, modalProps), {
          opened: dropdownOpened,
          onClose: closeDropdown,
          withCloseButton: false,
          size: amountOfMonths * 400,
          zIndex: modalZIndex,
          unstyled
        }),
        children
      })]
    })
  });
});
DatePickerBase.displayName = "@mantine/dates/DatePickerBase";
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
var __objRest$6 = (source, exclude) => {
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
const defaultProps$4 = {
  shadow: "sm",
  transitionDuration: 200,
  closeCalendarOnChange: true,
  labelFormat: "MMMM YYYY",
  initiallyOpened: false,
  name: "date",
  size: "sm",
  dropdownType: "popover",
  dropdownPosition: "flip",
  clearable: true,
  disabled: false,
  fixOnBlur: true,
  withinPortal: false,
  firstDayOfWeek: "monday",
  openDropdownOnClear: false
};
const DatePicker = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("DatePicker", defaultProps$4, props), {
    value,
    onChange,
    defaultValue,
    classNames,
    styles,
    shadow,
    locale,
    inputFormat,
    transitionDuration,
    transitionTimingFunction,
    nextMonthLabel,
    previousMonthLabel,
    closeCalendarOnChange,
    labelFormat,
    dayClassName,
    dayStyle,
    disableOutsideEvents,
    minDate,
    maxDate,
    excludeDate,
    initialMonth,
    initiallyOpened,
    name,
    size: size2,
    dropdownType,
    dropdownPosition,
    clearable,
    disabled,
    clearButtonLabel,
    fixOnBlur,
    allowFreeInput,
    withinPortal,
    dateParser,
    firstDayOfWeek,
    onFocus,
    onBlur,
    amountOfMonths,
    allowLevelChange,
    initialLevel,
    onDropdownClose,
    onDropdownOpen,
    hideOutsideDates,
    hideWeekdays,
    renderDay,
    type,
    openDropdownOnClear,
    unstyled,
    weekendDays,
    yearLabelFormat,
    nextDecadeLabel,
    nextYearLabel,
    previousDecadeLabel,
    previousYearLabel
  } = _a, others = __objRest$6(_a, ["value", "onChange", "defaultValue", "classNames", "styles", "shadow", "locale", "inputFormat", "transitionDuration", "transitionTimingFunction", "nextMonthLabel", "previousMonthLabel", "closeCalendarOnChange", "labelFormat", "dayClassName", "dayStyle", "disableOutsideEvents", "minDate", "maxDate", "excludeDate", "initialMonth", "initiallyOpened", "name", "size", "dropdownType", "dropdownPosition", "clearable", "disabled", "clearButtonLabel", "fixOnBlur", "allowFreeInput", "withinPortal", "dateParser", "firstDayOfWeek", "onFocus", "onBlur", "amountOfMonths", "allowLevelChange", "initialLevel", "onDropdownClose", "onDropdownOpen", "hideOutsideDates", "hideWeekdays", "renderDay", "type", "openDropdownOnClear", "unstyled", "weekendDays", "yearLabelFormat", "nextDecadeLabel", "nextYearLabel", "previousDecadeLabel", "previousYearLabel"]);
  const theme = useMantineTheme();
  const finalLocale = locale || theme.datesLocale;
  const dateFormat = type === "date" ? "YYYY-MM-DD" : inputFormat || theme.dateFormat;
  const [dropdownOpened, setDropdownOpened] = react.exports.useState(initiallyOpened);
  const calendarSize = size2 === "lg" || size2 === "xl" ? "md" : "sm";
  const inputRef = react.exports.useRef();
  const [lastValidValue, setLastValidValue] = react.exports.useState(defaultValue != null ? defaultValue : null);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const [calendarMonth, setCalendarMonth] = react.exports.useState(_value || initialMonth || new Date());
  const [focused, setFocused] = react.exports.useState(false);
  const [inputState, setInputState] = react.exports.useState(_value instanceof Date ? upperFirst(dayjs(_value).locale(finalLocale).format(dateFormat)) : "");
  const closeDropdown = () => {
    setDropdownOpened(false);
    onDropdownClose == null ? void 0 : onDropdownClose();
  };
  const openDropdown = () => {
    setDropdownOpened(true);
    onDropdownOpen == null ? void 0 : onDropdownOpen();
  };
  react.exports.useEffect(() => {
    if (value === null && !focused) {
      setInputState("");
    }
    if (value instanceof Date && !focused) {
      setInputState(upperFirst(dayjs(value).locale(finalLocale).format(dateFormat)));
    }
  }, [value, focused]);
  const handleValueChange = (date) => {
    setValue(date);
    setInputState(upperFirst(dayjs(date).locale(finalLocale).format(dateFormat)));
    closeCalendarOnChange && closeDropdown();
    window.setTimeout(() => {
      var _a2;
      return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }, 0);
  };
  const handleClear = () => {
    var _a2;
    setValue(null);
    setLastValidValue(null);
    setInputState("");
    openDropdownOnClear && openDropdown();
    (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
  };
  const parseDate = (date) => dateParser ? dateParser(date) : dayjs(date, dateFormat, finalLocale).toDate();
  const setDateFromInput = () => {
    let date = typeof _value === "string" ? parseDate(_value) : _value;
    if (maxDate && dayjs(date).isAfter(maxDate)) {
      date = maxDate;
    }
    if (minDate && dayjs(date).isBefore(minDate)) {
      date = minDate;
    }
    if (dayjs(date).isValid()) {
      setValue(date);
      setLastValidValue(date);
      setInputState(upperFirst(dayjs(date).locale(finalLocale).format(dateFormat)));
      setCalendarMonth(date);
    } else if (fixOnBlur) {
      setValue(lastValidValue);
    }
  };
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    setFocused(false);
    if (allowFreeInput) {
      setDateFromInput();
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && allowFreeInput) {
      closeDropdown();
      setDateFromInput();
    }
  };
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    setFocused(true);
  };
  const handleChange = (event) => {
    openDropdown();
    const date = parseDate(event.target.value);
    if (dayjs(date).isValid()) {
      setValue(date);
      setLastValidValue(date);
      setInputState(event.target.value);
      setCalendarMonth(date);
    } else {
      setInputState(event.target.value);
    }
  };
  return /* @__PURE__ */ jsx(DatePickerBase, {
    ...__spreadValues$7({
      allowFreeInput,
      dropdownOpened,
      setDropdownOpened,
      shadow,
      transitionDuration,
      ref: useMergedRef(ref, inputRef),
      size: size2,
      styles,
      classNames,
      onChange: handleChange,
      onBlur: handleInputBlur,
      onFocus: handleInputFocus,
      onKeyDown: handleKeyDown,
      name,
      inputLabel: inputState,
      __staticSelector: "DatePicker",
      dropdownType,
      dropdownPosition,
      clearable: type === "date" ? false : clearable && !!_value && !disabled,
      clearButtonLabel,
      onClear: handleClear,
      disabled,
      withinPortal,
      amountOfMonths,
      onDropdownClose,
      onDropdownOpen,
      type,
      unstyled
    }, others),
    children: /* @__PURE__ */ jsx(Calendar, {
      classNames,
      styles,
      locale: finalLocale,
      nextMonthLabel,
      previousMonthLabel,
      month: allowFreeInput ? calendarMonth : void 0,
      initialMonth: initialMonth || (_value instanceof Date ? _value : new Date()),
      onMonthChange: setCalendarMonth,
      value: _value instanceof Date ? _value : dayjs(_value).toDate(),
      onChange: handleValueChange,
      labelFormat,
      dayClassName,
      dayStyle,
      disableOutsideEvents,
      minDate,
      maxDate,
      excludeDate,
      __staticSelector: "DatePicker",
      fullWidth: dropdownType === "modal",
      __stopPropagation: dropdownType !== "modal",
      size: dropdownType === "modal" ? "lg" : calendarSize,
      firstDayOfWeek,
      preventFocus: allowFreeInput,
      amountOfMonths,
      allowLevelChange,
      initialLevel,
      hideOutsideDates,
      hideWeekdays,
      renderDay,
      unstyled,
      weekendDays,
      yearLabelFormat,
      nextDecadeLabel,
      nextYearLabel,
      previousDecadeLabel,
      previousYearLabel
    })
  });
});
DatePicker.displayName = "@mantine/dates/DatePicker";
var __defProp$6 = Object.defineProperty;
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
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$6)
    for (var prop of __getOwnPropSymbols$6(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$3 = {
  __staticSelector: "RangeCalendar",
  allowSingleDateInRange: false,
  amountOfMonths: 1
};
const RangeCalendar = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RangeCalendar", defaultProps$3, props), {
    value,
    onChange,
    dayStyle,
    onMouseLeave,
    __staticSelector,
    allowSingleDateInRange,
    amountOfMonths,
    paginateBy
  } = _a, others = __objRest$5(_a, ["value", "onChange", "dayStyle", "onMouseLeave", "__staticSelector", "allowSingleDateInRange", "amountOfMonths", "paginateBy"]);
  const [hoveredDay, setHoveredDay] = react.exports.useState(null);
  const [pickedDate, setPickedDate] = react.exports.useState(null);
  const setRangeDate = (date) => {
    if (pickedDate instanceof Date) {
      if (isSameDate(date, pickedDate) && !allowSingleDateInRange) {
        setPickedDate(null);
        setHoveredDay(null);
        return null;
      }
      const result = [date, pickedDate];
      result.sort((a, b) => a.getTime() - b.getTime());
      onChange(result);
      setPickedDate(null);
      return null;
    }
    if (value[0] && isSameDate(date, value[0]) && !allowSingleDateInRange) {
      setPickedDate(null);
      setHoveredDay(null);
      onChange([null, null]);
      return null;
    }
    onChange([date, null]);
    setPickedDate(date);
    return null;
  };
  const handleMouseLeave = (event) => {
    typeof onMouseLeave === "function" && onMouseLeave(event);
    setHoveredDay(null);
  };
  const shouldHighlightDate = (date, modifiers) => {
    if (pickedDate instanceof Date && hoveredDay instanceof Date) {
      const result = [hoveredDay, pickedDate];
      result.sort((a, b) => a.getTime() - b.getTime());
      return !modifiers.selected && dayjs(date).subtract(1, "day").isBefore(result[1]) && dayjs(date).add(1, "day").isAfter(result[0]);
    }
    return false;
  };
  const isPickedDateFirstInRange = (date, modifiers) => {
    if (pickedDate instanceof Date && hoveredDay instanceof Date) {
      const result = [hoveredDay, pickedDate];
      result.sort((a, b) => a.getTime() - b.getTime());
      return modifiers.selected && dayjs(date).isBefore(result[1]);
    }
    return false;
  };
  const isPickedDateLastInRange = (date, modifiers) => {
    if (pickedDate instanceof Date && hoveredDay instanceof Date) {
      const result = [hoveredDay, pickedDate];
      result.sort((a, b) => a.getTime() - b.getTime());
      return modifiers.selected && dayjs(date).isAfter(result[0]);
    }
    return false;
  };
  return /* @__PURE__ */ jsx(CalendarBase, {
    ...__spreadValues$6({
      dayStyle,
      onMouseLeave: handleMouseLeave,
      onDayMouseEnter: (date) => setHoveredDay(date),
      onChange: setRangeDate,
      value: pickedDate,
      range: value,
      ref,
      __staticSelector,
      amountOfMonths,
      paginateBy: paginateBy || amountOfMonths,
      hideOutsideDates: amountOfMonths > 1,
      isDateInRange: shouldHighlightDate,
      isDateFirstInRange: isPickedDateFirstInRange,
      isDateLastInRange: isPickedDateLastInRange
    }, others)
  });
});
RangeCalendar.displayName = "@mantine/dates/RangeCalendar";
var __defProp$5 = Object.defineProperty;
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
var __objRest$4 = (source, exclude) => {
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
const validationRule = (val) => Array.isArray(val) && val.length === 2 && val.every((v) => v instanceof Date);
const isFirstDateSet = (val) => Array.isArray(val) && val.length === 2 && val[0] instanceof Date;
const defaultProps$2 = {
  shadow: "sm",
  transitionDuration: 200,
  closeCalendarOnChange: true,
  labelFormat: "MMMM YYYY",
  initiallyOpened: false,
  size: "sm",
  dropdownType: "popover",
  labelSeparator: "\u2013",
  clearable: true,
  firstDayOfWeek: "monday",
  allowSingleDateInRange: false,
  amountOfMonths: 1,
  withinPortal: false,
  openDropdownOnClear: false
};
const DateRangePicker = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("DateRangePicker", defaultProps$2, props), {
    value,
    onChange,
    defaultValue,
    classNames,
    styles,
    shadow,
    locale,
    inputFormat,
    transitionDuration,
    transitionTimingFunction,
    nextMonthLabel,
    previousMonthLabel,
    closeCalendarOnChange,
    labelFormat,
    dayClassName,
    dayStyle,
    disableOutsideEvents,
    minDate,
    maxDate,
    excludeDate,
    initialMonth,
    initiallyOpened,
    size: size2,
    dropdownType,
    labelSeparator,
    clearable,
    clearButtonLabel,
    firstDayOfWeek,
    allowLevelChange,
    allowSingleDateInRange,
    amountOfMonths,
    withinPortal,
    initialLevel,
    onDropdownClose,
    onDropdownOpen,
    hideOutsideDates,
    hideWeekdays,
    renderDay,
    openDropdownOnClear,
    unstyled,
    weekendDays,
    yearLabelFormat,
    nextDecadeLabel,
    nextYearLabel,
    previousDecadeLabel,
    previousYearLabel
  } = _a, others = __objRest$4(_a, ["value", "onChange", "defaultValue", "classNames", "styles", "shadow", "locale", "inputFormat", "transitionDuration", "transitionTimingFunction", "nextMonthLabel", "previousMonthLabel", "closeCalendarOnChange", "labelFormat", "dayClassName", "dayStyle", "disableOutsideEvents", "minDate", "maxDate", "excludeDate", "initialMonth", "initiallyOpened", "size", "dropdownType", "labelSeparator", "clearable", "clearButtonLabel", "firstDayOfWeek", "allowLevelChange", "allowSingleDateInRange", "amountOfMonths", "withinPortal", "initialLevel", "onDropdownClose", "onDropdownOpen", "hideOutsideDates", "hideWeekdays", "renderDay", "openDropdownOnClear", "unstyled", "weekendDays", "yearLabelFormat", "nextDecadeLabel", "nextYearLabel", "previousDecadeLabel", "previousYearLabel"]);
  const theme = useMantineTheme();
  const finalLocale = locale || theme.datesLocale;
  const dateFormat = inputFormat || theme.dateFormat;
  const [dropdownOpened, setDropdownOpened] = react.exports.useState(initiallyOpened);
  const calendarSize = size2 === "lg" || size2 === "xl" ? "md" : "sm";
  const inputRef = react.exports.useRef();
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [null, null],
    onChange
  });
  const handleValueChange = (range) => {
    setValue(range);
    if (closeCalendarOnChange && validationRule(range)) {
      setDropdownOpened(false);
      onDropdownClose == null ? void 0 : onDropdownClose();
      window.setTimeout(() => {
        var _a2;
        return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
      }, 0);
    }
  };
  const valueValid = validationRule(_value);
  const firstValueValid = isFirstDateSet(_value);
  const firstDateLabel = _value[0] ? upperFirst(dayjs(_value[0]).locale(finalLocale).format(dateFormat)) : "";
  const secondDateLabel = _value[1] ? upperFirst(dayjs(_value[1]).locale(finalLocale).format(dateFormat)) : "";
  const handleClear = () => {
    var _a2;
    setValue([null, null]);
    setDropdownOpened(true);
    openDropdownOnClear && (onDropdownOpen == null ? void 0 : onDropdownOpen());
    (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
  };
  const handleDropdownToggle = (isOpened) => {
    if (!isOpened && firstValueValid && _value[1] === null) {
      handleClear();
    }
    setDropdownOpened(isOpened);
  };
  return /* @__PURE__ */ jsx(DatePickerBase, {
    ...__spreadValues$5({
      dropdownOpened,
      setDropdownOpened: handleDropdownToggle,
      shadow,
      transitionDuration,
      ref: useMergedRef(ref, inputRef),
      size: size2,
      styles,
      classNames,
      inputLabel: firstValueValid ? `${firstDateLabel} ${labelSeparator} ${secondDateLabel}` : "",
      __staticSelector: "DateRangePicker",
      dropdownType,
      clearable: clearable && firstValueValid,
      clearButtonLabel,
      onClear: handleClear,
      withinPortal,
      amountOfMonths,
      onDropdownClose,
      onDropdownOpen,
      unstyled
    }, others),
    children: /* @__PURE__ */ jsx(RangeCalendar, {
      classNames,
      styles,
      locale: finalLocale,
      nextMonthLabel,
      previousMonthLabel,
      initialMonth: valueValid ? _value[0] : initialMonth,
      value: _value,
      onChange: handleValueChange,
      labelFormat,
      dayClassName,
      dayStyle,
      disableOutsideEvents,
      minDate,
      maxDate,
      excludeDate,
      __staticSelector: "DateRangePicker",
      fullWidth: dropdownType === "modal",
      firstDayOfWeek,
      size: dropdownType === "modal" ? "lg" : calendarSize,
      allowLevelChange,
      allowSingleDateInRange,
      amountOfMonths,
      initialLevel,
      hideOutsideDates,
      hideWeekdays,
      renderDay,
      unstyled,
      weekendDays,
      yearLabelFormat,
      nextDecadeLabel,
      nextYearLabel,
      previousDecadeLabel,
      previousYearLabel
    })
  });
});
DateRangePicker.displayName = "@mantine/dates/DateRangePicker";
function padTime(value) {
  const _val = parseInt(value, 10);
  return _val >= 10 ? _val.toString() : `0${_val}`;
}
var __defProp$4 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
const inputSizes = {
  xs: 20,
  sm: 23,
  md: 25,
  lg: 27,
  xl: 29
};
var useStyles$2 = createStyles((theme, { size: size2, hasValue }) => ({
  timeInput: __spreadProps$1(__spreadValues$4({}, theme.fn.fontStyles()), {
    width: theme.fn.size({ size: size2, sizes: inputSizes }),
    appearance: "none",
    backgroundColor: "transparent",
    color: "inherit",
    padding: 0,
    textAlign: "center",
    border: "1px solid transparent",
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    lineHeight: 1,
    outline: 0,
    "&:focus": {
      textAlign: hasValue ? void 0 : "start"
    },
    "&::placeholder": {
      width: "auto",
      textAlign: "left"
    },
    "&[disabled]": {
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7],
      cursor: "not-allowed"
    }
  }),
  amPmInput: {
    textAlign: "left"
  }
}));
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
var __objRest$3 = (source, exclude) => {
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
const TimeField = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    onFocus,
    onBlur,
    onChange,
    setValue,
    withSeparator = false,
    size: size2 = "sm",
    max,
    min = 0,
    value,
    unstyled
  } = _b, others = __objRest$3(_b, ["className", "onFocus", "onBlur", "onChange", "setValue", "withSeparator", "size", "max", "min", "value", "unstyled"]);
  const [digitsEntered, setDigitsEntered] = react.exports.useState(0);
  const {
    classes,
    cx,
    theme
  } = useStyles$2({
    size: size2,
    hasValue: !!value
  }, {
    name: "TimeField",
    unstyled
  });
  const inputRef = react.exports.useRef();
  const handleFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    inputRef.current.select();
    setDigitsEntered(0);
  };
  const handleBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    if (digitsEntered === 1) {
      typeof onChange === "function" && onChange(event.currentTarget.value, false);
    }
  };
  const handleClick = (event) => {
    event.stopPropagation();
    inputRef.current.select();
  };
  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const padded = padTime(clamp(parseInt(event.currentTarget.value, 10) + 1, min, max).toString());
      if (value !== padded) {
        onChange(padded, false);
      }
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const padded = padTime(clamp(parseInt(event.currentTarget.value, 10) - 1, min, max).toString());
      if (value !== padded) {
        onChange(padded, false);
      }
    }
  };
  const handleChange = (event) => {
    setDigitsEntered(digitsEntered + 1);
    const _val = parseInt(event.currentTarget.value, 10).toString();
    if (_val === "0" && digitsEntered === 0) {
      setValue("00");
      return;
    }
    onChange(_val, true, digitsEntered > 0);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadValues$3({
        type: "text",
        inputMode: "numeric",
        ref: useMergedRef(inputRef, ref),
        onChange: handleChange,
        onClick: handleClick,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        value,
        className: cx(classes.timeInput, className)
      }, others)
    }), withSeparator && /* @__PURE__ */ jsx(Text, {
      size: size2,
      unstyled,
      style: {
        lineHeight: 1,
        color: value ? "inherit" : theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7]
      },
      children: ":"
    })]
  });
});
TimeField.displayName = "@mantine/dates/TimeField";
function allButLastDigit(value) {
  return Math.floor(value / 10);
}
function createTimeHandler({ onChange, nextRef, min, max, nextMax }) {
  return (value, triggerShift, forceTriggerShift = false) => {
    var _a, _b;
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    if (parsed > allButLastDigit(max) || forceTriggerShift) {
      const lastDigit = parsed % 10;
      let updatedValue;
      let carryOver;
      if (parsed > max && nextMax && lastDigit <= allButLastDigit(nextMax)) {
        updatedValue = padTime(allButLastDigit(parsed).toString());
        carryOver = padTime(lastDigit.toString());
      } else {
        updatedValue = padTime(clamp(parsed, min, max).toString());
      }
      onChange(updatedValue, carryOver);
      triggerShift && ((_a = nextRef == null ? void 0 : nextRef.current) == null ? void 0 : _a.focus());
      triggerShift && ((_b = nextRef == null ? void 0 : nextRef.current) == null ? void 0 : _b.select());
      return;
    }
    onChange(parsed.toString());
  };
}
var useStyles$1 = createStyles((theme, { size: size2 }) => ({
  timeInput: {},
  amPmInput: {},
  disabled: {
    cursor: "not-allowed"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    height: theme.fn.size({ size: size2, sizes: sizes$c }) - 2
  }
}));
var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AmPmInput = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    onChange,
    onFocus,
    size: size2 = "sm",
    value,
    unstyled,
    amLabel,
    pmLabel
  } = _b, others = __objRest$2(_b, ["className", "onChange", "onFocus", "size", "value", "unstyled", "amLabel", "pmLabel"]);
  const {
    classes,
    cx
  } = useStyles$2({
    size: size2,
    hasValue: !!value
  }, {
    name: "AmPmInput",
    unstyled
  });
  const inputRef = react.exports.useRef();
  const handleFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    inputRef.current.select();
  };
  const handleClick = (event) => {
    event.stopPropagation();
    inputRef.current.select();
  };
  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(value === amLabel ? pmLabel : amLabel, true);
    }
  };
  const handleChange = (event) => {
    const lastInputVal = event.target.value.slice(-1).toLowerCase();
    if (lastInputVal === "p") {
      event.preventDefault();
      onChange(pmLabel, true);
      return;
    }
    if (lastInputVal === "a") {
      event.preventDefault();
      onChange(amLabel, true);
      return;
    }
    onChange(value.toString(), true);
  };
  return /* @__PURE__ */ jsx("input", {
    ...__spreadValues$2({
      type: "text",
      ref: useMergedRef(inputRef, ref),
      onClick: handleClick,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      value,
      className: cx(classes.timeInput, classes.amPmInput)
    }, others)
  });
});
AmPmInput.displayName = "@mantine/dates/AmPmInput";
function createAmPmHandler({ amLabel, pmLabel, onChange, nextRef }) {
  return (value, triggerShift) => {
    var _a, _b;
    const testRegex = new RegExp(`(^(${amLabel}|${pmLabel})?$)`);
    const valLower = value.toLowerCase();
    if (valLower === amLabel || valLower === pmLabel) {
      onChange(valLower);
      triggerShift && ((_a = nextRef == null ? void 0 : nextRef.current) == null ? void 0 : _a.focus());
      triggerShift && ((_b = nextRef == null ? void 0 : nextRef.current) == null ? void 0 : _b.select());
      return;
    }
    if (!testRegex.test(valLower)) {
      return;
    }
    onChange(valLower);
  };
}
function getDate(hours, minutes, seconds, format, pmLabel, amPm) {
  const date = dayjs();
  let _hours = parseInt(hours, 10);
  const _minutes = parseInt(minutes, 10);
  const _seconds = parseInt(seconds, 10);
  if (Number.isNaN(_hours)) {
    _hours = 0;
  }
  if (format === "12") {
    _hours %= 12;
    if (amPm === pmLabel) {
      _hours += 12;
    }
  }
  return date.hour(_hours).minute(Number.isNaN(_minutes) ? 0 : _minutes).second(Number.isNaN(_seconds) ? 0 : _seconds).millisecond(0).toDate();
}
function getTimeValues(value, format, amLabel, pmLabel) {
  if (!(value instanceof Date)) {
    return { hours: "", minutes: "", seconds: "", amPm: "" };
  }
  let _hours = value.getHours();
  const isPm = _hours >= 12;
  if (format === "12") {
    _hours %= 12;
    if (_hours === 0) {
      _hours += 12;
    }
  }
  return {
    hours: padTime(_hours.toString()),
    minutes: padTime(value.getMinutes().toString()),
    seconds: padTime(value.getSeconds().toString()),
    amPm: isPm ? pmLabel : amLabel
  };
}
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
const RIGHT_SECTION_WIDTH$1 = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44
};
const defaultProps$1 = {
  size: "sm",
  withSeconds: false,
  clearable: false,
  format: "24",
  amLabel: "am",
  pmLabel: "pm",
  timePlaceholder: "--",
  amPmPlaceholder: "am",
  disabled: false
};
const TimeInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TimeInput", defaultProps$1, props), {
    required,
    label,
    error,
    description,
    className,
    style,
    size: size2,
    wrapperProps,
    classNames,
    styles,
    id,
    value,
    defaultValue,
    onChange,
    withSeconds,
    clearable,
    clearButtonLabel,
    format,
    amLabel,
    pmLabel,
    name,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    amPmLabel,
    timePlaceholder,
    amPmPlaceholder,
    disabled,
    sx,
    nextRef,
    labelProps,
    descriptionProps,
    errorProps,
    unstyled,
    withAsterisk
  } = _a, others = __objRest$1(_a, ["required", "label", "error", "description", "className", "style", "size", "wrapperProps", "classNames", "styles", "id", "value", "defaultValue", "onChange", "withSeconds", "clearable", "clearButtonLabel", "format", "amLabel", "pmLabel", "name", "hoursLabel", "minutesLabel", "secondsLabel", "amPmLabel", "timePlaceholder", "amPmPlaceholder", "disabled", "sx", "nextRef", "labelProps", "descriptionProps", "errorProps", "unstyled", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: "TimeInput"
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const uuid2 = useId(id);
  const hoursRef = react.exports.useRef();
  const minutesRef = react.exports.useRef();
  const secondsRef = react.exports.useRef();
  const amPmRef = react.exports.useRef();
  const [time, setTime] = react.exports.useState(getTimeValues(value || defaultValue, format, amLabel, pmLabel));
  const [_value, setValue] = react.exports.useState(value || defaultValue);
  useDidUpdate(() => {
    setTime(getTimeValues(_value, format, amLabel, pmLabel));
  }, [_value, format, amLabel, pmLabel]);
  useDidUpdate(() => {
    if ((value == null ? void 0 : value.getTime()) !== (_value == null ? void 0 : _value.getTime())) {
      setValue(value);
    }
  }, [value]);
  const setDate = (change) => {
    const timeWithChange = __spreadValues$1(__spreadValues$1({}, time), change);
    const newDate = getDate(timeWithChange.hours, timeWithChange.minutes, timeWithChange.seconds, format, pmLabel, timeWithChange.amPm);
    setValue(newDate);
    typeof onChange === "function" && onChange(newDate);
  };
  const handleHoursChange = createTimeHandler({
    onChange: (val, carryOver) => {
      setDate({
        hours: val,
        minutes: carryOver != null ? carryOver : time.minutes
      });
    },
    min: format === "12" ? 1 : 0,
    max: format === "12" ? 12 : 23,
    nextRef: minutesRef,
    nextMax: 59
  });
  const handleMinutesChange = createTimeHandler({
    onChange: (val, carryOver) => {
      setDate({
        minutes: val,
        seconds: carryOver != null ? carryOver : time.seconds
      });
    },
    min: 0,
    max: 59,
    nextRef: withSeconds ? secondsRef : format === "12" ? amPmRef : nextRef,
    nextMax: withSeconds ? 59 : void 0
  });
  const handleSecondsChange = createTimeHandler({
    onChange: (val) => {
      setDate({
        seconds: val
      });
    },
    min: 0,
    max: 59,
    nextRef: format === "12" ? amPmRef : nextRef
  });
  const handleAmPmChange = createAmPmHandler({
    amLabel,
    pmLabel,
    onChange: (val) => {
      setDate({
        amPm: val
      });
    },
    nextRef
  });
  const handleClear = () => {
    setTime({
      hours: "",
      minutes: "",
      seconds: "",
      amPm: ""
    });
    setValue(null);
    onChange == null ? void 0 : onChange(null);
    hoursRef.current.focus();
  };
  const rightSection = clearable && _value && !disabled ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: handleClear,
    size: size2,
    unstyled
  }) : null;
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1(__spreadValues$1({
      required,
      label,
      error,
      description,
      className,
      style,
      classNames,
      styles,
      size: size2,
      __staticSelector: "TimeInput",
      id: uuid2,
      sx,
      errorProps,
      descriptionProps,
      labelProps,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadValues$1({
        component: "div",
        __staticSelector: "TimeInput",
        required,
        invalid: !!error,
        onClick: () => hoursRef.current.focus(),
        size: size2,
        className: cx({
          [classes.disabled]: disabled
        }),
        classNames,
        styles,
        disabled,
        rightSection,
        rightSectionWidth: theme.fn.size({
          size: size2,
          sizes: RIGHT_SECTION_WIDTH$1
        }),
        unstyled
      }, rest),
      children: /* @__PURE__ */ jsxs("div", {
        className: classes.controls,
        children: [/* @__PURE__ */ jsx(TimeField, {
          ref: useMergedRef(hoursRef, ref),
          value: time.hours,
          onChange: handleHoursChange,
          setValue: (val) => setTime((current) => __spreadProps(__spreadValues$1({}, current), {
            hours: val
          })),
          id: uuid2,
          className: classes.timeInput,
          withSeparator: true,
          size: size2,
          max: format === "12" ? 12 : 23,
          placeholder: timePlaceholder,
          "aria-label": hoursLabel,
          disabled,
          name,
          unstyled
        }), /* @__PURE__ */ jsx(TimeField, {
          ref: minutesRef,
          value: time.minutes,
          onChange: handleMinutesChange,
          setValue: (val) => setTime((current) => __spreadProps(__spreadValues$1({}, current), {
            minutes: val
          })),
          className: classes.timeInput,
          withSeparator: withSeconds,
          size: size2,
          max: 59,
          placeholder: timePlaceholder,
          "aria-label": minutesLabel,
          disabled,
          unstyled
        }), withSeconds && /* @__PURE__ */ jsx(TimeField, {
          ref: secondsRef,
          value: time.seconds,
          onChange: handleSecondsChange,
          setValue: (val) => setTime((current) => __spreadProps(__spreadValues$1({}, current), {
            seconds: val
          })),
          className: classes.timeInput,
          size: size2,
          max: 59,
          placeholder: timePlaceholder,
          "aria-label": secondsLabel,
          disabled,
          unstyled
        }), format === "12" && /* @__PURE__ */ jsx(AmPmInput, {
          ref: amPmRef,
          value: time.amPm,
          onChange: handleAmPmChange,
          placeholder: amPmPlaceholder,
          amLabel,
          pmLabel,
          size: size2,
          "aria-label": amPmLabel,
          disabled,
          unstyled
        })]
      })
    })
  });
});
TimeInput.displayName = "@mantine/dates/TimeInput";
var useStyles = createStyles((theme, { size: size2 }) => ({
  timeField: {},
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },
  inputWrapper: {
    display: "inline-flex",
    alignItems: "center",
    height: theme.fn.size({ size: size2, sizes: sizes$c }) - 2
  },
  separator: {
    paddingLeft: theme.fn.size({ size: size2, sizes: theme.spacing }) / 2,
    paddingRight: theme.fn.size({ size: size2, sizes: theme.spacing }) / 2,
    lineHeight: 1
  }
}));
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
const RIGHT_SECTION_WIDTH = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44
};
const defaultProps = {
  size: "sm",
  defaultValue: [null, null],
  withSeconds: false,
  clearable: false,
  format: "24",
  timePlaceholder: "--",
  amPmPlaceholder: "am",
  labelSeparator: "\u2013",
  disabled: false
};
const TimeRangeInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TimeRangeInput", defaultProps, props), {
    required,
    label,
    error,
    description,
    className,
    style,
    size: size2,
    wrapperProps,
    classNames,
    styles,
    id,
    value,
    defaultValue,
    onChange,
    withSeconds,
    clearable,
    clearButtonLabel,
    format,
    name,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    amPmLabel,
    timePlaceholder,
    amPmPlaceholder,
    labelSeparator,
    disabled,
    sx,
    labelProps,
    descriptionProps,
    errorProps,
    unstyled,
    withAsterisk
  } = _a, others = __objRest(_a, ["required", "label", "error", "description", "className", "style", "size", "wrapperProps", "classNames", "styles", "id", "value", "defaultValue", "onChange", "withSeconds", "clearable", "clearButtonLabel", "format", "name", "hoursLabel", "minutesLabel", "secondsLabel", "amPmLabel", "timePlaceholder", "amPmPlaceholder", "labelSeparator", "disabled", "sx", "labelProps", "descriptionProps", "errorProps", "unstyled", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: "TimeRangeInput"
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const uuid2 = useId(id);
  const fromTimeRef = react.exports.useRef();
  const toTimeRef = react.exports.useRef();
  const [_value, setValue] = react.exports.useState(value != null ? value : defaultValue);
  useDidUpdate(() => {
    typeof onChange === "function" && onChange(_value);
  }, [_value]);
  useDidUpdate(() => {
    var _a2, _b, _c, _d;
    if (((_a2 = value[0]) == null ? void 0 : _a2.getTime()) !== ((_b = _value[0]) == null ? void 0 : _b.getTime()) || ((_c = value[1]) == null ? void 0 : _c.getTime()) !== ((_d = _value[1]) == null ? void 0 : _d.getTime())) {
      setValue(value);
    }
  }, [value]);
  const handleClear = () => {
    var _a2;
    setValue([null, null]);
    (_a2 = fromTimeRef.current) == null ? void 0 : _a2.focus();
  };
  const rightSection = clearable && _value.filter((item) => Boolean(item)).length > 0 ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: handleClear,
    size: size2,
    unstyled
  }) : null;
  const forwardProps = {
    amPmLabel,
    amPmPlaceholder,
    disabled,
    format,
    hoursLabel,
    minutesLabel,
    secondsLabel,
    size: size2,
    timePlaceholder,
    withSeconds
  };
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues(__spreadValues({
      required,
      label,
      error,
      description,
      className,
      style,
      classNames,
      styles,
      size: size2,
      __staticSelector: "TimeRangeInput",
      id: uuid2,
      sx,
      errorProps,
      descriptionProps,
      labelProps,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadValues({
        component: "div",
        __staticSelector: "TimeRangeInput",
        required,
        invalid: !!error,
        onClick: () => {
          var _a2;
          (_a2 = fromTimeRef.current) == null ? void 0 : _a2.focus();
        },
        size: size2,
        className: cx({
          [classes.disabled]: disabled
        }),
        classNames,
        styles,
        disabled,
        rightSection,
        rightSectionWidth: theme.fn.size({
          size: size2,
          sizes: RIGHT_SECTION_WIDTH
        }),
        unstyled
      }, rest),
      children: /* @__PURE__ */ jsxs("div", {
        className: classes.inputWrapper,
        children: [/* @__PURE__ */ jsx(TimeInput, {
          ...__spreadValues({
            ref: useMergedRef(fromTimeRef, ref),
            variant: "unstyled",
            value: _value[0],
            onChange: (date) => setValue([date, _value[1]]),
            name,
            nextRef: toTimeRef,
            id: uuid2,
            unstyled
          }, forwardProps)
        }), /* @__PURE__ */ jsx("span", {
          className: classes.separator,
          style: {
            color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[7]
          },
          children: labelSeparator
        }), /* @__PURE__ */ jsx(TimeInput, {
          ...__spreadValues({
            ref: toTimeRef,
            variant: "unstyled",
            value: _value[1],
            onChange: (date) => setValue([_value[0], date]),
            unstyled
          }, forwardProps)
        })]
      })
    })
  });
});
TimeRangeInput.displayName = "@mantine/dates/TimeRangeInput";
function DateFilter({
  label,
  groupRules,
  updateGroupRules,
  id
}) {
  const form = useForm({
    initialValues: {
      operator: "lt",
      value: "",
      label
    },
    validateInputOnChange: true
  });
  react.exports.useEffect(function valuesChanges() {
    updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
  }, [form.values.value, form.values.operator, label]);
  return /* @__PURE__ */ jsx("form", {
    children: /* @__PURE__ */ jsxs(Group, {
      align: "start",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "",
        "data-test": "table-filter-operator",
        sx: {
          width: "130px"
        },
        optionsData: [{
          value: "lt",
          label: "less than"
        }, {
          value: "gt",
          label: "more than"
        }],
        ...form.getInputProps("operator")
      }), /* @__PURE__ */ jsx(DatePicker, {
        "data-test": "table-filter-value",
        title: form.getInputProps("value").value,
        placeholder: "value",
        ...form.getInputProps("value")
      })]
    })
  });
}
function StringFilter({
  label,
  groupRules,
  updateGroupRules,
  id
}) {
  const form = useForm({
    initialValues: {
      operator: "eq",
      value: "",
      label
    },
    validateInputOnChange: true
  });
  react.exports.useEffect(function valuesChanges() {
    updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
  }, [form.values.value, form.values.operator, label]);
  return /* @__PURE__ */ jsx("form", {
    children: /* @__PURE__ */ jsxs(Group, {
      align: "start",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "",
        "data-test": "table-filter-operator",
        sx: {
          width: "130px"
        },
        optionsData: [{
          value: "eq",
          label: "equals"
        }, {
          value: "ne",
          label: "not equals"
        }, {
          value: "contains",
          label: "contains"
        }, {
          value: "not_contains",
          label: "not contains"
        }],
        ...form.getInputProps("operator")
      }), /* @__PURE__ */ jsx(TextInput, {
        "data-test": "table-filter-value",
        label: "",
        title: form.getInputProps("value").value,
        placeholder: "value",
        ...form.getInputProps("value")
      })]
    })
  });
}
function useDistinctLogQuery({
  resource,
  field,
  keys = [],
  onSuccess,
  onError = (e) => errorMsg({
    error: e
  })
}) {
  return useQuery([resource, field, "distinct", ...keys], () => GenericService.distinct(resource, field), {
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess,
    onError
  });
}
function LogLevelFilter({
  label,
  groupRules,
  updateGroupRules,
  id
}) {
  const distinctQuery = useDistinctLogQuery({
    resource: "logs",
    field: "level"
  });
  let levels = [];
  if (distinctQuery.isSuccess && distinctQuery.data) {
    levels = distinctQuery.data.map((item) => ({
      value: item,
      label: item
    }));
  }
  if (distinctQuery.error)
    levels = [{
      value: "",
      label: "error loading levels"
    }];
  const form = useForm({
    initialValues: {
      operator: "eq",
      value: distinctQuery.data ? distinctQuery.data[0] : "",
      label
    },
    validateInputOnChange: true
  });
  react.exports.useEffect(() => {
    updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
  }, [form.values.value, form.values.operator, label]);
  return /* @__PURE__ */ jsx("form", {
    children: /* @__PURE__ */ jsxs(Group, {
      align: "start",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "",
        "data-test": "table-filter-operator",
        sx: {
          width: "130px"
        },
        optionsData: [{
          value: "eq",
          label: "equals"
        }, {
          value: "ne",
          label: "not equals"
        }, {
          value: "contains",
          label: "contains"
        }, {
          value: "not_contains",
          label: "not contains"
        }],
        ...form.getInputProps("operator")
      }), /* @__PURE__ */ jsx(SafeSelect, {
        "data-test": "table-filter-value",
        sx: {
          width: "130px"
        },
        title: form.getInputProps("value").value,
        optionsData: levels,
        loaded: distinctQuery.isLoading,
        ...form.getInputProps("value")
      })]
    })
  });
}
function IdFilter({
  label,
  groupRules,
  updateGroupRules,
  id
}) {
  const form = useForm({
    initialValues: {
      operator: "eq",
      value: "",
      label
    },
    validateInputOnChange: true,
    validate: {
      value: (value) => {
        return /^[0-9a-fA-F]{24,24}$/.test(value) ? null : "Invalid id";
      }
    }
  });
  react.exports.useEffect(function valuesChanges() {
    updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
  }, [form.values.value, form.values.operator, label]);
  return /* @__PURE__ */ jsx("form", {
    children: /* @__PURE__ */ jsxs(Group, {
      align: "start",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "",
        "data-test": "table-filter-operator",
        sx: {
          width: "130px"
        },
        optionsData: [{
          value: "eq",
          label: "equals"
        }, {
          value: "ne",
          label: "not equals"
        }, {
          value: "lt",
          label: "less than"
        }, {
          value: "gt",
          label: "more than"
        }],
        ...form.getInputProps("operator")
      }), /* @__PURE__ */ jsx(TextInput, {
        "data-test": "table-filter-value",
        title: form.getInputProps("value").value,
        placeholder: "value",
        ...form.getInputProps("value")
      })]
    })
  });
}
const Filters = {
  DateFilter,
  StringFilter,
  IdFilter,
  LogLevelFilter
};
function FilterWrapper({
  groupRules,
  updateGroupRules,
  removeGroupRule,
  fields,
  id,
  testAttr
}) {
  const optionsData = Object.keys(fields).map((column) => {
    return {
      value: column,
      label: fields[column].label
    };
  });
  const [selectValue, setSelectValue] = useInputState(optionsData[0].value);
  const Filter = Filters[fields[selectValue].type];
  return /* @__PURE__ */ jsxs(Group, {
    pt: 16,
    align: "start",
    noWrap: true,
    "data-test": testAttr,
    children: [/* @__PURE__ */ jsx(SafeSelect, {
      "data-test": "table-filter-column-name",
      sx: {
        width: "130px"
      },
      optionsData,
      value: selectValue,
      onChange: setSelectValue
    }), /* @__PURE__ */ jsx(Filter, {
      label: selectValue,
      groupRules,
      updateGroupRules,
      id
    }, selectValue), testAttr !== "filter-rule-0" ? /* @__PURE__ */ jsx(ActionIcon, {
      color: "red",
      variant: "light",
      onClick: () => removeGroupRule(id),
      size: 24,
      mt: 4,
      ml: -8,
      children: /* @__PURE__ */ jsx(rle, {
        stroke: 1
      })
    }) : /* @__PURE__ */ jsx(Box, {
      sx: {
        width: 18
      }
    })]
  });
}
const initGroupObject = {
  operator: "$and",
  rules: {
    initialFilterKey1: {}
  }
};
function LogicalGroup({
  fields,
  id,
  setGroupsData,
  groupsData,
  removeGroupsData,
  testAttr,
  children = ""
}) {
  const updateGroupRules = (key, value) => {
    setGroupsData((prev) => {
      const newGroupsObject = {
        ...prev
      };
      const groupObject = newGroupsObject[id];
      groupObject["rules"] = {
        ...groupObject["rules"]
      };
      groupObject["rules"][key] = value;
      newGroupsObject[id] = groupObject;
      return newGroupsObject;
    });
  };
  const updateGroupOperator = (operator) => {
    setGroupsData((prev) => {
      const newGroupsObject = {
        ...prev
      };
      const groupObject = newGroupsObject[id];
      groupObject["operator"] = operator;
      newGroupsObject[id] = groupObject;
      return newGroupsObject;
    });
  };
  const removeGroupRule = (key) => {
    setGroupsData((prev) => {
      const newGroupsObject = {
        ...prev
      };
      const groupObject = newGroupsObject[id];
      groupObject["rules"] = {
        ...groupObject["rules"]
      };
      delete groupObject["rules"][key];
      newGroupsObject[id] = groupObject;
      return newGroupsObject;
    });
  };
  const updateGroupsData = (key, value) => {
    setGroupsData((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const rules = Object.keys(groupsData[id]["rules"]).map((key, index) => /* @__PURE__ */ jsx(FilterWrapper, {
    testAttr: `filter-rule-${index}`,
    fields,
    groupRules: groupsData[id]["rules"],
    updateGroupRules,
    removeGroupRule,
    id: key
  }, key));
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsxs(Paper, {
    "data-test": testAttr,
    withBorder: true,
    mt: 24,
    p: 16,
    sx: {
      position: "relative"
    },
    children: [/* @__PURE__ */ jsx(Box, {
      pl: 4,
      pr: 4,
      sx: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "white",
        display: "inline-block",
        fontSize: "2rem",
        position: "absolute",
        top: "-30px",
        left: "5%"
      },
      children: /* @__PURE__ */ jsxs(Chip.Group, {
        multiple: false,
        value: groupsData[id]["operator"],
        onChange: updateGroupOperator,
        spacing: 6,
        children: [/* @__PURE__ */ jsx(Chip, {
          "data-test": "filter-group-operator-and",
          size: "sm",
          checked: groupsData[id]["operator"] === "and",
          value: "$and",
          children: "And"
        }), /* @__PURE__ */ jsx(Chip, {
          "data-test": "filter-group-operator-or",
          size: "sm",
          ml: 0,
          checked: groupsData[id]["operator"] === "or",
          value: "$or",
          children: "Or"
        })]
      })
    }), id !== "mainGroup" && /* @__PURE__ */ jsx(Group, {
      sx: {
        width: "100%"
      },
      position: "right",
      mb: 16,
      children: /* @__PURE__ */ jsx(ActionIcon, {
        size: 16,
        onClick: () => removeGroupsData(id),
        title: "Remove this group",
        children: /* @__PURE__ */ jsx(lAe, {
          stroke: 1
        })
      })
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      spacing: 8,
      mt: 2,
      sx: {
        width: "100%"
      },
      children: [/* @__PURE__ */ jsx(Button, {
        "data-test": "table-filter-add-rule-button",
        title: "Add filter rule",
        compact: true,
        onClick: () => updateGroupRules(uuid(), {}),
        variant: "light",
        leftIcon: /* @__PURE__ */ jsx(Nme, {
          size: 16
        }),
        styles: {
          leftIcon: {
            marginRight: 4
          }
        },
        children: "Rule"
      }), id === "mainGroup" && /* @__PURE__ */ jsx(Button, {
        size: "sm",
        "data-test": "table-filter-add-group-button",
        compact: true,
        onClick: () => updateGroupsData(uuid(), initGroupObject),
        title: "Add another group",
        variant: "light",
        leftIcon: /* @__PURE__ */ jsx(Nme, {
          size: 16
        }),
        styles: {
          leftIcon: {
            marginRight: 4
          }
        },
        children: "Group"
      })]
    }), rules, /* @__PURE__ */ jsx(Group, {
      mt: 24,
      children
    })]
  });
}
export {
  uuid as $,
  Affix as A,
  Burger as B,
  CopyButton as C,
  Divider as D,
  encodeQueryParams as E,
  FocusTrap as F,
  GenericService as G,
  Header as H,
  Image as I,
  JsonParam as J,
  Kbd as K,
  List as L,
  Modal as M,
  Navbar as N,
  Card as O,
  Popover as P,
  Collapse as Q,
  RingProgress as R,
  StringParam as S,
  ThemeIcon as T,
  UserMenu as U,
  SegmentedControl as V,
  Table as W,
  useInputState as X,
  RelativeDrawer as Y,
  LogicalGroup as Z,
  _inheritsLoose as _,
  useDisclosure as a,
  useNavProgressFetchEffect as a0,
  AppShell as a1,
  ReactQueryDevtools as a2,
  useColorScheme as a3,
  navigationData as a4,
  SpotlightProvider as a5,
  NotificationsProvider as a6,
  NavigationProgress as a7,
  ModalsProvider as a8,
  QueryParamProvider as a9,
  CardSection as aA,
  Highlight as aB,
  Mark as aC,
  Menu as aD,
  Notification as aE,
  Select as aF,
  ChevronIcon as aG,
  Switch as aH,
  Global as aI,
  AppContext as aJ,
  ReactRouter6Adapter as aa,
  clamp as ab,
  createSafeContext as ac,
  useContextStylesApi as ad,
  createScopedKeydownHandler as ae,
  StylesApiProvider as af,
  CloseButton as ag,
  HorizontalSection as ah,
  Section as ai,
  VerticalSection as aj,
  DefaultItem as ak,
  groupOptions as al,
  SelectPopover as am,
  SelectScrollArea as an,
  SelectItems as ao,
  useFocusTrap as ap,
  useScrollLock as aq,
  useFocusReturn as ar,
  GroupedTransition as as,
  createEventHandler as at,
  useDelayedHover as au,
  _objectWithoutPropertiesLoose as av,
  useScrollIntoView as aw,
  getSelectRightSectionProps as ax,
  useElementSize as ay,
  Avatar as az,
  useClickOutside as b,
  escapeRegExp as c,
  ScrollArea as d,
  errorMsg as e,
  Chip as f,
  HeaderLogo as g,
  SafeSelect as h,
  useOs as i,
  Breadcrumbs as j,
  useMutation as k,
  links as l,
  Skeleton as m,
  useInView as n,
  openSpotlight as o,
  getNavigationItem as p,
  stopNavigationProgress as q,
  resetNavigationProgress as r,
  successMsg as s,
  useToggle as t,
  useQueryParams as u,
  useInfinityScroll as v,
  Badge as w,
  ActionPopoverIcon as x,
  UserHooks as y,
  getStatusMessage as z
};
