@fast-server @integration @smoke
Feature: CORS & Embed API
  # Covers Admin-managed credentialed CORS (docs/CORS_EMBED.md):
  # settings CRUD, preflight headers, CSRF on cross-origin mutating calls,
  # and cross-origin Accept role guard.

  Background:
    When I set env variables:
      """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
      SYNGRISI_DISABLE_DEV_CORS: "false"
      """
    Given I start Server
    And I clear database

  Scenario: Update and read cors-embed settings via API
    When I update via http cors-embed settings with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
        - "reviewer"
      allowedAcceptStatuses:
        - "new"
        - "different_images"
      frameAncestors: []
      """
    When I get via http cors-embed settings
    Then I expect via http cors-embed settings to match:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
        - "reviewer"
      """

  Scenario: Preflight echoes Allow-Origin only for allowlisted origins
    When I update via http cors-embed settings with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
      allowedAcceptStatuses:
        - "new"
        - "not_accepted"
        - "different_images"
        - "wrong_dimensions"
      frameAncestors: []
      """
    When I send via http OPTIONS "/v1/cors-embed/status" with Origin "https://ci.example.com"
    Then I expect the last HTTP status to be 204
    Then I expect the last CORS Allow-Origin header to be "https://ci.example.com"
    Then I expect the last CORS Allow-Credentials header to be "true"
    When I send via http OPTIONS "/v1/cors-embed/status" with Origin "https://evil.example.com"
    Then I expect the last CORS Allow-Origin header to be ""

  Scenario: Cross-origin mutating request requires CSRF token
    When I set env variables:
      """
      SYNGRISI_AUTH: "true"
      SYNGRISI_TEST_MODE: "true"
      SYNGRISI_DISABLE_DEV_CORS: "false"
      """
    Given I stop Server
    Given I start Server
    And I clear database
    When I create via http test user
    When I login via http with user:"Test" password "123456aA-"
    When I update via http cors-embed settings with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
        - "reviewer"
      allowedAcceptStatuses:
        - "new"
        - "not_accepted"
        - "different_images"
        - "wrong_dimensions"
      frameAncestors: []
      """
    When I get via http cors-embed csrf token
    When I update via http cors-embed settings from Origin "https://ci.example.com" with csrf "none" expecting status 403 with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
      allowedAcceptStatuses:
        - "new"
      frameAncestors: []
      """
    When I update via http cors-embed settings from Origin "https://ci.example.com" with csrf "stored" expecting status 200 with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
        - "https://allure.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
        - "reviewer"
      allowedAcceptStatuses:
        - "new"
        - "different_images"
      frameAncestors: []
      """
    When I get via http cors-embed settings
    Then I expect via http cors-embed settings to match:
      """
      allowedOrigins:
        - "https://ci.example.com"
        - "https://allure.example.com"
      """

  Scenario: Cross-origin Accept rejects roles outside allowedAcceptRoles
    When I set env variables:
      """
      SYNGRISI_AUTH: "true"
      SYNGRISI_TEST_MODE: "true"
      SYNGRISI_DISABLE_DEV_CORS: "false"
      """
    Given I stop Server
    Given I start Server
    And I clear database
    When I create via http test user
    When I login via http with user:"Test" password "123456aA-"
    When I update via http cors-embed settings with params:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      allowCredentials: true
      sameSite: "lax"
      csrfRequired: true
      allowedAcceptRoles:
        - "admin"
      allowedAcceptStatuses:
        - "new"
        - "not_accepted"
        - "different_images"
        - "wrong_dimensions"
      frameAncestors: []
      """
    Given I create "1" tests with:
      """
      testName: CorsEmbedAcceptTest
      project: CorsEmbedApp
      branch: main
      checks:
        - checkName: CorsEmbedAcceptCheck
          filePath: files/A.png
      """
    When I store via http the 1st check with name "CorsEmbedAcceptCheck" as "corsAcceptCheck"
    When I create via http user as:"Test" with params:
      """
      {
          "username": "cors_user",
          "firstName": "Cors",
          "lastName": "User",
          "password": "Password-123",
          "role": "user"
      }
      """
    When I login via http with user:"cors_user" password "Password-123"
    When I get via http cors-embed csrf token
    When I accept via http stored check "corsAcceptCheck" from Origin "https://ci.example.com" with csrf "stored" expecting status 403
    When I login via http with user:"Test" password "123456aA-"
    When I get via http cors-embed csrf token
    When I accept via http stored check "corsAcceptCheck" from Origin "https://ci.example.com" with csrf "stored" expecting status 200
