@demo @fast-server @marketing
Feature: Syngrisi — Marketing reel

    # Short (~30s) subtitled reel for the README. No spoken audio here — captions are compact,
    # outlined (readable on any background), and each stays on screen for its voice-over clip
    # length (audio is generated separately with StyleTTS2 / Olivia and muxed in post).
    # Deterministic fake-provider verdicts (intended / noise / bug) so the reel always looks clean.
    # Record: npx playwright test --project=marketing --grep "Marketing reel" --workers=1

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Marketing reel
        When I start the reel timeline
        # --- silent prep: three checks with fixed, photogenic verdicts ---
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
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
                type: fake
                fakeVerdict: noise
                fakeConfidence: 9
            enabled: true
            """
        When I run AI triage for the 1st check named "Text-Check"
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
                type: fake
                fakeVerdict: likely_bug
                fakeConfidence: 10
            enabled: true
            """
        When I run AI triage for the 1st check named "Image-Check"

        # --- reel ---
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I subtitle "Open-source, self-hosted visual testing."
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I subtitle "Every failed check gets an AI verdict."

        When I open the 1st check "Image-Check"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I subtitle "Baseline, actual, and the diff."
        When I click element with locator "[data-test='close-check-detail-icon']"

        When I go to "main" page
        When I wait 6 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I subtitle "Intended change, noise, or a real bug."
        When I clear highlight

        When I highlight element "[data-test='triage-filter-button']"
        When I subtitle "Filter and group by AI verdict."
        When I clear highlight
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 10 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I subtitle "Noise auto-accepts; real bugs stay."

        When I go to "ai" page
        When I wait 8 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I subtitle "Run a local model — fully private."
        When I clear highlight

        When I go to "main" page
        When I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I subtitle "Syngrisi — visual testing with AI triage."
