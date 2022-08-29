@integration
Feature: Delete User

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
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed
        When I login via http with user:"Test" password "123"
        When I create via http user as:"Test" with params:
        """
        {
            "username": "j_doe@gmail.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "password": "Password-123"
        }
        """

    @smoke
    Scenario: Delete User - Success
        When I open the app
        When I go to "admin2" page
        And I expect that element "//*[@data-test='j_doe@gmail.com']" does exist
        When I click on the element "//*[@data-test='j_doe@gmail.com']//button[@data-test='user-list-remove-button']"
        When I click on the element "//*[@data-test='j_doe@gmail.com']//button[@data-test='user-list-remove-button-confirm']"
        When I wait for "2" seconds

        And I expect that element "//*[@data-test='j_doe@gmail.com']" does not exist

