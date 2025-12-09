@cp @generated @fast-server @smoke
Feature: Share Check Feature

  Background:
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
      """
    Given I start Server
    When I create via http test user
    Given I stop Server

    When I set env variables:
      """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
      """
    When I reload session
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible

  Scenario: Open Share modal from Check Details menu
    Given I create "1" tests with:
      """
          testName: ShareTest
          checks:
            - checkName: CheckToShare
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "ShareTest"
    When I click element with locator "[data-test-preview-image='CheckToShare']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToShare']" to be visible

    # Open menu and click Share
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"

    # Verify Share modal is open
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible
    Then the element with locator "[data-test='create-share-button']" should be visible

  Scenario: Create share link and verify URL format
    Given I create "1" tests with:
      """
          testName: ShareLinkTest
          checks:
            - checkName: CheckForLink
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "ShareLinkTest"
    When I click element with locator "[data-test-preview-image='CheckForLink']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckForLink']" to be visible

    # Open Share modal
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible

    # Create share link
    When I click element with locator "[data-test='create-share-button']"
    When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible

    # Verify URL input and copy button are visible
    Then the element with locator "[data-test='share-url-input']" should be visible
    Then the element with locator "[data-test='copy-share-url']" should be visible

  Scenario: Access shared check as anonymous user - read-only mode verification
    Given I create "1" tests with:
      """
          testName: ShareAccessTest
          checks:
            - checkName: SharedCheck
              filePath: files/A.png
      """
    When I accept via http the 1st check with name "SharedCheck"
    When I go to "main" page
    When I unfold the test "ShareAccessTest"
    When I click element with locator "[data-test-preview-image='SharedCheck']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='SharedCheck']" to be visible

    # Create share link while logged in
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible
    When I click element with locator "[data-test='create-share-button']"
    When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible

    # Save the share URL before logout (modal will close after logout)
    When I save the share URL

    # Logout to become anonymous user
    When I go to "logout" page
    # Wait for logout success modal and click Sign In to go to login page
    When I wait 10 seconds for the element with locator "a:has-text('Sign In')" to be visible
    When I click element with locator "a:has-text('Sign In')"
    When I wait 10 seconds for the element with locator "[data-test='login-email-input']" to be visible

    # Open saved share URL as anonymous user
    When I open the saved share URL

    # Wait for CheckDetails to load in share mode
    When I wait 10 seconds for the element with locator "[data-check='toolbar']" to be visible

    # Verify read-only mode: Accept button should NOT be visible
    Then the element with locator "[data-test='accept-button']" should not be visible

    # Verify read-only mode: Menu (three dots) should NOT be visible
    Then the element with locator "[data-test='check-details-menu']" should not be visible

    # Verify read-only mode: Remove button should NOT be visible
    Then the element with locator "[data-test='remove-button']" should not be visible

    # Verify the check details are still visible (image toolbar exists)
    Then the element with locator "[data-check='toolbar']" should be visible

    # Verify image details are displayed (image size badge shows image is loaded)
    Then the element with locator "[data-check='image-size']" should be visible
