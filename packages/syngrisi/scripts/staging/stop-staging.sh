#!/bin/bash

# Stop Staging Server
# This script stops the staging Syngrisi server gracefully

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STAGING_PORT="5252"

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Main execution
main() {
    echo ""
    log_info "Stopping staging server..."
    echo ""

    local PID=$(lsof -ti:${STAGING_PORT} 2>/dev/null || true)

    if [ -z "${PID}" ]; then
        log_warn "No staging server running on port ${STAGING_PORT}"
        exit 0
    fi

    log_info "Found server process (PID: ${PID})"

    # Try graceful shutdown
    log_info "Sending SIGTERM..."
    kill -TERM "${PID}" 2>/dev/null || true

    # Wait up to 10 seconds for graceful shutdown
    for i in {1..10}; do
        if ! kill -0 "${PID}" 2>/dev/null; then
            log_info "✓ Server stopped gracefully"
            exit 0
        fi
        sleep 1
    done

    # Force kill if still running
    log_warn "Server didn't stop gracefully, forcing shutdown..."
    kill -KILL "${PID}" 2>/dev/null || true
    sleep 1

    if ! kill -0 "${PID}" 2>/dev/null; then
        log_info "✓ Server stopped (forced)"
        exit 0
    else
        log_error "Failed to stop server"
        exit 1
    fi
}

main "$@"
