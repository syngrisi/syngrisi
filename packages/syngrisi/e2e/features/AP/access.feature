Feature: Access to admin Panel

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver

    Scenario: Open Admin Panel as Anonymous User
        When I go to "admin2" page
        Then the current url contains "/auth"
        Then the title is "Login Page"

    Scenario: Open Admin Panel behalf of User role
        When I login with user:"testuser@test.com" password "Test-123"
        When I wait 30 seconds for the element with locator "span*=TU" to be visible
        When I go to "admin2" page
        Then the HTML contains:
        """
          Authorization Error - wrong Role
        """

    Scenario: Open Admin Panel behalf of Reviewer role
        When I login with user:"testreviewer@test.com" password "Test-123"
        When I wait 30 seconds for the element with locator "span*=TR" to be visible
        When I go to "admin2" page
        Then the HTML contains:
        """
          Authorization Error - wrong Role
        """

