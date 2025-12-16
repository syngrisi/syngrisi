Feature: Admin Settings

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Change Admin Settings - Enable Auth
        When I go to "settings" page
        When I wait 30 seconds for the element with label "Authentication" to be visible
        Then the element with label "Authentication" should have value "false"
        When I select the option with the text "true" for element "select[data-test='settings_value_authentication']"
        When I wait for "1" seconds
        Then the element with label "Authentication" should have value "true"
        When I click element with locator "button[aria-label='Update Authentication']"
        When I wait 30 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible

        When I go to "logout" page
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "h1=Success!" to be visible
        When I open the app
        Then the current url contains "/auth"
        Then the title is "Login Page"

    Scenario: Change Admin Settings - First Run
        # check if first_run is enabled by default
        Given I stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: false
          SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I open the app
        Then the current url contains "auth/change?first_run=true"
        Then I wait on element "//h3[contains(text(), 'Change Password for default Administrator')]"

        # set first_run to false check if applied
        Given I stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: true
          SYNGRISI_AUTH: false
        """
        Given I start Server and start Driver
        When I go to "settings" page
        When I wait 30 seconds for the element with label "First Run" to be visible

        Then the element with label "First Run" should have value "true"
        When I select the option with the text "false" for element "select[data-test='settings_value_first_run']"
        When I wait for "1" seconds
        Then the element with label "First Run" should have value "false"
        When I click element with locator "button[aria-label='Update First Run']"
        When I wait 30 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
        When I wait for "5" seconds
        When I go to "logout" page
        When I wait for "5" seconds

        Given I stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: false
          SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I open the app
        Then the current url does not contain "auth/change?first_run=true"
        Then the current url contains "/auth"

    Scenario: Configure auto remove old checks setting
        When I go to "settings" page
        When I wait 30 seconds for the element with label "Days to keep checks" to be visible
        Then the element with label "Days to keep checks" should have value "365"
        When I fill "30" into element with label "Days to keep checks"
        When I click element with label "Enable Auto remove old checks"
        When I click element with locator "button[aria-label='Update Auto remove old checks']"
        When I wait 30 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible

    Scenario: Configure auto remove old logs setting
        When I go to "settings" page
        When I wait 30 seconds for the element with label "Days to keep logs" to be visible
        Then the element with label "Days to keep logs" should have value "120"
        When I fill "45" into element with label "Days to keep logs"
        When I click element with locator "button[aria-label='Update Auto remove old logs']"
        When I wait 30 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
