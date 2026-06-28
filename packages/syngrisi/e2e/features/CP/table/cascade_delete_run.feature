@fast-server
Feature: Cascade delete run

  Deleting a run must cascade to its tests, checks and snapshots.
  Backend cascade lives in run.service -> test.service -> check.service.

  Background:
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Deleting a run removes its tests, checks and snapshots
    When I create "1" tests with:
      """
        testName: CascadeTest
        runName: CascadeRun
        suiteName: CascadeSuite
        checks:
          - filePath: files/A.png
            checkName: CascadeCheck
      """

    # Everything exists before deletion
    Then I expect via http that "CascadeRun" run exist exactly "1" times
    Then I expect via http that "CascadeTest" test exist exactly "1" times
    Then I expect via http that "CascadeCheck" check exist exactly "1" times

    # Delete the run via API
    When I delete via http run with name "CascadeRun"

    # The run and everything beneath it is gone
    Then I expect via http that "CascadeRun" run exist exactly "0" times
    Then I expect via http that "CascadeTest" test exist exactly "0" times
    Then I expect via http that "CascadeCheck" check exist exactly "0" times
    Then I expect via http that "CascadeCheck" snapshot exist exactly "0" times
