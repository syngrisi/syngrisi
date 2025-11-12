Feature: Tests Table Settings

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Set visible Columns
        When I create "1" tests with:
        """
          testName: "TestName"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-test='table-header-Id']" to be visible
        Then the element with locator "[data-test='table-header-Id']" should be visible
        Then the element with locator "[data-test='table-header-Name']" should be visible
        Then the element with locator "[data-test='table-header-Status']" should be visible
        Then the element with locator "[data-test='table-header-Created']" should be visible
        Then the element with locator "[data-test='table-header-Accepted']" should be visible
        Then the element with locator "[data-test='table-header-Date']" should be visible
        Then the element with locator "[data-test='table-header-Browser']" should be visible
        Then the element with locator "[data-test='table-header-Platform']" should be visible
        Then the element with locator "[data-test='table-header-Viewport']" should be visible
        Then the element "th" does appear exactly "10" times

        Then the element with locator "[data-test='table-row-Id']" should be visible
        Then the element with locator "[data-test='table-row-Name']" should be visible
        Then the element with locator "[data-test='table-row-Status']" should be visible
        Then the element with locator "[data-test='table-row-Created']" should be visible
        Then the element with locator "[data-test='table-row-Accepted']" should be visible
        Then the element with locator "[data-test='table-row-Date']" should be visible
        Then the element with locator "[data-test='table-row-Browser']" should be visible
        Then the element with locator "[data-test='table-row-Platform']" should be visible
        Then the element with locator "[data-test='table-row-Viewport']" should be visible
        Then the element "tbody tr:first-of-type td" does appear exactly "10" times

        When I click element with locator "[data-test='table-sorting']"
        When I wait on element "[data-test='settings-visible-columns-Id']" to exist
        When I click on the element "[data-test='settings-visible-columns-Id']" via js
        When I wait on element "[data-test='table-header-Id']" to not be displayed
        Then the element "th" does appear exactly "9" times
        Then the element "tbody tr:first-of-type td" does appear exactly "9" times

        When I click on the element "[data-test='settings-visible-columns-Id']" via js
        When I wait 30 seconds for the element with locator "[data-test='table-header-Id']" to be visible
        Then the element "th" does appear exactly "10" times
        Then the element "tbody tr:first-of-type td" does appear exactly "10" times


    Scenario: Sorting
        When I create "3" tests with:
        """
          testName: "TestName-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" for 10000ms to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" for 10000ms to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-2]" for 10000ms to be visible
        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Name']"))
                .filter(x=> x.innerText.includes('TestName-'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              TestName-2, TestName-1, TestName-0
            """

        When I click element with locator "[data-test='table-sorting']"
        When I wait for "3" seconds
        When I select the option with the text "Name" for element "select[data-test='table-sort-by-select']"
        When I click element with locator "[title='sort order is descendant']"

        When I wait for "3" seconds
        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Name']"))
                .filter(x=> x.innerText.includes('TestName-'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              TestName-0, TestName-1, TestName-2
            """

        When I click element with locator "[title='sort order is ascendant']"

        When I wait for "3" seconds
        When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Name']"))
                .filter(x=> x.innerText.includes('TestName-'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
        Then I expect the stored "js" string is equal:
            """
              TestName-2, TestName-1, TestName-0
            """
