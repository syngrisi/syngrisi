Feature: Checks Preview images visibilities

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Checks Preview images visibilities
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

        When I execute javascript code:
        """
        return {url: document.querySelector("[alt='CheckName']").src}
        """

        When I open the url "<js:url>"
        When I wait on element "img" to be displayed
