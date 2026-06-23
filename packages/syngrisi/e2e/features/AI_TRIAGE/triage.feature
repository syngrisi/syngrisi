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
    # the test whose only check does not match the verdict is hidden entirely, not left empty
    Then the element with locator "[data-table-test-name='FBugTest']" should be hidden
    Then the element with locator "[data-table-test-name='FNoiseTest']" should be visible
    # multi-select: add likely_bug via the filter popover → both tests come back
    When I click element with locator "[data-test='triage-filter-button']"
    When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
    When I click element with locator "[data-test='triage-filter-verdict-likely_bug']"
    When I click element with locator "[data-test='triage-filter-apply']"
    When I wait 10 seconds for the element with locator "[data-table-test-name='FBugTest']" to be visible
    # both tests stay unfolded (collapse state is retained), so both verdicts are visible again
    Then the element with locator "[data-triage-verdict='noise']" should be visible
    Then the element with locator "[data-triage-verdict='likely_bug']" should be visible

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

  Scenario: Group tests by AI Verdict
    Given I create "1" tests with:
      """
      testName: VgNoiseTest
      project: TriageGroup
      checks:
        - checkName: VgNoiseCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "VgNoiseCheck"
    Given I create "1" tests with:
      """
      testName: VgNoiseTest
      project: TriageGroup
      checks:
        - checkName: VgNoiseCheck
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
    When I run AI triage for the 1st check named "VgNoiseCheck"
    Then I expect via http 1st test filtered as "name=VgNoiseTest" matched:
      """
      name: VgNoiseTest
      worstTriageVerdict: noise
      """
    Given I create "1" tests with:
      """
      testName: VgBugTest
      project: TriageGroup
      checks:
        - checkName: VgBugCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "VgBugCheck"
    Given I create "1" tests with:
      """
      testName: VgBugTest
      project: TriageGroup
      checks:
        - checkName: VgBugCheck
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
    When I run AI triage for the 1st check named "VgBugCheck"
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='VgNoiseTest']" to be visible
    When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
    When I wait 30 seconds for the element with locator "//li[contains(., 'noise')]" to be visible
    When I click element with locator "li*=noise"
    When I wait 10 seconds for the element with locator "[data-table-test-name='VgNoiseTest']" to be visible
    When I wait on element "[data-table-test-name='VgBugTest']" to not be displayed

  @env:SYNGRISI_AI_TRIAGE_ENABLED:true @env:SYNGRISI_AI_TRIAGE_POLL_INTERVAL_MS:2000
  Scenario: Background triage runs only for projects where it is enabled
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 9
      enabled: true
      """
    Given I create "1" tests with:
      """
      testName: EnabledProjTest
      project: TriageEnabledProj
      checks:
        - checkName: EnabledCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "EnabledCheck"
    Given I create "1" tests with:
      """
      testName: EnabledProjTest
      project: TriageEnabledProj
      checks:
        - checkName: EnabledCheck
          filePath: files/B.png
      """
    Given I create "1" tests with:
      """
      testName: DisabledProjTest
      project: TriageDisabledProj
      checks:
        - checkName: DisabledCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "DisabledCheck"
    Given I create "1" tests with:
      """
      testName: DisabledProjTest
      project: TriageDisabledProj
      checks:
        - checkName: DisabledCheck
          filePath: files/B.png
      """
    # Enable triage only for the first project; the scheduler should pick up only its check.
    Given I enable AI triage for the project "TriageEnabledProj"
    Then I expect via http 1st check filtered as "name=EnabledCheck" matched:
      """
      name: EnabledCheck
      triage:
        verdict: noise
      """
    # The other project stays off by default → never triaged
    Then the 1st check named "DisabledCheck" has no AI verdict

  Scenario: A project can define and use custom verdicts
    Given I create "1" tests with:
      """
      testName: CustomVerdictTest
      project: TriageCustom
      checks:
        - checkName: CustomCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "CustomCheck"
    Given I create "1" tests with:
      """
      testName: CustomVerdictTest
      project: TriageCustom
      checks:
        - checkName: CustomCheck
          filePath: files/B.png
      """
    Given I set custom triage verdicts for project "TriageCustom":
      """
      - { key: flaky_render, label: Flaky render, color: orange, icon: flag, severity: 2, autoAcceptable: true }
      - { key: real_defect, label: Real defect, color: red, severity: 5, autoAcceptable: false, neverAutoAccept: true }
      - { key: unsure, label: Unsure, color: gray, severity: 1, autoAcceptable: false, neverAutoAccept: true, isFallback: true }
      """
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: flaky_render
        fakeConfidence: 9
        fakeReason: dynamic chart redraw
      enabled: true
      """
    When I run AI triage for the 1st check named "CustomCheck"
    # The custom verdict is recorded with its denormalized label/color
    Then I expect via http 1st check filtered as "name=CustomCheck" matched:
      """
      name: CustomCheck
      triage:
        verdict: flaky_render
        label: Flaky render
        color: orange
        icon: flag
        confidence: 9
      """

  Scenario: Low-confidence verdict is shown as Unknown (threshold masking)
    Given I create "1" tests with:
      """
      testName: ThreshTest
      project: TriageThresh
      checks:
        - checkName: ThreshCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "ThreshCheck"
    Given I create "1" tests with:
      """
      testName: ThreshTest
      project: TriageThresh
      checks:
        - checkName: ThreshCheck
          filePath: files/B.png
      """
    Given the project "TriageThresh" has triage policy "suggest" threshold 9 verdicts "intended_change,noise"
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeVerdict: noise
        fakeConfidence: 5
      enabled: true
      """
    When I run AI triage for the 1st check named "ThreshCheck"
    # confidence 5 < threshold 9 -> effective verdict is the reserved 'unknown', raw kept
    Then I expect via http 1st check filtered as "name=ThreshCheck" matched:
      """
      name: ThreshCheck
      triage:
        verdict: unknown
        rawVerdict: noise
        confidence: 5
      """

  Scenario: Failed check awaiting analysis is marked pending
    Given I create "1" tests with:
      """
      testName: PendingTest
      project: TriagePending
      checks:
        - checkName: PendingCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "PendingCheck"
    Given I enable AI triage for the project "TriagePending"
    Given I create "1" tests with:
      """
      testName: PendingTest
      project: TriagePending
      checks:
        - checkName: PendingCheck
          filePath: files/B.png
      """
    # failed-with-diff check in an enabled project is stamped pending until classified
    Then I expect via http 1st check filtered as "name=PendingCheck" matched:
      """
      name: PendingCheck
      status: [failed]
      triage:
        pending: true
      """
    # Note: the in-progress UI badge ([data-triage-pending='true']) is transient — the background
    # scheduler classifies the check shortly after, so it's demonstrated in the DEMO test instead.

  Scenario: Test connection validates the provider and returns a verdict
    When I test the triage provider connection with a fake provider

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
    # and the UI marks it "Accepted by AI"
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TriageAutoTest']" to be visible
    When I unfold the test "TriageAutoTest"
    Then the element with locator "[data-triage-auto-accepted='true']" should be visible

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
    # below the threshold -> shown as the reserved 'unknown' (real verdict kept as rawVerdict), not auto-accepted
    Then I expect via http 1st check filtered as "name=BelowCheck" matched:
      """
      name: BelowCheck
      status: [failed]
      triage:
        verdict: unknown
        rawVerdict: intended_change
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
