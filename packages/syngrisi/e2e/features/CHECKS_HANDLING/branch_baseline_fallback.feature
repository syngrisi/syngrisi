@fast-server
Feature: Branch baseline fallback to the project's main branch
    When no accepted baseline exists for a check's own branch, and the project has a configured
    `mainBranch`, the check is compared against the main branch's accepted baseline instead of
    landing as `new`/`not_accepted`. Accepting stays branch-scoped: accepting a check still creates
    a baseline for the check's own branch (untouched by this feature).

    Background:
        Given I clear database

    @smoke
    Scenario: A feature branch check with the same image as main's accepted baseline passes
        Given I create "1" tests with:
            """
            testName: MainBranchTest
            project: BranchFallbackAppSame
            branch: main
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "FallbackCheck"
        And the project "BranchFallbackAppSame" has main branch "main"

        Given I create "1" tests with:
            """
            testName: FeatureBranchTest
            project: BranchFallbackAppSame
            branch: feature-x
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """

        Then I expect via http 1st check filtered as "name=FallbackCheck" matched:
            """
            name: FallbackCheck
            branch: feature-x
            status: [passed]
            """

    Scenario: A feature branch check with a different image than main's accepted baseline fails (compared, not "new")
        Given I create "1" tests with:
            """
            testName: MainBranchTest
            project: BranchFallbackAppDiff
            branch: main
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "FallbackCheck"
        And the project "BranchFallbackAppDiff" has main branch "main"

        Given I create "1" tests with:
            """
            testName: FeatureBranchTest
            project: BranchFallbackAppDiff
            branch: feature-x
            checks:
              - checkName: FallbackCheck
                filePath: files/B.png
            """

        Then I expect via http 1st check filtered as "name=FallbackCheck" matched:
            """
            name: FallbackCheck
            branch: feature-x
            status: [failed]
            failReasons: [different_images]
            """

    Scenario: Regression control - without a configured main branch, a feature branch check is still "new"
        Given I create "1" tests with:
            """
            testName: MainBranchTest
            project: BranchFallbackAppControl
            branch: main
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "FallbackCheck"
        # mainBranch is intentionally left unset for this project

        Given I create "1" tests with:
            """
            testName: FeatureBranchTest
            project: BranchFallbackAppControl
            branch: feature-x
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """

        Then I expect via http 1st check filtered as "name=FallbackCheck" matched:
            """
            name: FallbackCheck
            branch: feature-x
            status: [new]
            """

    Scenario: Setting the project's main branch via the API persists it
        Given I create "1" tests with:
            """
            testName: MainBranchTest
            project: BranchFallbackAppSetting
            branch: main
            checks:
              - checkName: FallbackCheck
                filePath: files/A.png
            """
        When I accept via http the 1st check with name "FallbackCheck"

        Then I expect via http 1st check filtered as "name=FallbackCheck" matched:
            """
            name: FallbackCheck
            branch: main
            markedAs: accepted
            status: [new]
            """

        Given the project "BranchFallbackAppSetting" has main branch "main"
        Then the project "BranchFallbackAppSetting" main branch is "main"
