@fast-server
Feature: Change similarity — the same change at other resolutions
  Given one failed check, GET /v1/checks/:id/siblings returns the same logical change
  at the other viewports of the same run (descriptor computed on demand).

  @smoke
  Scenario: Siblings of a failed check are the same change at other viewports
    Given I create a run "SimRun" with the same change at viewports "375x667,768x1024,1366x768"
    Then the change "ChangeCheck" has 2 siblings at other viewports
