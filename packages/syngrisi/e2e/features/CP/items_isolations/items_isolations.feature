@fast-server
Feature: Test Isolation by Filters

  Background:
    When I open the app
    When I clear local storage

  # ============================================
  # Filter by Project
  # ============================================

  @smoke
  Scenario: Filter by Project
    When I create "1" tests with:
      """
          project: "Project-1"
          testName: "TestName Project-1"
          runName: "RunName Project-1"
          runIdent: "RunIdent Project-1 $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I create "1" tests with:
      """
          project: "Project-2"
          testName: "TestName Project-2"
          runName: "RunName Project-2"
          runIdent: "RunIdent Project-2 $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page

    When I wait for test "TestName Project-1" to appear in table
    When I wait for test "TestName Project-2" to appear in table

    Then the element "[data-table-test-name='TestName Project-1']" does appear exactly "1" times
    Then the element "[data-table-test-name='TestName Project-2']" does appear exactly "1" times

    When I select the option with the text "Project-1" for element "select[data-test='current-project']"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-1']" to be visible
    When I wait on element "[data-table-test-name='TestName Project-2']" to not be displayed
    Then the element "[data-table-test-name='TestName Project-1']" does appear exactly "1" times
    Then the element "[data-table-test-name='TestName Project-2']" does appear exactly "0" times

    When I select the option with the text "Project-2" for element "select[data-test='current-project']"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName Project-2']" to be visible
    When I wait on element "[data-table-test-name='TestName Project-1']" to not be displayed
    Then the element "[data-table-test-name='TestName Project-1']" does appear exactly "0" times
    Then the element "[data-table-test-name='TestName Project-2']" does appear exactly "1" times

  # ============================================
  # Tests by Accept Status
  # ============================================

  Scenario: Tests Isolation by Accept Status
    # UNACCEPTED
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-unaccepted
    checks:
      - checkName: Check-unaccepted
        filePath: files/A.png
      """

    # PARTIALLY
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-partially
    checks:
      - checkName: Check-part1
        filePath: files/A.png
      - checkName: Check-part2
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-part1"

    # ACCEPTED
    Given I create "1" tests with:
      """
    testName: AcceptStatus-Unique-accepted
    checks:
      - checkName: Check-accepted
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-accepted"

    When I refresh page
    # all tests
    When I wait 10 seconds for the element with locator "[data-table-test-name*='AcceptStatus-Unique']" to be visible
    Then the element "[data-table-test-name*='AcceptStatus-Unique']" does appear exactly "3" times

    When I select the option with the text "Accept Status" for element "select[data-test='navbar-group-by']"

    # UNACCEPTED
    When I wait 10 seconds for the element with locator "//li[contains(., 'Unaccepted')]" to be visible
    When I click element with locator "li*=Unaccepted"

    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to be visible
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-partially']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-accepted']" to not be displayed

    # PARTIALLY
    When I wait 10 seconds for the element with locator "//li[contains(., 'Partially')]" to be visible
    When I click element with locator "li*=Partially"

    When I wait on element "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-partially']" to be visible
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-accepted']" to not be displayed

    # ACCEPTED
    When I wait 10 seconds for the element with locator "//li[contains(., 'Accepted')]" to be visible
    When I click element with locator "[data-testid='navbar-accept-status-accepted']"
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-unaccepted']" to not be displayed
    When I wait on element "[data-table-test-name='AcceptStatus-Unique-partially']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-table-test-name='AcceptStatus-Unique-accepted']" to be visible

  # ============================================
  # Tests by Browser
  # ============================================

  @smoke @flaky
  Scenario: Tests Isolation by Browser
    Given I create "2" tests with:
      """
    testName: TestBrowser-$
    browserName: chrome-$
    checks:
      - checkName: Check-1
        filePath: files/A.png
      """

    When I refresh page
    # all tests
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestBrowser')]" to be visible
    Then the element "//div[contains(text(), 'TestBrowser')]" does appear exactly "2" times

    When I select the option with the text "Browsers" for element "select[data-test='navbar-group-by']"

    # chrome-0
    When I wait 10 seconds for the element with locator "//li[contains(., 'chrome-0')]" to be visible
    When I click element with locator "li*=chrome-0"
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestBrowser-0')]" to be visible
    When I wait on element "//div[contains(text(), 'TestBrowser-1')]" to not be displayed

    # chrome-1
    When I wait 10 seconds for the element with locator "//li[contains(., 'chrome-1')]" to be visible
    When I click element with locator "li*=chrome-1"
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestBrowser-1')]" to be visible
    When I wait on element "//div[contains(text(), 'TestBrowser-0')]" to not be displayed

  # ============================================
  # Tests by Suite
  # ============================================

  Scenario: Tests Isolation by Suite
    Given I create "1" tests with:
      """
      testName: TestSuite-1.1
      suiteName: Suite-1
      checks:
        - checkName: CheckSuite-1.1
          filePath: files/A.png
        - checkName: CheckSuite-1.2
          filePath: files/A.png
      """
    Given I create "1" tests with:
      """
      testName: TestSuite-1.2
      suiteName: Suite-1
      checks:
        - checkName: CheckSuite-1.3
          filePath: files/A.png
        - checkName: CheckSuite-1.4
          filePath: files/A.png
      """

    Given I create "1" tests with:
      """
      testName: TestSuite-2.1
      suiteName: Suite-2
      checks:
        - checkName: CheckSuite-2.1
          filePath: files/A.png
        - checkName: CheckSuite-2.2
          filePath: files/A.png
      """

    When I refresh page
    When I wait for test "TestSuite-1.1" to appear in table
    When I wait for test "TestSuite-1.2" to appear in table
    When I wait for test "TestSuite-2.1" to appear in table

    # all tests
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestSuite')]" to be visible
    Then the element "//div[contains(text(), 'TestSuite')]" does appear exactly "3" times

    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

    # SUITE-1
    # tests
    When I wait 10 seconds for the element with locator "[data-item-name='Suite-1']" to be visible
    When I click element with locator "[data-item-name='Suite-1']"
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestSuite-1.1')]" to be visible
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestSuite-1.2')]" to be visible
    When I wait on element "//div[contains(text(), 'TestSuite-2.1')]" to not be displayed

    # checks
    When I click element with locator "[data-table-test-name='TestSuite-1.1']"
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckSuite-1.1']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckSuite-1.2']" to be visible

    When I click element with locator "[data-table-test-name='TestSuite-1.2']"
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckSuite-1.3']" to be visible
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckSuite-1.4']" to be visible

    # SUITE-1
    # tests
    When I click element with locator "[data-item-name='Suite-2']"
    When I wait 10 seconds for the element with locator "//div[contains(text(), 'TestSuite-2.1')]" to be visible
    When I wait on element "//div[contains(text(), 'TestSuite-1.1')]" to not be displayed
    When I wait on element "//div[contains(text(), 'TestSuite-1.2')]" to not be displayed

  # ============================================
  # Tests by Test Status
  # ============================================

  Scenario: Tests Isolation by Test Status
    # NEW
    Given I create "1" tests with:
      """
    testName: TestStatus-Unique-new
    checks:
      - checkName: Check-new
        filePath: files/A.png
      """

    # PASSED
    Given I create "1" tests with:
      """
    testName: TestStatus-Unique-passed-new
    checks:
      - checkName: Check-passed
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-passed"

    Given I create "1" tests with:
      """
    testName: TestStatus-Unique-passed-passed
    checks:
      - checkName: Check-passed
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-passed"

    # FAILED
    Given I create "1" tests with:
      """
    testName: TestStatus-Unique-failed-new
    checks:
      - checkName: Check-failed-baseline
        filePath: files/A.png
      """
    When I accept via http the 1st check with name "Check-failed-baseline"

    Given I create "1" tests with:
      """
    testName: TestStatus-Unique-failed
    checks:
      - checkName: Check-failed-baseline
        filePath: files/B.png
      """

    When I refresh page
    # all tests
    When I wait 10 seconds for the element with locator "[data-table-test-name*='TestStatus-Unique']" to be visible
    Then the element "[data-table-test-name*='TestStatus-Unique']" does appear exactly "5" times

    When I select the option with the text "Test Status" for element "select[data-test='navbar-group-by']"

    # NEW
    When I wait 10 seconds for the element with locator "//li[contains(., 'New')]" to be visible
    When I click element with locator "li*=New"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestStatus-Unique-new']" to be visible
    When I wait on element "[data-table-test-name='TestStatus-Unique-passed-passed']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-Unique-failed']" to not be displayed

    # PASSED
    When I click element with locator "li*=Passed"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestStatus-Unique-passed-passed']" to be visible
    When I wait on element "[data-table-test-name='TestStatus-Unique-new']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-Unique-failed']" to not be displayed

    # FAILED
    When I click element with locator "li*=Failed"

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestStatus-Unique-failed']" to be visible
    When I wait on element "[data-table-test-name='TestStatus-Unique-new']" to not be displayed
    When I wait on element "[data-table-test-name='TestStatus-Unique-passed-passed']" to not be displayed
