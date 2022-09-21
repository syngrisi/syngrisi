import { r as react, V as useDisclosure, b as jsx, j as jsxs, e as Container, G as Group, h as Button, W as Aae, T as Text, P as Paper, c as createStyles, Y as useLocation, Z as Link, _ as sge, $ as $i, a0 as Lce, Q as QueryClient, f as useDocumentTitle, a1 as useNavigate, v as QueryClientProvider, w as ColorSchemeProvider, M as MantineProvider, a2 as Routes, a3 as Route, x as createRoot, y as BrowserRouter } from "./Logger.dbf872b1.js";
import { u as useColorScheme, l as links, H as Header, B as Burger, a as HeaderLogo, o as openSpotlight, K as Kbd, U as UserMenu, T as ToggleThemeButton, b as Breadcrumbs, i as isDark, N as NavLink, c as ThemeIcon, d as Navbar, S as ScrollArea, A as AppShell, R as ReactQueryDevtools, n as navigationData, e as SpotlightProvider, f as NotificationsProvider, g as NavigationProgress, M as ModalsProvider } from "./heaserLinks.8be6b0a1.js";
const AppContext = react.exports.createContext({});
const useStyles$2 = createStyles((theme) => ({
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
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [opened, {
    toggle
  }] = useDisclosure(false);
  const {
    classes
  } = useStyles$2();
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
const useStyles$1 = createStyles((theme) => ({
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
  } = useStyles$1();
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
const navbarItems = [{
  label: "Users",
  icon: sge,
  link: "/admin/users"
}, {
  label: "Logs",
  icon: $i,
  link: "/admin/logs"
}, {
  label: "Settings",
  icon: Lce,
  link: "/admin/settings"
}];
const useStyles = createStyles((theme) => ({
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
function IndexNavbar() {
  const {
    classes
  } = useStyles();
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
      children: "TESTS RESULTS"
    })]
  });
}
const queryClient = new QueryClient();
function App() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [appTitle, setAppTitle] = react.exports.useState("Syngrisi");
  const [breadCrumbs, setBreadCrumbs] = react.exports.useState([]);
  const [toolbar, setToolbar] = react.exports.useState([]);
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
    children: /* @__PURE__ */ jsx(App, {})
  })
}));
