@smoke
Feature: Check details Related Checks - Navigation

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
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

        When I go to "index2" page
        When I unfold the test "TestName-2"
        When I open the 1st check "CheckName"

        # LAST
        Then I expect that element "[data-check='test-name']" to contain text "TestName-2"
        Then I expect that element "[data-check='os']" to contain text "Windows2"
        Then I expect that element "[data-check='browser']" to contain text "safari2"

        # SECOND
        When I click on the element "[data-related-check-browser-name='safari1']"
        Then I expect that element "[data-check='test-name']" to contain text "TestName-1"
        Then I expect that element "[data-check='os']" to contain text "Windows1"
        Then I expect that element "[data-check='browser']" to contain text "safari1"

        # FIRST
        When I click on the element "[data-related-check-browser-name='safari0']"
        Then I expect that element "[data-check='test-name']" to contain text "TestName-0"
        Then I expect that element "[data-check='os']" to contain text "Windows0"
        Then I expect that element "[data-check='browser']" to contain text "safari0"

        # after close the modal window the initial check should be unfolded but other collapsed
        When I click on the element "[data-test='close-check-detail-icon']"
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[1]" to be displayed
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[2]" to not be displayed
        Then I wait on element "(//*[@data-test-preview-image='CheckName'])[3]" to not be displayed
