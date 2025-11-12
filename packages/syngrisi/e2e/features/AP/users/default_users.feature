@integration
Feature: Default Users

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: false
        """
        Given I start Server
        When I create via http test user
        When I stop the Syngrisi server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I login with user:"Test" password "123456aA-"
        When I wait 30 seconds for the element with locator "span*=TA" to be visible

    Scenario: Default Administrator and Guest should be created after first server start
        When I go to "admin>users" page
        When I wait for "3" seconds
        Then the element with locator "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-first-name' and @value='Syngrisi']" should be visible
        Then the element with locator "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-last-name' and @value='Admin']" should be visible
        Then the element with locator "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-role' and @value='Admin']" should be visible

        Then the element with locator "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-first-name' and @value='Syngrisi']" should be visible
        Then the element with locator "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-last-name' and @value='Guest']" should be visible
        Then the element with locator "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-role' and @value='User']" should be visible


