Feature: Low images difference
    This feature checks if images with a low difference (rawMisMatchPercentage, e.q.: 0.001) are properly compared

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: VRS create two checks - [new, accept, passed]
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Low difference"
          checkName: Check - 1
          filePath: files/low_diff_0.png
          branch: onebranch
        """
        When I accept via http the 1st check with name "Check - 1"
        When I create "1" tests with params:
        """
          appName: Integration Test App
          testName: "Low difference"
          checkName: Check - 1
          filePath: files/low_diff_1.png
          branch: onebranch
        """
        When I open the app
        When I wait and refresh page on element "span=Low difference - 1" for "3" seconds to exist
        Then I expect that 1th test "Low difference - 1" has "Failed" status

        When I click on "Low difference - 1" VRS test
        Then I expect that VRS test "Low difference - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Failed" status
        Then I expect the "1/1 Check - 1" check has "previously accept" acceptance status

        Then I expect that 2th test "Low difference - 1" has "New" status

        When I open "Check - 1" view
        Then I expect that element "#mismatch_percentage" is displayed
        Then the element "#mismatch_percentage" contains the text "(0.0005228758169934641%)"
        Then the element "//div[contains(text(), 'rawMisMatchPercentage')]/../div[2]" contains the text "0.0005228758169934641"
        Then the element "//div[contains(text(), 'misMatchPercentage')]/../div[2]" contains the text "0.00"
