@integration @smoke
Feature: VRS Server running
  Scenario: VRS web server start/stop
    Given I stop the Syngrisi server
    When I start Server
    When I open the app

    Then the title is "Syngrisi list of checks - all suites"
