@fast-server
Feature: Task - Remove old baselines

  Background:
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
      SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS: 1000
      SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS: 1000
      SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE: true
      """
    Given I start Server
    When I create via http test user

    Given I stop the Syngrisi server
    When I wait 5 seconds
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: true
      SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS: 1000
      SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS: 1000
      SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE: true
      """
    Given I start Server

    When I login via http with user:"Test" password "123456aA-"
    When I generate via http API key for the User
    When I set the API key in config
    When I start Driver

  @smoke
  Scenario: AND rule removes only old baselines outside keepLast
    # 3 accepted baselines for one identity; keepLast=2, days=120
    # → only the oldest (rank 2) that is 150d old is removed
    When I create "1" tests with:
      """
      testName: BlRetention
      checks:
        - checkName: RetCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "RetCheck"

    When I create "1" tests with:
      """
      testName: BlRetention
      checks:
        - checkName: RetCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "RetCheck"

    When I create "1" tests with:
      """
      testName: BlRetention
      checks:
        - checkName: RetCheck
          filePath: files/C.png
      """
    When I accept via http the 1st check with name "RetCheck"

    Then I expect via http that baselines named "RetCheck" exist exactly "3" times

    # Backdate the two oldest; newest stays fresh
    When I update via http the oldest "2" baselines named "RetCheck" with params:
      """
      createdDate: <currentDate-150>
      """

    When I remove via http baselines older than "120" days keeping last "2"

    Then I expect via http that baselines named "RetCheck" exist exactly "2" times

  Scenario: Dry run does not delete candidates
    When I create "1" tests with:
      """
      testName: BlDryRun
      checks:
        - checkName: DryCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "DryCheck"

    When I create "1" tests with:
      """
      testName: BlDryRun
      checks:
        - checkName: DryCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "DryCheck"

    When I update via http the oldest "1" baselines named "DryCheck" with params:
      """
      createdDate: <currentDate-200>
      """

    When I dry-run via http baselines older than "120" days keeping last "1"

    Then I expect via http that baselines named "DryCheck" exist exactly "2" times

  Scenario: Hard guard - single ancient baseline is never deleted
    When I create "1" tests with:
      """
      testName: BlGuard
      checks:
        - checkName: GuardCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "GuardCheck"
    When I update via http all baselines named "GuardCheck" with params:
      """
      createdDate: <currentDate-400>
      """

    When I remove via http baselines older than "120" days keeping last "5"

    Then I expect via http that baselines named "GuardCheck" exist exactly "1" times

  Scenario: Hard guard - keepLast 0 still keeps the newest
    When I create "1" tests with:
      """
      testName: BlKeepZero
      checks:
        - checkName: KeepZero
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "KeepZero"

    When I create "1" tests with:
      """
      testName: BlKeepZero
      checks:
        - checkName: KeepZero
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "KeepZero"

    When I create "1" tests with:
      """
      testName: BlKeepZero
      checks:
        - checkName: KeepZero
          filePath: files/C.png
      """
    When I accept via http the 1st check with name "KeepZero"

    When I update via http all baselines named "KeepZero" with params:
      """
      createdDate: <currentDate-200>
      """

    # keepLast=0 is clamped to 1 → only newest survives
    When I remove via http baselines older than "120" days keeping last "0"

    Then I expect via http that baselines named "KeepZero" exist exactly "1" times

  Scenario: Beyond keepLast but young baselines are kept - AND age
    When I create "1" tests with:
      """
      testName: BlYoung
      checks:
        - checkName: YoungCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "YoungCheck"

    When I create "1" tests with:
      """
      testName: BlYoung
      checks:
        - checkName: YoungCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "YoungCheck"

    When I create "1" tests with:
      """
      testName: BlYoung
      checks:
        - checkName: YoungCheck
          filePath: files/C.png
      """
    When I accept via http the 1st check with name "YoungCheck"

    # All fresh; keepLast=1 would allow ranks 1+ by count, but age AND fails
    When I remove via http baselines older than "120" days keeping last "1"

    Then I expect via http that baselines named "YoungCheck" exist exactly "3" times

  Scenario: Old but within keepLast window is kept - AND rank
    When I create "1" tests with:
      """
      testName: BlWithin
      checks:
        - checkName: WithinCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "WithinCheck"

    When I create "1" tests with:
      """
      testName: BlWithin
      checks:
        - checkName: WithinCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "WithinCheck"

    When I update via http all baselines named "WithinCheck" with params:
      """
      createdDate: <currentDate-200>
      """

    # keepLast=5 → both ranks 0 and 1 are inside the keep window
    When I remove via http baselines older than "120" days keeping last "5"

    Then I expect via http that baselines named "WithinCheck" exist exactly "2" times

  Scenario: Identities are cleaned independently
    When I create "1" tests with:
      """
      testName: BlIdentA
      checks:
        - checkName: IdentA
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "IdentA"
    When I create "1" tests with:
      """
      testName: BlIdentA
      checks:
        - checkName: IdentA
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "IdentA"

    When I create "1" tests with:
      """
      testName: BlIdentB
      checks:
        - checkName: IdentB
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "IdentB"

    When I update via http the oldest "1" baselines named "IdentA" with params:
      """
      createdDate: <currentDate-200>
      """
    When I update via http all baselines named "IdentB" with params:
      """
      createdDate: <currentDate-200>
      """

    When I remove via http baselines older than "120" days keeping last "1"

    # IdentA: newest kept, oldest removed → 1
    Then I expect via http that baselines named "IdentA" exist exactly "1" times
    # IdentB: single baseline, hard-guard → 1
    Then I expect via http that baselines named "IdentB" exist exactly "1" times

  Scenario: Non-accepted baselines are not removed
    When I create "1" tests with:
      """
      testName: BlBug
      checks:
        - checkName: BugCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "BugCheck"

    When I create "1" tests with:
      """
      testName: BlBug
      checks:
        - checkName: BugCheck
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "BugCheck"

    # Mark oldest as bug (out of accepted scope), backdate both
    When I mark via http the oldest baseline named "BugCheck" as "bug"
    When I update via http all baselines named "BugCheck" with params:
      """
      createdDate: <currentDate-200>
      """

    When I remove via http baselines older than "120" days keeping last "1"

    # Accepted newest kept by hard-guard; bug baseline ignored by task → still 2
    Then I expect via http that baselines named "BugCheck" exist exactly "2" times

  Scenario: Auto removal scheduler removes old baselines based on settings
    When I create "1" tests with:
      """
      testName: BlAuto
      checks:
        - checkName: AutoBl
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "AutoBl"

    When I create "1" tests with:
      """
      testName: BlAuto
      checks:
        - checkName: AutoBl
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "AutoBl"

    When I update via http the oldest "1" baselines named "AutoBl" with params:
      """
      createdDate: <currentDate-200>
      """

    Then I expect via http that baselines named "AutoBl" exist exactly "2" times

    When I update via http setting "auto_remove_old_baselines" with params:
      """
      value:
        days: 120
        keepLast: 1
        lastRunAt: <currentDate-20>
      enabled: true
      """

    Then I wait up to 60 seconds via http that baselines named "AutoBl" exist exactly "1" times

  Scenario: Admin UI task removes old baselines when Dry run is disabled
    When I create "1" tests with:
      """
      testName: BlUi
      checks:
        - checkName: UiBl
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "UiBl"

    When I create "1" tests with:
      """
      testName: BlUi
      checks:
        - checkName: UiBl
          filePath: files/B.png
      """
    When I accept via http the 1st check with name "UiBl"

    When I update via http the oldest "1" baselines named "UiBl" with params:
      """
      createdDate: <currentDate-200>
      """

    When I login with user:"Test" password "123456aA-"
    When I go to "admin>old_baselines" page
    When I fill "120" into element with locator "input[name='days']"
    When I fill "1" into element with locator "input[name='keepLast']"
    When I click element with label "Dry run"
    When I click element with locator "button:has-text('Start Task')"

    Then I wait up to 30 seconds via http that baselines named "UiBl" exist exactly "1" times
