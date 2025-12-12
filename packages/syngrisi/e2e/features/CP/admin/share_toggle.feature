@admin @settings
Feature: Global Sharing Toggle
  As an administrator
  I want to enable or disable the sharing feature globally
  So that I can control public access to the application data

  Background:
    Given I start Server
    And I create "1" tests with:
      """
          testName: ShareToggleTest
          checks:
            - checkName: CheckToToggle
              filePath: files/A.png
      """
    And I login with user:"Test" password "123456aA-"
    And I go to "admin/settings" page
    And I wait 10 seconds for the element with locator "select[data-test='settings_value_share_enabled']" to be visible

  Scenario: Admin can disable sharing
    # Disable Sharing using custom dropdown step
    When I select dropdown option "false" by clicking div for element "[data-test='settings_value_share_enabled']:visible"
    When I click element with locator "[data-test='settings_update_button_share_enabled']"
    When I wait 1 seconds

    # Reload to confirm persistence
    When I refresh page
    And I wait 10 seconds for the element with locator "select[data-test='settings_value_share_enabled']" to be visible
    Then the element with locator "select[data-test='settings_value_share_enabled']" should have value "false"

    # Verify Share Button is disabled in Check Details
    When I go to "main" page
    When I unfold the test "ShareToggleTest"
    When I wait on element "[data-check='CheckToToggle']" to be visible
    When I click element with locator "[data-test-preview-image='CheckToToggle']"
    When I wait on element "[data-check-header-name='CheckToToggle']" to be visible

    # Open menu
    When I click element with locator "[data-test='check-details-menu']"

    # Check "Share" item
    When I wait on element "[data-test='menu-share-check'][data-share-enabled='false']" to be visible
    Then the element with locator "[data-test='menu-share-check']" should be disabled
    Then the element with locator "[data-test='menu-share-check']" should have attribute "title" "Sharing is globally disabled by administrator"

  Scenario: Admin can enable sharing
    # First disable it to ensure we can toggle it (or assume state from previous test if sequential, but safer to be explicit)
    # However, since tests might run in parallel or random order, we should set it to true explicitly.
    # The default is "true".

    # Set to true
    When I select dropdown option "true" by clicking div for element "[data-test='settings_value_share_enabled']:visible"
    When I click element with locator "[data-test='settings_update_button_share_enabled']"
    When I wait 1 seconds

    # Reload to confirm persistence
    When I refresh page
    And I wait 10 seconds for the element with locator "select[data-test='settings_value_share_enabled']" to be visible
    Then the element with locator "select[data-test='settings_value_share_enabled']" should have value "true"

    # Verify Share Button is enabled in Check Details
    When I go to "main" page
    When I unfold the test "ShareToggleTest"
    When I wait on element "[data-check='CheckToToggle']" to be visible
    When I click element with locator "[data-test-preview-image='CheckToToggle']"
    When I wait on element "[data-check-header-name='CheckToToggle']" to be visible

    # Open menu
    When I click element with locator "[data-test='check-details-menu']"

    # Check "Share" item
    When I wait on element "[data-test='menu-share-check'][data-share-enabled='true']" to be visible
    Then the element with locator "[data-test='menu-share-check']" should be enabled
    Then the element with locator "[data-test='menu-share-check']" should have attribute "title" "Share"
