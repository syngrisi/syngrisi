@fast-server
Feature: Remove checks

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Remove check via check preview
    Given I create "1" tests with:
      """
          testName: TestName-RC
          checks:
            - checkName: CheckName-RC-1
              filePath: files/A.png
            - checkName: CheckName-RC-2
              filePath: files/A.png
      """
    When I go to "main" page
    When I wait for test "TestName-RC" to appear in table

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-RC']" to be visible
    When I unfold the test "TestName-RC"
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckName-RC-1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckName-RC-2']" to be visible

    When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to not be displayed
    When I wait on element "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to not be displayed
    When I wait 10 seconds for the element with locator "//*[text()='Test does not have any checks']" to not be displayed

    # first
    When I delete the "CheckName-RC-1" check
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be visible
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be visible
    When I wait on element "[data-table-check-name='CheckName-RC-1']" to not be displayed

    # second
    When I delete the "CheckName-RC-2" check
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be visible
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be visible
    When I wait on element "[data-table-check-name='CheckName-RC-2']" to not be displayed
    When I wait 10 seconds for the element with locator "//*[text()='Test does not have any checks']" to be visible

  @smoke
  Scenario: Remove check via Check Details Modal
    Given I create "2" tests with:
      """
          testName: TestName-RC-$
          checks:
            - checkName: CheckName-RC-1
              filePath: files/A.png
      """

    When I go to "main" page
    # Tests are created with indices 0 and 1; sorted by date desc, TestName-RC-1 appears first
    When I wait for test "TestName-RC-1" to appear in table
    # Also ensure TestName-RC-0 is loaded (may need refresh for second test)
    When I wait for test "TestName-RC-0" to appear in table

    When I wait on element "[data-table-check-name='CheckName-RC-1']" to not be displayed

    When I unfold the test "TestName-RC-1"
    When I wait for check "CheckName-RC-1" to appear in collapsed row of test "TestName-RC-1"

    When I open the 1st check "CheckName-RC-1"

    # second
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-RC-1'])[2]" to be visible
    Then the element "//*[@data-related-check-item='CheckName-RC-1']" does appear exactly "2" times
    When I click element with locator "(//*[@data-related-check-item='CheckName-RC-1'])[2]"


    When I wait 10 seconds for the element with locator "//*[@data-check-header-name]//*[@data-test='check-status']/span[text()='new']" to be visible

    When I delete check from modal

    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be visible
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be visible

    # check if modal was closed
    Then I wait on element "[data-test='full-check-path']" to not be displayed
    When I wait for check "CheckName-RC-1" to appear in collapsed row of test "TestName-RC-1"

    # first
    When I open the 1st check "CheckName-RC-1"
    When I wait 10 seconds for the element with locator "[data-check='check-name']" to be visible
    Then the element with locator "[data-check='check-name']" should have contains text "CheckName-RC-1"

    When I delete check from modal


    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Success']" to be visible
    When I wait 10 seconds for the element with locator "//*[contains(@class, 'mantine-Notification-body')]//div[text()='Check has been successfully removed']" to be visible

    # check if modal was closed
    Then I wait on element "[data-test='full-check-path']" to not be displayed

    # after modal close
    When I wait on element "[data-table-check-name='CheckName-RC-1']" to not be displayed
    When I wait 10 seconds for the element with locator "//*[text()='Test does not have any checks']" to be visible
