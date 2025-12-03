#!/bin/bash

# Setup Staging Environment for Syngrisi
# This script performs one-time setup of the staging environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STAGING_WORKTREE_PATH="/Users/a1/Projects/SYNGRISI_STAGE"
STAGING_DB_NAME="VRSdb_stage"
STAGING_PORT="5252"
PROD_DATA_PATH="/Users/a1/Projects/SYNGRISI_STAGE_DATA/VRSdb_prod_30_11/VRSdb"
BASELINES_PATH="/Users/a1/Projects/SYNGRISI_STAGE_DATA/baselines-2025-11-14"
MONGODB_URI="mongodb://localhost:27017"

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

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if MongoDB is running
    if ! mongosh --quiet --eval "db.version()" "${MONGODB_URI}" &>/dev/null; then
        log_error "MongoDB is not running or not accessible at ${MONGODB_URI}"
        log_error "Please start MongoDB and try again"
        exit 1
    fi
    log_info "✓ MongoDB is running"

    # Check if production data exists
    if [ ! -d "${PROD_DATA_PATH}" ]; then
        log_error "Production data not found at ${PROD_DATA_PATH}"
        exit 1
    fi
    log_info "✓ Production data exists"

    # Check if baselines exist
    if [ ! -d "${BASELINES_PATH}" ]; then
        log_error "Baselines not found at ${BASELINES_PATH}"
        exit 1
    fi
    log_info "✓ Baseline images exist"

    # Check if port is available
    if lsof -Pi :${STAGING_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
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
    log_info "Creating staging .env file..."

    local ENV_FILE="${STAGING_WORKTREE_PATH}/packages/syngrisi/.env"

    cat > "${ENV_FILE}" <<EOF
NODE_ENV=production
SYNGRISI_DB_URI=${MONGODB_URI}/${STAGING_DB_NAME}
SYNGRISI_IMAGES_PATH=${BASELINES_PATH}
SYNGRISI_APP_PORT=${STAGING_PORT}
SYNGRISI_HOSTNAME=localhost
SYNGRISI_AUTH=true
SYNGRISI_LOG_LEVEL=info
SYNGRISI_TMP_DIR=${STAGING_WORKTREE_PATH}/packages/syngrisi/.tmp-stage
ADMIN_PASSWORD=Cakeisalie-1488
GUEST_PASSWORD=Guest
EOF

    log_info "✓ .env file created at ${ENV_FILE}"
}

restore_database() {
    log_info "Restoring production database to ${STAGING_DB_NAME}..."
    log_warn "This may take several minutes depending on data size..."

    if mongorestore --uri "${MONGODB_URI}" \
        --gzip \
        --db "${STAGING_DB_NAME}" \
        "${PROD_DATA_PATH}" 2>&1 | grep -v "continuing through error"; then
        log_info "✓ Database restored successfully"
    else
        log_error "Failed to restore database"
        exit 1
    fi

    # Get database statistics
    local DB_STATS=$(mongosh --quiet --eval "db.stats().dataSize" "${MONGODB_URI}/${STAGING_DB_NAME}")
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
    echo "  Regular User: v_haluza_2@exadel.com / Syngrisi-3214"
    echo "  Administrator: Administrator / Cakeisalie-1488"
    echo ""
    echo -e "${GREEN}Database:${NC}"
    echo "  ${MONGODB_URI}/${STAGING_DB_NAME}"
    echo ""
    echo -e "${GREEN}Images Path:${NC}"
    echo "  ${BASELINES_PATH}"
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

    check_prerequisites
    create_worktree
    install_dependencies
    build_application
    create_env_file
    restore_database
    print_success_message
}

main "$@"
