@demo @fast-server @marketing
Feature: Syngrisi — Marketing reel

    # Subtitled product reel for the README. No spoken audio during recording — captions are compact,
    # outlined (readable on any background), and each stays on screen for its voice-over clip length.
    # Voice-over (StyleTTS2 / Olivia) is generated separately and muxed in post. Deterministic
    # fake-provider verdicts (intended / noise / bug) so the reel always looks clean.
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
        # --- silent prep: three checks, pending (not yet analysed) ---
        Given I create RCA baselines for the showcase changes
        Given I enable AI triage for the project "RCA Scenario App"
        When I create the showcase changed checks

        # --- 1. intro on the grid ---
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I subtitle "Open-source, self-hosted visual regression testing."

        # --- 2. the AI triage queue, still processing ---
        When I go to "ai" page
        When I wait 8 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I click element with locator "[data-test='ai-tab-queue']"
        When I wait 8 seconds for the element with locator "[data-test='ai-queue-run']" to be visible
        When I highlight element "[data-test='ai-queue']"
        When I subtitle "AI triage runs in the background — grouped by run."
        When I clear highlight

        # --- silent: classify each check with a fixed, photogenic verdict ---
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

        # --- 3. verdicts on the grid ---
        When I go to "main" page
        When I wait 6 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I subtitle "Every failed check gets an AI verdict."
        When I highlight element "[data-test='triage-verdict']"
        When I subtitle "Intended change, noise, or a real bug — each with a reason."
        When I clear highlight

        # --- 4. inside a check: highlighted diff + side-by-side ---
        When I open the 1st check "Image-Check"
        When I wait 4 seconds for the element with locator "[data-test='triage-toolbar']" to be visible
        When I click element with locator "[data-check='diff-view']"
        When I subtitle "Open a check — the highlighted diff shows exactly what changed."
        When I click element with locator "[data-check='slider-view']"
        When I subtitle "Drag the slider to compare baseline and actual, side by side."
        When I click element with locator "[data-test='close-check-detail-icon']"

        # --- silent: accept the new baselines and re-run → green ---
        When I accept via http the 1st check with name "Added-Check"
        When I accept via http the 1st check with name "Text-Check"
        When I accept via http the 1st check with name "Image-Check"
        When I re-run the showcase checks as passing

        # --- 5. reapply → everything green ---
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I subtitle "Accept the new baseline, re-run — and the checks pass, green."

        # --- 6. group & filter by AI verdict ---
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 10 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I subtitle "Group and filter by AI verdict — triage hundreds of diffs at a glance."
        When I clear highlight

        # --- 7. closing ---
        When I go to "main" page
        When I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I subtitle "Ship pixel-perfect interfaces with confidence — Syngrisi."
