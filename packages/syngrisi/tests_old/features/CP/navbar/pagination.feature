@smoke
Feature: Pagination

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Pagination
    When I create "30" tests with:
        """
          testName: "TestName-$"
          runName: "RunName-$"
          runIdent: "RunIdent-$"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
    When I go to "main" page
    Then I wait on element "[data-test*='navbar_item_']" to be displayed
    Then I expect that element "[data-test*='navbar_item_']" does appear exactly "20" times
    When I scroll to element "[data-test*='navbar_item_11']"
    When I wait for "1" seconds
    Then I expect that element "[data-test*='navbar_item_']" does appear exactly "30" times

  Scenario: Pagination - Suite
  There were problems with pagination of suites when a session started with a suite that was created a long time ago, its createdData was updated,
  this caused collisions due to which some suites were not visible,
  it was fixed in commit 352eb555e2f8cc0d347298eca20c2ffad6be9d42

    When I create "30" tests with:
    """
      testName: "TestName-$"
      runName: "RunName-$"
      runIdent: "RunIdent-$"
      suiteName: "SuiteName-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
    """

    # such tests can be disappeared in old logic
    When I create "3" tests with:
    """
      testName: "TestName-$"
      runName: "RunName-$"
      runIdent: "RunIdent-$"
      suiteName: "SuiteName-$"
      checks:
        - filePath: files/A.png
          checkName: Check - 1
    """

    When I go to "main" page
    Then I wait on element "[data-test*='navbar_item_']" to be displayed
    When I select the option with the text "Suites" for element "select[data-test='navbar-group-by']"

    Then I wait on element "[data-test*='navbar_item_']" for 15000ms to be displayed
    Then I expect that element "[data-test*='navbar_item_']" does appear exactly "20" times
    When I scroll to element "[data-test*='navbar_item_11']"
    When I wait for "1" seconds
    Then I expect that element "[data-test*='navbar_item_']" does appear exactly "30" times

