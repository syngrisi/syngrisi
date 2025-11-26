@sso-external @slow
Feature: SSO Authentication with Logto
    # Real SSO tests using Logto containers
    # Requires Apple container CLI to be installed
    #
    # Prerequisites:
    # 1. Run: ./e2e/support/sso/setup-logto.sh
    # 2. Or run with: npm run test:e2e -- --grep "@sso-logto"
    #
    # Test credentials (from provisioning):
    # - Username: testuser / Password: Test123!
    # - Email: test@syngrisi.test (if email connector is enabled)

    Background:
        # @sso-external tag expects Logto to be already running (via setup-logto.sh)
        # Configure SSO with Logto endpoints (credentials from provisioned-config.json)
        When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
        When I set env variables:
            """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
            """
        Given I start Server

    Scenario: Logto infrastructure is available
        Then Logto SSO should be available

    Scenario: Full OAuth2 Login Flow with Logto
        Then Logto SSO should be available

        # Clear any existing session from previous tests
        When I reload session
        When I open the app
        Then the title is "Login Page"
        Then the SSO login button should be visible

        # Click SSO button - will redirect to Logto
        When I click SSO login button

        # Login on Logto side with provisioned test user (using username)
        When I login to Logto with username "testuser" and password "Test123!"

        # Should be redirected back to app and authenticated
        Then I should be redirected back to the app
        Then I should be authenticated via SSO

    # TODO: Requires Logto email verification setup
    # Scenario: SSO creates new user on first login
    #     Then Logto SSO should be available
    #
    #     When I open the app
    #     When I click SSO login button
    #
    #     # Login with a new email (Logto allows sign-up during login)
    #     When I login to Logto with email "newuser@syngrisi.test" and password "Test123!"
    #
    #     Then I should be redirected back to the app
    #     Then I should be authenticated via SSO

    Scenario: Local Auth Fallback works with real SSO
        When I reload session
        When I open the app
        When I login with user:"Administrator" password "Administrator"
        Then the title is "By Runs"
