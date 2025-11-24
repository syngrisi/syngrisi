@fast-server
Feature: Distinct filters functionality

  Background:
#     Given I clear Database and stop Server
#     Given I start Server and start Driver
    When I open the app
    When I clear local storage
    When I set window size: "1440x900"

  Scenario: Distinct
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-0"
          browserName: safari-0
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-0
      """
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-1"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
      """

    When I go to "main" page

    # not accepted failed
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName filter-3"
          browserName: safari-1
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: safari-1
      """
    When I go to "main" page


    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    # BROWSER
    # open filter
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # set filter
    When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "safari-1"

    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" matches the text "safari-1"
    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" matches the text "safari-0"

    # apply filter
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible

    # close drawer
    When I click element with locator "[aria-label='Close']"
    When I wait on element "//*[@data-test='filter-main-group']" to not be displayed


    # STATUS
    # open filter
    When I click element with locator "[aria-label='Filter the Table Data']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # set filter new
    When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "New"

    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[1]" matches the text "New"
    Then the element "(//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']//option)[2]" matches the text "Failed"

    When I click element with locator "[aria-label='Apply filter']"

    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-0']" to be visible
    When I wait on element "[data-table-test-name='TestName filter-3']" to not be displayed

    # set filter failed
    When I select the option with the text "Status" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"

    When I select dropdown option "Failed" by clicking div for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"
    Then the element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']" should have value "Failed"
    When I click element with locator "[aria-label='Apply filter']"

    When I wait on element "[data-table-test-name='TestName filter-1']" to not be displayed
    When I wait on element "[data-table-test-name='TestName filter-0']" to not be displayed
    When I wait 30 seconds for the element with locator "[data-table-test-name='TestName filter-3']" to be visible