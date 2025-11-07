Feature: Remove checks

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Remove check via check preview
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
              - checkName: CheckName-2
        """
        When I go to "main" page

        When I wait on element "[data-table-test-name='TestName']" to be displayed
        When I unfold the test "TestName"
        When I wait for "1" seconds
        When I wait on element "[data-table-check-name='CheckName-1']" to be displayed
        When I wait on element "[data-table-check-name='CheckName-2']" to be displayed

        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to not be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to not be displayed
        When I wait on element "text=Test does not have any checks" to not be displayed

        # first
        When I delete the "CheckName-1" check
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be displayed
        When I wait on element "[data-table-check-name='CheckName-1']" to not be displayed

        # second
        When I delete the "CheckName-2" check
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be displayed
        When I wait on element "[data-table-check-name='CheckName-2']" to not be displayed
        When I wait on element "text=Test does not have any checks" to be displayed

    @smoke
    Scenario: Remove check via Check Details Modal
        Given I create "2" tests with:
        """
          testName: TestName-$
          checks:
              - checkName: CheckName-1
        """

        When I go to "main" page

        When I wait on element "[data-table-check-name='CheckName-1']" to not be displayed

        When I unfold the test "TestName-1"
        When I wait on element "[data-table-check-name='CheckName-1']" to be displayed

        When I open the 1st check "CheckName-1"

        # second
        When I wait on element "(//*[@data-related-check-item='CheckName-1'])[2]" to be displayed
        Then I expect that element "//*[@data-related-check-item='CheckName-1']" does appear exactly "2" times
        When I click on the element "(//*[@data-related-check-item='CheckName-1'])[2]"


        When I wait on element "//*[@data-check-header-name]//*[@data-test='check-status']/span[text()='new']" to be displayed

        When I click on the element ".modal [data-test='check-remove-icon']"
        When I wait on element "[data-test='check-remove-icon-confirm']" to be displayed
        When I click on the element "[data-test='check-remove-icon-confirm']"

        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be displayed

        # check if modal was closed
        Then I wait on element "[data-test='full-check-path']" to not be displayed
        When I wait on element "[data-table-check-name='CheckName-1']" to be displayed

        # first
        When I open the 1st check "CheckName-1"
        When I wait on element "[data-check='check-name']" to be displayed
        Then the element "[data-check='check-name']" contains the text "CheckName-1"

        When I click on the element ".modal [data-test='check-remove-icon']"
        When I wait on element "[data-test='check-remove-icon-confirm']" to be displayed
        When I click on the element "[data-test='check-remove-icon-confirm']"


        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be displayed
        When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be displayed

        # check if modal was closed
        Then I wait on element "[data-test='full-check-path']" to not be displayed

        # after modal close
        When I wait on element "[data-table-check-name='CheckName-1']" to not be displayed
        When I wait on element "text=Test does not have any checks" to be displayed

