@fast-server
Feature: Change similarity — find similar checks
  Given one failed check, rank the other failed checks in the same run by the change descriptor and
  return the full list with a 0..1 similarity score. Similarity is NOT limited to other resolutions
  (same-viewport/other-browser checks are included). The UI exposes a "Find similar checks" button in
  Check Details that leaves the modal and filters the standard main grid to that ranked set, each
  check showing its similarity score, so the existing per-check/batch accept-reject controls apply.

  @smoke
  Scenario: Similar checks are the same change ranked by score, incl. same viewport (API)
    Given I create a run "SimRun" with the same change at viewports "375x667,768x1024,1366x768"
    And I add the same change "ChangeCheck" to run "SimRun" at viewport "375x667" with browser "firefox"
    And I add an unrelated failed change "OtherCheck" to run "SimRun" at viewport "375x667"
    Then the change "ChangeCheck" has 3 similar checks ranked by score including the same viewport

  Scenario: "Find similar" icon-link filters & auto-expands the grid with ~NN% scores
    Given I create a run "SimUi" with the same change at viewports "375x667,768x1024,1366x768"
    And I add the same change "ChangeCheck" to run "SimUi" at viewport "375x667" with browser "firefox"
    And I add an unrelated failed change "OtherCheck" to run "SimUi" at viewport "375x667"
    When I go to "main" page
    When I wait 15 seconds for the element with locator "[data-row-name='SimUi__375x667']" to be visible
    When I unfold the test "SimUi__375x667"
    When I open the 1st check "ChangeCheck"
    # the small icon-link sits in the Check Details modal toolbar, just left of the AI icon
    When I wait 15 seconds for the element with locator "[data-test='find-similar-checks']" to be visible
    When I click element with locator "[data-test='find-similar-checks']"
    # clicking lands on the filtered grid; the similar checks each show a similarity score
    When I wait 15 seconds for the element with locator "[data-test='similarity-score']" to be visible
    # the same change at the OTHER viewports is shown
    Then the element with locator "[data-row-name='SimUi__768x1024']" should be visible
    Then the element with locator "[data-row-name='SimUi__1366x768']" should be visible
    # the same change at the SAME viewport (other browser) is shown too
    Then the element with locator "[data-row-name='SimUi__375x667__firefox']" should be visible
    # the unrelated change is filtered out
    Then the element with locator "[data-row-name='SimUi__other']" should be hidden
    # all matching tests auto-expand (no manual unfolding) → 4 checks, each with a ~NN% badge
    Then the element "[data-test='similarity-score']" does appear exactly "4" times
    Then the element "[data-test='similarity-score']" contains the text "~"
