@fast-server @env:SYNGRISI_AUTH:false @env:SYNGRISI_TEST_MODE:true
Feature: Group by

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

    When I create "1" tests with:
      """
          testName: "TestName - 1"
          runName: "RunName - 1"
          suiteName: "SuiteName - 1"
          browserName: msedge
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "1" tests with:
      """
          testName: "TestName - 2"
          runName: "RunName - 2"
          suiteName: "SuiteName - 2"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page

  @smoke
  Scenario: Group by
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 2')]" to be visible

    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be visible

    When I select the option with the text "Browsers" for element "select[data-test='navbar-group-by']"
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'msedge')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'firefox')]" to be visible

  @smoke
  Scenario: Group by after item select
    Check if base filter resetting after change grouping
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName - 1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName - 2']" to be visible
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]"
    When I wait on element "[data-table-test-name='TestName - 2']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName - 1']" to be visible
    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName - 1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName - 2']" to be visible

  Scenario: Group by via Url
    Should apply groupBy via url params
    # suites
    When I open the url "<syngrisiUrl>?groupBy=suites"
    When I wait for "5" seconds

    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be visible

    # breadcrumbs and title for suites
    Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"
    Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Suites"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=/?groupBy=suites"
    Then the title is "By Suites"

  @smoke
  Scenario Outline: Group by - <groupBy> Navigation
    Check Breadcrumbs, Title and Url changes behaviour on grouping changes
    When I select the option with the text "<groupBy>" for element "select[data-test='navbar-group-by']"
    Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"

    When I wait 10 seconds for the element with locator "(//*[@data-test='bread-crumbs']//a[text()='<title>'])" to be visible
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=<href>"
    Then the title is "<title>"

    Examples:
      | groupBy       | title            | href                                |
      | Runs          | By Runs          | /?groupBy=runs                      |
      | Suites        | By Suites        | /?groupBy=suites                    |
      | Browsers      | By Browser       | /?groupBy=test-distinct/browserName |
      | Platform      | By Platform      | /?groupBy=test-distinct/os          |
      | Test Status   | By Test Status   | /?groupBy=test-distinct/status      |
      | Accept Status | By Accept Status | /?groupBy=test-distinct/markedAs    |
