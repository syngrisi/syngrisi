@fast-server
Feature: AI Features
  As an AI agent
  I want to access simplified HTML pages and API endpoints
  So that I can evaluate checks and tests

  Background:
    Given I create "1" tests with params:
      """
      {
        "testName": "AI Test - 1",
        "checks": [
          {
            "checkName": "AI Check",
            "filePath": "files/A.png"
          }
        ]
      }
      """

  Scenario: List checks via AI endpoint
    When I request "/ai/checks" with API key
    Then I should receive an HTML response
    And the response should contain "AI Check"
    And the response should contain "Checks List"

  Scenario: Get check details via AI endpoint
    When I request details for "AI Check" via AI endpoint
    Then I should receive an HTML response
    And the response should contain "AI Check"
    And the response should contain "Metadata"

  Scenario: Get analysis JSON
    When I request analysis for "AI Check" via AI endpoint
    Then I should receive a JSON response
    And the response should contain "images"
    And the response should contain "context"

  Scenario: Batch accept checks
    When I batch accept "AI Check" via AI endpoint
    Then the check "AI Check" should be "new"
    And the check "AI Check" should be marked as "accepted"
  Scenario: Filter checks via AI endpoint
    When I filter checks by name "AI Check"
    Then I should receive an HTML response
    And the response should contain "AI Check"

  Scenario: Filter checks by date range
    When I filter checks by date range
    Then I should receive an HTML response
    And the response should contain "AI Check"

  Scenario: Get AI index page
    When I request "/ai/" with API key
    Then I should receive an HTML response
    And the response should contain "AI Endpoints Documentation"
    And the response should contain "Common Use Cases"
    And the response should not contain "< "

  Scenario: Validate checks list HTML rendering
    When I request "/ai/checks" with API key
    Then I should receive an HTML response
    And the response should contain "Checks List"
    And the response should not contain "< article"
    And the response should not contain "< form"

  Scenario: Validate check details HTML rendering
    When I request details for "AI Check" via AI endpoint
    Then I should receive an HTML response
    And the response should contain "AI Check"
    And the response should contain "Metadata"
    And the response should not contain "< article"
    And the response should not contain "< figure"

  Scenario: Export checks as JSON
    When I request "/ai/checks?format=json" with API key
    Then I should receive a JSON response
    And the JSON response should have property "results"
    And the JSON response should have property "totalPages"

  Scenario: Export checks as CSV
    When I request "/ai/checks?format=csv" with API key
    Then I should receive a CSV response

  Scenario: Filter by last seconds
    When I request "/ai/checks?lastSeconds=3600" with API key
    Then I should receive an HTML response

  @flaky
  Scenario: Field filtering with JSON export
    When I request "/ai/checks?fields=_id,name,status&format=json" with API key
    Then I should receive a JSON response
    And the JSON results should only contain specified fields

  Scenario: Pagination with custom limit
    When I request "/ai/checks?limit=50" with API key
    Then I should receive an HTML response
    And the response should contain "Showing"
