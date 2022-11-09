@smoke
Feature: Navbar basics

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Pagination
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
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I expect that element "[data-test*='navbar_item_']" does appear exactly "20" times
        When I scroll to element "[data-test*='navbar_item_11']"
        When I wait for "1" seconds
        Then I expect that element "[data-test*='navbar_item_']" does appear exactly "30" times

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
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-1')]" does appear exactly "1" times
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-2')]" does appear exactly "1" times

        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        When I wait for "1" seconds
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-1')]" does appear exactly "1" times
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-2')]" does appear exactly "0" times

        When I select the option with the text "Project-2" for element "select[data-test='current-project']"
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        When I wait for "1" seconds
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-1')]" does appear exactly "0" times
        Then I expect that element "//*[@data-test='navbar-item-name' and contains(., 'RunName Project-2')]" does appear exactly "1" times

    Scenario: Group by
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
        When I go to "index2" page
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 2')]" to be displayed

        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be displayed

        When I select the option with the text "Browsers" for element "select[data-test='navbar-group-by']"
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'msedge')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'firefox')]" to be displayed

    Scenario: Group by after item select (pending)
    Check if base filter resetting after change grouping
        When I fail

    Scenario: Group by via url
    Should apply groupBy via url params
        When I fail

    Scenario: Current item (activate it after click)
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
        When I go to "index2" page
        # runs
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "2" times

        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]"
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 1')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "1" times

        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 2')]"
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "1" times

        # suites
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "2" times

        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 1')]"
        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 1')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "1" times

        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName - 2')]"
        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(., 'TestName - 2')]" to be displayed
        Then I expect that element "//*[@data-test='table-row-Name']" does appear exactly "1" times

    Scenario: Select Item (pending)
    Select multiple items
        When I fail

    Scenario: Select Item via Url(pending)
    Select multiple items via Url
        When I fail

    Scenario: Sorting
        When I create "3" tests with:
        """
          testName: "TestName - $"
          runName: "RunName - $"
          suiteName: "SuiteName - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "index2" page

        # without sorting action
        When I wait for "3" seconds
        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='navbar-item-name']"))
                .filter(x=> x.innerText.includes('RunName - '));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              RunName - 2, RunName - 1, RunName - 0
            """

        # sort order - ascending
        When I click on the element "[data-test='navbar-icon-open-sort']"
        When I wait on element "button[data-test='navbar-sort-by-order']" to be displayed
        When I click on the element "button[data-test='navbar-sort-by-order']"
        When I wait for "3" seconds

        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='navbar-item-name']"))
                .filter(x=> x.innerText.includes('RunName - '));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              RunName - 0, RunName - 1, RunName - 2
            """

         # sort order - descendant
        When I click on the element "button[data-test='navbar-sort-by-order']"
        When I wait for "3" seconds

        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='navbar-item-name']"))
                .filter(x=> x.innerText.includes('RunName - '));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              RunName - 2, RunName - 1, RunName - 0
            """

    Scenario: Sorting via url
        When I fail

    Scenario: Quick Filtering
        When I create "2" tests with:
        """
          testName: "TestName - $"
          runName: "RunName - $"
          suiteName: "SuiteName - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "index2" page
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

        When I click on the element "[data-test='navbar-icon-open-filter']"
        When I wait on element "[data-test='navbar-quick-filter']" to be displayed

        When I set "RunName - " to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "2" times


        When I set "RunName - 0" to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to not be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "1" times

        When I set "RunName - " to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be displayed
        Then I expect that element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

    Scenario: Quick filtering with project
        When I fail
