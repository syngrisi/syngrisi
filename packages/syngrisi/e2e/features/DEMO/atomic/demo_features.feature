@demo
Feature: Atomic Verification - Demo Features

    Background:
        When I go to "login" page

    Scenario: Verify all demo capability layers
        # Progress Bar Verification
        When I set demo step 1 of 4: "Initialization"

        # Highlight Verification
        Then the element with locator "#email" should be visible for 10 sec
        When I highlight element "#email"
        When I highlight element "#password"
        When I clear highlight

        # Banner Verification
        When I set demo step 2 of 4: "Announcements"
        When I announce: "Testing banner visibility"

        # Pause Verification (only active in DEMO mode)
        When I set demo step 3 of 4: "Pause Check"
        When I announce: "Testing pause functionality" and PAUSE

        # Confetti Verification
        When I set demo step 4 of 4: "Completion"
        When I announce: "Demo features verified"
        When I end the demo
