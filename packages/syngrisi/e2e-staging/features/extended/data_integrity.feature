@extended
Feature: Data Integrity on Staging

  Tests to verify data integrity on staging with production data.

  Background:
    Given I open the staging app
    And I am logged in as "admin" on staging

  Scenario: Admin can view dashboard with table headers
    Given I should see the main dashboard
    Then the element "th:has-text('Browser')" is visible within 5 seconds
    And the element "th:has-text('Platform')" is visible within 5 seconds
    And the element "th:has-text('Viewport')" is visible within 5 seconds
