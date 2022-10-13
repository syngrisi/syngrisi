@smoke
Feature: Test Main Table

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Infinity scroll
        When I create "30" tests with:
        """
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
        When I go to "index2" page
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName-29')]" to be displayed
        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "20" times

        When I scroll to element "//*[@data-test='table-row-Name' and contains(., 'TestName-11')]"
        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "30" times

    Scenario: Update Table with new Tests
    After the user opens the table, the Application store items timestamp on the open the table moment,
    and then shows the user only items that are older than this timestamp and when the new items continue to arrive,
    the user should see new items counter indicator on the top right corner of the 'Refresh' icon (which will be
    updated every 3 seconds) and after clicking on the icon, the table will be refreshed with new items.

        When I create "1" tests with:
        """
          testName: "TestName-before"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-before')]" to be displayed

        When I wait for "3" seconds
        When I refresh page
        When I create "3" tests with:
        """
          testName: "TestName-after"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I wait for "5" seconds
        Then I expect that element "[data-test='table-refresh-icon-badge']" to contain text "3"
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-before')]" to be displayed

        When I click on the element "[data-test='table-refresh-icon']"
        When I wait for "3" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-after')]" for 10000ms to be displayed
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName-after')]" does appear exactly "3" times

    Scenario: Select, fold/unfold icon - appear
        When I create "1" tests with:
        """
          testName: "TestName"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I go to "index2" page
        When I wait for "5" seconds
        Then I expect that element "[data-test='folding-table-items]" is not displayed

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName')]" to be displayed
        When I click on the element "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        When I click on the element "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
        When I wait for "5" seconds
        When I wait on element "[data-test='folding-table-items']" to not be displayed

    Scenario: Filter by Project
        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName Project-1"
          runName: "RunName Project-1"
          runIdent: "RunIdent Project-1 $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I create "1" tests with:
        """
          project: "Project-2"
          testName: "TestName Project-2"
          runName: "RunName Project-2"
          runIdent: "RunIdent Project-2 $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "index2" page

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2')]" to be displayed

        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" does appear exactly "1" times
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2')]" does appear exactly "1" times

        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" does appear exactly "1" times
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2')]" does appear exactly "0" times

        When I select the option with the text "Project-2" for element "select[data-test='current-project']"
        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" does appear exactly "0" times
        Then I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2')]" does appear exactly "1" times

    Scenario: Select, fold/unfold items (pending)
        When I fail

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
        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-unfiltered')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-1')]" to be displayed

        # select project
        When I wait for "3" seconds
        # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        When I select the option with the text "Project-2" for element "select[data-test='current-project']"

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-unfiltered')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-1')]" to be displayed

        # group by suite and chose second suite
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I wait for "1" seconds
        When I click on the element "//*[@data-test='navbar-item-name' and contains(.,'SuiteNameProject-2-2')]"

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-unfiltered')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-1')]" to be displayed

        # filter contains
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"
        When I wait for "5" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-unfiltered')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-0')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-1')]" to be displayed

        # refresh page
        When I refresh page
        When I wait for "5" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-1')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-unfiltered')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-0')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName Project-2-filter-1')]" to be displayed

    Scenario: Check modal
    Check if open by click and close, check if url params disappeared when modal is close then refresh page and check modal again)
    Check if open by url
        When I fail
