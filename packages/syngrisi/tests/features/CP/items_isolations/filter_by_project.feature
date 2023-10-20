@smoke
Feature: Filter by Project

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

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
        When I go to "main" page

        When I wait on element "[data-table-test-name='TestName Project-1']" to be displayed
        When I wait on element "[data-table-test-name='TestName Project-2']" to be displayed

        Then I expect that element "[data-table-test-name='TestName Project-1']" does appear exactly "1" times
        Then I expect that element "[data-table-test-name='TestName Project-2']" does appear exactly "1" times

        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        When I wait for "1" seconds
        When I wait on element "[data-table-test-name='TestName Project-1']" to be displayed
        Then I expect that element "[data-table-test-name='TestName Project-1']" does appear exactly "1" times
        Then I expect that element "[data-table-test-name='TestName Project-2']" does appear exactly "0" times

        When I select the option with the text "Project-2" for element "select[data-test='current-project']"
        When I wait for "1" seconds
        When I wait on element "[data-table-test-name='TestName Project-2']" to be displayed
        Then I expect that element "[data-table-test-name='TestName Project-1']" does appear exactly "0" times
        Then I expect that element "[data-table-test-name='TestName Project-2']" does appear exactly "1" times
