@smoke @fast-server
Feature: Test Auto Update

    Background:
        Given I start Server and start Driver
        When I clear database
        When I open the app
        When I clear local storage

    Scenario: Update Table with new Tests
    After the user opens the table, the Application store items timestamp on the open the table moment,
    and then shows the user only items that are older than this timestamp and when the new items continue to arrive,
    the user should see new items counter indicator on the top right corner of the 'Refresh' icon (which will be
    updated every X seconds) and after clicking on the icon, the table will be refreshed with new items.

        When I create "1" tests with:
        """
          testName: "AutoUpdate-Before"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name=AutoUpdate-Before]" to be visible

        When I wait for "3" seconds
        When I refresh page
        When I create "3" tests with:
        """
          testName: "AutoUpdate-After"
          checks:
            - filePath: files/A.png
              checkName: CheckName
        """
        When I wait for "5" seconds

        When I wait for "1" seconds
        When I wait up to 60 seconds for element "[data-test='table-refresh-icon-badge']" to contain text "3"
        When I wait 30 seconds for the element with locator "[data-table-test-name=AutoUpdate-Before]" to be visible

        When I click element with locator "[aria-label='Refresh']"
        When I wait for "1" seconds
        When I wait for "10" seconds
        When I wait 30 seconds for the element with locator "[data-table-test-name=AutoUpdate-After]" to be visible
        Then the element "[data-table-test-name=AutoUpdate-After]" does appear exactly "3" times
