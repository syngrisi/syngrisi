@fast-server
Feature: Change Password

    Background:
        When I set window size: "1050x768"
#         Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
        """
        Given I start Server
        When I create via http test user
        Given I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: true
        """
#         Given I start Server and start Driver

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
#         Given I start Server and start Driver
        When I open the app
        # TODO: should be deleted - for tests isolation
        When I delete the cookie "connect.sid"


    @smoke
    Scenario: Change Password - Smoke
        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait 10 seconds for the element with locator "span*=JD" to be visible
        # change password
        When I go to "change_password" page
        When I set "Password-123" to the inputfield "#current-password"
        When I set "Password-456" to the inputfield "#new-password"
        When I set "Password-456" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the current url contains "auth/changeSuccess"
        Then the element with locator "h1=Success!" should be visible

        # login with new password
        When I go to "logout" page
        When I login with user:"j_doe@gmail.com" password "Password-456"
        When I wait 10 seconds for the element with locator "span*=JD" to be visible

    Scenario: Change Password - User not Logged In
        When I go to "change_password" page
        When I set "Password-123" to the inputfield "#current-password"
        When I set "Password-456" to the inputfield "#new-password"
        When I set "Password-456" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the element with locator "#error-message" should have contains text "user is not logged in"


    Scenario: Change Password - Wrong Current Password
        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait 10 seconds for the element with locator "span*=JD" to be visible

        When I go to "change_password" page
        When I set "WRONGpass-123" to the inputfield "#current-password"
        When I set "Password-456" to the inputfield "#new-password"
        When I set "Password-456" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the current url does not contain "auth/changeSuccess"
        Then the element with locator "#error-message" should have contains text "IncorrectPasswordError: Password or username is incorrect"

    Scenario: Change Password - Validation
        # login
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait 10 seconds for the element with locator "span*=JD" to be visible

        When I go to "change_password" page
        Then the element with locator "#current-password" should have has attribute "required"
        Then the element with locator "#new-password" should have has attribute "required"
        Then the element with locator "#new-password-confirmation" should have has attribute "required"

        Then the css attribute "color" from element "#include-six-chars" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(250,82,82,1)"

        When I set "1" to the inputfield "#new-password"
        Then the css attribute "color" from element "#include-six-chars" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(250,82,82,1)"

        When I set "123456" to the inputfield "#new-password"
        Then the css attribute "color" from element "#include-six-chars" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(250,82,82,1)"

        When I set "123456a" to the inputfield "#new-password"
        Then the css attribute "color" from element "#include-six-chars" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(250,82,82,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(250,82,82,1)"

        When I set "123456aA" to the inputfield "#new-password"
        Then the css attribute "color" from element "#include-six-chars" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(250,82,82,1)"

        When I set "123456aA-" to the inputfield "#new-password"
        Then the css attribute "color" from element "#include-six-chars" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-numbers" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-lowercase" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-uppercase" is "rgba(18,184,134,1)"
        Then the css attribute "color" from element "#include-special" is "rgba(18,184,134,1)"

        When I set "123" to the inputfield "#current-password"
        When I set "123" to the inputfield "#new-password-confirmation"
        When I click element with locator "#change-password"
        Then the element with locator "//*[@id='new-password-confirmation']/../../following-sibling::*" should have contains text "New password and password confirmation must be match"




