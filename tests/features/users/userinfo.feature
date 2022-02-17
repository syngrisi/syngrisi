Feature: Userinfo

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

    Scenario: Userinfo - Logged User
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        When I wait for "5" seconds
        When I open the url "http://<serverDomain>:<serverPort>/userinfo"
        When I wait for "1" seconds
        Then page source match:
        """
        {
            "username": "Test",
            "role": "admin",
            "firstName": "Test",
            "lastName": "Admin"
        }
        """
        When I stop the Syngrisi server
