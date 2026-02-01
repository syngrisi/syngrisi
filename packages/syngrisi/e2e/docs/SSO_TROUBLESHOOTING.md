# SSO Test Infrastructure Troubleshooting

This guide addresses common infrastructure issues encountered when running SSO (Logto/SAML) E2E tests.

## 1. Timeouts & Network Connection Refused (Redirect Loop)
**Symptoms**:
- Test fails with `Timeout 90000ms exceeded` waiting for `input[name="identifier"]`.
- Browser trace shows `net::ERR_CONNECTION_REFUSED` or `400 Bad Request` from Logto.

**Cause**:
Syngrisi E2E tests often run on dynamic ports (e.g., `5100`, `5150`) to allow parallel execution. However, external Identity Providers (Logto) require strict **Redirect URIs** (Callbacks) to be registered in advance. If the app runs on port `5100` but Logto expects a callback at `http://localhost:3002`, the login flow will break.

**Solution**:
You must force the test execution to use the exact port registered in your IdP configuration.

1. Add the `@no-app-start` tag to the Feature/Scenario.
2. Explicitly set `SYNGRISI_APP_PORT` in the `Background` steps.

```gherkin
  @no-app-start
  Feature: SSO Authentication
  
  Background:
    When I set env variables:
      """
      SYNGRISI_APP_PORT: 3002
      """
    Given I start Server
```

## 2. IPv6 / Localhost Resolution Issues
**Symptoms**:
- `curl localhost:3001` works, but the test browser fails to load the Logto page.
- Errors like `net::ERR_CONNECTION_REFUSED` despite the service running.

**Cause**:
On some environments (especially macOS with certain container runtimes), `localhost` may resolve to `::1` (IPv6), but the container port is only bound to `127.0.0.1` (IPv4).

**Solution**:
Force the Logto endpoint to use IPv4.

```gherkin
    When I set env variables:
      """
      LOGTO_ENDPOINT: http://127.0.0.1:3001
      """
```

## 3. "Container CLI required" Error
**Symptoms**:
- Test fails immediately with `Error: Container CLI required`.

**Cause**:
Some tests (specifically those provisioning Logto via UI) need to control the container runtime (stop/start/reset instances). This requires a compatible CLI (`docker`, `podman`, or `container` on macOS) to be in the `PATH`.

**Solution**:
- If running locally without these tools, **SKIP** these tests using the `@skip` tag.
- Ensure the relevant CLI tool is installed and available in your terminal's `PATH`.
