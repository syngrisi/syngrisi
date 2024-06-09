Feature: Check Preview - Tooltip

  Background:
    Given I clear Database and stop Server
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
    Given I start Server and start Driver

    # set API key
    When I login via http with user:"Test" password "123"
    When I generate via http API key for the User
    When I set the API key in config
    When I start Driver

  Scenario: Status View - Tooltip
    When I login with user:"Test" password "123"
    # NEW
    Given I create "1" tests with:
    """
      testName: TestName
      checks:
          - checkName: CheckName
    """
    When I accept via http the 1st check with name "CheckName"

    When I go to "main" page
    When I unfold the test "TestName"

    # image tooltip
    When I wait on element "[data-check-tooltip-name='CheckName']" to not be displayed
    When I move to element "[data-test-preview-image='CheckName']"
    When I wait on element "[data-check-tooltip-name='CheckName']" to be displayed
    When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='status-label']" to contain text "New - first time check"
    When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='user-label']" to contain text "Test Admin"
    When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='os-label']" to contain text "<testPlatform>"
    When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='date-tooltip-label']" to contain text "<YYYY-MM-DD>"
    When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='browser-label']" to contain text "chrome"

    # acceptance tooltip
    When I move to element "[data-test='check-accept-icon']"
    When I expect that element "[data-test='accept-button-tooltip-username']" to have text "Accepted by: Test"
    When I expect that element "[data-test='accept-button-tooltip-date']" to contain text "<YYYY-MM-DD>"
