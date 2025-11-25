@fast-server
Feature: SSO Authentication

    Background:
        # Enable SSO via env variables (simulating DB settings)
        When I set env variables:
            """
      SYNGRISI_AUTH: true
      SSO_ENABLED: true
      SSO_PROTOCOL: oauth2
      SSO_CLIENT_ID: mock_client_id
      SSO_CLIENT_SECRET: mock_client_secret
      SYNGRISI_TEST_MODE: true
            """
        Given I start Server

    @smoke
    Scenario: SSO Button Visibility
        When I open the app
        Then the title is "Login Page"
        # Check for SSO button
        Then the element with locator "a[href*='/v1/auth/sso']" should be visible
        # Check fallback (local auth) is still visible
        Then the element with locator "#email" should be visible
        Then the element with locator "#password" should be visible

    Scenario: OAuth2 Login Flow (Mocked)
        When I open the app
        # Intercept SSO initiation request and redirect to callback with success
        When I mock SSO provider redirect to callback with user "sso-user@test.com"

        When I click element with locator "a[href*='/v1/auth/sso']"

        # Expect successful login and redirect to home
        Then the title is "By Runs"

    Scenario: Local Auth Fallback works when SSO is enabled
        When I open the app
        When I login with user:"Administrator" password "Administrator"
        Then the title is "By Runs"
