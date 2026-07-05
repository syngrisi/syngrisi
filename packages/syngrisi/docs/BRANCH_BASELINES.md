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

Set it per project in **Admin → Settings → Project settings** via the "Main branch" field (enable
the "branch baseline fallback" switch first), or via the API:

```bash
curl -X PATCH "$SYNGRISI_URL/v1/app/<appId>/triage-policy" \
  -H "Content-Type: application/json" \
  -d '{"mainBranch": "main", "branchFallbackEnabled": true}'
```

Leave it empty (or the switch off) to disable the fallback for a project.

## Promoting baselines on merge

The fallback above is a **read-time** convenience — the feature branch never gets its own baseline.
When a feature branch is merged, you usually want its approved baselines to *become* the main
branch's baselines, so main passes against them directly (no fallback needed) and the feature
branch's history is preserved. That is **baseline promotion**: it copies every **accepted** baseline
of a project on a source branch to a target branch (the project's `mainBranch` by default).

Promotion is additive and idempotent — it upserts an accepted baseline for each `{name, viewport,
browserName, os}` ident on the target branch, pointing at the same snapshot. Re-running it changes
nothing. It only ever touches the target branch; the source branch is left as-is.

### From the UI

On the main page, open a run's **⋮** menu and choose **Promote baselines to main**, then confirm.
All accepted baselines on that run's branch(es) are promoted to the project's configured main branch.
A toast reports how many baselines were promoted.

### From CI / the API

Promote in a post-merge CI step so main is ready before the next run:

```bash
# Promote a whole run's branch(es) to the project's main branch
curl -X POST "$SYNGRISI_URL/v1/baselines/promote" \
  -H "apikey: $SYNGRISI_API_KEY" -H "Content-Type: application/json" \
  -d '{"runId": "<runId>"}'

# …or promote an explicit branch → branch for a project
curl -X POST "$SYNGRISI_URL/v1/baselines/promote" \
  -H "apikey: $SYNGRISI_API_KEY" -H "Content-Type: application/json" \
  -d '{"app": "<appId>", "fromBranch": "feature-x", "toBranch": "main"}'
```

The endpoint accepts either `{runId}` (resolves the app + its branch(es) automatically) or
`{app, fromBranch, toBranch?}` (`toBranch` defaults to the project's `mainBranch`). It responds with
`{promoted, fromBranch, toBranch}`.

## What is out of scope (deferred)

- A per-check UI badge indicating "compared against main's baseline".
- Multi-level fallback chains (only one fallback branch is supported).
