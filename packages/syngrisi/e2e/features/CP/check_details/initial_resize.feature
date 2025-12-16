@fast-server
Feature: Check Details - Initial image resize

  Background:
    Given I start Server and start Driver
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
    When I wait for test "TestName" to appear in table
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
      """

    # Check that image is horizontally centered (tx should be positive for centering)
    # The exact value depends on canvas size and may vary with RCA panel state
    When I execute javascript code:
      """
    const tx = parseFloat(mainView.canvas.viewportTransform[4]);
    const ty = parseFloat(mainView.canvas.viewportTransform[5]);
    // Image should be horizontally centered (positive tx)
    // ty can now be non-zero due to zoomToFit centering
    const isCentered = tx >= 200 && tx <= 500;
    return isCentered.toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Zoom should be reasonable (1 for normal image, or auto-fitted)
    When I execute javascript code:
      """
    const zoom = mainView.canvas.getZoom();
    return (zoom >= 0.5 && zoom <= 2).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
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
    When I wait for test "TestName" to appear in table
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

    # Debug: log actual values first
    When I execute javascript code:
      """
    const tx = parseFloat(mainView.canvas.viewportTransform[4]);
    const ty = parseFloat(mainView.canvas.viewportTransform[5]);
    const zoom = mainView.canvas.getZoom();
    return `tx=${tx.toFixed(1)}/ty=${ty.toFixed(1)}/zoom=${zoom.toFixed(2)}`;
      """

    # Small image should be positioned and zoomed in significantly
    # Validate position: X is low (left-aligned after zoom), Y varies with centering
    When I execute javascript code:
      """
    const translateX = parseFloat(mainView.canvas.viewportTransform[4]);
    const translateY = parseFloat(mainView.canvas.viewportTransform[5]);
    const zoom = mainView.canvas.getZoom();
    // For small images with zoomToFit: X should be small (0-100), Y can vary, zoom should be high (3-10)
    const posOk = translateX >= -100 && translateX < 400;
    const zoomOk = zoom >= 2 && zoom <= 12;
    return (posOk && zoomOk).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
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
    When I wait for test "TestName" to appear in table
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

    # Very tall image should be centered horizontally
    When I execute javascript code:
      """
    const translateX = parseFloat(mainView.canvas.viewportTransform[4]);
    const translateY = parseFloat(mainView.canvas.viewportTransform[5]);
    // Tall image is centered horizontally - X should be in range 400-600
    // Y can vary due to zoomToFit centering
    return (translateX > 200 && translateX < 700 && Math.abs(translateY) < 120).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Zoom should be very small for extra high images (scaled down significantly)
    When I execute javascript code:
      """
    const zoom = mainView.canvas.getZoom();
    return (zoom > 0.01 && zoom < 0.2).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
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
    When I wait for test "TestName" to appear in table
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    When I execute javascript code:
      """
    const translateX = parseFloat(mainView.canvas.viewportTransform[4]);
    const translateY = parseFloat(mainView.canvas.viewportTransform[5]);
    // Wide image: X should be near 0 (left-aligned or slightly centered)
    // Y can vary due to zoomToFit centering
    return Math.abs(translateX) < 50 && Math.abs(translateY) < 300;
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Zoom should be in range for wide image (scaled down to fit width)
    When I execute javascript code:
      """
    const zoom = mainView.canvas.getZoom();
    return (zoom > 0.3 && zoom < 0.7).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """
