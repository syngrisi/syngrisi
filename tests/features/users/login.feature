Feature: Login

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
         TEST: 1
         SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        When I stop Server
        When I set env variables:
        """
          TEST: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

    Scenario: Login - default Test user
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    Scenario: Login - Create user and login
        # crate user
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
        # prepare servers
        Given I stop Server

        When I set env variables:
        """
        TEST: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

    Scenario: Login - Wrong password
        When I login with user:"Test" password "567"
        When I wait for "1" seconds
        Then I expect that element "#error-message" contain text "Password or username is incorrect"

    Scenario: Login - Empty credentials
        When I login with user:"" password ""
        When I wait for "1" seconds
        Then I expect that element "#error-message" contain text "Missing credentials"
