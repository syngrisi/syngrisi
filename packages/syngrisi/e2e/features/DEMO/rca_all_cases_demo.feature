@demo @fast-server
Feature: RCA - Демонстрация всех сценариев анализа причин визуальных регрессий

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Демо: RCA - Анализ причин визуальных регрессий (все кейсы)
        # ============================================
        # ВВЕДЕНИЕ
        # ============================================
        When I announce: "Добро пожаловать в демонстрацию Root Cause Analysis (RCA) - инструмента для анализа причин визуальных регрессий."
        And I pause for 2000 ms
        When I announce: "RCA помогает понять НЕ ТОЛЬКО ЧТО изменилось, но и ПОЧЕМУ это произошло."
        And I pause for 2000 ms

        # ============================================
        # КЕЙС 1: Изменения HTML структуры - добавление элементов
        # ============================================
        When I announce: "КЕЙС 1: Обнаружение добавленных HTML элементов"
        And I pause for 1500 ms

        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/added-elements"

        When I go to "main" page
        And I wait 5 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        
        When I highlight element "[data-table-test-name='RCA-Scenario-Test']"
        And I announce: "Тест обнаружил визуальные изменения. Откроем его для анализа."
        And I pause for 1500 ms
        And I clear highlight

        When I click element with locator "[data-table-test-name='RCA-Scenario-Test']"
        And I wait 1 seconds
        When I click element with locator "[data-test-preview-image='RCA-Scenario-Check']"
        And I wait 2 seconds for the element with locator "[data-check='toolbar']" to be visible

        When I highlight element "[data-test='rca-toggle-button']"
        And I announce: "Нажмем кнопку 'D' для активации RCA анализа."
        And I pause for 1000 ms
        And I clear highlight

        When I click element with locator "[data-test='rca-toggle-button']"
        And I wait 3 seconds for the element with locator "[data-test='rca-panel']" to be visible

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA панель показывает: обнаружены НОВЫЕ элементы в DOM. Система точно определила какие div-элементы были добавлены."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 2: Изменения HTML структуры - удаление элементов  
        # ============================================
        When I announce: "КЕЙС 2: Обнаружение удаленных HTML элементов"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил УДАЛЕННЫЕ элементы. Видим какие именно элементы были удалены из DOM структуры."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 3: Изменение текстового содержимого
        # ============================================
        When I announce: "КЕЙС 3: Обнаружение изменений текстового содержимого"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA показывает изменения ТЕКСТА. Можно увидеть какой текст был изменен и на какой."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 4: CSS изменения - цвет
        # ============================================
        When I announce: "КЕЙС 4: Обнаружение изменений CSS стилей - цвет фона"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил изменение CSS свойства background-color. Показаны старое и новое значения цвета."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 5: CSS изменения - размеры
        # ============================================
        When I announce: "КЕЙС 5: Обнаружение изменений размеров элементов"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA показывает изменения WIDTH и HEIGHT. Размеры элемента изменились - видим точные значения."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 6: CSS изменения - позиционирование
        # ============================================
        When I announce: "КЕЙС 6: Обнаружение изменений позиционирования"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил изменения MARGIN и PADDING. Элемент сместился из-за изменения отступов."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 7: Работа с большим DOM (1000+ элементов)
        # ============================================
        When I announce: "КЕЙС 7: Анализ страницы с большим DOM (1000+ элементов)"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA справляется с большими DOM структурами. Анализ 1000+ элементов выполнен успешно."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 8: Минимальный DOM
        # ============================================
        When I announce: "КЕЙС 8: Анализ минимального DOM"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "Даже для простых страниц RCA точно определяет изменения в DOM структуре."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 9: Без DOM данных
        # ============================================
        When I announce: "КЕЙС 9: Поведение RCA без DOM данных"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "Когда DOM данные недоступны, RCA информирует об этом. Для полного анализа необходимо включить сбор DOM."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 10: Изменение видимости
        # ============================================
        When I announce: "КЕЙС 10: Обнаружение изменений visibility и display"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил изменения visibility: hidden и display: none. Элементы стали невидимыми."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 11: Изменение z-index
        # ============================================
        When I announce: "КЕЙС 11: Обнаружение изменений z-index и слоёв"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA показывает изменения z-index. Элементы теперь перекрывают друг друга по-другому."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 12: Изменение шрифтов
        # ============================================
        When I announce: "КЕЙС 12: Обнаружение изменений типографики"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил изменения font-family, font-size, font-weight. Типографика полностью изменилась."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 13: Изменение прозрачности
        # ============================================
        When I announce: "КЕЙС 13: Обнаружение изменений opacity"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA показывает изменения opacity. Элементы стали полупрозрачными."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 14: Изменение трансформаций
        # ============================================
        When I announce: "КЕЙС 14: Обнаружение CSS transform"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA обнаружил transform: rotate, scale, skew. Элементы повёрнуты и масштабированы."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 15: Изменение границ
        # ============================================
        When I announce: "КЕЙС 15: Обнаружение изменений border"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA показывает изменения border и border-radius. Границы элементов изменились."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 16: Комбинированные изменения HTML + CSS
        # ============================================
        When I announce: "КЕЙС 16: Комбинированные изменения HTML и CSS одновременно"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA анализирует ВСЕ типы изменений: добавленные элементы, удалённые элементы и изменённые стили - всё в одном анализе!"
        And I pause for 3000 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 17: Пустой body → контент
        # ============================================
        When I announce: "КЕЙС 17: Анализ пустой страницы, которая получила контент"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA корректно определяет добавление контента в пустую страницу."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 18: Глубоко вложенные структуры
        # ============================================
        When I announce: "КЕЙС 18: Анализ глубоко вложенных DOM структур (10+ уровней)"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA справляется с глубокой вложенностью. Изменения на любом уровне будут обнаружены."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds
        And I clear database

        # ============================================
        # КЕЙС 19: Unicode и спецсимволы
        # ============================================
        When I announce: "КЕЙС 19: Работа с Unicode, эмодзи и специальными символами"
        And I pause for 1500 ms

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

        When I highlight element "[data-test='rca-panel']"
        And I announce: "RCA корректно обрабатывает Unicode, кириллицу, китайские иероглифы, эмодзи и HTML entities."
        And I pause for 2500 ms
        And I clear highlight

        When I press the "Escape" key
        And I wait 0.5 seconds

        # ============================================
        # ЗАКЛЮЧЕНИЕ
        # ============================================
        When I announce: "Демонстрация завершена! Мы рассмотрели 19 различных сценариев анализа визуальных регрессий."
        And I pause for 2000 ms
        When I announce: "RCA превращает 'что-то изменилось' в 'вот что именно изменилось и почему'. Используйте горячую клавишу 'D' для быстрого переключения RCA панели. Удачной отладки!"
        And I pause for 3000 ms

        When I end the demo
