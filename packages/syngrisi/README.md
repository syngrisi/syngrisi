# Syngrisi - Visual Testing Tool

Syngrisi helps to implement Automated Visual Regression Testing along with your new or existing Test Automation Kit, it
provides API for Test Automated solutions and a convenient UI tool to review and Visual Test data.

## Prerequisites

There are two modes in which we could run Syngrisi:

- Native mode: When you run this with nodejs on your OS, it's usually fine to run the application on the local system.
- Container mode: using docker and docker-compose, this is more suitable for production use.

### Native Mode

* [NodeJS](https://nodejs.org/en/download/) `v14.20` or above, it is preferably to
  use [nvm](https://github.com/nvm-sh/nvm);
* [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) `7.0` or above

### Container Mode

* [Docker + Docker Compose](https://docs.docker.com/engine/install/)

## Quick start

https://user-images.githubusercontent.com/23633060/225095007-39ee0a29-61c1-4f46-99ab-1af67052accb.mp4

### Native Mode

Install in current folder

```bash
npm init sy@latest
```

Install in certain folder

```bash
npm init sy@latest <path_to_syngrisi>
```

See more details about set up customization in [create-sy](../create-sy) package documentation

> ⚠️ Make sure MongoDB started before run Syngrisi

Run the server

```shell script
npx sy
```

### Container Mode

Besides running the application natively, you can also launch it in a Docker container using a Docker Compose file. This
script facilitates the download and execution of such file from this repository.

```bash
# check if docker-compose installed
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required, please install and run it again"; exit 1; }

mkdir my_new_syngrisi_project && cd my_new_syngrisi_project
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/syngrisi-app.dockerfile
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/docker-compose.yml
sudo docker-compose up
```

You're free to modify the Docker Compose file based on your requirements. Be sure to properly set up service definitions
and options, otherwise, services might not operate as desired.

Environment variables in Docker Compose can be set in an environment file or directly in the shell. For more details on
configuration, please refer to the following documentation.

```shell script
sudo docker-compose up
```

## Syngrisi Cucumber Boilerplate

You can set up
the [Syngrisi Cucumber Boilerplate project](https://github.com/syngrisi/syngrisi-cucumber-boilerplate) with
pre-defined Functional and Visual Syngrisi checks steps.

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

## Configuration via Environment Variables

Environment variables are used to modify the behavior of the Syngrisi without code changes.
The System Environment variables have priority more than correspondent Syngrisi Admin Settings if they exist.
Example: To set the log level to debug, use the following command:

Windows:`set SYNGRISI_LOG_LEVEL=debug`
macOS/Linux: `export SYNGRISI_LOG_LEVEL=debug`

You can also include the variables in your `.env` or modify variables in `docker-compose.yml` file before start Syngrisi
service.

| Variable                       | Host | Docker | Description                                                                                                                                                       | Default Value                          |
|--------------------------------|------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `SYNGRISI_DOCKER_IMAGES_PATH`  | -    | +      | Docker internal folder for Syngrisi Images (screenshots and diffs)                                                                                                | `./.snapshots-images`                  |
| `SYNGRISI_DOCKER_PORT`         | -    | +      | Docker external Syngrisi App Server Port (host port)                                                                                                              | `5000`                                 |
| `SYNGRISI_DOCKER_DB_PORT`      | -    | +      | Docker external Syngrisi Database Server Port (host port)                                                                                                         | `27017`                                |
| `SYNGRISI_DOCKER_DB_AUTH_ARG`  | -    | +      | To enable mongo database authentication set it to `--auth` be sure that you create user for `SyngrisiDb` database and add appropriate values to connection string | `--noauth`                             |
| `SYNGRISI_DOCKER_BACKUPS_PATH` | -    | +      | Host Backup Folder path                                                                                                                                           | ./backups/                             |
| `SYNGRISI_DOCKER_DB_PATH`      | -    | +      | Host Path to Syngrisi Database files                                                                                                                              | `./data/db_data`                       |
| `SYNGRISI_DB_URI`              | +    | +      | [Connection URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for Mongo DB service                                                           | `mongodb://127.0.0.1:27017/SyngrisiDb` |
| `SYNGRISI_IMAGES_PATH`         | +    | +      | Put the identical Variable from above section from host to container                                                                                              | `./.snapshots-images/`                 |
| `SYNGRISI_APP_PORT`            | +    | -      | TCP port for application server                                                                                                                                   | `3000`                                 |
| `SYNGRISI_AUTH`                | +    | +      | Put the identical Variable from above section from host to container                                                                                              | `1`                                    |
| `MONGODB_ROOT_USERNAME`        | -    | +      | Username for the Database Root user, that will be created at first Applications start                                                                             | -                                      |
| `MONGODB_ROOT_PASSWORD`        | -    | +      | Password for the Database Root user, that will be created at first Applications start                                                                             | -                                      |
| `LOGLEVEL`                     | +    | -      | Log level (`error` `warn`,`info`,`verbose`,`debug`,`silly`)                                                                                                       | `debug`                                |
| `SYNGRISI_PAGINATION_SIZE`     | +    | -      | Number of tests items on that return `/checks?page={page_num}` API                                                                                                | `50`                                   |
| `SYNGRISI_TEST_MODE`           | +    | +      | Enables test admin user if equal `1`, used only for tests purposes                                                                                                | `0`                                    |
| `SYNGRISI_DISABLE_FIRST_RUN`   | +    | +      | Disable first run procedure, disabled if equal `1`, used only for tests purposes                                                                                  | `0`                                    |
| `SYNGRISI_DISABLE_DEV_CORS`    | +    | -      | Disable CORS for vite dev server, only for dev and test purposes                                                                                                  | `-`                                    |
| `SYNGRISI_SESSION_STORE_KEY`   | +    | +      | A Secret for session storage                                                                                                                                      | random generated                       |
| `SYNGRISI_COVERAGE`            | +    | -      | Enable coverage, if `true` generated coverage data to `./coverage`                                                                                                | -                                      |
| `SYNGRISI_HTTP_LOG`            | +    | +      | Enable HTTP logs, if `true` logging all HTTP request to `./logs/http.log` file                                                                                    | `false`                                |

## Devices list

There is [list](./static/data/custom_devices.json) of known devices (given from browserstack), the Application is set
the platform
icon based on this list, do not edit this file, if you want to add your own devices, just add another file with
name `custom_devices.json`, the data will be appended to the main list.
