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

# Configuration
STAGING_WORKTREE_PATH="/Users/a1/Projects/SYNGRISI_STAGE"
STAGING_DB_NAME="VRSdb_stage"
STAGING_PORT="5252"
BASELINES_PATH="/Users/a1/Projects/SYNGRISI_STAGE_DATA/baselines-2025-11-14"
MONGODB_URI="mongodb://localhost:27017"

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

    local PID=$(lsof -ti:${STAGING_PORT} 2>/dev/null || true)

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

    if mongosh --quiet --eval "db.version()" "${MONGODB_URI}" &>/dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB is running"

        # Check if staging database exists
        local DB_EXISTS=$(mongosh --quiet --eval "db.getMongo().getDBNames().includes('${STAGING_DB_NAME}')" "${MONGODB_URI}")

        if [ "${DB_EXISTS}" = "true" ]; then
            echo -e "${GREEN}✓${NC} Database '${STAGING_DB_NAME}' exists"

            # Get collection counts
            echo ""
            echo "Collection counts:"
            mongosh --quiet "${MONGODB_URI}/${STAGING_DB_NAME}" --eval "
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

    if [ -d "${BASELINES_PATH}" ]; then
        echo -e "${GREEN}✓${NC} Baselines path exists"
        echo "  Path: ${BASELINES_PATH}"

        # Count images
        local IMAGE_COUNT=$(find "${BASELINES_PATH}" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
        echo "  Images: ${IMAGE_COUNT}"

        # Check disk usage
        local DISK_USAGE=$(du -sh "${BASELINES_PATH}" 2>/dev/null | cut -f1)
        echo "  Disk usage: ${DISK_USAGE}"

        # Check git status
        cd "/Users/a1/Projects/SYNGRISI_STAGE_DATA"
        local GIT_STATUS=$(git status --short | wc -l | tr -d ' ')
        if [ "${GIT_STATUS}" = "0" ]; then
            echo -e "${GREEN}✓${NC} Git: clean (no modifications)"
        else
            echo -e "${YELLOW}!${NC} Git: ${GIT_STATUS} modified files"
            echo "  Reset: ./scripts/staging-control.sh reset"
        fi

        local CURRENT_COMMIT=$(git log -1 --oneline)
        echo "  Commit: ${CURRENT_COMMIT}"
    else
        echo -e "${RED}✗${NC} Baselines path not found"
    fi
    echo ""
}

# Main execution
main() {
    echo ""
    check_worktree
    check_server
    check_database
    check_images
}

main "$@"
