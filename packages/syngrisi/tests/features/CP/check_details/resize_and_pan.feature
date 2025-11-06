@smoke
Feature: Check details Resize and Pan
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
        When I go to "main" page
        When I unfold the test "TestName"
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

    Scenario: Resize Dropdown Usage
        # 50%
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='50%']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='50%']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getZoom().toString()
        """
        Then I expect the stored "js" string is equal:
        """
          0.5
        """

        # 100%
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='100%']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='100%']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getZoom().toString()
        """
        Then I expect the stored "js" string is equal:
        """
          1
        """

        # 200%
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='200%']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='200%']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getZoom().toString()
        """
        Then I expect the stored "js" string is equal:
        """
          2
        """

        # Fit by width
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='Fit by width ']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='Fit by width ']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return (mainView.canvas.getZoom().toFixed(2) > 1.45) && (mainView.canvas.getZoom().toFixed(2) < 1.65)
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """

        # Fit by canvas
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return (mainView.canvas.getZoom().toFixed(2) > 0.27).toString()
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """

    Scenario: Resize via Ctrl + Mouse Wheel
        When I wait for "1" seconds

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
        When I wait for "1" seconds

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

    Scenario: Pan via central mouse button and Mouse Move
        When I wait for "1" seconds
        # check pan coordinates
        When I execute javascript code:
        """
        return parseInt(mainView.canvas.viewportTransform[4]).toFixed(2).toString()
         + '/'
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
        When I wait for "1" seconds
        # check pan coordinates

        When I execute javascript code:
        """
        return parseInt(mainView.canvas.viewportTransform[4]).toFixed(2).toString()
         + '/'
         + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
        """

        When I execute javascript code:
        """
        return (parseInt(mainView.canvas.viewportTransform[4]).toFixed(2) > 100).toString()
            + "/"
            + parseInt(mainView.canvas.viewportTransform[5]).toFixed(2).toString()
        """
        Then I expect the stored "js" string is equal:
        """
          true/150.00
        """

    Scenario: Pan via Mouse Wheel (touchpad)
        When I wait for "1" seconds
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
        When I wait for "1" seconds
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

