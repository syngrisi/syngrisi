@fast-server @mode:serial
Feature: Plugin System Initialization

  This feature tests that the plugin system initializes correctly
  and plugins are loaded based on configuration.

  @smoke @plugin
  Scenario: Server starts with no plugins enabled
    When I set env variables:
      """
      SYNGRISI_PLUGINS_ENABLED: ""
      """
    Given I create "1" tests with:
      """
          testName: NoPluginTest
          checks:
            - checkName: TestCheck
              filePath: files/a.png
      """
    Then I expect via http 1st check filtered as "name=TestCheck" matched:
      """
          name: TestCheck
          status: [new]
      """

  @plugin
  Scenario: Server starts with custom-check-validator plugin
    When I set env variables:
      """
      SYNGRISI_PLUGINS_ENABLED: custom-check-validator
      CHECK_MISMATCH_THRESHOLD: 1.0
      """
    Given I create "1" tests with:
      """
          testName: WithPluginTest
          checks:
            - checkName: PluginCheck
              filePath: files/a.png
      """
    Then I expect via http 1st check filtered as "name=PluginCheck" matched:
      """
          name: PluginCheck
          status: [new]
      """
