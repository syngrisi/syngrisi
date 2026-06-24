@demo @fast-server @live-vlm
Feature: Syngrisi — обзорная демонстрация (visual testing + AI Triage)

    # Витрина для README: self-hosted визуальное регрессионное тестирование с AI-сортировкой диффов.
    # Реальная локальная vision-модель (Ollama, по умолчанию gemma4:12b) + реальное тестовое приложение
    # (HTML-фикстуры RCA, рендерятся в браузере). Компактный сценарий: три изменения — добавление,
    # смена текста и не прогрузившаяся картинка.
    # Запуск (demo-режим): export ENABLE_DEMO_MODE=true && npx bddgen && npx playwright test --project=demo --grep "обзорная" --workers=1

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Syngrisi за пару минут — от пикселя до AI-вердикта
        # --- 1. Подготовка: реальная модель + реальное приложение ---
        When I set demo step 1 of 7: "Syngrisi: визуальное тестирование + AI"
        Given a local vision model is available
        Given I prefer the local vision model "gemma4:12b"
        When I configure the triage provider for the local vision model
        When I announce: "Syngrisi — self-hosted визуальное регрессионное тестирование. Сохраняем эталон, прогоняем UI и ловим любые пиксельные отличия. А локальная AI-модель отделяет реальные баги от ожидаемых изменений — ничего не покидает вашу инфраструктуру."
        Given I create RCA baselines for the showcase changes
        Given I enable AI triage for the project "RCA Scenario App"
        When I create the showcase changed checks

        # --- 2. Ядро: проверка прошла, AI ещё анализирует, и вердикт появляется без перезагрузки ---
        When I set demo step 2 of 7: "Обнаружены отличия — AI анализирует"
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
        When I announce: "Прогон нашёл отличия от эталона. Пока модель думает — на бейджах «in progress». Запустим анализ одной проверки и НЕ будем перезагружать страницу."
        When I clear highlight
        When I run AI triage for the 1st check named "Added-Check"
        When I wait 20 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "Вердикт появился сам, без перезагрузки — список обновляется на лету, пока есть проверки в анализе."
        When I clear highlight

        # --- 3. AI-вердикты: разные изменения → разные вердикты ---
        When I set demo step 3 of 7: "AI-вердикты: баг или ожидаемое изменение"
        When I announce: "Классифицируем остальные изменения: модель сравнивает baseline, актуальный скриншот и diff каждой проверки."
        When I run AI triage for the 1st check named "Text-Check"
        When I run AI triage for the 1st check named "Image-Check"
        Then the 1st check named "Added-Check" has a valid AI verdict
        Then the 1st check named "Text-Check" has a valid AI verdict
        Then the 1st check named "Image-Check" has a valid AI verdict
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I unfold the test "RCA-Triage-Test"
        When I wait 10 seconds for the element with locator "[data-test='triage-verdict']" to be visible
        When I announce: "Три изменения — каждое со своим AI-вердиктом: добавление элементов и смена текста как ожидаемые правки, а не прогрузившаяся картинка — как вероятный баг. Вместо сплошной «красноты» сразу видно, что требует внимания."

        # --- 4. Детали проверки: baseline / actual / diff рядом с вердиктом ---
        When I set demo step 4 of 7: "Сравнение: baseline, actual и diff"
        When I open the 1st check "Image-Check"
        When I wait 5 seconds for the element with locator "[data-test='triage-run-button']" to be visible
        When I highlight element "[data-test='triage-verdict']"
        When I announce: "В карточке проверки — эталон, актуальный скриншот и подсвеченный diff, а рядом со статусом AI-вердикт с причиной и кнопкой перезапуска анализа."
        When I clear highlight
        When I click element with locator "[data-test='close-check-detail-icon']"

        # --- 5. Группировка и фильтр по AI-вердикту ---
        When I set demo step 5 of 7: "Группировка и фильтр по вердикту"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='RCA-Triage-Test']" to be visible
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 30 seconds for the element with locator "[data-test='navbar_item_0']" to be visible
        When I highlight element "[data-test='navbar_item_0']"
        When I announce: "Тесты можно группировать по AI-вердикту и фильтровать сразу по нескольким — баги отдельно, ожидаемые изменения отдельно."
        When I clear highlight

        # --- 6. Админка: провайдер и настройка под проект ---
        When I set demo step 6 of 7: "Настройка: провайдер AI и правила проекта"
        When I go to "ai" page
        When I wait 10 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I announce: "Провайдер настраивается в админке: OpenAI-совместимый, Anthropic, Gemini или локальный Ollama. Для каждого проекта — свои вердикты, промпт и политика авто-приёма."
        When I clear highlight

        # --- 7. Очередь анализа ---
        When I set demo step 7 of 7: "Очередь анализа: рестарт и отмена"
        When I click element with locator "[data-test='ai-tab-queue']"
        When I wait 10 seconds for the element with locator "[data-test='ai-queue']" to be visible
        When I highlight element "[data-test='ai-queue']"
        When I announce: "Очередь анализа сгруппирована по ранам, с авто-обновлением: любой ран или проверку можно перезапустить или отменить вручную."
        When I clear highlight

        When I announce: "Syngrisi: точное визуальное тестирование плюс локальный AI-триаж — быстро, приватно и под полным вашим контролем."
        When I end the demo
