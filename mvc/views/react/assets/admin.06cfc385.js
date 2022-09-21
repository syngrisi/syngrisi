import { aH as transitions$1, r as react, H as useUncontrolled, a9 as useReducedMotion, aI as useWindowEvent, J as useId, b as jsx, c as createStyles, B as Box, j as jsxs, ap as UnstyledButton, E as useComponentDefaultProps, L as getDefaultZIndex, am as OptionalPortal, aa as packSx, T as Text, ar as Fragment, aJ as useInputProps, a6 as useDidUpdate, I as Input, ak as useMergedRef, F as createPolymorphicComponent, P as Paper, G as Group, K as extractSystemStyles, d as useMantineTheme, O as Transition, S as Overlay, aK as assignRef, aL as MANTINE_SIZES, aj as isElement, V as useDisclosure, ab as _extends, ac as React, U as sizes$f, o as TextInput, aM as Tooltip, aN as useIsomorphicEffect, aO as keyframes, R as Loader, aP as GROUP_POSITIONS, A as ActionIcon, h as Button, C as Center, e as Container, au as Portal, i as Progress, al as clsx, aQ as DEFAULT_THEME, aR as MANTINE_COLORS, M as MantineProvider, w as ColorSchemeProvider, aS as useMantineColorScheme, aT as GlobalStyles, aU as NormalizeCSS, aV as useCss, aW as useEmotionCache, aX as defaultMantineEmotionCache, aY as createCache, av as queryString, W as Aae, Y as useLocation, Z as Link, _ as sge, $ as $i, aA as q0, a0 as Lce, l as log, aZ as useParams, N as Nb, m as aze, a_ as useMutation, a$ as _ae, b0 as gI, aD as ka, u as useQuery, ay as age, b1 as Xne, k as ky, a as config, b2 as useInfiniteQuery, b3 as hl, b4 as Ti, b5 as zK, b6 as Uhe, b7 as Ahe, b8 as commonjsGlobal, b9 as D3, ba as Boe, n as useSearchParams, s as useLocalStorage, bb as J, bc as sJ, a2 as Routes, a3 as Route, Q as QueryClient, f as useDocumentTitle, a1 as useNavigate, v as QueryClientProvider, x as createRoot, y as BrowserRouter } from "./Logger.dbf872b1.js";
import { h as createSafeContext, j as useContextStylesApi, k as createScopedKeydownHandler, C as Collapse, m as StylesApiProvider, p as ChevronIcon$1, q as CloseButton, r as HorizontalSection, s as Section, V as VerticalSection, t as randomId, S as ScrollArea, P as Popover, v as useFocusTrap, w as useScrollLock, x as useFocusReturn, G as GroupedTransition, y as createEventHandler, z as useDelayedHover, _ as _objectWithoutPropertiesLoose, d as Navbar, H as Header, A as AppShell, D as Avatar, b as Breadcrumbs, B as Burger, F as FocusTrap, E as Highlight, K as Kbd, I as Mark, J as Menu, L as Modal, N as NavLink, O as Notification, c as ThemeIcon, Q as Global, W as AppContext, X as getNavigationItem, Y as stopNavigationProgress, Z as resetNavigationProgress, $ as startNavigationProgress, a0 as setNavigationProgress, u as useColorScheme, l as links, a as HeaderLogo, o as openSpotlight, U as UserMenu, T as ToggleThemeButton, i as isDark, a1 as successMsg, a2 as errorMsg, a3 as UsersService, a4 as UserHooks, a5 as uuid, R as ReactQueryDevtools, n as navigationData, e as SpotlightProvider, f as NotificationsProvider, g as NavigationProgress, M as ModalsProvider } from "./heaserLinks.8be6b0a1.js";
import { a as CheckIcon, I as InputsGroup, A as Anchor, b as CheckboxIcon, C as Checkbox, L as LoadingOverlay, P as PasswordInput, S as Stack, T as Title, u as useForm } from "./use-form.1b59a589.js";
function getSafeId(uid, errorMessage) {
  return (value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(errorMessage);
    }
    return `${uid}-${value}`;
  };
}
function keys(object) {
  return Object.keys(object);
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
const AVAILABLE_TRANSITIONS = Object.keys(transitions$1);
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
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const getRelativePosition = ({
  axis,
  target,
  parent,
  alignment,
  offset,
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
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList;
      return shouldScroll ? distance : 0;
    }
    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;
    if (alignment === "end") {
      const distance = diff + offset - parentHeight + targetPosition.height;
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
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.width || !isList;
      return shouldScroll ? distance : 0;
    }
    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;
    if (alignment === "end") {
      const distance = diff + offset - parentWidth + targetPosition.width;
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
  offset = 0,
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
      offset,
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
var useStyles$22 = createStyles((theme, params) => ({
  item: getVariantStyles$5(theme, params)
}));
const useStyles$23 = useStyles$22;
var __defProp$2g = Object.defineProperty;
var __getOwnPropSymbols$2g = Object.getOwnPropertySymbols;
var __hasOwnProp$2g = Object.prototype.hasOwnProperty;
var __propIsEnum$2g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2g = (obj, key, value) => key in obj ? __defProp$2g(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$1u = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2g.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2g)
    for (var prop of __getOwnPropSymbols$2g(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2g.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const AccordionItem = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    value
  } = _b, others = __objRest$1u(_b, ["children", "className", "value"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const ctx = useAccordionContext();
  const {
    classes,
    cx
  } = useStyles$23({
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
      ...__spreadValues$2g({
        ref,
        className: cx(classes.item, className),
        "data-active": ctx.isItemActive(value) || void 0
      }, others),
      children
    })
  });
});
AccordionItem.displayName = "@mantine/core/AccordionItem";
var __defProp$2f = Object.defineProperty;
var __defProps$14 = Object.defineProperties;
var __getOwnPropDescs$14 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2f = Object.getOwnPropertySymbols;
var __hasOwnProp$2f = Object.prototype.hasOwnProperty;
var __propIsEnum$2f = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2f = (obj, key, value) => key in obj ? __defProp$2f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$14 = (a, b) => __defProps$14(a, __getOwnPropDescs$14(b));
var __objRest$1t = (source, exclude) => {
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
function getVariantStyles$4(theme, { variant }) {
  if (variant === "default" || variant === "contained") {
    return theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    });
  }
  return {};
}
var useStyles$20 = createStyles((theme, _a) => {
  var _b = _a, { transitionDuration, chevronPosition, chevronSize } = _b, params = __objRest$1t(_b, ["transitionDuration", "chevronPosition", "chevronSize"]);
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
    control: __spreadProps$14(__spreadValues$2f(__spreadValues$2f(__spreadValues$2f({}, theme.fn.focusStyles()), theme.fn.fontStyles()), getVariantStyles$4(theme, params)), {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: chevronPosition === "right" ? "row-reverse" : "row",
      padding: `${theme.spacing.md}px ${theme.spacing.md / 2}px`,
      paddingLeft: chevronPosition === "right" ? theme.spacing.sm + 4 : null,
      textAlign: "left",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      "&:disabled": __spreadValues$2f({
        opacity: 0.4,
        cursor: "not-allowed"
      }, theme.fn.hover({ backgroundColor: "transparent" }))
    })
  };
});
const useStyles$21 = useStyles$20;
var __defProp$2e = Object.defineProperty;
var __defProps$13 = Object.defineProperties;
var __getOwnPropDescs$13 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2e = Object.getOwnPropertySymbols;
var __hasOwnProp$2e = Object.prototype.hasOwnProperty;
var __propIsEnum$2e = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2e = (obj, key, value) => key in obj ? __defProp$2e(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$1s = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2e.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2e)
    for (var prop of __getOwnPropSymbols$2e(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2e.call(source, prop))
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
  } = _b, others = __objRest$1s(_b, ["disabled", "onKeyDown", "onClick", "chevron", "children", "className", "icon"]);
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
  } = useStyles$21({
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
    ...__spreadProps$13(__spreadValues$2e({}, others), {
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
var __defProp$2d = Object.defineProperty;
var __defProps$12 = Object.defineProperties;
var __getOwnPropDescs$12 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2d = Object.getOwnPropertySymbols;
var __hasOwnProp$2d = Object.prototype.hasOwnProperty;
var __propIsEnum$2d = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2d = (obj, key, value) => key in obj ? __defProp$2d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$12 = (a, b) => __defProps$12(a, __getOwnPropDescs$12(b));
var useStyles$1_ = createStyles((theme, _params) => ({
  panel: __spreadProps$12(__spreadValues$2d({}, theme.fn.fontStyles()), {
    wordBreak: "break-word",
    lineHeight: theme.lineHeight
  }),
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs / 2
  }
}));
const useStyles$1$ = useStyles$1_;
var __defProp$2c = Object.defineProperty;
var __defProps$11 = Object.defineProperties;
var __getOwnPropDescs$11 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2c = Object.getOwnPropertySymbols;
var __hasOwnProp$2c = Object.prototype.hasOwnProperty;
var __propIsEnum$2c = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2c = (obj, key, value) => key in obj ? __defProp$2c(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$11 = (a, b) => __defProps$11(a, __getOwnPropDescs$11(b));
var __objRest$1r = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2c.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2c)
    for (var prop of __getOwnPropSymbols$2c(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2c.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function AccordionPanel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$1r(_b, ["children", "className"]);
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
  } = useStyles$1$({
    variant: ctx.variant,
    radius: ctx.radius
  }, {
    name: "Accordion",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Collapse, {
    ...__spreadProps$11(__spreadValues$2c({}, others), {
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
var __defProp$2b = Object.defineProperty;
var __defProps$10 = Object.defineProperties;
var __getOwnPropDescs$10 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$10 = (a, b) => __defProps$10(a, __getOwnPropDescs$10(b));
var __objRest$1q = (source, exclude) => {
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
const defaultProps$V = {
  multiple: false,
  disableChevronRotation: false,
  transitionDuration: 200,
  chevronPosition: "right",
  variant: "default",
  chevronSize: 24,
  chevron: /* @__PURE__ */ jsx(ChevronIcon$1, {})
};
function Accordion(props) {
  const _a = useComponentDefaultProps("Accordion", defaultProps$V, props), {
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
  } = _a, others = __objRest$1q(_a, ["id", "loop", "children", "multiple", "value", "defaultValue", "onChange", "transitionDuration", "disableChevronRotation", "chevronPosition", "chevronSize", "order", "chevron", "classNames", "styles", "unstyled", "variant", "radius"]);
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
        ...__spreadProps$10(__spreadValues$2b({}, others), {
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
var __objRest$1p = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2a.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2a)
    for (var prop of __getOwnPropSymbols$2a(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2a.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$U = {
  position: {
    bottom: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("modal"),
  withinPortal: true
};
const Affix = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Affix", defaultProps$U, props), {
    target,
    position,
    zIndex,
    sx,
    withinPortal
  } = _a, others = __objRest$1p(_a, ["target", "position", "zIndex", "sx", "withinPortal"]);
  return /* @__PURE__ */ jsx(OptionalPortal, {
    withinPortal,
    target,
    children: /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$2a({
        sx: [__spreadValues$2a({
          position: "fixed",
          zIndex
        }, position), ...packSx(sx)],
        ref
      }, others)
    })
  });
});
Affix.displayName = "@mantine/core/Affix";
var __defProp$29 = Object.defineProperty;
var __defProps$$ = Object.defineProperties;
var __getOwnPropDescs$$ = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$29 = Object.getOwnPropertySymbols;
var __hasOwnProp$29 = Object.prototype.hasOwnProperty;
var __propIsEnum$29 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$29 = (obj, key, value) => key in obj ? __defProp$29(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$$ = (a, b) => __defProps$$(a, __getOwnPropDescs$$(b));
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
var useStyles$1Y = createStyles((theme, { color, radius, variant }) => ({
  root: __spreadValues$29(__spreadProps$$(__spreadValues$29({}, theme.fn.fontStyles()), {
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
  message: __spreadProps$$(__spreadValues$29({}, theme.fn.fontStyles()), {
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
const useStyles$1Z = useStyles$1Y;
var __defProp$28 = Object.defineProperty;
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
var __objRest$1o = (source, exclude) => {
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
const defaultProps$T = {
  variant: "light"
};
const Alert = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Alert", defaultProps$T, props), {
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
  } = _a, others = __objRest$1o(_a, ["id", "className", "title", "variant", "children", "color", "classNames", "icon", "styles", "onClose", "radius", "withCloseButton", "closeButtonLabel", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1Z({
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
    ...__spreadValues$28({
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
var __defProp$27 = Object.defineProperty;
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
const defaultProps$S = {
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
  const _props = useComponentDefaultProps("Aside", defaultProps$S, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$27({
      section: "aside",
      __staticSelector: "Aside",
      ref
    }, _props)
  });
});
Aside.Section = Section;
Aside.displayName = "@mantine/core/Aside";
var __defProp$26 = Object.defineProperty;
var __defProps$_ = Object.defineProperties;
var __getOwnPropDescs$_ = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$26 = Object.getOwnPropertySymbols;
var __hasOwnProp$26 = Object.prototype.hasOwnProperty;
var __propIsEnum$26 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$26 = (obj, key, value) => key in obj ? __defProp$26(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$_ = (a, b) => __defProps$_(a, __getOwnPropDescs$_(b));
const defaultProps$R = {
  fixed: false,
  position: {
    bottom: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Footer = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Footer", defaultProps$R, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$_(__spreadValues$26({
      section: "footer",
      __staticSelector: "Footer"
    }, _props), {
      ref
    })
  });
});
Footer.displayName = "@mantine/core/Footer";
var useStyles$1W = createStyles((theme, { ratio }) => ({
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
const useStyles$1X = useStyles$1W;
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
var __objRest$1n = (source, exclude) => {
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
const AspectRatio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AspectRatio", {}, props), {
    className,
    ratio,
    children,
    unstyled
  } = _a, others = __objRest$1n(_a, ["className", "ratio", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1X({
    ratio
  }, {
    name: "AspectRatio",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$25({
      ref,
      className: cx(classes.root, className)
    }, others),
    children
  });
});
AspectRatio.displayName = "@mantine/core/AspectRatio";
const sizes$e = {
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
var useStyles$1U = createStyles((theme, { size, variant, color }) => ({
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
      borderTop: `${theme.fn.size({ size, sizes: sizes$e })}px ${variant} ${getColor(theme, color)}`,
      marginRight: theme.spacing.xs
    },
    "&::after": {
      content: '""',
      flex: 1,
      borderTop: `${theme.fn.size({ size, sizes: sizes$e })}px ${variant} ${getColor(theme, color)}`,
      marginLeft: theme.spacing.xs
    }
  },
  labelDefaultStyles: {
    color: color === "dark" ? theme.colors.dark[1] : theme.fn.themeColor(color, theme.colorScheme === "dark" ? 5 : theme.fn.primaryShade(), false)
  },
  horizontal: {
    border: 0,
    borderTopWidth: theme.fn.size({ size, sizes: sizes$e }),
    borderTopColor: getColor(theme, color),
    borderTopStyle: variant,
    margin: 0
  },
  vertical: {
    border: 0,
    alignSelf: "stretch",
    height: "auto",
    borderLeftWidth: theme.fn.size({ size, sizes: sizes$e }),
    borderLeftColor: getColor(theme, color),
    borderLeftStyle: variant
  }
}));
const useStyles$1V = useStyles$1U;
var __defProp$24 = Object.defineProperty;
var __defProps$Z = Object.defineProperties;
var __getOwnPropDescs$Z = Object.getOwnPropertyDescriptors;
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
var __spreadProps$Z = (a, b) => __defProps$Z(a, __getOwnPropDescs$Z(b));
var __objRest$1m = (source, exclude) => {
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
const defaultProps$Q = {
  orientation: "horizontal",
  size: "xs",
  labelPosition: "left",
  variant: "solid"
};
const Divider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Divider", defaultProps$Q, props), {
    className,
    color,
    orientation,
    size,
    label,
    labelPosition,
    labelProps,
    variant,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$1m(_a, ["className", "color", "orientation", "size", "label", "labelPosition", "labelProps", "variant", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1V({
    color,
    size,
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
    ...__spreadValues$24({
      ref,
      className: cx(classes.root, {
        [classes.vertical]: vertical,
        [classes.horizontal]: horizontal,
        [classes.withLabel]: withLabel
      }, className),
      role: "separator"
    }, others),
    children: withLabel && /* @__PURE__ */ jsx(Text, {
      ...__spreadProps$Z(__spreadValues$24({}, labelProps), {
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
var __defProp$23 = Object.defineProperty;
var __getOwnPropSymbols$23 = Object.getOwnPropertySymbols;
var __hasOwnProp$23 = Object.prototype.hasOwnProperty;
var __propIsEnum$23 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$23 = (obj, key, value) => key in obj ? __defProp$23(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var useStyles$1S = createStyles((theme, { size }) => ({
  item: {
    boxSizing: "border-box",
    textAlign: "left",
    width: "100%",
    padding: `${theme.fn.size({ size, sizes: theme.spacing }) / 1.5}px ${theme.fn.size({
      size,
      sizes: theme.spacing
    })}px`,
    cursor: "pointer",
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.sm,
    "&[data-hovered]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    },
    "&[data-selected]": __spreadValues$23({
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
    paddingTop: theme.fn.size({ size, sizes: theme.spacing }) / 2,
    paddingBottom: theme.fn.size({ size, sizes: theme.spacing }) / 2,
    textAlign: "center"
  },
  separator: {
    boxSizing: "border-box",
    textAlign: "left",
    width: "100%",
    padding: `${theme.fn.size({ size, sizes: theme.spacing }) / 1.5}px ${theme.fn.size({
      size,
      sizes: theme.spacing
    })}px`
  },
  separatorLabel: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  }
}));
const useStyles$1T = useStyles$1S;
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
  size,
  nothingFound,
  creatable,
  createLabel,
  unstyled
}) {
  const {
    classes
  } = useStyles$1T({
    size
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
      ...__spreadValues$22({
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
    size,
    unstyled,
    className: classes.nothingFound,
    children: nothingFound
  });
}
SelectItems.displayName = "@mantine/core/SelectItems";
var __defProp$21 = Object.defineProperty;
var __getOwnPropSymbols$21 = Object.getOwnPropertySymbols;
var __hasOwnProp$21 = Object.prototype.hasOwnProperty;
var __propIsEnum$21 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$21 = (obj, key, value) => key in obj ? __defProp$21(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$1l = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$21.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$21)
    for (var prop of __getOwnPropSymbols$21(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$21.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const DefaultItem$2 = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    label,
    value
  } = _b, others = __objRest$1l(_b, ["label", "value"]);
  return /* @__PURE__ */ jsx("div", {
    ...__spreadValues$21({
      ref
    }, others),
    children: label || value
  });
});
DefaultItem$2.displayName = "@mantine/core/DefaultItem";
var __defProp$20 = Object.defineProperty;
var __defProps$Y = Object.defineProperties;
var __getOwnPropDescs$Y = Object.getOwnPropertyDescriptors;
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
var __spreadProps$Y = (a, b) => __defProps$Y(a, __getOwnPropDescs$Y(b));
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
const SelectScrollArea = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    style
  } = _b, others = __objRest$1k(_b, ["style"]);
  return /* @__PURE__ */ jsx(ScrollArea, {
    ...__spreadProps$Y(__spreadValues$20({}, others), {
      style: __spreadValues$20({
        width: "100%"
      }, style),
      viewportRef: ref
    }),
    children: others.children
  });
});
SelectScrollArea.displayName = "@mantine/core/SelectScrollArea";
var useStyles$1Q = createStyles(() => ({
  dropdown: {},
  itemsWrapper: {
    padding: 4,
    display: "flex",
    width: "100%"
  }
}));
const useStyles$1R = useStyles$1Q;
var __defProp$1$ = Object.defineProperty;
var __getOwnPropSymbols$1$ = Object.getOwnPropertySymbols;
var __hasOwnProp$1$ = Object.prototype.hasOwnProperty;
var __propIsEnum$1$ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1$ = (obj, key, value) => key in obj ? __defProp$1$(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$1j = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1$.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1$)
    for (var prop of __getOwnPropSymbols$1$(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1$.call(source, prop))
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
  } = _b, others = __objRest$1j(_b, ["children", "component", "maxHeight", "direction", "id", "innerRef", "__staticSelector", "styles", "classNames", "unstyled"]);
  const {
    classes
  } = useStyles$1R(null, {
    name: __staticSelector,
    styles,
    classNames,
    unstyled
  });
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$1$({
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
var useStyles$1O = createStyles((theme, { size }) => {
  const spacing = theme.fn.size({ size, sizes: theme.spacing });
  return {
    wrapper: {
      position: "relative"
    },
    item: {
      textAlign: "left",
      width: "100%",
      padding: `${spacing / 1.5}px ${spacing}`,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
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
const useStyles$1P = useStyles$1O;
var __defProp$1_ = Object.defineProperty;
var __defProps$X = Object.defineProperties;
var __getOwnPropDescs$X = Object.getOwnPropertyDescriptors;
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
var __spreadProps$X = (a, b) => __defProps$X(a, __getOwnPropDescs$X(b));
var __objRest$1i = (source, exclude) => {
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
function defaultFilter$3(value, item) {
  return item.value.toLowerCase().trim().includes(value.toLowerCase().trim());
}
const defaultProps$P = {
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
  const _a = useInputProps("Autocomplete", defaultProps$P, props), {
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
  } = _a, others = __objRest$1i(_a, ["inputProps", "wrapperProps", "shadow", "data", "limit", "value", "defaultValue", "onChange", "unstyled", "itemComponent", "onItemSubmit", "onKeyDown", "onFocus", "onBlur", "onClick", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "classNames", "styles", "filter", "nothingFound", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "dropdownPosition", "maxDropdownHeight", "dropdownComponent", "positionDependencies"]);
  const {
    classes
  } = useStyles$1P({
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
    ...__spreadProps$X(__spreadValues$1_({}, wrapperProps), {
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
            ...__spreadProps$X(__spreadValues$1_(__spreadValues$1_({
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
var __defProp$1Z = Object.defineProperty;
var __defProps$W = Object.defineProperties;
var __getOwnPropDescs$W = Object.getOwnPropertyDescriptors;
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
var __spreadProps$W = (a, b) => __defProps$W(a, __getOwnPropDescs$W(b));
var __objRest$1h = (source, exclude) => {
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
const defaultProps$O = {
  radius: 0
};
const _BackgroundImage = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("BackgroundImage", defaultProps$O, props), {
    src,
    radius,
    sx
  } = _a, others = __objRest$1h(_a, ["src", "radius", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$W(__spreadValues$1Z({}, others), {
      ref,
      sx: [(theme) => __spreadProps$W(__spreadValues$1Z({}, theme.fn.focusStyles()), {
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
var __defProp$1Y = Object.defineProperty;
var __defProps$V = Object.defineProperties;
var __getOwnPropDescs$V = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1Y = Object.getOwnPropertySymbols;
var __hasOwnProp$1Y = Object.prototype.hasOwnProperty;
var __propIsEnum$1Y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1Y = (obj, key, value) => key in obj ? __defProp$1Y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$V = (a, b) => __defProps$V(a, __getOwnPropDescs$V(b));
const sizes$d = {
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
function getVariantStyles$2({ theme, variant, color, size, gradient }) {
  if (variant === "dot") {
    const dotSize = theme.fn.size({ size, sizes: dotSizes });
    return {
      backgroundColor: "transparent",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[3]}`,
      paddingLeft: theme.fn.size({ size, sizes: theme.spacing }) / 1.5 - dotSize / 2,
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
var useStyles$1M = createStyles((theme, { color, size, radius, gradient, fullWidth, variant }) => {
  const { fontSize, height } = size in sizes$d ? sizes$d[size] : sizes$d.md;
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
    root: __spreadValues$1Y(__spreadProps$V(__spreadValues$1Y(__spreadValues$1Y({}, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      fontSize,
      height,
      WebkitTapHighlightColor: "transparent",
      lineHeight: `${height - 2}px`,
      textDecoration: "none",
      padding: `0 ${theme.fn.size({ size, sizes: theme.spacing }) / 1.5}px`,
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
    }), getVariantStyles$2({ theme, variant, color, size, gradient }))
  };
});
const useStyles$1N = useStyles$1M;
var __defProp$1X = Object.defineProperty;
var __getOwnPropSymbols$1X = Object.getOwnPropertySymbols;
var __hasOwnProp$1X = Object.prototype.hasOwnProperty;
var __propIsEnum$1X = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1X = (obj, key, value) => key in obj ? __defProp$1X(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$1g = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1X.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1X)
    for (var prop of __getOwnPropSymbols$1X(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1X.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$N = {
  variant: "light",
  size: "md",
  radius: "xl"
};
const _Badge = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Badge", defaultProps$N, props), {
    className,
    color,
    variant,
    fullWidth,
    children,
    size,
    leftSection,
    rightSection,
    radius,
    gradient,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1g(_a, ["className", "color", "variant", "fullWidth", "children", "size", "leftSection", "rightSection", "radius", "gradient", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1N({
    size,
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
    ...__spreadValues$1X({
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
function QuoteIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1W({
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
var __defProp$1V = Object.defineProperty;
var __defProps$U = Object.defineProperties;
var __getOwnPropDescs$U = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1V = Object.getOwnPropertySymbols;
var __hasOwnProp$1V = Object.prototype.hasOwnProperty;
var __propIsEnum$1V = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1V = (obj, key, value) => key in obj ? __defProp$1V(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$U = (a, b) => __defProps$U(a, __getOwnPropDescs$U(b));
var useStyles$1K = createStyles((theme, { color }) => ({
  root: __spreadProps$U(__spreadValues$1V({}, theme.fn.fontStyles()), {
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
const useStyles$1L = useStyles$1K;
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
var __objRest$1f = (source, exclude) => {
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
const defaultProps$M = {
  color: "gray",
  icon: /* @__PURE__ */ jsx(QuoteIcon, {})
};
const Blockquote = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Blockquote", defaultProps$M, props), {
    className,
    color,
    icon,
    cite,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$1f(_a, ["className", "color", "icon", "cite", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1L({
    color
  }, {
    classNames,
    styles,
    unstyled,
    name: "Blockquote"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1U({
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
const CardContext = react.exports.createContext({ padding: 0 });
const CardProvider = CardContext.Provider;
const useCardPadding = () => react.exports.useContext(CardContext).padding;
var useStyles$1I = createStyles((theme, { padding: padding2, withBorder, inheritPadding }) => {
  const spacing = theme.fn.size({ size: padding2, sizes: theme.spacing });
  const offset = -1 * spacing;
  const borderColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    cardSection: {
      display: "block",
      marginLeft: offset,
      marginRight: offset,
      paddingLeft: inheritPadding ? spacing : void 0,
      paddingRight: inheritPadding ? spacing : void 0,
      borderTop: withBorder && `1px solid ${borderColor}`,
      borderBottom: withBorder && `1px solid ${borderColor}`,
      "& + &": {
        borderTop: 0
      },
      "&[data-first]": {
        marginTop: offset,
        borderTop: 0,
        borderBottom: withBorder && `1px solid ${borderColor}`
      },
      "&[data-last]": {
        marginBottom: offset,
        borderBottom: 0
      }
    }
  };
});
const useStyles$1J = useStyles$1I;
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
var __objRest$1e = (source, exclude) => {
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
const _CardSection = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    withBorder = false,
    inheritPadding = false,
    unstyled
  } = _b, others = __objRest$1e(_b, ["className", "withBorder", "inheritPadding", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1J({
    padding: useCardPadding(),
    withBorder,
    inheritPadding
  }, {
    name: "Card",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1T({
      className: cx(classes.cardSection, className),
      ref
    }, others)
  });
});
_CardSection.displayName = "@mantine/core/CardSection";
const CardSection = createPolymorphicComponent(_CardSection);
var useStyles$1G = createStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
  }
}));
const useStyles$1H = useStyles$1G;
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
var __objRest$1d = (source, exclude) => {
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
const defaultProps$L = {
  p: "md"
};
const _Card = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Card", defaultProps$L, props), {
    className,
    p,
    radius,
    children,
    unstyled
  } = _a, others = __objRest$1d(_a, ["className", "p", "radius", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1H(null, {
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
      ...__spreadValues$1S({
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
var __objRest$1c = (source, exclude) => {
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
const defaultProps$K = {
  spacing: "xs"
};
function ChipGroup(props) {
  const _a = useComponentDefaultProps("ChipGroup", defaultProps$K, props), {
    value,
    defaultValue,
    onChange,
    spacing,
    multiple,
    children,
    unstyled
  } = _a, others = __objRest$1c(_a, ["value", "defaultValue", "onChange", "spacing", "multiple", "children", "unstyled"]);
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
      ...__spreadValues$1R({
        spacing,
        unstyled
      }, others),
      children
    })
  });
}
ChipGroup.displayName = "@mantine/core/ChipGroup";
var __defProp$1Q = Object.defineProperty;
var __defProps$T = Object.defineProperties;
var __getOwnPropDescs$T = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1Q = Object.getOwnPropertySymbols;
var __hasOwnProp$1Q = Object.prototype.hasOwnProperty;
var __propIsEnum$1Q = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1Q = (obj, key, value) => key in obj ? __defProp$1Q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$T = (a, b) => __defProps$T(a, __getOwnPropDescs$T(b));
const sizes$c = {
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
var useStyles$1E = createStyles((theme, { radius, size, color }, getRef) => ({
  root: {},
  label: __spreadProps$T(__spreadValues$1Q({
    ref: getRef("label")
  }, theme.fn.fontStyles()), {
    boxSizing: "border-box",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    display: "inline-block",
    alignItems: "center",
    userSelect: "none",
    border: "1px solid transparent",
    borderRadius: theme.fn.radius(radius),
    height: theme.fn.size({ size, sizes: sizes$c }),
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    lineHeight: `${theme.fn.size({ size, sizes: sizes$c }) - 2}px`,
    paddingLeft: theme.fn.size({ size, sizes: padding }),
    paddingRight: theme.fn.size({ size, sizes: padding }),
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background-color 100ms ease",
    WebkitTapHighlightColor: "transparent",
    '&[data-variant="filled"]': __spreadValues$1Q({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    '&[data-variant="outline"]': __spreadValues$1Q({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0]
    })),
    "&[data-disabled]": __spreadProps$T(__spreadValues$1Q({
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
      paddingLeft: theme.fn.size({ size, sizes: checkedPadding }),
      paddingRight: theme.fn.size({ size, sizes: checkedPadding }),
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
    width: theme.fn.size({ size, sizes: iconSizes$4 }) + theme.fn.size({ size, sizes: theme.spacing }) / 1.5,
    maxWidth: theme.fn.size({ size, sizes: iconSizes$4 }) + theme.fn.size({ size, sizes: theme.spacing }) / 1.5,
    height: theme.fn.size({ size, sizes: iconSizes$4 }),
    display: "inline-block",
    verticalAlign: "middle",
    overflow: "hidden"
  },
  checkIcon: {
    width: theme.fn.size({ size, sizes: iconSizes$4 }),
    height: theme.fn.size({ size, sizes: iconSizes$4 }) / 1.1,
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
const useStyles$1F = useStyles$1E;
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
var __objRest$1b = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1P.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1P)
    for (var prop of __getOwnPropSymbols$1P(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1P.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$J = {
  type: "checkbox",
  size: "sm",
  radius: "xl",
  variant: "outline"
};
const Chip = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Chip", defaultProps$J, props), {
    radius,
    type,
    size,
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
  } = _a, others = __objRest$1b(_a, ["radius", "type", "size", "variant", "disabled", "id", "color", "children", "className", "classNames", "style", "styles", "checked", "defaultChecked", "onChange", "sx", "wrapperProps", "value", "unstyled"]);
  const ctx = useChipGroup();
  const uuid2 = useId(id);
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const {
    classes,
    cx
  } = useStyles$1F({
    radius,
    size,
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
    ...__spreadValues$1P(__spreadValues$1P({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadValues$1P(__spreadValues$1P({
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
var __defProp$1O = Object.defineProperty;
var __defProps$S = Object.defineProperties;
var __getOwnPropDescs$S = Object.getOwnPropertyDescriptors;
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
var __spreadProps$S = (a, b) => __defProps$S(a, __getOwnPropDescs$S(b));
var useStyles$1C = createStyles((theme, { color: _color }) => {
  const color = _color || (theme.colorScheme === "dark" ? "dark" : "gray");
  const colors = theme.fn.variant({ color, variant: "light" });
  return {
    root: __spreadProps$S(__spreadValues$1O({}, theme.fn.fontStyles()), {
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
const useStyles$1D = useStyles$1C;
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
var __objRest$1a = (source, exclude) => {
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
const Code = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Code", {}, props), {
    className,
    children,
    block,
    color,
    unstyled
  } = _a, others = __objRest$1a(_a, ["className", "children", "block", "color", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1D({
    color
  }, {
    name: "Code",
    unstyled
  });
  if (block) {
    return /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$1N({
        component: "pre",
        dir: "ltr",
        className: cx(classes.root, classes.block, className),
        ref
      }, others),
      children
    });
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1N({
      component: "code",
      className: cx(classes.root, className),
      ref,
      dir: "ltr"
    }, others),
    children
  });
});
Code.displayName = "@mantine/core/Code";
var __defProp$1M = Object.defineProperty;
var __defProps$R = Object.defineProperties;
var __getOwnPropDescs$R = Object.getOwnPropertyDescriptors;
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
var __spreadProps$R = (a, b) => __defProps$R(a, __getOwnPropDescs$R(b));
var useStyles$1A = createStyles((theme, { size, radius }) => {
  const overlayColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    root: __spreadProps$R(__spreadValues$1M({}, theme.fn.focusStyles()), {
      width: size,
      height: size,
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
const useStyles$1B = useStyles$1A;
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
var __objRest$19 = (source, exclude) => {
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
const defaultProps$I = {
  size: 25,
  radius: 25
};
const _ColorSwatch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorSwatch", defaultProps$I, props), {
    color,
    size,
    radius,
    className,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$19(_a, ["color", "size", "radius", "className", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1B({
    radius,
    size
  }, {
    classNames,
    styles,
    unstyled,
    name: "ColorSwatch"
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$1L({
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
var useStyles$1y = createStyles((theme, { size }) => {
  const _size = theme.fn.size({ size, sizes: THUMB_SIZES });
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
const useStyles$1z = useStyles$1y;
var __defProp$1K = Object.defineProperty;
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
function Thumb$1({
  position,
  className,
  styles,
  classNames,
  style,
  size,
  __staticSelector,
  unstyled
}) {
  const {
    classes,
    cx
  } = useStyles$1z({
    size
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  return /* @__PURE__ */ jsx("div", {
    className: cx(classes.thumb, className),
    style: __spreadValues$1K({
      left: `calc(${position.x * 100}% - ${THUMB_SIZES[size] / 2}px)`,
      top: `calc(${position.y * 100}% - ${THUMB_SIZES[size] / 2}px)`
    }, style)
  });
}
Thumb$1.displayName = "@mantine/core/Thumb";
var useStyles$1w = createStyles((theme, { size }, getRef) => ({
  sliderThumb: {
    ref: getRef("sliderThumb")
  },
  slider: {
    position: "relative",
    height: theme.fn.size({ size, sizes: THUMB_SIZES }) + 2,
    boxSizing: "border-box",
    marginLeft: theme.fn.size({ size, sizes: THUMB_SIZES }) / 2,
    marginRight: theme.fn.size({ size, sizes: THUMB_SIZES }) / 2,
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
    left: -theme.fn.size({ size, sizes: THUMB_SIZES }) / 2 - 1,
    right: -theme.fn.size({ size, sizes: THUMB_SIZES }) / 2 - 1,
    borderRadius: 1e3
  }
}));
const useStyles$1x = useStyles$1w;
var __defProp$1J = Object.defineProperty;
var __defProps$Q = Object.defineProperties;
var __getOwnPropDescs$Q = Object.getOwnPropertyDescriptors;
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
var __spreadProps$Q = (a, b) => __defProps$Q(a, __getOwnPropDescs$Q(b));
var __objRest$18 = (source, exclude) => {
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
const ColorSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange,
    maxValue,
    round: round2,
    size = "md",
    thumbColor = "transparent",
    __staticSelector = "ColorSlider",
    focusable = true,
    overlays,
    classNames,
    styles,
    className,
    unstyled
  } = _b, others = __objRest$18(_b, ["value", "onChange", "maxValue", "round", "size", "thumbColor", "__staticSelector", "focusable", "overlays", "classNames", "styles", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1x({
    size
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
    ...__spreadProps$Q(__spreadValues$1J({}, others), {
      ref: useMergedRef(sliderRef, ref),
      className: cx(classes.slider, className),
      role: "slider",
      "aria-valuenow": value,
      "aria-valuemax": maxValue,
      "aria-valuemin": 0,
      tabIndex: focusable ? 0 : -1,
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
      size
    })]
  });
});
ColorSlider.displayName = "@mantine/core/ColorSlider";
var __defProp$1I = Object.defineProperty;
var __defProps$P = Object.defineProperties;
var __getOwnPropDescs$P = Object.getOwnPropertyDescriptors;
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
var __spreadProps$P = (a, b) => __defProps$P(a, __getOwnPropDescs$P(b));
var __objRest$17 = (source, exclude) => {
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
const HueSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange
  } = _b, others = __objRest$17(_b, ["value", "onChange"]);
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$P(__spreadValues$1I({}, others), {
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
var __defProp$1H = Object.defineProperty;
var __defProps$O = Object.defineProperties;
var __getOwnPropDescs$O = Object.getOwnPropertyDescriptors;
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
var __spreadProps$O = (a, b) => __defProps$O(a, __getOwnPropDescs$O(b));
var __objRest$16 = (source, exclude) => {
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
const AlphaSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange,
    color
  } = _b, others = __objRest$16(_b, ["value", "onChange", "color"]);
  const theme = useMantineTheme();
  const _color = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$O(__spreadValues$1H({}, others), {
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
var __defProp$1G = Object.defineProperty;
var __getOwnPropSymbols$1G = Object.getOwnPropertySymbols;
var __hasOwnProp$1G = Object.prototype.hasOwnProperty;
var __propIsEnum$1G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1G = (obj, key, value) => key in obj ? __defProp$1G(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
const SATURATION_HEIGHTS = {
  xs: 100,
  sm: 110,
  md: 120,
  lg: 140,
  xl: 160
};
var useStyles$1u = createStyles((theme, { size }, getRef) => ({
  saturationThumb: {
    ref: getRef("saturationThumb")
  },
  saturation: {
    boxSizing: "border-box",
    position: "relative",
    height: theme.fn.size({ size, sizes: SATURATION_HEIGHTS }),
    borderRadius: theme.radius.sm,
    margin: theme.fn.size({ size, sizes: THUMB_SIZES }) / 2,
    WebkitTapHighlightColor: "transparent",
    [`&:focus .${getRef("saturationThumb")}`]: {
      outline: "none",
      boxShadow: `0 0 0 1px ${theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white}, 0 0 0 3px ${theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5]}`
    },
    [`&:focus:not(:focus-visible) .${getRef("saturationThumb")}`]: {
      boxShadow: theme.focusRing === "auto" || theme.focusRing === "never" ? "none" : void 0
    }
  },
  saturationOverlay: __spreadValues$1G({
    boxSizing: "border-box",
    borderRadius: theme.radius.sm
  }, theme.fn.cover(-theme.fn.size({ size, sizes: THUMB_SIZES }) / 2 - 1))
}));
const useStyles$1v = useStyles$1u;
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
  focusable = true,
  __staticSelector = "saturation",
  size,
  color,
  saturationLabel,
  classNames,
  styles,
  unstyled
}) {
  const {
    classes
  } = useStyles$1v({
    size
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
    tabIndex: focusable ? 0 : -1,
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
      size
    })]
  });
}
Saturation.displayName = "@mantine/core/Saturation";
var useStyles$1s = createStyles((_theme, { swatchesPerRow }) => ({
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
const useStyles$1t = useStyles$1s;
var __defProp$1F = Object.defineProperty;
var __getOwnPropSymbols$1F = Object.getOwnPropertySymbols;
var __hasOwnProp$1F = Object.prototype.hasOwnProperty;
var __propIsEnum$1F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1F = (obj, key, value) => key in obj ? __defProp$1F(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$15 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1F.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1F)
    for (var prop of __getOwnPropSymbols$1F(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1F.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function Swatches(_a) {
  var _b = _a, {
    data,
    swatchesPerRow = 10,
    focusable = true,
    classNames,
    styles,
    __staticSelector = "color-picker",
    unstyled,
    setValue
  } = _b, others = __objRest$15(_b, ["data", "swatchesPerRow", "focusable", "classNames", "styles", "__staticSelector", "unstyled", "setValue"]);
  const {
    classes
  } = useStyles$1t({
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
    tabIndex: focusable ? 0 : -1
  }, index2));
  return /* @__PURE__ */ jsx("div", {
    ...__spreadValues$1F({
      className: classes.swatches
    }, others),
    children: colors
  });
}
Swatches.displayName = "@mantine/core/Swatches";
const sizes$b = {
  xs: 180,
  sm: 200,
  md: 240,
  lg: 280,
  xl: 320
};
var useStyles$1r = createStyles((theme, { size, fullWidth }) => ({
  preview: {},
  wrapper: {
    boxSizing: "border-box",
    width: fullWidth ? "100%" : theme.fn.size({ size, sizes: sizes$b }),
    padding: 1
  },
  body: {
    display: "flex",
    boxSizing: "border-box",
    paddingTop: theme.fn.size({ size, sizes: theme.spacing }) / 2
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
var __objRest$14 = (source, exclude) => {
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
const SWATCH_SIZES$1 = {
  xs: 26,
  sm: 34,
  md: 42,
  lg: 50,
  xl: 54
};
const defaultProps$H = {
  swatchesPerRow: 10,
  size: "sm",
  withPicker: true,
  focusable: true,
  __staticSelector: "ColorPicker"
};
const ColorPicker = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorPicker", defaultProps$H, props), {
    value,
    defaultValue,
    onChange,
    format,
    swatches,
    swatchesPerRow,
    size,
    withPicker,
    fullWidth,
    focusable,
    __staticSelector,
    saturationLabel,
    hueLabel,
    alphaLabel,
    className,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$14(_a, ["value", "defaultValue", "onChange", "format", "swatches", "swatchesPerRow", "size", "withPicker", "fullWidth", "focusable", "__staticSelector", "saturationLabel", "hueLabel", "alphaLabel", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1r({
    size,
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
      const next = __spreadValues$1E(__spreadValues$1E({}, current), color);
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
    ...__spreadValues$1E({
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
        size,
        focusable,
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
            size,
            styles,
            classNames,
            focusable,
            "aria-label": hueLabel,
            __staticSelector
          }), withAlpha && /* @__PURE__ */ jsx(AlphaSlider, {
            value: parsed.a,
            onChange: (a) => handleChange({
              a
            }),
            size,
            color: convertHsvaTo("hex", parsed),
            style: {
              marginTop: 6
            },
            styles,
            classNames,
            focusable,
            "aria-label": alphaLabel,
            __staticSelector
          })]
        }), withAlpha && /* @__PURE__ */ jsx(ColorSwatch, {
          color: _value,
          radius: "sm",
          size: theme.fn.size({
            size,
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
      focusable,
      classNames,
      styles,
      __staticSelector,
      setValue
    })]
  });
});
ColorPicker.displayName = "@mantine/core/ColorPicker";
var __defProp$1D = Object.defineProperty;
var __defProps$N = Object.defineProperties;
var __getOwnPropDescs$N = Object.getOwnPropertyDescriptors;
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
var __spreadProps$N = (a, b) => __defProps$N(a, __getOwnPropDescs$N(b));
var __objRest$13 = (source, exclude) => {
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
const SWATCH_SIZES = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36
};
const defaultProps$G = {
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
  const _a = useInputProps("ColorInput", defaultProps$G, props), {
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
  } = _a, others = __objRest$13(_a, ["wrapperProps", "inputProps", "format", "onChange", "onFocus", "onBlur", "value", "defaultValue", "disallowInput", "fixOnBlur", "withPreview", "swatchesPerRow", "withPicker", "icon", "transition", "dropdownZIndex", "transitionDuration", "transitionTimingFunction", "withinPortal", "swatches", "shadow", "classNames", "styles", "unstyled"]);
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
    ...__spreadProps$N(__spreadValues$1D({}, wrapperProps), {
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
            ...__spreadProps$N(__spreadValues$1D(__spreadValues$1D({}, others), inputProps), {
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
var __objRest$12 = (source, exclude) => {
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
const defaultProps$F = {
  timeout: 1e3
};
function CopyButton(props) {
  const _a = useComponentDefaultProps("CopyButton", defaultProps$F, props), {
    children,
    timeout,
    value
  } = _a, others = __objRest$12(_a, ["children", "timeout", "value"]);
  const clipboard = useClipboard({
    timeout
  });
  const copy = () => clipboard.copy(value);
  return /* @__PURE__ */ jsx(Fragment, {
    children: children(__spreadValues$1C({
      copy,
      copied: clipboard.copied
    }, others))
  });
}
CopyButton.displayName = "@mantine/core/CopyButton";
var __defProp$1B = Object.defineProperty;
var __defProps$M = Object.defineProperties;
var __getOwnPropDescs$M = Object.getOwnPropertyDescriptors;
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
var __spreadProps$M = (a, b) => __defProps$M(a, __getOwnPropDescs$M(b));
const sizes$a = {
  xs: 160,
  sm: 200,
  md: 340,
  lg: 400,
  xl: 500
};
var useStyles$1p = createStyles((theme, { size }) => ({
  root: __spreadProps$M(__spreadValues$1B({}, theme.fn.fontStyles()), {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    position: "relative",
    width: theme.fn.size({ size, sizes: sizes$a }),
    maxWidth: "100%",
    minHeight: 50
  }),
  closeButton: {
    position: "absolute",
    top: theme.spacing.md / 2,
    right: theme.spacing.md / 2
  }
}));
const useStyles$1q = useStyles$1p;
var __defProp$1A = Object.defineProperty;
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
var __objRest$11 = (source, exclude) => {
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
const defaultProps$E = {
  shadow: "md",
  p: "md",
  withBorder: true,
  size: "md",
  transition: "pop-top-right",
  transitionDuration: 200
};
function DialogBody(props) {
  const _a = useComponentDefaultProps("Dialog", defaultProps$E, props), {
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
    size,
    transition,
    transitionDuration,
    transitionTimingFunction,
    unstyled
  } = _a, others = __objRest$11(_a, ["withCloseButton", "onClose", "position", "shadow", "children", "className", "style", "classNames", "styles", "opened", "withBorder", "size", "transition", "transitionDuration", "transitionTimingFunction", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1q({
    size
  }, {
    classNames,
    styles,
    unstyled,
    name: "Dialog"
  });
  return /* @__PURE__ */ jsx(Transition, {
    mounted: opened,
    transition,
    duration: transitionDuration,
    timingFunction: transitionTimingFunction,
    children: (transitionStyles) => /* @__PURE__ */ jsxs(Paper, {
      ...__spreadValues$1A({
        className: cx(classes.root, className),
        style: __spreadValues$1A(__spreadValues$1A({}, style), transitionStyles),
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
  } = _b, props = __objRest$11(_b, ["zIndex"]);
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Affix, {
    zIndex,
    position: props.position || {
      bottom: theme.spacing.xl,
      right: theme.spacing.xl
    },
    ref,
    children: /* @__PURE__ */ jsx(DialogBody, {
      ...__spreadValues$1A({}, props)
    })
  });
});
Dialog.displayName = "@mantine/core/Dialog";
var __defProp$1z = Object.defineProperty;
var __defProps$L = Object.defineProperties;
var __getOwnPropDescs$L = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1z = Object.getOwnPropertySymbols;
var __hasOwnProp$1z = Object.prototype.hasOwnProperty;
var __propIsEnum$1z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1z = (obj, key, value) => key in obj ? __defProp$1z(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$L = (a, b) => __defProps$L(a, __getOwnPropDescs$L(b));
const sizes$9 = {
  xs: 180,
  sm: 240,
  md: 320,
  lg: 360,
  xl: 500,
  full: "100%"
};
function getPositionStyles$1({
  position,
  size,
  theme
}) {
  switch (position) {
    case "top":
      return { top: 0, left: 0, right: 0, height: theme.fn.size({ size, sizes: sizes$9 }) };
    case "bottom":
      return { bottom: 0, left: 0, right: 0, height: theme.fn.size({ size, sizes: sizes$9 }) };
    case "right":
      return { bottom: 0, top: 0, right: 0, width: theme.fn.size({ size, sizes: sizes$9 }) };
    case "left":
      return { bottom: 0, top: 0, left: 0, width: theme.fn.size({ size, sizes: sizes$9 }) };
    default:
      return null;
  }
}
var useStyles$1n = createStyles((theme, { position, size, zIndex }) => ({
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
  drawer: __spreadProps$L(__spreadValues$1z({}, getPositionStyles$1({ position, size, theme })), {
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
const useStyles$1o = useStyles$1n;
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
var __objRest$10 = (source, exclude) => {
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
const defaultProps$D = {
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
  const _a = useComponentDefaultProps("Drawer", defaultProps$D, props), {
    className,
    opened,
    onClose,
    position,
    size,
    trapFocus,
    lockScroll,
    closeOnClickOutside,
    closeOnEscape,
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
  } = _a, others = __objRest$10(_a, ["className", "opened", "onClose", "position", "size", "trapFocus", "lockScroll", "closeOnClickOutside", "closeOnEscape", "transition", "transitionDuration", "transitionTimingFunction", "zIndex", "overlayColor", "overlayOpacity", "children", "withOverlay", "shadow", "padding", "title", "withCloseButton", "closeButtonLabel", "classNames", "styles", "target", "withinPortal", "overlayBlur", "unstyled", "withFocusReturn"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$1o({
    size,
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
    if (event.key === "Escape" && closeOnEscape) {
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
        ...__spreadValues$1y({
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
            shouldTrigger && event.key === "Escape" && closeOnEscape && onClose();
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
var __defProp$1x = Object.defineProperty;
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
var __objRest$$ = (source, exclude) => {
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
const defaultProps$C = {
  multiple: false
};
const FileButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("FileButton", defaultProps$C, props), {
    onChange,
    children,
    multiple,
    accept,
    name,
    form,
    resetRef
  } = _a, others = __objRest$$(_a, ["onChange", "children", "multiple", "accept", "name", "form", "resetRef"]);
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
    children: [children(__spreadValues$1x({
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
var useStyles$1l = createStyles((theme) => ({
  placeholder: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  },
  input: {
    cursor: "pointer"
  }
}));
const useStyles$1m = useStyles$1l;
var __defProp$1w = Object.defineProperty;
var __defProps$K = Object.defineProperties;
var __getOwnPropDescs$K = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1w = Object.getOwnPropertySymbols;
var __hasOwnProp$1w = Object.prototype.hasOwnProperty;
var __propIsEnum$1w = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1w = (obj, key, value) => key in obj ? __defProp$1w(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$K = (a, b) => __defProps$K(a, __getOwnPropDescs$K(b));
var __objRest$_ = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1w.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1w)
    for (var prop of __getOwnPropSymbols$1w(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1w.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const DefaultValue$1 = ({
  value
}) => /* @__PURE__ */ jsx("span", {
  children: Array.isArray(value) ? value.map((file) => file.name).join(", ") : value == null ? void 0 : value.name
});
const defaultProps$B = {
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
  const _a = useInputProps("FileInput", defaultProps$B, props), {
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
  } = _a, others = __objRest$_(_a, ["inputProps", "wrapperProps", "placeholder", "value", "defaultValue", "onChange", "multiple", "accept", "name", "form", "classNames", "styles", "unstyled", "valueComponent", "rightSection", "rightSectionWidth", "clearable", "clearButtonLabel", "clearButtonTabIndex"]);
  const resetRef = react.exports.useRef();
  const {
    classes,
    theme,
    cx
  } = useStyles$1m(null, {
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
    ...__spreadProps$K(__spreadValues$1w({}, wrapperProps), {
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
        ...__spreadProps$K(__spreadValues$1w(__spreadValues$1w(__spreadValues$1w({
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
          classNames: __spreadProps$K(__spreadValues$1w({}, classNames), {
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
var __defProp$1v = Object.defineProperty;
var __getOwnPropSymbols$1v = Object.getOwnPropertySymbols;
var __hasOwnProp$1v = Object.prototype.hasOwnProperty;
var __propIsEnum$1v = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1v = (obj, key, value) => key in obj ? __defProp$1v(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
const getColumnWidth = (colSpan, columns) => colSpan ? `${100 / (columns / colSpan)}%` : void 0;
const getColumnOffset = (offset, columns) => offset ? `${100 / (columns / offset)}%` : void 0;
function getBreakpointsStyles({
  sizes: sizes2,
  offsets,
  orders,
  theme,
  columns,
  grow
}) {
  return MANTINE_SIZES.reduce((acc, size) => {
    acc[`@media (min-width: ${theme.breakpoints[size] + 1}px)`] = {
      order: orders[size],
      flexBasis: getColumnWidth(sizes2[size], columns),
      flexShrink: 0,
      maxWidth: grow ? "unset" : getColumnWidth(sizes2[size], columns),
      marginLeft: getColumnOffset(offsets[size], columns)
    };
    return acc;
  }, {});
}
var useStyles$1j = createStyles((theme, {
  gutter,
  grow,
  offset,
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
  root: __spreadValues$1v({
    boxSizing: "border-box",
    flexGrow: grow ? 1 : 0,
    order,
    padding: theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
    marginLeft: getColumnOffset(offset, columns),
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
const useStyles$1k = useStyles$1j;
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
var __objRest$Z = (source, exclude) => {
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
const defaultProps$A = {
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
  const _a = useComponentDefaultProps("Grid.Col", defaultProps$A, props), {
    children,
    span,
    offset,
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
  } = _a, others = __objRest$Z(_a, ["children", "span", "offset", "offsetXs", "offsetSm", "offsetMd", "offsetLg", "offsetXl", "xs", "sm", "md", "lg", "xl", "order", "orderXs", "orderSm", "orderMd", "orderLg", "orderXl", "className", "id", "unstyled"]);
  const ctx = useGridContext();
  if (!ctx) {
    throw new Error("[@mantine/core] Grid.Col was used outside of Grid context");
  }
  const colSpan = span || ctx.columns;
  const {
    classes,
    cx
  } = useStyles$1k({
    gutter: ctx.gutter,
    offset,
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
    ...__spreadValues$1u({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
Col.displayName = "@mantine/core/Col";
var useStyles$1h = createStyles((theme, { justify, align, gutter }) => ({
  root: {
    margin: -theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: justify,
    alignItems: align
  }
}));
const useStyles$1i = useStyles$1h;
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
var __objRest$Y = (source, exclude) => {
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
const defaultProps$z = {
  gutter: "md",
  justify: "flex-start",
  align: "stretch",
  columns: 12
};
const Grid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Grid", defaultProps$z, props), {
    gutter,
    children,
    grow,
    justify,
    align,
    columns,
    className,
    id,
    unstyled
  } = _a, others = __objRest$Y(_a, ["gutter", "children", "grow", "justify", "align", "columns", "className", "id", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1i({
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
      ...__spreadValues$1t({
        className: cx(classes.root, className),
        ref
      }, others),
      children
    })
  });
});
Grid.Col = Col;
Grid.displayName = "@mantine/core/Grid";
const HOVER_CARD_ERRORS = {
  context: "HoverCard component was not found in the tree",
  children: "HoverCard.Target component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported"
};
const [HoverCardContextProvider, useHoverCardContext] = createSafeContext(HOVER_CARD_ERRORS.context);
var __defProp$1s = Object.defineProperty;
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
var __objRest$X = (source, exclude) => {
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
function HoverCardDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$X(_b, ["children", "onMouseEnter", "onMouseLeave"]);
  const ctx = useHoverCardContext();
  const handleMouseEnter = createEventHandler(onMouseEnter, ctx.openDropdown);
  const handleMouseLeave = createEventHandler(onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$1s({
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }, others),
    children
  });
}
HoverCardDropdown.displayName = "@mantine/core/HoverCardDropdown";
var __defProp$1r = Object.defineProperty;
var __getOwnPropSymbols$1r = Object.getOwnPropertySymbols;
var __hasOwnProp$1r = Object.prototype.hasOwnProperty;
var __propIsEnum$1r = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1r = (obj, key, value) => key in obj ? __defProp$1r(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$W = (source, exclude) => {
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
const HoverCardTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp
  } = _b, others = __objRest$W(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(HOVER_CARD_ERRORS.children);
  }
  const ctx = useHoverCardContext();
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, ctx.openDropdown);
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$1r({
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
var __defProp$1q = Object.defineProperty;
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
var __objRest$V = (source, exclude) => {
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
const defaultProps$y = {
  openDelay: 0,
  closeDelay: 150,
  initiallyOpened: false
};
function HoverCard(props) {
  const _a = useComponentDefaultProps("HoverCard", defaultProps$y, props), {
    children,
    onOpen,
    onClose,
    openDelay,
    closeDelay,
    initiallyOpened
  } = _a, others = __objRest$V(_a, ["children", "onOpen", "onClose", "openDelay", "closeDelay", "initiallyOpened"]);
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
      ...__spreadValues$1q({
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
var __defProp$1p = Object.defineProperty;
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
function ImageIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1p({
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
var useStyles$1f = createStyles((theme, { radius }) => ({
  root: {},
  imageWrapper: {
    position: "relative"
  },
  figure: {
    margin: 0
  },
  image: __spreadProps$J(__spreadValues$1o({}, theme.fn.fontStyles()), {
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
  placeholder: __spreadProps$J(__spreadValues$1o({}, theme.fn.cover()), {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  })
}));
const useStyles$1g = useStyles$1f;
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
var __objRest$U = (source, exclude) => {
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
const defaultProps$x = {
  fit: "cover",
  width: "100%",
  height: "auto",
  radius: 0
};
const Image = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Image", defaultProps$x, props), {
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
  } = _a, others = __objRest$U(_a, ["className", "alt", "src", "fit", "width", "height", "radius", "imageProps", "withPlaceholder", "placeholder", "imageRef", "classNames", "styles", "caption", "unstyled", "style"]);
  const {
    classes,
    cx
  } = useStyles$1g({
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
    ...__spreadValues$1n({
      className: cx(classes.root, className),
      ref,
      style: __spreadValues$1n({
        width,
        height
      }, style)
    }, others),
    children: /* @__PURE__ */ jsxs("figure", {
      className: classes.figure,
      children: [/* @__PURE__ */ jsxs("div", {
        className: classes.imageWrapper,
        children: [/* @__PURE__ */ jsx("img", {
          ...__spreadValues$1n({
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
var __defProp$1m = Object.defineProperty;
var __defProps$I = Object.defineProperties;
var __getOwnPropDescs$I = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1m = Object.getOwnPropertySymbols;
var __hasOwnProp$1m = Object.prototype.hasOwnProperty;
var __propIsEnum$1m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1m = (obj, key, value) => key in obj ? __defProp$1m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
function getPositionStyles(_position, offset = 0) {
  const styles = {};
  const [position, placement] = _position.split("-");
  let translateX = "";
  let translateY = "";
  if (position === "top") {
    styles.top = offset;
    translateY = "-50%";
  }
  if (position === "middle") {
    styles.top = "50%";
    translateY = "-50%";
  }
  if (position === "bottom") {
    styles.bottom = offset;
    translateY = "50%";
  }
  if (placement === "start") {
    styles.left = offset;
    translateX = "-50%";
  }
  if (placement === "center") {
    styles.left = "50%";
    translateX = "-50%";
  }
  if (placement === "end") {
    styles.right = offset;
    translateX = "50%";
  }
  styles.transform = `translate(${translateX}, ${translateY})`;
  return styles;
}
var useStyles$1d = createStyles((theme, {
  radius,
  size,
  color,
  position,
  offset,
  inline,
  withBorder,
  withLabel,
  zIndex
}) => ({
  root: {
    position: "relative",
    display: inline ? "inline-block" : "block"
  },
  indicator: __spreadProps$I(__spreadValues$1m({}, getPositionStyles(position, offset)), {
    zIndex,
    position: "absolute",
    [withLabel ? "minWidth" : "width"]: size,
    height: size,
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
const useStyles$1e = useStyles$1d;
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
var __objRest$T = (source, exclude) => {
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
const defaultProps$w = {
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
  const _a = useComponentDefaultProps("Indicator", defaultProps$w, props), {
    children,
    position,
    offset,
    size,
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
  } = _a, others = __objRest$T(_a, ["children", "position", "offset", "size", "radius", "inline", "withBorder", "className", "color", "styles", "label", "classNames", "disabled", "zIndex", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1e({
    position,
    offset,
    size,
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
    ...__spreadValues$1l({
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
var __defProp$1k = Object.defineProperty;
var __defProps$H = Object.defineProperties;
var __getOwnPropDescs$H = Object.getOwnPropertyDescriptors;
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
var __spreadProps$H = (a, b) => __defProps$H(a, __getOwnPropDescs$H(b));
var __objRest$S = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1k.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1k)
    for (var prop of __getOwnPropSymbols$1k(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1k.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$v = {
  size: "sm",
  __staticSelector: "InputBase"
};
const _InputBase = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("InputBase", defaultProps$v, props), {
    inputProps,
    wrapperProps
  } = _a, others = __objRest$S(_a, ["inputProps", "wrapperProps"]);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1k({}, wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$H(__spreadValues$1k(__spreadValues$1k({}, inputProps), others), {
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
var useStyles$1b = createStyles((theme, { size }) => ({
  input: {
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }) - 2
  }
}));
const useStyles$1c = useStyles$1b;
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
var noop$1 = function noop() {
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
  var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = _ref$onChange === void 0 ? noop$1 : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = _ref$onHeightChange === void 0 ? noop$1 : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"]);
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
var useStyles$19 = createStyles((theme) => ({
  input: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs
  }
}));
const useStyles$1a = useStyles$19;
var __defProp$1j = Object.defineProperty;
var __defProps$G = Object.defineProperties;
var __getOwnPropDescs$G = Object.getOwnPropertyDescriptors;
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
var __spreadProps$G = (a, b) => __defProps$G(a, __getOwnPropDescs$G(b));
var __objRest$R = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1j.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1j)
    for (var prop of __getOwnPropSymbols$1j(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1j.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$u = {
  autosize: false,
  size: "sm",
  __staticSelector: "Textarea"
};
const Textarea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Textarea", defaultProps$u, props), {
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
    size,
    __staticSelector,
    sx,
    errorProps,
    descriptionProps,
    labelProps,
    inputWrapperOrder,
    inputContainer,
    unstyled,
    withAsterisk
  } = _a, others = __objRest$R(_a, ["autosize", "maxRows", "minRows", "label", "error", "description", "id", "className", "required", "style", "wrapperProps", "classNames", "styles", "size", "__staticSelector", "sx", "errorProps", "descriptionProps", "labelProps", "inputWrapperOrder", "inputContainer", "unstyled", "withAsterisk"]);
  const uuid2 = useId(id);
  const {
    classes,
    cx
  } = useStyles$1a();
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const sharedProps = __spreadValues$1j({
    required,
    ref,
    invalid: !!error,
    id: uuid2,
    classNames: __spreadProps$G(__spreadValues$1j({}, classNames), {
      input: cx(classes.input, classNames == null ? void 0 : classNames.input)
    }),
    styles,
    __staticSelector,
    size,
    multiline: true,
    unstyled
  }, rest);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$1j(__spreadValues$1j({
      label,
      error,
      id: uuid2,
      description,
      required,
      style,
      className,
      classNames,
      styles,
      size,
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
      ...__spreadProps$G(__spreadValues$1j({}, sharedProps), {
        component: TextareaAutosize$1,
        maxRows,
        minRows
      })
    }) : /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$G(__spreadValues$1j({}, sharedProps), {
        component: "textarea",
        rows: minRows
      })
    })
  });
});
Textarea.displayName = "@mantine/core/Textarea";
var __defProp$1i = Object.defineProperty;
var __defProps$F = Object.defineProperties;
var __getOwnPropDescs$F = Object.getOwnPropertyDescriptors;
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
var __spreadProps$F = (a, b) => __defProps$F(a, __getOwnPropDescs$F(b));
var __objRest$Q = (source, exclude) => {
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
const defaultProps$t = {
  formatOnBlur: false,
  size: "sm"
};
const JsonInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("JsonInput", defaultProps$t, props), {
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    error,
    formatOnBlur,
    size,
    validationError,
    classNames,
    unstyled
  } = _a, others = __objRest$Q(_a, ["value", "defaultValue", "onChange", "onFocus", "onBlur", "error", "formatOnBlur", "size", "validationError", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1c({
    size
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
    ...__spreadValues$1i({
      value: _value,
      onChange: (event) => setValue(event.currentTarget.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
      error: valid ? error : validationError || true,
      __staticSelector: "JsonInput",
      classNames: __spreadProps$F(__spreadValues$1i({}, classNames), {
        input: cx(classes.input, classNames == null ? void 0 : classNames.input)
      }),
      autoComplete: "nope",
      ref,
      unstyled
    }, others)
  });
});
JsonInput.displayName = "@mantine/core/JsonInput";
const ListContext = react.exports.createContext(null);
function useListContext() {
  return react.exports.useContext(ListContext) || {};
}
var useStyles$17 = createStyles((theme, { spacing, center }, getRef) => ({
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
const useStyles$18 = useStyles$17;
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
var __objRest$P = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$1h.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$1h)
    for (var prop of __getOwnPropSymbols$1h(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$1h.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function ListItem(_a) {
  var _b = _a, {
    className,
    children,
    icon
  } = _b, others = __objRest$P(_b, ["className", "children", "icon"]);
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
  } = useStyles$18({
    spacing,
    center
  }, {
    classNames,
    styles,
    unstyled,
    name: "List"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1h({
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
var __defProp$1g = Object.defineProperty;
var __defProps$E = Object.defineProperties;
var __getOwnPropDescs$E = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1g = Object.getOwnPropertySymbols;
var __hasOwnProp$1g = Object.prototype.hasOwnProperty;
var __propIsEnum$1g = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1g = (obj, key, value) => key in obj ? __defProp$1g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$E = (a, b) => __defProps$E(a, __getOwnPropDescs$E(b));
var useStyles$15 = createStyles((theme, { withPadding, size, listStyleType }) => ({
  root: __spreadProps$E(__spreadValues$1g({}, theme.fn.fontStyles()), {
    listStyleType,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    lineHeight: theme.lineHeight,
    margin: 0,
    paddingLeft: withPadding ? theme.spacing.xl : 0,
    listStylePosition: "inside"
  })
}));
const useStyles$16 = useStyles$15;
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
const defaultProps$s = {
  type: "unordered",
  size: "md",
  spacing: 0
};
const List = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("List", defaultProps$s, props), {
    children,
    type,
    size,
    listStyleType,
    withPadding,
    center,
    spacing,
    icon,
    className,
    styles,
    classNames,
    unstyled
  } = _a, others = __objRest$O(_a, ["children", "type", "size", "listStyleType", "withPadding", "center", "spacing", "icon", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$16({
    withPadding,
    size,
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
        ...__spreadValues$1f({
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
var useStyles$13 = createStyles((theme, { smallerThan, largerThan, query, styles }) => {
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
const useStyles$14 = useStyles$13;
function MediaQuery(props) {
  var _a;
  const { children, smallerThan, largerThan, query, styles, className } = useComponentDefaultProps("MediaQuery", {}, props);
  const { classes, cx } = useStyles$14({ smallerThan, largerThan, query, styles }, { name: "MediaQuery" });
  const child = react.exports.Children.only(children);
  if (typeof child === "object" && child !== null && "props" in child) {
    return React.cloneElement(child, {
      className: cx(classes.media, (_a = child.props) == null ? void 0 : _a.className, className)
    });
  }
  return child;
}
MediaQuery.displayName = "@mantine/core/MediaQuery";
const sizes$8 = {
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
var useStyles$11 = createStyles((theme, { size, disabled, radius, readOnly }) => ({
  defaultValue: {
    display: "flex",
    alignItems: "center",
    backgroundColor: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3] : theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    color: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7] : theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    height: theme.fn.size({ size, sizes: sizes$8 }),
    paddingLeft: theme.fn.size({ size, sizes: theme.spacing }),
    paddingRight: disabled || readOnly ? theme.fn.size({ size, sizes: theme.spacing }) : 0,
    fontWeight: 500,
    fontSize: theme.fn.size({ size, sizes: fontSizes }),
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
    cursor: disabled ? "not-allowed" : "default",
    userSelect: "none",
    maxWidth: "calc(100% - 20px)"
  },
  defaultValueRemove: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    marginLeft: theme.fn.size({ size, sizes: theme.spacing }) / 6
  },
  defaultValueLabel: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}));
const useStyles$12 = useStyles$11;
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
var __objRest$N = (source, exclude) => {
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
    size,
    radius = "sm"
  } = _b, others = __objRest$N(_b, ["label", "classNames", "styles", "className", "onRemove", "disabled", "readOnly", "size", "radius"]);
  const {
    classes,
    cx
  } = useStyles$12({
    size,
    disabled,
    readOnly,
    radius
  }, {
    classNames,
    styles,
    name: "MultiSelect"
  });
  return /* @__PURE__ */ jsxs("div", {
    ...__spreadValues$1e({
      className: cx(classes.defaultValue, className)
    }, others),
    children: [/* @__PURE__ */ jsx("span", {
      className: classes.defaultValueLabel,
      children: label
    }), !disabled && !readOnly && /* @__PURE__ */ jsx(CloseButton, {
      "aria-hidden": true,
      onMouseDown: onRemove,
      size: buttonSizes[size],
      radius: 2,
      color: "blue",
      variant: "transparent",
      iconSize: buttonSizes[size] / 2,
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
var __objRest$M = (source, exclude) => {
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
const iconSizes$3 = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 28
};
function ChevronIcon(_a) {
  var _b = _a, {
    size,
    error,
    style
  } = _b, others = __objRest$M(_b, ["size", "error", "style"]);
  const theme = useMantineTheme();
  const _size = theme.fn.size({
    size,
    sizes: iconSizes$3
  });
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1d({
      width: _size,
      height: _size,
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: __spreadValues$1d({
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
  size,
  error,
  clearButtonTabIndex
}) {
  return shouldClear ? /* @__PURE__ */ jsx(CloseButton, {
    variant: "transparent",
    "aria-label": clearButtonLabel,
    onClick: onClear,
    size,
    tabIndex: clearButtonTabIndex
  }) : /* @__PURE__ */ jsx(ChevronIcon, {
    error,
    size
  });
}
SelectRightSection.displayName = "@mantine/core/SelectRightSection";
var __defProp$1c = Object.defineProperty;
var __defProps$D = Object.defineProperties;
var __getOwnPropDescs$D = Object.getOwnPropertyDescriptors;
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
var __spreadProps$D = (a, b) => __defProps$D(a, __getOwnPropDescs$D(b));
var __objRest$L = (source, exclude) => {
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
  } = _b, props = __objRest$L(_b, ["styles", "rightSection", "rightSectionWidth", "theme"]);
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
      ...__spreadValues$1c({}, props)
    }),
    styles: __spreadProps$D(__spreadValues$1c({}, _styles), {
      rightSection: __spreadProps$D(__spreadValues$1c({}, _styles == null ? void 0 : _styles.rightSection), {
        pointerEvents: props.shouldClear ? void 0 : "none"
      })
    })
  };
}
var __defProp$1b = Object.defineProperty;
var __defProps$C = Object.defineProperties;
var __getOwnPropDescs$C = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1b = Object.getOwnPropertySymbols;
var __hasOwnProp$1b = Object.prototype.hasOwnProperty;
var __propIsEnum$1b = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1b = (obj, key, value) => key in obj ? __defProp$1b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$C = (a, b) => __defProps$C(a, __getOwnPropDescs$C(b));
var useStyles$$ = createStyles((theme, { size, invalid }) => ({
  wrapper: {
    position: "relative"
  },
  values: {
    minHeight: theme.fn.size({ size, sizes: sizes$f }) - 2,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: -theme.spacing.xs / 2,
    boxSizing: "border-box"
  },
  value: {
    margin: `${theme.spacing.xs / 2 - 2}px ${theme.spacing.xs / 2}px`
  },
  searchInput: __spreadProps$C(__spreadValues$1b({}, theme.fn.fontStyles()), {
    flex: 1,
    minWidth: 60,
    backgroundColor: "transparent",
    border: 0,
    outline: 0,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    padding: 0,
    marginLeft: theme.spacing.xs / 2,
    appearance: "none",
    color: "inherit",
    lineHeight: `${theme.fn.size({ size, sizes: sizes$f }) - 2}px`,
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
const useStyles$10 = useStyles$$;
var __defProp$1a = Object.defineProperty;
var __defProps$B = Object.defineProperties;
var __getOwnPropDescs$B = Object.getOwnPropertyDescriptors;
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
var __spreadProps$B = (a, b) => __defProps$B(a, __getOwnPropDescs$B(b));
var __objRest$K = (source, exclude) => {
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
const defaultProps$r = {
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
  const _a = useComponentDefaultProps("MultiSelect", defaultProps$r, props), {
    className,
    style,
    required,
    label,
    description,
    size,
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
  } = _a, others = __objRest$K(_a, ["className", "style", "required", "label", "description", "size", "error", "classNames", "styles", "wrapperProps", "value", "defaultValue", "data", "onChange", "valueComponent", "itemComponent", "id", "transition", "transitionDuration", "transitionTimingFunction", "maxDropdownHeight", "shadow", "nothingFound", "onFocus", "onBlur", "searchable", "placeholder", "filter", "limit", "clearSearchOnChange", "clearable", "clearSearchOnBlur", "clearButtonLabel", "variant", "onSearchChange", "disabled", "initiallyOpened", "radius", "icon", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "onCreate", "sx", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "maxSelectedValues", "withinPortal", "switchDirectionOnFlip", "zIndex", "selectOnBlur", "name", "dropdownPosition", "errorProps", "labelProps", "descriptionProps", "clearButtonTabIndex", "form", "positionDependencies", "onKeyDown", "unstyled", "inputContainer", "inputWrapperOrder", "readOnly", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$10({
    size,
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
  const sortedData = groupOptions({
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
  const getNextIndex = (index2, nextItem, compareFn) => {
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
        const nextIndex = getNextIndex(current, (index2) => index2 + 1, (index2) => index2 < filteredData.length - 1);
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
        const nextIndex = getNextIndex(current, (index2) => index2 - 1, (index2) => index2 > 0);
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
    ...__spreadProps$B(__spreadValues$1a({}, item), {
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
      size,
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
    ...__spreadValues$1a(__spreadValues$1a({
      required,
      id: uuid2,
      label,
      error,
      description,
      size,
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
            ...__spreadValues$1a({
              __staticSelector: "MultiSelect",
              style: {
                overflow: "hidden"
              },
              component: "div",
              multiline: true,
              size,
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
              classNames: __spreadProps$B(__spreadValues$1a({}, classNames), {
                input: cx({
                  [classes.input]: !searchable
                }, classNames == null ? void 0 : classNames.input)
              })
            }, getSelectRightSectionProps({
              theme,
              rightSection,
              rightSectionWidth,
              styles,
              size,
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
                ...__spreadValues$1a({
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
          size,
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
var __defProp$19 = Object.defineProperty;
var __defProps$A = Object.defineProperties;
var __getOwnPropDescs$A = Object.getOwnPropertyDescriptors;
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
var __spreadProps$A = (a, b) => __defProps$A(a, __getOwnPropDescs$A(b));
var __objRest$J = (source, exclude) => {
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
const defaultProps$q = {
  size: "sm"
};
const NativeSelect = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("NativeSelect", defaultProps$q, props), {
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
  } = _a, others = __objRest$J(_a, ["inputProps", "wrapperProps", "data", "placeholder", "onChange", "value", "classNames", "styles", "rightSection", "rightSectionWidth"]);
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
    ...__spreadProps$A(__spreadValues$19({}, wrapperProps), {
      __staticSelector: "NativeSelect"
    }),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadValues$19(__spreadProps$A(__spreadValues$19(__spreadValues$19({}, inputProps), others), {
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
  size
}) {
  return /* @__PURE__ */ jsx("svg", {
    style: {
      transform: direction === "up" ? "rotate(180deg)" : void 0
    },
    width: size,
    height: size,
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
var useStyles$Z = createStyles((theme, { radius, size }) => ({
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
    width: theme.fn.size({ size, sizes: CONTROL_SIZES }),
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
const useStyles$_ = useStyles$Z;
var __defProp$18 = Object.defineProperty;
var __defProps$z = Object.defineProperties;
var __getOwnPropDescs$z = Object.getOwnPropertyDescriptors;
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
var __spreadProps$z = (a, b) => __defProps$z(a, __getOwnPropDescs$z(b));
var __objRest$I = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$18.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$18)
    for (var prop of __getOwnPropSymbols$18(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$18.call(source, prop))
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
const defaultProps$p = {
  step: 1,
  hideControls: false,
  size: "sm",
  precision: 0,
  noClampOnBlur: false,
  formatter: defaultFormatter,
  parser: defaultParser
};
const NumberInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NumberInput", defaultProps$p, props), {
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
    size,
    rightSection,
    rightSectionWidth,
    formatter,
    parser,
    inputMode,
    unstyled
  } = _a, others = __objRest$I(_a, ["disabled", "value", "onChange", "decimalSeparator", "min", "max", "startValue", "step", "stepHoldInterval", "stepHoldDelay", "onBlur", "onFocus", "onKeyDown", "onKeyUp", "hideControls", "radius", "variant", "precision", "defaultValue", "noClampOnBlur", "handlersRef", "classNames", "styles", "size", "rightSection", "rightSectionWidth", "formatter", "parser", "inputMode", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$_({
    radius,
    size
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
          size,
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
          size,
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
    ...__spreadProps$z(__spreadValues$18({}, others), {
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
        size,
        sizes: CONTROL_SIZES
      }) + 1,
      radius,
      max,
      min,
      step,
      size,
      styles,
      classNames,
      inputMode: inputMode || getInputMode(step, precision, useOs()),
      __staticSelector: "NumberInput",
      unstyled
    })
  });
});
NumberInput.displayName = "@mantine/core/NumberInput";
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
function DotsIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$17({
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
function NextIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$16({
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
function PrevIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$15({
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
function FirstIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$14({
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
function LastIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$13({
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
var __defProp$12 = Object.defineProperty;
var __getOwnPropSymbols$12 = Object.getOwnPropertySymbols;
var __hasOwnProp$12 = Object.prototype.hasOwnProperty;
var __propIsEnum$12 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$12 = (obj, key, value) => key in obj ? __defProp$12(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$H = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$12.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$12)
    for (var prop of __getOwnPropSymbols$12(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$12.call(source, prop))
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
  } = _b, others = __objRest$H(_b, ["page", "active", "onClick"]);
  const theme = useMantineTheme();
  const Item = (theme.dir === "rtl" ? rtlIcons : icons$1)[page];
  const children = Item ? /* @__PURE__ */ jsx(Item, {}) : page;
  return /* @__PURE__ */ jsx("button", {
    ...__spreadValues$12({
      type: "button",
      onClick
    }, others),
    children
  });
}
DefaultItem$1.displayName = "@mantine/core/Pagination/DefaultItem";
var __defProp$11 = Object.defineProperty;
var __defProps$y = Object.defineProperties;
var __getOwnPropDescs$y = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$11 = Object.getOwnPropertySymbols;
var __hasOwnProp$11 = Object.prototype.hasOwnProperty;
var __propIsEnum$11 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$11 = (obj, key, value) => key in obj ? __defProp$11(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$y = (a, b) => __defProps$y(a, __getOwnPropDescs$y(b));
const sizes$7 = {
  xs: 22,
  sm: 26,
  md: 32,
  lg: 38,
  xl: 44
};
var useStyles$X = createStyles((theme, { size, radius, color }) => {
  const colors = theme.fn.variant({ color, variant: "filled" });
  return {
    item: __spreadProps$y(__spreadValues$11({}, theme.fn.focusStyles()), {
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size, sizes: sizes$7 }),
      minWidth: theme.fn.size({ size, sizes: sizes$7 }),
      padding: `0 ${theme.fn.size({ size, sizes: theme.spacing }) / 2}px`,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
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
const useStyles$Y = useStyles$X;
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
const defaultProps$o = {
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
  const _a = useComponentDefaultProps("Pagination", defaultProps$o, props), {
    itemComponent: Item,
    classNames,
    styles,
    page,
    initialPage,
    color,
    total,
    siblings,
    boundaries,
    size,
    radius,
    onChange,
    getItemAriaLabel,
    spacing,
    withEdges,
    withControls,
    sx,
    unstyled
  } = _a, others = __objRest$G(_a, ["itemComponent", "classNames", "styles", "page", "initialPage", "color", "total", "siblings", "boundaries", "size", "radius", "onChange", "getItemAriaLabel", "spacing", "withEdges", "withControls", "sx", "unstyled"]);
  const {
    classes,
    theme
  } = useStyles$Y({
    color,
    size,
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
    ...__spreadValues$10({
      role: "navigation",
      spacing: spacing || theme.fn.size({
        size,
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
function RadioIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$$({
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
var __defProp$_ = Object.defineProperty;
var __getOwnPropSymbols$_ = Object.getOwnPropertySymbols;
var __hasOwnProp$_ = Object.prototype.hasOwnProperty;
var __propIsEnum$_ = Object.prototype.propertyIsEnumerable;
var __defNormalProp$_ = (obj, key, value) => key in obj ? __defProp$_(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$F = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$_.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$_)
    for (var prop of __getOwnPropSymbols$_(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$_.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$n = {
  orientation: "horizontal",
  spacing: "lg",
  offset: "xs",
  size: "sm"
};
const RadioGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RadioGroup", defaultProps$n, props), {
    children,
    value,
    defaultValue,
    onChange,
    orientation,
    spacing,
    size,
    wrapperProps,
    unstyled,
    offset
  } = _a, others = __objRest$F(_a, ["children", "value", "defaultValue", "onChange", "orientation", "spacing", "size", "wrapperProps", "unstyled", "offset"]);
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
      size
    },
    children: /* @__PURE__ */ jsx(Input.Wrapper, {
      ...__spreadValues$_(__spreadValues$_({
        labelElement: "div",
        size,
        __staticSelector: "RadioGroup",
        ref,
        unstyled
      }, wrapperProps), others),
      children: /* @__PURE__ */ jsx(InputsGroup, {
        spacing,
        orientation,
        unstyled,
        role: "radiogroup",
        offset,
        children
      })
    })
  });
});
RadioGroup.displayName = "@mantine/core/RadioGroup";
var __defProp$Z = Object.defineProperty;
var __defProps$x = Object.defineProperties;
var __getOwnPropDescs$x = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$Z = Object.getOwnPropertySymbols;
var __hasOwnProp$Z = Object.prototype.hasOwnProperty;
var __propIsEnum$Z = Object.prototype.propertyIsEnumerable;
var __defNormalProp$Z = (obj, key, value) => key in obj ? __defProp$Z(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$x = (a, b) => __defProps$x(a, __getOwnPropDescs$x(b));
const sizes$6 = {
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
var useStyles$V = createStyles((theme, { size, color, transitionDuration }, getRef) => {
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
      width: theme.fn.size({ sizes: iconSizes$2, size }),
      height: theme.fn.size({ sizes: iconSizes$2, size }),
      position: "absolute",
      top: `calc(50% - ${theme.fn.size({ sizes: iconSizes$2, size }) / 2}px)`,
      left: `calc(50% - ${theme.fn.size({ sizes: iconSizes$2, size }) / 2}px)`
    },
    radio: __spreadProps$x(__spreadValues$Z({}, theme.fn.focusStyles()), {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      position: "relative",
      appearance: "none",
      width: theme.fn.size({ sizes: sizes$6, size }),
      height: theme.fn.size({ sizes: sizes$6, size }),
      borderRadius: theme.fn.size({ sizes: sizes$6, size }),
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
    label: __spreadProps$x(__spreadValues$Z({}, theme.fn.fontStyles()), {
      display: "flex",
      alignItems: "flex-start",
      fontSize: theme.fontSizes[size] || theme.fontSizes.md,
      lineHeight: `${theme.fn.size({ sizes: sizes$6, size })}px`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      paddingLeft: theme.spacing.sm,
      cursor: theme.cursorType,
      "&[data-disabled]": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      }
    })
  };
});
const useStyles$W = useStyles$V;
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
const defaultProps$m = {
  icon: RadioIcon,
  transitionDuration: 100,
  size: "sm"
};
const Radio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Radio", defaultProps$m, props), {
    className,
    style,
    id,
    label,
    size,
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
  } = _a, others = __objRest$E(_a, ["className", "style", "id", "label", "size", "title", "disabled", "color", "classNames", "styles", "sx", "icon", "transitionDuration", "wrapperProps", "unstyled"]);
  const ctx = useRadioGroupContext();
  const {
    classes,
    cx
  } = useStyles$W({
    color,
    size: (ctx == null ? void 0 : ctx.size) || size,
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
    ...__spreadValues$Y(__spreadValues$Y({
      className: cx(classes.radioWrapper, className),
      style,
      title,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsxs("div", {
      className: classes.inner,
      children: [/* @__PURE__ */ jsx("input", {
        ...__spreadValues$Y(__spreadValues$Y({
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
function getCurveProps({ size, thickness, sum, value, root, offset }) {
  const radius = (size * 0.9 - thickness * 2) / 2;
  const deg = Math.PI * radius * 2 / 100;
  const strokeDasharray = root ? `${(100 - sum) * deg}, ${sum * deg}` : `${value * deg}, ${(100 - value) * deg}`;
  return {
    strokeWidth: thickness,
    cx: size / 2,
    cy: size / 2,
    r: radius,
    transform: root ? `scale(1, -1) translate(0, -${size})` : null,
    strokeDasharray,
    strokeDashoffset: root ? 0 : offset
  };
}
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
function Curve({
  size,
  value,
  offset,
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
      ...__spreadValues$X({
        fill: "none",
        strokeLinecap: lineRoundCaps ? "round" : "butt",
        stroke
      }, getCurveProps({
        sum,
        size,
        thickness,
        value,
        offset,
        root
      }))
    })
  });
}
Curve.displayName = "@mantine/core/Curve";
var __defProp$W = Object.defineProperty;
var __defProps$w = Object.defineProperties;
var __getOwnPropDescs$w = Object.getOwnPropertyDescriptors;
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
var __spreadProps$w = (a, b) => __defProps$w(a, __getOwnPropDescs$w(b));
function getCurves({ size, thickness, sections, renderRoundedLineCaps }) {
  const sum = sections.reduce((acc, current) => acc + current.value, 0);
  const accumulated = Math.PI * ((size * 0.9 - thickness * 2) / 2) * 2;
  let offset = accumulated;
  const curves = [];
  const curvesInOrder = [];
  for (let i = 0; i < sections.length; i += 1) {
    curves.push({ sum, offset, data: sections[i], root: false });
    offset -= sections[i].value / 100 * accumulated;
  }
  curves.push({ sum, offset, data: null, root: true });
  curvesInOrder.push(__spreadProps$w(__spreadValues$W({}, curves[curves.length - 1]), { lineRoundCaps: false }));
  if (curves.length > 2) {
    curvesInOrder.push(__spreadProps$w(__spreadValues$W({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
    curvesInOrder.push(__spreadProps$w(__spreadValues$W({}, curves[curves.length - 2]), { lineRoundCaps: renderRoundedLineCaps }));
    for (let i = 1; i <= curves.length - 3; i += 1) {
      curvesInOrder.push(__spreadProps$w(__spreadValues$W({}, curves[i]), { lineRoundCaps: false }));
    }
  } else {
    curvesInOrder.push(__spreadProps$w(__spreadValues$W({}, curves[0]), { lineRoundCaps: renderRoundedLineCaps }));
  }
  return curvesInOrder;
}
var useStyles$T = createStyles({
  root: {
    position: "relative"
  },
  label: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)"
  }
});
const useStyles$U = useStyles$T;
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
var __objRest$D = (source, exclude) => {
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
const defaultProps$l = {
  size: 120,
  thickness: 12
};
const RingProgress = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RingProgress", defaultProps$l, props), {
    className,
    style,
    label,
    sections,
    size,
    thickness,
    classNames,
    styles,
    roundCaps,
    unstyled
  } = _a, others = __objRest$D(_a, ["className", "style", "label", "sections", "size", "thickness", "classNames", "styles", "roundCaps", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$U(null, {
    classNames,
    styles,
    unstyled,
    name: "RingProgress"
  });
  const curves = getCurves({
    size,
    thickness,
    sections,
    renderRoundedLineCaps: roundCaps
  }).map((curve, index2) => {
    var _a2, _b, _c;
    return /* @__PURE__ */ jsx(Curve, {
      value: (_a2 = curve.data) == null ? void 0 : _a2.value,
      size,
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
    ...__spreadValues$V({
      style: __spreadValues$V({
        width: size,
        height: size
      }, style),
      className: cx(classes.root, className),
      ref
    }, others),
    children: [/* @__PURE__ */ jsx("svg", {
      width: size,
      height: size,
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
var __defProp$U = Object.defineProperty;
var __defProps$v = Object.defineProperties;
var __getOwnPropDescs$v = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$U = Object.getOwnPropertySymbols;
var __hasOwnProp$U = Object.prototype.hasOwnProperty;
var __propIsEnum$U = Object.prototype.propertyIsEnumerable;
var __defNormalProp$U = (obj, key, value) => key in obj ? __defProp$U(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$v = (a, b) => __defProps$v(a, __getOwnPropDescs$v(b));
const WRAPPER_PADDING = 4;
const sizes$5 = {
  xs: "3px 6px",
  sm: "5px 10px",
  md: "7px 14px",
  lg: "9px 16px",
  xl: "12px 20px"
};
var useStyles$R = createStyles((theme, {
  fullWidth,
  color,
  radius,
  shouldAnimate,
  transitionDuration,
  transitionTimingFunction,
  size,
  orientation
}, getRef) => {
  const vertical = orientation === "vertical";
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    label: __spreadProps$v(__spreadValues$U(__spreadValues$U({
      ref: getRef("label")
    }, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      borderRadius: theme.fn.radius(radius),
      fontWeight: 500,
      fontSize: size in theme.fontSizes ? theme.fontSizes[size] : theme.fontSizes.sm,
      cursor: "pointer",
      display: "block",
      textAlign: "center",
      padding: sizes$5[size in sizes$5 ? size : "sm"],
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
const useStyles$S = useStyles$R;
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
var __objRest$C = (source, exclude) => {
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
const defaultProps$k = {
  disabled: false,
  size: "sm",
  transitionDuration: 200
};
const SegmentedControl = react.exports.forwardRef((props, ref) => {
  var _b, _c;
  const _a = useComponentDefaultProps("SegmentedControl", defaultProps$k, props), {
    className,
    disabled,
    data: _data,
    name,
    value,
    onChange,
    color,
    fullWidth,
    radius,
    size,
    transitionDuration,
    transitionTimingFunction,
    classNames,
    styles,
    defaultValue,
    orientation,
    unstyled
  } = _a, others = __objRest$C(_a, ["className", "disabled", "data", "name", "value", "onChange", "color", "fullWidth", "radius", "size", "transitionDuration", "transitionTimingFunction", "classNames", "styles", "defaultValue", "orientation", "unstyled"]);
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
  } = useStyles$S({
    size,
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
  useIsomorphicEffect(() => {
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
    ...__spreadValues$T({
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
var useStyles$P = createStyles(() => ({
  input: {
    "&:not(:disabled)": {
      cursor: "pointer",
      "&::selection": {
        backgroundColor: "transparent"
      }
    }
  }
}));
const useStyles$Q = useStyles$P;
var __defProp$S = Object.defineProperty;
var __defProps$u = Object.defineProperties;
var __getOwnPropDescs$u = Object.getOwnPropertyDescriptors;
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
var __spreadProps$u = (a, b) => __defProps$u(a, __getOwnPropDescs$u(b));
var __objRest$B = (source, exclude) => {
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
function defaultFilter$1(value, item) {
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}
function defaultShouldCreate(query, data) {
  return !!query && !data.some((item) => item.label.toLowerCase() === query.toLowerCase());
}
const defaultProps$j = {
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
  const _a = useInputProps("Select", defaultProps$j, props), {
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
  } = _a, others = __objRest$B(_a, ["inputProps", "wrapperProps", "shadow", "data", "value", "defaultValue", "onChange", "itemComponent", "onKeyDown", "onBlur", "onFocus", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "unstyled", "classNames", "styles", "filter", "maxDropdownHeight", "searchable", "clearable", "nothingFound", "clearButtonLabel", "limit", "disabled", "onSearchChange", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "selectOnBlur", "onCreate", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "name", "dropdownPosition", "allowDeselect", "placeholder", "filterDataOnExactSearchMatch", "clearButtonTabIndex", "form", "positionDependencies", "readOnly"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$Q();
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
  const getNextIndex = (index2, nextItem, compareFn) => {
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
      const nextIndex = getNextIndex(current, (index2) => index2 - 1, (index2) => index2 > 0);
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
      const nextIndex = getNextIndex(current, (index2) => index2 + 1, (index2) => index2 < filteredData.length - 1);
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
    ...__spreadProps$u(__spreadValues$S({}, wrapperProps), {
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
            ...__spreadValues$S(__spreadProps$u(__spreadValues$S(__spreadValues$S({
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
              classNames: __spreadProps$u(__spreadValues$S({}, classNames), {
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
var useStyles$N = createStyles((theme, { spacing, breakpoints, cols }) => {
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
    root: __spreadValues$R({
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: theme.fn.size({ size: spacing, sizes: theme.spacing })
    }, gridBreakpoints)
  };
});
const useStyles$O = useStyles$N;
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
var __objRest$A = (source, exclude) => {
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
const defaultProps$i = {
  breakpoints: [],
  cols: 1,
  spacing: "md"
};
const SimpleGrid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("SimpleGrid", defaultProps$i, props), {
    className,
    breakpoints,
    cols,
    spacing,
    children,
    unstyled
  } = _a, others = __objRest$A(_a, ["className", "breakpoints", "cols", "spacing", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$O({
    breakpoints,
    cols,
    spacing
  }, {
    unstyled,
    name: "SimpleGrid"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$Q({
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
var useStyles$L = createStyles((theme, { height, width, radius, circle, animate }) => ({
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
const useStyles$M = useStyles$L;
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
var __objRest$z = (source, exclude) => {
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
  height: "auto",
  width: "100%",
  visible: true,
  animate: true
};
const Skeleton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Skeleton", defaultProps$h, props), {
    height,
    width,
    visible,
    animate,
    className,
    circle,
    radius,
    unstyled
  } = _a, others = __objRest$z(_a, ["height", "width", "visible", "animate", "className", "circle", "radius", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$M({
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
    ...__spreadValues$P({
      className: cx(classes.root, {
        [classes.visible]: visible
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
var __defProp$O = Object.defineProperty;
var __defProps$t = Object.defineProperties;
var __getOwnPropDescs$t = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$O = Object.getOwnPropertySymbols;
var __hasOwnProp$O = Object.prototype.hasOwnProperty;
var __propIsEnum$O = Object.prototype.propertyIsEnumerable;
var __defNormalProp$O = (obj, key, value) => key in obj ? __defProp$O(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$t = (a, b) => __defProps$t(a, __getOwnPropDescs$t(b));
const sizes$4 = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12
};
var useStyles$J = createStyles((theme, { size, disabled }) => ({
  root: __spreadProps$t(__spreadValues$O({}, theme.fn.fontStyles()), {
    WebkitTapHighlightColor: "transparent",
    outline: 0,
    height: theme.fn.size({ sizes: sizes$4, size }) * 2,
    display: "flex",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none"
  })
}));
const useStyles$K = useStyles$J;
var __defProp$N = Object.defineProperty;
var __defProps$s = Object.defineProperties;
var __getOwnPropDescs$s = Object.getOwnPropertyDescriptors;
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
var __spreadProps$s = (a, b) => __defProps$s(a, __getOwnPropDescs$s(b));
var useStyles$H = createStyles((theme, { color, size, disabled, thumbSize }) => ({
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
  thumb: __spreadProps$s(__spreadValues$N({}, theme.fn.focusStyles()), {
    boxSizing: "border-box",
    position: "absolute",
    display: disabled ? "none" : "flex",
    height: thumbSize || theme.fn.size({ sizes: sizes$4, size }) * 2,
    width: thumbSize || theme.fn.size({ sizes: sizes$4, size }) * 2,
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
const useStyles$I = useStyles$H;
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
  size,
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
  } = useStyles$I({
    color,
    size,
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
    children: [children, /* @__PURE__ */ jsx(Transition, {
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
function isMarkFilled({ mark, offset, value }) {
  return typeof offset === "number" ? mark.value >= offset && mark.value <= value : mark.value <= value;
}
var useStyles$F = createStyles((theme, { size, color, disabled }) => ({
  markWrapper: {
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  mark: {
    boxSizing: "border-box",
    border: `${theme.fn.size({ size, sizes: sizes$4 }) >= 8 ? "2px" : "1px"} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    height: theme.fn.size({ sizes: sizes$4, size }),
    width: theme.fn.size({ sizes: sizes$4, size }),
    borderRadius: 1e3,
    transform: `translateX(-${theme.fn.size({ sizes: sizes$4, size }) / 2}px)`,
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
const useStyles$G = useStyles$F;
function Marks({
  marks,
  color,
  size,
  min,
  max,
  value,
  classNames,
  styles,
  offset,
  onChange,
  disabled,
  unstyled
}) {
  const {
    classes,
    cx
  } = useStyles$G({
    size,
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
          offset
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
var useStyles$D = createStyles((theme, { radius, size, color, disabled }) => ({
  track: {
    position: "relative",
    height: theme.fn.size({ sizes: sizes$4, size }),
    width: "100%",
    marginRight: theme.fn.size({ size, sizes: sizes$4 }),
    marginLeft: theme.fn.size({ size, sizes: sizes$4 }),
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      right: -theme.fn.size({ size, sizes: sizes$4 }),
      left: -theme.fn.size({ size, sizes: sizes$4 }),
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
const useStyles$E = useStyles$D;
var __defProp$M = Object.defineProperty;
var __defProps$r = Object.defineProperties;
var __getOwnPropDescs$r = Object.getOwnPropertyDescriptors;
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
var __spreadProps$r = (a, b) => __defProps$r(a, __getOwnPropDescs$r(b));
var __objRest$y = (source, exclude) => {
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
function Track(_a) {
  var _b = _a, {
    filled,
    size,
    color,
    classNames,
    styles,
    radius,
    children,
    offset,
    onMouseLeave,
    onMouseEnter,
    disabled,
    marksOffset,
    unstyled
  } = _b, others = __objRest$y(_b, ["filled", "size", "color", "classNames", "styles", "radius", "children", "offset", "onMouseLeave", "onMouseEnter", "disabled", "marksOffset", "unstyled"]);
  const {
    classes
  } = useStyles$E({
    color,
    size,
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
        left: `calc(${offset}% - ${theme.fn.size({
          size,
          sizes: sizes$4
        })}px)`,
        width: `calc(${filled}% + ${theme.fn.size({
          size,
          sizes: sizes$4
        })}px)`
      })
    }), children, /* @__PURE__ */ jsx(Marks, {
      ...__spreadProps$r(__spreadValues$M({}, others), {
        size,
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
var __defProp$L = Object.defineProperty;
var __defProps$q = Object.defineProperties;
var __getOwnPropDescs$q = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$L = Object.getOwnPropertySymbols;
var __hasOwnProp$L = Object.prototype.hasOwnProperty;
var __propIsEnum$L = Object.prototype.propertyIsEnumerable;
var __defNormalProp$L = (obj, key, value) => key in obj ? __defProp$L(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$q = (a, b) => __defProps$q(a, __getOwnPropDescs$q(b));
var __objRest$x = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$L.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$L)
    for (var prop of __getOwnPropSymbols$L(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$L.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const SliderRoot = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    size,
    classNames,
    styles,
    disabled,
    unstyled
  } = _b, others = __objRest$x(_b, ["className", "size", "classNames", "styles", "disabled", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$K({
    size,
    disabled
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$q(__spreadValues$L({}, others), {
      tabIndex: -1,
      className: cx(classes.root, className),
      ref
    })
  });
});
SliderRoot.displayName = "@mantine/core/SliderRoot";
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
var __objRest$w = (source, exclude) => {
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
const defaultProps$g = {
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
  const _a = useComponentDefaultProps("Slider", defaultProps$g, props), {
    classNames,
    styles,
    color,
    value,
    onChange,
    onChangeEnd,
    size,
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
  } = _a, others = __objRest$w(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
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
    ...__spreadProps$p(__spreadValues$K({}, others), {
      size,
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
      size,
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
        size,
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
var __objRest$v = (source, exclude) => {
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
const defaultProps$f = {
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
  const _a = useComponentDefaultProps("RangeSlider", defaultProps$f, props), {
    classNames,
    styles,
    color,
    value,
    onChange,
    onChangeEnd,
    size,
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
  } = _a, others = __objRest$v(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "minRange", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbFromLabel", "thumbToLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
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
    size,
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
    ...__spreadProps$o(__spreadValues$J({}, others), {
      size,
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
      size,
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
        ...__spreadProps$o(__spreadValues$J({}, sharedThumbProps), {
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
        ...__spreadProps$o(__spreadValues$J({}, sharedThumbProps), {
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
var __objRest$u = (source, exclude) => {
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
  w: 0,
  h: 0
};
const Space = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Space", defaultProps$e, props), {
    w,
    h,
    sx
  } = _a, others = __objRest$u(_a, ["w", "h", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$I({
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
var useStyles$B = createStyles((theme, { transitionDuration }) => ({
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
const useStyles$C = useStyles$B;
var __defProp$H = Object.defineProperty;
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
const defaultProps$d = {
  maxHeight: 100,
  transitionDuration: 200,
  initialState: false
};
const Spoiler = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Spoiler", defaultProps$d, props), {
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
  } = _a, others = __objRest$t(_a, ["className", "children", "maxHeight", "hideLabel", "showLabel", "transitionDuration", "controlRef", "initialState", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$C({
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
    ...__spreadValues$H({
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
var __defProp$G = Object.defineProperty;
var __defProps$n = Object.defineProperties;
var __getOwnPropDescs$n = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$G = Object.getOwnPropertySymbols;
var __hasOwnProp$G = Object.prototype.hasOwnProperty;
var __propIsEnum$G = Object.prototype.propertyIsEnumerable;
var __defNormalProp$G = (obj, key, value) => key in obj ? __defProp$G(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$n = (a, b) => __defProps$n(a, __getOwnPropDescs$n(b));
const iconSizes$1 = {
  xs: 34,
  sm: 36,
  md: 42,
  lg: 48,
  xl: 52
};
var useStyles$z = createStyles((theme, { color, iconSize, size, radius, allowStepClick, iconPosition, orientation }) => {
  const _iconSize = iconSize || theme.fn.size({ size, sizes: iconSizes$1 });
  const iconMargin = size === "xl" || size === "lg" ? theme.spacing.md : theme.spacing.sm;
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
    step: __spreadValues$G({
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
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      "&[data-progress]": {
        borderColor: colors.background
      },
      "&[data-completed]": {
        backgroundColor: colors.background,
        borderColor: colors.background,
        color: theme.white
      }
    },
    stepCompletedIcon: __spreadProps$n(__spreadValues$G({}, theme.fn.cover()), {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.white
    }),
    stepBody: __spreadValues$G({
      display: "flex",
      flexDirection: "column",
      marginLeft: iconPosition === "left" ? iconMargin : void 0,
      marginRight: iconPosition === "right" ? iconMargin : void 0
    }, orientation === "vertical" ? {
      marginTop: _iconSize > theme.fn.size({ size, sizes: theme.fontSizes }) * 4 ? _iconSize / 4 : _iconSize / 12
    } : null),
    stepLabel: {
      textAlign: iconPosition,
      fontWeight: 500,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      lineHeight: 1
    },
    stepDescription: {
      textAlign: iconPosition,
      marginTop: theme.fn.size({ size, sizes: theme.spacing }) / 3,
      marginBottom: theme.fn.size({ size, sizes: theme.spacing }) / 3,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }) - 2,
      lineHeight: 1
    }
  };
});
const useStyles$A = useStyles$z;
var __defProp$F = Object.defineProperty;
var __getOwnPropSymbols$F = Object.getOwnPropertySymbols;
var __hasOwnProp$F = Object.prototype.hasOwnProperty;
var __propIsEnum$F = Object.prototype.propertyIsEnumerable;
var __defNormalProp$F = (obj, key, value) => key in obj ? __defProp$F(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$s = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$F.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$F)
    for (var prop of __getOwnPropSymbols$F(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$F.call(source, prop))
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
    size = "md",
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
  } = _b, others = __objRest$s(_b, ["className", "state", "color", "icon", "completedIcon", "progressIcon", "label", "description", "withIcon", "iconSize", "size", "radius", "loading", "allowStepClick", "allowStepSelect", "iconPosition", "__staticSelector", "classNames", "styles", "unstyled", "orientation"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$A({
    color,
    iconSize,
    size,
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
    size,
    sizes: defaultIconSizes
  });
  const _icon = state === "stepCompleted" ? null : state === "stepProgress" ? progressIcon : icon;
  const dataAttributes = {
    "data-progress": state === "stepProgress" || void 0,
    "data-completed": state === "stepCompleted" || void 0
  };
  return /* @__PURE__ */ jsxs(UnstyledButton, {
    ...__spreadValues$F(__spreadValues$F({
      className: cx(classes.step, className),
      tabIndex: allowStepClick ? 0 : -1,
      ref
    }, dataAttributes), others),
    children: [withIcon && /* @__PURE__ */ jsxs("div", {
      className: classes.stepWrapper,
      children: [/* @__PURE__ */ jsxs("div", {
        ...__spreadValues$F({
          className: classes.stepIcon
        }, dataAttributes),
        children: [/* @__PURE__ */ jsx(Transition, {
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
var __defProp$E = Object.defineProperty;
var __defProps$m = Object.defineProperties;
var __getOwnPropDescs$m = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$E = Object.getOwnPropertySymbols;
var __hasOwnProp$E = Object.prototype.hasOwnProperty;
var __propIsEnum$E = Object.prototype.propertyIsEnumerable;
var __defNormalProp$E = (obj, key, value) => key in obj ? __defProp$E(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$m = (a, b) => __defProps$m(a, __getOwnPropDescs$m(b));
var useStyles$x = createStyles((theme, {
  contentPadding,
  color,
  orientation,
  iconPosition,
  iconSize,
  size,
  breakpoint
}) => {
  const shouldBeResponsive = typeof breakpoint !== "undefined";
  const breakpointValue = theme.fn.size({ size: breakpoint, sizes: theme.breakpoints });
  const separatorOffset = typeof iconSize !== "undefined" ? iconSize / 2 - 1 : theme.fn.size({ size, sizes: iconSizes$1 }) / 2 - 1;
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
    steps: __spreadValues$E(__spreadValues$E({
      display: "flex",
      boxSizing: "border-box",
      alignItems: "center"
    }, orientation === "vertical" ? verticalOrientationStyles.steps : null), shouldBeResponsive ? responsiveStyles.steps : null),
    separator: __spreadValues$E(__spreadValues$E({
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
    content: __spreadProps$m(__spreadValues$E({}, theme.fn.fontStyles()), {
      paddingTop: theme.fn.size({ size: contentPadding, sizes: theme.spacing })
    })
  };
});
const useStyles$y = useStyles$x;
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
const defaultProps$c = {
  contentPadding: "md",
  size: "md",
  radius: "xl",
  orientation: "horizontal",
  iconPosition: "left"
};
const Stepper = react.exports.forwardRef((props, ref) => {
  var _b, _c, _d;
  const _a = useComponentDefaultProps("Stepper", defaultProps$c, props), {
    className,
    children,
    onStepClick,
    active,
    completedIcon,
    progressIcon,
    color,
    iconSize,
    contentPadding,
    size,
    radius,
    orientation,
    breakpoint,
    iconPosition,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$r(_a, ["className", "children", "onStepClick", "active", "completedIcon", "progressIcon", "color", "iconSize", "contentPadding", "size", "radius", "orientation", "breakpoint", "iconPosition", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$y({
    contentPadding,
    color,
    orientation,
    iconPosition,
    size,
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
      size,
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
    ...__spreadValues$D({
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
var __defProp$C = Object.defineProperty;
var __defProps$l = Object.defineProperties;
var __getOwnPropDescs$l = Object.getOwnPropertyDescriptors;
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
var __spreadProps$l = (a, b) => __defProps$l(a, __getOwnPropDescs$l(b));
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
var useStyles$v = createStyles((theme, { size, radius, color, offLabel, onLabel }) => {
  const handleSize = theme.fn.size({ size, sizes: handleSizes });
  const borderRadius = theme.fn.size({ size: radius, sizes: theme.radius });
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    root: {
      display: "flex",
      alignItems: "center"
    },
    input: __spreadProps$l(__spreadValues$C({}, theme.fn.focusStyles()), {
      overflow: "hidden",
      WebkitTapHighlightColor: "transparent",
      position: "relative",
      borderRadius,
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2],
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      height: theme.fn.size({ size, sizes: switchHeight }),
      width: theme.fn.size({ size, sizes: switchWidth }),
      minWidth: theme.fn.size({ size, sizes: switchWidth }),
      margin: 0,
      transitionProperty: "background-color, border-color",
      transitionTimingFunction: theme.transitionTimingFunction,
      transitionDuration: "150ms",
      boxSizing: "border-box",
      appearance: "none",
      display: "flex",
      alignItems: "center",
      fontSize: theme.fn.size({ size, sizes: labelFontSizes }),
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
        transform: `translateX(${size === "xs" ? 1 : 2}px)`,
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
          transform: `translateX(${theme.fn.size({ size, sizes: switchWidth }) - theme.fn.size({ size, sizes: handleSizes }) - (size === "xs" ? 3 : 4)}px)`,
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
    label: __spreadProps$l(__spreadValues$C({}, theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      fontFamily: theme.fontFamily,
      paddingLeft: theme.spacing.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      cursor: theme.cursorType
    })
  };
});
const useStyles$w = useStyles$v;
var __defProp$B = Object.defineProperty;
var __defProps$k = Object.defineProperties;
var __getOwnPropDescs$k = Object.getOwnPropertyDescriptors;
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
var __spreadProps$k = (a, b) => __defProps$k(a, __getOwnPropDescs$k(b));
var __objRest$q = (source, exclude) => {
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
const defaultProps$b = {
  offLabel: "",
  onLabel: "",
  size: "sm",
  radius: "xl"
};
const Switch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Switch", defaultProps$b, props), {
    className,
    color,
    label,
    offLabel,
    onLabel,
    id,
    style,
    size,
    radius,
    wrapperProps,
    children,
    unstyled,
    styles,
    classNames,
    sx
  } = _a, others = __objRest$q(_a, ["className", "color", "label", "offLabel", "onLabel", "id", "style", "size", "radius", "wrapperProps", "children", "unstyled", "styles", "classNames", "sx"]);
  const {
    classes,
    cx
  } = useStyles$w({
    size,
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
    ...__spreadValues$B(__spreadValues$B({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadProps$k(__spreadValues$B({}, rest), {
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
var __defProp$A = Object.defineProperty;
var __defProps$j = Object.defineProperties;
var __getOwnPropDescs$j = Object.getOwnPropertyDescriptors;
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
var __spreadProps$j = (a, b) => __defProps$j(a, __getOwnPropDescs$j(b));
var useStyles$t = createStyles((theme, { captionSide, horizontalSpacing, verticalSpacing, fontSize }) => ({
  root: __spreadProps$j(__spreadValues$A({}, theme.fn.fontStyles()), {
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
const useStyles$u = useStyles$t;
var __defProp$z = Object.defineProperty;
var __defProps$i = Object.defineProperties;
var __getOwnPropDescs$i = Object.getOwnPropertyDescriptors;
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
var __spreadProps$i = (a, b) => __defProps$i(a, __getOwnPropDescs$i(b));
var __objRest$p = (source, exclude) => {
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
const defaultProps$a = {
  striped: false,
  highlightOnHover: false,
  captionSide: "top",
  horizontalSpacing: "xs",
  fontSize: "sm",
  verticalSpacing: 7
};
const Table = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Table", defaultProps$a, props), {
    className,
    children,
    striped,
    highlightOnHover,
    captionSide,
    horizontalSpacing,
    verticalSpacing,
    fontSize,
    unstyled
  } = _a, others = __objRest$p(_a, ["className", "children", "striped", "highlightOnHover", "captionSide", "horizontalSpacing", "verticalSpacing", "fontSize", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$u({
    captionSide,
    verticalSpacing,
    horizontalSpacing,
    fontSize
  }, {
    unstyled,
    name: "Table"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$i(__spreadValues$z({}, others), {
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
var useStyles$r = createStyles((theme, params) => {
  const vertical = params.orientation === "vertical";
  return {
    tabsList: __spreadValues$y({
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      justifyContent: GROUP_POSITIONS[params.position],
      '& [role="tab"]': {
        flex: params.grow ? 1 : void 0
      }
    }, getVariantStyles$1(params, theme))
  };
});
const useStyles$s = useStyles$r;
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
var __objRest$o = (source, exclude) => {
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
const TabsList = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    grow = false,
    position = "left"
  } = _b, others = __objRest$o(_b, ["children", "className", "grow", "position"]);
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
  } = useStyles$s({
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
    ...__spreadProps$h(__spreadValues$x({}, others), {
      className: cx(classes.tabsList, className),
      ref,
      role: "tablist",
      "aria-orientation": orientation
    }),
    children
  });
});
TabsList.displayName = "@mantine/core/TabsList";
var useStyles$p = createStyles((_theme, { orientation }) => ({
  panel: {
    flex: orientation === "vertical" ? 1 : void 0
  }
}));
const useStyles$q = useStyles$p;
var __defProp$w = Object.defineProperty;
var __defProps$g = Object.defineProperties;
var __getOwnPropDescs$g = Object.getOwnPropertyDescriptors;
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
var __spreadProps$g = (a, b) => __defProps$g(a, __getOwnPropDescs$g(b));
var __objRest$n = (source, exclude) => {
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
const TabsPanel = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    children,
    sx,
    className
  } = _b, others = __objRest$n(_b, ["value", "children", "sx", "className"]);
  const ctx = useTabsContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$q({
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
    ...__spreadProps$g(__spreadValues$w({}, others), {
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
var __defProp$v = Object.defineProperty;
var __defProps$f = Object.defineProperties;
var __getOwnPropDescs$f = Object.getOwnPropertyDescriptors;
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
var __spreadProps$f = (a, b) => __defProps$f(a, __getOwnPropDescs$f(b));
function getVariantStyles(theme, { variant, orientation, color, radius, inverted }) {
  const vertical = orientation === "vertical";
  const filledScheme = theme.fn.variant({ color, variant: "filled" });
  const radiusValue = theme.fn.radius(radius);
  const borderRadius = orientation === "vertical" ? `${radiusValue}px 0 0 ${radiusValue}px` : inverted ? `0 0 ${radiusValue}px ${radiusValue}px` : `${radiusValue}px ${radiusValue}px 0 0`;
  if (variant === "default") {
    return __spreadProps$f(__spreadValues$v({
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: "2px solid transparent",
      [vertical ? "marginRight" : inverted ? "marginTop" : "marginBottom"]: -2,
      borderRadius
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    })), {
      "&[data-active]": __spreadValues$v({
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
    return __spreadProps$f(__spreadValues$v({
      borderRadius: theme.fn.radius(radius)
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$v({
        backgroundColor: filledScheme.background,
        color: theme.white
      }, theme.fn.hover({ backgroundColor: filledScheme.background }))
    });
  }
  return {};
}
var useStyles$n = createStyles((theme, params) => ({
  tabLabel: {},
  tab: __spreadValues$v({
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
    "&:disabled": __spreadValues$v({
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
const useStyles$o = useStyles$n;
var __defProp$u = Object.defineProperty;
var __defProps$e = Object.defineProperties;
var __getOwnPropDescs$e = Object.getOwnPropertyDescriptors;
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
var __spreadProps$e = (a, b) => __defProps$e(a, __getOwnPropDescs$e(b));
var __objRest$m = (source, exclude) => {
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
  } = _b, others = __objRest$m(_b, ["value", "children", "onKeyDown", "onClick", "className", "icon", "rightSection", "color"]);
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
  } = useStyles$o({
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
    ...__spreadProps$e(__spreadValues$u({}, others), {
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
var useStyles$l = createStyles((theme, { orientation }) => ({
  root: {
    display: orientation === "vertical" ? "flex" : void 0
  }
}));
const useStyles$m = useStyles$l;
var __defProp$t = Object.defineProperty;
var __defProps$d = Object.defineProperties;
var __getOwnPropDescs$d = Object.getOwnPropertyDescriptors;
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
var __spreadProps$d = (a, b) => __defProps$d(a, __getOwnPropDescs$d(b));
var __objRest$l = (source, exclude) => {
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
const defaultProps$9 = {
  orientation: "horizontal",
  loop: true,
  activateTabWithKeyboard: true,
  allowTabDeactivation: false,
  unstyled: false,
  inverted: false,
  variant: "default"
};
const Tabs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Tabs", defaultProps$9, props), {
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
  } = _a, others = __objRest$l(_a, ["defaultValue", "value", "orientation", "loop", "activateTabWithKeyboard", "allowTabDeactivation", "children", "id", "onTabChange", "variant", "color", "className", "unstyled", "classNames", "styles", "radius", "inverted", "keepMounted"]);
  const {
    classes,
    cx
  } = useStyles$m({
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
        ...__spreadProps$d(__spreadValues$t({}, others), {
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
var useStyles$j = createStyles((theme, { bulletSize, color, radius, align, lineVariant, lineWidth }) => {
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
const useStyles$k = useStyles$j;
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
var __objRest$k = (source, exclude) => {
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
  } = _b, others = __objRest$k(_b, ["className", "bullet", "title", "bulletSize", "radius", "lineWidth", "active", "lineActive", "classNames", "styles", "children", "color", "align", "lineVariant", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$k({
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
    ...__spreadValues$s({
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
const defaultProps$8 = {
  active: -1,
  radius: "xl",
  bulletSize: 20,
  align: "left",
  lineWidth: 4,
  reverseActive: false
};
const Timeline = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Timeline", defaultProps$8, props), {
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
  } = _a, others = __objRest$j(_a, ["children", "active", "color", "radius", "bulletSize", "align", "lineWidth", "classNames", "styles", "sx", "reverseActive", "unstyled"]);
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
  const offset = align === "left" ? {
    paddingLeft: bulletSize / 2 + lineWidth / 2
  } : {
    paddingRight: bulletSize / 2 + lineWidth / 2
  };
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$r({
      ref,
      sx: [offset, ...packSx(sx)]
    }, others),
    children: items
  });
});
Timeline.Item = TimelineItem;
Timeline.displayName = "@mantine/core/Timeline";
const ITEM_PADDING = 7;
var useStyles$h = createStyles((theme, { reversed, native, radius }) => ({
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
const useStyles$i = useStyles$h;
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
  } = useStyles$i({
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
  const sortedData = groupOptions({
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
  const handleDeselect = (listIndex, values) => setSelection((currentSelection) => {
    const clone = [...currentSelection];
    clone[listIndex] = currentSelection[listIndex].filter((item) => !values.includes(item));
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
var __defProp$q = Object.defineProperty;
var __defProps$c = Object.defineProperties;
var __getOwnPropDescs$c = Object.getOwnPropertyDescriptors;
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
var __spreadProps$c = (a, b) => __defProps$c(a, __getOwnPropDescs$c(b));
var __objRest$i = (source, exclude) => {
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
function defaultFilter(query, item) {
  return item.label.toLowerCase().trim().includes(query.toLowerCase().trim());
}
const defaultProps$7 = {
  itemComponent: DefaultItem,
  filter: defaultFilter,
  titles: [null, null],
  listHeight: 150,
  listComponent: SelectScrollArea,
  showTransferAll: true,
  limit: Infinity
};
const TransferList = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TransferList", defaultProps$7, props), {
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
  } = _a, others = __objRest$i(_a, ["value", "onChange", "itemComponent", "searchPlaceholder", "filter", "nothingFound", "titles", "initialSelection", "listHeight", "listComponent", "showTransferAll", "breakpoint", "radius", "classNames", "styles", "limit", "unstyled"]);
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
    ...__spreadValues$q({
      cols: 2,
      spacing: "xl",
      breakpoints,
      ref,
      unstyled
    }, others),
    children: [/* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$c(__spreadValues$q({}, sharedListProps), {
        data: value[0],
        selection: selection[0],
        onSelect: (val) => handlers.select(0, val),
        onMoveAll: () => handleMoveAll(0),
        onMove: () => handleMove(0),
        title: titles[0],
        unstyled
      })
    }), /* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$c(__spreadValues$q({}, sharedListProps), {
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
var __defProp$p = Object.defineProperty;
var __defProps$b = Object.defineProperties;
var __getOwnPropDescs$b = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$p = Object.getOwnPropertySymbols;
var __hasOwnProp$p = Object.prototype.hasOwnProperty;
var __propIsEnum$p = Object.prototype.propertyIsEnumerable;
var __defNormalProp$p = (obj, key, value) => key in obj ? __defProp$p(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var useStyles$f = createStyles((theme) => {
  const headings = keys(theme.headings.sizes).reduce((acc, h) => {
    const values = theme.headings.sizes[h];
    acc[`& ${h}`] = __spreadProps$b(__spreadValues$p({
      fontFamily: theme.headings.fontFamily,
      fontWeight: values.fontWeight || theme.headings.fontWeight,
      marginTop: typeof values.lineHeight === "number" ? theme.spacing.xl * values.lineHeight : theme.spacing.xl,
      marginBottom: theme.spacing.sm
    }, values), {
      "@media (max-width: 755px)": {
        fontSize: typeof values.fontSize === "number" && values.fontSize / 1.3
      }
    });
    return acc;
  }, {});
  return {
    root: __spreadProps$b(__spreadValues$p(__spreadProps$b(__spreadValues$p({}, theme.fn.fontStyles()), {
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
      "& a": __spreadProps$b(__spreadValues$p({}, theme.fn.focusStyles()), {
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
const useStyles$g = useStyles$f;
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
const TypographyStylesProvider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TypographyStylesProvider", {}, props), {
    className,
    unstyled
  } = _a, others = __objRest$h(_a, ["className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$g(null, {
    name: "TypographyStylesProvider",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$o({
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
  COLOR_PICKER_SIZES: sizes$b,
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
  INPUT_SIZES: sizes$f,
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
  Transition,
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
const useStyles$e = createStyles((theme) => ({
  header: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 120
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
  },
  spotLight: {
    minWidth: 200,
    display: "flex",
    paddingLeft: 12,
    paddingRight: 8,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    }
  }
}));
function AdminHeader() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [opened, {
    toggle
  }] = useDisclosure(false);
  const {
    classes
  } = useStyles$e();
  const headerLinks = links.map((link) => /* @__PURE__ */ jsx("a", {
    href: link.link,
    className: classes.link,
    children: link.label
  }, link.label));
  const {
    toolbar,
    breadCrumbs
  } = react.exports.useContext(AppContext);
  return /* @__PURE__ */ jsxs(Header, {
    height: 100,
    className: classes.header,
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
          children: headerLinks
        }), /* @__PURE__ */ jsx(Button, {
          onClick: () => openSpotlight(),
          variant: "default",
          className: classes.spotLight,
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
        onSubmit: form.onSubmit((values) => handleTask(item.name, values)),
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
  const formSubmitHandler = (values) => {
    addUser.mutate(values);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: form.onSubmit((values) => formSubmitHandler(values)),
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
    const uri = `${config.baseUri}/v1/settings`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  },
  async update(data) {
    const url = `${config.baseUri}/v1/settings/${data.name}`;
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
  const handleSubmit = (values) => {
    updateSetting.mutate(values);
  };
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: form.onSubmit((values) => handleSubmit({
      ...values,
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
    const uri = `${config.baseUri}/v1/logs?${queryOptionsString}&filter=${JSON.stringify(filter)}`;
    const resp = await ky(uri);
    const result = await resp.json();
    if (resp.ok) {
      return result;
    }
    throw new Error(`cannot get resource: ${uri}, resp: '${JSON.stringify(resp)}'`);
  },
  async distinct(field) {
    const uri = `${config.baseUri}/v1/logs/distinct?field=${field}`;
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
  message: {
    label: "Message",
    headStyle: { width: "auto" },
    cellStyle: {
      width: "auto"
    },
    type: "StringFilter"
  },
  level: {
    label: "Level",
    headStyle: { width: "5%" },
    cellStyle: { width: "5%" },
    type: "LogLevelFilter"
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
    children: /* @__PURE__ */ jsx(Transition, {
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
  return /* @__PURE__ */ jsx(Transition, {
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
        size: 24,
        stroke: 1
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
          const itemValue = column.includes(".") ? item[column == null ? void 0 : column.split(".")[0]][column == null ? void 0 : column.split(".")[1]] : item[column];
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
  return /* @__PURE__ */ jsx(Transition, {
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
var useStyles$9 = createStyles((theme, { size }) => ({
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    align: "center",
    marginBottom: theme.fn.size({ size, sizes: theme.spacing })
  },
  calendarHeaderControl: {
    width: theme.fn.size({ size, sizes: sizes$3 }),
    height: theme.fn.size({ size, sizes: sizes$3 }),
    "&:disabled": {
      opacity: 0,
      cursor: "default"
    }
  },
  calendarHeaderLevel: __spreadProps$9(__spreadValues$m({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: theme.fn.size({ size, sizes: sizes$3 }),
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    padding: `0 ${theme.fn.size({ size, sizes: theme.spacing })}px`,
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
    size,
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
    size
  }, {
    classNames,
    styles,
    unstyled,
    name: __staticSelector
  });
  const iconSize = theme.fn.size({
    size,
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
        size,
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
var useStyles$8 = createStyles((theme, { size }) => {
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
      height: theme.fn.size({ size, sizes: sizes$2 }),
      textAlign: "center",
      borderRadius: theme.radius.sm,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes })
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
    size,
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
    size
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
      size,
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
var useStyles$7 = createStyles((theme, { size }) => {
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
      height: theme.fn.size({ size, sizes: sizes$1 }),
      textAlign: "center",
      borderRadius: theme.radius.sm,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes })
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
    size,
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
    size
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
      size,
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
function getDayTabIndex({ focusable, hasValue, selected, firstInMonth }) {
  if (!focusable) {
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
var useStyles$6 = createStyles((theme, { size, fullWidth, hideOutsideDates }) => ({
  day: __spreadProps$6(__spreadValues$g(__spreadProps$6(__spreadValues$g(__spreadValues$g({}, theme.fn.fontStyles()), theme.fn.focusStyles()), {
    position: "relative",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent",
    width: fullWidth ? "100%" : theme.fn.size({ size, sizes }),
    height: theme.fn.size({ size, sizes }),
    lineHeight: `${theme.fn.size({ size, sizes })}px`,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
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
    size,
    fullWidth,
    firstInMonth,
    focusable,
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
    size,
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
        focusable,
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
    size,
    fullWidth,
    preventFocus,
    focusable,
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
      size,
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
          size,
          fullWidth,
          focusable,
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
    size,
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
        size,
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
          size,
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
var useStyles$4 = createStyles((theme, { size, amountOfMonths, fullWidth }) => {
  const _maxWidth = theme.fn.size({ size, sizes }) * 7;
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
    size = "sm",
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
    size,
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
      size,
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
      size,
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
      size,
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
    size = "sm",
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
  const closeOnEscape = (event) => {
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
    size,
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
      size,
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
              size,
              name,
              placeholder,
              value: inputLabel,
              required,
              invalid: !!error,
              readOnly: !allowFreeInput,
              rightSection,
              rightSectionWidth: theme.fn.size({
                size,
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
          onKeyDownCapture: closeOnEscape,
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
    size,
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
  const calendarSize = size === "lg" || size === "xl" ? "md" : "sm";
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
      size,
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
    size,
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
  const calendarSize = size === "lg" || size === "xl" ? "md" : "sm";
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
      size,
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
var useStyles$2 = createStyles((theme, { size, hasValue }) => ({
  timeInput: __spreadProps$1(__spreadValues$4({}, theme.fn.fontStyles()), {
    width: theme.fn.size({ size, sizes: inputSizes }),
    appearance: "none",
    backgroundColor: "transparent",
    color: "inherit",
    padding: 0,
    textAlign: "center",
    border: "1px solid transparent",
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
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
    size = "sm",
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
    size,
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
      size,
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
var useStyles$1 = createStyles((theme, { size }) => ({
  timeInput: {},
  amPmInput: {},
  disabled: {
    cursor: "not-allowed"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    height: theme.fn.size({ size, sizes: sizes$f }) - 2
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
    size = "sm",
    value,
    unstyled,
    amLabel,
    pmLabel
  } = _b, others = __objRest$2(_b, ["className", "onChange", "onFocus", "size", "value", "unstyled", "amLabel", "pmLabel"]);
  const {
    classes,
    cx
  } = useStyles$2({
    size,
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
    size,
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
    size
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
    size,
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
      size,
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
        size,
        className: cx({
          [classes.disabled]: disabled
        }),
        classNames,
        styles,
        disabled,
        rightSection,
        rightSectionWidth: theme.fn.size({
          size,
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
          size,
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
          size,
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
          size,
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
          size,
          "aria-label": amPmLabel,
          disabled,
          unstyled
        })]
      })
    })
  });
});
TimeInput.displayName = "@mantine/dates/TimeInput";
var useStyles = createStyles((theme, { size }) => ({
  timeField: {},
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  },
  inputWrapper: {
    display: "inline-flex",
    alignItems: "center",
    height: theme.fn.size({ size, sizes: sizes$f }) - 2
  },
  separator: {
    paddingLeft: theme.fn.size({ size, sizes: theme.spacing }) / 2,
    paddingRight: theme.fn.size({ size, sizes: theme.spacing }) / 2,
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
    size,
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
    size
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
    size,
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
    size,
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
      size,
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
        size,
        className: cx({
          [classes.disabled]: disabled
        }),
        classNames,
        styles,
        disabled,
        rightSection,
        rightSectionWidth: theme.fn.size({
          size,
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
