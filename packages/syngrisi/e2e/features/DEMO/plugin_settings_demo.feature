@demo @plugins
Feature: Plugin Settings - Admin UI Demo
    # Demonstration of the Plugin Settings Management System
    #
    # This demo showcases:
    # - Navigating to the Plugins admin page
    # - Viewing registered plugins and their configurations
    # - Understanding the priority: UI settings override ENV variables
    # - Viewing effective configuration with source indicators
    #
    # Run the demo:
    # npm run test:demo -- --grep "Plugin Settings"

    Background:
        When I set env variables:
            """
      SYNGRISI_AUTH: false
      SYNGRISI_TEST_MODE: true
      SYNGRISI_PLUGINS_ENABLED: jwt-auth
      SYNGRISI_PLUGIN_jwt_AUTH_JWKS_URL: https://login.example.com/.well-known/jwks.json
      SYNGRISI_PLUGIN_jwt_AUTH_ISSUER: login.example.com
      SYNGRISI_DISABLE_FIRST_RUN: true
            """
        Given I start Server

    Scenario: Demo: Full Plugin Settings Walkthrough
        # --- Part 1: Overview ---
        When I set demo step 1 of 8: "Accessing Admin Panel"
        When I go to "admin2" page
        When I announce: "Welcome to the Syngrisi Plugin System! Plugins extend Syngrisi with new capabilities like custom authentication and validation rules."

        When I set demo step 2 of 8: "Plugins Management"
        When I announce: "Let's navigate to the Plugins section in the Admin panel to see all registered plugins."
        When I go to "plugins" page
        Then the element with locator "h3" should be visible for 5 sec

        When I set demo step 3 of 8: "Interface Overview"
        When I announce: "This is the Plugin Settings page. Each accordion represents a plugin with its current status - Loaded means active, Not Loaded means disabled or not configured."
        When I highlight element "h3"
        When I clear highlight

        When I announce: "The Refresh button reloads plugin status from the server if settings were changed externally."
        When I highlight element "button:has-text('Refresh')"
        When I clear highlight

        # --- Part 2: jwt Auth ---
        When I set demo step 4 of 8: "Exploring jwt Auth"
        When I announce: "Let's explore the jwt Auth plugin configuration. This plugin enables machine-to-machine authentication using Okta Client Credentials via JWT tokens."

        When I announce: "We click on the plugin name to expand its configuration panel."
        When I click element with locator "[data-value='jwt-auth'] button.mantine-Accordion-control"
        Then the element with locator "[data-value='jwt-auth'] .mantine-Accordion-panel" should be visible for 2 sec

        When I announce: "The toggle switch enables or disables the plugin. When disabled, the plugin won't process any authentication requests."
        When I highlight element "[data-value='jwt-auth'] .mantine-Switch-input"
        When I clear highlight

        When I set demo step 5 of 8: "Configuring Parameters"
        When I announce: "The JWKS URL and Issuer are essential for validating JWT token signatures from your identity provider."

        When I set demo step 6 of 8: "Effective Configuration"
        When I announce: "The Effective Configuration table shows the actual values being used - each marked with its source: UI or ENV."
        When I highlight element "[data-value='jwt-auth'] table"
        When I clear highlight

        # --- Part 3: Priority System ---
        When I set demo step 7 of 8: "Priority Hierarchy"
        When I announce: "Syngrisi uses a three-tier configuration hierarchy. UI Settings (DB) have the highest priority, followed by Environment Variables, and finally Plugin Defaults."

        When I announce: "In the table, you'll see badges indicating the source. This allows for default configs via ENV with easy overrides in the UI for testing or specific adjustments."

        When I set demo step 8 of 8: "Conclusion"
        When I announce: "This flexible system gives administrators complete control without needing to restart services or modify deployment scripts for every configuration change."
        And I end the demo
