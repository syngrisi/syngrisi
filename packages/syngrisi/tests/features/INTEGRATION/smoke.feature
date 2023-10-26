Feature: Smoke

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Smoke
        When I execute WDIODriver "startTestSession" method with params:
        """
        {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
        """
        Then I expect WDIODriver "startTestSession" return value match object:
        """
        {
            "name": "test-name",
            "status": "Running",
            "browserName": "chrome [HEADLESS]",
            "browserVersion": "123",
            "branch": "branch-name",
            "tags": [
                "tag1",
                "tag2",
                "tag3"
            ],
            "viewport": "1366x768",
            "os": "macOS",
            "checks": []
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
        Then I expect WDIODriver "check" return value match object:
        """
         {
            "name": "check-name",
            "test": "<startTestSession: _id>",
            "suite": "<startTestSession: suite>",
            "app": "<startTestSession: app>",
            "branch": "branch-name",
            "status": [
                "new"
            ],
            "browserName": "safari",
            "browserVersion": "2",
            "browserFullVersion": "1.2.3.4",
            "viewport": "500x500",
            "os": "Windows",
            "result": "{}",
            "run": "<startTestSession: run>",
            "creatorUsername": "Guest",
            "failReasons": []
        }
        """

        When I execute WDIODriver "stopTestSession" method with params:
        """
        {
            "app": "project-name",
            "branch": "branch-name",
            "tags": ["tag1", "tag2", "tag3"],
            "browserVersion": "123",
            "test": "test-name",
            "suite": "suite-name",
            "run": "run-name",
            "runident": "test-run-ident"
        }
        """
        Then I expect WDIODriver "stopTestSession" return value match object:
        """
         {
            "_id": "<startTestSession: _id>",
            "name": "test-name",
            "status": "Running",
            "browserName": "chrome [HEADLESS]",
            "browserVersion": "123",
            "branch": "branch-name",
            "tags": [
                "tag1",
                "tag2",
                "tag3"
            ],
            "viewport": "1366x768",
            "os": "macOS",
            "app": "<startTestSession: app>",
            "blinking": 0,
            "checks": ["<check: _id>"],
            "suite": "<startTestSession: suite>",
            "run": "<startTestSession: run>",
            "calculatedStatus": "New"
        }
        """
