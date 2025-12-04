#!/bin/bash

# Staging Environment Control Script
# Main entry point for all staging operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAGING_SCRIPTS_DIR="${SCRIPT_DIR}/staging"

# Helper functions
log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        Syngrisi Staging Environment Control                    ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Usage:${NC}"
    echo "  ./scripts/staging-control.sh [command]"
    echo ""
    echo -e "${GREEN}Commands:${NC}"
    echo "  setup       - Initial staging environment setup (one-time)"
    echo "              Creates worktree, installs deps, builds app, restores DB"
    echo ""
    echo "  start       - Start staging server"
    echo "              Starts the server on port 5252"
    echo ""
    echo "  stop        - Stop staging server"
    echo "              Gracefully stops the running server"
    echo ""
    echo "  restart     - Stop and start staging server"
    echo "              Equivalent to: stop && start"
    echo ""
    echo "  reset       - Reset staging data to production state"
    echo "              Stops server, resets DB, resets images to init commit"
    echo ""
    echo "  status      - Display staging environment status"
    echo "              Shows worktree, server, database, and images status"
    echo ""
    echo "  logs        - Tail staging server logs"
    echo "              Shows real-time logs with color highlighting"
    echo ""
    echo "  help        - Display this help message"
    echo ""
    echo -e "${GREEN}Examples:${NC}"
    echo "  ./scripts/staging-control.sh setup"
    echo "  ./scripts/staging-control.sh start"
    echo "  ./scripts/staging-control.sh status"
    echo "  ./scripts/staging-control.sh reset"
    echo ""
    echo -e "${GREEN}Access:${NC}"
    echo "  URL: http://localhost:5252"
    echo "  Credentials and paths are loaded from packages/syngrisi/.env.staging"
    echo ""
}

# Main execution
main() {
    local COMMAND="${1:-}"

    if [ -z "${COMMAND}" ]; then
        log_error "No command specified"
        show_help
        exit 1
    fi

    case "${COMMAND}" in
        setup)
            "${STAGING_SCRIPTS_DIR}/setup-staging.sh"
            ;;
        start)
            "${STAGING_SCRIPTS_DIR}/start-staging.sh"
            ;;
        stop)
            "${STAGING_SCRIPTS_DIR}/stop-staging.sh"
            ;;
        restart)
            "${STAGING_SCRIPTS_DIR}/stop-staging.sh"
            sleep 2
            "${STAGING_SCRIPTS_DIR}/start-staging.sh"
            ;;
        reset)
            "${STAGING_SCRIPTS_DIR}/reset-staging.sh"
            ;;
        status)
            "${STAGING_SCRIPTS_DIR}/staging-status.sh"
            ;;
        logs)
            "${STAGING_SCRIPTS_DIR}/staging-logs.sh"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: ${COMMAND}"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
