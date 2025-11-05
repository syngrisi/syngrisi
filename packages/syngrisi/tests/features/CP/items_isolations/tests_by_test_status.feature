
Execution of 87 spec files started at 2025-11-05T11:13:14.728Z

rm: ./logs/html-dumps: is a directory
Starting ChromeDriver 118.0.5993.70 (e52f33f30b91b4ddfad649acddc39ab570473b86-refs/branch-heads/5993@{#1216}) on port 7777
Only local connections are allowed.
Please see https://chromedriver.chromium.org/security-considerations for suggestions on keeping ChromeDriver safe.
ChromeDriver was started successfully.
[0-2] RUNNING in chrome - /features/AP/logs/logs_filtering.feature
[0-1] RUNNING in chrome - /features/AP/logs/logs_basics.feature
[0-0] RUNNING in chrome - /features/AP/access.feature
[0-2] [2] ========== BEFORE FEATURE: undefined (features/AP/logs/logs_filtering.feature) ==========
[2] Feature has 4 scenario(s)
[0-1] [1] ========== BEFORE FEATURE: undefined (features/AP/logs/logs_basics.feature) ==========
[1] Feature has 4 scenario(s)
[0-0] [0] ========== BEFORE FEATURE: undefined (features/AP/access.feature) ==========
[0-0] [0] Feature has 3 scenario(s)
[0-0] [0] ===== BEFORE SCENARIO: Open Admin Panel as Anonymous User (features/AP/access.feature) =====
[0] Scenario tags: none
[0-1] [1] ===== BEFORE SCENARIO: Check Infinity scroll (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario tags: @smoke
[0-2] [2] ===== BEFORE SCENARIO: Main Group, Single Rule (features/AP/logs/logs_filtering.feature) =====
[0-2] [2] Scenario tags: @smoke
[0-2] WARNING: cannot stop the Syngrisi server
[0-0] WARNING: cannot stop the Syngrisi server
[0-1] WARNING: cannot stop the Syngrisi server
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
[0-1] { isAlive: true }
[0-2] { isAlive: true }
[0-0] { isAlive: true }
[0-1] SERVER IS STARTED, PID: '49303' port: '3003'
[0-2] SERVER IS STARTED, PID: '49302' port: '3004'
[0-0] SERVER IS STARTED, PID: '49305' port: '3002'
[0-1] { command: 'waitForDisplayed' }
[0-2] { command: 'waitForDisplayed' }
[0-0] [0] ===== AFTER SCENARIO: Open Admin Panel as Anonymous User (features/AP/access.feature) =====
[0] Scenario result: passed
[0-0] [0] ===== BEFORE SCENARIO: Open Admin Panel behalf of User role (features/AP/access.feature) =====
[0] Scenario tags: none
[0-0] WARNING: cannot stop the Syngrisi server
[0-2] { command: 'waitForDisplayed' }
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
[0-0] { isAlive: true }
[0-0] SERVER IS STARTED, PID: '49508' port: '3002'
[0-0] { command: 'waitForDisplayed' }
[0-1] js result 👉: 1284.5
[0-1] Expect: 0
Stored: 1284.5
[0-1] js result 👉: 0
[0-1] Expect: 0
[0-1] Stored: 0
[0-1] [1] ===== AFTER SCENARIO: Check Infinity scroll (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario result: passed
[0-1] [1] ===== BEFORE SCENARIO: Update Table with new Logs (features/AP/logs/logs_basics.feature) =====
[1] Scenario tags: @smoke
[0-2] [2] ===== AFTER SCENARIO: Main Group, Single Rule (features/AP/logs/logs_filtering.feature) =====
[0-2] [2] Scenario result: passed
[0-2] [2] ===== BEFORE SCENARIO: Main Group, Multiple Rules - And (features/AP/logs/logs_filtering.feature) =====
[2] Scenario tags: @smoke
[0-2] WARNING: cannot stop the Syngrisi server
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-0] [0] ===== AFTER SCENARIO: Open Admin Panel behalf of User role (features/AP/access.feature) =====
[0-0] [0] Scenario result: passed
[0-0] [0] ===== BEFORE SCENARIO: Open Admin Panel behalf of Reviewer role (features/AP/access.feature) =====
[0-0] [0] Scenario tags: none
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-0] WARNING: cannot stop the Syngrisi server
[0-1] { isAlive: true }
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
[0-2] { isAlive: true }
[0-1] SERVER IS STARTED, PID: '49691' port: '3003'
[0-2] SERVER IS STARTED, PID: '49732' port: '3004'
[0-2] { command: 'waitForDisplayed' }
[0-0] { isAlive: true }
[0-2] { command: 'waitForDisplayed' }
[0-0] SERVER IS STARTED, PID: '49764' port: '3002'
[0-0] { command: 'waitForDisplayed' }
[0-0] [0] ===== AFTER SCENARIO: Open Admin Panel behalf of Reviewer role (features/AP/access.feature) =====
[0] Scenario result: passed
[0-0] [0] ========== AFTER FEATURE: undefined (features/AP/access.feature) ==========
[0-0] PASSED in chrome - /features/AP/access.feature
[0-2] [2] ===== AFTER SCENARIO: Main Group, Multiple Rules - And (features/AP/logs/logs_filtering.feature) =====
[2] Scenario result: passed
[0-2] [2] ===== BEFORE SCENARIO: Main Group, Multiple Rules - Or (features/AP/logs/logs_filtering.feature) =====
[0-2] [2] Scenario tags: @smoke
[0-2] WARNING: cannot stop the Syngrisi server
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-4] RUNNING in chrome - /features/AP/settings/settings.feature
[0-2] { isAlive: true }
[0-2] SERVER IS STARTED, PID: '50111' port: '3004'
[0-4] [4] ========== BEFORE FEATURE: undefined (features/AP/settings/settings.feature) ==========
[0-4] [4] Feature has 2 scenario(s)
[0-4] [4] ===== BEFORE SCENARIO: Change Admin Settings - Enable Auth (features/AP/settings/settings.feature) =====
[0-4] [4] Scenario tags: none
[0-2] { command: 'waitForDisplayed' }
[0-4] WARNING: cannot stop the Syngrisi server
[0-2] { command: 'waitForDisplayed' }
[0-4] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest4' }\n"
}
[0-4] { isAlive: true }
[0-4] SERVER IS STARTED, PID: '50237' port: '3006'
[0-4] { command: 'waitForDisplayed' }
[0-4] { command: 'waitForDisplayed' }
[0-1] 1# error in: /I expect that element "[data-test='table-refresh-icon-badge']" to contain text "5":features/AP/logs/logs_basics.feature:63, 9
Error: Expect $(`[data-test='table-refresh-icon-badge']`) to have text containing

Expected: "5"
Received: "6"
Error: Expect $(`[data-test='table-refresh-icon-badge']`) to have text containing

