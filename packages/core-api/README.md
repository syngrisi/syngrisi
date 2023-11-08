# Syngrisi Core API - Visual Regression Testing

## Overview

Syngrisi Core API (`@syngrisi/core-api`) provides an interface to communicate with the Syngrisi visual regression
testing service. This service allows clients to start and stop sessions, create checks, and get snapshots and baselines.
This is the common JS/TS library, if you use WebdriverIO or Playwright try to
use [appropriate packages](https://www.npmjs.com/search?q=%40syngrisi). For detailed documentation on the API methods
and their parameters, refer to [Syngrisi Core API Documentation](TODO: fill url).

### Installation

Install the package with npm:

```shell
npm install @syngrisi/core-api
```

## Basic Workflow

### Start Session

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

### Create Check

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

### Stop Session

After checks are completed, stop the session:

```js
// `stopResponse` will have data about the completed test.
const stopResponse = await apiClient.stopSession(sessionResponse.testId);
```

### Environment variables

`SYNGRISI_LOG_LEVEL` - logging level (`"trace" | "debug" | "info" | "warn" | "error"`)

### License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
