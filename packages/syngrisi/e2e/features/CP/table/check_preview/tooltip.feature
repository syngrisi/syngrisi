@fast-server
Feature: Check Preview - Tooltip

  Background:
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
      """
    Given I start Server
    When I create via http test user

    Given I stop the Syngrisi server
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
      """
    #     Given I start Server and start Driver

    # set API key
    When I login via http with user:"Test" password "123456aA-"
    When I generate via http API key for the User
    When I set the API key in config
    When I start Driver

  @smoke
  Scenario: Status View - Tooltip
    When I login with user:"Test" password "123456aA-"
    # NEW
    Given I create "1" tests with:
      """
      testName: TestName
      checks:
        - checkName: CheckName
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName"

    When I go to "main" page
    When I unfold the test "TestName"

    # image tooltip
    When I wait on element "[data-check-tooltip-name='CheckName']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-test-preview-image='CheckName']" to be visible
    When I wait 1 seconds
    When I move to element "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-tooltip-name='CheckName']" to be visible
    When the element with locator "[data-check-tooltip-name='CheckName'] [data-test='status-label']" should have contains text "New - first time check"
    When the element with locator "[data-check-tooltip-name='CheckName'] [data-test='user-label']" should have contains text "Test Admin"
    When the element with locator "[data-check-tooltip-name='CheckName'] [data-test='os-label']" should have contains text "<testPlatform>"
    When the element with locator "[data-check-tooltip-name='CheckName'] [data-test='date-tooltip-label']" should have contains text "<YYYY-MM-DD>"
    When the element with locator "[data-check-tooltip-name='CheckName'] [data-test='browser-label']" should have contains text "chrome"

    # acceptance tooltip
    When I move to element "[data-test='check-accept-icon']"
    When the element "[data-test='accept-button-tooltip-username']" matches the text "Accepted by: Test"
    When the element with locator "[data-test='accept-button-tooltip-date']" should have contains text "<YYYY-MM-DD>"