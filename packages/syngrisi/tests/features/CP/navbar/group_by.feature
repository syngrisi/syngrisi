Feature: Group by

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
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
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 2')]" to be displayed

        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be displayed

        When I select the option with the text "Browsers" for element "select[data-test='navbar-group-by']"
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'msedge')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'firefox')]" to be displayed

    @smoke
    Scenario: Group by after item select
    Check if base filter resetting after change grouping
        When I wait on element "[data-table-test-name='TestName - 1']" to be displayed
        When I wait on element "[data-table-test-name='TestName - 2']" to be displayed
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]"
        When I wait for "2" seconds
        When I wait on element "[data-table-test-name='TestName - 2']" to not be displayed
        When I wait on element "[data-table-test-name='TestName - 1']" to be displayed
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I wait on element "[data-table-test-name='TestName - 1']" to be displayed
        When I wait on element "[data-table-test-name='TestName - 2']" to be displayed

    Scenario: Group by via Url
    Should apply groupBy via url params
        # suites
        When I open the url "<syngrisiUrl>?groupBy=suites"

        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be displayed

