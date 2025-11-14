# Syngrisi Tasks

This directory contains maintenance tasks for Syngrisi that can be executed via both CLI and HTTP API.

## Architecture

The tasks have been refactored to support dual execution modes:

### Directory Structure

```
src/tasks/
├── core/                           # Core business logic (framework-agnostic)
│   ├── handle-database-consistency.task.ts
│   ├── handle-old-checks.task.ts
│   ├── remove-old-logs.task.ts
│   └── index.ts
├── cli/                            # CLI entry points
│   ├── handle-database-consistency.cli.ts
│   ├── handle-old-checks.cli.ts
│   ├── remove-old-logs.cli.ts
│   └── index.ts
├── lib/                            # Shared utilities
│   ├── output-writer.ts           # Output abstraction layer
│   ├── utils.ts                   # MongoDB connection utilities
│   └── index.ts
└── README.md
```

### Key Components

#### 1. Output Writer Abstraction (`lib/output-writer.ts`)

Provides a unified interface for task output that works in both HTTP and CLI contexts:

- **`IOutputWriter`** - Interface for output writing
- **`HttpOutputWriter`** - Writes to Express Response (Server-Sent Events)
- **`ConsoleOutputWriter`** - Writes to console.log
- **`MockOutputWriter`** - For testing purposes

#### 2. Core Tasks (`core/`)

Pure business logic without any dependency on HTTP or CLI frameworks:

- **`handleDatabaseConsistencyTask()`** - Checks and removes inconsistent database elements
- **`handleOldChecksTask()`** - Removes old checks and related items
- **`removeOldLogsTask()`** - Removes old log entries

#### 3. CLI Scripts (`cli/`)

Command-line interfaces for each task with argument parsing and help text.

## Usage

### Prerequisites

Before running CLI tasks, you must build the project:

```bash
npm run build
# or just build server
npm run build:server
```

### CLI Mode

Tasks can be executed from the command line:

```bash
# Handle database consistency (dry run)
npm run task:consistency

# Handle database consistency (actually clean)
npm run task:consistency -- --clean

# Handle old checks (dry run)
npm run task:old-checks

# Handle old checks with specific days threshold
npm run task:old-checks -- --days 90

# Handle old checks (actually remove)
npm run task:old-checks -- --days 180 --remove

# Remove old logs (dry run)
npm run task:old-logs

# Remove old logs (actually remove)
npm run task:old-logs -- --days 30 --remove
```

#### CLI Help

Each CLI script has a built-in help:

```bash
npm run task:consistency -- --help
npm run task:old-checks -- --help
npm run task:old-logs -- --help
```

### HTTP API Mode

Tasks can also be called via HTTP endpoints (requires admin authentication):

```bash
# Handle database consistency
curl "http://localhost:3000/v1/tasks/task_handle_database_consistency?clean=true"

# Handle old checks
curl "http://localhost:3000/v1/tasks/task_handle_old_checks?days=180&remove=true"

# Remove old logs
curl "http://localhost:3000/v1/tasks/task_remove_old_logs?days=30&statistics=false"
```

## Available Tasks

### 1. Handle Database Consistency

**Purpose**: Checks and optionally removes inconsistent database elements.

**What it checks**:
- Abandoned snapshots (snapshots without files)
- Abandoned files (files without snapshot records)
- Abandoned checks (checks without snapshots)
- Empty tests (tests without checks)
- Empty runs (runs without checks)
- Empty suites (suites without checks)

**CLI Options**:
- `--clean, -c` - Actually remove inconsistent items (default: false, only show statistics)

**HTTP Query Parameters**:
- `clean=true|false` - Remove inconsistent items

**Example**:
```bash
# Dry run (statistics only)
npm run task:consistency

# Actually clean
npm run task:consistency -- --clean
```

**Recommendation**: Run this task before and after removing old checks.

### 2. Handle Old Checks

**Purpose**: Removes checks and related items that are older than specified days.

**What it removes**:
- Old checks
- Related snapshots (if not used by baselines)
- Related files (if not used by other snapshots)

**CLI Options**:
- `--days <number>, -d <number>` - Check older than this many days (default: 180)
- `--remove, -r` - Actually remove old checks (default: false, only show statistics)

**HTTP Query Parameters**:
- `days=<number>` - Days threshold
- `remove=true|false` - Remove old checks

**Example**:
```bash
# Dry run for 180 days
npm run task:old-checks

# Dry run for 90 days
npm run task:old-checks -- --days 90

# Actually remove checks older than 180 days
npm run task:old-checks -- --days 180 --remove

# Using positional arguments
npm run task:old-checks -- 90 true
```

**Warning**: We strongly recommend running the `task:consistency` task before and after this operation.

### 3. Remove Old Logs

**Purpose**: Removes log entries that are older than specified days.

**CLI Options**:
- `--days <number>, -d <number>` - Remove logs older than this many days (default: 30)
- `--remove, -r` - Actually remove old logs (default: false, only show statistics)

**HTTP Query Parameters**:
- `days=<number>` - Days threshold
- `statistics=true|false` - true = dry run, false = actually remove

**Example**:
```bash
# Dry run for 30 days
npm run task:old-logs

# Dry run for 60 days
npm run task:old-logs -- --days 60

# Actually remove logs older than 30 days
npm run task:old-logs -- --remove

# Using positional arguments
npm run task:old-logs -- 60 false
```

## Testing

### E2E Tests

E2E tests for CLI tasks are located in:
- Feature file: `e2e/features/AP/tasks/cli_tasks.feature`
- Step definitions: `e2e/steps/domain/cli-tasks.steps.ts`

Run tests:
```bash
cd e2e
npm test -- --grep "CLI Tasks"
```

### HTTP API Tests

HTTP API tests are located in:
- `e2e/features/AP/tasks/remove_inconsistent_items.feature`
- `e2e/features/AP/tasks/remove_old_checks.feature`

## Development

### Adding a New Task

1. Create core task function in `src/tasks/core/`:
```typescript
export async function myNewTask(
    options: MyTaskOptions,
    output: IOutputWriter
): Promise<void> {
    // Your business logic here
    output.write('Task started');
    // ...
    output.end();
}
```

2. Create CLI script in `src/tasks/cli/`:
```typescript
#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { myNewTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

async function main() {
    // Parse arguments
    // ...
    await runMongoCode(async () => {
        const output = new ConsoleOutputWriter();
        await myNewTask(options, output);
    });
}
```

3. Add service wrapper in `src/server/services/tasks.service.ts`:
```typescript
const task_my_new_task = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    await myNewTask(options, output);
};
```

4. Add route in `src/server/routes/v1/tasks.route.ts`

5. Add npm script in `package.json`:
```json
"task:my-new": "npx tsx src/tasks/cli/my-new-task.cli.ts"
```

6. Add to UI task list in `src/ui-app/admin/components/Tasks/tasksList.ts`

7. Write E2E tests

## Benefits of This Architecture

1. ✅ **Code Reusability** - Same business logic for both CLI and HTTP API
2. ✅ **Testability** - Easy to unit test with MockOutputWriter
3. ✅ **Flexibility** - Can add new execution contexts (cron jobs, message queues, etc.)
4. ✅ **Separation of Concerns** - Business logic is independent from transport layer
5. ✅ **CLI Convenience** - Tasks can be run locally without starting the server
6. ✅ **Backward Compatibility** - HTTP API remains unchanged
