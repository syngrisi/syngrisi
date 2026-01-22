@m2m @jwt-auth @validation @mode:serial @no-app-start
Feature: JWT Plugin Configuration Validation

    Scenario: Server should fail to start with missing JWKS URL
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_PLUGINS_ENABLED: jwt-auth
            SYNGRISI_PLUGIN_JWT_AUTH_ISSUER: test-issuer
            """
        When I try to start Server
        Then the server should fail to start
        And the error message should contain "Missing required configuration for \"jwt-auth\" plugin"
        And the error message should contain "SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL"

    Scenario: Server should fail to start with missing Issuer
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_PLUGINS_ENABLED: jwt-auth
            SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL: https://example.com/jwks.json
            """
        When I try to start Server
        Then the server should fail to start
        And the error message should contain "Missing required configuration for \"jwt-auth\" plugin"
        And the error message should contain "SYNGRISI_PLUGIN_JWT_AUTH_ISSUER"

    Scenario: Server should fail to start with invalid JWKS URL format
        Given I clear plugin "jwt-auth" settings from database
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_PLUGINS_ENABLED: jwt-auth
            SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL: not-a-valid-url
            SYNGRISI_PLUGIN_JWT_AUTH_ISSUER: test-issuer
            """
        When I try to start Server
        Then the server should fail to start
        And the error message should contain "Invalid JWKS URL"

    Scenario: Runtime validation via Admin API - Missing JWKS URL
        Given I clear plugin "jwt-auth" settings from database
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_DISABLE_FIRST_RUN: true
            """
        And I start Server
        When I update plugin "jwt-auth" settings via API:
            """
            {
                "enabled": true,
                "settings": {
                    "issuer": "test-issuer"
                }
            }
            """
        Then the API response status should be 400
        And the API response should contain "Missing required configuration"
        And the API response should contain "jwksUrl and issuer are required"

    Scenario: Runtime validation via Admin API - Invalid JWKS URL format
        Given I clear plugin "jwt-auth" settings from database
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_DISABLE_FIRST_RUN: true
            """
        And I start Server
        When I update plugin "jwt-auth" settings via API:
            """
            {
                "enabled": true,
                "settings": {
                    "jwksUrl": "not-a-url",
                    "issuer": "test-issuer"
                }
            }
            """
        Then the API response status should be 400
        And the API response should contain "Invalid JWKS URL format"

    Scenario: Valid configuration should be accepted
        Given I clear plugin "jwt-auth" settings from database
        Given I set env variables:
            """
            SYNGRISI_AUTH: false
            SYNGRISI_TEST_MODE: true
            SYNGRISI_PLUGINS_ENABLED: jwt-auth
            SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL: https://example.com/.well-known/jwks.json
            SYNGRISI_PLUGIN_JWT_AUTH_ISSUER: test-issuer
            SYNGRISI_PLUGIN_JWT_AUTH_ENABLED: true
            """
        When I start Server
        Then the server should start successfully
        And plugin "jwt-auth" should be loaded
