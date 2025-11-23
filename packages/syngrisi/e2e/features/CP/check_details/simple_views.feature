@smoke
Feature: Simple Views - Expected, Actual, Diff

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
              - checkName: CheckName
                filePath: files/A.png
      """
    When I accept via http the 1st check with name "CheckName"
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
              - checkName: CheckName
                filePath: files/B.png
      """
    When I go to "main" page
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

  Scenario: Simple Views (Expected, Actual, Diff)
    When I wait 30 seconds for the element with locator "[data-segment-value='expected']" to be visible

    # expected
    When I click element with locator "[data-segment-value='expected']"
    When I wait up to 30 seconds for javascript condition:
      """
        return mainView && mainView.expectedImage
      """
    When I wait up to 30 seconds for javascript condition:
      """
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage) !== -1;
      """
    When I execute javascript code:
      """
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage)
      """
    Then I expect the stored "js" string is equal:
      """
      0
      """

    When I execute javascript code:
      """
        return mainView.canvas.getObjects().indexOf(mainView.actualImage)
      """
    Then I expect the stored "js" string is equal:
      """
      -1
      """

    # actual
    When I click element with locator "[data-segment-value='actual']"
    When I wait up to 30 seconds for javascript condition:
      """
        return mainView.canvas.getObjects().indexOf(mainView.actualImage) !== -1;
      """
    When I execute javascript code:
      """
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage)
      """
    Then I expect the stored "js" string is equal:
      """
      -1
      """

    When I execute javascript code:
      """
        return mainView.canvas.getObjects().indexOf(mainView.actualImage)
      """
    Then I expect the stored "js" string is equal:
      """
      0
      """

    # diff
    When I click element with locator "[data-segment-value='diff']"
    When I wait up to 30 seconds for javascript condition:
      """
        return mainView.canvas.getObjects().indexOf(mainView.diffImage) !== -1;
      """
    When I execute javascript code:
      """
        return mainView.canvas.getObjects().indexOf(mainView.diffImage)
      """
    Then I expect the stored "js" string is equal:
      """
      0
      """

