Feature: Checks with same Hash

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Checks with same Hash with different Test name but same Check name
        # check - 1
        When I create "1" tests with params:
        """
          testName: "Test Same Hash"
          checkName: Check Same Hash - 1
          filePath: files/A.png
        """
        When I accept via http the 1st check with name "Check Same Hash - 1"

        # check - 2
        When I create "1" tests with params:
        """
          testName: "Test Same Hash"
          checkName: Check Same Hash - 1
          filePath: files/A.png
        """
        When I open the app

        # check baseline name
        When I open the app
        When I wait for "1" seconds

        # go to test 2
        When I click on "Test Same Hash - 1" VRS test
        When I wait for "1" seconds

        # check baseline and actual name (should be as check name)
        When I click on the element "div[name='Check Same Hash - 1']"
        When I click on the element "#navigation"
        When I click on the element "#group_view"
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
        When I create "1" tests with params:
        """
          testName: "Test Same Hash"
          checkName: Check Same Hash - 1
          filePath: files/A.png
        """
        When I accept via http the 1st check with name "Check Same Hash - 1"

        # check - 2
        When I create "1" tests with params:
        """
          testName: "Test Same Hash2"
          checkName: Check Same Hash - 2
          filePath: files/A.png
        """
        When I expect via http 1st check filtered as "name=Check Same Hash - 1" matched:
        """
        status: [new]
        """
        When I expect via http 1st check filtered as "name=Check Same Hash - 2" matched:
        """
        status: [new]
        """

        ## check baseline and actual names
        # go to into Test 2
        When I open the app
        When I wait for "2" seconds
        When I click on "Test Same Hash2 - 1" VRS test
        When I wait for "1" seconds

        # baseline and actual name should be as check name
        When I click on the element "div[name='Check Same Hash - 2']"
        When I click on the element "#navigation"
        When I click on the element "#group_view"
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
        When I click on the element "#group_view"
        When I wait for "2" seconds
        When I execute javascript code and save as "filename - test-1, check-1":
        """
         return document.querySelector("#baseline-label").dataset.filename
        """
        # go to into Test 2
        When I open the app
        When I wait for "2" seconds
        When I click on "Test Same Hash2 - 1" VRS test
        When I wait for "1" seconds

        # baseline and actual name should be as check name
        When I click on the element "div[name='Check Same Hash - 2']"
        When I click on the element "#navigation"
        When I click on the element "#group_view"
        When I wait for "2" seconds

        When I execute javascript code and save as "filename - test-2, check-1":
        """
         return document.querySelector("#baseline-label").dataset.filename
        """
        Then I expect that the "filename - test-1, check-1" saved value equal the "filename - test-2, check-1" saved value

