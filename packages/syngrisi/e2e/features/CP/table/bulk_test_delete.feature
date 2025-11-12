Feature: Bulk test Delete

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Delete 2 tests
        Given I create "2" tests with:
        """
          testName: TestName-$
          checks:
              - checkName: CheckName
        """
        When I go to "main" page

        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible

        When I click element with locator "[data-test-checkbox-name=TestName-0]"
        When I click element with locator "[data-test-checkbox-name=TestName-1]"
        When I wait 30 seconds for the element with locator "[data-test='table-remove-tests']" to be visible
        When I click element with locator "[data-test='table-remove-tests']"
        Then the element with locator ".mantine-Modal-modal" should have contains text "Remove selected tests?"
        Then the element with locator ".mantine-Modal-modal" should have contains text "Are you sure you want to permanently delete the selected tests?"
        When I wait 30 seconds for the element with locator "[data-test='confirm-remove-test-icon']" to be visible

        When I click element with locator "[data-test='confirm-remove-test-icon']"

        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed

        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed


