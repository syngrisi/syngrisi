@fast-server
Feature: Navbar runs list survives table filter after refresh

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Runs remain visible after page refresh with failed status table filter
    Given I create "1" tests with:
      """
      testName: TestRunBug-1
      runName: Run-Bug-1
      runIdent: Run-Bug-1
      checks:
        - checkName: CheckRunBug-1
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckRunBug-1"
    Given I create "1" tests with:
      """
      testName: TestRunBug-1
      runName: Run-Bug-1
      runIdent: Run-Bug-1
      checks:
        - checkName: CheckRunBug-1
          filePath: files/B.png
      """
    Given I create "1" tests with:
      """
      testName: TestRunBug-2
      runName: Run-Bug-2
      runIdent: Run-Bug-2
      checks:
        - checkName: CheckRunBug-2
          filePath: files/A.png
      """

    When I go to "main" page
    When I refresh page

    Then the element "[data-item-name='Run-Bug-1']" should have exactly 1 items within 10 seconds
    Then the element "[data-item-name='Run-Bug-2']" should have exactly 1 items within 10 seconds

    When I click element with locator "[data-item-name='Run-Bug-1']"
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I select the option with the text "Failed" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait 30 seconds for the element with locator "[data-table-test-name='TestRunBug-1']" to be visible

    When I refresh page

    Then the element "[data-item-name='Run-Bug-1']" should have exactly 1 items within 10 seconds
    Then the element "[data-item-name='Run-Bug-2']" should have exactly 1 items within 10 seconds

    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I click element with locator "[aria-label='Reset filter']"

    Then the element "[data-item-name='Run-Bug-1']" should have exactly 1 items within 10 seconds
