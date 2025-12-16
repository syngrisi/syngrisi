Feature: Distinct filters functionality

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage
        When I set window size: "1440x900"

    Scenario: Distinct
        When I create "1" tests with:
         """
          project: "Project-1"
          testName: "TestName filter-0"
          browserName: safari-0
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-0
        """
        When I create "1" tests with:
         """
          project: "Project-1"
          testName: "TestName filter-1"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
        """

        When I go to "main" page

        # not accepted failed
        When I create "1" tests with:
         """
          project: "Project-1"
          testName: "TestName filter-3"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
        """
        When I go to "main" page

        When I wait for "1" seconds
        When I wait on element "[data-table-test-name='TestName filter-0']" to be displayed
        When I wait on element "[data-table-test-name='TestName filter-1']" to be displayed

        # BROWSER
        # open filter
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed

        # set filter
        When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I wait for "2" seconds
        Then I expect that element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" contain value "safari-1"

        Then I expect that element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" to have text "safari-1"
        Then I expect that element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" to have text "safari-0"

        # apply filter
        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
        When I wait on element "[data-table-test-name='TestName filter-1']" to be displayed

        # close drawer
        When I click on the element "[data-test='relative-wrapper-icon']"
        When I wait on element "//*[@data-test='filter-main-group']" to not be displayed


        # STATUS
        # open filter
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed

        # set filter new
        When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I wait for "2" seconds
        Then I expect that element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" contain value "New"

        Then I expect that element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" to have text "New"
        Then I expect that element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" to have text "Failed"

        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "[data-table-test-name='TestName filter-1']" to be displayed
        When I wait on element "[data-table-test-name='TestName filter-0']" to be displayed
        When I wait on element "[data-table-test-name='TestName filter-3']" to not be displayed

         # set filter failed
        When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

        When I click on the element "[data-test='table-filter-value']"
        When I click on the element "div=Failed"

        When I wait for "1" seconds
        Then I expect that element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" contain value "Failed"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "[data-table-test-name='TestName filter-1']" to not be displayed
        When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
        When I wait on element "[data-table-test-name='TestName filter-3']" to be displayed

