@fast-server
Feature: Baseline "time machine" - history slider over a check's accepted baselines
  A check's accepted baselines form a visual timeline (Baseline docs, ordered by createdDate).
  GET /v1/baselines/history returns that ordered timeline for one check ident, and
  POST /v1/baselines/history-summary optionally describes the change between two baselines via
  the configured AI triage provider (degrading to a plain slider when no provider is configured).
  API-driven only - no UI assertions here (see docs/TIME_MACHINE.md for the UI entry point).

  Scenario: History returns the ordered accepted-baseline timeline for one check ident
    Given I create "1" tests with:
      """
      testName: HistoryTest
      project: HistoryApp
      checks:
        - checkName: HistoryCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "HistoryCheck"
    Given I create "1" tests with:
      """
      testName: HistoryTest
      project: HistoryApp
      checks:
        - checkName: HistoryCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "HistoryCheck"
    When I fetch via http baseline history for check "HistoryCheck"
    Then the baseline history should have 2 items ordered by date

  Scenario: Summary endpoint degrades to slider-only without a configured provider
    Given I create "1" tests with:
      """
      testName: SummaryTest
      project: SummaryApp
      checks:
        - checkName: SummaryCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "SummaryCheck"
    Given I create "1" tests with:
      """
      testName: SummaryTest
      project: SummaryApp
      checks:
        - checkName: SummaryCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "SummaryCheck"
    When I fetch via http baseline history for check "SummaryCheck"
    Then the baseline history should have 2 items ordered by date
    When I request the baseline history summary for the last two history items
    Then the baseline history summary should be null with reason "no provider configured"

  Scenario: Summary endpoint returns a non-empty AI summary and caches it
    Given I create "1" tests with:
      """
      testName: SummaryCacheTest
      project: SummaryCacheApp
      checks:
        - checkName: SummaryCacheCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "SummaryCacheCheck"
    Given I create "1" tests with:
      """
      testName: SummaryCacheTest
      project: SummaryCacheApp
      checks:
        - checkName: SummaryCacheCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "SummaryCacheCheck"
    When I update via http setting "ai_triage_provider" with params:
      """
      value:
        type: fake
        fakeReason: header redesigned with a new logo
      enabled: true
      """
    When I fetch via http baseline history for check "SummaryCacheCheck"
    Then the baseline history should have 2 items ordered by date
    When I request the baseline history summary for the last two history items
    Then the baseline history summary should be a non-empty string
    When I request the baseline history summary for the last two history items
    Then the baseline history summary should be cached
