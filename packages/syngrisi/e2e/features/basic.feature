Feature: Syngrisi Basic Test

  @smoke
  Scenario: Application starts and responds
    Given the Syngrisi application is running
    When I open url "{{baseUrl}}"
    Then the page should be visible

