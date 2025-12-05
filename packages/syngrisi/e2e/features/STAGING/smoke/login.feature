@staging @smoke @no-app-start
Feature: Staging Login

  Tests login functionality on staging environment with production data.

  Scenario: Login as reviewer user
    Given I open the staging app
    When I am logged in as "reviewer" on staging
    Then I should see the main dashboard
    And I should see production data in the runs list

  Scenario: Login as admin user
    Given I open the staging app
    When I am logged in as "admin" on staging
    Then I should see the main dashboard

  Scenario: Logout and login again
    Given I open the staging app
    And I am logged in as "reviewer" on staging
    When I logout from staging
    And I am logged in as "admin" on staging
    Then I should see the main dashboard
