@integration
Feature: Update User

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        When I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    Scenario: Update User - Success
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

        When I go to "admin>users" page
        When I set "John_1" to the inputfield "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName']"

        When I set "Doe_1" to the inputfield "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='lastName']"
        When I select the option with the text "admin" for element "//input[@name='username' and @value='j_doe@gmail.com']/../..//select[@name='role']"
        When I set "Password-1234" to the inputfield "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='password']"
        When I wait for "1" seconds
        When I click on the element "a[update-button-username='j_doe@gmail.com']"
        When I wait for "1" seconds
        When I accept the confirmbox
        When I wait for "5" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John_1']/../..//input[@name='lastName' and @value='Doe_1']" is displayed
        When I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John_1']/../..//input[@name='lastName' and @value='Doe_1']/../..//select[@name='role']" contain value "admin"
