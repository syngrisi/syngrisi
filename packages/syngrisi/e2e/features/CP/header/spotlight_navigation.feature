@fast-server
Feature: Spotlight

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage
    When I go to "main" page

  @smoke
  Scenario: Spotlight Appear
    # using keystrokes
    Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed
    And I hold key "Control"
    And I press "k"
    When I wait 10 seconds for the element with locator ".mantine-Spotlight-spotlight" to be visible

    When I release key "Control"
    And I press "Escape"
    Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed

    # using mouse clicks
    When I click element with locator "button[aria-label='Search']"
    When I wait 10 seconds for the element with locator ".mantine-Spotlight-spotlight" to be visible

    When I click on the element "[aria-label='Syngrisi']" via js
    Then I wait on element ".mantine-Spotlight-spotlight" to not be displayed

  Scenario Outline:  Spotlight Navigation - <keyword>
    When I click element with locator "button[aria-label='Search']"
    When I wait 10 seconds for the element with locator ".mantine-Spotlight-spotlight" to be visible

    When I set "<keyword>" to the inputfield ".mantine-Spotlight-searchInput"
    And I press "Enter"

    And I wait on element ".mantine-Spotlight-spotlight" to not be displayed
    Then the current url contains "<url>"
    And the title contains "<title>"

    Examples:
      | keyword | title    | url            |
      | Results | By Runs  | /              |
      | Suite   | By Suite | groupBy=suites |
      | Admin   | Users    | /admin         |
      | Logs    | Logs     | /admin/logs    |

  Scenario: Spotlight - switch theme
    # logo label
    Then the css attribute "color" from element "[aria-label='Syngrisi']" is "rgba(38,38,38,1)"
    # logo container
    Then the css attribute "color" from element "[aria-label='Logo container']" is "rgba(0,0,0,1)"

    When I click element with locator "button[aria-label='Search']"
    When I wait 10 seconds for the element with locator ".mantine-Spotlight-spotlight" to be visible

    # switch theme
    When I set "theme" to the inputfield ".mantine-Spotlight-searchInput"
    And I press "Enter"


    # logo label
    Then the css attribute "color" from element "[aria-label='Syngrisi']" is "rgba(255,255,255,1)"
    # logo container
    Then the css attribute "color" from element "[aria-label='Logo container']" is "rgba(193,194,197,1)"
