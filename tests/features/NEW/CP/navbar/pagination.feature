@smoke
Feature: Pagination
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
