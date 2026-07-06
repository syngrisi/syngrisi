@fast-server @env:SYNGRISI_AUTH:false @env:SYNGRISI_TEST_MODE:true
Feature: Pagination populate must tolerate unknown paths

  Regression for the StrictPopulateError 500. An unknown `groupBy` URL value
  (e.g. `Tests`) falls through `useInfinityScroll.getPopulate()` to the default
  populate string `suite,app,test,...`, which is then sent to the tests resource
  whose schema has no `test` path. Mongoose `strictPopulate` (default true) threw
  `StrictPopulateError` and the grouping panel rendered a red
  "Request failed with status 500". The server pagination must skip populate
  paths that are not in the target schema instead of returning 500.

  Background:
    When I open the app
    When I clear local storage
    # At least one Test document must exist so the populate is actually attempted
    # (Mongoose only resolves populate paths when there are docs to populate).
    When I create "1" tests with:
      """
          testName: "TestName - 1"
          runName: "RunName - 1"
          suiteName: "SuiteName - 1"
          browserName: msedge
          checks:
            - filePath: files/A.png
              checkName: Check - 1
      """

  @smoke
  Scenario: A populate path not in the tests schema must not 500
    # The exact populate the invalid `groupBy=Tests` UI flow sends to /v1/tests.
    Then a GET to "/v1/tests?populate=suite,app,test,baselineId,actualSnapshotId,diffId" responds with status 200
    # Minimal reproduction: `test` is not a path on the Test schema.
    Then a GET to "/v1/tests?populate=test" responds with status 200
    # A populate path that DOES exist on the resource still works.
    Then a GET to "/v1/checks?populate=test" responds with status 200
