Feature: Login

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
        When I reload session

    Scenario: Login - default Test user
        When I login with user:"Test" password "123"
        Then I wait on element "span*=TA" to be displayed

    @smoke
    Scenario: Login - Create user and login
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
        SYNGRISI_TEST_MODE: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        Then I wait on element "span*=JD" to be displayed

    @smoke
    Scenario: Login - Wrong password
        When I login with user:"Test" password "567"
        When I wait for "1" seconds
        Then I expect that element "#error-message" contain text "Authentication error: 'Password or username is incorrect'"

    Scenario: Login - Empty credentials
        When I login with user:"" password ""
        When I wait for "1" seconds
        # we cannot check native HTML required behavior then check only indirect signs
        Then I expect that the element "#email" to have attribute "required"
        Then I expect that the element "#password" to have attribute "required"
        Then the current url contains "/auth"
        Then the element "#email" is displayed
        Then the element "#password" is displayed

    Scenario: Login - Invalid email
        When I login with user:"asd" password "1"
        When I wait for "1" seconds
        Then the element ".mantine-Input-wrapper + div.mantine-InputWrapper-error" contains the text "Invalid email"

    Scenario: Redirect via origin url
        When I open the url "<syngrisiUrl>?groupBy=test-distinct%2FbrowserName"
        When I wait for "1" seconds
        Then the current url contains "?origin=%2F%3FgroupBy%3Dtest-distinct%252FbrowserName"
        When I set "Test" to the inputfield "#email"
        When I set "123" to the inputfield "#password"
        When I click on the element "#submit"
        When I wait for "1" seconds
        Then the current url contains "<syngrisiUrl>?groupBy=test-distinct%2FbrowserName"
