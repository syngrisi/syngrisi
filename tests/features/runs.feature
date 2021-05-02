@integration
Feature: Runs Smoke

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
        Given I set window size: "1300x768"

    Scenario: Runs - create single TEST
        When I set env variables:
        """
        RUN_NAME: RUN-01
        RUN_IDENT: RUN-Ident-1
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test"
        """
        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "new"

        When I stop VRS session
        When I open the url "http://vrs:3001/runs"

        Then I wait and refresh page on element "span=RUN-01" for "3" seconds to exist
        When I click on the element "span=RUN-01"

        Then I wait and refresh page on element "span=New" for "3" seconds to exist
        Then I expect that 1th VRS test "Runs integration test" has "New" status
        Then I expect that element "//span[text()='RUN-01']/../..//span[@class='new-run-test-status']" to have text "1"
        Then I expect that element "//span[text()='RUN-01']/../..//span[@class='passed-run-test-status']" to have text "0"
        Then I expect that element "//span[text()='RUN-01']/../..//span[@class='failed-run-test-status']" to have text "0"

    Scenario: Runs - create two TEST, same Run name and ident
        # first
        When I set env variables:
        """
        RUN_NAME: RUN-02
        RUN_IDENT: RUN-Ident-2
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 01"
        """
        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # second
        When I set env variables:
        """
        RUN_NAME: RUN-02
        RUN_IDENT: RUN-Ident-2
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 02"
        """
        When I assert image with path: "files/A.png" as "new int assert_2"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # assert
        When I open the url "http://vrs:3001/runs"

        Then I wait and refresh page on element "span=RUN-02" for "3" seconds to exist
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='new-run-test-status']" to have text "2"
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='passed-run-test-status']" to have text "0"
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='failed-run-test-status']" to have text "0"
        When I click on the element "span=RUN-02"

        Then I wait and refresh page on element "span=New" for "3" seconds to exist
        Then I expect that 1th VRS test "Runs integration test - 01" has "New" status
        Then I expect that 1th VRS test "Runs integration test - 02" has "New" status

    Scenario: Runs - create two TEST, same Run name and Ident, one is failed
        # first
        When I set env variables:
        """
        RUN_NAME: RUN-02
        RUN_IDENT: RUN-Ident-3
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 01"
        """
        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # second
        When I set env variables:
        """
        RUN_NAME: RUN-02
        RUN_IDENT: RUN-Ident-3
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 02"
        """
        When I assert image with path: "files/A.png" as "new int assert_2"
        Then the "check" "status" should be "new"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 02"
        """
        When I check image with path: "files/B.png" as "new int assert_2"
        Then the "check" "status" should be "failed"
        When I stop VRS session

        # assert
        When I open the url "http://vrs:3001/runs"

        Then I wait and refresh page on element "span=RUN-02" for "3" seconds to exist
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='new-run-test-status']" to have text "2"
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='passed-run-test-status']" to have text "0"
        Then I expect that element "//span[text()='RUN-02']/../..//span[@class='failed-run-test-status']" to have text "1"

        When I click on the element "span=RUN-02"

        Then I wait and refresh page on element "span=New" for "3" seconds to exist
        Then I expect that 1th VRS test "Runs integration test - 01" has "New" status
        Then I expect that 1th VRS test "Runs integration test - 02" has "Failed" status

    Scenario: Runs - First Run - 2 test, Second Run 1 test
        # FIRST RUN
        # first
        When I set env variables:
        """
        RUN_NAME: RUN-03
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 01"
        """
        When I assert image with path: "files/A.png" as "new int assert_1"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # second
        When I set env variables:
        """
        RUN_NAME: RUN-03
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 02"
        """
        When I assert image with path: "files/A.png" as "new int assert_2"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # SECOND RUN
        When I set env variables:
        """
        RUN_NAME: RUN-04
        """
        Given I start VRS session with parameters:
        """
          testName: "Runs integration test - 03"
        """
        When I assert image with path: "files/A.png" as "new int assert_3"
        Then the "check" "status" should be "new"

        When I assert image with path: "files/A.png" as "new int assert_4"
        Then the "check" "status" should be "new"

        When I stop VRS session

        # ASSERT
        When I open the url "http://vrs:3001/runs"

        # first run
        Then I wait and refresh page on element "span=RUN-03" for "3" seconds to exist
        Then I expect that element "//span[text()='RUN-03']/../..//span[@class='new-run-test-status']" to have text "2"
        Then I expect that element "//span[text()='RUN-03']/../..//span[@class='passed-run-test-status']" to have text "0"
        Then I expect that element "//span[text()='RUN-03']/../..//span[@class='failed-run-test-status']" to have text "0"

        When I click on the element "span=RUN-03"

        Then I wait and refresh page on element "span=New" for "3" seconds to exist
        Then I expect that 1th VRS test "Runs integration test - 01" has "New" status
        Then I expect that 1th VRS test "Runs integration test - 02" has "New" status

        # check number of checks
        When I click on the element "span=Runs integration test - 01"
        Then I expect "1" occurrences of Clickable "//div[@name='check-name']"

        # second run
        Then I wait and refresh page on element "span=RUN-04" for "3" seconds to exist
        Then I expect that element "//span[text()='RUN-04']/../..//span[@class='new-run-test-status']" to have text "1"
        Then I expect that element "//span[text()='RUN-04']/../..//span[@class='passed-run-test-status']" to have text "0"
        Then I expect that element "//span[text()='RUN-04']/../..//span[@class='failed-run-test-status']" to have text "0"

        When I click on the element "span=RUN-04"

        Then I wait and refresh page on element "span=New" for "3" seconds to exist
        Then I expect that 1th VRS test "Runs integration test - 03" has "New" status

        # check number of checks
        When I wait for "2" seconds
        When I click on the element "span=Runs integration test - 03"
        When I wait for "2" seconds
        Then I expect "2" occurrences of Clickable "//div[@name='check-name']"

    Scenario: Runs - remove
        # create 3 tests in one run and 4 in another
        When I set env variables:
        """
        RUN_NAME: TO-DELETE
        RUN_IDENT: RUN-Ident-1
        """
        When I create "3" tests with params:
         """
          filePath: files/A.png
          testName: Delete me
        """
        When I open the url "http://vrs:3001/runs"


        When I set env variables:
        """
        RUN_NAME: TO-KEEP
        RUN_IDENT: RUN-Ident-1
        """
        When I create "4" tests with params:
         """
          filePath: files/A.png
          testName: Keep me
        """
        When I open the url "http://vrs:3001/runs"

        # check if tests present in their runs
        When I click on the element "span=TO-DELETE"
        When I wait for "2" seconds
        Then I expect that element "span*=Delete me" does appear exactly "3" times
        Then I expect that element "span*=Keep me" is not displayed

        When I click on the element "span=TO-KEEP"
        When I wait for "2" seconds
        Then I expect that element "span*=Keep me" does appear exactly "4" times
        Then I expect that element "span*=Delete me" is not displayed

        # delete one run
        Then I expect that element "span=TO-DELETE" is displayed
        When I click on the element "input[runname='TO-DELETE']"
        When I click on the element "a[name='remove-tests']"
        When I accept the confirmbox
        When I wait for "1" seconds
        Then I wait on element "span=TO-DELETE" to not exist

        # check if disappears on the index page
        When I open the url "http://vrs:3001/"
        When I wait for "2" seconds
        Then I expect that element "span*=Keep me" does appear exactly "4" times
        Then I expect that element "span*=Delete me" is not displayed
