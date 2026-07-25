# Retention

Syngrisi has separate retention paths for **checks** and **baselines**. They are independent.

---

# Instance-wide baseline retention (auto-delete old baselines)

Accepted baselines accumulate on every Accept (time-machine history). Compare only needs the
**newest** accepted baseline per check identity
(`name + app + branch + browserName + viewport + os`).

Instance setting `auto_remove_old_baselines` (Admin → Settings) deletes historical accepted
baselines when **both** conditions are true (AND):

1. `createdDate` is older than `days`
2. the baseline is outside the last `keepLast` accepted baselines for its identity
   (sorted newest-first)

**Hard guard:** the newest accepted baseline per identity is **never** deleted, even if
`keepLast` is set to 0 (clamped to ≥ 1 in code and UI).

- **Default:** disabled; `days: 120`, `keepLast: 5`
- **Scope:** only `markedAs: 'accepted'` (legacy unmarked baselines are not touched)
- After a Baseline document is removed, its Snapshot/PNG is deleted only if nothing else
  references it (no remaining Baseline, no Check `baselineId` / `actualSnapshotId` / `diffId`)

Manual dry-run / execute: Admin → Tasks → **Handle old Baselines**, or
`yarn task:old-baselines -- --days 120 --keep-last 5` (add `--remove` to delete).

> Deletion shortens time-machine history. Compare continues to use the latest accepted baseline.

---

# Per-project retention (auto-delete old checks)

Over time a busy project accumulates thousands of checks that are no longer interesting once their
run has been triaged. Per-project retention deletes old **checks** automatically on a schedule, on a
day window you set for each project independently. It is **opt-in** and **off by default**, so
existing projects keep every check until you enable it.

## What it does (and does not) remove

- **Removes**: checks in the project older than `retentionDays` days (by `createdDate`), together with
  their now-unreferenced snapshots and image files, exactly like the instance-wide "handle old
  checks" task — but scoped to the one project.
- **Does not remove baselines** — check retention never deletes Baseline documents. Baseline history
  is controlled separately by `auto_remove_old_baselines` (see above).

This runs *in addition to* the instance-wide `auto_remove_old_checks` task. The instance task applies
its own global day window to every project; per-project retention lets an individual project keep a
**shorter** window than the instance default.

## Enabling it

### From the UI

**Admin → Settings → Project settings**: pick the project, turn on **Enable retention (auto-delete
old checks)**, set **Keep checks for (days)**, and Save.

### From the API

```bash
curl -X PATCH "$SYNGRISI_URL/v1/app/<appId>/triage-policy" \
  -H "Content-Type: application/json" \
  -d '{"retentionEnabled": true, "retentionDays": 30}'
```

Set `retentionEnabled: false` (or `retentionDays: 0`) to turn it off for a project.

## How the schedule works

The cleanup scheduler ticks on the same interval as the instance-wide old-checks task. On each tick,
after the global sweep, it finds every project with `retentionEnabled: true` and `retentionDays > 0`
and removes that project's checks older than its own window. There is nothing to schedule per
project — enabling the switch is enough.

Relevant environment variables (see [environment_variables.md](environment_variables.md)):

- `SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS` — how often the scheduler tick runs.
- `SYNGRISI_AUTO_REMOVE_CHECKS_MIN_INTERVAL_MS` — minimum gap between two actual sweeps.

> Deletion is irreversible. Check retention removes checks (and their diffs), not baselines —
> start with a generous window and shorten it once you are comfortable.
