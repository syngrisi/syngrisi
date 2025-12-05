#!/bin/bash

# Setup Staging Environment for Syngrisi
# This script performs one-time setup of the staging environment

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
        STAGING_BASELINES_PATH
        STAGING_DATA_REPO_PATH
        STAGING_MONGODB_URI
        STAGING_HOSTNAME
        STAGING_AUTH_ENABLED
        STAGING_LOG_LEVEL
        STAGING_ADMIN_USERNAME
        STAGING_ADMIN_PASSWORD
        STAGING_REGULAR_USER_EMAIL
        STAGING_REGULAR_USER_PASSWORD
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

write_app_env_file() {
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
    log_info "✓ .env file created at ${env_file_path}"
}

copy_staging_env_file() {
    local destination="${STAGING_WORKTREE_PATH}/packages/syngrisi/.env.staging"
    mkdir -p "$(dirname "${destination}")"
    cp "${STAGING_ENV_FILE}" "${destination}"
    log_info "✓ Staging env file copied to ${destination}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if MongoDB is running
    if ! mongosh --quiet --eval "db.version()" "${STAGING_MONGODB_URI}" &>/dev/null; then
        log_error "MongoDB is not running or not accessible at ${STAGING_MONGODB_URI}"
        log_error "Please start MongoDB and try again"
        exit 1
    fi
    log_info "✓ MongoDB is running"

    # Check if production data exists
    if [ ! -d "${STAGING_PROD_DATA_PATH}" ]; then
        log_error "Production data not found at ${STAGING_PROD_DATA_PATH}"
        exit 1
    fi
    log_info "✓ Production data exists"

    # Check if baselines exist
    if [ ! -d "${STAGING_BASELINES_PATH}" ]; then
        log_error "Baselines not found at ${STAGING_BASELINES_PATH}"
        exit 1
    fi
    log_info "✓ Baseline images exist"

    # Check if port is available
    if lsof -Pi :"${STAGING_PORT}" -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_error "Port ${STAGING_PORT} is already in use"
        log_error "Please free the port and try again"
        exit 1
    fi
    log_info "✓ Port ${STAGING_PORT} is available"

    # Check if worktree already exists
    if [ -d "${STAGING_WORKTREE_PATH}" ]; then
        log_error "Staging worktree already exists at ${STAGING_WORKTREE_PATH}"
        log_error "Please remove it first or use reset script instead"
        exit 1
    fi
    log_info "✓ No existing staging worktree"

    log_info "All prerequisites satisfied"
}

create_worktree() {
    log_info "Creating git worktree at ${STAGING_WORKTREE_PATH}..."

    # Get current commit hash to create worktree from same commit
    local CURRENT_COMMIT=$(git rev-parse HEAD)
    log_info "Using commit: ${CURRENT_COMMIT}"

    if git worktree add --detach "${STAGING_WORKTREE_PATH}" "${CURRENT_COMMIT}"; then
        log_info "✓ Git worktree created successfully (detached HEAD)"
    else
        log_error "Failed to create git worktree"
        exit 1
    fi
}

install_dependencies() {
    log_info "Installing dependencies (this may take several minutes)..."

    cd "${STAGING_WORKTREE_PATH}/packages/syngrisi"

    if npm run install:all; then
        log_info "✓ Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi

    # Install e2e dependencies for MCP support
    log_info "Installing e2e dependencies for MCP support..."
    cd "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e"

    if npm install; then
        log_info "✓ E2E dependencies installed successfully"
    else
        log_error "Failed to install e2e dependencies"
        exit 1
    fi

    # Copy MCP runtime files (.tmp/mcp contains mcp.spec.ts required by test engine)
    log_info "Copying MCP runtime files..."
    local SOURCE_TMP_MCP="${REPO_ROOT}/e2e/.tmp/mcp"
    local DEST_TMP_MCP="${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e/.tmp/mcp"

    if [ -d "${SOURCE_TMP_MCP}" ]; then
        mkdir -p "$(dirname "${DEST_TMP_MCP}")"
        cp -r "${SOURCE_TMP_MCP}" "${DEST_TMP_MCP}"
        log_info "✓ MCP runtime files copied"
    else
        log_warn "MCP runtime files not found at ${SOURCE_TMP_MCP}, skipping"
    fi
}

build_application() {
    log_info "Building application..."

    cd "${STAGING_WORKTREE_PATH}/packages/syngrisi"

    if npm run build; then
        log_info "✓ Application built successfully"
    else
        log_error "Failed to build application"
        exit 1
    fi
}

create_env_file() {
    log_info "Creating staging .env files from ${STAGING_ENV_FILE}..."
    write_app_env_file
    copy_staging_env_file
}

restore_database() {
    log_info "Restoring production database to ${STAGING_DB_NAME}..."
    log_warn "This may take several minutes depending on data size..."

    if mongorestore --uri "${STAGING_MONGODB_URI}" \
        --gzip \
        --db "${STAGING_DB_NAME}" \
        "${STAGING_PROD_DATA_PATH}" 2>&1 | grep -v "continuing through error"; then
        log_info "✓ Database restored successfully"
    else
        log_error "Failed to restore database"
        exit 1
    fi

    # Get database statistics
    local DB_STATS=$(mongosh --quiet --eval "db.stats().dataSize" "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}")
    log_info "Database size: ${DB_STATS} bytes"
}

print_success_message() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Staging Environment Setup Complete!                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Staging Server Location:${NC}"
    echo "  ${STAGING_WORKTREE_PATH}/packages/syngrisi"
    echo ""
    echo -e "${GREEN}Start Command:${NC}"
    echo "  cd ${STAGING_WORKTREE_PATH}/packages/syngrisi && npm start"
    echo ""
    echo -e "${GREEN}Or use the control script:${NC}"
    echo "  ./scripts/staging-control.sh start"
    echo ""
    echo -e "${GREEN}Access URL:${NC}"
    echo "  http://localhost:${STAGING_PORT}"
    echo ""
    echo -e "${GREEN}Test Credentials:${NC}"
    echo "  Regular User: ${STAGING_REGULAR_USER_EMAIL} / ${STAGING_REGULAR_USER_PASSWORD}"
    echo "  Administrator: ${STAGING_ADMIN_USERNAME} / ${STAGING_ADMIN_PASSWORD}"
    echo ""
    echo -e "${GREEN}Database:${NC}"
    echo "  ${STAGING_MONGODB_URI}/${STAGING_DB_NAME}"
    echo ""
    echo -e "${GREEN}Images Path:${NC}"
    echo "  ${STAGING_BASELINES_PATH}"
    echo ""
    echo -e "${YELLOW}To reset staging to initial state:${NC}"
    echo "  ./scripts/staging-control.sh reset"
    echo ""
}

# Main execution
main() {
    echo ""
    log_info "Starting staging environment setup..."
    echo ""

    ensure_env_loaded
    check_prerequisites
    create_worktree
    install_dependencies
    build_application
    create_env_file
    restore_database
    print_success_message
}

main "$@"