Expected: "5"
Received: "6"
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/integration_vrs_sd.js:216:25)
[0-1] [1] ===== AFTER SCENARIO: Update Table with new Logs (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario result: failed
[0-1] Error in "Log Basics2: Update Table with new Logs"
Error: Expect $(`[data-test='table-refresh-icon-badge']`) to have text containing

Expected: "5"
Received: "6"
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/integration_vrs_sd.js:216:25)
[0-1] [1] ===== BEFORE SCENARIO: Update Table with new Logs (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario tags: @smoke
[0-1] WARNING: cannot stop the Syngrisi server
[0-4] { command: 'waitForDisplayed' }
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-1] { isAlive: true }
[0-4] [4] ===== AFTER SCENARIO: Change Admin Settings - Enable Auth (features/AP/settings/settings.feature) =====
[4] Scenario result: passed
[0-4] [4] ===== BEFORE SCENARIO: Change Admin Settings - First Run (features/AP/settings/settings.feature) =====
[0-4] [4] Scenario tags: none
[0-1] SERVER IS STARTED, PID: '50441' port: '3003'
[0-4] WARNING: cannot stop the Syngrisi server
[0-4] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest4' }\n"
}
[0-2] { command: 'waitForDisplayed' }
[0-4] { isAlive: true }
[0-4] SERVER IS STARTED, PID: '50548' port: '3006'
[0-4] { isAlive: true }
[0-4] SERVER IS STARTED, PID: '50615' port: '3006'
[0-4] { command: 'waitForExist' }
[0-4] { isAlive: true }
[0-4] SERVER IS STARTED, PID: '50744' port: '3006'
[0-4] { command: 'waitForDisplayed' }
[0-4] { command: 'waitForDisplayed' }
[0-1] { command: 'waitForDisplayed' }
[0-1] [1] ===== AFTER SCENARIO: Update Table with new Logs (features/AP/logs/logs_basics.feature) =====
[1] Scenario result: passed
[0-1] [1] ===== BEFORE SCENARIO: Select, fold/unfold icon - appear (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario tags: @smoke
[0-1] WARNING: cannot stop the Syngrisi server
[0-2] { command: 'waitForDisplayed' }
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-1] { isAlive: true }
[0-1] SERVER IS STARTED, PID: '50957' port: '3003'
[0-1] { command: 'waitForDisplayed' }
[0-1] { command: 'waitForDisplayed' }
[0-2] { command: 'waitForDisplayed' }
[0-4] { isAlive: true }
[0-4] SERVER IS STARTED, PID: '51278' port: '3006'
[0-4] [4] ===== AFTER SCENARIO: Change Admin Settings - First Run (features/AP/settings/settings.feature) =====
[4] Scenario result: passed
[0-4] [4] ========== AFTER FEATURE: undefined (features/AP/settings/settings.feature) ==========
[0-1] { command: 'waitForDisplayed' }
[0-1] [1] ===== AFTER SCENARIO: Select, fold/unfold icon - appear (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario result: passed
[0-1] [1] ===== BEFORE SCENARIO: Select, fold/unfold items (features/AP/logs/logs_basics.feature) =====
[0-1] [1] Scenario tags: @smoke
[0-4] PASSED in chrome - /features/AP/settings/settings.feature
[0-1] WARNING: cannot stop the Syngrisi server
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-5] RUNNING in chrome - /features/AP/tasks/remove_inconsistent_items.feature
[0-1] { isAlive: true }
[0-1] SERVER IS STARTED, PID: '51479' port: '3003'
[0-5] [5] ========== BEFORE FEATURE: undefined (features/AP/tasks/remove_inconsistent_items.feature) ==========
[5] Feature has 2 scenario(s)
[0-5] [5] ===== BEFORE SCENARIO: Abandoned File (features/AP/tasks/remove_inconsistent_items.feature) =====
[0-5] [5] Scenario tags: @smoke
[0-1] { command: 'waitForDisplayed' }
[0-5] WARNING: cannot stop the Syngrisi server
[0-1] { command: 'waitForDisplayed' }
[0-5] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest5' }\n"
}
[0-5] { isAlive: true }
[0-2] { command: 'waitForDisplayed' }
[0-1] { command: 'waitForDisplayed' }
[0-5] SERVER IS STARTED, PID: '51614' port: '3007'
[0-5] [create tests with params] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3007/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-1] { command: 'waitForDisplayed' }
[0-1] { command: 'waitForDisplayed' }
[0-5] { uri: 'http://localhost:3007/v1/tasks/screenshots' }
[0-5] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test_db_only /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();"\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest5' }\n"
}
[0-5] { isAlive: true }
[0-1] { command: 'waitForDisplayed' }
[0-5] SERVER IS STARTED, PID: '51767' port: '3007'
[0-5] [create tests with params] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3007/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-1] { command: 'waitForDisplayed' }
[0-5] { uri: 'http://localhost:3007/v1/tasks/screenshots' }
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tasks/task_handle_database_consistency?clean=true'
}
[0-5] Warning: cannot parse body as json
[0-5] { uri: 'http://localhost:3007/v1/tasks/screenshots' }
[0-5] [5] ===== AFTER SCENARIO: Abandoned File (features/AP/tasks/remove_inconsistent_items.feature) =====
[5] Scenario result: passed
[0-5] [5] ===== BEFORE SCENARIO: Abandoned Snapshot, Check, Test, Suite, Run (features/AP/tasks/remove_inconsistent_items.feature) =====
[5] Scenario tags: @smoke
[0-5] WARNING: cannot stop the Syngrisi server
[0-5] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest5' }\n"
}
[0-5] { isAlive: true }
[0-5] SERVER IS STARTED, PID: '51891' port: '3007'
[0-5] [create tests with params] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3007/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-5] { uri: 'http://localhost:3007/v1/tasks/screenshots' }
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c65b',
    name: 'CheckName',
    test: '690b3197fb89d3cd6a36c645',
    suite: '690b3197fb89d3cd6a36c643',
    app: '690b3197c20bc55d1e81d3e2',
    branch: 'integration',
    baselineId: '690b3197fb89d3cd6a36c657',
    actualSnapshotId: '690b3197fb89d3cd6a36c657',
    updatedDate: '2025-11-05T11:14:31.785Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    failReasons: [],
    createdDate: '2025-11-05T11:14:31.796Z',
    id: '690b3197fb89d3cd6a36c65b',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c65b',
    name: 'CheckName',
    test: '690b3197fb89d3cd6a36c645',
    suite: '690b3197fb89d3cd6a36c643',
    app: '690b3197c20bc55d1e81d3e2',
    branch: 'integration',
    baselineId: '690b3197fb89d3cd6a36c657',
    actualSnapshotId: '690b3197fb89d3cd6a36c657',
    updatedDate: '2025-11-05T11:14:31.785Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    failReasons: [],
    createdDate: '2025-11-05T11:14:31.796Z',
    id: '690b3197fb89d3cd6a36c65b',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"TestName - 1","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c645',
    name: 'TestName - 1',
    status: 'New',
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    branch: 'integration',
    tags: [],
    viewport: '1366x768',
    os: 'macOS',
    app: '690b3197c20bc55d1e81d3e2',
    blinking: 0,
    updatedDate: '2025-11-05T11:14:32.526Z',
    startDate: '2025-11-05T11:14:31.433Z',
    checks: [ '690b3197fb89d3cd6a36c65b' ],
    suite: '690b3197fb89d3cd6a36c643',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    markedAs: 'Unaccepted',
    id: '690b3197fb89d3cd6a36c645'
  }
]
[0-1] [1] ===== AFTER SCENARIO: Select, fold/unfold items (features/AP/logs/logs_basics.feature) =====
[1] Scenario result: passed
[0-1] [1] ========== AFTER FEATURE: undefined (features/AP/logs/logs_basics.feature) ==========
[0-1] PASSED in chrome - /features/AP/logs/logs_basics.feature
[0-5] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test_screenshots_only /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> rm -rf ./baselinesTest/$CID/*\n' +
    '\n'
}
[0-5] { uri: 'http://localhost:3007/v1/tasks/screenshots' }
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tasks/task_handle_database_consistency?clean=true'
}
[0-5] Warning: cannot parse body as json
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-5] ✅ []
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c65b',
    name: 'CheckName',
    test: '690b3197fb89d3cd6a36c645',
    suite: '690b3197fb89d3cd6a36c643',
    app: '690b3197c20bc55d1e81d3e2',
    branch: 'integration',
    baselineId: '690b3197fb89d3cd6a36c657',
    actualSnapshotId: '690b3197fb89d3cd6a36c657',
    updatedDate: '2025-11-05T11:14:31.785Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    failReasons: [],
    createdDate: '2025-11-05T11:14:31.796Z',
    id: '690b3197fb89d3cd6a36c65b',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"TestName - 1","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c645',
    name: 'TestName - 1',
    status: 'New',
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    branch: 'integration',
    tags: [],
    viewport: '1366x768',
    os: 'macOS',
    app: '690b3197c20bc55d1e81d3e2',
    blinking: 0,
    updatedDate: '2025-11-05T11:14:32.526Z',
    startDate: '2025-11-05T11:14:31.433Z',
    checks: [ '690b3197fb89d3cd6a36c65b' ],
    suite: '690b3197fb89d3cd6a36c643',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    markedAs: 'Unaccepted',
    id: '690b3197fb89d3cd6a36c645'
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tasks/task_handle_database_consistency?clean=true'
}
[0-5] Warning: cannot parse body as json
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-5] ✅ []
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"TestName - 1","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c645',
    name: 'TestName - 1',
    status: 'New',
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    branch: 'integration',
    tags: [],
    viewport: '1366x768',
    os: 'macOS',
    app: '690b3197c20bc55d1e81d3e2',
    blinking: 0,
    updatedDate: '2025-11-05T11:14:32.526Z',
    startDate: '2025-11-05T11:14:31.433Z',
    checks: [ '690b3197fb89d3cd6a36c65b' ],
    suite: '690b3197fb89d3cd6a36c643',
    run: '690b3197fb89d3cd6a36c640',
    creatorId: '690b3196fb89d3cd6a36c636',
    creatorUsername: 'Guest',
    markedAs: 'Unaccepted',
    id: '690b3197fb89d3cd6a36c645'
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/runs?limit=0&filter={"$and":[{"name":{"$regex":"RunName","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c640',
    name: 'RunName',
    app: '690b3197c20bc55d1e81d3e2',
    ident: 'integration_run_ident',
    createdDate: '2025-11-05T11:14:31.439Z',
    parameters: [],
    updatedDate: '2025-11-05T11:14:31.813Z',
    id: '690b3197fb89d3cd6a36c640'
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/suites?limit=0&filter={"$and":[{"name":{"$regex":"SuiteName","$options":"im"}}]}'
}
[0-5] ✅ [
  {
    _id: '690b3197fb89d3cd6a36c643',
    name: 'SuiteName',
    tags: [],
    app: '690b3197c20bc55d1e81d3e2',
    createdDate: '2025-11-05T11:14:31.442Z',
    updatedDate: '2025-11-05T11:14:31.807Z',
    id: '690b3197fb89d3cd6a36c643'
  }
]
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tasks/task_handle_database_consistency?clean=true'
}
[0-5] Warning: cannot parse body as json
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"TestName - 1","$options":"im"}}]}'
}
[0-5] ✅ []
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/runs?limit=0&filter={"$and":[{"name":{"$regex":"RunName","$options":"im"}}]}'
}
[0-5] ✅ []
[0-5] 👉 {
  uri: 'http://localhost:3007/v1/suites?limit=0&filter={"$and":[{"name":{"$regex":"SuiteName","$options":"im"}}]}'
}
[0-5] ✅ []
[0-5] [5] ===== AFTER SCENARIO: Abandoned Snapshot, Check, Test, Suite, Run (features/AP/tasks/remove_inconsistent_items.feature) =====
[0-5] [5] Scenario result: passed
[0-5] [5] ========== AFTER FEATURE: undefined (features/AP/tasks/remove_inconsistent_items.feature) ==========
[0-5] PASSED in chrome - /features/AP/tasks/remove_inconsistent_items.feature
[0-2] 2# error in: /I wait on element "[data-test*='table_row_']" to be displayed:features/AP/logs/logs_filtering.feature:121, 9
Error: element ("[data-test*='table_row_']") still not displayed after 10000ms
Error: element ("[data-test*='table_row_']") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-2] [2] ===== AFTER SCENARIO: Main Group, Multiple Rules - Or (features/AP/logs/logs_filtering.feature) =====
[2] Scenario result: failed
[0-2] Error in "Logs Table Filter1: Main Group, Multiple Rules - Or"
Error: element ("[data-test*='table_row_']") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-2] [2] ===== BEFORE SCENARIO: Main Group, Multiple Rules - Or (features/AP/logs/logs_filtering.feature) =====
[2] Scenario tags: @smoke
[0-2] WARNING: cannot stop the Syngrisi server
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-6] RUNNING in chrome - /features/AP/tasks/remove_old_checks.feature
[0-7] RUNNING in chrome - /features/AP/users/api_key_generation.feature
[0-7] [7] ========== BEFORE FEATURE: undefined (features/AP/users/api_key_generation.feature) ==========
[0-7] [7] Feature has 1 scenario(s)
[0-6] [6] ========== BEFORE FEATURE: undefined (features/AP/tasks/remove_old_checks.feature) ==========
[0-6] [6] Feature has 4 scenario(s)
[0-7] [7] ===== BEFORE SCENARIO: Smoke API key generation (features/AP/users/api_key_generation.feature) =====
[0-7] [7] Scenario tags: @smoke
[0-6] [6] ===== BEFORE SCENARIO: Remove old checks [unaccepted] (features/AP/tasks/remove_old_checks.feature) =====
[6] Scenario tags: @smoke
[0-6] WARNING: cannot stop the Syngrisi server
[0-7] WARNING: cannot stop the Syngrisi server
[0-7] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest7' }\n"
}
[0-6] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest6' }\n"
}
[0-2] { isAlive: true }
[0-2] SERVER IS STARTED, PID: '52176' port: '3004'
[0-7] { isAlive: true }
[0-2] { command: 'waitForDisplayed' }
[0-6] { isAlive: true }
[0-2] { command: 'waitForDisplayed' }
[0-7] SERVER IS STARTED, PID: '52324' port: '3009'
[0-7] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31a1df4ca4322098f282","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31a1df4ca4322098f282"}'
}
[0-6] SERVER IS STARTED, PID: '52326' port: '3008'
[0-6] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31a1c59f1b401ca056f5","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31a1c59f1b401ca056f5"}'
}
[0-6] { isAlive: true }
[0-7] { isAlive: true }
[0-6] SERVER IS STARTED, PID: '52391' port: '3008'
[0-6] { uri: 'http://localhost:3008' }
[0-7] SERVER IS STARTED, PID: '52390' port: '3009'
[0-7] { uri: 'http://localhost:3009' }
[0-6] { uri: 'http://localhost:3008/v1/auth/apikey' }
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: 'E9PAPZY-EQBMJND-Q2ZCM5Q-Q67DE7R',
      apiHash: '77634a2c64b7bff79129ae7e71cf5a0a130ff75e2193ea5757661b7ac5999ca002d70056f46db4b9b3f3d8424f6d370118effc7c01b327c5110ab005caa6a82e'
    }
  },
  params: { test: {} }
}
[0-7] 👉 { uri: 'http://localhost:3009/v1/users' }
[0-7] {
  respBody: {
    _id: '690b31a3e5c19246e0db0da3',
    username: 'user@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:14:43.583Z',
    id: '690b31a3e5c19246e0db0da3'
  }
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31a38c746ba8d846bf3d',
    name: 'unaccepted',
    test: '690b31a38c746ba8d846bf27',
    suite: '690b31a38c746ba8d846bf25',
    app: '690b31a3c20bc55d1e81d7d1',
    branch: 'integration',
    baselineId: '690b31a38c746ba8d846bf39',
    actualSnapshotId: '690b31a38c746ba8d846bf39',
    updatedDate: '2025-11-05T11:14:44.692Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31a38c746ba8d846bf22',
    creatorId: '690b31a1c59f1b401ca056f5',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-26T11:14:44.000Z',
    id: '690b31a38c746ba8d846bf3d',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31a38c746ba8d846bf39',
    name: 'unaccepted',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:14:43.928Z',
    filename: '690b31a38c746ba8d846bf39.png',
    id: '690b31a38c746ba8d846bf39'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] Warning: cannot parse body as json
[0-6] { STATUS: 200 }
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] [6] ===== AFTER SCENARIO: Remove old checks [unaccepted] (features/AP/tasks/remove_old_checks.feature) =====
[0-6] [6] Scenario result: passed
[0-6] [6] ===== BEFORE SCENARIO: Remove old check [unaccepted, unaccepted_fail] (features/AP/tasks/remove_old_checks.feature) =====
[0-6] [6] Scenario tags: none
[0-6] WARNING: cannot stop the Syngrisi server
[0-6] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest6' }\n"
}
[0-6] { isAlive: true }
[0-6] SERVER IS STARTED, PID: '52548' port: '3008'
[0-6] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31a701403087510e8d87","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31a701403087510e8d87"}'
}
[0-6] { isAlive: true }
[0-6] SERVER IS STARTED, PID: '52607' port: '3008'
[0-6] { uri: 'http://localhost:3008' }
[0-6] { uri: 'http://localhost:3008/v1/auth/apikey' }
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: '3P0SVR5-E6QM3VD-K7MN8EE-124H165',
      apiHash: '85b37d423ee8ed57ae555a8faa97bf99fe2e873c332f07aec165eaeedc393afeb01c891693752e4b9f37047544c67d48bd3dec1972e2d342bdc94c7ad00fac90'
    }
  },
  params: { test: {} }
}
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: '3P0SVR5-E6QM3VD-K7MN8EE-124H165',
      apiHash: '85b37d423ee8ed57ae555a8faa97bf99fe2e873c332f07aec165eaeedc393afeb01c891693752e4b9f37047544c67d48bd3dec1972e2d342bdc94c7ad00fac90'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'e14eebd4-cf9b-470d-9308-4a43c86f98ce',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31aa82774fb8cf36074b',
    name: 'CheckName',
    test: '690b31aa82774fb8cf36073d',
    suite: '690b31a982774fb8cf360706',
    app: '690b31a9c20bc55d1e81da3d',
    branch: 'integration',
    baselineId: '690b31aa82774fb8cf360747',
    actualSnapshotId: '690b31aa82774fb8cf360747',
    updatedDate: '2025-11-05T11:14:51.626Z',
    status: [ 'failed' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31aa82774fb8cf36073a',
    creatorId: '690b31a701403087510e8d87',
    creatorUsername: 'Test',
    failReasons: [ 'not_accepted' ],
    createdDate: '2025-10-26T11:14:51.000Z',
    id: '690b31aa82774fb8cf36074b',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  },
  {
    _id: '690b31a982774fb8cf36071e',
    name: 'CheckName',
    test: '690b31a982774fb8cf360708',
    suite: '690b31a982774fb8cf360706',
    app: '690b31a9c20bc55d1e81da3d',
    branch: 'integration',
    baselineId: '690b31a982774fb8cf36071a',
    actualSnapshotId: '690b31a982774fb8cf36071a',
    updatedDate: '2025-11-05T11:14:50.476Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31a982774fb8cf360703',
    creatorId: '690b31a701403087510e8d87',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-26T11:14:50.000Z',
    id: '690b31a982774fb8cf36071e',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31aa82774fb8cf360747',
    name: 'CheckName',
    filename: '690b31a982774fb8cf36071a.png',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:14:50.838Z',
    id: '690b31aa82774fb8cf360747'
  },
  {
    _id: '690b31a982774fb8cf36071a',
    name: 'CheckName',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:14:49.724Z',
    filename: '690b31a982774fb8cf36071a.png',
    id: '690b31a982774fb8cf36071a'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] Warning: cannot parse body as json
[0-6] { STATUS: 200 }
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] [6] ===== AFTER SCENARIO: Remove old check [unaccepted, unaccepted_fail] (features/AP/tasks/remove_old_checks.feature) =====
[6] Scenario result: passed
[0-6] [6] ===== BEFORE SCENARIO: Remove old checks [unaccepted_old_A, accepted_new_B] (features/AP/tasks/remove_old_checks.feature) =====
[0-6] [6] Scenario tags: @smoke
[0-2] { command: 'waitForDisplayed' }
[0-6] WARNING: cannot stop the Syngrisi server
[0-2] [2] ===== AFTER SCENARIO: Main Group, Multiple Rules - Or (features/AP/logs/logs_filtering.feature) =====
[2] Scenario result: passed
[0-2] [2] ===== BEFORE SCENARIO: Two Groups (features/AP/logs/logs_filtering.feature) =====
[2] Scenario tags: none
[0-2] WARNING: cannot stop the Syngrisi server
[0-7] [create tests with params] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3009/',
      apiKey: 'DSVF38D-CHB4B7C-PA4QKB6-AMHXRKN',
      apiHash: 'e00b7e9d103e2795ec1f09787d6512f77328963b7071fb4ee37c755d3febe373404e3e0fe106ce37fae9ec1b2d9d048a5f66b258c611b734b0605badd12164ef'
    }
  },
  params: { test: {} }
}
[0-6] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest6' }\n"
}
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-6] { isAlive: true }
[0-2] { isAlive: true }
[0-6] SERVER IS STARTED, PID: '52821' port: '3008'
[0-6] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31afd0b389134b8e64a0","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31afd0b389134b8e64a0"}'
}
[0-2] SERVER IS STARTED, PID: '52823' port: '3004'
[0-2] { command: 'waitForDisplayed' }
[0-2] { command: 'waitForDisplayed' }
[0-6] { isAlive: true }
[0-6] SERVER IS STARTED, PID: '52888' port: '3008'
[0-6] { uri: 'http://localhost:3008' }
[0-6] { uri: 'http://localhost:3008/v1/auth/apikey' }
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: 'XES3EN3-E2NMFHS-KJSNZ7T-CNDH54S',
      apiHash: '6671e033b8899755fbcc1593485ab2a20369e81a64d20f450a130dbcf0f2ff2fa4bf858ad1442a7e6323b4938766ab9dc1689e9111ad8918af87ae70bc668f84'
    }
  },
  params: { test: {} }
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"name": "unaccepted_old"}'
}
[0-6] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: 'XES3EN3-E2NMFHS-KJSNZ7T-CNDH54S',
      apiHash: '6671e033b8899755fbcc1593485ab2a20369e81a64d20f450a130dbcf0f2ff2fa4bf858ad1442a7e6323b4938766ab9dc1689e9111ad8918af87ae70bc668f84'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '2f94bf6d-6b0a-488b-91dc-64c7a43cc77d',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"accepted_new","$options":"im"}}]}'
}
[0-6] 👉 {
  checks: [
    {
      _id: '690b31b534a1a6e8caeca8ab',
      name: 'accepted_new',
      test: '690b31b434a1a6e8caeca895',
      suite: '690b31b134a1a6e8caeca85a',
      app: '690b31b1c20bc55d1e81de03',
      branch: 'integration',
      baselineId: '690b31b434a1a6e8caeca8a7',
      actualSnapshotId: '690b31b434a1a6e8caeca8a7',
      updatedDate: '2025-11-05T11:15:00.997Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b31b434a1a6e8caeca892',
      creatorId: '690b31afd0b389134b8e64a0',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:15:01.006Z',
      id: '690b31b534a1a6e8caeca8ab',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted_old","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b134a1a6e8caeca872',
    name: 'unaccepted_old',
    test: '690b31b134a1a6e8caeca85c',
    suite: '690b31b134a1a6e8caeca85a',
    app: '690b31b1c20bc55d1e81de03',
    branch: 'integration',
    baselineId: '690b31b134a1a6e8caeca86e',
    actualSnapshotId: '690b31b134a1a6e8caeca86e',
    updatedDate: '2025-11-05T11:15:00.415Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31b134a1a6e8caeca857',
    creatorId: '690b31afd0b389134b8e64a0',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-26T11:14:58.000Z',
    id: '690b31b134a1a6e8caeca872',
    isCurrentlyAccepted: false,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"accepted_new","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b534a1a6e8caeca8ab',
    name: 'accepted_new',
    test: '690b31b434a1a6e8caeca895',
    suite: '690b31b134a1a6e8caeca85a',
    app: '690b31b1c20bc55d1e81de03',
    branch: 'integration',
    baselineId: '690b31b434a1a6e8caeca8a7',
    actualSnapshotId: '690b31b434a1a6e8caeca8a7',
    updatedDate: '2025-11-05T11:15:01.833Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31b434a1a6e8caeca892',
    creatorId: '690b31afd0b389134b8e64a0',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-11-05T11:15:01.006Z',
    markedAs: 'accepted',
    markedById: '690b31afd0b389134b8e64a0',
    markedByUsername: 'Test',
    markedDate: '2025-11-05T11:15:01.833Z',
    id: '690b31b534a1a6e8caeca8ab',
    isCurrentlyAccepted: true,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted_old","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b134a1a6e8caeca86e',
    name: 'unaccepted_old',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:14:57.924Z',
    filename: '690b31b134a1a6e8caeca86e.png',
    id: '690b31b134a1a6e8caeca86e'
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"accepted_new","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b434a1a6e8caeca8a7',
    name: 'accepted_new',
    imghash: 'bc4a6dfa96a6f77c0b974d7f908aa2c89a5446a88a80393e524df1ead1a768addf29612b88a3d4ca129be83613021ddb992773c522536c5ef813c3b533086352',
    createdDate: '2025-11-05T11:15:00.999Z',
    filename: '690b31b434a1a6e8caeca8a7.png',
    id: '690b31b434a1a6e8caeca8a7'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] Warning: cannot parse body as json
[0-6] { STATUS: 200 }
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted_old","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"accepted_new","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b534a1a6e8caeca8ab',
    name: 'accepted_new',
    test: '690b31b434a1a6e8caeca895',
    suite: '690b31b134a1a6e8caeca85a',
    app: '690b31b1c20bc55d1e81de03',
    branch: 'integration',
    baselineId: '690b31b434a1a6e8caeca8a7',
    actualSnapshotId: '690b31b434a1a6e8caeca8a7',
    updatedDate: '2025-11-05T11:15:01.833Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31b434a1a6e8caeca892',
    creatorId: '690b31afd0b389134b8e64a0',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-11-05T11:15:01.006Z',
    markedAs: 'accepted',
    markedById: '690b31afd0b389134b8e64a0',
    markedByUsername: 'Test',
    markedDate: '2025-11-05T11:15:01.833Z',
    id: '690b31b534a1a6e8caeca8ab',
    isCurrentlyAccepted: true,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"unaccepted_old","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"accepted_new","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31b434a1a6e8caeca8a7',
    name: 'accepted_new',
    imghash: 'bc4a6dfa96a6f77c0b974d7f908aa2c89a5446a88a80393e524df1ead1a768addf29612b88a3d4ca129be83613021ddb992773c522536c5ef813c3b533086352',
    createdDate: '2025-11-05T11:15:00.999Z',
    filename: '690b31b434a1a6e8caeca8a7.png',
    id: '690b31b434a1a6e8caeca8a7'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] [6] ===== AFTER SCENARIO: Remove old checks [unaccepted_old_A, accepted_new_B] (features/AP/tasks/remove_old_checks.feature) =====
[0-6] [6] Scenario result: passed
[0-6] [6] ===== BEFORE SCENARIO: Remove old checks [accepted_old_A, accepted_new_B] (features/AP/tasks/remove_old_checks.feature) =====
[0-6] [6] Scenario tags: none
[0-6] WARNING: cannot stop the Syngrisi server
[0-7] { command: 'waitForDisplayed' }
[0-7] [7] ===== AFTER SCENARIO: Smoke API key generation (features/AP/users/api_key_generation.feature) =====
[7] Scenario result: passed
[0-7] [7] ========== AFTER FEATURE: undefined (features/AP/users/api_key_generation.feature) ==========
[0-7] PASSED in chrome - /features/AP/users/api_key_generation.feature
[0-6] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest6' }\n"
}
[0-8] RUNNING in chrome - /features/AP/users/create.feature
[0-8] [8] ========== BEFORE FEATURE: undefined (features/AP/users/create.feature) ==========
[8] Feature has 3 scenario(s)
[0-8] [8] ===== BEFORE SCENARIO: Create User - Success (features/AP/users/create.feature) =====
[0-8] [8] Scenario tags: @integration, @smoke
[0-6] { isAlive: true }
[0-8] WARNING: cannot stop the Syngrisi server
[0-2] [2] ===== AFTER SCENARIO: Two Groups (features/AP/logs/logs_filtering.feature) =====
[0-2] [2] Scenario result: passed
[0-2] [2] ========== AFTER FEATURE: undefined (features/AP/logs/logs_filtering.feature) ==========
[0-6] SERVER IS STARTED, PID: '53191' port: '3008'
[0-6] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31bcd4eb8f83c6561c19","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31bcd4eb8f83c6561c19"}'
}
[0-2] PASSED in chrome - /features/AP/logs/logs_filtering.feature
[0-6] { isAlive: true }
[0-8] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest8' }\n"
}
[0-6] SERVER IS STARTED, PID: '53363' port: '3008'
[0-6] { uri: 'http://localhost:3008' }
[0-6] { uri: 'http://localhost:3008/v1/auth/apikey' }
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: 'Q72N6W6-1YWM9F0-QEESTR9-5GEH5PP',
      apiHash: '09ec139a5de46c38bc194619b7115d7ce68732174d8865cc25ea6a8cc83dda5e46486e27171ee61d84fd2076ffeb13b718f9ec1edb849942025f2a88213e7225'
    }
  },
  params: { test: {} }
}
[0-9] RUNNING in chrome - /features/AP/users/default_users.feature
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-6] 👉 {
  checks: [
    {
      _id: '690b31beca81f1ac3d25abbf',
      name: 'CheckName',
      test: '690b31beca81f1ac3d25aba9',
      suite: '690b31beca81f1ac3d25aba7',
      app: '690b31bec20bc55d1e81e063',
      branch: 'integration',
      baselineId: '690b31beca81f1ac3d25abbb',
      actualSnapshotId: '690b31beca81f1ac3d25abbb',
      updatedDate: '2025-11-05T11:15:10.908Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b31beca81f1ac3d25aba4',
      creatorId: '690b31bcd4eb8f83c6561c19',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:15:10.923Z',
      id: '690b31beca81f1ac3d25abbf',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"name": "CheckName"}'
}
[0-6] Create test # 0
[0-6] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3008/',
      apiKey: 'Q72N6W6-1YWM9F0-QEESTR9-5GEH5PP',
      apiHash: '09ec139a5de46c38bc194619b7115d7ce68732174d8865cc25ea6a8cc83dda5e46486e27171ee61d84fd2076ffeb13b718f9ec1edb849942025f2a88213e7225'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '7c46ae1e-a870-460f-8779-33d6a1dfc323',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-9] [9] ========== BEFORE FEATURE: undefined (features/AP/users/default_users.feature) ==========
[9] Feature has 1 scenario(s)
[0-9] [9] ===== BEFORE SCENARIO: Default Administrator and Guest should be created after first server start (features/AP/users/default_users.feature) =====
[9] Scenario tags: @integration
[0-8] { isAlive: true }
[0-9] WARNING: cannot stop the Syngrisi server
[0-8] SERVER IS STARTED, PID: '53391' port: '3010'
[0-8] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31c1965932a9b93a5ab8","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31c1965932a9b93a5ab8"}'
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName_2","$options":"im"}}]}'
}
[0-6] 👉 {
  checks: [
    {
      _id: '690b31c0ca81f1ac3d25ac0b',
      name: 'CheckName_2',
      test: '690b31c0ca81f1ac3d25abf5',
      suite: '690b31beca81f1ac3d25aba7',
      app: '690b31bec20bc55d1e81e063',
      branch: 'integration',
      baselineId: '690b31c0ca81f1ac3d25ac07',
      actualSnapshotId: '690b31c0ca81f1ac3d25ac07',
      updatedDate: '2025-11-05T11:15:12.941Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b31c0ca81f1ac3d25abf2',
      creatorId: '690b31bcd4eb8f83c6561c19',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:15:12.962Z',
      id: '690b31c0ca81f1ac3d25ac0b',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"name": "CheckName_2"}'
}
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"^CheckName$","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31beca81f1ac3d25abbf',
    name: 'CheckName',
    test: '690b31beca81f1ac3d25aba9',
    suite: '690b31beca81f1ac3d25aba7',
    app: '690b31bec20bc55d1e81e063',
    branch: 'integration',
    baselineId: '690b31beca81f1ac3d25abbb',
    actualSnapshotId: '690b31beca81f1ac3d25abbb',
    updatedDate: '2025-11-05T11:15:12.012Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31beca81f1ac3d25aba4',
    creatorId: '690b31bcd4eb8f83c6561c19',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-26T11:15:11.000Z',
    markedAs: 'accepted',
    markedById: '690b31bcd4eb8f83c6561c19',
    markedByUsername: 'Test',
    markedDate: '2025-11-05T11:15:11.880Z',
    id: '690b31beca81f1ac3d25abbf',
    isCurrentlyAccepted: true,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"^CheckName$","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31beca81f1ac3d25abbb',
    name: 'CheckName',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:15:10.909Z',
    filename: '690b31beca81f1ac3d25abbb.png',
    id: '690b31beca81f1ac3d25abbb'
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName_2","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31c0ca81f1ac3d25ac0b',
    name: 'CheckName_2',
    test: '690b31c0ca81f1ac3d25abf5',
    suite: '690b31beca81f1ac3d25aba7',
    app: '690b31bec20bc55d1e81e063',
    branch: 'integration',
    baselineId: '690b31c0ca81f1ac3d25ac07',
    actualSnapshotId: '690b31c0ca81f1ac3d25ac07',
    updatedDate: '2025-11-05T11:15:13.842Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31c0ca81f1ac3d25abf2',
    creatorId: '690b31bcd4eb8f83c6561c19',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-16T11:15:13.000Z',
    markedAs: 'accepted',
    markedById: '690b31bcd4eb8f83c6561c19',
    markedByUsername: 'Test',
    markedDate: '2025-11-05T11:15:13.769Z',
    id: '690b31c0ca81f1ac3d25ac0b',
    isCurrentlyAccepted: true,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"CheckName_2","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31c0ca81f1ac3d25ac07',
    name: 'CheckName_2',
    imghash: 'bc4a6dfa96a6f77c0b974d7f908aa2c89a5446a88a80393e524df1ead1a768addf29612b88a3d4ca129be83613021ddb992773c522536c5ef813c3b533086352',
    createdDate: '2025-11-05T11:15:12.942Z',
    filename: '690b31c0ca81f1ac3d25ac07.png',
    id: '690b31c0ca81f1ac3d25ac07'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] Warning: cannot parse body as json
[0-6] { STATUS: 200 }
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"^CheckName$","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31beca81f1ac3d25abbf',
    name: 'CheckName',
    test: '690b31beca81f1ac3d25aba9',
    suite: '690b31beca81f1ac3d25aba7',
    app: '690b31bec20bc55d1e81e063',
    branch: 'integration',
    baselineId: '690b31beca81f1ac3d25abbb',
    actualSnapshotId: '690b31beca81f1ac3d25abbb',
    updatedDate: '2025-11-05T11:15:12.012Z',
    status: [ 'new' ],
    browserName: 'chrome [HEADLESS]',
    browserVersion: '118',
    browserFullVersion: '118.0.5993.70',
    viewport: '1366x768',
    os: 'macOS',
    result: '{}',
    run: '690b31beca81f1ac3d25aba4',
    creatorId: '690b31bcd4eb8f83c6561c19',
    creatorUsername: 'Test',
    failReasons: [],
    createdDate: '2025-10-26T11:15:11.000Z',
    markedAs: 'accepted',
    markedById: '690b31bcd4eb8f83c6561c19',
    markedByUsername: 'Test',
    markedDate: '2025-11-05T11:15:11.880Z',
    id: '690b31beca81f1ac3d25abbf',
    isCurrentlyAccepted: true,
    wasAcceptedEarlier: false
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"^CheckName$","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31beca81f1ac3d25abbb',
    name: 'CheckName',
    imghash: '544812f2eb1656193307d1490dd99c0cdd85b69e6e241885cf7e9246ee490f1f76543459a1cca871cc4162f94c0f62ee6e84ebd1290773f1376b04be2d4d44cb',
    createdDate: '2025-11-05T11:15:10.909Z',
    filename: '690b31beca81f1ac3d25abbb.png',
    id: '690b31beca81f1ac3d25abbb'
  }
]
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName_2","$options":"im"}}]}'
}
[0-6] ✅ []
[0-6] 👉 {
  uri: 'http://localhost:3008/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"CheckName_2","$options":"im"}}]}'
}
[0-6] ✅ [
  {
    _id: '690b31c0ca81f1ac3d25ac07',
    name: 'CheckName_2',
    imghash: 'bc4a6dfa96a6f77c0b974d7f908aa2c89a5446a88a80393e524df1ead1a768addf29612b88a3d4ca129be83613021ddb992773c522536c5ef813c3b533086352',
    createdDate: '2025-11-05T11:15:12.942Z',
    filename: '690b31c0ca81f1ac3d25ac07.png',
    id: '690b31c0ca81f1ac3d25ac07'
  }
]
[0-6] { uri: 'http://localhost:3008/v1/tasks/screenshots' }
[0-6] [6] ===== AFTER SCENARIO: Remove old checks [accepted_old_A, accepted_new_B] (features/AP/tasks/remove_old_checks.feature) =====
[6] Scenario result: passed
[0-6] [6] ========== AFTER FEATURE: undefined (features/AP/tasks/remove_old_checks.feature) ==========
[0-6] PASSED in chrome - /features/AP/tasks/remove_old_checks.feature
[0-9] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest9' }\n"
}
[0-9] { isAlive: true }
[0-10] RUNNING in chrome - /features/AP/users/delete.feature
[0-9] SERVER IS STARTED, PID: '53571' port: '3011'
[0-9] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31c375f79ae3540702a7","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31c375f79ae3540702a7"}'
}
[0-10] [10] ========== BEFORE FEATURE: undefined (features/AP/users/delete.feature) ==========
[0-10] [10] Feature has 1 scenario(s)
[0-10] [10] ===== BEFORE SCENARIO: Delete User - Success (features/AP/users/delete.feature) =====
[0-10] [10] Scenario tags: @integration, @smoke
[0-10] WARNING: cannot stop the Syngrisi server
[0-9] { isAlive: true }
[0-9] SERVER IS STARTED, PID: '53644' port: '3011'
[0-8] { isAlive: true }
[0-10] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest10' }\n"
}
[0-8] SERVER IS STARTED, PID: '53668' port: '3010'
[0-9] { command: 'waitForDisplayed' }
[0-10] { isAlive: true }
[0-8] { command: 'waitForDisplayed' }
[0-10] SERVER IS STARTED, PID: '53738' port: '3012'
[0-10] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31c9482f46fb9a304642","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31c9482f46fb9a304642"}'
}
[0-10] { isAlive: true }
[0-10] SERVER IS STARTED, PID: '53854' port: '3012'
[0-9] [9] ===== AFTER SCENARIO: Default Administrator and Guest should be created after first server start (features/AP/users/default_users.feature) =====
[9] Scenario result: passed
[0-9] [9] ========== AFTER FEATURE: undefined (features/AP/users/default_users.feature) ==========
[0-9] PASSED in chrome - /features/AP/users/default_users.feature
[0-8] { command: 'waitForEnabled' }
[0-10] { command: 'waitForDisplayed' }
[0-10] { uri: 'http://localhost:3012' }
[0-10] 👉 { uri: 'http://localhost:3012/v1/users' }
[0-11] RUNNING in chrome - /features/AP/users/update.feature
[0-10] {
  respBody: {
    _id: '690b31cffdff30974628a31f',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:15:27.033Z',
    id: '690b31cffdff30974628a31f'
  }
}
[0-11] [11] ========== BEFORE FEATURE: undefined (features/AP/users/update.feature) ==========
[11] Feature has 1 scenario(s)
[0-11] [11] ===== BEFORE SCENARIO: Update User - Success (features/AP/users/update.feature) =====
[0-11] [11] Scenario tags: @integration, @smoke
[0-11] WARNING: cannot stop the Syngrisi server
[0-10] { command: 'waitForDisplayed' }
[0-11] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest11' }\n"
}
[0-10] [10] ===== AFTER SCENARIO: Delete User - Success (features/AP/users/delete.feature) =====
[10] Scenario result: passed
[0-10] [10] ========== AFTER FEATURE: undefined (features/AP/users/delete.feature) ==========
[0-10] PASSED in chrome - /features/AP/users/delete.feature
[0-11] { isAlive: true }
[0-12] RUNNING in chrome - /features/AUTH/auth_off.feature
[0-11] SERVER IS STARTED, PID: '54187' port: '3013'
[0-11] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31d63505f3df2cd86de4","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31d63505f3df2cd86de4"}'
}
[0-12] [12] ========== BEFORE FEATURE: undefined (features/AUTH/auth_off.feature) ==========
[12] Feature has 2 scenario(s)
[0-12] [12] ===== BEFORE SCENARIO: Login as Guest (features/AUTH/auth_off.feature) =====
[0-12] [12] Scenario tags: @smoke
[0-11] { isAlive: true }
[0-12] WARNING: cannot stop the Syngrisi server
[0-11] SERVER IS STARTED, PID: '54380' port: '3013'
[0-8] { command: 'waitForDisplayed' }
[0-8] [8] ===== AFTER SCENARIO: Create User - Success (features/AP/users/create.feature) =====
[8] Scenario result: passed
[0-8] [8] ===== BEFORE SCENARIO: Create User - User Already Exist (features/AP/users/create.feature) =====
[8] Scenario tags: @integration
[0-11] { command: 'waitForDisplayed' }
[0-11] { uri: 'http://localhost:3013' }
[0-11] 👉 { uri: 'http://localhost:3013/v1/users' }
[0-12] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest12' }\n"
}
[0-11] {
  respBody: {
    _id: '690b31dc9627dd4816e1c06a',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:15:40.393Z',
    id: '690b31dc9627dd4816e1c06a'
  }
}
[0-8] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest8' }\n"
}
[0-11] { command: 'waitForDisplayed' }
[0-12] { isAlive: true }
[0-12] SERVER IS STARTED, PID: '54611' port: '3014'
[0-8] { isAlive: true }
[0-8] SERVER IS STARTED, PID: '54651' port: '3010'
[0-8] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31e0334910a7340460e4","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31e0334910a7340460e4"}'
}
[0-12] { command: 'waitForDisplayed' }
[0-12] [12] ===== AFTER SCENARIO: Login as Guest (features/AUTH/auth_off.feature) =====
[12] Scenario result: passed
[0-12] [12] ===== BEFORE SCENARIO: Login as Guest with redirect (features/AUTH/auth_off.feature) =====
[12] Scenario tags: none
[0-11] { command: 'waitForDisplayed' }
[0-12] WARNING: cannot stop the Syngrisi server
[0-11] [11] ===== AFTER SCENARIO: Update User - Success (features/AP/users/update.feature) =====
[11] Scenario result: passed
[0-11] [11] ========== AFTER FEATURE: undefined (features/AP/users/update.feature) ==========
[0-11] PASSED in chrome - /features/AP/users/update.feature
[0-12] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest12' }\n"
}
[0-8] { isAlive: true }
[0-8] SERVER IS STARTED, PID: '54892' port: '3010'
[0-12] { isAlive: true }
[0-13] RUNNING in chrome - /features/AUTH/change_passwords.feature
[0-12] SERVER IS STARTED, PID: '54871' port: '3014'
[0-13] [13] ========== BEFORE FEATURE: undefined (features/AUTH/change_passwords.feature) ==========
[0-13] [13] Feature has 4 scenario(s)
[0-13] [13] ===== BEFORE SCENARIO: Change Password - Smoke (features/AUTH/change_passwords.feature) =====
[13] Scenario tags: @smoke
[0-12] { command: 'waitForExist' }
[0-12] [12] ===== AFTER SCENARIO: Login as Guest with redirect (features/AUTH/auth_off.feature) =====
[12] Scenario result: passed
[0-12] [12] ========== AFTER FEATURE: undefined (features/AUTH/auth_off.feature) ==========
[0-13] WARNING: cannot stop the Syngrisi server
[0-12] PASSED in chrome - /features/AUTH/auth_off.feature
[0-8] { command: 'waitForDisplayed' }
[0-13] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest13' }\n"
}
[0-14] RUNNING in chrome - /features/AUTH/first_run.feature
[0-14] [14] ========== BEFORE FEATURE: undefined (features/AUTH/first_run.feature) ==========
[14] Feature has 1 scenario(s)
[0-14] [14] ===== BEFORE SCENARIO: Change Administrator password and login to system (features/AUTH/first_run.feature) =====
[14] Scenario tags: @smoke
[0-14] WARNING: cannot stop the Syngrisi server
[0-8] { command: 'waitForEnabled' }
[0-13] { isAlive: true }
[0-14] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest14' }\n"
}
[0-13] SERVER IS STARTED, PID: '55096' port: '3015'
[0-13] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31ed6d2b1762ade8b766","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31ed6d2b1762ade8b766"}'
}
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '55263' port: '3015'
[0-13] { uri: 'http://localhost:3015' }
[0-13] 👉 { uri: 'http://localhost:3015/v1/users' }
[0-13] {
  respBody: {
    _id: '690b31f06baa3ca69d476bf3',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:16:00.692Z',
    id: '690b31f06baa3ca69d476bf3'
  }
}
[0-14] { isAlive: true }
[0-14] SERVER IS STARTED, PID: '55257' port: '3016'
[0-8] { actualValue: 'user with this email already exists' }
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '55483' port: '3015'
[0-14] { actualValue: 'Change Password for default Administrator' }
[0-8] [8] ===== AFTER SCENARIO: Create User - User Already Exist (features/AP/users/create.feature) =====
[0-8] [8] Scenario result: passed
[0-8] [8] ===== BEFORE SCENARIO: Create User - Invalid fields (features/AP/users/create.feature) =====
[8] Scenario tags: @integration
[0-8] WARNING: cannot stop the Syngrisi server
[0-8] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest8' }\n"
}
[0-14] { actualValue: 'forbidden' }
[0-14] [14] ===== AFTER SCENARIO: Change Administrator password and login to system (features/AUTH/first_run.feature) =====
[0-14] [14] Scenario result: passed
[0-14] [14] ========== AFTER FEATURE: undefined (features/AUTH/first_run.feature) ==========
[0-14] PASSED in chrome - /features/AUTH/first_run.feature
[0-8] { isAlive: true }
[0-8] SERVER IS STARTED, PID: '55691' port: '3010'
[0-8] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b31fd93e0f4ca45f89bb7","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b31fd93e0f4ca45f89bb7"}'
}
[0-15] RUNNING in chrome - /features/AUTH/login_smoke.feature
[0-13] { command: 'waitForDisplayed' }
[0-15] [15] ========== BEFORE FEATURE: undefined (features/AUTH/login_smoke.feature) ==========
[0-15] [15] Feature has 1 scenario(s)
[0-15] [15] ===== BEFORE SCENARIO: Login - default Test user (features/AUTH/login_smoke.feature) =====
[15] Scenario tags: none
[0-15] WARNING: cannot stop the Syngrisi server
[0-8] { isAlive: true }
[0-8] SERVER IS STARTED, PID: '55935' port: '3010'
[0-15] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest15' }\n"
}
[0-8] { command: 'waitForDisplayed' }
[0-15] { isAlive: true }
[0-15] SERVER IS STARTED, PID: '56069' port: '3017'
[0-15] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b32075387ee8eff4223e8","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b32075387ee8eff4223e8"}'
}
[0-13] { command: 'waitForDisplayed' }
[0-13] [13] ===== AFTER SCENARIO: Change Password - Smoke (features/AUTH/change_passwords.feature) =====
[13] Scenario result: passed
[0-15] { isAlive: true }
[0-13] [13] ===== BEFORE SCENARIO: Change Password - User not Logged In (features/AUTH/change_passwords.feature) =====
[13] Scenario tags: none
[0-8] { actualValue: 'Invalid email format' }
[0-13] WARNING: cannot stop the Syngrisi server
[0-15] SERVER IS STARTED, PID: '56213' port: '3017'
[0-8] { actualValue: 'Invalid email format' }
[0-15] { command: 'waitForDisplayed' }
[0-13] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest13' }\n"
}
[0-15] [15] ===== AFTER SCENARIO: Login - default Test user (features/AUTH/login_smoke.feature) =====
[15] Scenario result: passed
[0-15] [15] ========== AFTER FEATURE: undefined (features/AUTH/login_smoke.feature) ==========
[0-15] PASSED in chrome - /features/AUTH/login_smoke.feature
[0-8] [8] ===== AFTER SCENARIO: Create User - Invalid fields (features/AP/users/create.feature) =====
[8] Scenario result: passed
[0-8] [8] ========== AFTER FEATURE: undefined (features/AP/users/create.feature) ==========
[0-8] PASSED in chrome - /features/AP/users/create.feature
[0-16] RUNNING in chrome - /features/AUTH/login.feature
[0-13] { isAlive: true }
[0-16] [16] ========== BEFORE FEATURE: undefined (features/AUTH/login.feature) ==========
[16] Feature has 5 scenario(s)
[0-16] [16] ===== BEFORE SCENARIO: Login - Create user and login (features/AUTH/login.feature) =====
[16] Scenario tags: @smoke
[0-13] SERVER IS STARTED, PID: '56392' port: '3015'
[0-16] WARNING: cannot stop the Syngrisi server
[0-13] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b321043e86f3745c1859f","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b321043e86f3745c1859f"}'
}
[0-17] RUNNING in chrome - /features/AUTH/logout.feature
[0-13] { isAlive: true }
[0-17] [17] ========== BEFORE FEATURE: undefined (features/AUTH/logout.feature) ==========
[17] Feature has 1 scenario(s)
[0-17] [17] ===== BEFORE SCENARIO: Logout - default Test user (features/AUTH/logout.feature) =====
[0-17] [17] Scenario tags: none
[0-17] WARNING: cannot stop the Syngrisi server
[0-13] SERVER IS STARTED, PID: '56587' port: '3015'
[0-13] { uri: 'http://localhost:3015' }
[0-16] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest16' }\n"
}
[0-13] 👉 { uri: 'http://localhost:3015/v1/users' }
[0-13] {
  respBody: {
    _id: '690b3212f293ac9c9ad8531e',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:16:34.923Z',
    id: '690b3212f293ac9c9ad8531e'
  }
}
[0-17] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest17' }\n"
}
[0-17] { isAlive: true }
[0-17] SERVER IS STARTED, PID: '56725' port: '3019'
[0-17] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b3215b1ec6af8fa903c77","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b3215b1ec6af8fa903c77"}'
}
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '56662' port: '3018'
[0-16] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b3216d310c3a834998acf","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b3216d310c3a834998acf"}'
}
[0-17] { isAlive: true }
[0-13] { isAlive: true }
[0-17] SERVER IS STARTED, PID: '56788' port: '3019'
[0-13] SERVER IS STARTED, PID: '56789' port: '3015'
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '56813' port: '3018'
[0-16] { uri: 'http://localhost:3018' }
[0-16] 👉 { uri: 'http://localhost:3018/v1/users' }
[0-16] {
  respBody: {
    _id: '690b3219f8840cf052e118e7',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:16:41.707Z',
    id: '690b3219f8840cf052e118e7'
  }
}
[0-17] { command: 'waitForDisplayed' }
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '56977' port: '3018'
[0-16] { command: 'waitForDisplayed' }
[0-16] [16] ===== AFTER SCENARIO: Login - Create user and login (features/AUTH/login.feature) =====
[16] Scenario result: passed
[0-16] [16] ===== BEFORE SCENARIO: Login - Wrong password (features/AUTH/login.feature) =====
[16] Scenario tags: @smoke
[0-13] { actualValue: 'user is not logged in' }
[0-13] [13] ===== AFTER SCENARIO: Change Password - User not Logged In (features/AUTH/change_passwords.feature) =====
[0-13] [13] Scenario result: passed
[0-13] [13] ===== BEFORE SCENARIO: Change Password - Wrong Current Password (features/AUTH/change_passwords.feature) =====
[13] Scenario tags: none
[0-13] WARNING: cannot stop the Syngrisi server
[0-17] [17] ===== AFTER SCENARIO: Logout - default Test user (features/AUTH/logout.feature) =====
[17] Scenario result: passed
[0-17] [17] ========== AFTER FEATURE: undefined (features/AUTH/logout.feature) ==========
[0-17] PASSED in chrome - /features/AUTH/logout.feature
[0-13] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest13' }\n"
}
[0-16] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest16' }\n"
}
[0-18] RUNNING in chrome - /features/CHECKS_HANDLING/accept_by_user.feature
[0-18] [18] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/accept_by_user.feature) ==========
[18] Feature has 1 scenario(s)
[0-18] [18] ===== BEFORE SCENARIO: Accept by user (features/CHECKS_HANDLING/accept_by_user.feature) =====
[0-18] [18] Scenario tags: none
[0-18] WARNING: cannot stop the Syngrisi server
[0-18] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest18' }\n"
}
[0-16] { isAlive: true }
[0-13] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '57406' port: '3018'
[0-13] SERVER IS STARTED, PID: '57405' port: '3015'
[0-13] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b3226b5e7c265337883d1","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b3226b5e7c265337883d1"}'
}
[0-16] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b322645fe57a7533522a4","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b322645fe57a7533522a4"}'
}
[0-18] { isAlive: true }
[0-18] SERVER IS STARTED, PID: '57562' port: '3020'
[0-18] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b32270e8ab398bcf5138f","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b32270e8ab398bcf5138f"}'
}
[0-16] { isAlive: true }
[0-13] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '57604' port: '3018'
[0-13] SERVER IS STARTED, PID: '57605' port: '3015'
[0-13] { uri: 'http://localhost:3015' }
[0-13] 👉 { uri: 'http://localhost:3015/v1/users' }
[0-13] {
  respBody: {
    _id: '690b32283848e623ca61993f',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:16:56.415Z',
    id: '690b32283848e623ca61993f'
  }
}
[0-18] { isAlive: true }
[0-18] SERVER IS STARTED, PID: '57634' port: '3020'
[0-18] { uri: 'http://localhost:3020' }
[0-18] { uri: 'http://localhost:3020/v1/auth/apikey' }
[0-18] Create test # 0
[0-18] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3020/',
      apiKey: '3K7VEB9-SY3MK77-JCPHFJ7-79F96ZR',
      apiHash: '00ce1a84bc275e58d5abff5061ca3827ec34c6a69cc82d31309ba2019b459f23893d5d3f4a5b945e7c301e8e74ee91c48a2ecab7aa2d14065b20e8893cee8e36'
    }
  },
  params: { test: {} }
}
[0-18] 👉 {
  uri: 'http://localhost:3020/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-18] 👉 {
  checks: [
    {
      _id: '690b32292063857a0b600c49',
      name: 'CheckName',
      test: '690b32292063857a0b600c33',
      suite: '690b32292063857a0b600c31',
      app: '690b3229c20bc55d1e81f557',
      branch: 'integration',
      baselineId: '690b32292063857a0b600c45',
      actualSnapshotId: '690b32292063857a0b600c45',
      updatedDate: '2025-11-05T11:16:57.803Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32292063857a0b600c2e',
      creatorId: '690b32270e8ab398bcf5138f',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:16:57.814Z',
      id: '690b32292063857a0b600c49',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-18] 👉 {
  uri: 'http://localhost:3020/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-18] 👉 {
  items: [
    {
      _id: '690b32292063857a0b600c49',
      name: 'CheckName',
      test: '690b32292063857a0b600c33',
      suite: '690b32292063857a0b600c31',
      app: '690b3229c20bc55d1e81f557',
      branch: 'integration',
      baselineId: '690b32292063857a0b600c45',
      actualSnapshotId: '690b32292063857a0b600c45',
      updatedDate: '2025-11-05T11:16:58.571Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32292063857a0b600c2e',
      creatorId: '690b32270e8ab398bcf5138f',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:16:57.814Z',
      markedAs: 'accepted',
      markedById: '690b32270e8ab398bcf5138f',
      markedByUsername: 'Test',
      markedDate: '2025-11-05T11:16:58.571Z',
      id: '690b32292063857a0b600c49',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-16] {
  actualValue: "Authentication error: 'Password or username is incorrect'"
}
[0-16] [16] ===== AFTER SCENARIO: Login - Wrong password (features/AUTH/login.feature) =====
[16] Scenario result: passed
[0-16] [16] ===== BEFORE SCENARIO: Login - Empty credentials (features/AUTH/login.feature) =====
[0-16] [16] Scenario tags: none
[0-16] WARNING: cannot stop the Syngrisi server
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '57793' port: '3015'
[0-16] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest16' }\n"
}
[0-18] [18] ===== AFTER SCENARIO: Accept by user (features/CHECKS_HANDLING/accept_by_user.feature) =====
[18] Scenario result: passed
[0-18] [18] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/accept_by_user.feature) ==========
[0-18] PASSED in chrome - /features/CHECKS_HANDLING/accept_by_user.feature
[0-16] { isAlive: true }
[0-19] RUNNING in chrome - /features/CHECKS_HANDLING/check_without_session_starting.feature
[0-16] SERVER IS STARTED, PID: '57878' port: '3018'
[0-16] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b3231da896f23eb36fa61","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b3231da896f23eb36fa61"}'
}
[0-19] [19] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/check_without_session_starting.feature) ==========
[19] Feature has 1 scenario(s)
[0-19] [19] ===== BEFORE SCENARIO: Create new check - without session ending (features/CHECKS_HANDLING/check_without_session_starting.feature) =====
[19] Scenario tags: @integration, @smoke, @e2e
[0-16] { isAlive: true }
[0-19] WARNING: cannot stop the Syngrisi server
[0-16] SERVER IS STARTED, PID: '58016' port: '3018'
[0-19] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest19' }\n"
}
[0-13] { command: 'waitForDisplayed' }
[0-16] [16] ===== AFTER SCENARIO: Login - Empty credentials (features/AUTH/login.feature) =====
[16] Scenario result: passed
[0-16] [16] ===== BEFORE SCENARIO: Login - Invalid email (features/AUTH/login.feature) =====
[16] Scenario tags: none
[0-16] WARNING: cannot stop the Syngrisi server
[0-19] { isAlive: true }
[0-19] SERVER IS STARTED, PID: '58225' port: '3021'
[0-19] Expect: The test id is empty
Stored: The test id is empty, the session may not have started yet:check name: 'new int check', driver: '{
	"api": {
		"config": {
			"url": "http://localhost:3021/",
			"apiKey": "123",
			"apiHash": "3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2"
		}
	},
	"params": {
		"test": {}
	}
}'
[0-19] [19] ===== AFTER SCENARIO: Create new check - without session ending (features/CHECKS_HANDLING/check_without_session_starting.feature) =====
[19] Scenario result: passed
[0-19] [19] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/check_without_session_starting.feature) ==========
[0-19] PASSED in chrome - /features/CHECKS_HANDLING/check_without_session_starting.feature
[0-13] {
  actualValue: 'IncorrectPasswordError: Password or username is incorrect at PBKDF2Job.<anonymous> (/Users/a1/Projects/syngrisi/node_modules/passport-local-mongoose/lib/authenticate.js:91:34) at PBKDF2Job.job.ondone (node:internal/crypto/pbkdf2:55:12)'
}
[0-13] [13] ===== AFTER SCENARIO: Change Password - Wrong Current Password (features/AUTH/change_passwords.feature) =====
[13] Scenario result: passed
[0-16] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest16' }\n"
}
[0-13] [13] ===== BEFORE SCENARIO: Change Password - Validation (features/AUTH/change_passwords.feature) =====
[13] Scenario tags: none
[0-13] WARNING: cannot stop the Syngrisi server
[0-13] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest13' }\n"
}
[0-20] RUNNING in chrome - /features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature
[0-16] { isAlive: true }
[0-20] [20] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature) ==========
[20] Feature has 1 scenario(s)
[0-20] [20] ===== BEFORE SCENARIO: Two checks with identical image parts but different resolutions [1px, bottom] (features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature) =====
[20] Scenario tags: none
[0-16] SERVER IS STARTED, PID: '58395' port: '3018'
[0-20] WARNING: cannot stop the Syngrisi server
[0-16] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b323d900060bb9d5ccfac","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b323d900060bb9d5ccfac"}'
}
[0-20] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest20' }\n"
}
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '58499' port: '3015'
[0-13] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b3240d86cc3b2b7251841","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b3240d86cc3b2b7251841"}'
}
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '58615' port: '3018'
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '58716' port: '3015'
[0-13] { uri: 'http://localhost:3015' }
[0-20] { isAlive: true }
[0-13] 👉 { uri: 'http://localhost:3015/v1/users' }
[0-13] {
  respBody: {
    _id: '690b3242a488d8b633a49c68',
    username: 'j_doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:17:22.243Z',
    id: '690b3242a488d8b633a49c68'
  }
}
[0-20] SERVER IS STARTED, PID: '58687' port: '3022'
[0-20] Create test # 0
[0-20] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3022/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-20] 👉 {
  uri: 'http://localhost:3022/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-20] 👉 {
  checks: [
    {
      _id: '690b324354c1c91fbcdb177a',
      name: 'CheckName',
      test: '690b324254c1c91fbcdb1764',
      suite: '690b324254c1c91fbcdb1762',
      app: '690b3242c20bc55d1e81f906',
      branch: 'integration',
      baselineId: '690b324354c1c91fbcdb1776',
      actualSnapshotId: '690b324354c1c91fbcdb1776',
      updatedDate: '2025-11-05T11:17:23.203Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b324254c1c91fbcdb175f',
      creatorId: '690b323f54c1c91fbcdb1755',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:23.265Z',
      id: '690b324354c1c91fbcdb177a',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-20] Create test # 0
[0-20] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3022/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'Checks with different resolutions 1px - 1',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'd1af4710-29e6-49ee-b15a-fd68c89c39fe',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-16] [16] ===== AFTER SCENARIO: Login - Invalid email (features/AUTH/login.feature) =====
[16] Scenario result: passed
[0-16] [16] ===== BEFORE SCENARIO: Redirect via origin url (features/AUTH/login.feature) =====
[16] Scenario tags: none
[0-16] WARNING: cannot stop the Syngrisi server
[0-20] 👉 {
  uri: 'http://localhost:3022/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"Checks with different resolutions 1px - 2","$options":"im"}}]}'
}
[0-20] 👉 {
  items: [
    {
      _id: '690b324454c1c91fbcdb17a4',
      name: 'Checks with different resolutions 1px - 2',
      status: 'Passed',
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      branch: 'integration',
      tags: [],
      viewport: '1366x768',
      os: 'macOS',
      app: '690b3242c20bc55d1e81f906',
      blinking: 0,
      updatedDate: '2025-11-05T11:17:26.068Z',
      startDate: '2025-11-05T11:17:24.652Z',
      checks: [Array],
      suite: '690b324254c1c91fbcdb1762',
      run: '690b324454c1c91fbcdb17a1',
      creatorId: '690b323f54c1c91fbcdb1755',
      creatorUsername: 'Guest',
      markedAs: 'Accepted',
      id: '690b324454c1c91fbcdb17a4'
    }
  ]
}
[0-20] 👉 {
  uri: 'http://localhost:3022/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-20] 👉 {
  items: [
    {
      _id: '690b324554c1c91fbcdb17bb',
      name: 'CheckName',
      test: '690b324454c1c91fbcdb17a4',
      suite: '690b324254c1c91fbcdb1762',
      app: '690b3242c20bc55d1e81f906',
      branch: 'integration',
      baselineId: '690b324354c1c91fbcdb1776',
      actualSnapshotId: '690b324554c1c91fbcdb17b6',
      updatedDate: '2025-11-05T11:17:25.107Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": false,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 1\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 6,\n' +
        '\t"executionTotalTime": "0,166205583",\n' +
        '\t"totalCheckHandleTime": "0,169865042"\n' +
        '}',
      run: '690b324454c1c91fbcdb17a1',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:17:24.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b323f54c1c91fbcdb1755',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:25.284Z',
      id: '690b324554c1c91fbcdb17bb',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b324354c1c91fbcdb177a',
      name: 'CheckName',
      test: '690b324254c1c91fbcdb1764',
      suite: '690b324254c1c91fbcdb1762',
      app: '690b3242c20bc55d1e81f906',
      branch: 'integration',
      baselineId: '690b324354c1c91fbcdb1776',
      actualSnapshotId: '690b324354c1c91fbcdb1776',
      updatedDate: '2025-11-05T11:17:24.446Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b324254c1c91fbcdb175f',
      creatorId: '690b323f54c1c91fbcdb1755',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:23.265Z',
      markedAs: 'accepted',
      markedById: '690b323f54c1c91fbcdb1755',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:24.445Z',
      id: '690b324354c1c91fbcdb177a',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-16] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest16' }\n"
}
[0-13] { isAlive: true }
[0-13] SERVER IS STARTED, PID: '58954' port: '3015'
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '58979' port: '3018'
[0-16] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b324889153de59f5bad89","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b324889153de59f5bad89"}'
}
[0-20] [20] ===== AFTER SCENARIO: Two checks with identical image parts but different resolutions [1px, bottom] (features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature) =====
[0-20] [20] Scenario result: passed
[0-20] [20] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature) ==========
[0-20] PASSED in chrome - /features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature
[0-16] { isAlive: true }
[0-16] SERVER IS STARTED, PID: '59050' port: '3018'
[0-21] RUNNING in chrome - /features/CHECKS_HANDLING/ident.feature
[0-16] [16] ===== AFTER SCENARIO: Redirect via origin url (features/AUTH/login.feature) =====
[16] Scenario result: passed
[0-16] [16] ========== AFTER FEATURE: undefined (features/AUTH/login.feature) ==========
[0-16] PASSED in chrome - /features/AUTH/login.feature
[0-21] [21] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/ident.feature) ==========
[21] Feature has 4 scenario(s)
[0-21] [21] ===== BEFORE SCENARIO: Ident flow, same ident [accepted, passed] (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario tags: none
[0-21] WARNING: cannot stop the Syngrisi server
[0-22] RUNNING in chrome - /features/CHECKS_HANDLING/low_diff.feature
[0-21] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest21' }\n"
}
[0-22] [22] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/low_diff.feature) ==========
[22] Feature has 1 scenario(s)
[0-22] [22] ===== BEFORE SCENARIO: Low images difference (features/CHECKS_HANDLING/low_diff.feature) =====
[0-22] [22] Scenario tags: none
[0-21] { isAlive: true }
[0-22] WARNING: cannot stop the Syngrisi server
[0-21] SERVER IS STARTED, PID: '59317' port: '3023'
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-13] { command: 'waitForDisplayed' }
[0-22] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest22' }\n"
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  checks: [
    {
      _id: '690b3250412d7bf1335526c0',
      name: 'IdentCheck',
      test: '690b3250412d7bf1335526aa',
      suite: '690b3250412d7bf1335526a8',
      app: '690b3250c20bc55d1e81fbfd',
      branch: 'IdentBranch',
      baselineId: '690b3250412d7bf1335526bc',
      actualSnapshotId: '690b3250412d7bf1335526bc',
      updatedDate: '2025-11-05T11:17:36.874Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '1',
      browserFullVersion: '1.0.111.1',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3250412d7bf1335526a5',
      creatorId: '690b324f412d7bf13355269b',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:36.883Z',
      id: '690b3250412d7bf1335526c0',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b3250412d7bf1335526c0',
      name: 'IdentCheck',
      test: '690b3250412d7bf1335526aa',
      suite: '690b3250412d7bf1335526a8',
      app: '690b3250c20bc55d1e81fbfd',
      branch: 'IdentBranch',
      baselineId: '690b3250412d7bf1335526bc',
      actualSnapshotId: '690b3250412d7bf1335526bc',
      updatedDate: '2025-11-05T11:17:37.974Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '1',
      browserFullVersion: '1.0.111.1',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3250412d7bf1335526a5',
      creatorId: '690b324f412d7bf13355269b',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:36.883Z',
      markedAs: 'accepted',
      markedById: '690b324f412d7bf13355269b',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:37.974Z',
      id: '690b3250412d7bf1335526c0',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/baselines?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b3251412d7bf1335526da',
      name: 'IdentCheck',
      app: '690b3250c20bc55d1e81fbfd',
      branch: 'IdentBranch',
      browserName: 'safari',
      viewport: '500x500',
      os: 'Windows',
      createdDate: '2025-11-05T11:17:38.002Z',
      lastMarkedDate: '2025-11-05T11:17:37.974Z',
      markedAs: 'accepted',
      markedById: '690b324f412d7bf13355269b',
      markedByUsername: 'Guest',
      snapshootId: '690b3250412d7bf1335526bc',
      id: '690b3251412d7bf1335526da'
    }
  ]
}
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '276f29ca-b622-4801-a77e-30bdc6bbebd6',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-13] [13] ===== AFTER SCENARIO: Change Password - Validation (features/AUTH/change_passwords.feature) =====
[13] Scenario result: passed
[0-13] [13] ========== AFTER FEATURE: undefined (features/AUTH/change_passwords.feature) ==========
[0-13] PASSED in chrome - /features/AUTH/change_passwords.feature
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b3252412d7bf133552701',
      name: 'IdentCheck',
      test: '690b3252412d7bf1335526f3',
      suite: '690b3250412d7bf1335526a8',
      app: '690b3250c20bc55d1e81fbfd',
      branch: 'IdentBranch',
      baselineId: '690b3250412d7bf1335526bc',
      actualSnapshotId: '690b3252412d7bf1335526fd',
      updatedDate: '2025-11-05T11:17:38.827Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '2',
      browserFullVersion: '2.0.222.2',
      viewport: '500x500',
      os: 'Windows',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 0,\n' +
        '\t"executionTotalTime": "0",\n' +
        '\t"getBuffer": null,\n' +
        '\t"totalCheckHandleTime": "0,786541"\n' +
        '}',
      run: '690b3252412d7bf1335526f0',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:17:37.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b324f412d7bf13355269b',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:38.843Z',
      id: '690b3252412d7bf133552701',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b3250412d7bf1335526c0',
      name: 'IdentCheck',
      test: '690b3250412d7bf1335526aa',
      suite: '690b3250412d7bf1335526a8',
      app: '690b3250c20bc55d1e81fbfd',
      branch: 'IdentBranch',
      baselineId: '690b3250412d7bf1335526bc',
      actualSnapshotId: '690b3250412d7bf1335526bc',
      updatedDate: '2025-11-05T11:17:37.974Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '1',
      browserFullVersion: '1.0.111.1',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3250412d7bf1335526a5',
      creatorId: '690b324f412d7bf13355269b',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:36.883Z',
      markedAs: 'accepted',
      markedById: '690b324f412d7bf13355269b',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:37.974Z',
      id: '690b3250412d7bf1335526c0',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] [21] ===== AFTER SCENARIO: Ident flow, same ident [accepted, passed] (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario result: passed
[0-21] [21] ===== BEFORE SCENARIO: Ident flow, different ident all tests are new (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario tags: none
[0-21] WARNING: cannot stop the Syngrisi server
[0-23] RUNNING in chrome - /features/CHECKS_HANDLING/partially_accepted.feature
[0-22] { isAlive: true }
[0-22] SERVER IS STARTED, PID: '59443' port: '3024'
[0-22] Create test # 0
[0-22] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3024/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-23] [23] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/partially_accepted.feature) ==========
[0-23] [23] Feature has 1 scenario(s)
[0-23] [23] ===== BEFORE SCENARIO: Partially Accepted Test (features/CHECKS_HANDLING/partially_accepted.feature) =====
[0-23] [23] Scenario tags: @smoke
[0-21] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest21' }\n"
}
[0-23] WARNING: cannot stop the Syngrisi server
[0-22] 👉 {
  uri: 'http://localhost:3024/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-22] 👉 {
  checks: [
    {
      _id: '690b325543c91f21e55ccaff',
      name: 'CheckName',
      test: '690b325543c91f21e55ccae9',
      suite: '690b325543c91f21e55ccae7',
      app: '690b3255c20bc55d1e81fdad',
      branch: 'integration',
      baselineId: '690b325543c91f21e55ccafb',
      actualSnapshotId: '690b325543c91f21e55ccafb',
      updatedDate: '2025-11-05T11:17:41.374Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b325543c91f21e55ccae4',
      creatorId: '690b325343c91f21e55ccada',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:41.385Z',
      id: '690b325543c91f21e55ccaff',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-22] Create test # 0
[0-22] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3024/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '5365c7ea-b2f9-4637-a638-0ec7dd0232ce',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-21] { isAlive: true }
[0-23] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest23' }\n"
}
[0-21] SERVER IS STARTED, PID: '59596' port: '3023'
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-22] 👉 {
  uri: 'http://localhost:3024/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-22] 👉 {
  items: [
    {
      _id: '690b325643c91f21e55ccb42',
      name: 'CheckName',
      test: '690b325643c91f21e55ccb29',
      suite: '690b325543c91f21e55ccae7',
      app: '690b3255c20bc55d1e81fdad',
      branch: 'integration',
      baselineId: '690b325543c91f21e55ccafb',
      actualSnapshotId: '690b325643c91f21e55ccb3b',
      diffId: '690b325643c91f21e55ccb40',
      updatedDate: '2025-11-05T11:17:42.554Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0.0005228758169934641,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 24,\n' +
        '\t"executionTotalTime": "0,102887709",\n' +
        '\t"totalCheckHandleTime": "0,109558250"\n' +
        '}',
      run: '690b325643c91f21e55ccb26',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:17:42.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b325343c91f21e55ccada',
      creatorUsername: 'Guest',
      failReasons: [Array],
      createdDate: '2025-11-05T11:17:42.670Z',
      id: '690b325643c91f21e55ccb42',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b325543c91f21e55ccaff',
      name: 'CheckName',
      test: '690b325543c91f21e55ccae9',
      suite: '690b325543c91f21e55ccae7',
      app: '690b3255c20bc55d1e81fdad',
      branch: 'integration',
      baselineId: '690b325543c91f21e55ccafb',
      actualSnapshotId: '690b325543c91f21e55ccafb',
      updatedDate: '2025-11-05T11:17:42.186Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b325543c91f21e55ccae4',
      creatorId: '690b325343c91f21e55ccada',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:41.385Z',
      markedAs: 'accepted',
      markedById: '690b325343c91f21e55ccada',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:42.186Z',
      id: '690b325543c91f21e55ccaff',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-22] 👉 {
  uri: 'http://localhost:3024/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-23] { isAlive: true }
[0-22] 👉 {
  items: [
    {
      _id: '690b325643c91f21e55ccb42',
      name: 'CheckName',
      test: '690b325643c91f21e55ccb29',
      suite: '690b325543c91f21e55ccae7',
      app: '690b3255c20bc55d1e81fdad',
      branch: 'integration',
      baselineId: '690b325543c91f21e55ccafb',
      actualSnapshotId: '690b325643c91f21e55ccb3b',
      diffId: '690b325643c91f21e55ccb40',
      updatedDate: '2025-11-05T11:17:42.554Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0.0005228758169934641,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 24,\n' +
        '\t"executionTotalTime": "0,102887709",\n' +
        '\t"totalCheckHandleTime": "0,109558250"\n' +
        '}',
      run: '690b325643c91f21e55ccb26',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:17:42.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b325343c91f21e55ccada',
      creatorUsername: 'Guest',
      failReasons: [Array],
      createdDate: '2025-11-05T11:17:42.670Z',
      id: '690b325643c91f21e55ccb42',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b325543c91f21e55ccaff',
      name: 'CheckName',
      test: '690b325543c91f21e55ccae9',
      suite: '690b325543c91f21e55ccae7',
      app: '690b3255c20bc55d1e81fdad',
      branch: 'integration',
      baselineId: '690b325543c91f21e55ccafb',
      actualSnapshotId: '690b325543c91f21e55ccafb',
      updatedDate: '2025-11-05T11:17:42.186Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b325543c91f21e55ccae4',
      creatorId: '690b325343c91f21e55ccada',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:41.385Z',
      markedAs: 'accepted',
      markedById: '690b325343c91f21e55ccada',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:42.186Z',
      id: '690b325543c91f21e55ccaff',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-22] [22] ===== AFTER SCENARIO: Low images difference (features/CHECKS_HANDLING/low_diff.feature) =====
[0-22] [22] Scenario result: passed
[0-22] [22] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/low_diff.feature) ==========
[0-22] PASSED in chrome - /features/CHECKS_HANDLING/low_diff.feature
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-23] SERVER IS STARTED, PID: '59623' port: '3025'
[0-21] 👉 {
  checks: [
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:43.170Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest_0',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '2be825f8-bf99-41c9-a4ba-a210cc9a7e40',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest_viewport',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '4461d9a9-f472-4264-aed0-0b9984a30e69',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-24] RUNNING in chrome - /features/CHECKS_HANDLING/remove_checks.feature
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest_browser',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '3a9d81a3-f41a-4ed8-93b5-2f765ed99a17',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-23] Create test # 0
[0-23] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3025/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-24] [24] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/remove_checks.feature) ==========
[0-24] [24] Feature has 2 scenario(s)
[0-24] [24] ===== BEFORE SCENARIO: Remove check via check preview (features/CHECKS_HANDLING/remove_checks.feature) =====
[24] Scenario tags: @smoke
[0-24] WARNING: cannot stop the Syngrisi server
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest_os',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '7781e9b5-ec06-4cd5-b46b-ffb874c99860',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest_branch',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch_1',
      runident: 'd37301c4-d6a9-48f0-b22e-b9b612733db8',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-24] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest24' }\n"
}
[0-23] { command: 'waitForDisplayed' }
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-24] { isAlive: true }
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b325df5f739b5d46e2a95',
      name: 'IdentCheck',
      test: '690b325cf5f739b5d46e2a87',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b325cc20bc55d1e8201e1',
      branch: 'IdentBranch',
      baselineId: '690b325df5f739b5d46e2a91',
      actualSnapshotId: '690b325df5f739b5d46e2a91',
      updatedDate: '2025-11-05T11:17:49.137Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325cf5f739b5d46e2a84',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:49.149Z',
      id: '690b325df5f739b5d46e2a95',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325bf5f739b5d46e2a72',
      name: 'IdentCheck',
      test: '690b325bf5f739b5d46e2a64',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch_1',
      baselineId: '690b325bf5f739b5d46e2a6e',
      actualSnapshotId: '690b325bf5f739b5d46e2a6e',
      updatedDate: '2025-11-05T11:17:47.972Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b325bf5f739b5d46e2a61',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:47.983Z',
      id: '690b325bf5f739b5d46e2a72',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b325af5f739b5d46e2a4f',
      name: 'IdentCheck',
      test: '690b325af5f739b5d46e2a41',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b325af5f739b5d46e2a4b',
      actualSnapshotId: '690b325af5f739b5d46e2a4b',
      updatedDate: '2025-11-05T11:17:46.880Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'macOs',
      result: '{}',
      run: '690b325af5f739b5d46e2a3e',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:46.885Z',
      id: '690b325af5f739b5d46e2a4f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3259f5f739b5d46e2a2c',
      name: 'IdentCheck',
      test: '690b3259f5f739b5d46e2a1e',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3259f5f739b5d46e2a28',
      actualSnapshotId: '690b3259f5f739b5d46e2a28',
      updatedDate: '2025-11-05T11:17:45.749Z',
      status: [Array],
      browserName: 'chrome',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3259f5f739b5d46e2a1b',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:45.766Z',
      id: '690b3259f5f739b5d46e2a2c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3258f5f739b5d46e2a09',
      name: 'IdentCheck',
      test: '690b3258f5f739b5d46e29fb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3258f5f739b5d46e2a05',
      actualSnapshotId: '690b3258f5f739b5d46e2a05',
      updatedDate: '2025-11-05T11:17:44.463Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x1000',
      os: 'Windows',
      result: '{}',
      run: '690b3258f5f739b5d46e29f8',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:44.534Z',
      id: '690b3258f5f739b5d46e2a09',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b3257f5f739b5d46e29d1',
      name: 'IdentCheck',
      test: '690b3256f5f739b5d46e29bb',
      suite: '690b3256f5f739b5d46e29b9',
      app: '690b3256c20bc55d1e81fee8',
      branch: 'IdentBranch',
      baselineId: '690b3257f5f739b5d46e29cd',
      actualSnapshotId: '690b3257f5f739b5d46e29cd',
      updatedDate: '2025-11-05T11:17:44.002Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b3256f5f739b5d46e29b6',
      creatorId: '690b3255f5f739b5d46e29ac',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:43.180Z',
      markedAs: 'accepted',
      markedById: '690b3255f5f739b5d46e29ac',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:17:44.002Z',
      id: '690b3257f5f739b5d46e29d1',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] [21] ===== AFTER SCENARIO: Ident flow, different ident all tests are new (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario result: passed
[0-21] [21] ===== BEFORE SCENARIO: Ident flow, same ident [unaccepted, failed] (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario tags: none
[0-21] WARNING: cannot stop the Syngrisi server
[0-24] SERVER IS STARTED, PID: '59905' port: '3026'
[0-23] { command: 'waitForDisplayed' }
[0-21] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest21' }\n"
}
[0-24] Create test # 0
[0-24] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3026/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-23] { command: 'waitForDisplayed' }
[0-23] [23] ===== AFTER SCENARIO: Partially Accepted Test (features/CHECKS_HANDLING/partially_accepted.feature) =====
[23] Scenario result: passed
[0-23] [23] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/partially_accepted.feature) ==========
[0-23] PASSED in chrome - /features/CHECKS_HANDLING/partially_accepted.feature
[0-21] { isAlive: true }
[0-21] SERVER IS STARTED, PID: '60011' port: '3023'
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-25] RUNNING in chrome - /features/CHECKS_HANDLING/standard_flow_ui.feature
[0-21] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: '654afb3c-229f-4be9-b17e-2353333114d3',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-24] { command: 'waitForDisplayed' }
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b32658c6460e3c882f06a',
      name: 'IdentCheck',
      test: '690b32648c6460e3c882f05c',
      suite: '690b32638c6460e3c882f02f',
      app: '690b3263c20bc55d1e8204ed',
      branch: 'IdentBranch',
      baselineId: '690b32658c6460e3c882f066',
      actualSnapshotId: '690b32658c6460e3c882f066',
      updatedDate: '2025-11-05T11:17:57.174Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b32648c6460e3c882f059',
      creatorId: '690b32618c6460e3c882f022',
      creatorUsername: 'Guest',
      failReasons: [Array],
      createdDate: '2025-11-05T11:17:57.372Z',
      id: '690b32658c6460e3c882f06a',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b32638c6460e3c882f047',
      name: 'IdentCheck',
      test: '690b32638c6460e3c882f031',
      suite: '690b32638c6460e3c882f02f',
      app: '690b3263c20bc55d1e8204ed',
      branch: 'IdentBranch',
      baselineId: '690b32638c6460e3c882f043',
      actualSnapshotId: '690b32638c6460e3c882f043',
      updatedDate: '2025-11-05T11:17:55.854Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b32638c6460e3c882f02c',
      creatorId: '690b32618c6460e3c882f022',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:17:55.864Z',
      id: '690b32638c6460e3c882f047',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] [21] ===== AFTER SCENARIO: Ident flow, same ident [unaccepted, failed] (features/CHECKS_HANDLING/ident.feature) =====
[0-21] [21] Scenario result: passed
[0-21] [21] ===== BEFORE SCENARIO: Ident flow, same ident [accepted, failed] (features/CHECKS_HANDLING/ident.feature) =====
[21] Scenario tags: none
[0-24] { command: 'waitForDisplayed' }
[0-21] WARNING: cannot stop the Syngrisi server
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-25] [25] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/standard_flow_ui.feature) ==========
[0-25] [25] Feature has 3 scenario(s)
[0-25] [25] ===== BEFORE SCENARIO: Status View - Standard Flow (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[25] Scenario tags: @smoke
[0-25] WARNING: cannot stop the Syngrisi server
[0-24] { command: 'waitForDisplayed' }
[0-21] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest21' }\n"
}
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-25] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest25' }\n"
}
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] [24] ===== AFTER SCENARIO: Remove check via check preview (features/CHECKS_HANDLING/remove_checks.feature) =====
[24] Scenario result: passed
[0-24] [24] ===== BEFORE SCENARIO: Remove check via Check Details Modal (features/CHECKS_HANDLING/remove_checks.feature) =====
[24] Scenario tags: @smoke
[0-21] { isAlive: true }
[0-24] WARNING: cannot stop the Syngrisi server
[0-21] SERVER IS STARTED, PID: '60418' port: '3023'
[0-25] { isAlive: true }
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-25] SERVER IS STARTED, PID: '60440' port: '3027'
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  checks: [
    {
      _id: '690b32732bb62fe7ce251f60',
      name: 'IdentCheck',
      test: '690b32732bb62fe7ce251f4a',
      suite: '690b32732bb62fe7ce251f48',
      app: '690b3273c20bc55d1e82069b',
      branch: 'IdentBranch',
      baselineId: '690b32732bb62fe7ce251f5c',
      actualSnapshotId: '690b32732bb62fe7ce251f5c',
      updatedDate: '2025-11-05T11:18:11.783Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b32732bb62fe7ce251f45',
      creatorId: '690b32702bb62fe7ce251f39',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:18:11.889Z',
      id: '690b32732bb62fe7ce251f60',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] Create test # 0
[0-21] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3023/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'IdentTest',
      app: 'IdentApp',
      run: 'integration_run_name',
      branch: 'IdentBranch',
      runident: 'f085d895-5040-4a7d-b854-22b60bf22762',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-24] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest24' }\n"
}
[0-21] 👉 {
  uri: 'http://localhost:3023/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"IdentCheck","$options":"im"}}]}'
}
[0-21] 👉 {
  items: [
    {
      _id: '690b32762bb62fe7ce251fa3',
      name: 'IdentCheck',
      test: '690b32752bb62fe7ce251f8a',
      suite: '690b32732bb62fe7ce251f48',
      app: '690b3273c20bc55d1e82069b',
      branch: 'IdentBranch',
      baselineId: '690b32732bb62fe7ce251f5c',
      actualSnapshotId: '690b32762bb62fe7ce251f9c',
      diffId: '690b32762bb62fe7ce251fa1',
      updatedDate: '2025-11-05T11:18:14.272Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 1.344665368928439,\n' +
        '\t"misMatchPercentage": "1.34",\n' +
        '\t"analysisTime": 54,\n' +
        '\t"executionTotalTime": "0,355755917",\n' +
        '\t"totalCheckHandleTime": "0,388958625"\n' +
        '}',
      run: '690b32752bb62fe7ce251f87',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:18:13.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b32702bb62fe7ce251f39',
      creatorUsername: 'Guest',
      failReasons: [Array],
      createdDate: '2025-11-05T11:18:14.702Z',
      id: '690b32762bb62fe7ce251fa3',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b32732bb62fe7ce251f60',
      name: 'IdentCheck',
      test: '690b32732bb62fe7ce251f4a',
      suite: '690b32732bb62fe7ce251f48',
      app: '690b3273c20bc55d1e82069b',
      branch: 'IdentBranch',
      baselineId: '690b32732bb62fe7ce251f5c',
      actualSnapshotId: '690b32732bb62fe7ce251f5c',
      updatedDate: '2025-11-05T11:18:13.554Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b32732bb62fe7ce251f45',
      creatorId: '690b32702bb62fe7ce251f39',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:18:11.889Z',
      markedAs: 'accepted',
      markedById: '690b32702bb62fe7ce251f39',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:18:13.554Z',
      id: '690b32732bb62fe7ce251f60',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-21] [21] ===== AFTER SCENARIO: Ident flow, same ident [accepted, failed] (features/CHECKS_HANDLING/ident.feature) =====
[21] Scenario result: passed
[0-21] [21] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/ident.feature) ==========
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-21] PASSED in chrome - /features/CHECKS_HANDLING/ident.feature
[0-24] { isAlive: true }
[0-24] SERVER IS STARTED, PID: '60815' port: '3026'
[0-24] Create test # 0
[0-24] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3026/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-26] RUNNING in chrome - /features/CHECKS_HANDLING/test_calculated_fields.feature
[0-24] Create test # 1
[0-24] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3026/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'e2cca7be-bed6-4b34-8d34-609f4805119b',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-26] [26] ========== BEFORE FEATURE: undefined (features/CHECKS_HANDLING/test_calculated_fields.feature) ==========
[0-26] [26] Feature has 5 scenario(s)
[0-26] [26] ===== BEFORE SCENARIO: Same viewports - [50x50, 50x50] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario tags: none
[0-26] WARNING: cannot stop the Syngrisi server
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-26] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest26' }\n"
}
[0-24] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForDisplayed' }
[0-26] { isAlive: true }
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '9d69e74b-eea6-4894-87f3-d6132a5ddd5a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-26] SERVER IS STARTED, PID: '61489' port: '3028'
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-24] { command: 'waitForDisplayed' }
[0-26] [26] ===== AFTER SCENARIO: Same viewports - [50x50, 50x50] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario result: passed
[0-26] [26] ===== BEFORE SCENARIO: Different viewports - [50x50, 100x100] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario tags: none
[0-26] WARNING: cannot stop the Syngrisi server
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-26] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest26' }\n"
}
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] { command: 'waitForDisplayed' }
[0-24] [24] ===== AFTER SCENARIO: Remove check via Check Details Modal (features/CHECKS_HANDLING/remove_checks.feature) =====
[24] Scenario result: passed
[0-24] [24] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/remove_checks.feature) ==========
[0-24] PASSED in chrome - /features/CHECKS_HANDLING/remove_checks.feature
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '68cc65eb-1964-4faf-a4bd-35f49769c9cd',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-26] { isAlive: true }
[0-26] SERVER IS STARTED, PID: '62016' port: '3028'
[0-27] RUNNING in chrome - /features/CP/check_details/accept_via_details.feature
[0-27] [27] ========== BEFORE FEATURE: undefined (features/CP/check_details/accept_via_details.feature) ==========
[0-27] [27] Feature has 1 scenario(s)
[0-27] [27] ===== BEFORE SCENARIO: Related - Navigation via Related Panel and Accept second Check (features/CP/check_details/accept_via_details.feature) =====
[27] Scenario tags: @smoke
[0-27] WARNING: cannot stop the Syngrisi server
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-27] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest27' }\n"
}
[0-26] [26] ===== AFTER SCENARIO: Different viewports - [50x50, 100x100] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario result: passed
[0-26] [26] ===== BEFORE SCENARIO: Same viewports - [new, new] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario tags: none
[0-26] WARNING: cannot stop the Syngrisi server
[0-26] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest26' }\n"
}
[0-27] { isAlive: true }
[0-27] SERVER IS STARTED, PID: '62299' port: '3029'
[0-26] { isAlive: true }
[0-26] SERVER IS STARTED, PID: '62364' port: '3028'
[0-27] Create test # 0
[0-27] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3029/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-25] [25] ===== AFTER SCENARIO: Status View - Standard Flow (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[25] Scenario result: passed
[0-25] [25] ===== BEFORE SCENARIO: Status View - Not Accepted (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[25] Scenario tags: @smoke
[0-25] WARNING: cannot stop the Syngrisi server
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-25] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest25' }\n"
}
[0-26] [26] ===== AFTER SCENARIO: Same viewports - [new, new] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario result: passed
[0-26] [26] ===== BEFORE SCENARIO: Same viewports - [new, passed] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario tags: none
[0-26] WARNING: cannot stop the Syngrisi server
[0-25] { isAlive: true }
[0-25] SERVER IS STARTED, PID: '62657' port: '3027'
[0-26] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest26' }\n"
}
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-26] { isAlive: true }
[0-26] SERVER IS STARTED, PID: '62812' port: '3028'
[0-27] 👉 {
  uri: 'http://localhost:3029/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-27] 👉 {
  items: [
    {
      _id: '690b32a73ce640856043e750',
      name: 'CheckName',
      test: '690b32a73ce640856043e73a',
      suite: '690b32a73ce640856043e738',
      app: '690b32a7c20bc55d1e821400',
      branch: 'integration',
      baselineId: '690b32a73ce640856043e74c',
      actualSnapshotId: '690b32a73ce640856043e74c',
      updatedDate: '2025-11-05T11:19:17.187Z',
      status: [Array],
      browserName: 'safari',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows',
      result: '{}',
      run: '690b32a73ce640856043e735',
      creatorId: '690b32a13ce640856043e6f7',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:19:03.528Z',
      markedAs: 'accepted',
      markedById: '690b32a13ce640856043e6f7',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:19:17.187Z',
      id: '690b32a73ce640856043e750',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-27] { command: 'waitForDisplayed' }
[0-26] 👉 {
  uri: 'http://localhost:3028/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName-1","$options":"im"}}]}'
}
[0-26] 👉 {
  checks: [
    {
      _id: '690b32bb5adbded66645702b',
      name: 'CheckName-1',
      test: '690b32b95adbded666457015',
      suite: '690b32b95adbded666457013',
      app: '690b32b9c20bc55d1e8218ea',
      branch: 'integration',
      baselineId: '690b32ba5adbded666457027',
      actualSnapshotId: '690b32ba5adbded666457027',
      updatedDate: '2025-11-05T11:19:22.971Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32b95adbded666457010',
      creatorId: '690b32b35adbded666456fcc',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:19:23.101Z',
      id: '690b32bb5adbded66645702b',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-25] { command: 'waitForDisplayed' }
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '04ae2232-8c61-49a7-889b-8ac452a340a7',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-27] [27] ===== AFTER SCENARIO: Related - Navigation via Related Panel and Accept second Check (features/CP/check_details/accept_via_details.feature) =====
[27] Scenario result: passed
[0-27] [27] ========== AFTER FEATURE: undefined (features/CP/check_details/accept_via_details.feature) ==========
[0-25] { command: 'waitForExist' }
[0-27] PASSED in chrome - /features/CP/check_details/accept_via_details.feature
[0-25] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '1f224d6a-31ec-4d3a-9d4a-76fe852e593b',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-26] [26] ===== AFTER SCENARIO: Same viewports - [new, passed] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario result: passed
[0-26] [26] ===== BEFORE SCENARIO: Same viewports - [passed, failed] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario tags: none
[0-26] WARNING: cannot stop the Syngrisi server
[0-25] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForExist' }
[0-25] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForExist' }
[0-28] RUNNING in chrome - /features/CP/check_details/appearance_common.feature
[0-25] [25] ===== AFTER SCENARIO: Status View - Not Accepted (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[25] Scenario result: passed
[0-25] [25] ===== BEFORE SCENARIO: Status View - Wrong Size (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[0-25] [25] Scenario tags: @smoke
[0-25] WARNING: cannot stop the Syngrisi server
[0-26] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest26' }\n"
}
[0-28] [28] ========== BEFORE FEATURE: undefined (features/CP/check_details/appearance_common.feature) ==========
[28] Feature has 1 scenario(s)
[0-28] [28] ===== BEFORE SCENARIO: Check Detail Appearance (features/CP/check_details/appearance_common.feature) =====
[0-28] [28] Scenario tags: @smoke
[0-28] WARNING: cannot stop the Syngrisi server
[0-25] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest25' }\n"
}
[0-26] { isAlive: true }
[0-26] SERVER IS STARTED, PID: '65115' port: '3028'
[0-28] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest28' }\n"
}
[0-25] { isAlive: true }
[0-25] SERVER IS STARTED, PID: '65368' port: '3027'
[0-26] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-26] 👉 {
  uri: 'http://localhost:3028/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName-1","$options":"im"}}]}'
}
[0-26] 👉 {
  checks: [
    {
      _id: '690b32ed1ce0490de312db3c',
      name: 'CheckName-1',
      test: '690b32eb1ce0490de312db26',
      suite: '690b32eb1ce0490de312db24',
      app: '690b32ebc20bc55d1e821cf3',
      branch: 'integration',
      baselineId: '690b32ec1ce0490de312db38',
      actualSnapshotId: '690b32ec1ce0490de312db38',
      updatedDate: '2025-11-05T11:20:12.729Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32eb1ce0490de312db21',
      creatorId: '690b32e21ce0490de312dadc',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:13.106Z',
      id: '690b32ed1ce0490de312db3c',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-26] 👉 {
  uri: 'http://localhost:3028/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName-2","$options":"im"}}]}'
}
[0-26] 👉 {
  checks: [
    {
      _id: '690b32ed1ce0490de312db52',
      name: 'CheckName-2',
      test: '690b32eb1ce0490de312db26',
      suite: '690b32eb1ce0490de312db24',
      app: '690b32ebc20bc55d1e821cf3',
      branch: 'integration',
      baselineId: '690b32ed1ce0490de312db4e',
      actualSnapshotId: '690b32ed1ce0490de312db4e',
      updatedDate: '2025-11-05T11:20:13.862Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32eb1ce0490de312db21',
      creatorId: '690b32e21ce0490de312dadc',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:13.873Z',
      id: '690b32ed1ce0490de312db52',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-26] Create test # 0
[0-26] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3028/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'b9ec6c53-5e46-4020-889e-d503a8040096',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-28] { isAlive: true }
[0-28] SERVER IS STARTED, PID: '65635' port: '3030'
[0-26] [26] ===== AFTER SCENARIO: Same viewports - [passed, failed] (features/CHECKS_HANDLING/test_calculated_fields.feature) =====
[26] Scenario result: passed
[0-26] [26] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/test_calculated_fields.feature) ==========
[0-26] PASSED in chrome - /features/CHECKS_HANDLING/test_calculated_fields.feature
[0-25] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForExist' }
[0-25] Create test # 0
[0-25] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3027/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'e7f48cf5-0348-436f-b6b8-3c744135c095',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-28] Create test # 0
[0-28] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3030/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] RUNNING in chrome - /features/CP/check_details/apperance_enabled_buttons.feature
[0-29] [29] ========== BEFORE FEATURE: undefined (features/CP/check_details/apperance_enabled_buttons.feature) ==========
[29] Feature has 5 scenario(s)
[0-29] [29] ===== BEFORE SCENARIO: New Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[0-29] [29] Scenario tags: @smoke
[0-29] WARNING: cannot stop the Syngrisi server
[0-28] { command: 'waitForDisplayed' }
[0-28] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForDisplayed' }
[0-29] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest29' }\n"
}
[0-25] { command: 'waitForDisplayed' }
[0-25] { command: 'waitForDisplayed' }
[0-29] { isAlive: true }
[0-28] 👉 {
  uri: 'http://localhost:3030/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-28] 👉 {
  checks: [
    {
      _id: '690b32f5083ade7445c06de2',
      name: 'CheckName',
      test: '690b32f5083ade7445c06dcc',
      suite: '690b32f5083ade7445c06dca',
      app: '690b32f5c20bc55d1e8220b4',
      branch: 'integration',
      baselineId: '690b32f5083ade7445c06dde',
      actualSnapshotId: '690b32f5083ade7445c06dde',
      updatedDate: '2025-11-05T11:20:21.805Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32f5083ade7445c06dc7',
      creatorId: '690b32ef083ade7445c06d86',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:21.826Z',
      id: '690b32f5083ade7445c06de2',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] SERVER IS STARTED, PID: '66335' port: '3031'
[0-25] [25] ===== AFTER SCENARIO: Status View - Wrong Size (features/CHECKS_HANDLING/standard_flow_ui.feature) =====
[25] Scenario result: passed
[0-25] [25] ========== AFTER FEATURE: undefined (features/CHECKS_HANDLING/standard_flow_ui.feature) ==========
[0-28] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3030/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '26ef7238-e61b-47e2-ba81-2093ad3908b2',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-25] PASSED in chrome - /features/CHECKS_HANDLING/standard_flow_ui.feature
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-30] RUNNING in chrome - /features/CP/check_details/heighlight.feature
[0-30] [30] ========== BEFORE FEATURE: undefined (features/CP/check_details/heighlight.feature) ==========
[30] Feature has 1 scenario(s)
[0-30] [30] ===== BEFORE SCENARIO: Check Details Difference Highlight (features/CP/check_details/heighlight.feature) =====
[0-30] [30] Scenario tags: @smoke
[0-30] WARNING: cannot stop the Syngrisi server
[0-28] { command: 'waitForDisplayed' }
[0-28] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-30] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest30' }\n"
}
[0-28] 👉 {
  uri: 'http://localhost:3030/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-28] 👉 {
  checks: [
    {
      _id: '690b3300083ade7445c06eee',
      name: 'CheckName',
      test: '690b3300083ade7445c06ee0',
      suite: '690b32f5083ade7445c06dca',
      app: '690b32f5c20bc55d1e8220b4',
      branch: 'integration',
      baselineId: '690b32f5083ade7445c06dde',
      actualSnapshotId: '690b3300083ade7445c06eea',
      updatedDate: '2025-11-05T11:20:32.827Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 0,\n' +
        '\t"executionTotalTime": "0",\n' +
        '\t"getBuffer": null,\n' +
        '\t"totalCheckHandleTime": "0,4268916"\n' +
        '}',
      run: '690b3300083ade7445c06edd',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:20:30.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b32ef083ade7445c06d86',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:32.851Z',
      id: '690b3300083ade7445c06eee',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b32f5083ade7445c06de2',
      name: 'CheckName',
      test: '690b32f5083ade7445c06dcc',
      suite: '690b32f5083ade7445c06dca',
      app: '690b32f5c20bc55d1e8220b4',
      branch: 'integration',
      baselineId: '690b32f5083ade7445c06dde',
      actualSnapshotId: '690b32f5083ade7445c06dde',
      updatedDate: '2025-11-05T11:20:30.355Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b32f5083ade7445c06dc7',
      creatorId: '690b32ef083ade7445c06d86',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:21.826Z',
      markedAs: 'accepted',
      markedById: '690b32ef083ade7445c06d86',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:20:30.355Z',
      id: '690b32f5083ade7445c06de2',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-28] Create test # 0
[0-28] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3030/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'b576080c-aaf4-42ad-bf4f-2aef5cc86b76',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-29] [29] ===== AFTER SCENARIO: New Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[29] Scenario result: passed
[0-29] [29] ===== BEFORE SCENARIO: Passed Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[29] Scenario tags: @smoke
[0-29] WARNING: cannot stop the Syngrisi server
[0-30] { isAlive: true }
[0-29] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest29' }\n"
}
[0-30] SERVER IS STARTED, PID: '66767' port: '3032'
[0-30] Create test # 0
[0-30] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3032/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] { isAlive: true }
[0-29] SERVER IS STARTED, PID: '66873' port: '3031'
[0-28] { command: 'waitForDisplayed' }
[0-30] 👉 {
  uri: 'http://localhost:3032/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-30] 👉 {
  checks: [
    {
      _id: '690b330d659414c680ef0a30',
      name: 'CheckName',
      test: '690b330c659414c680ef0a1a',
      suite: '690b330c659414c680ef0a18',
      app: '690b330cc20bc55d1e8228f8',
      branch: 'integration',
      baselineId: '690b330d659414c680ef0a2c',
      actualSnapshotId: '690b330d659414c680ef0a2c',
      updatedDate: '2025-11-05T11:20:45.220Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b330c659414c680ef0a15',
      creatorId: '690b3307659414c680ef09d7',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:45.249Z',
      id: '690b330d659414c680ef0a30',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-30] Create test # 0
[0-30] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3032/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'b2eb17d2-39bc-45d8-8aa2-472377c6e44b',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-28] { command: 'waitForDisplayed' }
[0-29] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] 👉 {
  uri: 'http://localhost:3031/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-29] 👉 {
  checks: [
    {
      _id: '690b331082636e8f9396a165',
      name: 'CheckName',
      test: '690b331082636e8f9396a14f',
      suite: '690b331082636e8f9396a14d',
      app: '690b3310c20bc55d1e822b02',
      branch: 'integration',
      baselineId: '690b331082636e8f9396a161',
      actualSnapshotId: '690b331082636e8f9396a161',
      updatedDate: '2025-11-05T11:20:48.479Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b331082636e8f9396a14a',
      creatorId: '690b330b82636e8f9396a106',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:20:48.494Z',
      id: '690b331082636e8f9396a165',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'cdd8f220-b011-4d27-bafa-44dbeb3aef1f',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-28] [28] ===== AFTER SCENARIO: Check Detail Appearance (features/CP/check_details/appearance_common.feature) =====
[28] Scenario result: passed
[0-28] [28] ========== AFTER FEATURE: undefined (features/CP/check_details/appearance_common.feature) ==========
[0-28] PASSED in chrome - /features/CP/check_details/appearance_common.feature
[0-30] { command: 'waitForDisplayed' }
[0-30] js result 👉: null
[0-31] RUNNING in chrome - /features/CP/check_details/initial_resize.feature
[0-29] { command: 'waitForDisplayed' }
[0-31] [31] ========== BEFORE FEATURE: undefined (features/CP/check_details/initial_resize.feature) ==========
[0-31] [31] Feature has 4 scenario(s)
[0-31] [31] ===== BEFORE SCENARIO: Image fit in the viewport (features/CP/check_details/initial_resize.feature) =====
[31] Scenario tags: none
[0-31] WARNING: cannot stop the Syngrisi server
[0-31] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest31' }\n"
}
[0-30] js result 👉: 151
[0-30] Expect: 151
Stored: 151
[0-30] [30] ===== AFTER SCENARIO: Check Details Difference Highlight (features/CP/check_details/heighlight.feature) =====
[0-30] [30] Scenario result: passed
[0-30] [30] ========== AFTER FEATURE: undefined (features/CP/check_details/heighlight.feature) ==========
[0-29] [29] ===== AFTER SCENARIO: Passed Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[29] Scenario result: passed
[0-29] [29] ===== BEFORE SCENARIO: Passed Check with Ignore Regions (features/CP/check_details/apperance_enabled_buttons.feature) =====
[29] Scenario tags: @smoke
[0-30] PASSED in chrome - /features/CP/check_details/heighlight.feature
[0-29] WARNING: cannot stop the Syngrisi server
[0-29] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest29' }\n"
}
[0-32] RUNNING in chrome - /features/CP/check_details/open_close_check_details.feature
[0-29] { isAlive: true }
[0-31] { isAlive: true }
[0-29] SERVER IS STARTED, PID: '67448' port: '3031'
[0-31] SERVER IS STARTED, PID: '67383' port: '3033'
[0-32] [32] ========== BEFORE FEATURE: undefined (features/CP/check_details/open_close_check_details.feature) ==========
[0-32] [32] Feature has 2 scenario(s)
[0-31] Create test # 0
[0-31] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3033/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-32] [32] ===== BEFORE SCENARIO: Open/Close Check Details via click (features/CP/check_details/open_close_check_details.feature) =====
[0-32] [32] Scenario tags: @smoke
[0-32] WARNING: cannot stop the Syngrisi server
[0-32] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest32' }\n"
}
[0-29] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] 👉 {
  uri: 'http://localhost:3031/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-29] 👉 {
  checks: [
    {
      _id: '690b331e6ff81b76866fc92a',
      name: 'CheckName',
      test: '690b331e6ff81b76866fc914',
      suite: '690b331e6ff81b76866fc912',
      app: '690b331ec20bc55d1e822ec7',
      branch: 'integration',
      baselineId: '690b331e6ff81b76866fc926',
      actualSnapshotId: '690b331e6ff81b76866fc926',
      updatedDate: '2025-11-05T11:21:02.600Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b331e6ff81b76866fc90f',
      creatorId: '690b331a6ff81b76866fc8cb',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:21:02.614Z',
      id: '690b331e6ff81b76866fc92a',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '4531ba83-aff4-414c-9e1e-ed0d04337a20',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-32] { isAlive: true }
[0-29] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-32] SERVER IS STARTED, PID: '67577' port: '3034'
[0-31] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-32] Create test # 0
[0-32] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3034/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] [29] ===== AFTER SCENARIO: Passed Check with Ignore Regions (features/CP/check_details/apperance_enabled_buttons.feature) =====
[29] Scenario result: passed
[0-29] [29] ===== BEFORE SCENARIO: Failed Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[0-29] [29] Scenario tags: @smoke
[0-31] js result 👉: 340_0
[0-31] js result 👉: true
[0-31] Expect: true
Stored: true
[0-29] WARNING: cannot stop the Syngrisi server
[0-31] js result 👉: 1
[0-32] { command: 'waitForDisplayed' }
[0-31] Expect: 1
[0-31] Stored: 1
[0-31] [31] ===== AFTER SCENARIO: Image fit in the viewport (features/CP/check_details/initial_resize.feature) =====
[31] Scenario result: passed
[0-31] [31] ===== BEFORE SCENARIO: Image is too small (features/CP/check_details/initial_resize.feature) =====
[31] Scenario tags: none
[0-31] WARNING: cannot stop the Syngrisi server
[0-32] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForExist' }
[0-29] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest29' }\n"
}
[0-31] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest31' }\n"
}
[0-32] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForDisplayed' }
[0-32] [32] ===== AFTER SCENARIO: Open/Close Check Details via click (features/CP/check_details/open_close_check_details.feature) =====
[32] Scenario result: passed
[0-32] [32] ===== BEFORE SCENARIO: Open/Close Check Details via url (features/CP/check_details/open_close_check_details.feature) =====
[0-32] [32] Scenario tags: @smoke
[0-32] WARNING: cannot stop the Syngrisi server
[0-31] { isAlive: true }
[0-29] { isAlive: true }
[0-32] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest32' }\n"
}
[0-31] SERVER IS STARTED, PID: '67935' port: '3033'
[0-31] Create test # 0
[0-31] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3033/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] SERVER IS STARTED, PID: '67934' port: '3031'
[0-32] { isAlive: true }
[0-32] SERVER IS STARTED, PID: '68064' port: '3034'
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-32] Create test # 0
[0-32] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3034/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] 👉 {
  uri: 'http://localhost:3031/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-29] 👉 {
  checks: [
    {
      _id: '690b332e4564ff1c977cd4c0',
      name: 'CheckName',
      test: '690b332d4564ff1c977cd4aa',
      suite: '690b332d4564ff1c977cd4a8',
      app: '690b332dc20bc55d1e8234ed',
      branch: 'integration',
      baselineId: '690b332e4564ff1c977cd4bc',
      actualSnapshotId: '690b332e4564ff1c977cd4bc',
      updatedDate: '2025-11-05T11:21:18.063Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b332d4564ff1c977cd4a5',
      creatorId: '690b33284564ff1c977cd460',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:21:18.101Z',
      id: '690b332e4564ff1c977cd4c0',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'ce5be1e7-de69-485b-a129-9ace85bdd2c9',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-32] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForDisplayed' }
[0-31] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForExist' }
[0-29] { command: 'waitForDisplayed' }
[0-32] { command: 'waitForDisplayed' }
[0-32] js result 👉: {
  url: 'http://localhost:3034/?checkId=690b332fdb9d74d733013601&modalIsOpen=true'
}
[0-29] { command: 'waitForDisplayed' }
[0-31] js result 👉: 310_0
[0-32] { command: 'waitForDisplayed' }
[0-31] js result 👉: true
[0-31] Expect: true
Stored: true
[0-31] js result 👉: 3.5
[0-31] Expect: 3.5
[0-31] Stored: 3.5
[0-31] [31] ===== AFTER SCENARIO: Image is too small (features/CP/check_details/initial_resize.feature) =====
[0-31] [31] Scenario result: passed
[0-31] [31] ===== BEFORE SCENARIO: Image is too high (features/CP/check_details/initial_resize.feature) =====
[31] Scenario tags: none
[0-32] ITEM js
[0-32] PROPERTY url
[0-32] { command: 'waitForDisplayed' }
[0-31] WARNING: cannot stop the Syngrisi server
[0-32] [32] ===== AFTER SCENARIO: Open/Close Check Details via url (features/CP/check_details/open_close_check_details.feature) =====
[32] Scenario result: passed
[0-32] [32] ========== AFTER FEATURE: undefined (features/CP/check_details/open_close_check_details.feature) ==========
[0-32] PASSED in chrome - /features/CP/check_details/open_close_check_details.feature
[0-29] [29] ===== AFTER SCENARIO: Failed Check (features/CP/check_details/apperance_enabled_buttons.feature) =====
[0-29] [29] Scenario result: passed
[0-29] [29] ===== BEFORE SCENARIO: Failed Check difference more than 5% (features/CP/check_details/apperance_enabled_buttons.feature) =====
[0-29] [29] Scenario tags: @smoke
[0-29] WARNING: cannot stop the Syngrisi server
[0-31] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest31' }\n"
}
[0-29] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest29' }\n"
}
[0-33] RUNNING in chrome - /features/CP/check_details/regions.feature
[0-33] [33] ========== BEFORE FEATURE: undefined (features/CP/check_details/regions.feature) ==========
[0-33] [33] Feature has 3 scenario(s)
[0-33] [33] ===== BEFORE SCENARIO: Regions - add, save, check (features/CP/check_details/regions.feature) =====
[0-33] [33] Scenario tags: @smoke
[0-33] WARNING: cannot stop the Syngrisi server
[0-31] { isAlive: true }
[0-31] SERVER IS STARTED, PID: '68593' port: '3033'
[0-31] Create test # 0
[0-31] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3033/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] { isAlive: true }
[0-33] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest33' }\n"
}
[0-29] SERVER IS STARTED, PID: '68633' port: '3031'
[0-33] { isAlive: true }
[0-33] SERVER IS STARTED, PID: '68751' port: '3035'
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-29] 👉 {
  uri: 'http://localhost:3031/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-29] 👉 {
  checks: [
    {
      _id: '690b3341898c1254845eb942',
      name: 'CheckName',
      test: '690b3341898c1254845eb92c',
      suite: '690b3341898c1254845eb92a',
      app: '690b3341c20bc55d1e823b2a',
      branch: 'integration',
      baselineId: '690b3341898c1254845eb93e',
      actualSnapshotId: '690b3341898c1254845eb93e',
      updatedDate: '2025-11-05T11:21:37.668Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b3341898c1254845eb927',
      creatorId: '690b333d898c1254845eb8e5',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:21:37.688Z',
      id: '690b3341898c1254845eb942',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] Create test # 0
[0-29] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3031/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'bbc5e5e5-f0d2-4354-82a3-1ca2fd9e8a5a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] Create test # 0
[0-33] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3035/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-31] { command: 'waitForDisplayed' }
[0-33] 👉 {
  uri: 'http://localhost:3035/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-29] { command: 'waitForDisplayed' }
[0-33] 👉 {
  checks: [
    {
      _id: '690b33438747305799056416',
      name: 'CheckName',
      test: '690b33428747305799056400',
      suite: '690b334287473057990563fe',
      app: '690b3342c20bc55d1e823baf',
      branch: 'integration',
      baselineId: '690b33438747305799056412',
      actualSnapshotId: '690b33438747305799056412',
      updatedDate: '2025-11-05T11:21:39.377Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b334287473057990563fb',
      creatorId: '690b333f87473057990563bd',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:21:39.389Z',
      id: '690b33438747305799056416',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-29] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-33] { command: 'waitForDisplayed' }
[0-29] { command: 'waitForDisplayed' }
[0-33] js result 👉: 0
[0-31] js result 👉: 528.9902284108953_0
[0-31] js result 👉: true
[0-31] Expect: true
Stored: true
[0-31] js result 👉: 0.04
[0-31] Expect: 0.04
[0-31] Stored: 0.04
[0-31] [31] ===== AFTER SCENARIO: Image is too high (features/CP/check_details/initial_resize.feature) =====
[0-31] [31] Scenario result: passed
[0-31] [31] ===== BEFORE SCENARIO: Image is too wide (features/CP/check_details/initial_resize.feature) =====
[31] Scenario tags: none
[0-31] WARNING: cannot stop the Syngrisi server
[0-33] Expect: 0
Stored: 0
[0-33] { command: 'waitForDisplayed' }
[0-33] js result 👉: 1
[0-31] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest31' }\n"
}
[0-33] Expect: 1
[0-33] Stored: 1
[0-29] [29] ===== AFTER SCENARIO: Failed Check difference more than 5% (features/CP/check_details/apperance_enabled_buttons.feature) =====
[0-29] [29] Scenario result: passed
[0-29] [29] ========== AFTER FEATURE: undefined (features/CP/check_details/apperance_enabled_buttons.feature) ==========
[0-29] PASSED in chrome - /features/CP/check_details/apperance_enabled_buttons.feature
[0-31] { isAlive: true }
[0-34] RUNNING in chrome - /features/CP/check_details/related/related_navigation_and_accept.feature
[0-31] SERVER IS STARTED, PID: '69214' port: '3033'
[0-31] Create test # 0
[0-31] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3033/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-34] [34] ========== BEFORE FEATURE: undefined (features/CP/check_details/related/related_navigation_and_accept.feature) ==========
[0-34] [34] Feature has 1 scenario(s)
[0-34] [34] ===== BEFORE SCENARIO: Related - Navigation via Related Panel and Accept second Check (features/CP/check_details/related/related_navigation_and_accept.feature) =====
[0-34] [34] Scenario tags: @smoke
[0-34] WARNING: cannot stop the Syngrisi server
[0-33] js result 👉: 1
[0-33] Expect: 1
Stored: 1
[0-34] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest34' }\n"
}
[0-33] js result 👉: 20,50,202,102,MediumVioletRed,black,0.5
[0-33] Expect: 20,50,202,102,MediumVioletRed,black,0.5
Stored: 20,50,202,102,MediumVioletRed,black,0.5
[0-33] js result 👉: 300,500,202,102,MediumVioletRed,black,0.5
[0-33] Expect: 300,500,202,102,MediumVioletRed,black,0.5
[0-33] Stored: 300,500,202,102,MediumVioletRed,black,0.5
[0-31] { command: 'waitForDisplayed' }
[0-34] { isAlive: true }
[0-34] SERVER IS STARTED, PID: '69434' port: '3036'
[0-33] js result 👉: 1
[0-33] Expect: 1
Stored: 1
[0-33] js result 👉: 300,500,204,104,MediumVioletRed,black,0.5
[0-33] Expect: 300,500,204,104,MediumVioletRed,black,0.5
[0-33] Stored: 300,500,204,104,MediumVioletRed,black,0.5
[0-33] [33] ===== AFTER SCENARIO: Regions - add, save, check (features/CP/check_details/regions.feature) =====
[33] Scenario result: passed
[0-33] [33] ===== BEFORE SCENARIO: Regions - delete (features/CP/check_details/regions.feature) =====
[0-33] [33] Scenario tags: @smoke
[0-33] WARNING: cannot stop the Syngrisi server
[0-31] js result 👉: 0_0
[0-31] Expect: 0_0
Stored: 0_0
[0-31] js result 👉: true
[0-31] Expect: true
[0-31] Stored: true
[0-31] [31] ===== AFTER SCENARIO: Image is too wide (features/CP/check_details/initial_resize.feature) =====
[0-31] [31] Scenario result: passed
[0-31] [31] ========== AFTER FEATURE: undefined (features/CP/check_details/initial_resize.feature) ==========
[0-34] Create test # 0
[0-34] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3036/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-31] PASSED in chrome - /features/CP/check_details/initial_resize.feature
[0-33] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest33' }\n"
}
[0-34] Create test # 1
[0-34] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3036/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows0',
      viewport: '1440x900',
      browser: 'safari0',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: '9abafb2b-09cd-48ba-9e1f-6ef66873988a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-34] Create test # 2
[0-34] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3036/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows1',
      viewport: '1440x900',
      browser: 'safari1',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: 'bd2e509c-446c-4664-9064-ba0e26d45dd8',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-35] RUNNING in chrome - /features/CP/check_details/related/related_navigation.feature
[0-33] { isAlive: true }
[0-35] [35] ========== BEFORE FEATURE: undefined (features/CP/check_details/related/related_navigation.feature) ==========
[0-35] [35] Feature has 1 scenario(s)
[0-35] [35] ===== BEFORE SCENARIO: Related - Navigation via Related Panel (features/CP/check_details/related/related_navigation.feature) =====
[35] Scenario tags: @smoke
[0-35] WARNING: cannot stop the Syngrisi server
[0-33] SERVER IS STARTED, PID: '69682' port: '3035'
[0-35] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest35' }\n"
}
[0-33] Create test # 0
[0-33] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3035/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-34] { command: 'waitForDisplayed' }
[0-33] 👉 {
  uri: 'http://localhost:3035/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-33] 👉 {
  checks: [
    {
      _id: '690b335f58a58d71ed21b682',
      name: 'CheckName',
      test: '690b335e58a58d71ed21b66c',
      suite: '690b335e58a58d71ed21b66a',
      app: '690b335ec20bc55d1e824474',
      branch: 'integration',
      baselineId: '690b335f58a58d71ed21b67e',
      actualSnapshotId: '690b335f58a58d71ed21b67e',
      updatedDate: '2025-11-05T11:22:07.108Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b335e58a58d71ed21b667',
      creatorId: '690b335958a58d71ed21b623',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:07.123Z',
      id: '690b335f58a58d71ed21b682',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-35] { isAlive: true }
[0-33] 33# error in: /I unfold the test "TestName":features/CP/check_details/regions.feature:19, 5
Error: Unable to locate test row for "TestName"
Error: Unable to locate test row for "TestName"
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:226:11)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
    at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
[0-33] [33] ===== AFTER SCENARIO: Regions - delete (features/CP/check_details/regions.feature) =====
[0-33] [33] Scenario result: failed
[0-33] Error in "Check details - Regions2: Regions - delete"
Error: Unable to locate test row for "TestName"
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:226:11)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
    at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
[0-33] [33] ===== BEFORE SCENARIO: Regions - delete (features/CP/check_details/regions.feature) =====
[33] Scenario tags: @smoke
[0-33] WARNING: cannot stop the Syngrisi server
[0-35] SERVER IS STARTED, PID: '69861' port: '3037'
[0-33] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest33' }\n"
}
[0-35] Create test # 0
[0-35] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3037/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-35] Create test # 1
[0-35] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3037/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows0',
      viewport: '1440x900',
      browser: 'safari0',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: '22159b7a-9c2a-4573-a192-6e39796863b8',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] { isAlive: true }
[0-33] SERVER IS STARTED, PID: '70169' port: '3035'
[0-35] Create test # 2
[0-35] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3037/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows1',
      viewport: '1440x900',
      browser: 'safari1',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: '1328708d-071b-4a34-b37b-24635adb833b',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] Create test # 0
[0-33] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3035/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-33] 👉 {
  uri: 'http://localhost:3035/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-33] 👉 {
  checks: [
    {
      _id: '690b336a58dcf94ebfb2344b',
      name: 'CheckName',
      test: '690b336958dcf94ebfb23435',
      suite: '690b336958dcf94ebfb23433',
      app: '690b3369c20bc55d1e824858',
      branch: 'integration',
      baselineId: '690b336a58dcf94ebfb23447',
      actualSnapshotId: '690b336a58dcf94ebfb23447',
      updatedDate: '2025-11-05T11:22:18.326Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b336958dcf94ebfb23430',
      creatorId: '690b336458dcf94ebfb233ee',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:18.413Z',
      id: '690b336a58dcf94ebfb2344b',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-34] 👉 {
  uri: 'http://localhost:3036/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-33] { command: 'waitForDisplayed' }
[0-34] 👉 {
  items: [
    {
      _id: '690b335a63267ba1a72735bd',
      name: 'CheckName',
      test: '690b335a63267ba1a72735af',
      suite: '690b335763267ba1a727355f',
      app: '690b3357c20bc55d1e82420f',
      branch: 'integration2',
      baselineId: '690b335a63267ba1a72735b9',
      actualSnapshotId: '690b335a63267ba1a72735b9',
      updatedDate: '2025-11-05T11:22:02.336Z',
      status: [Array],
      browserName: 'safari2',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows2',
      result: '{}',
      run: '690b335963267ba1a72735ac',
      creatorId: '690b335263267ba1a727351e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:02.349Z',
      id: '690b335a63267ba1a72735bd',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b335963267ba1a727359a',
      name: 'CheckName',
      test: '690b335863267ba1a727358c',
      suite: '690b335763267ba1a727355f',
      app: '690b3357c20bc55d1e82420f',
      branch: 'integration1',
      baselineId: '690b335963267ba1a7273596',
      actualSnapshotId: '690b335963267ba1a7273596',
      updatedDate: '2025-11-05T11:22:21.337Z',
      status: [Array],
      browserName: 'safari1',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows1',
      result: '{}',
      run: '690b335863267ba1a7273589',
      creatorId: '690b335263267ba1a727351e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:01.227Z',
      markedAs: 'accepted',
      markedById: '690b335263267ba1a727351e',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:22:21.337Z',
      id: '690b335963267ba1a727359a',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    },
    {
      _id: '690b335863267ba1a7273577',
      name: 'CheckName',
      test: '690b335763267ba1a7273561',
      suite: '690b335763267ba1a727355f',
      app: '690b3357c20bc55d1e82420f',
      branch: 'integration0',
      baselineId: '690b335863267ba1a7273573',
      actualSnapshotId: '690b335863267ba1a7273573',
      updatedDate: '2025-11-05T11:22:00.096Z',
      status: [Array],
      browserName: 'safari0',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '500x500',
      os: 'Windows0',
      result: '{}',
      run: '690b335763267ba1a727355c',
      creatorId: '690b335263267ba1a727351e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:00.112Z',
      id: '690b335863267ba1a7273577',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-33] { command: 'waitForDisplayed' }
[0-33] js result 👉: 1
[0-34] { command: 'waitForDisplayed' }
[0-33] Expect: 1
Stored: 1
[0-34] [34] ===== AFTER SCENARIO: Related - Navigation via Related Panel and Accept second Check (features/CP/check_details/related/related_navigation_and_accept.feature) =====
[34] Scenario result: passed
[0-34] [34] ========== AFTER FEATURE: undefined (features/CP/check_details/related/related_navigation_and_accept.feature) ==========
[0-34] PASSED in chrome - /features/CP/check_details/related/related_navigation_and_accept.feature
[0-36] RUNNING in chrome - /features/CP/check_details/related/related.feature
[0-33] js result 👉: 1
[0-36] [36] ========== BEFORE FEATURE: undefined (features/CP/check_details/related/related.feature) ==========
[0-36] [36] Feature has 4 scenario(s)
[0-36] [36] ===== BEFORE SCENARIO: Related - same projects (features/CP/check_details/related/related.feature) =====
[0-36] [36] Scenario tags: @smoke
[0-36] WARNING: cannot stop the Syngrisi server
[0-35] { command: 'waitForDisplayed' }
[0-33] Expect: 1
Stored: 1
[0-33] js result 👉: null
[0-35] { command: 'waitForDisplayed' }
[0-35] { command: 'waitForDisplayed' }
[0-35] [35] ===== AFTER SCENARIO: Related - Navigation via Related Panel (features/CP/check_details/related/related_navigation.feature) =====
[0-35] [35] Scenario result: passed
[0-35] [35] ========== AFTER FEATURE: undefined (features/CP/check_details/related/related_navigation.feature) ==========
[0-35] PASSED in chrome - /features/CP/check_details/related/related_navigation.feature
[0-36] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest36' }\n"
}
[0-36] { isAlive: true }
[0-37] RUNNING in chrome - /features/CP/check_details/resize_and_pan.feature
[0-36] SERVER IS STARTED, PID: '71061' port: '3038'
[0-37] [37] ========== BEFORE FEATURE: undefined (features/CP/check_details/resize_and_pan.feature) ==========
[37] Feature has 4 scenario(s)
[0-37] [37] ===== BEFORE SCENARIO: Resize Dropdown Usage (features/CP/check_details/resize_and_pan.feature) =====
[37] Scenario tags: @smoke
[0-37] WARNING: cannot stop the Syngrisi server
[0-37] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest37' }\n"
}
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-33] js result 👉: 0
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: 'b3aacb31-97d8-4b48-a4cf-7b5116eeb582',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] Expect: 0
Stored: 0
[0-33] [33] ===== AFTER SCENARIO: Regions - delete (features/CP/check_details/regions.feature) =====
[33] Scenario result: passed
[0-33] [33] ===== BEFORE SCENARIO: Regions - copy regions from previous baseline (features/CP/check_details/regions.feature) =====
[33] Scenario tags: @smoke
[0-33] WARNING: cannot stop the Syngrisi server
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1440x900',
      browser: 'safari',
      browserVersion: '118',
      name: 'TestName-2',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: '78566626-873d-4aa6-9dfa-87190aba4d87',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-37] { isAlive: true }
[0-33] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest33' }\n"
}
[0-37] SERVER IS STARTED, PID: '71195' port: '3039'
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1440x900',
      browser: 'firefox',
      browserVersion: '118',
      name: 'TestName-3',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration2',
      runident: '29612de4-03ea-4191-a4ff-dc29c8deb19d',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] { isAlive: true }
[0-33] SERVER IS STARTED, PID: '71337' port: '3035'
[0-37] Create test # 0
[0-37] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3039/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-33] Create test # 0
[0-33] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3035/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-33] 👉 {
  uri: 'http://localhost:3035/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-33] 👉 {
  checks: [
    {
      _id: '690b33843e3dd6db0ce78158',
      name: 'CheckName',
      test: '690b33833e3dd6db0ce78142',
      suite: '690b33833e3dd6db0ce78140',
      app: '690b3383c20bc55d1e8250e7',
      branch: 'integration',
      baselineId: '690b33843e3dd6db0ce78154',
      actualSnapshotId: '690b33843e3dd6db0ce78154',
      updatedDate: '2025-11-05T11:22:44.161Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b33833e3dd6db0ce7813d',
      creatorId: '690b33803e3dd6db0ce780ff',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:44.173Z',
      id: '690b33843e3dd6db0ce78158',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-37] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-33] { command: 'waitForDisplayed' }
[0-37] { command: 'waitForDisplayed' }
[0-33] { command: 'waitForDisplayed' }
[0-37] js result 👉: 0.5
[0-37] Expect: 0.5
Stored: 0.5
[0-36] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-37] { command: 'waitForDisplayed' }
[0-37] js result 👉: 1
[0-37] Expect: 1
[0-37] Stored: 1
[0-36] { command: 'waitForDisplayed' }
[0-37] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-37] js result 👉: 2
[0-37] Expect: 2
Stored: 2
[0-33] js result 👉: 1
[0-37] { command: 'waitForDisplayed' }
[0-33] Expect: 1
Stored: 1
[0-33] Create test # 0
[0-33] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3035/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '4667578a-095f-4ac0-a2b4-c55402ea34c4',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-36] { command: 'waitForDisplayed' }
[0-36] [36] ===== AFTER SCENARIO: Related - same projects (features/CP/check_details/related/related.feature) =====
[0-36] [36] Scenario result: passed
[0-36] [36] ===== BEFORE SCENARIO: Related - different projects (features/CP/check_details/related/related.feature) =====
[36] Scenario tags: @smoke
[0-36] WARNING: cannot stop the Syngrisi server
[0-37] js result 👉: true
[0-37] Expect: true
[0-37] Stored: true
[0-37] { command: 'waitForDisplayed' }
[0-36] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest36' }\n"
}
[0-37] js result 👉: true
[0-37] Expect: true
Stored: true
[0-37] [37] ===== AFTER SCENARIO: Resize Dropdown Usage (features/CP/check_details/resize_and_pan.feature) =====
[0-37] [37] Scenario result: passed
[0-37] [37] ===== BEFORE SCENARIO: Resize via Ctrl + Mouse Wheel (features/CP/check_details/resize_and_pan.feature) =====
[37] Scenario tags: @smoke
[0-37] WARNING: cannot stop the Syngrisi server
[0-33] { command: 'waitForDisplayed' }
[0-36] { isAlive: true }
[0-37] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest37' }\n"
}
[0-36] SERVER IS STARTED, PID: '71927' port: '3038'
[0-37] { isAlive: true }
[0-37] SERVER IS STARTED, PID: '72034' port: '3039'
[0-33] js result 👉: 1
[0-33] Expect: 1
Stored: 1
[0-33] 👉 {
  uri: 'http://localhost:3035/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-33] 👉 {
  checks: [
    {
      _id: '690b338f3e3dd6db0ce7826d',
      name: 'CheckName',
      test: '690b338e3e3dd6db0ce7825f',
      suite: '690b33833e3dd6db0ce78140',
      app: '690b3383c20bc55d1e8250e7',
      branch: 'integration',
      baselineId: '690b33843e3dd6db0ce78154',
      actualSnapshotId: '690b338f3e3dd6db0ce78269',
      updatedDate: '2025-11-05T11:22:55.345Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 0,\n' +
        '\t"executionTotalTime": "0",\n' +
        '\t"getBuffer": null,\n' +
        '\t"totalCheckHandleTime": "0,924291"\n' +
        '}',
      run: '690b338e3e3dd6db0ce7825c',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:22:45.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b33803e3dd6db0ce780ff',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:55.352Z',
      id: '690b338f3e3dd6db0ce7826d',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b33843e3dd6db0ce78158',
      name: 'CheckName',
      test: '690b33833e3dd6db0ce78142',
      suite: '690b33833e3dd6db0ce78140',
      app: '690b3383c20bc55d1e8250e7',
      branch: 'integration',
      baselineId: '690b33843e3dd6db0ce78154',
      actualSnapshotId: '690b33843e3dd6db0ce78154',
      updatedDate: '2025-11-05T11:22:45.020Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b33833e3dd6db0ce7813d',
      creatorId: '690b33803e3dd6db0ce780ff',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:22:44.173Z',
      markedAs: 'accepted',
      markedById: '690b33803e3dd6db0ce780ff',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:22:45.020Z',
      id: '690b33843e3dd6db0ce78158',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-37] Create test # 0
[0-37] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3039/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-36] Create test # 1
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari',
      browserVersion: '118',
      name: 'TestName',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: '5141daf3-d718-4f48-924e-55f1a4ac9740',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari',
      browserVersion: '118',
      name: 'TestName',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: '1b450de2-34d0-4aec-8acf-e80da8375061',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-33] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-37] { command: 'waitForDisplayed' }
[0-33] js result 👉: 1
[0-33] Expect: 1
Stored: 1
[0-33] [33] ===== AFTER SCENARIO: Regions - copy regions from previous baseline (features/CP/check_details/regions.feature) =====
[33] Scenario result: passed
[0-33] [33] ========== AFTER FEATURE: undefined (features/CP/check_details/regions.feature) ==========
[0-33] PASSED in chrome - /features/CP/check_details/regions.feature
[0-37] js result 👉: 1.00
[0-37] js result 👉: 1.00
[0-37] Expect: 1.00
Stored: 1.00
[0-37] js result 👉: null
[0-37] js result 👉: 1.16
[0-37] js result 👉: true
[0-37] Expect: true
Stored: true
[0-37] [37] ===== AFTER SCENARIO: Resize via Ctrl + Mouse Wheel (features/CP/check_details/resize_and_pan.feature) =====
[37] Scenario result: passed
[0-37] [37] ===== BEFORE SCENARIO: Pan via central mouse button and Mouse Move (features/CP/check_details/resize_and_pan.feature) =====
[0-37] [37] Scenario tags: @smoke
[0-37] WARNING: cannot stop the Syngrisi server
[0-36] { command: 'waitForDisplayed' }
[0-38] RUNNING in chrome - /features/CP/check_details/side_to_side_view.feature
[0-36] [36] ===== AFTER SCENARIO: Related - different projects (features/CP/check_details/related/related.feature) =====
[0-36] [36] Scenario result: passed
[0-36] [36] ===== BEFORE SCENARIO: Related - sort by Date (features/CP/check_details/related/related.feature) =====
[36] Scenario tags: @smoke
[0-36] WARNING: cannot stop the Syngrisi server
[0-37] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest37' }\n"
}
[0-38] [38] ========== BEFORE FEATURE: undefined (features/CP/check_details/side_to_side_view.feature) ==========
[0-38] [38] Feature has 1 scenario(s)
[0-38] [38] ===== BEFORE SCENARIO: Divider in the center (features/CP/check_details/side_to_side_view.feature) =====
[0-38] [38] Scenario tags: @smoke
[0-38] WARNING: cannot stop the Syngrisi server
[0-36] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest36' }\n"
}
[0-38] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest38' }\n"
}
[0-36] { isAlive: true }
[0-38] { isAlive: true }
[0-36] SERVER IS STARTED, PID: '72538' port: '3038'
[0-38] SERVER IS STARTED, PID: '72560' port: '3040'
[0-37] { isAlive: true }
[0-37] SERVER IS STARTED, PID: '72509' port: '3039'
[0-36] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-38] Create test # 0
[0-38] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3040/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-37] Create test # 0
[0-37] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3039/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-36] Create test # 1
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari0',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: '708ce9a6-4faf-4eb1-a2a1-35d18953e292',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-38] 👉 {
  uri: 'http://localhost:3040/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-38] 👉 {
  checks: [
    {
      _id: '690b33a7885f803baea8c1d1',
      name: 'CheckName',
      test: '690b33a7885f803baea8c1bb',
      suite: '690b33a7885f803baea8c1b9',
      app: '690b33a7c20bc55d1e825d09',
      branch: 'integration',
      baselineId: '690b33a7885f803baea8c1cd',
      actualSnapshotId: '690b33a7885f803baea8c1cd',
      updatedDate: '2025-11-05T11:23:19.437Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b33a7885f803baea8c1b6',
      creatorId: '690b33a3885f803baea8c178',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:23:19.456Z',
      id: '690b33a7885f803baea8c1d1',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-38] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3040/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '2c318b67-8233-409e-a5be-055ac590e041',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-36] Create test # 2
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari1',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration1',
      runident: '2fa9eef1-2484-41d2-aef0-677007a5f280',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-37] { command: 'waitForDisplayed' }
[0-38] { command: 'waitForDisplayed' }
[0-37] js result 👉: 183.00/0.00
[0-37] js result 👉: true/0.00
[0-37] Expect: true/0.00
Stored: true/0.00
[0-37] js result 👉: null
[0-38] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-37] js result 👉: 233.00/50.00
[0-37] js result 👉: true/50.00
[0-37] Expect: true/50.00
Stored: true/50.00
[0-37] [37] ===== AFTER SCENARIO: Pan via central mouse button and Mouse Move (features/CP/check_details/resize_and_pan.feature) =====
[0-37] [37] Scenario result: passed
[0-37] [37] ===== BEFORE SCENARIO: Pan via Mouse Wheel (touchpad) (features/CP/check_details/resize_and_pan.feature) =====
[37] Scenario tags: @smoke
[0-37] WARNING: cannot stop the Syngrisi server
[0-36] { command: 'waitForDisplayed' }
[0-38] js result 👉: 372
[0-38] Expect: 372
[0-38] Stored: 372
{ command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-38] { command: 'waitForDisplayed' }
[0-37] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest37' }\n"
}
[0-38] { command: 'waitForDisplayed' }
[0-38] { command: 'waitForDisplayed' }
[0-38] [38] ===== AFTER SCENARIO: Divider in the center (features/CP/check_details/side_to_side_view.feature) =====
[38] Scenario result: passed
[0-38] [38] ========== AFTER FEATURE: undefined (features/CP/check_details/side_to_side_view.feature) ==========
[0-38] PASSED in chrome - /features/CP/check_details/side_to_side_view.feature
[0-37] { isAlive: true }
[0-37] SERVER IS STARTED, PID: '73064' port: '3039'
[0-36] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-39] RUNNING in chrome - /features/CP/check_details/simple_views.feature
[0-36] { command: 'waitForDisplayed' }
[0-39] [39] ========== BEFORE FEATURE: undefined (features/CP/check_details/simple_views.feature) ==========
[0-39] [39] Feature has 1 scenario(s)
[0-39] [39] ===== BEFORE SCENARIO: Simple Views (Expected, Actual, Diff) (features/CP/check_details/simple_views.feature) =====
[39] Scenario tags: @smoke
[0-37] Create test # 0
[0-37] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3039/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-39] WARNING: cannot stop the Syngrisi server
[0-36] [36] ===== AFTER SCENARIO: Related - sort by Date (features/CP/check_details/related/related.feature) =====
[36] Scenario result: passed
[0-36] [36] ===== BEFORE SCENARIO: Related - filter by Browser (features/CP/check_details/related/related.feature) =====
[36] Scenario tags: @smoke
[0-36] WARNING: cannot stop the Syngrisi server
[0-39] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest39' }\n"
}
[0-36] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest36' }\n"
}
[0-37] { command: 'waitForDisplayed' }
[0-37] js result 👉: 183.00/0.00
[0-37] js result 👉: true/0.00
[0-37] Expect: true/0.00
Stored: true/0.00
[0-37] js result 👉: null
[0-36] { isAlive: true }
[0-39] { isAlive: true }
[0-36] SERVER IS STARTED, PID: '73426' port: '3038'
[0-39] SERVER IS STARTED, PID: '73425' port: '3041'
[0-37] js result 👉: 208.00/25.00
[0-37] js result 👉: true/25.00
[0-37] Expect: true/25.00
Stored: true/25.00
[0-37] [37] ===== AFTER SCENARIO: Pan via Mouse Wheel (touchpad) (features/CP/check_details/resize_and_pan.feature) =====
[37] Scenario result: passed
[0-37] [37] ========== AFTER FEATURE: undefined (features/CP/check_details/resize_and_pan.feature) ==========
[0-37] PASSED in chrome - /features/CP/check_details/resize_and_pan.feature
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-39] Create test # 0
[0-39] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3041/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-40] RUNNING in chrome - /features/CP/header/filter_by_project.feature
[0-36] Create test # 0
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'safari',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: 'd61ecc8c-7254-46f4-a291-c6b7a4dbdc09',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-39] 👉 {
  uri: 'http://localhost:3041/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-39] 👉 {
  checks: [
    {
      _id: '690b33c025b85f3049b5b85e',
      name: 'CheckName',
      test: '690b33bf25b85f3049b5b848',
      suite: '690b33bf25b85f3049b5b846',
      app: '690b33bfc20bc55d1e826484',
      branch: 'integration',
      baselineId: '690b33c025b85f3049b5b85a',
      actualSnapshotId: '690b33c025b85f3049b5b85a',
      updatedDate: '2025-11-05T11:23:44.148Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b33bf25b85f3049b5b843',
      creatorId: '690b33bb25b85f3049b5b805',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:23:44.159Z',
      id: '690b33c025b85f3049b5b85e',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-39] Create test # 0
[0-39] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3041/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '80246e0f-25b5-4ae8-9caf-4bcf3329dc62',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-40] [40] ========== BEFORE FEATURE: undefined (features/CP/header/filter_by_project.feature) ==========
[40] Feature has 1 scenario(s)
[0-40] [40] ===== BEFORE SCENARIO: Filter by Project (features/CP/header/filter_by_project.feature) =====
[0-40] [40] Scenario tags: @smoke
[0-36] Create test # 1
[0-36] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3038/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'Windows',
      viewport: '1440x900',
      browser: 'firefox',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project1',
      run: 'integration_run_name',
      branch: 'integration0',
      runident: '3678fa26-be2d-4907-bb24-6099b050bb19',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-40] WARNING: cannot stop the Syngrisi server
[0-40] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest40' }\n"
}
[0-40] { isAlive: true }
[0-40] SERVER IS STARTED, PID: '73790' port: '3042'
[0-39] { command: 'waitForDisplayed' }
[0-39] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-40] Create test # 0
[0-40] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3042/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-36] { command: 'waitForDisplayed' }
[0-39] js result 👉: 0
[0-39] Expect: 0
Stored: 0
[0-40] Create test # 0
[0-40] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3042/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName Project-1',
      app: 'Project-1',
      run: 'RunName Project-1',
      branch: 'integration',
      runident: 'RunIdent Project-1 0',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-39] js result 👉: -1
[0-39] Expect: -1
Stored: -1
[0-36] { command: 'waitForDisplayed' }
[0-40] { command: 'waitForDisplayed' }
[0-40] { command: 'waitForDisplayed' }
[0-36] { command: 'waitForDisplayed' }
[0-39] js result 👉: -1
[0-39] Expect: -1
Stored: -1
[0-36] [36] ===== AFTER SCENARIO: Related - filter by Browser (features/CP/check_details/related/related.feature) =====
[36] Scenario result: passed
[0-36] [36] ========== AFTER FEATURE: undefined (features/CP/check_details/related/related.feature) ==========
[0-36] PASSED in chrome - /features/CP/check_details/related/related.feature
[0-39] js result 👉: 0
[0-39] Expect: 0
Stored: 0
[0-40] { command: 'waitForDisplayed' }
[0-40] [40] ===== AFTER SCENARIO: Filter by Project (features/CP/header/filter_by_project.feature) =====
[40] Scenario result: passed
[0-40] [40] ========== AFTER FEATURE: undefined (features/CP/header/filter_by_project.feature) ==========
[0-40] PASSED in chrome - /features/CP/header/filter_by_project.feature
[0-41] RUNNING in chrome - /features/CP/header/spotlight_navigation.feature
[0-39] js result 👉: 0
[0-39] Expect: 0
[0-39] Stored: 0
[0-39] [39] ===== AFTER SCENARIO: Simple Views (Expected, Actual, Diff) (features/CP/check_details/simple_views.feature) =====
[39] Scenario result: passed
[0-39] [39] ========== AFTER FEATURE: undefined (features/CP/check_details/simple_views.feature) ==========
[0-39] PASSED in chrome - /features/CP/check_details/simple_views.feature
[0-41] [41] ========== BEFORE FEATURE: undefined (features/CP/header/spotlight_navigation.feature) ==========
[0-41] [41] Feature has 6 scenario(s)
[0-42] RUNNING in chrome - /features/CP/header/switch_theme.feature
[0-41] [41] ===== BEFORE SCENARIO: Spotlight Appear (features/CP/header/spotlight_navigation.feature) =====
[0-41] [41] Scenario tags: none
[0-41] WARNING: cannot stop the Syngrisi server
[0-42] [42] ========== BEFORE FEATURE: undefined (features/CP/header/switch_theme.feature) ==========
[0-42] [42] Feature has 1 scenario(s)
[0-42] [42] ===== BEFORE SCENARIO: Switch Color Theme (features/CP/header/switch_theme.feature) =====
[0-42] [42] Scenario tags: @smoke
[0-43] RUNNING in chrome - /features/CP/header/user_info.feature
[0-42] WARNING: cannot stop the Syngrisi server
[0-43] [43] ========== BEFORE FEATURE: undefined (features/CP/header/user_info.feature) ==========
[43] Feature has 1 scenario(s)
[0-43] [43] ===== BEFORE SCENARIO: Check User Menu Information (features/CP/header/user_info.feature) =====
[0-43] [43] Scenario tags: @smoke
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-43] WARNING: cannot stop the Syngrisi server
[0-42] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest42' }\n"
}
[0-43] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest43' }\n"
}
[0-42] { isAlive: true }
[0-42] SERVER IS STARTED, PID: '74369' port: '3044'
[0-43] { isAlive: true }
[0-43] SERVER IS STARTED, PID: '74394' port: '3045'
[0-43] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b33d459300ea2eba38722","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b33d459300ea2eba38722"}'
}
[0-41] { isAlive: true }
[0-41] SERVER IS STARTED, PID: '74328' port: '3043'
[0-43] { isAlive: true }
[0-42] Create test # 0
[0-42] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3044/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-43] SERVER IS STARTED, PID: '74462' port: '3045'
[0-43] { uri: 'http://localhost:3045' }
[0-43] 👉 { uri: 'http://localhost:3045/v1/users' }
[0-43] {
  respBody: {
    _id: '690b33d635fda5a26c4b8c55',
    username: 'user@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdDate: '2025-11-05T11:24:06.607Z',
    id: '690b33d635fda5a26c4b8c55'
  }
}
[0-41] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-41] [41] ===== AFTER SCENARIO: Spotlight Appear (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario result: passed
[0-41] [41] ===== BEFORE SCENARIO: Spotlight Navigation - Results (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario tags: none
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-42] { command: 'waitForDisplayed' }
[0-41] { isAlive: true }
[0-41] SERVER IS STARTED, PID: '74691' port: '3043'
[0-43] { actualValue: 'JD' }
[0-42] [42] ===== AFTER SCENARIO: Switch Color Theme (features/CP/header/switch_theme.feature) =====
[42] Scenario result: passed
[0-42] [42] ========== AFTER FEATURE: undefined (features/CP/header/switch_theme.feature) ==========
[0-42] PASSED in chrome - /features/CP/header/switch_theme.feature
[0-41] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-43] { actualValue: 'John Doe' }
[0-41] [41] ===== AFTER SCENARIO: Spotlight Navigation - Results (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario result: passed
[0-41] [41] ===== BEFORE SCENARIO: Spotlight Navigation - Suite (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario tags: none
[0-44] RUNNING in chrome - /features/CP/items_isolations/checks_by_test.feature
[0-41] WARNING: cannot stop the Syngrisi server
[0-43] [43] ===== AFTER SCENARIO: Check User Menu Information (features/CP/header/user_info.feature) =====
[43] Scenario result: passed
[0-43] [43] ========== AFTER FEATURE: undefined (features/CP/header/user_info.feature) ==========
[0-43] PASSED in chrome - /features/CP/header/user_info.feature
[0-44] [44] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/checks_by_test.feature) ==========
[0-44] [44] Feature has 1 scenario(s)
[0-44] [44] ===== BEFORE SCENARIO: Checks Isolation by Test (features/CP/items_isolations/checks_by_test.feature) =====
[0-44] [44] Scenario tags: none
[0-44] WARNING: cannot stop the Syngrisi server
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-45] RUNNING in chrome - /features/CP/items_isolations/filter_by_project.feature
[0-44] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest44' }\n"
}
[0-45] [45] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/filter_by_project.feature) ==========
[0-45] [45] Feature has 1 scenario(s)
[0-45] [45] ===== BEFORE SCENARIO: Filter by Project (features/CP/items_isolations/filter_by_project.feature) =====
[0-45] [45] Scenario tags: @smoke
[0-45] WARNING: cannot stop the Syngrisi server
[0-44] { isAlive: true }
[0-44] SERVER IS STARTED, PID: '75105' port: '3046'
[0-45] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest45' }\n"
}
[0-41] { isAlive: true }
[0-41] SERVER IS STARTED, PID: '75060' port: '3043'
[0-45] { isAlive: true }
[0-45] SERVER IS STARTED, PID: '75200' port: '3047'
[0-44] Create test # 0
[0-44] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3046/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-44] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3046/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '276140dc-eef0-4290-85e3-e8839a8d5d8a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-41] { command: 'waitForDisplayed' }
[0-45] Create test # 0
[0-45] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3047/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-44] Create test # 0
[0-44] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3046/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'edfb402a-d357-431e-946a-94d517549f08',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-45] Create test # 0
[0-45] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3047/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName Project-1',
      app: 'Project-1',
      run: 'RunName Project-1',
      branch: 'integration',
      runident: 'RunIdent Project-1 0',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-44] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3046/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-2',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '5ecc7663-8485-4ac2-a099-aa8a32388847',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-41] { command: 'waitForDisplayed' }
[0-41] [41] ===== AFTER SCENARIO: Spotlight Navigation - Suite (features/CP/header/spotlight_navigation.feature) =====
[0-41] [41] Scenario result: passed
[0-41] [41] ===== BEFORE SCENARIO: Spotlight Navigation - Admin (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario tags: none
[0-45] { command: 'waitForDisplayed' }
[0-41] WARNING: cannot stop the Syngrisi server
[0-45] { command: 'waitForDisplayed' }
[0-44] { command: 'waitForDisplayed' }
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-45] { command: 'waitForDisplayed' }
[0-44] { command: 'waitForDisplayed' }
[0-44] { command: 'waitForDisplayed' }
[0-44] { command: 'waitForDisplayed' }
[0-44] { command: 'waitForDisplayed' }
[0-45] { command: 'waitForDisplayed' }
[0-45] [45] ===== AFTER SCENARIO: Filter by Project (features/CP/items_isolations/filter_by_project.feature) =====
[45] Scenario result: passed
[0-45] [45] ========== AFTER FEATURE: undefined (features/CP/items_isolations/filter_by_project.feature) ==========
[0-45] PASSED in chrome - /features/CP/items_isolations/filter_by_project.feature
[0-41] { isAlive: true }
[0-44] { command: 'waitForDisplayed' }
[0-41] SERVER IS STARTED, PID: '75490' port: '3043'
[0-44] { command: 'waitForDisplayed' }
[0-44] [44] ===== AFTER SCENARIO: Checks Isolation by Test (features/CP/items_isolations/checks_by_test.feature) =====
[0-44] [44] Scenario result: passed
[0-44] [44] ========== AFTER FEATURE: undefined (features/CP/items_isolations/checks_by_test.feature) ==========
[0-44] PASSED in chrome - /features/CP/items_isolations/checks_by_test.feature
[0-46] RUNNING in chrome - /features/CP/items_isolations/tests_by_accept_status.feature
[0-47] RUNNING in chrome - /features/CP/items_isolations/tests_by_browser.feature
[0-46] [46] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/tests_by_accept_status.feature) ==========
[0-46] [46] Feature has 1 scenario(s)
[0-46] [46] ===== BEFORE SCENARIO: Tests Isolation by Accept Status (features/CP/items_isolations/tests_by_accept_status.feature) =====
[0-46] [46] Scenario tags: none
[0-46] WARNING: cannot stop the Syngrisi server
[0-47] [47] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/tests_by_browser.feature) ==========
[0-47] [47] Feature has 1 scenario(s)
[0-47] [47] ===== BEFORE SCENARIO: Tests Isolation by Browser (features/CP/items_isolations/tests_by_browser.feature) =====
[0-47] [47] Scenario tags: none
[0-41] { command: 'waitForDisplayed' }
[0-47] WARNING: cannot stop the Syngrisi server
[0-46] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest46' }\n"
}
[0-47] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest47' }\n"
}
[0-41] { command: 'waitForDisplayed' }
[0-41] [41] ===== AFTER SCENARIO: Spotlight Navigation - Admin (features/CP/header/spotlight_navigation.feature) =====
[0-41] [41] Scenario result: passed
[0-41] [41] ===== BEFORE SCENARIO: Spotlight Navigation - Logs (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario tags: none
[0-41] WARNING: cannot stop the Syngrisi server
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-46] { isAlive: true }
[0-47] { isAlive: true }
[0-46] SERVER IS STARTED, PID: '75794' port: '3048'
[0-47] SERVER IS STARTED, PID: '75796' port: '3049'
[0-41] { isAlive: true }
[0-41] SERVER IS STARTED, PID: '75884' port: '3043'
[0-46] Create test # 0
[0-46] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3048/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-47] Create test # 0
[0-47] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3049/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-41] { command: 'waitForDisplayed' }
[0-46] Create test # 0
[0-46] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3048/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'AcceptStatus-unaccepted',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '141abd18-7a4b-44a2-9160-8b88f86ff73a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-47] Create test # 1
[0-47] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3049/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome-0',
      browserVersion: '118',
      name: 'TestBrowser-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'b14f8ead-bf18-4705-bb12-a24e8363e32c',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-46] 👉 {
  uri: 'http://localhost:3048/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"Check-part1","$options":"im"}}]}'
}
[0-46] 👉 {
  checks: [
    {
      _id: '690b340060f016a7ab36d5f1',
      name: 'Check-part1',
      test: '690b340060f016a7ab36d5e3',
      suite: '690b33fe60f016a7ab36d5b6',
      app: '690b33fec20bc55d1e827a7d',
      branch: 'integration',
      baselineId: '690b340060f016a7ab36d5ed',
      actualSnapshotId: '690b340060f016a7ab36d5ed',
      updatedDate: '2025-11-05T11:24:48.377Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b340060f016a7ab36d5e0',
      creatorId: '690b33f960f016a7ab36d575',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:24:48.384Z',
      id: '690b340060f016a7ab36d5f1',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-46] Create test # 0
[0-46] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3048/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'AcceptStatus-partially',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '9d2f2312-afae-4780-b31b-d7fc8c40f17f',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-47] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-41] { command: 'waitForDisplayed' }
[0-41] [41] ===== AFTER SCENARIO: Spotlight Navigation - Logs (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario result: passed
[0-41] [41] ===== BEFORE SCENARIO: Spotlight - switch theme (features/CP/header/spotlight_navigation.feature) =====
[0-41] [41] Scenario tags: none
[0-46] 👉 {
  uri: 'http://localhost:3048/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"Check-accepted","$options":"im"}}]}'
}
[0-46] 👉 {
  checks: [
    {
      _id: '690b340160f016a7ab36d63f',
      name: 'Check-accepted',
      test: '690b340160f016a7ab36d631',
      suite: '690b33fe60f016a7ab36d5b6',
      app: '690b33fec20bc55d1e827a7d',
      branch: 'integration',
      baselineId: '690b340160f016a7ab36d63b',
      actualSnapshotId: '690b340160f016a7ab36d63b',
      updatedDate: '2025-11-05T11:24:49.753Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b340160f016a7ab36d62e',
      creatorId: '690b33f960f016a7ab36d575',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:24:49.758Z',
      id: '690b340160f016a7ab36d63f',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-41] WARNING: cannot stop the Syngrisi server
[0-46] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-41] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest41' }\n"
}
[0-46] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-47] { command: 'waitForDisplayed' }
[0-47] [47] ===== AFTER SCENARIO: Tests Isolation by Browser (features/CP/items_isolations/tests_by_browser.feature) =====
[0-47] [47] Scenario result: passed
[0-47] [47] ========== AFTER FEATURE: undefined (features/CP/items_isolations/tests_by_browser.feature) ==========
[0-47] PASSED in chrome - /features/CP/items_isolations/tests_by_browser.feature
[0-41] { isAlive: true }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-41] SERVER IS STARTED, PID: '76177' port: '3043'
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-48] RUNNING in chrome - /features/CP/items_isolations/tests_by_run.feature
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] { command: 'waitForDisplayed' }
[0-46] [46] ===== AFTER SCENARIO: Tests Isolation by Accept Status (features/CP/items_isolations/tests_by_accept_status.feature) =====
[46] Scenario result: passed
[0-46] [46] ========== AFTER FEATURE: undefined (features/CP/items_isolations/tests_by_accept_status.feature) ==========
[0-48] [48] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/tests_by_run.feature) ==========
[0-48] [48] Feature has 3 scenario(s)
[0-46] PASSED in chrome - /features/CP/items_isolations/tests_by_accept_status.feature
[0-48] [48] ===== BEFORE SCENARIO: Tests Isolation by Run (features/CP/items_isolations/tests_by_run.feature) =====
[0-48] [48] Scenario tags: none
[0-48] WARNING: cannot stop the Syngrisi server
[0-41] { command: 'waitForDisplayed' }
[0-48] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest48' }\n"
}
[0-49] RUNNING in chrome - /features/CP/items_isolations/tests_by_suite.feature
[0-49] [49] ========== BEFORE FEATURE: undefined (features/CP/items_isolations/tests_by_suite.feature) ==========
[0-49] [49] Feature has 1 scenario(s)
[0-49] [49] ===== BEFORE SCENARIO: Tests Isolation by Suite (features/CP/items_isolations/tests_by_suite.feature) =====
[49] Scenario tags: none
[0-49] WARNING: cannot stop the Syngrisi server
[0-48] { isAlive: true }
[0-48] SERVER IS STARTED, PID: '76355' port: '3050'
[0-49] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest49' }\n"
}
[0-41] [41] ===== AFTER SCENARIO: Spotlight - switch theme (features/CP/header/spotlight_navigation.feature) =====
[41] Scenario result: passed
[0-41] [41] ========== AFTER FEATURE: undefined (features/CP/header/spotlight_navigation.feature) ==========
[0-41] PASSED in chrome - /features/CP/header/spotlight_navigation.feature
[0-49] { isAlive: true }
[0-49] SERVER IS STARTED, PID: '76426' port: '3051'
[0-48] Create test # 0
[0-48] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-48] Create test # 0
[0-48] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestRun-1.1',
      app: 'Test App',
      run: 'Run-1',
      branch: 'integration',
      runident: 'Run-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-49] Create test # 0
[0-49] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3051/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-51] RUNNING in chrome - /features/CP/navbar/group_by_navigation.feature
[0-48] Create test # 0
[0-48] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestRun-1.2',
      app: 'Test App',
      run: 'Run-1',
      branch: 'integration',
      runident: 'Run-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-51] [51] ========== BEFORE FEATURE: undefined (features/CP/navbar/group_by_navigation.feature) ==========
[0-51] [51] Feature has 7 scenario(s)
[0-51] [51] ===== BEFORE SCENARIO: Group by - Runs (features/CP/navbar/group_by_navigation.feature) =====
[0-51] [51] Scenario tags: @smoke
[0-51] WARNING: cannot stop the Syngrisi server
[0-49] Create test # 0
[0-49] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3051/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestSuite-1.1',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'a1162d66-cb57-4432-bccb-6e0e57e76706',
      suite: 'Suite-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-48] { command: 'waitForDisplayed' }
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-49] Create test # 0
[0-49] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3051/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestSuite-1.2',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '842d204a-365d-400a-9c4b-9bd4cc06216c',
      suite: 'Suite-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-48] { command: 'waitForDisplayed' }
[0-51] { isAlive: true }
[0-48] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-51] SERVER IS STARTED, PID: '76694' port: '3053'
[0-48] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-51] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by - Runs (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by - Suites (features/CP/navbar/group_by_navigation.feature) =====
[0-51] [51] Scenario tags: @smoke
[0-49] { command: 'waitForDisplayed' }
[0-51] WARNING: cannot stop the Syngrisi server
[0-48] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-48] { command: 'waitForDisplayed' }
[0-48] [48] ===== AFTER SCENARIO: Tests Isolation by Run (features/CP/items_isolations/tests_by_run.feature) =====
[0-48] [48] Scenario result: passed
[0-48] [48] ===== BEFORE SCENARIO: Checks Isolation by Run - same name different ident (features/CP/items_isolations/tests_by_run.feature) =====
[48] Scenario tags: none
[0-48] WARNING: cannot stop the Syngrisi server
[0-49] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-48] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest48' }\n"
}
[0-49] { command: 'waitForDisplayed' }
[0-49] { command: 'waitForDisplayed' }
[0-48] { isAlive: true }
[0-49] { command: 'waitForDisplayed' }
[0-48] SERVER IS STARTED, PID: '77037' port: '3050'
[0-51] { isAlive: true }
[0-49] { command: 'waitForDisplayed' }
[0-51] SERVER IS STARTED, PID: '76993' port: '3053'
[0-49] { command: 'waitForDisplayed' }
[0-49] [49] ===== AFTER SCENARIO: Tests Isolation by Suite (features/CP/items_isolations/tests_by_suite.feature) =====
[0-49] [49] Scenario result: passed
[0-49] [49] ========== AFTER FEATURE: undefined (features/CP/items_isolations/tests_by_suite.feature) ==========
[0-49] PASSED in chrome - /features/CP/items_isolations/tests_by_suite.feature
[0-48] Create test # 0
[0-48] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-48] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestRun-1',
      app: 'Test App',
      run: 'Run-1',
      branch: 'integration',
      runident: 'XXX',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] RUNNING in chrome - /features/CP/navbar/group_by.feature
[0-51] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by - Suites (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by - Browsers (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario tags: @smoke
[0-51] WARNING: cannot stop the Syngrisi server
[0-52] [52] ========== BEFORE FEATURE: undefined (features/CP/navbar/group_by.feature) ==========
[52] Feature has 3 scenario(s)
[0-52] [52] ===== BEFORE SCENARIO: Group by (features/CP/navbar/group_by.feature) =====
[52] Scenario tags: @smoke
[0-48] { command: 'waitForDisplayed' }
[0-52] WARNING: cannot stop the Syngrisi server
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-48] { command: 'waitForDisplayed' }
[0-51] { isAlive: true }
[0-52] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest52' }\n"
}
[0-51] SERVER IS STARTED, PID: '77305' port: '3053'
[0-52] { isAlive: true }
[0-48] { command: 'waitForDisplayed' }
[0-48] [48] ===== AFTER SCENARIO: Checks Isolation by Run - same name different ident (features/CP/items_isolations/tests_by_run.feature) =====
[0-48] [48] Scenario result: passed
[0-48] [48] ===== BEFORE SCENARIO: Checks Isolation by Run - same name same ident (features/CP/items_isolations/tests_by_run.feature) =====
[0-48] [48] Scenario tags: none
[0-52] SERVER IS STARTED, PID: '77331' port: '3054'
[0-48] WARNING: cannot stop the Syngrisi server
[0-48] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest48' }\n"
}
[0-51] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by - Browsers (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by - Platform (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario tags: @smoke
[0-51] WARNING: cannot stop the Syngrisi server
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-48] { isAlive: true }
[0-48] SERVER IS STARTED, PID: '77473' port: '3050'
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'msedge',
      browserVersion: '118',
      name: 'TestName - 1',
      app: 'Test App',
      run: 'RunName - 1',
      branch: 'integration',
      runident: '8b2f46ce-e60f-47c2-aa65-50305bd7bbce',
      suite: 'SuiteName - 1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-51] { isAlive: true }
[0-51] SERVER IS STARTED, PID: '77561' port: '3053'
[0-52] { command: 'waitForDisplayed' }
[0-48] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-52] { command: 'waitForDisplayed' }
[0-52] { command: 'waitForDisplayed' }
[0-48] Create test # 0
[0-48] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3050/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestRun-1',
      app: 'Test App',
      run: 'Run-1',
      branch: 'integration',
      runident: 'XXX',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] { command: 'waitForDisplayed' }
[0-52] { command: 'waitForDisplayed' }
[0-52] { command: 'waitForDisplayed' }
[0-52] [52] ===== AFTER SCENARIO: Group by (features/CP/navbar/group_by.feature) =====
[0-52] [52] Scenario result: passed
[0-52] [52] ===== BEFORE SCENARIO: Group by after item select (features/CP/navbar/group_by.feature) =====
[52] Scenario tags: @smoke
[0-48] { command: 'waitForDisplayed' }
[0-52] WARNING: cannot stop the Syngrisi server
[0-51] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by - Platform (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by - Test Status (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario tags: @smoke
[0-51] WARNING: cannot stop the Syngrisi server
[0-48] { command: 'waitForDisplayed' }
[0-52] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest52' }\n"
}
[0-48] { command: 'waitForDisplayed' }
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-48] [48] ===== AFTER SCENARIO: Checks Isolation by Run - same name same ident (features/CP/items_isolations/tests_by_run.feature) =====
[48] Scenario result: passed
[0-48] [48] ========== AFTER FEATURE: undefined (features/CP/items_isolations/tests_by_run.feature) ==========
[0-48] PASSED in chrome - /features/CP/items_isolations/tests_by_run.feature
[0-52] { isAlive: true }
[0-52] SERVER IS STARTED, PID: '77783' port: '3054'
[0-51] { isAlive: true }
[0-51] SERVER IS STARTED, PID: '77806' port: '3053'
[0-53] RUNNING in chrome - /features/CP/navbar/pagination.feature
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] [53] ========== BEFORE FEATURE: undefined (features/CP/navbar/pagination.feature) ==========
[0-53] [53] Feature has 2 scenario(s)
[0-53] [53] ===== BEFORE SCENARIO: Pagination (features/CP/navbar/pagination.feature) =====
[53] Scenario tags: @smoke
[0-53] WARNING: cannot stop the Syngrisi server
[0-51] { command: 'waitForDisplayed' }
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'msedge',
      browserVersion: '118',
      name: 'TestName - 1',
      app: 'Test App',
      run: 'RunName - 1',
      branch: 'integration',
      runident: 'e4ab4c68-cf8c-4974-a845-867cf2907e49',
      suite: 'SuiteName - 1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-51] [51] ===== AFTER SCENARIO: Group by - Test Status (features/CP/navbar/group_by_navigation.feature) =====
[0-51] [51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by - Accept Status (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario tags: @smoke
[0-53] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest53' }\n"
}
[0-51] WARNING: cannot stop the Syngrisi server
[0-52] { command: 'waitForDisplayed' }
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-52] { command: 'waitForDisplayed' }
[0-51] { isAlive: true }
[0-51] SERVER IS STARTED, PID: '78089' port: '3053'
[0-53] { isAlive: true }
[0-53] SERVER IS STARTED, PID: '78024' port: '3055'
[0-52] { command: 'waitForDisplayed' }
[0-52] { command: 'waitForDisplayed' }
[0-52] { command: 'waitForDisplayed' }
[0-51] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by - Accept Status (features/CP/navbar/group_by_navigation.feature) =====
[51] Scenario result: passed
[0-51] [51] ===== BEFORE SCENARIO: Group by via Url (features/CP/navbar/group_by_navigation.feature) =====
[0-51] [51] Scenario tags: none
[0-52] { command: 'waitForDisplayed' }
[0-51] WARNING: cannot stop the Syngrisi server
[0-52] [52] ===== AFTER SCENARIO: Group by after item select (features/CP/navbar/group_by.feature) =====
[0-52] [52] Scenario result: passed
[0-52] [52] ===== BEFORE SCENARIO: Group by via Url (features/CP/navbar/group_by.feature) =====
[0-52] [52] Scenario tags: none
[0-53] Create test # 0
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-52] WARNING: cannot stop the Syngrisi server
[0-51] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest51' }\n"
}
[0-52] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest52' }\n"
}
[0-53] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] { isAlive: true }
[0-53] Create test # 2
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] SERVER IS STARTED, PID: '78311' port: '3054'
[0-53] Create test # 3
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-2',
      app: 'Test App',
      run: 'RunName-2',
      branch: 'integration',
      runident: 'RunIdent-2',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-51] { isAlive: true }
[0-51] SERVER IS STARTED, PID: '78291' port: '3053'
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] Create test # 4
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-3',
      app: 'Test App',
      run: 'RunName-3',
      branch: 'integration',
      runident: 'RunIdent-3',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] Create test # 0
[0-52] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3054/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'msedge',
      browserVersion: '118',
      name: 'TestName - 1',
      app: 'Test App',
      run: 'RunName - 1',
      branch: 'integration',
      runident: 'ab7b517a-0774-49d9-b736-6eabea7d96f6',
      suite: 'SuiteName - 1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 5
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-4',
      app: 'Test App',
      run: 'RunName-4',
      branch: 'integration',
      runident: 'RunIdent-4',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 6
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-5',
      app: 'Test App',
      run: 'RunName-5',
      branch: 'integration',
      runident: 'RunIdent-5',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-52] { command: 'waitForDisplayed' }
[0-51] [51] ===== AFTER SCENARIO: Group by via Url (features/CP/navbar/group_by_navigation.feature) =====
[0-51] [51] Scenario result: passed
[0-51] [51] ========== AFTER FEATURE: undefined (features/CP/navbar/group_by_navigation.feature) ==========
[0-52] { command: 'waitForDisplayed' }
[0-51] PASSED in chrome - /features/CP/navbar/group_by_navigation.feature
[0-52] [52] ===== AFTER SCENARIO: Group by via Url (features/CP/navbar/group_by.feature) =====
[0-52] [52] Scenario result: passed
[0-52] [52] ========== AFTER FEATURE: undefined (features/CP/navbar/group_by.feature) ==========
[0-52] PASSED in chrome - /features/CP/navbar/group_by.feature
[0-53] Create test # 7
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-6',
      app: 'Test App',
      run: 'RunName-6',
      branch: 'integration',
      runident: 'RunIdent-6',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] RUNNING in chrome - /features/CP/navbar/quick_filtering.feature
[0-55] RUNNING in chrome - /features/CP/navbar/refresh.feature
[0-53] Create test # 8
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-7',
      app: 'Test App',
      run: 'RunName-7',
      branch: 'integration',
      runident: 'RunIdent-7',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] [54] ========== BEFORE FEATURE: undefined (features/CP/navbar/quick_filtering.feature) ==========
[0-54] [54] Feature has 2 scenario(s)
[0-55] [55] ========== BEFORE FEATURE: undefined (features/CP/navbar/refresh.feature) ==========
[0-55] [55] Feature has 1 scenario(s)
[0-55] [55] ===== BEFORE SCENARIO: Navbar Refresh (features/CP/navbar/refresh.feature) =====
[55] Scenario tags: @smoke
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario tags: @smoke
[0-55] WARNING: cannot stop the Syngrisi server
[0-54] WARNING: cannot stop the Syngrisi server
[0-53] Create test # 9
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-8',
      app: 'Test App',
      run: 'RunName-8',
      branch: 'integration',
      runident: 'RunIdent-8',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-55] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest55' }\n"
}
[0-53] Create test # 10
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-9',
      app: 'Test App',
      run: 'RunName-9',
      branch: 'integration',
      runident: 'RunIdent-9',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 11
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-10',
      app: 'Test App',
      run: 'RunName-10',
      branch: 'integration',
      runident: 'RunIdent-10',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 12
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-11',
      app: 'Test App',
      run: 'RunName-11',
      branch: 'integration',
      runident: 'RunIdent-11',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { isAlive: true }
[0-55] { isAlive: true }
[0-54] SERVER IS STARTED, PID: '78726' port: '3056'
[0-55] SERVER IS STARTED, PID: '78725' port: '3057'
[0-53] Create test # 13
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-12',
      app: 'Test App',
      run: 'RunName-12',
      branch: 'integration',
      runident: 'RunIdent-12',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 14
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-13',
      app: 'Test App',
      run: 'RunName-13',
      branch: 'integration',
      runident: 'RunIdent-13',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-55] Create test # 0
[0-55] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3057/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] Create test # 15
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-14',
      app: 'Test App',
      run: 'RunName-14',
      branch: 'integration',
      runident: 'RunIdent-14',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 0',
      app: 'Test App',
      run: 'RunName - 0',
      branch: 'integration',
      runident: '6cc4f973-0487-4d1f-883f-fc90aef4ab7d',
      suite: 'SuiteName - 0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 16
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-15',
      app: 'Test App',
      run: 'RunName-15',
      branch: 'integration',
      runident: 'RunIdent-15',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-55] { command: 'waitForDisplayed' }
[0-55] { command: 'waitForDisplayed' }
[0-55] Create test # 0
[0-55] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3057/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'a23169a2-3e84-434d-9377-3f6118a58b8e',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 17
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-16',
      app: 'Test App',
      run: 'RunName-16',
      branch: 'integration',
      runident: 'RunIdent-16',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 18
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-17',
      app: 'Test App',
      run: 'RunName-17',
      branch: 'integration',
      runident: 'RunIdent-17',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 19
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-18',
      app: 'Test App',
      run: 'RunName-18',
      branch: 'integration',
      runident: 'RunIdent-18',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 20
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-19',
      app: 'Test App',
      run: 'RunName-19',
      branch: 'integration',
      runident: 'RunIdent-19',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 21
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-20',
      app: 'Test App',
      run: 'RunName-20',
      branch: 'integration',
      runident: 'RunIdent-20',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-55] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 22
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-21',
      app: 'Test App',
      run: 'RunName-21',
      branch: 'integration',
      runident: 'RunIdent-21',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-55] { command: 'waitForDisplayed' }
[0-55] [55] ===== AFTER SCENARIO: Navbar Refresh (features/CP/navbar/refresh.feature) =====
[55] Scenario result: passed
[0-55] [55] ========== AFTER FEATURE: undefined (features/CP/navbar/refresh.feature) ==========
[0-55] PASSED in chrome - /features/CP/navbar/refresh.feature
[0-53] Create test # 23
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-22',
      app: 'Test App',
      run: 'RunName-22',
      branch: 'integration',
      runident: 'RunIdent-22',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 24
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-23',
      app: 'Test App',
      run: 'RunName-23',
      branch: 'integration',
      runident: 'RunIdent-23',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 25
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-24',
      app: 'Test App',
      run: 'RunName-24',
      branch: 'integration',
      runident: 'RunIdent-24',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] RUNNING in chrome - /features/CP/navbar/remove_item.feature
[0-53] Create test # 26
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-25',
      app: 'Test App',
      run: 'RunName-25',
      branch: 'integration',
      runident: 'RunIdent-25',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] [56] ========== BEFORE FEATURE: undefined (features/CP/navbar/remove_item.feature) ==========
[0-56] [56] Feature has 2 scenario(s)
[0-56] [56] ===== BEFORE SCENARIO: Remove Run (features/CP/navbar/remove_item.feature) =====
[56] Scenario tags: none
[0-53] Create test # 27
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-26',
      app: 'Test App',
      run: 'RunName-26',
      branch: 'integration',
      runident: 'RunIdent-26',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] WARNING: cannot stop the Syngrisi server
[0-53] Create test # 28
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-27',
      app: 'Test App',
      run: 'RunName-27',
      branch: 'integration',
      runident: 'RunIdent-27',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest56' }\n"
}
[0-53] Create test # 29
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-28',
      app: 'Test App',
      run: 'RunName-28',
      branch: 'integration',
      runident: 'RunIdent-28',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] { command: 'waitForDisplayed' }
[0-56] { isAlive: true }
[0-54] { command: 'waitForDisplayed' }
[0-56] SERVER IS STARTED, PID: '79641' port: '3058'
[0-56] Create test # 0
[0-56] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3058/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-56] Create test # 1
[0-56] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3058/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'c98b9bf7-9fe8-400e-a982-e1701b59c5ee',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-53] [53] ===== AFTER SCENARIO: Pagination (features/CP/navbar/pagination.feature) =====
[0-53] [53] Scenario result: passed
[0-53] [53] ===== BEFORE SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[53] Scenario tags: @smoke
[0-56] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-53] WARNING: cannot stop the Syngrisi server
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-53] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest53' }\n"
}
[0-56] [56] ===== AFTER SCENARIO: Remove Run (features/CP/navbar/remove_item.feature) =====
[0-56] [56] Scenario result: passed
[0-56] [56] ===== BEFORE SCENARIO: Remove Suite (features/CP/navbar/remove_item.feature) =====
[56] Scenario tags: none
[0-56] WARNING: cannot stop the Syngrisi server
[0-56] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest56' }\n"
}
[0-53] { isAlive: true }
[0-53] SERVER IS STARTED, PID: '80262' port: '3055'
[0-56] { isAlive: true }
[0-53] Create test # 0
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-56] SERVER IS STARTED, PID: '80361' port: '3058'
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 1
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3058/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] Create test # 2
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'SuiteName-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3058/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: '794e02e6-4f52-409d-a056-73865ecd5325',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 3
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-2',
      app: 'Test App',
      run: 'RunName-2',
      branch: 'integration',
      runident: 'RunIdent-2',
      suite: 'SuiteName-2',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 4
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-3',
      app: 'Test App',
      run: 'RunName-3',
      branch: 'integration',
      runident: 'RunIdent-3',
      suite: 'SuiteName-3',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForExist' }
[0-53] Create test # 5
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-4',
      app: 'Test App',
      run: 'RunName-4',
      branch: 'integration',
      runident: 'RunIdent-4',
      suite: 'SuiteName-4',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-53] Create test # 6
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-5',
      app: 'Test App',
      run: 'RunName-5',
      branch: 'integration',
      runident: 'RunIdent-5',
      suite: 'SuiteName-5',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-53] Create test # 7
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-6',
      app: 'Test App',
      run: 'RunName-6',
      branch: 'integration',
      runident: 'RunIdent-6',
      suite: 'SuiteName-6',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed:features/CP/navbar/quick_filtering.feature:37, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[54] Scenario tags: @smoke
[0-53] Create test # 8
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-7',
      app: 'Test App',
      run: 'RunName-7',
      branch: 'integration',
      runident: 'RunIdent-7',
      suite: 'SuiteName-7',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-53] Create test # 9
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-8',
      app: 'Test App',
      run: 'RunName-8',
      branch: 'integration',
      runident: 'RunIdent-8',
      suite: 'SuiteName-8',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] { command: 'waitForDisplayed' }
[0-56] [56] ===== AFTER SCENARIO: Remove Suite (features/CP/navbar/remove_item.feature) =====
[56] Scenario result: passed
[0-56] [56] ========== AFTER FEATURE: undefined (features/CP/navbar/remove_item.feature) ==========
[0-53] Create test # 10
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-9',
      app: 'Test App',
      run: 'RunName-9',
      branch: 'integration',
      runident: 'RunIdent-9',
      suite: 'SuiteName-9',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-56] PASSED in chrome - /features/CP/navbar/remove_item.feature
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-53] Create test # 11
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-10',
      app: 'Test App',
      run: 'RunName-10',
      branch: 'integration',
      runident: 'RunIdent-10',
      suite: 'SuiteName-10',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 12
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-11',
      app: 'Test App',
      run: 'RunName-11',
      branch: 'integration',
      runident: 'RunIdent-11',
      suite: 'SuiteName-11',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 13
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-12',
      app: 'Test App',
      run: 'RunName-12',
      branch: 'integration',
      runident: 'RunIdent-12',
      suite: 'SuiteName-12',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { isAlive: true }
[0-54] SERVER IS STARTED, PID: '81037' port: '3056'
[0-53] Create test # 14
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-13',
      app: 'Test App',
      run: 'RunName-13',
      branch: 'integration',
      runident: 'RunIdent-13',
      suite: 'SuiteName-13',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 15
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-14',
      app: 'Test App',
      run: 'RunName-14',
      branch: 'integration',
      runident: 'RunIdent-14',
      suite: 'SuiteName-14',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] Create test # 16
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-15',
      app: 'Test App',
      run: 'RunName-15',
      branch: 'integration',
      runident: 'RunIdent-15',
      suite: 'SuiteName-15',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] RUNNING in chrome - /features/CP/navbar/runs_ring_status.feature
[0-53] Create test # 17
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-16',
      app: 'Test App',
      run: 'RunName-16',
      branch: 'integration',
      runident: 'RunIdent-16',
      suite: 'SuiteName-16',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 1
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 0',
      app: 'Test App',
      run: 'RunName - 0',
      branch: 'integration',
      runident: '44ba60c9-ce85-4b37-93a6-a42e50a6a9d9',
      suite: 'SuiteName - 0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 18
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-17',
      app: 'Test App',
      run: 'RunName-17',
      branch: 'integration',
      runident: 'RunIdent-17',
      suite: 'SuiteName-17',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 19
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-18',
      app: 'Test App',
      run: 'RunName-18',
      branch: 'integration',
      runident: 'RunIdent-18',
      suite: 'SuiteName-18',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-57] [57] ========== BEFORE FEATURE: undefined (features/CP/navbar/runs_ring_status.feature) ==========
[0-57] [57] Feature has 1 scenario(s)
[0-57] [57] ===== BEFORE SCENARIO: Runs Ring Statuses [PASSED, FILED, NEW] (features/CP/navbar/runs_ring_status.feature) =====
[0-57] [57] Scenario tags: @smoke
[0-57] WARNING: cannot stop the Syngrisi server
[0-53] Create test # 20
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-19',
      app: 'Test App',
      run: 'RunName-19',
      branch: 'integration',
      runident: 'RunIdent-19',
      suite: 'SuiteName-19',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 21
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-20',
      app: 'Test App',
      run: 'RunName-20',
      branch: 'integration',
      runident: 'RunIdent-20',
      suite: 'SuiteName-20',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest57' }\n"
}
[0-53] Create test # 22
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-21',
      app: 'Test App',
      run: 'RunName-21',
      branch: 'integration',
      runident: 'RunIdent-21',
      suite: 'SuiteName-21',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 23
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-22',
      app: 'Test App',
      run: 'RunName-22',
      branch: 'integration',
      runident: 'RunIdent-22',
      suite: 'SuiteName-22',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-53] Create test # 24
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-23',
      app: 'Test App',
      run: 'RunName-23',
      branch: 'integration',
      runident: 'RunIdent-23',
      suite: 'SuiteName-23',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] { isAlive: true }
[0-57] SERVER IS STARTED, PID: '82850' port: '3059'
[0-53] Create test # 25
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-24',
      app: 'Test App',
      run: 'RunName-24',
      branch: 'integration',
      runident: 'RunIdent-24',
      suite: 'SuiteName-24',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 26
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-25',
      app: 'Test App',
      run: 'RunName-25',
      branch: 'integration',
      runident: 'RunIdent-25',
      suite: 'SuiteName-25',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] Create test # 0
[0-57] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3059/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-53] Create test # 27
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-26',
      app: 'Test App',
      run: 'RunName-26',
      branch: 'integration',
      runident: 'RunIdent-26',
      suite: 'SuiteName-26',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-57] 👉 {
  uri: 'http://localhost:3059/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName-1","$options":"im"}}]}'
}
[0-57] 👉 {
  checks: [
    {
      _id: '690b34a8d7ffabc9deda37a7',
      name: 'CheckName-1',
      test: '690b34a8d7ffabc9deda3791',
      suite: '690b34a8d7ffabc9deda378f',
      app: '690b34a8c20bc55d1e82baf2',
      branch: 'integration',
      baselineId: '690b34a8d7ffabc9deda37a3',
      actualSnapshotId: '690b34a8d7ffabc9deda37a3',
      updatedDate: '2025-11-05T11:27:36.409Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b34a8d7ffabc9deda378c',
      creatorId: '690b34a3d7ffabc9deda374e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:27:36.424Z',
      id: '690b34a8d7ffabc9deda37a7',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-57] Create test # 0
[0-57] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3059/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'Test-passed',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 28
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-27',
      app: 'Test App',
      run: 'RunName-27',
      branch: 'integration',
      runident: 'RunIdent-27',
      suite: 'SuiteName-27',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] Create test # 0
[0-57] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3059/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'Test-passed',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 29
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-28',
      app: 'Test App',
      run: 'RunName-28',
      branch: 'integration',
      runident: 'RunIdent-28',
      suite: 'SuiteName-28',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] 👉 {
  uri: 'http://localhost:3059/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName-1","$options":"im"}}]}'
}
[0-53] Create test # 0
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-29',
      app: 'Test App',
      run: 'RunName-29',
      branch: 'integration',
      runident: 'RunIdent-29',
      suite: 'SuiteName-29',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] 👉 {
  checks: [
    {
      _id: '690b34abd7ffabc9deda37fe',
      name: 'CheckName-1',
      test: '690b34abd7ffabc9deda37f0',
      suite: '690b34a8d7ffabc9deda378f',
      app: '690b34a8c20bc55d1e82baf2',
      branch: 'integration',
      baselineId: '690b34a8d7ffabc9deda37a3',
      actualSnapshotId: '690b34abd7ffabc9deda37fa',
      updatedDate: '2025-11-05T11:27:39.460Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 0,\n' +
        '\t"executionTotalTime": "0",\n' +
        '\t"getBuffer": null,\n' +
        '\t"totalCheckHandleTime": "0,1040375"\n' +
        '}',
      run: '690b34a8d7ffabc9deda378c',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:27:37.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b34a3d7ffabc9deda374e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:27:39.474Z',
      id: '690b34abd7ffabc9deda37fe',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b34a9d7ffabc9deda37dd',
      name: 'CheckName-1',
      test: '690b34a9d7ffabc9deda37cf',
      suite: '690b34a8d7ffabc9deda378f',
      app: '690b34a8c20bc55d1e82baf2',
      branch: 'integration',
      baselineId: '690b34a8d7ffabc9deda37a3',
      actualSnapshotId: '690b34a9d7ffabc9deda37d9',
      updatedDate: '2025-11-05T11:27:37.772Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{\n' +
        '\t"isSameDimensions": true,\n' +
        '\t"dimensionDifference": {\n' +
        '\t\t"width": 0,\n' +
        '\t\t"height": 0\n' +
        '\t},\n' +
        '\t"rawMisMatchPercentage": 0,\n' +
        '\t"misMatchPercentage": "0.00",\n' +
        '\t"analysisTime": 0,\n' +
        '\t"executionTotalTime": "0",\n' +
        '\t"getBuffer": null,\n' +
        '\t"totalCheckHandleTime": "0,1049750"\n' +
        '}',
      run: '690b34a8d7ffabc9deda378c',
      markedAs: 'accepted',
      markedDate: '2025-11-05T11:27:37.000Z',
      markedByUsername: 'Guest',
      creatorId: '690b34a3d7ffabc9deda374e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:27:37.796Z',
      id: '690b34a9d7ffabc9deda37dd',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: true
    },
    {
      _id: '690b34a8d7ffabc9deda37a7',
      name: 'CheckName-1',
      test: '690b34a8d7ffabc9deda3791',
      suite: '690b34a8d7ffabc9deda378f',
      app: '690b34a8c20bc55d1e82baf2',
      branch: 'integration',
      baselineId: '690b34a8d7ffabc9deda37a3',
      actualSnapshotId: '690b34a8d7ffabc9deda37a3',
      updatedDate: '2025-11-05T11:27:37.284Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b34a8d7ffabc9deda378c',
      creatorId: '690b34a3d7ffabc9deda374e',
      creatorUsername: 'Guest',
      failReasons: [],
      createdDate: '2025-11-05T11:27:36.424Z',
      markedAs: 'accepted',
      markedById: '690b34a3d7ffabc9deda374e',
      markedByUsername: 'Guest',
      markedDate: '2025-11-05T11:27:37.284Z',
      id: '690b34a8d7ffabc9deda37a7',
      isCurrentlyAccepted: true,
      wasAcceptedEarlier: false
    }
  ]
}
[0-57] Create test # 0
[0-57] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3059/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'Test-failed',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 1
[0-53] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] Create test # 0
[0-57] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3059/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'Test-failed',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] Create test # 2
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3055/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'SuiteName-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-57] { command: 'waitForDisplayed' }
[0-53] { command: 'waitForDisplayed' }
[0-57] js result 👉: 0, 60.3185789489240436.191147369354425, 24.1274315795696170, 60.3185789489240412.063715789784808, 48.25486315913923412.063715789784808, 48.254863159139234
[0-57] Expect: 0, 60.3185789489240436.191147369354425, 24.1274315795696170, 60.3185789489240412.063715789784808, 48.25486315913923412.063715789784808, 48.254863159139234
Stored: 0, 60.3185789489240436.191147369354425, 24.1274315795696170, 60.3185789489240412.063715789784808, 48.25486315913923412.063715789784808, 48.254863159139234
[0-57] [57] ===== AFTER SCENARIO: Runs Ring Statuses [PASSED, FILED, NEW] (features/CP/navbar/runs_ring_status.feature) =====
[0-57] [57] Scenario result: passed
[0-57] [57] ========== AFTER FEATURE: undefined (features/CP/navbar/runs_ring_status.feature) ==========
[0-57] PASSED in chrome - /features/CP/navbar/runs_ring_status.feature
[0-54] { command: 'waitForDisplayed' }
[0-58] RUNNING in chrome - /features/CP/navbar/select.feature
[0-58] [58] ========== BEFORE FEATURE: undefined (features/CP/navbar/select.feature) ==========
[58] Feature has 4 scenario(s)
[0-58] [58] ===== BEFORE SCENARIO: Select 1 and 2 items (hold the Meta key) (features/CP/navbar/select.feature) =====
[58] Scenario tags: @smoke
[0-58] WARNING: cannot stop the Syngrisi server
[1762342069.413][SEVERE]: Unable to receive message from renderer
[0-53] Browser disconnected or ChromeDriver unavailable, skipping select option
[0-53] { command: 'waitForDisplayed' }
[0-53] Browser disconnected, skipping waitFor
[0-53] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-53] 53# error in: /I expect that element "[data-test*='navbar_item_']" does appear exactly "20" times:features/CP/navbar/pagination.feature:62, 5
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at global.$$ (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/runner/build/index.js:115:43)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/then.js:41:10)
[0-53] [53] ===== AFTER SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[53] Scenario result: failed
[0-53] Error in "Pagination2: Pagination - Suite"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at global.$$ (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/runner/build/index.js:115:43)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/then.js:41:10)
[0-53] [53] ===== BEFORE SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[0-53] [53] Scenario tags: @smoke
[0-53] WARNING: cannot stop the Syngrisi server
[0-58] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest58' }\n"
}
[0-53] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest53' }\n"
}
[0-53] { isAlive: true }
[0-58] { isAlive: true }
[0-53] SERVER IS STARTED, PID: '83596' port: '3055'
[0-53] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-58] SERVER IS STARTED, PID: '83594' port: '3060'
[0-53] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-53] 53# error in: /I clear local storage:features/CP/navbar/pagination.feature:8, 5
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ===== AFTER SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[0-53] [53] Scenario result: failed
[0-53] Error in "Pagination2: Pagination - Suite"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ===== BEFORE SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[53] Scenario tags: @smoke
[0-53] WARNING: cannot stop the Syngrisi server
[0-53] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest53' }\n"
}
[0-58] Create test # 0
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] { command: 'waitForDisplayed' }
[0-58] Create test # 1
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] { isAlive: true }
[0-58] Create test # 2
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-53] SERVER IS STARTED, PID: '83776' port: '3055'
[0-53] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-53] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-53] 53# error in: /I clear local storage:features/CP/navbar/pagination.feature:8, 5
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ===== AFTER SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[53] Scenario result: failed
[0-53] Error in "Pagination2: Pagination - Suite"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ===== BEFORE SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[53] Scenario tags: @smoke
[0-53] WARNING: cannot stop the Syngrisi server
[0-58] { command: 'waitForDisplayed' }
[0-53] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest53' }\n"
}
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-53] { isAlive: true }
[0-53] SERVER IS STARTED, PID: '83982' port: '3055'
[0-53] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-53] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-53] 53# error in: /I clear local storage:features/CP/navbar/pagination.feature:8, 5
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ===== AFTER SCENARIO: Pagination - Suite (features/CP/navbar/pagination.feature) =====
[0-53] [53] Scenario result: failed
[0-53] Error in "Pagination2: Pagination - Suite"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-53] [53] ========== AFTER FEATURE: undefined (features/CP/navbar/pagination.feature) ==========
[1762342085.265][WARNING]: Unable to evaluate script: disconnected: unable to send message to renderer
[1762342085.265][WARNING]: Unable to evaluate script: disconnected: unable to send message to renderer
[0-53] FAILED in chrome - /features/CP/navbar/pagination.feature
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-59] RUNNING in chrome - /features/CP/navbar/sorting.feature
[0-58] { command: 'waitForDisplayed' }
[0-59] [59] ========== BEFORE FEATURE: undefined (features/CP/navbar/sorting.feature) ==========
[59] Feature has 1 scenario(s)
[0-58] { command: 'waitForDisplayed' }
[0-59] [59] ===== BEFORE SCENARIO: Sorting (features/CP/navbar/sorting.feature) =====
[59] Scenario tags: none
[0-58] { command: 'waitForDisplayed' }
[0-59] WARNING: cannot stop the Syngrisi server
[0-58] [58] ===== AFTER SCENARIO: Select 1 and 2 items (hold the Meta key) (features/CP/navbar/select.feature) =====
[0-58] [58] Scenario result: passed
[0-58] [58] ===== BEFORE SCENARIO: Select 1 item deselect via group by (features/CP/navbar/select.feature) =====
[0-58] [58] Scenario tags: @smoke
[0-58] WARNING: cannot stop the Syngrisi server
[0-59] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest59' }\n"
}
[0-58] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest58' }\n"
}
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed:features/CP/navbar/quick_filtering.feature:37, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[54] Scenario tags: @smoke
[0-54] WARNING: cannot stop the Syngrisi server
[0-59] { isAlive: true }
[0-59] SERVER IS STARTED, PID: '84546' port: '3061'
[0-58] { isAlive: true }
[0-58] SERVER IS STARTED, PID: '84632' port: '3060'
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-58] Create test # 0
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-59] Create test # 0
[0-59] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3061/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-58] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-59] Create test # 1
[0-59] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3061/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 0',
      app: 'Test App',
      run: 'RunName - 0',
      branch: 'integration',
      runident: 'b5f5c1c8-3db8-4398-80ee-bf209d27358a',
      suite: 'SuiteName - 0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { isAlive: true }
[0-54] SERVER IS STARTED, PID: '85599' port: '3056'
[0-59] Create test # 2
[0-59] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3061/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 1',
      app: 'Test App',
      run: 'RunName - 1',
      branch: 'integration',
      runident: '22657df2-8cbe-4cde-a9f8-3443a31ab50e',
      suite: 'SuiteName - 1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-58] { command: 'waitForDisplayed' }
[0-54] Create test # 1
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 0',
      app: 'Test App',
      run: 'RunName - 0',
      branch: 'integration',
      runident: 'bbef6ed4-b247-47c3-b783-4cdd9aa60aae',
      suite: 'SuiteName - 0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-58] { command: 'waitForDisplayed' }
[0-59] js result 👉: RunName - 2, RunName - 1, RunName - 0
[0-59] Expect: RunName - 2, RunName - 1, RunName - 0
[0-59] Stored: RunName - 2, RunName - 1, RunName - 0
[0-54] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-59] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] [58] ===== AFTER SCENARIO: Select 1 item deselect via group by (features/CP/navbar/select.feature) =====
[58] Scenario result: passed
[0-58] [58] ===== BEFORE SCENARIO: Select one item via Url (features/CP/navbar/select.feature) =====
[58] Scenario tags: none
[0-58] WARNING: cannot stop the Syngrisi server
[0-59] js result 👉: RunName - 0, RunName - 1, RunName - 2
[0-59] Expect: RunName - 0, RunName - 1, RunName - 2
Stored: RunName - 0, RunName - 1, RunName - 2
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-58] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest58' }\n"
}
[0-59] js result 👉: RunName - 2, RunName - 1, RunName - 0
[0-59] Expect: RunName - 2, RunName - 1, RunName - 0
Stored: RunName - 2, RunName - 1, RunName - 0
[0-59] [59] ===== AFTER SCENARIO: Sorting (features/CP/navbar/sorting.feature) =====
[59] Scenario result: passed
[0-59] [59] ========== AFTER FEATURE: undefined (features/CP/navbar/sorting.feature) ==========
[0-59] PASSED in chrome - /features/CP/navbar/sorting.feature
[0-58] { isAlive: true }
[0-58] SERVER IS STARTED, PID: '86486' port: '3060'
[0-54] { command: 'waitForDisplayed' }
[0-58] Create test # 0
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-60] RUNNING in chrome - /features/CP/table/auto_update.feature
[0-58] Create test # 1
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-60] [60] ========== BEFORE FEATURE: undefined (features/CP/table/auto_update.feature) ==========
[60] Feature has 1 scenario(s)
[0-60] [60] ===== BEFORE SCENARIO: Update Table with new Tests (features/CP/table/auto_update.feature) =====
[0-60] [60] Scenario tags: @smoke
[0-58] { command: 'waitForDisplayed' }
[0-60] WARNING: cannot stop the Syngrisi server
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-60] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest60' }\n"
}
[0-58] js result 👉: {
  url: 'http://localhost:3060/?base_filter=%7B%22run%22%3A%7B%22%24in%22%3A%5B%22690b34f4a34872b883803ebd%22%5D%7D%7D'
}
[0-58] ITEM js
[0-58] PROPERTY url
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] [58] ===== AFTER SCENARIO: Select one item via Url (features/CP/navbar/select.feature) =====
[58] Scenario result: passed
[0-58] [58] ===== BEFORE SCENARIO: Select two items via Url (features/CP/navbar/select.feature) =====
[58] Scenario tags: none
[0-58] WARNING: cannot stop the Syngrisi server
[0-58] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest58' }\n"
}
[0-60] { isAlive: true }
[0-58] { isAlive: true }
[0-60] SERVER IS STARTED, PID: '86848' port: '3062'
[0-58] SERVER IS STARTED, PID: '86933' port: '3060'
[0-54] { command: 'waitForDisplayed' }
[0-58] Create test # 0
[0-58] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-60] Create test # 0
[0-60] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3062/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-58] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3060/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'SuiteName-0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-60] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-58] js result 👉: {
  url: 'http://localhost:3060/?base_filter=%7B%22run%22%3A%7B%22%24in%22%3A%5B%22690b34ff019f6eeb27345be3%22%2C%22690b3500019f6eeb27345c10%22%5D%7D%7D'
}
[0-60] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3062/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-before',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'fc41e0cc-cebd-46a6-829a-807846c69289',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-58] ITEM js
[0-58] PROPERTY url
[0-58] { command: 'waitForDisplayed' }
[0-58] { command: 'waitForDisplayed' }
[0-60] Create test # 1
[0-60] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3062/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-after',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'ea37b7fe-3463-4780-a393-4fc1d88acfeb',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-58] [58] ===== AFTER SCENARIO: Select two items via Url (features/CP/navbar/select.feature) =====
[58] Scenario result: passed
[0-58] [58] ========== AFTER FEATURE: undefined (features/CP/navbar/select.feature) ==========
[0-58] PASSED in chrome - /features/CP/navbar/select.feature
[0-60] Create test # 2
[0-60] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3062/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-after',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '4522fec2-b944-4a1c-98a2-1ed945fe5e6d',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-61] RUNNING in chrome - /features/CP/table/bulk_test_apply.feature
[0-61] [61] ========== BEFORE FEATURE: undefined (features/CP/table/bulk_test_apply.feature) ==========
[61] Feature has 1 scenario(s)
[0-61] [61] ===== BEFORE SCENARIO: Apply 2 tests (features/CP/table/bulk_test_apply.feature) =====
[0-61] [61] Scenario tags: none
[0-61] WARNING: cannot stop the Syngrisi server
[0-61] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest61' }\n"
}
[0-60] { command: 'waitForDisplayed' }
[0-61] { isAlive: true }
[0-61] SERVER IS STARTED, PID: '87522' port: '3063'
[0-54] { command: 'waitForDisplayed' }
[0-61] Create test # 0
[0-61] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3063/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-61] Create test # 1
[0-61] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3063/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '92dc99bd-4979-4f73-b658-34674ae86b1b',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-61] { command: 'waitForDisplayed' }
[0-61] { command: 'waitForDisplayed' }
[0-61] { command: 'waitForDisplayed' }
[0-61] { command: 'waitForDisplayed' }
[0-60] { command: 'waitForDisplayed' }
[0-60] [60] ===== AFTER SCENARIO: Update Table with new Tests (features/CP/table/auto_update.feature) =====
[60] Scenario result: passed
[0-60] [60] ========== AFTER FEATURE: undefined (features/CP/table/auto_update.feature) ==========
[0-60] PASSED in chrome - /features/CP/table/auto_update.feature
[0-61] { command: 'waitForDisplayed' }
[0-62] RUNNING in chrome - /features/CP/table/bulk_test_delete.feature
[0-61] { command: 'waitForDisplayed' }
[0-61] { command: 'waitForDisplayed' }
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed:features/CP/navbar/quick_filtering.feature:37, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario tags: @smoke
[0-61] { command: 'waitForDisplayed' }
[0-62] [62] ========== BEFORE FEATURE: undefined (features/CP/table/bulk_test_delete.feature) ==========
[0-62] [62] Feature has 1 scenario(s)
[0-54] WARNING: cannot stop the Syngrisi server
[0-62] [62] ===== BEFORE SCENARIO: Delete 2 tests (features/CP/table/bulk_test_delete.feature) =====
[62] Scenario tags: none
[0-62] WARNING: cannot stop the Syngrisi server
[0-62] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest62' }\n"
}
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-61] { command: 'waitForDisplayed' }
[0-61] { command: 'waitForDisplayed' }
[0-61] [61] ===== AFTER SCENARIO: Apply 2 tests (features/CP/table/bulk_test_apply.feature) =====
[61] Scenario result: passed
[0-61] [61] ========== AFTER FEATURE: undefined (features/CP/table/bulk_test_apply.feature) ==========
[0-62] { isAlive: true }
[0-54] { isAlive: true }
[0-61] PASSED in chrome - /features/CP/table/bulk_test_apply.feature
[0-62] SERVER IS STARTED, PID: '88160' port: '3064'
[0-54] SERVER IS STARTED, PID: '88161' port: '3056'
[0-63] RUNNING in chrome - /features/CP/table/check_preview/accept_icon_color.feature
[0-62] Create test # 0
[0-62] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3064/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-63] [63] ========== BEFORE FEATURE: undefined (features/CP/table/check_preview/accept_icon_color.feature) ==========
[0-63] [63] Feature has 1 scenario(s)
[0-63] [63] ===== BEFORE SCENARIO: Accept Icons View (features/CP/table/check_preview/accept_icon_color.feature) =====
[0-63] [63] Scenario tags: @smoke
[0-63] WARNING: cannot stop the Syngrisi server
[0-54] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName - 0',
      app: 'Test App',
      run: 'RunName - 0',
      branch: 'integration',
      runident: 'fa4a13be-b52a-4ce6-a0a6-f724ac199d0d',
      suite: 'SuiteName - 0',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-62] Create test # 1
[0-62] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3064/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '4570ee7c-af9d-4efd-b1fb-87e2e88378d3',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-63] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest63' }\n"
}
[0-54] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-63] { isAlive: true }
[0-63] SERVER IS STARTED, PID: '88460' port: '3065'
[0-54] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-63] Create test # 0
[0-63] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3065/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-62] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-62] { command: 'waitForDisplayed' }
[0-62] [62] ===== AFTER SCENARIO: Delete 2 tests (features/CP/table/bulk_test_delete.feature) =====
[62] Scenario result: passed
[0-62] [62] ========== AFTER FEATURE: undefined (features/CP/table/bulk_test_delete.feature) ==========
[0-54] { command: 'waitForDisplayed' }
[0-62] PASSED in chrome - /features/CP/table/bulk_test_delete.feature
[0-63] Create test # 0
[0-63] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3065/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '9271273f-1fd8-484f-a23f-a0550b3cf162',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-64] RUNNING in chrome - /features/CP/table/check_preview/check_modes.feature
[0-54] { command: 'waitForDisplayed' }
[0-64] [64] ========== BEFORE FEATURE: undefined (features/CP/table/check_preview/check_modes.feature) ==========
[0-64] [64] Feature has 2 scenario(s)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario tags: none
[0-64] WARNING: cannot stop the Syngrisi server
[0-63] [63] ===== AFTER SCENARIO: Accept Icons View (features/CP/table/check_preview/accept_icon_color.feature) =====
[63] Scenario result: passed
[0-63] [63] ========== AFTER FEATURE: undefined (features/CP/table/check_preview/accept_icon_color.feature) ==========
[0-63] PASSED in chrome - /features/CP/table/check_preview/accept_icon_color.feature
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-65] RUNNING in chrome - /features/CP/table/check_preview/images_visibility.feature
[0-65] [65] ========== BEFORE FEATURE: undefined (features/CP/table/check_preview/images_visibility.feature) ==========
[0-65] [65] Feature has 1 scenario(s)
[0-65] [65] ===== BEFORE SCENARIO: Checks Preview images visibilities (features/CP/table/check_preview/images_visibility.feature) =====
[0-65] [65] Scenario tags: none
[0-65] WARNING: cannot stop the Syngrisi server
[0-65] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest65' }\n"
}
[0-64] { isAlive: true }
[0-64] SERVER IS STARTED, PID: '89081' port: '3066'
[0-65] { isAlive: true }
[0-65] SERVER IS STARTED, PID: '89195' port: '3067'
[0-64] Create test # 0
[0-64] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3066/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-65] Create test # 0
[0-65] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3067/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] { command: 'waitForDisplayed' }
[1762342206.987][SEVERE]: Unable to receive message from renderer
[0-64] [unfoldTest] Retry attempt 2/3 for test "TestName"
[0-64] [unfoldTest] Retry attempt 3/3 for test "TestName"
[0-65] js result 👉: {
  url: 'http://localhost:3067/snapshoots/690b353d0dddc99caab5f6f3.png'
}
[0-65] ITEM js
PROPERTY url
[0-65] { command: 'waitForDisplayed' }
[0-65] [65] ===== AFTER SCENARIO: Checks Preview images visibilities (features/CP/table/check_preview/images_visibility.feature) =====
[65] Scenario result: passed
[0-65] [65] ========== AFTER FEATURE: undefined (features/CP/table/check_preview/images_visibility.feature) ==========
[0-64] [unfoldTest] All 3 attempts failed for test "TestName"
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I unfold the test "TestName":features/CP/table/check_preview/check_modes.feature:17, 9
Error: Failed to unfold test "TestName" after 3 attempts. Last error: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
Error: Failed to unfold test "TestName" after 3 attempts. Last error: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:405:15)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
    at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Modes"
Error: Failed to unfold test "TestName" after 3 attempts. Last error: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:405:15)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
    at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario tags: none
[0-65] PASSED in chrome - /features/CP/table/check_preview/images_visibility.feature
[0-64] WARNING: cannot stop the Syngrisi server
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-66] RUNNING in chrome - /features/CP/table/check_preview/tooltip.feature
[0-64] { isAlive: true }
[0-64] SERVER IS STARTED, PID: '89511' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Modes"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario tags: none
[0-66] [66] ========== BEFORE FEATURE: undefined (features/CP/table/check_preview/tooltip.feature) ==========
[0-66] [66] Feature has 1 scenario(s)
[0-64] WARNING: cannot stop the Syngrisi server
[0-66] [66] ===== BEFORE SCENARIO: Status View - Tooltip (features/CP/table/check_preview/tooltip.feature) =====
[0-66] [66] Scenario tags: none
[0-66] WARNING: cannot stop the Syngrisi server
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-66] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest66' }\n"
}
[0-66] { isAlive: true }
[0-54] { command: 'waitForDisplayed' }
[0-66] SERVER IS STARTED, PID: '89670' port: '3068'
[0-66] {
  response: '{"username":"Test","firstName":"Test","lastName":"Admin","role":"admin","password":"5b8d4960316d1fb0c92498c90da6c397cdf247cae71f01467a88e2b42d7af6f5ac7ca75d3bea6e3e0078111a2e5dfc1611f9a9a8908a5a3af5bcd64c42989608977de192829bdf8ada113a60f8f0704443c659789761865e29a3103dbf0773f5bf31e4685d475ece56afaceb949b6e7467eaa287a02e4142d095bcbf84acaefe47ee080799a28188890d39d3397e285d8b46c9a0efe9517428825b64ee1ebcc96d92c084733db866c767341381b6254aaa1ef36d1bf3d24e3f5b8d8b6b4080589b130e9c90914a3da74e5b6adf5f569bfd77460abae8ae4f87c2a375397a37f09861b9e114cead0cc34fff2d631fd4294260dea17e4fe098940dbee2cb80c62eb3701d40f5b204de776b8252d55e5f567c599b1fbcdae79278d1f375a4c8244a26a3b721dbeec56c8f39b3eb810942d392aae371ea81ded6b820dd4b489566a33c495f5c291ff238d07202d2ff04c52426828e44af98ec056a42d13f4b166ec170083e2fff9efe2b8cfdde529f3bce56b8427cf2d188861808ad07fd13e073b2a804e818b2882c13f559d52420b49f301263a9de34fe22b6df4a82ae70e7e4c29c88479878d2c21fbb810532532e7ad9a28f610b63033520e703f178e7b44d3e101ec0d4339c085ccc8bb290b3cb996c75c2b8deaacba8098b9ec02c7e47542891da3bd887c31cd8e0bdfa56bb844b1703368afe8dc42d668ff2e3374b939b4f","apiKey":"","_id":"690b35464c8ad4db15a9f751","salt":"c6211751bdc372f491a86bcbd8e4196dc393d14e14e5f17019d5c317afd5bc27","id":"690b35464c8ad4db15a9f751"}'
}
[0-64] { isAlive: true }
[0-64] SERVER IS STARTED, PID: '89646' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Modes"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario tags: none
[0-66] { isAlive: true }
[0-64] WARNING: cannot stop the Syngrisi server
[0-66] SERVER IS STARTED, PID: '89744' port: '3068'
[0-66] { uri: 'http://localhost:3068' }
[0-66] { uri: 'http://localhost:3068/v1/auth/apikey' }
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-66] Create test # 0
[0-66] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3068/',
      apiKey: 'RX3ET12-XP6M8X3-P24CBPT-W772MG8',
      apiHash: 'fcdffc6790531fa3a62a6ed21d9c3ec6331653784fc772154d0163dcefe138d27f3f5258726e7577a589b73625f987601b8cb560e9620a445462509dc5e44098'
    }
  },
  params: { test: {} }
}
[0-66] 👉 {
  uri: 'http://localhost:3068/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"CheckName","$options":"im"}}]}'
}
[0-64] { isAlive: true }
[0-66] 👉 {
  checks: [
    {
      _id: '690b354b41e04befed853ee4',
      name: 'CheckName',
      test: '690b354b41e04befed853e94',
      suite: '690b354b41e04befed853e92',
      app: '690b354bc20bc55d1e82e31f',
      branch: 'integration',
      baselineId: '690b354b41e04befed853ee0',
      actualSnapshotId: '690b354b41e04befed853ee0',
      updatedDate: '2025-11-05T11:30:19.597Z',
      status: [Array],
      browserName: 'chrome [HEADLESS]',
      browserVersion: '118',
      browserFullVersion: '118.0.5993.70',
      viewport: '1366x768',
      os: 'macOS',
      result: '{}',
      run: '690b354b41e04befed853e8f',
      creatorId: '690b35464c8ad4db15a9f751',
      creatorUsername: 'Test',
      failReasons: [],
      createdDate: '2025-11-05T11:30:19.609Z',
      id: '690b354b41e04befed853ee4',
      isCurrentlyAccepted: false,
      wasAcceptedEarlier: false
    }
  ]
}
[0-64] SERVER IS STARTED, PID: '89835' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Modes (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Modes"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario tags: none
[0-64] WARNING: cannot stop the Syngrisi server
[0-66] { command: 'waitForDisplayed' }
[0-66] { command: 'waitForDisplayed' }
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-54] { command: 'waitForDisplayed' }
[0-66] [66] ===== AFTER SCENARIO: Status View - Tooltip (features/CP/table/check_preview/tooltip.feature) =====
[66] Scenario result: passed
[0-66] [66] ========== AFTER FEATURE: undefined (features/CP/table/check_preview/tooltip.feature) ==========
[0-66] PASSED in chrome - /features/CP/table/check_preview/tooltip.feature
[0-64] { isAlive: true }
[0-64] SERVER IS STARTED, PID: '90017' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Sizes on Bounded mode"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario tags: none
[0-64] WARNING: cannot stop the Syngrisi server
[0-67] RUNNING in chrome - /features/CP/table/distincts_filter.feature
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-67] [67] ========== BEFORE FEATURE: undefined (features/CP/table/distincts_filter.feature) ==========
[67] Feature has 1 scenario(s)
[0-67] [67] ===== BEFORE SCENARIO: Distinct (features/CP/table/distincts_filter.feature) =====
[0-67] [67] Scenario tags: none
[0-67] WARNING: cannot stop the Syngrisi server
[0-64] { isAlive: true }
[0-67] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest67' }\n"
}
[0-64] SERVER IS STARTED, PID: '90216' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Sizes on Bounded mode"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario tags: none
[0-64] WARNING: cannot stop the Syngrisi server
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-64] { isAlive: true }
[0-64] SERVER IS STARTED, PID: '90333' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Sizes on Bounded mode"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== BEFORE SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[0-64] [64] Scenario tags: none
[0-64] WARNING: cannot stop the Syngrisi server
[0-67] { isAlive: true }
[0-67] SERVER IS STARTED, PID: '90263' port: '3069'
[0-64] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest64' }\n"
}
[0-64] { isAlive: true }
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed:features/CP/navbar/quick_filtering.feature:37, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario tags: @smoke
[0-64] SERVER IS STARTED, PID: '90462' port: '3066'
[0-64] Browser disconnected or ChromeDriver unavailable, skipping open app step
[0-64] Browser disconnected or ChromeDriver unavailable, skipping screenshot
[0-64] 64# error in: /I clear local storage:features/CP/table/check_preview/check_modes.feature:7, 9
disconnected: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ===== AFTER SCENARIO: Checks Preview Sizes on Bounded mode (features/CP/table/check_preview/check_modes.feature) =====
[64] Scenario result: failed
[0-64] Error in "Checks Preview Modes1: Checks Preview Sizes on Bounded mode"
disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
    at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
    at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[0-64] [64] ========== AFTER FEATURE: undefined (features/CP/table/check_preview/check_modes.feature) ==========
[0-54] WARNING: cannot stop the Syngrisi server
[1762342235.563][WARNING]: Unable to evaluate script: disconnected: unable to send message to renderer
[1762342235.563][WARNING]: Unable to evaluate script: disconnected: unable to send message to renderer
[0-64] FAILED in chrome - /features/CP/table/check_preview/check_modes.feature
[0-67] Create test # 0
[0-67] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3069/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-67] Create test # 0
[0-67] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3069/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1440x900',
      browser: 'safari-0',
      browserVersion: '118',
      name: 'TestName filter-0',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'f5c84984-ccd7-4ccf-8e76-6215f36203b6',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { isAlive: true }
[0-68] RUNNING in chrome - /features/CP/table/filtering.feature
[0-54] SERVER IS STARTED, PID: '90598' port: '3056'
[0-67] Create test # 0
[0-67] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3069/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1440x900',
      browser: 'safari-1',
      browserVersion: '118',
      name: 'TestName filter-1',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'ec58029b-2b52-4185-8e9a-9072ac70ee38',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-68] [68] ========== BEFORE FEATURE: undefined (features/CP/table/filtering.feature) ==========
[0-68] [68] Feature has 5 scenario(s)
[0-68] [68] ===== BEFORE SCENARIO: Main Group, Single Rule (features/CP/table/filtering.feature) =====
[68] Scenario tags: @smoke
[0-68] WARNING: cannot stop the Syngrisi server
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest68' }\n"
}
[0-67] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] { isAlive: true }
[0-54] Create test # 1
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project-1',
      run: 'RunName_P1-0',
      branch: 'integration',
      runident: 'd3f3f11e-85b4-4559-8c4f-c5d26a4f108a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-68] SERVER IS STARTED, PID: '90746' port: '3070'
[0-67] { command: 'waitForDisplayed' }
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName_P1-1',
      branch: 'integration',
      runident: '7dcc7dcf-3f03-4c93-9138-fa2b510a7221',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-68] Create test # 1
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName filter-0',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '694acaf4-5a4b-4e5c-b4a6-ca9ee3736163',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] [68] ===== AFTER SCENARIO: Main Group, Single Rule (features/CP/table/filtering.feature) =====
[0-68] [68] Scenario result: passed
[0-68] [68] ===== BEFORE SCENARIO: Main Group, Single Rule with project Filter (features/CP/table/filtering.feature) =====
[68] Scenario tags: @smoke
[0-67] { command: 'waitForDisplayed' }
[0-68] WARNING: cannot stop the Syngrisi server
[0-54] { command: 'waitForDisplayed' }
[0-68] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest68' }\n"
}
[0-68] { isAlive: true }
[0-67] { command: 'waitForDisplayed' }
[0-67] { command: 'waitForDisplayed' }
[0-68] SERVER IS STARTED, PID: '91455' port: '3070'
[0-67] { command: 'waitForDisplayed' }
[0-67] [67] ===== AFTER SCENARIO: Distinct (features/CP/table/distincts_filter.feature) =====
[67] Scenario result: passed
[0-67] [67] ========== AFTER FEATURE: undefined (features/CP/table/distincts_filter.feature) ==========
[0-67] PASSED in chrome - /features/CP/table/distincts_filter.feature
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-69] RUNNING in chrome - /features/CP/table/folding.feature
[0-68] Create test # 1
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName filter-0',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '7bb62b6e-00ec-4e97-b3fb-6fb3585788bf',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] [69] ========== BEFORE FEATURE: undefined (features/CP/table/folding.feature) ==========
[0-69] [69] Feature has 5 scenario(s)
[0-69] [69] ===== BEFORE SCENARIO: Select, fold/unfold icon - appear (features/CP/table/folding.feature) =====
[0-69] [69] Scenario tags: @smoke
[0-69] WARNING: cannot stop the Syngrisi server
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName filter-1',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '179830e2-b154-4b95-9b0b-6d4b3f329a9c',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-69] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest69' }\n"
}
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { isAlive: true }
[0-69] SERVER IS STARTED, PID: '91837' port: '3071'
[0-68] { command: 'waitForDisplayed' }
[0-69] Create test # 0
[0-69] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] [68] ===== AFTER SCENARIO: Main Group, Single Rule with project Filter (features/CP/table/filtering.feature) =====
[68] Scenario result: passed
[0-68] [68] ===== BEFORE SCENARIO: Filter after select navbar item (features/CP/table/filtering.feature) =====
[68] Scenario tags: none
[0-68] WARNING: cannot stop the Syngrisi server
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest68' }\n"
}
[0-68] { isAlive: true }
[0-68] SERVER IS STARTED, PID: '92343' port: '3070'
[0-69] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-69] [69] ===== AFTER SCENARIO: Select, fold/unfold icon - appear (features/CP/table/folding.feature) =====
[69] Scenario result: passed
[0-69] [69] ===== BEFORE SCENARIO: Fold/Unfold item by click (features/CP/table/folding.feature) =====
[0-69] [69] Scenario tags: @smoke
[0-69] WARNING: cannot stop the Syngrisi server
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName filter-0',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest69' }\n"
}
[0-68] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName filter-1',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] { isAlive: true }
[0-69] SERVER IS STARTED, PID: '92618' port: '3071'
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] Create test # 0
[0-69] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be displayed:features/CP/navbar/quick_filtering.feature:91, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering with project"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[54] Scenario tags: @smoke
[0-54] WARNING: cannot stop the Syngrisi server
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] [69] ===== AFTER SCENARIO: Fold/Unfold item by click (features/CP/table/folding.feature) =====
[0-69] [69] Scenario result: passed
[0-69] [69] ===== BEFORE SCENARIO: Fold/Unfold single item by select (features/CP/table/folding.feature) =====
[0-69] [69] Scenario tags: @smoke
[0-69] WARNING: cannot stop the Syngrisi server
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-69] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest69' }\n"
}
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { isAlive: true }
[0-68] { command: 'waitForDisplayed' }
[0-68] [68] ===== AFTER SCENARIO: Filter after select navbar item (features/CP/table/filtering.feature) =====
[68] Scenario result: passed
[0-68] [68] ===== BEFORE SCENARIO: Main Group, Multiple Rules - And (features/CP/table/filtering.feature) =====
[68] Scenario tags: none
[0-69] SERVER IS STARTED, PID: '93070' port: '3071'
[0-68] WARNING: cannot stop the Syngrisi server
[0-54] { isAlive: true }
[0-68] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest68' }\n"
}
[0-54] SERVER IS STARTED, PID: '93029' port: '3056'
[0-68] { isAlive: true }
[0-69] Create test # 0
[0-69] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] SERVER IS STARTED, PID: '93168' port: '3070'
[0-54] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-69] Create test # 1
[0-69] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '8065fc1a-16a3-4b82-9705-c96140882764',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project-1',
      run: 'RunName_P1-0',
      branch: 'integration',
      runident: '9b9e0ab7-0f08-451b-827b-eee38908641c',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] { command: 'waitForDisplayed' }
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName_P1-1',
      branch: 'integration',
      runident: 'b7396da7-f453-4b4b-95a1-3cd20b33673e',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'firefox',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] [69] ===== AFTER SCENARIO: Fold/Unfold single item by select (features/CP/table/folding.feature) =====
[69] Scenario result: passed
[0-69] [69] ===== BEFORE SCENARIO: Fold/Unfold multiple items by select (features/CP/table/folding.feature) =====
[0-69] [69] Scenario tags: @smoke
[0-69] WARNING: cannot stop the Syngrisi server
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest69' }\n"
}
[0-54] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { isAlive: true }
[0-69] SERVER IS STARTED, PID: '93527' port: '3071'
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-69] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-69] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '798bfa8a-d201-425c-aeff-9f83319a6452',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] [68] ===== AFTER SCENARIO: Main Group, Multiple Rules - And (features/CP/table/filtering.feature) =====
[68] Scenario result: passed
[0-68] [68] ===== BEFORE SCENARIO: Main Group, Multiple Rules - Or (features/CP/table/filtering.feature) =====
[68] Scenario tags: none
[0-68] WARNING: cannot stop the Syngrisi server
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] [69] ===== AFTER SCENARIO: Fold/Unfold multiple items by select (features/CP/table/folding.feature) =====
[69] Scenario result: passed
[0-69] [69] ===== BEFORE SCENARIO: Fold/Unfold all items by select (features/CP/table/folding.feature) =====
[69] Scenario tags: @smoke
[0-69] WARNING: cannot stop the Syngrisi server
[0-68] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest68' }\n"
}
[0-69] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest69' }\n"
}
[0-54] { command: 'waitForDisplayed' }
[0-68] { isAlive: true }
[0-69] { isAlive: true }
[0-68] SERVER IS STARTED, PID: '94101' port: '3070'
[0-69] SERVER IS STARTED, PID: '94103' port: '3071'
[0-68] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-69] Create test # 0
[0-69] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome',
      browserVersion: '118',
      name: 'TestName-chrome',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-69] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3071/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'a9e8df79-0613-45e0-a31d-a65e9cbee4d6',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-68] Create test # 0
[0-68] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3070/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'firefox',
      browserVersion: '118',
      name: 'TestName-firefox',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] { command: 'waitForDisplayed' }
[0-69] [69] ===== AFTER SCENARIO: Fold/Unfold all items by select (features/CP/table/folding.feature) =====
[69] Scenario result: passed
[0-69] [69] ========== AFTER FEATURE: undefined (features/CP/table/folding.feature) ==========
[0-69] PASSED in chrome - /features/CP/table/folding.feature
[0-70] RUNNING in chrome - /features/CP/table/infinity_scroll.feature
[0-70] [70] ========== BEFORE FEATURE: undefined (features/CP/table/infinity_scroll.feature) ==========
[0-70] [70] Feature has 1 scenario(s)
[0-70] [70] ===== BEFORE SCENARIO: Infinity scroll (features/CP/table/infinity_scroll.feature) =====
[70] Scenario tags: @smoke
[0-70] WARNING: cannot stop the Syngrisi server
[0-54] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] { command: 'waitForDisplayed' }
[0-68] [68] ===== AFTER SCENARIO: Main Group, Multiple Rules - Or (features/CP/table/filtering.feature) =====
[68] Scenario result: passed
[0-68] [68] ========== AFTER FEATURE: undefined (features/CP/table/filtering.feature) ==========
[0-68] PASSED in chrome - /features/CP/table/filtering.feature
[0-70] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest70' }\n"
}
[0-71] RUNNING in chrome - /features/CP/table/navigation_via_link_params.feature
[0-70] { isAlive: true }
[0-71] [71] ========== BEFORE FEATURE: undefined (features/CP/table/navigation_via_link_params.feature) ==========
[71] Feature has 1 scenario(s)
[0-71] [71] ===== BEFORE SCENARIO: Navigation to link with predefined parameters (features/CP/table/navigation_via_link_params.feature) =====
[71] Scenario tags: @smoke
[0-71] WARNING: cannot stop the Syngrisi server
[0-70] SERVER IS STARTED, PID: '95082' port: '3072'
[0-71] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest71' }\n"
}
[0-70] Create test # 0
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be displayed:features/CP/navbar/quick_filtering.feature:91, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering with project"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario tags: @smoke
[0-54] WARNING: cannot stop the Syngrisi server
[0-70] Create test # 1
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'RunName-0',
      branch: 'integration',
      runident: 'RunIdent-0',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { isAlive: true }
[0-70] Create test # 2
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'RunName-1',
      branch: 'integration',
      runident: 'RunIdent-1',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] SERVER IS STARTED, PID: '95288' port: '3073'
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-70] Create test # 3
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-2',
      app: 'Test App',
      run: 'RunName-2',
      branch: 'integration',
      runident: 'RunIdent-2',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { isAlive: true }
[0-54] SERVER IS STARTED, PID: '95473' port: '3056'
[0-71] Create test # 0
[0-71] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3073/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-70] Create test # 4
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-3',
      app: 'Test App',
      run: 'RunName-3',
      branch: 'integration',
      runident: 'RunIdent-3',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3073/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName Project-1',
      app: 'Project-1',
      run: 'RunName-1',
      branch: 'integration',
      runident: '696b9041-34fd-459c-a42a-685b12e62cb8',
      suite: 'SuiteName-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 5
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-4',
      app: 'Test App',
      run: 'RunName-4',
      branch: 'integration',
      runident: 'RunIdent-4',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 0
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-71] Create test # 0
[0-71] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3073/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName Project-2-unfiltered',
      app: 'Project-2',
      run: 'RunName-2',
      branch: 'integration',
      runident: 'RunIdent-2',
      suite: 'SuiteNameProject-2-1',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 6
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-5',
      app: 'Test App',
      run: 'RunName-5',
      branch: 'integration',
      runident: 'RunIdent-5',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 1
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project-1',
      run: 'RunName_P1-0',
      branch: 'integration',
      runident: '5f00808c-f05a-40c7-95d0-bcad67288143',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] Create test # 1
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3073/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName Project-2-filter-0',
      app: 'Project-2',
      run: 'RunName-2',
      branch: 'integration',
      runident: 'RunIdent-2',
      suite: 'SuiteNameProject-2-2',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 7
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-6',
      app: 'Test App',
      run: 'RunName-6',
      branch: 'integration',
      runident: 'RunIdent-6',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName_P1-1',
      branch: 'integration',
      runident: '185efe99-5e9b-422d-9f74-f643b36b8868',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 8
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-7',
      app: 'Test App',
      run: 'RunName-7',
      branch: 'integration',
      runident: 'RunIdent-7',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 9
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-8',
      app: 'Test App',
      run: 'RunName-8',
      branch: 'integration',
      runident: 'RunIdent-8',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 10
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-9',
      app: 'Test App',
      run: 'RunName-9',
      branch: 'integration',
      runident: 'RunIdent-9',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 11
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-10',
      app: 'Test App',
      run: 'RunName-10',
      branch: 'integration',
      runident: 'RunIdent-10',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 12
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-11',
      app: 'Test App',
      run: 'RunName-11',
      branch: 'integration',
      runident: 'RunIdent-11',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 13
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-12',
      app: 'Test App',
      run: 'RunName-12',
      branch: 'integration',
      runident: 'RunIdent-12',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-70] Create test # 14
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-13',
      app: 'Test App',
      run: 'RunName-13',
      branch: 'integration',
      runident: 'RunIdent-13',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 15
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-14',
      app: 'Test App',
      run: 'RunName-14',
      branch: 'integration',
      runident: 'RunIdent-14',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 16
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-15',
      app: 'Test App',
      run: 'RunName-15',
      branch: 'integration',
      runident: 'RunIdent-15',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-70] Create test # 17
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-16',
      app: 'Test App',
      run: 'RunName-16',
      branch: 'integration',
      runident: 'RunIdent-16',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 18
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-17',
      app: 'Test App',
      run: 'RunName-17',
      branch: 'integration',
      runident: 'RunIdent-17',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-70] Create test # 19
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-18',
      app: 'Test App',
      run: 'RunName-18',
      branch: 'integration',
      runident: 'RunIdent-18',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 20
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-19',
      app: 'Test App',
      run: 'RunName-19',
      branch: 'integration',
      runident: 'RunIdent-19',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 21
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-20',
      app: 'Test App',
      run: 'RunName-20',
      branch: 'integration',
      runident: 'RunIdent-20',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 22
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-21',
      app: 'Test App',
      run: 'RunName-21',
      branch: 'integration',
      runident: 'RunIdent-21',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 23
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-22',
      app: 'Test App',
      run: 'RunName-22',
      branch: 'integration',
      runident: 'RunIdent-22',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 24
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-23',
      app: 'Test App',
      run: 'RunName-23',
      branch: 'integration',
      runident: 'RunIdent-23',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-70] Create test # 25
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-24',
      app: 'Test App',
      run: 'RunName-24',
      branch: 'integration',
      runident: 'RunIdent-24',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-70] Create test # 26
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-25',
      app: 'Test App',
      run: 'RunName-25',
      branch: 'integration',
      runident: 'RunIdent-25',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-70] Create test # 27
[0-70] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-26',
      app: 'Test App',
      run: 'RunName-26',
      branch: 'integration',
      runident: 'RunIdent-26',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 28
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-27',
      app: 'Test App',
      run: 'RunName-27',
      branch: 'integration',
      runident: 'RunIdent-27',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-70] Create test # 29
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3072/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-28',
      app: 'Test App',
      run: 'RunName-28',
      branch: 'integration',
      runident: 'RunIdent-28',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] { command: 'waitForDisplayed' }
[0-71] [71] ===== AFTER SCENARIO: Navigation to link with predefined parameters (features/CP/table/navigation_via_link_params.feature) =====
[71] Scenario result: passed
[0-71] [71] ========== AFTER FEATURE: undefined (features/CP/table/navigation_via_link_params.feature) ==========
[0-71] PASSED in chrome - /features/CP/table/navigation_via_link_params.feature
[0-70] { command: 'waitForDisplayed' }
[0-72] RUNNING in chrome - /features/CP/table/quick_filter.feature
[0-54] { command: 'waitForDisplayed' }
[0-72] [72] ========== BEFORE FEATURE: undefined (features/CP/table/quick_filter.feature) ==========
[0-72] [72] Feature has 2 scenario(s)
[0-72] [72] ===== BEFORE SCENARIO: Quick Filtering (features/CP/table/quick_filter.feature) =====
[72] Scenario tags: none
[0-72] WARNING: cannot stop the Syngrisi server
[0-72] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest72' }\n"
}
[0-70] [70] ===== AFTER SCENARIO: Infinity scroll (features/CP/table/infinity_scroll.feature) =====
[70] Scenario result: passed
[0-70] [70] ========== AFTER FEATURE: undefined (features/CP/table/infinity_scroll.feature) ==========
[0-70] PASSED in chrome - /features/CP/table/infinity_scroll.feature
[0-72] { isAlive: true }
[0-72] SERVER IS STARTED, PID: '98402' port: '3074'
[0-54] 54# error in: /I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be displayed:features/CP/navbar/quick_filtering.feature:91, 9
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== AFTER SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario result: failed
[0-54] Error in "Navbar Quick Filtering2: Quick Filtering with project"
Error: element ("//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]") still not displayed after 10000ms
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
[0-54] [54] ===== BEFORE SCENARIO: Quick Filtering with project (features/CP/navbar/quick_filtering.feature) =====
[0-54] [54] Scenario tags: @smoke
[0-73] RUNNING in chrome - /features/CP/table/settings.feature
[0-54] WARNING: cannot stop the Syngrisi server
[0-72] Create test # 0
[0-72] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3074/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-73] [73] ========== BEFORE FEATURE: undefined (features/CP/table/settings.feature) ==========
[0-73] [73] Feature has 2 scenario(s)
[0-73] [73] ===== BEFORE SCENARIO: Set visible Columns (features/CP/table/settings.feature) =====
[73] Scenario tags: none
[0-73] WARNING: cannot stop the Syngrisi server
[0-54] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest54' }\n"
}
[0-72] Create test # 1
[0-72] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3074/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '8cf72d3e-1969-45b0-9fb2-13f89ec329de',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-73] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest73' }\n"
}
[0-72] Create test # 0
[0-72] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3074/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '6ab0ce32-c3b0-48a5-b029-4dd0cf7f2072',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-73] { isAlive: true }
[0-73] SERVER IS STARTED, PID: '98758' port: '3075'
[0-72] { command: 'waitForDisplayed' }
[0-54] { isAlive: true }
[0-54] SERVER IS STARTED, PID: '98717' port: '3056'
[0-73] Create test # 0
[0-73] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3075/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-54] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-73] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-54] Create test # 1
[0-54] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Project-1',
      run: 'RunName_P1-0',
      branch: 'integration',
      runident: 'ed41888a-3733-4614-9b48-795eaa7e9d79',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-72] { command: 'waitForDisplayed' }
[0-54] Create test # 0
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3056/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Project-1',
      run: 'RunName_P1-1',
      branch: 'integration',
      runident: '40e6c531-55fe-4874-bb1f-0c5aea75488a',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-72] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForExist' }
[0-54] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForDisplayed' }
[0-73] [73] ===== AFTER SCENARIO: Set visible Columns (features/CP/table/settings.feature) =====
[73] Scenario result: passed
[0-73] [73] ===== BEFORE SCENARIO: Sorting (features/CP/table/settings.feature) =====
[73] Scenario tags: none
[0-54] { command: 'waitForDisplayed' }
[0-73] WARNING: cannot stop the Syngrisi server
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-73] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest73' }\n"
}
[0-54] { command: 'waitForDisplayed' }
[0-73] { isAlive: true }
[0-73] SERVER IS STARTED, PID: '99673' port: '3075'
[0-54] { command: 'waitForDisplayed' }
[0-54] { command: 'waitForDisplayed' }
[0-73] Create test # 0
[0-73] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3075/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: { test: {} }
}
[0-72] { command: 'waitForDisplayed' }
[0-73] Create test # 1
[0-73] [createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3075/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-0',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: 'ab71b25c-24a1-48d4-bbe1-84e29297cf55',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-73] Create test # 2
[createTest helper] vDriver before startTestSession: WDIODriver {
  api: SyngrisiApi {
    config: {
      url: 'http://localhost:3075/',
      apiKey: '123',
      apiHash: '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'
    }
  },
  params: {
    test: {
      os: 'macOS',
      viewport: '1366x768',
      browser: 'chrome [HEADLESS]',
      browserVersion: '118',
      name: 'TestName-1',
      app: 'Test App',
      run: 'integration_run_name',
      branch: 'integration',
      runident: '112bf970-62c5-4aa5-a4bc-acd2ce59a441',
      suite: 'Integration suite',
      tags: undefined,
      browserFullVersion: '118.0.5993.70',
      testId: undefined
    }
  }
}
[0-54] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForDisplayed' }
[0-72] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForDisplayed' }
[0-73] { command: 'waitForDisplayed' }
[0-73] js result 👉: TestName-2, TestName-1, TestName-0
[0-73] Expect: TestName-2, TestName-1, TestName-0
Stored: TestName-2, TestName-1, TestName-0
[0-54] { command: 'waitForDisplayed' }
[0-54] FAILED in chrome - /features/CP/navbar/quick_filtering.feature
[0-72] FAILED in chrome - /features/CP/table/quick_filter.feature
[0-73] FAILED in chrome - /features/CP/table/settings.feature
[0-75] RUNNING in chrome - /features/debug/quick_filter_debug.feature
[0-74] RUNNING in chrome - /features/CP/table/test_status.feature
[0-76] RUNNING in chrome - /features/debug/test_accept_debug.feature
[0-75] FAILED in chrome - /features/debug/quick_filter_debug.feature
[0-76] FAILED in chrome - /features/debug/test_accept_debug.feature
[0-74] FAILED in chrome - /features/CP/table/test_status.feature
[0-79] RUNNING in chrome - /features/INTEGRATION/client_api_basics_auth.feature
[0-78] RUNNING in chrome - /features/debug/test_step1.feature
[0-77] RUNNING in chrome - /features/debug/test_auth_start.feature
[0-79] FAILED in chrome - /features/INTEGRATION/client_api_basics_auth.feature
[0-78] FAILED in chrome - /features/debug/test_step1.feature
[0-77] FAILED in chrome - /features/debug/test_auth_start.feature
[0-80] RUNNING in chrome - /features/INTEGRATION/client_api_basics.feature
[0-81] RUNNING in chrome - /features/INTEGRATION/client_api_negative_auth.feature
[0-82] RUNNING in chrome - /features/INTEGRATION/client_api_negative.feature
[0-80] FAILED in chrome - /features/INTEGRATION/client_api_basics.feature
[0-81] FAILED in chrome - /features/INTEGRATION/client_api_negative_auth.feature
[0-82] FAILED in chrome - /features/INTEGRATION/client_api_negative.feature
[0-83] RUNNING in chrome - /features/MIXED/users/roles.feature
[0-83] FAILED in chrome - /features/MIXED/users/roles.feature

 "spec" Reporter:
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-0] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/access.feature
[chrome 118.0.5993.70 mac #0-0] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-0] Session ID: 934757a30805fac875884ee5f492ec25
[chrome 118.0.5993.70 mac #0-0]
[chrome 118.0.5993.70 mac #0-0] Access to admin Panel
[chrome 118.0.5993.70 mac #0-0]    ✓ Open Admin Panel as Anonymous User
[chrome 118.0.5993.70 mac #0-0]    ✓ Open Admin Panel behalf of User role
[chrome 118.0.5993.70 mac #0-0]    ✓ Open Admin Panel behalf of Reviewer role
[chrome 118.0.5993.70 mac #0-0]
[chrome 118.0.5993.70 mac #0-0] 3 passing (21.6s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-4] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/settings/settings.feature
[chrome 118.0.5993.70 mac #0-4] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-4] Session ID: 6f6beb4c1602740615032cd7abbf9be0
[chrome 118.0.5993.70 mac #0-4]
[chrome 118.0.5993.70 mac #0-4] Admin Settings
[chrome 118.0.5993.70 mac #0-4]    ✓ Change Admin Settings - Enable Auth
[chrome 118.0.5993.70 mac #0-4]    ✓ Change Admin Settings - First Run
[chrome 118.0.5993.70 mac #0-4]
[chrome 118.0.5993.70 mac #0-4] 2 passing (34s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-1] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/logs/logs_basics.feature
[chrome 118.0.5993.70 mac #0-1] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-1] Session ID: d031de6669c4e25d3852997ebf81fad7
[chrome 118.0.5993.70 mac #0-1]
[chrome 118.0.5993.70 mac #0-1] Log Basics
[chrome 118.0.5993.70 mac #0-1]    ✓ Check Infinity scroll
[chrome 118.0.5993.70 mac #0-1]    ✖ Update Table with new Logs
[chrome 118.0.5993.70 mac #0-1]    ✓ Update Table with new Logs
[chrome 118.0.5993.70 mac #0-1]    ✓ Select, fold/unfold icon - appear
[chrome 118.0.5993.70 mac #0-1]    ✓ Select, fold/unfold items
[chrome 118.0.5993.70 mac #0-1]
[chrome 118.0.5993.70 mac #0-1] 4 passing (1m 15.2s)
[chrome 118.0.5993.70 mac #0-1] 1 failing
[chrome 118.0.5993.70 mac #0-1]
[chrome 118.0.5993.70 mac #0-1] 1) Log Basics Update Table with new Logs
[chrome 118.0.5993.70 mac #0-1] Expect $(`[data-test='table-refresh-icon-badge']`) to have text containing

Expected: "5"
Received: "6"
[chrome 118.0.5993.70 mac #0-1] Error: Expect $(`[data-test='table-refresh-icon-badge']`) to have text containing
[chrome 118.0.5993.70 mac #0-1]
[chrome 118.0.5993.70 mac #0-1] Expected: "5"
[chrome 118.0.5993.70 mac #0-1] Received: "6"
[chrome 118.0.5993.70 mac #0-1]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/integration_vrs_sd.js:216:25)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-5] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/tasks/remove_inconsistent_items.feature
[chrome 118.0.5993.70 mac #0-5] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-5] Session ID: 40201acf8ea6299b5e4590d135a6bf2c
[chrome 118.0.5993.70 mac #0-5]
[chrome 118.0.5993.70 mac #0-5] Remove Inconsistent items
[chrome 118.0.5993.70 mac #0-5]    ✓ Abandoned File
[chrome 118.0.5993.70 mac #0-5]    ✓ Abandoned Snapshot, Check, Test, Suite, Run
[chrome 118.0.5993.70 mac #0-5]
[chrome 118.0.5993.70 mac #0-5] 2 passing (14s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-7] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/users/api_key_generation.feature
[chrome 118.0.5993.70 mac #0-7] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-7] Session ID: 7221112b84d5340dfdb3425b599b09ef
[chrome 118.0.5993.70 mac #0-7]
[chrome 118.0.5993.70 mac #0-7] API key generation
[chrome 118.0.5993.70 mac #0-7]    ✓ Smoke API key generation
[chrome 118.0.5993.70 mac #0-7]
[chrome 118.0.5993.70 mac #0-7] 1 passing (24.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-2] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/logs/logs_filtering.feature
[chrome 118.0.5993.70 mac #0-2] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-2] Session ID: 4420be66bfd3abc85d5ebf0796c54abd
[chrome 118.0.5993.70 mac #0-2]
[chrome 118.0.5993.70 mac #0-2] Logs Table Filter
[chrome 118.0.5993.70 mac #0-2]    ✓ Main Group, Single Rule
[chrome 118.0.5993.70 mac #0-2]    ✓ Main Group, Multiple Rules - And
[chrome 118.0.5993.70 mac #0-2]    ✖ Main Group, Multiple Rules - Or
[chrome 118.0.5993.70 mac #0-2]    ✓ Main Group, Multiple Rules - Or
[chrome 118.0.5993.70 mac #0-2]    ✓ Two Groups
[chrome 118.0.5993.70 mac #0-2]
[chrome 118.0.5993.70 mac #0-2] 4 passing (1m 50.9s)
[chrome 118.0.5993.70 mac #0-2] 1 failing
[chrome 118.0.5993.70 mac #0-2]
[chrome 118.0.5993.70 mac #0-2] 1) Logs Table Filter Main Group, Multiple Rules - Or
[chrome 118.0.5993.70 mac #0-2] element ("[data-test*='table_row_']") still not displayed after 10000ms
[chrome 118.0.5993.70 mac #0-2] Error: element ("[data-test*='table_row_']") still not displayed after 10000ms
[chrome 118.0.5993.70 mac #0-2]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-2]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-2]     at CustomWorld._default (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/action/waitFor.js:52:25)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-6] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/tasks/remove_old_checks.feature
[chrome 118.0.5993.70 mac #0-6] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-6] Session ID: 578fea7575ea667d078eb8131bfe19d8
[chrome 118.0.5993.70 mac #0-6]
[chrome 118.0.5993.70 mac #0-6] Task - Remove old checks
[chrome 118.0.5993.70 mac #0-6]    ✓ Remove old checks [unaccepted]
[chrome 118.0.5993.70 mac #0-6]    ✓ Remove old check [unaccepted, unaccepted_fail]
[chrome 118.0.5993.70 mac #0-6]    ✓ Remove old checks [unaccepted_old_A, accepted_new_B]
[chrome 118.0.5993.70 mac #0-6]    ✓ Remove old checks [accepted_old_A, accepted_new_B]
[chrome 118.0.5993.70 mac #0-6]
[chrome 118.0.5993.70 mac #0-6] 4 passing (36.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-9] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/users/default_users.feature
[chrome 118.0.5993.70 mac #0-9] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-9] Session ID: 5f114d46c0575da17c71ec56f7248a89
[chrome 118.0.5993.70 mac #0-9]
[chrome 118.0.5993.70 mac #0-9] Default Users
[chrome 118.0.5993.70 mac #0-9]    ✓ Default Administrator and Guest should be created after first server start
[chrome 118.0.5993.70 mac #0-9]
[chrome 118.0.5993.70 mac #0-9] 1 passing (13.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-10] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/users/delete.feature
[chrome 118.0.5993.70 mac #0-10] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-10] Session ID: ca37dbb1edee175760508f3cce0afead
[chrome 118.0.5993.70 mac #0-10]
[chrome 118.0.5993.70 mac #0-10] Delete User
[chrome 118.0.5993.70 mac #0-10]    ✓ Delete User - Success
[chrome 118.0.5993.70 mac #0-10]
[chrome 118.0.5993.70 mac #0-10] 1 passing (16s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-11] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/users/update.feature
[chrome 118.0.5993.70 mac #0-11] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-11] Session ID: 9ee4ae97385b9d9cf29ed1bbd85f66c0
[chrome 118.0.5993.70 mac #0-11]
[chrome 118.0.5993.70 mac #0-11] Update User
[chrome 118.0.5993.70 mac #0-11]    ✓ Update User - Success
[chrome 118.0.5993.70 mac #0-11]
[chrome 118.0.5993.70 mac #0-11] 1 passing (18.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-12] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/auth_off.feature
[chrome 118.0.5993.70 mac #0-12] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-12] Session ID: 44d37839e771fac29a92266af0e086ad
[chrome 118.0.5993.70 mac #0-12]
[chrome 118.0.5993.70 mac #0-12] Authentication - off
[chrome 118.0.5993.70 mac #0-12]    ✓ Login as Guest
[chrome 118.0.5993.70 mac #0-12]    ✓ Login as Guest with redirect
[chrome 118.0.5993.70 mac #0-12]
[chrome 118.0.5993.70 mac #0-12] 2 passing (17.6s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-14] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/first_run.feature
[chrome 118.0.5993.70 mac #0-14] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-14] Session ID: 4d71b80e88e0ba381338d62ce2531dda
[chrome 118.0.5993.70 mac #0-14]
[chrome 118.0.5993.70 mac #0-14] First run
[chrome 118.0.5993.70 mac #0-14]    ✓ Change Administrator password and login to system
[chrome 118.0.5993.70 mac #0-14]
[chrome 118.0.5993.70 mac #0-14] 1 passing (16.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-15] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/login_smoke.feature
[chrome 118.0.5993.70 mac #0-15] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-15] Session ID: f67a295d319b635873d3ddaa3a387666
[chrome 118.0.5993.70 mac #0-15]
[chrome 118.0.5993.70 mac #0-15] Login - Smoke
[chrome 118.0.5993.70 mac #0-15]    ✓ Login - default Test user
[chrome 118.0.5993.70 mac #0-15]
[chrome 118.0.5993.70 mac #0-15] 1 passing (13.6s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-8] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AP/users/create.feature
[chrome 118.0.5993.70 mac #0-8] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-8] Session ID: bd8e8853368dbcbfe801a58c80550fad
[chrome 118.0.5993.70 mac #0-8]
[chrome 118.0.5993.70 mac #0-8] Create User
[chrome 118.0.5993.70 mac #0-8]    ✓ Create User - Success
[chrome 118.0.5993.70 mac #0-8]    ✓ Create User - User Already Exist
[chrome 118.0.5993.70 mac #0-8]    ✓ Create User - Invalid fields
[chrome 118.0.5993.70 mac #0-8]
[chrome 118.0.5993.70 mac #0-8] 3 passing (1m 24s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-17] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/logout.feature
[chrome 118.0.5993.70 mac #0-17] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-17] Session ID: 637d753e20b7f705f9abbb813068bbb7
[chrome 118.0.5993.70 mac #0-17]
[chrome 118.0.5993.70 mac #0-17] Logout
[chrome 118.0.5993.70 mac #0-17]    ✓ Logout - default Test user
[chrome 118.0.5993.70 mac #0-17]
[chrome 118.0.5993.70 mac #0-17] 1 passing (15.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-18] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/accept_by_user.feature
[chrome 118.0.5993.70 mac #0-18] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-18] Session ID: 1e40f86ba101eeb1b0fe1944a7125dc2
[chrome 118.0.5993.70 mac #0-18]
[chrome 118.0.5993.70 mac #0-18] Accept by user
[chrome 118.0.5993.70 mac #0-18]    ✓ Accept by user
[chrome 118.0.5993.70 mac #0-18]
[chrome 118.0.5993.70 mac #0-18] 1 passing (11.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-19] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/check_without_session_starting.feature
[chrome 118.0.5993.70 mac #0-19] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-19] Session ID: d1513d173cfb420e2a1f826a2df73fcd
[chrome 118.0.5993.70 mac #0-19]
[chrome 118.0.5993.70 mac #0-19] One Check without session starting
[chrome 118.0.5993.70 mac #0-19]    ✓ Create new check - without session ending
[chrome 118.0.5993.70 mac #0-19]
[chrome 118.0.5993.70 mac #0-19] 1 passing (7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-20] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature
[chrome 118.0.5993.70 mac #0-20] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-20] Session ID: 81bc989962c2e623b00bc5a5516dd180
[chrome 118.0.5993.70 mac #0-20]
[chrome 118.0.5993.70 mac #0-20] Checks with different resolutions 1px
[chrome 118.0.5993.70 mac #0-20] The 1px difference resolution should be ignored
[chrome 118.0.5993.70 mac #0-20] But this is applicable only if image was cropped by 1px from the bottom
[chrome 118.0.5993.70 mac #0-20]
[chrome 118.0.5993.70 mac #0-20]    ✓ Two checks with identical image parts but different resolutions [1px, bottom]
[chrome 118.0.5993.70 mac #0-20]
[chrome 118.0.5993.70 mac #0-20] 1 passing (12.2s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-16] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/login.feature
[chrome 118.0.5993.70 mac #0-16] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-16] Session ID: 3e8afcf6ba446a1bb4d58be04b894063
[chrome 118.0.5993.70 mac #0-16]
[chrome 118.0.5993.70 mac #0-16] Login
[chrome 118.0.5993.70 mac #0-16]    ✓ Login - Create user and login
[chrome 118.0.5993.70 mac #0-16]    ✓ Login - Wrong password
[chrome 118.0.5993.70 mac #0-16]    ✓ Login - Empty credentials
[chrome 118.0.5993.70 mac #0-16]    ✓ Login - Invalid email
[chrome 118.0.5993.70 mac #0-16]    ✓ Redirect via origin url
[chrome 118.0.5993.70 mac #0-16]
[chrome 118.0.5993.70 mac #0-16] 5 passing (1m 1.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-13] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/AUTH/change_passwords.feature
[chrome 118.0.5993.70 mac #0-13] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-13] Session ID: cee1d7fefe3feb72032cfab2c8485e48
[chrome 118.0.5993.70 mac #0-13]
[chrome 118.0.5993.70 mac #0-13] Change Password
[chrome 118.0.5993.70 mac #0-13]    ✓ Change Password - Smoke
[chrome 118.0.5993.70 mac #0-13]    ✓ Change Password - User not Logged In
[chrome 118.0.5993.70 mac #0-13]    ✓ Change Password - Wrong Current Password
[chrome 118.0.5993.70 mac #0-13]    ✓ Change Password - Validation
[chrome 118.0.5993.70 mac #0-13]
[chrome 118.0.5993.70 mac #0-13] 4 passing (1m 47.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-22] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/low_diff.feature
[chrome 118.0.5993.70 mac #0-22] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-22] Session ID: 15688ac69f47dffe96372ee43228079b
[chrome 118.0.5993.70 mac #0-22]
[chrome 118.0.5993.70 mac #0-22] Low images difference
[chrome 118.0.5993.70 mac #0-22] This feature checks if images with a low difference (rawMisMatchPercentage, e.q.: 0.001) are properly compared
[chrome 118.0.5993.70 mac #0-22]
[chrome 118.0.5993.70 mac #0-22]    ✓ Low images difference
[chrome 118.0.5993.70 mac #0-22]
[chrome 118.0.5993.70 mac #0-22] 1 passing (8.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-23] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/partially_accepted.feature
[chrome 118.0.5993.70 mac #0-23] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-23] Session ID: 37888258bcb6a8ec3cbdb716d3a0a4c5
[chrome 118.0.5993.70 mac #0-23]
[chrome 118.0.5993.70 mac #0-23] Partially Accepted Test
[chrome 118.0.5993.70 mac #0-23]    ✓ Partially Accepted Test
[chrome 118.0.5993.70 mac #0-23]
[chrome 118.0.5993.70 mac #0-23] 1 passing (13.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-21] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/ident.feature
[chrome 118.0.5993.70 mac #0-21] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-21] Session ID: f429a0cd4e001b51bd33dc68a9ef75e2
[chrome 118.0.5993.70 mac #0-21]
[chrome 118.0.5993.70 mac #0-21] Ident flow
[chrome 118.0.5993.70 mac #0-21] When app perform the check it select the check baseline using the ident fields (ident):
[chrome 118.0.5993.70 mac #0-21] ['name', 'viewport', 'browserName', 'os', 'app', 'branch'], if we have two checks with same name but different ident
[chrome 118.0.5993.70 mac #0-21] we should use different baselines for each checks.
[chrome 118.0.5993.70 mac #0-21]
[chrome 118.0.5993.70 mac #0-21]    ✓ Ident flow, same ident [accepted, passed]
[chrome 118.0.5993.70 mac #0-21]    ✓ Ident flow, different ident all tests are new
[chrome 118.0.5993.70 mac #0-21]    ✓ Ident flow, same ident [unaccepted, failed]
[chrome 118.0.5993.70 mac #0-21]    ✓ Ident flow, same ident [accepted, failed]
[chrome 118.0.5993.70 mac #0-21]
[chrome 118.0.5993.70 mac #0-21] 4 passing (43.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-24] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/remove_checks.feature
[chrome 118.0.5993.70 mac #0-24] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-24] Session ID: e5ea30fa513337e248d3ff484c40aaec
[chrome 118.0.5993.70 mac #0-24]
[chrome 118.0.5993.70 mac #0-24] Remove checks
[chrome 118.0.5993.70 mac #0-24]    ✓ Remove check via check preview
[chrome 118.0.5993.70 mac #0-24]    ✓ Remove check via Check Details Modal
[chrome 118.0.5993.70 mac #0-24]
[chrome 118.0.5993.70 mac #0-24] 2 passing (1m 4.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-27] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/accept_via_details.feature
[chrome 118.0.5993.70 mac #0-27] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-27] Session ID: 59a17a731fd85813412d99e2cb4d23de
[chrome 118.0.5993.70 mac #0-27]
[chrome 118.0.5993.70 mac #0-27] Check details Related Checks - Navigation and Accept
[chrome 118.0.5993.70 mac #0-27]    ✓ Related - Navigation via Related Panel and Accept second Check
[chrome 118.0.5993.70 mac #0-27]
[chrome 118.0.5993.70 mac #0-27] 1 passing (32s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-26] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/test_calculated_fields.feature
[chrome 118.0.5993.70 mac #0-26] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-26] Session ID: 8b44e60951dc3e554966125963c2b390
[chrome 118.0.5993.70 mac #0-26]
[chrome 118.0.5993.70 mac #0-26] Test calculated fields
[chrome 118.0.5993.70 mac #0-26] during the session end - calculated common fields based in checks in test: [viewport, status]
[chrome 118.0.5993.70 mac #0-26]
[chrome 118.0.5993.70 mac #0-26]    ✓ Same viewports - [50x50, 50x50]
[chrome 118.0.5993.70 mac #0-26]    ✓ Different viewports - [50x50, 100x100]
[chrome 118.0.5993.70 mac #0-26]    ✓ Same viewports - [new, new]
[chrome 118.0.5993.70 mac #0-26]    ✓ Same viewports - [new, passed]
[chrome 118.0.5993.70 mac #0-26]    ✓ Same viewports - [passed, failed]
[chrome 118.0.5993.70 mac #0-26]
[chrome 118.0.5993.70 mac #0-26] 5 passing (1m 53.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-25] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CHECKS_HANDLING/standard_flow_ui.feature
[chrome 118.0.5993.70 mac #0-25] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-25] Session ID: dc0e6d620f2ab9596c21b2e7a395f7c5
[chrome 118.0.5993.70 mac #0-25]
[chrome 118.0.5993.70 mac #0-25] Standard Checks Flow - UI
[chrome 118.0.5993.70 mac #0-25]    ✓ Status View - Standard Flow
[chrome 118.0.5993.70 mac #0-25]    ✓ Status View - Not Accepted
[chrome 118.0.5993.70 mac #0-25]    ✓ Status View - Wrong Size
[chrome 118.0.5993.70 mac #0-25]
[chrome 118.0.5993.70 mac #0-25] 3 passing (2m 35.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-28] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/appearance_common.feature
[chrome 118.0.5993.70 mac #0-28] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-28] Session ID: 7c865a44f461560b10204c8f334745fc
[chrome 118.0.5993.70 mac #0-28]
[chrome 118.0.5993.70 mac #0-28] Check Detail Appearance
[chrome 118.0.5993.70 mac #0-28]    ✓ Check Detail Appearance
[chrome 118.0.5993.70 mac #0-28]
[chrome 118.0.5993.70 mac #0-28] 1 passing (55.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-30] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/heighlight.feature
[chrome 118.0.5993.70 mac #0-30] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-30] Session ID: 0ac49b7bfd1c3c09016d1c1f33e3be20
[chrome 118.0.5993.70 mac #0-30]
[chrome 118.0.5993.70 mac #0-30] Check Details Difference Highlight
[chrome 118.0.5993.70 mac #0-30]    ✓ Check Details Difference Highlight
[chrome 118.0.5993.70 mac #0-30]
[chrome 118.0.5993.70 mac #0-30] 1 passing (21.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-32] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/open_close_check_details.feature
[chrome 118.0.5993.70 mac #0-32] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-32] Session ID: 2430a6e88b62b6e3402f031876477b68
[chrome 118.0.5993.70 mac #0-32]
[chrome 118.0.5993.70 mac #0-32] Open/Close Check Details
[chrome 118.0.5993.70 mac #0-32]    ✓ Open/Close Check Details via click
[chrome 118.0.5993.70 mac #0-32]    ✓ Open/Close Check Details via url
[chrome 118.0.5993.70 mac #0-32]
[chrome 118.0.5993.70 mac #0-32] 2 passing (27.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-29] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/apperance_enabled_buttons.feature
[chrome 118.0.5993.70 mac #0-29] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-29] Session ID: 6528eed08b3da2efcbfc873a323833d4
[chrome 118.0.5993.70 mac #0-29]
[chrome 118.0.5993.70 mac #0-29] Enabled disabled buttons on Check Details Modal Window
[chrome 118.0.5993.70 mac #0-29]    ✓ New Check
[chrome 118.0.5993.70 mac #0-29]    ✓ Passed Check
[chrome 118.0.5993.70 mac #0-29]    ✓ Passed Check with Ignore Regions
[chrome 118.0.5993.70 mac #0-29]    ✓ Failed Check
[chrome 118.0.5993.70 mac #0-29]    ✓ Failed Check difference more than 5%
[chrome 118.0.5993.70 mac #0-29]
[chrome 118.0.5993.70 mac #0-29] 5 passing (1m 24.4s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-31] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/initial_resize.feature
[chrome 118.0.5993.70 mac #0-31] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-31] Session ID: 01f6f2f9c5ea395f0af66e25ef1213d7
[chrome 118.0.5993.70 mac #0-31]
[chrome 118.0.5993.70 mac #0-31] Check Details - Initial image resize
[chrome 118.0.5993.70 mac #0-31]    ✓ Image fit in the viewport
[chrome 118.0.5993.70 mac #0-31]    ✓ Image is too small
[chrome 118.0.5993.70 mac #0-31]    ✓ Image is too high
[chrome 118.0.5993.70 mac #0-31]    ✓ Image is too wide
[chrome 118.0.5993.70 mac #0-31]
[chrome 118.0.5993.70 mac #0-31] 4 passing (1m 6.4s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-34] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/related/related_navigation_and_accept.feature
[chrome 118.0.5993.70 mac #0-34] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-34] Session ID: 540a24752dfd0588d3a302858dd3932c
[chrome 118.0.5993.70 mac #0-34]
[chrome 118.0.5993.70 mac #0-34] Check details Related Checks - Navigation and Accept
[chrome 118.0.5993.70 mac #0-34]    ✓ Related - Navigation via Related Panel and Accept second Check
[chrome 118.0.5993.70 mac #0-34]
[chrome 118.0.5993.70 mac #0-34] 1 passing (35.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-35] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/related/related_navigation.feature
[chrome 118.0.5993.70 mac #0-35] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-35] Session ID: ca9676b8e5cbfa14e2d1148d7a3c38c0
[chrome 118.0.5993.70 mac #0-35]
[chrome 118.0.5993.70 mac #0-35] Check details Related Checks - Navigation
[chrome 118.0.5993.70 mac #0-35]    ✓ Related - Navigation via Related Panel
[chrome 118.0.5993.70 mac #0-35]
[chrome 118.0.5993.70 mac #0-35] 1 passing (29.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-33] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/regions.feature
[chrome 118.0.5993.70 mac #0-33] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-33] Session ID: 0b6b5767ded1f76b5aca984118626f68
[chrome 118.0.5993.70 mac #0-33]
[chrome 118.0.5993.70 mac #0-33] Check details - Regions
[chrome 118.0.5993.70 mac #0-33]    ✓ Regions - add, save, check
[chrome 118.0.5993.70 mac #0-33]    ✖ Regions - delete
[chrome 118.0.5993.70 mac #0-33]    ✓ Regions - delete
[chrome 118.0.5993.70 mac #0-33]    ✓ Regions - copy regions from previous baseline
[chrome 118.0.5993.70 mac #0-33]
[chrome 118.0.5993.70 mac #0-33] 3 passing (1m 37.9s)
[chrome 118.0.5993.70 mac #0-33] 1 failing
[chrome 118.0.5993.70 mac #0-33]
[chrome 118.0.5993.70 mac #0-33] 1) Check details - Regions Regions - delete
[chrome 118.0.5993.70 mac #0-33] Unable to locate test row for "TestName"
[chrome 118.0.5993.70 mac #0-33] Error: Unable to locate test row for "TestName"
[chrome 118.0.5993.70 mac #0-33]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:226:11)
[chrome 118.0.5993.70 mac #0-33]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-33]     at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
[chrome 118.0.5993.70 mac #0-33]     at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-38] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/side_to_side_view.feature
[chrome 118.0.5993.70 mac #0-38] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-38] Session ID: 6a3dc7aecbd1b92b6c6ccfb1c07d2f8d
[chrome 118.0.5993.70 mac #0-38]
[chrome 118.0.5993.70 mac #0-38] Side to side view
[chrome 118.0.5993.70 mac #0-38]    ✓ Divider in the center
[chrome 118.0.5993.70 mac #0-38]
[chrome 118.0.5993.70 mac #0-38] 1 passing (18.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-37] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/resize_and_pan.feature
[chrome 118.0.5993.70 mac #0-37] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-37] Session ID: 5c8444233e448ec907fd8bf6c1e0d39d
[chrome 118.0.5993.70 mac #0-37]
[chrome 118.0.5993.70 mac #0-37] Check details Resize and Pan
[chrome 118.0.5993.70 mac #0-37]    ✓ Resize Dropdown Usage
[chrome 118.0.5993.70 mac #0-37]    ✓ Resize via Ctrl + Mouse Wheel
[chrome 118.0.5993.70 mac #0-37]    ✓ Pan via central mouse button and Mouse Move
[chrome 118.0.5993.70 mac #0-37]    ✓ Pan via Mouse Wheel (touchpad)
[chrome 118.0.5993.70 mac #0-37]
[chrome 118.0.5993.70 mac #0-37] 4 passing (1m 7.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-36] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/related/related.feature
[chrome 118.0.5993.70 mac #0-36] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-36] Session ID: 675228f746ac2c049e9f4966f3964da4
[chrome 118.0.5993.70 mac #0-36]
[chrome 118.0.5993.70 mac #0-36] Check details Related Checks
[chrome 118.0.5993.70 mac #0-36]    ✓ Related - same projects
[chrome 118.0.5993.70 mac #0-36]    ✓ Related - different projects
[chrome 118.0.5993.70 mac #0-36]    ✓ Related - sort by Date
[chrome 118.0.5993.70 mac #0-36]    ✓ Related - filter by Browser
[chrome 118.0.5993.70 mac #0-36]
[chrome 118.0.5993.70 mac #0-36] 4 passing (1m 26.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-40] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/header/filter_by_project.feature
[chrome 118.0.5993.70 mac #0-40] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-40] Session ID: 8616b4ac019d26045dfff5ac0bb2993f
[chrome 118.0.5993.70 mac #0-40]
[chrome 118.0.5993.70 mac #0-40] Filter by project
[chrome 118.0.5993.70 mac #0-40]    ✓ Filter by Project
[chrome 118.0.5993.70 mac #0-40]
[chrome 118.0.5993.70 mac #0-40] 1 passing (13.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-39] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/check_details/simple_views.feature
[chrome 118.0.5993.70 mac #0-39] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-39] Session ID: 826c9ec08d85f57072d4b23eeabb0f06
[chrome 118.0.5993.70 mac #0-39]
[chrome 118.0.5993.70 mac #0-39] Simple Views (Expected, Actual, Diff)
[chrome 118.0.5993.70 mac #0-39]    ✓ Simple Views (Expected, Actual, Diff)
[chrome 118.0.5993.70 mac #0-39]
[chrome 118.0.5993.70 mac #0-39] 1 passing (26.2s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-42] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/header/switch_theme.feature
[chrome 118.0.5993.70 mac #0-42] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-42] Session ID: 1f967b4633d0c8fe7a6b6c44683bdd63
[chrome 118.0.5993.70 mac #0-42]
[chrome 118.0.5993.70 mac #0-42] Switch Color Theme
[chrome 118.0.5993.70 mac #0-42]    ✓ Switch Color Theme
[chrome 118.0.5993.70 mac #0-42]
[chrome 118.0.5993.70 mac #0-42] 1 passing (15.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-43] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/header/user_info.feature
[chrome 118.0.5993.70 mac #0-43] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-43] Session ID: 2e4efe4afee5a74d084ee808bcac6a11
[chrome 118.0.5993.70 mac #0-43]
[chrome 118.0.5993.70 mac #0-43] User Information
[chrome 118.0.5993.70 mac #0-43]    ✓ Check User Menu Information
[chrome 118.0.5993.70 mac #0-43]
[chrome 118.0.5993.70 mac #0-43] 1 passing (18.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-45] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/filter_by_project.feature
[chrome 118.0.5993.70 mac #0-45] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-45] Session ID: b4d1075ca008fcdaeae2b27978e3994e
[chrome 118.0.5993.70 mac #0-45]
[chrome 118.0.5993.70 mac #0-45] Filter by Project
[chrome 118.0.5993.70 mac #0-45]    ✓ Filter by Project
[chrome 118.0.5993.70 mac #0-45]
[chrome 118.0.5993.70 mac #0-45] 1 passing (13s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-44] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/checks_by_test.feature
[chrome 118.0.5993.70 mac #0-44] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-44] Session ID: 09aeb95d383ff069d3695a116466229b
[chrome 118.0.5993.70 mac #0-44]
[chrome 118.0.5993.70 mac #0-44] Checks Isolation by Test
[chrome 118.0.5993.70 mac #0-44] Every checks are related to one test.
[chrome 118.0.5993.70 mac #0-44] Each test should contain only it checks and no extra checks
[chrome 118.0.5993.70 mac #0-44]
[chrome 118.0.5993.70 mac #0-44]    ✓ Checks Isolation by Test
[chrome 118.0.5993.70 mac #0-44]
[chrome 118.0.5993.70 mac #0-44] 1 passing (16.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-47] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/tests_by_browser.feature
[chrome 118.0.5993.70 mac #0-47] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-47] Session ID: 98e39a7b0ed68cd3bf4a157a0274fdc3
[chrome 118.0.5993.70 mac #0-47]
[chrome 118.0.5993.70 mac #0-47] Test Isolation by Browser
[chrome 118.0.5993.70 mac #0-47]    ✓ Tests Isolation by Browser
[chrome 118.0.5993.70 mac #0-47]
[chrome 118.0.5993.70 mac #0-47] 1 passing (13.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-46] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/tests_by_accept_status.feature
[chrome 118.0.5993.70 mac #0-46] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-46] Session ID: 587fd8793fb2a2e743608dad9bcb4ca7
[chrome 118.0.5993.70 mac #0-46]
[chrome 118.0.5993.70 mac #0-46] Test Isolation by Accept Status
[chrome 118.0.5993.70 mac #0-46]    ✓ Tests Isolation by Accept Status
[chrome 118.0.5993.70 mac #0-46]
[chrome 118.0.5993.70 mac #0-46] 1 passing (16.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-41] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/header/spotlight_navigation.feature
[chrome 118.0.5993.70 mac #0-41] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-41] Session ID: 200d293f3e2629a844395035bec40c4a
[chrome 118.0.5993.70 mac #0-41]
[chrome 118.0.5993.70 mac #0-41] Spotlight
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight Appear
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight Navigation - Results
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight Navigation - Suite
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight Navigation - Admin
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight Navigation - Logs
[chrome 118.0.5993.70 mac #0-41]    ✓ Spotlight - switch theme
[chrome 118.0.5993.70 mac #0-41]
[chrome 118.0.5993.70 mac #0-41] 6 passing (59.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-49] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/tests_by_suite.feature
[chrome 118.0.5993.70 mac #0-49] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-49] Session ID: e1496f3be1856a896e147c8431548f67
[chrome 118.0.5993.70 mac #0-49]
[chrome 118.0.5993.70 mac #0-49] Test Isolation by Suite
[chrome 118.0.5993.70 mac #0-49]    ✓ Tests Isolation by Suite
[chrome 118.0.5993.70 mac #0-49]
[chrome 118.0.5993.70 mac #0-49] 1 passing (20.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-48] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/items_isolations/tests_by_run.feature
[chrome 118.0.5993.70 mac #0-48] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-48] Session ID: 48758048a69ab754a50028b5d357e878
[chrome 118.0.5993.70 mac #0-48]
[chrome 118.0.5993.70 mac #0-48] Test Isolation by Run
[chrome 118.0.5993.70 mac #0-48]    ✓ Tests Isolation by Run
[chrome 118.0.5993.70 mac #0-48]    ✓ Checks Isolation by Run - same name different ident
[chrome 118.0.5993.70 mac #0-48]    ✓ Checks Isolation by Run - same name same ident
[chrome 118.0.5993.70 mac #0-48]
[chrome 118.0.5993.70 mac #0-48] 3 passing (40.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-51] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/group_by_navigation.feature
[chrome 118.0.5993.70 mac #0-51] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-51] Session ID: 6f13b18e7e410169fd494acaa3dbf0f3
[chrome 118.0.5993.70 mac #0-51]
[chrome 118.0.5993.70 mac #0-51] Group by Navigation
[chrome 118.0.5993.70 mac #0-51] Check Breadcrumbs, Title and Url changes behaviour on grouping changes
[chrome 118.0.5993.70 mac #0-51]
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Runs
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Suites
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Browsers
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Platform
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Test Status
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by - Accept Status
[chrome 118.0.5993.70 mac #0-51]    ✓ Group by via Url
[chrome 118.0.5993.70 mac #0-51]
[chrome 118.0.5993.70 mac #0-51] 7 passing (51.5s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-52] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/group_by.feature
[chrome 118.0.5993.70 mac #0-52] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-52] Session ID: 19f467e2edf92c799d485677788e7065
[chrome 118.0.5993.70 mac #0-52]
[chrome 118.0.5993.70 mac #0-52] Group by
[chrome 118.0.5993.70 mac #0-52]    ✓ Group by
[chrome 118.0.5993.70 mac #0-52]    ✓ Group by after item select
[chrome 118.0.5993.70 mac #0-52]    ✓ Group by via Url
[chrome 118.0.5993.70 mac #0-52]
[chrome 118.0.5993.70 mac #0-52] 3 passing (34.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-55] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/refresh.feature
[chrome 118.0.5993.70 mac #0-55] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-55] Session ID: f670e207e399ce68bde2d612116f2623
[chrome 118.0.5993.70 mac #0-55]
[chrome 118.0.5993.70 mac #0-55] Navbar Refresh
[chrome 118.0.5993.70 mac #0-55]    ✓ Navbar Refresh
[chrome 118.0.5993.70 mac #0-55]
[chrome 118.0.5993.70 mac #0-55] 1 passing (18.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-56] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/remove_item.feature
[chrome 118.0.5993.70 mac #0-56] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-56] Session ID: b54f24b540e3b87609fc61ae368b6917
[chrome 118.0.5993.70 mac #0-56]
[chrome 118.0.5993.70 mac #0-56] Remove item
[chrome 118.0.5993.70 mac #0-56]    ✓ Remove Run
[chrome 118.0.5993.70 mac #0-56]    ✓ Remove Suite
[chrome 118.0.5993.70 mac #0-56]
[chrome 118.0.5993.70 mac #0-56] 2 passing (42.6s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-57] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/runs_ring_status.feature
[chrome 118.0.5993.70 mac #0-57] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-57] Session ID: 6979575888e64cf1f5336ac09a8ff34f
[chrome 118.0.5993.70 mac #0-57]
[chrome 118.0.5993.70 mac #0-57] Runs Ring Statuses
[chrome 118.0.5993.70 mac #0-57]    ✓ Runs Ring Statuses [PASSED, FILED, NEW]
[chrome 118.0.5993.70 mac #0-57]
[chrome 118.0.5993.70 mac #0-57] 1 passing (18.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-53] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/pagination.feature
[chrome 118.0.5993.70 mac #0-53] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-53] Session ID: d8a0db5302e7fdbc13c77d3adca38dc5
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] Pagination
[chrome 118.0.5993.70 mac #0-53]    ✓ Pagination
[chrome 118.0.5993.70 mac #0-53]    ✖ Pagination - Suite
[chrome 118.0.5993.70 mac #0-53]    ✖ Pagination - Suite
[chrome 118.0.5993.70 mac #0-53]    ✖ Pagination - Suite
[chrome 118.0.5993.70 mac #0-53]    ✖ Pagination - Suite
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] 1 passing (2m 26.9s)
[chrome 118.0.5993.70 mac #0-53] 4 failing
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] 1) Pagination Pagination - Suite
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-53]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-53]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-53]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-53]     at global.$$ (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/runner/build/index.js:115:43)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/then.js:41:10)
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] 2) Pagination Pagination - Suite
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-53]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-53]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-53]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] 3) Pagination Pagination - Suite
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-53]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-53]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-53]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-53]
[chrome 118.0.5993.70 mac #0-53] 4) Pagination Pagination - Suite
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-53]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-53]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-53]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-53]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-53]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-59] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/sorting.feature
[chrome 118.0.5993.70 mac #0-59] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-59] Session ID: 6ec513b9f2e1978f073dd0d78b517c25
[chrome 118.0.5993.70 mac #0-59]
[chrome 118.0.5993.70 mac #0-59] Navbar Sorting
[chrome 118.0.5993.70 mac #0-59]    ✓ Sorting
[chrome 118.0.5993.70 mac #0-59]
[chrome 118.0.5993.70 mac #0-59] 1 passing (40.4s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-58] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/navbar/select.feature
[chrome 118.0.5993.70 mac #0-58] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-58] Session ID: 9550eab1a0b662ff68813a13d12b74b8
[chrome 118.0.5993.70 mac #0-58]
[chrome 118.0.5993.70 mac #0-58] Select Navbar Item
[chrome 118.0.5993.70 mac #0-58]    ✓ Select 1 and 2 items (hold the Meta key)
[chrome 118.0.5993.70 mac #0-58]    ✓ Select 1 item deselect via group by
[chrome 118.0.5993.70 mac #0-58]    ✓ Select one item via Url
[chrome 118.0.5993.70 mac #0-58]    ✓ Select two items via Url
[chrome 118.0.5993.70 mac #0-58]
[chrome 118.0.5993.70 mac #0-58] 4 passing (1m 22.3s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-60] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/auto_update.feature
[chrome 118.0.5993.70 mac #0-60] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-60] Session ID: 92470d5db2f762437ac46abdf6d47f2f
[chrome 118.0.5993.70 mac #0-60]
[chrome 118.0.5993.70 mac #0-60] Test Auto Update
[chrome 118.0.5993.70 mac #0-60]    ✓ Update Table with new Tests
[chrome 118.0.5993.70 mac #0-60]
[chrome 118.0.5993.70 mac #0-60] 1 passing (34.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-61] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/bulk_test_apply.feature
[chrome 118.0.5993.70 mac #0-61] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-61] Session ID: ebfdaedf82c831896e6b6f0dca9b08fd
[chrome 118.0.5993.70 mac #0-61]
[chrome 118.0.5993.70 mac #0-61] Bulk test Apply
[chrome 118.0.5993.70 mac #0-61]    ✓ Apply 2 tests
[chrome 118.0.5993.70 mac #0-61]
[chrome 118.0.5993.70 mac #0-61] 1 passing (23.9s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-62] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/bulk_test_delete.feature
[chrome 118.0.5993.70 mac #0-62] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-62] Session ID: 8f5b49855929d7564fc3b38d7e83e89a
[chrome 118.0.5993.70 mac #0-62]
[chrome 118.0.5993.70 mac #0-62] Bulk test Delete
[chrome 118.0.5993.70 mac #0-62]    ✓ Delete 2 tests
[chrome 118.0.5993.70 mac #0-62]
[chrome 118.0.5993.70 mac #0-62] 1 passing (18.2s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-63] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/check_preview/accept_icon_color.feature
[chrome 118.0.5993.70 mac #0-63] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-63] Session ID: 9a420405af1c238bed4914fe9985d05b
[chrome 118.0.5993.70 mac #0-63]
[chrome 118.0.5993.70 mac #0-63] Check Preview - Accept Icons View
[chrome 118.0.5993.70 mac #0-63]    ✓ Accept Icons View
[chrome 118.0.5993.70 mac #0-63]
[chrome 118.0.5993.70 mac #0-63] 1 passing (17.2s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-65] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/check_preview/images_visibility.feature
[chrome 118.0.5993.70 mac #0-65] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-65] Session ID: 1f0999bad698464d096670e4327a7a41
[chrome 118.0.5993.70 mac #0-65]
[chrome 118.0.5993.70 mac #0-65] Checks Preview images visibilities
[chrome 118.0.5993.70 mac #0-65]    ✓ Checks Preview images visibilities
[chrome 118.0.5993.70 mac #0-65]
[chrome 118.0.5993.70 mac #0-65] 1 passing (9.1s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-66] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/check_preview/tooltip.feature
[chrome 118.0.5993.70 mac #0-66] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-66] Session ID: 9233210b316a9fce8694262ec58c282d
[chrome 118.0.5993.70 mac #0-66]
[chrome 118.0.5993.70 mac #0-66] Check Preview - Tooltip
[chrome 118.0.5993.70 mac #0-66]    ✓ Status View - Tooltip
[chrome 118.0.5993.70 mac #0-66]
[chrome 118.0.5993.70 mac #0-66] 1 passing (14.6s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-64] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/check_preview/check_modes.feature
[chrome 118.0.5993.70 mac #0-64] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-64] Session ID: ff092b9abd5b5946406d22aaf27c7d6c
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64]    ✖ Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 8 failing (40.7s)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 1) Checks Preview Modes Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64] Failed to unfold test "TestName" after 3 attempts. Last error: disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] Error: Failed to unfold test "TestName" after 3 attempts. Last error: disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/web/tests_web.sd.js:405:15)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at async CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:16)
[chrome 118.0.5993.70 mac #0-64]     at async CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:25:18)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 2) Checks Preview Modes Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 3) Checks Preview Modes Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 4) Checks Preview Modes Checks Preview Modes
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 5) Checks Preview Modes Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 6) Checks Preview Modes Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 7) Checks Preview Modes Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
[chrome 118.0.5993.70 mac #0-64]
[chrome 118.0.5993.70 mac #0-64] 8) Checks Preview Modes Checks Preview Sizes on Bounded mode
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
  (failed to check if window was closed: disconnected: not connected to DevTools)
  (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64] disconnected: not connected to DevTools
[chrome 118.0.5993.70 mac #0-64]   (failed to check if window was closed: disconnected: not connected to DevTools)
[chrome 118.0.5993.70 mac #0-64]   (Session info: headless chrome=118.0.5993.70)
[chrome 118.0.5993.70 mac #0-64]     at runMicrotasks (<anonymous>)
[chrome 118.0.5993.70 mac #0-64]     at processTicksAndRejections (internal/process/task_queues.js:95:5)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.<anonymous> (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/step_definitions/server.sd.js:45:17)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.executeAsync (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/shim.js:101:25)
[chrome 118.0.5993.70 mac #0-64]     at CustomWorld.exports.testFrameworkFnWrapper (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/utils/build/test-framework/testFnWrapper.js:18:32)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-67] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/distincts_filter.feature
[chrome 118.0.5993.70 mac #0-67] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-67] Session ID: 8b5a2f883dfe734d81b56e53c8672bcc
[chrome 118.0.5993.70 mac #0-67]
[chrome 118.0.5993.70 mac #0-67] Distinct filters functionality
[chrome 118.0.5993.70 mac #0-67]    ✓ Distinct
[chrome 118.0.5993.70 mac #0-67]
[chrome 118.0.5993.70 mac #0-67] 1 passing (36.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-69] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/folding.feature
[chrome 118.0.5993.70 mac #0-69] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-69] Session ID: 060837caef4af7c7a811802971bde768
[chrome 118.0.5993.70 mac #0-69]
[chrome 118.0.5993.70 mac #0-69] Folding
[chrome 118.0.5993.70 mac #0-69]    ✓ Select, fold/unfold icon - appear
[chrome 118.0.5993.70 mac #0-69]    ✓ Fold/Unfold item by click
[chrome 118.0.5993.70 mac #0-69]    ✓ Fold/Unfold single item by select
[chrome 118.0.5993.70 mac #0-69]    ✓ Fold/Unfold multiple items by select
[chrome 118.0.5993.70 mac #0-69]    ✓ Fold/Unfold all items by select
[chrome 118.0.5993.70 mac #0-69]
[chrome 118.0.5993.70 mac #0-69] 5 passing (1m 24.8s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-68] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/filtering.feature
[chrome 118.0.5993.70 mac #0-68] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-68] Session ID: 97ebb431e97f7be6fc8a07febc3ecf15
[chrome 118.0.5993.70 mac #0-68]
[chrome 118.0.5993.70 mac #0-68] Tests Table Filter
[chrome 118.0.5993.70 mac #0-68]    ✓ Main Group, Single Rule
[chrome 118.0.5993.70 mac #0-68]    ✓ Main Group, Single Rule with project Filter
[chrome 118.0.5993.70 mac #0-68]    ✓ Filter after select navbar item
[chrome 118.0.5993.70 mac #0-68]    ✓ Main Group, Multiple Rules - And
[chrome 118.0.5993.70 mac #0-68]    ✓ Main Group, Multiple Rules - Or
[chrome 118.0.5993.70 mac #0-68]
[chrome 118.0.5993.70 mac #0-68] 5 passing (2m)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-71] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/navigation_via_link_params.feature
[chrome 118.0.5993.70 mac #0-71] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-71] Session ID: 3b245115c3c8c65b917489c59f978944
[chrome 118.0.5993.70 mac #0-71]
[chrome 118.0.5993.70 mac #0-71] Navigation via link parameters
[chrome 118.0.5993.70 mac #0-71]    ✓ Navigation to link with predefined parameters
[chrome 118.0.5993.70 mac #0-71]
[chrome 118.0.5993.70 mac #0-71] 1 passing (55.7s)
------------------------------------------------------------------
[chrome 118.0.5993.70 mac #0-70] Spec: /Users/a1/Projects/syngrisi/packages/syngrisi/tests/features/CP/table/infinity_scroll.feature
[chrome 118.0.5993.70 mac #0-70] Running: chrome (v118.0.5993.70) on mac
[chrome 118.0.5993.70 mac #0-70] Session ID: b08413d1c8c392bdf79073906c75c0ea
[chrome 118.0.5993.70 mac #0-70]
[chrome 118.0.5993.70 mac #0-70] Infinity scroll
[chrome 118.0.5993.70 mac #0-70]    ✓ Infinity scroll
[chrome 118.0.5993.70 mac #0-70]
[chrome 118.0.5993.70 mac #0-70] 1 passing (1m 15.5s)


Spec Files:	 67 passed, 15 failed, 3 skipped, 87 total (98% completed) in 00:21:35 

