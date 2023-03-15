Feature: Check Details - Initial image resize

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I wait for "3" seconds
        When I execute javascript code:
        """
        return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
        """

        When I execute javascript code:
        """
        return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5] === '362.5_0'
        || mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5] === '340.5_0'
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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I wait for "3" seconds
        When I execute javascript code:
        """
        return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
        """
        When I execute javascript code:
        """
        return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5] === '332.5_0'
        || mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5] === '310_0'
        || mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5] === '310_5_0'
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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I wait for "3" seconds
        When I execute javascript code:
        """
        return mainView.canvas.viewportTransform[4] + '_' + mainView.canvas.viewportTransform[5]
        """
        When I execute javascript code:
        """
        return (parseInt(mainView.canvas.viewportTransform[4]) + '_' + mainView.canvas.viewportTransform[5]) === '529_0'
        || (parseInt(mainView.canvas.viewportTransform[4]) + '_' + mainView.canvas.viewportTransform[5]) === '528_0'
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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I wait for "3" seconds
        When I execute javascript code:
        """
        return parseInt(mainView.canvas.viewportTransform[4]) + '_' + mainView.canvas.viewportTransform[5]
        """
        Then I expect the stored "js" string is equal:
        """
          0_0
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

