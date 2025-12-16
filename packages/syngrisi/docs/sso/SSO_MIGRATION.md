# SSO Migration Guide

This guide covers migrating from local authentication to SSO, switching between SSO providers, and rollback procedures.

## Table of Contents

- [Migration Strategies](#migration-strategies)
- [From Local Auth to SSO](#from-local-auth-to-sso)
- [Between SSO Providers](#between-sso-providers)
- [Rollback Procedures](#rollback-procedures)
- [User Communication](#user-communication)

---

## Migration Strategies

### Strategy Comparison

| Strategy | Description | Downtime | Risk | Best For |
|----------|-------------|----------|------|----------|
| **Big Bang** | Switch all users at once | Brief | Higher | Small teams |
| **Gradual** | SSO optional, then mandatory | None | Lower | Large organizations |
| **Parallel** | Both methods available | None | Lowest | Enterprises |

### Recommended Approach

For most organizations, we recommend the **Gradual** migration:

```
Phase 1: Enable SSO alongside local auth (2 weeks)
    ↓
Phase 2: Encourage SSO adoption (2-4 weeks)
    ↓
Phase 3: Make SSO mandatory (disable local for non-admins)
    ↓
Phase 4: Cleanup (disable local completely)
```

---

## From Local Auth to SSO

### Prerequisites

Before starting migration:

- [ ] IdP configured and tested (see [Integration Guide](./SSO_INTEGRATION_GUIDE.md))
- [ ] All users have accounts in IdP with matching emails
- [ ] Backup of user database
- [ ] Communication plan for users
- [ ] Rollback plan documented

### Phase 1: Enable SSO (Parallel Mode)

**Goal:** Allow SSO login while keeping local auth available.

#### Step 1: Configure SSO

```bash
# Enable SSO
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2  # or saml

# Configure provider (see Integration Guide)
export SSO_CLIENT_ID=your-client-id
export SSO_CLIENT_SECRET=your-client-secret
# ... other settings

# Keep auto-create and linking enabled
export SSO_AUTO_CREATE_USERS=true
export SSO_ALLOW_ACCOUNT_LINKING=true
export SSO_DEFAULT_ROLE=reviewer
```

#### Step 2: Deploy and Verify

```bash
# Restart Syngrisi
systemctl restart syngrisi

# Verify SSO status
curl http://localhost:3000/v1/auth/sso/status
# Should return: {"ssoEnabled":true}
```

#### Step 3: Test with Pilot Users

1. Select 2-3 pilot users
2. Have them log in via SSO
3. Verify their accounts are linked correctly:

```javascript
// MongoDB - check user was linked
db.users.findOne({ username: "pilot@example.com" })
// Should show: provider: "oauth" (or "saml")
```

### Phase 2: Encourage SSO Adoption

**Goal:** Move majority of users to SSO.

#### Track Adoption

```javascript
// MongoDB - count users by provider
db.users.aggregate([
  { $group: { _id: "$provider", count: { $sum: 1 } } }
])

// Example output:
// { _id: "local", count: 45 }
// { _id: "oauth", count: 123 }
```

#### Identify Non-Migrated Users

```javascript
// Find users still using local auth
db.users.find(
  { provider: "local" },
  { username: 1, lastLogin: 1, role: 1 }
).sort({ lastLogin: -1 })
```

#### Communicate with Users

Send reminders to users still using local auth (see [User Communication](#user-communication)).

### Phase 3: Make SSO Mandatory

**Goal:** Require SSO for all non-admin users.

#### Option A: Convert Remaining Users

For users who haven't migrated:

```javascript
// Pre-link accounts (user will complete linking on next SSO login)
// This doesn't change their ability to use local auth yet
db.users.updateMany(
  { provider: "local", role: { $ne: "admin" } },
  { $set: { requiresSSO: true } }  // Custom field for tracking
)
```

#### Option B: Disable Local Auth for Regular Users

Modify authentication to check provider:

```javascript
// In your auth middleware/controller, add check:
if (user.provider === 'local' && user.role !== 'admin') {
    return res.redirect('/auth?error=sso_required');
}
```

### Phase 4: Cleanup

**Goal:** Remove local auth capability (except for emergency admin access).

#### Final Configuration

```bash
# Keep SSO as primary
export SSO_ENABLED=true

# Optionally disable auto-create if you want to pre-provision users
export SSO_AUTO_CREATE_USERS=false

# Keep one admin with local auth for emergencies
```

#### Cleanup Local Passwords

For security, randomize passwords of SSO users:

```javascript
// MongoDB - randomize local passwords for SSO users
// WARNING: This is irreversible, ensure SSO is working first
db.users.find({ provider: { $ne: "local" } }).forEach(function(user) {
    db.users.updateOne(
        { _id: user._id },
        { $set: { password: UUID().toString() } }
    );
});
```

---

## Between SSO Providers

### Scenario: OAuth2 to SAML (or vice versa)

#### Step 1: Configure New Provider

```bash
# Add new provider config (don't change SSO_PROTOCOL yet)
export NEW_SSO_PROTOCOL=saml
export NEW_SSO_ENTRY_POINT=https://new-idp.example.com/sso
export NEW_SSO_ISSUER=https://syngrisi.example.com
export NEW_SSO_CERT="..."
```

#### Step 2: Test New Provider

Test in a staging environment:

```bash
# Temporarily switch protocol
export SSO_PROTOCOL=saml
# ... restart and test
```

#### Step 3: Update User Provider Records

```javascript
// When switching from OAuth2 to SAML
db.users.updateMany(
    { provider: "oauth" },
    { $set: { provider: "saml", providerId: null } }
)

// Users will be re-linked on next login via SAML
```

#### Step 4: Deploy New Configuration

```bash
# Update to new provider
export SSO_PROTOCOL=saml
export SSO_ENTRY_POINT=https://new-idp.example.com/sso
export SSO_ISSUER=https://syngrisi.example.com
export SSO_CERT="..."

# Remove old OAuth2 settings
unset SSO_CLIENT_ID
unset SSO_CLIENT_SECRET
unset SSO_AUTHORIZATION_URL
unset SSO_TOKEN_URL
unset SSO_USERINFO_URL
```

### Scenario: Change IdP (Same Protocol)

#### For OAuth2:

```bash
# Update credentials and endpoints
export SSO_CLIENT_ID=new-client-id
export SSO_CLIENT_SECRET=new-secret
export SSO_AUTHORIZATION_URL=https://new-idp.com/oauth/authorize
export SSO_TOKEN_URL=https://new-idp.com/oauth/token
export SSO_USERINFO_URL=https://new-idp.com/oauth/userinfo
```

```javascript
// Clear provider IDs (users will be re-linked by email)
db.users.updateMany(
    { provider: "oauth" },
    { $set: { providerId: null } }
)
```

#### For SAML:

```bash
# Update SAML settings
export SSO_ENTRY_POINT=https://new-idp.com/saml/sso
export SSO_IDP_ISSUER=https://new-idp.com
export SSO_CERT="new-certificate..."
```

---

## Rollback Procedures

### Emergency: Disable SSO Completely

If SSO is broken and users can't log in:

```bash
# Quick disable
export SSO_ENABLED=false

# Restart Syngrisi
systemctl restart syngrisi
```

Users can now use local auth (if they have passwords).

### Reset User to Local Auth

For individual users:

```javascript
// MongoDB - revert user to local auth
db.users.updateOne(
    { username: "user@example.com" },
    {
        $set: {
            provider: "local",
            providerId: null
        }
    }
)
```

User will need to reset password via admin or use "Forgot Password" (if configured).

### Reset All Users to Local Auth

**Warning:** This is a major rollback, only use in emergencies.

```javascript
// MongoDB - revert all users to local
db.users.updateMany(
    {},
    {
        $set: {
            provider: "local",
            providerId: null
        }
    }
)
```

### Create Emergency Admin

If locked out of all accounts:

```javascript
// MongoDB - create emergency admin
// Generate password hash first (use bcrypt)
db.users.insertOne({
    username: "emergency-admin@example.com",
    password: "$2b$10$...",  // bcrypt hash of a strong password
    firstName: "Emergency",
    lastName: "Admin",
    role: "admin",
    provider: "local",
    apiKey: UUID().toString()
})
```

---

## User Communication

### Pre-Migration Announcement

**Subject: Upcoming Change to Syngrisi Login**

```
Dear Team,

We are enhancing Syngrisi security by enabling Single Sign-On (SSO)
authentication with [IdP Name].

What's Changing:
- You will be able to log in using your [Company] credentials
- Your existing account will be automatically linked
- No action needed - just click "Login with SSO" on your next visit

Timeline:
- [Date]: SSO login available (optional)
- [Date]: SSO login recommended
- [Date]: SSO login required

Benefits:
- No separate password to remember
- Enhanced security with [MFA/Company policies]
- Faster login experience

Questions? Contact [IT Team].
```

### Migration Reminder

**Subject: Action Required: Switch to SSO Login**

```
Dear [Name],

Our records show you're still using local authentication for Syngrisi.
Please switch to SSO login before [deadline].

How to Switch:
1. Go to [Syngrisi URL]
2. Click "Login with SSO"
3. Log in with your [Company] credentials
4. Done! Your account is now linked.

Your existing data and settings will be preserved.

Need help? Contact [IT Team].
```

### Post-Migration Confirmation

**Subject: Syngrisi SSO Migration Complete**

```
Dear Team,

The migration to SSO for Syngrisi is complete.

What's Changed:
- All users now use [Company] SSO to log in
- Local password login has been disabled
- Your API keys remain unchanged

For CI/CD Integration:
Your API key is unaffected. Find it in your Profile page.

Support:
If you experience any login issues, contact [IT Team].
```

---

## Migration Checklist

### Before Migration

- [ ] IdP fully configured and tested
- [ ] All user emails exist in IdP
- [ ] Database backed up
- [ ] Rollback procedure documented and tested
- [ ] Communication sent to users
- [ ] Support team briefed

### During Migration

- [ ] SSO enabled in production
- [ ] Pilot users tested successfully
- [ ] Monitoring active for errors
- [ ] Support team available

### After Migration

- [ ] Adoption rate tracked
- [ ] Stragglers contacted
- [ ] Documentation updated
- [ ] Old local passwords secured/removed
- [ ] Post-mortem completed

---

## Related Documentation

- [SSO Index](./README.md) - Documentation overview
- [SSO Architecture](./SSO_ARCHITECTURE.md) - Technical architecture
- [SSO Integration Guide](./SSO_INTEGRATION_GUIDE.md) - IdP setup
- [SSO Troubleshooting](./SSO_TROUBLESHOOTING.md) - Common issues
- [SSO Security](./SSO_SECURITY.md) - Security recommendations
- [SSO User Flow](./SSO_USER_FLOW.md) - User workflow
