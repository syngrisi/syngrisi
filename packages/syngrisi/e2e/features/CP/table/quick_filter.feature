Feature: Quick Filtering

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Quick Filtering
        When I create "2" tests with:
        """
          project: "Project-1"
          testName: "TestName-$"
          checks:
             - checkName: Check - 1
        """

        When I create "1" tests with:
        """
          project: "Project-1"
          testName: "ZestName-1"
          checks:
             - checkName: Check - 1
        """

        When I go to "main" page


        When I wait 30 seconds for the element with locator "[data-test='table-quick-filter']" to be visible

        When I set "TestName-" to the inputfield "[data-test='table-quick-filter']"
        When I wait for "2" seconds
        Then I wait on element "[data-table-test-name='TestName-0']" to be displayed
        Then I wait on element "[data-table-test-name='TestName-1']" to be displayed
        Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

        When I set "TestName-0" to the inputfield "[data-test='table-quick-filter']"
        When I wait for "2" seconds
        Then I wait on element "[data-table-test-name='TestName-0']" to be displayed
        Then I wait on element "[data-table-test-name='TestName-1']" to not be displayed
        Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

        When I set "TestName-1" to the inputfield "[data-test='table-quick-filter']"
        When I wait for "2" seconds
        Then I wait on element "[data-table-test-name='TestName-0']" to not be displayed
        Then I wait on element "[data-table-test-name='TestName-1']" to be displayed
        Then I wait on element "[data-table-test-name='ZestName-1']" to not be displayed

    Scenario: Quick Filtering with Project
        When I create "2" tests with:
        """
          project: "Project-1"
          testName: "TestNameP1-$"
          checks:
             - checkName: Check - 1
        """

        When I create "1" tests with:
        """
          project: "Project-2"
          testName: "TestNameP2-$"
          checks:
             - checkName: Check - 1
        """

        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-test='table-quick-filter']" to be visible

        Then I wait on element "[data-table-test-name='TestNameP1-0']" to be displayed
        Then I wait on element "[data-table-test-name='TestNameP1-1']" to be displayed
        Then I wait on element "[data-table-test-name='TestNameP2-0']" to be displayed

        When I select the option with the text "Project-1" for element "select[data-test='current-project']"

        Then I wait on element "[data-table-test-name='TestNameP1-0']" to be displayed
        Then I wait on element "[data-table-test-name='TestNameP1-1']" to be displayed
        Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed

        When I set "TestNameP1-0" to the inputfield "[data-test='table-quick-filter']"
        Then I wait on element "[data-table-test-name='TestNameP1-0']" to be displayed
        Then I wait on element "[data-table-test-name='TestNameP1-1']" to not be displayed
        Then I wait on element "[data-table-test-name='TestNameP2-0']" to not be displayed
