@fast-server
Feature: Task - Per-project retention

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

    # create user
    When I login via http with user:"Test" password "123456aA-"
    When I generate via http API key for the User
    When I set the API key in config
    When I start Driver

  @smoke
  Scenario: Per-project retention removes old checks only for the opted-in project
    When I create "1" tests with:
      """
      testName: RetentionTestA
      project: RetentionProjectA
      checks:
        - checkName: projA_old
          filePath: files/A.png
      """
    When I update via http check with params:
      """
      createdDate: <currentDate-10>
      """

    When I create "1" tests with:
      """
      testName: RetentionTestB
      project: RetentionProjectB
      checks:
        - checkName: projB_old
          filePath: files/A.png
      """
    When I update via http check with params:
      """
      createdDate: <currentDate-10>
      """

    Then I expect via http that "projA_old" check exist exactly "1" times
    Then I expect via http that "projB_old" check exist exactly "1" times

    # Only project A opts in to a short retention window; project B keeps default (no retention).
    Given the project "RetentionProjectA" has retention enabled "true" days "1"

    # Enable the instance-wide scheduler tick (large "days" so the global sweep itself
    # does not remove either check — only the per-project retention loop should).
    When I update via http setting "auto_remove_old_checks" with params:
      """
      value:
        days: 3650
        lastRunAt: null
      enabled: true
      """

    Then I wait up to 60 seconds via http that "projA_old" check exist exactly "0" times
    Then I expect via http that "projB_old" check exist exactly "1" times
