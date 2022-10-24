import { r as react, Y as useWindowEvent, Z as queryString, k as ky, a as config, d as useMantineTheme, b as jsx, y as useLocalStorage, u as useQuery, j as jsxs, e as Container, G as Group, T as Text, g as Button, _ as Dge, P as Paper, c as createStyles, l as log, $ as Fragment, a0 as Stack, a1 as Tooltip, s as ActionIcon, a2 as CK, q as Checkbox, a3 as React, L as Transition, a4 as Xfe, a5 as rze, m as lAe, p as TextInput, O as Loader, a6 as zV, a7 as ea, a8 as Epe, A as Anchor, a9 as Ol, aa as ua, ab as RX, ac as rWe, ad as LHe, B as Box, n as useSearchParams, ae as Y, Q as QueryClient, f as useDocumentTitle, af as useNavigate, E as QueryClientProvider, F as ColorSchemeProvider, M as MantineProvider, ag as Routes, ah as Route, H as createRoot, I as BrowserRouter } from "./use-form.e9a99b2c.js";
import { u as useQueryParams, S as StringParam, J as JsonParam, a as useColorScheme, b as useDisclosure, l as links, H as Header, B as Burger, c as HeaderLogo, d as SafeSelect, o as openSpotlight, K as Kbd, U as UserMenu, T as ToggleThemeButton, e as Breadcrumbs, f as errorMsg, G as GenericService, i as isDark, g as useMutation, s as successMsg, M as Modal, L as List, R as RingProgress, P as Popover, h as Skeleton, j as useInView, F as FocusTrap, k as escapeRegExp, m as useToggle, n as useInfinityScroll, N as Navbar, p as ScrollArea, q as getNavigationItem, r as stopNavigationProgress, t as resetNavigationProgress, v as Badge, A as Affix, w as ActionPopoverIcon, I as Image, C as Card, x as Collapse, y as Table, z as useInputState, D as RelativeDrawer, E as Chip, O as SegmentedControl, Q as LogicalGroup, V as uuid, W as useNavProgressFetchEffect, X as AppShell, Y as ReactQueryDevtools, Z as navigationData, _ as SpotlightProvider, $ as NotificationsProvider, a0 as NavigationProgress, a1 as ModalsProvider, a2 as QueryParamProvider, a3 as ReactRouter6Adapter } from "./LogicalGroup.ec45ea49.js";
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
    } catch (e) {
      throw new Error(`cannot accept check: '${JSON.stringify(check, null, "/t")}',
baseline: '${newBaselineId}', error: '${e}'}`);
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
    } catch (e) {
      throw new Error(`Cannot remove check: '${id}', error: '${e}'`);
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
    } catch (e) {
      throw new Error(`Cannot remove run: '${id}', error: '${e}'`);
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
    } catch (e) {
      throw new Error(`Cannot remove suite: '${id}', error: '${e}'`);
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
    } catch (e) {
      throw new Error(`Cannot remove test: '${id}', error: '${e}'`);
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
    } catch (e) {
      throw new Error(`Cannot accept test: '${id}', error: '${e}'`);
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
    onError: (e) => {
      errorMsg({
        error: e
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
    onError: (e) => {
      errorMsg({
        error: "Cannot remove the Run"
      });
      log.error(e);
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
function Run({
  item,
  index,
  classes,
  id,
  activeItemsHandler,
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
  const handlerItemClick = (e) => {
    if (!e.metaKey)
      activeItemsHandler.clear();
    activeItemsHandler.addOrRemove(id);
  };
  react.exports.useEffect(function onActiveItemsChange() {
    var _a;
    if (((_a = activeItemsHandler.get()) == null ? void 0 : _a.length) < 1) {
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
          noWrap: true,
          children: [/* @__PURE__ */ jsx(RingProgress, {
            sections: [{
              value: 100,
              color: "green"
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
    onError: (e) => {
      errorMsg({
        error: "Cannot remove the Suite"
      });
      log.error(e);
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
    children: Object.keys(new Array(num || 6).fill("")).map((x) => /* @__PURE__ */ jsx(React.Fragment, {
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
    }, x))
  });
}
function SimpleDummySkeleton() {
  return /* @__PURE__ */ jsx(Fragment, {
    children: Object.keys(new Array(6).fill("")).map((x) => /* @__PURE__ */ jsx(React.Fragment, {
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
    }, x))
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
        onChange: (e) => {
          setQuickFilter(e.currentTarget.value);
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
          return newItems.filter((x) => x !== item);
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
    headStyle: { width: "5%" },
    cellStyle: { width: "5%" },
    type: "DateFilter"
  },
  browserName: {
    label: "Browser",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "StringFilter"
  },
  os: {
    label: "Platform",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
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
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "StringFilter"
  },
  viewport: {
    label: "Viewport",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
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
    children: (infinityQuery === null || infinityQuery.hasNextPage) && Object.keys(new Array(6).fill("")).map((x) => /* @__PURE__ */ jsxs("tr", {
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
    }, x))
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
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __rest = globalThis && globalThis.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function Tree2Element(tree) {
  return tree && tree.map(function(node, i) {
    return React.createElement(node.tag, __assign({
      key: i
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
function TbQuestionMark(props) {
  return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24", "strokeWidth": "2", "stroke": "currentColor", "fill": "none", "strokeLinecap": "round", "strokeLinejoin": "round" }, "child": [{ "tag": "desc", "attr": {}, "child": [] }, { "tag": "path", "attr": { "stroke": "none", "d": "M0 0h24v24H0z", "fill": "none" } }, { "tag": "path", "attr": { "d": "M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" } }, { "tag": "line", "attr": { "x1": "12", "y1": "19", "x2": "12", "y2": "19.01" } }] })(props);
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
function BsHandThumbsUpFill(props) {
  return GenIcon({ "tag": "svg", "attr": { "fill": "currentColor", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" } }] })(props);
}
function BsHandThumbsUp(props) {
  return GenIcon({ "tag": "svg", "attr": { "fill": "currentColor", "viewBox": "0 0 16 16" }, "child": [{ "tag": "path", "attr": { "d": "M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" } }] })(props);
}
function AcceptButton({
  check,
  testUpdateQuery,
  checksQuery
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
      log.debug({
        result
      });
      checksQuery.refetch();
      testUpdateQuery.refetch();
    },
    onError: (e) => {
      errorMsg({
        error: "Cannot accept the check"
      });
      log.error(e);
    }
  });
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
      size: 19
    }) : /* @__PURE__ */ jsx(BsHandThumbsUp, {
      size: 19
    }),
    action: handleAcceptCheckClick,
    title: "Accept the check actual screenshot",
    loading: mutationAcceptCheck.isLoading,
    confirmLabel: "Accept"
  });
}
function RemoveButton({
  checksQuery,
  testUpdateQuery,
  check
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
      testUpdateQuery.refetch();
    },
    onError: (e) => {
      errorMsg({
        error: "Cannot remove the check"
      });
      log.error(e);
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
      size: 24
    }),
    action: handleRemoveCheckClick,
    title: "Delete check",
    loading: mutationRemoveCheck.isLoading,
    confirmLabel: "Delete"
  });
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
  const [checksViewSize, setChecksViewSize] = useLocalStorage({
    key: "check-view-size",
    defaultValue: "medium"
  });
  const sizes = {
    small: {
      coefficient: 0.5,
      statusBadge: "xs",
      viewportText: "xs"
    },
    medium: {
      coefficient: 0.8,
      statusBadge: "sm",
      viewportText: "xs"
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
  const imageWeight = 24 * sizes[checksViewSize].coefficient;
  osIconMap(check.os);
  browserIconMap(check.browserName);
  const theme = useMantineTheme();
  const statusColor = (status) => {
    const map = {
      new: "blue",
      passed: "green",
      failed: "red"
    };
    return map[status] || "gray";
  };
  const imageFilename = ((_a = check.diffId) == null ? void 0 : _a.filename) || ((_b = check.actualSnapshotId) == null ? void 0 : _b.filename) || ((_c = check.baselineId) == null ? void 0 : _c.filename);
  const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;
  const linkToCheckOverlay = `/index2?${queryString.stringify({
    ...query,
    checkId: check._id
  })}`;
  const handlePreviewLinkClick = (e) => {
    if (!e.metaKey) {
      e.preventDefault();
    }
  };
  const handlePreviewImageClick = (e) => {
    if (!e.metaKey) {
      setQuery({
        checkId: check._id
      });
    }
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
        children: /* @__PURE__ */ jsx(Image, {
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
        children: [/* @__PURE__ */ jsx(Badge, {
          color: statusColor(check.status),
          variant: "light",
          size: "md",
          title: "Check status",
          children: check.status
        }), /* @__PURE__ */ jsx(Text, {
          color: "dimmed",
          weight: 500,
          size: 14,
          title: "Screen Viewport",
          children: check.viewport
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
      pb: 4,
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
            children: /* @__PURE__ */ jsx(Image, {
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
        position: "center",
        mt: "xs",
        mb: "xs",
        spacing: "xs",
        noWrap: true,
        children: [/* @__PURE__ */ jsx(Badge, {
          color: statusColor(check.status),
          variant: "light",
          size: sizes[checksViewSize].statusBadge,
          title: "Check status",
          children: check.status
        }), /* @__PURE__ */ jsx(Text, {
          color: "dimmed",
          weight: 500,
          size: sizes[checksViewSize].viewportText,
          title: "Screen Viewport",
          children: check.viewport
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
    onError: (e) => {
      errorMsg({
        error: e
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
const logLevelColorMap = {
  debug: "blue",
  info: "green",
  warn: "orange",
  error: "red"
};
const useStyles$1 = createStyles(testsCreateStyle);
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
    onError: (e) => {
      errorMsg({
        error: e
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
        if (column === "level") {
          return /* @__PURE__ */ jsx("td", {
            title: test.level,
            "data-test": `table-row-${tableColumns[column].label}`,
            style: {
              ...tableColumns[column].cellStyle,
              paddingLeft: "2px"
            },
            children: /* @__PURE__ */ jsx(RingProgress, {
              sections: [{
                value: 100,
                color: logLevelColorMap[test.level]
              }],
              size: 48
            })
          }, column);
        }
        return /* @__PURE__ */ jsx("td", {
          "data-test": `table-row-${tableColumns[column].label}`,
          style: {
            ...tableColumns[column].cellStyle
          },
          children: /* @__PURE__ */ jsx(Tooltip, {
            label: test[column],
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
function CheckModal() {
  const {
    query,
    setQuery
  } = useParams();
  const {
    height: vHeight,
    width: vWidth
  } = useViewportSize();
  const [checkModalOpened, checkModalHandlers] = useDisclosure(false);
  const closeHandler = () => {
    checkModalHandlers.close();
    setQuery({
      checkId: null
    });
  };
  react.exports.useEffect(function onCheckIdChange() {
    if (query.checkId) {
      checkModalHandlers.open();
    }
  }, [query.checkId]);
  const iframeSrc = query.checkId ? `/checkview?id=${query.checkId}` : "";
  return /* @__PURE__ */ jsx(Modal, {
    opened: checkModalOpened,
    centered: true,
    size: "auto",
    onClose: closeHandler,
    sx: {
      marginTop: -25
    },
    children: /* @__PURE__ */ jsx("iframe", {
      title: "check view",
      width: `${vWidth - 100}px`,
      height: `${vHeight - 150}px`,
      src: iframeSrc,
      frameBorder: "0"
    })
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
    onError: (e) => {
      errorMsg({
        error: "Cannot remove the Test"
      });
      log.error(e);
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
    onError: (e) => {
      errorMsg({
        error: "Cannot accept the Test"
      });
      log.error(e);
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
  const flatData = data ? data.pages.flat().map((x) => x.results).flat() : [];
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
    }), /* @__PURE__ */ jsx(CheckModal, {})]
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
    const filterValue = (x) => Object.values(Object.values(x)[0])[0];
    const mainGroupRootRules = Object.values(groupsData["mainGroup"].rules).filter((x) => filterValue(x));
    const mainGroupRules = [...mainGroupRootRules, ...Object.keys(groupsData).filter((x) => x !== "mainGroup").map((groupKey) => {
      const groupRules = Object.values(groupsData[groupKey]["rules"]).filter((x) => filterValue(x));
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
  const groups = Object.keys(groupsData).filter((x) => x !== "mainGroup").map((key, index) => /* @__PURE__ */ jsx(LogicalGroup, {
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
