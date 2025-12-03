#!/bin/bash

# Start Staging Server
# This script starts the staging Syngrisi server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STAGING_WORKTREE_PATH="/Users/a1/Projects/SYNGRISI_STAGE"
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
    log_info "Starting staging server..."
    echo ""

    # Check if staging worktree exists
    if [ ! -d "${STAGING_WORKTREE_PATH}" ]; then
        log_error "Staging worktree not found at ${STAGING_WORKTREE_PATH}"
        log_error "Please run setup script first: ./scripts/staging-control.sh setup"
        exit 1
    fi

    # Check if port is already in use
    if lsof -Pi :${STAGING_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_error "Port ${STAGING_PORT} is already in use"
        log_error "Staging server may already be running"
        log_warn "To stop it: ./scripts/staging-control.sh stop"
        exit 1
    fi

    # Navigate to staging directory
    cd "${STAGING_WORKTREE_PATH}/packages/syngrisi"

    log_info "Starting server on http://localhost:${STAGING_PORT}"
    log_info "Working directory: ${PWD}"
    echo ""
    log_warn "Press Ctrl+C to stop the server"
    echo ""

    # Start the server
    npm start
}

main "$@"
