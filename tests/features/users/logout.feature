Feature: Logout

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        When I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

    Scenario: Logout - default Test user
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed
        When I wait for "2" seconds

        When I go to "logout" page

        When I wait for "2" seconds
        When I go to "main" page
        When I wait for "1" seconds
        When I expect the url to contain "/login"
        Then the title is "Login Page"

