@fast-server
Feature: Check Preview - Accept Icons View

  Background:
    #     Given I clear Database and stop Server
    #     Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Accept Icons View
    Given I create "1" tests with:
      """
          testName: TestName-Color
          checks:
            - checkName: CheckName-Color
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName-Color"

    Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" is "rgba(134,142,150,1)"

    # accepted in the same check
    When I accept the "CheckName-Color" check


    Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" is "rgba(64,192,87,1)"

    # accepted in the previous check
    Given I create "1" tests with:
      """
          testName: TestName-Color
          checks:
            - checkName: CheckName-Color
              filePath: files/A.png
      """

    When I go to "main" page
    When I unfold the test "TestName-Color"

    Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName-Color'] svg" is "rgba(64,192,87,1)"