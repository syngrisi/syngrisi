@smoke
Feature: Log Basics

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Check Infinity scroll
        When I create "41" log messages with params:
            """
              message: TESTMSG
              level: info
            """

        When I go to "logs" page
        When I wait on element "[data-test='table-row-Message']" for 10000ms to be displayed
        Then I expect that element "[data-test='table-row-Message']" does appear exactly "20" times
        When I scroll to element "(//*[@data-test='table-row-Message'])[20]"
        When I wait for "5" seconds
        Then I expect that element "[data-test='table-row-Message']" does appear exactly "40" times

        # scroll affix
        Then I expect that element "[data-test='infinity-scroll-affix-loaded-count']" to contain text "2"
        Then I expect that element "[data-test='infinity-scroll-affix-total-count']" to contain text "3"

        When I execute javascript code:
        """
        return document.querySelector("[data-test='table-scroll-area'] .mantine-ScrollArea-viewport").scrollTop.toString();
        """
        Then I expect the stored "js" string is not equal:
        """
          0
        """

        When I click on the element "[data-test='infinity-scroll-affix']"

        When I execute javascript code:
        """
        return document.querySelector("[data-test='table-scroll-area'] .mantine-ScrollArea-viewport").scrollTop.toString();
        """
        Then I expect the stored "js" string is equal:
        """
          0
        """

    Scenario: Update Table with new Logs
    After the user opens the log table, the Application store logs timestamp on the open the table moment,
    and then shows the user only logs that are older than this timestamp and when the new logs continue to arrive,
    the user should see new logs counter indicator on the top right corner of the 'Refresh' icon (which will be
    updated every 3 seconds) and after clicking on the icon, the table will be refreshed with new logs.

        When I go to "logs" page
        When I create "5" log messages with params:
            """
              message: TESTMSG
              level: info
            """
        When I wait for "5" seconds
        Then I expect that element "[data-test='table-refresh-icon-badge']" to contain text "5"

        Then I expect that element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "0" times
        When I click on the element "[data-test='table-refresh-icon']"
        When I wait on element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" for 10000ms to be displayed
        Then I expect that element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "5" times

    Scenario: Select, fold/unfold icon - appear
        When I create "1" log messages with params:
            """
              message: TESTMSG
              level: info
            """
        When I go to "logs" page
        When I wait for "5" seconds
        Then I expect that element "[data-test='folding-table-items]" is not displayed

        When I wait on element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]" to be displayed
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
        When I wait on element "[data-test='folding-table-items']" to be displayed
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
        When I wait for "5" seconds
        When I wait on element "[data-test='folding-table-items']" to not be displayed

    Scenario: Select, fold/unfold icon - appear
        When I create "1" log messages with params:
            """
              message: TESTMSG
              level: info
            """
        When I go to "logs" page
        When I wait for "5" seconds
        Then I expect that element "[data-test='folding-table-items]" is not displayed

        When I wait on element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]" to be displayed
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
        When I wait on element "[data-test='folding-table-items']" to be displayed
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
        When I wait for "5" seconds
        When I wait on element "[data-test='folding-table-items']" to not be displayed

    Scenario: Select, fold/unfold items
        When I create "20" log messages with params:
            """
              message: filler
              level: info
            """
        When I create "1" log messages with params:
            """
              message: TESTMSG
              level: info
            """
        When I go to "logs" page
        # unfold at click
        When I wait on element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]" to be displayed
        Then I expect that element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" is not displayed
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]"
        Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to be displayed

        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]"
        When I wait for "3" seconds
        Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to not be displayed

        # unfold by item checkbox and unfold icon
        When I click on the element "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to be displayed

        When I click on the element "[data-test='folding-table-items']"
        When I wait for "3" seconds
        Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to not be displayed

        # unfold all
        When I click on the element "[data-test='table-select-all']"
        When I wait on element "[data-test='folding-table-items']" to be displayed
        When I click on the element "[data-test='folding-table-items']"
        When I wait for "5" seconds
        Then I expect that element "//*[@data-test='table-item-collapsed-row']" does appear exactly "20" times
