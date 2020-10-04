@integration
Feature: VRS Runs Smoke

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

  Scenario: VRS Runs - create single TEST
    When I set env variables:
    """
    RUN_NAME: RUN-01
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_1"
    Then the "check" "status" should be "new"

    When I stop VRS session
    When I open the url "http://vrs:3001/runs"

    Then I wait and refresh page on element "=RUN-01" for "3" seconds to exist
    When I click on the element "=RUN-01"
    Then the current url contains "RUN-01"

    Then I wait and refresh page on element "span=New" for "3" seconds to exist
    Then I expect that 1th VRS test "Runs integration test" has "New" status

  Scenario: VRS Runs - create two TEST, same Run name
    # First
    When I set env variables:
    """
    RUN_NAME: RUN-02
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test - 01"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_1"
    Then the "check" "status" should be "new"
    When I stop VRS session

    # Second
    When I set env variables:
    """
    RUN_NAME: RUN-02
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test - 02"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_2"
    Then the "check" "status" should be "new"
    When I stop VRS session

    # Assert
    When I open the url "http://vrs:3001/runs"

    Then I wait and refresh page on element "=RUN-02" for "3" seconds to exist
    Then I expect that element "//a[.='RUN-02']/../../div[@name='item-count']/span" to have text "2"
    When I click on the element "=RUN-02"
    Then the current url contains "RUN-02"

    Then I wait and refresh page on element "span=New" for "3" seconds to exist
    Then I expect that 1th VRS test "Runs integration test - 01" has "New" status
    Then I expect that 1th VRS test "Runs integration test - 02" has "New" status

  Scenario: VRS Runs - First Run - 2 test, Second Run 1 test
    # FIRST RUN
    # First
    When I set env variables:
    """
    RUN_NAME: RUN-03
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test - 01"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_1"
    Then the "check" "status" should be "new"
    When I stop VRS session

    # Second
    When I set env variables:
    """
    RUN_NAME: RUN-03
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test - 02"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_2"
    Then the "check" "status" should be "new"
    When I stop VRS session

    # SECOND RUN

    When I set env variables:
    """
    RUN_NAME: RUN-04
    """
    Given I set window size: "1300x768"
    Given I start VRS session with parameters:
    """
      testName: "Runs integration test - 03"
    """
    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_3"
    Then the "check" "status" should be "new"

    When I assert image with path: "vrs/tests/files/A.png" as "new int assert_4"
    Then the "check" "status" should be "new"

    When I stop VRS session

    # ASSERT
    When I open the url "http://vrs:3001/runs"

    # First run
    Then I wait and refresh page on element "=RUN-03" for "3" seconds to exist
    Then I expect that element "//a[.='RUN-03']/../../div[@name='item-count']/span" to have text "2"
    When I click on the element "=RUN-03"
    Then the current url contains "RUN-03"

    Then I wait and refresh page on element "span=New" for "3" seconds to exist
    Then I expect that 1th VRS test "Runs integration test - 01" has "New" status
    Then I expect that 1th VRS test "Runs integration test - 02" has "New" status

    # Check number of checks
    When I click on the element "=Runs integration test - 01"
    Then I expect "1" occurrences of Clickable "//div[@name='check-name']"

    # Second run
    Then I wait and refresh page on element "=RUN-04" for "3" seconds to exist
    Then I expect that element "//a[.='RUN-04']/../../div[@name='item-count']/span" to have text "1"
    When I click on the element "=RUN-04"
    Then the current url contains "RUN-04"

    Then I wait and refresh page on element "span=New" for "3" seconds to exist
    Then I expect that 1th VRS test "Runs integration test - 03" has "New" status

    # Check number of checks
    When I click on the element "=Runs integration test - 03"
    Then I expect "2" occurrences of Clickable "//div[@name='check-name']"
