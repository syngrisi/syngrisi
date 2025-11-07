Feature: Partially Accepted Test

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Partially Accepted Test
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
              - checkName: CheckName-2
        """
        When I go to "main" page

        # BEFORE ACCEPT
        When I unfold the test "TestName"
        When I wait on element "//*[@data-row-name='TestName']//td[@data-test='table-row-Accepted']//*[text()='Unaccepted']" to be displayed

        # AFTER ACCEPT
        When I accept the "CheckName-1" check
        When I wait on element "//*[@data-row-name='TestName']//td[@data-test='table-row-Accepted']//*[text()='Partially']" to be displayed
        When I accept the "CheckName-2" check
        When I wait on element "//*[@data-row-name='TestName']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be displayed

