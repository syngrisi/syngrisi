@sso-logto @slow
Feature: SSO Authentication with Logto configured via Admin UI
  # Full end-to-end SSO test that provisions Logto through the Admin UI (no API provisioning)
  # Requires Apple container CLI and a fresh Logto instance (skip provisioning handled by @sso-logto-ui)

  Background:
    # Ensure Syngrisi starts with auth enabled but without pre-provisioned SSO settings
    When I set env variables:
      """
      SYNGRISI_AUTH: true
      SYNGRISI_TEST_MODE: false
      """
    Given I start Logto SSO infrastructure

  Scenario: Provision Logto in Admin UI and sign in via SSO
    And I configure Syngrisi SSO env from provisioned Logto app

    # Start Syngrisi with freshly configured SSO
    Given I start Server

    # Login flow through SSO
    When I reload session
    When I open the app
    Then the SSO login button should be visible
    When I click SSO login button
    When I login to Logto with provisioned user
    Then I should be redirected back to the app
    Then I should be authenticated via SSO
