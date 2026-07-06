@demo
Feature: RCA - Demo - Setting and Environment Override

  Scenario: Demo - Toggle RCA from the admin panel and lock it via environment
    # --- Часть 1: управление из админки (без переменной среды) ---
    Given I stop Server
    When I set env variables:
      """
          SYNGRISI_AUTH: ""
          SYNGRISI_RCA: ""
      """
    When I go to "settings" page
    When I wait 10 seconds for the element with label "Enable RCA" to be visible
    When I scroll to element "[data-test='settings_value_rca_enabled']"

    When I set demo step 1 of 4: "RCA — постоянная настройка"
    When I announce: "Анализ первопричины теперь постоянная настройка инстанса. По умолчанию она выключена."
    When I highlight element "[data-test='settings_value_rca_enabled']"
    Then the element with label "Enable RCA" should be unchecked

    When I set demo step 2 of 4: "Включаем RCA"
    When I announce: "Администратор может включить её прямо здесь — без перезапуска и без переменной среды."
    When I click element with label "Enable RCA"
    When I click element with locator "button[aria-label='Update Enable RCA']"
    When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
    Then the element with label "Enable RCA" should be checked
    When I announce: "Готово — RCA включён для всего инстанса."
    When I clear highlight

    When I set demo step 3 of 4: "Выключаем RCA"
    When I announce: "Выключить так же просто — один клик и кнопка Update."
    When I highlight element "[data-test='settings_value_rca_enabled']"
    When I click element with label "Enable RCA"
    When I click element with locator "button[aria-label='Update Enable RCA']"
    When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
    Then the element with label "Enable RCA" should be unchecked
    When I clear highlight

    # --- Часть 2: переменная среды имеет приоритет и блокирует тумблер ---
    Given I stop Server
    When I set env variables:
      """
          SYNGRISI_AUTH: ""
          SYNGRISI_RCA: "true"
      """
    When I go to "settings" page
    When I wait 10 seconds for the element with locator "[data-test='settings_env_locked_rca_enabled']" to be visible
    When I scroll to element "[data-test='settings_env_badge_rca_enabled']"

    When I set demo step 4 of 4: "Приоритет переменной среды"
    When I announce: "Для управляемых развёртываний переменная среды SYNGRISI_RCA имеет приоритет над тумблером."
    When I highlight element "[data-test='settings_env_badge_rca_enabled']"
    Then the element with label "Enable RCA" should be checked
    When I announce: "Окружение принудительно включило RCA и заблокировало переключатель — администратор не может изменить его из интерфейса."
    When I clear highlight

    When I end the demo
