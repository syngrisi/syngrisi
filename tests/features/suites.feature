@integration
Feature: Suites

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  @withEndSession
  Scenario: VRS create check - with empty suite
    Given I start session with parameters:
    """
      testName: Unnamed Suite Test
      suiteName: EMPTY
    """
    When I check image with path: "files/A.png" as "new int check suites 1"

    When I stop session
    When I open the app
    Then I wait and refresh page on element "span=Unnamed Suite Test" for "3" seconds to exist
    When I click on the element "span=Others"
    When I wait for "3" seconds
    Then I expect that element "span=Unnamed Suite Test" is displayed

  @withEndSession
  Scenario: VRS create check - with suite
    Given I start session with parameters:
    """
      testName: Named Suite Test
      suiteName: NotEmptySuite
    """
    When I check image with path: "files/A.png" as "new int check suites 1"

    When I stop session
    When I open the app
    Then I expect that element "span=NotEmptySuite" is displayed
    Then I wait and refresh page on element "span=Named Suite Test" for "3" seconds to exist
    When I click on the element "span=NotEmptySuite"
    When I wait for "2" seconds
    Then I expect that element "span=Named Suite Test" is displayed
