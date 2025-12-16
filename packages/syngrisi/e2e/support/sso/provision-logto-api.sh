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

# Admin user credentials (for Logto Admin Console access)
ADMIN_USER_EMAIL="admin@syngrisi.test"
ADMIN_USER_PASSWORD="Admin123!"
ADMIN_USER_USERNAME="admin"

# OIDC App for Syngrisi
OIDC_APP_ID="syngrisi-e2e-app"
OIDC_APP_NAME="syngrisi-e2e-test"
OIDC_APP_SECRET="syngrisi-test-secret-12345"

# Redirect URIs for E2E testing (base port 3002 + worker CID for parallel execution)
# Supports up to 10 parallel workers (ports 3002-3011)
# Includes both localhost and 127.0.0.1 variants for test compatibility
OIDC_REDIRECT_URIS_JSON='["http://localhost:3002/v1/auth/sso/oauth/callback", "http://localhost:3003/v1/auth/sso/oauth/callback", "http://localhost:3004/v1/auth/sso/oauth/callback", "http://localhost:3005/v1/auth/sso/oauth/callback", "http://localhost:3006/v1/auth/sso/oauth/callback", "http://localhost:3007/v1/auth/sso/oauth/callback", "http://localhost:3008/v1/auth/sso/oauth/callback", "http://localhost:3009/v1/auth/sso/oauth/callback", "http://localhost:3010/v1/auth/sso/oauth/callback", "http://localhost:3011/v1/auth/sso/oauth/callback", "http://127.0.0.1:3002/v1/auth/sso/oauth/callback", "http://127.0.0.1:3003/v1/auth/sso/oauth/callback", "http://127.0.0.1:3004/v1/auth/sso/oauth/callback", "http://127.0.0.1:3005/v1/auth/sso/oauth/callback", "http://127.0.0.1:3006/v1/auth/sso/oauth/callback", "http://127.0.0.1:3007/v1/auth/sso/oauth/callback", "http://127.0.0.1:3008/v1/auth/sso/oauth/callback", "http://127.0.0.1:3009/v1/auth/sso/oauth/callback", "http://127.0.0.1:3010/v1/auth/sso/oauth/callback", "http://127.0.0.1:3011/v1/auth/sso/oauth/callback"]'
POST_LOGOUT_REDIRECT_URIS_JSON='["http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:3006", "http://localhost:3007", "http://localhost:3008", "http://localhost:3009", "http://localhost:3010", "http://localhost:3011", "http://127.0.0.1:3002", "http://127.0.0.1:3003", "http://127.0.0.1:3004", "http://127.0.0.1:3005", "http://127.0.0.1:3006", "http://127.0.0.1:3007", "http://127.0.0.1:3008", "http://127.0.0.1:3009", "http://127.0.0.1:3010", "http://127.0.0.1:3011"]'

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

# Helper function to run psql via container
run_psql() {
    container exec syngrisi-test-db-sso psql -U logto -d logto "$@"
}

run_psql_query() {
    container exec syngrisi-test-db-sso psql -U logto -d logto -tAc "$1"
}

