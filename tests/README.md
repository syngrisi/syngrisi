Syngrisi Tests
====================
Integration anf functional tests for Syngrisi. This test solution is based on
WebdriverIO [Cucumber Boilerplate project](https://github.com/webdriverio/cucumber-boilerplate)

## Quick Start

```shell script
npm i 
npm test                        # to run all tests in headless mode
npm run testui                  # to run all tests in normal mode
npx wdio --spec <path to spec>  # run particular spec
```

## Useful methods

`fillCommonPlaceholders` - replace some placeholders (substring with angle brackets like: <someplaceholders>) to the
generated value. There is two types of placeholders: `common` and `stored`

- Common - just replace the placeholder to some generated value e.g.:
    - `YYYY-MM-DD` - generate data to the corresponding format;
    - `Email` - generate random email
    - `Uuid` - generate `Uuid`
      For more details look at `fillCommonPlaceholders` function in common.js

- `Store` - replace the placeholders that contain colon e.g.: <post: _id> (when user is the item name and name is the
  item property) to some item property that was stored in som of previous steps,
  using `this.saveItem(itemType, itemObject);` method

## Environment variables

`STREAMS` - number of browser instance
`RETRY` - number of retries
`DOCKER` - run test in docker-compose when equal `1`
