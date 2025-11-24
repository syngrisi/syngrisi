@fast-server
Feature: First run

    Background:
#         Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_DISABLE_FIRST_RUN: false
          SYNGRISI_AUTH: true
        """
#         Given I start Server and start Driver

    @smoke
    Scenario: Change Administrator password and login to system
        When I open the app
        Then the element with locator "#title" should have contains text "Change Password for default Administrator"
        When I set "Password-123" to the inputfield "#new-password"
        When I set "Password-123" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the current url contains "auth/changeSuccess"
        Then the element with locator "h1=Success!" should be visible

        # after Administrator password is set this operation should be Forbidden
        When I go to "first_run" page
        When I set "Password-123" to the inputfield "#new-password"
        When I set "Password-123" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the current url does not contain "auth/changeSuccess"
        Then the element with locator "#error-message" should have contains text "forbidden"

