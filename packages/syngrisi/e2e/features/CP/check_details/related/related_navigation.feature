@smoke @fast-server
Feature: Check details Related Checks - Navigation

    Background:
#         Given I clear Database and stop Server
#         Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Related - Navigation via Related Panel
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

        When I go to "main" page
        When I unfold the test "TestName-2"
        When I open the 1st check "CheckName"

        # LAST
        Then the element with locator "[data-check='test-name']" should have contains text "TestName-2"
        Then the element with locator "[data-check='os']" should have contains text "Windows2"
        Then the element with locator "[data-check='browser']" should have contains text "safari2"

        # SECOND
        When I click element with locator "[data-related-check-browser-name='safari1']"
        Then the element with locator "[data-check='test-name']" should have contains text "TestName-1"
        Then the element with locator "[data-check='os']" should have contains text "Windows1"
        Then the element with locator "[data-check='browser']" should have contains text "safari1"

        # FIRST
        When I click element with locator "[data-related-check-browser-name='safari0']"
        Then the element with locator "[data-check='test-name']" should have contains text "TestName-0"
        Then the element with locator "[data-check='os']" should have contains text "Windows0"
        Then the element with locator "[data-check='browser']" should have contains text "safari0"

        # after close the modal window the initial check should be unfolded but other collapsed
        When I click element with locator "[data-test='close-check-detail-icon']"
        When I wait 30 seconds for the element with locator "(//*[@data-test-preview-image='CheckName'])[1]" to be visible
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[2]" to not be displayed
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[3]" to not be displayed

