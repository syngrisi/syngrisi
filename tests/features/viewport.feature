@integration
Feature: VRS Viewport

  Background:
    Given I clear test VRS database
    Given I kill process which used port: "3001"
    Given I start VRS server with parameters:
    """
      port: 3001
      databaseName: VRSdbTest
      baseLineFolder: ./baselinesTest/
    """
    Given I setup VRS driver with parameters:
    """
      url: "http://vrs:3001/"
    """

  Scenario: VRS ViewPort - create single check
    When I set env variables:
    """
    RUN_NAME: RUN-01
    """
    Given I set window size: "712x970"
    Given I start VRS session with parameters:
    """
      testName: "Viewport integration test"
    """
    When I open the url "http://vrs:3001/static/app_1.html"
    When I visually check page as "viewport - single check"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    Then I expect that VRS test "Viewport integration test" has "712x970" viewport
    When I click on "Viewport integration test" VRS test
    Then I expect that VRS test "Viewport integration test" is unfolded
    Then I expect that VRS check "1/1 viewport - single check" has "New" status
    # assert preview
    Then I expect that element "//div[contains(@class, 'preview-overlay-text')]" is clickable
    Then I expect that element "//div[contains(@class, 'preview-overlay-text')]" to have text "712x970"

  Scenario: VRS ViewPort - two checks with same viewports
    When I set env variables:
    """
    RUN_NAME: RUN-01
    """
    Given I start VRS session with parameters:
    """
      testName: "Viewport integration test"
    """
    Given I set window size: "712x970"
    When I open the url "http://vrs:3001/static/app_1.html"
    When I visually check page as "viewport - two checks same viewports 01"

    When I visually check page as "viewport - two checks same viewports 02"

    When I stop VRS session
    When I open the url "http://vrs:3001/"

    When I wait for "2" seconds
    Then I expect that VRS test "Viewport integration test" has "712x970" viewport

  Scenario: VRS ViewPort - two checks with different viewports
    When I set env variables:
    """
    RUN_NAME: RUN-01
    """
    Given I start VRS session with parameters:
    """
      testName: "Viewport integration test"
    """
    Given I set window size: "712x970"
    When I open the url "http://vrs:3001/static/app_1.html"
    When I visually check page as "viewport - two checks same viewports 01"

    Given I set window size: "1050x768"
    When I refresh page
    When I visually check page as "viewport - two checks same viewports 02"

    When I stop VRS session
    When I open the url "http://vrs:3001/"
    When I wait for "2" seconds

    Then I expect that VRS test "Viewport integration test" has "≠" viewport
