Feature: Select Navbar Item

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Select 1 and 2 items (hold the Meta key)
        When I create "3" tests with:
        """
          project: "Project"
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I go to "index2" page
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]" to be displayed

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        When I wait on element "[data-table-test-name=TestName-2]" to be displayed

        # Select 1
        When I hold key "Meta"
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]"
        # 0,0,0,0 kind of default value
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]/../../../../../.." is "rgba(0,0,0,0)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(235,251,238,1)"
        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        When I wait on element "[data-table-test-name=TestName-2]" to not be displayed

        # Select 1 and 2
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(235,251,238,1)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]/../../../../../.." is "rgba(235,251,238,1)"
        When I wait on element "[data-table-test-name=TestName-0]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        When I wait on element "[data-table-test-name=TestName-2]" to be displayed

        When I release key "Meta"

        # Select 0 and deselect 1-2 via click on 0
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]/../../../../../.." is "rgba(235,251,238,1)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(0,0,0,0)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]/../../../../../.." is "rgba(0,0,0,0)"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed
        When I wait on element "[data-table-test-name=TestName-2]" to not be displayed

    @smoke
    Scenario: Select 1 item deselect via group by
        When I create "2" tests with:
        """
          project: "Project"
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          suiteName: "SuiteName-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I go to "index2" page
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed

        # select one
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed

        # 0,0,0,0 kind of default value
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]/../../../../../.." is "rgba(235,251,238,1)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(0,0,0,0)"

        # group by Suites
        When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"
        When I move to element "body" with an offset of 0,0

        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-0')]" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-1')]" to be displayed

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-0')]/../../../../../.." is "rgba(0,0,0,0)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'SuiteName-1')]/../../../../../.." is "rgba(0,0,0,0)"

        # group by Runs (chek if selection did not 'stuck' on Runs grouping)
        When I select the option with the text "Runs" for element "select[data-test='navbar-group-by']"

        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be displayed

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]/../../../../../.." is "rgba(0,0,0,0)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(0,0,0,0)"


    Scenario: Select one item via Url
    Select multiple items via Url
        When I create "2" tests with:
        """
          project: "Project"
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          suiteName: "SuiteName-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I go to "index2" page
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed

        # select one
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed

        When I execute javascript code:
        """
        return {url: window.location.href}
        """

        When I go to "index2" page
        When I open the url "<js:url>"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to not be displayed
        # 0,0,0,0 kind of default value
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]/../../../../../.." is "rgba(235,251,238,1)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(0,0,0,0)"

    Scenario: Select two items via Url
    Select multiple items via Url
        When I create "2" tests with:
        """
          project: "Project"
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          suiteName: "SuiteName-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I go to "index2" page
        Then I wait on element "[data-test*='navbar_item_']" to be displayed
        Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]" to be displayed

        When I hold key "Meta"
        # select one
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]"
        When I click on the element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed

        When I execute javascript code:
        """
        return {url: window.location.href}
        """

        When I go to "index2" page
        When I open the url "<js:url>"

        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        # 0,0,0,0 kind of default value
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-0')]/../../../../../.." is "rgba(235,251,238,1)"
        Then the css attribute "background-color" from element "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]/../../../../../.." is "rgba(235,251,238,1)"
