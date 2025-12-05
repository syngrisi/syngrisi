@maintenance @readonly
Feature: Cleanup Tasks on Staging

  Tests for admin access and basic maintenance operations.

  Background:
    Given I open the staging app
    And I am logged in as "admin" on staging

  Scenario: Admin can access dashboard
    Given I should see the main dashboard
    And I should see production data in the runs list

  Scenario: Admin can navigate to admin page
    When I navigate to admin page on staging
    And I wait 3 seconds
    Then the current URL contains "/admin"
