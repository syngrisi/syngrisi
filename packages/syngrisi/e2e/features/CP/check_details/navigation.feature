Feature: Check Details Navigation

    Background:
        Given I start Server and start Driver
        And I clear database

    Scenario: Navigate between checks in a test
        Given I create a test run "Test 1" with 3 checks
        When I go to "main" page
        And I unfold the test "Test 1"
        And I open the 1st check "Check 1"
        Then I should see the check details for "Check 1"
        And the "Previous Check" button should be "disabled"
        And the "Next Check" button should be "enabled"

        When I click the "Next Check" button
        Then I should see the check details for "Check 2"
        And the "Previous Check" button should be "enabled"
        And the "Next Check" button should be "enabled"

        When I click the "Next Check" button
        Then I should see the check details for "Check 3"
        And the "Previous Check" button should be "enabled"
        And the "Next Check" button should be "disabled"

        When I click the "Previous Check" button
        Then I should see the check details for "Check 2"

    Scenario: Navigate between tests
        Given I create a test run "Test 1" with 1 checks
        And I pause for 1000 ms
        And I create a test run "Test 2" with 1 checks
        And I pause for 1000 ms
        And I create a test run "Test 3" with 1 checks

        # Tests are sorted by date desc, so Test 3 is first, Test 1 is last.

        When I go to "main" page
        And I unfold the test "Test 3"
        When I open the 1st check "Check 1"
    # This opens the check from the list. Since Test 3 is top, "Check 1" of Test 3 is likely the first one visible if names are same?
    # Wait, "Check 1" name is ambiguous if all tests have "Check 1".
    # I should name checks uniquely or use specific step.

    Scenario: Navigate between tests with unique check names
        Given I create a test run "Test 1" with checks:
            | Name  |
            | T1-C1 |
        And I pause for 1000 ms
        And I create a test run "Test 2" with checks:
            | Name  |
            | T2-C1 |
        And I pause for 1000 ms
        And I create a test run "Test 3" with checks:
            | Name  |
            | T3-C1 |

        When I go to "main" page
        And I unfold the test "Test 3"
        When I open the 1st check "T3-C1"
        Then I should see the check details for "T3-C1"
        And the "Previous Test" button should be "disabled"
        And the "Next Test" button should be "enabled"

        When I click the "Next Test" button
        Then I should see the check details for "T2-C1"
        And the "Previous Test" button should be "enabled"
        And the "Next Test" button should be "enabled"

        When I click the "Next Test" button
        Then I should see the check details for "T1-C1"
        And the "Previous Test" button should be "enabled"
        And the "Next Test" button should be "disabled"

        When I click the "Previous Test" button
        Then I should see the check details for "T2-C1"
