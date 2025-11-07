# E2E Test Utilities

This directory contains utility functions for E2E tests.

## Common Utilities (`common.ts`)

### `sleep(ms: number): Promise<void>`

Delays execution for a specified number of milliseconds.

```typescript
await sleep(1000); // Wait for 1 second
```

### `waitFor(callback, options): Promise<void>`

Universal waiting function that repeatedly calls a callback until it returns `true` or a timeout is reached.

#### Parameters

- `callback: () => boolean | Promise<boolean>` - Function that returns `true` when the condition is met
- `options: WaitForOptions`:
  - `timeoutMs: number` - Maximum time to wait in milliseconds (required)
  - `intervalMs?: number` - Interval between checks in milliseconds (default: 500ms)
  - `description?: string` - Description of what we're waiting for, used in error messages (default: "condition to be met")

#### Returns

- `Promise<void>` - Resolves when the condition is met

#### Throws

- `WaitForTimeoutError` - If timeout is reached, with detailed information:
  - `description: string` - What we were waiting for
  - `timeoutMs: number` - How long we waited
  - `iterations: number` - How many attempts were made
  - `lastError?: Error` - The last error that occurred (if any)

#### Examples

##### Wait for HTTP service

```typescript
import { waitFor } from "@utils/common";

async function waitForService(url: string): Promise<void> {
  await waitFor(
    async () => {
      const isAvailable = await checkServiceAvailability(url);
      return isAvailable;
    },
    {
      timeoutMs: 30000, // 30 seconds
      intervalMs: 500, // Check every 500ms
      description: `HTTP service at ${url}`,
    },
  );
}
```

##### Wait for file to exist

```typescript
import { waitFor } from "@utils/common";
import fs from "fs";

await waitFor(() => fs.existsSync("/path/to/file"), {
  timeoutMs: 5000,
  intervalMs: 100,
  description: "file /path/to/file to exist",
});
```

##### Handle timeout with detailed error

```typescript
import { waitFor, WaitForTimeoutError } from "@utils/common";

try {
  await waitFor(() => checkSomeCondition(), {
    timeoutMs: 10000,
    description: "some condition",
  });
} catch (error) {
  if (error instanceof WaitForTimeoutError) {
    console.error(`Failed after ${error.iterations} attempts`);
    console.error(`Timeout: ${error.timeoutMs}ms`);
    if (error.lastError) {
      console.error(`Last error: ${error.lastError.message}`);
    }
  }
}
```

##### With error recovery

If the callback throws an exception, `waitFor` will:
1. Catch the exception
2. Store it as `lastError`
3. Continue retrying until timeout
4. Include the last error in the timeout exception

```typescript
await waitFor(
  () => {
    // This might throw intermittently
    const result = riskyOperation();
    return result.isReady;
  },
  {
    timeoutMs: 5000,
    description: "risky operation to succeed",
  },
);
```

### `hasTag(testInfo: TestInfo, tag: string): boolean`

Checks if a Playwright test has a specific tag.

```typescript
import { hasTag } from "@utils/common";

test("my test", async ({ }, testInfo) => {
  if (hasTag(testInfo, "@smoke")) {
    // Do something specific for smoke tests
  }
});
```

## File System Utilities (`fs.ts`)

File system utilities for working with paths and directories.

## App Server Utilities (`app-server.ts`)

Utilities for launching and managing the app server during E2E tests.
