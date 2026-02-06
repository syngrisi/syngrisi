@fast-server @smoke
Feature: Test calculated fields
  during the session end - calculated common fields based in checks in test: [viewport, status]

  Background:
    When I open the app
    When I clear local storage

  Scenario: Same viewports - [50x50, 50x50]
    Given I create "1" tests with:
      """
        testName: TestName-Calculated-1
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-Calculated-2
          filePath: files/A.png
          viewport: "50x50"
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-Calculated-1']" to be visible
    When the element with locator "[data-row-name='TestName-Calculated-1'] [data-test='table-row-Viewport']" should have contains text "50x50"

  Scenario: Different viewports - [50x50, 100x100]
    Given I create "1" tests with:
      """
        testName: TestName-Calculated-2
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-Calculated-2
          filePath: files/A.png
          viewport: "100x100"
      """
    When I go to "main" page
    When I wait for test "TestName-Calculated-2" to appear in table
    When the element with locator "[data-row-name='TestName-Calculated-2'] [data-test='table-row-Viewport']" should have contains text "≠"

  Scenario: Same viewports - [new, new]
    Given I create "1" tests with:
      """
        testName: TestName-Calculated-3
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-Calculated-2
          filePath: files/A.png
          viewport: "50x50"
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-Calculated-3']" to be visible
    When the element with locator "[data-row-name='TestName-Calculated-3'] [data-test='table-row-Status']" should have contains text "New"

  Scenario: Same viewports - [new, passed]
    Given I create "1" tests with:
      """
        testName: TestName-Calculated-4
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName-Calculated-1"

    Given I create "1" tests with:
      """
        testName: TestName-Calculated-4
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
        - checkName: CheckName-Calculated-2
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-Calculated-4']" to be visible
    When the element with locator "[data-row-name='TestName-Calculated-4'] [data-test='table-row-Status']" should have contains text "Passed"

  Scenario: Same viewports - [passed, failed]
    Given I create "1" tests with:
      """
        testName: TestName-Calculated-5
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
        - checkName: CheckName-Calculated-2
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName-Calculated-1"
    When I accept via http the 1st check with name "CheckName-Calculated-2"

    Given I create "1" tests with:
      """
        testName: TestName-Calculated-5
        checks:
        - checkName: CheckName-Calculated-1
          filePath: files/A.png
        - checkName: CheckName-Calculated-2
          filePath: files/B.png
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-Calculated-5']" to be visible
    When the element with locator "[data-row-name='TestName-Calculated-5'] [data-test='table-row-Status']" should have contains text "Failed"
