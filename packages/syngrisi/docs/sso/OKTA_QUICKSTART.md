# Okta SAML SSO Quick Start

Minimal steps to enable SSO between Okta and Syngrisi.

---

## 1. Okta Setup

1. **Applications** → **Create App Integration** → **SAML 2.0**

2. Fill in only these fields:

   | Field | Value |
   |-------|-------|
   | Single sign-on URL | `https://<syngrisi-url>/v1/auth/sso/saml/callback` |
   | Audience URI (SP Entity ID) | `https://<syngrisi-url>` |
   | Name ID format | `EmailAddress` |

3. **Finish** → Go to **Sign On** tab → Copy **Metadata URL**

4. **Assignments** tab → Assign users

---

## 2. Syngrisi Setup

Set 4 environment variables and restart:

```bash
SSO_ENABLED=true
SSO_PROTOCOL=saml
SSO_ISSUER=https://<syngrisi-url>
SSO_IDP_METADATA_URL=https://<okta-domain>.okta.com/app/xxx/sso/saml/metadata
```

> **Important**: `SSO_ISSUER` must exactly match the **Audience URI** from Okta.

---

## 3. Verify

1. Open Syngrisi login page
2. Click **SSO Login** button
3. Authenticate in Okta
4. You should be redirected back and logged in

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No SSO button | Check `SSO_ENABLED=true`, restart server |
| "Audience invalid" | `SSO_ISSUER` must match Okta's Audience URI exactly |
| "User not assigned" | Assign user to app in Okta |
