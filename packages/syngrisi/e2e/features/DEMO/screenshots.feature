@demo @fast-server @marketing
Feature: AI screenshots for the README

    # Captures clean AI screenshots (no subtitles) to reports/marketing-shots/ at 1440x810.
    # Record: npx playwright test --project=marketing --grep "Capture AI screenshots" --workers=1

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Capture AI screenshots
        # setup: four checks classified with fixed verdicts
        Given I create RCA baselines for the showcase changes
        Given I enable AI triage for the project "RCA Scenario App"
        When I create the showcase changed checks
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
                type: fake
                fakeVerdict: intended_change
                fakeConfidence: 10
            enabled: true
            """
        When I run AI triage for the 1st check named "Added-Check"
        When I run AI triage for the 1st check named "Text-Check"
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
                type: fake
                fakeVerdict: noise
                fakeConfidence: 9
            enabled: true
            """
        When I run AI triage for the 1st check named "Small-Check"
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
                type: fake
                fakeVerdict: likely_bug
                fakeConfidence: 10
            enabled: true
            """
        When I run AI triage for the 1st check named "Image-Check"

        # 1. grid with AI verdict badges
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I save a screenshot to "reports/marketing-shots/ai-verdicts.png"

        # 2. multi-verdict filter popover
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I save a screenshot to "reports/marketing-shots/ai-filter.png"
        When I click element with locator "[data-test='triage-filter-clear']"

        # 3. grouped by AI verdict
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 10 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I save a screenshot to "reports/marketing-shots/ai-grouped.png"

        # 4. admin AI: provider + per-project verdicts & auto-accept
        When I go to "ai" page
        When I wait 8 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I click element with locator "[data-test='ai-project-select']"
        When I wait 3 seconds for the element with locator "[role='option']" to be visible
        When I click element with locator "[role='option']"
        When I wait 4 seconds for the element with locator "[data-test='ai-verdicts-table']" to be visible
        When I save a screenshot to "reports/marketing-shots/ai-admin.png"

        # 5. queue grouped by run
        When I click element with locator "[data-test='ai-tab-queue']"
        When I wait 6 seconds for the element with locator "[data-test='ai-queue-run']" to be visible
        When I save a screenshot to "reports/marketing-shots/ai-queue.png"
