#!/bin/bash

# Staging Environment Status
# This script displays the current status of the staging environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_section() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
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
        STAGING_BASELINES_PATH
        STAGING_DATA_REPO_PATH
        STAGING_MONGODB_URI
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required variable '${var}' in ${STAGING_ENV_FILE}"
            exit 1
        fi
    done
}

check_worktree() {
    log_section "Worktree Status"

    if [ -d "${STAGING_WORKTREE_PATH}" ]; then
        echo -e "${GREEN}✓${NC} Worktree exists: ${STAGING_WORKTREE_PATH}"

        # Get current branch
        cd "${STAGING_WORKTREE_PATH}"
        local BRANCH=$(git branch --show-current)
        echo -e "${GREEN}✓${NC} Branch: ${BRANCH}"

        # Check if dependencies are installed
        if [ -d "${STAGING_WORKTREE_PATH}/packages/syngrisi/node_modules" ]; then
            echo -e "${GREEN}✓${NC} Dependencies installed"
        else
            echo -e "${RED}✗${NC} Dependencies not installed"
        fi

        # Check if built
        if [ -d "${STAGING_WORKTREE_PATH}/packages/syngrisi/dist" ]; then
            echo -e "${GREEN}✓${NC} Application built"
        else
            echo -e "${RED}✗${NC} Application not built"
        fi
    else
        echo -e "${RED}✗${NC} Worktree not found"
        echo "  Run: ./scripts/staging-control.sh setup"
    fi
    echo ""
}

check_server() {
    log_section "Server Status"

    local PID
    PID=$(lsof -ti:"${STAGING_PORT}" 2>/dev/null || true)

    if [ -n "${PID}" ]; then
        echo -e "${GREEN}✓${NC} Server is RUNNING"
        echo "  PID: ${PID}"
        echo "  Port: ${STAGING_PORT}"
        echo "  URL: http://localhost:${STAGING_PORT}"
    else
        echo -e "${YELLOW}✗${NC} Server is STOPPED"
        echo "  Start: ./scripts/staging-control.sh start"
    fi
    echo ""
}

check_database() {
    log_section "Database Status"

    if mongosh --quiet --eval "db.version()" "${STAGING_MONGODB_URI}" &>/dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB is running"

        # Check if staging database exists
        local DB_EXISTS
        DB_EXISTS=$(mongosh --quiet --eval "db.getMongo().getDBNames().includes('${STAGING_DB_NAME}')" "${STAGING_MONGODB_URI}")

        if [ "${DB_EXISTS}" = "true" ]; then
            echo -e "${GREEN}✓${NC} Database '${STAGING_DB_NAME}' exists"

            # Get collection counts
            if [ -z "${STAGING_MONGODB_URI}" ]; then
                log_error "STAGING_MONGODB_URI is empty; check ${STAGING_ENV_FILE}"
                return
            fi
            local FULL_MONGO_URI="${STAGING_MONGODB_URI%/}/${STAGING_DB_NAME}"
            echo ""
            echo "Collection counts:"
            mongosh --quiet "${FULL_MONGO_URI}" --eval "
                db.getCollectionNames().forEach(function(collection) {
                    var count = db[collection].countDocuments();
                    if (count > 0) {
                        print('  ' + collection + ': ' + count);
                    }
                });
            "
        else
            echo -e "${RED}✗${NC} Database '${STAGING_DB_NAME}' not found"
            echo "  Run: ./scripts/staging-control.sh setup"
        fi
    else
        echo -e "${RED}✗${NC} MongoDB is not running"
    fi
    echo ""
}

check_images() {
    log_section "Images Status"

    if [ -d "${STAGING_BASELINES_PATH}" ]; then
        echo -e "${GREEN}✓${NC} Baselines path exists"
        echo "  Path: ${STAGING_BASELINES_PATH}"

        # Count images
        local IMAGE_COUNT
        IMAGE_COUNT=$(find "${STAGING_BASELINES_PATH}" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
        echo "  Images: ${IMAGE_COUNT}"

        # Check disk usage
        local DISK_USAGE
        DISK_USAGE=$(du -sh "${STAGING_BASELINES_PATH}" 2>/dev/null | cut -f1)
        echo "  Disk usage: ${DISK_USAGE}"

        # Check git status
        cd "${STAGING_DATA_REPO_PATH}"
        local GIT_STATUS
        GIT_STATUS=$(git status --short | wc -l | tr -d ' ')
        if [ "${GIT_STATUS}" = "0" ]; then
            echo -e "${GREEN}✓${NC} Git: clean (no modifications)"
        else
            echo -e "${YELLOW}!${NC} Git: ${GIT_STATUS} modified files"
            echo "  Reset: ./scripts/staging-control.sh reset"
        fi

        local CURRENT_COMMIT
        CURRENT_COMMIT=$(git log -1 --oneline)
        echo "  Commit: ${CURRENT_COMMIT}"
    else
        echo -e "${RED}✗${NC} Baselines path not found"
    fi
    echo ""
}

# Main execution
main() {
    echo ""
    ensure_env_loaded
    check_worktree
    check_server
    check_database
    check_images
}

main "$@"
