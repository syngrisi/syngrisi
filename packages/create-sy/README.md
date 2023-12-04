# Syngrisi Project Initializer

This command line tool is for creating and installing a new Syngrisi project with required configurations and
dependencies, allowing you to get started quickly.

## Prerequisites

This initializer is for installing Syngrisi in native mode, therefore you need `Node.js >= v20.9.0`and `MongoDB >= 7.0` or remote MongoDB instance. If you want to install a dockerized Syngrisi service, please read the [Syngrisi documentation](https://github.com/syngrisi/syngrisi/tree/main/packages/syngrisi#readme).

## Usage

To install a new Syngrisi project in the current directory, run:

```bash
npm init sy@latest
```

## CLI options

The installation command supports the following options:

`DIRECTORY` - The directory where your Syngrisi project will be installed. The default is the current working directory if this option is omitted.

`-f, --force` - Ignore pre-install checks (Docker, MongoDB, Node.js versions) and force the installation.

`-y, --yes` - Automatically confirm the installation.

`--npmTag` - Determine the Syngrisi package version to install. Defaults to the latest version when not specified.

`--help` - Display help information and exit.

Example:

```bash
npm init sy my-app-dir -- -f -y
```

This command initializes a Syngrisi project in my-app-dir, bypassing pre-install checks and confirming prompts
automatically.



