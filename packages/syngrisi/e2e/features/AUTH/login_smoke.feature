@fast-server
Feature: Login - Smoke

    Background:
#         Given I clear Database and stop Server

        When I set env variables:
        """
         SYNGRISI_TEST_MODE: "true"
         SYNGRISI_AUTH: "false"
        """
        Given I start Server
        When I create via http test user
        When I stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: "false"
          SYNGRISI_AUTH: "true"
        """

#         Given I start Server and start Driver
        When I reload session

    Scenario: Login - default Test user
        When I login with user:"Test" password "123456aA-"
        When I wait 30 seconds for the element with locator "span*=TA" to be visible

