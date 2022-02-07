@integration @smoke
Feature: VRS Server running
  Scenario: VRS web server start/stop
    Given I stop the Syngrisi server
    When I start VRS server with parameters:
    """
      port: 3001
      databaseName: VRSdbTest
      baseLineFolder: baselinesTest
    """
    When I open the app

    Then the title is "Syngrisi list of checks - all suites"
