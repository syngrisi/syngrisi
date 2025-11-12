@smoke
Feature: Navigation via link parameters

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

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

        When I wait for "1" seconds
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-1']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-unfiltered']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

        # select project
        When I wait for "3" seconds
        # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        When I select the option with the text "Project-2" for element "select[data-test='current-project']"

        When I wait for "1" seconds
        When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-unfiltered']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

        # group by suite and chose second suite
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I wait for "1" seconds
        When I click element with locator "//*[@data-test='navbar-item-name' and contains(.,'SuiteNameProject-2-2')]"

        When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
        When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-0']" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

        # filter contains
        When I click element with locator "[data-test='table-filtering']"
        When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click element with locator "[data-test='table-filter-apply']"
        When I wait for "5" seconds
        When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
        When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
        When I wait on element "[data-table-test-name='TestName Project-2-filter-0']" to not be displayed
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible

        # refresh page
        When I refresh page
        When I wait for "5" seconds
        When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
        When I wait on element "[data-table-test-name='TestName Project-2-unfiltered']" to not be displayed
        When I wait on element "[data-table-test-name='TestName Project-2-filter-0']" to not be displayed
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName Project-2-filter-1']" to be visible
