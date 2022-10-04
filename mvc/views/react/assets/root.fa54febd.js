import { r as react, Y as queryString, d as useMantineTheme, V as useDisclosure, b as jsx, w as useLocalStorage, u as useQuery, j as jsxs, e as Container, G as Group, T as Text, h as Button, Z as Aae, P as Paper, c as createStyles, q as Checkbox, _ as Stack, $ as Tooltip, s as ActionIcon, a0 as ji, m as aze, a1 as Ahe, a2 as Uhe, n as useSearchParams, a3 as sJ, K as Transition, p as TextInput, L as Loader, A as Anchor, a4 as Fragment, a5 as Xne, a6 as hl, a7 as Ti, a8 as zK, a9 as React, B as Box, aa as J, Q as QueryClient, f as useDocumentTitle, ab as useNavigate, y as QueryClientProvider, E as ColorSchemeProvider, M as MantineProvider, ac as Routes, ad as Route, F as createRoot, H as BrowserRouter } from "./use-form.7eb764b8.js";
import { u as useQueryParams, S as StringParam, J as JsonParam, a as useColorScheme, l as links, H as Header, B as Burger, b as HeaderLogo, c as SafeSelect, o as openSpotlight, K as Kbd, U as UserMenu, T as ToggleThemeButton, d as Breadcrumbs, e as errorMsg, G as GenericService, i as isDark, L as List, R as RingProgress, f as useInView, g as Skeleton, P as Popover, h as escapeRegExp, j as useToggle, k as useInfinityScroll, N as Navbar, m as ScrollArea, F as FocusTrap, n as getNavigationItem, s as stopNavigationProgress, r as resetNavigationProgress, p as Badge, A as Affix, C as Collapse, q as Table, t as useInputState, v as RelativeDrawer, w as Chip, x as LogicalGroup, y as uuid, z as useNavProgressFetchEffect, D as AppShell, E as ReactQueryDevtools, I as navigationData, M as SpotlightProvider, O as NotificationsProvider, Q as NavigationProgress, V as ModalsProvider, W as QueryParamProvider, X as ReactRouter6Adapter } from "./LogicalGroup.4cfb7bb6.js";
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
function useParams() {
  const [query, setQuery] = useQueryParams({
    groupBy: StringParam,
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
    updateQueryJsonParam
  } = useParams();
  react.exports.useEffect(() => {
    updateQueryJsonParam("base_filter", "app", currentProjectLS);
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
            searchable: true,
            placeholder: "Enter Project Name",
            variant: "unstiled",
            "data-test": "current_project",
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
            value: currentProjectLS,
            clearable: true,
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
function Runs({
  item,
  selected,
  toggleRowSelection,
  index,
  classes,
  id,
  activeItem,
  setActiveItem
}) {
  const {
    updateQueryJsonParam
  } = useParams();
  const handlerItemClick = (event) => {
    setActiveItem(() => id);
    updateQueryJsonParam("base_filter", "run", id);
  };
  return /* @__PURE__ */ jsx(List.Item, {
    "data-test": `navbar_item_${index}`,
    onClick: handlerItemClick,
    className: `${classes.navbarItem} ${activeItem === id && classes.activeNavbarItem}`,
    style: {
      cursor: "pointer"
    },
    children: /* @__PURE__ */ jsxs(Group, {
      noWrap: true,
      p: 4,
      position: "apart",
      spacing: 0,
      children: [/* @__PURE__ */ jsxs(Group, {
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
          onClick: (event) => event.stopPropagation()
        }), /* @__PURE__ */ jsxs(Stack, {
          spacing: 0,
          style: {
            width: "100%"
          },
          children: [/* @__PURE__ */ jsx(Tooltip, {
            label: item.name,
            multiline: true,
            children: /* @__PURE__ */ jsx(Text, {
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
            children: "3 hous ago"
          })]
        })]
      }), /* @__PURE__ */ jsx(RingProgress, {
        sections: [{
          value: 100,
          color: "green"
        }],
        size: 48
      })]
    })
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
  groupByValue
}) {
  const {
    classes
  } = useStyles$3();
  const [selection, setSelection] = react.exports.useState([]);
  const [activeItem, setActiveItem] = react.exports.useState("");
  const toggleRowSelection = (id) => setSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  react.exports.useEffect(function onSelectionChange() {
  }, [selection.length]);
  const transformResourceToFCName = (value) => {
    const transformMap = {
      runs: Runs,
      suites: Simple
    };
    return transformMap[value] ? transformMap[value] : Simple;
  };
  return infinityQuery.data ? infinityQuery.data.pages.map((page) => page.results.map((item, index) => {
    const selected = selection.includes(item._id);
    const Item = transformResourceToFCName(groupByValue);
    return /* @__PURE__ */ jsx(react.exports.Fragment, {
      children: /* @__PURE__ */ jsx(Item, {
        id: item._id,
        activeItem,
        setActiveItem,
        item,
        selected,
        toggleRowSelection,
        index,
        classes
      })
    }, item._id);
  })) : [];
}
const InfinityScrollSkeleton$1 = ({
  infinityQuery,
  itemType = "runs"
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
  return /* @__PURE__ */ jsx(List, {
    ref,
    listStyleType: "none",
    children: infinityQuery.hasNextPage && Object.keys(new Array(6).fill("")).map((x) => /* @__PURE__ */ jsx(List.Item, {
      style: {
        height: 72
      },
      children: /* @__PURE__ */ jsx(Skeleton, {
        height: 20,
        radius: "sm"
      })
    }, x))
  });
};
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
function SortPopover({
  groupBy,
  sortOpened,
  setSortOpened,
  sortBy,
  setSortBy,
  setSortOrder,
  sortOrder
}) {
  return /* @__PURE__ */ jsxs(Popover, {
    opened: sortOpened,
    onChange: setSortOpened,
    shadow: "md",
    position: "bottom-end",
    children: [/* @__PURE__ */ jsx(Popover.Target, {
      children: /* @__PURE__ */ jsx(ActionIcon, {
        title: "Sorting",
        mb: 4,
        onClick: () => setSortOpened((o) => !o),
        children: /* @__PURE__ */ jsx(ji, {
          stroke: 1
        })
      })
    }), /* @__PURE__ */ jsxs(Popover.Dropdown, {
      children: [/* @__PURE__ */ jsx(Group, {
        position: "right",
        align: "start",
        sx: {
          width: "100%"
        },
        noWrap: true,
        children: /* @__PURE__ */ jsx(ActionIcon, {
          size: "sm",
          mr: -10,
          mt: -4,
          onClick: () => setSortOpened(false),
          children: /* @__PURE__ */ jsx(aze, {
            stroke: 1,
            size: 16
          })
        })
      }), /* @__PURE__ */ jsxs(Group, {
        align: "end",
        noWrap: true,
        children: [/* @__PURE__ */ jsx(SafeSelect, {
          label: "Sort by",
          "data-test": "navbar-sort-by-select",
          sx: {
            width: "230px"
          },
          value: sortBy,
          onChange: (value) => setSortBy(() => value),
          optionsData: sortOptionsData(groupBy)
        }), /* @__PURE__ */ jsx(ActionIcon, {
          title: "Sort Order",
          mb: 4,
          onClick: () => {
            if (sortOrder === "asc") {
              setSortOrder("desc");
              return;
            }
            setSortOrder("asc");
          },
          children: sortOrder === "asc" ? /* @__PURE__ */ jsx(Ahe, {
            stroke: 1
          }) : /* @__PURE__ */ jsx(Uhe, {
            stroke: 1
          })
        })]
      })]
    })]
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
  var _a, _b, _c;
  react.exports.useContext(AppContext);
  const {
    classes
  } = useStyles$2();
  useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOpened, setSortOpened] = react.exports.useState(false);
  const [sortBy, setSortBy] = react.exports.useState("createdDate");
  const [sortOrder, setSortOrder] = react.exports.useState("desc");
  const {
    query,
    setQuery
  } = useParams();
  const [groupByValue, setGroupByValue] = react.exports.useState(query.groupBy || "runs");
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
  const baseFilter = ((_a = query == null ? void 0 : query.base_filter) == null ? void 0 : _a.app) ? {
    app: {
      $oid: ((_b = query == null ? void 0 : query.base_filter) == null ? void 0 : _b.app) || ""
    },
    ...quickFilterObject
  } : {};
  const [openedFilter, toggleOpenedFilter] = useToggle([false, true]);
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
    filterObj: JSON.parse(searchParams.get("filter")),
    newestItemsFilterKey: getNewestFilter(groupByValue),
    baseFilterObj: baseFilter,
    sortBy: `${sortBy}:${sortOrder}`
  });
  react.exports.useEffect(function oneTime() {
    setQuery({
      groupBy: groupByValue
    });
    firstPageQuery.refetch();
  }, []);
  react.exports.useEffect(function onGroupByChange() {
    setQuery({
      groupBy: groupByValue
    });
  }, [groupByValue]);
  react.exports.useEffect(function refetch() {
    firstPageQuery.refetch();
  }, [query == null ? void 0 : query.groupBy, (_c = query == null ? void 0 : query.base_filter) == null ? void 0 : _c.app, JSON.stringify(quickFilterObject), `${sortBy}:${sortOrder}`]);
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
        pr: 16,
        children: [/* @__PURE__ */ jsxs(Group, {
          position: "apart",
          align: "end",
          sx: {
            width: "100%"
          },
          children: [/* @__PURE__ */ jsx(SafeSelect, {
            label: "Group by",
            "data-test": "user-add-role",
            value: groupByValue,
            onChange: setGroupByValue,
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
            ],
            required: true
          }), /* @__PURE__ */ jsxs(Group, {
            spacing: 4,
            children: [/* @__PURE__ */ jsx(ActionIcon, {
              onClick: () => toggleOpenedFilter(),
              mb: 4,
              children: /* @__PURE__ */ jsx(sJ, {
                stroke: 1
              })
            }), /* @__PURE__ */ jsx(SortPopover, {
              groupBy: groupByValue,
              sortOpened,
              setSortOpened,
              sortBy,
              setSortBy,
              setSortOrder,
              sortOrder
            })]
          })]
        }), /* @__PURE__ */ jsx(Group, {
          sx: {
            width: "100%"
          },
          pt: 8,
          children: /* @__PURE__ */ jsx(Transition, {
            mounted: openedFilter,
            transition: "fade",
            duration: 400,
            timingFunction: "ease",
            children: (styles) => {
              return /* @__PURE__ */ jsx(FocusTrap, {
                active: true,
                children: /* @__PURE__ */ jsx(TextInput, {
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
                    children: /* @__PURE__ */ jsx(aze, {
                      stroke: 1
                    })
                  }) : /* @__PURE__ */ jsx(Loader, {
                    size: 24
                  })
                })
              });
            }
          })
        }), infinityQuery.status === "loading" ? "" : infinityQuery.status === "error" ? /* @__PURE__ */ jsxs(Text, {
          color: "red",
          children: ["Error: ", infinityQuery.error.message]
        }) : /* @__PURE__ */ jsx(List, {
          size: "md",
          listStyleType: "none",
          children: /* @__PURE__ */ jsx(NavbarItems, {
            infinityQuery,
            groupByValue
          })
        }), /* @__PURE__ */ jsx(InfinityScrollSkeleton$1, {
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
  name: {
    label: "Name",
    headStyle: { width: "20%" },
    cellStyle: { width: "20%" },
    type: "StringFilter"
  },
  creatorUsername: {
    label: "Created by",
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
    label: "Platform",
    headStyle: { width: "15%" },
    cellStyle: { width: "15%" },
    type: "IdFilter"
  },
  suite: {
    label: "Platform",
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
const useStyles$1 = createStyles(testsCreateStyle);
const logLevelColorMap = {
  debug: "blue",
  info: "green",
  warn: "orange",
  error: "red"
};
const TestsTableRows = ({
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
  return data.pages.map((page) => page.results.map((item, index) => {
    const selected = selection.includes(item.id);
    return /* @__PURE__ */ jsxs(React.Fragment, {
      children: [/* @__PURE__ */ jsxs("tr", {
        "data-test": `table_row_${index}`,
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
function TestsTableHeads({
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
const useStyles = createStyles(testsCreateStyle);
function TestsTable({
  infinityQuery,
  visibleFields
}) {
  var _a, _b, _c, _d;
  react.exports.useContext(AppContext);
  const data = infinityQuery.data;
  const flatData = data.pages.flat().map((x) => x.results).flat();
  const [scrolled, setScrolled] = react.exports.useState(false);
  const {
    classes,
    cx
  } = useStyles();
  const [selection, setSelection] = react.exports.useState([]);
  const scrollAreaRef = react.exports.useRef(null);
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
            zIndex: 10
          },
          className: cx(classes.header, {
            [classes.scrolled]: scrolled
          }),
          children: /* @__PURE__ */ jsx(TestsTableHeads, {
            data,
            toggleAllRows,
            selection,
            visibleFields
          })
        }), /* @__PURE__ */ jsx("tbody", {
          className: classes.tableBody,
          children: /* @__PURE__ */ jsx(TestsTableRows, {
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
function TestsTableSettings({
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
function TestsTableFilter({
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
function Tests() {
  var _a;
  const {
    toolbar,
    setToolbar,
    updateToolbar
  } = react.exports.useContext(AppContext);
  const {
    query,
    setQuery
  } = useParams();
  const theme = useMantineTheme();
  useSubpageEffect("Test Results");
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOpen, setSortOpen] = react.exports.useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = react.exports.useState(false);
  let baseFilter = query["base_filter"] ? query["base_filter"] : {};
  if ((baseFilter == null ? void 0 : baseFilter.app) === "" || (baseFilter == null ? void 0 : baseFilter.app) === null) {
    const {
      app,
      ...filter
    } = baseFilter;
    baseFilter = filter;
  }
  const {
    firstPageQuery,
    infinityQuery,
    newestItemsQuery
  } = useInfinityScroll({
    baseFilterObj: baseFilter,
    filterObj: query.filter,
    resourceName: "tests",
    newestItemsFilterKey: "startDate",
    sortBy: query["sortBy"] || ""
  });
  useNavProgressFetchEffect(infinityQuery.isFetching);
  const [visibleFields, setVisibleFields] = useLocalStorage({
    key: "visibleFields",
    defaultValue: ["_id", "name", "creatorUsername", "markedAs", "startDate", "browserName", "os", "viewport"]
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
  react.exports.useEffect(function refetch() {
    firstPageQuery.refetch();
  }, [query["base_filter"], query["filter"], query["sortBy"]]);
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs(Group, {
      position: "apart",
      align: "start",
      noWrap: true,
      children: [infinityQuery.status === "loading" ? "" : infinityQuery.status === "error" ? /* @__PURE__ */ jsxs(Text, {
        color: "red",
        children: ["Error: ", infinityQuery.error.message]
      }) : /* @__PURE__ */ jsx(Fragment, {
        children: /* @__PURE__ */ jsx(TestsTable, {
          infinityQuery,
          visibleFields
        })
      }), /* @__PURE__ */ jsx(TestsTableSettings, {
        open: sortOpen,
        setSortOpen,
        visibleFields,
        setVisibleFields,
        searchParams,
        setSearchParams
      }), /* @__PURE__ */ jsx(TestsTableFilter, {
        open: isFilterDrawerOpen,
        setOpen: setIsFilterDrawerOpen,
        searchParams,
        setSearchParams
      })]
    })
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
  useSearchParams();
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
