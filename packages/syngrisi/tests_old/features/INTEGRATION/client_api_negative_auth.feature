Feature: Client API Negative, with authentication

  Background:
    Given I clear Database and stop Server
    When I set env variables:
    """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: true
    """
    Given I start Server and start Driver

  Scenario: Start Session, without authentication
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
    HTTPError: Response code 401 (Unauthorized)
    """
