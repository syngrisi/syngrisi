@integration
Feature: VRS Server running
  Scenario: VRS web server start/stop
    Given I kill process which used port: "3001"
    When I start VRS server with parameters:
    """
      port: 3001
      databaseName: VRSdbTest
      baseLineFolder: baselinesTest
    """
    When I open the url "http://vrs:3001/"

    Then the title is "VRS list of checks - all suites"
