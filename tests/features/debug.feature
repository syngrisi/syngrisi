#@integration
#Feature: VRS Debug
#
#  Background:
#    Given I setup VRS driver with parameters:
#    """
#      url: "http://vrs:3001/"
#    """
#
#  Scenario: VRS match type scenario
#    Given I set window size: "1366x768"
#
#    Given I start VRS session with parameters:
#    """
#      testName: "VRS Match Type"
#      suiteName: VRS Debug
#    """
#    When I assert image with path: "files/People.png" as "new int assert_2"
#    When I stop VRS session
#
#    Given I start VRS session with parameters:
#    """
#      testName: "VRS Match Type"
#      suiteName: VRS Debug
#    """
#    When I check image with path: "files/People2.png" as "new int assert_2"
#    When I stop VRS session
