@m2m @jwt-auth @serial
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
            | headerName      | X-Kanopy-Internal-Authorization |
            | headerPrefix    | Bearer          |

        When I perform a visual check with a valid JWT token
        Then the check should be accepted
        And a user "jwt-service:test-client-id" should exist in the database

    Scenario: Valid M2M Authentication for baselines read
        Given I enable the "jwt-auth" plugin with the following config:
            | key             | value           |
            | jwksUrl         | {mockJwksUrl}   |
            | issuer          | e2e-test-issuer |
            | autoProvision   | true            |
            | serviceUserRole | user            |
            | headerName      | X-Kanopy-Internal-Authorization |
            | headerPrefix    | Bearer          |

        When I fetch baselines with a valid JWT token
        Then baselines response should be returned

    Scenario: Valid M2M Authentication (client_id without sub)
        Given I enable the "jwt-auth" plugin with the following config:
            | key             | value           |
            | jwksUrl         | {mockJwksUrl}   |
            | issuer          | e2e-test-issuer |
            | autoProvision   | true            |
            | serviceUserRole | user            |
            | headerName      | X-Kanopy-Internal-Authorization |
            | headerPrefix    | Bearer          |

        When I perform a visual check with a valid JWT token without sub
        Then the check should be accepted
        And a user "jwt-service:client-id-no-sub" should exist in the database

    Scenario: Auto-provision disabled should reject unknown service user
        Given I enable the "jwt-auth" plugin with the following config:
            | key             | value           |
            | jwksUrl         | {mockJwksUrl}   |
            | issuer          | e2e-test-issuer |
            | autoProvision   | false           |
            | serviceUserRole | user            |
            | headerName      | X-Kanopy-Internal-Authorization |
            | headerPrefix    | Bearer          |

        When I perform a visual check with a valid JWT token for client id "no-provision-client"
        Then the check should be rejected with status 401

    Scenario: Invalid M2M Authentication (Wrong Key)
        Given I enable the "jwt-auth" plugin with the following config:
            | key     | value           |
            | jwksUrl | {mockJwksUrl}   |
            | issuer  | e2e-test-issuer |
            | headerName | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer |

        When I perform a visual check with an invalid JWT token
        Then the check should be rejected with status 401

    Scenario: Invalid M2M Authentication (Issuer mismatch)
        Given I enable the "jwt-auth" plugin with the following config:
            | key     | value           |
            | jwksUrl | {mockJwksUrl}   |
            | issuer  | e2e-test-issuer |
            | headerName | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer |

        When I perform a visual check with a JWT token with invalid issuer
        Then the check should be rejected with status 401

    Scenario: Invalid M2M Authentication (Missing required scopes)
        Given I enable the "jwt-auth" plugin with the following config:
            | key            | value           |
            | jwksUrl        | {mockJwksUrl}   |
            | issuer         | e2e-test-issuer |
            | requiredScopes | syngrisi:admin  |
            | headerName     | X-Kanopy-Internal-Authorization |
            | headerPrefix   | Bearer |

        When I perform a visual check with a JWT token missing required scopes
        Then the check should be rejected with status 401

    Scenario: Invalid M2M Authentication (Audience mismatch)
        Given I enable the "jwt-auth" plugin with the following config:
            | key          | value           |
            | jwksUrl      | {mockJwksUrl}   |
            | issuer       | e2e-test-issuer |
            | audience     | syngrisi        |
            | headerName   | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer |

        When I perform a visual check with a JWT token with invalid audience
        Then the check should be rejected with status 401

    Scenario: Valid M2M Authentication (Audience match)
        Given I enable the "jwt-auth" plugin with the following config:
            | key          | value           |
            | jwksUrl      | {mockJwksUrl}   |
            | issuer       | e2e-test-issuer |
            | audience     | syngrisi        |
            | headerName   | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer |

        When I perform a visual check with a valid JWT token
        Then the check should be accepted

    Scenario: Valid M2M Authentication (Issuer host match)
        Given I enable the "jwt-auth" plugin with the following config:
            | key          | value                         |
            | jwksUrl      | {mockJwksUrl}                 |
            | issuer       | login.corp.mongodb.com        |
            | issuerMatch  | host                          |
            | headerName   | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer                        |

        When I perform a visual check with a valid JWT token with issuer "https://login.corp.mongodb.com/oauth2/default"
        Then the check should be accepted

    Scenario: Invalid M2M Authentication (Issuer host mismatch)
        Given I enable the "jwt-auth" plugin with the following config:
            | key          | value                         |
            | jwksUrl      | {mockJwksUrl}                 |
            | issuer       | login.corp.mongodb.com        |
            | issuerMatch  | host                          |
            | headerName   | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer                        |

        When I perform a visual check with a valid JWT token with issuer "https://evil.corp.mongodb.com/oauth2/default"
        Then the check should be rejected with status 401

    Scenario: Invalid M2M Authentication (Audience mismatch with issuer host match)
        Given I enable the "jwt-auth" plugin with the following config:
            | key          | value                         |
            | jwksUrl      | {mockJwksUrl}                 |
            | issuer       | login.corp.mongodb.com        |
            | issuerMatch  | host                          |
            | audience     | syngrisi                      |
            | headerName   | X-Kanopy-Internal-Authorization |
            | headerPrefix | Bearer                        |

        When I perform a visual check with a JWT token with invalid audience
        Then the check should be rejected with status 401
