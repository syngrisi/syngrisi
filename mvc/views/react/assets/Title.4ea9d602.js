import { c as createStyles, J as getDefaultZIndex, r as react, K as useComponentDefaultProps, b as jsx, L as Transition, j as jsxs, B as Box, O as Loader, R as Overlay, S as sizes, d as useMantineTheme, U as useId, V as extractSystemStyles, W as useUncontrolled, s as ActionIcon, X as Input, T as Text } from "./use-form.e9a99b2c.js";
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
var __defProp$4 = Object.defineProperty;
var __defProps$3 = Object.defineProperties;
var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
var __objRest$2 = (source, exclude) => {
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
      ...__spreadValues$4({
        className: cx(classes.root, className),
        style: __spreadProps$3(__spreadValues$4(__spreadValues$4({}, transitionStyles), style), {
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
        ...__spreadValues$4({
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
var __defProp$3 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
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
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
var useStyles$2 = createStyles((theme, { size, rightSectionWidth }) => ({
  visibilityToggle: {},
  input: {
    position: "relative",
    overflow: "hidden"
  },
  innerInput: __spreadProps$2(__spreadValues$3({}, theme.fn.fontStyles()), {
    backgroundColor: "transparent",
    border: "1px solid transparent",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    boxSizing: "border-box",
    position: "absolute",
    display: "block",
    width: `calc(100% - ${rightSectionWidth}px)`,
    paddingLeft: theme.fn.size({ size, sizes }) / 3,
    fontSize: theme.fn.size({ size, sizes: theme.fontSizes }),
    height: theme.fn.size({ size, sizes }) - 2,
    lineHeight: `${theme.fn.size({ size, sizes }) - 4}px`,
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
    paddingLeft: `${theme.fn.size({ size, sizes })}px !important`
  }
}));
const useStyles$3 = useStyles$2;
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
const buttonSizes = {
  xs: 22,
  sm: 26,
  md: 28,
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
  sm: 32,
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
    withAsterisk,
    inputWrapperOrder,
    visible,
    defaultVisible,
    onVisibilityChange
  } = _a, others = __objRest$1(_a, ["radius", "disabled", "size", "toggleTabIndex", "className", "id", "label", "error", "required", "style", "icon", "description", "wrapperProps", "classNames", "styles", "variant", "visibilityToggleIcon", "__staticSelector", "rightSection", "rightSectionWidth", "rightSectionProps", "sx", "labelProps", "descriptionProps", "errorProps", "unstyled", "visibilityToggleLabel", "withAsterisk", "inputWrapperOrder", "visible", "defaultVisible", "onVisibilityChange"]);
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
  const [_visible, setVisibility] = useUncontrolled({
    value: visible,
    defaultValue: defaultVisible,
    finalValue: false,
    onChange: onVisibilityChange
  });
  const toggleVisibility = () => setVisibility(!_visible);
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
      toggleVisibility();
    },
    onKeyDown: (event) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleVisibility();
      }
    },
    children: /* @__PURE__ */ jsx(VisibilityToggleIcon, {
      reveal: _visible,
      size: theme.fn.size({
        size,
        sizes: iconSizes
      })
    })
  });
  return /* @__PURE__ */ jsx(Input.Wrapper, {
    ...__spreadValues$2(__spreadValues$2({
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
      withAsterisk,
      inputWrapperOrder
    }, systemStyles), wrapperProps),
    children: /* @__PURE__ */ jsx(Input, {
      component: "div",
      invalid: !!error,
      icon,
      size,
      classNames: __spreadProps$1(__spreadValues$2({}, classNames), {
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
        ...__spreadValues$2({
          type: _visible ? "text" : "password",
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
  root: __spreadProps(__spreadValues$1({}, theme.fn.fontStyles()), {
    fontFamily: theme.headings.fontFamily,
    fontWeight: weight || theme.headings.sizes[element].fontWeight || theme.headings.fontWeight,
    fontSize: getFontSize(size, element, theme),
    lineHeight: inline ? 1 : getLineHeight(size, element, theme),
    margin: 0
  })
}));
const useStyles$1 = useStyles;
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
    ...__spreadValues({
      component: `h${order}`,
      ref,
      className: cx(classes.root, className)
    }, others),
    children
  });
});
Title.displayName = "@mantine/core/Title";
export {
  LoadingOverlay as L,
  PasswordInput as P,
  Title as T
};
