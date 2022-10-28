var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { r as react, W as useWindowEvent, X as queryString, b as jsx, j as jsxs, P as Paper, g as Title, Y as Stack, T as Text, G as Group, h as Button, k as ky, a as config, d as useMantineTheme, Z as Fragment, q as TextInput, t as ActionIcon, n as lAe, _ as Pj, D as useLocalStorage, u as useQuery, e as Container, $ as Dge, c as createStyles, l as log, a0 as Tooltip, a1 as Loader, a2 as CK, s as Checkbox, a3 as React, a4 as Transition, a5 as Xfe, a6 as rze, a7 as zV, a8 as ea, a9 as Epe, A as Anchor, aa as Ol, ab as ua, ac as RX, ad as rWe, ae as UZ, af as getAugmentedNamespace, ag as pi, ah as Lbe, ai as lDe, aj as dDe, ak as DMe, al as qF, am as Cbe, an as Pbe, L as LoadingOverlay, ao as LHe, B as Box, o as useSearchParams, ap as Y, Q as QueryClient, f as useDocumentTitle, aq as useNavigate, F as QueryClientProvider, H as ColorSchemeProvider, M as MantineProvider, ar as Routes, as as Route, I as createRoot, J as BrowserRouter } from "./use-form.72335477.js";
import { _ as _inheritsLoose, C as CopyButton, u as useQueryParams, S as StringParam, J as JsonParam, P as Popover, a as Chip, b as useColorScheme, c as useDisclosure, l as links, H as Header, B as Burger, d as HeaderLogo, e as SafeSelect, o as openSpotlight, K as Kbd, U as UserMenu, T as ToggleThemeButton, f as Breadcrumbs, g as errorMsg, G as GenericService, i as isDark, h as useMutation, s as successMsg, M as Modal, R as RingProgress, L as List, j as Skeleton, k as useInView, F as FocusTrap, m as escapeRegExp, n as useToggle, p as useInfinityScroll, N as Navbar, q as ScrollArea, r as getNavigationItem, t as stopNavigationProgress, v as resetNavigationProgress, w as Badge, A as Affix, x as ActionPopoverIcon, I as Image$1, y as Card, z as Collapse, D as Divider, E as SegmentedControl, O as Table, Q as useInputState, V as RelativeDrawer, W as LogicalGroup, X as uuid, Y as useNavProgressFetchEffect, Z as AppShell, $ as ReactQueryDevtools, a0 as navigationData, a1 as SpotlightProvider, a2 as NotificationsProvider, a3 as NavigationProgress, a4 as ModalsProvider, a5 as QueryParamProvider, a6 as ReactRouter6Adapter } from "./LogicalGroup.7fd7cf08.js";
function useDebouncedValue(value, wait, options = { leading: false }) {
  const [_value, setValue] = react.exports.useState(value);
  const mountedRef = react.exports.useRef(false);
  const timeoutRef = react.exports.useRef(null);
  const cooldownRef = react.exports.useRef(false);
  const cancel = () => window.clearTimeout(timeoutRef.current);
  react.exports.useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);
  react.exports.useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);
  return [_value, cancel];
}
const eventListerOptions = {
  passive: true
};
function useViewportSize() {
  const [windowSize, setWindowSize] = react.exports.useState({
    width: 0,
    height: 0
  });
  const setSize = react.exports.useCallback(() => {
    setWindowSize({ width: window.innerWidth || 0, height: window.innerHeight || 0 });
  }, []);
  useWindowEvent("resize", setSize, eventListerOptions);
  useWindowEvent("orientationchange", setSize, eventListerOptions);
  react.exports.useEffect(setSize, []);
  return windowSize;
}
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
var changedArray = function changedArray2(a3, b2) {
  if (a3 === void 0) {
    a3 = [];
  }
  if (b2 === void 0) {
    b2 = [];
  }
  return a3.length !== b2.length || a3.some(function(item, index) {
    return !Object.is(item, b2[index]);
  });
};
var initialState = {
  error: null
};
var ErrorBoundary = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(ErrorBoundary2, _React$Component);
  function ErrorBoundary2() {
    var _this;
    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;
    _this.state = initialState;
    _this.resetErrorBoundary = function() {
      var _this$props;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      _this.props.onReset == null ? void 0 : (_this$props = _this.props).onReset.apply(_this$props, args);
      _this.reset();
    };
    return _this;
  }
  ErrorBoundary2.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      error
    };
  };
  var _proto = ErrorBoundary2.prototype;
  _proto.reset = function reset() {
    this.setState(initialState);
  };
  _proto.componentDidCatch = function componentDidCatch(error, info) {
    var _this$props$onError, _this$props2;
    (_this$props$onError = (_this$props2 = this.props).onError) == null ? void 0 : _this$props$onError.call(_this$props2, error, info);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    var error = this.state.error;
    var resetKeys = this.props.resetKeys;
    if (error !== null && prevState.error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
      var _this$props$onResetKe, _this$props3;
      (_this$props$onResetKe = (_this$props3 = this.props).onResetKeysChange) == null ? void 0 : _this$props$onResetKe.call(_this$props3, prevProps.resetKeys, resetKeys);
      this.reset();
    }
  };
  _proto.render = function render() {
    var error = this.state.error;
    var _this$props4 = this.props, fallbackRender = _this$props4.fallbackRender, FallbackComponent = _this$props4.FallbackComponent, fallback = _this$props4.fallback;
    if (error !== null) {
      var _props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (/* @__PURE__ */ react.exports.isValidElement(fallback)) {
        return fallback;
      } else if (typeof fallbackRender === "function") {
        return fallbackRender(_props);
      } else if (FallbackComponent) {
        return /* @__PURE__ */ jsx(FallbackComponent, {
          ..._props
        });
      } else {
        throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop");
      }
    }
    return this.props.children;
  };
  return ErrorBoundary2;
}(react.exports.Component);
function ErrorFallback({
  error,
  resetErrorBoundary
}) {
  const [errorDetails] = react.exports.useState(`Url: ${window.location.href}
Message: ${error.message}
Stacktrace: ${error.stack}
`);
  return /* @__PURE__ */ jsxs(Paper, {
    role: "alert",
    children: [/* @__PURE__ */ jsx(Title, {
      children: "Something went wrong"
    }), /* @__PURE__ */ jsxs(Stack, {
      align: "center",
      spacing: 8,
      children: [/* @__PURE__ */ jsx(Text, {
        size: "lg",
        align: "center",
        children: "Try to:"
      }), /* @__PURE__ */ jsxs(Group, {
        position: "center",
        children: [/* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "md",
          onClick: () => {
            resetErrorBoundary();
            window.navigation.reload();
          },
          children: "Refresh"
        }), /* @__PURE__ */ jsx(Text, {
          size: "lg",
          align: "center",
          children: "or"
        }), /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "md",
          onClick: () => {
            resetErrorBoundary();
            document.location = "/index2/";
          },
          children: "Go to main page"
        })]
      }), /* @__PURE__ */ jsx(Group, {
        position: "left",
        pt: 30,
        children: /* @__PURE__ */ jsx(Text, {
          children: "Error Details:"
        })
      }), /* @__PURE__ */ jsx("pre", {
        style: {
          backgroundColor: "black",
          color: "white",
          padding: "10px"
        },
        children: errorDetails
      })]
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      children: /* @__PURE__ */ jsx(CopyButton, {
        value: errorDetails,
        children: ({
          copied,
          copy
        }) => /* @__PURE__ */ jsx(Button, {
          color: copied ? "teal" : "blue",
          onClick: copy,
          children: copied ? "Copied" : "Copy Error Details"
        })
      })
    })]
  });
}
const AppContext = react.exports.createContext({});
const ChecksService = {
  async acceptCheck({ check, newBaselineId }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/checks/accept/${check._id}`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baselineId: newBaselineId
        }),
        method: "PUT"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`cannot accept check: '${JSON.stringify(check, null, "/t")}',
baseline: '${newBaselineId}', error: '${e2}'}`);
    }
  },
  async removeCheck({ id }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/checks/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`Cannot remove check: '${id}', error: '${e2}'`);
    }
  }
};
const RunsService = {
  async remove({ id }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/runs/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`Cannot remove run: '${id}', error: '${e2}'`);
    }
  }
};
const SuitesService = {
  async remove({ id }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/suites/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`Cannot remove suite: '${id}', error: '${e2}'`);
    }
  }
};
const TestsService = {
  async removeTest({ id }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/tests/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`Cannot remove test: '${id}', error: '${e2}'`);
    }
  },
  async acceptTest({ id }) {
    try {
      const resp = await ky(`${config.baseUri}/v1/tests/accept/${id}`, {
        headers: { "Content-Type": "application/json" },
        method: "PUT"
      });
      if (resp.ok) {
        return resp.json();
      }
    } catch (e2) {
      throw new Error(`Cannot accept test: '${id}', error: '${e2}'`);
    }
  }
};
function useParams() {
  const [query, setQuery] = useQueryParams({
    groupBy: StringParam,
    sortBy: StringParam,
    app: StringParam,
    filter: JsonParam,
    base_filter: JsonParam,
    checkId: StringParam
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
const chipStyles = {
  label: {
    maxWidth: "9em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};
function QuickFilter(props) {
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Text, {
      size: 14,
      children: "Quick Filter: "
    }), /* @__PURE__ */ jsx(TextInput, {
      size: "xs",
      radius: "xs",
      placeholder: "Enter test name",
      rightSection: /* @__PURE__ */ jsx(ActionIcon, {
        title: "reset filter",
        children: /* @__PURE__ */ jsx(lAe, {
          stroke: 1,
          color: theme.colors.gray[5]
        })
      }),
      styles: {
        input: {
          width: "300px"
        }
      }
    }), /* @__PURE__ */ jsxs(Popover, {
      width: 330,
      position: "bottom",
      withArrow: true,
      shadow: "md",
      children: [/* @__PURE__ */ jsx(Popover.Target, {
        children: /* @__PURE__ */ jsx(Group, {
          spacing: 0,
          position: "center",
          children: /* @__PURE__ */ jsx(ActionIcon, {
            ml: -14,
            children: /* @__PURE__ */ jsx(Pj, {
              size: 16
            })
          })
        })
      }), /* @__PURE__ */ jsx(Popover.Dropdown, {
        children: /* @__PURE__ */ jsxs(Stack, {
          spacing: 8,
          justify: "flex-start",
          children: [/* @__PURE__ */ jsx(Text, {
            size: 10,
            color: "gray.6",
            weight: 600,
            transform: "uppercase",
            children: "Browsers:"
          }), /* @__PURE__ */ jsxs(Chip.Group, {
            spacing: 4,
            multiple: true,
            children: [/* @__PURE__ */ jsx(Chip, {
              value: "1",
              title: "chrome [HEADLESS]!!!!!!",
              styles: chipStyles,
              children: "chrome [HEADLESS]"
            }), /* @__PURE__ */ jsx(Chip, {
              value: "2",
              styles: chipStyles,
              children: "Chrome"
            }), /* @__PURE__ */ jsx(Chip, {
              value: "3",
              styles: chipStyles,
              children: "Safari"
            }), /* @__PURE__ */ jsx(Chip, {
              value: "4",
              styles: chipStyles,
              children: "Firefox"
            })]
          })]
        })
      })]
    })]
  });
}
const useStyles$5 = createStyles((theme) => ({
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
function IndexHeader() {
  var _a;
  const {
    toolbar,
    breadCrumbs
  } = react.exports.useContext(AppContext);
  const theme = useMantineTheme();
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [opened, {
    toggle
  }] = useDisclosure(false);
  const {
    classes
  } = useStyles$5();
  links.map((link) => /* @__PURE__ */ jsx("a", {
    href: link.link,
    className: classes.link,
    children: link.label
  }, link.label));
  const [currentProjectLS, setCurrentProjectLS] = useLocalStorage({
    key: "currentProject",
    defaultValue: ""
  });
  const projectsQuery = useQuery(["projects"], () => GenericService.get("app", {}, {
    limit: "0"
  }), {
    enabled: true,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  let projectSelectData = [];
  if (projectsQuery.data) {
    projectSelectData = (_a = projectsQuery.data) == null ? void 0 : _a.results.map((item) => ({
      value: item._id,
      label: item.name
    }));
  }
  const projectSelectHandler = (value) => {
    setCurrentProjectLS(() => value);
  };
  const {
    setQuery
  } = useParams();
  react.exports.useEffect(() => {
    setQuery({
      app: currentProjectLS
    });
  }, [currentProjectLS]);
  return /* @__PURE__ */ jsxs(Header, {
    height: 100,
    className: classes.header,
    children: [/* @__PURE__ */ jsxs(Container, {
      className: classes.inner,
      fluid: true,
      children: [/* @__PURE__ */ jsx(Group, {
        children: /* @__PURE__ */ jsxs(Group, {
          children: [/* @__PURE__ */ jsx(Burger, {
            opened,
            onClick: toggle,
            size: "sm"
          }), /* @__PURE__ */ jsx(HeaderLogo, {})]
        })
      }), /* @__PURE__ */ jsxs(Group, {
        children: [/* @__PURE__ */ jsxs(Group, {
          spacing: "sm",
          children: [/* @__PURE__ */ jsx(Text, {
            size: "sm",
            children: "Project:"
          }), /* @__PURE__ */ jsx(SafeSelect, {
            searchable: "true",
            clearable: "true",
            placeholder: "Enter Project Name",
            variant: "unstiled",
            "data-test": "current-project",
            sx: {
              minWidth: "150px",
              borderWidth: "0px 0 1px 0",
              borderStyle: "solid",
              borderColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
            },
            styles: {
              input: {
                paddingRight: "20px"
              }
            },
            value: currentProjectLS || "",
            onChange: projectSelectHandler,
            size: "sm",
            optionsData: projectSelectData
          })]
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
              children: [/* @__PURE__ */ jsx(Dge, {
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
        children: [/* @__PURE__ */ jsxs(Group, {
          children: [/* @__PURE__ */ jsx(Group, {
            children: /* @__PURE__ */ jsx(Breadcrumbs, {
              children: breadCrumbs
            })
          }), /* @__PURE__ */ jsx(Group, {
            ml: 250,
            children: /* @__PURE__ */ jsx(QuickFilter, {})
          })]
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
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof$1(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}
function compareAsc(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var diff = dateLeft.getTime() - dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || _typeof(value) === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}
function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}
function differenceInMilliseconds(dateLeft, dateRight) {
  requiredArgs(2, arguments);
  return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
}
var roundingMap = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function trunc(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  }
};
var defaultRoundingMethod = "trunc";
function getRoundingMethod(method) {
  return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
}
function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}
function isLastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
}
function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  var result;
  if (difference < 1) {
    result = 0;
  } else {
    if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
      dateLeft.setDate(30);
    }
    dateLeft.setMonth(dateLeft.getMonth() - sign * difference);
    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;
    if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }
  return result === 0 ? 0 : result;
}
function differenceInSeconds(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}
var MILLISECONDS_IN_DAY = 864e5;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}
function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}
var MILLISECONDS_IN_WEEK$1 = 6048e5;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}
function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getUTCWeekYear(dirtyDate, options);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, options);
  return date;
}
var MILLISECONDS_IN_WEEK = 6048e5;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? "-" : "";
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return sign + output;
}
var formatters$2 = {
  y: function y(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
const formatters$3 = formatters$2;
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters = {
  G: function G(date, token, localize2) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, {
          width: "abbreviated"
        });
      case "GGGGG":
        return localize2.era(era, {
          width: "narrow"
        });
      case "GGGG":
      default:
        return localize2.era(era, {
          width: "wide"
        });
    }
  },
  y: function y2(date, token, localize2) {
    if (token === "yo") {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, {
        unit: "year"
      });
    }
    return formatters$3.y(date, token);
  },
  Y: function Y2(date, token, localize2, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, {
        unit: "year"
      });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  Q: function Q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "Q":
        return String(quarter);
      case "QQ":
        return addLeadingZeros(quarter, 2);
      case "Qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  q: function q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "q":
        return String(quarter);
      case "qq":
        return addLeadingZeros(quarter, 2);
      case "qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  M: function M2(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "M":
      case "MM":
        return formatters$3.M(date, token);
      case "Mo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  L: function L(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "L":
        return String(month + 1);
      case "LL":
        return addLeadingZeros(month + 1, 2);
      case "Lo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  w: function w(date, token, localize2, options) {
    var week = getUTCWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, {
        unit: "week"
      });
    }
    return addLeadingZeros(week, token.length);
  },
  I: function I(date, token, localize2) {
    var isoWeek = getUTCISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, {
        unit: "week"
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  d: function d2(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getUTCDate(), {
        unit: "date"
      });
    }
    return formatters$3.d(date, token);
  },
  D: function D(date, token, localize2) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, {
        unit: "dayOfYear"
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  E: function E(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  e: function e(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "e":
        return String(localDayOfWeek);
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  c: function c(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "c":
        return String(localDayOfWeek);
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  i: function i(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      case "i":
        return String(isoDayOfWeek);
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  a: function a2(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  b: function b(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  B: function B(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  h: function h2(date, token, localize2) {
    if (token === "ho") {
      var hours = date.getUTCHours() % 12;
      if (hours === 0)
        hours = 12;
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return formatters$3.h(date, token);
  },
  H: function H2(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getUTCHours(), {
        unit: "hour"
      });
    }
    return formatters$3.H(date, token);
  },
  K: function K(date, token, localize2) {
    var hours = date.getUTCHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  k: function k(date, token, localize2) {
    var hours = date.getUTCHours();
    if (hours === 0)
      hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  m: function m2(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getUTCMinutes(), {
        unit: "minute"
      });
    }
    return formatters$3.m(date, token);
  },
  s: function s2(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getUTCSeconds(), {
        unit: "second"
      });
    }
    return formatters$3.s(date, token);
  },
  S: function S2(date, token) {
    return formatters$3.S(date, token);
  },
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      case "XXXXX":
      case "XXX":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      case "xxxxx":
      case "xxx":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || "";
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || "";
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
const formatters$1 = formatters;
var dateLongFormatter = function dateLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "P":
      return formatLong2.date({
        width: "short"
      });
    case "PP":
      return formatLong2.date({
        width: "medium"
      });
    case "PPP":
      return formatLong2.date({
        width: "long"
      });
    case "PPPP":
    default:
      return formatLong2.date({
        width: "full"
      });
  }
};
var timeLongFormatter = function timeLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "p":
      return formatLong2.time({
        width: "short"
      });
    case "pp":
      return formatLong2.time({
        width: "medium"
      });
    case "ppp":
      return formatLong2.time({
        width: "long"
      });
    case "pppp":
    default:
      return formatLong2.time({
        width: "full"
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter2(pattern, formatLong2) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({
        width: "short"
      });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({
        width: "full"
      });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
const longFormatters$1 = longFormatters;
var protectedDayOfYearTokens = ["D", "DD"];
var protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format2, input) {
  if (token === "YYYY") {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "YY") {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "D") {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "DD") {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance$1 = function formatDistance(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
const formatDistance$2 = formatDistance$1;
function buildFormatLongFn(args) {
  return function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatLong$1 = formatLong;
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = function formatRelative2(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
const formatRelative$1 = formatRelative;
function buildLocalizeFn(args) {
  return function(dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
    var valuesArray;
    if (context === "formatting" && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = function ordinalNumber2(dirtyNumber, _options) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
const localize$1 = localize;
function buildMatchFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult)
      return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult)
      return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: function valueCallback2(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const match$1 = match;
var locale = {
  code: "en-US",
  formatDistance: formatDistance$2,
  formatLong: formatLong$1,
  formatRelative: formatRelative$1,
  localize: localize$1,
  match: match$1,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
const defaultLocale = locale;
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale;
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      var longFormatter = longFormatters$1[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = formatters$1[firstCharacter];
    if (formatter) {
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale2.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString(input) {
  var matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}
function assign(target, object) {
  if (target == null) {
    throw new TypeError("assign requires that input parameter not be null or undefined");
  }
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      target[property] = object[property];
    }
  }
  return target;
}
function cloneObject(object) {
  return assign({}, object);
}
var MINUTES_IN_DAY = 1440;
var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_TWO_MONTHS = 86400;
function formatDistance2(dirtyDate, dirtyBaseDate, options) {
  var _ref, _options$locale;
  requiredArgs(2, arguments);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale;
  if (!locale2.formatDistance) {
    throw new RangeError("locale must contain formatDistance property");
  }
  var comparison = compareAsc(dirtyDate, dirtyBaseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  var localizeOptions = assign(cloneObject(options), {
    addSuffix: Boolean(options === null || options === void 0 ? void 0 : options.addSuffix),
    comparison
  });
  var dateLeft;
  var dateRight;
  if (comparison > 0) {
    dateLeft = toDate(dirtyBaseDate);
    dateRight = toDate(dirtyDate);
  } else {
    dateLeft = toDate(dirtyDate);
    dateRight = toDate(dirtyBaseDate);
  }
  var seconds = differenceInSeconds(dateRight, dateLeft);
  var offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
  var minutes = Math.round((seconds - offsetInSeconds) / 60);
  var months;
  if (minutes < 2) {
    if (options !== null && options !== void 0 && options.includeSeconds) {
      if (seconds < 5) {
        return locale2.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale2.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale2.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale2.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale2.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale2.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale2.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale2.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale2.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale2.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < MINUTES_IN_DAY) {
    var hours = Math.round(minutes / 60);
    return locale2.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
    return locale2.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < MINUTES_IN_MONTH) {
    var days = Math.round(minutes / MINUTES_IN_DAY);
    return locale2.formatDistance("xDays", days, localizeOptions);
  } else if (minutes < MINUTES_IN_TWO_MONTHS) {
    months = Math.round(minutes / MINUTES_IN_MONTH);
    return locale2.formatDistance("aboutXMonths", months, localizeOptions);
  }
  months = differenceInMonths(dateRight, dateLeft);
  if (months < 12) {
    var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
    return locale2.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    var monthsSinceStartOfYear = months % 12;
    var years = Math.floor(months / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale2.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale2.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale2.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}
function formatDistanceToNow(dirtyDate, options) {
  requiredArgs(1, arguments);
  return formatDistance2(dirtyDate, Date.now(), options);
}
function parseISO(argument, options) {
  var _options$additionalDi;
  requiredArgs(1, arguments);
  var additionalDigits = toInteger((_options$additionalDi = options === null || options === void 0 ? void 0 : options.additionalDigits) !== null && _options$additionalDi !== void 0 ? _options$additionalDi : 2);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    var result = new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
  var captures = dateString.match(regex);
  if (!captures)
    return {
      year: NaN,
      restDateString: ""
    };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null)
    return new Date(NaN);
  var captures = dateString.match(dateRegex);
  if (!captures)
    return new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures)
    return NaN;
  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z")
    return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures)
    return 0;
  var sign = captures[1] === "+" ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}
function RemoveRunModalAsk({
  opened,
  setOpened,
  infinityQuery,
  item
}) {
  const {
    setQuery
  } = useParams();
  const mutationRemoveRun = useMutation((data) => RunsService.remove(data), {
    onSuccess: async () => {
      setQuery({
        base_filter: void 0
      });
      successMsg({
        message: "Run has been successfully removed"
      });
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot remove the Run"
      });
      log.error(e2);
    }
  });
  const handleRemoveButtonClick = async () => {
    await mutationRemoveRun.mutateAsync({
      id: item._id
    });
    infinityQuery.refetch();
    setOpened(false);
  };
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => setOpened(false),
    title: "Remove this run?",
    children: [/* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: "Are you sure you want to permanently delete the Run?"
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      children: [/* @__PURE__ */ jsx(Button, {
        color: "red",
        onClick: async () => {
          await handleRemoveButtonClick();
        },
        children: "Remove"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: () => setOpened(false),
        children: "Cancel"
      })]
    })]
  });
}
const createStatusesObj = (arr) => {
  if (arr.length < 1)
    return {
      group: [],
      count: 0
    };
  const group = {};
  for (const element of arr) {
    if (group[element.toLowerCase()]) {
      group[element.toLowerCase()] += 1;
    } else {
      group[element.toLowerCase()] = 1;
    }
  }
  return {
    group,
    count: arr.length
  };
};
function StatusesRing({
  statuses
}) {
  const statusesObject = createStatusesObj(statuses);
  const ringSectionsData = statusesObject.count > 0 ? [
    {
      value: statusesObject.group.passed / statusesObject.count * 100 || 0,
      color: "green.7"
    },
    {
      value: statusesObject.group.failed / statusesObject.count * 100 || 0,
      color: "red.7"
    },
    {
      value: statusesObject.group.new / statusesObject.count * 100 || 0,
      color: "blue.7"
    }
  ] : [];
  const tooltipLabel = /* @__PURE__ */ jsxs(Fragment, {
    children: [statusesObject.group.new && /* @__PURE__ */ jsxs(Text, {
      color: "blue",
      children: ["New: ", statusesObject.group.new]
    }), statusesObject.group.passed && /* @__PURE__ */ jsxs(Text, {
      color: "green",
      children: ["Passed: ", statusesObject.group.passed]
    }), statusesObject.group.failed && /* @__PURE__ */ jsxs(Text, {
      color: "red",
      children: ["Failed: ", statusesObject.group.failed]
    })]
  });
  return /* @__PURE__ */ jsx(Tooltip, {
    label: tooltipLabel,
    children: /* @__PURE__ */ jsx(RingProgress, {
      sections: ringSectionsData,
      size: 48
    })
  });
}
function Run({
  item,
  index,
  classes,
  id,
  activeItemsHandler,
  infinityQuery
}) {
  var _a;
  const {
    setQuery
  } = useParams();
  const [opened, {
    toggle,
    close
  }] = useDisclosure(false);
  const [modalOpen, setModalOpen] = react.exports.useState(false);
  const handleClick = () => {
    setModalOpen(true);
    close();
  };
  const handlerItemClick = (e2) => {
    if (!(e2.metaKey || e2.ctrlKey))
      activeItemsHandler.clear();
    activeItemsHandler.addOrRemove(id);
  };
  react.exports.useEffect(function onActiveItemsChange() {
    var _a2;
    if (((_a2 = activeItemsHandler.get()) == null ? void 0 : _a2.length) < 1) {
      setQuery({
        base_filter: null
      });
      return;
    }
    setQuery({
      base_filter: {
        run: {
          $in: activeItemsHandler.get()
        }
      }
    });
  }, [JSON.stringify(activeItemsHandler.get())]);
  const testsQuery = useQuery(["run_item_tests_query", item._id], () => GenericService.get("tests", {
    run: {
      $eq: item._id
    }
  }, {
    limit: String(0)
  }, "run_item_tests_query"), {
    enabled: true,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  const testsStatuses = react.exports.useMemo(() => {
    var _a2, _b;
    if ((_a2 = testsQuery == null ? void 0 : testsQuery.data) == null ? void 0 : _a2.results) {
      return (_b = testsQuery == null ? void 0 : testsQuery.data) == null ? void 0 : _b.results.map((x2) => x2.status);
    }
    return [];
  }, [(_a = testsQuery == null ? void 0 : testsQuery.data) == null ? void 0 : _a.timestamp]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(List.Item, {
      "data-test": `navbar_item_${index}`,
      onClick: handlerItemClick,
      className: `${classes.navbarItem} ${activeItemsHandler.get().includes(id) && classes.activeNavbarItem}`,
      sx: {
        cursor: "pointer",
        width: "100%"
      },
      children: /* @__PURE__ */ jsxs(Group, {
        noWrap: true,
        pl: 8,
        position: "apart",
        spacing: 0,
        children: [/* @__PURE__ */ jsx(Group, {
          sx: {
            width: "100%"
          },
          noWrap: true,
          children: /* @__PURE__ */ jsxs(Stack, {
            spacing: 0,
            sx: {
              width: "100%"
            },
            children: [/* @__PURE__ */ jsx(Group, {
              position: "left",
              sx: {
                width: "100%"
              },
              children: /* @__PURE__ */ jsx(Tooltip, {
                label: item.name,
                multiline: true,
                children: /* @__PURE__ */ jsx(Text, {
                  "data-test": "navbar-item-name",
                  size: 16,
                  lineClamp: 1,
                  sx: {
                    wordBreak: "break-all"
                  },
                  children: item.name
                })
              })
            }), /* @__PURE__ */ jsx(Group, {
              position: "right",
              children: /* @__PURE__ */ jsx(Tooltip, {
                label: format(parseISO(item.createdDate), "yyyy-MM-dd HH:mm:ss"),
                children: /* @__PURE__ */ jsx(Text, {
                  align: "right",
                  size: "xs",
                  color: "dimmed",
                  children: formatDistanceToNow(parseISO(item.createdDate))
                })
              })
            })]
          })
        }), /* @__PURE__ */ jsxs(Group, {
          position: "right",
          spacing: 0,
          noWrap: true,
          children: [testsQuery.isLoading ? /* @__PURE__ */ jsx(Loader, {
            variant: "dots",
            size: "xs",
            mr: 16
          }) : /* @__PURE__ */ jsx(StatusesRing, {
            statuses: testsStatuses
          }), /* @__PURE__ */ jsxs(Popover, {
            position: "bottom",
            withArrow: true,
            shadow: "md",
            opened,
            onChange: toggle,
            children: [/* @__PURE__ */ jsx(Popover.Target, {
              children: /* @__PURE__ */ jsx(ActionIcon, {
                children: /* @__PURE__ */ jsx(CK, {
                  onClick: toggle
                })
              })
            }), /* @__PURE__ */ jsx(Popover.Dropdown, {
              children: /* @__PURE__ */ jsx(Group, {
                position: "center",
                children: /* @__PURE__ */ jsx(Button, {
                  onClick: () => handleClick(),
                  children: "Remove run"
                })
              })
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(RemoveRunModalAsk, {
      opened: modalOpen,
      setOpened: setModalOpen,
      infinityQuery,
      item
    })]
  });
}
function RemoveSuiteModalAsk({
  opened,
  setOpened,
  infinityQuery,
  item
}) {
  const {
    setQuery
  } = useParams();
  const mutationRemoveItem = useMutation((data) => SuitesService.remove(data), {
    onSuccess: async () => {
      setQuery({
        base_filter: void 0
      });
      successMsg({
        message: "Suite has been successfully removed"
      });
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot remove the Suite"
      });
      log.error(e2);
    }
  });
  const handleRemoveButtonClick = async () => {
    await mutationRemoveItem.mutateAsync({
      id: item._id
    });
    infinityQuery.refetch();
    setOpened(false);
  };
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => setOpened(false),
    title: "Remove this suite?",
    children: [/* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: "Are you sure you want to permanently delete the Suite?"
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      children: [/* @__PURE__ */ jsx(Button, {
        color: "red",
        onClick: async () => {
          await handleRemoveButtonClick();
        },
        children: "Remove"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: () => setOpened(false),
        children: "Cancel"
      })]
    })]
  });
}
function Suite({
  item,
  index,
  classes,
  id,
  activeItem,
  setActiveItem,
  infinityQuery
}) {
  const {
    setQuery
  } = useParams();
  const [opened, {
    toggle,
    close
  }] = useDisclosure(false);
  const [modalOpen, setModalOpen] = react.exports.useState(false);
  const handleClick = () => {
    setModalOpen(true);
    close();
  };
  const handlerItemClick = () => {
    setActiveItem(() => id);
    setQuery({
      base_filter: {
        suite: id
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(List.Item, {
      "data-test": `navbar_item_${index}`,
      onClick: handlerItemClick,
      className: `${classes.navbarItem} ${activeItem === id && classes.activeNavbarItem}`,
      sx: {
        cursor: "pointer",
        width: "100%"
      },
      children: /* @__PURE__ */ jsxs(Group, {
        noWrap: true,
        pl: 4,
        position: "apart",
        spacing: 0,
        children: [/* @__PURE__ */ jsx(Group, {
          noWrap: true,
          children: /* @__PURE__ */ jsxs(Stack, {
            spacing: 0,
            children: [/* @__PURE__ */ jsx(Tooltip, {
              label: item.name,
              multiline: true,
              children: /* @__PURE__ */ jsx(Text, {
                "data-test": "navbar-item-name",
                size: 16,
                lineClamp: 1,
                sx: {
                  wordBreak: "break-all"
                },
                children: item.name
              })
            }), /* @__PURE__ */ jsx(Text, {
              align: "right",
              size: "xs",
              color: "dimmed",
              children: "3 hou!s ago"
            })]
          })
        }), /* @__PURE__ */ jsxs(Group, {
          position: "right",
          spacing: 0,
          children: [/* @__PURE__ */ jsx(RingProgress, {
            sections: [{
              value: 100,
              color: "orange"
            }],
            size: 48
          }), /* @__PURE__ */ jsxs(Popover, {
            position: "bottom",
            withArrow: true,
            shadow: "md",
            opened,
            onChange: toggle,
            children: [/* @__PURE__ */ jsx(Popover.Target, {
              children: /* @__PURE__ */ jsx(ActionIcon, {
                children: /* @__PURE__ */ jsx(CK, {
                  onClick: toggle
                })
              })
            }), /* @__PURE__ */ jsx(Popover.Dropdown, {
              children: /* @__PURE__ */ jsx(Group, {
                position: "center",
                children: /* @__PURE__ */ jsx(Button, {
                  onClick: () => handleClick(),
                  children: "Remove suite"
                })
              })
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(RemoveSuiteModalAsk, {
      opened: modalOpen,
      setOpened: setModalOpen,
      infinityQuery,
      item
    })]
  });
}
const useStyles$4 = createStyles((theme) => ({
  navbarItem: {
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`
  }
}));
function Simple({
  item,
  selected,
  toggleRowSelection,
  index
}) {
  const {
    classes
  } = useStyles$4();
  return /* @__PURE__ */ jsx(List.Item, {
    "data-test": `navbar_item_${index}`,
    className: classes.navbarItem,
    style: {
      cursor: "pointer"
    },
    children: /* @__PURE__ */ jsx(Group, {
      noWrap: true,
      p: 4,
      position: "apart",
      spacing: 0,
      children: /* @__PURE__ */ jsxs(Group, {
        noWrap: true,
        style: {
          width: "100%"
        },
        children: [/* @__PURE__ */ jsx(Checkbox, {
          "test-data": "navbar-item-checkbox",
          checked: selected,
          onChange: (event) => {
            event.stopPropagation();
            toggleRowSelection(item.id);
          },
          onClick: (event) => {
            event.stopPropagation();
          }
        }), /* @__PURE__ */ jsx(Stack, {
          spacing: 0,
          style: {
            width: "100%"
          },
          children: /* @__PURE__ */ jsx(Tooltip, {
            label: item.name,
            multiline: true,
            children: /* @__PURE__ */ jsx(Text, {
              "data-test": "navbar-item-name",
              size: 16,
              lineClamp: 1,
              sx: {
                wordBreak: "break-all"
              },
              children: item.name
            })
          })
        })]
      })
    })
  });
}
const useStyles$3 = createStyles((theme) => ({
  navbarItem: {
    display: "block",
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.red[0] : theme.black,
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black
    }
  },
  activeNavbarItem: {
    backgroundColor: theme.colorScheme === "dark" ? "rgba(47, 158, 68, 0.2)" : "rgba(235, 251, 238, 1)",
    color: theme.colorScheme === "dark" ? theme.colors.green[2] : theme.colors.green[6],
    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? "rgba(47, 158, 68, 0.2)" : "rgba(235, 251, 238, 1)",
      color: theme.colorScheme === "dark" ? theme.colors.green[2] : theme.colors.green[6]
    }
  }
}));
function NavbarItems({
  infinityQuery,
  groupByValue,
  activeItemsHandler
}) {
  const {
    classes
  } = useStyles$3();
  const [selection, setSelection] = react.exports.useState([]);
  react.exports.useEffect(function onSelectionChange() {
  }, [selection.length]);
  const transformResourceToFCName = (value) => {
    const transformMap = {
      runs: Run,
      suites: Suite
    };
    return transformMap[value] ? transformMap[value] : Simple;
  };
  return infinityQuery.data ? infinityQuery.data.pages.map((page) => page.results.map((item, index) => {
    selection.includes(item._id);
    const Item = transformResourceToFCName(groupByValue);
    return /* @__PURE__ */ jsx(react.exports.Fragment, {
      children: /* @__PURE__ */ jsx(Item, {
        id: item._id,
        activeItemsHandler,
        infinityQuery,
        index,
        item,
        classes
      })
    }, item._id);
  })) : [];
}
function RunsDummySkeleton({
  num
}) {
  return /* @__PURE__ */ jsx(Fragment, {
    children: Object.keys(new Array(num || 6).fill("")).map((x2) => /* @__PURE__ */ jsx(React.Fragment, {
      children: /* @__PURE__ */ jsxs(Group, {
        style: {
          width: "100%"
        },
        pl: "sm",
        children: [/* @__PURE__ */ jsx(Skeleton, {
          height: 20,
          mt: "sm",
          width: "73%",
          radius: "sm"
        }), /* @__PURE__ */ jsx(Skeleton, {
          height: 30,
          mt: "sm",
          width: "10%",
          radius: "xl"
        })]
      })
    }, x2))
  });
}
function SimpleDummySkeleton() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: Object.keys(new Array(6).fill("")).map((x2) => /* @__PURE__ */ jsx(React.Fragment, {
      children: /* @__PURE__ */ jsx(Group, {
        style: {
          width: "100%"
        },
        pl: "sm",
        children: /* @__PURE__ */ jsx(Skeleton, {
          height: 20,
          mt: "sm",
          width: "80%",
          radius: "sm"
        })
      })
    }, x2))
  });
}
function SkeletonWrapper({
  infinityQuery,
  itemType,
  num
}) {
  const {
    ref,
    inView
  } = useInView();
  const DummySkeletons = (key) => {
    const map = {
      runs: RunsDummySkeleton,
      suites: RunsDummySkeleton
    };
    return map[key] || SimpleDummySkeleton;
  };
  react.exports.useEffect(() => {
    if (inView && infinityQuery) {
      infinityQuery.fetchNextPage();
    }
  }, [inView]);
  const DummySkeleton = DummySkeletons(itemType);
  return /* @__PURE__ */ jsx(Stack, {
    ref,
    children: (infinityQuery === null || infinityQuery.hasNextPage) && /* @__PURE__ */ jsx(DummySkeleton, {
      num
    })
  });
}
const sortOptionsData = (type) => {
  const transform = {
    runs: [{
      value: "createdDate",
      label: "Created Date"
    }, {
      value: "name",
      label: "Name"
    }],
    suites: [{
      value: "createdDate",
      label: "Created Date"
    }, {
      value: "name",
      label: "Name"
    }]
  };
  return transform[type] || [{
    value: "_id",
    label: "Name"
  }];
};
function NavbarSort({
  groupBy,
  sortBy,
  setSortBy,
  setSortOrder,
  toggleOpenedSort,
  sortOrder,
  openedSort
}) {
  return /* @__PURE__ */ jsx(Transition, {
    mounted: openedSort,
    transition: "fade",
    duration: 400,
    timingFunction: "ease",
    children: (styles) => /* @__PURE__ */ jsxs(Group, {
      align: "end",
      noWrap: true,
      style: styles,
      children: [/* @__PURE__ */ jsx(SafeSelect, {
        label: "Sort by",
        "data-test": "navbar-sort-by-select",
        sx: {
          width: "230px"
        },
        value: sortBy,
        onChange: (value) => setSortBy(() => value),
        optionsData: sortOptionsData(groupBy)
      }), /* @__PURE__ */ jsxs(Group, {
        spacing: 6,
        position: "right",
        children: [/* @__PURE__ */ jsx(ActionIcon, {
          title: "Sort Order",
          "data-test": "navbar-sort-by-order",
          mb: 4,
          onClick: () => {
            if (sortOrder === "asc") {
              setSortOrder("desc");
              return;
            }
            setSortOrder("asc");
          },
          children: sortOrder === "asc" ? /* @__PURE__ */ jsx(Xfe, {
            stroke: 1
          }) : /* @__PURE__ */ jsx(rze, {
            stroke: 1
          })
        }), /* @__PURE__ */ jsx(ActionIcon, {
          mb: 4,
          onClick: () => toggleOpenedSort(),
          children: /* @__PURE__ */ jsx(lAe, {
            stroke: 1
          })
        })]
      })]
    })
  });
}
function NavbarFilter({
  openedFilter,
  quickFilter,
  setQuickFilter,
  debouncedQuickFilter,
  infinityQuery,
  toggleOpenedFilter
}) {
  return /* @__PURE__ */ jsx(Transition, {
    mounted: openedFilter,
    transition: "fade",
    duration: 400,
    timingFunction: "ease",
    children: (styles) => /* @__PURE__ */ jsx(FocusTrap, {
      active: true,
      children: /* @__PURE__ */ jsx(TextInput, {
        label: "Filter by",
        "data-test": "navbar-quick-filter",
        style: styles,
        sx: {
          width: "100%"
        },
        placeholder: "Filter",
        value: quickFilter,
        onChange: (e2) => {
          setQuickFilter(e2.currentTarget.value);
        },
        rightSection: quickFilter === debouncedQuickFilter && !infinityQuery.isFetching ? /* @__PURE__ */ jsx(ActionIcon, {
          onClick: () => {
            if (quickFilter === "")
              toggleOpenedFilter(false);
            setQuickFilter("");
          },
          children: /* @__PURE__ */ jsx(lAe, {
            stroke: 1
          })
        }) : /* @__PURE__ */ jsx(Loader, {
          size: 24
        })
      })
    })
  });
}
const useStyles$2 = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md
  }
}));
function IndexNavbar() {
  const {
    classes
  } = useStyles$2();
  const [activeItems, setActiveItems] = react.exports.useState([]);
  const activeItemsHandler = {
    get: () => activeItems,
    addOrRemove: (item) => {
      setActiveItems((prevItems) => {
        const newItems = [...prevItems];
        if (newItems.includes(item)) {
          return newItems.filter((x2) => x2 !== item);
        }
        return newItems.concat(item);
      });
    },
    clear: () => {
      setActiveItems(() => []);
    }
  };
  const [sortBy, setSortBy] = react.exports.useState("createdDate");
  const [sortOrder, setSortOrder] = react.exports.useState("desc");
  const {
    query,
    setQuery
  } = useParams();
  const [groupByValue, setGroupByValue] = react.exports.useState(query.groupBy || "runs");
  const handleGroupBySelect = (value) => {
    setGroupByValue(value);
    setQuery({
      base_filter: {}
    });
  };
  const [quickFilter, setQuickFilter] = react.exports.useState("");
  const [debouncedQuickFilter] = useDebouncedValue(quickFilter, 400);
  const quickFilterKey = (value) => {
    const transform = {
      runs: "name",
      suites: "name",
      "test-distinct/browserName": "browserName",
      "test-distinct/os": "os",
      "test-distinct/status": "status",
      "test-distinct/markedAs": "markedAs"
    };
    return transform[value] || "name";
  };
  const quickFilterObject = react.exports.useMemo(() => {
    if (!debouncedQuickFilter)
      return {};
    return {
      [quickFilterKey(groupByValue)]: {
        $regex: escapeRegExp(debouncedQuickFilter),
        $options: "im"
      }
    };
  }, [debouncedQuickFilter]);
  const navbarFilterObject = (query == null ? void 0 : query.app) ? {
    app: {
      $oid: (query == null ? void 0 : query.app) || ""
    },
    ...quickFilterObject
  } : quickFilterObject;
  const [openedFilter, toggleOpenedFilter] = useToggle([false, true]);
  const [openedSort, toggleOpenedSort] = useToggle([false, true]);
  const getNewestFilter = (item) => {
    const transform = {
      runs: "createdDate",
      suites: "createdDate"
    };
    return transform[item] || "";
  };
  const {
    firstPageQuery,
    infinityQuery
  } = useInfinityScroll({
    resourceName: groupByValue,
    filterObj: query.filter,
    newestItemsFilterKey: getNewestFilter(groupByValue),
    baseFilterObj: navbarFilterObject,
    sortBy: `${sortBy}:${sortOrder}`
  });
  react.exports.useEffect(function onGroupByChange() {
    setQuery({
      groupBy: groupByValue
    });
  }, [groupByValue]);
  react.exports.useEffect(function refetch() {
    firstPageQuery.refetch();
  }, [query == null ? void 0 : query.app, query == null ? void 0 : query.groupBy, JSON.stringify(quickFilterObject), `${sortBy}:${sortOrder}`]);
  const refreshIconClickHandler = () => {
    setQuery({
      base_filter: null
    });
    activeItemsHandler.clear();
  };
  return /* @__PURE__ */ jsx(Group, {
    position: "apart",
    align: "start",
    noWrap: true,
    children: /* @__PURE__ */ jsx(Navbar, {
      height: "100%",
      width: {
        sm: 350
      },
      className: classes.navbar,
      pt: 0,
      pr: 2,
      pl: 8,
      zIndex: 10,
      styles: {
        root: {
          zIndex: 20
        }
      },
      children: /* @__PURE__ */ jsxs(Navbar.Section, {
        grow: true,
        component: ScrollArea,
        styles: {
          scrollbar: {
            marginTop: "74px"
          }
        },
        pr: 12,
        children: [/* @__PURE__ */ jsxs(Group, {
          position: "apart",
          align: "end",
          sx: {
            width: "100%"
          },
          children: [/* @__PURE__ */ jsx(SafeSelect, {
            label: "Group by",
            "data-test": "navbar-group-by",
            value: groupByValue,
            onChange: handleGroupBySelect,
            optionsData: [
              {
                value: "runs",
                label: "Runs"
              },
              {
                value: "suites",
                label: "Suites"
              },
              {
                value: "test-distinct/browserName",
                label: "Browsers"
              },
              {
                value: "test-distinct/os",
                label: "Platform"
              },
              {
                value: "test-distinct/status",
                label: "Test Status"
              },
              {
                value: "test-distinct/markedAs",
                label: "Accept Status"
              }
            ]
          }), /* @__PURE__ */ jsxs(Group, {
            spacing: 4,
            children: [/* @__PURE__ */ jsx(ActionIcon, {
              "data-test": "navbar-icon-open-filter",
              onClick: () => toggleOpenedFilter(),
              mb: 4,
              children: /* @__PURE__ */ jsx(zV, {
                stroke: 1
              })
            }), /* @__PURE__ */ jsx(ActionIcon, {
              "data-test": "navbar-icon-open-sort",
              onClick: () => toggleOpenedSort(),
              mb: 4,
              children: /* @__PURE__ */ jsx(ea, {
                stroke: 1
              })
            }), /* @__PURE__ */ jsx(ActionIcon, {
              "data-test": "navbar-icon-refresh",
              onClick: () => refreshIconClickHandler(),
              mb: 4,
              children: /* @__PURE__ */ jsx(Epe, {
                stroke: 1
              })
            })]
          })]
        }), /* @__PURE__ */ jsx(Group, {
          sx: {
            width: "100%"
          },
          children: /* @__PURE__ */ jsx(NavbarSort, {
            groupBy: groupByValue,
            toggleOpenedSort,
            sortBy,
            setSortBy,
            setSortOrder,
            sortOrder,
            openedSort
          })
        }), /* @__PURE__ */ jsx(Group, {
          sx: {
            width: "100%"
          },
          children: /* @__PURE__ */ jsx(NavbarFilter, {
            openedFilter,
            quickFilter,
            setQuickFilter,
            debouncedQuickFilter,
            infinityQuery,
            toggleOpenedFilter
          })
        }), infinityQuery.status === "loading" ? /* @__PURE__ */ jsx(SkeletonWrapper, {
          infinityQuery: null,
          itemType: groupByValue,
          num: 20
        }) : infinityQuery.status === "error" ? /* @__PURE__ */ jsxs(Text, {
          color: "red",
          children: ["Error: ", infinityQuery.error.message]
        }) : /* @__PURE__ */ jsx(List, {
          size: "md",
          listStyleType: "none",
          sx: {
            width: "100%"
          },
          styles: {
            itemWrapper: {
              width: "100%"
            }
          },
          pt: 4,
          children: /* @__PURE__ */ jsx(NavbarItems, {
            infinityQuery,
            groupByValue,
            activeItemsHandler
          })
        }), /* @__PURE__ */ jsx(SkeletonWrapper, {
          infinityQuery
        })]
      })
    })
  });
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
      title: "Refresh",
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "table-refresh-icon",
      variant: "subtle",
      onClick: () => firstPageQuery.refetch(),
      children: [/* @__PURE__ */ jsx(Epe, {
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
const tableColumns = {
  _id: {
    label: "Id",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "IdFilter"
  },
  name: {
    label: "Name",
    headStyle: { width: "20%" },
    cellStyle: { width: "20%" },
    type: "StringFilter"
  },
  status: {
    label: "Status",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  creatorUsername: {
    label: "Created",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  markedAs: {
    label: "Accepted",
    headStyle: { width: "auto" },
    cellStyle: {
      width: "auto"
    },
    type: "StringFilter"
  },
  startDate: {
    label: "Date",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "DateFilter"
  },
  browserName: {
    label: "Browser",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  os: {
    label: "Platform",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  run: {
    label: "Run",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "IdFilter"
  },
  suite: {
    label: "Suite",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "IdFilter"
  },
  branch: {
    label: "Branch",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  },
  viewport: {
    label: "Viewport",
    headStyle: { width: "10%" },
    cellStyle: { width: "10%" },
    type: "StringFilter"
  }
};
function InfinityScrollSkeleton({
  infinityQuery,
  visibleFields
}) {
  const {
    ref,
    inView
  } = useInView();
  react.exports.useEffect(() => {
    if (infinityQuery === null)
      return;
    if (inView) {
      infinityQuery.fetchNextPage();
    }
  }, [inView]);
  return /* @__PURE__ */ jsx("tfoot", {
    ref,
    children: (infinityQuery === null || infinityQuery.hasNextPage) && Object.keys(new Array(6).fill("")).map((x2) => /* @__PURE__ */ jsxs("tr", {
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
      }), Object.keys(tableColumns).map((column) => {
        if (!visibleFields.includes(column))
          return void 0;
        if (column === "level") {
          return /* @__PURE__ */ jsx("td", {
            style: {
              ...tableColumns[column].cellStyle,
              paddingLeft: "8px"
            },
            children: /* @__PURE__ */ jsx(Skeleton, {
              height: 34,
              circle: true,
              radius: "xl"
            })
          }, column);
        }
        return /* @__PURE__ */ jsx("td", {
          style: {
            ...tableColumns[column].cellStyle,
            paddingLeft: 5,
            paddingRight: 25
          },
          children: /* @__PURE__ */ jsx(Skeleton, {
            height: 16,
            radius: "md"
          })
        }, column);
      })]
    }, x2))
  });
}
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
        rightIcon: /* @__PURE__ */ jsx(Ol, {
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
const testsCreateStyle = (theme) => ({
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
      children: foldMode ? /* @__PURE__ */ jsx(ua, {
        size: 24,
        stroke: 1
      }) : /* @__PURE__ */ jsx(RX, {
        size: 24,
        stroke: 1
      })
    })
  });
}
function ChecksSkeleton(props) {
  return /* @__PURE__ */ jsxs(Group, {
    children: [/* @__PURE__ */ jsxs(Stack, {
      children: [/* @__PURE__ */ jsx(Skeleton, {
        height: 230,
        width: 230
      }), /* @__PURE__ */ jsx(Skeleton, {
        height: 20,
        width: 230
      })]
    }), /* @__PURE__ */ jsxs(Stack, {
      children: [/* @__PURE__ */ jsx(Skeleton, {
        height: 230,
        width: 230
      }), /* @__PURE__ */ jsx(Skeleton, {
        height: 20,
        width: 230
      })]
    }), /* @__PURE__ */ jsxs(Stack, {
      children: [/* @__PURE__ */ jsx(Skeleton, {
        height: 230,
        width: 230
      }), /* @__PURE__ */ jsx(Skeleton, {
        height: 20,
        width: 230
      })]
    })]
  });
}
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && React.createContext(DefaultContext);
var __assign = globalThis && globalThis.__assign || function() {
  __assign = Object.assign || function(t2) {
    for (var s3, i2 = 1, n = arguments.length; i2 < n; i2++) {
      s3 = arguments[i2];
      for (var p in s3)
        if (Object.prototype.hasOwnProperty.call(s3, p))
          t2[p] = s3[p];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var __rest = globalThis && globalThis.__rest || function(s3, e2) {
  var t2 = {};
  for (var p in s3)
    if (Object.prototype.hasOwnProperty.call(s3, p) && e2.indexOf(p) < 0)
      t2[p] = s3[p];
  if (s3 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i2 = 0, p = Object.getOwnPropertySymbols(s3); i2 < p.length; i2++) {
      if (e2.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s3, p[i2]))
        t2[p[i2]] = s3[p[i2]];
    }
  return t2;
};
function Tree2Element(tree) {
  return tree && tree.map(function(node, i2) {
    return React.createElement(node.tag, __assign({
      key: i2
    }, node.attr), Tree2Element(node.child));
  });
}
function GenIcon(data) {
  return function(props) {
    return /* @__PURE__ */ jsx(IconBase, {
      ...__assign({
        attr: __assign({}, data.attr)
      }, props),
      children: Tree2Element(data.child)
    });
  };
}
function IconBase(props) {
  var elem = function(conf) {
    var attr = props.attr, size = props.size, title = props.title, svgProps = __rest(props, ["attr", "size", "title"]);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className)
      className = conf.className;
    if (props.className)
      className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ jsxs("svg", {
      ...__assign({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className,
        style: __assign(__assign({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }),
      children: [title && /* @__PURE__ */ jsx("title", {
        children: title
      }), props.children]
    });
  };
  return IconContext !== void 0 ? /* @__PURE__ */ jsx(IconContext.Consumer, {
    children: function(conf) {
      return elem(conf);
    }
  }) : elem(DefaultContext);
}
function BsHandThumbsUpFill(props) {
  return GenIcon({ "tag": "svg", "attr": { "fill": "currentColor", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" } }] })(props);
}
function BsHandThumbsUp(props) {
  return GenIcon({ "tag": "svg", "attr": { "fill": "currentColor", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" } }] })(props);
}
function SiAndroid(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396" } }] })(props);
}
function SiApple(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" } }] })(props);
}
function SiFirefox(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M20.452 3.445a11.002 11.002 0 00-2.482-1.908C16.944.997 15.098.093 12.477.032c-.734-.017-1.457.03-2.174.144-.72.114-1.398.292-2.118.56-1.017.377-1.996.975-2.574 1.554.583-.349 1.476-.733 2.55-.992a10.083 10.083 0 013.729-.167c2.341.34 4.178 1.381 5.48 2.625a8.066 8.066 0 011.298 1.587c1.468 2.382 1.33 5.376.184 7.142-.85 1.312-2.67 2.544-4.37 2.53-.583-.023-1.438-.152-2.25-.566-2.629-1.343-3.021-4.688-1.118-6.306-.632-.136-1.82.13-2.646 1.363-.742 1.107-.7 2.816-.242 4.028a6.473 6.473 0 01-.59-1.895 7.695 7.695 0 01.416-3.845A8.212 8.212 0 019.45 5.399c.896-1.069 1.908-1.72 2.75-2.005-.54-.471-1.411-.738-2.421-.767C8.31 2.583 6.327 3.061 4.7 4.41a8.148 8.148 0 00-1.976 2.414c-.455.836-.691 1.659-.697 1.678.122-1.445.704-2.994 1.248-4.055-.79.413-1.827 1.668-2.41 3.042C.095 9.37-.2 11.608.14 13.989c.966 5.668 5.9 9.982 11.843 9.982C18.62 23.971 24 18.591 24 11.956a11.93 11.93 0 00-3.548-8.511z" } }] })(props);
}
function SiGooglechrome(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728Z" } }] })(props);
}
function SiInternetexplorer(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M22.8 7.381c1.125-2.7 1.2-4.95-.15-6.3-1.5-1.499-5.1-1.05-8.924.75h-.45c-2.7 0-5.324.976-7.274 2.7-1.65 1.5-2.85 3.45-3.375 5.625.375-.45 2.475-2.925 4.875-4.275.075 0 .675-.375.675-.375-.075 0-1.2 1.125-1.425 1.35-5.25 5.4-8.324 13.574-5.924 15.973 1.574 1.575 4.424 1.2 7.724-.6 1.425.675 3 .975 4.724.975 2.25 0 4.35-.6 6.15-1.8 1.874-1.2 3.224-3.074 4.05-5.249h-5.85c-.75 1.425-2.475 2.4-4.275 2.4-2.55 0-4.65-2.1-4.724-4.5V13.83h15.298v-.225c0-.375.075-.825.075-1.124 0-1.8-.45-3.525-1.2-5.1zM2.477 22.38c-1.2-1.2-.824-3.524.6-6.299.675 1.875 1.8 3.525 3.225 4.725.45.375.975.75 1.5 1.05-2.4 1.274-4.35 1.5-5.325.524zm15.374-11.398H8.702v-.075c.15-2.325 2.324-4.35 4.874-4.35 2.4 0 4.35 1.875 4.5 4.35v.075zm4.574-4.2c-.45-.75-1.05-1.5-1.725-2.1a11.213 11.213 0 0 0-3.6-2.25c2.4-1.124 4.425-1.274 5.475-.224.825.975.75 2.624-.15 4.574 0 .075 0 .075 0 0 0 .075 0 .075 0 0z" } }] })(props);
}
function SiIos(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M1.1 6.05C.486 6.05 0 6.53 0 7.13A1.08 1.08 0 0 0 1.1 8.21C1.72 8.21 2.21 7.73 2.21 7.13C2.21 6.53 1.72 6.05 1.1 6.05M8.71 6.07C5.35 6.07 3.25 8.36 3.25 12C3.25 15.67 5.35 17.95 8.71 17.95C12.05 17.95 14.16 15.67 14.16 12C14.16 8.36 12.05 6.07 8.71 6.07M19.55 6.07C17.05 6.07 15.27 7.45 15.27 9.5C15.27 11.13 16.28 12.15 18.4 12.64L19.89 13C21.34 13.33 21.93 13.81 21.93 14.64C21.93 15.6 20.96 16.28 19.58 16.28C18.17 16.28 17.11 15.59 17 14.53H15C15.08 16.65 16.82 17.95 19.46 17.95C22.25 17.95 24 16.58 24 14.4C24 12.69 23 11.72 20.68 11.19L19.35 10.89C17.94 10.55 17.36 10.1 17.36 9.34C17.36 8.38 18.24 7.74 19.54 7.74C20.85 7.74 21.75 8.39 21.85 9.46H23.81C23.76 7.44 22.09 6.07 19.55 6.07M8.71 7.82C10.75 7.82 12.06 9.45 12.06 12C12.06 14.57 10.75 16.2 8.71 16.2C6.65 16.2 5.35 14.57 5.35 12C5.35 9.45 6.65 7.82 8.71 7.82M.111 9.31V17.76H2.1V9.31H.11Z" } }] })(props);
}
function SiLinux(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z" } }] })(props);
}
function SiMicrosoftedge(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M21.86 17.86q.14 0 .25.12.1.13.1.25t-.11.33l-.32.46-.43.53-.44.5q-.21.25-.38.42l-.22.23q-.58.53-1.34 1.04-.76.51-1.6.91-.86.4-1.74.64t-1.67.24q-.9 0-1.69-.28-.8-.28-1.48-.78-.68-.5-1.22-1.17-.53-.66-.92-1.44-.38-.77-.58-1.6-.2-.83-.2-1.67 0-1 .32-1.96.33-.97.87-1.8.14.95.55 1.77.41.82 1.02 1.5.6.68 1.38 1.21.78.54 1.64.9.86.36 1.77.56.92.2 1.8.2 1.12 0 2.18-.24 1.06-.23 2.06-.72l.2-.1.2-.05zm-15.5-1.27q0 1.1.27 2.15.27 1.06.78 2.03.51.96 1.24 1.77.74.82 1.66 1.4-1.47-.2-2.8-.74-1.33-.55-2.48-1.37-1.15-.83-2.08-1.9-.92-1.07-1.58-2.33T.36 14.94Q0 13.54 0 12.06q0-.81.32-1.49.31-.68.83-1.23.53-.55 1.2-.96.66-.4 1.35-.66.74-.27 1.5-.39.78-.12 1.55-.12.7 0 1.42.1.72.12 1.4.35.68.23 1.32.57.63.35 1.16.83-.35 0-.7.07-.33.07-.65.23v-.02q-.63.28-1.2.74-.57.46-1.05 1.04-.48.58-.87 1.26-.38.67-.65 1.39-.27.71-.42 1.44-.15.72-.15 1.38zM11.96.06q1.7 0 3.33.39 1.63.38 3.07 1.15 1.43.77 2.62 1.93 1.18 1.16 1.98 2.7.49.94.76 1.96.28 1 .28 2.08 0 .89-.23 1.7-.24.8-.69 1.48-.45.68-1.1 1.22-.64.53-1.45.88-.54.24-1.11.36-.58.13-1.16.13-.42 0-.97-.03-.54-.03-1.1-.12-.55-.1-1.05-.28-.5-.19-.84-.5-.12-.09-.23-.24-.1-.16-.1-.33 0-.15.16-.35.16-.2.35-.5.2-.28.36-.68.16-.4.16-.95 0-1.06-.4-1.96-.4-.91-1.06-1.64-.66-.74-1.52-1.28-.86-.55-1.79-.89-.84-.3-1.72-.44-.87-.14-1.76-.14-1.55 0-3.06.45T.94 7.55q.71-1.74 1.81-3.13 1.1-1.38 2.52-2.35Q6.68 1.1 8.37.58q1.7-.52 3.58-.52Z" } }] })(props);
}
function SiSafari(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-.75c6.213 0 11.25-5.037 11.25-11.25S18.213.75 12 .75.75 5.787.75 12 5.787 23.25 12 23.25zM12 2a.25.25 0 0 1 .25.25v1a.25.25 0 1 1-.5 0v-1A.25.25 0 0 1 12 2zm0 18.5a.25.25 0 0 1 .25.25v1a.25.25 0 1 1-.5 0v-1a.25.25 0 0 1 .25-.25zm7.071-15.571a.25.25 0 0 1 0 .353l-.707.708a.25.25 0 0 1-.354-.354l.708-.707a.25.25 0 0 1 .353 0zM5.99 18.01a.25.25 0 0 1 0 .354l-.708.707a.25.25 0 1 1-.353-.353l.707-.708a.25.25 0 0 1 .354 0zM4.929 4.93a.25.25 0 0 1 .353 0l.708.707a.25.25 0 0 1-.354.354l-.707-.708a.25.25 0 0 1 0-.353zM18.01 18.01a.25.25 0 0 1 .354 0l.707.708a.25.25 0 1 1-.353.353l-.708-.707a.25.25 0 0 1 0-.354zM2 12a.25.25 0 0 1 .25-.25h1a.25.25 0 1 1 0 .5h-1A.25.25 0 0 1 2 12zm18.5 0a.25.25 0 0 1 .25-.25h1a.25.25 0 1 1 0 .5h-1a.25.25 0 0 1-.25-.25zm-4.593-9.205a.25.25 0 0 1 .133.328l-.391.92a.25.25 0 1 1-.46-.195l.39-.92a.25.25 0 0 1 .328-.133zM8.68 19.825a.25.25 0 0 1 .132.327l-.39.92a.25.25 0 0 1-.46-.195l.39-.92a.25.25 0 0 1 .328-.133zM21.272 8.253a.25.25 0 0 1-.138.325l-.927.375a.25.25 0 1 1-.188-.464l.927-.374a.25.25 0 0 1 .326.138zm-17.153 6.93a.25.25 0 0 1-.138.326l-.927.374a.25.25 0 1 1-.188-.463l.927-.375a.25.25 0 0 1 .326.138zM8.254 2.728a.25.25 0 0 1 .325.138l.375.927a.25.25 0 0 1-.464.188l-.374-.927a.25.25 0 0 1 .138-.326zm6.93 17.153a.25.25 0 0 1 .326.138l.374.927a.25.25 0 1 1-.463.188l-.375-.927a.25.25 0 0 1 .138-.326zM2.795 8.093a.25.25 0 0 1 .328-.133l.92.391a.25.25 0 0 1-.195.46l-.92-.39a.25.25 0 0 1-.133-.328zm17.03 7.228a.25.25 0 0 1 .327-.132l.92.39a.25.25 0 1 1-.195.46l-.92-.39a.25.25 0 0 1-.133-.328zM12.879 12.879L11.12 11.12l-4.141 5.9 5.899-4.142zm6.192-7.95l-5.834 8.308-8.308 5.834 5.834-8.308 8.308-5.834z" } }] })(props);
}
function SiWindows(props) {
  return GenIcon({ "tag": "svg", "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "title", "attr": {}, "child": [] }, { "tag": "path", "attr": { "d": "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" } }] })(props);
}
function TbQuestionMark(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "fill": "none", "strokeLinecap": "round", "strokeLinejoin": "round" }, "child": [{ "tag": "desc", "attr": {}, "child": [] }, { "tag": "path", "attr": { "stroke": "none", "d": "M0 0h24v24H0z", "fill": "none" } }, { "tag": "path", "attr": { "d": "M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" } }, { "tag": "line", "attr": { "x1": "12", "y1": "19", "x2": "12", "y2": "19.01" } }] })(props);
}
function AcceptButton({
  check,
  testUpdateQuery,
  checksQuery,
  size = 19
}) {
  var _a, _b;
  const theme = useMantineTheme();
  const isAccepted = check.markedAs === "accepted";
  const isCurrentlyAccepted = ((_a = check.baselineId) == null ? void 0 : _a._id) === ((_b = check.actualSnapshotId) == null ? void 0 : _b._id) && isAccepted;
  const likeIconColor = isAccepted ? theme.colorScheme === "dark" ? "green.8" : "green.6" : "gray";
  const mutationAcceptCheck = useMutation((data) => ChecksService.acceptCheck(data), {
    onSuccess: async (result) => {
      successMsg({
        message: "Check has been successfully accepted"
      });
      checksQuery.refetch();
      if (testUpdateQuery)
        testUpdateQuery.refetch();
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot accept the check"
      });
      log.error(e2);
    }
  });
  const notAcceptedIcon = check.failReasons.includes("not_accepted") ? /* @__PURE__ */ jsx(Badge, {
    component: "div",
    title: "The check is not accepted",
    pl: 4,
    pr: 4,
    pt: 6,
    pb: 6,
    color: "yellow",
    variant: "filled",
    radius: "xl",
    "data-test": "check-wrong-images-size-error-icon",
    sx: {
      fontSize: "12px",
      position: "absolute",
      bottom: 11,
      left: 14,
      lineHeight: "16px",
      fontWeight: 600,
      fontFamily: '"Roboto","Arial",sans-serif',
      border: "2px",
      borderStyle: "solid",
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
    },
    children: "!"
  }) : "";
  const handleAcceptCheckClick = () => {
    if (isCurrentlyAccepted)
      return;
    mutationAcceptCheck.mutate({
      check,
      newBaselineId: check.actualSnapshotId._id
    });
  };
  return /* @__PURE__ */ jsx(ActionPopoverIcon, {
    color: likeIconColor,
    buttonColor: "green",
    sx: {
      cursor: isCurrentlyAccepted ? "default" : "pointer",
      "&:hover": {
        backgroundColor: isCurrentlyAccepted ? "rgba(255, 255, 255, 0);" : ""
      }
    },
    testAttr: "check-accept-icon",
    variant: "subtle",
    paused: isCurrentlyAccepted,
    icon: isCurrentlyAccepted && isAccepted ? /* @__PURE__ */ jsx(BsHandThumbsUpFill, {
      size
    }) : /* @__PURE__ */ jsxs(Fragment, {
      children: [/* @__PURE__ */ jsx(BsHandThumbsUp, {
        size
      }), " ", notAcceptedIcon]
    }),
    action: handleAcceptCheckClick,
    title: "Accept the check actual screenshot",
    loading: mutationAcceptCheck.isLoading,
    confirmLabel: "Accept",
    size
  });
}
function RemoveButton({
  checksQuery,
  testUpdateQuery,
  check,
  closeHandler,
  size = 24
}) {
  const mutationRemoveCheck = useMutation((data) => ChecksService.removeCheck(data), {
    onSuccess: async (result) => {
      successMsg({
        message: "Check has been successfully removed"
      });
      log.debug({
        result
      });
      checksQuery.refetch();
      if (testUpdateQuery)
        testUpdateQuery.refetch();
      if (closeHandler)
        closeHandler();
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot remove the check"
      });
      log.error(e2);
    }
  });
  const handleRemoveCheckClick = () => {
    mutationRemoveCheck.mutate({
      id: check._id
    });
  };
  return /* @__PURE__ */ jsx(ActionPopoverIcon, {
    testAttr: "check-remove-icon",
    variant: "subtle",
    icon: /* @__PURE__ */ jsx(rWe, {
      stroke: 1,
      size
    }),
    action: handleRemoveCheckClick,
    title: "Delete check",
    loading: mutationRemoveCheck.isLoading,
    confirmLabel: "Delete",
    size
  });
}
function ViewPortLabel({
  check,
  sizes: sizes2,
  size = "",
  checksViewSize,
  fontSize = "12px",
  displayed = true,
  color = "dark"
}) {
  const theme = useMantineTheme();
  const wrongSizeIcon = check.failReasons.includes("wrong_dimensions") ? /* @__PURE__ */ jsx(Badge, {
    component: "div",
    title: "Actual and Expected Screenshots have different size",
    pl: 4,
    pr: 4,
    pt: 6,
    pb: 6,
    color: "yellow",
    variant: "filled",
    radius: "xl",
    "data-test": "check-wrong-images-size-error-icon",
    sx: {
      fontSize: "12px",
      position: "absolute",
      top: -10,
      right: -10,
      lineHeight: "16px",
      fontWeight: 600,
      fontFamily: '"Roboto","Arial",sans-serif',
      border: "2px",
      borderStyle: "solid",
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "white"
    },
    children: "!"
  }) : "";
  return /* @__PURE__ */ jsxs(Group, {
    sx: {
      display: displayed ? "block" : "none",
      position: "relative"
    },
    children: [/* @__PURE__ */ jsx(Badge, {
      color,
      size: size || sizes2[checksViewSize].viewportText,
      title: "Screen Viewport",
      sx: {
        fontSize,
        display: displayed ? "block" : "none"
      },
      children: check.viewport
    }), wrongSizeIcon]
  });
}
const sizes = {
  small: {
    coefficient: 0.5,
    statusBadge: "xs",
    viewportText: "xs"
  },
  medium: {
    coefficient: 0.8,
    statusBadge: "sm",
    viewportText: "sm"
  },
  large: {
    coefficient: 1.4,
    statusBadge: "md",
    viewportText: "sm"
  },
  xlarge: {
    coefficient: 2,
    statusBadge: "md",
    viewportText: "sm"
  }
};
const statusColor = (status) => {
  const map = {
    new: "blue",
    passed: "green",
    failed: "red"
  };
  return map[status] || "gray";
};
function Status$1({
  check,
  size
}) {
  const [checksViewSize] = useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  return /* @__PURE__ */ jsx(Badge, {
    color: statusColor(check.status),
    variant: "light",
    size: size || sizes[checksViewSize].statusBadge,
    title: "Check status",
    children: /* @__PURE__ */ jsx(Group, {
      spacing: 0,
      align: "center",
      noWrap: true,
      children: check.status
    })
  });
}
function Check({
  check,
  checksViewMode,
  checksQuery,
  testUpdateQuery
}) {
  var _a, _b, _c;
  const {
    setQuery,
    query
  } = useParams();
  const [checksViewSize] = useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  const imageWeight = 24 * sizes[checksViewSize].coefficient;
  const theme = useMantineTheme();
  const imageFilename = ((_a = check.diffId) == null ? void 0 : _a.filename) || ((_b = check.actualSnapshotId) == null ? void 0 : _b.filename) || ((_c = check.baselineId) == null ? void 0 : _c.filename);
  const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;
  const linkToCheckOverlay = `/index2/?${queryString.stringify({
    ...query,
    checkId: check._id
  })}`;
  const handlePreviewLinkClick = (e2) => {
    if (e2.metaKey || e2.ctrlKey)
      return;
    e2.preventDefault();
  };
  const handlePreviewImageClick = (e2) => {
    if (e2.metaKey || e2.ctrlKey)
      return;
    setQuery({
      checkId: check._id
    });
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: checksViewMode === "list" ? /* @__PURE__ */ jsxs(Group, {
      p: "sm",
      sx: {
        width: "100%",
        borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2]}`,
        "&:hover": {
          backgroundColor: theme.colors.gray[2]
        }
      },
      position: "apart",
      children: [/* @__PURE__ */ jsx(Paper, {
        shadow: "md",
        pb: 0,
        children: /* @__PURE__ */ jsx(Image$1, {
          src: imagePreviewSrc,
          fit: "contain",
          width: imageWeight * 4,
          withPlaceholder: true,
          alt: check.name,
          styles: () => ({
            image: {
              height: "auto",
              aspectRatio: "1/1"
            }
          }),
          onClick: () => setQuery({
            checkId: check._id
          })
        })
      }), /* @__PURE__ */ jsx(Text, {
        sx: {
          width: "50%"
        },
        children: check.name
      }), /* @__PURE__ */ jsxs(Group, {
        position: "right",
        children: [/* @__PURE__ */ jsx(Status$1, {
          check
        }), /* @__PURE__ */ jsx(ViewPortLabel, {
          check,
          sizes,
          checksViewSize
        }), /* @__PURE__ */ jsxs(Group, {
          spacing: 4,
          position: "left",
          noWrap: true,
          children: [/* @__PURE__ */ jsx(AcceptButton, {
            check,
            testUpdateQuery,
            checksQuery
          }), /* @__PURE__ */ jsx(RemoveButton, {
            checksQuery,
            testUpdateQuery,
            check
          })]
        })]
      })]
    }) : /* @__PURE__ */ jsxs(Card, {
      sx: {
        width: `${imageWeight}%`,
        "&:hover": {
          boxShadow: "0 1px 3px rgb(0 0 0 / 15%), rgb(0 0 0 / 15%) 0px 10px 15px -5px, rgb(0 0 0 / 14%) 0px 7px 7px -5px"
        }
      },
      m: 1,
      pt: 0,
      pb: 0,
      pl: 0,
      pr: 0,
      shadow: "sm",
      children: [/* @__PURE__ */ jsx(Paper, {
        p: "sm",
        ml: 0,
        mr: 0,
        sx: {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2]
        },
        radius: 0,
        children: /* @__PURE__ */ jsx(Text, {
          children: check.name
        })
      }), /* @__PURE__ */ jsx(Card.Section, {
        m: 2,
        children: /* @__PURE__ */ jsx(Group, {
          position: "center",
          children: /* @__PURE__ */ jsx("a", {
            href: linkToCheckOverlay,
            onClick: handlePreviewLinkClick,
            style: {
              display: "inline-block"
            },
            children: /* @__PURE__ */ jsx(Image$1, {
              src: imagePreviewSrc,
              fit: "contain",
              width: "100%",
              alt: check.name,
              styles: () => ({
                image: {
                  height: "auto",
                  aspectRatio: checksViewMode === "bounded" ? "1/1" : ""
                }
              }),
              onClick: handlePreviewImageClick
            })
          })
        })
      }), /* @__PURE__ */ jsxs(Group, {
        position: "apart",
        pl: "xs",
        pr: "xs",
        mt: "xs",
        mb: 8,
        spacing: "xs",
        align: "center",
        noWrap: true,
        children: [/* @__PURE__ */ jsx(Status$1, {
          check
        }), /* @__PURE__ */ jsx(ViewPortLabel, {
          check,
          sizes,
          size: "sm",
          fontSize: "10px",
          checksViewSize,
          displayed: checksViewSize !== "small"
        }), /* @__PURE__ */ jsxs(Group, {
          spacing: 4,
          position: "right",
          noWrap: true,
          children: [/* @__PURE__ */ jsx(AcceptButton, {
            check,
            testUpdateQuery,
            checksQuery
          }), /* @__PURE__ */ jsx(RemoveButton, {
            checksQuery,
            testUpdateQuery,
            check
          })]
        })]
      })]
    })
  });
}
function Checks({
  item,
  testUpdateQuery,
  infinityQuery
}) {
  var _a, _b, _c, _d;
  const [checksViewMode, setChecksViewMode] = useLocalStorage({
    key: "check-view-mode",
    defaultValue: "bounded"
  });
  const checksQuery = useQuery(["checks", item._id, (_b = (_a = infinityQuery == null ? void 0 : infinityQuery.data) == null ? void 0 : _a.pages[0]) == null ? void 0 : _b.timestamp], () => GenericService.get("checks", {
    _id: {
      $in: item.checks
    }
  }, {
    populate: "baselineId,actualSnapshotId,diffId",
    limit: "0"
  }, "checksByIds"), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  const ChecksContainer = checksViewMode === "list" ? Stack : Group;
  return /* @__PURE__ */ jsx(Fragment, {
    children: checksQuery.isLoading ? /* @__PURE__ */ jsx(ChecksSkeleton, {}) : checksQuery.isError ? /* @__PURE__ */ jsx(Text, {
      color: "red",
      size: "md",
      children: "Cannot load the data"
    }) : ((_d = (_c = checksQuery == null ? void 0 : checksQuery.data) == null ? void 0 : _c.results) == null ? void 0 : _d.length) < 1 ? /* @__PURE__ */ jsx(Text, {
      size: "md",
      children: "Test does not have any checks"
    }) : /* @__PURE__ */ jsx(ChecksContainer, {
      p: 20,
      align: "start",
      children: checksQuery.data.results.map((check) => /* @__PURE__ */ jsx(Check, {
        check,
        checksViewMode,
        checksQuery,
        testUpdateQuery
      }, check._id))
    })
  });
}
function StartDate({
  type,
  test,
  itemValue
}) {
  return /* @__PURE__ */ jsx("td", {
    title: test.level,
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle,
      paddingLeft: "2px"
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: itemValue,
      children: /* @__PURE__ */ jsx(Text, {
        lineClamp: 1,
        sx: {
          wordBreak: "break-all"
        },
        children: format(parseISO(itemValue), "yyyy-MM-dd HH:mm:ss")
      })
    })
  }, type);
}
function Status({
  type,
  test
}) {
  const checkStatuses = react.exports.useMemo(() => {
    if (test.checks && test.checks.length > 0) {
      return test.checks.map((check) => check.status[0]);
    }
    return [];
  }, [JSON.stringify(test)]);
  return /* @__PURE__ */ jsx("td", {
    title: test.level,
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle,
      paddingLeft: "2px"
    },
    children: /* @__PURE__ */ jsx(Group, {
      position: "left",
      pl: 6,
      children: /* @__PURE__ */ jsx(StatusesRing, {
        statuses: checkStatuses
      }, type)
    })
  }, type);
}
const osIconMap = (key) => {
  const map = {
    "Linux x86_64": SiLinux,
    ios: SiIos,
    android: SiAndroid,
    Win32: SiWindows,
    WINDOWS: SiWindows,
    MacIntel: SiApple,
    macOS: SiApple
  };
  return map[key] || TbQuestionMark;
};
function OsIcon({
  os,
  size = 24,
  ...rest
}) {
  const BIcon = osIconMap(os);
  return /* @__PURE__ */ jsx(BIcon, {
    title: os,
    size,
    ...rest
  });
}
function Os({
  type,
  test,
  itemValue
}) {
  return /* @__PURE__ */ jsx("td", {
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: test[type],
      multiline: true,
      children: /* @__PURE__ */ jsxs(Group, {
        spacing: 6,
        align: "center",
        noWrap: true,
        children: [/* @__PURE__ */ jsx(OsIcon, {
          size: 18,
          os: itemValue
        }), /* @__PURE__ */ jsx(Text, {
          lineClamp: 1,
          sx: {
            wordBreak: "break-all"
          },
          children: itemValue
        })]
      })
    })
  }, type);
}
const browserIconMap = (key) => {
  const map = {
    chrome: SiGooglechrome,
    "chrome [HEADLESS]": SiGooglechrome,
    Chrome: SiGooglechrome,
    firefox: SiFirefox,
    Firefox: SiFirefox,
    msedge: SiMicrosoftedge,
    Msedge: SiMicrosoftedge,
    Safari: SiSafari,
    safari: SiSafari,
    "internet explorer": SiInternetexplorer
  };
  return map[key] || TbQuestionMark;
};
function BrowserIcon({
  browser,
  size = 24,
  color = "",
  ...rest
}) {
  const BrowIcon = browserIconMap(browser);
  return /* @__PURE__ */ jsx(BrowIcon, {
    size,
    title: browser,
    color,
    ...rest
  });
}
function BrowserName({
  type,
  test,
  itemValue
}) {
  return /* @__PURE__ */ jsx("td", {
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: test[type],
      multiline: true,
      children: /* @__PURE__ */ jsxs(Group, {
        spacing: 6,
        align: "center",
        noWrap: true,
        children: [/* @__PURE__ */ jsx(BrowserIcon, {
          size: 24,
          browser: itemValue
        }), /* @__PURE__ */ jsx(Text, {
          lineClamp: 1,
          sx: {
            wordBreak: "break-all"
          },
          children: itemValue
        })]
      })
    })
  }, type);
}
function Branch({
  type,
  test,
  itemValue
}) {
  return /* @__PURE__ */ jsx("td", {
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: test[type],
      multiline: true,
      children: /* @__PURE__ */ jsx(Badge, {
        size: "sm",
        color: "dark",
        leftSection: /* @__PURE__ */ jsx(UZ, {
          style: {
            marginTop: "4"
          },
          size: 11
        }),
        children: /* @__PURE__ */ jsx(Text, {
          lineClamp: 1,
          sx: {
            wordBreak: "break-all"
          },
          children: itemValue
        })
      })
    })
  }, type);
}
function Viewport({
  type,
  test,
  itemValue
}) {
  return /* @__PURE__ */ jsx("td", {
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: test[type],
      multiline: true,
      children: /* @__PURE__ */ jsx(Badge, {
        size: "md",
        color: "blue",
        children: /* @__PURE__ */ jsx(Text, {
          lineClamp: 1,
          sx: {
            wordBreak: "break-all"
          },
          children: itemValue
        })
      })
    })
  }, type);
}
const useStyles$1 = createStyles(testsCreateStyle);
function Cell({
  type,
  test,
  itemValue
}) {
  const cellsMap = {
    status: /* @__PURE__ */ jsx(Status, {
      type,
      test
    }, type),
    startDate: /* @__PURE__ */ jsx(StartDate, {
      type,
      test,
      itemValue
    }, type),
    os: /* @__PURE__ */ jsx(Os, {
      type,
      test,
      itemValue
    }, type),
    browserName: /* @__PURE__ */ jsx(BrowserName, {
      type,
      test,
      itemValue
    }, type),
    branch: /* @__PURE__ */ jsx(Branch, {
      type,
      test,
      itemValue
    }, type),
    viewport: /* @__PURE__ */ jsx(Viewport, {
      type,
      test,
      itemValue
    }, type)
  };
  return cellsMap[type] || /* @__PURE__ */ jsx("td", {
    "data-test": `table-row-${tableColumns[type].label}`,
    style: {
      ...tableColumns[type].cellStyle
    },
    children: /* @__PURE__ */ jsx(Tooltip, {
      label: test[type],
      multiline: true,
      children: /* @__PURE__ */ jsx(Text, {
        lineClamp: 1,
        sx: {
          wordBreak: "break-all"
        },
        children: itemValue
      })
    })
  }, type);
}
function Row({
  item,
  toggleRow,
  toggleCollapse,
  index,
  visibleFields,
  selection,
  collapse,
  infinityQuery
}) {
  var _a;
  const {
    classes,
    cx
  } = useStyles$1();
  const selected = selection.includes(item.id);
  const testUpdateQuery = useQuery(["testUpdateQuery", item._id], () => GenericService.get("tests", {
    _id: item._id
  }, {
    populate: "checks",
    limit: "0"
  }, "testUpdateQuery"), {
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  const test = react.exports.useMemo(() => {
    var _a2, _b, _c;
    if ((_b = (_a2 = testUpdateQuery.data) == null ? void 0 : _a2.results) == null ? void 0 : _b.length)
      return (_c = testUpdateQuery.data) == null ? void 0 : _c.results[0];
    return item;
  }, [JSON.stringify(item), JSON.stringify((_a = testUpdateQuery.data) == null ? void 0 : _a.results)]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("tr", {
      "data-test": `table_row_${index}`,
      className: cx({
        [classes.rowSelected]: selected
      }),
      style: {
        cursor: "pointer"
      },
      onClick: () => toggleCollapse(test.id),
      children: [/* @__PURE__ */ jsx("td", {
        children: /* @__PURE__ */ jsx(Checkbox, {
          "data-test": "table-item-checkbox",
          checked: selected,
          onChange: (event) => {
            event.stopPropagation();
            toggleRow(test.id);
          },
          onClick: (event) => {
            event.stopPropagation();
          }
        })
      }), Object.keys(tableColumns).map((column) => {
        if (!visibleFields.includes(column))
          return void 0;
        const itemValue = column.includes(".") ? test[column == null ? void 0 : column.split(".")[0]][column == null ? void 0 : column.split(".")[1]] : test[column];
        return /* @__PURE__ */ jsx(Cell, {
          test,
          type: column,
          itemValue
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
          in: collapse.includes(test.id),
          pl: 10,
          pr: 10,
          pt: 10,
          pb: 10,
          "data-test": "table-test-collapsed-row",
          children: /* @__PURE__ */ jsx(Checks, {
            item: test,
            testUpdateQuery,
            infinityQuery
          })
        })
      })
    })]
  });
}
const Rows = ({
  infinityQuery,
  selection,
  setSelection,
  visibleFields
}) => {
  const [collapse, setCollapse] = react.exports.useState([]);
  const {
    data
  } = infinityQuery;
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
  return data.pages.map((page) => page.results.map((item, index) => /* @__PURE__ */ jsx(Row, {
    item,
    infinityQuery,
    toggleRow,
    toggleCollapse,
    index,
    visibleFields,
    selection,
    collapse
  }, item.id)));
};
function Heads({
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
        checked: selection && data ? selection.length === data.length : false,
        indeterminate: selection && data ? selection.length > 0 && selection.length !== data.length : false,
        transitionDuration: 0
      })
    }), Object.keys(tableColumns).map((column) => {
      if (visibleFields.includes(column)) {
        return /* @__PURE__ */ jsx("th", {
          style: {
            ...tableColumns[column].headStyle
          },
          "data-test": `table-header-${tableColumns[column].label}`,
          children: /* @__PURE__ */ jsx(Text, {
            transform: "capitalize",
            children: tableColumns[column].label
          })
        }, column);
      }
      return void 0;
    })]
  });
}
var fabric$1 = {};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
(function(exports) {
  /*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */
  var fabric2 = fabric2 || { version: "5.2.4" };
  {
    exports.fabric = fabric2;
  }
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    if (document instanceof (typeof HTMLDocument !== "undefined" ? HTMLDocument : Document)) {
      fabric2.document = document;
    } else {
      fabric2.document = document.implementation.createHTMLDocument("");
    }
    fabric2.window = window;
  } else {
    var jsdom = require$$2;
    var virtualWindow = new jsdom.JSDOM(
      decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"),
      {
        features: {
          FetchExternalResources: ["img"]
        },
        resources: "usable"
      }
    ).window;
    fabric2.document = virtualWindow.document;
    fabric2.jsdomImplForWrapper = require$$2.implForWrapper;
    fabric2.nodeCanvas = require$$2.Canvas;
    fabric2.window = virtualWindow;
    DOMParser = fabric2.window.DOMParser;
  }
  fabric2.isTouchSupported = "ontouchstart" in fabric2.window || "ontouchstart" in fabric2.document || fabric2.window && fabric2.window.navigator && fabric2.window.navigator.maxTouchPoints > 0;
  fabric2.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";
  fabric2.SHARED_ATTRIBUTES = [
    "display",
    "transform",
    "fill",
    "fill-opacity",
    "fill-rule",
    "opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-linecap",
    "stroke-dashoffset",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "id",
    "paint-order",
    "vector-effect",
    "instantiated_by_use",
    "clip-path"
  ];
  fabric2.DPI = 96;
  fabric2.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)";
  fabric2.commaWsp = "(?:\\s+,?\\s*|,\\s*)";
  fabric2.rePathCommand = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/ig;
  fabric2.reNonWord = /[ \n\.,;!\?\-]/;
  fabric2.fontPaths = {};
  fabric2.iMatrix = [1, 0, 0, 1, 0, 0];
  fabric2.svgNS = "http://www.w3.org/2000/svg";
  fabric2.perfLimitSizeTotal = 2097152;
  fabric2.maxCacheSideLimit = 4096;
  fabric2.minCacheSideLimit = 256;
  fabric2.charWidthsCache = {};
  fabric2.textureSize = 2048;
  fabric2.disableStyleCopyPaste = false;
  fabric2.enableGLFiltering = true;
  fabric2.devicePixelRatio = fabric2.window.devicePixelRatio || fabric2.window.webkitDevicePixelRatio || fabric2.window.mozDevicePixelRatio || 1;
  fabric2.browserShadowBlurConstant = 1;
  fabric2.arcToSegmentsCache = {};
  fabric2.boundsOfCurveCache = {};
  fabric2.cachesBoundsOfCurve = true;
  fabric2.forceGLPutImageData = false;
  fabric2.initFilterBackend = function() {
    if (fabric2.enableGLFiltering && fabric2.isWebglSupported && fabric2.isWebglSupported(fabric2.textureSize)) {
      console.log("max texture size: " + fabric2.maxTextureSize);
      return new fabric2.WebglFilterBackend({ tileSize: fabric2.textureSize });
    } else if (fabric2.Canvas2dFilterBackend) {
      return new fabric2.Canvas2dFilterBackend();
    }
  };
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    window.fabric = fabric2;
  }
  (function() {
    function _removeEventListener(eventName, handler) {
      if (!this.__eventListeners[eventName]) {
        return;
      }
      var eventListener = this.__eventListeners[eventName];
      if (handler) {
        eventListener[eventListener.indexOf(handler)] = false;
      } else {
        fabric2.util.array.fill(eventListener, false);
      }
    }
    function on(eventName, handler) {
      if (!this.__eventListeners) {
        this.__eventListeners = {};
      }
      if (arguments.length === 1) {
        for (var prop in eventName) {
          this.on(prop, eventName[prop]);
        }
      } else {
        if (!this.__eventListeners[eventName]) {
          this.__eventListeners[eventName] = [];
        }
        this.__eventListeners[eventName].push(handler);
      }
      return this;
    }
    function _once(eventName, handler) {
      var _handler = function() {
        handler.apply(this, arguments);
        this.off(eventName, _handler);
      }.bind(this);
      this.on(eventName, _handler);
    }
    function once(eventName, handler) {
      if (arguments.length === 1) {
        for (var prop in eventName) {
          _once.call(this, prop, eventName[prop]);
        }
      } else {
        _once.call(this, eventName, handler);
      }
      return this;
    }
    function off(eventName, handler) {
      if (!this.__eventListeners) {
        return this;
      }
      if (arguments.length === 0) {
        for (eventName in this.__eventListeners) {
          _removeEventListener.call(this, eventName);
        }
      } else if (arguments.length === 1 && typeof arguments[0] === "object") {
        for (var prop in eventName) {
          _removeEventListener.call(this, prop, eventName[prop]);
        }
      } else {
        _removeEventListener.call(this, eventName, handler);
      }
      return this;
    }
    function fire(eventName, options) {
      if (!this.__eventListeners) {
        return this;
      }
      var listenersForEvent = this.__eventListeners[eventName];
      if (!listenersForEvent) {
        return this;
      }
      for (var i2 = 0, len = listenersForEvent.length; i2 < len; i2++) {
        listenersForEvent[i2] && listenersForEvent[i2].call(this, options || {});
      }
      this.__eventListeners[eventName] = listenersForEvent.filter(function(value) {
        return value !== false;
      });
      return this;
    }
    fabric2.Observable = {
      fire,
      on,
      once,
      off
    };
  })();
  fabric2.Collection = {
    _objects: [],
    add: function() {
      this._objects.push.apply(this._objects, arguments);
      if (this._onObjectAdded) {
        for (var i2 = 0, length = arguments.length; i2 < length; i2++) {
          this._onObjectAdded(arguments[i2]);
        }
      }
      this.renderOnAddRemove && this.requestRenderAll();
      return this;
    },
    insertAt: function(object, index, nonSplicing) {
      var objects = this._objects;
      if (nonSplicing) {
        objects[index] = object;
      } else {
        objects.splice(index, 0, object);
      }
      this._onObjectAdded && this._onObjectAdded(object);
      this.renderOnAddRemove && this.requestRenderAll();
      return this;
    },
    remove: function() {
      var objects = this._objects, index, somethingRemoved = false;
      for (var i2 = 0, length = arguments.length; i2 < length; i2++) {
        index = objects.indexOf(arguments[i2]);
        if (index !== -1) {
          somethingRemoved = true;
          objects.splice(index, 1);
          this._onObjectRemoved && this._onObjectRemoved(arguments[i2]);
        }
      }
      this.renderOnAddRemove && somethingRemoved && this.requestRenderAll();
      return this;
    },
    forEachObject: function(callback, context) {
      var objects = this.getObjects();
      for (var i2 = 0, len = objects.length; i2 < len; i2++) {
        callback.call(context, objects[i2], i2, objects);
      }
      return this;
    },
    getObjects: function(type) {
      if (typeof type === "undefined") {
        return this._objects.concat();
      }
      return this._objects.filter(function(o) {
        return o.type === type;
      });
    },
    item: function(index) {
      return this._objects[index];
    },
    isEmpty: function() {
      return this._objects.length === 0;
    },
    size: function() {
      return this._objects.length;
    },
    contains: function(object, deep) {
      if (this._objects.indexOf(object) > -1) {
        return true;
      } else if (deep) {
        return this._objects.some(function(obj) {
          return typeof obj.contains === "function" && obj.contains(object, true);
        });
      }
      return false;
    },
    complexity: function() {
      return this._objects.reduce(function(memo, current) {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      }, 0);
    }
  };
  fabric2.CommonMethods = {
    _setOptions: function(options) {
      for (var prop in options) {
        this.set(prop, options[prop]);
      }
    },
    _initGradient: function(filler, property) {
      if (filler && filler.colorStops && !(filler instanceof fabric2.Gradient)) {
        this.set(property, new fabric2.Gradient(filler));
      }
    },
    _initPattern: function(filler, property, callback) {
      if (filler && filler.source && !(filler instanceof fabric2.Pattern)) {
        this.set(property, new fabric2.Pattern(filler, callback));
      } else {
        callback && callback();
      }
    },
    _setObject: function(obj) {
      for (var prop in obj) {
        this._set(prop, obj[prop]);
      }
    },
    set: function(key, value) {
      if (typeof key === "object") {
        this._setObject(key);
      } else {
        this._set(key, value);
      }
      return this;
    },
    _set: function(key, value) {
      this[key] = value;
    },
    toggle: function(property) {
      var value = this.get(property);
      if (typeof value === "boolean") {
        this.set(property, !value);
      }
      return this;
    },
    get: function(property) {
      return this[property];
    }
  };
  (function(global) {
    var sqrt = Math.sqrt, atan2 = Math.atan2, pow = Math.pow, PiBy180 = Math.PI / 180, PiBy2 = Math.PI / 2;
    fabric2.util = {
      cos: function(angle) {
        if (angle === 0) {
          return 1;
        }
        if (angle < 0) {
          angle = -angle;
        }
        var angleSlice = angle / PiBy2;
        switch (angleSlice) {
          case 1:
          case 3:
            return 0;
          case 2:
            return -1;
        }
        return Math.cos(angle);
      },
      sin: function(angle) {
        if (angle === 0) {
          return 0;
        }
        var angleSlice = angle / PiBy2, sign = 1;
        if (angle < 0) {
          sign = -1;
        }
        switch (angleSlice) {
          case 1:
            return sign;
          case 2:
            return 0;
          case 3:
            return -sign;
        }
        return Math.sin(angle);
      },
      removeFromArray: function(array, value) {
        var idx = array.indexOf(value);
        if (idx !== -1) {
          array.splice(idx, 1);
        }
        return array;
      },
      getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      degreesToRadians: function(degrees) {
        return degrees * PiBy180;
      },
      radiansToDegrees: function(radians) {
        return radians / PiBy180;
      },
      rotatePoint: function(point, origin, radians) {
        var newPoint = new fabric2.Point(point.x - origin.x, point.y - origin.y), v = fabric2.util.rotateVector(newPoint, radians);
        return new fabric2.Point(v.x, v.y).addEquals(origin);
      },
      rotateVector: function(vector, radians) {
        var sin = fabric2.util.sin(radians), cos = fabric2.util.cos(radians), rx = vector.x * cos - vector.y * sin, ry = vector.x * sin + vector.y * cos;
        return {
          x: rx,
          y: ry
        };
      },
      createVector: function(from, to) {
        return new fabric2.Point(to.x - from.x, to.y - from.y);
      },
      calcAngleBetweenVectors: function(a3, b2) {
        return Math.acos((a3.x * b2.x + a3.y * b2.y) / (Math.hypot(a3.x, a3.y) * Math.hypot(b2.x, b2.y)));
      },
      getHatVector: function(v) {
        return new fabric2.Point(v.x, v.y).multiply(1 / Math.hypot(v.x, v.y));
      },
      getBisector: function(A, B2, C) {
        var AB = fabric2.util.createVector(A, B2), AC = fabric2.util.createVector(A, C);
        var alpha = fabric2.util.calcAngleBetweenVectors(AB, AC);
        var ro = fabric2.util.calcAngleBetweenVectors(fabric2.util.rotateVector(AB, alpha), AC);
        var phi = alpha * (ro === 0 ? 1 : -1) / 2;
        return {
          vector: fabric2.util.getHatVector(fabric2.util.rotateVector(AB, phi)),
          angle: alpha
        };
      },
      projectStrokeOnPoints: function(points, options, openPath) {
        var coords = [], s3 = options.strokeWidth / 2, strokeUniformScalar = options.strokeUniform ? new fabric2.Point(1 / options.scaleX, 1 / options.scaleY) : new fabric2.Point(1, 1), getStrokeHatVector = function(v) {
          var scalar = s3 / Math.hypot(v.x, v.y);
          return new fabric2.Point(v.x * scalar * strokeUniformScalar.x, v.y * scalar * strokeUniformScalar.y);
        };
        if (points.length <= 1) {
          return coords;
        }
        points.forEach(function(p, index) {
          var A = new fabric2.Point(p.x, p.y), B2, C;
          if (index === 0) {
            C = points[index + 1];
            B2 = openPath ? getStrokeHatVector(fabric2.util.createVector(C, A)).addEquals(A) : points[points.length - 1];
          } else if (index === points.length - 1) {
            B2 = points[index - 1];
            C = openPath ? getStrokeHatVector(fabric2.util.createVector(B2, A)).addEquals(A) : points[0];
          } else {
            B2 = points[index - 1];
            C = points[index + 1];
          }
          var bisector = fabric2.util.getBisector(A, B2, C), bisectorVector = bisector.vector, alpha = bisector.angle, scalar, miterVector;
          if (options.strokeLineJoin === "miter") {
            scalar = -s3 / Math.sin(alpha / 2);
            miterVector = new fabric2.Point(
              bisectorVector.x * scalar * strokeUniformScalar.x,
              bisectorVector.y * scalar * strokeUniformScalar.y
            );
            if (Math.hypot(miterVector.x, miterVector.y) / s3 <= options.strokeMiterLimit) {
              coords.push(A.add(miterVector));
              coords.push(A.subtract(miterVector));
              return;
            }
          }
          scalar = -s3 * Math.SQRT2;
          miterVector = new fabric2.Point(
            bisectorVector.x * scalar * strokeUniformScalar.x,
            bisectorVector.y * scalar * strokeUniformScalar.y
          );
          coords.push(A.add(miterVector));
          coords.push(A.subtract(miterVector));
        });
        return coords;
      },
      transformPoint: function(p, t2, ignoreOffset) {
        if (ignoreOffset) {
          return new fabric2.Point(
            t2[0] * p.x + t2[2] * p.y,
            t2[1] * p.x + t2[3] * p.y
          );
        }
        return new fabric2.Point(
          t2[0] * p.x + t2[2] * p.y + t2[4],
          t2[1] * p.x + t2[3] * p.y + t2[5]
        );
      },
      makeBoundingBoxFromPoints: function(points, transform) {
        if (transform) {
          for (var i2 = 0; i2 < points.length; i2++) {
            points[i2] = fabric2.util.transformPoint(points[i2], transform);
          }
        }
        var xPoints = [points[0].x, points[1].x, points[2].x, points[3].x], minX = fabric2.util.array.min(xPoints), maxX = fabric2.util.array.max(xPoints), width = maxX - minX, yPoints = [points[0].y, points[1].y, points[2].y, points[3].y], minY = fabric2.util.array.min(yPoints), maxY = fabric2.util.array.max(yPoints), height = maxY - minY;
        return {
          left: minX,
          top: minY,
          width,
          height
        };
      },
      invertTransform: function(t2) {
        var a3 = 1 / (t2[0] * t2[3] - t2[1] * t2[2]), r = [a3 * t2[3], -a3 * t2[1], -a3 * t2[2], a3 * t2[0]], o = fabric2.util.transformPoint({ x: t2[4], y: t2[5] }, r, true);
        r[4] = -o.x;
        r[5] = -o.y;
        return r;
      },
      toFixed: function(number, fractionDigits) {
        return parseFloat(Number(number).toFixed(fractionDigits));
      },
      parseUnit: function(value, fontSize) {
        var unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
        if (!fontSize) {
          fontSize = fabric2.Text.DEFAULT_SVG_FONT_SIZE;
        }
        switch (unit[0]) {
          case "mm":
            return number * fabric2.DPI / 25.4;
          case "cm":
            return number * fabric2.DPI / 2.54;
          case "in":
            return number * fabric2.DPI;
          case "pt":
            return number * fabric2.DPI / 72;
          case "pc":
            return number * fabric2.DPI / 72 * 12;
          case "em":
            return number * fontSize;
          default:
            return number;
        }
      },
      falseFunction: function() {
        return false;
      },
      getKlass: function(type, namespace) {
        type = fabric2.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
        return fabric2.util.resolveNamespace(namespace)[type];
      },
      getSvgAttributes: function(type) {
        var attributes = [
          "instantiated_by_use",
          "style",
          "id",
          "class"
        ];
        switch (type) {
          case "linearGradient":
            attributes = attributes.concat(["x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform"]);
            break;
          case "radialGradient":
            attributes = attributes.concat(["gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr"]);
            break;
          case "stop":
            attributes = attributes.concat(["offset", "stop-color", "stop-opacity"]);
            break;
        }
        return attributes;
      },
      resolveNamespace: function(namespace) {
        if (!namespace) {
          return fabric2;
        }
        var parts = namespace.split("."), len = parts.length, i2, obj = global || fabric2.window;
        for (i2 = 0; i2 < len; ++i2) {
          obj = obj[parts[i2]];
        }
        return obj;
      },
      loadImage: function(url, callback, context, crossOrigin) {
        if (!url) {
          callback && callback.call(context, url);
          return;
        }
        var img = fabric2.util.createImage();
        var onLoadCallback = function() {
          callback && callback.call(context, img, false);
          img = img.onload = img.onerror = null;
        };
        img.onload = onLoadCallback;
        img.onerror = function() {
          fabric2.log("Error loading " + img.src);
          callback && callback.call(context, null, true);
          img = img.onload = img.onerror = null;
        };
        if (url.indexOf("data") !== 0 && crossOrigin !== void 0 && crossOrigin !== null) {
          img.crossOrigin = crossOrigin;
        }
        if (url.substring(0, 14) === "data:image/svg") {
          img.onload = null;
          fabric2.util.loadImageInDom(img, onLoadCallback);
        }
        img.src = url;
      },
      loadImageInDom: function(img, onLoadCallback) {
        var div = fabric2.document.createElement("div");
        div.style.width = div.style.height = "1px";
        div.style.left = div.style.top = "-100%";
        div.style.position = "absolute";
        div.appendChild(img);
        fabric2.document.querySelector("body").appendChild(div);
        img.onload = function() {
          onLoadCallback();
          div.parentNode.removeChild(div);
          div = null;
        };
      },
      enlivenObjects: function(objects, callback, namespace, reviver) {
        objects = objects || [];
        var enlivenedObjects = [], numLoadedObjects = 0, numTotalObjects = objects.length;
        function onLoaded() {
          if (++numLoadedObjects === numTotalObjects) {
            callback && callback(enlivenedObjects.filter(function(obj) {
              return obj;
            }));
          }
        }
        if (!numTotalObjects) {
          callback && callback(enlivenedObjects);
          return;
        }
        objects.forEach(function(o, index) {
          if (!o || !o.type) {
            onLoaded();
            return;
          }
          var klass = fabric2.util.getKlass(o.type, namespace);
          klass.fromObject(o, function(obj, error) {
            error || (enlivenedObjects[index] = obj);
            reviver && reviver(o, obj, error);
            onLoaded();
          });
        });
      },
      enlivenObjectEnlivables: function(object, context, callback) {
        var enlivenProps = fabric2.Object.ENLIVEN_PROPS.filter(function(key) {
          return !!object[key];
        });
        fabric2.util.enlivenObjects(enlivenProps.map(function(key) {
          return object[key];
        }), function(enlivedProps) {
          var objects = {};
          enlivenProps.forEach(function(key, index) {
            objects[key] = enlivedProps[index];
            context && (context[key] = enlivedProps[index]);
          });
          callback && callback(objects);
        });
      },
      enlivenPatterns: function(patterns2, callback) {
        patterns2 = patterns2 || [];
        function onLoaded() {
          if (++numLoadedPatterns === numPatterns) {
            callback && callback(enlivenedPatterns);
          }
        }
        var enlivenedPatterns = [], numLoadedPatterns = 0, numPatterns = patterns2.length;
        if (!numPatterns) {
          callback && callback(enlivenedPatterns);
          return;
        }
        patterns2.forEach(function(p, index) {
          if (p && p.source) {
            new fabric2.Pattern(p, function(pattern) {
              enlivenedPatterns[index] = pattern;
              onLoaded();
            });
          } else {
            enlivenedPatterns[index] = p;
            onLoaded();
          }
        });
      },
      groupSVGElements: function(elements, options, path) {
        var object;
        if (elements && elements.length === 1) {
          if (typeof path !== "undefined") {
            elements[0].sourcePath = path;
          }
          return elements[0];
        }
        if (options) {
          if (options.width && options.height) {
            options.centerPoint = {
              x: options.width / 2,
              y: options.height / 2
            };
          } else {
            delete options.width;
            delete options.height;
          }
        }
        object = new fabric2.Group(elements, options);
        if (typeof path !== "undefined") {
          object.sourcePath = path;
        }
        return object;
      },
      populateWithProperties: function(source, destination, properties) {
        if (properties && Array.isArray(properties)) {
          for (var i2 = 0, len = properties.length; i2 < len; i2++) {
            if (properties[i2] in source) {
              destination[properties[i2]] = source[properties[i2]];
            }
          }
        }
      },
      createCanvasElement: function() {
        return fabric2.document.createElement("canvas");
      },
      copyCanvasElement: function(canvas) {
        var newCanvas = fabric2.util.createCanvasElement();
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        newCanvas.getContext("2d").drawImage(canvas, 0, 0);
        return newCanvas;
      },
      toDataURL: function(canvasEl, format2, quality) {
        return canvasEl.toDataURL("image/" + format2, quality);
      },
      createImage: function() {
        return fabric2.document.createElement("img");
      },
      multiplyTransformMatrices: function(a3, b2, is2x2) {
        return [
          a3[0] * b2[0] + a3[2] * b2[1],
          a3[1] * b2[0] + a3[3] * b2[1],
          a3[0] * b2[2] + a3[2] * b2[3],
          a3[1] * b2[2] + a3[3] * b2[3],
          is2x2 ? 0 : a3[0] * b2[4] + a3[2] * b2[5] + a3[4],
          is2x2 ? 0 : a3[1] * b2[4] + a3[3] * b2[5] + a3[5]
        ];
      },
      qrDecompose: function(a3) {
        var angle = atan2(a3[1], a3[0]), denom = pow(a3[0], 2) + pow(a3[1], 2), scaleX = sqrt(denom), scaleY = (a3[0] * a3[3] - a3[2] * a3[1]) / scaleX, skewX = atan2(a3[0] * a3[2] + a3[1] * a3[3], denom);
        return {
          angle: angle / PiBy180,
          scaleX,
          scaleY,
          skewX: skewX / PiBy180,
          skewY: 0,
          translateX: a3[4],
          translateY: a3[5]
        };
      },
      calcRotateMatrix: function(options) {
        if (!options.angle) {
          return fabric2.iMatrix.concat();
        }
        var theta = fabric2.util.degreesToRadians(options.angle), cos = fabric2.util.cos(theta), sin = fabric2.util.sin(theta);
        return [cos, sin, -sin, cos, 0, 0];
      },
      calcDimensionsMatrix: function(options) {
        var scaleX = typeof options.scaleX === "undefined" ? 1 : options.scaleX, scaleY = typeof options.scaleY === "undefined" ? 1 : options.scaleY, scaleMatrix = [
          options.flipX ? -scaleX : scaleX,
          0,
          0,
          options.flipY ? -scaleY : scaleY,
          0,
          0
        ], multiply = fabric2.util.multiplyTransformMatrices, degreesToRadians = fabric2.util.degreesToRadians;
        if (options.skewX) {
          scaleMatrix = multiply(
            scaleMatrix,
            [1, 0, Math.tan(degreesToRadians(options.skewX)), 1],
            true
          );
        }
        if (options.skewY) {
          scaleMatrix = multiply(
            scaleMatrix,
            [1, Math.tan(degreesToRadians(options.skewY)), 0, 1],
            true
          );
        }
        return scaleMatrix;
      },
      composeMatrix: function(options) {
        var matrix = [1, 0, 0, 1, options.translateX || 0, options.translateY || 0], multiply = fabric2.util.multiplyTransformMatrices;
        if (options.angle) {
          matrix = multiply(matrix, fabric2.util.calcRotateMatrix(options));
        }
        if (options.scaleX !== 1 || options.scaleY !== 1 || options.skewX || options.skewY || options.flipX || options.flipY) {
          matrix = multiply(matrix, fabric2.util.calcDimensionsMatrix(options));
        }
        return matrix;
      },
      resetObjectTransform: function(target) {
        target.scaleX = 1;
        target.scaleY = 1;
        target.skewX = 0;
        target.skewY = 0;
        target.flipX = false;
        target.flipY = false;
        target.rotate(0);
      },
      saveObjectTransform: function(target) {
        return {
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          skewX: target.skewX,
          skewY: target.skewY,
          angle: target.angle,
          left: target.left,
          flipX: target.flipX,
          flipY: target.flipY,
          top: target.top
        };
      },
      isTransparent: function(ctx, x2, y3, tolerance) {
        if (tolerance > 0) {
          if (x2 > tolerance) {
            x2 -= tolerance;
          } else {
            x2 = 0;
          }
          if (y3 > tolerance) {
            y3 -= tolerance;
          } else {
            y3 = 0;
          }
        }
        var _isTransparent = true, i2, temp, imageData = ctx.getImageData(x2, y3, tolerance * 2 || 1, tolerance * 2 || 1), l = imageData.data.length;
        for (i2 = 3; i2 < l; i2 += 4) {
          temp = imageData.data[i2];
          _isTransparent = temp <= 0;
          if (_isTransparent === false) {
            break;
          }
        }
        imageData = null;
        return _isTransparent;
      },
      parsePreserveAspectRatioAttribute: function(attribute) {
        var meetOrSlice = "meet", alignX = "Mid", alignY = "Mid", aspectRatioAttrs = attribute.split(" "), align;
        if (aspectRatioAttrs && aspectRatioAttrs.length) {
          meetOrSlice = aspectRatioAttrs.pop();
          if (meetOrSlice !== "meet" && meetOrSlice !== "slice") {
            align = meetOrSlice;
            meetOrSlice = "meet";
          } else if (aspectRatioAttrs.length) {
            align = aspectRatioAttrs.pop();
          }
        }
        alignX = align !== "none" ? align.slice(1, 4) : "none";
        alignY = align !== "none" ? align.slice(5, 8) : "none";
        return {
          meetOrSlice,
          alignX,
          alignY
        };
      },
      clearFabricFontCache: function(fontFamily) {
        fontFamily = (fontFamily || "").toLowerCase();
        if (!fontFamily) {
          fabric2.charWidthsCache = {};
        } else if (fabric2.charWidthsCache[fontFamily]) {
          delete fabric2.charWidthsCache[fontFamily];
        }
      },
      limitDimsByArea: function(ar, maximumArea) {
        var roughWidth = Math.sqrt(maximumArea * ar), perfLimitSizeY = Math.floor(maximumArea / roughWidth);
        return { x: Math.floor(roughWidth), y: perfLimitSizeY };
      },
      capValue: function(min, value, max) {
        return Math.max(min, Math.min(value, max));
      },
      findScaleToFit: function(source, destination) {
        return Math.min(destination.width / source.width, destination.height / source.height);
      },
      findScaleToCover: function(source, destination) {
        return Math.max(destination.width / source.width, destination.height / source.height);
      },
      matrixToSVG: function(transform) {
        return "matrix(" + transform.map(function(value) {
          return fabric2.util.toFixed(value, fabric2.Object.NUM_FRACTION_DIGITS);
        }).join(" ") + ")";
      },
      removeTransformFromObject: function(object, transform) {
        var inverted = fabric2.util.invertTransform(transform), finalTransform = fabric2.util.multiplyTransformMatrices(inverted, object.calcOwnMatrix());
        fabric2.util.applyTransformToObject(object, finalTransform);
      },
      addTransformToObject: function(object, transform) {
        fabric2.util.applyTransformToObject(
          object,
          fabric2.util.multiplyTransformMatrices(transform, object.calcOwnMatrix())
        );
      },
      applyTransformToObject: function(object, transform) {
        var options = fabric2.util.qrDecompose(transform), center = new fabric2.Point(options.translateX, options.translateY);
        object.flipX = false;
        object.flipY = false;
        object.set("scaleX", options.scaleX);
        object.set("scaleY", options.scaleY);
        object.skewX = options.skewX;
        object.skewY = options.skewY;
        object.angle = options.angle;
        object.setPositionByOrigin(center, "center", "center");
      },
      sizeAfterTransform: function(width, height, options) {
        var dimX = width / 2, dimY = height / 2, points = [
          {
            x: -dimX,
            y: -dimY
          },
          {
            x: dimX,
            y: -dimY
          },
          {
            x: -dimX,
            y: dimY
          },
          {
            x: dimX,
            y: dimY
          }
        ], transformMatrix = fabric2.util.calcDimensionsMatrix(options), bbox = fabric2.util.makeBoundingBoxFromPoints(points, transformMatrix);
        return {
          x: bbox.width,
          y: bbox.height
        };
      },
      mergeClipPaths: function(c1, c2) {
        var a3 = c1, b2 = c2;
        if (a3.inverted && !b2.inverted) {
          a3 = c2;
          b2 = c1;
        }
        fabric2.util.applyTransformToObject(
          b2,
          fabric2.util.multiplyTransformMatrices(
            fabric2.util.invertTransform(a3.calcTransformMatrix()),
            b2.calcTransformMatrix()
          )
        );
        var inverted = a3.inverted && b2.inverted;
        if (inverted) {
          a3.inverted = b2.inverted = false;
        }
        return new fabric2.Group([a3], { clipPath: b2, inverted });
      },
      hasStyleChanged: function(prevStyle, thisStyle, forTextSpans) {
        forTextSpans = forTextSpans || false;
        return prevStyle.fill !== thisStyle.fill || prevStyle.stroke !== thisStyle.stroke || prevStyle.strokeWidth !== thisStyle.strokeWidth || prevStyle.fontSize !== thisStyle.fontSize || prevStyle.fontFamily !== thisStyle.fontFamily || prevStyle.fontWeight !== thisStyle.fontWeight || prevStyle.fontStyle !== thisStyle.fontStyle || prevStyle.deltaY !== thisStyle.deltaY || forTextSpans && (prevStyle.overline !== thisStyle.overline || prevStyle.underline !== thisStyle.underline || prevStyle.linethrough !== thisStyle.linethrough);
      },
      stylesToArray: function(styles, text) {
        var styles = fabric2.util.object.clone(styles, true), textLines = text.split("\n"), charIndex = -1, prevStyle = {}, stylesArray = [];
        for (var i2 = 0; i2 < textLines.length; i2++) {
          if (!styles[i2]) {
            charIndex += textLines[i2].length;
            continue;
          }
          for (var c2 = 0; c2 < textLines[i2].length; c2++) {
            charIndex++;
            var thisStyle = styles[i2][c2];
            if (thisStyle) {
              var styleChanged = fabric2.util.hasStyleChanged(prevStyle, thisStyle, true);
              if (styleChanged) {
                stylesArray.push({
                  start: charIndex,
                  end: charIndex + 1,
                  style: thisStyle
                });
              } else {
                stylesArray[stylesArray.length - 1].end++;
              }
            }
            prevStyle = thisStyle || {};
          }
        }
        return stylesArray;
      },
      stylesFromArray: function(styles, text) {
        if (!Array.isArray(styles)) {
          return styles;
        }
        var textLines = text.split("\n"), charIndex = -1, styleIndex = 0, stylesObject = {};
        for (var i2 = 0; i2 < textLines.length; i2++) {
          for (var c2 = 0; c2 < textLines[i2].length; c2++) {
            charIndex++;
            if (styles[styleIndex] && styles[styleIndex].start <= charIndex && charIndex < styles[styleIndex].end) {
              stylesObject[i2] = stylesObject[i2] || {};
              stylesObject[i2][c2] = Object.assign({}, styles[styleIndex].style);
              if (charIndex === styles[styleIndex].end - 1) {
                styleIndex++;
              }
            }
          }
        }
        return stylesObject;
      }
    };
  })(exports);
  (function() {
    var _join = Array.prototype.join, commandLengths = {
      m: 2,
      l: 2,
      h: 1,
      v: 1,
      c: 6,
      s: 4,
      q: 4,
      t: 2,
      a: 7
    }, repeatedCommands = {
      m: "l",
      M: "L"
    };
    function segmentToBezier(th2, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) {
      var costh2 = fabric2.util.cos(th2), sinth2 = fabric2.util.sin(th2), costh3 = fabric2.util.cos(th3), sinth3 = fabric2.util.sin(th3), toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1, toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1, cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2), cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2), cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3), cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);
      return [
        "C",
        cp1X,
        cp1Y,
        cp2X,
        cp2Y,
        toX,
        toY
      ];
    }
    function arcToSegments(toX, toY, rx, ry, large, sweep, rotateX) {
      var PI = Math.PI, th = rotateX * PI / 180, sinTh = fabric2.util.sin(th), cosTh = fabric2.util.cos(th), fromX = 0, fromY = 0;
      rx = Math.abs(rx);
      ry = Math.abs(ry);
      var px = -cosTh * toX * 0.5 - sinTh * toY * 0.5, py = -cosTh * toY * 0.5 + sinTh * toX * 0.5, rx2 = rx * rx, ry2 = ry * ry, py2 = py * py, px2 = px * px, pl = rx2 * ry2 - rx2 * py2 - ry2 * px2, root = 0;
      if (pl < 0) {
        var s3 = Math.sqrt(1 - pl / (rx2 * ry2));
        rx *= s3;
        ry *= s3;
      } else {
        root = (large === sweep ? -1 : 1) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
      }
      var cx = root * rx * py / ry, cy = -root * ry * px / rx, cx1 = cosTh * cx - sinTh * cy + toX * 0.5, cy1 = sinTh * cx + cosTh * cy + toY * 0.5, mTheta = calcVectorAngle(1, 0, (px - cx) / rx, (py - cy) / ry), dtheta = calcVectorAngle((px - cx) / rx, (py - cy) / ry, (-px - cx) / rx, (-py - cy) / ry);
      if (sweep === 0 && dtheta > 0) {
        dtheta -= 2 * PI;
      } else if (sweep === 1 && dtheta < 0) {
        dtheta += 2 * PI;
      }
      var segments = Math.ceil(Math.abs(dtheta / PI * 2)), result = [], mDelta = dtheta / segments, mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2), th3 = mTheta + mDelta;
      for (var i2 = 0; i2 < segments; i2++) {
        result[i2] = segmentToBezier(mTheta, th3, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY);
        fromX = result[i2][5];
        fromY = result[i2][6];
        mTheta = th3;
        th3 += mDelta;
      }
      return result;
    }
    function calcVectorAngle(ux, uy, vx, vy) {
      var ta = Math.atan2(uy, ux), tb = Math.atan2(vy, vx);
      if (tb >= ta) {
        return tb - ta;
      } else {
        return 2 * Math.PI - (ta - tb);
      }
    }
    function getBoundsOfCurve(x0, y0, x1, y1, x2, y22, x3, y3) {
      var argsString;
      if (fabric2.cachesBoundsOfCurve) {
        argsString = _join.call(arguments);
        if (fabric2.boundsOfCurveCache[argsString]) {
          return fabric2.boundsOfCurveCache[argsString];
        }
      }
      var sqrt = Math.sqrt, min = Math.min, max = Math.max, abs = Math.abs, tvalues = [], bounds = [[], []], a3, b2, c2, t2, t1, t22, b2ac, sqrtb2ac;
      b2 = 6 * x0 - 12 * x1 + 6 * x2;
      a3 = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c2 = 3 * x1 - 3 * x0;
      for (var i2 = 0; i2 < 2; ++i2) {
        if (i2 > 0) {
          b2 = 6 * y0 - 12 * y1 + 6 * y22;
          a3 = -3 * y0 + 9 * y1 - 9 * y22 + 3 * y3;
          c2 = 3 * y1 - 3 * y0;
        }
        if (abs(a3) < 1e-12) {
          if (abs(b2) < 1e-12) {
            continue;
          }
          t2 = -c2 / b2;
          if (0 < t2 && t2 < 1) {
            tvalues.push(t2);
          }
          continue;
        }
        b2ac = b2 * b2 - 4 * c2 * a3;
        if (b2ac < 0) {
          continue;
        }
        sqrtb2ac = sqrt(b2ac);
        t1 = (-b2 + sqrtb2ac) / (2 * a3);
        if (0 < t1 && t1 < 1) {
          tvalues.push(t1);
        }
        t22 = (-b2 - sqrtb2ac) / (2 * a3);
        if (0 < t22 && t22 < 1) {
          tvalues.push(t22);
        }
      }
      var x4, y4, j = tvalues.length, jlen = j, mt;
      while (j--) {
        t2 = tvalues[j];
        mt = 1 - t2;
        x4 = mt * mt * mt * x0 + 3 * mt * mt * t2 * x1 + 3 * mt * t2 * t2 * x2 + t2 * t2 * t2 * x3;
        bounds[0][j] = x4;
        y4 = mt * mt * mt * y0 + 3 * mt * mt * t2 * y1 + 3 * mt * t2 * t2 * y22 + t2 * t2 * t2 * y3;
        bounds[1][j] = y4;
      }
      bounds[0][jlen] = x0;
      bounds[1][jlen] = y0;
      bounds[0][jlen + 1] = x3;
      bounds[1][jlen + 1] = y3;
      var result = [
        {
          x: min.apply(null, bounds[0]),
          y: min.apply(null, bounds[1])
        },
        {
          x: max.apply(null, bounds[0]),
          y: max.apply(null, bounds[1])
        }
      ];
      if (fabric2.cachesBoundsOfCurve) {
        fabric2.boundsOfCurveCache[argsString] = result;
      }
      return result;
    }
    function fromArcToBeziers(fx, fy, coords) {
      var rx = coords[1], ry = coords[2], rot = coords[3], large = coords[4], sweep = coords[5], tx = coords[6], ty = coords[7], segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
      for (var i2 = 0, len = segsNorm.length; i2 < len; i2++) {
        segsNorm[i2][1] += fx;
        segsNorm[i2][2] += fy;
        segsNorm[i2][3] += fx;
        segsNorm[i2][4] += fy;
        segsNorm[i2][5] += fx;
        segsNorm[i2][6] += fy;
      }
      return segsNorm;
    }
    function makePathSimpler(path) {
      var x2 = 0, y3 = 0, len = path.length, x1 = 0, y1 = 0, current, i2, converted, destinationPath = [], previous, controlX, controlY;
      for (i2 = 0; i2 < len; ++i2) {
        converted = false;
        current = path[i2].slice(0);
        switch (current[0]) {
          case "l":
            current[0] = "L";
            current[1] += x2;
            current[2] += y3;
          case "L":
            x2 = current[1];
            y3 = current[2];
            break;
          case "h":
            current[1] += x2;
          case "H":
            current[0] = "L";
            current[2] = y3;
            x2 = current[1];
            break;
          case "v":
            current[1] += y3;
          case "V":
            current[0] = "L";
            y3 = current[1];
            current[1] = x2;
            current[2] = y3;
            break;
          case "m":
            current[0] = "M";
            current[1] += x2;
            current[2] += y3;
          case "M":
            x2 = current[1];
            y3 = current[2];
            x1 = current[1];
            y1 = current[2];
            break;
          case "c":
            current[0] = "C";
            current[1] += x2;
            current[2] += y3;
            current[3] += x2;
            current[4] += y3;
            current[5] += x2;
            current[6] += y3;
          case "C":
            controlX = current[3];
            controlY = current[4];
            x2 = current[5];
            y3 = current[6];
            break;
          case "s":
            current[0] = "S";
            current[1] += x2;
            current[2] += y3;
            current[3] += x2;
            current[4] += y3;
          case "S":
            if (previous === "C") {
              controlX = 2 * x2 - controlX;
              controlY = 2 * y3 - controlY;
            } else {
              controlX = x2;
              controlY = y3;
            }
            x2 = current[3];
            y3 = current[4];
            current[0] = "C";
            current[5] = current[3];
            current[6] = current[4];
            current[3] = current[1];
            current[4] = current[2];
            current[1] = controlX;
            current[2] = controlY;
            controlX = current[3];
            controlY = current[4];
            break;
          case "q":
            current[0] = "Q";
            current[1] += x2;
            current[2] += y3;
            current[3] += x2;
            current[4] += y3;
          case "Q":
            controlX = current[1];
            controlY = current[2];
            x2 = current[3];
            y3 = current[4];
            break;
          case "t":
            current[0] = "T";
            current[1] += x2;
            current[2] += y3;
          case "T":
            if (previous === "Q") {
              controlX = 2 * x2 - controlX;
              controlY = 2 * y3 - controlY;
            } else {
              controlX = x2;
              controlY = y3;
            }
            current[0] = "Q";
            x2 = current[1];
            y3 = current[2];
            current[1] = controlX;
            current[2] = controlY;
            current[3] = x2;
            current[4] = y3;
            break;
          case "a":
            current[0] = "A";
            current[6] += x2;
            current[7] += y3;
          case "A":
            converted = true;
            destinationPath = destinationPath.concat(fromArcToBeziers(x2, y3, current));
            x2 = current[6];
            y3 = current[7];
            break;
          case "z":
          case "Z":
            x2 = x1;
            y3 = y1;
            break;
        }
        if (!converted) {
          destinationPath.push(current);
        }
        previous = current[0];
      }
      return destinationPath;
    }
    function calcLineLength(x1, y1, x2, y22) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y22 - y1) * (y22 - y1));
    }
    function CB1(t2) {
      return t2 * t2 * t2;
    }
    function CB2(t2) {
      return 3 * t2 * t2 * (1 - t2);
    }
    function CB3(t2) {
      return 3 * t2 * (1 - t2) * (1 - t2);
    }
    function CB4(t2) {
      return (1 - t2) * (1 - t2) * (1 - t2);
    }
    function getPointOnCubicBezierIterator(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
      return function(pct) {
        var c1 = CB1(pct), c2 = CB2(pct), c3 = CB3(pct), c4 = CB4(pct);
        return {
          x: p4x * c1 + p3x * c2 + p2x * c3 + p1x * c4,
          y: p4y * c1 + p3y * c2 + p2y * c3 + p1y * c4
        };
      };
    }
    function getTangentCubicIterator(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
      return function(pct) {
        var invT = 1 - pct, tangentX = 3 * invT * invT * (p2x - p1x) + 6 * invT * pct * (p3x - p2x) + 3 * pct * pct * (p4x - p3x), tangentY = 3 * invT * invT * (p2y - p1y) + 6 * invT * pct * (p3y - p2y) + 3 * pct * pct * (p4y - p3y);
        return Math.atan2(tangentY, tangentX);
      };
    }
    function QB1(t2) {
      return t2 * t2;
    }
    function QB2(t2) {
      return 2 * t2 * (1 - t2);
    }
    function QB3(t2) {
      return (1 - t2) * (1 - t2);
    }
    function getPointOnQuadraticBezierIterator(p1x, p1y, p2x, p2y, p3x, p3y) {
      return function(pct) {
        var c1 = QB1(pct), c2 = QB2(pct), c3 = QB3(pct);
        return {
          x: p3x * c1 + p2x * c2 + p1x * c3,
          y: p3y * c1 + p2y * c2 + p1y * c3
        };
      };
    }
    function getTangentQuadraticIterator(p1x, p1y, p2x, p2y, p3x, p3y) {
      return function(pct) {
        var invT = 1 - pct, tangentX = 2 * invT * (p2x - p1x) + 2 * pct * (p3x - p2x), tangentY = 2 * invT * (p2y - p1y) + 2 * pct * (p3y - p2y);
        return Math.atan2(tangentY, tangentX);
      };
    }
    function pathIterator(iterator, x1, y1) {
      var tempP = { x: x1, y: y1 }, p, tmpLen = 0, perc;
      for (perc = 1; perc <= 100; perc += 1) {
        p = iterator(perc / 100);
        tmpLen += calcLineLength(tempP.x, tempP.y, p.x, p.y);
        tempP = p;
      }
      return tmpLen;
    }
    function findPercentageForDistance(segInfo, distance) {
      var perc = 0, tmpLen = 0, iterator = segInfo.iterator, tempP = { x: segInfo.x, y: segInfo.y }, p, nextLen, nextStep = 0.01, angleFinder = segInfo.angleFinder, lastPerc;
      while (tmpLen < distance && nextStep > 1e-4) {
        p = iterator(perc);
        lastPerc = perc;
        nextLen = calcLineLength(tempP.x, tempP.y, p.x, p.y);
        if (nextLen + tmpLen > distance) {
          perc -= nextStep;
          nextStep /= 2;
        } else {
          tempP = p;
          perc += nextStep;
          tmpLen += nextLen;
        }
      }
      p.angle = angleFinder(lastPerc);
      return p;
    }
    function getPathSegmentsInfo(path) {
      var totalLength = 0, len = path.length, current, x1 = 0, y1 = 0, x2 = 0, y22 = 0, info = [], iterator, tempInfo, angleFinder;
      for (var i2 = 0; i2 < len; i2++) {
        current = path[i2];
        tempInfo = {
          x: x1,
          y: y1,
          command: current[0]
        };
        switch (current[0]) {
          case "M":
            tempInfo.length = 0;
            x2 = x1 = current[1];
            y22 = y1 = current[2];
            break;
          case "L":
            tempInfo.length = calcLineLength(x1, y1, current[1], current[2]);
            x1 = current[1];
            y1 = current[2];
            break;
          case "C":
            iterator = getPointOnCubicBezierIterator(
              x1,
              y1,
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6]
            );
            angleFinder = getTangentCubicIterator(
              x1,
              y1,
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6]
            );
            tempInfo.iterator = iterator;
            tempInfo.angleFinder = angleFinder;
            tempInfo.length = pathIterator(iterator, x1, y1);
            x1 = current[5];
            y1 = current[6];
            break;
          case "Q":
            iterator = getPointOnQuadraticBezierIterator(
              x1,
              y1,
              current[1],
              current[2],
              current[3],
              current[4]
            );
            angleFinder = getTangentQuadraticIterator(
              x1,
              y1,
              current[1],
              current[2],
              current[3],
              current[4]
            );
            tempInfo.iterator = iterator;
            tempInfo.angleFinder = angleFinder;
            tempInfo.length = pathIterator(iterator, x1, y1);
            x1 = current[3];
            y1 = current[4];
            break;
          case "Z":
          case "z":
            tempInfo.destX = x2;
            tempInfo.destY = y22;
            tempInfo.length = calcLineLength(x1, y1, x2, y22);
            x1 = x2;
            y1 = y22;
            break;
        }
        totalLength += tempInfo.length;
        info.push(tempInfo);
      }
      info.push({ length: totalLength, x: x1, y: y1 });
      return info;
    }
    function getPointOnPath(path, distance, infos) {
      if (!infos) {
        infos = getPathSegmentsInfo(path);
      }
      var i2 = 0;
      while (distance - infos[i2].length > 0 && i2 < infos.length - 2) {
        distance -= infos[i2].length;
        i2++;
      }
      var segInfo = infos[i2], segPercent = distance / segInfo.length, command = segInfo.command, segment = path[i2], info;
      switch (command) {
        case "M":
          return { x: segInfo.x, y: segInfo.y, angle: 0 };
        case "Z":
        case "z":
          info = new fabric2.Point(segInfo.x, segInfo.y).lerp(
            new fabric2.Point(segInfo.destX, segInfo.destY),
            segPercent
          );
          info.angle = Math.atan2(segInfo.destY - segInfo.y, segInfo.destX - segInfo.x);
          return info;
        case "L":
          info = new fabric2.Point(segInfo.x, segInfo.y).lerp(
            new fabric2.Point(segment[1], segment[2]),
            segPercent
          );
          info.angle = Math.atan2(segment[2] - segInfo.y, segment[1] - segInfo.x);
          return info;
        case "C":
          return findPercentageForDistance(segInfo, distance);
        case "Q":
          return findPercentageForDistance(segInfo, distance);
      }
    }
    function parsePath(pathString) {
      var result = [], coords = [], currentPath, parsed, re = fabric2.rePathCommand, rNumber = "[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?\\s*", rNumberCommaWsp = "(" + rNumber + ")" + fabric2.commaWsp, rFlagCommaWsp = "([01])" + fabric2.commaWsp + "?", rArcSeq = rNumberCommaWsp + "?" + rNumberCommaWsp + "?" + rNumberCommaWsp + rFlagCommaWsp + rFlagCommaWsp + rNumberCommaWsp + "?(" + rNumber + ")", regArcArgumentSequence = new RegExp(rArcSeq, "g"), match2, coordsStr, path;
      if (!pathString || !pathString.match) {
        return result;
      }
      path = pathString.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
      for (var i2 = 0, coordsParsed, len = path.length; i2 < len; i2++) {
        currentPath = path[i2];
        coordsStr = currentPath.slice(1).trim();
        coords.length = 0;
        var command = currentPath.charAt(0);
        coordsParsed = [command];
        if (command.toLowerCase() === "a") {
          for (var args; args = regArcArgumentSequence.exec(coordsStr); ) {
            for (var j = 1; j < args.length; j++) {
              coords.push(args[j]);
            }
          }
        } else {
          while (match2 = re.exec(coordsStr)) {
            coords.push(match2[0]);
          }
        }
        for (var j = 0, jlen = coords.length; j < jlen; j++) {
          parsed = parseFloat(coords[j]);
          if (!isNaN(parsed)) {
            coordsParsed.push(parsed);
          }
        }
        var commandLength = commandLengths[command.toLowerCase()], repeatedCommand = repeatedCommands[command] || command;
        if (coordsParsed.length - 1 > commandLength) {
          for (var k2 = 1, klen = coordsParsed.length; k2 < klen; k2 += commandLength) {
            result.push([command].concat(coordsParsed.slice(k2, k2 + commandLength)));
            command = repeatedCommand;
          }
        } else {
          result.push(coordsParsed);
        }
      }
      return result;
    }
    function getSmoothPathFromPoints(points, correction) {
      var path = [], i2, p1 = new fabric2.Point(points[0].x, points[0].y), p2 = new fabric2.Point(points[1].x, points[1].y), len = points.length, multSignX = 1, multSignY = 0, manyPoints = len > 2;
      correction = correction || 0;
      if (manyPoints) {
        multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
        multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
      }
      path.push(["M", p1.x - multSignX * correction, p1.y - multSignY * correction]);
      for (i2 = 1; i2 < len; i2++) {
        if (!p1.eq(p2)) {
          var midPoint = p1.midPointFrom(p2);
          path.push(["Q", p1.x, p1.y, midPoint.x, midPoint.y]);
        }
        p1 = points[i2];
        if (i2 + 1 < points.length) {
          p2 = points[i2 + 1];
        }
      }
      if (manyPoints) {
        multSignX = p1.x > points[i2 - 2].x ? 1 : p1.x === points[i2 - 2].x ? 0 : -1;
        multSignY = p1.y > points[i2 - 2].y ? 1 : p1.y === points[i2 - 2].y ? 0 : -1;
      }
      path.push(["L", p1.x + multSignX * correction, p1.y + multSignY * correction]);
      return path;
    }
    function transformPath(path, transform, pathOffset) {
      if (pathOffset) {
        transform = fabric2.util.multiplyTransformMatrices(
          transform,
          [1, 0, 0, 1, -pathOffset.x, -pathOffset.y]
        );
      }
      return path.map(function(pathSegment) {
        var newSegment = pathSegment.slice(0), point = {};
        for (var i2 = 1; i2 < pathSegment.length - 1; i2 += 2) {
          point.x = pathSegment[i2];
          point.y = pathSegment[i2 + 1];
          point = fabric2.util.transformPoint(point, transform);
          newSegment[i2] = point.x;
          newSegment[i2 + 1] = point.y;
        }
        return newSegment;
      });
    }
    fabric2.util.joinPath = function(pathData) {
      return pathData.map(function(segment) {
        return segment.join(" ");
      }).join(" ");
    };
    fabric2.util.parsePath = parsePath;
    fabric2.util.makePathSimpler = makePathSimpler;
    fabric2.util.getSmoothPathFromPoints = getSmoothPathFromPoints;
    fabric2.util.getPathSegmentsInfo = getPathSegmentsInfo;
    fabric2.util.getBoundsOfCurve = getBoundsOfCurve;
    fabric2.util.getPointOnPath = getPointOnPath;
    fabric2.util.transformPath = transformPath;
  })();
  (function() {
    var slice = Array.prototype.slice;
    function invoke(array, method) {
      var args = slice.call(arguments, 2), result = [];
      for (var i2 = 0, len = array.length; i2 < len; i2++) {
        result[i2] = args.length ? array[i2][method].apply(array[i2], args) : array[i2][method].call(array[i2]);
      }
      return result;
    }
    function max(array, byProperty) {
      return find(array, byProperty, function(value1, value2) {
        return value1 >= value2;
      });
    }
    function min(array, byProperty) {
      return find(array, byProperty, function(value1, value2) {
        return value1 < value2;
      });
    }
    function fill(array, value) {
      var k2 = array.length;
      while (k2--) {
        array[k2] = value;
      }
      return array;
    }
    function find(array, byProperty, condition) {
      if (!array || array.length === 0) {
        return;
      }
      var i2 = array.length - 1, result = byProperty ? array[i2][byProperty] : array[i2];
      if (byProperty) {
        while (i2--) {
          if (condition(array[i2][byProperty], result)) {
            result = array[i2][byProperty];
          }
        }
      } else {
        while (i2--) {
          if (condition(array[i2], result)) {
            result = array[i2];
          }
        }
      }
      return result;
    }
    fabric2.util.array = {
      fill,
      invoke,
      min,
      max
    };
  })();
  (function() {
    function extend(destination, source, deep) {
      if (deep) {
        if (!fabric2.isLikelyNode && source instanceof Element) {
          destination = source;
        } else if (source instanceof Array) {
          destination = [];
          for (var i2 = 0, len = source.length; i2 < len; i2++) {
            destination[i2] = extend({}, source[i2], deep);
          }
        } else if (source && typeof source === "object") {
          for (var property in source) {
            if (property === "canvas" || property === "group") {
              destination[property] = null;
            } else if (source.hasOwnProperty(property)) {
              destination[property] = extend({}, source[property], deep);
            }
          }
        } else {
          destination = source;
        }
      } else {
        for (var property in source) {
          destination[property] = source[property];
        }
      }
      return destination;
    }
    function clone(object, deep) {
      return extend({}, object, deep);
    }
    fabric2.util.object = {
      extend,
      clone
    };
    fabric2.util.object.extend(fabric2.util, fabric2.Observable);
  })();
  (function() {
    function camelize(string) {
      return string.replace(/-+(.)?/g, function(match2, character) {
        return character ? character.toUpperCase() : "";
      });
    }
    function capitalize(string, firstLetterOnly) {
      return string.charAt(0).toUpperCase() + (firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase());
    }
    function escapeXml(string) {
      return string.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function graphemeSplit(textstring) {
      var i2 = 0, chr, graphemes = [];
      for (i2 = 0, chr; i2 < textstring.length; i2++) {
        if ((chr = getWholeChar(textstring, i2)) === false) {
          continue;
        }
        graphemes.push(chr);
      }
      return graphemes;
    }
    function getWholeChar(str, i2) {
      var code = str.charCodeAt(i2);
      if (isNaN(code)) {
        return "";
      }
      if (code < 55296 || code > 57343) {
        return str.charAt(i2);
      }
      if (55296 <= code && code <= 56319) {
        if (str.length <= i2 + 1) {
          throw "High surrogate without following low surrogate";
        }
        var next = str.charCodeAt(i2 + 1);
        if (56320 > next || next > 57343) {
          throw "High surrogate without following low surrogate";
        }
        return str.charAt(i2) + str.charAt(i2 + 1);
      }
      if (i2 === 0) {
        throw "Low surrogate without preceding high surrogate";
      }
      var prev = str.charCodeAt(i2 - 1);
      if (55296 > prev || prev > 56319) {
        throw "Low surrogate without preceding high surrogate";
      }
      return false;
    }
    fabric2.util.string = {
      camelize,
      capitalize,
      escapeXml,
      graphemeSplit
    };
  })();
  (function() {
    var slice = Array.prototype.slice, emptyFunction = function() {
    }, IS_DONTENUM_BUGGY = function() {
      for (var p in { toString: 1 }) {
        if (p === "toString") {
          return false;
        }
      }
      return true;
    }(), addMethods = function(klass, source, parent) {
      for (var property in source) {
        if (property in klass.prototype && typeof klass.prototype[property] === "function" && (source[property] + "").indexOf("callSuper") > -1) {
          klass.prototype[property] = function(property2) {
            return function() {
              var superclass = this.constructor.superclass;
              this.constructor.superclass = parent;
              var returnValue = source[property2].apply(this, arguments);
              this.constructor.superclass = superclass;
              if (property2 !== "initialize") {
                return returnValue;
              }
            };
          }(property);
        } else {
          klass.prototype[property] = source[property];
        }
        if (IS_DONTENUM_BUGGY) {
          if (source.toString !== Object.prototype.toString) {
            klass.prototype.toString = source.toString;
          }
          if (source.valueOf !== Object.prototype.valueOf) {
            klass.prototype.valueOf = source.valueOf;
          }
        }
      }
    };
    function Subclass() {
    }
    function callSuper(methodName) {
      var parentMethod = null, _this = this;
      while (_this.constructor.superclass) {
        var superClassMethod = _this.constructor.superclass.prototype[methodName];
        if (_this[methodName] !== superClassMethod) {
          parentMethod = superClassMethod;
          break;
        }
        _this = _this.constructor.superclass.prototype;
      }
      if (!parentMethod) {
        return console.log("tried to callSuper " + methodName + ", method not found in prototype chain", this);
      }
      return arguments.length > 1 ? parentMethod.apply(this, slice.call(arguments, 1)) : parentMethod.call(this);
    }
    function createClass() {
      var parent = null, properties = slice.call(arguments, 0);
      if (typeof properties[0] === "function") {
        parent = properties.shift();
      }
      function klass() {
        this.initialize.apply(this, arguments);
      }
      klass.superclass = parent;
      klass.subclasses = [];
      if (parent) {
        Subclass.prototype = parent.prototype;
        klass.prototype = new Subclass();
        parent.subclasses.push(klass);
      }
      for (var i2 = 0, length = properties.length; i2 < length; i2++) {
        addMethods(klass, properties[i2], parent);
      }
      if (!klass.prototype.initialize) {
        klass.prototype.initialize = emptyFunction;
      }
      klass.prototype.constructor = klass;
      klass.prototype.callSuper = callSuper;
      return klass;
    }
    fabric2.util.createClass = createClass;
  })();
  (function() {
    var couldUseAttachEvent = !!fabric2.document.createElement("div").attachEvent, touchEvents = ["touchstart", "touchmove", "touchend"];
    fabric2.util.addListener = function(element, eventName, handler, options) {
      element && element.addEventListener(eventName, handler, couldUseAttachEvent ? false : options);
    };
    fabric2.util.removeListener = function(element, eventName, handler, options) {
      element && element.removeEventListener(eventName, handler, couldUseAttachEvent ? false : options);
    };
    function getTouchInfo(event) {
      var touchProp = event.changedTouches;
      if (touchProp && touchProp[0]) {
        return touchProp[0];
      }
      return event;
    }
    fabric2.util.getPointer = function(event) {
      var element = event.target, scroll = fabric2.util.getScrollLeftTop(element), _evt = getTouchInfo(event);
      return {
        x: _evt.clientX + scroll.left,
        y: _evt.clientY + scroll.top
      };
    };
    fabric2.util.isTouchEvent = function(event) {
      return touchEvents.indexOf(event.type) > -1 || event.pointerType === "touch";
    };
  })();
  (function() {
    function setStyle(element, styles) {
      var elementStyle = element.style;
      if (!elementStyle) {
        return element;
      }
      if (typeof styles === "string") {
        element.style.cssText += ";" + styles;
        return styles.indexOf("opacity") > -1 ? setOpacity(element, styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
      }
      for (var property in styles) {
        if (property === "opacity") {
          setOpacity(element, styles[property]);
        } else {
          var normalizedProperty = property === "float" || property === "cssFloat" ? typeof elementStyle.styleFloat === "undefined" ? "cssFloat" : "styleFloat" : property;
          elementStyle.setProperty(normalizedProperty, styles[property]);
        }
      }
      return element;
    }
    var parseEl = fabric2.document.createElement("div"), supportsOpacity = typeof parseEl.style.opacity === "string", supportsFilters = typeof parseEl.style.filter === "string", reOpacity = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, setOpacity = function(element) {
      return element;
    };
    if (supportsOpacity) {
      setOpacity = function(element, value) {
        element.style.opacity = value;
        return element;
      };
    } else if (supportsFilters) {
      setOpacity = function(element, value) {
        var es = element.style;
        if (element.currentStyle && !element.currentStyle.hasLayout) {
          es.zoom = 1;
        }
        if (reOpacity.test(es.filter)) {
          value = value >= 0.9999 ? "" : "alpha(opacity=" + value * 100 + ")";
          es.filter = es.filter.replace(reOpacity, value);
        } else {
          es.filter += " alpha(opacity=" + value * 100 + ")";
        }
        return element;
      };
    }
    fabric2.util.setStyle = setStyle;
  })();
  (function() {
    var _slice = Array.prototype.slice;
    function getById(id) {
      return typeof id === "string" ? fabric2.document.getElementById(id) : id;
    }
    var sliceCanConvertNodelists, toArray = function(arrayLike) {
      return _slice.call(arrayLike, 0);
    };
    try {
      sliceCanConvertNodelists = toArray(fabric2.document.childNodes) instanceof Array;
    } catch (err) {
    }
    if (!sliceCanConvertNodelists) {
      toArray = function(arrayLike) {
        var arr = new Array(arrayLike.length), i2 = arrayLike.length;
        while (i2--) {
          arr[i2] = arrayLike[i2];
        }
        return arr;
      };
    }
    function makeElement(tagName, attributes) {
      var el = fabric2.document.createElement(tagName);
      for (var prop in attributes) {
        if (prop === "class") {
          el.className = attributes[prop];
        } else if (prop === "for") {
          el.htmlFor = attributes[prop];
        } else {
          el.setAttribute(prop, attributes[prop]);
        }
      }
      return el;
    }
    function addClass(element, className) {
      if (element && (" " + element.className + " ").indexOf(" " + className + " ") === -1) {
        element.className += (element.className ? " " : "") + className;
      }
    }
    function wrapElement(element, wrapper, attributes) {
      if (typeof wrapper === "string") {
        wrapper = makeElement(wrapper, attributes);
      }
      if (element.parentNode) {
        element.parentNode.replaceChild(wrapper, element);
      }
      wrapper.appendChild(element);
      return wrapper;
    }
    function getScrollLeftTop(element) {
      var left = 0, top = 0, docElement = fabric2.document.documentElement, body = fabric2.document.body || {
        scrollLeft: 0,
        scrollTop: 0
      };
      while (element && (element.parentNode || element.host)) {
        element = element.parentNode || element.host;
        if (element === fabric2.document) {
          left = body.scrollLeft || docElement.scrollLeft || 0;
          top = body.scrollTop || docElement.scrollTop || 0;
        } else {
          left += element.scrollLeft || 0;
          top += element.scrollTop || 0;
        }
        if (element.nodeType === 1 && element.style.position === "fixed") {
          break;
        }
      }
      return { left, top };
    }
    function getElementOffset(element) {
      var docElem, doc = element && element.ownerDocument, box = { left: 0, top: 0 }, offset = { left: 0, top: 0 }, scrollLeftTop, offsetAttributes = {
        borderLeftWidth: "left",
        borderTopWidth: "top",
        paddingLeft: "left",
        paddingTop: "top"
      };
      if (!doc) {
        return offset;
      }
      for (var attr in offsetAttributes) {
        offset[offsetAttributes[attr]] += parseInt(getElementStyle(element, attr), 10) || 0;
      }
      docElem = doc.documentElement;
      if (typeof element.getBoundingClientRect !== "undefined") {
        box = element.getBoundingClientRect();
      }
      scrollLeftTop = getScrollLeftTop(element);
      return {
        left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
        top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top
      };
    }
    var getElementStyle;
    if (fabric2.document.defaultView && fabric2.document.defaultView.getComputedStyle) {
      getElementStyle = function(element, attr) {
        var style = fabric2.document.defaultView.getComputedStyle(element, null);
        return style ? style[attr] : void 0;
      };
    } else {
      getElementStyle = function(element, attr) {
        var value = element.style[attr];
        if (!value && element.currentStyle) {
          value = element.currentStyle[attr];
        }
        return value;
      };
    }
    (function() {
      var style = fabric2.document.documentElement.style, selectProp = "userSelect" in style ? "userSelect" : "MozUserSelect" in style ? "MozUserSelect" : "WebkitUserSelect" in style ? "WebkitUserSelect" : "KhtmlUserSelect" in style ? "KhtmlUserSelect" : "";
      function makeElementUnselectable(element) {
        if (typeof element.onselectstart !== "undefined") {
          element.onselectstart = fabric2.util.falseFunction;
        }
        if (selectProp) {
          element.style[selectProp] = "none";
        } else if (typeof element.unselectable === "string") {
          element.unselectable = "on";
        }
        return element;
      }
      function makeElementSelectable(element) {
        if (typeof element.onselectstart !== "undefined") {
          element.onselectstart = null;
        }
        if (selectProp) {
          element.style[selectProp] = "";
        } else if (typeof element.unselectable === "string") {
          element.unselectable = "";
        }
        return element;
      }
      fabric2.util.makeElementUnselectable = makeElementUnselectable;
      fabric2.util.makeElementSelectable = makeElementSelectable;
    })();
    function getNodeCanvas(element) {
      var impl = fabric2.jsdomImplForWrapper(element);
      return impl._canvas || impl._image;
    }
    function cleanUpJsdomNode(element) {
      if (!fabric2.isLikelyNode) {
        return;
      }
      var impl = fabric2.jsdomImplForWrapper(element);
      if (impl) {
        impl._image = null;
        impl._canvas = null;
        impl._currentSrc = null;
        impl._attributes = null;
        impl._classList = null;
      }
    }
    function setImageSmoothing(ctx, value) {
      ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled || ctx.webkitImageSmoothingEnabled || ctx.mozImageSmoothingEnabled || ctx.msImageSmoothingEnabled || ctx.oImageSmoothingEnabled;
      ctx.imageSmoothingEnabled = value;
    }
    fabric2.util.setImageSmoothing = setImageSmoothing;
    fabric2.util.getById = getById;
    fabric2.util.toArray = toArray;
    fabric2.util.addClass = addClass;
    fabric2.util.makeElement = makeElement;
    fabric2.util.wrapElement = wrapElement;
    fabric2.util.getScrollLeftTop = getScrollLeftTop;
    fabric2.util.getElementOffset = getElementOffset;
    fabric2.util.getNodeCanvas = getNodeCanvas;
    fabric2.util.cleanUpJsdomNode = cleanUpJsdomNode;
  })();
  (function() {
    function addParamToUrl(url, param) {
      return url + (/\?/.test(url) ? "&" : "?") + param;
    }
    function emptyFn() {
    }
    function request(url, options) {
      options || (options = {});
      var method = options.method ? options.method.toUpperCase() : "GET", onComplete = options.onComplete || function() {
      }, xhr = new fabric2.window.XMLHttpRequest(), body = options.body || options.parameters;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          onComplete(xhr);
          xhr.onreadystatechange = emptyFn;
        }
      };
      if (method === "GET") {
        body = null;
        if (typeof options.parameters === "string") {
          url = addParamToUrl(url, options.parameters);
        }
      }
      xhr.open(method, url, true);
      if (method === "POST" || method === "PUT") {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }
      xhr.send(body);
      return xhr;
    }
    fabric2.util.request = request;
  })();
  fabric2.log = console.log;
  fabric2.warn = console.warn;
  (function() {
    var extend = fabric2.util.object.extend, clone = fabric2.util.object.clone;
    var RUNNING_ANIMATIONS = [];
    fabric2.util.object.extend(RUNNING_ANIMATIONS, {
      cancelAll: function() {
        var animations = this.splice(0);
        animations.forEach(function(animation) {
          animation.cancel();
        });
        return animations;
      },
      cancelByCanvas: function(canvas) {
        if (!canvas) {
          return [];
        }
        var cancelled = this.filter(function(animation) {
          return typeof animation.target === "object" && animation.target.canvas === canvas;
        });
        cancelled.forEach(function(animation) {
          animation.cancel();
        });
        return cancelled;
      },
      cancelByTarget: function(target) {
        var cancelled = this.findAnimationsByTarget(target);
        cancelled.forEach(function(animation) {
          animation.cancel();
        });
        return cancelled;
      },
      findAnimationIndex: function(cancelFunc) {
        return this.indexOf(this.findAnimation(cancelFunc));
      },
      findAnimation: function(cancelFunc) {
        return this.find(function(animation) {
          return animation.cancel === cancelFunc;
        });
      },
      findAnimationsByTarget: function(target) {
        if (!target) {
          return [];
        }
        return this.filter(function(animation) {
          return animation.target === target;
        });
      }
    });
    function noop() {
      return false;
    }
    function defaultEasing(t2, b2, c2, d3) {
      return -c2 * Math.cos(t2 / d3 * (Math.PI / 2)) + c2 + b2;
    }
    function animate(options) {
      options || (options = {});
      var cancel = false, context, removeFromRegistry = function() {
        var index = fabric2.runningAnimations.indexOf(context);
        return index > -1 && fabric2.runningAnimations.splice(index, 1)[0];
      };
      context = extend(clone(options), {
        cancel: function() {
          cancel = true;
          return removeFromRegistry();
        },
        currentValue: "startValue" in options ? options.startValue : 0,
        completionRate: 0,
        durationRate: 0
      });
      fabric2.runningAnimations.push(context);
      requestAnimFrame(function(timestamp) {
        var start = timestamp || +new Date(), duration = options.duration || 500, finish = start + duration, time, onChange = options.onChange || noop, abort = options.abort || noop, onComplete = options.onComplete || noop, easing = options.easing || defaultEasing, isMany = "startValue" in options ? options.startValue.length > 0 : false, startValue = "startValue" in options ? options.startValue : 0, endValue = "endValue" in options ? options.endValue : 100, byValue = options.byValue || (isMany ? startValue.map(function(value, i2) {
          return endValue[i2] - startValue[i2];
        }) : endValue - startValue);
        options.onStart && options.onStart();
        (function tick(ticktime) {
          time = ticktime || +new Date();
          var currentTime = time > finish ? duration : time - start, timePerc = currentTime / duration, current = isMany ? startValue.map(function(_value, i2) {
            return easing(currentTime, startValue[i2], byValue[i2], duration);
          }) : easing(currentTime, startValue, byValue, duration), valuePerc = isMany ? Math.abs((current[0] - startValue[0]) / byValue[0]) : Math.abs((current - startValue) / byValue);
          context.currentValue = isMany ? current.slice() : current;
          context.completionRate = valuePerc;
          context.durationRate = timePerc;
          if (cancel) {
            return;
          }
          if (abort(current, valuePerc, timePerc)) {
            removeFromRegistry();
            return;
          }
          if (time > finish) {
            context.currentValue = isMany ? endValue.slice() : endValue;
            context.completionRate = 1;
            context.durationRate = 1;
            onChange(isMany ? endValue.slice() : endValue, 1, 1);
            onComplete(endValue, 1, 1);
            removeFromRegistry();
            return;
          } else {
            onChange(current, valuePerc, timePerc);
            requestAnimFrame(tick);
          }
        })(start);
      });
      return context.cancel;
    }
    var _requestAnimFrame = fabric2.window.requestAnimationFrame || fabric2.window.webkitRequestAnimationFrame || fabric2.window.mozRequestAnimationFrame || fabric2.window.oRequestAnimationFrame || fabric2.window.msRequestAnimationFrame || function(callback) {
      return fabric2.window.setTimeout(callback, 1e3 / 60);
    };
    var _cancelAnimFrame = fabric2.window.cancelAnimationFrame || fabric2.window.clearTimeout;
    function requestAnimFrame() {
      return _requestAnimFrame.apply(fabric2.window, arguments);
    }
    function cancelAnimFrame() {
      return _cancelAnimFrame.apply(fabric2.window, arguments);
    }
    fabric2.util.animate = animate;
    fabric2.util.requestAnimFrame = requestAnimFrame;
    fabric2.util.cancelAnimFrame = cancelAnimFrame;
    fabric2.runningAnimations = RUNNING_ANIMATIONS;
  })();
  (function() {
    function calculateColor(begin, end, pos) {
      var color = "rgba(" + parseInt(begin[0] + pos * (end[0] - begin[0]), 10) + "," + parseInt(begin[1] + pos * (end[1] - begin[1]), 10) + "," + parseInt(begin[2] + pos * (end[2] - begin[2]), 10);
      color += "," + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
      color += ")";
      return color;
    }
    function animateColor(fromColor, toColor, duration, options) {
      var startColor = new fabric2.Color(fromColor).getSource(), endColor = new fabric2.Color(toColor).getSource(), originalOnComplete = options.onComplete, originalOnChange = options.onChange;
      options = options || {};
      return fabric2.util.animate(fabric2.util.object.extend(options, {
        duration: duration || 500,
        startValue: startColor,
        endValue: endColor,
        byValue: endColor,
        easing: function(currentTime, startValue, byValue, duration2) {
          var posValue = options.colorEasing ? options.colorEasing(currentTime, duration2) : 1 - Math.cos(currentTime / duration2 * (Math.PI / 2));
          return calculateColor(startValue, byValue, posValue);
        },
        onComplete: function(current, valuePerc, timePerc) {
          if (originalOnComplete) {
            return originalOnComplete(
              calculateColor(endColor, endColor, 0),
              valuePerc,
              timePerc
            );
          }
        },
        onChange: function(current, valuePerc, timePerc) {
          if (originalOnChange) {
            if (Array.isArray(current)) {
              return originalOnChange(
                calculateColor(current, current, 0),
                valuePerc,
                timePerc
              );
            }
            originalOnChange(current, valuePerc, timePerc);
          }
        }
      }));
    }
    fabric2.util.animateColor = animateColor;
  })();
  (function() {
    function normalize(a3, c2, p, s3) {
      if (a3 < Math.abs(c2)) {
        a3 = c2;
        s3 = p / 4;
      } else {
        if (c2 === 0 && a3 === 0) {
          s3 = p / (2 * Math.PI) * Math.asin(1);
        } else {
          s3 = p / (2 * Math.PI) * Math.asin(c2 / a3);
        }
      }
      return { a: a3, c: c2, p, s: s3 };
    }
    function elastic(opts, t2, d3) {
      return opts.a * Math.pow(2, 10 * (t2 -= 1)) * Math.sin((t2 * d3 - opts.s) * (2 * Math.PI) / opts.p);
    }
    function easeOutCubic(t2, b2, c2, d3) {
      return c2 * ((t2 = t2 / d3 - 1) * t2 * t2 + 1) + b2;
    }
    function easeInOutCubic(t2, b2, c2, d3) {
      t2 /= d3 / 2;
      if (t2 < 1) {
        return c2 / 2 * t2 * t2 * t2 + b2;
      }
      return c2 / 2 * ((t2 -= 2) * t2 * t2 + 2) + b2;
    }
    function easeInQuart(t2, b2, c2, d3) {
      return c2 * (t2 /= d3) * t2 * t2 * t2 + b2;
    }
    function easeOutQuart(t2, b2, c2, d3) {
      return -c2 * ((t2 = t2 / d3 - 1) * t2 * t2 * t2 - 1) + b2;
    }
    function easeInOutQuart(t2, b2, c2, d3) {
      t2 /= d3 / 2;
      if (t2 < 1) {
        return c2 / 2 * t2 * t2 * t2 * t2 + b2;
      }
      return -c2 / 2 * ((t2 -= 2) * t2 * t2 * t2 - 2) + b2;
    }
    function easeInQuint(t2, b2, c2, d3) {
      return c2 * (t2 /= d3) * t2 * t2 * t2 * t2 + b2;
    }
    function easeOutQuint(t2, b2, c2, d3) {
      return c2 * ((t2 = t2 / d3 - 1) * t2 * t2 * t2 * t2 + 1) + b2;
    }
    function easeInOutQuint(t2, b2, c2, d3) {
      t2 /= d3 / 2;
      if (t2 < 1) {
        return c2 / 2 * t2 * t2 * t2 * t2 * t2 + b2;
      }
      return c2 / 2 * ((t2 -= 2) * t2 * t2 * t2 * t2 + 2) + b2;
    }
    function easeInSine(t2, b2, c2, d3) {
      return -c2 * Math.cos(t2 / d3 * (Math.PI / 2)) + c2 + b2;
    }
    function easeOutSine(t2, b2, c2, d3) {
      return c2 * Math.sin(t2 / d3 * (Math.PI / 2)) + b2;
    }
    function easeInOutSine(t2, b2, c2, d3) {
      return -c2 / 2 * (Math.cos(Math.PI * t2 / d3) - 1) + b2;
    }
    function easeInExpo(t2, b2, c2, d3) {
      return t2 === 0 ? b2 : c2 * Math.pow(2, 10 * (t2 / d3 - 1)) + b2;
    }
    function easeOutExpo(t2, b2, c2, d3) {
      return t2 === d3 ? b2 + c2 : c2 * (-Math.pow(2, -10 * t2 / d3) + 1) + b2;
    }
    function easeInOutExpo(t2, b2, c2, d3) {
      if (t2 === 0) {
        return b2;
      }
      if (t2 === d3) {
        return b2 + c2;
      }
      t2 /= d3 / 2;
      if (t2 < 1) {
        return c2 / 2 * Math.pow(2, 10 * (t2 - 1)) + b2;
      }
      return c2 / 2 * (-Math.pow(2, -10 * --t2) + 2) + b2;
    }
    function easeInCirc(t2, b2, c2, d3) {
      return -c2 * (Math.sqrt(1 - (t2 /= d3) * t2) - 1) + b2;
    }
    function easeOutCirc(t2, b2, c2, d3) {
      return c2 * Math.sqrt(1 - (t2 = t2 / d3 - 1) * t2) + b2;
    }
    function easeInOutCirc(t2, b2, c2, d3) {
      t2 /= d3 / 2;
      if (t2 < 1) {
        return -c2 / 2 * (Math.sqrt(1 - t2 * t2) - 1) + b2;
      }
      return c2 / 2 * (Math.sqrt(1 - (t2 -= 2) * t2) + 1) + b2;
    }
    function easeInElastic(t2, b2, c2, d3) {
      var s3 = 1.70158, p = 0, a3 = c2;
      if (t2 === 0) {
        return b2;
      }
      t2 /= d3;
      if (t2 === 1) {
        return b2 + c2;
      }
      if (!p) {
        p = d3 * 0.3;
      }
      var opts = normalize(a3, c2, p, s3);
      return -elastic(opts, t2, d3) + b2;
    }
    function easeOutElastic(t2, b2, c2, d3) {
      var s3 = 1.70158, p = 0, a3 = c2;
      if (t2 === 0) {
        return b2;
      }
      t2 /= d3;
      if (t2 === 1) {
        return b2 + c2;
      }
      if (!p) {
        p = d3 * 0.3;
      }
      var opts = normalize(a3, c2, p, s3);
      return opts.a * Math.pow(2, -10 * t2) * Math.sin((t2 * d3 - opts.s) * (2 * Math.PI) / opts.p) + opts.c + b2;
    }
    function easeInOutElastic(t2, b2, c2, d3) {
      var s3 = 1.70158, p = 0, a3 = c2;
      if (t2 === 0) {
        return b2;
      }
      t2 /= d3 / 2;
      if (t2 === 2) {
        return b2 + c2;
      }
      if (!p) {
        p = d3 * (0.3 * 1.5);
      }
      var opts = normalize(a3, c2, p, s3);
      if (t2 < 1) {
        return -0.5 * elastic(opts, t2, d3) + b2;
      }
      return opts.a * Math.pow(2, -10 * (t2 -= 1)) * Math.sin((t2 * d3 - opts.s) * (2 * Math.PI) / opts.p) * 0.5 + opts.c + b2;
    }
    function easeInBack(t2, b2, c2, d3, s3) {
      if (s3 === void 0) {
        s3 = 1.70158;
      }
      return c2 * (t2 /= d3) * t2 * ((s3 + 1) * t2 - s3) + b2;
    }
    function easeOutBack(t2, b2, c2, d3, s3) {
      if (s3 === void 0) {
        s3 = 1.70158;
      }
      return c2 * ((t2 = t2 / d3 - 1) * t2 * ((s3 + 1) * t2 + s3) + 1) + b2;
    }
    function easeInOutBack(t2, b2, c2, d3, s3) {
      if (s3 === void 0) {
        s3 = 1.70158;
      }
      t2 /= d3 / 2;
      if (t2 < 1) {
        return c2 / 2 * (t2 * t2 * (((s3 *= 1.525) + 1) * t2 - s3)) + b2;
      }
      return c2 / 2 * ((t2 -= 2) * t2 * (((s3 *= 1.525) + 1) * t2 + s3) + 2) + b2;
    }
    function easeInBounce(t2, b2, c2, d3) {
      return c2 - easeOutBounce(d3 - t2, 0, c2, d3) + b2;
    }
    function easeOutBounce(t2, b2, c2, d3) {
      if ((t2 /= d3) < 1 / 2.75) {
        return c2 * (7.5625 * t2 * t2) + b2;
      } else if (t2 < 2 / 2.75) {
        return c2 * (7.5625 * (t2 -= 1.5 / 2.75) * t2 + 0.75) + b2;
      } else if (t2 < 2.5 / 2.75) {
        return c2 * (7.5625 * (t2 -= 2.25 / 2.75) * t2 + 0.9375) + b2;
      } else {
        return c2 * (7.5625 * (t2 -= 2.625 / 2.75) * t2 + 0.984375) + b2;
      }
    }
    function easeInOutBounce(t2, b2, c2, d3) {
      if (t2 < d3 / 2) {
        return easeInBounce(t2 * 2, 0, c2, d3) * 0.5 + b2;
      }
      return easeOutBounce(t2 * 2 - d3, 0, c2, d3) * 0.5 + c2 * 0.5 + b2;
    }
    fabric2.util.ease = {
      easeInQuad: function(t2, b2, c2, d3) {
        return c2 * (t2 /= d3) * t2 + b2;
      },
      easeOutQuad: function(t2, b2, c2, d3) {
        return -c2 * (t2 /= d3) * (t2 - 2) + b2;
      },
      easeInOutQuad: function(t2, b2, c2, d3) {
        t2 /= d3 / 2;
        if (t2 < 1) {
          return c2 / 2 * t2 * t2 + b2;
        }
        return -c2 / 2 * (--t2 * (t2 - 2) - 1) + b2;
      },
      easeInCubic: function(t2, b2, c2, d3) {
        return c2 * (t2 /= d3) * t2 * t2 + b2;
      },
      easeOutCubic,
      easeInOutCubic,
      easeInQuart,
      easeOutQuart,
      easeInOutQuart,
      easeInQuint,
      easeOutQuint,
      easeInOutQuint,
      easeInSine,
      easeOutSine,
      easeInOutSine,
      easeInExpo,
      easeOutExpo,
      easeInOutExpo,
      easeInCirc,
      easeOutCirc,
      easeInOutCirc,
      easeInElastic,
      easeOutElastic,
      easeInOutElastic,
      easeInBack,
      easeOutBack,
      easeInOutBack,
      easeInBounce,
      easeOutBounce,
      easeInOutBounce
    };
  })();
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, clone = fabric3.util.object.clone, toFixed = fabric3.util.toFixed, parseUnit = fabric3.util.parseUnit, multiplyTransformMatrices = fabric3.util.multiplyTransformMatrices, svgValidTagNames = [
      "path",
      "circle",
      "polygon",
      "polyline",
      "ellipse",
      "rect",
      "line",
      "image",
      "text"
    ], svgViewBoxElements = ["symbol", "image", "marker", "pattern", "view", "svg"], svgInvalidAncestors = ["pattern", "defs", "symbol", "metadata", "clipPath", "mask", "desc"], svgValidParents = ["symbol", "g", "a", "svg", "clipPath", "defs"], attributesMap = {
      cx: "left",
      x: "left",
      r: "radius",
      cy: "top",
      y: "top",
      display: "visible",
      visibility: "visible",
      transform: "transformMatrix",
      "fill-opacity": "fillOpacity",
      "fill-rule": "fillRule",
      "font-family": "fontFamily",
      "font-size": "fontSize",
      "font-style": "fontStyle",
      "font-weight": "fontWeight",
      "letter-spacing": "charSpacing",
      "paint-order": "paintFirst",
      "stroke-dasharray": "strokeDashArray",
      "stroke-dashoffset": "strokeDashOffset",
      "stroke-linecap": "strokeLineCap",
      "stroke-linejoin": "strokeLineJoin",
      "stroke-miterlimit": "strokeMiterLimit",
      "stroke-opacity": "strokeOpacity",
      "stroke-width": "strokeWidth",
      "text-decoration": "textDecoration",
      "text-anchor": "textAnchor",
      opacity: "opacity",
      "clip-path": "clipPath",
      "clip-rule": "clipRule",
      "vector-effect": "strokeUniform",
      "image-rendering": "imageSmoothing"
    }, colorAttributes = {
      stroke: "strokeOpacity",
      fill: "fillOpacity"
    }, fSize = "font-size", cPath = "clip-path";
    fabric3.svgValidTagNamesRegEx = getSvgRegex(svgValidTagNames);
    fabric3.svgViewBoxElementsRegEx = getSvgRegex(svgViewBoxElements);
    fabric3.svgInvalidAncestorsRegEx = getSvgRegex(svgInvalidAncestors);
    fabric3.svgValidParentsRegEx = getSvgRegex(svgValidParents);
    fabric3.cssRules = {};
    fabric3.gradientDefs = {};
    fabric3.clipPaths = {};
    function normalizeAttr(attr) {
      if (attr in attributesMap) {
        return attributesMap[attr];
      }
      return attr;
    }
    function normalizeValue(attr, value, parentAttributes, fontSize) {
      var isArray = Array.isArray(value), parsed;
      if ((attr === "fill" || attr === "stroke") && value === "none") {
        value = "";
      } else if (attr === "strokeUniform") {
        return value === "non-scaling-stroke";
      } else if (attr === "strokeDashArray") {
        if (value === "none") {
          value = null;
        } else {
          value = value.replace(/,/g, " ").split(/\s+/).map(parseFloat);
        }
      } else if (attr === "transformMatrix") {
        if (parentAttributes && parentAttributes.transformMatrix) {
          value = multiplyTransformMatrices(
            parentAttributes.transformMatrix,
            fabric3.parseTransformAttribute(value)
          );
        } else {
          value = fabric3.parseTransformAttribute(value);
        }
      } else if (attr === "visible") {
        value = value !== "none" && value !== "hidden";
        if (parentAttributes && parentAttributes.visible === false) {
          value = false;
        }
      } else if (attr === "opacity") {
        value = parseFloat(value);
        if (parentAttributes && typeof parentAttributes.opacity !== "undefined") {
          value *= parentAttributes.opacity;
        }
      } else if (attr === "textAnchor") {
        value = value === "start" ? "left" : value === "end" ? "right" : "center";
      } else if (attr === "charSpacing") {
        parsed = parseUnit(value, fontSize) / fontSize * 1e3;
      } else if (attr === "paintFirst") {
        var fillIndex = value.indexOf("fill");
        var strokeIndex = value.indexOf("stroke");
        var value = "fill";
        if (fillIndex > -1 && strokeIndex > -1 && strokeIndex < fillIndex) {
          value = "stroke";
        } else if (fillIndex === -1 && strokeIndex > -1) {
          value = "stroke";
        }
      } else if (attr === "href" || attr === "xlink:href" || attr === "font") {
        return value;
      } else if (attr === "imageSmoothing") {
        return value === "optimizeQuality";
      } else {
        parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
      }
      return !isArray && isNaN(parsed) ? value : parsed;
    }
    function getSvgRegex(arr) {
      return new RegExp("^(" + arr.join("|") + ")\\b", "i");
    }
    function _setStrokeFillOpacity(attributes) {
      for (var attr in colorAttributes) {
        if (typeof attributes[colorAttributes[attr]] === "undefined" || attributes[attr] === "") {
          continue;
        }
        if (typeof attributes[attr] === "undefined") {
          if (!fabric3.Object.prototype[attr]) {
            continue;
          }
          attributes[attr] = fabric3.Object.prototype[attr];
        }
        if (attributes[attr].indexOf("url(") === 0) {
          continue;
        }
        var color = new fabric3.Color(attributes[attr]);
        attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
      }
      return attributes;
    }
    function _getMultipleNodes(doc, nodeNames) {
      var nodeName, nodeArray = [], nodeList, i2, len;
      for (i2 = 0, len = nodeNames.length; i2 < len; i2++) {
        nodeName = nodeNames[i2];
        nodeList = doc.getElementsByTagName(nodeName);
        nodeArray = nodeArray.concat(Array.prototype.slice.call(nodeList));
      }
      return nodeArray;
    }
    fabric3.parseTransformAttribute = function() {
      function rotateMatrix(matrix2, args) {
        var cos = fabric3.util.cos(args[0]), sin = fabric3.util.sin(args[0]), x2 = 0, y3 = 0;
        if (args.length === 3) {
          x2 = args[1];
          y3 = args[2];
        }
        matrix2[0] = cos;
        matrix2[1] = sin;
        matrix2[2] = -sin;
        matrix2[3] = cos;
        matrix2[4] = x2 - (cos * x2 - sin * y3);
        matrix2[5] = y3 - (sin * x2 + cos * y3);
      }
      function scaleMatrix(matrix2, args) {
        var multiplierX = args[0], multiplierY = args.length === 2 ? args[1] : args[0];
        matrix2[0] = multiplierX;
        matrix2[3] = multiplierY;
      }
      function skewMatrix(matrix2, args, pos) {
        matrix2[pos] = Math.tan(fabric3.util.degreesToRadians(args[0]));
      }
      function translateMatrix(matrix2, args) {
        matrix2[4] = args[0];
        if (args.length === 2) {
          matrix2[5] = args[1];
        }
      }
      var iMatrix = fabric3.iMatrix, number = fabric3.reNum, commaWsp = fabric3.commaWsp, skewX = "(?:(skewX)\\s*\\(\\s*(" + number + ")\\s*\\))", skewY = "(?:(skewY)\\s*\\(\\s*(" + number + ")\\s*\\))", rotate = "(?:(rotate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + "))?\\s*\\))", scale = "(?:(scale)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", translate = "(?:(translate)\\s*\\(\\s*(" + number + ")(?:" + commaWsp + "(" + number + "))?\\s*\\))", matrix = "(?:(matrix)\\s*\\(\\s*(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")" + commaWsp + "(" + number + ")\\s*\\))", transform = "(?:" + matrix + "|" + translate + "|" + scale + "|" + rotate + "|" + skewX + "|" + skewY + ")", transforms = "(?:" + transform + "(?:" + commaWsp + "*" + transform + ")*)", transformList = "^\\s*(?:" + transforms + "?)\\s*$", reTransformList = new RegExp(transformList), reTransform = new RegExp(transform, "g");
      return function(attributeValue) {
        var matrix2 = iMatrix.concat(), matrices = [];
        if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
          return matrix2;
        }
        attributeValue.replace(reTransform, function(match2) {
          var m3 = new RegExp(transform).exec(match2).filter(function(match3) {
            return !!match3;
          }), operation = m3[1], args = m3.slice(2).map(parseFloat);
          switch (operation) {
            case "translate":
              translateMatrix(matrix2, args);
              break;
            case "rotate":
              args[0] = fabric3.util.degreesToRadians(args[0]);
              rotateMatrix(matrix2, args);
              break;
            case "scale":
              scaleMatrix(matrix2, args);
              break;
            case "skewX":
              skewMatrix(matrix2, args, 2);
              break;
            case "skewY":
              skewMatrix(matrix2, args, 1);
              break;
            case "matrix":
              matrix2 = args;
              break;
          }
          matrices.push(matrix2.concat());
          matrix2 = iMatrix.concat();
        });
        var combinedMatrix = matrices[0];
        while (matrices.length > 1) {
          matrices.shift();
          combinedMatrix = fabric3.util.multiplyTransformMatrices(combinedMatrix, matrices[0]);
        }
        return combinedMatrix;
      };
    }();
    function parseStyleString(style, oStyle) {
      var attr, value;
      style.replace(/;\s*$/, "").split(";").forEach(function(chunk) {
        var pair = chunk.split(":");
        attr = pair[0].trim().toLowerCase();
        value = pair[1].trim();
        oStyle[attr] = value;
      });
    }
    function parseStyleObject(style, oStyle) {
      var attr, value;
      for (var prop in style) {
        if (typeof style[prop] === "undefined") {
          continue;
        }
        attr = prop.toLowerCase();
        value = style[prop];
        oStyle[attr] = value;
      }
    }
    function getGlobalStylesForElement(element, svgUid) {
      var styles = {};
      for (var rule in fabric3.cssRules[svgUid]) {
        if (elementMatchesRule(element, rule.split(" "))) {
          for (var property in fabric3.cssRules[svgUid][rule]) {
            styles[property] = fabric3.cssRules[svgUid][rule][property];
          }
        }
      }
      return styles;
    }
    function elementMatchesRule(element, selectors) {
      var firstMatching, parentMatching = true;
      firstMatching = selectorMatches(element, selectors.pop());
      if (firstMatching && selectors.length) {
        parentMatching = doesSomeParentMatch(element, selectors);
      }
      return firstMatching && parentMatching && selectors.length === 0;
    }
    function doesSomeParentMatch(element, selectors) {
      var selector, parentMatching = true;
      while (element.parentNode && element.parentNode.nodeType === 1 && selectors.length) {
        if (parentMatching) {
          selector = selectors.pop();
        }
        element = element.parentNode;
        parentMatching = selectorMatches(element, selector);
      }
      return selectors.length === 0;
    }
    function selectorMatches(element, selector) {
      var nodeName = element.nodeName, classNames = element.getAttribute("class"), id = element.getAttribute("id"), matcher, i2;
      matcher = new RegExp("^" + nodeName, "i");
      selector = selector.replace(matcher, "");
      if (id && selector.length) {
        matcher = new RegExp("#" + id + "(?![a-zA-Z\\-]+)", "i");
        selector = selector.replace(matcher, "");
      }
      if (classNames && selector.length) {
        classNames = classNames.split(" ");
        for (i2 = classNames.length; i2--; ) {
          matcher = new RegExp("\\." + classNames[i2] + "(?![a-zA-Z\\-]+)", "i");
          selector = selector.replace(matcher, "");
        }
      }
      return selector.length === 0;
    }
    function elementById(doc, id) {
      var el;
      doc.getElementById && (el = doc.getElementById(id));
      if (el) {
        return el;
      }
      var node, i2, len, nodelist = doc.getElementsByTagName("*");
      for (i2 = 0, len = nodelist.length; i2 < len; i2++) {
        node = nodelist[i2];
        if (id === node.getAttribute("id")) {
          return node;
        }
      }
    }
    function parseUseDirectives(doc) {
      var nodelist = _getMultipleNodes(doc, ["use", "svg:use"]), i2 = 0;
      while (nodelist.length && i2 < nodelist.length) {
        var el = nodelist[i2], xlinkAttribute = el.getAttribute("xlink:href") || el.getAttribute("href");
        if (xlinkAttribute === null) {
          return;
        }
        var xlink = xlinkAttribute.slice(1), x2 = el.getAttribute("x") || 0, y3 = el.getAttribute("y") || 0, el2 = elementById(doc, xlink).cloneNode(true), currentTrans = (el2.getAttribute("transform") || "") + " translate(" + x2 + ", " + y3 + ")", parentNode, oldLength = nodelist.length, attr, j, attrs, len, namespace = fabric3.svgNS;
        applyViewboxTransform(el2);
        if (/^svg$/i.test(el2.nodeName)) {
          var el3 = el2.ownerDocument.createElementNS(namespace, "g");
          for (j = 0, attrs = el2.attributes, len = attrs.length; j < len; j++) {
            attr = attrs.item(j);
            el3.setAttributeNS(namespace, attr.nodeName, attr.nodeValue);
          }
          while (el2.firstChild) {
            el3.appendChild(el2.firstChild);
          }
          el2 = el3;
        }
        for (j = 0, attrs = el.attributes, len = attrs.length; j < len; j++) {
          attr = attrs.item(j);
          if (attr.nodeName === "x" || attr.nodeName === "y" || attr.nodeName === "xlink:href" || attr.nodeName === "href") {
            continue;
          }
          if (attr.nodeName === "transform") {
            currentTrans = attr.nodeValue + " " + currentTrans;
          } else {
            el2.setAttribute(attr.nodeName, attr.nodeValue);
          }
        }
        el2.setAttribute("transform", currentTrans);
        el2.setAttribute("instantiated_by_use", "1");
        el2.removeAttribute("id");
        parentNode = el.parentNode;
        parentNode.replaceChild(el2, el);
        if (nodelist.length === oldLength) {
          i2++;
        }
      }
    }
    var reViewBoxAttrValue = new RegExp(
      "^\\s*(" + fabric3.reNum + "+)\\s*,?\\s*(" + fabric3.reNum + "+)\\s*,?\\s*(" + fabric3.reNum + "+)\\s*,?\\s*(" + fabric3.reNum + "+)\\s*$"
    );
    function applyViewboxTransform(element) {
      if (!fabric3.svgViewBoxElementsRegEx.test(element.nodeName)) {
        return {};
      }
      var viewBoxAttr = element.getAttribute("viewBox"), scaleX = 1, scaleY = 1, minX = 0, minY = 0, viewBoxWidth, viewBoxHeight, matrix, el, widthAttr = element.getAttribute("width"), heightAttr = element.getAttribute("height"), x2 = element.getAttribute("x") || 0, y3 = element.getAttribute("y") || 0, preserveAspectRatio = element.getAttribute("preserveAspectRatio") || "", missingViewBox = !viewBoxAttr || !(viewBoxAttr = viewBoxAttr.match(reViewBoxAttrValue)), missingDimAttr = !widthAttr || !heightAttr || widthAttr === "100%" || heightAttr === "100%", toBeParsed = missingViewBox && missingDimAttr, parsedDim = {}, translateMatrix = "", widthDiff = 0, heightDiff = 0;
      parsedDim.width = 0;
      parsedDim.height = 0;
      parsedDim.toBeParsed = toBeParsed;
      if (missingViewBox) {
        if ((x2 || y3) && element.parentNode && element.parentNode.nodeName !== "#document") {
          translateMatrix = " translate(" + parseUnit(x2) + " " + parseUnit(y3) + ") ";
          matrix = (element.getAttribute("transform") || "") + translateMatrix;
          element.setAttribute("transform", matrix);
          element.removeAttribute("x");
          element.removeAttribute("y");
        }
      }
      if (toBeParsed) {
        return parsedDim;
      }
      if (missingViewBox) {
        parsedDim.width = parseUnit(widthAttr);
        parsedDim.height = parseUnit(heightAttr);
        return parsedDim;
      }
      minX = -parseFloat(viewBoxAttr[1]);
      minY = -parseFloat(viewBoxAttr[2]);
      viewBoxWidth = parseFloat(viewBoxAttr[3]);
      viewBoxHeight = parseFloat(viewBoxAttr[4]);
      parsedDim.minX = minX;
      parsedDim.minY = minY;
      parsedDim.viewBoxWidth = viewBoxWidth;
      parsedDim.viewBoxHeight = viewBoxHeight;
      if (!missingDimAttr) {
        parsedDim.width = parseUnit(widthAttr);
        parsedDim.height = parseUnit(heightAttr);
        scaleX = parsedDim.width / viewBoxWidth;
        scaleY = parsedDim.height / viewBoxHeight;
      } else {
        parsedDim.width = viewBoxWidth;
        parsedDim.height = viewBoxHeight;
      }
      preserveAspectRatio = fabric3.util.parsePreserveAspectRatioAttribute(preserveAspectRatio);
      if (preserveAspectRatio.alignX !== "none") {
        if (preserveAspectRatio.meetOrSlice === "meet") {
          scaleY = scaleX = scaleX > scaleY ? scaleY : scaleX;
        }
        if (preserveAspectRatio.meetOrSlice === "slice") {
          scaleY = scaleX = scaleX > scaleY ? scaleX : scaleY;
        }
        widthDiff = parsedDim.width - viewBoxWidth * scaleX;
        heightDiff = parsedDim.height - viewBoxHeight * scaleX;
        if (preserveAspectRatio.alignX === "Mid") {
          widthDiff /= 2;
        }
        if (preserveAspectRatio.alignY === "Mid") {
          heightDiff /= 2;
        }
        if (preserveAspectRatio.alignX === "Min") {
          widthDiff = 0;
        }
        if (preserveAspectRatio.alignY === "Min") {
          heightDiff = 0;
        }
      }
      if (scaleX === 1 && scaleY === 1 && minX === 0 && minY === 0 && x2 === 0 && y3 === 0) {
        return parsedDim;
      }
      if ((x2 || y3) && element.parentNode.nodeName !== "#document") {
        translateMatrix = " translate(" + parseUnit(x2) + " " + parseUnit(y3) + ") ";
      }
      matrix = translateMatrix + " matrix(" + scaleX + " 0 0 " + scaleY + " " + (minX * scaleX + widthDiff) + " " + (minY * scaleY + heightDiff) + ") ";
      if (element.nodeName === "svg") {
        el = element.ownerDocument.createElementNS(fabric3.svgNS, "g");
        while (element.firstChild) {
          el.appendChild(element.firstChild);
        }
        element.appendChild(el);
      } else {
        el = element;
        el.removeAttribute("x");
        el.removeAttribute("y");
        matrix = el.getAttribute("transform") + matrix;
      }
      el.setAttribute("transform", matrix);
      return parsedDim;
    }
    function hasAncestorWithNodeName(element, nodeName) {
      while (element && (element = element.parentNode)) {
        if (element.nodeName && nodeName.test(element.nodeName.replace("svg:", "")) && !element.getAttribute("instantiated_by_use")) {
          return true;
        }
      }
      return false;
    }
    fabric3.parseSVGDocument = function(doc, callback, reviver, parsingOptions) {
      if (!doc) {
        return;
      }
      parseUseDirectives(doc);
      var svgUid = fabric3.Object.__uid++, i2, len, options = applyViewboxTransform(doc), descendants = fabric3.util.toArray(doc.getElementsByTagName("*"));
      options.crossOrigin = parsingOptions && parsingOptions.crossOrigin;
      options.svgUid = svgUid;
      if (descendants.length === 0 && fabric3.isLikelyNode) {
        descendants = doc.selectNodes('//*[name(.)!="svg"]');
        var arr = [];
        for (i2 = 0, len = descendants.length; i2 < len; i2++) {
          arr[i2] = descendants[i2];
        }
        descendants = arr;
      }
      var elements = descendants.filter(function(el) {
        applyViewboxTransform(el);
        return fabric3.svgValidTagNamesRegEx.test(el.nodeName.replace("svg:", "")) && !hasAncestorWithNodeName(el, fabric3.svgInvalidAncestorsRegEx);
      });
      if (!elements || elements && !elements.length) {
        callback && callback([], {});
        return;
      }
      var clipPaths = {};
      descendants.filter(function(el) {
        return el.nodeName.replace("svg:", "") === "clipPath";
      }).forEach(function(el) {
        var id = el.getAttribute("id");
        clipPaths[id] = fabric3.util.toArray(el.getElementsByTagName("*")).filter(function(el2) {
          return fabric3.svgValidTagNamesRegEx.test(el2.nodeName.replace("svg:", ""));
        });
      });
      fabric3.gradientDefs[svgUid] = fabric3.getGradientDefs(doc);
      fabric3.cssRules[svgUid] = fabric3.getCSSRules(doc);
      fabric3.clipPaths[svgUid] = clipPaths;
      fabric3.parseElements(elements, function(instances, elements2) {
        if (callback) {
          callback(instances, options, elements2, descendants);
          delete fabric3.gradientDefs[svgUid];
          delete fabric3.cssRules[svgUid];
          delete fabric3.clipPaths[svgUid];
        }
      }, clone(options), reviver, parsingOptions);
    };
    function recursivelyParseGradientsXlink(doc, gradient) {
      var gradientsAttrs = ["gradientTransform", "x1", "x2", "y1", "y2", "gradientUnits", "cx", "cy", "r", "fx", "fy"], xlinkAttr = "xlink:href", xLink = gradient.getAttribute(xlinkAttr).slice(1), referencedGradient = elementById(doc, xLink);
      if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
        recursivelyParseGradientsXlink(doc, referencedGradient);
      }
      gradientsAttrs.forEach(function(attr) {
        if (referencedGradient && !gradient.hasAttribute(attr) && referencedGradient.hasAttribute(attr)) {
          gradient.setAttribute(attr, referencedGradient.getAttribute(attr));
        }
      });
      if (!gradient.children.length) {
        var referenceClone = referencedGradient.cloneNode(true);
        while (referenceClone.firstChild) {
          gradient.appendChild(referenceClone.firstChild);
        }
      }
      gradient.removeAttribute(xlinkAttr);
    }
    var reFontDeclaration = new RegExp(
      "(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + fabric3.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + fabric3.reNum + "))?\\s+(.*)"
    );
    extend(fabric3, {
      parseFontDeclaration: function(value, oStyle) {
        var match2 = value.match(reFontDeclaration);
        if (!match2) {
          return;
        }
        var fontStyle = match2[1], fontWeight = match2[3], fontSize = match2[4], lineHeight = match2[5], fontFamily = match2[6];
        if (fontStyle) {
          oStyle.fontStyle = fontStyle;
        }
        if (fontWeight) {
          oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
        }
        if (fontSize) {
          oStyle.fontSize = parseUnit(fontSize);
        }
        if (fontFamily) {
          oStyle.fontFamily = fontFamily;
        }
        if (lineHeight) {
          oStyle.lineHeight = lineHeight === "normal" ? 1 : lineHeight;
        }
      },
      getGradientDefs: function(doc) {
        var tagArray = [
          "linearGradient",
          "radialGradient",
          "svg:linearGradient",
          "svg:radialGradient"
        ], elList = _getMultipleNodes(doc, tagArray), el, j = 0, gradientDefs = {};
        j = elList.length;
        while (j--) {
          el = elList[j];
          if (el.getAttribute("xlink:href")) {
            recursivelyParseGradientsXlink(doc, el);
          }
          gradientDefs[el.getAttribute("id")] = el;
        }
        return gradientDefs;
      },
      parseAttributes: function(element, attributes, svgUid) {
        if (!element) {
          return;
        }
        var value, parentAttributes = {}, fontSize, parentFontSize;
        if (typeof svgUid === "undefined") {
          svgUid = element.getAttribute("svgUid");
        }
        if (element.parentNode && fabric3.svgValidParentsRegEx.test(element.parentNode.nodeName)) {
          parentAttributes = fabric3.parseAttributes(element.parentNode, attributes, svgUid);
        }
        var ownAttributes = attributes.reduce(function(memo, attr2) {
          value = element.getAttribute(attr2);
          if (value) {
            memo[attr2] = value;
          }
          return memo;
        }, {});
        var cssAttrs = extend(
          getGlobalStylesForElement(element, svgUid),
          fabric3.parseStyleAttribute(element)
        );
        ownAttributes = extend(
          ownAttributes,
          cssAttrs
        );
        if (cssAttrs[cPath]) {
          element.setAttribute(cPath, cssAttrs[cPath]);
        }
        fontSize = parentFontSize = parentAttributes.fontSize || fabric3.Text.DEFAULT_SVG_FONT_SIZE;
        if (ownAttributes[fSize]) {
          ownAttributes[fSize] = fontSize = parseUnit(ownAttributes[fSize], parentFontSize);
        }
        var normalizedAttr, normalizedValue, normalizedStyle = {};
        for (var attr in ownAttributes) {
          normalizedAttr = normalizeAttr(attr);
          normalizedValue = normalizeValue(normalizedAttr, ownAttributes[attr], parentAttributes, fontSize);
          normalizedStyle[normalizedAttr] = normalizedValue;
        }
        if (normalizedStyle && normalizedStyle.font) {
          fabric3.parseFontDeclaration(normalizedStyle.font, normalizedStyle);
        }
        var mergedAttrs = extend(parentAttributes, normalizedStyle);
        return fabric3.svgValidParentsRegEx.test(element.nodeName) ? mergedAttrs : _setStrokeFillOpacity(mergedAttrs);
      },
      parseElements: function(elements, callback, options, reviver, parsingOptions) {
        new fabric3.ElementsParser(elements, callback, options, reviver, parsingOptions).parse();
      },
      parseStyleAttribute: function(element) {
        var oStyle = {}, style = element.getAttribute("style");
        if (!style) {
          return oStyle;
        }
        if (typeof style === "string") {
          parseStyleString(style, oStyle);
        } else {
          parseStyleObject(style, oStyle);
        }
        return oStyle;
      },
      parsePointsAttribute: function(points) {
        if (!points) {
          return null;
        }
        points = points.replace(/,/g, " ").trim();
        points = points.split(/\s+/);
        var parsedPoints = [], i2, len;
        for (i2 = 0, len = points.length; i2 < len; i2 += 2) {
          parsedPoints.push({
            x: parseFloat(points[i2]),
            y: parseFloat(points[i2 + 1])
          });
        }
        return parsedPoints;
      },
      getCSSRules: function(doc) {
        var styles = doc.getElementsByTagName("style"), i2, len, allRules = {}, rules;
        for (i2 = 0, len = styles.length; i2 < len; i2++) {
          var styleContents = styles[i2].textContent;
          styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, "");
          if (styleContents.trim() === "") {
            continue;
          }
          rules = styleContents.split("}");
          rules = rules.filter(function(rule) {
            return rule.trim();
          });
          rules.forEach(function(rule) {
            var match2 = rule.split("{"), ruleObj = {}, declaration = match2[1].trim(), propertyValuePairs = declaration.split(";").filter(function(pair2) {
              return pair2.trim();
            });
            for (i2 = 0, len = propertyValuePairs.length; i2 < len; i2++) {
              var pair = propertyValuePairs[i2].split(":"), property = pair[0].trim(), value = pair[1].trim();
              ruleObj[property] = value;
            }
            rule = match2[0].trim();
            rule.split(",").forEach(function(_rule) {
              _rule = _rule.replace(/^svg/i, "").trim();
              if (_rule === "") {
                return;
              }
              if (allRules[_rule]) {
                fabric3.util.object.extend(allRules[_rule], ruleObj);
              } else {
                allRules[_rule] = fabric3.util.object.clone(ruleObj);
              }
            });
          });
        }
        return allRules;
      },
      loadSVGFromURL: function(url, callback, reviver, options) {
        url = url.replace(/^\n\s*/, "").trim();
        new fabric3.util.request(url, {
          method: "get",
          onComplete
        });
        function onComplete(r) {
          var xml = r.responseXML;
          if (!xml || !xml.documentElement) {
            callback && callback(null);
            return false;
          }
          fabric3.parseSVGDocument(xml.documentElement, function(results, _options, elements, allElements) {
            callback && callback(results, _options, elements, allElements);
          }, reviver, options);
        }
      },
      loadSVGFromString: function(string, callback, reviver, options) {
        var parser = new fabric3.window.DOMParser(), doc = parser.parseFromString(string.trim(), "text/xml");
        fabric3.parseSVGDocument(doc.documentElement, function(results, _options, elements, allElements) {
          callback(results, _options, elements, allElements);
        }, reviver, options);
      }
    });
  })(exports);
  fabric2.ElementsParser = function(elements, callback, options, reviver, parsingOptions, doc) {
    this.elements = elements;
    this.callback = callback;
    this.options = options;
    this.reviver = reviver;
    this.svgUid = options && options.svgUid || 0;
    this.parsingOptions = parsingOptions;
    this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
    this.doc = doc;
  };
  (function(proto) {
    proto.parse = function() {
      this.instances = new Array(this.elements.length);
      this.numElements = this.elements.length;
      this.createObjects();
    };
    proto.createObjects = function() {
      var _this = this;
      this.elements.forEach(function(element, i2) {
        element.setAttribute("svgUid", _this.svgUid);
        _this.createObject(element, i2);
      });
    };
    proto.findTag = function(el) {
      return fabric2[fabric2.util.string.capitalize(el.tagName.replace("svg:", ""))];
    };
    proto.createObject = function(el, index) {
      var klass = this.findTag(el);
      if (klass && klass.fromElement) {
        try {
          klass.fromElement(el, this.createCallback(index, el), this.options);
        } catch (err) {
          fabric2.log(err);
        }
      } else {
        this.checkIfDone();
      }
    };
    proto.createCallback = function(index, el) {
      var _this = this;
      return function(obj) {
        var _options;
        _this.resolveGradient(obj, el, "fill");
        _this.resolveGradient(obj, el, "stroke");
        if (obj instanceof fabric2.Image && obj._originalElement) {
          _options = obj.parsePreserveAspectRatioAttribute(el);
        }
        obj._removeTransformMatrix(_options);
        _this.resolveClipPath(obj, el);
        _this.reviver && _this.reviver(el, obj);
        _this.instances[index] = obj;
        _this.checkIfDone();
      };
    };
    proto.extractPropertyDefinition = function(obj, property, storage) {
      var value = obj[property], regex = this.regexUrl;
      if (!regex.test(value)) {
        return;
      }
      regex.lastIndex = 0;
      var id = regex.exec(value)[1];
      regex.lastIndex = 0;
      return fabric2[storage][this.svgUid][id];
    };
    proto.resolveGradient = function(obj, el, property) {
      var gradientDef = this.extractPropertyDefinition(obj, property, "gradientDefs");
      if (gradientDef) {
        var opacityAttr = el.getAttribute(property + "-opacity");
        var gradient = fabric2.Gradient.fromElement(gradientDef, obj, opacityAttr, this.options);
        obj.set(property, gradient);
      }
    };
    proto.createClipPathCallback = function(obj, container) {
      return function(_newObj) {
        _newObj._removeTransformMatrix();
        _newObj.fillRule = _newObj.clipRule;
        container.push(_newObj);
      };
    };
    proto.resolveClipPath = function(obj, usingElement) {
      var clipPath = this.extractPropertyDefinition(obj, "clipPath", "clipPaths"), element, klass, objTransformInv, container, gTransform, options;
      if (clipPath) {
        container = [];
        objTransformInv = fabric2.util.invertTransform(obj.calcTransformMatrix());
        var clipPathTag = clipPath[0].parentNode;
        var clipPathOwner = usingElement;
        while (clipPathOwner.parentNode && clipPathOwner.getAttribute("clip-path") !== obj.clipPath) {
          clipPathOwner = clipPathOwner.parentNode;
        }
        clipPathOwner.parentNode.appendChild(clipPathTag);
        for (var i2 = 0; i2 < clipPath.length; i2++) {
          element = clipPath[i2];
          klass = this.findTag(element);
          klass.fromElement(
            element,
            this.createClipPathCallback(obj, container),
            this.options
          );
        }
        if (container.length === 1) {
          clipPath = container[0];
        } else {
          clipPath = new fabric2.Group(container);
        }
        gTransform = fabric2.util.multiplyTransformMatrices(
          objTransformInv,
          clipPath.calcTransformMatrix()
        );
        if (clipPath.clipPath) {
          this.resolveClipPath(clipPath, clipPathOwner);
        }
        var options = fabric2.util.qrDecompose(gTransform);
        clipPath.flipX = false;
        clipPath.flipY = false;
        clipPath.set("scaleX", options.scaleX);
        clipPath.set("scaleY", options.scaleY);
        clipPath.angle = options.angle;
        clipPath.skewX = options.skewX;
        clipPath.skewY = 0;
        clipPath.setPositionByOrigin({ x: options.translateX, y: options.translateY }, "center", "center");
        obj.clipPath = clipPath;
      } else {
        delete obj.clipPath;
      }
    };
    proto.checkIfDone = function() {
      if (--this.numElements === 0) {
        this.instances = this.instances.filter(function(el) {
          return el != null;
        });
        this.callback(this.instances, this.elements);
      }
    };
  })(fabric2.ElementsParser.prototype);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    if (fabric3.Point) {
      fabric3.warn("fabric.Point is already defined");
      return;
    }
    fabric3.Point = Point;
    function Point(x2, y3) {
      this.x = x2;
      this.y = y3;
    }
    Point.prototype = {
      type: "point",
      constructor: Point,
      add: function(that) {
        return new Point(this.x + that.x, this.y + that.y);
      },
      addEquals: function(that) {
        this.x += that.x;
        this.y += that.y;
        return this;
      },
      scalarAdd: function(scalar) {
        return new Point(this.x + scalar, this.y + scalar);
      },
      scalarAddEquals: function(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
      },
      subtract: function(that) {
        return new Point(this.x - that.x, this.y - that.y);
      },
      subtractEquals: function(that) {
        this.x -= that.x;
        this.y -= that.y;
        return this;
      },
      scalarSubtract: function(scalar) {
        return new Point(this.x - scalar, this.y - scalar);
      },
      scalarSubtractEquals: function(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
      },
      multiply: function(scalar) {
        return new Point(this.x * scalar, this.y * scalar);
      },
      multiplyEquals: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      },
      divide: function(scalar) {
        return new Point(this.x / scalar, this.y / scalar);
      },
      divideEquals: function(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
      },
      eq: function(that) {
        return this.x === that.x && this.y === that.y;
      },
      lt: function(that) {
        return this.x < that.x && this.y < that.y;
      },
      lte: function(that) {
        return this.x <= that.x && this.y <= that.y;
      },
      gt: function(that) {
        return this.x > that.x && this.y > that.y;
      },
      gte: function(that) {
        return this.x >= that.x && this.y >= that.y;
      },
      lerp: function(that, t2) {
        if (typeof t2 === "undefined") {
          t2 = 0.5;
        }
        t2 = Math.max(Math.min(1, t2), 0);
        return new Point(this.x + (that.x - this.x) * t2, this.y + (that.y - this.y) * t2);
      },
      distanceFrom: function(that) {
        var dx = this.x - that.x, dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
      },
      midPointFrom: function(that) {
        return this.lerp(that);
      },
      min: function(that) {
        return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
      },
      max: function(that) {
        return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
      },
      toString: function() {
        return this.x + "," + this.y;
      },
      setXY: function(x2, y3) {
        this.x = x2;
        this.y = y3;
        return this;
      },
      setX: function(x2) {
        this.x = x2;
        return this;
      },
      setY: function(y3) {
        this.y = y3;
        return this;
      },
      setFromPoint: function(that) {
        this.x = that.x;
        this.y = that.y;
        return this;
      },
      swap: function(that) {
        var x2 = this.x, y3 = this.y;
        this.x = that.x;
        this.y = that.y;
        that.x = x2;
        that.y = y3;
      },
      clone: function() {
        return new Point(this.x, this.y);
      }
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    if (fabric3.Intersection) {
      fabric3.warn("fabric.Intersection is already defined");
      return;
    }
    function Intersection(status) {
      this.status = status;
      this.points = [];
    }
    fabric3.Intersection = Intersection;
    fabric3.Intersection.prototype = {
      constructor: Intersection,
      appendPoint: function(point) {
        this.points.push(point);
        return this;
      },
      appendPoints: function(points) {
        this.points = this.points.concat(points);
        return this;
      }
    };
    fabric3.Intersection.intersectLineLine = function(a1, a22, b1, b2) {
      var result, uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ubT = (a22.x - a1.x) * (a1.y - b1.y) - (a22.y - a1.y) * (a1.x - b1.x), uB = (b2.y - b1.y) * (a22.x - a1.x) - (b2.x - b1.x) * (a22.y - a1.y);
      if (uB !== 0) {
        var ua2 = uaT / uB, ub = ubT / uB;
        if (0 <= ua2 && ua2 <= 1 && 0 <= ub && ub <= 1) {
          result = new Intersection("Intersection");
          result.appendPoint(new fabric3.Point(a1.x + ua2 * (a22.x - a1.x), a1.y + ua2 * (a22.y - a1.y)));
        } else {
          result = new Intersection();
        }
      } else {
        if (uaT === 0 || ubT === 0) {
          result = new Intersection("Coincident");
        } else {
          result = new Intersection("Parallel");
        }
      }
      return result;
    };
    fabric3.Intersection.intersectLinePolygon = function(a1, a22, points) {
      var result = new Intersection(), length = points.length, b1, b2, inter, i2;
      for (i2 = 0; i2 < length; i2++) {
        b1 = points[i2];
        b2 = points[(i2 + 1) % length];
        inter = Intersection.intersectLineLine(a1, a22, b1, b2);
        result.appendPoints(inter.points);
      }
      if (result.points.length > 0) {
        result.status = "Intersection";
      }
      return result;
    };
    fabric3.Intersection.intersectPolygonPolygon = function(points1, points2) {
      var result = new Intersection(), length = points1.length, i2;
      for (i2 = 0; i2 < length; i2++) {
        var a1 = points1[i2], a22 = points1[(i2 + 1) % length], inter = Intersection.intersectLinePolygon(a1, a22, points2);
        result.appendPoints(inter.points);
      }
      if (result.points.length > 0) {
        result.status = "Intersection";
      }
      return result;
    };
    fabric3.Intersection.intersectPolygonRectangle = function(points, r1, r2) {
      var min = r1.min(r2), max = r1.max(r2), topRight = new fabric3.Point(max.x, min.y), bottomLeft = new fabric3.Point(min.x, max.y), inter1 = Intersection.intersectLinePolygon(min, topRight, points), inter2 = Intersection.intersectLinePolygon(topRight, max, points), inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points), inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points), result = new Intersection();
      result.appendPoints(inter1.points);
      result.appendPoints(inter2.points);
      result.appendPoints(inter3.points);
      result.appendPoints(inter4.points);
      if (result.points.length > 0) {
        result.status = "Intersection";
      }
      return result;
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    if (fabric3.Color) {
      fabric3.warn("fabric.Color is already defined.");
      return;
    }
    function Color(color) {
      if (!color) {
        this.setSource([0, 0, 0, 1]);
      } else {
        this._tryParsingColor(color);
      }
    }
    fabric3.Color = Color;
    fabric3.Color.prototype = {
      _tryParsingColor: function(color) {
        var source;
        if (color in Color.colorNameMap) {
          color = Color.colorNameMap[color];
        }
        if (color === "transparent") {
          source = [255, 255, 255, 0];
        }
        if (!source) {
          source = Color.sourceFromHex(color);
        }
        if (!source) {
          source = Color.sourceFromRgb(color);
        }
        if (!source) {
          source = Color.sourceFromHsl(color);
        }
        if (!source) {
          source = [0, 0, 0, 1];
        }
        if (source) {
          this.setSource(source);
        }
      },
      _rgbToHsl: function(r, g, b2) {
        r /= 255;
        g /= 255;
        b2 /= 255;
        var h3, s3, l, max = fabric3.util.array.max([r, g, b2]), min = fabric3.util.array.min([r, g, b2]);
        l = (max + min) / 2;
        if (max === min) {
          h3 = s3 = 0;
        } else {
          var d3 = max - min;
          s3 = l > 0.5 ? d3 / (2 - max - min) : d3 / (max + min);
          switch (max) {
            case r:
              h3 = (g - b2) / d3 + (g < b2 ? 6 : 0);
              break;
            case g:
              h3 = (b2 - r) / d3 + 2;
              break;
            case b2:
              h3 = (r - g) / d3 + 4;
              break;
          }
          h3 /= 6;
        }
        return [
          Math.round(h3 * 360),
          Math.round(s3 * 100),
          Math.round(l * 100)
        ];
      },
      getSource: function() {
        return this._source;
      },
      setSource: function(source) {
        this._source = source;
      },
      toRgb: function() {
        var source = this.getSource();
        return "rgb(" + source[0] + "," + source[1] + "," + source[2] + ")";
      },
      toRgba: function() {
        var source = this.getSource();
        return "rgba(" + source[0] + "," + source[1] + "," + source[2] + "," + source[3] + ")";
      },
      toHsl: function() {
        var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
        return "hsl(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%)";
      },
      toHsla: function() {
        var source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
        return "hsla(" + hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%," + source[3] + ")";
      },
      toHex: function() {
        var source = this.getSource(), r, g, b2;
        r = source[0].toString(16);
        r = r.length === 1 ? "0" + r : r;
        g = source[1].toString(16);
        g = g.length === 1 ? "0" + g : g;
        b2 = source[2].toString(16);
        b2 = b2.length === 1 ? "0" + b2 : b2;
        return r.toUpperCase() + g.toUpperCase() + b2.toUpperCase();
      },
      toHexa: function() {
        var source = this.getSource(), a3;
        a3 = Math.round(source[3] * 255);
        a3 = a3.toString(16);
        a3 = a3.length === 1 ? "0" + a3 : a3;
        return this.toHex() + a3.toUpperCase();
      },
      getAlpha: function() {
        return this.getSource()[3];
      },
      setAlpha: function(alpha) {
        var source = this.getSource();
        source[3] = alpha;
        this.setSource(source);
        return this;
      },
      toGrayscale: function() {
        var source = this.getSource(), average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10), currentAlpha = source[3];
        this.setSource([average, average, average, currentAlpha]);
        return this;
      },
      toBlackWhite: function(threshold) {
        var source = this.getSource(), average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), currentAlpha = source[3];
        threshold = threshold || 127;
        average = Number(average) < Number(threshold) ? 0 : 255;
        this.setSource([average, average, average, currentAlpha]);
        return this;
      },
      overlayWith: function(otherColor) {
        if (!(otherColor instanceof Color)) {
          otherColor = new Color(otherColor);
        }
        var result = [], alpha = this.getAlpha(), otherAlpha = 0.5, source = this.getSource(), otherSource = otherColor.getSource(), i2;
        for (i2 = 0; i2 < 3; i2++) {
          result.push(Math.round(source[i2] * (1 - otherAlpha) + otherSource[i2] * otherAlpha));
        }
        result[3] = alpha;
        this.setSource(result);
        return this;
      }
    };
    fabric3.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i;
    fabric3.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i;
    fabric3.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
    fabric3.Color.colorNameMap = {
      aliceblue: "#F0F8FF",
      antiquewhite: "#FAEBD7",
      aqua: "#00FFFF",
      aquamarine: "#7FFFD4",
      azure: "#F0FFFF",
      beige: "#F5F5DC",
      bisque: "#FFE4C4",
      black: "#000000",
      blanchedalmond: "#FFEBCD",
      blue: "#0000FF",
      blueviolet: "#8A2BE2",
      brown: "#A52A2A",
      burlywood: "#DEB887",
      cadetblue: "#5F9EA0",
      chartreuse: "#7FFF00",
      chocolate: "#D2691E",
      coral: "#FF7F50",
      cornflowerblue: "#6495ED",
      cornsilk: "#FFF8DC",
      crimson: "#DC143C",
      cyan: "#00FFFF",
      darkblue: "#00008B",
      darkcyan: "#008B8B",
      darkgoldenrod: "#B8860B",
      darkgray: "#A9A9A9",
      darkgrey: "#A9A9A9",
      darkgreen: "#006400",
      darkkhaki: "#BDB76B",
      darkmagenta: "#8B008B",
      darkolivegreen: "#556B2F",
      darkorange: "#FF8C00",
      darkorchid: "#9932CC",
      darkred: "#8B0000",
      darksalmon: "#E9967A",
      darkseagreen: "#8FBC8F",
      darkslateblue: "#483D8B",
      darkslategray: "#2F4F4F",
      darkslategrey: "#2F4F4F",
      darkturquoise: "#00CED1",
      darkviolet: "#9400D3",
      deeppink: "#FF1493",
      deepskyblue: "#00BFFF",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1E90FF",
      firebrick: "#B22222",
      floralwhite: "#FFFAF0",
      forestgreen: "#228B22",
      fuchsia: "#FF00FF",
      gainsboro: "#DCDCDC",
      ghostwhite: "#F8F8FF",
      gold: "#FFD700",
      goldenrod: "#DAA520",
      gray: "#808080",
      grey: "#808080",
      green: "#008000",
      greenyellow: "#ADFF2F",
      honeydew: "#F0FFF0",
      hotpink: "#FF69B4",
      indianred: "#CD5C5C",
      indigo: "#4B0082",
      ivory: "#FFFFF0",
      khaki: "#F0E68C",
      lavender: "#E6E6FA",
      lavenderblush: "#FFF0F5",
      lawngreen: "#7CFC00",
      lemonchiffon: "#FFFACD",
      lightblue: "#ADD8E6",
      lightcoral: "#F08080",
      lightcyan: "#E0FFFF",
      lightgoldenrodyellow: "#FAFAD2",
      lightgray: "#D3D3D3",
      lightgrey: "#D3D3D3",
      lightgreen: "#90EE90",
      lightpink: "#FFB6C1",
      lightsalmon: "#FFA07A",
      lightseagreen: "#20B2AA",
      lightskyblue: "#87CEFA",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#B0C4DE",
      lightyellow: "#FFFFE0",
      lime: "#00FF00",
      limegreen: "#32CD32",
      linen: "#FAF0E6",
      magenta: "#FF00FF",
      maroon: "#800000",
      mediumaquamarine: "#66CDAA",
      mediumblue: "#0000CD",
      mediumorchid: "#BA55D3",
      mediumpurple: "#9370DB",
      mediumseagreen: "#3CB371",
      mediumslateblue: "#7B68EE",
      mediumspringgreen: "#00FA9A",
      mediumturquoise: "#48D1CC",
      mediumvioletred: "#C71585",
      midnightblue: "#191970",
      mintcream: "#F5FFFA",
      mistyrose: "#FFE4E1",
      moccasin: "#FFE4B5",
      navajowhite: "#FFDEAD",
      navy: "#000080",
      oldlace: "#FDF5E6",
      olive: "#808000",
      olivedrab: "#6B8E23",
      orange: "#FFA500",
      orangered: "#FF4500",
      orchid: "#DA70D6",
      palegoldenrod: "#EEE8AA",
      palegreen: "#98FB98",
      paleturquoise: "#AFEEEE",
      palevioletred: "#DB7093",
      papayawhip: "#FFEFD5",
      peachpuff: "#FFDAB9",
      peru: "#CD853F",
      pink: "#FFC0CB",
      plum: "#DDA0DD",
      powderblue: "#B0E0E6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#FF0000",
      rosybrown: "#BC8F8F",
      royalblue: "#4169E1",
      saddlebrown: "#8B4513",
      salmon: "#FA8072",
      sandybrown: "#F4A460",
      seagreen: "#2E8B57",
      seashell: "#FFF5EE",
      sienna: "#A0522D",
      silver: "#C0C0C0",
      skyblue: "#87CEEB",
      slateblue: "#6A5ACD",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#FFFAFA",
      springgreen: "#00FF7F",
      steelblue: "#4682B4",
      tan: "#D2B48C",
      teal: "#008080",
      thistle: "#D8BFD8",
      tomato: "#FF6347",
      turquoise: "#40E0D0",
      violet: "#EE82EE",
      wheat: "#F5DEB3",
      white: "#FFFFFF",
      whitesmoke: "#F5F5F5",
      yellow: "#FFFF00",
      yellowgreen: "#9ACD32"
    };
    function hue2rgb(p, q2, t2) {
      if (t2 < 0) {
        t2 += 1;
      }
      if (t2 > 1) {
        t2 -= 1;
      }
      if (t2 < 1 / 6) {
        return p + (q2 - p) * 6 * t2;
      }
      if (t2 < 1 / 2) {
        return q2;
      }
      if (t2 < 2 / 3) {
        return p + (q2 - p) * (2 / 3 - t2) * 6;
      }
      return p;
    }
    fabric3.Color.fromRgb = function(color) {
      return Color.fromSource(Color.sourceFromRgb(color));
    };
    fabric3.Color.sourceFromRgb = function(color) {
      var match2 = color.match(Color.reRGBa);
      if (match2) {
        var r = parseInt(match2[1], 10) / (/%$/.test(match2[1]) ? 100 : 1) * (/%$/.test(match2[1]) ? 255 : 1), g = parseInt(match2[2], 10) / (/%$/.test(match2[2]) ? 100 : 1) * (/%$/.test(match2[2]) ? 255 : 1), b2 = parseInt(match2[3], 10) / (/%$/.test(match2[3]) ? 100 : 1) * (/%$/.test(match2[3]) ? 255 : 1);
        return [
          parseInt(r, 10),
          parseInt(g, 10),
          parseInt(b2, 10),
          match2[4] ? parseFloat(match2[4]) : 1
        ];
      }
    };
    fabric3.Color.fromRgba = Color.fromRgb;
    fabric3.Color.fromHsl = function(color) {
      return Color.fromSource(Color.sourceFromHsl(color));
    };
    fabric3.Color.sourceFromHsl = function(color) {
      var match2 = color.match(Color.reHSLa);
      if (!match2) {
        return;
      }
      var h3 = (parseFloat(match2[1]) % 360 + 360) % 360 / 360, s3 = parseFloat(match2[2]) / (/%$/.test(match2[2]) ? 100 : 1), l = parseFloat(match2[3]) / (/%$/.test(match2[3]) ? 100 : 1), r, g, b2;
      if (s3 === 0) {
        r = g = b2 = l;
      } else {
        var q2 = l <= 0.5 ? l * (s3 + 1) : l + s3 - l * s3, p = l * 2 - q2;
        r = hue2rgb(p, q2, h3 + 1 / 3);
        g = hue2rgb(p, q2, h3);
        b2 = hue2rgb(p, q2, h3 - 1 / 3);
      }
      return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b2 * 255),
        match2[4] ? parseFloat(match2[4]) : 1
      ];
    };
    fabric3.Color.fromHsla = Color.fromHsl;
    fabric3.Color.fromHex = function(color) {
      return Color.fromSource(Color.sourceFromHex(color));
    };
    fabric3.Color.sourceFromHex = function(color) {
      if (color.match(Color.reHex)) {
        var value = color.slice(color.indexOf("#") + 1), isShortNotation = value.length === 3 || value.length === 4, isRGBa = value.length === 8 || value.length === 4, r = isShortNotation ? value.charAt(0) + value.charAt(0) : value.substring(0, 2), g = isShortNotation ? value.charAt(1) + value.charAt(1) : value.substring(2, 4), b2 = isShortNotation ? value.charAt(2) + value.charAt(2) : value.substring(4, 6), a3 = isRGBa ? isShortNotation ? value.charAt(3) + value.charAt(3) : value.substring(6, 8) : "FF";
        return [
          parseInt(r, 16),
          parseInt(g, 16),
          parseInt(b2, 16),
          parseFloat((parseInt(a3, 16) / 255).toFixed(2))
        ];
      }
    };
    fabric3.Color.fromSource = function(source) {
      var oColor = new Color();
      oColor.setSource(source);
      return oColor;
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), scaleMap = ["e", "se", "s", "sw", "w", "nw", "n", "ne", "e"], skewMap = ["ns", "nesw", "ew", "nwse"], controls = {}, LEFT = "left", TOP = "top", RIGHT = "right", BOTTOM = "bottom", CENTER = "center", opposite = {
      top: BOTTOM,
      bottom: TOP,
      left: RIGHT,
      right: LEFT,
      center: CENTER
    }, radiansToDegrees = fabric3.util.radiansToDegrees, sign = Math.sign || function(x2) {
      return (x2 > 0) - (x2 < 0) || +x2;
    };
    function findCornerQuadrant(fabricObject, control) {
      var cornerAngle = fabricObject.angle + radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
      return Math.round(cornerAngle % 360 / 45);
    }
    function fireEvent(eventName, options) {
      var target = options.transform.target, canvas = target.canvas, canvasOptions = fabric3.util.object.clone(options);
      canvasOptions.target = target;
      canvas && canvas.fire("object:" + eventName, canvasOptions);
      target.fire(eventName, options);
    }
    function scaleIsProportional(eventData, fabricObject) {
      var canvas = fabricObject.canvas, uniScaleKey = canvas.uniScaleKey, uniformIsToggled = eventData[uniScaleKey];
      return canvas.uniformScaling && !uniformIsToggled || !canvas.uniformScaling && uniformIsToggled;
    }
    function isTransformCentered(transform) {
      return transform.originX === CENTER && transform.originY === CENTER;
    }
    function scalingIsForbidden(fabricObject, by, scaleProportionally) {
      var lockX = fabricObject.lockScalingX, lockY = fabricObject.lockScalingY;
      if (lockX && lockY) {
        return true;
      }
      if (!by && (lockX || lockY) && scaleProportionally) {
        return true;
      }
      if (lockX && by === "x") {
        return true;
      }
      if (lockY && by === "y") {
        return true;
      }
      return false;
    }
    function scaleCursorStyleHandler(eventData, control, fabricObject) {
      var notAllowed = "not-allowed", scaleProportionally = scaleIsProportional(eventData, fabricObject), by = "";
      if (control.x !== 0 && control.y === 0) {
        by = "x";
      } else if (control.x === 0 && control.y !== 0) {
        by = "y";
      }
      if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
        return notAllowed;
      }
      var n = findCornerQuadrant(fabricObject, control);
      return scaleMap[n] + "-resize";
    }
    function skewCursorStyleHandler(eventData, control, fabricObject) {
      var notAllowed = "not-allowed";
      if (control.x !== 0 && fabricObject.lockSkewingY) {
        return notAllowed;
      }
      if (control.y !== 0 && fabricObject.lockSkewingX) {
        return notAllowed;
      }
      var n = findCornerQuadrant(fabricObject, control) % 4;
      return skewMap[n] + "-resize";
    }
    function scaleSkewCursorStyleHandler(eventData, control, fabricObject) {
      if (eventData[fabricObject.canvas.altActionKey]) {
        return controls.skewCursorStyleHandler(eventData, control, fabricObject);
      }
      return controls.scaleCursorStyleHandler(eventData, control, fabricObject);
    }
    function scaleOrSkewActionName(eventData, control, fabricObject) {
      var isAlternative = eventData[fabricObject.canvas.altActionKey];
      if (control.x === 0) {
        return isAlternative ? "skewX" : "scaleY";
      }
      if (control.y === 0) {
        return isAlternative ? "skewY" : "scaleX";
      }
    }
    function rotationStyleHandler(eventData, control, fabricObject) {
      if (fabricObject.lockRotation) {
        return "not-allowed";
      }
      return control.cursorStyle;
    }
    function commonEventInfo(eventData, transform, x2, y3) {
      return {
        e: eventData,
        transform,
        pointer: {
          x: x2,
          y: y3
        }
      };
    }
    function wrapWithFixedAnchor(actionHandler) {
      return function(eventData, transform, x2, y3) {
        var target = transform.target, centerPoint = target.getCenterPoint(), constraint = target.translateToOriginPoint(centerPoint, transform.originX, transform.originY), actionPerformed = actionHandler(eventData, transform, x2, y3);
        target.setPositionByOrigin(constraint, transform.originX, transform.originY);
        return actionPerformed;
      };
    }
    function wrapWithFireEvent(eventName, actionHandler) {
      return function(eventData, transform, x2, y3) {
        var actionPerformed = actionHandler(eventData, transform, x2, y3);
        if (actionPerformed) {
          fireEvent(eventName, commonEventInfo(eventData, transform, x2, y3));
        }
        return actionPerformed;
      };
    }
    function getLocalPoint(transform, originX, originY, x2, y3) {
      var target = transform.target, control = target.controls[transform.corner], zoom = target.canvas.getZoom(), padding = target.padding / zoom, localPoint = target.toLocalPoint(new fabric3.Point(x2, y3), originX, originY);
      if (localPoint.x >= padding) {
        localPoint.x -= padding;
      }
      if (localPoint.x <= -padding) {
        localPoint.x += padding;
      }
      if (localPoint.y >= padding) {
        localPoint.y -= padding;
      }
      if (localPoint.y <= padding) {
        localPoint.y += padding;
      }
      localPoint.x -= control.offsetX;
      localPoint.y -= control.offsetY;
      return localPoint;
    }
    function targetHasOneFlip(target) {
      return target.flipX !== target.flipY;
    }
    function compensateScaleForSkew(target, oppositeSkew, scaleToCompensate, axis, reference) {
      if (target[oppositeSkew] !== 0) {
        var newDim = target._getTransformedDimensions()[axis];
        var newValue = reference / newDim * target[scaleToCompensate];
        target.set(scaleToCompensate, newValue);
      }
    }
    function skewObjectX(eventData, transform, x2, y3) {
      var target = transform.target, dimNoSkew = target._getTransformedDimensions(0, target.skewY), localPoint = getLocalPoint(transform, transform.originX, transform.originY, x2, y3), totalSkewSize = Math.abs(localPoint.x * 2) - dimNoSkew.x, currentSkew = target.skewX, newSkew;
      if (totalSkewSize < 2) {
        newSkew = 0;
      } else {
        newSkew = radiansToDegrees(
          Math.atan2(totalSkewSize / target.scaleX, dimNoSkew.y / target.scaleY)
        );
        if (transform.originX === LEFT && transform.originY === BOTTOM) {
          newSkew = -newSkew;
        }
        if (transform.originX === RIGHT && transform.originY === TOP) {
          newSkew = -newSkew;
        }
        if (targetHasOneFlip(target)) {
          newSkew = -newSkew;
        }
      }
      var hasSkewed = currentSkew !== newSkew;
      if (hasSkewed) {
        var dimBeforeSkewing = target._getTransformedDimensions().y;
        target.set("skewX", newSkew);
        compensateScaleForSkew(target, "skewY", "scaleY", "y", dimBeforeSkewing);
      }
      return hasSkewed;
    }
    function skewObjectY(eventData, transform, x2, y3) {
      var target = transform.target, dimNoSkew = target._getTransformedDimensions(target.skewX, 0), localPoint = getLocalPoint(transform, transform.originX, transform.originY, x2, y3), totalSkewSize = Math.abs(localPoint.y * 2) - dimNoSkew.y, currentSkew = target.skewY, newSkew;
      if (totalSkewSize < 2) {
        newSkew = 0;
      } else {
        newSkew = radiansToDegrees(
          Math.atan2(totalSkewSize / target.scaleY, dimNoSkew.x / target.scaleX)
        );
        if (transform.originX === LEFT && transform.originY === BOTTOM) {
          newSkew = -newSkew;
        }
        if (transform.originX === RIGHT && transform.originY === TOP) {
          newSkew = -newSkew;
        }
        if (targetHasOneFlip(target)) {
          newSkew = -newSkew;
        }
      }
      var hasSkewed = currentSkew !== newSkew;
      if (hasSkewed) {
        var dimBeforeSkewing = target._getTransformedDimensions().x;
        target.set("skewY", newSkew);
        compensateScaleForSkew(target, "skewX", "scaleX", "x", dimBeforeSkewing);
      }
      return hasSkewed;
    }
    function skewHandlerX(eventData, transform, x2, y3) {
      var target = transform.target, currentSkew = target.skewX, originX, originY = transform.originY;
      if (target.lockSkewingX) {
        return false;
      }
      if (currentSkew === 0) {
        var localPointFromCenter = getLocalPoint(transform, CENTER, CENTER, x2, y3);
        if (localPointFromCenter.x > 0) {
          originX = LEFT;
        } else {
          originX = RIGHT;
        }
      } else {
        if (currentSkew > 0) {
          originX = originY === TOP ? LEFT : RIGHT;
        }
        if (currentSkew < 0) {
          originX = originY === TOP ? RIGHT : LEFT;
        }
        if (targetHasOneFlip(target)) {
          originX = originX === LEFT ? RIGHT : LEFT;
        }
      }
      transform.originX = originX;
      var finalHandler = wrapWithFireEvent("skewing", wrapWithFixedAnchor(skewObjectX));
      return finalHandler(eventData, transform, x2, y3);
    }
    function skewHandlerY(eventData, transform, x2, y3) {
      var target = transform.target, currentSkew = target.skewY, originY, originX = transform.originX;
      if (target.lockSkewingY) {
        return false;
      }
      if (currentSkew === 0) {
        var localPointFromCenter = getLocalPoint(transform, CENTER, CENTER, x2, y3);
        if (localPointFromCenter.y > 0) {
          originY = TOP;
        } else {
          originY = BOTTOM;
        }
      } else {
        if (currentSkew > 0) {
          originY = originX === LEFT ? TOP : BOTTOM;
        }
        if (currentSkew < 0) {
          originY = originX === LEFT ? BOTTOM : TOP;
        }
        if (targetHasOneFlip(target)) {
          originY = originY === TOP ? BOTTOM : TOP;
        }
      }
      transform.originY = originY;
      var finalHandler = wrapWithFireEvent("skewing", wrapWithFixedAnchor(skewObjectY));
      return finalHandler(eventData, transform, x2, y3);
    }
    function rotationWithSnapping(eventData, transform, x2, y3) {
      var t2 = transform, target = t2.target, pivotPoint = target.translateToOriginPoint(target.getCenterPoint(), t2.originX, t2.originY);
      if (target.lockRotation) {
        return false;
      }
      var lastAngle = Math.atan2(t2.ey - pivotPoint.y, t2.ex - pivotPoint.x), curAngle = Math.atan2(y3 - pivotPoint.y, x2 - pivotPoint.x), angle = radiansToDegrees(curAngle - lastAngle + t2.theta), hasRotated = true;
      if (target.snapAngle > 0) {
        var snapAngle = target.snapAngle, snapThreshold = target.snapThreshold || snapAngle, rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle, leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;
        if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
          angle = leftAngleLocked;
        } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
          angle = rightAngleLocked;
        }
      }
      if (angle < 0) {
        angle = 360 + angle;
      }
      angle %= 360;
      hasRotated = target.angle !== angle;
      target.angle = angle;
      return hasRotated;
    }
    function scaleObject(eventData, transform, x2, y3, options) {
      options = options || {};
      var target = transform.target, lockScalingX = target.lockScalingX, lockScalingY = target.lockScalingY, by = options.by, newPoint, scaleX, scaleY, dim, scaleProportionally = scaleIsProportional(eventData, target), forbidScaling = scalingIsForbidden(target, by, scaleProportionally), signX, signY, gestureScale = transform.gestureScale;
      if (forbidScaling) {
        return false;
      }
      if (gestureScale) {
        scaleX = transform.scaleX * gestureScale;
        scaleY = transform.scaleY * gestureScale;
      } else {
        newPoint = getLocalPoint(transform, transform.originX, transform.originY, x2, y3);
        signX = by !== "y" ? sign(newPoint.x) : 1;
        signY = by !== "x" ? sign(newPoint.y) : 1;
        if (!transform.signX) {
          transform.signX = signX;
        }
        if (!transform.signY) {
          transform.signY = signY;
        }
        if (target.lockScalingFlip && (transform.signX !== signX || transform.signY !== signY)) {
          return false;
        }
        dim = target._getTransformedDimensions();
        if (scaleProportionally && !by) {
          var distance = Math.abs(newPoint.x) + Math.abs(newPoint.y), original = transform.original, originalDistance = Math.abs(dim.x * original.scaleX / target.scaleX) + Math.abs(dim.y * original.scaleY / target.scaleY), scale = distance / originalDistance;
          scaleX = original.scaleX * scale;
          scaleY = original.scaleY * scale;
        } else {
          scaleX = Math.abs(newPoint.x * target.scaleX / dim.x);
          scaleY = Math.abs(newPoint.y * target.scaleY / dim.y);
        }
        if (isTransformCentered(transform)) {
          scaleX *= 2;
          scaleY *= 2;
        }
        if (transform.signX !== signX && by !== "y") {
          transform.originX = opposite[transform.originX];
          scaleX *= -1;
          transform.signX = signX;
        }
        if (transform.signY !== signY && by !== "x") {
          transform.originY = opposite[transform.originY];
          scaleY *= -1;
          transform.signY = signY;
        }
      }
      var oldScaleX = target.scaleX, oldScaleY = target.scaleY;
      if (!by) {
        !lockScalingX && target.set("scaleX", scaleX);
        !lockScalingY && target.set("scaleY", scaleY);
      } else {
        by === "x" && target.set("scaleX", scaleX);
        by === "y" && target.set("scaleY", scaleY);
      }
      return oldScaleX !== target.scaleX || oldScaleY !== target.scaleY;
    }
    function scaleObjectFromCorner(eventData, transform, x2, y3) {
      return scaleObject(eventData, transform, x2, y3);
    }
    function scaleObjectX(eventData, transform, x2, y3) {
      return scaleObject(eventData, transform, x2, y3, { by: "x" });
    }
    function scaleObjectY(eventData, transform, x2, y3) {
      return scaleObject(eventData, transform, x2, y3, { by: "y" });
    }
    function scalingYOrSkewingX(eventData, transform, x2, y3) {
      if (eventData[transform.target.canvas.altActionKey]) {
        return controls.skewHandlerX(eventData, transform, x2, y3);
      }
      return controls.scalingY(eventData, transform, x2, y3);
    }
    function scalingXOrSkewingY(eventData, transform, x2, y3) {
      if (eventData[transform.target.canvas.altActionKey]) {
        return controls.skewHandlerY(eventData, transform, x2, y3);
      }
      return controls.scalingX(eventData, transform, x2, y3);
    }
    function changeWidth(eventData, transform, x2, y3) {
      var target = transform.target, localPoint = getLocalPoint(transform, transform.originX, transform.originY, x2, y3), strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1), multiplier = isTransformCentered(transform) ? 2 : 1, oldWidth = target.width, newWidth = Math.abs(localPoint.x * multiplier / target.scaleX) - strokePadding;
      target.set("width", Math.max(newWidth, 0));
      return oldWidth !== newWidth;
    }
    function dragHandler(eventData, transform, x2, y3) {
      var target = transform.target, newLeft = x2 - transform.offsetX, newTop = y3 - transform.offsetY, moveX = !target.get("lockMovementX") && target.left !== newLeft, moveY = !target.get("lockMovementY") && target.top !== newTop;
      moveX && target.set("left", newLeft);
      moveY && target.set("top", newTop);
      if (moveX || moveY) {
        fireEvent("moving", commonEventInfo(eventData, transform, x2, y3));
      }
      return moveX || moveY;
    }
    controls.scaleCursorStyleHandler = scaleCursorStyleHandler;
    controls.skewCursorStyleHandler = skewCursorStyleHandler;
    controls.scaleSkewCursorStyleHandler = scaleSkewCursorStyleHandler;
    controls.rotationWithSnapping = wrapWithFireEvent("rotating", wrapWithFixedAnchor(rotationWithSnapping));
    controls.scalingEqually = wrapWithFireEvent("scaling", wrapWithFixedAnchor(scaleObjectFromCorner));
    controls.scalingX = wrapWithFireEvent("scaling", wrapWithFixedAnchor(scaleObjectX));
    controls.scalingY = wrapWithFireEvent("scaling", wrapWithFixedAnchor(scaleObjectY));
    controls.scalingYOrSkewingX = scalingYOrSkewingX;
    controls.scalingXOrSkewingY = scalingXOrSkewingY;
    controls.changeWidth = wrapWithFireEvent("resizing", wrapWithFixedAnchor(changeWidth));
    controls.skewHandlerX = skewHandlerX;
    controls.skewHandlerY = skewHandlerY;
    controls.dragHandler = dragHandler;
    controls.scaleOrSkewActionName = scaleOrSkewActionName;
    controls.rotationStyleHandler = rotationStyleHandler;
    controls.fireEvent = fireEvent;
    controls.wrapWithFixedAnchor = wrapWithFixedAnchor;
    controls.wrapWithFireEvent = wrapWithFireEvent;
    controls.getLocalPoint = getLocalPoint;
    fabric3.controlsUtils = controls;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), degreesToRadians = fabric3.util.degreesToRadians, controls = fabric3.controlsUtils;
    function renderCircleControl(ctx, left, top, styleOverride, fabricObject) {
      styleOverride = styleOverride || {};
      var xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize, ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize, transparentCorners = typeof styleOverride.transparentCorners !== "undefined" ? styleOverride.transparentCorners : fabricObject.transparentCorners, methodName = transparentCorners ? "stroke" : "fill", stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor), myLeft = left, myTop = top, size;
      ctx.save();
      ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
      ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
      if (xSize > ySize) {
        size = xSize;
        ctx.scale(1, ySize / xSize);
        myTop = top * xSize / ySize;
      } else if (ySize > xSize) {
        size = ySize;
        ctx.scale(xSize / ySize, 1);
        myLeft = left * ySize / xSize;
      } else {
        size = xSize;
      }
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(myLeft, myTop, size / 2, 0, 2 * Math.PI, false);
      ctx[methodName]();
      if (stroke) {
        ctx.stroke();
      }
      ctx.restore();
    }
    function renderSquareControl(ctx, left, top, styleOverride, fabricObject) {
      styleOverride = styleOverride || {};
      var xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize, ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize, transparentCorners = typeof styleOverride.transparentCorners !== "undefined" ? styleOverride.transparentCorners : fabricObject.transparentCorners, methodName = transparentCorners ? "stroke" : "fill", stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor), xSizeBy2 = xSize / 2, ySizeBy2 = ySize / 2;
      ctx.save();
      ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor;
      ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor;
      ctx.lineWidth = 1;
      ctx.translate(left, top);
      ctx.rotate(degreesToRadians(fabricObject.angle));
      ctx[methodName + "Rect"](-xSizeBy2, -ySizeBy2, xSize, ySize);
      if (stroke) {
        ctx.strokeRect(-xSizeBy2, -ySizeBy2, xSize, ySize);
      }
      ctx.restore();
    }
    controls.renderCircleControl = renderCircleControl;
    controls.renderSquareControl = renderSquareControl;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    function Control(options) {
      for (var i2 in options) {
        this[i2] = options[i2];
      }
    }
    fabric3.Control = Control;
    fabric3.Control.prototype = {
      visible: true,
      actionName: "scale",
      angle: 0,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      sizeX: null,
      sizeY: null,
      touchSizeX: null,
      touchSizeY: null,
      cursorStyle: "crosshair",
      withConnection: false,
      actionHandler: function() {
      },
      mouseDownHandler: function() {
      },
      mouseUpHandler: function() {
      },
      getActionHandler: function() {
        return this.actionHandler;
      },
      getMouseDownHandler: function() {
        return this.mouseDownHandler;
      },
      getMouseUpHandler: function() {
        return this.mouseUpHandler;
      },
      cursorStyleHandler: function(eventData, control) {
        return control.cursorStyle;
      },
      getActionName: function(eventData, control) {
        return control.actionName;
      },
      getVisibility: function(fabricObject, controlKey) {
        var objectVisibility = fabricObject._controlsVisibility;
        if (objectVisibility && typeof objectVisibility[controlKey] !== "undefined") {
          return objectVisibility[controlKey];
        }
        return this.visible;
      },
      setVisibility: function(visibility) {
        this.visible = visibility;
      },
      positionHandler: function(dim, finalMatrix) {
        var point = fabric3.util.transformPoint({
          x: this.x * dim.x + this.offsetX,
          y: this.y * dim.y + this.offsetY
        }, finalMatrix);
        return point;
      },
      calcCornerCoords: function(objectAngle, objectCornerSize, centerX, centerY, isTouch) {
        var cosHalfOffset, sinHalfOffset, cosHalfOffsetComp, sinHalfOffsetComp, xSize = isTouch ? this.touchSizeX : this.sizeX, ySize = isTouch ? this.touchSizeY : this.sizeY;
        if (xSize && ySize && xSize !== ySize) {
          var controlTriangleAngle = Math.atan2(ySize, xSize);
          var cornerHypotenuse = Math.sqrt(xSize * xSize + ySize * ySize) / 2;
          var newTheta = controlTriangleAngle - fabric3.util.degreesToRadians(objectAngle);
          var newThetaComp = Math.PI / 2 - controlTriangleAngle - fabric3.util.degreesToRadians(objectAngle);
          cosHalfOffset = cornerHypotenuse * fabric3.util.cos(newTheta);
          sinHalfOffset = cornerHypotenuse * fabric3.util.sin(newTheta);
          cosHalfOffsetComp = cornerHypotenuse * fabric3.util.cos(newThetaComp);
          sinHalfOffsetComp = cornerHypotenuse * fabric3.util.sin(newThetaComp);
        } else {
          var cornerSize = xSize && ySize ? xSize : objectCornerSize;
          cornerHypotenuse = cornerSize * 0.7071067812;
          var newTheta = fabric3.util.degreesToRadians(45 - objectAngle);
          cosHalfOffset = cosHalfOffsetComp = cornerHypotenuse * fabric3.util.cos(newTheta);
          sinHalfOffset = sinHalfOffsetComp = cornerHypotenuse * fabric3.util.sin(newTheta);
        }
        return {
          tl: {
            x: centerX - sinHalfOffsetComp,
            y: centerY - cosHalfOffsetComp
          },
          tr: {
            x: centerX + cosHalfOffset,
            y: centerY - sinHalfOffset
          },
          bl: {
            x: centerX - cosHalfOffset,
            y: centerY + sinHalfOffset
          },
          br: {
            x: centerX + sinHalfOffsetComp,
            y: centerY + cosHalfOffsetComp
          }
        };
      },
      render: function(ctx, left, top, styleOverride, fabricObject) {
        styleOverride = styleOverride || {};
        switch (styleOverride.cornerStyle || fabricObject.cornerStyle) {
          case "circle":
            fabric3.controlsUtils.renderCircleControl.call(this, ctx, left, top, styleOverride, fabricObject);
            break;
          default:
            fabric3.controlsUtils.renderSquareControl.call(this, ctx, left, top, styleOverride, fabricObject);
        }
      }
    };
  })(exports);
  (function() {
    function getColorStop(el, multiplier) {
      var style = el.getAttribute("style"), offset = el.getAttribute("offset") || 0, color, colorAlpha, opacity, i2;
      offset = parseFloat(offset) / (/%$/.test(offset) ? 100 : 1);
      offset = offset < 0 ? 0 : offset > 1 ? 1 : offset;
      if (style) {
        var keyValuePairs = style.split(/\s*;\s*/);
        if (keyValuePairs[keyValuePairs.length - 1] === "") {
          keyValuePairs.pop();
        }
        for (i2 = keyValuePairs.length; i2--; ) {
          var split = keyValuePairs[i2].split(/\s*:\s*/), key = split[0].trim(), value = split[1].trim();
          if (key === "stop-color") {
            color = value;
          } else if (key === "stop-opacity") {
            opacity = value;
          }
        }
      }
      if (!color) {
        color = el.getAttribute("stop-color") || "rgb(0,0,0)";
      }
      if (!opacity) {
        opacity = el.getAttribute("stop-opacity");
      }
      color = new fabric2.Color(color);
      colorAlpha = color.getAlpha();
      opacity = isNaN(parseFloat(opacity)) ? 1 : parseFloat(opacity);
      opacity *= colorAlpha * multiplier;
      return {
        offset,
        color: color.toRgb(),
        opacity
      };
    }
    function getLinearCoords(el) {
      return {
        x1: el.getAttribute("x1") || 0,
        y1: el.getAttribute("y1") || 0,
        x2: el.getAttribute("x2") || "100%",
        y2: el.getAttribute("y2") || 0
      };
    }
    function getRadialCoords(el) {
      return {
        x1: el.getAttribute("fx") || el.getAttribute("cx") || "50%",
        y1: el.getAttribute("fy") || el.getAttribute("cy") || "50%",
        r1: 0,
        x2: el.getAttribute("cx") || "50%",
        y2: el.getAttribute("cy") || "50%",
        r2: el.getAttribute("r") || "50%"
      };
    }
    var clone = fabric2.util.object.clone;
    fabric2.Gradient = fabric2.util.createClass({
      offsetX: 0,
      offsetY: 0,
      gradientTransform: null,
      gradientUnits: "pixels",
      type: "linear",
      initialize: function(options) {
        options || (options = {});
        options.coords || (options.coords = {});
        var coords, _this = this;
        Object.keys(options).forEach(function(option) {
          _this[option] = options[option];
        });
        if (this.id) {
          this.id += "_" + fabric2.Object.__uid++;
        } else {
          this.id = fabric2.Object.__uid++;
        }
        coords = {
          x1: options.coords.x1 || 0,
          y1: options.coords.y1 || 0,
          x2: options.coords.x2 || 0,
          y2: options.coords.y2 || 0
        };
        if (this.type === "radial") {
          coords.r1 = options.coords.r1 || 0;
          coords.r2 = options.coords.r2 || 0;
        }
        this.coords = coords;
        this.colorStops = options.colorStops.slice();
      },
      addColorStop: function(colorStops) {
        for (var position in colorStops) {
          var color = new fabric2.Color(colorStops[position]);
          this.colorStops.push({
            offset: parseFloat(position),
            color: color.toRgb(),
            opacity: color.getAlpha()
          });
        }
        return this;
      },
      toObject: function(propertiesToInclude) {
        var object = {
          type: this.type,
          coords: this.coords,
          colorStops: this.colorStops,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          gradientUnits: this.gradientUnits,
          gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
        };
        fabric2.util.populateWithProperties(this, object, propertiesToInclude);
        return object;
      },
      toSVG: function(object, options) {
        var coords = clone(this.coords, true), i2, len, options = options || {}, markup, commonAttributes, colorStops = clone(this.colorStops, true), needsSwap = coords.r1 > coords.r2, transform = this.gradientTransform ? this.gradientTransform.concat() : fabric2.iMatrix.concat(), offsetX = -this.offsetX, offsetY = -this.offsetY, withViewport = !!options.additionalTransform, gradientUnits = this.gradientUnits === "pixels" ? "userSpaceOnUse" : "objectBoundingBox";
        colorStops.sort(function(a3, b2) {
          return a3.offset - b2.offset;
        });
        if (gradientUnits === "objectBoundingBox") {
          offsetX /= object.width;
          offsetY /= object.height;
        } else {
          offsetX += object.width / 2;
          offsetY += object.height / 2;
        }
        if (object.type === "path" && this.gradientUnits !== "percentage") {
          offsetX -= object.pathOffset.x;
          offsetY -= object.pathOffset.y;
        }
        transform[4] -= offsetX;
        transform[5] -= offsetY;
        commonAttributes = 'id="SVGID_' + this.id + '" gradientUnits="' + gradientUnits + '"';
        commonAttributes += ' gradientTransform="' + (withViewport ? options.additionalTransform + " " : "") + fabric2.util.matrixToSVG(transform) + '" ';
        if (this.type === "linear") {
          markup = [
            "<linearGradient ",
            commonAttributes,
            ' x1="',
            coords.x1,
            '" y1="',
            coords.y1,
            '" x2="',
            coords.x2,
            '" y2="',
            coords.y2,
            '">\n'
          ];
        } else if (this.type === "radial") {
          markup = [
            "<radialGradient ",
            commonAttributes,
            ' cx="',
            needsSwap ? coords.x1 : coords.x2,
            '" cy="',
            needsSwap ? coords.y1 : coords.y2,
            '" r="',
            needsSwap ? coords.r1 : coords.r2,
            '" fx="',
            needsSwap ? coords.x2 : coords.x1,
            '" fy="',
            needsSwap ? coords.y2 : coords.y1,
            '">\n'
          ];
        }
        if (this.type === "radial") {
          if (needsSwap) {
            colorStops = colorStops.concat();
            colorStops.reverse();
            for (i2 = 0, len = colorStops.length; i2 < len; i2++) {
              colorStops[i2].offset = 1 - colorStops[i2].offset;
            }
          }
          var minRadius = Math.min(coords.r1, coords.r2);
          if (minRadius > 0) {
            var maxRadius = Math.max(coords.r1, coords.r2), percentageShift = minRadius / maxRadius;
            for (i2 = 0, len = colorStops.length; i2 < len; i2++) {
              colorStops[i2].offset += percentageShift * (1 - colorStops[i2].offset);
            }
          }
        }
        for (i2 = 0, len = colorStops.length; i2 < len; i2++) {
          var colorStop = colorStops[i2];
          markup.push(
            "<stop ",
            'offset="',
            colorStop.offset * 100 + "%",
            '" style="stop-color:',
            colorStop.color,
            typeof colorStop.opacity !== "undefined" ? ";stop-opacity: " + colorStop.opacity : ";",
            '"/>\n'
          );
        }
        markup.push(this.type === "linear" ? "</linearGradient>\n" : "</radialGradient>\n");
        return markup.join("");
      },
      toLive: function(ctx) {
        var gradient, coords = fabric2.util.object.clone(this.coords), i2, len;
        if (!this.type) {
          return;
        }
        if (this.type === "linear") {
          gradient = ctx.createLinearGradient(
            coords.x1,
            coords.y1,
            coords.x2,
            coords.y2
          );
        } else if (this.type === "radial") {
          gradient = ctx.createRadialGradient(
            coords.x1,
            coords.y1,
            coords.r1,
            coords.x2,
            coords.y2,
            coords.r2
          );
        }
        for (i2 = 0, len = this.colorStops.length; i2 < len; i2++) {
          var color = this.colorStops[i2].color, opacity = this.colorStops[i2].opacity, offset = this.colorStops[i2].offset;
          if (typeof opacity !== "undefined") {
            color = new fabric2.Color(color).setAlpha(opacity).toRgba();
          }
          gradient.addColorStop(offset, color);
        }
        return gradient;
      }
    });
    fabric2.util.object.extend(fabric2.Gradient, {
      fromElement: function(el, instance, opacityAttr, svgOptions) {
        var multiplier = parseFloat(opacityAttr) / (/%$/.test(opacityAttr) ? 100 : 1);
        multiplier = multiplier < 0 ? 0 : multiplier > 1 ? 1 : multiplier;
        if (isNaN(multiplier)) {
          multiplier = 1;
        }
        var colorStopEls = el.getElementsByTagName("stop"), type, gradientUnits = el.getAttribute("gradientUnits") === "userSpaceOnUse" ? "pixels" : "percentage", gradientTransform = el.getAttribute("gradientTransform") || "", colorStops = [], coords, i2, offsetX = 0, offsetY = 0, transformMatrix;
        if (el.nodeName === "linearGradient" || el.nodeName === "LINEARGRADIENT") {
          type = "linear";
          coords = getLinearCoords(el);
        } else {
          type = "radial";
          coords = getRadialCoords(el);
        }
        for (i2 = colorStopEls.length; i2--; ) {
          colorStops.push(getColorStop(colorStopEls[i2], multiplier));
        }
        transformMatrix = fabric2.parseTransformAttribute(gradientTransform);
        __convertPercentUnitsToValues(instance, coords, svgOptions, gradientUnits);
        if (gradientUnits === "pixels") {
          offsetX = -instance.left;
          offsetY = -instance.top;
        }
        var gradient = new fabric2.Gradient({
          id: el.getAttribute("id"),
          type,
          coords,
          colorStops,
          gradientUnits,
          gradientTransform: transformMatrix,
          offsetX,
          offsetY
        });
        return gradient;
      }
    });
    function __convertPercentUnitsToValues(instance, options, svgOptions, gradientUnits) {
      var propValue, finalValue;
      Object.keys(options).forEach(function(prop) {
        propValue = options[prop];
        if (propValue === "Infinity") {
          finalValue = 1;
        } else if (propValue === "-Infinity") {
          finalValue = 0;
        } else {
          finalValue = parseFloat(options[prop], 10);
          if (typeof propValue === "string" && /^(\d+\.\d+)%|(\d+)%$/.test(propValue)) {
            finalValue *= 0.01;
            if (gradientUnits === "pixels") {
              if (prop === "x1" || prop === "x2" || prop === "r2") {
                finalValue *= svgOptions.viewBoxWidth || svgOptions.width;
              }
              if (prop === "y1" || prop === "y2") {
                finalValue *= svgOptions.viewBoxHeight || svgOptions.height;
              }
            }
          }
        }
        options[prop] = finalValue;
      });
    }
  })();
  (function() {
    var toFixed = fabric2.util.toFixed;
    fabric2.Pattern = fabric2.util.createClass({
      repeat: "repeat",
      offsetX: 0,
      offsetY: 0,
      crossOrigin: "",
      patternTransform: null,
      initialize: function(options, callback) {
        options || (options = {});
        this.id = fabric2.Object.__uid++;
        this.setOptions(options);
        if (!options.source || options.source && typeof options.source !== "string") {
          callback && callback(this);
          return;
        } else {
          var _this = this;
          this.source = fabric2.util.createImage();
          fabric2.util.loadImage(options.source, function(img, isError) {
            _this.source = img;
            callback && callback(_this, isError);
          }, null, this.crossOrigin);
        }
      },
      toObject: function(propertiesToInclude) {
        var NUM_FRACTION_DIGITS = fabric2.Object.NUM_FRACTION_DIGITS, source, object;
        if (typeof this.source.src === "string") {
          source = this.source.src;
        } else if (typeof this.source === "object" && this.source.toDataURL) {
          source = this.source.toDataURL();
        }
        object = {
          type: "pattern",
          source,
          repeat: this.repeat,
          crossOrigin: this.crossOrigin,
          offsetX: toFixed(this.offsetX, NUM_FRACTION_DIGITS),
          offsetY: toFixed(this.offsetY, NUM_FRACTION_DIGITS),
          patternTransform: this.patternTransform ? this.patternTransform.concat() : null
        };
        fabric2.util.populateWithProperties(this, object, propertiesToInclude);
        return object;
      },
      toSVG: function(object) {
        var patternSource = typeof this.source === "function" ? this.source() : this.source, patternWidth = patternSource.width / object.width, patternHeight = patternSource.height / object.height, patternOffsetX = this.offsetX / object.width, patternOffsetY = this.offsetY / object.height, patternImgSrc = "";
        if (this.repeat === "repeat-x" || this.repeat === "no-repeat") {
          patternHeight = 1;
          if (patternOffsetY) {
            patternHeight += Math.abs(patternOffsetY);
          }
        }
        if (this.repeat === "repeat-y" || this.repeat === "no-repeat") {
          patternWidth = 1;
          if (patternOffsetX) {
            patternWidth += Math.abs(patternOffsetX);
          }
        }
        if (patternSource.src) {
          patternImgSrc = patternSource.src;
        } else if (patternSource.toDataURL) {
          patternImgSrc = patternSource.toDataURL();
        }
        return '<pattern id="SVGID_' + this.id + '" x="' + patternOffsetX + '" y="' + patternOffsetY + '" width="' + patternWidth + '" height="' + patternHeight + '">\n<image x="0" y="0" width="' + patternSource.width + '" height="' + patternSource.height + '" xlink:href="' + patternImgSrc + '"></image>\n</pattern>\n';
      },
      setOptions: function(options) {
        for (var prop in options) {
          this[prop] = options[prop];
        }
      },
      toLive: function(ctx) {
        var source = this.source;
        if (!source) {
          return "";
        }
        if (typeof source.src !== "undefined") {
          if (!source.complete) {
            return "";
          }
          if (source.naturalWidth === 0 || source.naturalHeight === 0) {
            return "";
          }
        }
        return ctx.createPattern(source, this.repeat);
      }
    });
  })();
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), toFixed = fabric3.util.toFixed;
    if (fabric3.Shadow) {
      fabric3.warn("fabric.Shadow is already defined.");
      return;
    }
    fabric3.Shadow = fabric3.util.createClass({
      color: "rgb(0,0,0)",
      blur: 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: false,
      includeDefaultValues: true,
      nonScaling: false,
      initialize: function(options) {
        if (typeof options === "string") {
          options = this._parseShadow(options);
        }
        for (var prop in options) {
          this[prop] = options[prop];
        }
        this.id = fabric3.Object.__uid++;
      },
      _parseShadow: function(shadow) {
        var shadowStr = shadow.trim(), offsetsAndBlur = fabric3.Shadow.reOffsetsAndBlur.exec(shadowStr) || [], color = shadowStr.replace(fabric3.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
        return {
          color: color.trim(),
          offsetX: parseFloat(offsetsAndBlur[1], 10) || 0,
          offsetY: parseFloat(offsetsAndBlur[2], 10) || 0,
          blur: parseFloat(offsetsAndBlur[3], 10) || 0
        };
      },
      toString: function() {
        return [this.offsetX, this.offsetY, this.blur, this.color].join("px ");
      },
      toSVG: function(object) {
        var fBoxX = 40, fBoxY = 40, NUM_FRACTION_DIGITS = fabric3.Object.NUM_FRACTION_DIGITS, offset = fabric3.util.rotateVector(
          { x: this.offsetX, y: this.offsetY },
          fabric3.util.degreesToRadians(-object.angle)
        ), BLUR_BOX = 20, color = new fabric3.Color(this.color);
        if (object.width && object.height) {
          fBoxX = toFixed((Math.abs(offset.x) + this.blur) / object.width, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
          fBoxY = toFixed((Math.abs(offset.y) + this.blur) / object.height, NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
        }
        if (object.flipX) {
          offset.x *= -1;
        }
        if (object.flipY) {
          offset.y *= -1;
        }
        return '<filter id="SVGID_' + this.id + '" y="-' + fBoxY + '%" height="' + (100 + 2 * fBoxY) + '%" x="-' + fBoxX + '%" width="' + (100 + 2 * fBoxX) + '%" >\n	<feGaussianBlur in="SourceAlpha" stdDeviation="' + toFixed(this.blur ? this.blur / 2 : 0, NUM_FRACTION_DIGITS) + '"></feGaussianBlur>\n	<feOffset dx="' + toFixed(offset.x, NUM_FRACTION_DIGITS) + '" dy="' + toFixed(offset.y, NUM_FRACTION_DIGITS) + '" result="oBlur" ></feOffset>\n	<feFlood flood-color="' + color.toRgb() + '" flood-opacity="' + color.getAlpha() + '"/>\n	<feComposite in2="oBlur" operator="in" />\n	<feMerge>\n		<feMergeNode></feMergeNode>\n		<feMergeNode in="SourceGraphic"></feMergeNode>\n	</feMerge>\n</filter>\n';
      },
      toObject: function() {
        if (this.includeDefaultValues) {
          return {
            color: this.color,
            blur: this.blur,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            affectStroke: this.affectStroke,
            nonScaling: this.nonScaling
          };
        }
        var obj = {}, proto = fabric3.Shadow.prototype;
        ["color", "blur", "offsetX", "offsetY", "affectStroke", "nonScaling"].forEach(function(prop) {
          if (this[prop] !== proto[prop]) {
            obj[prop] = this[prop];
          }
        }, this);
        return obj;
      }
    });
    fabric3.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/;
  })(exports);
  (function() {
    if (fabric2.StaticCanvas) {
      fabric2.warn("fabric.StaticCanvas is already defined.");
      return;
    }
    var extend = fabric2.util.object.extend, getElementOffset = fabric2.util.getElementOffset, removeFromArray = fabric2.util.removeFromArray, toFixed = fabric2.util.toFixed, transformPoint = fabric2.util.transformPoint, invertTransform = fabric2.util.invertTransform, getNodeCanvas = fabric2.util.getNodeCanvas, createCanvasElement = fabric2.util.createCanvasElement, CANVAS_INIT_ERROR = new Error("Could not initialize `canvas` element");
    fabric2.StaticCanvas = fabric2.util.createClass(fabric2.CommonMethods, {
      initialize: function(el, options) {
        options || (options = {});
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._initStatic(el, options);
      },
      backgroundColor: "",
      backgroundImage: null,
      overlayColor: "",
      overlayImage: null,
      includeDefaultValues: true,
      stateful: false,
      renderOnAddRemove: true,
      controlsAboveOverlay: false,
      allowTouchScrolling: false,
      imageSmoothingEnabled: true,
      viewportTransform: fabric2.iMatrix.concat(),
      backgroundVpt: true,
      overlayVpt: true,
      enableRetinaScaling: true,
      vptCoords: {},
      skipOffscreen: true,
      clipPath: void 0,
      _initStatic: function(el, options) {
        var cb = this.requestRenderAllBound;
        this._objects = [];
        this._createLowerCanvas(el);
        this._initOptions(options);
        if (!this.interactive) {
          this._initRetinaScaling();
        }
        if (options.overlayImage) {
          this.setOverlayImage(options.overlayImage, cb);
        }
        if (options.backgroundImage) {
          this.setBackgroundImage(options.backgroundImage, cb);
        }
        if (options.backgroundColor) {
          this.setBackgroundColor(options.backgroundColor, cb);
        }
        if (options.overlayColor) {
          this.setOverlayColor(options.overlayColor, cb);
        }
        this.calcOffset();
      },
      _isRetinaScaling: function() {
        return fabric2.devicePixelRatio > 1 && this.enableRetinaScaling;
      },
      getRetinaScaling: function() {
        return this._isRetinaScaling() ? Math.max(1, fabric2.devicePixelRatio) : 1;
      },
      _initRetinaScaling: function() {
        if (!this._isRetinaScaling()) {
          return;
        }
        var scaleRatio = fabric2.devicePixelRatio;
        this.__initRetinaScaling(scaleRatio, this.lowerCanvasEl, this.contextContainer);
        if (this.upperCanvasEl) {
          this.__initRetinaScaling(scaleRatio, this.upperCanvasEl, this.contextTop);
        }
      },
      __initRetinaScaling: function(scaleRatio, canvas, context) {
        canvas.setAttribute("width", this.width * scaleRatio);
        canvas.setAttribute("height", this.height * scaleRatio);
        context.scale(scaleRatio, scaleRatio);
      },
      calcOffset: function() {
        this._offset = getElementOffset(this.lowerCanvasEl);
        return this;
      },
      setOverlayImage: function(image, callback, options) {
        return this.__setBgOverlayImage("overlayImage", image, callback, options);
      },
      setBackgroundImage: function(image, callback, options) {
        return this.__setBgOverlayImage("backgroundImage", image, callback, options);
      },
      setOverlayColor: function(overlayColor, callback) {
        return this.__setBgOverlayColor("overlayColor", overlayColor, callback);
      },
      setBackgroundColor: function(backgroundColor, callback) {
        return this.__setBgOverlayColor("backgroundColor", backgroundColor, callback);
      },
      __setBgOverlayImage: function(property, image, callback, options) {
        if (typeof image === "string") {
          fabric2.util.loadImage(image, function(img, isError) {
            if (img) {
              var instance = new fabric2.Image(img, options);
              this[property] = instance;
              instance.canvas = this;
            }
            callback && callback(img, isError);
          }, this, options && options.crossOrigin);
        } else {
          options && image.setOptions(options);
          this[property] = image;
          image && (image.canvas = this);
          callback && callback(image, false);
        }
        return this;
      },
      __setBgOverlayColor: function(property, color, callback) {
        this[property] = color;
        this._initGradient(color, property);
        this._initPattern(color, property, callback);
        return this;
      },
      _createCanvasElement: function() {
        var element = createCanvasElement();
        if (!element) {
          throw CANVAS_INIT_ERROR;
        }
        if (!element.style) {
          element.style = {};
        }
        if (typeof element.getContext === "undefined") {
          throw CANVAS_INIT_ERROR;
        }
        return element;
      },
      _initOptions: function(options) {
        var lowerCanvasEl = this.lowerCanvasEl;
        this._setOptions(options);
        this.width = this.width || parseInt(lowerCanvasEl.width, 10) || 0;
        this.height = this.height || parseInt(lowerCanvasEl.height, 10) || 0;
        if (!this.lowerCanvasEl.style) {
          return;
        }
        lowerCanvasEl.width = this.width;
        lowerCanvasEl.height = this.height;
        lowerCanvasEl.style.width = this.width + "px";
        lowerCanvasEl.style.height = this.height + "px";
        this.viewportTransform = this.viewportTransform.slice();
      },
      _createLowerCanvas: function(canvasEl) {
        if (canvasEl && canvasEl.getContext) {
          this.lowerCanvasEl = canvasEl;
        } else {
          this.lowerCanvasEl = fabric2.util.getById(canvasEl) || this._createCanvasElement();
        }
        fabric2.util.addClass(this.lowerCanvasEl, "lower-canvas");
        this._originalCanvasStyle = this.lowerCanvasEl.style;
        if (this.interactive) {
          this._applyCanvasStyle(this.lowerCanvasEl);
        }
        this.contextContainer = this.lowerCanvasEl.getContext("2d");
      },
      getWidth: function() {
        return this.width;
      },
      getHeight: function() {
        return this.height;
      },
      setWidth: function(value, options) {
        return this.setDimensions({ width: value }, options);
      },
      setHeight: function(value, options) {
        return this.setDimensions({ height: value }, options);
      },
      setDimensions: function(dimensions, options) {
        var cssValue;
        options = options || {};
        for (var prop in dimensions) {
          cssValue = dimensions[prop];
          if (!options.cssOnly) {
            this._setBackstoreDimension(prop, dimensions[prop]);
            cssValue += "px";
            this.hasLostContext = true;
          }
          if (!options.backstoreOnly) {
            this._setCssDimension(prop, cssValue);
          }
        }
        if (this._isCurrentlyDrawing) {
          this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(this.contextTop);
        }
        this._initRetinaScaling();
        this.calcOffset();
        if (!options.cssOnly) {
          this.requestRenderAll();
        }
        return this;
      },
      _setBackstoreDimension: function(prop, value) {
        this.lowerCanvasEl[prop] = value;
        if (this.upperCanvasEl) {
          this.upperCanvasEl[prop] = value;
        }
        if (this.cacheCanvasEl) {
          this.cacheCanvasEl[prop] = value;
        }
        this[prop] = value;
        return this;
      },
      _setCssDimension: function(prop, value) {
        this.lowerCanvasEl.style[prop] = value;
        if (this.upperCanvasEl) {
          this.upperCanvasEl.style[prop] = value;
        }
        if (this.wrapperEl) {
          this.wrapperEl.style[prop] = value;
        }
        return this;
      },
      getZoom: function() {
        return this.viewportTransform[0];
      },
      setViewportTransform: function(vpt) {
        var activeObject = this._activeObject, backgroundObject = this.backgroundImage, overlayObject = this.overlayImage, object, i2, len;
        this.viewportTransform = vpt;
        for (i2 = 0, len = this._objects.length; i2 < len; i2++) {
          object = this._objects[i2];
          object.group || object.setCoords(true);
        }
        if (activeObject) {
          activeObject.setCoords();
        }
        if (backgroundObject) {
          backgroundObject.setCoords(true);
        }
        if (overlayObject) {
          overlayObject.setCoords(true);
        }
        this.calcViewportBoundaries();
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      zoomToPoint: function(point, value) {
        var before = point, vpt = this.viewportTransform.slice(0);
        point = transformPoint(point, invertTransform(this.viewportTransform));
        vpt[0] = value;
        vpt[3] = value;
        var after = transformPoint(point, vpt);
        vpt[4] += before.x - after.x;
        vpt[5] += before.y - after.y;
        return this.setViewportTransform(vpt);
      },
      setZoom: function(value) {
        this.zoomToPoint(new fabric2.Point(0, 0), value);
        return this;
      },
      absolutePan: function(point) {
        var vpt = this.viewportTransform.slice(0);
        vpt[4] = -point.x;
        vpt[5] = -point.y;
        return this.setViewportTransform(vpt);
      },
      relativePan: function(point) {
        return this.absolutePan(new fabric2.Point(
          -point.x - this.viewportTransform[4],
          -point.y - this.viewportTransform[5]
        ));
      },
      getElement: function() {
        return this.lowerCanvasEl;
      },
      _onObjectAdded: function(obj) {
        this.stateful && obj.setupState();
        obj._set("canvas", this);
        obj.setCoords();
        this.fire("object:added", { target: obj });
        obj.fire("added");
      },
      _onObjectRemoved: function(obj) {
        this.fire("object:removed", { target: obj });
        obj.fire("removed");
        delete obj.canvas;
      },
      clearContext: function(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        return this;
      },
      getContext: function() {
        return this.contextContainer;
      },
      clear: function() {
        this.remove.apply(this, this.getObjects());
        this.backgroundImage = null;
        this.overlayImage = null;
        this.backgroundColor = "";
        this.overlayColor = "";
        if (this._hasITextHandlers) {
          this.off("mouse:up", this._mouseUpITextHandler);
          this._iTextInstances = null;
          this._hasITextHandlers = false;
        }
        this.clearContext(this.contextContainer);
        this.fire("canvas:cleared");
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      renderAll: function() {
        var canvasToDrawOn = this.contextContainer;
        this.renderCanvas(canvasToDrawOn, this._objects);
        return this;
      },
      renderAndReset: function() {
        this.isRendering = 0;
        this.renderAll();
      },
      requestRenderAll: function() {
        if (!this.isRendering) {
          this.isRendering = fabric2.util.requestAnimFrame(this.renderAndResetBound);
        }
        return this;
      },
      calcViewportBoundaries: function() {
        var points = {}, width = this.width, height = this.height, iVpt = invertTransform(this.viewportTransform);
        points.tl = transformPoint({ x: 0, y: 0 }, iVpt);
        points.br = transformPoint({ x: width, y: height }, iVpt);
        points.tr = new fabric2.Point(points.br.x, points.tl.y);
        points.bl = new fabric2.Point(points.tl.x, points.br.y);
        this.vptCoords = points;
        return points;
      },
      cancelRequestedRender: function() {
        if (this.isRendering) {
          fabric2.util.cancelAnimFrame(this.isRendering);
          this.isRendering = 0;
        }
      },
      renderCanvas: function(ctx, objects) {
        var v = this.viewportTransform, path = this.clipPath;
        this.cancelRequestedRender();
        this.calcViewportBoundaries();
        this.clearContext(ctx);
        fabric2.util.setImageSmoothing(ctx, this.imageSmoothingEnabled);
        this.fire("before:render", { ctx });
        this._renderBackground(ctx);
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        this._renderObjects(ctx, objects);
        ctx.restore();
        if (!this.controlsAboveOverlay && this.interactive) {
          this.drawControls(ctx);
        }
        if (path) {
          path.canvas = this;
          path.shouldCache();
          path._transformDone = true;
          path.renderCache({ forClipping: true });
          this.drawClipPathOnCanvas(ctx);
        }
        this._renderOverlay(ctx);
        if (this.controlsAboveOverlay && this.interactive) {
          this.drawControls(ctx);
        }
        this.fire("after:render", { ctx });
      },
      drawClipPathOnCanvas: function(ctx) {
        var v = this.viewportTransform, path = this.clipPath;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        ctx.globalCompositeOperation = "destination-in";
        path.transform(ctx);
        ctx.scale(1 / path.zoomX, 1 / path.zoomY);
        ctx.drawImage(path._cacheCanvas, -path.cacheTranslationX, -path.cacheTranslationY);
        ctx.restore();
      },
      _renderObjects: function(ctx, objects) {
        var i2, len;
        for (i2 = 0, len = objects.length; i2 < len; ++i2) {
          objects[i2] && objects[i2].render(ctx);
        }
      },
      _renderBackgroundOrOverlay: function(ctx, property) {
        var fill = this[property + "Color"], object = this[property + "Image"], v = this.viewportTransform, needsVpt = this[property + "Vpt"];
        if (!fill && !object) {
          return;
        }
        if (fill) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(this.width, 0);
          ctx.lineTo(this.width, this.height);
          ctx.lineTo(0, this.height);
          ctx.closePath();
          ctx.fillStyle = fill.toLive ? fill.toLive(ctx, this) : fill;
          if (needsVpt) {
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
          }
          ctx.transform(1, 0, 0, 1, fill.offsetX || 0, fill.offsetY || 0);
          var m3 = fill.gradientTransform || fill.patternTransform;
          m3 && ctx.transform(m3[0], m3[1], m3[2], m3[3], m3[4], m3[5]);
          ctx.fill();
          ctx.restore();
        }
        if (object) {
          ctx.save();
          if (needsVpt) {
            ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
          }
          object.render(ctx);
          ctx.restore();
        }
      },
      _renderBackground: function(ctx) {
        this._renderBackgroundOrOverlay(ctx, "background");
      },
      _renderOverlay: function(ctx) {
        this._renderBackgroundOrOverlay(ctx, "overlay");
      },
      getCenter: function() {
        return {
          top: this.height / 2,
          left: this.width / 2
        };
      },
      getCenterPoint: function() {
        return new fabric2.Point(this.width / 2, this.height / 2);
      },
      centerObjectH: function(object) {
        return this._centerObject(object, new fabric2.Point(this.getCenterPoint().x, object.getCenterPoint().y));
      },
      centerObjectV: function(object) {
        return this._centerObject(object, new fabric2.Point(object.getCenterPoint().x, this.getCenterPoint().y));
      },
      centerObject: function(object) {
        var center = this.getCenterPoint();
        return this._centerObject(object, center);
      },
      viewportCenterObject: function(object) {
        var vpCenter = this.getVpCenter();
        return this._centerObject(object, vpCenter);
      },
      viewportCenterObjectH: function(object) {
        var vpCenter = this.getVpCenter();
        this._centerObject(object, new fabric2.Point(vpCenter.x, object.getCenterPoint().y));
        return this;
      },
      viewportCenterObjectV: function(object) {
        var vpCenter = this.getVpCenter();
        return this._centerObject(object, new fabric2.Point(object.getCenterPoint().x, vpCenter.y));
      },
      getVpCenter: function() {
        var center = this.getCenterPoint(), iVpt = invertTransform(this.viewportTransform);
        return transformPoint(center, iVpt);
      },
      _centerObject: function(object, center) {
        object.setPositionByOrigin(center, "center", "center");
        object.setCoords();
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      toDatalessJSON: function(propertiesToInclude) {
        return this.toDatalessObject(propertiesToInclude);
      },
      toObject: function(propertiesToInclude) {
        return this._toObjectMethod("toObject", propertiesToInclude);
      },
      toDatalessObject: function(propertiesToInclude) {
        return this._toObjectMethod("toDatalessObject", propertiesToInclude);
      },
      _toObjectMethod: function(methodName, propertiesToInclude) {
        var clipPath = this.clipPath, data = {
          version: fabric2.version,
          objects: this._toObjects(methodName, propertiesToInclude)
        };
        if (clipPath && !clipPath.excludeFromExport) {
          data.clipPath = this._toObject(this.clipPath, methodName, propertiesToInclude);
        }
        extend(data, this.__serializeBgOverlay(methodName, propertiesToInclude));
        fabric2.util.populateWithProperties(this, data, propertiesToInclude);
        return data;
      },
      _toObjects: function(methodName, propertiesToInclude) {
        return this._objects.filter(function(object) {
          return !object.excludeFromExport;
        }).map(function(instance) {
          return this._toObject(instance, methodName, propertiesToInclude);
        }, this);
      },
      _toObject: function(instance, methodName, propertiesToInclude) {
        var originalValue;
        if (!this.includeDefaultValues) {
          originalValue = instance.includeDefaultValues;
          instance.includeDefaultValues = false;
        }
        var object = instance[methodName](propertiesToInclude);
        if (!this.includeDefaultValues) {
          instance.includeDefaultValues = originalValue;
        }
        return object;
      },
      __serializeBgOverlay: function(methodName, propertiesToInclude) {
        var data = {}, bgImage = this.backgroundImage, overlayImage = this.overlayImage, bgColor = this.backgroundColor, overlayColor = this.overlayColor;
        if (bgColor && bgColor.toObject) {
          if (!bgColor.excludeFromExport) {
            data.background = bgColor.toObject(propertiesToInclude);
          }
        } else if (bgColor) {
          data.background = bgColor;
        }
        if (overlayColor && overlayColor.toObject) {
          if (!overlayColor.excludeFromExport) {
            data.overlay = overlayColor.toObject(propertiesToInclude);
          }
        } else if (overlayColor) {
          data.overlay = overlayColor;
        }
        if (bgImage && !bgImage.excludeFromExport) {
          data.backgroundImage = this._toObject(bgImage, methodName, propertiesToInclude);
        }
        if (overlayImage && !overlayImage.excludeFromExport) {
          data.overlayImage = this._toObject(overlayImage, methodName, propertiesToInclude);
        }
        return data;
      },
      svgViewportTransformation: true,
      toSVG: function(options, reviver) {
        options || (options = {});
        options.reviver = reviver;
        var markup = [];
        this._setSVGPreamble(markup, options);
        this._setSVGHeader(markup, options);
        if (this.clipPath) {
          markup.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n');
        }
        this._setSVGBgOverlayColor(markup, "background");
        this._setSVGBgOverlayImage(markup, "backgroundImage", reviver);
        this._setSVGObjects(markup, reviver);
        if (this.clipPath) {
          markup.push("</g>\n");
        }
        this._setSVGBgOverlayColor(markup, "overlay");
        this._setSVGBgOverlayImage(markup, "overlayImage", reviver);
        markup.push("</svg>");
        return markup.join("");
      },
      _setSVGPreamble: function(markup, options) {
        if (options.suppressPreamble) {
          return;
        }
        markup.push(
          '<?xml version="1.0" encoding="',
          options.encoding || "UTF-8",
          '" standalone="no" ?>\n',
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
          '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
        );
      },
      _setSVGHeader: function(markup, options) {
        var width = options.width || this.width, height = options.height || this.height, vpt, viewBox = 'viewBox="0 0 ' + this.width + " " + this.height + '" ', NUM_FRACTION_DIGITS = fabric2.Object.NUM_FRACTION_DIGITS;
        if (options.viewBox) {
          viewBox = 'viewBox="' + options.viewBox.x + " " + options.viewBox.y + " " + options.viewBox.width + " " + options.viewBox.height + '" ';
        } else {
          if (this.svgViewportTransformation) {
            vpt = this.viewportTransform;
            viewBox = 'viewBox="' + toFixed(-vpt[4] / vpt[0], NUM_FRACTION_DIGITS) + " " + toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS) + " " + toFixed(this.width / vpt[0], NUM_FRACTION_DIGITS) + " " + toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS) + '" ';
          }
        }
        markup.push(
          "<svg ",
          'xmlns="http://www.w3.org/2000/svg" ',
          'xmlns:xlink="http://www.w3.org/1999/xlink" ',
          'version="1.1" ',
          'width="',
          width,
          '" ',
          'height="',
          height,
          '" ',
          viewBox,
          'xml:space="preserve">\n',
          "<desc>Created with Fabric.js ",
          fabric2.version,
          "</desc>\n",
          "<defs>\n",
          this.createSVGFontFacesMarkup(),
          this.createSVGRefElementsMarkup(),
          this.createSVGClipPathMarkup(options),
          "</defs>\n"
        );
      },
      createSVGClipPathMarkup: function(options) {
        var clipPath = this.clipPath;
        if (clipPath) {
          clipPath.clipPathId = "CLIPPATH_" + fabric2.Object.__uid++;
          return '<clipPath id="' + clipPath.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(options.reviver) + "</clipPath>\n";
        }
        return "";
      },
      createSVGRefElementsMarkup: function() {
        var _this = this, markup = ["background", "overlay"].map(function(prop) {
          var fill = _this[prop + "Color"];
          if (fill && fill.toLive) {
            var shouldTransform = _this[prop + "Vpt"], vpt = _this.viewportTransform, object = {
              width: _this.width / (shouldTransform ? vpt[0] : 1),
              height: _this.height / (shouldTransform ? vpt[3] : 1)
            };
            return fill.toSVG(
              object,
              { additionalTransform: shouldTransform ? fabric2.util.matrixToSVG(vpt) : "" }
            );
          }
        });
        return markup.join("");
      },
      createSVGFontFacesMarkup: function() {
        var markup = "", fontList = {}, obj, fontFamily, style, row, rowIndex, _char, charIndex, i2, len, fontPaths = fabric2.fontPaths, objects = [];
        this._objects.forEach(function add(object) {
          objects.push(object);
          if (object._objects) {
            object._objects.forEach(add);
          }
        });
        for (i2 = 0, len = objects.length; i2 < len; i2++) {
          obj = objects[i2];
          fontFamily = obj.fontFamily;
          if (obj.type.indexOf("text") === -1 || fontList[fontFamily] || !fontPaths[fontFamily]) {
            continue;
          }
          fontList[fontFamily] = true;
          if (!obj.styles) {
            continue;
          }
          style = obj.styles;
          for (rowIndex in style) {
            row = style[rowIndex];
            for (charIndex in row) {
              _char = row[charIndex];
              fontFamily = _char.fontFamily;
              if (!fontList[fontFamily] && fontPaths[fontFamily]) {
                fontList[fontFamily] = true;
              }
            }
          }
        }
        for (var j in fontList) {
          markup += [
            "		@font-face {\n",
            "			font-family: '",
            j,
            "';\n",
            "			src: url('",
            fontPaths[j],
            "');\n",
            "		}\n"
          ].join("");
        }
        if (markup) {
          markup = [
            '	<style type="text/css">',
            "<![CDATA[\n",
            markup,
            "]]>",
            "</style>\n"
          ].join("");
        }
        return markup;
      },
      _setSVGObjects: function(markup, reviver) {
        var instance, i2, len, objects = this._objects;
        for (i2 = 0, len = objects.length; i2 < len; i2++) {
          instance = objects[i2];
          if (instance.excludeFromExport) {
            continue;
          }
          this._setSVGObject(markup, instance, reviver);
        }
      },
      _setSVGObject: function(markup, instance, reviver) {
        markup.push(instance.toSVG(reviver));
      },
      _setSVGBgOverlayImage: function(markup, property, reviver) {
        if (this[property] && !this[property].excludeFromExport && this[property].toSVG) {
          markup.push(this[property].toSVG(reviver));
        }
      },
      _setSVGBgOverlayColor: function(markup, property) {
        var filler = this[property + "Color"], vpt = this.viewportTransform, finalWidth = this.width, finalHeight = this.height;
        if (!filler) {
          return;
        }
        if (filler.toLive) {
          var repeat = filler.repeat, iVpt = fabric2.util.invertTransform(vpt), shouldInvert = this[property + "Vpt"], additionalTransform = shouldInvert ? fabric2.util.matrixToSVG(iVpt) : "";
          markup.push(
            '<rect transform="' + additionalTransform + " translate(",
            finalWidth / 2,
            ",",
            finalHeight / 2,
            ')"',
            ' x="',
            filler.offsetX - finalWidth / 2,
            '" y="',
            filler.offsetY - finalHeight / 2,
            '" ',
            'width="',
            repeat === "repeat-y" || repeat === "no-repeat" ? filler.source.width : finalWidth,
            '" height="',
            repeat === "repeat-x" || repeat === "no-repeat" ? filler.source.height : finalHeight,
            '" fill="url(#SVGID_' + filler.id + ')"',
            "></rect>\n"
          );
        } else {
          markup.push(
            '<rect x="0" y="0" width="100%" height="100%" ',
            'fill="',
            filler,
            '"',
            "></rect>\n"
          );
        }
      },
      sendToBack: function(object) {
        if (!object) {
          return this;
        }
        var activeSelection = this._activeObject, i2, obj, objs;
        if (object === activeSelection && object.type === "activeSelection") {
          objs = activeSelection._objects;
          for (i2 = objs.length; i2--; ) {
            obj = objs[i2];
            removeFromArray(this._objects, obj);
            this._objects.unshift(obj);
          }
        } else {
          removeFromArray(this._objects, object);
          this._objects.unshift(object);
        }
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      bringToFront: function(object) {
        if (!object) {
          return this;
        }
        var activeSelection = this._activeObject, i2, obj, objs;
        if (object === activeSelection && object.type === "activeSelection") {
          objs = activeSelection._objects;
          for (i2 = 0; i2 < objs.length; i2++) {
            obj = objs[i2];
            removeFromArray(this._objects, obj);
            this._objects.push(obj);
          }
        } else {
          removeFromArray(this._objects, object);
          this._objects.push(object);
        }
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      sendBackwards: function(object, intersecting) {
        if (!object) {
          return this;
        }
        var activeSelection = this._activeObject, i2, obj, idx, newIdx, objs, objsMoved = 0;
        if (object === activeSelection && object.type === "activeSelection") {
          objs = activeSelection._objects;
          for (i2 = 0; i2 < objs.length; i2++) {
            obj = objs[i2];
            idx = this._objects.indexOf(obj);
            if (idx > 0 + objsMoved) {
              newIdx = idx - 1;
              removeFromArray(this._objects, obj);
              this._objects.splice(newIdx, 0, obj);
            }
            objsMoved++;
          }
        } else {
          idx = this._objects.indexOf(object);
          if (idx !== 0) {
            newIdx = this._findNewLowerIndex(object, idx, intersecting);
            removeFromArray(this._objects, object);
            this._objects.splice(newIdx, 0, object);
          }
        }
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      _findNewLowerIndex: function(object, idx, intersecting) {
        var newIdx, i2;
        if (intersecting) {
          newIdx = idx;
          for (i2 = idx - 1; i2 >= 0; --i2) {
            var isIntersecting = object.intersectsWithObject(this._objects[i2]) || object.isContainedWithinObject(this._objects[i2]) || this._objects[i2].isContainedWithinObject(object);
            if (isIntersecting) {
              newIdx = i2;
              break;
            }
          }
        } else {
          newIdx = idx - 1;
        }
        return newIdx;
      },
      bringForward: function(object, intersecting) {
        if (!object) {
          return this;
        }
        var activeSelection = this._activeObject, i2, obj, idx, newIdx, objs, objsMoved = 0;
        if (object === activeSelection && object.type === "activeSelection") {
          objs = activeSelection._objects;
          for (i2 = objs.length; i2--; ) {
            obj = objs[i2];
            idx = this._objects.indexOf(obj);
            if (idx < this._objects.length - 1 - objsMoved) {
              newIdx = idx + 1;
              removeFromArray(this._objects, obj);
              this._objects.splice(newIdx, 0, obj);
            }
            objsMoved++;
          }
        } else {
          idx = this._objects.indexOf(object);
          if (idx !== this._objects.length - 1) {
            newIdx = this._findNewUpperIndex(object, idx, intersecting);
            removeFromArray(this._objects, object);
            this._objects.splice(newIdx, 0, object);
          }
        }
        this.renderOnAddRemove && this.requestRenderAll();
        return this;
      },
      _findNewUpperIndex: function(object, idx, intersecting) {
        var newIdx, i2, len;
        if (intersecting) {
          newIdx = idx;
          for (i2 = idx + 1, len = this._objects.length; i2 < len; ++i2) {
            var isIntersecting = object.intersectsWithObject(this._objects[i2]) || object.isContainedWithinObject(this._objects[i2]) || this._objects[i2].isContainedWithinObject(object);
            if (isIntersecting) {
              newIdx = i2;
              break;
            }
          }
        } else {
          newIdx = idx + 1;
        }
        return newIdx;
      },
      moveTo: function(object, index) {
        removeFromArray(this._objects, object);
        this._objects.splice(index, 0, object);
        return this.renderOnAddRemove && this.requestRenderAll();
      },
      dispose: function() {
        if (this.isRendering) {
          fabric2.util.cancelAnimFrame(this.isRendering);
          this.isRendering = 0;
        }
        this.forEachObject(function(object) {
          object.dispose && object.dispose();
        });
        this._objects = [];
        if (this.backgroundImage && this.backgroundImage.dispose) {
          this.backgroundImage.dispose();
        }
        this.backgroundImage = null;
        if (this.overlayImage && this.overlayImage.dispose) {
          this.overlayImage.dispose();
        }
        this.overlayImage = null;
        this._iTextInstances = null;
        this.contextContainer = null;
        this.lowerCanvasEl.classList.remove("lower-canvas");
        fabric2.util.setStyle(this.lowerCanvasEl, this._originalCanvasStyle);
        delete this._originalCanvasStyle;
        this.lowerCanvasEl.setAttribute("width", this.width);
        this.lowerCanvasEl.setAttribute("height", this.height);
        fabric2.util.cleanUpJsdomNode(this.lowerCanvasEl);
        this.lowerCanvasEl = void 0;
        return this;
      },
      toString: function() {
        return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this._objects.length + " }>";
      }
    });
    extend(fabric2.StaticCanvas.prototype, fabric2.Observable);
    extend(fabric2.StaticCanvas.prototype, fabric2.Collection);
    extend(fabric2.StaticCanvas.prototype, fabric2.DataURLExporter);
    extend(fabric2.StaticCanvas, {
      EMPTY_JSON: '{"objects": [], "background": "white"}',
      supports: function(methodName) {
        var el = createCanvasElement();
        if (!el || !el.getContext) {
          return null;
        }
        var ctx = el.getContext("2d");
        if (!ctx) {
          return null;
        }
        switch (methodName) {
          case "setLineDash":
            return typeof ctx.setLineDash !== "undefined";
          default:
            return null;
        }
      }
    });
    fabric2.StaticCanvas.prototype.toJSON = fabric2.StaticCanvas.prototype.toObject;
    if (fabric2.isLikelyNode) {
      fabric2.StaticCanvas.prototype.createPNGStream = function() {
        var impl = getNodeCanvas(this.lowerCanvasEl);
        return impl && impl.createPNGStream();
      };
      fabric2.StaticCanvas.prototype.createJPEGStream = function(opts) {
        var impl = getNodeCanvas(this.lowerCanvasEl);
        return impl && impl.createJPEGStream(opts);
      };
    }
  })();
  fabric2.BaseBrush = fabric2.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeMiterLimit: 10,
    strokeDashArray: null,
    limitedToCanvasSize: false,
    _setBrushStyles: function(ctx) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      ctx.lineCap = this.strokeLineCap;
      ctx.miterLimit = this.strokeMiterLimit;
      ctx.lineJoin = this.strokeLineJoin;
      ctx.setLineDash(this.strokeDashArray || []);
    },
    _saveAndTransform: function(ctx) {
      var v = this.canvas.viewportTransform;
      ctx.save();
      ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    },
    _setShadow: function() {
      if (!this.shadow) {
        return;
      }
      var canvas = this.canvas, shadow = this.shadow, ctx = canvas.contextTop, zoom = canvas.getZoom();
      if (canvas && canvas._isRetinaScaling()) {
        zoom *= fabric2.devicePixelRatio;
      }
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur * zoom;
      ctx.shadowOffsetX = shadow.offsetX * zoom;
      ctx.shadowOffsetY = shadow.offsetY * zoom;
    },
    needsFullRender: function() {
      var color = new fabric2.Color(this.color);
      return color.getAlpha() < 1 || !!this.shadow;
    },
    _resetShadow: function() {
      var ctx = this.canvas.contextTop;
      ctx.shadowColor = "";
      ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    },
    _isOutSideCanvas: function(pointer) {
      return pointer.x < 0 || pointer.x > this.canvas.getWidth() || pointer.y < 0 || pointer.y > this.canvas.getHeight();
    }
  });
  (function() {
    fabric2.PencilBrush = fabric2.util.createClass(fabric2.BaseBrush, {
      decimate: 0.4,
      drawStraightLine: false,
      straightLineKey: "shiftKey",
      initialize: function(canvas) {
        this.canvas = canvas;
        this._points = [];
      },
      needsFullRender: function() {
        return this.callSuper("needsFullRender") || this._hasStraightLine;
      },
      _drawSegment: function(ctx, p1, p2) {
        var midPoint = p1.midPointFrom(p2);
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        return midPoint;
      },
      onMouseDown: function(pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return;
        }
        this.drawStraightLine = options.e[this.straightLineKey];
        this._prepareForDrawing(pointer);
        this._captureDrawingPath(pointer);
        this._render();
      },
      onMouseMove: function(pointer, options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return;
        }
        this.drawStraightLine = options.e[this.straightLineKey];
        if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
          return;
        }
        if (this._captureDrawingPath(pointer) && this._points.length > 1) {
          if (this.needsFullRender()) {
            this.canvas.clearContext(this.canvas.contextTop);
            this._render();
          } else {
            var points = this._points, length = points.length, ctx = this.canvas.contextTop;
            this._saveAndTransform(ctx);
            if (this.oldEnd) {
              ctx.beginPath();
              ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
            }
            this.oldEnd = this._drawSegment(ctx, points[length - 2], points[length - 1], true);
            ctx.stroke();
            ctx.restore();
          }
        }
      },
      onMouseUp: function(options) {
        if (!this.canvas._isMainEvent(options.e)) {
          return true;
        }
        this.drawStraightLine = false;
        this.oldEnd = void 0;
        this._finalizeAndAddPath();
        return false;
      },
      _prepareForDrawing: function(pointer) {
        var p = new fabric2.Point(pointer.x, pointer.y);
        this._reset();
        this._addPoint(p);
        this.canvas.contextTop.moveTo(p.x, p.y);
      },
      _addPoint: function(point) {
        if (this._points.length > 1 && point.eq(this._points[this._points.length - 1])) {
          return false;
        }
        if (this.drawStraightLine && this._points.length > 1) {
          this._hasStraightLine = true;
          this._points.pop();
        }
        this._points.push(point);
        return true;
      },
      _reset: function() {
        this._points = [];
        this._setBrushStyles(this.canvas.contextTop);
        this._setShadow();
        this._hasStraightLine = false;
      },
      _captureDrawingPath: function(pointer) {
        var pointerPoint = new fabric2.Point(pointer.x, pointer.y);
        return this._addPoint(pointerPoint);
      },
      _render: function(ctx) {
        var i2, len, p1 = this._points[0], p2 = this._points[1];
        ctx = ctx || this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.beginPath();
        if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
          var width = this.width / 1e3;
          p1 = new fabric2.Point(p1.x, p1.y);
          p2 = new fabric2.Point(p2.x, p2.y);
          p1.x -= width;
          p2.x += width;
        }
        ctx.moveTo(p1.x, p1.y);
        for (i2 = 1, len = this._points.length; i2 < len; i2++) {
          this._drawSegment(ctx, p1, p2);
          p1 = this._points[i2];
          p2 = this._points[i2 + 1];
        }
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
        ctx.restore();
      },
      convertPointsToSVGPath: function(points) {
        var correction = this.width / 1e3;
        return fabric2.util.getSmoothPathFromPoints(points, correction);
      },
      _isEmptySVGPath: function(pathData) {
        var pathString = fabric2.util.joinPath(pathData);
        return pathString === "M 0 0 Q 0 0 0 0 L 0 0";
      },
      createPath: function(pathData) {
        var path = new fabric2.Path(pathData, {
          fill: null,
          stroke: this.color,
          strokeWidth: this.width,
          strokeLineCap: this.strokeLineCap,
          strokeMiterLimit: this.strokeMiterLimit,
          strokeLineJoin: this.strokeLineJoin,
          strokeDashArray: this.strokeDashArray
        });
        if (this.shadow) {
          this.shadow.affectStroke = true;
          path.shadow = new fabric2.Shadow(this.shadow);
        }
        return path;
      },
      decimatePoints: function(points, distance) {
        if (points.length <= 2) {
          return points;
        }
        var zoom = this.canvas.getZoom(), adjustedDistance = Math.pow(distance / zoom, 2), i2, l = points.length - 1, lastPoint = points[0], newPoints = [lastPoint], cDistance;
        for (i2 = 1; i2 < l - 1; i2++) {
          cDistance = Math.pow(lastPoint.x - points[i2].x, 2) + Math.pow(lastPoint.y - points[i2].y, 2);
          if (cDistance >= adjustedDistance) {
            lastPoint = points[i2];
            newPoints.push(lastPoint);
          }
        }
        newPoints.push(points[l]);
        return newPoints;
      },
      _finalizeAndAddPath: function() {
        var ctx = this.canvas.contextTop;
        ctx.closePath();
        if (this.decimate) {
          this._points = this.decimatePoints(this._points, this.decimate);
        }
        var pathData = this.convertPointsToSVGPath(this._points);
        if (this._isEmptySVGPath(pathData)) {
          this.canvas.requestRenderAll();
          return;
        }
        var path = this.createPath(pathData);
        this.canvas.clearContext(this.canvas.contextTop);
        this.canvas.fire("before:path:created", { path });
        this.canvas.add(path);
        this.canvas.requestRenderAll();
        path.setCoords();
        this._resetShadow();
        this.canvas.fire("path:created", { path });
      }
    });
  })();
  fabric2.CircleBrush = fabric2.util.createClass(fabric2.BaseBrush, {
    width: 10,
    initialize: function(canvas) {
      this.canvas = canvas;
      this.points = [];
    },
    drawDot: function(pointer) {
      var point = this.addPoint(pointer), ctx = this.canvas.contextTop;
      this._saveAndTransform(ctx);
      this.dot(ctx, point);
      ctx.restore();
    },
    dot: function(ctx, point) {
      ctx.fillStyle = point.fill;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    },
    onMouseDown: function(pointer) {
      this.points.length = 0;
      this.canvas.clearContext(this.canvas.contextTop);
      this._setShadow();
      this.drawDot(pointer);
    },
    _render: function() {
      var ctx = this.canvas.contextTop, i2, len, points = this.points;
      this._saveAndTransform(ctx);
      for (i2 = 0, len = points.length; i2 < len; i2++) {
        this.dot(ctx, points[i2]);
      }
      ctx.restore();
    },
    onMouseMove: function(pointer) {
      if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
        return;
      }
      if (this.needsFullRender()) {
        this.canvas.clearContext(this.canvas.contextTop);
        this.addPoint(pointer);
        this._render();
      } else {
        this.drawDot(pointer);
      }
    },
    onMouseUp: function() {
      var originalRenderOnAddRemove = this.canvas.renderOnAddRemove, i2, len;
      this.canvas.renderOnAddRemove = false;
      var circles = [];
      for (i2 = 0, len = this.points.length; i2 < len; i2++) {
        var point = this.points[i2], circle = new fabric2.Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: "center",
          originY: "center",
          fill: point.fill
        });
        this.shadow && (circle.shadow = new fabric2.Shadow(this.shadow));
        circles.push(circle);
      }
      var group = new fabric2.Group(circles);
      group.canvas = this.canvas;
      this.canvas.fire("before:path:created", { path: group });
      this.canvas.add(group);
      this.canvas.fire("path:created", { path: group });
      this.canvas.clearContext(this.canvas.contextTop);
      this._resetShadow();
      this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
      this.canvas.requestRenderAll();
    },
    addPoint: function(pointer) {
      var pointerPoint = new fabric2.Point(pointer.x, pointer.y), circleRadius = fabric2.util.getRandomInt(
        Math.max(0, this.width - 20),
        this.width + 20
      ) / 2, circleColor = new fabric2.Color(this.color).setAlpha(fabric2.util.getRandomInt(0, 100) / 100).toRgba();
      pointerPoint.radius = circleRadius;
      pointerPoint.fill = circleColor;
      this.points.push(pointerPoint);
      return pointerPoint;
    }
  });
  fabric2.SprayBrush = fabric2.util.createClass(fabric2.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: false,
    optimizeOverlapping: true,
    initialize: function(canvas) {
      this.canvas = canvas;
      this.sprayChunks = [];
    },
    onMouseDown: function(pointer) {
      this.sprayChunks.length = 0;
      this.canvas.clearContext(this.canvas.contextTop);
      this._setShadow();
      this.addSprayChunk(pointer);
      this.render(this.sprayChunkPoints);
    },
    onMouseMove: function(pointer) {
      if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
        return;
      }
      this.addSprayChunk(pointer);
      this.render(this.sprayChunkPoints);
    },
    onMouseUp: function() {
      var originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
      this.canvas.renderOnAddRemove = false;
      var rects = [];
      for (var i2 = 0, ilen = this.sprayChunks.length; i2 < ilen; i2++) {
        var sprayChunk = this.sprayChunks[i2];
        for (var j = 0, jlen = sprayChunk.length; j < jlen; j++) {
          var rect = new fabric2.Rect({
            width: sprayChunk[j].width,
            height: sprayChunk[j].width,
            left: sprayChunk[j].x + 1,
            top: sprayChunk[j].y + 1,
            originX: "center",
            originY: "center",
            fill: this.color
          });
          rects.push(rect);
        }
      }
      if (this.optimizeOverlapping) {
        rects = this._getOptimizedRects(rects);
      }
      var group = new fabric2.Group(rects);
      this.shadow && group.set("shadow", new fabric2.Shadow(this.shadow));
      this.canvas.fire("before:path:created", { path: group });
      this.canvas.add(group);
      this.canvas.fire("path:created", { path: group });
      this.canvas.clearContext(this.canvas.contextTop);
      this._resetShadow();
      this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
      this.canvas.requestRenderAll();
    },
    _getOptimizedRects: function(rects) {
      var uniqueRects = {}, key, i2, len;
      for (i2 = 0, len = rects.length; i2 < len; i2++) {
        key = rects[i2].left + "" + rects[i2].top;
        if (!uniqueRects[key]) {
          uniqueRects[key] = rects[i2];
        }
      }
      var uniqueRectsArray = [];
      for (key in uniqueRects) {
        uniqueRectsArray.push(uniqueRects[key]);
      }
      return uniqueRectsArray;
    },
    render: function(sprayChunk) {
      var ctx = this.canvas.contextTop, i2, len;
      ctx.fillStyle = this.color;
      this._saveAndTransform(ctx);
      for (i2 = 0, len = sprayChunk.length; i2 < len; i2++) {
        var point = sprayChunk[i2];
        if (typeof point.opacity !== "undefined") {
          ctx.globalAlpha = point.opacity;
        }
        ctx.fillRect(point.x, point.y, point.width, point.width);
      }
      ctx.restore();
    },
    _render: function() {
      var ctx = this.canvas.contextTop, i2, ilen;
      ctx.fillStyle = this.color;
      this._saveAndTransform(ctx);
      for (i2 = 0, ilen = this.sprayChunks.length; i2 < ilen; i2++) {
        this.render(this.sprayChunks[i2]);
      }
      ctx.restore();
    },
    addSprayChunk: function(pointer) {
      this.sprayChunkPoints = [];
      var x2, y3, width, radius = this.width / 2, i2;
      for (i2 = 0; i2 < this.density; i2++) {
        x2 = fabric2.util.getRandomInt(pointer.x - radius, pointer.x + radius);
        y3 = fabric2.util.getRandomInt(pointer.y - radius, pointer.y + radius);
        if (this.dotWidthVariance) {
          width = fabric2.util.getRandomInt(
            Math.max(1, this.dotWidth - this.dotWidthVariance),
            this.dotWidth + this.dotWidthVariance
          );
        } else {
          width = this.dotWidth;
        }
        var point = new fabric2.Point(x2, y3);
        point.width = width;
        if (this.randomOpacity) {
          point.opacity = fabric2.util.getRandomInt(0, 100) / 100;
        }
        this.sprayChunkPoints.push(point);
      }
      this.sprayChunks.push(this.sprayChunkPoints);
    }
  });
  fabric2.PatternBrush = fabric2.util.createClass(fabric2.PencilBrush, {
    getPatternSrc: function() {
      var dotWidth = 20, dotDistance = 5, patternCanvas = fabric2.util.createCanvasElement(), patternCtx = patternCanvas.getContext("2d");
      patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;
      patternCtx.fillStyle = this.color;
      patternCtx.beginPath();
      patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
      patternCtx.closePath();
      patternCtx.fill();
      return patternCanvas;
    },
    getPatternSrcFunction: function() {
      return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"');
    },
    getPattern: function(ctx) {
      return ctx.createPattern(this.source || this.getPatternSrc(), "repeat");
    },
    _setBrushStyles: function(ctx) {
      this.callSuper("_setBrushStyles", ctx);
      ctx.strokeStyle = this.getPattern(ctx);
    },
    createPath: function(pathData) {
      var path = this.callSuper("createPath", pathData), topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);
      path.stroke = new fabric2.Pattern({
        source: this.source || this.getPatternSrcFunction(),
        offsetX: -topLeft.x,
        offsetY: -topLeft.y
      });
      return path;
    }
  });
  (function() {
    var getPointer = fabric2.util.getPointer, degreesToRadians = fabric2.util.degreesToRadians, isTouchEvent = fabric2.util.isTouchEvent;
    fabric2.Canvas = fabric2.util.createClass(fabric2.StaticCanvas, {
      initialize: function(el, options) {
        options || (options = {});
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._initStatic(el, options);
        this._initInteractive();
        this._createCacheCanvas();
      },
      uniformScaling: true,
      uniScaleKey: "shiftKey",
      centeredScaling: false,
      centeredRotation: false,
      centeredKey: "altKey",
      altActionKey: "shiftKey",
      interactive: true,
      selection: true,
      selectionKey: "shiftKey",
      altSelectionKey: null,
      selectionColor: "rgba(100, 100, 255, 0.3)",
      selectionDashArray: [],
      selectionBorderColor: "rgba(255, 255, 255, 0.3)",
      selectionLineWidth: 1,
      selectionFullyContained: false,
      hoverCursor: "move",
      moveCursor: "move",
      defaultCursor: "default",
      freeDrawingCursor: "crosshair",
      notAllowedCursor: "not-allowed",
      containerClass: "canvas-container",
      perPixelTargetFind: false,
      targetFindTolerance: 0,
      skipTargetFind: false,
      isDrawingMode: false,
      preserveObjectStacking: false,
      snapAngle: 0,
      snapThreshold: null,
      stopContextMenu: false,
      fireRightClick: false,
      fireMiddleClick: false,
      targets: [],
      enablePointerEvents: false,
      _hoveredTarget: null,
      _hoveredTargets: [],
      _initInteractive: function() {
        this._currentTransform = null;
        this._groupSelector = null;
        this._initWrapperElement();
        this._createUpperCanvas();
        this._initEventListeners();
        this._initRetinaScaling();
        this.freeDrawingBrush = fabric2.PencilBrush && new fabric2.PencilBrush(this);
        this.calcOffset();
      },
      _chooseObjectsToRender: function() {
        var activeObjects = this.getActiveObjects(), object, objsToRender, activeGroupObjects;
        if (activeObjects.length > 0 && !this.preserveObjectStacking) {
          objsToRender = [];
          activeGroupObjects = [];
          for (var i2 = 0, length = this._objects.length; i2 < length; i2++) {
            object = this._objects[i2];
            if (activeObjects.indexOf(object) === -1) {
              objsToRender.push(object);
            } else {
              activeGroupObjects.push(object);
            }
          }
          if (activeObjects.length > 1) {
            this._activeObject._objects = activeGroupObjects;
          }
          objsToRender.push.apply(objsToRender, activeGroupObjects);
        } else {
          objsToRender = this._objects;
        }
        return objsToRender;
      },
      renderAll: function() {
        if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
          this.clearContext(this.contextTop);
          this.contextTopDirty = false;
        }
        if (this.hasLostContext) {
          this.renderTopLayer(this.contextTop);
          this.hasLostContext = false;
        }
        var canvasToDrawOn = this.contextContainer;
        this.renderCanvas(canvasToDrawOn, this._chooseObjectsToRender());
        return this;
      },
      renderTopLayer: function(ctx) {
        ctx.save();
        if (this.isDrawingMode && this._isCurrentlyDrawing) {
          this.freeDrawingBrush && this.freeDrawingBrush._render();
          this.contextTopDirty = true;
        }
        if (this.selection && this._groupSelector) {
          this._drawSelection(ctx);
          this.contextTopDirty = true;
        }
        ctx.restore();
      },
      renderTop: function() {
        var ctx = this.contextTop;
        this.clearContext(ctx);
        this.renderTopLayer(ctx);
        this.fire("after:render");
        return this;
      },
      _normalizePointer: function(object, pointer) {
        var m3 = object.calcTransformMatrix(), invertedM = fabric2.util.invertTransform(m3), vptPointer = this.restorePointerVpt(pointer);
        return fabric2.util.transformPoint(vptPointer, invertedM);
      },
      isTargetTransparent: function(target, x2, y3) {
        if (target.shouldCache() && target._cacheCanvas && target !== this._activeObject) {
          var normalizedPointer = this._normalizePointer(target, { x: x2, y: y3 }), targetRelativeX = Math.max(target.cacheTranslationX + normalizedPointer.x * target.zoomX, 0), targetRelativeY = Math.max(target.cacheTranslationY + normalizedPointer.y * target.zoomY, 0);
          var isTransparent = fabric2.util.isTransparent(
            target._cacheContext,
            Math.round(targetRelativeX),
            Math.round(targetRelativeY),
            this.targetFindTolerance
          );
          return isTransparent;
        }
        var ctx = this.contextCache, originalColor = target.selectionBackgroundColor, v = this.viewportTransform;
        target.selectionBackgroundColor = "";
        this.clearContext(ctx);
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        target.render(ctx);
        ctx.restore();
        target.selectionBackgroundColor = originalColor;
        var isTransparent = fabric2.util.isTransparent(
          ctx,
          x2,
          y3,
          this.targetFindTolerance
        );
        return isTransparent;
      },
      _isSelectionKeyPressed: function(e2) {
        var selectionKeyPressed = false;
        if (Array.isArray(this.selectionKey)) {
          selectionKeyPressed = !!this.selectionKey.find(function(key) {
            return e2[key] === true;
          });
        } else {
          selectionKeyPressed = e2[this.selectionKey];
        }
        return selectionKeyPressed;
      },
      _shouldClearSelection: function(e2, target) {
        var activeObjects = this.getActiveObjects(), activeObject = this._activeObject;
        return !target || target && activeObject && activeObjects.length > 1 && activeObjects.indexOf(target) === -1 && activeObject !== target && !this._isSelectionKeyPressed(e2) || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target;
      },
      _shouldCenterTransform: function(target, action, altKey) {
        if (!target) {
          return;
        }
        var centerTransform;
        if (action === "scale" || action === "scaleX" || action === "scaleY" || action === "resizing") {
          centerTransform = this.centeredScaling || target.centeredScaling;
        } else if (action === "rotate") {
          centerTransform = this.centeredRotation || target.centeredRotation;
        }
        return centerTransform ? !altKey : altKey;
      },
      _getOriginFromCorner: function(target, corner) {
        var origin = {
          x: target.originX,
          y: target.originY
        };
        if (corner === "ml" || corner === "tl" || corner === "bl") {
          origin.x = "right";
        } else if (corner === "mr" || corner === "tr" || corner === "br") {
          origin.x = "left";
        }
        if (corner === "tl" || corner === "mt" || corner === "tr") {
          origin.y = "bottom";
        } else if (corner === "bl" || corner === "mb" || corner === "br") {
          origin.y = "top";
        }
        return origin;
      },
      _getActionFromCorner: function(alreadySelected, corner, e2, target) {
        if (!corner || !alreadySelected) {
          return "drag";
        }
        var control = target.controls[corner];
        return control.getActionName(e2, control, target);
      },
      _setupCurrentTransform: function(e2, target, alreadySelected) {
        if (!target) {
          return;
        }
        var pointer = this.getPointer(e2), corner = target.__corner, control = target.controls[corner], actionHandler = alreadySelected && corner ? control.getActionHandler(e2, target, control) : fabric2.controlsUtils.dragHandler, action = this._getActionFromCorner(alreadySelected, corner, e2, target), origin = this._getOriginFromCorner(target, corner), altKey = e2[this.centeredKey], transform = {
          target,
          action,
          actionHandler,
          corner,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          skewX: target.skewX,
          skewY: target.skewY,
          offsetX: pointer.x - target.left,
          offsetY: pointer.y - target.top,
          originX: origin.x,
          originY: origin.y,
          ex: pointer.x,
          ey: pointer.y,
          lastX: pointer.x,
          lastY: pointer.y,
          theta: degreesToRadians(target.angle),
          width: target.width * target.scaleX,
          shiftKey: e2.shiftKey,
          altKey,
          original: fabric2.util.saveObjectTransform(target)
        };
        if (this._shouldCenterTransform(target, action, altKey)) {
          transform.originX = "center";
          transform.originY = "center";
        }
        transform.original.originX = origin.x;
        transform.original.originY = origin.y;
        this._currentTransform = transform;
        this._beforeTransform(e2);
      },
      setCursor: function(value) {
        this.upperCanvasEl.style.cursor = value;
      },
      _drawSelection: function(ctx) {
        var selector = this._groupSelector, viewportStart = new fabric2.Point(selector.ex, selector.ey), start = fabric2.util.transformPoint(viewportStart, this.viewportTransform), viewportExtent = new fabric2.Point(selector.ex + selector.left, selector.ey + selector.top), extent = fabric2.util.transformPoint(viewportExtent, this.viewportTransform), minX = Math.min(start.x, extent.x), minY = Math.min(start.y, extent.y), maxX = Math.max(start.x, extent.x), maxY = Math.max(start.y, extent.y), strokeOffset = this.selectionLineWidth / 2;
        if (this.selectionColor) {
          ctx.fillStyle = this.selectionColor;
          ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        }
        if (!this.selectionLineWidth || !this.selectionBorderColor) {
          return;
        }
        ctx.lineWidth = this.selectionLineWidth;
        ctx.strokeStyle = this.selectionBorderColor;
        minX += strokeOffset;
        minY += strokeOffset;
        maxX -= strokeOffset;
        maxY -= strokeOffset;
        fabric2.Object.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      },
      findTarget: function(e2, skipGroup) {
        if (this.skipTargetFind) {
          return;
        }
        var ignoreZoom = true, pointer = this.getPointer(e2, ignoreZoom), activeObject = this._activeObject, aObjects = this.getActiveObjects(), activeTarget, activeTargetSubs, isTouch = isTouchEvent(e2), shouldLookForActive = aObjects.length > 1 && !skipGroup || aObjects.length === 1;
        this.targets = [];
        if (shouldLookForActive && activeObject._findTargetCorner(pointer, isTouch)) {
          return activeObject;
        }
        if (aObjects.length > 1 && !skipGroup && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
          return activeObject;
        }
        if (aObjects.length === 1 && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
          if (!this.preserveObjectStacking) {
            return activeObject;
          } else {
            activeTarget = activeObject;
            activeTargetSubs = this.targets;
            this.targets = [];
          }
        }
        var target = this._searchPossibleTargets(this._objects, pointer);
        if (e2[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
          target = activeTarget;
          this.targets = activeTargetSubs;
        }
        return target;
      },
      _checkTarget: function(pointer, obj, globalPointer) {
        if (obj && obj.visible && obj.evented && obj.containsPoint(pointer)) {
          if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
            var isTransparent = this.isTargetTransparent(obj, globalPointer.x, globalPointer.y);
            if (!isTransparent) {
              return true;
            }
          } else {
            return true;
          }
        }
      },
      _searchPossibleTargets: function(objects, pointer) {
        var target, i2 = objects.length, subTarget;
        while (i2--) {
          var objToCheck = objects[i2];
          var pointerToUse = objToCheck.group ? this._normalizePointer(objToCheck.group, pointer) : pointer;
          if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
            target = objects[i2];
            if (target.subTargetCheck && target instanceof fabric2.Group) {
              subTarget = this._searchPossibleTargets(target._objects, pointer);
              subTarget && this.targets.push(subTarget);
            }
            break;
          }
        }
        return target;
      },
      restorePointerVpt: function(pointer) {
        return fabric2.util.transformPoint(
          pointer,
          fabric2.util.invertTransform(this.viewportTransform)
        );
      },
      getPointer: function(e2, ignoreZoom) {
        if (this._absolutePointer && !ignoreZoom) {
          return this._absolutePointer;
        }
        if (this._pointer && ignoreZoom) {
          return this._pointer;
        }
        var pointer = getPointer(e2), upperCanvasEl = this.upperCanvasEl, bounds = upperCanvasEl.getBoundingClientRect(), boundsWidth = bounds.width || 0, boundsHeight = bounds.height || 0, cssScale;
        if (!boundsWidth || !boundsHeight) {
          if ("top" in bounds && "bottom" in bounds) {
            boundsHeight = Math.abs(bounds.top - bounds.bottom);
          }
          if ("right" in bounds && "left" in bounds) {
            boundsWidth = Math.abs(bounds.right - bounds.left);
          }
        }
        this.calcOffset();
        pointer.x = pointer.x - this._offset.left;
        pointer.y = pointer.y - this._offset.top;
        if (!ignoreZoom) {
          pointer = this.restorePointerVpt(pointer);
        }
        var retinaScaling = this.getRetinaScaling();
        if (retinaScaling !== 1) {
          pointer.x /= retinaScaling;
          pointer.y /= retinaScaling;
        }
        if (boundsWidth === 0 || boundsHeight === 0) {
          cssScale = { width: 1, height: 1 };
        } else {
          cssScale = {
            width: upperCanvasEl.width / boundsWidth,
            height: upperCanvasEl.height / boundsHeight
          };
        }
        return {
          x: pointer.x * cssScale.width,
          y: pointer.y * cssScale.height
        };
      },
      _createUpperCanvas: function() {
        var lowerCanvasClass = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, ""), lowerCanvasEl = this.lowerCanvasEl, upperCanvasEl = this.upperCanvasEl;
        if (upperCanvasEl) {
          upperCanvasEl.className = "";
        } else {
          upperCanvasEl = this._createCanvasElement();
          this.upperCanvasEl = upperCanvasEl;
        }
        fabric2.util.addClass(upperCanvasEl, "upper-canvas " + lowerCanvasClass);
        this.wrapperEl.appendChild(upperCanvasEl);
        this._copyCanvasStyle(lowerCanvasEl, upperCanvasEl);
        this._applyCanvasStyle(upperCanvasEl);
        this.contextTop = upperCanvasEl.getContext("2d");
      },
      getTopContext: function() {
        return this.contextTop;
      },
      _createCacheCanvas: function() {
        this.cacheCanvasEl = this._createCanvasElement();
        this.cacheCanvasEl.setAttribute("width", this.width);
        this.cacheCanvasEl.setAttribute("height", this.height);
        this.contextCache = this.cacheCanvasEl.getContext("2d");
      },
      _initWrapperElement: function() {
        this.wrapperEl = fabric2.util.wrapElement(this.lowerCanvasEl, "div", {
          "class": this.containerClass
        });
        fabric2.util.setStyle(this.wrapperEl, {
          width: this.width + "px",
          height: this.height + "px",
          position: "relative"
        });
        fabric2.util.makeElementUnselectable(this.wrapperEl);
      },
      _applyCanvasStyle: function(element) {
        var width = this.width || element.width, height = this.height || element.height;
        fabric2.util.setStyle(element, {
          position: "absolute",
          width: width + "px",
          height: height + "px",
          left: 0,
          top: 0,
          "touch-action": this.allowTouchScrolling ? "manipulation" : "none",
          "-ms-touch-action": this.allowTouchScrolling ? "manipulation" : "none"
        });
        element.width = width;
        element.height = height;
        fabric2.util.makeElementUnselectable(element);
      },
      _copyCanvasStyle: function(fromEl, toEl) {
        toEl.style.cssText = fromEl.style.cssText;
      },
      getSelectionContext: function() {
        return this.contextTop;
      },
      getSelectionElement: function() {
        return this.upperCanvasEl;
      },
      getActiveObject: function() {
        return this._activeObject;
      },
      getActiveObjects: function() {
        var active = this._activeObject;
        if (active) {
          if (active.type === "activeSelection" && active._objects) {
            return active._objects.slice(0);
          } else {
            return [active];
          }
        }
        return [];
      },
      _onObjectRemoved: function(obj) {
        if (obj === this._activeObject) {
          this.fire("before:selection:cleared", { target: obj });
          this._discardActiveObject();
          this.fire("selection:cleared", { target: obj });
          obj.fire("deselected");
        }
        if (obj === this._hoveredTarget) {
          this._hoveredTarget = null;
          this._hoveredTargets = [];
        }
        this.callSuper("_onObjectRemoved", obj);
      },
      _fireSelectionEvents: function(oldObjects, e2) {
        var somethingChanged = false, objects = this.getActiveObjects(), added = [], removed = [];
        oldObjects.forEach(function(oldObject) {
          if (objects.indexOf(oldObject) === -1) {
            somethingChanged = true;
            oldObject.fire("deselected", {
              e: e2,
              target: oldObject
            });
            removed.push(oldObject);
          }
        });
        objects.forEach(function(object) {
          if (oldObjects.indexOf(object) === -1) {
            somethingChanged = true;
            object.fire("selected", {
              e: e2,
              target: object
            });
            added.push(object);
          }
        });
        if (oldObjects.length > 0 && objects.length > 0) {
          somethingChanged && this.fire("selection:updated", {
            e: e2,
            selected: added,
            deselected: removed
          });
        } else if (objects.length > 0) {
          this.fire("selection:created", {
            e: e2,
            selected: added
          });
        } else if (oldObjects.length > 0) {
          this.fire("selection:cleared", {
            e: e2,
            deselected: removed
          });
        }
      },
      setActiveObject: function(object, e2) {
        var currentActives = this.getActiveObjects();
        this._setActiveObject(object, e2);
        this._fireSelectionEvents(currentActives, e2);
        return this;
      },
      _setActiveObject: function(object, e2) {
        if (this._activeObject === object) {
          return false;
        }
        if (!this._discardActiveObject(e2, object)) {
          return false;
        }
        if (object.onSelect({ e: e2 })) {
          return false;
        }
        this._activeObject = object;
        return true;
      },
      _discardActiveObject: function(e2, object) {
        var obj = this._activeObject;
        if (obj) {
          if (obj.onDeselect({ e: e2, object })) {
            return false;
          }
          this._activeObject = null;
        }
        return true;
      },
      discardActiveObject: function(e2) {
        var currentActives = this.getActiveObjects(), activeObject = this.getActiveObject();
        if (currentActives.length) {
          this.fire("before:selection:cleared", { target: activeObject, e: e2 });
        }
        this._discardActiveObject(e2);
        this._fireSelectionEvents(currentActives, e2);
        return this;
      },
      dispose: function() {
        var wrapper = this.wrapperEl;
        this.removeListeners();
        wrapper.removeChild(this.upperCanvasEl);
        wrapper.removeChild(this.lowerCanvasEl);
        this.contextCache = null;
        this.contextTop = null;
        ["upperCanvasEl", "cacheCanvasEl"].forEach(function(element) {
          fabric2.util.cleanUpJsdomNode(this[element]);
          this[element] = void 0;
        }.bind(this));
        if (wrapper.parentNode) {
          wrapper.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl);
        }
        delete this.wrapperEl;
        fabric2.StaticCanvas.prototype.dispose.call(this);
        return this;
      },
      clear: function() {
        this.discardActiveObject();
        this.clearContext(this.contextTop);
        return this.callSuper("clear");
      },
      drawControls: function(ctx) {
        var activeObject = this._activeObject;
        if (activeObject) {
          activeObject._renderControls(ctx);
        }
      },
      _toObject: function(instance, methodName, propertiesToInclude) {
        var originalProperties = this._realizeGroupTransformOnObject(instance), object = this.callSuper("_toObject", instance, methodName, propertiesToInclude);
        this._unwindGroupTransformOnObject(instance, originalProperties);
        return object;
      },
      _realizeGroupTransformOnObject: function(instance) {
        if (instance.group && instance.group.type === "activeSelection" && this._activeObject === instance.group) {
          var layoutProps = ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"];
          var originalValues = {};
          layoutProps.forEach(function(prop2) {
            originalValues[prop2] = instance[prop2];
          });
          fabric2.util.addTransformToObject(instance, this._activeObject.calcOwnMatrix());
          return originalValues;
        } else {
          return null;
        }
      },
      _unwindGroupTransformOnObject: function(instance, originalValues) {
        if (originalValues) {
          instance.set(originalValues);
        }
      },
      _setSVGObject: function(markup, instance, reviver) {
        var originalProperties = this._realizeGroupTransformOnObject(instance);
        this.callSuper("_setSVGObject", markup, instance, reviver);
        this._unwindGroupTransformOnObject(instance, originalProperties);
      },
      setViewportTransform: function(vpt) {
        if (this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing) {
          this._activeObject.clearContextTop();
        }
        fabric2.StaticCanvas.prototype.setViewportTransform.call(this, vpt);
      }
    });
    for (var prop in fabric2.StaticCanvas) {
      if (prop !== "prototype") {
        fabric2.Canvas[prop] = fabric2.StaticCanvas[prop];
      }
    }
  })();
  (function() {
    var addListener = fabric2.util.addListener, removeListener = fabric2.util.removeListener, RIGHT_CLICK = 3, MIDDLE_CLICK = 2, LEFT_CLICK = 1, addEventOptions = { passive: false };
    function checkClick(e2, value) {
      return e2.button && e2.button === value - 1;
    }
    fabric2.util.object.extend(fabric2.Canvas.prototype, {
      mainTouchId: null,
      _initEventListeners: function() {
        this.removeListeners();
        this._bindEvents();
        this.addOrRemove(addListener, "add");
      },
      _getEventPrefix: function() {
        return this.enablePointerEvents ? "pointer" : "mouse";
      },
      addOrRemove: function(functor, eventjsFunctor) {
        var canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        functor(fabric2.window, "resize", this._onResize);
        functor(canvasElement, eventTypePrefix + "down", this._onMouseDown);
        functor(canvasElement, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
        functor(canvasElement, eventTypePrefix + "out", this._onMouseOut);
        functor(canvasElement, eventTypePrefix + "enter", this._onMouseEnter);
        functor(canvasElement, "wheel", this._onMouseWheel);
        functor(canvasElement, "contextmenu", this._onContextMenu);
        functor(canvasElement, "dblclick", this._onDoubleClick);
        functor(canvasElement, "dragover", this._onDragOver);
        functor(canvasElement, "dragenter", this._onDragEnter);
        functor(canvasElement, "dragleave", this._onDragLeave);
        functor(canvasElement, "drop", this._onDrop);
        if (!this.enablePointerEvents) {
          functor(canvasElement, "touchstart", this._onTouchStart, addEventOptions);
        }
        if (typeof eventjs !== "undefined" && eventjsFunctor in eventjs) {
          eventjs[eventjsFunctor](canvasElement, "gesture", this._onGesture);
          eventjs[eventjsFunctor](canvasElement, "drag", this._onDrag);
          eventjs[eventjsFunctor](canvasElement, "orientation", this._onOrientationChange);
          eventjs[eventjsFunctor](canvasElement, "shake", this._onShake);
          eventjs[eventjsFunctor](canvasElement, "longpress", this._onLongPress);
        }
      },
      removeListeners: function() {
        this.addOrRemove(removeListener, "remove");
        var eventTypePrefix = this._getEventPrefix();
        removeListener(fabric2.document, eventTypePrefix + "up", this._onMouseUp);
        removeListener(fabric2.document, "touchend", this._onTouchEnd, addEventOptions);
        removeListener(fabric2.document, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
        removeListener(fabric2.document, "touchmove", this._onMouseMove, addEventOptions);
      },
      _bindEvents: function() {
        if (this.eventsBound) {
          return;
        }
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onResize = this._onResize.bind(this);
        this._onGesture = this._onGesture.bind(this);
        this._onDrag = this._onDrag.bind(this);
        this._onShake = this._onShake.bind(this);
        this._onLongPress = this._onLongPress.bind(this);
        this._onOrientationChange = this._onOrientationChange.bind(this);
        this._onMouseWheel = this._onMouseWheel.bind(this);
        this._onMouseOut = this._onMouseOut.bind(this);
        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onContextMenu = this._onContextMenu.bind(this);
        this._onDoubleClick = this._onDoubleClick.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onDragEnter = this._simpleEventHandler.bind(this, "dragenter");
        this._onDragLeave = this._simpleEventHandler.bind(this, "dragleave");
        this._onDrop = this._onDrop.bind(this);
        this.eventsBound = true;
      },
      _onGesture: function(e2, self) {
        this.__onTransformGesture && this.__onTransformGesture(e2, self);
      },
      _onDrag: function(e2, self) {
        this.__onDrag && this.__onDrag(e2, self);
      },
      _onMouseWheel: function(e2) {
        this.__onMouseWheel(e2);
      },
      _onMouseOut: function(e2) {
        var target = this._hoveredTarget;
        this.fire("mouse:out", { target, e: e2 });
        this._hoveredTarget = null;
        target && target.fire("mouseout", { e: e2 });
        var _this = this;
        this._hoveredTargets.forEach(function(_target) {
          _this.fire("mouse:out", { target, e: e2 });
          _target && target.fire("mouseout", { e: e2 });
        });
        this._hoveredTargets = [];
      },
      _onMouseEnter: function(e2) {
        if (!this._currentTransform && !this.findTarget(e2)) {
          this.fire("mouse:over", { target: null, e: e2 });
          this._hoveredTarget = null;
          this._hoveredTargets = [];
        }
      },
      _onOrientationChange: function(e2, self) {
        this.__onOrientationChange && this.__onOrientationChange(e2, self);
      },
      _onShake: function(e2, self) {
        this.__onShake && this.__onShake(e2, self);
      },
      _onLongPress: function(e2, self) {
        this.__onLongPress && this.__onLongPress(e2, self);
      },
      _onDragOver: function(e2) {
        e2.preventDefault();
        var target = this._simpleEventHandler("dragover", e2);
        this._fireEnterLeaveEvents(target, e2);
      },
      _onDrop: function(e2) {
        this._simpleEventHandler("drop:before", e2);
        return this._simpleEventHandler("drop", e2);
      },
      _onContextMenu: function(e2) {
        if (this.stopContextMenu) {
          e2.stopPropagation();
          e2.preventDefault();
        }
        return false;
      },
      _onDoubleClick: function(e2) {
        this._cacheTransformEventData(e2);
        this._handleEvent(e2, "dblclick");
        this._resetTransformEventData(e2);
      },
      getPointerId: function(evt) {
        var changedTouches = evt.changedTouches;
        if (changedTouches) {
          return changedTouches[0] && changedTouches[0].identifier;
        }
        if (this.enablePointerEvents) {
          return evt.pointerId;
        }
        return -1;
      },
      _isMainEvent: function(evt) {
        if (evt.isPrimary === true) {
          return true;
        }
        if (evt.isPrimary === false) {
          return false;
        }
        if (evt.type === "touchend" && evt.touches.length === 0) {
          return true;
        }
        if (evt.changedTouches) {
          return evt.changedTouches[0].identifier === this.mainTouchId;
        }
        return true;
      },
      _onTouchStart: function(e2) {
        e2.preventDefault();
        if (this.mainTouchId === null) {
          this.mainTouchId = this.getPointerId(e2);
        }
        this.__onMouseDown(e2);
        this._resetTransformEventData();
        var canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        addListener(fabric2.document, "touchend", this._onTouchEnd, addEventOptions);
        addListener(fabric2.document, "touchmove", this._onMouseMove, addEventOptions);
        removeListener(canvasElement, eventTypePrefix + "down", this._onMouseDown);
      },
      _onMouseDown: function(e2) {
        this.__onMouseDown(e2);
        this._resetTransformEventData();
        var canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        removeListener(canvasElement, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
        addListener(fabric2.document, eventTypePrefix + "up", this._onMouseUp);
        addListener(fabric2.document, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
      },
      _onTouchEnd: function(e2) {
        if (e2.touches.length > 0) {
          return;
        }
        this.__onMouseUp(e2);
        this._resetTransformEventData();
        this.mainTouchId = null;
        var eventTypePrefix = this._getEventPrefix();
        removeListener(fabric2.document, "touchend", this._onTouchEnd, addEventOptions);
        removeListener(fabric2.document, "touchmove", this._onMouseMove, addEventOptions);
        var _this = this;
        if (this._willAddMouseDown) {
          clearTimeout(this._willAddMouseDown);
        }
        this._willAddMouseDown = setTimeout(function() {
          addListener(_this.upperCanvasEl, eventTypePrefix + "down", _this._onMouseDown);
          _this._willAddMouseDown = 0;
        }, 400);
      },
      _onMouseUp: function(e2) {
        this.__onMouseUp(e2);
        this._resetTransformEventData();
        var canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        if (this._isMainEvent(e2)) {
          removeListener(fabric2.document, eventTypePrefix + "up", this._onMouseUp);
          removeListener(fabric2.document, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
          addListener(canvasElement, eventTypePrefix + "move", this._onMouseMove, addEventOptions);
        }
      },
      _onMouseMove: function(e2) {
        !this.allowTouchScrolling && e2.preventDefault && e2.preventDefault();
        this.__onMouseMove(e2);
      },
      _onResize: function() {
        this.calcOffset();
      },
      _shouldRender: function(target) {
        var activeObject = this._activeObject;
        if (!!activeObject !== !!target || activeObject && target && activeObject !== target) {
          return true;
        } else if (activeObject && activeObject.isEditing) {
          return false;
        }
        return false;
      },
      __onMouseUp: function(e2) {
        var target, transform = this._currentTransform, groupSelector = this._groupSelector, shouldRender = false, isClick = !groupSelector || groupSelector.left === 0 && groupSelector.top === 0;
        this._cacheTransformEventData(e2);
        target = this._target;
        this._handleEvent(e2, "up:before");
        if (checkClick(e2, RIGHT_CLICK)) {
          if (this.fireRightClick) {
            this._handleEvent(e2, "up", RIGHT_CLICK, isClick);
          }
          return;
        }
        if (checkClick(e2, MIDDLE_CLICK)) {
          if (this.fireMiddleClick) {
            this._handleEvent(e2, "up", MIDDLE_CLICK, isClick);
          }
          this._resetTransformEventData();
          return;
        }
        if (this.isDrawingMode && this._isCurrentlyDrawing) {
          this._onMouseUpInDrawingMode(e2);
          return;
        }
        if (!this._isMainEvent(e2)) {
          return;
        }
        if (transform) {
          this._finalizeCurrentTransform(e2);
          shouldRender = transform.actionPerformed;
        }
        if (!isClick) {
          var targetWasActive = target === this._activeObject;
          this._maybeGroupObjects(e2);
          if (!shouldRender) {
            shouldRender = this._shouldRender(target) || !targetWasActive && target === this._activeObject;
          }
        }
        var corner, pointer;
        if (target) {
          corner = target._findTargetCorner(
            this.getPointer(e2, true),
            fabric2.util.isTouchEvent(e2)
          );
          if (target.selectable && target !== this._activeObject && target.activeOn === "up") {
            this.setActiveObject(target, e2);
            shouldRender = true;
          } else {
            var control = target.controls[corner], mouseUpHandler = control && control.getMouseUpHandler(e2, target, control);
            if (mouseUpHandler) {
              pointer = this.getPointer(e2);
              mouseUpHandler(e2, transform, pointer.x, pointer.y);
            }
          }
          target.isMoving = false;
        }
        if (transform && (transform.target !== target || transform.corner !== corner)) {
          var originalControl = transform.target && transform.target.controls[transform.corner], originalMouseUpHandler = originalControl && originalControl.getMouseUpHandler(e2, target, control);
          pointer = pointer || this.getPointer(e2);
          originalMouseUpHandler && originalMouseUpHandler(e2, transform, pointer.x, pointer.y);
        }
        this._setCursorFromEvent(e2, target);
        this._handleEvent(e2, "up", LEFT_CLICK, isClick);
        this._groupSelector = null;
        this._currentTransform = null;
        target && (target.__corner = 0);
        if (shouldRender) {
          this.requestRenderAll();
        } else if (!isClick) {
          this.renderTop();
        }
      },
      _simpleEventHandler: function(eventType, e2) {
        var target = this.findTarget(e2), targets = this.targets, options = {
          e: e2,
          target,
          subTargets: targets
        };
        this.fire(eventType, options);
        target && target.fire(eventType, options);
        if (!targets) {
          return target;
        }
        for (var i2 = 0; i2 < targets.length; i2++) {
          targets[i2].fire(eventType, options);
        }
        return target;
      },
      _handleEvent: function(e2, eventType, button, isClick) {
        var target = this._target, targets = this.targets || [], options = {
          e: e2,
          target,
          subTargets: targets,
          button: button || LEFT_CLICK,
          isClick: isClick || false,
          pointer: this._pointer,
          absolutePointer: this._absolutePointer,
          transform: this._currentTransform
        };
        if (eventType === "up") {
          options.currentTarget = this.findTarget(e2);
          options.currentSubTargets = this.targets;
        }
        this.fire("mouse:" + eventType, options);
        target && target.fire("mouse" + eventType, options);
        for (var i2 = 0; i2 < targets.length; i2++) {
          targets[i2].fire("mouse" + eventType, options);
        }
      },
      _finalizeCurrentTransform: function(e2) {
        var transform = this._currentTransform, target = transform.target, options = {
          e: e2,
          target,
          transform,
          action: transform.action
        };
        if (target._scaling) {
          target._scaling = false;
        }
        target.setCoords();
        if (transform.actionPerformed || this.stateful && target.hasStateChanged()) {
          this._fire("modified", options);
        }
      },
      _onMouseDownInDrawingMode: function(e2) {
        this._isCurrentlyDrawing = true;
        if (this.getActiveObject()) {
          this.discardActiveObject(e2).requestRenderAll();
        }
        var pointer = this.getPointer(e2);
        this.freeDrawingBrush.onMouseDown(pointer, { e: e2, pointer });
        this._handleEvent(e2, "down");
      },
      _onMouseMoveInDrawingMode: function(e2) {
        if (this._isCurrentlyDrawing) {
          var pointer = this.getPointer(e2);
          this.freeDrawingBrush.onMouseMove(pointer, { e: e2, pointer });
        }
        this.setCursor(this.freeDrawingCursor);
        this._handleEvent(e2, "move");
      },
      _onMouseUpInDrawingMode: function(e2) {
        var pointer = this.getPointer(e2);
        this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({ e: e2, pointer });
        this._handleEvent(e2, "up");
      },
      __onMouseDown: function(e2) {
        this._cacheTransformEventData(e2);
        this._handleEvent(e2, "down:before");
        var target = this._target;
        if (checkClick(e2, RIGHT_CLICK)) {
          if (this.fireRightClick) {
            this._handleEvent(e2, "down", RIGHT_CLICK);
          }
          return;
        }
        if (checkClick(e2, MIDDLE_CLICK)) {
          if (this.fireMiddleClick) {
            this._handleEvent(e2, "down", MIDDLE_CLICK);
          }
          return;
        }
        if (this.isDrawingMode) {
          this._onMouseDownInDrawingMode(e2);
          return;
        }
        if (!this._isMainEvent(e2)) {
          return;
        }
        if (this._currentTransform) {
          return;
        }
        var pointer = this._pointer;
        this._previousPointer = pointer;
        var shouldRender = this._shouldRender(target), shouldGroup = this._shouldGroup(e2, target);
        if (this._shouldClearSelection(e2, target)) {
          this.discardActiveObject(e2);
        } else if (shouldGroup) {
          this._handleGrouping(e2, target);
          target = this._activeObject;
        }
        if (this.selection && (!target || !target.selectable && !target.isEditing && target !== this._activeObject)) {
          this._groupSelector = {
            ex: this._absolutePointer.x,
            ey: this._absolutePointer.y,
            top: 0,
            left: 0
          };
        }
        if (target) {
          var alreadySelected = target === this._activeObject;
          if (target.selectable && target.activeOn === "down") {
            this.setActiveObject(target, e2);
          }
          var corner = target._findTargetCorner(
            this.getPointer(e2, true),
            fabric2.util.isTouchEvent(e2)
          );
          target.__corner = corner;
          if (target === this._activeObject && (corner || !shouldGroup)) {
            this._setupCurrentTransform(e2, target, alreadySelected);
            var control = target.controls[corner], pointer = this.getPointer(e2), mouseDownHandler = control && control.getMouseDownHandler(e2, target, control);
            if (mouseDownHandler) {
              mouseDownHandler(e2, this._currentTransform, pointer.x, pointer.y);
            }
          }
        }
        this._handleEvent(e2, "down");
        (shouldRender || shouldGroup) && this.requestRenderAll();
      },
      _resetTransformEventData: function() {
        this._target = null;
        this._pointer = null;
        this._absolutePointer = null;
      },
      _cacheTransformEventData: function(e2) {
        this._resetTransformEventData();
        this._pointer = this.getPointer(e2, true);
        this._absolutePointer = this.restorePointerVpt(this._pointer);
        this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(e2) || null;
      },
      _beforeTransform: function(e2) {
        var t2 = this._currentTransform;
        this.stateful && t2.target.saveState();
        this.fire("before:transform", {
          e: e2,
          transform: t2
        });
      },
      __onMouseMove: function(e2) {
        this._handleEvent(e2, "move:before");
        this._cacheTransformEventData(e2);
        var target, pointer;
        if (this.isDrawingMode) {
          this._onMouseMoveInDrawingMode(e2);
          return;
        }
        if (!this._isMainEvent(e2)) {
          return;
        }
        var groupSelector = this._groupSelector;
        if (groupSelector) {
          pointer = this._absolutePointer;
          groupSelector.left = pointer.x - groupSelector.ex;
          groupSelector.top = pointer.y - groupSelector.ey;
          this.renderTop();
        } else if (!this._currentTransform) {
          target = this.findTarget(e2) || null;
          this._setCursorFromEvent(e2, target);
          this._fireOverOutEvents(target, e2);
        } else {
          this._transformObject(e2);
        }
        this._handleEvent(e2, "move");
        this._resetTransformEventData();
      },
      _fireOverOutEvents: function(target, e2) {
        var _hoveredTarget = this._hoveredTarget, _hoveredTargets = this._hoveredTargets, targets = this.targets, length = Math.max(_hoveredTargets.length, targets.length);
        this.fireSyntheticInOutEvents(target, e2, {
          oldTarget: _hoveredTarget,
          evtOut: "mouseout",
          canvasEvtOut: "mouse:out",
          evtIn: "mouseover",
          canvasEvtIn: "mouse:over"
        });
        for (var i2 = 0; i2 < length; i2++) {
          this.fireSyntheticInOutEvents(targets[i2], e2, {
            oldTarget: _hoveredTargets[i2],
            evtOut: "mouseout",
            evtIn: "mouseover"
          });
        }
        this._hoveredTarget = target;
        this._hoveredTargets = this.targets.concat();
      },
      _fireEnterLeaveEvents: function(target, e2) {
        var _draggedoverTarget = this._draggedoverTarget, _hoveredTargets = this._hoveredTargets, targets = this.targets, length = Math.max(_hoveredTargets.length, targets.length);
        this.fireSyntheticInOutEvents(target, e2, {
          oldTarget: _draggedoverTarget,
          evtOut: "dragleave",
          evtIn: "dragenter"
        });
        for (var i2 = 0; i2 < length; i2++) {
          this.fireSyntheticInOutEvents(targets[i2], e2, {
            oldTarget: _hoveredTargets[i2],
            evtOut: "dragleave",
            evtIn: "dragenter"
          });
        }
        this._draggedoverTarget = target;
      },
      fireSyntheticInOutEvents: function(target, e2, config2) {
        var inOpt, outOpt, oldTarget = config2.oldTarget, outFires, inFires, targetChanged = oldTarget !== target, canvasEvtIn = config2.canvasEvtIn, canvasEvtOut = config2.canvasEvtOut;
        if (targetChanged) {
          inOpt = { e: e2, target, previousTarget: oldTarget };
          outOpt = { e: e2, target: oldTarget, nextTarget: target };
        }
        inFires = target && targetChanged;
        outFires = oldTarget && targetChanged;
        if (outFires) {
          canvasEvtOut && this.fire(canvasEvtOut, outOpt);
          oldTarget.fire(config2.evtOut, outOpt);
        }
        if (inFires) {
          canvasEvtIn && this.fire(canvasEvtIn, inOpt);
          target.fire(config2.evtIn, inOpt);
        }
      },
      __onMouseWheel: function(e2) {
        this._cacheTransformEventData(e2);
        this._handleEvent(e2, "wheel");
        this._resetTransformEventData();
      },
      _transformObject: function(e2) {
        var pointer = this.getPointer(e2), transform = this._currentTransform;
        transform.reset = false;
        transform.shiftKey = e2.shiftKey;
        transform.altKey = e2[this.centeredKey];
        this._performTransformAction(e2, transform, pointer);
        transform.actionPerformed && this.requestRenderAll();
      },
      _performTransformAction: function(e2, transform, pointer) {
        var x2 = pointer.x, y3 = pointer.y, action = transform.action, actionPerformed = false, actionHandler = transform.actionHandler;
        if (actionHandler) {
          actionPerformed = actionHandler(e2, transform, x2, y3);
        }
        if (action === "drag" && actionPerformed) {
          transform.target.isMoving = true;
          this.setCursor(transform.target.moveCursor || this.moveCursor);
        }
        transform.actionPerformed = transform.actionPerformed || actionPerformed;
      },
      _fire: fabric2.controlsUtils.fireEvent,
      _setCursorFromEvent: function(e2, target) {
        if (!target) {
          this.setCursor(this.defaultCursor);
          return false;
        }
        var hoverCursor = target.hoverCursor || this.hoverCursor, activeSelection = this._activeObject && this._activeObject.type === "activeSelection" ? this._activeObject : null, corner = (!activeSelection || !activeSelection.contains(target)) && target._findTargetCorner(this.getPointer(e2, true));
        if (!corner) {
          if (target.subTargetCheck) {
            this.targets.concat().reverse().map(function(_target) {
              hoverCursor = _target.hoverCursor || hoverCursor;
            });
          }
          this.setCursor(hoverCursor);
        } else {
          this.setCursor(this.getCornerCursor(corner, target, e2));
        }
      },
      getCornerCursor: function(corner, target, e2) {
        var control = target.controls[corner];
        return control.cursorStyleHandler(e2, control, target);
      }
    });
  })();
  (function() {
    var min = Math.min, max = Math.max;
    fabric2.util.object.extend(fabric2.Canvas.prototype, {
      _shouldGroup: function(e2, target) {
        var activeObject = this._activeObject;
        return activeObject && this._isSelectionKeyPressed(e2) && target && target.selectable && this.selection && (activeObject !== target || activeObject.type === "activeSelection") && !target.onSelect({ e: e2 });
      },
      _handleGrouping: function(e2, target) {
        var activeObject = this._activeObject;
        if (activeObject.__corner) {
          return;
        }
        if (target === activeObject) {
          target = this.findTarget(e2, true);
          if (!target || !target.selectable) {
            return;
          }
        }
        if (activeObject && activeObject.type === "activeSelection") {
          this._updateActiveSelection(target, e2);
        } else {
          this._createActiveSelection(target, e2);
        }
      },
      _updateActiveSelection: function(target, e2) {
        var activeSelection = this._activeObject, currentActiveObjects = activeSelection._objects.slice(0);
        if (activeSelection.contains(target)) {
          activeSelection.removeWithUpdate(target);
          this._hoveredTarget = target;
          this._hoveredTargets = this.targets.concat();
          if (activeSelection.size() === 1) {
            this._setActiveObject(activeSelection.item(0), e2);
          }
        } else {
          activeSelection.addWithUpdate(target);
          this._hoveredTarget = activeSelection;
          this._hoveredTargets = this.targets.concat();
        }
        this._fireSelectionEvents(currentActiveObjects, e2);
      },
      _createActiveSelection: function(target, e2) {
        var currentActives = this.getActiveObjects(), group = this._createGroup(target);
        this._hoveredTarget = group;
        this._setActiveObject(group, e2);
        this._fireSelectionEvents(currentActives, e2);
      },
      _createGroup: function(target) {
        var objects = this._objects, isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target), groupObjects = isActiveLower ? [this._activeObject, target] : [target, this._activeObject];
        this._activeObject.isEditing && this._activeObject.exitEditing();
        return new fabric2.ActiveSelection(groupObjects, {
          canvas: this
        });
      },
      _groupSelectedObjects: function(e2) {
        var group = this._collectObjects(e2), aGroup;
        if (group.length === 1) {
          this.setActiveObject(group[0], e2);
        } else if (group.length > 1) {
          aGroup = new fabric2.ActiveSelection(group.reverse(), {
            canvas: this
          });
          this.setActiveObject(aGroup, e2);
        }
      },
      _collectObjects: function(e2) {
        var group = [], currentObject, x1 = this._groupSelector.ex, y1 = this._groupSelector.ey, x2 = x1 + this._groupSelector.left, y22 = y1 + this._groupSelector.top, selectionX1Y1 = new fabric2.Point(min(x1, x2), min(y1, y22)), selectionX2Y2 = new fabric2.Point(max(x1, x2), max(y1, y22)), allowIntersect = !this.selectionFullyContained, isClick = x1 === x2 && y1 === y22;
        for (var i2 = this._objects.length; i2--; ) {
          currentObject = this._objects[i2];
          if (!currentObject || !currentObject.selectable || !currentObject.visible) {
            continue;
          }
          if (allowIntersect && currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2, true) || currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2, true) || allowIntersect && currentObject.containsPoint(selectionX1Y1, null, true) || allowIntersect && currentObject.containsPoint(selectionX2Y2, null, true)) {
            group.push(currentObject);
            if (isClick) {
              break;
            }
          }
        }
        if (group.length > 1) {
          group = group.filter(function(object) {
            return !object.onSelect({ e: e2 });
          });
        }
        return group;
      },
      _maybeGroupObjects: function(e2) {
        if (this.selection && this._groupSelector) {
          this._groupSelectedObjects(e2);
        }
        this.setCursor(this.defaultCursor);
        this._groupSelector = null;
      }
    });
  })();
  (function() {
    fabric2.util.object.extend(fabric2.StaticCanvas.prototype, {
      toDataURL: function(options) {
        options || (options = {});
        var format2 = options.format || "png", quality = options.quality || 1, multiplier = (options.multiplier || 1) * (options.enableRetinaScaling ? this.getRetinaScaling() : 1), canvasEl = this.toCanvasElement(multiplier, options);
        return fabric2.util.toDataURL(canvasEl, format2, quality);
      },
      toCanvasElement: function(multiplier, cropping) {
        multiplier = multiplier || 1;
        cropping = cropping || {};
        var scaledWidth = (cropping.width || this.width) * multiplier, scaledHeight = (cropping.height || this.height) * multiplier, zoom = this.getZoom(), originalWidth = this.width, originalHeight = this.height, newZoom = zoom * multiplier, vp = this.viewportTransform, translateX = (vp[4] - (cropping.left || 0)) * multiplier, translateY = (vp[5] - (cropping.top || 0)) * multiplier, originalInteractive = this.interactive, newVp = [newZoom, 0, 0, newZoom, translateX, translateY], originalRetina = this.enableRetinaScaling, canvasEl = fabric2.util.createCanvasElement(), originalContextTop = this.contextTop;
        canvasEl.width = scaledWidth;
        canvasEl.height = scaledHeight;
        this.contextTop = null;
        this.enableRetinaScaling = false;
        this.interactive = false;
        this.viewportTransform = newVp;
        this.width = scaledWidth;
        this.height = scaledHeight;
        this.calcViewportBoundaries();
        this.renderCanvas(canvasEl.getContext("2d"), this._objects);
        this.viewportTransform = vp;
        this.width = originalWidth;
        this.height = originalHeight;
        this.calcViewportBoundaries();
        this.interactive = originalInteractive;
        this.enableRetinaScaling = originalRetina;
        this.contextTop = originalContextTop;
        return canvasEl;
      }
    });
  })();
  fabric2.util.object.extend(fabric2.StaticCanvas.prototype, {
    loadFromJSON: function(json, callback, reviver) {
      if (!json) {
        return;
      }
      var serialized = typeof json === "string" ? JSON.parse(json) : fabric2.util.object.clone(json);
      var _this = this, clipPath = serialized.clipPath, renderOnAddRemove = this.renderOnAddRemove;
      this.renderOnAddRemove = false;
      delete serialized.clipPath;
      this._enlivenObjects(serialized.objects, function(enlivenedObjects) {
        _this.clear();
        _this._setBgOverlay(serialized, function() {
          if (clipPath) {
            _this._enlivenObjects([clipPath], function(enlivenedCanvasClip) {
              _this.clipPath = enlivenedCanvasClip[0];
              _this.__setupCanvas.call(_this, serialized, enlivenedObjects, renderOnAddRemove, callback);
            });
          } else {
            _this.__setupCanvas.call(_this, serialized, enlivenedObjects, renderOnAddRemove, callback);
          }
        });
      }, reviver);
      return this;
    },
    __setupCanvas: function(serialized, enlivenedObjects, renderOnAddRemove, callback) {
      var _this = this;
      enlivenedObjects.forEach(function(obj, index) {
        _this.insertAt(obj, index);
      });
      this.renderOnAddRemove = renderOnAddRemove;
      delete serialized.objects;
      delete serialized.backgroundImage;
      delete serialized.overlayImage;
      delete serialized.background;
      delete serialized.overlay;
      this._setOptions(serialized);
      this.renderAll();
      callback && callback();
    },
    _setBgOverlay: function(serialized, callback) {
      var loaded = {
        backgroundColor: false,
        overlayColor: false,
        backgroundImage: false,
        overlayImage: false
      };
      if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background && !serialized.overlay) {
        callback && callback();
        return;
      }
      var cbIfLoaded = function() {
        if (loaded.backgroundImage && loaded.overlayImage && loaded.backgroundColor && loaded.overlayColor) {
          callback && callback();
        }
      };
      this.__setBgOverlay("backgroundImage", serialized.backgroundImage, loaded, cbIfLoaded);
      this.__setBgOverlay("overlayImage", serialized.overlayImage, loaded, cbIfLoaded);
      this.__setBgOverlay("backgroundColor", serialized.background, loaded, cbIfLoaded);
      this.__setBgOverlay("overlayColor", serialized.overlay, loaded, cbIfLoaded);
    },
    __setBgOverlay: function(property, value, loaded, callback) {
      var _this = this;
      if (!value) {
        loaded[property] = true;
        callback && callback();
        return;
      }
      if (property === "backgroundImage" || property === "overlayImage") {
        fabric2.util.enlivenObjects([value], function(enlivedObject) {
          _this[property] = enlivedObject[0];
          loaded[property] = true;
          callback && callback();
        });
      } else {
        this["set" + fabric2.util.string.capitalize(property, true)](value, function() {
          loaded[property] = true;
          callback && callback();
        });
      }
    },
    _enlivenObjects: function(objects, callback, reviver) {
      if (!objects || objects.length === 0) {
        callback && callback([]);
        return;
      }
      fabric2.util.enlivenObjects(objects, function(enlivenedObjects) {
        callback && callback(enlivenedObjects);
      }, null, reviver);
    },
    _toDataURL: function(format2, callback) {
      this.clone(function(clone) {
        callback(clone.toDataURL(format2));
      });
    },
    _toDataURLWithMultiplier: function(format2, multiplier, callback) {
      this.clone(function(clone) {
        callback(clone.toDataURLWithMultiplier(format2, multiplier));
      });
    },
    clone: function(callback, properties) {
      var data = JSON.stringify(this.toJSON(properties));
      this.cloneWithoutData(function(clone) {
        clone.loadFromJSON(data, function() {
          callback && callback(clone);
        });
      });
    },
    cloneWithoutData: function(callback) {
      var el = fabric2.util.createCanvasElement();
      el.width = this.width;
      el.height = this.height;
      var clone = new fabric2.Canvas(el);
      if (this.backgroundImage) {
        clone.setBackgroundImage(this.backgroundImage.src, function() {
          clone.renderAll();
          callback && callback(clone);
        });
        clone.backgroundImageOpacity = this.backgroundImageOpacity;
        clone.backgroundImageStretch = this.backgroundImageStretch;
      } else {
        callback && callback(clone);
      }
    }
  });
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, clone = fabric3.util.object.clone, toFixed = fabric3.util.toFixed, capitalize = fabric3.util.string.capitalize, degreesToRadians = fabric3.util.degreesToRadians, objectCaching = !fabric3.isLikelyNode, ALIASING_LIMIT = 2;
    if (fabric3.Object) {
      return;
    }
    fabric3.Object = fabric3.util.createClass(fabric3.CommonMethods, {
      type: "object",
      originX: "left",
      originY: "top",
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scaleX: 1,
      scaleY: 1,
      flipX: false,
      flipY: false,
      opacity: 1,
      angle: 0,
      skewX: 0,
      skewY: 0,
      cornerSize: 13,
      touchCornerSize: 24,
      transparentCorners: true,
      hoverCursor: null,
      moveCursor: null,
      padding: 0,
      borderColor: "rgb(178,204,255)",
      borderDashArray: null,
      cornerColor: "rgb(178,204,255)",
      cornerStrokeColor: null,
      cornerStyle: "rect",
      cornerDashArray: null,
      centeredScaling: false,
      centeredRotation: true,
      fill: "rgb(0,0,0)",
      fillRule: "nonzero",
      globalCompositeOperation: "source-over",
      backgroundColor: "",
      selectionBackgroundColor: "",
      stroke: null,
      strokeWidth: 1,
      strokeDashArray: null,
      strokeDashOffset: 0,
      strokeLineCap: "butt",
      strokeLineJoin: "miter",
      strokeMiterLimit: 4,
      shadow: null,
      borderOpacityWhenMoving: 0.4,
      borderScaleFactor: 1,
      minScaleLimit: 0,
      selectable: true,
      evented: true,
      visible: true,
      hasControls: true,
      hasBorders: true,
      perPixelTargetFind: false,
      includeDefaultValues: true,
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      lockSkewingX: false,
      lockSkewingY: false,
      lockScalingFlip: false,
      excludeFromExport: false,
      objectCaching,
      statefullCache: false,
      noScaleCache: true,
      strokeUniform: false,
      dirty: true,
      __corner: 0,
      paintFirst: "fill",
      activeOn: "down",
      stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform".split(" "),
      cacheProperties: "fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath".split(" "),
      colorProperties: "fill stroke backgroundColor".split(" "),
      clipPath: void 0,
      inverted: false,
      absolutePositioned: false,
      initialize: function(options) {
        if (options) {
          this.setOptions(options);
        }
      },
      _createCacheCanvas: function() {
        this._cacheProperties = {};
        this._cacheCanvas = fabric3.util.createCanvasElement();
        this._cacheContext = this._cacheCanvas.getContext("2d");
        this._updateCacheCanvas();
        this.dirty = true;
      },
      _limitCacheSize: function(dims) {
        var perfLimitSizeTotal = fabric3.perfLimitSizeTotal, width = dims.width, height = dims.height, max = fabric3.maxCacheSideLimit, min = fabric3.minCacheSideLimit;
        if (width <= max && height <= max && width * height <= perfLimitSizeTotal) {
          if (width < min) {
            dims.width = min;
          }
          if (height < min) {
            dims.height = min;
          }
          return dims;
        }
        var ar = width / height, limitedDims = fabric3.util.limitDimsByArea(ar, perfLimitSizeTotal), capValue = fabric3.util.capValue, x2 = capValue(min, limitedDims.x, max), y3 = capValue(min, limitedDims.y, max);
        if (width > x2) {
          dims.zoomX /= width / x2;
          dims.width = x2;
          dims.capped = true;
        }
        if (height > y3) {
          dims.zoomY /= height / y3;
          dims.height = y3;
          dims.capped = true;
        }
        return dims;
      },
      _getCacheCanvasDimensions: function() {
        var objectScale = this.getTotalObjectScaling(), dim = this._getTransformedDimensions(0, 0), neededX = dim.x * objectScale.scaleX / this.scaleX, neededY = dim.y * objectScale.scaleY / this.scaleY;
        return {
          width: neededX + ALIASING_LIMIT,
          height: neededY + ALIASING_LIMIT,
          zoomX: objectScale.scaleX,
          zoomY: objectScale.scaleY,
          x: neededX,
          y: neededY
        };
      },
      _updateCacheCanvas: function() {
        var targetCanvas = this.canvas;
        if (this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
          var target = targetCanvas._currentTransform.target, action = targetCanvas._currentTransform.action;
          if (this === target && action.slice && action.slice(0, 5) === "scale") {
            return false;
          }
        }
        var canvas = this._cacheCanvas, dims = this._limitCacheSize(this._getCacheCanvasDimensions()), minCacheSize = fabric3.minCacheSideLimit, width = dims.width, height = dims.height, drawingWidth, drawingHeight, zoomX = dims.zoomX, zoomY = dims.zoomY, dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight, zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY, shouldRedraw = dimensionsChanged || zoomChanged, additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
        if (dimensionsChanged) {
          var canvasWidth = this._cacheCanvas.width, canvasHeight = this._cacheCanvas.height, sizeGrowing = width > canvasWidth || height > canvasHeight, sizeShrinking = (width < canvasWidth * 0.9 || height < canvasHeight * 0.9) && canvasWidth > minCacheSize && canvasHeight > minCacheSize;
          shouldResizeCanvas = sizeGrowing || sizeShrinking;
          if (sizeGrowing && !dims.capped && (width > minCacheSize || height > minCacheSize)) {
            additionalWidth = width * 0.1;
            additionalHeight = height * 0.1;
          }
        }
        if (this instanceof fabric3.Text && this.path) {
          shouldRedraw = true;
          shouldResizeCanvas = true;
          additionalWidth += this.getHeightOfLine(0) * this.zoomX;
          additionalHeight += this.getHeightOfLine(0) * this.zoomY;
        }
        if (shouldRedraw) {
          if (shouldResizeCanvas) {
            canvas.width = Math.ceil(width + additionalWidth);
            canvas.height = Math.ceil(height + additionalHeight);
          } else {
            this._cacheContext.setTransform(1, 0, 0, 1, 0, 0);
            this._cacheContext.clearRect(0, 0, canvas.width, canvas.height);
          }
          drawingWidth = dims.x / 2;
          drawingHeight = dims.y / 2;
          this.cacheTranslationX = Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
          this.cacheTranslationY = Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
          this.cacheWidth = width;
          this.cacheHeight = height;
          this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY);
          this._cacheContext.scale(zoomX, zoomY);
          this.zoomX = zoomX;
          this.zoomY = zoomY;
          return true;
        }
        return false;
      },
      setOptions: function(options) {
        this._setOptions(options);
        this._initGradient(options.fill, "fill");
        this._initGradient(options.stroke, "stroke");
        this._initPattern(options.fill, "fill");
        this._initPattern(options.stroke, "stroke");
      },
      transform: function(ctx) {
        var needFullTransform = this.group && !this.group._transformDone || this.group && this.canvas && ctx === this.canvas.contextTop;
        var m3 = this.calcTransformMatrix(!needFullTransform);
        ctx.transform(m3[0], m3[1], m3[2], m3[3], m3[4], m3[5]);
      },
      toObject: function(propertiesToInclude) {
        var NUM_FRACTION_DIGITS = fabric3.Object.NUM_FRACTION_DIGITS, object = {
          type: this.type,
          version: fabric3.version,
          originX: this.originX,
          originY: this.originY,
          left: toFixed(this.left, NUM_FRACTION_DIGITS),
          top: toFixed(this.top, NUM_FRACTION_DIGITS),
          width: toFixed(this.width, NUM_FRACTION_DIGITS),
          height: toFixed(this.height, NUM_FRACTION_DIGITS),
          fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
          stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
          strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
          strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
          strokeLineCap: this.strokeLineCap,
          strokeDashOffset: this.strokeDashOffset,
          strokeLineJoin: this.strokeLineJoin,
          strokeUniform: this.strokeUniform,
          strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
          scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
          scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
          angle: toFixed(this.angle, NUM_FRACTION_DIGITS),
          flipX: this.flipX,
          flipY: this.flipY,
          opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
          shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
          visible: this.visible,
          backgroundColor: this.backgroundColor,
          fillRule: this.fillRule,
          paintFirst: this.paintFirst,
          globalCompositeOperation: this.globalCompositeOperation,
          skewX: toFixed(this.skewX, NUM_FRACTION_DIGITS),
          skewY: toFixed(this.skewY, NUM_FRACTION_DIGITS)
        };
        if (this.clipPath && !this.clipPath.excludeFromExport) {
          object.clipPath = this.clipPath.toObject(propertiesToInclude);
          object.clipPath.inverted = this.clipPath.inverted;
          object.clipPath.absolutePositioned = this.clipPath.absolutePositioned;
        }
        fabric3.util.populateWithProperties(this, object, propertiesToInclude);
        if (!this.includeDefaultValues) {
          object = this._removeDefaultValues(object);
        }
        return object;
      },
      toDatalessObject: function(propertiesToInclude) {
        return this.toObject(propertiesToInclude);
      },
      _removeDefaultValues: function(object) {
        var prototype = fabric3.util.getKlass(object.type).prototype, stateProperties = prototype.stateProperties;
        stateProperties.forEach(function(prop) {
          if (prop === "left" || prop === "top") {
            return;
          }
          if (object[prop] === prototype[prop]) {
            delete object[prop];
          }
          if (Array.isArray(object[prop]) && Array.isArray(prototype[prop]) && object[prop].length === 0 && prototype[prop].length === 0) {
            delete object[prop];
          }
        });
        return object;
      },
      toString: function() {
        return "#<fabric." + capitalize(this.type) + ">";
      },
      getObjectScaling: function() {
        if (!this.group) {
          return {
            scaleX: this.scaleX,
            scaleY: this.scaleY
          };
        }
        var options = fabric3.util.qrDecompose(this.calcTransformMatrix());
        return { scaleX: Math.abs(options.scaleX), scaleY: Math.abs(options.scaleY) };
      },
      getTotalObjectScaling: function() {
        var scale = this.getObjectScaling(), scaleX = scale.scaleX, scaleY = scale.scaleY;
        if (this.canvas) {
          var zoom = this.canvas.getZoom();
          var retina = this.canvas.getRetinaScaling();
          scaleX *= zoom * retina;
          scaleY *= zoom * retina;
        }
        return { scaleX, scaleY };
      },
      getObjectOpacity: function() {
        var opacity = this.opacity;
        if (this.group) {
          opacity *= this.group.getObjectOpacity();
        }
        return opacity;
      },
      _set: function(key, value) {
        var shouldConstrainValue = key === "scaleX" || key === "scaleY", isChanged = this[key] !== value, groupNeedsUpdate = false;
        if (shouldConstrainValue) {
          value = this._constrainScale(value);
        }
        if (key === "scaleX" && value < 0) {
          this.flipX = !this.flipX;
          value *= -1;
        } else if (key === "scaleY" && value < 0) {
          this.flipY = !this.flipY;
          value *= -1;
        } else if (key === "shadow" && value && !(value instanceof fabric3.Shadow)) {
          value = new fabric3.Shadow(value);
        } else if (key === "dirty" && this.group) {
          this.group.set("dirty", value);
        }
        this[key] = value;
        if (isChanged) {
          groupNeedsUpdate = this.group && this.group.isOnACache();
          if (this.cacheProperties.indexOf(key) > -1) {
            this.dirty = true;
            groupNeedsUpdate && this.group.set("dirty", true);
          } else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
            this.group.set("dirty", true);
          }
        }
        return this;
      },
      setOnGroup: function() {
      },
      getViewportTransform: function() {
        if (this.canvas && this.canvas.viewportTransform) {
          return this.canvas.viewportTransform;
        }
        return fabric3.iMatrix.concat();
      },
      isNotVisible: function() {
        return this.opacity === 0 || !this.width && !this.height && this.strokeWidth === 0 || !this.visible;
      },
      render: function(ctx) {
        if (this.isNotVisible()) {
          return;
        }
        if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
          return;
        }
        ctx.save();
        this._setupCompositeOperation(ctx);
        this.drawSelectionBackground(ctx);
        this.transform(ctx);
        this._setOpacity(ctx);
        this._setShadow(ctx, this);
        if (this.shouldCache()) {
          this.renderCache();
          this.drawCacheOnCanvas(ctx);
        } else {
          this._removeCacheCanvas();
          this.dirty = false;
          this.drawObject(ctx);
          if (this.objectCaching && this.statefullCache) {
            this.saveState({ propertySet: "cacheProperties" });
          }
        }
        ctx.restore();
      },
      renderCache: function(options) {
        options = options || {};
        if (!this._cacheCanvas || !this._cacheContext) {
          this._createCacheCanvas();
        }
        if (this.isCacheDirty()) {
          this.statefullCache && this.saveState({ propertySet: "cacheProperties" });
          this.drawObject(this._cacheContext, options.forClipping);
          this.dirty = false;
        }
      },
      _removeCacheCanvas: function() {
        this._cacheCanvas = null;
        this._cacheContext = null;
        this.cacheWidth = 0;
        this.cacheHeight = 0;
      },
      hasStroke: function() {
        return this.stroke && this.stroke !== "transparent" && this.strokeWidth !== 0;
      },
      hasFill: function() {
        return this.fill && this.fill !== "transparent";
      },
      needsItsOwnCache: function() {
        if (this.paintFirst === "stroke" && this.hasFill() && this.hasStroke() && typeof this.shadow === "object") {
          return true;
        }
        if (this.clipPath) {
          return true;
        }
        return false;
      },
      shouldCache: function() {
        this.ownCaching = this.needsItsOwnCache() || this.objectCaching && (!this.group || !this.group.isOnACache());
        return this.ownCaching;
      },
      willDrawShadow: function() {
        return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
      },
      drawClipPathOnCache: function(ctx, clipPath) {
        ctx.save();
        if (clipPath.inverted) {
          ctx.globalCompositeOperation = "destination-out";
        } else {
          ctx.globalCompositeOperation = "destination-in";
        }
        if (clipPath.absolutePositioned) {
          var m3 = fabric3.util.invertTransform(this.calcTransformMatrix());
          ctx.transform(m3[0], m3[1], m3[2], m3[3], m3[4], m3[5]);
        }
        clipPath.transform(ctx);
        ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
        ctx.drawImage(clipPath._cacheCanvas, -clipPath.cacheTranslationX, -clipPath.cacheTranslationY);
        ctx.restore();
      },
      drawObject: function(ctx, forClipping) {
        var originalFill = this.fill, originalStroke = this.stroke;
        if (forClipping) {
          this.fill = "black";
          this.stroke = "";
          this._setClippingProperties(ctx);
        } else {
          this._renderBackground(ctx);
        }
        this._render(ctx);
        this._drawClipPath(ctx, this.clipPath);
        this.fill = originalFill;
        this.stroke = originalStroke;
      },
      _drawClipPath: function(ctx, clipPath) {
        if (!clipPath) {
          return;
        }
        clipPath.canvas = this.canvas;
        clipPath.shouldCache();
        clipPath._transformDone = true;
        clipPath.renderCache({ forClipping: true });
        this.drawClipPathOnCache(ctx, clipPath);
      },
      drawCacheOnCanvas: function(ctx) {
        ctx.scale(1 / this.zoomX, 1 / this.zoomY);
        ctx.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY);
      },
      isCacheDirty: function(skipCanvas) {
        if (this.isNotVisible()) {
          return false;
        }
        if (this._cacheCanvas && this._cacheContext && !skipCanvas && this._updateCacheCanvas()) {
          return true;
        } else {
          if (this.dirty || this.clipPath && this.clipPath.absolutePositioned || this.statefullCache && this.hasStateChanged("cacheProperties")) {
            if (this._cacheCanvas && this._cacheContext && !skipCanvas) {
              var width = this.cacheWidth / this.zoomX;
              var height = this.cacheHeight / this.zoomY;
              this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
            }
            return true;
          }
        }
        return false;
      },
      _renderBackground: function(ctx) {
        if (!this.backgroundColor) {
          return;
        }
        var dim = this._getNonTransformedDimensions();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(
          -dim.x / 2,
          -dim.y / 2,
          dim.x,
          dim.y
        );
        this._removeShadow(ctx);
      },
      _setOpacity: function(ctx) {
        if (this.group && !this.group._transformDone) {
          ctx.globalAlpha = this.getObjectOpacity();
        } else {
          ctx.globalAlpha *= this.opacity;
        }
      },
      _setStrokeStyles: function(ctx, decl) {
        var stroke = decl.stroke;
        if (stroke) {
          ctx.lineWidth = decl.strokeWidth;
          ctx.lineCap = decl.strokeLineCap;
          ctx.lineDashOffset = decl.strokeDashOffset;
          ctx.lineJoin = decl.strokeLineJoin;
          ctx.miterLimit = decl.strokeMiterLimit;
          if (stroke.toLive) {
            if (stroke.gradientUnits === "percentage" || stroke.gradientTransform || stroke.patternTransform) {
              this._applyPatternForTransformedGradient(ctx, stroke);
            } else {
              ctx.strokeStyle = stroke.toLive(ctx, this);
              this._applyPatternGradientTransform(ctx, stroke);
            }
          } else {
            ctx.strokeStyle = decl.stroke;
          }
        }
      },
      _setFillStyles: function(ctx, decl) {
        var fill = decl.fill;
        if (fill) {
          if (fill.toLive) {
            ctx.fillStyle = fill.toLive(ctx, this);
            this._applyPatternGradientTransform(ctx, decl.fill);
          } else {
            ctx.fillStyle = fill;
          }
        }
      },
      _setClippingProperties: function(ctx) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "transparent";
        ctx.fillStyle = "#000000";
      },
      _setLineDash: function(ctx, dashArray) {
        if (!dashArray || dashArray.length === 0) {
          return;
        }
        if (1 & dashArray.length) {
          dashArray.push.apply(dashArray, dashArray);
        }
        ctx.setLineDash(dashArray);
      },
      _renderControls: function(ctx, styleOverride) {
        var vpt = this.getViewportTransform(), matrix = this.calcTransformMatrix(), options, drawBorders, drawControls;
        styleOverride = styleOverride || {};
        drawBorders = typeof styleOverride.hasBorders !== "undefined" ? styleOverride.hasBorders : this.hasBorders;
        drawControls = typeof styleOverride.hasControls !== "undefined" ? styleOverride.hasControls : this.hasControls;
        matrix = fabric3.util.multiplyTransformMatrices(vpt, matrix);
        options = fabric3.util.qrDecompose(matrix);
        ctx.save();
        ctx.translate(options.translateX, options.translateY);
        ctx.lineWidth = 1 * this.borderScaleFactor;
        if (!this.group) {
          ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        }
        if (this.flipX) {
          options.angle -= 180;
        }
        ctx.rotate(degreesToRadians(this.group ? options.angle : this.angle));
        if (styleOverride.forActiveSelection || this.group) {
          drawBorders && this.drawBordersInGroup(ctx, options, styleOverride);
        } else {
          drawBorders && this.drawBorders(ctx, styleOverride);
        }
        drawControls && this.drawControls(ctx, styleOverride);
        ctx.restore();
      },
      _setShadow: function(ctx) {
        if (!this.shadow) {
          return;
        }
        var shadow = this.shadow, canvas = this.canvas, scaling, multX = canvas && canvas.viewportTransform[0] || 1, multY = canvas && canvas.viewportTransform[3] || 1;
        if (shadow.nonScaling) {
          scaling = { scaleX: 1, scaleY: 1 };
        } else {
          scaling = this.getObjectScaling();
        }
        if (canvas && canvas._isRetinaScaling()) {
          multX *= fabric3.devicePixelRatio;
          multY *= fabric3.devicePixelRatio;
        }
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur * fabric3.browserShadowBlurConstant * (multX + multY) * (scaling.scaleX + scaling.scaleY) / 4;
        ctx.shadowOffsetX = shadow.offsetX * multX * scaling.scaleX;
        ctx.shadowOffsetY = shadow.offsetY * multY * scaling.scaleY;
      },
      _removeShadow: function(ctx) {
        if (!this.shadow) {
          return;
        }
        ctx.shadowColor = "";
        ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
      },
      _applyPatternGradientTransform: function(ctx, filler) {
        if (!filler || !filler.toLive) {
          return { offsetX: 0, offsetY: 0 };
        }
        var t2 = filler.gradientTransform || filler.patternTransform;
        var offsetX = -this.width / 2 + filler.offsetX || 0, offsetY = -this.height / 2 + filler.offsetY || 0;
        if (filler.gradientUnits === "percentage") {
          ctx.transform(this.width, 0, 0, this.height, offsetX, offsetY);
        } else {
          ctx.transform(1, 0, 0, 1, offsetX, offsetY);
        }
        if (t2) {
          ctx.transform(t2[0], t2[1], t2[2], t2[3], t2[4], t2[5]);
        }
        return { offsetX, offsetY };
      },
      _renderPaintInOrder: function(ctx) {
        if (this.paintFirst === "stroke") {
          this._renderStroke(ctx);
          this._renderFill(ctx);
        } else {
          this._renderFill(ctx);
          this._renderStroke(ctx);
        }
      },
      _render: function() {
      },
      _renderFill: function(ctx) {
        if (!this.fill) {
          return;
        }
        ctx.save();
        this._setFillStyles(ctx, this);
        if (this.fillRule === "evenodd") {
          ctx.fill("evenodd");
        } else {
          ctx.fill();
        }
        ctx.restore();
      },
      _renderStroke: function(ctx) {
        if (!this.stroke || this.strokeWidth === 0) {
          return;
        }
        if (this.shadow && !this.shadow.affectStroke) {
          this._removeShadow(ctx);
        }
        ctx.save();
        if (this.strokeUniform && this.group) {
          var scaling = this.getObjectScaling();
          ctx.scale(1 / scaling.scaleX, 1 / scaling.scaleY);
        } else if (this.strokeUniform) {
          ctx.scale(1 / this.scaleX, 1 / this.scaleY);
        }
        this._setLineDash(ctx, this.strokeDashArray);
        this._setStrokeStyles(ctx, this);
        ctx.stroke();
        ctx.restore();
      },
      _applyPatternForTransformedGradient: function(ctx, filler) {
        var dims = this._limitCacheSize(this._getCacheCanvasDimensions()), pCanvas = fabric3.util.createCanvasElement(), pCtx, retinaScaling = this.canvas.getRetinaScaling(), width = dims.x / this.scaleX / retinaScaling, height = dims.y / this.scaleY / retinaScaling;
        pCanvas.width = width;
        pCanvas.height = height;
        pCtx = pCanvas.getContext("2d");
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.lineTo(width, 0);
        pCtx.lineTo(width, height);
        pCtx.lineTo(0, height);
        pCtx.closePath();
        pCtx.translate(width / 2, height / 2);
        pCtx.scale(
          dims.zoomX / this.scaleX / retinaScaling,
          dims.zoomY / this.scaleY / retinaScaling
        );
        this._applyPatternGradientTransform(pCtx, filler);
        pCtx.fillStyle = filler.toLive(ctx);
        pCtx.fill();
        ctx.translate(-this.width / 2 - this.strokeWidth / 2, -this.height / 2 - this.strokeWidth / 2);
        ctx.scale(
          retinaScaling * this.scaleX / dims.zoomX,
          retinaScaling * this.scaleY / dims.zoomY
        );
        ctx.strokeStyle = pCtx.createPattern(pCanvas, "no-repeat");
      },
      _findCenterFromElement: function() {
        return { x: this.left + this.width / 2, y: this.top + this.height / 2 };
      },
      _assignTransformMatrixProps: function() {
        if (this.transformMatrix) {
          var options = fabric3.util.qrDecompose(this.transformMatrix);
          this.flipX = false;
          this.flipY = false;
          this.set("scaleX", options.scaleX);
          this.set("scaleY", options.scaleY);
          this.angle = options.angle;
          this.skewX = options.skewX;
          this.skewY = 0;
        }
      },
      _removeTransformMatrix: function(preserveAspectRatioOptions) {
        var center = this._findCenterFromElement();
        if (this.transformMatrix) {
          this._assignTransformMatrixProps();
          center = fabric3.util.transformPoint(center, this.transformMatrix);
        }
        this.transformMatrix = null;
        if (preserveAspectRatioOptions) {
          this.scaleX *= preserveAspectRatioOptions.scaleX;
          this.scaleY *= preserveAspectRatioOptions.scaleY;
          this.cropX = preserveAspectRatioOptions.cropX;
          this.cropY = preserveAspectRatioOptions.cropY;
          center.x += preserveAspectRatioOptions.offsetLeft;
          center.y += preserveAspectRatioOptions.offsetTop;
          this.width = preserveAspectRatioOptions.width;
          this.height = preserveAspectRatioOptions.height;
        }
        this.setPositionByOrigin(center, "center", "center");
      },
      clone: function(callback, propertiesToInclude) {
        var objectForm = this.toObject(propertiesToInclude);
        if (this.constructor.fromObject) {
          this.constructor.fromObject(objectForm, callback);
        } else {
          fabric3.Object._fromObject("Object", objectForm, callback);
        }
      },
      cloneAsImage: function(callback, options) {
        var canvasEl = this.toCanvasElement(options);
        if (callback) {
          callback(new fabric3.Image(canvasEl));
        }
        return this;
      },
      toCanvasElement: function(options) {
        options || (options = {});
        var utils = fabric3.util, origParams = utils.saveObjectTransform(this), originalGroup = this.group, originalShadow = this.shadow, abs = Math.abs, multiplier = (options.multiplier || 1) * (options.enableRetinaScaling ? fabric3.devicePixelRatio : 1);
        delete this.group;
        if (options.withoutTransform) {
          utils.resetObjectTransform(this);
        }
        if (options.withoutShadow) {
          this.shadow = null;
        }
        var el = fabric3.util.createCanvasElement(), boundingRect = this.getBoundingRect(true, true), shadow = this.shadow, scaling, shadowOffset = { x: 0, y: 0 }, shadowBlur, width, height;
        if (shadow) {
          shadowBlur = shadow.blur;
          if (shadow.nonScaling) {
            scaling = { scaleX: 1, scaleY: 1 };
          } else {
            scaling = this.getObjectScaling();
          }
          shadowOffset.x = 2 * Math.round(abs(shadow.offsetX) + shadowBlur) * abs(scaling.scaleX);
          shadowOffset.y = 2 * Math.round(abs(shadow.offsetY) + shadowBlur) * abs(scaling.scaleY);
        }
        width = boundingRect.width + shadowOffset.x;
        height = boundingRect.height + shadowOffset.y;
        el.width = Math.ceil(width);
        el.height = Math.ceil(height);
        var canvas = new fabric3.StaticCanvas(el, {
          enableRetinaScaling: false,
          renderOnAddRemove: false,
          skipOffscreen: false
        });
        if (options.format === "jpeg") {
          canvas.backgroundColor = "#fff";
        }
        this.setPositionByOrigin(new fabric3.Point(canvas.width / 2, canvas.height / 2), "center", "center");
        var originalCanvas = this.canvas;
        canvas.add(this);
        var canvasEl = canvas.toCanvasElement(multiplier || 1, options);
        this.shadow = originalShadow;
        this.set("canvas", originalCanvas);
        if (originalGroup) {
          this.group = originalGroup;
        }
        this.set(origParams).setCoords();
        canvas._objects = [];
        canvas.dispose();
        canvas = null;
        return canvasEl;
      },
      toDataURL: function(options) {
        options || (options = {});
        return fabric3.util.toDataURL(this.toCanvasElement(options), options.format || "png", options.quality || 1);
      },
      isType: function(type) {
        return arguments.length > 1 ? Array.from(arguments).includes(this.type) : this.type === type;
      },
      complexity: function() {
        return 1;
      },
      toJSON: function(propertiesToInclude) {
        return this.toObject(propertiesToInclude);
      },
      rotate: function(angle) {
        var shouldCenterOrigin = (this.originX !== "center" || this.originY !== "center") && this.centeredRotation;
        if (shouldCenterOrigin) {
          this._setOriginToCenter();
        }
        this.set("angle", angle);
        if (shouldCenterOrigin) {
          this._resetOrigin();
        }
        return this;
      },
      centerH: function() {
        this.canvas && this.canvas.centerObjectH(this);
        return this;
      },
      viewportCenterH: function() {
        this.canvas && this.canvas.viewportCenterObjectH(this);
        return this;
      },
      centerV: function() {
        this.canvas && this.canvas.centerObjectV(this);
        return this;
      },
      viewportCenterV: function() {
        this.canvas && this.canvas.viewportCenterObjectV(this);
        return this;
      },
      center: function() {
        this.canvas && this.canvas.centerObject(this);
        return this;
      },
      viewportCenter: function() {
        this.canvas && this.canvas.viewportCenterObject(this);
        return this;
      },
      getLocalPointer: function(e2, pointer) {
        pointer = pointer || this.canvas.getPointer(e2);
        var pClicked = new fabric3.Point(pointer.x, pointer.y), objectLeftTop = this._getLeftTopCoords();
        if (this.angle) {
          pClicked = fabric3.util.rotatePoint(
            pClicked,
            objectLeftTop,
            degreesToRadians(-this.angle)
          );
        }
        return {
          x: pClicked.x - objectLeftTop.x,
          y: pClicked.y - objectLeftTop.y
        };
      },
      _setupCompositeOperation: function(ctx) {
        if (this.globalCompositeOperation) {
          ctx.globalCompositeOperation = this.globalCompositeOperation;
        }
      },
      dispose: function() {
        if (fabric3.runningAnimations) {
          fabric3.runningAnimations.cancelByTarget(this);
        }
      }
    });
    fabric3.util.createAccessors && fabric3.util.createAccessors(fabric3.Object);
    extend(fabric3.Object.prototype, fabric3.Observable);
    fabric3.Object.NUM_FRACTION_DIGITS = 2;
    fabric3.Object.ENLIVEN_PROPS = ["clipPath"];
    fabric3.Object._fromObject = function(className, object, callback, extraParam) {
      var klass = fabric3[className];
      object = clone(object, true);
      fabric3.util.enlivenPatterns([object.fill, object.stroke], function(patterns2) {
        if (typeof patterns2[0] !== "undefined") {
          object.fill = patterns2[0];
        }
        if (typeof patterns2[1] !== "undefined") {
          object.stroke = patterns2[1];
        }
        fabric3.util.enlivenObjectEnlivables(object, object, function() {
          var instance = extraParam ? new klass(object[extraParam], object) : new klass(object);
          callback && callback(instance);
        });
      });
    };
    fabric3.Object.__uid = 0;
  })(exports);
  (function() {
    var degreesToRadians = fabric2.util.degreesToRadians, originXOffset = {
      left: -0.5,
      center: 0,
      right: 0.5
    }, originYOffset = {
      top: -0.5,
      center: 0,
      bottom: 0.5
    };
    fabric2.util.object.extend(fabric2.Object.prototype, {
      translateToGivenOrigin: function(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
        var x2 = point.x, y3 = point.y, offsetX, offsetY, dim;
        if (typeof fromOriginX === "string") {
          fromOriginX = originXOffset[fromOriginX];
        } else {
          fromOriginX -= 0.5;
        }
        if (typeof toOriginX === "string") {
          toOriginX = originXOffset[toOriginX];
        } else {
          toOriginX -= 0.5;
        }
        offsetX = toOriginX - fromOriginX;
        if (typeof fromOriginY === "string") {
          fromOriginY = originYOffset[fromOriginY];
        } else {
          fromOriginY -= 0.5;
        }
        if (typeof toOriginY === "string") {
          toOriginY = originYOffset[toOriginY];
        } else {
          toOriginY -= 0.5;
        }
        offsetY = toOriginY - fromOriginY;
        if (offsetX || offsetY) {
          dim = this._getTransformedDimensions();
          x2 = point.x + offsetX * dim.x;
          y3 = point.y + offsetY * dim.y;
        }
        return new fabric2.Point(x2, y3);
      },
      translateToCenterPoint: function(point, originX, originY) {
        var p = this.translateToGivenOrigin(point, originX, originY, "center", "center");
        if (this.angle) {
          return fabric2.util.rotatePoint(p, point, degreesToRadians(this.angle));
        }
        return p;
      },
      translateToOriginPoint: function(center, originX, originY) {
        var p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
        if (this.angle) {
          return fabric2.util.rotatePoint(p, center, degreesToRadians(this.angle));
        }
        return p;
      },
      getCenterPoint: function() {
        var leftTop = new fabric2.Point(this.left, this.top);
        return this.translateToCenterPoint(leftTop, this.originX, this.originY);
      },
      getPointByOrigin: function(originX, originY) {
        var center = this.getCenterPoint();
        return this.translateToOriginPoint(center, originX, originY);
      },
      toLocalPoint: function(point, originX, originY) {
        var center = this.getCenterPoint(), p, p2;
        if (typeof originX !== "undefined" && typeof originY !== "undefined") {
          p = this.translateToGivenOrigin(center, "center", "center", originX, originY);
        } else {
          p = new fabric2.Point(this.left, this.top);
        }
        p2 = new fabric2.Point(point.x, point.y);
        if (this.angle) {
          p2 = fabric2.util.rotatePoint(p2, center, -degreesToRadians(this.angle));
        }
        return p2.subtractEquals(p);
      },
      setPositionByOrigin: function(pos, originX, originY) {
        var center = this.translateToCenterPoint(pos, originX, originY), position = this.translateToOriginPoint(center, this.originX, this.originY);
        this.set("left", position.x);
        this.set("top", position.y);
      },
      adjustPosition: function(to) {
        var angle = degreesToRadians(this.angle), hypotFull = this.getScaledWidth(), xFull = fabric2.util.cos(angle) * hypotFull, yFull = fabric2.util.sin(angle) * hypotFull, offsetFrom, offsetTo;
        if (typeof this.originX === "string") {
          offsetFrom = originXOffset[this.originX];
        } else {
          offsetFrom = this.originX - 0.5;
        }
        if (typeof to === "string") {
          offsetTo = originXOffset[to];
        } else {
          offsetTo = to - 0.5;
        }
        this.left += xFull * (offsetTo - offsetFrom);
        this.top += yFull * (offsetTo - offsetFrom);
        this.setCoords();
        this.originX = to;
      },
      _setOriginToCenter: function() {
        this._originalOriginX = this.originX;
        this._originalOriginY = this.originY;
        var center = this.getCenterPoint();
        this.originX = "center";
        this.originY = "center";
        this.left = center.x;
        this.top = center.y;
      },
      _resetOrigin: function() {
        var originPoint = this.translateToOriginPoint(
          this.getCenterPoint(),
          this._originalOriginX,
          this._originalOriginY
        );
        this.originX = this._originalOriginX;
        this.originY = this._originalOriginY;
        this.left = originPoint.x;
        this.top = originPoint.y;
        this._originalOriginX = null;
        this._originalOriginY = null;
      },
      _getLeftTopCoords: function() {
        return this.translateToOriginPoint(this.getCenterPoint(), "left", "top");
      }
    });
  })();
  (function() {
    function arrayFromCoords(coords) {
      return [
        new fabric2.Point(coords.tl.x, coords.tl.y),
        new fabric2.Point(coords.tr.x, coords.tr.y),
        new fabric2.Point(coords.br.x, coords.br.y),
        new fabric2.Point(coords.bl.x, coords.bl.y)
      ];
    }
    var util = fabric2.util, degreesToRadians = util.degreesToRadians, multiplyMatrices = util.multiplyTransformMatrices, transformPoint = util.transformPoint;
    util.object.extend(fabric2.Object.prototype, {
      oCoords: null,
      aCoords: null,
      lineCoords: null,
      ownMatrixCache: null,
      matrixCache: null,
      controls: {},
      _getCoords: function(absolute, calculate) {
        if (calculate) {
          return absolute ? this.calcACoords() : this.calcLineCoords();
        }
        if (!this.aCoords || !this.lineCoords) {
          this.setCoords(true);
        }
        return absolute ? this.aCoords : this.lineCoords;
      },
      getCoords: function(absolute, calculate) {
        return arrayFromCoords(this._getCoords(absolute, calculate));
      },
      intersectsWithRect: function(pointTL, pointBR, absolute, calculate) {
        var coords = this.getCoords(absolute, calculate), intersection = fabric2.Intersection.intersectPolygonRectangle(
          coords,
          pointTL,
          pointBR
        );
        return intersection.status === "Intersection";
      },
      intersectsWithObject: function(other, absolute, calculate) {
        var intersection = fabric2.Intersection.intersectPolygonPolygon(
          this.getCoords(absolute, calculate),
          other.getCoords(absolute, calculate)
        );
        return intersection.status === "Intersection" || other.isContainedWithinObject(this, absolute, calculate) || this.isContainedWithinObject(other, absolute, calculate);
      },
      isContainedWithinObject: function(other, absolute, calculate) {
        var points = this.getCoords(absolute, calculate), otherCoords = absolute ? other.aCoords : other.lineCoords, i2 = 0, lines = other._getImageLines(otherCoords);
        for (; i2 < 4; i2++) {
          if (!other.containsPoint(points[i2], lines)) {
            return false;
          }
        }
        return true;
      },
      isContainedWithinRect: function(pointTL, pointBR, absolute, calculate) {
        var boundingRect = this.getBoundingRect(absolute, calculate);
        return boundingRect.left >= pointTL.x && boundingRect.left + boundingRect.width <= pointBR.x && boundingRect.top >= pointTL.y && boundingRect.top + boundingRect.height <= pointBR.y;
      },
      containsPoint: function(point, lines, absolute, calculate) {
        var coords = this._getCoords(absolute, calculate), lines = lines || this._getImageLines(coords), xPoints = this._findCrossPoints(point, lines);
        return xPoints !== 0 && xPoints % 2 === 1;
      },
      isOnScreen: function(calculate) {
        if (!this.canvas) {
          return false;
        }
        var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
        var points = this.getCoords(true, calculate);
        if (points.some(function(point) {
          return point.x <= pointBR.x && point.x >= pointTL.x && point.y <= pointBR.y && point.y >= pointTL.y;
        })) {
          return true;
        }
        if (this.intersectsWithRect(pointTL, pointBR, true, calculate)) {
          return true;
        }
        return this._containsCenterOfCanvas(pointTL, pointBR, calculate);
      },
      _containsCenterOfCanvas: function(pointTL, pointBR, calculate) {
        var centerPoint = { x: (pointTL.x + pointBR.x) / 2, y: (pointTL.y + pointBR.y) / 2 };
        if (this.containsPoint(centerPoint, null, true, calculate)) {
          return true;
        }
        return false;
      },
      isPartiallyOnScreen: function(calculate) {
        if (!this.canvas) {
          return false;
        }
        var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br;
        if (this.intersectsWithRect(pointTL, pointBR, true, calculate)) {
          return true;
        }
        var allPointsAreOutside = this.getCoords(true, calculate).every(function(point) {
          return (point.x >= pointBR.x || point.x <= pointTL.x) && (point.y >= pointBR.y || point.y <= pointTL.y);
        });
        return allPointsAreOutside && this._containsCenterOfCanvas(pointTL, pointBR, calculate);
      },
      _getImageLines: function(oCoords) {
        var lines = {
          topline: {
            o: oCoords.tl,
            d: oCoords.tr
          },
          rightline: {
            o: oCoords.tr,
            d: oCoords.br
          },
          bottomline: {
            o: oCoords.br,
            d: oCoords.bl
          },
          leftline: {
            o: oCoords.bl,
            d: oCoords.tl
          }
        };
        return lines;
      },
      _findCrossPoints: function(point, lines) {
        var b1, b2, a1, a22, xi, xcount = 0, iLine;
        for (var lineKey in lines) {
          iLine = lines[lineKey];
          if (iLine.o.y < point.y && iLine.d.y < point.y) {
            continue;
          }
          if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
            continue;
          }
          if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
            xi = iLine.o.x;
          } else {
            b1 = 0;
            b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
            a1 = point.y - b1 * point.x;
            a22 = iLine.o.y - b2 * iLine.o.x;
            xi = -(a1 - a22) / (b1 - b2);
          }
          if (xi >= point.x) {
            xcount += 1;
          }
          if (xcount === 2) {
            break;
          }
        }
        return xcount;
      },
      getBoundingRect: function(absolute, calculate) {
        var coords = this.getCoords(absolute, calculate);
        return util.makeBoundingBoxFromPoints(coords);
      },
      getScaledWidth: function() {
        return this._getTransformedDimensions().x;
      },
      getScaledHeight: function() {
        return this._getTransformedDimensions().y;
      },
      _constrainScale: function(value) {
        if (Math.abs(value) < this.minScaleLimit) {
          if (value < 0) {
            return -this.minScaleLimit;
          } else {
            return this.minScaleLimit;
          }
        } else if (value === 0) {
          return 1e-4;
        }
        return value;
      },
      scale: function(value) {
        this._set("scaleX", value);
        this._set("scaleY", value);
        return this.setCoords();
      },
      scaleToWidth: function(value, absolute) {
        var boundingRectFactor = this.getBoundingRect(absolute).width / this.getScaledWidth();
        return this.scale(value / this.width / boundingRectFactor);
      },
      scaleToHeight: function(value, absolute) {
        var boundingRectFactor = this.getBoundingRect(absolute).height / this.getScaledHeight();
        return this.scale(value / this.height / boundingRectFactor);
      },
      calcLineCoords: function() {
        var vpt = this.getViewportTransform(), padding = this.padding, angle = degreesToRadians(this.angle), cos = util.cos(angle), sin = util.sin(angle), cosP = cos * padding, sinP = sin * padding, cosPSinP = cosP + sinP, cosPMinusSinP = cosP - sinP, aCoords = this.calcACoords();
        var lineCoords = {
          tl: transformPoint(aCoords.tl, vpt),
          tr: transformPoint(aCoords.tr, vpt),
          bl: transformPoint(aCoords.bl, vpt),
          br: transformPoint(aCoords.br, vpt)
        };
        if (padding) {
          lineCoords.tl.x -= cosPMinusSinP;
          lineCoords.tl.y -= cosPSinP;
          lineCoords.tr.x += cosPSinP;
          lineCoords.tr.y -= cosPMinusSinP;
          lineCoords.bl.x -= cosPSinP;
          lineCoords.bl.y += cosPMinusSinP;
          lineCoords.br.x += cosPMinusSinP;
          lineCoords.br.y += cosPSinP;
        }
        return lineCoords;
      },
      calcOCoords: function() {
        var rotateMatrix = this._calcRotateMatrix(), translateMatrix = this._calcTranslateMatrix(), vpt = this.getViewportTransform(), startMatrix = multiplyMatrices(vpt, translateMatrix), finalMatrix = multiplyMatrices(startMatrix, rotateMatrix), finalMatrix = multiplyMatrices(finalMatrix, [1 / vpt[0], 0, 0, 1 / vpt[3], 0, 0]), dim = this._calculateCurrentDimensions(), coords = {};
        this.forEachControl(function(control, key, fabricObject) {
          coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
        });
        return coords;
      },
      calcACoords: function() {
        var rotateMatrix = this._calcRotateMatrix(), translateMatrix = this._calcTranslateMatrix(), finalMatrix = multiplyMatrices(translateMatrix, rotateMatrix), dim = this._getTransformedDimensions(), w2 = dim.x / 2, h3 = dim.y / 2;
        return {
          tl: transformPoint({ x: -w2, y: -h3 }, finalMatrix),
          tr: transformPoint({ x: w2, y: -h3 }, finalMatrix),
          bl: transformPoint({ x: -w2, y: h3 }, finalMatrix),
          br: transformPoint({ x: w2, y: h3 }, finalMatrix)
        };
      },
      setCoords: function(skipCorners) {
        this.aCoords = this.calcACoords();
        this.lineCoords = this.group ? this.aCoords : this.calcLineCoords();
        if (skipCorners) {
          return this;
        }
        this.oCoords = this.calcOCoords();
        this._setCornerCoords && this._setCornerCoords();
        return this;
      },
      _calcRotateMatrix: function() {
        return util.calcRotateMatrix(this);
      },
      _calcTranslateMatrix: function() {
        var center = this.getCenterPoint();
        return [1, 0, 0, 1, center.x, center.y];
      },
      transformMatrixKey: function(skipGroup) {
        var sep = "_", prefix = "";
        if (!skipGroup && this.group) {
          prefix = this.group.transformMatrixKey(skipGroup) + sep;
        }
        return prefix + this.top + sep + this.left + sep + this.scaleX + sep + this.scaleY + sep + this.skewX + sep + this.skewY + sep + this.angle + sep + this.originX + sep + this.originY + sep + this.width + sep + this.height + sep + this.strokeWidth + this.flipX + this.flipY;
      },
      calcTransformMatrix: function(skipGroup) {
        var matrix = this.calcOwnMatrix();
        if (skipGroup || !this.group) {
          return matrix;
        }
        var key = this.transformMatrixKey(skipGroup), cache = this.matrixCache || (this.matrixCache = {});
        if (cache.key === key) {
          return cache.value;
        }
        if (this.group) {
          matrix = multiplyMatrices(this.group.calcTransformMatrix(false), matrix);
        }
        cache.key = key;
        cache.value = matrix;
        return matrix;
      },
      calcOwnMatrix: function() {
        var key = this.transformMatrixKey(true), cache = this.ownMatrixCache || (this.ownMatrixCache = {});
        if (cache.key === key) {
          return cache.value;
        }
        var tMatrix = this._calcTranslateMatrix(), options = {
          angle: this.angle,
          translateX: tMatrix[4],
          translateY: tMatrix[5],
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          skewX: this.skewX,
          skewY: this.skewY,
          flipX: this.flipX,
          flipY: this.flipY
        };
        cache.key = key;
        cache.value = util.composeMatrix(options);
        return cache.value;
      },
      _getNonTransformedDimensions: function() {
        var strokeWidth = this.strokeWidth, w2 = this.width + strokeWidth, h3 = this.height + strokeWidth;
        return { x: w2, y: h3 };
      },
      _getTransformedDimensions: function(skewX, skewY) {
        if (typeof skewX === "undefined") {
          skewX = this.skewX;
        }
        if (typeof skewY === "undefined") {
          skewY = this.skewY;
        }
        var dimensions, dimX, dimY, noSkew = skewX === 0 && skewY === 0;
        if (this.strokeUniform) {
          dimX = this.width;
          dimY = this.height;
        } else {
          dimensions = this._getNonTransformedDimensions();
          dimX = dimensions.x;
          dimY = dimensions.y;
        }
        if (noSkew) {
          return this._finalizeDimensions(dimX * this.scaleX, dimY * this.scaleY);
        }
        var bbox = util.sizeAfterTransform(dimX, dimY, {
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          skewX,
          skewY
        });
        return this._finalizeDimensions(bbox.x, bbox.y);
      },
      _finalizeDimensions: function(width, height) {
        return this.strokeUniform ? { x: width + this.strokeWidth, y: height + this.strokeWidth } : { x: width, y: height };
      },
      _calculateCurrentDimensions: function() {
        var vpt = this.getViewportTransform(), dim = this._getTransformedDimensions(), p = transformPoint(dim, vpt, true);
        return p.scalarAdd(2 * this.padding);
      }
    });
  })();
  fabric2.util.object.extend(fabric2.Object.prototype, {
    sendToBack: function() {
      if (this.group) {
        fabric2.StaticCanvas.prototype.sendToBack.call(this.group, this);
      } else if (this.canvas) {
        this.canvas.sendToBack(this);
      }
      return this;
    },
    bringToFront: function() {
      if (this.group) {
        fabric2.StaticCanvas.prototype.bringToFront.call(this.group, this);
      } else if (this.canvas) {
        this.canvas.bringToFront(this);
      }
      return this;
    },
    sendBackwards: function(intersecting) {
      if (this.group) {
        fabric2.StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
      } else if (this.canvas) {
        this.canvas.sendBackwards(this, intersecting);
      }
      return this;
    },
    bringForward: function(intersecting) {
      if (this.group) {
        fabric2.StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
      } else if (this.canvas) {
        this.canvas.bringForward(this, intersecting);
      }
      return this;
    },
    moveTo: function(index) {
      if (this.group && this.group.type !== "activeSelection") {
        fabric2.StaticCanvas.prototype.moveTo.call(this.group, this, index);
      } else if (this.canvas) {
        this.canvas.moveTo(this, index);
      }
      return this;
    }
  });
  (function() {
    function getSvgColorString(prop, value) {
      if (!value) {
        return prop + ": none; ";
      } else if (value.toLive) {
        return prop + ": url(#SVGID_" + value.id + "); ";
      } else {
        var color = new fabric2.Color(value), str = prop + ": " + color.toRgb() + "; ", opacity = color.getAlpha();
        if (opacity !== 1) {
          str += prop + "-opacity: " + opacity.toString() + "; ";
        }
        return str;
      }
    }
    var toFixed = fabric2.util.toFixed;
    fabric2.util.object.extend(fabric2.Object.prototype, {
      getSvgStyles: function(skipShadow) {
        var fillRule = this.fillRule ? this.fillRule : "nonzero", strokeWidth = this.strokeWidth ? this.strokeWidth : "0", strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none", strokeDashOffset = this.strokeDashOffset ? this.strokeDashOffset : "0", strokeLineCap = this.strokeLineCap ? this.strokeLineCap : "butt", strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : "miter", strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : "4", opacity = typeof this.opacity !== "undefined" ? this.opacity : "1", visibility = this.visible ? "" : " visibility: hidden;", filter = skipShadow ? "" : this.getSvgFilter(), fill = getSvgColorString("fill", this.fill), stroke = getSvgColorString("stroke", this.stroke);
        return [
          stroke,
          "stroke-width: ",
          strokeWidth,
          "; ",
          "stroke-dasharray: ",
          strokeDashArray,
          "; ",
          "stroke-linecap: ",
          strokeLineCap,
          "; ",
          "stroke-dashoffset: ",
          strokeDashOffset,
          "; ",
          "stroke-linejoin: ",
          strokeLineJoin,
          "; ",
          "stroke-miterlimit: ",
          strokeMiterLimit,
          "; ",
          fill,
          "fill-rule: ",
          fillRule,
          "; ",
          "opacity: ",
          opacity,
          ";",
          filter,
          visibility
        ].join("");
      },
      getSvgSpanStyles: function(style, useWhiteSpace) {
        var term = "; ";
        var fontFamily = style.fontFamily ? "font-family: " + (style.fontFamily.indexOf("'") === -1 && style.fontFamily.indexOf('"') === -1 ? "'" + style.fontFamily + "'" : style.fontFamily) + term : "";
        var strokeWidth = style.strokeWidth ? "stroke-width: " + style.strokeWidth + term : "", fontFamily = fontFamily, fontSize = style.fontSize ? "font-size: " + style.fontSize + "px" + term : "", fontStyle = style.fontStyle ? "font-style: " + style.fontStyle + term : "", fontWeight = style.fontWeight ? "font-weight: " + style.fontWeight + term : "", fill = style.fill ? getSvgColorString("fill", style.fill) : "", stroke = style.stroke ? getSvgColorString("stroke", style.stroke) : "", textDecoration = this.getSvgTextDecoration(style), deltaY = style.deltaY ? "baseline-shift: " + -style.deltaY + "; " : "";
        if (textDecoration) {
          textDecoration = "text-decoration: " + textDecoration + term;
        }
        return [
          stroke,
          strokeWidth,
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
          textDecoration,
          fill,
          deltaY,
          useWhiteSpace ? "white-space: pre; " : ""
        ].join("");
      },
      getSvgTextDecoration: function(style) {
        return ["overline", "underline", "line-through"].filter(function(decoration) {
          return style[decoration.replace("-", "")];
        }).join(" ");
      },
      getSvgFilter: function() {
        return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "";
      },
      getSvgCommons: function() {
        return [
          this.id ? 'id="' + this.id + '" ' : "",
          this.clipPath ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : ""
        ].join("");
      },
      getSvgTransform: function(full, additionalTransform) {
        var transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix(), svgTransform = 'transform="' + fabric2.util.matrixToSVG(transform);
        return svgTransform + (additionalTransform || "") + '" ';
      },
      _setSVGBg: function(textBgRects) {
        if (this.backgroundColor) {
          var NUM_FRACTION_DIGITS = fabric2.Object.NUM_FRACTION_DIGITS;
          textBgRects.push(
            "		<rect ",
            this._getFillAttributes(this.backgroundColor),
            ' x="',
            toFixed(-this.width / 2, NUM_FRACTION_DIGITS),
            '" y="',
            toFixed(-this.height / 2, NUM_FRACTION_DIGITS),
            '" width="',
            toFixed(this.width, NUM_FRACTION_DIGITS),
            '" height="',
            toFixed(this.height, NUM_FRACTION_DIGITS),
            '"></rect>\n'
          );
        }
      },
      toSVG: function(reviver) {
        return this._createBaseSVGMarkup(this._toSVG(reviver), { reviver });
      },
      toClipPathSVG: function(reviver) {
        return "	" + this._createBaseClipPathSVGMarkup(this._toSVG(reviver), { reviver });
      },
      _createBaseClipPathSVGMarkup: function(objectMarkup, options) {
        options = options || {};
        var reviver = options.reviver, additionalTransform = options.additionalTransform || "", commonPieces = [
          this.getSvgTransform(true, additionalTransform),
          this.getSvgCommons()
        ].join(""), index = objectMarkup.indexOf("COMMON_PARTS");
        objectMarkup[index] = commonPieces;
        return reviver ? reviver(objectMarkup.join("")) : objectMarkup.join("");
      },
      _createBaseSVGMarkup: function(objectMarkup, options) {
        options = options || {};
        var noStyle = options.noStyle, reviver = options.reviver, styleInfo = noStyle ? "" : 'style="' + this.getSvgStyles() + '" ', shadowInfo = options.withShadow ? 'style="' + this.getSvgFilter() + '" ' : "", clipPath = this.clipPath, vectorEffect = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : "", absoluteClipPath = clipPath && clipPath.absolutePositioned, stroke = this.stroke, fill = this.fill, shadow = this.shadow, commonPieces, markup = [], clipPathMarkup, index = objectMarkup.indexOf("COMMON_PARTS"), additionalTransform = options.additionalTransform;
        if (clipPath) {
          clipPath.clipPathId = "CLIPPATH_" + fabric2.Object.__uid++;
          clipPathMarkup = '<clipPath id="' + clipPath.clipPathId + '" >\n' + clipPath.toClipPathSVG(reviver) + "</clipPath>\n";
        }
        if (absoluteClipPath) {
          markup.push(
            "<g ",
            shadowInfo,
            this.getSvgCommons(),
            " >\n"
          );
        }
        markup.push(
          "<g ",
          this.getSvgTransform(false),
          !absoluteClipPath ? shadowInfo + this.getSvgCommons() : "",
          " >\n"
        );
        commonPieces = [
          styleInfo,
          vectorEffect,
          noStyle ? "" : this.addPaintOrder(),
          " ",
          additionalTransform ? 'transform="' + additionalTransform + '" ' : ""
        ].join("");
        objectMarkup[index] = commonPieces;
        if (fill && fill.toLive) {
          markup.push(fill.toSVG(this));
        }
        if (stroke && stroke.toLive) {
          markup.push(stroke.toSVG(this));
        }
        if (shadow) {
          markup.push(shadow.toSVG(this));
        }
        if (clipPath) {
          markup.push(clipPathMarkup);
        }
        markup.push(objectMarkup.join(""));
        markup.push("</g>\n");
        absoluteClipPath && markup.push("</g>\n");
        return reviver ? reviver(markup.join("")) : markup.join("");
      },
      addPaintOrder: function() {
        return this.paintFirst !== "fill" ? ' paint-order="' + this.paintFirst + '" ' : "";
      }
    });
  })();
  (function() {
    var extend = fabric2.util.object.extend, originalSet = "stateProperties";
    function saveProps(origin, destination, props) {
      var tmpObj = {}, deep = true;
      props.forEach(function(prop) {
        tmpObj[prop] = origin[prop];
      });
      extend(origin[destination], tmpObj, deep);
    }
    function _isEqual(origValue, currentValue, firstPass) {
      if (origValue === currentValue) {
        return true;
      } else if (Array.isArray(origValue)) {
        if (!Array.isArray(currentValue) || origValue.length !== currentValue.length) {
          return false;
        }
        for (var i2 = 0, len = origValue.length; i2 < len; i2++) {
          if (!_isEqual(origValue[i2], currentValue[i2])) {
            return false;
          }
        }
        return true;
      } else if (origValue && typeof origValue === "object") {
        var keys = Object.keys(origValue), key;
        if (!currentValue || typeof currentValue !== "object" || !firstPass && keys.length !== Object.keys(currentValue).length) {
          return false;
        }
        for (var i2 = 0, len = keys.length; i2 < len; i2++) {
          key = keys[i2];
          if (key === "canvas" || key === "group") {
            continue;
          }
          if (!_isEqual(origValue[key], currentValue[key])) {
            return false;
          }
        }
        return true;
      }
    }
    fabric2.util.object.extend(fabric2.Object.prototype, {
      hasStateChanged: function(propertySet) {
        propertySet = propertySet || originalSet;
        var dashedPropertySet = "_" + propertySet;
        if (Object.keys(this[dashedPropertySet]).length < this[propertySet].length) {
          return true;
        }
        return !_isEqual(this[dashedPropertySet], this, true);
      },
      saveState: function(options) {
        var propertySet = options && options.propertySet || originalSet, destination = "_" + propertySet;
        if (!this[destination]) {
          return this.setupState(options);
        }
        saveProps(this, destination, this[propertySet]);
        if (options && options.stateProperties) {
          saveProps(this, destination, options.stateProperties);
        }
        return this;
      },
      setupState: function(options) {
        options = options || {};
        var propertySet = options.propertySet || originalSet;
        options.propertySet = propertySet;
        this["_" + propertySet] = {};
        this.saveState(options);
        return this;
      }
    });
  })();
  (function() {
    var degreesToRadians = fabric2.util.degreesToRadians;
    fabric2.util.object.extend(fabric2.Object.prototype, {
      _findTargetCorner: function(pointer, forTouch) {
        if (!this.hasControls || this.group || (!this.canvas || this.canvas._activeObject !== this)) {
          return false;
        }
        var ex = pointer.x, ey = pointer.y, xPoints, lines, keys = Object.keys(this.oCoords), j = keys.length - 1, i2;
        this.__corner = 0;
        for (; j >= 0; j--) {
          i2 = keys[j];
          if (!this.isControlVisible(i2)) {
            continue;
          }
          lines = this._getImageLines(forTouch ? this.oCoords[i2].touchCorner : this.oCoords[i2].corner);
          xPoints = this._findCrossPoints({ x: ex, y: ey }, lines);
          if (xPoints !== 0 && xPoints % 2 === 1) {
            this.__corner = i2;
            return i2;
          }
        }
        return false;
      },
      forEachControl: function(fn) {
        for (var i2 in this.controls) {
          fn(this.controls[i2], i2, this);
        }
      },
      _setCornerCoords: function() {
        var coords = this.oCoords;
        for (var control in coords) {
          var controlObject = this.controls[control];
          coords[control].corner = controlObject.calcCornerCoords(
            this.angle,
            this.cornerSize,
            coords[control].x,
            coords[control].y,
            false
          );
          coords[control].touchCorner = controlObject.calcCornerCoords(
            this.angle,
            this.touchCornerSize,
            coords[control].x,
            coords[control].y,
            true
          );
        }
      },
      drawSelectionBackground: function(ctx) {
        if (!this.selectionBackgroundColor || this.canvas && !this.canvas.interactive || this.canvas && this.canvas._activeObject !== this) {
          return this;
        }
        ctx.save();
        var center = this.getCenterPoint(), wh = this._calculateCurrentDimensions(), vpt = this.canvas.viewportTransform;
        ctx.translate(center.x, center.y);
        ctx.scale(1 / vpt[0], 1 / vpt[3]);
        ctx.rotate(degreesToRadians(this.angle));
        ctx.fillStyle = this.selectionBackgroundColor;
        ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
        ctx.restore();
        return this;
      },
      drawBorders: function(ctx, styleOverride) {
        styleOverride = styleOverride || {};
        var wh = this._calculateCurrentDimensions(), strokeWidth = this.borderScaleFactor, width = wh.x + strokeWidth, height = wh.y + strokeWidth, hasControls = typeof styleOverride.hasControls !== "undefined" ? styleOverride.hasControls : this.hasControls, shouldStroke = false;
        ctx.save();
        ctx.strokeStyle = styleOverride.borderColor || this.borderColor;
        this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray);
        ctx.strokeRect(
          -width / 2,
          -height / 2,
          width,
          height
        );
        if (hasControls) {
          ctx.beginPath();
          this.forEachControl(function(control, key, fabricObject) {
            if (control.withConnection && control.getVisibility(fabricObject, key)) {
              shouldStroke = true;
              ctx.moveTo(control.x * width, control.y * height);
              ctx.lineTo(
                control.x * width + control.offsetX,
                control.y * height + control.offsetY
              );
            }
          });
          if (shouldStroke) {
            ctx.stroke();
          }
        }
        ctx.restore();
        return this;
      },
      drawBordersInGroup: function(ctx, options, styleOverride) {
        styleOverride = styleOverride || {};
        var bbox = fabric2.util.sizeAfterTransform(this.width, this.height, options), strokeWidth = this.strokeWidth, strokeUniform = this.strokeUniform, borderScaleFactor = this.borderScaleFactor, width = bbox.x + strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleX) + borderScaleFactor, height = bbox.y + strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleY) + borderScaleFactor;
        ctx.save();
        this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray);
        ctx.strokeStyle = styleOverride.borderColor || this.borderColor;
        ctx.strokeRect(
          -width / 2,
          -height / 2,
          width,
          height
        );
        ctx.restore();
        return this;
      },
      drawControls: function(ctx, styleOverride) {
        styleOverride = styleOverride || {};
        ctx.save();
        var retinaScaling = this.canvas.getRetinaScaling(), matrix, p;
        ctx.setTransform(retinaScaling, 0, 0, retinaScaling, 0, 0);
        ctx.strokeStyle = ctx.fillStyle = styleOverride.cornerColor || this.cornerColor;
        if (!this.transparentCorners) {
          ctx.strokeStyle = styleOverride.cornerStrokeColor || this.cornerStrokeColor;
        }
        this._setLineDash(ctx, styleOverride.cornerDashArray || this.cornerDashArray);
        this.setCoords();
        if (this.group) {
          matrix = this.group.calcTransformMatrix();
        }
        this.forEachControl(function(control, key, fabricObject) {
          p = fabricObject.oCoords[key];
          if (control.getVisibility(fabricObject, key)) {
            if (matrix) {
              p = fabric2.util.transformPoint(p, matrix);
            }
            control.render(ctx, p.x, p.y, styleOverride, fabricObject);
          }
        });
        ctx.restore();
        return this;
      },
      isControlVisible: function(controlKey) {
        return this.controls[controlKey] && this.controls[controlKey].getVisibility(this, controlKey);
      },
      setControlVisible: function(controlKey, visible) {
        if (!this._controlsVisibility) {
          this._controlsVisibility = {};
        }
        this._controlsVisibility[controlKey] = visible;
        return this;
      },
      setControlsVisibility: function(options) {
        options || (options = {});
        for (var p in options) {
          this.setControlVisible(p, options[p]);
        }
        return this;
      },
      onDeselect: function() {
      },
      onSelect: function() {
      }
    });
  })();
  fabric2.util.object.extend(fabric2.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(object, callbacks) {
      callbacks = callbacks || {};
      var empty = function() {
      }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
      return fabric2.util.animate({
        target: this,
        startValue: object.left,
        endValue: this.getCenterPoint().x,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set("left", value);
          _this.requestRenderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });
    },
    fxCenterObjectV: function(object, callbacks) {
      callbacks = callbacks || {};
      var empty = function() {
      }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
      return fabric2.util.animate({
        target: this,
        startValue: object.top,
        endValue: this.getCenterPoint().y,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set("top", value);
          _this.requestRenderAll();
          onChange();
        },
        onComplete: function() {
          object.setCoords();
          onComplete();
        }
      });
    },
    fxRemove: function(object, callbacks) {
      callbacks = callbacks || {};
      var empty = function() {
      }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
      return fabric2.util.animate({
        target: this,
        startValue: object.opacity,
        endValue: 0,
        duration: this.FX_DURATION,
        onChange: function(value) {
          object.set("opacity", value);
          _this.requestRenderAll();
          onChange();
        },
        onComplete: function() {
          _this.remove(object);
          onComplete();
        }
      });
    }
  });
  fabric2.util.object.extend(fabric2.Object.prototype, {
    animate: function() {
      if (arguments[0] && typeof arguments[0] === "object") {
        var propsToAnimate = [], prop, skipCallbacks, out = [];
        for (prop in arguments[0]) {
          propsToAnimate.push(prop);
        }
        for (var i2 = 0, len = propsToAnimate.length; i2 < len; i2++) {
          prop = propsToAnimate[i2];
          skipCallbacks = i2 !== len - 1;
          out.push(this._animate(prop, arguments[0][prop], arguments[1], skipCallbacks));
        }
        return out;
      } else {
        return this._animate.apply(this, arguments);
      }
    },
    _animate: function(property, to, options, skipCallbacks) {
      var _this = this, propPair;
      to = to.toString();
      if (!options) {
        options = {};
      } else {
        options = fabric2.util.object.clone(options);
      }
      if (~property.indexOf(".")) {
        propPair = property.split(".");
      }
      var propIsColor = _this.colorProperties.indexOf(property) > -1 || propPair && _this.colorProperties.indexOf(propPair[1]) > -1;
      var currentValue = propPair ? this.get(propPair[0])[propPair[1]] : this.get(property);
      if (!("from" in options)) {
        options.from = currentValue;
      }
      if (!propIsColor) {
        if (~to.indexOf("=")) {
          to = currentValue + parseFloat(to.replace("=", ""));
        } else {
          to = parseFloat(to);
        }
      }
      var _options = {
        target: this,
        startValue: options.from,
        endValue: to,
        byValue: options.by,
        easing: options.easing,
        duration: options.duration,
        abort: options.abort && function(value, valueProgress, timeProgress) {
          return options.abort.call(_this, value, valueProgress, timeProgress);
        },
        onChange: function(value, valueProgress, timeProgress) {
          if (propPair) {
            _this[propPair[0]][propPair[1]] = value;
          } else {
            _this.set(property, value);
          }
          if (skipCallbacks) {
            return;
          }
          options.onChange && options.onChange(value, valueProgress, timeProgress);
        },
        onComplete: function(value, valueProgress, timeProgress) {
          if (skipCallbacks) {
            return;
          }
          _this.setCoords();
          options.onComplete && options.onComplete(value, valueProgress, timeProgress);
        }
      };
      if (propIsColor) {
        return fabric2.util.animateColor(_options.startValue, _options.endValue, _options.duration, _options);
      } else {
        return fabric2.util.animate(_options);
      }
    }
  });
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, clone = fabric3.util.object.clone, coordProps = { x1: 1, x2: 1, y1: 1, y2: 1 };
    if (fabric3.Line) {
      fabric3.warn("fabric.Line is already defined");
      return;
    }
    fabric3.Line = fabric3.util.createClass(fabric3.Object, {
      type: "line",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
      initialize: function(points, options) {
        if (!points) {
          points = [0, 0, 0, 0];
        }
        this.callSuper("initialize", options);
        this.set("x1", points[0]);
        this.set("y1", points[1]);
        this.set("x2", points[2]);
        this.set("y2", points[3]);
        this._setWidthHeight(options);
      },
      _setWidthHeight: function(options) {
        options || (options = {});
        this.width = Math.abs(this.x2 - this.x1);
        this.height = Math.abs(this.y2 - this.y1);
        this.left = "left" in options ? options.left : this._getLeftToOriginX();
        this.top = "top" in options ? options.top : this._getTopToOriginY();
      },
      _set: function(key, value) {
        this.callSuper("_set", key, value);
        if (typeof coordProps[key] !== "undefined") {
          this._setWidthHeight();
        }
        return this;
      },
      _getLeftToOriginX: makeEdgeToOriginGetter(
        {
          origin: "originX",
          axis1: "x1",
          axis2: "x2",
          dimension: "width"
        },
        {
          nearest: "left",
          center: "center",
          farthest: "right"
        }
      ),
      _getTopToOriginY: makeEdgeToOriginGetter(
        {
          origin: "originY",
          axis1: "y1",
          axis2: "y2",
          dimension: "height"
        },
        {
          nearest: "top",
          center: "center",
          farthest: "bottom"
        }
      ),
      _render: function(ctx) {
        ctx.beginPath();
        var p = this.calcLinePoints();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.lineWidth = this.strokeWidth;
        var origStrokeStyle = ctx.strokeStyle;
        ctx.strokeStyle = this.stroke || ctx.fillStyle;
        this.stroke && this._renderStroke(ctx);
        ctx.strokeStyle = origStrokeStyle;
      },
      _findCenterFromElement: function() {
        return {
          x: (this.x1 + this.x2) / 2,
          y: (this.y1 + this.y2) / 2
        };
      },
      toObject: function(propertiesToInclude) {
        return extend(this.callSuper("toObject", propertiesToInclude), this.calcLinePoints());
      },
      _getNonTransformedDimensions: function() {
        var dim = this.callSuper("_getNonTransformedDimensions");
        if (this.strokeLineCap === "butt") {
          if (this.width === 0) {
            dim.y -= this.strokeWidth;
          }
          if (this.height === 0) {
            dim.x -= this.strokeWidth;
          }
        }
        return dim;
      },
      calcLinePoints: function() {
        var xMult = this.x1 <= this.x2 ? -1 : 1, yMult = this.y1 <= this.y2 ? -1 : 1, x1 = xMult * this.width * 0.5, y1 = yMult * this.height * 0.5, x2 = xMult * this.width * -0.5, y22 = yMult * this.height * -0.5;
        return {
          x1,
          x2,
          y1,
          y2: y22
        };
      },
      _toSVG: function() {
        var p = this.calcLinePoints();
        return [
          "<line ",
          "COMMON_PARTS",
          'x1="',
          p.x1,
          '" y1="',
          p.y1,
          '" x2="',
          p.x2,
          '" y2="',
          p.y2,
          '" />\n'
        ];
      }
    });
    fabric3.Line.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" "));
    fabric3.Line.fromElement = function(element, callback, options) {
      options = options || {};
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Line.ATTRIBUTE_NAMES), points = [
        parsedAttributes.x1 || 0,
        parsedAttributes.y1 || 0,
        parsedAttributes.x2 || 0,
        parsedAttributes.y2 || 0
      ];
      callback(new fabric3.Line(points, extend(parsedAttributes, options)));
    };
    fabric3.Line.fromObject = function(object, callback) {
      function _callback(instance) {
        delete instance.points;
        callback && callback(instance);
      }
      var options = clone(object, true);
      options.points = [object.x1, object.y1, object.x2, object.y2];
      fabric3.Object._fromObject("Line", options, _callback, "points");
    };
    function makeEdgeToOriginGetter(propertyNames, originValues) {
      var origin = propertyNames.origin, axis1 = propertyNames.axis1, axis2 = propertyNames.axis2, dimension = propertyNames.dimension, nearest = originValues.nearest, center = originValues.center, farthest = originValues.farthest;
      return function() {
        switch (this.get(origin)) {
          case nearest:
            return Math.min(this.get(axis1), this.get(axis2));
          case center:
            return Math.min(this.get(axis1), this.get(axis2)) + 0.5 * this.get(dimension);
          case farthest:
            return Math.max(this.get(axis1), this.get(axis2));
        }
      };
    }
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), degreesToRadians = fabric3.util.degreesToRadians;
    if (fabric3.Circle) {
      fabric3.warn("fabric.Circle is already defined.");
      return;
    }
    fabric3.Circle = fabric3.util.createClass(fabric3.Object, {
      type: "circle",
      radius: 0,
      startAngle: 0,
      endAngle: 360,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("radius", "startAngle", "endAngle"),
      _set: function(key, value) {
        this.callSuper("_set", key, value);
        if (key === "radius") {
          this.setRadius(value);
        }
        return this;
      },
      toObject: function(propertiesToInclude) {
        return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(propertiesToInclude));
      },
      _toSVG: function() {
        var svgString, x2 = 0, y3 = 0, angle = (this.endAngle - this.startAngle) % 360;
        if (angle === 0) {
          svgString = [
            "<circle ",
            "COMMON_PARTS",
            'cx="' + x2 + '" cy="' + y3 + '" ',
            'r="',
            this.radius,
            '" />\n'
          ];
        } else {
          var start = degreesToRadians(this.startAngle), end = degreesToRadians(this.endAngle), radius = this.radius, startX = fabric3.util.cos(start) * radius, startY = fabric3.util.sin(start) * radius, endX = fabric3.util.cos(end) * radius, endY = fabric3.util.sin(end) * radius, largeFlag = angle > 180 ? "1" : "0";
          svgString = [
            '<path d="M ' + startX + " " + startY,
            " A " + radius + " " + radius,
            " 0 ",
            +largeFlag + " 1",
            " " + endX + " " + endY,
            '" ',
            "COMMON_PARTS",
            " />\n"
          ];
        }
        return svgString;
      },
      _render: function(ctx) {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          this.radius,
          degreesToRadians(this.startAngle),
          degreesToRadians(this.endAngle),
          false
        );
        this._renderPaintInOrder(ctx);
      },
      getRadiusX: function() {
        return this.get("radius") * this.get("scaleX");
      },
      getRadiusY: function() {
        return this.get("radius") * this.get("scaleY");
      },
      setRadius: function(value) {
        this.radius = value;
        return this.set("width", value * 2).set("height", value * 2);
      }
    });
    fabric3.Circle.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat("cx cy r".split(" "));
    fabric3.Circle.fromElement = function(element, callback) {
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Circle.ATTRIBUTE_NAMES);
      if (!isValidRadius(parsedAttributes)) {
        throw new Error("value of `r` attribute is required and can not be negative");
      }
      parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.radius;
      parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.radius;
      callback(new fabric3.Circle(parsedAttributes));
    };
    function isValidRadius(attributes) {
      return "radius" in attributes && attributes.radius >= 0;
    }
    fabric3.Circle.fromObject = function(object, callback) {
      fabric3.Object._fromObject("Circle", object, callback);
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    if (fabric3.Triangle) {
      fabric3.warn("fabric.Triangle is already defined");
      return;
    }
    fabric3.Triangle = fabric3.util.createClass(fabric3.Object, {
      type: "triangle",
      width: 100,
      height: 100,
      _render: function(ctx) {
        var widthBy2 = this.width / 2, heightBy2 = this.height / 2;
        ctx.beginPath();
        ctx.moveTo(-widthBy2, heightBy2);
        ctx.lineTo(0, -heightBy2);
        ctx.lineTo(widthBy2, heightBy2);
        ctx.closePath();
        this._renderPaintInOrder(ctx);
      },
      _toSVG: function() {
        var widthBy2 = this.width / 2, heightBy2 = this.height / 2, points = [
          -widthBy2 + " " + heightBy2,
          "0 " + -heightBy2,
          widthBy2 + " " + heightBy2
        ].join(",");
        return [
          "<polygon ",
          "COMMON_PARTS",
          'points="',
          points,
          '" />'
        ];
      }
    });
    fabric3.Triangle.fromObject = function(object, callback) {
      return fabric3.Object._fromObject("Triangle", object, callback);
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), piBy2 = Math.PI * 2;
    if (fabric3.Ellipse) {
      fabric3.warn("fabric.Ellipse is already defined.");
      return;
    }
    fabric3.Ellipse = fabric3.util.createClass(fabric3.Object, {
      type: "ellipse",
      rx: 0,
      ry: 0,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("rx", "ry"),
      initialize: function(options) {
        this.callSuper("initialize", options);
        this.set("rx", options && options.rx || 0);
        this.set("ry", options && options.ry || 0);
      },
      _set: function(key, value) {
        this.callSuper("_set", key, value);
        switch (key) {
          case "rx":
            this.rx = value;
            this.set("width", value * 2);
            break;
          case "ry":
            this.ry = value;
            this.set("height", value * 2);
            break;
        }
        return this;
      },
      getRx: function() {
        return this.get("rx") * this.get("scaleX");
      },
      getRy: function() {
        return this.get("ry") * this.get("scaleY");
      },
      toObject: function(propertiesToInclude) {
        return this.callSuper("toObject", ["rx", "ry"].concat(propertiesToInclude));
      },
      _toSVG: function() {
        return [
          "<ellipse ",
          "COMMON_PARTS",
          'cx="0" cy="0" ',
          'rx="',
          this.rx,
          '" ry="',
          this.ry,
          '" />\n'
        ];
      },
      _render: function(ctx) {
        ctx.beginPath();
        ctx.save();
        ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
        ctx.arc(
          0,
          0,
          this.rx,
          0,
          piBy2,
          false
        );
        ctx.restore();
        this._renderPaintInOrder(ctx);
      }
    });
    fabric3.Ellipse.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" "));
    fabric3.Ellipse.fromElement = function(element, callback) {
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Ellipse.ATTRIBUTE_NAMES);
      parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
      parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
      callback(new fabric3.Ellipse(parsedAttributes));
    };
    fabric3.Ellipse.fromObject = function(object, callback) {
      fabric3.Object._fromObject("Ellipse", object, callback);
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend;
    if (fabric3.Rect) {
      fabric3.warn("fabric.Rect is already defined");
      return;
    }
    fabric3.Rect = fabric3.util.createClass(fabric3.Object, {
      stateProperties: fabric3.Object.prototype.stateProperties.concat("rx", "ry"),
      type: "rect",
      rx: 0,
      ry: 0,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("rx", "ry"),
      initialize: function(options) {
        this.callSuper("initialize", options);
        this._initRxRy();
      },
      _initRxRy: function() {
        if (this.rx && !this.ry) {
          this.ry = this.rx;
        } else if (this.ry && !this.rx) {
          this.rx = this.ry;
        }
      },
      _render: function(ctx) {
        var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0, ry = this.ry ? Math.min(this.ry, this.height / 2) : 0, w2 = this.width, h3 = this.height, x2 = -this.width / 2, y3 = -this.height / 2, isRounded = rx !== 0 || ry !== 0, k2 = 1 - 0.5522847498;
        ctx.beginPath();
        ctx.moveTo(x2 + rx, y3);
        ctx.lineTo(x2 + w2 - rx, y3);
        isRounded && ctx.bezierCurveTo(x2 + w2 - k2 * rx, y3, x2 + w2, y3 + k2 * ry, x2 + w2, y3 + ry);
        ctx.lineTo(x2 + w2, y3 + h3 - ry);
        isRounded && ctx.bezierCurveTo(x2 + w2, y3 + h3 - k2 * ry, x2 + w2 - k2 * rx, y3 + h3, x2 + w2 - rx, y3 + h3);
        ctx.lineTo(x2 + rx, y3 + h3);
        isRounded && ctx.bezierCurveTo(x2 + k2 * rx, y3 + h3, x2, y3 + h3 - k2 * ry, x2, y3 + h3 - ry);
        ctx.lineTo(x2, y3 + ry);
        isRounded && ctx.bezierCurveTo(x2, y3 + k2 * ry, x2 + k2 * rx, y3, x2 + rx, y3);
        ctx.closePath();
        this._renderPaintInOrder(ctx);
      },
      toObject: function(propertiesToInclude) {
        return this.callSuper("toObject", ["rx", "ry"].concat(propertiesToInclude));
      },
      _toSVG: function() {
        var x2 = -this.width / 2, y3 = -this.height / 2;
        return [
          "<rect ",
          "COMMON_PARTS",
          'x="',
          x2,
          '" y="',
          y3,
          '" rx="',
          this.rx,
          '" ry="',
          this.ry,
          '" width="',
          this.width,
          '" height="',
          this.height,
          '" />\n'
        ];
      }
    });
    fabric3.Rect.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" "));
    fabric3.Rect.fromElement = function(element, callback, options) {
      if (!element) {
        return callback(null);
      }
      options = options || {};
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Rect.ATTRIBUTE_NAMES);
      parsedAttributes.left = parsedAttributes.left || 0;
      parsedAttributes.top = parsedAttributes.top || 0;
      parsedAttributes.height = parsedAttributes.height || 0;
      parsedAttributes.width = parsedAttributes.width || 0;
      var rect = new fabric3.Rect(extend(options ? fabric3.util.object.clone(options) : {}, parsedAttributes));
      rect.visible = rect.visible && rect.width > 0 && rect.height > 0;
      callback(rect);
    };
    fabric3.Rect.fromObject = function(object, callback) {
      return fabric3.Object._fromObject("Rect", object, callback);
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, min = fabric3.util.array.min, max = fabric3.util.array.max, toFixed = fabric3.util.toFixed, projectStrokeOnPoints = fabric3.util.projectStrokeOnPoints;
    if (fabric3.Polyline) {
      fabric3.warn("fabric.Polyline is already defined");
      return;
    }
    fabric3.Polyline = fabric3.util.createClass(fabric3.Object, {
      type: "polyline",
      points: null,
      exactBoundingBox: false,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("points"),
      initialize: function(points, options) {
        options = options || {};
        this.points = points || [];
        this.callSuper("initialize", options);
        this._setPositionDimensions(options);
      },
      _projectStrokeOnPoints: function() {
        return projectStrokeOnPoints(this.points, this, true);
      },
      _setPositionDimensions: function(options) {
        var calcDim = this._calcDimensions(options), correctLeftTop, correctSize = this.exactBoundingBox ? this.strokeWidth : 0;
        this.width = calcDim.width - correctSize;
        this.height = calcDim.height - correctSize;
        if (!options.fromSVG) {
          correctLeftTop = this.translateToGivenOrigin(
            {
              x: calcDim.left - this.strokeWidth / 2 + correctSize / 2,
              y: calcDim.top - this.strokeWidth / 2 + correctSize / 2
            },
            "left",
            "top",
            this.originX,
            this.originY
          );
        }
        if (typeof options.left === "undefined") {
          this.left = options.fromSVG ? calcDim.left : correctLeftTop.x;
        }
        if (typeof options.top === "undefined") {
          this.top = options.fromSVG ? calcDim.top : correctLeftTop.y;
        }
        this.pathOffset = {
          x: calcDim.left + this.width / 2 + correctSize / 2,
          y: calcDim.top + this.height / 2 + correctSize / 2
        };
      },
      _calcDimensions: function() {
        var points = this.exactBoundingBox ? this._projectStrokeOnPoints() : this.points, minX = min(points, "x") || 0, minY = min(points, "y") || 0, maxX = max(points, "x") || 0, maxY = max(points, "y") || 0, width = maxX - minX, height = maxY - minY;
        return {
          left: minX,
          top: minY,
          width,
          height
        };
      },
      toObject: function(propertiesToInclude) {
        return extend(this.callSuper("toObject", propertiesToInclude), {
          points: this.points.concat()
        });
      },
      _toSVG: function() {
        var points = [], diffX = this.pathOffset.x, diffY = this.pathOffset.y, NUM_FRACTION_DIGITS = fabric3.Object.NUM_FRACTION_DIGITS;
        for (var i2 = 0, len = this.points.length; i2 < len; i2++) {
          points.push(
            toFixed(this.points[i2].x - diffX, NUM_FRACTION_DIGITS),
            ",",
            toFixed(this.points[i2].y - diffY, NUM_FRACTION_DIGITS),
            " "
          );
        }
        return [
          "<" + this.type + " ",
          "COMMON_PARTS",
          'points="',
          points.join(""),
          '" />\n'
        ];
      },
      commonRender: function(ctx) {
        var point, len = this.points.length, x2 = this.pathOffset.x, y3 = this.pathOffset.y;
        if (!len || isNaN(this.points[len - 1].y)) {
          return false;
        }
        ctx.beginPath();
        ctx.moveTo(this.points[0].x - x2, this.points[0].y - y3);
        for (var i2 = 0; i2 < len; i2++) {
          point = this.points[i2];
          ctx.lineTo(point.x - x2, point.y - y3);
        }
        return true;
      },
      _render: function(ctx) {
        if (!this.commonRender(ctx)) {
          return;
        }
        this._renderPaintInOrder(ctx);
      },
      complexity: function() {
        return this.get("points").length;
      }
    });
    fabric3.Polyline.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat();
    fabric3.Polyline.fromElementGenerator = function(_class) {
      return function(element, callback, options) {
        if (!element) {
          return callback(null);
        }
        options || (options = {});
        var points = fabric3.parsePointsAttribute(element.getAttribute("points")), parsedAttributes = fabric3.parseAttributes(element, fabric3[_class].ATTRIBUTE_NAMES);
        parsedAttributes.fromSVG = true;
        callback(new fabric3[_class](points, extend(parsedAttributes, options)));
      };
    };
    fabric3.Polyline.fromElement = fabric3.Polyline.fromElementGenerator("Polyline");
    fabric3.Polyline.fromObject = function(object, callback) {
      return fabric3.Object._fromObject("Polyline", object, callback, "points");
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), projectStrokeOnPoints = fabric3.util.projectStrokeOnPoints;
    if (fabric3.Polygon) {
      fabric3.warn("fabric.Polygon is already defined");
      return;
    }
    fabric3.Polygon = fabric3.util.createClass(fabric3.Polyline, {
      type: "polygon",
      _projectStrokeOnPoints: function() {
        return projectStrokeOnPoints(this.points, this);
      },
      _render: function(ctx) {
        if (!this.commonRender(ctx)) {
          return;
        }
        ctx.closePath();
        this._renderPaintInOrder(ctx);
      }
    });
    fabric3.Polygon.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat();
    fabric3.Polygon.fromElement = fabric3.Polyline.fromElementGenerator("Polygon");
    fabric3.Polygon.fromObject = function(object, callback) {
      fabric3.Object._fromObject("Polygon", object, callback, "points");
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), min = fabric3.util.array.min, max = fabric3.util.array.max, extend = fabric3.util.object.extend, clone = fabric3.util.object.clone, toFixed = fabric3.util.toFixed;
    if (fabric3.Path) {
      fabric3.warn("fabric.Path is already defined");
      return;
    }
    fabric3.Path = fabric3.util.createClass(fabric3.Object, {
      type: "path",
      path: null,
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat("path", "fillRule"),
      stateProperties: fabric3.Object.prototype.stateProperties.concat("path"),
      initialize: function(path, options) {
        options = clone(options || {});
        delete options.path;
        this.callSuper("initialize", options);
        this._setPath(path || [], options);
      },
      _setPath: function(path, options) {
        this.path = fabric3.util.makePathSimpler(
          Array.isArray(path) ? path : fabric3.util.parsePath(path)
        );
        fabric3.Polyline.prototype._setPositionDimensions.call(this, options || {});
      },
      _renderPathCommands: function(ctx) {
        var current, subpathStartX = 0, subpathStartY = 0, x2 = 0, y3 = 0, controlX = 0, controlY = 0, l = -this.pathOffset.x, t2 = -this.pathOffset.y;
        ctx.beginPath();
        for (var i2 = 0, len = this.path.length; i2 < len; ++i2) {
          current = this.path[i2];
          switch (current[0]) {
            case "L":
              x2 = current[1];
              y3 = current[2];
              ctx.lineTo(x2 + l, y3 + t2);
              break;
            case "M":
              x2 = current[1];
              y3 = current[2];
              subpathStartX = x2;
              subpathStartY = y3;
              ctx.moveTo(x2 + l, y3 + t2);
              break;
            case "C":
              x2 = current[5];
              y3 = current[6];
              controlX = current[3];
              controlY = current[4];
              ctx.bezierCurveTo(
                current[1] + l,
                current[2] + t2,
                controlX + l,
                controlY + t2,
                x2 + l,
                y3 + t2
              );
              break;
            case "Q":
              ctx.quadraticCurveTo(
                current[1] + l,
                current[2] + t2,
                current[3] + l,
                current[4] + t2
              );
              x2 = current[3];
              y3 = current[4];
              controlX = current[1];
              controlY = current[2];
              break;
            case "z":
            case "Z":
              x2 = subpathStartX;
              y3 = subpathStartY;
              ctx.closePath();
              break;
          }
        }
      },
      _render: function(ctx) {
        this._renderPathCommands(ctx);
        this._renderPaintInOrder(ctx);
      },
      toString: function() {
        return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>";
      },
      toObject: function(propertiesToInclude) {
        return extend(this.callSuper("toObject", propertiesToInclude), {
          path: this.path.map(function(item) {
            return item.slice();
          })
        });
      },
      toDatalessObject: function(propertiesToInclude) {
        var o = this.toObject(["sourcePath"].concat(propertiesToInclude));
        if (o.sourcePath) {
          delete o.path;
        }
        return o;
      },
      _toSVG: function() {
        var path = fabric3.util.joinPath(this.path);
        return [
          "<path ",
          "COMMON_PARTS",
          'd="',
          path,
          '" stroke-linecap="round" ',
          "/>\n"
        ];
      },
      _getOffsetTransform: function() {
        var digits = fabric3.Object.NUM_FRACTION_DIGITS;
        return " translate(" + toFixed(-this.pathOffset.x, digits) + ", " + toFixed(-this.pathOffset.y, digits) + ")";
      },
      toClipPathSVG: function(reviver) {
        var additionalTransform = this._getOffsetTransform();
        return "	" + this._createBaseClipPathSVGMarkup(
          this._toSVG(),
          { reviver, additionalTransform }
        );
      },
      toSVG: function(reviver) {
        var additionalTransform = this._getOffsetTransform();
        return this._createBaseSVGMarkup(this._toSVG(), { reviver, additionalTransform });
      },
      complexity: function() {
        return this.path.length;
      },
      _calcDimensions: function() {
        var aX = [], aY = [], current, subpathStartX = 0, subpathStartY = 0, x2 = 0, y3 = 0, bounds;
        for (var i2 = 0, len = this.path.length; i2 < len; ++i2) {
          current = this.path[i2];
          switch (current[0]) {
            case "L":
              x2 = current[1];
              y3 = current[2];
              bounds = [];
              break;
            case "M":
              x2 = current[1];
              y3 = current[2];
              subpathStartX = x2;
              subpathStartY = y3;
              bounds = [];
              break;
            case "C":
              bounds = fabric3.util.getBoundsOfCurve(
                x2,
                y3,
                current[1],
                current[2],
                current[3],
                current[4],
                current[5],
                current[6]
              );
              x2 = current[5];
              y3 = current[6];
              break;
            case "Q":
              bounds = fabric3.util.getBoundsOfCurve(
                x2,
                y3,
                current[1],
                current[2],
                current[1],
                current[2],
                current[3],
                current[4]
              );
              x2 = current[3];
              y3 = current[4];
              break;
            case "z":
            case "Z":
              x2 = subpathStartX;
              y3 = subpathStartY;
              break;
          }
          bounds.forEach(function(point) {
            aX.push(point.x);
            aY.push(point.y);
          });
          aX.push(x2);
          aY.push(y3);
        }
        var minX = min(aX) || 0, minY = min(aY) || 0, maxX = max(aX) || 0, maxY = max(aY) || 0, deltaX = maxX - minX, deltaY = maxY - minY;
        return {
          left: minX,
          top: minY,
          width: deltaX,
          height: deltaY
        };
      }
    });
    fabric3.Path.fromObject = function(object, callback) {
      if (typeof object.sourcePath === "string") {
        var pathUrl = object.sourcePath;
        fabric3.loadSVGFromURL(pathUrl, function(elements) {
          var path = elements[0];
          path.setOptions(object);
          if (object.clipPath) {
            fabric3.util.enlivenObjects([object.clipPath], function(elivenedObjects) {
              path.clipPath = elivenedObjects[0];
              callback && callback(path);
            });
          } else {
            callback && callback(path);
          }
        });
      } else {
        fabric3.Object._fromObject("Path", object, callback, "path");
      }
    };
    fabric3.Path.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat(["d"]);
    fabric3.Path.fromElement = function(element, callback, options) {
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Path.ATTRIBUTE_NAMES);
      parsedAttributes.fromSVG = true;
      callback(new fabric3.Path(parsedAttributes.d, extend(parsedAttributes, options)));
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), min = fabric3.util.array.min, max = fabric3.util.array.max;
    if (fabric3.Group) {
      return;
    }
    fabric3.Group = fabric3.util.createClass(fabric3.Object, fabric3.Collection, {
      type: "group",
      strokeWidth: 0,
      subTargetCheck: false,
      cacheProperties: [],
      useSetOnGroup: false,
      initialize: function(objects, options, isAlreadyGrouped) {
        options = options || {};
        this._objects = [];
        isAlreadyGrouped && this.callSuper("initialize", options);
        this._objects = objects || [];
        for (var i2 = this._objects.length; i2--; ) {
          this._objects[i2].group = this;
        }
        if (!isAlreadyGrouped) {
          var center = options && options.centerPoint;
          if (options.originX !== void 0) {
            this.originX = options.originX;
          }
          if (options.originY !== void 0) {
            this.originY = options.originY;
          }
          center || this._calcBounds();
          this._updateObjectsCoords(center);
          delete options.centerPoint;
          this.callSuper("initialize", options);
        } else {
          this._updateObjectsACoords();
        }
        this.setCoords();
      },
      _updateObjectsACoords: function() {
        var skipControls = true;
        for (var i2 = this._objects.length; i2--; ) {
          this._objects[i2].setCoords(skipControls);
        }
      },
      _updateObjectsCoords: function(center) {
        var center = center || this.getCenterPoint();
        for (var i2 = this._objects.length; i2--; ) {
          this._updateObjectCoords(this._objects[i2], center);
        }
      },
      _updateObjectCoords: function(object, center) {
        var objectLeft = object.left, objectTop = object.top, skipControls = true;
        object.set({
          left: objectLeft - center.x,
          top: objectTop - center.y
        });
        object.group = this;
        object.setCoords(skipControls);
      },
      toString: function() {
        return "#<fabric.Group: (" + this.complexity() + ")>";
      },
      addWithUpdate: function(object) {
        var nested = !!this.group;
        this._restoreObjectsState();
        fabric3.util.resetObjectTransform(this);
        if (object) {
          if (nested) {
            fabric3.util.removeTransformFromObject(object, this.group.calcTransformMatrix());
          }
          this._objects.push(object);
          object.group = this;
          object._set("canvas", this.canvas);
        }
        this._calcBounds();
        this._updateObjectsCoords();
        this.dirty = true;
        if (nested) {
          this.group.addWithUpdate();
        } else {
          this.setCoords();
        }
        return this;
      },
      removeWithUpdate: function(object) {
        this._restoreObjectsState();
        fabric3.util.resetObjectTransform(this);
        this.remove(object);
        this._calcBounds();
        this._updateObjectsCoords();
        this.setCoords();
        this.dirty = true;
        return this;
      },
      _onObjectAdded: function(object) {
        this.dirty = true;
        object.group = this;
        object._set("canvas", this.canvas);
      },
      _onObjectRemoved: function(object) {
        this.dirty = true;
        delete object.group;
      },
      _set: function(key, value) {
        var i2 = this._objects.length;
        if (this.useSetOnGroup) {
          while (i2--) {
            this._objects[i2].setOnGroup(key, value);
          }
        }
        if (key === "canvas") {
          while (i2--) {
            this._objects[i2]._set(key, value);
          }
        }
        fabric3.Object.prototype._set.call(this, key, value);
      },
      toObject: function(propertiesToInclude) {
        var _includeDefaultValues = this.includeDefaultValues;
        var objsToObject = this._objects.filter(function(obj2) {
          return !obj2.excludeFromExport;
        }).map(function(obj2) {
          var originalDefaults = obj2.includeDefaultValues;
          obj2.includeDefaultValues = _includeDefaultValues;
          var _obj = obj2.toObject(propertiesToInclude);
          obj2.includeDefaultValues = originalDefaults;
          return _obj;
        });
        var obj = fabric3.Object.prototype.toObject.call(this, propertiesToInclude);
        obj.objects = objsToObject;
        return obj;
      },
      toDatalessObject: function(propertiesToInclude) {
        var objsToObject, sourcePath = this.sourcePath;
        if (sourcePath) {
          objsToObject = sourcePath;
        } else {
          var _includeDefaultValues = this.includeDefaultValues;
          objsToObject = this._objects.map(function(obj2) {
            var originalDefaults = obj2.includeDefaultValues;
            obj2.includeDefaultValues = _includeDefaultValues;
            var _obj = obj2.toDatalessObject(propertiesToInclude);
            obj2.includeDefaultValues = originalDefaults;
            return _obj;
          });
        }
        var obj = fabric3.Object.prototype.toDatalessObject.call(this, propertiesToInclude);
        obj.objects = objsToObject;
        return obj;
      },
      render: function(ctx) {
        this._transformDone = true;
        this.callSuper("render", ctx);
        this._transformDone = false;
      },
      shouldCache: function() {
        var ownCache = fabric3.Object.prototype.shouldCache.call(this);
        if (ownCache) {
          for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
            if (this._objects[i2].willDrawShadow()) {
              this.ownCaching = false;
              return false;
            }
          }
        }
        return ownCache;
      },
      willDrawShadow: function() {
        if (fabric3.Object.prototype.willDrawShadow.call(this)) {
          return true;
        }
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          if (this._objects[i2].willDrawShadow()) {
            return true;
          }
        }
        return false;
      },
      isOnACache: function() {
        return this.ownCaching || this.group && this.group.isOnACache();
      },
      drawObject: function(ctx) {
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          this._objects[i2].render(ctx);
        }
        this._drawClipPath(ctx, this.clipPath);
      },
      isCacheDirty: function(skipCanvas) {
        if (this.callSuper("isCacheDirty", skipCanvas)) {
          return true;
        }
        if (!this.statefullCache) {
          return false;
        }
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          if (this._objects[i2].isCacheDirty(true)) {
            if (this._cacheCanvas) {
              var x2 = this.cacheWidth / this.zoomX, y3 = this.cacheHeight / this.zoomY;
              this._cacheContext.clearRect(-x2 / 2, -y3 / 2, x2, y3);
            }
            return true;
          }
        }
        return false;
      },
      _restoreObjectsState: function() {
        var groupMatrix = this.calcOwnMatrix();
        this._objects.forEach(function(object) {
          fabric3.util.addTransformToObject(object, groupMatrix);
          delete object.group;
          object.setCoords();
        });
        return this;
      },
      destroy: function() {
        this._objects.forEach(function(object) {
          object.set("dirty", true);
        });
        return this._restoreObjectsState();
      },
      dispose: function() {
        this.callSuper("dispose");
        this.forEachObject(function(object) {
          object.dispose && object.dispose();
        });
        this._objects = [];
      },
      toActiveSelection: function() {
        if (!this.canvas) {
          return;
        }
        var objects = this._objects, canvas = this.canvas;
        this._objects = [];
        var options = this.toObject();
        delete options.objects;
        var activeSelection = new fabric3.ActiveSelection([]);
        activeSelection.set(options);
        activeSelection.type = "activeSelection";
        canvas.remove(this);
        objects.forEach(function(object) {
          object.group = activeSelection;
          object.dirty = true;
          canvas.add(object);
        });
        activeSelection.canvas = canvas;
        activeSelection._objects = objects;
        canvas._activeObject = activeSelection;
        activeSelection.setCoords();
        return activeSelection;
      },
      ungroupOnCanvas: function() {
        return this._restoreObjectsState();
      },
      setObjectsCoords: function() {
        var skipControls = true;
        this.forEachObject(function(object) {
          object.setCoords(skipControls);
        });
        return this;
      },
      _calcBounds: function(onlyWidthHeight) {
        var aX = [], aY = [], o, prop, coords, props = ["tr", "br", "bl", "tl"], i2 = 0, iLen = this._objects.length, j, jLen = props.length;
        for (; i2 < iLen; ++i2) {
          o = this._objects[i2];
          coords = o.calcACoords();
          for (j = 0; j < jLen; j++) {
            prop = props[j];
            aX.push(coords[prop].x);
            aY.push(coords[prop].y);
          }
          o.aCoords = coords;
        }
        this._getBounds(aX, aY, onlyWidthHeight);
      },
      _getBounds: function(aX, aY, onlyWidthHeight) {
        var minXY = new fabric3.Point(min(aX), min(aY)), maxXY = new fabric3.Point(max(aX), max(aY)), top = minXY.y || 0, left = minXY.x || 0, width = maxXY.x - minXY.x || 0, height = maxXY.y - minXY.y || 0;
        this.width = width;
        this.height = height;
        if (!onlyWidthHeight) {
          this.setPositionByOrigin({ x: left, y: top }, "left", "top");
        }
      },
      _toSVG: function(reviver) {
        var svgString = ["<g ", "COMMON_PARTS", " >\n"];
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          svgString.push("		", this._objects[i2].toSVG(reviver));
        }
        svgString.push("</g>\n");
        return svgString;
      },
      getSvgStyles: function() {
        var opacity = typeof this.opacity !== "undefined" && this.opacity !== 1 ? "opacity: " + this.opacity + ";" : "", visibility = this.visible ? "" : " visibility: hidden;";
        return [
          opacity,
          this.getSvgFilter(),
          visibility
        ].join("");
      },
      toClipPathSVG: function(reviver) {
        var svgString = [];
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          svgString.push("	", this._objects[i2].toClipPathSVG(reviver));
        }
        return this._createBaseClipPathSVGMarkup(svgString, { reviver });
      }
    });
    fabric3.Group.fromObject = function(object, callback) {
      var objects = object.objects, options = fabric3.util.object.clone(object, true);
      delete options.objects;
      if (typeof objects === "string") {
        fabric3.loadSVGFromURL(objects, function(elements) {
          var group = fabric3.util.groupSVGElements(elements, object, objects);
          var clipPath = options.clipPath;
          delete options.clipPath;
          group.set(options);
          if (clipPath) {
            fabric3.util.enlivenObjects([clipPath], function(elivenedObjects) {
              group.clipPath = elivenedObjects[0];
              callback && callback(group);
            });
          } else {
            callback && callback(group);
          }
        });
        return;
      }
      fabric3.util.enlivenObjects(objects, function(enlivenedObjects) {
        fabric3.util.enlivenObjectEnlivables(object, options, function() {
          callback && callback(new fabric3.Group(enlivenedObjects, options, true));
        });
      });
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    if (fabric3.ActiveSelection) {
      return;
    }
    fabric3.ActiveSelection = fabric3.util.createClass(fabric3.Group, {
      type: "activeSelection",
      initialize: function(objects, options) {
        options = options || {};
        this._objects = objects || [];
        for (var i2 = this._objects.length; i2--; ) {
          this._objects[i2].group = this;
        }
        if (options.originX) {
          this.originX = options.originX;
        }
        if (options.originY) {
          this.originY = options.originY;
        }
        this._calcBounds();
        this._updateObjectsCoords();
        fabric3.Object.prototype.initialize.call(this, options);
        this.setCoords();
      },
      toGroup: function() {
        var objects = this._objects.concat();
        this._objects = [];
        var options = fabric3.Object.prototype.toObject.call(this);
        var newGroup = new fabric3.Group([]);
        delete options.type;
        newGroup.set(options);
        objects.forEach(function(object) {
          object.canvas.remove(object);
          object.group = newGroup;
        });
        newGroup._objects = objects;
        if (!this.canvas) {
          return newGroup;
        }
        var canvas = this.canvas;
        canvas.add(newGroup);
        canvas._activeObject = newGroup;
        newGroup.setCoords();
        return newGroup;
      },
      onDeselect: function() {
        this.destroy();
        return false;
      },
      toString: function() {
        return "#<fabric.ActiveSelection: (" + this.complexity() + ")>";
      },
      shouldCache: function() {
        return false;
      },
      isOnACache: function() {
        return false;
      },
      _renderControls: function(ctx, styleOverride, childrenOverride) {
        ctx.save();
        ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        this.callSuper("_renderControls", ctx, styleOverride);
        childrenOverride = childrenOverride || {};
        if (typeof childrenOverride.hasControls === "undefined") {
          childrenOverride.hasControls = false;
        }
        childrenOverride.forActiveSelection = true;
        for (var i2 = 0, len = this._objects.length; i2 < len; i2++) {
          this._objects[i2]._renderControls(ctx, childrenOverride);
        }
        ctx.restore();
      }
    });
    fabric3.ActiveSelection.fromObject = function(object, callback) {
      fabric3.util.enlivenObjects(object.objects, function(enlivenedObjects) {
        delete object.objects;
        callback && callback(new fabric3.ActiveSelection(enlivenedObjects, object, true));
      });
    };
  })(exports);
  (function(global) {
    var extend = fabric2.util.object.extend;
    if (!global.fabric) {
      global.fabric = {};
    }
    if (global.fabric.Image) {
      fabric2.warn("fabric.Image is already defined.");
      return;
    }
    fabric2.Image = fabric2.util.createClass(fabric2.Object, {
      type: "image",
      strokeWidth: 0,
      srcFromAttribute: false,
      _lastScaleX: 1,
      _lastScaleY: 1,
      _filterScalingX: 1,
      _filterScalingY: 1,
      minimumScaleTrigger: 0.5,
      stateProperties: fabric2.Object.prototype.stateProperties.concat("cropX", "cropY"),
      cacheProperties: fabric2.Object.prototype.cacheProperties.concat("cropX", "cropY"),
      cacheKey: "",
      cropX: 0,
      cropY: 0,
      imageSmoothing: true,
      initialize: function(element, options) {
        options || (options = {});
        this.filters = [];
        this.cacheKey = "texture" + fabric2.Object.__uid++;
        this.callSuper("initialize", options);
        this._initElement(element, options);
      },
      getElement: function() {
        return this._element || {};
      },
      setElement: function(element, options) {
        this.removeTexture(this.cacheKey);
        this.removeTexture(this.cacheKey + "_filtered");
        this._element = element;
        this._originalElement = element;
        this._initConfig(options);
        if (this.filters.length !== 0) {
          this.applyFilters();
        }
        if (this.resizeFilter) {
          this.applyResizeFilters();
        }
        return this;
      },
      removeTexture: function(key) {
        var backend = fabric2.filterBackend;
        if (backend && backend.evictCachesForKey) {
          backend.evictCachesForKey(key);
        }
      },
      dispose: function() {
        this.callSuper("dispose");
        this.removeTexture(this.cacheKey);
        this.removeTexture(this.cacheKey + "_filtered");
        this._cacheContext = void 0;
        ["_originalElement", "_element", "_filteredEl", "_cacheCanvas"].forEach(function(element) {
          fabric2.util.cleanUpJsdomNode(this[element]);
          this[element] = void 0;
        }.bind(this));
      },
      getCrossOrigin: function() {
        return this._originalElement && (this._originalElement.crossOrigin || null);
      },
      getOriginalSize: function() {
        var element = this.getElement();
        return {
          width: element.naturalWidth || element.width,
          height: element.naturalHeight || element.height
        };
      },
      _stroke: function(ctx) {
        if (!this.stroke || this.strokeWidth === 0) {
          return;
        }
        var w2 = this.width / 2, h3 = this.height / 2;
        ctx.beginPath();
        ctx.moveTo(-w2, -h3);
        ctx.lineTo(w2, -h3);
        ctx.lineTo(w2, h3);
        ctx.lineTo(-w2, h3);
        ctx.lineTo(-w2, -h3);
        ctx.closePath();
      },
      toObject: function(propertiesToInclude) {
        var filters = [];
        this.filters.forEach(function(filterObj) {
          if (filterObj) {
            filters.push(filterObj.toObject());
          }
        });
        var object = extend(
          this.callSuper(
            "toObject",
            ["cropX", "cropY"].concat(propertiesToInclude)
          ),
          {
            src: this.getSrc(),
            crossOrigin: this.getCrossOrigin(),
            filters
          }
        );
        if (this.resizeFilter) {
          object.resizeFilter = this.resizeFilter.toObject();
        }
        return object;
      },
      hasCrop: function() {
        return this.cropX || this.cropY || this.width < this._element.width || this.height < this._element.height;
      },
      _toSVG: function() {
        var svgString = [], imageMarkup = [], strokeSvg, element = this._element, x2 = -this.width / 2, y3 = -this.height / 2, clipPath = "", imageRendering = "";
        if (!element) {
          return [];
        }
        if (this.hasCrop()) {
          var clipPathId = fabric2.Object.__uid++;
          svgString.push(
            '<clipPath id="imageCrop_' + clipPathId + '">\n',
            '	<rect x="' + x2 + '" y="' + y3 + '" width="' + this.width + '" height="' + this.height + '" />\n',
            "</clipPath>\n"
          );
          clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
        }
        if (!this.imageSmoothing) {
          imageRendering = '" image-rendering="optimizeSpeed';
        }
        imageMarkup.push(
          "	<image ",
          "COMMON_PARTS",
          'xlink:href="',
          this.getSvgSrc(true),
          '" x="',
          x2 - this.cropX,
          '" y="',
          y3 - this.cropY,
          '" width="',
          element.width || element.naturalWidth,
          '" height="',
          element.height || element.height,
          imageRendering,
          '"',
          clipPath,
          "></image>\n"
        );
        if (this.stroke || this.strokeDashArray) {
          var origFill = this.fill;
          this.fill = null;
          strokeSvg = [
            "	<rect ",
            'x="',
            x2,
            '" y="',
            y3,
            '" width="',
            this.width,
            '" height="',
            this.height,
            '" style="',
            this.getSvgStyles(),
            '"/>\n'
          ];
          this.fill = origFill;
        }
        if (this.paintFirst !== "fill") {
          svgString = svgString.concat(strokeSvg, imageMarkup);
        } else {
          svgString = svgString.concat(imageMarkup, strokeSvg);
        }
        return svgString;
      },
      getSrc: function(filtered) {
        var element = filtered ? this._element : this._originalElement;
        if (element) {
          if (element.toDataURL) {
            return element.toDataURL();
          }
          if (this.srcFromAttribute) {
            return element.getAttribute("src");
          } else {
            return element.src;
          }
        } else {
          return this.src || "";
        }
      },
      setSrc: function(src, callback, options) {
        fabric2.util.loadImage(src, function(img, isError) {
          this.setElement(img, options);
          this._setWidthHeight();
          callback && callback(this, isError);
        }, this, options && options.crossOrigin);
        return this;
      },
      toString: function() {
        return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
      },
      applyResizeFilters: function() {
        var filter = this.resizeFilter, minimumScale = this.minimumScaleTrigger, objectScale = this.getTotalObjectScaling(), scaleX = objectScale.scaleX, scaleY = objectScale.scaleY, elementToFilter = this._filteredEl || this._originalElement;
        if (this.group) {
          this.set("dirty", true);
        }
        if (!filter || scaleX > minimumScale && scaleY > minimumScale) {
          this._element = elementToFilter;
          this._filterScalingX = 1;
          this._filterScalingY = 1;
          this._lastScaleX = scaleX;
          this._lastScaleY = scaleY;
          return;
        }
        if (!fabric2.filterBackend) {
          fabric2.filterBackend = fabric2.initFilterBackend();
        }
        var canvasEl = fabric2.util.createCanvasElement(), cacheKey = this._filteredEl ? this.cacheKey + "_filtered" : this.cacheKey, sourceWidth = elementToFilter.width, sourceHeight = elementToFilter.height;
        canvasEl.width = sourceWidth;
        canvasEl.height = sourceHeight;
        this._element = canvasEl;
        this._lastScaleX = filter.scaleX = scaleX;
        this._lastScaleY = filter.scaleY = scaleY;
        fabric2.filterBackend.applyFilters(
          [filter],
          elementToFilter,
          sourceWidth,
          sourceHeight,
          this._element,
          cacheKey
        );
        this._filterScalingX = canvasEl.width / this._originalElement.width;
        this._filterScalingY = canvasEl.height / this._originalElement.height;
      },
      applyFilters: function(filters) {
        filters = filters || this.filters || [];
        filters = filters.filter(function(filter) {
          return filter && !filter.isNeutralState();
        });
        this.set("dirty", true);
        this.removeTexture(this.cacheKey + "_filtered");
        if (filters.length === 0) {
          this._element = this._originalElement;
          this._filteredEl = null;
          this._filterScalingX = 1;
          this._filterScalingY = 1;
          return this;
        }
        var imgElement = this._originalElement, sourceWidth = imgElement.naturalWidth || imgElement.width, sourceHeight = imgElement.naturalHeight || imgElement.height;
        if (this._element === this._originalElement) {
          var canvasEl = fabric2.util.createCanvasElement();
          canvasEl.width = sourceWidth;
          canvasEl.height = sourceHeight;
          this._element = canvasEl;
          this._filteredEl = canvasEl;
        } else {
          this._element = this._filteredEl;
          this._filteredEl.getContext("2d").clearRect(0, 0, sourceWidth, sourceHeight);
          this._lastScaleX = 1;
          this._lastScaleY = 1;
        }
        if (!fabric2.filterBackend) {
          fabric2.filterBackend = fabric2.initFilterBackend();
        }
        fabric2.filterBackend.applyFilters(
          filters,
          this._originalElement,
          sourceWidth,
          sourceHeight,
          this._element,
          this.cacheKey
        );
        if (this._originalElement.width !== this._element.width || this._originalElement.height !== this._element.height) {
          this._filterScalingX = this._element.width / this._originalElement.width;
          this._filterScalingY = this._element.height / this._originalElement.height;
        }
        return this;
      },
      _render: function(ctx) {
        fabric2.util.setImageSmoothing(ctx, this.imageSmoothing);
        if (this.isMoving !== true && this.resizeFilter && this._needsResize()) {
          this.applyResizeFilters();
        }
        this._stroke(ctx);
        this._renderPaintInOrder(ctx);
      },
      drawCacheOnCanvas: function(ctx) {
        fabric2.util.setImageSmoothing(ctx, this.imageSmoothing);
        fabric2.Object.prototype.drawCacheOnCanvas.call(this, ctx);
      },
      shouldCache: function() {
        return this.needsItsOwnCache();
      },
      _renderFill: function(ctx) {
        var elementToDraw = this._element;
        if (!elementToDraw) {
          return;
        }
        var scaleX = this._filterScalingX, scaleY = this._filterScalingY, w2 = this.width, h3 = this.height, min = Math.min, max = Math.max, cropX = max(this.cropX, 0), cropY = max(this.cropY, 0), elWidth = elementToDraw.naturalWidth || elementToDraw.width, elHeight = elementToDraw.naturalHeight || elementToDraw.height, sX = cropX * scaleX, sY = cropY * scaleY, sW = min(w2 * scaleX, elWidth - sX), sH = min(h3 * scaleY, elHeight - sY), x2 = -w2 / 2, y3 = -h3 / 2, maxDestW = min(w2, elWidth / scaleX - cropX), maxDestH = min(h3, elHeight / scaleY - cropY);
        elementToDraw && ctx.drawImage(elementToDraw, sX, sY, sW, sH, x2, y3, maxDestW, maxDestH);
      },
      _needsResize: function() {
        var scale = this.getTotalObjectScaling();
        return scale.scaleX !== this._lastScaleX || scale.scaleY !== this._lastScaleY;
      },
      _resetWidthHeight: function() {
        this.set(this.getOriginalSize());
      },
      _initElement: function(element, options) {
        this.setElement(fabric2.util.getById(element), options);
        fabric2.util.addClass(this.getElement(), fabric2.Image.CSS_CANVAS);
      },
      _initConfig: function(options) {
        options || (options = {});
        this.setOptions(options);
        this._setWidthHeight(options);
      },
      _initFilters: function(filters, callback) {
        if (filters && filters.length) {
          fabric2.util.enlivenObjects(filters, function(enlivenedObjects) {
            callback && callback(enlivenedObjects);
          }, "fabric.Image.filters");
        } else {
          callback && callback();
        }
      },
      _setWidthHeight: function(options) {
        options || (options = {});
        var el = this.getElement();
        this.width = options.width || el.naturalWidth || el.width || 0;
        this.height = options.height || el.naturalHeight || el.height || 0;
      },
      parsePreserveAspectRatioAttribute: function() {
        var pAR = fabric2.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ""), rWidth = this._element.width, rHeight = this._element.height, scaleX = 1, scaleY = 1, offsetLeft = 0, offsetTop = 0, cropX = 0, cropY = 0, offset, pWidth = this.width, pHeight = this.height, parsedAttributes = { width: pWidth, height: pHeight };
        if (pAR && (pAR.alignX !== "none" || pAR.alignY !== "none")) {
          if (pAR.meetOrSlice === "meet") {
            scaleX = scaleY = fabric2.util.findScaleToFit(this._element, parsedAttributes);
            offset = (pWidth - rWidth * scaleX) / 2;
            if (pAR.alignX === "Min") {
              offsetLeft = -offset;
            }
            if (pAR.alignX === "Max") {
              offsetLeft = offset;
            }
            offset = (pHeight - rHeight * scaleY) / 2;
            if (pAR.alignY === "Min") {
              offsetTop = -offset;
            }
            if (pAR.alignY === "Max") {
              offsetTop = offset;
            }
          }
          if (pAR.meetOrSlice === "slice") {
            scaleX = scaleY = fabric2.util.findScaleToCover(this._element, parsedAttributes);
            offset = rWidth - pWidth / scaleX;
            if (pAR.alignX === "Mid") {
              cropX = offset / 2;
            }
            if (pAR.alignX === "Max") {
              cropX = offset;
            }
            offset = rHeight - pHeight / scaleY;
            if (pAR.alignY === "Mid") {
              cropY = offset / 2;
            }
            if (pAR.alignY === "Max") {
              cropY = offset;
            }
            rWidth = pWidth / scaleX;
            rHeight = pHeight / scaleY;
          }
        } else {
          scaleX = pWidth / rWidth;
          scaleY = pHeight / rHeight;
        }
        return {
          width: rWidth,
          height: rHeight,
          scaleX,
          scaleY,
          offsetLeft,
          offsetTop,
          cropX,
          cropY
        };
      }
    });
    fabric2.Image.CSS_CANVAS = "canvas-img";
    fabric2.Image.prototype.getSvgSrc = fabric2.Image.prototype.getSrc;
    fabric2.Image.fromObject = function(_object, callback) {
      var object = fabric2.util.object.clone(_object);
      fabric2.util.loadImage(object.src, function(img, isError) {
        if (isError) {
          callback && callback(null, true);
          return;
        }
        fabric2.Image.prototype._initFilters.call(object, object.filters, function(filters) {
          object.filters = filters || [];
          fabric2.Image.prototype._initFilters.call(object, [object.resizeFilter], function(resizeFilters) {
            object.resizeFilter = resizeFilters[0];
            fabric2.util.enlivenObjectEnlivables(object, object, function() {
              var image = new fabric2.Image(img, object);
              callback(image, false);
            });
          });
        });
      }, null, object.crossOrigin);
    };
    fabric2.Image.fromURL = function(url, callback, imgOptions) {
      fabric2.util.loadImage(url, function(img, isError) {
        callback && callback(new fabric2.Image(img, imgOptions), isError);
      }, null, imgOptions && imgOptions.crossOrigin);
    };
    fabric2.Image.ATTRIBUTE_NAMES = fabric2.SHARED_ATTRIBUTES.concat(
      "x y width height preserveAspectRatio xlink:href crossOrigin image-rendering".split(" ")
    );
    fabric2.Image.fromElement = function(element, callback, options) {
      var parsedAttributes = fabric2.parseAttributes(element, fabric2.Image.ATTRIBUTE_NAMES);
      fabric2.Image.fromURL(
        parsedAttributes["xlink:href"],
        callback,
        extend(options ? fabric2.util.object.clone(options) : {}, parsedAttributes)
      );
    };
  })(exports);
  fabric2.util.object.extend(fabric2.Object.prototype, {
    _getAngleValueForStraighten: function() {
      var angle = this.angle % 360;
      if (angle > 0) {
        return Math.round((angle - 1) / 90) * 90;
      }
      return Math.round(angle / 90) * 90;
    },
    straighten: function() {
      return this.rotate(this._getAngleValueForStraighten());
    },
    fxStraighten: function(callbacks) {
      callbacks = callbacks || {};
      var empty = function() {
      }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;
      return fabric2.util.animate({
        target: this,
        startValue: this.get("angle"),
        endValue: this._getAngleValueForStraighten(),
        duration: this.FX_DURATION,
        onChange: function(value) {
          _this.rotate(value);
          onChange();
        },
        onComplete: function() {
          _this.setCoords();
          onComplete();
        }
      });
    }
  });
  fabric2.util.object.extend(fabric2.StaticCanvas.prototype, {
    straightenObject: function(object) {
      object.straighten();
      this.requestRenderAll();
      return this;
    },
    fxStraightenObject: function(object) {
      return object.fxStraighten({
        onChange: this.requestRenderAllBound
      });
    }
  });
  (function() {
    function testPrecision(gl, precision) {
      var fragmentSource = "precision " + precision + " float;\nvoid main(){}";
      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        return false;
      }
      return true;
    }
    fabric2.isWebglSupported = function(tileSize) {
      if (fabric2.isLikelyNode) {
        return false;
      }
      tileSize = tileSize || fabric2.WebglFilterBackend.prototype.tileSize;
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      var isSupported = false;
      if (gl) {
        fabric2.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        isSupported = fabric2.maxTextureSize >= tileSize;
        var precisions = ["highp", "mediump", "lowp"];
        for (var i2 = 0; i2 < 3; i2++) {
          if (testPrecision(gl, precisions[i2])) {
            fabric2.webGlPrecision = precisions[i2];
            break;
          }
        }
      }
      this.isSupported = isSupported;
      return isSupported;
    };
    fabric2.WebglFilterBackend = WebglFilterBackend;
    function WebglFilterBackend(options) {
      if (options && options.tileSize) {
        this.tileSize = options.tileSize;
      }
      this.setupGLContext(this.tileSize, this.tileSize);
      this.captureGPUInfo();
    }
    WebglFilterBackend.prototype = {
      tileSize: 2048,
      resources: {},
      setupGLContext: function(width, height) {
        this.dispose();
        this.createWebGLCanvas(width, height);
        this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);
        this.chooseFastestCopyGLTo2DMethod(width, height);
      },
      chooseFastestCopyGLTo2DMethod: function(width, height) {
        var canMeasurePerf = typeof window.performance !== "undefined", canUseImageData;
        try {
          new ImageData(1, 1);
          canUseImageData = true;
        } catch (e2) {
          canUseImageData = false;
        }
        var canUseArrayBuffer = typeof ArrayBuffer !== "undefined";
        var canUseUint8Clamped = typeof Uint8ClampedArray !== "undefined";
        if (!(canMeasurePerf && canUseImageData && canUseArrayBuffer && canUseUint8Clamped)) {
          return;
        }
        var targetCanvas = fabric2.util.createCanvasElement();
        var imageBuffer = new ArrayBuffer(width * height * 4);
        if (fabric2.forceGLPutImageData) {
          this.imageBuffer = imageBuffer;
          this.copyGLTo2D = copyGLTo2DPutImageData;
          return;
        }
        var testContext = {
          imageBuffer,
          destinationWidth: width,
          destinationHeight: height,
          targetCanvas
        };
        var startTime, drawImageTime, putImageDataTime;
        targetCanvas.width = width;
        targetCanvas.height = height;
        startTime = window.performance.now();
        copyGLTo2DDrawImage.call(testContext, this.gl, testContext);
        drawImageTime = window.performance.now() - startTime;
        startTime = window.performance.now();
        copyGLTo2DPutImageData.call(testContext, this.gl, testContext);
        putImageDataTime = window.performance.now() - startTime;
        if (drawImageTime > putImageDataTime) {
          this.imageBuffer = imageBuffer;
          this.copyGLTo2D = copyGLTo2DPutImageData;
        } else {
          this.copyGLTo2D = copyGLTo2DDrawImage;
        }
      },
      createWebGLCanvas: function(width, height) {
        var canvas = fabric2.util.createCanvasElement();
        canvas.width = width;
        canvas.height = height;
        var glOptions = {
          alpha: true,
          premultipliedAlpha: false,
          depth: false,
          stencil: false,
          antialias: false
        }, gl = canvas.getContext("webgl", glOptions);
        if (!gl) {
          gl = canvas.getContext("experimental-webgl", glOptions);
        }
        if (!gl) {
          return;
        }
        gl.clearColor(0, 0, 0, 0);
        this.canvas = canvas;
        this.gl = gl;
      },
      applyFilters: function(filters, source, width, height, targetCanvas, cacheKey) {
        var gl = this.gl;
        var cachedTexture;
        if (cacheKey) {
          cachedTexture = this.getCachedTexture(cacheKey, source);
        }
        var pipelineState = {
          originalWidth: source.width || source.originalWidth,
          originalHeight: source.height || source.originalHeight,
          sourceWidth: width,
          sourceHeight: height,
          destinationWidth: width,
          destinationHeight: height,
          context: gl,
          sourceTexture: this.createTexture(gl, width, height, !cachedTexture && source),
          targetTexture: this.createTexture(gl, width, height),
          originalTexture: cachedTexture || this.createTexture(gl, width, height, !cachedTexture && source),
          passes: filters.length,
          webgl: true,
          aPosition: this.aPosition,
          programCache: this.programCache,
          pass: 0,
          filterBackend: this,
          targetCanvas
        };
        var tempFbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, tempFbo);
        filters.forEach(function(filter) {
          filter && filter.applyTo(pipelineState);
        });
        resizeCanvasIfNeeded(pipelineState);
        this.copyGLTo2D(gl, pipelineState);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.deleteTexture(pipelineState.sourceTexture);
        gl.deleteTexture(pipelineState.targetTexture);
        gl.deleteFramebuffer(tempFbo);
        targetCanvas.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
        return pipelineState;
      },
      dispose: function() {
        if (this.canvas) {
          this.canvas = null;
          this.gl = null;
        }
        this.clearWebGLCaches();
      },
      clearWebGLCaches: function() {
        this.programCache = {};
        this.textureCache = {};
      },
      createTexture: function(gl, width, height, textureImageSource) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (textureImageSource) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImageSource);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        return texture;
      },
      getCachedTexture: function(uniqueId, textureImageSource) {
        if (this.textureCache[uniqueId]) {
          return this.textureCache[uniqueId];
        } else {
          var texture = this.createTexture(
            this.gl,
            textureImageSource.width,
            textureImageSource.height,
            textureImageSource
          );
          this.textureCache[uniqueId] = texture;
          return texture;
        }
      },
      evictCachesForKey: function(cacheKey) {
        if (this.textureCache[cacheKey]) {
          this.gl.deleteTexture(this.textureCache[cacheKey]);
          delete this.textureCache[cacheKey];
        }
      },
      copyGLTo2D: copyGLTo2DDrawImage,
      captureGPUInfo: function() {
        if (this.gpuInfo) {
          return this.gpuInfo;
        }
        var gl = this.gl, gpuInfo = { renderer: "", vendor: "" };
        if (!gl) {
          return gpuInfo;
        }
        var ext = gl.getExtension("WEBGL_debug_renderer_info");
        if (ext) {
          var renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
          var vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
          if (renderer) {
            gpuInfo.renderer = renderer.toLowerCase();
          }
          if (vendor) {
            gpuInfo.vendor = vendor.toLowerCase();
          }
        }
        this.gpuInfo = gpuInfo;
        return gpuInfo;
      }
    };
  })();
  function resizeCanvasIfNeeded(pipelineState) {
    var targetCanvas = pipelineState.targetCanvas, width = targetCanvas.width, height = targetCanvas.height, dWidth = pipelineState.destinationWidth, dHeight = pipelineState.destinationHeight;
    if (width !== dWidth || height !== dHeight) {
      targetCanvas.width = dWidth;
      targetCanvas.height = dHeight;
    }
  }
  function copyGLTo2DDrawImage(gl, pipelineState) {
    var glCanvas = gl.canvas, targetCanvas = pipelineState.targetCanvas, ctx = targetCanvas.getContext("2d");
    ctx.translate(0, targetCanvas.height);
    ctx.scale(1, -1);
    var sourceY = glCanvas.height - targetCanvas.height;
    ctx.drawImage(
      glCanvas,
      0,
      sourceY,
      targetCanvas.width,
      targetCanvas.height,
      0,
      0,
      targetCanvas.width,
      targetCanvas.height
    );
  }
  function copyGLTo2DPutImageData(gl, pipelineState) {
    var targetCanvas = pipelineState.targetCanvas, ctx = targetCanvas.getContext("2d"), dWidth = pipelineState.destinationWidth, dHeight = pipelineState.destinationHeight, numBytes = dWidth * dHeight * 4;
    var u8 = new Uint8Array(this.imageBuffer, 0, numBytes);
    var u8Clamped = new Uint8ClampedArray(this.imageBuffer, 0, numBytes);
    gl.readPixels(0, 0, dWidth, dHeight, gl.RGBA, gl.UNSIGNED_BYTE, u8);
    var imgData = new ImageData(u8Clamped, dWidth, dHeight);
    ctx.putImageData(imgData, 0, 0);
  }
  (function() {
    var noop = function() {
    };
    fabric2.Canvas2dFilterBackend = Canvas2dFilterBackend;
    function Canvas2dFilterBackend() {
    }
    Canvas2dFilterBackend.prototype = {
      evictCachesForKey: noop,
      dispose: noop,
      clearWebGLCaches: noop,
      resources: {},
      applyFilters: function(filters, sourceElement, sourceWidth, sourceHeight, targetCanvas) {
        var ctx = targetCanvas.getContext("2d");
        ctx.drawImage(sourceElement, 0, 0, sourceWidth, sourceHeight);
        var imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
        var originalImageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
        var pipelineState = {
          sourceWidth,
          sourceHeight,
          imageData,
          originalEl: sourceElement,
          originalImageData,
          canvasEl: targetCanvas,
          ctx,
          filterBackend: this
        };
        filters.forEach(function(filter) {
          filter.applyTo(pipelineState);
        });
        if (pipelineState.imageData.width !== sourceWidth || pipelineState.imageData.height !== sourceHeight) {
          targetCanvas.width = pipelineState.imageData.width;
          targetCanvas.height = pipelineState.imageData.height;
        }
        ctx.putImageData(pipelineState.imageData, 0, 0);
        return pipelineState;
      }
    };
  })();
  fabric2.Image = fabric2.Image || {};
  fabric2.Image.filters = fabric2.Image.filters || {};
  fabric2.Image.filters.BaseFilter = fabric2.util.createClass({
    type: "BaseFilter",
    vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
    fragmentSource: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}",
    initialize: function(options) {
      if (options) {
        this.setOptions(options);
      }
    },
    setOptions: function(options) {
      for (var prop in options) {
        this[prop] = options[prop];
      }
    },
    createProgram: function(gl, fragmentSource, vertexSource) {
      fragmentSource = fragmentSource || this.fragmentSource;
      vertexSource = vertexSource || this.vertexSource;
      if (fabric2.webGlPrecision !== "highp") {
        fragmentSource = fragmentSource.replace(
          /precision highp float/g,
          "precision " + fabric2.webGlPrecision + " float"
        );
      }
      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexSource);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(
          "Vertex shader compile error for " + this.type + ": " + gl.getShaderInfoLog(vertexShader)
        );
      }
      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentSource);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(
          "Fragment shader compile error for " + this.type + ": " + gl.getShaderInfoLog(fragmentShader)
        );
      }
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(
          'Shader link error for "${this.type}" ' + gl.getProgramInfoLog(program)
        );
      }
      var attributeLocations = this.getAttributeLocations(gl, program);
      var uniformLocations = this.getUniformLocations(gl, program) || {};
      uniformLocations.uStepW = gl.getUniformLocation(program, "uStepW");
      uniformLocations.uStepH = gl.getUniformLocation(program, "uStepH");
      return {
        program,
        attributeLocations,
        uniformLocations
      };
    },
    getAttributeLocations: function(gl, program) {
      return {
        aPosition: gl.getAttribLocation(program, "aPosition")
      };
    },
    getUniformLocations: function() {
      return {};
    },
    sendAttributeData: function(gl, attributeLocations, aPositionData) {
      var attributeLocation = attributeLocations.aPosition;
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attributeLocation);
      gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);
      gl.bufferData(gl.ARRAY_BUFFER, aPositionData, gl.STATIC_DRAW);
    },
    _setupFrameBuffer: function(options) {
      var gl = options.context, width, height;
      if (options.passes > 1) {
        width = options.destinationWidth;
        height = options.destinationHeight;
        if (options.sourceWidth !== width || options.sourceHeight !== height) {
          gl.deleteTexture(options.targetTexture);
          options.targetTexture = options.filterBackend.createTexture(gl, width, height);
        }
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          options.targetTexture,
          0
        );
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.finish();
      }
    },
    _swapTextures: function(options) {
      options.passes--;
      options.pass++;
      var temp = options.targetTexture;
      options.targetTexture = options.sourceTexture;
      options.sourceTexture = temp;
    },
    isNeutralState: function() {
      var main = this.mainParameter, _class = fabric2.Image.filters[this.type].prototype;
      if (main) {
        if (Array.isArray(_class[main])) {
          for (var i2 = _class[main].length; i2--; ) {
            if (this[main][i2] !== _class[main][i2]) {
              return false;
            }
          }
          return true;
        } else {
          return _class[main] === this[main];
        }
      } else {
        return false;
      }
    },
    applyTo: function(options) {
      if (options.webgl) {
        this._setupFrameBuffer(options);
        this.applyToWebGL(options);
        this._swapTextures(options);
      } else {
        this.applyTo2d(options);
      }
    },
    retrieveShader: function(options) {
      if (!options.programCache.hasOwnProperty(this.type)) {
        options.programCache[this.type] = this.createProgram(options.context);
      }
      return options.programCache[this.type];
    },
    applyToWebGL: function(options) {
      var gl = options.context;
      var shader = this.retrieveShader(options);
      if (options.pass === 0 && options.originalTexture) {
        gl.bindTexture(gl.TEXTURE_2D, options.originalTexture);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, options.sourceTexture);
      }
      gl.useProgram(shader.program);
      this.sendAttributeData(gl, shader.attributeLocations, options.aPosition);
      gl.uniform1f(shader.uniformLocations.uStepW, 1 / options.sourceWidth);
      gl.uniform1f(shader.uniformLocations.uStepH, 1 / options.sourceHeight);
      this.sendUniformData(gl, shader.uniformLocations);
      gl.viewport(0, 0, options.destinationWidth, options.destinationHeight);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    bindAdditionalTexture: function(gl, texture, textureUnit) {
      gl.activeTexture(textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.activeTexture(gl.TEXTURE0);
    },
    unbindAdditionalTexture: function(gl, textureUnit) {
      gl.activeTexture(textureUnit);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE0);
    },
    getMainParameter: function() {
      return this[this.mainParameter];
    },
    setMainParameter: function(value) {
      this[this.mainParameter] = value;
    },
    sendUniformData: function() {
    },
    createHelpLayer: function(options) {
      if (!options.helpLayer) {
        var helpLayer = document.createElement("canvas");
        helpLayer.width = options.sourceWidth;
        helpLayer.height = options.sourceHeight;
        options.helpLayer = helpLayer;
      }
    },
    toObject: function() {
      var object = { type: this.type }, mainP = this.mainParameter;
      if (mainP) {
        object[mainP] = this[mainP];
      }
      return object;
    },
    toJSON: function() {
      return this.toObject();
    }
  });
  fabric2.Image.filters.BaseFilter.fromObject = function(object, callback) {
    var filter = new fabric2.Image.filters[object.type](object);
    callback && callback(filter);
    return filter;
  };
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.ColorMatrix = createClass(filters.BaseFilter, {
      type: "ColorMatrix",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}",
      matrix: [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ],
      mainParameter: "matrix",
      colorsOnly: true,
      initialize: function(options) {
        this.callSuper("initialize", options);
        this.matrix = this.matrix.slice(0);
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, iLen = data.length, m3 = this.matrix, r, g, b2, a3, i2, colorsOnly = this.colorsOnly;
        for (i2 = 0; i2 < iLen; i2 += 4) {
          r = data[i2];
          g = data[i2 + 1];
          b2 = data[i2 + 2];
          if (colorsOnly) {
            data[i2] = r * m3[0] + g * m3[1] + b2 * m3[2] + m3[4] * 255;
            data[i2 + 1] = r * m3[5] + g * m3[6] + b2 * m3[7] + m3[9] * 255;
            data[i2 + 2] = r * m3[10] + g * m3[11] + b2 * m3[12] + m3[14] * 255;
          } else {
            a3 = data[i2 + 3];
            data[i2] = r * m3[0] + g * m3[1] + b2 * m3[2] + a3 * m3[3] + m3[4] * 255;
            data[i2 + 1] = r * m3[5] + g * m3[6] + b2 * m3[7] + a3 * m3[8] + m3[9] * 255;
            data[i2 + 2] = r * m3[10] + g * m3[11] + b2 * m3[12] + a3 * m3[13] + m3[14] * 255;
            data[i2 + 3] = r * m3[15] + g * m3[16] + b2 * m3[17] + a3 * m3[18] + m3[19] * 255;
          }
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uColorMatrix: gl.getUniformLocation(program, "uColorMatrix"),
          uConstants: gl.getUniformLocation(program, "uConstants")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var m3 = this.matrix, matrix = [
          m3[0],
          m3[1],
          m3[2],
          m3[3],
          m3[5],
          m3[6],
          m3[7],
          m3[8],
          m3[10],
          m3[11],
          m3[12],
          m3[13],
          m3[15],
          m3[16],
          m3[17],
          m3[18]
        ], constants = [m3[4], m3[9], m3[14], m3[19]];
        gl.uniformMatrix4fv(uniformLocations.uColorMatrix, false, matrix);
        gl.uniform4fv(uniformLocations.uConstants, constants);
      }
    });
    fabric3.Image.filters.ColorMatrix.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Brightness = createClass(filters.BaseFilter, {
      type: "Brightness",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}",
      brightness: 0,
      mainParameter: "brightness",
      applyTo2d: function(options) {
        if (this.brightness === 0) {
          return;
        }
        var imageData = options.imageData, data = imageData.data, i2, len = data.length, brightness = Math.round(this.brightness * 255);
        for (i2 = 0; i2 < len; i2 += 4) {
          data[i2] = data[i2] + brightness;
          data[i2 + 1] = data[i2 + 1] + brightness;
          data[i2 + 2] = data[i2 + 2] + brightness;
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uBrightness: gl.getUniformLocation(program, "uBrightness")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uBrightness, this.brightness);
      }
    });
    fabric3.Image.filters.Brightness.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Convolute = createClass(filters.BaseFilter, {
      type: "Convolute",
      opaque: false,
      matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
      fragmentSource: {
        Convolute_3_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
        Convolute_3_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
        Convolute_5_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
        Convolute_5_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
        Convolute_7_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
        Convolute_7_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
        Convolute_9_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
        Convolute_9_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}"
      },
      retrieveShader: function(options) {
        var size = Math.sqrt(this.matrix.length);
        var cacheKey = this.type + "_" + size + "_" + (this.opaque ? 1 : 0);
        var shaderSource = this.fragmentSource[cacheKey];
        if (!options.programCache.hasOwnProperty(cacheKey)) {
          options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
        }
        return options.programCache[cacheKey];
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, weights = this.matrix, side = Math.round(Math.sqrt(weights.length)), halfSide = Math.floor(side / 2), sw = imageData.width, sh = imageData.height, output = options.ctx.createImageData(sw, sh), dst = output.data, alphaFac = this.opaque ? 1 : 0, r, g, b2, a3, dstOff, scx, scy, srcOff, wt, x2, y3, cx, cy;
        for (y3 = 0; y3 < sh; y3++) {
          for (x2 = 0; x2 < sw; x2++) {
            dstOff = (y3 * sw + x2) * 4;
            r = 0;
            g = 0;
            b2 = 0;
            a3 = 0;
            for (cy = 0; cy < side; cy++) {
              for (cx = 0; cx < side; cx++) {
                scy = y3 + cy - halfSide;
                scx = x2 + cx - halfSide;
                if (scy < 0 || scy >= sh || scx < 0 || scx >= sw) {
                  continue;
                }
                srcOff = (scy * sw + scx) * 4;
                wt = weights[cy * side + cx];
                r += data[srcOff] * wt;
                g += data[srcOff + 1] * wt;
                b2 += data[srcOff + 2] * wt;
                if (!alphaFac) {
                  a3 += data[srcOff + 3] * wt;
                }
              }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b2;
            if (!alphaFac) {
              dst[dstOff + 3] = a3;
            } else {
              dst[dstOff + 3] = data[dstOff + 3];
            }
          }
        }
        options.imageData = output;
      },
      getUniformLocations: function(gl, program) {
        return {
          uMatrix: gl.getUniformLocation(program, "uMatrix"),
          uOpaque: gl.getUniformLocation(program, "uOpaque"),
          uHalfSize: gl.getUniformLocation(program, "uHalfSize"),
          uSize: gl.getUniformLocation(program, "uSize")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1fv(uniformLocations.uMatrix, this.matrix);
      },
      toObject: function() {
        return extend(this.callSuper("toObject"), {
          opaque: this.opaque,
          matrix: this.matrix
        });
      }
    });
    fabric3.Image.filters.Convolute.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Grayscale = createClass(filters.BaseFilter, {
      type: "Grayscale",
      fragmentSource: {
        average: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}",
        lightness: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}",
        luminosity: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}"
      },
      mode: "average",
      mainParameter: "mode",
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, i2, len = data.length, value, mode = this.mode;
        for (i2 = 0; i2 < len; i2 += 4) {
          if (mode === "average") {
            value = (data[i2] + data[i2 + 1] + data[i2 + 2]) / 3;
          } else if (mode === "lightness") {
            value = (Math.min(data[i2], data[i2 + 1], data[i2 + 2]) + Math.max(data[i2], data[i2 + 1], data[i2 + 2])) / 2;
          } else if (mode === "luminosity") {
            value = 0.21 * data[i2] + 0.72 * data[i2 + 1] + 0.07 * data[i2 + 2];
          }
          data[i2] = value;
          data[i2 + 1] = value;
          data[i2 + 2] = value;
        }
      },
      retrieveShader: function(options) {
        var cacheKey = this.type + "_" + this.mode;
        if (!options.programCache.hasOwnProperty(cacheKey)) {
          var shaderSource = this.fragmentSource[this.mode];
          options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
        }
        return options.programCache[cacheKey];
      },
      getUniformLocations: function(gl, program) {
        return {
          uMode: gl.getUniformLocation(program, "uMode")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var mode = 1;
        gl.uniform1i(uniformLocations.uMode, mode);
      },
      isNeutralState: function() {
        return false;
      }
    });
    fabric3.Image.filters.Grayscale.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Invert = createClass(filters.BaseFilter, {
      type: "Invert",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}",
      invert: true,
      mainParameter: "invert",
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, i2, len = data.length;
        for (i2 = 0; i2 < len; i2 += 4) {
          data[i2] = 255 - data[i2];
          data[i2 + 1] = 255 - data[i2 + 1];
          data[i2 + 2] = 255 - data[i2 + 2];
        }
      },
      isNeutralState: function() {
        return !this.invert;
      },
      getUniformLocations: function(gl, program) {
        return {
          uInvert: gl.getUniformLocation(program, "uInvert")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1i(uniformLocations.uInvert, this.invert);
      }
    });
    fabric3.Image.filters.Invert.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Noise = createClass(filters.BaseFilter, {
      type: "Noise",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}",
      mainParameter: "noise",
      noise: 0,
      applyTo2d: function(options) {
        if (this.noise === 0) {
          return;
        }
        var imageData = options.imageData, data = imageData.data, i2, len = data.length, noise = this.noise, rand;
        for (i2 = 0, len = data.length; i2 < len; i2 += 4) {
          rand = (0.5 - Math.random()) * noise;
          data[i2] += rand;
          data[i2 + 1] += rand;
          data[i2 + 2] += rand;
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uNoise: gl.getUniformLocation(program, "uNoise"),
          uSeed: gl.getUniformLocation(program, "uSeed")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uNoise, this.noise / 255);
        gl.uniform1f(uniformLocations.uSeed, Math.random());
      },
      toObject: function() {
        return extend(this.callSuper("toObject"), {
          noise: this.noise
        });
      }
    });
    fabric3.Image.filters.Noise.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Pixelate = createClass(filters.BaseFilter, {
      type: "Pixelate",
      blocksize: 4,
      mainParameter: "blocksize",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}",
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, iLen = imageData.height, jLen = imageData.width, index, i2, j, r, g, b2, a3, _i, _j, _iLen, _jLen;
        for (i2 = 0; i2 < iLen; i2 += this.blocksize) {
          for (j = 0; j < jLen; j += this.blocksize) {
            index = i2 * 4 * jLen + j * 4;
            r = data[index];
            g = data[index + 1];
            b2 = data[index + 2];
            a3 = data[index + 3];
            _iLen = Math.min(i2 + this.blocksize, iLen);
            _jLen = Math.min(j + this.blocksize, jLen);
            for (_i = i2; _i < _iLen; _i++) {
              for (_j = j; _j < _jLen; _j++) {
                index = _i * 4 * jLen + _j * 4;
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b2;
                data[index + 3] = a3;
              }
            }
          }
        }
      },
      isNeutralState: function() {
        return this.blocksize === 1;
      },
      getUniformLocations: function(gl, program) {
        return {
          uBlocksize: gl.getUniformLocation(program, "uBlocksize"),
          uStepW: gl.getUniformLocation(program, "uStepW"),
          uStepH: gl.getUniformLocation(program, "uStepH")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uBlocksize, this.blocksize);
      }
    });
    fabric3.Image.filters.Pixelate.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), extend = fabric3.util.object.extend, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.RemoveColor = createClass(filters.BaseFilter, {
      type: "RemoveColor",
      color: "#FFFFFF",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}",
      distance: 0.02,
      useAlpha: false,
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, i2, distance = this.distance * 255, r, g, b2, source = new fabric3.Color(this.color).getSource(), lowC = [
          source[0] - distance,
          source[1] - distance,
          source[2] - distance
        ], highC = [
          source[0] + distance,
          source[1] + distance,
          source[2] + distance
        ];
        for (i2 = 0; i2 < data.length; i2 += 4) {
          r = data[i2];
          g = data[i2 + 1];
          b2 = data[i2 + 2];
          if (r > lowC[0] && g > lowC[1] && b2 > lowC[2] && r < highC[0] && g < highC[1] && b2 < highC[2]) {
            data[i2 + 3] = 0;
          }
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uLow: gl.getUniformLocation(program, "uLow"),
          uHigh: gl.getUniformLocation(program, "uHigh")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var source = new fabric3.Color(this.color).getSource(), distance = parseFloat(this.distance), lowC = [
          0 + source[0] / 255 - distance,
          0 + source[1] / 255 - distance,
          0 + source[2] / 255 - distance,
          1
        ], highC = [
          source[0] / 255 + distance,
          source[1] / 255 + distance,
          source[2] / 255 + distance,
          1
        ];
        gl.uniform4fv(uniformLocations.uLow, lowC);
        gl.uniform4fv(uniformLocations.uHigh, highC);
      },
      toObject: function() {
        return extend(this.callSuper("toObject"), {
          color: this.color,
          distance: this.distance
        });
      }
    });
    fabric3.Image.filters.RemoveColor.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    var matrices = {
      Brownie: [
        0.5997,
        0.34553,
        -0.27082,
        0,
        0.186,
        -0.0377,
        0.86095,
        0.15059,
        0,
        -0.1449,
        0.24113,
        -0.07441,
        0.44972,
        0,
        -0.02965,
        0,
        0,
        0,
        1,
        0
      ],
      Vintage: [
        0.62793,
        0.32021,
        -0.03965,
        0,
        0.03784,
        0.02578,
        0.64411,
        0.03259,
        0,
        0.02926,
        0.0466,
        -0.08512,
        0.52416,
        0,
        0.02023,
        0,
        0,
        0,
        1,
        0
      ],
      Kodachrome: [
        1.12855,
        -0.39673,
        -0.03992,
        0,
        0.24991,
        -0.16404,
        1.08352,
        -0.05498,
        0,
        0.09698,
        -0.16786,
        -0.56034,
        1.60148,
        0,
        0.13972,
        0,
        0,
        0,
        1,
        0
      ],
      Technicolor: [
        1.91252,
        -0.85453,
        -0.09155,
        0,
        0.04624,
        -0.30878,
        1.76589,
        -0.10601,
        0,
        -0.27589,
        -0.2311,
        -0.75018,
        1.84759,
        0,
        0.12137,
        0,
        0,
        0,
        1,
        0
      ],
      Polaroid: [
        1.438,
        -0.062,
        -0.062,
        0,
        0,
        -0.122,
        1.378,
        -0.122,
        0,
        0,
        -0.016,
        -0.016,
        1.483,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ],
      Sepia: [
        0.393,
        0.769,
        0.189,
        0,
        0,
        0.349,
        0.686,
        0.168,
        0,
        0,
        0.272,
        0.534,
        0.131,
        0,
        0,
        0,
        0,
        0,
        1,
        0
      ],
      BlackWhite: [
        1.5,
        1.5,
        1.5,
        0,
        -1,
        1.5,
        1.5,
        1.5,
        0,
        -1,
        1.5,
        1.5,
        1.5,
        0,
        -1,
        0,
        0,
        0,
        1,
        0
      ]
    };
    for (var key in matrices) {
      filters[key] = createClass(filters.ColorMatrix, {
        type: key,
        matrix: matrices[key],
        mainParameter: false,
        colorsOnly: true
      });
      fabric3.Image.filters[key].fromObject = fabric3.Image.filters.BaseFilter.fromObject;
    }
  })(exports);
  (function(global) {
    var fabric3 = global.fabric, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.BlendColor = createClass(filters.BaseFilter, {
      type: "BlendColor",
      color: "#F95C63",
      mode: "multiply",
      alpha: 1,
      fragmentSource: {
        multiply: "gl_FragColor.rgb *= uColor.rgb;\n",
        screen: "gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n",
        add: "gl_FragColor.rgb += uColor.rgb;\n",
        diff: "gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n",
        subtract: "gl_FragColor.rgb -= uColor.rgb;\n",
        lighten: "gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n",
        darken: "gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n",
        exclusion: "gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n",
        overlay: "if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n",
        tint: "gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n"
      },
      buildSource: function(mode) {
        return "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n" + this.fragmentSource[mode] + "}\n}";
      },
      retrieveShader: function(options) {
        var cacheKey = this.type + "_" + this.mode, shaderSource;
        if (!options.programCache.hasOwnProperty(cacheKey)) {
          shaderSource = this.buildSource(this.mode);
          options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
        }
        return options.programCache[cacheKey];
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, iLen = data.length, tr, tg, tb, r, g, b2, source, alpha1 = 1 - this.alpha;
        source = new fabric3.Color(this.color).getSource();
        tr = source[0] * this.alpha;
        tg = source[1] * this.alpha;
        tb = source[2] * this.alpha;
        for (var i2 = 0; i2 < iLen; i2 += 4) {
          r = data[i2];
          g = data[i2 + 1];
          b2 = data[i2 + 2];
          switch (this.mode) {
            case "multiply":
              data[i2] = r * tr / 255;
              data[i2 + 1] = g * tg / 255;
              data[i2 + 2] = b2 * tb / 255;
              break;
            case "screen":
              data[i2] = 255 - (255 - r) * (255 - tr) / 255;
              data[i2 + 1] = 255 - (255 - g) * (255 - tg) / 255;
              data[i2 + 2] = 255 - (255 - b2) * (255 - tb) / 255;
              break;
            case "add":
              data[i2] = r + tr;
              data[i2 + 1] = g + tg;
              data[i2 + 2] = b2 + tb;
              break;
            case "diff":
            case "difference":
              data[i2] = Math.abs(r - tr);
              data[i2 + 1] = Math.abs(g - tg);
              data[i2 + 2] = Math.abs(b2 - tb);
              break;
            case "subtract":
              data[i2] = r - tr;
              data[i2 + 1] = g - tg;
              data[i2 + 2] = b2 - tb;
              break;
            case "darken":
              data[i2] = Math.min(r, tr);
              data[i2 + 1] = Math.min(g, tg);
              data[i2 + 2] = Math.min(b2, tb);
              break;
            case "lighten":
              data[i2] = Math.max(r, tr);
              data[i2 + 1] = Math.max(g, tg);
              data[i2 + 2] = Math.max(b2, tb);
              break;
            case "overlay":
              data[i2] = tr < 128 ? 2 * r * tr / 255 : 255 - 2 * (255 - r) * (255 - tr) / 255;
              data[i2 + 1] = tg < 128 ? 2 * g * tg / 255 : 255 - 2 * (255 - g) * (255 - tg) / 255;
              data[i2 + 2] = tb < 128 ? 2 * b2 * tb / 255 : 255 - 2 * (255 - b2) * (255 - tb) / 255;
              break;
            case "exclusion":
              data[i2] = tr + r - 2 * tr * r / 255;
              data[i2 + 1] = tg + g - 2 * tg * g / 255;
              data[i2 + 2] = tb + b2 - 2 * tb * b2 / 255;
              break;
            case "tint":
              data[i2] = tr + r * alpha1;
              data[i2 + 1] = tg + g * alpha1;
              data[i2 + 2] = tb + b2 * alpha1;
          }
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uColor: gl.getUniformLocation(program, "uColor")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var source = new fabric3.Color(this.color).getSource();
        source[0] = this.alpha * source[0] / 255;
        source[1] = this.alpha * source[1] / 255;
        source[2] = this.alpha * source[2] / 255;
        source[3] = this.alpha;
        gl.uniform4fv(uniformLocations.uColor, source);
      },
      toObject: function() {
        return {
          type: this.type,
          color: this.color,
          mode: this.mode,
          alpha: this.alpha
        };
      }
    });
    fabric3.Image.filters.BlendColor.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.BlendImage = createClass(filters.BaseFilter, {
      type: "BlendImage",
      image: null,
      mode: "multiply",
      alpha: 1,
      vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
      fragmentSource: {
        multiply: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}",
        mask: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}"
      },
      retrieveShader: function(options) {
        var cacheKey = this.type + "_" + this.mode;
        var shaderSource = this.fragmentSource[this.mode];
        if (!options.programCache.hasOwnProperty(cacheKey)) {
          options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
        }
        return options.programCache[cacheKey];
      },
      applyToWebGL: function(options) {
        var gl = options.context, texture = this.createTexture(options.filterBackend, this.image);
        this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
        this.callSuper("applyToWebGL", options);
        this.unbindAdditionalTexture(gl, gl.TEXTURE1);
      },
      createTexture: function(backend, image) {
        return backend.getCachedTexture(image.cacheKey, image._element);
      },
      calculateMatrix: function() {
        var image = this.image, width = image._element.width, height = image._element.height;
        return [
          1 / image.scaleX,
          0,
          0,
          0,
          1 / image.scaleY,
          0,
          -image.left / width,
          -image.top / height,
          1
        ];
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, resources = options.filterBackend.resources, data = imageData.data, iLen = data.length, width = imageData.width, height = imageData.height, tr, tg, tb, ta, r, g, b2, a3, canvas1, context, image = this.image, blendData;
        if (!resources.blendImage) {
          resources.blendImage = fabric3.util.createCanvasElement();
        }
        canvas1 = resources.blendImage;
        context = canvas1.getContext("2d");
        if (canvas1.width !== width || canvas1.height !== height) {
          canvas1.width = width;
          canvas1.height = height;
        } else {
          context.clearRect(0, 0, width, height);
        }
        context.setTransform(image.scaleX, 0, 0, image.scaleY, image.left, image.top);
        context.drawImage(image._element, 0, 0, width, height);
        blendData = context.getImageData(0, 0, width, height).data;
        for (var i2 = 0; i2 < iLen; i2 += 4) {
          r = data[i2];
          g = data[i2 + 1];
          b2 = data[i2 + 2];
          a3 = data[i2 + 3];
          tr = blendData[i2];
          tg = blendData[i2 + 1];
          tb = blendData[i2 + 2];
          ta = blendData[i2 + 3];
          switch (this.mode) {
            case "multiply":
              data[i2] = r * tr / 255;
              data[i2 + 1] = g * tg / 255;
              data[i2 + 2] = b2 * tb / 255;
              data[i2 + 3] = a3 * ta / 255;
              break;
            case "mask":
              data[i2 + 3] = ta;
              break;
          }
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uTransformMatrix: gl.getUniformLocation(program, "uTransformMatrix"),
          uImage: gl.getUniformLocation(program, "uImage")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var matrix = this.calculateMatrix();
        gl.uniform1i(uniformLocations.uImage, 1);
        gl.uniformMatrix3fv(uniformLocations.uTransformMatrix, false, matrix);
      },
      toObject: function() {
        return {
          type: this.type,
          image: this.image && this.image.toObject(),
          mode: this.mode,
          alpha: this.alpha
        };
      }
    });
    fabric3.Image.filters.BlendImage.fromObject = function(object, callback) {
      fabric3.Image.fromObject(object.image, function(image) {
        var options = fabric3.util.object.clone(object);
        options.image = image;
        callback(new fabric3.Image.filters.BlendImage(options));
      });
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), pow = Math.pow, floor = Math.floor, sqrt = Math.sqrt, abs = Math.abs, round = Math.round, sin = Math.sin, ceil = Math.ceil, filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Resize = createClass(filters.BaseFilter, {
      type: "Resize",
      resizeType: "hermite",
      scaleX: 1,
      scaleY: 1,
      lanczosLobes: 3,
      getUniformLocations: function(gl, program) {
        return {
          uDelta: gl.getUniformLocation(program, "uDelta"),
          uTaps: gl.getUniformLocation(program, "uTaps")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform2fv(uniformLocations.uDelta, this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]);
        gl.uniform1fv(uniformLocations.uTaps, this.taps);
      },
      retrieveShader: function(options) {
        var filterWindow = this.getFilterWindow(), cacheKey = this.type + "_" + filterWindow;
        if (!options.programCache.hasOwnProperty(cacheKey)) {
          var fragmentShader = this.generateShader(filterWindow);
          options.programCache[cacheKey] = this.createProgram(options.context, fragmentShader);
        }
        return options.programCache[cacheKey];
      },
      getFilterWindow: function() {
        var scale = this.tempScale;
        return Math.ceil(this.lanczosLobes / scale);
      },
      getTaps: function() {
        var lobeFunction = this.lanczosCreate(this.lanczosLobes), scale = this.tempScale, filterWindow = this.getFilterWindow(), taps = new Array(filterWindow);
        for (var i2 = 1; i2 <= filterWindow; i2++) {
          taps[i2 - 1] = lobeFunction(i2 * scale);
        }
        return taps;
      },
      generateShader: function(filterWindow) {
        var offsets = new Array(filterWindow), fragmentShader = this.fragmentSourceTOP, filterWindow;
        for (var i2 = 1; i2 <= filterWindow; i2++) {
          offsets[i2 - 1] = i2 + ".0 * uDelta";
        }
        fragmentShader += "uniform float uTaps[" + filterWindow + "];\n";
        fragmentShader += "void main() {\n";
        fragmentShader += "  vec4 color = texture2D(uTexture, vTexCoord);\n";
        fragmentShader += "  float sum = 1.0;\n";
        offsets.forEach(function(offset, i3) {
          fragmentShader += "  color += texture2D(uTexture, vTexCoord + " + offset + ") * uTaps[" + i3 + "];\n";
          fragmentShader += "  color += texture2D(uTexture, vTexCoord - " + offset + ") * uTaps[" + i3 + "];\n";
          fragmentShader += "  sum += 2.0 * uTaps[" + i3 + "];\n";
        });
        fragmentShader += "  gl_FragColor = color / sum;\n";
        fragmentShader += "}";
        return fragmentShader;
      },
      fragmentSourceTOP: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n",
      applyTo: function(options) {
        if (options.webgl) {
          options.passes++;
          this.width = options.sourceWidth;
          this.horizontal = true;
          this.dW = Math.round(this.width * this.scaleX);
          this.dH = options.sourceHeight;
          this.tempScale = this.dW / this.width;
          this.taps = this.getTaps();
          options.destinationWidth = this.dW;
          this._setupFrameBuffer(options);
          this.applyToWebGL(options);
          this._swapTextures(options);
          options.sourceWidth = options.destinationWidth;
          this.height = options.sourceHeight;
          this.horizontal = false;
          this.dH = Math.round(this.height * this.scaleY);
          this.tempScale = this.dH / this.height;
          this.taps = this.getTaps();
          options.destinationHeight = this.dH;
          this._setupFrameBuffer(options);
          this.applyToWebGL(options);
          this._swapTextures(options);
          options.sourceHeight = options.destinationHeight;
        } else {
          this.applyTo2d(options);
        }
      },
      isNeutralState: function() {
        return this.scaleX === 1 && this.scaleY === 1;
      },
      lanczosCreate: function(lobes) {
        return function(x2) {
          if (x2 >= lobes || x2 <= -lobes) {
            return 0;
          }
          if (x2 < 11920929e-14 && x2 > -11920929e-14) {
            return 1;
          }
          x2 *= Math.PI;
          var xx = x2 / lobes;
          return sin(x2) / x2 * sin(xx) / xx;
        };
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, scaleX = this.scaleX, scaleY = this.scaleY;
        this.rcpScaleX = 1 / scaleX;
        this.rcpScaleY = 1 / scaleY;
        var oW = imageData.width, oH = imageData.height, dW = round(oW * scaleX), dH = round(oH * scaleY), newData;
        if (this.resizeType === "sliceHack") {
          newData = this.sliceByTwo(options, oW, oH, dW, dH);
        } else if (this.resizeType === "hermite") {
          newData = this.hermiteFastResize(options, oW, oH, dW, dH);
        } else if (this.resizeType === "bilinear") {
          newData = this.bilinearFiltering(options, oW, oH, dW, dH);
        } else if (this.resizeType === "lanczos") {
          newData = this.lanczosResize(options, oW, oH, dW, dH);
        }
        options.imageData = newData;
      },
      sliceByTwo: function(options, oW, oH, dW, dH) {
        var imageData = options.imageData, mult = 0.5, doneW = false, doneH = false, stepW = oW * mult, stepH = oH * mult, resources = fabric3.filterBackend.resources, tmpCanvas, ctx, sX = 0, sY = 0, dX = oW, dY = 0;
        if (!resources.sliceByTwo) {
          resources.sliceByTwo = document.createElement("canvas");
        }
        tmpCanvas = resources.sliceByTwo;
        if (tmpCanvas.width < oW * 1.5 || tmpCanvas.height < oH) {
          tmpCanvas.width = oW * 1.5;
          tmpCanvas.height = oH;
        }
        ctx = tmpCanvas.getContext("2d");
        ctx.clearRect(0, 0, oW * 1.5, oH);
        ctx.putImageData(imageData, 0, 0);
        dW = floor(dW);
        dH = floor(dH);
        while (!doneW || !doneH) {
          oW = stepW;
          oH = stepH;
          if (dW < floor(stepW * mult)) {
            stepW = floor(stepW * mult);
          } else {
            stepW = dW;
            doneW = true;
          }
          if (dH < floor(stepH * mult)) {
            stepH = floor(stepH * mult);
          } else {
            stepH = dH;
            doneH = true;
          }
          ctx.drawImage(tmpCanvas, sX, sY, oW, oH, dX, dY, stepW, stepH);
          sX = dX;
          sY = dY;
          dY += stepH;
        }
        return ctx.getImageData(sX, sY, dW, dH);
      },
      lanczosResize: function(options, oW, oH, dW, dH) {
        function process(u2) {
          var v, i2, weight, idx, a3, red, green, blue, alpha, fX, fY;
          center.x = (u2 + 0.5) * ratioX;
          icenter.x = floor(center.x);
          for (v = 0; v < dH; v++) {
            center.y = (v + 0.5) * ratioY;
            icenter.y = floor(center.y);
            a3 = 0;
            red = 0;
            green = 0;
            blue = 0;
            alpha = 0;
            for (i2 = icenter.x - range2X; i2 <= icenter.x + range2X; i2++) {
              if (i2 < 0 || i2 >= oW) {
                continue;
              }
              fX = floor(1e3 * abs(i2 - center.x));
              if (!cacheLanc[fX]) {
                cacheLanc[fX] = {};
              }
              for (var j = icenter.y - range2Y; j <= icenter.y + range2Y; j++) {
                if (j < 0 || j >= oH) {
                  continue;
                }
                fY = floor(1e3 * abs(j - center.y));
                if (!cacheLanc[fX][fY]) {
                  cacheLanc[fX][fY] = lanczos(sqrt(pow(fX * rcpRatioX, 2) + pow(fY * rcpRatioY, 2)) / 1e3);
                }
                weight = cacheLanc[fX][fY];
                if (weight > 0) {
                  idx = (j * oW + i2) * 4;
                  a3 += weight;
                  red += weight * srcData[idx];
                  green += weight * srcData[idx + 1];
                  blue += weight * srcData[idx + 2];
                  alpha += weight * srcData[idx + 3];
                }
              }
            }
            idx = (v * dW + u2) * 4;
            destData[idx] = red / a3;
            destData[idx + 1] = green / a3;
            destData[idx + 2] = blue / a3;
            destData[idx + 3] = alpha / a3;
          }
          if (++u2 < dW) {
            return process(u2);
          } else {
            return destImg;
          }
        }
        var srcData = options.imageData.data, destImg = options.ctx.createImageData(dW, dH), destData = destImg.data, lanczos = this.lanczosCreate(this.lanczosLobes), ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, rcpRatioX = 2 / this.rcpScaleX, rcpRatioY = 2 / this.rcpScaleY, range2X = ceil(ratioX * this.lanczosLobes / 2), range2Y = ceil(ratioY * this.lanczosLobes / 2), cacheLanc = {}, center = {}, icenter = {};
        return process(0);
      },
      bilinearFiltering: function(options, oW, oH, dW, dH) {
        var a3, b2, c2, d3, x2, y3, i2, j, xDiff, yDiff, chnl, color, offset = 0, origPix, ratioX = this.rcpScaleX, ratioY = this.rcpScaleY, w4 = 4 * (oW - 1), img = options.imageData, pixels = img.data, destImage = options.ctx.createImageData(dW, dH), destPixels = destImage.data;
        for (i2 = 0; i2 < dH; i2++) {
          for (j = 0; j < dW; j++) {
            x2 = floor(ratioX * j);
            y3 = floor(ratioY * i2);
            xDiff = ratioX * j - x2;
            yDiff = ratioY * i2 - y3;
            origPix = 4 * (y3 * oW + x2);
            for (chnl = 0; chnl < 4; chnl++) {
              a3 = pixels[origPix + chnl];
              b2 = pixels[origPix + 4 + chnl];
              c2 = pixels[origPix + w4 + chnl];
              d3 = pixels[origPix + w4 + 4 + chnl];
              color = a3 * (1 - xDiff) * (1 - yDiff) + b2 * xDiff * (1 - yDiff) + c2 * yDiff * (1 - xDiff) + d3 * xDiff * yDiff;
              destPixels[offset++] = color;
            }
          }
        }
        return destImage;
      },
      hermiteFastResize: function(options, oW, oH, dW, dH) {
        var ratioW = this.rcpScaleX, ratioH = this.rcpScaleY, ratioWHalf = ceil(ratioW / 2), ratioHHalf = ceil(ratioH / 2), img = options.imageData, data = img.data, img2 = options.ctx.createImageData(dW, dH), data2 = img2.data;
        for (var j = 0; j < dH; j++) {
          for (var i2 = 0; i2 < dW; i2++) {
            var x2 = (i2 + j * dW) * 4, weight = 0, weights = 0, weightsAlpha = 0, gxR = 0, gxG = 0, gxB = 0, gxA = 0, centerY = (j + 0.5) * ratioH;
            for (var yy = floor(j * ratioH); yy < (j + 1) * ratioH; yy++) {
              var dy = abs(centerY - (yy + 0.5)) / ratioHHalf, centerX = (i2 + 0.5) * ratioW, w0 = dy * dy;
              for (var xx = floor(i2 * ratioW); xx < (i2 + 1) * ratioW; xx++) {
                var dx = abs(centerX - (xx + 0.5)) / ratioWHalf, w2 = sqrt(w0 + dx * dx);
                if (w2 > 1 && w2 < -1) {
                  continue;
                }
                weight = 2 * w2 * w2 * w2 - 3 * w2 * w2 + 1;
                if (weight > 0) {
                  dx = 4 * (xx + yy * oW);
                  gxA += weight * data[dx + 3];
                  weightsAlpha += weight;
                  if (data[dx + 3] < 255) {
                    weight = weight * data[dx + 3] / 250;
                  }
                  gxR += weight * data[dx];
                  gxG += weight * data[dx + 1];
                  gxB += weight * data[dx + 2];
                  weights += weight;
                }
              }
            }
            data2[x2] = gxR / weights;
            data2[x2 + 1] = gxG / weights;
            data2[x2 + 2] = gxB / weights;
            data2[x2 + 3] = gxA / weightsAlpha;
          }
        }
        return img2;
      },
      toObject: function() {
        return {
          type: this.type,
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          resizeType: this.resizeType,
          lanczosLobes: this.lanczosLobes
        };
      }
    });
    fabric3.Image.filters.Resize.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Contrast = createClass(filters.BaseFilter, {
      type: "Contrast",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}",
      contrast: 0,
      mainParameter: "contrast",
      applyTo2d: function(options) {
        if (this.contrast === 0) {
          return;
        }
        var imageData = options.imageData, i2, len, data = imageData.data, len = data.length, contrast = Math.floor(this.contrast * 255), contrastF = 259 * (contrast + 255) / (255 * (259 - contrast));
        for (i2 = 0; i2 < len; i2 += 4) {
          data[i2] = contrastF * (data[i2] - 128) + 128;
          data[i2 + 1] = contrastF * (data[i2 + 1] - 128) + 128;
          data[i2 + 2] = contrastF * (data[i2 + 2] - 128) + 128;
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uContrast: gl.getUniformLocation(program, "uContrast")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uContrast, this.contrast);
      }
    });
    fabric3.Image.filters.Contrast.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Saturation = createClass(filters.BaseFilter, {
      type: "Saturation",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}",
      saturation: 0,
      mainParameter: "saturation",
      applyTo2d: function(options) {
        if (this.saturation === 0) {
          return;
        }
        var imageData = options.imageData, data = imageData.data, len = data.length, adjust = -this.saturation, i2, max;
        for (i2 = 0; i2 < len; i2 += 4) {
          max = Math.max(data[i2], data[i2 + 1], data[i2 + 2]);
          data[i2] += max !== data[i2] ? (max - data[i2]) * adjust : 0;
          data[i2 + 1] += max !== data[i2 + 1] ? (max - data[i2 + 1]) * adjust : 0;
          data[i2 + 2] += max !== data[i2 + 2] ? (max - data[i2 + 2]) * adjust : 0;
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uSaturation: gl.getUniformLocation(program, "uSaturation")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uSaturation, -this.saturation);
      }
    });
    fabric3.Image.filters.Saturation.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Vibrance = createClass(filters.BaseFilter, {
      type: "Vibrance",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uVibrance;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat max = max(color.r, max(color.g, color.b));\nfloat avg = (color.r + color.g + color.b) / 3.0;\nfloat amt = (abs(max - avg) * 2.0) * uVibrance;\ncolor.r += max != color.r ? (max - color.r) * amt : 0.00;\ncolor.g += max != color.g ? (max - color.g) * amt : 0.00;\ncolor.b += max != color.b ? (max - color.b) * amt : 0.00;\ngl_FragColor = color;\n}",
      vibrance: 0,
      mainParameter: "vibrance",
      applyTo2d: function(options) {
        if (this.vibrance === 0) {
          return;
        }
        var imageData = options.imageData, data = imageData.data, len = data.length, adjust = -this.vibrance, i2, max, avg, amt;
        for (i2 = 0; i2 < len; i2 += 4) {
          max = Math.max(data[i2], data[i2 + 1], data[i2 + 2]);
          avg = (data[i2] + data[i2 + 1] + data[i2 + 2]) / 3;
          amt = Math.abs(max - avg) * 2 / 255 * adjust;
          data[i2] += max !== data[i2] ? (max - data[i2]) * amt : 0;
          data[i2 + 1] += max !== data[i2 + 1] ? (max - data[i2 + 1]) * amt : 0;
          data[i2 + 2] += max !== data[i2 + 2] ? (max - data[i2 + 2]) * amt : 0;
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uVibrance: gl.getUniformLocation(program, "uVibrance")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform1f(uniformLocations.uVibrance, -this.vibrance);
      }
    });
    fabric3.Image.filters.Vibrance.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Blur = createClass(filters.BaseFilter, {
      type: "Blur",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}",
      blur: 0,
      mainParameter: "blur",
      applyTo: function(options) {
        if (options.webgl) {
          this.aspectRatio = options.sourceWidth / options.sourceHeight;
          options.passes++;
          this._setupFrameBuffer(options);
          this.horizontal = true;
          this.applyToWebGL(options);
          this._swapTextures(options);
          this._setupFrameBuffer(options);
          this.horizontal = false;
          this.applyToWebGL(options);
          this._swapTextures(options);
        } else {
          this.applyTo2d(options);
        }
      },
      applyTo2d: function(options) {
        options.imageData = this.simpleBlur(options);
      },
      simpleBlur: function(options) {
        var resources = options.filterBackend.resources, canvas1, canvas2, width = options.imageData.width, height = options.imageData.height;
        if (!resources.blurLayer1) {
          resources.blurLayer1 = fabric3.util.createCanvasElement();
          resources.blurLayer2 = fabric3.util.createCanvasElement();
        }
        canvas1 = resources.blurLayer1;
        canvas2 = resources.blurLayer2;
        if (canvas1.width !== width || canvas1.height !== height) {
          canvas2.width = canvas1.width = width;
          canvas2.height = canvas1.height = height;
        }
        var ctx1 = canvas1.getContext("2d"), ctx2 = canvas2.getContext("2d"), nSamples = 15, random, percent, j, i2, blur = this.blur * 0.06 * 0.5;
        ctx1.putImageData(options.imageData, 0, 0);
        ctx2.clearRect(0, 0, width, height);
        for (i2 = -nSamples; i2 <= nSamples; i2++) {
          random = (Math.random() - 0.5) / 4;
          percent = i2 / nSamples;
          j = blur * percent * width + random;
          ctx2.globalAlpha = 1 - Math.abs(percent);
          ctx2.drawImage(canvas1, j, random);
          ctx1.drawImage(canvas2, 0, 0);
          ctx2.globalAlpha = 1;
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        }
        for (i2 = -nSamples; i2 <= nSamples; i2++) {
          random = (Math.random() - 0.5) / 4;
          percent = i2 / nSamples;
          j = blur * percent * height + random;
          ctx2.globalAlpha = 1 - Math.abs(percent);
          ctx2.drawImage(canvas1, random, j);
          ctx1.drawImage(canvas2, 0, 0);
          ctx2.globalAlpha = 1;
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        }
        options.ctx.drawImage(canvas1, 0, 0);
        var newImageData = options.ctx.getImageData(0, 0, canvas1.width, canvas1.height);
        ctx1.globalAlpha = 1;
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        return newImageData;
      },
      getUniformLocations: function(gl, program) {
        return {
          delta: gl.getUniformLocation(program, "uDelta")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        var delta = this.chooseRightDelta();
        gl.uniform2fv(uniformLocations.delta, delta);
      },
      chooseRightDelta: function() {
        var blurScale = 1, delta = [0, 0], blur;
        if (this.horizontal) {
          if (this.aspectRatio > 1) {
            blurScale = 1 / this.aspectRatio;
          }
        } else {
          if (this.aspectRatio < 1) {
            blurScale = this.aspectRatio;
          }
        }
        blur = blurScale * this.blur * 0.12;
        if (this.horizontal) {
          delta[0] = blur;
        } else {
          delta[1] = blur;
        }
        return delta;
      }
    });
    filters.Blur.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Gamma = createClass(filters.BaseFilter, {
      type: "Gamma",
      fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}",
      gamma: [1, 1, 1],
      mainParameter: "gamma",
      initialize: function(options) {
        this.gamma = [1, 1, 1];
        filters.BaseFilter.prototype.initialize.call(this, options);
      },
      applyTo2d: function(options) {
        var imageData = options.imageData, data = imageData.data, gamma = this.gamma, len = data.length, rInv = 1 / gamma[0], gInv = 1 / gamma[1], bInv = 1 / gamma[2], i2;
        if (!this.rVals) {
          this.rVals = new Uint8Array(256);
          this.gVals = new Uint8Array(256);
          this.bVals = new Uint8Array(256);
        }
        for (i2 = 0, len = 256; i2 < len; i2++) {
          this.rVals[i2] = Math.pow(i2 / 255, rInv) * 255;
          this.gVals[i2] = Math.pow(i2 / 255, gInv) * 255;
          this.bVals[i2] = Math.pow(i2 / 255, bInv) * 255;
        }
        for (i2 = 0, len = data.length; i2 < len; i2 += 4) {
          data[i2] = this.rVals[data[i2]];
          data[i2 + 1] = this.gVals[data[i2 + 1]];
          data[i2 + 2] = this.bVals[data[i2 + 2]];
        }
      },
      getUniformLocations: function(gl, program) {
        return {
          uGamma: gl.getUniformLocation(program, "uGamma")
        };
      },
      sendUniformData: function(gl, uniformLocations) {
        gl.uniform3fv(uniformLocations.uGamma, this.gamma);
      }
    });
    fabric3.Image.filters.Gamma.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.Composed = createClass(filters.BaseFilter, {
      type: "Composed",
      subFilters: [],
      initialize: function(options) {
        this.callSuper("initialize", options);
        this.subFilters = this.subFilters.slice(0);
      },
      applyTo: function(options) {
        options.passes += this.subFilters.length - 1;
        this.subFilters.forEach(function(filter) {
          filter.applyTo(options);
        });
      },
      toObject: function() {
        return fabric3.util.object.extend(this.callSuper("toObject"), {
          subFilters: this.subFilters.map(function(filter) {
            return filter.toObject();
          })
        });
      },
      isNeutralState: function() {
        return !this.subFilters.some(function(filter) {
          return !filter.isNeutralState();
        });
      }
    });
    fabric3.Image.filters.Composed.fromObject = function(object, callback) {
      var filters2 = object.subFilters || [], subFilters = filters2.map(function(filter) {
        return new fabric3.Image.filters[filter.type](filter);
      }), instance = new fabric3.Image.filters.Composed({ subFilters });
      callback && callback(instance);
      return instance;
    };
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), filters = fabric3.Image.filters, createClass = fabric3.util.createClass;
    filters.HueRotation = createClass(filters.ColorMatrix, {
      type: "HueRotation",
      rotation: 0,
      mainParameter: "rotation",
      calculateMatrix: function() {
        var rad = this.rotation * Math.PI, cos = fabric3.util.cos(rad), sin = fabric3.util.sin(rad), aThird = 1 / 3, aThirdSqtSin = Math.sqrt(aThird) * sin, OneMinusCos = 1 - cos;
        this.matrix = [
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0
        ];
        this.matrix[0] = cos + OneMinusCos / 3;
        this.matrix[1] = aThird * OneMinusCos - aThirdSqtSin;
        this.matrix[2] = aThird * OneMinusCos + aThirdSqtSin;
        this.matrix[5] = aThird * OneMinusCos + aThirdSqtSin;
        this.matrix[6] = cos + aThird * OneMinusCos;
        this.matrix[7] = aThird * OneMinusCos - aThirdSqtSin;
        this.matrix[10] = aThird * OneMinusCos - aThirdSqtSin;
        this.matrix[11] = aThird * OneMinusCos + aThirdSqtSin;
        this.matrix[12] = cos + aThird * OneMinusCos;
      },
      isNeutralState: function(options) {
        this.calculateMatrix();
        return filters.BaseFilter.prototype.isNeutralState.call(this, options);
      },
      applyTo: function(options) {
        this.calculateMatrix();
        filters.BaseFilter.prototype.applyTo.call(this, options);
      }
    });
    fabric3.Image.filters.HueRotation.fromObject = fabric3.Image.filters.BaseFilter.fromObject;
  })(exports);
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {}), clone = fabric3.util.object.clone;
    if (fabric3.Text) {
      fabric3.warn("fabric.Text is already defined");
      return;
    }
    var additionalProps = "fontFamily fontWeight fontSize text underline overline linethrough textAlign fontStyle lineHeight textBackgroundColor charSpacing styles direction path pathStartOffset pathSide pathAlign".split(" ");
    fabric3.Text = fabric3.util.createClass(fabric3.Object, {
      _dimensionAffectingProps: [
        "fontSize",
        "fontWeight",
        "fontFamily",
        "fontStyle",
        "lineHeight",
        "text",
        "charSpacing",
        "textAlign",
        "styles",
        "path",
        "pathStartOffset",
        "pathSide",
        "pathAlign"
      ],
      _reNewline: /\r?\n/,
      _reSpacesAndTabs: /[ \t\r]/g,
      _reSpaceAndTab: /[ \t\r]/,
      _reWords: /\S+/g,
      type: "text",
      fontSize: 40,
      fontWeight: "normal",
      fontFamily: "Times New Roman",
      underline: false,
      overline: false,
      linethrough: false,
      textAlign: "left",
      fontStyle: "normal",
      lineHeight: 1.16,
      superscript: {
        size: 0.6,
        baseline: -0.35
      },
      subscript: {
        size: 0.6,
        baseline: 0.11
      },
      textBackgroundColor: "",
      stateProperties: fabric3.Object.prototype.stateProperties.concat(additionalProps),
      cacheProperties: fabric3.Object.prototype.cacheProperties.concat(additionalProps),
      stroke: null,
      shadow: null,
      path: null,
      pathStartOffset: 0,
      pathSide: "left",
      pathAlign: "baseline",
      _fontSizeFraction: 0.222,
      offsets: {
        underline: 0.1,
        linethrough: -0.315,
        overline: -0.88
      },
      _fontSizeMult: 1.13,
      charSpacing: 0,
      styles: null,
      _measuringContext: null,
      deltaY: 0,
      direction: "ltr",
      _styleProperties: [
        "stroke",
        "strokeWidth",
        "fill",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "fontStyle",
        "underline",
        "overline",
        "linethrough",
        "deltaY",
        "textBackgroundColor"
      ],
      __charBounds: [],
      CACHE_FONT_SIZE: 400,
      MIN_TEXT_WIDTH: 2,
      initialize: function(text, options) {
        this.styles = options ? options.styles || {} : {};
        this.text = text;
        this.__skipDimension = true;
        this.callSuper("initialize", options);
        if (this.path) {
          this.setPathInfo();
        }
        this.__skipDimension = false;
        this.initDimensions();
        this.setCoords();
        this.setupState({ propertySet: "_dimensionAffectingProps" });
      },
      setPathInfo: function() {
        var path = this.path;
        if (path) {
          path.segmentsInfo = fabric3.util.getPathSegmentsInfo(path.path);
        }
      },
      getMeasuringContext: function() {
        if (!fabric3._measuringContext) {
          fabric3._measuringContext = this.canvas && this.canvas.contextCache || fabric3.util.createCanvasElement().getContext("2d");
        }
        return fabric3._measuringContext;
      },
      _splitText: function() {
        var newLines = this._splitTextIntoLines(this.text);
        this.textLines = newLines.lines;
        this._textLines = newLines.graphemeLines;
        this._unwrappedTextLines = newLines._unwrappedLines;
        this._text = newLines.graphemeText;
        return newLines;
      },
      initDimensions: function() {
        if (this.__skipDimension) {
          return;
        }
        this._splitText();
        this._clearCache();
        if (this.path) {
          this.width = this.path.width;
          this.height = this.path.height;
        } else {
          this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH;
          this.height = this.calcTextHeight();
        }
        if (this.textAlign.indexOf("justify") !== -1) {
          this.enlargeSpaces();
        }
        this.saveState({ propertySet: "_dimensionAffectingProps" });
      },
      enlargeSpaces: function() {
        var diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          if (this.textAlign !== "justify" && (i2 === len - 1 || this.isEndOfWrapping(i2))) {
            continue;
          }
          accumulatedSpace = 0;
          line = this._textLines[i2];
          currentLineWidth = this.getLineWidth(i2);
          if (currentLineWidth < this.width && (spaces = this.textLines[i2].match(this._reSpacesAndTabs))) {
            numberOfSpaces = spaces.length;
            diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
            for (var j = 0, jlen = line.length; j <= jlen; j++) {
              charBound = this.__charBounds[i2][j];
              if (this._reSpaceAndTab.test(line[j])) {
                charBound.width += diffSpace;
                charBound.kernedWidth += diffSpace;
                charBound.left += accumulatedSpace;
                accumulatedSpace += diffSpace;
              } else {
                charBound.left += accumulatedSpace;
              }
            }
          }
        }
      },
      isEndOfWrapping: function(lineIndex) {
        return lineIndex === this._textLines.length - 1;
      },
      missingNewlineOffset: function() {
        return 1;
      },
      toString: function() {
        return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>';
      },
      _getCacheCanvasDimensions: function() {
        var dims = this.callSuper("_getCacheCanvasDimensions");
        var fontSize = this.fontSize;
        dims.width += fontSize * dims.zoomX;
        dims.height += fontSize * dims.zoomY;
        return dims;
      },
      _render: function(ctx) {
        var path = this.path;
        path && !path.isNotVisible() && path._render(ctx);
        this._setTextStyles(ctx);
        this._renderTextLinesBackground(ctx);
        this._renderTextDecoration(ctx, "underline");
        this._renderText(ctx);
        this._renderTextDecoration(ctx, "overline");
        this._renderTextDecoration(ctx, "linethrough");
      },
      _renderText: function(ctx) {
        if (this.paintFirst === "stroke") {
          this._renderTextStroke(ctx);
          this._renderTextFill(ctx);
        } else {
          this._renderTextFill(ctx);
          this._renderTextStroke(ctx);
        }
      },
      _setTextStyles: function(ctx, charStyle, forMeasuring) {
        ctx.textBaseline = "alphabetical";
        if (this.path) {
          switch (this.pathAlign) {
            case "center":
              ctx.textBaseline = "middle";
              break;
            case "ascender":
              ctx.textBaseline = "top";
              break;
            case "descender":
              ctx.textBaseline = "bottom";
              break;
          }
        }
        ctx.font = this._getFontDeclaration(charStyle, forMeasuring);
      },
      calcTextWidth: function() {
        var maxWidth = this.getLineWidth(0);
        for (var i2 = 1, len = this._textLines.length; i2 < len; i2++) {
          var currentLineWidth = this.getLineWidth(i2);
          if (currentLineWidth > maxWidth) {
            maxWidth = currentLineWidth;
          }
        }
        return maxWidth;
      },
      _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
        this._renderChars(method, ctx, line, left, top, lineIndex);
      },
      _renderTextLinesBackground: function(ctx) {
        if (!this.textBackgroundColor && !this.styleHas("textBackgroundColor")) {
          return;
        }
        var heightOfLine, lineLeftOffset, originalFill = ctx.fillStyle, line, lastColor, leftOffset = this._getLeftOffset(), lineTopOffset = this._getTopOffset(), boxStart = 0, boxWidth = 0, charBox, currentColor, path = this.path, drawStart;
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          heightOfLine = this.getHeightOfLine(i2);
          if (!this.textBackgroundColor && !this.styleHas("textBackgroundColor", i2)) {
            lineTopOffset += heightOfLine;
            continue;
          }
          line = this._textLines[i2];
          lineLeftOffset = this._getLineLeftOffset(i2);
          boxWidth = 0;
          boxStart = 0;
          lastColor = this.getValueOfPropertyAt(i2, 0, "textBackgroundColor");
          for (var j = 0, jlen = line.length; j < jlen; j++) {
            charBox = this.__charBounds[i2][j];
            currentColor = this.getValueOfPropertyAt(i2, j, "textBackgroundColor");
            if (path) {
              ctx.save();
              ctx.translate(charBox.renderLeft, charBox.renderTop);
              ctx.rotate(charBox.angle);
              ctx.fillStyle = currentColor;
              currentColor && ctx.fillRect(
                -charBox.width / 2,
                -heightOfLine / this.lineHeight * (1 - this._fontSizeFraction),
                charBox.width,
                heightOfLine / this.lineHeight
              );
              ctx.restore();
            } else if (currentColor !== lastColor) {
              drawStart = leftOffset + lineLeftOffset + boxStart;
              if (this.direction === "rtl") {
                drawStart = this.width - drawStart - boxWidth;
              }
              ctx.fillStyle = lastColor;
              lastColor && ctx.fillRect(
                drawStart,
                lineTopOffset,
                boxWidth,
                heightOfLine / this.lineHeight
              );
              boxStart = charBox.left;
              boxWidth = charBox.width;
              lastColor = currentColor;
            } else {
              boxWidth += charBox.kernedWidth;
            }
          }
          if (currentColor && !path) {
            drawStart = leftOffset + lineLeftOffset + boxStart;
            if (this.direction === "rtl") {
              drawStart = this.width - drawStart - boxWidth;
            }
            ctx.fillStyle = currentColor;
            ctx.fillRect(
              drawStart,
              lineTopOffset,
              boxWidth,
              heightOfLine / this.lineHeight
            );
          }
          lineTopOffset += heightOfLine;
        }
        ctx.fillStyle = originalFill;
        this._removeShadow(ctx);
      },
      getFontCache: function(decl) {
        var fontFamily = decl.fontFamily.toLowerCase();
        if (!fabric3.charWidthsCache[fontFamily]) {
          fabric3.charWidthsCache[fontFamily] = {};
        }
        var cache = fabric3.charWidthsCache[fontFamily], cacheProp = decl.fontStyle.toLowerCase() + "_" + (decl.fontWeight + "").toLowerCase();
        if (!cache[cacheProp]) {
          cache[cacheProp] = {};
        }
        return cache[cacheProp];
      },
      _measureChar: function(_char, charStyle, previousChar, prevCharStyle) {
        var fontCache = this.getFontCache(charStyle), fontDeclaration = this._getFontDeclaration(charStyle), previousFontDeclaration = this._getFontDeclaration(prevCharStyle), couple = previousChar + _char, stylesAreEqual = fontDeclaration === previousFontDeclaration, width, coupleWidth, previousWidth, fontMultiplier = charStyle.fontSize / this.CACHE_FONT_SIZE, kernedWidth;
        if (previousChar && fontCache[previousChar] !== void 0) {
          previousWidth = fontCache[previousChar];
        }
        if (fontCache[_char] !== void 0) {
          kernedWidth = width = fontCache[_char];
        }
        if (stylesAreEqual && fontCache[couple] !== void 0) {
          coupleWidth = fontCache[couple];
          kernedWidth = coupleWidth - previousWidth;
        }
        if (width === void 0 || previousWidth === void 0 || coupleWidth === void 0) {
          var ctx = this.getMeasuringContext();
          this._setTextStyles(ctx, charStyle, true);
        }
        if (width === void 0) {
          kernedWidth = width = ctx.measureText(_char).width;
          fontCache[_char] = width;
        }
        if (previousWidth === void 0 && stylesAreEqual && previousChar) {
          previousWidth = ctx.measureText(previousChar).width;
          fontCache[previousChar] = previousWidth;
        }
        if (stylesAreEqual && coupleWidth === void 0) {
          coupleWidth = ctx.measureText(couple).width;
          fontCache[couple] = coupleWidth;
          kernedWidth = coupleWidth - previousWidth;
        }
        return { width: width * fontMultiplier, kernedWidth: kernedWidth * fontMultiplier };
      },
      getHeightOfChar: function(line, _char) {
        return this.getValueOfPropertyAt(line, _char, "fontSize");
      },
      measureLine: function(lineIndex) {
        var lineInfo = this._measureLine(lineIndex);
        if (this.charSpacing !== 0) {
          lineInfo.width -= this._getWidthOfCharSpacing();
        }
        if (lineInfo.width < 0) {
          lineInfo.width = 0;
        }
        return lineInfo;
      },
      _measureLine: function(lineIndex) {
        var width = 0, i2, grapheme, line = this._textLines[lineIndex], prevGrapheme, graphemeInfo, numOfSpaces = 0, lineBounds = new Array(line.length), positionInPath = 0, startingPoint, totalPathLength, path = this.path, reverse = this.pathSide === "right";
        this.__charBounds[lineIndex] = lineBounds;
        for (i2 = 0; i2 < line.length; i2++) {
          grapheme = line[i2];
          graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i2, prevGrapheme);
          lineBounds[i2] = graphemeInfo;
          width += graphemeInfo.kernedWidth;
          prevGrapheme = grapheme;
        }
        lineBounds[i2] = {
          left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
          width: 0,
          kernedWidth: 0,
          height: this.fontSize
        };
        if (path) {
          totalPathLength = path.segmentsInfo[path.segmentsInfo.length - 1].length;
          startingPoint = fabric3.util.getPointOnPath(path.path, 0, path.segmentsInfo);
          startingPoint.x += path.pathOffset.x;
          startingPoint.y += path.pathOffset.y;
          switch (this.textAlign) {
            case "left":
              positionInPath = reverse ? totalPathLength - width : 0;
              break;
            case "center":
              positionInPath = (totalPathLength - width) / 2;
              break;
            case "right":
              positionInPath = reverse ? 0 : totalPathLength - width;
              break;
          }
          positionInPath += this.pathStartOffset * (reverse ? -1 : 1);
          for (i2 = reverse ? line.length - 1 : 0; reverse ? i2 >= 0 : i2 < line.length; reverse ? i2-- : i2++) {
            graphemeInfo = lineBounds[i2];
            if (positionInPath > totalPathLength) {
              positionInPath %= totalPathLength;
            } else if (positionInPath < 0) {
              positionInPath += totalPathLength;
            }
            this._setGraphemeOnPath(positionInPath, graphemeInfo, startingPoint);
            positionInPath += graphemeInfo.kernedWidth;
          }
        }
        return { width, numOfSpaces };
      },
      _setGraphemeOnPath: function(positionInPath, graphemeInfo, startingPoint) {
        var centerPosition = positionInPath + graphemeInfo.kernedWidth / 2, path = this.path;
        var info = fabric3.util.getPointOnPath(path.path, centerPosition, path.segmentsInfo);
        graphemeInfo.renderLeft = info.x - startingPoint.x;
        graphemeInfo.renderTop = info.y - startingPoint.y;
        graphemeInfo.angle = info.angle + (this.pathSide === "right" ? Math.PI : 0);
      },
      _getGraphemeBox: function(grapheme, lineIndex, charIndex, prevGrapheme, skipLeft) {
        var style = this.getCompleteStyleDeclaration(lineIndex, charIndex), prevStyle = prevGrapheme ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1) : {}, info = this._measureChar(grapheme, style, prevGrapheme, prevStyle), kernedWidth = info.kernedWidth, width = info.width, charSpacing;
        if (this.charSpacing !== 0) {
          charSpacing = this._getWidthOfCharSpacing();
          width += charSpacing;
          kernedWidth += charSpacing;
        }
        var box = {
          width,
          left: 0,
          height: style.fontSize,
          kernedWidth,
          deltaY: style.deltaY
        };
        if (charIndex > 0 && !skipLeft) {
          var previousBox = this.__charBounds[lineIndex][charIndex - 1];
          box.left = previousBox.left + previousBox.width + info.kernedWidth - info.width;
        }
        return box;
      },
      getHeightOfLine: function(lineIndex) {
        if (this.__lineHeights[lineIndex]) {
          return this.__lineHeights[lineIndex];
        }
        var line = this._textLines[lineIndex], maxHeight = this.getHeightOfChar(lineIndex, 0);
        for (var i2 = 1, len = line.length; i2 < len; i2++) {
          maxHeight = Math.max(this.getHeightOfChar(lineIndex, i2), maxHeight);
        }
        return this.__lineHeights[lineIndex] = maxHeight * this.lineHeight * this._fontSizeMult;
      },
      calcTextHeight: function() {
        var lineHeight, height = 0;
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          lineHeight = this.getHeightOfLine(i2);
          height += i2 === len - 1 ? lineHeight / this.lineHeight : lineHeight;
        }
        return height;
      },
      _getLeftOffset: function() {
        return this.direction === "ltr" ? -this.width / 2 : this.width / 2;
      },
      _getTopOffset: function() {
        return -this.height / 2;
      },
      _renderTextCommon: function(ctx, method) {
        ctx.save();
        var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset();
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          var heightOfLine = this.getHeightOfLine(i2), maxHeight = heightOfLine / this.lineHeight, leftOffset = this._getLineLeftOffset(i2);
          this._renderTextLine(
            method,
            ctx,
            this._textLines[i2],
            left + leftOffset,
            top + lineHeights + maxHeight,
            i2
          );
          lineHeights += heightOfLine;
        }
        ctx.restore();
      },
      _renderTextFill: function(ctx) {
        if (!this.fill && !this.styleHas("fill")) {
          return;
        }
        this._renderTextCommon(ctx, "fillText");
      },
      _renderTextStroke: function(ctx) {
        if ((!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles()) {
          return;
        }
        if (this.shadow && !this.shadow.affectStroke) {
          this._removeShadow(ctx);
        }
        ctx.save();
        this._setLineDash(ctx, this.strokeDashArray);
        ctx.beginPath();
        this._renderTextCommon(ctx, "strokeText");
        ctx.closePath();
        ctx.restore();
      },
      _renderChars: function(method, ctx, line, left, top, lineIndex) {
        var lineHeight = this.getHeightOfLine(lineIndex), isJustify = this.textAlign.indexOf("justify") !== -1, actualStyle, nextStyle, charsToRender = "", charBox, boxWidth = 0, timeToRender, path = this.path, shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex) && !path, isLtr = this.direction === "ltr", sign = this.direction === "ltr" ? 1 : -1, drawingLeft, currentDirection = ctx.canvas.getAttribute("dir");
        ctx.save();
        if (currentDirection !== this.direction) {
          ctx.canvas.setAttribute("dir", isLtr ? "ltr" : "rtl");
          ctx.direction = isLtr ? "ltr" : "rtl";
          ctx.textAlign = isLtr ? "left" : "right";
        }
        top -= lineHeight * this._fontSizeFraction / this.lineHeight;
        if (shortCut) {
          this._renderChar(method, ctx, lineIndex, 0, line.join(""), left, top, lineHeight);
          ctx.restore();
          return;
        }
        for (var i2 = 0, len = line.length - 1; i2 <= len; i2++) {
          timeToRender = i2 === len || this.charSpacing || path;
          charsToRender += line[i2];
          charBox = this.__charBounds[lineIndex][i2];
          if (boxWidth === 0) {
            left += sign * (charBox.kernedWidth - charBox.width);
            boxWidth += charBox.width;
          } else {
            boxWidth += charBox.kernedWidth;
          }
          if (isJustify && !timeToRender) {
            if (this._reSpaceAndTab.test(line[i2])) {
              timeToRender = true;
            }
          }
          if (!timeToRender) {
            actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i2);
            nextStyle = this.getCompleteStyleDeclaration(lineIndex, i2 + 1);
            timeToRender = fabric3.util.hasStyleChanged(actualStyle, nextStyle, false);
          }
          if (timeToRender) {
            if (path) {
              ctx.save();
              ctx.translate(charBox.renderLeft, charBox.renderTop);
              ctx.rotate(charBox.angle);
              this._renderChar(method, ctx, lineIndex, i2, charsToRender, -boxWidth / 2, 0, lineHeight);
              ctx.restore();
            } else {
              drawingLeft = left;
              this._renderChar(method, ctx, lineIndex, i2, charsToRender, drawingLeft, top, lineHeight);
            }
            charsToRender = "";
            actualStyle = nextStyle;
            left += sign * boxWidth;
            boxWidth = 0;
          }
        }
        ctx.restore();
      },
      _applyPatternGradientTransformText: function(filler) {
        var pCanvas = fabric3.util.createCanvasElement(), pCtx, width = this.width + this.strokeWidth, height = this.height + this.strokeWidth;
        pCanvas.width = width;
        pCanvas.height = height;
        pCtx = pCanvas.getContext("2d");
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.lineTo(width, 0);
        pCtx.lineTo(width, height);
        pCtx.lineTo(0, height);
        pCtx.closePath();
        pCtx.translate(width / 2, height / 2);
        pCtx.fillStyle = filler.toLive(pCtx);
        this._applyPatternGradientTransform(pCtx, filler);
        pCtx.fill();
        return pCtx.createPattern(pCanvas, "no-repeat");
      },
      handleFiller: function(ctx, property, filler) {
        var offsetX, offsetY;
        if (filler.toLive) {
          if (filler.gradientUnits === "percentage" || filler.gradientTransform || filler.patternTransform) {
            offsetX = -this.width / 2;
            offsetY = -this.height / 2;
            ctx.translate(offsetX, offsetY);
            ctx[property] = this._applyPatternGradientTransformText(filler);
            return { offsetX, offsetY };
          } else {
            ctx[property] = filler.toLive(ctx, this);
            return this._applyPatternGradientTransform(ctx, filler);
          }
        } else {
          ctx[property] = filler;
        }
        return { offsetX: 0, offsetY: 0 };
      },
      _setStrokeStyles: function(ctx, decl) {
        ctx.lineWidth = decl.strokeWidth;
        ctx.lineCap = this.strokeLineCap;
        ctx.lineDashOffset = this.strokeDashOffset;
        ctx.lineJoin = this.strokeLineJoin;
        ctx.miterLimit = this.strokeMiterLimit;
        return this.handleFiller(ctx, "strokeStyle", decl.stroke);
      },
      _setFillStyles: function(ctx, decl) {
        return this.handleFiller(ctx, "fillStyle", decl.fill);
      },
      _renderChar: function(method, ctx, lineIndex, charIndex, _char, left, top) {
        var decl = this._getStyleDeclaration(lineIndex, charIndex), fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex), shouldFill = method === "fillText" && fullDecl.fill, shouldStroke = method === "strokeText" && fullDecl.stroke && fullDecl.strokeWidth, fillOffsets, strokeOffsets;
        if (!shouldStroke && !shouldFill) {
          return;
        }
        ctx.save();
        shouldFill && (fillOffsets = this._setFillStyles(ctx, fullDecl));
        shouldStroke && (strokeOffsets = this._setStrokeStyles(ctx, fullDecl));
        ctx.font = this._getFontDeclaration(fullDecl);
        if (decl && decl.textBackgroundColor) {
          this._removeShadow(ctx);
        }
        if (decl && decl.deltaY) {
          top += decl.deltaY;
        }
        shouldFill && ctx.fillText(_char, left - fillOffsets.offsetX, top - fillOffsets.offsetY);
        shouldStroke && ctx.strokeText(_char, left - strokeOffsets.offsetX, top - strokeOffsets.offsetY);
        ctx.restore();
      },
      setSuperscript: function(start, end) {
        return this._setScript(start, end, this.superscript);
      },
      setSubscript: function(start, end) {
        return this._setScript(start, end, this.subscript);
      },
      _setScript: function(start, end, schema) {
        var loc = this.get2DCursorLocation(start, true), fontSize = this.getValueOfPropertyAt(loc.lineIndex, loc.charIndex, "fontSize"), dy = this.getValueOfPropertyAt(loc.lineIndex, loc.charIndex, "deltaY"), style = { fontSize: fontSize * schema.size, deltaY: dy + fontSize * schema.baseline };
        this.setSelectionStyles(style, start, end);
        return this;
      },
      _getLineLeftOffset: function(lineIndex) {
        var lineWidth = this.getLineWidth(lineIndex), lineDiff = this.width - lineWidth, textAlign = this.textAlign, direction = this.direction, isEndOfWrapping, leftOffset = 0, isEndOfWrapping = this.isEndOfWrapping(lineIndex);
        if (textAlign === "justify" || textAlign === "justify-center" && !isEndOfWrapping || textAlign === "justify-right" && !isEndOfWrapping || textAlign === "justify-left" && !isEndOfWrapping) {
          return 0;
        }
        if (textAlign === "center") {
          leftOffset = lineDiff / 2;
        }
        if (textAlign === "right") {
          leftOffset = lineDiff;
        }
        if (textAlign === "justify-center") {
          leftOffset = lineDiff / 2;
        }
        if (textAlign === "justify-right") {
          leftOffset = lineDiff;
        }
        if (direction === "rtl") {
          leftOffset -= lineDiff;
        }
        return leftOffset;
      },
      _clearCache: function() {
        this.__lineWidths = [];
        this.__lineHeights = [];
        this.__charBounds = [];
      },
      _shouldClearDimensionCache: function() {
        var shouldClear = this._forceClearCache;
        shouldClear || (shouldClear = this.hasStateChanged("_dimensionAffectingProps"));
        if (shouldClear) {
          this.dirty = true;
          this._forceClearCache = false;
        }
        return shouldClear;
      },
      getLineWidth: function(lineIndex) {
        if (this.__lineWidths[lineIndex] !== void 0) {
          return this.__lineWidths[lineIndex];
        }
        var lineInfo = this.measureLine(lineIndex);
        var width = lineInfo.width;
        this.__lineWidths[lineIndex] = width;
        return width;
      },
      _getWidthOfCharSpacing: function() {
        if (this.charSpacing !== 0) {
          return this.fontSize * this.charSpacing / 1e3;
        }
        return 0;
      },
      getValueOfPropertyAt: function(lineIndex, charIndex, property) {
        var charStyle = this._getStyleDeclaration(lineIndex, charIndex);
        if (charStyle && typeof charStyle[property] !== "undefined") {
          return charStyle[property];
        }
        return this[property];
      },
      _renderTextDecoration: function(ctx, type) {
        if (!this[type] && !this.styleHas(type)) {
          return;
        }
        var heightOfLine, size, _size, lineLeftOffset, dy, _dy, line, lastDecoration, leftOffset = this._getLeftOffset(), topOffset = this._getTopOffset(), top, boxStart, boxWidth, charBox, currentDecoration, maxHeight, currentFill, lastFill, path = this.path, charSpacing = this._getWidthOfCharSpacing(), offsetY = this.offsets[type];
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          heightOfLine = this.getHeightOfLine(i2);
          if (!this[type] && !this.styleHas(type, i2)) {
            topOffset += heightOfLine;
            continue;
          }
          line = this._textLines[i2];
          maxHeight = heightOfLine / this.lineHeight;
          lineLeftOffset = this._getLineLeftOffset(i2);
          boxStart = 0;
          boxWidth = 0;
          lastDecoration = this.getValueOfPropertyAt(i2, 0, type);
          lastFill = this.getValueOfPropertyAt(i2, 0, "fill");
          top = topOffset + maxHeight * (1 - this._fontSizeFraction);
          size = this.getHeightOfChar(i2, 0);
          dy = this.getValueOfPropertyAt(i2, 0, "deltaY");
          for (var j = 0, jlen = line.length; j < jlen; j++) {
            charBox = this.__charBounds[i2][j];
            currentDecoration = this.getValueOfPropertyAt(i2, j, type);
            currentFill = this.getValueOfPropertyAt(i2, j, "fill");
            _size = this.getHeightOfChar(i2, j);
            _dy = this.getValueOfPropertyAt(i2, j, "deltaY");
            if (path && currentDecoration && currentFill) {
              ctx.save();
              ctx.fillStyle = lastFill;
              ctx.translate(charBox.renderLeft, charBox.renderTop);
              ctx.rotate(charBox.angle);
              ctx.fillRect(
                -charBox.kernedWidth / 2,
                offsetY * _size + _dy,
                charBox.kernedWidth,
                this.fontSize / 15
              );
              ctx.restore();
            } else if ((currentDecoration !== lastDecoration || currentFill !== lastFill || _size !== size || _dy !== dy) && boxWidth > 0) {
              var drawStart = leftOffset + lineLeftOffset + boxStart;
              if (this.direction === "rtl") {
                drawStart = this.width - drawStart - boxWidth;
              }
              if (lastDecoration && lastFill) {
                ctx.fillStyle = lastFill;
                ctx.fillRect(
                  drawStart,
                  top + offsetY * size + dy,
                  boxWidth,
                  this.fontSize / 15
                );
              }
              boxStart = charBox.left;
              boxWidth = charBox.width;
              lastDecoration = currentDecoration;
              lastFill = currentFill;
              size = _size;
              dy = _dy;
            } else {
              boxWidth += charBox.kernedWidth;
            }
          }
          var drawStart = leftOffset + lineLeftOffset + boxStart;
          if (this.direction === "rtl") {
            drawStart = this.width - drawStart - boxWidth;
          }
          ctx.fillStyle = currentFill;
          currentDecoration && currentFill && ctx.fillRect(
            drawStart,
            top + offsetY * size + dy,
            boxWidth - charSpacing,
            this.fontSize / 15
          );
          topOffset += heightOfLine;
        }
        this._removeShadow(ctx);
      },
      _getFontDeclaration: function(styleObject, forMeasuring) {
        var style = styleObject || this, family = this.fontFamily, fontIsGeneric = fabric3.Text.genericFonts.indexOf(family.toLowerCase()) > -1;
        var fontFamily = family === void 0 || family.indexOf("'") > -1 || family.indexOf(",") > -1 || family.indexOf('"') > -1 || fontIsGeneric ? style.fontFamily : '"' + style.fontFamily + '"';
        return [
          fabric3.isLikelyNode ? style.fontWeight : style.fontStyle,
          fabric3.isLikelyNode ? style.fontStyle : style.fontWeight,
          forMeasuring ? this.CACHE_FONT_SIZE + "px" : style.fontSize + "px",
          fontFamily
        ].join(" ");
      },
      render: function(ctx) {
        if (!this.visible) {
          return;
        }
        if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
          return;
        }
        if (this._shouldClearDimensionCache()) {
          this.initDimensions();
        }
        this.callSuper("render", ctx);
      },
      _splitTextIntoLines: function(text) {
        var lines = text.split(this._reNewline), newLines = new Array(lines.length), newLine = ["\n"], newText = [];
        for (var i2 = 0; i2 < lines.length; i2++) {
          newLines[i2] = fabric3.util.string.graphemeSplit(lines[i2]);
          newText = newText.concat(newLines[i2], newLine);
        }
        newText.pop();
        return { _unwrappedLines: newLines, lines, graphemeText: newText, graphemeLines: newLines };
      },
      toObject: function(propertiesToInclude) {
        var allProperties = additionalProps.concat(propertiesToInclude);
        var obj = this.callSuper("toObject", allProperties);
        obj.styles = fabric3.util.stylesToArray(this.styles, this.text);
        if (obj.path) {
          obj.path = this.path.toObject();
        }
        return obj;
      },
      set: function(key, value) {
        this.callSuper("set", key, value);
        var needsDims = false;
        var isAddingPath = false;
        if (typeof key === "object") {
          for (var _key in key) {
            if (_key === "path") {
              this.setPathInfo();
            }
            needsDims = needsDims || this._dimensionAffectingProps.indexOf(_key) !== -1;
            isAddingPath = isAddingPath || _key === "path";
          }
        } else {
          needsDims = this._dimensionAffectingProps.indexOf(key) !== -1;
          isAddingPath = key === "path";
        }
        if (isAddingPath) {
          this.setPathInfo();
        }
        if (needsDims) {
          this.initDimensions();
          this.setCoords();
        }
        return this;
      },
      complexity: function() {
        return 1;
      }
    });
    fabric3.Text.ATTRIBUTE_NAMES = fabric3.SHARED_ATTRIBUTES.concat(
      "x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor".split(" ")
    );
    fabric3.Text.DEFAULT_SVG_FONT_SIZE = 16;
    fabric3.Text.fromElement = function(element, callback, options) {
      if (!element) {
        return callback(null);
      }
      var parsedAttributes = fabric3.parseAttributes(element, fabric3.Text.ATTRIBUTE_NAMES), parsedAnchor = parsedAttributes.textAnchor || "left";
      options = fabric3.util.object.extend(options ? clone(options) : {}, parsedAttributes);
      options.top = options.top || 0;
      options.left = options.left || 0;
      if (parsedAttributes.textDecoration) {
        var textDecoration = parsedAttributes.textDecoration;
        if (textDecoration.indexOf("underline") !== -1) {
          options.underline = true;
        }
        if (textDecoration.indexOf("overline") !== -1) {
          options.overline = true;
        }
        if (textDecoration.indexOf("line-through") !== -1) {
          options.linethrough = true;
        }
        delete options.textDecoration;
      }
      if ("dx" in parsedAttributes) {
        options.left += parsedAttributes.dx;
      }
      if ("dy" in parsedAttributes) {
        options.top += parsedAttributes.dy;
      }
      if (!("fontSize" in options)) {
        options.fontSize = fabric3.Text.DEFAULT_SVG_FONT_SIZE;
      }
      var textContent = "";
      if (!("textContent" in element)) {
        if ("firstChild" in element && element.firstChild !== null) {
          if ("data" in element.firstChild && element.firstChild.data !== null) {
            textContent = element.firstChild.data;
          }
        }
      } else {
        textContent = element.textContent;
      }
      textContent = textContent.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
      var originalStrokeWidth = options.strokeWidth;
      options.strokeWidth = 0;
      var text = new fabric3.Text(textContent, options), textHeightScaleFactor = text.getScaledHeight() / text.height, lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height, scaledDiff = lineHeightDiff * textHeightScaleFactor, textHeight = text.getScaledHeight() + scaledDiff, offX = 0;
      if (parsedAnchor === "center") {
        offX = text.getScaledWidth() / 2;
      }
      if (parsedAnchor === "right") {
        offX = text.getScaledWidth();
      }
      text.set({
        left: text.left - offX,
        top: text.top - (textHeight - text.fontSize * (0.07 + text._fontSizeFraction)) / text.lineHeight,
        strokeWidth: typeof originalStrokeWidth !== "undefined" ? originalStrokeWidth : 1
      });
      callback(text);
    };
    fabric3.Text.fromObject = function(object, callback) {
      var objectCopy = clone(object), path = object.path;
      delete objectCopy.path;
      return fabric3.Object._fromObject("Text", objectCopy, function(textInstance) {
        textInstance.styles = fabric3.util.stylesFromArray(object.styles, object.text);
        if (path) {
          fabric3.Object._fromObject("Path", path, function(pathInstance) {
            textInstance.set("path", pathInstance);
            callback(textInstance);
          }, "path");
        } else {
          callback(textInstance);
        }
      }, "text");
    };
    fabric3.Text.genericFonts = ["sans-serif", "serif", "cursive", "fantasy", "monospace"];
    fabric3.util.createAccessors && fabric3.util.createAccessors(fabric3.Text);
  })(exports);
  (function() {
    fabric2.util.object.extend(fabric2.Text.prototype, {
      isEmptyStyles: function(lineIndex) {
        if (!this.styles) {
          return true;
        }
        if (typeof lineIndex !== "undefined" && !this.styles[lineIndex]) {
          return true;
        }
        var obj = typeof lineIndex === "undefined" ? this.styles : { line: this.styles[lineIndex] };
        for (var p1 in obj) {
          for (var p2 in obj[p1]) {
            for (var p3 in obj[p1][p2]) {
              return false;
            }
          }
        }
        return true;
      },
      styleHas: function(property, lineIndex) {
        if (!this.styles || !property || property === "") {
          return false;
        }
        if (typeof lineIndex !== "undefined" && !this.styles[lineIndex]) {
          return false;
        }
        var obj = typeof lineIndex === "undefined" ? this.styles : { 0: this.styles[lineIndex] };
        for (var p1 in obj) {
          for (var p2 in obj[p1]) {
            if (typeof obj[p1][p2][property] !== "undefined") {
              return true;
            }
          }
        }
        return false;
      },
      cleanStyle: function(property) {
        if (!this.styles || !property || property === "") {
          return false;
        }
        var obj = this.styles, stylesCount = 0, letterCount, stylePropertyValue, allStyleObjectPropertiesMatch = true, graphemeCount = 0, styleObject;
        for (var p1 in obj) {
          letterCount = 0;
          for (var p2 in obj[p1]) {
            var styleObject = obj[p1][p2], stylePropertyHasBeenSet = styleObject.hasOwnProperty(property);
            stylesCount++;
            if (stylePropertyHasBeenSet) {
              if (!stylePropertyValue) {
                stylePropertyValue = styleObject[property];
              } else if (styleObject[property] !== stylePropertyValue) {
                allStyleObjectPropertiesMatch = false;
              }
              if (styleObject[property] === this[property]) {
                delete styleObject[property];
              }
            } else {
              allStyleObjectPropertiesMatch = false;
            }
            if (Object.keys(styleObject).length !== 0) {
              letterCount++;
            } else {
              delete obj[p1][p2];
            }
          }
          if (letterCount === 0) {
            delete obj[p1];
          }
        }
        for (var i2 = 0; i2 < this._textLines.length; i2++) {
          graphemeCount += this._textLines[i2].length;
        }
        if (allStyleObjectPropertiesMatch && stylesCount === graphemeCount) {
          this[property] = stylePropertyValue;
          this.removeStyle(property);
        }
      },
      removeStyle: function(property) {
        if (!this.styles || !property || property === "") {
          return;
        }
        var obj = this.styles, line, lineNum, charNum;
        for (lineNum in obj) {
          line = obj[lineNum];
          for (charNum in line) {
            delete line[charNum][property];
            if (Object.keys(line[charNum]).length === 0) {
              delete line[charNum];
            }
          }
          if (Object.keys(line).length === 0) {
            delete obj[lineNum];
          }
        }
      },
      _extendStyles: function(index, styles) {
        var loc = this.get2DCursorLocation(index);
        if (!this._getLineStyle(loc.lineIndex)) {
          this._setLineStyle(loc.lineIndex);
        }
        if (!this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
          this._setStyleDeclaration(loc.lineIndex, loc.charIndex, {});
        }
        fabric2.util.object.extend(this._getStyleDeclaration(loc.lineIndex, loc.charIndex), styles);
      },
      get2DCursorLocation: function(selectionStart, skipWrapping) {
        if (typeof selectionStart === "undefined") {
          selectionStart = this.selectionStart;
        }
        var lines = skipWrapping ? this._unwrappedTextLines : this._textLines, len = lines.length;
        for (var i2 = 0; i2 < len; i2++) {
          if (selectionStart <= lines[i2].length) {
            return {
              lineIndex: i2,
              charIndex: selectionStart
            };
          }
          selectionStart -= lines[i2].length + this.missingNewlineOffset(i2);
        }
        return {
          lineIndex: i2 - 1,
          charIndex: lines[i2 - 1].length < selectionStart ? lines[i2 - 1].length : selectionStart
        };
      },
      getSelectionStyles: function(startIndex, endIndex, complete) {
        if (typeof startIndex === "undefined") {
          startIndex = this.selectionStart || 0;
        }
        if (typeof endIndex === "undefined") {
          endIndex = this.selectionEnd || startIndex;
        }
        var styles = [];
        for (var i2 = startIndex; i2 < endIndex; i2++) {
          styles.push(this.getStyleAtPosition(i2, complete));
        }
        return styles;
      },
      getStyleAtPosition: function(position, complete) {
        var loc = this.get2DCursorLocation(position), style = complete ? this.getCompleteStyleDeclaration(loc.lineIndex, loc.charIndex) : this._getStyleDeclaration(loc.lineIndex, loc.charIndex);
        return style || {};
      },
      setSelectionStyles: function(styles, startIndex, endIndex) {
        if (typeof startIndex === "undefined") {
          startIndex = this.selectionStart || 0;
        }
        if (typeof endIndex === "undefined") {
          endIndex = this.selectionEnd || startIndex;
        }
        for (var i2 = startIndex; i2 < endIndex; i2++) {
          this._extendStyles(i2, styles);
        }
        this._forceClearCache = true;
        return this;
      },
      _getStyleDeclaration: function(lineIndex, charIndex) {
        var lineStyle = this.styles && this.styles[lineIndex];
        if (!lineStyle) {
          return null;
        }
        return lineStyle[charIndex];
      },
      getCompleteStyleDeclaration: function(lineIndex, charIndex) {
        var style = this._getStyleDeclaration(lineIndex, charIndex) || {}, styleObject = {}, prop;
        for (var i2 = 0; i2 < this._styleProperties.length; i2++) {
          prop = this._styleProperties[i2];
          styleObject[prop] = typeof style[prop] === "undefined" ? this[prop] : style[prop];
        }
        return styleObject;
      },
      _setStyleDeclaration: function(lineIndex, charIndex, style) {
        this.styles[lineIndex][charIndex] = style;
      },
      _deleteStyleDeclaration: function(lineIndex, charIndex) {
        delete this.styles[lineIndex][charIndex];
      },
      _getLineStyle: function(lineIndex) {
        return !!this.styles[lineIndex];
      },
      _setLineStyle: function(lineIndex) {
        this.styles[lineIndex] = {};
      },
      _deleteLineStyle: function(lineIndex) {
        delete this.styles[lineIndex];
      }
    });
  })();
  (function() {
    function parseDecoration(object) {
      if (object.textDecoration) {
        object.textDecoration.indexOf("underline") > -1 && (object.underline = true);
        object.textDecoration.indexOf("line-through") > -1 && (object.linethrough = true);
        object.textDecoration.indexOf("overline") > -1 && (object.overline = true);
        delete object.textDecoration;
      }
    }
    fabric2.IText = fabric2.util.createClass(fabric2.Text, fabric2.Observable, {
      type: "i-text",
      selectionStart: 0,
      selectionEnd: 0,
      selectionColor: "rgba(17,119,255,0.3)",
      isEditing: false,
      editable: true,
      editingBorderColor: "rgba(102,153,255,0.25)",
      cursorWidth: 2,
      cursorColor: "",
      cursorDelay: 1e3,
      cursorDuration: 600,
      caching: true,
      hiddenTextareaContainer: null,
      _reSpace: /\s|\n/,
      _currentCursorOpacity: 0,
      _selectionDirection: null,
      _abortCursorAnimation: false,
      __widthOfSpace: [],
      inCompositionMode: false,
      initialize: function(text, options) {
        this.callSuper("initialize", text, options);
        this.initBehavior();
      },
      setSelectionStart: function(index) {
        index = Math.max(index, 0);
        this._updateAndFire("selectionStart", index);
      },
      setSelectionEnd: function(index) {
        index = Math.min(index, this.text.length);
        this._updateAndFire("selectionEnd", index);
      },
      _updateAndFire: function(property, index) {
        if (this[property] !== index) {
          this._fireSelectionChanged();
          this[property] = index;
        }
        this._updateTextarea();
      },
      _fireSelectionChanged: function() {
        this.fire("selection:changed");
        this.canvas && this.canvas.fire("text:selection:changed", { target: this });
      },
      initDimensions: function() {
        this.isEditing && this.initDelayedCursor();
        this.clearContextTop();
        this.callSuper("initDimensions");
      },
      render: function(ctx) {
        this.clearContextTop();
        this.callSuper("render", ctx);
        this.cursorOffsetCache = {};
        this.renderCursorOrSelection();
      },
      _render: function(ctx) {
        this.callSuper("_render", ctx);
      },
      clearContextTop: function(skipRestore) {
        if (!this.isEditing || !this.canvas || !this.canvas.contextTop) {
          return;
        }
        var ctx = this.canvas.contextTop, v = this.canvas.viewportTransform;
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        this.transform(ctx);
        this._clearTextArea(ctx);
        skipRestore || ctx.restore();
      },
      renderCursorOrSelection: function() {
        if (!this.isEditing || !this.canvas || !this.canvas.contextTop) {
          return;
        }
        var boundaries = this._getCursorBoundaries(), ctx = this.canvas.contextTop;
        this.clearContextTop(true);
        if (this.selectionStart === this.selectionEnd) {
          this.renderCursor(boundaries, ctx);
        } else {
          this.renderSelection(boundaries, ctx);
        }
        ctx.restore();
      },
      _clearTextArea: function(ctx) {
        var width = this.width + 4, height = this.height + 4;
        ctx.clearRect(-width / 2, -height / 2, width, height);
      },
      _getCursorBoundaries: function(position) {
        if (typeof position === "undefined") {
          position = this.selectionStart;
        }
        var left = this._getLeftOffset(), top = this._getTopOffset(), offsets = this._getCursorBoundariesOffsets(position);
        return {
          left,
          top,
          leftOffset: offsets.left,
          topOffset: offsets.top
        };
      },
      _getCursorBoundariesOffsets: function(position) {
        if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) {
          return this.cursorOffsetCache;
        }
        var lineLeftOffset, lineIndex, charIndex, topOffset = 0, leftOffset = 0, boundaries, cursorPosition = this.get2DCursorLocation(position);
        charIndex = cursorPosition.charIndex;
        lineIndex = cursorPosition.lineIndex;
        for (var i2 = 0; i2 < lineIndex; i2++) {
          topOffset += this.getHeightOfLine(i2);
        }
        lineLeftOffset = this._getLineLeftOffset(lineIndex);
        var bound = this.__charBounds[lineIndex][charIndex];
        bound && (leftOffset = bound.left);
        if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
          leftOffset -= this._getWidthOfCharSpacing();
        }
        boundaries = {
          top: topOffset,
          left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0)
        };
        if (this.direction === "rtl") {
          boundaries.left *= -1;
        }
        this.cursorOffsetCache = boundaries;
        return this.cursorOffsetCache;
      },
      renderCursor: function(boundaries, ctx) {
        var cursorLocation = this.get2DCursorLocation(), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0, charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, "fontSize"), multiplier = this.scaleX * this.canvas.getZoom(), cursorWidth = this.cursorWidth / multiplier, topOffset = boundaries.topOffset, dy = this.getValueOfPropertyAt(lineIndex, charIndex, "deltaY");
        topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight - charHeight * (1 - this._fontSizeFraction);
        if (this.inCompositionMode) {
          this.renderSelection(boundaries, ctx);
        }
        ctx.fillStyle = this.cursorColor || this.getValueOfPropertyAt(lineIndex, charIndex, "fill");
        ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
        ctx.fillRect(
          boundaries.left + boundaries.leftOffset - cursorWidth / 2,
          topOffset + boundaries.top + dy,
          cursorWidth,
          charHeight
        );
      },
      renderSelection: function(boundaries, ctx) {
        var selectionStart = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart, selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd, isJustify = this.textAlign.indexOf("justify") !== -1, start = this.get2DCursorLocation(selectionStart), end = this.get2DCursorLocation(selectionEnd), startLine = start.lineIndex, endLine = end.lineIndex, startChar = start.charIndex < 0 ? 0 : start.charIndex, endChar = end.charIndex < 0 ? 0 : end.charIndex;
        for (var i2 = startLine; i2 <= endLine; i2++) {
          var lineOffset = this._getLineLeftOffset(i2) || 0, lineHeight = this.getHeightOfLine(i2), realLineHeight = 0, boxStart = 0, boxEnd = 0;
          if (i2 === startLine) {
            boxStart = this.__charBounds[startLine][startChar].left;
          }
          if (i2 >= startLine && i2 < endLine) {
            boxEnd = isJustify && !this.isEndOfWrapping(i2) ? this.width : this.getLineWidth(i2) || 5;
          } else if (i2 === endLine) {
            if (endChar === 0) {
              boxEnd = this.__charBounds[endLine][endChar].left;
            } else {
              var charSpacing = this._getWidthOfCharSpacing();
              boxEnd = this.__charBounds[endLine][endChar - 1].left + this.__charBounds[endLine][endChar - 1].width - charSpacing;
            }
          }
          realLineHeight = lineHeight;
          if (this.lineHeight < 1 || i2 === endLine && this.lineHeight > 1) {
            lineHeight /= this.lineHeight;
          }
          var drawStart = boundaries.left + lineOffset + boxStart, drawWidth = boxEnd - boxStart, drawHeight = lineHeight, extraTop = 0;
          if (this.inCompositionMode) {
            ctx.fillStyle = this.compositionColor || "black";
            drawHeight = 1;
            extraTop = lineHeight;
          } else {
            ctx.fillStyle = this.selectionColor;
          }
          if (this.direction === "rtl") {
            drawStart = this.width - drawStart - drawWidth;
          }
          ctx.fillRect(
            drawStart,
            boundaries.top + boundaries.topOffset + extraTop,
            drawWidth,
            drawHeight
          );
          boundaries.topOffset += realLineHeight;
        }
      },
      getCurrentCharFontSize: function() {
        var cp = this._getCurrentCharIndex();
        return this.getValueOfPropertyAt(cp.l, cp.c, "fontSize");
      },
      getCurrentCharColor: function() {
        var cp = this._getCurrentCharIndex();
        return this.getValueOfPropertyAt(cp.l, cp.c, "fill");
      },
      _getCurrentCharIndex: function() {
        var cursorPosition = this.get2DCursorLocation(this.selectionStart, true), charIndex = cursorPosition.charIndex > 0 ? cursorPosition.charIndex - 1 : 0;
        return { l: cursorPosition.lineIndex, c: charIndex };
      }
    });
    fabric2.IText.fromObject = function(object, callback) {
      var styles = fabric2.util.stylesFromArray(object.styles, object.text);
      var objCopy = Object.assign({}, object, { styles });
      parseDecoration(objCopy);
      if (objCopy.styles) {
        for (var i2 in objCopy.styles) {
          for (var j in objCopy.styles[i2]) {
            parseDecoration(objCopy.styles[i2][j]);
          }
        }
      }
      fabric2.Object._fromObject("IText", objCopy, callback, "text");
    };
  })();
  (function() {
    var clone = fabric2.util.object.clone;
    fabric2.util.object.extend(fabric2.IText.prototype, {
      initBehavior: function() {
        this.initAddedHandler();
        this.initRemovedHandler();
        this.initCursorSelectionHandlers();
        this.initDoubleClickSimulation();
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
      },
      onDeselect: function() {
        this.isEditing && this.exitEditing();
        this.selected = false;
      },
      initAddedHandler: function() {
        var _this = this;
        this.on("added", function() {
          var canvas = _this.canvas;
          if (canvas) {
            if (!canvas._hasITextHandlers) {
              canvas._hasITextHandlers = true;
              _this._initCanvasHandlers(canvas);
            }
            canvas._iTextInstances = canvas._iTextInstances || [];
            canvas._iTextInstances.push(_this);
          }
        });
      },
      initRemovedHandler: function() {
        var _this = this;
        this.on("removed", function() {
          var canvas = _this.canvas;
          if (canvas) {
            canvas._iTextInstances = canvas._iTextInstances || [];
            fabric2.util.removeFromArray(canvas._iTextInstances, _this);
            if (canvas._iTextInstances.length === 0) {
              canvas._hasITextHandlers = false;
              _this._removeCanvasHandlers(canvas);
            }
          }
        });
      },
      _initCanvasHandlers: function(canvas) {
        canvas._mouseUpITextHandler = function() {
          if (canvas._iTextInstances) {
            canvas._iTextInstances.forEach(function(obj) {
              obj.__isMousedown = false;
            });
          }
        };
        canvas.on("mouse:up", canvas._mouseUpITextHandler);
      },
      _removeCanvasHandlers: function(canvas) {
        canvas.off("mouse:up", canvas._mouseUpITextHandler);
      },
      _tick: function() {
        this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete");
      },
      _animateCursor: function(obj, targetOpacity, duration, completeMethod) {
        var tickState;
        tickState = {
          isAborted: false,
          abort: function() {
            this.isAborted = true;
          }
        };
        obj.animate("_currentCursorOpacity", targetOpacity, {
          duration,
          onComplete: function() {
            if (!tickState.isAborted) {
              obj[completeMethod]();
            }
          },
          onChange: function() {
            if (obj.canvas && obj.selectionStart === obj.selectionEnd) {
              obj.renderCursorOrSelection();
            }
          },
          abort: function() {
            return tickState.isAborted;
          }
        });
        return tickState;
      },
      _onTickComplete: function() {
        var _this = this;
        if (this._cursorTimeout1) {
          clearTimeout(this._cursorTimeout1);
        }
        this._cursorTimeout1 = setTimeout(function() {
          _this._currentTickCompleteState = _this._animateCursor(_this, 0, this.cursorDuration / 2, "_tick");
        }, 100);
      },
      initDelayedCursor: function(restart) {
        var _this = this, delay = restart ? 0 : this.cursorDelay;
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        this._cursorTimeout2 = setTimeout(function() {
          _this._tick();
        }, delay);
      },
      abortCursorAnimation: function() {
        var shouldClear = this._currentTickState || this._currentTickCompleteState, canvas = this.canvas;
        this._currentTickState && this._currentTickState.abort();
        this._currentTickCompleteState && this._currentTickCompleteState.abort();
        clearTimeout(this._cursorTimeout1);
        clearTimeout(this._cursorTimeout2);
        this._currentCursorOpacity = 0;
        if (shouldClear && canvas) {
          canvas.clearContext(canvas.contextTop || canvas.contextContainer);
        }
      },
      selectAll: function() {
        this.selectionStart = 0;
        this.selectionEnd = this._text.length;
        this._fireSelectionChanged();
        this._updateTextarea();
        return this;
      },
      getSelectedText: function() {
        return this._text.slice(this.selectionStart, this.selectionEnd).join("");
      },
      findWordBoundaryLeft: function(startFrom) {
        var offset = 0, index = startFrom - 1;
        if (this._reSpace.test(this._text[index])) {
          while (this._reSpace.test(this._text[index])) {
            offset++;
            index--;
          }
        }
        while (/\S/.test(this._text[index]) && index > -1) {
          offset++;
          index--;
        }
        return startFrom - offset;
      },
      findWordBoundaryRight: function(startFrom) {
        var offset = 0, index = startFrom;
        if (this._reSpace.test(this._text[index])) {
          while (this._reSpace.test(this._text[index])) {
            offset++;
            index++;
          }
        }
        while (/\S/.test(this._text[index]) && index < this._text.length) {
          offset++;
          index++;
        }
        return startFrom + offset;
      },
      findLineBoundaryLeft: function(startFrom) {
        var offset = 0, index = startFrom - 1;
        while (!/\n/.test(this._text[index]) && index > -1) {
          offset++;
          index--;
        }
        return startFrom - offset;
      },
      findLineBoundaryRight: function(startFrom) {
        var offset = 0, index = startFrom;
        while (!/\n/.test(this._text[index]) && index < this._text.length) {
          offset++;
          index++;
        }
        return startFrom + offset;
      },
      searchWordBoundary: function(selectionStart, direction) {
        var text = this._text, index = this._reSpace.test(text[selectionStart]) ? selectionStart - 1 : selectionStart, _char = text[index], reNonWord = fabric2.reNonWord;
        while (!reNonWord.test(_char) && index > 0 && index < text.length) {
          index += direction;
          _char = text[index];
        }
        if (reNonWord.test(_char)) {
          index += direction === 1 ? 0 : 1;
        }
        return index;
      },
      selectWord: function(selectionStart) {
        selectionStart = selectionStart || this.selectionStart;
        var newSelectionStart = this.searchWordBoundary(selectionStart, -1), newSelectionEnd = this.searchWordBoundary(selectionStart, 1);
        this.selectionStart = newSelectionStart;
        this.selectionEnd = newSelectionEnd;
        this._fireSelectionChanged();
        this._updateTextarea();
        this.renderCursorOrSelection();
      },
      selectLine: function(selectionStart) {
        selectionStart = selectionStart || this.selectionStart;
        var newSelectionStart = this.findLineBoundaryLeft(selectionStart), newSelectionEnd = this.findLineBoundaryRight(selectionStart);
        this.selectionStart = newSelectionStart;
        this.selectionEnd = newSelectionEnd;
        this._fireSelectionChanged();
        this._updateTextarea();
        return this;
      },
      enterEditing: function(e2) {
        if (this.isEditing || !this.editable) {
          return;
        }
        if (this.canvas) {
          this.canvas.calcOffset();
          this.exitEditingOnOthers(this.canvas);
        }
        this.isEditing = true;
        this.initHiddenTextarea(e2);
        this.hiddenTextarea.focus();
        this.hiddenTextarea.value = this.text;
        this._updateTextarea();
        this._saveEditingProps();
        this._setEditingProps();
        this._textBeforeEdit = this.text;
        this._tick();
        this.fire("editing:entered");
        this._fireSelectionChanged();
        if (!this.canvas) {
          return this;
        }
        this.canvas.fire("text:editing:entered", { target: this });
        this.initMouseMoveHandler();
        this.canvas.requestRenderAll();
        return this;
      },
      exitEditingOnOthers: function(canvas) {
        if (canvas._iTextInstances) {
          canvas._iTextInstances.forEach(function(obj) {
            obj.selected = false;
            if (obj.isEditing) {
              obj.exitEditing();
            }
          });
        }
      },
      initMouseMoveHandler: function() {
        this.canvas.on("mouse:move", this.mouseMoveHandler);
      },
      mouseMoveHandler: function(options) {
        if (!this.__isMousedown || !this.isEditing) {
          return;
        }
        document.activeElement !== this.hiddenTextarea && this.hiddenTextarea.focus();
        var newSelectionStart = this.getSelectionStartFromPointer(options.e), currentStart = this.selectionStart, currentEnd = this.selectionEnd;
        if ((newSelectionStart !== this.__selectionStartOnMouseDown || currentStart === currentEnd) && (currentStart === newSelectionStart || currentEnd === newSelectionStart)) {
          return;
        }
        if (newSelectionStart > this.__selectionStartOnMouseDown) {
          this.selectionStart = this.__selectionStartOnMouseDown;
          this.selectionEnd = newSelectionStart;
        } else {
          this.selectionStart = newSelectionStart;
          this.selectionEnd = this.__selectionStartOnMouseDown;
        }
        if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
          this.restartCursorIfNeeded();
          this._fireSelectionChanged();
          this._updateTextarea();
          this.renderCursorOrSelection();
        }
      },
      _setEditingProps: function() {
        this.hoverCursor = "text";
        if (this.canvas) {
          this.canvas.defaultCursor = this.canvas.moveCursor = "text";
        }
        this.borderColor = this.editingBorderColor;
        this.hasControls = this.selectable = false;
        this.lockMovementX = this.lockMovementY = true;
      },
      fromStringToGraphemeSelection: function(start, end, text) {
        var smallerTextStart = text.slice(0, start), graphemeStart = fabric2.util.string.graphemeSplit(smallerTextStart).length;
        if (start === end) {
          return { selectionStart: graphemeStart, selectionEnd: graphemeStart };
        }
        var smallerTextEnd = text.slice(start, end), graphemeEnd = fabric2.util.string.graphemeSplit(smallerTextEnd).length;
        return { selectionStart: graphemeStart, selectionEnd: graphemeStart + graphemeEnd };
      },
      fromGraphemeToStringSelection: function(start, end, _text) {
        var smallerTextStart = _text.slice(0, start), graphemeStart = smallerTextStart.join("").length;
        if (start === end) {
          return { selectionStart: graphemeStart, selectionEnd: graphemeStart };
        }
        var smallerTextEnd = _text.slice(start, end), graphemeEnd = smallerTextEnd.join("").length;
        return { selectionStart: graphemeStart, selectionEnd: graphemeStart + graphemeEnd };
      },
      _updateTextarea: function() {
        this.cursorOffsetCache = {};
        if (!this.hiddenTextarea) {
          return;
        }
        if (!this.inCompositionMode) {
          var newSelection = this.fromGraphemeToStringSelection(this.selectionStart, this.selectionEnd, this._text);
          this.hiddenTextarea.selectionStart = newSelection.selectionStart;
          this.hiddenTextarea.selectionEnd = newSelection.selectionEnd;
        }
        this.updateTextareaPosition();
      },
      updateFromTextArea: function() {
        if (!this.hiddenTextarea) {
          return;
        }
        this.cursorOffsetCache = {};
        this.text = this.hiddenTextarea.value;
        if (this._shouldClearDimensionCache()) {
          this.initDimensions();
          this.setCoords();
        }
        var newSelection = this.fromStringToGraphemeSelection(
          this.hiddenTextarea.selectionStart,
          this.hiddenTextarea.selectionEnd,
          this.hiddenTextarea.value
        );
        this.selectionEnd = this.selectionStart = newSelection.selectionEnd;
        if (!this.inCompositionMode) {
          this.selectionStart = newSelection.selectionStart;
        }
        this.updateTextareaPosition();
      },
      updateTextareaPosition: function() {
        if (this.selectionStart === this.selectionEnd) {
          var style = this._calcTextareaPosition();
          this.hiddenTextarea.style.left = style.left;
          this.hiddenTextarea.style.top = style.top;
        }
      },
      _calcTextareaPosition: function() {
        if (!this.canvas) {
          return { x: 1, y: 1 };
        }
        var desiredPosition = this.inCompositionMode ? this.compositionStart : this.selectionStart, boundaries = this._getCursorBoundaries(desiredPosition), cursorLocation = this.get2DCursorLocation(desiredPosition), lineIndex = cursorLocation.lineIndex, charIndex = cursorLocation.charIndex, charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, "fontSize") * this.lineHeight, leftOffset = boundaries.leftOffset, m3 = this.calcTransformMatrix(), p = {
          x: boundaries.left + leftOffset,
          y: boundaries.top + boundaries.topOffset + charHeight
        }, retinaScaling = this.canvas.getRetinaScaling(), upperCanvas = this.canvas.upperCanvasEl, upperCanvasWidth = upperCanvas.width / retinaScaling, upperCanvasHeight = upperCanvas.height / retinaScaling, maxWidth = upperCanvasWidth - charHeight, maxHeight = upperCanvasHeight - charHeight, scaleX = upperCanvas.clientWidth / upperCanvasWidth, scaleY = upperCanvas.clientHeight / upperCanvasHeight;
        p = fabric2.util.transformPoint(p, m3);
        p = fabric2.util.transformPoint(p, this.canvas.viewportTransform);
        p.x *= scaleX;
        p.y *= scaleY;
        if (p.x < 0) {
          p.x = 0;
        }
        if (p.x > maxWidth) {
          p.x = maxWidth;
        }
        if (p.y < 0) {
          p.y = 0;
        }
        if (p.y > maxHeight) {
          p.y = maxHeight;
        }
        p.x += this.canvas._offset.left;
        p.y += this.canvas._offset.top;
        return { left: p.x + "px", top: p.y + "px", fontSize: charHeight + "px", charHeight };
      },
      _saveEditingProps: function() {
        this._savedProps = {
          hasControls: this.hasControls,
          borderColor: this.borderColor,
          lockMovementX: this.lockMovementX,
          lockMovementY: this.lockMovementY,
          hoverCursor: this.hoverCursor,
          selectable: this.selectable,
          defaultCursor: this.canvas && this.canvas.defaultCursor,
          moveCursor: this.canvas && this.canvas.moveCursor
        };
      },
      _restoreEditingProps: function() {
        if (!this._savedProps) {
          return;
        }
        this.hoverCursor = this._savedProps.hoverCursor;
        this.hasControls = this._savedProps.hasControls;
        this.borderColor = this._savedProps.borderColor;
        this.selectable = this._savedProps.selectable;
        this.lockMovementX = this._savedProps.lockMovementX;
        this.lockMovementY = this._savedProps.lockMovementY;
        if (this.canvas) {
          this.canvas.defaultCursor = this._savedProps.defaultCursor;
          this.canvas.moveCursor = this._savedProps.moveCursor;
        }
      },
      exitEditing: function() {
        var isTextChanged = this._textBeforeEdit !== this.text;
        var hiddenTextarea = this.hiddenTextarea;
        this.selected = false;
        this.isEditing = false;
        this.selectionEnd = this.selectionStart;
        if (hiddenTextarea) {
          hiddenTextarea.blur && hiddenTextarea.blur();
          hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
        }
        this.hiddenTextarea = null;
        this.abortCursorAnimation();
        this._restoreEditingProps();
        this._currentCursorOpacity = 0;
        if (this._shouldClearDimensionCache()) {
          this.initDimensions();
          this.setCoords();
        }
        this.fire("editing:exited");
        isTextChanged && this.fire("modified");
        if (this.canvas) {
          this.canvas.off("mouse:move", this.mouseMoveHandler);
          this.canvas.fire("text:editing:exited", { target: this });
          isTextChanged && this.canvas.fire("object:modified", { target: this });
        }
        return this;
      },
      _removeExtraneousStyles: function() {
        for (var prop in this.styles) {
          if (!this._textLines[prop]) {
            delete this.styles[prop];
          }
        }
      },
      removeStyleFromTo: function(start, end) {
        var cursorStart = this.get2DCursorLocation(start, true), cursorEnd = this.get2DCursorLocation(end, true), lineStart = cursorStart.lineIndex, charStart = cursorStart.charIndex, lineEnd = cursorEnd.lineIndex, charEnd = cursorEnd.charIndex, i2, styleObj;
        if (lineStart !== lineEnd) {
          if (this.styles[lineStart]) {
            for (i2 = charStart; i2 < this._unwrappedTextLines[lineStart].length; i2++) {
              delete this.styles[lineStart][i2];
            }
          }
          if (this.styles[lineEnd]) {
            for (i2 = charEnd; i2 < this._unwrappedTextLines[lineEnd].length; i2++) {
              styleObj = this.styles[lineEnd][i2];
              if (styleObj) {
                this.styles[lineStart] || (this.styles[lineStart] = {});
                this.styles[lineStart][charStart + i2 - charEnd] = styleObj;
              }
            }
          }
          for (i2 = lineStart + 1; i2 <= lineEnd; i2++) {
            delete this.styles[i2];
          }
          this.shiftLineStyles(lineEnd, lineStart - lineEnd);
        } else {
          if (this.styles[lineStart]) {
            styleObj = this.styles[lineStart];
            var diff = charEnd - charStart, numericChar, _char;
            for (i2 = charStart; i2 < charEnd; i2++) {
              delete styleObj[i2];
            }
            for (_char in this.styles[lineStart]) {
              numericChar = parseInt(_char, 10);
              if (numericChar >= charEnd) {
                styleObj[numericChar - diff] = styleObj[_char];
                delete styleObj[_char];
              }
            }
          }
        }
      },
      shiftLineStyles: function(lineIndex, offset) {
        var clonedStyles = clone(this.styles);
        for (var line in this.styles) {
          var numericLine = parseInt(line, 10);
          if (numericLine > lineIndex) {
            this.styles[numericLine + offset] = clonedStyles[numericLine];
            if (!clonedStyles[numericLine - offset]) {
              delete this.styles[numericLine];
            }
          }
        }
      },
      restartCursorIfNeeded: function() {
        if (!this._currentTickState || this._currentTickState.isAborted || !this._currentTickCompleteState || this._currentTickCompleteState.isAborted) {
          this.initDelayedCursor();
        }
      },
      insertNewlineStyleObject: function(lineIndex, charIndex, qty, copiedStyle) {
        var currentCharStyle, newLineStyles = {}, somethingAdded = false, isEndOfLine = this._unwrappedTextLines[lineIndex].length === charIndex;
        qty || (qty = 1);
        this.shiftLineStyles(lineIndex, qty);
        if (this.styles[lineIndex]) {
          currentCharStyle = this.styles[lineIndex][charIndex === 0 ? charIndex : charIndex - 1];
        }
        for (var index in this.styles[lineIndex]) {
          var numIndex = parseInt(index, 10);
          if (numIndex >= charIndex) {
            somethingAdded = true;
            newLineStyles[numIndex - charIndex] = this.styles[lineIndex][index];
            if (!(isEndOfLine && charIndex === 0)) {
              delete this.styles[lineIndex][index];
            }
          }
        }
        var styleCarriedOver = false;
        if (somethingAdded && !isEndOfLine) {
          this.styles[lineIndex + qty] = newLineStyles;
          styleCarriedOver = true;
        }
        if (styleCarriedOver) {
          qty--;
        }
        while (qty > 0) {
          if (copiedStyle && copiedStyle[qty - 1]) {
            this.styles[lineIndex + qty] = { 0: clone(copiedStyle[qty - 1]) };
          } else if (currentCharStyle) {
            this.styles[lineIndex + qty] = { 0: clone(currentCharStyle) };
          } else {
            delete this.styles[lineIndex + qty];
          }
          qty--;
        }
        this._forceClearCache = true;
      },
      insertCharStyleObject: function(lineIndex, charIndex, quantity, copiedStyle) {
        if (!this.styles) {
          this.styles = {};
        }
        var currentLineStyles = this.styles[lineIndex], currentLineStylesCloned = currentLineStyles ? clone(currentLineStyles) : {};
        quantity || (quantity = 1);
        for (var index in currentLineStylesCloned) {
          var numericIndex = parseInt(index, 10);
          if (numericIndex >= charIndex) {
            currentLineStyles[numericIndex + quantity] = currentLineStylesCloned[numericIndex];
            if (!currentLineStylesCloned[numericIndex - quantity]) {
              delete currentLineStyles[numericIndex];
            }
          }
        }
        this._forceClearCache = true;
        if (copiedStyle) {
          while (quantity--) {
            if (!Object.keys(copiedStyle[quantity]).length) {
              continue;
            }
            if (!this.styles[lineIndex]) {
              this.styles[lineIndex] = {};
            }
            this.styles[lineIndex][charIndex + quantity] = clone(copiedStyle[quantity]);
          }
          return;
        }
        if (!currentLineStyles) {
          return;
        }
        var newStyle = currentLineStyles[charIndex ? charIndex - 1 : 1];
        while (newStyle && quantity--) {
          this.styles[lineIndex][charIndex + quantity] = clone(newStyle);
        }
      },
      insertNewStyleBlock: function(insertedText, start, copiedStyle) {
        var cursorLoc = this.get2DCursorLocation(start, true), addedLines = [0], linesLength = 0;
        for (var i2 = 0; i2 < insertedText.length; i2++) {
          if (insertedText[i2] === "\n") {
            linesLength++;
            addedLines[linesLength] = 0;
          } else {
            addedLines[linesLength]++;
          }
        }
        if (addedLines[0] > 0) {
          this.insertCharStyleObject(cursorLoc.lineIndex, cursorLoc.charIndex, addedLines[0], copiedStyle);
          copiedStyle = copiedStyle && copiedStyle.slice(addedLines[0] + 1);
        }
        linesLength && this.insertNewlineStyleObject(
          cursorLoc.lineIndex,
          cursorLoc.charIndex + addedLines[0],
          linesLength
        );
        for (var i2 = 1; i2 < linesLength; i2++) {
          if (addedLines[i2] > 0) {
            this.insertCharStyleObject(cursorLoc.lineIndex + i2, 0, addedLines[i2], copiedStyle);
          } else if (copiedStyle) {
            if (this.styles[cursorLoc.lineIndex + i2] && copiedStyle[0]) {
              this.styles[cursorLoc.lineIndex + i2][0] = copiedStyle[0];
            }
          }
          copiedStyle = copiedStyle && copiedStyle.slice(addedLines[i2] + 1);
        }
        if (addedLines[i2] > 0) {
          this.insertCharStyleObject(cursorLoc.lineIndex + i2, 0, addedLines[i2], copiedStyle);
        }
      },
      setSelectionStartEndWithShift: function(start, end, newSelection) {
        if (newSelection <= start) {
          if (end === start) {
            this._selectionDirection = "left";
          } else if (this._selectionDirection === "right") {
            this._selectionDirection = "left";
            this.selectionEnd = start;
          }
          this.selectionStart = newSelection;
        } else if (newSelection > start && newSelection < end) {
          if (this._selectionDirection === "right") {
            this.selectionEnd = newSelection;
          } else {
            this.selectionStart = newSelection;
          }
        } else {
          if (end === start) {
            this._selectionDirection = "right";
          } else if (this._selectionDirection === "left") {
            this._selectionDirection = "right";
            this.selectionStart = end;
          }
          this.selectionEnd = newSelection;
        }
      },
      setSelectionInBoundaries: function() {
        var length = this.text.length;
        if (this.selectionStart > length) {
          this.selectionStart = length;
        } else if (this.selectionStart < 0) {
          this.selectionStart = 0;
        }
        if (this.selectionEnd > length) {
          this.selectionEnd = length;
        } else if (this.selectionEnd < 0) {
          this.selectionEnd = 0;
        }
      }
    });
  })();
  fabric2.util.object.extend(fabric2.IText.prototype, {
    initDoubleClickSimulation: function() {
      this.__lastClickTime = +new Date();
      this.__lastLastClickTime = +new Date();
      this.__lastPointer = {};
      this.on("mousedown", this.onMouseDown);
    },
    onMouseDown: function(options) {
      if (!this.canvas) {
        return;
      }
      this.__newClickTime = +new Date();
      var newPointer = options.pointer;
      if (this.isTripleClick(newPointer)) {
        this.fire("tripleclick", options);
        this._stopEvent(options.e);
      }
      this.__lastLastClickTime = this.__lastClickTime;
      this.__lastClickTime = this.__newClickTime;
      this.__lastPointer = newPointer;
      this.__lastIsEditing = this.isEditing;
      this.__lastSelected = this.selected;
    },
    isTripleClick: function(newPointer) {
      return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === newPointer.x && this.__lastPointer.y === newPointer.y;
    },
    _stopEvent: function(e2) {
      e2.preventDefault && e2.preventDefault();
      e2.stopPropagation && e2.stopPropagation();
    },
    initCursorSelectionHandlers: function() {
      this.initMousedownHandler();
      this.initMouseupHandler();
      this.initClicks();
    },
    doubleClickHandler: function(options) {
      if (!this.isEditing) {
        return;
      }
      this.selectWord(this.getSelectionStartFromPointer(options.e));
    },
    tripleClickHandler: function(options) {
      if (!this.isEditing) {
        return;
      }
      this.selectLine(this.getSelectionStartFromPointer(options.e));
    },
    initClicks: function() {
      this.on("mousedblclick", this.doubleClickHandler);
      this.on("tripleclick", this.tripleClickHandler);
    },
    _mouseDownHandler: function(options) {
      if (!this.canvas || !this.editable || options.e.button && options.e.button !== 1) {
        return;
      }
      this.__isMousedown = true;
      if (this.selected) {
        this.inCompositionMode = false;
        this.setCursorByClick(options.e);
      }
      if (this.isEditing) {
        this.__selectionStartOnMouseDown = this.selectionStart;
        if (this.selectionStart === this.selectionEnd) {
          this.abortCursorAnimation();
        }
        this.renderCursorOrSelection();
      }
    },
    _mouseDownHandlerBefore: function(options) {
      if (!this.canvas || !this.editable || options.e.button && options.e.button !== 1) {
        return;
      }
      this.selected = this === this.canvas._activeObject;
    },
    initMousedownHandler: function() {
      this.on("mousedown", this._mouseDownHandler);
      this.on("mousedown:before", this._mouseDownHandlerBefore);
    },
    initMouseupHandler: function() {
      this.on("mouseup", this.mouseUpHandler);
    },
    mouseUpHandler: function(options) {
      this.__isMousedown = false;
      if (!this.editable || this.group || options.transform && options.transform.actionPerformed || options.e.button && options.e.button !== 1) {
        return;
      }
      if (this.canvas) {
        var currentActive = this.canvas._activeObject;
        if (currentActive && currentActive !== this) {
          return;
        }
      }
      if (this.__lastSelected && !this.__corner) {
        this.selected = false;
        this.__lastSelected = false;
        this.enterEditing(options.e);
        if (this.selectionStart === this.selectionEnd) {
          this.initDelayedCursor(true);
        } else {
          this.renderCursorOrSelection();
        }
      } else {
        this.selected = true;
      }
    },
    setCursorByClick: function(e2) {
      var newSelection = this.getSelectionStartFromPointer(e2), start = this.selectionStart, end = this.selectionEnd;
      if (e2.shiftKey) {
        this.setSelectionStartEndWithShift(start, end, newSelection);
      } else {
        this.selectionStart = newSelection;
        this.selectionEnd = newSelection;
      }
      if (this.isEditing) {
        this._fireSelectionChanged();
        this._updateTextarea();
      }
    },
    getSelectionStartFromPointer: function(e2) {
      var mouseOffset = this.getLocalPointer(e2), prevWidth = 0, width = 0, height = 0, charIndex = 0, lineIndex = 0, lineLeftOffset, line;
      for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
        if (height <= mouseOffset.y) {
          height += this.getHeightOfLine(i2) * this.scaleY;
          lineIndex = i2;
          if (i2 > 0) {
            charIndex += this._textLines[i2 - 1].length + this.missingNewlineOffset(i2 - 1);
          }
        } else {
          break;
        }
      }
      lineLeftOffset = this._getLineLeftOffset(lineIndex);
      width = lineLeftOffset * this.scaleX;
      line = this._textLines[lineIndex];
      if (this.direction === "rtl") {
        mouseOffset.x = this.width * this.scaleX - mouseOffset.x + width;
      }
      for (var j = 0, jlen = line.length; j < jlen; j++) {
        prevWidth = width;
        width += this.__charBounds[lineIndex][j].kernedWidth * this.scaleX;
        if (width <= mouseOffset.x) {
          charIndex++;
        } else {
          break;
        }
      }
      return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex, jlen);
    },
    _getNewSelectionStartFromOffset: function(mouseOffset, prevWidth, width, index, jlen) {
      var distanceBtwLastCharAndCursor = mouseOffset.x - prevWidth, distanceBtwNextCharAndCursor = width - mouseOffset.x, offset = distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor || distanceBtwNextCharAndCursor < 0 ? 0 : 1, newSelectionStart = index + offset;
      if (this.flipX) {
        newSelectionStart = jlen - newSelectionStart;
      }
      if (newSelectionStart > this._text.length) {
        newSelectionStart = this._text.length;
      }
      return newSelectionStart;
    }
  });
  fabric2.util.object.extend(fabric2.IText.prototype, {
    initHiddenTextarea: function() {
      this.hiddenTextarea = fabric2.document.createElement("textarea");
      this.hiddenTextarea.setAttribute("autocapitalize", "off");
      this.hiddenTextarea.setAttribute("autocorrect", "off");
      this.hiddenTextarea.setAttribute("autocomplete", "off");
      this.hiddenTextarea.setAttribute("spellcheck", "false");
      this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", "");
      this.hiddenTextarea.setAttribute("wrap", "off");
      var style = this._calcTextareaPosition();
      this.hiddenTextarea.style.cssText = "position: absolute; top: " + style.top + "; left: " + style.left + "; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding\uFF70top: " + style.fontSize + ";";
      if (this.hiddenTextareaContainer) {
        this.hiddenTextareaContainer.appendChild(this.hiddenTextarea);
      } else {
        fabric2.document.body.appendChild(this.hiddenTextarea);
      }
      fabric2.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "cut", this.copy.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this));
      fabric2.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this));
      if (!this._clickHandlerInitialized && this.canvas) {
        fabric2.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this));
        this._clickHandlerInitialized = true;
      }
    },
    keysMap: {
      9: "exitEditing",
      27: "exitEditing",
      33: "moveCursorUp",
      34: "moveCursorDown",
      35: "moveCursorRight",
      36: "moveCursorLeft",
      37: "moveCursorLeft",
      38: "moveCursorUp",
      39: "moveCursorRight",
      40: "moveCursorDown"
    },
    keysMapRtl: {
      9: "exitEditing",
      27: "exitEditing",
      33: "moveCursorUp",
      34: "moveCursorDown",
      35: "moveCursorLeft",
      36: "moveCursorRight",
      37: "moveCursorRight",
      38: "moveCursorUp",
      39: "moveCursorLeft",
      40: "moveCursorDown"
    },
    ctrlKeysMapUp: {
      67: "copy",
      88: "cut"
    },
    ctrlKeysMapDown: {
      65: "selectAll"
    },
    onClick: function() {
      this.hiddenTextarea && this.hiddenTextarea.focus();
    },
    onKeyDown: function(e2) {
      if (!this.isEditing) {
        return;
      }
      var keyMap = this.direction === "rtl" ? this.keysMapRtl : this.keysMap;
      if (e2.keyCode in keyMap) {
        this[keyMap[e2.keyCode]](e2);
      } else if (e2.keyCode in this.ctrlKeysMapDown && (e2.ctrlKey || e2.metaKey)) {
        this[this.ctrlKeysMapDown[e2.keyCode]](e2);
      } else {
        return;
      }
      e2.stopImmediatePropagation();
      e2.preventDefault();
      if (e2.keyCode >= 33 && e2.keyCode <= 40) {
        this.inCompositionMode = false;
        this.clearContextTop();
        this.renderCursorOrSelection();
      } else {
        this.canvas && this.canvas.requestRenderAll();
      }
    },
    onKeyUp: function(e2) {
      if (!this.isEditing || this._copyDone || this.inCompositionMode) {
        this._copyDone = false;
        return;
      }
      if (e2.keyCode in this.ctrlKeysMapUp && (e2.ctrlKey || e2.metaKey)) {
        this[this.ctrlKeysMapUp[e2.keyCode]](e2);
      } else {
        return;
      }
      e2.stopImmediatePropagation();
      e2.preventDefault();
      this.canvas && this.canvas.requestRenderAll();
    },
    onInput: function(e2) {
      var fromPaste = this.fromPaste;
      this.fromPaste = false;
      e2 && e2.stopPropagation();
      if (!this.isEditing) {
        return;
      }
      var nextText = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText, charCount = this._text.length, nextCharCount = nextText.length, removedText, insertedText, charDiff = nextCharCount - charCount, selectionStart = this.selectionStart, selectionEnd = this.selectionEnd, selection = selectionStart !== selectionEnd, copiedStyle, removeFrom, removeTo;
      if (this.hiddenTextarea.value === "") {
        this.styles = {};
        this.updateFromTextArea();
        this.fire("changed");
        if (this.canvas) {
          this.canvas.fire("text:changed", { target: this });
          this.canvas.requestRenderAll();
        }
        return;
      }
      var textareaSelection = this.fromStringToGraphemeSelection(
        this.hiddenTextarea.selectionStart,
        this.hiddenTextarea.selectionEnd,
        this.hiddenTextarea.value
      );
      var backDelete = selectionStart > textareaSelection.selectionStart;
      if (selection) {
        removedText = this._text.slice(selectionStart, selectionEnd);
        charDiff += selectionEnd - selectionStart;
      } else if (nextCharCount < charCount) {
        if (backDelete) {
          removedText = this._text.slice(selectionEnd + charDiff, selectionEnd);
        } else {
          removedText = this._text.slice(selectionStart, selectionStart - charDiff);
        }
      }
      insertedText = nextText.slice(textareaSelection.selectionEnd - charDiff, textareaSelection.selectionEnd);
      if (removedText && removedText.length) {
        if (insertedText.length) {
          copiedStyle = this.getSelectionStyles(selectionStart, selectionStart + 1, false);
          copiedStyle = insertedText.map(function() {
            return copiedStyle[0];
          });
        }
        if (selection) {
          removeFrom = selectionStart;
          removeTo = selectionEnd;
        } else if (backDelete) {
          removeFrom = selectionEnd - removedText.length;
          removeTo = selectionEnd;
        } else {
          removeFrom = selectionEnd;
          removeTo = selectionEnd + removedText.length;
        }
        this.removeStyleFromTo(removeFrom, removeTo);
      }
      if (insertedText.length) {
        if (fromPaste && insertedText.join("") === fabric2.copiedText && !fabric2.disableStyleCopyPaste) {
          copiedStyle = fabric2.copiedTextStyle;
        }
        this.insertNewStyleBlock(insertedText, selectionStart, copiedStyle);
      }
      this.updateFromTextArea();
      this.fire("changed");
      if (this.canvas) {
        this.canvas.fire("text:changed", { target: this });
        this.canvas.requestRenderAll();
      }
    },
    onCompositionStart: function() {
      this.inCompositionMode = true;
    },
    onCompositionEnd: function() {
      this.inCompositionMode = false;
    },
    onCompositionUpdate: function(e2) {
      this.compositionStart = e2.target.selectionStart;
      this.compositionEnd = e2.target.selectionEnd;
      this.updateTextareaPosition();
    },
    copy: function() {
      if (this.selectionStart === this.selectionEnd) {
        return;
      }
      fabric2.copiedText = this.getSelectedText();
      if (!fabric2.disableStyleCopyPaste) {
        fabric2.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd, true);
      } else {
        fabric2.copiedTextStyle = null;
      }
      this._copyDone = true;
    },
    paste: function() {
      this.fromPaste = true;
    },
    _getClipboardData: function(e2) {
      return e2 && e2.clipboardData || fabric2.window.clipboardData;
    },
    _getWidthBeforeCursor: function(lineIndex, charIndex) {
      var widthBeforeCursor = this._getLineLeftOffset(lineIndex), bound;
      if (charIndex > 0) {
        bound = this.__charBounds[lineIndex][charIndex - 1];
        widthBeforeCursor += bound.left + bound.width;
      }
      return widthBeforeCursor;
    },
    getDownCursorOffset: function(e2, isRight) {
      var selectionProp = this._getSelectionForOffset(e2, isRight), cursorLocation = this.get2DCursorLocation(selectionProp), lineIndex = cursorLocation.lineIndex;
      if (lineIndex === this._textLines.length - 1 || e2.metaKey || e2.keyCode === 34) {
        return this._text.length - selectionProp;
      }
      var charIndex = cursorLocation.charIndex, widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex), indexOnOtherLine = this._getIndexOnLine(lineIndex + 1, widthBeforeCursor), textAfterCursor = this._textLines[lineIndex].slice(charIndex);
      return textAfterCursor.length + indexOnOtherLine + 1 + this.missingNewlineOffset(lineIndex);
    },
    _getSelectionForOffset: function(e2, isRight) {
      if (e2.shiftKey && this.selectionStart !== this.selectionEnd && isRight) {
        return this.selectionEnd;
      } else {
        return this.selectionStart;
      }
    },
    getUpCursorOffset: function(e2, isRight) {
      var selectionProp = this._getSelectionForOffset(e2, isRight), cursorLocation = this.get2DCursorLocation(selectionProp), lineIndex = cursorLocation.lineIndex;
      if (lineIndex === 0 || e2.metaKey || e2.keyCode === 33) {
        return -selectionProp;
      }
      var charIndex = cursorLocation.charIndex, widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex), indexOnOtherLine = this._getIndexOnLine(lineIndex - 1, widthBeforeCursor), textBeforeCursor = this._textLines[lineIndex].slice(0, charIndex), missingNewlineOffset = this.missingNewlineOffset(lineIndex - 1);
      return -this._textLines[lineIndex - 1].length + indexOnOtherLine - textBeforeCursor.length + (1 - missingNewlineOffset);
    },
    _getIndexOnLine: function(lineIndex, width) {
      var line = this._textLines[lineIndex], lineLeftOffset = this._getLineLeftOffset(lineIndex), widthOfCharsOnLine = lineLeftOffset, indexOnLine = 0, charWidth, foundMatch;
      for (var j = 0, jlen = line.length; j < jlen; j++) {
        charWidth = this.__charBounds[lineIndex][j].width;
        widthOfCharsOnLine += charWidth;
        if (widthOfCharsOnLine > width) {
          foundMatch = true;
          var leftEdge = widthOfCharsOnLine - charWidth, rightEdge = widthOfCharsOnLine, offsetFromLeftEdge = Math.abs(leftEdge - width), offsetFromRightEdge = Math.abs(rightEdge - width);
          indexOnLine = offsetFromRightEdge < offsetFromLeftEdge ? j : j - 1;
          break;
        }
      }
      if (!foundMatch) {
        indexOnLine = line.length - 1;
      }
      return indexOnLine;
    },
    moveCursorDown: function(e2) {
      if (this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length) {
        return;
      }
      this._moveCursorUpOrDown("Down", e2);
    },
    moveCursorUp: function(e2) {
      if (this.selectionStart === 0 && this.selectionEnd === 0) {
        return;
      }
      this._moveCursorUpOrDown("Up", e2);
    },
    _moveCursorUpOrDown: function(direction, e2) {
      var action = "get" + direction + "CursorOffset", offset = this[action](e2, this._selectionDirection === "right");
      if (e2.shiftKey) {
        this.moveCursorWithShift(offset);
      } else {
        this.moveCursorWithoutShift(offset);
      }
      if (offset !== 0) {
        this.setSelectionInBoundaries();
        this.abortCursorAnimation();
        this._currentCursorOpacity = 1;
        this.initDelayedCursor();
        this._fireSelectionChanged();
        this._updateTextarea();
      }
    },
    moveCursorWithShift: function(offset) {
      var newSelection = this._selectionDirection === "left" ? this.selectionStart + offset : this.selectionEnd + offset;
      this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, newSelection);
      return offset !== 0;
    },
    moveCursorWithoutShift: function(offset) {
      if (offset < 0) {
        this.selectionStart += offset;
        this.selectionEnd = this.selectionStart;
      } else {
        this.selectionEnd += offset;
        this.selectionStart = this.selectionEnd;
      }
      return offset !== 0;
    },
    moveCursorLeft: function(e2) {
      if (this.selectionStart === 0 && this.selectionEnd === 0) {
        return;
      }
      this._moveCursorLeftOrRight("Left", e2);
    },
    _move: function(e2, prop, direction) {
      var newValue;
      if (e2.altKey) {
        newValue = this["findWordBoundary" + direction](this[prop]);
      } else if (e2.metaKey || e2.keyCode === 35 || e2.keyCode === 36) {
        newValue = this["findLineBoundary" + direction](this[prop]);
      } else {
        this[prop] += direction === "Left" ? -1 : 1;
        return true;
      }
      if (typeof newValue !== "undefined" && this[prop] !== newValue) {
        this[prop] = newValue;
        return true;
      }
    },
    _moveLeft: function(e2, prop) {
      return this._move(e2, prop, "Left");
    },
    _moveRight: function(e2, prop) {
      return this._move(e2, prop, "Right");
    },
    moveCursorLeftWithoutShift: function(e2) {
      var change = true;
      this._selectionDirection = "left";
      if (this.selectionEnd === this.selectionStart && this.selectionStart !== 0) {
        change = this._moveLeft(e2, "selectionStart");
      }
      this.selectionEnd = this.selectionStart;
      return change;
    },
    moveCursorLeftWithShift: function(e2) {
      if (this._selectionDirection === "right" && this.selectionStart !== this.selectionEnd) {
        return this._moveLeft(e2, "selectionEnd");
      } else if (this.selectionStart !== 0) {
        this._selectionDirection = "left";
        return this._moveLeft(e2, "selectionStart");
      }
    },
    moveCursorRight: function(e2) {
      if (this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length) {
        return;
      }
      this._moveCursorLeftOrRight("Right", e2);
    },
    _moveCursorLeftOrRight: function(direction, e2) {
      var actionName = "moveCursor" + direction + "With";
      this._currentCursorOpacity = 1;
      if (e2.shiftKey) {
        actionName += "Shift";
      } else {
        actionName += "outShift";
      }
      if (this[actionName](e2)) {
        this.abortCursorAnimation();
        this.initDelayedCursor();
        this._fireSelectionChanged();
        this._updateTextarea();
      }
    },
    moveCursorRightWithShift: function(e2) {
      if (this._selectionDirection === "left" && this.selectionStart !== this.selectionEnd) {
        return this._moveRight(e2, "selectionStart");
      } else if (this.selectionEnd !== this._text.length) {
        this._selectionDirection = "right";
        return this._moveRight(e2, "selectionEnd");
      }
    },
    moveCursorRightWithoutShift: function(e2) {
      var changed = true;
      this._selectionDirection = "right";
      if (this.selectionStart === this.selectionEnd) {
        changed = this._moveRight(e2, "selectionStart");
        this.selectionEnd = this.selectionStart;
      } else {
        this.selectionStart = this.selectionEnd;
      }
      return changed;
    },
    removeChars: function(start, end) {
      if (typeof end === "undefined") {
        end = start + 1;
      }
      this.removeStyleFromTo(start, end);
      this._text.splice(start, end - start);
      this.text = this._text.join("");
      this.set("dirty", true);
      if (this._shouldClearDimensionCache()) {
        this.initDimensions();
        this.setCoords();
      }
      this._removeExtraneousStyles();
    },
    insertChars: function(text, style, start, end) {
      if (typeof end === "undefined") {
        end = start;
      }
      if (end > start) {
        this.removeStyleFromTo(start, end);
      }
      var graphemes = fabric2.util.string.graphemeSplit(text);
      this.insertNewStyleBlock(graphemes, start, style);
      this._text = [].concat(this._text.slice(0, start), graphemes, this._text.slice(end));
      this.text = this._text.join("");
      this.set("dirty", true);
      if (this._shouldClearDimensionCache()) {
        this.initDimensions();
        this.setCoords();
      }
      this._removeExtraneousStyles();
    }
  });
  (function() {
    var toFixed = fabric2.util.toFixed, multipleSpacesRegex = /  +/g;
    fabric2.util.object.extend(fabric2.Text.prototype, {
      _toSVG: function() {
        var offsets = this._getSVGLeftTopOffsets(), textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
        return this._wrapSVGTextAndBg(textAndBg);
      },
      toSVG: function(reviver) {
        return this._createBaseSVGMarkup(
          this._toSVG(),
          { reviver, noStyle: true, withShadow: true }
        );
      },
      _getSVGLeftTopOffsets: function() {
        return {
          textLeft: -this.width / 2,
          textTop: -this.height / 2,
          lineTop: this.getHeightOfLine(0)
        };
      },
      _wrapSVGTextAndBg: function(textAndBg) {
        var noShadow = true, textDecoration = this.getSvgTextDecoration(this);
        return [
          textAndBg.textBgRects.join(""),
          '		<text xml:space="preserve" ',
          this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "",
          this.fontSize ? 'font-size="' + this.fontSize + '" ' : "",
          this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "",
          this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "",
          textDecoration ? 'text-decoration="' + textDecoration + '" ' : "",
          'style="',
          this.getSvgStyles(noShadow),
          '"',
          this.addPaintOrder(),
          " >",
          textAndBg.textSpans.join(""),
          "</text>\n"
        ];
      },
      _getSVGTextAndBg: function(textTopOffset, textLeftOffset) {
        var textSpans = [], textBgRects = [], height = textTopOffset, lineOffset;
        this._setSVGBg(textBgRects);
        for (var i2 = 0, len = this._textLines.length; i2 < len; i2++) {
          lineOffset = this._getLineLeftOffset(i2);
          if (this.textBackgroundColor || this.styleHas("textBackgroundColor", i2)) {
            this._setSVGTextLineBg(textBgRects, i2, textLeftOffset + lineOffset, height);
          }
          this._setSVGTextLineText(textSpans, i2, textLeftOffset + lineOffset, height);
          height += this.getHeightOfLine(i2);
        }
        return {
          textSpans,
          textBgRects
        };
      },
      _createTextCharSpan: function(_char, styleDecl, left, top) {
        var shouldUseWhitespace = _char !== _char.trim() || _char.match(multipleSpacesRegex), styleProps = this.getSvgSpanStyles(styleDecl, shouldUseWhitespace), fillStyles = styleProps ? 'style="' + styleProps + '"' : "", dy = styleDecl.deltaY, dySpan = "", NUM_FRACTION_DIGITS = fabric2.Object.NUM_FRACTION_DIGITS;
        if (dy) {
          dySpan = ' dy="' + toFixed(dy, NUM_FRACTION_DIGITS) + '" ';
        }
        return [
          '<tspan x="',
          toFixed(left, NUM_FRACTION_DIGITS),
          '" y="',
          toFixed(top, NUM_FRACTION_DIGITS),
          '" ',
          dySpan,
          fillStyles,
          ">",
          fabric2.util.string.escapeXml(_char),
          "</tspan>"
        ].join("");
      },
      _setSVGTextLineText: function(textSpans, lineIndex, textLeftOffset, textTopOffset) {
        var lineHeight = this.getHeightOfLine(lineIndex), isJustify = this.textAlign.indexOf("justify") !== -1, actualStyle, nextStyle, charsToRender = "", charBox, style, boxWidth = 0, line = this._textLines[lineIndex], timeToRender;
        textTopOffset += lineHeight * (1 - this._fontSizeFraction) / this.lineHeight;
        for (var i2 = 0, len = line.length - 1; i2 <= len; i2++) {
          timeToRender = i2 === len || this.charSpacing;
          charsToRender += line[i2];
          charBox = this.__charBounds[lineIndex][i2];
          if (boxWidth === 0) {
            textLeftOffset += charBox.kernedWidth - charBox.width;
            boxWidth += charBox.width;
          } else {
            boxWidth += charBox.kernedWidth;
          }
          if (isJustify && !timeToRender) {
            if (this._reSpaceAndTab.test(line[i2])) {
              timeToRender = true;
            }
          }
          if (!timeToRender) {
            actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i2);
            nextStyle = this.getCompleteStyleDeclaration(lineIndex, i2 + 1);
            timeToRender = fabric2.util.hasStyleChanged(actualStyle, nextStyle, true);
          }
          if (timeToRender) {
            style = this._getStyleDeclaration(lineIndex, i2) || {};
            textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset));
            charsToRender = "";
            actualStyle = nextStyle;
            textLeftOffset += boxWidth;
            boxWidth = 0;
          }
        }
      },
      _pushTextBgRect: function(textBgRects, color, left, top, width, height) {
        var NUM_FRACTION_DIGITS = fabric2.Object.NUM_FRACTION_DIGITS;
        textBgRects.push(
          "		<rect ",
          this._getFillAttributes(color),
          ' x="',
          toFixed(left, NUM_FRACTION_DIGITS),
          '" y="',
          toFixed(top, NUM_FRACTION_DIGITS),
          '" width="',
          toFixed(width, NUM_FRACTION_DIGITS),
          '" height="',
          toFixed(height, NUM_FRACTION_DIGITS),
          '"></rect>\n'
        );
      },
      _setSVGTextLineBg: function(textBgRects, i2, leftOffset, textTopOffset) {
        var line = this._textLines[i2], heightOfLine = this.getHeightOfLine(i2) / this.lineHeight, boxWidth = 0, boxStart = 0, charBox, currentColor, lastColor = this.getValueOfPropertyAt(i2, 0, "textBackgroundColor");
        for (var j = 0, jlen = line.length; j < jlen; j++) {
          charBox = this.__charBounds[i2][j];
          currentColor = this.getValueOfPropertyAt(i2, j, "textBackgroundColor");
          if (currentColor !== lastColor) {
            lastColor && this._pushTextBgRect(
              textBgRects,
              lastColor,
              leftOffset + boxStart,
              textTopOffset,
              boxWidth,
              heightOfLine
            );
            boxStart = charBox.left;
            boxWidth = charBox.width;
            lastColor = currentColor;
          } else {
            boxWidth += charBox.kernedWidth;
          }
        }
        currentColor && this._pushTextBgRect(
          textBgRects,
          currentColor,
          leftOffset + boxStart,
          textTopOffset,
          boxWidth,
          heightOfLine
        );
      },
      _getFillAttributes: function(value) {
        var fillColor = value && typeof value === "string" ? new fabric2.Color(value) : "";
        if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
          return 'fill="' + value + '"';
        }
        return 'opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
      },
      _getSVGLineTopOffset: function(lineIndex) {
        var lineTopOffset = 0, lastHeight = 0;
        for (var j = 0; j < lineIndex; j++) {
          lineTopOffset += this.getHeightOfLine(j);
        }
        lastHeight = this.getHeightOfLine(j);
        return {
          lineTop: lineTopOffset,
          offset: (this._fontSizeMult - this._fontSizeFraction) * lastHeight / (this.lineHeight * this._fontSizeMult)
        };
      },
      getSvgStyles: function(skipShadow) {
        var svgStyle = fabric2.Object.prototype.getSvgStyles.call(this, skipShadow);
        return svgStyle + " white-space: pre;";
      }
    });
  })();
  (function(global) {
    var fabric3 = global.fabric || (global.fabric = {});
    fabric3.Textbox = fabric3.util.createClass(fabric3.IText, fabric3.Observable, {
      type: "textbox",
      minWidth: 20,
      dynamicMinWidth: 2,
      __cachedLines: null,
      lockScalingFlip: true,
      noScaleCache: false,
      _dimensionAffectingProps: fabric3.Text.prototype._dimensionAffectingProps.concat("width"),
      _wordJoiners: /[ \t\r]/,
      splitByGrapheme: false,
      initDimensions: function() {
        if (this.__skipDimension) {
          return;
        }
        this.isEditing && this.initDelayedCursor();
        this.clearContextTop();
        this._clearCache();
        this.dynamicMinWidth = 0;
        this._styleMap = this._generateStyleMap(this._splitText());
        if (this.dynamicMinWidth > this.width) {
          this._set("width", this.dynamicMinWidth);
        }
        if (this.textAlign.indexOf("justify") !== -1) {
          this.enlargeSpaces();
        }
        this.height = this.calcTextHeight();
        this.saveState({ propertySet: "_dimensionAffectingProps" });
      },
      _generateStyleMap: function(textInfo) {
        var realLineCount = 0, realLineCharCount = 0, charCount = 0, map = {};
        for (var i2 = 0; i2 < textInfo.graphemeLines.length; i2++) {
          if (textInfo.graphemeText[charCount] === "\n" && i2 > 0) {
            realLineCharCount = 0;
            charCount++;
            realLineCount++;
          } else if (!this.splitByGrapheme && this._reSpaceAndTab.test(textInfo.graphemeText[charCount]) && i2 > 0) {
            realLineCharCount++;
            charCount++;
          }
          map[i2] = { line: realLineCount, offset: realLineCharCount };
          charCount += textInfo.graphemeLines[i2].length;
          realLineCharCount += textInfo.graphemeLines[i2].length;
        }
        return map;
      },
      styleHas: function(property, lineIndex) {
        if (this._styleMap && !this.isWrapping) {
          var map = this._styleMap[lineIndex];
          if (map) {
            lineIndex = map.line;
          }
        }
        return fabric3.Text.prototype.styleHas.call(this, property, lineIndex);
      },
      isEmptyStyles: function(lineIndex) {
        if (!this.styles) {
          return true;
        }
        var offset = 0, nextLineIndex = lineIndex + 1, nextOffset, obj, shouldLimit = false, map = this._styleMap[lineIndex], mapNextLine = this._styleMap[lineIndex + 1];
        if (map) {
          lineIndex = map.line;
          offset = map.offset;
        }
        if (mapNextLine) {
          nextLineIndex = mapNextLine.line;
          shouldLimit = nextLineIndex === lineIndex;
          nextOffset = mapNextLine.offset;
        }
        obj = typeof lineIndex === "undefined" ? this.styles : { line: this.styles[lineIndex] };
        for (var p1 in obj) {
          for (var p2 in obj[p1]) {
            if (p2 >= offset && (!shouldLimit || p2 < nextOffset)) {
              for (var p3 in obj[p1][p2]) {
                return false;
              }
            }
          }
        }
        return true;
      },
      _getStyleDeclaration: function(lineIndex, charIndex) {
        if (this._styleMap && !this.isWrapping) {
          var map = this._styleMap[lineIndex];
          if (!map) {
            return null;
          }
          lineIndex = map.line;
          charIndex = map.offset + charIndex;
        }
        return this.callSuper("_getStyleDeclaration", lineIndex, charIndex);
      },
      _setStyleDeclaration: function(lineIndex, charIndex, style) {
        var map = this._styleMap[lineIndex];
        lineIndex = map.line;
        charIndex = map.offset + charIndex;
        this.styles[lineIndex][charIndex] = style;
      },
      _deleteStyleDeclaration: function(lineIndex, charIndex) {
        var map = this._styleMap[lineIndex];
        lineIndex = map.line;
        charIndex = map.offset + charIndex;
        delete this.styles[lineIndex][charIndex];
      },
      _getLineStyle: function(lineIndex) {
        var map = this._styleMap[lineIndex];
        return !!this.styles[map.line];
      },
      _setLineStyle: function(lineIndex) {
        var map = this._styleMap[lineIndex];
        this.styles[map.line] = {};
      },
      _wrapText: function(lines, desiredWidth) {
        var wrapped = [], i2;
        this.isWrapping = true;
        for (i2 = 0; i2 < lines.length; i2++) {
          wrapped = wrapped.concat(this._wrapLine(lines[i2], i2, desiredWidth));
        }
        this.isWrapping = false;
        return wrapped;
      },
      _measureWord: function(word, lineIndex, charOffset) {
        var width = 0, prevGrapheme, skipLeft = true;
        charOffset = charOffset || 0;
        for (var i2 = 0, len = word.length; i2 < len; i2++) {
          var box = this._getGraphemeBox(word[i2], lineIndex, i2 + charOffset, prevGrapheme, skipLeft);
          width += box.kernedWidth;
          prevGrapheme = word[i2];
        }
        return width;
      },
      _wrapLine: function(_line, lineIndex, desiredWidth, reservedSpace) {
        var lineWidth = 0, splitByGrapheme = this.splitByGrapheme, graphemeLines = [], line = [], words = splitByGrapheme ? fabric3.util.string.graphemeSplit(_line) : _line.split(this._wordJoiners), word = "", offset = 0, infix = splitByGrapheme ? "" : " ", wordWidth = 0, infixWidth = 0, largestWordWidth = 0, lineJustStarted = true, additionalSpace = this._getWidthOfCharSpacing(), reservedSpace = reservedSpace || 0;
        if (words.length === 0) {
          words.push([]);
        }
        desiredWidth -= reservedSpace;
        for (var i2 = 0; i2 < words.length; i2++) {
          word = splitByGrapheme ? words[i2] : fabric3.util.string.graphemeSplit(words[i2]);
          wordWidth = this._measureWord(word, lineIndex, offset);
          offset += word.length;
          lineWidth += infixWidth + wordWidth - additionalSpace;
          if (lineWidth > desiredWidth && !lineJustStarted) {
            graphemeLines.push(line);
            line = [];
            lineWidth = wordWidth;
            lineJustStarted = true;
          } else {
            lineWidth += additionalSpace;
          }
          if (!lineJustStarted && !splitByGrapheme) {
            line.push(infix);
          }
          line = line.concat(word);
          infixWidth = splitByGrapheme ? 0 : this._measureWord([infix], lineIndex, offset);
          offset++;
          lineJustStarted = false;
          if (wordWidth > largestWordWidth) {
            largestWordWidth = wordWidth;
          }
        }
        i2 && graphemeLines.push(line);
        if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
          this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
        }
        return graphemeLines;
      },
      isEndOfWrapping: function(lineIndex) {
        if (!this._styleMap[lineIndex + 1]) {
          return true;
        }
        if (this._styleMap[lineIndex + 1].line !== this._styleMap[lineIndex].line) {
          return true;
        }
        return false;
      },
      missingNewlineOffset: function(lineIndex) {
        if (this.splitByGrapheme) {
          return this.isEndOfWrapping(lineIndex) ? 1 : 0;
        }
        return 1;
      },
      _splitTextIntoLines: function(text) {
        var newText = fabric3.Text.prototype._splitTextIntoLines.call(this, text), graphemeLines = this._wrapText(newText.lines, this.width), lines = new Array(graphemeLines.length);
        for (var i2 = 0; i2 < graphemeLines.length; i2++) {
          lines[i2] = graphemeLines[i2].join("");
        }
        newText.lines = lines;
        newText.graphemeLines = graphemeLines;
        return newText;
      },
      getMinWidth: function() {
        return Math.max(this.minWidth, this.dynamicMinWidth);
      },
      _removeExtraneousStyles: function() {
        var linesToKeep = {};
        for (var prop in this._styleMap) {
          if (this._textLines[prop]) {
            linesToKeep[this._styleMap[prop].line] = 1;
          }
        }
        for (var prop in this.styles) {
          if (!linesToKeep[prop]) {
            delete this.styles[prop];
          }
        }
      },
      toObject: function(propertiesToInclude) {
        return this.callSuper("toObject", ["minWidth", "splitByGrapheme"].concat(propertiesToInclude));
      }
    });
    fabric3.Textbox.fromObject = function(object, callback) {
      var styles = fabric3.util.stylesFromArray(object.styles, object.text);
      var objCopy = Object.assign({}, object, { styles });
      return fabric3.Object._fromObject("Textbox", objCopy, callback, "text");
    };
  })(exports);
  (function() {
    var controlsUtils = fabric2.controlsUtils, scaleSkewStyleHandler = controlsUtils.scaleSkewCursorStyleHandler, scaleStyleHandler = controlsUtils.scaleCursorStyleHandler, scalingEqually = controlsUtils.scalingEqually, scalingYOrSkewingX = controlsUtils.scalingYOrSkewingX, scalingXOrSkewingY = controlsUtils.scalingXOrSkewingY, scaleOrSkewActionName = controlsUtils.scaleOrSkewActionName, objectControls = fabric2.Object.prototype.controls;
    objectControls.ml = new fabric2.Control({
      x: -0.5,
      y: 0,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingXOrSkewingY,
      getActionName: scaleOrSkewActionName
    });
    objectControls.mr = new fabric2.Control({
      x: 0.5,
      y: 0,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingXOrSkewingY,
      getActionName: scaleOrSkewActionName
    });
    objectControls.mb = new fabric2.Control({
      x: 0,
      y: 0.5,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingYOrSkewingX,
      getActionName: scaleOrSkewActionName
    });
    objectControls.mt = new fabric2.Control({
      x: 0,
      y: -0.5,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingYOrSkewingX,
      getActionName: scaleOrSkewActionName
    });
    objectControls.tl = new fabric2.Control({
      x: -0.5,
      y: -0.5,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually
    });
    objectControls.tr = new fabric2.Control({
      x: 0.5,
      y: -0.5,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually
    });
    objectControls.bl = new fabric2.Control({
      x: -0.5,
      y: 0.5,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually
    });
    objectControls.br = new fabric2.Control({
      x: 0.5,
      y: 0.5,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually
    });
    objectControls.mtr = new fabric2.Control({
      x: 0,
      y: -0.5,
      actionHandler: controlsUtils.rotationWithSnapping,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      offsetY: -40,
      withConnection: true,
      actionName: "rotate"
    });
    if (fabric2.Textbox) {
      var textBoxControls = fabric2.Textbox.prototype.controls = {};
      textBoxControls.mtr = objectControls.mtr;
      textBoxControls.tr = objectControls.tr;
      textBoxControls.br = objectControls.br;
      textBoxControls.tl = objectControls.tl;
      textBoxControls.bl = objectControls.bl;
      textBoxControls.mt = objectControls.mt;
      textBoxControls.mb = objectControls.mb;
      textBoxControls.mr = new fabric2.Control({
        x: 0.5,
        y: 0,
        actionHandler: controlsUtils.changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: "resizing"
      });
      textBoxControls.ml = new fabric2.Control({
        x: -0.5,
        y: 0,
        actionHandler: controlsUtils.changeWidth,
        cursorStyleHandler: scaleSkewStyleHandler,
        actionName: "resizing"
      });
    }
  })();
})(fabric$1);
class SimpleView {
  constructor(mainView2, type) {
    this.mainView = mainView2;
    this.type = type;
  }
  async render() {
    this.mainView.currentView = this.type;
    this.mainView.canvas.add(this.mainView[`${this.type}Image`]);
    this.mainView[`${this.type}Image`].sendToBack();
  }
  destroy() {
    this.mainView.canvas.remove(this.mainView[`${this.type}Image`]);
  }
}
class SideToSideView {
  constructor({ mainView: mainView2 }) {
    __publicField(this, "mainView");
    __publicField(this, "canvas");
    __publicField(this, "dividerLine");
    __publicField(this, "dividerSlider");
    this.mainView = mainView2;
    this.canvas = mainView2.canvas;
    this.zoomEventHandler = () => {
      this.dividerLine.scaleX = 1 / this.canvas.getZoom();
      this.dividerSlider.scaleX = 1 / this.canvas.getZoom();
      this.dividerSlider.scaleY = 1 / this.canvas.getZoom();
    };
    this.canvasMouseCLickHandler = (e2) => {
      const $this = this;
      $this.folowMouse = !$this.folowMouse;
      $this.followCursor(e2);
      $this.divider.set({
        hoverCursor: $this.folowMouse ? "grab" : "pointer"
      });
      if ($this.folowMouse) {
        $this.disappear($this.actualLabel);
        $this.disappear($this.expectedLabel);
      } else {
        $this.appear($this.actualLabel);
        $this.appear($this.expectedLabel);
      }
    };
    this.canvasMouseMoveHandler = (e2) => {
      const $this = this;
      if (!$this.folowMouse)
        return;
      $this.followCursor(e2);
    };
    this.canvasPanHandler = (e2) => {
      const $this = this;
      if (!$this.folowMouse)
        return;
      $this.followCursor(e2);
    };
  }
  static lockCommon(object) {
    object.set({
      lockMovementY: true,
      lockMovementX: true,
      selectable: false,
      hasControls: false
    });
  }
  addZoomEvents() {
    document.addEventListener("zoom", this.zoomEventHandler, false);
  }
  removeZoomEvents() {
    document.removeEventListener("zoom", this.zoomEventHandler, false);
  }
  followCursor(e2) {
    const newLeft = (e2.e.clientX - (this.canvasLeft + this.canvasOffsetX())) / this.canvas.getZoom();
    const newTop = e2.e.clientY / this.canvas.getZoom() - this.canvasOffsetY() / this.canvas.getZoom() - this.canvasTop / this.canvas.getZoom() - this.dividerSlider.width / 2;
    this.divider.left = newLeft - this.divider.width / 2 + this.dividerSlider.width / 2;
    this.rectClip.left = newLeft;
    this.divider.top = newTop - this.dividerSlider.height / this.canvas.getZoom() / 2;
    this.divider.setCoords();
    this.canvas.renderAll();
  }
  disappear(object) {
    object.animate("opacity", "0.00", {
      onChange: this.canvas.renderAll.bind(this.canvas),
      duration: 400
    });
  }
  appear(object) {
    object.animate("opacity", "1.00", {
      onChange: this.canvas.renderAll.bind(this.canvas),
      duration: 400
    });
  }
  addDividerFollowMouseEvents() {
    this.canvas.on(
      {
        "mouse:down": this.canvasMouseCLickHandler,
        "mouse:move": this.canvasMouseMoveHandler,
        pan: this.canvasPanHandler
      }
    );
  }
  removeDividerFollowMouseEvents() {
    this.canvas.off("mouse:down", this.canvasMouseCLickHandler);
    this.canvas.off("mouse:move", this.canvasMouseMoveHandler);
    this.canvas.off("pan", this.canvasPanHandler);
  }
  canvasOffsetX() {
    return this.canvas.viewportTransform[4];
  }
  canvasOffsetY() {
    return this.canvas.viewportTransform[5];
  }
  snapshotLabel(name) {
    const frame = new fabric$1.fabric.Rect({
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      fill: "#373A40",
      opacity: 0.9,
      width: 180 / this.canvas.getZoom(),
      height: 80 / this.canvas.getZoom()
    });
    SideToSideView.lockCommon(frame);
    const text = new fabric$1.fabric.Text(name, {
      textAlign: "left",
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      fill: "white",
      fontSize: 36 / this.canvas.getZoom(),
      lockMovementY: true,
      lockMovementX: true,
      lockScalingX: true,
      lockScalingY: true
    });
    const label = new fabric$1.fabric.Group([frame, text]);
    label.set(
      {
        hasControls: false,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementY: true,
        lockMovementX: true,
        hoverCursor: "default",
        originX: "center",
        originY: "center"
      }
    );
    return label;
  }
  divider() {
    const $this = this;
    const dividerFillColor = "#FFFFFF";
    const dividerStrokeColor = "#878a8c";
    this.dividerOffset = 5e4;
    this.dividerLine = new fabric$1.fabric.Rect({
      originX: "center",
      originY: "top",
      left: this.canvas.getWidth() / 2,
      top: 0,
      lockMovementY: true,
      lockMovementX: true,
      hasControls: false,
      hasBorders: false,
      stroke: dividerStrokeColor,
      fill: dividerFillColor,
      strokeWidth: 1,
      strokeUniform: false,
      width: 3,
      height: this.canvas.getHeight() + this.dividerOffset
    });
    this.dividerSliderCircle = new fabric$1.fabric.Circle({
      originX: "center",
      originY: "top",
      moveCursor: "none",
      hasControls: false,
      hasBorders: false,
      left: this.canvas.getWidth() / 2,
      top: this.canvas.getHeight() / 2 + this.dividerOffset / 2 + 24,
      radius: 24,
      fill: "white",
      stroke: dividerStrokeColor,
      strokeUniform: false,
      strokeWidth: 1
    });
    this.dividerSliderText = new fabric$1.fabric.Text("\u276E   \u276F", {
      top: this.canvas.getHeight() / 2 + this.dividerOffset / 2 + 48,
      left: this.canvas.getWidth() / 2,
      textAlign: "left",
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      fill: dividerStrokeColor,
      fontSize: 17,
      lockMovementY: true,
      lockMovementX: true,
      lockScalingX: true,
      lockScalingY: true
    });
    this.dividerSlider = new fabric$1.fabric.Group(
      [
        this.dividerSliderCircle,
        this.dividerSliderText
      ]
    );
    this.dividerSlider.set(
      {
        top: this.canvas.getHeight() / 2 + this.dividerOffset / 2 + 48,
        left: this.canvas.getWidth() / 2,
        textAlign: "left",
        originX: "center",
        originY: "center",
        hoverCursor: "default",
        fill: dividerStrokeColor,
        fontSize: 17,
        lockMovementY: true,
        lockMovementX: true,
        lockScalingX: true,
        lockScalingY: true
      }
    );
    const divider = new fabric$1.fabric.Group(
      [
        this.dividerLine,
        this.dividerSlider
      ]
    );
    divider.set({
      originX: "center",
      originY: "center",
      top: this.canvas.getHeight() / 2 / this.canvas.getZoom() - this.canvasOffsetY() - 48,
      name: "divider",
      hoverCursor: $this.folowMouse ? "grab" : "pointer",
      borderColor: "transparent",
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementY: true,
      lockMovementX: true,
      opacity: 1
    });
    return divider;
  }
  rectClip() {
    return new fabric$1.fabric.Rect({
      top: this.baselineImg.height * -1,
      originX: "left",
      originY: "top",
      absolutePositioned: true,
      lockMovementY: true,
      lockMovementX: true,
      height: this.baselineImg.height * 3
    });
  }
  async render() {
    this.baselineImg = this.mainView.expectedImage;
    this.baselineImg.evented = false;
    SideToSideView.lockCommon(this.baselineImg);
    this.actualImg = this.mainView.actualImage;
    this.actualImg.evented = false;
    SideToSideView.lockCommon(this.actualImg);
    this.divider = this.divider();
    this.rectClip = this.rectClip();
    this.actualImg.clipPath = this.rectClip;
    this.expectedLabel = this.snapshotLabel("expected");
    this.actualLabel = this.snapshotLabel("actual");
    this.rectClip.width = this.canvas.getWidth() * 2;
    await this.canvas.add(this.baselineImg);
    await this.canvas.add(this.actualImg);
    await this.canvas.add(this.actualLabel);
    await this.canvas.add(this.expectedLabel);
    await this.canvas.add(this.divider);
    await this.canvas.renderAll();
    this.divider.left = this.baselineImg.getScaledWidth() / 2;
    this.rectClip.left = this.baselineImg.getScaledWidth() / 2;
    this.expectedLabel.top = this.canvas.getHeight() / 2 / this.canvas.getZoom() - this.canvasOffsetY() - this.expectedLabel.height / 2 * this.canvas.getZoom();
    this.expectedLabel.left = (this.canvas.getWidth() / 4 - this.canvasOffsetX()) / this.canvas.getZoom();
    this.actualLabel.top = this.canvas.getHeight() / 2 / this.canvas.getZoom() - this.canvasOffsetY() - this.actualLabel.height / 2 * this.canvas.getZoom();
    this.actualLabel.left = (this.canvas.getWidth() / 4 * 3 - this.canvasOffsetX()) / this.canvas.getZoom();
    await this.canvas.renderAll();
    this.canvasLeft = document.getElementById("snapshoot").getBoundingClientRect().x;
    this.canvasTop = document.getElementById("snapshoot").getBoundingClientRect().y;
    this.addZoomEvents();
    this.addDividerFollowMouseEvents();
    setTimeout(() => {
      const delta = new fabric$1.fabric.Point(0, 0);
      this.canvas.relativePan(delta);
    }, 0);
    setTimeout(() => {
      mainView.sliderView.zoomEventHandler();
      mainView.canvas.renderAll();
    }, 100);
  }
  async destroy() {
    var _a;
    (_a = this.actualImg) == null ? true : delete _a.clipPath;
    [
      this.actualImg,
      this.baselineImg,
      this.divider,
      this.actualLabel,
      this.expectedLabel,
      this.rectClip
    ].forEach((item) => {
      this.canvas.remove(item);
    });
    delete this.canvas.backgroundImage;
    this.removeDividerFollowMouseEvents();
    this.removeZoomEvents();
  }
}
function imageFromUrl(url) {
  return new Promise(
    (resolve, reject) => {
      try {
        fabric.Image.fromURL(
          url,
          (img) => resolve(img)
        );
      } catch (e2) {
        console.error(`cannot create image from url, error: '${e2}'`);
        reject(e2);
      }
    }
  );
}
function lockImage(image) {
  image.set({
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: "default",
    hasControls: false,
    selectable: false
  });
  return image;
}
class MainView {
  constructor({
    canvasElementWidth,
    canvasElementHeight,
    canvasId,
    actual,
    expectedImage,
    actualImage,
    diffImage
  }) {
    __publicField(this, "canvasElementWidth");
    __publicField(this, "canvasElementHeight");
    __publicField(this, "sliderView");
    __publicField(this, "canvas");
    __publicField(this, "actualImage");
    __publicField(this, "currentMode");
    __publicField(this, "defaultMode");
    __publicField(this, "currentView");
    __publicField(this, "actualView");
    __publicField(this, "expectedView");
    __publicField(this, "diffView");
    __publicField(this, "expectedImage");
    __publicField(this, "diffImage");
    this.canvasElementWidth = canvasElementWidth;
    this.canvasElementHeight = canvasElementHeight;
    this.actualImage = lockImage(actualImage);
    this.expectedImage = lockImage(expectedImage);
    this.diffImage = diffImage ? lockImage(diffImage) : null;
    this.canvas = new fabric$1.fabric.Canvas(canvasId, {
      width: this.canvasElementWidth,
      height: this.canvasElementHeight,
      preserveObjectStacking: true,
      uniformScaling: false
    });
    this.defaultMode = "";
    this.currentMode = {
      mode: "",
      set(value) {
        this.mode = value;
      },
      toggle(mode) {
        if (this.mode === mode) {
          return this.set(this.defaultMode);
        }
        return this.set(mode);
      },
      isPan() {
        return this.mode === "pan";
      }
    };
    if (actual) {
      this.sliderView = new SideToSideView(
        {
          mainView: this
        }
      );
    }
    this.selectionEvents();
    this.panEvents();
    this.expectedView = new SimpleView(this, "expected");
    this.actualView = new SimpleView(this, "actual");
    this.diffView = new SimpleView(this, "diff");
    this.actualView.render();
  }
  static calculateExpectedCanvasViewportAreaSize() {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const canvasDimensions = document.getElementById("snapshoot").getBoundingClientRect();
    return {
      width: Number(viewportWidth - canvasDimensions.x),
      height: Number(viewportHeight - canvasDimensions.y)
    };
  }
  panEvents() {
    this.canvas.on(
      "mouse:move",
      (e2) => {
        const s2sMoving = this.sliderView.inMovement;
        if ((e2.e.buttons === 4 || this.mouseDown) && this.currentMode.isPan() && !s2sMoving) {
          this.canvas.setCursor("grab");
          const mEvent = e2.e;
          const delta = new fabric$1.fabric.Point(mEvent.movementX, mEvent.movementY);
          this.canvas.relativePan(delta);
          this.canvas.fire("pan", e2);
          this.canvas.renderAll();
        }
      }
    );
    this.canvas.on(
      "mouse:down",
      () => {
        this.mouseDown = true;
        if (this.currentMode.isPan()) {
          this.canvas.setCursor("grab");
          this.canvas.selection = false;
          this.canvas.renderAll();
        }
      }
    );
    this.canvas.on(
      "mouse:up",
      () => {
        this.mouseDown = false;
        this.canvas.setCursor("default");
        this.canvas.renderAll();
        this.canvas.selection = true;
      }
    );
    this.canvas.on("mouse:wheel", (opt) => {
      if (opt.e.ctrlKey)
        return;
      const delta = new fabric$1.fabric.Point(-opt.e.deltaX / 2, -opt.e.deltaY / 2);
      this.canvas.relativePan(delta);
      this.canvas.fire("pan", opt);
      this.canvas.renderAll();
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }
  selectionEvents() {
    this.canvas.on("selection:created", (e2) => {
      var _a, _b;
      const activeSelection = e2.target;
      if (!((_a = activeSelection == null ? void 0 : activeSelection._objects) == null ? void 0 : _a.length) || ((_b = activeSelection == null ? void 0 : activeSelection._objects) == null ? void 0 : _b.length) < 2)
        return;
      activeSelection.hasControls = false;
      this.canvas.renderAll();
    });
    this.canvas.on("selection:updated", (e2) => {
      var _a, _b;
      const activeSelection = e2.target;
      if (!((_a = activeSelection == null ? void 0 : activeSelection._objects) == null ? void 0 : _a.length) || ((_b = activeSelection == null ? void 0 : activeSelection._objects) == null ? void 0 : _b.length) < 2)
        return;
      if (activeSelection.hasControls) {
        activeSelection.hasControls = false;
      }
    });
  }
  zoomEvents() {
  }
  get objects() {
    return this.canvas.getObjects();
  }
  async destroyAllViews() {
    this.expectedView.destroy();
    this.actualView.destroy();
    this.diffView.destroy();
    await this.sliderView.destroy();
  }
  async switchView(view) {
    this.destroyAllViews();
    this.sliderView = new SideToSideView(
      {
        mainView: this
      }
    );
    this[`${view}View`].render();
  }
  static snapshotUrl(filename) {
    return `/snapshoots/${filename}`;
  }
  static lockImage(image) {
    image.set({
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: "default",
      hasControls: false,
      selectable: false
    });
  }
  async panToCenter(image) {
    if (this.pannedOnInit)
      return;
    this.pannedOnInit = true;
    const delta = new fabric$1.fabric.Point(
      this.canvas.width / 2 - image.getScaledWidth() / 2,
      0
    );
    this.canvas.relativePan(delta);
    this.canvas.renderAll();
  }
  panToCanvasWidthCenter(imageName) {
    this.canvas.absolutePan(new fabric$1.fabric.Point(0, 0));
    const delta = new fabric$1.fabric.Point(
      this.canvas.width / 2 - this[imageName].width * this.canvas.getZoom() / 2,
      0
    );
    this.canvas.relativePan(delta);
    this.canvas.renderAll();
  }
  removeActiveIgnoreRegions() {
    const els = this.canvas.getActiveObjects().filter((x2) => x2.name === "ignore_rect");
    this.canvas.discardActiveObject().renderAll();
    if (els.length === 0) {
      alert("there is no active regions for removing");
      return;
    }
    els.forEach((el) => {
      this.canvas.remove(el);
    });
    this.canvas.renderAll();
  }
  addRect(params) {
    params.name = params.name ? params.name : "default_rect";
    let lastLeft = null;
    let lastTop = null;
    let width = null;
    let height = null;
    if (this.getLastRegion() !== void 0 && this.getLastRegion().name === "ignore_rect") {
      lastLeft = this.getLastRegion().left || 50;
      lastTop = this.getLastRegion().top;
      width = this.getLastRegion().getScaledWidth();
      height = this.getLastRegion().getScaledHeight();
    }
    const top = lastTop > document.documentElement.scrollTop && lastTop < document.documentElement.scrollTop + window.innerHeight ? lastTop + 20 : document.documentElement.scrollTop + 50;
    const left = lastLeft < this.canvas.width - 80 ? lastLeft + 20 : lastLeft - 50;
    return new fabric$1.fabric.Rect({
      left: params.left || left,
      top: params.top || top,
      fill: params.fill || "blue",
      width: params.width || width || 200,
      height: params.height || height || 100,
      strokeWidth: params.strokeWidth || 2,
      stroke: params.stroke || "black",
      opacity: 0.5,
      name: params.name,
      strokeUniform: true,
      noScaleCache: false,
      cornerSize: 9,
      transparentCorners: false,
      cornerColor: "rgb(26, 115, 232)",
      cornerStrokeColor: "rgb(255, 255, 255)"
    });
  }
  addIgnoreRegion(params) {
    Object.assign(params, { fill: "MediumVioletRed" });
    const r = this.addRect(params);
    r.setControlsVisibility({
      bl: true,
      br: true,
      tl: true,
      tr: true,
      mt: true,
      mb: true,
      mtr: false
    });
    this.canvas.add(r);
    r.bringToFront();
    if (params.noSelect) {
      return;
    }
    this.canvas.setActiveObject(r);
  }
  addBoundingRegion(name) {
    const params = {
      name,
      fill: "rgba(0,0,0,0)",
      stroke: "green",
      strokeWidth: 3,
      top: 1,
      left: 1,
      width: this.expectedImage.getScaledWidth() - 10,
      height: this.expectedImage.getScaledHeight() - 10
    };
    const r = this.addRect(params);
    this.canvas.add(r);
    r.bringToFront();
  }
  getLastRegion() {
    return this.canvas.item(this.canvas.getObjects().length - 1);
  }
  getRectData() {
    const rects = this.allRects;
    const data = [];
    const coef = parseFloat(this.coef);
    rects.forEach((reg) => {
      const right = reg.left + reg.getScaledWidth();
      const bottom = reg.top + reg.getScaledHeight();
      if (coef) {
        data.push({
          name: reg.name,
          top: reg.top * coef,
          left: reg.left * coef,
          bottom: bottom * coef,
          right: right * coef
        });
      }
    });
    return JSON.stringify(data);
  }
  get coef() {
    return this.expectedImage.height / this.expectedImage.getScaledHeight();
  }
  static async sendIgnoreRegions(id, regionsData) {
    try {
      const response = await fetch(`${config.baseUri}/baselines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ignoreRegions: regionsData })
      });
      const text = await response.text();
      if (response.status === 200) {
        console.log(`Successful send baseline ignored regions, id: '${id}'  resp: '${text}'`);
        successMsg({ message: "ignored regions was saved" });
        return;
      }
      console.error(`Cannot set baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
      errorMsg({ error: "Cannot set baseline ignored regions" });
    } catch (e2) {
      console.error(`Cannot set baseline ignored regions: ${e2.stack || e2}`);
      errorMsg({ error: "Cannot set baseline ignored regions" });
    }
  }
  convertRegionsDataFromServer(regions) {
    const data = [];
    const coef = parseFloat(this.coef);
    regions.forEach((reg) => {
      const width = reg.right - reg.left;
      const height = reg.bottom - reg.top;
      if (coef) {
        data.push({
          name: reg.name,
          top: reg.top / coef,
          left: reg.left / coef,
          width: width / coef,
          height: height / coef
        });
      }
    });
    return data;
  }
  get allRects() {
    return this.canvas.getObjects().filter((r) => r.name === "ignore_rect" || r.name === "bound_rect");
  }
  drawRegions(data) {
    if (!data || data === "undefined") {
      return;
    }
    const regs = this.convertRegionsDataFromServer(JSON.parse(data));
    const classThis = this;
    regs.forEach((regParams) => {
      regParams["noSelect"] = true;
      classThis.addIgnoreRegion(regParams);
    });
  }
  static async getRegionsData(baselineId) {
    try {
      if (!baselineId) {
        return [];
      }
      const url = `${config.baseUri}/baselines/${baselineId}`;
      const response = await fetch(url);
      const text = await response.text();
      if (response.status === 200) {
        console.log(`Successfully got ignored regions, id: '${baselineId}'  resp: '${text}'`);
        return JSON.parse(text);
      }
      if (response.status === 202) {
        console.log("No regions");
        return [];
      }
      console.error(`Cannot get baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
      errorMsg({ error: "Cannot get baseline ignored regions" });
    } catch (e2) {
      console.error(`Cannot get baseline ignored regions: ${e2.stack || e2}`);
      errorMsg({ error: "Cannot get baseline ignored regions" });
    }
    return null;
  }
  async getSnapshotIgnoreRegionsDataAndDrawRegions(id) {
    const regionData = await MainView.getRegionsData(id);
    this.drawRegions(regionData.ignoreRegions);
  }
}
function onImageErrorHandler(...e2) {
  const imgSrc = e2[0].path[0].src;
  const msg = `Cannot load image: '${imgSrc}'`;
  console.error(msg, e2);
  errorMsg({
    error: msg
  });
}
function createImageAndWaitForLoad(src) {
  const timeout = 9e4;
  const img = new Image();
  img.addEventListener("error", onImageErrorHandler);
  img.src = src;
  return Promise.race([new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e2) => reject(e2);
  }), new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`The image loading timeout is exceeded: '${timeout}' milliseconds, src: '${src}'`)), timeout);
  })]);
}
function CheckDetails({
  check,
  checkQuery,
  firstPageQuery,
  closeHandler
}) {
  var _a, _b, _c;
  const theme = useMantineTheme();
  useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  const {
    height: vHeight,
    width: vWidth
  } = useViewportSize();
  const [mainView2, setMainView] = react.exports.useState(null);
  const [zoomPercent, setZoomPercent] = react.exports.useState(100);
  const [openedZoomPopover, zoomPopoverHandler] = useDisclosure(false);
  function zoomEvents() {
    mainView2.canvas.on("mouse:wheel", (opt) => {
      if (!opt.e.ctrlKey)
        return;
      const delta = opt.e.deltaY;
      let zoomVal = mainView2.canvas.getZoom();
      zoomVal *= 0.999 ** delta;
      if (zoomVal > 20)
        zoomVal = 20;
      if (zoomVal < 0.01)
        zoomVal = 0.01;
      mainView2.canvas.zoomToPoint({
        x: opt.e.offsetX,
        y: opt.e.offsetY
      }, zoomVal);
      setZoomPercent(() => zoomVal * 100);
      document.dispatchEvent(new Event("zoom"));
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }
  const zoomByPercent = (percent) => {
    if (!(mainView2 == null ? void 0 : mainView2.canvas))
      return;
    mainView2.canvas.setZoom(percent / 100);
    mainView2.canvas.renderAll();
    setZoomPercent(() => percent);
  };
  const zoomByDelta = (delta) => {
    console.log({
      delta
    });
    document.dispatchEvent(new Event("zoom"));
    let newPercent = Math.round(mainView2.canvas.getZoom() * 100) + delta;
    newPercent = newPercent < 2 ? 2 : newPercent;
    newPercent = newPercent > 1e3 ? 1e3 : newPercent;
    zoomByPercent(newPercent);
  };
  const baselineQuery = useQuery(["baseline_by_snapshot_id", check.baselineId._id], () => GenericService.get("baselines", {
    snapshootId: check.baselineId._id
  }, {
    populate: "app",
    limit: "1"
  }, "baseline_by_snapshot_id"), {
    enabled: true,
    refetchOnWindowFocus: false,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  const baselineId = react.exports.useMemo(() => {
    var _a2, _b2, _c2;
    if (((_a2 = baselineQuery.data) == null ? void 0 : _a2.results) && ((_b2 = baselineQuery.data) == null ? void 0 : _b2.results.length) > 0) {
      return (_c2 = baselineQuery.data) == null ? void 0 : _c2.results[0]._id;
    }
    return null;
  }, [JSON.stringify((_a = baselineQuery.data) == null ? void 0 : _a.results)]);
  react.exports.useEffect(() => {
    const initMV = async () => {
      var _a2, _b2, _c2, _d;
      fabric$1.fabric.Object.prototype.objectCaching = false;
      const baselineImgSrc = `${config.baseUri}/snapshoots/${(_a2 = check == null ? void 0 : check.baselineId) == null ? void 0 : _a2.filename}?expectedImg`;
      const baselineImg = await createImageAndWaitForLoad(baselineImgSrc);
      const actual = check.actualSnapshotId || null;
      const actualImgSrc = `${config.baseUri}/snapshoots/${(_b2 = check == null ? void 0 : check.actualSnapshotId) == null ? void 0 : _b2.filename}?actualImg`;
      const actualImg = await createImageAndWaitForLoad(actualImgSrc);
      document.getElementById("snapshoot").style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;
      const expectedImage = await imageFromUrl(baselineImg.src);
      const actualImage = await imageFromUrl(actualImg.src);
      const diffImgSrc = `${config.baseUri}/snapshoots/${(_c2 = check == null ? void 0 : check.diffId) == null ? void 0 : _c2.filename}?diffImg`;
      const diffImage = ((_d = check == null ? void 0 : check.diffId) == null ? void 0 : _d.filename) ? await imageFromUrl(diffImgSrc) : null;
      await setMainView((prev) => {
        if (prev)
          return prev;
        const MV = new MainView({
          canvasId: "2d",
          canvasElementWidth: document.getElementById("snapshoot").clientWidth,
          canvasElementHeight: document.getElementById("snapshoot").clientHeight,
          expectedImage,
          actualImage,
          diffImage,
          actual
        });
        window.mainView = MV;
        return MV;
      });
    };
    initMV();
  }, []);
  react.exports.useEffect(function afterMainViewCreatedHandleRegions() {
    if (!baselineId)
      return;
    if (mainView2) {
      mainView2.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineId);
    }
  }, [JSON.stringify((_b = baselineQuery.data) == null ? void 0 : _b.results), mainView2 == null ? void 0 : mainView2.toString()]);
  const calculateMaxImagesDimensions = () => {
    const data = [{
      imageName: "expectedImage",
      dimension: "width",
      value: mainView2.expectedImage.width
    }, {
      imageName: "expectedImage",
      dimension: "height",
      value: mainView2.expectedImage.height
    }, {
      imageName: "actualImage",
      dimension: "width",
      value: mainView2.actualImage.width
    }, {
      imageName: "actualImage",
      dimension: "height",
      value: mainView2.actualImage.height
    }];
    const biggestDimensionValue = Math.max(...data.map((x2) => x2.value));
    const result = data.find((x2) => x2.value === biggestDimensionValue);
    return result;
  };
  const zoomTo = (image, dimension) => {
    console.log({
      image
    });
    console.log({
      dimension
    });
    const ratio = mainView2.canvas[dimension] / image[dimension];
    const percent = ratio > 9 ? 900 : ratio * 100;
    zoomByPercent(percent);
    mainView2.canvas.renderAll();
  };
  const fitGreatestImageIfNeeded = () => {
    const greatestImage = calculateMaxImagesDimensions();
    zoomTo(mainView2[greatestImage.imageName], greatestImage.dimension);
    const anotherDimension = greatestImage.dimension === "height" ? "width" : "height";
    if (mainView2[greatestImage.imageName][anotherDimension] > mainView2.canvas[anotherDimension]) {
      zoomTo(mainView2[greatestImage.imageName], anotherDimension);
    }
    setTimeout(() => {
      mainView2.panToCanvasWidthCenter(greatestImage.imageName);
    }, 10);
  };
  const fitImageIfNeeded = (imageName) => {
    const image = mainView2[imageName];
    const greatestDimension = image.height > image.width ? "height" : "width";
    const anotherDimension = greatestDimension === "height" ? "width" : "height";
    zoomTo(image, greatestDimension);
    if (mainView2[imageName][anotherDimension] > mainView2.canvas[anotherDimension]) {
      zoomTo(mainView2[imageName], anotherDimension);
    }
    setTimeout(() => {
      mainView2.panToCanvasWidthCenter(imageName);
    }, 10);
  };
  const fitImageByWith = (imageName) => {
    const image = mainView2[imageName];
    zoomTo(image, "width");
    setTimeout(() => {
      mainView2.panToCanvasWidthCenter(imageName);
    }, 10);
  };
  react.exports.useEffect(function afterMainViewCreated() {
    if (mainView2) {
      zoomEvents();
      fitGreatestImageIfNeeded();
    }
  }, [mainView2 == null ? void 0 : mainView2.toString()]);
  const [view, setView] = react.exports.useState("actual");
  react.exports.useEffect(() => {
    if (mainView2) {
      mainView2.switchView(view);
    }
  }, [view]);
  let viewSegmentData = [{
    label: /* @__PURE__ */ jsxs(Group, {
      position: "left",
      spacing: 4,
      noWrap: true,
      children: [/* @__PURE__ */ jsx(Cbe, {
        stroke: 1,
        size: 18
      }), "Actual"]
    }),
    value: "actual"
  }, {
    label: /* @__PURE__ */ jsxs(Group, {
      position: "left",
      spacing: 4,
      noWrap: true,
      children: [/* @__PURE__ */ jsx(Pbe, {
        stroke: 1,
        size: 18
      }), "Expected"]
    }),
    value: "expected"
  }];
  if ((_c = check == null ? void 0 : check.diffId) == null ? void 0 : _c.filename) {
    viewSegmentData = [...viewSegmentData, {
      label: /* @__PURE__ */ jsxs(Group, {
        position: "left",
        spacing: 4,
        noWrap: true,
        children: [/* @__PURE__ */ jsx(pi, {
          stroke: 1,
          size: 18
        }), "Difference"]
      }),
      value: "diff"
    }, {
      label: /* @__PURE__ */ jsxs(Group, {
        position: "left",
        spacing: 4,
        noWrap: true,
        children: [/* @__PURE__ */ jsx(Lbe, {
          stroke: 1,
          size: 18
        }), "Slider"]
      }),
      value: "slider"
    }];
  }
  return /* @__PURE__ */ jsxs(Stack, {
    children: [/* @__PURE__ */ jsxs(Group, {
      position: "apart",
      children: [/* @__PURE__ */ jsx(Group, {}), /* @__PURE__ */ jsxs(Group, {
        spacing: "sm",
        children: [/* @__PURE__ */ jsxs(Group, {
          spacing: 4,
          position: "center",
          align: "center",
          children: [/* @__PURE__ */ jsx(ActionIcon, {
            title: "Zoom in",
            onClick: () => zoomByDelta(15),
            children: /* @__PURE__ */ jsx(lDe, {
              size: 24,
              stroke: 1
            })
          }), /* @__PURE__ */ jsxs(Popover, {
            width: 130,
            position: "bottom",
            withArrow: true,
            shadow: "md",
            opened: openedZoomPopover,
            children: [/* @__PURE__ */ jsx(Popover.Target, {
              children: /* @__PURE__ */ jsxs(Group, {
                spacing: 0,
                position: "center",
                onClick: zoomPopoverHandler.toggle,
                children: [/* @__PURE__ */ jsxs(Text, {
                  size: "lg",
                  weight: 400,
                  sx: {
                    minWidth: "3em"
                  },
                  children: [Math.round(zoomPercent), "%"]
                }), /* @__PURE__ */ jsx(ActionIcon, {
                  ml: -10,
                  children: /* @__PURE__ */ jsx(Pj, {})
                })]
              })
            }), /* @__PURE__ */ jsx(Popover.Dropdown, {
              p: 0,
              children: /* @__PURE__ */ jsxs(Stack, {
                spacing: 0,
                children: [/* @__PURE__ */ jsx(Button, {
                  variant: "subtle",
                  onClick: () => {
                    zoomByPercent(50);
                    console.log(mainView2[`${view}Image`]);
                    mainView2.panToCanvasWidthCenter(`${view}Image`);
                    zoomPopoverHandler.close();
                  },
                  children: "50%"
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "subtle",
                  onClick: () => {
                    zoomByPercent(100);
                    mainView2.panToCanvasWidthCenter(`${view}Image`);
                    zoomPopoverHandler.close();
                  },
                  children: "100%"
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "subtle",
                  onClick: () => {
                    zoomByPercent(200);
                    mainView2.panToCanvasWidthCenter(`${view}Image`);
                    zoomPopoverHandler.close();
                  },
                  children: "200%"
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "subtle",
                  onClick: () => {
                    zoomPopoverHandler.close();
                    console.log({
                      view
                    });
                    if (view === "slider") {
                      fitImageByWith("actualImage");
                      return;
                    }
                    fitImageByWith(`${view}Image`);
                  },
                  children: "Fit by width"
                }), /* @__PURE__ */ jsx(Button, {
                  variant: "subtle",
                  onClick: () => {
                    fitImageIfNeeded(`${view}Image`);
                    zoomPopoverHandler.close();
                  },
                  children: "Fit co canvas"
                })]
              })
            })]
          }), /* @__PURE__ */ jsx(ActionIcon, {
            title: "Zoom out",
            onClick: () => zoomByDelta(-15),
            children: /* @__PURE__ */ jsx(dDe, {
              size: 24,
              stroke: 1
            })
          })]
        }), /* @__PURE__ */ jsx(Divider, {
          orientation: "vertical"
        }), /* @__PURE__ */ jsx(SegmentedControl, {
          value: view,
          onChange: setView,
          data: viewSegmentData
        }), /* @__PURE__ */ jsx(Divider, {
          orientation: "vertical"
        }), /* @__PURE__ */ jsx(ActionIcon, {
          title: "Add ignore region",
          onClick: () => mainView2.addIgnoreRegion({
            name: "ignore_rect",
            strokeWidth: 0
          }),
          children: /* @__PURE__ */ jsx(DMe, {
            size: 24,
            stroke: 1
          })
        }), /* @__PURE__ */ jsx(ActionIcon, {
          onClick: () => MainView.sendIgnoreRegions(baselineId, mainView2.getRectData()),
          children: /* @__PURE__ */ jsx(qF, {
            size: 24,
            stroke: 1
          })
        }), /* @__PURE__ */ jsx(Divider, {
          orientation: "vertical"
        }), /* @__PURE__ */ jsx(AcceptButton, {
          check,
          checksQuery: checkQuery,
          size: 24,
          testUpdateQuery: firstPageQuery
        }), /* @__PURE__ */ jsx(RemoveButton, {
          check,
          checksQuery: checkQuery,
          size: 30,
          testUpdateQuery: firstPageQuery,
          closeHandler
        })]
      })]
    }), /* @__PURE__ */ jsx(Group, {
      children: /* @__PURE__ */ jsx(Paper, {
        shadow: "xl",
        withBorder: true,
        id: "snapshoot",
        style: {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[1],
          width: `${vWidth - 100}px`,
          height: `${vHeight - 150}px`
        },
        children: /* @__PURE__ */ jsx("canvas", {
          style: {
            width: "100%"
          },
          id: "2d"
        })
      })
    })]
  });
}
function CheckModal({
  firstPageQuery
}) {
  var _a;
  const {
    query,
    setQuery
  } = useParams();
  const [checksViewSize] = useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  const [checkModalOpened, checkModalHandlers] = useDisclosure(false);
  const closeHandler = () => {
    checkModalHandlers.close();
    setQuery({
      checkId: null
    });
  };
  const {
    checkId
  } = query;
  const checkQuery = useQuery(["check_for_modal", checkId], () => GenericService.get("checks", {
    _id: checkId
  }, {
    populate: "baselineId,actualSnapshotId,diffId,test,suite,app",
    limit: "1"
  }, "check_for_modal"), {
    enabled: checkModalOpened,
    refetchOnWindowFocus: false,
    onError: (e2) => {
      errorMsg({
        error: e2
      });
    }
  });
  const checkData = react.exports.useMemo(() => {
    var _a2;
    return (_a2 = checkQuery == null ? void 0 : checkQuery.data) == null ? void 0 : _a2.results[0];
  }, [JSON.stringify((_a = checkQuery == null ? void 0 : checkQuery.data) == null ? void 0 : _a.results)]);
  const theme = useMantineTheme();
  const iconsColor = react.exports.useMemo(() => theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[9], [theme.colorScheme]);
  const title = react.exports.useMemo(() => {
    if (checkData) {
      return /* @__PURE__ */ jsxs(Group, {
        position: "apart",
        children: [/* @__PURE__ */ jsx(Group, {
          position: "left",
          align: "center",
          spacing: "xs",
          sx: {
            position: "relative"
          },
          noWrap: true,
          children: /* @__PURE__ */ jsxs(Text, {
            children: [checkData.app.name, " / ", checkData.suite.name, " / ", checkData.test.name, " / ", checkData == null ? void 0 : checkData.name]
          })
        }), /* @__PURE__ */ jsxs(Group, {
          spacing: 8,
          children: [/* @__PURE__ */ jsxs(Group, {
            spacing: 4,
            children: [/* @__PURE__ */ jsxs(Group, {
              spacing: 2,
              children: [/* @__PURE__ */ jsx(ActionIcon, {
                variant: "light",
                size: 32,
                p: 4,
                children: /* @__PURE__ */ jsx(OsIcon, {
                  size: 20,
                  color: iconsColor,
                  os: checkData.os
                })
              }), /* @__PURE__ */ jsx(ActionIcon, {
                variant: "light",
                size: 32,
                p: 4,
                children: /* @__PURE__ */ jsx(BrowserIcon, {
                  size: 20,
                  color: iconsColor,
                  browser: checkData.browserName
                })
              })]
            }), /* @__PURE__ */ jsx(ViewPortLabel, {
              check: checkData,
              color: theme.colorScheme === "dark" ? "gray.2" : "gray.8",
              sizes,
              size: "lg",
              checksViewSize,
              fontSize: "14px"
            })]
          }), /* @__PURE__ */ jsx(Status$1, {
            size: "lg",
            check: checkData
          })]
        })]
      });
    }
    return "";
  }, [checkData == null ? void 0 : checkData._id]);
  react.exports.useEffect(function onCheckIdChange() {
    if (query.checkId) {
      checkModalHandlers.open();
    }
  }, [query.checkId]);
  return /* @__PURE__ */ jsxs(Modal, {
    opened: checkModalOpened,
    centered: true,
    title,
    size: "auto",
    onClose: closeHandler,
    sx: {
      marginTop: -25
    },
    styles: {
      title: {
        width: "100%",
        paddingRight: 35
      }
    },
    withCloseButton: false,
    children: [/* @__PURE__ */ jsx(ActionIcon, {
      style: {
        position: "fixed",
        right: 10,
        top: 10
      },
      onClick: () => {
        closeHandler();
        checkModalHandlers.close();
      },
      children: /* @__PURE__ */ jsx(lAe, {
        size: 32
      })
    }), checkQuery.isLoading ? /* @__PURE__ */ jsxs(Stack, {
      mt: 60,
      children: [/* @__PURE__ */ jsx(LoadingOverlay, {
        visible: true
      }), /* @__PURE__ */ jsx(Text, {
        children: "Loading the data"
      })]
    }) : checkQuery.isError ? /* @__PURE__ */ jsx(Stack, {
      mt: 40,
      children: /* @__PURE__ */ jsx(Text, {
        color: "red",
        children: "Error load the check data"
      })
    }) : checkData ? /* @__PURE__ */ jsx(CheckDetails, {
      check: checkData,
      checkQuery,
      firstPageQuery,
      closeHandler
    }) : /* @__PURE__ */ jsx(Group, {
      mt: 60,
      children: "Empty check data"
    })]
  });
}
function RemoveTestModalAsk({
  opened,
  setOpened,
  selection,
  setSelection,
  infinityQuery
}) {
  const mutationRemoveTest = useMutation((data) => TestsService.removeTest(data), {
    onSuccess: async () => {
      successMsg({
        message: "Test has been successfully removed"
      });
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot remove the Test"
      });
      log.error(e2);
    }
  });
  const asyncMutations = [];
  const handleRemoveButtonClick = async () => {
    for (const id of selection) {
      asyncMutations.push(mutationRemoveTest.mutateAsync({
        id
      }));
    }
    await Promise.all(asyncMutations);
    setSelection(() => []);
    infinityQuery.refetch();
    setOpened(false);
  };
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => setOpened(false),
    title: "Remove selected tests?",
    children: [/* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: "Are you sure you want to permanently delete the selected tests?"
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      children: [/* @__PURE__ */ jsx(Button, {
        color: "red",
        onClick: async () => {
          await handleRemoveButtonClick();
        },
        children: "Remove"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: () => setOpened(false),
        children: "Cancel"
      })]
    })]
  });
}
function RemoveTestsButton({
  selection,
  setSelection,
  infinityQuery
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = react.exports.useState(false);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Transition, {
      mounted: selection.length > 0,
      transition: "fade",
      duration: 400,
      timingFunction: "ease",
      children: (styles) => /* @__PURE__ */ jsx(ActionIcon, {
        color: theme.colorScheme === "dark" ? "green.8" : "green.6",
        "data-test": "table-remove-tests",
        variant: "subtle",
        onClick: async () => {
          setOpened(true);
        },
        style: styles,
        children: /* @__PURE__ */ jsx(rWe, {
          size: 24,
          stroke: 1
        })
      })
    }), /* @__PURE__ */ jsx(RemoveTestModalAsk, {
      opened,
      setOpened,
      selection,
      infinityQuery,
      setSelection
    })]
  });
}
function AcceptTestModalAsk({
  opened,
  setOpened,
  selection,
  setSelection,
  infinityQuery
}) {
  const mutationAcceptTest = useMutation((data) => TestsService.acceptTest(data), {
    onSuccess: async () => {
      successMsg({
        message: "Test has been successfully accepted"
      });
    },
    onError: (e2) => {
      errorMsg({
        error: "Cannot accept the Test"
      });
      log.error(e2);
    }
  });
  const asyncMutations = [];
  const handleAcceptButtonClick = async () => {
    for (const id of selection) {
      asyncMutations.push(mutationAcceptTest.mutateAsync({
        id
      }));
    }
    await Promise.all(asyncMutations);
    setSelection(() => []);
    infinityQuery.refetch();
    setOpened(false);
  };
  return /* @__PURE__ */ jsxs(Modal, {
    opened,
    onClose: () => setOpened(false),
    title: "Accept selected tests?",
    children: [/* @__PURE__ */ jsx(Text, {
      size: "sm",
      children: "Are you sure you want to accept the selected tests?"
    }), /* @__PURE__ */ jsxs(Group, {
      position: "right",
      children: [/* @__PURE__ */ jsx(Button, {
        onClick: async () => {
          await handleAcceptButtonClick();
        },
        children: "Accept"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: () => setOpened(false),
        children: "Cancel"
      })]
    })]
  });
}
function AcceptTestsButton({
  selection,
  setSelection,
  infinityQuery
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = react.exports.useState(false);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Transition, {
      mounted: selection.length > 0,
      transition: "fade",
      duration: 400,
      timingFunction: "ease",
      children: (styles) => /* @__PURE__ */ jsx(ActionIcon, {
        color: theme.colorScheme === "dark" ? "green.8" : "green.6",
        "data-test": "table-accept-tests",
        variant: "subtle",
        onClick: async () => {
          setOpened(true);
        },
        style: styles,
        children: /* @__PURE__ */ jsx(LHe, {
          size: 24,
          stroke: 1
        })
      })
    }), /* @__PURE__ */ jsx(AcceptTestModalAsk, {
      opened,
      setOpened,
      selection,
      infinityQuery,
      setSelection
    })]
  });
}
const useStyles = createStyles(testsCreateStyle);
function TestsTable({
  infinityQuery,
  firstPageQuery,
  visibleFields
}) {
  var _a, _b, _c, _d;
  const {
    updateToolbar
  } = react.exports.useContext(AppContext);
  const {
    data
  } = infinityQuery;
  const flatData = data ? data.pages.flat().map((x2) => x2.results).flat() : [];
  const [scrolled, setScrolled] = react.exports.useState(false);
  const {
    classes,
    cx
  } = useStyles();
  const [selection, setSelection] = react.exports.useState([]);
  const scrollAreaRef = react.exports.useRef(null);
  const toggleAllRows = () => setSelection((current) => current.length === flatData.length ? [] : flatData.map((item) => item.id));
  react.exports.useEffect(() => {
    updateToolbar(/* @__PURE__ */ jsx(RemoveTestsButton, {
      selection,
      setSelection,
      infinityQuery
    }), 31);
    updateToolbar(/* @__PURE__ */ jsx(AcceptTestsButton, {
      selection,
      setSelection,
      infinityQuery
    }), 32);
  }, [selection.length]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(ScrollArea.Autosize, {
      "data-test": "table-scroll-area",
      ref: scrollAreaRef,
      maxHeight: "100vh",
      sx: {
        width: "100%"
      },
      pb: 24,
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
        children: [
          /* @__PURE__ */ jsx("thead", {
            style: {
              zIndex: 10
            },
            className: cx(classes.header, {
              [classes.scrolled]: scrolled
            }),
            children: /* @__PURE__ */ jsx(Heads, {
              data,
              toggleAllRows,
              selection,
              visibleFields
            })
          }),
          infinityQuery.isLoading ? /* @__PURE__ */ jsx(InfinityScrollSkeleton, {
            infinityQuery: null,
            visibleFields
          }) : infinityQuery.isError ? /* @__PURE__ */ jsxs(Text, {
            color: "red",
            children: ["Error:", infinityQuery.error.message]
          }) : /* @__PURE__ */ jsx("tbody", {
            className: classes.tableBody,
            children: /* @__PURE__ */ jsx(Rows, {
              infinityQuery,
              selection,
              setSelection,
              visibleFields
            })
          }),
          /* @__PURE__ */ jsx(InfinityScrollSkeleton, {
            infinityQuery,
            visibleFields
          })
        ]
      })
    }), /* @__PURE__ */ jsx(PagesCountAffix, {
      loaded: (_b = (_a = infinityQuery.data) == null ? void 0 : _a.pages) == null ? void 0 : _b.length.toString(),
      total: ((_c = infinityQuery.data) == null ? void 0 : _c.pages) && ((_d = infinityQuery.data) == null ? void 0 : _d.pages[0].totalPages),
      scrollAreaRef
    }), /* @__PURE__ */ jsx(CheckModal, {
      firstPageQuery
    })]
  });
}
function Settings({
  open,
  setSortOpen,
  visibleFields,
  setVisibleFields,
  searchParams,
  setSearchParams
}) {
  const [checksViewMode, setChecksViewMode] = useLocalStorage({
    key: "check-view-mode",
    defaultValue: "bounded"
  });
  const [checksViewSize, setChecksViewSize] = useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  const [sortOrder, toggleSortOrder] = useToggle(["desc", "asc"]);
  const [selectOptionsData] = react.exports.useState(() => Object.keys(tableColumns).map((column) => ({
    value: column,
    label: tableColumns[column].label
  })));
  const [sortItemValue, setSortItemValue] = useInputState("startDate");
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
        children: sortOrder === "desc" ? /* @__PURE__ */ jsx(rze, {
          stroke: 1
        }) : /* @__PURE__ */ jsx(Xfe, {
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
      children: Object.keys(tableColumns).map((column) => /* @__PURE__ */ jsx(Chip, {
        value: column,
        "data-test": `settings-visible-columns-${tableColumns[column].label}`,
        children: tableColumns[column].label
      }, column))
    }), /* @__PURE__ */ jsx(Text, {
      mt: "md",
      weight: 500,
      pb: "xs",
      children: "Appearance of Checks"
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      children: /* @__PURE__ */ jsx(SegmentedControl, {
        data: ["bounded", "normal", "list"],
        value: checksViewMode,
        onChange: setChecksViewMode
      })
    }), /* @__PURE__ */ jsx(Group, {
      position: "center",
      mt: "md",
      children: /* @__PURE__ */ jsx(SegmentedControl, {
        data: ["small", "medium", "large", "xlarge"],
        value: checksViewSize,
        onChange: setChecksViewSize
      })
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
function Filter({
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
    const filterValue = (x2) => Object.values(Object.values(x2)[0])[0];
    const mainGroupRootRules = Object.values(groupsData["mainGroup"].rules).filter((x2) => filterValue(x2));
    const mainGroupRules = [...mainGroupRootRules, ...Object.keys(groupsData).filter((x2) => x2 !== "mainGroup").map((groupKey) => {
      const groupRules = Object.values(groupsData[groupKey]["rules"]).filter((x2) => filterValue(x2));
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
  const groups = Object.keys(groupsData).filter((x2) => x2 !== "mainGroup").map((key, index) => /* @__PURE__ */ jsx(LogicalGroup, {
    testAttr: `filter-group-${index}`,
    fields: tableColumns,
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
            fields: tableColumns,
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
function Tests() {
  var _a;
  const {
    updateToolbar
  } = react.exports.useContext(AppContext);
  const {
    query
  } = useParams();
  const theme = useMantineTheme();
  useSubpageEffect("Test Results");
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOpen, setSortOpen] = react.exports.useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = react.exports.useState(false);
  const baseFilter = query.base_filter ? query.base_filter : {};
  if (query.app)
    baseFilter.app = {
      $oid: (query == null ? void 0 : query.app) || ""
    };
  const {
    firstPageQuery,
    infinityQuery,
    newestItemsQuery
  } = useInfinityScroll({
    baseFilterObj: baseFilter,
    filterObj: query.filter,
    resourceName: "tests",
    newestItemsFilterKey: "startDate",
    sortBy: query.sortBy || ""
  });
  useNavProgressFetchEffect(infinityQuery.isFetching);
  const [visibleFields, setVisibleFields] = useLocalStorage({
    key: "visibleFields",
    defaultValue: ["_id", "name", "status", "creatorUsername", "markedAs", "startDate", "browserName", "os", "viewport"]
  });
  react.exports.useEffect(() => {
    firstPageQuery.refetch();
    updateToolbar(/* @__PURE__ */ jsx(ActionIcon, {
      title: "Table settings, sorting, and columns visibility",
      color: theme.colorScheme === "dark" ? "green.8" : "green.6",
      "data-test": "table-sorting",
      variant: "subtle",
      onClick: () => {
        setSortOpen((prev) => !prev);
      },
      children: /* @__PURE__ */ jsx(Y, {
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
      children: /* @__PURE__ */ jsx(zV, {
        size: 24,
        stroke: 1
      })
    }), 47);
  }, []);
  react.exports.useEffect(() => {
    updateToolbar(/* @__PURE__ */ jsx(RefreshActionIcon, {
      newestItemsQuery,
      firstPageQuery,
      infinityQuery
    }, "reload"), 52);
  }, [(_a = newestItemsQuery == null ? void 0 : newestItemsQuery.data) == null ? void 0 : _a.results.length, newestItemsQuery.status, theme.colorScheme]);
  react.exports.useEffect(() => {
    firstPageQuery.refetch();
  }, [query.base_filter, query.filter, query.app, query.sortBy]);
  return /* @__PURE__ */ jsxs(Group, {
    position: "apart",
    align: "start",
    noWrap: true,
    children: [/* @__PURE__ */ jsx(TestsTable, {
      firstPageQuery,
      infinityQuery,
      visibleFields
    }), /* @__PURE__ */ jsx(Settings, {
      open: sortOpen,
      setSortOpen,
      visibleFields,
      setVisibleFields,
      searchParams,
      setSearchParams
    }), /* @__PURE__ */ jsx(Filter, {
      open: isFilterDrawerOpen,
      setOpen: setIsFilterDrawerOpen,
      searchParams,
      setSearchParams
    })]
  });
}
function IndexLayout() {
  return /* @__PURE__ */ jsxs(AppShell, {
    padding: 8,
    navbar: /* @__PURE__ */ jsx(IndexNavbar, {}),
    header: /* @__PURE__ */ jsx(IndexHeader, {}),
    styles: (theme) => ({
      main: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
      }
    }),
    children: [/* @__PURE__ */ jsx(ReactQueryDevtools, {
      initialIsOpen: false
    }), /* @__PURE__ */ jsx(Paper, {
      children: /* @__PURE__ */ jsx(Tests, {})
    })]
  });
}
const queryClient = new QueryClient();
function App() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [appTitle, setAppTitle] = react.exports.useState("Syngrisi");
  const [breadCrumbs, setBreadCrumbs] = react.exports.useState([]);
  const [toolbar, setToolbar] = react.exports.useState([]);
  const [currentProject, setCurrentProject] = react.exports.useState("");
  const updateToolbar = (newItem, index = 0) => {
    setToolbar((prevArr) => {
      const newArray = [...prevArr];
      newArray[index] = /* @__PURE__ */ jsx(react.exports.Fragment, {
        children: newItem
      }, index);
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
    setBreadCrumbs,
    currentProject,
    setCurrentProject
  }), [appTitle, toolbar, JSON.stringify(breadCrumbs), currentProject]);
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
            searchIcon: /* @__PURE__ */ jsx(Dge, {
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
                    path: "/index2/*",
                    element: /* @__PURE__ */ jsx(IndexLayout, {})
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
  children: /* @__PURE__ */ jsx(ErrorBoundary, {
    FallbackComponent: ErrorFallback,
    onReset: () => {
    },
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
  })
}));
