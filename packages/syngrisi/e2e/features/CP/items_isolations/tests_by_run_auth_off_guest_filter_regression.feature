@serial
Feature: Run page should show tests when auth is disabled

  Scenario: Tests created by non-Guest are hidden after switching to auth disabled
    Given I clear Database and stop Server

    When I set env variables:
    """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: true
    """
    Given I start Server and start Driver
    When I open the app

    Given I create "1" tests with:
      """
      testName: TestRun-AuthSwitch
      runName: Run-AuthSwitch
      runIdent: Run-AuthSwitch-Ident
      checks:
        - checkName: Check-AuthSwitch
          filePath: files/A.png
      """

    When I stop the Syngrisi server
    When I set env variables:
    """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
    """
    Given I start Server
    When I go to "main" page

    When I click element with locator "[data-item-name='Run-AuthSwitch']"
    Then the element with locator "[data-table-test-name='TestRun-AuthSwitch']" should be visible
