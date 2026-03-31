@fast-server
Feature: Check Details screenshot size follows selected view

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Image size badge switches between expected and actual dimensions
        Given I create "1" tests with:
        """
          testName: SizeSwitchTest
          checks:
              - checkName: SizeCheck
                filePath: files/small.png
        """
        When I accept via http the 1st check with name "SizeCheck"
        Given I create "1" tests with:
        """
          testName: SizeSwitchTest
          checks:
              - checkName: SizeCheck
                filePath: files/normal.png
        """
        When I go to "main" page
        When I unfold the test "SizeSwitchTest"
        When I click element with locator "[data-test-preview-image='SizeCheck']"
        When I wait 30 seconds for the element with locator "[data-check-header-name='SizeCheck']" to be visible

        When I click element with locator "[data-segment-value='actual']"
        When I pause for 300 ms
        Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"
        Then the element with locator "[data-check='image-size']" should have text "500x500"

        When I click element with locator "[data-segment-value='expected']"
        When I pause for 300 ms
        Then the element with locator "[data-segment-value='expected']" should have attribute "data-segment-active" "true"
        Then the element with locator "[data-check='image-size']" should have text "160x48"

        When I click element with locator "[data-segment-value='actual']"
        When I pause for 300 ms
        Then the element with locator "[data-segment-value='actual']" should have attribute "data-segment-active" "true"
        Then the element with locator "[data-check='image-size']" should have text "500x500"
