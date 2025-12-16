] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:37:56 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27778,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:37:56 [0] [SSOServer] [ERROR] +202ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27778,"stdout":null,"stderr":null}}
2025-12-01 17:37:57 [0] [TestManager] [INFO] +5934ms failed OAuth User Creation - new user (5.93s)
  ✘  9 …› OAuth User Creation - new user @sso-common @sso-external @slow (retry #2) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
     10 …Authentication with Logto › Logto infrastructure is available @sso-external @slow
2025-12-01 17:37:57 [9] [TestManager] [INFO] +268ms Starting test: "Logto infrastructure is available"
2025-12-01 17:37:57 [0] [AppServer] [INFO] +299ms Launching Syngrisi app server
2025-12-01 17:37:57 [0] [backend] [INFO] +236ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
2025-12-01 17:37:57 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
2025-12-01 17:38:03 [0] [AppServer] [SUCCESS] +5527ms Server launched successfully
2025-12-01 17:38:03 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:03 [0] [AppServer] [INFO] +1ms Server: localhost:3002
2025-12-01 17:38:03 [0] [SSOServer] [INFO] +5851ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:03 [0] [SSOServer] [INFO] +9ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:03 [0] [SSOServer] [INFO] +5ms Starting Logto SSO infrastructure...
17:38:03 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:03 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27816,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:03 [0] [SSOServer] [ERROR] +198ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27816,"stdout":null,"stderr":null}}
2025-12-01 17:38:03 [0] [TestManager] [INFO] +5942ms failed Logto infrastructure is available (5.94s)
  ✘  10 …ication with Logto › Logto infrastructure is available @sso-external @slow (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
     11 …ion with Logto › Logto infrastructure is available @sso-external @slow (retry #1)
2025-12-01 17:38:04 [10] [TestManager] [INFO] +268ms Starting test: "Logto infrastructure is available"
2025-12-01 17:38:04 [0] [AppServer] [INFO] +301ms Launching Syngrisi app server
2025-12-01 17:38:04 [0] [backend] [INFO] +233ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
2025-12-01 17:38:04 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
2025-12-01 17:38:09 [0] [AppServer] [SUCCESS] +5527ms Server launched successfully
2025-12-01 17:38:09 [0] [AppServer] [INFO] +0ms Base URL: http://localhost:3002
2025-12-01 17:38:09 [0] [AppServer] [INFO] +1ms Server: localhost:3002
2025-12-01 17:38:10 [0] [SSOServer] [INFO] +5849ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:10 [0] [SSOServer] [INFO] +8ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:10 [0] [SSOServer] [INFO] +6ms Starting Logto SSO infrastructure...
17:38:10 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:10 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27853,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:10 [0] [SSOServer] [ERROR] +203ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27853,"stdout":null,"stderr":null}}
2025-12-01 17:38:10 [0] [TestManager] [INFO] +5947ms failed Logto infrastructure is available (5.95s)
  ✘  11 …h Logto › Logto infrastructure is available @sso-external @slow (retry #1) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
     12 …ion with Logto › Logto infrastructure is available @sso-external @slow (retry #2)
2025-12-01 17:38:10 [11] [TestManager] [INFO] +269ms Starting test: "Logto infrastructure is available"
2025-12-01 17:38:10 [0] [AppServer] [INFO] +301ms Launching Syngrisi app server
2025-12-01 17:38:11 [0] [backend] [INFO] +229ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
2025-12-01 17:38:11 [0] [backend] [INFO] +0ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
2025-12-01 17:38:16 [0] [AppServer] [SUCCESS] +5529ms Server launched successfully
2025-12-01 17:38:16 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:16 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:16 [0] [SSOServer] [INFO] +5852ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:16 [0] [SSOServer] [INFO] +8ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:16 [0] [SSOServer] [INFO] +6ms Starting Logto SSO infrastructure...
17:38:16 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:16 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27896,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:16 [0] [SSOServer] [ERROR] +203ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27896,"stdout":null,"stderr":null}}
2025-12-01 17:38:16 [0] [TestManager] [INFO] +5949ms failed Logto infrastructure is available (5.95s)
  ✘  12 …h Logto › Logto infrastructure is available @sso-external @slow (retry #2) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
     13 …Authentication with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow
2025-12-01 17:38:17 [12] [TestManager] [INFO] +266ms Starting test: "Full OAuth2 Login Flow with Logto"
2025-12-01 17:38:17 [0] [AppServer] [INFO] +298ms Launching Syngrisi app server
2025-12-01 17:38:17 [0] [backend] [INFO] +233ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
2025-12-01 17:38:17 [0] [backend] [INFO] +0ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
2025-12-01 17:38:23 [0] [AppServer] [SUCCESS] +5529ms Server launched successfully
2025-12-01 17:38:23 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:23 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:23 [0] [SSOServer] [INFO] +5854ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:23 [0] [SSOServer] [INFO] +7ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:23 [0] [SSOServer] [INFO] +6ms Starting Logto SSO infrastructure...
17:38:23 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:23 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27931,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:23 [0] [SSOServer] [ERROR] +202ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27931,"stdout":null,"stderr":null}}
2025-12-01 17:38:23 [0] [TestManager] [INFO] +5949ms failed Full OAuth2 Login Flow with Logto (5.95s)
  ✘  13 …ication with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
     14 …ion with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow (retry #1)
2025-12-01 17:38:24 [13] [TestManager] [INFO] +265ms Starting test: "Full OAuth2 Login Flow with Logto"
2025-12-01 17:38:24 [0] [AppServer] [INFO] +296ms Launching Syngrisi app server
2025-12-01 17:38:24 [0] [backend] [INFO] +231ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
2025-12-01 17:38:24 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
2025-12-01 17:38:29 [0] [AppServer] [SUCCESS] +5525ms Server launched successfully
2025-12-01 17:38:29 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:29 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:29 [0] [SSOServer] [INFO] +5834ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:29 [0] [SSOServer] [INFO] +8ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:29 [0] [SSOServer] [INFO] +6ms Starting Logto SSO infrastructure...
17:38:29 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:30 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 27976,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:30 [0] [SSOServer] [ERROR] +204ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":27976,"stdout":null,"stderr":null}}
2025-12-01 17:38:30 [0] [TestManager] [INFO] +5934ms failed Full OAuth2 Login Flow with Logto (5.93s)
  ✘  14 …h Logto › Full OAuth2 Login Flow with Logto @sso-external @slow (retry #1) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
     15 …ion with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow (retry #2)
2025-12-01 17:38:30 [14] [TestManager] [INFO] +272ms Starting test: "Full OAuth2 Login Flow with Logto"
2025-12-01 17:38:30 [0] [AppServer] [INFO] +302ms Launching Syngrisi app server
2025-12-01 17:38:31 [0] [backend] [INFO] +238ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ✅ audit secrets and track compliance: https://dotenvx.com/ops
2025-12-01 17:38:31 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
2025-12-01 17:38:36 [0] [AppServer] [SUCCESS] +5529ms Server launched successfully
2025-12-01 17:38:36 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:36 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:36 [0] [SSOServer] [INFO] +5842ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:36 [0] [SSOServer] [INFO] +9ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:36 [0] [SSOServer] [INFO] +5ms Starting Logto SSO infrastructure...
17:38:36 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:36 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 28004,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:36 [0] [SSOServer] [ERROR] +202ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":28004,"stdout":null,"stderr":null}}
2025-12-01 17:38:36 [0] [TestManager] [INFO] +5936ms failed Full OAuth2 Login Flow with Logto (5.93s)
  ✘  15 …h Logto › Full OAuth2 Login Flow with Logto @sso-external @slow (retry #2) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
     16 …tication with Logto › Local Auth Fallback works with real SSO @sso-external @slow
2025-12-01 17:38:37 [15] [TestManager] [INFO] +269ms Starting test: "Local Auth Fallback works with real SSO"
2025-12-01 17:38:37 [0] [AppServer] [INFO] +301ms Launching Syngrisi app server
2025-12-01 17:38:37 [0] [backend] [INFO] +240ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
2025-12-01 17:38:37 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
2025-12-01 17:38:43 [0] [AppServer] [SUCCESS] +5534ms Server launched successfully
2025-12-01 17:38:43 [0] [AppServer] [INFO] +0ms Base URL: http://localhost:3002
2025-12-01 17:38:43 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:43 [0] [SSOServer] [INFO] +5854ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:43 [0] [SSOServer] [INFO] +13ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:43 [0] [SSOServer] [INFO] +7ms Starting Logto SSO infrastructure...
17:38:43 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:43 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 28065,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:43 [0] [SSOServer] [ERROR] +236ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":28065,"stdout":null,"stderr":null}}
2025-12-01 17:38:43 [0] [TestManager] [INFO] +5992ms failed Local Auth Fallback works with real SSO (5.99s)
  ✘  16 …n with Logto › Local Auth Fallback works with real SSO @sso-external @slow (6.1s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
     17 …th Logto › Local Auth Fallback works with real SSO @sso-external @slow (retry #1)
2025-12-01 17:38:44 [16] [TestManager] [INFO] +327ms Starting test: "Local Auth Fallback works with real SSO"
2025-12-01 17:38:44 [0] [AppServer] [INFO] +360ms Launching Syngrisi app server
2025-12-01 17:38:44 [0] [backend] [INFO] +276ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
2025-12-01 17:38:44 [0] [backend] [INFO] +0ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
2025-12-01 17:38:49 [0] [AppServer] [SUCCESS] +5522ms Server launched successfully
2025-12-01 17:38:49 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:38:49 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:49 [0] [SSOServer] [INFO] +5891ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:49 [0] [SSOServer] [INFO] +10ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:49 [0] [SSOServer] [INFO] +8ms Starting Logto SSO infrastructure...
17:38:49 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:50 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 29454,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:50 [0] [SSOServer] [ERROR] +240ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":29454,"stdout":null,"stderr":null}}
2025-12-01 17:38:50 [0] [TestManager] [INFO] +6053ms failed Local Auth Fallback works with real SSO (6.05s)
  ✘  17 …o › Local Auth Fallback works with real SSO @sso-external @slow (retry #1) (6.1s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
     18 …th Logto › Local Auth Fallback works with real SSO @sso-external @slow (retry #2)
2025-12-01 17:38:51 [17] [TestManager] [INFO] +608ms Starting test: "Local Auth Fallback works with real SSO"
2025-12-01 17:38:51 [0] [AppServer] [INFO] +654ms Launching Syngrisi app server
2025-12-01 17:38:52 [0] [backend] [INFO] +429ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
2025-12-01 17:38:52 [0] [backend] [INFO] +0ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
2025-12-01 17:38:57 [0] [AppServer] [SUCCESS] +6031ms Server launched successfully
2025-12-01 17:38:57 [0] [AppServer] [INFO] +0ms Base URL: http://localhost:3002
2025-12-01 17:38:57 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:38:58 [0] [SSOServer] [INFO] +6611ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:38:58 [0] [SSOServer] [INFO] +15ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:38:58 [0] [SSOServer] [INFO] +12ms Starting Logto SSO infrastructure...
17:38:58 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:38:58 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 31763,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:38:58 [0] [SSOServer] [ERROR] +250ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":31763,"stdout":null,"stderr":null}}
2025-12-01 17:38:58 [0] [TestManager] [INFO] +6585ms failed Local Auth Fallback works with real SSO (6.58s)
  ✘  18 …o › Local Auth Fallback works with real SSO @sso-external @slow (retry #2) (6.7s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
     19 …ion with SAML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml
2025-12-01 17:38:59 [18] [TestManager] [INFO] +475ms Starting test: "Full SAML Login Flow with Logto IdP"
2025-12-01 17:38:59 [0] [AppServer] [INFO] +537ms Launching Syngrisi app server
2025-12-01 17:38:59 [0] [backend] [INFO] +298ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
2025-12-01 17:38:59 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ✅ audit secrets and track compliance: https://dotenvx.com/ops
2025-12-01 17:39:05 [0] [AppServer] [SUCCESS] +6044ms Server launched successfully
2025-12-01 17:39:05 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:39:05 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:39:05 [0] [SSOServer] [INFO] +6482ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:05 [0] [SSOServer] [INFO] +11ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:05 [0] [SSOServer] [INFO] +8ms Starting Logto SSO infrastructure...
17:39:05 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:06 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 33883,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:06 [0] [SSOServer] [ERROR] +219ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":33883,"stdout":null,"stderr":null}}
2025-12-01 17:39:06 [0] [TestManager] [INFO] +6515ms failed Full SAML Login Flow with Logto IdP (6.51s)
  ✘  19 …h SAML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml (6.6s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
     20 …ML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml (retry #1)
2025-12-01 17:39:07 [19] [TestManager] [INFO] +504ms Starting test: "Full SAML Login Flow with Logto IdP"
2025-12-01 17:39:07 [0] [AppServer] [INFO] +550ms Launching Syngrisi app server
2025-12-01 17:39:07 [0] [backend] [INFO] +366ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
2025-12-01 17:39:07 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
2025-12-01 17:39:13 [0] [AppServer] [SUCCESS] +6039ms Server launched successfully
2025-12-01 17:39:13 [0] [AppServer] [INFO] +3ms Base URL: http://localhost:3002
2025-12-01 17:39:13 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:39:13 [0] [SSOServer] [INFO] +7128ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:13 [0] [SSOServer] [INFO] +21ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:13 [0] [SSOServer] [INFO] +14ms Starting Logto SSO infrastructure...
17:39:13 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:14 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 35093,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:14 [0] [SSOServer] [ERROR] +394ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":35093,"stdout":null,"stderr":null}}
2025-12-01 17:39:14 [0] [TestManager] [INFO] +7305ms failed Full SAML Login Flow with Logto IdP (7.30s)
  ✘  20 …› Full SAML Login Flow with Logto IdP @sso-external @slow @saml (retry #1) (7.4s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
     21 …ML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml (retry #2)
2025-12-01 17:39:17 [20] [TestManager] [INFO] +1599ms Starting test: "Full SAML Login Flow with Logto IdP"
2025-12-01 17:39:17 [0] [AppServer] [INFO] +1703ms Launching Syngrisi app server
2025-12-01 17:39:18 [0] [backend] [INFO] +939ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
2025-12-01 17:39:18 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
2025-12-01 17:39:24 [0] [AppServer] [SUCCESS] +7692ms Server launched successfully
2025-12-01 17:39:24 [0] [AppServer] [INFO] +3ms Base URL: http://localhost:3002
2025-12-01 17:39:24 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:39:25 [0] [SSOServer] [INFO] +9443ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:25 [0] [SSOServer] [INFO] +52ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:25 [0] [SSOServer] [INFO] +36ms Starting Logto SSO infrastructure...
17:39:25 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:26 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 36303,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:26 [0] [SSOServer] [ERROR] +746ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":36303,"stdout":null,"stderr":null}}
2025-12-01 17:39:26 [0] [TestManager] [INFO] +9795ms failed Full SAML Login Flow with Logto IdP (9.79s)
  ✘  21 … Full SAML Login Flow with Logto IdP @sso-external @slow @saml (retry #2) (10.1s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
     22 …h SAML 2.0 › SAML Account Linking - existing local user @sso-external @slow @saml
2025-12-01 17:39:30 [21] [TestManager] [INFO] +1645ms Starting test: "SAML Account Linking - existing local user"
2025-12-01 17:39:30 [0] [AppServer] [INFO] +1762ms Launching Syngrisi app server
2025-12-01 17:39:31 [0] [backend] [INFO] +1197ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
2025-12-01 17:39:31 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
2025-12-01 17:39:39 [0] [AppServer] [SUCCESS] +9147ms Server launched successfully
2025-12-01 17:39:39 [0] [AppServer] [INFO] +2ms Base URL: http://localhost:3002
2025-12-01 17:39:39 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:39:40 [0] [SSOServer] [INFO] +11155ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:40 [0] [SSOServer] [INFO] +40ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:40 [0] [SSOServer] [INFO] +12ms Starting Logto SSO infrastructure...
17:39:40 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:40 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 38051,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:40 [0] [SSOServer] [ERROR] +396ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":38051,"stdout":null,"stderr":null}}
2025-12-01 17:39:40 [0] [TestManager] [INFO] +10758ms failed SAML Account Linking - existing local user (10.76s)
  ✘  22 ….0 › SAML Account Linking - existing local user @sso-external @slow @saml (11.3s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
     23 …› SAML Account Linking - existing local user @sso-external @slow @saml (retry #1)
2025-12-01 17:39:42 [22] [TestManager] [INFO] +757ms Starting test: "SAML Account Linking - existing local user"
2025-12-01 17:39:42 [0] [AppServer] [INFO] +849ms Launching Syngrisi app server
2025-12-01 17:39:43 [0] [backend] [INFO] +579ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
2025-12-01 17:39:43 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
2025-12-01 17:39:48 [0] [AppServer] [SUCCESS] +6033ms Server launched successfully
2025-12-01 17:39:48 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:39:48 [0] [AppServer] [INFO] +13ms Server: localhost:3002
2025-12-01 17:39:49 [0] [SSOServer] [INFO] +6947ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:49 [0] [SSOServer] [INFO] +18ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:49 [0] [SSOServer] [INFO] +18ms Starting Logto SSO infrastructure...
17:39:49 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:49 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 39951,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:49 [0] [SSOServer] [ERROR] +387ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":39951,"stdout":null,"stderr":null}}
2025-12-01 17:39:49 [0] [TestManager] [INFO] +6994ms failed SAML Account Linking - existing local user (6.99s)
  ✘  23 …Account Linking - existing local user @sso-external @slow @saml (retry #1) (7.2s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
     24 …› SAML Account Linking - existing local user @sso-external @slow @saml (retry #2)
2025-12-01 17:39:51 [23] [TestManager] [INFO] +563ms Starting test: "SAML Account Linking - existing local user"
2025-12-01 17:39:51 [0] [AppServer] [INFO] +618ms Launching Syngrisi app server
2025-12-01 17:39:51 [0] [backend] [INFO] +451ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
2025-12-01 17:39:51 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
2025-12-01 17:39:57 [0] [AppServer] [SUCCESS] +6041ms Server launched successfully
2025-12-01 17:39:57 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:39:57 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:39:57 [0] [SSOServer] [INFO] +6713ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:39:57 [0] [SSOServer] [INFO] +17ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:39:57 [0] [SSOServer] [INFO] +11ms Starting Logto SSO infrastructure...
17:39:57 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:39:57 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 41901,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:39:57 [0] [SSOServer] [ERROR] +277ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":41901,"stdout":null,"stderr":null}}
2025-12-01 17:39:57 [0] [TestManager] [INFO] +6812ms failed SAML Account Linking - existing local user (6.81s)
  ✘  24 …Account Linking - existing local user @sso-external @slow @saml (retry #2) (6.9s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
     25 …ntication with SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml
2025-12-01 17:39:59 [24] [TestManager] [INFO] +485ms Starting test: "SAML User Creation - new user"
2025-12-01 17:39:59 [0] [AppServer] [INFO] +533ms Launching Syngrisi app server
2025-12-01 17:39:59 [0] [backend] [INFO] +498ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
2025-12-01 17:39:59 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
2025-12-01 17:40:05 [0] [AppServer] [SUCCESS] +6032ms Server launched successfully
2025-12-01 17:40:05 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:40:05 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:40:05 [0] [SSOServer] [INFO] +6473ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:40:05 [0] [SSOServer] [INFO] +9ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:40:05 [0] [SSOServer] [INFO] +6ms Starting Logto SSO infrastructure...
17:40:05 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:40:05 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 43093,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:40:05 [0] [SSOServer] [ERROR] +211ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":43093,"stdout":null,"stderr":null}}
2025-12-01 17:40:05 [0] [TestManager] [INFO] +6529ms failed SAML User Creation - new user (6.53s)
  ✘  25 …on with SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml (6.6s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
     26 …ith SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml (retry #1)
2025-12-01 17:40:06 [25] [TestManager] [INFO] +320ms Starting test: "SAML User Creation - new user"
2025-12-01 17:40:06 [0] [AppServer] [INFO] +353ms Launching Syngrisi app server
2025-12-01 17:40:06 [0] [backend] [INFO] +236ms [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
2025-12-01 17:40:06 [0] [backend] [INFO] +1ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
2025-12-01 17:40:12 [0] [AppServer] [SUCCESS] +5521ms Server launched successfully
2025-12-01 17:40:12 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:40:12 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:40:12 [0] [SSOServer] [INFO] +5857ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:40:12 [0] [SSOServer] [INFO] +10ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:40:12 [0] [SSOServer] [INFO] +7ms Starting Logto SSO infrastructure...
17:40:12 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:40:12 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 43874,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:40:12 [0] [SSOServer] [ERROR] +216ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":43874,"stdout":null,"stderr":null}}
2025-12-01 17:40:12 [0] [TestManager] [INFO] +5949ms failed SAML User Creation - new user (5.95s)
  ✘  26 …L 2.0 › SAML User Creation - new user @sso-external @slow @saml (retry #1) (6.0s)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
     27 …ith SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml (retry #2)
2025-12-01 17:40:13 [26] [TestManager] [INFO] +299ms Starting test: "SAML User Creation - new user"
2025-12-01 17:40:13 [0] [AppServer] [INFO] +333ms Launching Syngrisi app server
2025-12-01 17:40:13 [0] [backend] [INFO] +235ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
2025-12-01 17:40:13 [0] [backend] [INFO] +0ms [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
2025-12-01 17:40:18 [0] [AppServer] [SUCCESS] +5528ms Server launched successfully
2025-12-01 17:40:18 [0] [AppServer] [INFO] +1ms Base URL: http://localhost:3002
2025-12-01 17:40:18 [0] [AppServer] [INFO] +0ms Server: localhost:3002
2025-12-01 17:40:18 [0] [SSOServer] [INFO] +5868ms Loaded provisioned config from provisioned-config.json
2025-12-01 17:40:19 [0] [SSOServer] [INFO] +8ms Logto not running, but container CLI available - auto-starting...
2025-12-01 17:40:19 [0] [SSOServer] [INFO] +5ms Starting Logto SSO infrastructure...
17:40:19 [INFO] [LogtoManager] Starting SSO infrastructure...
[INFO] Starting SSO test infrastructure...
[INFO] Postgres port: 5433
[INFO] Logto port: 3001
[INFO] Logto Admin port: 3050
[INFO] Cleaning up old containers...
[INFO] Creating SSO network...
[INFO] Network already exists or created
[INFO] Starting Postgres container...
Error: interrupted: "interrupted: "XPC connection error: Connection invalid"
Ensure container system service has been started with `container system start`."
17:40:19 [ERROR] [LogtoManager] Failed to start SSO infrastructure
{
  error: Error: Command failed: bash "/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/start-containers.sh"
      at genericNodeError (node:internal/errors:984:15)
      at wrappedFn (node:internal/errors:538:14)
      at checkExecSyncError (node:child_process:891:11)
      at execSync (node:child_process:963:15)
      at startLogtoInfrastructure (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:114:13)
      at LogtoTestManager.startAndProvision (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:345:25)
      at LogtoTestManager.ensureStarted (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/sso/logto-manager.ts:331:30)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at Object.startLogto (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:163:26)
      at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope [as fn] (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:297:15)
      at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/node_modules/playwright/lib/worker/fixtureRunner.js:98:9 {
    status: 1,
    signal: null,
    output: [ null, null, null ],
    pid: 44036,
    stdout: null,
    stderr: null
  }
}
2025-12-01 17:40:19 [0] [SSOServer] [ERROR] +201ms Failed to auto-start Logto {"error":{"status":1,"signal":null,"output":[null,null,null],"pid":44036,"stdout":null,"stderr":null}}
2025-12-01 17:40:19 [0] [TestManager] [INFO] +5942ms failed SAML User Creation - new user (5.94s)
  ✘  27 …L 2.0 › SAML User Creation - new user @sso-external @slow @saml (retry #2) (6.0s)


  1) [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:23:7 › SSO Common Scenarios and Edge Cases › Logout functionality clears session @sso-common @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-1a3e4-unctionality-clears-session-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  2) [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:39:7 › SSO Common Scenarios and Edge Cases › OAuth Account Linking - existing local user @sso-common @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-f8219-nking---existing-local-user-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  3) [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:54:7 › SSO Common Scenarios and Edge Cases › OAuth User Creation - new user @sso-common @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_common.f-09786-th-User-Creation---new-user-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  4) [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:12:7 › SSO Authentication with Logto › Logto infrastructure is available @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-30984-infrastructure-is-available-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  5) [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:16:7 › SSO Authentication with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ✅ audit secrets and track compliance: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-f3e65-Auth2-Login-Flow-with-Logto-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  6) [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:28:7 › SSO Authentication with Logto › Local Auth Fallback works with real SSO @sso-external @slow 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_logto.fe-9c732-allback-works-with-real-SSO-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  7) [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:12:7 › SSO Authentication with SAML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ✅ audit secrets and track compliance: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f2ea4-L-Login-Flow-with-Logto-IdP-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  8) [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:23:7 › SSO Authentication with SAML 2.0 › SAML Account Linking - existing local user @sso-external @slow @saml 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-f803b-nking---existing-local-user-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  9) [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:34:7 › SSO Authentication with SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml 

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry1/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry1/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry1/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

    Retry #2 ─────────────────────────────────────────────────────────────────────────────

    Error: External Logto not available and auto-start failed

       at ../support/fixtures/sso-server.fixture.ts:301

      299 |             } catch (error) {
      300 |               logger.error('Failed to auto-start Logto', { error });
    > 301 |               throw new Error('External Logto not available and auto-start failed');
          |                     ^
      302 |             }
      303 |           } else {
      304 |             logger.error('Test expects external Logto (@sso-external) but it is not running');
        at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

    attachment #1: screenshot (image/png) ────────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry2/test-failed-1.png
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #2: backend-logs.txt (text/plain) ─────────────────────────────────────────
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops
    [dotenv@17.2.3] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
    
    ──────────────────────────────────────────────────────────────────────────────────────

    attachment #3: trace (application/zip) ───────────────────────────────────────────────
    reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry2/trace.zip
    Usage:

        yarn playwright show-trace reports/test-artifacts/features-AUTH-sso_saml.fea-7c396-ML-User-Creation---new-user-chromium-retry2/trace.zip

    ──────────────────────────────────────────────────────────────────────────────────────

  9 failed
    [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:23:7 › SSO Common Scenarios and Edge Cases › Logout functionality clears session @sso-common @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:39:7 › SSO Common Scenarios and Edge Cases › OAuth Account Linking - existing local user @sso-common @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_common.feature.spec.js:54:7 › SSO Common Scenarios and Edge Cases › OAuth User Creation - new user @sso-common @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:12:7 › SSO Authentication with Logto › Logto infrastructure is available @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:16:7 › SSO Authentication with Logto › Full OAuth2 Login Flow with Logto @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_logto.feature.spec.js:28:7 › SSO Authentication with Logto › Local Auth Fallback works with real SSO @sso-external @slow 
    [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:12:7 › SSO Authentication with SAML 2.0 › Full SAML Login Flow with Logto IdP @sso-external @slow @saml 
    [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:23:7 › SSO Authentication with SAML 2.0 › SAML Account Linking - existing local user @sso-external @slow @saml 
    [chromium] › .features-gen/features/AUTH/sso_saml.feature.spec.js:34:7 › SSO Authentication with SAML 2.0 › SAML User Creation - new user @sso-external @slow @saml 
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
$ mkdir -p reports/blob-combined && cp reports/blob-parallel/*.zip reports/blob-combined/ 2>/dev/null || true && cp reports/blob-sso/*.zip reports/blob-combined/ 2>/dev/null || true
$ cross-env PLAYWRIGHT_HTML_REPORT=reports/playwright-report PW_TEST_HTML_REPORT_OPEN=never playwright merge-reports --reporter=html,json ./reports/blob-combined > reports/report.json
$ node support/stats.js

==================================================
             FAILED TESTS
==================================================

1) Access to admin Panel > Open Admin Panel as Anonymous User
   File: features/AP/access.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:11:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:11:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:11:5

2) Access to admin Panel > Open Admin Panel behalf of User role
   File: features/AP/access.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:19:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:19:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:19:5

3) Access to admin Panel > Open Admin Panel behalf of Reviewer role
   File: features/AP/access.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:26:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:26:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/access.feature.spec.js:26:5

4) Log Basics > Check Infinity scroll
   File: features/AP/logs/logs_basics.feature.spec.js
   Attempt 1:
   Error: Test timeout of 300000ms exceeded while running "beforeEach" hook.
   Stack:
     Test timeout of 300000ms exceeded while running "beforeEach" hook.
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_basics.feature.spec.js:7:8
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_basics.feature.spec.js:10:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_basics.feature.spec.js:10:5

5) Logs Table Filter > Main Group, Single Rule
   File: features/AP/logs/logs_filtering.feature.spec.js
   Attempt 1:
   Error: Test timeout of 300000ms exceeded while running "beforeEach" hook.
   Stack:
     Test timeout of 300000ms exceeded while running "beforeEach" hook.
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_filtering.feature.spec.js:7:8
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_filtering.feature.spec.js:10:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_filtering.feature.spec.js:10:5

6) Logs Table Settings > Set visible Columns
   File: features/AP/logs/logs_settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_settings.feature.spec.js:9:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_settings.feature.spec.js:9:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/logs/logs_settings.feature.spec.js:9:5

7) Admin Settings > Change Admin Settings - Enable Auth
   File: features/AP/settings/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:9:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:9:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:9:5

8) Admin Settings > Change Admin Settings - First Run
   File: features/AP/settings/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:26:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:26:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:26:5

9) Admin Settings > Configure auto remove old checks setting
   File: features/AP/settings/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:47:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:47:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:47:5

10) Admin Settings > Configure auto remove old logs setting
   File: features/AP/settings/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:57:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:57:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/settings/settings.feature.spec.js:57:5

11) Task - Remove old checks > Handle old checks task removes outdated items from Admin UI when Dry run is disabled
   File: features/AP/tasks/remove_old_checks.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/tasks/remove_old_checks.feature.spec.js:136:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/tasks/remove_old_checks.feature.spec.js:136:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/tasks/remove_old_checks.feature.spec.js:136:5

12) API key generation > Smoke API key generation
   File: features/AP/users/api_key_generation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/api_key_generation.feature.spec.js:18:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/api_key_generation.feature.spec.js:18:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/api_key_generation.feature.spec.js:18:5

13) Create User > Create User - Success
   File: features/AP/users/create.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:19:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:19:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:19:5

14) Create User > Create User - User Already Exist
   File: features/AP/users/create.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:39:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:39:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:39:5

15) Create User > Create User - Invalid fields
   File: features/AP/users/create.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:60:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:60:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/create.feature.spec.js:60:5

16) Default Users > Default Administrator and Guest should be created after first server start
   File: features/AP/users/default_users.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/default_users.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/default_users.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/default_users.feature.spec.js:17:5

17) Delete User > Delete User - Success
   File: features/AP/users/delete.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/delete.feature.spec.js:19:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/delete.feature.spec.js:19:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/delete.feature.spec.js:19:5

18) Update User > Update User - Success
   File: features/AP/users/update.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/update.feature.spec.js:19:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/update.feature.spec.js:19:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AP/users/update.feature.spec.js:19:5

19) Change Password > Change Password - Smoke
   File: features/AUTH/change_passwords.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5

20) Change Password > Change Password - User not Logged In
   File: features/AUTH/change_passwords.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5

21) Change Password > Change Password - Wrong Current Password
   File: features/AUTH/change_passwords.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5

22) Change Password > Change Password - Validation
   File: features/AUTH/change_passwords.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/change_passwords.feature.spec.js:17:5

23) First run > Change Administrator password and login to system
   File: features/AUTH/first_run.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/first_run.feature.spec.js:11:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/first_run.feature.spec.js:11:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/first_run.feature.spec.js:11:5

24) Logout > Logout - default Test user
   File: features/AUTH/logout.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/logout.feature.spec.js:17:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/logout.feature.spec.js:17:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/logout.feature.spec.js:17:5

25) SSO Common Scenarios and Edge Cases > Login attempt when SSO is disabled
   File: features/AUTH/sso_common.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:10:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:10:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:10:5

26) SSO Common Scenarios and Edge Cases > SSO button visibility based on configuration
   File: features/AUTH/sso_common.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:72:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:72:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/AUTH/sso_common.feature.spec.js:72:5

27) SSO Common Scenarios and Edge Cases > Logout functionality clears session
   File: features/AUTH/sso_common.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

28) SSO Common Scenarios and Edge Cases > OAuth Account Linking - existing local user
   File: features/AUTH/sso_common.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

29) SSO Common Scenarios and Edge Cases > OAuth User Creation - new user
   File: features/AUTH/sso_common.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

30) Accept by user > Accept by user
   File: features/CHECKS_HANDLING/accept_by_user.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/accept_by_user.feature.spec.js:23:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/accept_by_user.feature.spec.js:23:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/accept_by_user.feature.spec.js:23:5

31) Checks with different resolutions 1px > Two checks with identical image parts but different resolutions [1px, bottom]
   File: features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature.spec.js:12:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature.spec.js:12:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature.spec.js:12:5

32) Partially Accepted Test > Partially Accepted Test
   File: features/CHECKS_HANDLING/partially_accepted.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/partially_accepted.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/partially_accepted.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/partially_accepted.feature.spec.js:7:5

33) Remove checks > Remove check via check preview
   File: features/CHECKS_HANDLING/remove_checks.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5

34) Remove checks > Remove check via Check Details Modal
   File: features/CHECKS_HANDLING/remove_checks.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/remove_checks.feature.spec.js:7:5

35) Standard Checks Flow - UI > Status View - Standard Flow
   File: features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5

36) Standard Checks Flow - UI > Status View - Not Accepted
   File: features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5

37) Standard Checks Flow - UI > Status View - Wrong Size
   File: features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/standard_flow_ui.feature.spec.js:7:5

38) Test calculated fields > Same viewports - [50x50, 50x50]
   File: features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5

39) Test calculated fields > Different viewports - [50x50, 100x100]
   File: features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5

40) Test calculated fields > Same viewports - [new, new]
   File: features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5

41) Test calculated fields > Same viewports - [new, passed]
   File: features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5

42) Test calculated fields > Same viewports - [passed, failed]
   File: features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CHECKS_HANDLING/test_calculated_fields.feature.spec.js:7:5

43) Baselines Access Control > Admin sees all baselines
   File: features/CP/baselines/baselines_access.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_access.feature.spec.js:15:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_access.feature.spec.js:15:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_access.feature.spec.js:15:5

44) Baselines View UI Debug > Debug baselines page load
   File: features/CP/baselines/baselines_debug.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_debug.feature.spec.js:13:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_debug.feature.spec.js:13:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_debug.feature.spec.js:13:5

45) Baselines View Demo > Demo Baselines View - Table, Filtering and Navigation
   File: features/CP/baselines/baselines_demo.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_demo.feature.spec.js:14:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_demo.feature.spec.js:14:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_demo.feature.spec.js:14:5

46) Baselines View Extended Coverage > Verify Default Data Loaded
   File: features/CP/baselines/baselines_extended.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_extended.feature.spec.js:14:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_extended.feature.spec.js:14:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_extended.feature.spec.js:14:5

47) Baselines View UI > Navigate to Baselines page and verify content
   File: features/CP/baselines/baselines_ui.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:13:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:13:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:13:5

48) Baselines View UI > Filter tests by clicking baseline
   File: features/CP/baselines/baselines_ui.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:21:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:21:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/baselines/baselines_ui.feature.spec.js:21:5

49) Check details Related Checks - Navigation and Accept > Related - Navigation via Related Panel and Accept second Check
   File: features/CP/check_details/accept_via_details.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/accept_via_details.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/accept_via_details.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/accept_via_details.feature.spec.js:7:5

50) Check Detail Appearance > Check Detail Appearance
   File: features/CP/check_details/appearance_common.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/appearance_common.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/appearance_common.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/appearance_common.feature.spec.js:7:5

51) Enabled disabled buttons on Check Details Modal Window > New Check
   File: features/CP/check_details/apperance_enabled_buttons.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5

52) Enabled disabled buttons on Check Details Modal Window > Passed Check
   File: features/CP/check_details/apperance_enabled_buttons.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5

53) Enabled disabled buttons on Check Details Modal Window > Passed Check with Ignore Regions
   File: features/CP/check_details/apperance_enabled_buttons.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5

54) Enabled disabled buttons on Check Details Modal Window > Failed Check
   File: features/CP/check_details/apperance_enabled_buttons.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5

55) Enabled disabled buttons on Check Details Modal Window > Failed Check difference more than 5%
   File: features/CP/check_details/apperance_enabled_buttons.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/apperance_enabled_buttons.feature.spec.js:7:5

56) Check Details Difference Highlight > Check Details Difference Highlight
   File: features/CP/check_details/heighlight.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/heighlight.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/heighlight.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/heighlight.feature.spec.js:7:5

57) Check Details - Initial image resize > Image fit in the viewport
   File: features/CP/check_details/initial_resize.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:9:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:9:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:9:5

58) Check Details - Initial image resize > Image is too small
   File: features/CP/check_details/initial_resize.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:23:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:23:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:23:5

59) Check Details - Initial image resize > Image is too high
   File: features/CP/check_details/initial_resize.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:37:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:37:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:37:5

60) Check Details - Initial image resize > Image is too wide
   File: features/CP/check_details/initial_resize.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:51:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:51:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/initial_resize.feature.spec.js:51:5

61) Open/Close Check Details > Open/Close Check Details via click
   File: features/CP/check_details/open_close_check_details.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5

62) Open/Close Check Details > Open/Close Check Details via url
   File: features/CP/check_details/open_close_check_details.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/open_close_check_details.feature.spec.js:7:5

63) Check details - Regions > Regions - add, save, check
   File: features/CP/check_details/regions.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5

64) Check details - Regions > Regions - delete
   File: features/CP/check_details/regions.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5

65) Check details - Regions > Regions - copy regions from previous baseline
   File: features/CP/check_details/regions.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/regions.feature.spec.js:7:5

66) Check details Related Checks - Navigation and Accept > Related - Navigation via Related Panel and Accept second Check
   File: features/CP/check_details/related/related_navigation_and_accept.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation_and_accept.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation_and_accept.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation_and_accept.feature.spec.js:7:5

67) Check details Related Checks - Navigation > Related - Navigation via Related Panel
   File: features/CP/check_details/related/related_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related_navigation.feature.spec.js:7:5

68) Check details Related Checks > Related - same projects
   File: features/CP/check_details/related/related.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5

69) Check details Related Checks > Related - different projects
   File: features/CP/check_details/related/related.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5

70) Check details Related Checks > Related - sort by Date
   File: features/CP/check_details/related/related.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5

71) Check details Related Checks > Related - filter by Browser
   File: features/CP/check_details/related/related.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/related/related.feature.spec.js:8:5

72) Check details Resize and Pan > Resize Dropdown Usage
   File: features/CP/check_details/resize_and_pan.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5

73) Check details Resize and Pan > Resize via Ctrl + Mouse Wheel
   File: features/CP/check_details/resize_and_pan.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5

74) Check details Resize and Pan > Pan via central mouse button and Mouse Move
   File: features/CP/check_details/resize_and_pan.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5

75) Check details Resize and Pan > Pan via Mouse Wheel (touchpad)
   File: features/CP/check_details/resize_and_pan.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/resize_and_pan.feature.spec.js:7:5

76) Side to side view > Divider in the center
   File: features/CP/check_details/side_to_side_view.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/side_to_side_view.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/side_to_side_view.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/side_to_side_view.feature.spec.js:7:5

77) Simple Views - Expected, Actual, Diff > Simple Views (Expected, Actual, Diff)
   File: features/CP/check_details/simple_views.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/simple_views.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/simple_views.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/check_details/simple_views.feature.spec.js:7:5

78) Filter by project > Filter by Project
   File: features/CP/header/filter_by_project.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/filter_by_project.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/filter_by_project.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/filter_by_project.feature.spec.js:7:5

79) Spotlight Navigation - <keyword> > Spotlight Navigation - Results
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

80) Spotlight Navigation - <keyword> > Spotlight Navigation - Suite
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

81) Spotlight Navigation - <keyword> > Spotlight Navigation - Admin
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

82) Spotlight Navigation - <keyword> > Spotlight Navigation - Logs
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

83) Spotlight > Spotlight Appear
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

84) Spotlight > Spotlight - switch theme
   File: features/CP/header/spotlight_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/spotlight_navigation.feature.spec.js:7:5

85) Switch Color Theme > Switch Color Theme
   File: features/CP/header/switch_theme.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/switch_theme.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/switch_theme.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/switch_theme.feature.spec.js:7:5

86) User Information > Check User Menu Information
   File: features/CP/header/user_info.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/user_info.feature.spec.js:18:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/user_info.feature.spec.js:18:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/header/user_info.feature.spec.js:18:5

87) Checks Isolation by Test > Checks Isolation by Test
   File: features/CP/items_isolations/checks_by_test.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/checks_by_test.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/checks_by_test.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/checks_by_test.feature.spec.js:7:5

88) Filter by Project > Filter by Project
   File: features/CP/items_isolations/filter_by_project.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/filter_by_project.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/filter_by_project.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/filter_by_project.feature.spec.js:7:5

89) Test Isolation by Accept Status > Tests Isolation by Accept Status
   File: features/CP/items_isolations/tests_by_accept_status.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_accept_status.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_accept_status.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_accept_status.feature.spec.js:7:5

90) Test Isolation by Browser > Tests Isolation by Browser
   File: features/CP/items_isolations/tests_by_browser.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_browser.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_browser.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_browser.feature.spec.js:7:5

91) Test Isolation by Run > Tests Isolation by Run
   File: features/CP/items_isolations/tests_by_run.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5

92) Test Isolation by Run > Checks Isolation by Run - same name different ident
   File: features/CP/items_isolations/tests_by_run.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5

93) Test Isolation by Run > Checks Isolation by Run - same name same ident
   File: features/CP/items_isolations/tests_by_run.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_run.feature.spec.js:7:5

94) Test Isolation by Suite > Tests Isolation by Suite
   File: features/CP/items_isolations/tests_by_suite.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_suite.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_suite.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_suite.feature.spec.js:7:5

95) Test Isolation by Test Status > Tests Isolation by Test Status
   File: features/CP/items_isolations/tests_by_test_status.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_test_status.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_test_status.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/items_isolations/tests_by_test_status.feature.spec.js:7:5

96) Group by - <groupBy> > Group by - Runs
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

97) Group by - <groupBy> > Group by - Suites
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

98) Group by - <groupBy> > Group by - Browsers
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

99) Group by - <groupBy> > Group by - Platform
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

100) Group by - <groupBy> > Group by - Test Status
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

101) Group by - <groupBy> > Group by - Accept Status
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

102) Group by Navigation > Group by via Url
   File: features/CP/navbar/group_by_navigation.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by_navigation.feature.spec.js:7:5

103) Group by > Group by
   File: features/CP/navbar/group_by.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5

104) Group by > Group by after item select
   File: features/CP/navbar/group_by.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5

105) Group by > Group by via Url
   File: features/CP/navbar/group_by.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/group_by.feature.spec.js:7:5

106) Pagination > Pagination
   File: features/CP/navbar/pagination.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5

107) Pagination > Pagination - Suite
   File: features/CP/navbar/pagination.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/pagination.feature.spec.js:7:5

108) Navbar Quick Filtering > Quick Filtering
   File: features/CP/navbar/quick_filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5

109) Navbar Quick Filtering > Quick Filtering with project
   File: features/CP/navbar/quick_filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/quick_filtering.feature.spec.js:7:5

110) Navbar Refresh > Navbar Refresh
   File: features/CP/navbar/refresh.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/refresh.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/refresh.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/refresh.feature.spec.js:7:5

111) Remove item > Remove Run
   File: features/CP/navbar/remove_item.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5

112) Remove item > Remove Suite
   File: features/CP/navbar/remove_item.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/remove_item.feature.spec.js:7:5

113) Runs Ring Statuses > Runs Ring Statuses [PASSED, FILED, NEW]
   File: features/CP/navbar/runs_ring_status.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/runs_ring_status.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/runs_ring_status.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/runs_ring_status.feature.spec.js:7:5

114) Select Navbar Item > Select 1 and 2 items (hold the Meta key)
   File: features/CP/navbar/select.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5

115) Select Navbar Item > Select 1 item deselect via group by
   File: features/CP/navbar/select.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5

116) Select Navbar Item > Select one item via Url
   File: features/CP/navbar/select.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5

117) Select Navbar Item > Select two items via Url
   File: features/CP/navbar/select.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/select.feature.spec.js:7:5

118) Navbar Sorting > Sorting
   File: features/CP/navbar/sorting.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/sorting.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/sorting.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/navbar/sorting.feature.spec.js:7:5

119) Test Auto Update > Update Table with new Tests
   File: features/CP/table/auto_update.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/auto_update.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/auto_update.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/auto_update.feature.spec.js:7:5

120) Bulk test Apply > Apply 2 tests
   File: features/CP/table/bulk_test_apply.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_apply.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_apply.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_apply.feature.spec.js:7:5

121) Bulk test Delete > Delete 2 tests
   File: features/CP/table/bulk_test_delete.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_delete.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_delete.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/bulk_test_delete.feature.spec.js:7:5

122) Check Preview - Accept Icons View > Accept Icons View
   File: features/CP/table/check_preview/accept_icon_color.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/accept_icon_color.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/accept_icon_color.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/accept_icon_color.feature.spec.js:7:5

123) Checks Preview Modes > Checks Preview Modes
   File: features/CP/table/check_preview/check_modes.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5

124) Checks Preview Modes > Checks Preview Sizes on Bounded mode
   File: features/CP/table/check_preview/check_modes.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/check_modes.feature.spec.js:7:5

125) Checks Preview images visibilities > Checks Preview images visibilities
   File: features/CP/table/check_preview/images_visibility.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/images_visibility.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/images_visibility.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/images_visibility.feature.spec.js:7:5

126) Check Preview - Tooltip > Status View - Tooltip
   File: features/CP/table/check_preview/tooltip.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/tooltip.feature.spec.js:22:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/tooltip.feature.spec.js:22:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/navigation.steps.ts:50:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/check_preview/tooltip.feature.spec.js:22:5

127) Distinct filters functionality > Distinct
   File: features/CP/table/distincts_filter.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/distincts_filter.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/distincts_filter.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/distincts_filter.feature.spec.js:7:5

128) Tests Table Filter > Main Group, Single Rule
   File: features/CP/table/filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5

129) Tests Table Filter > Main Group, Single Rule with project Filter
   File: features/CP/table/filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5

130) Tests Table Filter > Filter after select navbar item
   File: features/CP/table/filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5

131) Tests Table Filter > Main Group, Multiple Rules - And
   File: features/CP/table/filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5

132) Tests Table Filter > Main Group, Multiple Rules - Or
   File: features/CP/table/filtering.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/filtering.feature.spec.js:7:5

133) Folding > Select, fold/unfold icon - appear
   File: features/CP/table/folding.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5

134) Folding > Fold/Unfold item by click
   File: features/CP/table/folding.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5

135) Folding > Fold/Unfold single item by select
   File: features/CP/table/folding.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5

136) Folding > Fold/Unfold multiple items by select
   File: features/CP/table/folding.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5

137) Folding > Fold/Unfold all items by select
   File: features/CP/table/folding.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/folding.feature.spec.js:7:5

138) Infinity scroll > Infinity scroll
   File: features/CP/table/infinity_scroll.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/infinity_scroll.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/infinity_scroll.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/infinity_scroll.feature.spec.js:7:5

139) Navigation via link parameters > Navigation to link with predefined parameters
   File: features/CP/table/navigation_via_link_params.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/navigation_via_link_params.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/navigation_via_link_params.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/navigation_via_link_params.feature.spec.js:7:5

140) Quick Filtering > Quick Filtering
   File: features/CP/table/quick_filter.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5

141) Quick Filtering > Quick Filtering with Project
   File: features/CP/table/quick_filter.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/quick_filter.feature.spec.js:7:5

142) Tests Table Settings > Set visible Columns
   File: features/CP/table/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5

143) Tests Table Settings > Sorting
   File: features/CP/table/settings.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/settings.feature.spec.js:7:5

144) Calculate Test status based on Checks statuses > Test status [(PASSED, NEW, REMOVE PASSED) = NEW]
   File: features/CP/table/test_status.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5

145) Calculate Test status based on Checks statuses > Test status [(PASSED, FAILED, REMOVE FAILED) = PASSED]
   File: features/CP/table/test_status.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/CP/table/test_status.feature.spec.js:7:5

146) User roles > User - roles
   File: features/MIXED/users/roles.feature.spec.js
   Attempt 1:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/MIXED/users/roles.feature.spec.js:20:5
   Attempt 2:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/MIXED/users/roles.feature.spec.js:20:5
   Attempt 3:
   Error: TypeError: (0 , _appServer.ensureServerReady) is not a function
   Stack:
     TypeError: (0 , _appServer.ensureServerReady) is not a function
         at Object.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/steps/domain/app.steps.ts:69:28)
         at /Users/a1/Projects/syngrisi/packages/syngrisi/e2e/.features-gen/features/MIXED/users/roles.feature.spec.js:20:5

147) SSO Authentication with Logto > Logto infrastructure is available
   File: features/AUTH/sso_logto.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

148) SSO Authentication with Logto > Full OAuth2 Login Flow with Logto
   File: features/AUTH/sso_logto.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

149) SSO Authentication with Logto > Local Auth Fallback works with real SSO
   File: features/AUTH/sso_logto.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

150) SSO Authentication with SAML 2.0 > Full SAML Login Flow with Logto IdP
   File: features/AUTH/sso_saml.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

151) SSO Authentication with SAML 2.0 > SAML Account Linking - existing local user
   File: features/AUTH/sso_saml.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

152) SSO Authentication with SAML 2.0 > SAML User Creation - new user
   File: features/AUTH/sso_saml.feature.spec.js
   Attempt 1:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 2:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)
   Attempt 3:
   Error: Error: External Logto not available and auto-start failed
   Stack:
     Error: External Logto not available and auto-start failed
         at Object.exports.ssoServerFixture._playwrightBdd.test.extend.ssoServer.scope (/Users/a1/Projects/syngrisi/packages/syngrisi/e2e/support/fixtures/sso-server.fixture.ts:301:21)

==================================================
             FLAKY TESTS
==================================================

1) Ident flow > Ident flow, same ident [unaccepted, failed]
   File: features/CHECKS_HANDLING/ident.feature.spec.js
   Attempt 1:

--------------------------------------------------
             TEST RUN STATISTICS
--------------------------------------------------
 Total Tests:  210
 Passed:       46
 Failed:       152
 Flaky:        1
 Skipped:      11
 Duration:     12m 19s (738929.493ms)
--------------------------------------------------

To view the combined HTML report, run:
npx playwright show-report reports/playwright-report


ERROR: "test:sso" exited with 1.
✨  Done in 964.65s.
a1@1s-MacBook-Pro e2e %          