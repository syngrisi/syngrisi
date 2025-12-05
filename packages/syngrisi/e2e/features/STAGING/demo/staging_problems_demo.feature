@demo @staging @no-app-start
Feature: Demo: Проблемы Staging тестов

  Демонстрация проблем, возникающих при тестировании на staging окружении
  с production данными.

  Background:
    Given I open the staging app
    And I am logged in as "reviewer" on staging

  @problem-preview-visibility
  Scenario: Demo: Проблема с видимостью check preview
    # Проблема: После создания E2E checks, превью изображения не видны
    # потому что они созданы с тестовыми изображениями без реального контента

    When I announce: "Добро пожаловать! Сейчас мы покажем проблему с видимостью превью изображений на staging."
    And I wait 1 seconds

    Given I should see the main dashboard
    When I announce: "Мы находимся на главной странице. Обратите внимание на список runs слева."
    And I wait 1 seconds

    # Показываем левую панель с runs
    When I highlight element "[role='navigation'] [role='list']"
    And I wait 2 seconds
    When I announce: "Здесь видны runs - как production данные, так и E2E тестовые данные."
    And I wait 1 seconds
    When I clear highlight

    # Кликаем на первый test row
    When I announce: "Давайте кликнем на первый test row чтобы развернуть превью checks."
    When I click on the first test row on staging
    And I wait 2 seconds

    # Пытаемся найти превью
    When I announce: "Теперь должны появиться превью изображений checks..."
    And I should see check previews
    And I wait 1 seconds

    # Показываем проблему
    When I announce: "Обратите внимание - превью найдены в DOM, но многие из них НЕ ВИДНЫ на экране."
    When I announce: "Это происходит потому что E2E тесты создают checks с пустыми изображениями." and PAUSE

    When I announce: "Демонстрация проблемы завершена."
    When I end the demo

  @problem-data-pollution
  Scenario: Demo: Загрязнение базы E2E данными
    # Проблема: После запуска lifecycle тестов в базе остаются тестовые данные
    # которые влияют на другие тесты

    When I announce: "Сейчас мы покажем проблему загрязнения staging базы E2E данными."
    And I wait 1 seconds

    Given I should see the main dashboard

    # Показываем таблицу с данными
    When I highlight element "table"
    When I announce: "В таблице видны как production checks, так и E2E тестовые данные."
    And I wait 2 seconds
    When I clear highlight

    # Ищем E2E данные
    When I search for "E2E" in the quick filter on staging
    And I wait 2 seconds

    When I announce: "Мы отфильтровали по 'E2E' - это тестовые данные созданные автотестами."
    When I highlight element "tbody"
    And I wait 2 seconds

    When I announce: "Эти данные остаются в базе и могут влиять на другие тесты." and PAUSE
    When I clear highlight

    # Очищаем фильтр
    When I clear the quick filter on staging
    And I wait 1 seconds

    When I announce: "Демонстрация загрязнения данными завершена."
    When I end the demo

  @problem-api-creation
  Scenario: Demo: Создание check через API
    # Демонстрация как работает создание check через API
    # и какие проблемы при этом возникают

    When I announce: "Сейчас мы покажем как создается check через API и какие данные при этом появляются."
    And I wait 1 seconds

    Given I should see the main dashboard

    When I announce: "Создаем тестовый check через API с именем DEMO-Test-Check..."
    When I create a test check on staging with name "DEMO-Test-Check"
    And I wait 1 seconds

    When I announce: "Check создан! Теперь найдем его в интерфейсе."

    # Ищем созданный check
    When I search for "DEMO-Test-Check" in the quick filter on staging
    And I wait 2 seconds

    When I announce: "Вот наш созданный check. Обратите внимание на статус 'New'."
    When I highlight element "tbody tr:first-child"
    And I wait 2 seconds
    When I clear highlight

    # Показываем что у check нет нормального превью
    When I announce: "Проблема: check создан с тестовым изображением, поэтому превью будет некорректным." and PAUSE

    # Очистка
    When I announce: "Очищаем созданные данные..."
    When I cleanup staging test data
    And I wait 1 seconds

    When I clear the quick filter on staging
    When I announce: "Демонстрация создания check через API завершена."
    When I end the demo
