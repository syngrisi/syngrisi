# Syngrisi: Visual Testing Tool <a name="about"></a>

Syngrisi is designed to facilitate automated visual regression testing. It seamlessly integrates with both new and
existing test automation kits, providing an API for automated solutions and a user-friendly UI for reviewing and
managing visual test data.

## Try with a Single-Click

To quickly preview the project without setting it up locally, click the 'Open in Gitpod' button. Gitpod will automatically set up an environment, install the [Syngrisi Cucumber Boilerplate Project](https://github.com/syngrisi/syngrisi-cucumber-boilerplate), and launch the Syngrisi instance for you.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/syngrisi/syngrisi-cucumber-boilerplate)

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

> [!TIP] 
> If you want to try Syngrisi for the first time, you can use [boilerplate projects](#boilerplates); they are installed easily and quickly and allow you to evaluate the basic capabilities of the tool.

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

> [!IMPORTANT]
> Ensure that MongoDB is running before starting Syngrisi in **native** mode.

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

More details on environment variables are available in the [docs/environment_variables.md](docs/environment_variables.md) file.

## API documentation

To view the OpenAPI documentation, use Swagger. The documentation is available at:

Swagger UI: `http://your-domain/swagger/`

Swagger JSON: `http://your-domain/swagger/json`

## Devices list <a name="devices"></a>

Syngrisi includes a [list](./static/data/custom_devices.json) of recognized devices, sourced from BrowserStack.

The application sets the platform icon based on this list. Do not edit this file directly. If you wish to add your own devices, simply create an additional file named `custom_devices.json`; the data from this file will be appended to the main list.

## Development

- Clone the repository and go to the Syngrisi package folder.

    ```sh
    git clone git@github.com:syngrisi/syngrisi.git
    cd syngrisi/packages/syngrisi/
    ```
- Build the project

    ```sh
    npm run build
    ```
- Copy `.env.template` to `.env` and set your own variables id needed

    ```sh
    cp .env.template .env
    ```
- Install dependensies 
    ```sh
    npm run install:all
    ```
- Start the application 

    ```sh
    npm start
    ```

## License

Syngrisi is available under the MIT License. For more details, refer to the [LICENSE](./LICENSE.md) file.


