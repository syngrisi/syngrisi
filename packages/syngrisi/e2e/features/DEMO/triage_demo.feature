@demo @fast-server @live-vlm
Feature: AI Triage - Демонстрация на реальной локальной модели

    # Реальный локальный VLM (Ollama, демо предпочитает gemma4:12b — она ловит битую картинку) + скриншоты реального тестового
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

    Scenario: Демонстрация AI Triage на реальной модели с семью разными изменениями
        # --- Подготовка: реальный VLM + один тест с 7 разными изменениями ---
        When I set demo step 1 of 9: "Реальная модель и 7 разных изменений"
        Given a local vision model is available
        # demo prefers gemma4:12b — it recognises the broken image as a bug (falls back if not installed)
        Given I prefer the local vision model "gemma4:12b"
        When I configure the triage provider for the local vision model
        When I announce: "Реальная локальная vision-модель (Ollama). Создаём один тест с семью разными изменениями UI — добавление элементов, смена текста, динамический контент (только таймстамп и счётчик), обрезанный текст, сломанная вёрстка, не прогрузившаяся картинка и нечитаемый контраст — чтобы модель дала по ним разные вердикты."
        Given I create RCA baselines for the triage changes
        Given I enable AI triage for the project "RCA Scenario App"
        When I create the changed checks for triage

        # --- In-progress + live-обновление вердикта без перезагрузки ---
        When I set demo step 2 of 9: "In-progress и live-обновление без перезагрузки"
        # gate deterministically: ensure the pending flag is stamped before we look for the UI badge
        Then I expect via http 1st check filtered as "name=Added-Check" matched:
            """
            triage:
                pending: true
            """
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 30 seconds for the element with locator "[data-triage-pending='true']" to be visible
        When I highlight element "[data-triage-pending='true']"
        When I announce: "Проверки уже прошли, а модель ещё анализирует — на бейджах крутится «in progress». Запустим анализ одной проверки и НЕ будем перезагружать страницу."
        When I clear highlight
        # классифицируем одну проверку, оставаясь на гриде — бейдж сменится сам (грид поллит, пока есть pending)
        When I run AI triage for the 1st check named "Added-Check"
        When I wait 20 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Вердикт появился сам, без перезагрузки страницы — грид опрашивается, пока есть проверки в анализе, и «in progress» сменяется вердиктом на лету."
        When I clear highlight

        # --- Реальная классификация остальных проверок → разные вердикты ---
        When I set demo step 3 of 9: "Разные AI-вердикты по семи проверкам"
        When I announce: "Анализируем остальные проверки — модель сравнивает baseline, actual и diff каждой и выдаёт свой вердикт."
        When I run AI triage for the 1st check named "Text-Check"
        When I run AI triage for the 1st check named "Noise-Check"
        When I run AI triage for the 1st check named "Ambiguous-Check"
        When I run AI triage for the 1st check named "Broken-Check"
        When I run AI triage for the 1st check named "Image-Check"
        When I run AI triage for the 1st check named "Contrast-Check"
        Then the 1st check named "Added-Check" has a valid AI verdict
        Then the 1st check named "Text-Check" has a valid AI verdict
        Then the 1st check named "Noise-Check" has a valid AI verdict
        Then the 1st check named "Ambiguous-Check" has a valid AI verdict
        Then the 1st check named "Broken-Check" has a valid AI verdict
        Then the 1st check named "Image-Check" has a valid AI verdict
        Then the 1st check named "Contrast-Check" has a valid AI verdict
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 10 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I announce: "Семь проверок — разные изменения дают разные AI-вердикты: цветные бейджи с иконками и уровнем уверенности. Вместо сплошной «красноты» сразу видно, что есть что."
        When I clear highlight

        # --- Группировка по AI-вердикту ---
        When I set demo step 4 of 9: "Группировка по AI-вердикту"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 30 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I announce: "Группировка по AI-вердикту — проверки распределились по своим категориям, понятно за что браться в первую очередь."
        When I clear highlight

        # --- Фильтр-панель: мультивыбор вердиктов ---
        When I set demo step 5 of 9: "Фильтр сразу по нескольким вердиктам"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I highlight element "[data-test='triage-filter-button']"
        When I announce: "Фильтр по AI-вердиктам: можно отметить сразу несколько вердиктов чекбоксами. Тесты без подходящих проверок скрываются целиком, внутри теста остаются только совпавшие проверки; ниже порога вердикт показывается как Unknown."
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I highlight element "[data-test='triage-filter-popover']"
        When I click element with locator "[data-test='triage-filter-verdict-intended_change']"
        When I click element with locator "[data-test='triage-filter-verdict-likely_bug']"
        When I click element with locator "[data-test='triage-filter-verdict-noise']"
        When I click element with locator "[data-test='triage-filter-verdict-uncertain']"
        When I clear highlight
        When I click element with locator "[data-test='triage-filter-apply']"
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        # сбрасываем фильтр, чтобы не влиять на следующие шаги
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I click element with locator "[data-test='triage-filter-clear']"

        # --- Re-run в карточке чека ---
        When I set demo step 6 of 9: "Перезапуск триажа на реальной модели"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I open the 1st check "Broken-Check"
        When I wait 3 seconds for the element with locator "[data-test='triage-run-button']" to be visible
        When I highlight element "[data-test='triage-run-button']"
        When I announce: "Прямо в карточке чека виден вердикт рядом со статусом и кнопка перезапуска триажа."
        When I click element with locator "[data-test='triage-run-button']"
        When I wait 90 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I clear highlight

        # --- Админка: раздел AI, провайдер и Test connection ---
        When I set demo step 7 of 9: "Раздел AI в админке и проверка соединения"
        When I go to "ai" page
        When I wait 10 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I announce: "В админке отдельный раздел AI: выбор провайдера, температура, лимит токенов и таймаут. Проверим соединение с моделью кнопкой «Test connection»."
        When I click element with locator "[data-test='ai-providers-test']"
        When I wait 120 seconds for the element with locator "[data-test='ai-providers-test-result']" to be visible
        When I highlight element "[data-test='ai-providers-test-result']"
        When I announce: "Реальный ответ от провайдера: соединение работает, видна задержка."
        When I clear highlight

        # --- Per-project: вердикты, кастомный промпт и few-shot примеры ---
        When I set demo step 8 of 9: "Настройки проекта: вердикты, промпт и few-shot примеры"
        When I click element with locator "[data-test='ai-tab-projects']"
        When I wait 3 seconds for the element with locator "[data-test='ai-perproject-form']" to be visible
        When I click element with locator "[data-test='ai-project-select']"
        When I wait 3 seconds for the element with locator "[role='option']" to be visible
        When I click element with locator "[role='option']"
        When I wait 5 seconds for the element with locator "[data-test='ai-prompt']" to be visible
        When I highlight element "[data-test='ai-prompt']"
        When I announce: "Для каждого проекта свой набор вердиктов, полностью переопределяемый системный промпт (с кнопкой сброса к дефолту) и few-shot примеры — эталонные картинки с нужным вердиктом, которые модель видит перед реальной проверкой."
        When I clear highlight

        # --- Очередь триажа: вкладка Queue, группировка по рану, рестарт/отмена ---
        When I set demo step 9 of 9: "Очередь триажа: рестарт и отмена"
        When I click element with locator "[data-test='ai-tab-queue']"
        When I wait 10 seconds for the element with locator "[data-test='ai-queue']" to be visible
        When I highlight element "[data-test='ai-queue']"
        When I announce: "Отдельная вкладка Queue: упавшие проверки сгруппированы по ранам, список авто-обновляется. Видно очередь на анализ и счётчики."
        When I clear highlight
        When I wait 10 seconds for the element with locator "[data-test='ai-queue-run']" to be visible
        When I click element with locator "[data-test='ai-queue-run-toggle']"
        When I wait 5 seconds for the element with locator "[data-test='ai-queue-run-restart']" to be visible
        When I highlight element "[data-test='ai-queue-run-restart']"
        When I announce: "Любой ран можно развернуть и вручную перезапустить или отменить анализ — целиком по рану или по каждой проверке отдельно. Отмена помечает проверку служебным вердиктом «cancelled»."
        When I clear highlight

        When I announce: "Это AI Triage на реальной модели: семь изменений с разными вердиктами, in-progress, группировка, мультифильтр, перезапуск, проверка соединения, настройка под каждый проект и управляемая очередь анализа."
        When I end the demo
