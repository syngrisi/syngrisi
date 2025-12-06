@demo @sso-external @slow @saml @sso
Feature: SSO SAML 2.0 Authentication Demo
  # Demonstration of SAML 2.0 SSO authentication flow with Logto
  #
  # Prerequisites:
  # 1. Logto must be running: ./support/sso/start-containers.sh
  # 2. Provisioning completed: ./support/sso/provision-logto-api.sh
  # 3. Run: npm run test:e2e -- --grep "@demo.*SAML"
  #
  # This demo showcases:
  # - SAML 2.0 SSO configuration
  # - Login flow through Logto as SAML Identity Provider
  # - SAML assertion processing and user authentication

  Background:
    # Configure SAML SSO with provisioned settings
    When I configure SAML SSO with auto-provisioned settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Server

  Scenario: Demo: SAML 2.0 SSO Login with Logto IdP
    # Start with clean session
    When I reload session
    When I open the app

    # Welcome & Context
    When I announce: "Welcome to the SAML 2.0 SSO demonstration. We will show how enterprise-grade SAML authentication works with Syngrisi."
    Then the title is "Login Page"

    # Explain SAML
    When I announce: "SAML 2.0 is a widely adopted standard for enterprise single sign-on. It is commonly used with Microsoft Active Directory, Okta, and other identity management systems."

    # Highlight SSO button
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "Notice the Single Sign-On button. With SAML, Syngrisi acts as a Service Provider, delegating authentication to your Identity Provider."
    Then the SSO login button should be visible

    # Explain SAML flow
    When I announce: "When you click this button, Syngrisi generates a SAML authentication request and redirects you to the Identity Provider."
    And I clear highlight

    # Click SSO button - will redirect to Logto SAML IdP
    When I click SSO login button

    # Wait for Logto IdP page
    When I announce: "Now we are on the Logto Identity Provider. In a real enterprise scenario, this would be your organization's SAML IdP, such as Active Directory Federation Services or Okta."

    # Highlight login form
    When I highlight element "input[name='identifier']"
    When I announce: "Users authenticate using their organizational credentials. The Identity Provider validates these credentials securely."

    # Login on Logto IdP side
    When I login to Logto with username "testuser" and password "Test123!"

    # Explain SAML assertion
    When I announce: "After successful authentication, the Identity Provider creates a digitally signed SAML assertion containing user information and sends it back to Syngrisi."

    # Should be redirected back to app and authenticated
    Then I should be redirected back to the app

    # Success message
    When I announce: "Excellent! Syngrisi has validated the SAML assertion and established your authenticated session."
    Then I should be authenticated via SSO

    # Highlight main dashboard
    When I highlight element "h1"
    When I announce: "You are now securely authenticated. All user information came from the SAML assertion - no passwords were transmitted to or stored in Syngrisi."

    # Final message
    When I clear highlight
    When I announce: "This SAML 2.0 flow provides enterprise-grade security and centralized identity management. Fantastic!"
    And I end the demo

  Scenario: Demo: SAML Configuration and Trust
    # This scenario demonstrates SAML configuration aspects
    When I reload session
    When I open the app

    # Introduction to SAML configuration
    When I announce: "Let me explain how SAML 2.0 trust relationships are established between Syngrisi and your Identity Provider."
    Then the title is "Login Page"

    # Show SSO button
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "SAML configuration requires several key components. First, the Identity Provider Entry Point - this is the URL where authentication requests are sent."

    When I announce: "Second, the Service Provider Entity ID - this uniquely identifies Syngrisi to your Identity Provider."

    When I announce: "Third, and most importantly, the IdP Signing Certificate. This certificate is used to verify that SAML assertions genuinely come from your trusted Identity Provider."

    When I announce: "The certificate creates a cryptographic trust relationship, ensuring that only your authorized Identity Provider can authenticate users to Syngrisi."

    When I announce: "Additionally, you need to configure the Assertion Consumer Service URL in your Identity Provider. This tells the IdP where to send SAML assertions after successful authentication."

    # Clear and finish
    When I clear highlight
    When I announce: "With these components properly configured, you have a secure, enterprise-ready SAML integration."
    And I end the demo

  Scenario: Demo: SAML Account Linking
    # Demonstrate how existing users are linked to SAML provider
    # Reset user to 'local' provider to demonstrate linking
    When I reset user "test@syngrisi.test" provider to local

    When I reload session
    When I open the app

    # Explain SAML account linking
    When I announce: "This demonstration shows SAML account linking. When an existing Syngrisi user logs in via SAML, their account is automatically linked to the SAML provider."
    Then the title is "Login Page"

    # Highlight SSO button
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "Account linking works by matching the email address in the SAML assertion with existing user accounts in Syngrisi."

    # Click SSO and login
    When I clear highlight
    When I click SSO login button

    # Explain assertion processing
    When I announce: "During authentication, the Identity Provider includes user attributes in the SAML assertion, such as email, display name, and groups."

    # Login with existing user
    When I login to Logto with username "testuser" and password "Test123!"

    # Verify redirect and authentication
    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    # Verify account was linked
    Then the user "test@syngrisi.test" should have provider type "saml"

    # Success message
    When I announce: "Perfect! The existing local account has been successfully linked to the SAML provider. This user will now authenticate via SAML for all future logins."
    And I end the demo

  Scenario: Demo: SAML User Provisioning
    # Demonstrate automatic user creation from SAML assertion
    When I reload session
    When I open the app

    # Introduction
    When I announce: "This demonstration shows SAML user provisioning. When a new user authenticates via SAML for the first time, Syngrisi automatically creates their account."
    Then the title is "Login Page"

    # Explain Just-in-Time provisioning
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "This is called Just-in-Time provisioning. User information from the SAML assertion is used to create the Syngrisi account automatically."

    # Click SSO
    When I clear highlight
    When I click SSO login button

    # Explain user attributes
    When I announce: "The SAML assertion contains user attributes such as email, name, and potentially group memberships. Syngrisi uses these to populate the new user account."

    # Login
    When I login to Logto with username "testuser" and password "Test123!"

    # Verify redirect and authentication
    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    # Verify new user creation
    Then a new user "test@syngrisi.test" should be created with role "reviewer"

    # Success message
    When I announce: "Excellent! A new user account was automatically created with the reviewer role. This streamlines onboarding - no manual account creation required."
    And I end the demo
