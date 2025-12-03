@fast-server
Feature: Navbar Sorting

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  Scenario: Sorting
    When I create "3" tests with:
      """
          testName: "TestName - $"
          runName: "RunName - $"
          suiteName: "SuiteName - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """
    When I go to "main" page

    # without sorting action
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='navbar-item-name']"))
        .filter(x=> x.innerText.includes('RunName - '));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              RunName - 2, RunName - 1, RunName - 0
      """

    # sort order - ascending
    When I click element with locator "[data-test='navbar-icon-open-sort']"
    When I wait 10 seconds for the element with locator "button[data-test='navbar-sort-by-order']" to be visible
    When I click element with locator "button[data-test='navbar-sort-by-order']"
    When I wait 2 seconds

    When I repeat javascript code until stored "js" string equals "RunName - 0, RunName - 1, RunName - 2":
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='navbar-item-name']"))
        .filter(x=> x.innerText.includes('RunName - '));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              RunName - 0, RunName - 1, RunName - 2
      """

    # sort order - descendant
    When I click element with locator "button[data-test='navbar-sort-by-order']"
    When I wait 2 seconds

    When I repeat javascript code until stored "js" string equals "RunName - 2, RunName - 1, RunName - 0":
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='navbar-item-name']"))
        .filter(x=> x.innerText.includes('RunName - '));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
              RunName - 2, RunName - 1, RunName - 0
      """