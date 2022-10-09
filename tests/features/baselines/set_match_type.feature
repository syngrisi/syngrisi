Feature: Baseline - Match Type

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Change Match Type
        When I open the app
        When I create "1" tests with:
        """
          testName: "Test - $"
          checks:
            - filePath: files/anti_off.png
              checkName: Check - 1
        """
        When I wait and refresh page on element "span=Test - 1" for "5" seconds to exist
        When I click on "Test - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - 1" view
        When I wait for "2" seconds
        Then the element "#ignore_menu" is not displayed
        When I accept via http the 1st check with name "Check - 1"
        When I wait for "1" seconds
        When I refresh page
        Then the element "#ignore_menu" is displayed
        When I click on the element "#dropdownMenuButton"
        When I click on the element "=antialiasing"
        When I wait for "3" seconds
        When I refresh page
        Then the element "#dropdownMenuButton" contains the text "antialiasing"

        When I create "1" tests with:
        """
          testName: "Test - $"
          checks:
            - filePath: files/anti_on.png
              checkName: Check - 1
        """
        When I wait for "2" seconds
        When I open the app
        When I click on "Test - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - 1" view
        Then I expect that element "#mismatch_percentage" is displayed
        Then the element "#mismatch_percentage" contains the text "(0.66%)"
