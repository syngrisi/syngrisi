@rca @fast-server @smoke
Feature: RCA - No DOM Data Scenarios

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: RCA shows message when no DOM data available
        Given I create RCA test with "html-changes/base" as baseline without DOM data
        When I create RCA actual check with "html-changes/added-elements" without DOM data
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show no DOM data message

    Scenario: RCA enabled via env variable
        When I set env variables:
            """
            SYNGRISI_DISABLE_DOM_DATA: "false"
            """
        Given I create RCA test with "html-changes/base" as baseline with DOM collection enabled
        When I create RCA actual check with "html-changes/added-elements" with DOM collection enabled
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show changes summary

    Scenario: RCA disabled by default (without env variable)
        # No SYNGRISI_DISABLE_DOM_DATA set, should default to disabled (true)
        Given I create RCA test with "html-changes/base" as baseline with DOM collection enabled
        When I create RCA actual check with "html-changes/added-elements" with DOM collection enabled
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show no DOM data message
