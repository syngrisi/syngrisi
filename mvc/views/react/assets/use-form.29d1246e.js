import { c as createStyles, r as react, E as useComponentDefaultProps, b as jsx, T as Text, F as createPolymorphicComponent, B as Box, G as Group, H as useUncontrolled, I as Input, J as useId, K as extractSystemStyles, j as jsxs, L as getDefaultZIndex, O as Transition, R as Loader, S as Overlay, U as sizes$1, d as useMantineTheme, V as useDisclosure, A as ActionIcon } from "./Logger.785098d6.js";
var useStyles$a = createStyles(() => ({
  root: {
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: 0,
    border: 0
  }
}));
const useStyles$b = useStyles$a;
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
var __objRest$7 = (source, exclude) => {
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
const defaultProps$6 = {};
const _Anchor = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Anchor", defaultProps$6, props), {
    component,
    className,
    unstyled
  } = _a, others = __objRest$7(_a, ["component", "className", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$b(null, {
    name: "Anchor",
    unstyled
  });
  const buttonProps = component === "button" ? {
    type: "button"
  } : null;
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$c(__spreadValues$c({
      component: component || "a",
      variant: "link",
      ref,
      className: cx(classes.root, className)
    }, buttonProps), others)
  });
});
_Anchor.displayName = "@mantine/core/Anchor";
const Anchor = createPolymorphicComponent(_Anchor);
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
function CheckIcon(props) {
  return /* @__PURE__ */ jsx("svg", {
    ...__spreadValues$b({
      viewBox: "0 0 10 7",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props),
    children: /* @__PURE__ */ jsx("path", {
      d: "M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z",
      fill: "currentColor",
      fillRule: "evenodd",
      clipRule: "evenodd"
    })
  });
}
function CheckboxIcon(_a) {
  var _b = _a, {
    indeterminate
  } = _b, others = __objRest$6(_b, ["indeterminate"]);
  if (indeterminate) {
    return /* @__PURE__ */ jsx("svg", {
      ...__spreadValues$b({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 32 6"
      }, others),
      children: /* @__PURE__ */ jsx("rect", {
        width: "32",
        height: "6",
        fill: "currentColor",
        rx: "3"
      })
    });
  }
  return /* @__PURE__ */ jsx(CheckIcon, {
    ...__spreadValues$b({}, others)
  });
}
var useStyles$8 = createStyles((theme, { spacing, align, justify }) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    justifyContent: justify,
    gap: theme.fn.size({ size: spacing, sizes: theme.spacing })
  }
}));
const useStyles$9 = useStyles$8;
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
var __objRest$5 = (source, exclude) => {
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
  spacing: "md",
  align: "stretch",
  justify: "top"
};
const Stack = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Stack", defaultProps$5, props), {
    spacing,
    className,
    align,
    justify,
    unstyled
  } = _a, others = __objRest$5(_a, ["spacing", "className", "align", "justify", "unstyled"]);
  const {
    classes,
    cx
  } = useStyles$9({
    spacing,
    align,
    justify
  }, {
    name: "Stack",
    unstyled
  });
  return /* @__PURE__ */ jsx(Box, {
    ...__spreadValues$a({
      className: cx(classes.root, className),
      ref
    }, others)
  });
});
Stack.displayName = "@mantine/core/Stack";
function InputsGroup({
  spacing,
  offset,
  orientation,
  children,
  role,
  unstyled
}) {
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsx(Group, {
      pt: offset,
      spacing,
      role,
      unstyled,
      children
    });
  }
  return /* @__PURE__ */ jsx(Stack, {
    pt: offset,
    spacing,
    role,
    unstyled,
    children
  });
}
const CheckboxGroupContext = react.exports.createContext(null);
const CheckboxGroupProvider = CheckboxGroupContext.Provider;
const useCheckboxGroupContext = () => react.exports.useContext(CheckboxGroupContext);
var __defProp$9 = Object.defineProperty;
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
var __objRest$4 = (source, exclude) => {
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
const defaultProps$4 = {
  orientation: "horizontal",
  spacing: "lg",
  size: "sm",
  offset: "xs"
};
const CheckboxGroup = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("CheckboxGroup", defaultProps$4, props), {
    children,
    value,
    defaultValue,
    onChange,
    orientation,
    spacing,
    size,
    wrapperProps,
    offset
  } = _a, others = __objRest$4(_a, ["children", "value", "defaultValue", "onChange", "orientation", "spacing", "size", "wrapperProps", "offset"]);
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
  return /* @__PURE__ */ jsx(CheckboxGroupProvider, {
    value: {
      value: _value,
      onChange: handleChange,
      size
    },
    children: /* @__PURE__ */ jsx(Input.Wrapper, {
      ...__spreadValues$9(__spreadValues$9({
        labelElement: "div",
        size,
        __staticSelector: "CheckboxGroup",
        ref
      }, wrapperProps), others),
      children: /* @__PURE__ */ jsx(InputsGroup, {
        spacing,
        orientation,
        offset,
        children
      })
    })
  });
});
CheckboxGroup.displayName = "@mantine/core/CheckboxGroup";
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
const sizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 30,
  xl: 36
};
const iconSizes$1 = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20
};
var useStyles$6 = createStyles((theme, { size, radius, color, transitionDuration }, getRef) => {
  const _size = theme.fn.size({ size, sizes });
  const colors = theme.fn.variant({ variant: "filled", color });
  return {
    icon: {
      ref: getRef("icon"),
      color: theme.white,
      transform: "translateY(5px) scale(0.5)",
      opacity: 0,
      transitionProperty: "opacity, transform",
      transitionTimingFunction: "ease",
      transitionDuration: `${transitionDuration}ms`,
      pointerEvents: "none",
      width: theme.fn.size({ size, sizes: iconSizes$1 }),
      position: "absolute",
      zIndex: 1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto",
      "@media (prefers-reduced-motion)": {
        transitionDuration: theme.respectReducedMotion ? "0ms" : void 0
      }
    },
    root: {
      display: "flex",
      alignItems: "center"
    },
    inner: {
      position: "relative",
      width: _size,
      height: _size
    },
    label: __spreadProps$5(__spreadValues$8({}, theme.fn.fontStyles()), {
      WebkitTapHighlightColor: "transparent",
      paddingLeft: theme.spacing.sm,
      fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
      lineHeight: `${_size}px`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      cursor: theme.cursorType
    }),
    input: __spreadProps$5(__spreadValues$8({}, theme.fn.focusStyles()), {
      appearance: "none",
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]}`,
      width: _size,
      height: _size,
      borderRadius: theme.fn.radius(radius),
      padding: 0,
      display: "block",
      margin: 0,
      transition: `border-color ${transitionDuration}ms ease, background-color ${transitionDuration}ms ease`,
      cursor: theme.cursorType,
      "&:checked": {
        backgroundColor: colors.background,
        borderColor: colors.background,
        [`& + .${getRef("icon")}`]: {
          opacity: 1,
          transform: "translateY(0) scale(1)"
        }
      },
      "&:disabled": {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
        borderColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3],
        cursor: "not-allowed",
        [`& + .${getRef("icon")}`]: {
          color: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[5]
        }
      }
    })
  };
});
const useStyles$7 = useStyles$6;
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
var __objRest$3 = (source, exclude) => {
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
  size: "sm",
  transitionDuration: 100,
  icon: CheckboxIcon
};
const Checkbox = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Checkbox", defaultProps$3, props), {
    className,
    style,
    sx,
    checked,
    color,
    label,
    indeterminate,
    id,
    size,
    radius,
    wrapperProps,
    children,
    classNames,
    styles,
    transitionDuration,
    icon: Icon,
    unstyled
  } = _a, others = __objRest$3(_a, ["className", "style", "sx", "checked", "color", "label", "indeterminate", "id", "size", "radius", "wrapperProps", "children", "classNames", "styles", "transitionDuration", "icon", "unstyled"]);
  const ctx = useCheckboxGroupContext();
  const uuid = useId(id);
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const {
    classes,
    cx
  } = useStyles$7({
    size: (ctx == null ? void 0 : ctx.size) || size,
    radius,
    color,
    transitionDuration
  }, {
    name: "Checkbox",
    classNames,
    styles,
    unstyled
  });
  const contextProps = ctx ? {
    checked: ctx.value.includes(rest.value),
    onChange: ctx.onChange
  } : {};
  return /* @__PURE__ */ jsxs(Box, {
    ...__spreadValues$7(__spreadValues$7({
      className: cx(classes.root, className),
      style,
      sx
    }, systemStyles), wrapperProps),
    children: [/* @__PURE__ */ jsxs("div", {
      className: classes.inner,
      children: [/* @__PURE__ */ jsx("input", {
        ...__spreadValues$7(__spreadValues$7({
          id: uuid,
          ref,
          type: "checkbox",
          className: classes.input,
          checked: indeterminate || checked
        }, rest), contextProps)
      }), /* @__PURE__ */ jsx(Icon, {
        indeterminate,
        className: classes.icon
      })]
    }), label && /* @__PURE__ */ jsx("label", {
      className: classes.label,
      htmlFor: uuid,
      children: label
    })]
  });
});
Checkbox.displayName = "@mantine/core/Checkbox";
Checkbox.Group = CheckboxGroup;
var useStyles$4 = createStyles({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
});
const useStyles$5 = useStyles$4;
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
var __objRest$2 = (source, exclude) => {
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
const defaultProps$2 = {
  overlayOpacity: 0.75,
  transitionDuration: 0,
  zIndex: getDefaultZIndex("overlay")
};
const LoadingOverlay = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("LoadingOverlay", defaultProps$2, props), {
    className,
    visible,
    loaderProps,
    overlayOpacity,
    overlayColor,
    transitionDuration,
    exitTransitionDuration,
    zIndex,
    style,
    loader,
    radius,
    overlayBlur,
    unstyled
  } = _a, others = __objRest$2(_a, ["className", "visible", "loaderProps", "overlayOpacity", "overlayColor", "transitionDuration", "exitTransitionDuration", "zIndex", "style", "loader", "radius", "overlayBlur", "unstyled"]);
  const {
    classes,
    cx,
    theme
  } = useStyles$5(null, {
    name: "LoadingOverlay",
    unstyled
  });
  const _zIndex = `calc(${zIndex} + 1)`;
  return /* @__PURE__ */ jsx(Transition, {
    duration: transitionDuration,
    exitDuration: exitTransitionDuration,
    mounted: visible,
    transition: "fade",
    children: (transitionStyles) => /* @__PURE__ */ jsxs(Box, {
      ...__spreadValues$6({
        className: cx(classes.root, className),
        style: __spreadProps$4(__spreadValues$6(__spreadValues$6({}, transitionStyles), style), {
          zIndex
        }),
        ref
      }, others),
      children: [loader ? /* @__PURE__ */ jsx("div", {
        style: {
          zIndex: _zIndex
        },
        children: loader
      }) : /* @__PURE__ */ jsx(Loader, {
        ...__spreadValues$6({
          style: {
            zIndex: _zIndex
          }
        }, loaderProps)
      }), /* @__PURE__ */ jsx(Overlay, {
        opacity: overlayOpacity,
        zIndex,
        radius,
        blur: overlayBlur,
        unstyled,
        color: overlayColor || (theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white)
      })]
    })
  });
});
LoadingOverlay.displayName = "@mantine/core/LoadingOverlay";
const PasswordToggleIcon = ({
  reveal,
  size = 15
}) => /* @__PURE__ */ jsx("svg", {
  width: size,
  height: size,
  viewBox: "0 0 15 15",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: /* @__PURE__ */ jsx("path", {
    d: reveal ? "M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z" : "M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z",
    fill: "currentColor",
    fillRule: "evenodd",
    clipRule: "evenodd"
  })
});
var __defProp$5 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var useStyles$2 = createStyles((theme, { size, rightSectionWidth }) => ({
  visibilityToggle: {},
  input: {
    position: "relative",
    overflow: "hidden"
  },
  innerInput: __spreadProps$3(__spreadValues$5({}, theme.fn.fontStyles()), {
    backgroundColor: "transparent",
    border: 0,
    boxSizing: "border-box",
    position: "absolute",
    display: "block",
    width: `calc(100% - ${rightSectionWidth}px)`,
    paddingLeft: theme.fn.size({ size, sizes: sizes$1 }) / 3,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    height: theme.fn.size({ size, sizes: sizes$1 }) - 2,
    lineHeight: `${theme.fn.size({ size, sizes: sizes$1 }) - 2}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    "&:focus": {
      outline: 0
    },
    "&:disabled": {
      cursor: "not-allowed"
    },
    "&::placeholder": {
      opacity: 1,
      userSelect: "none",
      color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[5]
    }
  }),
  invalid: {
    color: theme.fn.variant({ variant: "filled", color: "red" }).background,
    "&::placeholder": {
      opacity: 1,
      color: theme.fn.variant({ variant: "filled", color: "red" }).background
    }
  },
  withIcon: {
    paddingLeft: `${theme.fn.size({ size, sizes: sizes$1 })}px !important`
  }
}));
const useStyles$3 = useStyles$2;
var __defProp$4 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
var __objRest$1 = (source, exclude) => {
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
const buttonSizes = {
  xs: 22,
  sm: 28,
  md: 26,
  lg: 32,
  xl: 40
};
const iconSizes = {
  xs: 12,
  sm: 15,
  md: 17,
  lg: 19,
  xl: 21
};
const rightSectionSizes = {
  xs: 28,
  sm: 34,
  md: 34,
  lg: 44,
  xl: 54
};
const defaultProps$1 = {
  size: "sm",
  toggleTabIndex: -1,
  visibilityToggleIcon: PasswordToggleIcon,
  __staticSelector: "PasswordInput"
};
const PasswordInput = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("PasswordInput", defaultProps$1, props), {
    radius,
    disabled,
    size,
    toggleTabIndex,
    className,
    id,
    label,
    error,
    required,
    style,
    icon,
    description,
    wrapperProps,
    classNames,
    styles,
    variant,
    visibilityToggleIcon: VisibilityToggleIcon,
    __staticSelector,
    rightSection: _rightSection,
    rightSectionWidth: _rightSectionWidth,
    rightSectionProps: _rightSectionProps,
    sx,
    labelProps,
    descriptionProps,
    errorProps,
    unstyled,
    visibilityToggleLabel,
    withAsterisk
  } = _a, others = __objRest$1(_a, ["radius", "disabled", "size", "toggleTabIndex", "className", "id", "label", "error", "required", "style", "icon", "description", "wrapperProps", "classNames", "styles", "variant", "visibilityToggleIcon", "__staticSelector", "rightSection", "rightSectionWidth", "rightSectionProps", "sx", "labelProps", "descriptionProps", "errorProps", "unstyled", "visibilityToggleLabel", "withAsterisk"]);
  const theme = useMantineTheme();
  const rightSectionWidth = theme.fn.size({
    size,
    sizes: rightSectionSizes
  });
  const {
    classes,
    cx
  } = useStyles$3({
    size,
    rightSectionWidth
  }, {
    name: "PasswordInput",
    classNames,
    styles,
    unstyled
  });
  const uuid = useId(id);
  const {
    systemStyles,
    rest
  } = extractSystemStyles(others);
  const [reveal, {
    toggle
  }] = useDisclosure(false);
  const rightSection = /* @__PURE__ */ jsx(ActionIcon, {
    className: classes.visibilityToggle,
    tabIndex: toggleTabIndex,
    radius,
    size: theme.fn.size({
      size,
      sizes: buttonSizes
    }),
    "aria-hidden": !visibilityToggleLabel,
    "aria-label": visibilityToggleLabel,
    unstyled,
    onMouseDown: (event) => {
      event.preventDefault();
      toggle();
    },
    onKeyDown: (event) => {
      if (event.key === " ") {
        event.preventDefault();
        toggle();
      }
    },
    children: /* @__PURE__ */ jsx(VisibilityToggleIcon, {
      reveal,
      size: theme.fn.size({
        size,
        sizes: iconSizes
      })
    })
  });
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$4(__spreadValues$4({
      required,
      id: uuid,
      label,
      error,
      description,
      size,
      className,
      style,
      classNames,
      styles,
      __staticSelector,
      sx,
      errorProps,
      descriptionProps,
      labelProps,
      unstyled,
      withAsterisk
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      component: "div",
      invalid: !!error,
      icon,
      size,
      classNames: __spreadProps$2(__spreadValues$4({}, classNames), {
        input: classes.input
      }),
      styles,
      radius,
      disabled,
      __staticSelector,
      rightSectionWidth,
      rightSection: !disabled && rightSection,
      variant,
      unstyled,
      children: /* @__PURE__ */ jsx("input", {
        ...__spreadValues$4({
          type: reveal ? "text" : "password",
          required,
          className: cx(classes.innerInput, {
            [classes.withIcon]: icon,
            [classes.invalid]: !!error
          }),
          disabled,
          id: uuid,
          ref
        }, rest)
      })
    })
  });
});
PasswordInput.displayName = "@mantine/core/PasswordInput";
var __defProp$3 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
function getFontSize(size, element, theme) {
  if (typeof size !== "undefined") {
    return size in theme.headings.sizes ? theme.headings.sizes[size].fontSize : size;
  }
  return theme.headings.sizes[element].fontSize;
}
function getLineHeight(size, element, theme) {
  if (typeof size !== "undefined" && size in theme.headings.sizes) {
    return theme.headings.sizes[size].lineHeight;
  }
  return theme.headings.sizes[element].lineHeight;
}
var useStyles = createStyles((theme, { element, weight, size, inline }) => ({
  root: __spreadProps$1(__spreadValues$3({}, theme.fn.fontStyles()), {
    fontFamily: theme.headings.fontFamily,
    fontWeight: weight || theme.headings.sizes[element].fontWeight || theme.headings.fontWeight,
    fontSize: getFontSize(size, element, theme),
    lineHeight: inline ? 1 : getLineHeight(size, element, theme),
    margin: 0
  })
}));
const useStyles$1 = useStyles;
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
var __objRest = (source, exclude) => {
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
const defaultProps = {
  order: 1
};
const Title = react.exports.forwardRef((props, ref) => {
  const _a = useComponentDefaultProps("Title", defaultProps, props), {
    className,
    order,
    children,
    unstyled,
    size,
    weight,
    inline
  } = _a, others = __objRest(_a, ["className", "order", "children", "unstyled", "size", "weight", "inline"]);
  const {
    classes,
    cx
  } = useStyles$1({
    element: `h${order}`,
    weight,
    size,
    inline
  }, {
    name: "Title",
    unstyled
  });
  if (![1, 2, 3, 4, 5, 6].includes(order)) {
    return null;
  }
  return /* @__PURE__ */ jsx(Text, {
    ...__spreadValues$2({
      component: `h${order}`,
      ref,
      className: cx(classes.root, className)
    }, others),
    children
  });
});
Title.displayName = "@mantine/core/Title";
var fastDeepEqual = function equal(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor)
      return false;
    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!equal(a[i], b[i]))
          return false;
      return true;
    }
    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      var key = keys[i];
      if (!equal(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
};
function filterErrors(errors) {
  if (errors === null || typeof errors !== "object") {
    return {};
  }
  return Object.keys(errors).reduce((acc, key) => {
    const errorValue = errors[key];
    if (errorValue !== void 0 && errorValue !== null && errorValue !== false) {
      acc[key] = errorValue;
    }
    return acc;
  }, {});
}
function shouldValidateOnChange(path, validateInputOnChange) {
  if (!validateInputOnChange) {
    return false;
  }
  if (typeof validateInputOnChange === "boolean") {
    return validateInputOnChange;
  }
  if (Array.isArray(validateInputOnChange)) {
    return validateInputOnChange.includes(path);
  }
  return false;
}
function getSplittedPath(path) {
  if (typeof path !== "string") {
    return [];
  }
  return path.split(".");
}
function getPath(path, values) {
  const splittedPath = getSplittedPath(path);
  if (splittedPath.length === 0 || typeof values !== "object" || values === null) {
    return void 0;
  }
  let value = values[splittedPath[0]];
  for (let i = 1; i < splittedPath.length; i += 1) {
    if (value === void 0) {
      break;
    }
    value = value[splittedPath[i]];
  }
  return value;
}
function klona(x) {
  if (typeof x !== "object")
    return x;
  var k, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    if (x.constructor !== Object && typeof x.constructor === "function") {
      tmp = new x.constructor();
      for (k in x) {
        if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
          tmp[k] = klona(x[k]);
        }
      }
    } else {
      tmp = {};
      for (k in x) {
        if (k === "__proto__") {
          Object.defineProperty(tmp, k, {
            value: klona(x[k]),
            configurable: true,
            enumerable: true,
            writable: true
          });
        } else {
          tmp[k] = klona(x[k]);
        }
      }
    }
    return tmp;
  }
  if (str === "[object Array]") {
    k = x.length;
    for (tmp = Array(k); k--; ) {
      tmp[k] = klona(x[k]);
    }
    return tmp;
  }
  if (str === "[object Set]") {
    tmp = /* @__PURE__ */ new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
    return tmp;
  }
  if (str === "[object Map]") {
    tmp = /* @__PURE__ */ new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
    return tmp;
  }
  if (str === "[object Date]") {
    return new Date(+x);
  }
  if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
    tmp.lastIndex = x.lastIndex;
    return tmp;
  }
  if (str === "[object DataView]") {
    return new x.constructor(klona(x.buffer));
  }
  if (str === "[object ArrayBuffer]") {
    return x.slice(0);
  }
  if (str.slice(-6) === "Array]") {
    return new x.constructor(x);
  }
  return x;
}
function setPath(path, value, values) {
  const splittedPath = getSplittedPath(path);
  if (splittedPath.length === 0) {
    return values;
  }
  const cloned = klona(values);
  if (splittedPath.length === 1) {
    cloned[splittedPath[0]] = value;
    return cloned;
  }
  let val = cloned[splittedPath[0]];
  for (let i = 1; i < splittedPath.length - 1; i += 1) {
    if (val === void 0) {
      return cloned;
    }
    val = val[splittedPath[i]];
  }
  val[splittedPath[splittedPath.length - 1]] = value;
  return cloned;
}
function getValidationResults(errors) {
  const filteredErrors = filterErrors(errors);
  return { hasErrors: Object.keys(filteredErrors).length > 0, errors: filteredErrors };
}
function validateRulesRecord(rules, values, path = "", errors = {}) {
  if (typeof rules !== "object" || rules === null) {
    return errors;
  }
  return Object.keys(rules).reduce((acc, ruleKey) => {
    const rule = rules[ruleKey];
    const rulePath = `${path === "" ? "" : `${path}.`}${ruleKey}`;
    const value = getPath(rulePath, values);
    let arrayValidation = false;
    if (typeof rule === "function") {
      acc[rulePath] = rule(value, values, rulePath);
    }
    if (typeof rule === "object" && Array.isArray(value)) {
      arrayValidation = true;
      value.forEach((_item, index) => validateRulesRecord(rule, values, `${rulePath}.${index}`, acc));
    }
    if (typeof rule === "object" && typeof value === "object" && value !== null) {
      if (!arrayValidation) {
        validateRulesRecord(rule, values, rulePath, acc);
      }
    }
    return acc;
  }, errors);
}
function validateValues(validate, values) {
  if (typeof validate === "function") {
    return getValidationResults(validate(values));
  }
  return getValidationResults(validateRulesRecord(validate, values));
}
function validateFieldValue(path, rules, values) {
  if (typeof path !== "string") {
    return { hasError: false, error: null };
  }
  const results = validateValues(rules, values);
  const hasError = path in results.errors;
  return { hasError, error: hasError ? results.errors[path] : null };
}
function reorderPath(path, { from, to }, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  const item = currentValue[from];
  cloned.splice(from, 1);
  cloned.splice(to, 0, item);
  return setPath(path, cloned, values);
}
function removePath(path, index, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  return setPath(path, currentValue.filter((_, itemIndex) => itemIndex !== index), values);
}
var __defProp$1 = Object.defineProperty;
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
function clearListState(field, state) {
  if (state === null || typeof state !== "object") {
    return {};
  }
  const clone = __spreadValues$1({}, state);
  Object.keys(state).forEach((errorKey) => {
    if (errorKey.includes(`${String(field)}.`)) {
      delete clone[errorKey];
    }
  });
  return clone;
}
function insertPath(path, value, index, values) {
  const currentValue = getPath(path, values);
  if (!Array.isArray(currentValue)) {
    return values;
  }
  const cloned = [...currentValue];
  cloned.splice(typeof index === "number" ? index : cloned.length, 0, value);
  return setPath(path, cloned, values);
}
function getStatus(status, path) {
  const paths = Object.keys(status);
  if (typeof path === "string") {
    const nestedPaths = paths.filter((statusPath) => statusPath.includes(`${path}.`));
    return status[path] || nestedPaths.some((statusPath) => status[statusPath]) || false;
  }
  return paths.some((statusPath) => status[statusPath]);
}
function getInputOnChange(setValue) {
  return (val) => {
    if (!val) {
      setValue(val);
    } else if (typeof val === "function") {
      setValue(val);
    } else if (typeof val === "object" && "nativeEvent" in val) {
      const { currentTarget } = val;
      if (currentTarget instanceof HTMLInputElement) {
        if (currentTarget.type === "checkbox") {
          setValue(currentTarget.checked);
        } else {
          setValue(currentTarget.value);
        }
      } else if (currentTarget instanceof HTMLTextAreaElement || currentTarget instanceof HTMLSelectElement) {
        setValue(currentTarget.value);
      }
    } else {
      setValue(val);
    }
  };
}
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function useForm({
  initialValues = {},
  initialErrors = {},
  initialDirty = {},
  initialTouched = {},
  clearInputErrorOnChange = true,
  validateInputOnChange = false,
  validate: rules
} = {}) {
  const [touched, setTouched] = react.exports.useState(initialTouched);
  const [dirty, setDirty] = react.exports.useState(initialDirty);
  const [values, _setValues] = react.exports.useState(initialValues);
  const [errors, _setErrors] = react.exports.useState(filterErrors(initialErrors));
  const _dirtyValues = react.exports.useRef(initialValues);
  const _setDirtyValues = (_values) => {
    _dirtyValues.current = _values;
  };
  const resetTouched = react.exports.useCallback(() => setTouched({}), []);
  const resetDirty = (_values) => {
    _setDirtyValues(_values || values);
    setDirty({});
  };
  const setErrors = react.exports.useCallback((errs) => _setErrors((current) => filterErrors(typeof errs === "function" ? errs(current) : errs)), []);
  const clearErrors = react.exports.useCallback(() => _setErrors({}), []);
  const reset = react.exports.useCallback(() => {
    _setValues(initialValues);
    clearErrors();
    resetDirty(initialValues);
    resetTouched();
  }, []);
  const setFieldError = react.exports.useCallback((path, error) => setErrors((current) => __spreadProps(__spreadValues({}, current), { [path]: error })), []);
  const clearFieldError = react.exports.useCallback((path) => setErrors((current) => {
    if (typeof path !== "string") {
      return current;
    }
    const clone = __spreadValues({}, current);
    delete clone[path];
    return clone;
  }), []);
  const setFieldValue = react.exports.useCallback((path, value) => {
    const shouldValidate = shouldValidateOnChange(path, validateInputOnChange);
    _setValues((current) => {
      const initialValue = getPath(path, _dirtyValues.current);
      const isFieldDirty = !fastDeepEqual(initialValue, value);
      setDirty((currentDirty) => __spreadProps(__spreadValues({}, currentDirty), { [path]: isFieldDirty }));
      setTouched((currentTouched) => __spreadProps(__spreadValues({}, currentTouched), { [path]: true }));
      const result = setPath(path, value, current);
      if (shouldValidate) {
        const validationResults = validateFieldValue(path, rules, result);
        validationResults.hasError ? setFieldError(path, validationResults.error) : clearFieldError(path);
      }
      return result;
    });
    !shouldValidate && clearInputErrorOnChange && setFieldError(path, null);
  }, []);
  const setValues = react.exports.useCallback((payload) => {
    _setValues(payload);
    clearInputErrorOnChange && clearErrors();
  }, []);
  const reorderListItem = react.exports.useCallback((path, payload) => _setValues((current) => reorderPath(path, payload, current)), []);
  const removeListItem = react.exports.useCallback((path, index) => {
    _setValues((current) => removePath(path, index, current));
    _setErrors((errs) => clearListState(path, errs));
    setDirty((current) => clearListState(`${String(path)}.${index}`, current));
  }, []);
  const insertListItem = react.exports.useCallback((path, item, index) => _setValues((current) => insertPath(path, item, index, current)), []);
  const validate = react.exports.useCallback(() => {
    const results = validateValues(rules, values);
    _setErrors(results.errors);
    return results;
  }, [values, rules]);
  const validateField = react.exports.useCallback((path) => {
    const results = validateFieldValue(path, rules, values);
    results.hasError ? setFieldError(path, results.error) : clearFieldError(path);
    return results;
  }, [values, rules]);
  const getInputProps = (path, { type = "input", withError = type === "input", withFocus = true } = {}) => {
    const onChange = getInputOnChange((value) => setFieldValue(path, value));
    const payload = { onChange };
    if (withError) {
      payload.error = errors[path];
    }
    if (type === "checkbox") {
      payload.checked = getPath(path, values);
    } else {
      payload.value = getPath(path, values);
    }
    if (withFocus) {
      payload.onFocus = () => setTouched((current) => __spreadProps(__spreadValues({}, current), { [path]: true }));
    }
    return payload;
  };
  const onSubmit = (handleSubmit, handleValidationFailure) => (event) => {
    event.preventDefault();
    const results = validate();
    if (results.hasErrors) {
      handleValidationFailure == null ? void 0 : handleValidationFailure(results.errors, values, event);
    } else {
      handleSubmit(values, event);
    }
  };
  const onReset = react.exports.useCallback((event) => {
    event.preventDefault();
    reset();
  }, []);
  const isDirty = react.exports.useCallback((path) => getStatus(dirty, path), [dirty]);
  const isTouched = react.exports.useCallback((path) => getStatus(touched, path), [touched]);
  const isValid = react.exports.useCallback((path) => path ? !validateFieldValue(path, rules, values).hasError : !validateValues(rules, values).hasErrors, [values, rules]);
  return {
    values,
    errors,
    setValues,
    setErrors,
    setFieldValue,
    setFieldError,
    clearFieldError,
    clearErrors,
    reset,
    validate,
    validateField,
    reorderListItem,
    removeListItem,
    insertListItem,
    getInputProps,
    onSubmit,
    onReset,
    isDirty,
    isTouched,
    setTouched,
    setDirty,
    resetTouched,
    resetDirty,
    isValid
  };
}
export {
  Anchor as A,
  Checkbox as C,
  InputsGroup as I,
  LoadingOverlay as L,
  PasswordInput as P,
  Stack as S,
  Title as T,
  CheckIcon as a,
  CheckboxIcon as b,
  useForm as u
};
