#!/bin/bash

# Reset Staging Environment to Initial Production State
# This script resets the staging database and images to their initial state

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
        STAGING_DB_NAME
        STAGING_PORT
        STAGING_PROD_DATA_PATH
        STAGING_DATA_REPO_PATH
        STAGING_MONGODB_URI
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required variable '${var}' in ${STAGING_ENV_FILE}"
            exit 1
        fi
    done

    STAGING_TMP_DIR="${STAGING_TMP_DIR:-${STAGING_WORKTREE_PATH}/packages/syngrisi/.tmp-stage}"
}

stop_staging_server() {
    log_info "Checking if staging server is running..."

    local PID
    PID=$(lsof -ti:"${STAGING_PORT}" 2>/dev/null || true)

    if [ -z "${PID}" ]; then
        log_info "No staging server running on port ${STAGING_PORT}"
        return 0
    fi

    log_warn "Staging server is running (PID: ${PID}), stopping it..."

    # Try graceful shutdown
    kill -TERM "${PID}" 2>/dev/null || true

    # Wait up to 5 seconds for graceful shutdown
    for i in {1..5}; do
        if ! kill -0 "${PID}" 2>/dev/null; then
            log_info "✓ Server stopped gracefully"
            return 0
        fi
        sleep 1
    done

    # Force kill if still running
    log_warn "Server didn't stop gracefully, forcing..."
    kill -KILL "${PID}" 2>/dev/null || true
    sleep 1

    if ! kill -0 "${PID}" 2>/dev/null; then
        log_info "✓ Server stopped (forced)"
    else
        log_error "Failed to stop server"
        exit 1
    fi
}

reset_database() {
    log_info "Resetting staging database..."

    # Check if MongoDB is accessible
    if ! mongosh --quiet --eval "db.version()" "${STAGING_MONGODB_URI}" &>/dev/null; then
        log_error "MongoDB is not running or not accessible"
        exit 1
    fi

    # Drop staging database
    log_info "Dropping ${STAGING_DB_NAME} database..."
    mongosh --quiet --eval "db.dropDatabase()" "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}" &>/dev/null

    # Restore from production dump
    log_info "Restoring database from production dump..."
    log_warn "This may take several minutes..."

    if mongorestore --uri "${STAGING_MONGODB_URI}" \
        --gzip \
        --drop \
        --db "${STAGING_DB_NAME}" \
        "${STAGING_PROD_DATA_PATH}" 2>&1 | grep -v "continuing through error"; then
        log_info "✓ Database restored successfully"
    else
        log_error "Failed to restore database"
        exit 1
    fi

    # Show collection stats
    local COLLECTIONS
    COLLECTIONS=$(mongosh --quiet --eval "db.getCollectionNames().join(', ')" "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}")
    log_info "Collections: ${COLLECTIONS}"
}

reset_baseline_images() {
    log_info "Resetting baseline images to latest committed state..."

    cd "${STAGING_DATA_REPO_PATH}"

    # Check if we're in a git repo
    if [ ! -d ".git" ]; then
        log_error "Not a git repository: ${STAGING_DATA_REPO_PATH}"
        exit 1
    fi

    # Reset to HEAD (latest commit)
    log_info "Resetting to HEAD (latest commit)..."
    git reset --hard HEAD &>/dev/null || {
        log_error "Failed to reset git repository to HEAD"
        exit 1
    }
    log_info "✓ Git reset successful"

    # Clean untracked files
    log_info "Cleaning untracked files..."
    git clean -fd &>/dev/null
    log_info "✓ Untracked files cleaned"

    # Show current commit
    local COMMIT=$(git log -1 --oneline)
    log_info "Current commit: ${COMMIT}"
}

clean_temp_files() {
    log_info "Cleaning staging temporary files..."

    local TMP_DIR="${STAGING_TMP_DIR}"
    local LOGS_DIR="${STAGING_WORKTREE_PATH}/packages/syngrisi/logs"

    if [ -d "${TMP_DIR}" ]; then
        rm -rf "${TMP_DIR}"/*
        log_info "✓ Temporary directory cleaned"
    fi

    if [ -d "${LOGS_DIR}" ]; then
        rm -rf "${LOGS_DIR}"/*
        log_info "✓ Logs directory cleaned"
    fi
}

print_success_message() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       Staging Environment Reset Complete!                      ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Database:${NC} Reset to production state"
    echo -e "${GREEN}Images:${NC} Reset to latest commit (HEAD)"
    echo -e "${GREEN}Temp Files:${NC} Cleaned"
    echo ""
    echo -e "${GREEN}To start staging server:${NC}"
    echo "  ./scripts/staging-control.sh start"
    echo ""
    echo -e "${GREEN}Or manually:${NC}"
    echo "  cd ${STAGING_WORKTREE_PATH}/packages/syngrisi && npm start"
    echo ""
}

# Main execution
main() {
    echo ""
    log_info "Starting staging environment reset..."
    echo ""

    ensure_env_loaded

    # Check if staging worktree exists
    if [ ! -d "${STAGING_WORKTREE_PATH}" ]; then
        log_error "Staging worktree not found at ${STAGING_WORKTREE_PATH}"
        log_error "Please run setup script first"
        exit 1
    fi

    stop_staging_server
    reset_database
    reset_baseline_images
    clean_temp_files
    print_success_message
}

main "$@"
