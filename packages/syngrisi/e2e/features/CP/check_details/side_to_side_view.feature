@smoke
Feature: Side to side view

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
            - {checkName: CheckName, filePath: files/B.png}
            """
        When I go to "main" page
        When I unfold the test "TestName"
        When I click element with locator "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

    Scenario: Divider in the center
        When I wait on element "//div[normalize-space(text())='Slider']" to be displayed
        When I wait for "0.5" seconds

        When I click element with locator "//div[normalize-space(text())='Slider']"
        When I wait for "0.5" seconds

        When I execute javascript code:
            """
            return mainView.sliderView.divider.left
            """
        Then I expect the stored "js" string is equal:
            """
            372
            """
        Then I wait on element "#label_expected" to be displayed
        Then I wait on element "#label_actual" to be displayed

        When I click element with locator "#snapshoot"

        Then I wait on element "#label_expected" to not be displayed
        Then I wait on element "#label_actual" to not be displayed


