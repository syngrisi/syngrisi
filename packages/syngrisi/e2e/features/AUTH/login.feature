@fast-server
Feature: Login

  Background:

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

    #         Given I start Server and start Driver
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
    #         Given I start Server and start Driver

    # login
    When I login with user:"j_doe@gmail.com" password "Password-123"
    When I wait 10 seconds for the element with locator "span*=JD" to be visible

  @smoke
  Scenario: Login - Wrong password
    When I login with user:"Test" password "Password-567"
    Then the element with locator "#error-message" should have contains text "Authentication error: 'Password or username is incorrect'"

  Scenario: Login - Empty credentials
    When I login with user:"" password ""
    # we cannot check native HTML required behavior then check only indirect signs
    Then the element with locator "#email" should have has attribute "required"
    Then the element with locator "#password" should have has attribute "required"
    Then the current url contains "/auth"
    Then the element with locator "#email" should be visible
    Then the element with locator "#password" should be visible

  Scenario: Login - Invalid email
    When I login with user:"asd" password "PasswordInvEmail-567"
    Then the element with locator ".mantine-Input-wrapper + div.mantine-InputWrapper-error" should have contains text "Invalid email"

  @flaky
  Scenario: Redirect via origin url
    # Ensure server is running with auth enabled
    Given I start Server
    # Clear session after server is ready to ensure clean auth state
    When I reload session
    When I open the url "/?groupBy=test-distinct%2FbrowserName"
    Then the current url contains "/auth"
    When I set "Test" to the inputfield "#email"
    When I set "123456aA-" to the inputfield "#password"
    When I click element with locator "#submit"
    # Wait for redirect after login - check that we're no longer on /auth page
    When I wait 10 seconds for the element with locator "[data-test='user-icon']" to be visible
    Then the current url contains "groupBy=test-distinct"

  @smoke
  Scenario: Login - default Test user
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible

