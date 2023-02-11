@smoke
Feature: Open/Close Check Details

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Open/Close Check Details via click
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        Then I expect that the title is "By Runs"
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed
        Then I wait on element "[data-check-header-name='CheckName']" to not exist

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed
        Then I expect that the title is "CheckName"

        When I click on the element "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='CheckName']" to not be displayed
        Then I expect that the title is "By Runs"

    Scenario: Open/Close Check Details via url
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
        Then I wait on element "[data-check-header-name='CheckName']" to not exist

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        When I execute javascript code:
        """
        return {url: window.location.href}
        """
        When I click on the element "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='CheckName']" to not be displayed

        When I open the url "<js:url>"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed
