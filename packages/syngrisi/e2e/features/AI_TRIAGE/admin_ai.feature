@fast-server
Feature: AI Triage - Admin AI page

  Scenario: Admin AI page exposes provider config and per-project triage settings
    When I go to "ai" page
    Then the element with locator "[data-test='ai-providers-form']" should be visible
    # provider model parameters
    Then the element with locator "[data-test='ai-provider-temperature']" should be visible
    Then the element with locator "[data-test='ai-provider-max-tokens']" should be visible
    Then the element with locator "[data-test='ai-provider-timeout']" should be visible
    # feature is Beta — badge shown on the page header and in the provider form
    Then the element with locator "[data-test='ai-providers-form'] [data-test='ai-beta-badge']" should be visible
    # per-project settings (triage + AI Similarity) live in their own "Projects settings" tab, left of Queue
    Then the element with locator "[data-test='ai-tab-projects']" should be visible
    When I click element with locator "[data-test='ai-tab-projects']"
    Then the element with locator "[data-test='ai-perproject-form']" should be visible
    Then the element with locator "[data-test='ai-project-select']" should be visible

  Scenario: AI page has a Queue tab
    When I go to "ai" page
    Then the element with locator "[data-test='ai-tab-queue']" should be visible
    When I click element with locator "[data-test='ai-tab-queue']"
    Then the element with locator "[data-test='ai-queue']" should be visible

  Scenario: Help documentation popover opens on the AI page
    When I go to "ai" page
    Then the element with locator "[data-test='ai-providers-form'] [data-test='help-doc']" should be visible
    When I click element with locator "[data-test='ai-providers-form'] [data-test='help-doc']"
    Then the element with locator "[data-test='help-doc-popover']" should be visible
