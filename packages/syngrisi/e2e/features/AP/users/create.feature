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
        When I click element with locator "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"
        When I wait on element "[data-test=user-add-first-name]" to be enabled
        When I set "John" to the inputfield "[data-test=user-add-first-name]"
        When I set "Doe" to the inputfield "[data-test=user-add-last-name]"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I set "Password-123" to the inputfield "[data-test=user-add-password]"
        When I scroll to element "#create"
        When I wait for "1" seconds
        When I click element with locator "#create"

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
        When I click element with locator "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"
        When I wait on element "[data-test=user-add-first-name]" to be enabled
        When I set "John" to the inputfield "[data-test=user-add-first-name]"
        When I set "Doe" to the inputfield "[data-test=user-add-last-name]"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I set "Password-123" to the inputfield "[data-test=user-add-password]"
        When I scroll to element "#create"
        When I wait for "1" seconds
        When I click element with locator "#create"

        When I wait for "3" seconds
        Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" should have value "j_doe@gmail.com"

        When I click element with locator "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"

        Then the element with locator "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "user with this email already exists"

        When I scroll to element "#create"
        When I wait for "1" seconds
        When I click element with locator "#create"
        When I wait for "3" seconds
        Then the element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times

    Scenario: Create User - Invalid fields
        When I go to "admin2" page
        When I wait for "3" seconds

        # invalid email - disabled fields
        When I click element with locator "#add-new-user"
        When I set "j_doe@" to the inputfield "[data-test=user-add-email]"
        Then the element with locator "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

        Then the element with locator "//input[@data-test='user-add-first-name']" should have has attribute "disabled"
        Then the element with locator "//input[@data-test='user-add-last-name']" should have has attribute "disabled"
        Then the element with locator "//input[@data-test='user-add-role']" should have has attribute "disabled"

        When I scroll to element "#create"
        When I wait for "1" seconds
        When I click element with locator "#create"
        When I wait for "1" seconds
        Then the element with locator "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"

        # valid email - enabled fields
        When I refresh page
        When I wait for "3" seconds
        When I click element with locator "#add-new-user"
        When I set "j_doe@xxx" to the inputfield "[data-test=user-add-email]"
        And the element "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" does not exist

        Then the element with locator "//input[@data-test='user-add-first-name']" should not have attribute "disabled"
        Then the element with locator "//input[@data-test='user-add-last-name']" should not have attribute "disabled"
        Then the element with locator "//input[@data-test='user-add-role']" should not have attribute "disabled"


