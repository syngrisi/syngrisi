@smoke
Feature: Simple Views (Expected, Actual, Diff)

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
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage) !== -1;
        """
        When I wait for "1" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage)
        """
        Then I expect the stored "js" string is equal:
        """
          0
        """

        When I wait for "1" seconds
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
        When I wait for "1" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().indexOf(mainView.expectedImage)
        """
        Then I expect the stored "js" string is equal:
        """
          -1
        """

        When I wait for "1" seconds
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
        When I wait for "1" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().indexOf(mainView.diffImage)
        """
        Then I expect the stored "js" string is equal:
        """
          0
        """

    Scenario: Failed check opened via deep link starts in diff view
        When I click element with locator "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='CheckName']" to not be displayed
        When I open the url "/?checkId={{currentCheck._id}}&modalIsOpen=true"
        When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
        When I execute javascript code:
        """
        const objects = mainView.canvas.getObjects();
        return JSON.stringify({
          currentView: mainView.currentView,
          diffIndex: objects.indexOf(mainView.diffImage),
          actualIndex: objects.indexOf(mainView.actualImage),
          diffActive: document.querySelector("[data-segment-value='diff']")?.getAttribute('data-segment-active')
        });
        """
        Then I expect the stored "js" string is equal:
        """
          {"currentView":"diff","diffIndex":0,"actualIndex":-1,"diffActive":"true"}
        """

    Scenario: Simple view switch preserves zoom and pan
        When I click element with locator "[data-segment-value='actual']"
        When I wait up to 30 seconds for javascript condition:
        """
        return mainView.currentView === 'actual'
          && mainView.canvas.getObjects().indexOf(mainView.actualImage) !== -1;
        """
        When I execute javascript code:
        """
        mainView.canvas.zoomToPoint(new fabric.Point(300, 200), 2);
        mainView.canvas.relativePan(new fabric.Point(-180, -120));
        mainView.canvas.renderAll();

        window.panZoomBeforeViewSwitch = mainView.canvas.viewportTransform.slice();
        const vpt = window.panZoomBeforeViewSwitch;
        return (mainView.currentView === 'actual'
          && mainView.canvas.getZoom() === 2
          && vpt[4] !== 0
          && vpt[5] !== 0).toString();
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """

        When I click element with locator "[data-segment-value='expected']"
        When I wait up to 30 seconds for javascript condition:
        """
        return mainView.currentView === 'expected'
          && mainView.canvas.getObjects().indexOf(mainView.expectedImage) !== -1;
        """
        When I execute javascript code:
        """
        const before = window.panZoomBeforeViewSwitch;
        const after = mainView.canvas.viewportTransform.slice();
        const sameTransform = before.length === after.length
          && before.every((value, index) => Math.abs(value - after[index]) < 0.001);

        return (mainView.currentView === 'expected'
          && mainView.canvas.getZoom() === 2
          && sameTransform).toString();
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """
