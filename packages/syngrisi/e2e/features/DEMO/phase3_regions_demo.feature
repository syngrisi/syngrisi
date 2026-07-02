@demo @fast-server
Feature: Phase 3 Regions & Match Type Demo

    Background:
        When I set env variables:
            """
      SYNGRISI_AUTH: "false"
      SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database
        Given I create a test run "Regions Demo Test" with 2 checks

    Scenario: Демонстрация функций Phase 3 - Ignore Regions, Bound Region, Match Type
        # 1. Открываем страницу с тестами
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Вступление
        When I announce: "Демонстрация новых функций Phase 3: управление регионами и режимы сравнения."

        # 2. Разворачиваем тест и открываем Check Details
        When I click element with locator "[data-test^='table_row_']:first-of-type [data-table-test-name]"
        And I wait 0.5 seconds
        When I click element with locator "[data-test-preview-image]:first-of-type"
        And I wait 1 seconds

        # Ждём загрузки изображений
        Then the element with locator "[data-check='toolbar']" should be visible

        # ДЕМО ТОЧКА 2: Объясняем что нужен baseline
        When I announce: "Для работы с регионами нужен baseline. Принимаем текущий check."
        And I pause for 1000 ms

        # Принимаем check чтобы создать baseline
        When I click element with locator ".modal button[data-test='check-accept-icon']"
        And I wait 0.3 seconds
        When I click element with locator "button[data-test='check-accept-icon-confirm']"
        And I wait 1 seconds
        # ASSERT: После accept кнопки регионов должны стать доступны
        Then the element with locator "[data-check='add-ignore-region']" should be enabled
        Then the element with locator "[data-check='add-bound-region']" should be enabled
        Then the element with locator "[data-check='match-type-selector']" should be enabled
        And I announce: "Check принят! Теперь доступны функции работы с регионами."
        And I pause for 1000 ms

        # ДЕМО ТОЧКА 3: Показываем кнопку Add Ignore Region
        When I highlight element "[data-check='add-ignore-region']"
        And I announce: "Кнопка 'Add Ignore Region' - добавляет область которая будет игнорироваться при сравнении. Горячая клавиша: A"
        And I pause for 1500 ms
        And I clear highlight

        # ДЕМО ТОЧКА 3: Показываем кнопку Bound Region
        When I highlight element "[data-check='add-bound-region']"
        And I announce: "Кнопка 'Checked area only' - задаёт область для сравнения. Всё за пределами этой области игнорируется. Горячая клавиша: B"
        And I pause for 1500 ms
        And I clear highlight

        # ДЕМО ТОЧКА 4: Показываем кнопку Save
        When I highlight element "[data-check='save-ignore-region']"
        And I announce: "Кнопка 'Save' - сохраняет все регионы на baseline. Горячая клавиша: Alt+S"
        And I pause for 1500 ms
        And I clear highlight

        # ДЕМО ТОЧКА 5: Показываем Match Type Selector
        When I highlight element "[data-check='match-type-selector']"
        And I announce: "Селектор режима сравнения - выбор между Standard, Ignore Anti-aliasing и Ignore Colors."
        And I pause for 1500 ms
        And I clear highlight

        # ДЕМО ТОЧКА 6: Открываем меню Match Type
        Then the element with locator "[data-check='match-type-selector']" should be enabled
        When I click element with locator "[data-check='match-type-selector']"
        And I wait 0.5 seconds
        And I announce: "Меню режимов: Standard - точное сравнение пикселей, Anti-aliasing - игнорирует различия сглаживания, Colors - сравнивает только структуру."
        And I pause for 2000 ms

        # Закрываем меню кликом на тулбар (Escape закроет и модальное окно)
        When I click element with locator "[data-check='toolbar']"
        And I wait 0.3 seconds

        # ДЕМО ТОЧКА 7: Демонстрация добавления ignore region
        # ASSERT: Перед добавлением кнопка удаления disabled (нет выбранных регионов)
        Then the element with locator "[data-check='remove-ignore-region']" should be disabled
        When I announce: "Демонстрация: нажимаем A чтобы добавить ignore region."
        And I press the "a" key
        And I wait 0.5 seconds
        # ASSERT: После добавления региона кнопка удаления enabled (регион выбран)
        Then the element with locator "[data-check='remove-ignore-region']" should be enabled
        And I announce: "Регион добавлен! Его можно перемещать и изменять размер. Для удаления - выделите и нажмите Delete."
        And I pause for 1500 ms

        # Закрываем Check Details
        When I press the "Escape" key
        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 8: Завершение
        And I announce: "Демонстрация Phase 3 функций завершена! Основные возможности: Ignore Regions (A), Bound Region (B), Match Type Selector, Save (Alt+S)."

        # Завершаем демо с конфетти
        When I end the demo
