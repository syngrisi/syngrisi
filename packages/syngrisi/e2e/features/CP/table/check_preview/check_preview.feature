Feature: Check Preview - Display and Icons

  Background:
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

  @smoke
  Scenario: Checks Preview Modes
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName"

    When I click element with locator "[aria-label='Table settings, sorting, and columns visibility']"

    Then the css attribute "max-height" from element "[data-test-preview-image='CheckName'] img" is "153.6px"

    When I click element with locator "//*[@data-test='preview-mode-segment-control']//label[text()='normal']"

    Then the css attribute "max-height" from element "[data-test-preview-image='CheckName'] img" is "none"

    When I click element with locator "//*[@data-test='preview-mode-segment-control']//label[text()='list']"

    Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "76.7969px"

  Scenario: Checks Preview Sizes on Bounded mode
    Given I create "1" tests with:
      """
          testName: "TestName"
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName"

    When I click element with locator "[aria-label='Table settings, sorting, and columns visibility']"

    Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "113.75px"

    When I click element with locator "//*[@data-test='preview-size-segment-control']//label[text()='small']"

    Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "69.5938px"

    When I click element with locator "//*[@data-test='preview-size-segment-control']//label[text()='large']"

    Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "202.07px"

    When I click element with locator "//*[@data-test='preview-size-segment-control']//label[text()='xlarge']"

    Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "290.383px"

  Scenario: Checks Preview images visibilities
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName"

    When I execute javascript code:
      """
    return {url: document.querySelector("[alt='CheckName']").src}
      """

    When I open the url "<js:url>"
    When I wait 10 seconds for the element with locator "img" to be visible
