@integration
Feature: VRS One Suite, One test, One check

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

  @withoutEndSession
  Scenario: VRS create new check - without session ending
    Given I set window size: "1200x790"
    Given I start VRS session with parameters:
    """
      testName: "Without session ending"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check"
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=Without session ending" for "3" seconds to exist
    Then I expect that VRS test "Without session ending" has "Running" status
    Then I expect that VRS test "Without session ending" has "chrome" browser
    Then I expect that VRS test "Without session ending" has "1200x790" viewport

    When I click on "Without session ending" VRS test
    Then I expect that VRS test "Without session ending" is unfolded
    Then I expect that VRS check "1/1 new_int_check" has "New" status

  @withEndSession
  Scenario: VRS create new check - with session ending
    Given I set window size: "1366x768"
    Given I start VRS session with parameters:
    """
      appName: "Integration Test App"
      testName: "With session ending"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 2"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=With session ending" for "3" seconds to exist
    Then I expect that VRS test "With session ending" has "New" status
    Then I expect that VRS test "With session ending" has "chrome" browser
    Then I expect that VRS test "With session ending" has "1366x768" viewport

    When I click on "With session ending" VRS test
    Then I expect that VRS test "With session ending" is unfolded
    Then I expect that VRS check "1/1 new_int_check_2" has "New" status

  @newPassed
  Scenario: VRS create new check - passed
    Given I set window size: "1366x768"

    Given I start VRS session with parameters:
    """
      testName: "Passed test"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 3"
    When I stop VRS session
    Given I start VRS session with parameters:
    """
      testName: "Passed test"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 3"
    When I stop VRS session
#
    When I open the url "http://vrs:3001/"

    Then I wait and refresh page on element "span=Passed" for "3" seconds to exist
    Then I expect that 1th VRS test "Passed test" has "Passed" status
    Then I expect that 1th VRS test "Passed test" has "chrome" browser
    Then I expect that 1th VRS test "Passed test" has "1366x768" viewport

    Then I expect that 2th VRS test "Passed test" has "New" status

    When I click on "Passed test" VRS test
    Then I expect that VRS test "Passed test" is unfolded
    Then I expect that VRS check "1/1 new_int_check_3" has "Passed" status

  Scenario: VRS create new check - failed after new
    Given I set window size: "1366x768"

    Given I start VRS session with parameters:
    """
      testName: "Failed test"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 4"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: "Failed test"
    """
    When I check image with path: "vrs/tests/files/B.png" as "new int check 4"
    When I stop VRS session

    When I open the url "http://vrs:3001/"

    Then I wait and refresh page on element "span=Failed" for "3" seconds to exist
    Then I expect that 1th VRS test "Failed test" has "Failed" status
    Then I expect that 1th VRS test "Failed test" has "chrome" browser
    Then I expect that 1th VRS test "Failed test" has "1366x768" viewport

    Then I expect that 2th VRS test "Failed test" has "New" status

    When I click on "Failed test" VRS test
    Then I expect that VRS test "Failed test" is unfolded
    Then I expect that VRS check "1/1 new_int_check_4" has "Failed" status

  Scenario: VRS create new check - failed after success
    Given I set window size: "1366x768"

    Given I start VRS session with parameters:
    """
      testName: "Failed test"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 5"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: "Failed test"
    """
    When I check image with path: "vrs/tests/files/A.png" as "new int check 5"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: "Failed test"
    """
    When I check image with path: "vrs/tests/files/B.png" as "new int check 5"
    When I stop VRS session

    When I open the url "http://vrs:3001/"

    Then I wait and refresh page on element "span=Failed" for "3" seconds to exist
    Then I expect that 1th VRS test "Failed test" has "Failed" status
    Then I expect that 1th VRS test "Failed test" has "chrome" browser
    Then I expect that 1th VRS test "Failed test" has "1366x768" viewport

    Then I expect that 2th VRS test "Failed test" has "Passed" status

    When I click on "Failed test" VRS test
    Then I expect that VRS test "Failed test" is unfolded
    Then I expect that VRS check "1/1 new_int_check_5" has "Failed" status

