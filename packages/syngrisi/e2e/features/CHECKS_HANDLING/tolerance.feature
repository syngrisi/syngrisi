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

      @ui
      Scenario: UI baseline tolerance accepts small decimal values
            When I set env variables:
                  """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
                  """
            Given I start Server and start Driver
            And I clear database
            And I create "1" tests with:
                  """
                  testName: TolUI
                  checks:
                    - checkName: CheckTolUI
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckTolUI"

            Given I create "1" tests with:
                  """
                  testName: TolUI
                  checks:
                    - checkName: CheckTolUI
                      filePath: files/low_diff_1.png
                  """
            When I go to "main" page
            And I wait for test "TolUI" to appear in table
            And I unfold the test "TolUI"
            And I wait for check "CheckTolUI" to appear in collapsed row of test "TolUI"
            And I open the 1st check "CheckTolUI"
            Then I should see the check details for "CheckTolUI"
            And the element with locator "[data-check='match-type-selector']" should be enabled

            When I click element with locator "[data-check='match-type-selector']"
            And I set "0.0001" to the inputfield "[data-check='tolerance-threshold-input']"
            Then the element with locator "[data-check='tolerance-threshold-input']" should have value "0.0001"
            When I click element with locator "[data-check='tolerance-save']"
            And I wait up to 20 seconds for element "[data-check='tolerance-indicator']" to contain text "0.0001"
