@smoke @fast-server
Feature: Check details Resize and Pan
  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage
    Given I create "1" tests with:
      """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "TestName"
    When I click element with locator "[data-test-preview-image='CheckName']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

  Scenario: Resize Dropdown Usage
    # 50%
    When I click element with locator "[data-check='open-zoom-dropdown']"
    When I wait 10 seconds for the element with locator "//*[@data-check='zoom-dropdown']//div[text()='50%']" to be visible
    When I click element with locator "//*[@data-check='zoom-dropdown']//div[text()='50%']"
    When I execute javascript code:
      """
    return mainView.canvas.getZoom().toString()
      """
    Then I expect the stored "js" string is equal:
      """
      0.5
      """

    # 100%
    When I click element with locator "[data-check='open-zoom-dropdown']"
    When I wait 10 seconds for the element with locator "//*[@data-check='zoom-dropdown']//div[text()='100%']" to be visible
    When I click element with locator "//*[@data-check='zoom-dropdown']//div[text()='100%']"
    When I execute javascript code:
      """
    return mainView.canvas.getZoom().toString()
      """
    Then I expect the stored "js" string is equal:
      """
      1
      """

    # 200%
    When I click element with locator "[data-check='open-zoom-dropdown']"
    When I wait 10 seconds for the element with locator "//*[@data-check='zoom-dropdown']//div[text()='200%']" to be visible
    When I click element with locator "//*[@data-check='zoom-dropdown']//div[text()='200%']"
    When I execute javascript code:
      """
    return mainView.canvas.getZoom().toString()
      """
    Then I expect the stored "js" string is equal:
      """
      2
      """

    # Fit by width
    When I click element with locator "[data-check='open-zoom-dropdown']"
    When I wait 10 seconds for the element with locator "//*[@data-check='zoom-dropdown']//div[text()='Fit by width ']" to be visible
    When I click element with locator "//*[@data-check='zoom-dropdown']//div[text()='Fit by width ']"
    When I execute javascript code:
      """
    return (mainView.canvas.getZoom().toFixed(2) > 1.45) && (mainView.canvas.getZoom().toFixed(2) < 1.65)
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Fit by canvas
    When I click element with locator "[data-check='open-zoom-dropdown']"
    When I wait 10 seconds for the element with locator "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']" to be visible
    When I click element with locator "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']"
    When I execute javascript code:
      """
    return (mainView.canvas.getZoom().toFixed(2) > 0.27).toString()
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

  Scenario: Resize via Ctrl + Mouse Wheel

    # Store initial zoom and verify it's reasonable
    When I execute javascript code:
      """
    window.initialZoom = parseFloat(mainView.canvas.getZoom());
    return (window.initialZoom > 0.5 && window.initialZoom <= 2).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Emulate zoom and verify increase in one step to avoid state loss
    When I execute javascript code:
      """
    // Store initial zoom locally
    const initialZoom = parseFloat(mainView.canvas.getZoom());

    // Emulate vertical mouse wheel with control key (zoom in)
    const eventObj = {
      e: {
        ctrlKey: true,
        preventDefault: ()=>{},
        stopPropagation: ()=>{},
        offsetY: 300,
        offsetX: 400,
        deltaY: -150,
        deltaX: 0,
      }
    };
    mainView.canvas.fire('mouse:wheel', eventObj);

    // Check that zoom increased by at least 10%
    const currentZoom = parseFloat(mainView.canvas.getZoom());
    const minExpectedZoom = initialZoom * 1.1;
    return (currentZoom >= minExpectedZoom).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

  @flaky
  Scenario: Pan via central mouse button and Mouse Move
    # Store initial pan coordinates and verify X position is reasonable (centered)
    When I execute javascript code:
      """
    window.initialPanX = parseFloat(mainView.canvas.viewportTransform[4]);
    window.initialPanY = parseFloat(mainView.canvas.viewportTransform[5]);
    return (window.initialPanX > 60).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Emulate pan and verify delta in one step to avoid state loss
    When I execute javascript code:
      """
    // Store initial values locally
    const initialX = parseFloat(mainView.canvas.viewportTransform[4]);
    const initialY = parseFloat(mainView.canvas.viewportTransform[5]);

    // Emulate horizontal and vertical mouse move (move right and bottom)
    const eventObj = {
      e: {
        preventDefault: ()=>{},
        buttons: 4,
        stopPropagation: ()=>{},
        movementX: 50,
        movementY: 50,
      }
    };
    mainView.canvas.fire('mouse:move', eventObj);

    // Check delta
    const currentX = parseFloat(mainView.canvas.viewportTransform[4]);
    const currentY = parseFloat(mainView.canvas.viewportTransform[5]);
    const deltaX = currentX - initialX;
    const deltaY = currentY - initialY;

    // Allow small tolerance for floating point
    return (Math.abs(deltaX - 50) < 5 && Math.abs(deltaY - 50) < 5).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

  Scenario: Pan via Mouse Wheel (touchpad)
    # Store initial pan coordinates and verify X position is reasonable (centered)
    When I execute javascript code:
      """
    window.initialPanX = parseFloat(mainView.canvas.viewportTransform[4]);
    window.initialPanY = parseFloat(mainView.canvas.viewportTransform[5]);
    return (window.initialPanX > 60).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

    # Emulate 3 wheel events and verify delta in one step to avoid state loss
    When I execute javascript code:
      """
    // Store initial values locally
    const initialX = parseFloat(mainView.canvas.viewportTransform[4]);
    const initialY = parseFloat(mainView.canvas.viewportTransform[5]);

    // Emulate 3 horizontal and vertical mouse wheels (move right and bottom)
    // Each wheel event with deltaY: -50, deltaX: -50 pans by delta/2 = 25 pixels
    for (let i = 0; i < 3; i++) {
      const eventObj = {
        e: {
          ctrlKey: false,
          preventDefault: ()=>{},
          stopPropagation: ()=>{},
          offsetX: 200,
          offsetY: 200,
          deltaY: -50,
          deltaX: -50,
        }
      };
      mainView.canvas.fire('mouse:wheel', eventObj);
    }

    // Check delta
    const currentX = parseFloat(mainView.canvas.viewportTransform[4]);
    const currentY = parseFloat(mainView.canvas.viewportTransform[5]);
    const deltaX = currentX - initialX;
    const deltaY = currentY - initialY;

    // Expected: 3 events * (50/2) = 75 pixels in each direction
    return (Math.abs(deltaX - 75) < 10 && Math.abs(deltaY - 75) < 10).toString();
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """
