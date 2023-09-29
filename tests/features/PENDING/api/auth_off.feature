@smoke
Feature: Authentication Off

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Api Key - Missing apikey
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 200
        json:
          alive: true
        """

    Scenario: Api Key - Random apikey
        When I send "get" request to "http://<serverDomain>:<serverPort>/status_with_api_key?apikey=2af0bb63e243c8a7282102664805258295a1fb7f0836ac0ab4ba48bfea3a93cb5e7a4ea057a85663fe67610aa046a8496722b0e6c55fb7bb4bf878855e010513" with:
        """
        """
        When I expect the "get" response with:
        """
        statusCode: 200
        json:
          alive: true
        """

    Scenario: Log In - Open Page without Log In
        When I open the url "http://<serverDomain>:<serverPort>/status_with_logged_in"
        When I wait for "2" seconds
        Then I expect HTML contains:
        """
        "alive":true
        """
        Then I expect HTML contains:
        """
        "currentUser":"Guest"
        """
