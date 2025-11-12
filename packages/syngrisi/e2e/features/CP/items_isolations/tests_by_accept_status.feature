Feature: Test Isolation by Accept Status

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Accept Status
    # UNACCEPTED
    Given I create "1" tests with:
    """
      testName: AcceptStatus-unaccepted
      checks:
          - checkName: Check-unaccepted
    """

    # PARTIALLY
    Given I create "1" tests with:
    """
      testName: AcceptStatus-partially
      checks:
          - checkName: Check-part1
          - checkName: Check-part2
    """
    When I accept via http the 1st check with name "Check-part1"

    # ACCEPTED
    Given I create "1" tests with:
    """
      testName: AcceptStatus-accepted
      checks:
          - checkName: Check-accepted
    """
    When I accept via http the 1st check with name "Check-accepted"

    When I refresh page
    # all tests
    When I wait on element "[data-table-test-name*='AcceptStatus']" to be displayed
    Then I expect that element "[data-table-test-name*='AcceptStatus']" does appear exactly "3" times

    When I select the option with the text "Accept Status" for element "select[data-test='navbar-group-by']"

    # UNACCEPTED
    When I wait on element "li*=Unaccepted" to be displayed
    When I click element with locator "li*=Unaccepted"

    When I wait on element "[data-table-test-name='AcceptStatus-unaccepted']" to be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-partially']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-accepted']" to not be displayed

    # PARTIALLY
    When I wait on element "li*=Partially" to be displayed
    When I click element with locator "li*=Partially"

    When I wait on element "[data-table-test-name='AcceptStatus-unaccepted']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-partially']" to be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-accepted']" to not be displayed

   # ACCEPTED
    When I wait on element "li*=Accepted" to be displayed
    When I click element with locator "[data-testid='navbar-accept-status-accepted']"
    When I wait on element "[data-table-test-name='AcceptStatus-unaccepted']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-partially']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-accepted']" to be displayed
