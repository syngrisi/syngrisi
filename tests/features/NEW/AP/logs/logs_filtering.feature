Feature: Logs Table Filter

    Background:
        When I open the url "data:,"
        Given I clear Database and stop Server
        Given I start Server and start Driver

    @smoke
    Scenario: Main Group, Single Rule
        When I create "20" log messages with params:
            """
              message: filler
            """
        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: info
            """
        When I go to "logs" page
        When I wait on element "[data-test*='table_row_']" to be displayed
        Then I expect that element "[data-test*='table_row_']" does appear exactly "20" times

        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"
        When I wait for "5" seconds

        Then I expect that element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "3" times
        Then I expect that element "[data-test*='table_row_']" does appear exactly "3" times

    @smoke
    Scenario: Main Group, Multiple Rules - And
        When I create "20" log messages with params:
            """
              message: filler
            """
        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: info
            """

        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: warn
            """
        When I go to "logs" page
        When I wait on element "[data-test*='table_row_']" to be displayed
        Then I expect that element "[data-test*='table_row_']" does appear exactly "20" times

        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed

        # message
        When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"

        # level
        When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
        When I wait for "2" seconds
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
        When I select the option with the text "warn" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

        When I click on the element "[data-test='table-filter-apply']"
        When I wait for "3" seconds

        Then I expect that element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "3" times
        Then I expect that element "//*[@data-test='table-row-Level' and @title='warn']" does appear exactly "3" times
        Then I expect that element "[data-test*='table_row_']" does appear exactly "3" times

    @smoke
    Scenario: Main Group, Multiple Rules - Or
        When I create "20" log messages with params:
            """
              message: filler
            """
        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: info
            """

        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: warn
            """

        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: error
            """
        When I go to "logs" page
        When I wait on element "[data-test*='table_row_']" to be displayed
        Then I expect that element "[data-test*='table_row_']" does appear exactly "20" times

        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I click on the element "//*[@data-test='filter-main-group']//*[@data-test='filter-group-operator-or']/.."

        # level warn
        When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I wait for "2" seconds
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I select the option with the text "warn" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"

        # level error
        When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
        When I wait for "2" seconds
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
        When I select the option with the text "error" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

        When I click on the element "[data-test='table-filter-apply']"
        When I wait for "3" seconds

        Then I expect that element "[data-test*='table_row_']" does appear exactly "6" times
        Then I expect that element "//*[@data-test='table-row-Level' and @title='warn']" does appear exactly "3" times
        Then I expect that element "//*[@data-test='table-row-Level' and @title='error']" does appear exactly "3" times

    Scenario: Two Groups
        When I set window size: "1300x768"
        When I create "20" log messages with params:
            """
              message: filler
            """
        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: info
            """

        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: warn
            """

        When I create "3" log messages with params:
            """
              message: TESTMSG
              level: error
            """
        When I go to "logs" page
        When I wait on element "[data-test*='table_row_']" to be displayed
        Then I expect that element "[data-test*='table_row_']" does appear exactly "20" times

        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed

        # message main groups
        When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"

        When I click on the element "[data-test='table-filter-add-group-button']"
        When I click on the element "//*[@data-test='filter-group-0']//*[@data-test='filter-group-operator-or']/.."

        # new group level - error
        When I select the option with the text "Level" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I wait for "2" seconds
        When I select the option with the text "equals" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I select the option with the text "error" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"

        When I click on the element "//*[@data-test='filter-group-0']//button[@data-test='table-filter-add-rule-button']"

        # new group level - info
        When I select the option with the text "Level" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
        When I wait for "2" seconds
        When I select the option with the text "equals" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
        When I select the option with the text "info" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

        When I scroll to element "[data-test='table-filter-apply']"
        When I wait for "2" seconds
        When I click on the element "[data-test='table-filter-apply']"
        When I wait for "3" seconds

        Then I expect that element "[data-test*='table_row_']" does appear exactly "6" times
        Then I expect that element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "6" times
        Then I expect that element "//*[@data-test='table-row-Level' and @title='error']" does appear exactly "3" times
        Then I expect that element "//*[@data-test='table-row-Level' and @title='info']" does appear exactly "3" times
