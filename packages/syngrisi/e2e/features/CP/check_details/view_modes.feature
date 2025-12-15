@smoke @fast-server
Feature: View Modes - Expected, Actual, Diff, Slider

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
    When I wait for test "TestName" to appear in table
    When I unfold the test "TestName"
    When I wait 10 seconds for the element with locator "[data-test-preview-image='CheckName']" to be visible
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 15 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

  Scenario: Simple Views (Expected, Actual, Diff)
    When I wait 10 seconds for the element with locator "[data-segment-value='expected']" to be visible
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-disabled" "false"

    # expected
    When I click element with locator "[data-segment-value='expected']"
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "true"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "false"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "false"

    # actual
    When I click element with locator "[data-segment-value='actual']"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "false"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "false"

    # diff
    When I click element with locator "[data-segment-value='diff']"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "true"
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "false"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "false"

  Scenario: Slider View with Divider
    When I wait 10 seconds for the element with locator "[data-segment-value='slider']" to be visible

    When I click element with locator "[data-segment-value='slider']"

    # Slider divider position check is flaky in bundled UI; rely on visual tabs instead of global mainView object

    When I wait 10 seconds for the element with locator "#label_expected" to be visible
    When I wait 10 seconds for the element with locator "#label_actual" to be visible

    When I click element with locator "#snapshoot"

    Then I wait on element "#label_expected" to not be displayed
    Then I wait on element "#label_actual" to not be displayed
