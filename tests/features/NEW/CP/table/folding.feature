@smoke
Feature: Folding

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Select, fold/unfold icon - appear
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I go to "index2" page
        When I wait for "5" seconds
        Then I expect that element "[data-test='folding-table-items]" is not displayed

        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        When I click on the element "//*[@data-test='table-row-Name' and contains(.,'TestName')]/..//input"
        When I wait for "5" seconds
        When I wait on element "[data-test='folding-table-items']" to not be displayed

    Scenario: Fold/Unfold item by click
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

    Scenario: Fold/Unfold single item by select
        Given I create "2" tests with:
        """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
        """
        Given I go to "index2" page
        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

        When I click on the element "[data-test-checkbox-name=TestName-0]"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        # unfold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

        # fold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    Scenario: Fold/Unfold multiple items by select
        Given I create "2" tests with:
        """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
        """
        Given I go to "index2" page
        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed


        When I click on the element "[data-test-checkbox-name=TestName-0]"
        When I click on the element "[data-test-checkbox-name=TestName-1]"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        # unfold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to be displayed

        # fold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

    Scenario: Fold/Unfold all items by select
        Given I create "2" tests with:
        """
          testName: "TestName-$"
          checks:
            - checkName: Check-$
        """
        Given I go to "index2" page
        When I wait on element "[data-table-test-name=TestName-0]" to be displayed
        When I wait on element "[data-table-test-name=TestName-1]" to be displayed
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed

        When I click on the element "[data-test='table-select-all']"
        When I wait on element "[data-test='folding-table-items']" to be displayed

        # unfold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to be displayed

        # fold
        When I click on the element "[data-test='folding-table-items']"
        Then I wait on element "[data-table-check-name='Check-0']" to not be displayed
        Then I wait on element "[data-table-check-name='Check-1']" to not be displayed
