#!/bin/bash
set -e

# SSO Test Infrastructure - Logto + Postgres via apple/container
# This script starts Postgres and Logto containers for E2E SSO testing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTGRES_CONTAINER="syngrisi-test-db-sso"
LOGTO_CONTAINER="syngrisi-test-sso"
SSO_NETWORK="syngrisi-sso-net"
POSTGRES_PORT="${LOGTO_POSTGRES_PORT:-5433}"
LOGTO_PORT="${LOGTO_PORT:-3001}"
LOGTO_ADMIN_PORT="${LOGTO_ADMIN_PORT:-3050}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if container CLI is available
check_container_cli() {
    if ! command -v container &> /dev/null; then
        log_error "Apple container CLI not found. Please install it first."
        log_info "See: https://github.com/apple/containerization"
        exit 1
    fi
}

# Cleanup old containers and network (ignore errors if they don't exist)
cleanup_containers() {
    log_info "Cleaning up old containers..."
    container delete -f "$POSTGRES_CONTAINER" 2>/dev/null || true
    container delete -f "$LOGTO_CONTAINER" 2>/dev/null || true
    container network delete "$SSO_NETWORK" 2>/dev/null || true
}

# Create network for SSO containers
create_network() {
    log_info "Creating SSO network..."
    container network create "$SSO_NETWORK" 2>/dev/null || {
        log_info "Network already exists or created"
    }
}

# Wait for a TCP port to be available
wait_for_port() {
    local host=$1
    local port=$2
    local max_attempts=${3:-60}
    local attempt=1

    log_info "Waiting for $host:$port to be available..."
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            log_info "Port $port is available!"
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    echo ""
    log_error "Timeout waiting for $host:$port after $max_attempts seconds"
    return 1
}

# Wait for Postgres to be ready (accepts connections)
wait_for_postgres() {
    local host=$1
    local port=$2
    local max_attempts=${3:-30}
    local attempt=1

    log_info "Waiting for Postgres to accept connections..."
    while [ $attempt -le $max_attempts ]; do
        # Try to connect using pg_isready equivalent via container exec
        if container exec "$POSTGRES_CONTAINER" pg_isready -U logto -d logto 2>/dev/null | grep -q "accepting connections"; then
            log_info "Postgres is ready!"
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    echo ""
    log_error "Timeout waiting for Postgres to be ready after $max_attempts seconds"
    return 1
}

