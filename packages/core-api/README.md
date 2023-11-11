# Syngrisi Core API - Visual Regression Testing

## Overview

Syngrisi Core API (`@syngrisi/core-api`) provides an interface to communicate with the Syngrisi visual regression
testing service. This service allows clients to start and stop sessions, create checks, and get snapshots and baselines.
This is the common JS/TS library, if you use WebdriverIO as automation framework try to use [wdio-syngrisi-cucumber-service](https://www.npmjs.com/package/wdio-syngrisi-cucumber-service) or [@syngrisi/syngrisi-wdio-sdk](https://www.npmjs.com/package/@syngrisi/syngrisi-wdio-sdk), if Playwright try to
use [@syngrisi/playwright-sdk](https://www.npmjs.com/package/@syngrisi/playwright-sdk). For detailed documentation on the API methods
and their parameters, refer to [Syngrisi Core API Documentation](https://syngrisi.github.io/syngrisi/modules/_syngrisi_core_api.html).

Syngrisi Core API (`@syngrisi/core-api`) provides a way to interact with the Syngrisi visual regression testing service. This service lets you start and stop testing sessions, set up test checks, and retrieve snapshots and baseline images. This is a common JavaScript/TypeScript library. If your automation framework is WebdriverIO, consider using [wdio-syngrisi-cucumber-service](https://www.npmjs.com/package/wdio-syngrisi-cucumber-service) or [@syngrisi/syngrisi-wdio-sdk](https://www.npmjs.com/package/@syngrisi/syngrisi-wdio-sdk). If you are using Playwright, the @syngrisi/playwright-sdk is recommended. For a comprehensive guide on how to use the API's functions and parameters, please check out the [Syngrisi Core API Documentation](https://syngrisi.github.io/syngrisi/modules/_syngrisi_core_api.html).

### Installation

Install the package with npm:

```shell
npm install @syngrisi/core-api
```

## Basic Workflow

### 1. Start Session

To begin visual regression testing, start a session with the Syngrisi service:

```js
import { SyngrisiApi } from '@syngrisi/core-api';

// Initialize the API client with your configuration
const apiClient = new SyngrisiApi({
    url: 'http://<your-domain>/',
    apiKey: 'your-api-key'
});

// Start a new session with the required parameters
// The `sessionResponse` will have data about the test that started, and contains a `testId` which will be used for creating checks
const sessionResponse = await apiClient.startSession({
    run: 'run-id',
    suite: 'suite-name',
    runident: 'run-identifier',
    name: 'test-name',
    viewport: '1200x800',
    browser: 'chrome',
    browserVersion: '113',
    os: 'macOS',
    app: 'MyProject'
});


```

### 2. Create Check

Once the session is started, you can perform a visual check:

```js
// Assuming `imageBuffer` is the Buffer instance of the screenshot to check
// The `checkResponse` will contain the result of the visual comparison
const checkResponse = await apiClient.coreCheck(imageBuffer, {
    name: 'homepage',
    viewport: '1200x800',
    browserName: 'chrome',
    os: 'macOS',
    app: 'MyProject',
    branch: 'main',
    testId: sessionResponse.testId // obtained from the startSession call
});
```

### 3. Stop Session

After checks are completed, stop the session:

```js
// `stopResponse` will have data about the completed test.
const stopResponse = await apiClient.stopSession(sessionResponse.testId);
```

### Environment variables

`SYNGRISI_LOG_LEVEL` - logging level (`"trace" | "debug" | "info" | "warn" | "error"`)

### License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
