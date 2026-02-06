@smoke @fast-server
Feature: Group by Navigation
    Check Breadcrumbs, Title and Url changes behaviour on grouping changes

    Background:
        # Server is managed by @fast-server hook automatically
        When I open the app
        When I clear local storage

    Scenario Outline:  Group by - <groupBy>
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-test='bread-crumbs']" to be visible
        # runs
        When I wait 30 seconds for the element with locator "select[data-test='navbar-group-by']" to be visible
        When I select the option with the text "<groupBy>" for element "select[data-test='navbar-group-by']"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
        Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"

        When I wait 30 seconds for the element with locator "(//*[@data-test='bread-crumbs']//a[text()='<title>'])" to be visible
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
        When I wait 30 seconds for the element with locator "[data-test='bread-crumbs']" to be visible
        # default
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
        Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Runs"
        Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=/?groupBy=runs"
        Then the title is "By Runs"

        # suites
        When I open the url "<syngrisiUrl>?groupBy=suites"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
        Then the element with locator "(//*[@data-test='bread-crumbs']//a)[1]" should have has attribute "href=/"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Suites"
        Then the element with locator "(//*[@data-test='bread-crumbs']//a)[2]" should have has attribute "href=/?groupBy=suites"
        Then the title is "By Suites"
