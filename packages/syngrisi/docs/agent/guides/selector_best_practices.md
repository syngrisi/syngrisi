# E2E Locator Selection Guide for Syngrisi

Tests live in `packages/syngrisi/e2e`, UI in `packages/syngrisi/src/ui-app/**`. Keep selectors semantic so Playwright BDD steps stay stable.

## Priority (top → bottom)
1. **ARIA roles with accessible name** — design components to expose them; used by role-based fills/asserts.
2. **Label-based** — `element with label "Project Name"` (primary click/fill step).
3. **Text** — `text "Welcome"` only if no role/label.
4. **data-testid** — `[data-testid='id']` as a last working option.
5. **CSS/XPath** — ❌ avoid (-2 per instance).

Supported roles in steps: `button`, `link`, `heading`, `textbox`, `checkbox`, `combobox`, `navigation`, `menuitem`, `banner`, `listitem`, `list`, `option`, `tab`, `article`, `region`, `status`, `element` (generic locator fallback).

## Gherkin syntax in this framework
```
When I click element with label "Create"
When I click element with locator "[data-testid='delete']"          # fallback
When I fill "John" into element with label "Name"
When I fill "John" into textbox "Name"                              # role-based fill
When I fill "42" into 2nd element with label "Quantity"
Then the button "Save" should be visible
Then the element with label "Email" should be enabled
Then the element with locator "[data-test='user-icon']" should be visible
```

## Fix the component before the test
❌ Bad — clickable div:
```tsx
<div onClick={handleClick}>Create</div>
```
✅ Good — semantic button:
```tsx
<button type="button" onClick={handleClick}>Create</button>
```

## Fast checklist before writing steps
- Interactive elements → `<button>`/`<a>`/`<input>` or `role="button"+tabIndex+Enter/Space`.
- Form controls → connected `<label htmlFor>` or `aria-label`.
- Images → `alt`.
- Icons/ActionIcon → `aria-label`.
- After fixes, prefer `element with label ...` or role-based steps; avoid CSS/XPath.
