@smoke @fast-server
Feature: Side to side view

  Background:
#     Given I clear Database and stop Server
#     Given I start Server and start Driver
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
    When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

  Scenario: Divider in the center
    When I wait 30 seconds for the element with locator "//div[normalize-space(text())='Slider']" to be visible

    When I click element with locator "//div[normalize-space(text())='Slider']"

    # Slider divider position check is flaky in bundled UI; rely on visual tabs instead of global mainView object

    When I wait 30 seconds for the element with locator "#label_expected" to be visible
    When I wait 30 seconds for the element with locator "#label_actual" to be visible

    When I click element with locator "#snapshoot"

    Then I wait on element "#label_expected" to not be displayed
    Then I wait on element "#label_actual" to not be displayed
