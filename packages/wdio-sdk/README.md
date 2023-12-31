# Syngrisi WebdriverIO SDK

The Syngrisi SDK for WebdriverIO, `@syngrisi/wdio-sdk` provides a simple and powerful way to integrate visual regression
testing into your WebdriverIO tests. By using this SDK, you can send snapshots from your browser tests to the Syngrisi
server for comparison against baseline images, and easily manage visual testing sessions.

## Features

- Start and stop test sessions seamlessly within your test flows.
- Perform visual checks with automatic baseline comparison.
- Fetch baseline and snapshot data programmatically.
- Easily extendable to fit any WebdriverIO-based testing framework.

## Installation

To install the Syngrisi WebdriverIO SDK, run:

```bash
npm install @syngrisi/wdio-sdk
```

## Base Workflow Overview

There is 3 basic step for particular test:

<p align="center">
<img src="./docs/flow.png" alt="workflow" width="40%">
</p>

## Usage

The following is a standard workflow to use the SDK in your tests:

### 1. Initialize the Driver

Before starting your test session, initialize the driver with the necessary configuration.

```js
const { SyngrisiDriver } = require('@syngrisi/wdio-sdk');

const config = {
    apiKey: 'your-api-key',
    serverUrl: 'your-singrisi-url'
};

const driver = new SyngrisiDriver(config);
```

### 2. Start a Test Session

Start a test session with the desired parameters.

```js
const sessionParams = {
    os: 'Windows',
    viewport: '1920x1080',
    browserName: 'chrome',
    browserVersion: '89.0',
    test: 'Homepage Test',
    app: 'Your App',
    run: 'Run 1',
    branch: 'main',
    runident: 'unique-run-identifier',
    suite: 'My Test Suite',
    tags: ['tag1', 'tag2']
};

await driver.startTestSession({ params: sessionParams });
```

### 3. Perform a visual Check

Perform a visual check by providing the check name, image buffer, and any additional parameters.

```js
driver.check({
    checkName: 'Header',
    imageBuffer:  await $('#header').saveScreenshot(),
    params: {
        viewport: '1200x800',
        browserName: 'chrome',
        os: 'Windows',
        app: 'MyProject',
        branch: 'develop'
    }
});
await driver.check({ 'About Page', await $('#header').saveScreenshot(), params: {/* other parameters */ } });
```

### 4. Stop the Test Session

Once all checks are completed, stop the test session.

```js
await driver.stopTestSession();
```

## Environment variables
Environment variables are used to modify the behavior of the Syngrisi WebdriverIO SDK without code changes.

Example: To set the log level to debug, use the following command:

Windows: `set SYNGRISI_LOG_LEVEL=debug`
macOS/Linux: `export SYNGRISI_LOG_LEVEL=debug`

`ENV_POSTFIX` - will add to platform property, you can use this to set some unique platform name for particular
environment
`SYNGRISI_LOG_LEVEL` - logging level (`"trace" | "debug" | "info" | "warn" | "error"`)

## Documentation

For detailed information about all available methods, parameters, and configurations, please refer to
the [Syngrisi packages documentation](TODO ADD LINK TO ROOT docs folder published on github.io).

## License

This project is licensed under the [MIT License](LICENSE.md).

