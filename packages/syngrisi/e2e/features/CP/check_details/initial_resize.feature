@fast-server
Feature: Check Details - Initial image resize

  Background:
  #         Given I start Server and start Driver

  @smoke @flaky
  Scenario: Image fit in the viewport
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/normal.png
      """
    When I set window size: "1440x900"
    When I open the app
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
      """

    When I execute javascript code:
      """
    const transform = mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5];
    const tx = parseFloat(mainView.canvas.viewportTransform[4]);
    const ty = mainView.canvas.viewportTransform[5];

    return transform === '362.5_0' ||
           transform === '340_0' ||
           transform === '340.5_0' ||
           transform === '350_0' ||
           (tx >= 335 && tx <= 365 && ty === 0);
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    When I execute javascript code:
      """
    return mainView.canvas.getZoom()
      """
    Then I expect the stored "js" string is equal:
      """
      1
      """

  Scenario: Image is too small
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/small.png
      """
    When I set window size: "1440x900"
    When I open the app
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
      """
    When I execute javascript code:
      """
    const translateX = parseFloat(mainView.canvas.viewportTransform[4]);
    const translateY = parseFloat(mainView.canvas.viewportTransform[5]);
    const allowed = [332.5, 310, 310.5];
    const tolerance = 20;

    const matchesTolerance = allowed.some(
          (target) => Math.abs(translateX - target) <= tolerance && Math.abs(translateY) <= 0.5
    );

    return matchesTolerance;
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    When I execute javascript code:
      """
    return mainView.canvas.getZoom()
      """
    Then I expect the stored "js" string is equal:
      """
      3.5
      """

  Scenario: Image is too high
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/extra_heigh_image.png
      """
    When I set window size: "1440x900"
    When I open the app
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
      """
    When I execute javascript code:
      """
    const translateX = parseInt(mainView.canvas.viewportTransform[4]);
    const translateY = parseInt(mainView.canvas.viewportTransform[5]);
    const allowedX = [528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545];
    const tolerance = 20;

    const matchesTolerance = allowedX.some(
          (target) => Math.abs(translateX - target) <= tolerance && Math.abs(translateY) <= 0.5
    );

    return matchesTolerance;
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    When I execute javascript code:
      """
    return (mainView.canvas.getZoom().toFixed(2))
      """
    Then I expect the stored "js" string is equal:
      """
      0.04
      """

  Scenario: Image is too wide
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/extra_wide.png
      """
    When I set window size: "1440x900"
    When I open the app
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    const translateX = parseFloat(mainView.canvas.viewportTransform[4]);
    const translateY = parseFloat(mainView.canvas.viewportTransform[5]);
    // Allow small deviation from 0 to account for browser rendering differences
    return Math.abs(translateX) < 5 && Math.abs(translateY) < 5;
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    When I execute javascript code:
      """
    return  (0.44 < (mainView.canvas.getZoom().toFixed(2)))
    && (0.50 > (mainView.canvas.getZoom().toFixed(2)))
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """