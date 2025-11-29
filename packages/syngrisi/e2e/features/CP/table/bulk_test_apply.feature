@fast-server
Feature: Bulk test Apply

  Background:
#         Given I clear Database and stop Server
#         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Apply 2 tests
    Given I create "2" tests with:
      """
          testName: TestName-$
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """
    When I go to "main" page

    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-0]" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name=TestName-1]" to be visible
    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Unaccepted']" to be visible
    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Unaccepted']" to be visible

    When I click element with locator "[data-test-checkbox-name=TestName-0]"
    When I click element with locator "[data-test-checkbox-name=TestName-1]"

    When I unfold the test "TestName-0"
    When I unfold the test "TestName-1"

    Then the element with locator "(//*[@data-test='check-accept-icon']//*[@stroke])" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])" is "rgba(134,142,150,1)"

    # accept
    When I wait 30 seconds for the element with locator "[aria-label='Accept selected tests']" to be visible
    When I click element with locator "[aria-label='Accept selected tests']"

    When I wait 30 seconds for the element with locator "[aria-label='Accept']" to be visible
    When I click element with locator "[aria-label='Accept']"

    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be visible
    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be visible



    Then the element with locator "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" should have has attribute "data-test-icon-type=fill"
    Then the element with locator "(//*[@data-test='check-accept-icon']//*[@stroke])[2]" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "rgba(64,192,87,1)"

    When I refresh page
    When I unfold the test "TestName-0"
    When I unfold the test "TestName-1"

    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-0']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be visible
    When I wait 30 seconds for the element with locator "//*[@data-row-name='TestName-1']//td[@data-test='table-row-Accepted']//*[text()='Accepted']" to be visible

    Then the element with locator "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" should have has attribute "data-test-icon-type=fill"
    Then the element with locator "(//*[@data-test='check-accept-icon']//*[@stroke])[2]" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "color" from element "(//*[@data-test='check-accept-icon']//*[@stroke])[1]" is "rgba(64,192,87,1)"