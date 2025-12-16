# How to update Syngrisi layout for stable e2e tests

Short guide for adding semantics so Playwright BDD steps use roles/labels instead of CSS. Tests live in `packages/syngrisi/e2e/features`, app in `packages/syngrisi/src/ui-app/**` (admin/auth/shared).

## When you must fix markup
- You need complex CSS/XPath or `text=` to click/type.
- Clickable `div/span` without roles.
- Icons/buttons without visible text or `aria-label`.
- Inputs without a connected `label`.

## What to do (selector priority from e2e/AGENTS.md)
1) Use native elements: `<button>`, `<a>`, `<input>`, `<label>`, `<select>`.  
2) Always provide an accessible name: button text, `aria-label`, `alt` on `img`, `label` + `htmlFor` on inputs.  
3) If you keep `div`/`span`, add `role`, `tabIndex={0}`, and handle Enter/Space.  
4) `data-test` only when role/label/text is unavailable.  
5) After fixes, update steps to semantic locators (`button "…"`, `element with label "…"`) instead of CSS.

## Typical examples
- Action card → button:
```tsx
// before
<div className="card" onClick={handleCreate}>New project</div>
// after
<button type="button" className="card" onClick={handleCreate}>New project</button>
```
- Icon without text:
```tsx
<ActionIcon aria-label="Open settings"><Settings size={18} /></ActionIcon>
```
- Input:
```tsx
<label htmlFor="project-name">Project name</label>
<TextInput id="project-name" {...props} />
```
- Kept `div`:
```tsx
<div
  role="button"
  tabIndex={0}
  aria-label="Open drawer"
  onClick={openDrawer}
  onKeyDown={(e) => ['Enter', ' '].includes(e.key) && (e.preventDefault(), openDrawer())}
/>
```

## Mini process
1. Find the component: `rg "New project" packages/syngrisi/src/ui-app`.
2. Add semantics/labels per rules above.
3. Update step: `When I click button "New project"`.
4. Quick check of the scenario:  
```bash
cd packages/syngrisi/e2e
npm run bddgen && npx playwright test --grep "New project"
```

## Checklist before submit
- [ ] No CSS/XPath clicks in new steps.
- [ ] Interactive elements have role/text/`aria-label`.
- [ ] Inputs connected to a `label`.
- [ ] Keyboard support added if element is non-native.
