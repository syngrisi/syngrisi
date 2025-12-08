@demo @fast-server
Feature: Share Check Demo

    Background:
        # First create test user with auth disabled
        When I set env variables:
            """
            SYNGRISI_TEST_MODE: true
            SYNGRISI_AUTH: false
            """
        Given I start Server
        When I create via http test user
        Given I stop Server

        # Now enable auth and login
        When I set env variables:
            """
            SYNGRISI_TEST_MODE: false
            SYNGRISI_AUTH: true
            """
        When I reload session
        When I login with user:"Test" password "123456aA-"
        When I wait 10 seconds for the element with locator "span*=TA" to be visible

    Scenario: Демонстрация Share - шаринг деталей чека для анонимных пользователей
        # Создаём тест с чеком
        Given I create "1" tests with:
            """
            testName: ShareDemo
            checks:
                - checkName: DemoCheck
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "DemoCheck"

        # Открываем страницу
        When I go to "main" page
        Then the element with locator "[data-test='table-scroll-area']" should be visible

        # ДЕМО ТОЧКА 1: Вступление
        When I announce: "Демонстрация новой функции Share - возможность поделиться деталями чека с любым пользователем без необходимости авторизации."

        # Разворачиваем тест и открываем Check Details
        When I click element with locator "[data-table-test-name='ShareDemo']"
        And I wait 0.5 seconds
        When I click element with locator "[data-test-preview-image='DemoCheck']"
        And I wait 1 seconds

        # Ждём загрузки
        Then the element with locator "[data-check='toolbar']" should be visible

        # ДЕМО ТОЧКА 2: Показываем меню три точки
        When I announce: "Для создания ссылки используем меню действий в панели инструментов."
        And I pause for 1500 ms

        When I highlight element "[data-test='check-details-menu']"
        And I pause for 1500 ms
        When I click element with locator "[data-test='check-details-menu']"
        And I pause for 500 ms

        # ДЕМО ТОЧКА 3: Показываем кнопку Share
        When I highlight element "[data-test='menu-share-check']"
        And I announce: "Нажимаем 'Share' для открытия диалога шаринга."
        And I pause for 1500 ms
        And I clear highlight
        When I click element with locator "[data-test='menu-share-check']"

        And I wait 0.5 seconds

        # ДЕМО ТОЧКА 4: Показываем модальное окно
        When I announce: "Модальное окно Share позволяет создать уникальную ссылку для просмотра деталей чека."
        And I pause for 2000 ms

        # ДЕМО ТОЧКА 5: Создаём ссылку
        When I highlight element "[data-test='create-share-button']"
        And I announce: "Нажимаем 'Create Share Link' для генерации ссылки."
        And I pause for 1500 ms
        And I clear highlight
        When I click element with locator "[data-test='create-share-button']"

        # Ждём появления URL input после API вызова
        When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible

        # ДЕМО ТОЧКА 6: Показываем сгенерированную ссылку
        When I announce: "Ссылка создана! Любой, у кого есть эта ссылка, может просмотреть детали чека в режиме только для чтения."
        When I highlight element "[data-test='share-url-input']"
        And I pause for 3000 ms
        And I clear highlight

        # ДЕМО ТОЧКА 7: Показываем кнопку копирования
        When I announce: "Ссылку можно скопировать в буфер обмена и отправить коллегам через email, Slack или другой мессенджер."
        When I highlight element "[data-test='copy-share-url']"
        And I pause for 2000 ms
        And I clear highlight

        # ДЕМО ТОЧКА 8: Копируем ссылку и сохраняем URL
        When I click element with locator "[data-test='copy-share-url']"
        And I wait 0.5 seconds
        When I save the share URL

        # ДЕМО ТОЧКА 9: Выходим из системы для демонстрации анонимного доступа
        When I announce: "Теперь выйдем из системы и откроем share-ссылку как анонимный пользователь."
        And I pause for 2000 ms

        # Выходим из системы
        When I go to "logout" page
        # Wait for logout success modal and click Sign In to go to login page
        When I wait 10 seconds for the element with locator "a:has-text('Sign In')" to be visible
        When I click element with locator "a:has-text('Sign In')"
        When I wait 10 seconds for the element with locator "[data-test='login-email-input']" to be visible

        # Открываем сохраненную share ссылку
        When I announce: "Открываем share-ссылку без авторизации..."
        And I pause for 1500 ms
        When I open the saved share URL

        # Ждём загрузки CheckDetails
        When I wait 10 seconds for the element with locator "[data-check='toolbar']" to be visible

        # ДЕМО ТОЧКА 10: Показываем read-only режим
        When I announce: "В режиме share видим детали чека, но кнопки Accept, Remove и меню действий скрыты - только просмотр."
        And I pause for 3000 ms

        # Показываем что меню и кнопок нет
        When I announce: "Обратите внимание: кнопка Accept и меню три точки отсутствуют - пользователь может только просматривать."
        And I pause for 2500 ms

        # ДЕМО ТОЧКА 11: Завершение
        When I announce: "Демонстрация Share завершена! Функция упрощает совместную работу, позволяя делиться результатами визуального тестирования с заинтересованными сторонами без необходимости создания учетных записей."

        # Завершаем демо
        When I end the demo
