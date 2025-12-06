@smoke @fast-server
Feature: Remove Inconsistent items

  Background:
    When I create "1" tests with params:
      """
      run: RunName
      suite: SuiteName
      testName: TestName
      checkName: CheckName
      """

  Scenario: Abandoned File
    Then I expect exact "1" snapshot files
    Given I stop Server
    When I clear database
    Given I start Server

    When I create "1" tests with params:
      """
      run: RunName
      suite: SuiteName
      testName: TestName
      checkName: CheckName
      """
    Then I expect exact "2" snapshot files
    When I remove via http Inconsistent items
    Then I expect exact "1" snapshot files

  Scenario: Abandoned Snapshot, Check, Test, Suite, Run
    Then I expect exact "1" snapshot files
    Then I expect via http that "CheckName" check exist exactly "1" times
    Then I expect via http that "CheckName" check exist exactly "1" times
    Then I expect via http that "TestName - 1" test exist exactly "1" times

    When I clear screenshots folder
    Then I expect exact "0" snapshot files

    When I remove via http Inconsistent items
    Then I expect via http that "CheckName" snapshot exist exactly "0" times
    Then I expect via http that "CheckName" check exist exactly "1" times
    Then I expect via http that "TestName - 1" test exist exactly "1" times

    # when we run task second time we must get abandoned check, test, run and suite
    When I remove via http Inconsistent items
    Then I expect via http that "CheckName" check exist exactly "0" times
    Then I expect via http that "TestName - 1" test exist exactly "1" times
    Then I expect via http that "RunName" run exist exactly "1" times
    Then I expect via http that "SuiteName" suite exist exactly "1" times

    # when we run task third time we must get abandoned test, run and suite
    When I remove via http Inconsistent items
    Then I expect via http that "TestName - 1" test exist exactly "0" times
    Then I expect via http that "RunName" run exist exactly "0" times
    Then I expect via http that "SuiteName" suite exist exactly "0" times

