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
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/"

        When I wait on element "(//*[@data-test='bread-crumbs']//a[text()='<title>'])" to be displayed
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "<href>"
        Then I expect that the title is "<title>"

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
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[2]" to have text "By Runs"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "/?groupBy=runs"
        Then I expect that the title is "By Runs"

        # suites
        When I open the url "<syngrisiUrl>?groupBy=suites"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[2]" to have text "By Suites"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "/?groupBy=suites"
        Then I expect that the title is "By Suites"
