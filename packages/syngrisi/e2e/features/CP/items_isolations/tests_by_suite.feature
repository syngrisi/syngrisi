Feature: Test Isolation by Suite

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Suite
    Given I create "1" tests with:
    """
      testName: TestSuite-1.1
      suiteName: Suite-1
      checks:
          - checkName: CheckSuite-1.1
            filePath: files/A.png
          - checkName: CheckSuite-1.2
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: TestSuite-1.2
      suiteName: Suite-1
      checks:
          - checkName: CheckSuite-1.3
            filePath: files/A.png
          - checkName: CheckSuite-1.4
            filePath: files/A.png
    """

    Given I create "1" tests with:
    """
      testName: TestSuite-2.1
      suiteName: Suite-2
      checks:
          - checkName: CheckSuite-2.1
            filePath: files/A.png
          - checkName: CheckSuite-2.2
            filePath: files/A.png
    """

    When I refresh page

    # all tests
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestSuite')]" to be visible
    Then the element "//div[contains(text(), 'TestSuite')]" does appear exactly "3" times

    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

    # SUITE-1
    # tests
    When I wait 30 seconds for the element with locator "[data-item-name='Suite-1']" to be visible
    When I click element with locator "[data-item-name='Suite-1']"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestSuite-1.1')]" to be visible
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestSuite-1.2')]" to be visible
    When I wait on element "//div[contains(text(), 'TestSuite-2.1')]" to not be displayed

    # checks
    When I click element with locator "[data-table-test-name='TestSuite-1.1']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckSuite-1.1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckSuite-1.2']" to be visible

    When I click element with locator "[data-table-test-name='TestSuite-1.2']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckSuite-1.3']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckSuite-1.4']" to be visible

    # SUITE-1
    # tests
    When I click element with locator "[data-item-name='Suite-2']"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestSuite-2.1')]" to be visible
    When I wait on element "//div[contains(text(), 'TestSuite-1.1')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-1.2')]" to not be displayed
