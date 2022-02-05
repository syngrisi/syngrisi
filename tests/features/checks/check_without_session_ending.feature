@integration @smoke @e2e
Feature: One Check without session ending

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: VRS create new check - without session ending
        Given I start VRS session with parameters:
        """
        testName: "Without session ending"
        """
        When I check image with path: "files/A.png" as "new int check"
        When I open the app
        Then I wait and refresh page on element "span=Without session ending" for "3" seconds to exist
        Then I expect that test "Without session ending" has "Running" status
        Then I expect that test "Without session ending" contains "chrome" browser
        Then I expect that test "Without session ending" has "≠" viewport

        When I click on "Without session ending" VRS test
        Then I expect that VRS test "Without session ending" is unfolded
        Then I expect that VRS check "1/1 new int check" has "New" status
