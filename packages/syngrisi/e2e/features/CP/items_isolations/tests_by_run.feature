@fast-server
Feature: Test Isolation by Run

  Background:
#     Given I clear Database and stop Server
#     Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Tests Isolation by Run
    Given I create "1" tests with:
    """
      testName: TestRun-1.1
      runName: Run-1
      runIdent: Run-1
      checks:
          - checkName: CheckRun-1.1
            filePath: files/A.png
          - checkName: CheckRun-1.2
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: TestRun-1.2
      runName: Run-1
      runIdent: Run-1
      checks:
          - checkName: CheckRun-1.1.1
            filePath: files/A.png
          - checkName: CheckRun-1.2.2
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-2
      runIdent: Run-2
      checks:
          - checkName: CheckRun-2.1
            filePath: files/A.png
          - checkName: CheckRun-2.2
            filePath: files/A.png
    """
    When I refresh page

    # all tests
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun')]" to be visible
    Then the element "//div[contains(text(), 'TestRun')]" does appear exactly "3" times

    # Run-1
    # tests
    When I click element with locator "[data-item-name='Run-1']"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-1.1')]" to be visible
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-1.2')]" to be visible
    When I wait on element "//div[contains(text(), 'TestRun-2')]" to not be displayed

    # checks
    When I click element with locator "[data-table-test-name='TestRun-1.1']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckRun-1.1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckRun-1.2']" to be visible

    When I click element with locator "[data-table-test-name='TestRun-1.2']"
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckRun-1.1.1']" to be visible
    When I wait 30 seconds for the element with locator "[data-table-check-name='CheckRun-1.2.2']" to be visible

    # Run-2
    # tests
    When I click element with locator "[data-item-name='Run-2']"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-2')]" to be visible
    When I wait on element "//div[contains(text(), 'TestRun-1.1')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestRun-1.2')]" to not be displayed

  Scenario: Checks Isolation by Run - same name different ident
    Given I create "1" tests with:
    """
      testName: TestRun-1
      runName: Run-1
      runIdent: XXX
      checks:
          - checkName: CheckRun-1
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-1
      runIdent: YYY
      checks:
          - checkName: CheckRun-2
            filePath: files/A.png
    """

    When I refresh page
    # all tests
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun')]" to be visible
    Then the element "//div[contains(text(), 'TestRun')]" does appear exactly "2" times

    # second run
    When I click element with locator "(//*[@data-item-name='Run-1'])[1]"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-2')]" to be visible

    # first run
    When I click element with locator "(//*[@data-item-name='Run-1'])[2]"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-1')]" to be visible

  Scenario: Checks Isolation by Run - same name same ident
    Given I create "1" tests with:
    """
      testName: TestRun-1
      runName: Run-1
      runIdent: XXX
      checks:
          - checkName: CheckRun-1
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-1
      runIdent: XXX
      checks:
          - checkName: CheckRun-2
            filePath: files/A.png
    """

    When I refresh page

    # only 1 run
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun')]" to be visible
    Then the element "//div[contains(text(), 'TestRun')]" does appear exactly "2" times

    # 2 tests in run
    When I click element with locator "(//*[@data-item-name='Run-1'])[1]"
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-1')]" to be visible
    When I wait 30 seconds for the element with locator "//div[contains(text(), 'TestRun-2')]" to be visible