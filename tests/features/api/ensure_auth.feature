Feature: Ensure Authentication

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # create user
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
        When I login via http with user:"j_doe@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config

#    !!!!!!!!!!!!!!!!!!!
    @Pending
    Scenario: Ensure Api Key

        When I create "1" tests with params:
        """
          testName: Test
          checkName: Check - 1
        """
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 401
        json:
          error: 'API key missing'
        """


    Scenario: Ensure Log In Key

    Scenario: Ensure Api Key or Log In

