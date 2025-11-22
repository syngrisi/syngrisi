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
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

    Scenario: Simple Views (Expected, Actual, Diff)
        When I wait on element "div=Expected" to be displayed

        # expected
        When I click on the element "div=Expected"
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
        When I click on the element "div=Actual"
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
        When I click on the element "div=Difference"
        When I wait for "1" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().indexOf(mainView.diffImage)
        """
        Then I expect the stored "js" string is equal:
        """
          0
        """
