import { c as createStyles, u as useQuery, k as ky, a as config, l as log, j as jsxs, C as Center, A as Anchor, b as jsx, N as NR, T as Text, d as useMantineTheme, e as Container, P as Paper, B as Box, f as useDocumentTitle, r as react, L as LoadingOverlay, z as zB, w as wN, g as Title, h as Button, i as Progress, G as Group, m as dj, n as lAe, o as useSearchParams, p as useForm, q as TextInput, s as Checkbox, S as Switch, t as GCe, v as Nie, Q as QueryClient, x as useRoutes, y as useLocalStorage, D as useHotkeys, E as QueryClientProvider, F as ColorSchemeProvider, M as MantineProvider, H as createRoot, I as BrowserRouter } from "./use-form.d399b9ef.js";
import { P as PasswordInput } from "./PasswordInput.9e8fd8b0.js";
const index = "";
const useStyle = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`
  },
  footerText: {
    color: "white",
    fontSize: "1rem"
  },
  footerLink: {
    margin: "8px",
    color: "white",
    fontSize: "1rem",
    ":hover": {
      textDecoration: "underline",
      filter: "brightness(120%)"
    }
  }
}));
function AuthFooter() {
  const {
    classes
  } = useStyle();
  const {
    isLoading,
    isError,
    data,
    error
  } = useQuery(["version"], () => ky(`${config.baseUri}/v1/app/info`).then((res) => res.json()));
  if (isError) {
    log.error(error);
    return null;
  }
  if (isLoading)
    return null;
  const tagUrl = `https://github.com/viktor-silakov/syngrisi/releases/tag/v${data.version}`;
  return /* @__PURE__ */ jsxs(Center, {
    children: [/* @__PURE__ */ jsxs(Anchor, {
      href: "https://github.com/viktor-silakov/syngrisi",
      target: "_blank",
      className: classes.footerLink,
      children: [/* @__PURE__ */ jsx(NR, {
        size: "1rem",
        stroke: 1
      }), "GitHub"]
    }), /* @__PURE__ */ jsx(Text, {
      component: "span",
      className: classes.footerText,
      children: "|"
    }), /* @__PURE__ */ jsx(Anchor, {
      className: classes.footerLink,
      href: tagUrl,
      children: `v${data.version}`
    })]
  });
}
function AuthLogo() {
  const theme = useMantineTheme();
  const {
    colorScheme
  } = theme;
  return /* @__PURE__ */ jsxs(Container, {
    style: {
      paddingTop: "50px",
      display: "flex",
      alignItems: "center"
    },
    children: [/* @__PURE__ */ jsx(Paper, {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "5px 8px",
        borderRadius: "2px 20px 2px 20px"
      },
      children: /* @__PURE__ */ jsxs("svg", {
        width: "54",
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
        color: "white",
        fontSize: "3rem",
        paddingLeft: "8px",
        fontFamily: "Roboto, sans-serif",
        fontWeight: 500
      },
      children: /* @__PURE__ */ jsx(Paper, {
        style: {
          backgroundColor: "rgba(0, 0, 0, 0)"
        },
        children: /* @__PURE__ */ jsx(Text, {
          color: colorScheme === "dark" ? "gray.4" : "white",
          children: "Syngrisi"
        })
      })
    })]
  });
}
function LogoutForm() {
  useDocumentTitle("Logout page");
  react.exports.useEffect(() => {
    ky(`${config.baseUri}/v1/auth/logout`);
  }, []);
  const logoutInfo = useQuery(["logout"], () => ky(`${config.baseUri}/v1/auth/logout`).then((res) => res.json()), {
    refetchOnWindowFocus: false
  });
  const userInfo = useQuery(["current_user", logoutInfo], () => ky(`${config.baseUri}/v1/users/current`).then((res) => res.json()), {
    refetchOnWindowFocus: false
  });
  if (userInfo.isError) {
    log.error(userInfo.error);
  }
  const success = !userInfo.isLoading && Object.keys(userInfo.data).length === 0;
  return /* @__PURE__ */ jsxs(Container, {
    size: 420,
    my: 40,
    children: [/* @__PURE__ */ jsx(LoadingOverlay, {
      visible: userInfo.isLoading,
      transitionDuration: 300,
      overlayBlur: 1,
      loaderProps: {
        color: "green"
      }
    }), /* @__PURE__ */ jsxs(Paper, {
      withBorder: true,
      shadow: "md",
      p: 30,
      mt: 30,
      radius: "md",
      hidden: userInfo.isLoading,
      children: [success ? /* @__PURE__ */ jsx(Text, {
        align: "center",
        color: "green",
        children: /* @__PURE__ */ jsx(zB, {
          size: "6rem"
        })
      }) : /* @__PURE__ */ jsx(Text, {
        align: "center",
        color: "red",
        children: /* @__PURE__ */ jsx(wN, {
          size: "6rem"
        })
      }), /* @__PURE__ */ jsx(Title, {
        align: "center",
        children: success ? "Success!" : "Failed"
      }), /* @__PURE__ */ jsx(Text, {
        align: "center",
        size: 16,
        mt: "md",
        children: success ? "You have been successfully logged out. Click Sign In to login again." : "Something went wrong"
      }), /* @__PURE__ */ jsx(Button, {
        fullWidth: true,
        id: "submit",
        mt: "xl",
        color: "green",
        type: "submit",
        component: "a",
        href: "/auth/",
        children: "Sign In"
      })]
    })]
  });
}
const requirements = [{
  re: /[0-9]/,
  label: "Includes number",
  id: "include-numbers"
}, {
  re: /[a-z]/,
  label: "Includes lowercase letter",
  id: "include-lowercase"
}, {
  re: /[A-Z]/,
  label: "Includes uppercase letter",
  id: "include-uppercase"
}, {
  re: /[$&+,:;=?@#|'<>.^*()%!-]/,
  label: "Includes special symbol",
  id: "include-special"
}];
function Bars({
  value
}) {
  function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
    return Math.max(100 - 100 / (requirements.length + 1) * multiplier, 0);
  }
  const strength = getStrength(value);
  const bars = Array(4).fill(0).map((_, index2) => /* @__PURE__ */ jsx(Progress, {
    styles: {
      bar: {
        transitionDuration: "0ms"
      }
    },
    value: value.length > 0 && index2 === 0 ? 100 : strength >= (index2 + 1) / 4 * 100 ? 100 : 0,
    color: strength > 80 ? "teal" : strength > 50 ? "yellow" : "red",
    size: 4
  }, index2));
  return /* @__PURE__ */ jsx(Group, {
    spacing: 5,
    grow: true,
    mt: "xs",
    mb: "md",
    children: bars
  });
}
function PasswordRequirement({
  meets,
  label,
  id
}) {
  return /* @__PURE__ */ jsx(Text, {
    color: meets ? "teal" : "red",
    mt: 5,
    size: "sm",
    id,
    children: /* @__PURE__ */ jsxs(Center, {
      inline: true,
      children: [meets ? /* @__PURE__ */ jsx(dj, {
        size: 14,
        stroke: 1.5
      }) : /* @__PURE__ */ jsx(lAe, {
        size: 14,
        stroke: 1.5
      }), /* @__PURE__ */ jsx(Box, {
        ml: 7,
        children: label
      })]
    })
  });
}
function ChangePasswordForm() {
  useDocumentTitle("Change Password Page");
  const [searchParams] = useSearchParams();
  const isFirstRun = !!searchParams.get("first_run");
  let validatedRequirements;
  const form = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: ""
    },
    validate: {
      currentPassword: (val) => {
        if (isFirstRun)
          return null;
        return val !== "" ? null : "Old password is Empty";
      },
      newPassword: (val) => {
        if (validatedRequirements.some((x) => !x.meets)) {
          return "The password doesn't meet the requirements";
        }
        return null;
      },
      newPasswordConfirmation: (val) => val === form.values.newPassword ? null : "New password and password confirmation must be match"
    }
  });
  const [errorMessage, setErrorMessage] = react.exports.useState("");
  const [loader, setLoader] = react.exports.useState(false);
  validatedRequirements = requirements.map((requirement) => ({
    key: requirement.id,
    id: requirement.id,
    label: requirement.label,
    meets: requirement.re.test(form.values.newPassword)
  }));
  const checks = validatedRequirements.map((requirement) => /* @__PURE__ */ jsx(PasswordRequirement, {
    id: requirement.id,
    label: requirement.label,
    meets: requirement.meets
  }, requirement.id));
  function handleNewPasswordFields(event, path) {
    form.setFieldValue(path, event.currentTarget.value);
  }
  async function handleFormSubmissions(values) {
    try {
      setErrorMessage("");
      setLoader(true);
      const url = isFirstRun ? `${config.baseUri}/v1/auth/change_first_run` : `${config.baseUri}/v1/auth/change`;
      const resp = await ky(url, {
        throwHttpErrors: false,
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          currentPassword: isFirstRun ? "" : values.currentPassword,
          newPassword: values.newPassword,
          isFirstRun
        }),
        headers: {
          "content-type": "application/json"
        }
      });
      const result = await resp.json();
      setLoader(false);
      if (result.message === "success") {
        return window.location.assign("/auth/changeSuccess");
      }
      if (result.message) {
        log.error(typeof result === "object" ? JSON.stringify(result) : result.toString());
        return setErrorMessage(result.message);
      }
      log.error(typeof result === "object" ? JSON.stringify(result) : result.toString());
      return setErrorMessage(result.message);
    } catch (e) {
      log.error(e.stack || e);
      setErrorMessage("Connection error");
    } finally {
      setLoader(false);
    }
  }
  return /* @__PURE__ */ jsx(Container, {
    size: 420,
    my: 40,
    children: /* @__PURE__ */ jsx(Paper, {
      withBorder: true,
      shadow: "md",
      p: 30,
      mt: 30,
      radius: "md",
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.onSubmit((values) => handleFormSubmissions(values)),
        children: [/* @__PURE__ */ jsx(Title, {
          order: isFirstRun ? 3 : 2,
          id: "title",
          children: isFirstRun ? "Change Password for default Administrator" : "Change Password"
        }), /* @__PURE__ */ jsx(PasswordInput, {
          label: "Current Password",
          placeholder: "Enter current password",
          id: "current-password",
          value: isFirstRun ? "---------------" : form.values.currentPassword,
          onChange: (event) => form.setFieldValue("currentPassword", event.currentTarget.value),
          error: form.errors.currentPassword && "Invalid password",
          disabled: isFirstRun || false,
          required: true
        }), /* @__PURE__ */ jsx(
          PasswordInput,
          {
            value: form.values.newPassword,
            onChange: (event) => handleNewPasswordFields(event, "newPassword"),
            placeholder: "New Password",
            id: "new-password",
            label: "New Password",
            error: form.errors.newPassword,
            required: true
          }
        ), /* @__PURE__ */ jsx(PasswordInput, {
          value: form.values.newPasswordConfirmation,
          onChange: (event) => handleNewPasswordFields(event, "newPasswordConfirmation"),
          placeholder: "New Password",
          id: "new-password-confirmation",
          label: "New Password Confirmation",
          error: form.errors.newPasswordConfirmation,
          required: true
        }), /* @__PURE__ */ jsx(Bars, {
          value: form.values.newPassword
        }), /* @__PURE__ */ jsx(PasswordRequirement, {
          label: "Has at least 6 characters",
          id: "include-six-chars",
          meets: form.values.newPassword.length > 5
        }), checks, errorMessage && /* @__PURE__ */ jsx(Text, {
          size: "sm",
          color: "red",
          mt: "md",
          id: "error-message",
          hidden: false,
          children: errorMessage
        }), /* @__PURE__ */ jsx(Button, {
          fullWidth: true,
          id: "change-password",
          mt: "xl",
          color: "green",
          type: "submit",
          children: "Update password"
        }), /* @__PURE__ */ jsx(LoadingOverlay, {
          visible: loader,
          transitionDuration: 300,
          overlayBlur: 1,
          loaderProps: {
            color: "green"
          }
        })]
      })
    })
  });
}
function LoginForm() {
  useDocumentTitle("Login Page");
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true
    },
    validate: {
      email: (val) => {
        if (val === "Test" || val === "Administrator")
          return null;
        return /^\S+@\S+$/.test(val) ? null : "Invalid email";
      }
    }
  });
  const [errorMessage, setErrorMessage] = react.exports.useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, setLoader] = react.exports.useState(false);
  const successRedirectUrl = searchParams.get("origin") || "/";
  async function handleFormSubmissions(values) {
    try {
      setErrorMessage("");
      setLoader(true);
      const resp = await ky(`${config.baseUri}/v1/auth/login`, {
        throwHttpErrors: false,
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          username: values.email,
          password: values.password,
          rememberMe: values.rememberMe
        }),
        headers: {
          "content-type": "application/json"
        }
      });
      const result = await resp.json();
      setLoader(false);
      if (result.message === "success") {
        return window.location.assign(successRedirectUrl);
      }
      if (result.message) {
        log.error(typeof result === "object" ? JSON.stringify(result) : result.toString());
        return setErrorMessage(result.message);
      }
      log.error(typeof result === "object" ? JSON.stringify(result) : result.toString());
      setErrorMessage("Connection error");
    } catch (e) {
      log.error(e.stack || e);
      setErrorMessage("Connection error");
    } finally {
      setLoader(false);
    }
  }
  return /* @__PURE__ */ jsx(Container, {
    size: 420,
    my: 40,
    children: /* @__PURE__ */ jsx(Paper, {
      withBorder: true,
      shadow: "md",
      p: 30,
      mt: 30,
      radius: "md",
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: form.onSubmit((values) => handleFormSubmissions(values)),
        children: [/* @__PURE__ */ jsx(Title, {
          children: "Sign in"
        }), /* @__PURE__ */ jsx(TextInput, {
          label: "Email",
          id: "email",
          placeholder: "username@domain.com",
          value: form.values.email,
          onChange: (event) => form.setFieldValue("email", event.currentTarget.value),
          error: form.errors.email && "Invalid email",
          required: true
        }), /* @__PURE__ */ jsx(PasswordInput, {
          label: "Password",
          id: "password",
          placeholder: "Your password",
          value: form.values.password,
          onChange: (event) => form.setFieldValue("password", event.currentTarget.value),
          required: true,
          mt: "md"
        }), /* @__PURE__ */ jsx(Group, {
          position: "apart",
          mt: "md",
          children: /* @__PURE__ */ jsx(Checkbox, {
            label: "Remember me",
            onChange: (event) => form.setFieldValue("rememberMe", event.currentTarget.checked)
          })
        }), errorMessage && /* @__PURE__ */ jsx(Text, {
          size: "sm",
          color: "red",
          mt: "md",
          id: "error-message",
          hidden: false,
          children: errorMessage
        }), /* @__PURE__ */ jsx(Button, {
          fullWidth: true,
          id: "submit",
          mt: "xl",
          color: "green",
          type: "submit",
          children: "Sign in"
        }), /* @__PURE__ */ jsx(LoadingOverlay, {
          visible: loader,
          transitionDuration: 300,
          overlayBlur: 1,
          loaderProps: {
            color: "green"
          }
        })]
      })
    })
  });
}
function ChangePasswordSuccessForm() {
  useDocumentTitle("Success");
  return /* @__PURE__ */ jsx(Container, {
    size: 420,
    my: 40,
    children: /* @__PURE__ */ jsxs(Paper, {
      withBorder: true,
      shadow: "md",
      p: 30,
      mt: 30,
      radius: "md",
      children: [/* @__PURE__ */ jsx(Text, {
        align: "center",
        color: "green",
        children: /* @__PURE__ */ jsx(zB, {
          size: "6rem"
        })
      }), /* @__PURE__ */ jsx(Title, {
        align: "center",
        children: "Success!"
      }), /* @__PURE__ */ jsx(Text, {
        align: "center",
        size: 16,
        mt: "md",
        children: "Your Password has been changed. Please use your new password to login!"
      }), /* @__PURE__ */ jsx(Button, {
        fullWidth: true,
        id: "submit",
        mt: "xl",
        color: "green",
        type: "submit",
        component: "a",
        href: "/auth/",
        children: "Sign In"
      })]
    })
  });
}
const routesItems = [{
  path: "/auth/logout",
  element: /* @__PURE__ */ jsx(LogoutForm, {})
}, {
  path: "/auth/change",
  element: /* @__PURE__ */ jsx(ChangePasswordForm, {})
}, {
  path: "/auth/changeSuccess",
  element: /* @__PURE__ */ jsx(ChangePasswordSuccessForm, {})
}, {
  path: "/auth/",
  element: /* @__PURE__ */ jsx(LoginForm, {})
}];
function ToggleThemeButton({
  colorScheme,
  toggleColorScheme
}) {
  const dark = colorScheme === "dark";
  const theme = useMantineTheme();
  return /* @__PURE__ */ jsx(Group, {
    mr: 28,
    position: "right",
    title: `Switch to ${dark ? "light" : "dark"} theme`,
    children: /* @__PURE__ */ jsx(Switch, {
      "data-test": "theme-button",
      size: "md",
      styles: () => ({
        track: {
          backgroundColor: theme.colors.gray[8],
          borderColor: theme.colors.gray[8]
        }
      }),
      color: "gray.8",
      checked: colorScheme === "light",
      onChange: () => {
        toggleColorScheme();
      },
      onLabel: /* @__PURE__ */ jsx(GCe, {
        size: 16,
        stroke: 2.5,
        color: theme.colors.yellow[4]
      }),
      offLabel: /* @__PURE__ */ jsx(Nie, {
        size: 16,
        stroke: 2.5,
        color: theme.colors.blue[6]
      })
    })
  });
}
const queryClient = new QueryClient();
function App() {
  const routes = useRoutes(routesItems);
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true
  });
  const isDark = () => colorScheme === "dark";
  react.exports.useEffect(function onColorSchemeChange() {
    if (!isDark()) {
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.setProperty("--before-opacity", "0.7");
      return;
    }
    document.body.style.backgroundColor = "#000000";
    document.body.style.setProperty("--before-opacity", "0.7");
  }, [colorScheme]);
  const toggleColorScheme = (value) => {
    setColorScheme(value || (isDark() ? "light" : "dark"));
  };
  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  return /* @__PURE__ */ jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsxs(ColorSchemeProvider, {
      colorScheme,
      toggleColorScheme,
      children: [/* @__PURE__ */ jsx(ToggleThemeButton, {
        colorScheme,
        toggleColorScheme
      }), /* @__PURE__ */ jsxs(MantineProvider, {
        withGlobalStyles: true,
        withNormalizeCSS: true,
        theme: {
          fontSizes: {
            md: 24
          },
          colorScheme
        },
        children: [/* @__PURE__ */ jsx(Box, {
          sx: () => ({
            display: "flex",
            justifyContent: "center"
          }),
          children: /* @__PURE__ */ jsx(AuthLogo, {})
        }), /* @__PURE__ */ jsx(Box, {
          children: routes
        }), /* @__PURE__ */ jsx(Box, {
          children: /* @__PURE__ */ jsx(AuthFooter, {})
        })]
      })]
    })
  });
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx(react.exports.StrictMode, {
  children: /* @__PURE__ */ jsx(BrowserRouter, {
    children: /* @__PURE__ */ jsx(App, {})
  })
}));
