Feature: Group by Navigation
    Check Breadcrumbs, Title and Url changes behaviour on grouping changes

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario Outline:  Group by - <groupBy>
        When I go to "main" page
        # runs
        When I select the option with the text "<groupBy>" for element "select[data-test='navbar-group-by']"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" has attribute "href" "/"

        When I wait 30 seconds for the element with locator "(//*[@data-test='bread-crumbs']//a[text()='<title>'])" to be visible
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" has attribute "href" "<href>"
        Then the title is "<title>"

        Examples:
            | groupBy       | title            | href                                       |
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
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" has attribute "href" "/"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Runs"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" has attribute "href" "/?groupBy=runs"
        Then the title is "By Runs"

        # suites
        When I open the url "<syngrisiUrl>?groupBy=suites"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" matches the text "Test Results"
        Then the element "(//*[@data-test='bread-crumbs']//a)[1]" has attribute "href" "/"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" matches the text "By Suites"
        Then the element "(//*[@data-test='bread-crumbs']//a)[2]" has attribute "href" "/?groupBy=suites"
        Then the title is "By Suites"
