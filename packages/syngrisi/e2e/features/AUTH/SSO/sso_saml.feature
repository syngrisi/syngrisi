@sso-external @slow @saml
Feature: SSO Authentication with SAML 2.0
  # SAML 2.0 SSO tests using Logto as SAML Identity Provider
  #
  # Prerequisites:
  # 1. Logto must be running: ./support/sso/start-containers.sh
  # 2. Provisioning completed: ./support/sso/provision-logto-api.sh
  # 3. Run: npm run test:e2e -- --grep "@saml"
  #
  # Logto acts as SAML IdP and Syngrisi acts as SAML SP (Service Provider)
  # User authentication happens through Logto's standard login page
  #
  # Test credentials (from provisioned-config.json):
  # - Username: testuser
  # - Password: Test123!

  Background:
    # @sso-external tag expects Logto to be already running
    # Configure SAML SSO with provisioned settings
    When I configure SAML SSO with auto-provisioned settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Server

  Scenario: Full SAML Login Flow with Logto IdP
    # The SAML flow uses Logto's standard login UI

    # Clear any existing session
    When I reload session
    When I open the app
    Then the title is "Login Page"
    Then the SSO login button should be visible

    # Click SSO button - will redirect to Logto SAML IdP
    When I click SSO login button

    # Login on Logto IdP side (uses same login page as OAuth)
    When I login to Logto with username "testuser" and password "Test123!"

    # Should be redirected back to app and authenticated
    Then I should be redirected back to the app
    Then I should be authenticated via SSO

  Scenario: SAML Account Linking - existing local user
    # Test that existing local users are linked when they login via SAML
    # with the same email

    # Reset user to 'local' provider to ensure test isolation
    When I reset user "test@syngrisi.test" provider to local

    When I reload session
    When I open the app
    When I click SSO login button

    # Login with existing test user email (test@syngrisi.test)
    When I login to Logto with username "testuser" and password "Test123!"

    Then I should be redirected back to the app
    Then I should be authenticated via SSO
    # The user's provider should be updated to 'saml'
    Then the user "test@syngrisi.test" should have provider type "saml"

  Scenario: SAML User Creation - new user
    # Test that new users are created when they login via SAML
    # with an email that doesn't exist in the database

    When I reload session
    When I open the app
    When I click SSO login button

    # Login as testuser (email: test@syngrisi.test)
    When I login to Logto with username "testuser" and password "Test123!"

    Then I should be redirected back to the app
    Then I should be authenticated via SSO
    # New users should be created with 'reviewer' role by default
    Then a new user "test@syngrisi.test" should be created with role "reviewer"
