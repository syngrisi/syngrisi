@smoke
Feature: Enabled disabled buttons on Check Details Modal Window

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: New Check
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I go to "main" page
        When I unfold the test "TestName"

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # view segment
        Then I expect that element "//*[@data-check='expected-view']/.." has the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='actual-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='diff-view']/.." has the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='slider-view']/.." has the class "mantine-SegmentedControl-disabled"

        # action icons
        Then  I expect that the attribute "data-disabled" from element "[data-check='highlight-icon']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='remove-ignore-region']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='add-ignore-region']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='save-ignore-region']" is not "true"

    Scenario: Passed Check
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I accept via http the 1st check with name "CheckName"
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """

        When I go to "main" page
        When I unfold the test "TestName"
#        When I wait on element "[data-table-test-name=TestName]" to be displayed
#        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
#        When I click on the element "[data-table-test-name=TestName]"
#        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # view segment
        Then I expect that element "//*[@data-check='expected-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='actual-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='diff-view']/.." has the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='slider-view']/.." has the class "mantine-SegmentedControl-disabled"

        # action icons
        Then  I expect that the attribute "data-disabled" from element "[data-check='highlight-icon']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='remove-ignore-region']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='add-ignore-region']" is not "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='save-ignore-region']" is not "true"

    Scenario: Passed Check with Ignore Regions
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I accept via http the 1st check with name "CheckName"
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """

        When I go to "main" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # without save
        When I click on the element "[data-check='add-ignore-region']"
        Then I expect that the attribute "data-disabled" from element "[data-check='remove-ignore-region']" is not "true"

    Scenario: Failed Check
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/B.png
        """

        When I go to "main" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # view segment
        Then I expect that element "//*[@data-check='expected-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='actual-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='diff-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='slider-view']/.." does not have the class "mantine-SegmentedControl-disabled"

        # action icons
        Then  I expect that the attribute "data-disabled" from element "[data-check='highlight-icon']" is not "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='remove-ignore-region']" is "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='add-ignore-region']" is not "true"
        Then  I expect that the attribute "data-disabled" from element "[data-check='save-ignore-region']" is not "true"

    Scenario: Failed Check difference more than 5%
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/C.png
        """
        When I accept via http the 1st check with name "CheckName"
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
                filePath: files/C_more_5_percent.png
        """

        When I go to "main" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        Then I wait on element "[data-table-check-name='CheckName']" to not be displayed
        When I click on the element "[data-table-test-name=TestName]"
        Then I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test-preview-image='CheckName']"
        Then I wait on element "[data-check-header-name='CheckName']" to be displayed

        # view segment
        Then I expect that element "//*[@data-check='expected-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='actual-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='diff-view']/.." does not have the class "mantine-SegmentedControl-disabled"
        Then I expect that element "//*[@data-check='slider-view']/.." does not have the class "mantine-SegmentedControl-disabled"

        # action icons
        Then I expect that the attribute "data-disabled" from element "[data-check='highlight-icon']" is "true"
        Then I expect that the attribute "data-disabled" from element "[data-check='remove-ignore-region']" is "true"
        Then I expect that the attribute "data-disabled" from element "[data-check='add-ignore-region']" is not "true"
        Then I expect that the attribute "data-disabled" from element "[data-check='save-ignore-region']" is not "true"
