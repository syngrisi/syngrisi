# E2E Tests Implementation Report

## Overview

This document describes the work done on implementing E2E tests for the `create-sy` package using Apple Container CLI.

## Completed Work

### 1. E2E Test Infrastructure

Created a complete e2e test infrastructure using Apple Container CLI:

**Files created:**
- `e2e/vitest.e2e.config.ts` - Vitest configuration for e2e tests
- `e2e/fixtures/container.fixture.ts` - Container test fixture with helper functions
- `e2e/utils/container-cli.ts` - Wrapper for Apple Container CLI operations
- `e2e/container/start-containers.sh` - Script to build container images
- `e2e/container/Dockerfile.node` - Dockerfile template for Node.js containers

**Test files created:**
- `e2e/tests/node-versions/node18.e2e.ts` - Node.js 18 compatibility tests
- `e2e/tests/node-versions/node20.e2e.ts` - Node.js 20 compatibility tests
- `e2e/tests/node-versions/node22.e2e.ts` - Node.js 22 compatibility tests
- `e2e/tests/installation/npm-tag-latest.e2e.ts` - Latest version installation tests
- `e2e/tests/installation/npm-tag-specific.e2e.ts` - Specific version installation tests
- `e2e/tests/installation/npm-tag-invalid.e2e.ts` - Invalid tag validation tests
- `e2e/tests/full-flow/install-and-start.e2e.ts` - Full installation flow tests

### 2. Security Improvements

Added `validateNpmTag()` function to prevent command injection:

```typescript
// src/utils.ts
export function validateNpmTag(tag: string): void {
    const forbiddenChars = /[;&|`$(){}[\]<>\\!#'"*?\n\r]/
    if (forbiddenChars.test(tag)) {
        throw new Error(`Invalid npmTag: contains forbidden characters`)
    }
    if (tag.length > 100) {
        throw new Error(`Invalid npmTag: exceeds maximum length of 100 characters`)
    }
}
```

### 3. CLI Improvements

Added `--yes` flag support for non-interactive mode:

```typescript
// src/createSyngrisiProject.ts
const args = yargs(hideBin(process.argv))
    .option('yes', {
        alias: 'y',
        type: 'boolean',
        description: 'Skip confirmation prompts',
        default: false,
    })
```

### 4. Unit Tests

All 24 unit tests passing with 100% coverage:
- `validateNpmTag()` validation tests
- CLI argument parsing tests
- Package installation tests

## Problems Encountered

### 1. XPC Connection Interrupted Errors

**Problem:** Apple Container CLI threw `XPC connection interrupted` errors when running containers.

**Error message:**
```
internalError: "failed to wait for process...XPC connection error: Connection interrupted"
```

**Solution:** Added `container system start` call before running containers:
```bash
# e2e/container/start-containers.sh
start_container_system() {
    log_info "Starting container system service..."
    container system start 2>/dev/null || true
    log_info "Container system service started"
}
```

**Reference:** https://github.com/apple/container/issues/699

### 2. npm init Flags Not Passed to create-sy

**Problem:** Flags like `-y -f` were consumed by `npm init` instead of being passed to create-sy.

**Wrong approach:**
```bash
npm init sy@latest -y -f  # -y -f consumed by npm init
```

**Solution:** Use `--` separator to pass flags through:
```bash
npm init sy@latest -- --yes --force  # flags passed to create-sy
```

### 3. Shell Command Escaping in Containers

**Problem:** Commands weren't being executed properly in containers due to escaping issues.

**Solution:** Fixed escaping in `container-cli.ts`:
```typescript
// Use single quotes around the shell command
const shellCommand = command.join(' && ')
execSync(`container ${args.join(' ')} sh -c '${shellCommand}'`, {...})
```

### 4. Container Process Crashes (Exit Code 139)

**Problem:** Some tests fail with exit code 139 (SIGSEGV) during npm installation.

**Hypothesis tested:**
- Memory issues in containers (increased memory allocation)
- Timeout issues (increased to 5 minutes)
- Concurrent container execution (switched to sequential with `singleFork: true`)

**Status:** Not fully resolved. The issue appears to be related to npm installation inside containers crashing intermittently.

### 5. Long Test Execution Time

**Problem:** Tests take extremely long to complete (5+ minutes per test).

**Cause:**
- Each test starts a new container
- Downloads create-sy from npm
- Runs npm install which downloads all syngrisi dependencies

**Current configuration:**
```typescript
// vitest.e2e.config.ts
testTimeout: 300_000, // 5 minutes per test
pool: 'forks',
poolOptions: {
    forks: {
        singleFork: true, // Sequential execution
    },
},
```

## Test Results

### Passing Tests

| Test | Status | Duration |
|------|--------|----------|
| Node.js 18 environment verification | PASS | ~10s |
| Node.js 20 environment verification | PASS | ~10s |
| Node.js 22 environment verification | PASS | ~10s |

### Failing/Unstable Tests

| Test | Status | Issue |
|------|--------|-------|
| npm init sy@latest installs syngrisi | FAIL | Exit code 139 (SIGSEGV) |
| Installation with specific version | UNSTABLE | Container crashes |
| Full flow installation | UNSTABLE | Long timeout/crashes |

## What's Not Done

### 1. Stable npm Installation Tests
The tests that actually run `npm init sy@latest` inside containers are unstable due to:
- Container crashes (exit code 139)
- Long execution times
- Memory/resource issues

### 2. Local Package Testing
Currently tests download published `create-sy` from npm. A mechanism to test local unpublished changes would be beneficial:
- Could use `npm pack` + volume mount
- Or npm link approach inside containers

### 3. CI Integration
E2E tests are not yet integrated into CI pipeline:
- Apple Container CLI only works on macOS
- Would need self-hosted macOS runners
- Or alternative containerization approach for Linux CI

### 4. Security Validation Tests
Tests for invalid npmTag are written but not fully verified:
- `rejects dangerous characters in tag`
- `rejects tag with shell metacharacters`

## Recommendations

1. **Short term:** Mark npm installation e2e tests as `@slow` or `@unstable` and run them separately
2. **Medium term:** Investigate container memory/resource limits for stability
3. **Long term:** Consider Docker-based tests for CI compatibility

## File Structure

```
packages/create-sy/
├── e2e/
│   ├── container/
│   │   ├── Dockerfile.node
│   │   └── start-containers.sh
│   ├── fixtures/
│   │   └── container.fixture.ts
│   ├── tests/
│   │   ├── full-flow/
│   │   │   └── install-and-start.e2e.ts
│   │   ├── installation/
│   │   │   ├── npm-tag-invalid.e2e.ts
│   │   │   ├── npm-tag-latest.e2e.ts
│   │   │   └── npm-tag-specific.e2e.ts
│   │   └── node-versions/
│   │       ├── node18.e2e.ts
│   │       ├── node20.e2e.ts
│   │       └── node22.e2e.ts
│   ├── utils/
│   │   └── container-cli.ts
│   └── vitest.e2e.config.ts
├── src/
│   ├── utils.ts          # Added validateNpmTag()
│   └── createSyngrisiProject.ts  # Added --yes flag
└── tests/
    └── *.test.ts         # 24 unit tests (100% coverage)
```

## Commands

```bash
# Run unit tests
npm test

# Run e2e tests (requires Apple Container CLI)
npm run test:e2e

# Run only environment verification tests (fast)
npx vitest run --config e2e/vitest.e2e.config.ts --testNamePattern "verifies Node.js"

# Build container images only
npm run e2e:setup
```
