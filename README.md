# Syngrisi - Visual Testing Tool

Syngrisi helps to implement Automated Visual Regression Testing along with your new or existing Test Automation Kit, it
provides API for Test Automated solutions and a convenient UI tool to review and Visual Test data.

## Prerequisites

* [NodeJS](https://nodejs.org/en/download/) `v14.16` or above, it is preferably to
  use [nvm](https://github.com/nvm-sh/nvm);
* [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)

## Quick start

> ⚠️ Make sure MongoDB started before run Syngrisi

Clone this project:

```shell script
git clone git@github.com:viktor-silakov/syngrisi.git
```

Go to application folder and install Dependencies

```shell script
npm install
```

Run Syngrisi server

```shell script
npm start
```

## Example Project Based on Syngrisi

You can set up the [example TA Solution](https://github.com/viktor-silakov/syngrisi-cucumber-example) based
on [WebdriverIO Cucumber Boilerplate](https://github.com/webdriverio/cucumber-boilerplate) project, it also can be good
point to start new TA project from scratch.

## Features

* Pix-to-pix comparison
* Perceptual comparison:
    * Vertical Offset stabilization
    * Ignore Alpha
    * Ignore Colors
    * Ignore Antialiasing
* Ignore regions
* Works with data hashes that allows quickly perform comparison action.
* Affected elements analyse based on DOM dump and diff image.
* UI panel to observe results and manage test data (baselines, regions, test, suites, runs. etc.) )

## Clear database and screenshots files

```shell script
npm run clear
```

## Environment variables

| Variable      | Host | Container |Description | Default Value |
| ------------- | ------------- |---------------- |------------- | ------------- |
| `SYNGRISI_DOCKER_IMAGES_PATH`  | - | + | Docker internal folder for Syngrisi Images (screenshots and diffs)   | `./baselines` |
| `SYNGRISI_DOCKER_PORT`         | - | + | Docker external Syngrisi App Server Port (host port) | `5000` |
| `SYNGRISI_DB_DOCKER_PORT`      | - | + | Docker external Syngrisi Database Server Port (host port) | `27017` |
| `SYNGRISI_DOCKER_DB_AUTH_ARG`  | - | + | To enable mongo database authentication set it to `--auth` be sure that you create user for VRSdb database and add appropriate values to connection string | `--noauth` |
| `SYNGRISI_IMAGES_PATH`         | + | + | Put the identical Variable from above section from host to container  |`./baselines/`|
| `SYNGRISI_DOCKER_BACKUPS_PATH` | - | + | Host Backup Folder path  |./backups/ |
| `SYNGRISI_AUTH`                | + | + | Put the identical Variable from above section from host to container  | `1` |
| `SYNGRISI_DB_URI`              | + | + | [Connection URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for Mongo DB service  | `mongodb://localhost:27017/VRSdb` || `mongodb://syngrisi-db/VRSdb` |
| `MONGODB_ROOT_USERNAME`        | - | + | Username for the Database Root user, that will be created at first Applications start   | - |
| `MONGODB_ROOT_PASSWORD`        | - | + | Password for the Database Root user, that will be created at first Applications start   | - |
| `SYNGRISI_DOCKER_DB_PATH`      | - | + |  Host Path to Syngrisi Database files   | `./data/db_data` |
| `LOGLEVEL`                     | + | - | log level (`error`|`warn`|`info`|`verbose`|`debug`|`silly`) default   | `debug` |
| `PAGE_SIZE`                    | + | - | number of tests items on that return `/checks?page={page_num}` API   | `50` |
| `SYNGRISI_APP_PORT`            | + | - | tcp port for application server |`3000`|
| `SYNGRISI_TEST_MODE`           | + | - | enables test admin user if equal `1`, used only for tests purposes   | `0` |

