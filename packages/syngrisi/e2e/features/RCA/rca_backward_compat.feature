@fast-server @smoke
Feature: RCA Backward Compatibility

  Background:
    When I open the app
    When I clear local storage

  Scenario: Check creation works without DOM data (simulates old SDK)
    # This test verifies that checks created without DOM data
    # (as old SDK versions would do) still work correctly
    Given I create "1" tests with:
      """
      testName: TestName-BackwardCompat
      checks:
        - checkName: CheckName-NoDom
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-BackwardCompat']" to be visible
    # Verify the check was created successfully
    Then the element with locator "[data-table-test-name='TestName-BackwardCompat']" should be visible

  Scenario: RCA panel shows graceful error for checks without DOM data
    # This test verifies that the new UI with RCA feature
    # handles old checks (without DOM data) gracefully
    Given I create "1" tests with:
      """
      testName: TestName-NoDomUI
      checks:
        - checkName: CheckName-NoDomUI
          filePath: files/B.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-NoDomUI']" to be visible
    When I unfold the test "TestName-NoDomUI"
    When I open the 1st check "CheckName-NoDomUI"

    # Open RCA panel
    When I click element with locator "[data-test='rca-toggle-button']"

    # Verify RCA panel shows error state (no DOM snapshot available)
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible
    Then the element with locator "[data-test='rca-panel']" should have attribute "data-test-state" "error"
    Then the element with locator "[data-test='rca-error-message']" should be visible
