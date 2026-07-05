@fast-server
Feature: Project settings UI — per-project retention
    Enabling retention from Admin → Settings → Project settings must round-trip through the
    triage-policy API and persist on the App document (retentionEnabled / retentionDays).

    Background:
        When I open the app
        When I clear local storage
        # a project must exist to be selectable in the Project settings tab
        Given I create "1" tests with:
            """
            testName: RetentionUiTest
            project: RetentionUiApp
            checks:
              - checkName: RetentionUiCheck
                filePath: files/A.png
            """

    @smoke
    Scenario: Enabling retention in the Project settings tab persists on the project
        When I go to "settings" page
        When I wait 10 seconds for the element with locator "[data-test='settings-tab-projects']" to be visible
        When I click element with locator "[data-test='settings-tab-projects']"
        When I wait 6 seconds for the element with locator "[data-test='project-settings-select']" to be visible

        # pick the project
        When I click element with locator "[data-test='project-settings-select']"
        When I wait 6 seconds for the element with locator "[role='option']" to be visible
        When I click element with locator "[role='option']"

        # enable retention and set the day window
        When I wait 3 seconds for the element with locator "[data-test='settings-retention-enabled']" to be visible
        When I click element with locator "//label[starts-with(normalize-space(.),'Enable retention')]"
        When I set "45" to the inputfield "[data-test='settings-retention-days']"
        When I click element with locator "[data-test='project-settings-save']"

        # success toast + persisted on the App document
        When I wait 10 seconds for the element with locator "//*[contains(@class,'mantine-Notification-body')]//div[contains(text(),'saved')]" to be visible
        Then the project "RetentionUiApp" retention is enabled "true" days "45"
