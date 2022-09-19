import { r as react, b as jsx, d as useMantineTheme, K as Global$1, O as css, R as transitions$1, S as useDidUpdate, U as useUncontrolled, V as useReducedMotion, W as useWindowEvent, Y as useId, c as createStyles, B as Box, j as jsxs, Z as UnstyledButton, _ as mergeRefs, $ as reactDom, a0 as useComponentDefaultProps, a1 as extractSystemStyles, a2 as getDefaultZIndex, a3 as OptionalPortal, a4 as packSx, v as ActionIcon, a5 as createPolymorphicComponent, T as Text, a6 as Fragment, a7 as _extends, a8 as React, a9 as useFloating, aa as size, ab as useFloatingAutoUpdate, ac as offset, ad as shift, ae as flip, af as isElement, ag as useMergedRef, ah as clsx, ai as Transition$2, aj as FloatingArrow, ak as getFloatingPosition, al as useInputProps, am as Input, P as Paper, G as Group, an as CheckIcon, ao as useTransition, ap as getTransitionStyles, aq as Overlay, ar as assignRef, as as MANTINE_SIZES, at as useDisclosure, au as sizes$j, av as Loader, s as TextInput, aw as InputsGroup, ax as Tooltip, ay as useIsomorphicEffect$3, az as keyframes, A as Anchor, aA as CheckboxIcon, aB as GROUP_POSITIONS, t as Checkbox, i as Button, C as Center, e as Container, L as LoadingOverlay, q as PasswordInput, aC as Portal, m as Progress, aD as Stack, h as Title, aE as DEFAULT_THEME, aF as MANTINE_COLORS, M as MantineProvider, H as ColorSchemeProvider, aG as useMantineColorScheme, aH as GlobalStyles, aI as NormalizeCSS, aJ as useCss, aK as useEmotionCache, aL as defaultMantineEmotionCache, aM as createCache, aN as queryString, aO as ReactDOM, l as log, E as useHotkeys, y as useLocalStorage, D as Dme, w as l6, k as ky, a as config$1, u as useQuery, aP as EO, aQ as Xue, aR as age, aS as A0, aT as q0, aU as GY, N as Nb, aV as EH, aW as ka, aX as ZX, aY as Lce, aZ as Bpe, a_ as q2, a$ as Aae, b0 as useLocation, b1 as Link, b2 as sge, b3 as $i, p as useForm, b4 as useParams, n as aze, b5 as useMutation, b6 as _ae, b7 as gI, b8 as Xne, b9 as useInfiniteQuery, ba as hl, bb as Ti, bc as zK, bd as Uhe, be as Ahe, bf as commonjsGlobal, bg as D3, bh as Boe, o as useSearchParams, bi as J, bj as sJ, bk as Routes, bl as Route, Q as QueryClient, f as useDocumentTitle, bm as useNavigate, F as QueryClientProvider, I as createRoot, J as BrowserRouter } from "./use-form.b25372da.js";
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
function getSafeId(uid, errorMessage) {
  return (value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(errorMessage);
    }
    return `${uid}-${value}`;
  };
}
const noop$3 = () => {
};
function closeOnEscape(callback, options = { active: true }) {
  if (typeof callback !== "function" || !options.active) {
    return noop$3;
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
function keys(object) {
  return Object.keys(object);
}
function useHovered() {
  const [hovered, setHovered] = react.exports.useState(-1);
  const resetHovered = () => setHovered(-1);
  return [hovered, { setHovered, resetHovered }];
}
function groupOptions$1({ data }) {
  const sortedData = [];
  const unGroupedData = [];
  const groupedData = data.reduce((acc, item, index2) => {
    if (item.group) {
      if (acc[item.group])
        acc[item.group].push(index2);
      else
        acc[item.group] = [index2];
    } else {
      unGroupedData.push(index2);
    }
    return acc;
  }, {});
  Object.keys(groupedData).forEach((groupName) => {
    sortedData.push(...groupedData[groupName].map((index2) => data[index2]));
  });
  sortedData.push(...unGroupedData.map((itemIndex) => data[itemIndex]));
  return sortedData;
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
const AVAILABLE_TRANSITIONS = Object.keys(transitions$1);
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
const clampUseMovePosition = (position) => ({
  x: clamp(position.x, 0, 1),
  y: clamp(position.y, 0, 1)
});
function useMove(onChange, handlers, dir = "ltr") {
  const ref = react.exports.useRef();
  const mounted = react.exports.useRef(false);
  const isSliding = react.exports.useRef(false);
  const frame = react.exports.useRef(0);
  const [active, setActive] = react.exports.useState(false);
  react.exports.useEffect(() => {
    mounted.current = true;
  }, []);
  react.exports.useEffect(() => {
    const onScrub = ({ x, y }) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        if (mounted.current && ref.current) {
          ref.current.style.userSelect = "none";
          const rect = ref.current.getBoundingClientRect();
          if (rect.width && rect.height) {
            const _x = clamp((x - rect.left) / rect.width, 0, 1);
            onChange({
              x: dir === "ltr" ? _x : 1 - _x,
              y: clamp((y - rect.top) / rect.height, 0, 1)
            });
          }
        }
      });
    };
    const bindEvents = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopScrubbing);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", stopScrubbing);
    };
    const unbindEvents = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopScrubbing);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopScrubbing);
    };
    const startScrubbing = () => {
      if (!isSliding.current && mounted.current) {
        isSliding.current = true;
        typeof (handlers == null ? void 0 : handlers.onScrubStart) === "function" && handlers.onScrubStart();
        setActive(true);
        bindEvents();
      }
    };
    const stopScrubbing = () => {
      if (isSliding.current && mounted.current) {
        isSliding.current = false;
        setActive(false);
        unbindEvents();
        setTimeout(() => {
          typeof (handlers == null ? void 0 : handlers.onScrubEnd) === "function" && handlers.onScrubEnd();
        }, 0);
      }
    };
    const onMouseDown = (event) => {
      startScrubbing();
      onMouseMove(event);
    };
    const onMouseMove = (event) => onScrub({ x: event.clientX, y: event.clientY });
    const onTouchStart = (event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
      startScrubbing();
      onTouchMove(event);
    };
    const onTouchMove = (event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
      onScrub({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
    };
    ref.current.addEventListener("mousedown", onMouseDown);
    ref.current.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousedown", onMouseDown);
        ref.current.removeEventListener("touchstart", onTouchStart);
      }
    };
  }, [dir, onChange]);
  return { ref, active };
}
function range(start, end) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index2) => index2 + start);
}
const DOTS = "dots";
function usePagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage = 1,
  onChange
}) {
  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange,
    defaultValue: initialPage,
    finalValue: initialPage
  });
  const setPage = (pageNumber) => {
    if (pageNumber <= 0) {
      setActivePage(1);
    } else if (pageNumber > total) {
      setActivePage(total);
    } else {
      setActivePage(pageNumber);
    }
  };
  const next = () => setPage(activePage + 1);
  const previous = () => setPage(activePage - 1);
  const first = () => setPage(1);
  const last = () => setPage(total);
  const paginationRange = react.exports.useMemo(() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
    if (totalPageNumbers >= total) {
      return range(1, total);
    }
    const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
    const rightSiblingIndex = Math.min(activePage + siblings, total - boundaries);
    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
    const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1);
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2;
      return [...range(1, leftItemCount), DOTS, ...range(total - (boundaries - 1), total)];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings;
      return [...range(1, boundaries), DOTS, ...range(total - rightItemCount, total)];
    }
    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(total - boundaries + 1, total)
    ];
  }, [total, siblings, activePage]);
  return {
    range: paginationRange,
    active: activePage,
    setPage,
    next,
    previous,
    first,
    last
  };
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
const browser = typeof window !== "undefined";
function useResizeObserver() {
  const frameID = react.exports.useRef(0);
  const ref = react.exports.useRef(null);
  const [rect, setRect] = react.exports.useState(defaultState);
  const observer = react.exports.useMemo(() => browser ? new ResizeObserver((entries) => {
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
function randomId() {
  return `mantine-${Math.random().toString(36).slice(2, 11)}`;
}
function upperFirst(value) {
  return typeof value !== "string" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
}
const ACCORDION_ERRORS = {
  context: "Accordion component was not found in the tree",
  itemContext: "Accordion.Item component was not found in the tree",
  value: "Accordion.Item component was rendered with invalid value or without value"
};
const [AccordionContextProvider, useAccordionContext] = createSafeContext(ACCORDION_ERRORS.context);
function AccordionProvider({
  children,
  multiple,
  value,
  defaultValue,
  onChange,
  id,
  loop,
  transitionDuration,
  disableChevronRotation,
  chevronPosition,
  chevronSize,
  order,
  chevron,
  variant,
  radius
}) {
  const uid = useId(id);
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: multiple ? [] : null,
    onChange
  });
  const isItemActive = (itemValue) => Array.isArray(_value) ? _value.includes(itemValue) : itemValue === _value;
  const handleItemChange = (itemValue) => {
    const nextValue = Array.isArray(_value) ? _value.includes(itemValue) ? _value.filter((selectedValue) => selectedValue !== itemValue) : [..._value, itemValue] : itemValue === _value ? null : itemValue;
    handleChange(nextValue);
  };
  return /* @__PURE__ */ jsx(AccordionContextProvider, {
    value: {
      isItemActive,
      onChange: handleItemChange,
      getControlId: getSafeId(`${uid}-control`, ACCORDION_ERRORS.value),
      getRegionId: getSafeId(`${uid}-panel`, ACCORDION_ERRORS.value),
      transitionDuration,
      disableChevronRotation,
      chevronPosition,
      chevronSize,
      order,
      chevron,
      loop,
      variant,
      radius
    },
    children
  });
}
const [AccordionItemContextProvider, useAccordionItemContext] = createSafeContext(ACCORDION_ERRORS.itemContext);
function getVariantStyles$5(theme, { variant, radius }) {
  const borderColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  const filledColor = theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0];
  const borderRadius = theme.fn.radius(radius);
  if (variant === "default") {
    return {
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      borderBottom: `1px solid ${borderColor}`
    };
  }
  if (variant === "contained") {
    return {
      border: `1px solid ${borderColor}`,
      transition: "background-color 150ms ease",
      "&[data-active]": {
        backgroundColor: filledColor
      },
      "&:first-of-type": {
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
        "& > [data-accordion-control]": {
          borderTopRightRadius: borderRadius,
          borderTopLeftRadius: borderRadius
        }
      },
      "&:last-of-type": {
        borderBottomRightRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        "& > [data-accordion-control]": {
          borderBottomRightRadius: borderRadius,
          borderBottomLeftRadius: borderRadius
        }
      },
      "& + &": {
        borderTop: 0
      }
    };
  }
  if (variant === "filled") {
    return {
      borderRadius,
      "&[data-active]": {
        backgroundColor: filledColor
      }
    };
  }
  if (variant === "separated") {
    return {
      borderRadius,
      backgroundColor: filledColor,
      border: "1px solid transparent",
      transition: "background-color 150ms ease",
      "& + &": {
        marginTop: theme.spacing.md
      },
      "&[data-active]": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        borderColor
      }
    };
  }
  return {};
}
var useStyles$2M = createStyles((theme, params) => ({
  item: getVariantStyles$5(theme, params)
}));
const useStyles$2N = useStyles$2M;
var __defProp$34 = Object.defineProperty;
var __getOwnPropSymbols$35 = Object.getOwnPropertySymbols;
var __hasOwnProp$35 = Object.prototype.hasOwnProperty;
var __propIsEnum$35 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$34 = (obj, key, value) => key in obj ? __defProp$34(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$34 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$35.call(b, prop))
      __defNormalProp$34(a, prop, b[prop]);
  if (__getOwnPropSymbols$35)
    for (var prop of __getOwnPropSymbols$35(b)) {
      if (__propIsEnum$35.call(b, prop))
        __defNormalProp$34(a, prop, b[prop]);
    }
  return a;
};
var __objRest$20 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$35.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$35)
    for (var prop of __getOwnPropSymbols$35(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$35.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AccordionItem = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    value
  } = _b, others = __objRest$20(_b, ["children", "className", "value"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const ctx = useAccordionContext();
  const {
    classes,
    cx
  } = useStyles$2N({
    variant: ctx.variant,
    radius: ctx.radius
  }, {
    name: "Accordion",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(AccordionItemContextProvider, {
    value: {
      value
    },
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$34({
        ref,
        className: cx(classes.item, className),
        "data-active": ctx.isItemActive(value) || void 0
      }, others),
      children
    })
  });
});
AccordionItem.displayName = "@mantine/core/AccordionItem";
var __defProp$33 = Object.defineProperty;
var __defProps$1s = Object.defineProperties;
var __getOwnPropDescs$1s = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$34 = Object.getOwnPropertySymbols;
var __hasOwnProp$34 = Object.prototype.hasOwnProperty;
var __propIsEnum$34 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$33 = (obj, key, value) => key in obj ? __defProp$33(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$33 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$34.call(b, prop))
      __defNormalProp$33(a, prop, b[prop]);
  if (__getOwnPropSymbols$34)
    for (var prop of __getOwnPropSymbols$34(b)) {
      if (__propIsEnum$34.call(b, prop))
        __defNormalProp$33(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1s = (a, b) => __defProps$1s(a, __getOwnPropDescs$1s(b));
var __objRest$1$ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$34.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$34)
    for (var prop of __getOwnPropSymbols$34(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$34.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function getVariantStyles$4(theme, { variant }) {
  if (variant === "default" || variant === "contained") {
    return theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    });
  }
  return {};
}
var useStyles$2K = createStyles((theme, _a) => {
  var _b = _a, { transitionDuration, chevronPosition, chevronSize } = _b, params = __objRest$1$(_b, ["transitionDuration", "chevronPosition", "chevronSize"]);
  return {
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: chevronPosition === "left" ? 0 : theme.spacing.sm,
      marginLeft: chevronPosition === "left" ? theme.spacing.lg : 0
    },
    chevron: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: `transform ${transitionDuration}ms ease`,
      marginRight: chevronPosition === "right" ? 0 : theme.spacing.sm,
      marginLeft: chevronPosition === "right" ? theme.spacing.lg : 0,
      width: chevronSize,
      minWidth: chevronSize,
      "&[data-rotate]": {
        transform: "rotate(180deg)"
      }
    },
    label: {
      color: "inherit",
      fontWeight: 400,
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    itemTitle: {
      margin: 0,
      padding: 0
    },
    control: __spreadProps$1s(__spreadValues$33(__spreadValues$33(__spreadValues$33({}, theme.fn.focusStyles()), theme.fn.fontStyles()), getVariantStyles$4(theme, params)), {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: chevronPosition === "right" ? "row-reverse" : "row",
      padding: `${theme.spacing.md}px ${theme.spacing.md / 2}px`,
      paddingLeft: chevronPosition === "right" ? theme.spacing.sm + 4 : null,
      textAlign: "left",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      "&:disabled": __spreadValues$33({
        opacity: 0.4,
        cursor: "not-allowed"
      }, theme.fn.hover({ backgroundColor: "transparent" }))
    })
  };
});
const useStyles$2L = useStyles$2K;
var __defProp$32 = Object.defineProperty;
var __defProps$1r = Object.defineProperties;
var __getOwnPropDescs$1r = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$33 = Object.getOwnPropertySymbols;
var __hasOwnProp$33 = Object.prototype.hasOwnProperty;
var __propIsEnum$33 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$32 = (obj, key, value) => key in obj ? __defProp$32(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$32 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$33.call(b, prop))
      __defNormalProp$32(a, prop, b[prop]);
  if (__getOwnPropSymbols$33)
    for (var prop of __getOwnPropSymbols$33(b)) {
      if (__propIsEnum$33.call(b, prop))
        __defNormalProp$32(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1r = (a, b) => __defProps$1r(a, __getOwnPropDescs$1r(b));
var __objRest$1_ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$33.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$33)
    for (var prop of __getOwnPropSymbols$33(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$33.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AccordionControl = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    disabled,
    onKeyDown,
    onClick,
    chevron,
    children,
    className,
    icon
  } = _b, others = __objRest$1_(_b, ["disabled", "onKeyDown", "onClick", "chevron", "children", "className", "icon"]);
  const ctx = useAccordionContext();
  const {
    value
  } = useAccordionItemContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$2L({
    transitionDuration: ctx.transitionDuration,
    chevronPosition: ctx.chevronPosition,
    chevronSize: ctx.chevronSize,
    variant: ctx.variant,
    radius: ctx.radius
  }, {
    name: "Accordion",
    classNames,
    styles,
    unstyled
  });
  const isActive = ctx.isItemActive(value);
  const shouldWrapWithHeading = typeof ctx.order === "number";
  const Heading = `h${ctx.order}`;
  const content = /* @__PURE__ */ jsxs(UnstyledButton, {
    ...__spreadProps$1r(__spreadValues$32({}, others), {
      ref,
      "data-accordion-control": true,
      disabled,
      className: cx(classes.control, className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        ctx.onChange(value);
      },
      type: "button",
      "data-active": isActive || void 0,
      "aria-expanded": isActive,
      "aria-controls": ctx.getRegionId(value),
      id: ctx.getControlId(value),
      unstyled,
      onKeyDown: createScopedKeydownHandler({
        siblingSelector: "[data-accordion-control]",
        parentSelector: "[data-accordion]",
        activateOnFocus: false,
        loop: ctx.loop,
        orientation: "vertical",
        onKeyDown
      })
    }),
    children: [/* @__PURE__ */ jsx("div", {
      className: classes.chevron,
      "data-rotate": !ctx.disableChevronRotation && isActive || void 0,
      children: chevron || ctx.chevron
    }), /* @__PURE__ */ jsx("div", {
      className: classes.label,
      children
    }), icon && /* @__PURE__ */ jsx("div", {
      className: classes.icon,
      children: icon
    })]
  });
  return shouldWrapWithHeading ? /* @__PURE__ */ jsx(Heading, {
    className: classes.itemTitle,
    children: content
  }) : content;
});
AccordionControl.displayName = "@mantine/core/AccordionControl";
var __defProp$31 = Object.defineProperty;
var __defProps$1q = Object.defineProperties;
var __getOwnPropDescs$1q = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$32 = Object.getOwnPropertySymbols;
var __hasOwnProp$32 = Object.prototype.hasOwnProperty;
var __propIsEnum$32 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$31 = (obj, key, value) => key in obj ? __defProp$31(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$31 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$32.call(b, prop))
      __defNormalProp$31(a, prop, b[prop]);
  if (__getOwnPropSymbols$32)
    for (var prop of __getOwnPropSymbols$32(b)) {
      if (__propIsEnum$32.call(b, prop))
        __defNormalProp$31(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1q = (a, b) => __defProps$1q(a, __getOwnPropDescs$1q(b));
var useStyles$2I = createStyles((theme, _params) => ({
  panel: __spreadProps$1q(__spreadValues$31({}, theme.fn.fontStyles()), {
    wordBreak: "break-word",
    lineHeight: theme.lineHeight
  }),
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs / 2
  }
}));
const useStyles$2J = useStyles$2I;
var __defProp$30 = Object.defineProperty;
var __defProps$1p = Object.defineProperties;
var __getOwnPropDescs$1p = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$31 = Object.getOwnPropertySymbols;
var __hasOwnProp$31 = Object.prototype.hasOwnProperty;
var __propIsEnum$31 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$30 = (obj, key, value) => key in obj ? __defProp$30(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$30 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$31.call(b, prop))
      __defNormalProp$30(a, prop, b[prop]);
  if (__getOwnPropSymbols$31)
    for (var prop of __getOwnPropSymbols$31(b)) {
      if (__propIsEnum$31.call(b, prop))
        __defNormalProp$30(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1p = (a, b) => __defProps$1p(a, __getOwnPropDescs$1p(b));
var __objRest$1Z = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$31.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$31)
    for (var prop of __getOwnPropSymbols$31(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$31.call(source, prop))
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
    setStyles((oldStyles) => __spreadValues$30(__spreadValues$30({}, oldStyles), newStyles));
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
          mergeStyles(__spreadProps$1p(__spreadValues$30({}, getTransitionStyles2(height)), { height }));
        });
      });
    } else {
      raf(() => {
        const height = getElementHeight(el);
        mergeStyles(__spreadProps$1p(__spreadValues$30({}, getTransitionStyles2(height)), { willChange: "height", height }));
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
    var _b = _a, { style = {}, refKey = "ref" } = _b, rest = __objRest$1Z(_b, ["style", "refKey"]);
    const theirRef = rest[refKey];
    return __spreadProps$1p(__spreadValues$30({
      "aria-hidden": !opened
    }, rest), {
      [refKey]: mergeRefs(el, theirRef),
      onTransitionEnd: handleTransitionEnd,
      style: __spreadValues$30(__spreadValues$30({ boxSizing: "border-box" }, style), styles)
    });
  }
  return getCollapseProps;
}
var __defProp$2$ = Object.defineProperty;
var __getOwnPropSymbols$30 = Object.getOwnPropertySymbols;
var __hasOwnProp$30 = Object.prototype.hasOwnProperty;
var __propIsEnum$30 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2$ = (obj, key, value) => key in obj ? __defProp$2$(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2$ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$30.call(b, prop))
      __defNormalProp$2$(a, prop, b[prop]);
  if (__getOwnPropSymbols$30)
    for (var prop of __getOwnPropSymbols$30(b)) {
      if (__propIsEnum$30.call(b, prop))
        __defNormalProp$2$(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1Y = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$30.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$30)
    for (var prop of __getOwnPropSymbols$30(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$30.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$1b = {
  transitionDuration: 200,
  transitionTimingFunction: "ease",
  animateOpacity: true
};
const Collapse = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Collapse", defaultProps$1b, props), {
    children,
    in: opened,
    transitionDuration,
    transitionTimingFunction,
    style,
    onTransitionEnd,
    animateOpacity
  } = _a, others = __objRest$1Y(_a, ["children", "in", "transitionDuration", "transitionTimingFunction", "style", "onTransitionEnd", "animateOpacity"]);
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
      ...__spreadValues$2$({}, rest),
      children
    }) : null;
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2$({}, getCollapseProps(__spreadValues$2$(__spreadValues$2$({
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
var __defProp$2_ = Object.defineProperty;
var __defProps$1o = Object.defineProperties;
var __getOwnPropDescs$1o = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2$ = Object.getOwnPropertySymbols;
var __hasOwnProp$2$ = Object.prototype.hasOwnProperty;
var __propIsEnum$2$ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2_ = (obj, key, value) => key in obj ? __defProp$2_(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2_ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2$.call(b, prop))
      __defNormalProp$2_(a, prop, b[prop]);
  if (__getOwnPropSymbols$2$)
    for (var prop of __getOwnPropSymbols$2$(b)) {
      if (__propIsEnum$2$.call(b, prop))
        __defNormalProp$2_(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1o = (a, b) => __defProps$1o(a, __getOwnPropDescs$1o(b));
var __objRest$1X = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2$.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2$)
    for (var prop of __getOwnPropSymbols$2$(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2$.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function AccordionPanel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$1X(_b, ["children", "className"]);
  const ctx = useAccordionContext();
  const {
    value
  } = useAccordionItemContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$2J({
    variant: ctx.variant,
    radius: ctx.radius
  }, {
    name: "Accordion",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Collapse, {
    ...__spreadProps$1o(__spreadValues$2_({}, others), {
      className: cx(classes.panel, className),
      in: ctx.isItemActive(value),
      transitionDuration: ctx.transitionDuration,
      role: "region",
      id: ctx.getRegionId(value),
      "aria-labelledby": ctx.getControlId(value)
    }),
    children: /* @__PURE__ */ jsx("div", {
      className: classes.content,
      children
    })
  });
}
AccordionPanel.displayName = "@mantine/core/AccordionPanel";
var __defProp$2Z = Object.defineProperty;
var __getOwnPropSymbols$2_ = Object.getOwnPropertySymbols;
var __hasOwnProp$2_ = Object.prototype.hasOwnProperty;
var __propIsEnum$2_ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2Z = (obj, key, value) => key in obj ? __defProp$2Z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2Z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2_.call(b, prop))
      __defNormalProp$2Z(a, prop, b[prop]);
  if (__getOwnPropSymbols$2_)
    for (var prop of __getOwnPropSymbols$2_(b)) {
      if (__propIsEnum$2_.call(b, prop))
        __defNormalProp$2Z(a, prop, b[prop]);
    }
  return a;
};
function ChevronIcon$1(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$2Z({
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
var __defProp$2Y = Object.defineProperty;
var __defProps$1n = Object.defineProperties;
var __getOwnPropDescs$1n = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2Z = Object.getOwnPropertySymbols;
var __hasOwnProp$2Z = Object.prototype.hasOwnProperty;
var __propIsEnum$2Z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2Y = (obj, key, value) => key in obj ? __defProp$2Y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2Y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2Z.call(b, prop))
      __defNormalProp$2Y(a, prop, b[prop]);
  if (__getOwnPropSymbols$2Z)
    for (var prop of __getOwnPropSymbols$2Z(b)) {
      if (__propIsEnum$2Z.call(b, prop))
        __defNormalProp$2Y(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1n = (a, b) => __defProps$1n(a, __getOwnPropDescs$1n(b));
var __objRest$1W = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2Z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2Z)
    for (var prop of __getOwnPropSymbols$2Z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2Z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$1a = {
  multiple: false,
  disableChevronRotation: false,
  transitionDuration: 200,
  chevronPosition: "right",
  variant: "default",
  chevronSize: 24,
  chevron: /* @__PURE__ */ jsx(ChevronIcon$1, {})
};
function Accordion(props) {
  const _a = useComponentDefaultProps("Accordion", defaultProps$1a, props), {
    id,
    loop,
    children,
    multiple,
    value,
    defaultValue,
    onChange,
    transitionDuration,
    disableChevronRotation,
    chevronPosition,
    chevronSize,
    order,
    chevron,
    classNames,
    styles,
    unstyled,
    variant,
    radius
  } = _a, others = __objRest$1W(_a, ["id", "loop", "children", "multiple", "value", "defaultValue", "onChange", "transitionDuration", "disableChevronRotation", "chevronPosition", "chevronSize", "order", "chevron", "classNames", "styles", "unstyled", "variant", "radius"]);
  return /* @__PURE__ */ jsx(AccordionProvider, {
    id,
    multiple,
    value,
    defaultValue,
    onChange,
    loop,
    transitionDuration,
    disableChevronRotation,
    chevronPosition,
    chevronSize,
    order,
    chevron,
    variant,
    radius,
    children: /* @__PURE__ */ jsx(StylesApiProvider, {
      classNames,
      styles,
      unstyled,
      children: /* @__PURE__ */ jsx(Box, {
        ...__spreadProps$1n(__spreadValues$2Y({}, others), {
          "data-accordion": true
        }),
        children
      })
    })
  });
}
Accordion.Item = AccordionItem;
Accordion.Control = AccordionControl;
Accordion.Panel = AccordionPanel;
Accordion.displayName = "@mantine/core/Accordion";
var __defProp$2X = Object.defineProperty;
var __getOwnPropSymbols$2Y = Object.getOwnPropertySymbols;
var __hasOwnProp$2Y = Object.prototype.hasOwnProperty;
var __propIsEnum$2Y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2X = (obj, key, value) => key in obj ? __defProp$2X(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2X = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2Y.call(b, prop))
      __defNormalProp$2X(a, prop, b[prop]);
  if (__getOwnPropSymbols$2Y)
    for (var prop of __getOwnPropSymbols$2Y(b)) {
      if (__propIsEnum$2Y.call(b, prop))
        __defNormalProp$2X(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1V = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2Y.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2Y)
    for (var prop of __getOwnPropSymbols$2Y(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2Y.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$19 = {
  position: {
    bottom: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("modal"),
  withinPortal: true
};
const Affix = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Affix", defaultProps$19, props), {
    target,
    position,
    zIndex,
    sx,
    withinPortal
  } = _a, others = __objRest$1V(_a, ["target", "position", "zIndex", "sx", "withinPortal"]);
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    target,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$2X({
        sx: [__spreadValues$2X({
          position: "fixed",
          zIndex
        }, position), ...packSx(sx)],
        ref
      }, others)
    })
  });
});
Affix.displayName = "@mantine/core/Affix";
var __defProp$2W = Object.defineProperty;
var __defProps$1m = Object.defineProperties;
var __getOwnPropDescs$1m = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2X = Object.getOwnPropertySymbols;
var __hasOwnProp$2X = Object.prototype.hasOwnProperty;
var __propIsEnum$2X = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2W = (obj, key, value) => key in obj ? __defProp$2W(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2W = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2X.call(b, prop))
      __defNormalProp$2W(a, prop, b[prop]);
  if (__getOwnPropSymbols$2X)
    for (var prop of __getOwnPropSymbols$2X(b)) {
      if (__propIsEnum$2X.call(b, prop))
        __defNormalProp$2W(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1m = (a, b) => __defProps$1m(a, __getOwnPropDescs$1m(b));
function getVariantStyles$3({ variant, color, theme }) {
  if (variant === "filled") {
    const colors2 = theme.fn.variant({ variant: "filled", color });
    return {
      backgroundColor: colors2.background,
      color: theme.white
    };
  }
  if (variant === "outline") {
    const colors2 = theme.fn.variant({ variant: "outline", color });
    return {
      color: colors2.color,
      borderColor: colors2.border,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
    };
  }
  const colors = theme.fn.variant({ variant: "light", color });
  return {
    backgroundColor: colors.background,
    color: colors.color
  };
}
var useStyles$2G = createStyles((theme, { color, radius, variant }) => ({
  root: __spreadValues$2W(__spreadProps$1m(__spreadValues$2W({}, theme.fn.fontStyles()), {
    position: "relative",
    overflow: "hidden",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.fn.radius(radius),
    border: "1px solid transparent"
  }), getVariantStyles$3({ variant, color, theme })),
  wrapper: {
    display: "flex"
  },
  body: {
    flex: 1
  },
  title: {
    boxSizing: "border-box",
    margin: 0,
    marginBottom: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    lineHeight: theme.lineHeight,
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    "&[data-with-close-button]": {
      paddingRight: theme.spacing.md
    }
  },
  label: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  icon: {
    lineHeight: 1,
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: theme.spacing.md,
    marginTop: 1
  },
  message: __spreadProps$1m(__spreadValues$2W({}, theme.fn.fontStyles()), {
    lineHeight: theme.lineHeight,
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontSize: theme.fontSizes.sm,
    color: variant === "filled" ? theme.white : theme.colorScheme === "dark" ? variant === "light" ? theme.white : theme.colors.dark[0] : theme.black
  }),
  closeButton: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    color: "inherit"
  }
}));
const useStyles$2H = useStyles$2G;
var __defProp$2V = Object.defineProperty;
var __getOwnPropSymbols$2W = Object.getOwnPropertySymbols;
var __hasOwnProp$2W = Object.prototype.hasOwnProperty;
var __propIsEnum$2W = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2V = (obj, key, value) => key in obj ? __defProp$2V(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2V = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2W.call(b, prop))
      __defNormalProp$2V(a, prop, b[prop]);
  if (__getOwnPropSymbols$2W)
    for (var prop of __getOwnPropSymbols$2W(b)) {
      if (__propIsEnum$2W.call(b, prop))
        __defNormalProp$2V(a, prop, b[prop]);
    }
  return a;
};
function CloseIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$2V({
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
var __defProp$2U = Object.defineProperty;
var __getOwnPropSymbols$2V = Object.getOwnPropertySymbols;
var __hasOwnProp$2V = Object.prototype.hasOwnProperty;
var __propIsEnum$2V = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2U = (obj, key, value) => key in obj ? __defProp$2U(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2U = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2V.call(b, prop))
      __defNormalProp$2U(a, prop, b[prop]);
  if (__getOwnPropSymbols$2V)
    for (var prop of __getOwnPropSymbols$2V(b)) {
      if (__propIsEnum$2V.call(b, prop))
        __defNormalProp$2U(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1U = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2V.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2V)
    for (var prop of __getOwnPropSymbols$2V(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2V.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const iconSizes$5 = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24
};
const defaultProps$18 = {
  size: "md"
};
const CloseButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("CloseButton", defaultProps$18, props), {
    iconSize,
    size: size2 = "md"
  } = _a, others = __objRest$1U(_a, ["iconSize", "size"]);
  const theme = useMantineTheme();
  const _iconSize = iconSize || theme.fn.size({
    size: size2,
    sizes: iconSizes$5
  });
  return /* @__PURE__ */ jsx(ActionIcon, {
    ...__spreadValues$2U({
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
var __defProp$2T = Object.defineProperty;
var __getOwnPropSymbols$2U = Object.getOwnPropertySymbols;
var __hasOwnProp$2U = Object.prototype.hasOwnProperty;
var __propIsEnum$2U = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2T = (obj, key, value) => key in obj ? __defProp$2T(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2T = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2U.call(b, prop))
      __defNormalProp$2T(a, prop, b[prop]);
  if (__getOwnPropSymbols$2U)
    for (var prop of __getOwnPropSymbols$2U(b)) {
      if (__propIsEnum$2U.call(b, prop))
        __defNormalProp$2T(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1T = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2U.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2U)
    for (var prop of __getOwnPropSymbols$2U(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2U.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$17 = {
  variant: "light"
};
const Alert = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Alert", defaultProps$17, props), {
    id,
    className,
    title,
    variant,
    children,
    color,
    classNames,
    icon,
    styles,
    onClose,
    radius,
    withCloseButton,
    closeButtonLabel,
    unstyled
  } = _a, others = __objRest$1T(_a, ["id", "className", "title", "variant", "children", "color", "classNames", "icon", "styles", "onClose", "radius", "withCloseButton", "closeButtonLabel", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2H({
    color,
    radius,
    variant
  }, {
    classNames,
    styles,
    unstyled,
    name: "Alert"
  });
  const rootId2 = useId(id);
  const titleId = title && `${rootId2}-title`;
  const bodyId = `${rootId2}-body`;
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2T({
      id: rootId2,
      role: "alert",
      "aria-labelledby": titleId,
      "aria-describedby": bodyId,
      className: cx(classes.root, classes[variant], className),
      ref
    }, others),
    children: /* @__PURE__ */ jsxs("div", {
      className: classes.wrapper,
      children: [icon && /* @__PURE__ */ jsx("div", {
        className: classes.icon,
        children: icon
      }), /* @__PURE__ */ jsxs("div", {
        className: classes.body,
        children: [title && /* @__PURE__ */ jsx("div", {
          className: classes.title,
          "data-with-close-button": withCloseButton || void 0,
          children: /* @__PURE__ */ jsx("span", {
            id: titleId,
            className: classes.label,
            children: title
          })
        }), withCloseButton && /* @__PURE__ */ jsx(CloseButton, {
          className: classes.closeButton,
          onClick: onClose,
          variant: "transparent",
          size: 16,
          iconSize: 16,
          "aria-label": closeButtonLabel
        }), /* @__PURE__ */ jsx("div", {
          id: bodyId,
          className: classes.message,
          children
        })]
      })]
    })
  });
});
Alert.displayName = "@mantine/core/Alert";
const AppShellContext = react.exports.createContext({});
const AppShellProvider = AppShellContext.Provider;
function useAppShellContext() {
  return react.exports.useContext(AppShellContext);
}
function getSortedBreakpoints$1(breakpoints, theme) {
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
var __defProp$2S = Object.defineProperty;
var __defProps$1l = Object.defineProperties;
var __getOwnPropDescs$1l = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2T = Object.getOwnPropertySymbols;
var __hasOwnProp$2T = Object.prototype.hasOwnProperty;
var __propIsEnum$2T = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2S = (obj, key, value) => key in obj ? __defProp$2S(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2S = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2T.call(b, prop))
      __defNormalProp$2S(a, prop, b[prop]);
  if (__getOwnPropSymbols$2T)
    for (var prop of __getOwnPropSymbols$2T(b)) {
      if (__propIsEnum$2T.call(b, prop))
        __defNormalProp$2S(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1l = (a, b) => __defProps$1l(a, __getOwnPropDescs$1l(b));
var useStyles$2E = createStyles((theme, {
  height,
  width,
  fixed,
  position,
  hiddenBreakpoint,
  zIndex,
  section,
  withBorder
}) => {
  const breakpoints = typeof width === "object" && width !== null ? getSortedBreakpoints$1(width, theme).reduce((acc, [breakpoint, breakpointSize]) => {
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
    root: __spreadProps$1l(__spreadValues$2S(__spreadValues$2S(__spreadProps$1l(__spreadValues$2S(__spreadValues$2S({}, theme.fn.fontStyles()), position), {
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
const useStyles$2F = useStyles$2E;
var __defProp$2R = Object.defineProperty;
var __getOwnPropSymbols$2S = Object.getOwnPropertySymbols;
var __hasOwnProp$2S = Object.prototype.hasOwnProperty;
var __propIsEnum$2S = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2R = (obj, key, value) => key in obj ? __defProp$2R(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2R = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2S.call(b, prop))
      __defNormalProp$2R(a, prop, b[prop]);
  if (__getOwnPropSymbols$2S)
    for (var prop of __getOwnPropSymbols$2S(b)) {
      if (__propIsEnum$2S.call(b, prop))
        __defNormalProp$2R(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1S = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2S.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2S)
    for (var prop of __getOwnPropSymbols$2S(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2S.call(source, prop))
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
  } = _b, others = __objRest$1S(_b, ["width", "height", "fixed", "position", "zIndex", "hiddenBreakpoint", "hidden", "withBorder", "className", "classNames", "styles", "children", "section", "__staticSelector", "unstyled"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx,
    theme
  } = useStyles$2F({
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
  const breakpoints = getSortedBreakpoints$1(width, theme).reduce((acc, [breakpoint, breakpointSize]) => {
    acc[`@media (min-width: ${breakpoint + 1}px)`] = {
      [`--mantine-${section}-width`]: `${breakpointSize}px`
    };
    return acc;
  }, {});
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$2R({
      component: section === "navbar" ? "nav" : "aside",
      ref,
      "data-hidden": hidden2 || void 0,
      className: cx(classes.root, className)
    }, others),
    children: [children, /* @__PURE__ */ jsx(Global, {
      styles: () => ({
        ":root": __spreadValues$2R({
          [`--mantine-${section}-width`]: (width == null ? void 0 : width.base) ? `${width.base}px` : "0px"
        }, breakpoints)
      })
    })]
  });
});
HorizontalSection.displayName = "@mantine/core/HorizontalSection";
var __defProp$2Q = Object.defineProperty;
var __getOwnPropSymbols$2R = Object.getOwnPropertySymbols;
var __hasOwnProp$2R = Object.prototype.hasOwnProperty;
var __propIsEnum$2R = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2Q = (obj, key, value) => key in obj ? __defProp$2Q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2Q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2R.call(b, prop))
      __defNormalProp$2Q(a, prop, b[prop]);
  if (__getOwnPropSymbols$2R)
    for (var prop of __getOwnPropSymbols$2R(b)) {
      if (__propIsEnum$2R.call(b, prop))
        __defNormalProp$2Q(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1R = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2R.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2R)
    for (var prop of __getOwnPropSymbols$2R(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2R.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const _Section = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    grow = false,
    sx
  } = _b, others = __objRest$1R(_b, ["children", "grow", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2Q({
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
var __defProp$2P = Object.defineProperty;
var __getOwnPropSymbols$2Q = Object.getOwnPropertySymbols;
var __hasOwnProp$2Q = Object.prototype.hasOwnProperty;
var __propIsEnum$2Q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2P = (obj, key, value) => key in obj ? __defProp$2P(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2P = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2Q.call(b, prop))
      __defNormalProp$2P(a, prop, b[prop]);
  if (__getOwnPropSymbols$2Q)
    for (var prop of __getOwnPropSymbols$2Q(b)) {
      if (__propIsEnum$2Q.call(b, prop))
        __defNormalProp$2P(a, prop, b[prop]);
    }
  return a;
};
const defaultProps$16 = {
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
  const _props = useComponentDefaultProps("Navbar", defaultProps$16, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$2P({
      section: "navbar",
      __staticSelector: "Navbar",
      ref
    }, _props)
  });
});
Navbar.Section = Section;
Navbar.displayName = "@mantine/core/Navbar";
var __defProp$2O = Object.defineProperty;
var __defProps$1k = Object.defineProperties;
var __getOwnPropDescs$1k = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2P = Object.getOwnPropertySymbols;
var __hasOwnProp$2P = Object.prototype.hasOwnProperty;
var __propIsEnum$2P = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2O = (obj, key, value) => key in obj ? __defProp$2O(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2O = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2P.call(b, prop))
      __defNormalProp$2O(a, prop, b[prop]);
  if (__getOwnPropSymbols$2P)
    for (var prop of __getOwnPropSymbols$2P(b)) {
      if (__propIsEnum$2P.call(b, prop))
        __defNormalProp$2O(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1k = (a, b) => __defProps$1k(a, __getOwnPropDescs$1k(b));
var useStyles$2C = createStyles((theme, { height, fixed, position, zIndex, borderPosition }) => ({
  root: __spreadProps$1k(__spreadValues$2O(__spreadValues$2O({}, theme.fn.fontStyles()), position), {
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
const useStyles$2D = useStyles$2C;
var __defProp$2N = Object.defineProperty;
var __getOwnPropSymbols$2O = Object.getOwnPropertySymbols;
var __hasOwnProp$2O = Object.prototype.hasOwnProperty;
var __propIsEnum$2O = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2N = (obj, key, value) => key in obj ? __defProp$2N(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2N = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2O.call(b, prop))
      __defNormalProp$2N(a, prop, b[prop]);
  if (__getOwnPropSymbols$2O)
    for (var prop of __getOwnPropSymbols$2O(b)) {
      if (__propIsEnum$2O.call(b, prop))
        __defNormalProp$2N(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1Q = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2O.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2O)
    for (var prop of __getOwnPropSymbols$2O(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2O.call(source, prop))
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
  } = _b, others = __objRest$1Q(_b, ["children", "className", "classNames", "styles", "height", "fixed", "withBorder", "position", "zIndex", "section", "unstyled", "__staticSelector"]);
  const ctx = useAppShellContext();
  const {
    classes,
    cx
  } = useStyles$2D({
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
    ...__spreadValues$2N({
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
var __defProp$2M = Object.defineProperty;
var __defProps$1j = Object.defineProperties;
var __getOwnPropDescs$1j = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2N = Object.getOwnPropertySymbols;
var __hasOwnProp$2N = Object.prototype.hasOwnProperty;
var __propIsEnum$2N = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2M = (obj, key, value) => key in obj ? __defProp$2M(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2M = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2N.call(b, prop))
      __defNormalProp$2M(a, prop, b[prop]);
  if (__getOwnPropSymbols$2N)
    for (var prop of __getOwnPropSymbols$2N(b)) {
      if (__propIsEnum$2N.call(b, prop))
        __defNormalProp$2M(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1j = (a, b) => __defProps$1j(a, __getOwnPropDescs$1j(b));
const defaultProps$15 = {
  fixed: false,
  position: {
    top: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Header = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Header", defaultProps$15, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$1j(__spreadValues$2M({
      section: "header",
      __staticSelector: "Header"
    }, _props), {
      ref
    })
  });
});
Header.displayName = "@mantine/core/Header";
var __defProp$2L = Object.defineProperty;
var __getOwnPropSymbols$2M = Object.getOwnPropertySymbols;
var __hasOwnProp$2M = Object.prototype.hasOwnProperty;
var __propIsEnum$2M = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2L = (obj, key, value) => key in obj ? __defProp$2L(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2L = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2M.call(b, prop))
      __defNormalProp$2L(a, prop, b[prop]);
  if (__getOwnPropSymbols$2M)
    for (var prop of __getOwnPropSymbols$2M(b)) {
      if (__propIsEnum$2M.call(b, prop))
        __defNormalProp$2L(a, prop, b[prop]);
    }
  return a;
};
const defaultProps$14 = {
  fixed: false,
  position: {
    top: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app"),
  hiddenBreakpoint: "md",
  hidden: false
};
const Aside = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Aside", defaultProps$14, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$2L({
      section: "aside",
      __staticSelector: "Aside",
      ref
    }, _props)
  });
});
Aside.Section = Section;
Aside.displayName = "@mantine/core/Aside";
var __defProp$2K = Object.defineProperty;
var __defProps$1i = Object.defineProperties;
var __getOwnPropDescs$1i = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2L = Object.getOwnPropertySymbols;
var __hasOwnProp$2L = Object.prototype.hasOwnProperty;
var __propIsEnum$2L = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2K = (obj, key, value) => key in obj ? __defProp$2K(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2K = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2L.call(b, prop))
      __defNormalProp$2K(a, prop, b[prop]);
  if (__getOwnPropSymbols$2L)
    for (var prop of __getOwnPropSymbols$2L(b)) {
      if (__propIsEnum$2L.call(b, prop))
        __defNormalProp$2K(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1i = (a, b) => __defProps$1i(a, __getOwnPropDescs$1i(b));
const defaultProps$13 = {
  fixed: false,
  position: {
    bottom: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Footer = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Footer", defaultProps$13, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$1i(__spreadValues$2K({
      section: "footer",
      __staticSelector: "Footer"
    }, _props), {
      ref
    })
  });
});
Footer.displayName = "@mantine/core/Footer";
var __defProp$2J = Object.defineProperty;
var __getOwnPropSymbols$2K = Object.getOwnPropertySymbols;
var __hasOwnProp$2K = Object.prototype.hasOwnProperty;
var __propIsEnum$2K = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2J = (obj, key, value) => key in obj ? __defProp$2J(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2J = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2K.call(b, prop))
      __defNormalProp$2J(a, prop, b[prop]);
  if (__getOwnPropSymbols$2K)
    for (var prop of __getOwnPropSymbols$2K(b)) {
      if (__propIsEnum$2K.call(b, prop))
        __defNormalProp$2J(a, prop, b[prop]);
    }
  return a;
};
function getPositionStyles$3(props, theme) {
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
    [`@media (max-width: ${navbarOffset}px)`]: {
      paddingLeft: padding2
    },
    [`@media (max-width: ${asideOffset}px)`]: {
      paddingRight: padding2
    }
  };
}
var useStyles$2A = createStyles((theme, props) => ({
  root: {
    boxSizing: "border-box"
  },
  body: {
    display: "flex",
    boxSizing: "border-box"
  },
  main: __spreadValues$2J({
    flex: 1,
    width: "100vw",
    boxSizing: "border-box"
  }, getPositionStyles$3(props, theme))
}));
const useStyles$2B = useStyles$2A;
var __defProp$2I = Object.defineProperty;
var __getOwnPropSymbols$2J = Object.getOwnPropertySymbols;
var __hasOwnProp$2J = Object.prototype.hasOwnProperty;
var __propIsEnum$2J = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2I = (obj, key, value) => key in obj ? __defProp$2I(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2I = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2J.call(b, prop))
      __defNormalProp$2I(a, prop, b[prop]);
  if (__getOwnPropSymbols$2J)
    for (var prop of __getOwnPropSymbols$2J(b)) {
      if (__propIsEnum$2J.call(b, prop))
        __defNormalProp$2I(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1P = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2J.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2J)
    for (var prop of __getOwnPropSymbols$2J(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2J.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$12 = {
  fixed: true,
  zIndex: getDefaultZIndex("app"),
  padding: "md"
};
const AppShell = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AppShell", defaultProps$12, props), {
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
    unstyled
  } = _a, others = __objRest$1P(_a, ["children", "navbar", "header", "footer", "aside", "fixed", "zIndex", "padding", "navbarOffsetBreakpoint", "asideOffsetBreakpoint", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2B({
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
  return /* @__PURE__ */ jsx(AppShellProvider, {
    value: {
      fixed,
      zIndex
    },
    children: /* @__PURE__ */ jsxs(Box, {
      ...__spreadValues$2I({
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
var useStyles$2y = createStyles((theme, { ratio }) => ({
  root: {
    position: "relative",
    maxWidth: "100%",
    "&::before": {
      content: '""',
      height: 0,
      display: "block",
      paddingBottom: `${1 / ratio * 100}%`
    },
    "&::after": {
      content: '""',
      display: "table",
      clear: "both"
    },
    "& > *:not(style)": {
      overflow: "hidden",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%"
    },
    "& > img, & > video": {
      objectFit: "cover"
    }
  }
}));
const useStyles$2z = useStyles$2y;
var __defProp$2H = Object.defineProperty;
var __getOwnPropSymbols$2I = Object.getOwnPropertySymbols;
var __hasOwnProp$2I = Object.prototype.hasOwnProperty;
var __propIsEnum$2I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2H = (obj, key, value) => key in obj ? __defProp$2H(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2H = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2I.call(b, prop))
      __defNormalProp$2H(a, prop, b[prop]);
  if (__getOwnPropSymbols$2I)
    for (var prop of __getOwnPropSymbols$2I(b)) {
      if (__propIsEnum$2I.call(b, prop))
        __defNormalProp$2H(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1O = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2I.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2I)
    for (var prop of __getOwnPropSymbols$2I(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2I.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AspectRatio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AspectRatio", {}, props), {
    className,
    ratio,
    children,
    unstyled
  } = _a, others = __objRest$1O(_a, ["className", "ratio", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2z({
    ratio
  }, {
    name: "AspectRatio",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2H({
      ref,
      className: cx(classes.root, className)
    }, others),
    children
  });
});
AspectRatio.displayName = "@mantine/core/AspectRatio";
const sizes$i = {
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
var useStyles$2w = createStyles((theme, { size: size2, variant, color }) => ({
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
      borderTop: `${theme.fn.size({ size: size2, sizes: sizes$i })}px ${variant} ${getColor(theme, color)}`,
      marginRight: theme.spacing.xs
    },
    "&::after": {
      content: '""',
      flex: 1,
      borderTop: `${theme.fn.size({ size: size2, sizes: sizes$i })}px ${variant} ${getColor(theme, color)}`,
      marginLeft: theme.spacing.xs
    }
  },
  labelDefaultStyles: {
    color: color === "dark" ? theme.colors.dark[1] : theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : theme.fn.primaryShade(), false)
  },
  horizontal: {
    border: 0,
    borderTopWidth: theme.fn.size({ size: size2, sizes: sizes$i }),
    borderTopColor: getColor(theme, color),
    borderTopStyle: variant,
    margin: 0
  },
  vertical: {
    border: 0,
    alignSelf: "stretch",
    height: "auto",
    borderLeftWidth: theme.fn.size({ size: size2, sizes: sizes$i }),
    borderLeftColor: getColor(theme, color),
    borderLeftStyle: variant
  }
}));
const useStyles$2x = useStyles$2w;
var __defProp$2G = Object.defineProperty;
var __defProps$1h = Object.defineProperties;
var __getOwnPropDescs$1h = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2H = Object.getOwnPropertySymbols;
var __hasOwnProp$2H = Object.prototype.hasOwnProperty;
var __propIsEnum$2H = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2G = (obj, key, value) => key in obj ? __defProp$2G(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2G = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2H.call(b, prop))
      __defNormalProp$2G(a, prop, b[prop]);
  if (__getOwnPropSymbols$2H)
    for (var prop of __getOwnPropSymbols$2H(b)) {
      if (__propIsEnum$2H.call(b, prop))
        __defNormalProp$2G(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1h = (a, b) => __defProps$1h(a, __getOwnPropDescs$1h(b));
var __objRest$1N = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2H.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2H)
    for (var prop of __getOwnPropSymbols$2H(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2H.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$11 = {
  orientation: "horizontal",
  size: "xs",
  labelPosition: "left",
  variant: "solid"
};
const Divider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Divider", defaultProps$11, props), {
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
  } = _a, others = __objRest$1N(_a, ["className", "color", "orientation", "size", "label", "labelPosition", "labelProps", "variant", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2x({
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
    ...__spreadValues$2G({
      ref,
      className: cx(classes.root, {
        [classes.vertical]: vertical,
        [classes.horizontal]: horizontal,
        [classes.withLabel]: withLabel
      }, className),
      role: "separator"
    }, others),
    children: withLabel && /* @__PURE__ */ jsx(Text, {
      ...__spreadProps$1h(__spreadValues$2G({}, labelProps), {
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
var __defProp$2F = Object.defineProperty;
var __getOwnPropSymbols$2G = Object.getOwnPropertySymbols;
var __hasOwnProp$2G = Object.prototype.hasOwnProperty;
var __propIsEnum$2G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2F = (obj, key, value) => key in obj ? __defProp$2F(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2F = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2G.call(b, prop))
      __defNormalProp$2F(a, prop, b[prop]);
  if (__getOwnPropSymbols$2G)
    for (var prop of __getOwnPropSymbols$2G(b)) {
      if (__propIsEnum$2G.call(b, prop))
        __defNormalProp$2F(a, prop, b[prop]);
    }
  return a;
};
var useStyles$2u = createStyles((theme, { size: size2 }) => ({
  item: {
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
    "&[data-selected]": __spreadValues$2F({
      backgroundColor: theme.fn.variant({ variant: "filled" }).background,
      color: theme.fn.variant({ variant: "filled" }).color
    }, theme.fn.hover({ backgroundColor: theme.fn.variant({ variant: "filled" }).hover })),
    "&[data-disabled]": {
      cursor: "default",
      color: theme.colors.dark[2]
    }
  },
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
const useStyles$2v = useStyles$2u;
var __defProp$2E = Object.defineProperty;
var __getOwnPropSymbols$2F = Object.getOwnPropertySymbols;
var __hasOwnProp$2F = Object.prototype.hasOwnProperty;
var __propIsEnum$2F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2E = (obj, key, value) => key in obj ? __defProp$2E(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2E = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2F.call(b, prop))
      __defNormalProp$2E(a, prop, b[prop]);
  if (__getOwnPropSymbols$2F)
    for (var prop of __getOwnPropSymbols$2F(b)) {
      if (__propIsEnum$2F.call(b, prop))
        __defNormalProp$2E(a, prop, b[prop]);
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
  } = useStyles$2v({
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
  const constructItemComponent = (item, index2) => {
    const selected = typeof isItemSelected === "function" ? isItemSelected(item.value) : false;
    return /* @__PURE__ */ jsx(Item, {
      ...__spreadValues$2E({
        key: item.value,
        className: classes.item,
        "data-disabled": item.disabled || void 0,
        "data-hovered": !item.disabled && hovered === index2 || void 0,
        "data-selected": !item.disabled && selected || void 0,
        onMouseEnter: () => onItemHover(index2),
        id: `${uuid2}-${index2}`,
        role: "option",
        "data-ignore-outside-clicks": true,
        tabIndex: -1,
        "aria-selected": hovered === index2,
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
  data.forEach((item, index2) => {
    if (item.creatable) {
      creatableDataIndex = index2;
    } else if (!item.group) {
      unGroupedItems.push(constructItemComponent(item, index2));
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
          }, `__mantine-divider-${index2}`)
        );
      }
      groupedItems.push(constructItemComponent(item, index2));
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
var __defProp$2D = Object.defineProperty;
var __getOwnPropSymbols$2E = Object.getOwnPropertySymbols;
var __hasOwnProp$2E = Object.prototype.hasOwnProperty;
var __propIsEnum$2E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2D = (obj, key, value) => key in obj ? __defProp$2D(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2D = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2E.call(b, prop))
      __defNormalProp$2D(a, prop, b[prop]);
  if (__getOwnPropSymbols$2E)
    for (var prop of __getOwnPropSymbols$2E(b)) {
      if (__propIsEnum$2E.call(b, prop))
        __defNormalProp$2D(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1M = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2E.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2E)
    for (var prop of __getOwnPropSymbols$2E(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2E.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const DefaultItem$2 = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    label,
    value
  } = _b, others = __objRest$1M(_b, ["label", "value"]);
  return /* @__PURE__ */ jsx("div", {
    ...__spreadValues$2D({
      ref
    }, others),
    children: label || value
  });
});
DefaultItem$2.displayName = "@mantine/core/DefaultItem";
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
    const index2 = defaultContexts.length;
    defaultContexts = [
      ...defaultContexts,
      defaultContext
    ];
    function Provider(props) {
      const { scope, children, ...context } = props;
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
      const value = react.exports.useMemo(
        () => context,
        Object.values(context)
      );
      return /* @__PURE__ */ react.exports.createElement(Context.Provider, {
        value
      }, children);
    }
    function useContext(consumerName, scope) {
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
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
var useStyles$2s = createStyles((theme, { scrollbarSize, offsetScrollbars, scrollbarHovered, hidden: hidden2 }, getRef) => ({
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
const useStyles$2t = useStyles$2s;
var __defProp$2C = Object.defineProperty;
var __defProps$1g = Object.defineProperties;
var __getOwnPropDescs$1g = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2D = Object.getOwnPropertySymbols;
var __hasOwnProp$2D = Object.prototype.hasOwnProperty;
var __propIsEnum$2D = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2C = (obj, key, value) => key in obj ? __defProp$2C(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2C = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2D.call(b, prop))
      __defNormalProp$2C(a, prop, b[prop]);
  if (__getOwnPropSymbols$2D)
    for (var prop of __getOwnPropSymbols$2D(b)) {
      if (__propIsEnum$2D.call(b, prop))
        __defNormalProp$2C(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1g = (a, b) => __defProps$1g(a, __getOwnPropDescs$1g(b));
var __objRest$1L = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2D.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2D)
    for (var prop of __getOwnPropSymbols$2D(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2D.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$10 = {
  scrollbarSize: 12,
  scrollHideDelay: 1e3,
  type: "hover",
  offsetScrollbars: false
};
const _ScrollArea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ScrollArea", defaultProps$10, props), {
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
  } = _a, others = __objRest$1L(_a, ["children", "className", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled"]);
  const [scrollbarHovered, setScrollbarHovered] = react.exports.useState(false);
  const theme = useMantineTheme();
  const {
    classes,
    cx
  } = useStyles$2t({
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
      ...__spreadValues$2C({
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
  const _a = useComponentDefaultProps("ScrollAreaAutosize", defaultProps$10, props), {
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
  } = _a, others = __objRest$1L(_a, ["maxHeight", "children", "classNames", "styles", "scrollbarSize", "scrollHideDelay", "type", "dir", "offsetScrollbars", "viewportRef", "onScrollPositionChange", "unstyled", "sx"]);
  return /* @__PURE__ */ React.createElement(Box, __spreadProps$1g(__spreadValues$2C({}, others), {
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
var __defProp$2B = Object.defineProperty;
var __defProps$1f = Object.defineProperties;
var __getOwnPropDescs$1f = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2C = Object.getOwnPropertySymbols;
var __hasOwnProp$2C = Object.prototype.hasOwnProperty;
var __propIsEnum$2C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2B = (obj, key, value) => key in obj ? __defProp$2B(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2B = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2C.call(b, prop))
      __defNormalProp$2B(a, prop, b[prop]);
  if (__getOwnPropSymbols$2C)
    for (var prop of __getOwnPropSymbols$2C(b)) {
      if (__propIsEnum$2C.call(b, prop))
        __defNormalProp$2B(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1f = (a, b) => __defProps$1f(a, __getOwnPropDescs$1f(b));
var __objRest$1K = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2C.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2C)
    for (var prop of __getOwnPropSymbols$2C(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2C.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SelectScrollArea = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    style
  } = _b, others = __objRest$1K(_b, ["style"]);
  return /* @__PURE__ */ jsx(ScrollArea, {
    ...__spreadProps$1f(__spreadValues$2B({}, others), {
      style: __spreadValues$2B({
        width: "100%"
      }, style),
      viewportRef: ref
    }),
    children: others.children
  });
});
SelectScrollArea.displayName = "@mantine/core/SelectScrollArea";
var useStyles$2q = createStyles(() => ({
  dropdown: {},
  itemsWrapper: {
    padding: 4,
    display: "flex",
    width: "100%"
  }
}));
const useStyles$2r = useStyles$2q;
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
var __defProp$2A = Object.defineProperty;
var __defProps$1e = Object.defineProperties;
var __getOwnPropDescs$1e = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2B = Object.getOwnPropertySymbols;
var __hasOwnProp$2B = Object.prototype.hasOwnProperty;
var __propIsEnum$2B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2A = (obj, key, value) => key in obj ? __defProp$2A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2A = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2B.call(b, prop))
      __defNormalProp$2A(a, prop, b[prop]);
  if (__getOwnPropSymbols$2B)
    for (var prop of __getOwnPropSymbols$2B(b)) {
      if (__propIsEnum$2B.call(b, prop))
        __defNormalProp$2A(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1e = (a, b) => __defProps$1e(a, __getOwnPropDescs$1e(b));
var __objRest$1J = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2B.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2B)
    for (var prop of __getOwnPropSymbols$2B(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2B.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const PopoverTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, { children, refProp = "ref", popupType = "dialog" } = _b, others = __objRest$1J(_b, ["children", "refProp", "popupType"]);
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
  return react.exports.cloneElement(children, __spreadValues$2A(__spreadProps$1e(__spreadValues$2A(__spreadValues$2A(__spreadValues$2A({}, forwardedProps), accessibleProps), ctx.targetProps), {
    className: clsx(ctx.targetProps.className, forwardedProps.className, children.props.className),
    [refProp]: targetRef
  }), !ctx.controlled ? { onClick: ctx.onToggle } : null));
});
PopoverTarget.displayName = "@mantine/core/PopoverTarget";
var useStyles$2o = createStyles((theme, { radius, shadow }) => ({
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
const useStyles$2p = useStyles$2o;
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
var __defProp$2z = Object.defineProperty;
var __defProps$1d = Object.defineProperties;
var __getOwnPropDescs$1d = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2A = Object.getOwnPropertySymbols;
var __hasOwnProp$2A = Object.prototype.hasOwnProperty;
var __propIsEnum$2A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2z = (obj, key, value) => key in obj ? __defProp$2z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2A.call(b, prop))
      __defNormalProp$2z(a, prop, b[prop]);
  if (__getOwnPropSymbols$2A)
    for (var prop of __getOwnPropSymbols$2A(b)) {
      if (__propIsEnum$2A.call(b, prop))
        __defNormalProp$2z(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1d = (a, b) => __defProps$1d(a, __getOwnPropDescs$1d(b));
var __objRest$1I = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2A.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2A)
    for (var prop of __getOwnPropSymbols$2A(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2A.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function PopoverDropdown(_a) {
  var _b = _a, {
    style,
    className,
    children
  } = _b, others = __objRest$1I(_b, ["style", "className", "children"]);
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
  } = useStyles$2p({
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
            ...__spreadValues$2z(__spreadProps$1d(__spreadValues$2z({}, accessibleProps), {
              tabIndex: -1,
              ref: ctx.floating,
              style: __spreadProps$1d(__spreadValues$2z(__spreadValues$2z({}, style), transitionStyles), {
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
var __getOwnPropSymbols$2z = Object.getOwnPropertySymbols;
var __hasOwnProp$2z = Object.prototype.hasOwnProperty;
var __propIsEnum$2z = Object.prototype.propertyIsEnumerable;
var __objRest$1H = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2z)
    for (var prop of __getOwnPropSymbols$2z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$$ = {
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
  const _a = useComponentDefaultProps("Popover", defaultProps$$, props), {
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
  } = _a, others = __objRest$1H(_a, ["children", "position", "offset", "onPositionChange", "positionDependencies", "opened", "transition", "transitionDuration", "width", "middlewares", "withArrow", "arrowSize", "arrowOffset", "unstyled", "classNames", "styles", "closeOnClickOutside", "withinPortal", "closeOnEscape", "clickOutsideEvents", "trapFocus", "onClose", "onOpen", "onChange", "zIndex", "radius", "shadow", "id", "defaultOpened", "exitTransitionDuration", "__staticSelector", "withRoles"]);
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
var __defProp$2y = Object.defineProperty;
var __getOwnPropSymbols$2y = Object.getOwnPropertySymbols;
var __hasOwnProp$2y = Object.prototype.hasOwnProperty;
var __propIsEnum$2y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2y = (obj, key, value) => key in obj ? __defProp$2y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2y.call(b, prop))
      __defNormalProp$2y(a, prop, b[prop]);
  if (__getOwnPropSymbols$2y)
    for (var prop of __getOwnPropSymbols$2y(b)) {
      if (__propIsEnum$2y.call(b, prop))
        __defNormalProp$2y(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1G = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2y.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2y)
    for (var prop of __getOwnPropSymbols$2y(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2y.call(source, prop))
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
  } = _b, others = __objRest$1G(_b, ["children", "component", "maxHeight", "direction", "id", "innerRef", "__staticSelector", "styles", "classNames", "unstyled"]);
  const {
    classes
  } = useStyles$2r(null, {
    name: __staticSelector,
    styles,
    classNames,
    unstyled
  });
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$2y({
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
function filterData$2({ data, limit, value, filter }) {
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    if (filter(value, data[i])) {
      result.push(data[i]);
    }
    if (result.length >= limit) {
      break;
    }
  }
  return result;
}
var useStyles$2m = createStyles((theme, { size: size2 }) => {
  const spacing = theme.fn.size({ size: size2, sizes: theme.spacing });
  return {
    wrapper: {
      position: "relative"
    },
    item: {
      textAlign: "left",
      width: "100%",
      padding: `${spacing / 1.5}px ${spacing}`,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
    },
    hovered: {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    },
    nothingFound: {
      boxSizing: "border-box",
      color: theme.colors.gray[6],
      paddingTop: spacing / 2,
      paddingBottom: spacing / 2,
      textAlign: "center"
    }
  };
});
const useStyles$2n = useStyles$2m;
var __defProp$2x = Object.defineProperty;
var __defProps$1c = Object.defineProperties;
var __getOwnPropDescs$1c = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2x = Object.getOwnPropertySymbols;
var __hasOwnProp$2x = Object.prototype.hasOwnProperty;
var __propIsEnum$2x = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2x = (obj, key, value) => key in obj ? __defProp$2x(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2x = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2x.call(b, prop))
      __defNormalProp$2x(a, prop, b[prop]);
  if (__getOwnPropSymbols$2x)
    for (var prop of __getOwnPropSymbols$2x(b)) {
      if (__propIsEnum$2x.call(b, prop))
        __defNormalProp$2x(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1c = (a, b) => __defProps$1c(a, __getOwnPropDescs$1c(b));
var __objRest$1F = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2x.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2x)
    for (var prop of __getOwnPropSymbols$2x(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2x.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function defaultFilter$3(value, item) {
  return item.value.toLowerCase().trim().includes(value.toLowerCase().trim());
}
const defaultProps$_ = {
  required: false,
  size: "sm",
  shadow: "sm",
  limit: 5,
  itemComponent: DefaultItem$2,
  transition: "pop",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter$3,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  dropdownPosition: "flip",
  maxDropdownHeight: "auto",
  positionDependencies: []
};
const Autocomplete = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("Autocomplete", defaultProps$_, props), {
    inputProps,
    wrapperProps,
    shadow,
    data,
    limit,
    value,
    defaultValue,
    onChange,
    unstyled,
    itemComponent,
    onItemSubmit,
    onKeyDown,
    onFocus,
    onBlur,
    onClick,
    transition,
    transitionDuration,
    initiallyOpened,
    transitionTimingFunction,
    classNames,
    styles,
    filter,
    nothingFound,
    onDropdownClose,
    onDropdownOpen,
    withinPortal,
    switchDirectionOnFlip,
    zIndex,
    dropdownPosition,
    maxDropdownHeight,
    dropdownComponent,
    positionDependencies
  } = _a, others = __objRest$1F(_a, ["inputProps", "wrapperProps", "shadow", "data", "limit", "value", "defaultValue", "onChange", "unstyled", "itemComponent", "onItemSubmit", "onKeyDown", "onFocus", "onBlur", "onClick", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "classNames", "styles", "filter", "nothingFound", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "dropdownPosition", "maxDropdownHeight", "dropdownComponent", "positionDependencies"]);
  const {
    classes
  } = useStyles$2n({
    size: inputProps.size
  }, {
    classNames,
    styles,
    name: "Autocomplete",
    unstyled
  });
  const [dropdownOpened, _setDropdownOpened] = react.exports.useState(initiallyOpened);
  const [hovered, setHovered] = react.exports.useState(-1);
  const [direction, setDirection] = react.exports.useState("column");
  const inputRef = react.exports.useRef(null);
  const [IMEOpen, setIMEOpen] = react.exports.useState(false);
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const setDropdownOpened = (opened) => {
    _setDropdownOpened(opened);
    const handler = opened ? onDropdownOpen : onDropdownClose;
    typeof handler === "function" && handler();
  };
  useDidUpdate(() => {
    setHovered(-1);
  }, [_value]);
  const handleItemClick = (item) => {
    handleChange(item.value);
    typeof onItemSubmit === "function" && onItemSubmit(item);
    setDropdownOpened(false);
  };
  const formattedData = data.map((item) => typeof item === "string" ? {
    value: item
  } : item);
  const filteredData = filterData$2({
    data: formattedData,
    value: _value,
    limit,
    filter
  });
  const handleInputKeydown = (event) => {
    if (IMEOpen) {
      return;
    }
    typeof onKeyDown === "function" && onKeyDown(event);
    const isColumn = direction === "column";
    const handleNext = () => {
      setHovered((current) => current < filteredData.length - 1 ? current + 1 : current);
    };
    const handlePrevious = () => {
      setHovered((current) => current > 0 ? current - 1 : current);
    };
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        isColumn ? handlePrevious() : handleNext();
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        isColumn ? handleNext() : handlePrevious();
        break;
      }
      case "Enter": {
        if (filteredData[hovered] && dropdownOpened) {
          event.preventDefault();
          handleChange(filteredData[hovered].value);
          typeof onItemSubmit === "function" && onItemSubmit(filteredData[hovered]);
          setDropdownOpened(false);
        }
        break;
      }
      case "Escape": {
        if (dropdownOpened) {
          event.preventDefault();
          setDropdownOpened(false);
        }
      }
    }
  };
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    setDropdownOpened(true);
  };
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    setDropdownOpened(false);
  };
  const handleInputClick = (event) => {
    typeof onClick === "function" && onClick(event);
    setDropdownOpened(true);
  };
  const shouldRenderDropdown = dropdownOpened && (filteredData.length > 0 || filteredData.length === 0 && !!nothingFound);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$1c(__spreadValues$2x({}, wrapperProps), {
      __staticSelector: "Autocomplete"
    }),
    children: /* @__PURE__ */ jsxs(SelectPopover, {
      opened: shouldRenderDropdown,
      transition,
      transitionDuration,
      shadow: "sm",
      withinPortal,
      __staticSelector: "Autocomplete",
      onDirectionChange: setDirection,
      switchDirectionOnFlip,
      zIndex,
      dropdownPosition,
      positionDependencies,
      classNames,
      styles,
      unstyled,
      children: [/* @__PURE__ */ jsx(SelectPopover.Target, {
        children: /* @__PURE__ */ jsx("div", {
          className: classes.wrapper,
          role: "combobox",
          "aria-haspopup": "listbox",
          "aria-owns": shouldRenderDropdown ? `${inputProps.id}-items` : null,
          "aria-controls": inputProps.id,
          "aria-expanded": shouldRenderDropdown,
          onMouseLeave: () => setHovered(-1),
          tabIndex: -1,
          children: /* @__PURE__ */ jsx(Input, {
            ...__spreadProps$1c(__spreadValues$2x(__spreadValues$2x({
              type: "search",
              autoComplete: "off"
            }, inputProps), others), {
              "data-mantine-stop-propagation": dropdownOpened,
              ref: useMergedRef(ref, inputRef),
              onKeyDown: handleInputKeydown,
              classNames,
              styles,
              __staticSelector: "Autocomplete",
              value: _value,
              onChange: (event) => {
                handleChange(event.currentTarget.value);
                setDropdownOpened(true);
              },
              onFocus: handleInputFocus,
              onBlur: handleInputBlur,
              onClick: handleInputClick,
              onCompositionStart: () => setIMEOpen(true),
              onCompositionEnd: () => setIMEOpen(false),
              "aria-autocomplete": "list",
              "aria-controls": shouldRenderDropdown ? `${inputProps.id}-items` : null,
              "aria-activedescendant": hovered >= 0 ? `${inputProps.id}-${hovered}` : null
            })
          })
        })
      }), /* @__PURE__ */ jsx(SelectPopover.Dropdown, {
        component: dropdownComponent || SelectScrollArea,
        maxHeight: maxDropdownHeight,
        direction,
        id: inputProps.id,
        __staticSelector: "Autocomplete",
        classNames,
        styles,
        children: /* @__PURE__ */ jsx(SelectItems, {
          data: filteredData,
          hovered,
          classNames,
          styles,
          uuid: inputProps.id,
          __staticSelector: "Autocomplete",
          onItemHover: setHovered,
          onItemSelect: handleItemClick,
          itemComponent,
          size: inputProps.size,
          nothingFound
        })
      })]
    })
  });
});
Autocomplete.displayName = "@mantine/core/Autocomplete";
var __defProp$2w = Object.defineProperty;
var __defProps$1b = Object.defineProperties;
var __getOwnPropDescs$1b = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2w = Object.getOwnPropertySymbols;
var __hasOwnProp$2w = Object.prototype.hasOwnProperty;
var __propIsEnum$2w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2w = (obj, key, value) => key in obj ? __defProp$2w(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2w = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2w.call(b, prop))
      __defNormalProp$2w(a, prop, b[prop]);
  if (__getOwnPropSymbols$2w)
    for (var prop of __getOwnPropSymbols$2w(b)) {
      if (__propIsEnum$2w.call(b, prop))
        __defNormalProp$2w(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1b = (a, b) => __defProps$1b(a, __getOwnPropDescs$1b(b));
function AvatarPlaceholderIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadProps$1b(__spreadValues$2w({}, props), {
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
var __defProp$2v = Object.defineProperty;
var __defProps$1a = Object.defineProperties;
var __getOwnPropDescs$1a = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2v = Object.getOwnPropertySymbols;
var __hasOwnProp$2v = Object.prototype.hasOwnProperty;
var __propIsEnum$2v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2v = (obj, key, value) => key in obj ? __defProp$2v(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2v = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2v.call(b, prop))
      __defNormalProp$2v(a, prop, b[prop]);
  if (__getOwnPropSymbols$2v)
    for (var prop of __getOwnPropSymbols$2v(b)) {
      if (__propIsEnum$2v.call(b, prop))
        __defNormalProp$2v(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1a = (a, b) => __defProps$1a(a, __getOwnPropDescs$1a(b));
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
    return __spreadProps$1a(__spreadValues$2v({}, ctx), {
      withinGroup: true
    });
  }
  return {
    spacing: null,
    withinGroup: false
  };
}
var useStyles$2k = createStyles((theme, { spacing }) => ({
  root: {
    display: "flex",
    paddingLeft: theme.fn.size({ size: spacing, sizes: theme.spacing })
  }
}));
const useStyles$2l = useStyles$2k;
var __defProp$2u = Object.defineProperty;
var __getOwnPropSymbols$2u = Object.getOwnPropertySymbols;
var __hasOwnProp$2u = Object.prototype.hasOwnProperty;
var __propIsEnum$2u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2u = (obj, key, value) => key in obj ? __defProp$2u(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2u = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2u.call(b, prop))
      __defNormalProp$2u(a, prop, b[prop]);
  if (__getOwnPropSymbols$2u)
    for (var prop of __getOwnPropSymbols$2u(b)) {
      if (__propIsEnum$2u.call(b, prop))
        __defNormalProp$2u(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1E = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2u.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2u)
    for (var prop of __getOwnPropSymbols$2u(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2u.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$Z = {};
const AvatarGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AvatarGroup", defaultProps$Z, props), {
    children,
    spacing = "sm",
    unstyled,
    className
  } = _a, others = __objRest$1E(_a, ["children", "spacing", "unstyled", "className"]);
  const {
    classes,
    cx
  } = useStyles$2l({
    spacing
  }, {
    name: "AvatarGroup",
    unstyled
  });
  return /* @__PURE__ */ jsx(AvatarGroupProvider, {
    spacing,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$2u({
        ref,
        className: cx(classes.root, className)
      }, others),
      children
    })
  });
});
AvatarGroup.displayName = "@mantine/core/AvatarGroup";
var __defProp$2t = Object.defineProperty;
var __defProps$19 = Object.defineProperties;
var __getOwnPropDescs$19 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2t = Object.getOwnPropertySymbols;
var __hasOwnProp$2t = Object.prototype.hasOwnProperty;
var __propIsEnum$2t = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2t = (obj, key, value) => key in obj ? __defProp$2t(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2t = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2t.call(b, prop))
      __defNormalProp$2t(a, prop, b[prop]);
  if (__getOwnPropSymbols$2t)
    for (var prop of __getOwnPropSymbols$2t(b)) {
      if (__propIsEnum$2t.call(b, prop))
        __defNormalProp$2t(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$19 = (a, b) => __defProps$19(a, __getOwnPropDescs$19(b));
const sizes$h = {
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
var useStyles$2i = createStyles((theme, { size: size2, radius, color, withinGroup, spacing, variant, gradient }) => {
  const colors = theme.fn.variant({ variant, color, gradient });
  return {
    root: __spreadValues$2t(__spreadProps$19(__spreadValues$2t({}, theme.fn.focusStyles()), {
      WebkitTapHighlightColor: "transparent",
      boxSizing: "border-box",
      position: "relative",
      display: "block",
      userSelect: "none",
      overflow: "hidden",
      width: theme.fn.size({ size: size2, sizes: sizes$h }),
      minWidth: theme.fn.size({ size: size2, sizes: sizes$h }),
      height: theme.fn.size({ size: size2, sizes: sizes$h }),
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
    placeholder: __spreadProps$19(__spreadValues$2t({}, theme.fn.fontStyles()), {
      fontSize: theme.fn.size({ size: size2, sizes: sizes$h }) / 2.5,
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
const useStyles$2j = useStyles$2i;
var __defProp$2s = Object.defineProperty;
var __defProps$18 = Object.defineProperties;
var __getOwnPropDescs$18 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2s = Object.getOwnPropertySymbols;
var __hasOwnProp$2s = Object.prototype.hasOwnProperty;
var __propIsEnum$2s = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2s = (obj, key, value) => key in obj ? __defProp$2s(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2s = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2s.call(b, prop))
      __defNormalProp$2s(a, prop, b[prop]);
  if (__getOwnPropSymbols$2s)
    for (var prop of __getOwnPropSymbols$2s(b)) {
      if (__propIsEnum$2s.call(b, prop))
        __defNormalProp$2s(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$18 = (a, b) => __defProps$18(a, __getOwnPropDescs$18(b));
var __objRest$1D = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2s.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2s)
    for (var prop of __getOwnPropSymbols$2s(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2s.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$Y = {
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
  const _a = useComponentDefaultProps("Avatar", defaultProps$Y, props), {
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
  } = _a, others = __objRest$1D(_a, ["className", "size", "src", "alt", "radius", "children", "color", "variant", "gradient", "classNames", "styles", "imageProps", "unstyled"]);
  const ctx = useAvatarGroupContext();
  const [error, setError] = react.exports.useState(!src);
  const {
    classes,
    cx
  } = useStyles$2j({
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
    ...__spreadValues$2s({
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
      ...__spreadProps$18(__spreadValues$2s({}, imageProps), {
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
var __defProp$2r = Object.defineProperty;
var __defProps$17 = Object.defineProperties;
var __getOwnPropDescs$17 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2r = Object.getOwnPropertySymbols;
var __hasOwnProp$2r = Object.prototype.hasOwnProperty;
var __propIsEnum$2r = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2r = (obj, key, value) => key in obj ? __defProp$2r(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2r = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2r.call(b, prop))
      __defNormalProp$2r(a, prop, b[prop]);
  if (__getOwnPropSymbols$2r)
    for (var prop of __getOwnPropSymbols$2r(b)) {
      if (__propIsEnum$2r.call(b, prop))
        __defNormalProp$2r(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$17 = (a, b) => __defProps$17(a, __getOwnPropDescs$17(b));
var __objRest$1C = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2r.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2r)
    for (var prop of __getOwnPropSymbols$2r(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2r.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$X = {
  radius: 0
};
const _BackgroundImage = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("BackgroundImage", defaultProps$X, props), {
    src,
    radius,
    sx
  } = _a, others = __objRest$1C(_a, ["src", "radius", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$17(__spreadValues$2r({}, others), {
      ref,
      sx: [(theme) => __spreadProps$17(__spreadValues$2r({}, theme.fn.focusStyles()), {
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "block",
        width: "100%",
        border: 0,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundImage: `url(${src})`,
        borderRadius: theme.fn.radius(radius)
      }), ...packSx(sx)]
    })
  });
});
_BackgroundImage.displayName = "@mantine/core/BackgroundImage";
const BackgroundImage = createPolymorphicComponent(_BackgroundImage);
var __defProp$2q = Object.defineProperty;
var __defProps$16 = Object.defineProperties;
var __getOwnPropDescs$16 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2q = Object.getOwnPropertySymbols;
var __hasOwnProp$2q = Object.prototype.hasOwnProperty;
var __propIsEnum$2q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2q = (obj, key, value) => key in obj ? __defProp$2q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2q.call(b, prop))
      __defNormalProp$2q(a, prop, b[prop]);
  if (__getOwnPropSymbols$2q)
    for (var prop of __getOwnPropSymbols$2q(b)) {
      if (__propIsEnum$2q.call(b, prop))
        __defNormalProp$2q(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$16 = (a, b) => __defProps$16(a, __getOwnPropDescs$16(b));
const sizes$g = {
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
function getVariantStyles$2({ theme, variant, color, size: size2, gradient }) {
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
var useStyles$2g = createStyles((theme, { color, size: size2, radius, gradient, fullWidth, variant }) => {
  const { fontSize, height } = size2 in sizes$g ? sizes$g[size2] : sizes$g.md;
  return {
    leftSection: {
      marginRight: theme.spacing.xs / 2
    },
    rightSection: {
      marginLeft: theme.spacing.xs / 2
    },
    inner: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    root: __spreadValues$2q(__spreadProps$16(__spreadValues$2q(__spreadValues$2q({}, theme.fn.focusStyles()), theme.fn.fontStyles()), {
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
    }), getVariantStyles$2({ theme, variant, color, size: size2, gradient }))
  };
});
const useStyles$2h = useStyles$2g;
var __defProp$2p = Object.defineProperty;
var __getOwnPropSymbols$2p = Object.getOwnPropertySymbols;
var __hasOwnProp$2p = Object.prototype.hasOwnProperty;
var __propIsEnum$2p = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2p = (obj, key, value) => key in obj ? __defProp$2p(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2p = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2p.call(b, prop))
      __defNormalProp$2p(a, prop, b[prop]);
  if (__getOwnPropSymbols$2p)
    for (var prop of __getOwnPropSymbols$2p(b)) {
      if (__propIsEnum$2p.call(b, prop))
        __defNormalProp$2p(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1B = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2p.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2p)
    for (var prop of __getOwnPropSymbols$2p(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2p.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$W = {
  variant: "light",
  size: "md",
  radius: "xl"
};
const _Badge = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Badge", defaultProps$W, props), {
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
  } = _a, others = __objRest$1B(_a, ["className", "color", "variant", "fullWidth", "children", "size", "leftSection", "rightSection", "radius", "gradient", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2h({
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
    ...__spreadValues$2p({
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
var __defProp$2o = Object.defineProperty;
var __getOwnPropSymbols$2o = Object.getOwnPropertySymbols;
var __hasOwnProp$2o = Object.prototype.hasOwnProperty;
var __propIsEnum$2o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2o = (obj, key, value) => key in obj ? __defProp$2o(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2o = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2o.call(b, prop))
      __defNormalProp$2o(a, prop, b[prop]);
  if (__getOwnPropSymbols$2o)
    for (var prop of __getOwnPropSymbols$2o(b)) {
      if (__propIsEnum$2o.call(b, prop))
        __defNormalProp$2o(a, prop, b[prop]);
    }
  return a;
};
function QuoteIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$2o({
      width: "20",
      height: "20",
      viewBox: "0 0 409.294 409.294",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M0 204.647v175.412h175.412V204.647H58.471c0-64.48 52.461-116.941 116.941-116.941V29.235C78.684 29.235 0 107.919 0 204.647zM409.294 87.706V29.235c-96.728 0-175.412 78.684-175.412 175.412v175.412h175.412V204.647H292.353c0-64.48 52.461-116.941 116.941-116.941z"
    })
  });
}
var __defProp$2n = Object.defineProperty;
var __defProps$15 = Object.defineProperties;
var __getOwnPropDescs$15 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2n = Object.getOwnPropertySymbols;
var __hasOwnProp$2n = Object.prototype.hasOwnProperty;
var __propIsEnum$2n = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2n = (obj, key, value) => key in obj ? __defProp$2n(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2n = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2n.call(b, prop))
      __defNormalProp$2n(a, prop, b[prop]);
  if (__getOwnPropSymbols$2n)
    for (var prop of __getOwnPropSymbols$2n(b)) {
      if (__propIsEnum$2n.call(b, prop))
        __defNormalProp$2n(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$15 = (a, b) => __defProps$15(a, __getOwnPropDescs$15(b));
var useStyles$2e = createStyles((theme, { color }) => ({
  root: __spreadProps$15(__spreadValues$2n({}, theme.fn.fontStyles()), {
    fontSize: theme.fontSizes.lg,
    lineHeight: theme.lineHeight,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    margin: 0,
    borderTopRightRadius: theme.radius.sm,
    borderBottomRightRadius: theme.radius.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`
  }),
  inner: {
    display: "flex"
  },
  body: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  icon: {
    color: theme.fn.variant({ variant: "filled", color }).background,
    marginRight: theme.spacing.lg,
    marginTop: 2,
    width: 22
  },
  cite: {
    display: "block",
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}));
const useStyles$2f = useStyles$2e;
var __defProp$2m = Object.defineProperty;
var __getOwnPropSymbols$2m = Object.getOwnPropertySymbols;
var __hasOwnProp$2m = Object.prototype.hasOwnProperty;
var __propIsEnum$2m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2m = (obj, key, value) => key in obj ? __defProp$2m(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2m = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2m.call(b, prop))
      __defNormalProp$2m(a, prop, b[prop]);
  if (__getOwnPropSymbols$2m)
    for (var prop of __getOwnPropSymbols$2m(b)) {
      if (__propIsEnum$2m.call(b, prop))
        __defNormalProp$2m(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1A = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2m.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2m)
    for (var prop of __getOwnPropSymbols$2m(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2m.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$V = {
  color: "gray",
  icon: /* @__PURE__ */ jsx(QuoteIcon, {})
};
const Blockquote = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Blockquote", defaultProps$V, props), {
    className,
    color,
    icon,
    cite,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1A(_a, ["className", "color", "icon", "cite", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2f({
    color
  }, {
    classNames,
    styles,
    unstyled,
    name: "Blockquote"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2m({
      component: "blockquote",
      className: cx(classes.root, className),
      ref
    }, others),
    children: /* @__PURE__ */ jsxs("div", {
      className: classes.inner,
      children: [icon && /* @__PURE__ */ jsx("div", {
        className: classes.icon,
        children: icon
      }), /* @__PURE__ */ jsxs("div", {
        className: classes.body,
        children: [children, cite && /* @__PURE__ */ jsx("cite", {
          className: classes.cite,
          children: cite
        })]
      })]
    })
  });
});
Blockquote.displayName = "@mantine/core/Blockquote";
var useStyles$2c = createStyles((theme) => ({
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
const useStyles$2d = useStyles$2c;
var __defProp$2l = Object.defineProperty;
var __getOwnPropSymbols$2l = Object.getOwnPropertySymbols;
var __hasOwnProp$2l = Object.prototype.hasOwnProperty;
var __propIsEnum$2l = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2l = (obj, key, value) => key in obj ? __defProp$2l(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2l = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2l.call(b, prop))
      __defNormalProp$2l(a, prop, b[prop]);
  if (__getOwnPropSymbols$2l)
    for (var prop of __getOwnPropSymbols$2l(b)) {
      if (__propIsEnum$2l.call(b, prop))
        __defNormalProp$2l(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1z = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2l.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2l)
    for (var prop of __getOwnPropSymbols$2l(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2l.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$U = {
  separator: "/"
};
const Breadcrumbs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Breadcrumbs", defaultProps$U, props), {
    className,
    children,
    separator,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1z(_a, ["className", "children", "separator", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$2d(null, {
    classNames,
    styles,
    unstyled,
    name: "Breadcrumbs"
  });
  const items = React.Children.toArray(children).reduce((acc, child, index2, array) => {
    var _a2;
    const item = isElement(child) ? React.cloneElement(child, {
      className: cx(classes.breadcrumb, (_a2 = child.props) == null ? void 0 : _a2.className),
      key: index2
    }) : /* @__PURE__ */ jsx("div", {
      className: classes.breadcrumb,
      children: child
    }, index2);
    acc.push(item);
    if (index2 !== array.length - 1) {
      acc.push(
        /* @__PURE__ */ jsx(Text, {
          size: "sm",
          className: classes.separator,
          children: separator
        }, `separator-${index2}`)
      );
    }
    return acc;
  }, []);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2l({
      className: cx(classes.root, className),
      ref
    }, others),
    children: items
  });
});
Breadcrumbs.displayName = "@mantine/core/Breadcrumbs";
const sizes$f = {
  xs: 12,
  sm: 18,
  md: 24,
  lg: 34,
  xl: 42
};
var useStyles$2a = createStyles((theme, { size: size2, color, transitionDuration }) => {
  const sizeValue = theme.fn.size({ size: size2, sizes: sizes$f });
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
const useStyles$2b = useStyles$2a;
var __defProp$2k = Object.defineProperty;
var __getOwnPropSymbols$2k = Object.getOwnPropertySymbols;
var __hasOwnProp$2k = Object.prototype.hasOwnProperty;
var __propIsEnum$2k = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2k = (obj, key, value) => key in obj ? __defProp$2k(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2k = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2k.call(b, prop))
      __defNormalProp$2k(a, prop, b[prop]);
  if (__getOwnPropSymbols$2k)
    for (var prop of __getOwnPropSymbols$2k(b)) {
      if (__propIsEnum$2k.call(b, prop))
        __defNormalProp$2k(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1y = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2k.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2k)
    for (var prop of __getOwnPropSymbols$2k(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2k.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$T = {
  size: "md",
  transitionDuration: 300
};
const Burger = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Burger", defaultProps$T, props), {
    className,
    opened,
    color,
    size: size2,
    classNames,
    styles,
    transitionDuration
  } = _a, others = __objRest$1y(_a, ["className", "opened", "color", "size", "classNames", "styles", "transitionDuration"]);
  const {
    classes,
    cx
  } = useStyles$2b({
    color,
    size: size2,
    transitionDuration
  }, {
    classNames,
    styles,
    name: "Burger"
  });
  return /* @__PURE__ */ jsx(UnstyledButton, {
    ...__spreadValues$2k({
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
var useStyles$28 = createStyles((theme, { padding: padding2, withBorder, inheritPadding }) => {
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
const useStyles$29 = useStyles$28;
var __defProp$2j = Object.defineProperty;
var __getOwnPropSymbols$2j = Object.getOwnPropertySymbols;
var __hasOwnProp$2j = Object.prototype.hasOwnProperty;
var __propIsEnum$2j = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2j = (obj, key, value) => key in obj ? __defProp$2j(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2j = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2j.call(b, prop))
      __defNormalProp$2j(a, prop, b[prop]);
  if (__getOwnPropSymbols$2j)
    for (var prop of __getOwnPropSymbols$2j(b)) {
      if (__propIsEnum$2j.call(b, prop))
        __defNormalProp$2j(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1x = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2j.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2j)
    for (var prop of __getOwnPropSymbols$2j(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2j.call(source, prop))
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
  } = _b, others = __objRest$1x(_b, ["className", "withBorder", "inheritPadding", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$29({
    padding: useCardPadding(),
    withBorder,
    inheritPadding
  }, {
    name: "Card",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2j({
      className: cx(classes.cardSection, className),
      ref
    }, others)
  });
});
_CardSection.displayName = "@mantine/core/CardSection";
const CardSection = createPolymorphicComponent(_CardSection);
var useStyles$26 = createStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
  }
}));
const useStyles$27 = useStyles$26;
var __defProp$2i = Object.defineProperty;
var __getOwnPropSymbols$2i = Object.getOwnPropertySymbols;
var __hasOwnProp$2i = Object.prototype.hasOwnProperty;
var __propIsEnum$2i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2i = (obj, key, value) => key in obj ? __defProp$2i(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2i = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2i.call(b, prop))
      __defNormalProp$2i(a, prop, b[prop]);
  if (__getOwnPropSymbols$2i)
    for (var prop of __getOwnPropSymbols$2i(b)) {
      if (__propIsEnum$2i.call(b, prop))
        __defNormalProp$2i(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1w = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2i.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2i)
    for (var prop of __getOwnPropSymbols$2i(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2i.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$S = {
  p: "md"
};
const _Card = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Card", defaultProps$S, props), {
    className,
    p,
    radius,
    children,
    unstyled
  } = _a, others = __objRest$1w(_a, ["className", "p", "radius", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$27(null, {
    name: "Card",
    unstyled
  });
  const _children = react.exports.Children.toArray(children);
  const content = _children.map((child, index2) => {
    if (typeof child === "object" && child && "type" in child && child.type === CardSection) {
      return react.exports.cloneElement(child, {
        padding: p,
        "data-first": index2 === 0 || void 0,
        "data-last": index2 === _children.length - 1 || void 0
      });
    }
    return child;
  });
  return /* @__PURE__ */ jsx(CardProvider, {
    value: {
      padding: p
    },
    children: /* @__PURE__ */ jsx(Paper, {
      ...__spreadValues$2i({
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
var __defProp$2h = Object.defineProperty;
var __getOwnPropSymbols$2h = Object.getOwnPropertySymbols;
var __hasOwnProp$2h = Object.prototype.hasOwnProperty;
var __propIsEnum$2h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2h = (obj, key, value) => key in obj ? __defProp$2h(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2h = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2h.call(b, prop))
      __defNormalProp$2h(a, prop, b[prop]);
  if (__getOwnPropSymbols$2h)
    for (var prop of __getOwnPropSymbols$2h(b)) {
      if (__propIsEnum$2h.call(b, prop))
        __defNormalProp$2h(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1v = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2h.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2h)
    for (var prop of __getOwnPropSymbols$2h(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2h.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$R = {
  spacing: "xs"
};
function ChipGroup(props) {
  const _a = useComponentDefaultProps("ChipGroup", defaultProps$R, props), {
    value,
    defaultValue,
    onChange,
    spacing,
    multiple,
    children,
    unstyled
  } = _a, others = __objRest$1v(_a, ["value", "defaultValue", "onChange", "spacing", "multiple", "children", "unstyled"]);
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
      ...__spreadValues$2h({
        spacing,
        unstyled
      }, others),
      children
    })
  });
}
ChipGroup.displayName = "@mantine/core/ChipGroup";
var __defProp$2g = Object.defineProperty;
var __defProps$14 = Object.defineProperties;
var __getOwnPropDescs$14 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2g = Object.getOwnPropertySymbols;
var __hasOwnProp$2g = Object.prototype.hasOwnProperty;
var __propIsEnum$2g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2g = (obj, key, value) => key in obj ? __defProp$2g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2g = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2g.call(b, prop))
      __defNormalProp$2g(a, prop, b[prop]);
  if (__getOwnPropSymbols$2g)
    for (var prop of __getOwnPropSymbols$2g(b)) {
      if (__propIsEnum$2g.call(b, prop))
        __defNormalProp$2g(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$14 = (a, b) => __defProps$14(a, __getOwnPropDescs$14(b));
const sizes$e = {
  xs: 24,
  sm: 28,
  md: 32,
  lg: 36,
  xl: 40
};
const iconSizes$4 = {
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
var useStyles$24 = createStyles((theme, { radius, size: size2, color }, getRef) => ({
  root: {},
  label: __spreadProps$14(__spreadValues$2g({
    ref: getRef("label")
  }, theme.fn.fontStyles()), {
    boxSizing: "border-box",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    display: "inline-block",
    alignItems: "center",
    userSelect: "none",
    border: "1px solid transparent",
    borderRadius: theme.fn.radius(radius),
    height: theme.fn.size({ size: size2, sizes: sizes$e }),
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    lineHeight: `${theme.fn.size({ size: size2, sizes: sizes$e }) - 2}px`,
    paddingLeft: theme.fn.size({ size: size2, sizes: padding }),
    paddingRight: theme.fn.size({ size: size2, sizes: padding }),
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background-color 100ms ease",
    WebkitTapHighlightColor: "transparent",
    '&[data-variant="filled"]': __spreadValues$2g({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    '&[data-variant="outline"]': __spreadValues$2g({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    "&[data-disabled]": __spreadProps$14(__spreadValues$2g({
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
    width: theme.fn.size({ size: size2, sizes: iconSizes$4 }) + theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5,
    maxWidth: theme.fn.size({ size: size2, sizes: iconSizes$4 }) + theme.fn.size({ size: size2, sizes: theme.spacing }) / 1.5,
    height: theme.fn.size({ size: size2, sizes: iconSizes$4 }),
    display: "inline-block",
    verticalAlign: "middle",
    overflow: "hidden"
  },
  checkIcon: {
    width: theme.fn.size({ size: size2, sizes: iconSizes$4 }),
    height: theme.fn.size({ size: size2, sizes: iconSizes$4 }) / 1.1,
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
const useStyles$25 = useStyles$24;
var __defProp$2f = Object.defineProperty;
var __getOwnPropSymbols$2f = Object.getOwnPropertySymbols;
var __hasOwnProp$2f = Object.prototype.hasOwnProperty;
var __propIsEnum$2f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2f = (obj, key, value) => key in obj ? __defProp$2f(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2f = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2f.call(b, prop))
      __defNormalProp$2f(a, prop, b[prop]);
  if (__getOwnPropSymbols$2f)
    for (var prop of __getOwnPropSymbols$2f(b)) {
      if (__propIsEnum$2f.call(b, prop))
        __defNormalProp$2f(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1u = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2f.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2f)
    for (var prop of __getOwnPropSymbols$2f(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2f.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$Q = {
  type: "checkbox",
  size: "sm",
  radius: "xl",
  variant: "outline"
};
const Chip = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Chip", defaultProps$Q, props), {
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
  } = _a, others = __objRest$1u(_a, ["radius", "type", "size", "variant", "disabled", "id", "color", "children", "className", "classNames", "style", "styles", "checked", "defaultChecked", "onChange", "sx", "wrapperProps", "value", "unstyled"]);
  const ctx = useChipGroup();
  const uuid2 = useId(id);
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const {
    classes,
    cx
  } = useStyles$25({
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
    ...__spreadValues$2f(__spreadValues$2f({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadValues$2f(__spreadValues$2f({
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
var __defProp$2e = Object.defineProperty;
var __defProps$13 = Object.defineProperties;
var __getOwnPropDescs$13 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2e = Object.getOwnPropertySymbols;
var __hasOwnProp$2e = Object.prototype.hasOwnProperty;
var __propIsEnum$2e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2e = (obj, key, value) => key in obj ? __defProp$2e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2e = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2e.call(b, prop))
      __defNormalProp$2e(a, prop, b[prop]);
  if (__getOwnPropSymbols$2e)
    for (var prop of __getOwnPropSymbols$2e(b)) {
      if (__propIsEnum$2e.call(b, prop))
        __defNormalProp$2e(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$13 = (a, b) => __defProps$13(a, __getOwnPropDescs$13(b));
var useStyles$22 = createStyles((theme, { color: _color }) => {
  const color = _color || (theme.colorScheme === "dark" ? "dark" : "gray");
  const colors = theme.fn.variant({ color, variant: "light" });
  return {
    root: __spreadProps$13(__spreadValues$2e({}, theme.fn.fontStyles()), {
      lineHeight: theme.lineHeight,
      padding: `2px ${theme.spacing.xs / 2}px`,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? color === "dark" ? theme.colors.dark[0] : theme.white : theme.colors.dark[7],
      backgroundColor: theme.colorScheme === "dark" && color === "dark" ? theme.colors.dark[5] : colors.background,
      fontFamily: theme.fontFamilyMonospace,
      fontSize: theme.fontSizes.xs
    }),
    block: {
      padding: theme.spacing.xs,
      margin: 0,
      overflowX: "auto"
    }
  };
});
const useStyles$23 = useStyles$22;
var __defProp$2d = Object.defineProperty;
var __getOwnPropSymbols$2d = Object.getOwnPropertySymbols;
var __hasOwnProp$2d = Object.prototype.hasOwnProperty;
var __propIsEnum$2d = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2d = (obj, key, value) => key in obj ? __defProp$2d(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2d = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2d.call(b, prop))
      __defNormalProp$2d(a, prop, b[prop]);
  if (__getOwnPropSymbols$2d)
    for (var prop of __getOwnPropSymbols$2d(b)) {
      if (__propIsEnum$2d.call(b, prop))
        __defNormalProp$2d(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1t = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2d.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2d)
    for (var prop of __getOwnPropSymbols$2d(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2d.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const Code = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Code", {}, props), {
    className,
    children,
    block,
    color,
    unstyled
  } = _a, others = __objRest$1t(_a, ["className", "children", "block", "color", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$23({
    color
  }, {
    name: "Code",
    unstyled
  });
  if (block) {
    return /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$2d({
        component: "pre",
        dir: "ltr",
        className: cx(classes.root, classes.block, className),
        ref
      }, others),
      children
    });
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$2d({
      component: "code",
      className: cx(classes.root, className),
      ref,
      dir: "ltr"
    }, others),
    children
  });
});
Code.displayName = "@mantine/core/Code";
var __defProp$2c = Object.defineProperty;
var __defProps$12 = Object.defineProperties;
var __getOwnPropDescs$12 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2c = Object.getOwnPropertySymbols;
var __hasOwnProp$2c = Object.prototype.hasOwnProperty;
var __propIsEnum$2c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2c = (obj, key, value) => key in obj ? __defProp$2c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2c = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2c.call(b, prop))
      __defNormalProp$2c(a, prop, b[prop]);
  if (__getOwnPropSymbols$2c)
    for (var prop of __getOwnPropSymbols$2c(b)) {
      if (__propIsEnum$2c.call(b, prop))
        __defNormalProp$2c(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$12 = (a, b) => __defProps$12(a, __getOwnPropDescs$12(b));
var useStyles$20 = createStyles((theme, { size: size2, radius }) => {
  const overlayColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    root: __spreadProps$12(__spreadValues$2c({}, theme.fn.focusStyles()), {
      width: size2,
      height: size2,
      WebkitTapHighlightColor: "transparent",
      border: 0,
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      appearance: "none",
      WebkitAppearance: "none",
      padding: 0,
      position: "relative",
      overflow: "hidden"
    }),
    overlay: {
      position: "absolute",
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    children: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center"
    },
    shadowOverlay: {
      boxShadow: "rgba(0, 0, 0, .1) 0px 0px 0px 1px inset, rgb(0, 0, 0, .15) 0px 0px 4px inset",
      zIndex: 1
    },
    alphaOverlay: {
      backgroundImage: `linear-gradient(45deg, ${overlayColor} 25%, transparent 25%), linear-gradient(-45deg, ${overlayColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${overlayColor} 75%), linear-gradient(-45deg, ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white} 75%, ${overlayColor} 75%)`,
      backgroundSize: "8px 8px",
      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px"
    }
  };
});
const useStyles$21 = useStyles$20;
var __defProp$2b = Object.defineProperty;
var __getOwnPropSymbols$2b = Object.getOwnPropertySymbols;
var __hasOwnProp$2b = Object.prototype.hasOwnProperty;
var __propIsEnum$2b = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2b = (obj, key, value) => key in obj ? __defProp$2b(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2b = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2b.call(b, prop))
      __defNormalProp$2b(a, prop, b[prop]);
  if (__getOwnPropSymbols$2b)
    for (var prop of __getOwnPropSymbols$2b(b)) {
      if (__propIsEnum$2b.call(b, prop))
        __defNormalProp$2b(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1s = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2b.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2b)
    for (var prop of __getOwnPropSymbols$2b(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2b.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$P = {
  size: 25,
  radius: 25
};
const _ColorSwatch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorSwatch", defaultProps$P, props), {
    color,
    size: size2,
    radius,
    className,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1s(_a, ["color", "size", "radius", "className", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$21({
    radius,
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: "ColorSwatch"
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$2b({
      className: cx(classes.root, className),
      ref
    }, others),
    children: [/* @__PURE__ */ jsx("div", {
      className: cx(classes.alphaOverlay, classes.overlay)
    }), /* @__PURE__ */ jsx("div", {
      className: cx(classes.shadowOverlay, classes.overlay)
    }), /* @__PURE__ */ jsx("div", {
      className: classes.overlay,
      style: {
        backgroundColor: color
      }
    }), /* @__PURE__ */ jsx("div", {
      className: cx(classes.children, classes.overlay),
      children
    })]
  });
});
_ColorSwatch.displayName = "@mantine/core/ColorSwatch";
const ColorSwatch = createPolymorphicComponent(_ColorSwatch);
const THUMB_SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 22
};
var useStyles$1_ = createStyles((theme, { size: size2 }) => {
  const _size = theme.fn.size({ size: size2, sizes: THUMB_SIZES });
  return {
    thumb: {
      overflow: "hidden",
      boxSizing: "border-box",
      position: "absolute",
      boxShadow: "0 0 1px rgba(0, 0, 0, .6)",
      border: `2px solid ${theme.white}`,
      backgroundColor: "transparent",
      width: _size,
      height: _size,
      borderRadius: _size
    }
  };
});
const useStyles$1$ = useStyles$1_;
var __defProp$2a = Object.defineProperty;
var __getOwnPropSymbols$2a = Object.getOwnPropertySymbols;
var __hasOwnProp$2a = Object.prototype.hasOwnProperty;
var __propIsEnum$2a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2a = (obj, key, value) => key in obj ? __defProp$2a(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2a = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2a.call(b, prop))
      __defNormalProp$2a(a, prop, b[prop]);
  if (__getOwnPropSymbols$2a)
    for (var prop of __getOwnPropSymbols$2a(b)) {
      if (__propIsEnum$2a.call(b, prop))
        __defNormalProp$2a(a, prop, b[prop]);
    }
  return a;
};
function Thumb$1({
  position,
  className,
  styles,
  classNames,
  style,
  size: size2,
  __staticSelector,
  unstyled
}) {
  const {
    classes,
    cx
  } = useStyles$1$({
    size: size2
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  return /* @__PURE__ */ jsx("div", {
    className: cx(classes.thumb, className),
    style: __spreadValues$2a({
      left: `calc(${position.x * 100}% - ${THUMB_SIZES[size2] / 2}px)`,
      top: `calc(${position.y * 100}% - ${THUMB_SIZES[size2] / 2}px)`
    }, style)
  });
}
Thumb$1.displayName = "@mantine/core/Thumb";
var useStyles$1Y = createStyles((theme, { size: size2 }, getRef) => ({
  sliderThumb: {
    ref: getRef("sliderThumb")
  },
  slider: {
    position: "relative",
    height: theme.fn.size({ size: size2, sizes: THUMB_SIZES }) + 2,
    boxSizing: "border-box",
    marginLeft: theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2,
    marginRight: theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2,
    outline: 0,
    [`&:focus .${getRef("sliderThumb")}`]: {
      outline: "none",
      boxShadow: theme.focusRing === "always" || theme.focusRing === "auto" ? `0 0 0 2px ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white}, 0 0 0 4px ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}` : void 0
    },
    [`&:focus:not(:focus-visible) .${getRef("sliderThumb")}`]: {
      boxShadow: theme.focusRing === "auto" || theme.focusRing === "never" ? "none" : void 0
    }
  },
  sliderOverlay: {
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    bottom: 0,
    left: -theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2 - 1,
    right: -theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2 - 1,
    borderRadius: 1e3
  }
}));
const useStyles$1Z = useStyles$1Y;
var __defProp$29 = Object.defineProperty;
var __defProps$11 = Object.defineProperties;
var __getOwnPropDescs$11 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$29 = Object.getOwnPropertySymbols;
var __hasOwnProp$29 = Object.prototype.hasOwnProperty;
var __propIsEnum$29 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$29 = (obj, key, value) => key in obj ? __defProp$29(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$29 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$29.call(b, prop))
      __defNormalProp$29(a, prop, b[prop]);
  if (__getOwnPropSymbols$29)
    for (var prop of __getOwnPropSymbols$29(b)) {
      if (__propIsEnum$29.call(b, prop))
        __defNormalProp$29(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$11 = (a, b) => __defProps$11(a, __getOwnPropDescs$11(b));
var __objRest$1r = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$29.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$29)
    for (var prop of __getOwnPropSymbols$29(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$29.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const ColorSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange,
    maxValue,
    round: round2,
    size: size2 = "md",
    thumbColor = "transparent",
    __staticSelector = "ColorSlider",
    focusable: focusable2 = true,
    overlays,
    classNames,
    styles,
    className,
    unstyled
  } = _b, others = __objRest$1r(_b, ["value", "onChange", "maxValue", "round", "size", "thumbColor", "__staticSelector", "focusable", "overlays", "classNames", "styles", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1Z({
    size: size2
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  const [position, setPosition] = react.exports.useState({
    y: 0,
    x: value / maxValue
  });
  const getChangeValue2 = (val) => round2 ? Math.round(val * maxValue) : val * maxValue;
  const {
    ref: sliderRef
  } = useMove(({
    x
  }) => onChange(getChangeValue2(x)));
  useDidUpdate(() => {
    setPosition({
      y: 0,
      x: value / maxValue
    });
  }, [value]);
  const handleArrow = (event, pos) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    onChange(getChangeValue2(_position.x));
  };
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowRight": {
        handleArrow(event, {
          x: position.x + 0.05,
          y: position.y
        });
        break;
      }
      case "ArrowLeft": {
        handleArrow(event, {
          x: position.x - 0.05,
          y: position.y
        });
        break;
      }
    }
  };
  const layers = overlays.map((overlay, index2) => /* @__PURE__ */ jsx("div", {
    className: classes.sliderOverlay,
    style: overlay
  }, index2));
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadProps$11(__spreadValues$29({}, others), {
      ref: useMergedRef(sliderRef, ref),
      className: cx(classes.slider, className),
      role: "slider",
      "aria-valuenow": value,
      "aria-valuemax": maxValue,
      "aria-valuemin": 0,
      tabIndex: focusable2 ? 0 : -1,
      onKeyDown: handleKeyDown
    }),
    children: [layers, /* @__PURE__ */ jsx(Thumb$1, {
      __staticSelector,
      classNames,
      styles,
      position,
      style: {
        top: 1,
        backgroundColor: thumbColor
      },
      className: classes.sliderThumb,
      size: size2
    })]
  });
});
ColorSlider.displayName = "@mantine/core/ColorSlider";
var __defProp$28 = Object.defineProperty;
var __defProps$10 = Object.defineProperties;
var __getOwnPropDescs$10 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$28 = Object.getOwnPropertySymbols;
var __hasOwnProp$28 = Object.prototype.hasOwnProperty;
var __propIsEnum$28 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$28 = (obj, key, value) => key in obj ? __defProp$28(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$28 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$28.call(b, prop))
      __defNormalProp$28(a, prop, b[prop]);
  if (__getOwnPropSymbols$28)
    for (var prop of __getOwnPropSymbols$28(b)) {
      if (__propIsEnum$28.call(b, prop))
        __defNormalProp$28(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$10 = (a, b) => __defProps$10(a, __getOwnPropDescs$10(b));
var __objRest$1q = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$28.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$28)
    for (var prop of __getOwnPropSymbols$28(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$28.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const HueSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange
  } = _b, others = __objRest$1q(_b, ["value", "onChange"]);
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$10(__spreadValues$28({}, others), {
      ref,
      value,
      onChange,
      maxValue: 360,
      thumbColor: `hsl(${value}, 100%, 50%)`,
      round: true,
      overlays: [{
        backgroundImage: "linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(170,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))"
      }, {
        boxShadow: "rgba(0, 0, 0, .1) 0px 0px 0px 1px inset, rgb(0, 0, 0, .15) 0px 0px 4px inset"
      }]
    })
  });
});
HueSlider.displayName = "@mantine/core/HueSlider";
function round(number, digits = 0, base = 10 ** digits) {
  return Math.round(base * number) / base;
}
function hslaToHsva({ h, s, l, a }) {
  const ss = s * ((l < 50 ? l : 100 - l) / 100);
  return {
    h,
    s: ss > 0 ? 2 * ss / (l + ss) * 100 : 0,
    v: l + ss,
    a
  };
}
const angleUnits = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
};
function parseHue(value, unit = "deg") {
  return Number(value) * (angleUnits[unit] || 1);
}
const HSL_REGEXP = /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
function parseHsla(color) {
  const match = HSL_REGEXP.exec(color);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  return hslaToHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === void 0 ? 1 : Number(match[5]) / (match[6] ? 100 : 1)
  });
}
function rgbaToHsva({ r, g, b, a }) {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  const hh = delta ? max === r ? (g - b) / delta : max === g ? 2 + (b - r) / delta : 4 + (r - g) / delta : 0;
  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh)),
    s: round(max ? delta / max * 100 : 0),
    v: round(max / 255 * 100),
    a
  };
}
function parseHex(color) {
  const hex = color[0] === "#" ? color.slice(1) : color;
  if (hex.length === 3) {
    return rgbaToHsva({
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1
    });
  }
  return rgbaToHsva({
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: 1
  });
}
const RGB_REGEXP = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
function parseRgba(color) {
  const match = RGB_REGEXP.exec(color);
  if (!match) {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  return rgbaToHsva({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === void 0 ? 1 : Number(match[7]) / (match[8] ? 100 : 1)
  });
}
const VALIDATION_REGEXP = {
  hex: /^#?([0-9A-F]{3}){1,2}$/i,
  rgb: /^rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  rgba: /^rgba\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/i,
  hsl: /hsl\(\s*(\d+)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)\)/i,
  hsla: /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/i
};
const CONVERTERS$1 = {
  hex: parseHex,
  rgb: parseRgba,
  rgba: parseRgba,
  hsl: parseHsla,
  hsla: parseHsla
};
function isColorValid(color) {
  for (const [, regexp] of Object.entries(VALIDATION_REGEXP)) {
    if (regexp.test(color)) {
      return true;
    }
  }
  return false;
}
function parseColor(color) {
  if (typeof color !== "string") {
    return { h: 0, s: 0, v: 0, a: 1 };
  }
  if (color === "transparent") {
    return { h: 0, s: 0, v: 0, a: 0 };
  }
  const trimmed = color.trim();
  for (const [rule, regexp] of Object.entries(VALIDATION_REGEXP)) {
    if (regexp.test(trimmed)) {
      return CONVERTERS$1[rule](trimmed);
    }
  }
  return { h: 0, s: 0, v: 0, a: 1 };
}
var __defProp$27 = Object.defineProperty;
var __defProps$$ = Object.defineProperties;
var __getOwnPropDescs$$ = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$27 = Object.getOwnPropertySymbols;
var __hasOwnProp$27 = Object.prototype.hasOwnProperty;
var __propIsEnum$27 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$27 = (obj, key, value) => key in obj ? __defProp$27(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$27 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$27.call(b, prop))
      __defNormalProp$27(a, prop, b[prop]);
  if (__getOwnPropSymbols$27)
    for (var prop of __getOwnPropSymbols$27(b)) {
      if (__propIsEnum$27.call(b, prop))
        __defNormalProp$27(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$$ = (a, b) => __defProps$$(a, __getOwnPropDescs$$(b));
var __objRest$1p = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$27.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$27)
    for (var prop of __getOwnPropSymbols$27(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$27.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AlphaSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange,
    color
  } = _b, others = __objRest$1p(_b, ["value", "onChange", "color"]);
  const theme = useMantineTheme();
  const _color = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$$(__spreadValues$27({}, others), {
      ref,
      value,
      onChange: (val) => onChange(round(val, 2)),
      maxValue: 1,
      round: false,
      overlays: [{
        backgroundImage: `linear-gradient(45deg, ${_color} 25%, transparent 25%), linear-gradient(-45deg, ${_color} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${_color} 75%), linear-gradient(-45deg, ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white} 75%, ${_color} 75%)`,
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px"
      }, {
        backgroundImage: `linear-gradient(90deg, transparent, ${color})`
      }, {
        boxShadow: "rgba(0, 0, 0, .1) 0px 0px 0px 1px inset, rgb(0, 0, 0, .15) 0px 0px 4px inset"
      }]
    })
  });
});
AlphaSlider.displayName = "@mantine/core/AlphaSlider";
var __defProp$26 = Object.defineProperty;
var __getOwnPropSymbols$26 = Object.getOwnPropertySymbols;
var __hasOwnProp$26 = Object.prototype.hasOwnProperty;
var __propIsEnum$26 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$26 = (obj, key, value) => key in obj ? __defProp$26(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$26 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$26.call(b, prop))
      __defNormalProp$26(a, prop, b[prop]);
  if (__getOwnPropSymbols$26)
    for (var prop of __getOwnPropSymbols$26(b)) {
      if (__propIsEnum$26.call(b, prop))
        __defNormalProp$26(a, prop, b[prop]);
    }
  return a;
};
const SATURATION_HEIGHTS = {
  xs: 100,
  sm: 110,
  md: 120,
  lg: 140,
  xl: 160
};
var useStyles$1W = createStyles((theme, { size: size2 }, getRef) => ({
  saturationThumb: {
    ref: getRef("saturationThumb")
  },
  saturation: {
    boxSizing: "border-box",
    position: "relative",
    height: theme.fn.size({ size: size2, sizes: SATURATION_HEIGHTS }),
    borderRadius: theme.radius.sm,
    margin: theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2,
    WebkitTapHighlightColor: "transparent",
    [`&:focus .${getRef("saturationThumb")}`]: {
      outline: "none",
      boxShadow: `0 0 0 1px ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white}, 0 0 0 3px ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}`
    },
    [`&:focus:not(:focus-visible) .${getRef("saturationThumb")}`]: {
      boxShadow: theme.focusRing === "auto" || theme.focusRing === "never" ? "none" : void 0
    }
  },
  saturationOverlay: __spreadValues$26({
    boxSizing: "border-box",
    borderRadius: theme.radius.sm
  }, theme.fn.cover(-theme.fn.size({ size: size2, sizes: THUMB_SIZES }) / 2 - 1))
}));
const useStyles$1X = useStyles$1W;
function hsvaToRgbaObject({ h, s, v, a }) {
  const _h = h / 360 * 6;
  const _s = s / 100;
  const _v = v / 100;
  const hh = Math.floor(_h);
  const l = _v * (1 - _s);
  const c = _v * (1 - (_h - hh) * _s);
  const d = _v * (1 - (1 - _h + hh) * _s);
  const module = hh % 6;
  return {
    r: round([_v, c, l, l, d, _v][module] * 255),
    g: round([d, _v, _v, c, l, l][module] * 255),
    b: round([l, l, d, _v, _v, c][module] * 255),
    a: round(a, 2)
  };
}
function hsvaToRgba(color, includeAlpha) {
  const { r, g, b, a } = hsvaToRgbaObject(color);
  if (!includeAlpha) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${round(a, 2)})`;
}
function hsvaToHsl({ h, s, v, a }, includeAlpha) {
  const hh = (200 - s) * v / 100;
  const result = {
    h: Math.round(h),
    s: Math.round(hh > 0 && hh < 200 ? s * v / 100 / (hh <= 100 ? hh : 200 - hh) * 100 : 0),
    l: Math.round(hh / 2)
  };
  if (!includeAlpha) {
    return `hsl(${result.h}, ${result.s}%, ${result.l}%)`;
  }
  return `hsla(${result.h}, ${result.s}%, ${result.l}%, ${round(a, 2)})`;
}
function formatHexPart(number) {
  const hex = number.toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
}
function hsvaToHex(color) {
  const { r, g, b } = hsvaToRgbaObject(color);
  return `#${formatHexPart(r)}${formatHexPart(g)}${formatHexPart(b)}`;
}
const CONVERTERS = {
  hex: hsvaToHex,
  rgb: (color) => hsvaToRgba(color, false),
  rgba: (color) => hsvaToRgba(color, true),
  hsl: (color) => hsvaToHsl(color, false),
  hsla: (color) => hsvaToHsl(color, true)
};
function convertHsvaTo(format, color) {
  if (!color) {
    return "#000000";
  }
  if (!(format in CONVERTERS)) {
    return CONVERTERS.hex(color);
  }
  return CONVERTERS[format](color);
}
function Saturation({
  value,
  onChange,
  focusable: focusable2 = true,
  __staticSelector = "saturation",
  size: size2,
  color,
  saturationLabel,
  classNames,
  styles,
  unstyled
}) {
  const {
    classes
  } = useStyles$1X({
    size: size2
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  const [position, setPosition] = react.exports.useState({
    x: value.s / 100,
    y: 1 - value.v / 100
  });
  const {
    ref
  } = useMove(({
    x,
    y
  }) => {
    onChange({
      s: Math.round(x * 100),
      v: Math.round((1 - y) * 100)
    });
  });
  react.exports.useEffect(() => {
    setPosition({
      x: value.s / 100,
      y: 1 - value.v / 100
    });
  }, [value.s, value.v]);
  const handleArrow = (event, pos) => {
    event.preventDefault();
    const _position = clampUseMovePosition(pos);
    onChange({
      s: Math.round(_position.x * 100),
      v: Math.round((1 - _position.y) * 100)
    });
  };
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp": {
        handleArrow(event, {
          y: position.y - 0.05,
          x: position.x
        });
        break;
      }
      case "ArrowDown": {
        handleArrow(event, {
          y: position.y + 0.05,
          x: position.x
        });
        break;
      }
      case "ArrowRight": {
        handleArrow(event, {
          x: position.x + 0.05,
          y: position.y
        });
        break;
      }
      case "ArrowLeft": {
        handleArrow(event, {
          x: position.x - 0.05,
          y: position.y
        });
        break;
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: classes.saturation,
    ref,
    role: "slider",
    "aria-label": saturationLabel,
    "aria-valuenow": position.x,
    "aria-valuetext": convertHsvaTo("rgba", value),
    tabIndex: focusable2 ? 0 : -1,
    onKeyDown: handleKeyDown,
    children: [/* @__PURE__ */ jsx("div", {
      className: classes.saturationOverlay,
      style: {
        backgroundColor: `hsl(${value.h}, 100%, 50%)`
      }
    }), /* @__PURE__ */ jsx("div", {
      className: classes.saturationOverlay,
      style: {
        backgroundImage: "linear-gradient(90deg, #fff, transparent)"
      }
    }), /* @__PURE__ */ jsx("div", {
      className: classes.saturationOverlay,
      style: {
        backgroundImage: "linear-gradient(0deg, #000, transparent)"
      }
    }), /* @__PURE__ */ jsx(Thumb$1, {
      __staticSelector,
      classNames,
      styles,
      position,
      className: classes.saturationThumb,
      style: {
        backgroundColor: color
      },
      size: size2
    })]
  });
}
Saturation.displayName = "@mantine/core/Saturation";
var useStyles$1U = createStyles((_theme, { swatchesPerRow }) => ({
  swatch: {
    width: `calc(${100 / swatchesPerRow}% - 4px)`,
    height: 0,
    paddingBottom: `calc(${100 / swatchesPerRow}% - 4px)`,
    margin: 2,
    boxSizing: "content-box"
  },
  swatches: {
    boxSizing: "border-box",
    marginLeft: -2,
    marginRight: -2,
    display: "flex",
    flexWrap: "wrap"
  }
}));
const useStyles$1V = useStyles$1U;
var __defProp$25 = Object.defineProperty;
var __getOwnPropSymbols$25 = Object.getOwnPropertySymbols;
var __hasOwnProp$25 = Object.prototype.hasOwnProperty;
var __propIsEnum$25 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$25 = (obj, key, value) => key in obj ? __defProp$25(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$25 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$25.call(b, prop))
      __defNormalProp$25(a, prop, b[prop]);
  if (__getOwnPropSymbols$25)
    for (var prop of __getOwnPropSymbols$25(b)) {
      if (__propIsEnum$25.call(b, prop))
        __defNormalProp$25(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1o = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$25.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$25)
    for (var prop of __getOwnPropSymbols$25(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$25.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function Swatches(_a) {
  var _b = _a, {
    data,
    swatchesPerRow = 10,
    focusable: focusable2 = true,
    classNames,
    styles,
    __staticSelector = "color-picker",
    unstyled,
    setValue
  } = _b, others = __objRest$1o(_b, ["data", "swatchesPerRow", "focusable", "classNames", "styles", "__staticSelector", "unstyled", "setValue"]);
  const {
    classes
  } = useStyles$1V({
    swatchesPerRow
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  const colors = data.map((color, index2) => /* @__PURE__ */ jsx(ColorSwatch, {
    className: classes.swatch,
    component: "button",
    type: "button",
    color,
    radius: "sm",
    onClick: () => setValue(color),
    style: {
      cursor: "pointer"
    },
    "aria-label": color,
    tabIndex: focusable2 ? 0 : -1
  }, index2));
  return /* @__PURE__ */ jsx("div", {
    ...__spreadValues$25({
      className: classes.swatches
    }, others),
    children: colors
  });
}
Swatches.displayName = "@mantine/core/Swatches";
const sizes$d = {
  xs: 180,
  sm: 200,
  md: 240,
  lg: 280,
  xl: 320
};
var useStyles$1T = createStyles((theme, { size: size2, fullWidth }) => ({
  preview: {},
  wrapper: {
    boxSizing: "border-box",
    width: fullWidth ? "100%" : theme.fn.size({ size: size2, sizes: sizes$d }),
    padding: 1
  },
  body: {
    display: "flex",
    boxSizing: "border-box",
    paddingTop: theme.fn.size({ size: size2, sizes: theme.spacing }) / 2
  },
  sliders: {
    flex: 1,
    boxSizing: "border-box",
    "&:not(:only-child)": {
      marginRight: theme.spacing.xs
    }
  },
  slider: {
    boxSizing: "border-box",
    "& + &": {
      marginTop: 5
    }
  },
  swatch: {
    cursor: "pointer"
  }
}));
var __defProp$24 = Object.defineProperty;
var __getOwnPropSymbols$24 = Object.getOwnPropertySymbols;
var __hasOwnProp$24 = Object.prototype.hasOwnProperty;
var __propIsEnum$24 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$24 = (obj, key, value) => key in obj ? __defProp$24(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$24 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$24.call(b, prop))
      __defNormalProp$24(a, prop, b[prop]);
  if (__getOwnPropSymbols$24)
    for (var prop of __getOwnPropSymbols$24(b)) {
      if (__propIsEnum$24.call(b, prop))
        __defNormalProp$24(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1n = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$24.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$24)
    for (var prop of __getOwnPropSymbols$24(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$24.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SWATCH_SIZES$1 = {
  xs: 26,
  sm: 34,
  md: 42,
  lg: 50,
  xl: 54
};
const defaultProps$O = {
  swatchesPerRow: 10,
  size: "sm",
  withPicker: true,
  focusable: true,
  __staticSelector: "ColorPicker"
};
const ColorPicker = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorPicker", defaultProps$O, props), {
    value,
    defaultValue,
    onChange,
    format,
    swatches,
    swatchesPerRow,
    size: size2,
    withPicker,
    fullWidth,
    focusable: focusable2,
    __staticSelector,
    saturationLabel,
    hueLabel,
    alphaLabel,
    className,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$1n(_a, ["value", "defaultValue", "onChange", "format", "swatches", "swatchesPerRow", "size", "withPicker", "fullWidth", "focusable", "__staticSelector", "saturationLabel", "hueLabel", "alphaLabel", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1T({
    size: size2,
    fullWidth
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  const formatRef = react.exports.useRef(format);
  const valueRef = react.exports.useRef(null);
  const updateRef3 = react.exports.useRef(true);
  const withAlpha = format === "rgba" || format === "hsla";
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "#FFFFFF",
    onChange
  });
  const [parsed, setParsed] = react.exports.useState(parseColor(_value));
  const handleChange = (color) => {
    updateRef3.current = false;
    setParsed((current) => {
      const next = __spreadValues$24(__spreadValues$24({}, current), color);
      valueRef.current = convertHsvaTo(formatRef.current, next);
      return next;
    });
    setValue(valueRef.current);
    setTimeout(() => {
      updateRef3.current = true;
    }, 0);
  };
  useDidUpdate(() => {
    if (isColorValid(value) && updateRef3.current) {
      setParsed(parseColor(value));
      updateRef3.current = true;
    }
  }, [value]);
  useDidUpdate(() => {
    formatRef.current = format;
    setValue(convertHsvaTo(format, parsed));
  }, [format]);
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$24({
      className: cx(classes.wrapper, className),
      ref
    }, others),
    children: [withPicker && /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(Saturation, {
        value: parsed,
        onChange: handleChange,
        color: _value,
        styles,
        classNames,
        size: size2,
        focusable: focusable2,
        saturationLabel,
        __staticSelector
      }), /* @__PURE__ */ jsxs("div", {
        className: classes.body,
        children: [/* @__PURE__ */ jsxs("div", {
          className: classes.sliders,
          children: [/* @__PURE__ */ jsx(HueSlider, {
            value: parsed.h,
            onChange: (h) => handleChange({
              h
            }),
            size: size2,
            styles,
            classNames,
            focusable: focusable2,
            "aria-label": hueLabel,
            __staticSelector
          }), withAlpha && /* @__PURE__ */ jsx(AlphaSlider, {
            value: parsed.a,
            onChange: (a) => handleChange({
              a
            }),
            size: size2,
            color: convertHsvaTo("hex", parsed),
            style: {
              marginTop: 6
            },
            styles,
            classNames,
            focusable: focusable2,
            "aria-label": alphaLabel,
            __staticSelector
          })]
        }), withAlpha && /* @__PURE__ */ jsx(ColorSwatch, {
          color: _value,
          radius: "sm",
          size: theme.fn.size({
            size: size2,
            sizes: SWATCH_SIZES$1
          }),
          className: classes.preview
        })]
      })]
    }), Array.isArray(swatches) && /* @__PURE__ */ jsx(Swatches, {
      data: swatches,
      style: {
        marginTop: 5
      },
      swatchesPerRow,
      focusable: focusable2,
      classNames,
      styles,
      __staticSelector,
      setValue
    })]
  });
});
ColorPicker.displayName = "@mantine/core/ColorPicker";
var __defProp$23 = Object.defineProperty;
var __defProps$_ = Object.defineProperties;
var __getOwnPropDescs$_ = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$23 = Object.getOwnPropertySymbols;
var __hasOwnProp$23 = Object.prototype.hasOwnProperty;
var __propIsEnum$23 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$23 = (obj, key, value) => key in obj ? __defProp$23(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$23 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$23.call(b, prop))
      __defNormalProp$23(a, prop, b[prop]);
  if (__getOwnPropSymbols$23)
    for (var prop of __getOwnPropSymbols$23(b)) {
      if (__propIsEnum$23.call(b, prop))
        __defNormalProp$23(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$_ = (a, b) => __defProps$_(a, __getOwnPropDescs$_(b));
var __objRest$1m = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$23.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$23)
    for (var prop of __getOwnPropSymbols$23(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$23.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SWATCH_SIZES = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36
};
const defaultProps$N = {
  size: "sm",
  format: "hex",
  fixOnBlur: true,
  withPreview: true,
  swatchesPerRow: 10,
  withPicker: true,
  transition: "pop-top-left",
  dropdownZIndex: getDefaultZIndex("popover"),
  transitionDuration: 0,
  withinPortal: true,
  shadow: "md"
};
const ColorInput = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("ColorInput", defaultProps$N, props), {
    wrapperProps,
    inputProps,
    format,
    onChange,
    onFocus,
    onBlur,
    value,
    defaultValue,
    disallowInput,
    fixOnBlur,
    withPreview,
    swatchesPerRow,
    withPicker,
    icon,
    transition,
    dropdownZIndex,
    transitionDuration,
    transitionTimingFunction,
    withinPortal,
    swatches,
    shadow,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1m(_a, ["wrapperProps", "inputProps", "format", "onChange", "onFocus", "onBlur", "value", "defaultValue", "disallowInput", "fixOnBlur", "withPreview", "swatchesPerRow", "withPicker", "icon", "transition", "dropdownZIndex", "transitionDuration", "transitionTimingFunction", "withinPortal", "swatches", "shadow", "classNames", "styles", "unstyled"]);
  const theme = useMantineTheme();
  const [dropdownOpened, setDropdownOpened] = react.exports.useState(false);
  const [lastValidValue, setLastValidValue] = react.exports.useState("");
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    setDropdownOpened(true);
  };
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    setDropdownOpened(false);
    fixOnBlur && setValue(lastValidValue);
  };
  react.exports.useEffect(() => {
    if (isColorValid(_value) || _value.trim() === "") {
      setLastValidValue(_value);
    }
  }, [_value]);
  useDidUpdate(() => {
    if (isColorValid(_value)) {
      setValue(convertHsvaTo(format, parseColor(_value)));
    }
  }, [format]);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$_(__spreadValues$23({}, wrapperProps), {
      __staticSelector: "ColorInput"
    }),
    children: /* @__PURE__ */ jsxs(Popover, {
      __staticSelector: "ColorInput",
      position: "bottom-start",
      offset: 5,
      zIndex: dropdownZIndex,
      withinPortal,
      transitionDuration,
      transition,
      opened: dropdownOpened,
      shadow,
      classNames,
      styles,
      unstyled,
      children: [/* @__PURE__ */ jsx(Popover.Target, {
        children: /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(Input, {
            ...__spreadProps$_(__spreadValues$23(__spreadValues$23({}, others), inputProps), {
              ref,
              __staticSelector: "ColorInput",
              onFocus: handleInputFocus,
              onBlur: handleInputBlur,
              spellCheck: false,
              value: _value,
              onChange: (event) => setValue(event.currentTarget.value),
              autoComplete: "nope",
              icon: icon || (withPreview ? /* @__PURE__ */ jsx(ColorSwatch, {
                color: isColorValid(_value) ? _value : "#fff",
                size: theme.fn.size({
                  size: inputProps.size,
                  sizes: SWATCH_SIZES
                })
              }) : null),
              readOnly: disallowInput,
              sx: {
                cursor: disallowInput ? "pointer" : void 0
              },
              unstyled,
              classNames,
              styles
            })
          })
        })
      }), /* @__PURE__ */ jsx(Popover.Dropdown, {
        onMouseDown: (event) => event.preventDefault(),
        p: inputProps.size,
        children: /* @__PURE__ */ jsx(ColorPicker, {
          __staticSelector: "ColorInput",
          value: _value,
          onChange: setValue,
          format,
          swatches,
          swatchesPerRow,
          withPicker,
          size: inputProps.size,
          focusable: false,
          unstyled,
          styles,
          classNames
        })
      })]
    })
  });
});
ColorInput.displayName = "@mantine/core/ColorInput";
var __defProp$22 = Object.defineProperty;
var __getOwnPropSymbols$22 = Object.getOwnPropertySymbols;
var __hasOwnProp$22 = Object.prototype.hasOwnProperty;
var __propIsEnum$22 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$22 = (obj, key, value) => key in obj ? __defProp$22(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$22 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$22.call(b, prop))
      __defNormalProp$22(a, prop, b[prop]);
  if (__getOwnPropSymbols$22)
    for (var prop of __getOwnPropSymbols$22(b)) {
      if (__propIsEnum$22.call(b, prop))
        __defNormalProp$22(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1l = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$22.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$22)
    for (var prop of __getOwnPropSymbols$22(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$22.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$M = {
  timeout: 1e3
};
function CopyButton(props) {
  const _a = useComponentDefaultProps("CopyButton", defaultProps$M, props), {
    children,
    timeout,
    value
  } = _a, others = __objRest$1l(_a, ["children", "timeout", "value"]);
  const clipboard = useClipboard({
    timeout
  });
  const copy = () => clipboard.copy(value);
  return /* @__PURE__ */ jsx(Fragment, {
    children: children(__spreadValues$22({
      copy,
      copied: clipboard.copied
    }, others))
  });
}
CopyButton.displayName = "@mantine/core/CopyButton";
var __defProp$21 = Object.defineProperty;
var __defProps$Z = Object.defineProperties;
var __getOwnPropDescs$Z = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$21 = Object.getOwnPropertySymbols;
var __hasOwnProp$21 = Object.prototype.hasOwnProperty;
var __propIsEnum$21 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$21 = (obj, key, value) => key in obj ? __defProp$21(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$21 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$21.call(b, prop))
      __defNormalProp$21(a, prop, b[prop]);
  if (__getOwnPropSymbols$21)
    for (var prop of __getOwnPropSymbols$21(b)) {
      if (__propIsEnum$21.call(b, prop))
        __defNormalProp$21(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$Z = (a, b) => __defProps$Z(a, __getOwnPropDescs$Z(b));
const sizes$c = {
  xs: 160,
  sm: 200,
  md: 340,
  lg: 400,
  xl: 500
};
var useStyles$1R = createStyles((theme, { size: size2 }) => ({
  root: __spreadProps$Z(__spreadValues$21({}, theme.fn.fontStyles()), {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    position: "relative",
    width: theme.fn.size({ size: size2, sizes: sizes$c }),
    maxWidth: "100%",
    minHeight: 50
  }),
  closeButton: {
    position: "absolute",
    top: theme.spacing.md / 2,
    right: theme.spacing.md / 2
  }
}));
const useStyles$1S = useStyles$1R;
var __defProp$20 = Object.defineProperty;
var __getOwnPropSymbols$20 = Object.getOwnPropertySymbols;
var __hasOwnProp$20 = Object.prototype.hasOwnProperty;
var __propIsEnum$20 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$20 = (obj, key, value) => key in obj ? __defProp$20(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$20 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$20.call(b, prop))
      __defNormalProp$20(a, prop, b[prop]);
  if (__getOwnPropSymbols$20)
    for (var prop of __getOwnPropSymbols$20(b)) {
      if (__propIsEnum$20.call(b, prop))
        __defNormalProp$20(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1k = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$20.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$20)
    for (var prop of __getOwnPropSymbols$20(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$20.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$L = {
  shadow: "md",
  p: "md",
  withBorder: true,
  size: "md",
  transition: "pop-top-right",
  transitionDuration: 200
};
function DialogBody(props) {
  const _a = useComponentDefaultProps("Dialog", defaultProps$L, props), {
    withCloseButton,
    onClose,
    position,
    shadow,
    children,
    className,
    style,
    classNames,
    styles,
    opened,
    withBorder,
    size: size2,
    transition,
    transitionDuration,
    transitionTimingFunction,
    unstyled
  } = _a, others = __objRest$1k(_a, ["withCloseButton", "onClose", "position", "shadow", "children", "className", "style", "classNames", "styles", "opened", "withBorder", "size", "transition", "transitionDuration", "transitionTimingFunction", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1S({
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: "Dialog"
  });
  return /* @__PURE__ */ jsx(Transition$2, {
    mounted: opened,
    transition,
    duration: transitionDuration,
    timingFunction: transitionTimingFunction,
    children: (transitionStyles) => /* @__PURE__ */ jsxs(Paper, {
      ...__spreadValues$20({
        className: cx(classes.root, className),
        style: __spreadValues$20(__spreadValues$20({}, style), transitionStyles),
        shadow,
        withBorder,
        unstyled
      }, others),
      children: [withCloseButton && /* @__PURE__ */ jsx(CloseButton, {
        onClick: onClose,
        className: classes.closeButton
      }), children]
    })
  });
}
const Dialog = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    zIndex = getDefaultZIndex("modal")
  } = _b, props = __objRest$1k(_b, ["zIndex"]);
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Affix, {
    zIndex,
    position: props.position || {
      bottom: theme.spacing.xl,
      right: theme.spacing.xl
    },
    ref,
    children: /* @__PURE__ */ jsx(DialogBody, {
      ...__spreadValues$20({}, props)
    })
  });
});
Dialog.displayName = "@mantine/core/Dialog";
var __defProp$1$ = Object.defineProperty;
var __defProps$Y = Object.defineProperties;
var __getOwnPropDescs$Y = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1$ = Object.getOwnPropertySymbols;
var __hasOwnProp$1$ = Object.prototype.hasOwnProperty;
var __propIsEnum$1$ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1$ = (obj, key, value) => key in obj ? __defProp$1$(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1$ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1$.call(b, prop))
      __defNormalProp$1$(a, prop, b[prop]);
  if (__getOwnPropSymbols$1$)
    for (var prop of __getOwnPropSymbols$1$(b)) {
      if (__propIsEnum$1$.call(b, prop))
        __defNormalProp$1$(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$Y = (a, b) => __defProps$Y(a, __getOwnPropDescs$Y(b));
const sizes$b = {
  xs: 180,
  sm: 240,
  md: 320,
  lg: 360,
  xl: 500,
  full: "100%"
};
function getPositionStyles$2({
  position,
  size: size2,
  theme
}) {
  switch (position) {
    case "top":
      return { top: 0, left: 0, right: 0, height: theme.fn.size({ size: size2, sizes: sizes$b }) };
    case "bottom":
      return { bottom: 0, left: 0, right: 0, height: theme.fn.size({ size: size2, sizes: sizes$b }) };
    case "right":
      return { bottom: 0, top: 0, right: 0, width: theme.fn.size({ size: size2, sizes: sizes$b }) };
    case "left":
      return { bottom: 0, top: 0, left: 0, width: theme.fn.size({ size: size2, sizes: sizes$b }) };
    default:
      return null;
  }
}
var useStyles$1P = createStyles((theme, { position, size: size2, zIndex }) => ({
  closeButton: {},
  overlay: {},
  root: {
    position: "fixed",
    zIndex,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  drawer: __spreadProps$Y(__spreadValues$1$({}, getPositionStyles$2({ position, size: size2, theme })), {
    maxWidth: "100%",
    maxHeight: "100vh",
    position: "fixed",
    outline: 0,
    zIndex: 1
  }),
  title: {
    marginRight: theme.spacing.md,
    textOverflow: "ellipsis",
    display: "block",
    wordBreak: "break-word"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md
  }
}));
const useStyles$1Q = useStyles$1P;
function GroupedTransition({
  transitions: transitions2,
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
  const transitionsStyles = Object.keys(transitions2).reduce((acc, transition) => {
    acc[transition] = getTransitionStyles({
      duration: transitions2[transition].duration,
      transition: transitions2[transition].transition,
      timingFunction: transitions2[transition].timingFunction || transitionTimingFunction,
      state: transitionStatus
    });
    return acc;
  }, {});
  return /* @__PURE__ */ jsx(Fragment, {
    children: children(transitionsStyles)
  });
}
GroupedTransition.displayName = "@mantine/core/GroupedTransition";
var __defProp$1_ = Object.defineProperty;
var __getOwnPropSymbols$1_ = Object.getOwnPropertySymbols;
var __hasOwnProp$1_ = Object.prototype.hasOwnProperty;
var __propIsEnum$1_ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1_ = (obj, key, value) => key in obj ? __defProp$1_(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1_ = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1_.call(b, prop))
      __defNormalProp$1_(a, prop, b[prop]);
  if (__getOwnPropSymbols$1_)
    for (var prop of __getOwnPropSymbols$1_(b)) {
      if (__propIsEnum$1_.call(b, prop))
        __defNormalProp$1_(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1j = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1_.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1_)
    for (var prop of __getOwnPropSymbols$1_(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1_.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const transitions = {
  top: "slide-down",
  bottom: "slide-up",
  left: "slide-right",
  right: "slide-left"
};
const rtlTransitions = {
  top: "slide-down",
  bottom: "slide-up",
  right: "slide-right",
  left: "slide-left"
};
const defaultProps$K = {
  position: "left",
  size: "md",
  transitionDuration: 250,
  transitionTimingFunction: "ease",
  zIndex: getDefaultZIndex("modal"),
  shadow: "md",
  padding: 0,
  lockScroll: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  withOverlay: true,
  withCloseButton: true,
  withinPortal: true,
  withFocusReturn: true,
  overlayBlur: 0
};
function Drawer(props) {
  const _a = useComponentDefaultProps("Drawer", defaultProps$K, props), {
    className,
    opened,
    onClose,
    position,
    size: size2,
    trapFocus,
    lockScroll,
    closeOnClickOutside,
    closeOnEscape: closeOnEscape2,
    transition,
    transitionDuration,
    transitionTimingFunction,
    zIndex,
    overlayColor,
    overlayOpacity,
    children,
    withOverlay,
    shadow,
    padding: padding2,
    title,
    withCloseButton,
    closeButtonLabel,
    classNames,
    styles,
    target,
    withinPortal,
    overlayBlur,
    unstyled,
    withFocusReturn
  } = _a, others = __objRest$1j(_a, ["className", "opened", "onClose", "position", "size", "trapFocus", "lockScroll", "closeOnClickOutside", "closeOnEscape", "transition", "transitionDuration", "transitionTimingFunction", "zIndex", "overlayColor", "overlayOpacity", "children", "withOverlay", "shadow", "padding", "title", "withCloseButton", "closeButtonLabel", "classNames", "styles", "target", "withinPortal", "overlayBlur", "unstyled", "withFocusReturn"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1Q({
    size: size2,
    position,
    zIndex
  }, {
    classNames,
    styles,
    unstyled,
    name: "Drawer"
  });
  const focusTrapRef = useFocusTrap(trapFocus && opened);
  const [, _lockScroll] = useScrollLock();
  const drawerTransition = transition || (theme.dir === "rtl" ? rtlTransitions : transitions)[position];
  const _overlayOpacity = typeof overlayOpacity === "number" ? overlayOpacity : theme.colorScheme === "dark" ? 0.85 : 0.75;
  const _closeOnEscape = (event) => {
    if (event.key === "Escape" && closeOnEscape2) {
      onClose();
    }
  };
  react.exports.useEffect(() => {
    if (!trapFocus) {
      window.addEventListener("keydown", _closeOnEscape);
      return () => window.removeEventListener("keydown", _closeOnEscape);
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
      onExited: () => _lockScroll(false),
      onEntered: () => _lockScroll(lockScroll && true),
      mounted: opened,
      timingFunction: transitionTimingFunction,
      transitions: {
        overlay: {
          duration: transitionDuration / 2,
          transition: "fade",
          timingFunction: "ease"
        },
        drawer: {
          duration: transitionDuration,
          transition: drawerTransition,
          timingFunction: transitionTimingFunction
        }
      },
      children: (transitionStyles) => /* @__PURE__ */ jsxs(Box, {
        ...__spreadValues$1_({
          className: cx(classes.root, className),
          role: "dialog",
          "aria-modal": true
        }, others),
        children: [/* @__PURE__ */ jsxs(Paper, {
          className: cx(classes.drawer, className),
          ref: focusTrapRef,
          style: transitionStyles.drawer,
          radius: 0,
          tabIndex: -1,
          onKeyDownCapture: (event) => {
            var _a2;
            const shouldTrigger = ((_a2 = event.target) == null ? void 0 : _a2.getAttribute("data-mantine-stop-propagation")) !== "true";
            shouldTrigger && event.key === "Escape" && closeOnEscape2 && onClose();
          },
          shadow,
          p: padding2,
          unstyled,
          children: [(title || withCloseButton) && /* @__PURE__ */ jsxs("div", {
            className: classes.header,
            children: [/* @__PURE__ */ jsx(Text, {
              className: classes.title,
              unstyled,
              children: title
            }), withCloseButton && /* @__PURE__ */ jsx(CloseButton, {
              iconSize: 16,
              onClick: onClose,
              "aria-label": closeButtonLabel,
              className: classes.closeButton,
              unstyled
            })]
          }), children]
        }), withOverlay && /* @__PURE__ */ jsx("div", {
          style: transitionStyles.overlay,
          children: /* @__PURE__ */ jsx(Overlay, {
            unstyled,
            blur: overlayBlur,
            onMouseDown: () => closeOnClickOutside && onClose(),
            className: classes.overlay,
            opacity: _overlayOpacity,
            zIndex: 0,
            color: overlayColor || (theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.black)
          })
        })]
      })
    })
  });
}
Drawer.displayName = "@mantine/core/Drawer";
var __defProp$1Z = Object.defineProperty;
var __getOwnPropSymbols$1Z = Object.getOwnPropertySymbols;
var __hasOwnProp$1Z = Object.prototype.hasOwnProperty;
var __propIsEnum$1Z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1Z = (obj, key, value) => key in obj ? __defProp$1Z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1Z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1Z.call(b, prop))
      __defNormalProp$1Z(a, prop, b[prop]);
  if (__getOwnPropSymbols$1Z)
    for (var prop of __getOwnPropSymbols$1Z(b)) {
      if (__propIsEnum$1Z.call(b, prop))
        __defNormalProp$1Z(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1i = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1Z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1Z)
    for (var prop of __getOwnPropSymbols$1Z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1Z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$J = {
  multiple: false
};
const FileButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("FileButton", defaultProps$J, props), {
    onChange,
    children,
    multiple,
    accept,
    name,
    form,
    resetRef
  } = _a, others = __objRest$1i(_a, ["onChange", "children", "multiple", "accept", "name", "form", "resetRef"]);
  const inputRef = react.exports.useRef();
  const onClick = () => {
    inputRef.current.click();
  };
  const handleChange = (event) => {
    if (multiple) {
      onChange(Array.from(event.currentTarget.files));
    } else {
      onChange(event.currentTarget.files[0] || null);
    }
  };
  const reset = () => {
    inputRef.current.value = "";
  };
  assignRef(resetRef, reset);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [children(__spreadValues$1Z({
      onClick
    }, others)), /* @__PURE__ */ jsx("input", {
      style: {
        display: "none"
      },
      type: "file",
      accept,
      multiple,
      onChange: handleChange,
      ref: useMergedRef(ref, inputRef),
      name,
      form
    })]
  });
});
FileButton.displayName = "@mantine/core/FileButton";
var useStyles$1N = createStyles((theme) => ({
  placeholder: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  },
  input: {
    cursor: "pointer"
  }
}));
const useStyles$1O = useStyles$1N;
var __defProp$1Y = Object.defineProperty;
var __defProps$X = Object.defineProperties;
var __getOwnPropDescs$X = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1Y = Object.getOwnPropertySymbols;
var __hasOwnProp$1Y = Object.prototype.hasOwnProperty;
var __propIsEnum$1Y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1Y = (obj, key, value) => key in obj ? __defProp$1Y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1Y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1Y.call(b, prop))
      __defNormalProp$1Y(a, prop, b[prop]);
  if (__getOwnPropSymbols$1Y)
    for (var prop of __getOwnPropSymbols$1Y(b)) {
      if (__propIsEnum$1Y.call(b, prop))
        __defNormalProp$1Y(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$X = (a, b) => __defProps$X(a, __getOwnPropDescs$X(b));
var __objRest$1h = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1Y.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1Y)
    for (var prop of __getOwnPropSymbols$1Y(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1Y.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const DefaultValue$1 = ({
  value
}) => /* @__PURE__ */ jsx("span", {
  children: Array.isArray(value) ? value.map((file) => file.name).join(", ") : value == null ? void 0 : value.name
});
const defaultProps$I = {
  size: "sm",
  valueComponent: DefaultValue$1,
  clearButtonTabIndex: 0
};
const RIGHT_SECTION_WIDTH$4 = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44
};
const _FileInput = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("FileInput", defaultProps$I, props), {
    inputProps,
    wrapperProps,
    placeholder,
    value,
    defaultValue,
    onChange,
    multiple,
    accept,
    name,
    form,
    classNames,
    styles,
    unstyled,
    valueComponent: ValueComponent,
    rightSection,
    rightSectionWidth,
    clearable,
    clearButtonLabel,
    clearButtonTabIndex
  } = _a, others = __objRest$1h(_a, ["inputProps", "wrapperProps", "placeholder", "value", "defaultValue", "onChange", "multiple", "accept", "name", "form", "classNames", "styles", "unstyled", "valueComponent", "rightSection", "rightSectionWidth", "clearable", "clearButtonLabel", "clearButtonTabIndex"]);
  const resetRef = react.exports.useRef();
  const {
    classes,
    theme,
    cx
  } = useStyles$1O(null, {
    name: "FileInput",
    classNames,
    styles,
    unstyled
  });
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    onChange,
    finalValue: multiple ? [] : null
  });
  const hasValue = Array.isArray(_value) ? _value.length !== 0 : _value !== null;
  const _rightSection = rightSection || (clearable && hasValue ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: () => setValue(multiple ? [] : null),
    size: inputProps.size,
    tabIndex: clearButtonTabIndex,
    unstyled
  }) : null);
  react.exports.useEffect(() => {
    if (Array.isArray(_value) && _value.length === 0 || _value === null) {
      resetRef.current();
    }
  }, [_value]);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$X(__spreadValues$1Y({}, wrapperProps), {
      __staticSelector: "FileInput"
    }),
    children: /* @__PURE__ */ jsx(FileButton, {
      onChange: setValue,
      multiple,
      accept,
      name,
      form,
      resetRef,
      children: (fileButtonProps) => /* @__PURE__ */ jsx(Input, {
        ...__spreadProps$X(__spreadValues$1Y(__spreadValues$1Y(__spreadValues$1Y({
          multiline: true
        }, fileButtonProps), inputProps), others), {
          component: "button",
          type: "button",
          ref,
          __staticSelector: "FileInput",
          rightSection: _rightSection,
          rightSectionWidth: rightSectionWidth || theme.fn.size({
            size: inputProps.size,
            sizes: RIGHT_SECTION_WIDTH$4
          }),
          classNames: __spreadProps$X(__spreadValues$1Y({}, classNames), {
            input: cx(classes.input, classNames == null ? void 0 : classNames.input)
          })
        }),
        children: !hasValue ? /* @__PURE__ */ jsx("span", {
          className: classes.placeholder,
          children: placeholder
        }) : /* @__PURE__ */ jsx(ValueComponent, {
          value: _value
        })
      })
    })
  });
});
_FileInput.displayName = "@mantine/core/FileInput";
const FileInput = _FileInput;
const GridContext = react.exports.createContext(null);
const GridProvider = GridContext.Provider;
const useGridContext = () => react.exports.useContext(GridContext);
var __defProp$1X = Object.defineProperty;
var __getOwnPropSymbols$1X = Object.getOwnPropertySymbols;
var __hasOwnProp$1X = Object.prototype.hasOwnProperty;
var __propIsEnum$1X = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1X = (obj, key, value) => key in obj ? __defProp$1X(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1X = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1X.call(b, prop))
      __defNormalProp$1X(a, prop, b[prop]);
  if (__getOwnPropSymbols$1X)
    for (var prop of __getOwnPropSymbols$1X(b)) {
      if (__propIsEnum$1X.call(b, prop))
        __defNormalProp$1X(a, prop, b[prop]);
    }
  return a;
};
const getColumnWidth = (colSpan, columns) => colSpan ? `${100 / (columns / colSpan)}%` : void 0;
const getColumnOffset = (offset2, columns) => offset2 ? `${100 / (columns / offset2)}%` : void 0;
function getBreakpointsStyles({
  sizes: sizes2,
  offsets,
  orders,
  theme,
  columns,
  grow
}) {
  return MANTINE_SIZES.reduce((acc, size2) => {
    acc[`@media (min-width: ${theme.breakpoints[size2] + 1}px)`] = {
      order: orders[size2],
      flexBasis: getColumnWidth(sizes2[size2], columns),
      flexShrink: 0,
      maxWidth: grow ? "unset" : getColumnWidth(sizes2[size2], columns),
      marginLeft: getColumnOffset(offsets[size2], columns)
    };
    return acc;
  }, {});
}
var useStyles$1L = createStyles((theme, {
  gutter,
  grow,
  offset: offset2,
  offsetXs,
  offsetSm,
  offsetMd,
  offsetLg,
  offsetXl,
  columns,
  span,
  xs,
  sm,
  md,
  lg,
  xl,
  order,
  orderXs,
  orderSm,
  orderMd,
  orderLg,
  orderXl
}) => ({
  root: __spreadValues$1X({
    boxSizing: "border-box",
    flexGrow: grow ? 1 : 0,
    order,
    padding: theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
    marginLeft: getColumnOffset(offset2, columns),
    flexBasis: getColumnWidth(span, columns),
    flexShrink: 0,
    maxWidth: grow ? "unset" : getColumnWidth(span, columns)
  }, getBreakpointsStyles({
    sizes: { xs, sm, md, lg, xl },
    offsets: { xs: offsetXs, sm: offsetSm, md: offsetMd, lg: offsetLg, xl: offsetXl },
    orders: { xs: orderXs, sm: orderSm, md: orderMd, lg: orderLg, xl: orderXl },
    theme,
    columns,
    grow
  }))
}));
const useStyles$1M = useStyles$1L;
var __defProp$1W = Object.defineProperty;
var __getOwnPropSymbols$1W = Object.getOwnPropertySymbols;
var __hasOwnProp$1W = Object.prototype.hasOwnProperty;
var __propIsEnum$1W = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1W = (obj, key, value) => key in obj ? __defProp$1W(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1W = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1W.call(b, prop))
      __defNormalProp$1W(a, prop, b[prop]);
  if (__getOwnPropSymbols$1W)
    for (var prop of __getOwnPropSymbols$1W(b)) {
      if (__propIsEnum$1W.call(b, prop))
        __defNormalProp$1W(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1g = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1W.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1W)
    for (var prop of __getOwnPropSymbols$1W(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1W.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$H = {
  offset: 0,
  offsetXs: 0,
  offsetSm: 0,
  offsetMd: 0,
  offsetLg: 0,
  offsetXl: 0
};
function isValidSpan(span) {
  return typeof span === "number" && span > 0 && span % 1 === 0;
}
const Col = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Grid.Col", defaultProps$H, props), {
    children,
    span,
    offset: offset2,
    offsetXs,
    offsetSm,
    offsetMd,
    offsetLg,
    offsetXl,
    xs,
    sm,
    md,
    lg,
    xl,
    order,
    orderXs,
    orderSm,
    orderMd,
    orderLg,
    orderXl,
    className,
    id,
    unstyled
  } = _a, others = __objRest$1g(_a, ["children", "span", "offset", "offsetXs", "offsetSm", "offsetMd", "offsetLg", "offsetXl", "xs", "sm", "md", "lg", "xl", "order", "orderXs", "orderSm", "orderMd", "orderLg", "orderXl", "className", "id", "unstyled"]);
  const ctx = useGridContext();
  if (!ctx) {
    throw new Error("[@mantine/core] Grid.Col was used outside of Grid context");
  }
  const colSpan = span || ctx.columns;
  const {
    classes,
    cx
  } = useStyles$1M({
    gutter: ctx.gutter,
    offset: offset2,
    offsetXs,
    offsetSm,
    offsetMd,
    offsetLg,
    offsetXl,
    xs,
    sm,
    md,
    lg,
    xl,
    order,
    orderXs,
    orderSm,
    orderMd,
    orderLg,
    orderXl,
    grow: ctx.grow,
    columns: ctx.columns,
    span: colSpan
  }, {
    unstyled,
    name: "Col"
  });
  if (!isValidSpan(colSpan) || colSpan > ctx.columns) {
    return null;
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1W({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
Col.displayName = "@mantine/core/Col";
var useStyles$1J = createStyles((theme, { justify, align, gutter }) => ({
  root: {
    margin: -theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: justify,
    alignItems: align
  }
}));
const useStyles$1K = useStyles$1J;
var __defProp$1V = Object.defineProperty;
var __getOwnPropSymbols$1V = Object.getOwnPropertySymbols;
var __hasOwnProp$1V = Object.prototype.hasOwnProperty;
var __propIsEnum$1V = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1V = (obj, key, value) => key in obj ? __defProp$1V(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1V = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1V.call(b, prop))
      __defNormalProp$1V(a, prop, b[prop]);
  if (__getOwnPropSymbols$1V)
    for (var prop of __getOwnPropSymbols$1V(b)) {
      if (__propIsEnum$1V.call(b, prop))
        __defNormalProp$1V(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1f = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1V.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1V)
    for (var prop of __getOwnPropSymbols$1V(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1V.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$G = {
  gutter: "md",
  justify: "flex-start",
  align: "stretch",
  columns: 12
};
const Grid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Grid", defaultProps$G, props), {
    gutter,
    children,
    grow,
    justify,
    align,
    columns,
    className,
    id,
    unstyled
  } = _a, others = __objRest$1f(_a, ["gutter", "children", "grow", "justify", "align", "columns", "className", "id", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1K({
    gutter,
    justify,
    align
  }, {
    unstyled,
    name: "Grid"
  });
  return /* @__PURE__ */ jsx(GridProvider, {
    value: {
      gutter,
      grow,
      columns
    },
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$1V({
        className: cx(classes.root, className),
        ref
      }, others),
      children
    })
  });
});
Grid.Col = Col;
Grid.displayName = "@mantine/core/Grid";
var useStyles$1H = createStyles((theme, { color }) => ({
  root: {
    backgroundColor: theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : 2),
    color: theme.colorScheme === "dark" ? theme.colors.dark[9] : "inherit"
  }
}));
const useStyles$1I = useStyles$1H;
var __defProp$1U = Object.defineProperty;
var __getOwnPropSymbols$1U = Object.getOwnPropertySymbols;
var __hasOwnProp$1U = Object.prototype.hasOwnProperty;
var __propIsEnum$1U = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1U = (obj, key, value) => key in obj ? __defProp$1U(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1U = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1U.call(b, prop))
      __defNormalProp$1U(a, prop, b[prop]);
  if (__getOwnPropSymbols$1U)
    for (var prop of __getOwnPropSymbols$1U(b)) {
      if (__propIsEnum$1U.call(b, prop))
        __defNormalProp$1U(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1e = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1U.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1U)
    for (var prop of __getOwnPropSymbols$1U(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1U.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$F = {
  color: "yellow"
};
const Mark = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Mark", defaultProps$F, props), {
    color,
    className,
    unstyled
  } = _a, others = __objRest$1e(_a, ["color", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1I({
    color
  }, {
    unstyled,
    name: "Mark"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1U({
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
var __defProp$1T = Object.defineProperty;
var __getOwnPropSymbols$1T = Object.getOwnPropertySymbols;
var __hasOwnProp$1T = Object.prototype.hasOwnProperty;
var __propIsEnum$1T = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1T = (obj, key, value) => key in obj ? __defProp$1T(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1T = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1T.call(b, prop))
      __defNormalProp$1T(a, prop, b[prop]);
  if (__getOwnPropSymbols$1T)
    for (var prop of __getOwnPropSymbols$1T(b)) {
      if (__propIsEnum$1T.call(b, prop))
        __defNormalProp$1T(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1d = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1T.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1T)
    for (var prop of __getOwnPropSymbols$1T(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1T.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$E = {
  highlightColor: "yellow"
};
const _Highlight = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Highlight", defaultProps$E, props), {
    children,
    highlight,
    highlightColor,
    highlightStyles,
    unstyled
  } = _a, others = __objRest$1d(_a, ["children", "highlight", "highlightColor", "highlightStyles", "unstyled"]);
  const highlightChunks = highlighter(children, highlight);
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$1T({
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
const HOVER_CARD_ERRORS = {
  context: "HoverCard component was not found in the tree",
  children: "HoverCard.Target component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
};
const [HoverCardContextProvider, useHoverCardContext] = createSafeContext(HOVER_CARD_ERRORS.context);
var __defProp$1S = Object.defineProperty;
var __getOwnPropSymbols$1S = Object.getOwnPropertySymbols;
var __hasOwnProp$1S = Object.prototype.hasOwnProperty;
var __propIsEnum$1S = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1S = (obj, key, value) => key in obj ? __defProp$1S(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1S = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1S.call(b, prop))
      __defNormalProp$1S(a, prop, b[prop]);
  if (__getOwnPropSymbols$1S)
    for (var prop of __getOwnPropSymbols$1S(b)) {
      if (__propIsEnum$1S.call(b, prop))
        __defNormalProp$1S(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1c = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1S.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1S)
    for (var prop of __getOwnPropSymbols$1S(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1S.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function HoverCardDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$1c(_b, ["children", "onMouseEnter", "onMouseLeave"]);
  const ctx = useHoverCardContext();
  const handleMouseEnter = createEventHandler(onMouseEnter, ctx.openDropdown);
  const handleMouseLeave = createEventHandler(onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$1S({
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }, others),
    children
  });
}
HoverCardDropdown.displayName = "@mantine/core/HoverCardDropdown";
var __defProp$1R = Object.defineProperty;
var __getOwnPropSymbols$1R = Object.getOwnPropertySymbols;
var __hasOwnProp$1R = Object.prototype.hasOwnProperty;
var __propIsEnum$1R = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1R = (obj, key, value) => key in obj ? __defProp$1R(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1R = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1R.call(b, prop))
      __defNormalProp$1R(a, prop, b[prop]);
  if (__getOwnPropSymbols$1R)
    for (var prop of __getOwnPropSymbols$1R(b)) {
      if (__propIsEnum$1R.call(b, prop))
        __defNormalProp$1R(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1b = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1R.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1R)
    for (var prop of __getOwnPropSymbols$1R(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1R.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const HoverCardTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp
  } = _b, others = __objRest$1b(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(HOVER_CARD_ERRORS.children);
  }
  const ctx = useHoverCardContext();
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, ctx.openDropdown);
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$1R({
      refProp,
      ref
    }, others),
    children: react.exports.cloneElement(children, {
      onMouseEnter,
      onMouseLeave
    })
  });
});
HoverCardTarget.displayName = "@mantine/core/HoverCardTarget";
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
var __defProp$1Q = Object.defineProperty;
var __getOwnPropSymbols$1Q = Object.getOwnPropertySymbols;
var __hasOwnProp$1Q = Object.prototype.hasOwnProperty;
var __propIsEnum$1Q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1Q = (obj, key, value) => key in obj ? __defProp$1Q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1Q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1Q.call(b, prop))
      __defNormalProp$1Q(a, prop, b[prop]);
  if (__getOwnPropSymbols$1Q)
    for (var prop of __getOwnPropSymbols$1Q(b)) {
      if (__propIsEnum$1Q.call(b, prop))
        __defNormalProp$1Q(a, prop, b[prop]);
    }
  return a;
};
var __objRest$1a = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1Q.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1Q)
    for (var prop of __getOwnPropSymbols$1Q(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1Q.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$D = {
  openDelay: 0,
  closeDelay: 150,
  initiallyOpened: false
};
function HoverCard(props) {
  const _a = useComponentDefaultProps("HoverCard", defaultProps$D, props), {
    children,
    onOpen,
    onClose,
    openDelay,
    closeDelay,
    initiallyOpened
  } = _a, others = __objRest$1a(_a, ["children", "onOpen", "onClose", "openDelay", "closeDelay", "initiallyOpened"]);
  const [opened, {
    open,
    close
  }] = useDisclosure(initiallyOpened, {
    onClose,
    onOpen
  });
  const {
    openDropdown,
    closeDropdown
  } = useDelayedHover({
    open,
    close,
    openDelay,
    closeDelay
  });
  return /* @__PURE__ */ jsx(HoverCardContextProvider, {
    value: {
      openDropdown,
      closeDropdown
    },
    children: /* @__PURE__ */ jsx(Popover, {
      ...__spreadValues$1Q({
        opened,
        __staticSelector: "HoverCard"
      }, others),
      children
    })
  });
}
HoverCard.displayName = "@mantine/core/HoverCard";
HoverCard.Target = HoverCardTarget;
HoverCard.Dropdown = HoverCardDropdown;
var __defProp$1P = Object.defineProperty;
var __getOwnPropSymbols$1P = Object.getOwnPropertySymbols;
var __hasOwnProp$1P = Object.prototype.hasOwnProperty;
var __propIsEnum$1P = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1P = (obj, key, value) => key in obj ? __defProp$1P(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1P = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1P.call(b, prop))
      __defNormalProp$1P(a, prop, b[prop]);
  if (__getOwnPropSymbols$1P)
    for (var prop of __getOwnPropSymbols$1P(b)) {
      if (__propIsEnum$1P.call(b, prop))
        __defNormalProp$1P(a, prop, b[prop]);
    }
  return a;
};
function ImageIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1P({
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
var __defProp$1O = Object.defineProperty;
var __defProps$W = Object.defineProperties;
var __getOwnPropDescs$W = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1O = Object.getOwnPropertySymbols;
var __hasOwnProp$1O = Object.prototype.hasOwnProperty;
var __propIsEnum$1O = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1O = (obj, key, value) => key in obj ? __defProp$1O(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1O = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1O.call(b, prop))
      __defNormalProp$1O(a, prop, b[prop]);
  if (__getOwnPropSymbols$1O)
    for (var prop of __getOwnPropSymbols$1O(b)) {
      if (__propIsEnum$1O.call(b, prop))
        __defNormalProp$1O(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$W = (a, b) => __defProps$W(a, __getOwnPropDescs$W(b));
var useStyles$1F = createStyles((theme, { radius }) => ({
  root: {},
  imageWrapper: {
    position: "relative"
  },
  figure: {
    margin: 0
  },
  image: __spreadProps$W(__spreadValues$1O({}, theme.fn.fontStyles()), {
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
  placeholder: __spreadProps$W(__spreadValues$1O({}, theme.fn.cover()), {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  })
}));
const useStyles$1G = useStyles$1F;
var __defProp$1N = Object.defineProperty;
var __getOwnPropSymbols$1N = Object.getOwnPropertySymbols;
var __hasOwnProp$1N = Object.prototype.hasOwnProperty;
var __propIsEnum$1N = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1N = (obj, key, value) => key in obj ? __defProp$1N(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1N = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1N.call(b, prop))
      __defNormalProp$1N(a, prop, b[prop]);
  if (__getOwnPropSymbols$1N)
    for (var prop of __getOwnPropSymbols$1N(b)) {
      if (__propIsEnum$1N.call(b, prop))
        __defNormalProp$1N(a, prop, b[prop]);
    }
  return a;
};
var __objRest$19 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1N.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1N)
    for (var prop of __getOwnPropSymbols$1N(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1N.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$C = {
  fit: "cover",
  width: "100%",
  height: "auto",
  radius: 0
};
const Image = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Image", defaultProps$C, props), {
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
  } = _a, others = __objRest$19(_a, ["className", "alt", "src", "fit", "width", "height", "radius", "imageProps", "withPlaceholder", "placeholder", "imageRef", "classNames", "styles", "caption", "unstyled", "style"]);
  const {
    classes,
    cx
  } = useStyles$1G({
    radius
  }, {
    classNames,
    styles,
    unstyled,
    name: "Image"
  });
  const [loaded, setLoaded] = react.exports.useState(false);
  const [error, setError] = react.exports.useState(!src);
  const isPlaceholder = withPlaceholder && (!loaded || error);
  useDidUpdate(() => {
    setLoaded(false);
    setError(false);
  }, [src]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1N({
      className: cx(classes.root, className),
      ref,
      style: __spreadValues$1N({
        width,
        height
      }, style)
    }, others),
    children: /* @__PURE__ */ jsxs("figure", {
      className: classes.figure,
      children: [/* @__PURE__ */ jsxs("div", {
        className: classes.imageWrapper,
        children: [/* @__PURE__ */ jsx("img", {
          ...__spreadValues$1N({
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
var __defProp$1M = Object.defineProperty;
var __defProps$V = Object.defineProperties;
var __getOwnPropDescs$V = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1M = Object.getOwnPropertySymbols;
var __hasOwnProp$1M = Object.prototype.hasOwnProperty;
var __propIsEnum$1M = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1M = (obj, key, value) => key in obj ? __defProp$1M(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1M = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1M.call(b, prop))
      __defNormalProp$1M(a, prop, b[prop]);
  if (__getOwnPropSymbols$1M)
    for (var prop of __getOwnPropSymbols$1M(b)) {
      if (__propIsEnum$1M.call(b, prop))
        __defNormalProp$1M(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$V = (a, b) => __defProps$V(a, __getOwnPropDescs$V(b));
function getPositionStyles$1(_position, offset2 = 0) {
  const styles = {};
  const [position, placement] = _position.split("-");
  let translateX = "";
  let translateY = "";
  if (position === "top") {
    styles.top = offset2;
    translateY = "-50%";
  }
  if (position === "middle") {
    styles.top = "50%";
    translateY = "-50%";
  }
  if (position === "bottom") {
    styles.bottom = offset2;
    translateY = "50%";
  }
  if (placement === "start") {
    styles.left = offset2;
    translateX = "-50%";
  }
  if (placement === "center") {
    styles.left = "50%";
    translateX = "-50%";
  }
  if (placement === "end") {
    styles.right = offset2;
    translateX = "50%";
  }
  styles.transform = `translate(${translateX}, ${translateY})`;
  return styles;
}
var useStyles$1D = createStyles((theme, {
  radius,
  size: size2,
  color,
  position,
  offset: offset2,
  inline,
  withBorder,
  withLabel,
  zIndex
}) => ({
  root: {
    position: "relative",
    display: inline ? "inline-block" : "block"
  },
  indicator: __spreadProps$V(__spreadValues$1M({}, getPositionStyles$1(position, offset2)), {
    zIndex,
    position: "absolute",
    [withLabel ? "minWidth" : "width"]: size2,
    height: size2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fontSizes.xs,
    paddingLeft: withLabel ? theme.spacing.xs / 2 : 0,
    paddingRight: withLabel ? theme.spacing.xs / 2 : 0,
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
    backgroundColor: theme.fn.variant({
      variant: "filled",
      primaryFallback: false,
      color: color || theme.primaryColor
    }).background,
    border: withBorder ? `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}` : void 0,
    color: theme.white,
    whiteSpace: "nowrap"
  })
}));
const useStyles$1E = useStyles$1D;
var __defProp$1L = Object.defineProperty;
var __getOwnPropSymbols$1L = Object.getOwnPropertySymbols;
var __hasOwnProp$1L = Object.prototype.hasOwnProperty;
var __propIsEnum$1L = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1L = (obj, key, value) => key in obj ? __defProp$1L(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1L = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1L.call(b, prop))
      __defNormalProp$1L(a, prop, b[prop]);
  if (__getOwnPropSymbols$1L)
    for (var prop of __getOwnPropSymbols$1L(b)) {
      if (__propIsEnum$1L.call(b, prop))
        __defNormalProp$1L(a, prop, b[prop]);
    }
  return a;
};
var __objRest$18 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1L.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1L)
    for (var prop of __getOwnPropSymbols$1L(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1L.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$B = {
  position: "top-end",
  offset: 0,
  inline: false,
  withBorder: false,
  disabled: false,
  size: 10,
  radius: 1e3,
  zIndex: getDefaultZIndex("app")
};
const Indicator = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Indicator", defaultProps$B, props), {
    children,
    position,
    offset: offset2,
    size: size2,
    radius,
    inline,
    withBorder,
    className,
    color,
    styles,
    label,
    classNames,
    disabled,
    zIndex,
    unstyled
  } = _a, others = __objRest$18(_a, ["children", "position", "offset", "size", "radius", "inline", "withBorder", "className", "color", "styles", "label", "classNames", "disabled", "zIndex", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1E({
    position,
    offset: offset2,
    size: size2,
    radius,
    inline,
    color,
    withBorder,
    zIndex,
    withLabel: !!label
  }, {
    name: "Indicator",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$1L({
      ref,
      className: cx(classes.root, className)
    }, others),
    children: [!disabled && /* @__PURE__ */ jsx("div", {
      className: classes.indicator,
      children: label
    }), children]
  });
});
Indicator.displayName = "@mantine/core/Indicator";
var __defProp$1K = Object.defineProperty;
var __defProps$U = Object.defineProperties;
var __getOwnPropDescs$U = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1K = Object.getOwnPropertySymbols;
var __hasOwnProp$1K = Object.prototype.hasOwnProperty;
var __propIsEnum$1K = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1K = (obj, key, value) => key in obj ? __defProp$1K(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1K = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1K.call(b, prop))
      __defNormalProp$1K(a, prop, b[prop]);
  if (__getOwnPropSymbols$1K)
    for (var prop of __getOwnPropSymbols$1K(b)) {
      if (__propIsEnum$1K.call(b, prop))
        __defNormalProp$1K(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$U = (a, b) => __defProps$U(a, __getOwnPropDescs$U(b));
var __objRest$17 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1K.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1K)
    for (var prop of __getOwnPropSymbols$1K(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1K.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$A = {
  size: "sm",
  __staticSelector: "InputBase"
};
const _InputBase = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("InputBase", defaultProps$A, props), {
    inputProps,
    wrapperProps
  } = _a, others = __objRest$17(_a, ["inputProps", "wrapperProps"]);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1K({}, wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$U(__spreadValues$1K(__spreadValues$1K({}, inputProps), others), {
        ref
      })
    })
  });
});
_InputBase.displayName = "@mantine/core/InputBase";
const InputBase = createPolymorphicComponent(_InputBase);
function validateJson(value) {
  if (typeof value === "string" && value.trim().length === 0) {
    return true;
  }
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}
var useStyles$1B = createStyles((theme, { size: size2 }) => ({
  input: {
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }) - 2
  }
}));
const useStyles$1C = useStyles$1B;
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
var index$1 = react.exports.useLayoutEffect;
var useLatest = function useLatest2(value) {
  var ref = react.exports.useRef(value);
  index$1(function() {
    ref.current = value;
  });
  return ref;
};
var updateRef = function updateRef2(ref, value) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
};
var useComposedRef = function useComposedRef2(libRef, userRef) {
  var prevUserRef = react.exports.useRef();
  return react.exports.useCallback(function(instance) {
    libRef.current = instance;
    if (prevUserRef.current) {
      updateRef(prevUserRef.current, null);
    }
    prevUserRef.current = userRef;
    if (!userRef) {
      return;
    }
    updateRef(userRef, instance);
  }, [userRef]);
};
var HIDDEN_TEXTAREA_STYLE = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0"
};
var forceHiddenStyles = function forceHiddenStyles2(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function(key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], "important");
  });
};
var hiddenTextarea = null;
var getHeight = function getHeight2(node, sizingData) {
  var height = node.scrollHeight;
  if (sizingData.sizingStyle.boxSizing === "border-box") {
    return height + sizingData.borderSize;
  }
  return height - sizingData.paddingSize;
};
function calculateNodeHeight(sizingData, value, minRows, maxRows) {
  if (minRows === void 0) {
    minRows = 1;
  }
  if (maxRows === void 0) {
    maxRows = Infinity;
  }
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.setAttribute("tabindex", "-1");
    hiddenTextarea.setAttribute("aria-hidden", "true");
    forceHiddenStyles(hiddenTextarea);
  }
  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }
  var paddingSize = sizingData.paddingSize, borderSize = sizingData.borderSize, sizingStyle = sizingData.sizingStyle;
  var boxSizing = sizingStyle.boxSizing;
  Object.keys(sizingStyle).forEach(function(_key) {
    var key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
  });
  forceHiddenStyles(hiddenTextarea);
  hiddenTextarea.value = value;
  var height = getHeight(hiddenTextarea, sizingData);
  hiddenTextarea.value = "x";
  var rowHeight = hiddenTextarea.scrollHeight - paddingSize;
  var minHeight = rowHeight * minRows;
  if (boxSizing === "border-box") {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);
  var maxHeight = rowHeight * maxRows;
  if (boxSizing === "border-box") {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  height = Math.min(maxHeight, height);
  return [height, rowHeight];
}
var noop$2 = function noop() {
};
var pick = function pick2(props, obj) {
  return props.reduce(function(acc, prop) {
    acc[prop] = obj[prop];
    return acc;
  }, {});
};
var SIZING_STYLE = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "tabSize",
  "textIndent",
  "textRendering",
  "textTransform",
  "width",
  "wordBreak"
];
var isIE = !!document.documentElement.currentStyle;
var getSizingData = function getSizingData2(node) {
  var style = window.getComputedStyle(node);
  if (style === null) {
    return null;
  }
  var sizingStyle = pick(SIZING_STYLE, style);
  var boxSizing = sizingStyle.boxSizing;
  if (boxSizing === "") {
    return null;
  }
  if (isIE && boxSizing === "border-box") {
    sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + "px";
  }
  var paddingSize = parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
  var borderSize = parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth);
  return {
    sizingStyle,
    paddingSize,
    borderSize
  };
};
var useWindowResizeListener = function useWindowResizeListener2(listener) {
  var latestListener = useLatest(listener);
  react.exports.useLayoutEffect(function() {
    var handler = function handler2(event) {
      latestListener.current(event);
    };
    window.addEventListener("resize", handler);
    return function() {
      window.removeEventListener("resize", handler);
    };
  }, []);
};
var TextareaAutosize = function TextareaAutosize2(_ref, userRef) {
  var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = _ref$onChange === void 0 ? noop$2 : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = _ref$onHeightChange === void 0 ? noop$2 : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"]);
  var isControlled = props.value !== void 0;
  var libRef = react.exports.useRef(null);
  var ref = useComposedRef(libRef, userRef);
  var heightRef = react.exports.useRef(0);
  var measurementsCacheRef = react.exports.useRef();
  var resizeTextarea = function resizeTextarea2() {
    var node = libRef.current;
    var nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData(node);
    if (!nodeSizingData) {
      return;
    }
    measurementsCacheRef.current = nodeSizingData;
    var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || "x", minRows, maxRows), height = _calculateNodeHeight[0], rowHeight = _calculateNodeHeight[1];
    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty("height", height + "px", "important");
      onHeightChange(height, {
        rowHeight
      });
    }
  };
  var handleChange = function handleChange2(event) {
    if (!isControlled) {
      resizeTextarea();
    }
    onChange(event);
  };
  {
    react.exports.useLayoutEffect(resizeTextarea);
    useWindowResizeListener(resizeTextarea);
  }
  return /* @__PURE__ */ react.exports.createElement("textarea", _extends({}, props, {
    onChange: handleChange,
    ref
  }));
};
var index = /* @__PURE__ */ react.exports.forwardRef(TextareaAutosize);
const TextareaAutosize$1 = index;
var useStyles$1z = createStyles((theme) => ({
  input: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs
  }
}));
const useStyles$1A = useStyles$1z;
var __defProp$1J = Object.defineProperty;
var __defProps$T = Object.defineProperties;
var __getOwnPropDescs$T = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1J = Object.getOwnPropertySymbols;
var __hasOwnProp$1J = Object.prototype.hasOwnProperty;
var __propIsEnum$1J = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1J = (obj, key, value) => key in obj ? __defProp$1J(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1J = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1J.call(b, prop))
      __defNormalProp$1J(a, prop, b[prop]);
  if (__getOwnPropSymbols$1J)
    for (var prop of __getOwnPropSymbols$1J(b)) {
      if (__propIsEnum$1J.call(b, prop))
        __defNormalProp$1J(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$T = (a, b) => __defProps$T(a, __getOwnPropDescs$T(b));
var __objRest$16 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1J.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1J)
    for (var prop of __getOwnPropSymbols$1J(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1J.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$z = {
  autosize: false,
  size: "sm",
  __staticSelector: "Textarea"
};
const Textarea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Textarea", defaultProps$z, props), {
    autosize,
    maxRows,
    minRows,
    label,
    error,
    description,
    id,
    className,
    required,
    style,
    wrapperProps,
    classNames,
    styles,
    size: size2,
    __staticSelector,
    sx,
    errorProps,
    descriptionProps,
    labelProps,
    inputWrapperOrder,
    inputContainer,
    unstyled,
    withAsterisk
  } = _a, others = __objRest$16(_a, ["autosize", "maxRows", "minRows", "label", "error", "description", "id", "className", "required", "style", "wrapperProps", "classNames", "styles", "size", "__staticSelector", "sx", "errorProps", "descriptionProps", "labelProps", "inputWrapperOrder", "inputContainer", "unstyled", "withAsterisk"]);
  const uuid2 = useId(id);
  const {
    classes,
    cx
  } = useStyles$1A();
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const sharedProps = __spreadValues$1J({
    required,
    ref,
    invalid: !!error,
    id: uuid2,
    classNames: __spreadProps$T(__spreadValues$1J({}, classNames), {
      input: cx(classes.input, classNames == null ? void 0 : classNames.input)
    }),
    styles,
    __staticSelector,
    size: size2,
    multiline: true,
    unstyled
  }, rest);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1J(__spreadValues$1J({
      label,
      error,
      id: uuid2,
      description,
      required,
      style,
      className,
      classNames,
      styles,
      size: size2,
      __staticSelector,
      sx,
      errorProps,
      labelProps,
      descriptionProps,
      inputContainer,
      inputWrapperOrder,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: autosize ? /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$T(__spreadValues$1J({}, sharedProps), {
        component: TextareaAutosize$1,
        maxRows,
        minRows
      })
    }) : /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$T(__spreadValues$1J({}, sharedProps), {
        component: "textarea",
        rows: minRows
      })
    })
  });
});
Textarea.displayName = "@mantine/core/Textarea";
var __defProp$1I = Object.defineProperty;
var __defProps$S = Object.defineProperties;
var __getOwnPropDescs$S = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1I = Object.getOwnPropertySymbols;
var __hasOwnProp$1I = Object.prototype.hasOwnProperty;
var __propIsEnum$1I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1I = (obj, key, value) => key in obj ? __defProp$1I(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1I = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1I.call(b, prop))
      __defNormalProp$1I(a, prop, b[prop]);
  if (__getOwnPropSymbols$1I)
    for (var prop of __getOwnPropSymbols$1I(b)) {
      if (__propIsEnum$1I.call(b, prop))
        __defNormalProp$1I(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$S = (a, b) => __defProps$S(a, __getOwnPropDescs$S(b));
var __objRest$15 = (source, exclude) => {
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
const defaultProps$y = {
  formatOnBlur: false,
  size: "sm"
};
const JsonInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("JsonInput", defaultProps$y, props), {
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    error,
    formatOnBlur,
    size: size2,
    validationError,
    classNames,
    unstyled
  } = _a, others = __objRest$15(_a, ["value", "defaultValue", "onChange", "onFocus", "onBlur", "error", "formatOnBlur", "size", "validationError", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1C({
    size: size2
  }, {
    name: "JsonInput",
    unstyled
  });
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const [valid, setValid] = react.exports.useState(validateJson(_value));
  const handleFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    setValid(true);
  };
  const handleBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    const isValid = validateJson(event.currentTarget.value);
    formatOnBlur && isValid && event.currentTarget.value.trim() !== "" && setValue(JSON.stringify(JSON.parse(event.currentTarget.value), null, 2));
    setValid(isValid);
  };
  return /* @__PURE__ */ jsx(Textarea, {
    ...__spreadValues$1I({
      value: _value,
      onChange: (event) => setValue(event.currentTarget.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
      error: valid ? error : validationError || true,
      __staticSelector: "JsonInput",
      classNames: __spreadProps$S(__spreadValues$1I({}, classNames), {
        input: cx(classes.input, classNames == null ? void 0 : classNames.input)
      }),
      autoComplete: "nope",
      ref,
      unstyled
    }, others)
  });
});
JsonInput.displayName = "@mantine/core/JsonInput";
var useStyles$1x = createStyles((theme) => ({
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
const useStyles$1y = useStyles$1x;
var __defProp$1H = Object.defineProperty;
var __getOwnPropSymbols$1H = Object.getOwnPropertySymbols;
var __hasOwnProp$1H = Object.prototype.hasOwnProperty;
var __propIsEnum$1H = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1H = (obj, key, value) => key in obj ? __defProp$1H(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1H = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1H.call(b, prop))
      __defNormalProp$1H(a, prop, b[prop]);
  if (__getOwnPropSymbols$1H)
    for (var prop of __getOwnPropSymbols$1H(b)) {
      if (__propIsEnum$1H.call(b, prop))
        __defNormalProp$1H(a, prop, b[prop]);
    }
  return a;
};
var __objRest$14 = (source, exclude) => {
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
const Kbd = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Kbd", {}, props), {
    className,
    children,
    unstyled
  } = _a, others = __objRest$14(_a, ["className", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1y(null, {
    name: "Kbd",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1H({
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
var useStyles$1v = createStyles((theme, { spacing, center }, getRef) => ({
  itemWrapper: {
    ref: getRef("itemWrapper"),
    display: "inline"
  },
  item: {
    lineHeight: center ? 1 : theme.lineHeight,
    "&:not(:first-of-type)": {
      marginTop: theme.fn.size({ size: spacing, sizes: theme.spacing })
    }
  },
  withIcon: {
    listStyle: "none",
    [`& .${getRef("itemWrapper")}`]: {
      display: "inline-flex",
      alignItems: center ? "center" : "flex-start"
    }
  },
  itemIcon: {
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: theme.spacing.sm
  }
}));
const useStyles$1w = useStyles$1v;
var __defProp$1G = Object.defineProperty;
var __getOwnPropSymbols$1G = Object.getOwnPropertySymbols;
var __hasOwnProp$1G = Object.prototype.hasOwnProperty;
var __propIsEnum$1G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1G = (obj, key, value) => key in obj ? __defProp$1G(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1G = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1G.call(b, prop))
      __defNormalProp$1G(a, prop, b[prop]);
  if (__getOwnPropSymbols$1G)
    for (var prop of __getOwnPropSymbols$1G(b)) {
      if (__propIsEnum$1G.call(b, prop))
        __defNormalProp$1G(a, prop, b[prop]);
    }
  return a;
};
var __objRest$13 = (source, exclude) => {
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
function ListItem(_a) {
  var _b = _a, {
    className,
    children,
    icon
  } = _b, others = __objRest$13(_b, ["className", "children", "icon"]);
  const {
    icon: ctxIcon,
    spacing,
    center
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
  } = useStyles$1w({
    spacing,
    center
  }, {
    classNames,
    styles,
    unstyled,
    name: "List"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1G({
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
      }), /* @__PURE__ */ jsx("span", {
        children
      })]
    })
  });
}
ListItem.displayName = "@mantine/core/ListItem";
var __defProp$1F = Object.defineProperty;
var __defProps$R = Object.defineProperties;
var __getOwnPropDescs$R = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1F = Object.getOwnPropertySymbols;
var __hasOwnProp$1F = Object.prototype.hasOwnProperty;
var __propIsEnum$1F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1F = (obj, key, value) => key in obj ? __defProp$1F(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1F = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1F.call(b, prop))
      __defNormalProp$1F(a, prop, b[prop]);
  if (__getOwnPropSymbols$1F)
    for (var prop of __getOwnPropSymbols$1F(b)) {
      if (__propIsEnum$1F.call(b, prop))
        __defNormalProp$1F(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$R = (a, b) => __defProps$R(a, __getOwnPropDescs$R(b));
var useStyles$1t = createStyles((theme, { withPadding, size: size2, listStyleType }) => ({
  root: __spreadProps$R(__spreadValues$1F({}, theme.fn.fontStyles()), {
    listStyleType,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    lineHeight: theme.lineHeight,
    margin: 0,
    paddingLeft: withPadding ? theme.spacing.xl : 0,
    listStylePosition: "inside"
  })
}));
const useStyles$1u = useStyles$1t;
var __defProp$1E = Object.defineProperty;
var __getOwnPropSymbols$1E = Object.getOwnPropertySymbols;
var __hasOwnProp$1E = Object.prototype.hasOwnProperty;
var __propIsEnum$1E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1E = (obj, key, value) => key in obj ? __defProp$1E(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1E = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1E.call(b, prop))
      __defNormalProp$1E(a, prop, b[prop]);
  if (__getOwnPropSymbols$1E)
    for (var prop of __getOwnPropSymbols$1E(b)) {
      if (__propIsEnum$1E.call(b, prop))
        __defNormalProp$1E(a, prop, b[prop]);
    }
  return a;
};
var __objRest$12 = (source, exclude) => {
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
const defaultProps$x = {
  type: "unordered",
  size: "md",
  spacing: 0
};
const List = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("List", defaultProps$x, props), {
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
  } = _a, others = __objRest$12(_a, ["children", "type", "size", "listStyleType", "withPadding", "center", "spacing", "icon", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1u({
    withPadding,
    size: size2,
    listStyleType
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
        icon
      },
      children: /* @__PURE__ */ jsx(Box, {
        ...__spreadValues$1E({
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
var useStyles$1r = createStyles((theme, { smallerThan, largerThan, query, styles }) => {
  const media = {};
  const minWidth = theme.fn.size({ size: largerThan, sizes: theme.breakpoints }) + 1;
  const maxWidth = theme.fn.size({ size: smallerThan, sizes: theme.breakpoints });
  if (largerThan !== void 0 && smallerThan !== void 0) {
    media[`@media (min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`] = styles;
  } else {
    if (largerThan !== void 0) {
      media[`@media (min-width: ${theme.fn.size({ size: largerThan, sizes: theme.breakpoints }) + 1}px)`] = styles;
    }
    if (smallerThan !== void 0) {
      media[`@media (max-width: ${theme.fn.size({ size: smallerThan, sizes: theme.breakpoints })}px)`] = styles;
    }
  }
  if (query) {
    media[`@media ${query}`] = styles;
  }
  return { media };
});
const useStyles$1s = useStyles$1r;
function MediaQuery(props) {
  var _a;
  const { children, smallerThan, largerThan, query, styles, className } = useComponentDefaultProps("MediaQuery", {}, props);
  const { classes, cx } = useStyles$1s({ smallerThan, largerThan, query, styles }, { name: "MediaQuery" });
  const child = react.exports.Children.only(children);
  if (typeof child === "object" && child !== null && "props" in child) {
    return React.cloneElement(child, {
      className: cx(classes.media, (_a = child.props) == null ? void 0 : _a.className, className)
    });
  }
  return child;
}
MediaQuery.displayName = "@mantine/core/MediaQuery";
var useStyles$1p = createStyles((theme) => ({
  divider: {
    margin: `${theme.spacing.xs / 2}px -5px`,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`
  }
}));
const useStyles$1q = useStyles$1p;
var __defProp$1D = Object.defineProperty;
var __getOwnPropSymbols$1D = Object.getOwnPropertySymbols;
var __hasOwnProp$1D = Object.prototype.hasOwnProperty;
var __propIsEnum$1D = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1D = (obj, key, value) => key in obj ? __defProp$1D(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1D = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1D.call(b, prop))
      __defNormalProp$1D(a, prop, b[prop]);
  if (__getOwnPropSymbols$1D)
    for (var prop of __getOwnPropSymbols$1D(b)) {
      if (__propIsEnum$1D.call(b, prop))
        __defNormalProp$1D(a, prop, b[prop]);
    }
  return a;
};
var __objRest$11 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1D.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1D)
    for (var prop of __getOwnPropSymbols$1D(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1D.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuDivider(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$11(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$1q(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1D({
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
var __defProp$1C = Object.defineProperty;
var __getOwnPropSymbols$1C = Object.getOwnPropertySymbols;
var __hasOwnProp$1C = Object.prototype.hasOwnProperty;
var __propIsEnum$1C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1C = (obj, key, value) => key in obj ? __defProp$1C(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1C = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1C.call(b, prop))
      __defNormalProp$1C(a, prop, b[prop]);
  if (__getOwnPropSymbols$1C)
    for (var prop of __getOwnPropSymbols$1C(b)) {
      if (__propIsEnum$1C.call(b, prop))
        __defNormalProp$1C(a, prop, b[prop]);
    }
  return a;
};
var __objRest$10 = (source, exclude) => {
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
function MenuDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$10(_b, ["children", "onMouseEnter", "onMouseLeave"]);
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
    ...__spreadValues$1C({
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
var __defProp$1B = Object.defineProperty;
var __defProps$Q = Object.defineProperties;
var __getOwnPropDescs$Q = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1B = Object.getOwnPropertySymbols;
var __hasOwnProp$1B = Object.prototype.hasOwnProperty;
var __propIsEnum$1B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1B = (obj, key, value) => key in obj ? __defProp$1B(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1B = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1B.call(b, prop))
      __defNormalProp$1B(a, prop, b[prop]);
  if (__getOwnPropSymbols$1B)
    for (var prop of __getOwnPropSymbols$1B(b)) {
      if (__propIsEnum$1B.call(b, prop))
        __defNormalProp$1B(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$Q = (a, b) => __defProps$Q(a, __getOwnPropDescs$Q(b));
var useStyles$1n = createStyles((theme, { color, radius }) => ({
  item: __spreadProps$Q(__spreadValues$1B({}, theme.fn.fontStyles()), {
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
const useStyles$1o = useStyles$1n;
var __defProp$1A = Object.defineProperty;
var __defProps$P = Object.defineProperties;
var __getOwnPropDescs$P = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1A = Object.getOwnPropertySymbols;
var __hasOwnProp$1A = Object.prototype.hasOwnProperty;
var __propIsEnum$1A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1A = (obj, key, value) => key in obj ? __defProp$1A(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1A = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1A.call(b, prop))
      __defNormalProp$1A(a, prop, b[prop]);
  if (__getOwnPropSymbols$1A)
    for (var prop of __getOwnPropSymbols$1A(b)) {
      if (__propIsEnum$1A.call(b, prop))
        __defNormalProp$1A(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$P = (a, b) => __defProps$P(a, __getOwnPropDescs$P(b));
var __objRest$$ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1A.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1A)
    for (var prop of __getOwnPropSymbols$1A(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1A.call(source, prop))
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
  } = _b, others = __objRest$$(_b, ["children", "className", "color", "closeMenuOnClick", "icon", "rightSection"]);
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
  } = useStyles$1o({
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
    ...__spreadProps$P(__spreadValues$1A({
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
var useStyles$1l = createStyles((theme) => ({
  label: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    fontWeight: 500,
    fontSize: theme.fontSizes.xs,
    padding: `${theme.spacing.xs / 2}px ${theme.spacing.sm}px`,
    cursor: "default"
  }
}));
const useStyles$1m = useStyles$1l;
var __defProp$1z = Object.defineProperty;
var __getOwnPropSymbols$1z = Object.getOwnPropertySymbols;
var __hasOwnProp$1z = Object.prototype.hasOwnProperty;
var __propIsEnum$1z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1z = (obj, key, value) => key in obj ? __defProp$1z(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1z = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1z.call(b, prop))
      __defNormalProp$1z(a, prop, b[prop]);
  if (__getOwnPropSymbols$1z)
    for (var prop of __getOwnPropSymbols$1z(b)) {
      if (__propIsEnum$1z.call(b, prop))
        __defNormalProp$1z(a, prop, b[prop]);
    }
  return a;
};
var __objRest$_ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1z.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1z)
    for (var prop of __getOwnPropSymbols$1z(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1z.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function MenuLabel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$_(_b, ["children", "className"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$1m(null, {
    name: "Menu",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$1z({
      className: cx(classes.label, className)
    }, others),
    children
  });
}
MenuLabel.displayName = "@mantine/core/MenuLabel";
var __defProp$1y = Object.defineProperty;
var __getOwnPropSymbols$1y = Object.getOwnPropertySymbols;
var __hasOwnProp$1y = Object.prototype.hasOwnProperty;
var __propIsEnum$1y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1y = (obj, key, value) => key in obj ? __defProp$1y(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1y = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1y.call(b, prop))
      __defNormalProp$1y(a, prop, b[prop]);
  if (__getOwnPropSymbols$1y)
    for (var prop of __getOwnPropSymbols$1y(b)) {
      if (__propIsEnum$1y.call(b, prop))
        __defNormalProp$1y(a, prop, b[prop]);
    }
  return a;
};
var __objRest$Z = (source, exclude) => {
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
const MenuTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp = "ref"
  } = _b, others = __objRest$Z(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(MENU_ERRORS.children);
  }
  const ctx = useMenuContext();
  const onClick = createEventHandler(children.props.onClick, () => ctx.trigger === "click" && ctx.toggleDropdown());
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, () => ctx.trigger === "hover" && ctx.openDropdown());
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, () => ctx.trigger === "hover" && ctx.closeDropdown());
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$1y({
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
var useStyles$1j = createStyles({
  dropdown: { padding: 4 }
});
const useStyles$1k = useStyles$1j;
var __defProp$1x = Object.defineProperty;
var __defProps$O = Object.defineProperties;
var __getOwnPropDescs$O = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1x = Object.getOwnPropertySymbols;
var __hasOwnProp$1x = Object.prototype.hasOwnProperty;
var __propIsEnum$1x = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1x = (obj, key, value) => key in obj ? __defProp$1x(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1x = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1x.call(b, prop))
      __defNormalProp$1x(a, prop, b[prop]);
  if (__getOwnPropSymbols$1x)
    for (var prop of __getOwnPropSymbols$1x(b)) {
      if (__propIsEnum$1x.call(b, prop))
        __defNormalProp$1x(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$O = (a, b) => __defProps$O(a, __getOwnPropDescs$O(b));
var __objRest$Y = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1x.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1x)
    for (var prop of __getOwnPropSymbols$1x(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1x.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$w = {
  closeOnItemClick: true,
  loop: true,
  trigger: "click",
  openDelay: 0,
  closeDelay: 100
};
function Menu(props) {
  const _a = useComponentDefaultProps("Menu", defaultProps$w, props), {
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
  } = _a, others = __objRest$Y(_a, ["children", "onOpen", "onClose", "opened", "defaultOpened", "onChange", "closeOnItemClick", "loop", "closeOnEscape", "trigger", "openDelay", "closeDelay", "classNames", "styles", "unstyled", "radius"]);
  const {
    classes,
    cx
  } = useStyles$1k();
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
      ...__spreadProps$O(__spreadValues$1x({}, others), {
        radius,
        opened: _opened,
        onChange: setOpened,
        defaultOpened,
        trapFocus: trigger === "click",
        closeOnEscape: closeOnEscape2 && trigger === "click",
        __staticSelector: "Menu",
        classNames: __spreadProps$O(__spreadValues$1x({}, classNames), {
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
var __defProp$1w = Object.defineProperty;
var __getOwnPropSymbols$1w = Object.getOwnPropertySymbols;
var __hasOwnProp$1w = Object.prototype.hasOwnProperty;
var __propIsEnum$1w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1w = (obj, key, value) => key in obj ? __defProp$1w(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1w = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1w.call(b, prop))
      __defNormalProp$1w(a, prop, b[prop]);
  if (__getOwnPropSymbols$1w)
    for (var prop of __getOwnPropSymbols$1w(b)) {
      if (__propIsEnum$1w.call(b, prop))
        __defNormalProp$1w(a, prop, b[prop]);
    }
  return a;
};
const sizes$a = {
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
var useStyles$1h = createStyles((theme, { overflow, size: size2, centered, zIndex, fullScreen }) => ({
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
  modal: __spreadValues$1w({
    position: "relative",
    width: fullScreen ? void 0 : theme.fn.size({ sizes: sizes$a, size: size2 }),
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
const useStyles$1i = useStyles$1h;
var __defProp$1v = Object.defineProperty;
var __getOwnPropSymbols$1v = Object.getOwnPropertySymbols;
var __hasOwnProp$1v = Object.prototype.hasOwnProperty;
var __propIsEnum$1v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1v = (obj, key, value) => key in obj ? __defProp$1v(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1v = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1v.call(b, prop))
      __defNormalProp$1v(a, prop, b[prop]);
  if (__getOwnPropSymbols$1v)
    for (var prop of __getOwnPropSymbols$1v(b)) {
      if (__propIsEnum$1v.call(b, prop))
        __defNormalProp$1v(a, prop, b[prop]);
    }
  return a;
};
var __objRest$X = (source, exclude) => {
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
const defaultProps$v = {
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
  const _a = useComponentDefaultProps("Modal", defaultProps$v, props), {
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
  } = _a, others = __objRest$X(_a, ["className", "opened", "title", "onClose", "children", "withCloseButton", "overlayOpacity", "size", "transitionDuration", "closeButtonLabel", "overlayColor", "overflow", "transition", "padding", "shadow", "radius", "id", "classNames", "styles", "closeOnClickOutside", "trapFocus", "closeOnEscape", "centered", "target", "withinPortal", "zIndex", "overlayBlur", "transitionTimingFunction", "fullScreen", "unstyled", "lockScroll", "withFocusReturn"]);
  const baseId = useId(id);
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const {
    classes,
    cx,
    theme
  } = useStyles$1i({
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
        ...__spreadValues$1v({
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
            p: padding2,
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
const sizes$9 = {
  xs: 16,
  sm: 22,
  md: 26,
  lg: 30,
  xl: 36
};
const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18
};
var useStyles$1f = createStyles((theme, { size: size2, disabled, radius, readOnly }) => ({
  defaultValue: {
    display: "flex",
    alignItems: "center",
    backgroundColor: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3] : theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    color: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7] : theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    height: theme.fn.size({ size: size2, sizes: sizes$9 }),
    paddingLeft: theme.fn.size({ size: size2, sizes: theme.spacing }),
    paddingRight: disabled || readOnly ? theme.fn.size({ size: size2, sizes: theme.spacing }) : 0,
    fontWeight: 500,
    fontSize: theme.fn.size({ size: size2, sizes: fontSizes }),
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
    cursor: disabled ? "not-allowed" : "default",
    userSelect: "none",
    maxWidth: "calc(100% - 20px)"
  },
  defaultValueRemove: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    marginLeft: theme.fn.size({ size: size2, sizes: theme.spacing }) / 6
  },
  defaultValueLabel: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}));
const useStyles$1g = useStyles$1f;
var __defProp$1u = Object.defineProperty;
var __getOwnPropSymbols$1u = Object.getOwnPropertySymbols;
var __hasOwnProp$1u = Object.prototype.hasOwnProperty;
var __propIsEnum$1u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1u = (obj, key, value) => key in obj ? __defProp$1u(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1u = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1u.call(b, prop))
      __defNormalProp$1u(a, prop, b[prop]);
  if (__getOwnPropSymbols$1u)
    for (var prop of __getOwnPropSymbols$1u(b)) {
      if (__propIsEnum$1u.call(b, prop))
        __defNormalProp$1u(a, prop, b[prop]);
    }
  return a;
};
var __objRest$W = (source, exclude) => {
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
const buttonSizes = {
  xs: 16,
  sm: 22,
  md: 24,
  lg: 26,
  xl: 30
};
function DefaultValue(_a) {
  var _b = _a, {
    label,
    classNames,
    styles,
    className,
    onRemove,
    disabled,
    readOnly,
    size: size2,
    radius = "sm"
  } = _b, others = __objRest$W(_b, ["label", "classNames", "styles", "className", "onRemove", "disabled", "readOnly", "size", "radius"]);
  const {
    classes,
    cx
  } = useStyles$1g({
    size: size2,
    disabled,
    readOnly,
    radius
  }, {
    classNames,
    styles,
    name: "MultiSelect"
  });
  return /* @__PURE__ */ jsxs("div", {
    ...__spreadValues$1u({
      className: cx(classes.defaultValue, className)
    }, others),
    children: [/* @__PURE__ */ jsx("span", {
      className: classes.defaultValueLabel,
      children: label
    }), !disabled && !readOnly && /* @__PURE__ */ jsx(CloseButton, {
      "aria-hidden": true,
      onMouseDown: onRemove,
      size: buttonSizes[size2],
      radius: 2,
      color: "blue",
      variant: "transparent",
      iconSize: buttonSizes[size2] / 2,
      className: classes.defaultValueRemove,
      tabIndex: -1
    })]
  });
}
DefaultValue.displayName = "@mantine/core/MultiSelect/DefaultValue";
function filterData$1({ data, searchable, limit, searchValue, filter, value }) {
  if (!searchable && value.length === 0) {
    return data;
  }
  if (!searchable) {
    const result2 = [];
    for (let i = 0; i < data.length; i += 1) {
      if (!value.some((val) => val === data[i].value && !data[i].disabled)) {
        result2.push(data[i]);
      }
    }
    return result2;
  }
  const result = [];
  for (let i = 0; i < data.length; i += 1) {
    if (filter(searchValue, value.some((val) => val === data[i].value && !data[i].disabled), data[i])) {
      result.push(data[i]);
    }
    if (result.length >= limit) {
      break;
    }
  }
  return result;
}
var __defProp$1t = Object.defineProperty;
var __getOwnPropSymbols$1t = Object.getOwnPropertySymbols;
var __hasOwnProp$1t = Object.prototype.hasOwnProperty;
var __propIsEnum$1t = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1t = (obj, key, value) => key in obj ? __defProp$1t(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1t = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1t.call(b, prop))
      __defNormalProp$1t(a, prop, b[prop]);
  if (__getOwnPropSymbols$1t)
    for (var prop of __getOwnPropSymbols$1t(b)) {
      if (__propIsEnum$1t.call(b, prop))
        __defNormalProp$1t(a, prop, b[prop]);
    }
  return a;
};
var __objRest$V = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1t.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1t)
    for (var prop of __getOwnPropSymbols$1t(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1t.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const iconSizes$3 = {
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
  } = _b, others = __objRest$V(_b, ["size", "error", "style"]);
  const theme = useMantineTheme();
  const _size = theme.fn.size({
    size: size2,
    sizes: iconSizes$3
  });
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1t({
      width: _size,
      height: _size,
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: __spreadValues$1t({
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
var __defProp$1s = Object.defineProperty;
var __defProps$N = Object.defineProperties;
var __getOwnPropDescs$N = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1s = Object.getOwnPropertySymbols;
var __hasOwnProp$1s = Object.prototype.hasOwnProperty;
var __propIsEnum$1s = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1s = (obj, key, value) => key in obj ? __defProp$1s(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1s = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1s.call(b, prop))
      __defNormalProp$1s(a, prop, b[prop]);
  if (__getOwnPropSymbols$1s)
    for (var prop of __getOwnPropSymbols$1s(b)) {
      if (__propIsEnum$1s.call(b, prop))
        __defNormalProp$1s(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$N = (a, b) => __defProps$N(a, __getOwnPropDescs$N(b));
var __objRest$U = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1s.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1s)
    for (var prop of __getOwnPropSymbols$1s(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1s.call(source, prop))
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
  } = _b, props = __objRest$U(_b, ["styles", "rightSection", "rightSectionWidth", "theme"]);
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
      ...__spreadValues$1s({}, props)
    }),
    styles: __spreadProps$N(__spreadValues$1s({}, _styles), {
      rightSection: __spreadProps$N(__spreadValues$1s({}, _styles == null ? void 0 : _styles.rightSection), {
        pointerEvents: props.shouldClear ? void 0 : "none"
      })
    })
  };
}
var __defProp$1r = Object.defineProperty;
var __defProps$M = Object.defineProperties;
var __getOwnPropDescs$M = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1r = Object.getOwnPropertySymbols;
var __hasOwnProp$1r = Object.prototype.hasOwnProperty;
var __propIsEnum$1r = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1r = (obj, key, value) => key in obj ? __defProp$1r(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1r = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1r.call(b, prop))
      __defNormalProp$1r(a, prop, b[prop]);
  if (__getOwnPropSymbols$1r)
    for (var prop of __getOwnPropSymbols$1r(b)) {
      if (__propIsEnum$1r.call(b, prop))
        __defNormalProp$1r(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$M = (a, b) => __defProps$M(a, __getOwnPropDescs$M(b));
var useStyles$1d = createStyles((theme, { size: size2, invalid }) => ({
  wrapper: {
    position: "relative"
  },
  values: {
    minHeight: theme.fn.size({ size: size2, sizes: sizes$j }) - 2,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: -theme.spacing.xs / 2,
    boxSizing: "border-box"
  },
  value: {
    margin: `${theme.spacing.xs / 2 - 2}px ${theme.spacing.xs / 2}px`
  },
  searchInput: __spreadProps$M(__spreadValues$1r({}, theme.fn.fontStyles()), {
    flex: 1,
    minWidth: 60,
    backgroundColor: "transparent",
    border: 0,
    outline: 0,
    fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
    padding: 0,
    marginLeft: theme.spacing.xs / 2,
    appearance: "none",
    color: "inherit",
    lineHeight: `${theme.fn.size({ size: size2, sizes: sizes$j }) - 2}px`,
    "&::placeholder": {
      opacity: 1,
      color: invalid ? theme.colors.red[theme.colorScheme === "dark" ? 6 : 7] : theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    },
    "&:disabled": {
      cursor: "not-allowed"
    }
  }),
  searchInputEmpty: {
    width: "100%"
  },
  searchInputInputHidden: {
    width: 0,
    height: 0,
    margin: 0,
    overflow: "hidden"
  },
  searchInputPointer: {
    cursor: "pointer",
    "&:disabled": {
      cursor: "not-allowed"
    }
  },
  input: {
    cursor: "pointer",
    "&:disabled": {
      cursor: "not-allowed"
    }
  }
}));
const useStyles$1e = useStyles$1d;
var __defProp$1q = Object.defineProperty;
var __defProps$L = Object.defineProperties;
var __getOwnPropDescs$L = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1q = Object.getOwnPropertySymbols;
var __hasOwnProp$1q = Object.prototype.hasOwnProperty;
var __propIsEnum$1q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1q = (obj, key, value) => key in obj ? __defProp$1q(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1q = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1q.call(b, prop))
      __defNormalProp$1q(a, prop, b[prop]);
  if (__getOwnPropSymbols$1q)
    for (var prop of __getOwnPropSymbols$1q(b)) {
      if (__propIsEnum$1q.call(b, prop))
        __defNormalProp$1q(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$L = (a, b) => __defProps$L(a, __getOwnPropDescs$L(b));
var __objRest$T = (source, exclude) => {
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
function defaultFilter$2(value, selected, item) {
  if (selected) {
    return false;
  }
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}
function defaultShouldCreate$1(query, data) {
  return !!query && !data.some((item) => item.value.toLowerCase() === query.toLowerCase());
}
function filterValue(value, data) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  if (data.length === 0) {
    return [];
  }
  const flatData = typeof data[0] === "object" ? data.map((item) => item.value) : data;
  return value.filter((val) => flatData.includes(val));
}
const defaultProps$u = {
  size: "sm",
  valueComponent: DefaultValue,
  itemComponent: DefaultItem$2,
  transition: "pop-top-left",
  transitionDuration: 0,
  maxDropdownHeight: 220,
  shadow: "sm",
  searchable: false,
  filter: defaultFilter$2,
  limit: Infinity,
  clearSearchOnChange: true,
  clearable: false,
  clearSearchOnBlur: false,
  disabled: false,
  initiallyOpened: false,
  creatable: false,
  shouldCreate: defaultShouldCreate$1,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  selectOnBlur: false,
  clearButtonTabIndex: 0,
  positionDependencies: []
};
const MultiSelect = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("MultiSelect", defaultProps$u, props), {
    className,
    style,
    required,
    label,
    description,
    size: size2,
    error,
    classNames,
    styles,
    wrapperProps,
    value,
    defaultValue,
    data,
    onChange,
    valueComponent: Value,
    itemComponent,
    id,
    transition,
    transitionDuration,
    transitionTimingFunction,
    maxDropdownHeight,
    shadow,
    nothingFound,
    onFocus,
    onBlur,
    searchable,
    placeholder,
    filter,
    limit,
    clearSearchOnChange,
    clearable,
    clearSearchOnBlur,
    clearButtonLabel,
    variant,
    onSearchChange,
    disabled,
    initiallyOpened,
    radius,
    icon,
    rightSection,
    rightSectionWidth,
    creatable,
    getCreateLabel,
    shouldCreate,
    onCreate,
    sx,
    dropdownComponent,
    onDropdownClose,
    onDropdownOpen,
    maxSelectedValues,
    withinPortal,
    switchDirectionOnFlip,
    zIndex,
    selectOnBlur,
    name,
    dropdownPosition,
    errorProps,
    labelProps,
    descriptionProps,
    clearButtonTabIndex,
    form,
    positionDependencies,
    onKeyDown,
    unstyled,
    inputContainer,
    inputWrapperOrder,
    readOnly,
    withAsterisk
  } = _a, others = __objRest$T(_a, ["className", "style", "required", "label", "description", "size", "error", "classNames", "styles", "wrapperProps", "value", "defaultValue", "data", "onChange", "valueComponent", "itemComponent", "id", "transition", "transitionDuration", "transitionTimingFunction", "maxDropdownHeight", "shadow", "nothingFound", "onFocus", "onBlur", "searchable", "placeholder", "filter", "limit", "clearSearchOnChange", "clearable", "clearSearchOnBlur", "clearButtonLabel", "variant", "onSearchChange", "disabled", "initiallyOpened", "radius", "icon", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "onCreate", "sx", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "maxSelectedValues", "withinPortal", "switchDirectionOnFlip", "zIndex", "selectOnBlur", "name", "dropdownPosition", "errorProps", "labelProps", "descriptionProps", "clearButtonTabIndex", "form", "positionDependencies", "onKeyDown", "unstyled", "inputContainer", "inputWrapperOrder", "readOnly", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1e({
    size: size2,
    invalid: !!error
  }, {
    classNames,
    styles,
    unstyled,
    name: "MultiSelect"
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const inputRef = react.exports.useRef();
  const wrapperRef = react.exports.useRef();
  const itemsRefs = react.exports.useRef({});
  const uuid2 = useId(id);
  const [dropdownOpened, _setDropdownOpened] = react.exports.useState(initiallyOpened);
  const [hovered, setHovered] = react.exports.useState(-1);
  const [direction, setDirection] = react.exports.useState("column");
  const [searchValue, setSearchValue] = react.exports.useState("");
  const [IMEOpen, setIMEOpen] = react.exports.useState(false);
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
  const isCreatable = creatable && typeof getCreateLabel === "function";
  let createLabel = null;
  const setDropdownOpened = (opened) => {
    _setDropdownOpened(opened);
    const handler = opened ? onDropdownOpen : onDropdownClose;
    typeof handler === "function" && handler();
  };
  const handleSearchChange = (val) => {
    typeof onSearchChange === "function" && onSearchChange(val);
    setSearchValue(val);
  };
  const formattedData = data.map((item) => typeof item === "string" ? {
    label: item,
    value: item
  } : item);
  const sortedData = groupOptions$1({
    data: formattedData
  });
  const [_value, setValue] = useUncontrolled({
    value: filterValue(value, data),
    defaultValue: filterValue(defaultValue, data),
    finalValue: [],
    onChange
  });
  const valuesOverflow = react.exports.useRef(!!maxSelectedValues && maxSelectedValues < _value.length);
  const handleValueRemove = (_val) => {
    if (!readOnly) {
      const newValue = _value.filter((val) => val !== _val);
      setValue(newValue);
      if (!!maxSelectedValues && newValue.length < maxSelectedValues) {
        valuesOverflow.current = false;
      }
    }
  };
  const handleInputChange = (event) => {
    handleSearchChange(event.currentTarget.value);
    !disabled && !valuesOverflow.current && searchable && setDropdownOpened(true);
  };
  const handleInputFocus = (event) => {
    typeof onFocus === "function" && onFocus(event);
    !disabled && !valuesOverflow.current && searchable && setDropdownOpened(true);
  };
  const filteredData = filterData$1({
    data: sortedData,
    searchable,
    searchValue,
    limit,
    filter,
    value: _value
  });
  const getNextIndex2 = (index2, nextItem, compareFn) => {
    let i = index2;
    while (compareFn(i)) {
      i = nextItem(i);
      if (!filteredData[i].disabled)
        return i;
    }
    return index2;
  };
  useDidUpdate(() => {
    setHovered(-1);
  }, [searchValue]);
  useDidUpdate(() => {
    if (!disabled && _value.length > data.length) {
      setDropdownOpened(false);
    }
    if (!!maxSelectedValues && _value.length < maxSelectedValues) {
      valuesOverflow.current = false;
    }
    if (!!maxSelectedValues && _value.length >= maxSelectedValues) {
      valuesOverflow.current = true;
      setDropdownOpened(false);
    }
  }, [_value]);
  const handleItemSelect = (item) => {
    if (!readOnly) {
      clearSearchOnChange && handleSearchChange("");
      if (_value.includes(item.value)) {
        handleValueRemove(item.value);
      } else {
        if (item.creatable && typeof onCreate === "function") {
          const createdItem = onCreate(item.value);
          if (typeof createdItem !== "undefined" && createdItem !== null) {
            if (typeof createdItem === "string") {
              setValue([..._value, createdItem]);
            } else {
              setValue([..._value, createdItem.value]);
            }
          }
        } else {
          setValue([..._value, item.value]);
        }
        if (_value.length === maxSelectedValues - 1) {
          valuesOverflow.current = true;
          setDropdownOpened(false);
        }
        if (hovered === filteredData.length - 1) {
          setHovered(filteredData.length - 2);
        }
      }
    }
  };
  const handleInputBlur = (event) => {
    typeof onBlur === "function" && onBlur(event);
    if (selectOnBlur && filteredData[hovered] && dropdownOpened) {
      handleItemSelect(filteredData[hovered]);
    }
    clearSearchOnBlur && handleSearchChange("");
    setDropdownOpened(false);
  };
  const handleInputKeydown = (event) => {
    if (IMEOpen) {
      return;
    }
    onKeyDown == null ? void 0 : onKeyDown(event);
    if (readOnly) {
      return;
    }
    if (event.key !== "Backspace" && !!maxSelectedValues && valuesOverflow.current) {
      return;
    }
    const isColumn = direction === "column";
    const handleNext = () => {
      setHovered((current) => {
        var _a2;
        const nextIndex = getNextIndex2(current, (index2) => index2 + 1, (index2) => index2 < filteredData.length - 1);
        if (dropdownOpened) {
          targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
          scrollIntoView({
            alignment: isColumn ? "end" : "start"
          });
        }
        return nextIndex;
      });
    };
    const handlePrevious = () => {
      setHovered((current) => {
        var _a2;
        const nextIndex = getNextIndex2(current, (index2) => index2 - 1, (index2) => index2 > 0);
        if (dropdownOpened) {
          targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
          scrollIntoView({
            alignment: isColumn ? "start" : "end"
          });
        }
        return nextIndex;
      });
    };
    switch (event.key) {
      case "ArrowUp": {
        event.preventDefault();
        setDropdownOpened(true);
        isColumn ? handlePrevious() : handleNext();
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        setDropdownOpened(true);
        isColumn ? handleNext() : handlePrevious();
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (filteredData[hovered] && dropdownOpened) {
          handleItemSelect(filteredData[hovered]);
        } else {
          setDropdownOpened(true);
        }
        break;
      }
      case " ": {
        if (!searchable) {
          event.preventDefault();
          if (filteredData[hovered] && dropdownOpened) {
            handleItemSelect(filteredData[hovered]);
          } else {
            setDropdownOpened(true);
          }
        }
        break;
      }
      case "Backspace": {
        if (_value.length > 0 && searchValue.length === 0) {
          setValue(_value.slice(0, -1));
          setDropdownOpened(true);
          if (maxSelectedValues) {
            valuesOverflow.current = false;
          }
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
          scrollIntoView({
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
          scrollIntoView({
            alignment: isColumn ? "end" : "start"
          });
        }
        break;
      }
      case "Escape": {
        setDropdownOpened(false);
      }
    }
  };
  const selectedItems = _value.map((val) => {
    let selectedItem = sortedData.find((item) => item.value === val && !item.disabled);
    if (!selectedItem && isCreatable) {
      selectedItem = {
        value: val,
        label: val
      };
    }
    return selectedItem;
  }).filter((val) => !!val).map((item) => /* @__PURE__ */ jsx(Value, {
    ...__spreadProps$L(__spreadValues$1q({}, item), {
      disabled,
      className: classes.value,
      readOnly,
      onRemove: (event) => {
        if (dropdownOpened) {
          event.preventDefault();
          event.stopPropagation();
        }
        handleValueRemove(item.value);
        setDropdownOpened(true);
      },
      key: item.value,
      size: size2,
      styles,
      classNames,
      radius
    })
  }));
  const handleClear = () => {
    var _a2;
    handleSearchChange("");
    setValue([]);
    (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    if (maxSelectedValues) {
      valuesOverflow.current = false;
    }
  };
  if (isCreatable && shouldCreate(searchValue, sortedData)) {
    createLabel = getCreateLabel(searchValue);
    filteredData.push({
      label: searchValue,
      value: searchValue,
      creatable: true
    });
  }
  const shouldRenderDropdown = !readOnly && (filteredData.length > 0 ? dropdownOpened : dropdownOpened && !!nothingFound);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1q(__spreadValues$1q({
      required,
      id: uuid2,
      label,
      error,
      description,
      size: size2,
      className,
      style,
      classNames,
      styles,
      __staticSelector: "MultiSelect",
      sx,
      errorProps,
      descriptionProps,
      labelProps,
      inputContainer,
      inputWrapperOrder,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsxs(SelectPopover, {
      opened: shouldRenderDropdown,
      transition,
      transitionDuration,
      shadow: "sm",
      withinPortal,
      __staticSelector: "MultiSelect",
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
          className: classes.wrapper,
          role: "combobox",
          "aria-haspopup": "listbox",
          "aria-owns": dropdownOpened && shouldRenderDropdown ? `${uuid2}-items` : null,
          "aria-controls": uuid2,
          "aria-expanded": dropdownOpened,
          onMouseLeave: () => setHovered(-1),
          tabIndex: -1,
          ref: wrapperRef,
          children: [/* @__PURE__ */ jsx("input", {
            type: "hidden",
            name,
            value: _value.join(","),
            form,
            disabled
          }), /* @__PURE__ */ jsx(Input, {
            ...__spreadValues$1q({
              __staticSelector: "MultiSelect",
              style: {
                overflow: "hidden"
              },
              component: "div",
              multiline: true,
              size: size2,
              variant,
              disabled,
              invalid: !!error,
              required,
              radius,
              icon,
              unstyled,
              onMouseDown: (event) => {
                var _a2;
                event.preventDefault();
                !disabled && !valuesOverflow.current && setDropdownOpened(!dropdownOpened);
                (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
              },
              classNames: __spreadProps$L(__spreadValues$1q({}, classNames), {
                input: cx({
                  [classes.input]: !searchable
                }, classNames == null ? void 0 : classNames.input)
              })
            }, getSelectRightSectionProps({
              theme,
              rightSection,
              rightSectionWidth,
              styles,
              size: size2,
              shouldClear: clearable && _value.length > 0,
              clearButtonLabel,
              onClear: handleClear,
              error,
              disabled,
              clearButtonTabIndex,
              readOnly
            })),
            children: /* @__PURE__ */ jsxs("div", {
              className: classes.values,
              children: [selectedItems, /* @__PURE__ */ jsx("input", {
                ...__spreadValues$1q({
                  ref: useMergedRef(ref, inputRef),
                  type: "search",
                  id: uuid2,
                  className: cx(classes.searchInput, {
                    [classes.searchInputPointer]: !searchable,
                    [classes.searchInputInputHidden]: !dropdownOpened && _value.length > 0 || !searchable && _value.length > 0,
                    [classes.searchInputEmpty]: _value.length === 0
                  }),
                  onKeyDown: handleInputKeydown,
                  value: searchValue,
                  onChange: handleInputChange,
                  onFocus: handleInputFocus,
                  onBlur: handleInputBlur,
                  readOnly: !searchable || valuesOverflow.current || readOnly,
                  placeholder: _value.length === 0 ? placeholder : void 0,
                  disabled,
                  "data-mantine-stop-propagation": dropdownOpened,
                  autoComplete: "off",
                  onCompositionStart: () => setIMEOpen(true),
                  onCompositionEnd: () => setIMEOpen(false)
                }, rest)
              })]
            })
          })]
        })
      }), /* @__PURE__ */ jsx(SelectPopover.Dropdown, {
        component: dropdownComponent || SelectScrollArea,
        maxHeight: maxDropdownHeight,
        direction,
        id: uuid2,
        innerRef: scrollableRef,
        __staticSelector: "MultiSelect",
        classNames,
        styles,
        children: /* @__PURE__ */ jsx(SelectItems, {
          data: filteredData,
          hovered,
          classNames,
          styles,
          uuid: uuid2,
          __staticSelector: "MultiSelect",
          onItemHover: setHovered,
          onItemSelect: handleItemSelect,
          itemsRefs,
          itemComponent,
          size: size2,
          nothingFound,
          creatable: creatable && !!createLabel,
          createLabel,
          unstyled
        })
      })]
    })
  });
});
MultiSelect.displayName = "@mantine/core/MultiSelect";
var __defProp$1p = Object.defineProperty;
var __defProps$K = Object.defineProperties;
var __getOwnPropDescs$K = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1p = Object.getOwnPropertySymbols;
var __hasOwnProp$1p = Object.prototype.hasOwnProperty;
var __propIsEnum$1p = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1p = (obj, key, value) => key in obj ? __defProp$1p(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1p = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1p.call(b, prop))
      __defNormalProp$1p(a, prop, b[prop]);
  if (__getOwnPropSymbols$1p)
    for (var prop of __getOwnPropSymbols$1p(b)) {
      if (__propIsEnum$1p.call(b, prop))
        __defNormalProp$1p(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$K = (a, b) => __defProps$K(a, __getOwnPropDescs$K(b));
var __objRest$S = (source, exclude) => {
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
const defaultProps$t = {
  size: "sm"
};
const NativeSelect = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("NativeSelect", defaultProps$t, props), {
    inputProps,
    wrapperProps,
    data,
    placeholder,
    onChange,
    value,
    classNames,
    styles,
    rightSection,
    rightSectionWidth
  } = _a, others = __objRest$S(_a, ["inputProps", "wrapperProps", "data", "placeholder", "onChange", "value", "classNames", "styles", "rightSection", "rightSectionWidth"]);
  const theme = useMantineTheme();
  const formattedData = data.map((item) => typeof item === "string" ? {
    label: item,
    value: item
  } : item);
  const options = formattedData.map((item) => /* @__PURE__ */ jsx("option", {
    value: item.value,
    disabled: item.disabled,
    children: item.label
  }, item.value));
  if (placeholder) {
    options.unshift(
      /* @__PURE__ */ jsx("option", {
        value: "",
        disabled: true,
        hidden: true,
        children: placeholder
      }, "placeholder")
    );
  }
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$K(__spreadValues$1p({}, wrapperProps), {
      __staticSelector: "NativeSelect"
    }),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadValues$1p(__spreadProps$K(__spreadValues$1p(__spreadValues$1p({}, inputProps), others), {
        onChange,
        component: "select",
        ref,
        value: value === null ? "" : value,
        __staticSelector: "NativeSelect",
        pointer: theme.cursorType === "pointer"
      }), getSelectRightSectionProps({
        theme,
        rightSection,
        rightSectionWidth,
        styles,
        shouldClear: false,
        size: inputProps.size,
        error: wrapperProps.error,
        readOnly: false
      })),
      children: options
    })
  });
});
NativeSelect.displayName = "@mantine/core/NativeSelect";
var __defProp$1o = Object.defineProperty;
var __defProps$J = Object.defineProperties;
var __getOwnPropDescs$J = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1o = Object.getOwnPropertySymbols;
var __hasOwnProp$1o = Object.prototype.hasOwnProperty;
var __propIsEnum$1o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1o = (obj, key, value) => key in obj ? __defProp$1o(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1o = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1o.call(b, prop))
      __defNormalProp$1o(a, prop, b[prop]);
  if (__getOwnPropSymbols$1o)
    for (var prop of __getOwnPropSymbols$1o(b)) {
      if (__propIsEnum$1o.call(b, prop))
        __defNormalProp$1o(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$J = (a, b) => __defProps$J(a, __getOwnPropDescs$J(b));
var useStyles$1b = createStyles((theme, { color, variant, noWrap, childrenOffset, alignIcon }) => {
  const colors = theme.fn.variant({ variant, color });
  return {
    root: __spreadProps$J(__spreadValues$1o({
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: `8px ${theme.spacing.sm}px`,
      userSelect: "none"
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$1o({
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
const useStyles$1c = useStyles$1b;
var __defProp$1n = Object.defineProperty;
var __getOwnPropSymbols$1n = Object.getOwnPropertySymbols;
var __hasOwnProp$1n = Object.prototype.hasOwnProperty;
var __propIsEnum$1n = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1n = (obj, key, value) => key in obj ? __defProp$1n(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1n = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1n.call(b, prop))
      __defNormalProp$1n(a, prop, b[prop]);
  if (__getOwnPropSymbols$1n)
    for (var prop of __getOwnPropSymbols$1n(b)) {
      if (__propIsEnum$1n.call(b, prop))
        __defNormalProp$1n(a, prop, b[prop]);
    }
  return a;
};
var __objRest$R = (source, exclude) => {
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
const defaultProps$s = {
  variant: "light",
  childrenOffset: "lg"
};
const _NavLink = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NavLink", defaultProps$s, props), {
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
  } = _a, others = __objRest$R(_a, ["label", "description", "icon", "rightSection", "className", "classNames", "styles", "unstyled", "active", "color", "variant", "noWrap", "children", "opened", "defaultOpened", "onChange", "disableRightSectionRotation", "childrenOffset", "disabled", "onClick"]);
  const {
    classes,
    cx
  } = useStyles$1c({
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
      ...__spreadValues$1n({
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
        children: withChildren ? rightSection || /* @__PURE__ */ jsx(ChevronIcon$1, {
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
var useStyles$19 = createStyles((theme, { color, radius, withTitle }, getRef) => {
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
const useStyles$1a = useStyles$19;
var __defProp$1m = Object.defineProperty;
var __defProps$I = Object.defineProperties;
var __getOwnPropDescs$I = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1m = Object.getOwnPropertySymbols;
var __hasOwnProp$1m = Object.prototype.hasOwnProperty;
var __propIsEnum$1m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1m = (obj, key, value) => key in obj ? __defProp$1m(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1m = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1m.call(b, prop))
      __defNormalProp$1m(a, prop, b[prop]);
  if (__getOwnPropSymbols$1m)
    for (var prop of __getOwnPropSymbols$1m(b)) {
      if (__propIsEnum$1m.call(b, prop))
        __defNormalProp$1m(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$I = (a, b) => __defProps$I(a, __getOwnPropDescs$I(b));
var __objRest$Q = (source, exclude) => {
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
  } = _a, others = __objRest$Q(_a, ["className", "color", "radius", "loading", "disallowClose", "title", "icon", "children", "onClose", "closeButtonProps", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1a({
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
    ...__spreadValues$1m({
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
      ...__spreadProps$I(__spreadValues$1m({}, closeButtonProps), {
        iconSize: 16,
        color: "gray",
        onClick: onClose,
        className: classes.closeButton
      })
    })]
  });
});
Notification.displayName = "@mantine/core/Notification";
const getInputMode = (step, precision, os) => {
  if (Number.isInteger(step) && step >= 0 && precision === 0)
    return "numeric";
  if (!Number.isInteger(step) && step >= 0 && precision !== 0)
    return "decimal";
  if (Number.isInteger(step) && step < 0 && precision === 0) {
    if (os === "ios")
      return "text";
    return "decimal";
  }
  if (!Number.isInteger(step) && step < 0 && precision !== 0) {
    if (os === "ios")
      return "text";
    return "decimal";
  }
  return "numeric";
};
function Chevron({
  direction,
  size: size2
}) {
  return /* @__PURE__ */ jsx("svg", {
    style: {
      transform: direction === "up" ? "rotate(180deg)" : void 0
    },
    width: size2,
    height: size2,
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", {
      d: "M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
const CONTROL_SIZES = {
  xs: 20,
  sm: 24,
  md: 30,
  lg: 34,
  xl: 36
};
var useStyles$17 = createStyles((theme, { radius, size: size2 }) => ({
  rightSection: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 2px)",
    margin: 1,
    marginRight: 1,
    overflow: "hidden",
    borderTopRightRadius: theme.fn.radius(radius),
    borderBottomRightRadius: theme.fn.radius(radius)
  },
  control: {
    margin: 0,
    position: "relative",
    flex: "0 0 50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: theme.fn.size({ size: size2, sizes: CONTROL_SIZES }),
    padding: 0,
    WebkitTapHighlightColor: "transparent",
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
    borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
    borderTop: 0,
    borderRight: 0,
    backgroundColor: "transparent",
    marginRight: 1,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:not(:disabled):hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    },
    "&:disabled": {
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]
    }
  },
  controlUp: {},
  controlDown: {
    borderBottom: 0
  }
}));
const useStyles$18 = useStyles$17;
var __defProp$1l = Object.defineProperty;
var __defProps$H = Object.defineProperties;
var __getOwnPropDescs$H = Object.getOwnPropertyDescriptors;
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
var __spreadProps$H = (a, b) => __defProps$H(a, __getOwnPropDescs$H(b));
var __objRest$P = (source, exclude) => {
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
const defaultFormatter = (value) => value || "";
const defaultParser = (num) => {
  if (num === "-") {
    return num;
  }
  let tempNum = num;
  if (tempNum[0] === ".") {
    tempNum = `0${num}`;
  }
  const parsedNum = parseFloat(tempNum);
  if (Number.isNaN(parsedNum)) {
    return void 0;
  }
  return num;
};
const CHEVRON_SIZES = {
  xs: 10,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20
};
const defaultProps$r = {
  step: 1,
  hideControls: false,
  size: "sm",
  precision: 0,
  noClampOnBlur: false,
  formatter: defaultFormatter,
  parser: defaultParser
};
const NumberInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NumberInput", defaultProps$r, props), {
    disabled,
    value,
    onChange,
    decimalSeparator,
    min,
    max,
    startValue,
    step,
    stepHoldInterval,
    stepHoldDelay,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    hideControls,
    radius,
    variant,
    precision,
    defaultValue,
    noClampOnBlur,
    handlersRef,
    classNames,
    styles,
    size: size2,
    rightSection,
    rightSectionWidth,
    formatter,
    parser,
    inputMode,
    unstyled
  } = _a, others = __objRest$P(_a, ["disabled", "value", "onChange", "decimalSeparator", "min", "max", "startValue", "step", "stepHoldInterval", "stepHoldDelay", "onBlur", "onFocus", "onKeyDown", "onKeyUp", "hideControls", "radius", "variant", "precision", "defaultValue", "noClampOnBlur", "handlersRef", "classNames", "styles", "size", "rightSection", "rightSectionWidth", "formatter", "parser", "inputMode", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$18({
    radius,
    size: size2
  }, {
    classNames,
    styles,
    unstyled,
    name: "NumberInput"
  });
  const [focused, setFocused] = react.exports.useState(false);
  const [_value, setValue] = react.exports.useState(typeof value === "number" ? value : typeof defaultValue === "number" ? defaultValue : void 0);
  const finalValue = typeof value === "number" ? value : _value;
  const [tempValue, setTempValue] = react.exports.useState(typeof finalValue === "number" ? finalValue.toFixed(precision) : "");
  const inputRef = react.exports.useRef();
  const handleValueChange = (val) => {
    if (val !== _value && !Number.isNaN(val)) {
      typeof onChange === "function" && onChange(val);
      setValue(val);
    }
  };
  const formatNum = (val = "") => {
    let parsedStr = typeof val === "number" ? String(val) : val;
    if (decimalSeparator) {
      parsedStr = parsedStr.replace(/\./g, decimalSeparator);
    }
    return formatter(parsedStr);
  };
  const parseNum = (val) => {
    let num = val;
    if (decimalSeparator) {
      num = num.replace(new RegExp(`\\${decimalSeparator}`, "g"), ".");
    }
    return parser(num);
  };
  const _min = typeof min === "number" ? min : -Infinity;
  const _max = typeof max === "number" ? max : Infinity;
  const incrementRef = react.exports.useRef();
  incrementRef.current = () => {
    var _a2, _b, _c;
    if (_value === void 0) {
      handleValueChange((_a2 = startValue != null ? startValue : min) != null ? _a2 : 0);
      setTempValue((_c = (_b = startValue == null ? void 0 : startValue.toFixed(precision)) != null ? _b : min == null ? void 0 : min.toFixed(precision)) != null ? _c : "0");
    } else {
      const result = clamp(_value + step, _min, _max).toFixed(precision);
      handleValueChange(parseFloat(result));
      setTempValue(result);
    }
  };
  const decrementRef = react.exports.useRef();
  decrementRef.current = () => {
    var _a2, _b, _c;
    if (_value === void 0) {
      handleValueChange((_a2 = startValue != null ? startValue : min) != null ? _a2 : 0);
      setTempValue((_c = (_b = startValue == null ? void 0 : startValue.toFixed(precision)) != null ? _b : min == null ? void 0 : min.toFixed(precision)) != null ? _c : "0");
    } else {
      const result = clamp(_value - step, _min, _max).toFixed(precision);
      handleValueChange(parseFloat(result));
      setTempValue(result);
    }
  };
  assignRef(handlersRef, {
    increment: incrementRef.current,
    decrement: decrementRef.current
  });
  react.exports.useEffect(() => {
    if (typeof value === "number" && !focused) {
      setValue(value);
      setTempValue(value.toFixed(precision));
    }
    if (defaultValue === void 0 && value === void 0 && !focused) {
      setValue(value);
      setTempValue("");
    }
  }, [value]);
  const shouldUseStepInterval = stepHoldDelay !== void 0 && stepHoldInterval !== void 0;
  const onStepTimeoutRef = react.exports.useRef(null);
  const stepCountRef = react.exports.useRef(0);
  const onStepDone = () => {
    if (onStepTimeoutRef.current) {
      window.clearTimeout(onStepTimeoutRef.current);
    }
    onStepTimeoutRef.current = null;
    stepCountRef.current = 0;
  };
  const onStepHandleChange = (isIncrement) => {
    if (isIncrement) {
      incrementRef.current();
    } else {
      decrementRef.current();
    }
    stepCountRef.current += 1;
  };
  const onStepLoop = (isIncrement) => {
    onStepHandleChange(isIncrement);
    if (shouldUseStepInterval) {
      const interval = typeof stepHoldInterval === "number" ? stepHoldInterval : stepHoldInterval(stepCountRef.current);
      onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), interval);
    }
  };
  const onStep = (event, isIncrement) => {
    event.preventDefault();
    inputRef.current.focus();
    onStepHandleChange(isIncrement);
    if (shouldUseStepInterval) {
      onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), stepHoldDelay);
    }
  };
  react.exports.useEffect(() => {
    onStepDone();
    return onStepDone;
  }, []);
  const controls = /* @__PURE__ */ jsxs("div", {
    className: classes.rightSection,
    children: [/* @__PURE__ */ jsx("button", {
      type: "button",
      tabIndex: -1,
      "aria-hidden": true,
      disabled: finalValue >= max,
      className: cx(classes.control, classes.controlUp),
      onPointerDown: (event) => {
        onStep(event, true);
      },
      onPointerUp: onStepDone,
      onPointerLeave: onStepDone,
      children: /* @__PURE__ */ jsx(Chevron, {
        size: theme.fn.size({
          size: size2,
          sizes: CHEVRON_SIZES
        }),
        direction: "up"
      })
    }), /* @__PURE__ */ jsx("button", {
      type: "button",
      tabIndex: -1,
      "aria-hidden": true,
      disabled: finalValue <= min,
      className: cx(classes.control, classes.controlDown),
      onPointerDown: (event) => {
        onStep(event, false);
      },
      onPointerUp: onStepDone,
      onPointerLeave: onStepDone,
      children: /* @__PURE__ */ jsx(Chevron, {
        size: theme.fn.size({
          size: size2,
          sizes: CHEVRON_SIZES
        }),
        direction: "down"
      })
    })]
  });
  const handleChange = (event) => {
    const evt = event.nativeEvent;
    if (evt.isComposing) {
      return;
    }
    const val = event.target.value;
    const parsed = parseNum(val);
    setTempValue(parsed);
    if (val === "" || val === "-") {
      handleValueChange(void 0);
    } else {
      val.trim() !== "" && !Number.isNaN(parsed) && handleValueChange(parseFloat(parsed));
    }
  };
  const handleBlur = (event) => {
    var _a2;
    if (event.target.value === "") {
      setTempValue("");
      handleValueChange(void 0);
    } else {
      let newNumber = event.target.value;
      if (newNumber[0] === `${decimalSeparator}` || newNumber[0] === ".") {
        newNumber = `0${newNumber}`;
      }
      const parsedVal = parseNum(newNumber);
      const val = clamp(parseFloat(parsedVal), _min, _max);
      if (!Number.isNaN(val)) {
        if (!noClampOnBlur) {
          setTempValue(val.toFixed(precision));
          handleValueChange(parseFloat(val.toFixed(precision)));
        }
      } else {
        setTempValue((_a2 = finalValue == null ? void 0 : finalValue.toFixed(precision)) != null ? _a2 : "");
      }
    }
    setFocused(false);
    typeof onBlur === "function" && onBlur(event);
  };
  const handleFocus = (event) => {
    setFocused(true);
    typeof onFocus === "function" && onFocus(event);
  };
  const handleKeyDown = (event) => {
    typeof onKeyDown === "function" && onKeyDown(event);
    if (event.repeat && shouldUseStepInterval && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp") {
      onStep(event, true);
    } else if (event.key === "ArrowDown") {
      onStep(event, false);
    }
  };
  const handleKeyUp = (event) => {
    typeof onKeyUp === "function" && onKeyUp(event);
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      onStepDone();
    }
  };
  return /* @__PURE__ */ jsx(TextInput, {
    ...__spreadProps$H(__spreadValues$1l({}, others), {
      variant,
      value: formatNum(tempValue),
      disabled,
      ref: useMergedRef(inputRef, ref),
      type: "text",
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      rightSection: rightSection || (disabled || hideControls || variant === "unstyled" ? null : controls),
      rightSectionWidth: rightSectionWidth || theme.fn.size({
        size: size2,
        sizes: CONTROL_SIZES
      }) + 1,
      radius,
      max,
      min,
      step,
      size: size2,
      styles,
      classNames,
      inputMode: inputMode || getInputMode(step, precision, useOs()),
      __staticSelector: "NumberInput",
      unstyled
    })
  });
});
NumberInput.displayName = "@mantine/core/NumberInput";
var __defProp$1k = Object.defineProperty;
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
function DotsIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1k({
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M2 8c0-.733.6-1.333 1.333-1.333.734 0 1.334.6 1.334 1.333s-.6 1.333-1.334 1.333C2.6 9.333 2 8.733 2 8zm9.333 0c0-.733.6-1.333 1.334-1.333C13.4 6.667 14 7.267 14 8s-.6 1.333-1.333 1.333c-.734 0-1.334-.6-1.334-1.333zM6.667 8c0-.733.6-1.333 1.333-1.333s1.333.6 1.333 1.333S8.733 9.333 8 9.333 6.667 8.733 6.667 8z",
      fill: "currentColor"
    })
  });
}
var __defProp$1j = Object.defineProperty;
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
function NextIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1j({
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M8.781 8l-3.3-3.3.943-.943L10.667 8l-4.243 4.243-.943-.943 3.3-3.3z",
      fill: "currentColor"
    })
  });
}
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
function PrevIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1i({
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M7.219 8l3.3 3.3-.943.943L5.333 8l4.243-4.243.943.943-3.3 3.3z",
      fill: "currentColor"
    })
  });
}
var __defProp$1h = Object.defineProperty;
var __getOwnPropSymbols$1h = Object.getOwnPropertySymbols;
var __hasOwnProp$1h = Object.prototype.hasOwnProperty;
var __propIsEnum$1h = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1h = (obj, key, value) => key in obj ? __defProp$1h(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
function FirstIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1h({
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z",
      fill: "currentColor"
    })
  });
}
var __defProp$1g = Object.defineProperty;
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
function LastIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1g({
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z",
      fill: "currentColor"
    })
  });
}
var __defProp$1f = Object.defineProperty;
var __getOwnPropSymbols$1f = Object.getOwnPropertySymbols;
var __hasOwnProp$1f = Object.prototype.hasOwnProperty;
var __propIsEnum$1f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1f = (obj, key, value) => key in obj ? __defProp$1f(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$O = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1f.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1f)
    for (var prop of __getOwnPropSymbols$1f(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1f.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const icons$1 = {
  dots: DotsIcon,
  next: NextIcon,
  prev: PrevIcon,
  first: FirstIcon,
  last: LastIcon
};
const rtlIcons = {
  dots: DotsIcon,
  prev: NextIcon,
  next: PrevIcon,
  last: FirstIcon,
  first: LastIcon
};
function DefaultItem$1(_a) {
  var _b = _a, {
    page,
    active,
    onClick
  } = _b, others = __objRest$O(_b, ["page", "active", "onClick"]);
  const theme = useMantineTheme();
  const Item = (theme.dir === "rtl" ? rtlIcons : icons$1)[page];
  const children = Item ? /* @__PURE__ */ jsx(Item, {}) : page;
  return /* @__PURE__ */ jsx("button", {
    ...__spreadValues$1f({
      type: "button",
      onClick
    }, others),
    children
  });
}
DefaultItem$1.displayName = "@mantine/core/Pagination/DefaultItem";
var __defProp$1e = Object.defineProperty;
var __defProps$G = Object.defineProperties;
var __getOwnPropDescs$G = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1e = Object.getOwnPropertySymbols;
var __hasOwnProp$1e = Object.prototype.hasOwnProperty;
var __propIsEnum$1e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1e = (obj, key, value) => key in obj ? __defProp$1e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$G = (a, b) => __defProps$G(a, __getOwnPropDescs$G(b));
const sizes$8 = {
  xs: 22,
  sm: 26,
  md: 32,
  lg: 38,
  xl: 44
};
var useStyles$15 = createStyles((theme, { size: size2, radius, color }) => {
  const colors = theme.fn.variant({ color, variant: "filled" });
  return {
    item: __spreadProps$G(__spreadValues$1e({}, theme.fn.focusStyles()), {
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size: size2, sizes: sizes$8 }),
      minWidth: theme.fn.size({ size: size2, sizes: sizes$8 }),
      padding: `0 ${theme.fn.size({ size: size2, sizes: theme.spacing }) / 2}px`,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      borderRadius: theme.fn.radius(radius),
      lineHeight: 1,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      "&:active:not(:disabled):not([data-dots])": theme.activeStyles,
      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      },
      "&[data-dots]": {
        cursor: "default",
        borderColor: "transparent",
        backgroundColor: "transparent"
      },
      "&[data-active]": {
        borderColor: "transparent",
        color: colors.color,
        backgroundColor: colors.background
      }
    })
  };
});
const useStyles$16 = useStyles$15;
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
var __objRest$N = (source, exclude) => {
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
const defaultProps$q = {
  itemComponent: DefaultItem$1,
  initialPage: 1,
  siblings: 1,
  boundaries: 1,
  size: "md",
  radius: "sm",
  withEdges: false,
  withControls: true
};
const Pagination = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Pagination", defaultProps$q, props), {
    itemComponent: Item,
    classNames,
    styles,
    page,
    initialPage,
    color,
    total,
    siblings,
    boundaries,
    size: size2,
    radius,
    onChange,
    getItemAriaLabel,
    spacing,
    withEdges,
    withControls,
    sx,
    unstyled
  } = _a, others = __objRest$N(_a, ["itemComponent", "classNames", "styles", "page", "initialPage", "color", "total", "siblings", "boundaries", "size", "radius", "onChange", "getItemAriaLabel", "spacing", "withEdges", "withControls", "sx", "unstyled"]);
  const {
    classes,
    theme
  } = useStyles$16({
    color,
    size: size2,
    radius
  }, {
    classNames,
    styles,
    unstyled,
    name: "Pagination"
  });
  const {
    range: range2,
    setPage,
    next,
    previous,
    active,
    first,
    last
  } = usePagination({
    page,
    siblings,
    total,
    onChange,
    initialPage,
    boundaries
  });
  const items = range2.map((pageNumber, index2) => /* @__PURE__ */ jsx(Item, {
    page: pageNumber,
    active: pageNumber === active,
    "aria-current": pageNumber === active ? "page" : void 0,
    "aria-label": typeof getItemAriaLabel === "function" ? getItemAriaLabel(pageNumber) : null,
    tabIndex: pageNumber === "dots" ? -1 : 0,
    "data-dots": pageNumber === "dots" || void 0,
    "data-active": pageNumber === active || void 0,
    className: classes.item,
    onClick: pageNumber !== "dots" ? () => setPage(pageNumber) : void 0
  }, index2));
  return /* @__PURE__ */ jsxs(Group, {
    ...__spreadValues$1d({
      role: "navigation",
      spacing: spacing || theme.fn.size({
        size: size2,
        sizes: theme.spacing
      }) / 2,
      ref,
      sx,
      unstyled
    }, others),
    children: [withEdges && /* @__PURE__ */ jsx(Item, {
      page: "first",
      onClick: first,
      "aria-label": getItemAriaLabel ? getItemAriaLabel("first") : void 0,
      "aria-disabled": active === 1,
      className: classes.item,
      disabled: active === 1
    }), withControls && /* @__PURE__ */ jsx(Item, {
      page: "prev",
      onClick: previous,
      "aria-label": getItemAriaLabel ? getItemAriaLabel("prev") : void 0,
      "aria-disabled": active === 1,
      className: classes.item,
      disabled: active === 1
    }), items, withControls && /* @__PURE__ */ jsx(Item, {
      page: "next",
      onClick: next,
      "aria-label": getItemAriaLabel ? getItemAriaLabel("next") : void 0,
      "aria-disabled": active === total,
      className: classes.item,
      disabled: active === total
    }), withEdges && /* @__PURE__ */ jsx(Item, {
      page: "last",
      onClick: last,
      "aria-label": getItemAriaLabel ? getItemAriaLabel("last") : void 0,
      "aria-disabled": active === total,
      className: classes.item,
      disabled: active === total
    })]
  });
});
Pagination.displayName = "@mantine/core/Pagination";
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
function RadioIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1c({
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 5 5"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      fill: "currentColor",
      d: "M0 2.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
    })
  });
}
const RadioGroupContext = react.exports.createContext(null);
const RadioGroupProvider = RadioGroupContext.Provider;
const useRadioGroupContext = () => react.exports.useContext(RadioGroupContext);
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
var __objRest$M = (source, exclude) => {
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
const defaultProps$p = {
  orientation: "horizontal",
  spacing: "lg",
  offset: "xs",
  size: "sm"
};
const RadioGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RadioGroup", defaultProps$p, props), {
    children,
    value,
    defaultValue,
    onChange,
    orientation,
    spacing,
    size: size2,
    wrapperProps,
    unstyled,
    offset: offset2
  } = _a, others = __objRest$M(_a, ["children", "value", "defaultValue", "onChange", "orientation", "spacing", "size", "wrapperProps", "unstyled", "offset"]);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const handleChange = (event) => setValue(event.currentTarget.value);
  return /* @__PURE__ */ jsx(RadioGroupProvider, {
    value: {
      value: _value,
      onChange: handleChange,
      size: size2
    },
    children: /* @__PURE__ */ jsx(Input.Wrapper, {
      ...__spreadValues$1b(__spreadValues$1b({
        labelElement: "div",
        size: size2,
        __staticSelector: "RadioGroup",
        ref,
        unstyled
      }, wrapperProps), others),
      children: /* @__PURE__ */ jsx(InputsGroup, {
        spacing,
        orientation,
        unstyled,
        role: "radiogroup",
        offset: offset2,
        children
      })
    })
  });
});
RadioGroup.displayName = "@mantine/core/RadioGroup";
var __defProp$1a = Object.defineProperty;
var __defProps$F = Object.defineProperties;
var __getOwnPropDescs$F = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1a = Object.getOwnPropertySymbols;
var __hasOwnProp$1a = Object.prototype.hasOwnProperty;
var __propIsEnum$1a = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1a = (obj, key, value) => key in obj ? __defProp$1a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$F = (a, b) => __defProps$F(a, __getOwnPropDescs$F(b));
const sizes$7 = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 30,
  xl: 36
};
const iconSizes$2 = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16
};
var useStyles$13 = createStyles((theme, { size: size2, color, transitionDuration }, getRef) => {
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    radioWrapper: {
      display: "flex",
      alignItems: "center",
      WebkitTapHighlightColor: "transparent"
    },
    inner: {
      position: "relative"
    },
    icon: {
      ref: getRef("icon"),
      color: theme.white,
      opacity: 0,
      transform: "scale(0.75) translateY(2px)",
      transition: `opacity ${transitionDuration}ms ${theme.transitionTimingFunction}`,
      pointerEvents: "none",
      width: theme.fn.size({ sizes: iconSizes$2, size: size2 }),
      height: theme.fn.size({ sizes: iconSizes$2, size: size2 }),
      position: "absolute",
      top: `calc(50% - ${theme.fn.size({ sizes: iconSizes$2, size: size2 }) / 2}px)`,
      left: `calc(50% - ${theme.fn.size({ sizes: iconSizes$2, size: size2 }) / 2}px)`
    },
    radio: __spreadProps$F(__spreadValues$1a({}, theme.fn.focusStyles()), {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      position: "relative",
      appearance: "none",
      width: theme.fn.size({ sizes: sizes$7, size: size2 }),
      height: theme.fn.size({ sizes: sizes$7, size: size2 }),
      borderRadius: theme.fn.size({ sizes: sizes$7, size: size2 }),
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transitionProperty: "background-color, border-color",
      transitionTimingFunction: theme.transitionTimingFunction,
      transitionDuration: `${transitionDuration}ms`,
      cursor: theme.cursorType,
      "&:checked": {
        background: colors.background,
        borderColor: colors.background,
        [`& + .${getRef("icon")}`]: {
          opacity: 1,
          transform: "scale(1)"
        }
      },
      "&:disabled": {
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[4],
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        [`& + .${getRef("icon")}`]: {
          color: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4]
        }
      }
    }),
    label: __spreadProps$F(__spreadValues$1a({}, theme.fn.fontStyles()), {
      display: "flex",
      alignItems: "flex-start",
      fontSize: theme.fontSizes[size2] || theme.fontSizes.md,
      lineHeight: `${theme.fn.size({ sizes: sizes$7, size: size2 })}px`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      paddingLeft: theme.spacing.sm,
      cursor: theme.cursorType,
      "&[data-disabled]": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      }
    })
  };
});
const useStyles$14 = useStyles$13;
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
var __objRest$L = (source, exclude) => {
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
  icon: RadioIcon,
  transitionDuration: 100,
  size: "sm"
};
const Radio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Radio", defaultProps$o, props), {
    className,
    style,
    id,
    label,
    size: size2,
    title,
    disabled,
    color,
    classNames,
    styles,
    sx,
    icon: Icon,
    transitionDuration,
    wrapperProps,
    unstyled
  } = _a, others = __objRest$L(_a, ["className", "style", "id", "label", "size", "title", "disabled", "color", "classNames", "styles", "sx", "icon", "transitionDuration", "wrapperProps", "unstyled"]);
  const ctx = useRadioGroupContext();
  const {
    classes,
    cx
  } = useStyles$14({
    color,
    size: (ctx == null ? void 0 : ctx.size) || size2,
    transitionDuration
  }, {
    classNames,
    styles,
    unstyled,
    name: "Radio"
  });
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const uuid2 = useId(id);
  const contextProps = ctx ? {
    checked: ctx.value === rest.value,
    onChange: ctx.onChange
  } : {};
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$19(__spreadValues$19({
      className: cx(classes.radioWrapper, className),
      style,
      title,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsxs("div", {
      className: classes.inner,
      children: [/* @__PURE__ */ jsx("input", {
        ...__spreadValues$19(__spreadValues$19({
          ref,
          className: classes.radio,
          type: "radio",
          id: uuid2,
          disabled
        }, rest), contextProps)
      }), /* @__PURE__ */ jsx(Icon, {
        className: classes.icon,
        "aria-hidden": true
      })]
    }), label && /* @__PURE__ */ jsx("label", {
      "data-disabled": disabled || void 0,
      className: classes.label,
      htmlFor: uuid2,
      children: label
    })]
  });
});
Radio.displayName = "@mantine/core/Radio";
Radio.Group = RadioGroup;
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
var __defProp$18 = Object.defineProperty;
var __getOwnPropSymbols$18 = Object.getOwnPropertySymbols;
var __hasOwnProp$18 = Object.prototype.hasOwnProperty;
var __propIsEnum$18 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$18 = (obj, key, value) => key in obj ? __defProp$18(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
      ...__spreadValues$18({
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
var __defProp$17 = Object.defineProperty;
var __defProps$E = Object.defineProperties;
var __getOwnPropDescs$E = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$17 = Object.getOwnPropertySymbols;
var __hasOwnProp$17 = Object.prototype.hasOwnProperty;
var __propIsEnum$17 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$17 = (obj, key, value) => key in obj ? __defProp$17(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$E = (a, b) => __defProps$E(a, __getOwnPropDescs$E(b));
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
  curvesInOrder.push(__spreadProps$E(__spreadValues$17({}, curves[curves.length - 1]), { lineRoundCaps: false }));
  if (curves.length > 2) {
    curvesInOrder.push(__spreadProps$E(__spreadValues$17({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
    curvesInOrder.push(__spreadProps$E(__spreadValues$17({}, curves[curves.length - 2]), { lineRoundCaps: renderRoundedLineCaps }));
    for (let i = 1; i <= curves.length - 3; i += 1) {
      curvesInOrder.push(__spreadProps$E(__spreadValues$17({}, curves[i]), { lineRoundCaps: false }));
    }
  } else {
    curvesInOrder.push(__spreadProps$E(__spreadValues$17({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
  }
  return curvesInOrder;
}
var useStyles$11 = createStyles({
  root: {
    position: "relative"
  },
  label: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)"
  }
});
const useStyles$12 = useStyles$11;
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
var __objRest$K = (source, exclude) => {
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
const defaultProps$n = {
  size: 120,
  thickness: 12
};
const RingProgress = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RingProgress", defaultProps$n, props), {
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
  } = _a, others = __objRest$K(_a, ["className", "style", "label", "sections", "size", "thickness", "classNames", "styles", "roundCaps", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$12(null, {
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
  }).map((curve, index2) => {
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
    }, index2);
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$16({
      style: __spreadValues$16({
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
var __defProp$15 = Object.defineProperty;
var __defProps$D = Object.defineProperties;
var __getOwnPropDescs$D = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$15 = Object.getOwnPropertySymbols;
var __hasOwnProp$15 = Object.prototype.hasOwnProperty;
var __propIsEnum$15 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$15 = (obj, key, value) => key in obj ? __defProp$15(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$D = (a, b) => __defProps$D(a, __getOwnPropDescs$D(b));
const WRAPPER_PADDING = 4;
const sizes$6 = {
  xs: "3px 6px",
  sm: "5px 10px",
  md: "7px 14px",
  lg: "9px 16px",
  xl: "12px 20px"
};
var useStyles$$ = createStyles((theme, {
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
    label: __spreadProps$D(__spreadValues$15(__spreadValues$15({
      ref: getRef("label")
    }, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      borderRadius: theme.fn.radius(radius),
      fontWeight: 500,
      fontSize: size2 in theme.fontSizes ? theme.fontSizes[size2] : theme.fontSizes.sm,
      cursor: "pointer",
      display: "block",
      textAlign: "center",
      padding: sizes$6[size2 in sizes$6 ? size2 : "sm"],
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
      backgroundColor: shouldAnimate ? color in theme.colors ? colors.background : theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white : void 0
    },
    labelActive: {
      "&, &:hover": {
        color: color in theme.colors || theme.colorScheme === "dark" ? theme.white : theme.black
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
      backgroundColor: color in theme.colors ? colors.background : theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white
    }
  };
});
const useStyles$10 = useStyles$$;
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
const defaultProps$m = {
  disabled: false,
  size: "sm",
  transitionDuration: 200
};
const SegmentedControl = react.exports.forwardRef((props, ref) => {
  var _b, _c;
  const _a = useComponentDefaultProps("SegmentedControl", defaultProps$m, props), {
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
  } = _a, others = __objRest$J(_a, ["className", "disabled", "data", "name", "value", "onChange", "color", "fullWidth", "radius", "size", "transitionDuration", "transitionTimingFunction", "classNames", "styles", "defaultValue", "orientation", "unstyled"]);
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
    finalValue: Array.isArray(data) ? (_c = (_b = data.find((item) => !item.disabled)) == null ? void 0 : _b.value) != null ? _c : data[0].value : null,
    onChange
  });
  const {
    classes,
    cx
  } = useStyles$10({
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
  useIsomorphicEffect$3(() => {
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
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$14({
      className: cx(classes.root, className),
      ref: useMergedRef(observerRef, ref)
    }, others),
    children: [!!_value && shouldAnimate && /* @__PURE__ */ jsx(Box, {
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
var useStyles$Z = createStyles(() => ({
  input: {
    "&:not(:disabled)": {
      cursor: "pointer",
      "&::selection": {
        backgroundColor: "transparent"
      }
    }
  }
}));
const useStyles$_ = useStyles$Z;
var __defProp$13 = Object.defineProperty;
var __defProps$C = Object.defineProperties;
var __getOwnPropDescs$C = Object.getOwnPropertyDescriptors;
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
var __spreadProps$C = (a, b) => __defProps$C(a, __getOwnPropDescs$C(b));
var __objRest$I = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$13.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$13)
    for (var prop of __getOwnPropSymbols$13(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$13.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function defaultFilter$1(value, item) {
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}
function defaultShouldCreate(query, data) {
  return !!query && !data.some((item) => item.label.toLowerCase() === query.toLowerCase());
}
const defaultProps$l = {
  required: false,
  size: "sm",
  shadow: "sm",
  itemComponent: DefaultItem$2,
  transition: "fade",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter$1,
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
  const _a = useInputProps("Select", defaultProps$l, props), {
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
  } = _a, others = __objRest$I(_a, ["inputProps", "wrapperProps", "shadow", "data", "value", "defaultValue", "onChange", "itemComponent", "onKeyDown", "onBlur", "onFocus", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "unstyled", "classNames", "styles", "filter", "maxDropdownHeight", "searchable", "clearable", "nothingFound", "clearButtonLabel", "limit", "disabled", "onSearchChange", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "selectOnBlur", "onCreate", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "name", "dropdownPosition", "allowDeselect", "placeholder", "filterDataOnExactSearchMatch", "clearButtonTabIndex", "form", "positionDependencies", "readOnly"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$_();
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
  const sortedData = groupOptions$1({
    data: formattedData
  });
  const [_value, handleChange, controlled] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  });
  const selectedValue = sortedData.find((item) => item.value === _value);
  const [inputValue, setInputValue] = react.exports.useState((selectedValue == null ? void 0 : selectedValue.label) || "");
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
  const getNextIndex2 = (index2, nextItem, compareFn) => {
    let i = index2;
    while (compareFn(i)) {
      i = nextItem(i);
      if (!filteredData[i].disabled)
        return i;
    }
    return index2;
  };
  useDidUpdate(() => {
    setHovered(-1);
  }, [inputValue]);
  const selectedItemIndex = _value ? filteredData.findIndex((el) => el.value === _value) : 0;
  const handlePrevious = () => {
    setHovered((current) => {
      var _a2;
      const nextIndex = getNextIndex2(current, (index2) => index2 - 1, (index2) => index2 > 0);
      targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
      scrollIntoView({
        alignment: isColumn ? "start" : "end"
      });
      return nextIndex;
    });
  };
  const handleNext = () => {
    setHovered((current) => {
      var _a2;
      const nextIndex = getNextIndex2(current, (index2) => index2 + 1, (index2) => index2 < filteredData.length - 1);
      targetRef.current = itemsRefs.current[(_a2 = filteredData[nextIndex]) == null ? void 0 : _a2.value];
      scrollIntoView({
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
          scrollIntoView({
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
          scrollIntoView({
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
          if (filteredData[hovered] && dropdownOpened) {
            event.preventDefault();
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
      scrollSelectedItemIntoView();
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
      let dropdownOpen = true;
      if (!searchable) {
        dropdownOpen = !dropdownOpened;
      }
      setDropdownOpened(dropdownOpen);
      if (_value && dropdownOpen) {
        setHovered(selectedItemIndex);
        scrollSelectedItemIntoView();
      }
    }
  };
  const shouldShowDropdown = !readOnly && (filteredData.length > 0 ? dropdownOpened : dropdownOpened && !!nothingFound);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadProps$C(__spreadValues$13({}, wrapperProps), {
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
            ...__spreadValues$13(__spreadProps$C(__spreadValues$13(__spreadValues$13({
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
              onClick: handleInputClick,
              onBlur: handleInputBlur,
              onFocus: handleInputFocus,
              readOnly: !searchable || readOnly,
              disabled,
              "data-mantine-stop-propagation": shouldShowDropdown,
              name: null,
              classNames: __spreadProps$C(__spreadValues$13({}, classNames), {
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
function getSortedBreakpoints(theme, breakpoints) {
  if (breakpoints.length === 0) {
    return breakpoints;
  }
  const property = "maxWidth" in breakpoints[0] ? "maxWidth" : "minWidth";
  const sorted = [...breakpoints].sort((a, b) => theme.fn.size({ size: b[property], sizes: theme.breakpoints }) - theme.fn.size({ size: a[property], sizes: theme.breakpoints }));
  return property === "minWidth" ? sorted.reverse() : sorted;
}
var __defProp$12 = Object.defineProperty;
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
var useStyles$X = createStyles((theme, { spacing, breakpoints, cols }) => {
  const gridBreakpoints = getSortedBreakpoints(theme, breakpoints).reduce((acc, breakpoint) => {
    const property = "maxWidth" in breakpoint ? "max-width" : "min-width";
    const breakpointSize = theme.fn.size({
      size: property === "max-width" ? breakpoint.maxWidth : breakpoint.minWidth,
      sizes: theme.breakpoints
    });
    acc[`@media (${property}: ${breakpointSize + (property === "max-width" ? 0 : 1)}px)`] = {
      gridTemplateColumns: `repeat(${breakpoint.cols}, minmax(0, 1fr))`,
      gap: theme.fn.size({
        size: breakpoint.spacing || spacing,
        sizes: theme.spacing
      })
    };
    return acc;
  }, {});
  return {
    root: __spreadValues$12({
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: theme.fn.size({ size: spacing, sizes: theme.spacing })
    }, gridBreakpoints)
  };
});
const useStyles$Y = useStyles$X;
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
var __objRest$H = (source, exclude) => {
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
const defaultProps$k = {
  breakpoints: [],
  cols: 1,
  spacing: "md"
};
const SimpleGrid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("SimpleGrid", defaultProps$k, props), {
    className,
    breakpoints,
    cols,
    spacing,
    children,
    unstyled
  } = _a, others = __objRest$H(_a, ["className", "breakpoints", "cols", "spacing", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$Y({
    breakpoints,
    cols,
    spacing
  }, {
    unstyled,
    name: "SimpleGrid"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$11({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
SimpleGrid.displayName = "@mantine/core/SimpleGrid";
const fade = keyframes({
  "from, to": { opacity: 0.4 },
  "50%": { opacity: 1 }
});
var useStyles$V = createStyles((theme, { height, width, radius, circle, animate }) => ({
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
const useStyles$W = useStyles$V;
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
var __objRest$G = (source, exclude) => {
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
const defaultProps$j = {
  height: "auto",
  width: "100%",
  visible: true,
  animate: true
};
const Skeleton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Skeleton", defaultProps$j, props), {
    height,
    width,
    visible: visible2,
    animate,
    className,
    circle,
    radius,
    unstyled
  } = _a, others = __objRest$G(_a, ["height", "width", "visible", "animate", "className", "circle", "radius", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$W({
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
    ...__spreadValues$10({
      className: cx(classes.root, {
        [classes.visible]: visible2
      }, className),
      ref
    }, others)
  });
});
Skeleton.displayName = "@mantine/core/Skeleton";
function getPosition({ value, min, max }) {
  const position = (value - min) / (max - min) * 100;
  return Math.min(Math.max(position, 0), 100);
}
function getChangeValue({
  value,
  containerWidth,
  min,
  max,
  step,
  precision
}) {
  const left = !containerWidth ? value : Math.min(Math.max(value, 0), containerWidth) / containerWidth;
  const dx = left * (max - min);
  const nextValue = (dx !== 0 ? Math.round(dx / step) * step : 0) + min;
  if (precision !== void 0) {
    return Number(nextValue.toFixed(precision));
  }
  return nextValue;
}
var __defProp$$ = Object.defineProperty;
var __defProps$B = Object.defineProperties;
var __getOwnPropDescs$B = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$$ = Object.getOwnPropertySymbols;
var __hasOwnProp$$ = Object.prototype.hasOwnProperty;
var __propIsEnum$$ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$$ = (obj, key, value) => key in obj ? __defProp$$(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$B = (a, b) => __defProps$B(a, __getOwnPropDescs$B(b));
const sizes$5 = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12
};
var useStyles$T = createStyles((theme, { size: size2, disabled }) => ({
  root: __spreadProps$B(__spreadValues$$({}, theme.fn.fontStyles()), {
    WebkitTapHighlightColor: "transparent",
    outline: 0,
    height: theme.fn.size({ sizes: sizes$5, size: size2 }) * 2,
    display: "flex",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none"
  })
}));
const useStyles$U = useStyles$T;
var __defProp$_ = Object.defineProperty;
var __defProps$A = Object.defineProperties;
var __getOwnPropDescs$A = Object.getOwnPropertyDescriptors;
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
var __spreadProps$A = (a, b) => __defProps$A(a, __getOwnPropDescs$A(b));
var useStyles$R = createStyles((theme, { color, size: size2, disabled, thumbSize }) => ({
  label: {
    position: "absolute",
    top: -36,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[9],
    fontSize: theme.fontSizes.xs,
    color: theme.white,
    padding: theme.spacing.xs / 2,
    borderRadius: theme.radius.sm,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
    touchAction: "none"
  },
  thumb: __spreadProps$A(__spreadValues$_({}, theme.fn.focusStyles()), {
    boxSizing: "border-box",
    position: "absolute",
    display: disabled ? "none" : "flex",
    height: thumbSize || theme.fn.size({ sizes: sizes$5, size: size2 }) * 2,
    width: thumbSize || theme.fn.size({ sizes: sizes$5, size: size2 }) * 2,
    backgroundColor: theme.colorScheme === "dark" ? theme.fn.themeColor(color, theme.fn.primaryShade()) : theme.white,
    border: `4px solid ${theme.colorScheme === "dark" ? theme.white : theme.fn.themeColor(color, theme.fn.primaryShade())}`,
    color: theme.colorScheme === "dark" ? theme.white : theme.fn.themeColor(color, theme.fn.primaryShade()),
    transform: "translate(-50%, -50%)",
    top: "50%",
    cursor: "pointer",
    borderRadius: 1e3,
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: "100ms",
    transitionProperty: "box-shadow, transform",
    transitionTimingFunction: theme.transitionTimingFunction,
    zIndex: 3,
    userSelect: "none",
    touchAction: "none"
  }),
  dragging: {
    transform: "translate(-50%, -50%) scale(1.05)",
    boxShadow: theme.shadows.sm
  }
}));
const useStyles$S = useStyles$R;
const Thumb = react.exports.forwardRef(({
  max,
  min,
  value,
  position,
  label,
  dragging,
  onMouseDown,
  color,
  classNames,
  styles,
  size: size2,
  labelTransition,
  labelTransitionDuration,
  labelTransitionTimingFunction,
  labelAlwaysOn,
  thumbLabel,
  onFocus,
  onBlur,
  showLabelOnHover,
  children = null,
  disabled,
  unstyled,
  thumbSize
}, ref) => {
  const {
    classes,
    cx,
    theme
  } = useStyles$S({
    color,
    size: size2,
    disabled,
    thumbSize
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  const [focused, setFocused] = react.exports.useState(false);
  const isVisible = labelAlwaysOn || dragging || focused || showLabelOnHover;
  return /* @__PURE__ */ jsxs(Box, {
    tabIndex: 0,
    role: "slider",
    "aria-label": thumbLabel,
    "aria-valuemax": max,
    "aria-valuemin": min,
    "aria-valuenow": value,
    ref,
    className: cx(classes.thumb, {
      [classes.dragging]: dragging
    }),
    onFocus: () => {
      setFocused(true);
      typeof onFocus === "function" && onFocus();
    },
    onBlur: () => {
      setFocused(false);
      typeof onBlur === "function" && onBlur();
    },
    onTouchStart: onMouseDown,
    onMouseDown,
    onClick: (event) => event.stopPropagation(),
    style: {
      [theme.dir === "rtl" ? "right" : "left"]: `${position}%`
    },
    children: [children, /* @__PURE__ */ jsx(Transition$2, {
      mounted: label != null && isVisible,
      duration: labelTransitionDuration,
      transition: labelTransition,
      timingFunction: labelTransitionTimingFunction || theme.transitionTimingFunction,
      children: (transitionStyles) => /* @__PURE__ */ jsx("div", {
        style: transitionStyles,
        className: classes.label,
        children: label
      })
    })]
  });
});
Thumb.displayName = "@mantine/core/SliderThumb";
function isMarkFilled({ mark, offset: offset2, value }) {
  return typeof offset2 === "number" ? mark.value >= offset2 && mark.value <= value : mark.value <= value;
}
var useStyles$P = createStyles((theme, { size: size2, color, disabled }) => ({
  markWrapper: {
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  mark: {
    boxSizing: "border-box",
    border: `${theme.fn.size({ size: size2, sizes: sizes$5 }) >= 8 ? "2px" : "1px"} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    height: theme.fn.size({ sizes: sizes$5, size: size2 }),
    width: theme.fn.size({ sizes: sizes$5, size: size2 }),
    borderRadius: 1e3,
    transform: `translateX(-${theme.fn.size({ sizes: sizes$5, size: size2 }) / 2}px)`,
    backgroundColor: theme.white
  },
  markFilled: {
    borderColor: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4] : theme.fn.variant({ variant: "filled", color }).background
  },
  markLabel: {
    transform: "translate(-50%, 0)",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    marginTop: theme.spacing.xs / 2,
    whiteSpace: "nowrap"
  }
}));
const useStyles$Q = useStyles$P;
function Marks({
  marks,
  color,
  size: size2,
  min,
  max,
  value,
  classNames,
  styles,
  offset: offset2,
  onChange,
  disabled,
  unstyled
}) {
  const {
    classes,
    cx
  } = useStyles$Q({
    size: size2,
    color,
    disabled
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  const items = marks.map((mark, index2) => /* @__PURE__ */ jsxs(Box, {
    className: classes.markWrapper,
    sx: {
      left: `${getPosition({
        value: mark.value,
        min,
        max
      })}%`
    },
    children: [/* @__PURE__ */ jsx("div", {
      className: cx(classes.mark, {
        [classes.markFilled]: isMarkFilled({
          mark,
          value,
          offset: offset2
        })
      })
    }), mark.label && /* @__PURE__ */ jsx("div", {
      className: classes.markLabel,
      onMouseDown: (event) => {
        event.stopPropagation();
        onChange(mark.value);
      },
      onTouchStart: (event) => {
        event.stopPropagation();
        onChange(mark.value);
      },
      children: mark.label
    })]
  }, index2));
  return /* @__PURE__ */ jsx("div", {
    children: items
  });
}
Marks.displayName = "@mantine/core/SliderMarks";
var useStyles$N = createStyles((theme, { radius, size: size2, color, disabled }) => ({
  track: {
    position: "relative",
    height: theme.fn.size({ sizes: sizes$5, size: size2 }),
    width: "100%",
    marginRight: theme.fn.size({ size: size2, sizes: sizes$5 }),
    marginLeft: theme.fn.size({ size: size2, sizes: sizes$5 }),
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      right: -theme.fn.size({ size: size2, sizes: sizes$5 }),
      left: -theme.fn.size({ size: size2, sizes: sizes$5 }),
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
      zIndex: 0
    }
  },
  bar: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    bottom: 0,
    backgroundColor: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4] : theme.fn.variant({ variant: "filled", color }).background,
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  }
}));
const useStyles$O = useStyles$N;
var __defProp$Z = Object.defineProperty;
var __defProps$z = Object.defineProperties;
var __getOwnPropDescs$z = Object.getOwnPropertyDescriptors;
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
var __spreadProps$z = (a, b) => __defProps$z(a, __getOwnPropDescs$z(b));
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
function Track(_a) {
  var _b = _a, {
    filled,
    size: size2,
    color,
    classNames,
    styles,
    radius,
    children,
    offset: offset2,
    onMouseLeave,
    onMouseEnter,
    disabled,
    marksOffset,
    unstyled
  } = _b, others = __objRest$F(_b, ["filled", "size", "color", "classNames", "styles", "radius", "children", "offset", "onMouseLeave", "onMouseEnter", "disabled", "marksOffset", "unstyled"]);
  const {
    classes
  } = useStyles$O({
    color,
    size: size2,
    radius,
    disabled
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  return /* @__PURE__ */ jsxs("div", {
    className: classes.track,
    onMouseLeave,
    onMouseEnter,
    children: [/* @__PURE__ */ jsx(Box, {
      className: classes.bar,
      sx: (theme) => ({
        left: `calc(${offset2}% - ${theme.fn.size({
          size: size2,
          sizes: sizes$5
        })}px)`,
        width: `calc(${filled}% + ${theme.fn.size({
          size: size2,
          sizes: sizes$5
        })}px)`
      })
    }), children, /* @__PURE__ */ jsx(Marks, {
      ...__spreadProps$z(__spreadValues$Z({}, others), {
        size: size2,
        color,
        offset: marksOffset,
        classNames,
        styles,
        disabled,
        unstyled
      })
    })]
  });
}
Track.displayName = "@mantine/core/SliderTrack";
var __defProp$Y = Object.defineProperty;
var __defProps$y = Object.defineProperties;
var __getOwnPropDescs$y = Object.getOwnPropertyDescriptors;
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
var __spreadProps$y = (a, b) => __defProps$y(a, __getOwnPropDescs$y(b));
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
const SliderRoot = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    size: size2,
    classNames,
    styles,
    disabled,
    unstyled
  } = _b, others = __objRest$E(_b, ["className", "size", "classNames", "styles", "disabled", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$U({
    size: size2,
    disabled
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$y(__spreadValues$Y({}, others), {
      tabIndex: -1,
      className: cx(classes.root, className),
      ref
    })
  });
});
SliderRoot.displayName = "@mantine/core/SliderRoot";
var __defProp$X = Object.defineProperty;
var __defProps$x = Object.defineProperties;
var __getOwnPropDescs$x = Object.getOwnPropertyDescriptors;
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
var __spreadProps$x = (a, b) => __defProps$x(a, __getOwnPropDescs$x(b));
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
const defaultProps$i = {
  size: "md",
  radius: "xl",
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransition: "skew-down",
  labelTransitionDuration: 0,
  labelAlwaysOn: false,
  thumbLabel: "",
  showLabelOnHover: true,
  disabled: false
};
const Slider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Slider", defaultProps$i, props), {
    classNames,
    styles,
    color,
    value,
    onChange,
    onChangeEnd,
    size: size2,
    radius,
    min,
    max,
    step,
    precision,
    defaultValue,
    name,
    marks,
    label,
    labelTransition,
    labelTransitionDuration,
    labelTransitionTimingFunction,
    labelAlwaysOn,
    thumbLabel,
    showLabelOnHover,
    thumbChildren,
    disabled,
    unstyled,
    thumbSize
  } = _a, others = __objRest$D(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
  const theme = useMantineTheme();
  const [hovered, setHovered] = react.exports.useState(false);
  const [_value, setValue] = useUncontrolled({
    value: typeof value === "number" ? clamp(value, min, max) : value,
    defaultValue: typeof defaultValue === "number" ? clamp(defaultValue, min, max) : defaultValue,
    finalValue: clamp(0, min, max),
    onChange
  });
  const valueRef = react.exports.useRef(_value);
  const thumb = react.exports.useRef();
  const position = getPosition({
    value: _value,
    min,
    max
  });
  const _label = typeof label === "function" ? label(_value) : label;
  const handleChange = react.exports.useCallback(({
    x
  }) => {
    if (!disabled) {
      const nextValue = getChangeValue({
        value: x,
        min,
        max,
        step,
        precision
      });
      setValue(nextValue);
      valueRef.current = nextValue;
    }
  }, [disabled, min, max, step, precision]);
  const {
    ref: container,
    active
  } = useMove(handleChange, {
    onScrubEnd: () => onChangeEnd == null ? void 0 : onChangeEnd(valueRef.current)
  }, theme.dir);
  const handleThumbMouseDown = (event) => {
    event.stopPropagation();
  };
  const handleTrackKeydownCapture = (event) => {
    if (!disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          thumb.current.focus();
          const nextValue = Math.min(Math.max(_value + step, min), max);
          onChangeEnd == null ? void 0 : onChangeEnd(nextValue);
          setValue(nextValue);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          thumb.current.focus();
          const nextValue = Math.min(Math.max(theme.dir === "rtl" ? _value - step : _value + step, min), max);
          onChangeEnd == null ? void 0 : onChangeEnd(nextValue);
          setValue(nextValue);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          thumb.current.focus();
          const nextValue = Math.min(Math.max(_value - step, min), max);
          onChangeEnd == null ? void 0 : onChangeEnd(nextValue);
          setValue(nextValue);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          thumb.current.focus();
          const nextValue = Math.min(Math.max(theme.dir === "rtl" ? _value + step : _value - step, min), max);
          onChangeEnd == null ? void 0 : onChangeEnd(nextValue);
          setValue(nextValue);
          break;
        }
        case "Home": {
          event.preventDefault();
          thumb.current.focus();
          onChangeEnd == null ? void 0 : onChangeEnd(min);
          setValue(min);
          break;
        }
        case "End": {
          event.preventDefault();
          thumb.current.focus();
          onChangeEnd == null ? void 0 : onChangeEnd(max);
          setValue(max);
          break;
        }
      }
    }
  };
  return /* @__PURE__ */ jsxs(SliderRoot, {
    ...__spreadProps$x(__spreadValues$X({}, others), {
      size: size2,
      ref: useMergedRef(container, ref),
      onKeyDownCapture: handleTrackKeydownCapture,
      onMouseDownCapture: () => {
        var _a2;
        return (_a2 = container.current) == null ? void 0 : _a2.focus();
      },
      classNames,
      styles,
      disabled,
      unstyled
    }),
    children: [/* @__PURE__ */ jsx(Track, {
      offset: 0,
      filled: position,
      marks,
      size: size2,
      radius,
      color,
      min,
      max,
      value: _value,
      onChange: setValue,
      onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
      onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0,
      classNames,
      styles,
      disabled,
      unstyled,
      children: /* @__PURE__ */ jsx(Thumb, {
        max,
        min,
        value: _value,
        position,
        dragging: active,
        color,
        size: size2,
        label: _label,
        ref: thumb,
        onMouseDown: handleThumbMouseDown,
        labelTransition,
        labelTransitionDuration,
        labelTransitionTimingFunction,
        labelAlwaysOn,
        classNames,
        styles,
        thumbLabel,
        showLabelOnHover: showLabelOnHover && hovered,
        disabled,
        unstyled,
        thumbSize,
        children: thumbChildren
      })
    }), /* @__PURE__ */ jsx("input", {
      type: "hidden",
      name,
      value: _value
    })]
  });
});
Slider.displayName = "@mantine/core/Slider";
function getClientPosition(event) {
  if ("TouchEvent" in window && event instanceof window.TouchEvent) {
    const touch = event.touches[0];
    return touch.clientX;
  }
  return event.clientX;
}
var __defProp$W = Object.defineProperty;
var __defProps$w = Object.defineProperties;
var __getOwnPropDescs$w = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$W = Object.getOwnPropertySymbols;
var __hasOwnProp$W = Object.prototype.hasOwnProperty;
var __propIsEnum$W = Object.prototype.propertyIsEnumerable;
var __defNormalProp$W = (obj, key, value) => key in obj ? __defProp$W(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$w = (a, b) => __defProps$w(a, __getOwnPropDescs$w(b));
var __objRest$C = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$W.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$W)
    for (var prop of __getOwnPropSymbols$W(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$W.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$h = {
  size: "md",
  radius: "xl",
  min: 0,
  max: 100,
  minRange: 10,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransition: "skew-down",
  labelTransitionDuration: 0,
  labelAlwaysOn: false,
  thumbFromLabel: "",
  thumbToLabel: "",
  showLabelOnHover: true,
  disabled: false
};
const RangeSlider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RangeSlider", defaultProps$h, props), {
    classNames,
    styles,
    color,
    value,
    onChange,
    onChangeEnd,
    size: size2,
    radius,
    min,
    max,
    minRange,
    step,
    precision,
    defaultValue,
    name,
    marks,
    label,
    labelTransition,
    labelTransitionDuration,
    labelTransitionTimingFunction,
    labelAlwaysOn,
    thumbFromLabel,
    thumbToLabel,
    showLabelOnHover,
    thumbChildren,
    disabled,
    unstyled,
    thumbSize
  } = _a, others = __objRest$C(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "minRange", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbFromLabel", "thumbToLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
  const theme = useMantineTheme();
  const [focused, setFocused] = react.exports.useState(-1);
  const [hovered, setHovered] = react.exports.useState(false);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [min, max],
    onChange
  });
  const valueRef = react.exports.useRef(_value);
  const thumbs = react.exports.useRef([]);
  const thumbIndex = react.exports.useRef(void 0);
  const positions = [getPosition({
    value: _value[0],
    min,
    max
  }), getPosition({
    value: _value[1],
    min,
    max
  })];
  const _setValue = (val) => {
    setValue(val);
    valueRef.current = val;
  };
  react.exports.useEffect(() => {
    if (Array.isArray(value)) {
      valueRef.current = value;
    }
  }, Array.isArray(value) ? [value[0], value[1]] : [null, null]);
  const setRangedValue = (val, index2, triggerChangeEnd) => {
    const clone = [...valueRef.current];
    clone[index2] = val;
    if (index2 === 0) {
      if (val > clone[1] - minRange) {
        clone[1] = Math.min(val + minRange, max);
      }
      if (val > (max - minRange || min)) {
        clone[index2] = valueRef.current[index2];
      }
    }
    if (index2 === 1) {
      if (val < clone[0] + minRange) {
        clone[0] = Math.max(val - minRange, min);
      }
      if (val < clone[0] + minRange) {
        clone[index2] = valueRef.current[index2];
      }
    }
    _setValue(clone);
    if (triggerChangeEnd) {
      onChangeEnd == null ? void 0 : onChangeEnd(valueRef.current);
    }
  };
  const handleChange = (val) => {
    if (!disabled) {
      const nextValue = getChangeValue({
        value: val,
        min,
        max,
        step,
        precision
      });
      setRangedValue(nextValue, thumbIndex.current, false);
    }
  };
  const {
    ref: container,
    active
  } = useMove(({
    x
  }) => handleChange(x), {
    onScrubEnd: () => onChangeEnd == null ? void 0 : onChangeEnd(valueRef.current)
  }, theme.dir);
  function handleThumbMouseDown(event, index2) {
    event.stopPropagation();
    thumbIndex.current = index2;
  }
  const handleTrackMouseDownCapture = (event) => {
    container.current.focus();
    const rect = container.current.getBoundingClientRect();
    const changePosition = getClientPosition(event.nativeEvent);
    const changeValue = getChangeValue({
      value: changePosition - rect.left,
      max,
      min,
      step,
      containerWidth: rect.width
    });
    const nearestHandle = Math.abs(_value[0] - changeValue) > Math.abs(_value[1] - changeValue) ? 1 : 0;
    const _nearestHandle = theme.dir === "ltr" ? nearestHandle : nearestHandle === 1 ? 0 : 1;
    thumbIndex.current = _nearestHandle;
  };
  const getFocusedThumbIndex = () => {
    if (focused !== 1 && focused !== 0) {
      setFocused(0);
      return 0;
    }
    return focused;
  };
  const handleTrackKeydownCapture = (event) => {
    if (!disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          setRangedValue(Math.min(Math.max(valueRef.current[focusedIndex] + step, min), max), focusedIndex, true);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          setRangedValue(Math.min(Math.max(theme.dir === "rtl" ? valueRef.current[focusedIndex] - step : valueRef.current[focusedIndex] + step, min), max), focusedIndex, true);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          setRangedValue(Math.min(Math.max(valueRef.current[focusedIndex] - step, min), max), focusedIndex, true);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          setRangedValue(Math.min(Math.max(theme.dir === "rtl" ? valueRef.current[focusedIndex] + step : valueRef.current[focusedIndex] - step, min), max), focusedIndex, true);
          break;
        }
      }
    }
  };
  const sharedThumbProps = {
    max,
    min,
    color,
    size: size2,
    labelTransition,
    labelTransitionDuration,
    labelTransitionTimingFunction,
    labelAlwaysOn,
    onBlur: () => setFocused(-1),
    classNames,
    styles
  };
  const hasArrayThumbChildren = Array.isArray(thumbChildren);
  return /* @__PURE__ */ jsxs(SliderRoot, {
    ...__spreadProps$w(__spreadValues$W({}, others), {
      size: size2,
      ref: useMergedRef(container, ref),
      onTouchStartCapture: handleTrackMouseDownCapture,
      onTouchEndCapture: () => {
        thumbIndex.current = -1;
      },
      onMouseDownCapture: handleTrackMouseDownCapture,
      onMouseUpCapture: () => {
        thumbIndex.current = -1;
      },
      onKeyDownCapture: handleTrackKeydownCapture,
      styles,
      classNames,
      disabled,
      unstyled
    }),
    children: [/* @__PURE__ */ jsxs(Track, {
      offset: positions[0],
      marksOffset: _value[0],
      filled: positions[1] - positions[0],
      marks,
      size: size2,
      radius,
      color,
      min,
      max,
      value: _value[1],
      styles,
      classNames,
      onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
      onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0,
      onChange: (val) => {
        const nearestValue = Math.abs(_value[0] - val) > Math.abs(_value[1] - val) ? 1 : 0;
        const clone = [..._value];
        clone[nearestValue] = val;
        _setValue(clone);
      },
      disabled,
      unstyled,
      children: [/* @__PURE__ */ jsx(Thumb, {
        ...__spreadProps$w(__spreadValues$W({}, sharedThumbProps), {
          value: _value[0],
          position: positions[0],
          dragging: active,
          label: typeof label === "function" ? label(_value[0]) : label,
          ref: (node) => {
            thumbs.current[0] = node;
          },
          thumbLabel: thumbFromLabel,
          onMouseDown: (event) => handleThumbMouseDown(event, 0),
          onFocus: () => setFocused(0),
          showLabelOnHover: showLabelOnHover && hovered,
          disabled,
          unstyled,
          thumbSize
        }),
        children: hasArrayThumbChildren ? thumbChildren[0] : thumbChildren
      }), /* @__PURE__ */ jsx(Thumb, {
        ...__spreadProps$w(__spreadValues$W({}, sharedThumbProps), {
          thumbLabel: thumbToLabel,
          value: _value[1],
          position: positions[1],
          dragging: active,
          label: typeof label === "function" ? label(_value[1]) : label,
          ref: (node) => {
            thumbs.current[1] = node;
          },
          onMouseDown: (event) => handleThumbMouseDown(event, 1),
          onFocus: () => setFocused(1),
          showLabelOnHover: showLabelOnHover && hovered,
          disabled,
          unstyled,
          thumbSize
        }),
        children: hasArrayThumbChildren ? thumbChildren[1] : thumbChildren
      })]
    }), /* @__PURE__ */ jsx("input", {
      type: "hidden",
      name: `${name}_from`,
      value: _value[0]
    }), /* @__PURE__ */ jsx("input", {
      type: "hidden",
      name: `${name}_to`,
      value: _value[1]
    })]
  });
});
RangeSlider.displayName = "@mantine/core/RangeSlider";
var __defProp$V = Object.defineProperty;
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
var __objRest$B = (source, exclude) => {
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
const defaultProps$g = {
  w: 0,
  h: 0
};
const Space = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Space", defaultProps$g, props), {
    w,
    h,
    sx
  } = _a, others = __objRest$B(_a, ["w", "h", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$V({
      ref,
      sx: [(theme) => {
        const width = theme.fn.size({
          size: w,
          sizes: theme.spacing
        });
        const height = theme.fn.size({
          size: h,
          sizes: theme.spacing
        });
        return {
          width,
          height,
          minWidth: width,
          minHeight: height
        };
      }, ...packSx(sx)]
    }, others)
  });
});
Space.displayName = "@mantine/core/Space";
var useStyles$L = createStyles((theme, { transitionDuration }) => ({
  control: {},
  root: {
    position: "relative"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transitionProperty: "max-height",
    transitionTimingFunction: theme.transitionTimingFunction,
    transitionDuration: `${transitionDuration}ms`,
    "@media (prefers-reduced-motion)": {
      transitionDuration: theme.respectReducedMotion ? "0ms" : void 0
    }
  }
}));
const useStyles$M = useStyles$L;
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
var __objRest$A = (source, exclude) => {
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
const defaultProps$f = {
  maxHeight: 100,
  transitionDuration: 200,
  initialState: false
};
const Spoiler = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Spoiler", defaultProps$f, props), {
    className,
    children,
    maxHeight,
    hideLabel,
    showLabel,
    transitionDuration,
    controlRef,
    initialState,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$A(_a, ["className", "children", "maxHeight", "hideLabel", "showLabel", "transitionDuration", "controlRef", "initialState", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$M({
    transitionDuration
  }, {
    classNames,
    styles,
    unstyled,
    name: "Spoiler"
  });
  const [show, setShowState] = react.exports.useState(initialState);
  const [spoiler, setSpoilerState] = react.exports.useState(initialState);
  const {
    ref: contentRef,
    height
  } = useElementSize();
  const spoilerMoreContent = show ? hideLabel : showLabel;
  react.exports.useEffect(() => {
    setSpoilerState(maxHeight < height);
  }, [height, maxHeight, children]);
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$U({
      className: cx(classes.root, className),
      ref
    }, others),
    children: [/* @__PURE__ */ jsx("div", {
      className: classes.content,
      style: {
        maxHeight: !show ? maxHeight : height || void 0
      },
      children: /* @__PURE__ */ jsx("div", {
        ref: contentRef,
        children
      })
    }), spoiler && /* @__PURE__ */ jsx(Anchor, {
      component: "button",
      ref: controlRef,
      onClick: () => setShowState((opened) => !opened),
      className: classes.control,
      children: spoilerMoreContent
    })]
  });
});
Spoiler.displayName = "@mantine/core/Spoiler";
var __defProp$T = Object.defineProperty;
var __defProps$v = Object.defineProperties;
var __getOwnPropDescs$v = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$T = Object.getOwnPropertySymbols;
var __hasOwnProp$T = Object.prototype.hasOwnProperty;
var __propIsEnum$T = Object.prototype.propertyIsEnumerable;
var __defNormalProp$T = (obj, key, value) => key in obj ? __defProp$T(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$v = (a, b) => __defProps$v(a, __getOwnPropDescs$v(b));
const iconSizes$1 = {
  xs: 34,
  sm: 36,
  md: 42,
  lg: 48,
  xl: 52
};
var useStyles$J = createStyles((theme, { color, iconSize, size: size2, radius, allowStepClick, iconPosition, orientation }) => {
  const _iconSize = iconSize || theme.fn.size({ size: size2, sizes: iconSizes$1 });
  const iconMargin = size2 === "xl" || size2 === "lg" ? theme.spacing.md : theme.spacing.sm;
  const _radius = theme.fn.size({ size: radius, sizes: theme.radius });
  const colors = theme.fn.variant({ variant: "filled", color });
  const separatorDistanceFromIcon = theme.spacing.xs / 2;
  const verticalOrientationStyles = {
    step: {
      justifyContent: "flex-start",
      minHeight: `${_iconSize + theme.spacing.xl + separatorDistanceFromIcon}px`,
      marginTop: `${separatorDistanceFromIcon}px`,
      overflow: "hidden",
      "&:first-of-type": {
        marginTop: 0
      },
      "&:last-of-type": {
        minHeight: "auto"
      }
    }
  };
  return {
    stepLoader: {},
    step: __spreadValues$T({
      display: "flex",
      flexDirection: iconPosition === "left" ? "row" : "row-reverse",
      cursor: allowStepClick ? "pointer" : "default"
    }, orientation === "vertical" ? verticalOrientationStyles.step : {
      alignItems: "center"
    }),
    stepWrapper: {
      position: "relative"
    },
    verticalSeparator: {
      top: `${_iconSize + separatorDistanceFromIcon}px`,
      left: `${_iconSize / 2}px`,
      height: "100vh",
      position: "absolute",
      borderLeft: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]}`
    },
    verticalSeparatorActive: {
      borderColor: theme.fn.variant({ variant: "filled", color }).background
    },
    stepIcon: {
      boxSizing: "border-box",
      height: _iconSize,
      width: _iconSize,
      minWidth: _iconSize,
      borderRadius: _radius,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
      border: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]}`,
      transition: "background-color 150ms ease, border-color 150ms ease",
      position: "relative",
      fontWeight: 700,
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      "&[data-progress]": {
        borderColor: colors.background
      },
      "&[data-completed]": {
        backgroundColor: colors.background,
        borderColor: colors.background,
        color: theme.white
      }
    },
    stepCompletedIcon: __spreadProps$v(__spreadValues$T({}, theme.fn.cover()), {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.white
    }),
    stepBody: __spreadValues$T({
      display: "flex",
      flexDirection: "column",
      marginLeft: iconPosition === "left" ? iconMargin : void 0,
      marginRight: iconPosition === "right" ? iconMargin : void 0
    }, orientation === "vertical" ? {
      marginTop: _iconSize > theme.fn.size({ size: size2, sizes: theme.fontSizes }) * 4 ? _iconSize / 4 : _iconSize / 12
    } : null),
    stepLabel: {
      textAlign: iconPosition,
      fontWeight: 500,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      lineHeight: 1
    },
    stepDescription: {
      textAlign: iconPosition,
      marginTop: theme.fn.size({ size: size2, sizes: theme.spacing }) / 3,
      marginBottom: theme.fn.size({ size: size2, sizes: theme.spacing }) / 3,
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }) - 2,
      lineHeight: 1
    }
  };
});
const useStyles$K = useStyles$J;
var __defProp$S = Object.defineProperty;
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
const defaultIconSizes = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 24
};
const Step = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    state,
    color,
    icon,
    completedIcon,
    progressIcon,
    label,
    description,
    withIcon = true,
    iconSize,
    size: size2 = "md",
    radius = "xl",
    loading,
    allowStepClick = true,
    allowStepSelect,
    iconPosition = "left",
    __staticSelector = "Step",
    classNames,
    styles,
    unstyled,
    orientation
  } = _b, others = __objRest$z(_b, ["className", "state", "color", "icon", "completedIcon", "progressIcon", "label", "description", "withIcon", "iconSize", "size", "radius", "loading", "allowStepClick", "allowStepSelect", "iconPosition", "__staticSelector", "classNames", "styles", "unstyled", "orientation"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$K({
    color,
    iconSize,
    size: size2,
    radius,
    allowStepClick,
    iconPosition,
    orientation
  }, {
    name: __staticSelector,
    classNames,
    styles,
    unstyled
  });
  const _iconSize = theme.fn.size({
    size: size2,
    sizes: defaultIconSizes
  });
  const _icon = state === "stepCompleted" ? null : state === "stepProgress" ? progressIcon : icon;
  const dataAttributes = {
    "data-progress": state === "stepProgress" || void 0,
    "data-completed": state === "stepCompleted" || void 0
  };
  return /* @__PURE__ */ jsxs(UnstyledButton, {
    ...__spreadValues$S(__spreadValues$S({
      className: cx(classes.step, className),
      tabIndex: allowStepClick ? 0 : -1,
      ref
    }, dataAttributes), others),
    children: [withIcon && /* @__PURE__ */ jsxs("div", {
      className: classes.stepWrapper,
      children: [/* @__PURE__ */ jsxs("div", {
        ...__spreadValues$S({
          className: classes.stepIcon
        }, dataAttributes),
        children: [/* @__PURE__ */ jsx(Transition$2, {
          mounted: state === "stepCompleted",
          transition: "pop",
          duration: 200,
          children: (transitionStyles) => /* @__PURE__ */ jsx("div", {
            className: classes.stepCompletedIcon,
            style: transitionStyles,
            children: loading ? /* @__PURE__ */ jsx(Loader, {
              color: "#fff",
              size: _iconSize,
              className: classes.stepLoader
            }) : completedIcon || /* @__PURE__ */ jsx(CheckboxIcon, {
              indeterminate: false,
              width: _iconSize,
              height: _iconSize
            })
          })
        }), state !== "stepCompleted" ? loading ? /* @__PURE__ */ jsx(Loader, {
          size: _iconSize,
          color
        }) : _icon || icon : null]
      }), orientation === "vertical" && /* @__PURE__ */ jsx("div", {
        className: cx(classes.verticalSeparator, {
          [classes.verticalSeparatorActive]: state === "stepCompleted"
        })
      })]
    }), (label || description) && /* @__PURE__ */ jsxs("div", {
      className: classes.stepBody,
      children: [label && /* @__PURE__ */ jsx(Text, {
        className: classes.stepLabel,
        children: label
      }), description && /* @__PURE__ */ jsx(Text, {
        className: classes.stepDescription,
        color: "dimmed",
        children: description
      })]
    })]
  });
});
Step.displayName = "@mantine/core/Step";
function StepCompleted(props) {
  return null;
}
StepCompleted.displayName = "@mantine/core/StepCompleted";
var __defProp$R = Object.defineProperty;
var __defProps$u = Object.defineProperties;
var __getOwnPropDescs$u = Object.getOwnPropertyDescriptors;
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
var __spreadProps$u = (a, b) => __defProps$u(a, __getOwnPropDescs$u(b));
var useStyles$H = createStyles((theme, {
  contentPadding,
  color,
  orientation,
  iconPosition,
  iconSize,
  size: size2,
  breakpoint
}) => {
  const shouldBeResponsive = typeof breakpoint !== "undefined";
  const breakpointValue = theme.fn.size({ size: breakpoint, sizes: theme.breakpoints });
  const separatorOffset = typeof iconSize !== "undefined" ? iconSize / 2 - 1 : theme.fn.size({ size: size2, sizes: iconSizes$1 }) / 2 - 1;
  const verticalOrientationStyles = {
    steps: {
      flexDirection: "column",
      alignItems: iconPosition === "left" ? "flex-start" : "flex-end"
    },
    separator: {
      width: 2,
      minHeight: theme.spacing.xl,
      marginLeft: iconPosition === "left" ? separatorOffset : 0,
      marginRight: iconPosition === "right" ? separatorOffset : 0,
      marginTop: theme.spacing.xs / 2,
      marginBottom: theme.spacing.xs - 2
    }
  };
  const responsiveStyles = {
    steps: {
      [`@media (max-width: ${breakpointValue}px)`]: verticalOrientationStyles.steps
    },
    separator: {
      [`@media (max-width: ${breakpointValue}px)`]: verticalOrientationStyles.separator
    }
  };
  return {
    root: {},
    steps: __spreadValues$R(__spreadValues$R({
      display: "flex",
      boxSizing: "border-box",
      alignItems: "center"
    }, orientation === "vertical" ? verticalOrientationStyles.steps : null), shouldBeResponsive ? responsiveStyles.steps : null),
    separator: __spreadValues$R(__spreadValues$R({
      boxSizing: "border-box",
      transition: "background-color 150ms ease",
      flex: 1,
      height: 2,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
      marginLeft: theme.spacing.md,
      marginRight: theme.spacing.md
    }, orientation === "vertical" ? verticalOrientationStyles.separator : null), shouldBeResponsive ? responsiveStyles.separator : null),
    separatorActive: {
      backgroundColor: theme.fn.variant({ variant: "filled", color }).background
    },
    content: __spreadProps$u(__spreadValues$R({}, theme.fn.fontStyles()), {
      paddingTop: theme.fn.size({ size: contentPadding, sizes: theme.spacing })
    })
  };
});
const useStyles$I = useStyles$H;
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
const defaultProps$e = {
  contentPadding: "md",
  size: "md",
  radius: "xl",
  orientation: "horizontal",
  iconPosition: "left"
};
const Stepper = react.exports.forwardRef((props, ref) => {
  var _b, _c, _d;
  const _a = useComponentDefaultProps("Stepper", defaultProps$e, props), {
    className,
    children,
    onStepClick,
    active,
    completedIcon,
    progressIcon,
    color,
    iconSize,
    contentPadding,
    size: size2,
    radius,
    orientation,
    breakpoint,
    iconPosition,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$y(_a, ["className", "children", "onStepClick", "active", "completedIcon", "progressIcon", "color", "iconSize", "contentPadding", "size", "radius", "orientation", "breakpoint", "iconPosition", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$I({
    contentPadding,
    color,
    orientation,
    iconPosition,
    size: size2,
    iconSize,
    breakpoint
  }, {
    classNames,
    styles,
    unstyled,
    name: "Stepper"
  });
  const convertedChildren = react.exports.Children.toArray(children);
  const _children = convertedChildren.filter((child) => child.type !== StepCompleted);
  const completedStep = convertedChildren.find((item) => item.type === StepCompleted);
  const items = _children.reduce((acc, item, index2) => {
    const shouldAllowSelect = typeof item.props.allowStepSelect === "boolean" ? item.props.allowStepSelect : typeof onStepClick === "function";
    acc.push(react.exports.cloneElement(item, {
      __staticSelector: "Stepper",
      icon: item.props.icon || index2 + 1,
      key: index2,
      state: active === index2 ? "stepProgress" : active > index2 ? "stepCompleted" : "stepInactive",
      onClick: () => shouldAllowSelect && typeof onStepClick === "function" && onStepClick(index2),
      allowStepClick: shouldAllowSelect && typeof onStepClick === "function",
      completedIcon: item.props.completedIcon || completedIcon,
      progressIcon: item.props.progressIcon || progressIcon,
      color: item.props.color || color,
      iconSize,
      size: size2,
      radius,
      classNames,
      styles,
      iconPosition: item.props.iconPosition || iconPosition,
      orientation,
      unstyled
    }));
    if (orientation === "horizontal" && index2 !== _children.length - 1) {
      acc.push(
        /* @__PURE__ */ jsx("div", {
          className: cx(classes.separator, {
            [classes.separatorActive]: index2 < active
          })
        }, `separator-${index2}`)
      );
    }
    return acc;
  }, []);
  const stepContent = (_c = (_b = _children[active]) == null ? void 0 : _b.props) == null ? void 0 : _c.children;
  const completedContent = (_d = completedStep == null ? void 0 : completedStep.props) == null ? void 0 : _d.children;
  const content = active > _children.length - 1 ? completedContent : stepContent;
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$Q({
      className: cx(classes.root, className),
      ref
    }, others),
    children: [/* @__PURE__ */ jsx("div", {
      className: classes.steps,
      children: items
    }), content && /* @__PURE__ */ jsx("div", {
      className: classes.content,
      children: content
    })]
  });
});
Stepper.Step = Step;
Stepper.Completed = StepCompleted;
Stepper.displayName = "@mantine/core/Stepper";
var __defProp$P = Object.defineProperty;
var __defProps$t = Object.defineProperties;
var __getOwnPropDescs$t = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$P = Object.getOwnPropertySymbols;
var __hasOwnProp$P = Object.prototype.hasOwnProperty;
var __propIsEnum$P = Object.prototype.propertyIsEnumerable;
var __defNormalProp$P = (obj, key, value) => key in obj ? __defProp$P(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$t = (a, b) => __defProps$t(a, __getOwnPropDescs$t(b));
const switchHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 30,
  xl: 36
};
const switchWidth = {
  xs: 30,
  sm: 38,
  md: 46,
  lg: 56,
  xl: 68
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
var useStyles$F = createStyles((theme, { size: size2, radius, color, offLabel, onLabel }) => {
  const handleSize = theme.fn.size({ size: size2, sizes: handleSizes });
  const borderRadius = theme.fn.size({ size: radius, sizes: theme.radius });
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    root: {
      display: "flex",
      alignItems: "center"
    },
    input: __spreadProps$t(__spreadValues$P({}, theme.fn.focusStyles()), {
      overflow: "hidden",
      WebkitTapHighlightColor: "transparent",
      position: "relative",
      borderRadius,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      height: theme.fn.size({ size: size2, sizes: switchHeight }),
      width: theme.fn.size({ size: size2, sizes: switchWidth }),
      minWidth: theme.fn.size({ size: size2, sizes: switchWidth }),
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
      cursor: theme.cursorType,
      "&::before": {
        zIndex: 1,
        borderRadius,
        boxSizing: "border-box",
        content: '""',
        display: "block",
        backgroundColor: theme.white,
        height: handleSize,
        width: handleSize,
        border: `1px solid ${theme.colorScheme === "dark" ? theme.white : theme.colors.gray[3]}`,
        transition: `transform 150ms ${theme.transitionTimingFunction}`,
        transform: `translateX(${size2 === "xs" ? 1 : 2}px)`,
        "@media (prefers-reduced-motion)": {
          transitionDuration: theme.respectReducedMotion ? "0ms" : false
        }
      },
      "&::after": {
        position: "absolute",
        zIndex: 0,
        display: "flex",
        height: "100%",
        alignItems: "center",
        lineHeight: 0,
        right: "10%",
        transform: "translateX(0)",
        content: offLabel ? `'${offLabel}'` : "''",
        color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
        transition: `color 150ms ${theme.transitionTimingFunction}`
      },
      "&:checked": {
        backgroundColor: colors.background,
        borderColor: colors.background,
        "&::before": {
          transform: `translateX(${theme.fn.size({ size: size2, sizes: switchWidth }) - theme.fn.size({ size: size2, sizes: handleSizes }) - (size2 === "xs" ? 3 : 4)}px)`,
          borderColor: theme.white
        },
        "&::after": {
          position: "absolute",
          zIndex: 0,
          display: "flex",
          height: "100%",
          alignItems: "center",
          lineHeight: 0,
          left: "10%",
          transform: "translateX(0)",
          content: onLabel ? `'${onLabel}'` : "''",
          color: theme.white,
          transition: `color 150ms ${theme.transitionTimingFunction}`
        }
      },
      "&:disabled": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        cursor: "not-allowed",
        "&::before": {
          borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[0]
        }
      }
    }),
    label: __spreadProps$t(__spreadValues$P({}, theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      fontSize: theme.fn.size({ size: size2, sizes: theme.fontSizes }),
      fontFamily: theme.fontFamily,
      paddingLeft: theme.spacing.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      cursor: theme.cursorType
    })
  };
});
const useStyles$G = useStyles$F;
var __defProp$O = Object.defineProperty;
var __defProps$s = Object.defineProperties;
var __getOwnPropDescs$s = Object.getOwnPropertyDescriptors;
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
var __spreadProps$s = (a, b) => __defProps$s(a, __getOwnPropDescs$s(b));
var __objRest$x = (source, exclude) => {
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
const defaultProps$d = {
  offLabel: "",
  onLabel: "",
  size: "sm",
  radius: "xl"
};
const Switch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Switch", defaultProps$d, props), {
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
    sx
  } = _a, others = __objRest$x(_a, ["className", "color", "label", "offLabel", "onLabel", "id", "style", "size", "radius", "wrapperProps", "children", "unstyled", "styles", "classNames", "sx"]);
  const {
    classes,
    cx
  } = useStyles$G({
    size: size2,
    color,
    radius,
    offLabel,
    onLabel
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
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$O(__spreadValues$O({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadProps$s(__spreadValues$O({}, rest), {
        id: uuid2,
        ref,
        type: "checkbox",
        className: classes.input
      })
    }), label && /* @__PURE__ */ jsx("label", {
      className: classes.label,
      htmlFor: uuid2,
      children: label
    })]
  });
});
Switch.displayName = "@mantine/core/Switch";
var __defProp$N = Object.defineProperty;
var __defProps$r = Object.defineProperties;
var __getOwnPropDescs$r = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$N = Object.getOwnPropertySymbols;
var __hasOwnProp$N = Object.prototype.hasOwnProperty;
var __propIsEnum$N = Object.prototype.propertyIsEnumerable;
var __defNormalProp$N = (obj, key, value) => key in obj ? __defProp$N(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$r = (a, b) => __defProps$r(a, __getOwnPropDescs$r(b));
var useStyles$D = createStyles((theme, { captionSide, horizontalSpacing, verticalSpacing, fontSize }) => ({
  root: __spreadProps$r(__spreadValues$N({}, theme.fn.fontStyles()), {
    width: "100%",
    borderCollapse: "collapse",
    captionSide,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    lineHeight: theme.lineHeight,
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
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
    },
    "& tfoot tr th": {
      borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
    },
    "& tbody tr td": {
      padding: `${theme.fn.size({
        size: verticalSpacing,
        sizes: theme.spacing
      })}px ${theme.fn.size({ size: horizontalSpacing, sizes: theme.spacing })}px`,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      fontSize: theme.fn.size({ size: fontSize, sizes: theme.fontSizes })
    },
    "& tbody tr:last-of-type td": {
      borderBottom: "none"
    },
    "&[data-striped] tbody tr:nth-of-type(odd)": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    },
    "&[data-hover] tbody tr": theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    })
  })
}));
const useStyles$E = useStyles$D;
var __defProp$M = Object.defineProperty;
var __defProps$q = Object.defineProperties;
var __getOwnPropDescs$q = Object.getOwnPropertyDescriptors;
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
var __spreadProps$q = (a, b) => __defProps$q(a, __getOwnPropDescs$q(b));
var __objRest$w = (source, exclude) => {
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
const defaultProps$c = {
  striped: false,
  highlightOnHover: false,
  captionSide: "top",
  horizontalSpacing: "xs",
  fontSize: "sm",
  verticalSpacing: 7
};
const Table = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Table", defaultProps$c, props), {
    className,
    children,
    striped,
    highlightOnHover,
    captionSide,
    horizontalSpacing,
    verticalSpacing,
    fontSize,
    unstyled
  } = _a, others = __objRest$w(_a, ["className", "children", "striped", "highlightOnHover", "captionSide", "horizontalSpacing", "verticalSpacing", "fontSize", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$E({
    captionSide,
    verticalSpacing,
    horizontalSpacing,
    fontSize
  }, {
    unstyled,
    name: "Table"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$q(__spreadValues$M({}, others), {
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
const TABS_ERRORS = {
  context: "Tabs component was not found in the tree",
  value: "Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value"
};
const [TabsContextProvider, useTabsContext] = createSafeContext(TABS_ERRORS.context);
var __defProp$L = Object.defineProperty;
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
function getVariantStyles$1({ variant, orientation, inverted }, theme) {
  const vertical = orientation === "vertical";
  if (variant === "default") {
    return {
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
    };
  }
  if (variant === "outline") {
    return {
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
    };
  }
  if (variant === "pills") {
    return {
      gap: theme.spacing.sm / 2
    };
  }
  return {};
}
var useStyles$B = createStyles((theme, params) => {
  const vertical = params.orientation === "vertical";
  return {
    tabsList: __spreadValues$L({
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      justifyContent: GROUP_POSITIONS[params.position],
      '& [role="tab"]': {
        flex: params.grow ? 1 : void 0
      }
    }, getVariantStyles$1(params, theme))
  };
});
const useStyles$C = useStyles$B;
var __defProp$K = Object.defineProperty;
var __defProps$p = Object.defineProperties;
var __getOwnPropDescs$p = Object.getOwnPropertyDescriptors;
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
var __spreadProps$p = (a, b) => __defProps$p(a, __getOwnPropDescs$p(b));
var __objRest$v = (source, exclude) => {
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
const TabsList = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    grow = false,
    position = "left"
  } = _b, others = __objRest$v(_b, ["children", "className", "grow", "position"]);
  const {
    orientation,
    variant,
    color,
    radius,
    inverted
  } = useTabsContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$C({
    orientation,
    grow,
    variant,
    color,
    position,
    radius,
    inverted
  }, {
    name: "Tabs",
    unstyled,
    classNames,
    styles
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$p(__spreadValues$K({}, others), {
      className: cx(classes.tabsList, className),
      ref,
      role: "tablist",
      "aria-orientation": orientation
    }),
    children
  });
});
TabsList.displayName = "@mantine/core/TabsList";
var useStyles$z = createStyles((_theme, { orientation }) => ({
  panel: {
    flex: orientation === "vertical" ? 1 : void 0
  }
}));
const useStyles$A = useStyles$z;
var __defProp$J = Object.defineProperty;
var __defProps$o = Object.defineProperties;
var __getOwnPropDescs$o = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$J = Object.getOwnPropertySymbols;
var __hasOwnProp$J = Object.prototype.hasOwnProperty;
var __propIsEnum$J = Object.prototype.propertyIsEnumerable;
var __defNormalProp$J = (obj, key, value) => key in obj ? __defProp$J(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$u = (source, exclude) => {
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
const TabsPanel = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    children,
    sx,
    className
  } = _b, others = __objRest$u(_b, ["value", "children", "sx", "className"]);
  const ctx = useTabsContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$A({
    orientation: ctx.orientation,
    variant: ctx.variant,
    color: ctx.color,
    radius: ctx.radius,
    inverted: ctx.inverted
  }, {
    name: "Tabs",
    unstyled,
    classNames,
    styles
  });
  const active = ctx.value === value;
  const content = ctx.keepMounted ? children : active ? children : null;
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$o(__spreadValues$J({}, others), {
      ref,
      sx: [{
        display: !active ? "none" : void 0
      }, ...packSx(sx)],
      className: cx(classes.panel, className),
      role: "tabpanel",
      id: ctx.getPanelId(value),
      "aria-labelledby": ctx.getTabId(value)
    }),
    children: content
  });
});
TabsPanel.displayName = "@mantine/core/TabsPanel";
var __defProp$I = Object.defineProperty;
var __defProps$n = Object.defineProperties;
var __getOwnPropDescs$n = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$I = Object.getOwnPropertySymbols;
var __hasOwnProp$I = Object.prototype.hasOwnProperty;
var __propIsEnum$I = Object.prototype.propertyIsEnumerable;
var __defNormalProp$I = (obj, key, value) => key in obj ? __defProp$I(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$n = (a, b) => __defProps$n(a, __getOwnPropDescs$n(b));
function getVariantStyles(theme, { variant, orientation, color, radius, inverted }) {
  const vertical = orientation === "vertical";
  const filledScheme = theme.fn.variant({ color, variant: "filled" });
  const radiusValue = theme.fn.radius(radius);
  const borderRadius = orientation === "vertical" ? `${radiusValue}px 0 0 ${radiusValue}px` : inverted ? `0 0 ${radiusValue}px ${radiusValue}px` : `${radiusValue}px ${radiusValue}px 0 0`;
  if (variant === "default") {
    return __spreadProps$n(__spreadValues$I({
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: "2px solid transparent",
      [vertical ? "marginRight" : inverted ? "marginTop" : "marginBottom"]: -2,
      borderRadius
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    })), {
      "&[data-active]": __spreadValues$I({
        borderColor: filledScheme.background,
        color: theme.colorScheme === "dark" ? theme.white : theme.black
      }, theme.fn.hover({ borderColor: filledScheme.background }))
    });
  }
  if (variant === "outline") {
    return {
      borderRadius,
      border: "1px solid transparent",
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: "none",
      "&[data-active]": {
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
        "&::before": {
          content: '""',
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          position: "absolute",
          bottom: vertical ? 0 : inverted ? "unset" : -1,
          top: vertical ? 0 : inverted ? -1 : "unset",
          [vertical ? "width" : "height"]: 1,
          right: vertical ? -1 : 0,
          left: vertical ? "unset" : 0
        }
      }
    };
  }
  if (variant === "pills") {
    return __spreadProps$n(__spreadValues$I({
      borderRadius: theme.fn.radius(radius)
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$I({
        backgroundColor: filledScheme.background,
        color: theme.white
      }, theme.fn.hover({ backgroundColor: filledScheme.background }))
    });
  }
  return {};
}
var useStyles$x = createStyles((theme, params) => ({
  tabLabel: {},
  tab: __spreadValues$I({
    position: "relative",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: params.withIcon ? theme.spacing.xs : void 0,
    paddingRight: params.withRightSection ? theme.spacing.xs : void 0,
    fontSize: theme.fontSizes.sm,
    whiteSpace: "nowrap",
    zIndex: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: params.orientation === "horizontal" ? "center" : void 0,
    lineHeight: 1,
    "&:disabled": __spreadValues$I({
      opacity: 0.5,
      cursor: "not-allowed"
    }, theme.fn.hover({ backgroundColor: "transparent" })),
    "&:focus": {
      zIndex: 1
    }
  }, getVariantStyles(theme, params)),
  tabRightSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:not(:only-child)": {
      marginLeft: 7
    }
  },
  tabIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:not(:only-child)": {
      marginRight: 7
    }
  }
}));
const useStyles$y = useStyles$x;
var __defProp$H = Object.defineProperty;
var __defProps$m = Object.defineProperties;
var __getOwnPropDescs$m = Object.getOwnPropertyDescriptors;
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
var __spreadProps$m = (a, b) => __defProps$m(a, __getOwnPropDescs$m(b));
var __objRest$t = (source, exclude) => {
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
const Tab = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    children,
    onKeyDown,
    onClick,
    className,
    icon,
    rightSection,
    color
  } = _b, others = __objRest$t(_b, ["value", "children", "onKeyDown", "onClick", "className", "icon", "rightSection", "color"]);
  const ctx = useTabsContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const hasIcon = !!icon;
  const hasRightSection = !!rightSection;
  const {
    theme,
    classes,
    cx
  } = useStyles$y({
    withIcon: hasIcon || hasRightSection && !children,
    withRightSection: hasRightSection || hasIcon && !children,
    orientation: ctx.orientation,
    color: color || ctx.color,
    variant: ctx.variant,
    radius: ctx.radius,
    inverted: ctx.inverted
  }, {
    name: "Tabs",
    unstyled,
    classNames,
    styles
  });
  const isActive = value === ctx.value;
  const activateTab = (event) => {
    ctx.onTabChange(ctx.allowTabDeactivation ? value === ctx.value ? null : value : value);
    onClick == null ? void 0 : onClick(event);
  };
  return /* @__PURE__ */ jsxs(UnstyledButton, {
    ...__spreadProps$m(__spreadValues$H({}, others), {
      unstyled,
      className: cx(classes.tab, className),
      "data-active": isActive || void 0,
      ref,
      type: "button",
      role: "tab",
      id: ctx.getTabId(value),
      "aria-selected": isActive,
      tabIndex: isActive || ctx.value === null ? 0 : -1,
      "aria-controls": ctx.getPanelId(value),
      onClick: activateTab,
      onKeyDown: createScopedKeydownHandler({
        siblingSelector: '[role="tab"]',
        parentSelector: '[role="tablist"]',
        activateOnFocus: ctx.activateTabWithKeyboard,
        loop: ctx.loop,
        dir: theme.dir,
        orientation: ctx.orientation,
        onKeyDown
      })
    }),
    children: [icon && /* @__PURE__ */ jsx("div", {
      className: classes.tabIcon,
      children: icon
    }), children && /* @__PURE__ */ jsx("div", {
      className: classes.tabLabel,
      children
    }), rightSection && /* @__PURE__ */ jsx("div", {
      className: classes.tabRightSection,
      children: rightSection
    })]
  });
});
Tab.displayName = "@mantine/core/Tab";
function TabsProvider({
  defaultValue,
  value,
  onTabChange,
  orientation,
  children,
  loop,
  id,
  activateTabWithKeyboard,
  allowTabDeactivation,
  variant,
  color,
  radius,
  inverted,
  keepMounted = true
}) {
  const uid = useId(id);
  const [_value, onChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange: onTabChange
  });
  return /* @__PURE__ */ jsx(TabsContextProvider, {
    value: {
      value: _value,
      orientation,
      id: uid,
      loop,
      activateTabWithKeyboard,
      getTabId: getSafeId(`${uid}-tab`, TABS_ERRORS.value),
      getPanelId: getSafeId(`${uid}-panel`, TABS_ERRORS.value),
      onTabChange: onChange,
      allowTabDeactivation,
      variant,
      color,
      radius,
      inverted,
      keepMounted
    },
    children
  });
}
TabsProvider.displayName = "@mantine/core/TabsProvider";
var useStyles$v = createStyles((theme, { orientation }) => ({
  root: {
    display: orientation === "vertical" ? "flex" : void 0
  }
}));
const useStyles$w = useStyles$v;
var __defProp$G = Object.defineProperty;
var __defProps$l = Object.defineProperties;
var __getOwnPropDescs$l = Object.getOwnPropertyDescriptors;
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
var __spreadProps$l = (a, b) => __defProps$l(a, __getOwnPropDescs$l(b));
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
const defaultProps$b = {
  orientation: "horizontal",
  loop: true,
  activateTabWithKeyboard: true,
  allowTabDeactivation: false,
  unstyled: false,
  inverted: false,
  variant: "default"
};
const Tabs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Tabs", defaultProps$b, props), {
    defaultValue,
    value,
    orientation,
    loop,
    activateTabWithKeyboard,
    allowTabDeactivation,
    children,
    id,
    onTabChange,
    variant,
    color,
    className,
    unstyled,
    classNames,
    styles,
    radius,
    inverted,
    keepMounted
  } = _a, others = __objRest$s(_a, ["defaultValue", "value", "orientation", "loop", "activateTabWithKeyboard", "allowTabDeactivation", "children", "id", "onTabChange", "variant", "color", "className", "unstyled", "classNames", "styles", "radius", "inverted", "keepMounted"]);
  const {
    classes,
    cx
  } = useStyles$w({
    orientation,
    color,
    variant,
    radius,
    inverted
  }, {
    unstyled,
    name: "Tabs",
    classNames,
    styles
  });
  return /* @__PURE__ */ jsx(StylesApiProvider, {
    classNames,
    styles,
    unstyled,
    children: /* @__PURE__ */ jsx(TabsProvider, {
      activateTabWithKeyboard,
      defaultValue,
      orientation,
      onTabChange,
      value,
      id,
      loop,
      allowTabDeactivation,
      color,
      variant,
      radius,
      inverted,
      keepMounted,
      children: /* @__PURE__ */ jsx(Box, {
        ...__spreadProps$l(__spreadValues$G({}, others), {
          className: cx(classes.root, className),
          id,
          ref
        }),
        children
      })
    })
  });
});
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;
Tabs.displayName = "@mantine/core/Tabs";
var __defProp$F = Object.defineProperty;
var __defProps$k = Object.defineProperties;
var __getOwnPropDescs$k = Object.getOwnPropertyDescriptors;
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
var __spreadProps$k = (a, b) => __defProps$k(a, __getOwnPropDescs$k(b));
const sizes$4 = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40
};
var useStyles$t = createStyles((theme, { color, size: size2, radius, gradient, variant }) => {
  const colors = theme.fn.variant({
    variant,
    color: color || theme.primaryColor,
    gradient,
    primaryFallback: false
  });
  const iconSize = theme.fn.size({ size: size2, sizes: sizes$4 });
  return {
    root: __spreadProps$k(__spreadValues$F({}, theme.fn.fontStyles()), {
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
const useStyles$u = useStyles$t;
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
var __objRest$r = (source, exclude) => {
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
const defaultProps$a = {
  size: "md",
  variant: "filled",
  gradient: {
    from: "blue",
    to: "cyan",
    deg: 45
  }
};
const ThemeIcon = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ThemeIcon", defaultProps$a, props), {
    className,
    size: size2,
    radius,
    variant,
    color,
    children,
    gradient,
    unstyled
  } = _a, others = __objRest$r(_a, ["className", "size", "radius", "variant", "color", "children", "gradient", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$u({
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
    ...__spreadValues$E({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
ThemeIcon.displayName = "@mantine/core/ThemeIcon";
var useStyles$r = createStyles((theme, { bulletSize, color, radius, align, lineVariant, lineWidth }) => {
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    itemBody: {},
    itemContent: {},
    itemBullet: {
      boxSizing: "border-box",
      width: bulletSize,
      height: bulletSize,
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      border: `${lineWidth}px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      position: "absolute",
      top: 0,
      left: align === "left" ? -bulletSize / 2 - lineWidth / 2 : "auto",
      right: align === "right" ? -bulletSize / 2 - lineWidth / 2 : "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.white,
      "&[data-with-child]": {
        borderWidth: 1,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
      },
      "&[data-active]": {
        borderColor: colors.background,
        backgroundColor: theme.white,
        "&[data-with-child]": {
          backgroundColor: colors.background,
          color: theme.white
        }
      }
    },
    item: {
      position: "relative",
      boxSizing: "border-box",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      paddingLeft: align === "left" ? theme.spacing.xl : 0,
      paddingRight: align === "right" ? theme.spacing.xl : 0,
      textAlign: align,
      "&:not(:last-of-type)::before": {
        display: "block"
      },
      "&:not(:first-of-type)": {
        marginTop: theme.spacing.xl
      },
      "&::before": {
        boxSizing: "border-box",
        position: "absolute",
        top: 0,
        left: align === "left" ? -lineWidth : "auto",
        right: align === "right" ? -lineWidth : "auto",
        bottom: -theme.spacing.xl,
        borderLeft: `${lineWidth}px ${lineVariant} ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        content: '""',
        display: "none"
      },
      "&[data-line-active]": {
        "&::before": {
          borderLeftColor: colors.background
        }
      }
    },
    itemTitle: {
      fontWeight: 500,
      lineHeight: 1,
      marginBottom: theme.spacing.xs / 2,
      textAlign: align
    }
  };
});
const useStyles$s = useStyles$r;
var __defProp$D = Object.defineProperty;
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
var __objRest$q = (source, exclude) => {
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
function TimelineItem(_a) {
  var _b = _a, {
    className,
    bullet,
    title,
    bulletSize = 20,
    radius = "xl",
    lineWidth = 4,
    active,
    lineActive,
    classNames,
    styles,
    children,
    color,
    align,
    lineVariant = "solid",
    unstyled
  } = _b, others = __objRest$q(_b, ["className", "bullet", "title", "bulletSize", "radius", "lineWidth", "active", "lineActive", "classNames", "styles", "children", "color", "align", "lineVariant", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$s({
    bulletSize,
    color,
    radius,
    align,
    lineVariant,
    lineWidth
  }, {
    classNames,
    styles,
    unstyled,
    name: "Timeline"
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$D({
      className: cx(classes.item, className),
      "data-line-active": lineActive || void 0,
      "data-active": active || void 0
    }, others),
    children: [/* @__PURE__ */ jsx("div", {
      className: classes.itemBullet,
      "data-with-child": !!bullet || void 0,
      "data-active": active || void 0,
      children: bullet
    }), /* @__PURE__ */ jsxs("div", {
      className: classes.itemBody,
      children: [title && /* @__PURE__ */ jsx(Text, {
        className: classes.itemTitle,
        children: title
      }), /* @__PURE__ */ jsx("div", {
        className: classes.itemContent,
        children
      })]
    })]
  });
}
TimelineItem.displayName = "@mantine/core/TimelineItem";
var __defProp$C = Object.defineProperty;
var __getOwnPropSymbols$C = Object.getOwnPropertySymbols;
var __hasOwnProp$C = Object.prototype.hasOwnProperty;
var __propIsEnum$C = Object.prototype.propertyIsEnumerable;
var __defNormalProp$C = (obj, key, value) => key in obj ? __defProp$C(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$p = (source, exclude) => {
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
const defaultProps$9 = {
  active: -1,
  radius: "xl",
  bulletSize: 20,
  align: "left",
  lineWidth: 4,
  reverseActive: false
};
const Timeline = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Timeline", defaultProps$9, props), {
    children,
    active,
    color,
    radius,
    bulletSize,
    align,
    lineWidth,
    classNames,
    styles,
    sx,
    reverseActive,
    unstyled
  } = _a, others = __objRest$p(_a, ["children", "active", "color", "radius", "bulletSize", "align", "lineWidth", "classNames", "styles", "sx", "reverseActive", "unstyled"]);
  const _children = react.exports.Children.toArray(children);
  const items = _children.map((item, index2) => React.cloneElement(item, {
    classNames,
    styles,
    align,
    lineWidth,
    radius: item.props.radius || radius,
    color: item.props.color || color,
    bulletSize: item.props.bulletSize || bulletSize,
    unstyled,
    active: item.props.active || (reverseActive ? active >= _children.length - index2 - 1 : active >= index2),
    lineActive: item.props.lineActive || (reverseActive ? active >= _children.length - index2 - 1 : active - 1 >= index2)
  }));
  const offset2 = align === "left" ? {
    paddingLeft: bulletSize / 2 + lineWidth / 2
  } : {
    paddingRight: bulletSize / 2 + lineWidth / 2
  };
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$C({
      ref,
      sx: [offset2, ...packSx(sx)]
    }, others),
    children: items
  });
});
Timeline.Item = TimelineItem;
Timeline.displayName = "@mantine/core/Timeline";
const ITEM_PADDING = 7;
var useStyles$p = createStyles((theme, { reversed, native, radius }) => ({
  transferList: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  transferListItem: {
    display: "block",
    width: `calc(100% - ${ITEM_PADDING * 2}px)`,
    padding: ITEM_PADDING,
    marginLeft: theme.spacing.sm - ITEM_PADDING,
    marginRight: theme.spacing.sm - ITEM_PADDING,
    borderRadius: theme.fn.radius(radius),
    "&:first-of-type": {
      marginTop: theme.spacing.sm - ITEM_PADDING
    },
    "&:last-of-type": {
      marginBottom: theme.spacing.sm - ITEM_PADDING
    }
  },
  transferListItemHovered: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
  },
  transferListItems: {
    overflow: native ? "auto" : "hidden"
  },
  transferListHeader: {
    display: "flex",
    flexDirection: reversed ? "row-reverse" : "row"
  },
  transferListBody: {
    flex: 1,
    borderRadius: theme.fn.radius(radius),
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`
  },
  transferListTitle: {
    marginBottom: 5
  },
  transferListSearch: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopLeftRadius: reversed ? 0 : `calc(${theme.fn.radius(radius)}px - 1px)`,
    borderTopRightRadius: reversed ? `calc(${theme.fn.radius(radius)}px - 1px)` : 0,
    display: "block",
    borderBottomColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
  },
  transferListControl: {
    borderTop: 0,
    borderRightWidth: reversed ? void 0 : 0,
    borderLeftWidth: reversed ? 0 : void 0,
    borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4],
    "&:last-of-type": {
      borderTopLeftRadius: reversed ? `calc(${theme.fn.radius(radius)}px - 1px)` : 0,
      borderTopRightRadius: reversed ? 0 : `calc(${theme.fn.radius(radius)}px - 1px)`
    },
    "&:disabled": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "transparent",
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
    }
  },
  separator: {
    boxSizing: "border-box",
    textAlign: "left",
    width: "100%",
    padding: "7px 12px"
  },
  separatorLabel: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  }
}));
const useStyles$q = useStyles$p;
const icons = {
  Prev: PrevIcon,
  Next: NextIcon,
  First: FirstIcon,
  Last: LastIcon
};
const rtlIons = {
  Next: PrevIcon,
  Prev: NextIcon,
  Last: FirstIcon,
  First: LastIcon
};
function RenderList({
  className,
  data,
  onSelect,
  selection,
  itemComponent: ItemComponent,
  listComponent,
  searchPlaceholder,
  filter,
  nothingFound,
  title,
  showTransferAll,
  reversed,
  onMoveAll,
  onMove,
  height,
  radius,
  classNames,
  styles,
  limit,
  unstyled
}) {
  const {
    classes,
    cx,
    theme
  } = useStyles$q({
    reversed,
    native: listComponent !== SelectScrollArea,
    radius
  }, {
    name: "TransferList",
    classNames,
    styles,
    unstyled
  });
  const unGroupedItems = [];
  const groupedItems = [];
  const [query, setQuery] = react.exports.useState("");
  const [hovered, setHovered] = react.exports.useState(-1);
  const filteredData = data.filter((item) => filter(query, item)).slice(0, limit);
  const ListComponent = listComponent || "div";
  const Icons = theme.dir === "rtl" ? rtlIons : icons;
  const itemsRefs = react.exports.useRef({});
  const sortedData = groupOptions$1({
    data: filteredData
  });
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
  let groupName = null;
  sortedData.forEach((item, index2) => {
    const itemComponent = /* @__PURE__ */ jsx(UnstyledButton, {
      unstyled,
      tabIndex: -1,
      onClick: () => onSelect(item.value),
      onMouseEnter: () => setHovered(index2),
      className: cx(classes.transferListItem, {
        [classes.transferListItemHovered]: index2 === hovered
      }),
      ref: (node) => {
        if (itemsRefs && itemsRefs.current) {
          itemsRefs.current[item.value] = node;
        }
      },
      children: /* @__PURE__ */ jsx(ItemComponent, {
        data: item,
        selected: selection.includes(item.value),
        radius
      })
    }, item.value);
    if (!item.group) {
      unGroupedItems.push(itemComponent);
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
              label: groupName
            })
          }, groupName)
        );
      }
      groupedItems.push(itemComponent);
    }
  });
  if (groupedItems.length > 0 && unGroupedItems.length > 0) {
    unGroupedItems.unshift(
      /* @__PURE__ */ jsx("div", {
        className: classes.separator,
        children: /* @__PURE__ */ jsx(Divider, {
          unstyled,
          classNames: {
            label: classes.separatorLabel
          }
        })
      })
    );
  }
  const handleSearchKeydown = (event) => {
    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (filteredData[hovered]) {
          onSelect(filteredData[hovered].value);
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        setHovered((current) => {
          var _a;
          const nextIndex = current < filteredData.length - 1 ? current + 1 : current;
          targetRef.current = itemsRefs.current[(_a = filteredData[nextIndex]) == null ? void 0 : _a.value];
          scrollIntoView({
            alignment: "end"
          });
          return nextIndex;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setHovered((current) => {
          var _a;
          const nextIndex = current > 0 ? current - 1 : current;
          targetRef.current = itemsRefs.current[(_a = filteredData[nextIndex]) == null ? void 0 : _a.value];
          scrollIntoView({
            alignment: "start"
          });
          return nextIndex;
        });
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: cx(classes.transferList, className),
    children: [title && /* @__PURE__ */ jsx(Text, {
      weight: 500,
      unstyled,
      className: classes.transferListTitle,
      children: title
    }), /* @__PURE__ */ jsxs("div", {
      className: classes.transferListBody,
      children: [/* @__PURE__ */ jsxs("div", {
        className: classes.transferListHeader,
        children: [/* @__PURE__ */ jsx(TextInput, {
          unstyled,
          value: query,
          onChange: (event) => {
            setQuery(event.currentTarget.value);
            setHovered(0);
          },
          onFocus: () => setHovered(0),
          onBlur: () => setHovered(-1),
          placeholder: searchPlaceholder,
          radius: 0,
          onKeyDown: handleSearchKeydown,
          sx: {
            flex: 1
          },
          classNames: {
            input: classes.transferListSearch
          }
        }), /* @__PURE__ */ jsx(ActionIcon, {
          variant: "default",
          size: 36,
          radius: 0,
          className: classes.transferListControl,
          disabled: selection.length === 0,
          onClick: onMove,
          unstyled,
          children: reversed ? /* @__PURE__ */ jsx(Icons.Prev, {}) : /* @__PURE__ */ jsx(Icons.Next, {})
        }), showTransferAll && /* @__PURE__ */ jsx(ActionIcon, {
          variant: "default",
          size: 36,
          radius: 0,
          className: classes.transferListControl,
          disabled: data.length === 0,
          onClick: onMoveAll,
          unstyled,
          children: reversed ? /* @__PURE__ */ jsx(Icons.First, {}) : /* @__PURE__ */ jsx(Icons.Last, {})
        })]
      }), /* @__PURE__ */ jsx(ListComponent, {
        ref: scrollableRef,
        onMouseLeave: () => setHovered(-1),
        className: classes.transferListItems,
        style: {
          height,
          position: "relative",
          overflowX: "hidden"
        },
        children: groupedItems.length > 0 || unGroupedItems.length > 0 ? /* @__PURE__ */ jsxs(Fragment, {
          children: [groupedItems, unGroupedItems]
        }) : /* @__PURE__ */ jsx(Text, {
          color: "dimmed",
          unstyled,
          size: "sm",
          align: "center",
          mt: "sm",
          children: nothingFound
        })
      })]
    })]
  });
}
RenderList.displayName = "@mantine/core/RenderList";
const DefaultItem = React.memo(({
  data,
  selected,
  radius
}) => /* @__PURE__ */ jsx(Checkbox, {
  checked: selected,
  onChange: () => {
  },
  label: data.label,
  tabIndex: -1,
  radius,
  sx: {
    pointerEvents: "none"
  }
}));
function useSelectionState(initialSelection = [[], []]) {
  const [selection, setSelection] = react.exports.useState(initialSelection);
  const handleSelect = (listIndex, value) => setSelection((currentSelection) => {
    const listSelection = currentSelection[listIndex];
    let result = listSelection;
    if (typeof value === "string") {
      if (listSelection.includes(value)) {
        result = listSelection.filter((item) => item !== value);
      } else {
        result = [...listSelection, value];
      }
    }
    const clone = [...currentSelection];
    clone[listIndex] = result;
    return clone;
  });
  const handleDeselect = (listIndex, values2) => setSelection((currentSelection) => {
    const clone = [...currentSelection];
    clone[listIndex] = currentSelection[listIndex].filter((item) => !values2.includes(item));
    return clone;
  });
  const handleDeselectAll = (listIndex) => setSelection((currentSelection) => {
    const clone = [...currentSelection];
    clone[listIndex] = [];
    return clone;
  });
  const handlers = {
    select: handleSelect,
    deselect: handleDeselect,
    deselectAll: handleDeselectAll
  };
  return [selection, handlers];
}
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
function defaultFilter(query, item) {
  return item.label.toLowerCase().trim().includes(query.toLowerCase().trim());
}
const defaultProps$8 = {
  itemComponent: DefaultItem,
  filter: defaultFilter,
  titles: [null, null],
  listHeight: 150,
  listComponent: SelectScrollArea,
  showTransferAll: true,
  limit: Infinity
};
const TransferList = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TransferList", defaultProps$8, props), {
    value,
    onChange,
    itemComponent,
    searchPlaceholder,
    filter,
    nothingFound,
    titles,
    initialSelection,
    listHeight,
    listComponent,
    showTransferAll,
    breakpoint,
    radius,
    classNames,
    styles,
    limit,
    unstyled
  } = _a, others = __objRest$o(_a, ["value", "onChange", "itemComponent", "searchPlaceholder", "filter", "nothingFound", "titles", "initialSelection", "listHeight", "listComponent", "showTransferAll", "breakpoint", "radius", "classNames", "styles", "limit", "unstyled"]);
  const [selection, handlers] = useSelectionState(initialSelection);
  const handleMoveAll = (listIndex) => {
    const items = Array(2);
    const moveToIndex = listIndex === 0 ? 1 : 0;
    items[listIndex] = [];
    items[moveToIndex] = [...value[moveToIndex], ...value[listIndex]];
    onChange(items);
    handlers.deselectAll(listIndex);
  };
  const handleMove = (listIndex) => {
    const moveToIndex = listIndex === 0 ? 1 : 0;
    const items = Array(2);
    const transferData = value[listIndex].reduce((acc, item) => {
      if (!selection[listIndex].includes(item.value)) {
        acc.filtered.push(item);
      } else {
        acc.current.push(item);
      }
      return acc;
    }, {
      filtered: [],
      current: []
    });
    items[listIndex] = transferData.filtered;
    items[moveToIndex] = [...transferData.current, ...value[moveToIndex]];
    onChange(items);
    handlers.deselectAll(listIndex);
  };
  const breakpoints = breakpoint ? [{
    maxWidth: breakpoint,
    cols: 1
  }] : [];
  const sharedListProps = {
    itemComponent,
    listComponent,
    searchPlaceholder,
    filter,
    nothingFound,
    height: listHeight,
    showTransferAll,
    classNames,
    styles,
    limit,
    radius
  };
  return /* @__PURE__ */ jsxs(SimpleGrid, {
    ...__spreadValues$B({
      cols: 2,
      spacing: "xl",
      breakpoints,
      ref,
      unstyled
    }, others),
    children: [/* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$j(__spreadValues$B({}, sharedListProps), {
        data: value[0],
        selection: selection[0],
        onSelect: (val) => handlers.select(0, val),
        onMoveAll: () => handleMoveAll(0),
        onMove: () => handleMove(0),
        title: titles[0],
        unstyled
      })
    }), /* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$j(__spreadValues$B({}, sharedListProps), {
        data: value[1],
        selection: selection[1],
        onSelect: (val) => handlers.select(1, val),
        onMoveAll: () => handleMoveAll(1),
        onMove: () => handleMove(1),
        title: titles[1],
        reversed: true,
        unstyled
      })
    })]
  });
});
TransferList.displayName = "@mantine/core/TransferList";
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
var useStyles$n = createStyles((theme) => {
  const headings = keys(theme.headings.sizes).reduce((acc, h) => {
    const values2 = theme.headings.sizes[h];
    acc[`& ${h}`] = __spreadProps$i(__spreadValues$A({
      fontFamily: theme.headings.fontFamily,
      fontWeight: values2.fontWeight || theme.headings.fontWeight,
      marginTop: typeof values2.lineHeight === "number" ? theme.spacing.xl * values2.lineHeight : theme.spacing.xl,
      marginBottom: theme.spacing.sm
    }, values2), {
      "@media (max-width: 755px)": {
        fontSize: typeof values2.fontSize === "number" && values2.fontSize / 1.3
      }
    });
    return acc;
  }, {});
  return {
    root: __spreadProps$i(__spreadValues$A(__spreadProps$i(__spreadValues$A({}, theme.fn.fontStyles()), {
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      lineHeight: theme.lineHeight,
      fontSize: theme.fontSizes.md,
      "@media (max-width: 755px)": {
        fontSize: theme.fontSizes.sm
      }
    }), headings), {
      "& .ql-align-center": {
        textAlign: "center"
      },
      "& .ql-align-right": {
        textAlign: "right"
      },
      "& .ql-align-left": {
        textAlign: "left"
      },
      "& img": {
        maxWidth: "100%",
        marginBottom: theme.spacing.xs
      },
      "& p": {
        marginTop: 0,
        marginBottom: theme.spacing.lg
      },
      "& hr": {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderBottom: 0,
        borderLeft: 0,
        borderRight: 0,
        borderTop: `1px dashed ${theme.colors.gray[theme.colorScheme === "dark" ? 4 : 6]}`
      },
      "& a": __spreadProps$i(__spreadValues$A({}, theme.fn.focusStyles()), {
        color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline"
        }
      }),
      "& pre": {
        padding: theme.spacing.xs,
        lineHeight: theme.lineHeight,
        margin: 0,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
        overflowX: "auto",
        fontFamily: theme.fontFamilyMonospace,
        fontSize: theme.fontSizes.sm,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        "& code": {
          backgroundColor: "transparent",
          padding: 0,
          borderRadius: 0,
          color: "inherit",
          border: 0
        }
      },
      "& code": {
        lineHeight: theme.lineHeight,
        padding: `1px ${theme.spacing.xs / 1}px`,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[0],
        fontFamily: theme.fontFamilyMonospace,
        fontSize: theme.fontSizes.xs,
        border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[3]}`
      },
      "& ul, & ol": {
        marginBottom: theme.spacing.md,
        paddingLeft: theme.spacing.lg * 2,
        "& li": {
          marginTop: theme.spacing.xs
        }
      },
      "& table": {
        width: "100%",
        borderCollapse: "collapse",
        captionSide: "bottom",
        marginBottom: theme.spacing.md,
        "& caption": {
          marginTop: theme.spacing.xs,
          fontSize: theme.fontSizes.sm,
          color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6]
        },
        "& th": {
          textAlign: "left",
          fontWeight: "bold",
          color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
          fontSize: 14,
          padding: "7px 10px"
        },
        "& thead th": {
          borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
        },
        "& tfoot th": {
          borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`
        },
        "& td": {
          padding: "7px 10px",
          borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
          fontSize: 14
        },
        "& tr:last-of-type td": {
          borderBottom: "none"
        }
      },
      "& blockquote": {
        fontSize: theme.fontSizes.lg,
        lineHeight: theme.lineHeight,
        margin: `${theme.spacing.md}px 0`,
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
        padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "& cite": {
          display: "block",
          fontSize: theme.fontSizes.sm,
          marginTop: theme.spacing.xs,
          color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    })
  };
});
const useStyles$o = useStyles$n;
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
const TypographyStylesProvider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TypographyStylesProvider", {}, props), {
    className,
    unstyled
  } = _a, others = __objRest$n(_a, ["className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$o(null, {
    name: "TypographyStylesProvider",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$z({
      className: cx(classes.root, className),
      ref
    }, others)
  });
});
TypographyStylesProvider.displayName = "@mantine/core/TypographyStylesProvider";
const mCore = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createPolymorphicComponent,
  packSx,
  AVAILABLE_TRANSITIONS,
  Accordion,
  ChevronIcon: ChevronIcon$1,
  ActionIcon,
  Affix,
  Alert,
  Anchor,
  Navbar,
  Header,
  Aside,
  Footer,
  AppShell,
  AspectRatio,
  Autocomplete,
  Avatar,
  BackgroundImage,
  Badge,
  Blockquote,
  Box,
  Breadcrumbs,
  Burger,
  Button,
  Card,
  CardSection,
  Center,
  Checkbox,
  CheckIcon,
  CheckboxIcon,
  Chip,
  CloseButton,
  Code,
  Collapse,
  ColorInput,
  COLOR_PICKER_SIZES: sizes$d,
  ColorPicker,
  HueSlider,
  AlphaSlider,
  ColorSwatch,
  Container,
  CopyButton,
  Dialog,
  Divider,
  Drawer,
  FileButton,
  FileInput,
  FocusTrap,
  Grid,
  Col,
  Group,
  Highlight,
  HoverCard,
  Image,
  Indicator,
  Input,
  INPUT_SIZES: sizes$j,
  useInputProps,
  InputBase,
  validateJson,
  JsonInput,
  Kbd,
  List,
  Loader,
  LoadingOverlay,
  Mark,
  MediaQuery,
  Menu,
  Modal,
  MultiSelect,
  NativeSelect,
  NavLink,
  Notification,
  NumberInput,
  Overlay,
  Pagination,
  Paper,
  PasswordInput,
  Popover,
  Portal,
  OptionalPortal,
  Progress,
  Radio,
  RingProgress,
  ScrollArea,
  SegmentedControl,
  Select,
  SelectChevronIcon: ChevronIcon,
  SimpleGrid,
  getSortedBreakpoints,
  Skeleton,
  Slider,
  RangeSlider,
  Space,
  Spoiler,
  Stack,
  Step,
  Stepper,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Timeline,
  TimelineItem,
  Title,
  Tooltip,
  TransferList,
  Transition: Transition$2,
  GroupedTransition,
  TypographyStylesProvider,
  UnstyledButton,
  clsx,
  DEFAULT_THEME,
  MANTINE_COLORS,
  MANTINE_SIZES,
  MantineProvider,
  useComponentDefaultProps,
  useMantineTheme,
  ColorSchemeProvider,
  useMantineColorScheme,
  GlobalStyles,
  NormalizeCSS,
  StylesApiProvider,
  useContextStylesApi,
  getDefaultZIndex,
  extractSystemStyles,
  keyframes,
  createStyles,
  Global,
  useCss,
  useEmotionCache,
  defaultMantineEmotionCache,
  createEmotionCache: createCache
}, Symbol.toStringTag, { value: "Module" }));
const getSearchParamsObject = (params) => queryString.parse(params.toString());
const SearchParams = {
  changeSorting: (searchParams, setParams, sortItemName, sortDirection) => {
    const currentObj = getSearchParamsObject(searchParams);
    setParams(queryString.stringify({ ...currentObj, sortBy: `${sortItemName}:${sortDirection}` }));
  },
  changeFiltering: (searchParams, setParams, filter) => {
    const currentObj = getSearchParamsObject(searchParams);
    const newParamsObj = { ...currentObj, filter };
    setParams(queryString.stringify(newParamsObj));
  }
};
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
var useStyles$l = createStyles((theme, { zIndex }) => ({
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
const useStyles$m = useStyles$l;
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
    const index2 = notifications.findIndex((n) => n.id === notification.id);
    if (index2 === -1) {
      return notifications;
    }
    const newNotifications = [...notifications];
    newNotifications[index2] = notification;
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
  } = useStyles$m({
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
function generateItemFilter(label, operator, value) {
  function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
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
const [useModalsEvents, createEvent$2] = createUseExternalEvents$2("mantine-modals");
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
function groupOptions({ data }) {
  const sortedData = [];
  const unGroupedData = [];
  const groupedData = data.reduce((acc, item, index2) => {
    if (item.group) {
      if (acc[item.group])
        acc[item.group].push(index2);
      else
        acc[item.group] = [index2];
    } else {
      unGroupedData.push(index2);
    }
    return acc;
  }, {});
  Object.keys(groupedData).forEach((groupName) => {
    sortedData.push(...groupedData[groupName].map((index2) => data[index2]));
  });
  sortedData.push(...unGroupedData.map((itemIndex) => data[itemIndex]));
  return sortedData;
}
function getGroupedOptions(data) {
  const sorted = groupOptions({ data });
  const unGrouped = [];
  const grouped = [];
  let groupName = null;
  sorted.forEach((item, index2) => {
    if (!item.group) {
      unGrouped.push({ type: "item", item, index: index2 });
    } else {
      if (groupName !== item.group) {
        groupName = item.group;
        grouped.push({ type: "label", label: groupName });
      }
      grouped.push({ type: "item", item, index: index2 });
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
var useStyles$j = createStyles((theme, { radius }) => ({
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
const useStyles$k = useStyles$j;
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
  } = useStyles$k({
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
var useStyles$h = createStyles((theme) => ({
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
const useStyles$i = useStyles$h;
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
  } = useStyles$i(null, {
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
var useStyles$f = createStyles((theme, { centered, maxWidth, topOffset, radius, zIndex }) => ({
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
    overflow: "hidden",
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
const useStyles$g = useStyles$f;
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
  } = useStyles$g({
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
const AppContext = react.exports.createContext({});
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
function useSubpageEffect(title) {
  const {
    setAppTitle
  } = react.exports.useContext(AppContext);
  const {
    clearToolbar,
    setBreadCrumbs
  } = react.exports.useContext(AppContext);
  react.exports.useEffect(() => {
    const pageData = getNavigationItem(title);
    setAppTitle(pageData.title);
    setBreadCrumbs(pageData.crumbs.map((item) => /* @__PURE__ */ jsx(Anchor, {
      href: item.href,
      size: "sm",
      color: "green",
      children: item.title
    }, `${item.title}`)));
    return () => {
      clearToolbar();
      stopNavigationProgress();
      resetNavigationProgress();
    };
  }, [title]);
}
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
const useStyles$e = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  },
  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: isDark() ? theme.colors.dark[5] : theme.colors.gray[2]
  },
  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none"
    }
  },
  search: {
    [theme.fn.smallerThan("xs")]: {
      display: "none"
    }
  },
  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  },
  subheader: {
    height: 42,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 25
  }
}));
const links = [{
  label: "Dashboard",
  link: "/"
}, {
  label: "Admin Panel",
  link: "/admin/"
}];
function AdminHeader() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [opened, {
    toggle
  }] = useDisclosure(false);
  const {
    classes
  } = useStyles$e();
  const items = links.map((link) => /* @__PURE__ */ jsx("a", {
    href: link.link,
    className: classes.link,
    children: link.label
  }, link.label));
  const {
    toolbar,
    breadCrumbs
  } = react.exports.useContext(AppContext);
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsxs(Header, {
    height: 100,
    className: classes.header,
    mb: 120,
    pr: 0,
    pl: 0,
    children: [/* @__PURE__ */ jsxs(Container, {
      className: classes.inner,
      fluid: true,
      children: [/* @__PURE__ */ jsxs(Group, {
        children: [/* @__PURE__ */ jsx(Burger, {
          opened,
          onClick: toggle,
          size: "sm"
        }), /* @__PURE__ */ jsx(HeaderLogo, {})]
      }), /* @__PURE__ */ jsxs(Group, {
        children: [/* @__PURE__ */ jsx(Group, {
          ml: 50,
          spacing: 5,
          className: classes.links,
          children: items
        }), /* @__PURE__ */ jsx(Button, {
          onClick: () => openSpotlight(),
          variant: "default",
          sx: {
            minWidth: 200,
            display: "flex"
          },
          pl: 12,
          pr: 8,
          styles: {
            root: {
              backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
              "&:hover": {
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
              }
            }
          },
          children: /* @__PURE__ */ jsxs(Group, {
            position: "apart",
            sx: {
              minWidth: 200
            },
            children: [/* @__PURE__ */ jsxs(Group, {
              children: [/* @__PURE__ */ jsx(Aae, {
                size: 16,
                stroke: 1
              }), /* @__PURE__ */ jsx(Text, {
                color: "dimmed",
                weight: 400,
                children: "Search"
              })]
            }), /* @__PURE__ */ jsx(Kbd, {
              sx: {
                fontSize: 11,
                borderBottomWidth: 1
              },
              children: "\u2318 + K"
            })]
          })
        }), /* @__PURE__ */ jsx(Group, {
          spacing: 7,
          children: /* @__PURE__ */ jsx(UserMenu, {})
        }), /* @__PURE__ */ jsx(Group, {
          children: /* @__PURE__ */ jsx(ToggleThemeButton, {
            colorScheme,
            toggleColorScheme
          })
        })]
      })]
    }), /* @__PURE__ */ jsx(Paper, {
      shadow: "",
      children: /* @__PURE__ */ jsxs(Container, {
        className: classes.subheader,
        fluid: true,
        children: [/* @__PURE__ */ jsx(Group, {
          children: /* @__PURE__ */ jsx(Breadcrumbs, {
            children: breadCrumbs
          })
        }), /* @__PURE__ */ jsx(Group, {
          spacing: 4,
          mr: "md",
          position: "right",
          children: toolbar
        })]
      })
    })]
  });
}
const useStyles$d = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black
    }
  },
  link: {
    display: "block",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black
    }
  },
  rootLink: {
    display: "block",
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black
    },
    "&:active": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black
    }
  },
  chevron: {
    transition: "transform 200ms ease"
  }
}));
function LinksGroup({
  icon: Icon,
  label,
  links: links2,
  link
}) {
  const location = useLocation();
  const {
    classes
  } = useStyles$d();
  const hasLinks = Array.isArray(links2);
  const items = (hasLinks ? links2 : []).map((item) => /* @__PURE__ */ jsx(NavLink, {
    label: item.label,
    component: Link,
    className: classes.link,
    to: item.link,
    active: location.pathname === item.link
  }, item.label));
  return /* @__PURE__ */ jsx(NavLink, {
    label,
    component: Link,
    styles: () => ({
      body: {
        display: "flex"
      }
    }),
    to: link || "/",
    active: location.pathname === link,
    icon: /* @__PURE__ */ jsx(ThemeIcon, {
      variant: "light",
      size: 30,
      children: /* @__PURE__ */ jsx(Icon, {
        size: 18
      })
    }),
    childrenOffset: 26,
    children: items.length > 0 ? items : ""
  });
}
const tasksList = [
  {
    label: "Handle old Checks",
    name: "handle_old_checks",
    description: "\u26A0\uFE0FWe strongly recommended doing the remove inconsistent items procedure Before and After removing checks via this task.",
    inputs: [
      { name: "days", label: "Check older that (days)", type: "TextInput", default: 180 },
      { name: "remove", label: "Remove", type: "Checkbox", default: false }
    ]
  },
  {
    label: "Handle Database Consistency",
    name: "handle_database_consistency",
    description: "Checks and removes non-consistent items",
    inputs: [
      { name: "clean", label: "Remove", type: "Checkbox", default: false }
    ]
  },
  {
    label: "Remove old logs",
    name: "remove_old_logs",
    description: "Remove logs that older particular threshold",
    inputs: [
      { name: "days", label: "Remove older that (days)", type: "TextInput", default: 30 },
      { name: "statistics", label: "Only statistics", type: "Checkbox", default: false }
    ]
  }
];
const taskLinks = tasksList.map(
  (task) => ({
    label: task.label,
    link: `/admin/tasks/${task.name}`
  })
);
const navbarItems = [{
  label: "Users",
  icon: sge,
  link: "/admin/users"
}, {
  label: "Logs",
  icon: $i,
  link: "/admin/logs"
}, {
  label: "Tasks",
  icon: q0,
  links: taskLinks
}, {
  label: "Settings",
  icon: Lce,
  link: "/admin/settings"
}];
const useStyles$c = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0
  },
  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md
  },
  linksInner: {
    paddingBottom: theme.spacing.md
  }
}));
function AdminNavbar() {
  const {
    classes
  } = useStyles$c();
  const links2 = navbarItems.map((item) => /* @__PURE__ */ react.exports.createElement(LinksGroup, {
    ...item,
    key: item.label
  }));
  return /* @__PURE__ */ jsx(Navbar, {
    height: "100%",
    width: {
      sm: 300
    },
    pl: "md",
    pr: "md",
    pt: "sm",
    pb: "md",
    className: classes.navbar,
    children: /* @__PURE__ */ jsx(Navbar.Section, {
      grow: true,
      className: classes.links,
      component: ScrollArea,
      children: /* @__PURE__ */ jsx("div", {
        className: classes.linksInner,
        children: links2
      })
    })
  });
}
function Task({
  item
}) {
  useSubpageEffect(`Task: ${item.label}`);
  const [outputField, setOutputField] = react.exports.useState("");
  const [autoScrollChecked, setAutoScrollChecked] = react.exports.useState(true);
  const outputRef = react.exports.useRef(null);
  const autoScrollRef = react.exports.useRef(null);
  const stopRef = react.exports.useRef(null);
  const theme = useMantineTheme();
  async function handleTask(name, opts) {
    const queryParams = queryString.stringify(opts);
    const ctrl = new AbortController();
    fetch(`/task_${name}?${queryParams}`, {
      signal: ctrl.signal
    }).then((response) => response.body).then((rs) => {
      const reader = rs.getReader();
      stopRef.current.onclick = async () => {
        ctrl.abort();
        await setOutputField((prev) => `${prev}
Task Aborted`);
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      };
      return new ReadableStream({
        async start(controller) {
          while (true) {
            const {
              done,
              value
            } = await reader.read();
            if (done) {
              break;
            }
            await setOutputField((prev) => prev + new TextDecoder().decode(value));
            if (autoScrollRef.current.checked) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
            log.debug(new TextDecoder().decode(value));
            controller.enqueue(value);
          }
          controller.close();
          reader.releaseLock();
        }
      });
    });
  }
  const clearOutput = () => {
    setOutputField("");
  };
  const formInitialValues = {};
  item.inputs.forEach((input) => {
    formInitialValues[input.name] = input.default;
  });
  const form = useForm({
    initialValues: formInitialValues
  });
  const Inputs = item.inputs.map((input) => react.exports.createElement(
    mCore[input.type],
    {
      label: input.label,
      name: input.name,
      key: input.name,
      mt: 10,
      ...form.getInputProps(input.name)
    }
  ));
  return /* @__PURE__ */ jsxs(Paper, {
    p: 10,
    children: [/* @__PURE__ */ jsx(Title, {
      order: 3,
      mb: "sm",
      children: item.label
    }), /* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: item.description
    }), /* @__PURE__ */ jsxs(Stack, {
      mt: 15,
      children: [/* @__PURE__ */ jsxs("form", {
        onSubmit: form.onSubmit((values2) => handleTask(item.name, values2)),
        children: [Inputs, /* @__PURE__ */ jsxs(Group, {
          mt: 20,
          children: [/* @__PURE__ */ jsx(Button, {
            size: "sm",
            type: "submit",
            children: "Start Task"
          }), /* @__PURE__ */ jsx(Button, {
            ref: stopRef,
            size: "sm",
            color: "red",
            children: "StopTask"
          }), /* @__PURE__ */ jsx(Button, {
            size: "sm",
            variant: "outline",
            onClick: clearOutput,
            children: "Clear Output"
          }), /* @__PURE__ */ jsx(Checkbox, {
            ref: autoScrollRef,
            label: "Auto Scroll",
            onChange: (event) => setAutoScrollChecked(event.target.checked),
            checked: autoScrollChecked
          })]
        })]
      }), /* @__PURE__ */ jsx("textarea", {
        readOnly: true,
        ref: outputRef,
        style: {
          marginTop: "0px",
          marginBottom: "0px",
          width: "100%",
          height: "50vh",
          color: "white",
          fontSize: "1rem",
          padding: "10px",
          backgroundColor: isDark() ? theme.colors.dark[9] : theme.colors.dark[6]
        },
        value: outputField
      })]
    })]
  });
}
function TaskWrapper() {
  const params = useParams();
  return /* @__PURE__ */ jsx(Task, {
    item: tasksList.find((x) => x.name === params.task)
  });
}
const Password = {
  Requirement({
    meets,
    label
  }) {
    return /* @__PURE__ */ jsxs(Text, {
      color: meets ? "teal" : "red",
      sx: {
        display: "flex",
        alignItems: "center"
      },
      mt: 7,
      size: "sm",
      children: [meets ? /* @__PURE__ */ jsx(Nb, {
        size: 14
      }) : /* @__PURE__ */ jsx(aze, {
        size: 14
      }), /* @__PURE__ */ jsx(Box, {
        ml: 10,
        children: label
      })]
    });
  },
  Popover({
    disabled,
    form,
    label = "",
    ...rest
  }) {
    const [popoverOpened, setPopoverOpened] = react.exports.useState(false);
    const [checks, setChecks] = react.exports.useState([]);
    react.exports.useEffect(() => {
      if (checks.length) {
        setPopoverOpened(true);
      }
    }, [form.errors.password]);
    return /* @__PURE__ */ jsxs(Popover, {
      opened: popoverOpened,
      position: "bottom",
      width: 200,
      transition: "pop",
      children: [/* @__PURE__ */ jsx(Popover.Target, {
        children: /* @__PURE__ */ jsx(PasswordInput, {
          onFocusCapture: (e) => {
            if (e.target.value !== "")
              setPopoverOpened(true);
          },
          onBlurCapture: () => setPopoverOpened(false),
          onChange: (event) => {
            setPopoverOpened(true);
            form.getInputProps("password").onChange(event);
            setChecks(() => Password.passwordsRequirementsForPopOver(event.target.value).result);
          },
          error: form.getInputProps("password").error,
          value: form.getInputProps("password").value,
          sx: {
            width: "16%"
          },
          placeholder: "Your password",
          disabled,
          autoComplete: "off",
          required: true,
          ...rest,
          label
        })
      }), /* @__PURE__ */ jsx(Popover.Dropdown, {
        children: checks
      })]
    });
  },
  passwordsRequirementsForPopOver(password) {
    const passwordRequirements = [{
      index: 0,
      re: /.{6}/,
      label: "Includes at least 6 characters"
    }, {
      index: 1,
      re: /[0-9]/,
      label: "Includes number"
    }, {
      index: 2,
      re: /[a-z]/,
      label: "Includes lowercase letter"
    }, {
      index: 3,
      re: /[A-Z]/,
      label: "Includes uppercase letter"
    }, {
      index: 4,
      re: /[$&+,:;=?@#|'<>.^*()%!-]/,
      label: "Includes special symbol"
    }];
    const result = [];
    passwordRequirements.forEach((requirement) => {
      result.push(/* @__PURE__ */ jsx(Password.Requirement, {
        meets: requirement.re.test(password),
        label: requirement.label
      }, requirement.index));
    });
    const isFail = result.filter((x) => !x.props.meets).length > 0 ? true : null;
    return {
      result,
      isFail
    };
  }
};
function ActionPopoverIcon({
  icon,
  color = "red",
  action,
  confirmLabel,
  title,
  testAttr,
  loading
}) {
  const [openPopover, toggleOpenPopover] = useToggle([false, true]);
  return /* @__PURE__ */ jsxs(Popover, {
    opened: openPopover,
    position: "bottom",
    withArrow: true,
    shadow: "md",
    children: [/* @__PURE__ */ jsx(Popover.Target, {
      children: /* @__PURE__ */ jsx(ActionIcon, {
        "data-test": testAttr,
        variant: "light",
        color,
        onClick: () => toggleOpenPopover(),
        title,
        loading,
        children: icon
      })
    }), /* @__PURE__ */ jsx(Popover.Dropdown, {
      p: 4,
      onBlurCapture: () => toggleOpenPopover(),
      children: /* @__PURE__ */ jsx(Button, {
        "data-test": `${testAttr}-confirm`,
        color,
        onClick: action,
        children: confirmLabel
      })
    })]
  });
}
function SafeSelect({
  optionsData,
  required,
  loaded = false,
  ...rest
}) {
  const changeHandler = (event) => {
    rest.onChange(event.target.value);
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Select, {
      data: optionsData,
      required,
      dropdownPosition: "bottom",
      icon: loaded && /* @__PURE__ */ jsx(Loader, {
        size: 24
      }),
      ...rest
    }), /* @__PURE__ */ jsx("select", {
      name: rest.name,
      style: {
        width: 0,
        opacity: 0,
        position: "fixed"
      },
      ...rest,
      onChange: changeHandler,
      children: optionsData.map((option) => {
        return /* @__PURE__ */ jsx("option", {
          value: option.value,
          children: option.label
        }, option.value);
      })
    })]
  });
}
function UserForm({
  id,
  username,
  firstName,
  lastName,
  role,
  apiKey,
  updatedDate,
  createdDate,
  refetch
}) {
  const [editMode, setEditMode] = react.exports.useState(false);
  const form = useForm({
    initialValues: {
      id,
      username,
      firstName,
      lastName,
      role,
      password: "",
      apiKey: "",
      updatedDate,
      createdDate
    },
    validate: {
      password: (value) => value === "" ? null : Password.passwordsRequirementsForPopOver(value).isFail
    }
  });
  const updateUser = useMutation((data) => UsersService.update(data), {
    onSuccess: async (result) => {
      successMsg({
        message: `User: '${result.username}' has been successfully updated`
      });
      log.debug({
        result
      });
      refetch();
    },
    onError: (e) => {
      errorMsg({
        error: `Cannot update the user, ${String(e)}`
      });
      log.error(e);
    }
  });
  const deleteUser = useMutation((userId) => UsersService.delete(userId), {
    onSuccess: async () => {
      successMsg({
        message: "User has been successfully removed"
      });
      refetch();
    },
    onError: (e) => {
      errorMsg({
        error: `Cannot delete the user, ${String(e)}`
      });
      log.error(e);
    }
  });
  const update = () => {
    if (form.validate().hasErrors)
      return;
    updateUser.mutate(form.values);
    setEditMode(false);
  };
  const removeUser = () => {
    deleteUser.mutate(form.values.id);
  };
  return /* @__PURE__ */ jsx(Group, {
    children: /* @__PURE__ */ jsx("form", {
      children: /* @__PURE__ */ jsxs(Group, {
        noWrap: true,
        spacing: "xs",
        align: "center",
        "data-test": username,
        children: [/* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-id",
          value: id,
          disabled: true
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-email",
          value: username,
          disabled: true,
          ...form.getInputProps("username")
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-first-name",
          value: firstName,
          disabled: !editMode,
          ...form.getInputProps("firstName")
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-last-name",
          value: lastName,
          disabled: !editMode,
          ...form.getInputProps("lastName")
        }), /* @__PURE__ */ jsx(SafeSelect, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-role",
          optionsData: [{
            value: "user",
            label: "User"
          }, {
            value: "reviewer",
            label: "Reviewer"
          }, {
            value: "admin",
            label: "Admin"
          }],
          required: true,
          disabled: !editMode,
          ...form.getInputProps("role")
        }), /* @__PURE__ */ jsx(Password.Popover, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-password",
          disabled: !editMode,
          form
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-api-key",
          value: apiKey,
          disabled: true
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-created-date",
          value: createdDate,
          disabled: true
        }), /* @__PURE__ */ jsx(TextInput, {
          sx: {
            width: "11%"
          },
          "data-test": "user-list-updated-date",
          value: updatedDate,
          disabled: true
        }), username !== "Administrator" && username !== "Guest" ? /* @__PURE__ */ jsxs(Group, {
          noWrap: true,
          spacing: 4,
          align: "center",
          children: [/* @__PURE__ */ jsx(ActionIcon, {
            name: "editUser",
            "data-test": !editMode ? "user-list-update-button" : "user-list-send-button",
            onClick: !editMode ? () => setEditMode(true) : update,
            variant: "light",
            color: "green",
            title: editMode ? "Send changes" : "Edit User",
            loading: updateUser.isLoading,
            children: editMode ? /* @__PURE__ */ jsx(_ae, {
              size: 18
            }) : /* @__PURE__ */ jsx(gI, {
              size: 18
            })
          }), /* @__PURE__ */ jsx(ActionPopoverIcon, {
            testAttr: "user-list-remove-button",
            icon: /* @__PURE__ */ jsx(aze, {
              size: 18
            }),
            action: removeUser,
            title: "Remove user",
            loading: deleteUser.isLoading,
            confirmLabel: "Delete"
          })]
        }) : /* @__PURE__ */ jsx(ActionIcon, {
          sx: {
            minWidth: "60px"
          }
        })]
      })
    })
  });
}
const Email = {
  DuplicationFree({
    form,
    setEmailError,
    setEmailIsFetchingStatus,
    disabled = false,
    label = "Email",
    setErrorOnRuntime = true,
    ...rest
  }) {
    const useEmailCheckQuery = () => useQuery(
      ["userByEmail", form.values.username],
      async () => {
        return UsersService.getUsers({
          username: form.values.username
        });
      },
      {
        enabled: !!form.values.username && /^\S+@\S+$/.test(form.values.username),
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          const {
            results
          } = data;
          if (results.length > 0) {
            setEmailError("user with this email already exists");
            if (setErrorOnRuntime)
              form.setFieldError("username", "user with this email already exists");
            return;
          }
          setEmailError(null);
          if (setErrorOnRuntime)
            form.setFieldError("username", null);
        },
        onError: () => {
          setEmailError("cannot check the field, connection error");
          if (setErrorOnRuntime)
            form.setFieldError("username", "cannot check the field, connection error");
        }
      }
    );
    const userByEmailQuery = useEmailCheckQuery();
    react.exports.useEffect(() => {
      setEmailIsFetchingStatus(userByEmailQuery.isFetching);
    }, [userByEmailQuery.isFetching]);
    return /* @__PURE__ */ jsx(TextInput, {
      label,
      placeholder: "j.smith@example.com",
      ...form.getInputProps("username"),
      required: true,
      rightSection: userByEmailQuery.isFetching && /* @__PURE__ */ jsx(Loader, {
        size: "xs"
      }),
      icon: /* @__PURE__ */ jsx(ka, {
        size: 16
      }),
      autoComplete: "nope",
      disabled,
      id: "email",
      styles: () => ({
        input: {
          paddingRight: 36
        }
      }),
      ...rest
    });
  }
};
function UserAddForm({
  setAddUser,
  refetch
}) {
  useSubpageEffect("Users");
  const [emailError, setEmailError] = react.exports.useState("");
  const [emailIsFetchingStatus, setEmailIsFetchingStatus] = react.exports.useState(false);
  const form = useForm({
    initialValues: {
      id: "",
      username: "",
      firstName: "",
      lastName: "",
      role: "user",
      password: "",
      apiKey: "",
      updatedDate: "",
      createdDate: ""
    },
    validateInputOnChange: ["username"],
    validate: {
      username: (value) => {
        if (!/^\S+@\S+$/.test(value)) {
          return "Invalid email format";
        }
        if (emailError)
          return emailError;
        return null;
      },
      password: (value) => Password.passwordsRequirementsForPopOver(value).isFail
    }
  });
  const addUser = useMutation((data) => UsersService.create(data), {
    onSuccess: async (result) => {
      successMsg({
        message: `User: '${result.username}' has been successfully created`
      });
      log.debug({
        result
      });
      setAddUser(false);
      refetch();
    },
    onError: (e) => {
      errorMsg({
        error: `Cannot create the user, ${String(e)}`
      });
      log.error(e);
    }
  });
  const formSubmitHandler = (values2) => {
    addUser.mutate(values2);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: form.onSubmit((values2) => formSubmitHandler(values2)),
    children: [/* @__PURE__ */ jsxs(Group, {
      noWrap: true,
      spacing: "xs",
      position: "right",
      align: "start",
      sx: {
        width: "100%"
      },
      mt: "lg",
      children: [/* @__PURE__ */ jsx(Email.DuplicationFree, {
        "data-test": "user-add-email",
        form,
        setEmailError,
        setEmailIsFetchingStatus
      }), /* @__PURE__ */ jsx(TextInput, {
        label: "First Name",
        "data-test": "user-add-first-name",
        placeholder: "John",
        ...form.getInputProps("firstName"),
        icon: /* @__PURE__ */ jsx(age, {
          size: 16
        }),
        disabled: !!form.errors.username || emailIsFetchingStatus,
        required: true
      }), /* @__PURE__ */ jsx(TextInput, {
        label: "Last Name",
        "data-test": "user-add-last-name",
        placeholder: "Smith",
        ...form.getInputProps("lastName"),
        icon: /* @__PURE__ */ jsx(age, {
          size: 16
        }),
        disabled: !!form.errors.username || emailIsFetchingStatus,
        required: true
      }), /* @__PURE__ */ jsx(SafeSelect, {
        label: "Role",
        "data-test": "user-add-role",
        optionsData: [{
          value: "user",
          label: "User"
        }, {
          value: "reviewer",
          label: "Reviewer"
        }, {
          value: "admin",
          label: "Admin"
        }],
        required: true,
        disabled: !!form.errors.username || emailIsFetchingStatus,
        ...form.getInputProps("role")
      }), /* @__PURE__ */ jsx(Password.Popover, {
        "data-test": "user-add-password",
        disabled: !!form.errors.username || emailIsFetchingStatus,
        form,
        label: "Password"
      })]
    }), /* @__PURE__ */ jsxs(Group, {
      spacing: "xs",
      align: "flex-end",
      position: "center",
      mt: "lg",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(Button, {
        onClick: () => setAddUser(false),
        leftIcon: /* @__PURE__ */ jsx(aze, {
          size: 18
        }),
        color: "red",
        variant: "light",
        children: "Cancel"
      }), /* @__PURE__ */ jsx(Button, {
        id: "create",
        type: "submit",
        title: "Create new User",
        leftIcon: /* @__PURE__ */ jsx(_ae, {
          size: 18
        }),
        children: "Create"
      })]
    })]
  });
}
function AdminUsers() {
  const {
    updateToolbar
  } = react.exports.useContext(AppContext);
  useSubpageEffect("Users");
  const {
    isLoading,
    error,
    data,
    refetch,
    isSuccess,
    isFetching
  } = UserHooks.useAllUsers();
  useNavProgressFetchEffect(isFetching);
  const theme = useMantineTheme();
  react.exports.useEffect(function addReloadIcon() {
    updateToolbar(/* @__PURE__ */ jsx(ActionIcon, {
      title: "reload users",
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      variant: "subtle",
      onClick: () => {
        refetch();
      },
      children: /* @__PURE__ */ jsx(Xne, {
        stroke: 1,
        size: 24
      })
    }), 50);
  }, []);
  const [addUser, setAddUser] = react.exports.useState(false);
  const useStyles2 = createStyles(() => ({
    headInput: {
      paddingLeft: "12px",
      paddingRight: "12px"
    }
  }));
  const {
    classes
  } = useStyles2();
  if (isLoading) {
    return /* @__PURE__ */ jsx(LoadingOverlay, {
      visible: true
    });
  }
  if (error) {
    return /* @__PURE__ */ jsxs(Text, {
      color: "red",
      children: ["Error:", " ", error.toString()]
    });
  }
  if (isSuccess && data) {
    return /* @__PURE__ */ jsx(ScrollArea.Autosize, {
      maxHeight: "90vh",
      sx: {
        width: "100%"
      },
      children: /* @__PURE__ */ jsxs(Box, {
        p: 20,
        children: [/* @__PURE__ */ jsx(Title, {
          children: "Users"
        }), /* @__PURE__ */ jsxs(Group, {
          spacing: "xs",
          noWrap: true,
          mt: 40,
          children: [/* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Id"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Username"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "First Name"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Last Name"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Role"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Password"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "API Key"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Created"
          }), /* @__PURE__ */ jsx(TextInput, {
            sx: {
              width: "11%"
            },
            readOnly: true,
            className: classes.headInput,
            variant: "unstyled",
            value: "Updated"
          }), /* @__PURE__ */ jsx(Box, {
            component: "div",
            sx: {
              minWidth: "71px"
            }
          })]
        }), /* @__PURE__ */ jsx(Group, {
          children: data.results.map((user) => /* @__PURE__ */ jsx(UserForm, {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            password: "",
            apiKey: user.apiKey || "",
            updatedDate: user.updatedDate || "",
            createdDate: user.createdDate,
            refetch
          }, user.id))
        }), /* @__PURE__ */ jsx(Group, {
          position: "center",
          children: addUser && /* @__PURE__ */ jsx(UserAddForm, {
            setAddUser,
            refetch
          })
        }), /* @__PURE__ */ jsx(Group, {
          position: "center",
          mt: 40,
          children: !addUser && /* @__PURE__ */ jsx(Button, {
            onClick: () => setAddUser(true),
            id: "add-new-user",
            children: "Add New User"
          })
        })]
      })
    });
  }
  return /* @__PURE__ */ jsx(Text, {
    color: "red",
    children: "Unknown Error"
  });
}
const SettingsService = {
  async getSettings() {
    const uri = `${config$1.baseUri}/v1/settings`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  },
  async update(data) {
    const url = `${config$1.baseUri}/v1/settings/${data.name}`;
    const resp = await ky.patch(
      url,
      { json: data }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`cannot update resource: '${url}', resp: '${JSON.stringify(resp)}'`);
  }
};
function Boolean$1({
  name,
  value,
  label,
  description,
  enabled,
  updateSetting
}) {
  const form = useForm({
    initialValues: {
      value,
      enabled
    }
  });
  const handleSubmit = (values2) => {
    updateSetting.mutate(values2);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: form.onSubmit((values2) => handleSubmit({
      ...values2,
      name
    })),
    children: [/* @__PURE__ */ jsx(Title, {
      size: "sm",
      pb: 20,
      children: label
    }), /* @__PURE__ */ jsxs(Group, {
      spacing: "xl",
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        "data-test": `settings_value_${name}`,
        sx: {
          width: "130px"
        },
        size: "md",
        optionsData: [{
          value: "true",
          label: "true"
        }, {
          value: "false",
          label: "false"
        }],
        ...form.getInputProps("value")
      }), /* @__PURE__ */ jsx(Checkbox, {
        "data-test": `settings_enabled_${name}`,
        size: "md",
        label: "enabled",
        ...form.getInputProps("enabled", {
          type: "checkbox"
        })
      })]
    }), /* @__PURE__ */ jsx(Text, {
      children: description
    }), /* @__PURE__ */ jsx(Group, {
      position: "right",
      mt: "md",
      children: /* @__PURE__ */ jsx(Button, {
        type: "submit",
        "data-test": `settings_update_button_${name}`,
        children: "Update"
      })
    })]
  });
}
const SettingsForms = {
  Boolean: Boolean$1
};
function FormWrapper({
  name,
  value,
  label,
  description,
  enabled,
  type,
  settingsQuery
}) {
  const Form = SettingsForms[type];
  const updateSetting = useMutation((data) => SettingsService.update(data), {
    onSuccess: async () => {
      successMsg({
        message: `Parameter '${name}' saved`
      });
    },
    onError: (e) => {
      errorMsg({
        error: e
      });
    },
    onSettled: () => settingsQuery.refetch()
  });
  return /* @__PURE__ */ jsx(Paper, {
    withBorder: true,
    p: 20,
    m: 15,
    sx: {
      width: "90%"
    },
    children: /* @__PURE__ */ jsx(Form, {
      name,
      description,
      label,
      value,
      enabled,
      updateSetting
    })
  });
}
function AdminSettings() {
  useSubpageEffect("Settings");
  const settingsQuery = useQuery(["settings"], () => SettingsService.getSettings(), {
    enabled: true,
    onError: (err) => {
      errorMsg({
        error: err
      });
      log.error(err);
    }
  });
  useNavProgressFetchEffect(settingsQuery.isFetching);
  return /* @__PURE__ */ jsxs(Box, {
    p: 10,
    children: [/* @__PURE__ */ jsx(Title, {
      children: "Admin Settings"
    }), settingsQuery.isLoading ? /* @__PURE__ */ jsx(LoadingOverlay, {
      visible: settingsQuery.isLoading
    }) : settingsQuery.isSuccess ? settingsQuery.data.map((item) => /* @__PURE__ */ jsx(FormWrapper, {
      name: item.name,
      description: item.description,
      label: item.label,
      value: item.value,
      enabled: item.enabled,
      type: item.type,
      settingsQuery
    }, item.name)) : /* @__PURE__ */ jsxs(Text, {
      color: "red",
      children: [" Cannot load data: ", settingsQuery.error.toString()]
    })]
  });
}
const RefreshActionIcon = ({
  newestItemsQuery,
  firstPageQuery,
  infinityQuery
}) => {
  var _a, _b, _c, _d, _e, _f;
  const theme = useMantineTheme();
  const newestItems = ((_a = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _a.results.length) > 50 ? "50+" : (_b = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _b.results.length;
  const pluralCharset = newestItems > 1 ? "s" : "";
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(ActionIcon, {
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "table-refresh-icon",
      variant: "subtle",
      onClick: () => firstPageQuery.refetch(),
      children: [/* @__PURE__ */ jsx(Xne, {
        size: 24,
        stroke: 1
      }), ((_d = (_c = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _c.results) == null ? void 0 : _d.length) !== void 0 && ((_f = (_e = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _e.results) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ jsx(Badge, {
        component: "div",
        title: ` You have ${newestItems} new item${pluralCharset}, refresh the page to see them`,
        pl: 4,
        pr: 4,
        pt: 6,
        pb: 6,
        color: "red",
        variant: "filled",
        radius: "xl",
        "data-test": "table-refresh-icon-badge",
        sx: {
          fontSize: "12px",
          position: "absolute",
          bottom: 11,
          left: 14,
          lineHeight: "16px",
          fontWeight: 400,
          fontFamily: '"Roboto","Arial",sans-serif',
          border: `2px`,
          borderStyle: "solid",
          borderColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "white"
        },
        children: newestItems
      })]
    })
  });
};
const LogsService = {
  async getLogs(filter = {}, options = {}) {
    const queryOptions = { ...options, limit: options.limit || 10 };
    const queryOptionsString = queryString.stringify(queryOptions);
    const uri = `${config$1.baseUri}/v1/logs?${queryOptionsString}&filter=${JSON.stringify(filter)}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  },
  async distinct(field) {
    const uri = `${config$1.baseUri}/v1/logs/distinct?field=${field}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  }
};
function useInfinityScroll(searchParams) {
  var _a, _b, _c, _d, _e;
  const firstPageQuery = useQuery(["logs_infinity_first_page"], () => LogsService.getLogs({}, {
    page: "1",
    limit: "1"
  }), {
    enabled: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  const lastLogTimestamp = ((_b = (_a = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _a.results) == null ? void 0 : _b.length) ? (_c = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _c.results[0].timestamp : void 0;
  const firstPageData = react.exports.useMemo(() => {
    var _a2, _b2;
    return {
      lastLogTimestamp,
      totalPages: (_a2 = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _a2.totalPages,
      totalResults: (_b2 = firstPageQuery == null ? void 0 : firstPageQuery.data) == null ? void 0 : _b2.totalResults
    };
  }, [lastLogTimestamp]);
  const timestampUpdatedFilter = react.exports.useMemo(() => {
    const prevFilterObj = JSON.parse(searchParams.get("filter"));
    return {
      $and: [{
        timestamp: {
          $lte: new Date(firstPageData.lastLogTimestamp)
        }
      }, prevFilterObj || {}]
    };
  }, [firstPageData.lastLogTimestamp, firstPageQuery.status, searchParams.toString()]);
  const infinityQuery = useInfiniteQuery(["logs_infinity_pages", firstPageData.lastLogTimestamp, searchParams.toString()], ({
    pageParam = 1
  }) => LogsService.getLogs(timestampUpdatedFilter, {
    limit: String(20),
    page: pageParam,
    sortBy: searchParams.get("sortBy") || void 0
  }), {
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages)
        return void 0;
      return lastPage.page + 1;
    },
    refetchOnWindowFocus: false,
    enabled: !!firstPageData.lastLogTimestamp && !!timestampUpdatedFilter,
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  const newestItemsQuery = useQuery(["logs_infinity_newest_pages", firstPageData.lastLogTimestamp], () => LogsService.getLogs({
    timestamp: {
      $gt: firstPageData.lastLogTimestamp
    }
  }, {
    limit: String(0)
  }), {
    enabled: ((_e = (_d = infinityQuery.data) == null ? void 0 : _d.pages) == null ? void 0 : _e.length) > 0,
    refetchInterval: 3e3,
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
const adminLogsTableColumns = {
  _id: {
    label: "Id",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "IdFilter"
  },
  hostname: {
    label: "Hostname",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  level: {
    label: "Level",
    headStyle: { width: "5%" },
    cellStyle: { width: "5%" },
    type: "LogLevelFilter"
  },
  message: {
    label: "Message",
    headStyle: { width: "auto" },
    cellStyle: {
      width: "auto"
    },
    type: "StringFilter"
  },
  "meta.user": {
    label: "User",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  "meta.scope": {
    label: "Scope",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  "meta.msgType": {
    label: "Type",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  timestamp: {
    label: "Timestamp",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "DateFilter"
  }
};
const InfinityScrollSkeleton = ({
  infinityQuery,
  visibleFields
}) => {
  const {
    ref,
    inView
  } = useInView();
  react.exports.useEffect(() => {
    if (inView) {
      infinityQuery.fetchNextPage();
    }
  }, [inView]);
  return /* @__PURE__ */ jsx("tfoot", {
    ref,
    children: infinityQuery.hasNextPage && Object.keys(new Array(6).fill("")).map((x) => /* @__PURE__ */ jsxs("tr", {
      style: {
        height: 72
      },
      children: [/* @__PURE__ */ jsx("td", {
        style: {
          width: 40,
          padding: 10
        },
        children: /* @__PURE__ */ jsx(Skeleton, {
          height: 20,
          radius: "sm"
        })
      }), Object.keys(adminLogsTableColumns).map((column) => {
        if (!visibleFields.includes(column))
          return void 0;
        if (column === "level")
          return /* @__PURE__ */ jsx("td", {
            style: {
              ...adminLogsTableColumns[column].cellStyle,
              paddingLeft: "8px"
            },
            children: /* @__PURE__ */ jsx(Skeleton, {
              height: 34,
              circle: true,
              radius: "xl"
            })
          }, column);
        return /* @__PURE__ */ jsx("td", {
          style: {
            ...adminLogsTableColumns[column].cellStyle,
            paddingLeft: 5,
            paddingRight: 25
          },
          children: /* @__PURE__ */ jsx(Skeleton, {
            height: 16,
            radius: "md"
          })
        }, column);
      })]
    }, x))
  });
};
function PagesCountAffix({
  loaded,
  total,
  scrollAreaRef
}) {
  var _a, _b;
  const isMounted = !!((_b = (_a = scrollAreaRef == null ? void 0 : scrollAreaRef.current) == null ? void 0 : _a.querySelector(".mantine-ScrollArea-viewport")) == null ? void 0 : _b.scrollTop);
  return /* @__PURE__ */ jsx(Affix, {
    position: {
      bottom: 20,
      right: 20
    },
    children: /* @__PURE__ */ jsx(Transition$2, {
      transition: "slide-up",
      mounted: isMounted,
      children: (transitionStyles) => /* @__PURE__ */ jsxs(Button, {
        "data-test": "infinity-scroll-affix",
        size: "lg",
        color: "dark",
        style: transitionStyles,
        title: "Scroll to top",
        rightIcon: /* @__PURE__ */ jsx(hl, {
          size: 16
        }),
        onClick: () => {
          var _a2;
          return (_a2 = scrollAreaRef == null ? void 0 : scrollAreaRef.current) == null ? void 0 : _a2.querySelector(".mantine-ScrollArea-viewport").scroll(0, 0);
        },
        children: [/* @__PURE__ */ jsx(Text, {
          size: "sm",
          "data-test": "infinity-scroll-affix-loaded-count",
          p: 3,
          title: "Loaded",
          children: loaded
        }), /* @__PURE__ */ jsx(Text, {
          size: "sm",
          p: 3,
          children: " / "
        }), /* @__PURE__ */ jsx(Text, {
          size: "sm",
          "data-test": "infinity-scroll-affix-total-count",
          p: 3,
          title: "Total",
          children: total
        })]
      })
    })
  });
}
const adminLogsCreateStyle = (theme) => ({
  rowSelected: {
    backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2) : theme.colors[theme.primaryColor][0]
  },
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`
    }
  },
  scrolled: {
    boxShadow: theme.shadows.sm
  },
  tableBody: {}
});
function UnfoldActionIcon({
  expandSelected,
  collapseSelected,
  mounted
}) {
  const theme = useMantineTheme();
  const [foldMode, toggleFoldMode] = useToggle([true, false]);
  return /* @__PURE__ */ jsx(Transition$2, {
    mounted,
    transition: "fade",
    duration: 400,
    timingFunction: "ease",
    children: (styles) => /* @__PURE__ */ jsx(ActionIcon, {
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "folding-table-items",
      variant: "subtle",
      onClick: () => {
        if (foldMode) {
          expandSelected();
        } else {
          collapseSelected();
        }
        toggleFoldMode();
      },
      style: styles,
      children: foldMode ? /* @__PURE__ */ jsx(Ti, {
        size: 24,
        stroke: 1
      }) : /* @__PURE__ */ jsx(zK, {
        size: 24
      })
    })
  });
}
const useStyles$b = createStyles(adminLogsCreateStyle);
const logLevelColorMap = {
  debug: "blue",
  info: "green",
  warn: "orange",
  error: "red"
};
const AdminLogsTableRows = ({
  data,
  selection,
  setSelection,
  visibleFields
}) => {
  const {
    classes,
    cx
  } = useStyles$b();
  const [collapse, setCollapse] = react.exports.useState([]);
  const {
    updateToolbar
  } = react.exports.useContext(AppContext);
  const toggleCollapse = (id) => {
    setCollapse((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const expand = (id) => {
    setCollapse((current) => {
      if (!current.includes(id)) {
        return [...current, id];
      }
      return current;
    });
  };
  const fold = (id) => {
    setCollapse((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      return current;
    });
  };
  const expandSelected = () => {
    selection.forEach((item) => expand(item));
  };
  const collapseSelected = () => {
    selection.forEach((item) => fold(item));
  };
  react.exports.useEffect(() => {
    updateToolbar(/* @__PURE__ */ jsx(UnfoldActionIcon, {
      mounted: selection.length > 0,
      expandSelected,
      collapseSelected
    }), 30);
  }, [selection.length]);
  const toggleRow = (id) => setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return data.pages.map((page) => page.results.map((item, index2) => {
    const selected = selection.includes(item.id);
    return /* @__PURE__ */ jsxs(React.Fragment, {
      children: [/* @__PURE__ */ jsxs("tr", {
        "data-test": `table_row_${index2}`,
        className: cx({
          [classes.rowSelected]: selected
        }),
        style: {
          cursor: "pointer"
        },
        onClick: () => toggleCollapse(item.id),
        children: [/* @__PURE__ */ jsx("td", {
          children: /* @__PURE__ */ jsx(Checkbox, {
            "test-data": "table-item-checkbox",
            checked: selected,
            onChange: (event) => {
              event.stopPropagation();
              toggleRow(item.id);
            },
            onClick: (event) => {
              event.stopPropagation();
            }
          })
        }), Object.keys(adminLogsTableColumns).map((column) => {
          if (!visibleFields.includes(column))
            return void 0;
          const itemValue = column.includes(".") ? item[column.split(".")[0]][column.split(".")[1]] : item[column];
          if (column === "level") {
            return /* @__PURE__ */ jsx("td", {
              title: item.level,
              "data-test": `table-row-${adminLogsTableColumns[column].label}`,
              style: {
                ...adminLogsTableColumns[column].cellStyle,
                paddingLeft: "2px"
              },
              children: /* @__PURE__ */ jsx(RingProgress, {
                sections: [{
                  value: 100,
                  color: logLevelColorMap[item.level]
                }],
                size: 48
              })
            }, column);
          }
          return /* @__PURE__ */ jsx("td", {
            "data-test": `table-row-${adminLogsTableColumns[column].label}`,
            style: {
              ...adminLogsTableColumns[column].cellStyle
            },
            children: /* @__PURE__ */ jsx(Tooltip, {
              label: item[column],
              multiline: true,
              children: /* @__PURE__ */ jsx(Text, {
                lineClamp: 1,
                sx: {
                  wordBreak: "break-all"
                },
                children: itemValue
              })
            })
          }, column);
        })]
      }), /* @__PURE__ */ jsx("tr", {
        children: /* @__PURE__ */ jsx("td", {
          style: {
            padding: 0,
            border: 0,
            width: "auto"
          },
          colSpan: 1e3,
          children: /* @__PURE__ */ jsx(Collapse, {
            in: collapse.includes(item.id),
            pl: 10,
            pr: 10,
            pt: 10,
            pb: 10,
            "data-test": "table-item-collapsed-row",
            children: /* @__PURE__ */ jsxs(Paper, {
              p: 20,
              children: [/* @__PURE__ */ jsxs(Text, {
                size: 16,
                color: logLevelColorMap[item.level],
                component: "span",
                children: [item.level, ": "]
              }), /* @__PURE__ */ jsx(Text, {
                size: 16,
                sx: {
                  wordBreak: "break-all"
                },
                color: logLevelColorMap[item.level],
                component: "span",
                children: /* @__PURE__ */ jsx("pre", {
                  children: item.message
                })
              })]
            })
          })
        })
      })]
    }, item.id);
  }));
};
function AdminLogsTableHeads({
  data,
  toggleAllRows,
  selection,
  visibleFields
}) {
  return /* @__PURE__ */ jsxs("tr", {
    children: [/* @__PURE__ */ jsx("th", {
      style: {
        width: "1%"
      },
      children: /* @__PURE__ */ jsx(Checkbox, {
        "data-test": "table-select-all",
        title: "Select all items",
        onChange: toggleAllRows,
        checked: selection.length === data.length,
        indeterminate: selection.length > 0 && selection.length !== data.length,
        transitionDuration: 0
      })
    }), Object.keys(adminLogsTableColumns).map((column) => {
      if (visibleFields.includes(column)) {
        return /* @__PURE__ */ jsx("th", {
          style: {
            ...adminLogsTableColumns[column].headStyle
          },
          "data-test": `table-header-${adminLogsTableColumns[column].label}`,
          children: /* @__PURE__ */ jsx(Text, {
            transform: "capitalize",
            children: adminLogsTableColumns[column].label
          })
        }, column);
      }
      return void 0;
    })]
  });
}
const useStyles$a = createStyles(adminLogsCreateStyle);
function AdminLogsTable({
  infinityQuery,
  visibleFields
}) {
  var _a, _b, _c, _d;
  const data = infinityQuery.data;
  const flatData = data.pages.flat().map((x) => x.results).flat();
  const [scrolled, setScrolled] = react.exports.useState(false);
  const {
    classes,
    cx
  } = useStyles$a();
  const [selection, setSelection] = react.exports.useState([]);
  const scrollAreaRef = react.exports.useRef(null);
  react.exports.useContext(AppContext);
  const toggleAllRows = () => setSelection((current) => current.length === flatData.length ? [] : flatData.map((item) => item.id));
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(ScrollArea.Autosize, {
      "data-test": "table-scroll-area",
      ref: scrollAreaRef,
      maxHeight: "100vh",
      sx: {
        width: "100%"
      },
      styles: {
        scrollbar: {
          marginTop: "46px"
        }
      },
      children: /* @__PURE__ */ jsxs(Table, {
        sx: {
          width: "100%"
        },
        verticalSpacing: "sm",
        highlightOnHover: true,
        children: [/* @__PURE__ */ jsx("thead", {
          style: {
            zIndex: 100
          },
          className: cx(classes.header, {
            [classes.scrolled]: scrolled
          }),
          children: /* @__PURE__ */ jsx(AdminLogsTableHeads, {
            data,
            toggleAllRows,
            selection,
            visibleFields
          })
        }), /* @__PURE__ */ jsx("tbody", {
          className: classes.tableBody,
          children: /* @__PURE__ */ jsx(AdminLogsTableRows, {
            data,
            selection,
            setSelection,
            visibleFields
          })
        }), /* @__PURE__ */ jsx(InfinityScrollSkeleton, {
          infinityQuery,
          visibleFields
        })]
      })
    }), /* @__PURE__ */ jsx(PagesCountAffix, {
      loaded: (_b = (_a = infinityQuery.data) == null ? void 0 : _a.pages) == null ? void 0 : _b.length.toString(),
      total: ((_c = infinityQuery.data) == null ? void 0 : _c.pages) && ((_d = infinityQuery.data) == null ? void 0 : _d.pages[0].totalPages),
      scrollAreaRef
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
        p: "lg",
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
            children: /* @__PURE__ */ jsx(aze, {
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
function AdminLogsTableSettings({
  open,
  setSortOpen,
  visibleFields,
  setVisibleFields,
  searchParams,
  setSearchParams
}) {
  const [sortOrder, toggleSortOrder] = useToggle(["desc", "asc"]);
  const [selectOptionsData] = react.exports.useState(() => Object.keys(adminLogsTableColumns).map((column) => ({
    value: column,
    label: adminLogsTableColumns[column].label
  })));
  const [sortItemValue, setSortItemValue] = useInputState("timestamp");
  react.exports.useEffect(() => {
    SearchParams.changeSorting(searchParams, setSearchParams, sortItemValue, sortOrder);
  }, [sortItemValue, sortOrder]);
  return /* @__PURE__ */ jsxs(RelativeDrawer, {
    open,
    setOpen: setSortOpen,
    title: "Settings",
    width: 260,
    children: [/* @__PURE__ */ jsxs(Group, {
      align: "end",
      spacing: "sm",
      noWrap: true,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "Sort by",
        "data-test": "table-sort-by-select",
        optionsData: selectOptionsData,
        required: false,
        value: sortItemValue,
        onChange: setSortItemValue
      }), /* @__PURE__ */ jsx(ActionIcon, {
        size: 36,
        "data-test": "table-sort-order",
        title: `sort order is ${sortOrder === "desc" ? "descendant" : "ascendant"}`,
        onClick: () => {
          toggleSortOrder();
        },
        children: sortOrder === "desc" ? /* @__PURE__ */ jsx(Uhe, {
          stroke: 1
        }) : /* @__PURE__ */ jsx(Ahe, {
          stroke: 1
        })
      })]
    }), /* @__PURE__ */ jsx(Text, {
      pt: "xl",
      weight: 500,
      children: "Visible fields"
    }), /* @__PURE__ */ jsx(Chip.Group, {
      align: "self-start",
      p: 8,
      value: visibleFields,
      onChange: setVisibleFields,
      multiple: true,
      children: Object.keys(adminLogsTableColumns).map((column) => /* @__PURE__ */ jsx(Chip, {
        value: column,
        "data-test": `settings-visible-columns-${adminLogsTableColumns[column].label}`,
        children: adminLogsTableColumns[column].label
      }, column))
    })]
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
  const range2 = [];
  for (let i = 0; i < 12; i += 1) {
    const rangeYear = rounded + i;
    range2.push(rangeYear);
  }
  return range2;
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
    unstyled
  } = _b, others = __objRest$f(_b, ["hasNext", "hasPrevious", "onNext", "onPrevious", "onNextLevel", "className", "label", "nextLevelDisabled", "size", "classNames", "styles", "__staticSelector", "nextLabel", "previousLabel", "preventLevelFocus", "preventFocus", "unstyled"]);
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
    yearLabelFormat = "YYYY"
  } = _b, others = __objRest$e(_b, ["className", "styles", "classNames", "value", "onChange", "size", "minYear", "maxYear", "__staticSelector", "nextDecadeLabel", "previousDecadeLabel", "preventFocus", "unstyled", "yearLabelFormat"]);
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
  const range2 = getDecadeRange(decade);
  const years = range2.map((year) => /* @__PURE__ */ jsx(UnstyledButton, {
    unstyled,
    onClick: () => onChange(year),
    disabled: year < minYear || year > maxYear,
    onMouseDown: (event) => preventFocus && event.preventDefault(),
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
      label: `${formatYear(range2[0], yearLabelFormat)} \u2013 ${formatYear(range2[range2.length - 1], yearLabelFormat)}`,
      hasPrevious: typeof minYear === "number" ? minYear < range2[0] : true,
      hasNext: typeof maxYear === "number" ? maxYear > range2[range2.length - 1] : true,
      onNext: () => setDecade((current) => current + 10),
      onPrevious: () => setDecade((current) => current - 10),
      nextLevelDisabled: true,
      size: size2,
      nextLabel: nextDecadeLabel,
      previousLabel: previousDecadeLabel,
      styles,
      classNames,
      __staticSelector,
      preventFocus
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
    yearLabelFormat = "YYYY"
  } = _b, others = __objRest$d(_b, ["className", "styles", "classNames", "value", "onChange", "locale", "year", "onYearChange", "onNextLevel", "size", "minDate", "maxDate", "__staticSelector", "nextYearLabel", "previousYearLabel", "preventFocus", "unstyled", "yearLabelFormat"]);
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
  const range2 = getMonthsNames(locale);
  const minYear = minDate instanceof Date ? minDate.getFullYear() : void 0;
  const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : void 0;
  const months = range2.map((month, index2) => /* @__PURE__ */ jsx(UnstyledButton, {
    unstyled,
    onClick: () => onChange(index2),
    className: cx(classes.monthPickerControl, {
      [classes.monthPickerControlActive]: index2 === value.month && year === value.year
    }),
    disabled: !isMonthInRange({
      date: new Date(year, index2),
      minDate,
      maxDate
    }),
    onMouseDown: (event) => preventFocus && event.preventDefault(),
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
      unstyled
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
function getRangeProps(date, range2) {
  const hasRange = Array.isArray(range2) && range2.every((val) => val instanceof Date);
  const inclusiveRange = hasRange && [
    dayjs(range2[0]).subtract(1, "day"),
    dayjs(range2[1]).add(1, "day")
  ];
  const firstInRange = hasRange && isSameDate(date, range2[0]);
  const lastInRange = hasRange && isSameDate(date, range2[1]);
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
  range: range2,
  weekendDays
}) {
  const outside = isOutside(date, month);
  const selected = hasValue && (Array.isArray(value) ? value.some((val) => isSameDate(val, date)) : isSameDate(date, value));
  const { inRange, lastInRange, firstInRange, selectedInRange } = getRangeProps(date, range2);
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
const noop2 = () => false;
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
    range: range2,
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
    isDateInRange = noop2,
    isDateFirstInRange = noop2,
    isDateLastInRange = noop2,
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
      range: range2,
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
        range: range2,
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
          onMouseEnter: typeof onDayMouseEnter === "function" ? onDayMouseEnter : noop2,
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
    unstyled
  } = _b, others = __objRest$a(_b, ["amountOfMonths", "paginateBy", "month", "locale", "minDate", "maxDate", "allowLevelChange", "size", "daysRefs", "onMonthChange", "onNextLevel", "onDayKeyDown", "classNames", "styles", "__staticSelector", "nextMonthLabel", "previousMonthLabel", "labelFormat", "weekdayLabelFormat", "preventFocus", "renderDay", "unstyled"]);
  const nextMonth = dayjs(month).add(amountOfMonths, "months").toDate();
  const previousMonth = dayjs(month).subtract(1, "months").toDate();
  const months = Array(amountOfMonths).fill(0).map((_, index2) => {
    const monthDate = dayjs(month).add(index2, "months").toDate();
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx(CalendarHeader, {
        hasNext: index2 + 1 === amountOfMonths && isMonthInRange({
          date: nextMonth,
          minDate,
          maxDate
        }),
        hasPrevious: index2 === 0 && isMonthInRange({
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
        preventLevelFocus: index2 > 0,
        preventFocus,
        unstyled
      }), /* @__PURE__ */ jsx(Month, {
        ...__spreadValues$c({
          month: monthDate,
          daysRefs: daysRefs.current[index2],
          onDayKeyDown: (...args) => onDayKeyDown(index2, ...args),
          size: size2,
          minDate,
          maxDate,
          classNames,
          styles,
          __staticSelector,
          locale,
          focusable: index2 === 0,
          preventFocus,
          renderDay,
          weekdayLabelFormat,
          unstyled
        }, others)
      })]
    }, index2);
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
    range: range2,
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
    const changeRow = ["down", "up"].includes(direction);
    const rowIndex = changeRow ? payload.rowIndex + (direction === "down" ? n : -n) : payload.rowIndex;
    const cellIndex = changeRow ? payload.cellIndex : payload.cellIndex + (direction === "right" ? n : -n);
    const dayToFocus = daysRefs.current[monthIndex][rowIndex][cellIndex];
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
      range: range2,
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
  const handleValueChange = (range2) => {
    setValue(range2);
    if (closeCalendarOnChange && validationRule(range2)) {
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
    width: "auto",
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
    height: theme.fn.size({ size: size2, sizes: sizes$j }) - 2
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
    height: theme.fn.size({ size: size2, sizes: sizes$j }) - 2
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
function LogLevelFilter({
  label,
  groupRules,
  updateGroupRules,
  id
}) {
  const distinctQuery = useQuery(["logs_level_distinct", id], () => LogsService.distinct("level"), {
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data) => {
      form.values.value = data[0];
    },
    onError: (e) => {
      errorMsg({
        error: e
      });
    }
  });
  let levels = [];
  if (distinctQuery.isSuccess && distinctQuery.data) {
    levels = distinctQuery.data.map((item) => ({
      value: item,
      label: item
    }));
  }
  distinctQuery.isLoading ? ["loading"] : distinctQuery.data;
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
      label: "",
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
      children: /* @__PURE__ */ jsx(D3, {
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
  const rules = Object.keys(groupsData[id]["rules"]).map((key, index2) => /* @__PURE__ */ jsx(FilterWrapper, {
    testAttr: `filter-rule-${index2}`,
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
        children: /* @__PURE__ */ jsx(aze, {
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
        leftIcon: /* @__PURE__ */ jsx(Boe, {
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
        leftIcon: /* @__PURE__ */ jsx(Boe, {
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
const mainGroupInit = {
  mainGroup: {
    operator: "$and",
    rules: {
      initialFilterKey1: {},
      initialFilterKey2: {}
    }
  }
};
function AdminLogsTableFilter({
  open,
  setOpen,
  searchParams,
  setSearchParams
}) {
  const [groupsData, setGroupsData] = react.exports.useState(mainGroupInit);
  const removeGroupsData = (key) => {
    setGroupsData((prev) => {
      const {
        [key]: removed,
        ...rest
      } = prev;
      return rest;
    });
  };
  const resetAll = () => {
    setGroupsData(() => ({
      mainGroup: {
        operator: "$and",
        rules: {
          [uuid()]: {}
        }
      }
    }));
  };
  const createFilterObject = () => {
    const filterValue2 = (x) => Object.values(Object.values(x)[0])[0];
    const mainGroupRootRules = Object.values(groupsData["mainGroup"].rules).filter((x) => filterValue2(x));
    const mainGroupRules = [...mainGroupRootRules, ...Object.keys(groupsData).filter((x) => x !== "mainGroup").map((groupKey) => {
      const groupRules = Object.values(groupsData[groupKey]["rules"]).filter((x) => filterValue2(x));
      if (groupRules.length < 1)
        return {};
      return {
        [groupsData[groupKey]["operator"]]: groupRules
      };
    })];
    if (mainGroupRules.length < 1)
      return {};
    return {
      [groupsData["mainGroup"].operator]: mainGroupRules
    };
  };
  const applyFilter = () => {
    SearchParams.changeFiltering(searchParams, setSearchParams, JSON.stringify(createFilterObject()));
  };
  const groups = Object.keys(groupsData).filter((x) => x !== "mainGroup").map((key, index2) => /* @__PURE__ */ jsx(LogicalGroup, {
    testAttr: `filter-group-${index2}`,
    fields: adminLogsTableColumns,
    setGroupsData,
    groupsData,
    removeGroupsData,
    id: key
  }, key));
  react.exports.useEffect(function groupsDataChange() {
  }, [JSON.stringify(groupsData)]);
  return /* @__PURE__ */ jsx(RelativeDrawer, {
    open,
    setOpen,
    title: "Filter",
    width: 560,
    children: /* @__PURE__ */ jsx(ScrollArea.Autosize, {
      maxHeight: "80vh",
      mr: -12,
      sx: {
        height: "80vh"
      },
      children: /* @__PURE__ */ jsxs(Box, {
        sx: {
          paddingRight: 16,
          marginBottom: 100
        },
        children: [/* @__PURE__ */ jsx(Stack, {
          children: /* @__PURE__ */ jsx(LogicalGroup, {
            id: "mainGroup",
            testAttr: "filter-main-group",
            fields: adminLogsTableColumns,
            groupsData,
            setGroupsData,
            removeGroupsData,
            children: groups
          })
        }), /* @__PURE__ */ jsxs(Group, {
          mt: 24,
          position: "right",
          children: [/* @__PURE__ */ jsx(Button, {
            onClick: () => resetAll(),
            "data-test": "table-filter-reset",
            variant: "light",
            color: "red",
            children: "Reset"
          }), /* @__PURE__ */ jsx(Button, {
            "data-test": "table-filter-cancel",
            variant: "light",
            color: "gray",
            onClick: () => setOpen(false),
            children: "Cancel"
          }), /* @__PURE__ */ jsx(Button, {
            "data-test": "table-filter-apply",
            onClick: () => {
              applyFilter();
            },
            children: "Apply"
          })]
        })]
      })
    })
  });
}
function AdminLogs() {
  var _a;
  const theme = useMantineTheme();
  useSubpageEffect("Logs");
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOpen, setSortOpen] = react.exports.useState(false);
  const [filterOpen, setFilterOpen] = react.exports.useState(false);
  const {
    toolbar,
    setToolbar,
    updateToolbar
  } = react.exports.useContext(AppContext);
  const {
    firstPageQuery,
    infinityQuery,
    newestItemsQuery
  } = useInfinityScroll(searchParams);
  useNavProgressFetchEffect(infinityQuery.isFetching);
  const [visibleFields, setVisibleFields] = useLocalStorage({
    key: "visibleFields",
    defaultValue: ["_id", "level", "message", "timestamp", "meta.user"]
  });
  react.exports.useEffect(function oneTime() {
    firstPageQuery.refetch();
    updateToolbar(/* @__PURE__ */ jsx(ActionIcon, {
      title: "Table settings, sorting, and columns visibility",
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "table-sorting",
      variant: "subtle",
      onClick: () => {
        setSortOpen((prev) => !prev);
      },
      children: /* @__PURE__ */ jsx(J, {
        stroke: 1,
        size: 24
      })
    }), 48);
    updateToolbar(/* @__PURE__ */ jsx(ActionIcon, {
      title: "Filter the Table Data",
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "table-filtering",
      variant: "subtle",
      onClick: () => {
        setFilterOpen((prev) => !prev);
      },
      children: /* @__PURE__ */ jsx(sJ, {
        size: 24,
        stroke: 1
      })
    }), 47);
  }, []);
  react.exports.useEffect(function addReloadIcon() {
    updateToolbar(/* @__PURE__ */ jsx(RefreshActionIcon, {
      newestItemsQuery,
      firstPageQuery,
      infinityQuery
    }, "reload"), 50);
  }, [(_a = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _a.results.length, newestItemsQuery.status, theme.colorScheme]);
  react.exports.useEffect(() => {
    firstPageQuery.refetch();
  }, [searchParams]);
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(Group, {
      position: "apart",
      align: "start",
      noWrap: true,
      children: [infinityQuery.status === "loading" ? /* @__PURE__ */ jsx(LoadingOverlay, {
        visible: true
      }) : infinityQuery.status === "error" ? /* @__PURE__ */ jsxs(Text, {
        color: "red",
        children: ["Error: ", infinityQuery.error.message]
      }) : /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsx(AdminLogsTable, {
          infinityQuery,
          visibleFields
        })
      }), /* @__PURE__ */ jsx(AdminLogsTableSettings, {
        open: sortOpen,
        setSortOpen,
        visibleFields,
        setVisibleFields,
        searchParams,
        setSearchParams
      }), /* @__PURE__ */ jsx(AdminLogsTableFilter, {
        open: filterOpen,
        setOpen: setFilterOpen,
        searchParams,
        setSearchParams
      })]
    })
  });
}
function AdminLayout() {
  return /* @__PURE__ */ jsxs(AppShell, {
    padding: 8,
    navbar: /* @__PURE__ */ jsx(AdminNavbar, {}),
    header: /* @__PURE__ */ jsx(AdminHeader, {}),
    styles: (theme) => ({
      main: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
      }
    }),
    children: [/* @__PURE__ */ jsx(ReactQueryDevtools, {
      initialIsOpen: false
    }), /* @__PURE__ */ jsxs(Paper, {
      children: [/* @__PURE__ */ jsxs(Routes, {
        children: [/* @__PURE__ */ jsx(Route, {
          path: "",
          element: /* @__PURE__ */ jsx(AdminUsers, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "users",
          element: /* @__PURE__ */ jsx(AdminUsers, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "settings",
          element: /* @__PURE__ */ jsx(AdminSettings, {})
        }), /* @__PURE__ */ jsx(Route, {
          path: "logs",
          element: /* @__PURE__ */ jsx(AdminLogs, {})
        })]
      }), /* @__PURE__ */ jsx(Routes, {
        children: /* @__PURE__ */ jsx(Route, {
          path: "/tasks/",
          children: /* @__PURE__ */ jsx(Route, {
            path: ":task",
            element: /* @__PURE__ */ jsx(TaskWrapper, {})
          })
        })
      })]
    })]
  });
}
const queryClient = new QueryClient();
function App() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [appTitle, setAppTitle] = react.exports.useState("Syngrisi");
  const [breadCrumbs, setBreadCrumbs] = react.exports.useState([]);
  const [toolbar, setToolbar] = react.exports.useState([]);
  const updateToolbar = (newItem, index2 = 0) => {
    setToolbar((prevArr) => {
      const newArray = [...prevArr];
      newArray[index2] = /* @__PURE__ */ jsx(react.exports.Fragment, {
        children: newItem
      }, index2);
      return newArray;
    });
  };
  const clearToolbar = () => {
    setToolbar(() => []);
  };
  const appProviderValue = react.exports.useMemo(() => ({
    appTitle,
    setAppTitle,
    toolbar,
    setToolbar,
    updateToolbar,
    clearToolbar,
    breadCrumbs,
    setBreadCrumbs
  }), [appTitle, toolbar, JSON.stringify(breadCrumbs)]);
  useDocumentTitle(appTitle);
  const navigate = useNavigate();
  const spotlightActions = navigationData().map((item) => ({
    ...item,
    onTrigger: () => navigate(item.crumbs.slice(-1)[0].href)
  }));
  return /* @__PURE__ */ jsx(AppContext.Provider, {
    value: appProviderValue,
    children: /* @__PURE__ */ jsx(QueryClientProvider, {
      client: queryClient,
      children: /* @__PURE__ */ jsx(ColorSchemeProvider, {
        colorScheme,
        toggleColorScheme,
        children: /* @__PURE__ */ jsx(MantineProvider, {
          withGlobalStyles: true,
          withNormalizeCSS: true,
          theme: {
            fontSizes: {
              md: 24
            },
            colorScheme,
            primaryColor: "green"
          },
          children: /* @__PURE__ */ jsx(SpotlightProvider, {
            actions: spotlightActions,
            highlightQuery: true,
            searchIcon: /* @__PURE__ */ jsx(Aae, {
              size: 18
            }),
            limit: 7,
            searchPlaceholder: "Search...",
            shortcut: ["mod + k", "mod + K"],
            nothingFoundMessage: "Nothing found...",
            children: /* @__PURE__ */ jsxs(NotificationsProvider, {
              autoClose: 5e3,
              limit: 5,
              children: [/* @__PURE__ */ jsx(NavigationProgress, {}), /* @__PURE__ */ jsx(ModalsProvider, {
                children: /* @__PURE__ */ jsx(Routes, {
                  children: /* @__PURE__ */ jsx(Route, {
                    path: "/admin/*",
                    element: /* @__PURE__ */ jsx(AdminLayout, {})
                  })
                })
              })]
            })
          })
        })
      })
    })
  });
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(react.exports.StrictMode, {
  children: /* @__PURE__ */ jsx(BrowserRouter, {
    children: /* @__PURE__ */ jsx(App, {})
  })
}));
