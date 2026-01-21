@m2m @jwt-auth
Feature: JWT M2M Authentication

    Background:
    # Server started by fixture

    Scenario: Valid M2M Authentication
        Given I enable the "jwt-auth" plugin with the following config:
            | key             | value           |
            | jwksUrl         | {mockJwksUrl}   |
            | issuer          | e2e-test-issuer |
            | autoProvision   | true            |
            | serviceUserRole | user            |
            | headerName      | Authorization   |
            | headerPrefix    | Bearer          |

        When I perform a visual check with a valid JWT token
        Then the check should be accepted
        And a user "jwt-service:test-client-id" should exist in the database

    Scenario: Invalid M2M Authentication (Wrong Key)
        Given I enable the "jwt-auth" plugin with the following config:
            | key     | value           |
            | jwksUrl | {mockJwksUrl}   |
            | issuer  | e2e-test-issuer |

        When I perform a visual check with an invalid JWT token
        Then the check should be rejected with status 401
