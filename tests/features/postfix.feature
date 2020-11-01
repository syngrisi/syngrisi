@integration
Feature: VRS Postfix

  Background:
    Given I clear test VRS database
    Given I kill process which used port: "3001"
    Given I start VRS server with parameters:
    """
      port: 3001
      databaseName: VRSdbTest
      baseLineFolder: ./baselinesTest/
    """
    Given I setup VRS driver with parameters:
    """
      url: "http://vrs:3001/"
    """

  Scenario: VRS ViewPort - postfix
    When I set env variables:
    """
    ENV_POSTFIX: Integration
    """
    Given I set window size: "712x970"
    Given I start VRS session with parameters:
    """
      testName: "Postfix integration test"
    """
    When I open the url "http://vrs:3001/static/app_1.html"
    When I visually check page as "postfix check"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I expect that VRS test "Postfix integration test" has "_Integration" platform

