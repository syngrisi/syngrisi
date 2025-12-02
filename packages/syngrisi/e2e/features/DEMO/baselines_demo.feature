@fast-server @demo
Feature: Baselines View Demo

  Background:
    When I set env variables:
      """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
      """
    Given I start Server
    # Seeds baselines with usage counts via HTTP API:
    # 1. 'api-baseline-usage' (Used by 2 checks)
    # 2. 'api-baseline-unused' (Used by 0 checks)
    And I seed via http baselines with usage:
      """
            baselines:
              - name: api-baseline-usage
                checkName: api-baseline-usage
                usageCount: 2
                filePath: files/A.png
              - name: api-baseline-unused
                checkName: api-baseline-unused
                usageCount: 0
                filePath: files/B.png
      """
    # Seeds orphan baselines via HTTP API:
    # 1. 'orphan-baseline-deleteme' (Orphan)
    # 2. 'orphan-baseline-keep' (Used)
    And I seed via http orphan baselines data:
      """
            orphanBaseline:
              name: orphan-baseline-deleteme
              filePath: files/A.png
            usedBaseline:
              name: orphan-baseline-keep
              filePath: files/B.png
      """

  Scenario: Demo Baselines View - Table, Filtering and Navigation
    # 1. Open Baselines Page
    When I go to "baselines" page
    Then the element with locator "[data-test='table-header-Name']" should be visible

    # DEMO POINT 1: View the table
    # Observe:
    # - 'api-baseline-usage' has Usage: 2
    # - 'api-baseline-unused' has Usage: 0
    # - 'orphan-baseline-deleteme' has Usage: 0
    # - 'orphan-baseline-keep' has Usage: 1
    When I pause with phrase: "Посмотрите на таблицу. Обратите внимание на использование бейслайнов."

    # 2. Filter by Name (simulate user action)
    When I click element with locator "[data-test='table-filtering']"
    And I wait 1 seconds

    # DEMO POINT 2: Filter Drawer is open
    # You can inspect the filter options.
    When I pause with phrase: "Открыта панель фильтров. Вы можете изучить опции фильтрации."

    # 3. Click on a row to navigate to tests
    # We click on the row with 'api-baseline-usage' (it should be the first one or visible)
    # Note: The order depends on default sort (createdDate desc).
    # orphan-baseline-keep was created last, so it might be first.
    # Let's just click the first row.
    When I click element with locator "[data-test='table-row-Name']"

    # DEMO POINT 3: Redirection to Tests
    # Observe URL contains filter={"baselineSnapshotId":"..."}
    # Observe only relevant checks are shown.
    When I pause with phrase: "Произошло перенаправление на тесты. Обратите внимание на URL с фильтром."

#    Scenario: Demo Admin Task - Handle Orphan Baselines
#        # Navigate to Admin Task
#        When I go to "admin>orphan_baselines" page
#        And I wait 2 seconds
#
#        # Verify Task Page
#        Then the element with locator "h3:has-text('Handle Orphan Baselines')" should be visible
#        Then the element with locator "[data-test='task-description']" should be visible
#
#        # Check Dry Run (default)
#        Then the element with locator "input[type='checkbox'][name='dryRun']" should be checked
#
#        # Run Task
#        When I click element with locator "[data-test='task-start-button']"
#
#        # Wait for logs
#        And I wait 5 seconds
#        Then the element with locator ".mantine-Paper-root" should be visible
#        # Verify logs content (mock output)
#        # "Total baselines: ..."
#        Then the element with locator "textarea" should contain value "Total baselines:"
