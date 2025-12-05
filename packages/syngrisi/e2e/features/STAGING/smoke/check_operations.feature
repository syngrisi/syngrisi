@staging @smoke @no-app-start
Feature: Check Operations on Staging

  Core check operations (view, expand, modal) on staging with production data.

  Background:
    Given I open the staging app
    And I am logged in as "reviewer" on staging

  Scenario: View checks in the dashboard
    Then I should see the main dashboard
    And I should see production data in the runs list

  Scenario: Filter checks using quick filter
    Given I should see the main dashboard
    When I fill "Simple card" into element with locator "input[placeholder*='test name' i]"
    And I wait 2 seconds
    Then the element "tbody tr" is visible within 5 seconds

  Scenario: Expand test row to see check previews
    Given I should see the main dashboard
    When I click on the first test row on staging
    Then I should see check previews

  Scenario: Open check modal from preview
    Given I should see the main dashboard
    When I click on the first test row on staging
    And I should see check previews
    And I click on the first check preview on staging
    Then I should see the check modal
    When I close the check modal

  Scenario: Navigate to baselines page
    Given I should see the main dashboard
    When I navigate to baselines page on staging
    Then I should see the baselines table

  Scenario: Verify API returns checks
    Given I should see the main dashboard
    Then there should be at least 1 total checks via API
