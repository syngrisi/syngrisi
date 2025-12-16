Feature: Remove item

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage
        Given I create "2" tests with:
        """
          testName: TestName-$
          suiteName: SuiteName-$
          runName: RunName-$
          checks:
              - checkName: CheckName-1
        """

    Scenario: Remove Run
        When I go to "main" page
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be displayed
        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed

        # remove
        When I click on the element "[data-item-name='RunName-0'] button"
        When I wait on element "[data-item='remove-popover-action-icon_confirm']" to be displayed
        When I click on the element "[data-item='remove-popover-action-icon_confirm']"

        When I wait on element "[data-test='remove-item-modal-button']" to be displayed
        When I click on the element "[data-test='remove-item-modal-button']"

        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Run has been successfully removed']" to be displayed

        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to not be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be displayed
        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed

    Scenario: Remove Suite
        When I go to "main" page
        When I wait on element "select[data-test='navbar-group-by']" to exist
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-0')]" to be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-1')]" to be displayed
        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed

        # remove
        When I click on the element "[data-item-name='SuiteName-0'] button"
        When I wait on element "[data-item='remove-popover-action-icon_confirm']" to be displayed
        When I click on the element "[data-item='remove-popover-action-icon_confirm']"

        When I wait on element "[data-test='remove-item-modal-button']" to be displayed
        When I click on the element "[data-test='remove-item-modal-button']"

        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Suite has been successfully removed']" to be displayed

        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-0')]" to not be displayed
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-1')]" to be displayed
        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
