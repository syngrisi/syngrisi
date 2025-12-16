#!/bin/bash
# SSO Infrastructure Health Check
# Run this before SSO tests to verify everything is ready

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_ok() { echo -e "${GREEN}✓${NC} $1"; }
log_fail() { echo -e "${RED}✗${NC} $1"; }
log_warn() { echo -e "${YELLOW}!${NC} $1"; }

FAILED=0

echo "=== SSO Infrastructure Health Check ==="
echo ""

# 1. Check container CLI
echo "1. Checking Apple Container service..."
if container system info >/dev/null 2>&1; then
    log_ok "Container service is running"
elif container list >/dev/null 2>&1; then
    # container list works even if system info fails
    log_ok "Container service is running (via container list)"
else
    log_fail "Container service is not running"
    echo "   Fix: container system start"
    FAILED=1
fi

# 2. Check containers
echo ""
echo "2. Checking containers..."
if container list 2>/dev/null | grep -q "syngrisi-test-db-sso"; then
    log_ok "Postgres container (syngrisi-test-db-sso) is running"
else
    log_fail "Postgres container is not running"
    echo "   Fix: ./setup-logto.sh"
    FAILED=1
fi

if container list 2>/dev/null | grep -q "syngrisi-test-sso"; then
    log_ok "Logto container (syngrisi-test-sso) is running"
else
    log_fail "Logto container is not running"
    echo "   Fix: ./setup-logto.sh"
    FAILED=1
fi

# 3. Check Logto endpoint
echo ""
echo "3. Checking Logto OIDC endpoint..."
if curl -s --max-time 5 http://localhost:3001/oidc/.well-known/openid-configuration | grep -q '"issuer"'; then
    log_ok "Logto OIDC endpoint is responding"
else
    log_fail "Logto OIDC endpoint is not responding"
    echo "   Fix: Wait 30 seconds or check: container logs syngrisi-test-sso"
    FAILED=1
fi

# 4. Check database
echo ""
echo "4. Checking database connection..."
if container exec syngrisi-test-db-sso psql -U logto -d logto -c "SELECT 1;" >/dev/null 2>&1; then
    log_ok "Database connection successful"
else
    log_fail "Database connection failed"
    echo "   Fix: container logs syngrisi-test-db-sso"
    FAILED=1
fi

# 5. Check test user
echo ""
echo "5. Checking test user..."
USER_EXISTS=$(container exec syngrisi-test-db-sso psql -U logto -d logto -tAc "SELECT username FROM users WHERE username='testuser';" 2>/dev/null || echo "")
if [ "$USER_EXISTS" = "testuser" ]; then
    log_ok "Test user 'testuser' exists"
else
    log_fail "Test user 'testuser' not found"
    echo "   Fix: ./provision-logto-api.sh"
    FAILED=1
fi

# 6. Check OIDC app
echo ""
echo "6. Checking OIDC application..."
APP_EXISTS=$(container exec syngrisi-test-db-sso psql -U logto -d logto -tAc "SELECT id FROM applications WHERE id='syngrisi-e2e-app';" 2>/dev/null || echo "")
if [ "$APP_EXISTS" = "syngrisi-e2e-app" ]; then
    log_ok "OIDC application 'syngrisi-e2e-app' exists"
else
    log_fail "OIDC application 'syngrisi-e2e-app' not found"
    echo "   Fix: ./provision-logto-api.sh"
    FAILED=1
fi

# 7. Check redirect URIs (both variants)
echo ""
echo "7. Checking redirect URIs..."
REDIRECT_URIS=$(container exec syngrisi-test-db-sso psql -U logto -d logto -tAc "SELECT oidc_client_metadata FROM applications WHERE id='syngrisi-e2e-app';" 2>/dev/null || echo "")
if echo "$REDIRECT_URIS" | grep -q "127.0.0.1"; then
    log_ok "Redirect URIs include 127.0.0.1 variants"
else
    log_warn "Redirect URIs may be missing 127.0.0.1 variants"
    echo "   Note: Tests using E2E_BACKEND_HOST=127.0.0.1 may fail"
    echo "   Fix: ./provision-logto-api.sh"
fi

if echo "$REDIRECT_URIS" | grep -q "localhost"; then
    log_ok "Redirect URIs include localhost variants"
else
    log_warn "Redirect URIs may be missing localhost variants"
fi

# Summary
echo ""
echo "=== Summary ==="
if [ $FAILED -eq 0 ]; then
    log_ok "All checks passed! SSO infrastructure is ready."
    echo ""
    echo "Run SSO tests with:"
    echo "  cd packages/syngrisi/e2e"
    echo "  npx bddgen && npx playwright test --project=chromium \"features/AUTH/SSO\" --workers=1"
    exit 0
else
    log_fail "Some checks failed. Fix the issues above before running tests."
    exit 1
fi
