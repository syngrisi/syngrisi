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
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

    Scenario: Resize Dropdown Usage
#        When I open the url "https://the-internet.herokuapp.com/"

        When I wait for "5" seconds
#        When I click on the element "canvas"
#        When I move to element "canvas"
        When I wait for "1" seconds
#        When I hold key "Control"
        When I scroll by "300"
        When I START DEBUGGER

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
        return mainView.canvas.getZoom().toFixed(2).toString()
        """
        Then I expect the stored "js" string is equal:
        """
          1.55
        """

        # Fit by canvas
        When I click on the element "[data-check='open-zoom-dropdown']"
        When I wait on element "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']" to be displayed
        When I click on the element "//*[@data-check='zoom-dropdown']//div[text()='Fit to canvas ']"
        When I wait for "0.5" seconds
        When I execute javascript code:
        """
        return mainView.canvas.getZoom().toFixed(2).toString()
        """
        Then I expect the stored "js" string is equal:
        """
          1.03
        """

    Scenario: Resize via Ctrl + Mouse Wheel
        When I fail

    Scenario: Pan via Mouse Wheel
        When I fail
