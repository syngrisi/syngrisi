@fast-server
Feature: Runs Ring Statuses

  Background:
#         Given I clear Database and stop Server
#         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Runs Ring Statuses [PASSED, FILED, NEW]
    # passed
    Given I create "1" tests with:
    """
          testName: Test-passed
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
    """
    When I accept via http the 1st check with name "CheckName-1"

    Given I create "1" tests with:
    """
          testName: Test-passed
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
              - checkName: CheckName-1
        filePath: files/A.png
    """

    # failed
    Given I create "1" tests with:
    """
          testName: Test-failed
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
    """
    When I accept via http the 1st check with name "CheckName-1"

    Given I create "1" tests with:
    """
          testName: Test-failed
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - checkName: CheckName-1
              filePath: files/B.png
    """

    # new
    Given I create "1" tests with:
    """
          testName: Test-new
          runName: "RunName-1"
          runIdent: "RunIdent-1"
          checks:
            - checkName: CheckName-1
              filePath: files/A.png
    """

    When I go to "main" page

    When I wait 30 seconds for the element with locator "//*[@data-test='navbar-item-name' and contains(., 'RunName-1')]" to be visible

    # check status ring
    When I execute javascript code:
    """
    const el = document.querySelector("[data-statusring-name='RunName-1']").firstChild.childNodes
    return el[0].getAttribute('stroke-dasharray')
    + el[1].getAttribute('stroke-dasharray')
    + el[2].getAttribute('stroke-dasharray')
    + el[3].getAttribute('stroke-dasharray')
    + el[4].getAttribute('stroke-dasharray')
    """

    Then I expect the stored "js" string is equal:
    """
          0, 60.3185789489240436.191147369354425, 24.1274315795696170, 60.3185789489240412.063715789784808, 48.25486315913923412.063715789784808, 48.254863159139234
    """