@demo @sso-external @slow
Feature: SSO OAuth2 Authentication Demo
  # Demonstration of OAuth2 SSO authentication flow with Logto
  #
  # Prerequisites:
  # 1. Run: ./e2e/support/sso/setup-logto.sh
  # 2. Or run with: npm run test:e2e -- --grep "@demo.*OAuth2"
  #
  # This demo showcases:
  # - OAuth2 SSO configuration
  # - Login flow through Logto Identity Provider
  # - User authentication and redirect back to Syngrisi

  Background:
    # Configure SSO with Logto endpoints (credentials from provisioned-config.json)
    When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Server

  Scenario: Demo: OAuth2 SSO Login with Logto Identity Provider
    # Verify Logto infrastructure is available
    Then Logto SSO should be available

    # Start with clean session
    When I reload session
    When I open the app

    # Welcome & Context
    When I announce: "Welcome to the Syngrisi SSO demonstration. We will show how OAuth2 authentication works with Logto Identity Provider."
    Then the title is "Login Page"

    # Highlight SSO button
    When I announce: "First, notice the Single Sign-On button on the login page. This button enables authentication through an external identity provider."
    And I highlight element "a[href*='/v1/auth/sso']"
    Then the SSO login button should be visible

    # Click SSO button - will redirect to Logto
    When I announce: "When we click this button, Syngrisi will redirect you to the Logto Identity Provider for secure authentication."
    And I clear highlight
    When I click SSO login button

    # Wait for Logto page and announce
    When I announce: "Now we are on the Logto Identity Provider login page. Here, users authenticate using their corporate or organizational credentials."

    # Highlight username field
    When I highlight element "input[name='identifier']"
    When I announce: "First, we enter the username. In a real scenario, this would be your organizational username or email address."

    # Login on Logto side with provisioned test user
    When I login to Logto with username "testuser" and password "Test123!"

    # Explain OAuth flow
    When I announce: "After successful authentication, Logto issues an OAuth2 authorization code. Syngrisi exchanges this code for an access token to verify your identity."

    # Should be redirected back to app and authenticated
    Then I should be redirected back to the app

    # Success announcement
    When I announce: "Excellent! You have been successfully authenticated via OAuth2 SSO and redirected back to Syngrisi."
    Then I should be authenticated via SSO

    # Highlight main page elements
    When I highlight element "h1"
    When I announce: "You are now on the main dashboard. Notice that no password was stored in Syngrisi - all authentication is handled securely by the Identity Provider."

    # Clear and finish
    When I clear highlight
    When I announce: "This OAuth2 SSO flow provides secure, centralized authentication for your organization. Fantastic!"
    And I end the demo

  Scenario: Demo: OAuth2 Configuration Overview
    # This scenario demonstrates the configuration aspects without full login
    Then Logto SSO should be available

    When I reload session
    When I open the app

    # Configuration explanation
    When I announce: "Let me show you how OAuth2 SSO is configured in Syngrisi."
    Then the title is "Login Page"

    # Show SSO button
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "OAuth2 SSO requires several configuration parameters: Client ID, Client Secret, Authorization URL, Token URL, and Callback URL."

    When I announce: "The Client ID identifies your Syngrisi application to the Identity Provider. The Client Secret is used to securely exchange authorization codes for access tokens."

    When I announce: "The Authorization URL is where users are redirected to log in. The Token URL is where Syngrisi exchanges codes for tokens."

    When I announce: "Finally, the Callback URL is where the Identity Provider redirects users after successful authentication."

    # Configuration is complete
    When I clear highlight
    When I announce: "With these parameters configured, Syngrisi can securely integrate with any OAuth2-compliant Identity Provider."
    And I end the demo

  Scenario: Demo: OAuth2 Account Linking
    # Demonstrate how existing users are linked to OAuth provider
    Then Logto SSO should be available

    # Reset user to 'local' provider to demonstrate linking
    When I reset user "test@syngrisi.test" provider to local

    When I reload session
    When I open the app

    # Explain account linking
    When I announce: "This demonstration shows how OAuth2 handles existing Syngrisi users. If a user with the same email already exists, their account is automatically linked to the OAuth provider."
    Then the title is "Login Page"

    # Highlight SSO button and explain
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "When this existing user logs in via SSO, Syngrisi will match the email address and link the accounts seamlessly."

    # Click SSO and login
    When I clear highlight
    When I click SSO login button

    # Login with existing user email
    When I announce: "Authenticating with the test user who already exists in the Syngrisi database."
    When I login to Logto with username "testuser" and password "Test123!"

    # Verify redirect and authentication
    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    # Verify account was linked
    Then the user "test@syngrisi.test" should have provider type "oauth"

    # Success message
    When I announce: "Perfect! The existing local account has been successfully linked to the OAuth provider. Future logins will use SSO authentication."
    And I end the demo
