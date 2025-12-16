@rca @fast-server @demo-silent
Feature: RCA - Демонстрация всех сценариев - Silent Mode

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Кейс 1 - Добавление HTML элементов
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/added-elements"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements

    Scenario: Кейс 2 - Удаление HTML элементов
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/removed-elements"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show removed elements

    Scenario: Кейс 3 - Изменение текста
        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/text-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show text changes

    Scenario: Кейс 4 - Изменение цвета CSS
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/color-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 5 - Изменение размеров
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/size-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 6 - Изменение позиционирования
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/position-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 7 - Большой DOM (1000+ элементов)
        Given I create RCA test with "edge-cases/large-dom" as baseline
        When I create RCA actual check with "edge-cases/large-dom-modified"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 5 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible

    Scenario: Кейс 8 - Минимальный DOM
        Given I create RCA test with "edge-cases/minimal" as baseline
        When I create RCA actual check with "edge-cases/minimal-modified"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements

    Scenario: Кейс 9 - Без DOM данных
        Given I create RCA test with "html-changes/base" as baseline without DOM data
        When I create RCA actual check with "html-changes/added-elements" without DOM data
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show no DOM data message

    Scenario: Кейс 10 - Изменение видимости (visibility/display)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/visibility-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 11 - Изменение z-index
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/z-index-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 12 - Изменение шрифтов
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/font-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 13 - Изменение прозрачности (opacity)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/opacity-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 14 - Изменение трансформаций (transform)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/transform-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 15 - Изменение границ (border)
        Given I create RCA test with "css-changes/base" as baseline
        When I create RCA actual check with "css-changes/border-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show style changes

    Scenario: Кейс 16 - Комбинированные изменения HTML + CSS
        Given I create RCA test with "combined-changes/base" as baseline
        When I create RCA actual check with "combined-changes/html-and-css-change"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements
        And the RCA panel should show style changes

    Scenario: Кейс 17 - Пустой body → контент
        Given I create RCA test with "edge-cases/empty-body" as baseline
        When I create RCA actual check with "edge-cases/empty-body-modified"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements

    Scenario: Кейс 18 - Глубоко вложенные структуры
        Given I create RCA test with "edge-cases/deeply-nested" as baseline
        When I create RCA actual check with "edge-cases/deeply-nested-modified"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show added elements

    Scenario: Кейс 19 - Unicode и спецсимволы
        Given I create RCA test with "edge-cases/special-chars" as baseline
        When I create RCA actual check with "edge-cases/special-chars-modified"
        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible
        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible
        Then the element with locator "[data-test='rca-panel']" should be visible
        And the RCA panel should show text changes
