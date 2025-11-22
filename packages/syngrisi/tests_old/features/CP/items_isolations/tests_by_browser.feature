Feature: Test Isolation by Browser

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Browser
    Given I create "2" tests with:
    """
      testName: TestBrowser-$
      browserName: chrome-$
      checks:
          - checkName: Check-1
    """

    When I refresh page
    # all tests
    When I wait on element "//div[contains(text(), 'TestBrowser')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestBrowser')]" does appear exactly "2" times

    When I select the option with the text "Browsers" for element "select[data-test='navbar-group-by']"

    # chrome-0
    When I wait on element "li*=chrome-0" to be displayed
    When I click on the element "li*=chrome-0"
    When I wait on element "//div[contains(text(), 'TestBrowser-0')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestBrowser-1')]" to not be displayed

    # chrome-1
    When I wait on element "li*=chrome-1" to be displayed
    When I click on the element "li*=chrome-1"
    When I wait on element "//div[contains(text(), 'TestBrowser-1')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestBrowser-0')]" to not be displayed
