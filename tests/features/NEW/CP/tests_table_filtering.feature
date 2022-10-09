Feature: Tests Table Filter

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Main Group, Single Rule
        When I create "2" tests with:
        """
          project: "Project-1"
          testName: "TestName filter-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed

        # filter contains
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed

    @smoke
    Scenario: Main Group, Single Rule with project Filter
        When I create "2" tests with:
        """
          project: "Project-1"
          testName: "TestName filter-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I create "1" tests with:
        """
          project: "Project-2"
          testName: "TestName filter-P2"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-P2')]" to be displayed

        # select project
        When I wait for "3" seconds
        # this is workaround: it's impossible for now to select 'Project-2' straightaway at this moment
        When I select the option with the text "Project-1" for element "select[data-test='current-project']"

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-P2')]" to not be displayed

        # filter contains
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-P2')]" to not be displayed

    Scenario: Filter after select navbar item
        When I create "2" tests with:
        """
          project: "Project-1"
          testName: "TestName filter-$"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName filter-RunName-2"
          runName: "RunName-2"
          runIdent: "RunIdent-2"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-RunName-2')]" to be displayed

        When I click on the element "//*[@data-test='navbar-item-name' and contains(.,'RunName-1')]"
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-RunName-2')]" to not be displayed

        # filter contains
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "filter-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-0')]" to not be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName filter-RunName-2')]" to not be displayed

    Scenario: Main Group, Multiple Rules - And
        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-1"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-1"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
        """

        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-2"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
        """
        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" to be displayed
        When I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" does appear exactly "2" times
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-2')]" to be displayed

        # filter eq test name
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I select the option with the text "Name" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "TestName-1" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" to be displayed
        When I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" does appear exactly "2" times
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-2')]" to not be displayed

        # filter eq browser name
        When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
        When I set "firefox" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait for "1" seconds

        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Browser' and contains(.,'firefox')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Browser' and contains(.,'chrome')]" to not be displayed
        When I expect that element "//*[@data-test='table-row-Name' and contains(.,'TestName-1')]" does appear exactly "1" times
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-2')]" to not be displayed

    Scenario: Main Group, Multiple Rules - Or
        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-chrome"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-firefox"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: firefox
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
        """

        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "TestName-msedge"
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          browserName: msedge
          checks:
            - filePath: files/A.png
              checkName: Check - 1
              browserName: firefox
        """

        When I go to "index2" page

        When I wait for "1" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-chrome')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-firefox')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-msedge')]" to be displayed

        # filter eq test name
        When I click on the element "[data-test='table-filtering']"
        When I wait on element "//*[@data-test='filter-main-group']" to be displayed
        When I click on the element "//*[@data-test='filter-main-group']//*[@data-test='filter-group-operator-or']/.."

        # filter browser name equals chrome
        When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
        When I set "firefox" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        # filter browser name equals firefox
        When I select the option with the text "Browser" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"
        When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
        When I set "chrome" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//input[@data-test='table-filter-value']"
        When I click on the element "[data-test='table-filter-apply']"

        When I wait for "3" seconds
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-firefox')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-chrome')]" to be displayed
        When I wait on element "//*[@data-test='table-row-Name' and contains(.,'TestName-msedge')]" to not be displayed
