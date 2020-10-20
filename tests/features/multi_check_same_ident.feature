@integration
Feature: VRS Few checks with same identification
  This feature is intended to check behavior of VRS system when there is a few checks in one test with same ident
  ident is a combination of checks ['name', 'viewport', 'browserName', 'browserVersion', 'os'] the system group few checks to group with same ident

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
    Given I set window size: "1366x768"

  Scenario: VRS two passed checks with same ident - passed ident group, passed test
    # 1. One check - "New" status
    Given I start VRS session with parameters:
    """
      testName: "two passed checks"
    """

    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=two passed checks" for "3" seconds to exist
    Then I expect that VRS test "two passed checks" has "New" status

    When I click on "two passed checks" VRS test
    Then I expect that VRS check "1/1 check 1" has "New" status
    # 2. Two passed checks - "Passed" status
    Given I start VRS session with parameters:
    """
      testName: "two passed checks"
    """
    When I check image with path: "vrs/tests/files/A.png" as "check 1"
    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=two passed checks" for "3" seconds to exist
    Then I expect that VRS test "two passed checks" has "Passed" status

    When I click on "two passed checks" VRS test
    Then I expect that VRS check "1/1 (2) check 1" has "Passed" status

  Scenario: VRS two failed checks with same ident - failed ident group, failed test
    # 1. One check - "New" status
    Given I start VRS session with parameters:
    """
      testName: "two failed checks"
    """

    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=two failed checks" for "3" seconds to exist
    Then I expect that VRS test "two failed checks" has "New" status

    When I click on "two failed checks" VRS test
    Then I expect that VRS check "1/1 check 1" has "New" status
    # 2. Two failed checks - "Failed" status
    Given I start VRS session with parameters:
    """
      testName: "two failed checks"
    """
    When I check image with path: "vrs/tests/files/B.png" as "check 1"
    When I check image with path: "vrs/tests/files/B.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=two failed checks" for "3" seconds to exist
    Then I expect that VRS test "two failed checks" has "Failed" status

    When I click on "two failed checks" VRS test
    Then I expect that VRS check "1/1 (2) check 1" has "Failed" status

  Scenario: VRS first failed check and second passed with same ident - blinking ident group, passed test
    # 1. One check - "New" status
    Given I start VRS session with parameters:
    """
      testName: "failed and passed"
    """

    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=failed and passed" for "3" seconds to exist
    Then I expect that VRS test "failed and passed" has "New" status

    When I click on "failed and passed" VRS test
    Then I expect that VRS check "1/1 check 1" has "New" status
    # 2. failed and passed - "Blinking" ident group status "Passed" test
    Given I start VRS session with parameters:
    """
      testName: "failed and passed"
    """
    When I check image with path: "vrs/tests/files/B.png" as "check 1"
    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=failed and passed" for "3" seconds to exist
    Then I expect that VRS test "failed and passed" has "Passed" status
    Then I expect that 1th VRS test "failed and passed" has blink icon

    When I click on "failed and passed" VRS test
    Then I expect that VRS check "1/1 (2) check 1" has "Blinking" status

  @EdgeCase
  Scenario: VRS first passed check and second failed with same ident - failed ident group, failed test
    # 1. One check - "New" status
    Given I start VRS session with parameters:
    """
      testName: "passed and failed"
    """

    When I check image with path: "vrs/tests/files/A.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=passed and failed" for "3" seconds to exist
    Then I expect that VRS test "passed and failed" has "New" status

    When I click on "passed and failed" VRS test
    Then I expect that VRS check "1/1 check 1" has "New" status
    # 2. passed and failed - "Failed" ident group status "Failed" test
    Given I start VRS session with parameters:
    """
      testName: "passed and failed"
    """
    When I check image with path: "vrs/tests/files/A.png" as "check 1"
    When I check image with path: "vrs/tests/files/B.png" as "check 1"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I wait and refresh page on element "span=passed and failed" for "3" seconds to exist
    Then I expect that VRS test "passed and failed" has "Failed" status

    When I click on "passed and failed" VRS test
    Then I expect that VRS check "1/1 (2) check 1" has "Failed" status




