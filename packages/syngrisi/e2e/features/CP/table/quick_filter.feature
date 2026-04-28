Feature: Quick Filtering

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Quick Filtering
    When I create "2" tests with:
      """
          project: "Project-1"
          testName: "TestName-$"
          checks:
             - {checkName: Check - 1, filePath: files/A.png}
      """

    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "ZestName-1"
          checks:
             - {checkName: Check - 1, filePath: files/A.png}
      """

    When I go to "main" page

    When I wait 60 seconds for the element with locator "[data-test='table-quick-filter']" to be visible
    When I wait for test "TestName-0" to appear in table
    When I wait for test "TestName-1" to appear in table
    When I wait for test "ZestName-1" to appear in table

    When I set "TestName-" to the inputfield "[data-test='table-quick-filter']"
    When I wait for "2" seconds
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestName-0']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestName-1']" to be visible
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

    When I set "TestName-0" to the inputfield "[data-test='table-quick-filter']"
    When I wait for "2" seconds
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestName-0']" to be visible
    Then I wait on element "[data-table-test-name='TestName-1']" to not be displayed
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

    When I set "TestName-1" to the inputfield "[data-test='table-quick-filter']"
    When I wait for "2" seconds
    Then I wait on element "[data-table-test-name='TestName-0']" to not be displayed
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestName-1']" to be visible
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

  Scenario: Quick Filtering with Project
    When I create "2" tests with:
      """
          project: "Project-1"
          testName: "TestNameP1-$"
          checks:
             - {checkName: Check - 1, filePath: files/A.png}
      """

    When I create "1" tests with:
      """
          project: "Project-2"
          testName: "TestNameP2-$"
          checks:
             - {checkName: Check - 1, filePath: files/A.png}
      """

    When I go to "main" page
    When I wait 60 seconds for the element with locator "[data-test='table-quick-filter']" to be visible

    When I wait for test "TestNameP1-0" to appear in table
    When I wait for test "TestNameP1-1" to appear in table
    When I wait for test "TestNameP2-0" to appear in table

    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP1-0']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP1-1']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP2-0']" to be visible

    When I select the option with the text "Project-1" for element "select[data-test='current-project']"

    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP1-0']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP1-1']" to be visible
    Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed

    When I set "TestNameP1-0" to the inputfield "[data-test='table-quick-filter']"
    When I wait 60 seconds for the element with locator "[data-table-test-name='TestNameP1-0']" to be visible
    Then I wait on element "[data-table-test-name='TestNameP1-1']" to not be displayed
    Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed

  Scenario: Quick Filtering by Status
    Given I create "1" tests with:
      """
      testName: QuickFilterStatus-new
      checks:
          - checkName: QuickFilterStatus-new-check
            filePath: files/A.png
      """

    Given I create "1" tests with:
      """
      testName: QuickFilterStatus-passed-baseline
      checks:
          - checkName: QuickFilterStatus-passed-check
            filePath: files/A.png
      """
    When I accept via http the 1st check with name "QuickFilterStatus-passed-check"

    Given I create "1" tests with:
      """
      testName: QuickFilterStatus-passed
      checks:
          - checkName: QuickFilterStatus-passed-check
            filePath: files/A.png
      """
    When I accept via http the 1st check with name "QuickFilterStatus-passed-check"

    Given I create "1" tests with:
      """
      testName: QuickFilterStatus-failed-baseline
      checks:
          - checkName: QuickFilterStatus-failed-check
            filePath: files/A.png
      """
    When I accept via http the 1st check with name "QuickFilterStatus-failed-check"

    Given I create "1" tests with:
      """
      testName: QuickFilterStatus-failed
      checks:
          - checkName: QuickFilterStatus-failed-check
            filePath: files/B.png
      """

    When I go to "main" page
    When I wait 60 seconds for the element with locator "[data-test='table-quick-filter']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-new']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-passed']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-failed']" to be visible

    When I click element with locator "[data-test='table-quick-filter-status-New']"
    When I click element with locator "[data-test='table-quick-filter-status-Passed']"
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-failed']" to be visible
    Then I wait on element "[data-table-test-name='QuickFilterStatus-new']" to not be displayed
    Then I wait on element "[data-table-test-name='QuickFilterStatus-passed']" to not be displayed

    When I click element with locator "button[aria-label='Reset quick filter']"
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-new']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-passed']" to be visible
    When I wait 60 seconds for the element with locator "[data-table-test-name='QuickFilterStatus-failed']" to be visible

    When I click element with locator "button[aria-label='Open quick filter options']"
    When I wait 30 seconds for the element with locator "div[role='dialog']:has-text('Browsers:')" to be visible
