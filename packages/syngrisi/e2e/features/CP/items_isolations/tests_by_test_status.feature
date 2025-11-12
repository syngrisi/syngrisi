Feature: Test Isolation by Test Status

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Test Status
    # NEW
    Given I create "1" tests with:
    """
      testName: TestStatus-new
      checks:
          - checkName: Check-new
    """

    # PASSED
    Given I create "1" tests with:
    """
      testName: TestStatus-passed-new
      checks:
          - checkName: Check-passed
    """
    When I accept via http the 1st check with name "Check-passed"

    Given I create "1" tests with:
    """
      testName: TestStatus-passed-passed
      checks:
          - checkName: Check-passed
    """
    When I accept via http the 1st check with name "Check-passed"

    # FAILED
    Given I create "1" tests with:
    """
      testName: TestStatus-failed-new
      checks:
          - checkName: Check-failed-baseline
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "Check-failed-baseline"

    Given I create "1" tests with:
    """
      testName: TestStatus-failed
      checks:
          - checkName: Check-failed-baseline
            filePath: files/B.png
    """

    When I refresh page
    # all tests
    When I wait on element "[data-table-test-name*='TestStatus']" to be displayed
    Then I expect that element "[data-table-test-name*='TestStatus']" does appear exactly "5" times

    When I select the option with the text "Test Status" for element "select[data-test='navbar-group-by']"

    # NEW
    When I wait on element "li*=New" to be displayed
    When I click element with locator "li*=New"

    When I wait on element "[data-table-test-name='TestStatus-new']" to be displayed
    When I wait on element "[data-table-test-name='TestStatus-passed-passed']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-failed']" to not be displayed

    # PASSED
    When I click element with locator "li*=Passed"

    When I wait on element "[data-table-test-name='TestStatus-passed-passed']" to be displayed
    When I wait on element "[data-table-test-name='TestStatus-new']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-failed']" to not be displayed

    # FAILED
    When I click element with locator "li*=Failed"

    When I wait on element "[data-table-test-name='TestStatus-failed']" to be displayed
    When I wait on element "[data-table-test-name='TestStatus-new']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-passed-passed']" to not be displayed
