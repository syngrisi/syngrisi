@Pending
Feature: Start/Stop session

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: Start/Stop Session - New
    # Start
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    When I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "./files/A.png" as "stop session check_01"


    # Stop
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    When I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: New
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

  Scenario: Start/Stop Session - New, Passed
    # Start - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - New
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/A.png" as "stop session check_01"


    # Stop - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: New
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Start - Passed
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - Passed
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/A.png" as "stop session check_01"

    # Stop - Passed
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: Passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

  Scenario: Start/Stop Session - New, Failed
    # Start - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - New
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/A.png" as "stop session check_01"


    # Stop - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: New
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Start - Failed
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - Failed
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/B.png" as "stop session check_01"

    # Stop - Failed
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: Failed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """


  Scenario: Start/Stop Session - New, Passed, Failed
    # Start - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - New
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/A.png" as "stop session check_01"


    # Stop - New
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: New
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Start - Passed
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - Passed
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/A.png" as "stop session check_01"

    # Stop - Passed
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: Passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

     # Start - Failed
    When I send "post" request to "http://<serverDomain>:<serverPort>/tests" with:
    """
    form:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      viewport: 10x10
      browser: chrome
      browserVersion: "86"
      os: MacOs
    """
    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      status: passed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

    # Setup & Check - Failed
    When I set properties for VRSDriver:
    """
      os: 'MacIntel'
      viewport: '1366x768'
      browserName: 'chrome'
      browserVersion: "86"
      app: 'Test App'
      test: 'Passed test'
      testId: <post: _id>
      suite:
        name: Test VRS API Smoke - Start/Stop Session
    """
    When I check image with path: "files/B.png" as "stop session check_01"

    # Stop - Failed
    When I send "post" request to "http://<serverDomain>:<serverPort>/session/<post: _id>" with:
    """
    form:
      testId: <post: _id>
    """

    Then I expect the "post" response with:
    """
    statusCode: 200
    json:
      name: Test VRS API Smoke - Start/Stop Session
      calculatedStatus: Failed
      browserName: chrome
      browserVersion: "86"
      viewport: 10x10
      os: MacOs
      blinking: 0
    """

