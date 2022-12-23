Feature: Check Preview - Accept Icons View

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Accept Icons View
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

        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"

        # accepted in the same check
        When I accept the "CheckName" check

        When I wait for "0.5" seconds
        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "fill"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"

        # accepted in the previous check
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

        Then I expect that the attribute "data-test-icon-type" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "outline"
        Then I expect that the css attribute "color" from element "[data-test='check-accept-icon'][data-accept-icon-name='CheckName'] svg" is "rgba(64,192,87,1)"
