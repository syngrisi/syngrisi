Feature: First run

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver
        When I wait for "3" seconds

    Scenario: Change Administrator password and login to system
        When I open the app
        When I set "Password-123" to the inputfield "#new-password"
        When I set "Password-123" to the inputfield "#new-password2"
        When I click on the element "#submit"

        When I set "Administrator" to the inputfield "#email"
        When I set "Password-123" to the inputfield "#password"
        When I click on the element "#submit"
        Then I wait on element "*=SA" to be displayed

        # after Administrator password is set this operation should be Forbidden
        When I open the url "<syngrisiUrl>first_run_password?admin=true"
        Then I expect HTML contains:
        """
        Forbidden
        """

        # logout and try 'first run' again
        When I open the url "<syngrisiUrl>logout"
        Then the current url contains "login"
        When I open the url "<syngrisiUrl>first_run_password?admin=true"
        Then I expect HTML contains:
        """
        Forbidden
        """
