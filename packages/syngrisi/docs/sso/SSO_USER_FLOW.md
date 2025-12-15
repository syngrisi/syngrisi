# SSO User Workflow & Setup

## Default User Role
When a user logs in via SSO (OAuth2 or SAML) for the first time, and `SSO_AUTO_CREATE_USERS` is enabled (default: `true`), a new user account is automatically created in Syngrisi.

The **default role** for this new user is **`reviewer`**.

This can be configured using the environment variable:
```bash
SSO_DEFAULT_ROLE=reviewer  # Options: 'user', 'admin', 'reviewer'
```

## User State Upon Creation
The newly created SSO user has the following properties:
*   **Username/Email:** Taken from the IdP profile.
*   **Role:** `reviewer` (default).
*   **Password:** Random UUID (cannot be used for standard login).
*   **API Key:** Random UUID (generated automatically).
*   **Provider:** `oauth` or `saml`.

## Enabling "Full Work" (API & SDK Usage)
To use Syngrisi fully (e.g., running tests via CI/CD using Syngrisi SDKs), the user needs their **API Key**. Since the API key is generated randomly, the user or admin must retrieve it.

### Workflow to Enable CI/CD for SSO User

1.  **First Login:** User logs in via SSO to create the account.
2.  **Retrieve API Key:**
    *   **Option A (User):** User navigates to their **Profile** page in the Syngrisi UI and copies the API Key.
    *   **Option B (Admin):** An Administrator looks up the user in the User Management section or Database and provides the API Key.
3.  **Configure Runner:** Set the `SYNGRISI_API_KEY` in your test runner (Playwright/WebdriverIO) configuration.

## Workflow Diagram

```ascii
+-----------------+           +-------------------+           +-------------------------+
|                 |           |                   |           |                         |
|  Identity       |  Auth     |  Syngrisi Server  |  Create   |  Syngrisi Database      |
|  Provider (IdP) +---------> |                   +---------> |                         |
|                 |           |                   |           |  - User: test@corp.com  |
+-----------------+           +---------+---------+           |  - Role: 'reviewer'     |
                                        |                     |  - API Key: 'uuid-...'  |
                                        |                     |                         |
                                        |                     +-----------+-------------+
                                        |                                 |
                                        v                                 |
                              +-------------------+                       |
                              |                   |                       |
                              |  User UI Session  | <---------------------+
                              |  (Logged In)      |
                              |                   |
                              +---------+---------+
                                        |
                                        | 1. User copies API Key from Profile
                                        |
                                        v
                              +-------------------+
                              |                   |
                              |  CI/CD Pipeline   |
                              |  (Test Runner)    |
                              |                   |
                              +-------------------+
                                        |
                                        | 2. Uses API Key to report results
                                        v
                              +-------------------+
                              |                   |
                              |  Syngrisi API     |
                              |                   |
                              +-------------------+
```

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `SSO_AUTO_CREATE_USERS` | `true` | Automatically create users on successful SSO login. |
| `SSO_DEFAULT_ROLE` | `reviewer` | Role assigned to new SSO users (`user`, `admin`, `reviewer`). |
| `SSO_ALLOW_ACCOUNT_LINKING` | `true` | Link SSO login to existing local account with same email. |
