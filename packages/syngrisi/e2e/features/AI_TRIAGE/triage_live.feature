@fast-server @live-vlm @skip-ci
Feature: AI Triage against a real local vision model (Ollama)
  Opt-in verification of the real classification path (excluded from default/CI runs because it
  is slow and non-deterministic). Requires a local Ollama with a vision-capable model.
  Run with: npx bddgen && npx playwright test --project=chromium "features/AI_TRIAGE/triage_live.feature" --grep "@live-vlm" --workers=1
  Optionally pin the model: E2E_VLM_MODEL=qwen3-vl:8b

  Scenario: A real vision model classifies a failed check and the verdict shows in the UI
    Given a local vision model is available
    Given I create "1" tests with:
      """
      testName: LiveVlmTest
      project: LiveVlm
      checks:
        - checkName: LiveVlmCheck
          filePath: files/A.png
      """
    When I accept via http the 1st check with name "LiveVlmCheck"
    Given I create "1" tests with:
      """
      testName: LiveVlmTest
      project: LiveVlm
      checks:
        - checkName: LiveVlmCheck
          filePath: files/B.png
      """
    When I configure the triage provider for the local vision model
    When I run AI triage for the 1st check named "LiveVlmCheck"
    # Non-deterministic verdict → assert it is well-formed and not a provider failure
    Then the 1st check named "LiveVlmCheck" has a valid AI verdict
    # And it surfaces in the UI
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='LiveVlmTest']" to be visible
    When I unfold the test "LiveVlmTest"
    Then the element with locator "[data-triage-verdict]" should be visible
