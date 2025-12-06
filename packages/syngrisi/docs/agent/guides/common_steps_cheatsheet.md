# Commonly Used E2E Steps (Syngrisi)

Most frequent steps in `packages/syngrisi/e2e/features`. Use these as defaults before inventing new ones.

- **Environment bootstrap**
  - `Given I clear Database and stop Server` — reset state (e.g., `features/CP/items_isolations/checks_by_test.feature`).
  - `Given I start Server and start Driver` — start API/UI + Playwright driver (same file).
  - `When I open the app` — navigate to base URL after bootstrap (`features/CP/navbar/pagination.feature`).
  - `When I clear local storage` — wipe browser storage between flows (`features/CP/navbar/quick_filtering.feature`).

- **Data setup**
  - `When I create "<N>" tests with:` (table of name/suite/app/branch) — bulk seed checks/tests (e.g., `features/CP/navbar/pagination.feature`).
  - `When I accept via http the 1st check with name "<CheckName>"` — server-side accept (e.g., `features/CP/items_isolations/tests_by_accept_status.feature`).

- **Navigation & selection**
  - `When I select the option with the text "<Text>" for element "<locator>"` — choose from select/mantine select (`features/CP/header/filter_by_project.feature`).
  - `When I set "<text>" to the inputfield "<locator>"` — type into free-form filters (`features/CP/navbar/quick_filtering.feature`).
  - `When I click element with locator "<locator>"` — primary click step; works with CSS/XPath/testid (ubiquitous, e.g., `features/AP/users/update.feature`).

- **Waits**
  - `When I wait <seconds> seconds for the element with locator "<locator>" to be visible` — explicit waits for grids/cards (`features/CP/items_isolations/checks_by_test.feature`).
  - `When I wait on element "<locator>" to not be displayed|not exist` — ensure removals/hide happen (`features/CP/navbar/remove_item.feature`).
  - `When I wait <seconds> seconds` — generic small pauses (`features/CP/navbar/sorting.feature`).

- **Assertions**
  - `Then the element "<locator>" does appear exactly "<N>" times` — count table/list items (`features/CP/header/filter_by_project.feature`).
  - `Then the element with locator "<locator>" should be visible` — visibility check (`features/tmp/doc_steps_validation.feature`).
  - `Then the css attribute "<attr>" from element "<locator>" is "<value>"` — style/state check (`features/CHECKS_HANDLING/standard_flow_ui.feature`).

- **Forms**
  - `When I fill "<value>" into element with label "<Label>"` — labeled inputs (e.g., `features/AP/users/create.feature`).
  - `When I fill "<value>" into element with placeholder "<Placeholder>"` — placeholder-based inputs (`features/tmp/doc_steps_validation.feature`).

Tip: Before adding new steps, search for existing patterns in `features/**` to stay aligned with the suite conventions. Use semantic locators where possible; rely on `element with locator` only when label/role is unavailable.***
