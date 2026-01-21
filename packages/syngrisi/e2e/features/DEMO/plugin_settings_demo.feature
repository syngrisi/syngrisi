@demo @plugins
Feature: Plugin Settings Walkthrough
    As a System Administrator
    I want to configure system plugins
    So that I can extend Syngrisi functionality

    Background:
        Given I set env variables:
            """
      SYNGRISI_AUTH: false
      SYNGRISI_TEST_MODE: true
      SYNGRISI_PLUGINS_ENABLED: jwt-auth
      SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL: https://login.example.com/.well-known/jwks.json
      SYNGRISI_PLUGIN_JWT_AUTH_ISSUER: login.example.com
      SYNGRISI_DISABLE_FIRST_RUN: true
            """
        Given I start Server
        Given I go to "plugins" page

    @demo
    Scenario: Plugin Settings Walkthrough
        # Step 1: Introduction
        When I set demo step 1 of 8: "Introduction"
        When I announce: "Syngrisi's Plugin System allows you to extend the core functionality. In this walkthrough, we'll explore how to configure and manage plugins directly from the Admin UI."
        Then I wait for "3" seconds

        # Step 2: Plugin Discovery
        When I set demo step 2 of 8: "Plugin Discovery"
        When I announce: "The Plugin Settings page lists all available plugins, their current status, and version. Settings are loaded from both Environment Variables and the Database."
        When I highlight element ".mantine-Accordion-item"
        Then I wait for "3" seconds
        When I clear highlight

        # Step 3: Architecture
        When I set demo step 3 of 8: "Configuration Hierarchy"
        When I announce: "Syngrisi uses a configuration hierarchy: Database settings take precedence over Environment Variables, which in turn override plugin defaults."
        Then I wait for "3" seconds

        # Step 4: Exploring JWT Auth
        When I set demo step 4 of 8: "Exploring JWT Auth"
        When I announce: "Let's explore the JWT Auth plugin configuration. This plugin enables machine-to-machine authentication using OAuth2 Client Credentials via JWT tokens."

        # Expand panel
        When I announce: "We click on the plugin name to expand its configuration panel."
        When I click element with locator "[data-value='jwt-auth'] button.mantine-Accordion-control"
        Then the element with locator "[data-value='jwt-auth'] .mantine-Accordion-panel" should be visible for 2 sec

        # Enable/Disable
        When I announce: "The toggle switch enables or disables the plugin. When disabled, the plugin won't process any authentication requests."
        When I highlight element "[data-value='jwt-auth'] .mantine-Switch-input"
        Then I wait for "2" seconds
        When I clear highlight

        # Step 5: Parameters
        When I set demo step 5 of 8: "Configuring Parameters"
        When I announce: "The JWKS URL and Issuer are essential for validating JWT token signatures from your identity provider."

        # Step 6: Effective Config
        When I set demo step 6 of 8: "Effective Configuration"
        When I announce: "The Effective Configuration table shows the actual values being used - each marked with its source: UI or ENV."
        When I highlight element "[data-value='jwt-auth'] table"
        Then I wait for "4" seconds
        When I clear highlight

        # Step 7: Priority Hierarchy
        When I set demo step 7 of 8: "Priority Hierarchy"
        When I announce: "Syngrisi uses a three-tier configuration hierarchy. UI Settings (DB) have the highest priority, followed by Environment Variables, and finally Plugin Defaults."
        Then I wait for "2" seconds
        When I announce: "In the table, you'll see badges indicating the source. This allows for default configuration via ENV (Infrastructure as Code) while allowing runtime overrides via UI."
        Then I wait for "4" seconds

        # Step 8: Conclusion
        When I set demo step 8 of 8: "Conclusion"
        When I announce: "That concludes our tour of the Plugin System. You can now easily configure authentication integrations and other extensions directly from the UI."
        Then I wait for "3" seconds
        And I end the demo
