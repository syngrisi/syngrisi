@integration @smoke
Feature: Projects

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Create 2 tests in different projects
        # 1st project
        When I create "1" tests with params:
        """
          testName: "Test1"
          checkName: Check - 1
          project: Project - 1
        """
        When I open the app
        When I click on the element "#dropdownProjects"
        Then I expect that element "a[title='All projects']" has the class "active"

        When I click on the element "a[title='Project - 1']"
        When I wait for "3" seconds
        When I click on the element "#dropdownProjects"
        Then I expect that element "a[title='Project - 1']" has the class "active"
        When I wait and refresh page on element "span=Test1 - 1" for "3" seconds to exist

        When I click on "Test1 - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Test1 - 1" is unfolded
        Then I wait on element "[title='Check - 1']" to be displayed


        # 2nd project
        When I create "1" tests with params:
        """
          testName: "Test2"
          checkName: Check - 2
          project: Project - 2
        """
        When I open the app
        When I click on the element "#dropdownProjects"
        When I click on the element "a[title='Project - 2']"
        When I wait for "3" seconds
        When I click on the element "#dropdownProjects"
        Then I expect that element "a[title='Project - 2']" has the class "active"
        When I wait and refresh page on element "span=Test2 - 1" for "3" seconds to exist
        Then I wait on element "span=Test1 - 1" to not be displayed

        When I click on "Test2 - 1" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Test2 - 1" is unfolded
        Then I wait on element "[title='Check - 2']" to be displayed

        # all projects
        When I open the app
        When I click on the element "#dropdownProjects"
        When I click on the element "a[title='All projects']"
        When I wait for "3" seconds
        Then I wait on element "span=Test1 - 1" to be displayed
        Then I wait on element "span=Test2 - 1" to be displayed

        When I click on "Test1 - 1" VRS test
        When I wait for "2" seconds
        Then I wait on element "[title='Check - 1']" to be displayed

        When I click on "Test2 - 1" VRS test
        When I wait for "2" seconds
        Then I wait on element "[title='Check - 2']" to be displayed

    Scenario: Runs - create 2 tests in different projects
    Unfortunately we have 2 (the same) separate 'tests' and 'checks' filtering logics
    both in controller and .ejs templates, therefore we forced to do test 2 times.
    This have to be refactored in the future.
        # 1st project
        When I create "1" tests with params:
        """
          testName: "Test1"
          run: Run - 1
          runident: Runident - 1
          checkName: Check - 1
          project: Project - 1
        """
        When I open the app
        When I click on the element "#dropdownProjects"
        When I click on the element "a[title='Project - 1']"
        When I wait for "3" seconds
        Then I expect that element "a[title='Project - 1']" has the class "active"
        When I go to "runs" page
        When I click on the element "[title='Run - 1']"
        When I wait and refresh page on element "span=Test1 - 1" for "3" seconds to exist
        When I click on "Test1 - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Test1 - 1" is unfolded
        Then I wait on element "[title='Check - 1']" to be displayed


        # 2nd project
        When I create "1" tests with params:
        """
          testName: "Test2"
          run: Run - 1
          checkName: Check - 2
          project: Project - 2
        """
        When I open the app
        When I click on the element "#dropdownProjects"
        When I click on the element "a[title='Project - 2']"
        When I wait for "3" seconds
        Then I expect that element "a[title='Project - 2']" has the class "active"
        When I go to "runs" page
        When I click on the element "[title='Run - 1']"
        When I wait and refresh page on element "span=Test2 - 1" for "3" seconds to exist
        Then I wait on element "span=Test1 - 1" to not be displayed

        When I click on "Test2 - 1" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Test2 - 1" is unfolded
        Then I wait on element "[title='Check - 2']" to be displayed

        # all projects
        When I open the app
        When I click on the element "#dropdownProjects"
        When I click on the element "a[title='All projects']"
        When I go to "runs" page
        When I wait for "3" seconds
        Then I wait on element "span=Test1 - 1" to be displayed
        Then I wait on element "span=Test2 - 1" to be displayed

        When I click on "Test1 - 1" VRS test
        When I wait for "2" seconds
        Then I wait on element "[title='Check - 1']" to be displayed

        When I click on "Test2 - 1" VRS test
        When I wait for "2" seconds
        Then I wait on element "[title='Check - 2']" to be displayed
