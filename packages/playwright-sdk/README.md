
# Syngrisi Playwright SDK

Syngrisi Playwright SDK, `@syngrisi/playwright-sdk` provides a simple and powerful way to integrate visual regression
testing into your Playwright tests. By using this SDK, you can send snapshots from your browser tests to the Syngrisi
server for comparison against baseline images, and easily manage visual testing sessions.

## Features

- Start and stop test sessions seamlessly within your test flows.
- Perform visual checks with automatic baseline comparison.
- Fetch baseline and snapshot data programmatically.
- Easily extendable to fit any Playwright-based testing framework.

## Installation

To install the Syngrisi Playwright SDK, run:

```bash
npm install @syngrisi/playwright-sdk
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
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';

const config = {
    apiKey: 'your-api-key',
    serverUrl: 'your-syngrisi-url'
};

const driver = new PlaywrightDriver(config);
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
const fullPageSreenshot = await page.screenshot({fullPage: true});
const headerScreenshot = page.locator('#header').screenshot();
// first check
driver.check({
    checkName: 'Main Page',
    imageBuffer: fullPageSreenshot,
    params: {
        viewport: '1200x800',
        browserName: 'chrome',
        os: 'Windows',
        app: 'MyProject',
        branch: 'develop'
    }
});

// second check
driver.check({
    checkName: 'Header',
    imageBuffer: headerScreenshot,
    params: {/* other parameters */ }
});

await driver.check({ 'About Page', imageBuffer_02, params: {/* other parameters */ } });
```

### 4. Stop the Test Session

Once all checks are completed, stop the test session.

```js
await driver.stopTestSession();
```

## Environment variables

Environment variables are used to modify the behavior of the Syngrisi Playwright SDK without code changes.

Example: To set the log level to debug, use the following command:

Windows: `set SYNGRISI_LOG_LEVEL=debug`
macOS/Linux: `export SYNGRISI_LOG_LEVEL=debug`

`SYNGRISI_LOG_LEVEL` - logging level (`"trace" | "debug" | "info" | "warn" | "error"`)

## Documentation

For detailed information about all available methods, parameters, and configurations, please refer to
the [Syngrisi GitHub repository](https://github.com/syngrisi/syngrisi).

## License

This project is licensed under the ISC License.

