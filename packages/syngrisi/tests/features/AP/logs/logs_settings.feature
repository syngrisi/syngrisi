
Execution of 87 spec files started at 2025-11-04T15:33:35.148Z

rm: ./logs/html-dumps: is a directory
Starting ChromeDriver 118.0.5993.70 (e52f33f30b91b4ddfad649acddc39ab570473b86-refs/branch-heads/5993@{#1216}) on port 7777
Only local connections are allowed.
Please see https://chromedriver.chromium.org/security-considerations for suggestions on keeping ChromeDriver safe.
IPv4 port not available. Exiting...
[1762270415.233][SEVERE]: bind() failed: Address already in use (48)
[0-1] RUNNING in chrome - /features/AP/logs/logs_basics.feature
[0-2] RUNNING in chrome - /features/AP/logs/logs_filtering.feature
[0-0] RUNNING in chrome - /features/AP/access.feature
[0-0] WARNING: cannot stop te Syngrisi server
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
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
[0-2] { isAlive: true }
[0-0] { isAlive: true }
[0-1] { isAlive: true }
[0-2] SERVER IS STARTED, PID: '71447' port: '3004'
[0-0] SERVER IS STARTED, PID: '71449' port: '3002'
[0-1] SERVER IS STARTED, PID: '71448' port: '3003'
[0-2] { command: 'waitForDisplayed' }
[0-0] WARNING: cannot stop te Syngrisi server
[0-1] { command: 'waitForDisplayed' }
[0-2] { command: 'waitForDisplayed' }
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
[0-0] { isAlive: true }
[0-0] SERVER IS STARTED, PID: '71631' port: '3002'
[0-1] js result 👉: 1284.5
[0-1] Expect: 0
Stored: 1284.5
[0-1] js result 👉: 0
[0-1] Expect: 0
Stored: 0
[0-1] WARNING: cannot stop te Syngrisi server
[0-2] WARNING: cannot stop te Syngrisi server
[0-1] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest1' }\n"
}
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-0] { command: 'waitForDisplayed' }
[0-1] { isAlive: true }
[0-2] { isAlive: true }
[0-1] SERVER IS STARTED, PID: '71838' port: '3003'
[0-2] SERVER IS STARTED, PID: '71840' port: '3004'
[0-2] { command: 'waitForDisplayed' }
[0-0] WARNING: cannot stop te Syngrisi server
[0-2] { command: 'waitForDisplayed' }
[0-0] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest0' }\n"
}
[0-0] { isAlive: true }
[0-0] SERVER IS STARTED, PID: '71968' port: '3002'
[0-2] WARNING: cannot stop te Syngrisi server
[0-0] { command: 'waitForDisplayed' }
[0-2] {
  result: '\n' +
    '> @syngrisi/syngrisi@2.2.27-alpha.0 clear_test /Users/a1/Projects/syngrisi/packages/syngrisi\n' +
    '> mongosh SyngrisiDbTest$CID --eval "db.dropDatabase();" && rm -rf ./baselinesTest/$CID\n' +
    '\n' +
    "{ ok: 1, dropped: 'SyngrisiDbTest2' }\n"
}
[0-2] { isAlive: true }
[0-0] PASSED in chrome - /features/AP/access.feature
[0-2] SERVER IS STARTED, PID: '72222' port: '3004'
[0-2] { command: 'waitForDisplayed' }
[0-2] { command: 'waitForDisplayed' }
[0-1] { command: 'waitForDisplayed' }
[0-1] WARNING: cannot stop te Syngrisi server
/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/cli/build/interface.js:127
            throw new Error('Could not find job');
                  ^
Error: Could not find job
    at WDIOCLInterface.clearJob (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/cli/build/interface.js:127:19)
    at WDIOCLInterface.emit (events.js:400:28)
    at WDIOCLInterface.emit (domain.js:475:12)
    at Launcher.endHandler (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/node_modules/@wdio/cli/build/launcher.js:222:28)
    at WorkerInstance.emit (events.js:400:28)
    at WorkerInstance.emit (domain.js:475:12)
    at WorkerInstance._handleExit (/Users/a1/Projects/syngrisi/packages/syngrisi/tests/src/support/local-runner-patched/build/worker.js:101:14)
    at ChildProcess.emit (events.js:400:28)
    at ChildProcess.emit (domain.js:475:12)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:285:12)
