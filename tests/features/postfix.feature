@integration
Feature: VRS Postfix

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: VRS ViewPort - postfix
    When I set env variables:
    """
      ENV_POSTFIX: Integration
    """
    Given I set window size: "712x970"
    Given I start session with parameters:
    """
      testName: "Postfix integration test"
    """
    When I open the url "http://<serverDomain>:<serverPort>/static/app_1.html"
    When I visually check page as "postfix check"

    When I stop session
    When I open the app
    When I wait for "2" seconds
    Then I expect that VRS test "Postfix integration test" has "MacIntel_Integration" platform

