@integration
Feature: Create User

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 1
        SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        Given I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    @smoke
    Scenario: Create User - Success
        When I go to "admin2" page
        When I wait for "3" seconds
        When I click on the element "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"
        When I wait on element "[data-test=user-add-first-name]" to be enabled
        When I set "John" to the inputfield "[data-test=user-add-first-name]"
        When I set "Doe" to the inputfield "[data-test=user-add-last-name]"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I set "Password-123" to the inputfield "[data-test=user-add-password]"
        When I click on the element "#create"

        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" contain value "j_doe@gmail.com"
        Then I expect that element "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-first-name']" contain value "John"
        Then I expect that element "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-last-name']" contain value "Doe"
        Then I expect that element "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-role']" contain value "Reviewer"

        When I go to "logout" page
        When I wait for "3" seconds
        When I login with user:"j_doe@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

    Scenario: Create User - User Already Exist
        When I go to "admin2" page
        When I wait for "3" seconds
        When I click on the element "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"
        When I wait on element "[data-test=user-add-first-name]" to be enabled
        When I set "John" to the inputfield "[data-test=user-add-first-name]"
        When I set "Doe" to the inputfield "[data-test=user-add-last-name]"
        When I select the option with the text "Reviewer" for element "select[data-test=user-add-role]"
        When I set "Password-123" to the inputfield "[data-test=user-add-password]"
        When I click on the element "#create"

        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times
        Then I expect that element "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" contain value "j_doe@gmail.com"

        When I click on the element "#add-new-user"
        When I set "j_doe@gmail.com" to the inputfield "[data-test=user-add-email]"

        Then I expect that element "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" contain text "user with this email already exists"

        When I click on the element "#create"
        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='j_doe@gmail.com']" does appear exactly "1" times

    Scenario: Create User - Invalid fields
        When I go to "admin2" page
        When I wait for "3" seconds

        # invalid email - disabled fields
        When I click on the element "#add-new-user"
        When I set "j_doe@" to the inputfield "[data-test=user-add-email]"
        Then I expect that element "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" contain text "Invalid email format"

        Then I expect that the element "//input[@data-test='user-add-first-name']" to have attribute "disabled"
        Then I expect that the element "//input[@data-test='user-add-last-name']" to have attribute "disabled"
        Then I expect that the element "//input[@data-test='user-add-role']" to have attribute "disabled"

        When I click on the element "#create"
        When I wait for "1" seconds
        Then I expect that element "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" contain text "Invalid email format"

        # valid email - enabled fields
        When I refresh page
        When I wait for "3" seconds
        When I click on the element "#add-new-user"
        When I set "j_doe@xxx" to the inputfield "[data-test=user-add-email]"
        And I expect that element "//input[@data-test='user-add-email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" does not exist

        Then I expect that the element "//input[@data-test='user-add-first-name']" to not have attribute "disabled"
        Then I expect that the element "//input[@data-test='user-add-last-name']" to not have attribute "disabled"
        Then I expect that the element "//input[@data-test='user-add-role']" to not have attribute "disabled"
