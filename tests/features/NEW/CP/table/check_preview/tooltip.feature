Feature: Check Preview - Tooltip

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Status View - Tooltip
        # NEW
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed

        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I accept the "CheckName" check

        When I wait on element "[data-check-tooltip-name='CheckName']" to not be displayed
        When I move to element "[data-test-preview-image='CheckName']"
        When I wait on element "[data-check-tooltip-name='CheckName']" to be displayed
        When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='status-label']" to contain text "New - first time check"
        When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='user-label']" to contain text "Syngrisi Guest"
        When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='os-label']" to contain text "<testPlatform>"
        When I expect that element "[data-check-tooltip-name='CheckName'] [data-test='browser-label']" to contain text "chrome"
