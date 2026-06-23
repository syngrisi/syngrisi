@demo @fast-server
Feature: AI Triage - Демонстрация всех возможностей

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            """
        Given I start Server and start Driver
        And I clear database

    Scenario: Демонстрация AI Triage - вердикты, фильтры, группировка, авто-принятие
        # --- Подготовка данных: три упавших чека с разными вердиктами ---
        When I set demo step 1 of 9: "Подготовка данных"
        When I announce: "AI Triage автоматически классифицирует каждый упавший чек: реальная регрессия, шум или намеренное изменение. Создадим несколько упавших чеков."

        Given I create "1" tests with:
            """
            testName: Главная страница
            project: TriageDemo
            checks:
                - checkName: Шум антиалиасинга
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "Шум антиалиасинга"
        Given I create "1" tests with:
            """
            testName: Главная страница
            project: TriageDemo
            checks:
                - checkName: Шум антиалиасинга
                  filePath: files/B.png
            """
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
              type: fake
              fakeVerdict: noise
              fakeConfidence: 9
              fakeReason: anti-aliasing on edges
            enabled: true
            """
        When I run AI triage for the 1st check named "Шум антиалиасинга"

        Given I create "1" tests with:
            """
            testName: Форма оплаты
            project: TriageDemo
            checks:
                - checkName: Сломанная вёрстка
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "Сломанная вёрстка"
        Given I create "1" tests with:
            """
            testName: Форма оплаты
            project: TriageDemo
            checks:
                - checkName: Сломанная вёрстка
                  filePath: files/B.png
            """
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
              type: fake
              fakeVerdict: likely_bug
              fakeConfidence: 8
              fakeReason: layout shifted unexpectedly
            enabled: true
            """
        When I run AI triage for the 1st check named "Сломанная вёрстка"

        Given I create "1" tests with:
            """
            testName: Новый логотип
            project: TriageDemo
            checks:
                - checkName: Редизайн хедера
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "Редизайн хедера"
        Given I create "1" tests with:
            """
            testName: Новый логотип
            project: TriageDemo
            checks:
                - checkName: Редизайн хедера
                  filePath: files/B.png
            """
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
              type: fake
              fakeVerdict: intended_change
              fakeConfidence: 9
              fakeReason: intentional header redesign
            enabled: true
            """
        When I run AI triage for the 1st check named "Редизайн хедера"

        # --- Вердикт-бейджи ---
        When I set demo step 2 of 9: "Бейджи вердиктов"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Главная страница']" to be visible
        When I unfold the test "Главная страница"
        When I unfold the test "Форма оплаты"
        When I unfold the test "Новый логотип"
        When I wait 2 seconds for the element with locator "[data-triage-verdict='likely_bug']" to be visible
        When I highlight element "[data-triage-verdict='likely_bug']"
        When I announce: "Каждый упавший чек теперь помечен цветным AI-вердиктом с уровнем уверенности: красный — вероятный баг, серый — шум, зелёный — намеренное изменение. Ревьюер видит приоритеты с одного взгляда."
        When I clear highlight

        # --- Клик по бейджу → фильтрация ---
        When I set demo step 3 of 9: "Фильтр кликом по бейджу"
        When I highlight element "[data-triage-verdict='noise']"
        When I announce: "Клик по бейджу мгновенно отфильтрует чеки с этим вердиктом — удобно разобрать однотипный шум пачкой."
        When I click element with locator "[data-triage-verdict='noise']"
        When I wait 2 seconds for the element with locator "[data-triage-verdict='noise']" to be visible
        Then the element with locator "[data-triage-verdict='likely_bug']" should be hidden
        When I announce: "Остались только чеки с вердиктом «шум»."
        When I clear highlight

        # --- Фильтр по уверенности / причине ---
        When I set demo step 4 of 9: "Фильтр по уверенности и причине"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Главная страница']" to be visible
        When I unfold the test "Форма оплаты"
        When I unfold the test "Новый логотип"
        When I highlight element "[data-test='triage-filter-button']"
        When I announce: "Здесь — фильтр по минимальной уверенности и по тексту причины. Покажем только высокоуверенные вердикты."
        When I click element with locator "[data-test='triage-filter-button']"
        When I wait 2 seconds for the element with locator "[data-test='triage-filter-popover']" to be visible
        When I fill "9" into element with label "Min confidence"
        When I click element with locator "[data-test='triage-filter-apply']"
        When I wait 2 seconds for the element with locator "[data-triage-verdict='intended_change']" to be visible
        Then the element with locator "[data-triage-verdict='likely_bug']" should be hidden
        When I announce: "Чеки с уверенностью ниже девяти скрыты."
        When I clear highlight

        # --- Группировка по AI-вердикту ---
        When I set demo step 5 of 9: "Группировка по AI-вердикту"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Главная страница']" to be visible
        When I select the option with the text "AI Verdict" for element "select[data-test='navbar-group-by']"
        When I wait 30 seconds for the element with locator "//li[contains(., 'likely_bug')]" to be visible
        When I highlight element "//li[contains(., 'likely_bug')]"
        When I announce: "Навбар умеет группировать тесты по AI-вердикту — можно сразу открыть все вероятные баги в текущем ране."
        When I click element with locator "li*=likely_bug"
        When I wait 5 seconds for the element with locator "[data-table-test-name='Форма оплаты']" to be visible
        When I clear highlight

        # --- Re-run в карточке чека ---
        When I set demo step 6 of 9: "Перезапуск триажа и детали"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Форма оплаты']" to be visible
        When I unfold the test "Форма оплаты"
        When I open the 1st check "Сломанная вёрстка"
        When I wait 3 seconds for the element with locator "[data-test='triage-run-button']" to be visible
        When I highlight element "[data-test='triage-run-button']"
        When I announce: "В карточке чека виден вердикт и кнопка перезапуска триажа — удобно обновить вердикт после правок."
        When I click element with locator "[data-test='triage-run-button']"
        When I wait 3 seconds for the element with locator "[data-triage-verdict='likely_bug']" to be visible
        When I clear highlight

        # --- Авто-принятие по политике проекта ---
        When I set demo step 7 of 9: "Авто-принятие по политике проекта"
        Given I create "1" tests with:
            """
            testName: Зрелый проект
            project: TriageAutoDemo
            checks:
                - checkName: Безопасное изменение
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "Безопасное изменение"
        Given I create "1" tests with:
            """
            testName: Зрелый проект
            project: TriageAutoDemo
            checks:
                - checkName: Безопасное изменение
                  filePath: files/B.png
            """
        Given the project "TriageAutoDemo" has triage policy "auto" threshold 9 verdicts "intended_change,noise"
        When I update via http setting "ai_triage_provider" with params:
            """
            value:
              type: fake
              fakeVerdict: noise
              fakeConfidence: 10
            enabled: true
            """
        When I run AI triage for the 1st check named "Безопасное изменение"
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Зрелый проект']" to be visible
        When I unfold the test "Зрелый проект"
        When I wait 3 seconds for the element with locator "[data-triage-auto-accepted='true']" to be visible
        When I highlight element "[data-triage-auto-accepted='true']"
        When I announce: "На зрелом проекте политика авто-принимает уверенный безопасный вердикт: чек принят AI и помечен «Accepted by AI». Реальные баги и спорное всегда остаются человеку."
        When I clear highlight

        # --- Админка: отдельный раздел AI и выбор провайдера модели ---
        When I set demo step 8 of 9: "Раздел AI в админке"
        When I go to "ai" page
        When I wait 10 seconds for the element with locator "[data-test='ai-providers-form']" to be visible
        When I highlight element "[data-test='ai-providers-form']"
        When I announce: "В админке появился отдельный раздел AI. Здесь администратор выбирает провайдера модели — OpenAI, Anthropic, Gemini или self-hosted Ollama — с проверкой соединения. Скриншоты могут не покидать инфраструктуру компании."
        When I clear highlight

        # --- Per-project: включение и кастомные вердикты ---
        When I set demo step 9 of 9: "Настройки проекта: включение и кастомные вердикты"
        When I wait 3 seconds for the element with locator "[data-test='ai-perproject-form']" to be visible
        When I highlight element "[data-test='ai-perproject-form']"
        When I announce: "AI Triage включается отдельно для каждого проекта и по умолчанию выключен. Здесь же — политика авто-принятия."
        When I clear highlight
        When I click element with locator "[data-test='ai-project-select']"
        When I wait 1 seconds
        When I click element with locator "[role='option']:has-text('TriageDemo')"
        When I wait 2 seconds for the element with locator "[data-test='ai-verdicts-table']" to be visible
        When I highlight element "[data-test='ai-verdicts-table']"
        When I announce: "А набор вердиктов полностью настраивается под проект: можно добавлять свои, менять цвет, подписи и пороги, и удалять дефолтные — реальная регрессия и неуверенность всегда защищены от авто-принятия."
        When I clear highlight

        When I announce: "Это AI Triage: вердикты, фильтры, группировка, авто-принятие и настройка под каждый проект — меньше шума, быстрее ревью."
        When I pause
        When I end the demo
