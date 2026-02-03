@smoke @fast-server
Feature: Folding

  Background:
    # Server is managed by @fast-server hook automatically
    When I open the app
    When I clear local storage

  Scenario: Select, fold/unfold icon - appear
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - {checkName: CheckName, filePath: files/A.png}
      """
    When I go to "main" page
    When I wait for "5" seconds
    Then the element with locator "[data-test='folding-table-items']" should not be visible

    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When I click element with locator "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    When I click element with locator "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
    When I wait for "5" seconds
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to not be displayed

  Scenario: Fold/Unfold item by click
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
              - {checkName: CheckName, filePath: files/A.png}
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName']" to be visible

  Scenario: Fold/Unfold single item by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - {checkName: Check-$, filePath: files/A.png}
      """
    Given I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    When I click element with locator "[data-test-checkbox-name=TestName-0]"
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    # unfold
    When I click element with locator "[data-test='folding-table-items']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-0']" to be visible
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    # fold
    When I click element with locator "[data-test='folding-table-items']"
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

  Scenario: Fold/Unfold multiple items by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - {checkName: Check-$, filePath: files/A.png}
      """
    Given I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed


    When I click element with locator "[data-test-checkbox-name=TestName-0]"
    When I click element with locator "[data-test-checkbox-name=TestName-1]"
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    # unfold
    When I click element with locator "[data-test='folding-table-items']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-1']" to be visible

    # fold
    When I click element with locator "[data-test='folding-table-items']"
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

  Scenario: Fold/Unfold all items by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - {checkName: Check-$, filePath: files/A.png}
      """
    Given I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    When I click element with locator "[data-test='table-select-all']"
    When I wait for "1" seconds
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    # unfold
    When I click element with locator "[data-test='folding-table-items']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-1']" to be visible

    # fold
    When I click element with locator "[data-test='folding-table-items']"
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed
