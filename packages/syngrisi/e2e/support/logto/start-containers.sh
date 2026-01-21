#!/bin/bash
set -e

# Logto Integration Test Infrastructure using apple/container
# Adapted from SSO tests

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POSTGRES_CONTAINER="syngrisi-logto-db"
LOGTO_CONTAINER="syngrisi-logto-app"
LOGTO_NETWORK="syngrisi-logto-net"

# Ports
POSTGRES_PORT="${LOGTO_POSTGRES_PORT:-5434}" # Different from SSO test port (5433)
LOGTO_PORT="${LOGTO_PORT:-3003}"             # Different from SSO test port (3001)
LOGTO_ADMIN_PORT="${LOGTO_ADMIN_PORT:-3004}" # Different from SSO test port (3050)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_container_cli() {
    if ! command -v container &> /dev/null; then
        log_error "Apple container CLI not found."
        exit 1
    fi
}

cleanup_containers() {
    log_info "Cleaning up old containers..."
    container delete -f "$POSTGRES_CONTAINER" 2>/dev/null || true
    container delete -f "$LOGTO_CONTAINER" 2>/dev/null || true
    container network delete "$LOGTO_NETWORK" 2>/dev/null || true
}

create_network() {
    log_info "Creating network..."
    container network create "$LOGTO_NETWORK" 2>/dev/null || true
}

wait_for_port() {
    local host=$1; local port=$2; local max_attempts=60; local attempt=1
    log_info "Waiting for $host:$port..."
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then return 0; fi
        sleep 1; ((attempt++))
    done
    return 1
}

get_container_ip() {
    local name=$1
    container inspect "$name" | node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
        const info = Array.isArray(data) ? data[0] : data;
        if (info.networks && info.networks[0]?.address) {
            console.log(info.networks[0].address.split('/')[0]);
        } else {
             console.log(info.networkSettings?.ipAddress || info.NetworkSettings?.IPAddress || '');
        }
    " 2>/dev/null
}

start_postgres() {
    log_info "Starting Postgres..."
    container run -d --name "$POSTGRES_CONTAINER" --network "$LOGTO_NETWORK" \
        -p "${POSTGRES_PORT}:5432" \
        -e POSTGRES_USER=logto -e POSTGRES_PASSWORD=logto -e POSTGRES_DB=logto \
        postgres:14-alpine
}

seed_database() {
    local db_host=$1; local db_port=5432
    local db_url="postgres://logto:logto@${db_host}:${db_port}/logto"
    log_info "Seeding database..."
    container run --rm --name "logto-seed-temp" --network "$LOGTO_NETWORK" \
        -e DB_URL="$db_url" --entrypoint "npm" \
        ghcr.io/logto-io/logto:latest \
        run cli db seed -- --swe
}

start_logto() {
    local db_host=$1; local db_port=5432
    local db_url="postgres://logto:logto@${db_host}:${db_port}/logto"
    log_info "Starting Logto..."
    container run -d --name "$LOGTO_CONTAINER" --network "$LOGTO_NETWORK" \
        -p "${LOGTO_PORT}:3001" -p "${LOGTO_ADMIN_PORT}:3002" \
        -e DB_URL="$db_url" \
        -e ENDPOINT="http://localhost:${LOGTO_PORT}" \
        -e ADMIN_ENDPOINT="http://localhost:${LOGTO_ADMIN_PORT}" \
        -e PORT=3001 -e ADMIN_PORT=3002 \
        -e TRUST_PROXY_HEADER=true \
        ghcr.io/logto-io/logto:latest
}

wait_for_logto() {
    local attempt=1; local max_attempts=120
    log_info "Waiting for Logto health..."
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "http://localhost:${LOGTO_PORT}/oidc/.well-known/openid-configuration" >/dev/null; then
            log_info "Logto is ready!"
            return 0
        fi
        sleep 2; ((attempt++))
    done
    return 1
}

main() {
    check_container_cli
    cleanup_containers
    create_network
    start_postgres
    
    wait_for_port "localhost" "$POSTGRES_PORT"
    sleep 3 # Give PG a moment
    
    DB_HOST=$(get_container_ip "$POSTGRES_CONTAINER")
    if [ -z "$DB_HOST" ]; then log_error "No IP for Postgres"; exit 1; fi
    
    seed_database "$DB_HOST"
    start_logto "$DB_HOST"
    
    wait_for_logto
    
    log_info "Logto Ready: http://localhost:${LOGTO_PORT}"
    log_info "Admin: http://localhost:${LOGTO_ADMIN_PORT}"
}

main "$@"
