#!/bin/bash
set -e

# Logto Provisioning Script using Management API
# This script configures Logto for Syngrisi E2E testing
#
# What it does:
# 1. Creates M2M app for API access (bootstrap step via SQL)
# 2. Configures sign-in experience (email + password)
# 3. Creates test user
# 4. Creates OIDC application for Syngrisi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configuration
LOGTO_ENDPOINT="${LOGTO_ENDPOINT:-http://localhost:3001}"
POSTGRES_PORT="${LOGTO_POSTGRES_PORT:-5433}"

# M2M App credentials (for Management API access)
M2M_APP_ID="syngrisi_m2m_app_001"
M2M_APP_SECRET="syngrisi-m2m-secret-12345"
M2M_ROLE_ID="mqek06sbw96rvoosmjc7f"  # Default "Logto Management API access" role

# Test user credentials
TEST_USER_EMAIL="test@syngrisi.test"
TEST_USER_PASSWORD="Test123!"
TEST_USER_USERNAME="testuser"

# OIDC App for Syngrisi
OIDC_APP_ID="syngrisi-e2e-app"
OIDC_APP_NAME="syngrisi-e2e-test"
OIDC_APP_SECRET="syngrisi-test-secret-12345"

# Redirect URIs for E2E testing (base port 3002 + worker CID for parallel execution)
# Supports up to 10 parallel workers (ports 3002-3011)
OIDC_REDIRECT_URIS_JSON='["http://localhost:3002/v1/auth/sso/oauth/callback", "http://localhost:3003/v1/auth/sso/oauth/callback", "http://localhost:3004/v1/auth/sso/oauth/callback", "http://localhost:3005/v1/auth/sso/oauth/callback", "http://localhost:3006/v1/auth/sso/oauth/callback", "http://localhost:3007/v1/auth/sso/oauth/callback", "http://localhost:3008/v1/auth/sso/oauth/callback", "http://localhost:3009/v1/auth/sso/oauth/callback", "http://localhost:3010/v1/auth/sso/oauth/callback", "http://localhost:3011/v1/auth/sso/oauth/callback"]'
POST_LOGOUT_REDIRECT_URIS_JSON='["http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006", "http://localhost:3007", "http://localhost:3008", "http://localhost:3009", "http://localhost:3010", "http://localhost:3011"]'

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Check if Logto is available
check_logto() {
    log_step "Checking Logto availability..."
    if ! curl -sf "${LOGTO_ENDPOINT}/oidc/.well-known/openid-configuration" > /dev/null 2>&1; then
        log_error "Logto is not available at ${LOGTO_ENDPOINT}"
        exit 1
    fi
    log_info "Logto is available"
}

# Bootstrap: Create M2M app for API access (requires SQL - one time only)
bootstrap_m2m_app() {
    log_step "Bootstrapping M2M app for Management API access..."

    # Check if M2M app exists
    local app_exists=$(PGPASSWORD=logto psql -h localhost -p "$POSTGRES_PORT" -U logto -d logto -tAc \
        "SELECT COUNT(*) FROM applications WHERE id='$M2M_APP_ID' AND tenant_id='default';" 2>/dev/null || echo "0")

    if [ "$app_exists" = "1" ]; then
        log_info "M2M app already exists"
        return 0
    fi

    log_info "Creating M2M app..."

    # Get the Management API role ID (might be different in fresh installs)
    local role_id=$(PGPASSWORD=logto psql -h localhost -p "$POSTGRES_PORT" -U logto -d logto -tAc \
        "SELECT id FROM roles WHERE tenant_id='default' AND name LIKE '%Management API%' LIMIT 1;" 2>/dev/null)

    if [ -z "$role_id" ]; then
        log_error "Could not find Management API role"
        exit 1
    fi

    log_info "Found Management API role: $role_id"

    PGPASSWORD=logto psql -h localhost -p "$POSTGRES_PORT" -U logto -d logto << EOF
-- Create M2M application
INSERT INTO applications (tenant_id, id, name, secret, description, type, oidc_client_metadata)
VALUES (
    'default',
    '$M2M_APP_ID',
    'Syngrisi Management App',
    '$M2M_APP_SECRET',
    'M2M app for Syngrisi E2E test provisioning',
    'MachineToMachine',
    '{"redirectUris": [], "postLogoutRedirectUris": []}'
);

-- Assign Management API role
INSERT INTO applications_roles (tenant_id, id, application_id, role_id)
VALUES (
    'default',
    'ar_syngrisi_m2m_001',
    '$M2M_APP_ID',
    '$role_id'
);
EOF

    log_info "M2M app created successfully"
}

# Get access token for Management API
get_access_token() {
    log_step "Getting Management API access token..."

    local response=$(curl -s -X POST "${LOGTO_ENDPOINT}/oidc/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials" \
        -d "client_id=${M2M_APP_ID}" \
        -d "client_secret=${M2M_APP_SECRET}" \
        -d "resource=https://default.logto.app/api" \
        -d "scope=all")

    TOKEN=$(echo "$response" | jq -r '.access_token')

    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
        log_error "Failed to get access token"
        echo "$response" | jq '.'
        exit 1
    fi

    log_info "Access token obtained"
}

# Configure sign-in experience
configure_sign_in_experience() {
    log_step "Configuring sign-in experience (username + password)..."

    # Use username + password for sign-in (no email verification required)
    # This allows login with testuser/Test123! credentials
    local response=$(curl -s -X PATCH "${LOGTO_ENDPOINT}/api/sign-in-exp" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "signIn": {
                "methods": [
                    {
                        "identifier": "username",
                        "password": true,
                        "verificationCode": false,
                        "isPasswordPrimary": true
                    }
                ]
            },
            "signUp": {
                "identifiers": ["username"],
                "password": true,
                "verify": false
            }
        }')

    if echo "$response" | jq -e '.signIn' > /dev/null 2>&1; then
        log_info "Sign-in experience configured successfully"
    else
        log_warn "Sign-in experience response: $response"
    fi
}

