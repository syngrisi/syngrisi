@demo
Feature: Demo: Bug Fixes - Regions and Accept Icon

  Background:
    When I open the app
    When I clear local storage

  @demo
  Scenario: Demo: Regions persistence after page refresh
    # Setup - create a PASSED check (need baseline first)
    Given I create "1" tests with:
      """
          testName: RegionsDemo
          checks:
            - checkName: DemoCheck
              filePath: files/A.png
      """
    When I accept via http the 1st check with name "DemoCheck"
    Given I create "1" tests with:
      """
          testName: RegionsDemo
          checks:
            - checkName: DemoCheck
              filePath: files/A.png
      """

    When I go to "main" page
    When I unfold the test "RegionsDemo"

    # Welcome
    When I announce: "Добро пожаловать! Эта демонстрация показывает исправление сохранения ignore-регионов после перезагрузки страницы."

    # Open check details
    When I highlight element "[data-test-preview-image='DemoCheck']"
    When I announce: "Откроем детали проверки, кликнув на превью изображения."
    When I click element with locator "[data-test-preview-image='DemoCheck']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='DemoCheck']" to be visible
    When I clear highlight

    # Show status
    When I highlight element "[data-check-status-name='DemoCheck']"
    When I announce: "Это проверка со статусом PASSED - мы можем добавить к ней ignore-регионы."
    When I clear highlight

    # Wait for mainView to be ready
    When I repeat javascript code until stored "js" string equals "ready":
      """
      if (typeof mainView === 'undefined' || !mainView.canvas || !mainView.canvas.getObjects) return "loading";
      const btn = document.querySelector('[data-check="add-ignore-region"]');
      if (btn && (btn.disabled || btn.hasAttribute('disabled'))) return "loading";
      return "ready";
      """

    # Check initial state - no regions
    When I execute javascript code:
      """
      return(mainView.allRects.length.toString());
      """
    Then I expect the stored "js" string is equal:
      """
      0
      """

    # Add ignore region
    When I highlight element "[data-check='add-ignore-region']"
    When I announce: "Нажимаю кнопку 'Add Ignore Region' - регион создаётся автоматически."
    When I wait 1 seconds
    When I click element with locator "[data-check='add-ignore-region']"
    When I clear highlight

    # Wait for region to appear
    When I repeat javascript code until stored "js" string equals "1":
      """
      if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
      return (mainView.allRects.length.toString());
      """
    When I announce: "Регион создан! Видите розовый прямоугольник на канвасе."

    # Save region
    When I highlight element "[data-check='save-ignore-region']"
    When I announce: "Теперь сохраним регион в baseline, нажав кнопку Save."
    When I click element with locator "[data-check='save-ignore-region']"
    When I clear highlight

    When I announce: "Регион сохранён! Ключевой фикс - регионы теперь получают правильное свойство 'name'."

    # Refresh page - THIS IS THE KEY TEST
    When I announce: "А теперь критический тест - перезагружаем страницу и проверяем, что регионы сохранились..."
    When I refresh page
    When I wait 10 seconds for the element with locator "[data-check-header-name='DemoCheck']" to be visible

    # Verify region persists after refresh
    When I repeat javascript code until stored "js" string equals "1":
      """
      if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
      return (mainView.allRects.length.toString());
      """

    When I highlight element "canvas"
    When I announce: "УСПЕХ! Регион сохранился после перезагрузки страницы. Это был баг, который мы исправили!"
    When I clear highlight

    # Explain the fix
    When I announce: "Исправление гарантирует, что при загрузке регионов с сервера они получают имя 'ignore_rect', поэтому попадают в коллекцию allRects."

    # End demo
    When I announce: "Демонстрация завершена! Регионы теперь корректно сохраняются между перезагрузками страницы."
    When I end the demo


  @demo
  Scenario: Demo: Accept Icon loading state fix
    # Setup - create a NEW check
    Given I create "1" tests with:
      """
          testName: AcceptIconDemo
          checks:
            - checkName: IconCheck
              filePath: files/A.png
      """

    When I go to "main" page
    When I unfold the test "AcceptIconDemo"

    # Welcome
    When I announce: "Эта демонстрация показывает исправление видимости иконки Accept во время состояния загрузки."

    # Open check details
    When I click element with locator "[data-test-preview-image='IconCheck']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='IconCheck']" to be visible

    # Show the accept icon with loading state awareness
    When I announce: "Иконка Accept в тулбаре теперь имеет атрибут data-loading для корректного определения состояния."

    # Wait for loading to complete
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck'][data-loading='false']" to be visible
    When I highlight element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck']"
    When I announce: "Иконка видна с data-loading='false'. SVG доступен для проверки."

    # Check the SVG is visible
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck'] svg" to be visible
    When I announce: "SVG иконка видна и может быть проверена. Раньше она была скрыта во время загрузки."
    When I clear highlight

    # Show the toolbar scope fix
    When I highlight element "[data-check='toolbar']"
    When I announce: "Мы также исправили селектор, добавив область toolbar, чтобы избежать конфликтов с панелью Related Checks."
    When I clear highlight

    # Accept the check
    When I announce: "Давайте примем эту проверку и убедимся, что иконка обновляется корректно."
    When I accept via http the 1st check with name "IconCheck"
    When I refresh page
    When I wait 10 seconds for the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck'][data-loading='false']" to be visible

    # Verify icon changed to filled
    When I highlight element "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck']"
    Then the element with locator "[data-check='toolbar'] [data-test='check-accept-icon'][data-popover-icon-name='IconCheck'] svg" should have has attribute "data-test-icon-type=fill"
    When I announce: "УСПЕХ! Иконка изменилась на заполненную после принятия, и мы можем надёжно это определить."
    When I clear highlight

    # End demo
    When I announce: "Демонстрация завершена! Иконка Accept теперь корректно показывает своё состояние загрузки для надёжного тестирования."
    When I end the demo
