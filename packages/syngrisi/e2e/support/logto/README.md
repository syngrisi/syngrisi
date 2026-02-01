# Logto Integration Support

This directory contains scripts and configuration to run a local Logto instance for End-to-End testing Syngrisi's M2M authentication.

## Prerequisites

-   **macOS**
-   **apple/container** CLI installed (https://github.com/apple/containerization)
-   **Node.js** (for IP discovery helper)

Ensure the container service is running:

```bash
container system start
```

## Usage

### Start Infrastructure

Starts Postgres and Logto containers in a dedicated network (`syngrisi-logto-net`).

```bash
./start-containers.sh
```

This script will:

1. Create the network.
2. Start Postgres (`syngrisi-logto-db`).
3. Seed the database using Logto CLI.
4. Start Logto (`syngrisi-logto-app`).
5. Wait for Logto to be healthy.

### Stop Infrastructure

Stops and removes the containers and network.

```bash
./stop-containers.sh
```

## Setup Script

`setup-logto.ts` is designed to be run _after_ the infrastructure is up to provision the M2M application via Logto's Management API.

_(Work in progress: The script currently checks for health but needs M2M provisioning logic implementation)_
