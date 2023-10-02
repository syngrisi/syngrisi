@smoke
Feature: Navbar Refresh

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Navbar Refresh
        When I create "1" tests with:
        """
          runName: RunName-1
          testName: TestName-1
          checks:
             - checkName: Check-1
        """

        When I go to "main" page
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be displayed

        When I create "1" tests with:
        """
          runName: RunName-2
          testName: TestName-2
          checks:
             - checkName: Check-1
        """

        When I wait for "5" seconds
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]" to not be displayed

        When I click on the element "[data-test='navbar-icon-refresh']"
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]" to be displayed


