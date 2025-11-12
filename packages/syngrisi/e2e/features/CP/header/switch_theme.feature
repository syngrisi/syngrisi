@smoke
Feature: Switch Color Theme

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Switch Color Theme
        When I create "1" tests with:
        """
          runName: RunName-1
          testName: TestName-1
          checks:
             - checkName: Check-1
        """

        When I go to "main" page
        When I wait for "3" seconds

        # logo label
        Then the css attribute "color" from element "[data-test='logo-text']" is "rgba(38,38,38,1)"
        # logo container
        Then the css attribute "color" from element "[data-test='logo-container']" is "rgba(0,0,0,1)"

        # switch theme
        When I click element with locator "[data-test='user-icon']"
        When I wait 30 seconds for the element with locator "//*[@data-test='theme-button']/.." to be visible
        When I click element with locator "//*[@data-test='theme-button']/.."
        When I wait for "3" seconds

        # logo label
        Then the css attribute "color" from element "[data-test='logo-text']" is "rgba(255,255,255,1)"
        # logo container
        Then the css attribute "color" from element "[data-test='logo-container']" is "rgba(193,194,197,1)"


