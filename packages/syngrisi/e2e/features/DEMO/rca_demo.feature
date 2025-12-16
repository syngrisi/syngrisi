@rca @fast-server @demo
Feature: RCA - Демонстрация возможностей

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Кейс 1 - Обнаружение новых элементов
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/added-elements"
        When I go to "main" page
        
        # When I announce: "Добро пожаловать в демонстрацию Root Cause Analysis. Сейчас мы увидим, как Syngrisi обнаруживает появление новых элементов на странице."
        
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I highlight element "[data-table-test-name='RCA-Scenario-Test']"
        # When I announce: "Тест завершился с отличиями. Давайте посмотрим детали."
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        # And I wait 1 seconds
        When I clear highlight

        When I highlight element "[data-test-preview-image='RCA-Scenario-Check']"
        # When I announce: "Откроем конкретную проверку для анализа."
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I clear highlight

        When I highlight element "[data-test='rca-toggle-button']"
        When I announce: "Активируем панель RCA"
        When I pause
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        When I clear highlight

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "Система точно определила, что в DOM-дереве появились новые элементы."
        And the RCA panel should show added elements
        When I clear highlight
        When I pause
        When I end the demo

    Scenario: Кейс 2 - Обнаружение удаленных элементов
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/removed-elements"
        When I go to "main" page

        When I announce: "Теперь рассмотрим ситуацию, когда элементы исчезают со страницы."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I highlight element "[data-test='rca-toggle-button']"
        When I announce: "Включаем анализ причин."
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        When I clear highlight

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "RCA показывает список элементов, которые были удалены из структуры страницы."
        And the RCA panel should show removed elements
        When I clear highlight

        When I end the demo

    Scenario: Кейс 3 - Изменение текста
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/text-change"
        When I go to "main" page

        When I announce: "Syngrisi также умеет находить изменения в текстовом контенте."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "Мы видим, что текст элемента изменился, и система подсвечивает это различие."
        And the RCA panel should show text changes
        When I clear highlight

        When I end the demo

    Scenario: Кейс 4 - Изменение стилей (Цвет)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/color-change"
        When I go to "main" page

        When I announce: "Перейдем к анализу CSS. В этом примере изменился цвет элемента."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "RCA точно определяет изменение свойства color в CSS стилях."
        And the RCA panel should show style changes
        When I clear highlight

        When I end the demo

    Scenario: Кейс 7 - Большой DOM (1000+ элементов)
        Given I create RCA test with "edge-cases/large-dom" as baseline
        When I create RCA actual check with "edge-cases/large-dom-modified"
        When I go to "main" page

        When I announce: "Syngrisi эффективно работает даже с большими DOM-деревьями. В этом тесте более 1000 элементов."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 5 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "Обработка большого количества элементов занимает немного больше времени, но результат так же точен."
        When I clear highlight

        When I end the demo

    Scenario: Кейс 9 - Без DOM данных
        Given I create RCA test with "html-changes/base" as baseline without DOM data
        When I create RCA actual check with "html-changes/added-elements" without DOM data
        When I go to "main" page

        When I announce: "Что если данных DOM нет? Например, если они не были собраны."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "Система корректно сообщает об отсутствии данных для анализа."
        And the RCA panel should show no DOM data message
        When I clear highlight

        When I end the demo

    Scenario: Кейс 10 - Изменение видимости (visibility/display)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/visibility-change"
        When I go to "main" page

        When I announce: "Изменения видимости элементов также отслеживаются."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "RCA показывает, что свойство visibility или display было изменено."
        And the RCA panel should show style changes
        When I clear highlight

        When I end the demo

    Scenario: Кейс 16 - Комбинированные изменения (HTML + CSS)
        Given I create RCA test with "combined-changes/base" as baseline
        When I create RCA actual check with "combined-changes/html-and-css-change"
        When I go to "main" page

        When I announce: "Самый интересный случай: одновременные изменения в структуре и стилях."

        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds

        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        Then the element with locator "[data-test='rca-panel']" should be visible
        When I highlight element "[data-test='rca-panel']"
        When I announce: "Панель RCA группирует изменения, показывая и новые элементы, и изменения стилей одновременно."
        And the RCA panel should show added elements
        And the RCA panel should show style changes
        When I clear highlight

        When I end the demo
