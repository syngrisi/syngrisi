@demo @fast-server
Feature: Auto Regions Demo

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Демонстрация Auto Regions - автоматическое создание ignore regions из diff
        # Создаём тест с baseline
        Given I create "1" tests with:
            """
            testName: AutoRegionsDemo
            checks:
                - checkName: DiffCheck
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "DiffCheck"

        # Создаём второй check с другим изображением (будет diff)
        Given I create "1" tests with:
            """
            testName: AutoRegionsDemo
            checks:
                - checkName: DiffCheck
                  filePath: files/B.png
            """

        # Открываем страницу
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Вступление
        When I announce: "Демонстрация новой функции Auto Regions - автоматическое создание ignore regions из областей различий."

        # Разворачиваем тест и открываем Check Details
        When I click element with locator "[data-table-test-name='AutoRegionsDemo']"
        And I wait 0.5 seconds
        When I click element with locator "[data-test-preview-image='DiffCheck']"
        And I wait 1 seconds

        # Ждём загрузки
        Then the element with locator "[data-check='toolbar']" should be visible

        # ДЕМО ТОЧКА 2: Показываем что есть diff
        When I announce: "Этот check имеет различия с baseline. Видим diff-изображение с подсвеченными областями."
        And I pause for 1500 ms

        # ДЕМО ТОЧКА 3: Показываем кнопку Auto Region
        When I highlight element "[data-check='auto-ignore-region']"
        And I announce: "Новая кнопка 'Auto Regions' - автоматически создаёт ignore regions для всех областей различий. Горячая клавиша: R"
        And I pause for 2000 ms
        And I clear highlight

        # ДЕМО ТОЧКА 4: Показываем что регионов нет
        When I announce: "Сейчас регионов нет. Нажимаем R чтобы создать автоматически."
        And I pause for 1000 ms

        # Нажимаем R для создания auto regions
        When I press the "r" key
        And I wait 1 seconds

        # ДЕМО ТОЧКА 5: Показываем результат
        When I announce: "Готово! Ignore regions автоматически созданы на всех областях различий. Теперь можно сохранить их (Alt+S)."
        And I pause for 2000 ms

        # ДЕМО ТОЧКА 6: Сохраняем регионы
        When I highlight element "[data-check='save-ignore-region']"
        And I announce: "Сохраняем регионы на baseline."
        And I pause for 1000 ms
        And I clear highlight
        When I click element with locator "[data-check='save-ignore-region']"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 7: Завершение
        When I announce: "Демонстрация Auto Regions завершена! Функция позволяет быстро создать ignore regions для всех различий одним нажатием клавиши R."

        # Завершаем демо
        When I end the demo
