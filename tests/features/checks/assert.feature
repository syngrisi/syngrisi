@integration
Feature: VRS Assert Smoke

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
        When I set env variables:
        """
        TEST: 1
        SYNGRISI_AUTH: 0
        """
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

    Scenario: VRS passed assert
        Given I set window size: "1366x768"
        Given I start VRS session with parameters:
        """
          testName: "Passed Assert"
        """
        When I open the url "http://vrs:3001/"
        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "new"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "Passed Assert"
        """

        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "passed"
        When I stop VRS session

        When I open the url "http://vrs:3001/"

        Then I wait and refresh page on element "span=Passed" for "3" seconds to exist
        Then I expect that 1th VRS test "Passed Assert" has "Passed" status

        Then I expect that 2th VRS test "Passed Assert" has "New" status

        When I click on "Passed Assert" VRS test
        Then I expect that VRS test "Passed Assert" is unfolded
        Then I expect that VRS check "1/1 new int assert_1" has "Passed" status

    Scenario: VRS failed assert
        Given I set window size: "1366x768"
        Given I start VRS session with parameters:
        """
          testName: "Failed Assert"
        """

        When I assert image with path: "files/A.png" as "new int assert_2"
        Then the "check" "status" should be "new"

        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "Failed Assert"
        """

        When I check image with path: "files/B.png" as "new int assert_2"
        Then the "check" "status" should be "failed"
        When I stop VRS session

        When I open the url "http://vrs:3001/"

        Then I wait and refresh page on element "span=Failed" for "3" seconds to exist
        Then I expect that 1th VRS test "Failed Assert" has "Failed" status

        Then I expect that 2th VRS test "Failed Assert" has "New" status

        When I click on "Failed Assert" VRS test
        Then I expect that VRS test "Failed Assert" is unfolded
        Then I expect that VRS check "1/1 new int assert_2" has "Failed" status
