@fast-server @mode:serial
Feature: RCA (Root Cause Analysis) Panel

  Background:
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Open RCA panel via button - shows error when no DOM snapshot
    # Create a check without DOM snapshot
    Given I create "1" tests with:
      """
      testName: TestName-RCA-NoSnapshot
      checks:
        - checkName: CheckName-RCA
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-NoSnapshot']" to be visible
    When I unfold the test "TestName-RCA-NoSnapshot"
    When I open the 1st check "CheckName-RCA"

    # Click RCA toggle button
    When I click element with locator "[data-test='rca-toggle-button']"

    # Verify RCA panel appears with error state (no DOM snapshot available)
    When I wait 30 seconds for the element with locator "[data-test='rca-panel']" to be visible
    Then the element with locator "[data-test='rca-panel']" should have attribute "data-test-state" "error"
    Then the element with locator "[data-test='rca-error-message']" should be visible

  Scenario: Open RCA panel via keyboard shortcut (D key)
    Given I create "1" tests with:
      """
      testName: TestName-RCA-Hotkey
      checks:
        - checkName: CheckName-RCA-HK
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-Hotkey']" to be visible
    When I unfold the test "TestName-RCA-Hotkey"
    When I open the 1st check "CheckName-RCA-HK"

    # Press D key to toggle RCA
    When I press the "d" key

    # Verify RCA panel appears
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible
    Then the element with locator "[data-test='rca-panel']" should be visible

  Scenario: Toggle RCA panel on and off
    Given I create "1" tests with:
      """
      testName: TestName-RCA-Toggle
      checks:
        - checkName: CheckName-RCA-TG
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-Toggle']" to be visible
    When I unfold the test "TestName-RCA-Toggle"
    When I open the 1st check "CheckName-RCA-TG"

    # Open RCA panel
    When I click element with locator "[data-test='rca-toggle-button']"
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible

    # Close RCA panel by clicking button again
    When I click element with locator "[data-test='rca-toggle-button']"
    When I wait on element "[data-test='rca-panel']" to not be displayed

  Scenario: RCA toggle button is active when panel is open
    Given I create "1" tests with:
      """
      testName: TestName-RCA-ButtonState
      checks:
        - checkName: CheckName-RCA-BS
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-ButtonState']" to be visible
    When I unfold the test "TestName-RCA-ButtonState"
    When I open the 1st check "CheckName-RCA-BS"

    # Verify initial button state (not active)
    Then the element "[data-test='rca-toggle-button']" does not have attribute "data-mantine-variant" "filled"

    # Open RCA panel
    When I click element with locator "[data-test='rca-toggle-button']"
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible

    # Verify button becomes active (filled variant)
    # Note: Mantine ActionIcon with variant="filled" gets data-variant attribute
    Then the element with locator "[data-test='rca-toggle-button']" should be visible

  Scenario: RCA panel closes when check modal is closed
    Given I create "1" tests with:
      """
      testName: TestName-RCA-ModalClose
      checks:
        - checkName: CheckName-RCA-MC
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-ModalClose']" to be visible
    When I unfold the test "TestName-RCA-ModalClose"
    When I open the 1st check "CheckName-RCA-MC"

    # Open RCA panel
    When I click element with locator "[data-test='rca-toggle-button']"
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible

    # Close the modal (press Escape)
    When I press the "Escape" key

    # Verify both modal and RCA panel are closed
    When I wait on element "[data-test='rca-panel']" to not exist

  Scenario: Resize RCA panel via drag handle
    Given I create "1" tests with:
      """
      testName: TestName-RCA-Resize
      checks:
        - checkName: CheckName-RCA-RS
          filePath: files/A.png
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RCA-Resize']" to be visible
    When I unfold the test "TestName-RCA-Resize"
    When I open the 1st check "CheckName-RCA-RS"

    # Open RCA panel
    When I click element with locator "[data-test='rca-toggle-button']"
    When I wait 10 seconds for the element with locator "[data-test='rca-panel']" to be visible
    Then the css attribute "width" from element "[data-test='rca-panel-container']" is "500px"

    # Drag the resize handle to the left (increase width by 300px)
    When I drag the element with locator "[data-test='rca-panel-resize-handle']" by offset -300, 0
    Then the css attribute "width" from element "[data-test='rca-panel-container']" is "800px"

    # Drag excessively to the right to hit the minimum width constraint (300px)
    When I drag the element with locator "[data-test='rca-panel-resize-handle']" by offset 1000, 0
    Then the css attribute "width" from element "[data-test='rca-panel-container']" is "300px"
    Then the element with locator "[data-test='rca-panel']" should be visible
