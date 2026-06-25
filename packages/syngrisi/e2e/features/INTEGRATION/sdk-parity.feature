@fast-server @integration
Feature: SDK integration parity (playwright-sdk & wdio-sdk)

    # The playwright-sdk and wdio-sdk expose an identical public API, so every scenario here is
    # generic and runs against BOTH SDKs via the <sdk> Scenario Outline parameter — only the
    # driver construction differs (WDIODriver vs PlaywrightDriver(page)). Checks run against a
    # live Syngrisi server with real image comparison (A.png == baseline → passed, B.png → failed).

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server
        And I clear database

    Scenario Outline: Full visual-check lifecycle via the <sdk> SDK
        Given I create a "<sdk>" Syngrisi driver
        When I start an SDK test session for app "ParityApp"
        Then the SDK check "Home" with image "files/A.png" has status "new"
        When I accept the last SDK check
        Then the SDK check "Home" with image "files/A.png" has status "passed"
        And the SDK check "Home" with image "files/B.png" has status "failed"
        Then getBaselines for check "Home" returns at least 1 result
        And getSnapshots for check "Home" returns at least 1 result
        When I set ignore regions on the last baseline
        Then the last baseline has ignore regions
        When I stop the SDK test session

        Examples:
            | sdk        |
            | wdio       |
            | playwright |

    Scenario Outline: Auto-accept new baselines via the <sdk> SDK
        Given I create a "<sdk>" Syngrisi driver with auto-accept
        When I start an SDK test session for app "ParityAutoApp"
        Then the SDK check "Auto" with image "files/A.png" has status "new"
        And the SDK check "Auto" with image "files/A.png" has status "passed"
        When I stop the SDK test session

        Examples:
            | sdk        |
            | wdio       |
            | playwright |

    Scenario: core-api returns an error object instead of throwing on a bad request
        Given I create a core-api client
        Then accepting a non-existent check returns an error object
        And getBaselines with a no-match filter yields no baselines
