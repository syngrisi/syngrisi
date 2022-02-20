@integration
Feature: Delete User

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

    Scenario: Delete User - Success
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

        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        When I go to "admin>users" page
        When I wait for "2" seconds
        When I click on the element "//input[@value='j_doe@gmail.com']/../..//a[@title='Remove the User']"
        When I accept the confirmbox
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Doe']" is not displayed
        When I refresh page
        Then I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Doe']" is not displayed
