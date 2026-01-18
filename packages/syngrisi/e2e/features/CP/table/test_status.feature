@smoke @fast-server
Feature: Calculate Test status based on Checks statuses

  Background:
    # Server is managed by @fast-server hook automatically
    When I open the app
    When I clear local storage

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
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

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

    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Passed"

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
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-1']" to be visible

    When I remove the "CheckName-1" check
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

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
    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "New"

    Given I create "1" tests with:
      """
        testName: TestName
        checks:
            - checkName: CheckName-1
              filePath: files/A.png
            - checkName: CheckName-2
              filePath: files/B.png
      """

    When I go to "main" page
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Failed"

    # remove failed
    When I click element with locator "[data-table-test-name=TestName]"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName-2']" to be visible
    When I remove the "CheckName-2" check
    When the element with locator "[data-row-name='TestName'] td[data-test='table-row-Status']" should have contains text "Passed"
