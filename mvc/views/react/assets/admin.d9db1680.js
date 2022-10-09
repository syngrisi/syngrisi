import { a$ as transitions$1, r as react, ap as useUncontrolled, S as useId, b as jsx, c as createStyles, B as Box, j as jsxs, aB as UnstyledButton, J as useComponentDefaultProps, I as getDefaultZIndex, aF as useInputProps, ag as useDidUpdate, W as Input, ax as useMergedRef, am as packSx, an as createPolymorphicComponent, P as Paper, d as useMantineTheme, a4 as Fragment, K as Transition, al as OptionalPortal, T as Text, O as Overlay, b0 as assignRef, b1 as MANTINE_SIZES, aw as isElement, V as useDisclosure, ao as _extends, U as extractSystemStyles, a9 as React, R as sizes$9, p as TextInput, G as Group, b2 as InputsGroup, ah as useReducedMotion, b3 as useIsomorphicEffect, A as Anchor, L as Loader, b4 as CheckboxIcon, b5 as GROUP_POSITIONS, s as ActionIcon, q as Checkbox, h as Button, C as Center, aC as CheckIcon, e as Container, aI as Portal, i as Progress, _ as Stack, $ as Tooltip, ay as clsx, b6 as DEFAULT_THEME, b7 as MANTINE_COLORS, M as MantineProvider, E as ColorSchemeProvider, b8 as useMantineColorScheme, b9 as GlobalStyles, ba as NormalizeCSS, aG as keyframes, bb as useCss, bc as useEmotionCache, bd as defaultMantineEmotionCache, be as createCache, Z as Aae, aK as useLocation, bf as Link, bg as sge, bh as $i, aP as q0, aU as Lce, o as useForm, Y as queryString, l as log, bi as useParams$1, N as Nb, m as aze, bj as useMutation, bk as _ae, bl as gI, aS as ka, u as useQuery, aN as age, a5 as Xne, a6 as hl, a7 as Ti, a8 as zK, a1 as Uhe, a0 as Ahe, n as useSearchParams, w as useLocalStorage, aa as J, a2 as sJ, ac as Routes, ad as Route, Q as QueryClient, f as useDocumentTitle, ab as useNavigate, y as QueryClientProvider, F as createRoot, H as BrowserRouter } from "./use-form.113720ef.js";
import { X as clamp, Y as createSafeContext, Z as useContextStylesApi, _ as createScopedKeydownHandler, C as Collapse, $ as StylesApiProvider, a0 as CloseButton, a1 as HorizontalSection, a2 as Section, a3 as VerticalSection, a4 as DefaultItem$2, a5 as SelectPopover, a6 as SelectScrollArea, a7 as SelectItems, a8 as Popover, A as Affix, a9 as useFocusTrap, aa as useScrollLock, ab as useFocusReturn, ac as GroupedTransition, ad as createEventHandler, ae as useDelayedHover, af as _objectWithoutPropertiesLoose, ag as useScrollIntoView, ah as groupOptions, ai as getSelectRightSectionProps, aj as Divider, N as Navbar, H as Header, D as AppShell, ak as Avatar, p as Badge, d as Breadcrumbs, B as Burger, w as Chip, F as FocusTrap, al as Highlight, K as Kbd, L as List, am as Mark, an as Menu, ao as Modal, ap as Notification, R as RingProgress, m as ScrollArea, aq as Select, ar as ChevronIcon$1, g as Skeleton, q as Table, as as Global, at as AppContext, n as getNavigationItem, s as stopNavigationProgress, r as resetNavigationProgress, a as useColorScheme, l as links, b as HeaderLogo, o as openSpotlight, U as UserMenu, T as ToggleThemeButton, i as isDark, j as useToggle, c as SafeSelect, au as successMsg, e as errorMsg, G as GenericService, av as UserHooks, z as useNavProgressFetchEffect, f as useInView, u as useQueryParams, S as StringParam, J as JsonParam, t as useInputState, v as RelativeDrawer, x as LogicalGroup, y as uuid, k as useInfinityScroll, E as ReactQueryDevtools, I as navigationData, M as SpotlightProvider, O as NotificationsProvider, P as NavigationProgress, Q as ModalsProvider, V as QueryParamProvider, W as ReactRouter6Adapter } from "./LogicalGroup.6c67dc0f.js";
import { L as LoadingOverlay, P as PasswordInput, T as Title } from "./Title.3db663e8.js";
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
function getVariantStyles$4(theme, { variant, radius }) {
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
var useStyles$1C = createStyles((theme, params) => ({
  item: getVariantStyles$4(theme, params)
}));
const useStyles$1D = useStyles$1C;
var __defProp$1B = Object.defineProperty;
var __getOwnPropSymbols$1B = Object.getOwnPropertySymbols;
var __hasOwnProp$1B = Object.prototype.hasOwnProperty;
var __propIsEnum$1B = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1B = (obj, key, value) => key in obj ? __defProp$1B(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$$ = (source, exclude) => {
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
const AccordionItem = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    value
  } = _b, others = __objRest$$(_b, ["children", "className", "value"]);
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const ctx = useAccordionContext();
  const {
    classes,
    cx
  } = useStyles$1D({
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
      ...__spreadValues$1B({
        ref,
        className: cx(classes.item, className),
        "data-active": ctx.isItemActive(value) || void 0
      }, others),
      children
    })
  });
});
AccordionItem.displayName = "@mantine/core/AccordionItem";
var __defProp$1A = Object.defineProperty;
var __defProps$N = Object.defineProperties;
var __getOwnPropDescs$N = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1A = Object.getOwnPropertySymbols;
var __hasOwnProp$1A = Object.prototype.hasOwnProperty;
var __propIsEnum$1A = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1A = (obj, key, value) => key in obj ? __defProp$1A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$N = (a, b) => __defProps$N(a, __getOwnPropDescs$N(b));
var __objRest$_ = (source, exclude) => {
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
function getVariantStyles$3(theme, { variant }) {
  if (variant === "default" || variant === "contained") {
    return theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    });
  }
  return {};
}
var useStyles$1A = createStyles((theme, _a) => {
  var _b = _a, { transitionDuration, chevronPosition, chevronSize } = _b, params = __objRest$_(_b, ["transitionDuration", "chevronPosition", "chevronSize"]);
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
    control: __spreadProps$N(__spreadValues$1A(__spreadValues$1A(__spreadValues$1A({}, theme.fn.focusStyles()), theme.fn.fontStyles()), getVariantStyles$3(theme, params)), {
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: chevronPosition === "right" ? "row-reverse" : "row",
      padding: `${theme.spacing.md}px ${theme.spacing.md / 2}px`,
      paddingLeft: chevronPosition === "right" ? theme.spacing.sm + 4 : null,
      textAlign: "left",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      "&:disabled": __spreadValues$1A({
        opacity: 0.4,
        cursor: "not-allowed"
      }, theme.fn.hover({ backgroundColor: "transparent" }))
    })
  };
});
const useStyles$1B = useStyles$1A;
var __defProp$1z = Object.defineProperty;
var __defProps$M = Object.defineProperties;
var __getOwnPropDescs$M = Object.getOwnPropertyDescriptors;
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
var __spreadProps$M = (a, b) => __defProps$M(a, __getOwnPropDescs$M(b));
var __objRest$Z = (source, exclude) => {
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
const AccordionControl = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    disabled,
    onKeyDown,
    onClick,
    chevron,
    children,
    className,
    icon
  } = _b, others = __objRest$Z(_b, ["disabled", "onKeyDown", "onClick", "chevron", "children", "className", "icon"]);
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
  } = useStyles$1B({
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
    ...__spreadProps$M(__spreadValues$1z({}, others), {
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
var __defProp$1y = Object.defineProperty;
var __defProps$L = Object.defineProperties;
var __getOwnPropDescs$L = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1y = Object.getOwnPropertySymbols;
var __hasOwnProp$1y = Object.prototype.hasOwnProperty;
var __propIsEnum$1y = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1y = (obj, key, value) => key in obj ? __defProp$1y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$L = (a, b) => __defProps$L(a, __getOwnPropDescs$L(b));
var useStyles$1y = createStyles((theme, _params) => ({
  panel: __spreadProps$L(__spreadValues$1y({}, theme.fn.fontStyles()), {
    wordBreak: "break-word",
    lineHeight: theme.lineHeight
  }),
  content: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs / 2
  }
}));
const useStyles$1z = useStyles$1y;
var __defProp$1x = Object.defineProperty;
var __defProps$K = Object.defineProperties;
var __getOwnPropDescs$K = Object.getOwnPropertyDescriptors;
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
var __spreadProps$K = (a, b) => __defProps$K(a, __getOwnPropDescs$K(b));
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
function AccordionPanel(_a) {
  var _b = _a, {
    children,
    className
  } = _b, others = __objRest$Y(_b, ["children", "className"]);
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
  } = useStyles$1z({
    variant: ctx.variant,
    radius: ctx.radius
  }, {
    name: "Accordion",
    classNames,
    styles,
    unstyled
  });
  return /* @__PURE__ */ jsx(Collapse, {
    ...__spreadProps$K(__spreadValues$1x({}, others), {
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
var __defProp$1w = Object.defineProperty;
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
function ChevronIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1w({
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
var __defProp$1v = Object.defineProperty;
var __defProps$J = Object.defineProperties;
var __getOwnPropDescs$J = Object.getOwnPropertyDescriptors;
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
var __spreadProps$J = (a, b) => __defProps$J(a, __getOwnPropDescs$J(b));
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
const defaultProps$G = {
  multiple: false,
  disableChevronRotation: false,
  transitionDuration: 200,
  chevronPosition: "right",
  variant: "default",
  chevronSize: 24,
  chevron: /* @__PURE__ */ jsx(ChevronIcon, {})
};
function Accordion(props) {
  const _a = useComponentDefaultProps("Accordion", defaultProps$G, props), {
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
  } = _a, others = __objRest$X(_a, ["id", "loop", "children", "multiple", "value", "defaultValue", "onChange", "transitionDuration", "disableChevronRotation", "chevronPosition", "chevronSize", "order", "chevron", "classNames", "styles", "unstyled", "variant", "radius"]);
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
        ...__spreadProps$J(__spreadValues$1v({}, others), {
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
var __defProp$1u = Object.defineProperty;
var __defProps$I = Object.defineProperties;
var __getOwnPropDescs$I = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1u = Object.getOwnPropertySymbols;
var __hasOwnProp$1u = Object.prototype.hasOwnProperty;
var __propIsEnum$1u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1u = (obj, key, value) => key in obj ? __defProp$1u(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$I = (a, b) => __defProps$I(a, __getOwnPropDescs$I(b));
function getVariantStyles$2({ variant, color, theme }) {
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
var useStyles$1w = createStyles((theme, { color, radius, variant }) => ({
  root: __spreadValues$1u(__spreadProps$I(__spreadValues$1u({}, theme.fn.fontStyles()), {
    position: "relative",
    overflow: "hidden",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.fn.radius(radius),
    border: "1px solid transparent"
  }), getVariantStyles$2({ variant, color, theme })),
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
  message: __spreadProps$I(__spreadValues$1u({}, theme.fn.fontStyles()), {
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
const useStyles$1x = useStyles$1w;
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
var __objRest$W = (source, exclude) => {
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
const defaultProps$F = {
  variant: "light"
};
const Alert = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Alert", defaultProps$F, props), {
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
  } = _a, others = __objRest$W(_a, ["id", "className", "title", "variant", "children", "color", "classNames", "icon", "styles", "onClose", "radius", "withCloseButton", "closeButtonLabel", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1x({
    color,
    radius,
    variant
  }, {
    classNames,
    styles,
    unstyled,
    name: "Alert"
  });
  const rootId = useId(id);
  const titleId = title && `${rootId}-title`;
  const bodyId = `${rootId}-body`;
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1t({
      id: rootId,
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
const defaultProps$E = {
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
  const _props = useComponentDefaultProps("Aside", defaultProps$E, props);
  return /* @__PURE__ */ jsx(HorizontalSection, {
    ...__spreadValues$1s({
      section: "aside",
      __staticSelector: "Aside",
      ref
    }, _props)
  });
});
Aside.Section = Section;
Aside.displayName = "@mantine/core/Aside";
var __defProp$1r = Object.defineProperty;
var __defProps$H = Object.defineProperties;
var __getOwnPropDescs$H = Object.getOwnPropertyDescriptors;
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
var __spreadProps$H = (a, b) => __defProps$H(a, __getOwnPropDescs$H(b));
const defaultProps$D = {
  fixed: false,
  position: {
    bottom: 0,
    left: 0,
    right: 0
  },
  zIndex: getDefaultZIndex("app")
};
const Footer = react.exports.forwardRef((props, ref) => {
  const _props = useComponentDefaultProps("Footer", defaultProps$D, props);
  return /* @__PURE__ */ jsx(VerticalSection, {
    ...__spreadProps$H(__spreadValues$1r({
      section: "footer",
      __staticSelector: "Footer"
    }, _props), {
      ref
    })
  });
});
Footer.displayName = "@mantine/core/Footer";
var useStyles$1u = createStyles((theme, { ratio }) => ({
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
const useStyles$1v = useStyles$1u;
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
const AspectRatio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("AspectRatio", {}, props), {
    className,
    ratio,
    children,
    unstyled
  } = _a, others = __objRest$V(_a, ["className", "ratio", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1v({
    ratio
  }, {
    name: "AspectRatio",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1q({
      ref,
      className: cx(classes.root, className)
    }, others),
    children
  });
});
AspectRatio.displayName = "@mantine/core/AspectRatio";
function filterData$1({ data, limit, value, filter }) {
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
var useStyles$1s = createStyles((theme, { size }) => {
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
const useStyles$1t = useStyles$1s;
var __defProp$1p = Object.defineProperty;
var __defProps$G = Object.defineProperties;
var __getOwnPropDescs$G = Object.getOwnPropertyDescriptors;
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
var __spreadProps$G = (a, b) => __defProps$G(a, __getOwnPropDescs$G(b));
var __objRest$U = (source, exclude) => {
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
function defaultFilter$2(value, item) {
  return item.value.toLowerCase().trim().includes(value.toLowerCase().trim());
}
const defaultProps$C = {
  required: false,
  size: "sm",
  shadow: "sm",
  limit: 5,
  itemComponent: DefaultItem$2,
  transition: "pop",
  transitionDuration: 0,
  initiallyOpened: false,
  filter: defaultFilter$2,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  dropdownPosition: "flip",
  maxDropdownHeight: "auto",
  positionDependencies: []
};
const Autocomplete = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("Autocomplete", defaultProps$C, props), {
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
  } = _a, others = __objRest$U(_a, ["inputProps", "wrapperProps", "shadow", "data", "limit", "value", "defaultValue", "onChange", "unstyled", "itemComponent", "onItemSubmit", "onKeyDown", "onFocus", "onBlur", "onClick", "transition", "transitionDuration", "initiallyOpened", "transitionTimingFunction", "classNames", "styles", "filter", "nothingFound", "onDropdownClose", "onDropdownOpen", "withinPortal", "switchDirectionOnFlip", "zIndex", "dropdownPosition", "maxDropdownHeight", "dropdownComponent", "positionDependencies"]);
  const {
    classes
  } = useStyles$1t({
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
  const filteredData = filterData$1({
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
    ...__spreadProps$G(__spreadValues$1p({}, wrapperProps), {
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
            ...__spreadProps$G(__spreadValues$1p(__spreadValues$1p({
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
var __defProp$1o = Object.defineProperty;
var __defProps$F = Object.defineProperties;
var __getOwnPropDescs$F = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1o = Object.getOwnPropertySymbols;
var __hasOwnProp$1o = Object.prototype.hasOwnProperty;
var __propIsEnum$1o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1o = (obj, key, value) => key in obj ? __defProp$1o(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$F = (a, b) => __defProps$F(a, __getOwnPropDescs$F(b));
var __objRest$T = (source, exclude) => {
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
const defaultProps$B = {
  radius: 0
};
const _BackgroundImage = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("BackgroundImage", defaultProps$B, props), {
    src,
    radius,
    sx
  } = _a, others = __objRest$T(_a, ["src", "radius", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$F(__spreadValues$1o({}, others), {
      ref,
      sx: [(theme) => __spreadProps$F(__spreadValues$1o({}, theme.fn.focusStyles()), {
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
function QuoteIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$1n({
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
var __defProp$1m = Object.defineProperty;
var __defProps$E = Object.defineProperties;
var __getOwnPropDescs$E = Object.getOwnPropertyDescriptors;
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
var __spreadProps$E = (a, b) => __defProps$E(a, __getOwnPropDescs$E(b));
var useStyles$1q = createStyles((theme, { color }) => ({
  root: __spreadProps$E(__spreadValues$1m({}, theme.fn.fontStyles()), {
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
const useStyles$1r = useStyles$1q;
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
var __objRest$S = (source, exclude) => {
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
const defaultProps$A = {
  color: "gray",
  icon: /* @__PURE__ */ jsx(QuoteIcon, {})
};
const Blockquote = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Blockquote", defaultProps$A, props), {
    className,
    color,
    icon,
    cite,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$S(_a, ["className", "color", "icon", "cite", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1r({
    color
  }, {
    classNames,
    styles,
    unstyled,
    name: "Blockquote"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1l({
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
var useStyles$1o = createStyles((theme, { padding, withBorder, inheritPadding }) => {
  const spacing = theme.fn.size({ size: padding, sizes: theme.spacing });
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
const useStyles$1p = useStyles$1o;
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
var __objRest$R = (source, exclude) => {
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
const _CardSection = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    withBorder = false,
    inheritPadding = false,
    unstyled
  } = _b, others = __objRest$R(_b, ["className", "withBorder", "inheritPadding", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1p({
    padding: useCardPadding(),
    withBorder,
    inheritPadding
  }, {
    name: "Card",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1k({
      className: cx(classes.cardSection, className),
      ref
    }, others)
  });
});
_CardSection.displayName = "@mantine/core/CardSection";
const CardSection = createPolymorphicComponent(_CardSection);
var useStyles$1m = createStyles((theme) => ({
  root: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
  }
}));
const useStyles$1n = useStyles$1m;
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
var __objRest$Q = (source, exclude) => {
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
const defaultProps$z = {
  p: "md"
};
const _Card = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Card", defaultProps$z, props), {
    className,
    p,
    radius,
    children,
    unstyled
  } = _a, others = __objRest$Q(_a, ["className", "p", "radius", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1n(null, {
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
      ...__spreadValues$1j({
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
var __defProp$1i = Object.defineProperty;
var __defProps$D = Object.defineProperties;
var __getOwnPropDescs$D = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1i = Object.getOwnPropertySymbols;
var __hasOwnProp$1i = Object.prototype.hasOwnProperty;
var __propIsEnum$1i = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1i = (obj, key, value) => key in obj ? __defProp$1i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$D = (a, b) => __defProps$D(a, __getOwnPropDescs$D(b));
var useStyles$1k = createStyles((theme, { color: _color }) => {
  const color = _color || (theme.colorScheme === "dark" ? "dark" : "gray");
  const colors = theme.fn.variant({ color, variant: "light" });
  return {
    root: __spreadProps$D(__spreadValues$1i({}, theme.fn.fontStyles()), {
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
const useStyles$1l = useStyles$1k;
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
const Code = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Code", {}, props), {
    className,
    children,
    block,
    color,
    unstyled
  } = _a, others = __objRest$P(_a, ["className", "children", "block", "color", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1l({
    color
  }, {
    name: "Code",
    unstyled
  });
  if (block) {
    return /* @__PURE__ */ jsx(Box, {
      ...__spreadValues$1h({
        component: "pre",
        dir: "ltr",
        className: cx(classes.root, classes.block, className),
        ref
      }, others),
      children
    });
  }
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$1h({
      component: "code",
      className: cx(classes.root, className),
      ref,
      dir: "ltr"
    }, others),
    children
  });
});
Code.displayName = "@mantine/core/Code";
var __defProp$1g = Object.defineProperty;
var __defProps$C = Object.defineProperties;
var __getOwnPropDescs$C = Object.getOwnPropertyDescriptors;
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
var __spreadProps$C = (a, b) => __defProps$C(a, __getOwnPropDescs$C(b));
var useStyles$1i = createStyles((theme, { size, radius }) => {
  const overlayColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return {
    root: __spreadProps$C(__spreadValues$1g({}, theme.fn.focusStyles()), {
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
const useStyles$1j = useStyles$1i;
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
const defaultProps$y = {
  size: 25,
  radius: 25
};
const _ColorSwatch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorSwatch", defaultProps$y, props), {
    color,
    size,
    radius,
    className,
    children,
    classNames,
    styles,
    unstyled
  } = _a, others = __objRest$O(_a, ["color", "size", "radius", "className", "children", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1j({
    radius,
    size
  }, {
    classNames,
    styles,
    unstyled,
    name: "ColorSwatch"
  });
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$1f({
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
var useStyles$1g = createStyles((theme, { size }) => {
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
const useStyles$1h = useStyles$1g;
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
  } = useStyles$1h({
    size
  }, {
    classNames,
    styles,
    name: __staticSelector,
    unstyled
  });
  return /* @__PURE__ */ jsx("div", {
    className: cx(classes.thumb, className),
    style: __spreadValues$1e({
      left: `calc(${position.x * 100}% - ${THUMB_SIZES[size] / 2}px)`,
      top: `calc(${position.y * 100}% - ${THUMB_SIZES[size] / 2}px)`
    }, style)
  });
}
Thumb$1.displayName = "@mantine/core/Thumb";
var useStyles$1e = createStyles((theme, { size }, getRef) => ({
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
const useStyles$1f = useStyles$1e;
var __defProp$1d = Object.defineProperty;
var __defProps$B = Object.defineProperties;
var __getOwnPropDescs$B = Object.getOwnPropertyDescriptors;
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
var __spreadProps$B = (a, b) => __defProps$B(a, __getOwnPropDescs$B(b));
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
  } = _b, others = __objRest$N(_b, ["value", "onChange", "maxValue", "round", "size", "thumbColor", "__staticSelector", "focusable", "overlays", "classNames", "styles", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$1f({
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
    ...__spreadProps$B(__spreadValues$1d({}, others), {
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
var __defProp$1c = Object.defineProperty;
var __defProps$A = Object.defineProperties;
var __getOwnPropDescs$A = Object.getOwnPropertyDescriptors;
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
var __spreadProps$A = (a, b) => __defProps$A(a, __getOwnPropDescs$A(b));
var __objRest$M = (source, exclude) => {
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
const HueSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange
  } = _b, others = __objRest$M(_b, ["value", "onChange"]);
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$A(__spreadValues$1c({}, others), {
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
var __defProp$1b = Object.defineProperty;
var __defProps$z = Object.defineProperties;
var __getOwnPropDescs$z = Object.getOwnPropertyDescriptors;
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
var __spreadProps$z = (a, b) => __defProps$z(a, __getOwnPropDescs$z(b));
var __objRest$L = (source, exclude) => {
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
const AlphaSlider = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    onChange,
    color
  } = _b, others = __objRest$L(_b, ["value", "onChange", "color"]);
  const theme = useMantineTheme();
  const _color = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  return /* @__PURE__ */ jsx(ColorSlider, {
    ...__spreadProps$z(__spreadValues$1b({}, others), {
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
var __defProp$1a = Object.defineProperty;
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
const SATURATION_HEIGHTS = {
  xs: 100,
  sm: 110,
  md: 120,
  lg: 140,
  xl: 160
};
var useStyles$1c = createStyles((theme, { size }, getRef) => ({
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
  saturationOverlay: __spreadValues$1a({
    boxSizing: "border-box",
    borderRadius: theme.radius.sm
  }, theme.fn.cover(-theme.fn.size({ size, sizes: THUMB_SIZES }) / 2 - 1))
}));
const useStyles$1d = useStyles$1c;
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
  } = useStyles$1d({
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
var useStyles$1a = createStyles((_theme, { swatchesPerRow }) => ({
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
const useStyles$1b = useStyles$1a;
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
var __objRest$K = (source, exclude) => {
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
  } = _b, others = __objRest$K(_b, ["data", "swatchesPerRow", "focusable", "classNames", "styles", "__staticSelector", "unstyled", "setValue"]);
  const {
    classes
  } = useStyles$1b({
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
    ...__spreadValues$19({
      className: classes.swatches
    }, others),
    children: colors
  });
}
Swatches.displayName = "@mantine/core/Swatches";
const sizes$8 = {
  xs: 180,
  sm: 200,
  md: 240,
  lg: 280,
  xl: 320
};
var useStyles$19 = createStyles((theme, { size, fullWidth }) => ({
  preview: {},
  wrapper: {
    boxSizing: "border-box",
    width: fullWidth ? "100%" : theme.fn.size({ size, sizes: sizes$8 }),
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
var __objRest$J = (source, exclude) => {
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
const SWATCH_SIZES$1 = {
  xs: 26,
  sm: 34,
  md: 42,
  lg: 50,
  xl: 54
};
const defaultProps$x = {
  swatchesPerRow: 10,
  size: "sm",
  withPicker: true,
  focusable: true,
  __staticSelector: "ColorPicker"
};
const ColorPicker = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ColorPicker", defaultProps$x, props), {
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
  } = _a, others = __objRest$J(_a, ["value", "defaultValue", "onChange", "format", "swatches", "swatchesPerRow", "size", "withPicker", "fullWidth", "focusable", "__staticSelector", "saturationLabel", "hueLabel", "alphaLabel", "className", "styles", "classNames", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$19({
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
      const next = __spreadValues$18(__spreadValues$18({}, current), color);
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
    ...__spreadValues$18({
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
var __defProp$17 = Object.defineProperty;
var __defProps$y = Object.defineProperties;
var __getOwnPropDescs$y = Object.getOwnPropertyDescriptors;
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
var __spreadProps$y = (a, b) => __defProps$y(a, __getOwnPropDescs$y(b));
var __objRest$I = (source, exclude) => {
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
const SWATCH_SIZES = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36
};
const defaultProps$w = {
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
  const _a = useInputProps("ColorInput", defaultProps$w, props), {
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
  } = _a, others = __objRest$I(_a, ["wrapperProps", "inputProps", "format", "onChange", "onFocus", "onBlur", "value", "defaultValue", "disallowInput", "fixOnBlur", "withPreview", "swatchesPerRow", "withPicker", "icon", "transition", "dropdownZIndex", "transitionDuration", "transitionTimingFunction", "withinPortal", "swatches", "shadow", "classNames", "styles", "unstyled"]);
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
    ...__spreadProps$y(__spreadValues$17({}, wrapperProps), {
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
            ...__spreadProps$y(__spreadValues$17(__spreadValues$17({}, others), inputProps), {
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
var __objRest$H = (source, exclude) => {
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
const defaultProps$v = {
  timeout: 1e3
};
function CopyButton(props) {
  const _a = useComponentDefaultProps("CopyButton", defaultProps$v, props), {
    children,
    timeout,
    value
  } = _a, others = __objRest$H(_a, ["children", "timeout", "value"]);
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
var __defProp$15 = Object.defineProperty;
var __defProps$x = Object.defineProperties;
var __getOwnPropDescs$x = Object.getOwnPropertyDescriptors;
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
var __spreadProps$x = (a, b) => __defProps$x(a, __getOwnPropDescs$x(b));
const sizes$7 = {
  xs: 160,
  sm: 200,
  md: 340,
  lg: 400,
  xl: 500
};
var useStyles$17 = createStyles((theme, { size }) => ({
  root: __spreadProps$x(__spreadValues$15({}, theme.fn.fontStyles()), {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    position: "relative",
    width: theme.fn.size({ size, sizes: sizes$7 }),
    maxWidth: "100%",
    minHeight: 50
  }),
  closeButton: {
    position: "absolute",
    top: theme.spacing.md / 2,
    right: theme.spacing.md / 2
  }
}));
const useStyles$18 = useStyles$17;
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
var __objRest$G = (source, exclude) => {
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
const defaultProps$u = {
  shadow: "md",
  p: "md",
  withBorder: true,
  size: "md",
  transition: "pop-top-right",
  transitionDuration: 200
};
function DialogBody(props) {
  const _a = useComponentDefaultProps("Dialog", defaultProps$u, props), {
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
  } = _a, others = __objRest$G(_a, ["withCloseButton", "onClose", "position", "shadow", "children", "className", "style", "classNames", "styles", "opened", "withBorder", "size", "transition", "transitionDuration", "transitionTimingFunction", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$18({
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
      ...__spreadValues$14({
        className: cx(classes.root, className),
        style: __spreadValues$14(__spreadValues$14({}, style), transitionStyles),
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
  } = _b, props = __objRest$G(_b, ["zIndex"]);
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Affix, {
    zIndex,
    position: props.position || {
      bottom: theme.spacing.xl,
      right: theme.spacing.xl
    },
    ref,
    children: /* @__PURE__ */ jsx(DialogBody, {
      ...__spreadValues$14({}, props)
    })
  });
});
Dialog.displayName = "@mantine/core/Dialog";
var __defProp$13 = Object.defineProperty;
var __defProps$w = Object.defineProperties;
var __getOwnPropDescs$w = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$13 = Object.getOwnPropertySymbols;
var __hasOwnProp$13 = Object.prototype.hasOwnProperty;
var __propIsEnum$13 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$13 = (obj, key, value) => key in obj ? __defProp$13(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$w = (a, b) => __defProps$w(a, __getOwnPropDescs$w(b));
const sizes$6 = {
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
      return { top: 0, left: 0, right: 0, height: theme.fn.size({ size, sizes: sizes$6 }) };
    case "bottom":
      return { bottom: 0, left: 0, right: 0, height: theme.fn.size({ size, sizes: sizes$6 }) };
    case "right":
      return { bottom: 0, top: 0, right: 0, width: theme.fn.size({ size, sizes: sizes$6 }) };
    case "left":
      return { bottom: 0, top: 0, left: 0, width: theme.fn.size({ size, sizes: sizes$6 }) };
    default:
      return null;
  }
}
var useStyles$15 = createStyles((theme, { position, size, zIndex }) => ({
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
  drawer: __spreadProps$w(__spreadValues$13({}, getPositionStyles$1({ position, size, theme })), {
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
const useStyles$16 = useStyles$15;
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
var __objRest$F = (source, exclude) => {
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
const defaultProps$t = {
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
  const _a = useComponentDefaultProps("Drawer", defaultProps$t, props), {
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
    padding,
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
  } = _a, others = __objRest$F(_a, ["className", "opened", "onClose", "position", "size", "trapFocus", "lockScroll", "closeOnClickOutside", "closeOnEscape", "transition", "transitionDuration", "transitionTimingFunction", "zIndex", "overlayColor", "overlayOpacity", "children", "withOverlay", "shadow", "padding", "title", "withCloseButton", "closeButtonLabel", "classNames", "styles", "target", "withinPortal", "overlayBlur", "unstyled", "withFocusReturn"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$16({
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
        ...__spreadValues$12({
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
          p: padding,
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
var __objRest$E = (source, exclude) => {
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
const defaultProps$s = {
  multiple: false
};
const FileButton = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("FileButton", defaultProps$s, props), {
    onChange,
    children,
    multiple,
    accept,
    name,
    form,
    resetRef
  } = _a, others = __objRest$E(_a, ["onChange", "children", "multiple", "accept", "name", "form", "resetRef"]);
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
    children: [children(__spreadValues$11({
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
var useStyles$13 = createStyles((theme) => ({
  placeholder: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
  },
  input: {
    cursor: "pointer"
  }
}));
const useStyles$14 = useStyles$13;
var __defProp$10 = Object.defineProperty;
var __defProps$v = Object.defineProperties;
var __getOwnPropDescs$v = Object.getOwnPropertyDescriptors;
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
var __spreadProps$v = (a, b) => __defProps$v(a, __getOwnPropDescs$v(b));
var __objRest$D = (source, exclude) => {
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
const DefaultValue$1 = ({
  value
}) => /* @__PURE__ */ jsx("span", {
  children: Array.isArray(value) ? value.map((file) => file.name).join(", ") : value == null ? void 0 : value.name
});
const defaultProps$r = {
  size: "sm",
  valueComponent: DefaultValue$1,
  clearButtonTabIndex: 0
};
const RIGHT_SECTION_WIDTH = {
  xs: 24,
  sm: 30,
  md: 34,
  lg: 40,
  xl: 44
};
const _FileInput = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("FileInput", defaultProps$r, props), {
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
  } = _a, others = __objRest$D(_a, ["inputProps", "wrapperProps", "placeholder", "value", "defaultValue", "onChange", "multiple", "accept", "name", "form", "classNames", "styles", "unstyled", "valueComponent", "rightSection", "rightSectionWidth", "clearable", "clearButtonLabel", "clearButtonTabIndex"]);
  const resetRef = react.exports.useRef();
  const {
    classes,
    theme,
    cx
  } = useStyles$14(null, {
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
    ...__spreadProps$v(__spreadValues$10({}, wrapperProps), {
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
        ...__spreadProps$v(__spreadValues$10(__spreadValues$10(__spreadValues$10({
          multiline: true
        }, fileButtonProps), inputProps), others), {
          component: "button",
          type: "button",
          ref,
          __staticSelector: "FileInput",
          rightSection: _rightSection,
          rightSectionWidth: rightSectionWidth || theme.fn.size({
            size: inputProps.size,
            sizes: RIGHT_SECTION_WIDTH
          }),
          classNames: __spreadProps$v(__spreadValues$10({}, classNames), {
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
var __defProp$$ = Object.defineProperty;
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
var useStyles$11 = createStyles((theme, {
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
  root: __spreadValues$$({
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
const useStyles$12 = useStyles$11;
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
var __objRest$C = (source, exclude) => {
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
const defaultProps$q = {
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
  const _a = useComponentDefaultProps("Grid.Col", defaultProps$q, props), {
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
  } = _a, others = __objRest$C(_a, ["children", "span", "offset", "offsetXs", "offsetSm", "offsetMd", "offsetLg", "offsetXl", "xs", "sm", "md", "lg", "xl", "order", "orderXs", "orderSm", "orderMd", "orderLg", "orderXl", "className", "id", "unstyled"]);
  const ctx = useGridContext();
  if (!ctx) {
    throw new Error("[@mantine/core] Grid.Col was used outside of Grid context");
  }
  const colSpan = span || ctx.columns;
  const {
    classes,
    cx
  } = useStyles$12({
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
    ...__spreadValues$_({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
Col.displayName = "@mantine/core/Col";
var useStyles$$ = createStyles((theme, { justify, align, gutter }) => ({
  root: {
    margin: -theme.fn.size({ size: gutter, sizes: theme.spacing }) / 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: justify,
    alignItems: align
  }
}));
const useStyles$10 = useStyles$$;
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
var __objRest$B = (source, exclude) => {
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
const defaultProps$p = {
  gutter: "md",
  justify: "flex-start",
  align: "stretch",
  columns: 12
};
const Grid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Grid", defaultProps$p, props), {
    gutter,
    children,
    grow,
    justify,
    align,
    columns,
    className,
    id,
    unstyled
  } = _a, others = __objRest$B(_a, ["gutter", "children", "grow", "justify", "align", "columns", "className", "id", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$10({
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
      ...__spreadValues$Z({
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
var __objRest$A = (source, exclude) => {
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
function HoverCardDropdown(_a) {
  var _b = _a, {
    children,
    onMouseEnter,
    onMouseLeave
  } = _b, others = __objRest$A(_b, ["children", "onMouseEnter", "onMouseLeave"]);
  const ctx = useHoverCardContext();
  const handleMouseEnter = createEventHandler(onMouseEnter, ctx.openDropdown);
  const handleMouseLeave = createEventHandler(onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Dropdown, {
    ...__spreadValues$Y({
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }, others),
    children
  });
}
HoverCardDropdown.displayName = "@mantine/core/HoverCardDropdown";
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
var __objRest$z = (source, exclude) => {
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
const HoverCardTarget = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    refProp
  } = _b, others = __objRest$z(_b, ["children", "refProp"]);
  if (!isElement(children)) {
    throw new Error(HOVER_CARD_ERRORS.children);
  }
  const ctx = useHoverCardContext();
  const onMouseEnter = createEventHandler(children.props.onMouseEnter, ctx.openDropdown);
  const onMouseLeave = createEventHandler(children.props.onMouseLeave, ctx.closeDropdown);
  return /* @__PURE__ */ jsx(Popover.Target, {
    ...__spreadValues$X({
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
var __defProp$W = Object.defineProperty;
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
var __objRest$y = (source, exclude) => {
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
const defaultProps$o = {
  openDelay: 0,
  closeDelay: 150,
  initiallyOpened: false
};
function HoverCard(props) {
  const _a = useComponentDefaultProps("HoverCard", defaultProps$o, props), {
    children,
    onOpen,
    onClose,
    openDelay,
    closeDelay,
    initiallyOpened
  } = _a, others = __objRest$y(_a, ["children", "onOpen", "onClose", "openDelay", "closeDelay", "initiallyOpened"]);
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
      ...__spreadValues$W({
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
function ImageIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$V({
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
var __defProp$U = Object.defineProperty;
var __defProps$u = Object.defineProperties;
var __getOwnPropDescs$u = Object.getOwnPropertyDescriptors;
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
var __spreadProps$u = (a, b) => __defProps$u(a, __getOwnPropDescs$u(b));
var useStyles$Z = createStyles((theme, { radius }) => ({
  root: {},
  imageWrapper: {
    position: "relative"
  },
  figure: {
    margin: 0
  },
  image: __spreadProps$u(__spreadValues$U({}, theme.fn.fontStyles()), {
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
  placeholder: __spreadProps$u(__spreadValues$U({}, theme.fn.cover()), {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    borderRadius: theme.fn.size({ size: radius, sizes: theme.radius })
  })
}));
const useStyles$_ = useStyles$Z;
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
var __objRest$x = (source, exclude) => {
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
const defaultProps$n = {
  fit: "cover",
  width: "100%",
  height: "auto",
  radius: 0
};
const Image = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Image", defaultProps$n, props), {
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
  } = _a, others = __objRest$x(_a, ["className", "alt", "src", "fit", "width", "height", "radius", "imageProps", "withPlaceholder", "placeholder", "imageRef", "classNames", "styles", "caption", "unstyled", "style"]);
  const {
    classes,
    cx
  } = useStyles$_({
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
    ...__spreadValues$T({
      className: cx(classes.root, className),
      ref,
      style: __spreadValues$T({
        width,
        height
      }, style)
    }, others),
    children: /* @__PURE__ */ jsxs("figure", {
      className: classes.figure,
      children: [/* @__PURE__ */ jsxs("div", {
        className: classes.imageWrapper,
        children: [/* @__PURE__ */ jsx("img", {
          ...__spreadValues$T({
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
var __defProp$S = Object.defineProperty;
var __defProps$t = Object.defineProperties;
var __getOwnPropDescs$t = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$S = Object.getOwnPropertySymbols;
var __hasOwnProp$S = Object.prototype.hasOwnProperty;
var __propIsEnum$S = Object.prototype.propertyIsEnumerable;
var __defNormalProp$S = (obj, key, value) => key in obj ? __defProp$S(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$t = (a, b) => __defProps$t(a, __getOwnPropDescs$t(b));
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
var useStyles$X = createStyles((theme, {
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
  indicator: __spreadProps$t(__spreadValues$S({}, getPositionStyles(position, offset)), {
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
const useStyles$Y = useStyles$X;
var __defProp$R = Object.defineProperty;
var __getOwnPropSymbols$R = Object.getOwnPropertySymbols;
var __hasOwnProp$R = Object.prototype.hasOwnProperty;
var __propIsEnum$R = Object.prototype.propertyIsEnumerable;
var __defNormalProp$R = (obj, key, value) => key in obj ? __defProp$R(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$w = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$R.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$R)
    for (var prop of __getOwnPropSymbols$R(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$R.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$m = {
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
  const _a = useComponentDefaultProps("Indicator", defaultProps$m, props), {
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
  } = _a, others = __objRest$w(_a, ["children", "position", "offset", "size", "radius", "inline", "withBorder", "className", "color", "styles", "label", "classNames", "disabled", "zIndex", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$Y({
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
    ...__spreadValues$R({
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
var __defProp$Q = Object.defineProperty;
var __defProps$s = Object.defineProperties;
var __getOwnPropDescs$s = Object.getOwnPropertyDescriptors;
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
var __spreadProps$s = (a, b) => __defProps$s(a, __getOwnPropDescs$s(b));
var __objRest$v = (source, exclude) => {
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
const defaultProps$l = {
  size: "sm",
  __staticSelector: "InputBase"
};
const _InputBase = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("InputBase", defaultProps$l, props), {
    inputProps,
    wrapperProps
  } = _a, others = __objRest$v(_a, ["inputProps", "wrapperProps"]);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$Q({}, wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$s(__spreadValues$Q(__spreadValues$Q({}, inputProps), others), {
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
var useStyles$V = createStyles((theme, { size }) => ({
  input: {
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }) - 2
  }
}));
const useStyles$W = useStyles$V;
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
var noop = function noop2() {
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
  var cacheMeasurements = _ref.cacheMeasurements, maxRows = _ref.maxRows, minRows = _ref.minRows, _ref$onChange = _ref.onChange, onChange = _ref$onChange === void 0 ? noop : _ref$onChange, _ref$onHeightChange = _ref.onHeightChange, onHeightChange = _ref$onHeightChange === void 0 ? noop : _ref$onHeightChange, props = _objectWithoutPropertiesLoose(_ref, ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"]);
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
var useStyles$T = createStyles((theme) => ({
  input: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs
  }
}));
const useStyles$U = useStyles$T;
var __defProp$P = Object.defineProperty;
var __defProps$r = Object.defineProperties;
var __getOwnPropDescs$r = Object.getOwnPropertyDescriptors;
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
var __spreadProps$r = (a, b) => __defProps$r(a, __getOwnPropDescs$r(b));
var __objRest$u = (source, exclude) => {
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
const defaultProps$k = {
  autosize: false,
  size: "sm",
  __staticSelector: "Textarea"
};
const Textarea = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Textarea", defaultProps$k, props), {
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
  } = _a, others = __objRest$u(_a, ["autosize", "maxRows", "minRows", "label", "error", "description", "id", "className", "required", "style", "wrapperProps", "classNames", "styles", "size", "__staticSelector", "sx", "errorProps", "descriptionProps", "labelProps", "inputWrapperOrder", "inputContainer", "unstyled", "withAsterisk"]);
  const uuid2 = useId(id);
  const {
    classes,
    cx
  } = useStyles$U();
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const sharedProps = __spreadValues$P({
    required,
    ref,
    invalid: !!error,
    id: uuid2,
    classNames: __spreadProps$r(__spreadValues$P({}, classNames), {
      input: cx(classes.input, classNames == null ? void 0 : classNames.input)
    }),
    styles,
    __staticSelector,
    size,
    multiline: true,
    unstyled
  }, rest);
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$P(__spreadValues$P({
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
      ...__spreadProps$r(__spreadValues$P({}, sharedProps), {
        component: TextareaAutosize$1,
        maxRows,
        minRows
      })
    }) : /* @__PURE__ */ jsx(Input, {
      ...__spreadProps$r(__spreadValues$P({}, sharedProps), {
        component: "textarea",
        rows: minRows
      })
    })
  });
});
Textarea.displayName = "@mantine/core/Textarea";
var __defProp$O = Object.defineProperty;
var __defProps$q = Object.defineProperties;
var __getOwnPropDescs$q = Object.getOwnPropertyDescriptors;
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
var __spreadProps$q = (a, b) => __defProps$q(a, __getOwnPropDescs$q(b));
var __objRest$t = (source, exclude) => {
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
const defaultProps$j = {
  formatOnBlur: false,
  size: "sm"
};
const JsonInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("JsonInput", defaultProps$j, props), {
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
  } = _a, others = __objRest$t(_a, ["value", "defaultValue", "onChange", "onFocus", "onBlur", "error", "formatOnBlur", "size", "validationError", "classNames", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$W({
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
    ...__spreadValues$O({
      value: _value,
      onChange: (event) => setValue(event.currentTarget.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
      error: valid ? error : validationError || true,
      __staticSelector: "JsonInput",
      classNames: __spreadProps$q(__spreadValues$O({}, classNames), {
        input: cx(classes.input, classNames == null ? void 0 : classNames.input)
      }),
      autoComplete: "nope",
      ref,
      unstyled
    }, others)
  });
});
JsonInput.displayName = "@mantine/core/JsonInput";
var useStyles$R = createStyles((theme, { smallerThan, largerThan, query, styles }) => {
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
const useStyles$S = useStyles$R;
function MediaQuery(props) {
  var _a;
  const { children, smallerThan, largerThan, query, styles, className } = useComponentDefaultProps("MediaQuery", {}, props);
  const { classes, cx } = useStyles$S({ smallerThan, largerThan, query, styles }, { name: "MediaQuery" });
  const child = react.exports.Children.only(children);
  if (typeof child === "object" && child !== null && "props" in child) {
    return React.cloneElement(child, {
      className: cx(classes.media, (_a = child.props) == null ? void 0 : _a.className, className)
    });
  }
  return child;
}
MediaQuery.displayName = "@mantine/core/MediaQuery";
const sizes$5 = {
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
var useStyles$P = createStyles((theme, { size, disabled, radius, readOnly }) => ({
  defaultValue: {
    display: "flex",
    alignItems: "center",
    backgroundColor: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3] : theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    color: disabled ? theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7] : theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    height: theme.fn.size({ size, sizes: sizes$5 }),
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
const useStyles$Q = useStyles$P;
var __defProp$N = Object.defineProperty;
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
var __objRest$s = (source, exclude) => {
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
  } = _b, others = __objRest$s(_b, ["label", "classNames", "styles", "className", "onRemove", "disabled", "readOnly", "size", "radius"]);
  const {
    classes,
    cx
  } = useStyles$Q({
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
    ...__spreadValues$N({
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
function filterData({ data, searchable, limit, searchValue, filter, value }) {
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
var __defProp$M = Object.defineProperty;
var __defProps$p = Object.defineProperties;
var __getOwnPropDescs$p = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$M = Object.getOwnPropertySymbols;
var __hasOwnProp$M = Object.prototype.hasOwnProperty;
var __propIsEnum$M = Object.prototype.propertyIsEnumerable;
var __defNormalProp$M = (obj, key, value) => key in obj ? __defProp$M(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$p = (a, b) => __defProps$p(a, __getOwnPropDescs$p(b));
var useStyles$N = createStyles((theme, { size, invalid }) => ({
  wrapper: {
    position: "relative"
  },
  values: {
    minHeight: theme.fn.size({ size, sizes: sizes$9 }) - 2,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginLeft: -theme.spacing.xs / 2,
    boxSizing: "border-box"
  },
  value: {
    margin: `${theme.spacing.xs / 2 - 2}px ${theme.spacing.xs / 2}px`
  },
  searchInput: __spreadProps$p(__spreadValues$M({}, theme.fn.fontStyles()), {
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
    lineHeight: `${theme.fn.size({ size, sizes: sizes$9 }) - 2}px`,
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
const useStyles$O = useStyles$N;
var __defProp$L = Object.defineProperty;
var __defProps$o = Object.defineProperties;
var __getOwnPropDescs$o = Object.getOwnPropertyDescriptors;
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
var __spreadProps$o = (a, b) => __defProps$o(a, __getOwnPropDescs$o(b));
var __objRest$r = (source, exclude) => {
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
function defaultFilter$1(value, selected, item) {
  if (selected) {
    return false;
  }
  return item.label.toLowerCase().trim().includes(value.toLowerCase().trim());
}
function defaultShouldCreate(query, data) {
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
const defaultProps$i = {
  size: "sm",
  valueComponent: DefaultValue,
  itemComponent: DefaultItem$2,
  transition: "pop-top-left",
  transitionDuration: 0,
  maxDropdownHeight: 220,
  shadow: "sm",
  searchable: false,
  filter: defaultFilter$1,
  limit: Infinity,
  clearSearchOnChange: true,
  clearable: false,
  clearSearchOnBlur: false,
  disabled: false,
  initiallyOpened: false,
  creatable: false,
  shouldCreate: defaultShouldCreate,
  switchDirectionOnFlip: false,
  zIndex: getDefaultZIndex("popover"),
  selectOnBlur: false,
  clearButtonTabIndex: 0,
  positionDependencies: []
};
const MultiSelect = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("MultiSelect", defaultProps$i, props), {
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
  } = _a, others = __objRest$r(_a, ["className", "style", "required", "label", "description", "size", "error", "classNames", "styles", "wrapperProps", "value", "defaultValue", "data", "onChange", "valueComponent", "itemComponent", "id", "transition", "transitionDuration", "transitionTimingFunction", "maxDropdownHeight", "shadow", "nothingFound", "onFocus", "onBlur", "searchable", "placeholder", "filter", "limit", "clearSearchOnChange", "clearable", "clearSearchOnBlur", "clearButtonLabel", "variant", "onSearchChange", "disabled", "initiallyOpened", "radius", "icon", "rightSection", "rightSectionWidth", "creatable", "getCreateLabel", "shouldCreate", "onCreate", "sx", "dropdownComponent", "onDropdownClose", "onDropdownOpen", "maxSelectedValues", "withinPortal", "switchDirectionOnFlip", "zIndex", "selectOnBlur", "name", "dropdownPosition", "errorProps", "labelProps", "descriptionProps", "clearButtonTabIndex", "form", "positionDependencies", "onKeyDown", "unstyled", "inputContainer", "inputWrapperOrder", "readOnly", "withAsterisk"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$O({
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
  const filteredData = filterData({
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
    ...__spreadProps$o(__spreadValues$L({}, item), {
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
    ...__spreadValues$L(__spreadValues$L({
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
            ...__spreadValues$L({
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
              classNames: __spreadProps$o(__spreadValues$L({}, classNames), {
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
                ...__spreadValues$L({
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
var __defProp$K = Object.defineProperty;
var __defProps$n = Object.defineProperties;
var __getOwnPropDescs$n = Object.getOwnPropertyDescriptors;
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
var __spreadProps$n = (a, b) => __defProps$n(a, __getOwnPropDescs$n(b));
var __objRest$q = (source, exclude) => {
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
const defaultProps$h = {
  size: "sm"
};
const NativeSelect = react.exports.forwardRef((props, ref) => {
  const _a = useInputProps("NativeSelect", defaultProps$h, props), {
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
  } = _a, others = __objRest$q(_a, ["inputProps", "wrapperProps", "data", "placeholder", "onChange", "value", "classNames", "styles", "rightSection", "rightSectionWidth"]);
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
    ...__spreadProps$n(__spreadValues$K({}, wrapperProps), {
      __staticSelector: "NativeSelect"
    }),
    children: /* @__PURE__ */ jsx(Input, {
      ...__spreadValues$K(__spreadProps$n(__spreadValues$K(__spreadValues$K({}, inputProps), others), {
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
var __defProp$J = Object.defineProperty;
var __defProps$m = Object.defineProperties;
var __getOwnPropDescs$m = Object.getOwnPropertyDescriptors;
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
var __spreadProps$m = (a, b) => __defProps$m(a, __getOwnPropDescs$m(b));
var useStyles$L = createStyles((theme, { color, variant, noWrap, childrenOffset, alignIcon }) => {
  const colors = theme.fn.variant({ variant, color });
  return {
    root: __spreadProps$m(__spreadValues$J({
      display: "flex",
      alignItems: "center",
      width: "100%",
      padding: `8px ${theme.spacing.sm}px`,
      userSelect: "none"
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$J({
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
const useStyles$M = useStyles$L;
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
var __objRest$p = (source, exclude) => {
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
const defaultProps$g = {
  variant: "light",
  childrenOffset: "lg"
};
const _NavLink = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NavLink", defaultProps$g, props), {
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
  } = _a, others = __objRest$p(_a, ["label", "description", "icon", "rightSection", "className", "classNames", "styles", "unstyled", "active", "color", "variant", "noWrap", "children", "opened", "defaultOpened", "onChange", "disableRightSectionRotation", "childrenOffset", "disabled", "onClick"]);
  const {
    classes,
    cx
  } = useStyles$M({
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
      ...__spreadValues$I({
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
var useStyles$J = createStyles((theme, { radius, size }) => ({
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
const useStyles$K = useStyles$J;
var __defProp$H = Object.defineProperty;
var __defProps$l = Object.defineProperties;
var __getOwnPropDescs$l = Object.getOwnPropertyDescriptors;
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
var __spreadProps$l = (a, b) => __defProps$l(a, __getOwnPropDescs$l(b));
var __objRest$o = (source, exclude) => {
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
const defaultProps$f = {
  step: 1,
  hideControls: false,
  size: "sm",
  precision: 0,
  noClampOnBlur: false,
  formatter: defaultFormatter,
  parser: defaultParser
};
const NumberInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("NumberInput", defaultProps$f, props), {
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
  } = _a, others = __objRest$o(_a, ["disabled", "value", "onChange", "decimalSeparator", "min", "max", "startValue", "step", "stepHoldInterval", "stepHoldDelay", "onBlur", "onFocus", "onKeyDown", "onKeyUp", "hideControls", "radius", "variant", "precision", "defaultValue", "noClampOnBlur", "handlersRef", "classNames", "styles", "size", "rightSection", "rightSectionWidth", "formatter", "parser", "inputMode", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$K({
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
    ...__spreadProps$l(__spreadValues$H({}, others), {
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
function DotsIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$G({
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
function NextIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$F({
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
function PrevIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$E({
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
function FirstIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$D({
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
function LastIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$C({
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
var __defProp$B = Object.defineProperty;
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
var __objRest$n = (source, exclude) => {
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
  } = _b, others = __objRest$n(_b, ["page", "active", "onClick"]);
  const theme = useMantineTheme();
  const Item = (theme.dir === "rtl" ? rtlIcons : icons$1)[page];
  const children = Item ? /* @__PURE__ */ jsx(Item, {}) : page;
  return /* @__PURE__ */ jsx("button", {
    ...__spreadValues$B({
      type: "button",
      onClick
    }, others),
    children
  });
}
DefaultItem$1.displayName = "@mantine/core/Pagination/DefaultItem";
var __defProp$A = Object.defineProperty;
var __defProps$k = Object.defineProperties;
var __getOwnPropDescs$k = Object.getOwnPropertyDescriptors;
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
var __spreadProps$k = (a, b) => __defProps$k(a, __getOwnPropDescs$k(b));
const sizes$4 = {
  xs: 22,
  sm: 26,
  md: 32,
  lg: 38,
  xl: 44
};
var useStyles$H = createStyles((theme, { size, radius, color }) => {
  const colors = theme.fn.variant({ color, variant: "filled" });
  return {
    item: __spreadProps$k(__spreadValues$A({}, theme.fn.focusStyles()), {
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      height: theme.fn.size({ size, sizes: sizes$4 }),
      minWidth: theme.fn.size({ size, sizes: sizes$4 }),
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
const useStyles$I = useStyles$H;
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
var __objRest$m = (source, exclude) => {
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
const defaultProps$e = {
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
  const _a = useComponentDefaultProps("Pagination", defaultProps$e, props), {
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
  } = _a, others = __objRest$m(_a, ["itemComponent", "classNames", "styles", "page", "initialPage", "color", "total", "siblings", "boundaries", "size", "radius", "onChange", "getItemAriaLabel", "spacing", "withEdges", "withControls", "sx", "unstyled"]);
  const {
    classes,
    theme
  } = useStyles$I({
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
    ...__spreadValues$z({
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
var __defProp$y = Object.defineProperty;
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
function RadioIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$y({
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
var __defProp$x = Object.defineProperty;
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
var __objRest$l = (source, exclude) => {
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
const defaultProps$d = {
  orientation: "horizontal",
  spacing: "lg",
  offset: "xs",
  size: "sm"
};
const RadioGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("RadioGroup", defaultProps$d, props), {
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
  } = _a, others = __objRest$l(_a, ["children", "value", "defaultValue", "onChange", "orientation", "spacing", "size", "wrapperProps", "unstyled", "offset"]);
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
      ...__spreadValues$x(__spreadValues$x({
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
var __defProp$w = Object.defineProperty;
var __defProps$j = Object.defineProperties;
var __getOwnPropDescs$j = Object.getOwnPropertyDescriptors;
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
var __spreadProps$j = (a, b) => __defProps$j(a, __getOwnPropDescs$j(b));
const sizes$3 = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 30,
  xl: 36
};
const iconSizes$1 = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16
};
var useStyles$F = createStyles((theme, { size, color, transitionDuration }, getRef) => {
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
      width: theme.fn.size({ sizes: iconSizes$1, size }),
      height: theme.fn.size({ sizes: iconSizes$1, size }),
      position: "absolute",
      top: `calc(50% - ${theme.fn.size({ sizes: iconSizes$1, size }) / 2}px)`,
      left: `calc(50% - ${theme.fn.size({ sizes: iconSizes$1, size }) / 2}px)`
    },
    radio: __spreadProps$j(__spreadValues$w({}, theme.fn.focusStyles()), {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      position: "relative",
      appearance: "none",
      width: theme.fn.size({ sizes: sizes$3, size }),
      height: theme.fn.size({ sizes: sizes$3, size }),
      borderRadius: theme.fn.size({ sizes: sizes$3, size }),
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
    label: __spreadProps$j(__spreadValues$w({}, theme.fn.fontStyles()), {
      display: "flex",
      alignItems: "flex-start",
      fontSize: theme.fontSizes[size] || theme.fontSizes.md,
      lineHeight: `${theme.fn.size({ sizes: sizes$3, size })}px`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      paddingLeft: theme.spacing.sm,
      cursor: theme.cursorType,
      "&[data-disabled]": {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
      }
    })
  };
});
const useStyles$G = useStyles$F;
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
var __objRest$k = (source, exclude) => {
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
const defaultProps$c = {
  icon: RadioIcon,
  transitionDuration: 100,
  size: "sm"
};
const Radio = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Radio", defaultProps$c, props), {
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
  } = _a, others = __objRest$k(_a, ["className", "style", "id", "label", "size", "title", "disabled", "color", "classNames", "styles", "sx", "icon", "transitionDuration", "wrapperProps", "unstyled"]);
  const ctx = useRadioGroupContext();
  const {
    classes,
    cx
  } = useStyles$G({
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
    ...__spreadValues$v(__spreadValues$v({
      className: cx(classes.radioWrapper, className),
      style,
      title,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsxs("div", {
      className: classes.inner,
      children: [/* @__PURE__ */ jsx("input", {
        ...__spreadValues$v(__spreadValues$v({
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
var __defProp$u = Object.defineProperty;
var __defProps$i = Object.defineProperties;
var __getOwnPropDescs$i = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$u = Object.getOwnPropertySymbols;
var __hasOwnProp$u = Object.prototype.hasOwnProperty;
var __propIsEnum$u = Object.prototype.propertyIsEnumerable;
var __defNormalProp$u = (obj, key, value) => key in obj ? __defProp$u(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$i = (a, b) => __defProps$i(a, __getOwnPropDescs$i(b));
const WRAPPER_PADDING = 4;
const sizes$2 = {
  xs: "3px 6px",
  sm: "5px 10px",
  md: "7px 14px",
  lg: "9px 16px",
  xl: "12px 20px"
};
var useStyles$D = createStyles((theme, {
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
    label: __spreadProps$i(__spreadValues$u(__spreadValues$u({
      ref: getRef("label")
    }, theme.fn.focusStyles()), theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      borderRadius: theme.fn.radius(radius),
      fontWeight: 500,
      fontSize: size in theme.fontSizes ? theme.fontSizes[size] : theme.fontSizes.sm,
      cursor: "pointer",
      display: "block",
      textAlign: "center",
      padding: sizes$2[size in sizes$2 ? size : "sm"],
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
const useStyles$E = useStyles$D;
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
var __objRest$j = (source, exclude) => {
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
const defaultProps$b = {
  disabled: false,
  size: "sm",
  transitionDuration: 200
};
const SegmentedControl = react.exports.forwardRef((props, ref) => {
  var _b, _c;
  const _a = useComponentDefaultProps("SegmentedControl", defaultProps$b, props), {
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
  } = _a, others = __objRest$j(_a, ["className", "disabled", "data", "name", "value", "onChange", "color", "fullWidth", "radius", "size", "transitionDuration", "transitionTimingFunction", "classNames", "styles", "defaultValue", "orientation", "unstyled"]);
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
  } = useStyles$E({
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
    ...__spreadValues$t({
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
function getSortedBreakpoints(theme, breakpoints) {
  if (breakpoints.length === 0) {
    return breakpoints;
  }
  const property = "maxWidth" in breakpoints[0] ? "maxWidth" : "minWidth";
  const sorted = [...breakpoints].sort((a, b) => theme.fn.size({ size: b[property], sizes: theme.breakpoints }) - theme.fn.size({ size: a[property], sizes: theme.breakpoints }));
  return property === "minWidth" ? sorted.reverse() : sorted;
}
var __defProp$s = Object.defineProperty;
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
var useStyles$B = createStyles((theme, { spacing, breakpoints, cols }) => {
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
    root: __spreadValues$s({
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: theme.fn.size({ size: spacing, sizes: theme.spacing })
    }, gridBreakpoints)
  };
});
const useStyles$C = useStyles$B;
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
const defaultProps$a = {
  breakpoints: [],
  cols: 1,
  spacing: "md"
};
const SimpleGrid = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("SimpleGrid", defaultProps$a, props), {
    className,
    breakpoints,
    cols,
    spacing,
    children,
    unstyled
  } = _a, others = __objRest$i(_a, ["className", "breakpoints", "cols", "spacing", "children", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$C({
    breakpoints,
    cols,
    spacing
  }, {
    unstyled,
    name: "SimpleGrid"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$r({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
SimpleGrid.displayName = "@mantine/core/SimpleGrid";
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
var __defProp$q = Object.defineProperty;
var __defProps$h = Object.defineProperties;
var __getOwnPropDescs$h = Object.getOwnPropertyDescriptors;
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
var __spreadProps$h = (a, b) => __defProps$h(a, __getOwnPropDescs$h(b));
const sizes$1 = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12
};
var useStyles$z = createStyles((theme, { size, disabled }) => ({
  root: __spreadProps$h(__spreadValues$q({}, theme.fn.fontStyles()), {
    WebkitTapHighlightColor: "transparent",
    outline: 0,
    height: theme.fn.size({ sizes: sizes$1, size }) * 2,
    display: "flex",
    alignItems: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    touchAction: "none"
  })
}));
const useStyles$A = useStyles$z;
var __defProp$p = Object.defineProperty;
var __defProps$g = Object.defineProperties;
var __getOwnPropDescs$g = Object.getOwnPropertyDescriptors;
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
var __spreadProps$g = (a, b) => __defProps$g(a, __getOwnPropDescs$g(b));
var useStyles$x = createStyles((theme, { color, size, disabled, thumbSize }) => ({
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
  thumb: __spreadProps$g(__spreadValues$p({}, theme.fn.focusStyles()), {
    boxSizing: "border-box",
    position: "absolute",
    display: disabled ? "none" : "flex",
    height: thumbSize || theme.fn.size({ sizes: sizes$1, size }) * 2,
    width: thumbSize || theme.fn.size({ sizes: sizes$1, size }) * 2,
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
const useStyles$y = useStyles$x;
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
  } = useStyles$y({
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
var useStyles$v = createStyles((theme, { size, color, disabled }) => ({
  markWrapper: {
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  mark: {
    boxSizing: "border-box",
    border: `${theme.fn.size({ size, sizes: sizes$1 }) >= 8 ? "2px" : "1px"} solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
    height: theme.fn.size({ sizes: sizes$1, size }),
    width: theme.fn.size({ sizes: sizes$1, size }),
    borderRadius: 1e3,
    transform: `translateX(-${theme.fn.size({ sizes: sizes$1, size }) / 2}px)`,
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
const useStyles$w = useStyles$v;
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
  } = useStyles$w({
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
var useStyles$t = createStyles((theme, { radius, size, color, disabled }) => ({
  track: {
    position: "relative",
    height: theme.fn.size({ sizes: sizes$1, size }),
    width: "100%",
    marginRight: theme.fn.size({ size, sizes: sizes$1 }),
    marginLeft: theme.fn.size({ size, sizes: sizes$1 }),
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      borderRadius: theme.fn.size({ size: radius, sizes: theme.radius }),
      right: -theme.fn.size({ size, sizes: sizes$1 }),
      left: -theme.fn.size({ size, sizes: sizes$1 }),
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
const useStyles$u = useStyles$t;
var __defProp$o = Object.defineProperty;
var __defProps$f = Object.defineProperties;
var __getOwnPropDescs$f = Object.getOwnPropertyDescriptors;
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
var __spreadProps$f = (a, b) => __defProps$f(a, __getOwnPropDescs$f(b));
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
  } = _b, others = __objRest$h(_b, ["filled", "size", "color", "classNames", "styles", "radius", "children", "offset", "onMouseLeave", "onMouseEnter", "disabled", "marksOffset", "unstyled"]);
  const {
    classes
  } = useStyles$u({
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
          sizes: sizes$1
        })}px)`,
        width: `calc(${filled}% + ${theme.fn.size({
          size,
          sizes: sizes$1
        })}px)`
      })
    }), children, /* @__PURE__ */ jsx(Marks, {
      ...__spreadProps$f(__spreadValues$o({}, others), {
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
var __defProp$n = Object.defineProperty;
var __defProps$e = Object.defineProperties;
var __getOwnPropDescs$e = Object.getOwnPropertyDescriptors;
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
var __spreadProps$e = (a, b) => __defProps$e(a, __getOwnPropDescs$e(b));
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
const SliderRoot = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    className,
    size,
    classNames,
    styles,
    disabled,
    unstyled
  } = _b, others = __objRest$g(_b, ["className", "size", "classNames", "styles", "disabled", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$A({
    size,
    disabled
  }, {
    classNames,
    styles,
    unstyled,
    name: "Slider"
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadProps$e(__spreadValues$n({}, others), {
      tabIndex: -1,
      className: cx(classes.root, className),
      ref
    })
  });
});
SliderRoot.displayName = "@mantine/core/SliderRoot";
var __defProp$m = Object.defineProperty;
var __defProps$d = Object.defineProperties;
var __getOwnPropDescs$d = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$m = Object.getOwnPropertySymbols;
var __hasOwnProp$m = Object.prototype.hasOwnProperty;
var __propIsEnum$m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$m = (obj, key, value) => key in obj ? __defProp$m(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __spreadProps$d = (a, b) => __defProps$d(a, __getOwnPropDescs$d(b));
var __objRest$f = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$m.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$m)
    for (var prop of __getOwnPropSymbols$m(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$m.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultProps$9 = {
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
  const _a = useComponentDefaultProps("Slider", defaultProps$9, props), {
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
  } = _a, others = __objRest$f(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
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
    ...__spreadProps$d(__spreadValues$m({}, others), {
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
var __defProp$l = Object.defineProperty;
var __defProps$c = Object.defineProperties;
var __getOwnPropDescs$c = Object.getOwnPropertyDescriptors;
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
var __spreadProps$c = (a, b) => __defProps$c(a, __getOwnPropDescs$c(b));
var __objRest$e = (source, exclude) => {
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
const defaultProps$8 = {
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
  const _a = useComponentDefaultProps("RangeSlider", defaultProps$8, props), {
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
  } = _a, others = __objRest$e(_a, ["classNames", "styles", "color", "value", "onChange", "onChangeEnd", "size", "radius", "min", "max", "minRange", "step", "precision", "defaultValue", "name", "marks", "label", "labelTransition", "labelTransitionDuration", "labelTransitionTimingFunction", "labelAlwaysOn", "thumbFromLabel", "thumbToLabel", "showLabelOnHover", "thumbChildren", "disabled", "unstyled", "thumbSize"]);
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
    ...__spreadProps$c(__spreadValues$l({}, others), {
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
        ...__spreadProps$c(__spreadValues$l({}, sharedThumbProps), {
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
        ...__spreadProps$c(__spreadValues$l({}, sharedThumbProps), {
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
var __objRest$d = (source, exclude) => {
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
const defaultProps$7 = {
  w: 0,
  h: 0
};
const Space = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Space", defaultProps$7, props), {
    w,
    h,
    sx
  } = _a, others = __objRest$d(_a, ["w", "h", "sx"]);
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$k({
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
var useStyles$r = createStyles((theme, { transitionDuration }) => ({
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
const useStyles$s = useStyles$r;
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
var __objRest$c = (source, exclude) => {
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
const defaultProps$6 = {
  maxHeight: 100,
  transitionDuration: 200,
  initialState: false
};
const Spoiler = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Spoiler", defaultProps$6, props), {
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
  } = _a, others = __objRest$c(_a, ["className", "children", "maxHeight", "hideLabel", "showLabel", "transitionDuration", "controlRef", "initialState", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$s({
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
    ...__spreadValues$j({
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
var __defProp$i = Object.defineProperty;
var __defProps$b = Object.defineProperties;
var __getOwnPropDescs$b = Object.getOwnPropertyDescriptors;
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
var __spreadProps$b = (a, b) => __defProps$b(a, __getOwnPropDescs$b(b));
const iconSizes = {
  xs: 34,
  sm: 36,
  md: 42,
  lg: 48,
  xl: 52
};
var useStyles$p = createStyles((theme, { color, iconSize, size, radius, allowStepClick, iconPosition, orientation }) => {
  const _iconSize = iconSize || theme.fn.size({ size, sizes: iconSizes });
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
    step: __spreadValues$i({
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
    stepCompletedIcon: __spreadProps$b(__spreadValues$i({}, theme.fn.cover()), {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.white
    }),
    stepBody: __spreadValues$i({
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
const useStyles$q = useStyles$p;
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
var __objRest$b = (source, exclude) => {
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
  } = _b, others = __objRest$b(_b, ["className", "state", "color", "icon", "completedIcon", "progressIcon", "label", "description", "withIcon", "iconSize", "size", "radius", "loading", "allowStepClick", "allowStepSelect", "iconPosition", "__staticSelector", "classNames", "styles", "unstyled", "orientation"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$q({
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
    ...__spreadValues$h(__spreadValues$h({
      className: cx(classes.step, className),
      tabIndex: allowStepClick ? 0 : -1,
      ref
    }, dataAttributes), others),
    children: [withIcon && /* @__PURE__ */ jsxs("div", {
      className: classes.stepWrapper,
      children: [/* @__PURE__ */ jsxs("div", {
        ...__spreadValues$h({
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
var __defProp$g = Object.defineProperty;
var __defProps$a = Object.defineProperties;
var __getOwnPropDescs$a = Object.getOwnPropertyDescriptors;
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
var __spreadProps$a = (a, b) => __defProps$a(a, __getOwnPropDescs$a(b));
var useStyles$n = createStyles((theme, {
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
  const separatorOffset = typeof iconSize !== "undefined" ? iconSize / 2 - 1 : theme.fn.size({ size, sizes: iconSizes }) / 2 - 1;
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
    steps: __spreadValues$g(__spreadValues$g({
      display: "flex",
      boxSizing: "border-box",
      alignItems: "center"
    }, orientation === "vertical" ? verticalOrientationStyles.steps : null), shouldBeResponsive ? responsiveStyles.steps : null),
    separator: __spreadValues$g(__spreadValues$g({
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
    content: __spreadProps$a(__spreadValues$g({}, theme.fn.fontStyles()), {
      paddingTop: theme.fn.size({ size: contentPadding, sizes: theme.spacing })
    })
  };
});
const useStyles$o = useStyles$n;
var __defProp$f = Object.defineProperty;
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
var __objRest$a = (source, exclude) => {
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
const defaultProps$5 = {
  contentPadding: "md",
  size: "md",
  radius: "xl",
  orientation: "horizontal",
  iconPosition: "left"
};
const Stepper = react.exports.forwardRef((props, ref) => {
  var _b, _c, _d;
  const _a = useComponentDefaultProps("Stepper", defaultProps$5, props), {
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
  } = _a, others = __objRest$a(_a, ["className", "children", "onStepClick", "active", "completedIcon", "progressIcon", "color", "iconSize", "contentPadding", "size", "radius", "orientation", "breakpoint", "iconPosition", "classNames", "styles", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$o({
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
    ...__spreadValues$f({
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
var __defProp$e = Object.defineProperty;
var __defProps$9 = Object.defineProperties;
var __getOwnPropDescs$9 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$9 = (a, b) => __defProps$9(a, __getOwnPropDescs$9(b));
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
var useStyles$l = createStyles((theme, { size, radius, color, offLabel, onLabel }) => {
  const handleSize = theme.fn.size({ size, sizes: handleSizes });
  const borderRadius = theme.fn.size({ size: radius, sizes: theme.radius });
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    root: {
      display: "flex",
      alignItems: "center"
    },
    input: __spreadProps$9(__spreadValues$e({}, theme.fn.focusStyles()), {
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
    label: __spreadProps$9(__spreadValues$e({}, theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      fontFamily: theme.fontFamily,
      paddingLeft: theme.spacing.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      cursor: theme.cursorType
    })
  };
});
const useStyles$m = useStyles$l;
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
var __objRest$9 = (source, exclude) => {
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
const defaultProps$4 = {
  offLabel: "",
  onLabel: "",
  size: "sm",
  radius: "xl"
};
const Switch = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Switch", defaultProps$4, props), {
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
  } = _a, others = __objRest$9(_a, ["className", "color", "label", "offLabel", "onLabel", "id", "style", "size", "radius", "wrapperProps", "children", "unstyled", "styles", "classNames", "sx"]);
  const {
    classes,
    cx
  } = useStyles$m({
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
    ...__spreadValues$d(__spreadValues$d({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsx("input", {
      ...__spreadProps$8(__spreadValues$d({}, rest), {
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
const TABS_ERRORS = {
  context: "Tabs component was not found in the tree",
  value: "Tabs.Tab or Tabs.Panel component was rendered with invalid value or without value"
};
const [TabsContextProvider, useTabsContext] = createSafeContext(TABS_ERRORS.context);
var __defProp$c = Object.defineProperty;
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
var useStyles$j = createStyles((theme, params) => {
  const vertical = params.orientation === "vertical";
  return {
    tabsList: __spreadValues$c({
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      justifyContent: GROUP_POSITIONS[params.position],
      '& [role="tab"]': {
        flex: params.grow ? 1 : void 0
      }
    }, getVariantStyles$1(params, theme))
  };
});
const useStyles$k = useStyles$j;
var __defProp$b = Object.defineProperty;
var __defProps$7 = Object.defineProperties;
var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
var __objRest$8 = (source, exclude) => {
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
const TabsList = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    children,
    className,
    grow = false,
    position = "left"
  } = _b, others = __objRest$8(_b, ["children", "className", "grow", "position"]);
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
  } = useStyles$k({
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
    ...__spreadProps$7(__spreadValues$b({}, others), {
      className: cx(classes.tabsList, className),
      ref,
      role: "tablist",
      "aria-orientation": orientation
    }),
    children
  });
});
TabsList.displayName = "@mantine/core/TabsList";
var useStyles$h = createStyles((_theme, { orientation }) => ({
  panel: {
    flex: orientation === "vertical" ? 1 : void 0
  }
}));
const useStyles$i = useStyles$h;
var __defProp$a = Object.defineProperty;
var __defProps$6 = Object.defineProperties;
var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
var __objRest$7 = (source, exclude) => {
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
const TabsPanel = react.exports.forwardRef((_a, ref) => {
  var _b = _a, {
    value,
    children,
    sx,
    className
  } = _b, others = __objRest$7(_b, ["value", "children", "sx", "className"]);
  const ctx = useTabsContext();
  const {
    classNames,
    styles,
    unstyled
  } = useContextStylesApi();
  const {
    classes,
    cx
  } = useStyles$i({
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
    ...__spreadProps$6(__spreadValues$a({}, others), {
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
var __defProp$9 = Object.defineProperty;
var __defProps$5 = Object.defineProperties;
var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
function getVariantStyles(theme, { variant, orientation, color, radius, inverted }) {
  const vertical = orientation === "vertical";
  const filledScheme = theme.fn.variant({ color, variant: "filled" });
  const radiusValue = theme.fn.radius(radius);
  const borderRadius = orientation === "vertical" ? `${radiusValue}px 0 0 ${radiusValue}px` : inverted ? `0 0 ${radiusValue}px ${radiusValue}px` : `${radiusValue}px ${radiusValue}px 0 0`;
  if (variant === "default") {
    return __spreadProps$5(__spreadValues$9({
      [vertical ? "borderRight" : inverted ? "borderTop" : "borderBottom"]: "2px solid transparent",
      [vertical ? "marginRight" : inverted ? "marginTop" : "marginBottom"]: -2,
      borderRadius
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    })), {
      "&[data-active]": __spreadValues$9({
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
    return __spreadProps$5(__spreadValues$9({
      borderRadius: theme.fn.radius(radius)
    }, theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    })), {
      "&[data-active]": __spreadValues$9({
        backgroundColor: filledScheme.background,
        color: theme.white
      }, theme.fn.hover({ backgroundColor: filledScheme.background }))
    });
  }
  return {};
}
var useStyles$f = createStyles((theme, params) => ({
  tabLabel: {},
  tab: __spreadValues$9({
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
    "&:disabled": __spreadValues$9({
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
const useStyles$g = useStyles$f;
var __defProp$8 = Object.defineProperty;
var __defProps$4 = Object.defineProperties;
var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
var __objRest$6 = (source, exclude) => {
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
  } = _b, others = __objRest$6(_b, ["value", "children", "onKeyDown", "onClick", "className", "icon", "rightSection", "color"]);
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
  } = useStyles$g({
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
    ...__spreadProps$4(__spreadValues$8({}, others), {
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
var useStyles$d = createStyles((theme, { orientation }) => ({
  root: {
    display: orientation === "vertical" ? "flex" : void 0
  }
}));
const useStyles$e = useStyles$d;
var __defProp$7 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
var __objRest$5 = (source, exclude) => {
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
const defaultProps$3 = {
  orientation: "horizontal",
  loop: true,
  activateTabWithKeyboard: true,
  allowTabDeactivation: false,
  unstyled: false,
  inverted: false,
  variant: "default"
};
const Tabs = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Tabs", defaultProps$3, props), {
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
  } = _a, others = __objRest$5(_a, ["defaultValue", "value", "orientation", "loop", "activateTabWithKeyboard", "allowTabDeactivation", "children", "id", "onTabChange", "variant", "color", "className", "unstyled", "classNames", "styles", "radius", "inverted", "keepMounted"]);
  const {
    classes,
    cx
  } = useStyles$e({
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
        ...__spreadProps$3(__spreadValues$7({}, others), {
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
var __defProp$6 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
const sizes = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40
};
var useStyles$b = createStyles((theme, { color, size, radius, gradient, variant }) => {
  const colors = theme.fn.variant({
    variant,
    color: color || theme.primaryColor,
    gradient,
    primaryFallback: false
  });
  const iconSize = theme.fn.size({ size, sizes });
  return {
    root: __spreadProps$2(__spreadValues$6({}, theme.fn.fontStyles()), {
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
const useStyles$c = useStyles$b;
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
const defaultProps$2 = {
  size: "md",
  variant: "filled",
  gradient: {
    from: "blue",
    to: "cyan",
    deg: 45
  }
};
const ThemeIcon = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("ThemeIcon", defaultProps$2, props), {
    className,
    size,
    radius,
    variant,
    color,
    children,
    gradient,
    unstyled
  } = _a, others = __objRest$4(_a, ["className", "size", "radius", "variant", "color", "children", "gradient", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$c({
    variant,
    radius,
    color,
    size,
    gradient
  }, {
    name: "ThemeIcon",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$5({
      className: cx(classes.root, className),
      ref
    }, others),
    children
  });
});
ThemeIcon.displayName = "@mantine/core/ThemeIcon";
var useStyles$9 = createStyles((theme, { bulletSize, color, radius, align, lineVariant, lineWidth }) => {
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
const useStyles$a = useStyles$9;
var __defProp$4 = Object.defineProperty;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
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
var __objRest$3 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
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
  } = _b, others = __objRest$3(_b, ["className", "bullet", "title", "bulletSize", "radius", "lineWidth", "active", "lineActive", "classNames", "styles", "children", "color", "align", "lineVariant", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$a({
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
    ...__spreadValues$4({
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
const defaultProps$1 = {
  active: -1,
  radius: "xl",
  bulletSize: 20,
  align: "left",
  lineWidth: 4,
  reverseActive: false
};
const Timeline = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Timeline", defaultProps$1, props), {
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
  } = _a, others = __objRest$2(_a, ["children", "active", "color", "radius", "bulletSize", "align", "lineWidth", "classNames", "styles", "sx", "reverseActive", "unstyled"]);
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
    ...__spreadValues$3({
      ref,
      sx: [offset, ...packSx(sx)]
    }, others),
    children: items
  });
});
Timeline.Item = TimelineItem;
Timeline.displayName = "@mantine/core/Timeline";
const ITEM_PADDING = 7;
var useStyles$7 = createStyles((theme, { reversed, native, radius }) => ({
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
const useStyles$8 = useStyles$7;
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
  } = useStyles$8({
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
var __defProp$2 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
var __objRest$1 = (source, exclude) => {
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
function defaultFilter(query, item) {
  return item.label.toLowerCase().trim().includes(query.toLowerCase().trim());
}
const defaultProps = {
  itemComponent: DefaultItem,
  filter: defaultFilter,
  titles: [null, null],
  listHeight: 150,
  listComponent: SelectScrollArea,
  showTransferAll: true,
  limit: Infinity
};
const TransferList = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TransferList", defaultProps, props), {
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
  } = _a, others = __objRest$1(_a, ["value", "onChange", "itemComponent", "searchPlaceholder", "filter", "nothingFound", "titles", "initialSelection", "listHeight", "listComponent", "showTransferAll", "breakpoint", "radius", "classNames", "styles", "limit", "unstyled"]);
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
    ...__spreadValues$2({
      cols: 2,
      spacing: "xl",
      breakpoints,
      ref,
      unstyled
    }, others),
    children: [/* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$1(__spreadValues$2({}, sharedListProps), {
        data: value[0],
        selection: selection[0],
        onSelect: (val) => handlers.select(0, val),
        onMoveAll: () => handleMoveAll(0),
        onMove: () => handleMove(0),
        title: titles[0],
        unstyled
      })
    }), /* @__PURE__ */ jsx(RenderList, {
      ...__spreadProps$1(__spreadValues$2({}, sharedListProps), {
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
var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var useStyles$5 = createStyles((theme) => {
  const headings = keys(theme.headings.sizes).reduce((acc, h) => {
    const values = theme.headings.sizes[h];
    acc[`& ${h}`] = __spreadProps(__spreadValues$1({
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
    root: __spreadProps(__spreadValues$1(__spreadProps(__spreadValues$1({}, theme.fn.fontStyles()), {
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
      "& a": __spreadProps(__spreadValues$1({}, theme.fn.focusStyles()), {
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
const useStyles$6 = useStyles$5;
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
const TypographyStylesProvider = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("TypographyStylesProvider", {}, props), {
    className,
    unstyled
  } = _a, others = __objRest(_a, ["className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$6(null, {
    name: "TypographyStylesProvider",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues({
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
  ChevronIcon,
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
  COLOR_PICKER_SIZES: sizes$8,
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
  INPUT_SIZES: sizes$9,
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
  SelectChevronIcon: ChevronIcon$1,
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
const useStyles$4 = createStyles((theme) => ({
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
  } = useStyles$4();
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
const useStyles$3 = createStyles((theme) => ({
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
  } = useStyles$3();
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
const useStyles$2 = createStyles((theme) => ({
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
  } = useStyles$2();
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
  const params = useParams$1();
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
  const updateUser = useMutation((data) => GenericService.update("users", data), {
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
  const deleteUser = useMutation((userId) => GenericService.delete("users", userId), {
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
        return GenericService.get("users", {
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
  const addUser = useMutation((data) => GenericService.create("users", data), {
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
          mb: 150,
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
function Boolean({
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
  Boolean
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
  const updateSetting = useMutation((data) => GenericService.update("settings", data), {
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
  const settingsQuery = useQuery(["settings"], () => GenericService.get("settings"), {
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
const useStyles$1 = createStyles(adminLogsCreateStyle);
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
  } = useStyles$1();
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
const useStyles = createStyles(adminLogsCreateStyle);
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
  } = useStyles();
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
function useParams() {
  const [query, setQuery] = useQueryParams({
    sortBy: StringParam,
    filter: JsonParam,
    base_filter: JsonParam
  });
  const updateQueryJsonParam = (section, key, value) => {
    const current = query[section];
    const newParam = {
      ...current,
      [key]: value
    };
    setQuery({
      [section]: newParam
    });
  };
  return {
    query,
    setQuery,
    updateQueryJsonParam
  };
}
function AdminLogsTableSettings({
  open,
  setSortOpen,
  visibleFields,
  setVisibleFields
}) {
  const {
    setQuery
  } = useParams();
  const [sortOrder, toggleSortOrder] = useToggle(["desc", "asc"]);
  const [selectOptionsData] = react.exports.useState(() => Object.keys(adminLogsTableColumns).map((column) => ({
    value: column,
    label: adminLogsTableColumns[column].label
  })));
  const [sortItemValue, setSortItemValue] = useInputState("timestamp");
  react.exports.useEffect(() => {
    setTimeout(() => setQuery({
      sortBy: `${sortItemValue}:${sortOrder}`
    }), 0);
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
  setOpen
}) {
  const {
    setQuery
  } = useParams();
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
    setQuery({
      filter: createFilterObject()
    });
  };
  const groups = Object.keys(groupsData).filter((x) => x !== "mainGroup").map((key, index2) => /* @__PURE__ */ jsx(LogicalGroup, {
    testAttr: `filter-group-${index2}`,
    fields: adminLogsTableColumns,
    setGroupsData,
    groupsData,
    removeGroupsData,
    id: key
  }, key));
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
const InfinityScrollSkeletonFiller = ({
  visibleFields
}) => {
  return Object.keys(new Array(6).fill("")).map((x) => /* @__PURE__ */ jsxs("tr", {
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
  }, x));
};
function AdminLogs() {
  var _a;
  const {
    toolbar,
    setToolbar,
    updateToolbar
  } = react.exports.useContext(AppContext);
  const [query] = useQueryParams({
    groupBy: StringParam,
    sortBy: StringParam,
    filter: JsonParam,
    base_filter: JsonParam
  });
  const theme = useMantineTheme();
  useSubpageEffect("Logs");
  useSearchParams();
  const [sortOpen, setSortOpen] = react.exports.useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = react.exports.useState(false);
  const {
    firstPageQuery,
    infinityQuery,
    newestItemsQuery
  } = useInfinityScroll({
    resourceName: "logs",
    filterObj: query["filter"],
    newestItemsFilterKey: "timestamp",
    sortBy: query["sortBy"] || ""
  });
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
        setIsFilterDrawerOpen((prev) => !prev);
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
  react.exports.useEffect(function filterSortUpdate() {
    firstPageQuery.refetch();
  }, [JSON.stringify(query["filter"]), JSON.stringify(query["sortBy"])]);
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(Group, {
      position: "apart",
      align: "start",
      noWrap: true,
      children: [infinityQuery.status === "loading" ? /* @__PURE__ */ jsx(Table, {
        children: /* @__PURE__ */ jsx(InfinityScrollSkeletonFiller, {
          visibleFields
        })
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
        setVisibleFields
      }), /* @__PURE__ */ jsx(AdminLogsTableFilter, {
        open: isFilterDrawerOpen,
        setOpen: setIsFilterDrawerOpen
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
    children: /* @__PURE__ */ jsx(QueryParamProvider, {
      adapter: ReactRouter6Adapter,
      options: {
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify
      },
      children: /* @__PURE__ */ jsx(App, {})
    })
  })
}));
