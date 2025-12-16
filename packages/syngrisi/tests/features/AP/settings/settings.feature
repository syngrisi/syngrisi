Feature: Admin Settings

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Change Admin Settings - Enable Auth
        When I go to "settings" page
        When I wait on element "[data-test='settings_value_authentication']" to be displayed
        Then I expect that element "select[data-test='settings_value_authentication']" contain value "false"
        When I select the option with the text "true" for element "select[data-test='settings_value_authentication']"
        Then I expect that element "select[data-test='settings_value_authentication']" contain value "true"
        When I click on the element "[data-test='settings_update_button_authentication']"
        Then I wait on element "//div[contains(@class, 'mantine-Notification-title') and text()='Success']" to be displayed

        When I go to "logout" page
        When I wait for "3" seconds
        When I wait on element "h1=Success!" to be displayed
        When I open the app
        Then I expect the url to contain "/auth"
        Then I expect that the title is "Login Page"

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
        Then I expect the url to contain "auth/change?first_run=true"
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
        When I wait on element "[data-test='settings_value_first_run']" to be displayed

        Then I expect that element "select[data-test='settings_value_first_run']" contain value "true"
        When I select the option with the text "false" for element "select[data-test='settings_value_first_run']"
        When I wait for "2" seconds
        Then I expect that element "select[data-test='settings_value_first_run']" contain value "false"
        When I click on the element "[data-test='settings_update_button_first_run']"
        Then I wait on element "//div[contains(@class, 'mantine-Notification-title') and text()='Success']" to be displayed
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
        Then I expect the url to not contain "auth/change?first_run=true"
        Then I expect the url to contain "/auth"
