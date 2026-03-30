@fast-server
Feature: Tolerance threshold
      Checks that the tolerance threshold correctly controls pass/fail for image comparisons.
      Tolerance can be set via API (per-check) or on baseline settings.

      Scenario: API tolerance - diff within threshold passes
            Given I create "1" tests with:
                  """
                  testName: TolWithinAPI
                  checks:
                    - checkName: CheckTol
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckTol"

            Given I create "1" tests with:
                  """
                  testName: TolWithinAPI
                  checks:
                    - checkName: CheckTol
                      filePath: files/low_diff_1.png
                      toleranceThreshold: 50
                  """
            Then I expect via http 1st check filtered as "name=CheckTol" matched:
                  """
          name: CheckTol
          status: [passed]
                  """

      Scenario: API tolerance - diff exceeds threshold fails
            Given I create "1" tests with:
                  """
                  testName: TolExceedAPI
                  checks:
                    - checkName: CheckExceed
                      filePath: files/A.png
                  """
            When I accept via http the 1st check with name "CheckExceed"

            Given I create "1" tests with:
                  """
                  testName: TolExceedAPI
                  checks:
                    - checkName: CheckExceed
                      filePath: files/B.png
                      toleranceThreshold: 0.01
                  """
            Then I expect via http 1st check filtered as "name=CheckExceed" matched:
                  """
          name: CheckExceed
          status: [failed]
          failReasons: [different_images]
                  """

      Scenario: No tolerance - any diff fails
            Given I create "1" tests with:
                  """
                  testName: TolNone
                  checks:
                    - checkName: CheckNone
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckNone"

            Given I create "1" tests with:
                  """
                  testName: TolNone
                  checks:
                    - checkName: CheckNone
                      filePath: files/low_diff_1.png
                  """
            Then I expect via http 1st check filtered as "name=CheckNone" matched:
                  """
          name: CheckNone
          status: [failed]
          failReasons: [different_images]
                  """

      Scenario: Baseline tolerance - diff within threshold passes
            Given I create "1" tests with:
                  """
                  testName: TolBaseline
                  checks:
                    - checkName: CheckBL
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckBL"
            And I set via http baseline "CheckBL" tolerance to 50

            Given I create "1" tests with:
                  """
                  testName: TolBaseline
                  checks:
                    - checkName: CheckBL
                      filePath: files/low_diff_1.png
                  """
            Then I expect via http 1st check filtered as "name=CheckBL" matched:
                  """
          name: CheckBL
          status: [passed]
                  """

      Scenario: API tolerance overrides baseline tolerance
            Given I create "1" tests with:
                  """
                  testName: TolOverride
                  checks:
                    - checkName: CheckOvr
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckOvr"
            And I set via http baseline "CheckOvr" tolerance to 50

            Given I create "1" tests with:
                  """
                  testName: TolOverride
                  checks:
                    - checkName: CheckOvr
                      filePath: files/low_diff_1.png
                      toleranceThreshold: 0.0001
                  """
            Then I expect via http 1st check filtered as "name=CheckOvr" matched:
                  """
          name: CheckOvr
          status: [failed]
          failReasons: [different_images]
                  """
