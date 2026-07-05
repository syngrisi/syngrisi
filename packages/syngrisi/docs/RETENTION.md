# Per-project retention (auto-delete old checks)

Over time a busy project accumulates thousands of checks that are no longer interesting once their
run has been triaged. Per-project retention deletes old **checks** automatically on a schedule, on a
day window you set for each project independently. It is **opt-in** and **off by default**, so
existing projects keep every check until you enable it.

## What it does (and does not) remove

- **Removes**: checks in the project older than `retentionDays` days (by `createdDate`), together with
  their now-unreferenced snapshots and image files, exactly like the instance-wide "handle old
  checks" task — but scoped to the one project.
- **Never removes**: baselines. Accepted references are always preserved, so a project whose checks
  have been cleaned still compares correctly on the next run.

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

> Deletion is irreversible. Retention removes checks, not baselines, but the checks (and their diffs)
> are gone — start with a generous window and shorten it once you are comfortable.
