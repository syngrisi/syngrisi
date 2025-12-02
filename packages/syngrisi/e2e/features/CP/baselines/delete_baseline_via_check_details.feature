@fast-server @smoke
Feature: Delete Baseline via Check Details

    Background:
        Given I clear database
        And I start Server
        And I login with user:"testadmin" password "testadmin"

    Scenario: Delete baseline from check details modal
        Given I seed via http baselines with usage:
            """
            baselines:
              - name: test-baseline
                checkName: test-check
                usageCount: 1
                filePath: files/A.png
            """
        And I open the app
        And I go to "baselines" page
        Then I wait for "1" seconds
        When I click element with locator "[data-test='table-row-Name']"
        Then I wait for "1" seconds
        When I click element with locator "[data-test='table_row_0']"
        Then I wait for "1" seconds
        When I open the 1st check "test-check"
        Then I wait for "1" seconds
        When I click element with locator "[data-test='check-details-menu']"
        Then I wait for "1" seconds
        When I click element with locator "[data-test='menu-delete-baseline']"
        Then I wait for "1" seconds
        Then the text "Are you sure you want to delete this baseline?" should be visible
        When I force click element with locator "[data-test='confirm-delete-baseline']"
        Then I wait for "1" seconds
        Then the element with locator "[data-test='check-details-menu']" should not be visible
        And I go to "baselines" page
        Then I wait for "1" seconds
        Then the text "test-baseline" should not be visible
