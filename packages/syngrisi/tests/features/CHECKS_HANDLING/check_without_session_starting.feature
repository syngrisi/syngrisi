@integration @smoke @e2e
Feature: One Check without session starting

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Create new check - without session ending
        When I check image with path: "files/A.png" as "new int check" and suppress exceptions
        Then I expect the stored "error" string is contain:
        """
        The test id is empty
        """
