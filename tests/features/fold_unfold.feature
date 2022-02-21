Feature: Fold/unfold Tests
    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Fold and unfold Tests
        When I create "1" tests with params:
        """
          testName: "Test1"
          checkName: Check - 1
        """
        When I create "1" tests with params:
        """
          testName: "Test2"
          checkName: Check - 2
        """
        When I open the app
        When I wait and refresh page on element "span=Test1 - 1" for "3" seconds to exist
        When I wait and refresh page on element "span=Test2 - 1" for "3" seconds to exist

        Then I wait on element "[title='Check - 1']" to not clickable
        Then I wait on element "[title='Check - 2']" to not clickable
#
        When I click on the element "#toggle-visible-test"
        When I wait for "3" seconds
        Then I wait on element "[title='Check - 1']" to clickable
        Then I wait on element "[title='Check - 2']" to clickable
        When I click on the element "#toggle-visible-test"
        When I wait for "3" seconds
        Then I wait on element "[title='Check - 1']" to not clickable
        Then I wait on element "[title='Check - 2']" to not clickable
