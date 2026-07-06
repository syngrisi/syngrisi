@fast-server @smoke
Feature: RCA setting — persistent admin toggle with env override

  rca_enabled is a persistent admin setting (default OFF, verified by the
  rca.config unit test). When the SYNGRISI_RCA environment variable is set it
  wins over the admin toggle and locks it — this feature covers that env-lock UI
  in both directions.

  Scenario: Admin can enable RCA from the toggle when there is no env override
    # SYNGRISI_RCA="" means "not set" — the server must boot (regression: an empty
    # value used to crash envalid) and the persistent admin setting governs.
    Given I stop Server
    When I set env variables:
      """
          SYNGRISI_AUTH: ""
          SYNGRISI_RCA: ""
      """
    When I go to "settings" page
    When I wait 10 seconds for the element with label "Enable RCA" to be visible
    When I wait on element "[data-test='settings_env_locked_rca_enabled']" to not be displayed
    Then the element with label "Enable RCA" should be unchecked
    When I click element with label "Enable RCA"
    When I click element with locator "button[aria-label='Update Enable RCA']"
    When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
    # Reload — the setting persisted (single toggle saves with enabled:true).
    When I go to "settings" page
    When I wait 10 seconds for the element with label "Enable RCA" to be visible
    Then the element with label "Enable RCA" should be checked

  Scenario: SYNGRISI_RCA=false locks the admin toggle OFF
    Given I stop Server
    When I set env variables:
      """
          SYNGRISI_AUTH: ""
          SYNGRISI_RCA: "false"
      """
    When I go to "settings" page
    When I wait 10 seconds for the element with locator "[data-test='settings_env_locked_rca_enabled']" to be visible
    Then the element with label "Enable RCA" should be unchecked

  Scenario: SYNGRISI_RCA=true locks the admin toggle ON
    Given I stop Server
    When I set env variables:
      """
          SYNGRISI_AUTH: ""
          SYNGRISI_RCA: "true"
      """
    When I go to "settings" page
    When I wait 10 seconds for the element with locator "[data-test='settings_env_locked_rca_enabled']" to be visible
    Then the element with label "Enable RCA" should be checked
