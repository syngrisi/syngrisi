@fast-server
Feature: Promote baselines from a feature branch to the project's main branch
    Promoting copies all ACCEPTED baselines of a project on a source branch to a target
    branch (typically the project's `mainBranch`), so a feature branch's approved baselines
    become the main-branch baselines. After promotion, the main branch has its own accepted
    baseline for the same ident (not merely a read-time fallback to another branch).

    Background:
        Given I clear database

    @smoke
    Scenario: Promoting a feature branch's accepted baseline makes main pass against it directly
        Given I create "1" tests with:
            """
            testName: FeatureBranchTest
            project: PromotionApp
            branch: feature-x
            checks:
              - checkName: PromoteCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "PromoteCheck"
        And the project "PromotionApp" has main branch "main"

        And I promote via http baselines for project "PromotionApp" from branch "feature-x" to branch "main"

        Given I create "1" tests with:
            """
            testName: MainBranchTest
            project: PromotionApp
            branch: main
            checks:
              - checkName: PromoteCheck
                filePath: files/A.png
            """

        Then I expect via http 1st check filtered as "name=PromoteCheck" matched:
            """
            name: PromoteCheck
            branch: main
            status: [passed]
            """

        And I expect via http that "PromoteCheck" "baseline" exist exactly "2" times

    Scenario: Promoting from the run kebab menu copies accepted baselines to main
        When I open the app
        When I clear local storage
        Given I create "1" tests with:
            """
            testName: UiFeatureTest
            project: PromotionUiApp
            runName: feature-ui
            branch: feature-ui
            checks:
              - checkName: UiPromoteCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "UiPromoteCheck"
        And the project "PromotionUiApp" has main branch "main"

        # open the run's kebab menu and promote
        When I go to "main" page
        When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'feature-ui')]" to be visible
        When I click element with locator "[data-item-name='feature-ui'] button"
        When I wait 6 seconds for the element with locator "[data-test='run-promote-baselines']" to be visible
        When I click element with locator "[data-test='run-promote-baselines']"
        When I wait 6 seconds for the element with locator "[data-test='run-promote-confirm']" to be visible
        When I click element with locator "[data-test='run-promote-confirm']"

        # success toast, and main now has its own accepted baseline for the same ident
        When I wait 10 seconds for the element with locator "//*[contains(@class,'mantine-Notification-body')]//div[contains(text(),'Promoted')]" to be visible
        Then I expect via http that "UiPromoteCheck" "baseline" exist exactly "2" times

        # main compares directly against the promoted baseline (no fallback needed)
        Given I create "1" tests with:
            """
            testName: UiMainTest
            project: PromotionUiApp
            branch: main
            checks:
              - checkName: UiPromoteCheck
                filePath: files/A.png
            """
        Then I expect via http 1st check filtered as "name=UiPromoteCheck" matched:
            """
            name: UiPromoteCheck
            branch: main
            status: [passed]
            """
