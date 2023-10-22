# Syngrisi Starter Toolkit

This is a command line utility for creating and installing a new Syngrisi project with all the necessary configurations and dependencies, allowing you to get started quickly.

## Usage

Set up a new Syngrisi project in the current path

```bash
npm init sy@latest
```

## CLI options
The command accepts the following options:

`DIRECTORY` - The directory where to install the new Syngrisi project. If not provided, the current working directory will be used.

`-f, --force` - Force the installation even if the pre-install checks (like Docker, MongoDB, and Node version checks) fail.

`-y, --yes` - Automatically confirm the installation.

`--npmTag` - Specifies the version tag of the Syngrisi package to be installed. If not given, the latest version is installed.

`--help` - Show the usage information and exit.
For example:

```bash
npm init sy my-app-dir -- -f -y
```

This command create a new Syngrisi project in the `my-app-dir` directory, ignoring any potential pre-installation checks, and automatically confirming the installation process.