# Bootstrap: Create M2M app for API access (requires SQL - one time only)
bootstrap_m2m_app() {
    log_step "Bootstrapping M2M app for Management API access..."

    # Check if M2M app exists
    local app_exists=$(run_psql_query "SELECT COUNT(*) FROM applications WHERE id='$M2M_APP_ID' AND tenant_id='default';" 2>/dev/null || echo "0")

    if [ "$app_exists" = "1" ]; then
        log_info "M2M app already exists"
        return 0
    fi

    log_info "Creating M2M app..."

    # Get the Management API role ID (might be different in fresh installs)
    local role_id=$(run_psql_query "SELECT id FROM roles WHERE tenant_id='default' AND name LIKE '%Management API%' LIMIT 1;" 2>/dev/null)

    if [ -z "$role_id" ]; then
        log_error "Could not find Management API role"
        exit 1
    fi

    log_info "Found Management API role: $role_id"

    # Create M2M application and assign role
    run_psql_query "INSERT INTO applications (tenant_id, id, name, secret, description, type, oidc_client_metadata) VALUES ('default', '$M2M_APP_ID', 'Syngrisi Management App', '$M2M_APP_SECRET', 'M2M app for Syngrisi E2E test provisioning', 'MachineToMachine', '{\"redirectUris\": [], \"postLogoutRedirectUris\": []}');"
    run_psql_query "INSERT INTO applications_roles (tenant_id, id, application_id, role_id) VALUES ('default', 'ar_syngrisi_m2m_001', '$M2M_APP_ID', '$role_id');"

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

# Configure admin console onboarding/experience to avoid UI wizard
configure_admin_experience() {
    log_step "Configuring admin console experience..."

    # Set a default experience profile to bypass onboarding UI
    curl -s -X PUT "${LOGTO_ENDPOINT}/api/experience" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "branding": {
                "name": "Syngrisi",
                "logoUrl": "",
                "faviconUrl": "",
                "colors": {
                    "primary": "#635bff"
                }
            },
            "signInExperience": {
                "postSignUpRedirectUri": "",
                "postSignInRedirectUri": ""
            }
        }' > /dev/null || true

    curl -s -X POST "${LOGTO_ENDPOINT}/api/experience/profile" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{}' > /dev/null || true

    log_info "Admin console experience configured (onboarding bypass)"
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

# Create admin user for Logto Admin Console access
create_admin_user() {
    log_step "Creating admin user for Admin Console: $ADMIN_USER_USERNAME..."

    # Check if admin user exists
    local existing_user=$(curl -s "${LOGTO_ENDPOINT}/api/users?search=${ADMIN_USER_USERNAME}" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id // empty')

    local admin_user_id=""

    if [ -n "$existing_user" ] && [ "$existing_user" != "null" ]; then
        log_info "Admin user already exists with ID: $existing_user"
        admin_user_id="$existing_user"

        # Update password
        log_info "Updating admin user password..."
        curl -s -X PATCH "${LOGTO_ENDPOINT}/api/users/${existing_user}/password" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"password\": \"${ADMIN_USER_PASSWORD}\"}" > /dev/null
    else
        # Create new admin user
        local response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/users" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"primaryEmail\": \"${ADMIN_USER_EMAIL}\",
                \"username\": \"${ADMIN_USER_USERNAME}\",
                \"password\": \"${ADMIN_USER_PASSWORD}\"
            }")

        admin_user_id=$(echo "$response" | jq -r '.id // empty')

        if [ -z "$admin_user_id" ] || [ "$admin_user_id" = "null" ]; then
            log_error "Failed to create admin user"
            echo "$response" | jq '.'
            exit 1
        fi

        log_info "Admin user created with ID: $admin_user_id"
    fi

    # Assign admin user to default tenant organization with admin role
    log_info "Assigning admin role to user..."

    # Get the default tenant organization ID (t-default)
    local org_id="t-default"

    # Check if user is already in organization
    local org_membership=$(curl -s "${LOGTO_ENDPOINT}/api/organizations/${org_id}/users/${admin_user_id}" \
        -H "Authorization: Bearer $TOKEN" 2>/dev/null | jq -r '.id // empty')

    if [ -z "$org_membership" ] || [ "$org_membership" = "null" ]; then
        # Add user to organization
        curl -s -X POST "${LOGTO_ENDPOINT}/api/organizations/${org_id}/users" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"userIds\": [\"${admin_user_id}\"]}" > /dev/null 2>&1
        log_info "User added to default organization"
    fi

    # Get admin role ID in organization
    local admin_role_id=$(curl -s "${LOGTO_ENDPOINT}/api/organization-roles" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name == "admin") | .id // empty')

    if [ -n "$admin_role_id" ] && [ "$admin_role_id" != "null" ]; then
        # Assign admin role in organization
        curl -s -X POST "${LOGTO_ENDPOINT}/api/organizations/${org_id}/users/${admin_user_id}/roles" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"organizationRoleIds\": [\"${admin_role_id}\"]}" > /dev/null 2>&1
        log_info "Admin role assigned in organization"
    else
        log_warn "Could not find admin role, user may have limited console access"
    fi

    # Also try to assign user-level admin roles if they exist
    local user_admin_role_id=$(curl -s "${LOGTO_ENDPOINT}/api/roles" \
        -H "Authorization: Bearer $TOKEN" | jq -r '.[] | select(.name == "admin" or .name == "Admin") | .id // empty' | head -1)

    if [ -n "$user_admin_role_id" ] && [ "$user_admin_role_id" != "null" ]; then
        curl -s -X POST "${LOGTO_ENDPOINT}/api/users/${admin_user_id}/roles" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"roleIds\": [\"${user_admin_role_id}\"]}" > /dev/null 2>&1
        log_info "User-level admin role assigned"
    fi

    log_info "Admin user setup complete"
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
        run_psql_query "UPDATE applications SET id = '$OIDC_APP_ID', secret = '$OIDC_APP_SECRET' WHERE id = '$app_id' AND tenant_id = 'default';"
        log_info "Application ID and secret configured"
    else
        log_warn "Application may already exist or creation failed"
        echo "$response" | jq '.'
    fi
}

# SAML App configuration (Logto as SAML IdP)
# Logto can act as a SAML Identity Provider via SAML applications
SAML_APP_ID="syngrisi-saml-app"
SAML_APP_NAME="syngrisi-e2e-saml"
SAML_ENTITY_ID="syngrisi-e2e-sp"
# SAML ACS URLs for E2E testing (base port 3002 + worker CID for parallel execution)
# Note: Logto SAML app only supports single ACS URL, so we use 127.0.0.1 (matches test backend host)
SAML_ACS_URL="http://127.0.0.1:3002/v1/auth/sso/saml/callback"
# Additional ACS URLs for parallel workers (3002-3011) - will be added via API update
SAML_ACS_URLS_JSON='[
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3002/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3003/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3004/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3005/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3006/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3007/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3008/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3009/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3010/v1/auth/sso/saml/callback"},
    {"binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST", "url": "http://127.0.0.1:3011/v1/auth/sso/saml/callback"}
]'

# Create or update SAML application for Syngrisi (Logto as IdP)
create_saml_app() {
    log_step "Creating SAML application: $SAML_APP_NAME (Logto as IdP)..."

    # Check if SAML app exists using /api/applications?types=SAML
    # Get the FIRST matching app (there might be multiple if previous runs created duplicates)
    local existing_app=$(curl -s "${LOGTO_ENDPOINT}/api/applications?types=SAML" \
        -H "Authorization: Bearer $TOKEN" | jq -r "[.[] | select(.name==\"${SAML_APP_NAME}\")] | first | .id // empty")

    if [ -n "$existing_app" ] && [ "$existing_app" != "null" ]; then
        log_info "SAML application already exists with ID: $existing_app"
        SAML_APP_ID="$existing_app"

        # Update the existing app with correct settings
        log_info "Updating SAML application settings..."
        curl -s -X PATCH "${LOGTO_ENDPOINT}/api/saml-applications/${SAML_APP_ID}" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"entityId\": \"${SAML_ENTITY_ID}\",
                \"acsUrl\": {
                    \"binding\": \"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\",
                    \"url\": \"${SAML_ACS_URL}\"
                },
                \"nameIdFormat\": \"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress\"
            }" > /dev/null

        log_info "SAML application updated"
        return 0
    fi

    # Create new SAML application
    # Logto SAML app requires: name, description, and SAML config (entityId, acsUrl)
    # Note: Use proper SAML binding format per OASIS spec
    local response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/saml-applications" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${SAML_APP_NAME}\",
            \"description\": \"SAML app for Syngrisi E2E testing\",
            \"entityId\": \"${SAML_ENTITY_ID}\",
            \"acsUrl\": {
                \"binding\": \"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\",
                \"url\": \"${SAML_ACS_URL}\"
            },
            \"nameIdFormat\": \"urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress\"
        }")

    local app_id=$(echo "$response" | jq -r '.id // empty')

    if [ -n "$app_id" ] && [ "$app_id" != "null" ]; then
        SAML_APP_ID="$app_id"
        log_info "SAML application created with ID: $app_id"

        # Create signing certificate for the SAML application
        log_info "Creating SAML signing certificate..."
        local cert_response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/saml-applications/${SAML_APP_ID}/secrets" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"lifeSpanInYears": 5}')

        if echo "$cert_response" | jq -e '.id' > /dev/null 2>&1; then
            log_info "SAML signing certificate created"
        else
            log_warn "Could not create signing certificate: $cert_response"
        fi
    else
        log_warn "SAML application creation may have failed"
        log_warn "Response: $response"

        # Try with minimal required fields
        log_info "Trying with minimal fields..."
        response=$(curl -s -X POST "${LOGTO_ENDPOINT}/api/saml-applications" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"name\": \"${SAML_APP_NAME}\",
                \"description\": \"SAML app for Syngrisi E2E testing\"
            }")
        app_id=$(echo "$response" | jq -r '.id // empty')
        if [ -n "$app_id" ] && [ "$app_id" != "null" ]; then
            SAML_APP_ID="$app_id"
            log_info "SAML application created with ID: $app_id"

            # Update with SAML settings
            curl -s -X PATCH "${LOGTO_ENDPOINT}/api/saml-applications/${SAML_APP_ID}" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "{
                    \"entityId\": \"${SAML_ENTITY_ID}\",
                    \"acsUrl\": {
                        \"binding\": \"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\",
                        \"url\": \"${SAML_ACS_URL}\"
                    }
                }" > /dev/null
        fi
    fi
}

