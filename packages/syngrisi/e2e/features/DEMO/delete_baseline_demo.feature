@fast-server @demo
Feature: Delete Baseline Demo

    Background:
        When I set env variables:
            """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server
        And I seed via http baselines with usage:
            """
            baselines:
              - name: demo-baseline
                checkName: check-1
                usageCount: 2
                filePath: files/A.png
            """

    Scenario: Demo Delete Baseline Flow
        # 1. Open Baselines Page
        When I go to "baselines" page
        Then I wait for "1" seconds
        Then the element with locator "[data-test='table-row-Name']" should be visible

        When I pause with phrase: "Мы находимся на странице бейслайнов. Обратите внимание на 'demo-baseline', который используется в 2 проверках."

        # 2. Navigate to Checks
        When I click element with locator "[data-test='table-row-Name']"
        Then I wait for "1" seconds

        When I pause with phrase: "Мы перешли к списку проверок, отфильтрованных по этому бейслайну."

        # Unfold the first test (since we don't know the name)
        When I click element with locator "tbody tr:first-child [data-test='table-row-Name']"
        Then I wait for "1" seconds

        # 3. Open Check Details
        When I open the 1st check "check-1"
        Then I wait for "1" seconds

        When I pause with phrase: "Открыты детали проверки. Сейчас мы удалим связанный бейслайн."

        # 4. Open Menu
        When I click element with locator "[data-test='check-details-menu']"
        Then I wait for "1" seconds

        When I pause with phrase: "В меню действий доступна опция 'Delete Baseline'."

        # 5. Click Delete Baseline
        When I click element with locator "[data-test='menu-delete-baseline']"
        Then I wait for "1" seconds
        Then the text "Are you sure you want to delete this baseline?" should be visible
        Then the text "2 checks" should be visible

        When I pause with phrase: "Появилось окно подтверждения. Мы видим количество проверок (2), которые используют этот бейслайн."

        # 6. Cancel
        When I click element with locator "button:has-text('Cancel')"
        Then I wait for "1" seconds
        Then the text "Are you sure you want to delete this baseline?" should not be visible

        When I pause with phrase: "Мы отменили удаление. Давайте попробуем снова и подтвердим действие."

        # 7. Delete for real
        When I click element with locator "[data-test='check-details-menu']"
        Then I wait for "1" seconds
        When I click element with locator "[data-test='menu-delete-baseline']"
        Then I wait for "1" seconds
        When I force click element with locator "[data-test='confirm-delete-baseline']"
        Then I wait for "1" seconds

        # 8. Verify Deletion
        Then the element with locator "[data-test='check-details-menu']" should not be visible
        And I go to "baselines" page
        Then I wait for "1" seconds
        Then the element with locator "[data-test='table-row-Name']" should not be visible

        When I pause with phrase: "Бейслайн успешно удален и больше не отображается в списке."
