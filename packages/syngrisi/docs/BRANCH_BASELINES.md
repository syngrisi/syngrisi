# Branch baselines: main-branch fallback

A baseline's identity includes `branch` (alongside `name`, `viewport`, `browserName`, `os`, `app`).
Without a fallback, a brand-new feature branch starts with **zero accepted baselines**, so the whole
suite lands as `new` / `not_accepted` on its first run — even though visually identical baselines
were already approved on `main`. This feature adds a **read-time fallback**: if no accepted baseline
exists for a check's own branch, and the project has a configured main branch, the check is compared
against the main branch's accepted baseline instead.

## How it works

- Each project (App) may have a `mainBranch` setting (empty by default = feature disabled,
  preserving today's behavior for every existing project).
- When a check is created and no accepted baseline exists for its own branch, the server looks up
  the project's `mainBranch` and retries the accepted-baseline lookup with that branch instead.
- If a fallback baseline is found, the check is **compared** against it — it passes if identical,
  fails with a real diff if not. It is not marked `new` / `not_accepted`.
- If no `mainBranch` is configured, or the main branch itself has no accepted baseline either, the
  check falls back to the original behavior (`new` on first check, `not_accepted` if check history
  exists without a valid baseline).

## Accepting stays branch-scoped

Accepting a check always creates/updates the baseline for the check's **own** branch — the fallback
only affects which baseline a check is compared against at read time. This means:

- Accepting a check on `feature-x` does not touch `main`'s baseline.
- Once a branch has its own accepted baseline, that baseline is used going forward (the exact-branch
  lookup always takes priority over the fallback).

## Configuring the main branch

Set it per project in **Admin → AI → Projects settings** (the "Branch baselines" section) via the
"Main branch" field, or via the API:

```bash
curl -X PATCH "$SYNGRISI_URL/v1/app/<appId>/triage-policy" \
  -H "Content-Type: application/json" \
  -d '{"mainBranch": "main"}'
```

Leave it empty to disable the fallback for a project.

## What is out of scope (deferred)

- Auto-promotion of feature-branch baselines to `main` on merge.
- A per-check UI badge indicating "compared against main's baseline".
- Multi-level fallback chains (only one fallback branch is supported).
