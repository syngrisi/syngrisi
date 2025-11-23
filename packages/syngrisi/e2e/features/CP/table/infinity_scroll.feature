@smoke
Feature: Infinity scroll

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Infinity scroll
    When I create "30" tests with:
      """
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-29]" to be visible

    Then the element "//*[@data-test='table-row-Name']" does appear exactly "20" times

    When I scroll to element "[data-table-test-name=TestName-11]"

    Then the element "//*[@data-test='table-row-Name']" does appear exactly "30" times
