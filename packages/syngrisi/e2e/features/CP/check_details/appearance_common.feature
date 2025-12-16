@smoke @fast-server
Feature: Check Detail Appearance

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Check Detail Appearance
    # NEW
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

    # Header
    # status
    When I wait 10 seconds for the element with locator "[data-check-status-name='CheckName']" to be visible
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(34,139,230,1)"
    Then the element "[data-check-status-name='CheckName'] span" matches the text "NEW"

    # check 'path'
    Then the element "[data-check='app-name']" matches the text "Test App"
    Then the element with locator "[data-check='suite-name']" should have contains text "Integration suite"
    Then the element with locator "[data-check='test-name']" should have contains text "TestName"
    Then the element with locator "[data-check='check-name']" should have contains text "CheckName"

    # viewport
    Then the element with locator "[data-viewport-badge-name='CheckName']" should have contains text "1366x768"
    Then the css attribute "color" from element "[data-viewport-badge-name='CheckName']" is "rgba(34,139,230,1)"

    # os
    Then the element with locator "[data-check='os']" should have contains text "macOS"
    Then the element with locator "[data-check='os-icon']" should have contains HTML "<title>macOS</title>"

    # browser
    Then the element with locator "[data-check='browser']" should have contains text "chrome"
    Then the element with locator "[data-check='browser-icon']" should have contains HTML "<title>chrome"

    # Toolbar
    # image size
    Then the element with locator "[data-check='image-size']" should have contains text "744x464"
    Then the element with locator "[data-check='image-date'] span" should have contains text "<HH:mm:ss>"

    # default view
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"

    # view segment disabled states (NEW check)
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-disabled" "true"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-disabled" "true"
    Then the element with locator "[data-segment-value='slider']" should have attribute "data-segment-disabled" "true"

    # action icons (NEW check - no baseline yet, so add/save are disabled)
    Then  the element "[data-check='highlight-icon']" has attribute "data-disabled" "true"
    Then  the element "[data-check='remove-ignore-region']" has attribute "data-disabled" "true"
    Then  the element "[data-check='add-ignore-region']" has attribute "data-disabled" "true"
    Then  the element "[data-check='save-ignore-region']" has attribute "data-disabled" "true"

    # accept icon before acceptance - wait for loading=false first (use toolbar scope to avoid multiple matches)
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'][data-loading='false']" to be visible
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" to be visible
    Then the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"

    # accept icon after acceptance
    When I accept via http the 1st check with name "CheckName"
    When I refresh page
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'][data-loading='false']" to be visible
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" to be visible
    Then the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "color" from element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

    # PASSED
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """

    When I go to "main" page
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

    # Header
    # status
    When I wait 10 seconds for the element with locator "[data-check-status-name='CheckName']" to be visible
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(64,192,87,1)"
    Then the element "[data-check-status-name='CheckName'] span" matches the text "PASSED"

    # Toolbar
    # accept icon - wait for loading=false first (use toolbar scope)
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'][data-loading='false']" to be visible
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" to be visible
    Then the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

    # default view
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"

    # view segment disabled states (PASSED check)
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-disabled" "true"
    Then the element with locator "[data-segment-value='slider']" should have attribute "data-segment-disabled" "true"

    # action icons (PASSED check - has baseline, so add enabled, but no regions so save is disabled)
    Then  the element "[data-check='highlight-icon']" has attribute "data-disabled" "true"
    Then  the element "[data-check='remove-ignore-region']" has attribute "data-disabled" "true"
    Then  the element "[data-check='add-ignore-region']" does not have attribute "data-disabled" "true"
    Then  the element "[data-check='save-ignore-region']" has attribute "data-disabled" "true"

    # FAILED
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

    # Header
    # status
    When I wait 10 seconds for the element with locator "[data-check-status-name='CheckName']" to be visible
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"
    Then the element "[data-check-status-name='CheckName'] span" matches the text "FAILED"

    # Toolbar
    # accept icon - wait for loading=false first (use toolbar scope)
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'][data-loading='false']" to be visible
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" to be visible
    Then the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"
    # diff percent
    Then the element with locator "[data-check='diff-percent']" should have contains text "1.34%"

    # default view
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-active" "true"

    # view segment disabled states (FAILED check)
    Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='diff']" should have attribute "data-segment-disabled" "false"
    Then the element with locator "[data-segment-value='slider']" should have attribute "data-segment-disabled" "false"

    # action icons (FAILED check - has baseline, add enabled, but no regions so save is disabled)
    Then  the element "[data-check='highlight-icon']" does not have attribute "data-disabled" "true"
    Then  the element "[data-check='remove-ignore-region']" has attribute "data-disabled" "true"
    Then  the element "[data-check='add-ignore-region']" does not have attribute "data-disabled" "true"
    Then  the element "[data-check='save-ignore-region']" has attribute "data-disabled" "true"
