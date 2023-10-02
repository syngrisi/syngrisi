Feature: Test Isolation by Tests Status

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Tests Status
    # NEW
    Given I create "1" tests with:
    """
      testName: TestStatus-new
      checks:
          - checkName: Check-0
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "Check-0"
    # PASSED
    Given I create "1" tests with:
    """
      testName: TestStatus-passed
      checks:
          - checkName: Check-0
            filePath: files/A.png
    """

    Given I create "1" tests with:
    """
      testName: TestStatus-failed-new
      checks:
          - checkName: Check-1
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "Check-1"

    Given I create "1" tests with:
    """
      testName: TestStatus-failed-failed
      checks:
          - checkName: Check-1
            filePath: files/B.png
    """

    When I refresh page
    # all tests
    When I wait on element "//div[contains(text(), 'TestStatus')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestStatus')]" does appear exactly "4" times

    When I select the option with the text "Test Status" for element "select[data-test='navbar-group-by']"

    # NEW
    When I wait on element "li*=New" to be displayed
    When I click on the element "li*=New"
    When I wait on element "//div[contains(text(), 'TestStatus-failed-new')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-new')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-passed')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-failed-failed')]" to not be displayed

    # PASSED
    When I wait on element "li*=Passed" to be displayed
    When I click on the element "li*=Passed"
    When I wait on element "//div[contains(text(), 'TestStatus-failed-new')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-new')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-passed')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-failed-failed')]" to not be displayed

    # FAILED
    When I wait on element "li*=Failed" to be displayed
    When I click on the element "li*=Failed"
    When I wait on element "//div[contains(text(), 'TestStatus-failed-new')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-new')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-passed')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestStatus-failed-failed')]" to be displayed
