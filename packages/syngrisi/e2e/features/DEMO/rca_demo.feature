@demo @fast-server
Feature: RCA (Root Cause Analysis) Demo

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Demo: Root Cause Analysis - Understanding WHY Visual Regressions Happen
        # ============================================
        # SETUP: Create test data with DOM snapshots
        # ============================================

        # Create baseline with DOM snapshot
        Given I create RCA demo test with baseline DOM

        # Create actual check with DOM changes (simulates visual regression)
        When I create RCA demo actual check with DOM changes

        # ============================================
        # DEMO: Navigate to the test and open RCA
        # ============================================

        # Open the main page
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible
        When I take RCA debug screenshot "01-main-page"

        # DEMO POINT 1: Introduction
        When I announce: "Welcome to Root Cause Analysis - a powerful feature that helps you understand WHY visual regressions happen, not just WHAT changed."
        And I pause for 1500 ms

        # Find and expand the test
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Demo-Test']" to be visible
        When I take RCA debug screenshot "02-test-visible"
        When I highlight element "[data-table-test-name='RCA-Demo-Test']"
        And I announce: "Let's open a test that has detected a visual difference. Notice the FAILED status indicating a mismatch."
        And I pause for 1000 ms
        And I clear highlight

        When I click element with locator "[data-table-test-name='RCA-Demo-Test']"
        And I wait 1 seconds
        When I take RCA debug screenshot "03-test-expanded"

        # DEMO POINT 2: Show the failed check
        When I highlight element "[data-test-preview-image='RCA-Demo-Check']"
        And I announce: "Here's the check with visual differences. The red overlay shows WHERE pixels differ, but doesn't explain WHY."
        And I pause for 1250 ms
        And I clear highlight

        # Open Check Details
        When I click element with locator "[data-test-preview-image='RCA-Demo-Check']"
        And I wait 1.5 seconds
        When I take RCA debug screenshot "04-check-details-opened"

        # Wait for Check Details to load
        Then the element with locator "[data-check='toolbar']" should be visible

        # DEMO POINT 3: Traditional diff view
        When I announce: "This is the traditional diff view. You can see the red highlighted areas showing pixel differences. But what caused them?"
        And I pause for 1500 ms

        # DEMO POINT 4: Introduce RCA button - check if it exists
        When I take RCA debug screenshot "05-before-rca-button-click"
        When I highlight element "[data-test='rca-toggle-button']"
        And I announce: "The 'D' button activates Root Cause Analysis. It analyzes the DOM structure to find the actual code changes that caused the visual difference."
        And I pause for 1500 ms
        And I clear highlight

        # Click RCA button
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 2 seconds
        When I take RCA debug screenshot "06-after-rca-button-click"

        # Wait for RCA panel (any state)
        When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible
        When I take RCA debug screenshot "07-rca-panel-visible"

        # Check the state of RCA panel
        When I take RCA debug screenshot "08-rca-panel-state-check"

        # DEMO POINT 5: RCA Panel overview
        When I highlight element "[data-test='rca-panel']"
        And I announce: "The RCA panel appears! It analyzes DOM changes between baseline and actual screenshots."
        And I pause for 1500 ms
        And I clear highlight
        When I take RCA debug screenshot "09-after-panel-highlight"

        # Try to find stats - if not in ready state, show error message
        # First check if in error state
        When I take RCA debug screenshot "10-checking-panel-content"

        # DEMO POINT: Explain what RCA shows (regardless of state)
        When I announce: "RCA compares the DOM structure, including element positions, CSS styles, and hierarchy. When DOM snapshots are available, it shows exactly which properties changed."
        And I pause for 1750 ms

        # DEMO POINT: Keyboard shortcut
        When I announce: "Pro tip: Press the 'D' key to quickly toggle RCA on and off while reviewing checks."
        And I pause for 1000 ms

        # Toggle RCA off with keyboard
        When I press the "d" key
        And I wait 0.5 seconds
        When I take RCA debug screenshot "11-rca-toggled-off"

        # DEMO POINT: Closing
        When I announce: "Root Cause Analysis transforms visual regression testing from 'something changed' to 'here's exactly what changed and why'. Happy debugging!"
        And I pause for 1500 ms

        # Close modal
        When I press the "Escape" key
        And I wait 0.5 seconds
        When I take RCA debug screenshot "12-final-state"

        # End demo with confetti
        When I end the demo
