@demo @env:SYNGRISI_AUTH:true @env:SYNGRISI_DISABLE_FIRST_RUN:true
Feature: Baselines Spotlight Demo

  Background:
    Given the database is cleared
    And I seed via http baselines with usage:
      """
      baselines:
        - name: spotlight-baseline
          checkName: Spotlight baseline
          filePath: files/A.png
          browserName: chromium
          viewport: 1280x720
          os: linux
          usageCount: 2
      """
    When I open the app
    And I login with user:"Test" password "123456aA-"
    And I go to "main" page

  Scenario: Demo: navigate to baselines via Spotlight
    When I announce: "Покажу, как найти новый раздел Baselines через Spotlight."
    And I highlight element "button[aria-label='Search']"
    When I click element with locator "button[aria-label='Search']"
    And I announce: "Открываю поиск Spotlight."
    And I highlight element "[aria-label='Spotlight search']"
    And I fill "Baselines" into element with placeholder "Search..."
    And I announce: "Ищу раздел Baselines."
    And I wait 10 seconds for the button with name "Baselines" to be visible
    And I highlight element "text=Baselines"
    And I announce: "Выбираю пункт Baselines в результатах."
    When I click the 1st button "Baselines"
    Then the current url contains "/baselines"
    And I announce: "Мы на странице Baselines."
    And I highlight element "[data-test='table-header-Name']"
    And I wait 30 seconds for the element with locator "[data-row-name='Spotlight baseline']" to be visible
    And I highlight element "[data-row-name='Spotlight baseline']"
    And I announce: "Нашёл нужный бейзлайн."
    When I click element with locator "[data-row-name='Spotlight baseline']"
    Then the current url contains "<baselineSeed.usageSnapshotId>"
    And I announce: "Мы перешли к тестам, отфильтрованным по выбранному бейзлайну."
    And I clear highlight
    And I end the demo
