@integration
Feature: Create User

    Background:
        Given I clear Database and stop Server
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
        When I wait for "3" seconds
        Given I start Server and start Driver
        When I reload session
        When I login with user:"Test" password "123456aA-"
        When I wait 30 seconds for the element with locator "span*=TA" to be visible
        When I set window size: "1700x768"

    @smoke
    Scenario: Create User - Success
        When I go to "admin2" page
        When I wait for "3" seconds
        When I click element with locator "button[aria-label='Add New User']"
        When I fill "j_doe@gmail.com" into element with label "Email"
        When I wait on element "input[aria-label='First Name'][data-test='user-add-first-name']" to be enabled
        When I fill "John" into element with locator "input[aria-label='First Name'][data-test='user-add-first-name']"
        When I fill "Doe" into element with locator "input[aria-label='Last Name'][data-test='user-add-last-name']"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I fill "Password-123" into element with label "Password"
        When I scroll to element "button[aria-label='Create']"
        When I wait for "1" seconds
        When I click element with locator "button[aria-label='Create']"

        When I wait for "3" seconds
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" should have value "j_doe@gmail.com"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-first-name']" should have value "John"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-last-name']" should have value "Doe"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-role']" should have value "Reviewer"

        When I go to "logout" page
        When I wait for "3" seconds
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=JD" to be visible

    Scenario: Create User - User Already Exist
        When I go to "admin2" page
        When I wait for "3" seconds
        When I click element with locator "button[aria-label='Add New User']"
        When I fill "j_doe@gmail.com" into element with label "Email"
        When I wait on element "input[aria-label='First Name'][data-test='user-add-first-name']" to be enabled
        When I fill "John" into element with locator "input[aria-label='First Name'][data-test='user-add-first-name']"
        When I fill "Doe" into element with locator "input[aria-label='Last Name'][data-test='user-add-last-name']"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I fill "Password-123" into element with label "Password"
        When I scroll to element "button[aria-label='Create']"
        When I wait for "1" seconds
        When I click element with locator "button[aria-label='Create']"

        When I wait for "3" seconds
        Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" should have value "j_doe@gmail.com"

        When I click element with locator "button[aria-label='Add New User']"
        When I fill "j_doe@gmail.com" into element with label "Email"

        Then the element with locator "//input[@aria-label='Email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "user with this email already exists"

        When I scroll to element "button[aria-label='Create']"
        When I wait for "1" seconds
        When I click element with locator "button[aria-label='Create']"
        When I wait for "3" seconds
        Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times

    Scenario: Create User - Invalid fields
        When I go to "admin2" page
        When I wait for "3" seconds

        # invalid email - disabled fields
        When I click element with locator "button[aria-label='Add New User']"
        When I fill "j_doe@" into element with label "Email"
        Then the element with locator "//input[@aria-label='Email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

        Then the element with locator "input[aria-label='First Name'][data-test='user-add-first-name']" should have has attribute "disabled"
        Then the element with locator "input[aria-label='Last Name'][data-test='user-add-last-name']" should have has attribute "disabled"
        Then the element with locator "[data-test='user-add-role']" should be disabled

        When I scroll to element "button[aria-label='Create']"
        When I wait for "1" seconds
        When I click element with locator "button[aria-label='Create']"
        When I wait for "1" seconds
        Then the element with locator "//input[@aria-label='Email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

        # valid email - enabled fields
        When I refresh page
        When I wait for "3" seconds
        When I click element with locator "button[aria-label='Add New User']"
        When I fill "j_doe@xxx" into element with label "Email"
        And the element "//input[@aria-label='Email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" does not exist

        Then the element with locator "input[aria-label='First Name'][data-test='user-add-first-name']" should not have attribute "disabled"
        Then the element with locator "input[aria-label='Last Name'][data-test='user-add-last-name']" should not have attribute "disabled"
        Then the element with locator "[data-test='user-add-role']" should be enabled


