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

        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I execute javascript code:
        """
        window.slowHighlight=1
        """
        When I click on the element "[data-check='highlight-icon']"
        When I wait for "3" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getObjects().filter(x=>x.name=="highlight").length.toString()
        """
        Then I expect the stored "js" string is equal:
        """
          151
        """
