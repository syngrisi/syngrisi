@demo @fast-server @live-vlm
Feature: AI Triage - Демонстрация на реальной локальной модели

    # Этот демо использует РЕАЛЬНЫЙ локальный VLM-провайдер (Ollama) и скриншоты реального
    # тестового приложения (HTML-фикстуры RCA, рендерятся в браузере). Вердикты модели
    # недетерминированы, поэтому шаги вердикт-агностичны. Требуется запущенный Ollama с vision-моделью.
    # Запуск (demo-режим): export ENABLE_DEMO_MODE=true && npx bddgen && npx playwright test --project=demo --grep "AI Triage" --workers=1

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Демонстрация AI Triage на реальной модели и реальном приложении
        # --- Подготовка: реальный VLM + реальный упавший чек из тестового приложения ---
        When I set demo step 1 of 8: "Реальная модель и реальное приложение"
        Given a local vision model is available
        When I configure the triage provider for the local vision model
        When I announce: "Демонстрация на реальной локальной vision-модели (Ollama) и скриншотах реального тестового приложения. Создадим baseline и внесём реальное изменение в UI."

        Given I create RCA test with "html-changes/base" as baseline
        When I create RCA actual check with "html-changes/added-elements"

        # --- Реальная классификация ---
        When I set demo step 2 of 8: "AI-вердикт от реальной модели"
        When I announce: "Запускаем триаж: реальная модель сравнивает baseline, actual и diff и выдаёт вердикт. Это занимает время — модель действительно «смотрит» на скриншоты."
        When I run AI triage for the 1st check named "RCA-Scenario-Check"
        Then the 1st check named "RCA-Scenario-Check" has a valid AI verdict
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I wait 5 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Реальная модель классифицировала изменение и пометила чек цветным AI-вердиктом с уровнем уверенности и иконкой."
        When I clear highlight

        # --- Клик по бейджу → фильтрация (по фактическому вердикту) ---
        When I set demo step 3 of 8: "Фильтр кликом по бейджу"
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Клик по бейджу мгновенно фильтрует чеки с таким же вердиктом в текущем ране."
        When I click element with locator "[data-test='triage-verdict']"
        When I wait 2 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I clear highlight

        # --- Фильтр-панель: уверенность и причина ---
        When I set demo step 4 of 8: "Фильтр по уверенности и причине"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I highlight element "[data-test='triage-filter-button']"
        When I announce: "Фильтр по минимальной уверенности и по тексту причины помогает быстро отобрать нужные вердикты."
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I clear highlight
        When I click element with locator "[data-test='triage-filter-apply']"

        # --- Группировка по AI-вердикту ---
        When I set demo step 5 of 8: "Группировка по AI-вердикту"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 30 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I announce: "Тесты можно группировать по AI-вердикту — сразу видно, что требует внимания."
        When I clear highlight

        # --- Re-run в карточке чека ---
        When I set demo step 6 of 8: "Перезапуск триажа на реальной модели"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I open the 1st check "RCA-Scenario-Check"
        When I wait 3 seconds for the element with locator "[data-test='triage-run-button']" to be visible
        When I highlight element "[data-test='triage-run-button']"
        When I announce: "Прямо в карточке чека виден вердикт рядом со статусом и кнопка перезапуска триажа — обновить вердикт после правок."
        When I click element with locator "[data-test='triage-run-button']"
        When I wait 60 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I clear highlight

        # --- Админка: раздел AI и провайдер ---
        When I set demo step 7 of 8: "Раздел AI в админке"
        When I go to "ai" page
        When I wait 10 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I announce: "В админке отдельный раздел AI: выбор провайдера — OpenAI, Anthropic, Gemini или self-hosted Ollama — с проверкой соединения, температурой, лимитом токенов и таймаутом."
        When I clear highlight

        # --- Per-project: включение и кастомные вердикты ---
        When I set demo step 8 of 8: "Настройки проекта: включение и кастомные вердикты"
        When I wait 3 seconds for the element with locator "[data-test='ai-perproject-form']" to be visible
        When I highlight element "[data-test='ai-perproject-form']"
        When I announce: "AI Triage включается отдельно для каждого проекта (по умолчанию выключен), а набор вердиктов полностью настраивается: ключ, подпись, иконка, цвет, серьёзность и флаги авто-принятия."
        When I clear highlight

        When I announce: "Это AI Triage на реальной модели: вердикты, фильтры, группировка, перезапуск и настройка под каждый проект."
        When I end the demo
