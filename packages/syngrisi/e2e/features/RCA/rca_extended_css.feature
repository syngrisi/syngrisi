@rca @fast-server @mode:serial
Feature: RCA - Extended CSS Changes Detection

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: RCA detects visibility changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/visibility-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: RCA detects z-index changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/z-index-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: RCA detects font changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/font-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: RCA detects opacity changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/opacity-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: RCA detects transform changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/transform-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: RCA detects border changes
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/border-change"
        And I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 30 seconds for the element with locator "[data-check='toolbar']" to be visible
        And I wait 30 seconds for the element with locator "[data-test='rca-toggle-button']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes
