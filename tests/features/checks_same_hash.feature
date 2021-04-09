Feature: Checks with same Hash

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

    Scenario: Checks with same Hash with different Test name but same Check name

        # check - 1
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 1"
        """
        When I open the url "http://vrs:3001/"
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # check - 2
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 2"
        """
        When I open the url "http://vrs:3001/"
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        Then the "check" "status" should be "passed"
        When I stop VRS session

        # go to into Test 2
        When I wait for "3" seconds
        When I open the url "http://vrs:3001/"
        When I wait for "2" seconds
        When I click on "Test Same Hash - 2" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Test Same Hash - 2" is unfolded
        Then I expect that VRS check "1/1 Check Same Hash - 1" has "Passed" status

        # check baseline name
        When I click on the element "a[name='Check Same Hash - 1']"
        When I click on the element "a[name='baseline_link']"
        When I wait for "2" seconds
        Then I expect that element "//div[@name='title' and text()='Check Same Hash - 1']" is displayed

        # check actual name (= baseline name)
        When I click on browser back button
        When I wait for "2" seconds
        When I click on the element "a[name='actual_link']"
        When I wait for "2" seconds
        Then I expect that element "//div[@name='title' and text()='Check Same Hash - 1']" is displayed

    Scenario: Checks with same Hash with different Test name and Check name

        # check - 1
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 1"
        """
        When I open the url "http://vrs:3001/"
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        When I stop VRS session
        When I wait for "2" seconds
        Then the "check" "status" should be "new"

        # check - 2
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 2"
        """
        When I open the url "http://vrs:3001/"
        When I check image with path: "files/A.png" as "Check Same Hash - 2"
        When I stop VRS session
        When I wait for "2" seconds
        Then the "check" "status" should be "new"

        # go to into Test 2
        When I wait for "3" seconds
        When I open the url "http://vrs:3001/"
        When I wait for "2" seconds
        When I click on "Test Same Hash - 2" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Test Same Hash - 2" is unfolded
        Then I expect that VRS check "1/1 Check Same Hash - 2" has "New" status

        # check baseline name (should be as check name)
        When I click on the element "a[name='Check Same Hash - 2']"
        When I click on the element "a[name='baseline_link']"
        When I wait for "2" seconds
        Then I expect that element "//div[@name='title' and text()='Check Same Hash - 2']" is displayed
