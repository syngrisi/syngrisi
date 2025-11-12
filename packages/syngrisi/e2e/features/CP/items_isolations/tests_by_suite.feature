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
          - checkName: CheckSuite-1.2
    """
    Given I create "1" tests with:
    """
      testName: TestSuite-1.2
      suiteName: Suite-1
      checks:
          - checkName: CheckSuite-1.3
          - checkName: CheckSuite-1.4
    """

    Given I create "1" tests with:
    """
      testName: TestSuite-2.1
      suiteName: Suite-2
      checks:
          - checkName: CheckSuite-2.1
          - checkName: CheckSuite-2.2
    """

    When I refresh page

    # all tests
    When I wait on element "//div[contains(text(), 'TestSuite')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestSuite')]" does appear exactly "3" times

    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

    # SUITE-1
    # tests
    When I wait on element "[data-item-name='Suite-1']" to be displayed
    When I click element with locator "[data-item-name='Suite-1']"
    When I wait on element "//div[contains(text(), 'TestSuite-1.1')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-1.2')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-2.1')]" to not be displayed

    # checks
    When I click element with locator "[data-table-test-name='TestSuite-1.1']"
    Then I wait on element "[data-table-check-name='CheckSuite-1.1']" to be displayed
    Then I wait on element "[data-table-check-name='CheckSuite-1.2']" to be displayed

    When I click element with locator "[data-table-test-name='TestSuite-1.2']"
    Then I wait on element "[data-table-check-name='CheckSuite-1.3']" to be displayed
    Then I wait on element "[data-table-check-name='CheckSuite-1.4']" to be displayed

    # SUITE-1
    # tests
    When I click element with locator "[data-item-name='Suite-2']"
    When I wait on element "//div[contains(text(), 'TestSuite-2.1')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-1.1')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-1.2')]" to not be displayed
