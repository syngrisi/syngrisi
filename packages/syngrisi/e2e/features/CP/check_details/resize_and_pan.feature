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

    # before zoom: check zoom coefficient
    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.getZoom(), 10).toFixed(2)
      """
    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.getZoom(), 10).toFixed(2)
      """
    Then I expect the stored "js" string is equal:
      """
      1.00
      """

    # emulate vertical mouse wheels with control key (move right and bottom)
    When I execute javascript code:
      """
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
    }

    mainView.canvas.fire('mouse:wheel', eventObj)
      """

    # after zoom: check zoom coefficient
    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.getZoom(), 10).toFixed(2)
      """

    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.getZoom(), 10).toFixed(2) > 1.1
      """
    Then I expect the stored "js" string is equal:
      """
      true
      """

  @flaky
  Scenario: Pan via central mouse button and Mouse Move
    # check pan coordinates
    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.viewportTransform[4]).toFixed(2).toString()
         + '/'
         + parseFloat(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """

    When I execute javascript code:
      """
    return (parseFloat(mainView.canvas.viewportTransform[4]) > 60).toString()
      + "/"
      + parseFloat(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """
    Then I expect the stored "js" string is equal:
      """
          true/0.00
      """

    # emulate horizontal and vertical mouse move (move right and bottom)
    When I execute javascript code:
      """
    const eventObj = {
      e: {
        preventDefault: ()=>{},
        buttons: 4,
        stopPropagation: ()=>{},
        movementX: 50,
        movementY: 50,
      }
    }

    mainView.canvas.fire('mouse:move', eventObj)
      """
    # check pan coordinates

    When I execute javascript code:
      """
    return parseFloat(mainView.canvas.viewportTransform[4]).toFixed(2).toString()
         + '/'
         + parseFloat(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """

    When I execute javascript code:
      """
    return (parseFloat(mainView.canvas.viewportTransform[4]) > 100).toString()
      + "/"
      + parseFloat(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """
    Then I expect the stored "js" string is equal:
      """
          true/50.00
      """

  Scenario: Pan via Mouse Wheel (touchpad)
    # check pan coordinates
    When I execute javascript code:
      """
    return (parseInt(mainView.canvas.viewportTransform[4]).toFixed(2)).toString()
      + "/"
      + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """

    When I execute javascript code:
      """
    return (parseInt(mainView.canvas.viewportTransform[4]).toFixed(2) > 60).toString()
      + "/"
      + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """
    Then I expect the stored "js" string is equal:
      """
          true/0.00
      """

    # emulate horizontal and vertical mouse wheels (move right and bottom)
    When I execute javascript code:
      """
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
    }

    mainView.canvas.fire('mouse:wheel', eventObj)
      """

    # Additional mouse wheel actions for testing (to verify actions work)
    When I execute javascript code:
      """
    const eventObj2 = {
      e: {
        ctrlKey: false,
        preventDefault: ()=>{},
        stopPropagation: ()=>{},
        offsetX: 200,
        offsetY: 200,
        deltaY: -50,
        deltaX: -50,
      }
    }

    mainView.canvas.fire('mouse:wheel', eventObj2)
      """

    When I execute javascript code:
      """
    const eventObj3 = {
      e: {
        ctrlKey: false,
        preventDefault: ()=>{},
        stopPropagation: ()=>{},
        offsetX: 200,
        offsetY: 200,
        deltaY: -50,
        deltaX: -50,
      }
    }

    mainView.canvas.fire('mouse:wheel', eventObj3)
      """
    # check pan coordinates
    When I execute javascript code:
      """
    return (parseInt(mainView.canvas.viewportTransform[4]).toFixed(2)).toString()
      + "/"
      + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """

    When I execute javascript code:
      """
    return (parseInt(mainView.canvas.viewportTransform[4]).toFixed(2) >= 80).toString()
      + "/"
      + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
      """
    Then I expect the stored "js" string is equal:
      """
          true/75.00
      """
