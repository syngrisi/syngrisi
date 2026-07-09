@demo @fast-server @mode:serial
Feature: Repro — intermittent "slightly shifted text" diffs (font-display swap race)

    # Reproduces the intermittent diffs where ALL text is highlighted with a slight
    # shift while the layout (cards, borders, icons) stays identical.
    #
    # Root cause (verified on https://www.mongodb.com/): the site declares its
    # webfonts ('Euclid Circular A', 'MongoDB Value Serif', ...) via 92 @font-face
    # rules, every one with `font-display: swap`. With `swap` the browser paints
    # text immediately using the metric-close system fallback (Arial) and repaints
    # when the webfont arrives. A screenshot captured inside that window renders
    # every glyph with slightly different shapes/kerning (~1px), so the visual
    # diff flags all text — intermittently, depending on font cache/CDN timing.
    #
    # Repro: baseline = page with the webfont applied (data-URI Roboto standing in
    # for Euclid Circular A); actual = identical page rendered with the Arial
    # fallback, i.e. exactly what the browser shows before the swap happens.

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Screenshot taken before the webfont swap produces a text-only shifted diff
        Given I create RCA test with "font-swap/webfont-loaded" as baseline
        When I create RCA actual check with "font-swap/webfont-not-loaded"
        And I go to "main" page
        And I wait for test "RCA-Scenario-Test" to appear in table
        And I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait on element "[data-test-preview-image='RCA-Scenario-Check']" to be visible
        Then the element with locator "[data-check-status-name='RCA-Scenario-Check'][data-check-status-value='failed']" should be visible
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
