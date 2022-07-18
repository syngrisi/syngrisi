@integration @e2e
Feature: VRS One Suite, One test, One check

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    @smoke
    Scenario: Create one check - [new, without session ending]
        Given I start session with parameters:
        """
        testName: "Without session ending"
        """
        When I check image with path: "files/A.png" as "new int check"
        When I open the app
        Then I wait and refresh page on element "span=Without session ending" for "3" seconds to exist
        Then I expect that 1th test "Without session ending" has "Running" status
        Then I expect that 1th test "Without session ending" contains "chrome" browser
        Then I expect that 1th test "Without session ending" has "≠" viewport

        When I click on "Without session ending" VRS test
        Then I expect that VRS test "Without session ending" is unfolded
        Then I expect that VRS check "1/1 new int check" has "New" status

    # descriptive e2e test
    @smoke
    Scenario: Create one check [new, with session ending]
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: With session ending
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
          tags: ["@tag11", "@tag22"]
        """

        When I open the app
        When I wait and refresh page on element "span=With session ending - 1" for "3" seconds to exist
        Then I expect that 1th test "With session ending - 1" has "New" status
        Then I expect that 1th test "With session ending - 1" has "onebranch" branch
        Then I expect that 1th test "With session ending - 1" has "Guest" created by
        Then I expect that 1th test "With session ending - 1" has "Unaccepted" accepted status
        Then I expect that 1th test "With session ending - 1" contains "<YYYY-MM-DD>" date
        Then I expect that 1th test "With session ending - 1" contains "chrome" browser
        Then I expect that 1th test "With session ending - 1" has "<testPlatform>" platform
        Then I expect that 1th test "With session ending - 1" has "1366x768" viewport
        Then I expect that 1th test "With session ending - 1" contains "tag11" tags
        Then I expect that 1th test "With session ending - 1" contains "tag22" tags

        When I click on "With session ending - 1" VRS test
        Then I expect that VRS test "With session ending - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "New" status
        Then I expect the "1/1 Check - 1" check has "not accept" acceptance status

        When I open "Check - 1" view
        When I wait for "2" seconds
        Then I expect the element ".status" contains the text "new" via js

        # suite and run
        When I go to "main" page
        Then I expect that element "span=Integration suite" is displayed
        When I go to "runs" page
        Then I expect that element "span=integration_run_name" is displayed

    @smoke
    Scenario: VRS create two checks - [new, failed (not_accepted)]
        Given I set window size: "1366x768"
        When I create "2" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, passed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Created two: new, passed - 1" for "3" seconds to exist
        Then I expect that 1th test "Created two: new, passed - 2" has "Failed" status
        Then I expect that 1th test "Created two: new, passed - 2" has "onebranch" branch
        Then I expect that 1th test "Created two: new, passed - 2" has "Guest" created by
        Then I expect that 1th test "Created two: new, passed - 2" has "Unaccepted" accepted status
        Then I expect that 1th test "Created two: new, passed - 2" contains "<YYYY-MM-DD>" date
        Then I expect that 1th test "Created two: new, passed - 2" contains "chrome" browser
        Then I expect that 1th test "Created two: new, passed - 2" has "<testPlatform>" platform
        Then I expect that 1th test "Created two: new, passed - 2" has "1366x768" viewport

        Then I expect that 1th test "Created two: new, passed - 1" has "New" status

        When I click on "Created two: new, passed - 2" VRS test
        Then I expect that VRS test "Created two: new, passed - 2" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Failed" status
        Then I expect the "1/1 Check - 1" check has "not accept" acceptance status
        When I open "Check - 1" view
        Then I expect that element "#not-accepted-checks-char" is displayed
        Then the element "#not-accepted-checks-char" contains the text "×"
        Then the element "//div[contains(text(), 'failReasons')]/../div[2]" contains the text "not_accepted"

    @smoke
    Scenario: VRS create two checks - [new, accept, passed]
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, passed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I accept via http the 1st check with name "Check - 1"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, passed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Created two: new, passed - 1" for "3" seconds to exist
        Then I expect that 1th test "Created two: new, passed - 1" has "Passed" status
        Then I expect that 1th test "Created two: new, passed - 1" has "onebranch" branch
        Then I expect that 1th test "Created two: new, passed - 1" has "Guest" created by
        Then I expect that 1th test "Created two: new, passed - 1" has "Accepted" accepted status
        Then I expect that 1th test "Created two: new, passed - 1" contains "<YYYY-MM-DD>" date
        Then I expect that 1th test "Created two: new, passed - 1" contains "chrome" browser
        Then I expect that 1th test "Created two: new, passed - 1" has "<testPlatform>" platform
        Then I expect that 1th test "Created two: new, passed - 1" has "1366x768" viewport

        When I click on "Created two: new, passed - 1" VRS test
        Then I expect that VRS test "Created two: new, passed - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Passed" status
        Then I expect the "1/1 Check - 1" check has "previously accept" acceptance status

        Then I expect that 2th test "Created two: new, passed - 1" has "New" status

    @smoke
    Scenario: VRS create two checks - [new, failed (different_images)]
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, failed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I accept via http the 1st check with name "Check - 1"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, failed"
          checkName: Check - 1
          filePath: files/B.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Created two: new, failed - 1" for "3" seconds to exist
        Then I expect that 1th test "Created two: new, failed - 1" has "Failed" status
        Then I expect that 1th test "Created two: new, failed - 1" has "onebranch" branch
        Then I expect that 1th test "Created two: new, failed - 1" has "Guest" created by
        Then I expect that 1th test "Created two: new, failed - 1" has "Accepted" accepted status
        Then I expect that 1th test "Created two: new, failed - 1" contains "<YYYY-MM-DD>" date
        Then I expect that 1th test "Created two: new, failed - 1" contains "chrome" browser
        Then I expect that 1th test "Created two: new, failed - 1" has "<testPlatform>" platform
        Then I expect that 1th test "Created two: new, failed - 1" has "1366x768" viewport

        When I click on "Created two: new, failed - 1" VRS test
        Then I expect that VRS test "Created two: new, failed - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Failed" status
        Then I expect the "1/1 Check - 1" check has "previously accept" acceptance status

        Then I expect that 2th test "Created two: new, failed - 1" has "New" status

        When I open "Check - 1" view
        Then the element "#mismatch_percentage" contains the text "(1.34%)"
        Then the element "//div[contains(text(), 'failReasons')]/../div[2]" contains the text "different_images"

    @smoke
    Scenario: VRS create three checks - [new, passed, failed (different_images)]
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created three: new, passed, failed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created three: new, passed, failed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """

        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created three: new, passed, failed"
          checkName: Check - 1
          filePath: files/B.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Created three: new, passed, failed - 1" for "3" seconds to exist
        Then I expect that 1th test "Created three: new, passed, failed - 1" has "Failed" status
        Then I expect that 2th test "Created three: new, passed, failed - 1" has "Passed" status
        Then I expect that 3th test "Created three: new, passed, failed - 1" has "New" status

    @smoke
    Scenario: VRS create two checks - [new, failed (not_accepted, different_images), accept, passed]
        Given I set window size: "1366x768"
        When I create "2" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, failed (not_accepted, different_images), accept, passed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Created two: new, failed (not_accepted, different_images), accept, passed - 1" for "3" seconds to exist
        Then I expect that 1th test "Created two: new, failed (not_accepted, different_images), accept, passed - 2" has "Failed" status
        Then I expect that 1th test "Created two: new, failed (not_accepted, different_images), accept, passed - 1" has "New" status

        When I click on "Created two: new, failed (not_accepted, different_images), accept, passed - 2" VRS test
        Then I expect that VRS test "Created two: new, failed (not_accepted, different_images), accept, passed - 2" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Failed" status
        Then I expect the "1/1 Check - 1" check has "not accept" acceptance status
        When I open "Check - 1" view
        Then the element "#not-accepted-checks-char" contains the text "×"
        Then the element "//div[contains(text(), 'failReasons')]/../div[2]" contains the text "not_accepted"

        When I accept via http the 2st check with name "Check - 1"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Created two: new, failed (not_accepted, different_images), accept, passed"
          checkName: Check - 1
          filePath: files/A.png
          branch: onebranch
        """
        When I open the app
        When I wait for "2" seconds
        Then I expect that 1th test "Created two: new, failed (not_accepted, different_images), accept, passed - 1" has "Passed" status
        When I click on "Created two: new, failed (not_accepted, different_images), accept, passed - 1" VRS test
        Then I expect that VRS test "Created two: new, failed (not_accepted, different_images), accept, passed - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Passed" status
        Then I expect the "1/1 Check - 1" check has "previously accept" acceptance status


