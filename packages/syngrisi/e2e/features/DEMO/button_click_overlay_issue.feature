@demo
Feature: Demo: Button Click Overlay Issue

  Demonstrates the UI bug where overlay blocks real user clicks on modal buttons

  Background:
    When I open the app
    When I clear local storage

  Scenario: Demo: Accept button blocked by overlay in modal
    When I announce: "Добро пожаловать! Сейчас мы продемонстрируем проблему с кликабельностью кнопок в модальном окне"

    # Create test data
    Given I create "1" tests with:
      """
      testName: TestName-OverlayDemo
      checks:
        - checkName: CheckName-OverlayDemo
          filePath: files/A.png
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-OverlayDemo']" to be visible
    When I announce: "Разворачиваем тест чтобы увидеть чеки"
    When I unfold the test "TestName-OverlayDemo"

    When I announce: "Открываем модальное окно с деталями чека"
    When I highlight element "[data-table-check-name='CheckName-OverlayDemo']"
    When I open the 1st check "CheckName-OverlayDemo"
    When I clear highlight

    Then the element with locator ".modal [data-test='check-accept-icon']" should be visible
    When I announce: "Видите кнопку Accept? Она выглядит кликабельной, но есть проблема"
    When I highlight element ".modal [data-test='check-accept-icon']"

    When I announce: "Сейчас попробуем кликнуть реальным кликом пользователя"
    # This will timeout/fail due to overlay
    When I real click element with locator ".modal [data-test='check-accept-icon']"

    When I clear highlight
    When I announce: "Демонстрация завершена. Проблема: оверлей блокирует клики пользователя"
    When I end the demo
