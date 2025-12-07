@demo @fast-server
Feature: Phase 1 UI Changes Demo

    Background:
        When I set env variables:
            """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database
        Given I create a test run "UI Demo Test" with 3 checks

    Scenario: Демонстрация изменений UI Фазы 1 - Chevron иконки и Loading индикатор
        # 1. Открываем страницу с тестами
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Обзор таблицы тестов
        When I highlight element "[data-test='table-scroll-area']"
        And I announce: "Открыта таблица тестов. Начинаем демонстрацию изменений UI Фазы 1."
        And I clear highlight

        # 2. Разворачиваем тест
        When I click element with locator "[data-test^='table_row_']:first-of-type [data-table-test-name]"
        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 2: Развернутый тест с чеками
        When I highlight element "[data-test-preview-image]:last-of-type"
        And I announce: "Тест развернут. Открываем чек для демонстрации нового UI."
        And I clear highlight

        # 3. Открываем Check Details - здесь должен показаться Loading индикатор
        When I click element with locator "[data-test-preview-image]:last-of-type"

        # ДЕМО ТОЧКА 3: Loading индикатор (показывается пока грузятся картинки)
        And I announce: "Загрузка изображений... Новый индикатор загрузки отображается в центре области Canvas."
        And I wait 2 seconds

        # ДЕМО ТОЧКА 4: Check Details открыт - показываем новые chevron иконки
        When I highlight element "[title='Previous Check']"
        And I announce: "Новые иконки навигации - IconChevronLeft вместо IconArrowLeft для 'Previous Check'."
        And I pause for 1000 ms
        And I clear highlight

        When I highlight element "[title='Next Check']"
        And I announce: "IconChevronRight вместо IconArrowRight для 'Next Check'."
        And I pause for 1000 ms
        And I clear highlight

        When I highlight element "[title='Previous Test']"
        And I announce: "IconChevronUp вместо IconArrowUp для 'Previous Test'."
        And I pause for 1000 ms
        And I clear highlight

        When I highlight element "[title='Next Test']"
        And I announce: "IconChevronDown вместо IconArrowDown для 'Next Test'. Иконки теперь соответствуют общему стилю тулбара."
        And I pause for 1000 ms
        And I clear highlight

        # ДЕМО ТОЧКА 5: Демонстрация навигации с новыми иконками
        When I click element with locator "[title='Next Check']"
        And I wait 0.5 seconds
        And I announce: "Навигация работает корректно с новыми chevron иконками."

        When I click element with locator "[title='Previous Check']"
        And I wait 0.5 seconds

        # Закрываем
        When I press the "Escape" key
        And I wait 0.5 seconds
        And I announce: "Демонстрация UI изменений Фазы 1 завершена! Основные изменения: 1) Chevron иконки навигации 2) Loading индикатор при загрузке изображений."
