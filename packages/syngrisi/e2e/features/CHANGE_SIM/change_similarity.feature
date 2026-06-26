@fast-server
Feature: Change similarity — the same change at other resolutions
  Given one failed check, find the same logical change at the other viewports of the same run
  (descriptor computed on demand), surface it in the Check Details panel, and filter exactly
  that set into the standard table where the existing per-check accept/reject controls apply.

  @smoke
  Scenario: Siblings of a failed check are the same change at other viewports (API)
    Given I create a run "SimRun" with the same change at viewports "375x667,768x1024,1366x768"
    Then the change "ChangeCheck" has 2 siblings at other viewports

  Scenario: Panel lists siblings and "Show all in table" filters exactly that set
    Given I create a run "SimUi" with the same change at viewports "375x667,768x1024,1366x768"
    And I add an unrelated failed change "OtherCheck" to run "SimUi" at viewport "375x667"
    When I go to "main" page
    When I wait 15 seconds for the element with locator "[data-row-name='SimUi__375x667']" to be visible
    When I unfold the test "SimUi__375x667"
    When I open the 1st check "ChangeCheck"
    When I wait 15 seconds for the element with locator "[data-test='same-change-panel']" to be visible
    # the panel lists the same change at the OTHER two viewports
    Then the element with locator "[data-test='same-change-item'][data-viewport='768x1024']" should be visible
    Then the element with locator "[data-test='same-change-item'][data-viewport='1366x768']" should be visible
    # the check exposes an operable accept/reject control (same AcceptButton the table rows use)
    Then the element with locator "[data-test='not-accepted-error-icon']" should be visible
    # show exactly the query + sibling checks in the table; the unrelated change is filtered out
    When I click element with locator "[data-test='same-change-show-in-table']"
    When I wait 15 seconds for the element with locator "[data-row-name='SimUi__768x1024']" to be visible
    Then the element with locator "[data-row-name='SimUi__1366x768']" should be visible
    Then the element with locator "[data-row-name='SimUi__other']" should be hidden
