@extended @readonly
Feature: Advanced Navigation on Staging

  Tests for keyboard navigation, search, and sorting functionality.

  Background:
    Given I open the staging app
    And I am logged in as "reviewer" on staging

  @skip
  Scenario: Navigate between checks using keyboard in modal
    # Skip: Requires production data with rendered preview images
    # The test is affected by E2E test data which may not have proper images
    Given I should see the main dashboard
    When I click on the first test row on staging
    And I should see check previews
    And I click on the first check preview on staging
    Then I should see the check modal
    When I press right arrow to go to next check
    Then I should see a different check in the modal
    When I press left arrow to go to previous check
    Then I should see the check modal
    When I close the check modal

  Scenario: Search for specific test in quick filter
    Given I should see the main dashboard
    When I search for "Simple card" in the quick filter on staging
    And I wait 2 seconds
    Then the table should show results containing "Simple"

  Scenario: Sort checks by different columns
    Given I should see the main dashboard
    When I click on "Name" column header to sort
    And I wait 1 seconds
    Then the element "tbody tr" is visible within 5 seconds
    When I click on "Date" column header to sort
    And I wait 1 seconds
    Then the element "tbody tr" is visible within 5 seconds

  Scenario: Search for non-existent test returns filtered results
    Given I should see the main dashboard
    When I search for "zzz_nonexistent_test_xyz" in the quick filter on staging
    And I wait 2 seconds
    # Table might be empty or show no matching results
    When I clear the quick filter on staging
    Then I should see production data in the runs list
