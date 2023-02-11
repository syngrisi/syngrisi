Feature: Group by Navigation
    Check Breadcrumbs, Title and Url changes behaviour on grouping changes

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario Outline:  Group by - <groupBy>
        When I go to "index2" page
        # runs
        When I select the option with the text "<groupBy>" for element "select[data-test='navbar-group-by']"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/index2"

        When I wait on element "(//*[@data-test='bread-crumbs']//a[text()='<title>'])" to be displayed
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "<href>"
        Then I expect that the title is "<title>"

        Examples:
            | groupBy       | title            | href                                       |
            | Runs          | By Runs          | /index2/?groupBy=runs                      |
            | Suites        | By Suites        | /index2/?groupBy=suites                    |
            | Browsers      | By Browser       | /index2/?groupBy=test-distinct/browserName |
            | Platform      | By Platform      | /index2/?groupBy=test-distinct/os          |
            | Test Status   | By Test Status   | /index2/?groupBy=test-distinct/status      |
            | Accept Status | By Accept Status | /index2/?groupBy=test-distinct/markedAs    |


    Scenario: Group by via Url
        When I go to "index2" page
        # default
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/index2"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[2]" to have text "By Runs"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "/index2/?groupBy=runs"
        Then I expect that the title is "By Runs"

        # suites
        When I open the url "<syngrisiUrl>index2/?groupBy=suites"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[1]" to have text "Test Results"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[1]" is "/index2"
        Then I expect that element "(//*[@data-test='bread-crumbs']//a)[2]" to have text "By Suites"
        Then I expect that the attribute "href" from element "(//*[@data-test='bread-crumbs']//a)[2]" is "/index2/?groupBy=suites"
        Then I expect that the title is "By Suites"
