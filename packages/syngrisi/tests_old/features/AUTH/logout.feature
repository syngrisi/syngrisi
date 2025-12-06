Feature: Logout

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
        """
        Given I start Server
        When I create via http test user
        When I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: false
        SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver

    Scenario: Logout - default Test user
        When I login with user:"Test" password "123456aA-"
        Then I wait on element "span*=TA" to be displayed
        When I wait for "2" seconds

        When I go to "logout" page

        When I wait for "2" seconds
        When I go to "main" page
        When I wait for "1" seconds
        When I expect the url to contain "/auth"
        Then the title is "Login Page"

