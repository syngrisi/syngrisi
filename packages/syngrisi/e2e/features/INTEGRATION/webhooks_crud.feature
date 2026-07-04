@fast-server @integration
Feature: Webhooks management API

    # Covers the CRUD surface added on top of the pre-existing webhook delivery
    # engine: POST/GET/PATCH/DELETE /v1/webhooks. See docs/WEBHOOKS.md.

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server
        And I clear database

    Scenario: Create, list, update and delete a webhook via the API
        When I create via http "webhook" with params:
            """
            url: "http://localhost:9999/webhooks-crud-test"
            events:
                - "test.finished"
            """
        Then I expect via http that "webhook" filtered as "url=webhooks-crud-test" exist exactly "1" times
        And I expect via http "webhook" filtered as "url=webhooks-crud-test" to match:
            """
            enabled: true
            events:
                - "test.finished"
            """
        When I update via http "webhook" filtered as "url=webhooks-crud-test" with params:
            """
            enabled: false
            """
        Then I expect via http "webhook" filtered as "url=webhooks-crud-test" to match:
            """
            enabled: false
            """
        When I delete via http "webhook" filtered as "url=webhooks-crud-test"
        Then I expect via http that "webhook" filtered as "url=webhooks-crud-test" exist exactly "0" times
