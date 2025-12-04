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


    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"



    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    When I click element with locator "[aria-label='Reset filter']"
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

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


    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-P2']" to be visible

    # select project

    # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
    When I select the option with the text "Project-1" for element "select[data-test='current-project']"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-P2']" to not be displayed

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
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


    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-RunName-2']" to be visible

    When I click element with locator "//*[@data-test='navbar-item-name' and contains(.,'RunName-1')]"
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-RunName-2']" to not be displayed

    # filter contains
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
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


    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When the element "[data-table-test-name=TestName-1]" does appear exactly "2" times
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-2]" to be visible

    # filter eq test name
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "TestName-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"


    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When the element "[data-table-test-name=TestName-1]" does appear exactly "2" times
    When I wait on element "[data-table-test-name=TestName-2]" to not be displayed

    # filter eq browser name
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "firefox" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"
    When I click element with locator "[aria-label='Apply filter']"



    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='table-row-Browser' and contains(.,'firefox')]" to be visible
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


    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-chrome]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-firefox]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-msedge]" to be visible

    # filter eq test name
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 10 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
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


    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-firefox]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-chrome]" to be visible
    When I wait on element "[data-table-test-name=TestName-msedge]" to not be displayed
