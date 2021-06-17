@integration
Feature: Multiple tests: One Suite, Two tests, Few checks

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

    Scenario: Two tests - new, new
        Given I start VRS session with parameters:
        """
          testName: "Two checks - new"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session
        When I open the url "http://vrs:3001/"
        Then I wait and refresh page on element "span=Two checks - new" for "3" seconds to exist
        Then I expect that VRS test "Two checks - new" has "New" status

        When I click on "Two checks - new" VRS test
        Then I expect that VRS check "1/2 check 1" has "New" status
        Then I expect that VRS check "2/2 check 2" has "New" status

    Scenario: Two checks - new, passed
        Given I start VRS session with parameters:
        """
          suiteName: "Integration multi suite"
          suiteId: "integration_multi_suite"
          appName: "Integration Test App"
          testName: "Two checks - new, passed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          suiteName: "Integration multi suite"
          suiteId: "integration_multi_suite"
          appName: "Integration Test App"
          testName: "Two checks - new, passed"
        """

        When I check image with path: "files/A.png" as "check 1"

        When I stop VRS session

        When I open the url "http://vrs:3001/"
        Then I wait and refresh page on element "span=Two checks - new, passed" for "3" seconds to exist
        Then I expect that 1th VRS test "Two checks - new, passed" has "Passed" status
        Then I expect that 2th VRS test "Two checks - new, passed" has "New" status

        When I click on "Two checks - new, passed" VRS test
        Then I expect that VRS test "Two checks - new, passed" is unfolded
        Then I expect that VRS check "1/1 check 1" has "Passed" status

    Scenario: Two checks - passed, passed
        Given I start VRS session with parameters:
        """
          suiteName: "Integration multi suite"
          suiteId: "integration_multi_suite"
          appName: "Integration Test App"
          testName: "Two checks - passed, passed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          suiteName: "Integration multi suite"
          suiteId: "integration_multi_suite"
          appName: "Integration Test App"
          testName: "Two checks - passed, passed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session

        When I open the url "http://vrs:3001/"
        Then I wait and refresh page on element "span=Two checks - passed, passed" for "3" seconds to exist
        Then I expect that 1th VRS test "Two checks - passed, passed" has "Passed" status
        Then I expect that 2th VRS test "Two checks - passed, passed" has "New" status

        When I click on "Two checks - passed, passed" VRS test
        Then I expect that VRS test "Two checks - passed, passed" is unfolded
        Then I expect that VRS check "1/2 check 1" has "Passed" status
        Then I expect that VRS check "2/2 check 2" has "Passed" status

    Scenario: Two checks - failed, failed
        Given I start VRS session with parameters:
        """
          testName: "Two checks - failed, failed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "Two checks - failed, failed"
        """

        When I check image with path: "files/B.png" as "check 1"
        When I check image with path: "files/A.png" as "check 2"

        When I stop VRS session

        When I open the url "http://vrs:3001/"
        Then I wait and refresh page on element "span=Two checks - failed, failed" for "3" seconds to exist
        Then I expect that 1th VRS test "Two checks - failed, failed" has "Failed" status
        Then I expect that 2th VRS test "Two checks - failed, failed" has "New" status

        When I click on "Two checks - failed, failed" VRS test
        Then I expect that VRS test "Two checks - failed, failed" is unfolded
        Then I expect that VRS check "1/2 check 1" has "Failed" status
        Then I expect that VRS check "2/2 check 2" has "Failed" status

    Scenario: Two checks - passed, failed
        Given I start VRS session with parameters:
        """
          testName: "Two checks - passed, failed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/B.png" as "check 2"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "Two checks - passed, failed"
        """

        When I check image with path: "files/A.png" as "check 1"
        When I check image with path: "files/A.png" as "check 2"

        When I stop VRS session

        When I open the url "http://vrs:3001/"
        Then I wait and refresh page on element "span=Two checks - passed, failed" for "3" seconds to exist
        Then I expect that 1th VRS test "Two checks - passed, failed" has "Failed" status
        Then I expect that 2th VRS test "Two checks - passed, failed" has "New" status

        When I click on "Two checks - passed, failed" VRS test
        Then I expect that VRS test "Two checks - passed, failed" is unfolded
        Then I expect that VRS check "1/2 check 1" has "Passed" status
        Then I expect that VRS check "2/2 check 2" has "Failed" status

