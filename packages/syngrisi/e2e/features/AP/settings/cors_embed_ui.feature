@fast-server @smoke
Feature: Admin CORS & Embed UI
  Dedicated Admin page to manage credentialed cross-origin Accept settings.

  Scenario: Admin can enable CORS & Embed and persist allowed origins
    When I set env variables:
      """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
      SYNGRISI_DISABLE_DEV_CORS: "false"
      """
    Given I start Server
    And I clear database
    When I go to "cors" page
    When I wait 10 seconds for the element with locator "[data-test='cors-embed-enabled']" to be visible
    When I click element with locator "[data-test='cors-embed-enabled']"
    When I wait 10 seconds for the element with locator "[data-test='cors-embed-allowed-origins']:not([disabled])" to be visible
    When I fill "https://ci.example.com" into element with locator "[data-test='cors-embed-allowed-origins']"
    When I click element with locator "[data-test='cors-embed-save']"
    When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
    # Persist check via API (Mantine Switch aria attributes vary by version)
    When I get via http cors-embed settings
    Then I expect via http cors-embed settings to match:
      """
      enabled: true
      allowedOrigins:
        - "https://ci.example.com"
      """
    When I go to "cors" page
    When I wait 10 seconds for the element with locator "[data-test='cors-embed-allowed-origins']" to be visible
    Then the element with locator "[data-test='cors-embed-allowed-origins']" should have value "https://ci.example.com"
