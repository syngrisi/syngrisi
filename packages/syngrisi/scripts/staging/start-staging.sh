#!/bin/bash

# Start Staging Server
# This script starts the staging Syngrisi server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
STAGING_ENV_FILE="${REPO_ROOT}/.env.staging"
STAGING_ENV_EXAMPLE="${REPO_ROOT}/.env.staging.example"

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

ensure_env_loaded() {
    if [ ! -f "${STAGING_ENV_FILE}" ]; then
        log_error "Staging env file not found: ${STAGING_ENV_FILE}"
        log_error "Create it (cp ${STAGING_ENV_EXAMPLE} ${STAGING_ENV_FILE}) and fill in values"
        exit 1
    fi

    set -o allexport
    # shellcheck disable=SC1090
    source "${STAGING_ENV_FILE}"
    set +o allexport

    local required_vars=(
        STAGING_WORKTREE_PATH
        STAGING_PORT
        STAGING_BASELINES_PATH
        STAGING_DB_NAME
        STAGING_MONGODB_URI
        STAGING_HOSTNAME
        STAGING_AUTH_ENABLED
        STAGING_LOG_LEVEL
        STAGING_ADMIN_PASSWORD
        STAGING_GUEST_PASSWORD
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required variable '${var}' in ${STAGING_ENV_FILE}"
            exit 1
        fi
    done

    STAGING_TMP_DIR="${STAGING_TMP_DIR:-${STAGING_WORKTREE_PATH}/packages/syngrisi/.tmp-stage}"
}

sync_env_files() {
    local env_file_path="${STAGING_WORKTREE_PATH}/packages/syngrisi/.env"
    mkdir -p "$(dirname "${env_file_path}")"
    cat > "${env_file_path}" <<EOF
NODE_ENV=production
SYNGRISI_DB_URI=${STAGING_MONGODB_URI}/${STAGING_DB_NAME}
SYNGRISI_IMAGES_PATH=${STAGING_BASELINES_PATH}
SYNGRISI_APP_PORT=${STAGING_PORT}
SYNGRISI_HOSTNAME=${STAGING_HOSTNAME}
SYNGRISI_AUTH=${STAGING_AUTH_ENABLED}
SYNGRISI_LOG_LEVEL=${STAGING_LOG_LEVEL}
SYNGRISI_TMP_DIR=${STAGING_TMP_DIR}
ADMIN_PASSWORD=${STAGING_ADMIN_PASSWORD}
GUEST_PASSWORD=${STAGING_GUEST_PASSWORD}
EOF

    local staging_env_copy="${STAGING_WORKTREE_PATH}/packages/syngrisi/.env.staging"
    cp "${STAGING_ENV_FILE}" "${staging_env_copy}"
}

# Main execution
main() {
    echo ""
    log_info "Starting staging server..."
    echo ""

    # Fix nvm/fnm conflict - unset npm_config_prefix to prevent node crashes
    unset npm_config_prefix

    ensure_env_loaded

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

    sync_env_files

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
