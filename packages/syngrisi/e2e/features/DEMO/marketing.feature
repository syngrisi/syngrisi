@demo @fast-server @marketing
Feature: Syngrisi — Marketing reel

    # Subtitled product reel for the README. No spoken audio during recording — compact outlined
    # captions; voice-over (StyleTTS2 / Olivia) is generated and muxed in post. Deterministic
    # fake-provider verdicts so the reel always looks clean.
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
        # --- silent prep: four ready checks, classified with fixed verdicts ---
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

        # --- 1. intro: a project full of checks, across browsers, platforms & devices ---
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-table-check-name='Added-Check']" to be visible
        When I subtitle "Syngrisi is an opensource visual testing platform for every browser, platform and device."

        # --- 2. a big, intended change: inspect & re-accept ---
        When I open the 1st check "Added-Check"
        When I wait 4 seconds for the element with locator "[data-test='triage-toolbar']" to be visible
        When I click element with locator "[data-check='diff-view']"
        When I subtitle "When a check fails on a large, intended redesign, inspect the highlighted diff."
        When I click element with locator "[data-check='actual-view']"
        When I subtitle "Flip between actual and expected,"
        When I click element with locator "[data-check='expected-view']"
        When I wait 1 seconds for the element with locator "[data-check='slider-view']" to be visible
        When I click element with locator "[data-check='slider-view']"
        When I subtitle "or compare them side by side."
        When I accept check from modal
        When I subtitle "Not a bug? Accept it as the new baseline in one click."
        When I click element with locator "[data-test='close-check-detail-icon']"

        # --- 3. a subtle change: highlighter + automatic ignore-regions ---
        When I go to "main" page
        When I wait 6 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I open the 1st check "Small-Check"
        When I wait 4 seconds for the element with locator "[data-test='triage-toolbar']" to be visible
        When I click element with locator "[data-check='diff-view']"
        When I click element with locator "[data-check='highlight-icon']"
        When I subtitle "For subtle changes, the highlighter pinpoints every difference."
        When I accept check from modal
        When I wait 2 seconds for the element with locator "[data-check='auto-ignore-region']" to be visible
        When I click element with locator "[data-check='auto-ignore-region']"
        When I subtitle "And automatic ignore-regions mask noisy areas so they never fail again."
        When I click element with locator "[data-test='close-check-detail-icon']"

        # --- 4. admin: AI provider + verdicts + auto-accept threshold ---
        When I go to "ai" page
        When I wait 8 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I subtitle "Connect a known AI provider — OpenAI, Anthropic, Gemini — or a fully self-hosted model."
        When I clear highlight
        When I click element with locator "[data-test='ai-project-select']"
        When I wait 3 seconds for the element with locator "[role='option']" to be visible
        When I click element with locator "[role='option']"
        When I wait 4 seconds for the element with locator "[data-test='ai-verdicts-table']" to be visible
        When I scroll to element "[data-test='ai-verdicts-table']"
        When I highlight element "[data-test='ai-verdicts-table']"
        When I subtitle "Define your own verdicts and auto-accept above a confidence threshold you choose."
        When I clear highlight
        When I scroll to element "[data-test='ai-prompt']"
        When I highlight element "[data-test='ai-prompt']"
        When I subtitle "Even the AI prompt is editable per project — with placeholders filled from each check at triage time."
        When I clear highlight

        # --- 5. triage: verdicts, filtering & grouping ---
        When I go to "main" page
        When I wait 6 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 3 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I reveal verdicts with caption "AI triage turns a wall of red into clear verdicts — intended change, noise, or a likely bug."
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 10 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I subtitle "Filter and group by verdict, so you focus only on real bugs."
        When I clear highlight

        # --- 6. closing ---
        When I go to "main" page
        When I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I subtitle "Visual testing you control, with AI that has your back — Syngrisi."
