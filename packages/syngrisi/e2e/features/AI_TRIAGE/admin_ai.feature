@fast-server
Feature: AI Triage - Admin AI page

  Scenario: Admin AI page exposes provider config and per-project triage settings
    When I go to "ai" page
    Then the element with locator "[data-test='ai-providers-form']" should be visible
    Then the element with locator "[data-test='ai-perproject-form']" should be visible
    Then the element with locator "[data-test='ai-project-select']" should be visible
