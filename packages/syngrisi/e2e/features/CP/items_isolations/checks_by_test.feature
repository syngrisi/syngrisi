@fast-server
Feature: Checks Isolation by Test
  Every checks are related to one test.
  Each test should contain only it checks and no extra checks

  Background:
#         Given I clear Database and stop Server
#         Given I start Server and start Driver
    When I open the app
    When I clear local storage
    Given I create "2" tests with:
    """
          testName: TestName-1
          checks:
              - checkName: CheckName-1.1
        filePath: files/A.png
              - checkName: CheckName-1.2
        filePath: files/A.png
    """
    Given I create "2" tests with:
    """
          testName: TestName-2
          checks:
              - checkName: CheckName-2.1
        filePath: files/A.png
              - checkName: CheckName-2.2
        filePath: files/A.png
    """

  Scenario: Checks Isolation by Test
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When I click element with locator "[data-table-test-name=TestName-1]"

    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-1.1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-1.2']" to be visible

    Then I wait on element "[data-table-check-name='CheckName-2.1']" to not be displayed
    Then I wait on element "[data-table-check-name='CheckName-2.2']" to not be displayed

    When I click element with locator "[data-table-test-name=TestName-2]"

    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-2.1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-2.2']" to be visible