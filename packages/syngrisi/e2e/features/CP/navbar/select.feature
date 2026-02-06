@fast-server @flaky
Feature: Select Navbar Item

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Select 1 and 2 items (hold the Meta key)
    When I create "3" tests with:
      """
      project: "Project"
      testName: "TestName-Select-1-$"
      runName: "RunName-Select-1-$"
      runIdent: "RunIdent-Select-1-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-test*='navbar_item_']" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-0')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-1')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-2')]" to be visible

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-0]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-1]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-2]" to be visible

    # Select 1
    When I hold key "Meta"
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-1')]"
    # 0,0,0,0 kind of default value
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-2')]/../../../../../../.." is "rgba(0,0,0,0)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-1')]/../../../../../../.." is "rgba(235,251,238,1)"
    When I wait on element "[data-table-test-name=TestName-Select-1-0]" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-1]" to be visible
    When I wait on element "[data-table-test-name=TestName-Select-1-2]" to not be displayed

    # Select 1 and 2
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-2')]"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-1')]/../../../../../../.." is "rgba(235,251,238,1)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-2')]/../../../../../../.." is "rgba(235,251,238,1)"
    When I wait on element "[data-table-test-name=TestName-Select-1-0]" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-1]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-2]" to be visible

    When I release key "Meta"

    # Select 0 and deselect 1-2 via click on 0
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-0')]"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-0')]/../../../../../../.." is "rgba(235,251,238,1)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-1')]/../../../../../../.." is "rgba(0,0,0,0)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-1-2')]/../../../../../../.." is "rgba(0,0,0,0)"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-1-0]" to be visible
    When I wait on element "[data-table-test-name=TestName-Select-1-1]" to not be displayed
    When I wait on element "[data-table-test-name=TestName-Select-1-2]" to not be displayed

  @smoke
  Scenario: Select 1 item deselect via group by
    When I create "2" tests with:
      """
      project: "Project"
      testName: "TestName-Select-2-$"
      runName: "RunName-Select-2-$"
      runIdent: "RunIdent-Select-2-$"
      suiteName: "SuiteName-Select-2-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-test*='navbar_item_']" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-0')]" to be visible

    # select one
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-0')]"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-2-0]" to be visible
    When I wait on element "[data-table-test-name=TestName-Select-2-1]" to not be displayed

    # 0,0,0,0 kind of default value
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-0')]/../../../../../../.." is "rgba(235,251,238,1)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-1')]/../../../../../../.." is "rgba(0,0,0,0)"

    # group by Suites
    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
    When I move to element "body" with an offset of 0,0

    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-Select-2-0')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-Select-2-1')]" to be visible

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-2-0]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-2-1]" to be visible
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-Select-2-0')]/../../../../../../.." is "rgba(0,0,0,0)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-Select-2-1')]/../../../../../../.." is "rgba(0,0,0,0)"

    # group by Runs (chek if selection did not 'stuck' on Runs grouping)
    When I select the option with the text "Runs" for element "select[data-test='navbar-group-by']"

    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-0')]" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-1')]" to be visible

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-2-0]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-2-1]" to be visible
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-0')]/../../../../../../.." is "rgba(0,0,0,0)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-2-1')]/../../../../../../.." is "rgba(0,0,0,0)"


  Scenario: Select one item via Url
    Select multiple items via Url
    When I create "2" tests with:
      """
      project: "Project"
      testName: "TestName-Select-3-$"
      runName: "RunName-Select-3-$"
      runIdent: "RunIdent-Select-3-$"
      suiteName: "SuiteName-Select-3-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-test*='navbar_item_']" to be visible
    When I wait for test "TestName-Select-3-0" to appear in table
    When I wait for test "TestName-Select-3-1" to appear in table

    # select one
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-3-0')]"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-3-0]" to be visible
    When I wait on element "[data-table-test-name=TestName-Select-3-1]" to not be displayed

    When I execute javascript code:
      """
    return {url: window.location.href}
      """

    When I go to "main" page
    When I open the url "<js:url>"

    When I wait for test "TestName-Select-3-0" to appear in table
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-3-0]" to be visible
    When I wait on element "[data-table-test-name=TestName-Select-3-1]" to not be displayed
    # 0,0,0,0 kind of default value
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-3-0')]/../../../../../../.." is "rgba(235,251,238,1)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-3-1')]/../../../../../../.." is "rgba(0,0,0,0)"

  Scenario: Select two items via Url
    Select multiple items via Url
    When I create "2" tests with:
      """
      project: "Project"
      testName: "TestName-Select-4-$"
      runName: "RunName-Select-4-$"
      runIdent: "RunIdent-Select-4-$"
      suiteName: "SuiteName-Select-4-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
      """

    When I go to "main" page
    # Use reliable wait for test data to appear
    When I wait for test "TestName-Select-4-1" to appear in table

    When I hold key "Meta"
    # select one
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-4-0')]"
    When I click element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-4-1')]"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-4-0]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-4-1]" to be visible

    When I execute javascript code:
      """
    return {url: window.location.href}
      """

    When I go to "main" page
    When I open the url "<js:url>"

    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-4-0]" to be visible
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Select-4-1]" to be visible
    # 0,0,0,0 kind of default value
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-4-0')]/../../../../../../.." is "rgba(235,251,238,1)"
    Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-Select-4-1')]/../../../../../../.." is "rgba(235,251,238,1)"
