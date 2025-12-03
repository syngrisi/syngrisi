#!/bin/bash

# Staging Server Logs
# This script tails the most recent staging server log file

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STAGING_WORKTREE_PATH="/Users/a1/Projects/SYNGRISI_STAGE"
LOGS_DIR="${STAGING_WORKTREE_PATH}/packages/syngrisi/logs"

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Main execution
main() {
    # Check if staging worktree exists
    if [ ! -d "${STAGING_WORKTREE_PATH}" ]; then
        log_error "Staging worktree not found at ${STAGING_WORKTREE_PATH}"
        exit 1
    fi

    # Check if logs directory exists
    if [ ! -d "${LOGS_DIR}" ]; then
        log_error "Logs directory not found: ${LOGS_DIR}"
        log_error "Start the server first to generate logs"
        exit 1
    fi

    # Find most recent log file
    local LOG_FILE=$(find "${LOGS_DIR}" -name "*.log" -type f -print0 | xargs -0 ls -t | head -1)

    if [ -z "${LOG_FILE}" ]; then
        log_error "No log files found in ${LOGS_DIR}"
        exit 1
    fi

    log_info "Tailing log file: ${LOG_FILE}"
    log_info "Press Ctrl+C to stop"
    echo ""

    # Tail the log file with color highlighting
    tail -f "${LOG_FILE}" | while IFS= read -r line; do
        if echo "$line" | grep -q "ERROR"; then
            echo -e "${RED}${line}${NC}"
        elif echo "$line" | grep -q "WARN"; then
            echo -e "${YELLOW}${line}${NC}"
        elif echo "$line" | grep -q "INFO"; then
            echo -e "${GREEN}${line}${NC}"
        else
            echo "$line"
        fi
    done
}

main "$@"
