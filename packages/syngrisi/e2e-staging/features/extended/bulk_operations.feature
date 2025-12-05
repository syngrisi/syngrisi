@extended
Feature: Bulk Operations on Staging

  Extended tests for bulk check operations and table interactions.

  Background:
    Given I open the staging app
    And I am logged in as "reviewer" on staging

  Scenario: View dashboard with multiple runs
    Given I should see the main dashboard
    And I should see production data in the runs list

  Scenario: Sort checks by date
    Given I should see the main dashboard
    When I click element with locator "th:has-text('Date')"
    And I wait 2 seconds
    Then the element "tbody tr" is visible within 5 seconds

  Scenario: Infinite scroll loads more checks
    Given I should see the main dashboard
    And I should see at least 1 checks in the table
    When I scroll down to load more checks
    And I wait 2 seconds
    Then the element "tbody tr" is visible within 5 seconds

  Scenario: Refresh table updates data
    Given I should see the main dashboard
    When I click the refresh button on staging
    And I wait 2 seconds
    Then I should see production data in the runs list

  Scenario: Expand multiple test rows
    Given I should see the main dashboard
    When I click on the first test row on staging
    Then I should see check previews
