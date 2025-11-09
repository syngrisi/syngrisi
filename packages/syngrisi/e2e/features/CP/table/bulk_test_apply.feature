Feature: Bulk test Apply

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Apply 2 tests
        Given I create "2" tests with:
        """
          testName: TestName-$
          checks:
              - checkName: CheckName
        """
        When I go to "main" page

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        When I wait on element "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Unaccepted']" to be displayed
        When I wait on element "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Unaccepted']" to be displayed

        When I click on the element "[data-test-checkbox-name=TestName-0]"
        When I click on the element "[data-test-checkbox-name=TestName-1]"

        When I unfold the test "TestName-0"
        When I unfold the test "TestName-1"

        Then I expect that the attribute "data-test-icon-type" from element "(//*[@data-test='check-accept-icon']//*[@stroke])" is "outline"
        Then I expect that the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])" is "rgba(134,142,150,1)"

        # accept
        When I wait on element "[data-test='table-accept-tests']" to be displayed
        When I click on the element "[data-test='table-accept-tests']"

        When I wait on element "[data-test='accept-test-confirm-button']" to be displayed
        When I click on the element "[data-test='accept-test-confirm-button']"

        When I wait on element "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be displayed
        When I wait on element "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be displayed

        When I wait for "2" seconds
        
        Then I expect that the attribute "data-test-icon-type" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "fill"
        Then I expect that the attribute "data-test-icon-type" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[2]" is "fill"
        Then I expect that the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "rgba(64,192,87,1)"

        When I refresh page
        When I unfold the test "TestName-0"
        When I unfold the test "TestName-1"

        When I wait on element "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be displayed
        When I wait on element "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be displayed

        Then I expect that the attribute "data-test-icon-type" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "fill"
        Then I expect that the attribute "data-test-icon-type" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[2]" is "fill"
        Then I expect that the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "rgba(64,192,87,1)"
