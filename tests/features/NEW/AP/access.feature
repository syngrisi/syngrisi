Feature: Access to admin Panel

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Open Admin Panel as Anonymous User
        When I fail

    Scenario: Open Admin Panel behalf of User role
        When I fail

    Scenario: Open Admin Panel behalf of Reviewer role
        When I fail
