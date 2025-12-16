# Quick Guide: Generating E2E Tests (Syngrisi)

For AI agents working with the Syngrisi Playwright BDD suite in `packages/syngrisi/e2e`. Use only local steps from `packages/syngrisi/e2e/steps/**`.

## Where to place generated features
- Path: `packages/syngrisi/e2e/features/<area>/<name>_generated.feature`
- Tag generated files: `@generated` (plus area tags, e.g., `@ap`).

## Feature/Scenario skeleton
```gherkin
@ap @generated
Feature: Short, clear feature name

  Scenario: What the user does
    When I open site "{{baseUrl}}"
    And I click element with label "Sign in"
    Then the button "Sign in" should be visible
```

## Common local steps (safe set)
- Navigation: `When I open site "{{baseUrl}}"` or `When I open url "{{baseUrl}}/path"`.
- Clicks: `When I click element with label "..."` (preferred) or `When I click element with locator "[data-testid='...']"` as fallback.
- Inputs: `When I fill "text" into element with label "Field"` or `When I fill "text" into textbox "Field"` or `When I fill "Option" into combobox "Status"`.
- Assertions:  
  - `Then the heading "..." should be visible`  
  - `Then the button "..." should be enabled|disabled|visible`  
  - `Then the element with label "..." should have text "Expected"`  
  - `Then the element with locator "[data-testid='id']" should be visible` (fallback only).
- Waiting: `When I wait for "2" seconds`.

## Domain hints (Syngrisi)
- Baselines/checks live under AP/CP features. Reuse existing background steps where possible.
- Prefer semantic selectors; if missing, update UI under `packages/syngrisi/src/ui-app/**` (see `update-app-layout.md`).

## Generate and run
```bash
cd packages/syngrisi/e2e
npm run bddgen                                  # regenerate step catalog
npm run test:smoke                              # quick pass
npx playwright test "features/AP/..._generated.feature" --grep "Scenario name" --workers=1
```
Headed debug: `npx playwright test ... --headed --workers=1`.

## Mandatory checks after generation
- Run the new scenario; fix failures before handing off.
- No CSS/XPath unless role/label/data-testid are impossible.
- Keep comments only for non-obvious business rules/timing.
- If you add/modify steps, restart MCP sessions (regenerate step YAML).

## Test data helpers
Use templates from `testData`:  
`"Order-{{generateNumber[1000,9999]}}"`, `"{{generateEmail[test]}}"`, reuse stored vars: `"<email>"`.

## Example
```gherkin
@ap @generated
Feature: AP Create check

  Scenario: Create a check with required fields
    When I open site "{{baseUrl}}"
    And I click element with label "Sign in"
    And I fill "Test" into element with label "Email"
    And I fill "Test" into element with label "Password"
    And I click element with label "Sign in"
    Then the button "Sign in" should be visible
```
