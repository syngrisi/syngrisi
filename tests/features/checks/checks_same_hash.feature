Feature: Checks with same Hash

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          RUN_NAME: RUN-01
        """
        Given I start Server and start Driver
        Given I set window size: "1366x768"

    Scenario: Checks with same Hash with different Test name but same Check name
        # check - 1
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 1"
        """
        When I open the app
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        Then the "check" "status" should be "new"
        When I stop VRS session

        # check - 2
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 2"
        """
        When I open the app
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        Then the "check" "status" should be "passed"
        When I stop VRS session

        # check baseline name
        When I open the app
        When I wait for "1" seconds

        # go to test 2
        When I click on "Test Same Hash - 2" VRS test
        When I wait for "1" seconds

        # check baseline and actual name (should be as check name)
        When I click on the element "div[name='Check Same Hash - 1']"
        When I click on the element "#navigation"
        When I click on the element "a[name='group view']"
        When I wait for "2" seconds

        Then the element "#baseline-label" matches the text "Check Same Hash - 1"
        Then the element "#actual-label" matches the text "Check Same Hash - 1"

        # screenshot existence
        When I click on the element "[title='baseline snapshoot']"
        Then I expect HTML does not contains:
        """
        not found
        """
        When I click on browser back button
        When I click on the element "[title='actual snapshoot']"
        Then I expect HTML does not contains:
        """
        not found
        """

    Scenario: Checks with same Hash with different Test name and Check name
        # check - 1
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 1"
        """
        When I open the app
        When I check image with path: "files/A.png" as "Check Same Hash - 1"
        When I stop VRS session
        When I wait for "2" seconds
        Then the "check" "status" should be "new"

        # check - 2
        Given I start VRS session with parameters:
        """
          testName: "Test Same Hash - 2"
        """
        When I open the app
        When I check image with path: "files/A.png" as "Check Same Hash - 2"
        When I stop VRS session
        When I wait for "2" seconds
        Then the "check" "status" should be "new"

        ## check baseline and actual names
        # go to into Test 2
        When I open the app
        When I wait for "2" seconds
        When I click on "Test Same Hash - 2" VRS test
        When I wait for "1" seconds

        # baseline and actual name should be as check name
        When I click on the element "div[name='Check Same Hash - 2']"
        When I click on the element "#navigation"
        When I click on the element "a[name='group view']"
        When I wait for "2" seconds

        Then the element "#baseline-label" matches the text "Check Same Hash - 2"
        Then the element "#actual-label" matches the text "Check Same Hash - 2"

        ## check file names
        # probe Test 1
        When I open the app
        When I wait for "2" seconds
        When I click on "Test Same Hash - 1" VRS test
        When I wait for "1" seconds

        # baseline and actual name should be as check name
        When I click on the element "div[name='Check Same Hash - 1']"
        When I click on the element "#navigation"
        When I click on the element "a[name='group view']"
        When I wait for "2" seconds
        When I execute javascript code and save as "filename - test-1, check-1":
        """
         return document.querySelector("#baseline-label").dataset.filename
        """
        # go to into Test 2
        When I open the app
        When I wait for "2" seconds
        When I click on "Test Same Hash - 2" VRS test
        When I wait for "1" seconds

        # baseline and actual name should be as check name
        When I click on the element "div[name='Check Same Hash - 2']"
        When I click on the element "#navigation"
        When I click on the element "a[name='group view']"
        When I wait for "2" seconds

        When I execute javascript code and save as "filename - test-2, check-1":
        """
         return document.querySelector("#baseline-label").dataset.filename
        """
        Then I expect that the "filename - test-1, check-1" saved value equal the "filename - test-2, check-1" saved value

