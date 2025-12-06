#!/bin/bash
set -e

# SSO Test Infrastructure - Stop and cleanup containers

POSTGRES_CONTAINER="syngrisi-test-db-sso"
LOGTO_CONTAINER="syngrisi-test-sso"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Check if container CLI is available
check_container_cli() {
    if ! command -v container &> /dev/null; then
        log_warn "Apple container CLI not found, skipping cleanup"
        exit 0
    fi
}

# Stop and remove containers
cleanup() {
    log_info "Stopping and removing SSO containers..."

    # Stop Logto first (depends on Postgres)
    if container inspect "$LOGTO_CONTAINER" &>/dev/null; then
        log_info "Stopping Logto container..."
        container stop "$LOGTO_CONTAINER" 2>/dev/null || true
        container delete -f "$LOGTO_CONTAINER" 2>/dev/null || true
        log_info "Logto container removed"
    else
        log_info "Logto container not found, skipping"
    fi

    # Then stop Postgres
    if container inspect "$POSTGRES_CONTAINER" &>/dev/null; then
        log_info "Stopping Postgres container..."
        container stop "$POSTGRES_CONTAINER" 2>/dev/null || true
        container delete -f "$POSTGRES_CONTAINER" 2>/dev/null || true
        log_info "Postgres container removed"
    else
        log_info "Postgres container not found, skipping"
    fi

    log_info "SSO infrastructure cleanup complete"
}

# Main execution
main() {
    check_container_cli
    cleanup
}

main "$@"