# Get container IP address using Node.js for JSON parsing
get_container_ip() {
    local container_name=$1
    local ip

    ip=$(container inspect "$container_name" | node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
        // Handle different possible structures
        const info = Array.isArray(data) ? data[0] : data;
        // Apple container format: networks[0].address contains IP/subnet
        if (info.networks && info.networks[0] && info.networks[0].address) {
            // Extract IP from 'IP/subnet' format (e.g., '192.168.64.6/24')
            console.log(info.networks[0].address.split('/')[0]);
        } else {
            // Fallback to Docker-style paths
            const ip = info.networkSettings?.ipAddress ||
                       info.NetworkSettings?.IPAddress ||
                       info.NetworkSettings?.Networks?.bridge?.IPAddress ||
                       '';
            console.log(ip);
        }
    " 2>/dev/null)

    echo "$ip"
}

# Start Postgres container
start_postgres() {
    log_info "Starting Postgres container..."

    container run -d \
        --name "$POSTGRES_CONTAINER" \
        --network "$SSO_NETWORK" \
        -p "${POSTGRES_PORT}:5432" \
        -e POSTGRES_USER=logto \
        -e POSTGRES_PASSWORD=logto \
        -e POSTGRES_DB=logto \
        postgres:14-alpine

    log_info "Postgres container started"
}

# Seed the database using Logto CLI (one-time setup)
seed_database() {
    local db_host=$1
    local db_port=${2:-5432}
    local db_url="postgres://logto:logto@${db_host}:${db_port}/logto"

    log_info "Seeding Logto database..."

    # Run database seed using Logto image
    # This runs the Logto CLI to initialize the database schema
    # Apple container requires --entrypoint to override the default command
    container run --rm \
        --name "logto-seed" \
        --network "$SSO_NETWORK" \
        -e DB_URL="$db_url" \
        --entrypoint "npm" \
        ghcr.io/logto-io/logto:latest \
        run cli db seed -- --swe

    log_info "Database seeding complete"
}

# Start Logto container
start_logto() {
    local db_host=$1
    local db_port=${2:-5432}

    log_info "Starting Logto container with DB_URL pointing to $db_host:$db_port..."

    # Build the database URL
    local db_url="postgres://logto:logto@${db_host}:${db_port}/logto"

    # Start Logto container on the same network as Postgres
    # Note: Logto auto-seeds database on first run via default entrypoint
    # Note: ADMIN_ENDPOINT must use internal port (3002) for token validation inside container
    # External access is via LOGTO_ADMIN_PORT (3003)
    container run -d \
        --name "$LOGTO_CONTAINER" \
        --network "$SSO_NETWORK" \
        -p "${LOGTO_PORT}:3001" \
        -p "${LOGTO_ADMIN_PORT}:3002" \
        -e DB_URL="$db_url" \
        -e ENDPOINT="http://localhost:3001" \
        -e ADMIN_ENDPOINT="http://localhost:3002" \
        -e PORT=3001 \
        -e ADMIN_PORT=3002 \
        -e TRUST_PROXY_HEADER=true \
        ghcr.io/logto-io/logto:latest

    log_info "Logto container started"
}

# Wait for Logto health endpoint
wait_for_logto() {
    local max_attempts=${1:-120}
    local attempt=1

    log_info "Waiting for Logto to be healthy (this may take 1-2 minutes on first run)..."
    while [ $attempt -le $max_attempts ]; do
        # Try to hit the OIDC discovery endpoint
        if curl -sf "http://localhost:${LOGTO_PORT}/oidc/.well-known/openid-configuration" > /dev/null 2>&1; then
            log_info "Logto is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    echo ""
    log_error "Timeout waiting for Logto after $((max_attempts * 2)) seconds"

    # Print Logto logs for debugging
    log_info "Logto container logs:"
    container logs "$LOGTO_CONTAINER" 2>&1 | tail -50
    return 1
}

# Main execution
main() {
    log_info "Starting SSO test infrastructure..."
    log_info "Postgres port: $POSTGRES_PORT"
    log_info "Logto port: $LOGTO_PORT"
    log_info "Logto Admin port: $LOGTO_ADMIN_PORT"

    check_container_cli
    cleanup_containers
    create_network

    # Start Postgres
    start_postgres

    # Wait for Postgres port to be available
    wait_for_port "localhost" "$POSTGRES_PORT" 30

    # Wait for Postgres to fully initialize
    sleep 3
    wait_for_postgres "localhost" "$POSTGRES_PORT" 30 || {
        # Fallback: just wait a bit more if pg_isready doesn't work
        log_warn "pg_isready check failed, waiting additional time..."
        sleep 5
    }

    # Get Postgres connection info
    # Apple container does not support DNS resolution between containers yet
    # So we use the IP address directly instead of hostname
    DB_HOST=$(get_container_ip "$POSTGRES_CONTAINER")
    DB_PORT="5432"

    if [ -z "$DB_HOST" ]; then
        log_error "Failed to get Postgres container IP address"
        exit 1
    fi

    log_info "Postgres IP: $DB_HOST:$DB_PORT (via shared network)"

    # Seed the database using Logto CLI
    seed_database "$DB_HOST" "$DB_PORT"

    # Start Logto
    start_logto "$DB_HOST" "$DB_PORT"

    # Wait for Logto to be ready
    wait_for_logto 120

    log_info "============================================"
    log_info "SSO Infrastructure is ready!"
    log_info "============================================"
    log_info "Logto URL:       http://localhost:${LOGTO_PORT}"
    log_info "Logto Admin:     http://localhost:${LOGTO_ADMIN_PORT}"
    log_info "OIDC Discovery:  http://localhost:${LOGTO_PORT}/oidc/.well-known/openid-configuration"
    log_info "============================================"

    # Run provisioning script to configure Logto unless explicitly skipped
    if [ "${E2E_LOGTO_SKIP_PROVISIONING}" = "true" ]; then
        log_warn "E2E_LOGTO_SKIP_PROVISIONING=true, skipping provisioning script"
    else
        if [ -f "${SCRIPT_DIR}/provision-logto-api.sh" ]; then
            log_info "Running provisioning script..."
            "${SCRIPT_DIR}/provision-logto-api.sh"
        else
            log_warn "Provisioning script not found, skipping auto-configuration"
            echo ""
            echo "# Environment variables for Syngrisi SSO configuration:"
            echo "export LOGTO_ENDPOINT=http://localhost:${LOGTO_PORT}"
            echo "export LOGTO_ADMIN_ENDPOINT=http://localhost:${LOGTO_ADMIN_PORT}"
        fi
    fi
}

main "$@"
