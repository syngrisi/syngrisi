@smoke
Feature: Navbar Quick Filtering

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Quick Filtering
        When I create "2" tests with:
        """
          testName: "TestName - $"
          runName: "RunName - $"
          suiteName: "SuiteName - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be visible
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

        When I click element with locator "[data-test='navbar-icon-open-filter']"
        When I wait 30 seconds for the element with locator "[data-test='navbar-quick-filter']" to be visible

        When I set "RunName - " to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be visible
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "2" times


        When I set "RunName - 0" to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "5" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be visible
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to not be displayed
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "1" times

        When I set "RunName - " to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName - 1')]" to be visible
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "2" times

    Scenario: Quick Filtering with project
        When I create "2" tests with:
        """
          project: Project-1
          testName: TestName-$
          runName: RunName_P1-$
          checks:
             - checkName: Check
        """

        When I create "1" tests with:
        """
          project: Project-2
          testName: TestName-$
          runName: RunName_P2-$
          checks:
             - checkName: Check
        """

        When I go to "main" page
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-1')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P2-0')]" to be visible

        # select the project
        When I select the option with the text "Project-1" for element "select[data-test='current-project']"
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-1')]" to be visible
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName_P2-0')]" to not be displayed

        When I click element with locator "[data-test='navbar-icon-open-filter']"
        When I wait 30 seconds for the element with locator "[data-test='navbar-quick-filter']" to be visible

        # quick filter
        When I set "RunName_" to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-1')]" to be visible
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "2" times


        When I set "RunName_P1-0" to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "5" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be visible
        When I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-1')]" to not be displayed
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "1" times

        When I set "RunName_" to the inputfield "[data-test='navbar-quick-filter']"
        When I wait for "3" seconds
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-0')]" to be visible
        When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName_P1-1')]" to be visible
        Then the element "//*[@data-test='navbar-item-name']" does appear exactly "2" times
