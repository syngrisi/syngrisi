Feature: Test Isolation by Run

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
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
          - checkName: CheckRun-1.2
    """
    Given I create "1" tests with:
    """
      testName: TestRun-1.2
      runName: Run-1
      runIdent: Run-1
      checks:
          - checkName: CheckRun-1.1.1
          - checkName: CheckRun-1.2.2
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-2
      runIdent: Run-2
      checks:
          - checkName: CheckRun-2.1
          - checkName: CheckRun-2.2
    """
    When I refresh page

    # all tests
    When I wait on element "//div[contains(text(), 'TestRun')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestRun')]" does appear exactly "3" times

    # Run-1
    # tests
    When I click on the element "[data-item-name='Run-1']"
    When I wait on element "//div[contains(text(), 'TestRun-1.1')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestRun-1.2')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestRun-2')]" to not be displayed

    # checks
    When I click on the element "[data-table-test-name='TestRun-1.1']"
    Then I wait on element "[data-table-check-name='CheckRun-1.1']" to be displayed
    Then I wait on element "[data-table-check-name='CheckRun-1.2']" to be displayed

    When I click on the element "[data-table-test-name='TestRun-1.2']"
    Then I wait on element "[data-table-check-name='CheckRun-1.1.1']" to be displayed
    Then I wait on element "[data-table-check-name='CheckRun-1.2.2']" to be displayed

    # Run-2
    # tests
    When I click on the element "[data-item-name='Run-2']"
    When I wait on element "//div[contains(text(), 'TestRun-2')]" to be displayed
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
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-1
      runIdent: YYY
      checks:
          - checkName: CheckRun-2
    """

    When I refresh page
    # all tests
    When I wait on element "//div[contains(text(), 'TestRun')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestRun')]" does appear exactly "2" times

    # second run
    When I click on the element "(//*[@data-item-name='Run-1'])[1]"
    When I wait on element "//div[contains(text(), 'TestRun-2')]" to be displayed

    # first run
    When I click on the element "(//*[@data-item-name='Run-1'])[2]"
    When I wait on element "//div[contains(text(), 'TestRun-1')]" to be displayed

  Scenario: Checks Isolation by Run - same name same ident
    Given I create "1" tests with:
    """
      testName: TestRun-1
      runName: Run-1
      runIdent: XXX
      checks:
          - checkName: CheckRun-1
    """
    Given I create "1" tests with:
    """
      testName: TestRun-2
      runName: Run-1
      runIdent: XXX
      checks:
          - checkName: CheckRun-2
    """

    When I refresh page

    # only 1 run
    When I wait on element "//div[contains(text(), 'TestRun')]" to be displayed
    Then I expect that element "//div[contains(text(), 'TestRun')]" does appear exactly "2" times

    # 2 tests in run
    When I click on the element "(//*[@data-item-name='Run-1'])[1]"
    When I wait on element "//div[contains(text(), 'TestRun-1')]" to be displayed
    When I wait on element "//div[contains(text(), 'TestRun-2')]" to be displayed
