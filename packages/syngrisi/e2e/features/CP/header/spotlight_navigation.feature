Feature: Spotlight

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage
        When I go to "main" page

    Scenario: Spotlight Appear
        # using keystrokes
        Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed
        And I hold key "Control"
        And I press "k"
        Then I wait on element ".mantine-Spotlight-spotlight" to be displayed

        When I release key "Control"
        And I press "Escape"
        Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed

        # using mouse clicks
        When I click element with locator "[data-test='spotlight-button']"
        Then I wait on element ".mantine-Spotlight-spotlight" to be displayed

        When I click on the element "[data-test='logo-text']" via js
        Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed

    Scenario Outline:  Spotlight Navigation - <keyword>
        When I click element with locator "[data-test='spotlight-button']"
        Then I wait on element ".mantine-Spotlight-spotlight" to be displayed

        When I set "<keyword>" to the inputfield ".mantine-Spotlight-searchInput"
        And I press "Enter"
        When I wait for "2" seconds
        Then the current url contains "<url>"
        And the title contains "<title>"
        And I wait on element ".mantine-Spotlight-spotlight" to not be displayed

        Examples:
            | keyword | title    | url            |
            | Results | By Runs  | /              |
            | Suite   | By Suite | groupBy=suites |
            | Admin   | Users    | /admin         |
            | Logs    | Logs     | /admin/logs    |

    Scenario: Spotlight - switch theme
        # logo label
        Then the css attribute "color" from element "[data-test='logo-text']" is "rgba(38,38,38,1)"
        # logo container
        Then the css attribute "color" from element "[data-test='logo-container']" is "rgba(0,0,0,1)"

        When I click element with locator "[data-test='spotlight-button']"
        Then I wait on element ".mantine-Spotlight-spotlight" to be displayed

        # switch theme
        When I set "theme" to the inputfield ".mantine-Spotlight-searchInput"
        And I press "Enter"
        When I wait for "2" seconds

        # logo label
        Then the css attribute "color" from element "[data-test='logo-text']" is "rgba(255,255,255,1)"
        # logo container
        Then the css attribute "color" from element "[data-test='logo-container']" is "rgba(193,194,197,1)"


