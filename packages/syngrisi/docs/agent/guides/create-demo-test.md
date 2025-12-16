## Purpose

Provide universal principles for scripting narrated demo tests, independent of feature-specific flows. Reference step definitions live in `packages/syngrisi/e2e/steps/common/demo.steps.ts`.

## Core Steps

1. Setup: declare deterministic prerequisites (data, flags, user state) and open the app from a clean slate.
2. Entry: verify the first screen title, highlight the primary element, and deliver a short welcome narration.
3. Interaction blocks: for each key UI action (button press, selection, form submission) follow the pattern highlight → announce intent → perform action → assert the immediate result.
4. Transitions: before changing views, announce what the next screen represents and why the transition matters, then confirm the new heading or landmark.
5. Completion: describe the final state, clear highlights or overlays, assert the closing heading/message, and **ALWAYS** explicitly end the demo script with `When I end the demo` to trigger the confetti animation.

## Annotation Rules

-   **Naming**: Use dashes instead of parentheses in Feature and Scenario names (e.g., `Feature: RCA - Demo - Silent Mode` instead of `Feature: RCA - Demo (Silent Mode)`).
-   Keep every `When I announce` line concise (1–2 sentences) and in the target locale of the demo.
-   Narration should explain user value or decision rationale, not implementation details.
-   Highlight the referenced element before interacting with it and clear highlights when the focus changes.
-   Mention only the essential selector (heading, button label, role) so narration stays portable.
-   **ALWAYS** end every demo scenario with `When I end the demo` to trigger the confetti animation and provide visual closure.
-   The `When I end the demo` step should be the last step in your scenario after all assertions and cleanup.

## Zero-shot Examples

```gherkin
# Announce: Welcome & Context
When I announce: "Welcome! We are now on the main dashboard, which provides a comprehensive view of your project's visual health."

# Announce: Feature Explanation
When I announce: "Notice how the side-by-side comparison mode helps you effortlessly spot even the smallest pixel differences."

# Announce: Success & Value
When I announce: "Fantastic! The baseline has been successfully updated, ensuring your future test runs are accurate and reliable."

# Announce: Action & Result
When I announce: "By simply clicking this 'Details' button, you can explore the complete history and settings of the baseline."
When I announce: "If you press the 'Accept' button here, the system will automatically update the golden master for future checks."

# Highlight an element with animated border
When I highlight element "[data-test='submit-button']"

# Clear all highlights
When I clear highlight

# End demo with confetti animation
When I end the demo

# Debug variant: announce and pause execution
When I announce: "The setup is complete. Pausing now so you can inspect the current state." and PAUSE
```

## Running Demo Tests

Demo tests are in a separate Playwright project (`demo`) and are excluded from regular test runs. Use these commands:

```bash
# Run all demo tests (headed mode by default)
npm run test:demo

# Run specific demo test
npx bddgen && npx playwright test --project=demo --grep "Demo name" --workers=1

# Skip demo steps for faster debugging (recommended during development)
export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project=demo --grep "your_demo" --workers=1

# Run with full demo experience (for final verification)
npx bddgen && npx playwright test --project=demo --grep "your_demo" --workers=1
```

### Benefits of SKIP_DEMO_TESTS=true during development:

-   **Faster iteration**: Skip text-to-speech announcements (which can take several seconds each)
-   **Focus on logic**: Verify test flow and assertions without waiting for narration
-   **CI compatibility**: Run tests in environments where demo features are not available
-   **No code changes**: Keep all demo steps in the feature file without commenting/uncommenting

By default, `SKIP_DEMO_TESTS` is `false`, so demo steps execute normally when not explicitly set.

## Development Workflow

### 1. Initial Development Phase

Write your scenario with all demo steps included from the start:

```gherkin
@demo
Scenario: Demo: My Feature
    When I go to "main" page
    When I announce: "Welcome to the feature demonstration."
    When I highlight element "[data-test='my-button']"
    When I click element with locator "[data-test='my-button']"
    Then the title is "Success"
    When I clear highlight
    When I announce: "Demonstration completed successfully!"
    # REQUIRED: Always end demo with confetti animation
    When I end the demo
```

### 2. `Silent mode` for Debug & Test Phase

Run with `SKIP_DEMO_TESTS=true` to quickly iterate:

```bash
# Fast iteration without narration
export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project=demo --grep "my_demo" --workers=1
```

This skips all `announce`, `highlight`, `clear highlight`, and `end the demo` steps, allowing you to focus on:

-   Selector accuracy
-   Timing issues
-   Test logic flow
-   Assertions

### 3. Final Verification Phase

Run with full demo experience to verify narration and visual effects:

```bash
# Full demo mode with narration and animations (headed by default in demo project)
npx bddgen && npx playwright test --project=demo --grep "my_demo" --workers=1
```

Verify:

-   Text-to-speech announcements are clear and well-timed
-   Element highlights appear on correct elements
-   Transitions are smooth
-   Confetti animation plays at the end

## Pre-run Checklist

1. **Debug run**: Set `SKIP_DEMO_TESTS=true` and run the scenario locally to ensure all selectors, actions, and assertions work correctly without narration:

    ```bash
    export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project=demo --grep "<Scenario name>" --workers=1
    ```

2. **Full demo run**: Run with `SKIP_DEMO_TESTS=false` (or omit the variable) to verify announcements, highlights, and animations work correctly (demo project runs headed by default):

    ```bash
    npx bddgen && npx playwright test --project=demo --grep "<Scenario name>" --workers=1
    ```

3. **Documentation**: When sharing the demo with users, provide both commands:
    - **Silent Mode**: `export SKIP_DEMO_TESTS=true && yarn run test:demo`
    - **Full demo mode**: `npm run test:demo`

## Critical Rules

-   Always set `@demo` tag on the scenario
-   All demo tests must be placed in `packages/syngrisi/e2e/features/DEMO/` folder
-   **MANDATORY**: Every demo scenario MUST end with `When I end the demo` step to trigger the confetti animation and provide visual closure
