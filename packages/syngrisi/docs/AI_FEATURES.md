# AI Features Documentation

Syngrisi provides a set of features designed to facilitate integration with AI agents for automated review and analysis of visual regression checks.

## Endpoints

### 1. List Checks
**URL:** `GET /ai/checks`
**Description:** Returns a simplified HTML list of checks, optimized for parsing by AI agents.

**Query Parameters (Filters):**

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `run` | Filter by Run ID | `6929a243d36598e1591da630` |
| `status` | Filter by status (new, passed, failed, etc.) | `failed` |
| `name` | Filter by check name (regex supported) | `Login Page` |
| `branch` | Filter by git branch | `main` |
| `browser` | Filter by browser name | `chrome` |
| `os` | Filter by operating system | `macOS` |
| `viewport` | Filter by viewport size | `1920x1080` |
| `markedAs` | Filter by review status (`accepted`, `bug`) | `bug` |
| `hasDiff` | Show only checks with visual differences (`true`) | `true` |
| `app` | Filter by App ID | `...` |
| `suite` | Filter by Suite ID | `...` |
| `fromDate` | Start date for filtering (YYYY-MM-DD) | `2025-01-01` |
| `toDate` | End date for filtering (YYYY-MM-DD) | `2025-01-31` |
| `limit` | Number of results per page | `50` |
| `page` | Page number | `1` |

### 2. Check Details
**URL:** `GET /ai/checks/:id`
**Description:** Returns a simplified HTML view of a specific check, including images (baseline, actual, diff) and metadata.

### 3. Analysis Data
**URL:** `GET /ai/analysis/:id`
**Description:** Returns a JSON object containing Base64-encoded images and context data, suitable for direct processing by AI models.

### 4. Batch Actions
**URL:** `POST /ai/batch`
**Description:** Perform actions on multiple checks simultaneously.

**Body:**
```json
{
  "ids": ["id1", "id2"],
  "action": "accept" // or "remove"
}
```

### 5. Webhooks
**URL:** `POST /ai/webhooks`
**Description:** Register a webhook to receive notifications about events.

**Body:**
```json
{
  "url": "https://my-ai-agent.com/webhook",
  "events": "check.updated",
  "secret": "my-secret"
}
```

## Webhook Events

*   `check.created`: Triggered when a new check is created.
*   `check.updated`: Triggered when a check is updated (e.g., status change, accepted).

## Authentication

All AI endpoints require authentication via API Key or Session cookie.
Header: `apikey: <your-api-key>`
