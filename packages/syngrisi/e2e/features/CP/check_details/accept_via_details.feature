@smoke
Feature: Check details Related Checks - Navigation and Accept

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Related - Navigation via Related Panel and Accept second Check
        When I set window size: "1440x900"
        Given I create "1" tests with:
        """
          testName: TestName
          project: Project1
          branch: integration
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
        """

        When I go to "main" page
        When I unfold the test "TestName"
        When I open the 1st check "CheckName"


        Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"
        Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"

        # accept
        When I click element with locator ".modal button[data-test='check-accept-icon']"
        When I click element with locator "button[data-test='check-accept-icon-confirm']"

        Then I expect via http 1st check filtered as "name=CheckName" matched:
        """
        markedAs: accepted
        status: [new]
        """

        Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
        Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"

        # check icon color after close modal
        When I click element with locator "[data-test='close-check-detail-icon']"
        When I wait 30 seconds for the element with locator "(//*[@data-test-preview-image='CheckName'])[1]" to be visible

        Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=fill"
        Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

