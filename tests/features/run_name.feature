Feature: Get run name on colorized Runs block

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Get run name on colorized Runs block
        When I set window size: "1700x768"
        When I maximize window
        When I create "1" tests with params:
        """
          testName: "Test"
          checkName: Check - 1
          run: Run - 1
        """
        When I create "1" tests with params:
        """
          testName: "Test"
          checkName: Check - 1
          run: Run - 1
        """
        When I open the app
        When I wait on element "a[name='colorize-tests']" to be displayed
        When I click on the element "a[name='colorize-tests']"
        When I wait on element "div[run]" to be displayed
        When I wait for "1" seconds
        When I move to element "div[run]"
        When I wait for "3" seconds
        Then I expect that the element "div[run]" to have attribute "title" containing "Run - 1"
