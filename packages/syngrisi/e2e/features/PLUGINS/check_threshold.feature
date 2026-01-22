@fast-server @mode:serial
Feature: Plugin System - Check Mismatch Threshold

  This feature tests the custom-check-validator plugin that allows
  checks with mismatch percentage below a configured threshold to pass.

  Background:
    When I set env variables:
      """
      SYNGRISI_PLUGINS_ENABLED: custom-check-validator
      CHECK_MISMATCH_THRESHOLD: 0.5
      """

  @smoke @plugin
  Scenario: Check with mismatch below threshold passes
    # Create baseline
    Given I create "1" tests with:
      """
          testName: PluginThresholdTest
          checks:
            - checkName: ThresholdCheck
              filePath: files/low_diff_0.png
      """
    When I accept via http the 1st check with name "ThresholdCheck"

    # Create check with small difference (should pass due to threshold)
    Given I create "1" tests with:
      """
          testName: PluginThresholdTest
          checks:
            - checkName: ThresholdCheck
              filePath: files/low_diff_1.png
      """

    # Verify: check status changed to passed (not failed) due to threshold plugin
    Then I expect via http 1st check filtered as "name=ThresholdCheck" matched:
      """
          name: ThresholdCheck
          status: [passed]
      """

  @plugin
  Scenario: Check with mismatch above threshold fails
    # Create baseline
    Given I create "1" tests with:
      """
          testName: PluginThresholdAboveTest
          checks:
            - checkName: AboveThresholdCheck
              filePath: files/a.png
      """
    When I accept via http the 1st check with name "AboveThresholdCheck"

    # Create check with significant difference (above threshold)
    Given I create "1" tests with:
      """
          testName: PluginThresholdAboveTest
          checks:
            - checkName: AboveThresholdCheck
              filePath: files/b.png
      """

    # Verify: check status should be failed (above threshold)
    Then I expect via http 1st check filtered as "name=AboveThresholdCheck" matched:
      """
          name: AboveThresholdCheck
          status: [failed]
          failReasons: [different_images]
      """
