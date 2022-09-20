import { r as react, d as useMantineTheme, b as jsx, e as Container, j as jsxs, P as Paper, B as Box, T as Text, G as Group, h as Button, l as log, W as Fragment, o as TextInput, Y as GY, A as ActionIcon, R as Loader, N as Nb, Z as EH, _ as age, $ as ka, c as createStyles, a0 as ZX, a1 as Lce, a2 as Bpe, a3 as q2, V as useDisclosure, a4 as Aae, a5 as useLocation, a6 as Link, a7 as sge, a8 as $i, Q as QueryClient, f as useDocumentTitle, a9 as useNavigate, v as QueryClientProvider, w as ColorSchemeProvider, M as MantineProvider, aa as Routes, ab as Route, x as createRoot, y as BrowserRouter } from "./Logger.785098d6.js";
import { i as isDark, M as Modal, U as UserHooks, A as Avatar, a as Menu, u as useColorScheme, H as Header, B as Burger, o as openSpotlight, K as Kbd, T as ToggleThemeButton, b as Breadcrumbs, N as NavLink, c as ThemeIcon, d as Navbar, S as ScrollArea, e as AppShell, R as ReactQueryDevtools, n as navigationData, f as SpotlightProvider, g as NotificationsProvider, h as NavigationProgress, j as ModalsProvider } from "./navigationData.b36239db.js";
const AppContext = react.exports.createContext({});
function HeaderLogo({
  size
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
          height: size || 32,
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
const useStyles$2 = createStyles((theme) => ({
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
  label: "Tests Results",
  link: "/"
}, {
  label: "Admin Panel",
  link: "/admin/"
}];
function IndexHeader() {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  const [opened, {
    toggle
  }] = useDisclosure(false);
  const {
    classes
  } = useStyles$2();
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
