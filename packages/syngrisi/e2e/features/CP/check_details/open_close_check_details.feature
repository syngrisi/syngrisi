@smoke @fast-server
Feature: Open/Close Check Details

    Background:
#         Given I clear Database and stop Server
#         Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Open/Close Check Details via click
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/A.png
        """
        When I go to "main" page
        Then the title is "By Runs"
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click element with locator "[data-table-test-name=TestName]"
        When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName']" to be visible
        Then I wait on element "[data-check-header-name='CheckName']" to not exist

        When I click element with locator "[data-test-preview-image='CheckName']"
        When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
        Then the title is "CheckName"

        When I click element with locator "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='CheckName']" to not be displayed
        Then the title is "By Runs"

    Scenario: Open/Close Check Details via url
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/A.png
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click element with locator "[data-table-test-name=TestName]"
        When I wait 30 seconds for the element with locator "[data-table-check-name='CheckName']" to be visible
        Then I wait on element "[data-check-header-name='CheckName']" to not exist

        When I click element with locator "[data-test-preview-image='CheckName']"
        When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

        When I execute javascript code:
        """
        return {url: window.location.href}
        """
        When I click element with locator "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='CheckName']" to not be displayed

        When I open the url "<js:url>"
        When I wait 30 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

