@demo @fast-server @marketing
Feature: Syngrisi — AI Match reel

    # Subtitled product reel for the AI Match feature (find the SAME visual change across viewports
    # and browsers). No spoken audio during recording — compact outlined captions + red arrows;
    # voice-over (StyleTTS2 / Olivia) is generated and muxed in post.
    # Record:
    #   MARKETING_FEATURE="$PWD/features/DEMO/ai_match_reel.feature" python3 scripts/marketing/tts.py
    #   export MARKETING_CAPTIONS="$PWD/scripts/marketing/captions.built.json"
    #   export MARKETING_TIMELINE="$PWD/scripts/marketing/timeline.json"
    #   yarn bddgen && npx playwright test --project=marketing --grep "AI Match reel" --workers=1
    #   python3 scripts/marketing/build.py --out assets/ai-match.mp4

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: AI Match reel
        When I start the reel timeline
        # --- silent prep: one regression repeated across viewports + another browser, plus an unrelated fail ---
        Given I create a run "Login" with the same change at viewports "1366x768,768x1024,375x667"
        And I add the same change "ChangeCheck" to run "Login" at viewport "1366x768" with browser "firefox"
        And I add an unrelated failed change "OtherCheck" to run "Login" at viewport "375x667"

        # --- 1. intro: a wall of red — the same change failing on every viewport & browser ---
        When I go to "main" page
        When I wait 8 seconds for the element with locator "[data-row-name='Login__1366x768']" to be visible
        When I subtitle "A single layout change rarely fails just once — it breaks on every viewport and browser you capture."

        # --- 2. open a failed check and point at the AI Match action ---
        When I unfold the test "Login__1366x768"
        When I wait 4 seconds for the element with locator "[data-table-check-name='ChangeCheck']" to be visible
        When I open the 1st check "ChangeCheck"
        When I wait 6 seconds for the element with locator "[data-test='find-similar-checks']" to be visible
        When I point an arrow at "[data-test='find-similar-checks']" labeled "AI Match"
        When I subtitle "Open any failed check and hit AI Match."
        When I clear arrows
        When I click element with locator "[data-test='find-similar-checks']"

        # --- 3. the grid filters to the whole cluster, ranked by similarity ---
        When I wait 8 seconds for the element with locator "[data-test='similarity-score']" to be visible
        When I point an arrow at "[data-test='similarity-filter-badge']" labeled "Active AI Match filter"
        When I subtitle "Syngrisi instantly pulls up the very same change everywhere else — other resolutions and other browsers."
        When I clear arrows
        When I point an arrow at "[data-test='similarity-score']" labeled "Similarity score"
        When I subtitle "Each match is ranked by a similarity score, so you review one bug across every viewport in a single pass."
        When I clear arrows

        # --- 4. closing ---
        When I subtitle "AI Match — one bug, every viewport, one click. Syngrisi."
