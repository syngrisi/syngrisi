# WDIO Syngrisi Cucumber Service

The service helps integrate [WebdriverIO](https://webdriver.io/) test framework
and [Syngrisi](https://github.com/viktor-silakov/syngrisi) visual testing tool.

## Installation

```bash
npm i wdio-syngrisi-cucumber-service
```

## Configuration

In order to use the service with WebdriverIO test runner add these settings to services array:

```js
// wdio.conf.js
export.config = {
    // ...
    services: [
        ['syngrisi-cucumber',
            {
                // syngrisi server endpoint
                endpoint: `http://localhost:3000/`,
                // syngrisi API key
                apikey: process.env['SYNGRISI_API_KEY'] || '',
                // project name
                project: 'My Project',
                // the tested branch
                branch: 'master',
                // run name (will be auto generated if not present)
                runname: process.env['RUN_NAME'],
                // run name (will be auto generated if not present)
                runident: process.env['RUN_IDENT'],
                // tag for visual regression scenarios
                // for all scenarios with this tag the service will create session on syngrisi
                // if tag is empty the visual session will be created for all scenarios
                // tag: '@visual',
                // the scenarios with `excludeTag` tag will be skipped 
                // excludeTag: '@novisual'
            }
        ],
    ],
    // ...
};
```

## Usage

After all the preparations, you can use the `browser.syngrisiCheck(checkName, imageBuffer)` method in which:

* `checkName` - the name of the check in Syngrisi
* `imageBuffer` - the screenshot image buffer

