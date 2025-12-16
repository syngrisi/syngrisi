@demo @sso-logto @slow
Feature: SSO - Demo - Logto Login via Admin UI Setup
  # Demo of the Logto OAuth2 SSO login flow after configuring Syngrisi with Logto-provisioned settings.
  # Highlights: SSO entrypoint, Logto login form, redirect back to Syngrisi dashboard.

  Background:
    # Enable SSO and start Logto test infra with provisioned credentials
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Logto SSO infrastructure
    And I configure Syngrisi SSO env from provisioned Logto app
    Given I start Server

  Scenario: Demo: Logto SSO login from Syngrisi
    When I reload session
    When I open the app

    # Welcome & context
    When I announce: "Welcome to the Logto SSO demo. Let's sign in through our identity provider without typing Syngrisi credentials."
    Then the title is "Login Page"

    # Show SSO entrypoint
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "This Single Sign-On button sends us to Logto for secure authentication."
    Then the SSO login button should be visible
    When I clear highlight

    # Go to Logto
    When I click SSO login button
    When I announce: "We are now on the Logto login page. I'll use the provisioned test user."

    # Logto form
    When I highlight element "input[name='identifier']"
    When I announce: "First, I enter the username provided by the identity provider."
    When I login to Logto with provisioned user

    # Back to app
    When I announce: "Logto returned an authorization code that Syngrisi exchanged for tokens. We are back and authenticated."
    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    # Show Logto Admin console settings
    When I announce: "Let's quickly look at the Logto admin console to see the configured application."
    When I show Logto admin application settings

    # Wrap up
    When I highlight element "main"
    When I announce: "This completes the SSO flow. The dashboard is available without storing any local password."
    When I clear highlight
    When I end the demo
