---
"@syngrisi/syngrisi": minor
---

feat(share): implement check sharing for anonymous read-only access

Add ability to share check details via unique URL that allows anonymous users to view check information in read-only mode without authentication.

**Features:**
- Share button in Check Details menu creates shareable links
- Share links provide read-only access (Accept, Remove, menu hidden)
- Share modal with create/copy/revoke functionality
- No expiration - links must be manually revoked
- Tokens are hashed before storage for security

**API Endpoints:**
- POST /api/v1/checks/:checkId/share - Create share token
- GET /api/v1/checks/:checkId/share - List share tokens
- GET /api/v1/checks/:checkId/share/validate - Validate token (public)
- DELETE /api/v1/share/:tokenId - Revoke share token
