## Cucumber Viewport Logger Service for WebdriverIO

This service adds the possibility to log your Cucumber steps and other debug info directly to your browser window in
your WebriverIO-based solution. Especially useful it can be in cases using devices or virtual machines without direct 
*physical* access to them and the possibility to set up an interactive session for deep debugging your e2e tests.

![demo](https://github.com/viktor-silakov/wdio-cucumber-viewport-logger-service/raw/main/img/demo.gif)

### Quick Start

Install the package:

```bash
npm install wdio-cucumber-viewport-logger-service --save-dev
```

Add service to your `services` config section, e.g.:

```js
  services: [
    //...
    'cucumber-viewport-logger',
    //...
]
```

### Service options

| Option  | Description | Type |Default value |
| --- | --- | --- | --- |
| `numberOfSteps`  | the number of steps that will be present on the viewport  | number |3 |
| `enabled`  | enable/disable the service | boolean |true |
| `styles`  | CSS styles for logger wrapper, *step keyword* and *step text*, see the example below  | object |{} |

```js
// wdio.conf.js
exports.config = {
    // ...
    services: [
        ['cucumber-viewport-logger', {
            numberOfSteps: 5,
            enabled: process.env.VP_LOGGER === '1', // service will be enabled only when you set `VP_LOGGER` enviroment variable to `1`
            // set CSS custom styles for particular elements
            styles: {
                wrapper: { backgroundColor: 'white' },
                keyword: { color: 'red' },
                text: {
                    fontSize: '30px',
                    color: 'green',
                },
                closeButton: {
                    color: 'red',
                },
            },
        },]
    ]
    // ...
};
```

### API

> `logToViewport(message, styles)` - render custom message with custom CSS style (not mandatory), you can use this in your step definitions
e.g.:
>```js
>When(/^I render message: "([^"]*)"$/, { timeout: 120000 }, function (message) {
>    browser.logToViewport(message, { text: { color: 'green' } });
>});
>```


> `removeViewportLogMessage()` - remove viewport messages section, can be useful for example to do a visual assertion

### pointerEvents: 'none'

By default, all mouse events (clicking, hovering, etc.) go through the message section, for example: instead of clicking on the message section  your click "pass" to the element next to the message (your app element), if you wish to change this behavior set wrapper style 'pointerEvents' option to 'auto', eq:
```js

/ wdio.conf.js
exports.config = {
    // ...
    services: [
        ['cucumber-viewport-logger', {
     
            styles: {
                wrapper: { pointerEvents: 'auto' },
            },
        },]
    ]
    // ...
};
```

