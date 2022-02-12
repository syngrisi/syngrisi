@integration
Feature: Create User

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
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    @smoke
    Scenario: Create User - Success
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

    Scenario: Create User - Duplicate
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
        Then I expect that element "//input[@name='username' and @value='j_doe@gmail.com']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Doe']" does appear exactly "1" times

    Scenario: Create User - without Password
        When I go to "admin>users" page
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "j_smith@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "John" to the inputfield "//input[@placeholder='First Name']"
        When I set "Smith" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "user" for element "//select[@new-user-role]"
        When I click on the element "a.send-new-user-button"
        When I wait for "3" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='j_smith@gmail.com']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Smith']" is displayed

    Scenario: Create User - without Username
        When I go to "admin>users" page
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "John" to the inputfield "//input[@placeholder='First Name']"
        When I set "Smith" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "user" for element "//select[@new-user-role]"
        When I click on the element "a.send-new-user-button"
        When I wait for "3" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username']/../..//input[@name='firstName' and @value='John']/../..//input[@name='lastName' and @value='Smith']" is not displayed
