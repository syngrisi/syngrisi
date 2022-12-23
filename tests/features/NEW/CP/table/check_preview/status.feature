Feature: Check Preview - Status

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Status View - Standard Flow
        # NEW
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        Then the element "[data-check-status-name='CheckName'] span" matches the text "NEW"
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(34,139,230,1)"

        When I accept the "CheckName" check
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(34,139,230,1)"

        # PASSED
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/A.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait for "0.5" seconds
        Then the element "[data-check-status-name='CheckName'] span" matches the text "PASSED"
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(64,192,87,1)"


        # FAILED BY DIFF
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/B.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait for "0.5" seconds
        Then the element "[data-check-status-name='CheckName'] span" matches the text "FAILED"
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"

    @smoke
    Scenario: Status View - Not Accepted
        # NEW
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/A.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait on element "[data-test='check-wrong-images-size-error-icon']" to not be displayed

        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/A.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait for "0.5" seconds
        Then the element "[data-check-status-name='CheckName'] span" matches the text "FAILED"
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"
        When I wait on element "[data-test='check-wrong-images-size-error-icon']" to be displayed
        When I wait on element "[data-viewport-badge-name='CheckName']+div[data-test='check-wrong-images-size-error-icon']" to not exist

    @smoke
    Scenario: Status View - Wrong Size
        # NEW
        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/A.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait on element "[data-viewport-badge-name='CheckName']+div[data-test='check-wrong-images-size-error-icon']" to not exist

        When I accept the "CheckName" check

        Given I create "1" tests with:
        """
          testName: TestName
          checks:
              - filePath: files/A_cropped.png
                checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed
        When I wait for "0.5" seconds
        Then the element "[data-check-status-name='CheckName'] span" matches the text "FAILED"
        Then I expect that the css attribute "background-color" from element "[data-check-status-name='CheckName']" is "rgba(250,82,82,1)"
        When I wait on element "[data-test='check-wrong-images-size-error-icon']" to be displayed
        When I wait on element "[data-viewport-badge-name='CheckName']+div[data-test='check-wrong-images-size-error-icon']" to be displayed
