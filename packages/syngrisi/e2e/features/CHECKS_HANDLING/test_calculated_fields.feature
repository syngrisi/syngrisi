@fast-server
Feature: Test calculated fields
    during the session end - calculated common fields based in checks in test: [viewport, status]

    Background:
        #     Given I clear Database and stop Server
        #     Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Same viewports - [50x50, 50x50]
        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-2
          filePath: files/A.png
          viewport: "50x50"
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName']" to be visible
        When the element with locator "[data-row-name='TestName'] [data-test='table-row-Viewport']" should have contains text "50x50"

    Scenario: Different viewports - [50x50, 100x100]
        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-2
          filePath: files/A.png
          viewport: "100x100"
        """
        When I go to "main" page
        When the element with locator "[data-row-name='TestName'] [data-test='table-row-Viewport']" should have contains text "≠"

    Scenario: Same viewports - [new, new]
        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
          viewport: "50x50"
        - checkName: CheckName-2
          filePath: files/A.png
          viewport: "50x50"
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName']" to be visible
        When the element with locator "[data-row-name='TestName'] [data-test='table-row-Status']" should have contains text "New"

    Scenario: Same viewports - [new, passed]
        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName-1"

        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
        - checkName: CheckName-2
          filePath: files/A.png
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName']" to be visible
        When the element with locator "[data-row-name='TestName'] [data-test='table-row-Status']" should have contains text "Passed"

    Scenario: Same viewports - [passed, failed]
        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
        - checkName: CheckName-2
          filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName-1"
        When I accept via http the 1st check with name "CheckName-2"

        Given I create "1" tests with:
        """
        testName: TestName
        checks:
        - checkName: CheckName-1
          filePath: files/A.png
        - checkName: CheckName-2
          filePath: files/B.png
        """
        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name='TestName']" to be visible
        When the element with locator "[data-row-name='TestName'] [data-test='table-row-Status']" should have contains text "Failed"
