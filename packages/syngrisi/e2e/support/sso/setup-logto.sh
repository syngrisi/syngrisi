#!/bin/bash
set -e

# Full Logto Setup Script
# This script:
# 1. Starts Logto containers
# 2. Provisions application and test user via Management API
# 3. Outputs configuration for E2E tests

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

main() {
    log_info "=== Logto Full Setup ==="

    # Step 1: Start containers
    log_info "Step 1: Starting Logto containers..."
    bash "${SCRIPT_DIR}/start-containers.sh"

    # Step 2: Wait a bit for Logto to fully initialize
    log_info "Step 2: Waiting for Logto to fully initialize..."
    sleep 10

    # Step 3: Run provisioning via Management API
    log_info "Step 3: Provisioning Logto (creating app and user)..."
    bash "${SCRIPT_DIR}/provision-logto-api.sh" || {
        log_warn "Provisioning script failed. You may need to provision manually via:"
        log_warn "  Open http://localhost:3050 in browser (Admin Console)"
        log_warn "  Create application with redirect URI: http://localhost:3002/v1/auth/sso/oauth/callback"
        log_warn "  Create test user with username: testuser"
    }

    log_info "=== Setup Complete ==="
    log_info ""
    log_info "Logto Admin Console: http://localhost:3050"
    log_info "Logto Auth Endpoint: http://localhost:3001"
    log_info ""
    log_info "To run SSO E2E tests:"
    log_info "  npm run test:e2e -- --grep '@sso-external'"
}

main "$@"
