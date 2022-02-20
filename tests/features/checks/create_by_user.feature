@integration
Feature: Creation by User

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server

        When I create via http test user
        Given I stop Server

        When I set env variables:
        """
          TEST: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver
        When I wait for "5" seconds

    Scenario: Create as User
        # login as test admin
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        # create user
        When I go to "admin>users" page
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "j_doe@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "John" to the inputfield "//input[@placeholder='First Name']"
        When I set "Doe" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "user" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"
        When I wait for "3" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Doe']" is displayed

        When I go to "logout" page
        When I wait for "1" seconds

        # login by user
        When I login with user:"j_doe@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key

        # create check
        When I set the API key in config
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Create by User
        """

        # the check validation as new user
        When I go to "main" page
        When I wait for "2" seconds
        Then I expect that VRS test "Create by User - 1" has "New" status
        When I click on "Create by User - 1" VRS test

        Then I expect that VRS test "Create by User - 1" is unfolded
        Then I expect that "1" check preview tooltip "created by" field equal to "j_doe@gmail.com"

        # the check validation as test admin
        When I go to "logout" page
        When I wait for "2" seconds

        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        Then I expect that VRS test "Create by User - 1" has "New" status
        When I click on "Create by User - 1" VRS test

        Then I expect that VRS test "Create by User - 1" is unfolded
        Then I expect that "1" check preview tooltip "created by" field equal to "j_doe@gmail.com"

