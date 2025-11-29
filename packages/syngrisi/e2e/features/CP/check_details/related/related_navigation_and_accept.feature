@smoke @fast-server
Feature: Check details Related Checks - Navigation and Accept

  Background:
    #         Given I clear Database and stop Server
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Related - Navigation via Related Panel and Accept second Check
    When I set window size: "1440x900"
    Given I create "3" tests with:
      """
          testName: TestName-$
          project: Project1
          branch: integration$
          browserName: safari$
          os: Windows$
          viewport: 500x500
          checks:
            - checkName: CheckName
              filePath: files/A.png
      """

    When I go to "main" page
    When I unfold the test "TestName-2"
    When I open the 1st check "CheckName"

    # SECOND
    When I wait 30 seconds for the element with locator "[data-related-check-browser-name='safari1']" to be visible
    When I click element with locator "[data-related-check-browser-name='safari1']"
    Then the element with locator "[data-check='test-name']" should have contains text "TestName-1"
    Then the element with locator "[data-check='os']" should have contains text "Windows1"
    Then the element with locator "[data-check='browser']" should have contains text "safari1"
    # check icons before accept
    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"

    # accept
    When I click element with locator ".modal button[data-test='check-accept-icon']"
    When I click element with locator "button[data-test='check-accept-icon-confirm']"

    Then I expect via http 2st check filtered as "name=CheckName" matched:
      """
    markedAs: accepted
    status: [new]
      """

    When I wait until the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"

    # check icon color after close modal
    When I click element with locator "[data-test='close-check-detail-icon']"
    When I wait 30 seconds for the element with locator "(//*[@data-test-preview-image='CheckName'])[1]" to be visible

    Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'][data-popover-icon-name='CheckName'] svg" is "rgba(134,142,150,1)"
