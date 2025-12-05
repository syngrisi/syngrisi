@extended
Feature: Check Lifecycle on Staging

  Tests for creating, accepting, and deleting checks on staging.
  These tests create temporary test data and clean it up after.

  Background:
    Given I open the staging app
    And I am logged in as "admin" on staging

  Scenario: Create check via API and verify it appears
    Given I should see the main dashboard
    When I create a test check on staging with name "E2E-Test-Check"
    Then the created check should appear in the dashboard
    # Cleanup
    When I cleanup staging test data

  Scenario: Create check and accept it to create baseline
    Given I should see the main dashboard
    When I create a test check on staging with name "E2E-Accept-Test"
    And I accept the created check on staging
    Then the created check should appear in the dashboard
    # Cleanup - delete both baseline and check
    When I delete the created baseline on staging
    And I delete the created check on staging

  Scenario: Full check lifecycle - create, accept, delete
    Given I should see the main dashboard
    # Create
    When I create a test check on staging with name "E2E-Lifecycle-Test"
    Then the created check should appear in the dashboard
    # Accept (creates baseline)
    When I accept the created check on staging
    # Cleanup everything
    When I cleanup staging test data
