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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(34,139,230,1)"
        Then I expect that element "[data-check-status-name='CheckName'] span" to have text "NEW"

        # check 'path'
        Then I expect that element "[data-check='app-name']" to have text "Test App"
        Then I expect that element "[data-check='suite-name']" to contain text "Integration suite"
        Then I expect that element "[data-check='test-name']" to contain text "TestName"
        Then I expect that element "[data-check='check-name']" to contain text "CheckName"

        # viewport
        Then I expect that element "[data-viewport-badge-name='CheckName']" to contain text "1366X768"
        Then I expect that the css attribute "color" from element "[data-viewport-badge-name='CheckName']" is "rgba(34,139,230,1)"

        # os
        Then I expect that element "[data-check='os']" to contain text "macOS"
        Then I expect that element "[data-check='os-icon']" to contain HTML "<title>macOS</title>"

        # browser
        Then I expect that element "[data-check='browser']" to contain text "chrome"
        Then I expect that element "[data-check='browser-icon']" to contain HTML "<title>chrome"

        # Toolbar
        # image size
        Then I expect that element "[data-check='image-size']" to contain text "744X464"
        Then I expect that element "[data-check='image-date'] span" to contain text "<YYYY-MM-DD>"


        # default view
        Then I expect that element "//*[@data-check='actual-view']/.." has the class "mantine-SegmentedControl-labelActive"

        # accept icon before acceptance
        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"

        # accept icon after acceptance
        When I accept via http the 1st check with name "CheckName"
        When I refresh page
        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "fill"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(64,192,87,1)"
        Then I expect that element "[data-check-status-name='CheckName'] span" to have text "PASSED"

        # Toolbar
        # accept icon
        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

        # default view
        Then I expect that element "//*[@data-check='actual-view']/.." has the class "mantine-SegmentedControl-labelActive"

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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # Header
        # status
        Then I wait on element "[data-check-status-name='CheckName']" to be displayed
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"
        Then I expect that element "[data-check-status-name='CheckName'] span" to have text "FAILED"

        # Toolbar
        # accept icon
        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"
        # diff percent
        Then I expect that element "[data-check='diff-percent']" to contain text "1.34%"

        # default view
        Then I expect that element "//*[@data-check='diff-view']/.." has the class "mantine-SegmentedControl-labelActive"
