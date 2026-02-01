@smoke @fast-server @mode:serial
Feature: CLI Tasks

  Background:
  # Server is managed by @fast-server hook automatically

  Scenario: CLI - Handle Database Consistency [statistics only]
    When I create "1" tests with params:
      """
      run: RunName
      suite: SuiteName
      testName: TestName
      checkName: CheckName
      """
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
    When I run CLI task "consistency" with args ""
    Then I expect exact "2" snapshot files

  Scenario: CLI - Handle Database Consistency [clean]
    When I create "1" tests with params:
      """
      run: RunName
      suite: SuiteName
      testName: TestName
      checkName: CheckName
      """
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
    When I run CLI task "consistency" with args "--clean --yes"
    Then I expect exact "1" snapshot files

  Scenario: CLI - Handle Old Checks [statistics only]
    Given I stop Server
    When I clear database
    Given I start Server

    When I create "1" tests with:
      """
      testName: TestName
      checks:
        - checkName: unaccepted
          filePath: files/A.png
      """
    When I update via http check with params:
      """
      createdDate: <currentDate-10>
      """
    Then I expect via http that "unaccepted" check exist exactly "1" times
    Then I expect via http that "unaccepted" snapshot exist exactly "1" times
    Then I expect exact "1" snapshot files

    When I run CLI task "old-checks" with args "--days 9"

    Then I expect via http that "unaccepted" check exist exactly "1" times
    Then I expect via http that "unaccepted" snapshot exist exactly "1" times
    Then I expect exact "1" snapshot files

  Scenario: CLI - Handle Old Checks [remove]
    # Ensure clean state for this test
    Given I stop Server
    When I clear database
    Given I start Server

    When I create "1" tests with:
      """
      testName: TestName
      checks:
        - checkName: unaccepted
          filePath: files/A.png
      """
    When I update via http check with params:
      """
      createdDate: <currentDate-10>
      """
    Then I expect via http that "unaccepted" check exist exactly "1" times
    Then I expect via http that "unaccepted" snapshot exist exactly "1" times
    Then I expect exact "1" snapshot files

    When I run CLI task "old-checks" with args "--days 9 --remove"

    Then I expect via http that "unaccepted" check exist exactly "0" times
    Then I expect via http that "unaccepted" snapshot exist exactly "0" times
    Then I expect exact "0" snapshot files

  Scenario: CLI - Handle Old Checks [positional arguments]
    When I create "1" tests with:
      """
      testName: TestName
      checks:
        - checkName: unaccepted
          filePath: files/A.png
      """
    When I update via http check with params:
      """
      createdDate: <currentDate-10>
      """
    Then I expect via http that "unaccepted" check exist exactly "1" times
    Then I expect exact "1" snapshot files

    When I run CLI task "old-checks" with args "9 true"

    Then I expect via http that "unaccepted" check exist exactly "0" times
    Then I expect exact "0" snapshot files
