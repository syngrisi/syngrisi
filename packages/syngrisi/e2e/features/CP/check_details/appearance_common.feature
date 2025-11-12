@smoke
Feature: Check Detail Appearance

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
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
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
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
        Then the element "[data-check='os-icon']" contains HTML "<title>macOS</title>"

        # browser
        Then the element with locator "[data-check='browser']" should have contains text "chrome"
        Then the element "[data-check='browser-icon']" contains HTML "<title>chrome"

        # Toolbar
        # image size
        Then the element with locator "[data-check='image-size']" should have contains text "744x464"
        Then the element with locator "[data-check='image-date'] span" should have contains text "<YYYY-MM-DD>"

        # default view
        Then the element "//*[@data-check='actual-view']/.." has the class "mantine-SegmentedControl-labelActive"

        # accept icon before acceptance
        Then the element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" has attribute "data-test-icon-type" "outline"
        Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"

        # accept icon after acceptance
        When I accept via http the 1st check with name "CheckName"
        When I refresh page
        Then the element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" has attribute "data-test-icon-type" "fill"
        Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

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
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
        Then the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(64,192,87,1)"
        Then the element "[data-check-status-name='CheckName'] span" matches the text "PASSED"

        # Toolbar
        # accept icon
        Then the element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" has attribute "data-test-icon-type" "outline"
        Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

        # default view
        Then the element "//*[@data-check='actual-view']/.." has the class "mantine-SegmentedControl-labelActive"

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
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
        Then the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"
        Then the element "[data-check-status-name='CheckName'] span" matches the text "FAILED"

        # Toolbar
        # accept icon
        Then the element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" has attribute "data-test-icon-type" "outline"
        Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"
        # diff percent
        Then the element with locator "[data-check='diff-percent']" should have contains text "1.34%"

        # default view
        Then the element "//*[@data-check='diff-view']/.." has the class "mantine-SegmentedControl-labelActive"

