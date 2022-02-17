Feature: Reset Password

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

    Scenario: Reset Password
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

        # change password
        When I go to "changepassword" page
        When I set "Password-123" to the inputfield "#old-password"
        When I set "Password-456" to the inputfield "#new-password"
        When I set "Password-456" to the inputfield "#new-password2"
        When I click on the element "#submit"

        When I wait for "3" seconds

        # login with new password
        When I login with user:"j_doe@gmail.com" password "Password-456"
        Then I wait on element "*=JD" to be displayed

