@demo @slow @saml @sso
Feature: SSO SAML Setup Demo
  # Educational demonstration of SAML SSO configuration
  #
  # This demo consists of three parts:
  # Part 1: Identity Provider (IdP) Configuration - Educational overview
  # Part 2: Service Provider (SP) Configuration - Configuring Syngrisi to use SAML
  # Part 3: Complete Flow Demo - End-to-end SSO login demonstration
  #
  # Prerequisites:
  # - Part 1: No external services required (educational only)
  # - Parts 2 & 3: Logto must be running: ./support/sso/start-containers.sh
  #
  # Run all: yarn test:demo -- --grep "SSO SAML Setup"

  # ═══════════════════════════════════════════════════════════════════════════
  # PART 1: IDENTITY PROVIDER (IdP) CONFIGURATION (educational overview)
  # ═══════════════════════════════════════════════════════════════════════════

  Scenario: Demo Part 1: Understanding IdP Configuration for SAML
    # This scenario explains what needs to be configured in any IdP
    # (Okta, Azure AD, Logto, Keycloak, etc.) to enable SAML SSO with Syngrisi

    # Introduction - show Syngrisi login page
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SSO_ENABLED: false
      SYNGRISI_TEST_MODE: true
      """
    Given I start Server

    When I reload session
    When I open the app

    When I announce: "Welcome to Part 1: Understanding IdP Configuration for SAML"
    Then the title is "Login Page"

    When I announce: "This is Syngrisi - a visual regression testing tool."
    When I announce: "We want to enable Single Sign-On (SSO) using SAML 2.0."
    When I announce: "To do this, we need to configure both sides: the Identity Provider (IdP) and Syngrisi."

    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    When I announce: "WHAT YOU NEED TO CONFIGURE IN YOUR IdP (Okta, Azure AD, Logto, etc.)"
    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Configuration 1: ACS URL
    When I announce: "STEP 1: Set the Assertion Consumer Service (ACS) URL"
    When I announce: "This is where your IdP sends SAML responses after authentication."
    When I announce: "For Syngrisi, use: https://your-syngrisi-domain/v1/auth/sso/saml/callback"
    When I announce: "Example: https://syngrisi.example.com/v1/auth/sso/saml/callback"

    # Configuration 2: Entity ID
    When I announce: "STEP 2: Set the Service Provider Entity ID"
    When I announce: "This uniquely identifies Syngrisi to the IdP."
    When I announce: "Use your Syngrisi base URL or a custom identifier."
    When I announce: "Example: https://syngrisi.example.com or syngrisi-production"
    When I announce: "IMPORTANT: This must match SSO_ISSUER in Syngrisi configuration!"

    # Configuration 3: Name ID Format
    When I announce: "STEP 3: Set the Name ID Format"
    When I announce: "This determines how user identity is sent in the SAML assertion."
    When I announce: "Recommended: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    When I announce: "Syngrisi uses email to identify and create users."

    # What IdP provides
    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    When I announce: "WHAT YOUR IdP PROVIDES (copy these to Syngrisi)"
    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    When I announce: "1. SSO URL (Entry Point)"
    When I announce: "   - Where Syngrisi sends authentication requests"
    When I announce: "   - Set as SSO_ENTRY_POINT in Syngrisi"
    When I announce: "   - Example: https://your-idp.com/saml/sso"

    When I announce: "2. IdP Entity ID (Issuer)"
    When I announce: "   - Your IdP's unique identifier"
    When I announce: "   - Set as SSO_IDP_ISSUER in Syngrisi"
    When I announce: "   - Example: https://your-idp.com/saml"

    When I announce: "3. Signing Certificate"
    When I announce: "   - For verifying SAML assertion signatures"
    When I announce: "   - Set as SSO_CERT in Syngrisi"
    When I announce: "   - Usually in X.509 PEM format"

    When I announce: "4. Metadata URL (Recommended!)"
    When I announce: "   - Single URL containing all IdP configuration"
    When I announce: "   - Set as SSO_IDP_METADATA_URL in Syngrisi"
    When I announce: "   - Syngrisi auto-fetches SSO URL, cert, and entity ID"
    When I announce: "   - Example: https://your-idp.com/saml/metadata"

    # Summary
    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    When I announce: "SUMMARY: IdP Configuration Checklist"
    When I announce: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    When I announce: "✓ Create SAML application in your IdP"
    When I announce: "✓ Set ACS URL to: https://your-syngrisi/v1/auth/sso/saml/callback"
    When I announce: "✓ Set SP Entity ID (must match SSO_ISSUER)"
    When I announce: "✓ Set Name ID format to email"
    When I announce: "✓ Copy IdP metadata URL or individual values to Syngrisi"

    When I announce: "In Part 2, we'll configure Syngrisi with these values and test the login flow."
    And I end the demo

  # ═══════════════════════════════════════════════════════════════════════════
  # PART 2: SERVICE PROVIDER (SP) CONFIGURATION (requires Logto)
  # ═══════════════════════════════════════════════════════════════════════════

  @sso-external
  Scenario: Demo Part 2: Configuring Syngrisi as Service Provider (SP)
    # This scenario demonstrates SP configuration with detailed parameter explanations
    # We configure Syngrisi with auto-provisioned settings from Logto

    When I configure SAML SSO with auto-provisioned settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Server

    When I reload session
    When I open the app

    # Introduction
    When I announce: "Welcome to Part 2 of SAML SSO Setup. We will configure Syngrisi as a SAML Service Provider."
    Then the title is "Login Page"

    # Required parameters section
    When I announce: "Let me explain each configuration parameter for Syngrisi."

    # SSO_ENABLED
    When I announce: "PARAMETER 1: SSO_ENABLED=true"
    When I announce: "Purpose: Enables Single Sign-On authentication"
    When I announce: "Effect: Displays the SSO login button on the login page"

    # Show SSO button is visible
    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "With SSO_ENABLED=true, users see this SSO login button."
    Then the SSO login button should be visible
    When I clear highlight

    # SSO_PROTOCOL
    When I announce: "PARAMETER 2: SSO_PROTOCOL=saml"
    When I announce: "Purpose: Specifies the authentication protocol"
    When I announce: "Options: 'saml' for SAML 2.0, 'oauth2' for OAuth2/OIDC"
    When I announce: "Effect: Determines which authentication flow to use"

    # SSO_ISSUER
    When I announce: "PARAMETER 3: SSO_ISSUER"
    When I announce: "Purpose: Service Provider Entity ID"
    When I announce: "Example: https://syngrisi.example.com"
    When I announce: "Must match: The SP Entity ID configured in your IdP"
    When I announce: "Effect: Identifies Syngrisi in SAML requests and assertions"

    # Configuration methods
    When I announce: "Now let's look at how to configure the IdP connection. There are two methods:"

    # Method 1: Metadata URL
    When I announce: "METHOD 1: Automatic via Metadata URL (Recommended)"
    When I announce: "PARAMETER: SSO_IDP_METADATA_URL"
    When I announce: "Purpose: URL to fetch IdP configuration automatically"
    When I announce: "Example: https://your-idp.com/saml/metadata"
    When I announce: "Benefit: Automatically gets SSO URL, certificate, and entity ID"
    When I announce: "Bonus: Certificate rotation is handled automatically"

    # Method 2: Manual
    When I announce: "METHOD 2: Manual Configuration"
    When I announce: "PARAMETER: SSO_ENTRY_POINT"
    When I announce: "Purpose: IdP's SSO URL where authentication requests are sent"
    When I announce: "Example: https://your-idp.com/saml/sso"

    When I announce: "PARAMETER: SSO_CERT"
    When I announce: "Purpose: IdP's signing certificate for verifying SAML assertions"
    When I announce: "Format: PEM format, can include BEGIN/END markers"
    When I announce: "Security: Must be set via environment variable, not UI"

    When I announce: "PARAMETER: SSO_IDP_ISSUER (optional)"
    When I announce: "Purpose: IdP Entity ID for additional validation"
    When I announce: "Benefit: Extra security check to verify assertion source"

    # User management parameters
    When I announce: "Finally, let's configure user management parameters:"

    When I announce: "PARAMETER: SSO_DEFAULT_ROLE"
    When I announce: "Purpose: Default role for new users created via SSO"
    When I announce: "Options: 'reviewer' (default), 'user', 'admin'"
    When I announce: "Effect: Controls what new SSO users can do in Syngrisi"

    When I announce: "PARAMETER: SSO_AUTO_CREATE_USERS"
    When I announce: "Purpose: Automatically create users on first SSO login"
    When I announce: "Default: true"
    When I announce: "If false: Users must be pre-created in Syngrisi"

    When I announce: "PARAMETER: SSO_ALLOW_ACCOUNT_LINKING"
    When I announce: "Purpose: Link SSO identities to existing local accounts by email"
    When I announce: "Default: true"
    When I announce: "Benefit: Existing users can migrate to SSO without losing access"

    # SP Metadata endpoint
    When I announce: "BONUS: SP Metadata Endpoint"
    When I announce: "Syngrisi provides an endpoint to get SP metadata for IdP configuration:"
    When I announce: "GET /v1/auth/sso/metadata"
    When I announce: "Returns XML with Entity ID and ACS URL for your IdP setup"

    # Demo the actual login
    When I announce: "Configuration complete! Let's verify it works with a test login."

    When I highlight element "a[href*='/v1/auth/sso']"
    When I announce: "Click the SSO button to authenticate via SAML."
    When I clear highlight

    When I click SSO login button
    When I announce: "We're now at the Identity Provider. Enter credentials to authenticate."

    When I login to Logto with username "testuser" and password "Test123!"

    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    When I announce: "Success! SAML SSO is fully configured and working."
    When I announce: "The user is now authenticated via SAML with all configured parameters in effect."
    And I end the demo

  # ═══════════════════════════════════════════════════════════════════════════
  # COMPLETE FLOW DEMO (requires Logto)
  # ═══════════════════════════════════════════════════════════════════════════

  @sso-external
  Scenario: Demo: Complete SAML Setup and Login Flow
    # A condensed version showing the full flow from configuration to login

    When I configure SAML SSO with auto-provisioned settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Server

    When I reload session
    When I open the app

    When I announce: "This is a complete SAML SSO demonstration showing configuration and login."

    # Quick config summary
    When I announce: "SAML Configuration Summary:"
    When I announce: "SSO_ENABLED: true (enables SSO)"
    When I announce: "SSO_PROTOCOL: saml (use SAML 2.0)"
    When I announce: "SSO_ISSUER: SP Entity ID"
    When I announce: "SSO_IDP_METADATA_URL: Auto-configure from IdP metadata"
    When I announce: "SSO_DEFAULT_ROLE: reviewer (new user role)"

    # Show and click
    When I highlight element "a[href*='/v1/auth/sso']"
    Then the SSO login button should be visible
    When I clear highlight

    When I click SSO login button
    When I login to Logto with username "testuser" and password "Test123!"

    Then I should be redirected back to the app
    Then I should be authenticated via SSO

    When I announce: "SAML SSO setup and login complete!"
    And I end the demo
