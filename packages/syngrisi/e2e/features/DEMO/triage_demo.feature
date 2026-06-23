@demo @fast-server @live-vlm
Feature: AI Triage - Демонстрация на реальной локальной модели

    # Реальный локальный VLM (Ollama, по умолчанию qwen3-vl:8b) + скриншоты реального тестового
    # приложения (HTML-фикстуры RCA, рендерятся в браузере). Вердикты недетерминированы → шаги
    # вердикт-агностичны. Требуется запущенный Ollama с vision-моделью.
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
        # --- Подготовка: реальный VLM, включение триажа на проекте, реальное изменение ---
        When I set demo step 1 of 9: "Реальная модель и реальное приложение"
        Given a local vision model is available
        When I configure the triage provider for the local vision model
        When I announce: "Реальная локальная vision-модель (Ollama) и скриншоты реального тестового приложения. Включаем AI Triage для проекта и вносим реальное изменение в UI."
        Given I create RCA test with "html-changes/base" as baseline
        Given I enable AI triage for the project "RCA Scenario App"
        When I create RCA actual check with "html-changes/added-elements"

        # --- In-progress: проверка прошла, модель ещё не проанализировала ---
        When I set demo step 2 of 9: "AI ещё анализирует — in progress"
        # gate deterministically: ensure the pending flag is stamped before we look for the UI badge
        Then I expect via http 1st check filtered as "name=RCA-Scenario-Check" matched:
            """
            triage:
                pending: true
            """
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I wait 30 seconds for the element with locator "[data-triage-pending='true']" to be visible
        When I highlight element "[data-triage-pending='true']"
        When I announce: "Проверка уже прошла, а модель ещё анализирует результат — на бейдже крутится индикатор «in progress» вместо вердикта."
        When I clear highlight

        # --- Реальная классификация ---
        When I set demo step 3 of 9: "AI-вердикт от реальной модели"
        When I announce: "Запускаем триаж: модель сравнивает baseline, actual и diff и выдаёт вердикт."
        When I run AI triage for the 1st check named "RCA-Scenario-Check"
        Then the 1st check named "RCA-Scenario-Check" has a valid AI verdict
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I wait 5 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Индикатор сменился на реальный AI-вердикт: цветной бейдж с иконкой и уровнем уверенности."
        When I clear highlight

        # --- Клик по бейджу → фильтрация ---
        When I set demo step 4 of 9: "Фильтр кликом по бейджу"
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Клик по бейджу фильтрует чеки с таким же вердиктом в текущем ране."
        When I click element with locator "[data-test='triage-verdict']"
        When I wait 2 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I clear highlight

        # --- Фильтр-панель: мультивыбор вердиктов, порог и причина ---
        When I set demo step 5 of 9: "Фильтр сразу по нескольким вердиктам"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I highlight element "[data-test='triage-filter-button']"
        When I announce: "Фильтр по AI-вердиктам: можно отметить сразу несколько вердиктов чекбоксами, плюс минимальная уверенность и текст причины. Тесты без единого подходящего чека скрываются целиком; ниже порога вердикт показывается как Unknown."
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I highlight element "[data-test='triage-filter-popover']"
        When I announce: "Отмечаем несколько вердиктов — в списке остаются только тесты, где есть совпадающие проверки."
        When I click element with locator "[data-test='triage-filter-verdict-intended_change']"
        When I click element with locator "[data-test='triage-filter-verdict-likely_bug']"
        When I click element with locator "[data-test='triage-filter-verdict-noise']"
        When I click element with locator "[data-test='triage-filter-verdict-uncertain']"
        When I clear highlight
        When I click element with locator "[data-test='triage-filter-apply']"
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        # сбрасываем фильтр, чтобы не влиять на следующие шаги
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I click element with locator "[data-test='triage-filter-clear']"

        # --- Группировка по AI-вердикту ---
        When I set demo step 6 of 9: "Группировка по AI-вердикту"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 30 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I announce: "Тесты можно группировать по AI-вердикту — сразу видно, что требует внимания."
        When I clear highlight

        # --- Re-run в карточке чека ---
        When I set demo step 7 of 9: "Перезапуск триажа на реальной модели"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Scenario-Test']" to be visible
        When I unfold the test "RCA-Scenario-Test"
        When I open the 1st check "RCA-Scenario-Check"
        When I wait 3 seconds for the element with locator "[data-test='triage-run-button']" to be visible
        When I highlight element "[data-test='triage-run-button']"
        When I announce: "Прямо в карточке чека виден вердикт рядом со статусом и кнопка перезапуска триажа."
        When I click element with locator "[data-test='triage-run-button']"
        When I wait 60 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I clear highlight

        # --- Админка: раздел AI, провайдер и Test connection ---
        When I set demo step 8 of 9: "Раздел AI в админке и проверка соединения"
        When I go to "ai" page
        When I wait 10 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I announce: "В админке отдельный раздел AI: выбор провайдера, температура, лимит токенов и таймаут. Проверим соединение с моделью кнопкой «Test connection»."
        When I click element with locator "[data-test='ai-providers-test']"
        When I wait 120 seconds for the element with locator "[data-test='ai-providers-test-result']" to be visible
        When I highlight element "[data-test='ai-providers-test-result']"
        When I announce: "Реальный ответ от провайдера: соединение работает, видна задержка."
        When I clear highlight

        # --- Per-project: включение, порог Unknown и кастомные вердикты ---
        When I set demo step 9 of 9: "Настройки проекта: включение, порог и кастомные вердикты"
        When I wait 3 seconds for the element with locator "[data-test='ai-perproject-form']" to be visible
        When I highlight element "[data-test='ai-perproject-form']"
        When I announce: "AI Triage включается отдельно для каждого проекта (по умолчанию выключен). Порог уверенности: ниже него вердикт становится Unknown. Набор вердиктов полностью настраивается: ключ, подпись, иконка, цвет, серьёзность и флаги."
        When I clear highlight
        When I pause

        When I announce: "Это AI Triage на реальной модели: in-progress, вердикты, фильтры, группировка, перезапуск, проверка соединения и настройка под каждый проект."
        When I end the demo
