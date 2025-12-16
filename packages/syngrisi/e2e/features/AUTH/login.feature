Feature: Login

    Background:
        Given I clear Database and stop Server

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

        Given I start Server and start Driver
        When I reload session

    @smoke
    Scenario: Login - Create user and login
        # crate user
        When I login via http with user:"Test" password "123456aA-"
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
        SYNGRISI_TEST_MODE: false
        SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver

        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=JD" to be visible

    @smoke
    Scenario: Login - Wrong password
        When I login with user:"Test" password "Password-567"
        When I wait for "1" seconds
        Then the element with locator "#error-message" should have contains text "Authentication error: 'Password or username is incorrect'"

    Scenario: Login - Empty credentials
        When I login with user:"" password ""
        When I wait for "1" seconds
        # we cannot check native HTML required behavior then check only indirect signs
        Then the element with locator "#email" should have has attribute "required"
        Then the element with locator "#password" should have has attribute "required"
        Then the current url contains "/auth"
        Then the element with locator "#email" should be visible
        Then the element with locator "#password" should be visible

    Scenario: Login - Invalid email
        When I login with user:"asd" password "PasswordInvEmail-567"
        When I wait for "1" seconds
        Then the element with locator ".mantine-Input-wrapper + div.mantine-InputWrapper-error" should have contains text "Invalid email"

    Scenario: Redirect via origin url
        When I open the url "<syngrisiUrl>?groupBy=test-distinct%2FbrowserName"
        When I wait for "1" seconds
        Then the current url contains "?origin=%2F%3FgroupBy%3Dtest-distinct%252FbrowserName"
        When I set "Test" to the inputfield "#email"
        When I set "123456aA-" to the inputfield "#password"
        When I click element with locator "#submit"
        When I wait for "1" seconds
        Then the current url contains "<syngrisiUrl>?groupBy=test-distinct%2FbrowserName"


