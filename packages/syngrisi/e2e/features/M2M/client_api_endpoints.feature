@client-api @serial
Feature: Client API endpoints without mocks

    Scenario: Client endpoints should work with real local auth
        Given I prepare client API auth for local server
        When I start a client session via API
        And I create a client check via API
        And I fetch client baselines via API
        And I fetch client snapshots via API
        And I fetch client ident via API
        And I stop the client session via API
        Then all client API endpoint calls should succeed
