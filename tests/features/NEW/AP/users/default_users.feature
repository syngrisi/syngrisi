@integration
Feature: Default Users

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 1
        SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        When I stop the Syngrisi server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 1
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver
        When I login with user:"Test" password "123"
        Then I wait on element "span*=TA" to be displayed

    Scenario: Default Administrator and Guest should be created after first server start
        When I go to "admin>users" page
        When I wait for "3" seconds
        Then I expect that element "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-first-name' and @value='Syngrisi']" is displayed
        Then I expect that element "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-last-name' and @value='Admin']" is displayed
        Then I expect that element "//*[@data-test='user-list-email' and @value='Administrator']/../../..//input[@data-test='user-list-role' and @value='Admin']" is displayed

        Then I expect that element "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-first-name' and @value='Syngrisi']" is displayed
        Then I expect that element "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-last-name' and @value='Guest']" is displayed
        Then I expect that element "//*[@data-test='user-list-email' and @value='Guest']/../../..//input[@data-test='user-list-role' and @value='User']" is displayed
