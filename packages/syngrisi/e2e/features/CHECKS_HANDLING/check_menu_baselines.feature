@fast-server
Feature: Check Details menu — Open in Baselines & Time machine
    # The check kebab menu exposes "Open in Baselines" (jump to the baselines grid filtered by the
    # check's name) and "Time machine" (open the baseline history modal inline). The history modal
    # must actually load baselines — it matches by the app ObjectId, not the app name.

    Background:
        When I open the app
        When I clear local storage

    @smoke
    Scenario: The check menu opens the baseline history (time machine) with a loaded baseline
        Given I create "1" tests with:
            """
            testName: MenuTest
            project: MenuApp
            checks:
              - checkName: MenuCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "MenuCheck"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='MenuTest']" to be visible
        When I unfold the test "MenuTest"
        When I open the 1st check "MenuCheck"

        # open the kebab menu → both new items are present
        When I wait 6 seconds for the element with locator "[data-test='check-details-menu']" to be visible
        When I click element with locator "[data-test='check-details-menu']"
        Then the element with locator "[data-test='menu-open-baselines']" should be visible
        Then the element with locator "[data-test='menu-time-machine']" should be visible

        # Time machine opens the history modal inline AND loads the baseline (app-id ident, not name)
        When I click element with locator "[data-test='menu-time-machine']"
        When I wait 10 seconds for the element with locator "[data-test='history-image']" to be visible
        Then the element with locator "[data-test='history-image']" should be visible
        When I click element with locator ".mantine-Modal-close"

    Scenario: "Open in Baselines" navigates to the baselines grid
        Given I create "1" tests with:
            """
            testName: OpenBlTest
            project: OpenBlApp
            checks:
              - checkName: OpenBlCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "OpenBlCheck"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='OpenBlTest']" to be visible
        When I unfold the test "OpenBlTest"
        When I open the 1st check "OpenBlCheck"
        When I wait 6 seconds for the element with locator "[data-test='check-details-menu']" to be visible
        When I click element with locator "[data-test='check-details-menu']"
        When I click element with locator "[data-test='menu-open-baselines']"
        # lands on the baselines grid filtered by the check name → the baseline row is visible
        When I wait 10 seconds for the element with locator "[data-row-name='OpenBlCheck']" to be visible
        Then the element with locator "[data-row-name='OpenBlCheck']" should be visible
