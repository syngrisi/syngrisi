Feature: Client API Negative

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: Start Session, stopped Server
    When I stop Server
    When I wait for "5" seconds
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """
    Then I expect WDIODriver "startTestSession" method throws an error containing:
    """
    RequestError: connect ECONNREFUSED
    """

  Scenario: Start Session, without test name
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """
    Then I expect WDIODriver "startTestSession" method throws an error containing:
    """
    Invalid 'startTestSession, params' parameters: {"_errors":[],"test":{"_errors":["Required"]}}
    """

  Scenario: Start, Stop Session, create check - without name
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """
    When I execute WDIODriver "check" method with params:
    """
    {
        "filePath": "./files/A.png",
        "params": {
            "checkName": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "browserVersion": 2,
            "browserFullVersion": "1.2.3.4"
        }
    }
    """
    Then I expect WDIODriver "check" method throws an error containing:
    """
    Invalid 'check, opts' parameters: {"_errors":[],"name":{"_errors":["Required"]}}
    """

  Scenario: Start, Stop Session, create check - empty name
    When I execute WDIODriver "startTestSession" method with params:
    """
     {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """

    When I execute WDIODriver "check" method with params:
    """
    {
        "checkName": "",
        "filePath": "./files/A.png",
        "params": {
            "checkName": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "browserVersion": 2,
            "browserFullVersion": "1.2.3.4"
        }
    }
    """
    Then I expect WDIODriver "check" method throws an error containing:
    """
    Invalid 'check, opts' parameters: {"_errors":[],"name":{"_errors":["String must contain at least 1 character(s)"]}}
    """

  Scenario: Get baselines by ident - without name
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """
    When I execute WDIODriver "check" method with params:
    """
    {
        "checkName": "check-name",
        "filePath": "./files/A.png",
        "params": {
            "checkName": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "browserVersion": 2,
            "browserFullVersion": "1.2.3.4"
        }
    }
    """
    When I accept via http the 1st check with name "check-name"

    When I execute WDIODriver "getBaselines" method with params:
    """
    {
        "params": {
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "project-name",
            "branch": "branch-name"
        }
    }
    """

    Then I expect WDIODriver "getBaselines" method throws an error containing:
    """
    Invalid 'getBaseline, opts' parameters: {"_errors":[],"name":{"_errors":["Required"]}}
    """

  Scenario: Get baselines by ident - empty name
    When I execute WDIODriver "startTestSession" method with params:
    """
    {
        "params": {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
    }
    """
    When I execute WDIODriver "check" method with params:
    """
    {
        "checkName": "check-name",
        "filePath": "./files/A.png",
        "params": {
            "checkName": "check-name",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "browserVersion": 2,
            "browserFullVersion": "1.2.3.4"
        }
    }
    """
    When I accept via http the 1st check with name "check-name"

    When I execute WDIODriver "getBaselines" method with params:
    """
    {
        "params": {
            "name": "",
            "viewport": "500x500",
            "browserName": "safari",
            "os": "Windows",
            "app": "project-name",
            "branch": "branch-name"
        }
    }
    """

    Then I expect WDIODriver "getBaselines" method throws an error containing:
    """
    Invalid 'getBaseline, opts' parameters: {"_errors":[],"name":{"_errors":["String must contain at least 1 character(s)"]}}
    """