# Create or update test user
create_test_user() {
    log_step "Creating test user: $TEST_USER_EMAIL..."

    # Check if user exists
    local existing_user=$(curl -s "${LOGTO_ENDPOINT}/api/users?search.primaryEmail=${TEST_USER_EMAIL}" \
        -H "Authorization: Bearer $TOKEN" | jq '.[0].id // empty' -r)

    if [ -n "$existing_user" ]; then
        log_info "User already exists with ID: $existing_user"

        # Update password
        log_info "Updating user password..."
        curl -s -X PATCH "${LOGTO_ENDPOINT}/api/users/${existing_user}/password" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"password\": \"${TEST_USER_PASSWORD}\"}" > /dev/null

        log_info "User password updated"
        return 0
    fi

    # Create new user
    local response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/users" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"primaryEmail\": \"${TEST_USER_EMAIL}\",
            \"username\": \"${TEST_USER_USERNAME}\",
            \"password\": \"${TEST_USER_PASSWORD}\"
        }")

    local user_id=$(echo "$response" | jq -r '.id // empty')

    if [ -n "$user_id" ]; then
        log_info "User created with ID: $user_id"
    else
        log_error "Failed to create user"
        echo "$response" | jq '.'
        exit 1
    fi
}

# Create or update OIDC application for Syngrisi
create_oidc_app() {
    log_step "Creating OIDC application: $OIDC_APP_NAME..."

    # Check if app exists
    local existing_app=$(curl -s "${LOGTO_ENDPOINT}/api/applications/${OIDC_APP_ID}" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.id // empty')

    if [ -n "$existing_app" ] && [ "$existing_app" != "null" ]; then
        log_info "Application already exists, updating..."

        curl -s -X PATCH "${LOGTO_ENDPOINT}/api/applications/${OIDC_APP_ID}" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"name\": \"${OIDC_APP_NAME}\",
                \"oidcClientMetadata\": {
                    \"redirectUris\": ${OIDC_REDIRECT_URIS_JSON},
                    \"postLogoutRedirectUris\": ${POST_LOGOUT_REDIRECT_URIS_JSON}
                }
            }" > /dev/null

        log_info "Application updated"
        return 0
    fi

    # Create new application
    local response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/applications" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${OIDC_APP_NAME}\",
            \"type\": \"Traditional\",
            \"oidcClientMetadata\": {
                \"redirectUris\": ${OIDC_REDIRECT_URIS_JSON},
                \"postLogoutRedirectUris\": ${POST_LOGOUT_REDIRECT_URIS_JSON}
            }
        }")

    local app_id=$(echo "$response" | jq -r '.id // empty')

    if [ -n "$app_id" ]; then
        log_info "Application created with ID: $app_id"

        # Update with our custom ID and secret (via SQL since API doesn't allow setting ID)
        log_info "Setting custom app ID and secret..."
        PGPASSWORD=logto psql -h localhost -p "$POSTGRES_PORT" -U logto -d logto << EOF
UPDATE applications
SET id = '$OIDC_APP_ID', secret = '$OIDC_APP_SECRET'
WHERE id = '$app_id' AND tenant_id = 'default';
EOF
        log_info "Application ID and secret configured"
    else
        log_warn "Application may already exist or creation failed"
        echo "$response" | jq '.'
    fi
}

# Save configuration to file
save_config() {
    log_step "Saving configuration to provisioned-config.json..."

    cat > "${SCRIPT_DIR}/provisioned-config.json" << EOF
{
  "app": {
    "clientId": "${OIDC_APP_ID}",
    "clientSecret": "${OIDC_APP_SECRET}",
    "appName": "${OIDC_APP_NAME}"
  },
  "user": {
    "email": "${TEST_USER_EMAIL}",
    "password": "${TEST_USER_PASSWORD}"
  },
  "endpoints": {
    "authorization": "${LOGTO_ENDPOINT}/oidc/auth",
    "token": "${LOGTO_ENDPOINT}/oidc/token",
    "userinfo": "${LOGTO_ENDPOINT}/oidc/me"
  },
  "env": {
    "SSO_ENABLED": "true",
    "SSO_PROTOCOL": "oauth2",
    "SSO_CLIENT_ID": "${OIDC_APP_ID}",
    "SSO_CLIENT_SECRET": "${OIDC_APP_SECRET}",
    "SSO_AUTHORIZATION_URL": "${LOGTO_ENDPOINT}/oidc/auth",
    "SSO_TOKEN_URL": "${LOGTO_ENDPOINT}/oidc/token",
    "SSO_USERINFO_URL": "${LOGTO_ENDPOINT}/oidc/me"
  }
}
EOF

    log_info "Configuration saved"
}

# Main
main() {
    echo ""
    echo "========================================"
    echo "  Logto Provisioning (Management API)  "
    echo "========================================"
    echo ""

    check_logto
    bootstrap_m2m_app
    get_access_token
    configure_sign_in_experience
    create_test_user
    create_oidc_app
    save_config

    echo ""
    echo "========================================"
    log_info "Provisioning complete!"
    echo "========================================"
    echo ""
    echo "Test credentials:"
    echo "  Email:    ${TEST_USER_EMAIL}"
    echo "  Password: ${TEST_USER_PASSWORD}"
    echo ""
    echo "OIDC Application:"
    echo "  Client ID:     ${OIDC_APP_ID}"
    echo "  Client Secret: ${OIDC_APP_SECRET}"
    echo ""
}

main "$@"
