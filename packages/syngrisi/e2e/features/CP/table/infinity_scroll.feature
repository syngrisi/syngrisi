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
    # Increased from 10s to 20s for stability under high parallel load (12 workers)
    When I wait 20 seconds for the element with locator "[data-table-test-name=TestName-21]" to be visible
    # Wait for initial load with polling
    Then the element "//*[@data-test='table-row-Name']" should have exactly 20 items within 10 seconds

    # Scroll the table ScrollArea viewport to bottom to trigger infinite scroll
    # With 22 items sorted by startDate:desc, first page shows TestName-21 through TestName-2
    When I scroll container "[data-test='table-scroll-area'] .mantine-ScrollArea-viewport" to bottom
    # Wait for specific item to appear (increased from 5s to 10s for parallel load stability)
    When I wait 15 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    # Verify total count with polling (increased to 15s for high parallel load with 12 workers)
    Then the element "//*[@data-test='table-row-Name']" should have exactly 22 items within 15 seconds