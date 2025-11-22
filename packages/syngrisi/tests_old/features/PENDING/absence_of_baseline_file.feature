@Pending
Feature: Absence of the baseline file
    If the baseline file will be physically removed the check

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Check will be crashed with image with the same hash as not existed baseline image
        Given I start session with parameters:
        """
        testName: "Crashed test"
        """
        When I check image with path: "files/A.png" as "Crashed"
        When I stop session
        When I accept via http the 1st check with name "Crashed"

        When I clear screenshots folder

        Given I start session with parameters:
        """
        testName: "Crashed test"
        """
        When I check image with path: "files/A.png" as "Crashed" and suppress exceptions
        Then I expect the stored "error" string is contain:
        """
        Response code 500 (Internal Server Error)
        """

        Then I expect the stored "error" string is contain:
        """
        Cannot found the baseline file
        """

        When I stop session
        Then I expect via http that "Crashed" check exist exactly "1" times

        When I open the app
        When I click on "Crashed test" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Crashed test" is unfolded
        When I click on the element "[name=Crashed]"
        Then I wait on element "//div[@class='toast-body' and contains(text(), 'Cannot load image')]" to be displayed
