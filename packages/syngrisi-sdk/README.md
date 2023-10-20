## SDK for Syngrisi tool

### Base Flow Overview
There is 3 basic step for particular test:
![syngrisi flow](./docs/flow.png)

### Installation
```shell script
npm i @syngrisi/syngrisi-wdio-sdk --save-dev
```
### Usage Example

```javascript
const syngrisi = require('@syngrisi/syngrisi-wdio-sdk');
const vrsHost = 'localhost';
const vrsPort = 3000;
const VRSConfig = { url: `http://${vrsHost}:${vrsPort}/`};
const {remote} = require('webdriverio');

;(async () => {
    global.browser = await remote({
        capabilities: {browserName: 'chrome'}
    })
    // 0. Add Syngrisi driver to browser object
    browser.vDriver = new syngrisi.vDriver(VRSConfig);

    // 1. Start Syngrisi test session
    await browser.vDriver.startTestSession({
        app: 'Test Application',
        test: 'My first Syngrisi test',
        suite: 'My first Syngrisi suite'
    });

    await browser.navigateTo('https://www.google.com/ncr')

    // 2.1. perform visual check
    const screenshot = new Buffer(await browser.takeScreenshot(), 'base64');

    await browser.vDriver.checkSnapshot(
        'My Check',
        screenshot
    );

    const searchInput = await browser.$('[name=q]');
    await searchInput.setValue('Σύγκριση');

    const searchBtn = await browser.$('input[value="Google Search"]');
    await (searchBtn.waitForClickable())
    await searchBtn.click();

    // 2.2 perform another visual check
    const screenshot2 = new Buffer(await browser.takeScreenshot(), 'base64');

    await browser.vDriver.checkSnapshot(
        'My another Check',
        screenshot2
    );

    // 2.3 stop test Session
    await browser.vDriver.stopTestSession();

})().catch((err) => {
    log.error(err)
    throw err
}).finally(() => browser.deleteSession());
```

### Environment variables

`RUN_NAME` - use such variable to set up specific run name, by default it will generate automatically
`ENV_POSTFIX` - will add to platform property, you can use this to set some unique platform name for particular environment

### SDK API

#### vDriver class

- `vDriver(cfg)` (constructor) - initialize vDriver instance

##### Parameters

| Name | Type | Details |
|------|------|---------|
|`cfg`|`object`| e.g.: `{url: 'http://localhost:3000'}`|



- `startTestSession(params)` - starts of the test session


##### Parameters
    
| Name | Type | Details |
|------|------|---------|
|`params`|`object`| e.g: {app: 'App Name', <br>test: 'Test Name',<br>suite: 'Suite Name'}|


- `checkSnapshot(checkName, imageBuffer, domDump)` - create snapshot and send to Syngrisi API


##### Parameters
    
| Name | Type | Details |
|------|------|---------|
|`checkName`|`String`| eg.: 'Check Name'|
|`imageBuffer`|`Buffer`| File buffer|
|`domDump`|`String`| Web Page DOM Dump JSON string, to get properly dump use `getDomDump()` method  |

- `stopTestSession()` - stop of the test session

