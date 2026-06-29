@rca @fast-server @mode:serial
Feature: RCA - regression guards

    Guards for three fixed RCA bugs:
      1. An empty/degenerate baseline must report added elements (not "no DOM changes").
      2. Many similar structural changes must be aggregated into a single issue card.
      3. Geometry/content changes must appear as their own stats badges.

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            SYNGRISI_RCA: "true"
            SYNGRISI_DISABLE_DOM_DATA: "false"
            """
        Given I start Server and start Driver
        And I clear database

    @smoke
    Scenario: Empty baseline reports added elements, not "no changes"
        Given I create RCA test with "edge-cases/empty-body" as baseline
        When I create RCA actual check with "edge-cases/empty-body-modified"
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait on element "[data-test-preview-image='RCA-Scenario-Check']" to be visible
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the RCA panel state should be "ready"
        And the RCA stats should include "added"

    Scenario: Many added elements are aggregated into a single issue card
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/added-elements"
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait on element "[data-test-preview-image='RCA-Scenario-Check']" to be visible
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the RCA panel state should be "ready"
        And the RCA issues should be aggregated

    Scenario: Geometry changes are shown as a stats badge
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/position-change"
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait on element "[data-test-preview-image='RCA-Scenario-Check']" to be visible
        And I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the RCA panel state should be "ready"
        And the RCA stats should include "geometry"