# Get SAML IdP metadata and certificate from Logto
get_saml_metadata() {
    log_step "Getting SAML IdP configuration from Logto..."

    if [ -z "$SAML_APP_ID" ] || [ "$SAML_APP_ID" = "syngrisi-saml-app" ]; then
        log_warn "SAML app ID not set, skipping metadata retrieval"
        return 0
    fi

    # Logto SAML endpoints
    # SSO URL: /api/saml/{id}/authn (HTTP Redirect binding)
    # Metadata: /api/saml-applications/{id}/metadata (requires /api/ prefix)
    SAML_SSO_URL="${LOGTO_ENDPOINT}/api/saml/${SAML_APP_ID}/authn"
    SAML_METADATA_URL="${LOGTO_ENDPOINT}/api/saml-applications/${SAML_APP_ID}/metadata"

    log_info "SAML SSO URL: $SAML_SSO_URL"
    log_info "SAML Metadata URL: $SAML_METADATA_URL"

    # Get certificate from Management API (secrets endpoint)
    log_info "Fetching SAML signing certificate..."
    local secrets_response=$(curl -s "${LOGTO_ENDPOINT}/api/saml-applications/${SAML_APP_ID}/secrets" \
        -H "Authorization: Bearer $TOKEN")

    # Get the active certificate
    SAML_CERT=$(echo "$secrets_response" | jq -r '[.[] | select(.active == true)][0].certificate // empty')

    if [ -n "$SAML_CERT" ] && [ "$SAML_CERT" != "null" ]; then
        # Remove PEM headers/footers and newlines for passport-saml
        SAML_CERT_CLEAN=$(echo "$SAML_CERT" | sed 's/-----BEGIN CERTIFICATE-----//g' | sed 's/-----END CERTIFICATE-----//g' | tr -d '\r\n' | tr -d ' ')
        log_info "SAML certificate retrieved (${#SAML_CERT_CLEAN} chars)"
    else
        log_warn "Could not find active SAML certificate"
        # Try first certificate if no active one
        SAML_CERT=$(echo "$secrets_response" | jq -r '.[0].certificate // empty')
        if [ -n "$SAML_CERT" ] && [ "$SAML_CERT" != "null" ]; then
            SAML_CERT_CLEAN=$(echo "$SAML_CERT" | sed 's/-----BEGIN CERTIFICATE-----//g' | sed 's/-----END CERTIFICATE-----//g' | tr -d '\r\n' | tr -d ' ')
            log_info "Using first available certificate (${#SAML_CERT_CLEAN} chars)"
        else
            log_warn "No SAML certificates found"
        fi
    fi

    # Set IdP entity ID (from Logto SAML metadata - format: /saml/{id})
    SAML_IDP_ENTITY_ID="${LOGTO_ENDPOINT}/saml/${SAML_APP_ID}"
    log_info "SAML IdP Entity ID: $SAML_IDP_ENTITY_ID"
}

