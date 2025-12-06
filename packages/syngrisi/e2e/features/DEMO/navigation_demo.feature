@demo @fast-server
Feature: Check Details Navigation Demo

    Background:
        When I set env variables:
            """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database
        # Создаем 3 теста по 3 чека в каждом
        Given I create a test run "Demo Test 1" with 3 checks
        And I pause for 500 ms
        Given I create a test run "Demo Test 2" with 3 checks
        And I pause for 500 ms
        Given I create a test run "Demo Test 3" with 3 checks

    Scenario: Демонстрация навигации по чекам и тестам
        # 1. Открываем страницу с тестами
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Обзор таблицы тестов
        When I highlight element "[data-test='table-scroll-area']"
        And I announce: "Открыта таблица тестов. Видны три теста с чеками."
        And I clear highlight

        # 2. Открываем первый тест (Demo Test 3 - самый новый)
        When I highlight element "[data-test^='table_row_']:first-of-type [data-table-test-name]"
        And I pause for 500 ms
        When I click element with locator "[data-test^='table_row_']:first-of-type [data-table-test-name]"
        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 2: Развернутый тест
        When I clear highlight
        And I highlight element "[data-test-preview-image]:last-of-type"
        And I announce: "Тест развернут. Видны все его чеки: Check 1, Check 2, Check 3."
        And I clear highlight

        # 3. Открываем детали первого чека (первый в списке)
        When I click element with locator "[data-test-preview-image]:last-of-type"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 3: Check Details - первый чек
        When I highlight element "[data-test-preview-image]:last-of-type"
        And I announce: "Открыт чек теста. Далее покажем переход между тестами."
        And I clear highlight

        # 7. Навигация к следующему тесту (вниз)
        When I highlight element "[title='Next Test']"
        And I pause for 500 ms
        When I click element with locator "[title='Next Test']"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 7: Переход к другому тесту
        When I clear highlight
        And I announce: "Переход к следующему тесту - Demo Test 2. Открылся первый чек."

        # 8. Навигация к предыдущему тесту (вверх)
        When I highlight element "[title='Previous Test']"
        And I pause for 500 ms
        When I click element with locator "[title='Previous Test']"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 8: Возврат к предыдущему тесту
        When I clear highlight
        And I announce: "Возврат к предыдущему тесту - Demo Test 3. Открылся первый чек."

        # 9. Быстрая навигация: идем к последнему тесту
        When I highlight element "[title='Next Test']"
        And I pause for 300 ms
        And I clear highlight
        When I click element with locator "[title='Next Test']"
        And I wait 0.5 seconds
        And I click element with locator "[title='Next Test']"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 9: Последний тест
        When I announce: "Последний тест в таблице - Demo Test 1. Стрелка вниз неактивна."

        # 10. Проверим навигацию внутри последнего теста
        When I highlight element "[title='Next Check']"
        And I pause for 300 ms
        And I clear highlight
        When I click element with locator "[title='Next Check']"
        And I wait 0.5 seconds
        And I click element with locator "[title='Next Check']"
        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 10: Последний чек последнего теста
        When I announce: "Последний чек последнего теста - Check 3. Стрелки вправо и вниз неактивны."

        # 11. Закрываем модальное окно
        When I press the "Escape" key
        And I wait 0.5 seconds
        And I announce: "Демонстрация завершена. Все функции навигации работают корректно!"
