@fast-server @integration
Feature: GitHub commit-status integration

    # Covers reporting a run's outcome back to GitHub as a commit status (POST
    # /repos/{owner}/{repo}/statuses/{sha}), fired fire-and-forget from endSession.
    # See docs/environment_variables.md (SYNGRISI_GITHUB_TOKEN/_REPO/_PUBLIC_URL/_API_URL).

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            SYNGRISI_GITHUB_TOKEN: "test-gh-token"
            SYNGRISI_GITHUB_REPO: "acme/widgets"
            SYNGRISI_PUBLIC_URL: "http://localhost:8080"
            """
        Given I start Server
        And I clear database
        And I start a GitHub status stub server

    Scenario: A finished session with a commit reports a success status to GitHub
        Given I create a "wdio" Syngrisi driver
        When I start an SDK test session for app "GithubStatusApp" with commit "a1b2c3d"
        Then the SDK check "Home" with image "files/A.png" has status "new"
        When I accept the last SDK check
        Then the SDK check "Home" with image "files/A.png" has status "passed"
        When I stop the SDK test session
        Then the GitHub status stub should have received a status POST for commit "a1b2c3d" with state "success"

    Scenario: A finished session without a commit never calls GitHub
        Given I create a "wdio" Syngrisi driver
        When I start an SDK test session for app "GithubStatusApp"
        Then the SDK check "NoCommit" with image "files/A.png" has status "new"
        When I stop the SDK test session
        Then the GitHub status stub should have received no requests
