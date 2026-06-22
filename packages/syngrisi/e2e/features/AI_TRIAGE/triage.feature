@fast-server
Feature: AI Triage verdicts and per-project auto-accept
  AI classifies failed checks (verdict + confidence + reason). In suggest mode it only
  annotates; in auto mode it accepts safe verdicts per-project above a threshold.

  @smoke
  Scenario: Failed check gets a verdict in suggest mode
    Given I create "1" tests with:
      """
      testName: TriageSuggestTest
      project: TriageSuggest
      checks:
        - checkName: SuggestCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "SuggestCheck"
    Given I create "1" tests with:
      """
      testName: TriageSuggestTest
      project: TriageSuggest
      checks:
        - checkName: SuggestCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
        fakeReason: dynamic banner
      enabled: true
      """
    When I run AI triage for the 1st check named "SuggestCheck"
    # verdict recorded, and NOT auto-accepted (no auto policy) → still failed
    Then I expect via http 1st check filtered as "name=SuggestCheck" matched:
      """
      name: SuggestCheck
      status: [failed]
      triage:
        verdict: noise
        confidence: 9
        reason: dynamic banner
      """

  Scenario: Verdict badge is visible in the UI
    Given I create "1" tests with:
      """
      testName: TriageBadgeTest
      project: TriageBadge
      checks:
        - checkName: BadgeCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BadgeCheck"
    Given I create "1" tests with:
      """
      testName: TriageBadgeTest
      project: TriageBadge
      checks:
        - checkName: BadgeCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: likely_bug
        fakeConfidence: 8
        fakeReason: layout shifted
      enabled: true
      """
    When I run AI triage for the 1st check named "BadgeCheck"
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TriageBadgeTest']" to be visible
    When I unfold the test "TriageBadgeTest"
    Then the element with locator "[data-triage-verdict='likely_bug']" should be visible

  Scenario: Re-run triage from the check toolbar updates the verdict
    Given I create "1" tests with:
      """
      testName: TriageToolbarTest
      project: TriageToolbar
      checks:
        - checkName: ToolbarCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "ToolbarCheck"
    Given I create "1" tests with:
      """
      testName: TriageToolbarTest
      project: TriageToolbar
      checks:
        - checkName: ToolbarCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
      enabled: true
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TriageToolbarTest']" to be visible
    When I unfold the test "TriageToolbarTest"
    When I open the 1st check "ToolbarCheck"
    Then the element with locator "[data-test='triage-run-button']" should be visible
    When I click element with locator "[data-test='triage-run-button']"
    Then the element with locator "[data-triage-verdict='noise']" should be visible

  Scenario: Clicking a verdict badge filters checks to that verdict
    # Test 1 → noise
    Given I create "1" tests with:
      """
      testName: FNoiseTest
      project: TriageFilter
      checks:
        - checkName: FNoiseCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "FNoiseCheck"
    Given I create "1" tests with:
      """
      testName: FNoiseTest
      project: TriageFilter
      checks:
        - checkName: FNoiseCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
      enabled: true
      """
    When I run AI triage for the 1st check named "FNoiseCheck"
    # Test 2 → likely_bug
    Given I create "1" tests with:
      """
      testName: FBugTest
      project: TriageFilter
      checks:
        - checkName: FBugCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "FBugCheck"
    Given I create "1" tests with:
      """
      testName: FBugTest
      project: TriageFilter
      checks:
        - checkName: FBugCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: likely_bug
        fakeConfidence: 8
      enabled: true
      """
    When I run AI triage for the 1st check named "FBugCheck"
    # Both verdicts visible, then filter to noise
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='FNoiseTest']" to be visible
    When I unfold the test "FNoiseTest"
    When I unfold the test "FBugTest"
    Then the element with locator "[data-triage-verdict='noise']" should be visible
    Then the element with locator "[data-triage-verdict='likely_bug']" should be visible
    When I click element with locator "[data-triage-verdict='noise']"
    Then the element with locator "[data-triage-verdict='noise']" should be visible
    Then the element with locator "[data-triage-verdict='likely_bug']" should be hidden

  Scenario: Filter checks by minimum confidence
    Given I create "1" tests with:
      """
      testName: HighConfTest
      project: TriageConf
      checks:
        - checkName: HighConfCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "HighConfCheck"
    Given I create "1" tests with:
      """
      testName: HighConfTest
      project: TriageConf
      checks:
        - checkName: HighConfCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 10
      enabled: true
      """
    When I run AI triage for the 1st check named "HighConfCheck"
    Given I create "1" tests with:
      """
      testName: LowConfTest
      project: TriageConf
      checks:
        - checkName: LowConfCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "LowConfCheck"
    Given I create "1" tests with:
      """
      testName: LowConfTest
      project: TriageConf
      checks:
        - checkName: LowConfCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 3
      enabled: true
      """
    When I run AI triage for the 1st check named "LowConfCheck"
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='HighConfTest']" to be visible
    When I unfold the test "HighConfTest"
    When I unfold the test "LowConfTest"
    When I click element with locator "[data-test='triage-filter-button']"
    When I fill "8" into element with label "Min confidence"
    When I click element with locator "[data-test='triage-filter-apply']"
    Then the element with locator "[data-check='HighConfCheck']" should be visible
    Then the element with locator "[data-check='LowConfCheck']" should be hidden

  Scenario: Filter checks by reason substring
    Given I create "1" tests with:
      """
      testName: BannerTest
      project: TriageReason
      checks:
        - checkName: BannerCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BannerCheck"
    Given I create "1" tests with:
      """
      testName: BannerTest
      project: TriageReason
      checks:
        - checkName: BannerCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
        fakeReason: dynamic banner
      enabled: true
      """
    When I run AI triage for the 1st check named "BannerCheck"
    Given I create "1" tests with:
      """
      testName: FontTest
      project: TriageReason
      checks:
        - checkName: FontCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "FontCheck"
    Given I create "1" tests with:
      """
      testName: FontTest
      project: TriageReason
      checks:
        - checkName: FontCheck
          filePath: files/B.png
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
        fakeReason: font changed
      enabled: true
      """
    When I run AI triage for the 1st check named "FontCheck"
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='BannerTest']" to be visible
    When I unfold the test "BannerTest"
    When I unfold the test "FontTest"
    When I click element with locator "[data-test='triage-filter-button']"
    When I fill "banner" into element with label "Reason contains"
    When I click element with locator "[data-test='triage-filter-apply']"
    Then the element with locator "[data-check='BannerCheck']" should be visible
    Then the element with locator "[data-check='FontCheck']" should be hidden

  Scenario: Auto-accept applies per project above threshold
    Given I create "1" tests with:
      """
      testName: TriageAutoTest
      project: TriageWeb
      checks:
        - checkName: AutoCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "AutoCheck"
    Given I create "1" tests with:
      """
      testName: TriageAutoTest
      project: TriageWeb
      checks:
        - checkName: AutoCheck
          filePath: files/B.png
      """
    Given the project "TriageWeb" has triage policy "auto" threshold 9 verdicts "intended_change,noise"
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 10
      enabled: true
      """
    When I run AI triage for the 1st check named "AutoCheck"
    Then I expect via http 1st check filtered as "name=AutoCheck" matched:
      """
      name: AutoCheck
      markedAs: accepted
      triage:
        verdict: noise
        autoAccepted: true
      """

  Scenario: Verdict below threshold is left for a human
    Given I create "1" tests with:
      """
      testName: TriageBelowTest
      project: TriageBelow
      checks:
        - checkName: BelowCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BelowCheck"
    Given I create "1" tests with:
      """
      testName: TriageBelowTest
      project: TriageBelow
      checks:
        - checkName: BelowCheck
          filePath: files/B.png
      """
    Given the project "TriageBelow" has triage policy "auto" threshold 9 verdicts "intended_change,noise"
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: intended_change
        fakeConfidence: 7
      enabled: true
      """
    When I run AI triage for the 1st check named "BelowCheck"
    Then I expect via http 1st check filtered as "name=BelowCheck" matched:
      """
      name: BelowCheck
      status: [failed]
      triage:
        verdict: intended_change
        confidence: 7
      """

  Scenario: likely_bug is never auto-accepted
    Given I create "1" tests with:
      """
      testName: TriageBugTest
      project: TriageBug
      checks:
        - checkName: BugCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BugCheck"
    Given I create "1" tests with:
      """
      testName: TriageBugTest
      project: TriageBug
      checks:
        - checkName: BugCheck
          filePath: files/B.png
      """
    Given the project "TriageBug" has triage policy "auto" threshold 9 verdicts "intended_change,noise,likely_bug"
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: likely_bug
        fakeConfidence: 10
      enabled: true
      """
    When I run AI triage for the 1st check named "BugCheck"
    Then I expect via http 1st check filtered as "name=BugCheck" matched:
      """
      name: BugCheck
      status: [failed]
      triage:
        verdict: likely_bug
      """
