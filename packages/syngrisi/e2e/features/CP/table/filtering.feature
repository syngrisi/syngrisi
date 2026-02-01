@fast-server
Feature: Tests Table Filter

  Background:

    When I open the app
    When I clear local storage

  @smoke
  Scenario: Main Group, Single Rule
    When I create "2" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page
    When I wait for test "TestName filter-0" to appear in table
    When I wait for test "TestName filter-1" to appear in table

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"



    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    When I click element with locator "[aria-label='Reset filter']"
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

  @smoke
  Scenario: Main Group, Single Rule with project Filter
    When I create "2" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "1" tests with:
      """
          project: "Project-2"
          testName: "TestName filter-P2"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page

    # Wait for all tests with proper refresh
    When I wait for test "TestName filter-0" to appear in table
    When I wait for test "TestName filter-1" to appear in table
    When I wait for test "TestName filter-P2" to appear in table

    # select project

    # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
    When I select the option with the text "Project-1" for element "select[data-test='current-project']"

    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-P2']" to not be displayed

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-P2']" to not be displayed

  Scenario: Filter after select navbar item
    When I create "2" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-$"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-RunName-2"
          runName: "RunName-2"
          runIdent: "RunIdent-2"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """

    When I go to "main" page

    # Wait for all test data to be indexed and visible with refresh
    When I wait for test "TestName filter-0" to appear in table
    When I wait for test "TestName filter-1" to appear in table
    When I wait for test "TestName filter-RunName-2" to appear in table
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-RunName-2']" to be visible

    When I click element with locator "//*[@data-test='navbar-item-name' and contains(.,'RunName-1')]"
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-RunName-2']" to not be displayed

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-RunName-2']" to not be displayed

  Scenario: Main Group, Multiple Rules - And
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-1"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """

    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-1"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
      """

    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-2"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
      """
    When I go to "main" page

    # Wait for all tests to appear with proper refresh
    When I wait for test "TestName-1" to appear in table
    When I wait for test "TestName-2" to appear in table
    When the element "[data-table-test-name=TestName-1]" does appear exactly "2" times

    # filter eq test name
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I click element with locator "//*[@data-test='filter-main-group']//*[@data-test='table-filter-add-rule-button']"
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "TestName-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"


    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When the element "[data-table-test-name=TestName-1]" does appear exactly "2" times
    When I wait on element "[data-table-test-name=TestName-2]" to not be displayed

    # filter eq browser name
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "firefox" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"



    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When I wait 30 seconds for the element with locator "//*[@data-test='table-row-Browser' and contains(.,'firefox')]" to be visible
    When I wait on element "//*[@data-test='table-row-Browser' and contains(.,'chrome')]" to not be displayed
    When the element "[data-table-test-name=TestName-1]" does appear exactly "1" times
    When I wait on element "[data-table-test-name=TestName-2]" to not be displayed

  Scenario: Main Group, Multiple Rules - Or
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-chrome"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: chrome
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: chrome
      """

    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-firefox"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
      """

    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName-msedge"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: msedge
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
      """

    When I go to "main" page

    # Wait for all tests to appear with proper refresh
    When I wait for test "TestName-chrome" to appear in table
    When I wait for test "TestName-firefox" to appear in table
    When I wait for test "TestName-msedge" to appear in table

    # filter eq test name
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I click element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-group-operator-or']/.."

    # filter browser name equals chrome
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I select the option with the text "firefox" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"

    When I click element with locator "[aria-label='Apply filter']"

    # filter browser name equals firefox
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "chrome" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

    When I click element with locator "[aria-label='Apply filter']"


    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-firefox]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-chrome]" to be visible
    When I wait on element "[data-table-test-name=TestName-msedge]" to not be displayed

  # Quick Filtering scenarios (merged from quick_filter.feature)

  @smoke
  Scenario: Quick Filtering
    When I create "2" tests with:
      """
      project: "Project-1"
      testName: "TestName-$"
      checks:
        - checkName: Check - 1
          filePath: files/A.png
      """

    When I create "1" tests with:
      """
      project: "Project-1"
      testName: "ZestName-1"
      checks:
        - checkName: Check - 1
          filePath: files/A.png
      """

    When I go to "main" page

    # Wait for all test data to be indexed and visible (use proper wait with refresh)
    When I wait for test "TestName-0" to appear in table
    When I wait for test "TestName-1" to appear in table
    When I wait for test "ZestName-1" to appear in table
    When I wait 10 seconds for the element with locator "[data-test='table-quick-filter']" to be visible

    When I set "TestName-" to the inputfield "[data-test='table-quick-filter']"
    # Wait for filter to be applied - TestName items should be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-1']" to be visible
    # ZestName-1 should be filtered out
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

    When I set "TestName-0" to the inputfield "[data-test='table-quick-filter']"
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-0']" to be visible
    Then I wait on element "[data-table-test-name='TestName-1']" to not be displayed
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

    When I set "TestName-1" to the inputfield "[data-test='table-quick-filter']"
    Then I wait on element "[data-table-test-name='TestName-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-1']" to be visible
    Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

  @smoke
  Scenario: Quick Filtering with Project
    When I create "2" tests with:
      """
      project: "Project-1"
      testName: "TestNameP1-$"
      checks:
        - checkName: Check - 1
          filePath: files/A.png
      """

    When I create "1" tests with:
      """
      project: "Project-2"
      testName: "TestNameP2-$"
      checks:
        - checkName: Check - 1
          filePath: files/A.png
      """

    When I go to "main" page

    # Wait for all tests to appear with proper refresh
    When I wait for test "TestNameP1-0" to appear in table
    When I wait for test "TestNameP1-1" to appear in table
    When I wait for test "TestNameP2-0" to appear in table

    When I select the option with the text "Project-1" for element "select[data-test='current-project']"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestNameP1-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestNameP1-1']" to be visible
    Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed

    When I set "TestNameP1-0" to the inputfield "[data-test='table-quick-filter']"
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestNameP1-0']" to be visible
    Then I wait on element "[data-table-test-name='TestNameP1-1']" to not be displayed
    Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed

  # Distinct filtering scenario (merged from distincts_filter.feature)

  Scenario: Distinct Filter Values
    When I set window size: "1440x900"
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-0"
          browserName: safari-0
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-0
      """
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-1"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
      """

    When I go to "main" page
    When I wait for test "TestName filter-0" to appear in table
    When I wait for test "TestName filter-1" to appear in table

    # not accepted failed
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-3"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
      """
    When I go to "main" page
    When I wait for test "TestName filter-3" to appear in table

    # BROWSER
    # open filter
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # set filter
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "safari-1"

    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" matches the text "safari-1"
    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" matches the text "safari-0"

    # apply filter
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    # close drawer
    When I click element with locator "[aria-label='Close']"
    When I wait on element "//*[@data-test='filter-main-group']" to not be displayed


    # STATUS
    # open filter
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # set filter new
    When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "New"

    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" matches the text "New"
    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" matches the text "Failed"

    When I click element with locator "[aria-label='Apply filter']"

    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-3']" to not be displayed

    # set filter failed
    When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    When I select dropdown option "Failed" by clicking div for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"
    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "Failed"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-1']" to not be displayed
    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-3']" to be visible
