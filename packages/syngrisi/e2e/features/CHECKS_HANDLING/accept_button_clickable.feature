@fast-server
Feature: Accept Button Clickable

  This test verifies that Accept and Remove buttons in check modal are clickable
  using real browser clicks (not dispatchEvent). This catches CSS pointer-events bugs
  that break user interactions but are bypassed by dispatchEvent in E2E tests.

  Background:
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Accept button should be clickable with real click in modal
    # Create a NEW check
    Given I create "1" tests with:
      """
      testName: TestName-ClickableButtons
      checks:
        - checkName: CheckName-ClickableButtons
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-ClickableButtons']" to be visible
    When I unfold the test "TestName-ClickableButtons"

    # Open modal
    When I open the 1st check "CheckName-ClickableButtons"

    # Verify accept button exists and is visible
    Then the element with locator ".modal [data-test='check-accept-icon']" should be visible

    # Click accept button using REAL click (not dispatchEvent)
    # This will fail if pointerEvents: none blocks the click
    When I real click element with locator ".modal [data-test='check-accept-icon']"

    # Verify confirmation popup appears (this proves the click worked)
    Then I wait 5 seconds for the element with locator "[data-test='check-accept-icon-confirm']" to be visible

    # Click confirm button
    When I click element with locator "[data-test='check-accept-icon-confirm']"

    # Verify check is accepted (icon changes to filled green)
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"

  @smoke
  Scenario: Remove button should be clickable with real click in modal
    # Create a check first
    Given I create "1" tests with:
      """
      testName: TestName-RemoveClickable
      checks:
        - checkName: CheckName-RemoveClickable
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName-RemoveClickable']" to be visible
    When I unfold the test "TestName-RemoveClickable"

    # Open modal
    When I open the 1st check "CheckName-RemoveClickable"

    # Verify remove button exists and is visible
    Then the element with locator ".modal [data-test='check-remove-icon']" should be visible

    # Click remove button using REAL click (not dispatchEvent)
    When I real click element with locator ".modal [data-test='check-remove-icon']"

    # Verify confirmation popup appears (this proves the click worked)
    Then I wait 5 seconds for the element with locator "[data-test='check-remove-icon-confirm']" to be visible
