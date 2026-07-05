@cp @security
Feature: Share Token Scope (IDOR fix)

  # Regression coverage for the share-token IDOR fix: a share token is created for one specific
  # check and must never grant access to a DIFFERENT check's data via the API, even though the
  # token is happily accepted (auth succeeds) by any share-enabled endpoint.
  #
  # Covered endpoints (see scopeSnapshotsToShare / sharedCheckId() usage in
  # check.controller.ts::getDomSnapshot / getSimilar and baseline.controller.ts::get /
  # getBaselineHistory):
  #   - GET /v1/checks/:id/dom
  #   - GET /v1/checks/:id/similar
  #   - GET /v1/baselines
  #   - GET /v1/baselines/history

  Background:
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
      """
    Given I start Server
    When I create via http test user
    Given I stop Server

    When I set env variables:
      """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
      """
    When I reload session

    When I login via http with user:"Test" password "123456aA-"
    When I generate via http API key for the User
    When I set the API key in config

  Scenario: A share token scoped to check A cannot fetch check B's DOM snapshot or similar-checks list
    Given I create "1" tests with:
      """
          testName: ShareScopeDomTest
          checks:
            - checkName: ShareScopeDomCheckA
              filePath: files/A.png
            - checkName: ShareScopeDomCheckB
              filePath: files/B.png
      """
    # Give both checks real DOM-snapshot data, so a 404 on the "wrong" check can only be
    # explained by the share-token scope check - not by the data simply not existing.
    Given I seed a raw DOM snapshot for the 1st check with name "ShareScopeDomCheckA"
    Given I seed a raw DOM snapshot for the 1st check with name "ShareScopeDomCheckB"

    When I create via http a share token for the 1st check with name "ShareScopeDomCheckA" as "checkA"
    When I create via http a share token for the 1st check with name "ShareScopeDomCheckB" as "checkB"

    # Each token can fully access its OWN check
    When I request via http "/v1/checks/<checkA_checkId>/dom" with share token "checkA" and expect status 200
    When I request via http "/v1/checks/<checkA_checkId>/similar" with share token "checkA" and expect status 200
    When I request via http "/v1/checks/<checkB_checkId>/dom" with share token "checkB" and expect status 200
    When I request via http "/v1/checks/<checkB_checkId>/similar" with share token "checkB" and expect status 200

    # Check A's token must NOT unlock check B's DOM snapshot or similar-checks list
    When I request via http "/v1/checks/<checkB_checkId>/dom" with share token "checkA" and expect status 404
    When I request via http "/v1/checks/<checkB_checkId>/similar" with share token "checkA" and expect status 404

    # ...and symmetrically, check B's token must NOT unlock check A's data
    When I request via http "/v1/checks/<checkA_checkId>/dom" with share token "checkB" and expect status 404
    When I request via http "/v1/checks/<checkA_checkId>/similar" with share token "checkB" and expect status 404

  Scenario: A share token scoped to check A only ever returns check A's baseline lineage
    Given I create "1" tests with:
      """
          testName: ShareScopeBaselineTest
          checks:
            - checkName: ShareScopeBaselineCheckA
              filePath: files/A.png
            - checkName: ShareScopeBaselineCheckB
              filePath: files/B.png
      """
    When I accept via http the 1st check with name "ShareScopeBaselineCheckA"
    When I accept via http the 1st check with name "ShareScopeBaselineCheckB"

    When I create via http a share token for the 1st check with name "ShareScopeBaselineCheckA" as "checkA"
    When I create via http a share token for the 1st check with name "ShareScopeBaselineCheckB" as "checkB"

    # The baseline list under check A's token must only ever contain check A's own baseline(s)
    When I request via http "/v1/baselines?limit=0" with share token "checkA" and expect status 200
    Then I expect the stored "shareResponseBody" string is contain:
      """
      "ShareScopeBaselineCheckA"
      """
    Then I expect the stored "shareResponseBody" string is not contain:
      """
      "ShareScopeBaselineCheckB"
      """

    When I remember via http the id of the 1st baseline filtered as "ShareScopeBaselineCheckA" as "groundTruthCheckABaselineId"
    When I remember via http the id of the 1st baseline filtered as "ShareScopeBaselineCheckB" as "groundTruthCheckBBaselineId"

    # Even when the request targets check B's own ident, authenticating with check A's share
    # token must make the server substitute check A's ident (derived from the token) - the
    # client-supplied ident is never trusted for a share-mode request.
    When I request via http baseline history for check "checkB" with share token "checkA" and expect status 200
    Then I expect the stored "shareResponseBody" string to contain the stored "groundTruthCheckABaselineId"
    Then I expect the stored "shareResponseBody" string to not contain the stored "groundTruthCheckBBaselineId"
