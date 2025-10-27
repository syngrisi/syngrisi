# Syngrisi Tests

Integration anf functional tests for Syngrisi. This test solution is based on
WebdriverIO [Cucumber Boilerplate project](https://github.com/webdriverio/cucumber-boilerplate)

## Quick Start

```shell
nvm use v14.20.0
npm install
npm test                        # to run all tests in headless mode
npm run testui                  # to run all tests in normal mode
npx wdio --spec <path to spec>  # run particular spec

```

Run tests with custom server Nodejs path

```shell
SYNGRISI_TEST_SERVER_NODE_PATH=$(nvm which v20.19.2) npx wdio --spec features/AUTH/login_smoke.feature
```

## Chrome 118

Local runs require a Chrome 118 binary. Download it with `@puppeteer/browsers` and store the path in `.env`.

1. Temporarily switch to a modern Node runtime (for example `nvm use v20.19.2`). Node 14 cannot parse the syntax used by the `@puppeteer/browsers` CLI.
2. Install the browser build:

    ```bash
    npx @puppeteer/browsers install chrome@118 --path packages/syngrisi/chrome --platform mac-arm64
    ```

    The command prints the absolute path to the downloaded executable.

3. Create `packages/syngrisi/tests/.env` (see the sample below) and assign that path to `CHROME_BINARY`. WDIO reads the value and injects it into `goog:chromeOptions.binary`.
4. Switch back to Node 14 before running the tests: `nvm use v14.20.0` and reinstall node modules if you had a different version active (`npm install`).

`CHROME_BINARY` must be an absolute path. Example:

```env
CHROME_BINARY=/Users/<user>/Projects/syngrisi/packages/syngrisi/chrome/mac_arm-118.0.5993.70/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
```

Update the `.env` value if the binary lives elsewhere.

## Useful methods

`fillCommonPlaceholders` - replace some placeholders (substring with angle brackets like: <someplaceholders>) to the
generated value. There is two types of placeholders: `common` and `stored`

-   Common - just replace the placeholder to some generated value e.g.:

    -   `YYYY-MM-DD` - generate data to the corresponding format;
    -   `Email` - generate random email
    -   `Uuid` - generate `Uuid`
        For more details look at `fillCommonPlaceholders` function in common.js

-   `Store` - replace the placeholders that contain colon e.g.: <post: \_id> (when user is the item name and name is the
    item property) to some item property that was stored in som of previous steps,
    using `this.saveItem(itemType, itemObject);` method

## Environment variables

`STREAMS` - number of browser instance
`RETRY` - number of retries
`DOCKER` - run test in docker-compose when equal `1`, this need to be sure that docker-compose option works properly (e.g.: the image in dockerfile was updated), this operation cannot be paralleled at this time and takes a lot of time, also there is a few features that nor working with docker that marked with the `@exclude_docker` tag
