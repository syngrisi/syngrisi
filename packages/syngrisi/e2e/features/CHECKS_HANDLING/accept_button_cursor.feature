@fast-server
Feature: Accept Button Cursor

  This test verifies that Accept and Remove buttons in check modal have the correct cursor style.

  Background:
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Accept and Remove buttons should have pointer cursor
    # Create a NEW check
    Given I create "1" tests with:
      """
      testName: TestName-CursorCheck
      checks:
        - checkName: CheckName-CursorCheck
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-CursorCheck']" to be visible
    When I unfold the test "TestName-CursorCheck"

    # Open modal
    When I open the 1st check "CheckName-CursorCheck"

    # Verify accept button cursor
    Then the element with locator ".modal [data-test='check-accept-icon']" should be visible
    Then the css attribute "cursor" from element ".modal [data-test='check-accept-icon']" is "pointer"

    # Verify remove button cursor
    Then the element with locator ".modal [data-test='check-remove-icon']" should be visible
    Then the css attribute "cursor" from element ".modal [data-test='check-remove-icon']" is "pointer"

    # Accept the check and verify cursor changes to default
    When I click element with locator ".modal [data-test='check-accept-icon']"
    Then I wait 5 seconds for the element with locator "[data-test='check-accept-icon-confirm']" to be visible
    When I click element with locator "[data-test='check-accept-icon-confirm']"
    
    # Wait for accept to complete (icon changes)
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"
    
    # Verify cursor is now default for accepted check
    Then the css attribute "cursor" from element ".modal [data-test='check-accept-icon']" is "default"
