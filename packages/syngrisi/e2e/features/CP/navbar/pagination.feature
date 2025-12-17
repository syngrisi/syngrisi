@smoke
Feature: Pagination

  Background:
    When I clear database
    When I open the app
    When I clear local storage

  Scenario: Pagination
    When I create "22" tests with:
      """
      testName: "TestName-Pagination-1-$"
      runName: "RunName-Pagination-1-$"
      runIdent: "RunIdent-Pagination-1-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """
    When I go to "main" page
    # Wait for initial load with polling
    Then the element "[data-test*='navbar_item_']" should have exactly 20 items within 10 seconds
    # Scroll the navbar ScrollArea to bottom to trigger loading more
    When I scroll container "[data-test='navbar-scroll-area'] > div" to bottom
    # Wait for specific item to appear
    When I wait 10 seconds for the element with locator "[data-test='navbar_item_21']" to be visible
    # Verify total count with polling
    Then the element "[data-test*='navbar_item_']" should have exactly 22 items within 5 seconds

  Scenario: Pagination - Suite
    There were problems with pagination of suites when a session started with a suite that was created a long time ago, its createdData was updated,
    this caused collisions due to which some suites were not visible,
    it was fixed in commit 352eb555e2f8cc0d347298eca20c2ffad6be9d42

    When I create "22" tests with:
      """
      testName: "TestName-Pagination-2-$"
      runName: "RunName-Pagination-2-$"
      runIdent: "RunIdent-Pagination-2-$"
      suiteName: "SuiteName-Pagination-2-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    # such tests can be disappeared in old logic
    When I create "2" tests with:
      """
      testName: "TestName-Pagination-2-$"
      runName: "RunName-Pagination-2-$"
      runIdent: "RunIdent-Pagination-2-$"
      suiteName: "SuiteName-Pagination-2-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-test*='navbar_item_']" to be visible
    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
    # Wait for initial load with polling
    Then the element "[data-test*='navbar_item_'][data-item-name*='SuiteName-Pagination-2-']" should have exactly 20 items within 15 seconds
    # Scroll the navbar ScrollArea to bottom to trigger loading more
    When I scroll container "[data-test='navbar-scroll-area'] > div" to bottom
    # Verify total count with polling (22 unique suites: 0-21 from first batch, suites 0-1 reused in second batch)
    Then the element "[data-test*='navbar_item_'][data-item-name*='SuiteName-Pagination-2-']" should have exactly 22 items within 10 seconds
