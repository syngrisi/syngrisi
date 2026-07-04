@fast-server @integration
Feature: Checks filtered by baselineId (Delete Baseline modal "N checks" link)
  The Delete Baseline modal's "N checks" link opens the checks list filtered by the baseline's
  snapshot id (GET /v1/checks?filter={"baselineId":"<id>"}). API-driven only - no UI navigation
  here (see docs/agent notes: UI-page navigation e2e can't run from a `.claude/worktrees` checkout).

  Scenario: Checks that reuse an accepted baseline are found by an exact baselineId filter
    Given I create "1" tests with:
      """
      testName: BaselineLinkTest1
      project: BaselineLinkApp
      branch: main
      checks:
        - checkName: BaselineLinkCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BaselineLinkCheck"

    Given I create "1" tests with:
      """
      testName: BaselineLinkTest2
      project: BaselineLinkApp
      branch: main
      checks:
        - checkName: BaselineLinkCheck
          filePath: files/A.png
      """

    Then I expect via http checks referencing the baseline of check "BaselineLinkCheck" count to be at least "2"
