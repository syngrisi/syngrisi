@rca @fast-server @mode:serial
Feature: RCA - Extended Edge Cases

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            SYNGRISI_DISABLE_DOM_DATA: "false"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: RCA handles empty body to content
        Given I create RCA test with "edge-cases/empty-body" as baseline
        When I create RCA actual check with "edge-cases/empty-body-modified"
        And I wait for RCA data to be ready
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I open the 1st check "RCA-Scenario-Check"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements

    Scenario: RCA handles deeply nested DOM structures
        Given I create RCA test with "edge-cases/deeply-nested" as baseline
        When I create RCA actual check with "edge-cases/deeply-nested-modified"
        And I wait for RCA data to be ready
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I open the 1st check "RCA-Scenario-Check"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements
        And the RCA panel should show text changes

    Scenario: RCA handles special characters and unicode
        Given I create RCA test with "edge-cases/special-chars" as baseline
        When I create RCA actual check with "edge-cases/special-chars-modified"
        And I wait for RCA data to be ready
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I open the 1st check "RCA-Scenario-Check"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show text changes
