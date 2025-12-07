# @syngrisi/syngrisi

## 2.4.1

### Patch Changes

-   [`7bd73c3`](https://github.com/syngrisi/syngrisi/commit/7bd73c374cd098258d33da453fca352ccd6aeeee) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - ### CI/E2E Improvements

    -   Add yarn and Playwright browser caching for faster CI runs
    -   Stabilize flaky E2E tests with proper waits and API synchronization
    -   Add JSON/HTML reporters and comprehensive artifact uploads
    -   Add manual E2E test workflow

    ### Docker/MongoDB

    -   Upgrade MongoDB to 8.0 with configurable version via MONGODB_VERSION env
    -   Fix healthcheck to work with auth enabled
    -   Remove obsolete docker-compose version attribute

    ### Documentation

    -   Update system requirements: Node.js v22.19.0, MongoDB 8.0

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@2.4.1
