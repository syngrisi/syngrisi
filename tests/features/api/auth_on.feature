@smoke
Feature: Authentication on

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
        When I generate via http API key for the User
        When I set the API key in config

    Scenario: Api Key - Missing apikey
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 401
        json:
          error: 'API key missing'
        """

    Scenario: Api Key - Wrong apikey
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key?apikey=2af0bb63e243c8a7282102664805258295a1fb7f0836ac0ab4ba48bfea3a93cb5e7a4ea057a85663fe67610aa046a8496722b0e6c55fb7bb4bf878855e010513" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 401
        json:
          error: 'wrong API key'
        """

    Scenario: Api Key - Proper apikey
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key?apikey=<hashedApiKey>" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 200
        json:
          alive: true
          currentUser: Test
        """

    # redirect to login page
    Scenario: Log In - Unauthorized
        When I open the url "http://<serverDomain>:<serverPort>/status_with_logged_in"
        When I wait for "2" seconds
        When the current url contains "login?origin"
        When I expect that element "button*=Login" is displayed

    Scenario: Log In - Authorized
        When I login with user:"Test" password "123"
        When I open the url "http://<serverDomain>:<serverPort>/status_with_logged_in"
        When I wait for "2" seconds
        Then I expect HTML contains:
        """
        "alive":true
        """
        Then I expect HTML contains:
        """
        "currentUser":"Test"
        """

    Scenario: Basic or Api Key - Unauthorized
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key_or_logged_in?apikey=123" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 401
        json:
          error: 'Unauthorized - /status_with_api_key_or_logged_in?apikey=123'
        """

        When I open the url "http://<serverDomain>:<serverPort>/status_with_api_key_or_logged_in"
        When I wait for "2" seconds
        Then I expect HTML contains:
        """
        Unauthorized - /status_with_api_key_or_logged_in
        """

    Scenario: Basic or Api Key - Proper Api Key
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key_or_logged_in?apikey=<hashedApiKey>" with:
        """
        """
        When I wait for "2" seconds
        When I expect the "get" response with:
        """
        statusCode: 200
        json:
          alive: true
          currentUser: Test
        """

    Scenario: Basic or Api Key - Success Login
        When I login with user:"Test" password "123"
        When I open the url "http://<serverDomain>:<serverPort>/status_with_api_key_or_logged_in"
        When I wait for "2" seconds
        Then I expect HTML contains:
        """
        "alive":true
        """
        Then I expect HTML contains:
        """
        "currentUser":"Test"
        """
