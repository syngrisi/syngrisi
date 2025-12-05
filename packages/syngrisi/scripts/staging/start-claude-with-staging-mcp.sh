#!/bin/bash

# Start Claude Code with Staging MCP Configuration
# This script launches Claude Code connected to the staging Syngrisi instance via MCP

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
MAIN_PROJECT_ROOT="$(cd "${REPO_ROOT}/../.." && pwd)"

# Temp file for MCP config
MCP_CONFIG_FILE=""

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

cleanup() {
    if [ -n "${MCP_CONFIG_FILE}" ] && [ -f "${MCP_CONFIG_FILE}" ]; then
        rm -f "${MCP_CONFIG_FILE}"
        log_info "Cleaned up temporary MCP config"
    fi
}

trap cleanup EXIT

ensure_env_loaded() {
    if [ ! -f "${STAGING_ENV_FILE}" ]; then
        log_error "Staging env file not found: ${STAGING_ENV_FILE}"
        log_error "Create it from .env.staging.example and fill in values"
        exit 1
    fi

    set -o allexport
    # shellcheck disable=SC1090
    source "${STAGING_ENV_FILE}"
    set +o allexport

    local required_vars=(
        STAGING_WORKTREE_PATH
        STAGING_PORT
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "Missing required variable '${var}' in ${STAGING_ENV_FILE}"
            exit 1
        fi
    done
}

check_server_running() {
    if ! lsof -Pi :"${STAGING_PORT}" -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_error "Staging server is not running on port ${STAGING_PORT}"
        log_error "Please start it first: ./scripts/staging-control.sh start"
        exit 1
    fi
    log_info "Staging server is running on port ${STAGING_PORT}"
}

check_staging_worktree() {
    if [ ! -d "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e/support/mcp" ]; then
        log_error "Staging worktree MCP directory not found"
        log_error "Expected: ${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e/support/mcp"
        log_error "Please run setup first: ./scripts/staging-control.sh setup"
        exit 1
    fi
}

generate_mcp_config() {
    # macOS mktemp requires suffix via -t flag, not in template
    MCP_CONFIG_FILE=$(mktemp -t staging-mcp-config).json

    # Get npx path
    local NPX_PATH
    NPX_PATH=$(which npx)

    # Generate MCP config JSON
    cat > "${MCP_CONFIG_FILE}" <<EOF
{
    "mcpServers": {
        "staging_test_engine": {
            "type": "stdio",
            "command": "${NPX_PATH}",
            "args": [
                "tsx",
                "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e/support/mcp/bridge-cli.ts"
            ],
            "env": {
                "SYNGRISI_ROOT": "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e",
                "E2E_USE_ENV_CONFIG": "true",
                "PATH": "${PATH}"
            }
        }
    }
}
EOF

    log_info "Generated MCP config: ${MCP_CONFIG_FILE}"
}

launch_claude() {
    log_info "Launching Claude Code with staging MCP..."
    log_info "Working directory: ${MAIN_PROJECT_ROOT}"
    log_info "MCP server: staging_test_engine"
    log_info "Target: http://localhost:${STAGING_PORT}"
    echo ""

    cd "${MAIN_PROJECT_ROOT}"

    # Launch Claude Code with the MCP config
    exec claude --mcp-config "${MCP_CONFIG_FILE}" --dangerously-skip-permissions --verbose
}

# Main execution
main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        Claude Code + Staging MCP Launcher                      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    ensure_env_loaded
    check_server_running
    check_staging_worktree
    generate_mcp_config
    launch_claude
}

main "$@"
