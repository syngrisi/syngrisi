Feature: Logs Table Settings

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Set visible Columns
        When I go to "logs" page
        When I wait on element "[data-test='table-header-Id']" to be displayed
        Then I expect that element "[data-test='table-header-Id']" is displayed
        Then I expect that element "[data-test='table-header-Level']" is displayed
        Then I expect that element "[data-test='table-header-Message']" is displayed
        Then I expect that element "[data-test='table-header-User']" is displayed
        Then I expect that element "[data-test='table-header-Timestamp']" is displayed
        Then I expect that element "th" does appear exactly "6" times

        Then I expect that element "[data-test='table-row-Id']" is displayed
        Then I expect that element "[data-test='table-row-Level']" is displayed
        Then I expect that element "[data-test='table-row-Message']" is displayed
        Then I expect that element "[data-test='table-row-User']" is displayed
        Then I expect that element "[data-test='table-row-Timestamp']" is displayed
        Then I expect that element "tbody tr:first-of-type td" does appear exactly "6" times

        When I click on the element "[data-test='table-sorting']"
        When I wait on element "[data-test='settings-visible-columns-Id']" to exist
        When I click on the element "[data-test='settings-visible-columns-Id']" via js
        When I wait on element "data-test='table-header-Id'" to not be displayed
        Then I expect that element "[data-test='table-row-Id']" is not displayed
        Then I expect that element "th" does appear exactly "5" times
        Then I expect that element "tbody tr:first-of-type td" does appear exactly "5" times

        When I click on the element "[data-test='settings-visible-columns-Scope']" via js
        When I wait on element "[data-test='table-header-Scope']" to be displayed
        Then I expect that element "[data-test='table-row-Scope']" is displayed
        Then I expect that element "th" does appear exactly "6" times
        Then I expect that element "tbody tr:first-of-type td" does appear exactly "6" times

        Scenario: Sorting
            When I create "1" log messages with params:
            """
              message: 2-TESTMSG
              level: info
            """
            When I create "1" log messages with params:
            """
              message: 0-TESTMSG
              level: info
            """
            When I create "1" log messages with params:
            """
              message: 1-TESTMSG
              level: info
            """
            When I go to "logs" page
            When I wait on element "//*[@data-test='table-row-Message' and contains(., '0-TESTMSG')]" for 10000ms to be displayed
            Then I expect that element "//*[@data-test='table-row-Message' and contains(., '1-TESTMSG')]" is displayed
            Then I expect that element "//*[@data-test='table-row-Message' and contains(., '2-TESTMSG')]" is displayed
            When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Message']"))
                .filter(x=> x.innerText.includes('-TESTMSG'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
            Then I expect the stored "js" string is equal:
            """
              1-TESTMSG, 0-TESTMSG, 2-TESTMSG
            """

            When I click on the element "[data-test='table-sorting']"
            When I wait for "3" seconds
            When I select the option with the text "Message" for element "select[data-test='table-sort-by-select']"

            When I wait for "3" seconds
            When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Message']"))
                .filter(x=> x.innerText.includes('-TESTMSG'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
            Then I expect the stored "js" string is equal:
            """
              2-TESTMSG, 1-TESTMSG, 0-TESTMSG
            """

            When I click on the element "[title='sort order is descendant']"
            When I wait for "3" seconds
            When I execute javascript code:
            """
            const elements = Array
                .from(document.querySelectorAll("[data-test='table-row-Message']"))
                .filter(x=> x.innerText.includes('-TESTMSG'));
            const result = elements.map(x=>x.innerText).join(', ');
            return result;
            """
            Then I expect the stored "js" string is equal:
            """
              0-TESTMSG, 1-TESTMSG, 2-TESTMSG
            """
