@smoke @fast-server
Feature: Simple Views - Expected, Actual, Diff

  Background:
  When I open the app
  When I clear local storage
  Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
  When I accept via http the 1st check with name "CheckName"
  Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/B.png
      """
  When I go to "main" page
  When I unfold the test "TestName"
  When I click element with locator "[data-test-preview-image='CheckName']"
  When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

  Scenario: Simple Views (Expected, Actual, Diff)
  When I wait 10 seconds for the element with locator "[data-segment-value='expected']" to be visible
  Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-disabled" "false"
  # Wait for React state to stabilize before interacting with segment control
  When I pause for 500 ms

  # expected
  When I click element with locator "[data-segment-value='expected']"
  When I pause for 300 ms
  Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "true"
  Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "false"
  Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "false"

  # actual
  When I click element with locator "[data-segment-value='actual']"
  When I pause for 300 ms
  Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "false"
  Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"
  Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "false"

  # diff
  When I click element with locator "[data-segment-value='diff']"
  When I pause for 300 ms
  Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "false"
  Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "false"
  Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "true"
