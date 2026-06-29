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
    # per-project settings (triage + AI Match) live in their own "Projects settings" tab, left of Queue
    Then the element with locator "[data-test='ai-tab-projects']" should be visible
    When I click element with locator "[data-test='ai-tab-projects']"
    Then the element with locator "[data-test='ai-perproject-form']" should be visible
    Then the element with locator "[data-test='ai-project-select']" should be visible

  Scenario: Triage switches are labelled to disambiguate the global master from per-project auto-triage
    # Global master switch (Settings tab): explicit label + "master switch" description
    When I go to "ai" page
    Then the element with locator "label*=Enable AI Triage" should be visible
    Then the element with locator "p*=Master switch" should be visible
    # Per-project switch lives on the Projects settings tab and only renders once a project is selected
    Given I create "1" tests with:
      """
      testName: LabelTest
      project: LabelProj
      checks:
        - checkName: LabelCheck
          filePath: files/A.png
      """
    When I click element with locator "[data-test='ai-tab-projects']"
    When I wait 5 seconds for the element with locator "[data-test='ai-project-select']" to be visible
    When I click element with locator "[data-test='ai-project-select']"
    When I wait 5 seconds for the element with locator "[role='option']" to be visible
    When I click element with locator "[role='option']"
    Then the element with locator "[data-test='ai-project-enabled']" should be visible
    Then the element with locator "label*=Auto-triage for this project" should be visible
    Then the element with locator "p*=Requires AI Triage enabled instance-wide" should be visible

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
