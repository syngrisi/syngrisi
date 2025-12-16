@demo @fast-server
Feature: Bounding Region Overlay Demo

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Демонстрация Bounding Region Overlay - визуальное затемнение области за пределами региона
        # Создаём тест с baseline
        Given I create "1" tests with:
            """
            testName: BoundingOverlayDemo
            checks:
                - checkName: ScreenshotCheck
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "ScreenshotCheck"

        # Создаём второй check
        Given I create "1" tests with:
            """
            testName: BoundingOverlayDemo
            checks:
                - checkName: ScreenshotCheck
                  filePath: files/A.png
            """

        # Открываем страницу
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Вступление
        When I announce: "Демонстрация новой функции Bounding Region Overlay - визуальное затемнение области за пределами региона сравнения."

        # Разворачиваем тест и открываем Check Details
        When I click element with locator "[data-table-test-name='BoundingOverlayDemo']"
        And I wait 0.5 seconds
        When I click element with locator "[data-test-preview-image='ScreenshotCheck']"
        And I wait 1 seconds

        # Ждём загрузки canvas
        Then the element with locator "[data-check='toolbar']" should be visible
        And the element with locator "canvas" should be visible

        # ДЕМО ТОЧКА 2: Показываем что это Check Details
        When I announce: "Мы в Check Details. Здесь можно добавить Bounding Region - область, которая ограничивает зону сравнения скриншотов."
        And I pause for 2000 ms

        # ДЕМО ТОЧКА 3: Показываем кнопку Bounding Region
        When I highlight element "[data-check='add-bound-region']"
        And I announce: "Кнопка 'Bounding Region' добавляет ограничивающую рамку. Сравнение будет происходить только внутри этой рамки. Горячая клавиша: B"
        And I pause for 2500 ms
        And I clear highlight

        # ДЕМО ТОЧКА 4: Добавляем Bounding Region
        When I announce: "Нажмём B чтобы добавить Bounding Region. Обратите внимание на затемнение области за пределами рамки."
        And I pause for 1500 ms

        # Нажимаем B для добавления bounding region
        When I press the "b" key
        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 5: Показываем overlay эффект
        When I announce: "Готово! Видим зелёную рамку Bounding Region и затемнение за её пределами. Это показывает, что сравнение будет только внутри светлой области."
        And I pause for 3000 ms

        # ДЕМО ТОЧКА 6: Объясняем поведение при изменении размера
        When I announce: "При перемещении или изменении размера рамки затемнение обновляется в реальном времени. Попробуйте сами - перетащите угол рамки мышью."
        And I pause for 3000 ms

        # ДЕМО ТОЧКА 7: Сохраняем регион
        When I highlight element "[data-check='save-ignore-region']"
        And I announce: "Сохраним регион на baseline нажав Alt+S или кнопку Save."
        And I pause for 1500 ms
        And I clear highlight
        When I click element with locator "[data-check='save-ignore-region']"
        And I wait 1 seconds

        # ДЕМО ТОЧКА 8: Завершение
        When I announce: "Демонстрация Bounding Region Overlay завершена! Эта функция помогает визуально понять, какая именно область изображения будет сравниваться."

        # Завершаем демо с конфетти
        When I end the demo
