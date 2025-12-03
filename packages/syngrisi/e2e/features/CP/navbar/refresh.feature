@smoke @fast-server
Feature: Navbar Refresh

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Navbar Refresh
    When I create "1" tests with:
      """
          runName: RunName-1
          testName: TestName-1
          checks:
             - checkName: Check-1
               filePath: files/A.png
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-test*='navbar_item_']" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be visible

    When I create "1" tests with:
      """
          runName: RunName-2
          testName: TestName-2
          checks:
             - checkName: Check-1
               filePath: files/A.png
      """

    Then I wait on element "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]" to not be displayed

    When I click element with locator "[data-test='navbar-icon-refresh']"
    When I wait 10 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-2')]" to be visible

