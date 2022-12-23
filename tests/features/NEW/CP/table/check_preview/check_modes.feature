Feature: Checks Preview Modes

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Checks Preview Modes
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test='table-sorting']"
        When I wait for "3" seconds
        Then the css attribute "max-height" from element "[data-test-preview-image='CheckName'] img" is "153.6px"

        When I click on the element "//*[@data-test='preview-mode-segment-control']//label[text()='normal']"
        When I wait for "1" seconds
        Then the css attribute "max-height" from element "[data-test-preview-image='CheckName'] img" is "none"

        When I click on the element "//*[@data-test='preview-mode-segment-control']//label[text()='list']"
        When I wait for "1" seconds
        Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "76.7969px"

    Scenario: Checks Preview Sizes on Bounded mode
        Given I create "1" tests with:
        """
          testName: "TestName"
          checks:
              - checkName: CheckName
        """
        When I go to "index2" page
        When I wait on element "[data-table-test-name=TestName]" to be displayed
        When I click on the element "[data-table-test-name=TestName]"
        When I wait on element "[data-table-check-name='CheckName']" to be displayed

        When I click on the element "[data-test='table-sorting']"
        When I wait for "1" seconds
        Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "113.75px"

        When I click on the element "//*[@data-test='preview-size-segment-control']//label[text()='small']"
        When I wait for "0.5" seconds
        Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "69.5938px"

        When I click on the element "//*[@data-test='preview-size-segment-control']//label[text()='large']"
        When I wait for "0.5" seconds
        Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "202.07px"

        When I click on the element "//*[@data-test='preview-size-segment-control']//label[text()='xlarge']"
        When I wait for "0.5" seconds
        Then the css attribute "width" from element "[data-test-preview-image='CheckName'] img" is "290.391px"
