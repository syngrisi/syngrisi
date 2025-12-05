@smoke @fast-server
Feature: Infinity scroll

  Background:

    When I clear database
    When I open the app
    When I clear local storage

  Scenario: Infinity scroll
    When I create "22" tests with:
      """
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page
    # Wait for data to be indexed, then use reliable wait for tests to appear
    When I wait for test "TestName-21" to appear in table
    # Wait for initial load with polling (extended timeout for CI stability)
    Then the element "//*[@data-test='table-row-Name']" should have exactly 20 items within 30 seconds

    # Scroll the table ScrollArea viewport to bottom to trigger infinite scroll
    # With 22 items sorted by startDate:desc, first page shows TestName-21 through TestName-2
    When I scroll container "[data-test='table-scroll-area'] .mantine-ScrollArea-viewport" to bottom
    When I wait for "1" seconds
    # Scroll again to ensure we reach the end (some items may still be loading)
    When I scroll container "[data-test='table-scroll-area'] .mantine-ScrollArea-viewport" to bottom
    # Wait for specific items to appear (last items in the list by startDate desc)
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 15 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    # Verify total count with polling and refresh (extended timeout for high parallel load with 12 workers)
    Then the element "//*[@data-test='table-row-Name']" should have exactly 22 items within 60 seconds with refresh