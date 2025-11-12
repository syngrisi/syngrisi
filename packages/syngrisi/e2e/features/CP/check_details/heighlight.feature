@smoke
Feature: Check Details Difference Highlight

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Check Details Difference Highlight
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/B.png
        """

        When I go to "main" page
        When I unfold the test "TestName"

        When I click element with locator "[data-test-preview-image='CheckName']"
        When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

        When I execute javascript code:
        """
        window.slowHighlight=1
        """
        When I click element with locator "[data-check='highlight-icon']"
        When I wait for "3" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().filter(x=>x.name=="highlight").length.toString()
        """
        Then I expect the stored "js" string is equal:
        """
          151
        """

