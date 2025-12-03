@fast-server
Feature: Test Isolation by Accept Status

  Background:
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Accept Status
    # UNACCEPTED
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-unaccepted
    checks:
      - checkName: Check-unaccepted
        filePath: files/A.png
      """

    # PARTIALLY
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-partially
    checks:
      - checkName: Check-part1
        filePath: files/A.png
      - checkName: Check-part2
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-part1"

    # ACCEPTED
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-accepted
    checks:
      - checkName: Check-accepted
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-accepted"

    When I refresh page
    # all tests
    When I wait 10 seconds for the element with locator "[data-table-test-name*='AcceptStatus-Unique']" to be visible
    Then the element "[data-table-test-name*='AcceptStatus-Unique']" does appear exactly "3" times

    When I select the option with the text "Accept Status" for element "select[data-test='navbar-group-by']"

    # UNACCEPTED
    When I wait 10 seconds for the element with locator "//li[contains(., 'Unaccepted')]" to be visible
    When I click element with locator "li*=Unaccepted"

    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to be visible
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-partially']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-accepted']" to not be displayed

    # PARTIALLY
    When I wait 10 seconds for the element with locator "//li[contains(., 'Partially')]" to be visible
    When I click element with locator "li*=Partially"

    When I wait on element "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-partially']" to be visible
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-accepted']" to not be displayed

    # ACCEPTED
    When I wait 10 seconds for the element with locator "//li[contains(., 'Accepted')]" to be visible
    When I click element with locator "[data-testid='navbar-accept-status-accepted']"
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-partially']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-accepted']" to be visible