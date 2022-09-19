Feature: Access to admin Panel

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 1
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

    Scenario: Open Admin Panel as Anonymous User
        When I go to "admin2" page
        Then I expect the url to contain "/auth"
        Then I expect that the title is "Login Page"

    Scenario: Open Admin Panel behalf of User role
        When I login with user:"testuser@test.com" password "Test-123"
        Then I wait on element "*=TU" to be displayed
        When I go to "admin2" page
        When I wait for "1" seconds
        Then I expect HTML contains:
        """
          Authorization Error - wrong Role
        """

    Scenario: Open Admin Panel behalf of Reviewer role
        When I login with user:"testreviewer@test.com" password "Test-123"
        Then I wait on element "*=TR" to be displayed
        When I go to "admin2" page
        When I wait for "1" seconds
        Then I expect HTML contains:
        """
          Authorization Error - wrong Role
        """
