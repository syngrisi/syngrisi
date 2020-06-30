@integration
Feature: Suites

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

  @withEndSession
  Scenario: VRS create heck - with empty suite
    Given I start VRS session with parameters:
    """
      testName: Unnamed Suite Test
      suiteName: EMPTY
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check suites 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I expect that element "=Others" is displayed
    Then I wait and refresh page on element "span=Unnamed Suite Test" for "3" seconds to exist
    When I click on the element "=Others"
    Then I expect that element "span=Unnamed Suite Test" is displayed

  @withEndSession
  Scenario: VRS create heck - with suite
    Given I start VRS session with parameters:
    """
      testName: Named Suite Test
      suiteName: NotEmptySuite
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check suites 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I expect that element "=NotEmptySuite" is displayed
    Then I wait and refresh page on element "span=Named Suite Test" for "3" seconds to exist
    When I click on the element "=NotEmptySuite"
    Then I expect that element "span=Named Suite Test" is displayed
