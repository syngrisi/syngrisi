@integration
Feature: Update User

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
        """
        Given I start Server
        When I create via http test user
        When I stop Server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I login with user:"Test" password "123456aA-"
        When I wait 30 seconds for the element with locator "span*=TA" to be visible
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

    @smoke
    Scenario: Update User - Success
        When I open the app
        When I go to "admin2" page
        When I wait 30 seconds for the element with locator "//*[@data-test='j_doe@gmail.com']//button[@data-test='user-list-update-button']" to be visible
        When I click element with locator "//*[@data-test='j_doe@gmail.com']//button[@data-test='user-list-update-button']"
        When I set "Alex" to the inputfield "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-first-name']"
        When I set "Jonson" to the inputfield "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-last-name']"
        When I select the option with the text "Reviewer" for element "//*[@data-test='j_doe@gmail.com']//select[@data-test='user-list-role']"

        When I click element with locator "//*[@data-test='j_doe@gmail.com']//button[@data-test='user-list-send-button']"
        When I wait for "2" seconds

        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" should have value "j_doe@gmail.com"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-first-name']" should have value "Alex"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-last-name']" should have value "Jonson"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-role']" should have value "Reviewer"
        When I wait 30 seconds for the element with locator "//div[contains(@class, 'mantine-Notification-title') and text()='Success']" to be visible

        When I refresh page
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-email']" should have value "j_doe@gmail.com"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-first-name']" should have value "Alex"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-last-name']" should have value "Jonson"
        Then the element with locator "//*[@data-test='j_doe@gmail.com']//input[@data-test='user-list-role']" should have value "Reviewer"




