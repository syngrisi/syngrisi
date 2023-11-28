# Syngrisi: Visual Testing Tool <a name="about"></a>

Syngrisi is designed to facilitate automated visual regression testing. It seamlessly integrates with both new and
existing test automation kits, providing an API for automated solutions and a user-friendly UI for reviewing and
managing visual test data.

## System Prerequisites <a name="prerequisites"></a>

There are two modes in which Syngrisi can be run:

- **Native Mode:** Utilize Node.js to run Syngrisi directly on your operating system for local execution.
- **Container Mode:** Utilizing Docker and Docker Compose, this mode is more apt for production environments.

### Native Mode

* [NodeJS](https://nodejs.org/en/download/) `v20.9.0` or above.
* [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) `6.0` or above

### Container Mode

* [Docker + Docker Compose](https://docs.docker.com/engine/install/)

## Quick Start

https://user-images.githubusercontent.com/23633060/225095007-39ee0a29-61c1-4f46-99ab-1af67052accb.mp4

> 💡If you want to try Syngrisi for the first time, you can use [boilerplate projects](#boilerplates); they are installed easily and quickly and allow you to evaluate the basic capabilities of the tool.

### Native Mode Installation

To install Syngrisi in the current folder:

```bash
npm init sy@latest
```

To install to a specific folder:

```bash
npm init sy@latest <path_to_syngrisi>
```

For more details on setup customization, refer to the [create-sy](../create-sy) package documentation.

> ⚠️ Important: Ensure that MongoDB is running before starting Syngrisi in native mode.

To run the server, execute:

```shell script
npx sy
```

### Container Mode

In addition to running the application natively, it can also be launched in a Docker container using a Docker Compose
file. To download and execute Docker and Docker Compose files for Syngrisi, follow these steps:

```bash
# Check if docker-compose is installed
command -v docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required; please install it and run this command again."; exit 1; }

# Create the project folder
mkdir my_new_syngrisi_project && cd my_new_syngrisi_project

# Download Docker and Docker Compose files
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/syngrisi-app.dockerfile
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/docker-compose.yml

# Create and start services
sudo docker-compose up
```

You are free to modify the Docker Compose file according to your requirements. Ensure that service definitions and options are set up correctly; otherwise, services may not function as expected.

Environment variables for Docker Compose can be configured either in an environment file or directly in the shell. For detailed
configuration instructions, please refer to the Syngrisi documentation.

```shell script
sudo docker-compose up
```

## Syngrisi Boilerplates  <a name="boilerplates"></a>

To quickly take a look at Syngrisi or start a new automation test project, you can use one of the boilerplates:

* [Syngrisi Cucumber Boilerplate project](https://github.com/syngrisi/syngrisi-cucumber-boilerplate): the project contains all the necessary steps for functional tests + steps for visual checks.
* [Syngrisi Playwright Boilerplate](https://github.com/syngrisi/syngrisi-playwright-boilerplate): Starter project for functional Playwright tests with the ability to do visual checks based on Syngrisi

## Configuration via Environment Variables <a name="env"></a>

Customize Syngrisi's behavior effortlessly using environment variables, without any need to modify the codebase.
The System Environment variables have priority more than correspondent Syngrisi Admin Settings if they exist.
For example, to set the log level to debug, use the following command:

Windows:`set SYNGRISI_LOG_LEVEL=debug`
macOS/Linux: `export SYNGRISI_LOG_LEVEL=debug`

You can also include the variables in your `.env` or modify variables in `docker-compose.yml` file before start Syngrisi
service.

| Variable                       | Host | Docker | Description                                                                                                                                                       | Default Value                          |
|--------------------------------|------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `SYNGRISI_DOCKER_IMAGES_PATH`  | -    | +      | Path to the internal Docker folder for Syngrisi images, including screenshots and diffs.                                                                          | `./.snapshots-images`                  |
| `SYNGRISI_DOCKER_PORT`         | -    | +      | Docker external Syngrisi App Server Port (host port)                                                                                                              | `5000`                                 |
| `SYNGRISI_DOCKER_DB_PORT`      | -    | +      | Docker external Syngrisi Database Server Port (host port)                                                                                                         | `27017`                                |
| `SYNGRISI_DOCKER_DB_AUTH_ARG`  | -    | +      | To enable mongo database authentication set it to `--auth` be sure that you create user for `SyngrisiDb` database and add appropriate values to connection string | `--noauth`                             |
| `SYNGRISI_DOCKER_BACKUPS_PATH` | -    | +      | Host Backup Folder path                                                                                                                                           | ./backups/                             |
| `SYNGRISI_DOCKER_DB_PATH`      | -    | +      | Host Path to Syngrisi Database files                                                                                                                              | `./data/db_data`                       |
| `SYNGRISI_DB_URI`              | +    | +      | [Connection URI](https://www.mongodb.com/docs/manual/reference/connection-string/) for Mongo DB service                                                           | `mongodb://127.0.0.1:27017/SyngrisiDb` |
| `SYNGRISI_IMAGES_PATH`         | +    | +      | Path to the folder for Syngrisi images, including screenshots and diffs.                                                                                          | `./.snapshots-images/`                 |
| `SYNGRISI_APP_PORT`            | +    | -      | TCP port for application server                                                                                                                                   | `3000`                                 |
| `SYNGRISI_AUTH`                | +    | +      | Enables authentication                                                                                                                                            | `1`                                    |
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

## Devices list <a name="devices"></a>

Syngrisi includes a [list](./static/data/custom_devices.json) of recognized devices, sourced from BrowserStack.

The application sets the platform icon based on this list. Do not edit this file directly. If you wish to add your own devices, simply create an additional file named `custom_devices.json`; the data from this file will be appended to the main list.

## License

Syngrisi is available under the MIT License. For more details, refer to the [LICENSE](./LICENSE.md) file.

