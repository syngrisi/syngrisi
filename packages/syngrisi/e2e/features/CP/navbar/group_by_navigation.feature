@fast-server @env:SYNGRISI_AUTH:false @env:SYNGRISI_TEST_MODE:true
Feature: Group by Navigation
  Check Breadcrumbs, Title and Url changes behaviour on grouping changes

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario Outline:  Group by - <groupBy>
    When I go to "main" page
    # runs
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


  Scenario: Group by via Url
    When I go to "main" page
    # default
    Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"
    Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Runs"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=/?groupBy=runs"
    Then the title is "By Runs"

    # suites
    When I open the url "<syngrisiUrl>?groupBy=suites"
    When I wait for "5" seconds
    Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"
    Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Suites"
    Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=/?groupBy=suites"
    Then the title is "By Suites"
