@fast-server
Feature: Tests Table Features

  Background:
    When I open the app
    When I clear local storage

  # ============================================
  # Auto Update
  # ============================================

  @smoke
  Scenario: Update Table with new Tests
    After the user opens the table, the Application store items timestamp on the open the table moment,
    and then shows the user only items that are older than this timestamp and when the new items continue to arrive,
    the user should see new items counter indicator on the top right corner of the 'Refresh' icon (which will be
    updated every X seconds) and after clicking on the icon, the table will be refreshed with new items.

    When I create "1" tests with:
      """
          testName: "TestName-before"
          checks:
            - filePath: files/A.png
              checkName: CheckName
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-before]" to be visible


    When I refresh page
    When I create "3" tests with:
      """
          testName: "TestName-after"
          checks:
            - filePath: files/A.png
              checkName: CheckName
      """
    When I wait for "5" seconds

    Then the element with locator "[data-test='table-refresh-icon-badge']" should have contains text "3"
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-before]" to be visible

    When I click element with locator "[aria-label='Refresh']"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-after]" to be visible
    Then the element "[data-table-test-name=TestName-after]" does appear exactly "3" times

  # ============================================
  # Folding
  # ============================================

  @smoke
  Scenario: Select, fold/unfold icon - appear
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - filePath: files/A.png
              checkName: CheckName
      """
    When I go to "main" page

    Then the element with locator "[data-test='folding-table-items']" should not be visible

    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When I click element with locator "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    When I click element with locator "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"

    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to not be displayed

  @smoke
  Scenario: Fold/Unfold item by click
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName']" to be visible

  @smoke
  Scenario: Fold/Unfold single item by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
              filePath: files/A.png
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

  @smoke
  Scenario: Fold/Unfold multiple items by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
              filePath: files/A.png
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

  @smoke
  Scenario: Fold/Unfold all items by select
    Given I create "2" tests with:
      """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
              filePath: files/A.png
      """
    Given I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    When I click element with locator "[data-test='table-select-all']"
    When I wait 30 seconds for the element with locator "[data-test='folding-table-items']" to be visible

    # unfold
    When I click element with locator "[data-test='folding-table-items']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='Check-1']" to be visible

    # fold
    When I click element with locator "[data-test='folding-table-items']"
    Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
    Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

  # ============================================
  # Navigation via Link Parameters
  # ============================================

  @smoke
  Scenario: Navigation to link with predefined parameters
    Navigate to url with predefined 'base_filter', 'filter', 'groupBy', 'sortBy', 'app', etc.
    e.g.: ?base_filter=%7B%22app%22%3A%2262e37f9dee40093744bb1f1e%22%2C%22run%22%3A%226336f0f4f5bda77d65be2f91%22%7D&groupBy=runs&sortBy=timestamp%3Adesc
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName Project-1"
          runName: "RunName-1"
          suiteName: "SuiteName-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "1" tests with:
      """
          project: "Project-2"
          testName: "TestName Project-2-unfiltered"
          runName: "RunName-2"
          runIdent: "RunIdent-2"
          suiteName: "SuiteNameProject-2-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "2" tests with:
      """
          project: "Project-2"
          testName: "TestName Project-2-filter-$"
          runName: "RunName-2"
          runIdent: "RunIdent-2"
          suiteName: "SuiteNameProject-2-2"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-unfiltered']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

    # select project
    # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
    When I select the option with the text "Project-1" for element "select[data-test='current-project']"
    When I select the option with the text "Project-2" for element "select[data-test='current-project']"

    When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-unfiltered']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

    # group by suite and chose second suite
    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(.,'SuiteNameProject-2-2')]"

    When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
    When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"
    When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
    When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
    When I wait on element "[data-table-test-name='TestName Project-2-filter-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

    # refresh page
    When I refresh page
    When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
    When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
    When I wait on element "[data-table-test-name='TestName Project-2-filter-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

  # ============================================
  # Settings
  # ============================================

  @smoke
  Scenario: Set visible Columns
    When I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page
    When I wait for test "TestName" to appear in table
    When I wait 10 seconds for the element with locator "[data-test='table-header-Id']" to be visible
    Then the element with locator "[data-test='table-header-Id']" should be visible
    Then the element with locator "[data-test='table-header-Name']" should be visible
    Then the element with locator "[data-test='table-header-Status']" should be visible
    Then the element with locator "[data-test='table-header-Created']" should be visible
    Then the element with locator "[data-test='table-header-Accepted']" should be visible
    Then the element with locator "[data-test='table-header-Date']" should be visible
    Then the element with locator "[data-test='table-header-Browser']" should be visible
    Then the element with locator "[data-test='table-header-Platform']" should be visible
    Then the element with locator "[data-test='table-header-Viewport']" should be visible
    Then the element "th" does appear exactly "10" times

    Then the element with locator "[data-test='table-row-Id']" should be visible
    Then the element with locator "[data-test='table-row-Name']" should be visible
    Then the element with locator "[data-test='table-row-Status']" should be visible
    Then the element with locator "[data-test='table-row-Created']" should be visible
    Then the element with locator "[data-test='table-row-Accepted']" should be visible
    Then the element with locator "[data-test='table-row-Date']" should be visible
    Then the element with locator "[data-test='table-row-Browser']" should be visible
    Then the element with locator "[data-test='table-row-Platform']" should be visible
    Then the element with locator "[data-test='table-row-Viewport']" should be visible
    Then the element "tbody tr:first-of-type td" does appear exactly "10" times

    When I click element with locator "[aria-label='Table settings, sorting, and columns visibility']"
    When I wait on element "[aria-label='Toggle Id column visibility']" to exist
    When I click on the element "[aria-label='Toggle Id column visibility']" via js
    When I wait on element "[data-test='table-header-Id']" to not be displayed
    Then the element "th" does appear exactly "9" times
    Then the element "tbody tr:first-of-type td" does appear exactly "9" times

    When I click on the element "[aria-label='Toggle Id column visibility']" via js
    When I wait 10 seconds for the element with locator "[data-test='table-header-Id']" to be visible
    Then the element "th" does appear exactly "10" times
    Then the element "tbody tr:first-of-type td" does appear exactly "10" times


  Scenario: Sorting
    When I create "3" tests with:
      """
          testName: "TestName-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page
    When I wait for test "TestName-0" to appear in table
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-1]" for 10000ms to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-2]" for 10000ms to be visible
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Name']"))
        .filter(x=> x.innerText.includes('TestName-'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              TestName-2, TestName-1, TestName-0
      """

    When I click element with locator "[aria-label='Table settings, sorting, and columns visibility']"

    When I select the option with the text "Name" for element "select[data-test='table-sort-by-select']"
    When I click element with locator "[aria-label='sort order is descendant']"

    Then the 1st element with locator "[data-test='table-row-Name']" should have text "TestName-0"
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Name']"))
        .filter(x=> x.innerText.includes('TestName-'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              TestName-0, TestName-1, TestName-2
      """

    When I click element with locator "[aria-label='sort order is ascendant']"

    Then the 1st element with locator "[data-test='table-row-Name']" should have text "TestName-2"
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Name']"))
        .filter(x=> x.innerText.includes('TestName-'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              TestName-2, TestName-1, TestName-0
      """

  # ============================================
  # Test Status
  # ============================================

  @smoke
  Scenario: Test status [(PASSED, NEW, REMOVE PASSED) = NEW]
    # [new, new]
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName-1"

    # [passed, new]
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

    # check status ring
    When I execute javascript code:
      """
    const el = document.querySelector("[data-statusring-name='TestName']").firstChild.childNodes
    return el[0].getAttribute('stroke-dasharray')
    + el[1].getAttribute('stroke-dasharray')
    + el[2].getAttribute('stroke-dasharray')
    + el[3].getAttribute('stroke-dasharray')
      """

    Then I expect the stored "js" string is equal:
      """
          0, 60.318578948924040, 60.318578948924040, 60.318578948924040, 60.31857894892404
      """

    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
            - checkName: CheckName-2
              filePath: files/A.png
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Passed"

    # check status ring
    When I execute javascript code:
      """
    const el = document.querySelector("[data-statusring-name='TestName']").firstChild.childNodes
    return el[0].getAttribute('stroke-dasharray')
    + el[1].getAttribute('stroke-dasharray')
    + el[2].getAttribute('stroke-dasharray')
    + el[3].getAttribute('stroke-dasharray')
      """

    Then I expect the stored "js" string is equal:
      """
          0, 60.3185789489240430.15928947446202, 30.159289474462020, 60.318578948924040, 60.31857894892404
      """

    # remove passed
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckName-1']" to be visible

    When I remove the "CheckName-1" check
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

  @smoke
  Scenario: Test status [(PASSED, FAILED, REMOVE FAILED) = PASSED]
    # [new, new]
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
            - checkName: CheckName-2
              filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName-1"
    When I accept via http the 1st check with name "CheckName-2"

    # [passed, failed]
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

    Given I create "1" tests with:
      """
    testName: TestName
    checks:
      - checkName: CheckName-1
        filePath: files/A.png
      - checkName: CheckName-2
        filePath: files/B.png
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Failed"

    # remove failed
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckName-2']" to be visible
    When I remove the "CheckName-2" check
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Passed"
