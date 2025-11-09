Feature: First run

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: false
          SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I wait for "3" seconds

    @smoke
    Scenario: Change Administrator password and login to system
        When I open the app
        Then I expect that element "#title" contain text "Change Password for default Administrator"
        When I set "Password-123" to the inputfield "#new-password"
        When I set "Password-123" to the inputfield "#new-password-confirmation"
        When I click on the element "#change-password"
        When I wait for "2" seconds
        Then I expect the url to contain "auth/changeSuccess"
        Then I expect that element "h1=Success!" is displayed

        # after Administrator password is set this operation should be Forbidden
        When I go to "first_run" page
        When I set "Password-123" to the inputfield "#new-password"
        When I set "Password-123" to the inputfield "#new-password-confirmation"
        When I click on the element "#change-password"
        When I wait for "2" seconds
        Then I expect the url to not contain "auth/changeSuccess"
        Then I expect that element "#error-message" contain text "forbidden"


