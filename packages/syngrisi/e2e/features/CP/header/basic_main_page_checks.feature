@smoke @fast-server
Feature: Basic main page checks

    Background:
        When I open the app
        When I clear local storage

    Scenario: Main page shows created test and collapsed checks
        Given I create "1" tests with:
            """
          testName: "Sanity Test A"
          checks:
            - checkName: Sanity Check A-1
              filePath: files/A.png
            """
        When I go to "main" page

        Then the title is "By Runs"
        Then the element with locator "[data-table-test-name='Sanity Test A']" should be visible
        Then I wait on element "[data-table-check-name='Sanity Check A-1']" to not be displayed

    Scenario: Expanding row shows check preview
        Given I create "1" tests with:
            """
          testName: "Sanity Test B"
          checks:
            - checkName: Sanity Check B-1
              filePath: files/A.png
            """
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Sanity Test B']" to be visible
        When I click element with locator "[data-table-test-name='Sanity Test B']"

        Then the element with locator "[data-table-check-name='Sanity Check B-1']" should be visible
        Then the element with locator "[data-test-preview-image='Sanity Check B-1']" should be visible
        Then the element with locator "[data-check-header-name='Sanity Check B-1']" should not be visible

    Scenario: Open and close check details keeps navigation state
        Given I create "1" tests with:
            """
          testName: "Sanity Test C"
          checks:
            - checkName: Sanity Check C-1
              filePath: files/A.png
            """
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='Sanity Test C']" to be visible
        When I click element with locator "[data-table-test-name='Sanity Test C']"
        When I click element with locator "[data-test-preview-image='Sanity Check C-1']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='Sanity Check C-1']" to be visible

        Then the title is "Sanity Check C-1"
        Then the element with locator "[data-test='close-check-detail-icon']" should be visible

        When I click element with locator "[data-test='close-check-detail-icon']"
        Then I wait on element "[data-check-header-name='Sanity Check C-1']" to not be displayed
        Then the title is "By Runs"
