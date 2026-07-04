@fast-server @integration
Feature: run.finished webhook delivery

    # Covers the `run.finished` webhook event: fired once a run's last test finishes
    # (see test-run.service.ts endSession's stillRunning===0 gate). Delivery reuses the
    # pre-existing webhook engine (webhook.service.ts triggerWebhooks), driven end-to-end
    # via a real SDK session against a local HTTP stub that records deliveries.

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server
        And I clear database
        And I start a webhook stub server

    Scenario: A run's last test finishing fires a run.finished webhook
        When I create via http "webhook" with params:
            """
            url: "<webhookStubUrl>"
            events:
                - "run.finished"
            """
        Given I create a "wdio" Syngrisi driver
        When I start an SDK test session for app "RunFinishedApp"
        Then the SDK check "Home" with image "files/A.png" has status "new"
        When I stop the SDK test session
        Then the webhook stub should have received a POST for event "run.finished"
