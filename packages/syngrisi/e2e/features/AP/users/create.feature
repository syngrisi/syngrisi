@integration @fast-server
Feature: Create User

  Background:
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
    SYNGRISI_TEST_MODE: false
    SYNGRISI_AUTH: true
      """
    #         Given I start Server and start Driver
    When I reload session
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I set window size: "1700x768"

  @smoke
  Scenario: Create User - Success
    When I go to "admin2" page
    When I click element with locator "button[aria-label='Add User']"
    When I fill "j_doe@gmail.com" into element with label "Username"
    When I wait on element "input[aria-label='First name'][data-test='users-form-first-name']" to be enabled
    When I fill "John" into element with locator "input[aria-label='First name'][data-test='users-form-first-name']"
    When I fill "Doe" into element with locator "input[aria-label='Last name'][data-test='users-form-last-name']"
    When I select the option with the text "Reviewer" for element "[data-test='users-form-role']"
    When I fill "Password-123" into element with label "Password"
    When I scroll to element "button[aria-label='Save']"
    When I click element with locator "button[aria-label='Save']"

    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-username']" matches the text "j_doe@gmail.com"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-first-name']" matches the text "John"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-last-name']" matches the text "Doe"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-role']" matches the text "REVIEWER"

    When I go to "logout" page
    When I login with user:"j_doe@gmail.com" password "Password-123"
    When I wait 10 seconds for the element with locator "span*=JD" to be visible

  Scenario: Create User - User Already Exist
    When I go to "admin2" page
    When I click element with locator "button[aria-label='Add User']"
    When I fill "j_doe@gmail.com" into element with label "Username"
    When I wait on element "input[aria-label='First name'][data-test='users-form-first-name']" to be enabled
    When I fill "John" into element with locator "input[aria-label='First name'][data-test='users-form-first-name']"
    When I fill "Doe" into element with locator "input[aria-label='Last name'][data-test='users-form-last-name']"
    When I select the option with the text "Reviewer" for element "[data-test='users-form-role']"
    When I fill "Password-123" into element with label "Password"
    When I scroll to element "button[aria-label='Save']"
    When I click element with locator "button[aria-label='Save']"

    Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-username']" matches the text "j_doe@gmail.com"

    When I click element with locator "button[aria-label='Add User']"
    When I fill "j_doe@gmail.com" into element with label "Username"

    Then the element with locator "//input[@aria-label='Username']/../../*[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "user with this email already exists"

    When I scroll to element "button[aria-label='Save']"
    When I click element with locator "button[aria-label='Save']"
    Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times

  Scenario: Create User - Invalid fields
    When I go to "admin2" page

    # invalid email - disabled fields
    When I click element with locator "button[aria-label='Add User']"
    When I fill "j_doe@" into element with label "Username"
    Then the element with locator "//input[@aria-label='Username']/../../*[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

    Then the element with locator "input[aria-label='First name'][data-test='users-form-first-name']" should have has attribute "disabled"
    Then the element with locator "input[aria-label='Last name'][data-test='users-form-last-name']" should have has attribute "disabled"
    Then the element with locator "[data-test='users-form-role']" should be disabled

    When I scroll to element "button[aria-label='Save']"
    When I click element with locator "button[aria-label='Save']"
    Then the element with locator "//input[@aria-label='Username']/../../*[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

    # valid email - enabled fields
    When I refresh page
    When I click element with locator "button[aria-label='Add User']"
    When I fill "j_doe@xxx" into element with label "Username"
    And the element "//input[@aria-label='Username']/../../*[contains(@class, 'mantine-InputWrapper-error')]" does not exist

    Then the element with locator "input[aria-label='First name'][data-test='users-form-first-name']" should not have attribute "disabled"
    Then the element with locator "input[aria-label='Last name'][data-test='users-form-last-name']" should not have attribute "disabled"
    Then the element with locator "[data-test='users-form-role']" should be enabled
