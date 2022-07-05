@integration
Feature: Mass Check Acceptance

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Mass Check Acceptance
        When I create "2" tests with:
        """
          testName: "Mass Accept - "
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """

        When I open the app
        When I select the test "Mass Accept - 1"
        When I select the test "Mass Accept - 2"
        When I click on the element "[name='accept-checks']"
        When I accept the confirmbox
        When I wait for "1" seconds
        Then I expect that VRS test "Mass Accept - 2" has "Accepted" accepted status
        Then I expect that VRS test "Mass Accept - 1" has "Accepted" accepted status

        When I click on "Mass Accept - 2" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Mass Accept - 2" is unfolded
        Then I expect the "Check - 1" check has "accept" acceptance status
        Then I expect the "Check - 2" check has "accept" acceptance status

        When I refresh page
        When I wait for "1" seconds
        Then I expect that VRS test "Mass Accept - 2" has "Accepted" accepted status
        Then I expect that VRS test "Mass Accept - 1" has "Accepted" accepted status
        When I click on "Mass Accept - 1" VRS test
        When I wait for "2" seconds
        Then I expect the 1st "Check - 2" check has "accept" acceptance status
        Then I expect the 1st "Check - 1" check has "accept" acceptance status
