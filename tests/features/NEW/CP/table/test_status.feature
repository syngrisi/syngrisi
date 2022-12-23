Feature: Calculate Test status based on Checks statuses

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Test status [(PASSED, NEW, REMOVE PASSED) = NEW]
        # [new, new]
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
                filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName-1"

        # [passed, new]
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "New"

        # check status ring
        When I execute javascript code:
        """
        const el = document.querySelector("[data-statusring-name='TestName']").firstChild.childNodes
        return el[0].getAttribute('stroke-dasharray')
        + el[1].getAttribute('stroke-dasharray')
        + el[2].getAttribute('stroke-dasharray')
        + el[3].getAttribute('stroke-dasharray')
        """

        Then I expect the stored "js" string is equal:
        """
          0, 60.318578948924040, 60.318578948924040, 60.318578948924040, 60.31857894892404
        """

        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
                filePath: files/A.png
              - checkName: CheckName-2
                filePath: files/A.png
        """

        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "Passed"

        # check status ring
        When I execute javascript code:
        """
        const el = document.querySelector("[data-statusring-name='TestName']").firstChild.childNodes
        return el[0].getAttribute('stroke-dasharray')
        + el[1].getAttribute('stroke-dasharray')
        + el[2].getAttribute('stroke-dasharray')
        + el[3].getAttribute('stroke-dasharray')
        """

        Then I expect the stored "js" string is equal:
        """
          0, 60.3185789489240430.15928947446202, 30.159289474462020, 60.318578948924040, 60.31857894892404
        """

        # remove passed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName-1']" to be displayed

        When I remove the "CheckName-1" check
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "New"

    @smoke
    Scenario: Test status [(PASSED, FAILED, REMOVE FAILED) = PASSED]
        # [new, new]
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
                filePath: files/A.png
              - checkName: CheckName-2
                filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName-1"
        When I accept via http the 1st check with name "CheckName-2"

        # [passed, failed]
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "New"

        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName-1
                filePath: files/A.png
              - checkName: CheckName-2
                filePath: files/B.png
        """

        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "Failed"

        # remove failed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName-2']" to be displayed
        When I remove the "CheckName-2" check
        When I expect that element "[data-row-name='TestName'] td[data-test='table-row-Status']" to contain text "Passed"
