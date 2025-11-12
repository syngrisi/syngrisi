Feature: User Information

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
        """
        Given I start Server
        When I create via http test user
        Given I stop the Syngrisi server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: false
          SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I login via http with user:"Test" password "123456aA-"

        When I create via http user as:"Test" with params:
        """
        {
            "username": "user@gmail.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "password": "Password-123"
        }
        """

    @smoke
    Scenario: Check User Menu Information
        When I login with user:"user@gmail.com" password "Password-123"
        When I wait for "3" seconds
        When I go to "main" page
        When I wait for "3" seconds
        Then I expect that element "[data-test='user-icon']" contain text "JD"
        When I click element with locator "[data-test='user-icon']"
        When I wait for "3" seconds
        Then I expect that element "[data-test='user-short-details']" contain text "John Doe"
        When I click element with locator "[data-test='userinfo']"

        Then I expect that element "[data-test=userinfo-username]" to contain text "user@gmail.com"
        Then I expect that element "[data-test=userinfo-role]" to contain text "user"
        Then I expect that element "[data-test=userinfo-name]" to contain text "John Doe"