# Save configuration to file
save_config() {
    log_step "Saving configuration to provisioned-config.json..."

    cat > "${SCRIPT_DIR}/provisioned-config.json" << EOF
{
  "oauth2": {
    "app": {
      "clientId": "${OIDC_APP_ID}",
      "clientSecret": "${OIDC_APP_SECRET}",
      "appName": "${OIDC_APP_NAME}"
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
  },
  "saml": {
    "appId": "${SAML_APP_ID}",
    "spEntityId": "${SAML_ENTITY_ID}",
    "idpEntityId": "${SAML_IDP_ENTITY_ID:-${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}}",
    "acsUrl": "${SAML_ACS_URL}",
    "idpEndpoint": "${LOGTO_ENDPOINT}",
    "metadataUrl": "${SAML_METADATA_URL:-${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}/metadata}",
    "certificate": "${SAML_CERT_CLEAN:-}",
    "endpoints": {
      "entryPoint": "${SAML_SSO_URL:-${LOGTO_ENDPOINT}/api/saml/${SAML_APP_ID}/authn}",
      "issuer": "${SAML_IDP_ENTITY_ID:-${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}}"
    },
    "env": {
      "SSO_ENABLED": "true",
      "SSO_PROTOCOL": "saml",
      "SSO_ENTRY_POINT": "${SAML_SSO_URL:-${LOGTO_ENDPOINT}/api/saml/${SAML_APP_ID}/authn}",
      "SSO_ISSUER": "${SAML_ENTITY_ID}",
      "SSO_IDP_ISSUER": "${SAML_IDP_ENTITY_ID:-${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}}",
      "SSO_CERT": "${SAML_CERT_CLEAN:-}"
    }
  },
  "user": {
    "email": "${TEST_USER_EMAIL}",
    "password": "${TEST_USER_PASSWORD}",
    "username": "${TEST_USER_USERNAME}"
  },
  "admin": {
    "email": "${ADMIN_USER_EMAIL}",
    "password": "${ADMIN_USER_PASSWORD}",
    "username": "${ADMIN_USER_USERNAME}",
    "consoleUrl": "http://localhost:${LOGTO_ADMIN_PORT:-3050}"
  },
  "app": {
    "clientId": "${OIDC_APP_ID}",
    "clientSecret": "${OIDC_APP_SECRET}",
    "appName": "${OIDC_APP_NAME}"
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
    create_admin_user
    configure_admin_experience
    create_oidc_app
    create_saml_app
    get_saml_metadata
    save_config

    echo ""
    echo "========================================"
    log_info "Provisioning complete!"
    echo "========================================"
    echo ""
    echo "Test user credentials:"
    echo "  Username: ${TEST_USER_USERNAME}"
    echo "  Password: ${TEST_USER_PASSWORD}"
    echo ""
    echo "Admin Console credentials:"
    echo "  Username: ${ADMIN_USER_USERNAME}"
    echo "  Password: ${ADMIN_USER_PASSWORD}"
    echo "  URL:      http://localhost:${LOGTO_ADMIN_PORT:-3050}"
    echo ""
    echo "OIDC Application:"
    echo "  Client ID:     ${OIDC_APP_ID}"
    echo "  Client Secret: ${OIDC_APP_SECRET}"
    echo ""
}

main "$@"
