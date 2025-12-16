# Share Check Feature

## Overview

The Share Check feature allows users to create shareable links for check details that can be accessed by anyone without authentication. Shared links provide read-only access to the check information.

## Use Cases

1. **Share with stakeholders** - Share visual test results with product managers, designers, or clients who don't have Syngrisi accounts
2. **Bug reports** - Include direct links to failed checks in bug tracking systems
3. **Code reviews** - Share visual diff results in pull request comments
4. **Documentation** - Reference specific check results in documentation

## URL Format

```
http://host/?checkId=<checkId>&modalIsOpen=true&share=<token>
```

Parameters:
- `checkId` - The ID of the check to display
- `modalIsOpen` - Opens check details modal automatically
- `share` - The share token for anonymous access

## Features

### Creating Share Links

1. Open Check Details modal
2. Click the three-dot menu (⋮) in the toolbar
3. Click "Share" menu item
4. Click "Create Share Link" button
5. Copy the generated URL

### Managing Share Links

- **View active links** - The Share modal displays all active share links for the current check
- **Revoke links** - Click the trash icon next to any share link to revoke it
- **No expiration** - Share links don't expire automatically (must be manually revoked)

### Read-Only Mode

When accessing via share link, the following UI elements are hidden:
- Accept button
- Remove button
- Three-dot menu (no actions available)
- Region creation/editing tools

Users can only view:
- Check images (actual, expected, diff)
- Check metadata (name, status, timestamps)
- Image navigation and zoom controls

## API Endpoints

### Create Share Token
```
POST /api/v1/checks/:checkId/share
Authorization: Required

Response: {
  token: string,
  shareUrl: string
}
```

### Validate Share Token
```
GET /api/v1/checks/:checkId/share/validate?token=<token>
Authorization: Not required

Response: {
  valid: boolean
}
```

### Get Share Tokens for Check
```
GET /api/v1/checks/:checkId/share
Authorization: Required

Response: {
  results: ShareToken[]
}
```

### Revoke Share Token
```
DELETE /api/v1/share/:tokenId
Authorization: Required

Response: {
  success: boolean
}
```

## Security

- Tokens are hashed before storage (using bcrypt)
- Only the creator can see/revoke share tokens
- Share links provide read-only access only
- No sensitive operations available via share links
- Each share link is unique per check

## Database Model

```typescript
interface ShareToken {
  _id: ObjectId;
  checkId: ObjectId;
  tokenHash: string;
  createdById: ObjectId;
  createdByUsername: string;
  createdDate: Date;
  isRevoked: boolean;
  revokedDate?: Date;
  revokedById?: ObjectId;
  revokedByUsername?: string;
}
```

## E2E Tests

Tests are located in `e2e/features/CP/share/share_check.feature`:

1. **Open Share modal from Check Details menu** - Verifies the Share modal opens correctly
2. **Create share link and verify URL format** - Verifies share link creation and URL input display
3. **Access shared check as anonymous user - read-only mode verification** - Verifies anonymous access works and UI is properly restricted

Demo test: `e2e/features/DEMO/share_demo.feature`
