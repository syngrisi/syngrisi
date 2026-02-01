@sso-metadata @no-app-start
Feature: SSO Metadata Endpoints
  # Tests for SAML metadata functionality:
  # - SP metadata endpoint for IdP configuration
  # - Response validation for various SSO configurations

  @smoke
  Scenario: SP Metadata endpoint returns valid XML when SAML is configured
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SSO_ENABLED: true
      SSO_PROTOCOL: saml
      SSO_ENTRY_POINT: https://mock-idp.test/saml/sso
      SSO_ISSUER: https://syngrisi.test
      SSO_CERT: MIIDpDCCAoygAwIBAgIGAXoTY8aJMA0GCSqGSIb3DQEBCwUA
      SYNGRISI_TEST_MODE: true
      """
    Given I start Server

    When I request "GET" "/v1/auth/sso/metadata"
    Then the response status should be 200
    And the response body should contain "EntityDescriptor"
    And the response body should contain "AssertionConsumerService"
    And the response body should contain "syngrisi.test"

  Scenario: SP Metadata endpoint returns error when OAuth2 is configured instead of SAML
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SSO_ENABLED: true
      SSO_PROTOCOL: oauth2
      SSO_CLIENT_ID: test-client
      SSO_CLIENT_SECRET: test-secret
      SSO_AUTHORIZATION_URL: http://localhost:3001/oidc/auth
      SSO_TOKEN_URL: http://localhost:3001/oidc/token
      SYNGRISI_TEST_MODE: true
      """
    Given I start Server

    When I request "GET" "/v1/auth/sso/metadata"
    Then the response status should be 400
    And the response body should contain "SAML not configured"

  Scenario: SP Metadata endpoint returns error when SSO is disabled
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SSO_ENABLED: false
      SYNGRISI_TEST_MODE: true
      """
    Given I start Server

    When I request "GET" "/v1/auth/sso/metadata"
    Then the response status should be 400

  Scenario: SP Metadata endpoint returns error when SAML is partially configured
    # Missing SSO_ENTRY_POINT and SSO_CERT - explicitly clear them
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SSO_ENABLED: true
      SSO_PROTOCOL: saml
      SSO_ISSUER: https://syngrisi.test
      SSO_ENTRY_POINT: ""
      SSO_CERT: ""
      SSO_IDP_METADATA_URL: ""
      SYNGRISI_TEST_MODE: true
      """
    Given I start Server

    When I request "GET" "/v1/auth/sso/metadata"
    Then the response status should be 400
    And the response body should contain "not initialized"

  @sso-external @slow @saml @no-app-start
  Scenario: SP Metadata endpoint with Logto SAML configuration
    # This test uses auto-provisioned SAML config from Logto
    # Logto must be running: ./support/sso/start-containers.sh

    When I configure SAML SSO with auto-provisioned settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      SYNGRISI_APP_PORT: 3002
      """
    Given I start Server

    When I request "GET" "/v1/auth/sso/metadata"
    Then the response status should be 200
    And the response body should contain "EntityDescriptor"
    And the response body should contain "AssertionConsumerService"
