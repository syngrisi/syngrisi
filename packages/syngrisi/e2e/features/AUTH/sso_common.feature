@sso-common
Feature: SSO Common Scenarios and Edge Cases
    # Common SSO scenarios that don't depend on specific protocol (OAuth2/SAML)
    # These tests verify general SSO functionality and error handling

    Scenario: Login attempt when SSO is disabled
        # Test that SSO redirect is properly handled when SSO is disabled
        When I set env variables:
            """
            SYNGRISI_AUTH: true
            SSO_ENABLED: false
            SYNGRISI_TEST_MODE: true
            """
        Given I start Server

        When I reload session
        When I open the app
        Then the title is "Login Page"
        # SSO button should not be visible when SSO is disabled
        Then SSO login should be disabled

    Scenario: Direct SSO access when disabled redirects to login
        # Test that direct access to /v1/auth/sso redirects properly when SSO is disabled
        When I set env variables:
            """
            SYNGRISI_AUTH: true
            SSO_ENABLED: false
            SYNGRISI_TEST_MODE: true
            """
        Given I start Server

        When I reload session
        When I try to access SSO directly
        Then the current url contains "/auth"

    @sso-external @slow
    Scenario: Logout functionality clears session
        # Test that logout properly destroys the session
        # Requires Logto to be running (OAuth2 test)
        When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
        When I set env variables:
            """
            SYNGRISI_AUTH: true
            SYNGRISI_TEST_MODE: false
            """
        Given I start Server

        # First login via SSO
        Then Logto SSO should be available
        When I reload session
        When I open the app
        When I click SSO login button
        When I login to Logto with username "testuser" and password "Test123!"
        Then I should be redirected back to the app
        Then I should be authenticated via SSO

        # Now logout
        When I go to "logout" page
        Then the current url contains "/auth"

        # Verify session is destroyed - accessing app should redirect to login
        Then my session should be destroyed

    @sso-external @slow
    Scenario: OAuth Account Linking - existing local user
        # Test that existing local users are linked when they login via OAuth
        # with the same email
        When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
        When I set env variables:
            """
            SYNGRISI_AUTH: true
            SYNGRISI_TEST_MODE: true
            """
        Given I start Server

        Then Logto SSO should be available

        When I reload session
        When I open the app
        When I click SSO login button

        # Login with existing test user email (test@syngrisi.test)
        When I login to Logto with username "testuser" and password "Test123!"

        Then I should be redirected back to the app
        Then I should be authenticated via SSO
        # The user's provider should be updated to 'oauth'
        Then the user "test@syngrisi.test" should have provider type "oauth"

    @sso-external @slow
    Scenario: OAuth User Creation - new user
        # Test that new users are created when they login via OAuth
        # with an email that doesn't exist in the database
        When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
        When I set env variables:
            """
            SYNGRISI_AUTH: true
            SYNGRISI_TEST_MODE: true
            """
        Given I start Server

        Then Logto SSO should be available

        When I reload session
        When I open the app
        When I click SSO login button

        # Login as testuser (email: test@syngrisi.test)
        When I login to Logto with username "testuser" and password "Test123!"

        Then I should be redirected back to the app
        Then I should be authenticated via SSO
        # New users should be created with 'user' role by default
        Then a new user "test@syngrisi.test" should be created with role "user"

    Scenario: SSO button visibility based on configuration
        # Test that SSO button is visible only when SSO is enabled
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

        When I reload session
        When I open the app
        Then the title is "Login Page"
        Then the SSO login button should be visible
