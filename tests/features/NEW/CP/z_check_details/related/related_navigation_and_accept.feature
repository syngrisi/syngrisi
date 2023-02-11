@smoke
Feature: Check details Related Checks - Navigation and Accept

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Related - Navigation via Related Panel and Accept second Check
        When I set window size: "1440x900"
        Given I create "3" tests with:
        """
          testName: TestName-$
          project: Project1
          branch: integration$
          browserName: safari$
          os: Windows$
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows$
                viewport: 500x500
                browserName: safari$
        """

        When I go to "index2" page
        When I unfold the test "TestName-2"
        When I open the 1st check "CheckName"

        # SECOND
        Then I wait on element "[data-related-check-browser-name='safari1']" to be displayed
        When I click on the element "[data-related-check-browser-name='safari1']"
        Then I expect that element "[data-check='test-name']" to contain text "TestName-1"
        Then I expect that element "[data-check='os']" to contain text "Windows1"
        Then I expect that element "[data-check='browser']" to contain text "safari1"
        # check icons before accept
        Then I expect that the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"
        Then I expect that the attribute "data-test-icon-type" from element ".modal [data-test='check-accept-icon'] svg" is "outline"

        # accept
        When I click on the element ".modal button[data-test='check-accept-icon']"
        When I click on the element "button[data-test='check-accept-icon-confirm']"
        When I wait for "1" seconds

        Then I expect via http 2st check filtered as "name=CheckName" matched:
        """
        markedAs: accepted
        status: [new]
        """

        Then I expect that the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
        Then I expect that the attribute "data-test-icon-type" from element ".modal [data-test='check-accept-icon'] svg" is "fill"

        # check icon color after close modal
        When I click on the element "[data-test='close-check-detail-icon']"
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[1]" to be displayed

        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"
